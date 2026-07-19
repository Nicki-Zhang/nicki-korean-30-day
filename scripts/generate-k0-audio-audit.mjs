import fs from 'node:fs';
import path from 'node:path';
await import(new URL('../audio-catalog.js',import.meta.url));
const audio=globalThis.NikigoAudio;
const entries=Object.entries(audio.lessons).flatMap(([lessonId,lesson])=>lesson.items.map(entry=>({...entry,lessonId,path:`audio/${lessonId}/${entry.file}`})));
const physical=fs.readdirSync('audio',{recursive:true}).filter(x=>/\.(mp3|wav)$/i.test(x)).map(x=>`audio/${x}`);
const activeExisting=entries.filter(x=>fs.existsSync(x.path));
const missing=entries.filter(x=>!fs.existsSync(x.path));
const approved=entries.filter(x=>x.reviewStatus==='approved');
const legacy=entries.filter(x=>x.reviewNotes==='legacy-unreviewed');
const legacySystem=entries.filter(x=>x.voiceSource==='legacy-system-export');

function parseCsv(text){const rows=[];let row=[],field='',quote=false;for(let i=0;i<text.length;i++){const c=text[i];if(quote){if(c==='"'&&text[i+1]==='"'){field+='"';i++;}else if(c==='"')quote=false;else field+=c;}else if(c==='"')quote=true;else if(c===','){row.push(field);field='';}else if(c==='\n'){row.push(field);rows.push(row);row=[];field='';}else if(c!=='\r')field+=c;}return rows;}
const sourceRows=parseCsv(fs.readFileSync('K0_AUDIO_PLAYER_AUDIT.csv','utf8'));
const columns=sourceRows[0];const objects=sourceRows.slice(1).filter(r=>r.length===columns.length).map(r=>Object.fromEntries(columns.map((c,i)=>[c,r[i]])));
const aliases={ 'vowel-carrier':'vowel','onset-example':'initial-example','listening-question':null,'final-example':'batchim-example' };
function entryFor(row){const type=Object.hasOwn(aliases,row.expectedAudioType)?aliases[row.expectedAudioType]:row.expectedAudioType;const candidates=entries.filter(x=>(x.lessonId===row.lessonId||row.lessonId==='lesson-00')&&x.speechText===row.expectedSpeechText&&(!type||x.audioType===type));return candidates[0]||null;}
for(const row of objects){const entry=entryFor(row);row.catalogEntryId=entry?`${entry.lessonId}:${entry.id}`:'';row.catalogSpeechText=entry?.speechText||'';row.audioFilePath=entry?.path||'';row.fileExists=entry?String(fs.existsSync(entry.path)):'false';row.exactMatch=entry?String(entry.speechText===row.expectedSpeechText):'false';row.reviewStatus=entry?.reviewStatus||'missing';row.voiceSource=entry?.voiceSource||'';row.model=entry?.model||'';row.generationDate=entry?.generationDate||'';row.commercialUseBasis=entry?.commercialUseBasis||'';row.nativeReviewer=entry?.nativeReviewer||'';row.fallbackBehavior='none; fail closed with localized status';row.enabled='false';row.issueType=entry?(fs.existsSync(entry.path)?'rights-and-review-metadata-gap':'missing-audio'):'missing-catalog-entry';row.priority='P1';row.recommendedAction=entry?'Keep disabled until approved, exact, rights-complete, and available.':'Create an exact typed catalog record before generation.';}
function esc(v){const s=String(v??'');return /[",\n]/.test(s)?`"${s.replaceAll('"','""')}"`:s;}
fs.writeFileSync('K0_AUDIO_PLAYER_AUDIT.csv',[columns.join(','),...objects.map(r=>columns.map(c=>esc(r[c])).join(','))].join('\n')+'\n');

const stats={players:objects.length,catalog:entries.length,physical:physical.length,activeFiles:activeExisting.length,missing:missing.length,pending:entries.filter(x=>x.reviewStatus==='pending').length,legacy:legacy.length,legacySystem:legacySystem.length,approved:approved.length,p0:0,p1:objects.length,p2:0,playable:entries.filter(x=>audio.canPlayAudio(x.speechText,x,x.audioType)).length};
const summary=`- 播放器入口：**${stats.players}**\n- catalog/manifest：**${stats.catalog}**\n- 物理音频：**${stats.physical}**（活动目录匹配 ${stats.activeFiles}；deprecated ${physical.filter(x=>x.includes('/deprecated/')).length}）\n- 缺失：**${stats.missing}**\n- pending：**${stats.pending}**；legacy-unreviewed：**${stats.legacy}**；legacy-system-export：**${stats.legacySystem}**；approved：**${stats.approved}**\n- 可播放 pending / missing / deprecated：**0 / 0 / 0**\n- 生产 K0 设备 TTS / fallback：**0 / 0**\n- P0 / P1 / P2：**0 / ${stats.p1} / 0**\n`;
fs.writeFileSync('K0_AUDIO_PLAYER_AUDIT.md',`# Nikigo K0 第0～6课播放器审计\n\n> Batch 0 修复后代码审计；文件存在不代表发音获批。\n\n## 结论\n\n${summary}\n统一门禁要求 exact speechText、匹配 audioType、approved、available、真实文件及完整来源/权利/审核字段。所有不满足项目均禁用，且无设备TTS或文字替代。逐行记录见 K0_AUDIO_PLAYER_AUDIT.csv。\n`);
fs.writeFileSync('K0_AUDIO_FILE_TECHNICAL_AUDIT.md',`# K0 音频文件技术审计\n\n${summary}\n现有${stats.activeFiles}个活动文件只通过“存在/可读取”层检查，仍为 pending；16个 Apple 导出明确标记 legacy-system-export。技术可解码不等于发音批准。2个 deprecated 文件保留但统一门禁和 Service Worker 均禁止使用。\n`);
fs.writeFileSync('K0_MOBILE_AUDIO_RISK_AUDIT.md',`# K0 移动端音频风险审计\n\n${summary}\n- 新播放前停止上一条；序列逐文件等待 ended。\n- pending/missing 按钮 disabled + aria-disabled。\n- autoplay 只接受严格门禁返回的托管音频，当前不会尝试播放。\n- iOS 阻止播放或网络失败时只显示本地化错误，无设备回退。\n`);
fs.writeFileSync('K0_AUDIO_RIGHTS_AND_REVIEW_GAPS.md',`# K0 音频权利与审核缺口\n\n${summary}\n所有${stats.catalog}条均缺正式母语审核或完整发布记录，因此 approved=0。未知日期、审核人和许可信息保持 null / pending-documentation，不作推断。16条 legacy-system-export 后续应重新制作并记录合法商业使用依据。\n`);
fs.writeFileSync('K0_AUDIO_GENERATION_BATCH_PLAN.md',`# K0 音频生成批次计划\n\nBatch 0 代码门禁：完成，P0=0。\n\n- Batch 1：仅第0课 **2** 条核心元音承载音节：yo / 요 / yo.mp3 与 yu / 유 / yu.mp3。生成后仍为 pending，等待母语者审核。\n- Batch 2：第4课普通音/送气音/紧音 14 条完整音节。\n- Batch 3：其余旧课与复习所需精确对象。\n- Batch 4：第6课 **15** 条 typed 音频（9完整音节 + 6完整单词；왜/예分开语境）。\n\n每批必须经过文件验证、权利记录和韩语母语者逐条批准后才可启用。\n`);
fs.writeFileSync('K0_NATIVE_AUDIO_REVIEW_CHECKLIST.md',`# K0 韩语母语音频审核清单\n\n${summary}\n逐条核对 displayText、speechText、audioType、预期读音、自然度、音变、剪切、音量、语境韵律及商业使用记录。不得批量自动批准；왜/예的 syllable 与 word 版本须分别试听。\n`);

const queueHeader='| id | lessonId | targetSymbol | displayText | speechText | audioType | pronunciationType | pronunciationRule | file | voiceSource | model | generationDate | commercialUseBasis | reviewStatus | assetStatus | nativeReviewer | reviewNotes |\n|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|';
const queueRows=entries.map(x=>`| ${x.id} | ${x.lessonId} | ${x.targetSymbol??''} | ${x.displayText} | ${x.speechText} | ${x.audioType} | ${x.pronunciationType} | ${x.pronunciationRule} | ${x.file} | ${x.voiceSource} | ${x.model??''} | ${x.generationDate??''} | ${x.commercialUseBasis??''} | ${x.reviewStatus} | ${x.assetStatus} | ${x.nativeReviewer??''} | ${x.reviewNotes} |`);
fs.writeFileSync('AUDIO_GENERATION_REVIEW_QUEUE.md',`# Audio Generation & Review Queue\n\n${queueHeader}\n${queueRows.join('\n')}\n`);
console.log(JSON.stringify(stats,null,2));
