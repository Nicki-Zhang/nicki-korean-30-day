# K0 音频分批生成计划

> 本计划不调用API、不生成文件、不估算价格。任何生成产物仍须保持pending并由韩语母语者审核。每个生成批次不超过20条。

## 统计

- 审计播放器入口：235
- 现有canonical文件：46
- 技术可解码物理文件：46
- approved：0
- pending canonical：73
- canonical缺失：27
- 明确错误/语义映射：2
- 建议重新生成：16
- 建议新增：50
- 计划生成文本总字符数：97

## Batch 0（代码修复，不生成）

条数：**4**

| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |
|---|---|---|---|---|---:|---|---|---|
| code-remove-device-tts | 0–4/review | — | — | — | 0 | 否 | 否 | 移除四处speechSynthesis并建立fail-closed |
| code-review-gate | 0–5 | — | — | — | 0 | 否 | 否 | pending/rejected不得启用按钮 |
| code-lesson06-semantic | 6 | 왜、예 | word/syllable | — | 2 | 否 | 否 | 解决词汇页按钮与13条队列类型冲突 |
| code-canonical-types | 1–4/7 | — | — | — | 0 | 否 | 否 | 把旧vowel/batchim/sound-change统一为严格audioType |

## Batch 1（核心元音承载音节）

条数：**2**

| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |
|---|---|---|---|---|---:|---|---|---|
| yo | 0 | 요 | vowel-carrier | yo.mp3 | 1 | 否 | 是 | 口型与y滑音 |
| yu | 0 | 유 | vowel-carrier | yu.mp3 | 1 | 否 | 是 | 口型与y滑音 |

## Batch 2（核心辅音示例与对比）

条数：**16**

| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |
|---|---|---|---|---|---:|---|---|---|
| ga | 0/4 | 가 | initial-example | ga.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ka | 0/4 | 카 | initial-example | ka.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| kka | 0/4 | 까 | initial-example | kka.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| da | 0/4 | 다 | initial-example | da.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ta | 0/4 | 타 | initial-example | ta.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| tta | 0/4 | 따 | initial-example | tta.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ba | 0/4 | 바 | initial-example | ba.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| pa | 0/4 | 파 | initial-example | pa.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ppa | 0/4 | 빠 | initial-example | ppa.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ja | 0/4 | 자 | initial-example | ja.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| cha | 0/4 | 차 | initial-example | cha.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| jja | 0/4 | 짜 | initial-example | jja.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| sa | 0/4 | 사 | initial-example | sa.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ssa | 0/4 | 싸 | initial-example | ssa.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| ha | 0/4 | 하 | initial-example | ha.mp3 | 1 | 否 | 是 | 普通/送气/紧音、气流与紧张度 |
| geu | 5 | 그 | syllable | geu.mp3 | 1 | 否 | 是 | 第5课上下结构完整音节 |

## Batch 3（替换系统导出核心音频）

条数：**16**

| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |
|---|---|---|---|---|---:|---|---|---|
| lesson-01-geo | lesson-01 | 거 | syllable | geo-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-01-go | lesson-01 | 고 | syllable | go-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-01-gu | lesson-01 | 구 | syllable | gu-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-01-neo | lesson-01 | 너 | syllable | neo-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-01-no | lesson-01 | 노 | syllable | no-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-01-nu | lesson-01 | 누 | syllable | nu-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-04-san | lesson-04 | 산 | word | san-v3.mp3 | 1 | 是 | 是 | 받침 ㄴ |
| lesson-04-mom | lesson-04 | 몸 | word | mom-v3.mp3 | 1 | 是 | 是 | 받침 ㅁ |
| lesson-04-gong | lesson-04 | 공 | word | gong-v3.mp3 | 1 | 是 | 是 | 받침 ㅇ |
| lesson-04-mul | lesson-04 | 물 | word | mul-v3.mp3 | 1 | 是 | 是 | 받침 ㄹ |
| lesson-04-ba | lesson-04 | 바 | syllable | ba-v3.mp3 | 1 | 否 | 是 | 自然完整音节/单词 |
| lesson-04-ban | lesson-04 | 반 | syllable | ban-v3.mp3 | 1 | 是 | 是 | 받침 ㄴ |
| lesson-04-bam | lesson-04 | 밤 | syllable | bam-v3.mp3 | 1 | 是 | 是 | 받침 ㅁ |
| lesson-04-bang | lesson-04 | 방 | syllable | bang-v3.mp3 | 1 | 是 | 是 | 받침 ㅇ |
| lesson-04-bal | lesson-04 | 발 | syllable | bal-v3.mp3 | 1 | 是 | 是 | 받침 ㄹ |
| lesson-04-gamsahamnida | lesson-04 | 감사합니다 | sentence | gamsahamnida-v3.mp3 | 5 | 是 | 是 | 鼻音化：합니다 → [함니다] |

## Batch 4（第6课13条）

条数：**13**

| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |
|---|---|---|---|---|---:|---|---|---|
| wa | 6 | 와 | syllable | wa.mp3 | 1 | 否 | 否 | Not generated; native review required. |
| wae | 6 | 왜 | syllable | wae.mp3 | 1 | 是 | 否 | Not generated; compare naturally with 외 and 웨. |
| oe | 6 | 외 | syllable | oe.mp3 | 1 | 是 | 否 | Not generated; compare naturally with 왜 and 웨. |
| wo | 6 | 워 | syllable | wo.mp3 | 1 | 否 | 否 | Not generated; native review required. |
| we | 6 | 웨 | syllable | we.mp3 | 1 | 是 | 否 | Not generated; compare naturally with 왜 and 외. |
| wi | 6 | 위 | syllable | wi.mp3 | 1 | 否 | 否 | Not generated; native review required. |
| ui | 6 | 의 | syllable | ui.mp3 | 1 | 是 | 否 | Not generated; review isolated carrier separately from 의자. |
| yae | 6 | 얘 | syllable | yae.mp3 | 1 | 是 | 否 | Not generated; do not exaggerate contrast with 애. |
| ye | 6 | 예 | syllable | ye.mp3 | 1 | 是 | 否 | Not generated; do not exaggerate contrast with 에. |
| mwo | 6 | 뭐 | word | mwo.mp3 | 1 | 否 | 否 | Not generated; full word only. |
| gwaja | 6 | 과자 | word | gwaja.mp3 | 2 | 否 | 否 | Not generated; full word only. |
| yeou | 6 | 여우 | word | yeou.mp3 | 2 | 否 | 否 | Not generated; full word only. |
| uija | 6 | 의자 | word | uija.mp3 | 2 | 是 | 否 | Not generated; review word-initial ㅢ realization. |

## Batch 5（可选字母名称）

条数：**19**

| id | lesson | speechText | audioType | file | chars | 音变/特殊 | 可安全复用 | 人工审核重点/代码依赖 |
|---|---|---|---|---|---:|---|---|---|
| giyeok | 0 | 기역 | letter-name | giyeok.mp3 | 2 | 否 | 否 | 字母ㄱ名称，自然完整读法 |
| nieun | 0 | 니은 | letter-name | nieun.mp3 | 2 | 否 | 否 | 字母ㄴ名称，自然完整读法 |
| digeut | 0 | 디귿 | letter-name | digeut.mp3 | 2 | 否 | 否 | 字母ㄷ名称，自然完整读法 |
| rieul | 0 | 리을 | letter-name | rieul.mp3 | 2 | 否 | 否 | 字母ㄹ名称，自然完整读法 |
| mieum | 0 | 미음 | letter-name | mieum.mp3 | 2 | 否 | 否 | 字母ㅁ名称，自然完整读法 |
| bieup | 0 | 비읍 | letter-name | bieup.mp3 | 2 | 否 | 否 | 字母ㅂ名称，自然完整读法 |
| siot | 0 | 시옷 | letter-name | siot.mp3 | 2 | 否 | 否 | 字母ㅅ名称，自然完整读法 |
| ieung | 0 | 이응 | letter-name | ieung.mp3 | 2 | 否 | 否 | 字母ㅇ名称，自然完整读法 |
| jieut | 0 | 지읒 | letter-name | jieut.mp3 | 2 | 否 | 否 | 字母ㅈ名称，自然完整读法 |
| hieut | 0 | 히읗 | letter-name | hieut.mp3 | 2 | 否 | 否 | 字母ㅎ名称，自然完整读法 |
| kieuk | 0 | 키읔 | letter-name | kieuk.mp3 | 2 | 否 | 否 | 字母ㅋ名称，自然完整读法 |
| tieut | 0 | 티읕 | letter-name | tieut.mp3 | 2 | 否 | 否 | 字母ㅌ名称，自然完整读法 |
| pieup | 0 | 피읖 | letter-name | pieup.mp3 | 2 | 否 | 否 | 字母ㅍ名称，自然完整读法 |
| chieut | 0 | 치읓 | letter-name | chieut.mp3 | 2 | 否 | 否 | 字母ㅊ名称，自然完整读法 |
| ssang-giyeok | 0 | 쌍기역 | letter-name | ssang-giyeok.mp3 | 3 | 否 | 否 | 字母ㄲ名称，自然完整读法 |
| ssang-digeut | 0 | 쌍디귿 | letter-name | ssang-digeut.mp3 | 3 | 否 | 否 | 字母ㄸ名称，自然完整读法 |
| ssang-bieup | 0 | 쌍비읍 | letter-name | ssang-bieup.mp3 | 3 | 否 | 否 | 字母ㅃ名称，自然完整读法 |
| ssang-siot | 0 | 쌍시옷 | letter-name | ssang-siot.mp3 | 3 | 否 | 否 | 字母ㅆ名称，自然完整读法 |
| ssang-jieut | 0 | 쌍지읒 | letter-name | ssang-jieut.mp3 | 3 | 否 | 否 | 字母ㅉ名称，自然完整读法 |

## 生成门禁

Batch 0完成、严格测试通过、产品确认 `왜/예` 的词/音节语义后，才允许启动Batch 1。生成只走手动workflow_dispatch，Artifact审阅后不得直接写main。
