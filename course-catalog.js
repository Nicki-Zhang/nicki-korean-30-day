(function () {
  const lessons = [
    {
      id: 'lesson-01',
      order: 1,
      path: 'K0',
      template: 'hangul-foundation',
      duration: 12,
      xp: 50,
      icon: '🌱',
      prerequisites: [],
      title: {
        zh: '韩文字母：第一步',
        en: 'Hangul: Your First Step',
        vi: 'Hangul: Bước đầu tiên',
        ja: 'ハングル：最初の一歩'
      },
      parts: {
        zh: '基础元音 · 辅音 · 拼音节 · 跟读 · 挑战',
        en: 'Vowels · Consonants · Build · Shadow · Challenge',
        vi: 'Nguyên âm · Phụ âm · Ghép âm · Đọc theo · Thử thách',
        ja: '母音 · 子音 · 音節作り · 音読 · チャレンジ'
      }
    },
    {
      id: 'lesson-02',
      order: 2,
      path: 'K0',
      template: 'hangul-to-words',
      duration: 13,
      xp: 50,
      icon: '🔤',
      prerequisites: ['lesson-01'],
      title: {
        zh: '从音节读到第一个词',
        en: 'From Syllables to Your First Words',
        vi: 'Từ âm tiết đến những từ đầu tiên',
        ja: '音節から最初の単語へ'
      },
      parts: {
        zh: '新元音 · 新辅音 · 真实词汇 · 跟读 · 挑战',
        en: 'New vowels · New consonants · Words · Shadow · Challenge',
        vi: 'Nguyên âm mới · Phụ âm mới · Từ vựng · Đọc theo · Thử thách',
        ja: '新しい母音 · 新しい子音 · 単語 · 音読 · チャレンジ'
      }
    },
    {
      id: 'lesson-03',
      order: 3,
      path: 'K0',
      template: 'hangul-to-scenario',
      duration: 14,
      xp: 50,
      icon: '👋',
      prerequisites: ['lesson-02'],
      title: {
        zh: '第一次打招呼',
        en: 'Your First Greeting',
        vi: 'Lời chào đầu tiên',
        ja: '最初のあいさつ'
      },
      parts: {
        zh: '新字母 · 真实词汇 · 礼貌问候 · 跟读 · 挑战',
        en: 'New letters · Real words · Polite greeting · Shadow · Challenge',
        vi: 'Chữ mới · Từ thật · Lời chào lịch sự · Đọc theo · Thử thách',
        ja: '新しい文字 · 単語 · 丁寧なあいさつ · 音読 · チャレンジ'
      }
    },
    {
      id: 'lesson-04',
      order: 4,
      path: 'K0',
      template: 'hangul-batchim',
      duration: 13,
      xp: 50,
      icon: '🧱',
      prerequisites: ['lesson-03'],
      title: {
        zh: '收音：音节的最后一块',
        en: 'Batchim: The Final Block',
        vi: 'Batchim: Khối cuối của âm tiết',
        ja: 'パッチム：音節の最後のブロック'
      },
      parts: {
        zh: '收音 ㄴㅁㅇㄹ · 真实词汇 · 감사합니다 · 跟读 · 挑战',
        en: 'Finals ㄴㅁㅇㄹ · Real words · 감사합니다 · Shadow · Challenge',
        vi: 'Âm cuối ㄴㅁㅇㄹ · Từ thật · 감사합니다 · Đọc theo · Thử thách',
        ja: 'パッチム ㄴㅁㅇㄹ · 実際の単語 · 감사합니다 · 音読 · チャレンジ'
      }
    }
  ];

  window.NIKIGO_COURSES = Object.freeze(lessons);
  window.NIKIGO_NEXT_LESSON = function (completedLessons) {
    const completed = new Set(completedLessons || []);
    return lessons.find(lesson => !completed.has(lesson.id)) || lessons[lessons.length - 1];
  };
})();
