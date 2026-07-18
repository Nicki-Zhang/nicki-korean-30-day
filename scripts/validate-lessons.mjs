import fs from 'node:fs';
import vm from 'node:vm';

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
  vm.runInNewContext(scripts.at(-1), {
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
  if (ids.has(item.id)) errors.push(`Duplicate course id: ${item.id}`);
  ids.add(item.id);
  if (item.order !== index + 1) errors.push(`${item.id} has unexpected order ${item.order}.`);
  for (const prerequisite of item.prerequisites || []) {
    if (!ids.has(prerequisite)) errors.push(`${item.id} references a missing or later prerequisite: ${prerequisite}`);
  }
  for (const language of languages) {
    if (!item.title?.[language]) errors.push(`${item.id} is missing ${language} title.`);
    if (!item.parts?.[language]) errors.push(`${item.id} is missing ${language} parts.`);
  }

  const file = `${item.id}.html`;
  if (!fs.existsSync(file)) {
    errors.push(`Missing lesson file: ${file}`);
    continue;
  }

  try {
    const { config, html } = loadInlineConfig(file);
    if (config.id !== item.id) errors.push(`${file} mounts ${config.id} instead of ${item.id}.`);
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
    const manifestFile = `audio/${item.id}/manifest.json`;
    if (fs.existsSync(manifestFile)) {
      const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf8'));
      const manifestPaths = new Set((manifest.items || []).map(audio => `audio/${item.id}/${audio.file}`));
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
  console.log(`Validated ${catalog.length} Nikigo lessons across ${languages.length} languages.`);
}
