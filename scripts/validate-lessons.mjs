import fs from 'node:fs';
import vm from 'node:vm';

await import(new URL('../audio-catalog.js', import.meta.url));

const languages = ['zh', 'en', 'vi', 'ja'];
const errors = [];
const reviewWindow = {};
reviewWindow.window = reviewWindow;
vm.runInNewContext(fs.readFileSync('review-catalog.js', 'utf8'), reviewWindow, { filename: 'review-catalog.js' });
const reviewCatalog = reviewWindow.NIKIGO_REVIEW_CATALOG;

function loadInlineConfig(file) {
  const html = fs.readFileSync(file, 'utf8');
  const scripts = [...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)]
    .map(match => match[1])
    .filter(Boolean);
  let config;
  const soundContext = {};
  soundContext.window = soundContext;
  vm.runInNewContext(fs.readFileSync('hangul-sound-data.js', 'utf8'), soundContext, { filename: 'hangul-sound-data.js' });
  const lessonWindow = { NikigoAudio: globalThis.NikigoAudio, NikigoHangulSoundData:soundContext.NikigoHangulSoundData };
  vm.runInNewContext(scripts.at(-1), {
    window: lessonWindow,
    NikigoLesson: { mount: value => { config = value; } }
  }, { filename: file });
  if (!config) throw new Error(`${file} did not mount a lesson config.`);
  return { config, html };
}

const catalogSource = fs.readFileSync('course-catalog.js', 'utf8');
let catalog;
vm.runInNewContext(catalogSource, {
  window: {
    set NIKIGO_COURSES(value) { catalog = value; },
    set NIKIGO_NEXT_LESSON(value) {}
  }
}, { filename: 'course-catalog.js' });

if (!Array.isArray(catalog) || !catalog.length) errors.push('Course catalog is empty.');

const ids = new Set();
for (const [index, item] of (catalog || []).entries()) {
  const stableId = item.stableId || item.id;
  if (ids.has(stableId)) errors.push(`Duplicate course stable id: ${stableId}`);
  ids.add(stableId);
  if (item.displayOrder !== index) errors.push(`${stableId} has unexpected display order ${item.displayOrder}.`);
  if (item.displayNumber !== index) errors.push(`${stableId} has unexpected display number ${item.displayNumber}.`);
  if (!['available', 'comingSoon'].includes(item.status)) errors.push(`${stableId} has invalid status ${item.status}.`);
  if (!['development', 'preview', 'released', 'comingSoon'].includes(item.releaseStatus)) errors.push(`${stableId} has invalid releaseStatus ${item.releaseStatus}.`);
  if (!['available', 'unavailable'].includes(item.accessStatus)) errors.push(`${stableId} has invalid accessStatus ${item.accessStatus}.`);
  if (!['pending', 'generated', 'underReview', 'approved', 'rejected'].includes(item.audioStatus)) errors.push(`${stableId} has invalid audioStatus ${item.audioStatus}.`);
  if ((item.prerequisites || []).length) errors.push(`${stableId} retains a hard prerequisite.`);
  if (item.requiresCompletion !== false) errors.push(`${stableId} must not require prior completion.`);
  for (const prerequisite of item.recommendedPrerequisites || []) {
    if (!ids.has(prerequisite)) errors.push(`${stableId} references a missing or later prerequisite: ${prerequisite}`);
  }
  for (const language of languages) {
    if (!item.title?.[language]) errors.push(`${stableId} is missing ${language} title.`);
    if (!item.parts?.[language]) errors.push(`${stableId} is missing ${language} parts.`);
  }

  if (item.status === 'comingSoon') {
    if (item.file) errors.push(`${stableId} is coming soon but links to ${item.file}.`);
    continue;
  }

  const file = item.file;
  if (!file) {
    errors.push(`${stableId} is available but has no file.`);
    continue;
  }
  if (!fs.existsSync(file)) {
    errors.push(`Missing lesson file: ${file}`);
    continue;
  }

  if (stableId === 'lesson-00') {
    if (!file.includes('lesson-00.html')) errors.push('lesson-00 has the wrong file mapping.');
    continue;
  }

  if (stableId === 'lesson-04' || stableId === 'lesson-05' || stableId === 'lesson-06' || stableId === 'lesson-07') {
    const html = fs.readFileSync(file, 'utf8');
    const customBase = stableId === 'lesson-04' ? 'lesson-consonant-contrast' : stableId === 'lesson-07' ? 'lesson-07' : stableId;
    if (!html.includes(`${customBase}.js`)) errors.push(`${file} does not load its course engine.`);
    if (!html.includes(`${customBase}.css`)) errors.push(`${file} does not load its course styles.`);
    if (!html.includes('course-catalog.js')) errors.push(`${file} does not load course-catalog.js.`);
    if (!html.includes('lesson-player.css')) errors.push(`${file} does not use the shared visual system.`);
    continue;
  }

  if (['lesson-08','lesson-09','lesson-10','lesson-11','lesson-12','lesson-13'].includes(stableId)) {
    const html = fs.readFileSync(file, 'utf8');
    const isClassicFocus = stableId === 'lesson-11';
    const isClassicSprint = stableId === 'lesson-08' || stableId === 'lesson-12' || stableId === 'lesson-13';
    const expectedEngine = isClassicFocus ? 'lesson-11-classic-focus.js' : 'lesson-sprint-engine.js';
    const expectedStyles = isClassicFocus
      ? 'lesson-11-classic-focus.css'
      : isClassicSprint
        ? `${stableId}-classic-focus.css`
        : 'lesson-sprint.css';
    if (!html.includes(`${stableId}.js`)) errors.push(`${file} does not load its lesson configuration.`);
    if (!html.includes(expectedEngine)) errors.push(`${file} does not load its expected lesson engine.`);
    if (!html.includes(expectedStyles)) errors.push(`${file} does not load its expected lesson styles.`);
    if (isClassicSprint && !html.includes(`${stableId}-classic-focus.js`)) errors.push(`${file} does not load its Sprint-to-Classic adapter.`);
    if (!html.includes('audio-catalog.js')) errors.push(`${file} does not load the strict audio catalog.`);
    continue;
  }

  try {
    const { config, html } = loadInlineConfig(file);
    if (config.id !== stableId) errors.push(`${file} mounts ${config.id} instead of ${stableId}.`);
    if (!html.includes('course-catalog.js')) errors.push(`${file} does not load course-catalog.js.`);
    if (!html.includes('lesson-engine.js')) errors.push(`${file} does not use lesson-engine.js.`);
    if (!html.includes('lesson-player.css')) errors.push(`${file} does not use lesson-player.css.`);
    const englishKeys = new Set(Object.keys(config.copy.en || {}));
    for (const language of languages) {
      const localized = config.copy[language] || {};
      for (const key of englishKeys) if (!localized[key]) errors.push(`${file}: ${language} is missing “${key}”.`);
    }
    for (const question of [...config.practice, ...config.quiz]) {
      for (const language of languages) {
        if (!config.copy[language]?.[question.prompt]) errors.push(`${file}: ${language} is missing prompt “${question.prompt}”.`);
      }
      if (!Array.isArray(question.options) || question.answer < 0 || question.answer >= question.options.length) {
        errors.push(`${file}: invalid answer for “${question.prompt}”.`);
      }
    }
    const manifestFile = `audio/${stableId}/manifest.json`;
    if (fs.existsSync(manifestFile)) {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      const manifestPaths = new Set((manifest.items || []).filter(audio => globalThis.NikigoAudio.canPlayAudio(audio.speechText,audio,audio.audioType)).map(audio => `audio/${stableId}/${audio.file}`));
      const mappedPaths = new Set(Object.values(config.audioFiles || {}));
      for (const path of mappedPaths) {
        if (!manifestPaths.has(path)) errors.push(`${file}: audio mapping is missing from ${manifestFile}: ${path}`);
      }
      for (const path of manifestPaths) {
        if (!mappedPaths.has(path)) errors.push(`${manifestFile}: generated audio is not mapped by ${file}: ${path}`);
      }
    }
    const generatedReviewIds = [
      ...(config.baseReviewIds || []),
      ...(config.repeat?.reviewId ? [config.repeat.reviewId] : []),
      ...config.quiz.map((_, question) => `${config.reviewPrefix || config.id.replace('-', '')}:quiz:${question}`)
    ];
    for (const reviewId of generatedReviewIds) {
      if (!reviewCatalog.get(reviewId)) errors.push(`${file}: review catalog is missing “${reviewId}”.`);
    }
  } catch (error) {
    errors.push(error.message);
  }
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Validated ${catalog.filter(item => item.status === 'available').length} available lessons and ${catalog.filter(item => item.status === 'comingSoon').length} coming-soon roadmap entries across ${languages.length} languages.`);
}
