import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

await import(new URL('../audio-catalog.js', import.meta.url));
const catalog = globalThis.NikigoAudio?.lessons;
assert.ok(catalog, 'Missing NikigoAudio catalog.');
const allowMissingOpenAi = process.argv.includes('--allow-missing-openai');

const requiredFields = ['id', 'displayText', 'speechText', 'expectedPronunciation', 'type', 'pronunciationType', 'screen', 'teachingGoal', 'file', 'voiceSource', 'reviewStatus'];
const allowedReviewStatuses = new Set(['pending', 'approved', 'rejected']);
const isolatedJamo = /^[ㄱ-ㅎㅏ-ㅣ]$/u;
const pureLatin = /^[\sA-Za-z.,'-]+$/;
const errors = [];
const allActiveFiles = new Set();
const activeSources = new Map();

function error(message) {
  errors.push(message);
}

function loadLessonConfig(file) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .filter(Boolean);
  let config;
  const soundContext = {};
  soundContext.window = soundContext;
  vm.runInNewContext(fs.readFileSync('hangul-sound-data.js', 'utf8'), soundContext, { filename:'hangul-sound-data.js' });
  const context = {
    window: { NikigoAudio: globalThis.NikigoAudio, NikigoHangulSoundData:soundContext.NikigoHangulSoundData },
    NikigoLesson: { mount: value => { config = value; } }
  };
  vm.runInNewContext(scripts.at(-1), context, { filename: file });
  if (!config) throw new Error(`${file} did not mount a lesson config.`);
  return { config, html };
}

function playableValues(config) {
  const values = new Set();
  for (const item of config.vowels || []) values.add(Array.isArray(item) ? item[2] : item.vowelCarrierSyllable);
  for (const item of config.consonants || []) {
    if (Array.isArray(item)) values.add(item[2]);
    else {
      if (item.letterNameAudio) values.add(item.letterName);
      if (item.demoAudio) values.add(item.demoSyllable);
    }
  }
  for (const item of config.words || []) values.add(item[2]);
  for (const value of Object.values(config.syllables || {})) values.add(value);
  for (const question of [...(config.practice || []), ...(config.quiz || [])]) if (question.audio) values.add(question.audio);
  if (config.phrase?.audio) values.add(config.phrase.audio);
  for (const value of Array.isArray(config.repeat?.audio) ? config.repeat.audio : [config.repeat?.audio]) if (value) values.add(value);
  return values;
}

for (const [lessonId, lesson] of Object.entries(catalog)) {
  const manifestPath = `audio/${lessonId}/manifest.json`;
  const lessonPath = `${lessonId}.html`;
  if (!fs.existsSync(manifestPath)) {
    error(`Missing ${manifestPath}.`);
    continue;
  }
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.schemaVersion !== 2) error(`${manifestPath} must use schemaVersion 2.`);
  const ids = new Set();
  const files = new Set();
  const speechTexts = new Set();
  for (const item of manifest.items || []) {
    for (const field of requiredFields) {
      if (typeof item[field] !== 'string' || !item[field].trim()) error(`${lessonId}/${item.id || 'unknown'} is missing ${field}.`);
    }
    if (ids.has(item.id)) error(`${lessonId} has duplicate id ${item.id}.`);
    if (files.has(item.file)) error(`${lessonId} has duplicate file ${item.file}.`);
    if (speechTexts.has(item.speechText)) error(`${lessonId} has duplicate speechText ${item.speechText}.`);
    ids.add(item.id);
    files.add(item.file);
    speechTexts.add(item.speechText);
    if (!allowedReviewStatuses.has(item.reviewStatus)) error(`${lessonId}/${item.id} has invalid reviewStatus ${item.reviewStatus}.`);
    if (item.type === 'batchim-example' && pureLatin.test(item.speechText)) error(`${lessonId}/${item.id} uses Latin TTS input for batchim.`);
    if (item.type === 'batchim-example' && isolatedJamo.test(item.speechText)) error(`${lessonId}/${item.id} uses isolated Hangul jamo for batchim.`);
    if (item.type === 'sound-change' && !String(item.pronunciationRule || '').trim()) error(`${lessonId}/${item.id} is missing pronunciationRule.`);
    if (/[,，。.!?]/u.test(item.speechText)) error(`${lessonId}/${item.id} speechText contains batching punctuation.`);
    if (item.voiceSource.startsWith('human-')) {
      for (const right of ['voiceTalent', 'consentRecord', 'commercialUseRecord']) {
        if (!item.rights?.[right]) error(`${lessonId}/${item.id} human recording is missing ${right}.`);
      }
    }
    const filePath = `audio/${lessonId}/${item.file}`;
    allActiveFiles.add(filePath);
    activeSources.set(filePath, item.voiceSource);
    if (!fs.existsSync(filePath) && !(allowMissingOpenAi && item.voiceSource === 'openai-gpt-4o-mini-tts')) error(`Missing active audio file ${filePath}.`);
    else if (fs.existsSync(filePath) && fs.statSync(filePath).size < 100) error(`Audio file is empty or invalid: ${filePath}.`);
  }

  const catalogJson = JSON.stringify(lesson.items);
  const manifestJson = JSON.stringify(manifest.items);
  if (catalogJson !== manifestJson) error(`${manifestPath} is not synchronized with audio-catalog.js.`);

  try {
    const { config, html } = loadLessonConfig(lessonPath);
    if (!html.includes('audio-catalog.js')) error(`${lessonPath} does not load audio-catalog.js.`);
    const values = playableValues(config);
    for (const value of values) {
      const mapped = config.audioFiles?.[value];
      if (!mapped) {
        error(`${lessonPath} can play “${value}” but has no audio mapping.`);
        continue;
      }
      if (!allActiveFiles.has(mapped)) error(`${lessonPath} maps “${value}” to a file not declared by its manifest: ${mapped}.`);
      if (!fs.existsSync(mapped) && !(allowMissingOpenAi && activeSources.get(mapped) === 'openai-gpt-4o-mini-tts')) error(`${lessonPath} maps “${value}” to missing file ${mapped}.`);
      if (config.pronunciationText?.[value] !== value) error(`${lessonPath} fallback speech for “${value}” is not exact Korean speechText.`);
    }
    for (const value of Object.keys(config.audioFiles || {})) {
      if (!values.has(value)) error(`${lessonPath} has an unused active audio mapping for “${value}”.`);
    }
  } catch (caught) {
    error(caught.message);
  }
}

for (const forbidden of ['audio/lesson-01/ga-na.mp3', 'audio/lesson-02/words.mp3']) {
  for (const file of ['lesson-01.html', 'lesson-02.html', 'audio-catalog.js']) {
    if (fs.readFileSync(file, 'utf8').includes(forbidden)) error(`${file} still references deprecated audio ${forbidden}.`);
  }
}

const engine = fs.readFileSync('lesson-engine.js', 'utf8');
if (!/currentUtterance\.lang = 'ko-KR'/.test(engine)) error('System speech fallback is not locked to ko-KR.');
if (!/currentUtterance\.pitch = 1/.test(engine)) error('System speech fallback does not preserve pitch.');
for (const property of ['preservesPitch', 'mozPreservesPitch', 'webkitPreservesPitch']) {
  if (!engine.includes(`currentAudio.${property} = true`)) error(`Static audio playback is missing ${property}.`);
}
if (!engine.includes("data-action=\"repeat-audio\"")) error('Repeat screens do not use controlled sequential playback.');

const auditPage = fs.readFileSync('audio-audit.html', 'utf8');
if (!auditPage.includes('<script src="audio-catalog.js"></script>')) error('audio-audit.html does not use the canonical catalog.');
if (!auditPage.includes('仅供开发审核 · 不在正式导航中')) error('audio-audit.html is missing its development-only disclosure.');
if (!auditPage.includes('preservesPitch=true')) error('audio-audit.html does not preserve pitch during speed changes.');
const auditScripts = [...auditPage.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].map(match => match[1]).filter(Boolean);
try {
  new vm.Script(auditScripts.at(-1), { filename: 'audio-audit.html:inline-script' });
} catch (caught) {
  error(`audio-audit.html script is invalid: ${caught.message}`);
}
if (fs.readFileSync('nikigo-app.html', 'utf8').includes('audio-audit.html')) error('Development audio audit page appears in the formal app shell.');

const worker = fs.readFileSync('sw.js', 'utf8');
if (!/CACHE\s*=\s*'nikigo-v(?:6-audio-audit-1|7-k0-roadmap-1|8-sound-objects-1|9-letter-audio-types-1|10-consonant-contrast-1|11-player-privacy-1|12-quality-layout-1|13-lesson-05)'/.test(worker)) error('Service worker cache was not versioned for the audio repair.');
if (!worker.includes("'./audio-catalog.js'")) error('Service worker does not cache the canonical audio catalog.');

const audioWorkflow = fs.readFileSync('.github/workflows/generate-lesson-audio.yml', 'utf8');
const jobsMarker = '\njobs:\n';
const validateMarker = '\n  validate:\n';
const generateMarker = '\n  generate:\n';
const jobsIndex = audioWorkflow.indexOf(jobsMarker);
const validateIndex = audioWorkflow.indexOf(validateMarker);
const generateIndex = audioWorkflow.indexOf(generateMarker);
if (!(jobsIndex >= 0 && validateIndex > jobsIndex && generateIndex > validateIndex)) {
  error('Audio workflow must contain separate validate and generate jobs.');
} else {
  const workflowHeader = audioWorkflow.slice(0, jobsIndex);
  const validateJob = audioWorkflow.slice(validateIndex, generateIndex);
  const generateJob = audioWorkflow.slice(generateIndex);
  if (!/permissions:\s*\n\s+contents: read/.test(workflowHeader)) error('Audio workflow default permissions must be contents: read.');
  if (!/if: github\.event_name == 'push'/.test(validateJob)) error('Audio validation job must be restricted to push events.');
  if (!/permissions:\s*\n\s+contents: read/.test(validateJob)) error('Push validation job must use contents: read.');
  if (!/timeout-minutes: 15/.test(validateJob)) error('Push validation job must have a 15-minute timeout.');
  if (!/node scripts\/validate-audio\.mjs --allow-missing-openai/.test(validateJob)) error('Push validation job must validate the audio schema.');
  if (!/run: npm test/.test(validateJob)) error('Push validation job must run the complete test suite.');
  for (const forbidden of ['generate-lesson-audio.mjs', 'OPENAI_API_KEY', 'secrets.OPENAI_API_KEY', 'git push', 'contents: write']) {
    if (validateJob.includes(forbidden)) error(`Push validation job must not contain ${forbidden}.`);
  }
  if (!/if: github\.event_name == 'workflow_dispatch'/.test(generateJob)) error('Paid audio generation job must be restricted to workflow_dispatch.');
  if (!/permissions:\s*\n\s+contents: read/.test(generateJob)) error('Manual generation job must use contents: read.');
  if (!/timeout-minutes: 15/.test(generateJob)) error('Manual generation job must have a 15-minute timeout.');
  if (!/concurrency:\s*\n\s+group: paid-audio-\$\{\{ inputs\.lesson \}\}\s*\n\s+cancel-in-progress: false/.test(generateJob)) error('Manual generation concurrency must be scoped to the selected lesson.');
  if (!/SELECTED_LESSON: \$\{\{ inputs\.lesson \}\}/.test(generateJob) || !/if \[ -z "\$SELECTED_LESSON" \]/.test(generateJob) || !/exit 1/.test(generateJob)) error('Manual generation must fail when the lesson selection is missing.');
  if (!/OPENAI_API_KEY: \$\{\{ secrets\.OPENAI_API_KEY \}\}/.test(generateJob)) error('Manual generation step must receive OPENAI_API_KEY from GitHub Secrets.');
  if ((audioWorkflow.match(/OPENAI_API_KEY/g) || []).length !== 2) error('OPENAI_API_KEY must appear only as the generation-step environment key and secret reference.');
  if (!/node scripts\/generate-lesson-audio\.mjs "audio\/\$\{\{ inputs\.lesson \}\}\/manifest\.json"/.test(generateJob)) error('Manual generation job must generate only the selected lesson manifest.');
  if (!/run: npm test/.test(generateJob)) error('Manual generation job must test generated files before artifact upload.');
  if (!/uses: actions\/upload-artifact@v4/.test(generateJob)) error('Manual generation job must upload an artifact for review.');
  if (!/name: nikigo-audio-\$\{\{ inputs\.lesson \}\}-\$\{\{ github\.run_number \}\}/.test(generateJob)) error('Audio artifact name must include the lesson and run number.');
  if (!/path: audio\/\$\{\{ inputs\.lesson \}\}\//.test(generateJob)) error('Audio artifact must contain only the selected lesson directory.');
  if (!/retention-days: 7/.test(generateJob) || !/if-no-files-found: error/.test(generateJob)) error('Audio artifact must expire after seven days and fail when empty.');
  if (/echo[^\n]*(OPENAI_API_KEY|secrets\.)|printenv|env\s*\|/.test(generateJob)) error('Manual generation job must not print secrets or the environment.');
  if (/speechSynthesis|generate-system-audio|fallback/i.test(generateJob)) error('Manual generation job must not create fallback audio or text substitutes.');
  for (const lesson of ['lesson-01', 'lesson-02', 'lesson-03', 'lesson-04', 'k0-consonant-contrast']) {
    if (!workflowHeader.includes(`- ${lesson}`)) error(`Audio workflow is missing manual lesson option ${lesson}.`);
  }
  for (const forbidden of ['contents: write', 'git config', 'git add', 'git commit', 'git push']) {
    if (audioWorkflow.includes(forbidden)) error(`Audio workflow must not contain ${forbidden}.`);
  }
}

if (errors.length) {
  console.error(errors.map(value => `- ${value}`).join('\n'));
  process.exitCode = 1;
} else {
  const itemCount = Object.values(catalog).reduce((sum, lesson) => sum + lesson.items.length, 0);
  console.log(`Validated ${itemCount} active audio items across ${Object.keys(catalog).length} lessons and isolated paid generation to workflow_dispatch.`);
}
