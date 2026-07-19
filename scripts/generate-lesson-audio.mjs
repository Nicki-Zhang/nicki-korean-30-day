import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(root, process.argv[2] || 'audio/lesson-01/manifest.json');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const outputDir = dirname(manifestPath);
const cachePath = resolve(outputDir, '.generation-cache.json');
await mkdir(outputDir, { recursive: true });

const required = ['id', 'displayText', 'speechText', 'expectedPronunciation', 'type', 'file', 'reviewStatus'];
const isolatedJamo = /^[ㄱ-ㅎㅏ-ㅣ]$/u;
const pureLatin = /^[\sA-Za-z.,'-]+$/;
const ids = new Set();
const files = new Set();
for (const item of manifest.items || []) {
  for (const field of required) {
    if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`${manifest.lesson}/${item.id || 'unknown'} is missing ${field}.`);
  }
  if (ids.has(item.id)) throw new Error(`${manifest.lesson} has duplicate audio id: ${item.id}`);
  if (files.has(item.file)) throw new Error(`${manifest.lesson} has duplicate audio file: ${item.file}`);
  ids.add(item.id);
  files.add(item.file);
  if (item.type === 'batchim-example' && (pureLatin.test(item.speechText) || isolatedJamo.test(item.speechText))) {
    throw new Error(`${manifest.lesson}/${item.id} must use a complete Korean syllable or word for batchim.`);
  }
  if (item.type === 'sound-change' && !String(item.pronunciationRule || '').trim()) {
    throw new Error(`${manifest.lesson}/${item.id} is a sound change without pronunciationRule.`);
  }
  if (item.reviewStatus !== 'pending') {
    throw new Error(`${manifest.lesson}/${item.id} must remain pending when generated.`);
  }
}

const openAiItems = (manifest.items || []).filter(item => item.voiceSource === 'openai-gpt-4o-mini-tts');
const apiKey = process.env.OPENAI_API_KEY;
if (openAiItems.length && !apiKey) {
  throw new Error('Missing OPENAI_API_KEY. Store it as a GitHub Actions repository secret.');
}

let cache = {};
try {
  cache = JSON.parse(await readFile(cachePath, 'utf8'));
} catch {
  cache = {};
}

for (const item of manifest.items) {
  const outputPath = resolve(outputDir, item.file);
  if (item.voiceSource !== 'openai-gpt-4o-mini-tts') {
    try {
      await access(outputPath);
      console.log(`Verified external audio ${item.id} -> ${item.file}`);
      continue;
    } catch {
      throw new Error(`Missing externally generated audio ${manifest.lesson}/${item.file}.`);
    }
  }
  const defaults = manifest.generationDefaults || {};
  const fingerprint = createHash('sha256').update(JSON.stringify({
    model: defaults.model || 'gpt-4o-mini-tts',
    voice: defaults.voice || 'marin',
    format: defaults.format || 'mp3',
    instructions: item.instructions || defaults.instructions,
    speechText: item.speechText,
    expectedPronunciation: item.expectedPronunciation
  })).digest('hex');

  let outputExists = true;
  try {
    await access(outputPath);
  } catch {
    outputExists = false;
  }

  if (outputExists && cache[item.file] === fingerprint) {
    console.log(`Unchanged ${item.id} -> ${item.file}`);
    continue;
  }

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: defaults.model || 'gpt-4o-mini-tts',
      voice: defaults.voice || 'marin',
      input: item.speechText,
      instructions: item.instructions || defaults.instructions,
      response_format: defaults.format || 'mp3'
    })
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`OpenAI speech generation failed for ${item.id}: HTTP ${response.status} ${detail}`);
  }

  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  cache[item.file] = fingerprint;
  console.log(`Generated ${item.id} -> ${item.file}`);
}

await writeFile(cachePath, `${JSON.stringify(cache, null, 2)}\n`);
