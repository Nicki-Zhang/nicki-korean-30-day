import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();
const LANGS = ['zh', 'en', 'vi', 'ja'];
const COLUMNS = [
  'lessonId','displayLessonNumber','pageFile','screenId','screenTitle','controlId','buttonText','teachingGoal',
  'targetSymbol','displayText','expectedSpeechText','expectedAudioType','pronunciationType','pronunciationRule',
  'challengeOrLearning','beforeAnswerHidden','afterAnswerExplanation','catalogEntryId','catalogSpeechText','audioFilePath',
  'fileExists','exactMatch','reviewStatus','voiceSource','model','generationDate','commercialUseBasis','nativeReviewer',
  'fallbackBehavior','mobilePlaybackRisk','serviceWorkerCached','issueType','priority','recommendedAction','enabled'
];
const strictTypes = new Set(['letter-name','vowel-carrier','initial-example','syllable','word','sentence','dialogue-line','listening-question']);
const rows = [];

await import(new URL('../audio-catalog.js', import.meta.url));
const canonical = globalThis.NikigoAudio.lessons;
const allCatalog = Object.entries(canonical).flatMap(([lessonId, lesson]) => lesson.items.map(item => ({ ...item, lessonId, path:`audio/${lessonId}/${item.file}` })));
const lessonManifests = {};
for (const dir of fs.readdirSync('audio')) {
  const manifestPath = path.join('audio', dir, 'manifest.json');
  if (fs.existsSync(manifestPath)) lessonManifests[dir] = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
}
for (const [dir, manifest] of Object.entries(lessonManifests)) {
  for (const item of manifest.items || []) {
    const lessonId = item.lessonId || manifest.lesson || dir;
    if (allCatalog.some(entry => entry.lessonId === lessonId && entry.id === item.id)) continue;
    allCatalog.push({ ...item, lessonId, path:`audio/${dir}/${item.file || item.audioFile}` });
  }
}

function modelFor(entry) {
  if (!entry) return '';
  if (entry.model) return entry.model;
  const manifest = lessonManifests[entry.lessonId];
  return manifest?.generationDefaults?.model || (String(entry.voiceSource).startsWith('apple-system') ? 'Apple system voice export' : '');
}
function commercialBasis(entry) {
  return entry?.commercialUseBasis || entry?.rights?.commercialUseRecord || '';
}
function typeFor(entry, speechText, override = '') {
  if (override) return override;
  const type = entry?.audioType || entry?.type;
  if (type === 'vowel') return 'vowel-carrier';
  if (type === 'onset-example' || type === 'initial-example') return 'initial-example';
  if (type === 'batchim-example') return ['산','몸','공','물'].includes(speechText) ? 'word' : 'syllable';
  if (type === 'sound-change') return 'sentence';
  if (strictTypes.has(type)) return type;
  return type || 'unclassified';
}
function catalogFor(lessonId, speechText) {
  const local = allCatalog.find(item => item.lessonId === lessonId && item.speechText === speechText);
  return local || allCatalog.find(item => item.speechText === speechText) || null;
}
function addRow(input) {
  const entry = input.entry === undefined ? catalogFor(input.catalogLessonId || input.lessonId, input.expectedSpeechText) : input.entry;
  const audioPath = input.audioFilePath ?? entry?.path ?? '';
  const exists = Boolean(audioPath && fs.existsSync(audioPath));
  const exact = input.exactMatch ?? Boolean(entry && entry.speechText === input.expectedSpeechText);
  const reviewStatus = input.reviewStatus || entry?.reviewStatus || 'missing';
  const fallback = input.fallbackBehavior || 'none; translated error state only';
  let issueType = input.issueType || '';
  let priority = input.priority || '';
  let action = input.recommendedAction || '';
  if (!issueType && fallback.includes('device speechSynthesis')) {
    issueType = 'forbidden-device-tts-fallback'; priority = 'P0'; action = 'Remove device TTS; fail closed with translated retry/error state.';
  } else if (!issueType && reviewStatus === 'pending' && input.enabled !== false) {
    issueType = 'pending-audio-enabled'; priority = 'P0'; action = 'Disable until native review is approved, or keep lesson explicitly in preview.';
  } else if (!issueType && !entry && !exists) {
    issueType = 'missing-audio'; priority = 'P1'; action = 'Add to generation queue; keep the button disabled until approved.';
  } else if (!issueType && !exact) {
    issueType = 'catalog-or-semantic-mismatch'; priority = 'P0'; action = 'Create an exact typed catalog entry before enabling this control.';
  } else if (!issueType && !exists) {
    issueType = 'missing-audio'; priority = 'P1'; action = 'Add to generation queue; keep the button disabled until approved.';
  } else if (!issueType && !commercialBasis(entry)) {
    issueType = 'rights-and-review-metadata-gap'; priority = 'P1'; action = 'Record source/model/date/commercial-use basis and native review before release.';
  } else if (!issueType && reviewStatus !== 'approved') {
    issueType = 'needs-native-review'; priority = 'P1'; action = 'Native-speaker review required; do not represent as released audio.';
  }
  const row = {
    lessonId:input.lessonId, displayLessonNumber:String(input.displayLessonNumber), pageFile:input.pageFile,
    screenId:input.screenId, screenTitle:input.screenTitle, controlId:input.controlId, buttonText:input.buttonText,
    teachingGoal:input.teachingGoal || '', targetSymbol:input.targetSymbol || '', displayText:input.displayText || input.expectedSpeechText,
    expectedSpeechText:input.expectedSpeechText, expectedAudioType:typeFor(entry,input.expectedSpeechText,input.expectedAudioType),
    pronunciationType:input.pronunciationType || entry?.pronunciationType || '', pronunciationRule:input.pronunciationRule || entry?.pronunciationRule || '',
    challengeOrLearning:input.challengeOrLearning || 'learning', beforeAnswerHidden:String(input.beforeAnswerHidden ?? 'not-applicable'),
    afterAnswerExplanation:String(input.afterAnswerExplanation ?? 'not-applicable'), catalogEntryId:entry ? `${entry.lessonId}:${entry.id}` : '',
    catalogSpeechText:entry?.speechText || '', audioFilePath:audioPath, fileExists:String(exists), exactMatch:String(exact), reviewStatus,
    voiceSource:entry?.voiceSource || input.voiceSource || '', model:modelFor(entry), generationDate:entry?.generationDate || '',
    commercialUseBasis:commercialBasis(entry), nativeReviewer:entry?.nativeReviewer || '', fallbackBehavior:fallback,
    mobilePlaybackRisk:input.mobilePlaybackRisk || 'user gesture required; state reset must be verified on iOS/Android',
    serviceWorkerCached:input.serviceWorkerCached || (audioPath ? 'runtime network-first; not precached' : 'not-applicable'), issueType, priority,
    recommendedAction:action, enabled:String(input.enabled !== false)
  };
  if (!strictTypes.has(row.expectedAudioType)) {
    row.issueType = row.issueType || 'unclassified-audio-type'; row.priority = row.priority || 'P0';
    row.recommendedAction = row.recommendedAction || 'Assign one of the eight approved audio types.';
  }
  rows.push(row);
}

function loadLegacy(file) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).filter(Boolean);
  let config;
  const soundContext = {}; soundContext.window = soundContext;
  vm.runInNewContext(fs.readFileSync('hangul-sound-data.js','utf8'), soundContext);
  vm.runInNewContext(scripts.at(-1), { window:{NikigoAudio:globalThis.NikigoAudio,NikigoHangulSoundData:soundContext.NikigoHangulSoundData}, NikigoLesson:{mount:value=>{config=value;}} }, {filename:file});
  return config;
}

// Lesson 0: every detail-panel audio control, including disabled letter-name and preview controls.
const soundContext = {}; soundContext.window = soundContext;
vm.runInNewContext(fs.readFileSync('hangul-sound-data.js','utf8'), soundContext);
for (const item of soundContext.NikigoHangulSoundData.items) {
  if (item.type === 'vowel') {
    addRow({lessonId:'lesson-00',displayLessonNumber:0,pageFile:'lesson-00.html',screenId:`map-${item.symbol}`,screenTitle:'字母地图详情',controlId:`lesson00-${item.symbol}-vowel`,buttonText:item.vowelAudio?`听元音${item.symbol}`:'元音音频待补充',teachingGoal:'用无声初声ㅇ承载元音',targetSymbol:item.symbol,displayText:item.vowelCarrierSyllable,expectedSpeechText:item.vowelCarrierSyllable,expectedAudioType:'vowel-carrier',pronunciationType:'carrier syllable',challengeOrLearning:'learning',enabled:Boolean(item.vowelAudio),fallbackBehavior:item.vowelAudio?'static file failure invokes device speechSynthesis':'none; disabled'});
  } else {
    addRow({lessonId:'lesson-00',displayLessonNumber:0,pageFile:'lesson-00.html',screenId:`map-${item.symbol}`,screenTitle:'字母地图详情',controlId:`lesson00-${item.symbol}-letter-name`,buttonText:item.letterNameAudio?`听字母名称 ${item.letterName}`:'字母名称音频待补充',teachingGoal:'明确教学韩文字母名称',targetSymbol:item.symbol,displayText:item.letterName,expectedSpeechText:item.letterName,expectedAudioType:'letter-name',pronunciationType:'letter name',challengeOrLearning:'learning',enabled:Boolean(item.letterNameAudio),fallbackBehavior:'none; disabled'});
    addRow({lessonId:'lesson-00',displayLessonNumber:0,pageFile:'lesson-00.html',screenId:`map-${item.symbol}`,screenTitle:'字母地图详情',controlId:`lesson00-${item.symbol}-demo`,buttonText:item.demoAudio?`听示例音节 ${item.demoSyllable}`:'示例音节音频待补充',teachingGoal:'在完整音节中示范初声',targetSymbol:item.symbol,displayText:item.demoSyllable,expectedSpeechText:item.demoSyllable,expectedAudioType:'initial-example',pronunciationType:'onset inside full syllable',challengeOrLearning:'learning',enabled:Boolean(item.demoAudio),fallbackBehavior:item.demoAudio?'static file failure invokes device speechSynthesis':'none; disabled'});
  }
}

function addLegacyLesson(file, displayNumber) {
  const config = loadLegacy(file); const lessonId = config.id;
  const systemFallback = 'missing/static failure invokes device speechSynthesis';
  for (const [index,item] of (config.vowels||[]).entries()) {
    const speech = Array.isArray(item)?item[2]:item.vowelCarrierSyllable;
    addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'vowels',screenTitle:'元音/收音学习卡片',controlId:`${lessonId}-vowel-${index}`,buttonText:`听${displayNumber===7?'完整单词':'元音'} ${speech}`,teachingGoal:'学习页面卡片试听',targetSymbol:Array.isArray(item)?item[0]:item.symbol,displayText:speech,expectedSpeechText:speech,expectedAudioType:displayNumber===7?'word':'vowel-carrier',challengeOrLearning:'learning',fallbackBehavior:systemFallback});
  }
  for (const [index,item] of (config.consonants||[]).entries()) {
    const speech = Array.isArray(item)?item[2]:item.demoSyllable;
    addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'consonants',screenTitle:displayNumber===7?'收音对比':'辅音示例卡片',controlId:`${lessonId}-consonant-demo-${index}`,buttonText:`听示例音节 ${speech}`,teachingGoal:displayNumber===7?'在完整音节中比较收音':'在完整音节中示范初声',targetSymbol:Array.isArray(item)?item[0]:item.symbol,displayText:speech,expectedSpeechText:speech,expectedAudioType:'syllable',challengeOrLearning:'learning',fallbackBehavior:systemFallback});
    if (!Array.isArray(item)) addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'consonants',screenTitle:'辅音示例卡片',controlId:`${lessonId}-letter-name-${index}`,buttonText:item.letterNameAudio?`听字母名称 ${item.letterName}`:'字母名称音频待补充',teachingGoal:'字母名称（当前禁用）',targetSymbol:item.symbol,displayText:item.letterName,expectedSpeechText:item.letterName,expectedAudioType:'letter-name',challengeOrLearning:'learning',enabled:Boolean(item.letterNameAudio),fallbackBehavior:'none; disabled'});
  }
  for (const [index,word] of (config.words||[]).entries()) {
    addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'words',screenTitle:'真实词汇',controlId:`${lessonId}-word-${index}`,buttonText:`听完整单词 ${word[0]}`,teachingGoal:'真实词汇阅读',displayText:word[0],expectedSpeechText:word[2],expectedAudioType:'word',challengeOrLearning:'learning',fallbackBehavior:systemFallback});
  }
  for (const [index,speech] of [...new Set(Object.values(config.syllables||{}))].entries()) {
    addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'builder',screenTitle:'音节拼合器',controlId:`${lessonId}-builder-${index}`,buttonText:`听示例音节 ${speech}`,teachingGoal:'验证拼合结果',displayText:speech,expectedSpeechText:speech,expectedAudioType:'syllable',challengeOrLearning:'learning',fallbackBehavior:systemFallback});
  }
  if (config.phrase?.audio) addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'phrase',screenTitle:'完整表达',controlId:`${lessonId}-phrase`,buttonText:`听完整表达 ${config.phrase.korean}`,teachingGoal:'学习完整句子',displayText:config.phrase.korean,expectedSpeechText:config.phrase.audio,expectedAudioType:'sentence',challengeOrLearning:'learning',fallbackBehavior:systemFallback});
  if (config.repeat?.audio) {
    const sequence = Array.isArray(config.repeat.audio)?config.repeat.audio:[config.repeat.audio];
    const entries = sequence.map(value=>catalogFor(lessonId,value)).filter(Boolean);
    addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:'repeat',screenTitle:'跟读与自我检查',controlId:`${lessonId}-repeat`,buttonText:`播放 ${config.repeat.display}`,teachingGoal:'按网页控制逐条播放跟读材料',displayText:config.repeat.display,expectedSpeechText:sequence.join('→'),expectedAudioType:sequence.length===1?'sentence':'syllable',challengeOrLearning:'learning',entry:entries[0]||null,audioFilePath:entries.map(x=>x.path).join(' | '),exactMatch:entries.length===sequence.length,reviewStatus:entries.every(x=>x.reviewStatus==='approved')?'approved':'pending',fallbackBehavior:systemFallback,issueType:'',priority:'',recommendedAction:''});
  }
  for (const [kind,questions] of [['practice',config.practice||[]],['quiz',config.quiz||[]]]) for (const [index,q] of questions.entries()) {
    if (!q.audio) continue;
    addRow({lessonId,displayLessonNumber:displayNumber,pageFile:file,screenId:`${kind}-${index+1}`,screenTitle:kind==='quiz'?'挑战题':'练习题',controlId:`${lessonId}-${kind}-audio-${index+1}`,buttonText:'播放听力题音频 / 再次播放',teachingGoal:'听辨后选择答案',displayText:'作答前隐藏',expectedSpeechText:q.audio,expectedAudioType:'listening-question',challengeOrLearning:'challenge',beforeAnswerHidden:true,afterAnswerExplanation:true,fallbackBehavior:systemFallback});
  }
}
addLegacyLesson('lesson-01.html',1);
addLegacyLesson('lesson-02.html',2);
addLegacyLesson('lesson-03.html',3);
addLegacyLesson('lesson-04.html',7);

// Lesson 4: plain/aspirated/tense comparison. Hosted map is empty; all controls currently invoke device TTS.
const contrastGroups = [
  ['g',['가','카','까']],['d',['다','타','따']],['b',['바','파','빠']],['j',['자','차','짜']],['s',['사','싸']]
];
for (const [group,items] of contrastGroups) {
  for (const [index,speech] of items.entries()) addRow({lessonId:'k0-consonant-contrast',displayLessonNumber:4,pageFile:'lesson-consonant-contrast.html',screenId:`group-${group}`,screenTitle:`对比组 ${items.join('/')}`,controlId:`contrast-${group}-${index}`,buttonText:`听完整音节 ${speech}`,teachingGoal:'普通音/送气音/紧音对比',displayText:speech,expectedSpeechText:speech,expectedAudioType:'initial-example',challengeOrLearning:'learning',entry:null,audioFilePath:`audio/k0-consonant-contrast/${catalogFor('k0-consonant-contrast',speech)?.file||''}`,exactMatch:false,reviewStatus:'pending',voiceSource:'planned OpenAI',fallbackBehavior:'no hosted file; device speechSynthesis is the primary path'});
  addRow({lessonId:'k0-consonant-contrast',displayLessonNumber:4,pageFile:'lesson-consonant-contrast.html',screenId:`group-${group}`,screenTitle:`对比组 ${items.join('/')}`,controlId:`contrast-${group}-sequence`,buttonText:`连续听 ${items.join('—')}`,teachingGoal:'分别播放独立音节并比较',displayText:items.join('—'),expectedSpeechText:items.join('→'),expectedAudioType:'syllable',pronunciationType:'controlled sequence of independent syllables',challengeOrLearning:'learning',entry:null,audioFilePath:items.map(x=>`audio/k0-consonant-contrast/${catalogFor('k0-consonant-contrast',x)?.file||''}`).join(' | '),exactMatch:false,reviewStatus:'pending',fallbackBehavior:'device speechSynthesis sequence; no hosted files'});
}
const contrastQuestions = {qg:['까'],qd:['다','타','따'],qb:['빠'],qj:['차'],qs:['사'],qall:['카']};
for (const [id,sequence] of Object.entries(contrastQuestions)) for (const context of ['challenge','answered-replay','retry']) addRow({lessonId:'k0-consonant-contrast',displayLessonNumber:4,pageFile:'lesson-consonant-contrast.html',screenId:`${context}-${id}`,screenTitle:context==='retry'?'错题重练':'听辨题',controlId:`contrast-${id}-${context}`,buttonText:'播放听力题音频 / 再次播放',teachingGoal:'听辨发音类别或音节',displayText:'作答前隐藏',expectedSpeechText:sequence.join('→'),expectedAudioType:'listening-question',pronunciationType:'question audio sequence',challengeOrLearning:'challenge',beforeAnswerHidden:true,afterAnswerExplanation:true,entry:null,audioFilePath:sequence.map(x=>`audio/k0-consonant-contrast/${catalogFor('k0-consonant-contrast',x)?.file||''}`).join(' | '),exactMatch:false,reviewStatus:'pending',fallbackBehavior:'device speechSynthesis; autoplay may invoke it without a direct gesture'});

// Lesson 5 has nine exact, hosted example controls and no audio challenges.
const lesson5Screens = [['left-examples',['가','너','미']],['top-examples',['고','누','그']],['ieung-examples',['아','어','오']]];
for (const [screen,items] of lesson5Screens) for (const [index,speech] of items.entries()) addRow({lessonId:'lesson-05',displayLessonNumber:5,pageFile:'lesson-05.html',screenId:screen,screenTitle:'音节块示例',controlId:`lesson05-${screen}-${index}`,buttonText:`听示例音节 ${speech}`,teachingGoal:'音节块结构与完整音节对应',displayText:speech,expectedSpeechText:speech,expectedAudioType:'syllable',challengeOrLearning:'learning',fallbackBehavior:'none; playback failure disables this target'});

// Lesson 6 structure preview: all controls are deliberately disabled while pending.
const l6Controls = [
  ['review','复习已学元音','애','ㅐ','syllable'],['review','复习已学元音','에','ㅔ','syllable'],
  ['oa','组合公式','와','ㅘ','syllable'],['ueo','组合公式','워','ㅝ','syllable'],
  ...['와','왜','외','워','웨','위','의','얘','예'].map(x=>['carrier','完整承载音节',x,'','syllable']),
  ['extended','延伸拼写','얘','ㅒ','syllable'],['extended','延伸拼写','예','ㅖ','syllable'],
  ...['과자','여우','의자','왜','예','뭐'].map(x=>['words','无收音词汇',x,'','word'])
];
for (const [index,[screen,title,speech,symbol,kind]] of l6Controls.entries()) {
  const entry = catalogFor('lesson-06',speech);
  const semanticMismatch = kind==='word' && entry && typeFor(entry,speech)!=='word';
  addRow({lessonId:'lesson-06',displayLessonNumber:6,pageFile:'lesson-06.html',screenId:screen,screenTitle:title,controlId:`lesson06-${screen}-${index}`,buttonText:`${kind==='word'?'听完整单词':'听完整音节'} ${speech} · 音频待生成/待审核`,teachingGoal:title,targetSymbol:symbol||entry?.targetSymbol||'',displayText:speech,expectedSpeechText:speech,expectedAudioType:kind,pronunciationType:kind==='word'?'full word':'full syllable',challengeOrLearning:'learning',entry,enabled:false,fallbackBehavior:'none; disabled while pending',issueType:semanticMismatch?'button-catalog-audio-type-mismatch':'',priority:semanticMismatch?'P0':'',recommendedAction:semanticMismatch?'Decide whether 왜/예 are taught as words or carrier syllables; create a distinct typed object/button label before generation.':''});
}

// Review center: every audio-backed review item is a separate hidden/due-state control and uses device TTS only.
const reviewSource = fs.readFileSync('review-catalog.js','utf8');
const reviewContext = {}; reviewContext.window = reviewContext;
vm.runInNewContext(reviewSource, reviewContext);
for (const item of Object.values(reviewContext.NIKIGO_REVIEW_CATALOG.all).filter(item=>item.audio)) addRow({lessonId:item.lessonId,displayLessonNumber:item.lessonId==='lesson-04'?7:item.lessonId.replace('lesson-',''),pageFile:'review.html',screenId:`review-${item.id}`,screenTitle:'复习中心听力题',controlId:`review-audio-${item.id}`,buttonText:'播放音频 / 再次播放',teachingGoal:'间隔复习听辨',displayText:'作答前隐藏',expectedSpeechText:item.audio,expectedAudioType:'listening-question',challengeOrLearning:'review',beforeAnswerHidden:true,afterAnswerExplanation:true,entry:catalogFor(item.lessonId,String(item.audio).split(',')[0].trim()),audioFilePath:'',exactMatch:false,reviewStatus:'missing',fallbackBehavior:'device speechSynthesis is the only playback implementation'});

function csvEscape(value) { const text = String(value ?? ''); return /[",\n]/.test(text) ? `"${text.replaceAll('"','""')}"` : text; }
const csv = [COLUMNS.join(','), ...rows.map(row=>COLUMNS.map(column=>csvEscape(row[column])).join(','))].join('\n')+'\n';
fs.writeFileSync('K0_AUDIO_PLAYER_AUDIT.csv', csv);

const byLesson = Object.entries(Object.groupBy(rows,row=>row.lessonId)).map(([lesson,items])=>({lesson,count:items.length,p0:items.filter(x=>x.priority==='P0').length,p1:items.filter(x=>x.priority==='P1').length,missing:items.filter(x=>x.fileExists==='false').length}));
const p0 = rows.filter(row=>row.priority==='P0'); const p1 = rows.filter(row=>row.priority==='P1'); const p2 = rows.filter(row=>row.priority==='P2');
const playerMd = `# Nikigo K0 第0～6课播放器审计\n\n`+
`> 生成时间：${new Date().toISOString()}。这是代码、文件和元数据审计，不是韩语发音批准。历史稳定ID \`lesson-04\` 当前显示为第7课，但因任务明确要求审计其받침内容，仍纳入本表。\n\n`+
`## 结论\n\n- 共登记 **${rows.length}** 个独立播放器入口/状态入口（含禁用详情按钮、隐藏挑战、答后重播、错题重练和复习中心）。\n- P0 **${p0.length}**，P1 **${p1.length}**，P2 **${p2.length}**。当前不满足开始 Batch 1 的代码前置条件。\n- 所有现有正式目录音频均为 \`pending\`；自动测试或文件可解码不代表母语者审核通过。\n- 第0课、通用课程引擎、第4课对比课程和复习中心仍存在设备 \`speechSynthesis\` 路径；这是本次规则下的 P0。\n- 第6课全部可见音频按钮保持禁用，但词汇页把 \`왜\`、\`예\` 标为“完整单词”，而13条队列将它们定义为完整音节，属于生成前必须澄清的语义冲突。\n\n## 每课播放器数量\n\n| lesson/stableId | 显示课号 | 行数 | P0 | P1 | 缺失/无文件 |\n|---|---:|---:|---:|---:|---:|\n${byLesson.map(x=>`| ${x.lesson} | ${x.lesson==='k0-consonant-contrast'?4:x.lesson==='lesson-04'?7:x.lesson.replace('lesson-','')} | ${x.count} | ${x.p0} | ${x.p1} | ${x.missing} |`).join('\n')}\n\n`+
`## P0 问题\n\n${[...new Set(p0.map(x=>`- **${x.issueType}** — ${x.lessonId} / ${x.screenId}: ${x.recommendedAction}`))].join('\n')}\n\n`+
`## P1 问题\n\n${[...new Set(p1.map(x=>`- **${x.issueType}** — ${x.lessonId} / ${x.screenId}: ${x.recommendedAction}`))].slice(0,80).join('\n')}\n\n`+
`## 问题分级登记\n\n| priority | issue | 根因 | 用户影响 | 是否重生成 | 是否母语审核 | 修复建议 |\n|---|---|---|---|---|---|---|\n| P0 | forbidden-device-tts-fallback | 四个播放器实现仍调用设备speechSynthesis | 不同设备读法不可控、不可审计 | 否，先修代码 | 修复后新文件需要 | 移除TTS与文字替代，失败只显示翻译状态 |\n| P0 | pending-audio-enabled | 播放器只检查文件映射，不检查reviewStatus | 未审核声音被误认成标准音 | 16条系统导出建议重生成 | 是 | approved+存在+精确匹配才启用 |\n| P0 | button-catalog-audio-type-mismatch | 第6课왜/예同时作为词义卡和承载音节 | 按钮与审核对象类型冲突 | 可能需要独立语境版本 | 是 | 先确认语义，再建独立typed对象 |\n| P0 | catalog-or-semantic-mismatch | 对比/复习未走canonical精确文件映射 | fallback绕过manifest | 是/新增 | 是 | 每个speechText唯一映射文件 |\n| P1 | missing-audio | 字母名称、部分示例与第6课尚无文件 | 按钮禁用或核心发音目标缺失 | 新增 | 是 | 分批生成并保持pending |\n| P1 | rights-and-review-metadata-gap | 旧记录缺日期、商业使用依据、reviewer | 发布记录不完整 | 不一定 | 是 | 发布前补齐来源/权利/审核字段 |\n| P2 | mobile-playback-hardening | preload、快速连点和离线缓存未真机验证 | 弱网下可能延迟或状态残留 | 否 | 否 | iOS/Android真机回归与版本化URL |\n\n静态扫描未发现音频路径使用 \`includes\` / \`startsWith\` 做近似文本匹配；当前主要问题是fallback绕过精确映射。\n\n`+
`## 字段说明与完整数据\n\n完整逐行数据见 [K0_AUDIO_PLAYER_AUDIT.csv](K0_AUDIO_PLAYER_AUDIT.csv)。CSV列数：${COLUMNS.length}；数据行数：${rows.length}。\n\n`+
`### 完整播放器索引（便于代码审阅）\n\n| # | lesson | screen | control | button | speechText | type | file | exists | review | issue | priority |\n|---:|---|---|---|---|---|---|---|---|---|---|---|\n${rows.map((r,i)=>`| ${i+1} | ${r.lessonId} | ${r.screenId} | ${r.controlId} | ${r.buttonText.replaceAll('|','/')} | ${r.expectedSpeechText} | ${r.expectedAudioType} | ${r.audioFilePath||'—'} | ${r.fileExists} | ${r.reviewStatus} | ${r.issueType||'—'} | ${r.priority||'—'} |`).join('\n')}\n`;
fs.writeFileSync('K0_AUDIO_PLAYER_AUDIT.md', playerMd);

// Technical file audit using macOS read-only tools.
const audioFiles = fs.readdirSync('audio',{recursive:true}).filter(name=>/\.(?:mp3|wav)$/i.test(name)).map(name=>`audio/${name}`).sort();
const referenced = new Map();
for (const entry of allCatalog) { if (!referenced.has(entry.path)) referenced.set(entry.path,[]); referenced.get(entry.path).push(`${entry.lessonId}:${entry.id}:${entry.speechText}`); }
function probe(file) {
  const size = fs.statSync(file).size; let fileInfo='', mime='', af='';
  try { fileInfo=execFileSync('/usr/bin/file',['-b',file],{encoding:'utf8'}).trim(); } catch {}
  try { mime=execFileSync('/usr/bin/file',['-b','--mime-type',file],{encoding:'utf8'}).trim(); } catch {}
  try { af=execFileSync('/usr/bin/afinfo',[file],{encoding:'utf8'}); } catch {}
  const duration = af.match(/estimated duration:\s*([\d.]+) sec/)?.[1] || '';
  const formatLine = af.match(/Data format:\s+([^\n]+)/)?.[1] || '';
  const rate = formatLine.match(/([\d.]+) Hz/)?.[1] || '';
  const channels = formatLine.match(/(\d+) ch/)?.[1] || '';
  const decodable = Boolean(duration && formatLine);
  const refs = referenced.get(file)||[];
  let classification = !refs.length?'unused':decodable?'valid-technical':'corrupt';
  if (refs.length>1 && new Set(refs.map(x=>x.split(':').at(-1))).size>1) classification='duplicate-reference';
  return {file,size,fileInfo,mime,duration,rate,channels,decodable,refs,classification};
}
const tech = audioFiles.map(probe);
const declaredMissing = allCatalog.filter(entry=>!fs.existsSync(entry.path));
const technicalMd = `# K0 音频文件技术审计\n\n> 使用 \`file\` 与 \`afinfo\` 进行只读检查。技术有效只代表容器可识别/可解码，不代表韩语发音正确。未执行声学内容识别，也未生成或改写文件。\n\n## 汇总\n\n- 物理音频文件：**${tech.length}**（含 deprecated ${tech.filter(x=>x.file.includes('/deprecated/')).length}）。\n- canonical catalog已声明且存在：**${allCatalog.filter(x=>fs.existsSync(x.path)).length}**。\n- canonical catalog已声明但缺失：**${declaredMissing.length}**（对比课14 + 第6课13）。\n- 可由 \`afinfo\` 解码：**${tech.filter(x=>x.decodable).length}**。\n- approved：**${allCatalog.filter(x=>x.reviewStatus==='approved').length}**；pending：**${allCatalog.filter(x=>x.reviewStatus==='pending').length}**。\n\n## 物理文件\n\n| file | bytes | MIME | container/codec evidence | duration(s) | Hz | ch | decode | refs | classification | silence/cutoff conclusion |\n|---|---:|---|---|---:|---:|---:|---|---|---|---|\n${tech.map(x=>`| ${x.file} | ${x.size} | ${x.mime} | ${x.fileInfo.replaceAll('|','/')} | ${x.duration||'—'} | ${x.rate||'—'} | ${x.channels||'—'} | ${x.decodable} | ${x.refs.join('<br>')||'—'} | ${x.classification} | 参数无明显异常；仍需人工听首尾、停顿和静音 |`).join('\n')}\n\n## 声明但缺失\n\n${declaredMissing.map(x=>`- \`${x.path}\` ← ${x.lessonId}:${x.id} / \`${x.speechText}\` / ${x.reviewStatus}`).join('\n')}\n\n## 缓存与重复引用\n\n- Service Worker未预缓存具体音频；首次网络成功后会写入运行时缓存。策略为network-first，离线时可能回退旧缓存。\n- 文件名大小写冲突：${audioFiles.length===new Set(audioFiles.map(x=>x.toLowerCase())).size?'未发现':'存在，阻断发布'}。\n- 同一文件映射不同speechText：${tech.some(x=>x.classification==='duplicate-reference')?'存在':'未发现'}。\n- deprecated文件未被canonical catalog引用，保留为历史证据；本任务未删除。\n`;
fs.writeFileSync('K0_AUDIO_FILE_TECHNICAL_AUDIT.md',technicalMd + '\n## 语言审核分类\n\n所有被活动catalog/manifest引用的物理文件还同时属于 `needs-native-review`。`valid-technical` 只说明可解码；不能替代发音、停顿、语速、音变或自然度审核。\n');

const mobileMd = `# K0 手机音频风险审计\n\n> 本报告只做静态与本地代码审计，**不声称已完成真实iPhone或Android试听**。\n\n| 风险 | 证据 | 影响 | 优先级 | 建议 |\n|---|---|---|---|---|\n| 未经交互自动播放 | lesson-engine与对比课会在autoplay设置开启时延迟触发播放 | iOS Safari可能拒绝；随后落入设备TTS | P0 | 托管音频审核前禁用自动播放；失败只显示错误 |\n| 设备TTS fallback | lesson-00.js、lesson-engine.js、lesson-consonant-contrast.js、review.html | 不同手机声音/读法不可审计 | P0 | 完全移除课程音频fallback |\n| pending文件仍可播放 | 第0～5课静态映射没有审核门控 | 未审核发音被用户当成正式声音 | P0 | catalog lookup同时校验approved与文件存在 |\n| 多音频叠加 | 通用引擎会pause当前Audio；对比课用token/cancel；review会cancel TTS | 大部分受控，但Audio对象未统一回收 | P1 | 统一stop/pause/currentTime并恢复按钮状态 |\n| preload | 通用引擎和审计页使用auto；部分独立页动态Audio未显式preload | 移动网络下首次播放延迟 | P2 | 审核后按页面需要设metadata/none并测试 |\n| MIME/扩展名 | 现有MP3/WAV均由file/afinfo识别 | GitHub Pages一般可播放；仍需Safari实测WAV | P1 | 真机验证MP3/WAV响应Content-Type |\n| Service Worker | 音频未预缓存，运行时network-first写缓存 | 离线可能播放旧版本 | P1 | 审核发布使用版本化文件名并增加缓存测试 |\n| 相对路径/大小写 | 均为相对路径；未发现大小写冲突 | GitHub Pages路径策略基本正确 | P2 | 部署后逐文件HEAD/播放验证 |\n| 触控区域 | lesson-player按钮有移动样式；本审计未逐设备测量 | 小屏可用性仍需人工确认 | P2 | 390px浏览器+真实iPhone/Android验证≥44px |\n\n## 必须人工手机验证\n\n1. iPhone Safari：首次点击、再次播放、静音拨片、后台返回、切题停止、错误恢复。\n2. Android Chrome：首次点击、快速连点、蓝牙/扬声器切换、切语言保持韩语对象。\n3. GitHub Pages：MP3与WAV MIME、404、Service Worker离线旧缓存、版本化URL。\n4. 速度设置：0.8–1.2倍不改变音高；本地属性存在不等于所有设备实现一致。\n`;
fs.writeFileSync('K0_MOBILE_AUDIO_RISK_AUDIT.md',mobileMd);

const rightsGaps = allCatalog.filter(entry=>!entry.generationDate||!commercialBasis(entry)||!entry.nativeReviewer||entry.reviewStatus!=='approved');
const rightsMd = `# K0 音频来源、权利与审核缺口\n\n> 这是发布记录完整性检查，不构成法律意见。报告不含API密钥、Token、个人账号或私人配置。\n\n## 汇总\n\n- canonical项目：${allCatalog.length}\n- voiceSource有值：${allCatalog.filter(x=>x.voiceSource).length}\n- model可追溯：${allCatalog.filter(x=>modelFor(x)).length}\n- generationDate有值：${allCatalog.filter(x=>x.generationDate).length}\n- commercialUseBasis/商业使用记录有值：${allCatalog.filter(x=>commercialBasis(x)).length}\n- nativeReviewer有值：${allCatalog.filter(x=>x.nativeReviewer).length}\n- approved：${allCatalog.filter(x=>x.reviewStatus==='approved').length}\n\n**结论：当前没有任何音频同时具备完整来源、生成日期、商业使用依据和母语者批准记录。不得把pending当作正式发布批准。**\n\n| id | speechText | source | model | date | commercial basis | status | reviewer | gap |\n|---|---|---|---|---|---|---|---|---|\n${rightsGaps.map(x=>`| ${x.lessonId}:${x.id} | ${x.speechText} | ${x.voiceSource||'—'} | ${modelFor(x)||'—'} | ${x.generationDate||'—'} | ${commercialBasis(x)||'—'} | ${x.reviewStatus} | ${x.nativeReviewer||'—'} | ${[!x.generationDate&&'generationDate',!commercialBasis(x)&&'commercialUseBasis',!x.nativeReviewer&&'nativeReviewer',x.reviewStatus!=='approved'&&'approval'].filter(Boolean).join(', ')} |`).join('\n')}\n\n## 特别风险\n\n- 16条 \`apple-system-ko-KR-yuna\` 导出文件记录了系统声源，但没有可核验的生成日期或商业使用依据；建议用明确授权/条款记录的托管声源重新制作，并保持pending。\n- 30条现有OpenAI来源文件没有逐条model/date/commercialUseBasis字段，且无nativeReviewer。\n- 对比课14条和第6课13条尚未生成；manifest中的planned source不等于已经产生的文件或既得权利记录。\n- 若未来采用真人录音，必须另行记录voiceTalent、consentRecord、commercialUseRecord。\n`;
fs.writeFileSync('K0_AUDIO_RIGHTS_AND_REVIEW_GAPS.md',rightsMd);

const batches = {
  'Batch 0（代码修复，不生成）':[
    ['code-remove-device-tts','0–4/review','—','—','—',0,'否','否','移除四处speechSynthesis并建立fail-closed'],
    ['code-review-gate','0–5','—','—','—',0,'否','否','pending/rejected不得启用按钮'],
    ['code-lesson06-semantic','6','왜、예','word/syllable','—',2,'否','否','解决词汇页按钮与13条队列类型冲突'],
    ['code-canonical-types','1–4/7','—','—','—',0,'否','否','把旧vowel/batchim/sound-change统一为严格audioType']
  ],
  'Batch 1（核心元音承载音节）':[['yo','0','요','vowel-carrier','yo.mp3',1,'否','是','口型与y滑音'],['yu','0','유','vowel-carrier','yu.mp3',1,'否','是','口型与y滑音']],
  'Batch 2（核心辅音示例与对比）':[
    ...['가:ga','카:ka','까:kka','다:da','타:ta','따:tta','바:ba','파:pa','빠:ppa','자:ja','차:cha','짜:jja','사:sa','싸:ssa','하:ha','그:geu'].map(pair=>{const [speech,id]=pair.split(':');return[id,speech==='그'?'5':'0/4',speech,speech==='그'?'syllable':'initial-example',`${id}.mp3`,[...speech].length,'否','是',speech==='그'?'第5课上下结构完整音节':'普通/送气/紧音、气流与紧张度'];})
  ],
  'Batch 3（替换系统导出核心音频）':allCatalog.filter(x=>String(x.voiceSource).startsWith('apple-system')).map(x=>[`${x.lessonId}-${x.id}`,x.lessonId,x.speechText,typeFor(x,x.speechText),x.file.replace(/-v2\.wav$/, '-v3.mp3'),[...x.speechText].length,Boolean(x.pronunciationRule)?'是':'否','是',x.pronunciationRule||'自然完整音节/单词']),
  'Batch 4（第6课13条）':(lessonManifests['lesson-06']?.items||[]).map(x=>[x.id,'6',x.speechText,x.audioType,x.file,[...x.speechText].length,/(varies|overlap|close|ㅢ)/i.test(x.pronunciationRule)?'是':'否','否',x.reviewNotes]),
  'Batch 5（可选字母名称）':[['ㄱ','기역','giyeok'],['ㄴ','니은','nieun'],['ㄷ','디귿','digeut'],['ㄹ','리을','rieul'],['ㅁ','미음','mieum'],['ㅂ','비읍','bieup'],['ㅅ','시옷','siot'],['ㅇ','이응','ieung'],['ㅈ','지읒','jieut'],['ㅎ','히읗','hieut'],['ㅋ','키읔','kieuk'],['ㅌ','티읕','tieut'],['ㅍ','피읖','pieup'],['ㅊ','치읓','chieut'],['ㄲ','쌍기역','ssang-giyeok'],['ㄸ','쌍디귿','ssang-digeut'],['ㅃ','쌍비읍','ssang-bieup'],['ㅆ','쌍시옷','ssang-siot'],['ㅉ','쌍지읒','ssang-jieut']].map(([symbol,speech,id])=>[id,'0',speech,'letter-name',`${id}.mp3`,[...speech].length,'否','否',`字母${symbol}名称，自然完整读法`])
};
const batchRows = Object.values(batches).flat(); const totalChars=Object.entries(batches).filter(([name])=>!name.includes('Batch 0')).flatMap(([,items])=>items).reduce((sum,x)=>sum+(Number(x[5])||0),0);
const generationMd = `# K0 音频分批生成计划\n\n> 本计划不调用API、不生成文件、不估算价格。任何生成产物仍须保持pending并由韩语母语者审核。每个生成批次不超过20条。\n\n## 统计\n\n- 审计播放器入口：${rows.length}\n- 现有canonical文件：${allCatalog.filter(x=>fs.existsSync(x.path)).length}\n- 技术可解码物理文件：${tech.filter(x=>x.decodable&&!x.file.includes('/deprecated/')).length}\n- approved：${allCatalog.filter(x=>x.reviewStatus==='approved').length}\n- pending canonical：${allCatalog.filter(x=>x.reviewStatus==='pending').length}\n- canonical缺失：${declaredMissing.length}\n- 明确错误/语义映射：${rows.filter(x=>x.issueType.includes('mismatch')).length}\n- 建议重新生成：${allCatalog.filter(x=>String(x.voiceSource).startsWith('apple-system')).length}\n- 建议新增：${Object.entries(batches).filter(([name])=>!name.includes('Batch 0')&&!name.includes('Batch 3')).flatMap(([,x])=>x).length}\n- 计划生成文本总字符数：${totalChars}\n\n${Object.entries(batches).map(([name,items])=>`## ${name}\n\n条数：**${items.length}**${items.length>20?'（错误：超过20）':''}\n\n| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |\n|---|---|---|---|---|---:|---|---|---|\n${items.map(x=>`| ${x.join(' | ')} |`).join('\n')}`).join('\n\n')}\n\n## 生成门禁\n\nBatch 0完成、严格测试通过、产品确认 \`왜/예\` 的词/音节语义后，才允许启动Batch 1。生成只走手动workflow_dispatch，Artifact审阅后不得直接写main。\n`;
fs.writeFileSync('K0_AUDIO_GENERATION_BATCH_PLAN.md',generationMd);

const reviewItems = [...new Map([...allCatalog,...batchRows.filter(x=>x[2]&&x[2]!=='—').map(x=>({lessonId:String(x[1]),id:x[0],displayText:x[2],speechText:x[2],type:x[3],reviewStatus:'planned'}))].map(x=>[`${x.lessonId}:${x.id}:${x.speechText}`,x])).values()];
const mandatory = speech => ['감사합니다','안녕하세요','의','의자','왜','외','웨','얘','예'].includes(speech) || /[ㄴㅁㅇㄹ]$/u.test(speech) || ['가','카','까','다','타','따','바','파','빠','자','차','짜','사','싸'].includes(speech);
const reviewMd = `# K0 韩语母语者音频审核清单\n\n> 代码测试不能填写“通过”。请由可识别标准首尔韩语的母语审核者逐条试听并记录日期。\n\n| mandatory | lesson/id | 页面按钮文案 | 预期对象 | speechText | 标准韩语 | 自然女声 | 异常停顿 | 多余语气词 | 截断 | 自然语速 | 慢速版 | 받침 | 连音 | 鼻音化 | 紧音化 | 复合元音 | 结果 | 退回原因 | reviewer | reviewDate |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${reviewItems.map(x=>{const type=typeFor(x,x.speechText);const isMandatory=mandatory(x.speechText)||['sentence','dialogue-line'].includes(type);return`| ${isMandatory?'必须':'常规'} | ${x.lessonId}:${x.id} | ${type==='letter-name'?`听字母名称 ${x.speechText}`:type==='word'?`听完整单词 ${x.speechText}`:type==='sentence'?`听完整句子 ${x.speechText}`:`听完整音节 ${x.speechText}`} | ${type} | ${x.speechText} | ${x.expectedPronunciation||x.speechText} | □ | □ | □ | □ | □ | □ | ${x.pronunciationRule?.includes('받침')?'是':'否'} | □ | ${/鼻音|함니/.test(x.pronunciationRule||'')?'是':'否'} | □ | ${/[ㅒㅖㅘㅙㅚㅝㅞㅟㅢ]/u.test(x.speechText)?'是':'否'} | pending |  |  |  |`;}).join('\n')}\n\n## 强制人工审核组\n\n- 감사합니다（鼻音化/自然连读）、안녕하세요（完整句子语调）。\n- 所有받침示例；所有普通音/送气音/紧音对比。\n- ㅙ/ㅚ/ㅞ、ㅒ/ㅖ；不得要求夸大的不自然差异。\n- 의与의자必须分开审核。\n- 所有现有及未来句子、对话行。\n`;
fs.writeFileSync('K0_NATIVE_AUDIO_REVIEW_CHECKLIST.md',reviewMd);

console.log(JSON.stringify({rows:rows.length,byLesson,p0:p0.length,p1:p1.length,physicalAudioFiles:tech.length,canonicalExisting:allCatalog.filter(x=>fs.existsSync(x.path)).length,canonicalMissing:declaredMissing.length,technicalValid:tech.filter(x=>x.decodable).length,approved:allCatalog.filter(x=>x.reviewStatus==='approved').length,pending:allCatalog.filter(x=>x.reviewStatus==='pending').length,batches:Object.fromEntries(Object.entries(batches).map(([k,v])=>[k,v.length])),speechTextCharacters:totalChars},null,2));
