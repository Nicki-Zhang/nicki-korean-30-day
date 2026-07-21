(function (global) {
  'use strict';

  const items = {};
  const define = (id, item) => { items[id] = Object.freeze({ id, ...item }); };

  define('lesson01:vowels', { lessonId: 'lesson-01', kind: 'listen', cue: 'ㅓ', audio: '어', options: ['어', '오', '우', '아'], answer: 0 });
  define('lesson01:shadowing', { lessonId: 'lesson-01', kind: 'listen', cue: '가 · 나', audioSequence: ['가', '나'], options: ['가 · 나', '나 · 가', '거 · 너', '고 · 노'], answer: 0 });
  define('lesson01:quiz:0', { lessonId: 'lesson-01', kind: 'listen', audio: '오', options: ['아', '오', '어', '우'], answer: 1 });
  define('lesson01:quiz:1', { lessonId: 'lesson-01', kind: 'listen', audio: '우', options: ['오', '어', '우', '아'], answer: 2 });
  define('lesson01:quiz:2', { lessonId: 'lesson-01', kind: 'build', cue: 'ㄱ + ㅏ', options: ['거', '나', '가', '고'], answer: 2 });
  define('lesson01:quiz:3', { lessonId: 'lesson-01', kind: 'build', cue: 'ㄴ + ㅏ', options: ['너', '가', '고', '나'], answer: 3 });
  define('lesson01:quiz:4', { lessonId: 'lesson-01', kind: 'listen', audio: '가', options: ['나', '거', '가', '노'], answer: 2 });

  define('lesson02:words', { lessonId: 'lesson-02', kind: 'listen', audio: '나무', options: ['다리', '머리', '나무', '나리'], answer: 2 });
  define('lesson02:ae-e-spelling', { lessonId: 'lesson-02', kind: 'recognize', cue: '애', options: ['ㅔ', 'ㅣ', 'ㅐ', 'ㅡ'], answer: 2 });
  define('lesson02:shadowing', { lessonId: 'lesson-02', kind: 'listen', cue: '나무 · 다리 · 머리', audioSequence: ['나무', '다리', '머리'], options: ['나무 · 다리 · 머리', '다리 · 나무 · 머리', '머리 · 나무 · 다리', '나무 · 머리 · 다리'], answer: 0 });
  define('lesson02:quiz:0', { lessonId: 'lesson-02', kind: 'listen', audio: '이', options: ['으', '애', '이', '에'], answer: 2 });
  define('lesson02:quiz:1', { lessonId: 'lesson-02', kind: 'build', cue: 'ㄷ + ㅏ', options: ['디', '다', '라', '마'], answer: 1 });
  define('lesson02:quiz:2', { lessonId: 'lesson-02', kind: 'meaning', meaning: { zh: '树', en: 'tree', vi: 'cây', ja: '木' }, options: ['머리', '나무', '다리', '미리'], answer: 1 });
  define('lesson02:quiz:3', { lessonId: 'lesson-02', kind: 'listen', audio: '머리', options: ['나무', '다리', '머리', '마리'], answer: 2 });
  define('lesson02:quiz:4', { lessonId: 'lesson-02', kind: 'recognize', cue: '애', options: ['ㅔ', 'ㅣ', 'ㅐ', 'ㅡ'], answer: 2 });

  define('lesson03:new-letters', { lessonId: 'lesson-03', kind: 'listen', audio: '여', options: ['야', '여', '사', '아'], answer: 1 });
  define('lesson03:greeting', { lessonId: 'lesson-03', kind: 'listen', cue: '안녕하세요', audio: '안녕하세요', options: ['안녕', '안녕하세요', '사람', '바다'], answer: 1 });
  define('lesson03:quiz:0', { lessonId: 'lesson-03', kind: 'listen', audio: '야', options: ['여', '야', '아', '사'], answer: 1 });
  define('lesson03:quiz:1', { lessonId: 'lesson-03', kind: 'build', cue: 'ㅂ + ㅏ', options: ['사', '바', '벼', '아'], answer: 1 });
  define('lesson03:quiz:2', { lessonId: 'lesson-03', kind: 'meaning', meaning: { zh: '海', en: 'sea', vi: 'biển', ja: '海' }, options: ['사람', '나무', '바다', '머리'], answer: 2 });
  define('lesson03:quiz:3', { lessonId: 'lesson-03', kind: 'listen', audio: '안녕하세요', options: ['안녕', '안녕하세요', '사람', '바다'], answer: 1 });
  define('lesson03:quiz:4', { lessonId: 'lesson-03', kind: 'recognize', cue: 'ㅇ · initial', options: ['∅ (silent)', 'm', 's', 'b'], answer: 0 });

  define('lesson07:batchim', { lessonId: 'lesson-07', kind: 'listen', cue: '받침', audio: '방', options: ['반', '밤', '방', '발'], answer: 2 });
  define('lesson07:thanks', { lessonId: 'lesson-07', kind: 'listen', cue: '감사합니다', audio: '감사합니다', options: ['감사합니다', '안녕하세요', '안녕', '바다'], answer: 0 });
  define('lesson07:quiz:0', { lessonId: 'lesson-07', kind: 'listen', audio: '밤', options: ['반', '밤', '방', '발'], answer: 1 });
  define('lesson07:quiz:1', { lessonId: 'lesson-07', kind: 'build', cue: 'ㅂ + ㅏ + ㅇ', options: ['반', '밤', '방', '발'], answer: 2 });
  define('lesson07:quiz:2', { lessonId: 'lesson-07', kind: 'listen', audio: '물', options: ['산', '몸', '공', '물'], answer: 3 });
  define('lesson07:quiz:3', { lessonId: 'lesson-07', kind: 'listen', audio: '감사합니다', options: ['안녕하세요', '감사합니다', '안녕', '바다'], answer: 1 });
  define('lesson07:quiz:4', { lessonId: 'lesson-07', kind: 'recognize', cue: 'ㅇ · final', options: ['ng', '∅ (silent)', 'm', 'b'], answer: 0 });

  global.NIKIGO_REVIEW_CATALOG = Object.freeze({
    all: Object.freeze(items),
    get: id => items[id] || null
  });
})(window);
