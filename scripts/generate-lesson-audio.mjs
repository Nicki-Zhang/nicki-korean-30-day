import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifestPath = resolve(root, process.argv[2] || 'audio/lesson-01/manifest.json');
const apiKeyId = process.env.NCP_CLOVA_API_KEY_ID;
const apiKey = process.env.NCP_CLOVA_API_KEY;

if (!apiKeyId || !apiKey) {
  throw new Error('Missing NCP_CLOVA_API_KEY_ID or NCP_CLOVA_API_KEY. Store them as GitHub Actions secrets.');
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
const outputDir = dirname(manifestPath);
await mkdir(outputDir, { recursive: true });

for (const item of manifest.items) {
  const body = new URLSearchParams({
    speaker: manifest.speaker,
    volume: String(manifest.volume ?? 0),
    speed: String(manifest.speed ?? 0),
    pitch: String(manifest.pitch ?? 0),
    format: manifest.format || 'mp3',
    text: item.text
  });

  const response = await fetch('https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts', {
    method: 'POST',
    headers: {
      'X-NCP-APIGW-API-KEY-ID': apiKeyId,
      'X-NCP-APIGW-API-KEY': apiKey,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`CLOVA Voice failed for ${item.id}: HTTP ${response.status} ${detail}`);
  }

  const outputPath = resolve(outputDir, item.file);
  await writeFile(outputPath, Buffer.from(await response.arrayBuffer()));
  console.log(`Generated ${item.id} -> ${item.file}`);
}
