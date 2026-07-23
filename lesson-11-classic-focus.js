(function (global) {
  'use strict';

  const config=global.NikigoLessonConfig;
  if(!config||config.id!=='lesson-11'||config.steps.length!==13) throw new Error('Classic Focus requires the real 13-step Lesson 11 configuration.');
  global.NikigoCurrentLesson=Object.freeze({lessonId:config.id});

  const LANGUAGES=['zh','en','vi','ja'];
  const SESSION_KEY=`nikigoLessonSession:${config.id}`;
  const INTERACTIVE=new Set(['choice','scenario','match','build']);
  const COPY={
    zh:{progress:'课程进度',language:'界面语言',navigation:'课程导航',skip:'跳到当前学习任务',exit:'退出课程',exitTitle:'退出当前课程？',exitCopy:'当前步骤和已作答内容会保留，下次可以继续。',stay:'继续学习',leave:'返回学习路径',back:'← 返回',continue:'继续 →',start:'开始学习 →',nextLine:'显示下一句',dialogueReady:'完整对话已显示。',partner:'对方',you:'你',audioPending:'标准音频准备中',audioCopy:'Lesson 11当前没有批准的可播放音频，非音频任务可以继续。',choose:'选择一个回答。错误时不会提前显示答案。',correct:'回答正确',wrong:'再观察一次',retry:'重新作答',matchHint:'先选择左侧韩语，再选择对应作用。',answerZone:'你的句子',available:'可用词块',undo:'撤销',moveLeft:'左移',moveRight:'右移',check:'检查句子',empty:'空位',retryMode:'错题针对性重练',remaining:'还需重练{count}题',summary:'学习完成',xpFirst:'首次完成 +50 XP',xpRepeat:'重复完成 +0 XP',saved:'进度已保存',review:'重新学习',courses:'返回学习路径',nextLesson:'下一课',selectChunk:'选择词块，观察其作用。',topic:'主题',name:'姓名',ending:'结尾',topicCopy:'저는建立“我”的话题。',nameCopy:'하늘是本课使用的虚构姓名。',endingCopy:'하늘有받침ㄹ，因此使用이에요。'},
    en:{progress:'Course progress',language:'Interface language',navigation:'Course navigation',skip:'Skip to the current learning task',exit:'Exit lesson',exitTitle:'Exit this lesson?',exitCopy:'Your current step and answers will be saved so you can continue later.',stay:'Keep learning',leave:'Return to learning path',back:'← Back',continue:'Continue →',start:'Start lesson →',nextLine:'Show next line',dialogueReady:'The full dialogue is visible.',partner:'Partner',you:'You',audioPending:'Standard audio is being prepared',audioCopy:'Lesson 11 has no approved playable audio. Non-audio tasks remain available.',choose:'Choose one response. A wrong choice never reveals the answer.',correct:'Correct',wrong:'Look once more',retry:'Try again',matchHint:'Choose Korean on the left, then its role.',answerZone:'Your sentence',available:'Available chunks',undo:'Undo',moveLeft:'Move left',moveRight:'Move right',check:'Check sentence',empty:'Empty',retryMode:'Targeted mistake review',remaining:'{count} item(s) left',summary:'Lesson complete',xpFirst:'First completion +50 XP',xpRepeat:'Repeat completion +0 XP',saved:'Progress saved',review:'Learn again',courses:'Return to learning path',nextLesson:'Next lesson',selectChunk:'Select a chunk to inspect its role.',topic:'Topic',name:'Name',ending:'Ending',topicCopy:'저는 establishes “me” as the topic.',nameCopy:'하늘 is the fictional name used in this lesson.',endingCopy:'하늘 ends in ㄹ, so it takes 이에요.'},
    vi:{progress:'Tiến độ bài học',language:'Ngôn ngữ giao diện',navigation:'Điều hướng bài học',skip:'Chuyển đến nhiệm vụ học hiện tại',exit:'Thoát bài học',exitTitle:'Thoát bài học này?',exitCopy:'Bước hiện tại và câu trả lời sẽ được lưu để bạn tiếp tục sau.',stay:'Tiếp tục học',leave:'Về lộ trình học',back:'← Quay lại',continue:'Tiếp tục →',start:'Bắt đầu học →',nextLine:'Hiện câu tiếp theo',dialogueReady:'Đã hiện toàn bộ hội thoại.',partner:'Đối phương',you:'Bạn',audioPending:'Âm thanh chuẩn đang được chuẩn bị',audioCopy:'Bài 11 chưa có âm thanh phát được đã duyệt. Nhiệm vụ không âm thanh vẫn tiếp tục.',choose:'Chọn một câu trả lời. Lựa chọn sai sẽ không làm lộ đáp án.',correct:'Chính xác',wrong:'Hãy quan sát lại',retry:'Chọn lại',matchHint:'Chọn tiếng Hàn bên trái rồi chọn chức năng tương ứng.',answerZone:'Câu của bạn',available:'Khối có thể dùng',undo:'Hoàn tác',moveLeft:'Chuyển trái',moveRight:'Chuyển phải',check:'Kiểm tra câu',empty:'Ô trống',retryMode:'Luyện lại câu sai có mục tiêu',remaining:'Còn {count} câu',summary:'Hoàn thành bài học',xpFirst:'Hoàn thành lần đầu +50 XP',xpRepeat:'Hoàn thành lại +0 XP',saved:'Đã lưu tiến độ',review:'Học lại',courses:'Về lộ trình học',nextLesson:'Bài tiếp theo',selectChunk:'Chọn một khối để xem vai trò.',topic:'Chủ đề',name:'Tên',ending:'Kết thúc',topicCopy:'저는 đặt “tôi” làm chủ đề.',nameCopy:'하늘 là tên hư cấu dùng trong bài.',endingCopy:'하늘 có âm cuối ㄹ nên dùng 이에요.'},
    ja:{progress:'コース進捗',language:'表示言語',navigation:'コースナビゲーション',skip:'現在の学習課題へ移動',exit:'レッスン終了',exitTitle:'このレッスンを終了しますか？',exitCopy:'現在のステップと回答は保存され、次回続きから学べます。',stay:'学習を続ける',leave:'学習経路へ戻る',back:'← 戻る',continue:'続ける →',start:'学習開始 →',nextLine:'次の文を表示',dialogueReady:'会話全体を表示しました。',partner:'相手',you:'あなた',audioPending:'標準音声準備中',audioCopy:'第11課には承認済みの再生可能音声がありません。音声を使わない課題は続けられます。',choose:'回答を1つ選びます。不正解でも答えは表示しません。',correct:'正解',wrong:'もう一度確認しましょう',retry:'もう一度答える',matchHint:'左の韓国語を選び、対応する役割を選びます。',answerZone:'あなたの文',available:'使える語のかたまり',undo:'元に戻す',moveLeft:'左へ',moveRight:'右へ',check:'文を確認',empty:'空欄',retryMode:'間違いの集中再練習',remaining:'残り{count}問',summary:'学習完了',xpFirst:'初回完了 +50 XP',xpRepeat:'再完了 +0 XP',saved:'進捗を保存しました',review:'もう一度学ぶ',courses:'学習経路へ戻る',nextLesson:'次のレッスン',selectChunk:'語のかたまりを選び、役割を確認します。',topic:'主題',name:'名前',ending:'語尾',topicCopy:'저는で「私」を話題にします。',nameCopy:'하늘は本課で使う架空の名前です。',endingCopy:'하늘には終声ㄹがあるため이에요を使います。'}
  };

  const clone=value=>JSON.parse(JSON.stringify(value));
  const blankSession=()=>({step:0,answers:{},mistakes:[],retryQueue:[],retryMode:false,match:{},build:{},dialogue:{},inspect:{'copula-rule':'name'},completed:false,completionFirst:null});
  function normalizeSession(raw){
    const source=raw&&typeof raw==='object'?raw:{};
    const clean=blankSession();
    clean.step=Math.max(0,Math.min(config.steps.length-1,Number(source.step)||0));
    for(const key of ['answers','match','build','dialogue','inspect']) clean[key]=source[key]&&typeof source[key]==='object'?clone(source[key]):clean[key];
    clean.mistakes=Array.isArray(source.mistakes)?[...new Set(source.mistakes.filter(id=>config.steps.some(step=>step.id===id)))]:[];
    clean.retryQueue=Array.isArray(source.retryQueue)?source.retryQueue.filter(id=>clean.mistakes.includes(id)):[];
    clean.retryMode=source.retryMode===true&&clean.retryQueue.length>0;
    clean.completed=source.completed===true;
    clean.completionFirst=typeof source.completionFirst==='boolean'?source.completionFirst:null;
    return clean;
  }
  function completionPatch(profile){
    const completed=Array.isArray(profile.completedLessons)?profile.completedLessons:[];
    const first=!completed.includes(config.id);
    return {...profile,xp:(Number(profile.xp)||0)+(first?50:0),completedLessons:first?[...completed,config.id]:completed,lessonProgress:{...(profile.lessonProgress||{}),[config.id]:100}};
  }

  const stage=document.getElementById('lessonStage');
  const languageSelect=document.getElementById('language');
  const profileLanguage=global.NikigoState?.get?.().interfaceLanguage;
  const queryLanguage=new URLSearchParams(global.location.search).get('lang');
  let language=LANGUAGES.includes(queryLanguage)?queryLanguage:LANGUAGES.includes(profileLanguage)?profileLanguage:'en';
  let session;
  try{session=normalizeSession(JSON.parse(global.localStorage.getItem(SESSION_KEY)||'{}'));}catch{session=blankSession();}

  const tr=value=>typeof value==='string'?value:value?.[language]??value?.en??'';
  const ui=(key,data={})=>Object.entries(data).reduce((value,[name,replacement])=>String(value).replaceAll(`{${name}}`,replacement),COPY[language]?.[key]??COPY.en[key]??key);
  const escape=value=>String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const current=()=>config.steps[session.step];
  const buildExpected=step=>step.groups.map(group=>`${group.id}:${group.correct}`);
  const entries=step=>step.groups.flatMap(group=>group.options.map(option=>({key:`${group.id}:${option.id}`,korean:option.korean})));
  const announce=message=>{document.getElementById('announcer').textContent=message;};
  const addMistake=id=>{if(!session.mistakes.includes(id))session.mistakes.push(id);};
  const removeMistake=id=>{session.mistakes=session.mistakes.filter(item=>item!==id);session.retryQueue=session.retryQueue.filter(item=>item!==id);};
  const clearStepAnswer=step=>{delete session.answers[step.id];};
  function stepDone(step){if(step.type==='concept'&&step.dialogue)return(session.dialogue[step.id]||1)>=step.dialogue.length;if(INTERACTIVE.has(step.type))return session.answers[step.id]?.correct===true;return true;}
  function save(){
    global.localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    const percent=Math.min(99,Math.round(session.step/(config.steps.length-1)*100));
    global.NikigoState?.update?.(profile=>({...profile,interfaceLanguage:language,learningLanguage:language,lessonProgress:{...(profile.lessonProgress||{}),[config.id]:Math.max(Number(profile.lessonProgress?.[config.id])||0,percent)}}),`${config.id}:progress`);
  }
  function record(step,correct,selected){session.answers[step.id]={done:true,correct,selected};if(correct&&session.retryMode)removeMistake(step.id);else if(!correct)addMistake(step.id);save();render();announce(correct?ui('correct'):ui('wrong'));}

  function header(step,korean=false){return `<header class="taskHeader"><p class="eyebrow">${escape(tr(step.tag))}</p><h1${korean?' class="koreanTitle" lang="ko"':''}>${escape(tr(step.title))}</h1><p class="lead">${escape(tr(step.lead))}</p></header>`;}
  function renderAudios(step){
    const audios=[...(step.audios||[]),...(step.audio?[step.audio]:[])];
    if(!audios.length)return'';
    const playable=audios.map(audio=>({audio,result:global.NikigoAudio?.resolve?.(audio.text,audio.audioType,audio.lessonId)})).filter(item=>item.result?.playable&&item.result.path);
    if(!playable.length)return `<div class="audioReadiness classicFocusStatus" role="status"><strong>${escape(ui('audioPending'))}</strong><span>${escape(ui('audioCopy'))}</span></div>`;
    return `<div class="audioRow">${playable.map(({audio,result},index)=>`<button class="audioButton" type="button" data-action="audio" data-audio="${index}" data-src="${escape(result.path)}">${escape(tr(audio.label)||ui('audioPending'))}</button>`).join('')}</div>`;
  }
  function renderIntro(step){return `${header(step)}<ul class="introGoals">${step.items.map(item=>`<li><strong>${escape(tr(item.title))}</strong><span>${escape(tr(item.text))}</span></li>`).join('')}</ul>`;}
  function renderDialogue(step){const visible=Math.max(1,Math.min(step.dialogue.length,session.dialogue[step.id]||1));return `${header(step)}${renderAudios(step)}<div class="dialogue" aria-label="${escape(tr(step.title))}">${step.dialogue.slice(0,visible).map(line=>`<div class="bubble ${line.role==='B'?'isUser':''}"><span class="speaker">${escape(line.role==='B'?ui('you'):ui('partner'))}</span><span class="korean" lang="ko">${escape(line.korean)}</span><p>${escape(tr(line.translation))}</p></div>`).join('')}</div>${visible<step.dialogue.length?`<button class="inlineAction" type="button" data-action="dialogue-next">${escape(ui('nextLine'))}</button>`:`<p class="neutralHint">${escape(ui('dialogueReady'))}</p>`}`;}
  function renderConcept(step){
    if(step.id==='copula-rule'){
      const selected=session.inspect[step.id]||'name';
      const chunks=[['topic','저는'],['name','하늘'],['ending','이에요']];
      return `${header(step)}<p class="neutralHint">${escape(ui('selectChunk'))}</p><div class="conceptObjects" role="group" aria-label="${escape(ui('selectChunk'))}">${chunks.map(([id,korean])=>`<button class="conceptChunk" type="button" data-action="inspect" data-value="${id}" aria-pressed="${selected===id}"><strong lang="ko">${korean}</strong><span>${escape(ui(id))}</span></button>`).join('')}</div><section class="objectExplanation" aria-live="polite"><b>${escape(ui(selected))}</b><p>${escape(ui(`${selected}Copy`))}</p></section><ul class="conceptList">${step.items.map(item=>`<li><strong>${escape(tr(item.title))}</strong><span class="koreanExample" lang="ko">${escape(item.korean)}</span><span>${escape(tr(item.detail))}</span></li>`).join('')}</ul>`;
    }
    return `${header(step)}${step.items?.length?`<ul class="conceptList">${step.items.map(item=>`<li><strong>${escape(tr(item.title))}</strong><span class="koreanExample" lang="ko">${escape(item.korean||tr(item.text))}</span>${item.detail?`<span>${escape(tr(item.detail))}</span>`:''}</li>`).join('')}</ul>`:''}`;
  }
  function feedback(step,answer){return `<section class="feedback classicFocusFeedback ${answer.correct?'isCorrect':'isWrong'}" role="${answer.correct?'status':'alert'}"><strong>${escape(answer.correct?ui('correct'):ui('wrong'))}</strong><span>${escape(answer.correct?tr(step.explanation):tr(step.lead))}</span></section>`;}
  function renderChoice(step){const answer=session.answers[step.id];const context=step.context?.length?`<div class="dialogue">${step.context.map(line=>`<div class="bubble"><span class="speaker">${escape(ui('partner'))}</span><span class="korean" lang="ko">${escape(line.korean)}</span></div>`).join('')}</div>`:'';return `${header(step)}${context}${renderAudios(step)}<p class="neutralHint">${escape(ui('choose'))}</p><div class="choiceGrid" role="group" aria-label="${escape(tr(step.title))}">${step.options.map(option=>{const chosen=answer?.selected===option.id;const className=chosen?(answer.correct?'isCorrect':'isWrong'):'';return `<button class="choiceButton ${className}" type="button" data-action="answer" data-value="${escape(option.id)}" ${answer?'disabled':''}>${option.korean?`<span class="korean" lang="ko">${escape(option.korean)}</span>`:escape(tr(option.label))}</button>`;}).join('')}</div>${answer?feedback(step,answer):''}`;}
  function renderMatch(step){const state=session.match[step.id]||{left:null,done:[],error:false};const done=new Set(state.done||[]);const answer=session.answers[step.id];return `${header(step)}<p class="neutralHint">${escape(ui('matchHint'))}</p><div class="matchGrid" role="group" aria-label="${escape(tr(step.title))}"><div class="matchColumn">${step.pairs.map(pair=>`<button class="matchButton ${state.left===pair.id?'isSelected':''} ${done.has(pair.id)?'isDone':''}" type="button" data-action="match-left" data-value="${pair.id}" ${done.has(pair.id)?'disabled':''}>${escape(pair.leftKorean)}</button>`).join('')}</div><div class="matchColumn">${[...step.pairs].reverse().map(pair=>`<button class="matchButton ${done.has(pair.id)?'isDone':''}" type="button" data-action="match-right" data-value="${pair.id}" ${done.has(pair.id)?'disabled':''}>${escape(tr(pair.right))}</button>`).join('')}</div></div>${state.error?`<section class="feedback classicFocusFeedback isWrong" role="alert"><strong>${escape(ui('wrong'))}</strong><span>${escape(tr(step.retryPrompt||step.prompt||step.lead))}</span></section>`:''}${answer?feedback(step,answer):''}`;}
  function renderBuild(step){const all=entries(step),state=session.build[step.id]||{order:[],selected:null},order=state.order||[],answer=session.answers[step.id],placed=order.map(key=>all.find(item=>item.key===key)).filter(Boolean),empty=Math.max(0,step.groups.length-placed.length);return `${header(step)}<div class="buildArea"><section class="answerZone ${answer?.correct?'isCorrect':''}" aria-label="${escape(ui('answerZone'))}"><div class="answerLabel"><span>${escape(ui('answerZone'))}</span><span>${placed.length}/${step.groups.length}</span></div><div class="answerSlots">${placed.map(item=>`<button class="placedToken" type="button" data-action="select-placed" data-value="${item.key}" aria-pressed="${state.selected===item.key}">${escape(item.korean)}</button>`).join('')}${Array.from({length:empty},()=>`<span class="emptySlot">${escape(ui('empty'))}</span>`).join('')}</div></section>${answer?feedback(step,answer):''}${answer?.correct?'':`<div class="buildControls"><button type="button" data-action="undo" ${order.length?'':'disabled'}>${escape(ui('undo'))}</button><button type="button" data-action="move-left" ${state.selected?'':'disabled'}>${escape(ui('moveLeft'))}</button><button type="button" data-action="move-right" ${state.selected?'':'disabled'}>${escape(ui('moveRight'))}</button></div><div><span class="bankLabel">${escape(ui('available'))}</span><div class="tokenBank">${all.map(item=>`<button class="tokenButton" type="button" data-action="add-token" data-value="${item.key}" ${order.includes(item.key)||order.length>=step.groups.length?'disabled':''}>${escape(item.korean)}</button>`).join('')}</div></div><button class="checkAction" type="button" data-action="check-build" ${order.length===step.groups.length?'':'disabled'}>${escape(ui('check'))}</button>`}</div>`;}
  function completeLesson(){if(session.completed)return Boolean(session.completionFirst);const before=global.NikigoState?.get?.()||{};const first=!before.completedLessons?.includes(config.id);global.NikigoState?.update?.(completionPatch,`${config.id}:complete`);session.completed=true;session.completionFirst=first;global.localStorage.setItem(SESSION_KEY,JSON.stringify(session));return first;}
  function renderComplete(step){const first=completeLesson();return `<div class="completeView"><p class="eyebrow">${escape(ui('summary'))}</p><h1>${escape(tr(step.title))}</h1><p class="lead">${escape(tr(step.lead))}</p><p class="completePhrase" lang="ko">저는 하늘이에요.</p><ul class="masteryList"><li><strong lang="ko">이름이 뭐예요?</strong></li><li><strong lang="ko">이에요 / 예요</strong></li><li><strong lang="ko">만나서 반가워요.</strong></li></ul><div class="completionMeta"><strong>${escape(first?ui('xpFirst'):ui('xpRepeat'))}</strong><span>${escape(ui('saved'))}</span></div><nav class="lessonFoot classicFocusActions completeActions" aria-label="${escape(ui('navigation'))}"><button class="primaryAction" type="button" data-action="next-lesson">${escape(ui('nextLesson'))}</button><button class="secondaryAction" type="button" data-action="review">${escape(ui('review'))}</button><button class="textAction" type="button" data-action="home">${escape(ui('courses'))}</button></nav></div>`;}
  function renderBody(step){if(step.type==='intro')return renderIntro(step);if(step.type==='concept'&&step.dialogue)return renderDialogue(step);if(step.type==='concept')return renderConcept(step);if(['choice','scenario'].includes(step.type))return renderChoice(step);if(step.type==='match')return renderMatch(step);if(step.type==='build')return renderBuild(step);return renderComplete(step);}
  function renderFoot(step){if(step.type==='complete')return'';const done=stepDone(step),answer=session.answers[step.id];const retry=answer&&!answer.correct;const label=retry?ui('retry'):session.step===0?ui('start'):ui('continue');return `<nav class="lessonFoot classicFocusActions" aria-label="${escape(ui('navigation'))}"><button class="backAction" type="button" data-action="back" ${session.step===0||session.retryMode?'disabled':''}>${escape(ui('back'))}</button><button class="primaryAction" type="button" data-action="${retry?'reset-answer':'next'}" ${done||retry?'':'disabled'}>${escape(label)}</button></nav>`;}
  function contentTypeFor(step){
    if(session.retryMode)return'retry';
    if(step.type==='intro')return'intro';
    if(step.type==='concept'&&step.dialogue)return'dialogue';
    if(step.type==='concept')return'explanation';
    if(['choice','scenario'].includes(step.type))return'choice';
    if(step.type==='match')return'matching';
    if(step.type==='build')return'builder';
    return'completion';
  }
  function audioAvailabilityFor(step){
    const audios=[...(step.audios||[]),...(step.audio?[step.audio]:[])];
    if(!audios.length)return'none';
    const playable=audios.filter(audio=>global.NikigoAudio?.resolve?.(audio.text,audio.audioType,audio.lessonId)?.playable);
    if(!playable.length)return'pending';
    return playable.length===audios.length?'approved':'mixed';
  }
  function render(){
    const step=current();
    const percent=Math.round(session.step/(config.steps.length-1)*100);
    shell.update({
      lessonId:config.id,
      currentStep:session.step+1,
      totalSteps:config.steps.length,
      language,
      title:tr(config.name),
      stepLabel:ui('progress'),
      progress:percent,
      canGoPrevious:session.step>0&&!session.retryMode,
      canGoNext:stepDone(step),
      audioAvailability:audioAvailabilityFor(step),
      contentType:contentTypeFor(step),
      navigationLabel:ui('navigation'),
      languageLabel:ui('language'),
      brandActionLabel:ui('leave'),
      exitActionLabel:ui('exit'),
      skipLabel:ui('skip')
    });
    document.getElementById('exitDialogTitle').textContent=ui('exitTitle');
    document.getElementById('exitDialogCopy').textContent=ui('exitCopy');
    document.getElementById('exitCancelButton').textContent=ui('stay');
    document.getElementById('exitConfirmButton').textContent=ui('leave');
    const currentAnswer=session.answers[step.id];
    document.getElementById('announcer').textContent=currentAnswer?(currentAnswer.correct?ui('correct'):ui('wrong')):'';
    const retry=session.retryMode?`<div class="retryBanner classicFocusStatus"><strong>${escape(ui('retryMode'))}</strong><span>${escape(ui('remaining',{count:session.mistakes.length}))}</span></div>`:'';
    stage.innerHTML=`${retry}${renderBody(step)}${renderFoot(step)}`;
  }

  function learningPathUrl(){return `nikigo-app.html?lang=${language}&learnStage=K1&learnModule=k1-identity-and-language-background#courses`;}
  function navigateToStep(nextStep,push=true){session.step=Math.max(0,Math.min(config.steps.length-1,nextStep));save();if(push)global.history.pushState({nikigoStep:session.step},'',global.location.href);render();global.scrollTo({top:0,behavior:'auto'});stage.focus({preventScroll:true});}
  function beginRetry(){session.retryQueue=[...session.mistakes];session.retryMode=session.retryQueue.length>0;if(session.retryMode){session.step=config.steps.findIndex(step=>step.id===session.retryQueue[0]);for(const id of session.retryQueue){delete session.answers[id];delete session.match[id];delete session.build[id];}}save();render();}
  function next(){const step=current();if(!stepDone(step))return;if(session.retryMode){if(session.mistakes.length){beginRetry();return;}session.retryMode=false;navigateToStep(config.steps.length-1);return;}if(session.step===config.steps.length-2&&session.mistakes.length){beginRetry();return;}navigateToStep(session.step+1);}
  function resetAnswer(){const step=current();delete session.answers[step.id];if(step.type==='build')delete session.build[step.id];save();render();}
  function handleBuild(step,action,value){const state=session.build[step.id]||{order:[],selected:null};state.order=Array.isArray(state.order)?state.order:[];if(action==='add-token'&&!state.order.includes(value)&&state.order.length<step.groups.length){state.order.push(value);state.selected=value;}else if(action==='select-placed')state.selected=value;else if(action==='undo'){state.order.pop();state.selected=state.order.at(-1)||null;}session.build[step.id]=state;clearStepAnswer(step);save();render();}
  function moveBuild(step,direction){const state=session.build[step.id]||{order:[],selected:null};const index=state.order.indexOf(state.selected),target=index+direction;if(index<0||target<0||target>=state.order.length)return;[state.order[index],state.order[target]]=[state.order[target],state.order[index]];session.build[step.id]=state;clearStepAnswer(step);save();render();}

  stage.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    const step=current(),action=button.dataset.action,value=button.dataset.value;
    if(action==='next')next();
    else if(action==='back')navigateToStep(session.step-1);
    else if(action==='reset-answer')resetAnswer();
    else if(action==='dialogue-next'){session.dialogue[step.id]=Math.min(step.dialogue.length,(session.dialogue[step.id]||1)+1);save();render();}
    else if(action==='answer')record(step,value===step.correct,value);
    else if(action==='inspect'){session.inspect[step.id]=value;save();render();}
    else if(action==='match-left'){const state=session.match[step.id]||{left:null,done:[],error:false};state.left=value;state.error=false;session.match[step.id]=state;save();render();}
    else if(action==='match-right'){const state=session.match[step.id]||{left:null,done:[],error:false};if(!state.left)return;if(state.left===value){state.done=[...new Set([...(state.done||[]),value])];state.left=null;state.error=false;session.match[step.id]=state;if(state.done.length===step.pairs.length)record(step,true,state.done);else{save();render();}}else{state.left=null;state.error=true;session.match[step.id]=state;addMistake(step.id);save();render();announce(ui('wrong'));}}
    else if(['add-token','select-placed','undo'].includes(action))handleBuild(step,action,value);
    else if(action==='move-left')moveBuild(step,-1);
    else if(action==='move-right')moveBuild(step,1);
    else if(action==='check-build'){const expected=buildExpected(step),order=session.build[step.id]?.order||[];record(step,expected.length===order.length&&expected.every((key,index)=>order[index]===key),[...order]);}
    else if(action==='review'){session=blankSession();save();global.history.replaceState({nikigoStep:0},'',global.location.href);render();stage.focus();}
    else if(action==='home')global.location.href=learningPathUrl();
    else if(action==='next-lesson')global.location.href=`lesson-12.html?lang=${language}`;
    else if(action==='audio'){const path=button.dataset.src;if(!path)return;new Audio(path).play().catch(()=>{});}
  });
  stage.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(event.key))return;const button=event.target.closest('.choiceButton,.matchButton,.tokenButton,.conceptChunk,.placedToken');if(!button)return;const group=[...button.parentElement.querySelectorAll('button:not(:disabled)')],index=group.indexOf(button);if(index<0)return;event.preventDefault();const direction=['ArrowRight','ArrowDown'].includes(event.key)?1:-1;group[(index+direction+group.length)%group.length]?.focus();});
  function syncLanguageUrl(){const url=new URL(global.location.href);url.searchParams.set('lang',language);global.history.replaceState({nikigoStep:session.step},'',url);}
  function openExitDialog(){const dialog=document.getElementById('exitDialog');if(typeof dialog.showModal==='function')dialog.showModal();else if(global.confirm?.(ui('exitCopy')))global.location.href=learningPathUrl();}
  const shell=global.NikigoClassicFocusShell.mount({
    onLanguageChange(value){language=LANGUAGES.includes(value)?value:'en';save();syncLanguageUrl();render();},
    onBrandAction:openExitDialog,
    onExitAction:openExitDialog
  });
  document.getElementById('exitConfirmButton').addEventListener('click',event=>{event.preventDefault();global.location.href=learningPathUrl();});
  document.getElementById('exitCancelButton').addEventListener('click',()=>document.getElementById('exitDialog').close());
  global.addEventListener('keydown',event=>{if(event.key!=='Escape')return;const dialog=document.getElementById('exitDialog');if(dialog.open)dialog.close();else openExitDialog();});
  global.addEventListener('popstate',event=>{if(Number.isInteger(event.state?.nikigoStep)){session.step=Math.max(0,Math.min(config.steps.length-1,event.state.nikigoStep));save();render();stage.focus({preventScroll:true});}});
  global.history.replaceState({nikigoStep:session.step},'',global.location.href);
  global.NikigoSprintLessonTest={config,copy:COPY,blankSession,normalizeSession,completionPatch,getSession:()=>clone(session),setSession:value=>{session=normalizeSession(value);save();render();}};
  render();
})(window);
