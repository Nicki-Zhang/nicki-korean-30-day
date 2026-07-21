import assert from 'node:assert/strict';
import fs from 'node:fs';

const pilotLessons=['lesson-04','lesson-11','lesson-13'];
const html=Object.fromEntries(pilotLessons.map(id=>[id,fs.readFileSync(`${id}.html`,'utf8')]));
const home=fs.readFileSync('nikigo-app.html','utf8');
const homeCss=fs.readFileSync('course-experience-home-pilot.css','utf8');
const homeBridge=fs.readFileSync('course-experience-home-pilot.js','utf8');
const css=fs.readFileSync('course-experience-pilot.css','utf8');
const bridge=fs.readFileSync('course-experience-pilot.js','utf8');
const sprint=fs.readFileSync('lesson-sprint-engine.js','utf8');
const contrast=fs.readFileSync('lesson-consonant-contrast.js','utf8');

for(const id of pilotLessons){
  assert.match(html[id],new RegExp(`data-pilot-course="${id}"`));
  assert.match(html[id],/course-experience-pilot\.css/);
  assert.match(html[id],/course-experience-pilot\.js/);
  assert.match(html[id],/assets\/nikigo-mark\.svg/);
}
for(const id of ['lesson-08','lesson-09','lesson-10','lesson-12']){
  assert.doesNotMatch(fs.readFileSync(`${id}.html`,'utf8'),/course-experience-pilot/,
    `${id} must remain outside the approved Lesson 4/11/13 pilot scope`);
}

assert.match(home,/course-experience-home-pilot\.css/);
assert.match(home,/course-experience-home-pilot\.js/);
for(const item of ['今日韩国生活任务','继续第11课','K1生活交流旅程','下一站预告','自由进入全部课程','streakDays','xp'])assert.ok(homeBridge.includes(item),`Seoul Night home is missing ${item}`);
for(const marker of ['--night-deep','--night-electric','--night-ink','--night-success','--night-error','--stage-story','--stage-listening','--stage-expression','--stage-build','--stage-reaction','--stage-summary','--space-1','--button-height','--motion-fast','--motion-complete','--mobile-width','env(safe-area-inset-bottom)','prefers-reduced-motion']){
  assert.ok(`${homeCss}\n${css}`.includes(marker),`Shared design variables are missing ${marker}`);
}
assert.match(homeBridge,/experience.*pilot/);
assert.match(homeBridge,/lesson-11\.html\?lang=/);
assert.match(homeBridge,/assets\/seoul-night-hangang\.jpg/);
for(const icon of ['compass.svg','arrow-right.svg','unlock.svg'])assert.match(homeBridge,new RegExp(`assets/icons/${icon.replace('.','\\.')}`));
assert.match(css,/width:min\(100%,390px\)/,'The first phase must stay in the approved 390px shell.');
assert.match(css,/\.pilotLineMode \.bubble\{display:none\}/);
assert.match(css,/\.pilotMasterySummary/);
assert.match(css,/min-height:44px/);
assert.match(css,/:focus-visible/);
assert.match(bridge,/pilot-next-line/);
assert.match(bridge,/pilotDialoguePending/);
assert.match(bridge,/masteryItems/);
assert.match(bridge,/MutationObserver/);
for(const marker of ['pilotSceneVisual','pilotSceneBody','pilotRoutePreview','pilotDialogueCast','pilotSpeaker','person-circle.svg','person-fill.svg'])assert.ok(`${css}\n${bridge}`.includes(marker),`First-round visual state is missing ${marker}`);
assert.match(bridge,/Start mission/);
assert.match(bridge,/About 8 min/);
assert.match(bridge,/Meet · Talk · Express/);

assert.match(sprint,/const isExperiencePilot = \['lesson-11','lesson-13'\]\.includes\(config\.id\)/);
assert.match(sprint,/!isExperiencePilot&&option\.id===step\.correct/,
  'Pilot choice questions must not reveal the correct option after a wrong answer.');
assert.match(sprint,/answer\.correct\|\|!isExperiencePilot/,
  'Pilot explanations must remain hidden after a wrong answer.');
assert.match(contrast,/const reveal=answer\?\.correct\?/);
assert.match(contrast,/footer\(\{nextDisabled:!answered\}\)/);
assert.doesNotMatch(contrast,/answerWas.*optionLabel\(question\.correct\)/);

for(const source of [homeCss,homeBridge,css,bridge,sprint,contrast,...Object.values(html)]){
  assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance/);
}

const evidence=JSON.parse(fs.readFileSync('quality-fix/course-experience-redesign-pilot/FIRST_ROUND_RESULT.json','utf8'));
assert.equal(evidence.direction,'Seoul Night Journey + Focused Learning');
assert.equal(evidence.sourceNavigation,'journey-home-visible-link');
assert.deepEqual(evidence.viewports,[390]);
assert.equal(evidence.flowLesson,'lesson-11');
assert.equal(evidence.flowStates,3);
for(const value of Object.values(evidence.interaction))assert.equal(value,true);
assert.deepEqual(evidence.consoleIssues,[]);
assert.deepEqual(evidence.networkFailures,[]);
assert.deepEqual(evidence.fourLanguageUndefined,[]);
assert.equal(evidence.audioApiRequests,0);
assert.equal(evidence.audioCost,0);
for(const file of evidence.screenshots)assert.ok(fs.statSync(`quality-fix/course-experience-redesign-pilot/${file}`).size>10_000,`${file} is not valid visual evidence`);
for(const file of evidence.comparisons)assert.ok(fs.statSync(`quality-fix/course-experience-redesign-pilot/${file}`).size>20_000,`${file} is not valid comparison evidence`);
assert.match(fs.readFileSync('quality-fix/course-experience-redesign-pilot/design-qa.md','utf8'),/Final result: passed/);

console.log('Validated the first-round 390px Seoul Night Journey → Focused Learning home, Lesson 11 opening, and dialogue.');
