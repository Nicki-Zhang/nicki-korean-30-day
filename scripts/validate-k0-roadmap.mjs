import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages = ['zh', 'en', 'vi', 'ja'];
const catalogContext = { window: {} };
catalogContext.window.window = catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), catalogContext, { filename: 'course-catalog.js' });
const catalog = catalogContext.window.NIKIGO_COURSES;

assert.equal(catalog.length, 14);
assert.deepEqual([...catalog.map(item => item.displayNumber)], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
const stableIds = new Set();
for (const [index, item] of catalog.entries()) {
  assert.equal(item.id, item.stableId);
  assert.equal(item.displayOrder, index);
  assert.equal(item.displayNumber, index);
  assert.ok(['available', 'comingSoon'].includes(item.status));
  assert.ok(['development', 'preview', 'released', 'comingSoon'].includes(item.releaseStatus));
  assert.ok(['available', 'unavailable'].includes(item.accessStatus));
  assert.ok(['pending', 'generated', 'underReview', 'approved', 'rejected'].includes(item.audioStatus));
  assert.ok(Array.isArray(item.recommendedPrerequisites));
  assert.deepEqual([...item.prerequisites], [], `${item.stableId} must not retain hard prerequisites`);
  assert.equal(item.requiresCompletion, false);
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
assert.deepEqual([...catalog.filter(item => item.status === 'available').map(item => item.stableId)], ['lesson-00', 'lesson-01', 'lesson-02', 'lesson-03', 'k0-consonant-contrast', 'lesson-05', 'lesson-06', 'lesson-04', 'lesson-08', 'lesson-09', 'lesson-10', 'lesson-11', 'lesson-12', 'lesson-13']);
const contrastLesson = catalog.find(item => item.stableId === 'k0-consonant-contrast');
assert.equal(contrastLesson.displayNumber, 4);
assert.equal(contrastLesson.file, 'lesson-consonant-contrast.html');
const lesson05 = catalog.find(item => item.stableId === 'lesson-05');
assert.deepEqual([...lesson05.recommendedPrerequisites], ['k0-consonant-contrast']);
assert.equal(lesson05.file, 'lesson-05.html');
assert.equal(lesson05.requiresCompletion, false);
const lesson06 = catalog.find(item => item.stableId === 'lesson-06');
assert.deepEqual([...lesson06.recommendedPrerequisites], ['lesson-05']);
assert.equal(lesson06.file, 'lesson-06.html');
assert.equal(lesson06.requiresCompletion, false);
assert.equal(lesson06.releaseStatus, 'preview');
assert.equal(lesson06.audioStatus, 'pending');
for (const lesson of catalog.filter(item => item.status === 'available')) {
  assert.equal(catalogContext.window.NIKIGO_COURSE_UNLOCKED(lesson, []), true, `${lesson.stableId} must open without prior completion`);
}
assert.deepEqual(JSON.parse(JSON.stringify(catalog.map(item => item.recommendedPrerequisites))), [[], ['lesson-00'], ['lesson-01'], ['lesson-02'], ['lesson-03'], ['k0-consonant-contrast'], ['lesson-05'], ['lesson-06'], ['lesson-04'], ['lesson-08'], ['lesson-09'], ['lesson-10'], ['lesson-11'], ['lesson-12']]);
assert.ok(catalog.filter(item => item.displayNumber <= 10).every(item => item.path === 'K0'));
assert.ok(catalog.filter(item => item.displayNumber >= 11).every(item => item.path === 'K1'));
assert.equal(catalog.filter(item => item.status === 'comingSoon').length, 0);
assert.equal(catalog.some(item => item.stableId === 'k0-lesson-06-plan'), false);
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
const lesson07 = fs.readFileSync('lesson-07.js', 'utf8');
for (const word of ['산', '몸', '공', '물']) {
  assert.match(lesson07, new RegExp(`word:'${word}'`));
}
assert.match(lesson04, /lesson-07\.html/);
assert.match(lesson04, /target\.search = window\.location\.search/);
assert.match(lesson07, /listenWord/);
assert.match(lesson07, /audioUnavailable/);

console.log('Validated K0 roadmap, four-language Lesson 0 choices, persistence, safe routing, stable Lesson 7 compatibility, and batchim UI mappings.');
