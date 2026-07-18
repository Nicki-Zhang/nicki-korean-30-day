(function (global) {
  'use strict';

  const SUPPORTED = ['zh', 'en', 'vi', 'ja'];
  const FEMALE_KOREAN_VOICE = /Yuna|SunHi|Heami|Sora|Jimin|Seoyeon|Kyuri|Female|여성|한국.*여/i;

  function mount(config) {
    if (!config || !config.id || !config.copy) throw new Error('Nikigo lesson config is incomplete.');

    const profile = global.NikigoState
      ? global.NikigoState.get()
      : JSON.parse(global.localStorage.getItem('nikigoProfile') || '{}');
    const screens = [
      { type: 'intro' },
      { type: 'vowels' },
      { type: 'consonants' },
      ...(config.words?.length ? [{ type: 'words' }] : []),
      ...(config.phrase ? [{ type: 'phrase' }] : []),
      { type: 'builder' },
      ...config.practice.map((_, question) => ({ type: 'practice', question })),
      { type: 'repeat' },
      { type: 'challenge' },
      ...config.quiz.map((_, question) => ({ type: 'quiz', question })),
      { type: 'complete' }
    ];
    const heard = { vowels: new Set(), consonants: new Set(), words: new Set() };
    const built = new Set();
    const practiceAnswers = {};
    const quizAnswers = {};
    const autoplayedScreens = new Set();
    let phraseHeard = false;
    let language = initialLanguage();
    let index = 0;
    let selfCheck = null;
    let finished = false;
    let earnedXp = false;
    let builderConsonant = config.builder.initialConsonant || config.builder.consonants[0];
    let builderVowel = config.builder.initialVowel || config.builder.vowels[0];
    let builderFinal = config.builder.finals ? (config.builder.initialFinal ?? config.builder.finals[0]) : '';
    let koreanVoices = [];
    let currentAudio = null;
    let currentUtterance = null;
    let audioUnlocked = false;

    const element = selector => document.querySelector(selector);
    const copy = key => config.copy[language]?.[key] || config.copy.en?.[key] || key;

    function normalizeLanguage(value) {
      const normalized = String(value || '').toLowerCase();
      if (normalized.startsWith('zh')) return 'zh';
      if (normalized.startsWith('vi')) return 'vi';
      if (normalized.startsWith('ja')) return 'ja';
      return 'en';
    }

    function initialLanguage() {
      const query = new URLSearchParams(global.location.search).get('lang');
      if (SUPPORTED.includes(query)) return query;
      if (SUPPORTED.includes(profile.interfaceLanguage)) return profile.interfaceLanguage;
      return normalizeLanguage(global.navigator.languages?.[0] || global.navigator.language);
    }

    function saveProfile() {
      profile.interfaceLanguage = language;
      profile.learningLanguage = language;
      if (global.NikigoState) global.NikigoState.save(profile, config.id);
      else global.localStorage.setItem('nikigoProfile', JSON.stringify(profile));
    }

    function addReview(id, dueNow) {
      if (global.NikigoState?.addReview) {
        global.NikigoState.addReview(id, { lessonId: config.id, dueNow: dueNow === true, source: config.id });
        return;
      }
      const reviews = new Set(profile.reviewItems || []);
      reviews.add(id);
      profile.reviewItems = [...reviews];
      saveProfile();
    }

    function configuredAudioRate() {
      return Math.min(1.2, Math.max(0.8, Number(profile.audioRate) || 1));
    }

    function refreshVoices() {
      if (!('speechSynthesis' in global)) return;
      koreanVoices = global.speechSynthesis.getVoices().filter(voice => /^ko(?:-|_|$)/i.test(voice.lang || ''));
    }

    function preferredKoreanVoice() {
      return koreanVoices.find(voice => FEMALE_KOREAN_VOICE.test(voice.name || ''))
        || koreanVoices.find(voice => voice.localService)
        || koreanVoices[0]
        || null;
    }

    function unlockAudio() {
      if (audioUnlocked) return;
      audioUnlocked = true;
      if ('speechSynthesis' in global) {
        refreshVoices();
        global.speechSynthesis.resume();
      }
      const AudioContextClass = global.AudioContext || global.webkitAudioContext;
      if (!AudioContextClass) return;
      try {
        const context = new AudioContextClass();
        if (context.state === 'suspended') context.resume();
        const source = context.createBufferSource();
        source.buffer = context.createBuffer(1, 1, 22050);
        source.connect(context.destination);
        source.start(0);
      } catch (error) {
        // Static audio and SpeechSynthesis can still work without AudioContext.
      }
    }

    function systemSpeech(value) {
      if (!('speechSynthesis' in global) || typeof global.SpeechSynthesisUtterance === 'undefined') {
        toast(copy('audioUnavailable'));
        return;
      }
      const synth = global.speechSynthesis;
      if (synth.paused) synth.resume();
      if (synth.speaking || synth.pending) synth.cancel();
      currentUtterance = new global.SpeechSynthesisUtterance(config.pronunciationText?.[value] || value);
      currentUtterance.lang = 'ko-KR';
      currentUtterance.rate = Math.min(1.1, Math.max(0.62, 0.78 * configuredAudioRate()));
      currentUtterance.pitch = 1;
      const voice = preferredKoreanVoice();
      if (voice) currentUtterance.voice = voice;
      currentUtterance.onerror = event => {
        if (!['canceled', 'interrupted'].includes(event.error)) toast(copy('audioError'));
      };
      synth.speak(currentUtterance);
    }

    function speak(value) {
      unlockAudio();
      const file = config.audioFiles?.[value];
      if (!file) {
        systemSpeech(value);
        return;
      }
      if (currentAudio) currentAudio.pause();
      currentAudio = new Audio(file);
      currentAudio.preload = 'auto';
      currentAudio.playbackRate = configuredAudioRate();
      currentAudio.preservesPitch = true;
      currentAudio.mozPreservesPitch = true;
      currentAudio.webkitPreservesPitch = true;
      currentAudio.play().catch(() => systemSpeech(value));
    }

    function progress() {
      return Math.round(index / (screens.length - 1) * 100);
    }

    function shell(body) {
      return `${body}<p class="aiDisclosure">ⓘ ${copy('aiVoice')}</p><div class="foot"><button class="ghost" data-action="previous">← ${copy('back')}</button><button class="primary" id="nextButton" data-action="next">${copy(index === screens.length - 2 ? 'finish' : 'continue')} →</button></div>`;
    }

    function renderIntro() {
      const icons = config.goalIcons || ['👂', '🔤', '🧩'];
      return shell(`<span class="eyebrow">${copy('introTag')}</span><h1>${copy('introTitle')}</h1><p class="lead">${copy('introLead')}</p><div class="goals">${[1, 2, 3].map((goal, offset) => `<div class="goal"><b>${icons[offset]} ${copy(`goal${goal}`)}</b><span>${copy(`goal${goal}d`)}</span></div>`).join('')}</div><div class="note">💡 ${copy('tip')}</div>`);
    }

    function renderSoundSet(type, items, titleKey, leadKey, promptKey) {
      const seen = heard[type];
      return shell(`<span class="eyebrow">${copy(type === 'vowels' ? 'vowelTag' : 'conTag')}</span><h1>${copy(titleKey)}</h1><p class="lead">${copy(leadKey)}</p><div class="learnGrid ${type === 'consonants' ? 'consonants' : ''}" style="--sound-count:${items.length}">${items.map((item, itemIndex) => `<button class="soundCard ${seen.has(itemIndex) ? 'done' : ''}" data-action="hear" data-kind="${type}" data-index="${itemIndex}"><span class="play">▶</span><span class="jamo">${item[0]}</span><span class="roman">${item[1]} · ${item[2]}</span><p>${copy(item[3])}</p></button>`).join('')}</div>${seen.size < items.length ? `<div class="note">🎧 ${copy(promptKey)} · ${seen.size}/${items.length}</div>` : ''}`);
    }

    function renderWords() {
      return shell(`<span class="eyebrow">${copy('wordsTag')}</span><h1>${copy('wordsTitle')}</h1><p class="lead">${copy('wordsLead')}</p><div class="wordGrid">${config.words.map((word, wordIndex) => `<button class="wordCard ${heard.words.has(wordIndex) ? 'done' : ''}" data-action="hear" data-kind="words" data-index="${wordIndex}"><span class="wordIcon">${word[4]} · ▶</span><strong>${word[0]}</strong><span>${word[1]}</span><p>${copy(word[3])}</p></button>`).join('')}</div>${heard.words.size < config.words.length ? `<div class="note">🎧 ${copy('tapWords')} · ${heard.words.size}/${config.words.length}</div>` : ''}`);
    }

    function renderPhrase() {
      return shell(`<span class="eyebrow">${copy('phraseTag')}</span><h1>${copy('phraseTitle')}</h1><p class="lead">${copy('phraseLead')}</p><button class="phraseBox ${phraseHeard ? 'done' : ''}" data-action="phrase"><span class="phrasePlay">▶</span><strong>${config.phrase.korean}</strong><span>${config.phrase.romanization}</span><p>${copy(config.phrase.translationKey)}</p></button><div class="note">💬 ${copy('phraseNote')}</div>`);
    }

    function renderBuilder() {
      const result = config.syllables[builderConsonant + builderVowel + builderFinal];
      const finalsGroup = config.builder.finals ? `<b class="operator">+</b><div class="pickGroup"><label>${copy('final')}</label><div class="picks">${config.builder.finals.map(value => `<button class="pick ${builderFinal === value ? 'on' : ''}" data-action="builder-pick" data-kind="final" data-value="${value}">${value || '–'}</button>`).join('')}</div></div>` : '';
      return shell(`<span class="eyebrow">${copy('builderTag')}</span><h1>${copy('builderTitle')}</h1><p class="lead">${copy('builderLead')}</p><div class="builder ${config.builder.finals ? 'withFinal' : ''}"><div class="pickGroup"><label>${copy('consonant')}</label><div class="picks">${config.builder.consonants.map(value => `<button class="pick ${builderConsonant === value ? 'on' : ''}" data-action="builder-pick" data-kind="consonant" data-value="${value}">${value}</button>`).join('')}</div></div><b class="operator">+</b><div class="pickGroup"><label>${copy('vowel')}</label><div class="picks">${config.builder.vowels.map(value => `<button class="pick ${builderVowel === value ? 'on' : ''}" data-action="builder-pick" data-kind="vowel" data-value="${value}">${value}</button>`).join('')}</div></div>${finalsGroup}<b class="operator">=</b><button class="buildResult" data-action="build"><span><small>${copy('yourSyllable')} · ▶</small><strong>${result}</strong></span></button></div><div class="builtList"><b>${copy('built')}:</b>${[...built].map(value => `<span>${value}</span>`).join('')}</div>${config.builder.required.every(value => built.has(value)) ? '' : `<div class="note">🧩 ${copy('buildMore')}</div>`}`);
    }

    function renderQuestion(question, isQuiz, questionIndex) {
      const answers = isQuiz ? quizAnswers : practiceAnswers;
      const answer = answers[questionIndex];
      const total = isQuiz ? config.quiz.length : config.practice.length;
      const feedback = answer ? `<div class="feedback ${answer.correct ? 'good' : 'try'}">${answer.correct ? copy('correct') : copy('incorrect').replace('{answer}', question.options[question.answer])}</div>` : '';
      return shell(`<span class="eyebrow">${isQuiz ? copy('question') : copy('practiceTag')} · ${questionIndex + 1} / ${total}</span><h2 class="question">${copy(question.prompt)}</h2>${question.audio ? `<button class="audioBtn" data-action="speak" data-value="${question.audio}"><i>▶</i><span><b>${copy('listen')}</b><small>0:02 · ${copy('aiVoice')}</small></span></button>` : ''}<div class="options">${question.options.map((option, optionIndex) => { let state = ''; if (answer) { if (optionIndex === question.answer) state = 'correct'; else if (optionIndex === answer.choice) state = 'wrong'; } return `<button class="option ${state}" data-action="answer" data-quiz="${isQuiz}" data-question="${questionIndex}" data-choice="${optionIndex}" ${answer ? 'disabled' : ''}><span>${String.fromCharCode(65 + optionIndex)}</span>${option}</button>`; }).join('')}</div>${feedback}`);
    }

    function renderRepeat() {
      return shell(`<span class="eyebrow">${copy('repeatTag')}</span><h1>${copy('repeatTitle')}</h1><p class="lead">${copy('repeatLead')}</p><div class="repeatBox"><small>${copy('listenPhrase')}</small><div class="repeatText">${config.repeat.display}</div><div class="repeatActions"><button class="primary" data-action="speak" data-value="${config.repeat.audio}">▶ ${copy('again')}</button></div><div class="selfCheck"><button class="${selfCheck === 'practice' ? 'on' : ''}" data-action="self-check" data-value="practice">↻ ${copy('needPractice')}</button><button class="${selfCheck === 'good' ? 'on' : ''}" data-action="self-check" data-value="good">✓ ${copy('soundsGood')}</button></div></div>${selfCheck ? '' : `<div class="note">${copy('chooseCheck')}</div>`}`);
    }

    function renderChallenge() {
      return `<div class="challengeHero"><div class="challengeIcon">◆</div><span class="eyebrow challengeLabel">${copy('challengeTag')}</span><h1>${copy('challengeTitle')}</h1><p class="lead centered">${copy('challengeLead')}</p></div><div class="foot"><button class="ghost" data-action="previous">← ${copy('back')}</button><button class="primary" data-action="next">${copy('startChallenge')} →</button></div>`;
    }

    function finishLesson() {
      if (finished) return;
      finished = true;
      const score = Object.values(quizAnswers).filter(answer => answer.correct).length;
      const completed = new Set(profile.completedLessons || []);
      const firstCompletion = !completed.has(config.id);
      completed.add(config.id);
      profile.completedLessons = [...completed];
      profile[`${config.id.replace('-', '')}Score`] = score;
      profile.lessonProgress = { ...(profile.lessonProgress || {}), [config.id]: 100 };
      profile.weeklyProgress = Math.max(Number(profile.weeklyProgress) || 0, config.order || 1);
      profile.streak = Math.max(Number(profile.streak) || 0, 1);
      const baseReviewIds = config.baseReviewIds || [];
      const missedReviewIds = Object.entries(quizAnswers)
        .filter(([, answer]) => !answer.correct)
        .map(([question]) => `${config.reviewPrefix || config.id.replace('-', '')}:quiz:${question}`);
      earnedXp = firstCompletion;
      if (firstCompletion) {
        profile.xp = (Number(profile.xp) || 0) + (config.xp || 50);
        profile[`${config.id.replace('-', '')}RewardClaimed`] = true;
      }
      if (config.abilityMinimums) {
        const ability = Array.isArray(profile.ability) ? profile.ability : [22, 8, 10, 6, 5, 8];
        profile.ability = ability.map((value, abilityIndex) => Math.max(Number(value) || 0, config.abilityMinimums[abilityIndex] || 0));
      }
      saveProfile();
      baseReviewIds.forEach(review => addReview(review, false));
      missedReviewIds.forEach(review => addReview(review, true));
    }

    function renderComplete() {
      finishLesson();
      const score = Object.values(quizAnswers).filter(answer => answer.correct).length;
      const perfect = score === config.quiz.length;
      return `<div class="complete"><span class="eyebrow">${copy('completeTag')}</span><h1>${copy('completeTitle')}</h1><p class="lead centered">${copy('completeLead')}</p><div class="scoreRing" style="--score:${score / config.quiz.length * 100}%"><div><span><strong>${score}/${config.quiz.length}</strong><small>${copy('score')}</small></span></div></div><div class="rewards"><span class="reward">✦ ${earnedXp ? copy('xp') : '+0 XP'}</span><span class="reward">↻ ${copy('reviewAdded')}</span></div><div class="reviewBox"><b>${copy('reviewTitle')}</b><br>${copy(perfect ? 'reviewPerfect' : 'reviewNeeds')}</div><div class="repeatActions"><button class="secondary" data-action="restart">↻ ${copy('replay')}</button><button class="primary" data-action="exit">${copy('returnHome')} →</button></div></div>`;
    }

    function currentScreenAllowed(screen) {
      if (screen.type === 'vowels') return heard.vowels.size === config.vowels.length;
      if (screen.type === 'consonants') return heard.consonants.size === config.consonants.length;
      if (screen.type === 'words') return heard.words.size === config.words.length;
      if (screen.type === 'phrase') return phraseHeard;
      if (screen.type === 'builder') return config.builder.required.every(value => built.has(value));
      if (screen.type === 'practice') return Boolean(practiceAnswers[screen.question]);
      if (screen.type === 'repeat') return Boolean(selfCheck);
      if (screen.type === 'quiz') return Boolean(quizAnswers[screen.question]);
      return true;
    }

    function maybeAutoplay(screen) {
      if (profile.autoplayAudio !== true || autoplayedScreens.has(index)) return;
      let value = null;
      if (screen.type === 'practice') value = config.practice[screen.question].audio;
      if (screen.type === 'quiz') value = config.quiz[screen.question].audio;
      if (screen.type === 'repeat') value = config.repeat.audio;
      if (screen.type === 'phrase') value = config.phrase.audio;
      if (!value) return;
      autoplayedScreens.add(index);
      global.setTimeout(() => speak(value), 250);
    }

    function render() {
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
      element('#language').value = language;
      element('#lessonName').textContent = copy('lessonName');
      element('#progressLabel').textContent = copy('progress');
      element('#progressCount').textContent = `${index + 1} / ${screens.length}`;
      element('#progressBar').style.width = `${progress()}%`;
      const screen = screens[index];
      let html = '';
      if (screen.type === 'intro') html = renderIntro();
      if (screen.type === 'vowels') html = renderSoundSet('vowels', config.vowels, 'vowelTitle', 'vowelLead', config.vowelPromptKey || 'tapAll');
      if (screen.type === 'consonants') html = renderSoundSet('consonants', config.consonants, 'conTitle', 'conLead', config.consonantPromptKey || 'tapConsonants');
      if (screen.type === 'words') html = renderWords();
      if (screen.type === 'phrase') html = renderPhrase();
      if (screen.type === 'builder') html = renderBuilder();
      if (screen.type === 'practice') html = renderQuestion(config.practice[screen.question], false, screen.question);
      if (screen.type === 'repeat') html = renderRepeat();
      if (screen.type === 'challenge') html = renderChallenge();
      if (screen.type === 'quiz') html = renderQuestion(config.quiz[screen.question], true, screen.question);
      if (screen.type === 'complete') html = renderComplete();
      element('#content').innerHTML = html;
      const nextButton = element('#nextButton');
      if (nextButton) nextButton.disabled = !currentScreenAllowed(screen);
      maybeAutoplay(screen);
    }

    function recordProgress() {
      if (finished) return;
      profile.lessonProgress = {
        ...(profile.lessonProgress || {}),
        [config.id]: Math.max(Number(profile.lessonProgress?.[config.id]) || 0, progress())
      };
      saveProfile();
    }

    function toast(message) {
      const toastElement = element('#toast');
      toastElement.textContent = message;
      toastElement.classList.add('show');
      global.setTimeout(() => toastElement.classList.remove('show'), 1900);
    }

    function exitLesson() {
      recordProgress();
      saveProfile();
      global.location.href = `nikigo-app.html?lang=${language}#dashboard`;
    }

    function restart() {
      index = 0;
      selfCheck = null;
      phraseHeard = false;
      finished = false;
      earnedXp = false;
      Object.values(heard).forEach(set => set.clear());
      built.clear();
      autoplayedScreens.clear();
      Object.keys(practiceAnswers).forEach(key => delete practiceAnswers[key]);
      Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]);
      render();
      global.scrollTo(0, 0);
    }

    element('#content').addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'next' && index < screens.length - 1) { index += 1; recordProgress(); render(); global.scrollTo(0, 0); }
      if (action === 'previous') { if (index === 0) exitLesson(); else { index -= 1; render(); global.scrollTo(0, 0); } }
      if (action === 'exit') exitLesson();
      if (action === 'restart') restart();
      if (action === 'speak') speak(button.dataset.value);
      if (action === 'phrase') { phraseHeard = true; speak(config.phrase.audio); render(); }
      if (action === 'hear') {
        const items = button.dataset.kind === 'words' ? config.words : config[button.dataset.kind];
        heard[button.dataset.kind].add(Number(button.dataset.index));
        speak(items[Number(button.dataset.index)][2]);
        render();
      }
      if (action === 'builder-pick') {
        if (button.dataset.kind === 'consonant') builderConsonant = button.dataset.value;
        else if (button.dataset.kind === 'final') builderFinal = button.dataset.value;
        else builderVowel = button.dataset.value;
        render();
      }
      if (action === 'build') {
        const result = config.syllables[builderConsonant + builderVowel + builderFinal];
        built.add(result);
        speak(result);
        render();
      }
      if (action === 'answer') {
        const isQuiz = button.dataset.quiz === 'true';
        const questionIndex = Number(button.dataset.question);
        const choice = Number(button.dataset.choice);
        const bank = isQuiz ? config.quiz : config.practice;
        const answers = isQuiz ? quizAnswers : practiceAnswers;
        if (!answers[questionIndex]) answers[questionIndex] = { choice, correct: choice === bank[questionIndex].answer };
        render();
      }
      if (action === 'self-check') {
        selfCheck = button.dataset.value;
        if (selfCheck === 'practice' && config.repeat.reviewId) addReview(config.repeat.reviewId, true);
        render();
      }
    });

    global.changeLanguage = value => {
      language = SUPPORTED.includes(value) ? value : 'en';
      saveProfile();
      render();
    };
    global.exitLesson = exitLesson;

    if ('speechSynthesis' in global) {
      refreshVoices();
      if (typeof global.speechSynthesis.addEventListener === 'function') global.speechSynthesis.addEventListener('voiceschanged', refreshVoices);
      else global.speechSynthesis.onvoiceschanged = refreshVoices;
    }
    document.addEventListener('touchstart', unlockAudio, { once: true, passive: true });
    document.addEventListener('pointerdown', unlockAudio, { once: true });
    saveProfile();
    render();
  }

  global.NikigoLesson = Object.freeze({ mount });
})(window);
