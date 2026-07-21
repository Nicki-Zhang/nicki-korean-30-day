(function (global) {
  'use strict';

  const config = global.NikigoLessonConfig;
  if (!config || config.id !== 'lesson-11') throw new Error('Nikigo Clear Interactive requires lesson-11.');

  global.NikigoCurrentLesson = Object.freeze({lessonId:config.id});
  const LANGUAGES = ['zh','en','vi','ja'];
  const SESSION_KEY = `nikigoLessonSession:${config.id}`;
  const PHASE_BY_STEP = [0,1,1,2,3,4,4,5,5,6,6,7,7];
  const COPY = {
    zh:{progress:'8个学习阶段',home:'课程',back:'返回',next:'继续',start:'开始任务',finish:'完成课程',correct:'正确',incorrect:'再观察一下结构',choiceHint:'选择一个回答。错误时不会提前显示答案。',matchHint:'先选择一个韩语表达，再选择它的作用。',build:'检查',audio:'播放音频',audioPending:'精确approved音频尚不可用',audioError:'音频加载失败',retry:'错题重练',remaining:'还需答对 {count} 项',xpEarned:'首次完成 +50 XP',xpClaimed:'重复完成 +0 XP',saved:'进度已保存',reviewLesson:'重新学习',returnCourses:'返回课程',nextLesson:'下一站：国家与语言',dialogueNext:'显示下一句',dialogueReady:'对话已完整展开',inspect:'点击词块，观察它在句子里的作用',topic:'话题',name:'姓名',ending:'结尾',topicExplain:'저는先建立“我”的话题，后面再补充介绍内容。',nameExplain:'하늘是虚构姓名，放在话题之后。',endingExplain:'이에요礼貌地完成陈述；하늘有받침ㄹ，所以使用이에요。',answerZone:'你的句子',available:'可用词块',undo:'撤销',moveLeft:'左移',moveRight:'右移',selectPlaced:'选择已放置的词块后再调整顺序。',wrongHint:'先观察哪一块建立话题，再判断哪一块完成介绍。答案不会在这里直接显示。',correctWhy:'结构成立：저는先建立话题，姓名或身份放在中间，礼貌结尾完成陈述。',matched:'已配对',goals:'本课目标',stages:'8个视觉阶段 · 13个内部步骤',time:'约8分钟',mastered:'掌握总结',masteryAsk:'询问对方姓名：이름이 뭐예요?',masteryEnding:'根据받침选择이에요 / 예요',masteryIntro:'介绍姓名与中性身份',nextPreview:'下一课学习固定表达“___에서 왔어요?”，说明来自哪个国家。',firstMeet:'第一次见面时，用韩语介绍自己',coreKorean:'이름이 뭐예요?',openingLead:'学习询问姓名、表达身份，并自然回应“很高兴见到你”。',empty:'空位',checkReady:'句子已填满，可以检查。'},
    en:{progress:'8 learning stages',home:'Courses',back:'Back',next:'Continue',start:'Start task',finish:'Complete lesson',correct:'Correct',incorrect:'Look at the structure again',choiceHint:'Choose one response. A wrong choice never reveals the answer.',matchHint:'Choose a Korean expression, then choose its role.',build:'Check',audio:'Play audio',audioPending:'Exact approved audio is unavailable',audioError:'Audio failed to load',retry:'Mistake review',remaining:'Correct {count} more item(s)',xpEarned:'First completion +50 XP',xpClaimed:'Repeat completion +0 XP',saved:'Progress saved',reviewLesson:'Review again',returnCourses:'Return to courses',nextLesson:'Next: Countries and Languages',dialogueNext:'Show next line',dialogueReady:'The full dialogue is now visible',inspect:'Select a chunk to inspect its role in the sentence',topic:'Topic',name:'Name',ending:'Ending',topicExplain:'저는 establishes “me” as the topic before the introduction continues.',nameExplain:'하늘 is a fictional name placed after the topic.',endingExplain:'이에요 completes a polite statement. 하늘 ends in ㄹ, so it takes 이에요.',answerZone:'Your sentence',available:'Available chunks',undo:'Undo',moveLeft:'Move left',moveRight:'Move right',selectPlaced:'Select a placed chunk before changing its order.',wrongHint:'Find the chunk that establishes the topic, then the chunk that completes the introduction. The final order is not shown.',correctWhy:'The structure works: 저는 sets the topic, the name or identity sits in the middle, and the polite ending completes the statement.',matched:'Matched',goals:'Lesson goals',stages:'8 visual stages · 13 internal steps',time:'About 8 minutes',mastered:'Mastery summary',masteryAsk:'Ask a name: 이름이 뭐예요?',masteryEnding:'Choose 이에요 / 예요 from the final consonant',masteryIntro:'Introduce a name and neutral identity',nextPreview:'Next, learn the fixed pattern “___에서 왔어요?” to say where someone comes from.',firstMeet:'Introduce yourself in Korean at a first meeting',coreKorean:'이름이 뭐예요?',openingLead:'Ask a name, state an identity, and respond naturally with “nice to meet you.”',empty:'Empty slot',checkReady:'The sentence is full and ready to check.'},
    vi:{progress:'8 chặng học',home:'Bài học',back:'Quay lại',next:'Tiếp tục',start:'Bắt đầu nhiệm vụ',finish:'Hoàn thành bài',correct:'Chính xác',incorrect:'Hãy quan sát lại cấu trúc',choiceHint:'Chọn một câu trả lời. Lựa chọn sai sẽ không làm lộ đáp án.',matchHint:'Chọn một biểu thức tiếng Hàn rồi chọn chức năng của nó.',build:'Kiểm tra',audio:'Phát âm thanh',audioPending:'Chưa có âm thanh approved khớp chính xác',audioError:'Không tải được âm thanh',retry:'Luyện lại câu sai',remaining:'Cần trả lời đúng thêm {count} mục',xpEarned:'Hoàn thành lần đầu +50 XP',xpClaimed:'Hoàn thành lại +0 XP',saved:'Đã lưu tiến độ',reviewLesson:'Học lại',returnCourses:'Về danh sách bài',nextLesson:'Tiếp theo: Quốc gia và ngôn ngữ',dialogueNext:'Hiện câu tiếp theo',dialogueReady:'Đã hiện đầy đủ hội thoại',inspect:'Chọn một khối để xem vai trò của nó trong câu',topic:'Chủ đề',name:'Tên',ending:'Kết thúc',topicExplain:'저는 đặt “tôi” làm chủ đề trước khi tiếp tục phần giới thiệu.',nameExplain:'하늘 là tên hư cấu, đặt sau chủ đề.',endingExplain:'이에요 hoàn thành câu trần thuật lịch sự. 하늘 có âm cuối ㄹ nên dùng 이에요.',answerZone:'Câu của bạn',available:'Khối có thể dùng',undo:'Hoàn tác',moveLeft:'Chuyển trái',moveRight:'Chuyển phải',selectPlaced:'Chọn một khối đã đặt rồi mới đổi thứ tự.',wrongHint:'Trước tiên tìm khối nêu chủ đề, rồi xem khối nào hoàn tất lời giới thiệu. Đáp án cuối không được hiển thị.',correctWhy:'Cấu trúc đúng: 저는 nêu chủ đề, tên hoặc thân phận ở giữa, và đuôi lịch sự hoàn thành câu.',matched:'Đã ghép',goals:'Mục tiêu bài học',stages:'8 chặng trực quan · 13 bước nội bộ',time:'Khoảng 8 phút',mastered:'Tóm tắt đã nắm vững',masteryAsk:'Hỏi tên: 이름이 뭐예요?',masteryEnding:'Chọn 이에요 / 예요 theo âm cuối',masteryIntro:'Giới thiệu tên và thân phận trung tính',nextPreview:'Bài tiếp theo học mẫu cố định “___에서 왔어요?” để nói đến từ quốc gia nào.',firstMeet:'Giới thiệu bản thân bằng tiếng Hàn khi gặp lần đầu',coreKorean:'이름이 뭐예요?',openingLead:'Hỏi tên, nêu thân phận và đáp lại tự nhiên “rất vui được gặp bạn”.',empty:'Ô trống',checkReady:'Câu đã đầy đủ và có thể kiểm tra.'},
    ja:{progress:'8つの学習段階',home:'コース',back:'戻る',next:'続ける',start:'課題を始める',finish:'レッスン完了',correct:'正解',incorrect:'構造をもう一度見ましょう',choiceHint:'回答を1つ選びます。不正解でも答えは表示しません。',matchHint:'韓国語表現を選び、その役割を選びます。',build:'確認',audio:'音声を再生',audioPending:'完全一致のapproved音声は利用できません',audioError:'音声を読み込めませんでした',retry:'間違いの再練習',remaining:'あと {count} 項目を正解してください',xpEarned:'初回完了 +50 XP',xpClaimed:'再完了 +0 XP',saved:'進捗を保存しました',reviewLesson:'もう一度学ぶ',returnCourses:'コースへ戻る',nextLesson:'次へ：国とことば',dialogueNext:'次の文を表示',dialogueReady:'会話全体を表示しました',inspect:'語のかたまりを選び、文での役割を観察します',topic:'話題',name:'名前',ending:'語尾',topicExplain:'저는で「私」を話題にしてから、紹介内容を続けます。',nameExplain:'하늘は架空の名前で、話題の後に置きます。',endingExplain:'이에요で丁寧な文を完成します。하늘は終声ㄹがあるため이에요を使います。',answerZone:'あなたの文',available:'使える語のかたまり',undo:'元に戻す',moveLeft:'左へ移動',moveRight:'右へ移動',selectPlaced:'置いた語を選んでから順序を変えます。',wrongHint:'まず話題を作る語を探し、次に紹介を完成させる語を考えます。正しい順序は表示しません。',correctWhy:'저는で話題を作り、名前や立場を中央に置き、丁寧な語尾で文を完成する構造です。',matched:'対応済み',goals:'学習目標',stages:'8つの視覚段階・13の内部ステップ',time:'約8分',mastered:'習得まとめ',masteryAsk:'名前を尋ねる：이름이 뭐예요?',masteryEnding:'パッチムから이에요 / 예요を選ぶ',masteryIntro:'名前と中立的な立場を紹介する',nextPreview:'次は固定表現「___에서 왔어요?」で出身国を伝えます。',firstMeet:'初対面で韓国語の自己紹介をする',coreKorean:'이름이 뭐예요?',openingLead:'名前を尋ね、立場を伝え、「会えてうれしいです」と自然に応答します。',empty:'空欄',checkReady:'文が埋まり、確認できます。'}
  };

  const clone = value => JSON.parse(JSON.stringify(value));
  const blankSession = () => ({step:0,answers:{},mistakes:[],retryQueue:[],retryMode:false,match:{},build:{},dialogue:{},inspect:{'copula-rule':'name'},completed:false,completionFirst:null});
  function normalizeSession(raw) {
    const source = raw && typeof raw === 'object' ? raw : {};
    const clean = blankSession();
    clean.step = Math.max(0,Math.min(config.steps.length-1,Number(source.step)||0));
    for (const key of ['answers','match','build','dialogue','inspect']) clean[key] = source[key] && typeof source[key] === 'object' ? clone(source[key]) : clean[key];
    clean.mistakes = Array.isArray(source.mistakes) ? [...new Set(source.mistakes.filter(id=>config.steps.some(step=>step.id===id)))] : [];
    clean.retryQueue = Array.isArray(source.retryQueue) ? source.retryQueue.filter(id=>clean.mistakes.includes(id)) : [];
    clean.retryMode = source.retryMode === true && clean.retryQueue.length > 0;
    clean.completed = source.completed === true;
    clean.completionFirst = typeof source.completionFirst === 'boolean' ? source.completionFirst : null;
    return clean;
  }
  function completionPatch(profile) {
    const completed = Array.isArray(profile.completedLessons) ? profile.completedLessons : [];
    const first = !completed.includes(config.id);
    return {...profile,xp:(Number(profile.xp)||0)+(first?50:0),completedLessons:first?[...completed,config.id]:completed,lessonProgress:{...(profile.lessonProgress||{}),[config.id]:100}};
  }
  global.NikigoSprintLessonTest = {config,copy:COPY,blankSession,normalizeSession,completionPatch,phaseByStep:PHASE_BY_STEP};

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
  const escape = value => String(value??'').replace(/[&<>"]/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[char]));
  const current = () => config.steps[session.step];
  const isInteractive = step => ['choice','scenario','listening','match','build'].includes(step.type);
  const isProgressiveDialogue = step => step.type==='concept' && Array.isArray(step.dialogue);
  const stepDone = step => {
    if (isProgressiveDialogue(step)) return (session.dialogue[step.id]||1) >= step.dialogue.length;
    return !isInteractive(step) || Boolean(session.answers[step.id]?.done);
  };
  function save() {
    global.localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    const percent=Math.round((session.step/(config.steps.length-1))*100);
    global.NikigoState?.update?.(profile=>({...profile,interfaceLanguage:language,learningLanguage:language,lessonProgress:{...(profile.lessonProgress||{}),[config.id]:Math.max(Number(profile.lessonProgress?.[config.id])||0,percent)}}),`${config.id}:progress`);
  }
  function notify(message){const toast=document.getElementById('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1800);}
  function addMistake(id){if(!session.mistakes.includes(id))session.mistakes.push(id);}
  function removeMistake(id){session.mistakes=session.mistakes.filter(item=>item!==id);session.retryQueue=session.retryQueue.filter(item=>item!==id);}
  function record(step,correct,selected){session.answers[step.id]={done:true,correct,selected};if(correct&&session.retryMode)removeMistake(step.id);if(!correct)addMistake(step.id);save();render();}
  function audioResult(audio){return global.NikigoAudio?.resolve?.(audio.text,audio.audioType,audio.lessonId);}

  function header(step,korean=false) {
    return `<p class="eyebrow">${escape(tr(step.tag))}</p><h1${korean?' class="koreanTitle"':''}>${escape(korean?ui('coreKorean'):tr(step.title))}</h1><p class="lead">${escape(step.id==='intro'?ui('openingLead'):tr(step.lead))}</p>`;
  }
  function renderAudios(step) {
    const audios=[...(step.audios||[]),...(step.audio?[step.audio]:[])];
    if(!audios.length)return '';
    return `<div class="audioRow">${audios.map((audio,index)=>{const result=audioResult(audio);const playable=Boolean(result?.playable&&result.path);return `<button class="audioButton" type="button" data-action="audio" data-audio="${index}" ${playable?'':'disabled aria-disabled="true"'}>${escape(playable?(tr(audio.label)||ui('audio')):ui('audioPending'))}</button>`;}).join('')}</div>`;
  }
  function renderIntro(step) {
    return `${header(step,true)}<div class="stageMeta"><span><b>${escape(ui('stages'))}</b></span><span>${escape(ui('time'))}</span></div><ol class="goalList" aria-label="${escape(ui('goals'))}">${step.items.map((item,index)=>`<li><b>0${index+1}</b><div><strong>${escape(tr(item.title))}</strong><span>${escape(tr(item.text))}</span></div></li>`).join('')}</ol>`;
  }
  function renderDialogue(step) {
    const visible=Math.max(1,Math.min(step.dialogue.length,session.dialogue[step.id]||1));
    return `${header(step)}<div class="dialogue" aria-label="Dialogue">${step.dialogue.map((line,index)=>`<div class="dialogueLine ${line.role==='B'?'fromB':''} ${index<visible?'isVisible':''} ${index===visible-1?'isCurrent':''}" ${index>=visible?'hidden':''}>${line.role==='B'?`<div class="speech"><span class="korean">${escape(line.korean)}</span><p>${escape(tr(line.translation))}</p></div><span class="speaker" aria-label="Speaker ${escape(line.role)}">${escape(line.role)}</span>`:`<span class="speaker" aria-label="Speaker ${escape(line.role)}">${escape(line.role)}</span><div class="speech"><span class="korean">${escape(line.korean)}</span><p>${escape(tr(line.translation))}</p></div>`}</div>`).join('')}</div>${renderAudios(step)}${visible<step.dialogue.length?`<button class="inlineAction" type="button" data-action="dialogue-next">${escape(ui('dialogueNext'))}</button>`:`<p class="neutralHint">${escape(ui('dialogueReady'))}</p>`}`;
  }
  function renderConcept(step) {
    if(step.id==='copula-rule') {
      const selected=session.inspect[step.id]||'name';
      const objects=[['topic','저는'],['name','하늘'],['ending','이에요']];
      return `${header(step)}<p class="conceptPrompt">${escape(ui('inspect'))}</p><div class="conceptObjects" role="group" aria-label="${escape(ui('inspect'))}">${objects.map(([id,korean])=>`<button class="conceptChunk" type="button" data-action="inspect" data-value="${id}" aria-pressed="${selected===id}"><strong>${korean}</strong><span>${escape(ui(id))}</span></button>`).join('')}</div><section class="objectExplanation" aria-live="polite"><b>${escape(ui(selected))}</b><p>${escape(ui(`${selected}Explain`))}</p></section><div class="ruleExamples">${step.items.map(item=>`<div class="ruleExample"><small>${escape(tr(item.title))}</small><strong>${escape(item.korean)}</strong></div>`).join('')}</div>`;
    }
    const items=(step.items||[]).map((item,index)=>`<li><b>0${index+1}</b><div><strong>${escape(tr(item.title))}</strong><span>${escape(item.korean||tr(item.text))}</span>${item.detail?`<span>${escape(tr(item.detail))}</span>`:''}</div></li>`).join('');
    return `${header(step)}${items?`<ol class="goalList">${items}</ol>`:''}`;
  }
  function renderChoice(step) {
    const answer=session.answers[step.id];
    const context=step.context?.length?`<div class="dialogue">${step.context.map(line=>`<div class="dialogueLine isVisible isCurrent"><span class="speaker">${escape(line.role)}</span><div class="speech"><span class="korean">${escape(line.korean)}</span></div></div>`).join('')}</div>`:'';
    return `${header(step)}${context}${renderAudios(step)}<p class="neutralHint">${escape(ui('choiceHint'))}</p><div class="choiceGrid">${step.options.map(option=>{const chosen=answer?.selected===option.id;const cls=chosen?(answer.correct?'isChosen':'isWrong'):'';return `<button class="choiceButton ${cls}" type="button" data-action="answer" data-value="${escape(option.id)}" ${answer?'disabled':''}>${option.korean?`<span class="korean">${escape(option.korean)}</span>`:escape(tr(option.label))}</button>`;}).join('')}</div>${answer?renderFeedback(answer.correct,step):''}`;
  }
  function renderMatch(step) {
    const state=session.match[step.id]||{left:null,done:[]};
    const done=new Set(state.done||[]); const answer=session.answers[step.id];
    return `${header(step)}<p class="matchHint">${escape(ui('matchHint'))}</p><div class="matchGrid"><div class="matchColumn">${step.pairs.map(pair=>`<button class="matchButton ${state.left===pair.id?'isSelected':''} ${done.has(pair.id)?'isDone':''}" type="button" data-action="match-left" data-value="${pair.id}" ${done.has(pair.id)?'disabled':''}>${escape(pair.leftKorean||tr(pair.left))}</button>`).join('')}</div><div class="matchColumn">${[...step.pairs].reverse().map(pair=>`<button class="matchButton ${done.has(pair.id)?'isDone':''}" type="button" data-action="match-right" data-value="${pair.id}" ${done.has(pair.id)?'disabled':''}>${escape(pair.rightKorean||tr(pair.right))}</button>`).join('')}</div></div>${answer?renderFeedback(true,step):''}`;
  }
  function tokenEntries(step) {
    return step.groups.flatMap(group=>group.options.map(option=>({key:`${group.id}:${option.id}`,group:group.id,id:option.id,korean:option.korean,label:tr(group.label)})));
  }
  function renderBuild(step) {
    const entries=tokenEntries(step);
    const state=session.build[step.id]||{order:[],selected:null};
    const order=Array.isArray(state.order)?state.order:[];
    const answer=session.answers[step.id];
    const placed=order.map(key=>entries.find(entry=>entry.key===key)).filter(Boolean);
    const empty=Math.max(0,step.groups.length-placed.length);
    const correctClass=answer?.correct?'isCorrect isMerged':answer?'isWrong':'';
    const editor=answer?.correct?'':`<div class="buildControls"><button type="button" data-action="undo" ${!order.length?'disabled':''}>${escape(ui('undo'))}</button><button type="button" data-action="move-left" ${!state.selected?'disabled':''}>${escape(ui('moveLeft'))}</button><button type="button" data-action="move-right" ${!state.selected?'disabled':''}>${escape(ui('moveRight'))}</button></div><p class="neutralHint">${escape(answer?ui('wrongHint'):order.length===step.groups.length?ui('checkReady'):ui('selectPlaced'))}</p><span class="tokenBankLabel">${escape(ui('available'))}</span><div class="tokenBank">${entries.map(entry=>`<button class="tokenButton" type="button" data-action="add-token" data-value="${entry.key}" ${order.includes(entry.key)||order.length>=step.groups.length?'disabled':''}>${escape(entry.korean)}</button>`).join('')}</div><button class="inlineAction" type="button" data-action="confirm-build" ${order.length===step.groups.length?'':'disabled'}>${escape(ui('build'))}</button>`;
    return `${header(step)}<div class="buildArea"><section class="answerZone ${correctClass}" aria-label="${escape(ui('answerZone'))}"><div class="answerLabel"><span>${escape(ui('answerZone'))}</span><span>${placed.length}/${step.groups.length}</span></div><div class="answerSlots">${placed.map(entry=>`<button class="placedToken" type="button" data-action="select-placed" data-value="${entry.key}" aria-pressed="${state.selected===entry.key}">${escape(entry.korean)}</button>`).join('')}${Array.from({length:empty},()=>`<span class="emptySlot">${escape(ui('empty'))}</span>`).join('')}</div></section>${answer?renderFeedback(answer.correct,step):''}${editor}</div>`;
  }
  function renderFeedback(correct,step) {
    return `<section class="feedback ${correct?'isCorrect':'isWrong'}" role="status"><div class="feedbackHeader"><span class="feedbackIcon" aria-hidden="true">${correct?'✓':'!'}</span><span>${escape(correct?ui('correct'):ui('incorrect'))}</span></div><p>${escape(correct?(step.type==='build'?ui('correctWhy'):tr(step.explanation)):ui('wrongHint'))}</p></section>`;
  }
  function completeLesson() {
    if(session.completed) return Boolean(session.completionFirst);
    const before=global.NikigoState?.get?.()||{};
    const first=!before.completedLessons?.includes(config.id);
    global.NikigoState?.update?.(completionPatch,`${config.id}:complete`);
    session.completed=true; session.completionFirst=first; save();
    return first;
  }
  function renderComplete(step) {
    const first=completeLesson();
    return `<p class="eyebrow">${escape(ui('mastered'))}</p><h1>${escape(tr(step.lead))}</h1><p class="completePhrase">저는 하늘이에요.</p><ul class="masteryList"><li><b>✓</b><div><strong>${escape(ui('masteryAsk'))}</strong></div></li><li><b>✓</b><div><strong>${escape(ui('masteryEnding'))}</strong></div></li><li><b>✓</b><div><strong>${escape(ui('masteryIntro'))}</strong></div></li></ul><div class="completionMeta"><strong>${escape(first?ui('xpEarned'):ui('xpClaimed'))}</strong><span>${escape(ui('saved'))}</span></div><p class="nextPreview"><b>${escape(ui('nextLesson'))}</b><br>${escape(ui('nextPreview'))}</p><div class="lessonFoot completeActions"><button class="primaryAction" data-action="next-lesson">${escape(ui('nextLesson'))}</button><button class="secondaryAction" data-action="review">${escape(ui('reviewLesson'))}</button><button class="textAction" data-action="home">${escape(ui('returnCourses'))}</button></div>`;
  }
  function renderBody(step) {
    if(step.type==='intro') return renderIntro(step);
    if(isProgressiveDialogue(step)) return renderDialogue(step);
    if(step.type==='concept') return renderConcept(step);
    if(['choice','scenario','listening'].includes(step.type)) return renderChoice(step);
    if(step.type==='match') return renderMatch(step);
    if(step.type==='build') return renderBuild(step);
    return '';
  }
  function foot(step) {
    const done=stepDone(step);
    if(step.type==='build'&&!session.answers[step.id]?.correct)return `<div class="lessonFoot single"><button class="secondaryAction" data-action="back" ${session.retryMode?'disabled':''}>${escape(ui('back'))}</button></div>`;
    return `<div class="lessonFoot"><button class="secondaryAction" data-action="back" ${session.step===0||session.retryMode?'disabled':''}>${escape(ui('back'))}</button><button class="primaryAction" data-action="next" ${done?'':'disabled'}>${escape(session.step===config.steps.length-2?ui('finish'):session.step===0?ui('start'):ui('next'))}</button></div>`;
  }
  function updateProgress() {
    const phase=PHASE_BY_STEP[session.step]??7;
    const percent=Math.round((session.step/(config.steps.length-1))*100);
    document.getElementById('progressCount').textContent=`${session.step+1} / ${config.steps.length}`;
    const track=document.getElementById('progressTrack'); track.setAttribute('aria-valuenow',String(percent));
    [...track.children].forEach((node,index)=>{node.className=index<phase?'done':index===phase?'current':'';});
  }
  function render() {
    const step=current();
    document.documentElement.lang=language==='zh'?'zh-CN':language;
    languageSelect.value=language;
    document.getElementById('lessonName').textContent=tr(config.name);
    document.getElementById('progressLabel').textContent=ui('progress');
    document.getElementById('homeButton').textContent=ui('home');
    updateProgress();
    if(step.type==='complete'){stage.innerHTML=renderComplete(step);return;}
    const retry=session.retryMode?`<div class="retryBanner">${escape(ui('retry'))} · <span>${escape(format(ui('remaining'),{count:session.mistakes.length}))}</span></div>`:'';
    stage.innerHTML=`${retry}${renderBody(step)}${foot(step)}`;
  }
  function clearStepAnswer(step) { delete session.answers[step.id]; }
  function beginRetry(){session.retryQueue=[...session.mistakes];session.retryMode=session.retryQueue.length>0;if(session.retryMode){session.step=config.steps.findIndex(step=>step.id===session.retryQueue[0]);for(const id of session.retryQueue){delete session.answers[id];delete session.match[id];delete session.build[id];}}save();render();}
  function navigateToStep(nextStep,push=true){session.step=Math.max(0,Math.min(config.steps.length-1,nextStep));save();if(push)global.history.pushState({nikigoStep:session.step},'',global.location.href);render();global.scrollTo({top:0,behavior:'instant'});}
  function next(){const step=current();if(!stepDone(step))return;if(session.retryMode){if(session.mistakes.length){session.retryQueue=[...session.mistakes];const index=config.steps.findIndex(item=>item.id===session.retryQueue[0]);for(const id of session.retryQueue){delete session.answers[id];delete session.match[id];delete session.build[id];}navigateToStep(index);}else{session.retryMode=false;navigateToStep(config.steps.length-1);}return;}if(session.step===config.steps.length-2&&session.mistakes.length){beginRetry();return;}navigateToStep(session.step+1);}
  function moveBuild(step,direction){const state=session.build[step.id]||{order:[],selected:null};const index=state.order.indexOf(state.selected);const target=index+direction;if(index<0||target<0||target>=state.order.length)return;[state.order[index],state.order[target]]=[state.order[target],state.order[index]];session.build[step.id]=state;clearStepAnswer(step);save();render();}
  function handleBuild(step,action,value){const state=session.build[step.id]||{order:[],selected:null};state.order=Array.isArray(state.order)?state.order:[];if(action==='add-token'&&!state.order.includes(value)&&state.order.length<step.groups.length){state.order.push(value);state.selected=value;}else if(action==='select-placed'){state.selected=value;}else if(action==='undo'){state.order.pop();state.selected=state.order.at(-1)||null;}session.build[step.id]=state;clearStepAnswer(step);save();render();}

  stage.addEventListener('click',event=>{
    const button=event.target.closest('button'); if(!button)return;
    const step=current(); const action=button.dataset.action;
    if(action==='next')next();
    else if(action==='back')navigateToStep(session.step-1);
    else if(action==='home'||action==='home-logo')global.location.href=`nikigo-app.html?lang=${language}#courses`;
    else if(action==='next-lesson')global.location.href=`lesson-12.html?lang=${language}`;
    else if(action==='review'){session=blankSession();save();global.history.replaceState({nikigoStep:0},'',global.location.href);render();global.scrollTo(0,0);}
    else if(action==='dialogue-next'){session.dialogue[step.id]=Math.min(step.dialogue.length,(session.dialogue[step.id]||1)+1);save();render();}
    else if(action==='inspect'){session.inspect[step.id]=button.dataset.value;save();render();}
    else if(action==='answer')record(step,button.dataset.value===step.correct,button.dataset.value);
    else if(action==='match-left'){const state=session.match[step.id]||{left:null,done:[]};state.left=button.dataset.value;session.match[step.id]=state;save();render();}
    else if(action==='match-right'){const state=session.match[step.id]||{left:null,done:[]};if(!state.left)return;if(state.left===button.dataset.value){state.done=[...new Set([...(state.done||[]),state.left])];state.left=null;session.match[step.id]=state;if(state.done.length===step.pairs.length)record(step,true,state.done);else{save();render();}}else{addMistake(step.id);state.left=null;session.match[step.id]=state;save();notify(ui('incorrect'));render();}}
    else if(['add-token','select-placed','undo'].includes(action))handleBuild(step,action,button.dataset.value);
    else if(action==='move-left')moveBuild(step,-1);
    else if(action==='move-right')moveBuild(step,1);
    else if(action==='confirm-build'){const state=session.build[step.id]||{order:[]};const expected=step.groups.map(group=>`${group.id}:${group.correct}`);const correct=expected.length===state.order?.length&&expected.every((key,index)=>state.order[index]===key);record(step,correct,[...(state.order||[])]);}
    else if(action==='audio'){const audio=[...(step.audios||[]),...(step.audio?[step.audio]:[])][Number(button.dataset.audio)||0];const result=audioResult(audio);if(!result?.playable||!result.path)return;const media=new Audio(result.path);media.play().catch(()=>notify(ui('audioError')));}
  });
  stage.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight'].includes(event.key))return;
    const button=event.target.closest('.conceptChunk,.tokenButton,.placedToken,.choiceButton,.matchButton');if(!button)return;
    const group=[...button.parentElement.querySelectorAll(button.classList.contains('conceptChunk')?'.conceptChunk':button.classList.contains('tokenButton')?'.tokenButton':button.classList.contains('placedToken')?'.placedToken':button.classList.contains('choiceButton')?'.choiceButton':'.matchButton')].filter(item=>!item.disabled);
    const index=group.indexOf(button);if(index<0)return;event.preventDefault();group[(index+(event.key==='ArrowRight'?1:-1)+group.length)%group.length]?.focus();
  });
  languageSelect.addEventListener('change',event=>{language=LANGUAGES.includes(event.target.value)?event.target.value:'en';save();render();});
  document.getElementById('homeButton').addEventListener('click',()=>{global.location.href=`nikigo-app.html?lang=${language}#courses`;});
  document.getElementById('homeLogo').addEventListener('click',()=>{global.location.href=`nikigo-app.html?lang=${language}#courses`;});
  global.addEventListener('popstate',event=>{if(Number.isInteger(event.state?.nikigoStep)){session.step=Math.max(0,Math.min(config.steps.length-1,event.state.nikigoStep));save();render();}});
  global.history.replaceState({nikigoStep:session.step},'',global.location.href);
  render();
})(window);
