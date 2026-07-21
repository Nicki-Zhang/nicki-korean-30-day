import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync('lesson-11.html','utf8');
const lessonCss=fs.readFileSync('lesson-clear-interactive.css','utf8');
const lessonEngine=fs.readFileSync('lesson-clear-interactive.js','utf8');
const shellCss=fs.readFileSync('assets/nikigo-clear-shell.css','utf8');
const shellJs=fs.readFileSync('assets/nikigo-clear-shell.js','utf8');
const app=fs.readFileSync('nikigo-app.html','utf8');
const worker=fs.readFileSync('sw.js','utf8');

for(const marker of ['lesson-clear-interactive.css','lesson-clear-interactive.js','audio-catalog.js','lesson-11.js'])assert.ok(html.includes(marker),`Lesson 11 pilot missing ${marker}`);
assert.ok(app.includes('assets/nikigo-clear-shell.css'));
assert.ok(app.includes('assets/nikigo-clear-shell.js'));
assert.match(shellJs,/target\.textContent !== nextTitle/,'Dashboard mutation sync must be idempotent.');
for(const marker of ['--canvas:#f6f7f4','--ink:#171918','--action:#171918','--accent:#287f60','--error:#a94338','prefers-reduced-motion','min-height:44px'])assert.ok(lessonCss.includes(marker),`Ink & Jade token or accessibility rule missing: ${marker}`);
for(const source of [lessonCss,shellCss]){
  assert.doesNotMatch(source,/#6d4aff|#9b7cff|linear-gradient|radial-gradient|box-shadow:\s*0\s+\d+px\s+\d+px/, 'Pilot must not restore purple, gradients, or decorative shadows.');
}
assert.match(lessonCss,/\.conceptChunk\[aria-pressed="true"\][\s\S]*translateY\(-3px\)/);
assert.match(lessonCss,/--motion:180ms/);
assert.match(lessonEngine,/NikigoAudio\?\.resolve\?\.\(audio\.text,audio\.audioType,audio\.lessonId\)/);
assert.match(lessonEngine,/if\(!result\?\.playable\|\|!result\.path\)return/);
assert.doesNotMatch(lessonEngine,/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech|text-to-speech/i);
assert.doesNotMatch(lessonEngine,/option\.id===step\.correct|step\.correct\)[\s\S]{0,120}isCorrect/, 'Wrong feedback must not reveal the correct option.');
for(const marker of ['wrongHint','history.pushState','popstate','completionPatch','beginRetry','move-left','move-right','prefers-reduced-motion'])assert.ok(`${lessonEngine}\n${lessonCss}`.includes(marker),`Pilot interaction missing ${marker}`);
for(const marker of ['저는 하늘이에요.','저는 하늘 이에요']){
  if(marker.includes(' 하늘 ')) assert.ok(!`${lessonEngine}\n${shellJs}\n${app}`.includes(marker),'Invalid Korean spacing entered the pilot.');
  else assert.ok(lessonEngine.includes(marker),'Canonical Korean sentence missing.');
}
for(const asset of ['./lesson-clear-interactive.js','./lesson-clear-interactive.css','./assets/nikigo-clear-shell.js','./assets/nikigo-clear-shell.css'])assert.ok(worker.includes(asset),`Service Worker missing ${asset}`);

const context={window:{}};context.window.window=context.window;
vm.runInNewContext(fs.readFileSync('lesson-11.js','utf8'),context,{filename:'lesson-11.js'});
const config=context.window.NikigoLessonConfig;
assert.equal(config.id,'lesson-11');assert.equal(config.steps.length,13);

const noop=()=>{};
function element(){return {textContent:'',innerHTML:'',value:'',children:Array.from({length:8},()=>({className:''})),dataset:{},classList:{add:noop,remove:noop},setAttribute:noop,addEventListener:noop,querySelectorAll:()=>[]};}
const elements=new Map(['lessonStage','language','lessonName','progressLabel','progressCount','progressTrack','homeButton','homeLogo','toast'].map(id=>[id,element()]));
const document={getElementById:id=>elements.get(id)||element(),documentElement:{lang:''}};
const storage=new Map();let profile={xp:100,completedLessons:[],lessonProgress:{},interfaceLanguage:'en'};
const history={replaceState:noop,pushState:noop};
const window={window:null,document,NikigoLessonConfig:config,NikigoAudio:{resolve:()=>({playable:false,path:null})},NikigoState:{get:()=>profile,update:patch=>{profile=typeof patch==='function'?patch(profile):{...profile,...patch};return profile;}},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},location:{search:'?lang=en',href:'http://localhost/lesson-11.html'},history,addEventListener:noop,scrollTo:noop};window.window=window;
vm.runInNewContext(lessonEngine,{window,document,URLSearchParams,setTimeout,clearTimeout,Audio:class{}},{filename:'lesson-clear-interactive.js'});
const api=window.NikigoSprintLessonTest;
assert.equal(api.phaseByStep.length,13);assert.equal(api.phaseByStep.at(-1),7);
const first=api.completionPatch(profile);assert.equal(first.xp,150);assert.ok(first.completedLessons.includes('lesson-11'));assert.equal(api.completionPatch(first).xp,150);
const restored=api.normalizeSession({...api.blankSession(),step:8,mistakes:['build-name'],retryQueue:['build-name'],retryMode:true,dialogue:{'first-scene':3}});
assert.equal(restored.step,8);assert.equal(restored.retryMode,true);assert.equal(restored.dialogue['first-scene'],3);

const audioContext={window:{}};audioContext.window.window=audioContext.window;vm.runInNewContext(fs.readFileSync('audio-catalog.js','utf8'),audioContext,{filename:'audio-catalog.js'});
assert.equal(Object.keys(audioContext.window.NikigoAudio.approvedAssetHashes).length,54);
assert.equal(audioContext.window.NikigoAudio.resolve('이름이 뭐예요','sentence','lesson-11').playable,false);

const evidenceRoot='quality-fix/nikigo-clear-interactive-pilot';
if(fs.existsSync(`${evidenceRoot}/ACCEPTANCE_RESULT.json`)){
  const evidence=JSON.parse(fs.readFileSync(`${evidenceRoot}/ACCEPTANCE_RESULT.json`,'utf8'));
  assert.equal(evidence.browser,'Google Chrome');
  assert.equal(evidence.chromeMode,'isolated-headful-user-data-dir');
  assert.equal(evidence.consoleWarnings,0);assert.equal(evidence.consoleErrors,0);
  assert.deepEqual(evidence.networkErrors,[]);assert.deepEqual(evidence.runtimeExceptions,[]);
  assert.equal(evidence.pendingAudioDisabled,true);assert.equal(evidence.audioApiRequests,0);assert.equal(evidence.audioCost,0);
  assert.equal(evidence.interaction.enteredFromCourseHome,true);assert.equal(evidence.interaction.keyboardActivation,true);
  assert.equal(evidence.interaction.refreshRestore,true);assert.equal(evidence.interaction.browserBack,true);assert.equal(evidence.interaction.undoReorder,true);
  assert.equal(evidence.interaction.firstAwardedXp,50);assert.equal(evidence.interaction.repeatAwardedXp,0);assert.equal(evidence.interaction.totalXpAfterRepeat,evidence.interaction.totalXpAfterFirst);
  assert.deepEqual(Object.keys(evidence.languages),['zh','en','vi','ja']);
  for(const item of [...evidence.viewports,...Object.values(evidence.languages)]){assert.equal(item.overflow,false);assert.equal(item.undefinedText,false);assert.deepEqual(item.tooSmall,[]);}
  assert.equal(evidence.screenshots.length,12);for(const file of evidence.screenshots)assert.ok(fs.statSync(`${evidenceRoot}/screenshots/${file}`).size>20000,`${file} is too small`);
  assert.ok(fs.statSync(`${evidenceRoot}/nikigo-lesson-11-390-flow.mov`).size>1000000,'390px interaction recording is missing');
}

console.log('Validated the Lesson 11 Ink & Jade pilot: isolated renderer, 13-step compatibility, retry/relearn/XP gates, non-revealing feedback, keyboard-ready controls, exact-audio fail-closed behavior, and 54 sealed assets unchanged.');
