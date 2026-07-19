(function (global) {
  'use strict';

  const SUPPORTED = ['zh', 'en', 'vi', 'ja'];
  const FEMALE_KOREAN_VOICE = /Yuna|SunHi|Heami|Sora|Jimin|Seoyeon|Kyuri|Female|여성|한국.*여/i;
  const COMPLETION_ACTIONS = Object.freeze({
    zh: { next: '下一课', home: '返回学习主页' },
    en: { next: 'Next lesson', home: 'Return to learning home' },
    vi: { next: 'Bài tiếp theo', home: 'Về trang học tập' },
    ja: { next: '次のレッスン', home: '学習ホームへ戻る' }
  });
  const SOUND_UI = Object.freeze({
    zh:{vowel:'元音',consonant:'辅音',pronunciationExample:'发音示例',letterName:'字母名称',demoSyllable:'示例音节',listenVowel:'听元音{symbol}',listenVowelAria:'播放韩语元音{symbol}，示例音节{example}',listenLetterName:'听字母名称 {name}',listenDemo:'听示例音节 {syllable}',letterNamePending:'字母名称音频待补充',demoPending:'示例音节音频待补充',approximateHint:'近似提示：{hint}',romanNote:'罗马音仅帮助初步理解，实际发音请以韩语音频和口型说明为准。',consonantRule:'辅音不能脱离元音自然发音，需要与元音组合后学习实际声音。',listenFullWord:'听完整单词“{word}”',listenExpression:'听完整表达“{text}”',playExample:'听示例 {example}'},
    en:{vowel:'Vowel',consonant:'Consonant',pronunciationExample:'Pronunciation example',letterName:'Letter name',demoSyllable:'Example syllable',listenVowel:'Listen to vowel {symbol}',listenVowelAria:'Play Korean vowel {symbol}, example syllable {example}',listenLetterName:'Listen to letter name {name}',listenDemo:'Listen to example syllable {syllable}',letterNamePending:'Letter-name audio pending',demoPending:'Example-syllable audio pending',approximateHint:'Approximate hint: {hint}',romanNote:'Romanization is only an initial aid. Follow the Korean audio and mouth guidance for the actual pronunciation.',consonantRule:'A consonant needs to combine with a vowel to be pronounced naturally.',listenFullWord:'Listen to the complete word “{word}”',listenExpression:'Listen to the complete expression “{text}”',playExample:'Listen to example {example}'},
    vi:{vowel:'Nguyên âm',consonant:'Phụ âm',pronunciationExample:'Ví dụ phát âm',letterName:'Tên chữ cái',demoSyllable:'Âm tiết ví dụ',listenVowel:'Nghe nguyên âm {symbol}',listenVowelAria:'Phát nguyên âm tiếng Hàn {symbol}, âm tiết ví dụ {example}',listenLetterName:'Nghe tên chữ {name}',listenDemo:'Nghe âm tiết ví dụ {syllable}',letterNamePending:'Âm thanh tên chữ đang chờ bổ sung',demoPending:'Âm thanh âm tiết đang chờ bổ sung',approximateHint:'Gợi ý gần đúng: {hint}',romanNote:'Phiên âm Latin chỉ giúp hiểu ban đầu. Hãy theo âm thanh tiếng Hàn và hướng dẫn khẩu hình để phát âm thực tế.',consonantRule:'Phụ âm cần kết hợp với nguyên âm để có thể phát âm tự nhiên.',listenFullWord:'Nghe toàn bộ từ “{word}”',listenExpression:'Nghe toàn bộ biểu đạt “{text}”',playExample:'Nghe ví dụ {example}'},
    ja:{vowel:'母音',consonant:'子音',pronunciationExample:'発音例',letterName:'文字名',demoSyllable:'例の音節',listenVowel:'母音{symbol}を聞く',listenVowelAria:'韓国語の母音{symbol}、例の音節{example}を再生',listenLetterName:'文字名{name}を聞く',listenDemo:'例の音節{syllable}を聞く',letterNamePending:'文字名音声は追加予定',demoPending:'例の音節音声は追加予定',approximateHint:'近似ヒント：{hint}',romanNote:'ローマ字は最初の理解を助ける目安です。実際の発音は韓国語音声と口の形の説明を基準にしてください。',consonantRule:'子音は母音と組み合わせて初めて自然に発音できます。',listenFullWord:'単語「{word}」全体を聞く',listenExpression:'表現「{text}」全体を聞く',playExample:'例の{example}を聞く'}
  });
  Object.assign(SOUND_UI.zh,{pronunciationExample:'元音声音',carrierSyllable:'对应承载音节',listenLetterName:'听字母名称 {name}',vowelCarrierRule:'元音书写成独立音节时需要加ㅇ；这里的ㅇ不发音，实际听到的是元音本身。',silentIeung:'ㅇ在아中作为初声不发音。'});
  Object.assign(SOUND_UI.en,{pronunciationExample:'Vowel sound',carrierSyllable:'Carrier syllable',vowelCarrierRule:'When a vowel is written as an independent syllable, it takes ㅇ. Here ㅇ is silent, so what you hear is the vowel itself.',silentIeung:'In 아, ㅇ is silent in the onset position.'});
  Object.assign(SOUND_UI.vi,{pronunciationExample:'Âm nguyên âm',carrierSyllable:'Âm tiết mang',vowelCarrierRule:'Khi viết nguyên âm thành âm tiết độc lập cần thêm ㅇ. Ở đây ㅇ câm, nên âm bạn nghe chính là nguyên âm.',silentIeung:'Trong 아, ㅇ ở vị trí đầu âm tiết không phát âm.'});
  Object.assign(SOUND_UI.ja,{pronunciationExample:'母音の音',carrierSyllable:'母音を載せる音節',vowelCarrierRule:'母音を独立した音節として書くときはㅇを加えます。ここでㅇは無音なので、実際に聞こえるのは母音そのものです。',silentIeung:'아では、音節頭のㅇは発音しません。'});
  Object.assign(SOUND_UI.zh,{playerPlay:'播放听力题音频',playerPlaying:'正在播放',playerReplay:'再次播放',playerLoading:'音频加载中',playerError:'音频暂时无法播放，请重试',playerAriaPlay:'播放本题韩语音频',playerAriaReplay:'再次播放本题韩语音频',testAudio:'当前为测试音频，正式发布前将完成韩语发音审核。',transcriptLabel:'音频原文',translationLabel:'含义',correctAnswerLabel:'正确答案',teachingPointLabel:'学习提示',vowelFeedback:'比较承载音节中的元音音色，注意不要只依赖罗马音。',syllableFeedback:'听完整音节，分清开头辅音和元音的组合。',wordFeedback:'听完整单词的音节顺序，再与选项逐一比较。',phraseFeedback:'听完整表达和礼貌语尾，不要只抓住开头几个音节。'});
  Object.assign(SOUND_UI.en,{playerPlay:'Play listening audio',playerPlaying:'Playing',playerReplay:'Play again',playerLoading:'Loading audio',playerError:'Audio is temporarily unavailable. Try again.',playerAriaPlay:'Play this Korean audio question',playerAriaReplay:'Play this Korean audio question again',testAudio:'Test audio. Korean pronunciation will be reviewed before release.',transcriptLabel:'Audio transcript',translationLabel:'Meaning',correctAnswerLabel:'Correct answer',teachingPointLabel:'Learning tip',vowelFeedback:'Compare the vowel quality inside the carrier syllable; do not rely on romanization alone.',syllableFeedback:'Listen to the full syllable and separate the onset from the vowel.',wordFeedback:'Listen for the full word’s syllable order, then compare each option.',phraseFeedback:'Listen to the whole expression and its polite ending, not only the opening syllables.'});
  Object.assign(SOUND_UI.vi,{playerPlay:'Phát âm thanh bài nghe',playerPlaying:'Đang phát',playerReplay:'Phát lại',playerLoading:'Đang tải âm thanh',playerError:'Tạm thời không thể phát âm thanh. Hãy thử lại.',playerAriaPlay:'Phát âm thanh tiếng Hàn của câu này',playerAriaReplay:'Phát lại âm thanh tiếng Hàn của câu này',testAudio:'Âm thanh thử nghiệm. Phát âm tiếng Hàn sẽ được duyệt trước khi phát hành.',transcriptLabel:'Nội dung âm thanh',translationLabel:'Nghĩa',correctAnswerLabel:'Đáp án đúng',teachingPointLabel:'Gợi ý học tập',vowelFeedback:'So sánh chất âm nguyên âm trong âm tiết mang; đừng chỉ dựa vào phiên âm Latin.',syllableFeedback:'Nghe trọn âm tiết và phân biệt phụ âm đầu với nguyên âm.',wordFeedback:'Nghe thứ tự các âm tiết của cả từ rồi so sánh từng lựa chọn.',phraseFeedback:'Nghe toàn bộ biểu đạt và đuôi lịch sự, không chỉ các âm tiết đầu.'});
  Object.assign(SOUND_UI.ja,{playerPlay:'聞き取り問題の音声を再生',playerPlaying:'再生中',playerReplay:'もう一度再生',playerLoading:'音声を読み込み中',playerError:'音声を一時的に再生できません。もう一度お試しください。',playerAriaPlay:'この問題の韓国語音声を再生',playerAriaReplay:'この問題の韓国語音声をもう一度再生',testAudio:'テスト音声です。公開前に韓国語発音の確認を完了します。',transcriptLabel:'音声の原文',translationLabel:'意味',correctAnswerLabel:'正解',teachingPointLabel:'学習ポイント',vowelFeedback:'母音を載せた音節の音色を比べ、ローマ字だけに頼らないでください。',syllableFeedback:'音節全体を聞き、語頭子音と母音の組み合わせを分けて捉えます。',wordFeedback:'単語全体の音節順を聞き、選択肢を一つずつ比べます。',phraseFeedback:'冒頭だけでなく、表現全体と丁寧な語尾を聞き取ります。'});

  function neutralPlayerCopy(language, state) {
    const copy = SOUND_UI[language] || SOUND_UI.en;
    if (state === 'loading') return { label:copy.playerLoading, aria:copy.playerAriaPlay };
    if (state === 'playing' || state === 'autoplay' || state === 'fallback') return { label:copy.playerPlaying, aria:copy.playerAriaReplay };
    if (state === 'error') return { label:copy.playerError, aria:copy.playerAriaReplay };
    if (state === 'played' || state === 'replay') return { label:copy.playerReplay, aria:copy.playerAriaReplay };
    return { label:copy.playerPlay, aria:copy.playerAriaPlay };
  }

  function questionPlayerModel(question, language, state, answered, translation = '') {
    const player = neutralPlayerCopy(language, state);
    return Object.freeze({
      label: player.label,
      aria: player.aria,
      transcript: answered ? (Array.isArray(question?.audio) ? question.audio.join(' · ') : question?.audio || '') : '',
      translation: answered ? translation : '',
      correctAnswer: answered ? question?.options?.[question.answer] || '' : ''
    });
  }

  function normalizeLessonSession(raw, config, screenCount) {
    if (!raw || raw.version !== 1 || !config || !Number.isInteger(screenCount) || screenCount < 1) return null;
    const indexes = (value, length) => [...new Set((Array.isArray(value) ? value : [])
      .filter(index => Number.isInteger(index) && index >= 0 && index < length))];
    const answers = (value, questions) => Object.fromEntries(Object.entries(value || {}).flatMap(([key, answer]) => {
      const questionIndex = Number(key);
      const question = questions[questionIndex];
      const choice = Number(answer?.choice);
      if (!Number.isInteger(questionIndex) || !question || !Number.isInteger(choice) || choice < 0 || choice >= question.options.length) return [];
      return [[questionIndex, { choice, correct:choice === question.answer }]];
    }));
    const syllables = new Set(Object.values(config.syllables || {}));
    return Object.freeze({
      version: 1,
      index: Math.min(screenCount - 1, Math.max(0, Number.isInteger(raw.index) ? raw.index : 0)),
      heard: {
        vowels: indexes(raw.heard?.vowels, config.vowels?.length || 0),
        consonants: indexes(raw.heard?.consonants, config.consonants?.length || 0),
        words: indexes(raw.heard?.words, config.words?.length || 0)
      },
      built: [...new Set((Array.isArray(raw.built) ? raw.built : []).filter(value => syllables.has(value)))],
      practiceAnswers: answers(raw.practiceAnswers, config.practice || []),
      quizAnswers: answers(raw.quizAnswers, config.quiz || []),
      phraseHeard: raw.phraseHeard === true,
      selfCheck: ['practice', 'good'].includes(raw.selfCheck) ? raw.selfCheck : null,
      builderConsonant: config.builder?.consonants?.includes(raw.builderConsonant) ? raw.builderConsonant : null,
      builderVowel: config.builder?.vowels?.includes(raw.builderVowel) ? raw.builderVowel : null,
      builderFinal: config.builder?.finals?.includes(raw.builderFinal) ? raw.builderFinal : null
    });
  }

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
    const questionPlayerStates = new Map();
    let phraseHeard = false;
    let language = initialLanguage();
    let index = 0;
    let selfCheck = null;
    let finished = false;
    let earnedXp = false;
    let builderConsonant = config.builder.initialConsonant || config.builder.consonants[0];
    let builderVowel = config.builder.initialVowel || config.builder.vowels[0];
    let builderFinal = config.builder.finals ? (config.builder.initialFinal ?? config.builder.finals[0]) : '';
    const sessionKey = `nikigoLessonSession:${config.id}`;
    let koreanVoices = [];
    let currentAudio = null;
    let currentUtterance = null;
    let audioUnlocked = false;
    let playbackGeneration = 0;
    let activeAudioValue = '';

    const element = selector => document.querySelector(selector);
    const copy = key => config.copy[language]?.[key] || config.copy.en?.[key] || key;
    const completionCopy = key => COMPLETION_ACTIONS[language]?.[key] || COMPLETION_ACTIONS.en[key];
    const soundUi = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), SOUND_UI[language]?.[key] || SOUND_UI.en[key] || key);
    const hasStructuredItems = items => Boolean(items?.length && !Array.isArray(items[0]));
    const shouldRenderPlayingState = () => ['vowels', 'consonants'].includes(screens[index]?.type) && (config.batchimExamples || hasStructuredItems(config[screens[index].type]));

    function saveSession() {
      global.localStorage.setItem(sessionKey, JSON.stringify({
        version: 1,
        index,
        heard: Object.fromEntries(Object.entries(heard).map(([key, values]) => [key, [...values]])),
        built: [...built],
        practiceAnswers,
        quizAnswers,
        phraseHeard,
        selfCheck,
        builderConsonant,
        builderVowel,
        builderFinal
      }));
    }

    function restoreSession() {
      try {
        const restored = normalizeLessonSession(JSON.parse(global.localStorage.getItem(sessionKey) || 'null'), config, screens.length);
        if (!restored) return;
        index = restored.index;
        Object.entries(restored.heard).forEach(([key, values]) => values.forEach(value => heard[key].add(value)));
        restored.built.forEach(value => built.add(value));
        Object.assign(practiceAnswers, restored.practiceAnswers);
        Object.assign(quizAnswers, restored.quizAnswers);
        phraseHeard = restored.phraseHeard;
        selfCheck = restored.selfCheck;
        if (restored.builderConsonant !== null) builderConsonant = restored.builderConsonant;
        if (restored.builderVowel !== null) builderVowel = restored.builderVowel;
        if (restored.builderFinal !== null) builderFinal = restored.builderFinal;
      } catch {
        // Invalid or legacy session data is ignored without touching the learning profile.
      }
    }

    restoreSession();

    function nextCourse() {
      const lessons = [...(global.NIKIGO_COURSES || [])].sort((a, b) => a.displayOrder - b.displayOrder);
      const currentIndex = lessons.findIndex(lesson => (lesson.stableId || lesson.id) === config.id);
      return currentIndex >= 0 ? (lessons.slice(currentIndex + 1).find(lesson => lesson.status === 'available' && lesson.file) || null) : null;
    }

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

    function systemSpeech(value, onEnd) {
      if (!('speechSynthesis' in global) || typeof global.SpeechSynthesisUtterance === 'undefined') {
        toast(copy('audioUnavailable'));
        if (onEnd) onEnd('error');
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
      currentUtterance.onend = () => { if (onEnd) onEnd('played'); };
      currentUtterance.onerror = event => {
        if (!['canceled', 'interrupted'].includes(event.error)) toast(copy('audioError'));
        if (onEnd) onEnd('error');
      };
      synth.speak(currentUtterance);
    }

    function playOne(value, onEnd) {
      unlockAudio();
      activeAudioValue = value;
      if (shouldRenderPlayingState()) render();
      const complete = (result = 'played') => {
        if (activeAudioValue === value) {
          activeAudioValue = '';
          if (shouldRenderPlayingState()) render();
        }
        if (onEnd) onEnd(result);
      };
      const file = config.audioFiles?.[value];
      if (!file) {
        systemSpeech(value, complete);
        return;
      }
      if (currentAudio) currentAudio.pause();
      currentAudio = new Audio(file);
      currentAudio.preload = 'auto';
      currentAudio.playbackRate = configuredAudioRate();
      currentAudio.preservesPitch = true;
      currentAudio.mozPreservesPitch = true;
      currentAudio.webkitPreservesPitch = true;
      currentAudio.onended = complete;
      currentAudio.play().catch(() => systemSpeech(value, complete));
    }

    function speak(value, onEnd) {
      const sequence = (Array.isArray(value) ? value : [value]).filter(Boolean);
      const generation = ++playbackGeneration;
      let sequenceIndex = 0;
      const playNext = () => {
        if (generation !== playbackGeneration) return;
        if (sequenceIndex >= sequence.length) { if (onEnd) onEnd('played'); return; }
        playOne(sequence[sequenceIndex], result => {
          if (result === 'error') { if (onEnd) onEnd('error'); return; }
          sequenceIndex += 1;
          playNext();
        });
      };
      playNext();
    }

    function questionKey(isQuiz, questionIndex) {
      return `${isQuiz ? 'quiz' : 'practice'}:${questionIndex}`;
    }

    function questionTranslation(question) {
      if (!question?.audio || Array.isArray(question.audio)) return '';
      const word = config.words?.find(item => item[0] === question.audio);
      if (word) return copy(word[3]);
      if (config.phrase?.korean === question.audio) return copy(config.phrase.translationKey);
      return '';
    }

    function questionTeachingPoint(question) {
      if (config.phrase?.audio === question?.audio) return soundUi('phraseFeedback');
      if (config.words?.some(item => item[0] === question?.audio)) return soundUi('wordFeedback');
      const answer = question?.options?.[question.answer] || '';
      if (/^[ㅏ-ㅣ]$/u.test(answer)) return soundUi('vowelFeedback');
      return soundUi('syllableFeedback');
    }

    function playQuestionAudio(question, isQuiz, questionIndex, autoplay = false) {
      const key = questionKey(isQuiz, questionIndex);
      questionPlayerStates.set(key, autoplay ? 'autoplay' : 'loading');
      render();
      questionPlayerStates.set(key, autoplay ? 'autoplay' : 'playing');
      render();
      speak(question.audio, result => {
        questionPlayerStates.set(key, result === 'error' ? 'error' : 'played');
        render();
      });
    }

    function progress() {
      return Math.round((index + 1) / screens.length * 100);
    }

    function shell(body) {
      const previousLabel = index === 0 ? copy('returnHome') : copy('back');
      return `${body}<p class="aiDisclosure">ⓘ ${copy('aiVoice')}</p><div class="foot"><button class="ghost" data-action="previous">← ${previousLabel}</button><button class="primary" id="nextButton" data-action="next">${copy(index === screens.length - 2 ? 'finish' : 'continue')} →</button></div>`;
    }

    function renderIntro() {
      const icons = config.goalIcons || ['👂', '🔤', '🧩'];
      return shell(`<span class="eyebrow">${copy('introTag')}</span><h1>${copy('introTitle')}</h1><p class="lead">${copy('introLead')}</p><div class="goals">${[1, 2, 3].map((goal, offset) => `<div class="goal"><b>${icons[offset]} ${copy(`goal${goal}`)}</b><span>${copy(`goal${goal}d`)}</span></div>`).join('')}</div><div class="note">💡 ${copy('tip')}</div>`);
    }

    function renderSoundSet(type, items, titleKey, leadKey, promptKey) {
      const seen = heard[type];
      if (type === 'vowels' && config.batchimExamples) {
        return shell(`<span class="eyebrow">${copy('vowelTag')}</span><h1>${copy(titleKey)}</h1><p class="lead">${copy(leadKey)}</p><div class="batchimGrid">${config.batchimExamples.map((example, itemIndex) => `<button class="batchimWordCard ${seen.has(itemIndex) ? 'done' : ''} ${activeAudioValue === example.audio ? 'playing' : ''}" data-action="hear" data-kind="vowels" data-index="${itemIndex}" aria-label="${copy('playWordAria').replace('{word}', example.word)}"><span class="batchimWordLine"><strong>${example.word}</strong><span class="listenWord">▶ ${soundUi('listenFullWord',{word:example.word})}</span></span><span class="batchimTag">${copy('finalLabel')} · ${example.final} ${example.ending}</span><span class="batchimBuild">${example.word} → ${example.stem} + ${example.final}</span><span class="batchimMeaning">${copy(example.meaningKey)}</span></button>`).join('')}</div>${seen.size < items.length ? `<div class="note">🎧 ${copy(promptKey)} · ${seen.size}/${items.length}</div>` : ''}`);
      }
      if (hasStructuredItems(items)) {
        const cards = items.map((item, itemIndex) => {
          const playingValue = item.type === 'vowel' ? item.vowelCarrierSyllable : item.demoSyllable;
          if (item.type === 'vowel') return `<article class="soundObjectCard ${seen.has(itemIndex) ? 'done' : ''} ${activeAudioValue === playingValue ? 'playing' : ''}"><span class="objectType">${soundUi('vowel')}</span><strong class="objectSymbol">${item.symbol}</strong><span class="objectExample">${soundUi('carrierSyllable')}：<b>${item.vowelCarrierSyllable}</b></span><span class="soundHint">${soundUi('approximateHint',{hint:item.soundHint})}</span><p>${copy(item.descriptionKey)}</p><p class="vowelCarrierRule">${soundUi('vowelCarrierRule')}</p><button class="objectAudioButton" data-action="structured-audio" data-kind="${type}" data-index="${itemIndex}" data-role="vowel" aria-label="${soundUi('listenVowelAria',{symbol:item.symbol,example:item.vowelCarrierSyllable})}" ${item.vowelAudio ? '' : 'disabled'}>▶ ${item.vowelAudio ? soundUi('listenVowel',{symbol:item.symbol}) : soundUi('demoPending')}</button></article>`;
          return `<article class="soundObjectCard consonantObject ${seen.has(itemIndex) ? 'done' : ''} ${activeAudioValue === playingValue ? 'playing' : ''}"><span class="objectType">${soundUi('consonant')}</span><strong class="objectSymbol">${item.symbol}</strong><div class="objectFacts"><span>${soundUi('letterName')}：<b>${item.letterName}</b></span><span>${soundUi('demoSyllable')}：<b>${item.symbol} + ㅏ = ${item.demoSyllable}</b></span></div><span class="soundHint">${soundUi('approximateHint',{hint:item.soundHint})}</span><p>${copy(item.descriptionKey)}</p><p class="consonantRule">${soundUi('consonantRule')}</p>${item.symbol === 'ㅇ' ? `<p class="vowelCarrierRule">${soundUi('silentIeung')}</p>` : ''}<div class="objectActions"><button class="objectAudioButton secondaryAudio" data-action="structured-audio" data-kind="${type}" data-index="${itemIndex}" data-role="letter-name" ${item.letterNameAudio ? '' : 'disabled'}>${item.letterNameAudio ? `▶ ${soundUi('listenLetterName',{name:item.letterName})}` : soundUi('letterNamePending')}</button><button class="objectAudioButton" data-action="structured-audio" data-kind="${type}" data-index="${itemIndex}" data-role="demo" ${item.demoAudio ? '' : 'disabled'}>▶ ${item.demoAudio ? soundUi('listenDemo',{syllable:item.demoSyllable}) : soundUi('demoPending')}</button></div></article>`;
        }).join('');
        return shell(`<span class="eyebrow">${copy(type === 'vowels' ? 'vowelTag' : 'conTag')}</span><h1>${copy(titleKey)}</h1><p class="lead">${copy(leadKey)}</p><div class="soundObjectGrid" style="--sound-count:${items.length}">${cards}</div><div class="romanizationNote">ⓘ ${soundUi('romanNote')}</div>${seen.size < items.length ? `<div class="note">🎧 ${copy(promptKey)} · ${seen.size}/${items.length}</div>` : ''}`);
      }
      return shell(`<span class="eyebrow">${copy(type === 'vowels' ? 'vowelTag' : 'conTag')}</span><h1>${copy(titleKey)}</h1><p class="lead">${copy(leadKey)}</p><div class="learnGrid ${type === 'consonants' ? 'consonants' : ''}" style="--sound-count:${items.length}">${items.map((item, itemIndex) => `<button class="soundCard ${seen.has(itemIndex) ? 'done' : ''}" data-action="hear" data-kind="${type}" data-index="${itemIndex}" aria-label="${soundUi('playExample',{example:item[2]})}"><span class="play">▶ ${soundUi('playExample',{example:item[2]})}</span><span class="jamo">${item[0]}</span><span class="roman">${soundUi('approximateHint',{hint:`[${item[1]}]`})}</span><p>${copy(item[3])}</p></button>`).join('')}</div><div class="romanizationNote">ⓘ ${soundUi('romanNote')}</div>${seen.size < items.length ? `<div class="note">🎧 ${copy(promptKey)} · ${seen.size}/${items.length}</div>` : ''}`);
    }

    function renderWords() {
      return shell(`<span class="eyebrow">${copy('wordsTag')}</span><h1>${copy('wordsTitle')}</h1><p class="lead">${copy('wordsLead')}</p><div class="wordGrid" style="--word-count:${config.words.length}">${config.words.map((word, wordIndex) => `<button class="wordCard ${heard.words.has(wordIndex) ? 'done' : ''}" data-action="hear" data-kind="words" data-index="${wordIndex}" aria-label="${soundUi('listenFullWord',{word:word[0]})}"><span class="wordIcon">${word[4]}</span><strong>${word[0]}</strong><span class="wordListen">▶ ${soundUi('listenFullWord',{word:word[0]})}</span><span class="wordRoman">${soundUi('approximateHint',{hint:`[${word[1]}]`})}</span><p>${copy(word[3])}</p></button>`).join('')}</div><div class="romanizationNote">ⓘ ${soundUi('romanNote')}</div>${heard.words.size < config.words.length ? `<div class="note">🎧 ${copy('tapWords')} · ${heard.words.size}/${config.words.length}</div>` : ''}`);
    }

    function renderPhrase() {
      return shell(`<span class="eyebrow">${copy('phraseTag')}</span><h1>${copy('phraseTitle')}</h1><p class="lead">${copy('phraseLead')}</p><button class="phraseBox ${phraseHeard ? 'done' : ''}" data-action="phrase" aria-label="${soundUi('listenExpression',{text:config.phrase.korean})}"><span class="phrasePlay">▶</span><strong>${config.phrase.korean}</strong><span class="phraseListen">${soundUi('listenExpression',{text:config.phrase.korean})}</span><span class="phraseRoman">${soundUi('approximateHint',{hint:`[${config.phrase.romanization}]`})}</span><p>${copy(config.phrase.translationKey)}</p></button><div class="romanizationNote">ⓘ ${soundUi('romanNote')}</div><div class="note">💬 ${copy('phraseNote')}</div>`);
    }

    function renderBuilder() {
      const result = config.syllables[builderConsonant + builderVowel + builderFinal] || '';
      const finalsGroup = config.builder.finals ? `<b class="operator">+</b><div class="pickGroup"><label>${copy('final')}</label><div class="picks">${config.builder.finals.map(value => `<button class="pick ${builderFinal === value ? 'on' : ''}" data-action="builder-pick" data-kind="final" data-value="${value}">${value || '–'}</button>`).join('')}</div></div>` : '';
      return shell(`<span class="eyebrow">${copy('builderTag')}</span><h1>${copy('builderTitle')}</h1><p class="lead">${copy('builderLead')}</p><div class="builder ${config.builder.finals ? 'withFinal' : ''}"><div class="pickGroup"><label>${copy('consonant')}</label><div class="picks">${config.builder.consonants.map(value => `<button class="pick ${builderConsonant === value ? 'on' : ''}" data-action="builder-pick" data-kind="consonant" data-value="${value}">${value}</button>`).join('')}</div></div><b class="operator">+</b><div class="pickGroup"><label>${copy('vowel')}</label><div class="picks">${config.builder.vowels.map(value => `<button class="pick ${builderVowel === value ? 'on' : ''}" data-action="builder-pick" data-kind="vowel" data-value="${value}">${value}</button>`).join('')}</div></div>${finalsGroup}<b class="operator">=</b><button class="buildResult" data-action="build" aria-label="${result ? soundUi('listenDemo',{syllable:result}) : copy('yourSyllable')}" ${result ? '' : 'disabled'}><span><small>${copy('yourSyllable')}</small><strong>${result || '—'}</strong>${result ? `<em>▶ ${soundUi('listenDemo',{syllable:result})}</em>` : ''}</span></button></div><div class="builtList"><b>${copy('built')}:</b>${[...built].map(value => `<span>${value}</span>`).join('')}</div>${config.builder.required.every(value => built.has(value)) ? '' : `<div class="note">🧩 ${copy('buildMore')}</div>`}`);
    }

    function renderQuestion(question, isQuiz, questionIndex) {
      const answers = isQuiz ? quizAnswers : practiceAnswers;
      const answer = answers[questionIndex];
      const total = isQuiz ? config.quiz.length : config.practice.length;
      const correctAnswer = question.options[question.answer];
      const feedback = answer ? `<div class="feedback ${answer.correct ? 'good' : 'try'}" role="status"><strong>${answer.correct ? copy('correct') : copy('incorrect').replace('{answer}', correctAnswer)}</strong><span>${soundUi('correctAnswerLabel')}：${correctAnswer}</span><small>${soundUi('teachingPointLabel')}：${questionTeachingPoint(question)}</small></div>` : '';
      const playerState = questionPlayerStates.get(questionKey(isQuiz, questionIndex)) || 'initial';
      const translation = questionTranslation(question);
      const playerModel = questionPlayerModel(question, language, playerState, Boolean(answer), translation);
      const reveal = answer && question.audio ? `<div class="answerReveal"><b>${soundUi('transcriptLabel')}：${playerModel.transcript}</b>${playerModel.translation ? `<span>${soundUi('translationLabel')}：${playerModel.translation}</span>` : ''}</div>` : '';
      const player = question.audio ? `<div class="questionAudioPlayer" data-player-state="${playerState}"><button class="audioBtn" data-action="question-audio" data-quiz="${isQuiz}" data-question="${questionIndex}" aria-label="${playerModel.aria}"><i>▶</i><span><b>${playerModel.label}</b><small>0:02</small></span></button>${playerState === 'error' ? `<p class="playerError" role="status">${soundUi('playerError')}</p>` : ''}</div><p class="testAudioDisclosure">ⓘ ${soundUi('testAudio')}</p>` : '';
      return shell(`<span class="eyebrow">${isQuiz ? copy('question') : copy('practiceTag')} · ${questionIndex + 1} / ${total}</span><h2 class="question">${copy(question.prompt)}</h2>${player}<div class="options">${question.options.map((option, optionIndex) => { let state = ''; if (answer) { if (optionIndex === question.answer) state = 'correct'; else if (optionIndex === answer.choice) state = 'wrong'; } return `<button class="option ${state}" data-action="answer" data-quiz="${isQuiz}" data-question="${questionIndex}" data-choice="${optionIndex}" ${answer ? 'disabled' : ''}><span>${String.fromCharCode(65 + optionIndex)}</span>${option}</button>`; }).join('')}</div>${feedback}${reveal}`);
    }

    function renderRepeat() {
      return shell(`<span class="eyebrow">${copy('repeatTag')}</span><h1>${copy('repeatTitle')}</h1><p class="lead">${copy('repeatLead')}</p><div class="repeatBox"><small>${copy('listenPhrase')}</small><div class="repeatText">${config.repeat.display}</div><div class="repeatActions"><button class="primary" data-action="repeat-audio" aria-label="${soundUi('listenExpression',{text:config.repeat.display})}">▶ ${soundUi('listenExpression',{text:config.repeat.display})}</button></div><div class="selfCheck"><button class="${selfCheck === 'practice' ? 'on' : ''}" data-action="self-check" data-value="practice">↻ ${copy('needPractice')}</button><button class="${selfCheck === 'good' ? 'on' : ''}" data-action="self-check" data-value="good">✓ ${copy('soundsGood')}</button></div></div>${selfCheck ? '' : `<div class="note">${copy('chooseCheck')}</div>`}`);
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
      saveSession();
    }

    function renderComplete() {
      finishLesson();
      const score = Object.values(quizAnswers).filter(answer => answer.correct).length;
      const perfect = score === config.quiz.length;
      const next = nextCourse();
      const nextActions = next
        ? `<button class="secondary" data-action="exit">${completionCopy('home')}</button><button class="primary" data-action="next-lesson">${completionCopy('next')} →</button>`
        : `<button class="primary" data-action="exit">${completionCopy('home')} →</button>`;
      return `<div class="complete"><span class="eyebrow">${copy('completeTag')}</span><h1>${copy('completeTitle')}</h1><p class="lead centered">${copy('completeLead')}</p><div class="scoreRing" style="--score:${score / config.quiz.length * 100}%"><div><span><strong>${score}/${config.quiz.length}</strong><small>${copy('score')}</small></span></div></div><div class="rewards"><span class="reward">✦ ${earnedXp ? copy('xp') : '+0 XP'}</span><span class="reward">↻ ${copy('reviewAdded')}</span></div><div class="reviewBox"><b>${copy('reviewTitle')}</b><br>${copy(perfect ? 'reviewPerfect' : 'reviewNeeds')}</div><div class="repeatActions"><button class="secondary" data-action="restart">↻ ${copy('replay')}</button>${nextActions}</div></div>`;
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
      let question = null;
      if (screen.type === 'practice') { question = config.practice[screen.question]; value = question.audio; }
      if (screen.type === 'quiz') { question = config.quiz[screen.question]; value = question.audio; }
      if (screen.type === 'repeat') value = config.repeat.audio;
      if (screen.type === 'phrase') value = config.phrase.audio;
      if (!value) return;
      autoplayedScreens.add(index);
      global.setTimeout(() => question ? playQuestionAudio(question, screen.type === 'quiz', screen.question, true) : speak(value), 250);
    }

    function render() {
      document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
      element('#language').value = language;
      element('#lessonName').textContent = copy('lessonName');
      element('#progressLabel').textContent = copy('progress');
      element('#progressCount').textContent = `${index + 1} / ${screens.length}`;
      element('#progressBar').style.width = `${progress()}%`;
      element('#progressTrack').setAttribute('aria-valuenow', String(progress()));
      const returnHomeLabel = copy('returnHome');
      element('#homeButton').setAttribute('aria-label', returnHomeLabel);
      element('#homeButton').setAttribute('title', returnHomeLabel);
      element('#homeLogo').setAttribute('aria-label', returnHomeLabel);
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
      saveSession();
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

    function goNextLesson() {
      const next = nextCourse();
      if (!next) {
        exitLesson();
        return;
      }
      saveProfile();
      global.location.href = `${next.file}?lang=${language}`;
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
      questionPlayerStates.clear();
      Object.keys(practiceAnswers).forEach(key => delete practiceAnswers[key]);
      Object.keys(quizAnswers).forEach(key => delete quizAnswers[key]);
      saveSession();
      render();
      global.scrollTo(0, 0);
    }

    element('#content').addEventListener('click', event => {
      const button = event.target.closest('[data-action]');
      if (!button) return;
      const action = button.dataset.action;
      if (action === 'next' && index < screens.length - 1) { index += 1; recordProgress(); render(); global.scrollTo(0, 0); }
      if (action === 'previous') { if (index === 0) exitLesson(); else { index -= 1; saveSession(); render(); global.scrollTo(0, 0); } }
      if (action === 'exit') exitLesson();
      if (action === 'next-lesson') goNextLesson();
      if (action === 'restart') restart();
      if (action === 'question-audio') {
        const isQuiz = button.dataset.quiz === 'true';
        const questionIndex = Number(button.dataset.question);
        const question = (isQuiz ? config.quiz : config.practice)[questionIndex];
        if (question?.audio) playQuestionAudio(question, isQuiz, questionIndex);
      }
      if (action === 'repeat-audio') speak(config.repeat.audio);
      if (action === 'phrase') { phraseHeard = true; saveSession(); speak(config.phrase.audio); render(); }
      if (action === 'structured-audio') {
        const kind = button.dataset.kind;
        const itemIndex = Number(button.dataset.index);
        const item = config[kind][itemIndex];
        const role = button.dataset.role;
        const value = role === 'vowel' ? item.vowelCarrierSyllable : role === 'letter-name' ? item.letterName : item.demoSyllable;
        const file = role === 'vowel' ? item.vowelAudio : role === 'letter-name' ? item.letterNameAudio : item.demoAudio;
        if (!file || !value) return;
        heard[kind].add(itemIndex);
        saveSession();
        speak(value);
        render();
      }
      if (action === 'hear') {
        const items = button.dataset.kind === 'words' ? config.words : config[button.dataset.kind];
        heard[button.dataset.kind].add(Number(button.dataset.index));
        saveSession();
        speak(items[Number(button.dataset.index)][2]);
        render();
      }
      if (action === 'builder-pick') {
        if (button.dataset.kind === 'consonant') builderConsonant = button.dataset.value;
        else if (button.dataset.kind === 'final') builderFinal = button.dataset.value;
        else builderVowel = button.dataset.value;
        saveSession();
        render();
      }
      if (action === 'build') {
        const result = config.syllables[builderConsonant + builderVowel + builderFinal];
        if (!result) return;
        built.add(result);
        saveSession();
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
        saveSession();
        render();
      }
      if (action === 'self-check') {
        selfCheck = button.dataset.value;
        if (selfCheck === 'practice' && config.repeat.reviewId) addReview(config.repeat.reviewId, true);
        saveSession();
        render();
      }
    });

    global.changeLanguage = value => {
      language = SUPPORTED.includes(value) ? value : 'en';
      saveProfile();
      saveSession();
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

  global.NikigoLesson = Object.freeze({ mount, uiCopy:SOUND_UI, neutralPlayerCopy, questionPlayerModel, normalizeLessonSession });
})(window);
