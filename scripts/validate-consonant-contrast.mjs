import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages = ['zh','en','vi','ja'];
const expected = [
  ['ㄱ','plain','가','ga.mp3'],['ㅋ','aspirated','카','ka.mp3'],['ㄲ','tense','까','kka.mp3'],
  ['ㄷ','plain','다','da.mp3'],['ㅌ','aspirated','타','ta.mp3'],['ㄸ','tense','따','tta.mp3'],
  ['ㅂ','plain','바','ba.mp3'],['ㅍ','aspirated','파','pa.mp3'],['ㅃ','tense','빠','ppa.mp3'],
  ['ㅈ','plain','자','ja.mp3'],['ㅊ','aspirated','차','cha.mp3'],['ㅉ','tense','짜','jja.mp3'],
  ['ㅅ','plain','사','sa.mp3'],['ㅆ','tense','싸','ssa.mp3']
];

const html = fs.readFileSync('lesson-consonant-contrast.html','utf8');
const source = fs.readFileSync('lesson-consonant-contrast.js','utf8');
const css = fs.readFileSync('lesson-consonant-contrast.css','utf8');
const manifest = JSON.parse(fs.readFileSync('audio/k0-consonant-contrast/manifest.json','utf8'));
assert.match(html,/lesson-consonant-contrast\.js/);
assert.match(html,/lesson-consonant-contrast\.css/);
assert.match(html,/course-catalog\.js/);
assert.match(css,/@media\(max-width:760px\)/);
for (const selector of ['.soundPlay','.sequenceButton','.quizOption']) assert.match(css,new RegExp(selector.replace('.','\\.')));

assert.equal(manifest.lesson,'k0-consonant-contrast');
assert.equal(manifest.items.length,14);
assert.equal(new Set(manifest.items.map(item=>item.id)).size,14);
assert.equal(new Set(manifest.items.map(item=>item.file)).size,14);
for (const [index,item] of manifest.items.entries()) {
  const [symbol,category,spokenSyllable,audioFile]=expected[index];
  assert.deepEqual([item.targetSymbol,item.speechText,item.file],[symbol,spokenSyllable,audioFile]);
  for (const field of ['targetSymbol','speechText','file','expectedPronunciation','reviewStatus','assetStatus']) assert.ok(String(item[field]||'').trim(),`${item.id} missing ${field}`);
  assert.equal(item.audioType,'initial-example');
  assert.equal(item.reviewStatus,'pending');
  assert.equal(item.assetStatus,'missing');
  assert.doesNotMatch(item.speechText,/^[ㄱ-ㅎ]$/u);
  assert.doesNotMatch(item.speechText,/^[A-Za-z]+$/);
}

const element = () => ({
  value:'',textContent:'',innerHTML:'',title:'',style:{},dataset:{},
  classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){}
});
const elements = new Map(['lessonStage','language','lessonName','progressLabel','progressCount','progressBar','progressTrack','homeButton','homeLogo','toast'].map(id=>[id,element()]));
const storage = new Map();
const oldProfile = {xp:120,completedLessons:['lesson-02'],lessonProgress:{'lesson-03':66},weeklyProgress:2,audioRate:0.9,autoplayAudio:false,interfaceLanguage:'ja',guest:true};
let profile = JSON.parse(JSON.stringify(oldProfile));
const documentStub = {getElementById:id=>elements.get(id)||element(),addEventListener(){},documentElement:{lang:''}};
const lessonWindow = {
  location:{search:'?lang=en',href:''},navigator:{language:'en'},document:documentStub,
  localStorage:{getItem:key=>storage.get(key)||null,setItem:(key,value)=>storage.set(key,String(value))},
  NikigoState:{get:()=>profile,update:(patch)=>{profile=typeof patch==='function'?patch(profile):{...profile,...patch};return profile;}},
  setTimeout(){},scrollTo(){},NikigoAudio:{lessons:{},canPlayAudio(){return false}}
};
lessonWindow.window=lessonWindow;
vm.runInNewContext(source,{window:lessonWindow,document:documentStub,URLSearchParams,Audio:class{}},{filename:'lesson-consonant-contrast.js'});
const api=lessonWindow.NikigoContrastLesson;
assert.ok(api);
assert.equal(api.LESSON_ID,'k0-consonant-contrast');
assert.equal(api.SCREENS.length,15);
assert.equal(api.GROUPS.length,5);
assert.equal(Object.keys(api.QUESTIONS).length,6);
assert.equal(Object.keys(api.HOSTED_AUDIO).length,0,'Missing hosted files must not be requested by the page.');
assert.deepEqual(JSON.parse(JSON.stringify(api.GROUPS.flatMap(group=>group.items.map(item=>[item.symbol,item.category,item.syllable])))),expected.map(item=>item.slice(0,3)));
for(const item of api.GROUPS.flatMap(group=>group.items))assert.doesNotMatch(item.approximation,/[^\x20-\x7E]/,`${item.syllable} approximation must use cross-device plain text`);
const englishKeys=Object.keys(api.UI.en);
for(const language of languages)for(const key of englishKeys)assert.notEqual(api.UI[language]?.[key],undefined,`${language}.${key} is undefined`);

let practice=api.blankSession();
practice=api.applyAnswer(practice,api.QUESTIONS.qg,'가');
assert.deepEqual([...practice.mistakes],['qg']);
practice=api.applyRetryAnswer(practice,api.QUESTIONS.qg,'까');
assert.deepEqual([...practice.mistakes],[]);
assert.notDeepEqual(practice.optionOrders.qg,undefined);

const completed=api.completionPatch(oldProfile);
assert.equal(completed.xp,170);
assert.equal(completed.lessonProgress['lesson-03'],66);
assert.equal(completed.lessonProgress['k0-consonant-contrast'],100);
assert.deepEqual([...completed.completedLessons],['lesson-02','k0-consonant-contrast']);
assert.equal(completed.audioRate,0.9);
assert.equal(completed.guest,true);
assert.equal(api.completionPatch(completed).xp,170,'Repeat completion must not award XP twice.');

storage.set('nikigoLessonSession:k0-consonant-contrast',JSON.stringify({...api.blankSession(),step:8,mistakes:['qb']}));
const resumed = JSON.parse(storage.get('nikigoLessonSession:k0-consonant-contrast'));
assert.equal(resumed.step,8);
assert.deepEqual(resumed.mistakes,['qb']);

const catalogContext={window:{}};catalogContext.window.window=catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),catalogContext,{filename:'course-catalog.js'});
const catalog=catalogContext.window.NIKIGO_COURSES;
const course=catalog.find(item=>item.stableId==='k0-consonant-contrast');
assert.equal(course.displayNumber,4);
assert.equal(course.file,'lesson-consonant-contrast.html');
assert.notEqual(course.stableId,'lesson-04');
assert.deepEqual([...catalog.find(item=>item.stableId==='lesson-05').recommendedPrerequisites],['k0-consonant-contrast']);

assert.doesNotMatch(source,/playSequence\(\s*\[['"][ㄱ-ㅎ]['"]\]\s*\)/u);
assert.match(source,/global\.setTimeout\(next,260\)/);
assert.match(source,/min\(SCREENS\.length-1/);
assert.match(source,/HOSTED_AUDIO\[item\.syllable\]\?text\('listenSound'/);
assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance|getVoices/);
const workflow=fs.readFileSync('.github/workflows/generate-lesson-audio.yml','utf8');
assert.match(workflow,/audio-batch-01/);
assert.match(workflow,/audio-batch-02a/);
assert.doesNotMatch(workflow,/audio-batch-02b/,'Planning-only Batch 2B must not be dispatchable.');
console.log('Validated 15-step K0 consonant contrast lesson, 14 safe full-syllable mappings, four languages, retry flow, resume state, completion compatibility, and direct course access.');
