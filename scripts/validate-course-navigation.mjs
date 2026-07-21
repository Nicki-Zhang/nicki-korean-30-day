import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync('nikigo-app.html','utf8');
const worker=fs.readFileSync('sw.js','utf8');
const harness=fs.readFileSync('tests/course-navigation-regression.html','utf8');
const evidence=JSON.parse(fs.readFileSync('quality-fix/course-navigation/NAVIGATION_RESULT.json','utf8'));
const contentEvidence=JSON.parse(fs.readFileSync('quality-fix/course-content-audit/CONTENT_INTEGRITY_MATRIX.json','utf8'));
const context={window:{}};context.window.window=context.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),context,{filename:'course-catalog.js'});
const developed=context.window.NIKIGO_COURSES.filter(lesson=>lesson.displayNumber>=0&&lesson.displayNumber<=13);

assert.equal(developed.length,14);
for(const lesson of developed){
  assert.equal(lesson.status,'available',`${lesson.stableId} must stay directly accessible.`);
  assert.ok(lesson.file&&fs.existsSync(lesson.file),`${lesson.stableId} target is missing.`);
  const audit=contentEvidence.matrix.find(item=>item.displayNumber===lesson.displayNumber);
  assert.ok(audit,`${lesson.stableId} lacks current real-Chrome content evidence.`);
  assert.equal(audit.expectedId,lesson.stableId,`${lesson.stableId} catalog identity differs from browser evidence.`);
  assert.equal(audit.runtimeLessonId,lesson.stableId,`${lesson.stableId} runtime identity differs from its route.`);
  assert.equal(new URL(audit.entryHref).pathname.split('/').at(-1),lesson.file,`${lesson.stableId} href differs from its canonical file.`);
  assert.equal(audit.blank,false,`${lesson.stableId} rendered blank or title-only content.`);
  assert.equal(audit.wrongCourse,false,`${lesson.stableId} rendered another course.`);
  assert.equal(audit.undefinedText,false,`${lesson.stableId} rendered undefined text.`);
  assert.equal(audit.horizontalOverflow,false,`${lesson.stableId} overflowed in the audited viewport.`);
}

assert.match(app,/data-course-id="\$\{stableId\}" href="\$\{url\}"/,'Course actions must expose real href targets.');
assert.doesNotMatch(app,/data-course-id="\$\{stableId\}"[^>]+onclick="goLesson/,'Catalog anchors must not be overridden by goLesson.');
assert.match(worker,/caches\.match\(cachedNavigationAsset\)/,'Offline navigation must resolve the requested cached page.');
assert.match(worker,/NAVIGATION_ASSETS\.has\(file\)/,'Known lesson files must be distinguished from the app shell.');

for(const marker of [
  "states = ['start','continue','review']","languages = ['zh','en','vi','ja']","widths = [390,768,1440]",
  'action.click()','await wait(1100)','lessonWin.location.reload()','history.back()','guest:true','offlineNavigation:false'
])assert.ok(harness.includes(marker),`Real navigation harness missing ${marker}`);

assert.equal(evidence.browser,'Google Chrome');
assert.equal(evidence.totalCases,21);
assert.equal(evidence.offlineFallbackPassed,true);
assert.deepEqual(new Set(evidence.states),new Set(['start','continue','review']));
assert.deepEqual(new Set(evidence.languages),new Set(['zh','en','vi','ja']));
assert.deepEqual(new Set(evidence.widths),new Set([390,768,1440]));
assert.equal(evidence.guestPassed,true);
assert.equal(evidence.refreshPassed,true);
assert.equal(evidence.backPassed,true);
assert.equal(evidence.progressPreserved,true);
assert.equal(evidence.xpPreserved,true);
assert.equal(evidence.undefinedCount,0);
assert.equal(evidence.notFoundCount,0);
assert.equal(evidence.homeRedirectCount,0);
assert.equal(contentEvidence.browser,'Google Chrome');
assert.equal(contentEvidence.matrix.length,14);
assert.equal(contentEvidence.screenshots.length,42);

console.log('Validated historical 21-case navigation regression evidence plus current real-Chrome content and route identity evidence for Lessons 0–13.');
