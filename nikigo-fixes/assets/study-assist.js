(()=>{
  const PREF='nicki-v4-study-assist';
  const state=Object.assign({showAll:false,immersion:false},(()=>{try{return JSON.parse(localStorage.getItem(PREF)||'{}')}catch{return{}}})());
  const save=()=>localStorage.setItem(PREF,JSON.stringify(state));

  const CHO=['g','kk','n','d','tt','r','m','b','pp','s','ss','','j','jj','ch','k','t','p','h'];
  const JUNG=['a','ae','ya','yae','eo','e','yeo','ye','o','wa','wae','oe','yo','u','wo','we','wi','yu','eu','ui','i'];
  // 终声表：rep=独立/辅音前的代表音，remain=连音时保留的收音，onset=连音时移到下一音节的声母
  const JONG=[null,
   {rep:'k',remain:'',onset:'g'},{rep:'k',remain:'',onset:'kk'},{rep:'k',remain:'k',onset:'s'},
   {rep:'n',remain:'',onset:'n'},{rep:'n',remain:'n',onset:'j'},{rep:'n',remain:'',onset:'n'},
   {rep:'t',remain:'',onset:'d'},{rep:'l',remain:'',onset:'r'},{rep:'k',remain:'l',onset:'g'},
   {rep:'m',remain:'l',onset:'m'},{rep:'l',remain:'l',onset:'b'},{rep:'l',remain:'l',onset:'s'},
   {rep:'l',remain:'l',onset:'t'},{rep:'p',remain:'l',onset:'p'},{rep:'l',remain:'',onset:'r'},
   {rep:'m',remain:'',onset:'m'},{rep:'p',remain:'',onset:'b'},{rep:'p',remain:'p',onset:'s'},
   {rep:'t',remain:'',onset:'s'},{rep:'t',remain:'',onset:'ss'},{rep:'ng',remain:'ng',onset:''},
   {rep:'t',remain:'',onset:'j'},{rep:'t',remain:'',onset:'ch'},{rep:'k',remain:'',onset:'k'},
   {rep:'t',remain:'',onset:'t'},{rep:'p',remain:'',onset:'p'},{rep:'t',remain:'',onset:''}];

  function decompose(ch){
    const code=ch.charCodeAt(0)-0xAC00;
    if(code<0||code>11171)return null;
    return [Math.floor(code/588),Math.floor((code%588)/28),code%28];
  }

  // 按发音规则罗马音化一段连续的韩文（连音、鼻音化、ㄹ同化、ㅎ弱化、腭化）
  function romanizeRun(run){
    const parts=[];
    for(let s=0;s<run.length;s++){
      const syl=run[s],next=run[s+1]||null;
      const ci=syl[0],vi=syl[1],fi=syl[2];
      let onset=(syl.forcedOnset!==undefined)?syl.forcedOnset:CHO[ci];
      if(syl.forcedOnset===undefined&&ci===5){ // ㄹ 声母：收音 l 之后读 l
        const prev=parts[parts.length-1];
        if(prev&&/l$/.test(prev))onset='l';
      }
      let coda='';
      if(fi){
        const J=JONG[fi];
        if(next){
          const nc=next[0];
          if(nc===11){ // 下一音节零声母：连音
            coda=J.remain;
            let move=J.onset;
            if(fi===25&&JUNG[next[1]]==='i')move='ch'; // 같이 → gachi
            if(fi===7&&JUNG[next[1]]==='i')move='j';   // 굳이 → guji
            next.forcedOnset=move;
          }else{
            let rep=J.rep;
            if(fi===27){ // 收音 ㅎ + 辅音：送气或脱落
              if(nc===0){rep='';next.forcedOnset='k'}
              else if(nc===3){rep='';next.forcedOnset='t'}
              else if(nc===12){rep='';next.forcedOnset='ch'}
              else rep='t';
            }
            if(next.forcedOnset===undefined){
              if(nc===18&&/^[ktp]$/.test(rep)){next.forcedOnset=rep;rep=''} // 축하 → chuka
              else if(nc===5){ // 声母 ㄹ 的同化
                if(rep==='l')next.forcedOnset='l';
                else if(rep==='n'){rep='l';next.forcedOnset='l'} // 신라 → silla
                else{next.forcedOnset='n'; // 심리 → simni
                  if(rep==='k')rep='ng';else if(rep==='t')rep='n';else if(rep==='p')rep='m';}
              }
              else if(nc===2||nc===6){ // 鼻音化
                if(rep==='k')rep='ng';else if(rep==='t')rep='n';else if(rep==='p')rep='m';
                if(rep==='l'&&nc===2)next.forcedOnset='l'; // 실내 → silla e.g. 달나라
              }
            }
            coda=rep;
          }
        }else{
          coda=J.rep;
        }
      }
      parts.push(onset+JUNG[vi]+coda);
    }
    return parts.join('');
  }

  function romanize(text){
    const chars=[...(text||'')],out=[];
    let i=0;
    while(i<chars.length){
      const d=decompose(chars[i]);
      if(!d){out.push(chars[i]);i++;continue}
      const run=[];
      while(i<chars.length){const dd=decompose(chars[i]);if(!dd)break;run.push(dd);i++}
      out.push(romanizeRun(run));
    }
    return out.join('').replace(/\s+/g,' ').trim();
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