(function (global) {
  'use strict';

  const config = global.NikigoLessonConfig;
  if (!config) throw new Error('Nikigo lesson configuration is missing.');
  global.NikigoCurrentLesson = Object.freeze({lessonId:config.id});
  const LANGUAGES = ['zh','en','vi','ja'];
  const SESSION_KEY = `nikigoLessonSession:${config.id}`;
  const COPY = {
    zh:{progress:'课程进度',home:'返回课程主页',back:'返回',next:'继续',finish:'完成课程',correct:'答对了！',incorrect:'这次不对，稍后需要重练。',matchHint:'先选左侧，再选右侧。',build:'确认拼合',audio:'播放音频',audioPending:'精确审核音频尚不可用',audioError:'音频加载失败',retry:'错题重练：答对后才能完成课程',remaining:'剩余 {count} 项',xpEarned:'本次获得 +50 XP',xpClaimed:'首次完成奖励已领取，本次不重复发放XP',saved:'学习进度已保存',reviewLesson:'重新学习本课',returnCourses:'返回课程主页'},
    en:{progress:'Lesson progress',home:'Return to Courses',back:'Back',next:'Continue',finish:'Complete lesson',correct:'Correct!',incorrect:'Not this time. You will retry it before finishing.',matchHint:'Choose a card on the left, then its match on the right.',build:'Confirm build',audio:'Play audio',audioPending:'Exact approved audio is unavailable',audioError:'Audio failed to load',retry:'Retry missed items: correct each one before finishing',remaining:'{count} item(s) left',xpEarned:'You earned +50 XP this time',xpClaimed:'The first-completion reward was already claimed; no extra XP this time',saved:'Learning progress saved',reviewLesson:'Review this lesson',returnCourses:'Return to Courses'},
    vi:{progress:'Tiến độ bài học',home:'Về trang khóa học',back:'Quay lại',next:'Tiếp tục',finish:'Hoàn thành bài',correct:'Chính xác!',incorrect:'Chưa đúng. Bạn sẽ luyện lại trước khi hoàn thành.',matchHint:'Chọn thẻ bên trái rồi chọn cặp bên phải.',build:'Xác nhận ghép',audio:'Phát âm thanh',audioPending:'Chưa có âm thanh chính xác đã duyệt',audioError:'Không tải được âm thanh',retry:'Luyện lại câu sai: phải sửa đúng trước khi hoàn thành',remaining:'Còn {count} mục',xpEarned:'Lần này bạn nhận +50 XP',xpClaimed:'Đã nhận thưởng lần đầu; lần này không cộng thêm XP',saved:'Đã lưu tiến độ',reviewLesson:'Ôn lại bài này',returnCourses:'Về trang khóa học'},
    ja:{progress:'レッスン進捗',home:'コース一覧へ',back:'戻る',next:'続ける',finish:'レッスン完了',correct:'正解です！',incorrect:'今回は不正解です。完了前にもう一度練習します。',matchHint:'左のカードを選び、対応する右のカードを選びます。',build:'組み立てを確認',audio:'音声を再生',audioPending:'一致する審査済み音声は利用できません',audioError:'音声を読み込めませんでした',retry:'間違えた項目を再練習：正解するまで完了できません',remaining:'残り {count} 項目',xpEarned:'今回は +50 XP を獲得しました',xpClaimed:'初回完了報酬は受取済みです。今回はXPを追加しません',saved:'学習進捗を保存しました',reviewLesson:'この課を復習',returnCourses:'コース一覧へ'}
  };
  const clone = value => JSON.parse(JSON.stringify(value));
  const blankSession = () => ({step:0,answers:{},mistakes:[],retryQueue:[],retryMode:false,match:{},build:{},completed:false});
  function normalizeSession(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const clean = blankSession();
    clean.step = Math.max(0,Math.min(config.steps.length-1,Number(source.step)||0));
    clean.answers = source.answers && typeof source.answers === 'object' ? clone(source.answers) : {};
    clean.mistakes = Array.isArray(source.mistakes) ? [...new Set(source.mistakes.filter(id=>config.steps.some(step=>step.id===id)))] : [];
    clean.retryQueue = Array.isArray(source.retryQueue) ? source.retryQueue.filter(id=>clean.mistakes.includes(id)) : [];
    clean.retryMode = source.retryMode === true && clean.retryQueue.length > 0;
    clean.match = source.match && typeof source.match === 'object' ? clone(source.match) : {};
    clean.build = source.build && typeof source.build === 'object' ? clone(source.build) : {};
    clean.completed = source.completed === true;
    return clean;
  }
  function completionPatch(profile) {
    const completed = Array.isArray(profile.completedLessons) ? profile.completedLessons : [];
    const first = !completed.includes(config.id);
    return {...profile,xp:(Number(profile.xp)||0)+(first?50:0),completedLessons:first?[...completed,config.id]:completed,lessonProgress:{...(profile.lessonProgress||{}),[config.id]:100}};
  }
  const testApi = {config,copy:COPY,blankSession,normalizeSession,completionPatch};
  global.NikigoSprintLessonTest = testApi;

  const stage = document.getElementById('lessonStage');
  const languageSelect = document.getElementById('language');
  const profileLanguage = global.NikigoState?.get?.().interfaceLanguage;
  const queryLanguage = new URLSearchParams(global.location.search).get('lang');
  let language = LANGUAGES.includes(queryLanguage) ? queryLanguage : LANGUAGES.includes(profileLanguage) ? profileLanguage : 'en';
  let session;
  try { session=normalizeSession(JSON.parse(global.localStorage.getItem(SESSION_KEY)||'{}')); } catch (error) { session=blankSession(); }
  let toastTimer;
  const tr = value => typeof value === 'string' ? value : value?.[language] ?? value?.en ?? '';
  const ui = key => COPY[language][key];
  const format = (value,data) => String(value).replace(/\{(\w+)\}/g,(_,key)=>data[key]??'');
  const escape = value => String(value).replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const current = () => config.steps[session.step];
  const isInteractive = step => ['choice','scenario','listening','match','build'].includes(step.type);
  const stepDone = step => !isInteractive(step) || Boolean(session.answers[step.id]?.done);
  function save() {
    global.localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    const percent=Math.round((session.step/(config.steps.length-1))*100);
    global.NikigoState?.update?.(profile=>({...profile,interfaceLanguage:language,learningLanguage:language,lessonProgress:{...(profile.lessonProgress||{}),[config.id]:Math.max(Number(profile.lessonProgress?.[config.id])||0,percent)}}),`${config.id}:progress`);
  }
  function notify(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800)}
  function addMistake(id){if(!session.mistakes.includes(id))session.mistakes.push(id)}
  function removeMistake(id){session.mistakes=session.mistakes.filter(item=>item!==id);session.retryQueue=session.retryQueue.filter(item=>item!==id)}
  function record(step,correct,selected){session.answers[step.id]={done:true,correct,selected};if(correct&&session.retryMode)removeMistake(step.id);if(!correct)addMistake(step.id);save();render()}
  function audioResult(audio){return global.NikigoAudio?.resolve?.(audio.text,audio.audioType,audio.lessonId)}
  function renderAudios(step,hideText=false){
    const audios=step.audios||step.audio?[...(step.audios||[]),...(step.audio?[step.audio]:[])]:[];
    if(!audios.length)return '';
    return `<div class="audioRow">${audios.map((audio,index)=>{const result=audioResult(audio);const playable=Boolean(result?.playable&&result.path);const label=hideText?ui('audio'):(tr(audio.label)||ui('audio'));return `<button class="audioButton" type="button" data-action="audio" data-audio="${index}" ${playable?'':'disabled aria-disabled="true"'} aria-label="${escape(hideText?ui('audio'):label)}">${escape(playable?label:ui('audioPending'))}</button>`}).join('')}</div>`;
  }
  function renderBody(step){
    if(step.type==='intro'||step.type==='concept'){
      const items=(step.items||[]).map(item=>`<article class="learningItem"><strong>${escape(tr(item.title))}</strong><span class="${item.korean?'korean':''}">${escape(item.korean||tr(item.text))}</span>${item.detail?`<p>${escape(tr(item.detail))}</p>`:''}</article>`).join('');
      const rows=(step.rows||[]).map(row=>`<tr><td class="korean">${escape(row.korean)}</td><td>${escape(tr(row.value))}</td><td>${escape(tr(row.note))}</td></tr>`).join('');
      const dialogue=(step.dialogue||[]).map(line=>`<div class="bubble ${line.role==='B'?'b':''}"><b>${escape(line.role)}</b><span class="korean">${escape(line.korean)}</span><p>${escape(tr(line.translation))}</p></div>`).join('');
      return `${items?`<div class="learningGrid">${items}</div>`:''}${rows?`<table class="ruleTable"><thead><tr><th>한글</th><th>${escape(tr(step.valueHeader||{zh:'代表读音',en:'Representative sound',vi:'Âm đại diện',ja:'代表音'}))}</th><th>${escape(tr(step.noteHeader||{zh:'要点',en:'Key point',vi:'Điểm chính',ja:'ポイント'}))}</th></tr></thead><tbody>${rows}</tbody></table>`:''}${dialogue?`<div class="dialogue">${dialogue}</div>`:''}${renderAudios(step)}`;
    }
    if(['choice','scenario','listening'].includes(step.type)){
      const answer=session.answers[step.id];
      return `${step.context?`<div class="dialogue">${step.context.map(line=>`<div class="bubble ${line.role==='B'?'b':''}"><b>${escape(line.role)}</b><span class="korean">${escape(line.korean)}</span>${line.translation?`<p>${escape(tr(line.translation))}</p>`:''}</div>`).join('')}</div>`:''}${step.type==='listening'?renderAudios(step,true):renderAudios(step)}<div class="optionGrid">${step.options.map(option=>{let cls='option';if(answer?.selected===option.id)cls+=answer.correct?' correct':' wrong';else if(answer&&!answer.correct&&option.id===step.correct)cls+=' correct';return `<button type="button" class="${cls}" data-action="answer" data-value="${escape(option.id)}" ${answer?'disabled':''}>${escape(option.korean||tr(option.label))}</button>`}).join('')}</div>${answer?`<div class="feedback ${answer.correct?'good':'try'}"><b>${escape(answer.correct?ui('correct'):ui('incorrect'))}</b><span>${escape(tr(step.explanation))}</span></div>`:''}`;
    }
    if(step.type==='match'){
      const state=session.match[step.id]||{left:null,done:[]};const done=new Set(state.done||[]);const answer=session.answers[step.id];
      return `<p class="lead">${escape(ui('matchHint'))}</p><div class="matchGrid"><div class="matchColumn">${step.pairs.map(pair=>`<button type="button" class="matchButton ${state.left===pair.id?'selected':''} ${done.has(pair.id)?'done':''}" data-action="match-left" data-value="${pair.id}" ${done.has(pair.id)?'disabled':''}>${escape(pair.leftKorean||tr(pair.left))}</button>`).join('')}</div><div class="matchColumn">${[...step.pairs].reverse().map(pair=>`<button type="button" class="matchButton ${done.has(pair.id)?'done':''}" data-action="match-right" data-value="${pair.id}" ${done.has(pair.id)?'disabled':''}>${escape(pair.rightKorean||tr(pair.right))}</button>`).join('')}</div></div>${answer?`<div class="feedback good"><b>${escape(ui('correct'))}</b><span>${escape(tr(step.explanation))}</span></div>`:''}`;
    }
    if(step.type==='build'){
      const state=session.build[step.id]||{};const answer=session.answers[step.id];const built=step.groups.map(group=>group.options.find(option=>option.id===state[group.id])?.korean||'•').join('');
      return `<div class="partGroups">${step.groups.map(group=>`<div class="partGroup"><small>${escape(tr(group.label))}</small>${group.options.map(option=>`<button type="button" class="partButton ${state[group.id]===option.id?'selected':''}" data-action="part" data-group="${group.id}" data-value="${option.id}">${escape(option.korean)}</button>`).join('')}</div>`).join('')}</div><div class="buildResult"><strong>${escape(built)}</strong></div><button type="button" class="primary audioButton" data-action="confirm-build">${escape(ui('build'))}</button>${answer?`<div class="feedback ${answer.correct?'good':'try'}"><b>${escape(answer.correct?ui('correct'):ui('incorrect'))}</b><span>${escape(tr(step.explanation))}</span></div>`:''}`;
    }
    return '';
  }
  function beginRetry(){session.retryQueue=[...session.mistakes];session.retryMode=session.retryQueue.length>0;if(session.retryMode){session.step=config.steps.findIndex(step=>step.id===session.retryQueue[0]);for(const id of session.retryQueue){delete session.answers[id];delete session.match[id];delete session.build[id]}}save();render()}
  function completeLesson(){const before=global.NikigoState?.get?.()||{};const first=!before.completedLessons?.includes(config.id);global.NikigoState?.update?.(completionPatch,`${config.id}:complete`);session.completed=true;save();return first}
  function next(){
    const step=current();if(!stepDone(step))return;
    if(session.retryMode){if(session.mistakes.length){session.retryQueue=[...session.mistakes];session.step=config.steps.findIndex(item=>item.id===session.retryQueue[0]);delete session.answers[session.retryQueue[0]];delete session.match[session.retryQueue[0]];delete session.build[session.retryQueue[0]]}else{session.retryMode=false;session.step=config.steps.length-1}save();render();return}
    if(session.step===config.steps.length-2&&session.mistakes.length){beginRetry();return}
    session.step=Math.min(config.steps.length-1,session.step+1);save();render();
  }
  function render(){
    const step=current();document.documentElement.lang=language==='zh'?'zh-CN':language;languageSelect.value=language;document.getElementById('lessonName').textContent=tr(config.name);document.getElementById('progressLabel').textContent=ui('progress');document.getElementById('progressCount').textContent=`${session.step+1} / ${config.steps.length}`;const percent=(session.step/(config.steps.length-1))*100;document.getElementById('progressBar').style.width=`${percent}%`;document.getElementById('progressTrack').setAttribute('aria-valuenow',String(Math.round(percent)));
    global.NikigoSprintClassicFocusAdapter?.update?.({
      lessonId:config.id,
      stepId:step.id,
      stepType:step.type,
      currentStep:session.step+1,
      totalSteps:config.steps.length,
      language,
      title:tr(config.name),
      stepLabel:ui('progress'),
      progress:percent,
      canGoPrevious:session.step>0&&!session.retryMode,
      canGoNext:stepDone(step)
    });
    if(step.type==='complete'){
      const first=completeLesson();stage.innerHTML=`<div class="completeMark">✓</div><p class="tag center">${escape(tr(step.tag))}</p><h1 class="center">${escape(tr(step.title))}</h1><p class="lead center">${escape(tr(step.lead))}</p><div class="feedback good center"><b>${escape(first?ui('xpEarned'):ui('xpClaimed'))}</b><span>${escape(ui('saved'))}</span></div><div class="foot"><button class="secondary" data-action="review">↻ ${escape(ui('reviewLesson'))}</button><button class="primary" data-action="home">${escape(ui('returnCourses'))}</button></div>`;global.NikigoSprintClassicFocusAdapter?.afterRender?.();return;
    }
    const retry=session.retryMode?`<div class="retryBanner">${escape(ui('retry'))} · ${escape(format(ui('remaining'),{count:session.mistakes.length}))}</div>`:'';
    stage.innerHTML=`${retry}<span class="modulePill">${escape(tr(step.module))}</span><p class="tag">${escape(tr(step.tag))}</p><h1>${escape(tr(step.title))}</h1><p class="lead">${escape(tr(step.lead))}</p>${renderBody(step)}<div class="foot"><button class="secondary" data-action="back" ${session.step===0||session.retryMode?'disabled':''}>${escape(ui('back'))}</button><button class="primary" data-action="next" ${stepDone(step)?'':'disabled'}>${escape(session.step===config.steps.length-2?ui('finish'):ui('next'))}</button></div>`;global.NikigoSprintClassicFocusAdapter?.afterRender?.();
  }
  stage.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;const step=current();const action=button.dataset.action;
    if(action==='next')next();
    else if(action==='back'){session.step=Math.max(0,session.step-1);save();render()}
    else if(action==='home'||action==='home-logo')global.location.href=`nikigo-app.html?lang=${language}#courses`;
    else if(action==='review'){session=blankSession();save();render();global.scrollTo(0,0)}
    else if(action==='answer')record(step,button.dataset.value===step.correct,button.dataset.value);
    else if(action==='part'){session.build[step.id]={...(session.build[step.id]||{}),[button.dataset.group]:button.dataset.value};save();render()}
    else if(action==='confirm-build'){const state=session.build[step.id]||{};const correct=step.groups.every(group=>state[group.id]===group.correct);record(step,correct,clone(state))}
    else if(action==='match-left'){const state=session.match[step.id]||{left:null,done:[]};state.left=button.dataset.value;session.match[step.id]=state;save();render()}
    else if(action==='match-right'){const state=session.match[step.id]||{left:null,done:[]};if(!state.left)return;if(state.left===button.dataset.value){state.done=[...new Set([...(state.done||[]),state.left])];state.left=null;session.match[step.id]=state;if(state.done.length===step.pairs.length)record(step,true,state.done);else{save();render()}}else{addMistake(step.id);state.left=null;session.match[step.id]=state;save();notify(ui('incorrect'));render()}}
    else if(action==='audio'){const audio=[...(step.audios||[]),...(step.audio?[step.audio]:[])][Number(button.dataset.audio)||0];const result=audioResult(audio);if(!result?.playable||!result.path)return;const media=new Audio(result.path);media.play().catch(()=>notify(ui('audioError')))}
  });
  languageSelect.addEventListener('change',event=>{language=LANGUAGES.includes(event.target.value)?event.target.value:'en';save();render()});
  document.getElementById('homeButton').addEventListener('click',()=>{global.location.href=`nikigo-app.html?lang=${language}#courses`});
  document.getElementById('homeLogo').addEventListener('click',()=>{global.location.href=`nikigo-app.html?lang=${language}#courses`});
  render();
})(window);
