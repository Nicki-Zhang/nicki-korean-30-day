import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';
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
const expectedSha=new Map([
  ['da','37cabe6d05782f45ae49ebc5d2c76278cd3a3ac088ff433e50dd32d4b5619046'],
  ['ta','158b84180fc317e304ec0e15d50c2a2df6d9dbe6ca6abb690d2471e846f90be8'],
  ['tta','a027bee927746526b9f69b9b19ce552486fbc6ed2e3b8d9b6669a18f3413d7f0'],
  ['ba','128841a96d40fc42589b97a89d31ef637ed70108b588a025f8b9095b5449b95c'],
  ['pa','78b31bba7f20ebb379b9c5f92d9fb9da36debfd9bc17236af168c065392185ed'],
  ['ppa','53cd03ff44b7ee2f39432a62db06d48467ffca76cf843c77c2a1d58b54f07285'],
  ['ja','b65419728ffc7272ea4a93eee8566757688822081ebd031d1f8bd3fbfb2407d8'],
  ['cha','0b9f14ede1bb854d28493883e54bfc6b3aa39dceb6fafe2328cdb95696ab517d'],
  ['jja','9514e93678a8dfbae79af74bafa67c4f04314517c225a902da605f3ca8d824d2'],
  ['sa','dc102fb4fa65f0592055ca4751e47498c38ac8d33b344996bd99c8328b6d5f3b'],
  ['ssa','3c3b83fc317f12b936006c5fea2d5cd5966f7c5a1127883a4f0b86e6096ec381'],
  ['ha','5a3e5a6e172bb265c02149b84b725a46de61156c5bf2fe2c39c8b263e65969b5'],
  ['geu','c7dee859df0d3dc4ac9b8fd0c5d37ac7588e07313004a93a802849a4989d0d58']
]);
validateBatchShape('audio-batch-02b',batch,13);
await validateFormalManifest(root,batch,{allowPublished:true});
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
  assert.equal(exact[0].reviewStatus,'approved');
  assert.equal(exact[0].assetStatus,'available');
  assert.equal(exact[0].sourceRunId,'29798619662');
  assert.equal(exact[0].sourceArtifact,'nikigo-audio-batch-02b-run-29798619662-09fad4f');
  assert.equal(exact[0].reviewMethod,'product-owner-listening');
  assert.equal(exact[0].reviewedAt,'2026-07-21');
  assert.equal(exact[0].rightsReviewStatus,'pending');
  assert.equal(exact[0].sha256,expectedSha.get(id));
  assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root,'audio',lessonId,file))).digest('hex'),expectedSha.get(id));
  assert.equal(globalThis.NikigoAudio.canPlayAudio(speechText,exact[0],audioType),true);
}
assert.ok(all.some(item=>item.speechText==='다'&&item.lessonId==='lesson-02'),'Legacy same-text records may exist but cannot replace the strict Batch 2B lesson/type/path record.');
assert.match(fs.readFileSync(path.join(root,'lesson-00.js'),'utf8'),/item\.symbol === 'ㅎ' \? 'lesson-00' : 'k0-consonant-contrast'/,'Lesson 0 must resolve 하 through its exact lesson-scoped initial-example record.');

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
console.log('Validated strict 13-item Batch 2B publication, cross-lesson manifests, zero-cost local fixtures, no retries, and staging-only generation output.');
