import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(file, 'utf8');
const shellSource = read('assets/classic-focus-shell.js');
const tokens = read('assets/classic-focus-tokens.css');
const shellCss = read('assets/classic-focus-shell.css');
const lesson7Html = read('lesson-07.html');
const lesson11Html = read('lesson-11.html');
const lesson7 = read('lesson-07.js');
const lesson11 = read('lesson-11-classic-focus.js');
const worker = read('sw.js');

for (const html of [lesson7Html, lesson11Html]) {
  for (const asset of ['assets/classic-focus-tokens.css', 'assets/classic-focus-shell.css', 'assets/classic-focus-shell.js']) {
    assert.ok(html.includes(asset), `Shared Core consumer missing ${asset}`);
  }
  assert.match(html, /classicFocusShell/);
  assert.match(html, /classicFocusCard/);
}
assert.match(lesson7Html, /classicFocusFoundation/);
assert.match(lesson11Html, /classicFocusScenario/);

for (const asset of ['./assets/classic-focus-tokens.css', './assets/classic-focus-shell.css', './assets/classic-focus-shell.js']) {
  assert.ok(worker.includes(asset), `Service Worker missing ${asset}`);
}

for (const marker of [
  '--classic-brand: #6d4aff',
  '--classic-success: #237c58',
  '--classic-error: #a83b50',
  '--classic-fast: 140ms',
  '--classic-base: 240ms'
]) assert.ok(tokens.includes(marker), `Shared token missing ${marker}`);

for (const marker of [
  '.classicFocusShell .top',
  '.classicFocusShell .progressWrap',
  '.classicFocusShell .classicFocusCard',
  '.classicFocusShell .classicFocusActions',
  '.classicFocusShell .classicFocusFeedback',
  '.classicFocusFoundation .languagePicker select { min-width: 116px; }',
  'font-size: 14px',
  'min-height: 44px',
  '@media (max-width: 767px)',
  '@media (prefers-reduced-motion: reduce)'
]) assert.ok(shellCss.includes(marker), `Shared shell style missing ${marker}`);

for (const forbidden of [
  'NikigoState',
  'localStorage',
  'SESSION_KEY',
  'completedLessons',
  'reviewItems',
  'lesson-06',
  'correctAnswer',
  'speechSynthesis',
  'fetch('
]) assert.ok(!shellSource.includes(forbidden), `Shared Core contains forbidden business marker ${forbidden}`);

const listeners = new Map();
function element() {
  return {
    value: '',
    textContent: '',
    title: '',
    style: {},
    dataset: {},
    attributes: {},
    setAttribute(name, value) { this.attributes[name] = String(value); },
    addEventListener(name, callback) { listeners.set(`${this.id}:${name}`, callback); },
    removeEventListener() {}
  };
}
const ids = ['language', 'lessonName', 'progressLabel', 'progressCount', 'progressTrack', 'progressBar', 'courseNavigation', 'languageLabel', 'homeLogo', 'homeButton', 'skipLink', 'lessonStage'];
const elements = new Map(ids.map(id => {
  const node = element();
  node.id = id;
  return [id, node];
}));
const document = {
  documentElement: { lang: '' },
  body: { dataset: {} },
  querySelector(selector) {
    if (selector === '#progressTrack i') return elements.get('progressBar');
    return elements.get(selector.replace('#', '')) || null;
  }
};
const context = { window: {}, document, TypeError };
context.window.window = context.window;
vm.runInNewContext(shellSource, context, { filename: 'assets/classic-focus-shell.js' });
const api = context.window.NikigoClassicFocusShell;
assert.ok(api);
assert.deepEqual(Array.from(api.requiredFields), [
  'lessonId', 'currentStep', 'totalSteps', 'language', 'title', 'stepLabel', 'progress',
  'canGoPrevious', 'canGoNext', 'audioAvailability', 'contentType'
]);
assert.deepEqual(Array.from(api.contentTypes), [
  'intro', 'explanation', 'structure', 'word', 'comparison', 'dialogue', 'choice',
  'matching', 'builder', 'feedback', 'retry', 'completion'
]);
assert.throws(() => api.assertViewModel({}), /missing lessonId/);
assert.throws(() => api.assertViewModel({
  lessonId: 'lesson-07', currentStep: 1, totalSteps: 13, language: 'zh', title: 'x',
  stepLabel: 'x', progress: 0, canGoPrevious: false, canGoNext: true,
  audioAvailability: 'mixed', contentType: 'guessed-title'
}), /Unsupported contentType/);

let changedLanguage = null;
const shell = api.mount({ onLanguageChange: value => { changedLanguage = value; } });
shell.update({
  lessonId: 'lesson-07',
  currentStep: 3,
  totalSteps: 13,
  language: 'vi',
  title: 'Bài 7 · Batchim cơ bản',
  stepLabel: 'Tiến độ bài học',
  progress: 17,
  canGoPrevious: true,
  canGoNext: false,
  audioAvailability: 'mixed',
  contentType: 'word',
  navigationLabel: 'Điều hướng bài học',
  languageLabel: 'Ngôn ngữ giao diện',
  brandActionLabel: 'Về trang khóa học',
  exitActionLabel: 'Về trang khóa học',
  skipLabel: 'Chuyển đến nhiệm vụ học hiện tại'
});
assert.equal(document.documentElement.lang, 'vi');
assert.equal(document.body.dataset.lessonId, 'lesson-07');
assert.equal(document.body.dataset.contentType, 'word');
assert.equal(elements.get('progressCount').textContent, '3 / 13');
assert.equal(elements.get('progressBar').style.width, '17%');
assert.equal(elements.get('lessonStage').dataset.canGoNext, 'false');
listeners.get('language:change')({ target: { value: 'ja' } });
assert.equal(changedLanguage, 'ja');

for (const source of [lesson7, lesson11]) {
  assert.match(source, /NikigoClassicFocusShell\.mount/);
  assert.match(source, /shell\.update\(\{/);
  for (const field of api.requiredFields) assert.ok(source.includes(`${field}:`) || source.includes(`${field},`), `Adapter missing explicit ${field}`);
}
assert.match(lesson7, /audioAvailability:'mixed'/);
assert.match(lesson11, /audioAvailabilityFor\(step\)/);
assert.doesNotMatch(shellSource, /title\.includes|textContent.*contentType|innerText.*contentType/);

console.log('Validated Classic Focus Shared Core: explicit adapter contract, presentation-only boundary, dual-lesson loading, responsive/a11y shell, and offline resources.');
