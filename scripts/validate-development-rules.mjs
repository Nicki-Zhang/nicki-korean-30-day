import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const agents=fs.readFileSync('AGENTS.md','utf8');
const rules=fs.readFileSync('NIKIGO_DEVELOPMENT_RULES.md','utf8');
for(const marker of ['NIKIGO_DEVELOPMENT_RULES.md','real-browser visual acceptance','API keys','Telegram'])assert.ok(agents.includes(marker),`AGENTS.md missing ${marker}`);
for(const marker of ['releaseStatus','accessStatus','recommendedPrerequisites','userProgress','audioStatus','pronunciation','syllable-builder','vocabulary','grammar','scenario-dialogue','review-challenge','390×844','768×1024','1440×900','document.fonts.ready','commercialUseBasis'])assert.ok(rules.includes(marker),`Development rules missing ${marker}`);

const context={window:{}};context.window.window=context.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),context,{filename:'course-catalog.js'});
const catalog=context.window.NIKIGO_COURSES;
const developed=catalog.filter(course=>course.status==='available');
const untouchedProfile={xp:175,completedLessons:['lesson-01'],lessonProgress:{'lesson-02':45},futureField:{keep:true}};
const profileBefore=JSON.stringify(untouchedProfile);
for(const course of developed){
  assert.equal(course.accessStatus,'available');
  assert.equal(course.requiresCompletion,false);
  assert.deepEqual([...course.prerequisites],[]);
  assert.equal(context.window.NIKIGO_COURSE_UNLOCKED(course,[]),true);
}
assert.equal(JSON.stringify(untouchedProfile),profileBefore,'Checking or entering course access must not mutate progress or XP.');
assert.ok(developed.filter(course=>course.displayNumber<=6).every(course=>course.file));
assert.ok(developed.filter(course=>course.displayNumber>0&&course.displayNumber<=6).every(course=>course.recommendedPrerequisites.length===1));
const preview=catalog.find(course=>course.stableId==='lesson-06');
assert.equal(preview.releaseStatus,'preview');
assert.equal(preview.audioStatus,'pending');
for(const course of catalog.filter(course=>course.status==='comingSoon')){
  assert.equal(course.accessStatus,'unavailable');
  assert.equal(course.releaseStatus,'comingSoon');
  assert.equal(course.file,null);
  assert.equal(context.window.NIKIGO_COURSE_UNLOCKED(course,[]),false);
}

const queue=fs.readFileSync('AUDIO_GENERATION_REVIEW_QUEUE.md','utf8');
const manifest=JSON.parse(fs.readFileSync('audio/lesson-06/manifest.json','utf8'));
assert.equal(manifest.items.length,13);
for(const item of manifest.items){
  assert.equal(item.lessonId,'lesson-06');
  assert.equal(item.reviewStatus,'pending');
  assert.equal(item.generationDate,null);
  assert.equal(item.nativeReviewer,null);
  assert.ok(queue.includes(`| ${item.id} | lesson-06 |`),`Audio queue missing ${item.id}`);
  assert.equal(fs.existsSync(`audio/lesson-06/${item.file}`),false,`${item.file} must not exist before generation`);
}
assert.equal(manifest.items.filter(item=>item.audioType==='syllable').length,9);
assert.equal(manifest.items.filter(item=>item.audioType==='word').length,4);
console.log('Validated fixed development rules, independent course states, direct access, recommendation path, and 13 pending Lesson 6 audio records.');
