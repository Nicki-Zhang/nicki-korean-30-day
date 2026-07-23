(function (global) {
  'use strict';

  const REQUIRED_FIELDS = Object.freeze([
    'lessonId',
    'currentStep',
    'totalSteps',
    'language',
    'title',
    'stepLabel',
    'progress',
    'canGoPrevious',
    'canGoNext',
    'audioAvailability',
    'contentType'
  ]);
  const CONTENT_TYPES = Object.freeze([
    'intro',
    'explanation',
    'structure',
    'word',
    'comparison',
    'dialogue',
    'choice',
    'matching',
    'builder',
    'feedback',
    'retry',
    'completion'
  ]);
  const AUDIO_STATES = Object.freeze(['approved', 'mixed', 'pending', 'none']);

  function assertViewModel(viewModel) {
    if (!viewModel || typeof viewModel !== 'object') throw new TypeError('Classic Focus view model is required.');
    for (const field of REQUIRED_FIELDS) {
      if (!(field in viewModel)) throw new TypeError(`Classic Focus view model missing ${field}.`);
    }
    if (!Number.isInteger(viewModel.currentStep) || viewModel.currentStep < 1) throw new TypeError('currentStep must be a positive integer.');
    if (!Number.isInteger(viewModel.totalSteps) || viewModel.totalSteps < viewModel.currentStep) throw new TypeError('totalSteps must include currentStep.');
    if (!Number.isFinite(viewModel.progress) || viewModel.progress < 0 || viewModel.progress > 100) throw new TypeError('progress must be between 0 and 100.');
    if (!CONTENT_TYPES.includes(viewModel.contentType)) throw new TypeError(`Unsupported contentType: ${viewModel.contentType}`);
    if (!AUDIO_STATES.includes(viewModel.audioAvailability)) throw new TypeError(`Unsupported audioAvailability: ${viewModel.audioAvailability}`);
  }

  function mount(options = {}) {
    const root = options.root || document;
    const elements = {
      language: root.querySelector('#language'),
      lessonName: root.querySelector('#lessonName'),
      progressLabel: root.querySelector('#progressLabel'),
      progressCount: root.querySelector('#progressCount'),
      progressTrack: root.querySelector('#progressTrack'),
      progressBar: root.querySelector('#progressBar') || root.querySelector('#progressTrack i'),
      navigation: root.querySelector('#courseNavigation'),
      languageLabel: root.querySelector('#languageLabel'),
      brandAction: root.querySelector('#homeLogo'),
      exitAction: root.querySelector('#homeButton'),
      skipLink: root.querySelector('#skipLink'),
      stage: root.querySelector('#lessonStage')
    };
    const cleanup = [];

    if (elements.language && typeof options.onLanguageChange === 'function') {
      const listener = event => options.onLanguageChange(event.target.value, event);
      elements.language.addEventListener('change', listener);
      cleanup.push(() => elements.language.removeEventListener('change', listener));
    }
    if (elements.brandAction && typeof options.onBrandAction === 'function') {
      elements.brandAction.addEventListener('click', options.onBrandAction);
      cleanup.push(() => elements.brandAction.removeEventListener('click', options.onBrandAction));
    }
    if (elements.exitAction && typeof options.onExitAction === 'function') {
      elements.exitAction.addEventListener('click', options.onExitAction);
      cleanup.push(() => elements.exitAction.removeEventListener('click', options.onExitAction));
    }

    function update(viewModel) {
      assertViewModel(viewModel);
      document.documentElement.lang = viewModel.language === 'zh' ? 'zh-CN' : viewModel.language;
      document.body.dataset.lessonId = viewModel.lessonId;
      document.body.dataset.contentType = viewModel.contentType;
      document.body.dataset.audioAvailability = viewModel.audioAvailability;
      if (elements.language) elements.language.value = viewModel.language;
      if (elements.lessonName) elements.lessonName.textContent = viewModel.title;
      if (elements.progressLabel) elements.progressLabel.textContent = viewModel.stepLabel;
      if (elements.progressCount) elements.progressCount.textContent = `${viewModel.currentStep} / ${viewModel.totalSteps}`;
      if (elements.progressTrack) {
        elements.progressTrack.setAttribute('aria-valuenow', String(Math.round(viewModel.progress)));
        elements.progressTrack.setAttribute('aria-valuetext', `${viewModel.currentStep} / ${viewModel.totalSteps}`);
      }
      if (elements.progressBar) elements.progressBar.style.width = `${viewModel.progress}%`;
      if (elements.navigation && viewModel.navigationLabel) elements.navigation.setAttribute('aria-label', viewModel.navigationLabel);
      if (elements.languageLabel && viewModel.languageLabel) elements.languageLabel.textContent = viewModel.languageLabel;
      if (elements.brandAction && viewModel.brandActionLabel) {
        elements.brandAction.setAttribute('aria-label', viewModel.brandActionLabel);
        elements.brandAction.title = viewModel.brandActionLabel;
      }
      if (elements.exitAction && viewModel.exitActionLabel) {
        elements.exitAction.setAttribute('aria-label', viewModel.exitActionLabel);
        elements.exitAction.title = viewModel.exitActionLabel;
      }
      if (elements.skipLink && viewModel.skipLabel) elements.skipLink.textContent = viewModel.skipLabel;
      if (elements.stage) {
        elements.stage.dataset.canGoPrevious = String(Boolean(viewModel.canGoPrevious));
        elements.stage.dataset.canGoNext = String(Boolean(viewModel.canGoNext));
      }
    }

    return Object.freeze({
      update,
      destroy() {
        for (const release of cleanup.splice(0)) release();
      }
    });
  }

  global.NikigoClassicFocusShell = Object.freeze({
    mount,
    assertViewModel,
    requiredFields: REQUIRED_FIELDS,
    contentTypes: CONTENT_TYPES,
    audioStates: AUDIO_STATES
  });
})(window);
