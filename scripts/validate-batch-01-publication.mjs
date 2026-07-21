import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { createHash } from 'node:crypto';

await import(new URL('../audio-catalog.js',import.meta.url));
const audio=globalThis.NikigoAudio;
const expected=new Map([
  ['yo',{speechText:'요',file:'yo.mp3',sha256:'d2570041a865d0d686e6debf1a06584fa10b1177ebb590e4654a30506f5538b0'}],
  ['yu',{speechText:'유',file:'yu.mp3',sha256:'3eb015cd5a7a9c7955976e1d0acd6669126e7c5c74a1c928f7d7b9d925d98430'}]
]);
const all=Object.entries(audio.lessons).flatMap(([lessonId,lesson])=>lesson.items.map(entry=>({lessonId,...entry})));
const batch=audio.lessons['lesson-00'].items.filter(entry=>expected.has(entry.id));
assert.equal(all.length,83);
assert.deepEqual(audio.lessons['lesson-00'].items.map(entry=>entry.id),['yo','yu','ha']);
assert.deepEqual(Object.keys(audio.approvedAssetHashes).sort(),['k0-consonant-contrast:ga','k0-consonant-contrast:ka','k0-consonant-contrast:kka','lesson-00:yo','lesson-00:yu']);

for(const entry of batch){
  const target=expected.get(entry.id);assert.ok(target);
  assert.equal(entry.speechText,target.speechText);assert.equal(entry.audioType,'vowel');assert.equal(entry.file,target.file);
  assert.equal(entry.reviewStatus,'approved');assert.equal(entry.assetStatus,'available');assert.equal(entry.reviewMethod,'product-owner-listening');
  assert.equal(entry.reviewedAt,'2026-07-20');assert.equal(entry.nativeReviewStatus,'deferred');assert.equal(entry.nativeReviewer,null);
  assert.equal(entry.technicalValidation,'passed');assert.equal(entry.sha256,target.sha256);
  assert.equal(entry.sourceRunId,'29713532746');assert.equal(entry.sourceArtifact,'nikigo-audio-batch-01-validation-run-29713532746-78e5510');
  assert.equal(entry.model,'gpt-4o-mini-tts');assert.equal(entry.voice,'marin');assert.equal(entry.generationDate,'2026-07-20T02:07:40.367Z');
  assert.equal(entry.rightsReviewStatus,'pending');assert.match(entry.commercialUseBasis,/legal review pending/i);
  const path=`audio/lesson-00/${entry.file}`;assert.ok(fs.existsSync(path));
  assert.equal(createHash('sha256').update(fs.readFileSync(path)).digest('hex'),target.sha256);
  assert.equal(audio.canPlayAudio(entry.speechText,entry,entry.audioType),true);
  for(const mutation of [
    {reviewStatus:'pending'},{assetStatus:'missing'},{technicalValidation:'failed'},{sha256:'0'.repeat(64)},
    {speechText:`${entry.speechText}x`},{audioType:'word'},{nativeReviewer:'invented'}
  ]) assert.equal(audio.canPlayAudio(target.speechText,{...entry,...mutation},'vowel'),false,`${entry.id} unsafe mutation became playable`);
}

const others=all.filter(entry=>!expected.has(entry.id)||entry.lessonId!=='lesson-00');
assert.equal(others.length,81,'Current catalog contains 81 records outside approved Batch 1.');
assert.equal(others.filter(entry=>entry.reviewStatus==='approved').length,3,'Only Batch 2A may join Batch 1 as approved audio.');
assert.equal(others.filter(entry=>entry.reviewStatus==='pending').length,78);

const manifest=JSON.parse(fs.readFileSync('audio/lesson-00/manifest.json','utf8'));
assert.deepEqual(manifest.items,audio.lessons['lesson-00'].items);
const source=fs.readFileSync('lesson-00.js','utf8');
const documentStub={addEventListener(){}};
const context={window:{document:documentStub,location:{search:'',href:''},navigator:{language:'en'}},document:documentStub,URLSearchParams,setTimeout(){}};
context.window.window=context.window;
vm.runInNewContext(source,context,{filename:'lesson-00.js'});
for(const language of ['zh','en','vi','ja']){
  const copy=context.window.NikigoLesson00.COPY[language];
  for(const key of ['listenVowel','audioNotReleased','audioError','audioPlaying','audioReplay']) assert.ok(copy[key]&&!copy[key].includes('undefined'),`${language}.${key} missing`);
}
assert.match(source,/if \(currentAudio\) currentAudio\.pause\(\)/);
assert.match(source,/currentAudio\.play\(\)\.catch/);
assert.match(source,/playedAudioKeys\.add\(audioKey\)/);
assert.match(source,/const token = \+\+playbackToken/);
assert.doesNotMatch(source,/speechSynthesis|SpeechSynthesisUtterance|getVoices|textContent\s*=\s*resolved\.entry\.speechText/);

const worker=fs.readFileSync('sw.js','utf8');
for(const file of ['./audio/lesson-00/yo.mp3','./audio/lesson-00/yu.mp3']) assert.ok(worker.includes(file));
assert.doesNotMatch(worker,/staging\/|nikigo-audio-batch-01-validation-run/);
console.log('Validated Batch 1 publication remains immutable after Batch 2A: exact yo/yu SHA values, four-language UI, fail-closed playback, and isolated Service Worker cache.');
