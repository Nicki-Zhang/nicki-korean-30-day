import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const html=fs.readFileSync('lesson-07.html','utf8');
const source=fs.readFileSync('lesson-07.js','utf8');
const css=fs.readFileSync('lesson-07.css','utf8');
const manifest=JSON.parse(fs.readFileSync('audio/lesson-07/manifest.json','utf8'));
assert.match(html,/lesson-07\.css/);
assert.match(html,/lesson-07\.js/);
assert.match(html,/audio-catalog\.js/);
assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance/);
assert.match(source,/resolve\?\.\('바','syllable',LESSON_ID\)/);
assert.match(source,/if \(!BASE_SYLLABLE_AUDIO\?\.playable \|\| !BASE_SYLLABLE_AUDIO\.path\) return;/);
assert.doesNotMatch(source,/prerequisite|requiresCompletion|lockedTitle/);
assert.match(css,/@media\s*\(max-width:\s*760px\)/);
assert.match(css,/min-height:\s*44px/);

const element=()=>({value:'',textContent:'',innerHTML:'',title:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){}});
const elements=new Map(['lessonStage','language','lessonName','progressLabel','progressCount','progressBar','progressTrack','homeButton','homeLogo','toast'].map(id=>[id,element()]));
const documentStub={getElementById:id=>elements.get(id)||element(),addEventListener(){},documentElement:{lang:''}};
const storage=new Map();
let profile={xp:200,completedLessons:['lesson-06'],lessonProgress:{'lesson-06':100,'lesson-04':31},interfaceLanguage:'zh',guest:true};
const page={location:{search:'?lang=zh',href:''},navigator:{language:'zh'},document:documentStub,localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},NikigoState:{get:()=>profile,update:(patch)=>{profile=typeof patch==='function'?patch(profile):{...profile,...patch};return profile;}},scrollTo(){}};
page.window=page;
vm.runInNewContext(source,{window:page,document:documentStub,URLSearchParams},{filename:'lesson-07.js'});
const api=page.NikigoLesson07Test;
assert.ok(api);
assert.equal(api.lessonId,'lesson-04','Historical stableId must preserve prior progress and XP.');
assert.equal(api.screens.length,13);
assert.deepEqual(JSON.parse(JSON.stringify(api.examples.map(item=>[item.word,item.base,item.final,item.ending]))),[['산','사','ㄴ','[n]'],['몸','모','ㅁ','[m]'],['공','고','ㅇ','[ng]'],['물','무','ㄹ','[l]']]);
assert.deepEqual(JSON.parse(JSON.stringify(api.buildMap)),{'사+ㄴ':'산','모+ㅁ':'몸','고+ㅇ':'공','무+ㄹ':'물'});
assert.equal(api.splitQuestions.length,4);
assert.equal(api.recognizeQuestions.length,4);
assert.equal(api.challenge.length,5);
const englishKeys=Object.keys(api.ui.en);
for(const language of ['zh','en','vi','ja']){
  assert.deepEqual(Object.keys(api.ui[language]).sort(),[...englishKeys].sort(),`${language} translation keys drifted.`);
  assert.doesNotMatch(JSON.stringify(api.ui[language]),/undefined/);
}
for(const word of ['산','몸','공','물']){
  assert.match(source,new RegExp(`word:'${word}'`));
  assert.match(source,/listenWord/);
}
assert.equal(manifest.lesson,'lesson-07');
assert.equal(manifest.items.length,4);
assert.deepEqual(manifest.items.map(item=>[item.id,item.speechText,item.audioType,item.reviewStatus,item.assetStatus]),[
  ['san','산','word','pending','missing'],['mom','몸','word','pending','missing'],['gong','공','word','pending','missing'],['mul','물','word','pending','missing']
]);
assert.ok(manifest.items.every(item=>!fs.existsSync(`audio/lesson-07/${item.file}`)),'No unreviewed Lesson 7 audio asset may exist.');
assert.match(source,/disabled aria-disabled="true"/);
assert.match(source,/audioUnavailable/);

const before={xp:200,completedLessons:['lesson-06'],lessonProgress:{'lesson-06':100,'lesson-04':31},guest:true};
const first=api.completionPatch(before);
assert.equal(first.xp,250);
assert.equal(first.lessonProgress['lesson-04'],100);
assert.ok(first.completedLessons.includes('lesson-04'));
assert.equal(first.guest,true);
assert.equal(api.completionPatch(first).xp,250,'Repeat completion must not award XP twice.');
const restored=api.normalizeSession({...api.blankSession(),step:9,built:['산','몸'],mistakes:['c2'],challengeIndex:3});
assert.equal(restored.step,9);
assert.deepEqual(JSON.parse(JSON.stringify(restored.built)),['산','몸']);
assert.deepEqual(JSON.parse(JSON.stringify(restored.mistakes)),['c2']);
assert.equal(restored.challengeIndex,3);

const catalogContext={window:{}};catalogContext.window.window=catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),catalogContext,{filename:'course-catalog.js'});
const lesson=catalogContext.window.NIKIGO_COURSES.find(item=>item.displayNumber===7);
assert.equal(lesson.stableId,'lesson-04');
assert.equal(lesson.file,'lesson-07.html');
assert.equal(lesson.status,'available');
assert.equal(lesson.releaseStatus,'preview');
assert.equal(lesson.audioStatus,'pending');
assert.equal(catalogContext.window.NIKIGO_COURSE_UNLOCKED(lesson,[]),true);
const redirect=fs.readFileSync('lesson-04.html','utf8');
assert.match(redirect,/lesson-07\.html/);
assert.match(redirect,/target\.search = window\.location\.search/);
console.log('Validated 13-step Lesson 7, four languages, strict pending audio gating, four batchim mappings, direct access, stable progress migration, resume, and one-time XP.');
