import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

await import(new URL('../audio-catalog.js', import.meta.url));

const languages = ['zh', 'en', 'vi', 'ja'];
const states = ['initial', 'loading', 'playing', 'played', 'replay', 'autoplay', 'fallback', 'error'];
const forbiddenCombiningMarks = /[\u0300-\u036f]/u;
const sample = { audio:'안녕하세요', options:['안녕', '안녕하세요', '사람'], answer:1 };
const sampleTranslation = '你好';

function assertPrivate(model, context) {
  const playerRegion = JSON.stringify({
    label:model.label,
    aria:model.aria,
    transcript:model.transcript,
    translation:model.translation,
    correctAnswer:model.correctAnswer,
    category:model.category
  });
  for (const secret of [sample.audio, sampleTranslation, sample.options[sample.answer]]) {
    assert.ok(!playerRegion.includes(secret), `${context} leaked ${secret}`);
  }
  assert.ok(model.label, `${context} has no visible label`);
  assert.ok(model.aria, `${context} has no accessible name`);
}

const engineSource = fs.readFileSync('lesson-engine.js', 'utf8');
const engineWindow = {};
engineWindow.window = engineWindow;
vm.runInNewContext(engineSource, { window:engineWindow }, { filename:'lesson-engine.js' });
const engine = engineWindow.NikigoLesson;
assert.ok(engine?.questionPlayerModel);
for (const language of languages) {
  for (const state of states) {
    assertPrivate(engine.questionPlayerModel(sample, language, state, false, sampleTranslation), `generic ${language}/${state}`);
  }
  const revealed = engine.questionPlayerModel(sample, language, 'played', true, sampleTranslation);
  assert.equal(revealed.transcript, sample.audio);
  assert.equal(revealed.translation, sampleTranslation);
  assert.equal(revealed.correctAnswer, sample.options[sample.answer]);
}
assert.match(engineSource, /data-action="question-audio"/);
assert.doesNotMatch(engineSource, /data-action="question-audio"[^>]+data-value=/);
assert.doesNotMatch(engineSource, /question\.audio\}\s*<\/b>/);

const element = () => ({
  value:'', textContent:'', innerHTML:'', title:'', style:{}, dataset:{},
  classList:{ add(){}, remove(){}, toggle(){} }, setAttribute(){}, addEventListener(){}
});
const elements = new Map(['lessonStage','language','lessonName','progressLabel','progressCount','progressBar','progressTrack','homeButton','homeLogo','toast'].map(id => [id, element()]));
const documentStub = { getElementById:id => elements.get(id) || element(), addEventListener(){}, documentElement:{lang:''} };
const contrastSource = fs.readFileSync('lesson-consonant-contrast.js', 'utf8');
const contrastWindow = {
  location:{search:'?lang=zh',href:''}, navigator:{language:'zh'}, document:documentStub,
  localStorage:{getItem(){return null;},setItem(){}},
  NikigoState:{get:()=>({completedLessons:[],lessonProgress:{},audioRate:1,autoplayAudio:false}),update:value=>value},
  setTimeout(){}, scrollTo(){}, speechSynthesis:null
};
contrastWindow.window = contrastWindow;
vm.runInNewContext(contrastSource, {window:contrastWindow,document:documentStub,URLSearchParams,Audio:class{},SpeechSynthesisUtterance:class{}}, {filename:'lesson-consonant-contrast.js'});
const contrast = contrastWindow.NikigoContrastLesson;
assert.ok(contrast?.questionPlayerModel);
for (const language of languages) {
  elements.get('language').value = language;
  contrastWindow.changeLanguage?.(language);
  for (const state of states) {
    const model = contrast.questionPlayerModel({audio:sample.audio,correct:'plain'}, state, false);
    assertPrivate({...model,correctAnswer:model.category}, `contrast ${language}/${state}`);
  }
  const revealed = contrast.questionPlayerModel({audio:sample.audio,correct:'plain'}, 'played', true);
  assert.equal(revealed.transcript, sample.audio);
  assert.equal(revealed.category, 'plain');
}
assert.doesNotMatch(contrastSource, /data-action="question-audio"[^>]+data-(?:sequence|syllable|value)=/);
assert.doesNotMatch(contrastSource, /再次播放\s*\{content\}|再次连续播放\s*\{sequence\}|设备韩语语音\s*·\s*待人工试听/);

function loadLessonConfig(file) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).filter(Boolean);
  let config;
  const soundWindow = {};
  soundWindow.window = soundWindow;
  vm.runInNewContext(fs.readFileSync('hangul-sound-data.js','utf8'), {window:soundWindow}, {filename:'hangul-sound-data.js'});
  vm.runInNewContext(scripts.at(-1), {window:{NikigoAudio:globalThis.NikigoAudio,NikigoHangulSoundData:soundWindow.NikigoHangulSoundData},NikigoLesson:{mount:value=>{config=value;}}}, {filename:file});
  return config;
}

let genericAudioQuestions = 0;
for (const file of ['lesson-01.html','lesson-02.html','lesson-03.html']) {
  const config = loadLessonConfig(file);
  const questions = [...(config.practice || []), ...(config.quiz || [])].filter(question => question.audio);
  genericAudioQuestions += questions.length;
  assert.ok(fs.readFileSync(file,'utf8').includes('player-privacy.css'), `${file} does not load privacy styles`);
}
assert.equal(genericAudioQuestions, 12);
const lesson07Source=fs.readFileSync('lesson-07.js','utf8');
assert.doesNotMatch(lesson07Source,/speechSynthesis|SpeechSynthesisUtterance/);
assert.match(lesson07Source,/resolve\?\.\('바','syllable',AUDIO_LESSON_ID\)/);
assert.match(lesson07Source,/BASE_SYLLABLE_AUDIO\?\.playable/);
assert.match(lesson07Source,/audioUnavailable/);
assert.match(lesson07Source,/disabled aria-disabled="true"/);
assert.equal(Object.keys(contrast.QUESTIONS).length, 6);

const reviewSource = fs.readFileSync('review.html', 'utf8');
assert.doesNotMatch(reviewSource, /data-value="\$\{item\.audio\}"/);
assert.match(reviewSource, /item\.kind!=='listen'\|\|answer/);
assert.match(reviewSource, /playKorean\(session\[index\]\.item\)/);
assert.match(reviewSource, /currentAudio\.onended=next/);
assert.doesNotMatch(reviewSource, /speechSynthesis|SpeechSynthesisUtterance|getVoices/);
assert.doesNotMatch(reviewSource, /设备韩语语音\s*·\s*待人工试听/);
const reviewContext = { window:{} };
reviewContext.window.window = reviewContext.window;
vm.runInNewContext(fs.readFileSync('review-catalog.js','utf8'), reviewContext, {filename:'review-catalog.js'});
const reviewListenCount = Object.values(reviewContext.window.NIKIGO_REVIEW_CATALOG.all).filter(item => item.kind === 'listen').length;
assert.equal(reviewListenCount, 18);

const soundWindow = {};
soundWindow.window = soundWindow;
vm.runInNewContext(fs.readFileSync('hangul-sound-data.js','utf8'), {window:soundWindow}, {filename:'hangul-sound-data.js'});
const soundItems = soundWindow.NikigoHangulSoundData.items;
for (const item of soundItems) {
  assert.ok(item.soundHint, `${item.symbol} has no approximation`);
  assert.doesNotMatch(item.soundHint, forbiddenCombiningMarks, `${item.symbol} contains a combining IPA mark`);
}
const contrastItems = contrast.GROUPS.flatMap(group => group.items);
assert.equal(contrastItems.length, 14);
for (const item of contrastItems) {
  assert.doesNotMatch(item.approximation, forbiddenCombiningMarks, `${item.syllable} contains a combining IPA mark`);
  assert.match(item.approximation, /^[\x00-\x7f]*$/u, `${item.syllable} approximation is not cross-device plain text`);
}

const scanned = [
  ...fs.readdirSync('.').filter(file => /^lesson-.*\.(?:html|js|css)$/.test(file)),
  'lesson-engine.js','review.html','review.css','player-privacy.css','hangul-sound-data.js'
];
for (const file of new Set(scanned)) {
  const source = fs.readFileSync(file,'utf8');
  assert.ok(!source.includes('\uFFFD'), `${file} contains a Unicode replacement character`);
  assert.doesNotMatch(source, /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/u, `${file} contains an unexpected control character`);
}
const privacyCss = fs.readFileSync('player-privacy.css','utf8');
assert.match(privacyCss, /overflow-wrap:\s*anywhere/);
assert.match(privacyCss, /@media\s*\(max-width:\s*600px\)/);
const worker = fs.readFileSync('sw.js','utf8');
assert.match(worker, /nikigo-v26-course-identity-content-audit/);
assert.match(worker, /\.\/player-privacy\.css/);

console.log(`Validated answer privacy for ${genericAudioQuestions + 6} course audio questions and ${reviewListenCount} review listening items across ${states.length} states and ${languages.length} languages; checked ${soundItems.length + contrastItems.length} approximation hints.`);
