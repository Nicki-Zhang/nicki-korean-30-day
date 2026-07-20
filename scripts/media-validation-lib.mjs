import { createHash } from 'node:crypto';
import { readFile, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';

export function runMediaCommand(command,args,{timeoutMs=30000}={}) {
  const startedAt=new Date().toISOString();
  const result=spawnSync(command,args,{encoding:'utf8',timeout:timeoutMs,maxBuffer:8*1024*1024,shell:false});
  const timeout=result.error?.code==='ETIMEDOUT';
  return {
    command:[command,...args],startedAt,exitCode:result.status,signal:result.signal||null,timeout,
    stdout:result.stdout||'',stderr:result.stderr||'',
    spawnError:result.error?{code:result.error.code||null,message:result.error.message}:null
  };
}

export function commandFailure(label,result) {
  if(result.exitCode===0&&!result.spawnError&&!result.timeout) return null;
  const detail=result.spawnError?.message||result.stderr.trim()||`exitCode=${String(result.exitCode)}`;
  return `${label} failed: ${detail}`;
}

export async function fileEvidence(filePath) {
  const data=await readFile(filePath);
  const info=await stat(filePath);
  return {filePath,fileSize:info.size,sha256:createHash('sha256').update(data).digest('hex')};
}

export async function validateMediaFile(filePath,{ffprobePath='ffprobe',ffmpegPath='ffmpeg',timeoutMs=30000,minDuration=0.1,maxDuration=10}={}) {
  const evidence=await fileEvidence(filePath);
  const errors=[];
  if(!evidence.fileSize) errors.push('file is empty');
  const probeArgs=['-v','error','-show_entries','format=format_name,duration,bit_rate','-show_entries','stream=codec_name,codec_type,sample_rate,channels','-of','json',filePath];
  const probe=runMediaCommand(ffprobePath,probeArgs,{timeoutMs});
  const probeFailure=commandFailure('ffprobe metadata read',probe);
  let metadata=null;
  if(probeFailure) errors.push(probeFailure);
  else {
    try { metadata=JSON.parse(probe.stdout); }
    catch(error) { errors.push(`ffprobe returned invalid JSON: ${error.message}`); }
  }
  const streams=metadata?.streams||[];
  const audioStreams=streams.filter(stream=>stream.codec_type==='audio');
  const duration=Number(metadata?.format?.duration);
  if(metadata) {
    if(audioStreams.length!==1) errors.push(`expected exactly one audio stream, found ${audioStreams.length}`);
    if(streams.length!==1) errors.push(`expected no extra streams, found ${streams.length}`);
    if(audioStreams[0]?.codec_name!=='mp3') errors.push(`expected MP3 codec, found ${audioStreams[0]?.codec_name||'missing'}`);
    if(!String(metadata.format?.format_name||'').split(',').includes('mp3')) errors.push(`expected MP3 container, found ${metadata.format?.format_name||'missing'}`);
    if(!Number.isFinite(duration)||duration<minDuration||duration>maxDuration) errors.push(`duration ${String(duration)} is outside ${minDuration}-${maxDuration} seconds`);
    if(!Number(audioStreams[0]?.sample_rate)) errors.push('sample rate is missing');
    if(!Number(audioStreams[0]?.channels)) errors.push('channel count is missing');
  }
  const decodeArgs=['-v','error','-nostdin','-i',filePath,'-map','0:a:0','-f','null','-'];
  const decode=runMediaCommand(ffmpegPath,decodeArgs,{timeoutMs});
  const decodeFailure=commandFailure('ffmpeg full decode',decode);
  if(decodeFailure) errors.push(decodeFailure);
  return {
    ...evidence,mimeType:'audio/mpeg',metadata,
    technical:{duration:Number.isFinite(duration)?duration:null,codec:audioStreams[0]?.codec_name||null,sampleRate:Number(audioStreams[0]?.sample_rate)||null,channels:Number(audioStreams[0]?.channels)||null,bitRate:Number(metadata?.format?.bit_rate)||null},
    commands:{ffprobe:probe,ffmpegDecode:decode},fullDecodePassed:decode.exitCode===0&&!decode.spawnError&&!decode.timeout,
    status:errors.length?'failed':'passed',errors
  };
}
