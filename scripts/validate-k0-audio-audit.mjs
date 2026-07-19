import assert from 'node:assert/strict';
import fs from 'node:fs';

const requiredReports = [
  'K0_AUDIO_PLAYER_AUDIT.csv','K0_AUDIO_PLAYER_AUDIT.md','K0_AUDIO_FILE_TECHNICAL_AUDIT.md',
  'K0_MOBILE_AUDIO_RISK_AUDIT.md','K0_AUDIO_RIGHTS_AND_REVIEW_GAPS.md',
  'K0_AUDIO_GENERATION_BATCH_PLAN.md','K0_NATIVE_AUDIO_REVIEW_CHECKLIST.md'
];
for (const file of requiredReports) assert.ok(fs.existsSync(file) && fs.statSync(file).size > 500, `${file} missing or unexpectedly small`);

function parseCsv(source) {
  const records=[]; let row=[],field='',quoted=false;
  for(let i=0;i<source.length;i++){const ch=source[i];if(quoted){if(ch==='"'&&source[i+1]==='"'){field+='"';i++;}else if(ch==='"')quoted=false;else field+=ch;}else if(ch==='"')quoted=true;else if(ch===','){row.push(field);field='';}else if(ch==='\n'){row.push(field);records.push(row);row=[];field='';}else if(ch!=='\r')field+=ch;}
  return records.filter(x=>x.length>1);
}
const records=parseCsv(fs.readFileSync('K0_AUDIO_PLAYER_AUDIT.csv','utf8'));
const headers=records.shift(); const rows=records.map(values=>Object.fromEntries(headers.map((h,i)=>[h,values[i]||''])));
const required=['lessonId','pageFile','screenId','controlId','buttonText','expectedSpeechText','expectedAudioType','fallbackBehavior','issueType','priority'];
for(const field of required)assert.ok(headers.includes(field),`audit missing ${field}`);
assert.ok(rows.length>100,'audit row count is implausibly low');
assert.equal(new Set(rows.map(x=>x.controlId)).size,rows.length,'controlId must be unique for every audited playback entry');
const allowed=new Set(['letter-name','vowel-carrier','initial-example','syllable','word','sentence','dialogue-line','listening-question']);
for(const row of rows){assert.ok(row.expectedSpeechText,`${row.controlId} has empty speechText`);assert.ok(allowed.has(row.expectedAudioType),`${row.controlId} has invalid audioType ${row.expectedAudioType}`);}

for(const lesson of ['lesson-00','lesson-01','lesson-02','lesson-03','k0-consonant-contrast','lesson-05','lesson-06','lesson-04'])assert.ok(rows.some(x=>x.lessonId===lesson),`${lesson} has no audit rows`);
assert.ok(rows.some(x=>x.pageFile==='review.html'),'review listening controls were omitted');
assert.ok(rows.some(x=>x.screenId.includes('retry')),'retry controls were omitted');
assert.ok(rows.some(x=>x.screenId.includes('answered-replay')),'answered replay controls were omitted');
const expectedPageCounts=new Map([
  ['lesson-00|lesson-00.html',59],['lesson-01|lesson-01.html',22],['lesson-02|lesson-02.html',24],
  ['lesson-03|lesson-03.html',22],['lesson-04|lesson-04.html',23],
  ['k0-consonant-contrast|lesson-consonant-contrast.html',37],['lesson-05|lesson-05.html',9],
  ['lesson-06|lesson-06.html',21],['lesson-01|review.html',5],['lesson-02|review.html',4],
  ['lesson-03|review.html',4],['lesson-04|review.html',5]
]);
const actualPageCounts=new Map();for(const row of rows){const key=`${row.lessonId}|${row.pageFile}`;actualPageCounts.set(key,(actualPageCounts.get(key)||0)+1);}
assert.deepEqual([...actualPageCounts].sort(),[...expectedPageCounts].sort(),'playback-control inventory count drifted from the audited page model');

const sources=['lesson-00.js','lesson-engine.js','lesson-consonant-contrast.js','review.html'].map(file=>fs.readFileSync(file,'utf8')).join('\n');
assert.match(sources,/speechSynthesis|SpeechSynthesisUtterance/,'known device TTS P0 disappeared without updating the audit');
assert.ok(rows.some(x=>x.issueType==='forbidden-device-tts-fallback'),'device TTS must be explicitly reported as P0');
const lesson6Queue=new Set(['와','왜','외','워','웨','위','의','얘','예','뭐','과자','여우','의자']);
assert.ok(rows.filter(x=>x.lessonId==='lesson-06'&&lesson6Queue.has(x.expectedSpeechText)).every(x=>x.reviewStatus==='pending'&&x.fileExists==='false'),'Lesson 6 queue controls must remain pending and file-free');
assert.ok(rows.filter(x=>x.lessonId==='lesson-06').every(x=>x.enabled==='false'),'Every Lesson 6 audio control must remain disabled');
assert.ok(rows.filter(x=>x.lessonId==='lesson-06').every(x=>x.fallbackBehavior.includes('none')),'Lesson 6 must have no fallback');
assert.ok(rows.filter(x=>x.challengeOrLearning==='challenge').every(x=>x.beforeAnswerHidden==='true'),'challenge transcript privacy must be recorded');

for(const file of ['lesson-00.js','lesson-01.html','lesson-02.html','lesson-03.html','lesson-consonant-contrast.js','lesson-05.js','lesson-06.js','review.html'])assert.doesNotMatch(fs.readFileSync(file,'utf8'),/>\s*undefined\s*</i,`${file} contains visible undefined text`);
const audioFiles=fs.readdirSync('audio',{recursive:true}).filter(x=>/\.(?:mp3|wav)$/i.test(x));assert.equal(audioFiles.length,new Set(audioFiles.map(x=>x.toLowerCase())).size,'case-conflicting audio paths');
const worker=fs.readFileSync('sw.js','utf8');assert.match(worker,/fetch\(event\.request\)/,'Service Worker must use network-first audio-safe fetch strategy');assert.match(worker,/cache\.put\(event\.request/,'Service Worker runtime cache strategy missing');

const manifests=fs.readdirSync('audio').map(dir=>`audio/${dir}/manifest.json`).filter(fs.existsSync);
const pathSpeech=new Map();
for(const file of manifests){const manifest=JSON.parse(fs.readFileSync(file,'utf8'));for(const item of manifest.items||[]){assert.ok(item.speechText,`${file}/${item.id} empty speechText`);assert.ok(item.reviewStatus,`${file}/${item.id} missing reviewStatus`);const target=`audio/${manifest.lesson}/${item.file}`;if(item.reviewStatus==='approved')assert.ok(fs.existsSync(target),`approved file missing: ${target}`);if(pathSpeech.has(target))assert.equal(pathSpeech.get(target),item.speechText,`${target} maps to multiple speechText values`);pathSpeech.set(target,item.speechText);}}

const generationPlan=fs.readFileSync('K0_AUDIO_GENERATION_BATCH_PLAN.md','utf8');
for(const count of [...generationPlan.matchAll(/条数：\*\*(\d+)\*\*/g)].map(x=>Number(x[1])))assert.ok(count<=20,`generation batch exceeds 20: ${count}`);
for(const term of ['OPENAI_API_KEY','sk-','TELEGRAM_BOT_TOKEN','TELEGRAM_CHAT_ID'])for(const file of requiredReports)assert.ok(!fs.readFileSync(file,'utf8').includes(term),`${file} contains a sensitive identifier`);

console.log(`Validated ${rows.length} audited player entries, strict audio types, challenge privacy records, pending Lesson 6 gates, manifest path uniqueness, runtime cache strategy, and batches capped at 20.`);
