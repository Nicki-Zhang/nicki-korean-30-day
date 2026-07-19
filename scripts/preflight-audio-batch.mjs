import { mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBatch, parseArgs, validateBatchShape, validateFormalManifest, writeJson } from './audio-batch-lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const batchId = String(args['batch-id'] || '');
const mode = String(args.mode || '');
const expectedCount = Number(args['expected-count']);
const stagingDir = resolve(root, String(args['staging-dir'] || `staging/${batchId}`));
const confirmation = String(args.confirmation || '');
await mkdir(stagingDir, { recursive: true });

const report = { batchId, mode, expectedCount, status:'failed', checkedAt:new Date().toISOString(), errors:[] };
try {
  if (!['dry-run', 'generate'].includes(mode)) throw new Error('mode must be dry-run or generate.');
  if (mode === 'generate' && confirmation !== `GENERATE ${batchId} ${expectedCount}`) {
    throw new Error(`Generate confirmation must exactly match: GENERATE ${batchId} ${expectedCount}`);
  }
  const batch = await loadBatch(root, batchId);
  validateBatchShape(batchId, batch, expectedCount);
  await validateFormalManifest(root, batch);
  report.status = 'passed';
  report.allowedItems = batch.items.map(({ id, speechText, audioType, outputFile }) => ({ id, speechText, audioType, outputFile }));
} catch (error) {
  report.errors.push(error.message);
  await writeJson(resolve(stagingDir, 'preflight-report.json'), report);
  throw error;
}
await writeJson(resolve(stagingDir, 'preflight-report.json'), report);
console.log(`Preflight passed for ${batchId}: ${expectedCount} allowlisted item(s), mode=${mode}.`);
