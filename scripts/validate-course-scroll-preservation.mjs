import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = file => fs.readFileSync(file, 'utf8');
const lesson6 = read('lesson-06.js');
const lesson7 = read('lesson-07.js');

for (const [lesson, source] of [['Lesson 6', lesson6], ['Lesson 7', lesson7]]) {
  assert.match(source, /const IN_PLACE_ACTIONS=new Set\(/, `${lesson} must classify same-step interactions.`);
  assert.match(source, /function captureInteractionAnchor\(button\)/, `${lesson} must capture the selected control position.`);
  assert.match(source, /function restoreInteractionAnchor\(anchor\)/, `${lesson} must restore position after rendering feedback.`);
  assert.match(source, /if\(anchor\)restoreInteractionAnchor\(anchor\);\s*else global\.scrollTo\(0,0\);/, `${lesson} must preserve same-step position and reserve scroll-to-top for navigation.`);
  assert.doesNotMatch(source, /saveSession\(\);render\(\);global\.scrollTo\(0,0\);\s*if\(anchor\)/, `${lesson} must not scroll to the top before restoring an interaction anchor.`);
}

assert.match(read('lesson-06.html'), /id="lessonStage"[^>]*tabindex="-1"/, 'Lesson 6 needs a focus fallback after a disabled answer is re-rendered.');
assert.match(read('lesson-07.html'), /id="lessonStage"[^>]*tabindex="-1"/, 'Lesson 7 needs a focus fallback after a disabled answer is re-rendered.');

const expectedSameStepPatterns = [
  ['Lessons 1–3', read('lesson-engine.js'), /if \(action === 'answer'\) \{[\s\S]*?saveSession\(\);\s*render\(\);\s*}/],
  ['Lesson 4', read('lesson-consonant-contrast.js'), /function answerQuestion\([\s\S]*?saveSession\(\);\s*render\(\);\s*}/],
  ['Lesson 5', read('lesson-05.js'), /action==='practice-answer'[\s\S]*?saveSession\(\);render\(\);return;/],
  ['Lessons 8–10 and 12–13', read('lesson-sprint-engine.js'), /else if\(action==='answer'\)record\(/],
  ['Lesson 11', read('lesson-11-classic-focus.js'), /function record\([\s\S]*?save\(\);render\(\);/]
];

for (const [label, source, pattern] of expectedSameStepPatterns) {
  assert.match(source, pattern, `${label} same-step answer rendering contract changed and needs a scroll regression review.`);
}

assert.match(read('lesson-00.js'), /scrollIntoView\(\{ behavior:'smooth', block:'nearest' \}\)/, 'Lesson 0 detail navigation must remain a nearest-position reveal, not a page-top jump.');

console.log('Validated answer-position preservation across Lesson 0–13 engines; only explicit step navigation resets the page to the top.');
