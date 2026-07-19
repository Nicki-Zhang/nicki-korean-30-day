# Nikigo K0 第0～6课播放器审计

> 生成时间：2026-07-19T14:56:02.029Z。这是代码、文件和元数据审计，不是韩语发音批准。历史稳定ID `lesson-04` 当前显示为第7课，但因任务明确要求审计其받침内容，仍纳入本表。

## 结论

- 共登记 **235** 个独立播放器入口/状态入口（含禁用详情按钮、隐藏挑战、答后重播、错题重练和复习中心）。
- P0 **166**，P1 **69**，P2 **0**。当前不满足开始 Batch 1 的代码前置条件。
- 所有现有正式目录音频均为 `pending`；自动测试或文件可解码不代表母语者审核通过。
- 第0课、通用课程引擎、第4课对比课程和复习中心仍存在设备 `speechSynthesis` 路径；这是本次规则下的 P0。
- 第6课全部可见音频按钮保持禁用，但词汇页把 `왜`、`예` 标为“完整单词”，而13条队列将它们定义为完整音节，属于生成前必须澄清的语义冲突。

## 每课播放器数量

| lesson/stableId | 显示课号 | 行数 | P0 | P1 | 缺失/无文件 |
|---|---:|---:|---:|---:|---:|
| lesson-00 | 00 | 59 | 18 | 41 | 41 |
| lesson-01 | 01 | 27 | 25 | 2 | 8 |
| lesson-02 | 02 | 28 | 25 | 3 | 8 |
| lesson-03 | 03 | 26 | 23 | 3 | 7 |
| lesson-04 | 7 | 28 | 28 | 0 | 5 |
| k0-consonant-contrast | 4 | 37 | 37 | 0 | 37 |
| lesson-05 | 05 | 9 | 8 | 1 | 1 |
| lesson-06 | 06 | 21 | 2 | 19 | 19 |

## P0 问题

- **forbidden-device-tts-fallback** — lesson-00 / map-ㄱ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㄴ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㄷ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㄹ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅁ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅂ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅅ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅇ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅏ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅑ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅓ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅕ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅗ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅜ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅡ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅣ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅐ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-00 / map-ㅔ: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / vowels: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / consonants: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / builder: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / repeat: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / practice-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / practice-2: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / quiz-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / quiz-2: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / quiz-5: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / vowels: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / consonants: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / words: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / builder: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / repeat: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / practice-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / practice-3: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / quiz-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / quiz-4: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / vowels: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / consonants: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / words: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / builder: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / phrase: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / repeat: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / practice-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / quiz-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / quiz-4: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / vowels: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / consonants: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / words: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / builder: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / phrase: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / repeat: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / practice-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / quiz-1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / quiz-3: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / quiz-4: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / group-g: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / group-d: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / group-b: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / group-j: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / group-s: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / challenge-qg: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / answered-replay-qg: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / retry-qg: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / challenge-qd: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / answered-replay-qd: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / retry-qd: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / challenge-qb: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / answered-replay-qb: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / retry-qb: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / challenge-qj: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / answered-replay-qj: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / retry-qj: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / challenge-qs: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / answered-replay-qs: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / retry-qs: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / challenge-qall: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / answered-replay-qall: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — k0-consonant-contrast / retry-qall: Remove device TTS; fail closed with translated retry/error state.
- **pending-audio-enabled** — lesson-05 / left-examples: Disable until native review is approved, or keep lesson explicitly in preview.
- **pending-audio-enabled** — lesson-05 / top-examples: Disable until native review is approved, or keep lesson explicitly in preview.
- **pending-audio-enabled** — lesson-05 / ieung-examples: Disable until native review is approved, or keep lesson explicitly in preview.
- **button-catalog-audio-type-mismatch** — lesson-06 / words: Decide whether 왜/예 are taught as words or carrier syllables; create a distinct typed object/button label before generation.
- **forbidden-device-tts-fallback** — lesson-01 / review-lesson01:vowels: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / review-lesson01:shadowing: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / review-lesson01:quiz:0: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / review-lesson01:quiz:1: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-01 / review-lesson01:quiz:4: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / review-lesson02:words: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / review-lesson02:shadowing: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / review-lesson02:quiz:0: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-02 / review-lesson02:quiz:3: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / review-lesson03:new-letters: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / review-lesson03:greeting: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / review-lesson03:quiz:0: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-03 / review-lesson03:quiz:3: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / review-lesson04:batchim: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / review-lesson04:thanks: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / review-lesson04:quiz:0: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / review-lesson04:quiz:2: Remove device TTS; fail closed with translated retry/error state.
- **forbidden-device-tts-fallback** — lesson-04 / review-lesson04:quiz:3: Remove device TTS; fail closed with translated retry/error state.

## P1 问题

- **missing-audio** — lesson-00 / map-ㄱ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㄴ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㄷ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㄹ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅁ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅂ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅅ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅇ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅈ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅎ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅋ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅌ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅍ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅊ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㄲ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㄸ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅃ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅆ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅉ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅛ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅠ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅒ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅖ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅘ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅙ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅚ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅝ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅞ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅟ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-00 / map-ㅢ: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-01 / consonants: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-02 / consonants: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-03 / consonants: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-05 / top-examples: Add to generation queue; keep the button disabled until approved.
- **rights-and-review-metadata-gap** — lesson-06 / review: Record source/model/date/commercial-use basis and native review before release.
- **missing-audio** — lesson-06 / oa: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-06 / ueo: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-06 / carrier: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-06 / extended: Add to generation queue; keep the button disabled until approved.
- **missing-audio** — lesson-06 / words: Add to generation queue; keep the button disabled until approved.

## 问题分级登记

| priority | issue | 根因 | 用户影响 | 是否重生成 | 是否母语审核 | 修复建议 |
|---|---|---|---|---|---|---|
| P0 | forbidden-device-tts-fallback | 四个播放器实现仍调用设备speechSynthesis | 不同设备读法不可控、不可审计 | 否，先修代码 | 修复后新文件需要 | 移除TTS与文字替代，失败只显示翻译状态 |
| P0 | pending-audio-enabled | 播放器只检查文件映射，不检查reviewStatus | 未审核声音被误认成标准音 | 16条系统导出建议重生成 | 是 | approved+存在+精确匹配才启用 |
| P0 | button-catalog-audio-type-mismatch | 第6课왜/예同时作为词义卡和承载音节 | 按钮与审核对象类型冲突 | 可能需要独立语境版本 | 是 | 先确认语义，再建独立typed对象 |
| P0 | catalog-or-semantic-mismatch | 对比/复习未走canonical精确文件映射 | fallback绕过manifest | 是/新增 | 是 | 每个speechText唯一映射文件 |
| P1 | missing-audio | 字母名称、部分示例与第6课尚无文件 | 按钮禁用或核心发音目标缺失 | 新增 | 是 | 分批生成并保持pending |
| P1 | rights-and-review-metadata-gap | 旧记录缺日期、商业使用依据、reviewer | 发布记录不完整 | 不一定 | 是 | 发布前补齐来源/权利/审核字段 |
| P2 | mobile-playback-hardening | preload、快速连点和离线缓存未真机验证 | 弱网下可能延迟或状态残留 | 否 | 否 | iOS/Android真机回归与版本化URL |

静态扫描未发现音频路径使用 `includes` / `startsWith` 做近似文本匹配；当前主要问题是fallback绕过精确映射。

## 字段说明与完整数据

完整逐行数据见 [K0_AUDIO_PLAYER_AUDIT.csv](K0_AUDIO_PLAYER_AUDIT.csv)。CSV列数：35；数据行数：235。

### 完整播放器索引（便于代码审阅）

| # | lesson | screen | control | button | speechText | type | file | exists | review | issue | priority |
|---:|---|---|---|---|---|---|---|---|---|---|---|
| 1 | lesson-00 | map-ㄱ | lesson00-ㄱ-letter-name | 字母名称音频待补充 | 기역 | letter-name | — | false | missing | missing-audio | P1 |
| 2 | lesson-00 | map-ㄱ | lesson00-ㄱ-demo | 听示例音节 가 | 가 | initial-example | audio/lesson-01/ga.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 3 | lesson-00 | map-ㄴ | lesson00-ㄴ-letter-name | 字母名称音频待补充 | 니은 | letter-name | — | false | missing | missing-audio | P1 |
| 4 | lesson-00 | map-ㄴ | lesson00-ㄴ-demo | 听示例音节 나 | 나 | initial-example | audio/lesson-01/na.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 5 | lesson-00 | map-ㄷ | lesson00-ㄷ-letter-name | 字母名称音频待补充 | 디귿 | letter-name | — | false | missing | missing-audio | P1 |
| 6 | lesson-00 | map-ㄷ | lesson00-ㄷ-demo | 听示例音节 다 | 다 | initial-example | audio/lesson-02/da.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 7 | lesson-00 | map-ㄹ | lesson00-ㄹ-letter-name | 字母名称音频待补充 | 리을 | letter-name | — | false | missing | missing-audio | P1 |
| 8 | lesson-00 | map-ㄹ | lesson00-ㄹ-demo | 听示例音节 라 | 라 | initial-example | audio/lesson-02/ra.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 9 | lesson-00 | map-ㅁ | lesson00-ㅁ-letter-name | 字母名称音频待补充 | 미음 | letter-name | — | false | missing | missing-audio | P1 |
| 10 | lesson-00 | map-ㅁ | lesson00-ㅁ-demo | 听示例音节 마 | 마 | initial-example | audio/lesson-02/ma.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 11 | lesson-00 | map-ㅂ | lesson00-ㅂ-letter-name | 字母名称音频待补充 | 비읍 | letter-name | — | false | missing | missing-audio | P1 |
| 12 | lesson-00 | map-ㅂ | lesson00-ㅂ-demo | 听示例音节 바 | 바 | initial-example | audio/lesson-03/ba.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 13 | lesson-00 | map-ㅅ | lesson00-ㅅ-letter-name | 字母名称音频待补充 | 시옷 | letter-name | — | false | missing | missing-audio | P1 |
| 14 | lesson-00 | map-ㅅ | lesson00-ㅅ-demo | 听示例音节 사 | 사 | initial-example | audio/lesson-03/sa.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 15 | lesson-00 | map-ㅇ | lesson00-ㅇ-letter-name | 字母名称音频待补充 | 이응 | letter-name | — | false | missing | missing-audio | P1 |
| 16 | lesson-00 | map-ㅇ | lesson00-ㅇ-demo | 听示例音节 아 | 아 | initial-example | audio/lesson-01/a.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 17 | lesson-00 | map-ㅈ | lesson00-ㅈ-letter-name | 字母名称音频待补充 | 지읒 | letter-name | — | false | missing | missing-audio | P1 |
| 18 | lesson-00 | map-ㅈ | lesson00-ㅈ-demo | 示例音节音频待补充 | 자 | initial-example | audio/k0-consonant-contrast/ja.mp3 | false | pending | missing-audio | P1 |
| 19 | lesson-00 | map-ㅎ | lesson00-ㅎ-letter-name | 字母名称音频待补充 | 히읗 | letter-name | — | false | missing | missing-audio | P1 |
| 20 | lesson-00 | map-ㅎ | lesson00-ㅎ-demo | 示例音节音频待补充 | 하 | initial-example | — | false | missing | missing-audio | P1 |
| 21 | lesson-00 | map-ㅋ | lesson00-ㅋ-letter-name | 字母名称音频待补充 | 키읔 | letter-name | — | false | missing | missing-audio | P1 |
| 22 | lesson-00 | map-ㅋ | lesson00-ㅋ-demo | 示例音节音频待补充 | 카 | initial-example | audio/k0-consonant-contrast/ka.mp3 | false | pending | missing-audio | P1 |
| 23 | lesson-00 | map-ㅌ | lesson00-ㅌ-letter-name | 字母名称音频待补充 | 티읕 | letter-name | — | false | missing | missing-audio | P1 |
| 24 | lesson-00 | map-ㅌ | lesson00-ㅌ-demo | 示例音节音频待补充 | 타 | initial-example | audio/k0-consonant-contrast/ta.mp3 | false | pending | missing-audio | P1 |
| 25 | lesson-00 | map-ㅍ | lesson00-ㅍ-letter-name | 字母名称音频待补充 | 피읖 | letter-name | — | false | missing | missing-audio | P1 |
| 26 | lesson-00 | map-ㅍ | lesson00-ㅍ-demo | 示例音节音频待补充 | 파 | initial-example | audio/k0-consonant-contrast/pa.mp3 | false | pending | missing-audio | P1 |
| 27 | lesson-00 | map-ㅊ | lesson00-ㅊ-letter-name | 字母名称音频待补充 | 치읓 | letter-name | — | false | missing | missing-audio | P1 |
| 28 | lesson-00 | map-ㅊ | lesson00-ㅊ-demo | 示例音节音频待补充 | 차 | initial-example | audio/k0-consonant-contrast/cha.mp3 | false | pending | missing-audio | P1 |
| 29 | lesson-00 | map-ㄲ | lesson00-ㄲ-letter-name | 字母名称音频待补充 | 쌍기역 | letter-name | — | false | missing | missing-audio | P1 |
| 30 | lesson-00 | map-ㄲ | lesson00-ㄲ-demo | 示例音节音频待补充 | 까 | initial-example | audio/k0-consonant-contrast/kka.mp3 | false | pending | missing-audio | P1 |
| 31 | lesson-00 | map-ㄸ | lesson00-ㄸ-letter-name | 字母名称音频待补充 | 쌍디귿 | letter-name | — | false | missing | missing-audio | P1 |
| 32 | lesson-00 | map-ㄸ | lesson00-ㄸ-demo | 示例音节音频待补充 | 따 | initial-example | audio/k0-consonant-contrast/tta.mp3 | false | pending | missing-audio | P1 |
| 33 | lesson-00 | map-ㅃ | lesson00-ㅃ-letter-name | 字母名称音频待补充 | 쌍비읍 | letter-name | — | false | missing | missing-audio | P1 |
| 34 | lesson-00 | map-ㅃ | lesson00-ㅃ-demo | 示例音节音频待补充 | 빠 | initial-example | audio/k0-consonant-contrast/ppa.mp3 | false | pending | missing-audio | P1 |
| 35 | lesson-00 | map-ㅆ | lesson00-ㅆ-letter-name | 字母名称音频待补充 | 쌍시옷 | letter-name | — | false | missing | missing-audio | P1 |
| 36 | lesson-00 | map-ㅆ | lesson00-ㅆ-demo | 示例音节音频待补充 | 싸 | initial-example | audio/k0-consonant-contrast/ssa.mp3 | false | pending | missing-audio | P1 |
| 37 | lesson-00 | map-ㅉ | lesson00-ㅉ-letter-name | 字母名称音频待补充 | 쌍지읒 | letter-name | — | false | missing | missing-audio | P1 |
| 38 | lesson-00 | map-ㅉ | lesson00-ㅉ-demo | 示例音节音频待补充 | 짜 | initial-example | audio/k0-consonant-contrast/jja.mp3 | false | pending | missing-audio | P1 |
| 39 | lesson-00 | map-ㅏ | lesson00-ㅏ-vowel | 听元音ㅏ | 아 | vowel-carrier | audio/lesson-01/a.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 40 | lesson-00 | map-ㅑ | lesson00-ㅑ-vowel | 听元音ㅑ | 야 | vowel-carrier | audio/lesson-03/ya.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 41 | lesson-00 | map-ㅓ | lesson00-ㅓ-vowel | 听元音ㅓ | 어 | vowel-carrier | audio/lesson-01/eo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 42 | lesson-00 | map-ㅕ | lesson00-ㅕ-vowel | 听元音ㅕ | 여 | vowel-carrier | audio/lesson-03/yeo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 43 | lesson-00 | map-ㅗ | lesson00-ㅗ-vowel | 听元音ㅗ | 오 | vowel-carrier | audio/lesson-01/o.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 44 | lesson-00 | map-ㅛ | lesson00-ㅛ-vowel | 元音音频待补充 | 요 | vowel-carrier | — | false | missing | missing-audio | P1 |
| 45 | lesson-00 | map-ㅜ | lesson00-ㅜ-vowel | 听元音ㅜ | 우 | vowel-carrier | audio/lesson-01/u.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 46 | lesson-00 | map-ㅠ | lesson00-ㅠ-vowel | 元音音频待补充 | 유 | vowel-carrier | — | false | missing | missing-audio | P1 |
| 47 | lesson-00 | map-ㅡ | lesson00-ㅡ-vowel | 听元音ㅡ | 으 | vowel-carrier | audio/lesson-02/eu.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 48 | lesson-00 | map-ㅣ | lesson00-ㅣ-vowel | 听元音ㅣ | 이 | vowel-carrier | audio/lesson-02/i.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 49 | lesson-00 | map-ㅐ | lesson00-ㅐ-vowel | 听元音ㅐ | 애 | vowel-carrier | audio/lesson-02/ae.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 50 | lesson-00 | map-ㅒ | lesson00-ㅒ-vowel | 元音音频待补充 | 얘 | vowel-carrier | audio/lesson-06/yae.mp3 | false | pending | missing-audio | P1 |
| 51 | lesson-00 | map-ㅔ | lesson00-ㅔ-vowel | 听元音ㅔ | 에 | vowel-carrier | audio/lesson-02/e.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 52 | lesson-00 | map-ㅖ | lesson00-ㅖ-vowel | 元音音频待补充 | 예 | vowel-carrier | audio/lesson-06/ye.mp3 | false | pending | missing-audio | P1 |
| 53 | lesson-00 | map-ㅘ | lesson00-ㅘ-vowel | 元音音频待补充 | 와 | vowel-carrier | audio/lesson-06/wa.mp3 | false | pending | missing-audio | P1 |
| 54 | lesson-00 | map-ㅙ | lesson00-ㅙ-vowel | 元音音频待补充 | 왜 | vowel-carrier | audio/lesson-06/wae.mp3 | false | pending | missing-audio | P1 |
| 55 | lesson-00 | map-ㅚ | lesson00-ㅚ-vowel | 元音音频待补充 | 외 | vowel-carrier | audio/lesson-06/oe.mp3 | false | pending | missing-audio | P1 |
| 56 | lesson-00 | map-ㅝ | lesson00-ㅝ-vowel | 元音音频待补充 | 워 | vowel-carrier | audio/lesson-06/wo.mp3 | false | pending | missing-audio | P1 |
| 57 | lesson-00 | map-ㅞ | lesson00-ㅞ-vowel | 元音音频待补充 | 웨 | vowel-carrier | audio/lesson-06/we.mp3 | false | pending | missing-audio | P1 |
| 58 | lesson-00 | map-ㅟ | lesson00-ㅟ-vowel | 元音音频待补充 | 위 | vowel-carrier | audio/lesson-06/wi.mp3 | false | pending | missing-audio | P1 |
| 59 | lesson-00 | map-ㅢ | lesson00-ㅢ-vowel | 元音音频待补充 | 의 | vowel-carrier | audio/lesson-06/ui.mp3 | false | pending | missing-audio | P1 |
| 60 | lesson-01 | vowels | lesson-01-vowel-0 | 听元音 아 | 아 | vowel-carrier | audio/lesson-01/a.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 61 | lesson-01 | vowels | lesson-01-vowel-1 | 听元音 어 | 어 | vowel-carrier | audio/lesson-01/eo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 62 | lesson-01 | vowels | lesson-01-vowel-2 | 听元音 오 | 오 | vowel-carrier | audio/lesson-01/o.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 63 | lesson-01 | vowels | lesson-01-vowel-3 | 听元音 우 | 우 | vowel-carrier | audio/lesson-01/u.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 64 | lesson-01 | consonants | lesson-01-consonant-demo-0 | 听示例音节 가 | 가 | syllable | audio/lesson-01/ga.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 65 | lesson-01 | consonants | lesson-01-letter-name-0 | 字母名称音频待补充 | 기역 | letter-name | — | false | missing | missing-audio | P1 |
| 66 | lesson-01 | consonants | lesson-01-consonant-demo-1 | 听示例音节 나 | 나 | syllable | audio/lesson-01/na.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 67 | lesson-01 | consonants | lesson-01-letter-name-1 | 字母名称音频待补充 | 니은 | letter-name | — | false | missing | missing-audio | P1 |
| 68 | lesson-01 | builder | lesson-01-builder-0 | 听示例音节 가 | 가 | syllable | audio/lesson-01/ga.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 69 | lesson-01 | builder | lesson-01-builder-1 | 听示例音节 거 | 거 | syllable | audio/lesson-01/geo-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 70 | lesson-01 | builder | lesson-01-builder-2 | 听示例音节 고 | 고 | syllable | audio/lesson-01/go-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 71 | lesson-01 | builder | lesson-01-builder-3 | 听示例音节 구 | 구 | syllable | audio/lesson-01/gu-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 72 | lesson-01 | builder | lesson-01-builder-4 | 听示例音节 나 | 나 | syllable | audio/lesson-01/na.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 73 | lesson-01 | builder | lesson-01-builder-5 | 听示例音节 너 | 너 | syllable | audio/lesson-01/neo-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 74 | lesson-01 | builder | lesson-01-builder-6 | 听示例音节 노 | 노 | syllable | audio/lesson-01/no-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 75 | lesson-01 | builder | lesson-01-builder-7 | 听示例音节 누 | 누 | syllable | audio/lesson-01/nu-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 76 | lesson-01 | repeat | lesson-01-repeat | 播放 가 · 나 | 가→나 | syllable | audio/lesson-01/ga.mp3 | audio/lesson-01/na.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 77 | lesson-01 | practice-1 | lesson-01-practice-audio-1 | 播放听力题音频 / 再次播放 | 아 | listening-question | audio/lesson-01/a.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 78 | lesson-01 | practice-2 | lesson-01-practice-audio-2 | 播放听力题音频 / 再次播放 | 어 | listening-question | audio/lesson-01/eo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 79 | lesson-01 | quiz-1 | lesson-01-quiz-audio-1 | 播放听力题音频 / 再次播放 | 오 | listening-question | audio/lesson-01/o.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 80 | lesson-01 | quiz-2 | lesson-01-quiz-audio-2 | 播放听力题音频 / 再次播放 | 우 | listening-question | audio/lesson-01/u.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 81 | lesson-01 | quiz-5 | lesson-01-quiz-audio-5 | 播放听力题音频 / 再次播放 | 가 | listening-question | audio/lesson-01/ga.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 82 | lesson-02 | vowels | lesson-02-vowel-0 | 听元音 으 | 으 | vowel-carrier | audio/lesson-02/eu.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 83 | lesson-02 | vowels | lesson-02-vowel-1 | 听元音 이 | 이 | vowel-carrier | audio/lesson-02/i.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 84 | lesson-02 | vowels | lesson-02-vowel-2 | 听元音 애 | 애 | vowel-carrier | audio/lesson-02/ae.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 85 | lesson-02 | vowels | lesson-02-vowel-3 | 听元音 에 | 에 | vowel-carrier | audio/lesson-02/e.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 86 | lesson-02 | consonants | lesson-02-consonant-demo-0 | 听示例音节 다 | 다 | syllable | audio/lesson-02/da.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 87 | lesson-02 | consonants | lesson-02-letter-name-0 | 字母名称音频待补充 | 디귿 | letter-name | — | false | missing | missing-audio | P1 |
| 88 | lesson-02 | consonants | lesson-02-consonant-demo-1 | 听示例音节 라 | 라 | syllable | audio/lesson-02/ra.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 89 | lesson-02 | consonants | lesson-02-letter-name-1 | 字母名称音频待补充 | 리을 | letter-name | — | false | missing | missing-audio | P1 |
| 90 | lesson-02 | consonants | lesson-02-consonant-demo-2 | 听示例音节 마 | 마 | syllable | audio/lesson-02/ma.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 91 | lesson-02 | consonants | lesson-02-letter-name-2 | 字母名称音频待补充 | 미음 | letter-name | — | false | missing | missing-audio | P1 |
| 92 | lesson-02 | words | lesson-02-word-0 | 听完整单词 나무 | 나무 | word | audio/lesson-02/namu.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 93 | lesson-02 | words | lesson-02-word-1 | 听完整单词 다리 | 다리 | word | audio/lesson-02/dari.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 94 | lesson-02 | words | lesson-02-word-2 | 听完整单词 머리 | 머리 | word | audio/lesson-02/meori.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 95 | lesson-02 | builder | lesson-02-builder-0 | 听示例音节 다 | 다 | syllable | audio/lesson-02/da.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 96 | lesson-02 | builder | lesson-02-builder-1 | 听示例音节 디 | 디 | syllable | audio/lesson-02/di.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 97 | lesson-02 | builder | lesson-02-builder-2 | 听示例音节 라 | 라 | syllable | audio/lesson-02/ra.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 98 | lesson-02 | builder | lesson-02-builder-3 | 听示例音节 리 | 리 | syllable | audio/lesson-02/ri.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 99 | lesson-02 | builder | lesson-02-builder-4 | 听示例音节 마 | 마 | syllable | audio/lesson-02/ma.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 100 | lesson-02 | builder | lesson-02-builder-5 | 听示例音节 미 | 미 | syllable | audio/lesson-02/mi.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 101 | lesson-02 | repeat | lesson-02-repeat | 播放 나무 · 다리 · 머리 | 나무→다리→머리 | syllable | audio/lesson-02/namu.mp3 | audio/lesson-02/dari.mp3 | audio/lesson-02/meori.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 102 | lesson-02 | practice-1 | lesson-02-practice-audio-1 | 播放听力题音频 / 再次播放 | 으 | listening-question | audio/lesson-02/eu.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 103 | lesson-02 | practice-3 | lesson-02-practice-audio-3 | 播放听力题音频 / 再次播放 | 나무 | listening-question | audio/lesson-02/namu.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 104 | lesson-02 | quiz-1 | lesson-02-quiz-audio-1 | 播放听力题音频 / 再次播放 | 이 | listening-question | audio/lesson-02/i.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 105 | lesson-02 | quiz-4 | lesson-02-quiz-audio-4 | 播放听力题音频 / 再次播放 | 머리 | listening-question | audio/lesson-02/meori.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 106 | lesson-03 | vowels | lesson-03-vowel-0 | 听元音 야 | 야 | vowel-carrier | audio/lesson-03/ya.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 107 | lesson-03 | vowels | lesson-03-vowel-1 | 听元音 여 | 여 | vowel-carrier | audio/lesson-03/yeo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 108 | lesson-03 | consonants | lesson-03-consonant-demo-0 | 听示例音节 바 | 바 | syllable | audio/lesson-03/ba.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 109 | lesson-03 | consonants | lesson-03-letter-name-0 | 字母名称音频待补充 | 비읍 | letter-name | — | false | missing | missing-audio | P1 |
| 110 | lesson-03 | consonants | lesson-03-consonant-demo-1 | 听示例音节 사 | 사 | syllable | audio/lesson-03/sa.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 111 | lesson-03 | consonants | lesson-03-letter-name-1 | 字母名称音频待补充 | 시옷 | letter-name | — | false | missing | missing-audio | P1 |
| 112 | lesson-03 | consonants | lesson-03-consonant-demo-2 | 听示例音节 아 | 아 | syllable | audio/lesson-03/a.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 113 | lesson-03 | consonants | lesson-03-letter-name-2 | 字母名称音频待补充 | 이응 | letter-name | — | false | missing | missing-audio | P1 |
| 114 | lesson-03 | words | lesson-03-word-0 | 听完整单词 바다 | 바다 | word | audio/lesson-03/bada.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 115 | lesson-03 | words | lesson-03-word-1 | 听完整单词 사람 | 사람 | word | audio/lesson-03/saram.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 116 | lesson-03 | words | lesson-03-word-2 | 听完整单词 안녕 | 안녕 | word | audio/lesson-03/annyeong.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 117 | lesson-03 | builder | lesson-03-builder-0 | 听示例音节 바 | 바 | syllable | audio/lesson-03/ba.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 118 | lesson-03 | builder | lesson-03-builder-1 | 听示例音节 벼 | 벼 | syllable | audio/lesson-03/byeo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 119 | lesson-03 | builder | lesson-03-builder-2 | 听示例音节 사 | 사 | syllable | audio/lesson-03/sa.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 120 | lesson-03 | builder | lesson-03-builder-3 | 听示例音节 셔 | 셔 | syllable | audio/lesson-03/syeo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 121 | lesson-03 | builder | lesson-03-builder-4 | 听示例音节 아 | 아 | syllable | audio/lesson-03/a.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 122 | lesson-03 | builder | lesson-03-builder-5 | 听示例音节 여 | 여 | syllable | audio/lesson-03/yeo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 123 | lesson-03 | phrase | lesson-03-phrase | 听完整表达 안녕하세요 | 안녕하세요 | sentence | audio/lesson-03/annyeonghaseyo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 124 | lesson-03 | repeat | lesson-03-repeat | 播放 안녕하세요 | 안녕하세요 | sentence | audio/lesson-03/annyeonghaseyo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 125 | lesson-03 | practice-1 | lesson-03-practice-audio-1 | 播放听力题音频 / 再次播放 | 여 | listening-question | audio/lesson-03/yeo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 126 | lesson-03 | quiz-1 | lesson-03-quiz-audio-1 | 播放听力题音频 / 再次播放 | 야 | listening-question | audio/lesson-03/ya.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 127 | lesson-03 | quiz-4 | lesson-03-quiz-audio-4 | 播放听力题音频 / 再次播放 | 안녕하세요 | listening-question | audio/lesson-03/annyeonghaseyo.mp3 | true | pending | forbidden-device-tts-fallback | P0 |
| 128 | lesson-04 | vowels | lesson-04-vowel-0 | 听完整单词 산 | 산 | word | audio/lesson-04/san-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 129 | lesson-04 | vowels | lesson-04-vowel-1 | 听完整单词 몸 | 몸 | word | audio/lesson-04/mom-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 130 | lesson-04 | vowels | lesson-04-vowel-2 | 听完整单词 공 | 공 | word | audio/lesson-04/gong-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 131 | lesson-04 | vowels | lesson-04-vowel-3 | 听完整单词 물 | 물 | word | audio/lesson-04/mul-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 132 | lesson-04 | consonants | lesson-04-consonant-demo-0 | 听示例音节 반 | 반 | syllable | audio/lesson-04/ban-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 133 | lesson-04 | consonants | lesson-04-consonant-demo-1 | 听示例音节 밤 | 밤 | syllable | audio/lesson-04/bam-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 134 | lesson-04 | consonants | lesson-04-consonant-demo-2 | 听示例音节 방 | 방 | syllable | audio/lesson-04/bang-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 135 | lesson-04 | consonants | lesson-04-consonant-demo-3 | 听示例音节 발 | 발 | syllable | audio/lesson-04/bal-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 136 | lesson-04 | words | lesson-04-word-0 | 听完整单词 산 | 산 | word | audio/lesson-04/san-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 137 | lesson-04 | words | lesson-04-word-1 | 听完整单词 몸 | 몸 | word | audio/lesson-04/mom-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 138 | lesson-04 | words | lesson-04-word-2 | 听完整单词 공 | 공 | word | audio/lesson-04/gong-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 139 | lesson-04 | words | lesson-04-word-3 | 听完整单词 물 | 물 | word | audio/lesson-04/mul-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 140 | lesson-04 | builder | lesson-04-builder-0 | 听示例音节 바 | 바 | syllable | audio/lesson-04/ba-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 141 | lesson-04 | builder | lesson-04-builder-1 | 听示例音节 반 | 반 | syllable | audio/lesson-04/ban-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 142 | lesson-04 | builder | lesson-04-builder-2 | 听示例音节 밤 | 밤 | syllable | audio/lesson-04/bam-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 143 | lesson-04 | builder | lesson-04-builder-3 | 听示例音节 방 | 방 | syllable | audio/lesson-04/bang-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 144 | lesson-04 | builder | lesson-04-builder-4 | 听示例音节 발 | 발 | syllable | audio/lesson-04/bal-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 145 | lesson-04 | phrase | lesson-04-phrase | 听完整表达 감사합니다 | 감사합니다 | sentence | audio/lesson-04/gamsahamnida-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 146 | lesson-04 | repeat | lesson-04-repeat | 播放 감사합니다 | 감사합니다 | sentence | audio/lesson-04/gamsahamnida-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 147 | lesson-04 | practice-1 | lesson-04-practice-audio-1 | 播放听力题音频 / 再次播放 | 방 | listening-question | audio/lesson-04/bang-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 148 | lesson-04 | quiz-1 | lesson-04-quiz-audio-1 | 播放听力题音频 / 再次播放 | 밤 | listening-question | audio/lesson-04/bam-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 149 | lesson-04 | quiz-3 | lesson-04-quiz-audio-3 | 播放听力题音频 / 再次播放 | 물 | listening-question | audio/lesson-04/mul-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 150 | lesson-04 | quiz-4 | lesson-04-quiz-audio-4 | 播放听力题音频 / 再次播放 | 감사합니다 | listening-question | audio/lesson-04/gamsahamnida-v2.wav | true | pending | forbidden-device-tts-fallback | P0 |
| 151 | k0-consonant-contrast | group-g | contrast-g-0 | 听完整音节 가 | 가 | initial-example | audio/k0-consonant-contrast/ga.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 152 | k0-consonant-contrast | group-g | contrast-g-1 | 听完整音节 카 | 카 | initial-example | audio/k0-consonant-contrast/ka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 153 | k0-consonant-contrast | group-g | contrast-g-2 | 听完整音节 까 | 까 | initial-example | audio/k0-consonant-contrast/kka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 154 | k0-consonant-contrast | group-g | contrast-g-sequence | 连续听 가—카—까 | 가→카→까 | syllable | audio/k0-consonant-contrast/ga.mp3 | audio/k0-consonant-contrast/ka.mp3 | audio/k0-consonant-contrast/kka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 155 | k0-consonant-contrast | group-d | contrast-d-0 | 听完整音节 다 | 다 | initial-example | audio/k0-consonant-contrast/da.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 156 | k0-consonant-contrast | group-d | contrast-d-1 | 听完整音节 타 | 타 | initial-example | audio/k0-consonant-contrast/ta.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 157 | k0-consonant-contrast | group-d | contrast-d-2 | 听完整音节 따 | 따 | initial-example | audio/k0-consonant-contrast/tta.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 158 | k0-consonant-contrast | group-d | contrast-d-sequence | 连续听 다—타—따 | 다→타→따 | syllable | audio/k0-consonant-contrast/da.mp3 | audio/k0-consonant-contrast/ta.mp3 | audio/k0-consonant-contrast/tta.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 159 | k0-consonant-contrast | group-b | contrast-b-0 | 听完整音节 바 | 바 | initial-example | audio/k0-consonant-contrast/ba.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 160 | k0-consonant-contrast | group-b | contrast-b-1 | 听完整音节 파 | 파 | initial-example | audio/k0-consonant-contrast/pa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 161 | k0-consonant-contrast | group-b | contrast-b-2 | 听完整音节 빠 | 빠 | initial-example | audio/k0-consonant-contrast/ppa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 162 | k0-consonant-contrast | group-b | contrast-b-sequence | 连续听 바—파—빠 | 바→파→빠 | syllable | audio/k0-consonant-contrast/ba.mp3 | audio/k0-consonant-contrast/pa.mp3 | audio/k0-consonant-contrast/ppa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 163 | k0-consonant-contrast | group-j | contrast-j-0 | 听完整音节 자 | 자 | initial-example | audio/k0-consonant-contrast/ja.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 164 | k0-consonant-contrast | group-j | contrast-j-1 | 听完整音节 차 | 차 | initial-example | audio/k0-consonant-contrast/cha.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 165 | k0-consonant-contrast | group-j | contrast-j-2 | 听完整音节 짜 | 짜 | initial-example | audio/k0-consonant-contrast/jja.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 166 | k0-consonant-contrast | group-j | contrast-j-sequence | 连续听 자—차—짜 | 자→차→짜 | syllable | audio/k0-consonant-contrast/ja.mp3 | audio/k0-consonant-contrast/cha.mp3 | audio/k0-consonant-contrast/jja.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 167 | k0-consonant-contrast | group-s | contrast-s-0 | 听完整音节 사 | 사 | initial-example | audio/k0-consonant-contrast/sa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 168 | k0-consonant-contrast | group-s | contrast-s-1 | 听完整音节 싸 | 싸 | initial-example | audio/k0-consonant-contrast/ssa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 169 | k0-consonant-contrast | group-s | contrast-s-sequence | 连续听 사—싸 | 사→싸 | syllable | audio/k0-consonant-contrast/sa.mp3 | audio/k0-consonant-contrast/ssa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 170 | k0-consonant-contrast | challenge-qg | contrast-qg-challenge | 播放听力题音频 / 再次播放 | 까 | listening-question | audio/k0-consonant-contrast/kka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 171 | k0-consonant-contrast | answered-replay-qg | contrast-qg-answered-replay | 播放听力题音频 / 再次播放 | 까 | listening-question | audio/k0-consonant-contrast/kka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 172 | k0-consonant-contrast | retry-qg | contrast-qg-retry | 播放听力题音频 / 再次播放 | 까 | listening-question | audio/k0-consonant-contrast/kka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 173 | k0-consonant-contrast | challenge-qd | contrast-qd-challenge | 播放听力题音频 / 再次播放 | 다→타→따 | listening-question | audio/k0-consonant-contrast/da.mp3 | audio/k0-consonant-contrast/ta.mp3 | audio/k0-consonant-contrast/tta.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 174 | k0-consonant-contrast | answered-replay-qd | contrast-qd-answered-replay | 播放听力题音频 / 再次播放 | 다→타→따 | listening-question | audio/k0-consonant-contrast/da.mp3 | audio/k0-consonant-contrast/ta.mp3 | audio/k0-consonant-contrast/tta.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 175 | k0-consonant-contrast | retry-qd | contrast-qd-retry | 播放听力题音频 / 再次播放 | 다→타→따 | listening-question | audio/k0-consonant-contrast/da.mp3 | audio/k0-consonant-contrast/ta.mp3 | audio/k0-consonant-contrast/tta.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 176 | k0-consonant-contrast | challenge-qb | contrast-qb-challenge | 播放听力题音频 / 再次播放 | 빠 | listening-question | audio/k0-consonant-contrast/ppa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 177 | k0-consonant-contrast | answered-replay-qb | contrast-qb-answered-replay | 播放听力题音频 / 再次播放 | 빠 | listening-question | audio/k0-consonant-contrast/ppa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 178 | k0-consonant-contrast | retry-qb | contrast-qb-retry | 播放听力题音频 / 再次播放 | 빠 | listening-question | audio/k0-consonant-contrast/ppa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 179 | k0-consonant-contrast | challenge-qj | contrast-qj-challenge | 播放听力题音频 / 再次播放 | 차 | listening-question | audio/k0-consonant-contrast/cha.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 180 | k0-consonant-contrast | answered-replay-qj | contrast-qj-answered-replay | 播放听力题音频 / 再次播放 | 차 | listening-question | audio/k0-consonant-contrast/cha.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 181 | k0-consonant-contrast | retry-qj | contrast-qj-retry | 播放听力题音频 / 再次播放 | 차 | listening-question | audio/k0-consonant-contrast/cha.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 182 | k0-consonant-contrast | challenge-qs | contrast-qs-challenge | 播放听力题音频 / 再次播放 | 사 | listening-question | audio/k0-consonant-contrast/sa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 183 | k0-consonant-contrast | answered-replay-qs | contrast-qs-answered-replay | 播放听力题音频 / 再次播放 | 사 | listening-question | audio/k0-consonant-contrast/sa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 184 | k0-consonant-contrast | retry-qs | contrast-qs-retry | 播放听力题音频 / 再次播放 | 사 | listening-question | audio/k0-consonant-contrast/sa.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 185 | k0-consonant-contrast | challenge-qall | contrast-qall-challenge | 播放听力题音频 / 再次播放 | 카 | listening-question | audio/k0-consonant-contrast/ka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 186 | k0-consonant-contrast | answered-replay-qall | contrast-qall-answered-replay | 播放听力题音频 / 再次播放 | 카 | listening-question | audio/k0-consonant-contrast/ka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 187 | k0-consonant-contrast | retry-qall | contrast-qall-retry | 播放听力题音频 / 再次播放 | 카 | listening-question | audio/k0-consonant-contrast/ka.mp3 | false | pending | forbidden-device-tts-fallback | P0 |
| 188 | lesson-05 | left-examples | lesson05-left-examples-0 | 听示例音节 가 | 가 | syllable | audio/lesson-01/ga.mp3 | true | pending | pending-audio-enabled | P0 |
| 189 | lesson-05 | left-examples | lesson05-left-examples-1 | 听示例音节 너 | 너 | syllable | audio/lesson-01/neo-v2.wav | true | pending | pending-audio-enabled | P0 |
| 190 | lesson-05 | left-examples | lesson05-left-examples-2 | 听示例音节 미 | 미 | syllable | audio/lesson-02/mi.mp3 | true | pending | pending-audio-enabled | P0 |
| 191 | lesson-05 | top-examples | lesson05-top-examples-0 | 听示例音节 고 | 고 | syllable | audio/lesson-01/go-v2.wav | true | pending | pending-audio-enabled | P0 |
| 192 | lesson-05 | top-examples | lesson05-top-examples-1 | 听示例音节 누 | 누 | syllable | audio/lesson-01/nu-v2.wav | true | pending | pending-audio-enabled | P0 |
| 193 | lesson-05 | top-examples | lesson05-top-examples-2 | 听示例音节 그 | 그 | syllable | — | false | missing | missing-audio | P1 |
| 194 | lesson-05 | ieung-examples | lesson05-ieung-examples-0 | 听示例音节 아 | 아 | syllable | audio/lesson-01/a.mp3 | true | pending | pending-audio-enabled | P0 |
| 195 | lesson-05 | ieung-examples | lesson05-ieung-examples-1 | 听示例音节 어 | 어 | syllable | audio/lesson-01/eo.mp3 | true | pending | pending-audio-enabled | P0 |
| 196 | lesson-05 | ieung-examples | lesson05-ieung-examples-2 | 听示例音节 오 | 오 | syllable | audio/lesson-01/o.mp3 | true | pending | pending-audio-enabled | P0 |
| 197 | lesson-06 | review | lesson06-review-0 | 听完整音节 애 · 音频待生成/待审核 | 애 | syllable | audio/lesson-02/ae.mp3 | true | pending | rights-and-review-metadata-gap | P1 |
| 198 | lesson-06 | review | lesson06-review-1 | 听完整音节 에 · 音频待生成/待审核 | 에 | syllable | audio/lesson-02/e.mp3 | true | pending | rights-and-review-metadata-gap | P1 |
| 199 | lesson-06 | oa | lesson06-oa-2 | 听完整音节 와 · 音频待生成/待审核 | 와 | syllable | audio/lesson-06/wa.mp3 | false | pending | missing-audio | P1 |
| 200 | lesson-06 | ueo | lesson06-ueo-3 | 听完整音节 워 · 音频待生成/待审核 | 워 | syllable | audio/lesson-06/wo.mp3 | false | pending | missing-audio | P1 |
| 201 | lesson-06 | carrier | lesson06-carrier-4 | 听完整音节 와 · 音频待生成/待审核 | 와 | syllable | audio/lesson-06/wa.mp3 | false | pending | missing-audio | P1 |
| 202 | lesson-06 | carrier | lesson06-carrier-5 | 听完整音节 왜 · 音频待生成/待审核 | 왜 | syllable | audio/lesson-06/wae.mp3 | false | pending | missing-audio | P1 |
| 203 | lesson-06 | carrier | lesson06-carrier-6 | 听完整音节 외 · 音频待生成/待审核 | 외 | syllable | audio/lesson-06/oe.mp3 | false | pending | missing-audio | P1 |
| 204 | lesson-06 | carrier | lesson06-carrier-7 | 听完整音节 워 · 音频待生成/待审核 | 워 | syllable | audio/lesson-06/wo.mp3 | false | pending | missing-audio | P1 |
| 205 | lesson-06 | carrier | lesson06-carrier-8 | 听完整音节 웨 · 音频待生成/待审核 | 웨 | syllable | audio/lesson-06/we.mp3 | false | pending | missing-audio | P1 |
| 206 | lesson-06 | carrier | lesson06-carrier-9 | 听完整音节 위 · 音频待生成/待审核 | 위 | syllable | audio/lesson-06/wi.mp3 | false | pending | missing-audio | P1 |
| 207 | lesson-06 | carrier | lesson06-carrier-10 | 听完整音节 의 · 音频待生成/待审核 | 의 | syllable | audio/lesson-06/ui.mp3 | false | pending | missing-audio | P1 |
| 208 | lesson-06 | carrier | lesson06-carrier-11 | 听完整音节 얘 · 音频待生成/待审核 | 얘 | syllable | audio/lesson-06/yae.mp3 | false | pending | missing-audio | P1 |
| 209 | lesson-06 | carrier | lesson06-carrier-12 | 听完整音节 예 · 音频待生成/待审核 | 예 | syllable | audio/lesson-06/ye.mp3 | false | pending | missing-audio | P1 |
| 210 | lesson-06 | extended | lesson06-extended-13 | 听完整音节 얘 · 音频待生成/待审核 | 얘 | syllable | audio/lesson-06/yae.mp3 | false | pending | missing-audio | P1 |
| 211 | lesson-06 | extended | lesson06-extended-14 | 听完整音节 예 · 音频待生成/待审核 | 예 | syllable | audio/lesson-06/ye.mp3 | false | pending | missing-audio | P1 |
| 212 | lesson-06 | words | lesson06-words-15 | 听完整单词 과자 · 音频待生成/待审核 | 과자 | word | audio/lesson-06/gwaja.mp3 | false | pending | missing-audio | P1 |
| 213 | lesson-06 | words | lesson06-words-16 | 听完整单词 여우 · 音频待生成/待审核 | 여우 | word | audio/lesson-06/yeou.mp3 | false | pending | missing-audio | P1 |
| 214 | lesson-06 | words | lesson06-words-17 | 听完整单词 의자 · 音频待生成/待审核 | 의자 | word | audio/lesson-06/uija.mp3 | false | pending | missing-audio | P1 |
| 215 | lesson-06 | words | lesson06-words-18 | 听完整单词 왜 · 音频待生成/待审核 | 왜 | word | audio/lesson-06/wae.mp3 | false | pending | button-catalog-audio-type-mismatch | P0 |
| 216 | lesson-06 | words | lesson06-words-19 | 听完整单词 예 · 音频待生成/待审核 | 예 | word | audio/lesson-06/ye.mp3 | false | pending | button-catalog-audio-type-mismatch | P0 |
| 217 | lesson-06 | words | lesson06-words-20 | 听完整单词 뭐 · 音频待生成/待审核 | 뭐 | word | audio/lesson-06/mwo.mp3 | false | pending | missing-audio | P1 |
| 218 | lesson-01 | review-lesson01:vowels | review-audio-lesson01:vowels | 播放音频 / 再次播放 | 어 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 219 | lesson-01 | review-lesson01:shadowing | review-audio-lesson01:shadowing | 播放音频 / 再次播放 | 가, 나 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 220 | lesson-01 | review-lesson01:quiz:0 | review-audio-lesson01:quiz:0 | 播放音频 / 再次播放 | 오 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 221 | lesson-01 | review-lesson01:quiz:1 | review-audio-lesson01:quiz:1 | 播放音频 / 再次播放 | 우 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 222 | lesson-01 | review-lesson01:quiz:4 | review-audio-lesson01:quiz:4 | 播放音频 / 再次播放 | 가 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 223 | lesson-02 | review-lesson02:words | review-audio-lesson02:words | 播放音频 / 再次播放 | 나무 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 224 | lesson-02 | review-lesson02:shadowing | review-audio-lesson02:shadowing | 播放音频 / 再次播放 | 나무, 다리, 머리 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 225 | lesson-02 | review-lesson02:quiz:0 | review-audio-lesson02:quiz:0 | 播放音频 / 再次播放 | 이 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 226 | lesson-02 | review-lesson02:quiz:3 | review-audio-lesson02:quiz:3 | 播放音频 / 再次播放 | 머리 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 227 | lesson-03 | review-lesson03:new-letters | review-audio-lesson03:new-letters | 播放音频 / 再次播放 | 여 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 228 | lesson-03 | review-lesson03:greeting | review-audio-lesson03:greeting | 播放音频 / 再次播放 | 안녕하세요 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 229 | lesson-03 | review-lesson03:quiz:0 | review-audio-lesson03:quiz:0 | 播放音频 / 再次播放 | 야 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 230 | lesson-03 | review-lesson03:quiz:3 | review-audio-lesson03:quiz:3 | 播放音频 / 再次播放 | 안녕하세요 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 231 | lesson-04 | review-lesson04:batchim | review-audio-lesson04:batchim | 播放音频 / 再次播放 | 방 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 232 | lesson-04 | review-lesson04:thanks | review-audio-lesson04:thanks | 播放音频 / 再次播放 | 감사합니다 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 233 | lesson-04 | review-lesson04:quiz:0 | review-audio-lesson04:quiz:0 | 播放音频 / 再次播放 | 밤 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 234 | lesson-04 | review-lesson04:quiz:2 | review-audio-lesson04:quiz:2 | 播放音频 / 再次播放 | 물 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
| 235 | lesson-04 | review-lesson04:quiz:3 | review-audio-lesson04:quiz:3 | 播放音频 / 再次播放 | 감사합니다 | listening-question | — | false | missing | forbidden-device-tts-fallback | P0 |
