(function (global) {
  'use strict';

  const koreanTitles = Object.freeze({
    'lesson-00':'한글 지도', 'lesson-01':'기본 모음', 'lesson-02':'모음 더 배우기',
    'lesson-03':'기본 자음', 'lesson-04':'평음 · 격음 · 경음', 'lesson-05':'음절 블록',
    'lesson-06':'이중 모음', 'lesson-07':'기본 받침', 'lesson-08':'받침과 음운 변화',
    'lesson-09':'인사와 소개', 'lesson-10':'K0 복습', 'lesson-11':'이름과 신분',
    'lesson-12':'나라와 언어', 'lesson-13':'고유어 수 1–10'
  });

  function syncMissionKorean() {
    const action = document.querySelector('.clearContinue .mission .primary');
    const target = document.getElementById('missionKorean');
    if (!action || !target) return;
    const nextTitle = koreanTitles[action.dataset.lesson] || '';
    if (target.textContent !== nextTitle) target.textContent = nextTitle;
  }

  const root = document.getElementById('dashboard');
  if (root) new MutationObserver(syncMissionKorean).observe(root,{subtree:true,childList:true,attributes:true});
  global.addEventListener('hashchange',syncMissionKorean);
  global.addEventListener('load',syncMissionKorean);
  syncMissionKorean();
})(window);
