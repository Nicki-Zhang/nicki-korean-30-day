import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages = ['zh', 'en', 'vi', 'ja'];
const catalogContext = { window: {} };
catalogContext.window.window = catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), catalogContext, { filename: 'course-catalog.js' });
const catalog = catalogContext.window.NIKIGO_COURSES;

assert.equal(catalog.length, 10);
assert.deepEqual([...catalog.map(item => item.displayNumber)], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
const stableIds = new Set();
for (const [index, item] of catalog.entries()) {
  assert.equal(item.id, item.stableId);
  assert.equal(item.displayOrder, index);
  assert.equal(item.displayNumber, index);
  assert.ok(['available', 'comingSoon'].includes(item.status));
  assert.ok(!stableIds.has(item.stableId), `duplicate stableId ${item.stableId}`);
  stableIds.add(item.stableId);
  for (const language of languages) {
    assert.ok(item.title[language], `${item.stableId} missing ${language} title`);
    assert.ok(item.parts[language], `${item.stableId} missing ${language} parts`);
  }
  if (item.status === 'available') {
    assert.ok(item.file, `${item.stableId} missing file`);
    assert.ok(fs.existsSync(item.file), `${item.file} does not exist`);
  } else {
    assert.equal(item.file, null, `${item.stableId} must not link to an unfinished page`);
  }
}
assert.deepEqual([...catalog.filter(item => item.status === 'available').map(item => item.stableId)], ['lesson-00', 'lesson-01', 'lesson-02', 'lesson-03', 'k0-consonant-contrast', 'lesson-05', 'lesson-04']);
const contrastLesson = catalog.find(item => item.stableId === 'k0-consonant-contrast');
assert.equal(contrastLesson.displayNumber, 4);
assert.equal(contrastLesson.file, 'lesson-consonant-contrast.html');
const lesson05 = catalog.find(item => item.stableId === 'lesson-05');
assert.equal(lesson05.prerequisites[0], 'k0-consonant-contrast');
assert.equal(lesson05.file, 'lesson-05.html');
assert.equal(lesson05.requiresCompletion, true);
assert.equal(catalog.find(item => item.stableId === 'lesson-04').displayNumber, 7);

const lesson00Html = fs.readFileSync('lesson-00.html', 'utf8');
for (const marker of ['class="mapGrid"', 'class="syllableDemo"', 'data-level="beginner"', 'data-level="partial"', 'data-level="reader"']) assert.match(lesson00Html, new RegExp(marker));
assert.match(lesson00Html, /lesson-00\.js/);
assert.doesNotMatch(lesson00Html, /audio\//);

const documentStub = { addEventListener() {} };
const lesson00Context = {
  window: { location: { search: '', href: '' }, navigator: { language: 'en', languages: ['en'] }, document: documentStub },
  document: documentStub,
  URLSearchParams,
  setTimeout() {}
};
lesson00Context.window.window = lesson00Context.window;
vm.runInNewContext(fs.readFileSync('lesson-00.js', 'utf8'), lesson00Context, { filename: 'lesson-00.js' });
const api = lesson00Context.window.NikigoLesson00;
assert.ok(api);
const englishKeys = Object.keys(api.COPY.en);
for (const language of languages) {
  for (const key of englishKeys) assert.notEqual(api.COPY[language]?.[key], undefined, `${language}.${key} is undefined`);
}

const original = {
  guest: true,
  xp: 90,
  completedLessons: ['lesson-04'],
  lessonProgress: { 'lesson-04': 38 },
  audioRate: 0.8,
  autoplayAudio: false,
  interfaceLanguage: 'ja'
};
for (const [level, recommendation] of [['beginner', 'lesson-01'], ['partial', 'alphabet-check'], ['reader', 'scenario-coming-soon']]) {
  const result = api.choicePatch(original, level);
  assert.equal(result.hangulLevel, level);
  assert.equal(result.hangulRecommendation, recommendation);
  assert.equal(result.xp, 90);
  assert.equal(result.guest, true);
  assert.equal(result.audioRate, 0.8);
  assert.equal(result.autoplayAudio, false);
  assert.equal(result.lessonProgress['lesson-04'], 38);
  assert.equal(result.lessonProgress['lesson-00'], 100);
  assert.deepEqual([...result.completedLessons], ['lesson-04', 'lesson-00']);
  assert.equal(JSON.parse(JSON.stringify(result)).hangulLevel, level);
}
assert.equal(api.routeFor('beginner', 'zh'), 'lesson-01.html?lang=zh');
assert.equal(api.routeFor('partial', 'vi'), 'diagnostic.html?lang=vi');
assert.equal(api.routeFor('reader', 'ja'), 'nikigo-app.html?lang=ja#courses');

const persistedStorage = new Map([['nikigoProfile', JSON.stringify(original)]]);
const stateWindow = {
  localStorage: {
    getItem: key => persistedStorage.get(key) ?? null,
    setItem: (key, value) => persistedStorage.set(key, String(value)),
    removeItem: key => persistedStorage.delete(key)
  },
  addEventListener() {},
  dispatchEvent() { return true; },
  CustomEvent: class CustomEvent { constructor(type, options) { this.type = type; this.detail = options?.detail; } }
};
stateWindow.window = stateWindow;
vm.runInNewContext(fs.readFileSync('app-state.js', 'utf8'), stateWindow, { filename: 'app-state.js' });
stateWindow.NikigoState.save(api.choicePatch(stateWindow.NikigoState.get(), 'partial'), 'k0-test');
const refreshedProfile = JSON.parse(persistedStorage.get('nikigoProfile'));
assert.equal(refreshedProfile.hangulLevel, 'partial');
assert.equal(refreshedProfile.hangulRecommendation, 'alphabet-check');
assert.equal(refreshedProfile.xp, 90);
assert.equal(refreshedProfile.lessonProgress['lesson-04'], 38);
assert.equal(refreshedProfile.lessonProgress['lesson-00'], 100);

const lesson04 = fs.readFileSync('lesson-04.html', 'utf8');
const engine = fs.readFileSync('lesson-engine.js', 'utf8');
for (const word of ['산', '몸', '공', '물']) {
  assert.match(lesson04, new RegExp(`word:'${word}'`));
  assert.match(lesson04, new RegExp(`audio:'${word}'`));
}
assert.match(lesson04, /batchimExamples/);
assert.match(engine, /playWordAria/);
assert.match(engine, /aria-label=/);
assert.match(engine, /activeAudioValue === example\.audio/);

console.log('Validated K0 roadmap, four-language Lesson 0 choices, persistence, safe routing, and Lesson 7 batchim UI mappings.');
