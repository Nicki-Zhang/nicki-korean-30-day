import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const read = file => fs.readFileSync(file,'utf8');
const hash = file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const html = read('lesson-11.html');
const engine = read('lesson-clear-interactive.js');
const css = read('lesson-11-mission.css');
const shellSource = read('lesson-11-mission-shell.js');
const worker = read('sw.js');

for (const asset of ['lesson-11-mission.css','lesson-11-mission-shell.js']) {
  assert.ok(html.includes(asset),`Lesson 11 must load ${asset}`);
  assert.ok(worker.includes(`./${asset}`),`Service Worker must cache ${asset}`);
}
assert.match(html,/body class="missionLesson11"/);
assert.match(html,/id="exitDialog"/);
assert.match(html,/id="progressTrack"[\s\S]*?<i><\/i><i><\/i><i><\/i><i><\/i><i><\/i><i><\/i><i><\/i><i><\/i>/);

const shellContext = {window:{}};
shellContext.window.window = shellContext.window;
vm.runInNewContext(shellSource,shellContext,{filename:'lesson-11-mission-shell.js'});
const shell = shellContext.window.NikigoLesson11Mission;
assert.equal(shell.phases.length,8);
assert.deepEqual(Array.from(shell.phaseByStep),[0,1,2,2,2,3,3,4,5,5,5,6,7]);

const lessonContext = {window:{}};
lessonContext.window.window = lessonContext.window;
vm.runInNewContext(read('lesson-11.js'),lessonContext,{filename:'lesson-11.js'});
const config = lessonContext.window.NikigoLessonConfig;
assert.equal(config.steps.length,13);
assert.deepEqual(Array.from(config.steps,step=>step.id),[
  'intro','first-scene','name-response','phrase-role','copula-rule','build-name','ending-choice',
  'identity-words','meeting-flow','build-identity','reply-choice','final-scene','complete'
]);
assert.deepEqual(Array.from(config.steps,step=>shell.phaseForStep(step.id)),Array.from(shell.phaseByStep));
for (const phase of shell.phases) assert.ok(config.steps.some(step=>step.id===phase.firstStepId),`Unknown phase start ${phase.firstStepId}`);

const languages = ['zh','en','vi','ja'];
const phaseKeys = Object.keys(shell.phases[0].name);
assert.deepEqual(phaseKeys,languages);
const copyKeys = Object.keys(shell.languageCopy('zh'));
for (const language of languages) {
  const copy = shell.languageCopy(language);
  assert.deepEqual(Object.keys(copy),copyKeys,`Mission shell copy keys differ for ${language}`);
  for (const [key,value] of Object.entries(copy)) assert.ok(String(value).trim(),`Missing ${language}.${key}`);
  for (const phase of shell.phases) {
    assert.ok(phase.name[language],`Missing ${language} phase name: ${phase.id}`);
    assert.ok(phase.goal[language],`Missing ${language} phase goal: ${phase.id}`);
  }
}

for (const marker of [
  "const SESSION_KEY = `nikigoLessonSession:${config.id}`",
  'completionPatch',
  'beginRetry',
  'history.pushState',
  'popstate',
  'document.documentElement.lang',
  'syncLanguageUrl',
  'learnStage=K1&learnModule=k1-identity-and-language-background#courses',
  'mission.phaseForStep(step.id)',
  'audioReadiness',
  "role=\"status\""
]) assert.ok(engine.includes(marker),`Mission integration missing ${marker}`);
assert.doesNotMatch(engine,/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech|text-to-speech/i);
assert.doesNotMatch(engine,/fetch\(|XMLHttpRequest|WebSocket/);

for (const marker of [
  '.phaseSummaryLine strong {', 'font-size:18px',
  '.missionBubble .korean {', 'font-size:20px',
  '.missionBubble p {', 'font-size:15px',
  'grid-template-columns:50px minmax(0,1fr) 60px',
  'min-height:72px',
  'max-width:84%',
  'max-width:68%',
  '@media (prefers-reduced-motion:reduce)'
]) assert.ok(css.includes(marker),`Mission visual contract missing ${marker}`);
assert.doesNotMatch(css,/font-size:\s*(?:4[0-9]|[5-9][0-9]|\d{3,})px/,'Mission exercise UI must not restore giant type.');
assert.doesNotMatch(css,/\.phaseRoute::before|vertical-track|timeline/i,'Mission mobile layout must not restore a vertical track.');

const expectedHashes = {
  'course-catalog.js':'63d0c4353883ee560e3f08775570e4d5092a6d95ea0653b358a67a90ab49b730',
  'app-state.js':'aa4ad0b06782ae58466a8f49bc3020ea0d6b25d1ec209ca25d26005c7bee6c1e',
  'audio-catalog.js':'107ddd9abac3824ad735de633763adbdac7b82bedbb5b97ea434741cc695fb7f',
  'lesson-11.js':'d26da6f39bcfa10a893b2161f222387f1e907ae164e010e5d34ec3517eda4589'
};
for (const [file,expected] of Object.entries(expectedHashes)) assert.equal(hash(file),expected,`${file} changed`);

console.log('Validated Mission Journey V2 formal Lesson 11 presentation: 13 stable steps mapped to 8 phases, complete four-language copy, compact mobile typography, non-interactive pending audio, V4 return route, and protected data hashes.');
