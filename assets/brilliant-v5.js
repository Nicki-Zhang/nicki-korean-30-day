(()=>{
  const qs=(s,r=document)=>r.querySelector(s),qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const doneSet=()=>{try{return new Set(JSON.parse(localStorage.getItem('nicki-v3-ko-done')||'[]'))}catch{return new Set()}};
  function enhanceStage(){
    const grid=qs('.dayGrid');if(!grid||grid.dataset.v5)return;grid.dataset.v5='1';
    const cards=qsa('.dayCard',grid),done=doneSet();
    const current=Math.min(cards.length-1,[...Array(cards.length).keys()].find(i=>!done.has(+cards[i].dataset.day))??cards.length-1);
    const title=qs('.sectionHead h2')?.textContent||'韩语课程';
    const goal=qs('.sectionHead p:last-child')?.textContent||'逐步完成每天的学习任务';
    const wrap=document.createElement('div');wrap.className='v5Journey';
    const left=document.createElement('aside');left.className='v5CourseCard';left.innerHTML=`<div class="v5CourseIcon">🇰🇷</div><h2>${title}</h2><p>${goal}</p><div class="v5Stats"><span>◉ ${cards.length} Lessons</span><span>✦ ${cards.length*5} Missions</span></div>`;
    const map=document.createElement('div');map.className='v5Map';
    map.innerHTML=`<div class="v5LevelBanner"><small>Level ${Math.floor((+cards[0]?.dataset.day||0)/30)+1}</small><b>${title}</b></div>`+cards.map((c,i)=>{
      const d=+c.dataset.day,isDone=done.has(d),isCurrent=i===current,isLocked=!isDone&&!isCurrent;
      const label=c.querySelector('b')?.textContent||`Day ${d+1}`;
      return `<div class="v5NodeRow ${isDone?'complete':isCurrent?'current':'locked'}"><button class="v5Node ${isDone?'complete':isCurrent?'current':'locked'}" data-open-day="${d}" ${isLocked?'disabled':''}>${isDone?'✓':isCurrent?'▶':'🔒'}</button><div class="v5NodeLabel"><b>${label}</b><small>${isDone?'已完成':isCurrent?'当前课程':'完成上一课后解锁'}</small></div></div>`
    }).join('');
    const dock=document.createElement('div');dock.className='v5StartDock';const curCard=cards[current];dock.innerHTML=`<h3>${curCard?.querySelector('b')?.textContent||'继续学习'}</h3><button type="button" data-start-day="${curCard?.dataset.day||0}">Start</button>`;
    grid.replaceWith(wrap);wrap.append(left,map);map.append(dock);
    qsa('[data-open-day]',wrap).forEach(b=>b.onclick=()=>curCardClick(cards,+b.dataset.openDay));
    qs('[data-start-day]',wrap).onclick=()=>curCardClick(cards,+qs('[data-start-day]',wrap).dataset.startDay);
  }
  function curCardClick(cards,day){const card=cards.find(c=>+c.dataset.day===day);card?.click()}
  function enhanceLesson(){
    const lesson=qs('.lessonView');if(!lesson||lesson.dataset.v5)return;lesson.dataset.v5='1';
    const h2=qs('h2',lesson);if(!h2)return;
    const strip=document.createElement('div');strip.className='v5MissionStrip';
    const names=['词汇','发音','对话','跟读','小测'];
    strip.innerHTML=names.map((n,i)=>`<div class="v5Mission ${i===0?'active':''}"><span>${i+1}</span><br>${n}</div>`).join('');
    h2.insertAdjacentElement('afterend',strip);
    const heads=qsa('h3',lesson);
    const missionMap={'发音与词汇':0,'语言要点':0,'核心表达':1,'情景对话':2,'跟读训练':3,'每日小测':4};
    const obs=new IntersectionObserver(entries=>{
      const visible=entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];if(!visible)return;
      const idx=missionMap[visible.target.textContent.trim()];if(idx===undefined)return;
      qsa('.v5Mission',strip).forEach((m,i)=>m.classList.toggle('active',i===idx));
    },{threshold:.35,rootMargin:'-15% 0px -55%'});
    heads.forEach(h=>{if(missionMap[h.textContent.trim()]!==undefined)obs.observe(h)});
  }
  function enhanceDashboard(){
    qsa('.stageRow').forEach((r,i)=>{if(r.dataset.v5)return;r.dataset.v5='1';const small=r.querySelector('small');if(small&&!small.textContent.includes('Missions'))small.textContent+=' · 150 Missions'});
  }
  function run(){enhanceDashboard();enhanceStage();enhanceLesson()}
  new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',run);else run();
})();