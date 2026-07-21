import assert from 'node:assert/strict';
import fs from 'node:fs';

const pilotLessons=['lesson-04','lesson-09','lesson-13'];
const html=Object.fromEntries(pilotLessons.map(id=>[id,fs.readFileSync(`${id}.html`,'utf8')]));
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

for(const id of ['lesson-08','lesson-10','lesson-11','lesson-12']){
  assert.doesNotMatch(fs.readFileSync(`${id}.html`,'utf8'),/course-experience-pilot/,
    `${id} must remain outside the first pilot scope`);
}

for(const marker of [
  '--pilot-brand','--pilot-canvas','--pilot-success','--pilot-error',
  'env(safe-area-inset-bottom)','prefers-reduced-motion','min-height:44px',
  '.feedback.good b::before','.feedback.try b::before',':focus-visible'
]) assert.ok(css.includes(marker),`Pilot CSS missing ${marker}`);

assert.match(css,/\.foot \.primary\{justify-self:end;min-width:150px/,
  'The bottom action area must retain one visually primary action.');
assert.match(bridge,/MutationObserver/);
assert.match(bridge,/\['choice','scenario','listening','match','build','quiz','retry'\]/);

assert.match(sprint,/const isExperiencePilot = \['lesson-09','lesson-13'\]\.includes\(config\.id\)/);
assert.match(sprint,/!isExperiencePilot&&option\.id===step\.correct/,
  'Pilot choice questions must not reveal the correct option after a wrong answer.');
assert.match(sprint,/answer\.correct\|\|!isExperiencePilot/,
  'Pilot explanation must remain hidden after a wrong answer.');
assert.match(contrast,/const reveal=answer\?\.correct\?/,
  'Lesson 4 answer detail must be hidden after a wrong answer.');
assert.match(contrast,/footer\(\{nextDisabled:!answered\}\)/,
  'Lesson 4 listening checks must require an answer before continuing.');
assert.doesNotMatch(contrast,/answerWas.*optionLabel\(question\.correct\)/,
  'Lesson 4 must not print the correct answer after a wrong response.');

for(const source of [css,bridge,sprint,contrast,...Object.values(html)]){
  assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance/);
}

const evidence=JSON.parse(fs.readFileSync('quality-fix/course-experience-redesign-pilot/ACCEPTANCE_RESULT.json','utf8'));
assert.equal(evidence.browser,'Google Chrome');
assert.equal(evidence.base,'dedbb10d47b978a746db468b2cbad1ba6d38f1bf');
assert.equal(evidence.sourceNavigation,'visible-course-home-click');
assert.deepEqual(evidence.viewports,[390,768,1440]);
assert.equal(evidence.results.length,12);
for(const result of evidence.results){
  assert.ok(pilotLessons.includes(result.lessonId));
  assert.ok(['zh','en','vi','ja'].includes(result.language));
  for(const key of ['refreshResume','browserBackAtHome','browserBackResume','relearn','wrongFeedbackNoAnswerLeak'])assert.equal(result[key],true,`${result.lessonId}/${result.language} failed ${key}`);
  assert.equal(result.openingOverflow,false);
  assert.equal(result.firstXP,50);assert.equal(result.repeatXP,50);
}
assert.deepEqual(evidence.consoleIssues,[]);assert.deepEqual(evidence.networkFailures,[]);assert.deepEqual(evidence.fourLanguageUndefined,[]);
assert.equal(evidence.audioApiRequests,0);assert.equal(evidence.audioCost,0);
for(const id of pilotLessons)for(const state of ['01-opening','02-core','03-practice-wrong','03-practice-correct','04-complete']){
  const file=`quality-fix/course-experience-redesign-pilot/screenshots/${id}-${state}-390.png`;
  assert.ok(fs.statSync(file).size>10_000,`${file} is not valid visual evidence`);
}
assert.match(fs.readFileSync('quality-fix/course-experience-redesign-pilot/design-qa.md','utf8'),/Final result: passed/);

console.log('Validated the Lesson 4/9/13 experience pilot scope, shared tokens, accessibility states, responsive safety, exact-audio privacy, and no-answer-leak feedback.');
