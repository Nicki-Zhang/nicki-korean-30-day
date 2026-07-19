# K0 音频来源、权利与审核缺口

> 这是发布记录完整性检查，不构成法律意见。报告不含API密钥、Token、个人账号或私人配置。

## 汇总

- canonical项目：73
- voiceSource有值：59
- model可追溯：73
- generationDate有值：0
- commercialUseBasis/商业使用记录有值：13
- nativeReviewer有值：0
- approved：0

**结论：当前没有任何音频同时具备完整来源、生成日期、商业使用依据和母语者批准记录。不得把pending当作正式发布批准。**

| id | speechText | source | model | date | commercial basis | status | reviewer | gap |
|---|---|---|---|---|---|---|---|---|
| lesson-01:a | 아 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:eo | 어 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:o | 오 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:u | 우 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:ga | 가 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:na | 나 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:geo | 거 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:go | 고 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:gu | 구 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:neo | 너 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:no | 노 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-01:nu | 누 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:eu | 으 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:i | 이 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:ae | 애 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:e | 에 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:da | 다 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:di | 디 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:ra | 라 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:ri | 리 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:ma | 마 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:mi | 미 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:namu | 나무 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:dari | 다리 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-02:meori | 머리 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:ya | 야 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:yeo | 여 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:ba | 바 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:byeo | 벼 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:sa | 사 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:syeo | 셔 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:a | 아 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:bada | 바다 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:saram | 사람 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:annyeong | 안녕 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-03:annyeonghaseyo | 안녕하세요 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:san | 산 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:mom | 몸 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:gong | 공 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:mul | 물 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:ba | 바 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:ban | 반 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:bam | 밤 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:bang | 방 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:bal | 발 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-04:gamsahamnida | 감사합니다 | apple-system-ko-KR-yuna | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ga | 가 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ka | 카 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:kka | 까 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:da | 다 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ta | 타 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:tta | 따 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ba | 바 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:pa | 파 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ppa | 빠 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ja | 자 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:cha | 차 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:jja | 짜 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:sa | 사 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| k0-consonant-contrast:ssa | 싸 | — | gpt-4o-mini-tts | — | — | pending | — | generationDate, commercialUseBasis, nativeReviewer, approval |
| lesson-06:wa | 와 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:wae | 왜 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:oe | 외 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:wo | 워 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:we | 웨 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:wi | 위 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:ui | 의 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:yae | 얘 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:ye | 예 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:mwo | 뭐 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:gwaja | 과자 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:yeou | 여우 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |
| lesson-06:uija | 의자 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts | — | pending-documentation | pending | — | generationDate, nativeReviewer, approval |

## 特别风险

- 16条 `apple-system-ko-KR-yuna` 导出文件记录了系统声源，但没有可核验的生成日期或商业使用依据；建议用明确授权/条款记录的托管声源重新制作，并保持pending。
- 30条现有OpenAI来源文件没有逐条model/date/commercialUseBasis字段，且无nativeReviewer。
- 对比课14条和第6课13条尚未生成；manifest中的planned source不等于已经产生的文件或既得权利记录。
- 若未来采用真人录音，必须另行记录voiceTalent、consentRecord、commercialUseRecord。
