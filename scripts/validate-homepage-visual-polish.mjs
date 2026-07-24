import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../nikigo-app.html', import.meta.url), 'utf8');
const css = readFileSync(new URL('../assets/nikigo-friendly-learning-path.css', import.meta.url), 'utf8');
const serviceWorker = readFileSync(new URL('../sw.js', import.meta.url), 'utf8');

for (const marker of [
  'class="languageChevron"',
  'class="navIconSprite"',
  'class="navIcon"',
  'class="stageContext"',
  'class="moduleContext"',
  'id="dashContextLesson"',
  'data-i18n="currentLearningPosition"',
  'class="locatorNode"',
  'id="locatorStageItem" data-state="context"',
  'id="locatorModuleItem" data-state="context"',
  'id="locatorLessonItem" data-state="current" aria-current="step"',
]) {
  assert.ok(html.includes(marker), `Missing Homepage Visual Polish marker: ${marker}`);
}

for (const language of ['zh', 'en', 'vi', 'ja']) {
  assert.match(
    html,
    new RegExp(`${language}:\\{skipContent:[^}]+interfaceLanguage:[^}]+primaryNavigation:[^}]+currentLearningPosition:[^}]+stageLevel:[^}]+moduleLevel:[^}]+lessonLevel:[^}]+stateContext:[^}]+stateComplete:[^}]+stateCurrent:[^}]+setupNodeLabel:[^}]+primarySetupAction:`),
    `Missing four-language Homepage Visual Polish copy for ${language}`,
  );
}

assert.match(css, /\.friendly-shell \.languagePicker \{[\s\S]*min-width:142px;[\s\S]*border:1px solid var\(--friendly-border\)/);
assert.match(css, /\.friendly-shell \.learningHero \{[\s\S]*min-height:310px;[\s\S]*grid-template-columns:minmax\(0,1\.62fr\) minmax\(286px,\.88fr\)/);
assert.match(css, /background:linear-gradient\(132deg,#5638d4 0%,#6d4aff 58%,#8d74ff 100%\)/);
assert.match(css, /\.friendly-shell \.dashboardWelcome h1 \{[\s\S]*font-size:clamp\(3rem,4\.2vw,3\.75rem\)/);
assert.match(css, /\.friendly-shell \.missionKorean \{[\s\S]*font-size:clamp\(2\.875rem,4\.5vw,3\.625rem\)!important/);
assert.match(css, /\.friendly-shell \.learningHeroMain \{[\s\S]*padding:30px 40px 32px/);
assert.match(css, /\.friendly-shell \.learningLocator \{[\s\S]*padding:30px 32px/);
assert.match(css, /--locator-axis-x:10px/);
assert.match(css, /\.friendly-shell \.learningLocator ol::before/);
assert.match(css, /\.friendly-shell \.learningLocator li\[data-state="complete"\] \.locatorNode::after/);
assert.match(css, /\.friendly-shell \.learningLocator li\[data-state="context"\] \.locatorNode/);
assert.match(css, /\.friendly-shell \.journeyStep:not\(:last-child\)::after/);
assert.match(css, /\.friendly-shell \.learningHeroMain \.primary \{[\s\S]*background:#fff;[\s\S]*color:var\(--brand-active\)/);
assert.match(css, /@media \(max-width:600px\)[\s\S]*font-size:clamp\(2\.125rem,9\.5vw,2\.5rem\)/);
assert.match(css, /@media \(prefers-reduced-motion:reduce\)/);

assert.doesNotMatch(html, /nikigo-homepage-visual-polish-v1\/prototype|prototype\.js/);
assert.doesNotMatch(html, /<span aria-hidden="true">[⌂▤↻◔●]<\/span>/);
assert.match(html, /const setupRequired=action\?\.kind==='required-setup'/);
assert.match(html, /stageComplete=!setupRequired/);
assert.match(html, /chapterComplete=!setupRequired/);
assert.match(serviceWorker, /nikigo-v\d+-self-review-gate-homepage-visual-polish-v1/);

console.log('Validated Homepage Visual Polish V1 formal shell: approved layout, four-language context, one primary learning action, aligned path geometry, responsive density, reduced motion, and no prototype fixture loading.');
