(()=>{
  const PREF='nicki-v4-study-assist';
  const state=Object.assign({showAll:false,immersion:false},(()=>{try{return JSON.parse(localStorage.getItem(PREF)||'{}')}catch{return{}}})());
  const save=()=>localStorage.setItem(PREF,JSON.stringify(state));

  const INITIAL=['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
  const MEDIAL=['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
  const FINAL=['','k','k','ks','n','nj','nh','t','l','lk','lm','lb','ls','lt','lp','lh','m','p','ps','t','t','ng','t','t','k','t','p','h'];

  function romanize(text){
    return [...(text||'')].map(ch=>{
      const code=ch.charCodeAt(0)-0xAC00;
      if(code<0||code>11171)return ch;
      const i=Math.floor(code/588),m=Math.floor((code%588)/28),f=code%28;
      return INITIAL[i]+MEDIAL[m]+FINAL[f];
    }).join('').replace(/\s+/g,' ').trim();
  }

  function applyState(root=document){
    root.querySelectorAll('.romanizationReveal').forEach(el=>{
      const manual=el.dataset.open==='1';
      el.classList.toggle('revealed',state.showAll||manual);
      el.setAttribute('aria-expanded',String(state.showAll||manual));
    });
    document.body.classList.toggle('immersionMode',!!state.immersion);
    document.querySelectorAll('[data-assist-showall]').forEach(b=>b.textContent=state.showAll?'🙈 隐藏全部拼音':'👁 显示全部拼音');
    document.querySelectorAll('[data-assist-immersion]').forEach(b=>b.textContent=state.immersion?'退出沉浸模式':'进入沉浸模式');
  }

  function addToolbar(){
    const lesson=document.querySelector('.lessonView');
    if(!lesson||lesson.querySelector('.studyAssistBar'))return;
    const bar=document.createElement('div');
    bar.className='studyAssistBar';
    bar.innerHTML=`<div><b>学习辅助</b><span>拼音默认遮蔽，轻触可查看</span></div><div class="studyAssistActions"><button type="button" data-assist-showall></button><button type="button" data-assist-immersion></button></div>`;
    const heading=lesson.querySelector('h2');
    (heading||lesson.firstChild).insertAdjacentElement('afterend',bar);
    applyState(bar);
  }

  function inject(root=document){
    root.querySelectorAll('[data-speak]:not([data-roman-ready])').forEach(btn=>{
      btn.dataset.romanReady='1';
      const target=(btn.dataset.speak||'').trim();
      if(!target||!/[가-힣]/.test(target))return;
      const row=btn.closest('.krow')||btn.parentElement;
      if(!row||row.querySelector('.romanizationReveal'))return;
      const box=document.createElement('button');
      box.type='button';
      box.className='romanizationReveal';
      box.dataset.open='0';
      box.setAttribute('aria-label','显示或隐藏韩语拼音');
      box.innerHTML=`<span class="romanLabel">韩语拼音 · 轻触显示</span><span class="romanText">${romanize(target)}</span>`;
      const ko=row.querySelector('.ko');
      if(ko)ko.insertAdjacentElement('afterend',box);else btn.insertAdjacentElement('beforebegin',box);
    });
    addToolbar();
    applyState(root);
  }

  document.addEventListener('click',e=>{
    const roman=e.target.closest('.romanizationReveal');
    if(roman){
      roman.dataset.open=roman.dataset.open==='1'?'0':'1';
      applyState();
      return;
    }
    if(e.target.closest('[data-assist-showall]')){
      state.showAll=!state.showAll;save();applyState();return;
    }
    if(e.target.closest('[data-assist-immersion]')){
      state.immersion=!state.immersion;
      if(state.immersion)state.showAll=false;
      save();applyState();return;
    }
  });

  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType===1)inject(n.matches?.('.lessonView')?n:n);
  }))).observe(document.documentElement,{childList:true,subtree:true});

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>inject());else inject();
})();