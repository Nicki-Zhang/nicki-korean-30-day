import { writeFile } from 'node:fs/promises';

await import(new URL('../audio-catalog.js', import.meta.url));
const lessons = globalThis.NikigoAudio.lessons;

function finding(lessonId, entry) {
  if (lessonId === 'lesson-01' && ['ga', 'na'].includes(entry.id)) return ['是，旧跟读音频把多个音节合并为一个 TTS 请求（已修复）', '改为逐条播放独立音频；旧 ga-na.mp3 已废弃'];
  if (lessonId === 'lesson-02' && ['namu', 'dari', 'meori'].includes(entry.id)) return ['是，旧跟读音频把多个单词合并为一个 TTS 请求（已修复）', '改为逐条播放独立单词音频；旧 words.mp3 已废弃'];
  if (entry.voiceSource === 'apple-system-ko-KR-yuna') return ['是，原先缺少独立文件或映射到不存在的文件（已修复）', '新增带 v2 文件名的独立韩语系统语音；保持 pending'];
  return ['代码未发现映射错误；实际发音仍待试听', '统一结构并保留现有独立文件；保持 pending'];
}

const rows = [];
const regenerated = [];
for (const [lessonId, lesson] of Object.entries(lessons)) {
  for (const entry of lesson.items) {
    const [issue, fix] = finding(lessonId, entry);
    rows.push(`| ${lessonId} | ${entry.screen} | ${entry.displayText} | ${entry.teachingGoal} | ${entry.speechText} | audio/${lessonId}/${entry.file} | ${entry.speechText} | ${entry.speechText} | ${entry.expectedPronunciation} | ${entry.pronunciationType} | ${issue} | ${fix} | 是（${entry.reviewStatus}） |`);
    if (entry.voiceSource === 'apple-system-ko-KR-yuna') regenerated.push(`- \`audio/${lessonId}/${entry.file}\` ← \`${entry.speechText}\`（pending）`);
  }
}

const markdown = `# Nikigo 全课程韩语发音审计\n\n` +
`> 审计状态：代码链路已修复；实际发音尚未被韩语母语者批准。所有活动音频均为 \`pending\`。\n\n` +
`## 根因摘要\n\n` +
`1. 第 1、2 课的跟读页曾把多个音节或单词用标点拼成一次 TTS 请求，无法逐条校验，也违反独立生成原则。\n` +
`2. 第 1 课的部分拼音节结果没有静态文件，只能隐式依赖设备 fallback，未纳入 manifest。\n` +
`3. 第 4 课 HTML 指向 9 个 MP3，但本地目录只有 manifest，没有对应文件；按钮实际落入设备语音，映射与文件状态不一致。\n` +
`4. 旧 manifest 只有 \`text\`，没有页面文字、预期读音、音变规则和审核状态，生成成功无法代表发音正确。\n` +
`5. 旧服务工作线程缓存名没有覆盖本次声音修复；同名覆盖可能继续播放旧文件。\n\n` +
`## 全课程音频审计表\n\n` +
`| lesson | screen/page | 页面显示内容 | 教学目标 | 当前传给播放函数的值 | 当前音频文件路径 | 当前 TTS 生成文本 | 应当播放的韩语内容 | 预期实际读音 | 发音类型 | 是否存在错误 | 修改方案 | 是否需要韩语母语者审核 |\n` +
`|---|---|---|---|---|---|---|---|---|---|---|---|---|\n${rows.join('\n')}\n\n` +
`## 已废弃音频\n\n- \`audio/deprecated/lesson-01-ga-na.mp3\`：旧的“가. 나.”合并请求。\n- \`audio/deprecated/lesson-02-words.mp3\`：旧的“나무. 다리. 머리.”合并请求。\n\n` +
`## 已废弃但从未存在于本地的旧映射\n\n- 第 4 课旧映射 \`san.mp3\`、\`mom.mp3\`、\`gong.mp3\`、\`mul.mp3\`、\`ban.mp3\`、\`bam.mp3\`、\`bang.mp3\`、\`bal.mp3\`、\`gamsahamnida.mp3\` 在审计时均不存在，现已全部替换为版本化文件。\n\n` +
`## 本次重新生成或新增的音频\n\n${regenerated.join('\n')}\n\n` +
`## 证据限制\n\n- 用户提供的录屏路径在审计时不存在，因此没有把无法取得的录屏内容当作发音结论。\n- 自动检查只证明结构、映射、文件存在性、缓存版本和 fallback 规则正确，不证明声音达到母语者标准。\n\n` +
`## 人工审核规则\n\n- \`pending\`：只能表示文件、映射和元数据通过自动检查，不能表示发音正确。\n- \`approved\`：必须记录韩语母语者试听结论后才能设置。\n- 音变项目（当前为 \`감사합니다 → 감사함니다\`）需优先审核自然连读与语调。\n- 若未来使用真人录音，必须填写 voiceTalent、consentRecord、commercialUseRecord。\n`;

await writeFile('AUDIO_AUDIT.md', markdown);
console.log(`Generated AUDIO_AUDIT.md with ${rows.length} audit rows.`);
