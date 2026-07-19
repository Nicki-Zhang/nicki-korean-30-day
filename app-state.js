(function (global) {
  'use strict';

  const STORAGE_KEY = 'nikigoProfile';
  const SCHEMA_VERSION = 4;
  const SUPPORTED_LANGUAGES = ['zh', 'en', 'vi', 'ja'];
  const AVATAR_CHOICES = ['initial', '🌱', '📚', '✨', '🐰'];
  const DEFAULTS = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    name: 'Nicki',
    avatar: 'initial',
    path: '',
    interfaceLanguage: '',
    learningLanguage: '',
    time: '10',
    audioRate: 1,
    autoplayAudio: false,
    hangulLevel: '',
    hangulRecommendation: '',
    memberTier: 'free',
    completedLessons: [],
    reviewItems: [],
    lessonProgress: {},
    weeklyProgress: 0,
    xp: 0,
    streak: 0
  });

  function safeObject(value, fallback) {
    return value && typeof value === 'object' && !Array.isArray(value) ? value : fallback;
  }

  function finiteNumber(value, fallback, min, max) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) return fallback;
    return Math.min(max, Math.max(min, parsed));
  }

  function uniqueStrings(value) {
    return Array.isArray(value) ? [...new Set(value.filter(item => typeof item === 'string'))] : [];
  }

  function isoDate(value, fallback) {
    const parsed = typeof value === 'string' ? Date.parse(value) : NaN;
    return Number.isFinite(parsed) ? new Date(parsed).toISOString() : fallback;
  }

  function lessonIdFromReviewId(id) {
    const match = String(id || '').match(/^lesson(\d{2}):/);
    return match ? `lesson-${match[1]}` : '';
  }

  function normalizeReviewItems(value, now) {
    const fallbackDate = new Date(now).toISOString();
    const byId = new Map();
    (Array.isArray(value) ? value : []).forEach(raw => {
      const source = typeof raw === 'string' ? { id: raw } : safeObject(raw, {});
      const id = typeof source.id === 'string' ? source.id.trim() : '';
      if (!id) return;
      const normalized = {
        id,
        lessonId: typeof source.lessonId === 'string' ? source.lessonId : lessonIdFromReviewId(id),
        status: source.status === 'mastered' ? 'mastered' : 'active',
        mastery: finiteNumber(source.mastery, 0, 0, 5),
        intervalDays: finiteNumber(source.intervalDays, 0, 0, 3650),
        attempts: finiteNumber(source.attempts, 0, 0, 100000),
        correctStreak: finiteNumber(source.correctStreak, 0, 0, 100000),
        lapses: finiteNumber(source.lapses, 0, 0, 100000),
        createdAt: isoDate(source.createdAt, fallbackDate),
        dueAt: isoDate(source.dueAt, fallbackDate),
        lastReviewedAt: source.lastReviewedAt ? isoDate(source.lastReviewedAt, null) : null,
        lastResult: source.lastResult === 'correct' || source.lastResult === 'incorrect' ? source.lastResult : null
      };
      const existing = byId.get(id);
      if (!existing || Date.parse(normalized.dueAt) < Date.parse(existing.dueAt)) byId.set(id, normalized);
    });
    return [...byId.values()];
  }

  function normalize(raw, now) {
    const source = safeObject(raw, {});
    const currentTime = Number.isFinite(Number(now)) ? Number(now) : Date.now();
    const normalized = {
      ...DEFAULTS,
      ...source,
      schemaVersion: SCHEMA_VERSION,
      name: typeof source.name === 'string' && source.name.trim() ? source.name.trim().slice(0, 24) : DEFAULTS.name,
      avatar: AVATAR_CHOICES.includes(source.avatar) ? source.avatar : DEFAULTS.avatar,
      interfaceLanguage: SUPPORTED_LANGUAGES.includes(source.interfaceLanguage) ? source.interfaceLanguage : '',
      learningLanguage: SUPPORTED_LANGUAGES.includes(source.learningLanguage) ? source.learningLanguage : '',
      time: ['5', '10', '15', '20'].includes(String(source.time)) ? String(source.time) : DEFAULTS.time,
      audioRate: finiteNumber(source.audioRate, DEFAULTS.audioRate, 0.8, 1.2),
      autoplayAudio: source.autoplayAudio === true,
      hangulLevel: ['beginner', 'partial', 'reader'].includes(source.hangulLevel) ? source.hangulLevel : '',
      hangulRecommendation: ['lesson-01', 'alphabet-check', 'scenario-coming-soon'].includes(source.hangulRecommendation) ? source.hangulRecommendation : '',
      memberTier: source.memberTier === 'plus' ? 'plus' : 'free',
      completedLessons: uniqueStrings(source.completedLessons),
      reviewItems: normalizeReviewItems(source.reviewItems, currentTime),
      lessonProgress: { ...safeObject(source.lessonProgress, {}) },
      weeklyProgress: finiteNumber(source.weeklyProgress, 0, 0, 7),
      xp: finiteNumber(source.xp, 0, 0, 10000000),
      streak: finiteNumber(source.streak, 0, 0, 100000)
    };
    Object.keys(normalized.lessonProgress).forEach(key => {
      normalized.lessonProgress[key] = finiteNumber(normalized.lessonProgress[key], 0, 0, 100);
    });
    const hasLearningActivity = normalized.completedLessons.length > 0
      || normalized.reviewItems.length > 0
      || Object.keys(normalized.lessonProgress).length > 0
      || normalized.xp > 0;
    normalized.path = /^K[0-4]$/.test(source.path) ? source.path : (hasLearningActivity ? 'K0' : '');
    return normalized;
  }

  function readStorage() {
    try {
      return normalize(JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}'));
    } catch (error) {
      return normalize({});
    }
  }

  const state = readStorage();
  try {
    global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    // Migration can remain in memory when storage is unavailable.
  }

  function commit(next, source) {
    const normalized = normalize(next);
    Object.keys(state).forEach(key => delete state[key]);
    Object.assign(state, normalized);
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      // The current page can keep working even when browser storage is unavailable.
    }
    global.dispatchEvent(new CustomEvent('nikigo:statechange', {
      detail: { state, source: source || 'unknown' }
    }));
    return state;
  }

  function update(patch, source) {
    const changes = typeof patch === 'function' ? patch({ ...state }) : patch;
    return commit({ ...state, ...safeObject(changes, {}) }, source || 'update');
  }

  function addReview(id, metadata) {
    if (typeof id !== 'string' || !id.trim()) return state;
    const now = Date.now();
    const details = safeObject(metadata, {});
    const existing = state.reviewItems.find(item => item.id === id);
    const item = existing ? { ...existing } : normalizeReviewItems([{
      id,
      lessonId: details.lessonId,
      createdAt: new Date(now).toISOString(),
      dueAt: new Date(now).toISOString()
    }], now)[0];
    if (!item) return state;
    item.status = 'active';
    if (details.dueNow === true || !existing) item.dueAt = new Date(now).toISOString();
    const items = state.reviewItems.filter(review => review.id !== id);
    items.push(item);
    return commit({ ...state, reviewItems: items }, details.source || 'review:add');
  }

  function recordReview(id, correct, options) {
    const details = safeObject(options, {});
    const now = Number.isFinite(Number(details.now)) ? Number(details.now) : Date.now();
    const reviewedAt = new Date(now).toISOString();
    const intervals = [1, 3, 7, 14, 30];
    let earnedXp = 0;
    const items = state.reviewItems.map(item => {
      if (item.id !== id) return item;
      const next = { ...item, attempts: item.attempts + 1, lastReviewedAt: reviewedAt };
      if (correct === true) {
        next.lastResult = 'correct';
        next.correctStreak += 1;
        next.mastery = Math.min(5, next.mastery + 1);
        next.intervalDays = intervals[Math.min(next.correctStreak - 1, intervals.length - 1)];
        next.dueAt = new Date(now + next.intervalDays * 86400000).toISOString();
        if (next.mastery >= 5) next.status = 'mastered';
        earnedXp = 5;
      } else {
        next.lastResult = 'incorrect';
        next.correctStreak = 0;
        next.mastery = Math.max(0, next.mastery - 1);
        next.intervalDays = 0;
        next.lapses += 1;
        next.status = 'active';
        next.dueAt = new Date(now + 10 * 60000).toISOString();
      }
      return next;
    });
    return commit({ ...state, reviewItems: items, xp: (Number(state.xp) || 0) + earnedXp }, 'review:answer');
  }

  function dueReviews(options) {
    const details = safeObject(options, {});
    const now = Number.isFinite(Number(details.now)) ? Number(details.now) : Date.now();
    const limit = finiteNumber(details.limit, 20, 1, 100);
    return state.reviewItems
      .filter(item => item.status === 'active' && Date.parse(item.dueAt) <= now)
      .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt))
      .slice(0, limit);
  }

  function reset(options) {
    const preserve = safeObject(options, {});
    return commit({
      ...DEFAULTS,
      interfaceLanguage: SUPPORTED_LANGUAGES.includes(preserve.interfaceLanguage) ? preserve.interfaceLanguage : state.interfaceLanguage,
      learningLanguage: SUPPORTED_LANGUAGES.includes(preserve.learningLanguage) ? preserve.learningLanguage : state.learningLanguage
    }, 'reset');
  }

  global.addEventListener('storage', event => {
    if (event.key !== STORAGE_KEY) return;
    const incoming = (() => {
      try { return JSON.parse(event.newValue || '{}'); } catch (error) { return {}; }
    })();
    const normalized = normalize(incoming);
    Object.keys(state).forEach(key => delete state[key]);
    Object.assign(state, normalized);
    global.dispatchEvent(new CustomEvent('nikigo:statechange', { detail: { state, source: 'storage' } }));
  });

  global.NikigoState = Object.freeze({
    key: STORAGE_KEY,
    version: SCHEMA_VERSION,
    defaults: DEFAULTS,
    supportedLanguages: SUPPORTED_LANGUAGES,
    avatarChoices: AVATAR_CHOICES,
    get: () => state,
    save: (next, source) => commit(next || state, source || 'save'),
    update,
    addReview,
    recordReview,
    dueReviews,
    normalize: (raw, now) => normalize(raw, now),
    reset
  });
})(window);
