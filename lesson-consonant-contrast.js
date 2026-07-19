(function (global) {
  'use strict';

  const LESSON_ID = 'k0-consonant-contrast';
  const SESSION_KEY = `nikigoLessonSession:${LESSON_ID}`;
  const LANGUAGES = ['zh', 'en', 'vi', 'ja'];
  const HOSTED_AUDIO = Object.freeze({});
  const CATEGORY_KEYS = ['plain', 'aspirated', 'tense'];

  const UI = {
    zh: {
      lessonName:'第4课 · 听懂普通音、送气音和紧音', progress:'课程进度', home:'返回学习主页', back:'返回', next:'继续', finish:'完成课程',
      introTag:'K0 · 10分钟', introTitle:'听懂普通音、送气音和紧音', introLead:'通过完整韩语音节，初步听出气流和紧张度的差别。完成一次练习只是建立起点，不代表已经完全掌握。',
      goal1:'听完整音节', goal1d:'不播放孤立辅音裸音。', goal2:'比较气流', goal2d:'送气音有更明显的气流。', goal3:'感受紧张度', goal3d:'紧音先收紧，气流较少。',
      conceptTitle:'三个类别，关注两件事', conceptLead:'先听气流强弱，再感受口腔和喉部是否收紧。', plain:'普通音', aspirated:'送气音', tense:'紧音',
      plainConcept:'气流较自然；词首常介于清音与浊音之间。', aspiratedConcept:'爆破后有明显气流，可以把手放在嘴前感受。', tenseConcept:'喉部和口腔先收紧，爆破短而有力，气流较少。',
      groupLead:'点击每个完整音节分别试听，再使用连续对比。', symbol:'韩文字母', letterName:'字母名称', example:'示例音节', listenSound:'听{category} {syllable}', listenSequence:'连续听 {sequence}', romanSummary:'展开近似提示', romanNote:'罗马音只用于初步定位，不能代替韩语音频、口型和气流感受。',
      tipPlain:'保持自然气流，不要刻意加重。', tipAspirated:'发音时有明显气流。', tipTense:'喉部和口腔先收紧，气流较少。',
      quizTag:'听辨练习', replay:'再次播放 {content}', replaySequence:'再次连续播放 {sequence}', chooseSyllable:'播放一个完整音节。选择你听到的音节。', chooseAspirated:'连续播放三个独立音节。选择其中的送气音。', chooseCategory:'播放一个完整音节。判断它属于普通音、送气音还是紧音。',
      correct:'正确。{detail}', incorrect:'再听一次。{detail}', detailPlain:'普通音的气流自然，不刻意送气或收紧。', detailAspirated:'送气音在爆破后有明显气流。', detailTense:'紧音先收紧，爆破短，气流较少。', answerWas:'正确答案是 {answer}。',
      retryTitle:'易错音重播', retryLead:'刚才答错的音会在这里再次出现。听对以后再进入总结。', retryEmpty:'本轮没有需要重练的音；你仍可以返回任意对比组复听。', retryAgain:'重播并再试', retryRemaining:'还需重练 {count} 项',
      summaryTitle:'今天先建立听辨起点', summaryLead:'继续在真实语速里反复比较，辨音会逐渐稳定。', summary1:'普通音：自然气流', summary2:'送气音：明显气流', summary3:'紧音：先收紧、气流较少', summary4:'所有声音都通过完整音节学习',
      completeTitle:'第4课完成', completeLead:'你已经完成第一轮普通音、送气音和紧音对比。下一课“音节块”仍在开发中。', xp:'+50 XP', earned:'已保存学习进度', returnCourses:'返回课程主页',
      audioDisclosure:'当前托管音频尚待生成与人工审核；按钮使用设备韩语语音播放完整音节。', resumed:'已恢复上次学习位置。', aiVoice:'设备韩语语音 · 待人工试听', noVoice:'设备中没有可用的韩语语音。', pendingNext:'下一课即将开放'
    },
    en: {
      lessonName:'Lesson 4 · Plain, Aspirated, and Tense Sounds', progress:'Course progress', home:'Return to learning home', back:'Back', next:'Continue', finish:'Complete lesson',
      introTag:'K0 · 10 MIN', introTitle:'Hear Plain, Aspirated, and Tense Sounds', introLead:'Use complete Korean syllables to begin hearing differences in airflow and tension. One lesson builds a starting point; it does not mean complete mastery.',
      goal1:'Hear full syllables', goal1d:'No isolated consonant sounds.', goal2:'Compare airflow', goal2d:'Aspirated sounds release more air.', goal3:'Feel tension', goal3d:'Tense sounds begin tight with less airflow.',
      conceptTitle:'Three categories, two things to notice', conceptLead:'Listen for airflow first, then notice whether the mouth and throat tighten.', plain:'Plain', aspirated:'Aspirated', tense:'Tense', plainConcept:'Natural airflow; at word onset it can fall between familiar voiced and voiceless sounds.', aspiratedConcept:'A clear puff follows the release. Hold a hand in front of your mouth to feel it.', tenseConcept:'The throat and mouth tighten first; the release is short and strong with less air.',
      groupLead:'Play each complete syllable separately, then use the sequence comparison.', symbol:'Hangul letter', letterName:'Letter name', example:'Example syllable', listenSound:'Listen to {category} {syllable}', listenSequence:'Listen in sequence: {sequence}', romanSummary:'Show approximate hints', romanNote:'Romanization is only an initial aid; follow the Korean audio, mouth position, and airflow.', tipPlain:'Keep the airflow natural without forcing it.', tipAspirated:'Release a noticeable puff of air.', tipTense:'Tighten the throat and mouth first; use less airflow.',
      quizTag:'Listening practice', replay:'Play {content} again', replaySequence:'Play the sequence again: {sequence}', chooseSyllable:'Play one full syllable and choose what you hear.', chooseAspirated:'Play three separate syllables and choose the aspirated one.', chooseCategory:'Play one full syllable and decide whether it is plain, aspirated, or tense.', correct:'Correct. {detail}', incorrect:'Listen again. {detail}', detailPlain:'Plain sounds use natural airflow without extra aspiration or tension.', detailAspirated:'Aspirated sounds release a clear puff after the consonant.', detailTense:'Tense sounds begin tight, release briefly, and use less air.', answerWas:'The correct answer is {answer}.',
      retryTitle:'Replay tricky sounds', retryLead:'Sounds missed earlier return here. Identify each one correctly before the summary.', retryEmpty:'No sounds need another round. You can still go back to replay any contrast.', retryAgain:'Replay and try again', retryRemaining:'{count} item(s) left',
      summaryTitle:'Build a listening starting point today', summaryLead:'Keep comparing these sounds in natural speech; your distinctions will become steadier.', summary1:'Plain: natural airflow', summary2:'Aspirated: noticeable airflow', summary3:'Tense: tighten first, less airflow', summary4:'Every sound is learned in a complete syllable',
      completeTitle:'Lesson 4 complete', completeLead:'You completed a first round of plain, aspirated, and tense contrasts. The next syllable-block lesson is still in development.', xp:'+50 XP', earned:'Progress saved', returnCourses:'Return to Courses', audioDisclosure:'Hosted audio is pending generation and human review. Buttons currently use the device Korean voice for complete syllables.', resumed:'Your previous position was restored.', aiVoice:'Device Korean voice · human review pending', noVoice:'No Korean system voice is available on this device.', pendingNext:'Next lesson coming soon'
    },
    vi: {
      lessonName:'Bài 4 · Âm thường, bật hơi và căng', progress:'Tiến độ bài học', home:'Về trang học tập', back:'Quay lại', next:'Tiếp tục', finish:'Hoàn thành bài',
      introTag:'K0 · 10 PHÚT', introTitle:'Nghe âm thường, bật hơi và căng', introLead:'Dùng âm tiết tiếng Hàn đầy đủ để bước đầu nghe sự khác nhau về luồng hơi và độ căng. Một bài học chỉ tạo nền tảng, không có nghĩa là đã thành thạo hoàn toàn.',
      goal1:'Nghe âm tiết đầy đủ', goal1d:'Không phát phụ âm trần đứng riêng.', goal2:'So sánh luồng hơi', goal2d:'Âm bật hơi có luồng hơi rõ hơn.', goal3:'Cảm nhận độ căng', goal3d:'Âm căng siết trước và ít hơi hơn.',
      conceptTitle:'Ba loại, chú ý hai điểm', conceptLead:'Trước hết nghe độ mạnh của luồng hơi, sau đó cảm nhận miệng và cổ họng có siết lại hay không.', plain:'Âm thường', aspirated:'Âm bật hơi', tense:'Âm căng', plainConcept:'Luồng hơi tự nhiên; ở đầu từ có thể nằm giữa âm hữu thanh và vô thanh quen thuộc.', aspiratedConcept:'Có luồng hơi rõ sau khi bật âm; đặt tay trước miệng để cảm nhận.', tenseConcept:'Cổ họng và khoang miệng siết trước; âm bật ngắn, mạnh và ít hơi hơn.',
      groupLead:'Nghe riêng từng âm tiết đầy đủ, sau đó nghe so sánh liên tiếp.', symbol:'Chữ Hangul', letterName:'Tên chữ cái', example:'Âm tiết ví dụ', listenSound:'Nghe {category} {syllable}', listenSequence:'Nghe liên tiếp {sequence}', romanSummary:'Mở gợi ý gần đúng', romanNote:'Phiên âm Latin chỉ hỗ trợ định hướng ban đầu; hãy dựa vào âm thanh tiếng Hàn, khẩu hình và luồng hơi.', tipPlain:'Giữ luồng hơi tự nhiên, không cố nhấn mạnh.', tipAspirated:'Khi phát âm có luồng hơi rõ.', tipTense:'Siết cổ họng và khoang miệng trước, luồng hơi ít hơn.',
      quizTag:'Luyện nghe phân biệt', replay:'Phát lại {content}', replaySequence:'Phát lại chuỗi {sequence}', chooseSyllable:'Phát một âm tiết đầy đủ rồi chọn âm bạn nghe thấy.', chooseAspirated:'Phát liên tiếp ba âm tiết riêng biệt rồi chọn âm bật hơi.', chooseCategory:'Phát một âm tiết đầy đủ rồi xác định âm thường, bật hơi hay căng.', correct:'Đúng. {detail}', incorrect:'Hãy nghe lại. {detail}', detailPlain:'Âm thường dùng luồng hơi tự nhiên, không thêm bật hơi hay siết.', detailAspirated:'Âm bật hơi có luồng hơi rõ sau khi bật âm.', detailTense:'Âm căng siết trước, bật ngắn và dùng ít hơi hơn.', answerWas:'Đáp án đúng là {answer}.',
      retryTitle:'Nghe lại âm dễ nhầm', retryLead:'Các âm trả lời sai sẽ xuất hiện lại ở đây. Hãy nghe đúng trước khi sang phần tổng kết.', retryEmpty:'Không có âm nào cần luyện lại. Bạn vẫn có thể quay lại nghe bất kỳ nhóm nào.', retryAgain:'Phát lại và thử lại', retryRemaining:'Còn {count} mục',
      summaryTitle:'Hôm nay xây nền tảng nghe phân biệt', summaryLead:'Tiếp tục so sánh trong tốc độ nói tự nhiên để khả năng phân biệt ổn định dần.', summary1:'Âm thường: luồng hơi tự nhiên', summary2:'Âm bật hơi: luồng hơi rõ', summary3:'Âm căng: siết trước, ít hơi hơn', summary4:'Mọi âm đều được học qua âm tiết đầy đủ',
      completeTitle:'Đã hoàn thành Bài 4', completeLead:'Bạn đã hoàn thành vòng đầu so sánh âm thường, bật hơi và căng. Bài tiếp theo về khối âm tiết vẫn đang phát triển.', xp:'+50 XP', earned:'Đã lưu tiến độ', returnCourses:'Trở về Bài học', audioDisclosure:'Âm thanh lưu trữ đang chờ tạo và duyệt thủ công. Hiện các nút dùng giọng Hàn trên thiết bị để phát âm tiết đầy đủ.', resumed:'Đã khôi phục vị trí học trước đó.', aiVoice:'Giọng Hàn trên thiết bị · chờ duyệt', noVoice:'Thiết bị không có giọng hệ thống tiếng Hàn.', pendingNext:'Bài tiếp theo sắp ra mắt'
    },
    ja: {
      lessonName:'第4課 · 平音・激音・濃音', progress:'レッスン進捗', home:'学習ホームへ戻る', back:'戻る', next:'続ける', finish:'レッスン完了',
      introTag:'K0 · 10分', introTitle:'平音・激音・濃音を聞き分ける', introLead:'完全な韓国語音節で、気流と緊張度の違いを初めて聞き分けます。1回の学習は出発点であり、完全習得を意味しません。',
      goal1:'完全な音節を聞く', goal1d:'子音だけの裸の音は再生しません。', goal2:'気流を比べる', goal2d:'激音は気流がより明確です。', goal3:'緊張度を感じる', goal3d:'濃音は先に締め、気流が少なめです。',
      conceptTitle:'3つの種類、2つの注目点', conceptLead:'まず気流の強さを聞き、次に口と喉が締まるかを感じます。', plain:'平音', aspirated:'激音', tense:'濃音', plainConcept:'自然な気流。語頭では、身近な有声音と無声音の中間に聞こえることがあります。', aspiratedConcept:'破裂後に明確な気流があります。口の前に手を置いて感じてみましょう。', tenseConcept:'喉と口腔を先に締め、短く強く破裂し、気流は少なめです。',
      groupLead:'完全な音節を一つずつ聞き、その後で連続比較を使います。', symbol:'ハングル文字', letterName:'文字名', example:'例の音節', listenSound:'{category} {syllable}を聞く', listenSequence:'連続で聞く {sequence}', romanSummary:'近似ヒントを開く', romanNote:'ローマ字は最初の目安にすぎません。韓国語音声、口の形、気流を基準にしてください。', tipPlain:'気流を自然に保ち、強調しすぎません。', tipAspirated:'発音時に明確な気流があります。', tipTense:'喉と口腔を先に締め、気流を少なくします。',
      quizTag:'聞き分け練習', replay:'{content}をもう一度再生', replaySequence:'もう一度連続再生 {sequence}', chooseSyllable:'完全な音節を一つ再生し、聞こえた音節を選びます。', chooseAspirated:'3つの独立した音節を連続再生し、その中の激音を選びます。', chooseCategory:'完全な音節を一つ再生し、平音・激音・濃音を判断します。', correct:'正解です。{detail}', incorrect:'もう一度聞きましょう。{detail}', detailPlain:'平音は余分な送気や緊張を加えず、自然な気流を使います。', detailAspirated:'激音は破裂後に明確な気流があります。', detailTense:'濃音は先に締め、短く破裂し、気流が少なめです。', answerWas:'正解は {answer} です。',
      retryTitle:'間違えやすい音を再生', retryLead:'先ほど間違えた音をここでもう一度練習します。正しく聞き分けてからまとめへ進みます。', retryEmpty:'再練習が必要な音はありません。戻ってどの比較でも聞き直せます。', retryAgain:'再生してもう一度', retryRemaining:'残り {count} 項目',
      summaryTitle:'今日は聞き分けの出発点を作る', summaryLead:'自然な速さでも繰り返し比べると、聞き分けが徐々に安定します。', summary1:'平音：自然な気流', summary2:'激音：明確な気流', summary3:'濃音：先に締め、気流は少なめ', summary4:'すべて完全な音節で学習',
      completeTitle:'第4課 完了', completeLead:'平音・激音・濃音の最初の比較を完了しました。次の音節ブロックの課は開発中です。', xp:'+50 XP', earned:'学習進捗を保存しました', returnCourses:'コースへ戻る', audioDisclosure:'ホスト音声は生成と人による確認待ちです。現在は端末の韓国語音声で完全な音節を再生します。', resumed:'前回の学習位置を復元しました。', aiVoice:'端末の韓国語音声 · 確認待ち', noVoice:'この端末に利用可能な韓国語音声がありません。', pendingNext:'次のレッスンは近日公開'
    }
  };

  const GROUPS = Object.freeze([
    { id:'g', sequence:['가','카','까'], items:[['ㄱ','기역','plain','가','[k~g]'],['ㅋ','키읔','aspirated','카','[kʰ]'],['ㄲ','쌍기역','tense','까','[k͈]']] },
    { id:'d', sequence:['다','타','따'], items:[['ㄷ','디귿','plain','다','[t~d]'],['ㅌ','티읕','aspirated','타','[tʰ]'],['ㄸ','쌍디귿','tense','따','[t͈]']] },
    { id:'b', sequence:['바','파','빠'], items:[['ㅂ','비읍','plain','바','[p~b]'],['ㅍ','피읖','aspirated','파','[pʰ]'],['ㅃ','쌍비읍','tense','빠','[p͈]']] },
    { id:'j', sequence:['자','차','짜'], items:[['ㅈ','지읒','plain','자','[tɕ~dʑ]'],['ㅊ','치읓','aspirated','차','[tɕʰ]'],['ㅉ','쌍지읒','tense','짜','[tɕ͈]']] },
    { id:'s', sequence:['사','싸'], items:[['ㅅ','시옷','plain','사','[s]'],['ㅆ','쌍시옷','tense','싸','[s͈]']] }
  ]);
  const SOUND_CATEGORY = Object.freeze(Object.fromEntries(GROUPS.flatMap(group => group.items.map(item => [item[3], item[2]]))));
  const QUESTIONS = Object.freeze({
    qg:{id:'qg',type:'single',audio:['까'],correct:'까',options:['가','카','까']},
    qd:{id:'qd',type:'aspirated',audio:['다','타','따'],correct:'타',options:['다','타','따']},
    qb:{id:'qb',type:'category',audio:['빠'],correct:'tense',options:CATEGORY_KEYS},
    qj:{id:'qj',type:'single',audio:['차'],correct:'차',options:['자','차','짜']},
    qs:{id:'qs',type:'category',audio:['사'],correct:'plain',options:CATEGORY_KEYS},
    qall:{id:'qall',type:'category',audio:['카'],correct:'aspirated',options:CATEGORY_KEYS}
  });
  const SCREENS = Object.freeze([
    ['intro'],['concept'],['group','g'],['quiz','qg'],['group','d'],['quiz','qd'],['group','b'],['quiz','qb'],['group','j'],['quiz','qj'],['group','s'],['quiz','qall'],['retry'],['summary'],['complete']
  ]);

  const params = new URLSearchParams(global.location.search);
  const profile = global.NikigoState ? global.NikigoState.get() : {};
  let language = normalizeLanguage(params.get('lang') || profile.interfaceLanguage || global.navigator.language);
  let session = loadSession();
  let activeAudio = '';
  let playbackToken = 0;
  let retryFeedback = null;
  const autoplayed = new Set();

  function normalizeLanguage(value) {
    const code = String(value || '').toLowerCase();
    if (code.startsWith('zh')) return 'zh'; if (code.startsWith('vi')) return 'vi'; if (code.startsWith('ja')) return 'ja'; return 'en';
  }
  function text(key, values = {}) {
    const source = UI[language]?.[key] ?? UI.en[key] ?? key;
    return Object.entries(values).reduce((value,[name,replacement]) => value.replaceAll(`{${name}}`, String(replacement)), source);
  }
  function shuffled(values) {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i -= 1) { const j = Math.floor(Math.random() * (i + 1)); [copy[i],copy[j]] = [copy[j],copy[i]]; }
    return copy;
  }
  function blankSession() {
    const optionOrders = Object.fromEntries(Object.values(QUESTIONS).map(question => [question.id, shuffled(question.options)]));
    return {version:1,step:0,answers:{},mistakes:[],optionOrders,completed:false};
  }
  function applyAnswer(current, question, value) {
    if (current.answers[question.id]) return current;
    const correct = value === question.correct;
    return {
      ...current,
      answers: {...current.answers,[question.id]:{choice:value,correct}},
      mistakes: correct || current.mistakes.includes(question.id) ? [...current.mistakes] : [...current.mistakes,question.id]
    };
  }
  function applyRetryAnswer(current, question, value) {
    return value === question.correct ? {...current,mistakes:current.mistakes.filter(id=>id!==question.id)} : current;
  }
  function completionPatch(state) {
    const completed = new Set(state.completedLessons || []);
    const first = !completed.has(LESSON_ID);
    completed.add(LESSON_ID);
    return {...state,completedLessons:[...completed],lessonProgress:{...(state.lessonProgress||{}),[LESSON_ID]:100},weeklyProgress:Math.max(Number(state.weeklyProgress)||0,4),xp:(Number(state.xp)||0)+(first?50:0)};
  }
  function loadSession() {
    try {
      const saved = JSON.parse(global.localStorage.getItem(SESSION_KEY) || 'null');
      if (saved?.version === 1 && Number.isInteger(saved.step)) return {...blankSession(),...saved,step:Math.min(SCREENS.length-1,Math.max(0,saved.step))};
    } catch {}
    return blankSession();
  }
  function saveSession() {
    global.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    const percent = Math.round(session.step / (SCREENS.length - 1) * 100);
    if (global.NikigoState) global.NikigoState.update(state => ({...state,interfaceLanguage:language,lessonProgress:{...(state.lessonProgress||{}),[LESSON_ID]:session.completed?100:percent}}),'contrast:progress');
  }
  function categoryLabel(category) { return text(category); }
  function categoryDetail(category) { return text(`detail${category[0].toUpperCase()}${category.slice(1)}`); }
  function categoryTip(category) { return text(`tip${category[0].toUpperCase()}${category.slice(1)}`); }
  function optionLabel(option) { return CATEGORY_KEYS.includes(option) ? categoryLabel(option) : option; }
  function questionInstruction(question) { return text(question.type === 'single' ? 'chooseSyllable' : question.type === 'aspirated' ? 'chooseAspirated' : 'chooseCategory'); }
  function questionReplayLabel(question) {
    const sequence = question.audio.join('—');
    return question.audio.length > 1 ? text('replaySequence',{sequence}) : text('replay',{content:question.audio[0]});
  }

  function koreanVoice() {
    const voices = global.speechSynthesis?.getVoices?.() || [];
    return voices.find(voice => /^ko(?:-|_)/i.test(voice.lang)) || voices.find(voice => /Korean|한국/i.test(voice.name));
  }
  function playOne(syllable, done) {
    const token = playbackToken;
    activeAudio = syllable; render();
    const hosted = HOSTED_AUDIO[syllable];
    if (hosted) {
      const audio = new Audio(hosted); audio.playbackRate = Number(profile.audioRate)||1; audio.preservesPitch = true;
      audio.onended = () => { if (token === playbackToken) { activeAudio=''; render(); done?.(); } };
      audio.onerror = () => playSystem(syllable,done,token); audio.play().catch(() => playSystem(syllable,done,token)); return;
    }
    playSystem(syllable,done,token);
  }
  function playSystem(syllable, done, token) {
    if (!global.speechSynthesis || !global.SpeechSynthesisUtterance) { showToast(text('noVoice')); activeAudio=''; render(); return; }
    const utterance = new SpeechSynthesisUtterance(syllable); utterance.lang='ko-KR'; utterance.rate=Number(profile.audioRate)||1; const voice=koreanVoice(); if(voice) utterance.voice=voice;
    utterance.onend = () => { if (token === playbackToken) { activeAudio=''; render(); done?.(); } };
    utterance.onerror = () => { if (token === playbackToken) { activeAudio=''; render(); showToast(text('noVoice')); } };
    global.speechSynthesis.speak(utterance);
  }
  function playSequence(sequence) {
    playbackToken += 1; global.speechSynthesis?.cancel?.(); const token=playbackToken; let index=0;
    const next = () => { if(token!==playbackToken || index>=sequence.length){activeAudio='';render();return;} playOne(sequence[index],()=>{index+=1;global.setTimeout(next,260);}); };
    next();
  }
  function stopAudio() { playbackToken += 1; global.speechSynthesis?.cancel?.(); activeAudio=''; }
  function showToast(message) { const toast=document.getElementById('toast'); toast.textContent=message; toast.classList.add('show'); global.setTimeout(()=>toast.classList.remove('show'),1800); }

  function footer({nextDisabled=false,nextLabel=null,back=true}={}) {
    return `<div class="foot">${back?`<button class="ghost" data-action="back">← ${text('back')}</button>`:'<span></span>'}<button class="primary" data-action="next" ${nextDisabled?'disabled':''}>${nextLabel||text('next')} →</button></div>`;
  }
  function renderIntro() {
    return `<span class="eyebrow">${text('introTag')}</span><h1>${text('introTitle')}</h1><p class="lead">${text('introLead')}</p>${session.step>0?`<p class="resumeNote">${text('resumed')}</p>`:''}<div class="goals"><div class="goal"><b>👂 ${text('goal1')}</b><span>${text('goal1d')}</span></div><div class="goal"><b>💨 ${text('goal2')}</b><span>${text('goal2d')}</span></div><div class="goal"><b>⚡ ${text('goal3')}</b><span>${text('goal3d')}</span></div></div>${footer({back:false})}`;
  }
  function renderConcept() {
    return `<span class="eyebrow">02 · K0</span><h1>${text('conceptTitle')}</h1><p class="lead">${text('conceptLead')}</p><div class="conceptGrid">${CATEGORY_KEYS.map(category=>`<article class="concept"><b>${categoryLabel(category)}</b><p>${text(`${category}Concept`)}</p></article>`).join('')}</div>${footer()}`;
  }
  function renderGroup(groupId) {
    const group=GROUPS.find(item=>item.id===groupId); const sequence=group.sequence.join('—');
    const cards=group.items.map(([symbol,name,category,syllable,hint])=>`<article class="contrastSound ${activeAudio===syllable?'playing':''}"><span class="soundSymbol">${symbol}</span><span class="soundCategory">${categoryLabel(category)}</span><strong class="soundSyllable">${syllable}</strong><div class="soundMeta"><span>${text('letterName')}：${name}</span><span>${text('example')}：${syllable}</span></div><p class="soundTip">${categoryTip(category)}</p><button class="soundPlay" data-action="play" data-syllable="${syllable}" aria-label="${text('listenSound',{category:categoryLabel(category),syllable})}">▶ ${text('listenSound',{category:categoryLabel(category),syllable})}</button></article>`).join('');
    const embeddedQuiz=group.id==='s'?renderQuestion(QUESTIONS.qs,false,true):'';
    return `<span class="eyebrow">${group.sequence.join(' / ')}</span><h1>${sequence}</h1><p class="lead">${text('groupLead')}</p><div class="contrastGrid" style="--contrast-count:${group.items.length}">${cards}</div><button class="sequenceButton" data-action="sequence" data-sequence="${group.sequence.join(',')}" aria-label="${text('listenSequence',{sequence})}">▶ ${text('listenSequence',{sequence})}</button><details class="romanDetails"><summary>${text('romanSummary')}</summary><p>${group.items.map(item=>`${item[3]} ${item[4]}`).join(' · ')}<br>${text('romanNote')}</p></details><p class="audioDisclosure">ⓘ ${text('audioDisclosure')}</p>${embeddedQuiz}${footer({nextDisabled:group.id==='s'&&!session.answers.qs})}`;
  }
  function renderQuestion(question, retry=false, embedded=false) {
    const answer=retry?retryFeedback:session.answers[question.id]; const options=session.optionOrders[question.id]||question.options; const sequence=question.audio.join(',');
    const optionButtons=options.map(option=>{let cls='';if(answer){if(option===question.correct)cls='correct';else if(option===answer.choice)cls='wrong';}return `<button class="quizOption ${cls}" data-action="${retry?'retry-answer':'answer'}" data-question="${question.id}" data-value="${option}" ${answer?'disabled':''}>${optionLabel(option)}${answer&&option===question.correct?' ✓':answer&&option===answer.choice?' ✕':''}</button>`;}).join('');
    const feedback=answer?`<div class="feedback ${answer.correct?'good':'try'}" role="status"><strong>${text(answer.correct?'correct':'incorrect',{detail:categoryDetail(SOUND_CATEGORY[question.correct]||question.correct)})}</strong>${answer.correct?'':`<span>${text('answerWas',{answer:optionLabel(question.correct)})}</span>`}${retry&&!answer.correct?`<button class="replayButton" data-action="retry-again" data-question="${question.id}">↻ ${text('retryAgain')}</button>`:`<button class="replayButton" data-action="question-audio" data-sequence="${sequence}">▶ ${questionReplayLabel(question)}</button>`}</div>`:'';
    return `${embedded?'<hr class="sectionDivider">':`<span class="eyebrow">${text('quizTag')}</span>`}<${embedded?'h2':'h1'}>${questionInstruction(question)}</${embedded?'h2':'h1'}><div class="quizAudio"><button class="soundPlay" data-action="question-audio" data-sequence="${sequence}" aria-label="${questionReplayLabel(question)}">▶ ${questionReplayLabel(question)}</button><small>${text('aiVoice')}</small></div><div class="quizOptions">${optionButtons}</div>${feedback}`;
  }
  function renderQuiz(questionId) {
    const question=QUESTIONS[questionId]; const answered=Boolean(session.answers[questionId]);
    return `${renderQuestion(question)}${footer({nextDisabled:!answered})}`;
  }
  function renderRetry() {
    const pending=session.mistakes[0];
    if(!pending)return `<span class="eyebrow">13 · K0</span><h1>${text('retryTitle')}</h1><p class="lead">${text('retryLead')}</p><div class="note">✓ ${text('retryEmpty')}</div>${footer()}`;
    return `<span class="eyebrow">13 · K0</span><h1>${text('retryTitle')}</h1><p class="lead">${text('retryLead')}</p><div class="retryBadge"><b>${text('retryRemaining',{count:session.mistakes.length})}</b><span>${QUESTIONS[pending].audio.join('—')}</span></div>${renderQuestion(QUESTIONS[pending],true)}${footer({nextDisabled:true})}`;
  }
  function renderSummary() {
    return `<span class="eyebrow">14 · K0</span><h1>${text('summaryTitle')}</h1><p class="lead">${text('summaryLead')}</p><div class="summaryList"><div>① ${text('summary1')}</div><div>② ${text('summary2')}</div><div>③ ${text('summary3')}</div><div>④ ${text('summary4')}</div></div>${footer({nextLabel:text('finish')})}`;
  }
  function completeLesson() {
    if(session.completed)return; session.completed=true; session.step=SCREENS.length-1;
    if(global.NikigoState)global.NikigoState.update(completionPatch,'contrast:complete');
    global.localStorage.setItem(SESSION_KEY,JSON.stringify(session));
  }
  function renderComplete() {
    completeLesson();
    return `<div class="complete"><div class="completeMark">✓</div><span class="eyebrow">K0 · COMPLETE</span><h1>${text('completeTitle')}</h1><p class="lead centered">${text('completeLead')}</p><div class="rewards"><span class="reward">✦ ${text('xp')}</span><span class="reward">✓ ${text('earned')}</span><span class="reward">⏳ ${text('pendingNext')}</span></div><div class="repeatActions"><button class="primary" data-action="home">${text('returnCourses')} →</button></div></div>`;
  }
  function render() {
    const [type,id]=SCREENS[session.step]; const stage=document.getElementById('lessonStage');
    document.documentElement.lang=language==='zh'?'zh-CN':language; document.getElementById('language').value=language; document.getElementById('lessonName').textContent=text('lessonName'); document.getElementById('progressLabel').textContent=text('progress');
    const percent=Math.round(session.step/(SCREENS.length-1)*100); document.getElementById('progressCount').textContent=`${session.step+1} / ${SCREENS.length}`; document.getElementById('progressBar').style.width=`${percent}%`; document.getElementById('progressTrack').setAttribute('aria-valuenow',String(percent)); document.getElementById('homeButton').setAttribute('aria-label',text('home')); document.getElementById('homeButton').title=text('home'); document.getElementById('homeLogo').setAttribute('aria-label',text('home'));
    if(type==='intro')stage.innerHTML=renderIntro(); if(type==='concept')stage.innerHTML=renderConcept(); if(type==='group')stage.innerHTML=renderGroup(id); if(type==='quiz')stage.innerHTML=renderQuiz(id); if(type==='retry')stage.innerHTML=renderRetry(); if(type==='summary')stage.innerHTML=renderSummary(); if(type==='complete')stage.innerHTML=renderComplete();
    if(type==='quiz'&&profile.autoplayAudio===true&&!autoplayed.has(session.step)){autoplayed.add(session.step);global.setTimeout(()=>playSequence(QUESTIONS[id].audio),250);}
  }
  function answerQuestion(questionId,value,retry) {
    const question=QUESTIONS[questionId]; const correct=value===question.correct;
    if(retry){retryFeedback={choice:value,correct};if(correct){session=applyRetryAnswer(session,question,value);retryFeedback=null;saveSession();}render();return;}
    session=applyAnswer(session,question,value); saveSession(); render();
  }
  function goHome(){stopAudio();global.location.href=`nikigo-app.html?lang=${language}#courses`;}

  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;const action=button.dataset.action;
    if(button.id==='homeButton'||button.id==='homeLogo'||action==='home'){goHome();return;}
    if(action==='play'){stopAudio();playSequence([button.dataset.syllable]);return;}
    if(action==='sequence'||action==='question-audio'){stopAudio();playSequence(button.dataset.sequence.split(','));return;}
    if(action==='answer'){answerQuestion(button.dataset.question,button.dataset.value,false);return;}
    if(action==='retry-answer'){answerQuestion(button.dataset.question,button.dataset.value,true);return;}
    if(action==='retry-again'){retryFeedback=null;stopAudio();playSequence(QUESTIONS[button.dataset.question].audio);render();return;}
    if(action==='back'){stopAudio();session.step=Math.max(0,session.step-1);retryFeedback=null;saveSession();render();global.scrollTo(0,0);return;}
    if(action==='next'){stopAudio();session.step=Math.min(SCREENS.length-1,session.step+1);retryFeedback=null;saveSession();render();global.scrollTo(0,0);}
  });
  document.getElementById('language').addEventListener('change',event=>{language=LANGUAGES.includes(event.target.value)?event.target.value:'en';saveSession();render();});
  global.speechSynthesis?.addEventListener?.('voiceschanged',()=>{});
  global.NikigoContrastLesson=Object.freeze({LESSON_ID,GROUPS,QUESTIONS,SCREENS,UI,HOSTED_AUDIO,blankSession,applyAnswer,applyRetryAnswer,completionPatch,getSession:()=>JSON.parse(JSON.stringify(session))});
  render();
})(window);
