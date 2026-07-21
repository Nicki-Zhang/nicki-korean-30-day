import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createHash } from 'node:crypto';

await import(new URL('../audio-catalog.js', import.meta.url));
const audio = globalThis.NikigoAudio;
const all = Object.values(audio.lessons).flatMap(lesson => lesson.items);
const byId = new Map(all.map(entry => [`${entry.lessonId}:${entry.id}`, entry]));

const baselineApproved = Object.freeze({
  'lesson-00:yo':'d2570041a865d0d686e6debf1a06584fa10b1177ebb590e4654a30506f5538b0',
  'lesson-00:yu':'3eb015cd5a7a9c7955976e1d0acd6669126e7c5c74a1c928f7d7b9d925d98430',
  'lesson-00:ha':'5a3e5a6e172bb265c02149b84b725a46de61156c5bf2fe2c39c8b263e65969b5',
  'lesson-05:geu':'c7dee859df0d3dc4ac9b8fd0c5d37ac7588e07313004a93a802849a4989d0d58',
  'k0-consonant-contrast:ga':'705fc26ec549f1882f06eaeb997ba59f0ceef95e8c9603e5a7a82b35451205a9',
  'k0-consonant-contrast:ka':'7a4754d8c2583d1941a8f2d18bfd41239e4e753726af880fc3c0ea7dd2c697ed',
  'k0-consonant-contrast:kka':'c63080ad2e208b9f9319b806d2470143b7a2140cba4768c0cc61947cccf9e545',
  'k0-consonant-contrast:da':'37cabe6d05782f45ae49ebc5d2c76278cd3a3ac088ff433e50dd32d4b5619046',
  'k0-consonant-contrast:ta':'158b84180fc317e304ec0e15d50c2a2df6d9dbe6ca6abb690d2471e846f90be8',
  'k0-consonant-contrast:tta':'a027bee927746526b9f69b9b19ce552486fbc6ed2e3b8d9b6669a18f3413d7f0',
  'k0-consonant-contrast:ba':'128841a96d40fc42589b97a89d31ef637ed70108b588a025f8b9095b5449b95c',
  'k0-consonant-contrast:pa':'78b31bba7f20ebb379b9c5f92d9fb9da36debfd9bc17236af168c065392185ed',
  'k0-consonant-contrast:ppa':'53cd03ff44b7ee2f39432a62db06d48467ffca76cf843c77c2a1d58b54f07285',
  'k0-consonant-contrast:ja':'b65419728ffc7272ea4a93eee8566757688822081ebd031d1f8bd3fbfb2407d8',
  'k0-consonant-contrast:cha':'0b9f14ede1bb854d28493883e54bfc6b3aa39dceb6fafe2328cdb95696ab517d',
  'k0-consonant-contrast:jja':'9514e93678a8dfbae79af74bafa67c4f04314517c225a902da605f3ca8d824d2',
  'k0-consonant-contrast:sa':'dc102fb4fa65f0592055ca4751e47498c38ac8d33b344996bd99c8328b6d5f3b',
  'k0-consonant-contrast:ssa':'3c3b83fc317f12b936006c5fea2d5cd5966f7c5a1127883a4f0b86e6096ec381'
});

const newlyApproved = [
  'lesson-01:a','lesson-01:eo','lesson-01:o','lesson-01:u','lesson-01:ga','lesson-01:na','lesson-01:geo','lesson-01:go','lesson-01:gu','lesson-01:neo','lesson-01:no','lesson-01:nu',
  'lesson-02:eu','lesson-02:i','lesson-02:ae','lesson-02:e','lesson-02:da','lesson-02:di','lesson-02:ra','lesson-02:ma','lesson-02:mi','lesson-02:namu','lesson-02:dari','lesson-02:meori',
  'lesson-03:ya','lesson-03:yeo','lesson-03:ba','lesson-03:byeo','lesson-03:sa','lesson-03:syeo','lesson-03:a','lesson-03:bada','lesson-03:saram','lesson-03:annyeong','lesson-03:annyeonghaseyo','lesson-04:ba'
];
const blocked = Object.freeze({
  'lesson-02:ri':['리','syllable','4ae6b3043c36459b2fa056b491e602d0f604ec5d5a2a2af25179d33c1674fd15'],
  'lesson-04:mul':['물','batchim-example','e91c07306c8653afa232619ceb99ee85463adcf222d453cdcf25f461c5139350'],
  'lesson-04:bam':['밤','batchim-example','22b8e72ead44a345cb3bbffba048f96e449cb33a8a961973231b4979dff8125d'],
  'lesson-04:bang':['방','batchim-example','041510aac6c1cb82bcf379603246947ee1b5f138ee1accc64873ce981a4d5a1a'],
  'lesson-04:gamsahamnida':['감사합니다','sound-change','3f4979299330dbb45f03ce1b4c43e8ccd00bad3a836e965b682e2fdc43b0f57c']
});

assert.equal(new Set(newlyApproved).size, 36);
assert.equal(Object.keys(baselineApproved).length, 18);
assert.equal(Object.keys(audio.approvedAssetHashes).length, 54);
assert.equal(all.filter(entry => entry.reviewStatus === 'approved').length, 54);
assert.equal(all.filter(entry => audio.canPlayAudio(entry.speechText, entry, entry.audioType)).length, 54);

for (const [recordId, expectedSha] of Object.entries(baselineApproved)) {
  const entry = byId.get(recordId); assert.ok(entry, `Missing baseline approved ${recordId}`);
  assert.equal(entry.sha256, expectedSha, `${recordId} baseline SHA changed`);
  assert.equal(audio.approvedAssetHashes[recordId], expectedSha, `${recordId} approved hash changed`);
  const file = `audio/${entry.lessonId}/${entry.file}`;
  assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expectedSha, `${recordId} file SHA changed`);
}

for (const recordId of newlyApproved) {
  const entry = byId.get(recordId); assert.ok(entry, `Missing newly approved ${recordId}`);
  assert.equal(entry.reviewStatus, 'approved'); assert.equal(entry.assetStatus, 'available');
  assert.equal(entry.technicalValidation, 'passed'); assert.equal(entry.reviewMethod, 'product-owner-listening');
  assert.equal(entry.reviewedAt, '2026-07-21'); assert.equal(entry.nativeReviewStatus, 'deferred'); assert.equal(entry.nativeReviewer, null);
  assert.equal(entry.rightsReviewStatus, 'pending'); assert.equal(entry.commercialUseBasis, 'pending-documentation');
  assert.match(entry.sourceArtifact, /^repository-commit-[a-f0-9]{40}$/u); assert.ok(entry.sourceRunId);
  const file = `audio/${entry.lessonId}/${entry.file}`; const actualSha = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  assert.equal(entry.sha256, actualSha, `${recordId} SHA mismatch`); assert.equal(audio.approvedAssetHashes[recordId], actualSha);
  assert.equal(audio.canPlayAudio(entry.speechText, entry, entry.audioType), true);
  assert.equal(audio.canPlayAudio(`${entry.speechText} `, entry, entry.audioType), false);
  assert.equal(audio.canPlayAudio(entry.speechText, entry, `${entry.audioType}-wrong`), false);
}

for (const [recordId, [speechText, audioType, expectedSha]] of Object.entries(blocked)) {
  const entry = byId.get(recordId); assert.ok(entry, `Missing blocked ${recordId}`);
  assert.equal(entry.speechText, speechText); assert.equal(entry.audioType, audioType);
  assert.equal(entry.reviewStatus, 'pending'); assert.equal(entry.assetStatus, 'available');
  assert.equal(audio.canPlayAudio(speechText, entry, audioType), false); assert.equal(audio.approvedAssetHashes[recordId], undefined);
  const file = `audio/${entry.lessonId}/${entry.file}`;
  assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'), expectedSha, `${recordId} blocked file SHA changed`);
}

const lesson00 = fs.readFileSync('lesson-00.js', 'utf8');
assert.match(lesson00, /item\.demoAudio\?\.match\(\/\^audio\\\/\(lesson-/u);
assert.match(lesson00, /global\.NikigoAudio\.resolve\(speechText, audioType, lessonId\)/u);
assert.doesNotMatch(lesson00, /speechSynthesis|SpeechSynthesisUtterance|getVoices/u);
const engine = fs.readFileSync('lesson-engine.js', 'utf8');
assert.match(engine, /screenHasUnavailableAudio\(screens\[index\]\)/u);
assert.match(engine, /valueIsPlayable\(question\.audio\) \? '' : `<p class="testAudioDisclosure">/u);
assert.match(engine, /querySelector\('\[data-action="build"\]'\)/u);
assert.match(engine, /result && !valueIsPlayable\(result\)/u);
const lesson07 = fs.readFileSync('lesson-07.js', 'utf8');
assert.match(lesson07, /resolve\?\.\('바','syllable',LESSON_ID\)/u);
assert.match(lesson07, /data-action="base-audio"/u);

const worker = fs.readFileSync('sw.js', 'utf8');
for (const recordId of newlyApproved) {
  const entry = byId.get(recordId); assert.ok(worker.includes(`./audio/${entry.lessonId}/${entry.file}`), `Service Worker missing ${recordId}`);
}
for (const recordId of Object.keys(blocked)) {
  const entry = byId.get(recordId); assert.ok(!worker.includes(`./audio/${entry.lessonId}/${entry.file}`), `Service Worker cached blocked ${recordId}`);
}
assert.doesNotMatch(worker, /speechSynthesis|SpeechSynthesisUtterance|getVoices/u);

console.log('Validated exact 36-record product-owner approval, five fail-closed records, 54 total approved assets, original 18 SHA immutability, strict text/type matching, player mapping, and Service Worker isolation.');
