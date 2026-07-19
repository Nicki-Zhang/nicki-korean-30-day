import assert from 'node:assert/strict';
import fs from 'node:fs';

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
      for(const field of ['voiceSource','model','generationDate','commercialUseBasis','nativeReviewer','reviewNotes']) assert.ok(entry[field]&&entry[field]!=='pending-documentation',`approved ${lessonId}/${entry.id} lacks ${field}`);
      assert.equal(audio.canPlayAudio(entry.speechText,entry,entry.audioType),true);
    } else assert.equal(audio.canPlayAudio(entry.speechText,entry,entry.audioType),false,`${lessonId}/${entry.id} pending/rejected became playable`);
    assert.equal(audio.canPlayAudio(`${entry.speechText} `,entry,entry.audioType),false,'fuzzy speechText accepted');
    assert.equal(audio.canPlayAudio(entry.speechText,entry,`${entry.audioType}-wrong`),false,'wrong audio type accepted');
  }
}

assert.equal(count,77);
assert.deepEqual(audio.lessons['lesson-00'].items.map(entry=>entry.id),['yo','yu'],'Batch 1 must contain only yo and yu.');
assert.ok(audio.lessons['lesson-00'].items.every(entry=>entry.reviewStatus==='pending'),'Generated Batch 1 audio must remain pending.');
assert.equal(audio.lessons['k0-consonant-contrast'].items.length,14);
assert.equal(audio.lessons['lesson-06'].items.length,15);
for(const text of ['왜','예']) assert.deepEqual(audio.lessons['lesson-06'].items.filter(x=>x.speechText===text).map(x=>x.audioType).sort(),['syllable','word']);

const production=[
  ...fs.readdirSync('.').filter(file=>/\.(?:js|html)$/.test(file)),
  ...fs.readdirSync('assets').filter(file=>/\.js$/.test(file)).map(file=>`assets/${file}`)
];
for(const file of production) assert.doesNotMatch(fs.readFileSync(file,'utf8'),/speechSynthesis|SpeechSynthesisUtterance|getVoices/,`${file} contains device TTS`);
const complete={...audio.lessons['lesson-01'].items[0],reviewStatus:'approved',assetStatus:'available',generationDate:'2026-01-01',commercialUseBasis:'documented',nativeReviewer:'reviewer',reviewNotes:'approved'};
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,assetStatus:'missing'},complete.audioType),false,'approved missing asset became playable');
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,nativeReviewer:null},complete.audioType),false,'approved incomplete review became playable');
assert.equal(audio.canPlayAudio(complete.speechText,{...complete,assetStatus:'deprecated'},complete.audioType),false,'deprecated asset became playable');
assert.doesNotMatch(fs.readFileSync('review-catalog.js','utf8'),/audio:\s*['"][^'"]*[,，][^'"]*['"]/, 'review sequence is comma-batched');
assert.match(fs.readFileSync('review.html','utf8'),/currentAudio\.onended=next/,'review sequence is not file-by-file');
const worker=fs.readFileSync('sw.js','utf8'); assert.match(worker,/nikigo-v15-reviewed-audio-gate/); assert.match(worker,/audio\/deprecated/);
console.log('Validated 77 strict catalog records, the exact 2-item Batch 1 scope, zero playable pending records, typed Lesson 6 records, and zero device-TTS calls in production JS/HTML.');
