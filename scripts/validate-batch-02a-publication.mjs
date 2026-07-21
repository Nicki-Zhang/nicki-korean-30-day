import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

await import(new URL('../audio-catalog.js',import.meta.url));
const audio=globalThis.NikigoAudio;
const expected=new Map([
  ['ga',{speechText:'가',sha256:'705fc26ec549f1882f06eaeb997ba59f0ceef95e8c9603e5a7a82b35451205a9',sourceSha256:'db8fe0dece7cf0290c11ec5eebde750e3c8051169b17c11e83775f7438453860',sourceRunId:'29720437383'}],
  ['ka',{speechText:'카',sha256:'7a4754d8c2583d1941a8f2d18bfd41239e4e753726af880fc3c0ea7dd2c697ed',sourceSha256:'460d6f23a6c17d1f3a6522289d0fe99d63253d598c5141695b45f12a29b7be71',sourceRunId:'29720437383'}],
  ['kka',{speechText:'까',sha256:'c63080ad2e208b9f9319b806d2470143b7a2140cba4768c0cc61947cccf9e545',sourceSha256:'20a33fd85584d2efc288513368a90c0ef94022f21a074bf0646a641b46ccdf27',sourceRunId:'29717434767'}]
]);
const contrast=audio.lessons['k0-consonant-contrast'].items;
const published=contrast.filter(entry=>expected.has(entry.id));
assert.deepEqual(published.map(entry=>entry.id),['ga','ka','kka']);
for(const entry of published){
  const target=expected.get(entry.id);
  assert.equal(entry.speechText,target.speechText);assert.equal(entry.audioType,'initial-example');
  assert.equal(entry.reviewStatus,'approved');assert.equal(entry.assetStatus,'available');
  assert.equal(entry.reviewMethod,'product-owner-listening');assert.equal(entry.reviewedAt,'2026-07-20');
  assert.equal(entry.nativeReviewStatus,'deferred');assert.equal(entry.nativeReviewer,null);assert.equal(entry.needsNativeReview,false);
  assert.equal(entry.technicalValidation,'passed');assert.equal(entry.rightsReviewStatus,'pending');
  assert.equal(entry.model,'gpt-4o-mini-tts');assert.equal(entry.voice,'marin');assert.equal(entry.sourceRunId,target.sourceRunId);
  assert.equal(entry.sourceSha256,target.sourceSha256);assert.equal(entry.sha256,target.sha256);
  const file=`audio/k0-consonant-contrast/${entry.file}`;assert.ok(fs.existsSync(file));
  assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),target.sha256);
  assert.equal(audio.canPlayAudio(entry.speechText,entry,'initial-example'),true);
  for(const mutation of [{reviewStatus:'pending'},{assetStatus:'missing'},{technicalValidation:'failed'},{sha256:'0'.repeat(64)},{speechText:`${entry.speechText}x`},{audioType:'word'}]) {
    assert.equal(audio.canPlayAudio(target.speechText,{...entry,...mutation},'initial-example'),false,`${entry.id} unsafe mutation became playable`);
  }
}
assert.equal(contrast.filter(entry=>entry.reviewStatus==='approved').length,14);

const all=Object.values(audio.lessons).flatMap(lesson=>lesson.items);
assert.equal(all.filter(entry=>audio.canPlayAudio(entry.speechText,entry,entry.audioType)).length,54);
const batch1=audio.lessons['lesson-00'].items.filter(entry=>['yo','yu'].includes(entry.id));
assert.deepEqual(batch1.map(entry=>[entry.id,entry.sha256]),[
  ['yo','d2570041a865d0d686e6debf1a06584fa10b1177ebb590e4654a30506f5538b0'],
  ['yu','3eb015cd5a7a9c7955976e1d0acd6669126e7c5c74a1c928f7d7b9d925d98430']
]);

const report=JSON.parse(fs.readFileSync('audio/k0-consonant-contrast/postprocessing-report.json','utf8'));
assert.equal(report.apiRequestCount,0);assert.equal(report.generationPerformed,false);assert.equal(report.technicalValidation,'passed');
assert.deepEqual(report.method.prohibitedProcessingConfirmedAbsent,['noise-reduction','dynamic-compression','pitch-change','speed-change','voice-conversion','device-tts']);
assert.equal(report.items.length,3);
for(const item of report.items){
  const target=expected.get(item.id);assert.ok(target);assert.equal(item.inputSha256,target.sourceSha256);assert.equal(item.outputSha256,target.sha256);
  assert.ok(Math.abs(item.after.activeRmsDbfs-report.method.targetActiveRmsDbfs)<=1);
  assert.ok(item.after.peakDbfs<=-3);assert.ok(Math.abs(item.after.leadingSilenceSeconds-0.1)<=0.01);assert.ok(Math.abs(item.after.trailingSilenceSeconds-0.25)<=0.01);
  assert.equal(item.after.metadataProbe,'passed');assert.equal(item.after.fullDecode,'passed');assert.equal(item.after.codec,'mp3');assert.equal(item.after.sampleRate,24000);assert.equal(item.after.channels,1);
}
const rms=report.items.map(item=>item.after.activeRmsDbfs);assert.ok(Math.max(...rms)-Math.min(...rms)<=1);

const manifest=JSON.parse(fs.readFileSync('audio/k0-consonant-contrast/manifest.json','utf8'));
assert.deepEqual(manifest.items,contrast);
const resolved=['가','카','까'].map(speech=>audio.resolve(speech,'initial-example','k0-consonant-contrast'));
assert.ok(resolved.every(result=>result.playable&&result.path));
assert.deepEqual(resolved.map(result=>result.path),['audio/k0-consonant-contrast/ga.mp3','audio/k0-consonant-contrast/ka.mp3','audio/k0-consonant-contrast/kka.mp3']);

const source=fs.readFileSync('lesson-consonant-contrast.js','utf8');
const element=()=>({value:'',textContent:'',innerHTML:'',title:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},setAttribute(){},addEventListener(){}});
const elements=new Map(['lessonStage','language','lessonName','progressLabel','progressCount','progressBar','progressTrack','homeButton','homeLogo','toast'].map(id=>[id,element()]));
const documentStub={getElementById:id=>elements.get(id)||element(),addEventListener(){},documentElement:{lang:''}};
const context={window:{location:{search:'?lang=en',href:''},navigator:{language:'en'},document:documentStub,localStorage:{getItem(){return null;},setItem(){}},NikigoState:{get(){return{};},update(value){return value;}},NikigoAudio:audio,setTimeout(){},scrollTo(){}},document:documentStub,URLSearchParams,Audio:class{}};
context.window.window=context.window;
vm.runInNewContext(source,context,{filename:'lesson-consonant-contrast.js'});
const hosted=JSON.parse(JSON.stringify(context.window.NikigoContrastLesson.HOSTED_AUDIO));
assert.equal(Object.keys(hosted).length,14);
assert.deepEqual(Object.fromEntries(['가','카','까'].map(speech=>[speech,hosted[speech]])),{
  '가':'audio/k0-consonant-contrast/ga.mp3','카':'audio/k0-consonant-contrast/ka.mp3','까':'audio/k0-consonant-contrast/kka.mp3'
});
for(const language of ['zh','en','vi','ja']){
  const ui=context.window.NikigoContrastLesson.UI[language];
  for(const key of ['listenSound','listenSequence','playerPlay','playerReplay','playerError'])assert.ok(ui[key]&&!ui[key].includes('undefined'));
}
assert.match(source,/global\.setTimeout\(next,260\)/);assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance|getVoices/);
const lesson00Source=fs.readFileSync('lesson-00.js','utf8');
assert.match(lesson00Source,/const mappedLessonId = item\.demoAudio\?\.match/);
assert.match(lesson00Source,/mappedLessonId \|\| \(item\.symbol === 'ㅎ' \? 'lesson-00' : 'k0-consonant-contrast'\)/);
const worker=fs.readFileSync('sw.js','utf8');
for(const file of ['./audio/k0-consonant-contrast/ga.mp3','./audio/k0-consonant-contrast/ka.mp3','./audio/k0-consonant-contrast/kka.mp3'])assert.ok(worker.includes(file));
assert.doesNotMatch(worker,/staging\/|actions\/runs\/|sourceArtifact/);

console.log('Validated Batch 2A publication remains immutable after Batch 2B: exact source/output SHA chain, deterministic processing report, Batch 1 immutability, four-language labels, sequence playback mapping, fail-closed audio, and isolated Service Worker cache.');
