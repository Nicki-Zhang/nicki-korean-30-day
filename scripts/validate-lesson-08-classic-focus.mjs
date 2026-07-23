import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(file, 'utf8');
const html = read('lesson-08.html');
const configSource = read('lesson-08.js');
const adapterSource = read('lesson-08-classic-focus.js');
const adapterCss = read('lesson-08-classic-focus.css');
const engineSource = read('lesson-sprint-engine.js');
const worker = read('sw.js');

for (const asset of [
  'assets/classic-focus-tokens.css',
  'assets/classic-focus-shell.css',
  'assets/classic-focus-shell.js',
  'lesson-08-classic-focus.css',
  'lesson-08-classic-focus.js',
  'lesson-sprint-engine.js'
]) assert.ok(html.includes(asset), `Lesson 8 is missing ${asset}.`);
assert.doesNotMatch(html, /lesson-sprint\.css/, 'Lesson 8 must not load the legacy Sprint shell stylesheet.');
assert.match(html, /classicFocusShell classicFocusFoundation classicFocusSprint/);
assert.match(html, /id="lessonStage"[^>]*tabindex="-1"/);

const configContext = { window: {} };
configContext.window.window = configContext.window;
vm.runInNewContext(configSource, configContext, { filename:'lesson-08.js' });
const config = configContext.window.NikigoLessonConfig;
assert.equal(config.id, 'lesson-08');
assert.equal(config.steps.length, 15);
assert.equal(new Set(config.steps.map(step => step.id)).size, 15);
assert.equal(config.steps.reduce((count, step) => count + Number(Boolean(step.audio)) + (step.audios?.length || 0), 0), 0);

for (const forbidden of [
  'NikigoState',
  'localStorage',
  'completionPatch',
  'completedLessons',
  'reviewItems',
  'retryQueue',
  '.answers',
  'correct:',
  'speechSynthesis',
  'fetch('
]) assert.ok(!adapterSource.includes(forbidden), `Presentation adapter contains forbidden business marker ${forbidden}.`);
assert.match(adapterSource, /const STEP_CONTENT_TYPES = Object\.freeze\(\{/);
assert.match(adapterSource, /const STEP_TYPES = Object\.freeze\(\{/);
assert.match(adapterSource, /audioAvailability: 'none'/);
assert.match(adapterSource, /learnStage=K0&learnModule=k0-batchim-and-sound-changes#courses/);
assert.match(adapterSource, /global\.scrollTo\(0, 0\)/);
assert.match(adapterSource, /stage\.focus\(\{ preventScroll:true \}\)/);
assert.doesNotMatch(adapterSource, /title\.includes|textContent.*contentType|innerText.*contentType/);

const stageListeners = new Map();
const stage = {
  dataset:{},
  focusCalls:0,
  querySelectorAll(){ return []; },
  addEventListener(name, listener, capture){ stageListeners.set(`${name}:${capture}`, listener); },
  focus(options){ this.focusCalls += 1; this.focusOptions = options; }
};
let lastViewModel = null;
const body = { dataset:{} };
const document = {
  body,
  getElementById(id){ return id === 'lessonStage' ? stage : null; }
};
const window = {
  window:null,
  document,
  NikigoLessonConfig:config,
  NikigoClassicFocusShell:{ mount:() => ({ update:viewModel => { lastViewModel = viewModel; } }) },
  scrollCalls:0,
  scrollTo(){ this.scrollCalls += 1; },
  pendingInteractions:[],
  setTimeout(callback){ this.pendingInteractions.push(callback); },
  addEventListener(){}
};
window.window = window;
const context = { window, document, Object, Error };
vm.runInNewContext(adapterSource, context, { filename:'lesson-08-classic-focus.js' });
const adapter = window.NikigoSprintClassicFocusAdapter;
assert.equal(adapter.lessonId, 'lesson-08');
assert.equal(JSON.stringify(Object.keys(adapter.stepContentTypes)), JSON.stringify(config.steps.map(step => step.id)));

adapter.update({
  lessonId:'lesson-08', stepId:'group-match', stepType:'match',
  currentStep:4, totalSteps:15, language:'vi', title:'Bài 8', stepLabel:'Tiến độ',
  progress:21.4, canGoPrevious:true, canGoNext:false
});
assert.equal(lastViewModel.contentType, 'matching');
assert.equal(lastViewModel.audioAvailability, 'none');
assert.equal(document.body.dataset.stepId, 'group-match');

const clickListener = stageListeners.get('click:true');
assert.ok(clickListener, 'Adapter must observe explicit navigation actions.');
clickListener({ target:{ closest:() => ({ dataset:{ action:'next' } }) } });
adapter.update({
  lessonId:'lesson-08', stepId:'group-choice', stepType:'choice',
  currentStep:5, totalSteps:15, language:'vi', title:'Bài 8', stepLabel:'Tiến độ',
  progress:28.6, canGoPrevious:true, canGoNext:false
});
window.pendingInteractions.shift()();
assert.equal(window.scrollCalls, 1, 'A real step change must return to the new task start.');
assert.equal(stage.focusCalls, 1);
assert.equal(stage.focusOptions.preventScroll, true);

clickListener({ target:{ closest:() => ({ dataset:{ action:'next' } }) } });
window.pendingInteractions.shift()();
assert.equal(window.scrollCalls, 1, 'An action that stays on the same step must not force a page-top jump.');

assert.match(engineSource, /NikigoSprintClassicFocusAdapter\?\.update\?\.\(\{/);
assert.match(engineSource, /stepId:step\.id/);
assert.match(engineSource, /stepType:step\.type/);
assert.match(engineSource, /NikigoSprintClassicFocusAdapter\?\.afterRender\?\.\(\)/);
assert.match(adapterCss, /min-height: 48px/);
assert.match(adapterCss, /@media \(prefers-reduced-motion: reduce\)/);
for (const asset of ['./lesson-08-classic-focus.js', './lesson-08-classic-focus.css']) {
  assert.ok(worker.includes(asset), `Service Worker is missing ${asset}.`);
}

console.log('Validated Lesson 8 Classic Focus: 15 explicit steps, presentation-only adapter, no audio UI, shared shell, and tolerant scroll contract.');
