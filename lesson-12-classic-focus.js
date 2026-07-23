(function (global) {
  'use strict';

  const LESSON_ID = 'lesson-12';
  const STEP_CONTENT_TYPES = Object.freeze({
    intro: 'intro',
    'origin-scene': 'dialogue',
    'origin-response': 'dialogue',
    'phrase-role': 'matching',
    'origin-pattern': 'explanation',
    'build-origin': 'builder',
    'country-person': 'choice',
    'country-language': 'matching',
    'study-pattern': 'explanation',
    'build-study': 'builder',
    'scene-reply': 'dialogue',
    'final-scene': 'choice',
    complete: 'completion'
  });
  const STEP_TYPES = Object.freeze({
    intro: 'intro',
    'origin-scene': 'concept',
    'origin-response': 'scenario',
    'phrase-role': 'match',
    'origin-pattern': 'concept',
    'build-origin': 'build',
    'country-person': 'choice',
    'country-language': 'match',
    'study-pattern': 'concept',
    'build-study': 'build',
    'scene-reply': 'scenario',
    'final-scene': 'scenario',
    complete: 'complete'
  });
  const COPY = Object.freeze({
    zh: {
      navigation:'课程导航',
      language:'界面语言',
      home:'返回学习路径',
      skip:'跳到当前学习任务',
      audioMissing:'标准音频准备中'
    },
    en: {
      navigation:'Course navigation',
      language:'Interface language',
      home:'Return to the learning path',
      skip:'Skip to the current learning task',
      audioMissing:'Standard audio is being prepared'
    },
    vi: {
      navigation:'Điều hướng bài học',
      language:'Ngôn ngữ giao diện',
      home:'Quay lại lộ trình học',
      skip:'Chuyển đến nhiệm vụ hiện tại',
      audioMissing:'Âm thanh chuẩn đang được chuẩn bị'
    },
    ja: {
      navigation:'レッスンナビゲーション',
      language:'表示言語',
      home:'学習パスへ戻る',
      skip:'現在の学習タスクへ移動',
      audioMissing:'標準音声を準備中です'
    }
  });

  const config = global.NikigoLessonConfig;
  if (!config || config.id !== LESSON_ID) throw new Error('Lesson 12 Classic Focus adapter requires the explicit Lesson 12 configuration.');
  for (const step of config.steps) {
    if (!Object.hasOwn(STEP_CONTENT_TYPES, step.id)) throw new Error(`Lesson 12 Classic Focus has no explicit renderer mapping for ${step.id}.`);
    if (STEP_TYPES[step.id] !== step.type) throw new Error(`Lesson 12 step type changed for ${step.id}.`);
  }

  const shell = global.NikigoClassicFocusShell.mount();
  const stage = document.getElementById('lessonStage');
  const IN_PLACE_ACTIONS = new Set(['answer', 'match-left', 'match-right', 'part', 'confirm-build']);
  let activeStepId = config.steps[0].id;
  let activeLanguage = 'en';
  const afterInteraction = callback => global.setTimeout(callback, 0);

  function learningPathUrl() {
    return `nikigo-app.html?lang=${encodeURIComponent(activeLanguage)}&learnStage=K1&learnModule=k1-identity-and-language-background#courses`;
  }

  function update(viewModel) {
    if (viewModel.lessonId !== LESSON_ID) throw new Error('Lesson 12 adapter received another lesson identity.');
    const contentType = STEP_CONTENT_TYPES[viewModel.stepId];
    if (!contentType || STEP_TYPES[viewModel.stepId] !== viewModel.stepType) throw new Error(`Unsupported Lesson 12 step mapping: ${viewModel.stepId}`);
    const copy = COPY[viewModel.language] || COPY.en;
    activeStepId = viewModel.stepId;
    activeLanguage = viewModel.language;
    document.body.dataset.stepId = activeStepId;
    document.body.dataset.audioReadiness = activeStepId === 'origin-scene' ? 'missing' : 'none';
    shell.update({
      lessonId: viewModel.lessonId,
      currentStep: viewModel.currentStep,
      totalSteps: viewModel.totalSteps,
      language: viewModel.language,
      title: viewModel.title,
      stepLabel: viewModel.stepLabel,
      progress: viewModel.progress,
      canGoPrevious: viewModel.canGoPrevious,
      canGoNext: viewModel.canGoNext,
      audioAvailability: 'none',
      contentType,
      navigationLabel: copy.navigation,
      languageLabel: copy.language,
      brandActionLabel: copy.home,
      exitActionLabel: copy.home,
      skipLabel: copy.skip
    });
  }

  for (const id of ['homeLogo', 'homeButton']) {
    document.getElementById(id)?.addEventListener('click', event => {
      event.preventDefault();
      event.stopImmediatePropagation();
      global.location.href = learningPathUrl();
    }, true);
  }

  function replaceMissingAudioControl() {
    if (activeStepId !== 'origin-scene') return;
    const copy = COPY[activeLanguage] || COPY.en;
    for (const control of stage.querySelectorAll('.audioButton[aria-disabled="true"]')) {
      const status = document.createElement('p');
      status.className = 'classicFocusAudioStatus';
      status.setAttribute('role', 'status');
      status.setAttribute('data-audio-readiness', 'missing');
      status.textContent = copy.audioMissing;
      control.replaceWith(status);
    }
  }

  function afterRender() {
    replaceMissingAudioControl();
    for (const element of stage.querySelectorAll('.foot')) element.classList.add('classicFocusActions');
    for (const element of stage.querySelectorAll('[data-action="confirm-build"].audioButton')) element.classList.remove('audioButton');
    for (const element of stage.querySelectorAll('.feedback')) {
      element.classList.add('classicFocusFeedback');
      element.setAttribute('role', element.classList.contains('try') ? 'alert' : 'status');
      element.setAttribute('tabindex', '-1');
    }
    for (const element of stage.querySelectorAll('.retryBanner')) element.classList.add('classicFocusStatus');
    for (const element of stage.querySelectorAll('.matchButton, .partButton')) {
      element.setAttribute('aria-pressed', String(element.classList.contains('selected')));
    }
  }

  stage.addEventListener('click', event => {
    const button = event.target.closest('button');
    const action = button?.dataset.action;
    if (IN_PLACE_ACTIONS.has(action)) {
      const previousStepId = activeStepId;
      const value = button.dataset.value;
      afterInteraction(() => {
        if (activeStepId !== previousStepId) return;
        const feedback = stage.querySelector('.feedback');
        const replacement = value
          ? stage.querySelector(`[data-action="${action}"][data-value="${CSS.escape(value)}"]:not([disabled])`)
          : null;
        (feedback || replacement || stage.querySelector('button:not([disabled])') || stage).focus({ preventScroll:true });
      });
      return;
    }
    if (!['next', 'back', 'review'].includes(action)) return;
    const previousStepId = activeStepId;
    afterInteraction(() => {
      if (activeStepId === previousStepId) return;
      global.scrollTo(0, 0);
      stage.focus({ preventScroll:true });
    });
  }, true);

  global.addEventListener('keydown', event => {
    if (event.key === 'Escape') document.getElementById('homeButton')?.focus({ preventScroll:true });
  });

  global.NikigoSprintClassicFocusAdapter = Object.freeze({
    lessonId: LESSON_ID,
    stepContentTypes: STEP_CONTENT_TYPES,
    stepTypes: STEP_TYPES,
    update,
    afterRender
  });
})(window);
