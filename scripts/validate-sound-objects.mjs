import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

await import(new URL('../audio-catalog.js', import.meta.url));
const languages = ['zh', 'en', 'vi', 'ja'];

const dataWindow = {};
dataWindow.window = dataWindow;
vm.runInNewContext(fs.readFileSync('hangul-sound-data.js', 'utf8'), dataWindow, { filename:'hangul-sound-data.js' });
const soundData = dataWindow.NikigoHangulSoundData;
assert.equal(soundData.items.length, 40);
assert.equal(soundData.vowels.length, 21);
assert.equal(soundData.consonants.length, 19);
assert.equal(new Set(soundData.items.map(item => item.symbol)).size, 40);

for (const item of soundData.items) {
  assert.equal(item.reviewStatus, 'pending', `${item.symbol} must remain pending`);
  assert.ok(item.soundHint.startsWith('[') && item.soundHint.endsWith(']'), `${item.symbol} needs an approximate hint`);
  if (item.type === 'vowel') {
    assert.ok(item.spokenExample, `${item.symbol} missing spokenExample`);
    assert.ok(item.mouthHintKey, `${item.symbol} missing mouthHintKey`);
    if (item.audio) assert.ok(fs.existsSync(item.audio), `${item.symbol} missing ${item.audio}`);
  } else {
    assert.ok(item.letterName, `${item.symbol} missing letterName`);
    assert.equal(item.letterNameAudio, null, `${item.symbol} letter-name audio must stay pending`);
    assert.ok(item.demoSyllable, `${item.symbol} missing demoSyllable`);
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
    assert.equal(config.audioFiles[item.spokenExample], item.audio, `${lessonId} ${item.symbol} mapping mismatch`);
    buttonMappings.push({ lessonId, label:`听元音${item.symbol}`, speechText:item.spokenExample, file:item.audio });
  }
  for (const item of config.consonants) {
    assert.equal(item.type, 'consonant');
    assert.equal(item.letterNameAudio, null);
    assert.equal(config.audioFiles[item.demoSyllable], item.demoAudio, `${lessonId} ${item.symbol} demo mapping mismatch`);
    buttonMappings.push({ lessonId, label:`听示例音节 ${item.demoSyllable}`, speechText:item.demoSyllable, file:item.demoAudio });
  }
}

const lesson00Html = fs.readFileSync('lesson-00.html', 'utf8');
const lesson00Source = fs.readFileSync('lesson-00.js', 'utf8');
assert.equal((lesson00Html.match(/data-category=/g) || []).length, 5);
assert.match(lesson00Source, /data-symbol/);
assert.match(lesson00Source, /letterNamePending/);
assert.match(lesson00Source, /if \(!file\) return/);
assert.match(lesson00Source, /preservesPitch = true/);

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

const lesson04 = fs.readFileSync('lesson-04.html', 'utf8');
for (const word of ['산','몸','공','물']) {
  assert.match(lesson04, new RegExp(`word:'${word}'`));
  assert.match(lesson04, new RegExp(`audio:'${word}'`));
}
assert.match(engineSource, /soundUi\('listenFullWord',\{word:example\.word\}\)/);

const hostedMapPreviews = soundData.vowels.filter(item => item.audio).length + soundData.consonants.filter(item => item.demoAudio).length;
assert.equal(hostedMapPreviews, 18);
assert.equal(soundData.consonants.filter(item => item.letterNameAudio).length, 0);
console.log(`Validated 40 interactive Hangul objects, ${hostedMapPreviews} reusable Lesson 0 previews, ${buttonMappings.length} explicit Lesson 1–3 sound mappings, and four UI languages.`);
