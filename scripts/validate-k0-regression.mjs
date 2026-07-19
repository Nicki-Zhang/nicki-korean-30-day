import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

await import(new URL('../audio-catalog.js', import.meta.url));
const languages = ['zh','en','vi','ja'];
const lessonFiles = ['lesson-00.html','lesson-01.html','lesson-02.html','lesson-03.html','lesson-consonant-contrast.html'];

function inlineScripts(file) {
  return [...fs.readFileSync(file,'utf8').matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(match=>match[1]).filter(value=>value.trim());
}

function lessonConfig(file) {
  const soundWindow={}; soundWindow.window=soundWindow;
  vm.runInNewContext(fs.readFileSync('hangul-sound-data.js','utf8'),soundWindow,{filename:'hangul-sound-data.js'});
  let config;
  vm.runInNewContext(inlineScripts(file).at(-1),{
    window:{NikigoAudio:globalThis.NikigoAudio,NikigoHangulSoundData:soundWindow.NikigoHangulSoundData},
    NikigoLesson:{mount:value=>{config=value;}}
  },{filename:file});
  return config;
}

for(const file of lessonFiles){
  const source=fs.readFileSync(file,'utf8');
  assert.ok(!source.includes('\uFFFD'),`${file} contains a Unicode replacement character`);
  assert.doesNotMatch(source,/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u,`${file} contains an abnormal control character`);
  assert.doesNotMatch(source,/[\u0340-\u034E]/u,`${file} contains an unstable IPA combining mark`);
  for(const [index,script] of inlineScripts(file).entries())new vm.Script(script,{filename:`${file}:inline-${index}`});
}

const engineSource=fs.readFileSync('lesson-engine.js','utf8');
const engineWindow={};engineWindow.window=engineWindow;
vm.runInNewContext(engineSource,{window:engineWindow},{filename:'lesson-engine.js'});
const engine=engineWindow.NikigoLesson;
const lesson3=lessonConfig('lesson-03.html');
const resumed=engine.normalizeLessonSession({
  version:1,index:11,
  heard:{vowels:[0,1,99],consonants:[0,1,2],words:[0,1,2]},
  built:['바','사','여','非法'],phraseHeard:true,selfCheck:'good',
  practiceAnswers:{0:{choice:0},1:{choice:0},99:{choice:0}},
  quizAnswers:{0:{choice:0},1:{choice:1}},
  builderConsonant:'ㅇ',builderVowel:'ㅕ'
},lesson3,17);
assert.equal(resumed.index,11);
assert.deepEqual([...resumed.heard.vowels],[0,1]);
assert.deepEqual([...resumed.built],['바','사','여']);
assert.equal(resumed.phraseHeard,true);
assert.equal(resumed.practiceAnswers[0].correct,0===lesson3.practice[0].answer);
assert.equal(resumed.quizAnswers[0].correct,0===lesson3.quiz[0].answer);
assert.equal(resumed.quizAnswers[1].correct,1===lesson3.quiz[1].answer);
assert.equal(resumed.practiceAnswers[99],undefined);
assert.equal(resumed.builderConsonant,'ㅇ');
assert.equal(resumed.builderVowel,'ㅕ');
assert.equal(engine.normalizeLessonSession({version:0},lesson3,17),null);
for(const marker of ['saveSession();','restoreSession();','firstCompletion','if (firstCompletion)','questionPlayerStates.clear()'])assert.ok(engineSource.includes(marker),`lesson engine missing ${marker}`);
assert.match(engineSource,/if \(!answers\[questionIndex\]\) answers\[questionIndex\]/,'Returning to a question must not overwrite its answer.');
assert.match(engineSource,/class="buildResult"[^>]+aria-label="\$\{result \? soundUi\('listenDemo'/,'Builder playback needs an explicit example-syllable label.');

const catalogWindow={};catalogWindow.window=catalogWindow;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),catalogWindow,{filename:'course-catalog.js'});
const catalog=catalogWindow.NIKIGO_COURSES;
assert.deepEqual([...catalog.slice(0,5).map(course=>course.stableId)],['lesson-00','lesson-01','lesson-02','lesson-03','k0-consonant-contrast']);
assert.deepEqual([...catalog.slice(0,5).map(course=>course.displayNumber)],[0,1,2,3,4]);
for(const course of catalog.filter(course=>course.status==='comingSoon'))assert.equal(course.file,null,`${course.stableId} must not have a link`);

const genericQuestions=['lesson-01.html','lesson-02.html','lesson-03.html'].flatMap(file=>{
  const config=lessonConfig(file);return [...config.practice,...config.quiz].filter(question=>question.audio).map(question=>({file,question}));
});
assert.equal(genericQuestions.length,12);
for(const {file,question} of genericQuestions){
  for(const language of languages){
    const before=engine.questionPlayerModel(question,language,'replay',false,'translation');
    const playerRegion=JSON.stringify(before);
    const transcript=Array.isArray(question.audio)?question.audio.join(' · '):question.audio;
    assert.ok(!playerRegion.includes(transcript),`${file} ${language} replay leaks ${transcript}`);
    assert.equal(before.transcript,'');
    const after=engine.questionPlayerModel(question,language,'played',true,'translation');
    assert.equal(after.transcript,transcript);
  }
}

const soundSource=fs.readFileSync('hangul-sound-data.js','utf8');
assert.doesNotMatch(soundSource,/[\u0300-\u036F]/u);
const contrastSource=fs.readFileSync('lesson-consonant-contrast.js','utf8');
assert.match(contrastSource,/embedded\?'':`<p class="testAudioDisclosure">/,'Embedded challenge must not duplicate the page audio disclosure.');
assert.doesNotMatch(contrastSource,/再次播放\s+\$\{|Play again\s+\$\{|再次播放\s*\{content\}/);

for(const cssFile of ['lesson-player.css','lesson-consonant-contrast.css','player-privacy.css','nikigo-app.html']){
  const source=fs.readFileSync(cssFile,'utf8');
  assert.match(source,/@media\s*\(max-width:/,`${cssFile} lacks a mobile/tablet breakpoint`);
}
const privacyCss=fs.readFileSync('player-privacy.css','utf8');
for(const marker of ['max-width: 100%','width: 100%','overflow-wrap: anywhere'])assert.ok(privacyCss.includes(marker),`privacy CSS missing ${marker}`);
const playerCss=fs.readFileSync('lesson-player.css','utf8');
assert.match(playerCss,/min-height:\s*4[4-9]px|padding:\s*1[2-9]px/,'Lesson controls need a touch-sized target.');
const realDomLayoutTest=fs.readFileSync('quality-fix/mobile-layout-regression.html','utf8');
for(const width of [390,768,1440])assert.ok(realDomLayoutTest.includes(`width:${width}`),`Real DOM layout test must render ${width}px.`);
for(const selector of ['html','body','.top','.progressWrap','.stage','.contrastCard','.questionAudioPlayer','.quizOptions'])assert.ok(realDomLayoutTest.includes(`'${selector}'`),`Real DOM layout test is missing ${selector}.`);
for(const assertion of ['scrollWidth>report.viewport.width','item.rect.height<44||item.rect.width<44','report.heading.width<'])assert.ok(realDomLayoutTest.includes(assertion),`Real DOM layout test is missing ${assertion}.`);
const feedbackDomTest=fs.readFileSync('quality-fix/challenge-feedback-regression.html','utf8');
for(const lesson of ['lesson-01','lesson-02','lesson-03'])assert.ok(feedbackDomTest.includes(lesson),`Real DOM feedback test is missing ${lesson}.`);
for(const language of languages)assert.ok(feedbackDomTest.includes(`'${language}'`),`Real DOM feedback test is missing ${language}.`);
for(const key of ['correctAnswerLabel','teachingPointLabel','vowelFeedback','syllableFeedback','wordFeedback','phraseFeedback'])for(const language of languages)assert.ok(engine.uiCopy[language][key],`${language} is missing ${key}.`);
for(const marker of ["soundUi('correctAnswerLabel')","soundUi('teachingPointLabel')","questionTeachingPoint(question)"])assert.ok(engineSource.includes(marker),`Generic challenge feedback is missing ${marker}.`);
for(const key of ['correctAnswerLabel','teachingPointLabel'])assert.equal((contrastSource.match(new RegExp(`${key}:`,'g'))||[]).length,4,`Contrast four-language copy is missing ${key}.`);
assert.doesNotMatch(contrastSource,/(?:Play|Phát lại|再生)[^'\n]*\{(?:content|sequence)\}/,'Replay labels must never interpolate answer content.');

console.log(`Validated K0 Lessons 0–4: resume-safe Lesson 3 session, 12 private audio questions, one-time XP guard, safe course links, four languages, text quality, and responsive CSS contracts.`);
