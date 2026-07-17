(()=>{
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const qs=(s,r=document)=>r.querySelector(s),qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=(el,sel)=>el?.querySelector(sel)?.textContent.trim()||'';
  const lessonId=()=>qs('.lessonView .eyebrow')?.textContent.trim()||qs('.lessonView h2')?.textContent.trim()||'lesson';
  const key=s=>`nicki-v4-${lessonId()}-${s}`;
  const heading=name=>qsa('.lessonView h3').find(h=>h.textContent.trim()===name);
  const readJSON=(k,d=[])=>{try{return JSON.parse(localStorage.getItem(k)||JSON.stringify(d))}catch{return d}};
  const saveJSON=(k,v)=>localStorage.setItem(k,JSON.stringify(v));

  function collectPairs(){
    const seen=new Set(),pairs=[];
    qsa('.lessonView .krow').forEach(row=>{
      const ko=txt(row,'.ko').replace(/\s+/g,' ').trim(),zh=txt(row,'.zh').replace(/\s+/g,' ').trim();
      if(ko&&zh&&!seen.has(ko)){seen.add(ko);pairs.push({ko,zh})}
    });
    return pairs;
  }

  function speak(text){
    if(!('speechSynthesis'in window))return alert('当前浏览器不支持发音');
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=.78;u.pitch=1;speechSynthesis.speak(u);
  }

  function upgradeTraining(){
    const h=heading('跟读训练');if(!h||h.dataset.upgraded)return;h.dataset.upgraded='1';
    const old=h.nextElementSibling,pairs=collectPairs(),task=old?.querySelector('li:nth-child(4)')?.textContent.trim()||'使用本课表达完成一次独立输出。';
    const targets=pairs.slice(0,Math.min(5,pairs.length));
    const state=readJSON(key('shadow-state'),{listen:0,repeat:{},blind:0,output:'',record:0,completed:[]});
    state.repeat=state.repeat||{};state.completed=state.completed||[];
    const steps=[
      {id:'listen',title:'① 听音辨形',desc:'先不看罗马音和中文，只听本课目标内容。每条至少播放 1 次。',pass:()=>state.listen>=targets.length},
      {id:'repeat',title:'② 逐条模仿',desc:'听一句、暂停、跟读一句。每条累计跟读 3 次后自动达标。',pass:()=>targets.length>0&&targets.every((_,i)=>(state.repeat[i]||0)>=3)},
      {id:'blind',title:'③ 脱离辅助',desc:'遮住罗马音和中文，只看韩文朗读并回忆意思。至少完成 3 条。',pass:()=>state.blind>=Math.min(3,targets.length)},
      {id:'output',title:'④ 情景输出',desc:task+' 请写下或口头说出至少 3 句，再进行自检。',pass:()=>state.output.trim().length>=8},
      {id:'record',title:'⑤ 录音复盘',desc:'使用下方任意“开始跟读”按钮录音并评分。达到 80 分，或完成两次录音比较。',pass:()=>state.record>=1}
    ];
    const wrap=document.createElement('div');wrap.className='shadowTrainer';old?.replaceWith(wrap);

    function persist(){state.completed=steps.filter(s=>s.pass()).map(s=>s.id);saveJSON(key('shadow-state'),state);renderHeader();renderSteps();}
    function renderHeader(){
      const done=steps.filter(s=>s.pass()).length;
      const head=qs('.shadowHeader',wrap);if(head)head.innerHTML=`<div><b>互动跟读训练</b><small>完成操作后自动解锁，不需要手动勾选</small></div><strong>${done} / 5</strong>`;
      const bar=qs('.shadowBar i',wrap);if(bar)bar.style.width=`${done/5*100}%`;
    }
    function targetRows(mode){return targets.map((p,i)=>{
      const count=state.repeat[i]||0;
      if(mode==='listen')return `<div class="shadowTarget"><span lang="ko">${p.ko}</span><button class="miniAction listenAction" data-i="${i}" type="button">▶ 播放</button></div>`;
      if(mode==='repeat')return `<div class="shadowTarget repeatTarget"><div><span lang="ko">${p.ko}</span><small>${p.zh}</small></div><div class="repeatControls"><button class="miniAction playRepeat" data-i="${i}" type="button">▶ 听</button><button class="repeatTap" data-i="${i}" type="button">我已跟读 <b>${count}/3</b></button></div></div>`;
      return `<button class="blindCard ${i<state.blind?'revealed':''}" data-i="${i}" type="button"><span lang="ko">${p.ko}</span><small>${i<state.blind?p.zh:'先说意思，再点击核对'}</small></button>`
    }).join('')}
    function renderSteps(){
      const body=qs('.shadowSteps',wrap);if(!body)return;
      body.innerHTML=steps.map((s,idx)=>`<section class="shadowStep ${s.pass()?'done':''}" data-step="${s.id}"><button class="shadowStepHead" type="button"><span>${s.title}</span><em>${s.pass()?'✓ 已达标':'展开训练'}</em></button><div class="shadowStepBody" ${idx?'hidden':''}><p>${s.desc}</p>${s.id==='listen'?`<div class="targetList">${targetRows('listen')}</div><div class="stepStatus">已播放 ${state.listen} / ${targets.length} 条</div>`:''}${s.id==='repeat'?`<div class="targetList">${targetRows('repeat')}</div>`:''}${s.id==='blind'?`<div class="blindGrid">${targetRows('blind')}</div><div class="stepStatus">已核对 ${state.blind} / ${Math.min(3,targets.length)} 条</div>`:''}${s.id==='output'?`<textarea class="outputPractice" placeholder="例如：写下3句使用本课表达的韩语…">${state.output||''}</textarea><button class="saveOutput primaryMini" type="button">保存并检查</button><div class="stepStatus">至少输入 8 个字符</div>`:''}${s.id==='record'?`<div class="recordGuide"><p>请滚动到任意句子的录音按钮，完成一次录音评分后返回这里。</p><button class="confirmRecord primaryMini" type="button">我已完成录音练习</button></div>`:''}</div></section>`).join('');
      qsa('.shadowStepHead',body).forEach(b=>b.onclick=()=>{const panel=b.nextElementSibling;panel.hidden=!panel.hidden});
      qsa('.listenAction',body).forEach(b=>b.onclick=()=>{const i=+b.dataset.i;speak(targets[i].ko);if(!b.dataset.done){b.dataset.done='1';state.listen++;b.textContent='✓ 已播放';persist()}});
      qsa('.playRepeat',body).forEach(b=>b.onclick=()=>speak(targets[+b.dataset.i].ko));
      qsa('.repeatTap',body).forEach(b=>b.onclick=()=>{const i=+b.dataset.i;state.repeat[i]=Math.min(3,(state.repeat[i]||0)+1);persist()});
      qsa('.blindCard',body).forEach(b=>b.onclick=()=>{const i=+b.dataset.i;if(i>=state.blind)state.blind=Math.min(targets.length,state.blind+1);persist()});
      const out=qs('.outputPractice',body),save=qs('.saveOutput',body);if(save)save.onclick=()=>{state.output=out.value.trim();persist()};
      const rec=qs('.confirmRecord',body);if(rec)rec.onclick=()=>{state.record=Math.max(1,state.record+1);persist()};
    }
    wrap.innerHTML='<div class="shadowHeader"></div><div class="shadowBar"><i></i></div><div class="shadowSteps"></div><div class="lessonStandard">达标规则：互动跟读完成至少 4/5 项，并在每日小测达到 80 分。</div>';
    renderHeader();renderSteps();
  }

  function makeQuestions(pairs){const usable=pairs.slice(0,8);if(usable.length<2)return[];return shuffle(usable).slice(0,3).map((p,i)=>{const d=shuffle(usable.filter(x=>x.zh!==p.zh)).slice(0,2).map(x=>x.zh);return{type:i===1?'listen':'meaning',prompt:i===1?'点击播放后，选择你听到句子的意思：':`“${p.ko}”是什么意思？`,target:p.ko,answer:p.zh,options:shuffle([p.zh,...d])}})}
  function upgradeQuiz(){
    const h=heading('每日小测');if(!h||h.dataset.upgraded)return;h.dataset.upgraded='1';const old=h.nextElementSibling,questions=makeQuestions(collectPairs()),box=document.createElement('div');box.className='dailyQuiz';old?.replaceWith(box);
    const ch=heading('完成标准');if(ch){const card=ch.nextElementSibling;ch.remove();card?.remove()}
    if(!questions.length){box.innerHTML='<p>本课内容不足以生成互动题目。</p>';return}
    let index=0,score=0,locked=false;
    function render(){const q=questions[index];locked=false;box.innerHTML=`<div><b>每日互动小测</b><span style="float:right">${index+1} / ${questions.length}</span></div><div class="quizProgress"><i style="width:${index/questions.length*100}%"></i></div><div class="quizQuestion"><h4>${q.prompt}</h4>${q.type==='listen'?`<button class="speak" data-speak="${q.target.replace(/"/g,'&quot;')}" aria-label="播放题目发音"></button>`:''}<div class="quizAnswers">${q.options.map(o=>`<button type="button" data-option="${o.replace(/"/g,'&quot;')}">${o}</button>`).join('')}</div><p class="quizFeedback"></p></div><div class="lessonStandard">三题总分达到 80 分，并完成至少 4 项互动跟读，即达到本课完成标准。</div>`;qsa('[data-option]',box).forEach(btn=>btn.onclick=()=>{if(locked)return;locked=true;const right=btn.dataset.option===q.answer;if(right){score++;btn.classList.add('correct')}else{btn.classList.add('wrong');qsa('[data-option]',box).find(x=>x.dataset.option===q.answer)?.classList.add('correct')}qs('.quizFeedback',box).textContent=right?'✓ 回答正确！':'正确答案：'+q.answer;setTimeout(()=>{index++;index<questions.length?render():result()},850)})}
    function result(){const pct=Math.round(score/questions.length*100),training=readJSON(key('shadow-state'),{}).completed?.length||0,pass=pct>=80&&training>=4;localStorage.setItem(key('quiz-score'),String(pct));box.innerHTML=`<div class="quizResult"><div class="quizScore">${pct}</div><h4>${pass?'本课达标':'继续练习后再挑战'}</h4><p>答对 ${score} / ${questions.length} 题 · 跟读完成 ${training} / 5 项</p><span class="passBadge">${pass?'✓ 已达到完成标准':pct<80?'小测需达到 80 分':'跟读训练需完成至少 4 项'}</span><br><button class="retryQuiz" type="button">重新测试</button></div>`;qs('.retryQuiz',box).onclick=()=>{index=0;score=0;render()}}
    render();
  }
  function upgrade(){if(!qs('.lessonView'))return;upgradeTraining();upgradeQuiz()}
  new MutationObserver(upgrade).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',e=>{const b=e.target.closest('.speak');if(!b)return;b.classList.add('is-playing');setTimeout(()=>b.classList.remove('is-playing'),1200)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade);else upgrade();
})();