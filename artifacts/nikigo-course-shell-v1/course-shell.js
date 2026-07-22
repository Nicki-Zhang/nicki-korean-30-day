(function () {
  'use strict';

  const copySource = globalThis.NikigoCourseShellCopy;
  if (!copySource) throw new Error('Nikigo Course Shell localized copy did not load');
  const { SUPPORTED, UI, COURSES, COPY } = copySource;
  copySource.validate();
  const query = new URLSearchParams(location.search);
  const requestedLanguage = query.get('lang') || 'zh';
  if (!SUPPORTED.includes(requestedLanguage)) throw new Error(`Nikigo Shell unsupported language: ${requestedLanguage}`);
  let language = requestedLanguage;
  let courseId = ['lesson07', 'lesson11', 'lesson10', 'lesson06'].includes(query.get('course')) ? query.get('course') : 'lesson07';
  let requestedState = query.get('state') || 'intro';
  let answerState = '';
  let buildTokens = [];

  const stateMeta = {
    intro:{phase:'intro',step:1}, resume:{phase:'learn',step:5}, explain:{phase:'learn',step:2}, example:{phase:'learn',step:4}, 'audio-unavailable':{phase:'learn',step:4}, dialogue:{phase:'learn',step:2}, choice:{phase:'practice',step:8}, 'choice-correct':{phase:'practice',step:8}, wrong:{phase:'practice',step:7}, retry:{phase:'challenge',step:12}, build:{phase:'practice',step:6}, correct:{phase:'practice',step:6}, 'complete-first':{phase:'summary',step:13}, 'complete-repeat':{phase:'summary',step:13}, gate:{phase:'intro',step:1}, 'preview-complete':{phase:'summary',step:18}
  };

  const phaseLabel = key => ui(`phase${key[0].toUpperCase()}${key.slice(1)}`);
  const local = (value, path) => copySource.localize(value, language, path);
  const ui = key => {
    const value = UI[language]?.[key];
    if (typeof value !== 'string' || !value) throw new Error(`Nikigo Shell missing UI.${language}.${key}`);
    return value;
  };
  const copy = key => local(COPY[key], `COPY.${key}`);

  function feedback(correct, body) {
    return `<section class="feedbackPanel ${correct ? 'isCorrect' : 'isWrong'}" role="status"><div class="feedbackTitle"><span class="feedbackIcon" aria-hidden="true">${correct ? '✓' : '!'}</span><span>${ui(correct ? 'correct' : 'wrong')}</span></div><p>${body}</p></section>`;
  }

  function audioLine(playable, label) {
    return `<div class="audioLine"><button class="audioButton" type="button" ${playable ? '' : 'disabled aria-disabled="true"'} aria-label="${ui(playable ? 'audio' : 'audioPending')}">${playable ? '▶' : '×'}</button><div class="audioCopy"><strong>${label}</strong><span>${ui(playable ? 'audioReady' : 'audioPending')}</span></div></div>`;
  }

  function intro(course, korean, leadKey, factKeys, gated = false) {
    return `${gated ? `<aside class="gateNotice" role="status"><strong>${copy('gateTitle')}</strong>${copy('gateBody')}</aside>` : ''}<div class="introPanel"><p class="surfaceLabel">${local(course.lesson, `${course.stableId}.lesson`)}</p><h1 class="koreanHero">${korean}</h1><p class="lessonLead">${copy(leadKey)}</p><div class="introFacts">${factKeys.map(key => `<span>${key.startsWith('UI.') ? ui(key.slice(3)) : copy(key)}</span>`).join('')}</div></div>`;
  }

  function lesson07(state) {
    if (state === 'intro') return intro(COURSES.lesson07, '산 · 몸 · 공 · 물', 'l07IntroLead', ['l07Duration','l07Steps','UI.firstXp']);
    if (state === 'resume') return `<aside class="resumeNotice" role="status"><strong>${ui('resume')}</strong>${copy('l07Resume')}</aside>${lesson07('example')}`;
    if (state === 'explain') return `<p class="surfaceLabel">${copy('l07ExplainTag')}</p><h1>${copy('l07ExplainTitle')}</h1><p class="lessonLead">${copy('l07ExplainLead')}</p><div class="teachingGrid"><div class="koreanFocus" aria-label="${copy('l07HangulAria')}">산</div><div class="teachingNotes"><div class="teachingNote"><small>${copy('split')}</small><strong class="koreanText">사 + ㄴ</strong></div><div class="teachingNote"><small>${copy('final')}</small><strong>${copy('l07FinalNote')}</strong></div><div class="teachingNote"><small>${copy('fullWord')}</small><strong>${copy('l07WordNote')}</strong></div></div></div>`;
    if (state === 'example' || state === 'audio-unavailable') return `<p class="surfaceLabel">${copy('l07ExampleTag')}</p><h1 class="koreanText">산</h1><p class="lessonLead">${copy('l07ExampleLead')}</p><div class="teachingGrid"><div class="koreanFocus">산</div><div class="teachingNotes"><div class="teachingNote"><small>${copy('syllableStructure')}</small><strong class="koreanText">사 + ㄴ</strong></div><div class="teachingNote"><small>${copy('mouthAction')}</small><strong>${copy('tongueClose')}</strong></div>${audioLine(state !== 'audio-unavailable', copy('l07AudioLabel'))}</div></div>`;
    if (state === 'choice' || state === 'choice-correct') {
      const correct = state === 'choice-correct' || answerState === 'correct';
      return `<p class="surfaceLabel">${copy('l07ChoiceTag')}</p><h1 class="questionPrompt">${copy('l07ChoiceTitle')}</h1><p class="lessonLead">${copy('l07ChoiceLead')}</p><div class="questionBlock"><div class="choiceList">${[['사 + ㄴ',true],['산 + ㅇ',false],['ㅅ + 안',false]].map(([label,isCorrect],i)=>`<button class="choiceButton ${answerState || state === 'choice-correct' ? isCorrect ? 'isCorrect' : answerState === `wrong-${i}` ? 'isWrong' : '' : ''}" type="button" data-action="choose" data-correct="${isCorrect}" data-index="${i}" aria-pressed="${answerState === (isCorrect ? 'correct' : `wrong-${i}`)}"><span class="choiceIndex">${i+1}</span><span class="optionKorean">${label}</span></button>`).join('')}</div>${correct ? feedback(true,copy('l07Correct')) : answerState ? feedback(false,copy('l07Wrong')) : ''}</div>`;
    }
    if (state === 'build') return buildView('l07BuildTitle', 'l07BuildLead', ['사','ㄴ'], ['모','ㅇ','사','ㄴ']);
    return completionView('l07CompleteTitle', '산 · 몸 · 공 · 물', ['l07Mastery1','l07Mastery2','l07Mastery3'], state === 'complete-repeat');
  }

  function lesson11(state) {
    if (state === 'intro') return intro(COURSES.lesson11, '이름이 뭐예요?', 'l11IntroLead', ['l11Duration','l11Steps','UI.firstXp']);
    if (state === 'dialogue') return `<p class="surfaceLabel">${copy('l11DialogueTag')}</p><h1 class="koreanText">이름이 뭐예요?</h1><p class="lessonLead">${copy('l11DialogueLead')}</p><div class="dialogueBlock"><div class="dialogueLine"><span class="speakerMark">A</span><div class="speech"><strong>안녕하세요.</strong><span>${copy('hello')}</span></div></div><div class="dialogueLine fromB"><div class="speech"><strong>안녕하세요. 이름이 뭐예요?</strong><span>${copy('askName')}</span></div><span class="speakerMark">B</span></div><div class="dialogueLine"><span class="speakerMark">A</span><div class="speech"><strong>저는 하늘이에요.</strong><span>${copy('haneulIntro')}</span></div></div></div>${audioLine(false, copy('fullDialogue'))}`;
    if (state === 'choice' || state === 'wrong' || state === 'retry') {
      const wrong = state === 'wrong' || answerState.startsWith('wrong');
      const retry = state === 'retry';
      return `${retry ? `<div class="retryStrip"><span>${ui('retryTitle')}</span><strong>${copy('remainingOne')}</strong></div>` : ''}<p class="surfaceLabel">${retry ? ui('retryTitle') : copy('l11SceneChoice')} · ${copy('politeResponse')}</p><h1 class="questionPrompt koreanText">이름이 뭐예요?</h1><p class="lessonLead">${copy('l11ChoiceLead')}</p><div class="questionBlock"><div class="choiceList">${[['저는 하늘이에요.',true],['네, 학생이 아니에요.',false],['어디에서 왔어요?',false]].map(([label,isCorrect],i)=>`<button class="choiceButton ${answerState || wrong ? isCorrect && answerState === 'correct' ? 'isCorrect' : (!isCorrect && (answerState === `wrong-${i}` || (wrong && i === 1))) ? 'isWrong' : '' : ''}" type="button" data-action="choose" data-correct="${isCorrect}" data-index="${i}"><span class="choiceIndex">${i+1}</span><span class="optionKorean">${label}</span></button>`).join('')}</div>${answerState === 'correct' ? feedback(true,copy('l11Correct')) : wrong ? feedback(false,copy('l11Wrong')) : ''}</div>`;
    }
    if (state === 'build' || state === 'correct') return buildView('l11BuildTitle', 'l11BuildLead', ['저는','하늘','이에요'], ['이에요','저는','학생','하늘'], state === 'correct');
    return completionView('l11CompleteTitle', '저는 하늘이에요.', ['l11Mastery1','l11Mastery2','l11Mastery3'], state === 'complete-repeat');
  }

  function lesson10(state) {
    if (state === 'intro') return intro(COURSES.lesson10, 'K0 복습', 'l10IntroLead', ['l10Duration','l10Steps','l10Checkpoint']);
    if (state === 'choice' || state === 'wrong' || state === 'retry') {
      const wrong = state === 'wrong' || answerState.startsWith('wrong');
      const options = [[copy('l10Option1'),true],[copy('l10Option2'),false],[copy('l10Option3'),false]];
      return `${state === 'retry' ? `<div class="retryStrip"><span>${ui('retryTitle')}</span><strong>${copy('remainingOne')}</strong></div>` : ''}<p class="surfaceLabel">${copy('l10ChoiceTag')}</p><h1 class="questionPrompt">${copy('l10ChoiceTitle')}</h1><p class="lessonLead">${copy('l10ChoiceLead')}</p><div class="questionBlock"><div class="choiceList">${options.map(([label,isCorrect],i)=>`<button class="choiceButton ${answerState || wrong ? isCorrect && answerState === 'correct' ? 'isCorrect' : (!isCorrect && (answerState === `wrong-${i}` || (wrong && i === 1))) ? 'isWrong' : '' : ''}" type="button" data-action="choose" data-correct="${isCorrect}" data-index="${i}"><span class="choiceIndex">${i+1}</span><span>${label}</span></button>`).join('')}</div>${answerState === 'correct' ? feedback(true,copy('l10Correct')) : wrong ? feedback(false,copy('l10Wrong')) : ''}</div>`;
    }
    if (state === 'build') return buildView('l10BuildTitle', 'l10BuildLead', ['ㅂ','ㅏ'], ['ㅏ','ㅍ','ㅂ','ㅗ']);
    return completionView('l10CompleteTitle', '한글 기초', ['l10Mastery1','l10Mastery2','l10Mastery3'], state === 'complete-repeat');
  }

  function lesson06(state) {
    if (state === 'gate') return intro(COURSES.lesson06, 'ㅘ = ㅗ + ㅏ', 'l06IntroLead', ['l06Fact1','l06Fact2','l06Fact3'], true);
    return `<aside class="gateNotice" role="status"><strong>${copy('l06AvailableTitle')}</strong>${copy('l06AvailableBody')}</aside><div class="completion"><div class="completionMark" aria-hidden="true">◇</div><p class="surfaceLabel">${copy('previewSummary')}</p><h1>${copy('l06PreviewTitle')}</h1><p class="completionKorean">ㅘ · ㅝ · ㅢ</p><ul class="masteryList"><li><b>✓</b><span>${copy('l06Mastery1')}</span></li><li><b>✓</b><span>${copy('l06Mastery2')}</span></li><li><b>◇</b><span>${copy('l06Mastery3')}</span></li></ul><div class="rewardLine">${copy('l06Reward')}</div></div>`;
  }

  function buildView(titleKey, leadKey, expected, available, forcedCorrect = false) {
    const placed = forcedCorrect ? expected : buildTokens;
    const isComplete = placed.length === expected.length;
    const isCorrect = isComplete && expected.every((token,index) => placed[index] === token);
    return `<p class="surfaceLabel">${copy('buildTag')}</p><h1>${copy(titleKey)}</h1><p class="lessonLead">${copy(leadKey)}</p><div class="buildArea"><section class="answerZone ${isComplete ? isCorrect ? 'isCorrect' : 'isWrong' : ''}" aria-label="${ui('answerZone')}"><div class="answerLabel"><span>${ui('answerZone')}</span><span>${placed.length}/${expected.length}</span></div><div class="answerTokens">${placed.map((token,index)=>`<button class="placedToken" type="button" data-action="remove-token" data-index="${index}">${token}</button>`).join('')}${Array.from({length:Math.max(0,expected.length-placed.length)},()=>`<span class="emptyToken">${ui('empty')}</span>`).join('')}</div></section>${isComplete ? feedback(isCorrect, copy(isCorrect ? 'buildCorrect' : 'buildWrong')) : ''}<span class="tokenBankLabel">${ui('available')}</span><div class="tokenBank">${available.map(token=>`<button class="tokenButton" type="button" data-action="add-token" data-token="${token}" ${placed.includes(token) || placed.length >= expected.length ? 'disabled' : ''}>${token}</button>`).join('')}</div></div>`;
  }

  function completionView(titleKey, korean, itemKeys, repeat) {
    return `<div class="completion"><div class="completionMark" aria-hidden="true">✓</div><p class="surfaceLabel">${ui('courseSummary')}</p><h1>${copy(titleKey)}</h1><p class="completionKorean">${korean}</p><ul class="masteryList">${itemKeys.map(key=>`<li><b>✓</b><span>${copy(key)}</span></li>`).join('')}</ul><div class="rewardLine">${ui(repeat ? 'repeatXp' : 'firstXp')} · ${ui('saved')}</div></div>`;
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
    history.replaceState({courseId, requestedState, language}, '', `${location.pathname}?${params.toString()}`);
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
    switcher.querySelector('[data-course-picker-label]').textContent = ui('coursePicker');
    switcher.querySelector('[data-state-picker-label]').textContent = ui('statePicker');
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
    document.querySelector('[data-language]').setAttribute('aria-label', ui('language'));
    document.querySelector('[data-language-label]').textContent = ui('language');
    document.querySelector('[data-skip-link]').textContent = ui('skip');
    document.querySelector('.wordmark').setAttribute('aria-label', ui('wordmark'));
    document.querySelector('.courseProgress').setAttribute('aria-label', ui('progress'));
    document.querySelector('.lessonContext').setAttribute('aria-label', ui('courseContext'));
    document.querySelector('[data-phase-list]').setAttribute('aria-label', ui('phaseList'));
    document.querySelector('.mobileContext').setAttribute('aria-label', ui('currentPosition'));
    document.querySelector('[data-exit-label]').textContent = ui('exitLabel');
    document.querySelector('[data-exit-title]').textContent = ui('exitTitle');
    document.querySelector('[data-exit-body]').textContent = ui('exitBody');
    document.querySelector('[data-exit-cancel]').textContent = ui('exitCancel');
    document.querySelector('[data-exit-confirm]').textContent = ui('exitConfirm');
    document.querySelectorAll('[data-action="exit"]')[0].setAttribute('aria-label', ui('back'));
    document.querySelectorAll('[data-action="exit"]')[0].querySelector('span:last-child').textContent = ui('back');
    document.querySelectorAll('[data-action="exit"]')[1].setAttribute('aria-label', ui('exit'));
    document.querySelector('[data-stage]').textContent = local(course.stage, `${course.stableId}.stage`);
    document.querySelector('[data-module]').textContent = local(course.module, `${course.stableId}.module`);
    document.querySelector('[data-lesson]').textContent = local(course.lesson, `${course.stableId}.lesson`);
    document.querySelector('[data-mobile-stage]').textContent = local(course.stage, `${course.stableId}.stage`);
    document.querySelector('[data-mobile-lesson]').textContent = local(course.lesson, `${course.stableId}.lesson`);
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

  document.querySelector('[data-language]').addEventListener('change', event => {
    if (!SUPPORTED.includes(event.target.value)) throw new Error(`Nikigo Shell unsupported language: ${event.target.value}`);
    language = event.target.value;
    render();
  });
  document.addEventListener('change', event => {
    if (event.target.matches('[data-course-switcher]')) { courseId=event.target.value; requestedState=COURSES[courseId].states[0]; answerState=''; buildTokens=[]; render(); }
    if (event.target.matches('[data-state-switcher]')) { requestedState=event.target.value; answerState=''; buildTokens=[]; render(); }
  });
  addEventListener('popstate', event => {
    if (event.state?.courseId && COURSES[event.state.courseId]) courseId=event.state.courseId;
    if (event.state?.requestedState) requestedState=event.state.requestedState;
    if (SUPPORTED.includes(event.state?.language)) language=event.state.language;
    render();
  });

  render();
})();
