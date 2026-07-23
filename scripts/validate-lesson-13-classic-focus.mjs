import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(file, 'utf8');
const html = read('lesson-13.html');
const configSource = read('lesson-13.js');
const adapterSource = read('lesson-13-classic-focus.js');
const adapterCss = read('lesson-13-classic-focus.css');
const engineSource = read('lesson-sprint-engine.js');
const appStateSource = read('app-state.js');
const worker = read('sw.js');

for (const asset of [
  'assets/classic-focus-tokens.css',
  'assets/classic-focus-shell.css',
  'assets/classic-focus-shell.js',
  'lesson-13-classic-focus.css',
  'lesson-13-classic-focus.js',
  'lesson-sprint-engine.js'
]) assert.ok(html.includes(asset), `Lesson 13 is missing ${asset}.`);
assert.doesNotMatch(html, /lesson-sprint\.css/, 'Lesson 13 must not load the legacy Sprint shell stylesheet.');
assert.match(html, /classicFocusShell classicFocusNumbers classicFocusSprint/);
assert.match(html, /id="lessonStage"[^>]*tabindex="-1"/);

const configContext = { window: {} };
configContext.window.window = configContext.window;
vm.runInNewContext(configSource, configContext, { filename:'lesson-13.js' });
const config = configContext.window.NikigoLessonConfig;
assert.equal(config.id, 'lesson-13');
assert.equal(config.steps.length, 13);
assert.equal(new Set(config.steps.map(step => step.id)).size, 13);
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
assert.match(adapterSource, /\[data-action="confirm-build"\]\.audioButton/);
assert.match(adapterSource, /learnStage=K1&learnModule=k1-numbers-and-quantities#courses/);
assert.match(adapterSource, /global\.scrollTo\(0, 0\)/);
assert.match(adapterSource, /stage\.focus\(\{ preventScroll:true \}\)/);
assert.doesNotMatch(adapterSource, /title\.includes|textContent.*contentType|innerText.*contentType/);

const stageListeners = new Map();
const stage = {
  dataset:{},
  focusCalls:0,
  querySelectorAll(){ return []; },
  querySelector(){ return null; },
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
vm.runInNewContext(adapterSource, context, { filename:'lesson-13-classic-focus.js' });
const adapter = window.NikigoSprintClassicFocusAdapter;
assert.equal(adapter.lessonId, 'lesson-13');
assert.equal(JSON.stringify(Object.keys(adapter.stepContentTypes)), JSON.stringify(config.steps.map(step => step.id)));

adapter.update({
  lessonId:'lesson-13', stepId:'build-one', stepType:'build',
  currentStep:9, totalSteps:13, language:'vi', title:'Bài 13', stepLabel:'Tiến độ',
  progress:66.7, canGoPrevious:true, canGoNext:false
});
assert.equal(lastViewModel.contentType, 'builder');
assert.equal(lastViewModel.audioAvailability, 'none');
assert.equal(document.body.dataset.stepId, 'build-one');

const clickListener = stageListeners.get('click:true');
assert.ok(clickListener, 'Adapter must observe explicit navigation actions.');
clickListener({ target:{ closest:() => ({ dataset:{ action:'next' } }) } });
adapter.update({
  lessonId:'lesson-13', stepId:'how-many', stepType:'scenario',
  currentStep:10, totalSteps:13, language:'vi', title:'Bài 13', stepLabel:'Tiến độ',
  progress:75, canGoPrevious:true, canGoNext:false
});
window.pendingInteractions.shift()();
assert.equal(window.scrollCalls, 1, 'A real step change must return to the new task start.');
assert.equal(stage.focusCalls, 1);
assert.equal(stage.focusOptions.preventScroll, true);

clickListener({ target:{ closest:() => ({ dataset:{ action:'confirm-build' } }) } });
window.pendingInteractions.shift()();
assert.equal(window.scrollCalls, 1, 'An in-step answer must not force a page-top jump.');

assert.match(engineSource, /NikigoSprintClassicFocusAdapter\?\.update\?\.\(\{/);
assert.match(engineSource, /stepId:step\.id/);
assert.match(engineSource, /stepType:step\.type/);
assert.match(engineSource, /NikigoSprintClassicFocusAdapter\?\.afterRender\?\.\(\)/);
assert.match(engineSource, /if\(!correct\)addMistake\(step\.id\)/, 'The sealed Sprint engine must retain real wrong step IDs.');
assert.match(engineSource, /function beginRetry\(\)\{session\.retryQueue=\[\.\.\.session\.mistakes\]/, 'Targeted retry must be built from the real wrong IDs.');
assert.match(engineSource, /if\(session\.step===config\.steps\.length-2&&session\.mistakes\.length\)\{beginRetry\(\);return\}/);
assert.doesNotMatch(engineSource, /\bReviewItem\b|\breviewItems\b/, 'The baseline Sprint engine must not claim to publish app-state ReviewItems.');
assert.equal(
  crypto.createHash('sha256').update(appStateSource).digest('hex'),
  'aa4ad0b06782ae58466a8f49bc3020ea0d6b25d1ec209ca25d26005c7bee6c1e',
  'Lesson 13 presentation work must preserve the approved app-state baseline.'
);

const engineTestWindow = { NikigoLessonConfig:config };
engineTestWindow.window = engineTestWindow;
vm.runInNewContext(`${engineSource.split('  const stage =')[0]}\n})(window);`, { window:engineTestWindow }, { filename:'lesson-sprint-engine-test-api.js' });
const restoredRetry = engineTestWindow.NikigoSprintLessonTest.normalizeSession({
  step:4,
  mistakes:['identify-eight', 'identify-eight', 'not-a-real-step'],
  retryQueue:['identify-eight', 'not-a-real-step'],
  retryMode:true
});
assert.deepEqual([...restoredRetry.mistakes], ['identify-eight']);
assert.deepEqual([...restoredRetry.retryQueue], ['identify-eight']);
assert.equal(restoredRetry.retryMode, true);

assert.match(adapterCss, /min-height: 48px/);
assert.match(adapterCss, /@media \(prefers-reduced-motion: reduce\)/);
for (const asset of ['./lesson-13-classic-focus.js?v=2', './lesson-13-classic-focus.css?v=2']) {
  assert.ok(worker.includes(asset), `Service Worker is missing ${asset}.`);
}

console.log('Validated Lesson 13 Classic Focus: 13 explicit steps, number adapter, no audio UI, shared shell, and tolerant scroll contract.');
