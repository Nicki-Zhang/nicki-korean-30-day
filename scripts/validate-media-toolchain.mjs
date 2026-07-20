import { readFile } from 'node:fs/promises';
import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs,writeJson } from './audio-batch-lib.mjs';
import { commandFailure,fileEvidence,runMediaCommand,validateMediaFile } from './media-validation-lib.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=parseArgs(process.argv.slice(2));
const ffmpegPath=resolve(String(args.ffmpeg||''));
const ffprobePath=resolve(String(args.ffprobe||''));
const reportPath=resolve(String(args.report||'staging/media-toolchain-preflight.json'));
if(!args.ffmpeg||!args.ffprobe) throw new Error('--ffmpeg and --ffprobe are required.');
const config=JSON.parse(await readFile(resolve(root,'media-toolchain.json'),'utf8'));
const fixturePath=resolve(root,String(args.fixture||config.fixture.file));
const report={status:'failed',expectedVersion:config.ffmpegVersion,checkedAt:new Date().toISOString(),tools:{},fixture:null,errors:[]};
try {
  for(const [name,binary] of [['ffmpeg',ffmpegPath],['ffprobe',ffprobePath]]) {
    const version=runMediaCommand(binary,['-version']);
    report.tools[name]=version;
    const failure=commandFailure(`${name} version check`,version);
    if(failure) report.errors.push(failure);
    else if(!version.stdout.startsWith(`${name} version ${config.ffmpegVersion}`)) report.errors.push(`${name} version is not fixed at ${config.ffmpegVersion}.`);
  }
  const fixtureEvidence=await fileEvidence(fixturePath);
  if(fixtureEvidence.sha256!==config.fixture.sha256) report.errors.push(`Fixture SHA-256 mismatch: ${fixtureEvidence.sha256}`);
  report.fixture=await validateMediaFile(fixturePath,{ffmpegPath,ffprobePath});
  report.errors.push(...report.fixture.errors);
  if(report.errors.length) throw new Error(report.errors.join(' | '));
  report.status='passed';
} catch(error) {
  if(!report.errors.includes(error.message)) report.errors.push(error.message);
  await writeJson(reportPath,report);
  throw error;
}
await writeJson(reportPath,report);
console.log(`Validated fixed FFmpeg ${config.ffmpegVersion} toolchain and repository audio fixture.`);
