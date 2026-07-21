(function () {
  'use strict';

  const stage = document.getElementById('lessonStage');
  const count = document.getElementById('progressCount');
  if (!stage || !count) return;

  function syncExperienceState() {
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
  }

  const observer = new MutationObserver(syncExperienceState);
  observer.observe(stage, {childList:true, subtree:true, characterData:true});
  observer.observe(count, {childList:true, subtree:true, characterData:true});
  syncExperienceState();
})();
