(function () {
  'use strict';

  const available = ({ stableId, displayOrder, displayNumber, file, duration, xp, icon, template, title, parts, prerequisites = [], requiresCompletion = false, releaseStatus = 'released' }) => ({
    id: stableId,
    stableId,
    displayOrder,
    displayNumber,
    order: displayOrder,
    status: 'available',
    file,
    path: 'K0',
    template,
    duration,
    xp,
    icon,
    prerequisites,
    requiresCompletion,
    releaseStatus,
    title,
    parts
  });

  const comingSoon = ({ stableId, displayOrder, displayNumber, icon, title, parts, prerequisites = [] }) => ({
    id: stableId,
    stableId,
    displayOrder,
    displayNumber,
    order: displayOrder,
    status: 'comingSoon',
    file: null,
    path: 'K0',
    template: 'roadmap-only',
    duration: null,
    xp: 0,
    icon,
    prerequisites,
    title,
    parts
  });

  const lessons = [
    available({
      stableId: 'lesson-00', displayOrder: 0, displayNumber: 0, file: 'lesson-00.html', duration: 3, xp: 0, icon: '🗺️', template: 'hangul-map',
      title: { zh: '先认识韩文字母地图', en: 'Meet the Hangul Map First', vi: 'Làm quen bản đồ Hangul', ja: 'まずハングルの全体図を知ろう' },
      parts: { zh: '40个基本字母 · 音节块 · 选择起点', en: '40 basic letters · Syllable blocks · Choose a starting point', vi: '40 chữ cái cơ bản · Khối âm tiết · Chọn điểm bắt đầu', ja: '40の基本文字 · 音節ブロック · 開始地点を選ぶ' }
    }),
    available({
      stableId: 'lesson-01', displayOrder: 1, displayNumber: 1, file: 'lesson-01.html', duration: 12, xp: 50, icon: '🌱', template: 'hangul-foundation',
      title: { zh: '核心元音 ㅏㅓㅗㅜㅡㅣ', en: 'Core Vowels ㅏㅓㅗㅜㅡㅣ', vi: 'Nguyên âm cốt lõi ㅏㅓㅗㅜㅡㅣ', ja: '基本母音 ㅏㅓㅗㅜㅡㅣ' },
      parts: { zh: '当前版本先学习 ㅏㅓㅗㅜ · 完整音节示例', en: 'Current build starts with ㅏㅓㅗㅜ · Full-syllable examples', vi: 'Bản hiện tại bắt đầu với ㅏㅓㅗㅜ · Ví dụ âm tiết đầy đủ', ja: '現行版はㅏㅓㅗㅜから開始 · 完全な音節例' }
    }),
    available({
      stableId: 'lesson-02', displayOrder: 2, displayNumber: 2, file: 'lesson-02.html', duration: 13, xp: 50, icon: '🔤', template: 'hangul-to-words', prerequisites: ['lesson-01'],
      title: { zh: '其余基础元音和易混元音', en: 'More Basic and Easily Confused Vowels', vi: 'Nguyên âm cơ bản còn lại và dễ nhầm', ja: '残りの基本母音と似た母音' },
      parts: { zh: 'ㅡㅣㅐㅔ · 音节 · 真实词汇', en: 'ㅡㅣㅐㅔ · Syllables · Real words', vi: 'ㅡㅣㅐㅔ · Âm tiết · Từ thật', ja: 'ㅡㅣㅐㅔ · 音節 · 実際の単語' }
    }),
    available({
      stableId: 'lesson-03', displayOrder: 3, displayNumber: 3, file: 'lesson-03.html', duration: 14, xp: 50, icon: '🧩', template: 'hangul-to-scenario', prerequisites: ['lesson-02'],
      title: { zh: '高频基础辅音：通过完整音节学习', en: 'High-frequency Consonants in Full Syllables', vi: 'Phụ âm thường gặp trong âm tiết đầy đủ', ja: '完全な音節で学ぶ基本子音' },
      parts: { zh: 'ㅂㅅㅇ · 完整音节 · 问候预览', en: 'ㅂㅅㅇ · Full syllables · Greeting preview', vi: 'ㅂㅅㅇ · Âm tiết đầy đủ · Xem trước lời chào', ja: 'ㅂㅅㅇ · 完全な音節 · あいさつの予習' }
    }),
    available({
      stableId: 'k0-consonant-contrast', displayOrder: 4, displayNumber: 4, file: 'lesson-consonant-contrast.html', duration: 10, xp: 50, icon: '💨', template: 'consonant-contrast', prerequisites: ['lesson-03'],
      title: { zh: '听懂普通音、送气音和紧音', en: 'Hear Plain, Aspirated, and Tense Sounds', vi: 'Nghe âm thường, bật hơi và căng', ja: '平音・激音・濃音を聞き分ける' },
      parts: { zh: '完整音节 · 气流对比 · 初步听辨', en: 'Full syllables · Airflow contrasts · First listening distinctions', vi: 'Âm tiết đầy đủ · So sánh luồng hơi · Nghe phân biệt bước đầu', ja: '完全な音節 · 気流の比較 · はじめての聞き分け' }
    }),
    available({
      stableId: 'lesson-05', displayOrder: 5, displayNumber: 5, file: 'lesson-05.html', duration: 10, xp: 50, icon: '🧱', template: 'syllable-blocks', prerequisites: ['k0-consonant-contrast'], requiresCompletion: true,
      title: { zh: '看懂韩语音节块', en: 'Understand Korean Syllable Blocks', vi: 'Hiểu khối âm tiết tiếng Hàn', ja: '韓国語の音節ブロックを理解する' },
      parts: { zh: '左右结构 · 上下结构 · 拼合与拆分', en: 'Left–right · Top–bottom · Build and split', vi: 'Trái–phải · Trên–dưới · Ghép và tách', ja: '左右構造 · 上下構造 · 組み立てと分解' }
    }),
    available({
      stableId: 'lesson-06', displayOrder: 6, displayNumber: 6, file: 'lesson-06.html', duration: 14, xp: 50, icon: '🌈', template: 'compound-vowels', prerequisites: ['lesson-05'], requiresCompletion: true, releaseStatus: 'audioPending',
      title: { zh: '复合元音', en: 'Compound Vowels', vi: 'Nguyên âm ghép', ja: '複合母音' },
      parts: { zh: 'ㅒㅖㅘㅙㅚㅝㅞㅟㅢ · 拼写结构 · 无收音词汇', en: 'ㅒㅖㅘㅙㅚㅝㅞㅟㅢ · Spelling structure · Words without finals', vi: 'ㅒㅖㅘㅙㅚㅝㅞㅟㅢ · Cấu trúc chữ · Từ không âm cuối', ja: 'ㅒㅖㅘㅙㅚㅝㅞㅟㅢ · 綴り構造 · 終声のない語' }
    }),
    available({
      stableId: 'lesson-04', displayOrder: 7, displayNumber: 7, file: 'lesson-04.html', duration: 13, xp: 50, icon: '🏁', template: 'hangul-batchim', prerequisites: ['lesson-03'],
      title: { zh: '四个基础收音 ㄴㅁㅇㄹ', en: 'Four Basic Finals ㄴㅁㅇㄹ', vi: 'Bốn âm cuối cơ bản ㄴㅁㅇㄹ', ja: '4つの基本パッチム ㄴㅁㅇㄹ' },
      parts: { zh: '산 · 몸 · 공 · 물 · 完整单词发音', en: '산 · 몸 · 공 · 물 · Full-word pronunciation', vi: '산 · 몸 · 공 · 물 · Phát âm từ đầy đủ', ja: '산 · 몸 · 공 · 물 · 単語全体の発音' }
    }),
    comingSoon({
      stableId: 'k0-lesson-08-plan', displayOrder: 8, displayNumber: 8, icon: '🎧',
      title: { zh: '七种代表收音和常见音变', en: 'Seven Representative Finals and Sound Changes', vi: 'Bảy âm cuối đại diện và biến âm', ja: '7つの代表パッチムと音変化' },
      parts: { zh: '代表音 · 连音 · 鼻音化 · 常见规则', en: 'Representative sounds · Linking · Nasalization', vi: 'Âm đại diện · Nối âm · Mũi hóa', ja: '代表音 · 連音 · 鼻音化' }
    }),
    comingSoon({
      stableId: 'k0-lesson-09-plan', displayOrder: 9, displayNumber: 9, icon: '👋',
      title: { zh: '场景韩语：问候与介绍', en: 'Scenario Korean: Greetings and Introductions', vi: 'Tiếng Hàn tình huống: Chào hỏi và giới thiệu', ja: '場面韓国語：あいさつと自己紹介' },
      parts: { zh: '从第9课起进入问候、介绍等真实场景', en: 'Real greetings and introductions begin from Lesson 9', vi: 'Bắt đầu chào hỏi và giới thiệu thực tế từ Bài 9', ja: '第9課から実際のあいさつ・紹介へ' }
    })
  ].sort((a, b) => a.displayOrder - b.displayOrder);

  window.NIKIGO_COURSES = Object.freeze(lessons.map(lesson => Object.freeze(lesson)));
  window.NIKIGO_COURSE_UNLOCKED = function (lesson, completedLessons) {
    if (!lesson || lesson.status !== 'available' || lesson.releaseStatus === 'audioPending') return false;
    if (!lesson.requiresCompletion) return true;
    const completed = new Set(completedLessons || []);
    return lesson.prerequisites.every(stableId => completed.has(stableId));
  };
  window.NIKIGO_NEXT_LESSON = function (completedLessons) {
    const completed = new Set(completedLessons || []);
    const availableLessons = lessons.filter(lesson => window.NIKIGO_COURSE_UNLOCKED(lesson, completedLessons));
    return availableLessons.find(lesson => !completed.has(lesson.stableId)) || availableLessons[availableLessons.length - 1];
  };
})();
