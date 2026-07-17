(()=>{
  const shuffle=a=>[...a].sort(()=>Math.random()-.5);
  const text=(el,sel)=>el?.querySelector(sel)?.textContent.trim()||'';
  const lessonId=()=>document.querySelector('.lessonView .eyebrow')?.textContent.trim()||document.querySelector('.lessonView h2')?.textContent.trim()||'lesson';
  const storageKey=s=>`nicki-v4-${lessonId()}-${s}`;

  function heading(name){return [...document.querySelectorAll('.lessonView h3')].find(h=>h.textContent.trim()===name)}

  function upgradeTraining(){
    const h=heading('跟读训练');
    if(!h||h.dataset.upgraded)return;
    h.dataset.upgraded='1';
    const old=h.nextElementSibling;
    const task=old?.querySelector('li:nth-child(4)')?.textContent.trim()||'使用本课表达完成一次独立输出。';
    const steps=[
      ['听音辨形','依次播放本课词汇和核心表达，只听不跟读，注意音节、收音和停顿。','达标：完整听完全部发音 1 遍'],
      ['逐句模仿','每个词慢速跟读 3 次；每个核心表达先分段、再整句跟读 5 次。','达标：至少完成 3 个词和 3 个句子的跟读'],
      ['脱离辅助','隐藏罗马音和中文，只看韩文朗读并说出意思；卡住时再轻触查看。','达标：不看中文正确说出至少 3 个核心表达'],
      ['情景输出',task,'达标：独立完成任务，并使用本课至少 3 个词或表达'],
      ['录音复盘','录制 30 秒语音，回放后检查语速、停顿、尾音，再录一次进行对比。','达标：完成录音并获得 80 分以上，或第二次明显优于第一次']
    ];
    const saved=JSON.parse(localStorage.getItem(storageKey('training'))||'[]');
    const wrap=document.createElement('div');
    wrap.innerHTML=`<div class="trainingProgress"><span>跟读训练进度</span><b class="trainingCount">${saved.length} / ${steps.length} 项</b></div><div class="trainingPlan">${steps.map((s,i)=>`<label class="trainingStep"><span class="stepNo">${i+1}</span><span><h4>${s[0]}</h4><p>${s[1]}</p><small>${s[2]}</small></span><input class="trainingCheck" type="checkbox" data-step="${i}" ${saved.includes(i)?'checked':''} aria-label="完成${s[0]}"></label>`).join('')}</div><div class="lessonStandard">完成标准已融入每一步：完成至少 4/5 项，并在每日小测中达到 80 分，即可标记本课达标。</div>`;
    old?.replaceWith(wrap);
    wrap.querySelectorAll('.trainingCheck').forEach(c=>c.addEventListener('change',()=>{
      const done=[...wrap.querySelectorAll('.trainingCheck:checked')].map(x=>+x.dataset.step);
      localStorage.setItem(storageKey('training'),JSON.stringify(done));
      wrap.querySelector('.trainingCount').textContent=`${done.length} / ${steps.length} 项`;
    }));
  }

  function collectPairs(){
    const seen=new Set(),pairs=[];
    document.querySelectorAll('.lessonView .krow').forEach(row=>{
      const ko=text(row,'.ko').replace(/\s+/g,' ').trim();
      const zh=text(row,'.zh').replace(/\s+/g,' ').trim();
      if(ko&&zh&&!ko.includes('\n')&&!seen.has(ko)){seen.add(ko);pairs.push({ko,zh})}
    });
    return pairs;
  }

  function makeQuestions(pairs){
    const usable=pairs.slice(0,8);
    if(usable.length<2)return [];
    return shuffle(usable).slice(0,3).map((p,i)=>{
      const distract=shuffle(usable.filter(x=>x.zh!==p.zh)).slice(0,2).map(x=>x.zh);
      return {type:i===1?'listen':'meaning',prompt:i===1?'点击播放后，选择你听到句子的意思：':`“${p.ko}”是什么意思？`,target:p.ko,answer:p.zh,options:shuffle([p.zh,...distract])};
    });
  }

  function upgradeQuiz(){
    const h=heading('每日小测');
    if(!h||h.dataset.upgraded)return;
    h.dataset.upgraded='1';
    const old=h.nextElementSibling;
    const pairs=collectPairs(),questions=makeQuestions(pairs);
    const box=document.createElement('div');box.className='dailyQuiz';
    old?.replaceWith(box);
    const completeH=heading('完成标准');
    if(completeH){const card=completeH.nextElementSibling;completeH.remove();card?.remove()}
    if(!questions.length){box.innerHTML='<p>本课内容不足以生成互动题目，请完成跟读训练作为本日检测。</p>';return}
    let index=0,score=0,locked=false;
    function render(){
      const q=questions[index];locked=false;
      box.innerHTML=`<div><b>每日互动小测</b><span style="float:right">${index+1} / ${questions.length}</span></div><div class="quizProgress"><i style="width:${(index/questions.length)*100}%"></i></div><div class="quizQuestion"><h4>${q.prompt}</h4>${q.type==='listen'?`<button class="speak" data-speak="${q.target.replace(/"/g,'&quot;')}" aria-label="播放题目发音"></button>`:''}<div class="quizAnswers">${q.options.map(o=>`<button type="button" data-option="${o.replace(/"/g,'&quot;')}">${o}</button>`).join('')}</div><p class="quizFeedback"></p></div><div class="lessonStandard">本题即时反馈；三题总分达到 80 分，并完成至少 4 项跟读训练，即达到本课完成标准。</div>`;
      box.querySelectorAll('[data-option]').forEach(btn=>btn.onclick=()=>{
        if(locked)return;locked=true;
        const right=btn.dataset.option===q.answer;
        if(right){score++;btn.classList.add('correct')}else{btn.classList.add('wrong');[...box.querySelectorAll('[data-option]')].find(x=>x.dataset.option===q.answer)?.classList.add('correct')}
        box.querySelector('.quizFeedback').textContent=right?'✓ 回答正确！':'正确答案：'+q.answer;
        setTimeout(()=>{index++;index<questions.length?render():result()},850);
      });
    }
    function result(){
      const pct=Math.round(score/questions.length*100),training=JSON.parse(localStorage.getItem(storageKey('training'))||'[]').length,pass=pct>=80&&training>=4;
      localStorage.setItem(storageKey('quiz-score'),String(pct));
      box.innerHTML=`<div class="quizResult"><div class="quizScore">${pct}</div><h4>${pass?'本课达标':'继续练习后再挑战'}</h4><p>答对 ${score} / ${questions.length} 题 · 跟读已完成 ${training} / 5 项</p><span class="passBadge">${pass?'✓ 已达到完成标准':pct<80?'小测需达到 80 分':'跟读训练需完成至少 4 项'}</span><br><button class="retryQuiz" type="button">重新测试</button></div>`;
      box.querySelector('.retryQuiz').onclick=()=>{index=0;score=0;render()};
    }
    render();
  }

  function upgrade(){
    if(!document.querySelector('.lessonView'))return;
    upgradeTraining();upgradeQuiz();
  }
  new MutationObserver(upgrade).observe(document.documentElement,{subtree:true,childList:true});
  document.addEventListener('click',e=>{const b=e.target.closest('.speak');if(!b)return;b.classList.add('is-playing');setTimeout(()=>b.classList.remove('is-playing'),1200)});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',upgrade);else upgrade();
})();