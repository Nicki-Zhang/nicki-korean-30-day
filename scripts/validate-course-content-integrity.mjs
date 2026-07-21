import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const languages = ['zh','en','vi','ja'];
const catalogContext = { window:{} };
catalogContext.window.window = catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),catalogContext,{filename:'course-catalog.js'});
const lessons = catalogContext.window.NIKIGO_COURSES.filter(course => course.displayNumber >= 0 && course.displayNumber <= 13);

assert.equal(lessons.length,14);
assert.deepEqual([...lessons.map(course => course.stableId)],Array.from({length:14},(_,index)=>`lesson-${String(index).padStart(2,'0')}`));
assert.equal(new Set(lessons.map(course => course.stableId)).size,14);
assert.equal(new Set(lessons.map(course => course.file)).size,14);
assert.equal(lessons[4].file,'lesson-04.html');
assert.equal(lessons[7].file,'lesson-07.html');

const lesson04Html = fs.readFileSync('lesson-04.html','utf8');
const legacyLesson04Html = fs.readFileSync('lesson-consonant-contrast.html','utf8');
const lesson04Source = fs.readFileSync('lesson-consonant-contrast.js','utf8');
const lesson07Source = fs.readFileSync('lesson-07.js','utf8');
assert.match(lesson04Html,/lesson-consonant-contrast\.js/);
assert.doesNotMatch(lesson04Html,/lesson-07\.html/);
assert.match(legacyLesson04Html,/lesson-04\.html/);
assert.match(lesson04Source,/const LESSON_ID = 'lesson-04'/);
assert.match(lesson04Source,/const AUDIO_LESSON_ID = 'k0-consonant-contrast'/);
assert.match(lesson07Source,/const LESSON_ID = 'lesson-07'/);
assert.match(lesson07Source,/const AUDIO_LESSON_ID = 'lesson-04'/);
for (const file of ['lesson-00.js','lesson-engine.js','lesson-consonant-contrast.js','lesson-05.js','lesson-06.js','lesson-07.js','lesson-sprint-engine.js']) {
  assert.match(fs.readFileSync(file,'utf8'),/NikigoCurrentLesson/,`${file} must expose the current runtime lesson identity`);
}

function loadConfig(file) {
  const window = {};
  window.window = window;
  vm.runInNewContext(fs.readFileSync(file,'utf8'),{window},{filename:file});
  return window.NikigoLessonConfig;
}

function localizedText(value,path) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value),`${path} must be localized`);
  for (const language of languages) {
    assert.equal(typeof value[language],'string',`${path}.${language} missing`);
    assert.ok(value[language].trim().length >= 4,`${path}.${language} is not meaningful visible copy`);
    assert.doesNotMatch(value[language],/undefined|null/i,`${path}.${language} contains placeholder text`);
  }
}

function payloadSize(step) {
  return ['items','rows','dialogue','options','pairs','groups','context']
    .reduce((count,key)=>count+(Array.isArray(step[key])?step[key].length:0),0);
}

for (let number = 8; number <= 13; number += 1) {
  const id = `lesson-${String(number).padStart(2,'0')}`;
  const config = loadConfig(`${id}.js`);
  assert.equal(config.id,id);
  assert.ok(config.steps.length >= 13,`${id} has too few learning steps`);
  const checkpoints = [config.steps[0],config.steps[Math.floor((config.steps.length-2)/2)],config.steps.at(-2)];
  for (const [index,step] of checkpoints.entries()) {
    localizedText(step.title,`${id}.checkpoint${index}.title`);
    localizedText(step.lead,`${id}.checkpoint${index}.lead`);
    assert.ok(payloadSize(step) > 0 || step.type === 'concept' || step.type === 'intro',`${id}.${step.id} is title-only`);
  }
  const signatures = config.steps.slice(0,-1).map(step=>languages.map(language=>`${step.title?.[language]||''} ${step.lead?.[language]||''}`).join('|'));
  assert.equal(new Set(signatures).size,signatures.length,`${id} repeats placeholder content`);
}

for (const [file,markers] of Object.entries({
  'lesson-00.js':['basicConsonantsTitle','basicVowelsTitle','readerDescription'],
  'lesson-01.html':['vowelTitle','builderTitle','challengeTitle'],
  'lesson-02.html':['vowelTitle','wordsTitle','challengeTitle'],
  'lesson-03.html':['vowelTitle','wordsTitle','challengeTitle'],
  'lesson-consonant-contrast.js':['renderIntro','renderGroup','renderSummary'],
  'lesson-05.js':['renderIntro','renderBuilder','renderSummary'],
  'lesson-06.js':['renderIntro','renderWords','renderSummary'],
  'lesson-07.js':['renderIntro','renderExample','renderChallenge']
})) {
  const source = fs.readFileSync(file,'utf8');
  for (const marker of markers) assert.ok(source.includes(marker),`${file} missing visible-content marker ${marker}`);
}

for (const source of [lesson04Source,fs.readFileSync('lesson-05.js','utf8'),fs.readFileSync('lesson-06.js','utf8'),lesson07Source,fs.readFileSync('lesson-sprint-engine.js','utf8')]) {
  assert.match(source,/data-action="review"/,'Completed lessons must expose a review path');
}

const migration = fs.readFileSync('app-state.js','utf8');
for (const marker of ['nikigoCourseIdentityMigration:v1','nikigoLessonSession:k0-consonant-contrast','nikigoLessonSession:lesson-04','nikigoLessonSession:lesson-07']) {
  assert.ok(migration.includes(marker),`Course identity migration missing ${marker}`);
}

const matrix = JSON.parse(fs.readFileSync('quality-fix/course-content-audit/CONTENT_INTEGRITY_MATRIX.json','utf8'));
assert.equal(matrix.browser,'Google Chrome');
assert.equal(matrix.matrix.length,14);
for (const lesson of lessons) {
  const evidence = matrix.matrix.find(item => item.displayNumber === lesson.displayNumber);
  assert.equal(evidence.expectedId,lesson.stableId);
  assert.equal(evidence.runtimeLessonId,lesson.stableId);
  assert.equal(evidence.blank,false);
  assert.equal(evidence.wrongCourse,false);
  assert.equal(evidence.undefinedText,false);
  assert.equal(evidence.horizontalOverflow,false);
  for (const checkpoint of ['first','middle','precomplete']) assert.ok(evidence[checkpoint].text.trim().length >= 20,`${lesson.stableId} ${checkpoint} evidence is not meaningful`);
}

const combinations = JSON.parse(fs.readFileSync('quality-fix/course-content-audit/progress-combinations/PROGRESS_COMBINATIONS.json','utf8'));
assert.deepEqual(combinations.scenarios.map(item=>item.scenario),['fresh','both-completed','lesson07-only','lesson04-only']);
for (const scenario of combinations.scenarios) {
  assert.equal(scenario.lesson4.lessonId,'lesson-04');
  assert.equal(scenario.lesson7.lessonId,'lesson-07');
}
assert.equal(combinations.scenarios[0].lesson4.progress,'1 / 15');
assert.equal(combinations.scenarios[0].lesson7.progress,'1 / 13');
assert.equal(combinations.scenarios[1].lesson4.reviewButton,'↻ 重新学习本课');
assert.equal(combinations.scenarios[1].lesson7.reviewButton,'↻ 重新学习本课');
assert.equal(combinations.scenarios[2].lesson4.progress,'1 / 15');
assert.equal(combinations.scenarios[2].lesson7.progress,'13 / 13');
assert.equal(combinations.scenarios[3].lesson4.progress,'15 / 15');
assert.equal(combinations.scenarios[3].lesson7.progress,'1 / 13');

const completions = JSON.parse(fs.readFileSync('quality-fix/course-content-audit/full-course-completions/FULL_COURSE_COMPLETIONS.json','utf8'));
assert.equal(completions.browser,'Google Chrome');
assert.equal(completions.consoleIssueCount,0);
assert.deepEqual(completions.results.map(item=>item.language),languages);
for (const result of completions.results) {
  assert.equal(result.runtimeId,result.course);
  assert.equal(result.completed,true);
  assert.deepEqual(result.completedLessons,[result.course]);
  assert.equal(result.xp,50);
  assert.ok(result.reviewButton);
}

console.log('Validated Lessons 0–13 visible-content checkpoints, unique current identities, canonical Lesson 4/7 routing, four migration combinations, four-language full-course completion, review re-entry, and legacy progress migration.');
