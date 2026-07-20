import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-media-validation-'));
const ffprobe=path.join(temp,'ffprobe-mock');
const ffmpeg=path.join(temp,'ffmpeg-mock');
const secretName=['OPENAI','API','KEY'].join('_');
const secretMarker='MUST_NOT_BE_READ_BY_VALIDATION_ONLY';
const run=(script,args,env={})=>spawnSync(process.execPath,[path.join(root,'scripts',script),...args],{cwd:root,encoding:'utf8',env:{...process.env,...env}});
const sha=data=>createHash('sha256').update(data).digest('hex');

const probeSource=`#!/usr/bin/env node
const fs=require('fs'),path=require('path'),args=process.argv.slice(2);
if(args[0]==='-version'){console.log('ffprobe version 6.1 fixture');process.exit(0)}
const file=args[args.length-1],data=fs.readFileSync(file,'utf8');
if(data.includes('PROBE_FAIL')){console.error('mock ffprobe stderr: invalid media');process.exit(7)}
const duration=path.basename(file)==='yu.mp3'?1.608:0.912;
console.log(JSON.stringify({streams:[{codec_name:'mp3',codec_type:'audio',sample_rate:'24000',channels:1}],format:{format_name:'mp3',duration:String(duration),bit_rate:'128000'}}));
`;
const ffmpegSource=`#!/usr/bin/env node
const fs=require('fs'),args=process.argv.slice(2);
if(args[0]==='-version'){console.log('ffmpeg version 6.1 fixture');process.exit(0)}
const index=args.indexOf('-i'),file=args[index+1],data=fs.readFileSync(file,'utf8');
if(data.includes('DECODE_FAIL')||data.includes('TRUNCATED')){console.error('mock ffmpeg stderr: decode failed at end of file');process.exit(8)}
process.exit(0);
`;
fs.writeFileSync(ffprobe,probeSource,{mode:0o755});fs.writeFileSync(ffmpeg,ffmpegSource,{mode:0o755});

function makeSource(name,{yo='YO_VALID_AUDIO',yu='YU_VALID_AUDIO',extra=false}={}) {
  const dir=path.join(temp,name);fs.mkdirSync(path.join(dir,'files'),{recursive:true});
  fs.writeFileSync(path.join(dir,'files/yo.mp3'),yo);fs.writeFileSync(path.join(dir,'files/yu.mp3'),yu);
  if(extra) fs.writeFileSync(path.join(dir,'files/extra.mp3'),'EXTRA');
  fs.writeFileSync(path.join(dir,'preflight-report.json'),'{}\n');fs.writeFileSync(path.join(dir,'artifact-manifest.json'),'{}\n');
  fs.writeFileSync(path.join(dir,'generation-report.json'),JSON.stringify({workflowRunId:'1234567',batchId:'audio-batch-01',expectedCount:2,generatedCount:2,apiRequestCount:2,status:'completed',items:[{id:'yo',speechText:'요',stagedFile:'files/yo.mp3'},{id:'yu',speechText:'유',stagedFile:'files/yu.mp3'}]},null,2));
  return {dir,expected:`yo.mp3=${sha(Buffer.from(yo))},yu.mp3=${sha(Buffer.from(yu))}`};
}

function validationArgs(source,output,expected=source.expected) {
  return ['--source-run-id','1234567','--source-artifact-name','nikigo-audio-batch-01-run-1234567-deadbee','--batch-id','audio-batch-01','--expected-count','2','--expected-sha256',expected,'--source-dir',source.dir,'--output-dir',output,'--ffmpeg',ffmpeg,'--ffprobe',ffprobe];
}

try {
  const workflow=fs.readFileSync(path.join(root,'.github/workflows/generate-lesson-audio.yml'),'utf8');
  const validationJob=workflow.split('\n  validate-existing-audio:')[1]||'';
  assert.match(validationJob,/if: inputs\.mode == 'validation-only'/);
  assert.match(validationJob,/actions\/download-artifact@v4/);
  assert.match(validationJob,/run-id: \$\{\{ inputs\.sourceRunId \}\}/);
  assert.match(validationJob,/Upload validation report and unchanged source audio[\s\S]*if:\s*always\(\)/);
  assert.doesNotMatch(validationJob,/OPENAI_API_KEY|generate-lesson-audio\.mjs|api\.openai\.com|mode generate/);
  assert.doesNotMatch(workflow,/retry|max-attempts/);
  assert.match(workflow,/Install fixed FFmpeg 6\.1 toolchain[\s\S]*Verify ffmpeg, ffprobe and repository fixture before any generation[\s\S]*Generate paid audio into staging/);
  assert.match(workflow,/command -v "\$NIKIGO_FFMPEG"/);assert.match(workflow,/command -v "\$NIKIGO_FFPROBE"/);
  assert.doesNotMatch(workflow,/env:[\s\S]{0,500}\$\{\{ runner\.temp \}\}/,'job-level env must not use unavailable runner context');

  const toolchain=JSON.parse(fs.readFileSync(path.join(root,'media-toolchain.json'),'utf8'));
  assert.equal(toolchain.ffmpegVersion,'6.1');assert.match(toolchain.downloadUrl,/^https:\/\/github\.com\//);assert.match(toolchain.archiveSha256,/^[a-f0-9]{64}$/);
  const installer=fs.readFileSync(path.join(root,'scripts/install-media-toolchain.mjs'),'utf8');
  assert.doesNotMatch(installer,/api\.openai|OPENAI_API_KEY|retry/i);
  const fakeArchive=path.join(temp,'wrong-toolchain.tar.gz');fs.writeFileSync(fakeArchive,'not the reviewed archive');
  const installReport=path.join(temp,'install-report.json');
  let result=run('install-media-toolchain.mjs',['--destination',path.join(temp,'toolchain'),'--archive',fakeArchive,'--report',installReport]);
  assert.notEqual(result.status,0);assert.match(fs.readFileSync(installReport,'utf8'),/SHA-256 mismatch/);

  const good=makeSource('good');const goodOutput=path.join(temp,'good-output');
  result=run('validate-existing-audio.mjs',validationArgs(good,goodOutput),{[secretName]:secretMarker});
  assert.equal(result.status,0,result.stderr);
  const report=JSON.parse(fs.readFileSync(path.join(goodOutput,'validation-report.json'),'utf8'));
  assert.equal(report.status,'passed');assert.equal(report.apiRequestCount,0);assert.equal(report.generatedCount,2);assert.equal(report.items.length,2);
  assert.ok(report.items.every(item=>item.fullDecodePassed&&item.commands.ffprobe.stderr===''&&item.commands.ffmpegDecode.exitCode===0));
  assert.doesNotMatch(JSON.stringify(report),new RegExp(`${secretMarker}|OPENAI_API_KEY|Authorization`));
  assert.deepEqual(fs.readdirSync(path.join(goodOutput,'files')).sort(),['yo.mp3','yu.mp3']);
  assert.equal(fs.readFileSync(path.join(goodOutput,'files/yo.mp3'),'utf8'),'YO_VALID_AUDIO');
  assert.equal(JSON.parse(fs.readFileSync(path.join(goodOutput,'human-listening-checklist.json'))).status,'awaiting-native-review');

  const missingFfmpegReport=path.join(temp,'missing-ffmpeg.json');
  result=run('validate-media-toolchain.mjs',['--ffmpeg',path.join(temp,'missing-ffmpeg'),'--ffprobe',ffprobe,'--report',missingFfmpegReport]);
  assert.notEqual(result.status,0);assert.match(fs.readFileSync(missingFfmpegReport,'utf8'),/ENOENT|no such file/i);
  const missingFfprobeReport=path.join(temp,'missing-ffprobe.json');
  result=run('validate-media-toolchain.mjs',['--ffmpeg',ffmpeg,'--ffprobe',path.join(temp,'missing-ffprobe'),'--report',missingFfprobeReport]);
  assert.notEqual(result.status,0);assert.match(fs.readFileSync(missingFfprobeReport,'utf8'),/ENOENT|no such file/i);

  const probeFail=makeSource('probe-fail',{yo:'PROBE_FAIL'});const probeOutput=path.join(temp,'probe-output');
  result=run('validate-existing-audio.mjs',validationArgs(probeFail,probeOutput));assert.notEqual(result.status,0);
  const probeReport=fs.readFileSync(path.join(probeOutput,'validation-report.json'),'utf8');assert.match(probeReport,/mock ffprobe stderr: invalid media/);assert.match(probeReport,/"exitCode": 7/);
  const decodeFail=makeSource('decode-fail',{yu:'DECODE_FAIL'});const decodeOutput=path.join(temp,'decode-output');
  result=run('validate-existing-audio.mjs',validationArgs(decodeFail,decodeOutput));assert.notEqual(result.status,0);
  const decodeReport=fs.readFileSync(path.join(decodeOutput,'validation-report.json'),'utf8');assert.match(decodeReport,/mock ffmpeg stderr: decode failed/);assert.match(decodeReport,/"exitCode": 8/);
  const truncated=makeSource('truncated',{yo:'TRUNCATED'});const truncatedOutput=path.join(temp,'truncated-output');
  result=run('validate-existing-audio.mjs',validationArgs(truncated,truncatedOutput));assert.notEqual(result.status,0);assert.match(fs.readFileSync(path.join(truncatedOutput,'validation-report.json'),'utf8'),/decode failed at end of file/);

  const shaOutput=path.join(temp,'sha-output');result=run('validate-existing-audio.mjs',validationArgs(good,shaOutput,`yo.mp3=${'0'.repeat(64)},yu.mp3=${good.expected.split('yu.mp3=')[1]}`));assert.notEqual(result.status,0);assert.match(fs.readFileSync(path.join(shaOutput,'validation-report.json'),'utf8'),/SHA-256 mismatch/);
  const extra=makeSource('extra',{extra:true});const extraOutput=path.join(temp,'extra-output');result=run('validate-existing-audio.mjs',validationArgs(extra,extraOutput));assert.notEqual(result.status,0);assert.match(fs.readFileSync(path.join(extraOutput,'validation-report.json'),'utf8'),/extra\.mp3/);
  const missingOutput=path.join(temp,'missing-output');result=run('validate-existing-audio.mjs',validationArgs({dir:path.join(temp,'artifact-missing'),expected:good.expected},missingOutput));assert.notEqual(result.status,0);assert.ok(fs.existsSync(path.join(missingOutput,'validation-report.json')));

  const requestBase=['--source-artifact-name','nikigo-audio-batch-01-run-1234567-deadbee','--batch-id','audio-batch-01','--expected-count','2','--expected-sha256',good.expected];
  result=run('preflight-audio-validation.mjs',['--source-run-id','not-a-run',...requestBase,'--report',path.join(temp,'invalid-run.json')]);assert.notEqual(result.status,0);assert.match(fs.readFileSync(path.join(temp,'invalid-run.json'),'utf8'),/decimal digits only/);
  result=run('preflight-audio-validation.mjs',['--source-run-id','1234567','--source-artifact-name','nikigo-audio-batch-01-run-1234567-deadbee','--batch-id','audio-batch-01','--expected-count','1','--expected-sha256',`yo.mp3=${'0'.repeat(64)}`,'--report',path.join(temp,'wrong-count.json')]);assert.notEqual(result.status,0);assert.match(fs.readFileSync(path.join(temp,'wrong-count.json'),'utf8'),/allowlist count/);

  const formal=JSON.parse(fs.readFileSync(path.join(root,'audio/lesson-00/manifest.json'),'utf8'));
  assert.ok(formal.items.filter(item=>['yo','yu'].includes(item.id)).every(item=>item.reviewStatus==='approved'&&item.assetStatus==='available'&&item.technicalValidation==='passed'));
  assert.doesNotMatch(fs.readFileSync(path.join(root,'audio-catalog.js'),'utf8'),/staging\//);
  console.log('Validated fixed media toolchain contracts, detailed ffprobe/ffmpeg evidence, validation-only isolation, SHA/count/artifact guards, corruption failures, and approved Batch 1 formal state.');
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
