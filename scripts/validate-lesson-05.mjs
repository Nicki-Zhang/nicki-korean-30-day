import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages = ['zh', 'en', 'vi', 'ja'];
const html = fs.readFileSync('lesson-05.html', 'utf8');
const source = fs.readFileSync('lesson-05.js', 'utf8');
const css = fs.readFileSync('lesson-05.css', 'utf8');
const layoutFixture = fs.readFileSync('tests/lesson-05-layout-regression.html', 'utf8');
const previewFixture = fs.readFileSync('tests/lesson-05-preview.html', 'utf8');
const screenshotFixture = fs.readFileSync('tests/lesson-05-screenshot-frame.html', 'utf8');

for (const asset of [
  'lesson-05.js',
  'lesson-05.css',
  'lesson-05-classic-focus.js',
  'assets/classic-focus-tokens.css',
  'assets/classic-focus-shell.css',
  'assets/classic-focus-shell.js',
  'course-catalog.js',
  'audio-catalog.js',
  'app-state.js'
]) {
  assert.match(html, new RegExp(asset.replaceAll('.', '\\.')));
}
assert.match(css, /@media \(max-width: 767px\)/);
assert.match(css, /min-height:\s*(?:44|46|48)px/);
assert.match(html, /classicFocusShell classicFocusFoundation classicFocusSyllable/);
assert.match(html, /classicFocusCard lesson05Card/);
for (const marker of ['390 builder', '390 challenge', '768 split', '1440 challenge', 'getBoundingClientRect', 'scrollWidth', 'smallControls']) assert.match(layoutFixture, new RegExp(marker));
for (const marker of ["params.get('fresh')", "id !== 'lesson-05'"]) assert.match(previewFixture, new RegExp(marker.replaceAll('(', '\\(').replaceAll(')', '\\)')));
for (const marker of ["params.get('width')", "params.get('height')", "params.get('step')", "frame.width = width", "frame.height = height"]) assert.ok(screenshotFixture.includes(marker));
assert.doesNotMatch(source, /speechSynthesis|SpeechSynthesisUtterance|openai|fetch\s*\(/i);
assert.doesNotMatch(source, /[ㄱ-ㅎ]\s*\+\s*[ㅏ-ㅣ]\s*\+\s*[ㄱ-ㅎ]/u, 'Lesson 5 must not introduce CVC/batchim construction.');
assert.doesNotMatch(source, /K0 · COMPLETE/, 'The completion tag must identify Lesson 5, not the whole K0 level.');

const element = () => ({
  value: '', textContent: '', innerHTML: '', title: '', style: {}, dataset: {},
  classList: { add() {}, remove() {}, toggle() {} }, setAttribute() {}, addEventListener() {}, closest() { return null; }
});
const elements = new Map(['lessonStage', 'language', 'lessonName', 'progressLabel', 'progressCount', 'progressBar', 'progressTrack', 'homeButton', 'homeLogo'].map(id => [id, element()]));
const storage = new Map();
const oldProfile = {
  xp: 200,
  completedLessons: ['lesson-01', 'k0-consonant-contrast'],
  lessonProgress: { 'lesson-03': 61 },
  weeklyProgress: 3,
  audioRate: 0.9,
  autoplayAudio: false,
  interfaceLanguage: 'vi',
  guest: true,
  futureField: { keep: true }
};
let profile = structuredClone(oldProfile);
const documentStub = { getElementById: id => elements.get(id) || element(), addEventListener() {}, documentElement: { lang: '' } };
const lessonWindow = {
  location: { search: '?lang=en', href: '' }, navigator: { language: 'en' }, document: documentStub,
  localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, String(value)) },
  NikigoState: { get: () => profile, update: patch => { profile = typeof patch === 'function' ? patch(profile) : { ...profile, ...patch }; return profile; } },
  scrollTo() {}
};
lessonWindow.window = lessonWindow;
vm.runInNewContext(fs.readFileSync('audio-catalog.js', 'utf8'), lessonWindow, { filename: 'audio-catalog.js' });
vm.runInNewContext(source, { window: lessonWindow, document: documentStub, URLSearchParams, Audio: class {} }, { filename: 'lesson-05.js' });
const api = lessonWindow.NikigoLesson05;

assert.ok(api);
assert.equal(api.LESSON_ID, 'lesson-05');
assert.equal(api.PREREQUISITE, undefined);
assert.equal(api.SCREENS.length, 16);
assert.deepEqual([...api.SCREENS], ['intro', 'block', 'left-concept', 'left-examples', 'left-practice', 'top-concept', 'top-examples', 'top-practice', 'ieung-concept', 'ieung-examples', 'builder', 'split', 'challenge', 'retry', 'summary', 'complete']);

const englishKeys = Object.keys(api.UI.en);
for (const language of languages) {
  for (const key of englishKeys) assert.notEqual(api.UI[language]?.[key], undefined, `${language}.${key} is undefined`);
  assert.match(api.UI[language].ieungRule, /ㅇ/);
  assert.equal(api.UI[language].lockedTitle, undefined);
  assert.equal(api.UI[language].lockedLead, undefined);
}

const expectedCompleteTags = {
  zh: 'K0 · 第5课完成',
  en: 'K0 · LESSON 5 COMPLETE',
  vi: 'K0 · HOÀN THÀNH BÀI 5',
  ja: 'K0 · 第5課完了'
};
for (const language of languages) {
  const copy = api.COMPLETE_COPY[language];
  assert.equal(copy.completeTag, expectedCompleteTags[language]);
  assert.match(copy.xpEarned, /50 XP/);
  assert.ok(copy.xpAlreadyClaimed.length > 12);
  assert.notEqual(copy.xpEarned, copy.xpAlreadyClaimed);
}
assert.equal(api.completionRewardKey(true), 'xpEarned');
assert.equal(api.completionRewardKey(false), 'xpAlreadyClaimed');
assert.match(source, /let completionAwardedThisView=false/, 'A refresh must default to the already-claimed completion message.');

const compositions = { 가: ['ㄱ', 'ㅏ'], 너: ['ㄴ', 'ㅓ'], 미: ['ㅁ', 'ㅣ'], 고: ['ㄱ', 'ㅗ'], 누: ['ㄴ', 'ㅜ'], 그: ['ㄱ', 'ㅡ'], 아: ['ㅇ', 'ㅏ'], 어: ['ㅇ', 'ㅓ'], 오: ['ㅇ', 'ㅗ'] };
for (const [syllable, [initial, vowel]] of Object.entries(compositions)) {
  assert.equal(api.compose(initial, vowel), syllable);
  assert.deepEqual(JSON.parse(JSON.stringify(api.split(syllable))), { initial, vowel });
  assert.equal(api.layoutForVowel(vowel), ['ㅏ', 'ㅓ', 'ㅣ'].includes(vowel) ? 'left' : 'top');
}
assert.equal(api.split('산'), null, 'A CVC syllable must not enter the Lesson 5 split model.');
for (const [syllable, correct] of [['나', 'ㄴ + ㅏ'], ['고', 'ㄱ + ㅗ'], ['어', 'ㅇ + ㅓ']]) {
  assert.equal(api.SPLIT_QUESTIONS.find(question => question.syllable === syllable)?.correct, correct);
}
assert.equal(api.CHALLENGE.length, 5);
assert.equal(api.CHALLENGE.find(question => question.id === 'c5')?.correct, 'silent');

let session = api.blankSession();
assert.equal(session.challengeStarted, false);
assert.equal(Object.keys(session.optionOrders).length, 5);
session = api.applyAnswer(session, api.CHALLENGE[0], 'top');
assert.deepEqual([...session.mistakes], ['c1']);
session = api.applyRetryAnswer(session, api.CHALLENGE[0], 'left');
assert.deepEqual([...session.mistakes], []);
const restored = api.normalizeSession({ ...session, step: 12, challengeStarted: true, built: ['가', '어'], optionOrders: session.optionOrders });
assert.equal(restored.step, 12);
assert.equal(restored.challengeStarted, true);
assert.deepEqual([...restored.built], ['가', '어']);
assert.deepEqual(JSON.parse(JSON.stringify(restored.optionOrders)), JSON.parse(JSON.stringify(session.optionOrders)));

const completed = api.completionPatch(oldProfile);
assert.equal(completed.xp, 250);
assert.equal(completed.lessonProgress['lesson-05'], 100);
assert.equal(completed.lessonProgress['lesson-03'], 61);
assert.ok(completed.completedLessons.includes('lesson-05'));
assert.deepEqual(completed.futureField, { keep: true });
assert.equal(api.completionPatch(completed).xp, 250, 'Repeat completion must not award XP twice.');

const expectedHosted = {
  가: 'audio/lesson-01/ga.mp3', 너: 'audio/lesson-01/neo-v2.wav', 미: 'audio/lesson-02/mi.mp3',
  고: 'audio/lesson-01/go-v2.wav', 누: 'audio/lesson-01/nu-v2.wav', 아: 'audio/lesson-01/a.mp3',
  어: 'audio/lesson-01/eo.mp3', 오: 'audio/lesson-01/o.mp3', 나: 'audio/lesson-01/na.mp3',
  그: 'audio/lesson-05/geu.mp3'
};
assert.deepEqual(JSON.parse(JSON.stringify(api.AUDIO_FILES)), expectedHosted);
for (const path of Object.values(expectedHosted)) assert.ok(fs.existsSync(path), `Missing exact reused audio: ${path}`);

const catalogContext = { window: {} };
catalogContext.window.window = catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), catalogContext, { filename: 'course-catalog.js' });
const course = catalogContext.window.NIKIGO_COURSES.find(item => item.stableId === 'lesson-05');
assert.equal(course.displayNumber, 5);
assert.equal(course.file, 'lesson-05.html');
assert.deepEqual([...course.recommendedPrerequisites], ['lesson-04']);
assert.equal(catalogContext.window.NIKIGO_COURSE_UNLOCKED(course, ['lesson-04']), true);
assert.equal(catalogContext.window.NIKIGO_COURSE_UNLOCKED(course, []), true);
assert.equal(catalogContext.window.NIKIGO_NEXT_LESSON(['lesson-00', 'lesson-01', 'lesson-02', 'lesson-03']).stableId, 'lesson-04');
assert.equal(catalogContext.window.NIKIGO_NEXT_LESSON(['lesson-00', 'lesson-01', 'lesson-02', 'lesson-03', 'lesson-04']).stableId, 'lesson-05');

console.log('Validated Lesson 5: 16 steps, four languages, direct access, CV composition/splitting, silent onset ㅇ, persisted state, exact hosted audio reuse, migration safety, and one-time +50 XP.');
