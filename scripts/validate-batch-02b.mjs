import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { loadBatch, validateBatchShape, validateFormalManifest } from './audio-batch-lib.mjs';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const expected=[
  ['k0-consonant-contrast','da','다','initial-example','da.mp3'],
  ['k0-consonant-contrast','ta','타','initial-example','ta.mp3'],
  ['k0-consonant-contrast','tta','따','initial-example','tta.mp3'],
  ['k0-consonant-contrast','ba','바','initial-example','ba.mp3'],
  ['k0-consonant-contrast','pa','파','initial-example','pa.mp3'],
  ['k0-consonant-contrast','ppa','빠','initial-example','ppa.mp3'],
  ['k0-consonant-contrast','ja','자','initial-example','ja.mp3'],
  ['k0-consonant-contrast','cha','차','initial-example','cha.mp3'],
  ['k0-consonant-contrast','jja','짜','initial-example','jja.mp3'],
  ['k0-consonant-contrast','sa','사','initial-example','sa.mp3'],
  ['k0-consonant-contrast','ssa','싸','initial-example','ssa.mp3'],
  ['lesson-00','ha','하','initial-example','ha.mp3'],
  ['lesson-05','geu','그','syllable','geu.mp3']
];
const batch=await loadBatch(root,'audio-batch-02b');
validateBatchShape('audio-batch-02b',batch,13);
await validateFormalManifest(root,batch);
assert.deepEqual(batch.items.map(item=>[item.lessonId,item.id,item.speechText,item.audioType,item.outputFile]),expected);
assert.equal(batch.model,'gpt-4o-mini-tts');
assert.equal(batch.voice,'marin');
assert.equal(batch.format,'mp3');
assert.equal(batch.speed,null);
assert.equal(batch.maxApiRequests,13);
assert.equal(batch.automaticRetry,false);
assert.equal(batch.outputPolicy,'staging-artifact-only');
assert.match(batch.instructions,/exactly once/);
assert.match(batch.instructions,/Do not create category differences by increasing loudness or lengthening the vowel/);

await import(new URL('../audio-catalog.js',import.meta.url));
const all=Object.values(globalThis.NikigoAudio.lessons).flatMap(lesson=>lesson.items);
for(const [lessonId,id,speechText,audioType,file] of expected){
  const exact=all.filter(item=>item.lessonId===lessonId&&item.id===id&&item.speechText===speechText&&item.audioType===audioType&&item.file===file);
  assert.equal(exact.length,1,`${id} must have exactly one strict formal record.`);
  assert.equal(exact[0].reviewStatus,'pending');
  assert.equal(exact[0].assetStatus,'missing');
  assert.equal(globalThis.NikigoAudio.canPlayAudio(exact[0]),false);
}
assert.ok(all.some(item=>item.speechText==='다'&&item.lessonId==='lesson-02'),'Legacy same-text records may exist but cannot replace the strict Batch 2B lesson/type/path record.');

const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-batch-02b-dry-'));
const denyNetwork=path.join(temp,'deny-network.cjs');
fs.writeFileSync(denyNetwork,"global.fetch=()=>{throw new Error('NETWORK_FORBIDDEN')};\n");
const args=['--batch-id','audio-batch-02b','--mode','dry-run','--expected-count','13','--staging-dir',temp,'--workflow-run-id','local-fixture','--commit','local-test'];
let result=spawnSync(process.execPath,[path.join(root,'scripts/preflight-audio-batch.mjs'),...args,'--confirmation','DRY-RUN'],{cwd:root,encoding:'utf8',env:{...process.env,NODE_OPTIONS:`--require=${denyNetwork}`}});
assert.equal(result.status,0,result.stderr);
result=spawnSync(process.execPath,[path.join(root,'scripts/generate-lesson-audio.mjs'),...args],{cwd:root,encoding:'utf8',env:{...process.env,NODE_OPTIONS:`--require=${denyNetwork}`}});
assert.equal(result.status,0,result.stderr);
result=spawnSync(process.execPath,[path.join(root,'scripts/validate-audio-staging.mjs'),...args],{cwd:root,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
const report=JSON.parse(fs.readFileSync(path.join(temp,'generation-report.json'),'utf8'));
const artifact=JSON.parse(fs.readFileSync(path.join(temp,'artifact-manifest.json'),'utf8'));
assert.equal(report.generatedCount,13);
assert.equal(report.apiRequestCount,0);
assert.equal(artifact.generatedCount,13);
assert.equal(artifact.apiRequestCount,0);
assert.equal(artifact.reviewStatus,'underReview');
assert.deepEqual(artifact.items.map(item=>path.basename(item.outputFile)),expected.map(item=>`${item[4]}.fixture`));
fs.rmSync(temp,{recursive:true,force:true});
console.log('Validated strict 13-item Batch 2B allowlist, cross-lesson manifests, zero-cost local fixtures, no retries, and staging-only output.');
