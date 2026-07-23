import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(file, 'utf8');
const html = read('lesson-12.html');
const configSource = read('lesson-12.js');
const adapterSource = read('lesson-12-classic-focus.js');
const adapterCss = read('lesson-12-classic-focus.css');
const engineSource = read('lesson-sprint-engine.js');
const appStateSource = read('app-state.js');
const audioCatalogSource = read('audio-catalog.js');
const worker = read('sw.js');

for (const asset of [
  'assets/classic-focus-tokens.css',
  'assets/classic-focus-shell.css',
  'assets/classic-focus-shell.js',
  'lesson-12-classic-focus.css',
  'lesson-12-classic-focus.js',
  'lesson-sprint-engine.js'
]) assert.ok(html.includes(asset), `Lesson 12 is missing ${asset}.`);
assert.doesNotMatch(html, /lesson-sprint\.css/, 'Lesson 12 must not load the legacy Sprint shell stylesheet.');
assert.match(html, /classicFocusShell classicFocusScenario classicFocusSprint/);
assert.match(html, /id="lessonStage"[^>]*tabindex="-1"/);

const configContext = { window: {} };
configContext.window.window = configContext.window;
vm.runInNewContext(configSource, configContext, { filename:'lesson-12.js' });
const config = configContext.window.NikigoLessonConfig;
const expectedStepIds = [
  'intro', 'origin-scene', 'origin-response', 'phrase-role', 'origin-pattern',
  'build-origin', 'country-person', 'country-language', 'study-pattern',
  'build-study', 'scene-reply', 'final-scene', 'complete'
];
assert.equal(config.id, 'lesson-12');
assert.equal(config.steps.length, 13);
assert.equal(JSON.stringify(config.steps.map(step => step.id)), JSON.stringify(expectedStepIds));
assert.equal(new Set(config.steps.map(step => step.id)).size, 13);

const audioRequests = config.steps.flatMap(step => [
  ...(step.audios || []),
  ...(step.audio ? [step.audio] : [])
]);
assert.equal(audioRequests.length, 1);
assert.equal(
  JSON.stringify({ text:audioRequests[0].text, audioType:audioRequests[0].audioType, lessonId:audioRequests[0].lessonId }),
  JSON.stringify({ text:'어느 나라에서 왔어요', audioType:'sentence', lessonId:'lesson-12' })
);

const audioWindow = {};
audioWindow.window = audioWindow;
vm.runInNewContext(audioCatalogSource, audioWindow, { filename:'audio-catalog.js' });
const resolution = audioWindow.NikigoAudio.resolve(
  audioRequests[0].text,
  audioRequests[0].audioType,
  audioRequests[0].lessonId
);
assert.equal(resolution.entry, null);
assert.equal(resolution.playable, false);
assert.equal(resolution.path, null);
assert.equal(audioWindow.NikigoAudio.canPlayAudio(audioRequests[0].text, null, audioRequests[0].audioType), false);

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
assert.match(adapterSource, /activeStepId === 'origin-scene' \? 'missing' : 'none'/);
assert.match(adapterSource, /\.audioButton\[aria-disabled="true"\]/);
assert.match(adapterSource, /control\.replaceWith\(status\)/);
for (const copy of [
  '标准音频准备中',
  'Standard audio is being prepared',
  'Âm thanh chuẩn đang được chuẩn bị',
  '標準音声を準備中です'
]) assert.ok(adapterSource.includes(copy), `Missing localized audio state: ${copy}`);
assert.match(adapterSource, /learnStage=K1&learnModule=k1-identity-and-language-background#courses/);
assert.match(adapterSource, /global\.scrollTo\(0, 0\)/);
assert.match(adapterSource, /stage\.focus\(\{ preventScroll:true \}\)/);
assert.doesNotMatch(adapterSource, /title\.includes|textContent.*contentType|innerText.*contentType/);
assert.doesNotMatch(adapterSource, /lesson-08|lesson-13/);

const queryResults = new Map();
const missingAudioControl = {
  attributes:{},
  setAttribute(name, value){ this.attributes[name] = String(value); },
  replaceWith(value){ this.replacement = value; }
};
const stageListeners = new Map();
const stage = {
  dataset:{},
  focusCalls:0,
  querySelectorAll(selector){ return queryResults.get(selector) || []; },
  querySelector(){ return null; },
  addEventListener(name, listener, capture){ stageListeners.set(`${name}:${capture}`, listener); },
  focus(options){ this.focusCalls += 1; this.focusOptions = options; }
};
const body = { dataset:{} };
const document = {
  body,
  getElementById(id){ return id === 'lessonStage' ? stage : null; },
  createElement() {
    return {
      className:'',
      attributes:{},
      textContent:'',
      setAttribute(name, value){ this.attributes[name] = String(value); }
    };
  }
};
let lastViewModel = null;
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
const context = { window, document, Object, Error, CSS:{ escape:value => String(value) } };
vm.runInNewContext(adapterSource, context, { filename:'lesson-12-classic-focus.js' });
const adapter = window.NikigoSprintClassicFocusAdapter;
assert.equal(adapter.lessonId, 'lesson-12');
assert.equal(JSON.stringify(Object.keys(adapter.stepContentTypes)), JSON.stringify(expectedStepIds));

adapter.update({
  lessonId:'lesson-12', stepId:'origin-scene', stepType:'concept',
  currentStep:2, totalSteps:13, language:'vi', title:'Bài 12', stepLabel:'Tiến độ',
  progress:8.3, canGoPrevious:true, canGoNext:true
});
assert.equal(lastViewModel.contentType, 'dialogue');
assert.equal(lastViewModel.audioAvailability, 'none');
assert.equal(document.body.dataset.stepId, 'origin-scene');
assert.equal(document.body.dataset.audioReadiness, 'missing');
queryResults.set('.audioButton[aria-disabled="true"]', [missingAudioControl]);
adapter.afterRender();
assert.equal(missingAudioControl.replacement.className, 'classicFocusAudioStatus');
assert.equal(missingAudioControl.replacement.attributes.role, 'status');
assert.equal(missingAudioControl.replacement.attributes['data-audio-readiness'], 'missing');
assert.equal(missingAudioControl.replacement.textContent, 'Âm thanh chuẩn đang được chuẩn bị');

const clickListener = stageListeners.get('click:true');
assert.ok(clickListener, 'Adapter must observe explicit navigation actions.');
clickListener({ target:{ closest:() => ({ dataset:{ action:'next' } }) } });
adapter.update({
  lessonId:'lesson-12', stepId:'origin-response', stepType:'scenario',
  currentStep:3, totalSteps:13, language:'vi', title:'Bài 12', stepLabel:'Tiến độ',
  progress:16.7, canGoPrevious:true, canGoNext:false
});
window.pendingInteractions.shift()();
assert.equal(window.scrollCalls, 1, 'A real step change must return to the new task start.');
assert.equal(stage.focusCalls, 1);
assert.equal(stage.focusOptions.preventScroll, true);

clickListener({ target:{ closest:() => ({ dataset:{ action:'answer', value:'origin' } }) } });
window.pendingInteractions.shift()();
assert.equal(window.scrollCalls, 1, 'An in-step answer must not force a page-top jump.');

assert.match(engineSource, /NikigoSprintClassicFocusAdapter\?\.update\?\.\(\{/);
assert.match(engineSource, /stepId:step\.id/);
assert.match(engineSource, /stepType:step\.type/);
assert.match(engineSource, /NikigoSprintClassicFocusAdapter\?\.afterRender\?\.\(\)/);
assert.match(engineSource, /if\(!correct\)addMistake\(step\.id\)/);
assert.match(engineSource, /function beginRetry\(\)\{session\.retryQueue=\[\.\.\.session\.mistakes\]/);
assert.doesNotMatch(engineSource, /\bReviewItem\b|\breviewItems\b/);
assert.equal(
  crypto.createHash('sha256').update(appStateSource).digest('hex'),
  'aa4ad0b06782ae58466a8f49bc3020ea0d6b25d1ec209ca25d26005c7bee6c1e',
  'Lesson 12 presentation work must preserve the approved app-state baseline.'
);

assert.match(adapterCss, /min-height: 48px/);
assert.match(adapterCss, /\.classicFocusAudioStatus/);
assert.match(adapterCss, /\.classicFocusScenario \.bubble/);
assert.match(adapterCss, /@media \(prefers-reduced-motion: reduce\)/);
assert.doesNotMatch(adapterCss, /transition:\s*all/);
for (const asset of ['./lesson-12-classic-focus.js?v=1', './lesson-12-classic-focus.css?v=1']) {
  assert.ok(worker.includes(asset), `Service Worker is missing ${asset}.`);
}

console.log('Validated Lesson 12 Classic Focus: 13 explicit steps, scenario adapter, one missing audio request fail-closed, shared shell, and tolerant scroll contract.');
