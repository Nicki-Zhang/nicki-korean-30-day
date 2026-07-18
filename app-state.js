(function (global) {
  'use strict';

  const STORAGE_KEY = 'nikigoProfile';
  const SCHEMA_VERSION = 1;
  const SUPPORTED_LANGUAGES = ['zh', 'en', 'vi', 'ja'];
  const DEFAULTS = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    interfaceLanguage: '',
    learningLanguage: '',
    time: '10',
    audioRate: 1,
    autoplayAudio: false,
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

  function normalize(raw) {
    const source = safeObject(raw, {});
    const normalized = {
      ...DEFAULTS,
      ...source,
      schemaVersion: SCHEMA_VERSION,
      interfaceLanguage: SUPPORTED_LANGUAGES.includes(source.interfaceLanguage) ? source.interfaceLanguage : '',
      learningLanguage: SUPPORTED_LANGUAGES.includes(source.learningLanguage) ? source.learningLanguage : '',
      time: ['5', '10', '15', '20'].includes(String(source.time)) ? String(source.time) : DEFAULTS.time,
      audioRate: finiteNumber(source.audioRate, DEFAULTS.audioRate, 0.8, 1.2),
      autoplayAudio: source.autoplayAudio === true,
      memberTier: source.memberTier === 'plus' ? 'plus' : 'free',
      completedLessons: uniqueStrings(source.completedLessons),
      reviewItems: uniqueStrings(source.reviewItems),
      lessonProgress: { ...safeObject(source.lessonProgress, {}) },
      weeklyProgress: finiteNumber(source.weeklyProgress, 0, 0, 7),
      xp: finiteNumber(source.xp, 0, 0, 10000000),
      streak: finiteNumber(source.streak, 0, 0, 100000)
    };
    Object.keys(normalized.lessonProgress).forEach(key => {
      normalized.lessonProgress[key] = finiteNumber(normalized.lessonProgress[key], 0, 0, 100);
    });
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
    get: () => state,
    save: (next, source) => commit(next || state, source || 'save'),
    update,
    reset
  });
})(window);
