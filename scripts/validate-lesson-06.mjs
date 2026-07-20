import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages=['zh','en','vi','ja'];
const html=fs.readFileSync('lesson-06.html','utf8');
const source=fs.readFileSync('lesson-06.js','utf8');
const css=fs.readFileSync('lesson-06.css','utf8');
const preview=fs.readFileSync('tests/lesson-06-preview.html','utf8');
const catalogPreview=fs.readFileSync('tests/lesson-06-catalog-preview.html','utf8');
const manifest=JSON.parse(fs.readFileSync('audio/lesson-06/manifest.json','utf8'));

for(const asset of ['lesson-06.js','lesson-06.css','course-catalog.js','audio-catalog.js','app-state.js'])assert.ok(html.includes(asset),`Missing ${asset}`);
assert.match(css,/@media\(max-width:760px\)/);
assert.match(css,/overflow-x:hidden/);
assert.match(css,/min-height:(?:44|46|48)px/);
for(const marker of ["params.get('step')","params.get('lang')","completed=params.get('completed')","nikigoLessonSession:lesson-06"])assert.ok(preview.includes(marker));
for(const marker of ["get('state')","'lesson-06'","'lesson-02':45","qaCatalog","#courses"])assert.ok(catalogPreview.includes(marker));
assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance|new Audio\s*\(|fetch\s*\(/i);
assert.doesNotMatch(source,/再次播放\s*[가-힣]|Play again\s*[가-힣]/u);
assert.doesNotMatch(source,/Object\.assign\(UI|"milk"|“牛奶”|“sữa”|「牛乳」/u,'Deprecated milk copy or runtime translation overrides remain.');
assert.match(source,/\['ㅑ','ㅣ','ㅒ','얘'\]/u);
assert.match(source,/\['ㅕ','ㅣ','ㅖ','예'\]/u);
assert.doesNotMatch(source,/[ㄱ-ㅎ]\s*\+\s*[ㅏ-ㅣ]\s*\+\s*[ㄱ-ㅎ]/u,'Lesson 6 must not introduce CVC or finals.');

const element=()=>({value:'',textContent:'',innerHTML:'',title:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){},closest(){return null;}});
const elements=new Map(['lessonStage','language','lessonName','progressLabel','progressCount','progressBar','progressTrack','homeButton','homeLogo'].map(id=>[id,element()]));
const storage=new Map();
const oldProfile={xp:250,completedLessons:['lesson-05'],lessonProgress:{'lesson-05':100,'lesson-03':42,'k0-lesson-06-plan':0},weeklyProgress:4,audioRate:.9,autoplayAudio:false,interfaceLanguage:'vi',guest:true,futureField:{keep:true}};
let profile=structuredClone(oldProfile);
const documentStub={getElementById:id=>elements.get(id)||element(),addEventListener(){},documentElement:{lang:''}};
const lessonWindow={location:{search:'?lang=en',href:''},navigator:{language:'en'},document:documentStub,localStorage:{getItem:key=>storage.get(key)??null,setItem:(key,value)=>storage.set(key,String(value))},NikigoState:{get:()=>profile,update:patch=>{profile=typeof patch==='function'?patch(profile):{...profile,...patch};return profile;}},scrollTo(){}};
lessonWindow.window=lessonWindow;
vm.runInNewContext(fs.readFileSync('audio-catalog.js','utf8'),lessonWindow,{filename:'audio-catalog.js'});
vm.runInNewContext(source,{window:lessonWindow,document:documentStub,URLSearchParams},{filename:'lesson-06.js'});
const api=lessonWindow.NikigoLesson06;

assert.ok(api);
assert.equal(api.LESSON_ID,'lesson-06');
assert.equal(api.PREREQUISITE,undefined);
assert.equal(api.SCREENS.length,18);
assert.deepEqual([...api.SCREENS],['intro','review','structure','oa','ueo','i-family','combine-practice','carrier','builder','split','near-group','spelling-practice','extended','words','challenge','retry','summary','complete']);
const englishKeys=Object.keys(api.UI.en);
for(const language of languages){for(const key of englishKeys)assert.notEqual(api.UI[language]?.[key],undefined,`${language}.${key} undefined`);assert.match(`${api.UI[language].nearTitle} ${api.UI[language].nearLead}`,/ㅙ|ㅚ|ㅞ/);assert.match(`${api.UI[language].extendedTitle} ${api.UI[language].extendedLead}`,/ㅒ|ㅖ/);assert.ok(api.UI[language].completeTag.length>8);assert.match(api.UI[language].xpEarned,/50 XP/);assert.match(api.UI[language].xpAlreadyClaimed,/XP/);}

const combinations={'ㅑ+ㅣ':'ㅒ','ㅕ+ㅣ':'ㅖ','ㅗ+ㅏ':'ㅘ','ㅗ+ㅐ':'ㅙ','ㅗ+ㅣ':'ㅚ','ㅜ+ㅓ':'ㅝ','ㅜ+ㅔ':'ㅞ','ㅜ+ㅣ':'ㅟ','ㅡ+ㅣ':'ㅢ'};
assert.equal(Object.keys(api.COMBINATIONS).length,9);
for(const [parts,result] of Object.entries(combinations)){const [first,second]=parts.split('+');assert.equal(api.compoundFromParts(first,second),result);}
assert.equal(api.compoundFromParts('ㅏ','ㅗ'),'');
for(const [vowel,syllable] of Object.entries({'ㅒ':'얘','ㅖ':'예','ㅘ':'와','ㅙ':'왜','ㅚ':'외','ㅝ':'워','ㅞ':'웨','ㅟ':'위','ㅢ':'의'}))assert.equal(api.carrierSyllable(vowel),syllable);
assert.equal(api.compose('ㅇ','ㅘ'),'와');
assert.equal(api.compose('ㅁ','ㅝ'),'뭐');
assert.equal(api.compose('ㅁ','ㅘ'),'','Out-of-scope combinations must not be generated.');
assert.deepEqual(JSON.parse(JSON.stringify(api.splitSyllable('뭐'))),{initial:'ㅁ',vowel:'ㅝ'});
assert.equal(api.splitSyllable('산'),null);

assert.equal(api.CHALLENGE.length,5);
assert.ok(api.CHALLENGE.every(question=>!('audio' in question)&&!('transcript' in question)),'Lesson 6 challenge must not fake listening before audio review.');
const fifthQuestion=api.CHALLENGE.find(question=>question.id==='c5');
assert.equal(fifthQuestion?.correct,'과자','Required word questions must stay inside the learned-vowel scope.');
assert.equal(fifthQuestion.options.filter(option=>option===fifthQuestion.correct).length,1,'Challenge 5 must contain exactly one correct option.');
assert.deepEqual(JSON.parse(JSON.stringify({zh:api.UI.zh.snack,en:api.UI.en.snack,vi:api.UI.vi.snack,ja:api.UI.ja.snack})),{zh:'零食',en:'snack',vi:'đồ ăn vặt',ja:'お菓子'});
for(const language of languages)assert.equal(api.UI[language].c5.includes(api.UI[language].snack),true,`${language} Challenge 5 prompt drifted from its translation.`);
assert.ok(api.UI.zh.wordsLead.includes('우유')&&api.UI.zh.wordsLead.includes('不作为必学词'));
assert.equal(api.WORDS.some(word=>word.text==='우유'),false,'우유 must not become required Lesson 6 vocabulary.');
assert.ok(api.UI.zh.noFakeListening.includes('不设置'));
assert.ok(api.UI.en.noFakeListening.includes('does not force'));
assert.ok(api.UI.vi.noFakeListening.includes('không ép'));
assert.ok(api.UI.ja.noFakeListening.includes('無理に'));
assert.ok(api.SPELLING_QUESTIONS.some(q=>q.correct==='ㅙ')&&api.SPELLING_QUESTIONS.some(q=>q.correct==='ㅚ')&&api.SPELLING_QUESTIONS.some(q=>q.correct==='ㅞ'));

let session=api.blankSession();
session=api.applyChallengeAnswer(session,api.CHALLENGE[0],'ㅝ');
assert.deepEqual([...session.mistakes],['c1']);
session=api.applyRetryAnswer(session,api.CHALLENGE[0],'ㅘ');
assert.deepEqual([...session.mistakes],[]);
const restored=api.normalizeSession({...session,step:14,built:['와','뭐','위'],challengeStarted:true});
assert.equal(restored.step,14);assert.equal(restored.challengeStarted,true);assert.deepEqual([...restored.built],['와','뭐','위']);
const completed=api.completionPatch(oldProfile);
assert.equal(api.AUDIO_RELEASE_READY,false,'Pending Lesson 6 audio must keep the lesson in structure-preview mode.');
assert.equal(completed.xp,250,'Structure preview must not award XP before every required audio item is approved.');
assert.equal(completed.lessonProgress['lesson-06'],undefined,'Structure preview must not mark Lesson 6 complete.');
assert.equal(completed.lessonProgress['lesson-03'],42);
assert.equal(completed.lessonProgress['k0-lesson-06-plan'],0,'Unknown historical placeholder state must not be deleted.');
assert.deepEqual(completed.futureField,{keep:true});
assert.equal(api.completionPatch(completed).xp,250,'Repeated structure preview must never award XP.');
for(const language of languages){
  assert.ok(api.UI[language].previewCompleteTag&&api.UI[language].previewCompleteTitle&&api.UI[language].previewCompleteLead&&api.UI[language].previewReward,`${language} preview completion copy is incomplete.`);
}

assert.deepEqual(JSON.parse(JSON.stringify(api.AUDIO_FILES)),{},'No similar or inexact hosted audio may be substituted.');
assert.equal(manifest.schemaVersion,2);
assert.equal(manifest.lesson,'lesson-06');
assert.equal(manifest.items.length,15);
assert.equal(new Set(manifest.items.map(item=>item.id)).size,15);
assert.equal(new Set(manifest.items.map(item=>item.file)).size,15);
assert.ok(manifest.items.some(item=>item.displayText==='과자'));
assert.equal(manifest.items.some(item=>item.displayText==='우유'),false,'우유 uses ㅠ and must not be a required Lesson 6 audio item.');
const syllableSpeech=['와','왜','외','워','웨','위','의','얘','예'];
const wordSpeech=['뭐','과자','여우','의자','왜','예'];
assert.deepEqual(manifest.items.filter(item=>item.audioType==='syllable').map(item=>item.speechText).sort(),syllableSpeech.sort());
assert.deepEqual(manifest.items.filter(item=>item.audioType==='word').map(item=>item.speechText).sort(),wordSpeech.sort());
for(const item of manifest.items){
  assert.equal(item.lessonId,'lesson-06');
  assert.equal(item.reviewStatus,'pending');
  assert.ok(item.displayText&&item.speechText&&item.expectedPronunciation&&item.pronunciationRule&&item.file&&item.voiceSource&&item.model&&item.commercialUseBasis);
  assert.ok(Object.hasOwn(item,'targetSymbol')&&Object.hasOwn(item,'generationDate')&&Object.hasOwn(item,'nativeReviewer')&&Object.hasOwn(item,'reviewNotes'));
  assert.ok(['syllable','word'].includes(item.audioType));
  assert.equal(item.pronunciationType,item.audioType==='syllable'?'full-syllable':'full-word');
  if(item.audioType==='syllable')assert.equal(api.CARRIERS[item.targetSymbol],item.speechText);
  else assert.equal(item.targetSymbol,null);
  assert.equal(fs.existsSync(`audio/lesson-06/${item.file}`),false,'Lesson 6 must not generate audio in this task.');
}

const catalogContext={window:{}};catalogContext.window.window=catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),catalogContext,{filename:'course-catalog.js'});
const course=catalogContext.window.NIKIGO_COURSES.find(item=>item.stableId==='lesson-06');
assert.equal(course.displayNumber,6);assert.equal(course.file,'lesson-06.html');assert.equal(course.status,'available');assert.equal(course.accessStatus,'available');assert.equal(course.releaseStatus,'preview');assert.equal(course.audioStatus,'pending');assert.deepEqual([...course.prerequisites],[]);assert.deepEqual([...course.recommendedPrerequisites],['lesson-05']);assert.equal(course.requiresCompletion,false);
assert.equal(catalogContext.window.NIKIGO_COURSES.some(item=>item.stableId==='k0-lesson-06-plan'),false);
assert.equal(catalogContext.window.NIKIGO_COURSE_UNLOCKED(course,[]),true,'Audio-pending Lesson 6 must remain available as a structural preview.');
assert.match(source,/releaseNotice/);
assert.match(source,/lesson06ReleaseNotice/);
const lesson7=catalogContext.window.NIKIGO_COURSES.find(item=>item.stableId==='lesson-04');
assert.equal(lesson7.displayNumber,7);assert.equal(lesson7.file,'lesson-04.html');

console.log('Validated Lesson 6: 18 steps, four languages, direct structural-preview access, compound-vowel spelling, no fake listening, resume state, exact-audio policy, migration safety, and completion/XP blocked until audio approval.');
