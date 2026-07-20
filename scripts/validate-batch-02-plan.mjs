import assert from 'node:assert/strict';
import fs from 'node:fs';

await import(new URL('../audio-catalog.js',import.meta.url));
const audio=globalThis.NikigoAudio;
const config=JSON.parse(fs.readFileSync('audio-batches.json','utf8'));
const original=config.planningOnly['audio-batch-02-original'];
const batch2a=config.batches['audio-batch-02a'];
const batch2b=config.planningOnly['audio-batch-02b'];
const originalExpected=[
  ['ga','가','initial-example','ga.mp3'],['ka','카','initial-example','ka.mp3'],['kka','까','initial-example','kka.mp3'],
  ['da','다','initial-example','da.mp3'],['ta','타','initial-example','ta.mp3'],['tta','따','initial-example','tta.mp3'],
  ['ba','바','initial-example','ba.mp3'],['pa','파','initial-example','pa.mp3'],['ppa','빠','initial-example','ppa.mp3'],
  ['ja','자','initial-example','ja.mp3'],['cha','차','initial-example','cha.mp3'],['jja','짜','initial-example','jja.mp3'],
  ['sa','사','initial-example','sa.mp3'],['ssa','싸','initial-example','ssa.mp3'],
  ['ha','하','initial-example','ha.mp3'],['geu','그','syllable','geu.mp3']
];
assert.equal(original.expectedCount,16);assert.deepEqual(original.items,originalExpected);
assert.deepEqual(batch2a.items,originalExpected.slice(0,3).map(([id,speechText,audioType,outputFile])=>({id,speechText,audioType,outputFile})));
assert.equal(batch2b.status,'planning-only');assert.equal(config.batches['audio-batch-02b'],undefined);
assert.deepEqual(batch2b.items,originalExpected.slice(3));

const contrast=audio.lessons['k0-consonant-contrast'].items;
assert.deepEqual(contrast.map(x=>[x.id,x.speechText,x.audioType,x.file]),originalExpected.slice(0,14));
assert.ok(contrast.every(x=>x.reviewStatus==='pending'&&x.assetStatus==='missing'));
assert.ok(batch2a.items.every(allowed=>contrast.some(item=>item.id===allowed.id&&item.speechText===allowed.speechText&&item.audioType===allowed.audioType&&item.file===allowed.outputFile)));

const all=Object.values(audio.lessons).flatMap(lesson=>lesson.items);
assert.equal(all.length,77);assert.equal(all.filter(x=>x.reviewStatus==='approved'&&x.assetStatus==='available').length,2);
assert.ok(all.filter(x=>!['yo','yu'].includes(x.id)||x.lessonId!=='lesson-00').every(x=>x.reviewStatus==='pending'));
assert.equal(all.some(x=>x.speechText==='하'&&x.audioType==='initial-example'),false,'하 remains a documented formal-catalog gap.');
assert.equal(all.some(x=>x.speechText==='그'&&x.audioType==='syllable'),false,'그 remains a documented formal-catalog gap.');
assert.match(fs.readFileSync('hangul-sound-data.js','utf8'),/consonant\('ㅎ',[^\n]*'하'/u);
assert.match(fs.readFileSync('lesson-05.js','utf8'),/\['ㄱ','ㅡ','그'\]/u);
const audit=fs.readFileSync('K0_AUDIO_PLAYER_AUDIT.csv','utf8');
assert.match(audit,/lesson05-top-examples-2[^\n]*听示例音节 그[^\n]*missing-catalog-entry/u);
assert.match(fs.readFileSync('K0_AUDIO_GENERATION_BATCH_PLAN.md','utf8'),/历史基线 `5fe8fb1`[\s\S]*하[\s\S]*그[\s\S]*禁止生成/u);
console.log('Validated the historical 16-item Batch 2 scope, exact 3-item Batch 2A allowlist, 13-item planning-only Batch 2B, formal pending/missing state, and explicit 하/그 catalog gaps.');
