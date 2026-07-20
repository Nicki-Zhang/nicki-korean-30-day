import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

export function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    result[key] = next && !next.startsWith('--') ? argv[++index] : true;
  }
  return result;
}

export async function loadBatch(root, batchId) {
  const config = JSON.parse(await readFile(resolve(root, 'audio-batches.json'), 'utf8'));
  if (config.schemaVersion !== 1) throw new Error('Unsupported audio batch schema.');
  const batch = config.batches?.[batchId];
  if (!batch) throw new Error(`Unknown batchId: ${batchId}`);
  return batch;
}

export function validateBatchShape(batchId, batch, expectedCount) {
  if (!Number.isInteger(expectedCount) || expectedCount < 1) throw new Error('expectedCount must be a positive integer.');
  if (batch.model !== 'gpt-4o-mini-tts' || batch.voice !== 'marin' || batch.format !== 'mp3') {
    throw new Error(`${batchId} must use the product-owner-approved Batch 1 model, voice and MP3 format.`);
  }
  if (batch.speed !== null) throw new Error(`${batchId} speed must remain omitted (provider default), matching Batch 1.`);
  if (batch.instructions !== 'Speak only the supplied Korean speechText exactly once in natural standard Seoul Korean. Do not spell, translate, explain, or add sounds.') {
    throw new Error(`${batchId} instructions do not match the frozen Batch 1 request.`);
  }
  if (batch.expectedSampleRate !== 24000 || batch.expectedChannels !== 1) {
    throw new Error(`${batchId} expected output must remain 24000 Hz mono.`);
  }
  if (batch.expectedCount !== expectedCount || batch.items?.length !== expectedCount) {
    throw new Error(`${batchId} allowlist count must equal expectedCount (${expectedCount}).`);
  }
  const ids = new Set();
  const files = new Set();
  for (const item of batch.items) {
    for (const field of ['id', 'speechText', 'audioType', 'outputFile']) {
      if (typeof item[field] !== 'string' || !item[field].trim()) throw new Error(`${batchId} item is missing ${field}.`);
    }
    if (ids.has(item.id) || files.has(item.outputFile)) throw new Error(`${batchId} contains a duplicate id or outputFile.`);
    if (!/\.mp3$/i.test(item.outputFile)) throw new Error(`${batchId}/${item.id} must target an MP3 file.`);
    ids.add(item.id);
    files.add(item.outputFile);
  }
}

export async function validateFormalManifest(root, batch, options = {}) {
  const manifest = JSON.parse(await readFile(resolve(root, 'audio', batch.lessonId, 'manifest.json'), 'utf8'));
  for (const allowed of batch.items) {
    const item = manifest.items?.find(candidate => candidate.id === allowed.id);
    if (!item || item.speechText !== allowed.speechText || item.audioType !== allowed.audioType || item.file !== allowed.outputFile) {
      throw new Error(`Formal manifest does not exactly match allowlisted item ${allowed.id}.`);
    }
    const readyForGeneration = item.reviewStatus === 'pending' && item.assetStatus === 'missing';
    const alreadyPublished = item.reviewStatus === 'approved' && item.assetStatus === 'available';
    if (!readyForGeneration && !(options.allowPublished && alreadyPublished)) {
      throw new Error(`Formal manifest ${allowed.id} must remain pending/missing before review.`);
    }
  }
  return manifest;
}

export async function writeJson(path, value) {
  await mkdir(resolve(path, '..'), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
}
