import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

function createRuntime(seed) {
  const storage = new Map(seed ? [['nikigoProfile', JSON.stringify(seed)]] : []);
  const listeners = new Map();
  const window = {
    localStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, String(value)),
      removeItem: key => storage.delete(key)
    },
    addEventListener: (type, listener) => listeners.set(type, listener),
    dispatchEvent: () => true,
    CustomEvent: class CustomEvent {
      constructor(type, options) { this.type = type; this.detail = options?.detail; }
    }
  };
  window.window = window;
  vm.runInNewContext(fs.readFileSync('app-state.js', 'utf8'), window, { filename: 'app-state.js' });
  return { api: window.NikigoState, storage };
}

const migration = createRuntime({
  schemaVersion: 1,
  name: '  민지  ',
  avatar: '🌱',
  xp: 25,
  reviewItems: ['lesson01:vowels', 'lesson01:vowels', 'lesson02:words']
});
assert.equal(migration.api.version, 4);
assert.equal(migration.api.get().name, '민지');
assert.equal(migration.api.get().avatar, '🌱');
assert.equal(migration.api.get().path, 'K0');
assert.equal(migration.api.get().reviewItems.length, 2);
assert.equal(migration.api.get().reviewItems[0].lessonId, 'lesson-01');
assert.equal(JSON.parse(migration.storage.get('nikigoProfile')).schemaVersion, 4);
assert.equal(migration.api.get().hangulLevel, '');
assert.equal(migration.api.get().hangulRecommendation, '');

const preserved = createRuntime({
  schemaVersion: 3,
  name: 'Nicki',
  guest: true,
  xp: 180,
  completedLessons: ['lesson-01', 'lesson-04'],
  lessonProgress: { 'lesson-01': 100, 'lesson-04': 42 },
  audioRate: 0.85,
  autoplayAudio: false,
  interfaceLanguage: 'vi'
});
const preservedProfile = preserved.api.get();
assert.equal(preservedProfile.xp, 180);
assert.equal(preservedProfile.guest, true);
assert.deepEqual([...preservedProfile.completedLessons], ['lesson-01', 'lesson-04']);
assert.equal(preservedProfile.lessonProgress['lesson-04'], 42);
assert.equal(preservedProfile.audioRate, 0.85);
assert.equal(preservedProfile.autoplayAudio, false);
assert.equal(preservedProfile.interfaceLanguage, 'vi');

const profileDefaults = createRuntime({ name: '   ', avatar: 'unsupported' });
assert.equal(profileDefaults.api.get().name, 'Nicki');
assert.equal(profileDefaults.api.get().avatar, 'initial');
assert.equal(profileDefaults.api.get().path, '');

const placedProfile = createRuntime({ path: 'K2' });
assert.equal(placedProfile.api.get().path, 'K2');

const runtime = createRuntime({ xp: 0, reviewItems: [] });
runtime.api.addReview('lesson03:greeting', { lessonId: 'lesson-03', dueNow: true });
assert.equal(runtime.api.dueReviews().length, 1);

const firstDue = Date.parse(runtime.api.get().reviewItems[0].dueAt);
runtime.api.recordReview('lesson03:greeting', true, { now: firstDue });
let review = runtime.api.get().reviewItems[0];
assert.equal(review.correctStreak, 1);
assert.equal(review.intervalDays, 1);
assert.equal(runtime.api.get().xp, 5);
assert.equal(runtime.api.dueReviews({ now: firstDue }).length, 0);
assert.equal(runtime.api.dueReviews({ now: firstDue + 86400000 }).length, 1);

runtime.api.recordReview('lesson03:greeting', false, { now: firstDue + 86400000 });
review = runtime.api.get().reviewItems[0];
assert.equal(review.correctStreak, 0);
assert.equal(review.lapses, 1);
assert.equal(review.intervalDays, 0);
assert.equal(Date.parse(review.dueAt), firstDue + 86400000 + 600000);
assert.equal(runtime.api.get().xp, 5);

const mastery = createRuntime({ xp: 0, reviewItems: [] });
mastery.api.addReview('lesson01:vowels', { lessonId: 'lesson-01', dueNow: true });
let masteryNow = Date.parse(mastery.api.get().reviewItems[0].dueAt);
for (const expectedInterval of [1, 3, 7, 14, 30]) {
  mastery.api.recordReview('lesson01:vowels', true, { now: masteryNow });
  const item = mastery.api.get().reviewItems[0];
  assert.equal(item.intervalDays, expectedInterval);
  masteryNow = Date.parse(item.dueAt);
}
assert.equal(mastery.api.get().reviewItems[0].status, 'mastered');
assert.equal(mastery.api.dueReviews({ now: masteryNow + 86400000 }).length, 0);

console.log('Validated review migration and scheduling.');
