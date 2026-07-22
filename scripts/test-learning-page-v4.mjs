import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import { buildContentRegistry } from '../content-registry.js';
import { buildStageChapterViewModel, getLearningPrimaryContent } from '../progress-selectors.js';
import { STAGE_CHAPTER_TAXONOMY } from '../stage-chapter-taxonomy.js';
import {
  LEARN_V4_COPY,
  MODULE_ART,
  STAGE_ART,
  buildLearningV4Model,
  lessonState,
  parseLearnLocation,
  resolveInitialStageId
} from '../assets/nikigo-learn-v4.js';

const sandbox = { window:{} };
sandbox.window.window = sandbox.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'), sandbox, { filename:'course-catalog.js' });
const courses = Array.from(sandbox.window.NIKIGO_COURSES);
const contents = buildContentRegistry(courses, { taxonomy:STAGE_CHAPTER_TAXONOMY });
const emptyStorage = { getItem:() => null };
const url = (query = '') => `https://nikigo.local/nikigo-app.html${query}#courses`;
const profile = overrides => ({
  interfaceLanguage:'zh',
  learningLanguage:'zh',
  path:'K0',
  completedLessons:[],
  lessonProgress:{},
  reviewItems:[],
  ...overrides
});

function architecture(user, activeContentId = null) {
  const learningPrimary = getLearningPrimaryContent({
    profile:user,
    contents,
    activeContentId,
    stageId:user.path
  });
  return {
    contents,
    learningPrimary,
    learningSession:activeContentId ? { contentId:activeContentId, position:3 } : null,
    taxonomyView:buildStageChapterViewModel({
      profile:user,
      contents,
      taxonomy:STAGE_CHAPTER_TAXONOMY,
      currentStageId:learningPrimary?.stageId || user.path,
      currentContentId:learningPrimary?.stableId || null
    })
  };
}

function model(user, options = {}) {
  return buildLearningV4Model({
    profile:user,
    courses,
    language:options.language || 'zh',
    architecture:architecture(user,options.activeContentId)
  }, options.url || url(), options.storage || emptyStorage);
}

// Legacy #courses remains valid, with a real zero-progress state defaulting to K0.
let user = profile();
let view = model(user);
assert.equal(view.stageId,'K0');
assert.equal(view.moduleId,null);
assert.equal(view.primary.stableId,'lesson-00');
assert.equal(parseLearnLocation(url()).explicit,false);

// A reliable active session determines the Stage and current Module.
user = profile({ path:'K1', lessonProgress:{'lesson-11':35} });
view = model(user,{activeContentId:'lesson-11'});
assert.equal(view.stageId,'K1');
assert.equal(view.primary.stableId,'lesson-11');
assert.equal(view.stage.chapters.find(chapter => chapter.contents.some(item => item.stableId === 'lesson-11')).chapterId,'k1-identity-and-language-background');

// Explicit URL state is authoritative and a valid Module direct link restores correctly.
view = model(user,{
  activeContentId:'lesson-11',
  url:url('?lang=zh&learnStage=K0&learnModule=k0-batchim-and-sound-changes')
});
assert.equal(view.stageId,'K0');
assert.equal(view.moduleId,'k0-batchim-and-sound-changes');
assert.equal(view.module.chapterId,'k0-batchim-and-sound-changes');

// Invalid URL values never create invented taxonomy identities.
assert.deepEqual(parseLearnLocation(url('?learnStage=K9&learnModule=made-up')), {
  stageId:null,
  moduleId:null,
  explicit:false
});

// Last browsed Stage is used only when neither URL nor a formal recommendation resolves one.
assert.equal(resolveInitialStageId({
  taxonomy:STAGE_CHAPTER_TAXONOMY,
  lastStageId:'K1'
}),'K1');

// Partial K0 completion selects the next real, formally completable lesson.
user = profile({ completedLessons:['lesson-00','lesson-01','lesson-02'] });
view = model(user);
assert.equal(view.primary.stableId,'lesson-03');

// Lesson 6 stays visible and freely enterable, but never becomes the strong formal recommendation.
user = profile({
  completedLessons:['lesson-03','lesson-04','lesson-05'],
  lessonProgress:{'lesson-06':44}
});
view = model(user,{activeContentId:'lesson-06',url:url('?learnStage=K0&learnModule=k0-consonants-syllables-compound-vowels')});
const gated = view.module.contents.find(item => item.stableId === 'lesson-06');
const lessonSixState = lessonState(view,gated,view.primary);
assert.equal(gated.available,true);
assert.equal(gated.formallyCompletable,false);
assert.equal(lessonSixState.key,'gated');
assert.notEqual(view.primary?.stableId,'lesson-06');
assert.equal(view.module.currentVersionProgress.completedCount,3);
assert.equal(view.module.currentVersionProgress.totalCount,4);
assert.equal(view.module.currentVersionProgress.previewPendingCount,1);

// Lesson 6 does not block Lesson 7 or later formally completable recommendations.
user = profile({ completedLessons:['lesson-00','lesson-01','lesson-02','lesson-03','lesson-04','lesson-05'] });
view = model(user);
assert.equal(view.primary.stableId,'lesson-07');

// K1 sessions for Lessons 12 and 13 preserve identity without display-name business logic.
for (const lessonId of ['lesson-12','lesson-13']) {
  user = profile({ path:'K1', lessonProgress:{[lessonId]:21} });
  view = model(user,{activeContentId:lessonId});
  assert.equal(view.stageId,'K1');
  assert.equal(view.primary.stableId,lessonId);
}

// Completing every catalog identity yields no invented primary while preserving all free-entry routes.
user = profile({ path:'K1', completedLessons:contents.map(item => item.stableId) });
view = model(user,{url:url('?learnStage=K1')});
assert.equal(view.primary,null);
assert.equal(contents.length,14);
assert.equal(contents.every(item => item.available),true);
assert.equal(new Set(contents.map(item => item.route)).size,14);
assert.deepEqual(contents.map(item => item.stableId),courses.map(item => item.stableId));

// The approved two-Stage/six-Module artwork and four-language interface copy are complete.
assert.deepEqual(Object.keys(STAGE_ART),['K0','K1']);
assert.deepEqual(Object.keys(MODULE_ART),STAGE_CHAPTER_TAXONOMY.chapters.map(chapter => chapter.chapterId));
for (const language of ['zh','en','vi','ja']) {
  for (const key of ['learning','completed','available','inProgress','gate','continue','start','relearn','back']) {
    assert.ok(LEARN_V4_COPY[language][key]?.length > 0, `${language}.${key} is required`);
  }
}

// Taxonomy membership remains explicit; runtime code cannot infer it from titles or templates.
const source = fs.readFileSync('assets/nikigo-learn-v4.js','utf8');
assert.doesNotMatch(source,/title.*chapterId|chapterId.*title|template.*chapterId|chapterId.*template/);

console.log('Validated Learning Page V4 URL restoration, real-state Stage/Module selection, Lesson 6 gate, 14 free-entry routes, explicit taxonomy artwork, and four-language copy.');
