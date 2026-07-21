(function () {
  'use strict';
  const params = new URLSearchParams(location.search);
  if (params.get('experience') !== 'pilot') return;
  const supported = ['zh','en','vi','ja'];
  const profile = window.NikigoState?.get?.() || {};
  const language = supported.includes(params.get('lang')) ? params.get('lang') : supported.includes(profile.interfaceLanguage) ? profile.interfaceLanguage : 'zh';
  const copy = {
    zh:{mission:'今日韩国生活任务',title:'今晚，完成一次真正的初次见面',desc:'在首尔夜色里，学会询问姓名并礼貌介绍自己。',continue:'继续第11课',journey:'K1生活交流旅程',progress:'已完成 11 / 14 站',next:'下一站预告',nextTitle:'国家与语言',nextMeta:'第12课 · 约8分钟',free:'自由进入全部课程'},
    en:{mission:"Today's Korean life mission",title:'Complete a real first meeting tonight',desc:'In the Seoul night, ask a name and introduce yourself politely.',continue:'Continue Lesson 11',journey:'K1 Life Communication Journey',progress:'11 of 14 stops complete',next:'Next stop',nextTitle:'Countries and languages',nextMeta:'Lesson 12 · about 8 min',free:'Enter any lesson freely'},
    vi:{mission:'Nhiệm vụ đời sống Hàn Quốc hôm nay',title:'Hoàn thành một cuộc gặp đầu tiên tối nay',desc:'Trong đêm Seoul, hỏi tên và tự giới thiệu lịch sự.',continue:'Tiếp tục Bài 11',journey:'Hành trình giao tiếp đời sống K1',progress:'Đã hoàn thành 11 / 14 chặng',next:'Điểm đến tiếp theo',nextTitle:'Quốc gia và ngôn ngữ',nextMeta:'Bài 12 · khoảng 8 phút',free:'Tự do vào mọi bài học'},
    ja:{mission:'今日の韓国生活ミッション',title:'今夜、初対面の会話を一つ完成しよう',desc:'ソウルの夜を舞台に、名前を尋ねて丁寧に自己紹介します。',continue:'第11課を続ける',journey:'K1生活コミュニケーション',progress:'14地点中11地点を完了',next:'次の目的地',nextTitle:'国とことば',nextMeta:'第12課 · 約8分',free:'すべてのレッスンに自由に入る'}
  }[language];
  const progress = Math.max(78,Number(profile.lessonProgress?.['lesson-11'])||0);
  document.documentElement.lang=language==='zh'?'zh-CN':language;
  document.body.classList.add('pilotJourneyHome');
  const main=document.createElement('main');
  main.className='journeyHome';
  main.innerHTML=`<section class="nightHero"><img class="nightHeroPhoto" src="assets/seoul-night-hangang.jpg" alt="Seoul skyline and the Han River at night"><div class="nightHeroShade"></div><div class="nightHeroContent"><header class="nightTop"><div class="nightBrand"><img src="assets/nikigo-mark.svg" alt=""><span>Nikigo</span></div><div class="nightStats"><div class="nightStat"><b>${Number(profile.xp)||0}</b><span>XP</span></div><div class="nightStat"><b>${Number(profile.streakDays)||0}</b><span>STREAK</span></div></div></header><div class="nightMission"><p class="nightKicker"><img src="assets/icons/compass.svg" alt="">${copy.mission}</p><h1>${copy.title}<span class="nightMissionKorean">이름이 뭐예요?</span></h1><p>${copy.desc}</p><div class="nightActions"><a class="nightPrimary" href="lesson-11.html?lang=${encodeURIComponent(language)}&experience=pilot"><span>${copy.continue}</span><img src="assets/icons/arrow-right.svg" alt=""></a></div></div></div></section><section class="journeyPanel"><div class="journeyProgressHead"><div><small>${copy.journey}</small><b>${copy.progress}</b></div><strong>${progress}%</strong></div><div class="journeyProgressTrack"><i style="width:${progress}%"></i></div><div class="nextStop"><span class="nextStopIcon"><img src="assets/icons/compass.svg" alt=""></span><div><small>${copy.next}</small><b>${copy.nextTitle}</b></div><span>${copy.nextMeta}</span></div><a class="freeEntry" href="nikigo-app.html?lang=${encodeURIComponent(language)}#courses"><img src="assets/icons/unlock.svg" alt="">${copy.free}</a></section>`;
  document.body.append(main);
})();
