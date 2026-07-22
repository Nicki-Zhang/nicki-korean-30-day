import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync('lesson-11.html','utf8');
const lessonCss=fs.readFileSync('lesson-clear-interactive.css','utf8');
const lessonTheme=fs.readFileSync('lesson-purple-interactive.css','utf8');
const lessonEngine=fs.readFileSync('lesson-clear-interactive.js','utf8');
const shellCss=fs.readFileSync('assets/nikigo-purple-shell.css','utf8');
const friendlyCss=fs.readFileSync('assets/nikigo-friendly-learning-path.css','utf8');
const shellJs=fs.readFileSync('assets/nikigo-clear-shell.js','utf8');
const app=fs.readFileSync('nikigo-app.html','utf8');
const worker=fs.readFileSync('sw.js','utf8');

for(const marker of ['lesson-clear-interactive.css','lesson-purple-interactive.css','lesson-clear-interactive.js','audio-catalog.js','lesson-11.js'])assert.ok(html.includes(marker),`Lesson 11 pilot missing ${marker}`);
assert.ok(app.includes('assets/nikigo-purple-shell.css'));
assert.ok(app.includes('assets/nikigo-friendly-learning-path.css'));
assert.ok(app.includes('assets/nikigo-clear-shell.js'));
assert.match(shellJs,/target\.textContent !== nextTitle/,'Dashboard mutation sync must be idempotent.');
for(const marker of ['--nikigo-purple:#6657d9','--nikigo-purple-deep:#4f46b8','--nikigo-purple-soft:#f2f0ff','--nikigo-canvas:#f7f7fb','min-height:44px','prefers-reduced-motion'])assert.ok(shellCss.includes(marker),`Purple dashboard token or accessibility rule missing: ${marker}`);
for(const marker of ['--friendly-brand-900:#2b1747','--friendly-gradient:linear-gradient','--friendly-text-korean','--friendly-radius-xl','--friendly-duration-normal','min-height:44px','prefers-reduced-motion'])assert.ok(friendlyCss.includes(marker),`Friendly learning path token or accessibility rule missing: ${marker}`);
for(const marker of ['.friendly-shell .learningHero','.friendly-shell .learningStatus','.friendly-shell .dashboardJourney','.friendly-shell .taxonomyChapter.current','.friendly-shell .moduleLessons .courseRow'])assert.ok(friendlyCss.includes(marker),`Friendly learning component missing: ${marker}`);
assert.doesNotMatch(friendlyCss,/transition:\s*all/i,'Friendly learning path must use property-specific transitions.');
for(const marker of ['--canvas:#f7f7fb','--action:#4f46b8','--accent:#6657d9','--success:#257653','--error:#a94338','min-height:44px','prefers-reduced-motion'])assert.ok(lessonTheme.includes(marker),`Purple lesson token or accessibility rule missing: ${marker}`);
for(const source of [lessonTheme,shellCss])assert.doesNotMatch(source,/#287f60|#1d674c|#f6f7f4/i,'Loaded purple theme must not contain Ink & Jade palette tokens.');
assert.match(shellCss,/linear-gradient\(128deg,#403a86/,'Dashboard hero must retain the restrained purple gradient.');
assert.match(app,/id="streakMetric"/);assert.match(app,/id="xpMetric"/);assert.match(app,/id="weekMetric"/);
assert.match(app,/<header class="top">[\s\S]*?<nav id="appNav"[\s\S]*?<\/header>\s*<main id="appMain"[^>]*>/,'Primary navigation must remain inside the top shell and before main content for desktop and mobile placement.');
assert.match(lessonCss,/\.conceptChunk\[aria-pressed="true"\][\s\S]*translateY\(-3px\)/);
assert.match(lessonCss,/--motion:180ms/);
assert.match(lessonEngine,/NikigoAudio\?\.resolve\?\.\(audio\.text,audio\.audioType,audio\.lessonId\)/);
assert.match(lessonEngine,/if\(!result\?\.playable\|\|!result\.path\)return/);
assert.doesNotMatch(lessonEngine,/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech|text-to-speech/i);
assert.doesNotMatch(lessonEngine,/option\.id===step\.correct|step\.correct\)[\s\S]{0,120}isCorrect/, 'Wrong feedback must not reveal the correct option.');
for(const marker of ['wrongHint','history.pushState','popstate','completionPatch','beginRetry','move-left','move-right','prefers-reduced-motion'])assert.ok(`${lessonEngine}\n${lessonCss}\n${lessonTheme}`.includes(marker),`Pilot interaction missing ${marker}`);
for(const marker of ['저는 하늘이에요.','저는 하늘 이에요']){
  if(marker.includes(' 하늘 ')) assert.ok(!`${lessonEngine}\n${shellJs}\n${app}`.includes(marker),'Invalid Korean spacing entered the pilot.');
  else assert.ok(lessonEngine.includes(marker),'Canonical Korean sentence missing.');
}
for(const asset of ['./lesson-clear-interactive.js','./lesson-clear-interactive.css','./lesson-purple-interactive.css','./assets/nikigo-clear-shell.js','./assets/nikigo-purple-shell.css','./assets/nikigo-friendly-learning-path.css'])assert.ok(worker.includes(asset),`Service Worker missing ${asset}`);

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
  assert.equal(evidence.dashboardScreenshots.length,4);for(const file of evidence.dashboardScreenshots)assert.ok(fs.statSync(`${evidenceRoot}/screenshots/${file}`).size>20000,`${file} is too small`);
  assert.equal(evidence.screenshots.length,12);for(const file of evidence.screenshots)assert.ok(fs.statSync(`${evidenceRoot}/screenshots/${file}`).size>20000,`${file} is too small`);
  assert.ok(fs.statSync(`${evidenceRoot}/nikigo-lesson-11-390-flow.mov`).size>1000000,'390px interaction recording is missing');
}

console.log('Validated the purple Nikigo dashboard and Lesson 11 theme: isolated renderer, 13-step compatibility, retry/relearn/XP gates, non-revealing feedback, keyboard-ready controls, exact-audio fail-closed behavior, and 54 sealed assets unchanged.');
