import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import { buildContentRegistry } from '../content-registry.js';
import { buildAudioReadinessIndex } from '../audio-readiness.js';
import {
  RECOMMENDATION_COPY,
  selectHomeRecommendation,
  validateRecommendationCopy
} from '../recommendation-policy.js';

function loadRuntimeCatalogs() {
  const courseContext = { window:{} };
  courseContext.window.window = courseContext.window;
  vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), courseContext, { filename:'course-catalog.js' });
  const audioContext = {};
  vm.createContext(audioContext);
  vm.runInContext(fs.readFileSync('audio-catalog.js', 'utf8'), audioContext, { filename:'audio-catalog.js' });
  return { courses:courseContext.window.NIKIGO_COURSES, audio:audioContext.NikigoAudio };
}

const { courses, audio } = loadRuntimeCatalogs();
const contents = buildContentRegistry(courses, {
  audioReadinessByContent:buildAudioReadinessIndex(courses, audio)
});
const configured = overrides => ({
  interfaceLanguage:'zh',
  learningLanguage:'zh',
  path:'K0',
  completedLessons:[],
  lessonProgress:{},
  reviewItems:[],
  ...overrides
});
const dueItem = (id, lessonId) => ({
  id,
  lessonId,
  status:'active',
  dueAt:'2026-01-01T00:00:00.000Z'
});

// 1. Fresh users must complete required setup first.
let result = selectHomeRecommendation({ profile:{} , contents, now:Date.parse('2026-07-22T00:00:00Z') });
assert.equal(result.primaryAction.kind, 'required-setup');
assert.equal(result.primaryAction.metadata.setupStep, 'language');
result = selectHomeRecommendation({ profile:configured({ path:'' }), contents });
assert.equal(result.primaryAction.kind, 'required-setup');
assert.equal(result.primaryAction.metadata.setupStep, 'starting-point');

// 2. An explicit, resumable current session outranks due review.
const activeProfile = configured({
  lessonProgress:{ 'lesson-03':42 },
  reviewItems:[dueItem('lesson01:vowels', 'lesson-01')]
});
result = selectHomeRecommendation({
  profile:activeProfile,
  contents,
  currentSession:{ contentId:'lesson-03', resumable:true, isCurrent:true },
  now:Date.parse('2026-07-22T00:00:00Z')
});
assert.equal(result.primaryAction.kind, 'resume-active');
assert.equal(result.primaryAction.contentId, 'lesson-03');
assert.equal(result.primaryAction.metadata.activeSource, 'current-session');

// A current resumable session is sufficient even before the percentage rises above zero.
result = selectHomeRecommendation({
  profile:configured({ reviewItems:[dueItem('lesson01:vowels', 'lesson-01')] }),
  contents,
  currentSession:{ contentId:'lesson-02', resumable:true, isCurrent:true },
  now:Date.parse('2026-07-22T00:00:00Z')
});
assert.equal(result.primaryAction.kind, 'resume-active');
assert.equal(result.primaryAction.contentId, 'lesson-02');

// A unique trustworthy lastActivityAt is also a reliable active signal.
result = selectHomeRecommendation({
  profile:configured({ lessonProgress:{ 'lesson-01':30, 'lesson-02':40 } }),
  contents,
  trustedLastActivityByContent:{ 'lesson-01':'2026-07-20T10:00:00Z', 'lesson-02':'2026-07-21T10:00:00Z' }
});
assert.equal(result.primaryAction.kind, 'resume-active');
assert.equal(result.primaryAction.contentId, 'lesson-02');
assert.equal(result.primaryAction.metadata.activeSource, 'last-activity-at');

result = selectHomeRecommendation({
  profile:configured({ lessonProgress:{ 'lesson-01':30, 'lesson-02':40 } }),
  contents,
  reliableRecentContentId:'lesson-01'
});
assert.equal(result.primaryAction.kind, 'resume-active');
assert.equal(result.primaryAction.contentId, 'lesson-01');
assert.equal(result.primaryAction.metadata.activeSource, 'reliable-recent-content');

// 3. Due review is primary when there is no reliably active course.
result = selectHomeRecommendation({
  profile:configured({ reviewItems:[dueItem('lesson02:words', 'lesson-02')] }),
  contents,
  now:Date.parse('2026-07-22T00:00:00Z')
});
assert.equal(result.primaryAction.kind, 'due-review');
assert.equal(result.primaryAction.metadata.dueCount, 1);

// 4. Multiple historical unfinished courses do not trigger guessed ranking.
result = selectHomeRecommendation({
  profile:configured({
    lessonProgress:{ 'lesson-01':90, 'lesson-02':10 },
    reviewItems:[dueItem('lesson03:greeting', 'lesson-03')]
  }),
  contents,
  now:Date.parse('2026-07-22T00:00:00Z')
});
assert.equal(result.primaryAction.kind, 'due-review');
assert.deepEqual([...result.secondary.inProgressContentIds], ['lesson-01', 'lesson-02']);

// Equal latest timestamps are ambiguous and must not pick either course.
result = selectHomeRecommendation({
  profile:configured({
    lessonProgress:{ 'lesson-01':90, 'lesson-02':10 },
    reviewItems:[dueItem('lesson03:greeting', 'lesson-03')]
  }),
  contents,
  trustedLastActivityByContent:{ 'lesson-01':'2026-07-21T10:00:00Z', 'lesson-02':'2026-07-21T10:00:00Z' },
  now:Date.parse('2026-07-22T00:00:00Z')
});
assert.equal(result.primaryAction.kind, 'due-review');

// 5. With no active course or due review, recommend the next available course.
result = selectHomeRecommendation({ profile:configured({}), contents });
assert.equal(result.primaryAction.kind, 'recommended-next');
assert.equal(result.primaryAction.contentId, 'lesson-00');

// 6. A stage is complete when all formally completable available content is complete.
const completableK0 = contents
  .filter(content => content.stageId === 'K0' && content.available && content.formallyCompletable)
  .map(content => content.stableId);
result = selectHomeRecommendation({ profile:configured({ completedLessons:completableK0 }), contents });
assert.equal(result.primaryAction.kind, 'stage-complete');

// 7. If the configured path has no released content, return free choice.
result = selectHomeRecommendation({ profile:configured({ path:'K4' }), contents });
assert.equal(result.primaryAction.kind, 'free-choice');
assert.equal(result.primaryAction.route, 'nikigo-app.html?lang=zh#courses');

// 8. Lesson 6 is skipped as a formal next course while its audio gate is closed.
result = selectHomeRecommendation({
  profile:configured({ completedLessons:['lesson-00','lesson-01','lesson-02','lesson-03','lesson-04','lesson-05'] }),
  contents
});
assert.equal(result.primaryAction.kind, 'recommended-next');
assert.equal(result.primaryAction.contentId, 'lesson-07');
assert.notEqual(result.primaryAction.contentId, 'lesson-06');

// A reliable active Lesson 6 session may be resumed only as an explicit preview.
result = selectHomeRecommendation({
  profile:configured({ lessonProgress:{ 'lesson-06':50 } }),
  contents,
  currentSession:{ contentId:'lesson-06', resumable:true, isCurrent:true }
});
assert.equal(result.primaryAction.kind, 'resume-active');
assert.equal(result.primaryAction.contentId, 'lesson-06');
assert.equal(result.primaryAction.previewOnly, true);
assert.equal(result.primaryAction.labelKey, 'recommendation.resumePreview');

// 9. Recommendation never changes the 14-course free-entry contract.
assert.equal(contents.filter(content => content.available).length, 14);

// 12. New recommendation copy keys must exist in all four languages.
assert.equal(validateRecommendationCopy().valid, true);
const copyKeys = Object.keys(RECOMMENDATION_COPY.en);
for (const language of ['zh', 'en', 'vi', 'ja']) {
  assert.deepEqual(Object.keys(RECOMMENDATION_COPY[language]), copyKeys);
}

for (const scenario of [result]) {
  assert.ok(scenario.primaryAction);
  assert.equal(Array.isArray(scenario.primaryAction), false);
}

console.log('Validated required setup, reliable active-course evidence, due-review priority, ambiguous history, next course, stage completion, free choice, Lesson 6 preview gating, and one primary action.');
