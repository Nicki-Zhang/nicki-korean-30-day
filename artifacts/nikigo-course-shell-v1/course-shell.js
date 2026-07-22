(function () {
  'use strict';

  const SUPPORTED = ['zh', 'en', 'vi', 'ja'];
  const query = new URLSearchParams(location.search);
  let language = SUPPORTED.includes(query.get('lang')) ? query.get('lang') : 'zh';
  let courseId = ['lesson07', 'lesson11', 'lesson10', 'lesson06'].includes(query.get('course')) ? query.get('course') : 'lesson07';
  let requestedState = query.get('state') || 'intro';
  let answerState = '';
  let buildTokens = [];

  const UI = {
    zh: { back:'学习路径', exit:'退出课程', skip:'跳到课程内容', exitLabel:'离开课程', exitTitle:'要返回学习路径吗？', exitBody:'当前原型不会写入真实学习状态。正式 Shell 接入后，应先保存当前步骤再退出。', exitCancel:'继续学习', exitConfirm:'返回学习路径', phaseIntro:'课程介绍', phaseLearn:'讲解', phasePractice:'练习', phaseChallenge:'挑战', phaseSummary:'总结', previous:'返回', next:'继续', start:'开始学习', check:'检查答案', retry:'再试一次', finish:'完成课程', relearn:'重新学习', courses:'返回学习路径', audio:'播放韩语音频', audioReady:'已通过审核，可以播放', audioPending:'精确审核音频尚不可用', selected:'已选择', answerZone:'你的答案', available:'可用词块', correct:'正确', wrong:'再观察一下', retryTitle:'错题重练', firstXp:'首次完成 +50 XP', repeatXp:'重复完成 +0 XP', saved:'进度已保存', resume:'已恢复上次学习位置' },
    en: { back:'Learning path', exit:'Exit lesson', skip:'Skip to lesson content', exitLabel:'Leave lesson', exitTitle:'Return to the learning path?', exitBody:'This prototype never writes real learning state. A formal Shell should save the current step before leaving.', exitCancel:'Keep learning', exitConfirm:'Return to learning path', phaseIntro:'Introduction', phaseLearn:'Learn', phasePractice:'Practice', phaseChallenge:'Challenge', phaseSummary:'Summary', previous:'Back', next:'Continue', start:'Start learning', check:'Check answer', retry:'Try again', finish:'Complete lesson', relearn:'Relearn', courses:'Return to learning path', audio:'Play Korean audio', audioReady:'Approved and ready to play', audioPending:'Exact approved audio is unavailable', selected:'Selected', answerZone:'Your answer', available:'Available chunks', correct:'Correct', wrong:'Look at it again', retryTitle:'Mistake review', firstXp:'First completion +50 XP', repeatXp:'Repeat completion +0 XP', saved:'Progress saved', resume:'Last learning position restored' },
    vi: { back:'Lộ trình học', exit:'Thoát bài học', skip:'Chuyển đến nội dung bài học', exitLabel:'Rời bài học', exitTitle:'Quay về lộ trình học?', exitBody:'Nguyên mẫu này không ghi trạng thái học thật. Shell chính thức cần lưu bước hiện tại trước khi thoát.', exitCancel:'Tiếp tục học', exitConfirm:'Về lộ trình học', phaseIntro:'Giới thiệu', phaseLearn:'Giải thích', phasePractice:'Luyện tập', phaseChallenge:'Thử thách', phaseSummary:'Tổng kết', previous:'Quay lại', next:'Tiếp tục', start:'Bắt đầu học', check:'Kiểm tra', retry:'Thử lại', finish:'Hoàn thành bài', relearn:'Học lại', courses:'Về lộ trình học', audio:'Phát âm thanh tiếng Hàn', audioReady:'Đã duyệt và có thể phát', audioPending:'Chưa có âm thanh chính xác đã duyệt', selected:'Đã chọn', answerZone:'Câu của bạn', available:'Khối có thể dùng', correct:'Chính xác', wrong:'Hãy quan sát lại', retryTitle:'Luyện lại câu sai', firstXp:'Hoàn thành lần đầu +50 XP', repeatXp:'Hoàn thành lại +0 XP', saved:'Đã lưu tiến độ', resume:'Đã khôi phục vị trí học gần nhất' },
    ja: { back:'学習パス', exit:'レッスンを終了', skip:'レッスン内容へ移動', exitLabel:'レッスンを離れる', exitTitle:'学習パスへ戻りますか？', exitBody:'このプロトタイプは実際の学習状態を書き込みません。正式なShellでは終了前に現在のステップを保存します。', exitCancel:'学習を続ける', exitConfirm:'学習パスへ戻る', phaseIntro:'レッスン紹介', phaseLearn:'解説', phasePractice:'練習', phaseChallenge:'チャレンジ', phaseSummary:'まとめ', previous:'戻る', next:'続ける', start:'学習開始', check:'答えを確認', retry:'もう一度', finish:'レッスン完了', relearn:'もう一度学ぶ', courses:'学習パスへ戻る', audio:'韓国語音声を再生', audioReady:'審査済みで再生できます', audioPending:'完全一致の審査済み音声は利用できません', selected:'選択済み', answerZone:'あなたの答え', available:'使える語のかたまり', correct:'正解', wrong:'もう一度確認しましょう', retryTitle:'間違いの再練習', firstXp:'初回完了 +50 XP', repeatXp:'再完了 +0 XP', saved:'進捗を保存しました', resume:'前回の学習位置を復元しました' }
  };

  const L = (zh, en, vi, ja) => ({ zh, en, vi, ja });

  const COURSES = {
    lesson07: {
      stableId: 'lesson-07', number: 7, total: 13, stage:L('阶段1 · 韩文基础','Stage 1 · Hangul Foundations','Giai đoạn 1 · Nền tảng Hangul','ステージ1 · ハングル基礎'), module:L('收音与常见音变','Finals and common sound changes','Âm cuối và biến âm thường gặp','パッチムとよくある音変化'), lesson:L('第7课 · 四个基础收音','Lesson 7 · Four Basic Finals','Bài 7 · Bốn âm cuối cơ bản','第7課 · 4つの基本パッチム'),
      phases:['intro','learn','practice','challenge','summary'],
      states:['intro','resume','explain','example','audio-unavailable','choice','choice-correct','build','complete-first','complete-repeat']
    },
    lesson11: {
      stableId: 'lesson-11', number: 11, total: 13, stage:L('阶段2 · 基础沟通','Stage 2 · Essential Korean','Giai đoạn 2 · Giao tiếp tiếng Hàn cơ bản','ステージ2 · 韓国語の基本コミュニケーション'), module:L('姓名、身份与语言背景','Identity and language background','Tên, thân phận và nền tảng ngôn ngữ','名前・立場・言語背景'), lesson:L('第11课 · 姓名与身份','Lesson 11 · Name and Identity','Bài 11 · Tên và thân phận','第11課 · 名前と立場'),
      phases:['intro','learn','practice','challenge','summary'],
      states:['intro','dialogue','choice','wrong','retry','build','correct','complete-first','complete-repeat']
    },
    lesson10: {
      stableId: 'lesson-10', number: 10, total: 15, stage:L('阶段1 · 韩文基础','Stage 1 · Hangul Foundations','Giai đoạn 1 · Nền tảng Hangul','ステージ1 · ハングル基礎'), module:L('综合应用与K0阶段挑战','Integrated use and K0 checkpoint','Ứng dụng tổng hợp và thử thách K0','総合応用とK0チェックポイント'), lesson:L('第10课 · K0阶段复习挑战','Lesson 10 · K0 Review Challenge','Bài 10 · Thử thách ôn tập K0','第10課 · K0復習チャレンジ'),
      phases:['intro','practice','challenge','summary'],
      states:['intro','choice','wrong','retry','build','complete-first','complete-repeat']
    },
    lesson06: {
      stableId: 'lesson-06', number: 6, total: 18, stage:L('阶段1 · 韩文基础','Stage 1 · Hangul Foundations','Giai đoạn 1 · Nền tảng Hangul','ステージ1 · ハングル基礎'), module:L('辅音、音节块与复合元音','Consonants, syllable blocks, and compound vowels','Phụ âm, khối âm tiết và nguyên âm ghép','子音・音節ブロック・複合母音'), lesson:L('第6课 · 复合元音','Lesson 6 · Compound Vowels','Bài 6 · Nguyên âm ghép','第6課 · 複合母音'),
      phases:['intro','learn','practice','challenge','summary'],
      states:['gate','preview-complete']
    }
  };

  const stateMeta = {
    intro:{phase:'intro',step:1}, resume:{phase:'learn',step:5}, explain:{phase:'learn',step:2}, example:{phase:'learn',step:4}, 'audio-unavailable':{phase:'learn',step:4}, dialogue:{phase:'learn',step:2}, choice:{phase:'practice',step:8}, 'choice-correct':{phase:'practice',step:8}, wrong:{phase:'practice',step:7}, retry:{phase:'challenge',step:12}, build:{phase:'practice',step:6}, correct:{phase:'practice',step:6}, 'complete-first':{phase:'summary',step:13}, 'complete-repeat':{phase:'summary',step:13}, gate:{phase:'intro',step:1}, 'preview-complete':{phase:'summary',step:18}
  };

  const phaseLabel = key => UI[language][`phase${key[0].toUpperCase()}${key.slice(1)}`] || key;
  const local = value => typeof value === 'string' ? value : value?.[language] || value?.en || '';
  const ui = key => UI[language][key] || UI.en[key] || key;

  function feedback(correct, body) {
    return `<section class="feedbackPanel ${correct ? 'isCorrect' : 'isWrong'}" role="status"><div class="feedbackTitle"><span class="feedbackIcon" aria-hidden="true">${correct ? '✓' : '!'}</span><span>${ui(correct ? 'correct' : 'wrong')}</span></div><p>${body}</p></section>`;
  }

  function audioLine(playable, label) {
    return `<div class="audioLine"><button class="audioButton" type="button" ${playable ? '' : 'disabled aria-disabled="true"'} aria-label="${ui(playable ? 'audio' : 'audioPending')}">${playable ? '▶' : '×'}</button><div class="audioCopy"><strong>${label}</strong><span>${ui(playable ? 'audioReady' : 'audioPending')}</span></div></div>`;
  }

  function intro(course, korean, lead, facts, gated = false) {
    return `${gated ? `<aside class="gateNotice" role="status"><strong>预览 · 音频准备中</strong>本课可以自由进入，但当前不能正式完成，也不会获得完成 XP。</aside>` : ''}<div class="introPanel"><p class="surfaceLabel">${local(course.lesson)}</p><h1 class="koreanHero">${korean}</h1><p class="lessonLead">${lead}</p><div class="introFacts">${facts.map(item => `<span>${item}</span>`).join('')}</div></div>`;
  }

  function lesson07(state) {
    if (state === 'intro') return intro(COURSES.lesson07, '산 · 몸 · 공 · 물', '认识四个基础收音的位置，学习拼合、拆分并识别完整韩语单词。', ['约13分钟', '13个步骤', '首次完成 +50 XP']);
    if (state === 'resume') return `<aside class="resumeNotice" role="status"><strong>${ui('resume')}</strong>第5 / 13步 · 몸的收音ㅁ</aside>${lesson07('example')}`;
    if (state === 'explain') return `<p class="surfaceLabel">基础教学 · 收音位置</p><h1>收音位于音节块底部</h1><p class="lessonLead">以산为例，ㅅ是初声，ㅏ是元音，ㄴ放在底部成为收音。</p><div class="teachingGrid"><div class="koreanFocus" aria-label="韩文字 산">산</div><div class="teachingNotes"><div class="teachingNote"><small>拆分</small><strong class="koreanText">사 + ㄴ</strong></div><div class="teachingNote"><small>收音</small><strong>ㄴ位于音节块底部</strong></div><div class="teachingNote"><small>完整单词</small><strong>先看完整韩文，再观察末尾结构</strong></div></div></div>`;
    if (state === 'example' || state === 'audio-unavailable') return `<p class="surfaceLabel">韩语示例 · ㄴ收音</p><h1 class="koreanText">산</h1><p class="lessonLead">完整单词“山”。舌尖闭合，ㄴ在末尾代表[n]。</p><div class="teachingGrid"><div class="koreanFocus">산</div><div class="teachingNotes"><div class="teachingNote"><small>音节结构</small><strong class="koreanText">사 + ㄴ</strong></div><div class="teachingNote"><small>口腔动作</small><strong>舌尖闭合</strong></div>${audioLine(state !== 'audio-unavailable', '산 · 完整单词')}</div></div>`;
    if (state === 'choice' || state === 'choice-correct') {
      const correct = state === 'choice-correct' || answerState === 'correct';
      return `<p class="surfaceLabel">选择练习 · 拆分</p><h1 class="questionPrompt">哪一种拆分能得到산？</h1><p class="lessonLead">观察音节块底部的收音。</p><div class="questionBlock"><div class="choiceList">${[['사 + ㄴ',true],['산 + ㅇ',false],['ㅅ + 안',false]].map(([label,isCorrect],i)=>`<button class="choiceButton ${answerState || state === 'choice-correct' ? isCorrect ? 'isCorrect' : answerState === `wrong-${i}` ? 'isWrong' : '' : ''}" type="button" data-action="choose" data-correct="${isCorrect}" data-index="${i}" aria-pressed="${answerState === (isCorrect ? 'correct' : `wrong-${i}`)}"><span class="choiceIndex">${i+1}</span><span class="optionKorean">${label}</span></button>`).join('')}</div>${correct ? feedback(true,'산由사和收音ㄴ组成。ㄴ放在音节块底部。') : answerState ? feedback(false,'先观察哪一部分位于音节块底部。答案不会提前显示。') : ''}</div>`;
    }
    if (state === 'build') return buildView('拼出完整音节', '选择完整音节和收音，组成산。', ['사','ㄴ'], ['모','ㅇ','사','ㄴ']);
    return completionView('lesson07', '基础收音学习完成', '산 · 몸 · 공 · 물', ['识别收音在音节块底部的位置','拆分并拼合四个基础收音','完成综合识别练习'], state === 'complete-repeat');
  }

  function lesson11(state) {
    if (state === 'intro') return intro(COURSES.lesson11, '이름이 뭐예요?', '第一次见面时，询问姓名，表达自己的姓名与身份。', ['约8分钟', '13个步骤', '首次完成 +50 XP']);
    if (state === 'dialogue') return `<p class="surfaceLabel">场景任务 · 第一次见面</p><h1 class="koreanText">이름이 뭐예요?</h1><p class="lessonLead">先理解对话，再观察礼貌问姓名与回答的顺序。</p><div class="dialogueBlock"><div class="dialogueLine"><span class="speakerMark">A</span><div class="speech"><strong>안녕하세요.</strong><span>你好。</span></div></div><div class="dialogueLine fromB"><div class="speech"><strong>안녕하세요. 이름이 뭐예요?</strong><span>你好。你叫什么名字？</span></div><span class="speakerMark">B</span></div><div class="dialogueLine"><span class="speakerMark">A</span><div class="speech"><strong>저는 하늘이에요.</strong><span>我是Haneul。</span></div></div></div>${audioLine(false, '完整对话')}`;
    if (state === 'choice' || state === 'wrong' || state === 'retry') {
      const wrong = state === 'wrong' || answerState.startsWith('wrong');
      const retry = state === 'retry';
      return `${retry ? `<div class="retryStrip"><span>${ui('retryTitle')}</span><strong>还需答对 1 项</strong></div>` : ''}<p class="surfaceLabel">${retry ? '错题重练' : '场景选择'} · 礼貌回应</p><h1 class="questionPrompt koreanText">이름이 뭐예요?</h1><p class="lessonLead">选择适合第一次见面的回答。错误时不提前显示答案。</p><div class="questionBlock"><div class="choiceList">${[['저는 하늘이에요.',true],['네, 학생이 아니에요.',false],['어디에서 왔어요?',false]].map(([label,isCorrect],i)=>`<button class="choiceButton ${answerState || wrong ? isCorrect && answerState === 'correct' ? 'isCorrect' : (!isCorrect && (answerState === `wrong-${i}` || (wrong && i === 1))) ? 'isWrong' : '' : ''}" type="button" data-action="choose" data-correct="${isCorrect}" data-index="${i}"><span class="choiceIndex">${i+1}</span><span class="optionKorean">${label}</span></button>`).join('')}</div>${answerState === 'correct' ? feedback(true,'저는建立“我”的话题，하늘이에요礼貌地完成姓名介绍。') : wrong ? feedback(false,'先找到能直接回答姓名的句子。这里不会显示正确答案。') : ''}</div>`;
    }
    if (state === 'build' || state === 'correct') return buildView('拼出完整自我介绍', '按照话题、姓名、礼貌结尾的顺序组成句子。', ['저는','하늘','이에요'], ['이에요','저는','학생','하늘'], state === 'correct');
    return completionView('lesson11', '可以完成第一次见面的姓名介绍', '저는 하늘이에요.', ['询问对方姓名：이름이 뭐예요?','根据收音选择이에요或예요','介绍姓名与基础身份'], state === 'complete-repeat');
  }

  function lesson10(state) {
    if (state === 'intro') return intro(COURSES.lesson10, 'K0 복습', '连接第0至9课的文字、音节、收音、音变和场景内容。错题需要重练。', ['约15分钟', '15个步骤', 'K0阶段检查点']);
    if (state === 'choice' || state === 'wrong' || state === 'retry') {
      const wrong = state === 'wrong' || answerState.startsWith('wrong');
      return `${state === 'retry' ? `<div class="retryStrip"><span>${ui('retryTitle')}</span><strong>还需答对 1 项</strong></div>` : ''}<p class="surfaceLabel">阶段挑战 · 声音对比</p><h1 class="questionPrompt">바、파、빠依次属于哪三类？</h1><p class="lessonLead">复习第4课的普通音、送气音和紧音。</p><div class="questionBlock"><div class="choiceList">${[['普通音 → 送气音 → 紧音',true],['紧音 → 普通音 → 送气音',false],['三者没有区别',false]].map(([label,isCorrect],i)=>`<button class="choiceButton ${answerState || wrong ? isCorrect && answerState === 'correct' ? 'isCorrect' : (!isCorrect && (answerState === `wrong-${i}` || (wrong && i === 1))) ? 'isWrong' : '' : ''}" type="button" data-action="choose" data-correct="${isCorrect}" data-index="${i}"><span class="choiceIndex">${i+1}</span><span>${label}</span></button>`).join('')}</div>${answerState === 'correct' ? feedback(true,'ㅂ是普通音，ㅍ是送气音，ㅃ是紧音。') : wrong ? feedback(false,'回想气流强弱和发音紧张度。完成前会再次练习这道题。') : ''}</div>`;
    }
    if (state === 'build') return buildView('把ㅂ和ㅏ拼成完整音节', '选择初声和元音，复习左右结构。', ['ㅂ','ㅏ'], ['ㅏ','ㅍ','ㅂ','ㅗ']);
    return completionView('lesson10', 'K0阶段挑战完成', '한글 기초', ['复习核心元音与音节拼合','识别基础收音和常见音变','完成问候与自我介绍综合挑战'], state === 'complete-repeat');
  }

  function lesson06(state) {
    if (state === 'gate') return intro(COURSES.lesson06, 'ㅘ = ㅗ + ㅏ', '学习复合元音的拼写结构和无收音词汇。所需音频尚未正式发布。', ['18个结构预览步骤', '可以自由进入', '正式完成与XP关闭'], true);
    return `<aside class="gateNotice" role="status"><strong>当前可完成内容已学完</strong>Lesson 6保持预览状态。音频门禁关闭前不记录正式完成，也不发放XP。</aside><div class="completion"><div class="completionMark" aria-hidden="true">◇</div><p class="surfaceLabel">预览总结</p><h1>复合元音结构预览完成</h1><p class="completionKorean">ㅘ · ㅝ · ㅢ</p><ul class="masteryList"><li><b>✓</b><span>识别复合元音的组成部分</span></li><li><b>✓</b><span>完成当前可用的拼写和构建练习</span></li><li><b>◇</b><span>正式音频、完成状态与XP仍待门禁解除</span></li></ul><div class="rewardLine">正式完成 +0 XP · 预览状态不变</div></div>`;
  }

  function buildView(title, lead, expected, available, forcedCorrect = false) {
    const placed = forcedCorrect ? expected : buildTokens;
    const isComplete = placed.length === expected.length;
    const isCorrect = isComplete && expected.every((token,index) => placed[index] === token);
    return `<p class="surfaceLabel">构建练习</p><h1>${title}</h1><p class="lessonLead">${lead}</p><div class="buildArea"><section class="answerZone ${isComplete ? isCorrect ? 'isCorrect' : 'isWrong' : ''}" aria-label="${ui('answerZone')}"><div class="answerLabel"><span>${ui('answerZone')}</span><span>${placed.length}/${expected.length}</span></div><div class="answerTokens">${placed.map((token,index)=>`<button class="placedToken" type="button" data-action="remove-token" data-index="${index}">${token}</button>`).join('')}${Array.from({length:Math.max(0,expected.length-placed.length)},()=>'<span class="emptyToken">空位</span>').join('')}</div></section>${isComplete ? feedback(isCorrect, isCorrect ? '顺序与结构正确，可以继续。' : '词块已经放满。先找出开头，再检查礼貌结尾。') : ''}<span class="tokenBankLabel">${ui('available')}</span><div class="tokenBank">${available.map(token=>`<button class="tokenButton" type="button" data-action="add-token" data-token="${token}" ${placed.includes(token) || placed.length >= expected.length ? 'disabled' : ''}>${token}</button>`).join('')}</div></div>`;
  }

  function completionView(course, title, korean, items, repeat) {
    return `<div class="completion"><div class="completionMark" aria-hidden="true">✓</div><p class="surfaceLabel">课程总结</p><h1>${title}</h1><p class="completionKorean">${korean}</p><ul class="masteryList">${items.map(item=>`<li><b>✓</b><span>${item}</span></li>`).join('')}</ul><div class="rewardLine">${ui(repeat ? 'repeatXp' : 'firstXp')} · ${ui('saved')}</div></div>`;
  }

  function normalizedState(course) {
    return course.states.includes(requestedState) ? requestedState : course.states[0];
  }

  function currentPhaseIndex(course, state) {
    const phase = stateMeta[state]?.phase || 'intro';
    return Math.max(0, course.phases.indexOf(phase));
  }

  function updateUrl() {
    const params = new URLSearchParams(location.search);
    params.set('course', courseId);
    params.set('state', requestedState);
    params.set('lang', language);
    history.replaceState({courseId, requestedState}, '', `${location.pathname}?${params.toString()}`);
  }

  function renderActions(course, state) {
    const actions = document.querySelector('[data-actions]');
    const index = course.states.indexOf(state);
    const isEnd = state.includes('complete') || state === 'preview-complete';
    const isQuestion = ['choice','wrong','retry'].includes(state);
    const isBuild = state === 'build';
    actions.innerHTML = isEnd
      ? `<button class="secondaryButton" type="button" data-action="restart">${ui('relearn')}</button><button class="primaryButton" type="button" data-action="exit">${ui('courses')}</button>`
      : `<button class="textButton" type="button" data-action="previous" ${index <= 0 ? 'disabled' : ''}>${ui('previous')}</button><button class="primaryButton" type="button" data-action="${isQuestion ? 'question-next' : isBuild ? 'build-check' : 'next'}" ${isQuestion && !answerState ? 'disabled' : ''}>${index === 0 ? ui('start') : isBuild ? ui('check') : ui('next')}</button>`;
  }

  function renderSwitcher(course, state) {
    const switcher = document.querySelector('[data-prototype-switcher]');
    if (query.get('lab') !== '1') return;
    switcher.hidden = false;
    const courseSelect = switcher.querySelector('[data-course-switcher]');
    const stateSelect = switcher.querySelector('[data-state-switcher]');
    courseSelect.innerHTML = Object.entries(COURSES).map(([id,item])=>`<option value="${id}" ${id===courseId?'selected':''}>${item.stableId}</option>`).join('');
    stateSelect.innerHTML = course.states.map(item=>`<option value="${item}" ${item===state?'selected':''}>${item}</option>`).join('');
  }

  function render() {
    const course = COURSES[courseId];
    const state = normalizedState(course);
    requestedState = state;
    const meta = stateMeta[state] || stateMeta.intro;
    const phaseIndex = currentPhaseIndex(course,state);
    const total = course.total;
    const step = Math.min(total, meta.step);
    const percent = Math.round(((step - 1) / Math.max(1,total - 1)) * 100);

    document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
    document.querySelector('[data-language]').value = language;
    document.querySelector('[data-skip-link]').textContent = ui('skip');
    document.querySelector('[data-exit-label]').textContent = ui('exitLabel');
    document.querySelector('[data-exit-title]').textContent = ui('exitTitle');
    document.querySelector('[data-exit-body]').textContent = ui('exitBody');
    document.querySelector('[data-exit-cancel]').textContent = ui('exitCancel');
    document.querySelector('[data-exit-confirm]').textContent = ui('exitConfirm');
    document.querySelectorAll('[data-action="exit"]')[0].setAttribute('aria-label', ui('back'));
    document.querySelectorAll('[data-action="exit"]')[0].querySelector('span:last-child').textContent = ui('back');
    document.querySelectorAll('[data-action="exit"]')[1].setAttribute('aria-label', ui('exit'));
    document.querySelector('[data-stage]').textContent = local(course.stage);
    document.querySelector('[data-module]').textContent = local(course.module);
    document.querySelector('[data-lesson]').textContent = local(course.lesson);
    document.querySelector('[data-mobile-stage]').textContent = local(course.stage);
    document.querySelector('[data-mobile-lesson]').textContent = local(course.lesson);
    document.querySelector('[data-phase]').textContent = phaseLabel(meta.phase);
    document.querySelector('[data-step]').textContent = step;
    document.querySelector('[data-total]').textContent = total;
    const track = document.querySelector('[data-progress-track]');
    track.setAttribute('aria-valuenow', String(percent));
    document.querySelector('[data-progress-fill]').style.width = `${percent}%`;
    document.querySelector('[data-phase-list]').innerHTML = course.phases.map((phase,index)=>`<li class="${index < phaseIndex ? 'done' : index === phaseIndex ? 'current' : ''}" ${index === phaseIndex ? 'aria-current="step"' : ''}><i aria-hidden="true"></i><span>${phaseLabel(phase)}</span></li>`).join('');

    const surface = document.querySelector('[data-lesson-surface]');
    surface.innerHTML = courseId === 'lesson07' ? lesson07(state) : courseId === 'lesson11' ? lesson11(state) : courseId === 'lesson10' ? lesson10(state) : lesson06(state);
    surface.classList.remove('isEntering');
    requestAnimationFrame(() => surface.classList.add('isEntering'));
    renderActions(course,state);
    renderSwitcher(course,state);
    updateUrl();
  }

  function moveState(delta) {
    const states = COURSES[courseId].states;
    const index = Math.max(0,states.indexOf(requestedState));
    requestedState = states[Math.max(0,Math.min(states.length - 1,index + delta))];
    answerState = '';
    buildTokens = [];
    render();
    document.querySelector('#lessonContent').focus({preventScroll:true});
    scrollTo({top:0,behavior:'smooth'});
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (action === 'exit') {
      const dialog = document.querySelector('[data-exit-dialog]');
      if (!dialog.open) dialog.showModal();
    } else if (action === 'previous') moveState(-1);
    else if (action === 'next') moveState(1);
    else if (action === 'restart') { requestedState = COURSES[courseId].states[0]; answerState=''; buildTokens=[]; render(); }
    else if (action === 'choose') {
      answerState = button.dataset.correct === 'true' ? 'correct' : `wrong-${button.dataset.index}`;
      render();
      requestAnimationFrame(()=>document.querySelector('.feedbackPanel')?.focus?.());
    } else if (action === 'question-next') {
      if (!answerState) return;
      if (answerState === 'correct') moveState(1);
      else { requestedState = 'retry'; answerState=''; render(); }
    } else if (action === 'add-token') {
      if (!buildTokens.includes(button.dataset.token)) buildTokens.push(button.dataset.token);
      render();
    } else if (action === 'remove-token') {
      buildTokens.splice(Number(button.dataset.index),1);
      render();
    } else if (action === 'build-check') {
      if (!buildTokens.length) return;
      render();
    }
  });

  document.querySelector('[data-language]').addEventListener('change', event => { language = SUPPORTED.includes(event.target.value) ? event.target.value : 'en'; render(); });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-course-switcher]')) { courseId=event.target.value; requestedState=COURSES[courseId].states[0]; answerState=''; buildTokens=[]; render(); }
    if (event.target.matches('[data-state-switcher]')) { requestedState=event.target.value; answerState=''; buildTokens=[]; render(); }
  });
  addEventListener('popstate', event => {
    if (event.state?.courseId && COURSES[event.state.courseId]) courseId=event.state.courseId;
    if (event.state?.requestedState) requestedState=event.state.requestedState;
    render();
  });

  render();
})();
