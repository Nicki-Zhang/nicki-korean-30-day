(()=>{
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const qs=(s,r=document)=>r.querySelector(s),qsa=(s,r=document)=>[...r.querySelectorAll(s)];
  const txt=(el,sel)=>el?.querySelector(sel)?.textContent.trim()||'';
  const legacyId=()=>qs('.lessonView .eyebrow')?.textContent.trim()||qs('.lessonView h2')?.textContent.trim()||'lesson';
  const lessonId=()=>window.currentLessonId||legacyId();
  const key=s=>`nicki-v4-${lessonId()}-${s}`;
  const legacyKey=s=>`nicki-v4-${legacyId()}-${s}`;
  function migrateLegacy(){
    if(!window.currentLessonId)return;
    ['shadow-state','quiz-score'].forEach(s=>{
      const nk=key(s),ok=legacyKey(s);
      if(nk!==ok&&localStorage.getItem(nk)===null){
        const v=localStorage.getItem(ok);
        if(v!==null)localStorage.setItem(nk,v);
      }
    });
  }
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
    if(window.nikigoSpeak)return window.nikigoSpeak(text);
    if(!('speechSynthesis'in window))return alert('当前浏览器不支持发音');
    speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=document.documentElement.dataset.speakLang||'ko-KR';u.rate=.78;u.pitch=1;speechSynthesis.speak(u);
  }

  function upgradeTraining(){
    const h=heading('跟读训练');if(!h||h.dataset.upgraded)return;h.dataset.upgraded='1';
    const old=h.nextElementSibling,pairs=collectPairs(),task=old?.querySelector('li:nth-child(4)')?.textContent.trim()||'使用本课表达完成一次独立输出。';
    const targets=pairs.slice(0,Math.min(5,pairs.length));
    const state=readJSON(key('shadow-state'),{listen:[],repeat:{},blind:[],output:'',record:0,completed:[],open:'repeat'});
    state.listen=Array.isArray(state.listen)?state.listen:[];
    state.blind=Array.isArray(state.blind)?state.blind:[];
    state.repeat=state.repeat||{};state.completed=state.completed||[];state.open=state.open||'repeat';
    const repeatDone=i=>Boolean(state.repeat[i]);
    const steps=[
      {id:'listen',title:'① 听音辨形',desc:'先不看罗马音和中文，只听本课目标内容。每条至少播放 1 次。',pass:()=>targets.length>0&&targets.every((_,i)=>state.listen.includes(i))},
      {id:'repeat',title:'② 逐条模仿',desc:'先播放示范，再完整跟读一次。每条只需点击一次“我已跟读”。',pass:()=>targets.length>0&&targets.every((_,i)=>repeatDone(i))},
      {id:'blind',title:'③ 脱离辅助',desc:'遮住罗马音和中文，只看韩文朗读并回忆意思。至少完成 3 条。',pass:()=>state.blind.length>=Math.min(3,targets.length)},
      {id:'output',title:'④ 情景输出',desc:task+' 请写下或口头说出至少 3 句，再进行自检。',pass:()=>state.output.trim().length>=8},
      {id:'record',title:'⑤ 录音复盘',desc:'使用下方任意“开始跟读”按钮录音并评分，完成后在这里确认一次。',pass:()=>state.record>=1}
    ];
    const wrap=document.createElement('div');wrap.className='shadowTrainer';old?.replaceWith(wrap);

    const completed=()=>steps.filter(s=>s.pass()).map(s=>s.id);
    function save(){state.completed=completed();saveJSON(key('shadow-state'),state)}
    function updateHeader(){
      const done=completed().length;
      qs('.shadowHeader strong',wrap).textContent=`${done} / 5`;
      qs('.shadowBar i',wrap).style.width=`${done/5*100}%`;
    }
    function updateStep(id){
      const step=steps.find(s=>s.id===id),section=qs(`[data-step="${id}"]`,wrap);if(!step||!section)return;
      const passed=step.pass();section.classList.toggle('done',passed);
      qs('.shadowStepHead em',section).textContent=passed?'✓ 已达标':'训练中';
      if(id==='listen')qs('.stepStatus',section).textContent=`已播放 ${state.listen.length} / ${targets.length} 条`;
      if(id==='blind')qs('.stepStatus',section).textContent=`已核对 ${state.blind.length} / ${Math.min(3,targets.length)} 条`;
      save();updateHeader();
    }
    function panelMarkup(s,idx){
      const open=state.open===s.id||(!state.open&&idx===0);
      const listenRows=targets.map((p,i)=>`<div class="shadowTarget"><span lang="ko">${p.ko}</span><button class="miniAction listenAction ${state.listen.includes(i)?'completedAction':''}" data-i="${i}" type="button" ${state.listen.includes(i)?'disabled':''}>${state.listen.includes(i)?'✓ 已播放':'▶ 播放'}</button></div>`).join('');
      const repeatRows=targets.map((p,i)=>`<div class="shadowTarget repeatTarget"><div><span lang="ko">${p.ko}</span><small>${p.zh}</small></div><div class="repeatControls"><button class="miniAction playRepeat" data-i="${i}" type="button">▶ 听</button><button class="repeatTap ${repeatDone(i)?'completedAction':''}" data-i="${i}" type="button" ${repeatDone(i)?'disabled':''}>${repeatDone(i)?'✓ 已跟读':'我已跟读'}</button></div></div>`).join('');
      const blindRows=targets.map((p,i)=>`<button class="blindCard ${state.blind.includes(i)?'revealed':''}" data-i="${i}" type="button"><span lang="ko">${p.ko}</span><small>${state.blind.includes(i)?p.zh:'先说意思，再点击核对'}</small></button>`).join('');
      return `<section class="shadowStep ${s.pass()?'done':''}" data-step="${s.id}"><button class="shadowStepHead" type="button"><span>${s.title}</span><em>${s.pass()?'✓ 已达标':open?'训练中':'展开训练'}</em></button><div class="shadowStepBody" ${open?'':'hidden'}><p>${s.desc}</p>${s.id==='listen'?`<div class="targetList">${listenRows}</div><div class="stepStatus">已播放 ${state.listen.length} / ${targets.length} 条</div>`:''}${s.id==='repeat'?`<div class="targetList">${repeatRows}</div><div class="stepStatus">每条只需确认一次，确认后按钮锁定。</div>`:''}${s.id==='blind'?`<div class="blindGrid">${blindRows}</div><div class="stepStatus">已核对 ${state.blind.length} / ${Math.min(3,targets.length)} 条</div>`:''}${s.id==='output'?`<textarea class="outputPractice" placeholder="例如：写下3句使用本课表达的韩语…">${state.output||''}</textarea><button class="saveOutput primaryMini ${s.pass()?'completedAction':''}" type="button">${s.pass()?'✓ 已保存':'保存并检查'}</button><div class="stepStatus">至少输入 8 个字符</div>`:''}${s.id==='record'?`<div class="recordGuide"><p>请滚动到任意句子的录音按钮，完成一次录音评分后返回这里。</p><button class="confirmRecord primaryMini ${s.pass()?'completedAction':''}" type="button" ${s.pass()?'disabled':''}>${s.pass()?'✓ 已完成录音练习':'我已完成录音练习'}</button></div>`:''}</div></section>`;
    }
    wrap.innerHTML=`<div class="shadowHeader"><div><b>互动跟读训练</b><small>完成操作后自动记录；点击按钮不会关闭当前训练框</small></div><strong>0 / 5</strong></div><div class="shadowBar"><i></i></div><div class="shadowSteps">${steps.map(panelMarkup).join('')}</div><div class="lessonStandard">达标规则：互动跟读完成至少 4/5 项，并在每日小测达到 80 分。</div>`;

    qsa('.shadowStepHead',wrap).forEach(b=>b.onclick=()=>{
      const section=b.closest('.shadowStep'),panel=b.nextElementSibling,id=section.dataset.step;
      panel.hidden=!panel.hidden;
      if(!panel.hidden){state.open=id;save()}else if(state.open===id){state.open='';save()}
      if(!section.classList.contains('done'))qs('em',b).textContent=panel.hidden?'展开训练':'训练中';
    });
    qsa('.listenAction',wrap).forEach(b=>b.onclick=e=>{
      e.stopPropagation();const i=+b.dataset.i;speak(targets[i].ko);
      if(state.listen.includes(i))return;
      state.listen.push(i);b.disabled=true;b.classList.add('completedAction');b.textContent='✓ 已播放';updateStep('listen');
    });
    qsa('.playRepeat',wrap).forEach(b=>b.onclick=e=>{e.stopPropagation();speak(targets[+b.dataset.i].ko)});
    qsa('.repeatTap',wrap).forEach(b=>b.onclick=e=>{
      e.stopPropagation();const i=+b.dataset.i;if(repeatDone(i))return;
      state.repeat[i]=true;b.disabled=true;b.classList.add('completedAction');b.textContent='✓ 已跟读';updateStep('repeat');
    });
    qsa('.blindCard',wrap).forEach(b=>b.onclick=e=>{
      e.stopPropagation();const i=+b.dataset.i;if(state.blind.includes(i))return;
      state.blind.push(i);b.classList.add('revealed');qs('small',b).textContent=targets[i].zh;updateStep('blind');
    });
    const out=qs('.outputPractice',wrap),saveOut=qs('.saveOutput',wrap);if(saveOut)saveOut.onclick=e=>{
      e.stopPropagation();state.output=out.value.trim();saveOut.textContent=state.output.length>=8?'✓ 已保存':'内容还不够，请继续补充';saveOut.classList.toggle('completedAction',state.output.length>=8);updateStep('output');out.focus();
    };
    const rec=qs('.confirmRecord',wrap);if(rec)rec.onclick=e=>{
      e.stopPropagation();if(state.record>=1)return;state.record=1;rec.disabled=true;rec.classList.add('completedAction');rec.textContent='✓ 已完成录音练习';updateStep('record');
    };
    save();updateHeader();
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
  function upgrade(){if(!qs('.lessonView'))return;migrateLegacy();upgradeTraining();upgradeQuiz()}
  new MutationObserver(upgrade).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',e=>{const b=e.target.closest('.speak');if(!b)return;b.classList.add('is-playing');setTimeout(()=>b.classList.remove('is-playing'),1200)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade);else upgrade();
})();