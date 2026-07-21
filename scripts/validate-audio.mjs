import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

await import(new URL('../audio-catalog.js', import.meta.url));
const audio = globalThis.NikigoAudio;
assert.ok(audio?.lessons && typeof audio.canPlayAudio === 'function');

const required = ['id','lessonId','displayText','speechText','audioType','pronunciationType','pronunciationRule','file','voiceSource','model','generationDate','commercialUseBasis','reviewStatus','assetStatus','nativeReviewer','reviewNotes'];
const allowedAudioTypes = new Set(['vowel','initial-example','syllable','word','sentence','batchim-example','sound-change','letter-name']);
const allowedReview = new Set(['pending','approved','rejected','legacy-unreviewed']);
const allowedAssets = new Set(['available','missing','deprecated']);
const ids = new Set();
let count = 0;

for (const [lessonId, lesson] of Object.entries(audio.lessons)) {
  const manifestPath = `audio/${lessonId}/manifest.json`;
  assert.ok(fs.existsSync(manifestPath), `missing ${manifestPath}`);
  const manifest = JSON.parse(fs.readFileSync(manifestPath,'utf8'));
  assert.equal(manifest.schemaVersion,2);
  assert.deepEqual(manifest.items, lesson.items, `${manifestPath} differs from canonical catalog`);
  const lessonIds = new Set(); const files = new Set();
  for (const entry of lesson.items) {
    count += 1;
    for (const field of required) assert.ok(Object.hasOwn(entry,field),`${lessonId}/${entry.id} missing ${field}`);
    assert.equal(entry.lessonId,lessonId);
    assert.ok(entry.id && entry.displayText && entry.speechText && entry.audioType && entry.file);
    assert.ok(allowedAudioTypes.has(entry.audioType),`${lessonId}/${entry.id} invalid audioType`);
    assert.ok(allowedReview.has(entry.reviewStatus)); assert.ok(allowedAssets.has(entry.assetStatus));
    assert.ok(!lessonIds.has(entry.id),`${lessonId} duplicate id ${entry.id}`); lessonIds.add(entry.id);
    assert.ok(!files.has(entry.file),`${lessonId} duplicate file ${entry.file}`); files.add(entry.file);
    assert.ok(!ids.has(`${lessonId}:${entry.id}`)); ids.add(`${lessonId}:${entry.id}`);
    assert.doesNotMatch(entry.speechText,/^[A-Za-z\s.,'-]+$/u);
    assert.doesNotMatch(entry.speechText,/^[ㄱ-ㅎ]$/u);
    const path=`audio/${lessonId}/${entry.file}`, exists=fs.existsSync(path);
    assert.equal(entry.assetStatus,exists?'available':'missing',`${lessonId}/${entry.id} assetStatus mismatch`);
    if(entry.reviewStatus==='approved') {
      assert.ok(exists,`approved asset missing ${path}`);
      for(const field of ['voiceSource','model','voice','generationDate','commercialUseBasis','rightsReviewStatus','reviewMethod','reviewedAt','nativeReviewStatus','technicalValidation','sha256','sourceRunId','sourceArtifact','reviewNotes']) assert.ok(String(entry[field]??'').trim(),`approved ${lessonId}/${entry.id} lacks ${field}`);
      assert.equal(entry.reviewMethod,'product-owner-listening');
      assert.equal(entry.nativeReviewStatus,'deferred');
      assert.equal(entry.nativeReviewer,null,'deferred native review must not invent a reviewer');
      assert.equal(entry.technicalValidation,'passed');
      assert.equal(createHash('sha256').update(fs.readFileSync(path)).digest('hex'),entry.sha256,`${lessonId}/${entry.id} SHA mismatch`);
      assert.equal(audio.canPlayAudio(entry.speechText,entry,entry.audioType),true);
    } else assert.equal(audio.canPlayAudio(entry.speechText,entry,entry.audioType),false,`${lessonId}/${entry.id} pending/rejected became playable`);
    assert.equal(audio.canPlayAudio(`${entry.speechText} `,entry,entry.audioType),false,'fuzzy speechText accepted');
    assert.equal(audio.canPlayAudio(entry.speechText,entry,`${entry.audioType}-wrong`),false,'wrong audio type accepted');
  }
}

assert.equal(count,83);
assert.deepEqual(audio.lessons['lesson-00'].items.map(entry=>entry.id),['yo','yu','ha'],'Lesson 0 must retain approved Batch 1 plus pending Batch 2B 하.');
assert.ok(audio.lessons['lesson-00'].items.slice(0,2).every(entry=>entry.reviewStatus==='approved'&&entry.assetStatus==='available'),'Product-owner approved Batch 1 must be available.');
assert.equal(audio.lessons['lesson-00'].items[2].reviewStatus,'pending');assert.equal(audio.lessons['lesson-00'].items[2].assetStatus,'missing');
const allEntries=Object.entries(audio.lessons).flatMap(([lessonId,lesson])=>lesson.items.map(entry=>({lessonId,...entry})));
const playable=allEntries.filter(entry=>audio.canPlayAudio(entry.speechText,entry,entry.audioType));
assert.deepEqual(playable.map(entry=>`${entry.lessonId}:${entry.id}`).sort(),['k0-consonant-contrast:ga','k0-consonant-contrast:ka','k0-consonant-contrast:kka','lesson-00:yo','lesson-00:yu']);
const pendingEntries=allEntries.filter(entry=>entry.reviewStatus==='pending');
assert.equal(pendingEntries.length,78,'Exactly 78 records must remain pending after adding Batch 2B gaps and Lesson 7 preview records.');
assert.ok(pendingEntries.every(entry=>!audio.canPlayAudio(entry.speechText,entry,entry.audioType)),'A pending record became playable.');
assert.equal(audio.lessons['k0-consonant-contrast'].items.length,14);
assert.equal(audio.lessons['lesson-06'].items.length,15);
for(const text of ['왜','예']) assert.deepEqual(audio.lessons['lesson-06'].items.filter(x=>x.speechText===text).map(x=>x.audioType).sort(),['syllable','word']);

const production=[
  ...fs.readdirSync('.').filter(file=>/\.(?:js|html)$/.test(file)),
  ...fs.readdirSync('assets').filter(file=>/\.js$/.test(file)).map(file=>`assets/${file}`)
];
for(const file of production) assert.doesNotMatch(fs.readFileSync(file,'utf8'),/speechSynthesis|SpeechSynthesisUtterance|getVoices/,`${file} contains device TTS`);
const complete={...audio.lessons['lesson-00'].items[0]};
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,assetStatus:'missing'},complete.audioType),false,'approved missing asset became playable');
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,nativeReviewer:'invented'},complete.audioType),false,'deferred native review accepted an invented reviewer');
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,technicalValidation:'failed'},complete.audioType),false,'failed technical validation became playable');
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,sha256:'0'.repeat(64)},complete.audioType),false,'wrong SHA became playable');
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,assetStatus:'deprecated'},complete.audioType),false,'deprecated asset became playable');
assert.doesNotMatch(fs.readFileSync('review-catalog.js','utf8'),/audio:\s*['"][^'"]*[,，][^'"]*['"]/, 'review sequence is comma-batched');
assert.match(fs.readFileSync('review.html','utf8'),/currentAudio\.onended=next/,'review sequence is not file-by-file');
const worker=fs.readFileSync('sw.js','utf8'); assert.match(worker,/nikigo-v(?:17-batch-02a-approved|20-course-navigation-network-refresh|21-lesson-07-preview)/); assert.match(worker,/audio\/deprecated/);
console.log('Validated 83 strict catalog records, exactly 5 approved/playable Batch 1 + 2A assets, 78 pending records, physical SHA integrity, and zero device-TTS calls in production JS/HTML.');
