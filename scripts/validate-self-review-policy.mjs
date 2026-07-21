import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages=['zh','en','vi','ja'];
const rules=fs.readFileSync('NIKIGO_DEVELOPMENT_RULES.md','utf8');
const todo=fs.readFileSync('NIKIGO_DEVELOPMENT_TODO.md','utf8');

for(const marker of [
  '永久“自查—自纠—再验收”门禁','不得用内部测试 URL 代替导航验收','完整走完一次正确路线',
  '至少提交一次错误答案','新用户、已有进度用户和已完成用户','390×844、768×1024、1440×900',
  '控制台 warning/error','网络 4xx/5xx','强制自纠循环','源代码存在且结构有效','用户从可见入口实际可操作'
])assert.ok(rules.includes(marker),`Development rules missing permanent self-review marker: ${marker}`);
for(const marker of [
  '永久课程Sprint自查清单','从课程首页点击进入','错误答案与错题重练','新用户、已有进度用户和已完成用户',
  '浏览器实际渲染','等待产品负责人审核修复功能分支'
])assert.ok(todo.includes(marker),`Development TODO missing self-review checklist marker: ${marker}`);

function loadCatalog(){const context={window:{}};context.window.window=context.window;vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),context);return context.window.NIKIGO_COURSES}
const courses=loadCatalog().filter(course=>course.displayNumber>=0&&course.displayNumber<=13);
assert.equal(courses.length,14);
assert.deepEqual([...courses.map(course=>course.stableId)],Array.from({length:14},(_,index)=>`lesson-${String(index).padStart(2,'0')}`));
assert.equal(new Set(courses.map(course=>course.file)).size,courses.length,'Canonical course files must be unique.');

function loadEmbeddedLesson(file){
  const html=fs.readFileSync(file,'utf8');
  const blocks=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match=>match[1]);
  let mounted;
  const window={
    NikigoHangulSoundData:{select:symbols=>symbols.map(symbol=>({symbol,audioType:'syllable'}))},
    NikigoAudio:{forLesson:()=>({audioFiles:{},pronunciationText:{}})}
  };
  window.window=window;
  const context={window,NikigoLesson:{mount:config=>{mounted=config}},Object,console};
  vm.runInNewContext(blocks.at(-1),context,{filename:file});
  assert.ok(mounted,`${file} did not expose its effective lesson configuration.`);
  return mounted;
}

function meaningful(value,path,min=4){assert.equal(typeof value,'string',`${path} missing`);assert.ok(value.trim().length>=min,`${path} is empty or too short`);assert.doesNotMatch(value,/\b(?:TODO|TBD|FIXME|LOREM)\b|undefined|null/i,`${path} contains placeholder copy`)}
function validateQuestion(question,copy,path){
  assert.ok(Array.isArray(question.options)&&question.options.length>=2,`${path} needs at least two options`);
  assert.equal(new Set(question.options.map(String)).size,question.options.length,`${path} has duplicate options`);
  assert.ok(Number.isInteger(question.answer)&&question.answer>=0&&question.answer<question.options.length,`${path} has an unreachable answer`);
  for(const language of languages)meaningful(copy[language][question.prompt],`${path}.${language}.prompt`);
}

for(const number of [1,2,3]){
  const id=`lesson-${String(number).padStart(2,'0')}`;const config=loadEmbeddedLesson(`${id}.html`);
  assert.equal(config.id,id);
  for(const language of languages){
    const copy=config.copy[language];assert.ok(copy,`${id}.${language} copy missing`);
    for(const key of ['introTitle','goal1d','goal2d','goal3d','vowelTitle','conTitle','builderTitle','challengeTitle'])meaningful(copy[key],`${id}.${language}.${key}`);
    for(const key of ['introLead','vowelLead','conLead','builderLead','challengeLead','completeLead','reviewPerfect'])meaningful(copy[key],`${id}.${language}.${key}`,8);
    const effectiveAudioCopy=[copy.aiVoice,copy.audioUnavailable].join(' ');
    assert.doesNotMatch(effectiveAudioCopy,/device voice|设备.*语音|giọng.*thiết bị|端末.*音声/i,`${id}.${language} advertises a forbidden device-voice fallback`);
  }
  config.practice.forEach((question,index)=>validateQuestion(question,config.copy,`${id}.practice${index}`));
  config.quiz.forEach((question,index)=>validateQuestion(question,config.copy,`${id}.quiz${index}`));
}

function loadSprint(file){const window={};window.window=window;vm.runInNewContext(fs.readFileSync(file,'utf8'),{window},{filename:file});return window.NikigoLessonConfig}
function localized(value,path,min=8){assert.ok(value&&typeof value==='object'&&!Array.isArray(value),`${path} must be localized`);for(const language of languages)meaningful(value[language],`${path}.${language}`,min)}
function validateSprintStep(step,path){
  localized(step.title,`${path}.title`,2);localized(step.lead,`${path}.lead`,8);
  if(['choice','scenario','listening'].includes(step.type)){
    assert.ok(Array.isArray(step.options)&&step.options.length>=2,`${path} needs at least two options`);
    assert.equal(new Set(step.options.map(option=>option.id)).size,step.options.length,`${path} has duplicate option ids`);
    assert.ok(step.options.some(option=>option.id===step.correct),`${path} correct answer is unreachable`);
  }else if(step.type==='match'){
    assert.ok(Array.isArray(step.pairs)&&step.pairs.length>=2,`${path} needs meaningful pairs`);
    assert.equal(new Set(step.pairs.map(pair=>pair.id)).size,step.pairs.length,`${path} has duplicate pair ids`);
  }else if(step.type==='build'){
    assert.ok(Array.isArray(step.groups)&&step.groups.length>=2,`${path} needs multiple build groups`);
    for(const group of step.groups)assert.ok(group.options?.some(option=>option.id===group.correct),`${path}.${group.id} correct build part is unreachable`);
  }else if(['intro','concept'].includes(step.type)){
    const payload=['items','rows','dialogue'].reduce((total,key)=>total+(Array.isArray(step[key])?step[key].length:0),0);
    assert.ok(payload>=2,`${path} lacks examples or teaching payload`);
  }else assert.equal(step.type,'complete',`${path} has unsupported type ${step.type}`);
}

for(let number=8;number<=13;number+=1){
  const id=`lesson-${String(number).padStart(2,'0')}`;const config=loadSprint(`${id}.js`);
  assert.equal(config.id,id);assert.ok(config.steps.length>=13,`${id} content density is below the established course baseline`);
  config.steps.forEach((step,index)=>validateSprintStep(step,`${id}.step${index}`));
  const signatures=config.steps.slice(0,-1).map(step=>languages.map(language=>`${step.title[language]} ${step.lead[language]}`.trim().toLowerCase()).join('|'));
  assert.equal(new Set(signatures).size,signatures.length,`${id} contains duplicate filler steps`);
}

for(const course of courses){
  assert.ok(fs.existsSync(course.file),`${course.stableId} canonical file is missing`);
  const source=[course.file,course.file.replace(/\.html$/,'.js')].filter(fs.existsSync).map(file=>fs.readFileSync(file,'utf8')).join('\n');
  assert.doesNotMatch(source,/\b(?:TODO|TBD|FIXME|LOREM)\b/i,`${course.stableId} contains placeholder teaching markers`);
}

for(const file of fs.readdirSync('.').filter(name=>/^lesson-(?:0[0-9]|1[0-3]).*\.(?:html|js)$/.test(name))){
  const source=fs.readFileSync(file,'utf8');
  assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance/,`${file} contains device TTS`);
}

const evidence=JSON.parse(fs.readFileSync('quality-fix/course-content-audit/CONTENT_INTEGRITY_MATRIX.json','utf8'));
assert.equal(evidence.browser,'Google Chrome');assert.equal(evidence.matrix.length,14);
for(const course of courses){
  const item=evidence.matrix.find(row=>row.expectedId===course.stableId);assert.ok(item,`${course.stableId} lacks browser evidence`);
  assert.equal(item.runtimeLessonId,course.stableId);assert.equal(new URL(item.entryHref).pathname.split('/').at(-1),course.file);
  assert.equal(item.navigationSource,'course-home-click',`${course.stableId} was not entered from the visible course home`);
  assert.deepEqual(item.viewportChecks.map(check=>check.width),[390,768,1440]);
  assert.ok(item.viewportChecks.every(check=>!check.horizontalOverflow&&!check.blank),`${course.stableId} failed a viewport`);
  for(const checkpoint of ['first','middle','precomplete']){
    meaningful(item[checkpoint].text,`${course.stableId}.${checkpoint}`,20);
    assert.ok(fs.existsSync(`quality-fix/course-content-audit/${item.screenshots[checkpoint]}`),`${course.stableId}.${checkpoint} screenshot missing`);
  }
  if(item.stepCount>2){
    assert.notEqual(item.first.text,item.middle.text,`${course.stableId} first and middle content are duplicate`);
    assert.notEqual(item.middle.text,item.precomplete.text,`${course.stableId} middle and summary content are duplicate`);
  }
}
assert.equal(evidence.consoleIssueCount,0);assert.equal(evidence.networkFailureCount,0);assert.equal(evidence.serviceWorker.controlled,true);assert.match(evidence.serviceWorker.cache,/nikigo-v27-self-review-gate/);

const completions=JSON.parse(fs.readFileSync('quality-fix/course-content-audit/full-course-completions/FULL_COURSE_COMPLETIONS.json','utf8'));
assert.equal(completions.consoleIssueCount,0);
assert.deepEqual(completions.results.map(item=>item.language),languages);
for(const result of completions.results){
  assert.equal(result.navigationSource,'course-home-click');assert.equal(result.runtimeId,result.course);
  assert.equal(result.wrongAnswerTriggered,true);assert.equal(result.retryObserved,true);assert.equal(result.courseBackPassed,true);assert.equal(result.browserBackPassed,true);assert.equal(result.refreshPassed,true);
  assert.equal(result.firstCompletion.xp,50);assert.equal(result.repeatCompletion.xp,50);assert.deepEqual(result.repeatCompletion.completedLessons,[result.course]);
}
const lesson04Interaction=JSON.parse(fs.readFileSync('quality-fix/course-content-audit/lesson-04-interaction/FULL_INTERACTION.json','utf8'));
assert.equal(lesson04Interaction.navigationSource,'course-home-click');assert.equal(lesson04Interaction.runtimeLessonId,'lesson-04');assert.equal(lesson04Interaction.consoleIssueCount,0);
for(const key of ['wrongAnswerTriggered','retryObserved','courseBackPassed','browserBackPassed','refreshPassed'])assert.equal(lesson04Interaction[key],true);
assert.equal(lesson04Interaction.firstCompletion.xp,50);assert.equal(lesson04Interaction.repeatCompletion.xp,50);assert.match(lesson04Interaction.repeatCompletion.text,/不重复发放XP/);

const progressCombinations=JSON.parse(fs.readFileSync('quality-fix/course-content-audit/progress-combinations/PROGRESS_COMBINATIONS.json','utf8'));
assert.deepEqual(progressCombinations.scenarios.map(item=>item.scenario),['fresh','both-completed','lesson07-only','lesson04-only']);
assert.deepEqual(progressCombinations.scenarios.map(item=>item.lesson7.profile.completedLessons),[
  [],['lesson-04','lesson-07'],['lesson-07'],['lesson-04']
]);
for(const scenario of progressCombinations.scenarios){
  assert.equal(scenario.navigationSource,'course-home-click');
  assert.equal(scenario.lesson4.lessonId,'lesson-04');
  assert.equal(scenario.lesson7.lessonId,'lesson-07');
}

console.log('Validated the permanent self-review policy, current course content contracts, strict exercise answers, four-language copy, route identity, exact Lesson 4/7 progress isolation, three-checkpoint real-Chrome evidence, three viewports, network/console health, and Service Worker version.');
