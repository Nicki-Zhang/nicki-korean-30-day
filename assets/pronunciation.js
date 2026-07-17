(()=>{
  const SpeechRecognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  let active=null;

  const normalize=text=>(text||'')
    .toLowerCase()
    .replace(/[\s.,!?~·'"“”‘’()\[\]{}:;\-_/\\]/g,'');

  function distance(a,b){
    const m=a.length,n=b.length,dp=Array.from({length:m+1},()=>Array(n+1).fill(0));
    for(let i=0;i<=m;i++)dp[i][0]=i;
    for(let j=0;j<=n;j++)dp[0][j]=j;
    for(let i=1;i<=m;i++)for(let j=1;j<=n;j++)dp[i][j]=Math.min(
      dp[i-1][j]+1,dp[i][j-1]+1,dp[i-1][j-1]+(a[i-1]===b[j-1]?0:1)
    );
    return dp[m][n];
  }

  function scoreText(target,heard){
    const a=normalize(target),b=normalize(heard);
    if(!a||!b)return 0;
    return Math.max(0,Math.round((1-distance(a,b)/Math.max(a.length,b.length))*100));
  }

  function feedback(score){
    if(score>=95)return '非常自然，发音和句子完整度都很好。';
    if(score>=85)return '很好，再注意一下尾音和语速会更自然。';
    if(score>=70)return '基本正确，建议放慢速度后再跟读一次。';
    if(score>=50)return '已识别到部分内容，请先分词练习再读整句。';
    return '暂未准确识别，请靠近麦克风并清晰地再读一次。';
  }

  function bestKey(target){return `nicki-pronunciation-best-${normalize(target)}`}

  function inject(root=document){
    root.querySelectorAll('[data-speak]:not([data-practice-ready])').forEach(btn=>{
      btn.dataset.practiceReady='1';
      const target=(btn.dataset.speak||'').trim();
      if(!target)return;
      const box=document.createElement('div');
      box.className='pronunciationPractice';
      box.dataset.target=target;
      const best=Number(localStorage.getItem(bestKey(target))||0);
      box.innerHTML=`
        <button type="button" class="recordBtn" aria-label="开始跟读录音">🎤 开始跟读</button>
        <span class="recordStatus">${best?`历史最佳 ${best} 分`:'录音后自动评分'}</span>
        <div class="recordResult" hidden></div>`;
      btn.insertAdjacentElement('afterend',box);
    });
  }

  async function stopActive(){
    if(!active)return;
    clearTimeout(active.timer);
    try{active.recognition?.stop()}catch{}
    try{if(active.recorder?.state!=='inactive')active.recorder.stop()}catch{}
    active.stream?.getTracks().forEach(t=>t.stop());
    active.button.disabled=true;
    active.button.textContent='正在评分…';
  }

  async function start(box){
    if(active)await stopActive();
    const button=box.querySelector('.recordBtn');
    const status=box.querySelector('.recordStatus');
    const result=box.querySelector('.recordResult');
    const target=box.dataset.target;
    if(!navigator.mediaDevices?.getUserMedia){alert('当前浏览器不支持麦克风录音，请使用最新版 Chrome 或 Edge。');return}
    try{
      const stream=await navigator.mediaDevices.getUserMedia({audio:true});
      const chunks=[];
      const recorder=new MediaRecorder(stream);
      let transcript='';
      let recognition=null;
      recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};
      recorder.onstop=()=>{
        const blob=new Blob(chunks,{type:recorder.mimeType||'audio/webm'});
        const url=URL.createObjectURL(blob);
        const score=scoreText(target,transcript);
        const oldBest=Number(localStorage.getItem(bestKey(target))||0);
        const best=Math.max(oldBest,score);
        if(score>oldBest)localStorage.setItem(bestKey(target),String(score));
        result.hidden=false;
        result.innerHTML=`
          <div class="scoreBadge"><b>${score}</b><span>/ 100</span></div>
          <div class="scoreCopy">
            <b>${feedback(score)}</b>
            <p>目标：<span lang="ko">${target}</span></p>
            <p>识别：<span lang="ko">${transcript||'未识别到清晰语音'}</span></p>
            <small>历史最佳：${best} 分</small>
          </div>
          <audio controls src="${url}"></audio>`;
        status.textContent=score?`本次 ${score} 分 · 最佳 ${best} 分`:'没有获得有效识别结果';
        button.disabled=false;
        button.textContent='🎤 再读一次';
        active=null;
      };
      if(SpeechRecognition){
        recognition=new SpeechRecognition();
        recognition.lang='ko-KR';
        recognition.interimResults=true;
        recognition.continuous=true;
        recognition.onresult=e=>{
          transcript='';
          for(let i=0;i<e.results.length;i++)transcript+=e.results[i][0].transcript;
          status.textContent=transcript?`识别中：${transcript}`:'正在听你的韩语…';
        };
        recognition.onerror=e=>{if(e.error!=='aborted')status.textContent='语音识别暂时不可用，仍可保存并回放录音。'};
      }
      recorder.start();
      try{recognition?.start()}catch{}
      button.textContent='⏹ 停止并评分';
      button.classList.add('recording');
      status.textContent='正在录音，请朗读上方韩语…';
      result.hidden=true;
      active={box,button,status,result,target,stream,recorder,recognition,timer:setTimeout(stopActive,10000)};
    }catch(err){
      console.error(err);
      alert('无法使用麦克风。请在浏览器地址栏中允许此网站访问麦克风后重试。');
    }
  }

  document.addEventListener('click',e=>{
    const button=e.target.closest('.recordBtn');
    if(!button)return;
    const box=button.closest('.pronunciationPractice');
    if(active&&active.box===box){button.classList.remove('recording');stopActive();}
    else start(box);
  });

  new MutationObserver(records=>records.forEach(r=>r.addedNodes.forEach(n=>{
    if(n.nodeType!==1)return;
    if(n.matches?.('[data-speak]'))inject(n.parentElement||document);
    else inject(n);
  }))).observe(document.documentElement,{childList:true,subtree:true});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>inject());else inject();
})();