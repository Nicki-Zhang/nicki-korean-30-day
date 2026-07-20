import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs,loadBatch,validateBatchShape,validateFormalManifest,writeJson } from './audio-batch-lib.mjs';

const args=parseArgs(process.argv.slice(2));
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const sourceRunId=String(args['source-run-id']||'');
const sourceArtifactName=String(args['source-artifact-name']||'');
const batchId=String(args['batch-id']||'');
const expectedCount=Number(args['expected-count']);
const expectedSha256=String(args['expected-sha256']||'');
const reportPath=resolve(String(args.report||`staging/${batchId}-validation/validation-request.json`));
const report={mode:'validation-only',sourceRunId,sourceArtifactName,batchId,expectedCount,apiRequestCount:0,status:'failed',errors:[]};
try {
  if(!/^\d+$/u.test(sourceRunId)) throw new Error('sourceRunId must contain decimal digits only.');
  if(!/^[a-z0-9-]+$/u.test(batchId)) throw new Error('batchId contains unsafe characters.');
  if(!new RegExp(`^nikigo-${batchId}-run-${sourceRunId}-[a-f0-9]{7,40}$`,'u').test(sourceArtifactName)) throw new Error('sourceArtifactName does not match the selected batch and source run.');
  const batch=await loadBatch(root,batchId);
  validateBatchShape(batchId,batch,expectedCount);
  await validateFormalManifest(root,batch);
  const pairs=expectedSha256.split(',').filter(Boolean).map(value=>value.split('='));
  if(pairs.length!==expectedCount||pairs.some(pair=>pair.length!==2||!/^[a-f0-9]{64}$/u.test(pair[1]))) throw new Error('expectedSha256 must contain one valid filename=sha256 pair per item.');
  const shaMap=Object.fromEntries(pairs);
  if(Object.keys(shaMap).length!==pairs.length) throw new Error('expectedSha256 contains duplicate filenames.');
  const expectedFiles=batch.items.map(item=>item.outputFile).sort();
  if(JSON.stringify(Object.keys(shaMap).sort())!==JSON.stringify(expectedFiles)) throw new Error('expectedSha256 filenames do not exactly match the batch allowlist.');
  report.expectedSha256=shaMap;
  report.allowedItems=batch.items.map(({id,speechText,audioType,outputFile})=>({id,speechText,audioType,outputFile}));
  report.status='passed';
} catch(error) {
  report.errors.push(error.message);
  await writeJson(reportPath,report);
  throw error;
}
await writeJson(reportPath,report);
console.log(`Validation-only preflight passed for ${batchId}: source run ${sourceRunId}, ${expectedCount} files, 0 API requests.`);
