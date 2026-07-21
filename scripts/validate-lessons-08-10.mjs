import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const languages=['zh','en','vi','ja'];
function loadConfig(file){const window={};window.window=window;vm.runInNewContext(fs.readFileSync(file,'utf8'),{window},{filename:file});return window.NikigoLessonConfig}
function validateLocalized(value,path){
  if(!value||typeof value!=='object'||Array.isArray(value))return;
  const present=languages.filter(language=>Object.hasOwn(value,language));
  if(present.length){assert.deepEqual(present,languages,`${path} has incomplete localization`);for(const language of languages){assert.equal(typeof value[language],'string');assert.ok(value[language].trim(),`${path}.${language} is empty`);assert.doesNotMatch(value[language],/undefined/)}}
  for(const [key,child] of Object.entries(value))if(!languages.includes(key))validateLocalized(child,`${path}.${key}`);
}

const configs=['lesson-08.js','lesson-09.js','lesson-10.js'].map(loadConfig);
for(const [index,config] of configs.entries()){
  const expected=`lesson-${String(index+8).padStart(2,'0')}`;
  assert.equal(config.id,expected);
  assert.equal(config.displayNumber,index+8);
  assert.equal(config.steps.length,15,`${expected} must have 15 steps`);
  assert.equal(new Set(config.steps.map(step=>step.id)).size,15,`${expected} step ids must be unique`);
  assert.equal(config.steps.at(-1).type,'complete');
  assert.ok(config.steps.some(step=>step.type==='choice'||step.type==='scenario'));
  assert.ok(config.steps.some(step=>step.type==='match'));
  assert.ok(config.steps.some(step=>step.type==='build')||config.id==='lesson-08');
  validateLocalized(config,config.id);
}

const lesson10=configs[2];
assert.deepEqual([...new Set(lesson10.steps.slice(0,5).map(step=>step.module.zh))],['基础文字与音节 · 5步']);
assert.deepEqual([...new Set(lesson10.steps.slice(5,10).map(step=>step.module.zh))],['收音与音变 · 5步']);
assert.deepEqual([...new Set(lesson10.steps.slice(10,15).map(step=>step.module.zh))],['问候、自我介绍及综合挑战 · 5步']);
for(const marker of ['核心元音','音节','普通音','送气音','紧音','代表收音','连音','鼻音化','안녕하세요','저는 민지예요','이름이 뭐예요'])assert.ok(JSON.stringify(lesson10).includes(marker),`Lesson 10 is missing ${marker}`);
assert.match(JSON.stringify(lesson10),/不是商业版毕业认证/);

const engineSource=fs.readFileSync('lesson-sprint-engine.js','utf8');
assert.doesNotMatch(engineSource,/speechSynthesis|SpeechSynthesisUtterance|webkitSpeech/);
assert.match(engineSource,/NikigoAudio\?\.resolve\?\.\(audio\.text,audio\.audioType,audio\.lessonId\)/);
assert.match(engineSource,/if\(!result\?\.playable\|\|!result\.path\)return/);
assert.match(engineSource,/const media=new Audio\(result\.path\)/);
assert.match(engineSource,/hideText\?ui\('audio'\)/,'Listening controls must use a generic pre-answer label.');
assert.match(engineSource,/if\(session\.step===config\.steps\.length-2&&session\.mistakes\.length\)\{beginRetry\(\);return\}/);

function engineApi(config){
  const elements=new Map();
  const element=()=>({textContent:'',innerHTML:'',value:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){}});
  for(const id of ['lessonStage','language','lessonName','progressLabel','progressCount','progressBar','progressTrack','homeButton','homeLogo','toast'])elements.set(id,element());
  const document={getElementById:id=>elements.get(id)||element(),documentElement:{lang:''}};
  const storage=new Map();let profile={xp:90,completedLessons:[],lessonProgress:{},guest:true};
  const window={NikigoLessonConfig:config,document,location:{search:'?lang=en',href:''},localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},NikigoState:{get:()=>profile,update:(patch)=>{profile=typeof patch==='function'?patch(profile):{...profile,...patch};return profile;}},NikigoAudio:{resolve:()=>({playable:false,path:null})}};window.window=window;
  vm.runInNewContext(engineSource,{window,document,URLSearchParams,setTimeout,clearTimeout,Audio:class{}},{filename:'lesson-sprint-engine.js'});
  return window.NikigoSprintLessonTest;
}
for(const config of configs){
  const api=engineApi(config);const before={xp:90,completedLessons:[],lessonProgress:{},guest:true};const first=api.completionPatch(before);assert.equal(first.xp,140);assert.equal(first.lessonProgress[config.id],100);assert.ok(first.completedLessons.includes(config.id));assert.equal(first.guest,true);assert.equal(api.completionPatch(first).xp,140,`${config.id} must award XP once`);
  const restored=api.normalizeSession({...api.blankSession(),step:7,mistakes:[config.steps[4].id],retryQueue:[config.steps[4].id],retryMode:true});assert.equal(restored.step,7);assert.deepEqual([...restored.mistakes],[config.steps[4].id]);assert.equal(restored.retryMode,true);
}

const audioWindow={};audioWindow.window=audioWindow;vm.runInNewContext(fs.readFileSync('audio-catalog.js','utf8'),audioWindow,{filename:'audio-catalog.js'});
const hello=audioWindow.NikigoAudio.resolve('안녕하세요','sentence','lesson-03');
const shortHello=audioWindow.NikigoAudio.resolve('안녕','word','lesson-03');
const ba=audioWindow.NikigoAudio.resolve('바','syllable','lesson-04');
for(const item of [hello,shortHello,ba])assert.equal(item.playable,true,'Exact reused audio must be approved and playable');
assert.equal(ba.entry.sha256,'dc8345a1cad1ee3044c7f5ff633efbe13fd18c5d31f506107122b5464fe69e5e');
assert.equal(audioWindow.NikigoAudio.resolve('저는 민지예요','sentence','lesson-09').playable,false,'Unapproved Lesson 9 audio must stay disabled');

const catalogWindow={};catalogWindow.window=catalogWindow;vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),catalogWindow,{filename:'course-catalog.js'});
for(const id of ['lesson-08','lesson-09','lesson-10']){const lesson=catalogWindow.NIKIGO_COURSES.find(item=>item.stableId===id);assert.equal(lesson.status,'available');assert.equal(lesson.accessStatus,'available');assert.equal(lesson.requiresCompletion,false);assert.equal(catalogWindow.NIKIGO_COURSE_UNLOCKED(lesson,[]),true);assert.equal(lesson.xp,50);assert.equal(lesson.audioStatus,'pending')}
assert.equal(catalogWindow.NIKIGO_COURSES.find(item=>item.stableId==='lesson-09').template,'scenario-dialogue');
assert.equal(catalogWindow.NIKIGO_COURSES.find(item=>item.stableId==='lesson-10').template,'review-challenge');

const topLevelHtml=fs.readdirSync('.').filter(file=>file.endsWith('.html'));
for(const file of topLevelHtml){const html=fs.readFileSync(file,'utf8');assert.match(html,/<link rel="icon" href="assets\/nikigo-mark\.svg" type="image\/svg\+xml">/,`${file} must declare the relative Nikigo favicon`)}
const icon=fs.readFileSync('assets/nikigo-mark.svg','utf8');assert.match(icon,/viewBox="0 0 64 64"/);assert.doesNotMatch(icon,/<(?:image|use)[^>]+https?:\/\//);
const ico=fs.readFileSync('favicon.ico');assert.deepEqual([...ico.subarray(0,4)],[0,0,1,0],'Root fallback favicon must be a valid ICO resource');

const changed=execFileSync('git',['diff','--name-only','origin/main'],{encoding:'utf8'}).trim().split('\n').filter(Boolean);
assert.deepEqual(changed.filter(file=>/\.(?:mp3|wav)$/i.test(file)),[],'Sprint must not modify physical audio');
assert.equal(changed.includes('CODEX_HANDOFF.md'),false,'Sprint must not touch CODEX_HANDOFF.md');

const evidence=JSON.parse(fs.readFileSync('quality-fix/lessons-08-10-acceptance/ACCEPTANCE_RESULT.json','utf8'));
assert.equal(evidence.browser,'Google Chrome');
assert.equal(evidence.layoutCases,9);
assert.equal(evidence.horizontalOverflowCases,0);
assert.equal(evidence.smallControlCases,0);
assert.equal(evidence.undefinedTextCases,0);
assert.equal(evidence.consoleWarnings,0);
assert.equal(evidence.consoleErrors,0);
assert.equal(evidence.favicon.localChromeHttpStatus,200);
assert.equal(evidence.favicon.rootFallbackRequestObserved,true);
assert.equal(evidence.favicon.rootFallbackHttpStatus,200);
for(const result of Object.values(evidence.interaction))assert.ok(result===true||result===0);

console.log('Validated favicon coverage and Lessons 8–10: 15 steps each, four languages, direct access, retry gate, resume model, one-time XP, exact approved-audio reuse, pending-audio fail-closed, and zero physical audio changes.');
