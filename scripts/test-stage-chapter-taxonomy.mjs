import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import { buildContentRegistry } from '../content-registry.js';
import { buildStageChapterViewModel, getRecommendedNextContent } from '../progress-selectors.js';
import {
  STAGE_CHAPTER_TAXONOMY,
  TAXONOMY_VERSION,
  validateStageChapterTaxonomy
} from '../stage-chapter-taxonomy.js';

const context = { window:{} };
context.window.window = context.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), context, { filename:'course-catalog.js' });
const courses = context.window.NIKIGO_COURSES;
const stableIds = Array.from(courses, course => course.stableId);
const registry = buildContentRegistry(courses, { taxonomy:STAGE_CHAPTER_TAXONOMY });

assert.equal(TAXONOMY_VERSION, 'nikigo-taxonomy-v1');
assert.equal(validateStageChapterTaxonomy(stableIds).valid, true);
assert.equal(STAGE_CHAPTER_TAXONOMY.stages.length, 2);
assert.equal(STAGE_CHAPTER_TAXONOMY.chapters.length, 6);
assert.deepEqual(STAGE_CHAPTER_TAXONOMY.chapters.map(chapter => chapter.chapterId), [
  'k0-hangul-map-and-vowels',
  'k0-consonants-syllables-compound-vowels',
  'k0-batchim-and-sound-changes',
  'k0-integrated-use-and-checkpoint',
  'k1-identity-and-language-background',
  'k1-numbers-and-quantities'
]);
assert.deepEqual(STAGE_CHAPTER_TAXONOMY.chapters.map(chapter => [...chapter.contentIds]), [
  ['lesson-00', 'lesson-01', 'lesson-02'],
  ['lesson-03', 'lesson-04', 'lesson-05', 'lesson-06'],
  ['lesson-07', 'lesson-08'],
  ['lesson-09', 'lesson-10'],
  ['lesson-11', 'lesson-12'],
  ['lesson-13']
]);

for (const stage of STAGE_CHAPTER_TAXONOMY.stages) {
  for (const language of ['zh', 'en', 'vi', 'ja']) {
    assert.ok(stage.name[language]);
    assert.ok(stage.label[language]);
    assert.ok(stage.objective[language]);
  }
}
for (const chapter of STAGE_CHAPTER_TAXONOMY.chapters) {
  for (const language of ['zh', 'en', 'vi', 'ja']) {
    assert.ok(chapter.name[language]);
    assert.ok(chapter.objective[language]);
  }
}

assert.equal(registry.length, 14);
assert.equal(registry.every(content => content.available), true);
assert.deepEqual(registry.map(content => content.stableId), stableIds);
assert.deepEqual(registry.map(content => content.displayOrder), Array.from(courses, course => course.displayOrder));
assert.deepEqual(registry.map(content => content.displayNumber), Array.from(courses, course => course.displayNumber));
assert.deepEqual(registry.map(content => content.route), Array.from(courses, course => course.file));
assert.equal(registry.every(content => content.chapterId === STAGE_CHAPTER_TAXONOMY.lessonMap[content.stableId].chapterId), true);

const lesson6Profile = {
  interfaceLanguage:'zh',
  learningLanguage:'zh',
  path:'K0',
  completedLessons:['lesson-03', 'lesson-04', 'lesson-05'],
  lessonProgress:{}
};
let view = buildStageChapterViewModel({
  profile:lesson6Profile,
  contents:registry,
  taxonomy:STAGE_CHAPTER_TAXONOMY,
  currentStageId:'K0',
  currentContentId:'lesson-06'
});
let module = view.stages[0].chapters[1];
assert.equal(module.currentVersionProgress.completedCount, 3);
assert.equal(module.currentVersionProgress.totalCount, 4);
assert.equal(module.currentVersionProgress.status, 'available-content-complete');
assert.equal(module.currentVersionProgress.currentCompletableContentComplete, true);
assert.equal(module.currentVersionProgress.previewPendingCount, 1);
assert.equal(module.currentVersionProgress.formallyComplete, false);

const pathProfile = {
  ...lesson6Profile,
  completedLessons:['lesson-00', 'lesson-01', 'lesson-02', 'lesson-03', 'lesson-04', 'lesson-05']
};
assert.equal(getRecommendedNextContent(pathProfile, registry, 'K0').stableId, 'lesson-07');

const gateOpenRegistry = registry.map(content => content.stableId === 'lesson-06'
  ? Object.freeze({ ...content, formallyCompletable:true })
  : content);
view = buildStageChapterViewModel({
  profile:{ ...pathProfile, completedLessons:[...pathProfile.completedLessons, 'lesson-06'] },
  contents:gateOpenRegistry,
  taxonomy:STAGE_CHAPTER_TAXONOMY,
  currentStageId:'K0',
  currentContentId:'lesson-06'
});
module = view.stages[0].chapters[1];
assert.equal(module.currentVersionProgress.completedCount, 4);
assert.equal(module.currentVersionProgress.status, 'complete');
assert.equal(module.currentVersionProgress.formallyComplete, true);
assert.equal(module.currentVersionProgress.previewPendingCount, 0);

const historicalProfile = {
  ...lesson6Profile,
  taxonomyCompletions:{
    'k0-hangul-map-and-vowels':{
      historicalCompletion:true,
      historicalCompletedAt:'2026-07-01T00:00:00.000Z',
      contentIds:['lesson-00', 'lesson-01']
    }
  }
};
view = buildStageChapterViewModel({
  profile:historicalProfile,
  contents:registry,
  taxonomy:STAGE_CHAPTER_TAXONOMY,
  currentStageId:'K0'
});
module = view.stages[0].chapters[0];
assert.equal(module.taxonomyVersion, TAXONOMY_VERSION);
assert.equal(module.historicalCompletion, true);
assert.equal(module.historicalCompletedAt, '2026-07-01T00:00:00.000Z');
assert.equal(module.newContentAvailable, true);
assert.ok(module.currentVersionProgress);

const taxonomySource = fs.readFileSync('stage-chapter-taxonomy.js', 'utf8');
assert.doesNotMatch(taxonomySource, /course\.title|lesson\.title|template.*chapterId|chapterId.*template/);

console.log('Validated approved six-chapter taxonomy, four-language copy, 14 free routes, versioned module progress, Lesson 6 3/4 gate display, and Lesson 7 recommendation continuity.');
