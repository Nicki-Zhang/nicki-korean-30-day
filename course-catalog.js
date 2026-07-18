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
    }
  ];

  window.NIKIGO_COURSES = Object.freeze(lessons);
  window.NIKIGO_NEXT_LESSON = function (completedLessons) {
    const completed = new Set(completedLessons || []);
    return lessons.find(lesson =>
      !completed.has(lesson.id) && lesson.prerequisites.every(id => completed.has(id))
    ) || lessons[lessons.length - 1];
  };
})();
