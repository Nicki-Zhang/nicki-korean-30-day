import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBatch, parseArgs, validateBatchShape, validateFormalManifest, writeJson } from './audio-batch-lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const batchId = String(args['batch-id'] || '');
const mode = String(args.mode || '');
const expectedCount = Number(args['expected-count']);
const stagingDir = resolve(root, String(args['staging-dir'] || `staging/${batchId}`));
const filesDir = resolve(stagingDir, 'files');
const workflowRunId = String(args['workflow-run-id'] || 'local');
const commit = String(args.commit || 'local');
await mkdir(filesDir, { recursive: true });

const batch = await loadBatch(root, batchId);
validateBatchShape(batchId, batch, expectedCount);
await validateFormalManifest(root, batch);

const report = {
  workflowRunId, commit, batchId, generationMode:mode, expectedCount,
  generatedCount:0, apiRequestCount:0, generatedAt:new Date().toISOString(),
  model:batch.model, voice:batch.voice, status:'running', items:[], errors:[]
};

try {
  if (mode === 'dry-run') {
    for (const item of batch.items) {
      const fixtureName = `${item.outputFile}.fixture`;
      await writeFile(resolve(filesDir, fixtureName), `NIKIGO_AUDIO_DRY_RUN_FIXTURE\n${item.id}\n`);
      report.items.push({ ...item, stagedFile:`files/${fixtureName}`, generationStatus:'fixture' });
      report.generatedCount += 1;
    }
  } else if (mode === 'generate') {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) throw new Error('Missing OPENAI_API_KEY for explicitly confirmed generate mode.');
    for (const item of batch.items) {
      if (report.apiRequestCount >= expectedCount) throw new Error('API request limit reached before the next item.');
      const remainingAllowed = expectedCount - report.apiRequestCount;
      if (remainingAllowed < 1) throw new Error('No allowlisted API requests remain.');
      report.apiRequestCount += 1;
      console.log(`API request ${report.apiRequestCount}/${expectedCount}: ${item.id}`);
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method:'POST',
        headers:{ Authorization:`Bearer ${apiKey}`, 'Content-Type':'application/json' },
        body:JSON.stringify({
          model:batch.model, voice:batch.voice, input:item.speechText,
          instructions:'Speak only the supplied Korean speechText exactly once in natural standard Seoul Korean. Do not spell, translate, explain, or add sounds.',
          response_format:batch.format
        })
      });
      if (!response.ok) throw new Error(`Audio API request failed for ${item.id}: HTTP ${response.status}`);
      await writeFile(resolve(filesDir, item.outputFile), Buffer.from(await response.arrayBuffer()));
      report.items.push({ ...item, stagedFile:`files/${item.outputFile}`, generationStatus:'generated' });
      report.generatedCount += 1;
    }
  } else {
    throw new Error('mode must be dry-run or generate.');
  }
  if (report.generatedCount !== expectedCount || report.apiRequestCount > expectedCount) {
    throw new Error(`Generated count ${report.generatedCount} does not equal expectedCount ${expectedCount}.`);
  }
  report.status = 'completed';
} catch (error) {
  report.status = 'failed';
  report.errors.push(error.message);
  await writeJson(resolve(stagingDir, 'generation-report.json'), report);
  throw error;
}

await writeJson(resolve(stagingDir, 'generation-report.json'), report);
console.log(`${mode} completed: ${report.generatedCount} staged item(s), ${report.apiRequestCount} API request(s).`);
