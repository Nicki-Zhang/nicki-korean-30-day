(function () {
  'use strict';

  const stage = document.getElementById('lessonStage');
  const count = document.getElementById('progressCount');
  if (!stage || !count) return;

  const language = () => ['zh','en','vi','ja'].includes(document.getElementById('language')?.value) ? document.getElementById('language').value : 'en';
  const copy = {
    zh:{dialogue:'逐句对话',line:'第 {current} 句，共 {total} 句',nextLine:'下一句',allLines:'已读完整段对话',mastered:'本课掌握'},
    en:{dialogue:'Line-by-line dialogue',line:'Line {current} of {total}',nextLine:'Next line',allLines:'Full dialogue reviewed',mastered:'What you mastered'},
    vi:{dialogue:'Hội thoại từng câu',line:'Câu {current} / {total}',nextLine:'Câu tiếp theo',allLines:'Đã xem toàn bộ hội thoại',mastered:'Bạn đã nắm vững'},
    ja:{dialogue:'一文ずつの会話',line:'{total}文中 {current}文目',nextLine:'次の文',allLines:'会話全体を確認しました',mastered:'今回身につけたこと'}
  };
  const lineProgress = new Map();
  let syncing = false;

  function format(value,data){return value.replace(/\{(\w+)\}/g,(_,key)=>data[key]);}
  function masteryItems(course){
    if(course==='lesson-11')return ['이름이 뭐예요?','저는 하늘이에요.','학생이에요.'];
    if(course==='lesson-13')return ['하나 · 둘 · 셋 · 넷 · 다섯','한 개 · 두 개 · 세 개 · 네 개','몇 개예요?'];
    return ['다 · 타 · 따','바 · 파 · 빠','자 · 차 · 짜'];
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
    bubbles.forEach((bubble,bubbleIndex)=>bubble.classList.toggle('pilotCurrentLine',bubbleIndex===active));
    const languageCopy=copy[language()];
    dialogue.insertAdjacentHTML('beforebegin',`<div class="pilotDialogueMeta"><span>${languageCopy.dialogue}</span><span>${format(languageCopy.line,{current:active+1,total:bubbles.length})}</span></div>`);
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
    if(type!=='concept')document.body.classList.remove('pilotDialoguePending');
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
    stage.querySelector('.pilotLineControls')?.remove();
    const dialogue=stage.querySelector('.dialogue');
    if(dialogue)delete dialogue.dataset.pilotEnhanced;
    syncExperienceState();
  });
  syncExperienceState();
})();
