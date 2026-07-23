import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html = fs.readFileSync('lesson-05.html', 'utf8');
const adapter = fs.readFileSync('lesson-05-classic-focus.js', 'utf8');
const css = fs.readFileSync('lesson-05.css', 'utf8');
const sw = fs.readFileSync('sw.js', 'utf8');
const lessonSource = fs.readFileSync('lesson-05.js', 'utf8');
const sharedShell = fs.readFileSync('assets/classic-focus-shell.js', 'utf8');
const sharedShellCss = fs.readFileSync('assets/classic-focus-shell.css', 'utf8');

const expectedSteps = [
  'intro',
  'block',
  'left-concept',
  'left-examples',
  'left-practice',
  'top-concept',
  'top-examples',
  'top-practice',
  'ieung-concept',
  'ieung-examples',
  'builder',
  'split',
  'challenge',
  'retry',
  'summary',
  'complete'
];

for (const asset of [
  'assets/classic-focus-tokens.css',
  'assets/classic-focus-shell.css',
  'lesson-05.css?v=classic-focus-v1',
  'assets/classic-focus-shell.js',
  'lesson-05-classic-focus.js?v=classic-focus-v1'
]) {
  assert.ok(html.includes(asset), `Lesson 5 must load ${asset}.`);
}
assert.ok(html.indexOf('lesson-05.js?v=classic-focus-v1') < html.indexOf('lesson-05-classic-focus.js?v=classic-focus-v1'));
assert.doesNotMatch(html, /lesson-player\.css/);
assert.doesNotMatch(html, /mission/i);
assert.match(html, /aria-labelledby="progressLabel progressCount"/);
assert.match(html, /id="lessonStage"[^>]+tabindex="-1"/);

assert.match(adapter, /const LESSON_ID = 'lesson-05'/);
assert.match(adapter, /lesson\.SCREENS\.length !== 16/);
assert.match(adapter, /Object\.hasOwn\(STEP_CONTENT_TYPES, stepId\)/);
assert.match(adapter, /NikigoClassicFocusShell\.mount\(\)/);
assert.match(adapter, /audioAvailability: \['left-examples', 'top-examples', 'ieung-examples'\]\.includes\(stepId\) \? 'approved' : 'none'/);
assert.match(adapter, /lesson\.getSession\(\)/);
assert.match(adapter, /global\.scrollTo\(\{ top: previous\.scrollY, behavior: 'auto' \}\)/);
assert.match(adapter, /nextStepId !== previous\.stepId/);
assert.match(adapter, /retryAdvanced/);
assert.doesNotMatch(adapter, /localStorage|sessionStorage|NikigoState|completionPatch|xp\s*[:=]/i);
assert.doesNotMatch(adapter, /speechSynthesis|SpeechSynthesisUtterance|fetch\s*\(|openai/i);
assert.doesNotMatch(adapter, /course title|textContent\.includes|innerText\.includes/i);

const context = {
  window: {},
  document: {
    getElementById() { return null; },
    body: { dataset: {} }
  },
  Node: { TEXT_NODE: 3 },
  MutationObserver: class {},
  URL,
  CSS: { escape: value => value }
};
context.window.window = context.window;
context.window.document = context.document;
context.window.NikigoLesson05 = {
  LESSON_ID: 'lesson-05',
  SCREENS: expectedSteps,
  getSession: () => ({ step: 0 }),
  SPLIT_QUESTIONS: []
};
context.window.NikigoClassicFocusShell = { mount() { return { update() {} }; } };
assert.throws(
  () => vm.runInNewContext(adapter, context, { filename: 'lesson-05-classic-focus.js' }),
  /Cannot read properties|MutationObserver|addEventListener/,
  'The adapter may require DOM bindings after validating its explicit contract.'
);

for (const stepId of expectedSteps) {
  const pattern = new RegExp(`(?:^|\\n)\\s*(?:'${stepId}'|${stepId.replaceAll('-', '\\-')}):\\s*'(?:intro|explanation|structure|word|choice|builder|matching|retry|completion)'`, 'm');
  assert.match(adapter, pattern, `Missing explicit content-type mapping for ${stepId}.`);
}
assert.equal(new Set(expectedSteps).size, 16);

for (const marker of [
  '.classicFocusSyllable .syllableDiagram',
  '.classicFocusSyllable .splitQuestion',
  '.classicFocusSyllable .classicFocusActions',
  '@media (max-width: 767px)',
  '@media (prefers-reduced-motion: reduce)'
]) {
  assert.ok(css.includes(marker), `Missing Lesson 5 Classic Focus CSS marker: ${marker}`);
}
assert.match(css, /min-height:\s*44px/);
assert.match(sharedShell, /CONTENT_TYPES/);
assert.match(sharedShellCss, /focus-visible/);

for (const asset of [
  './lesson-05.html',
  './lesson-05.js?v=classic-focus-v1',
  './lesson-05.css?v=classic-focus-v1',
  './lesson-05-classic-focus.js?v=classic-focus-v1',
  './assets/classic-focus-tokens.css',
  './assets/classic-focus-shell.css',
  './assets/classic-focus-shell.js'
]) {
  assert.ok(sw.includes(`'${asset}'`), `Service Worker must cache ${asset}.`);
}

assert.match(lessonSource, /const SCREENS=\['intro','block','left-concept','left-examples','left-practice','top-concept','top-examples','top-practice','ieung-concept','ieung-examples','builder','split','challenge','retry','summary','complete'\]/);
assert.match(lessonSource, /xp:\(Number\(profile\.xp\)\|\|0\)\+\(first\?50:0\)/);
assert.match(lessonSource, /const SESSION_KEY = `nikigoLessonSession:\$\{LESSON_ID\}`/);

console.log('Validated Lesson 5 Classic Focus: 16 explicit steps, presentation-only adapter, local Diagram/Split renderers, shared shell, audio states, scroll contract, and offline resources.');
