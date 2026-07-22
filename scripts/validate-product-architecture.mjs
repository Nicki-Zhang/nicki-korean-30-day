import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

import { buildContentRegistry, validateContentRegistryParity } from '../content-registry.js';
import { buildAudioReadinessIndex } from '../audio-readiness.js';
import { validateContentTypeMap } from '../content-type-map.js';
import { validateRecommendationCopy } from '../recommendation-policy.js';
import { validateRouteCompatibility } from '../route-registry.js';

const protectedHashes = Object.freeze({
  'app-state.js': 'aa4ad0b06782ae58466a8f49bc3020ea0d6b25d1ec209ca25d26005c7bee6c1e',
  'course-catalog.js': '63d0c4353883ee560e3f08775570e4d5092a6d95ea0653b358a67a90ab49b730',
  'audio-catalog.js': '107ddd9abac3824ad735de633763adbdac7b82bedbb5b97ea434741cc695fb7f'
});
for (const [file, expected] of Object.entries(protectedHashes)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert.equal(actual, expected, `${file} changed during the protected architecture phase.`);
}

const courseContext = { window:{} };
courseContext.window.window = courseContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), courseContext, { filename:'course-catalog.js' });
const audioContext = {};
vm.createContext(audioContext);
vm.runInContext(fs.readFileSync('audio-catalog.js', 'utf8'), audioContext, { filename:'audio-catalog.js' });

const courses = courseContext.window.NIKIGO_COURSES;
const audio = audioContext.NikigoAudio;
const registry = buildContentRegistry(courses, {
  audioReadinessByContent:buildAudioReadinessIndex(courses, audio)
});

assert.equal(courses.length, 14);
assert.equal(registry.length, 14);
assert.equal(validateContentRegistryParity(courses, registry).valid, true);
assert.equal(validateContentTypeMap(courses.map(course => course.stableId)).valid, true);
assert.equal(validateRecommendationCopy().valid, true);
assert.equal(validateRouteCompatibility().valid, true);
assert.equal(Object.keys(audio.approvedAssetHashes).length, 54);
assert.equal(registry.every(content => content.available), true);
assert.equal(registry.find(content => content.stableId === 'lesson-06').formallyCompletable, false);

const pureModules = [
  'content-registry.js',
  'content-type-map.js',
  'route-registry.js',
  'recommendation-policy.js',
  'progress-selectors.js',
  'audio-readiness.js'
];
for (const file of pureModules) {
  const source = fs.readFileSync(file, 'utf8');
  for (const forbidden of ['localStorage', 'sessionStorage', 'document.', 'window.', 'fetch(']) {
    assert.equal(source.includes(forbidden), false, `${file} must remain pure and cannot use ${forbidden}`);
  }
}

console.log('Validated Stage 3B.1 architecture purity, protected file hashes, 14-course parity, 54 approved audio hashes, route compatibility, language keys, free access, and Lesson 6 gating.');
