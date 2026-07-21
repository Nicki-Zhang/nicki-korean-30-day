(function () {
  'use strict';

  const stage = document.getElementById('lessonStage');
  const count = document.getElementById('progressCount');
  if (!stage || !count) return;

  const language = () => ['zh','en','vi','ja'].includes(document.getElementById('language')?.value) ? document.getElementById('language').value : 'en';
  const copy = {
    zh:{dialogue:'逐句对话',line:'第 {current} 句，共 {total} 句',nextLine:'继续对话',allLines:'已读完整段对话',mastered:'本课掌握',time:'约8分钟',route:'任务路线',routeSteps:'见面 · 对话 · 表达',start:'开始任务',speakerA:'지수 · 新同学',speakerB:'하늘 · 学习者',current:'正在说话'},
    en:{dialogue:'Line-by-line dialogue',line:'Line {current} of {total}',nextLine:'Continue dialogue',allLines:'Full dialogue reviewed',mastered:'What you mastered',time:'About 8 min',route:'Mission route',routeSteps:'Meet · Talk · Express',start:'Start mission',speakerA:'Jisu · New classmate',speakerB:'Haneul · Learner',current:'Speaking now'},
    vi:{dialogue:'Hội thoại từng câu',line:'Câu {current} / {total}',nextLine:'Tiếp tục hội thoại',allLines:'Đã xem toàn bộ hội thoại',mastered:'Bạn đã nắm vững',time:'Khoảng 8 phút',route:'Lộ trình nhiệm vụ',routeSteps:'Gặp · Nói · Diễn đạt',start:'Bắt đầu nhiệm vụ',speakerA:'Jisu · Bạn mới',speakerB:'Haneul · Người học',current:'Đang nói'},
    ja:{dialogue:'一文ずつの会話',line:'{total}文中 {current}文目',nextLine:'会話を続ける',allLines:'会話全体を確認しました',mastered:'今回身につけたこと',time:'約8分',route:'ミッションルート',routeSteps:'出会う · 話す · 表現する',start:'ミッション開始',speakerA:'ジス · 新しい仲間',speakerB:'ハヌル · 学習者',current:'今話している人'}
  };
  const lineProgress = new Map();
  let syncing = false;

  function format(value,data){return value.replace(/\{(\w+)\}/g,(_,key)=>data[key]);}
  function masteryItems(course){
    if(course==='lesson-11')return ['이름이 뭐예요?','저는 하늘이에요.','학생이에요.'];
    if(course==='lesson-13')return ['하나 · 둘 · 셋 · 넷 · 다섯','한 개 · 두 개 · 세 개 · 네 개','몇 개예요?'];
    return ['다 · 타 · 따','바 · 파 · 빠','자 · 차 · 짜'];
  }
  function enhanceOpening(index){
    if(document.body.dataset.pilotCourse!=='lesson-11'||index!==1)return;
    const card=stage.matches('.sprintCard')?stage:stage.querySelector('.sprintCard');
    if(!card||card.querySelector('.pilotSceneVisual'))return;
    const languageCopy=copy[language()];
    card.dataset.sceneEnhanced='true';
    const body=document.createElement('div');
    body.className='pilotSceneBody';
    [...card.children].forEach(child=>body.append(child));
    card.insertAdjacentHTML('afterbegin',`<div class="pilotSceneVisual"><img src="assets/seoul-night-hangang.jpg" alt="Seoul skyline and the Han River at night"><div class="pilotSceneCaption"><span><img src="assets/icons/clock.svg" alt="">${languageCopy.time}</span><span><img src="assets/icons/compass.svg" alt="">K1 · 11</span></div></div>`);
    const foot=body.querySelector('.foot');
    if(foot)foot.insertAdjacentHTML('beforebegin',`<div class="pilotRoutePreview"><span>${languageCopy.route}</span><strong>${languageCopy.routeSteps}</strong></div>`);
    const next=foot?.querySelector('[data-action="next"]');
    if(next)next.textContent=languageCopy.start;
    card.append(body);
  }
  function enhanceDialogue(index,type){
    if(document.body.dataset.pilotCourse!=='lesson-11'||type!=='concept')return;
    const dialogue=stage.querySelector('.dialogue');
    if(!dialogue||dialogue.dataset.pilotEnhanced==='true')return;
    const bubbles=[...dialogue.querySelectorAll('.bubble')];
    if(bubbles.length<2)return;
    const active=Math.min(lineProgress.get(index)||0,bubbles.length-1);
    document.body.classList.toggle('pilotDialoguePending',active<bubbles.length-1);
    dialogue.dataset.pilotEnhanced='true';
    dialogue.classList.add('pilotLineMode');
    const languageCopy=copy[language()];
    bubbles.forEach((bubble,bubbleIndex)=>{
      const role=bubble.querySelector(':scope>b')?.textContent?.trim()==='B'?'B':'A';
      bubble.classList.toggle('pilotCurrentLine',bubbleIndex===active);
      if(!bubble.querySelector('.pilotSpeaker'))bubble.insertAdjacentHTML('afterbegin',`<div class="pilotSpeaker"><span class="pilotAvatar"><img src="assets/icons/${role==='A'?'person-circle':'person-fill'}.svg" alt=""></span><span><b>${role==='A'?languageCopy.speakerA:languageCopy.speakerB}</b><small>${languageCopy.current}</small></span></div>`);
    });
    const activeRole=bubbles[active].querySelector(':scope>b')?.textContent?.trim()==='B'?'B':'A';
    dialogue.insertAdjacentHTML('beforebegin',`<div class="pilotDialogueCast"><div class="${activeRole==='A'?'active':''}"><img src="assets/icons/person-circle.svg" alt=""><span>${languageCopy.speakerA}</span></div><div class="${activeRole==='B'?'active':''}"><img src="assets/icons/person-fill.svg" alt=""><span>${languageCopy.speakerB}</span></div></div><div class="pilotDialogueMeta"><span>${languageCopy.dialogue}</span><span>${format(languageCopy.line,{current:active+1,total:bubbles.length})}</span></div>`);
    dialogue.insertAdjacentHTML('afterend',`<div class="pilotLineControls"><p>${active===bubbles.length-1?languageCopy.allLines:format(languageCopy.line,{current:active+1,total:bubbles.length})}</p>${active<bubbles.length-1?`<button class="pilotLineNext" type="button" data-action="pilot-next-line">${languageCopy.nextLine}</button>`:''}</div>`);
    const next=stage.querySelector('[data-action="next"]');
    if(next)next.disabled=active<bubbles.length-1;
  }
  function enhanceCompletion(){
    if(!document.body.classList.contains('pilotIsComplete')||stage.querySelector('.pilotMasterySummary'))return;
    const lead=stage.querySelector('.lead');
    if(!lead)return;
    const heading=copy[language()].mastered;
    const items=masteryItems(document.body.dataset.pilotCourse).map(item=>`<li>${item}</li>`).join('');
    lead.insertAdjacentHTML('afterend',`<section class="pilotMasterySummary"><h2>${heading}</h2><ul>${items}</ul></section>`);
  }
  function syncExperienceState() {
    if(syncing)return;
    syncing=true;
    const match = count.textContent.match(/(\d+)\s*\/\s*(\d+)/);
    const index = match ? Number(match[1]) : 1;
    const total = match ? Number(match[2]) : 1;
    const config = window.NikigoLessonConfig;
    const contrast = window.NikigoContrastLesson;
    let type = 'teaching';

    if (config?.steps?.[index - 1]) type = config.steps[index - 1].type;
    else if (contrast?.SCREENS?.[index - 1]) type = contrast.SCREENS[index - 1][0];

    stage.dataset.stepType = type;
    stage.dataset.stepIndex = String(index);
    stage.dataset.stepTotal = String(total);
    document.body.classList.toggle('pilotIsOpening', index === 1);
    document.body.classList.toggle('pilotIsComplete', type === 'complete');
    document.body.classList.toggle('pilotIsPractice', ['choice','scenario','listening','match','build','quiz','retry'].includes(type));
    document.body.classList.toggle('pilotSceneOpening',document.body.dataset.pilotCourse==='lesson-11'&&index===1);
    document.body.classList.toggle('pilotFocusedDialogue',document.body.dataset.pilotCourse==='lesson-11'&&type==='concept'&&Boolean(stage.querySelector('.dialogue')));
    if(type!=='concept')document.body.classList.remove('pilotDialoguePending');
    enhanceOpening(index);
    enhanceDialogue(index,type);
    enhanceCompletion();
    syncing=false;
  }

  const observer = new MutationObserver(syncExperienceState);
  observer.observe(stage, {childList:true, subtree:true, characterData:true});
  observer.observe(count, {childList:true, subtree:true, characterData:true});
  stage.addEventListener('click',event=>{
    const button=event.target.closest('[data-action="pilot-next-line"]');
    if(!button)return;
    const index=Number(stage.dataset.stepIndex)||1;
    lineProgress.set(index,(lineProgress.get(index)||0)+1);
    stage.querySelector('.pilotDialogueMeta')?.remove();
    stage.querySelector('.pilotDialogueCast')?.remove();
    stage.querySelector('.pilotLineControls')?.remove();
    const dialogue=stage.querySelector('.dialogue');
    if(dialogue)delete dialogue.dataset.pilotEnhanced;
    syncExperienceState();
  });
  syncExperienceState();
})();
