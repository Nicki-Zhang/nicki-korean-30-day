import fs from 'node:fs';
import { copyFile,mkdir,readFile } from 'node:fs/promises';
import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs,loadBatch,validateBatchShape,validateFormalManifest,writeJson } from './audio-batch-lib.mjs';
import { fileEvidence,validateMediaFile } from './media-validation-lib.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=parseArgs(process.argv.slice(2));
const sourceRunId=String(args['source-run-id']||'');
const sourceArtifactName=String(args['source-artifact-name']||'');
const batchId=String(args['batch-id']||'');
const expectedCount=Number(args['expected-count']);
const sourceDir=resolve(String(args['source-dir']||''));
const outputDir=resolve(String(args['output-dir']||`staging/${batchId}-validation`));
const ffmpegPath=resolve(String(args.ffmpeg||''));
const ffprobePath=resolve(String(args.ffprobe||''));
const pairs=String(args['expected-sha256']||'').split(',').filter(Boolean).map(value=>value.split('='));
const shaMap=Object.fromEntries(pairs);
const report={mode:'validation-only',sourceRunId,sourceArtifactName,batchId,expectedCount,generatedCount:0,apiRequestCount:0,status:'failed',validatedAt:new Date().toISOString(),items:[],errors:[]};
await mkdir(resolve(outputDir,'files'),{recursive:true});
try {
  if(!args['source-dir']||!args.ffmpeg||!args.ffprobe) throw new Error('--source-dir, --ffmpeg and --ffprobe are required.');
  if(!/^\d+$/u.test(sourceRunId)) throw new Error('sourceRunId must contain decimal digits only.');
  if(!/^[a-z0-9-]+$/u.test(batchId)) throw new Error('batchId contains unsafe characters.');
  if(!new RegExp(`^nikigo-${batchId}-run-${sourceRunId}-[a-f0-9]{7,40}$`,'u').test(sourceArtifactName)) throw new Error('sourceArtifactName does not match sourceRunId and batchId.');
  const batch=await loadBatch(root,batchId);
  validateBatchShape(batchId,batch,expectedCount);
  await validateFormalManifest(root,batch);
  const sourceGeneration=JSON.parse(await readFile(resolve(sourceDir,'generation-report.json'),'utf8'));
  if(String(sourceGeneration.workflowRunId)!==sourceRunId||sourceGeneration.batchId!==batchId) throw new Error('Downloaded Artifact generation report does not match the requested source run and batch.');
  if(sourceGeneration.generatedCount!==expectedCount||sourceGeneration.items?.length!==expectedCount) throw new Error('Downloaded Artifact generated count does not match expectedCount.');
  for(const allowed of batch.items) {
    const generated=sourceGeneration.items.find(item=>item.id===allowed.id);
    if(!generated||generated.speechText!==allowed.speechText||generated.stagedFile!==`files/${allowed.outputFile}`) throw new Error(`Downloaded Artifact item ${allowed.id} does not match the Batch allowlist.`);
  }
  await mkdir(resolve(outputDir,'source-reports'),{recursive:true});
  for(const reportName of ['preflight-report.json','generation-report.json','artifact-manifest.json']) {
    if(fs.existsSync(resolve(sourceDir,reportName))) await copyFile(resolve(sourceDir,reportName),resolve(outputDir,'source-reports',reportName));
  }
  const expectedFiles=batch.items.map(item=>item.outputFile).sort();
  const actualFiles=fs.readdirSync(resolve(sourceDir,'files'),{withFileTypes:true}).filter(entry=>entry.isFile()).map(entry=>entry.name).sort();
  if(JSON.stringify(actualFiles)!==JSON.stringify(expectedFiles)) throw new Error(`Artifact audio files must be exactly ${expectedFiles.join(', ')}; found ${actualFiles.join(', ')||'none'}.`);
  for(const item of batch.items) {
    const sourceFile=resolve(sourceDir,'files',item.outputFile);
    const evidence=await fileEvidence(sourceFile);
    if(evidence.sha256!==shaMap[item.outputFile]) throw new Error(`${item.outputFile} SHA-256 mismatch: ${evidence.sha256}`);
    const expected=item.expectedTechnical||{};
    const validation=await validateMediaFile(sourceFile,{ffmpegPath,ffprobePath,minDuration:expected.minDuration||0.1,maxDuration:expected.maxDuration||10});
    validation.id=item.id;validation.speechText=item.speechText;validation.outputFile=`files/${item.outputFile}`;validation.reviewStatus='underReview';
    report.items.push(validation);
    if(validation.status!=='passed') report.errors.push(...validation.errors.map(error=>`${item.outputFile}: ${error}`));
    if(expected.sampleRate&&validation.technical.sampleRate!==expected.sampleRate) report.errors.push(`${item.outputFile}: expected sampleRate ${expected.sampleRate}, found ${validation.technical.sampleRate}`);
    if(expected.channels&&validation.technical.channels!==expected.channels) report.errors.push(`${item.outputFile}: expected channels ${expected.channels}, found ${validation.technical.channels}`);
    if(expected.duration&&Math.abs(validation.technical.duration-expected.duration)>(expected.durationTolerance||0.03)) report.errors.push(`${item.outputFile}: expected duration about ${expected.duration}, found ${validation.technical.duration}`);
    await copyFile(sourceFile,resolve(outputDir,'files',item.outputFile));
  }
  report.generatedCount=report.items.length;
  if(report.items.length!==expectedCount) report.errors.push(`Validated count ${report.items.length} does not equal expectedCount ${expectedCount}.`);
  if(report.errors.length) throw new Error(report.errors.join(' | '));
  report.status='passed';
} catch(error) {
  if(!report.errors.includes(error.message)) report.errors.push(error.message);
  await writeJson(resolve(outputDir,'validation-report.json'),report);
  throw error;
}
await writeJson(resolve(outputDir,'validation-report.json'),report);
const checklist={batchId,status:'awaiting-native-review',items:report.items.map(item=>({file:item.outputFile,speechText:item.speechText,sha256:item.sha256,duration:item.technical.duration,femaleVoice:null,onlyTargetSyllable:null,extraSound:null,startClipped:null,endClipped:null,noiseOrLongSilence:null,naturalPronunciation:null,nativeReviewer:null,reviewDate:null,reviewConclusion:null}))};
await writeJson(resolve(outputDir,'human-listening-checklist.json'),checklist);
console.log(`Validation-only passed: ${report.items.length}/${expectedCount} existing files, 0 API requests, full ffmpeg decode complete.`);
