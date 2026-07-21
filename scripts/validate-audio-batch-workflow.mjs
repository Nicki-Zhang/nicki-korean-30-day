import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const workflow=fs.readFileSync(path.join(root,'.github/workflows/generate-lesson-audio.yml'),'utf8');
const config=JSON.parse(fs.readFileSync(path.join(root,'audio-batches.json'),'utf8'));
const batch1=config.batches['audio-batch-01'];
const batch2a=config.batches['audio-batch-02a-gaka-r1'];
const original2=config.planningOnly['audio-batch-02-original'];
const batch2b=config.batches['audio-batch-02b'];
const frozenInstructions='Speak only the supplied Korean speechText exactly once in natural standard Seoul Korean. Do not spell, translate, explain, or add sounds.';
const controlledInstructions='Speak only the supplied Korean syllable exactly once in natural standard Seoul Korean for a controlled pronunciation comparison. Keep recording level, perceived loudness, vowel duration, speaking effort, microphone distance, and pacing closely matched across items. For 가, use a natural lenis ㄱ onset with weak airflow and no exaggerated pre-aspiration. For 카, use a clearly aspirated ㅋ onset with audible airflow, without increasing loudness or lengthening the vowel. Do not add leading noise, trailing sounds, spelling, translation, explanation, or emphasis.';

assert.deepEqual(Object.keys(config.batches),['audio-batch-01','audio-batch-02a-gaka-r1','audio-batch-02b'],'Only reviewed/prepared strict allowlists may be executable.');
assert.equal(original2.expectedCount,16);assert.equal(original2.items.length,16);
assert.equal(batch2b.expectedCount,13);assert.equal(batch2b.items.length,13);assert.equal(batch2b.maxApiRequests,13);assert.equal(batch2b.automaticRetry,false);
assert.equal(batch1.expectedCount,2);assert.deepEqual(batch1.items.map(x=>[x.speechText,x.outputFile]),[['요','yo.mp3'],['유','yu.mp3']]);
assert.equal(batch2a.expectedCount,2);assert.deepEqual(batch2a.items.map(x=>[x.id,x.speechText,x.audioType,x.outputFile]),[
  ['ga','가','initial-example','ga.mp3'],['ka','카','initial-example','ka.mp3']
]);
for(const batch of [batch1,batch2a]){
  assert.equal(batch.model,'gpt-4o-mini-tts');assert.equal(batch.voice,'marin');assert.equal(batch.format,'mp3');
  assert.equal(batch.speed,null);assert.equal(batch.expectedSampleRate,24000);assert.equal(batch.expectedChannels,1);
}
assert.equal(batch1.instructions,frozenInstructions);assert.equal(batch1.instructionProfile,'batch-1-exact');
assert.equal(batch2a.instructions,controlledInstructions);assert.equal(batch2a.instructionProfile,'controlled-onset-contrast-r1');
assert.equal(batch2a.items.some(x=>x.speechText==='까'||x.outputFile==='kka.mp3'),false);

assert.doesNotMatch(workflow,/^\s{2}(push|pull_request|schedule):/m);
assert.match(workflow,/^\s{2}workflow_dispatch:/m);
assert.match(workflow,/mode:[\s\S]*dry-run[\s\S]*generate[\s\S]*validation-only/);
assert.match(workflow,/batchId:[\s\S]*audio-batch-01[\s\S]*audio-batch-02a-gaka-r1/);
assert.match(workflow,/audio-batch-02b/);
assert.doesNotMatch(workflow,/^\s{10}- audio-batch-02a\s*$/m);
assert.match(workflow,/concurrency:[\s\S]*group:.*inputs\.batchId/);
assert.doesNotMatch(workflow,/git push|contents:\s*write/);
assert.match(workflow,/fetch-depth:\s*0/);
assert.match(workflow,/git fetch --no-tags origin main:refs\/remotes\/origin\/main/);
assert.match(workflow,/validate-repository-safety\.mjs --base-ref origin\/main --baseline-only/);
assert.match(workflow,/NIKIGO_BASE_REF:\s*origin\/main/);
assert.match(workflow,/sourceRunId:[\s\S]*sourceArtifactName:[\s\S]*expectedSha256:/);
assert.match(workflow,/stage-audio:[\s\S]*if: inputs\.mode != 'validation-only'/);
assert.match(workflow,/validate-existing-audio:[\s\S]*if: inputs\.mode == 'validation-only'/);
assert.match(workflow,/Install fixed FFmpeg 6\.1 toolchain/);
assert.match(workflow,/command -v "\$NIKIGO_FFMPEG"[\s\S]*command -v "\$NIKIGO_FFPROBE"/);
assert.match(workflow,/actions\/download-artifact@v4[\s\S]*run-id: \$\{\{ inputs\.sourceRunId \}\}/);
assert.match(workflow,/Upload staged audio and reports[\s\S]*if:\s*always\(\)/);
assert.match(workflow,/retention-days:\s*7/);
assert.ok(workflow.indexOf('Run complete tests before any generation')<workflow.indexOf('Generate paid audio into staging'));
const dryStep=workflow.match(/- name: Create no-cost dry-run staging fixtures[\s\S]*?(?=\n\s+- name:)/)?.[0]||'';
assert.doesNotMatch(dryStep,/OPENAI_API_KEY|generate paid|api\.openai/i);
const paidStep=workflow.match(/- name: Generate paid audio into staging[\s\S]*?(?=\n\s+- name:)/)?.[0]||'';
assert.match(paidStep,/OPENAI_API_KEY/);assert.match(paidStep,/inputs\.mode == 'generate'/);
const validationJob=workflow.split('\n  validate-existing-audio:')[1]||'';
assert.doesNotMatch(validationJob,/OPENAI_API_KEY|generate-lesson-audio\.mjs|api\.openai\.com/);
assert.match(validationJob,/apiRequestCount|API requests: 0/);
assert.doesNotMatch(workflow,/retry|max-attempts/);

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-audio-2a-dry-run-'));
const denyNetwork=path.join(temp,'deny-network.cjs');
fs.writeFileSync(denyNetwork,"global.fetch=()=>{throw new Error('DRY_RUN_NETWORK_ACCESS_FORBIDDEN')};\n");
const secretVariableName=['OPENAI','API','KEY'].join('_');
const unusedSecretMarker=['MUST','NOT','BE','USED'].join('_');
const base=['--batch-id','audio-batch-02a-gaka-r1','--mode','dry-run','--expected-count','2','--staging-dir',temp,'--workflow-run-id','dry-test','--commit','test'];
let result=spawnSync(process.execPath,[path.join(root,'scripts/preflight-audio-batch.mjs'),...base,'--confirmation','DRY-RUN'],{cwd:root,encoding:'utf8',env:{...process.env,[secretVariableName]:unusedSecretMarker,NODE_OPTIONS:`--require=${denyNetwork}`}});
assert.equal(result.status,0,result.stderr);
result=spawnSync(process.execPath,[path.join(root,'scripts/generate-lesson-audio.mjs'),...base],{cwd:root,encoding:'utf8',env:{...process.env,[secretVariableName]:unusedSecretMarker,NODE_OPTIONS:`--require=${denyNetwork}`}});
assert.equal(result.status,0,result.stderr);
result=spawnSync(process.execPath,[path.join(root,'scripts/validate-audio-staging.mjs'),...base],{cwd:root,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
const generation=JSON.parse(fs.readFileSync(path.join(temp,'generation-report.json'),'utf8'));
const artifact=JSON.parse(fs.readFileSync(path.join(temp,'artifact-manifest.json'),'utf8'));
const preflight=JSON.parse(fs.readFileSync(path.join(temp,'preflight-report.json'),'utf8'));
assert.equal(generation.generatedCount,2);assert.equal(generation.apiRequestCount,0);assert.equal(generation.status,'completed');
assert.equal(artifact.generatedCount,2);assert.equal(artifact.apiRequestCount,0);assert.equal(artifact.reviewStatus,'underReview');assert.equal(artifact.items.length,2);
assert.deepEqual(artifact.items.map(x=>x.outputFile),['files/ga.mp3.fixture','files/ka.mp3.fixture']);
assert.deepEqual(artifact.items.map(x=>x.codec),['fixture','fixture']);
assert.deepEqual(preflight.allowedItems.map(x=>x.speechText),['가','카']);
assert.doesNotMatch(JSON.stringify({preflight,generation,artifact}),/MUST_NOT_BE_USED|OPENAI_API_KEY|Authorization/i);

const formal1=JSON.parse(fs.readFileSync(path.join(root,'audio/lesson-00/manifest.json'),'utf8'));
assert.ok(formal1.items.filter(x=>['yo','yu'].includes(x.id)).every(x=>x.reviewStatus==='approved'&&x.assetStatus==='available'));
assert.deepEqual(formal1.items.map(x=>x.id),['yo','yu','ha']);
assert.equal(formal1.items.find(x=>x.id==='ha').reviewStatus,'approved');assert.equal(formal1.items.find(x=>x.id==='ha').assetStatus,'available');
const formal2=JSON.parse(fs.readFileSync(path.join(root,'audio/k0-consonant-contrast/manifest.json'),'utf8'));
const formal2a=formal2.items.filter(x=>['ga','ka','kka'].includes(x.id));
assert.deepEqual(formal2a.map(x=>x.id),['ga','ka','kka']);assert.ok(formal2a.every(x=>x.reviewStatus==='approved'&&x.assetStatus==='available'));
assert.doesNotMatch(fs.readFileSync(path.join(root,'audio-catalog.js'),'utf8'),/staging\//);
assert.doesNotMatch(fs.readFileSync(path.join(root,'sw.js'),'utf8'),/staging\//);

const published=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-audio-published-block-'));
result=spawnSync(process.execPath,[path.join(root,'scripts/preflight-audio-batch.mjs'),'--batch-id','audio-batch-01','--mode','generate','--expected-count','2','--confirmation','GENERATE audio-batch-01 2','--staging-dir',published],{cwd:root,encoding:'utf8',env:{...process.env,[secretVariableName]:unusedSecretMarker}});
assert.notEqual(result.status,0,'Published Batch 1 must not be generated again.');assert.match(result.stderr,/pending\/missing before review/);
const published2a=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-audio-2a-published-block-'));
result=spawnSync(process.execPath,[path.join(root,'scripts/preflight-audio-batch.mjs'),'--batch-id','audio-batch-02a-gaka-r1','--mode','generate','--expected-count','2','--confirmation','GENERATE audio-batch-02a-gaka-r1 2','--staging-dir',published2a],{cwd:root,encoding:'utf8',env:{...process.env,[secretVariableName]:unusedSecretMarker}});
assert.notEqual(result.status,0,'Published Batch 2A revision must not be generated again.');assert.match(result.stderr,/pending\/missing before review/);
const published2b=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-audio-2b-published-block-'));
result=spawnSync(process.execPath,[path.join(root,'scripts/preflight-audio-batch.mjs'),'--batch-id','audio-batch-02b','--mode','generate','--expected-count','13','--confirmation','GENERATE audio-batch-02b 13','--staging-dir',published2b],{cwd:root,encoding:'utf8',env:{...process.env,[secretVariableName]:unusedSecretMarker}});
assert.notEqual(result.status,0,'Published Batch 2B must not be generated again.');assert.match(result.stderr,/pending\/missing before review/);

for(const [name,args,pattern] of [
  ['wrong Batch 2B count',['--batch-id','audio-batch-02b','--mode','dry-run','--expected-count','12','--confirmation','DRY-RUN'],/allowlist count/],
  ['retired original Batch 2A',['--batch-id','audio-batch-02a','--mode','dry-run','--expected-count','3','--confirmation','DRY-RUN'],/Unknown batchId/],
  ['wrong count',['--batch-id','audio-batch-02a-gaka-r1','--mode','dry-run','--expected-count','3','--confirmation','DRY-RUN'],/allowlist count/],
  ['wrong confirmation',['--batch-id','audio-batch-02a-gaka-r1','--mode','generate','--expected-count','2','--confirmation','DRY-RUN'],/Generate confirmation must exactly match/]
]){
  const blocked=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-audio-preflight-block-'));
  result=spawnSync(process.execPath,[path.join(root,'scripts/preflight-audio-batch.mjs'),...args,'--staging-dir',blocked],{cwd:root,encoding:'utf8',env:{...process.env,[secretVariableName]:unusedSecretMarker,NODE_OPTIONS:`--require=${denyNetwork}`}});
  assert.notEqual(result.status,0,`${name} must fail before generation.`);assert.match(result.stderr,pattern);assert.equal(fs.existsSync(path.join(blocked,'files')),false);
}

const broken=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-audio-broken-'));
fs.cpSync(temp,broken,{recursive:true});fs.unlinkSync(path.join(broken,'files/ka.mp3.fixture'));
result=spawnSync(process.execPath,[path.join(root,'scripts/validate-audio-staging.mjs'),'--batch-id','audio-batch-02a-gaka-r1','--mode','dry-run','--expected-count','2','--staging-dir',broken],{cwd:root,encoding:'utf8'});
assert.notEqual(result.status,0,'Missing staged file must fail technical validation.');assert.ok(fs.existsSync(path.join(broken,'artifact-manifest.json')),'Failure must still preserve an artifact manifest.');

console.log('Validated frozen Batch 1 settings, published two-item 가/카 revision isolation, preserved 까 exclusion, strict prepared Batch 2B allowlist, zero-cost dry-run behavior, failure-preserved reports, and workflow safeguards.');
