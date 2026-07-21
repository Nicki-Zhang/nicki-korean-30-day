import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

await import(new URL('../audio-catalog.js', import.meta.url));
const languages = ['zh', 'en', 'vi', 'ja'];

const dataWindow = {};
dataWindow.window = dataWindow;
vm.runInNewContext(fs.readFileSync('hangul-sound-data.js', 'utf8'), dataWindow, { filename:'hangul-sound-data.js' });
const soundData = dataWindow.NikigoHangulSoundData;
const allowedAudioTypes = new Set(['letter-name','vowel-sound','onset-example','final-example','word','sentence']);
assert.equal(soundData.items.length, 40);
assert.equal(soundData.vowels.length, 21);
assert.equal(soundData.consonants.length, 19);
assert.equal(new Set(soundData.items.map(item => item.symbol)).size, 40);

const requiredFields = ['symbol','letterName','letterNameAudio','vowelCarrierSyllable','vowelAudio','demoSyllable','demoAudio','finalExample','finalExampleAudio','audioType'];
const expectedConsonants = new Map([
  ['ㄱ',['기역','가']], ['ㄴ',['니은','나']], ['ㄷ',['디귿','다']], ['ㄹ',['리을','라']], ['ㅁ',['미음','마']],
  ['ㅂ',['비읍','바']], ['ㅅ',['시옷','사']], ['ㅇ',['이응','아']], ['ㅈ',['지읒','자']], ['ㅎ',['히읗','하']],
  ['ㅋ',['키읔','카']], ['ㅌ',['티읕','타']], ['ㅍ',['피읖','파']], ['ㅊ',['치읓','차']],
  ['ㄲ',['쌍기역','까']], ['ㄸ',['쌍디귿','따']], ['ㅃ',['쌍비읍','빠']], ['ㅆ',['쌍시옷','싸']], ['ㅉ',['쌍지읒','짜']]
]);

for (const item of soundData.items) {
  for (const field of requiredFields) assert.ok(Object.hasOwn(item, field), `${item.symbol} missing explicit field ${field}`);
  assert.equal(item.reviewStatus, 'pending', `${item.symbol} must remain pending`);
  assert.ok(allowedAudioTypes.has(item.audioType), `${item.symbol} has invalid audioType ${item.audioType}`);
  for (const soundObject of item.soundObjects) {
    assert.ok(allowedAudioTypes.has(soundObject.audioType), `${item.symbol} sound object has invalid audioType`);
    assert.ok(!/^[ㄱ-ㅎ]$/u.test(soundObject.speechText), `${item.symbol} uses an isolated consonant as speechText`);
  }
  assert.ok(item.soundHint.startsWith('[') && item.soundHint.endsWith(']'), `${item.symbol} needs an approximate hint`);
  if (item.type === 'vowel') {
    assert.ok(item.vowelCarrierSyllable, `${item.symbol} missing vowelCarrierSyllable`);
    assert.ok(item.mouthHintKey, `${item.symbol} missing mouthHintKey`);
    assert.equal(item.audioType, 'vowel-sound');
    if (item.vowelAudio) assert.ok(fs.existsSync(item.vowelAudio), `${item.symbol} missing ${item.vowelAudio}`);
  } else {
    assert.deepEqual([item.letterName, item.demoSyllable], expectedConsonants.get(item.symbol), `${item.symbol} letter-name/demo mapping mismatch`);
    assert.ok(item.letterName, `${item.symbol} missing letterName`);
    assert.equal(item.letterNameAudio, null, `${item.symbol} letter-name audio must stay pending`);
    assert.ok(item.demoSyllable, `${item.symbol} missing demoSyllable`);
    assert.equal(item.audioType, 'onset-example');
    assert.equal(Object.hasOwn(item, 'audio'), false, `${item.symbol} must not use ambiguous audio`);
    if (item.demoAudio) assert.ok(fs.existsSync(item.demoAudio), `${item.symbol} missing ${item.demoAudio}`);
  }
}

function loadLesson(file, lessonId) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).filter(Boolean);
  let config;
  const lessonWindow = { NikigoAudio:globalThis.NikigoAudio, NikigoHangulSoundData:soundData };
  vm.runInNewContext(scripts.at(-1), { window:lessonWindow, NikigoLesson:{ mount:value => { config = value; } } }, { filename:file });
  assert.equal(config.id, lessonId);
  assert.match(html, /hangul-sound-data\.js/);
  return config;
}

const expected = {
  'lesson-01': { vowels:['ㅏ','ㅓ','ㅗ','ㅜ'], consonants:['ㄱ','ㄴ'] },
  'lesson-02': { vowels:['ㅡ','ㅣ','ㅐ','ㅔ'], consonants:['ㄷ','ㄹ','ㅁ'] },
  'lesson-03': { vowels:['ㅑ','ㅕ'], consonants:['ㅂ','ㅅ','ㅇ'] }
};
const buttonMappings = [];
for (const [lessonId, symbols] of Object.entries(expected)) {
  const config = loadLesson(`${lessonId}.html`, lessonId);
  assert.deepEqual([...config.vowels.map(item => item.symbol)], symbols.vowels);
  assert.deepEqual([...config.consonants.map(item => item.symbol)], symbols.consonants);
  for (const item of config.vowels) {
    assert.equal(item.type, 'vowel');
    assert.equal(config.audioFiles[item.vowelCarrierSyllable], item.vowelAudio, `${lessonId} ${item.symbol} approved vowel mapping mismatch`);
    buttonMappings.push({ lessonId, label:`听元音${item.symbol}`, speechText:item.vowelCarrierSyllable, file:item.vowelAudio });
  }
  for (const item of config.consonants) {
    assert.equal(item.type, 'consonant');
    assert.equal(item.letterNameAudio, null);
    assert.equal(config.audioFiles[item.demoSyllable], item.demoAudio, `${lessonId} ${item.symbol} approved demo mapping mismatch`);
    buttonMappings.push({ lessonId, label:`听示例音节 ${item.demoSyllable}`, speechText:item.demoSyllable, file:item.demoAudio });
  }
}

const lesson00Html = fs.readFileSync('lesson-00.html', 'utf8');
const lesson00Source = fs.readFileSync('lesson-00.js', 'utf8');
assert.equal((lesson00Html.match(/data-category=/g) || []).length, 5);
assert.match(lesson00Source, /data-symbol/);
assert.match(lesson00Source, /letterNamePending/);
assert.match(lesson00Source, /if \(!resolved\.playable\) return/);
assert.match(lesson00Source, /preservesPitch = true/);
assert.match(lesson00Source, /vowelCarrierRule/);
assert.match(lesson00Source, /silentIeung/);

const documentStub = { addEventListener() {} };
const mapWindow = { document:documentStub, location:{ search:'', href:'' }, navigator:{ language:'en' } };
mapWindow.window = mapWindow;
vm.runInNewContext(lesson00Source, { window:mapWindow, URLSearchParams }, { filename:'lesson-00.js' });
const mapApi = mapWindow.NikigoLesson00;
const mapEnglishKeys = Object.keys(mapApi.COPY.en);
const hintKeys = soundData.vowels.map(item => item.mouthHintKey);
for (const language of languages) {
  for (const key of mapEnglishKeys) assert.notEqual(mapApi.COPY[language]?.[key], undefined, `lesson-00 ${language}.${key} undefined`);
  for (const key of hintKeys) assert.ok(mapApi.MOUTH_HINTS[language]?.[key], `lesson-00 ${language} mouth hint ${key} missing`);
}

const engineSource = fs.readFileSync('lesson-engine.js', 'utf8');
const engineWindow = {};
engineWindow.window = engineWindow;
vm.runInNewContext(engineSource, { window:engineWindow }, { filename:'lesson-engine.js' });
const uiEnglishKeys = Object.keys(engineWindow.NikigoLesson.uiCopy.en);
for (const language of languages) for (const key of uiEnglishKeys) assert.notEqual(engineWindow.NikigoLesson.uiCopy[language]?.[key], undefined, `engine ${language}.${key} undefined`);
assert.doesNotMatch(engineSource, /class="play">▶<\/span>/);
assert.doesNotMatch(engineSource, /wordIcon">\$\{word\[4\]\} · ▶/);
assert.match(engineSource, /listenVowelAria/);
assert.match(engineSource, /letterNameAudio \? '' : 'disabled'/);
assert.match(engineSource, /demoAudio \? '' : 'disabled'/);
assert.match(engineSource, /listenFullWord/);
assert.match(engineSource, /听字母名称/);
assert.match(engineSource, /听示例音节/);
assert.match(engineSource, /vowelCarrierRule/);
assert.match(engineSource, /silentIeung/);

const lesson04 = fs.readFileSync('lesson-04.html', 'utf8');
const lesson07 = fs.readFileSync('lesson-07.js', 'utf8');
for (const word of ['산','몸','공','물']) {
  assert.match(lesson07, new RegExp(`word:'${word}'`));
}
assert.match(lesson04,/lesson-07\.html/);
assert.match(lesson07,/listenWord:'听完整单词 \{word\}'/);

const hostedMapPreviews = soundData.vowels.filter(item => item.vowelAudio).length + soundData.consonants.filter(item => item.demoAudio).length;
assert.equal(hostedMapPreviews, 18);
assert.equal(soundData.consonants.filter(item => item.letterNameAudio).length, 0);
console.log(`Validated 40 interactive Hangul objects, ${hostedMapPreviews} reusable Lesson 0 previews, ${buttonMappings.length} explicit Lesson 1–3 sound mappings, and four UI languages.`);
