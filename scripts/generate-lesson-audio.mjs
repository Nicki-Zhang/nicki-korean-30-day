import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(root, process.argv[2] || 'audio/lesson-01/manifest.json');
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY. Store it as a GitHub Actions repository secret.');
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const outputDir = dirname(manifestPath);
const cachePath = resolve(outputDir, '.generation-cache.json');
await mkdir(outputDir, { recursive: true });

let cache = {};
try {
  cache = JSON.parse(await readFile(cachePath, 'utf8'));
} catch {
  cache = {};
}

for (const item of manifest.items) {
  const outputPath = resolve(outputDir, item.file);
  const fingerprint = createHash('sha256').update(JSON.stringify({
    model: manifest.model || 'gpt-4o-mini-tts',
    voice: manifest.voice || 'marin',
    format: manifest.format || 'mp3',
    instructions: item.instructions || manifest.instructions,
    text: item.text
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
      model: manifest.model || 'gpt-4o-mini-tts',
      voice: manifest.voice || 'marin',
      input: item.text,
      instructions: item.instructions || manifest.instructions,
      response_format: manifest.format || 'mp3'
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
