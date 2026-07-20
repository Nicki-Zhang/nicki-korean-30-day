import fs from 'node:fs';
import { mkdir,readFile,writeFile,chmod } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { dirname,resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { parseArgs,writeJson } from './audio-batch-lib.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const args=parseArgs(process.argv.slice(2));
const destination=resolve(String(args.destination||''));
const reportPath=resolve(String(args.report||resolve(destination,'toolchain-install-report.json')));
if(!args.destination) throw new Error('--destination is required.');
const config=JSON.parse(await readFile(resolve(root,'media-toolchain.json'),'utf8'));
if(config.schemaVersion!==1||!/^https:\/\/github\.com\//u.test(config.downloadUrl)) throw new Error('Media toolchain must use the reviewed GitHub release URL.');
await mkdir(destination,{recursive:true});
const archive=resolve(destination,config.assetName);
const report={version:config.ffmpegVersion,source:config.downloadUrl,expectedSha256:config.archiveSha256,status:'failed',downloadedAt:new Date().toISOString(),errors:[]};
try {
  if(args.archive) {
    fs.copyFileSync(resolve(String(args.archive)),archive);
  } else {
    const response=await fetch(config.downloadUrl,{redirect:'follow'});
    if(!response.ok) throw new Error(`Toolchain download failed: HTTP ${response.status}`);
    await writeFile(archive,Buffer.from(await response.arrayBuffer()));
  }
  const actual=createHash('sha256').update(await readFile(archive)).digest('hex');
  report.actualSha256=actual;
  if(actual!==config.archiveSha256) throw new Error(`Toolchain SHA-256 mismatch: ${actual}`);
  const extract=spawnSync('tar',['-xzf',archive,'-C',destination],{encoding:'utf8',shell:false});
  report.extract={exitCode:extract.status,signal:extract.signal||null,stdout:extract.stdout||'',stderr:extract.stderr||'',spawnError:extract.error?.message||null};
  if(extract.status!==0||extract.error) throw new Error(`Toolchain extraction failed: ${extract.error?.message||extract.stderr||extract.status}`);
  for(const binary of ['ffmpeg','ffprobe']) await chmod(resolve(destination,binary),0o755);
  report.binaries={ffmpeg:resolve(destination,'ffmpeg'),ffprobe:resolve(destination,'ffprobe')};
  report.status='installed';
} catch(error) {
  report.errors.push(error.message);
  await writeJson(reportPath,report);
  throw error;
}
await writeJson(reportPath,report);
console.log(`Installed fixed FFmpeg ${config.ffmpegVersion} toolchain from verified GitHub release asset.`);
