# K0 音频生成批次计划

Batch 0 代码门禁：完成，P0=0。Batch 1 的第0课 `yo/요`、`yu/유` 已通过技术验证和产品负责人试听，并按固定 SHA 接入。

## Batch 2 原始范围（16条）

历史基线 `5fe8fb1` 中的 Batch 2 包含14条第4课对比音节，以及第0课的 하 和第5课的 그。后续摘要只写“14条”但没有记录 하、그 的去向；本表恢复原始范围，不代表全部16条已具备正式生成条件。

| id | lesson | speechText | audioType | teachingPurpose | outputFile | 当前状态 | 使用页面/按钮 | 风险或重复 |
|---|---|---|---|---|---|---|---|---|
| ga | 0/4 | 가 | initial-example | 普通音对比 | ga.mp3 | pending/missing | 第4课对比、听辨；听普通音 가 | 与lesson-01同文本/文件名，但正式路径不同 |
| ka | 0/4 | 카 | initial-example | 送气音对比 | ka.mp3 | pending/missing | 第4课对比、听辨；听送气音 카 | 无冲突 |
| kka | 0/4 | 까 | initial-example | 紧音对比 | kka.mp3 | pending/missing | 第4课对比、听辨；听紧音 까 | 无冲突 |
| da | 0/4 | 다 | initial-example | 普通音对比 | da.mp3 | pending/missing | 第4课对比、听辨；听普通音 다 | 与lesson-02同文本/文件名，但正式路径不同 |
| ta | 0/4 | 타 | initial-example | 送气音对比 | ta.mp3 | pending/missing | 第4课对比、听辨；听送气音 타 | 无冲突 |
| tta | 0/4 | 따 | initial-example | 紧音对比 | tta.mp3 | pending/missing | 第4课对比、听辨；听紧音 따 | 无冲突 |
| ba | 0/4 | 바 | initial-example | 普通音对比 | ba.mp3 | pending/missing | 第4课对比、听辨；听普通音 바 | 与lesson-03同文本/文件名；lesson-04另有同文本WAV |
| pa | 0/4 | 파 | initial-example | 送气音对比 | pa.mp3 | pending/missing | 第4课对比、听辨；听送气音 파 | 无冲突 |
| ppa | 0/4 | 빠 | initial-example | 紧音对比 | ppa.mp3 | pending/missing | 第4课对比、听辨；听紧音 빠 | 无冲突 |
| ja | 0/4 | 자 | initial-example | 普通音对比 | ja.mp3 | pending/missing | 第4课对比、听辨；听普通音 자 | 无冲突 |
| cha | 0/4 | 차 | initial-example | 送气音对比 | cha.mp3 | pending/missing | 第4课对比、听辨；听送气音 차 | 无冲突 |
| jja | 0/4 | 짜 | initial-example | 紧音对比 | jja.mp3 | pending/missing | 第4课对比、听辨；听紧音 짜 | 无冲突 |
| sa | 0/4 | 사 | initial-example | 普通音对比 | sa.mp3 | pending/missing | 第4课对比、听辨；听普通音 사 | 与lesson-03同文本/文件名，但正式路径不同 |
| ssa | 0/4 | 싸 | initial-example | 紧音对比 | ssa.mp3 | pending/missing | 第4课对比、听辨；听紧音 싸 | 无冲突 |
| ha | 0 | 하 | initial-example | ㅎ示例音节 | ha.mp3 | pending/missing | 第0课字母详情；听示例音节 하 | 独立lesson-00严格记录，不得复用同文本其他类型 |
| geu | 5 | 그 | syllable | 上下结构完整音节 | geu.mp3 | pending/missing | 第5课上下结构；听示例音节 그 | 独立lesson-05严格记录，不得复用同文本其他路径 |

听辨题在作答前统一使用“播放听力题音频/再次播放”，不显示 transcript；作答后才显示原文与解释。

## Batch 2A 首次试产结论

Run `29717434767` 生成了 `가/카/까` 三条Artifact音频，正式manifest始终保持 `pending/missing`。产品负责人及声学复核结论：

- `까`：初步通过；保留 `20a33fd85584d2efc288513368a90c0ef94022f21a074bf0646a641b46ccdf27`，禁止重新生成。
- `가`：暂不通过；噪声起声偏长，可能让初学者依赖时长而非弱气流。
- `카`：暂不通过；需要与가更一致的响度和元音长度，同时保持清楚送气。

## Batch 2A 가/카 修订试产 R1

可执行ID：`audio-batch-02a-gaka-r1`。严格允许列表仅为 `ga/가/ga.mp3`、`ka/카/ka.mp3`，共2条；不包含까。继续使用 `gpt-4o-mini-tts` 与 `marin`，要求只读目标音节一次、两条响度/元音长度/节奏尽量匹配；가保持自然弱气流且不夸大起声噪声，카保持清楚送气但不得通过更响或更长来制造差异。正式manifest继续保持 `pending/missing`。

## Batch 2B（代码准备完成，等待精确付费授权）

剩余13条：다、타、따、바、파、빠、자、차、짜、사、싸、하、그。`audio-batch-02b` 已建立严格跨课程允许列表，`expectedCount/maxApiRequests=13`、自动重试关闭、输出仅限staging/Artifact；하与그的正式catalog/manifest记录已补齐并保持`pending/missing`。当前仍不得启动；只有产品负责人给出精确授权句后才允许单次手动生成。

## 冻结生成配置

- model：`gpt-4o-mini-tts`
- voice：`marin`
- response format：`mp3`
- speed：Batch 1请求未显式传入，继续省略并使用provider default
- Batch 2B instructions：每条只读一次；录音电平、感知响度、节奏、元音长度和发声力度尽量统一；普通音保持自然弱气流、送气音保持清楚气流、紧音保持收紧且少气流，不得靠增大音量或延长元音制造类别差异。
- 技术验收目标：24,000 Hz、单声道；这是Batch 1产物的实际技术参数，不是发送给TTS的采样参数
- 每条最多一次请求；禁止自动重试、补生成和清单外文本
- 只写staging并上传Artifact；正式manifest保持pending/missing

后续仍执行“技术验证 → 产品负责人课程内试听 → 明确通过后接入”。母语者审核为可选发布前抽检；单条 rejected 不影响同批其他文件。
