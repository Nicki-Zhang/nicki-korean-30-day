import fs from 'node:fs';
import { readFile, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadBatch, parseArgs, validateBatchShape, writeJson } from './audio-batch-lib.mjs';
import { validateMediaFile } from './media-validation-lib.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = parseArgs(process.argv.slice(2));
const batchId = String(args['batch-id'] || '');
const mode = String(args.mode || '');
const expectedCount = Number(args['expected-count']);
const stagingDir = resolve(root, String(args['staging-dir'] || `staging/${batchId}`));
const ffmpegPath = String(args.ffmpeg || 'ffmpeg');
const ffprobePath = String(args.ffprobe || 'ffprobe');
const batch = await loadBatch(root, batchId);
validateBatchShape(batchId, batch, expectedCount);

let generation = { items:[], generatedCount:0, apiRequestCount:0, generatedAt:null, workflowRunId:'unknown', commit:'unknown' };
const errors = [];
try { generation = JSON.parse(await readFile(resolve(stagingDir, 'generation-report.json'), 'utf8')); }
catch { errors.push('generation-report.json is missing or invalid.'); }

const artifact = {
  workflowRunId:generation.workflowRunId, commit:generation.commit, batchId,
  generationMode:mode, expectedCount, generatedCount:generation.generatedCount || 0,
  apiRequestCount:generation.apiRequestCount || 0, generatedAt:generation.generatedAt,
  generationStatus:generation.status || 'missing',
  model:batch.model, voice:batch.voice, responseFormat:batch.format, speed:batch.speed,
  instructions:batch.instructions, expectedSampleRate:batch.expectedSampleRate, expectedChannels:batch.expectedChannels,
  automaticRetry:false, reviewStatus:'underReview',
  technicalValidation:{ status:'pending', errors }, items:[]
};

const expectedStagedFiles=(generation.items||[]).map(item=>String(item.stagedFile||'').replace(/^files\//u,''));
try {
  const actualFiles=fs.readdirSync(resolve(stagingDir,'files'),{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
  if(JSON.stringify(actualFiles)!==JSON.stringify([...expectedStagedFiles].sort())) errors.push(`Staging files differ from generation report: expected ${expectedStagedFiles.join(', ')||'none'}, found ${actualFiles.join(', ')||'none'}.`);
} catch(error) { errors.push(`Staging files directory cannot be read: ${error.message}`); }

for (const item of generation.items || []) {
  const path = resolve(stagingDir, item.stagedFile || 'missing');
  try {
    const data = await readFile(path);
    const info = await stat(path);
    if (!info.size) throw new Error('file is empty');
    let codec='fixture',duration=null,sampleRate=null,channels=null,status='fixture-only';
    let mediaValidation=null;
    if (mode === 'generate') {
      mediaValidation=await validateMediaFile(path,{ffmpegPath,ffprobePath});
      codec=mediaValidation.technical.codec;duration=mediaValidation.technical.duration;sampleRate=mediaValidation.technical.sampleRate;channels=mediaValidation.technical.channels;status=mediaValidation.status;
      if(mediaValidation.status!=='passed') errors.push(...mediaValidation.errors.map(error=>`${item.id}: ${error}`));
    }
    artifact.items.push({
      id:item.id,speechText:item.speechText,audioType:item.audioType,outputFile:item.stagedFile,
      fileSize:info.size,sha256:createHash('sha256').update(data).digest('hex'),codec,duration,sampleRate,channels,
      generationStatus:item.generationStatus,reviewStatus:'underReview',technicalValidation:status,
      mediaCommands:mediaValidation?.commands||null,mediaErrors:mediaValidation?.errors||[]
    });
  } catch (error) {
    errors.push(`${item.id || 'unknown'}: ${error.message}`);
  }
}

if (artifact.items.length !== expectedCount) errors.push(`Validated file count ${artifact.items.length} does not equal expectedCount ${expectedCount}.`);
if (generation.generatedCount !== expectedCount) errors.push(`Generated count ${generation.generatedCount} does not equal expectedCount ${expectedCount}.`);
if (generation.apiRequestCount > expectedCount) errors.push('API request count exceeded expectedCount.');
artifact.technicalValidation.status=errors.length?'failed':'passed';
artifact.technicalValidation.errors=errors;
await writeJson(resolve(stagingDir,'artifact-manifest.json'),artifact);
console.log(`Staging validation ${artifact.technicalValidation.status}: ${artifact.items.length}/${expectedCount} file(s), ${artifact.apiRequestCount} API request(s).`);
if(errors.length) throw new Error(errors.join(' | '));
