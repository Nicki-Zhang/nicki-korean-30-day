import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const index = fs.readFileSync('index.html', 'utf8');
const app = fs.readFileSync('nikigo-app.html', 'utf8');
const lessonEngine = fs.readFileSync('lesson-engine.js', 'utf8');
const manifest = JSON.parse(fs.readFileSync('manifest.webmanifest', 'utf8'));
const worker = fs.readFileSync('sw.js', 'utf8');

assert.match(index, /new URL\('nikigo-app\.html', location\.href\)/);
assert.match(index, /target\.search = location\.search/);
assert.match(index, /target\.hash = location\.hash/);
assert.equal(manifest.start_url, './nikigo-app.html');
assert.match(worker, /\.\/nikigo-app\.html/);

for (const requiredId of [
  'avatar',
  'profile',
  'profileAvatar',
  'profileCompleted',
  'profileStreak',
  'settingName',
  'avatarChoices',
  'settingLanguage',
  'settingDaily',
  'settingAudioRate',
  'autoplaySwitch',
  'courseNotice'
]) {
  assert.match(app, new RegExp(`id=["']${requiredId}["']`), `Missing #${requiredId}`);
}

assert.match(app, /onclick="goHome\(\)"/);
assert.doesNotMatch(app, /class="logo"[^>]+onclick="go\('welcome'\)"/);
assert.match(app, /function saveProfileName\(\)/);
assert.match(app, /function updateAvatar\(value\)/);
assert.match(app, /Coming soon/);
assert.match(app, /lesson\.status==='available'/);
assert.match(app, /lesson\.releaseStatus==='preview'&&lesson\.audioStatus==='pending'/);
assert.match(app, /<a class="courseAction \$\{done\?'secondary':'primary'\}" data-course-id="\$\{stableId\}" href="\$\{url\}">/);
assert.match(app, /lesson\.file\?`\$\{lesson\.file\}\?lang=\$\{encodeURIComponent\(currentLanguage\)\}`/);
assert.match(app, /closest\('a\[data-course-id\]'\)/);
assert.match(app, /serviceWorker\.register\('sw\.js',\{updateViaCache:'none'\}\)/);
assert.match(app, /registration=>registration\.update\(\)/);
assert.match(app, /recommendedPrerequisites/);
assert.match(app, /recommendedFirst/);
assert.match(app, /!lesson\|\|lesson\.status!==/);
assert.match(app, /NIKIGO_COURSE_UNLOCKED/);
assert.doesNotMatch(app, /lesson\.prerequisites\.every/);
assert.doesNotMatch(app, /releaseStatus==='preview'\|\|!lesson\.file/);
assert.doesNotMatch(app, />\ud83d\udd12<\/button>/);
assert.match(lessonEngine, /data-action="next-lesson"/);
assert.match(lessonEngine, /global\.NIKIGO_COURSES/);
assert.match(lessonEngine, /function goNextLesson\(\)/);
assert.match(worker, /\.\/lesson-00\.html/);
assert.match(worker, /\.\/lesson-00\.js/);
assert.match(worker, /\.\/hangul-sound-data\.js/);
assert.match(worker, /\.\/lesson-consonant-contrast\.html/);
assert.match(worker, /\.\/lesson-consonant-contrast\.js/);
assert.match(worker, /\.\/lesson-consonant-contrast\.css/);
assert.match(worker, /\.\/lesson-05\.html/);
assert.match(worker, /\.\/lesson-05\.js/);
assert.match(worker, /\.\/lesson-05\.css/);
assert.match(worker, /\.\/player-privacy\.css/);

const ids = [...app.matchAll(/\sid=["']([^"']+)["']/g)].map(match => match[1]);
const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);
assert.deepEqual(duplicateIds, [], `Duplicate ids: ${duplicateIds.join(', ')}`);

const inlineScripts = [...app.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)]
  .map(match => match[1])
  .filter(Boolean);
assert.ok(inlineScripts.length, 'Missing inline app script.');
new vm.Script(inlineScripts.at(-1), { filename: 'nikigo-app.html:inline-script' });

console.log('Validated unified app entry and profile center.');
