(function () {
  'use strict';

  const languageCopy = {
    zh: {
      htmlLang: 'zh-CN', nav: ['首页','学习','练习','进度','我的'], language: '辅助语言', skip: '跳到主要内容',
      pageTitle: '学习', pageLead: '选择阶段，沿着清楚的Module路径继续学习。',
      currentStage: '当前阶段', stageProgress: 'Stage进度', lessonsComplete: (done,total) => `${done} / ${total}课完成`,
      pathTitle: '学习路径', pathLead: '连接线表示推荐顺序，不限制课程自由进入。',
      learning: '正在学习', completed: '已完成', available: '可学习', gate: '音频准备中',
      continue: '继续学习', start: '开始学习', relearn: '重新学习', preview: '进入预览', moduleDetail: '查看模块',
      currentContentComplete: '当前可完成内容已学完', oneAudioPending: '1课音频准备中',
      back: '返回Stage路径', moduleProgress: 'Module进度', lessons: '本Module课程',
      lesson: n => `第${n}课`, minutes: n => `${n}分钟`, prototypeNotice: '隔离原型不会打开正式课程。',
      navNotice: '本轮仅制作学习页隔离原型。'
    },
    en: {
      htmlLang: 'en', nav: ['Home','Learn','Practice','Progress','Me'], language: 'Support language', skip: 'Skip to main content',
      pageTitle: 'Learn', pageLead: 'Choose a stage and follow a clear module path.',
      currentStage: 'Current stage', stageProgress: 'Stage progress', lessonsComplete: (done,total) => `${done} of ${total} lessons complete`,
      pathTitle: 'Learning path', pathLead: 'The line shows the recommended order. It does not lock access.',
      learning: 'Learning now', completed: 'Completed', available: 'Available', gate: 'Audio in preparation',
      continue: 'Continue learning', start: 'Start learning', relearn: 'Relearn', preview: 'Open preview', moduleDetail: 'View module',
      currentContentComplete: 'Current completable content finished', oneAudioPending: '1 lesson awaiting audio',
      back: 'Back to stage path', moduleProgress: 'Module progress', lessons: 'Lessons in this module',
      lesson: n => `Lesson ${n}`, minutes: n => `${n} min`, prototypeNotice: 'This isolated prototype does not open a live lesson.',
      navNotice: 'This round only prototypes the Learn page.'
    },
    vi: {
      htmlLang: 'vi', nav: ['Trang chủ','Học','Luyện tập','Tiến độ','Của tôi'], language: 'Ngôn ngữ hỗ trợ', skip: 'Chuyển đến nội dung chính',
      pageTitle: 'Học', pageLead: 'Chọn giai đoạn và tiếp tục theo lộ trình Module rõ ràng.',
      currentStage: 'Giai đoạn hiện tại', stageProgress: 'Tiến độ Stage', lessonsComplete: (done,total) => `Hoàn thành ${done} / ${total} bài`,
      pathTitle: 'Lộ trình học', pathLead: 'Đường nối chỉ thứ tự đề xuất, không khóa quyền truy cập.',
      learning: 'Đang học', completed: 'Đã hoàn thành', available: 'Có thể học', gate: 'Đang chuẩn bị âm thanh',
      continue: 'Tiếp tục học', start: 'Bắt đầu học', relearn: 'Học lại', preview: 'Mở bản xem trước', moduleDetail: 'Xem Module',
      currentContentComplete: 'Đã học xong nội dung hiện có thể hoàn thành', oneAudioPending: '1 bài đang chuẩn bị âm thanh',
      back: 'Quay lại lộ trình Stage', moduleProgress: 'Tiến độ Module', lessons: 'Bài học trong Module',
      lesson: n => `Bài ${n}`, minutes: n => `${n} phút`, prototypeNotice: 'Nguyên mẫu tách biệt này không mở bài học chính thức.',
      navNotice: 'Vòng này chỉ tạo nguyên mẫu trang Học.'
    },
    ja: {
      htmlLang: 'ja', nav: ['ホーム','学習','練習','進捗','マイページ'], language: '補助言語', skip: 'メインコンテンツへ移動',
      pageTitle: '学習', pageLead: 'ステージを選び、わかりやすいModuleの道筋に沿って学びます。',
      currentStage: '現在のステージ', stageProgress: 'Stage進捗', lessonsComplete: (done,total) => `${done} / ${total}課完了`,
      pathTitle: '学習パス', pathLead: '接続線は推奨順序です。アクセス制限ではありません。',
      learning: '学習中', completed: '完了', available: '学習可能', gate: '音声準備中',
      continue: '学習を続ける', start: '学習を始める', relearn: 'もう一度学ぶ', preview: 'プレビューへ', moduleDetail: 'Moduleを見る',
      currentContentComplete: '現在完了できる内容は学習済み', oneAudioPending: '1課の音声を準備中',
      back: 'Stageパスに戻る', moduleProgress: 'Module進捗', lessons: 'このModuleのレッスン',
      lesson: n => `第${n}課`, minutes: n => `${n}分`, prototypeNotice: 'この分離プロトタイプでは正式レッスンを開きません。',
      navNotice: '今回は学習ページの分離プロトタイプのみです。'
    }
  };

  const lessons = {
    'lesson-00': { number:0, duration:3, title:{zh:'先认识韩文字母地图',en:'Meet the Hangul Map First',vi:'Làm quen bản đồ Hangul',ja:'まずハングルの全体図を知ろう'} },
    'lesson-01': { number:1, duration:12, title:{zh:'核心元音 ㅏㅓㅗㅜㅡㅣ',en:'Core Vowels ㅏㅓㅗㅜㅡㅣ',vi:'Nguyên âm cốt lõi ㅏㅓㅗㅜㅡㅣ',ja:'基本母音 ㅏㅓㅗㅜㅡㅣ'} },
    'lesson-02': { number:2, duration:13, title:{zh:'其余基础元音和易混元音',en:'More Basic and Easily Confused Vowels',vi:'Nguyên âm cơ bản còn lại và dễ nhầm',ja:'残りの基本母音と似た母音'} },
    'lesson-03': { number:3, duration:14, title:{zh:'高频基础辅音：通过完整音节学习',en:'High-frequency Consonants in Full Syllables',vi:'Phụ âm thường gặp trong âm tiết đầy đủ',ja:'完全な音節で学ぶ基本子音'} },
    'lesson-04': { number:4, duration:10, title:{zh:'听懂普通音、送气音和紧音',en:'Hear Plain, Aspirated, and Tense Sounds',vi:'Nghe âm thường, bật hơi và căng',ja:'平音・激音・濃音を聞き分ける'} },
    'lesson-05': { number:5, duration:10, title:{zh:'看懂韩语音节块',en:'Understand Korean Syllable Blocks',vi:'Hiểu khối âm tiết tiếng Hàn',ja:'韓国語の音節ブロックを理解する'} },
    'lesson-06': { number:6, duration:14, title:{zh:'复合元音',en:'Compound Vowels',vi:'Nguyên âm ghép',ja:'複合母音'} },
    'lesson-07': { number:7, duration:13, title:{zh:'四个基础收音 ㄴㅁㅇㄹ',en:'Four Basic Finals ㄴㅁㅇㄹ',vi:'Bốn âm cuối cơ bản ㄴㅁㅇㄹ',ja:'4つの基本パッチム ㄴㅁㅇㄹ'} },
    'lesson-08': { number:8, duration:15, title:{zh:'七种代表收音和常见音变',en:'Seven Representative Finals and Sound Changes',vi:'Bảy âm cuối đại diện và biến âm',ja:'7つの代表パッチムと音変化'} },
    'lesson-09': { number:9, duration:15, title:{zh:'场景韩语：问候与介绍',en:'Scenario Korean: Greetings and Introductions',vi:'Tiếng Hàn tình huống: Chào hỏi và giới thiệu',ja:'場面韓国語：あいさつと自己紹介'} },
    'lesson-10': { number:10, duration:15, title:{zh:'K0阶段复习挑战',en:'K0 Review Challenge',vi:'Thử thách ôn tập K0',ja:'K0復習チャレンジ'} },
    'lesson-11': { number:11, duration:13, title:{zh:'姓名与身份',en:'Name and Identity',vi:'Tên và thân phận',ja:'名前と立場'} },
    'lesson-12': { number:12, duration:13, title:{zh:'国家与语言',en:'Countries and Languages',vi:'Quốc gia và ngôn ngữ',ja:'国と言語'} },
    'lesson-13': { number:13, duration:13, title:{zh:'固有数词1～10与基础数量',en:'Native Korean Numbers 1-10 and Basic Quantities',vi:'Số thuần Hàn 1-10 và số lượng cơ bản',ja:'固有数詞1～10と基本数量'} }
  };

  const stages = [
    {
      id:'K0', order:1, total:11, completed:6, art:'assets/illustrations/stage-k0.png',
      name:{zh:'韩文基础',en:'Hangul Foundations',vi:'Nền tảng Hangul',ja:'ハングル基礎'},
      label:{zh:'阶段1 · 韩文基础',en:'Stage 1 · Hangul Foundations',vi:'Giai đoạn 1 · Nền tảng Hangul',ja:'ステージ1 · ハングル基礎'},
      goal:{zh:'认识韩文结构，逐步建立拼读、音节和基础发音规则意识。',en:'Understand Hangul structure and build decoding, syllable, and basic sound-rule awareness.',vi:'Hiểu cấu trúc Hangul và từng bước xây dựng khả năng ghép đọc, âm tiết cùng quy tắc phát âm cơ bản.',ja:'ハングルの構造を理解し、読み方・音節・基本的な発音規則を段階的に身につける。'},
      modules:['k0-hangul-map-and-vowels','k0-consonants-syllables-compound-vowels','k0-batchim-and-sound-changes','k0-integrated-use-and-checkpoint']
    },
    {
      id:'K1', order:2, total:3, completed:0, art:'assets/illustrations/stage-k1.png',
      name:{zh:'基础沟通',en:'Essential Korean',vi:'Giao tiếp tiếng Hàn cơ bản',ja:'韓国語の基本コミュニケーション'},
      label:{zh:'阶段2 · 基础沟通',en:'Stage 2 · Essential Korean',vi:'Giai đoạn 2 · Giao tiếp tiếng Hàn cơ bản',ja:'ステージ2 · 韓国語の基本コミュニケーション'},
      goal:{zh:'使用基础礼貌表达介绍姓名、身份、来源和学习语言，并进行简单数量问答。',en:'Use polite basics for names, identity, origin, study language, and simple quantity exchanges.',vi:'Dùng cách nói lịch sự cơ bản về tên, thân phận, xuất thân, ngôn ngữ học và số lượng đơn giản.',ja:'基本的な丁寧表現で名前・立場・出身・学習言語を伝え、簡単な数量を尋ねる。'},
      modules:['k1-identity-and-language-background','k1-numbers-and-quantities']
    }
  ];

  const modules = {
    'k0-hangul-map-and-vowels': {
      stage:'K0', order:1, art:'assets/illustrations/module-k0-map-vowels.png', state:'completed', completed:3,
      lessons:['lesson-00','lesson-01','lesson-02'],
      name:{zh:'韩文地图与基础元音',en:'Hangul Map and Core Vowels',vi:'Bản đồ Hangul và nguyên âm cơ bản',ja:'ハングル全体図と基本母音'},
      goal:{zh:'看懂韩文字母系统，识别核心及易混元音。',en:'See the Hangul system and recognize core and easily confused vowels.',vi:'Hiểu hệ thống Hangul và nhận biết nguyên âm cốt lõi, dễ nhầm.',ja:'ハングル全体を理解し、基本母音と似た母音を見分ける。'}
    },
    'k0-consonants-syllables-compound-vowels': {
      stage:'K0', order:2, art:'assets/illustrations/module-k0-consonants-syllables.png', state:'gated', completed:3,
      lessons:['lesson-03','lesson-04','lesson-05','lesson-06'],
      name:{zh:'辅音、音节块与复合元音',en:'Consonants, Syllable Blocks, and Compound Vowels',vi:'Phụ âm, khối âm tiết và nguyên âm ghép',ja:'子音・音節ブロック・複合母音'},
      goal:{zh:'区分常见辅音，理解音节块，并掌握复合元音拼写结构。',en:'Distinguish common consonants, understand syllable blocks, and learn compound-vowel spelling.',vi:'Phân biệt phụ âm thường gặp, hiểu khối âm tiết và cấu trúc nguyên âm ghép.',ja:'基本子音を区別し、音節ブロックと複合母音の綴りを理解する。'}
    },
    'k0-batchim-and-sound-changes': {
      stage:'K0', order:3, art:'assets/illustrations/module-k0-batchim-sound.png', state:'current', completed:0,
      lessons:['lesson-07','lesson-08'], currentLesson:'lesson-07', korean:'산 · 몸 · 공 · 물',
      name:{zh:'收音与常见音变',en:'Final Consonants and Common Sound Changes',vi:'Âm cuối và các biến âm thường gặp',ja:'パッチムとよくある音変化'},
      goal:{zh:'识别基础收音、代表收音和常见音变。',en:'Recognize basic finals, representative final sounds, and common sound changes.',vi:'Nhận biết âm cuối cơ bản, âm cuối đại diện và các biến âm thường gặp.',ja:'基本パッチム、代表終声、よくある音変化を見分ける。'}
    },
    'k0-integrated-use-and-checkpoint': {
      stage:'K0', order:4, art:'assets/illustrations/module-k0-checkpoint.png', state:'available', completed:0,
      lessons:['lesson-09','lesson-10'],
      name:{zh:'综合应用与K0阶段挑战',en:'Integrated Use and the K0 Checkpoint',vi:'Vận dụng tổng hợp và thử thách K0',ja:'総合活用とK0チェックポイント'},
      goal:{zh:'在真实场景中综合使用已学内容，并完成K0阶段检查。',en:'Apply earlier learning in real situations and complete the K0 checkpoint.',vi:'Vận dụng kiến thức trong tình huống thực tế và hoàn thành kiểm tra K0.',ja:'実際の場面で既習内容を統合し、K0チェックを完了する。'}
    },
    'k1-identity-and-language-background': {
      stage:'K1', order:1, art:'assets/illustrations/module-k1-identity.png', state:'current', completed:0,
      lessons:['lesson-11','lesson-12'], currentLesson:'lesson-11', korean:'이름이 뭐예요?',
      name:{zh:'姓名、身份与语言背景',en:'Names, Identity, and Language Background',vi:'Tên, thân phận và nền tảng ngôn ngữ',ja:'名前・立場・言語背景'},
      goal:{zh:'礼貌询问并表达姓名、身份、来自哪里和正在学习的语言。',en:'Ask and give names, identity, origin, and study language politely.',vi:'Hỏi và nói tên, thân phận, nơi đến và ngôn ngữ đang học một cách lịch sự.',ja:'丁寧に名前・立場・出身・学習している言語を尋ね、伝える。'}
    },
    'k1-numbers-and-quantities': {
      stage:'K1', order:2, art:'assets/illustrations/module-k1-numbers.png', state:'available', completed:0,
      lessons:['lesson-13'],
      name:{zh:'数字与基础数量',en:'Numbers and Basic Quantities',vi:'Số và số lượng cơ bản',ja:'数字と基本的な数量'},
      goal:{zh:'使用固有数词1～10和常用变形进行基础数量问答。',en:'Use native Korean numbers 1-10 and common shortened forms in quantity exchanges.',vi:'Dùng số thuần Hàn 1-10 và dạng rút gọn trong hỏi đáp số lượng.',ja:'固有数詞1～10と短縮形を簡単な数量のやり取りで使う。'}
    }
  };

  const params = new URLSearchParams(location.search);
  const state = {
    language: languageCopy[params.get('lang')] ? params.get('lang') : 'zh',
    stageId: stages.some(stage => stage.id === params.get('stage')) ? params.get('stage') : 'K1',
    moduleId: modules[params.get('module')] ? params.get('module') : null
  };

  const app = document.querySelector('#app');
  const languageSelect = document.querySelector('#languageSelect');
  const live = document.querySelector('#liveStatus');

  function local(value) { return value[state.language] || value.zh; }
  function copy() { return languageCopy[state.language]; }
  function escapeHtml(value) { return String(value).replace(/[&<>"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char])); }
  function announce(message) { live.textContent = ''; requestAnimationFrame(() => { live.textContent = message; }); }

  function syncUrl(push) {
    const next = new URL(location.href);
    next.searchParams.set('lang', state.language);
    next.searchParams.set('stage', state.stageId);
    if (state.moduleId) next.searchParams.set('module', state.moduleId); else next.searchParams.delete('module');
    history[push ? 'pushState' : 'replaceState']({}, '', next);
  }

  function renderChrome() {
    document.documentElement.lang = copy().htmlLang;
    document.querySelector('.skip-link').textContent = copy().skip;
    languageSelect.value = state.language;
    languageSelect.setAttribute('aria-label', copy().language);
    document.querySelectorAll('[data-nav]').forEach((button, index) => {
      button.textContent = copy().nav[index % 5];
      button.onclick = () => announce(copy().navNotice);
    });
  }

  function stageTabs() {
    return `<div class="stage-tabs" role="tablist" aria-label="${escapeHtml(copy().pageTitle)}">${stages.map(stage => `<button type="button" class="stage-tab" role="tab" aria-selected="${stage.id === state.stageId}" aria-controls="stage-panel" tabindex="${stage.id === state.stageId ? '0' : '-1'}" data-stage="${stage.id}"><span>${escapeHtml(local(stage.label))}</span>${stage.id === state.stageId ? `<small>${escapeHtml(copy().currentStage)}</small>` : ''}</button>`).join('')}</div>`;
  }

  function moduleStatus(module) {
    if (module.state === 'current') return copy().learning;
    if (module.state === 'completed') return copy().completed;
    if (module.state === 'gated') return copy().gate;
    return copy().available;
  }

  function moduleCard(moduleId) {
    const module = modules[moduleId];
    const total = module.lessons.length;
    const currentLesson = module.currentLesson ? lessons[module.currentLesson] : null;
    const count = module.state === 'gated'
      ? `${module.completed}/${total} · ${copy().currentContentComplete}`
      : copy().lessonsComplete(module.completed, total);
    return `<article class="module-card ${module.state}" data-module-card="${moduleId}">
      <div class="module-art-wrap"><img class="module-art" src="${module.art}" alt="" width="443" height="443" loading="lazy"><span class="module-number" aria-label="Module ${module.order}">${module.order}</span></div>
      <div class="module-content">
        <div class="module-topline"><span class="module-status">${escapeHtml(moduleStatus(module))}</span><span class="module-count">${escapeHtml(count)}</span></div>
        <h3>${escapeHtml(local(module.name))}</h3>
        <p class="module-goal">${escapeHtml(local(module.goal))}</p>
        ${currentLesson ? `<p class="current-lesson"><span lang="ko">${escapeHtml(module.korean)}</span><b>${escapeHtml(copy().lesson(currentLesson.number))} · ${escapeHtml(local(currentLesson.title))}</b></p>` : ''}
        ${module.state === 'gated' ? `<p class="gate-copy">${escapeHtml(copy().oneAudioPending)}</p>` : ''}
        <div class="module-actions">
          ${module.state === 'current' ? `<button type="button" class="primary-action" data-course-action>${escapeHtml(copy().continue)}</button>` : ''}
          <button type="button" class="${module.state === 'current' ? 'text-action' : 'secondary-action'}" data-open-module="${moduleId}">${escapeHtml(copy().moduleDetail)}</button>
        </div>
      </div>
    </article>`;
  }

  function renderStage() {
    const stage = stages.find(item => item.id === state.stageId);
    const percent = stage.completed / stage.total;
    app.innerHTML = `<div class="page">
      <header class="page-heading"><h1>${escapeHtml(copy().pageTitle)}</h1><p>${escapeHtml(copy().pageLead)}</p></header>
      ${stageTabs()}
      <section class="stage-intro" id="stage-panel" role="tabpanel">
        <div class="stage-intro-copy"><h2>${escapeHtml(local(stage.label))}</h2><p>${escapeHtml(local(stage.goal))}</p><div class="stage-progress-copy"><span>${escapeHtml(copy().stageProgress)}</span><b>${escapeHtml(copy().lessonsComplete(stage.completed,stage.total))}</b></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${stage.total}" aria-valuenow="${stage.completed}"><i style="--progress:${percent}"></i></div></div>
        <img class="stage-art" src="${stage.art}" alt="" width="443" height="443" fetchpriority="high">
      </section>
      <section class="path-section"><header class="section-heading"><h2>${escapeHtml(copy().pathTitle)}</h2><p>${escapeHtml(copy().pathLead)}</p></header><div class="module-path">${stage.modules.map(moduleCard).join('')}</div></section>
    </div>`;
    bindStageEvents();
  }

  function lessonState(module, lessonId) {
    if (lessonId === 'lesson-06') return 'gated';
    if (module.currentLesson === lessonId) return 'current';
    const completedIds = new Set(['lesson-00','lesson-01','lesson-02','lesson-03','lesson-04','lesson-05']);
    return completedIds.has(lessonId) ? 'completed' : 'available';
  }

  function lessonRow(module, lessonId) {
    const lesson = lessons[lessonId];
    const lessonStatus = lessonState(module, lessonId);
    const label = lessonStatus === 'gated' ? copy().gate : lessonStatus === 'current' ? copy().learning : lessonStatus === 'completed' ? copy().completed : copy().available;
    const action = lessonStatus === 'gated' ? copy().preview : lessonStatus === 'current' ? copy().continue : lessonStatus === 'completed' ? copy().relearn : copy().start;
    return `<article class="lesson-row ${lessonStatus}"><span class="lesson-node">${lesson.number}</span><div class="lesson-copy"><small>${escapeHtml(copy().lesson(lesson.number))} · ${escapeHtml(copy().minutes(lesson.duration))} · ${escapeHtml(label)}</small><b>${escapeHtml(local(lesson.title))}</b></div><button type="button" class="lesson-action" data-course-action>${escapeHtml(action)}</button></article>`;
  }

  function renderModuleDetail() {
    const module = modules[state.moduleId];
    const stage = stages.find(item => item.id === module.stage);
    const total = module.lessons.length;
    const progress = module.completed / total;
    app.innerHTML = `<div class="page"><div class="detail-shell">
      <button type="button" class="back-button" data-back>${escapeHtml(copy().back)}</button>
      <header class="detail-header"><div><p>${escapeHtml(local(stage.label))}</p><h1>${escapeHtml(local(module.name))}</h1><p>${escapeHtml(local(module.goal))}</p><div class="stage-progress-copy"><span>${escapeHtml(copy().moduleProgress)}</span><b>${escapeHtml(copy().lessonsComplete(module.completed,total))}</b></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="${total}" aria-valuenow="${module.completed}"><i style="--progress:${progress}"></i></div>${module.state === 'gated' ? `<p class="gate-copy">${escapeHtml(copy().currentContentComplete)}<br>${escapeHtml(copy().oneAudioPending)}</p>` : ''}</div><img class="detail-art" src="${module.art}" alt="" width="443" height="443" fetchpriority="high"></header>
      <section class="lesson-section"><h2>${escapeHtml(copy().lessons)}</h2><div class="lesson-list">${module.lessons.map(id => lessonRow(module,id)).join('')}</div></section>
    </div></div>`;
    document.querySelector('[data-back]').onclick = () => { state.moduleId = null; syncUrl(true); render(); app.focus(); };
    document.querySelectorAll('[data-course-action]').forEach(button => button.onclick = () => announce(copy().prototypeNotice));
  }

  function bindStageEvents() {
    const stageButtons = [...document.querySelectorAll('[data-stage]')];
    const selectStage = button => {
      state.stageId = button.dataset.stage;
      state.moduleId = null;
      syncUrl(true);
      render();
      document.querySelector(`[data-stage="${state.stageId}"]`)?.focus();
    };
    stageButtons.forEach((button, index) => {
      button.onclick = () => selectStage(button);
      button.onkeydown = event => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? stageButtons.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + stageButtons.length) % stageButtons.length;
        selectStage(stageButtons[nextIndex]);
      };
    });
    document.querySelectorAll('[data-open-module]').forEach(button => button.onclick = () => {
      state.moduleId = button.dataset.openModule;
      syncUrl(true);
      render();
      app.focus();
    });
    document.querySelectorAll('[data-course-action]').forEach(button => button.onclick = () => announce(copy().prototypeNotice));
  }

  function render() {
    renderChrome();
    if (state.moduleId) renderModuleDetail(); else renderStage();
  }

  languageSelect.addEventListener('change', event => {
    state.language = event.target.value;
    syncUrl(false);
    render();
  });

  window.addEventListener('popstate', () => {
    const next = new URLSearchParams(location.search);
    state.language = languageCopy[next.get('lang')] ? next.get('lang') : 'zh';
    state.stageId = stages.some(stage => stage.id === next.get('stage')) ? next.get('stage') : 'K1';
    state.moduleId = modules[next.get('module')] ? next.get('module') : null;
    render();
  });

  syncUrl(false);
  render();
}());
