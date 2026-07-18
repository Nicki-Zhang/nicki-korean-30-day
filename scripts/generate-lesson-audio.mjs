import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(root, process.argv[2] || 'audio/lesson-01/manifest.json');
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error('Missing OPENAI_API_KEY. Store it as a GitHub Actions repository secret.');
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const outputDir = dirname(manifestPath);
await mkdir(outputDir, { recursive: true });

for (const item of manifest.items) {
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

  const outputPath = resolve(outputDir, item.file);
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${item.id} -> ${item.file}`);
}
