import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const app=fs.readFileSync('nikigo-app.html','utf8');
const worker=fs.readFileSync('sw.js','utf8');
const harness=fs.readFileSync('tests/course-navigation-regression.html','utf8');
const evidence=JSON.parse(fs.readFileSync('quality-fix/course-navigation/NAVIGATION_RESULT.json','utf8'));
const context={window:{}};context.window.window=context.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js','utf8'),context,{filename:'course-catalog.js'});
const developed=context.window.NIKIGO_COURSES.filter(lesson=>lesson.displayNumber>=0&&lesson.displayNumber<=6);

assert.equal(developed.length,7);
for(const lesson of developed){
  assert.equal(lesson.status,'available',`${lesson.stableId} must stay directly accessible.`);
  assert.ok(lesson.file&&fs.existsSync(lesson.file),`${lesson.stableId} target is missing.`);
  assert.ok(evidence.lessons.some(item=>item.lesson===lesson.stableId&&item.file===lesson.file&&item.passed===true),`${lesson.stableId} lacks real-click evidence.`);
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

console.log('Validated real Chrome evidence for 21 catalog clicks: Lessons 0–6 × start/continue/review, four languages, 390/768/1440px, exact offline fallback, refresh, browser back, and state preservation.');
