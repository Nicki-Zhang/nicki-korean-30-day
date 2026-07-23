(function (global) {
  'use strict';

  const LESSON_ID = 'lesson-05';
  const STEP_CONTENT_TYPES = Object.freeze({
    intro: 'intro',
    block: 'structure',
    'left-concept': 'structure',
    'left-examples': 'word',
    'left-practice': 'choice',
    'top-concept': 'structure',
    'top-examples': 'word',
    'top-practice': 'choice',
    'ieung-concept': 'structure',
    'ieung-examples': 'word',
    builder: 'builder',
    split: 'matching',
    challenge: 'choice',
    retry: 'retry',
    summary: 'explanation',
    complete: 'completion'
  });
  const DIAGRAMS = Object.freeze({
    block: Object.freeze({ initial: 'ㄱ', vowel: 'ㅏ', syllable: '가', layout: 'left', current: '' }),
    'left-concept': Object.freeze({ initial: 'ㄱ', vowel: 'ㅏ', syllable: '가', layout: 'left', current: 'vowel' }),
    'top-concept': Object.freeze({ initial: 'ㄱ', vowel: 'ㅗ', syllable: '고', layout: 'top', current: 'vowel' }),
    'ieung-concept': Object.freeze({ initial: 'ㅇ', vowel: 'ㅏ', syllable: '아', layout: 'left', current: 'initial' })
  });
  const IN_PLACE_ACTIONS = new Set([
    'audio',
    'start-challenge',
    'practice-answer',
    'builder-pick',
    'build',
    'split-answer',
    'challenge-answer',
    'retry-answer',
    'retry-reset'
  ]);
  const STEP_CHANGE_ACTIONS = new Set(['back', 'next', 'next-question', 'previous-question', 'review']);
  const COPY = Object.freeze({
    zh: {
      navigation: '课程导航',
      language: '界面语言',
      home: '返回学习路径',
      skip: '跳到当前学习任务',
      initial: '初声',
      vowel: '元音',
      bottom: '底部区域',
      emptyBottom: '本课没有收音',
      correct: '答对了！',
      play: '播放',
      splitCorrect: '{syllable}由{answer}组成。',
      splitWrong: '再看音节中的位置。正确拆分是{answer}。'
    },
    en: {
      navigation: 'Course navigation',
      language: 'Interface language',
      home: 'Return to the learning path',
      skip: 'Skip to the current learning task',
      initial: 'Onset',
      vowel: 'Vowel',
      bottom: 'Bottom area',
      emptyBottom: 'No final consonant in this lesson',
      correct: 'Correct!',
      play: 'Play',
      splitCorrect: '{syllable} is composed of {answer}.',
      splitWrong: 'Check each position again. The correct split is {answer}.'
    },
    vi: {
      navigation: 'Điều hướng bài học',
      language: 'Ngôn ngữ giao diện',
      home: 'Quay lại lộ trình học',
      skip: 'Chuyển đến nhiệm vụ hiện tại',
      initial: 'Phụ âm đầu',
      vowel: 'Nguyên âm',
      bottom: 'Vùng phía dưới',
      emptyBottom: 'Bài này không có âm cuối',
      correct: 'Chính xác!',
      play: 'Phát',
      splitCorrect: '{syllable} được ghép từ {answer}.',
      splitWrong: 'Hãy xem lại từng vị trí. Cách tách đúng là {answer}.'
    },
    ja: {
      navigation: 'レッスンナビゲーション',
      language: '表示言語',
      home: '学習パスへ戻る',
      skip: '現在の学習タスクへ移動',
      initial: '初声',
      vowel: '母音',
      bottom: '下部領域',
      emptyBottom: 'この課では終声を扱いません',
      correct: '正解です！',
      play: '再生',
      splitCorrect: '{syllable}は{answer}で構成されています。',
      splitWrong: '各位置をもう一度確認しましょう。正しい分解は{answer}です。'
    }
  });

  const lesson = global.NikigoLesson05;
  if (!lesson || lesson.LESSON_ID !== LESSON_ID) {
    throw new Error('Lesson 5 Classic Focus adapter requires the formal Lesson 5 engine.');
  }
  if (lesson.SCREENS.length !== 16 || new Set(lesson.SCREENS).size !== 16) {
    throw new Error('Lesson 5 Classic Focus requires 16 unique formal step identities.');
  }
  for (const stepId of lesson.SCREENS) {
    if (!Object.hasOwn(STEP_CONTENT_TYPES, stepId)) {
      throw new Error(`Lesson 5 Classic Focus has no explicit renderer mapping for ${stepId}.`);
    }
  }

  const stage = document.getElementById('lessonStage');
  const languageSelect = document.getElementById('language');
  const shell = global.NikigoClassicFocusShell.mount();
  let activeStepId = currentStepId();
  let pendingInteraction = null;
  let observer;

  function currentLanguage() {
    return ['zh', 'en', 'vi', 'ja'].includes(languageSelect.value) ? languageSelect.value : 'en';
  }

  function currentStepId() {
    const session = lesson.getSession();
    return lesson.SCREENS[session.step];
  }

  function learningPathUrl() {
    return `nikigo-app.html?lang=${encodeURIComponent(currentLanguage())}&learnStage=K0&learnModule=k0-consonants-syllables-compound-vowels#courses`;
  }

  function syncLanguageUrl() {
    const url = new URL(global.location.href);
    url.searchParams.set('lang', currentLanguage());
    global.history.replaceState(global.history.state, '', `${url.pathname}${url.search}${url.hash}`);
  }

  function isNextEnabled() {
    const action = stage.querySelector(
      '[data-action="next"], [data-action="next-question"], [data-action="start-challenge"], [data-action="home"]'
    );
    return Boolean(action && !action.disabled);
  }

  function updateShell() {
    const session = lesson.getSession();
    const stepId = lesson.SCREENS[session.step];
    const language = currentLanguage();
    const copy = COPY[language] || COPY.en;
    const percent = Math.round(session.step / (lesson.SCREENS.length - 1) * 100);
    activeStepId = stepId;
    document.body.dataset.stepId = stepId;
    shell.update({
      lessonId: LESSON_ID,
      currentStep: session.step + 1,
      totalSteps: lesson.SCREENS.length,
      language,
      title: document.getElementById('lessonName').textContent,
      stepLabel: document.getElementById('progressLabel').textContent,
      progress: percent,
      canGoPrevious: session.step > 0,
      canGoNext: isNextEnabled(),
      audioAvailability: ['left-examples', 'top-examples', 'ieung-examples'].includes(stepId) ? 'approved' : 'none',
      contentType: STEP_CONTENT_TYPES[stepId],
      navigationLabel: copy.navigation,
      languageLabel: copy.language,
      brandActionLabel: copy.home,
      exitActionLabel: copy.home,
      skipLabel: copy.skip
    });
  }

  function diagramMarkup(config, copy) {
    const topClass = config.layout === 'top' ? ' isTop' : '';
    const initialClass = config.current === 'initial' ? ' isCurrent' : '';
    const vowelClass = config.current === 'vowel' ? ' isCurrent' : '';
    return `
      <div class="syllableDiagram${topClass}" role="group" aria-label="${config.initial} + ${config.vowel} = ${config.syllable}">
        <span class="syllableCell${initialClass}">
          <span aria-hidden="true">${config.initial}</span>
          <span class="srOnly">${copy.initial}</span>
        </span>
        <span class="syllableCell${vowelClass}">
          <span aria-hidden="true">${config.vowel}</span>
          <span class="srOnly">${copy.vowel}</span>
        </span>
        <span class="syllableBottom">${copy.bottom}: ${copy.emptyBottom}</span>
      </div>
      <div class="diagramEquation" aria-label="${config.initial} + ${config.vowel} = ${config.syllable}">
        <span>${config.initial} + ${config.vowel}</span>
        <strong lang="ko">${config.syllable}</strong>
      </div>
    `;
  }

  function enhanceDiagram(stepId) {
    const config = DIAGRAMS[stepId];
    if (!config) return;
    const target = stage.querySelector('.conceptVisual');
    if (!target) return;
    if (stepId === 'block') {
      const explanation = target.previousElementSibling;
      const rules = explanation?.querySelector('.ruleList');
      if (explanation && rules) explanation.insertBefore(target, rules);
    }
    const copy = COPY[currentLanguage()] || COPY.en;
    target.classList.add('classicFocusDiagram');
    target.innerHTML = diagramMarkup(config, copy);
  }

  function enhanceExamples() {
    for (const article of stage.querySelectorAll('.blockExample')) {
      const syllable = article.querySelector('.blockResult')?.textContent?.trim();
      article.classList.add('classicFocusExample');
      if (syllable) article.setAttribute('aria-label', syllable);
      const control = article.querySelector('.exampleAudio');
      if (control) {
        control.classList.add('audioButton');
        control.textContent = (COPY[currentLanguage()] || COPY.en).play;
      }
    }
    const note = stage.querySelector('.audioNote');
    if (note?.firstChild?.nodeType === Node.TEXT_NODE) note.firstChild.textContent = note.firstChild.textContent.replace(/^ⓘ\s*/, '');
  }

  function removeDecorativeSymbols() {
    if (activeStepId !== 'intro') return;
    for (const heading of stage.querySelectorAll('.goal b')) {
      const first = heading.firstChild;
      if (first?.nodeType === Node.TEXT_NODE) first.textContent = first.textContent.replace(/^[^\p{L}\p{N}]+/u, '');
    }
    const note = stage.querySelector('.note');
    if (note?.firstChild?.nodeType === Node.TEXT_NODE) note.firstChild.textContent = note.firstChild.textContent.replace(/^ⓘ\s*/, '');
  }

  function enhanceSplit() {
    const session = lesson.getSession();
    const copy = COPY[currentLanguage()] || COPY.en;
    for (const item of stage.querySelectorAll('.splitQuestion')) {
      const prompt = item.querySelector('.splitSyllable');
      const questionId = item.querySelector('[data-question]')?.dataset.question;
      if (prompt && questionId) {
        prompt.id = `split-prompt-${questionId}`;
        item.setAttribute('role', 'group');
        item.setAttribute('aria-labelledby', prompt.id);
      }
      const answer = questionId ? session.splitAnswers[questionId] : null;
      const question = questionId ? lesson.SPLIT_QUESTIONS.find(candidate => candidate.id === questionId) : null;
      for (const option of item.querySelectorAll('[data-action="split-answer"]')) {
        option.setAttribute('aria-pressed', String(Boolean(answer && option.dataset.value === answer.choice)));
      }
      if (!answer || !question) continue;
      const feedback = document.createElement('div');
      feedback.className = `classicFocusFeedback ${answer.correct ? 'isCorrect' : 'isWrong'}`;
      feedback.tabIndex = -1;
      feedback.setAttribute('role', answer.correct ? 'status' : 'alert');
      const heading = document.createElement('strong');
      heading.textContent = answer.correct ? copy.correct : copy.splitWrong
        .replace('{syllable}', question.syllable)
        .replace('{answer}', question.correct);
      const detail = document.createElement('span');
      detail.textContent = copy.splitCorrect
        .replace('{syllable}', question.syllable)
        .replace('{answer}', question.correct);
      feedback.append(heading);
      if (answer.correct) feedback.append(detail);
      item.append(feedback);
    }
  }

  function decorate() {
    updateShell();
    stage.dataset.contentType = STEP_CONTENT_TYPES[activeStepId];
    for (const actions of stage.querySelectorAll('.foot, .repeatActions')) actions.classList.add('classicFocusActions');
    for (const feedback of stage.querySelectorAll('.feedback')) {
      feedback.classList.add('classicFocusFeedback');
      feedback.setAttribute('role', feedback.classList.contains('try') ? 'alert' : 'status');
      feedback.setAttribute('tabindex', '-1');
    }
    for (const control of stage.querySelectorAll('.challengeOption, .builderChoice')) {
      if (control.matches('[aria-pressed]')) continue;
      control.setAttribute('aria-pressed', String(control.classList.contains('on')));
    }
    enhanceDiagram(activeStepId);
    enhanceExamples();
    enhanceSplit();
    removeDecorativeSymbols();
  }

  function reconnectObserver() {
    observer.observe(stage, { childList: true });
  }

  function afterFormalRender() {
    observer.disconnect();
    const previous = pendingInteraction;
    const nextStepId = currentStepId();
    decorate();
    reconnectObserver();

    global.requestAnimationFrame(() => {
      if (!previous) return;
      const retryQuestion = stage.querySelector('[data-action="retry-answer"]')?.dataset.question || '';
      const retryAdvanced = previous.action === 'retry-answer' && retryQuestion !== previous.questionId;
      if (nextStepId !== previous.stepId || STEP_CHANGE_ACTIONS.has(previous.action) || retryAdvanced) {
        stage.focus({ preventScroll: true });
      } else {
        global.scrollTo({ top: previous.scrollY, behavior: 'auto' });
        const feedback = stage.querySelector('.classicFocusFeedback');
        const selected = previous.value
          ? stage.querySelector(`[data-value="${CSS.escape(previous.value)}"]:not([disabled])`)
          : null;
        (feedback || selected || stage.querySelector('button:not([disabled])') || stage).focus({ preventScroll: true });
      }
      pendingInteraction = null;
    });
  }

  observer = new MutationObserver(afterFormalRender);
  decorate();
  reconnectObserver();

  document.addEventListener('click', event => {
    const button = event.target.closest('button');
    if (!button) return;
    const action = button.dataset.action;
    if (button.id === 'homeLogo' || button.id === 'homeButton' || action === 'home') return;
    if (!IN_PLACE_ACTIONS.has(action) && !STEP_CHANGE_ACTIONS.has(action)) return;
    pendingInteraction = {
      action,
      stepId: activeStepId,
      scrollY: global.scrollY,
      value: button.dataset.value || '',
      questionId: button.dataset.question || ''
    };
  }, true);

  for (const id of ['homeLogo', 'homeButton']) {
    document.getElementById(id)?.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      global.location.href = learningPathUrl();
    }, true);
  }

  languageSelect.addEventListener('change', () => {
    syncLanguageUrl();
    pendingInteraction = {
      action: 'language',
      stepId: activeStepId,
      scrollY: global.scrollY,
      value: ''
    };
  });

  global.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.getElementById('homeButton')?.focus({ preventScroll: true });
  });

  global.NikigoLesson05ClassicFocusAdapter = Object.freeze({
    lessonId: LESSON_ID,
    stepContentTypes: STEP_CONTENT_TYPES,
    diagrams: DIAGRAMS
  });
})(window);
