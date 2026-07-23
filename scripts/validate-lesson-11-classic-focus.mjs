import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

const read=file=>fs.readFileSync(file,'utf8');
const hash=file=>crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const html=read('lesson-11.html');
const engine=read('lesson-11-classic-focus.js');
const css=read('lesson-11-classic-focus.css');
const shellCss=read('assets/classic-focus-shell.css');
const tokens=read('assets/classic-focus-tokens.css');
const visualCss=`${tokens}\n${shellCss}\n${css}`;
const shellEngine=read('assets/classic-focus-shell.js');
const worker=read('sw.js');

for(const asset of ['lesson-11-classic-focus.css','lesson-11-classic-focus.js','assets/classic-focus-tokens.css','assets/classic-focus-shell.css','assets/classic-focus-shell.js','lesson-11.js','app-state.js','audio-catalog.js']){
  assert.ok(html.includes(asset),`Lesson 11 must load ${asset}`);
  assert.ok(worker.includes(`./${asset}`),`Service Worker must cache ${asset}`);
}
for(const rejected of ['lesson-11-mission.css','lesson-11-mission-shell.js','lesson-clear-interactive.js'])assert.ok(!html.includes(rejected),`Formal Lesson 11 still loads ${rejected}`);
assert.match(html,/body class="classicFocusShell classicFocusScenario classicFocusLesson11"/);
assert.match(html,/id="progressTrack"[\s\S]*?<i><\/i>/);
assert.doesNotMatch(html,/phaseCard|phaseRoute|courseActions|上一阶段|完成本阶段|下一阶段/);

const lessonContext={window:{}};lessonContext.window.window=lessonContext.window;
vm.runInNewContext(read('lesson-11.js'),lessonContext,{filename:'lesson-11.js'});
const config=lessonContext.window.NikigoLessonConfig;
assert.equal(config.id,'lesson-11');
assert.equal(config.steps.length,13);
assert.deepEqual(Array.from(config.steps,step=>step.id),[
  'intro','first-scene','name-response','phrase-role','copula-rule','build-name','ending-choice',
  'identity-words','meeting-flow','build-identity','reply-choice','final-scene','complete'
]);

for(const marker of [
  "const SESSION_KEY=`nikigoLessonSession:${config.id}`",
  'completionPatch','beginRetry','history.pushState','popstate','document.documentElement.lang',
  'syncLanguageUrl','learnStage=K1&learnModule=k1-identity-and-language-background#courses',
  'audioReadiness','role="status"','stepDone(step)','session.answers[step.id]?.correct===true'
])assert.ok(`${engine}\n${shellEngine}`.includes(marker),`Classic Focus integration missing ${marker}`);
assert.doesNotMatch(engine,/FIXTURES|nikigoPrototype|speechSynthesis|SpeechSynthesisUtterance|webkitSpeech|text-to-speech|fetch\(|XMLHttpRequest|WebSocket/);
assert.doesNotMatch(engine,/option\.id===step\.correct[\s\S]{0,160}isCorrect/,'Wrong-state rendering must not reveal the correct option.');

for(const marker of [
  '--classic-brand: #6d4aff','--classic-page: #fbfaff','.classicFocusShell .classicFocusCard','max-width: 1040px',
  '.bubble .korean {','font-size:23px','.classicFocusShell .classicFocusActions','min-height: 44px',
  '@media (max-width:767px)','@media (prefers-reduced-motion:reduce)'
])assert.ok(visualCss.replaceAll(' ','').includes(marker.replaceAll(' ','')),`Classic Focus visual contract missing ${marker}`);
assert.doesNotMatch(visualCss,/font-size:\s*(?:6[0-9]|[7-9][0-9]|\d{3,})px/,'Classic Focus must not restore giant exercise type.');
assert.doesNotMatch(visualCss,/phaseCard|phaseRoute|vertical-track|timeline|backdrop-filter/i,'Classic Focus must not retain Mission Journey or glass presentation.');

const noop=()=>{};
function element(){return{textContent:'',innerHTML:'',value:'',style:{},dataset:{},open:false,classList:{add:noop,remove:noop},setAttribute:noop,addEventListener:noop,removeEventListener:noop,querySelector:()=>({style:{}}),querySelectorAll:()=>[],focus:noop,close:noop,showModal:noop};}
const ids=['lessonStage','language','lessonName','progressLabel','progressCount','progressTrack','homeButton','homeLogo','skipLink','courseNavigation','languageLabel','announcer','exitDialog','exitDialogTitle','exitDialogCopy','exitCancelButton','exitConfirmButton'];
const elements=new Map(ids.map(id=>[id,element()]));
const document={getElementById:id=>elements.get(id)||element(),querySelector:selector=>elements.get(selector.replace('#',''))||null,documentElement:{lang:''},body:{dataset:{}}};
const storage=new Map();let profile={xp:100,completedLessons:[],lessonProgress:{},interfaceLanguage:'en'};
const history={replaceState:noop,pushState:noop};
const window={window:null,document,NikigoLessonConfig:config,NikigoAudio:{resolve:()=>({playable:false,path:null})},NikigoState:{get:()=>profile,update:patch=>{profile=typeof patch==='function'?patch(profile):{...profile,...patch};return profile;}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},location:{search:'?lang=en',href:'http://localhost/lesson-11.html'},history,addEventListener:noop,scrollTo:noop};window.window=window;
vm.runInNewContext(shellEngine,{window,document,TypeError},{filename:'assets/classic-focus-shell.js'});
vm.runInNewContext(engine,{window,document,URL,URLSearchParams,Audio:class{}},{filename:'lesson-11-classic-focus.js'});
const api=window.NikigoSprintLessonTest;
assert.equal(api.config.steps.length,13);
for(const language of ['zh','en','vi','ja']){
  assert.ok(api.copy[language]);
  assert.deepEqual(Object.keys(api.copy[language]),Object.keys(api.copy.en));
  for(const [key,value] of Object.entries(api.copy[language]))assert.ok(String(value).trim(),`Missing ${language}.${key}`);
}
const first=api.completionPatch(profile);assert.equal(first.xp,150);assert.ok(first.completedLessons.includes('lesson-11'));assert.equal(api.completionPatch(first).xp,150);
const restored=api.normalizeSession({...api.blankSession(),step:8,mistakes:['build-name'],retryQueue:['build-name'],retryMode:true,dialogue:{'first-scene':3}});
assert.equal(restored.step,8);assert.equal(restored.retryMode,true);assert.equal(restored.dialogue['first-scene'],3);

const audioContext={window:{}};audioContext.window.window=audioContext.window;
vm.runInNewContext(read('audio-catalog.js'),audioContext,{filename:'audio-catalog.js'});
assert.equal(Object.keys(audioContext.window.NikigoAudio.approvedAssetHashes).length,54);
assert.equal(audioContext.window.NikigoAudio.resolve('이름이 뭐예요','sentence','lesson-11').playable,false);

const expectedHashes={
  'course-catalog.js':'63d0c4353883ee560e3f08775570e4d5092a6d95ea0653b358a67a90ab49b730',
  'app-state.js':'aa4ad0b06782ae58466a8f49bc3020ea0d6b25d1ec209ca25d26005c7bee6c1e',
  'audio-catalog.js':'107ddd9abac3824ad735de633763adbdac7b82bedbb5b97ea434741cc695fb7f',
  'lesson-11.js':'d26da6f39bcfa10a893b2161f222387f1e907ae164e010e5d34ec3517eda4589'
};
for(const[file,expected]of Object.entries(expectedHashes))assert.equal(hash(file),expected,`${file} changed`);

console.log('Validated Classic Focus formal Lesson 11: one real step at a time, 13-step identity, four languages, retry/resume, +50/+0 XP, fail-closed audio, V4 return route, and protected hashes.');
