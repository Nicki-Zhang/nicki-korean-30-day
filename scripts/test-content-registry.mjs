import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

import {
  buildContentRegistry,
  validateContentRegistryParity
} from '../content-registry.js';
import {
  buildAudioReadinessIndex,
  AUDIO_READINESS_COPY
} from '../audio-readiness.js';
import {
  validateContentTypeMap
} from '../content-type-map.js';
import {
  getAppRoute,
  resolveAppRoute,
  resolveContentRoute,
  validateRouteCompatibility
} from '../route-registry.js';
import { STAGE_CHAPTER_TAXONOMY } from '../stage-chapter-taxonomy.js';

function loadCatalog() {
  const context = { window:{} };
  context.window.window = context.window;
  vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), context, { filename:'course-catalog.js' });
  return context.window.NIKIGO_COURSES;
}

function loadAudio() {
  const context = {};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('audio-catalog.js', 'utf8'), context, { filename:'audio-catalog.js' });
  return context.NikigoAudio;
}

const courses = loadCatalog();
const audio = loadAudio();
const catalogBefore = JSON.stringify(courses);
const audioIndex = buildAudioReadinessIndex(courses, audio);
const registry = buildContentRegistry(courses, { audioReadinessByContent:audioIndex });
const taxonomyRegistry = buildContentRegistry(courses, {
  audioReadinessByContent:audioIndex,
  taxonomy:STAGE_CHAPTER_TAXONOMY
});

assert.equal(registry.length, 14);
assert.deepEqual(registry.map(content => content.stableId), Array.from(courses, course => course.stableId));
assert.deepEqual(registry.map(content => content.displayOrder), Array.from(courses, course => course.displayOrder));
assert.deepEqual(registry.map(content => content.displayNumber), Array.from(courses, course => course.displayNumber));
assert.deepEqual(registry.map(content => content.route), Array.from(courses, course => course.file));
assert.equal(validateContentRegistryParity(courses, registry).valid, true);
assert.equal(validateContentTypeMap(courses.map(course => course.stableId)).valid, true);
assert.equal(JSON.stringify(courses), catalogBefore, 'Adapters must not mutate the existing catalog.');
assert.equal(taxonomyRegistry.every(content => Boolean(content.chapterId)), true);

for (const [index, content] of registry.entries()) {
  const course = courses[index];
  assert.equal(content.available, true, `${content.stableId} must remain freely enterable.`);
  assert.equal(resolveContentRoute(content), course.file);
  assert.equal(content.accessStatus, 'available');
  assert.equal(content.chapterId, null);
  assert.deepEqual([...content.skillTags], []);
  assert.equal(content.audioStatus, content.audioReadiness);
  for (const language of ['zh', 'en', 'vi', 'ja']) {
    assert.equal(content.title[language], course.title[language]);
    assert.equal(content.summary[language], course.parts[language]);
  }
}

const lesson6 = registry.find(content => content.stableId === 'lesson-06');
assert.equal(lesson6.available, true, 'Lesson 6 must remain freely enterable.');
assert.equal(lesson6.formallyCompletable, false, 'Lesson 6 cannot be formally completed while its audio gate is closed.');
assert.equal(lesson6.audioReadiness.completionGate, 'required-audio');
assert.equal(lesson6.audioReadiness.required, 15);
assert.equal(lesson6.audioReadiness.playable, 0);
assert.equal(lesson6.audioReadiness.pending, 15);
assert.equal(lesson6.audioReadiness.gateOpen, false);
assert.equal(lesson6.audioReadiness.labelKey, 'audio.previewOnly');

assert.equal(Object.keys(audio.approvedAssetHashes).length, 54);
assert.equal(registry.find(content => content.stableId === 'lesson-04').audioReadiness.playable, 14);
assert.equal(registry.find(content => content.stableId === 'lesson-07').audioReadiness.playable, 0);

assert.equal(validateRouteCompatibility().valid, true);
assert.equal(getAppRoute('#courses').id, 'learn');
assert.equal(getAppRoute('#dashboard').id, 'home');
assert.equal(getAppRoute('#progress').id, 'progress');
assert.equal(getAppRoute('#profile').id, 'me');
assert.equal(getAppRoute('#practice').id, 'practice');
assert.equal(resolveAppRoute('practice'), 'nikigo-app.html#practice');
assert.equal(resolveAppRoute('review'), 'review.html');
assert.equal(resolveAppRoute('#courses'), 'nikigo-app.html#courses');
assert.equal(resolveAppRoute('learn', { language:'vi' }), 'nikigo-app.html?lang=vi#courses');
assert.equal(resolveContentRoute(registry[11], { language:'ja' }), 'lesson-11.html?lang=ja');

const audioCopyKeys = Object.keys(AUDIO_READINESS_COPY.en);
for (const language of ['zh', 'en', 'vi', 'ja']) {
  assert.deepEqual(Object.keys(AUDIO_READINESS_COPY[language]), audioCopyKeys);
  for (const key of audioCopyKeys) assert.ok(AUDIO_READINESS_COPY[language][key].trim(), `${language}:${key} is missing.`);
}

console.log('Validated 14-course content registry, explicit content types, exact route parity, legacy route aliases, four-language audio keys, free access, and the Lesson 6 audio gate.');
