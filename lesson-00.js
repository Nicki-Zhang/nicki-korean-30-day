(function (global) {
  'use strict';

  const SUPPORTED = ['zh', 'en', 'vi', 'ja'];
  const COPY = Object.freeze({
    zh: { lessonName:'第0课 · 韩文字母地图',eyebrow:'K0 · 3分钟全局认识',title:'先认识韩文字母地图',description:'韩语由辅音、元音和音节块组成。你不需要现在记住所有字母，Nikigo会带你分阶段学习。',basicConsonantsTitle:'基础辅音',aspiratedTitle:'送气音',tenseTitle:'紧音',basicVowelsTitle:'基础元音',compoundVowelsTitle:'复合元音',soundRule:'💡 辅音通常不能脱离元音自然发音，因此后续课程会通过完整音节和真实单词学习。',startTitle:'选择适合你的起点',startLead:'这不是考试，只用于安排下一步。',beginnerTitle:'我从零开始',beginnerDescription:'从第1课的核心元音开始。',partialTitle:'我认识一些字母',partialDescription:'进入现有诊断流程；字母专项检查仍在开发。',readerTitle:'我已经能拼读韩文',readerDescription:'返回课程主页；第9课起的场景课程在测试版中尚未开放。',savedBeginner:'已保存：从零开始，正在进入第1课…',savedPartial:'已保存：认识一些字母，正在进入字母检查…',savedReader:'已保存：已经能拼读。测试版场景课程尚未开放，正在返回课程主页…',back:'← 返回课程主页',home:'返回学习主页'},
    en: { lessonName:'Lesson 0 · Hangul Map',eyebrow:'K0 · 3-MINUTE ORIENTATION',title:'Meet the Hangul Map First',description:'Korean is built from consonants, vowels and syllable blocks. You do not need to memorize every letter now—Nikigo will guide you in stages.',basicConsonantsTitle:'Basic consonants',aspiratedTitle:'Aspirated consonants',tenseTitle:'Tense consonants',basicVowelsTitle:'Basic vowels',compoundVowelsTitle:'Compound vowels',soundRule:'💡 Consonants usually cannot be pronounced naturally without a vowel, so later lessons teach them through complete syllables and real words.',startTitle:'Choose your starting point',startLead:'This is not a test; it only sets your next step.',beginnerTitle:'I am starting from zero',beginnerDescription:'Begin with core vowels in Lesson 1.',partialTitle:'I recognize some letters',partialDescription:'Continue to the existing check; a Hangul-specific check is still in development.',readerTitle:'I can already decode Hangul',readerDescription:'Return to Courses; scenario lessons from Lesson 9 are not yet open in this test build.',savedBeginner:'Saved: starting from zero. Opening Lesson 1…',savedPartial:'Saved: some letter knowledge. Opening the letter check…',savedReader:'Saved: able to decode Hangul. Scenario lessons are not yet open; returning to Courses…',back:'← Return to Courses',home:'Return to learning home'},
    vi: { lessonName:'Bài 0 · Bản đồ Hangul',eyebrow:'K0 · LÀM QUEN TRONG 3 PHÚT',title:'Làm quen bản đồ chữ Hangul',description:'Tiếng Hàn được tạo từ phụ âm, nguyên âm và khối âm tiết. Bạn không cần nhớ tất cả chữ cái ngay bây giờ; Nikigo sẽ hướng dẫn theo từng giai đoạn.',basicConsonantsTitle:'Phụ âm cơ bản',aspiratedTitle:'Phụ âm bật hơi',tenseTitle:'Phụ âm căng',basicVowelsTitle:'Nguyên âm cơ bản',compoundVowelsTitle:'Nguyên âm ghép',soundRule:'💡 Phụ âm thường không thể phát âm tự nhiên nếu tách khỏi nguyên âm, nên các bài sau sẽ dạy qua âm tiết đầy đủ và từ thật.',startTitle:'Chọn điểm bắt đầu',startLead:'Đây không phải bài kiểm tra; lựa chọn chỉ sắp xếp bước tiếp theo.',beginnerTitle:'Tôi bắt đầu từ số 0',beginnerDescription:'Bắt đầu với nguyên âm cốt lõi ở Bài 1.',partialTitle:'Tôi biết một số chữ cái',partialDescription:'Chuyển đến quy trình đánh giá hiện có; bài kiểm tra Hangul riêng vẫn đang phát triển.',readerTitle:'Tôi đã có thể ghép đọc Hangul',readerDescription:'Trở về trang Bài học; các bài tình huống từ Bài 9 chưa mở trong bản thử nghiệm.',savedBeginner:'Đã lưu: bắt đầu từ số 0. Đang mở Bài 1…',savedPartial:'Đã lưu: biết một số chữ cái. Đang mở phần kiểm tra…',savedReader:'Đã lưu: có thể ghép đọc Hangul. Bài tình huống chưa mở; đang trở về trang Bài học…',back:'← Trở về Bài học',home:'Về trang học tập'},
    ja: { lessonName:'第0課 · ハングルマップ',eyebrow:'K0 · 3分で全体を知る',title:'まずハングルの全体図を知ろう',description:'韓国語は子音・母音・音節ブロックでできています。今すべての文字を覚える必要はありません。Nikigoが段階的に案内します。',basicConsonantsTitle:'基本子音',aspiratedTitle:'激音',tenseTitle:'濃音',basicVowelsTitle:'基本母音',compoundVowelsTitle:'複合母音',soundRule:'💡 子音は通常、母音から離して自然に発音できません。そのため後のレッスンでは、完全な音節と実際の単語を使って学びます。',startTitle:'開始地点を選ぶ',startLead:'テストではありません。次のステップを決めるための選択です。',beginnerTitle:'ゼロから始める',beginnerDescription:'第1課の基本母音から始めます。',partialTitle:'いくつかの文字を知っている',partialDescription:'既存のチェックへ進みます。ハングル専用チェックは開発中です。',readerTitle:'すでにハングルを読める',readerDescription:'コース画面へ戻ります。第9課以降の場面レッスンはテスト版では未公開です。',savedBeginner:'保存しました：ゼロから開始。第1課を開きます…',savedPartial:'保存しました：いくつかの文字を知っています。チェックを開きます…',savedReader:'保存しました：ハングルを読めます。場面レッスンは未公開のため、コース画面へ戻ります…',back:'← コースへ戻る',home:'学習ホームへ戻る'}
  });

  function normalizeLanguage(value) {
    const normalized = String(value || '').toLowerCase();
    if (SUPPORTED.includes(normalized)) return normalized;
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('vi')) return 'vi';
    if (normalized.startsWith('ja')) return 'ja';
    return 'en';
  }

  function routeFor(level, language) {
    const suffix = `?lang=${SUPPORTED.includes(language) ? language : 'en'}`;
    if (level === 'beginner') return `lesson-01.html${suffix}`;
    if (level === 'partial') return `diagnostic.html${suffix}`;
    return `nikigo-app.html${suffix}#courses`;
  }

  function choicePatch(profile, level) {
    const completed = new Set(profile.completedLessons || []);
    completed.add('lesson-00');
    const recommendations = { beginner:'lesson-01', partial:'alphabet-check', reader:'scenario-coming-soon' };
    return {
      ...profile,
      path: profile.path || 'K0',
      hangulLevel: level,
      hangulRecommendation: recommendations[level],
      completedLessons: [...completed],
      lessonProgress: { ...(profile.lessonProgress || {}), 'lesson-00': 100 }
    };
  }

  function initialize() {
    const profile = global.NikigoState.get();
    const query = new URLSearchParams(global.location.search).get('lang');
    let language = SUPPORTED.includes(query) ? query : (SUPPORTED.includes(profile.interfaceLanguage) ? profile.interfaceLanguage : normalizeLanguage(global.navigator?.language));
    const byId = id => global.document.getElementById(id);
    const keys = ['lessonName','eyebrow','title','description','basicConsonantsTitle','aspiratedTitle','tenseTitle','basicVowelsTitle','compoundVowelsTitle','soundRule','startTitle','startLead','beginnerTitle','beginnerDescription','partialTitle','partialDescription','readerTitle','readerDescription','back'];

    function render() {
      global.document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
      byId('language').value = language;
      keys.forEach(key => { const target = byId(key === 'back' ? 'backButton' : key); if (target) target.textContent = COPY[language][key]; });
      byId('homeButton').setAttribute('aria-label', COPY[language].home);
      byId('homeLogo').setAttribute('aria-label', COPY[language].home);
      global.document.querySelectorAll('[data-level]').forEach(button => {
        const selected = button.dataset.level === global.NikigoState.get().hangulLevel;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    }

    function goHome() {
      global.location.href = `nikigo-app.html?lang=${language}#courses`;
    }

    function choose(level) {
      if (!['beginner','partial','reader'].includes(level)) return;
      const next = choicePatch(global.NikigoState.get(), level);
      global.NikigoState.save(next, 'lesson-00:starting-point');
      render();
      byId('selectionStatus').textContent = COPY[language][`saved${level[0].toUpperCase()}${level.slice(1)}`];
      global.setTimeout(() => { global.location.href = routeFor(level, language); }, 450);
    }

    byId('language').addEventListener('change', event => {
      language = SUPPORTED.includes(event.target.value) ? event.target.value : 'en';
      global.NikigoState.update({ interfaceLanguage:language, learningLanguage:language }, 'lesson-00:language');
      const nextUrl = new URL(global.location.href); nextUrl.searchParams.set('lang', language); global.history.replaceState(null, '', nextUrl);
      render();
    });
    global.document.querySelectorAll('[data-level]').forEach(button => button.addEventListener('click', () => choose(button.dataset.level)));
    byId('homeButton').addEventListener('click', goHome); byId('homeLogo').addEventListener('click', goHome); byId('backButton').addEventListener('click', goHome);
    render();
  }

  global.NikigoLesson00 = Object.freeze({ COPY, routeFor, choicePatch });
  global.document.addEventListener('DOMContentLoaded', initialize);
})(window);
