# Nikigo 全课程韩语发音审计

> 审计状态：代码链路已修复；Batch 1 的 요、유及 Batch 2A 的 가、카、까已完成技术验证、产品负责人试听和正式接入。其余 72 条音频仍为 `pending`；母语者审核为可选发布前抽检。

## 已批准并接入的 Batch 2A

| lesson | 页面 | 显示内容 | 播放内容 | 正式文件 | 类型 | 审核 | 权利复核 |
|---|---|---|---|---|---|---|---|
| k0-consonant-contrast | 第0课示例、第4课对比与听辨 | ㄱ / 가 / 普通音 | 가 | `audio/k0-consonant-contrast/ga.mp3` | `initial-example` | 产品负责人试听通过；技术验证通过 | pending |
| k0-consonant-contrast | 第0课示例、第4课对比与听辨 | ㅋ / 카 / 送气音 | 카 | `audio/k0-consonant-contrast/ka.mp3` | `initial-example` | 产品负责人试听通过；技术验证通过 | pending |
| k0-consonant-contrast | 第0课示例、第4课对比与听辨 | ㄲ / 까 / 紧音 | 까 | `audio/k0-consonant-contrast/kka.mp3` | `initial-example` | 产品负责人试听通过；技术验证通过 | pending |

三条音频采用相同的确定性静音裁剪和线性增益对齐；输入/输出 SHA、裁剪量、增益和前后声学参数见 `audio/k0-consonant-contrast/postprocessing-report.json`。未使用降噪、压缩、变速、变调、设备 TTS 或文字 fallback。

## 根因摘要

1. 第 1、2 课的跟读页曾把多个音节或单词用标点拼成一次 TTS 请求，无法逐条校验，也违反独立生成原则。
2. 第 1 课的部分拼音节结果没有静态文件，只能隐式依赖设备 fallback，未纳入 manifest。
3. 第 4 课 HTML 指向 9 个 MP3，但本地目录只有 manifest，没有对应文件；按钮实际落入设备语音，映射与文件状态不一致。
4. 旧 manifest 只有 `text`，没有页面文字、预期读音、音变规则和审核状态，生成成功无法代表发音正确。
5. 旧服务工作线程缓存名没有覆盖本次声音修复；同名覆盖可能继续播放旧文件。

## 全课程音频审计表

| lesson | screen/page | 页面显示内容 | 教学目标 | 当前传给播放函数的值 | 当前音频文件路径 | 当前 TTS 生成文本 | 应当播放的韩语内容 | 预期实际读音 | 发音类型 | 是否存在错误 | 修改方案 | 是否需要产品负责人试听/母语抽检 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| lesson-01 | 元音卡片、练习 1 | ㅏ（发音载体：아） | 用无声初声 ㅇ 承载元音 ㅏ | 아 | audio/lesson-01/a.mp3 | 아 | 아 | 아 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-01 | 元音卡片、练习 2 | ㅓ（发音载体：어） | 用完整音节教学元音 ㅓ | 어 | audio/lesson-01/eo.mp3 | 어 | 어 | 어 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-01 | 元音卡片、挑战 1 | ㅗ（发音载体：오） | 用完整音节教学元音 ㅗ | 오 | audio/lesson-01/o.mp3 | 오 | 오 | 오 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-01 | 元音卡片、挑战 2 | ㅜ（发音载体：우） | 用完整音节教学元音 ㅜ | 우 | audio/lesson-01/u.mp3 | 우 | 우 | 우 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-01 | 辅音卡片、拼音节、挑战 5 | ㄱ（示例：가） | 在完整音节 가 中听 ㄱ 的初声 | 가 | audio/lesson-01/ga.mp3 | 가 | 가 | 가 | 初声辅音 | 是，旧跟读音频把多个音节合并为一个 TTS 请求（已修复） | 改为逐条播放独立音频；旧 ga-na.mp3 已废弃 | 是（pending） |
| lesson-01 | 辅音卡片、拼音节、跟读 | ㄴ（示例：나） | 在完整音节 나 中听 ㄴ 的初声 | 나 | audio/lesson-01/na.mp3 | 나 | 나 | 나 | 初声辅音 | 是，旧跟读音频把多个音节合并为一个 TTS 请求（已修复） | 改为逐条播放独立音频；旧 ga-na.mp3 已废弃 | 是（pending） |
| lesson-01 | 拼音节 | 거 | 验证 ㄱ + ㅓ 的拼读 | 거 | audio/lesson-01/geo-v2.wav | 거 | 거 | 거 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-01 | 拼音节 | 고 | 验证 ㄱ + ㅗ 的拼读 | 고 | audio/lesson-01/go-v2.wav | 고 | 고 | 고 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-01 | 拼音节 | 구 | 验证 ㄱ + ㅜ 的拼读 | 구 | audio/lesson-01/gu-v2.wav | 구 | 구 | 구 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-01 | 拼音节 | 너 | 验证 ㄴ + ㅓ 的拼读 | 너 | audio/lesson-01/neo-v2.wav | 너 | 너 | 너 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-01 | 拼音节 | 노 | 验证 ㄴ + ㅗ 的拼读 | 노 | audio/lesson-01/no-v2.wav | 노 | 노 | 노 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-01 | 拼音节 | 누 | 验证 ㄴ + ㅜ 的拼读 | 누 | audio/lesson-01/nu-v2.wav | 누 | 누 | 누 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-02 | 元音卡片、练习 1 | ㅡ（发音载体：으） | 用完整音节教学元音 ㅡ | 으 | audio/lesson-02/eu.mp3 | 으 | 으 | 으 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 元音卡片、挑战 1 | ㅣ（发音载体：이） | 用完整音节教学元音 ㅣ | 이 | audio/lesson-02/i.mp3 | 이 | 이 | 이 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 元音卡片 | ㅐ（发音载体：애） | 识别 ㅐ 的字形与现代首尔音 | 애 | audio/lesson-02/ae.mp3 | 애 | 애 | 애 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 元音卡片 | ㅔ（发音载体：에） | 识别 ㅔ 的字形与现代首尔音 | 에 | audio/lesson-02/e.mp3 | 에 | 에 | 에 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 辅音卡片、拼音节 | ㄷ（示例：다） | 在 다 中听 ㄷ 初声 | 다 | audio/lesson-02/da.mp3 | 다 | 다 | 다 | 初声辅音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 拼音节 | 디 | 验证 ㄷ + ㅣ | 디 | audio/lesson-02/di.mp3 | 디 | 디 | 디 | 完整音节 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 辅音卡片、拼音节 | ㄹ（示例：라） | 在 라 中听 ㄹ 初声 | 라 | audio/lesson-02/ra.mp3 | 라 | 라 | 라 | 初声辅音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 拼音节 | 리 | 验证 ㄹ + ㅣ | 리 | audio/lesson-02/ri.mp3 | 리 | 리 | 리 | 完整音节 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 辅音卡片、拼音节 | ㅁ（示例：마） | 在 마 中听 ㅁ 初声 | 마 | audio/lesson-02/ma.mp3 | 마 | 마 | 마 | 初声辅音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 拼音节 | 미 | 验证 ㅁ + ㅣ | 미 | audio/lesson-02/mi.mp3 | 미 | 미 | 미 | 完整音节 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-02 | 真实词汇、练习 3、跟读 | 나무 | 读出真实词汇“树” | 나무 | audio/lesson-02/namu.mp3 | 나무 | 나무 | 나무 | 单词 | 是，旧跟读音频把多个单词合并为一个 TTS 请求（已修复） | 改为逐条播放独立单词音频；旧 words.mp3 已废弃 | 是（pending） |
| lesson-02 | 真实词汇、跟读 | 다리 | 读出真实词汇“腿/桥” | 다리 | audio/lesson-02/dari.mp3 | 다리 | 다리 | 다리 | 单词 | 是，旧跟读音频把多个单词合并为一个 TTS 请求（已修复） | 改为逐条播放独立单词音频；旧 words.mp3 已废弃 | 是（pending） |
| lesson-02 | 真实词汇、挑战 4、跟读 | 머리 | 读出真实词汇“头” | 머리 | audio/lesson-02/meori.mp3 | 머리 | 머리 | 머리 | 单词 | 是，旧跟读音频把多个单词合并为一个 TTS 请求（已修复） | 改为逐条播放独立单词音频；旧 words.mp3 已废弃 | 是（pending） |
| lesson-03 | 元音卡片、挑战 1 | ㅑ（发音载体：야） | 用完整音节教学元音 ㅑ | 야 | audio/lesson-03/ya.mp3 | 야 | 야 | 야 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 元音卡片、练习 1、拼音节 | ㅕ（发音载体：여） | 用完整音节教学元音 ㅕ | 여 | audio/lesson-03/yeo.mp3 | 여 | 여 | 여 | 单个元音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 辅音卡片、拼音节 | ㅂ（示例：바） | 在 바 中听 ㅂ 初声 | 바 | audio/lesson-03/ba.mp3 | 바 | 바 | 바 | 初声辅音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 拼音节 | 벼 | 验证 ㅂ + ㅕ | 벼 | audio/lesson-03/byeo.mp3 | 벼 | 벼 | 벼 | 完整音节 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 辅音卡片、拼音节 | ㅅ（示例：사） | 在 사 中听 ㅅ 初声 | 사 | audio/lesson-03/sa.mp3 | 사 | 사 | 사 | 初声辅音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 拼音节 | 셔 | 验证 ㅅ + ㅕ | 셔 | audio/lesson-03/syeo.mp3 | 셔 | 셔 | 셔 | 完整音节 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 辅音卡片、拼音节 | ㅇ（初声无声示例：아） | 在 아 中听出初声 ㅇ 不发音 | 아 | audio/lesson-03/a.mp3 | 아 | 아 | 아 | 初声辅音 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 真实词汇 | 바다 | 读出“海” | 바다 | audio/lesson-03/bada.mp3 | 바다 | 바다 | 바다 | 单词 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 真实词汇 | 사람 | 读出“人” | 사람 | audio/lesson-03/saram.mp3 | 사람 | 사람 | 사람 | 单词 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 真实词汇 | 안녕 | 识别简短问候 | 안녕 | audio/lesson-03/annyeong.mp3 | 안녕 | 안녕 | 안녕 | 单词 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-03 | 场景短语、跟读、挑战 4 | 안녕하세요 | 自然说出礼貌问候 | 안녕하세요 | audio/lesson-03/annyeonghaseyo.mp3 | 안녕하세요 | 안녕하세요 | 안녕하세요 | 完整句子或对话 | 代码未发现映射错误；实际发音仍待试听 | 统一结构并保留现有独立文件；保持 pending | 是（pending） |
| lesson-04 | 收音卡片、真实词汇 | 산 | 在完整单词中听 ㄴ 收音 | 산 | audio/lesson-04/san-v2.wav | 산 | 산 | 산 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音卡片、真实词汇 | 몸 | 在完整单词中听 ㅁ 收音 | 몸 | audio/lesson-04/mom-v2.wav | 몸 | 몸 | 몸 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音卡片、真实词汇 | 공 | 在完整单词中听 ㅇ 收音 | 공 | audio/lesson-04/gong-v2.wav | 공 | 공 | 공 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音卡片、真实词汇、挑战 3 | 물 | 在完整单词中听 ㄹ 收音 | 물 | audio/lesson-04/mul-v2.wav | 물 | 물 | 물 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 拼音节 | 바 | 对比无收音的基础音节 | 바 | audio/lesson-04/ba-v2.wav | 바 | 바 | 바 | 完整音节 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音对比、拼音节 | 반 | 对比 바 + ㄴ | 반 | audio/lesson-04/ban-v2.wav | 반 | 반 | 반 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音对比、拼音节、挑战 1 | 밤 | 对比 바 + ㅁ | 밤 | audio/lesson-04/bam-v2.wav | 밤 | 밤 | 밤 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音对比、拼音节、练习 1 | 방 | 对比 바 + ㅇ | 방 | audio/lesson-04/bang-v2.wav | 방 | 방 | 방 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 收音对比、拼音节 | 발 | 对比 바 + ㄹ | 발 | audio/lesson-04/bal-v2.wav | 발 | 발 | 발 | 收音 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |
| lesson-04 | 场景短语、跟读、挑战 4 | 감사합니다 | 自然说出正式感谢 | 감사합니다 | audio/lesson-04/gamsahamnida-v2.wav | 감사합니다 | 감사합니다 | 감사함니다 | 音变、完整句子或对话 | 是，原先缺少独立文件或映射到不存在的文件（已修复） | 新增带 v2 文件名的独立韩语系统语音；保持 pending | 是（pending） |

## 已废弃音频

- `audio/deprecated/lesson-01-ga-na.mp3`：旧的“가. 나.”合并请求。
- `audio/deprecated/lesson-02-words.mp3`：旧的“나무. 다리. 머리.”合并请求。

## 已废弃但从未存在于本地的旧映射

- 第 4 课旧映射 `san.mp3`、`mom.mp3`、`gong.mp3`、`mul.mp3`、`ban.mp3`、`bam.mp3`、`bang.mp3`、`bal.mp3`、`gamsahamnida.mp3` 在审计时均不存在，现已全部替换为版本化文件。

## 本次重新生成或新增的音频

- `audio/lesson-01/geo-v2.wav` ← `거`（pending）
- `audio/lesson-01/go-v2.wav` ← `고`（pending）
- `audio/lesson-01/gu-v2.wav` ← `구`（pending）
- `audio/lesson-01/neo-v2.wav` ← `너`（pending）
- `audio/lesson-01/no-v2.wav` ← `노`（pending）
- `audio/lesson-01/nu-v2.wav` ← `누`（pending）
- `audio/lesson-04/san-v2.wav` ← `산`（pending）
- `audio/lesson-04/mom-v2.wav` ← `몸`（pending）
- `audio/lesson-04/gong-v2.wav` ← `공`（pending）
- `audio/lesson-04/mul-v2.wav` ← `물`（pending）
- `audio/lesson-04/ba-v2.wav` ← `바`（pending）
- `audio/lesson-04/ban-v2.wav` ← `반`（pending）
- `audio/lesson-04/bam-v2.wav` ← `밤`（pending）
- `audio/lesson-04/bang-v2.wav` ← `방`（pending）
- `audio/lesson-04/bal-v2.wav` ← `발`（pending）
- `audio/lesson-04/gamsahamnida-v2.wav` ← `감사합니다`（pending）

## 证据限制

- 用户提供的录屏路径在审计时不存在，因此没有把无法取得的录屏内容当作发音结论。
- 自动检查只证明结构、映射、文件存在性、缓存版本和 fallback 规则正确，不证明声音达到母语者标准。

## 人工审核规则

- `pending`：只能表示文件、映射和元数据通过自动检查，不能表示发音正确。
- `approved`：必须在产品负责人课程内试听并明确反馈“试听通过”后才能设置；记录方式遵循 `AUDIO_REVIEW_POLICY.md`。
- 母语者审核为可选发布前抽检，不得伪造 `nativeReviewer` 或结论。
- 单条音频有问题时只标记该条 `rejected`，不得连带拒绝同批其他文件。
- 音变项目（当前为 `감사합니다 → 감사함니다`）需在产品负责人试听或可选母语者抽检时优先检查自然连读与语调。
- 若未来使用真人录音，必须填写 voiceTalent、consentRecord、commercialUseRecord。
