# Nikigo 音频生成与人工审核队列

本文件只记录待办，不代表已生成或已批准。第6课当前为开发预览；以下按钮必须保持禁用，且不得使用设备 TTS、相似文字或答案文字 fallback。

| id | lessonId | targetSymbol | displayText | speechText | audioType | pronunciationType | file | voiceSource | model | generationDate | commercialUseBasis | reviewStatus | nativeReviewer | reviewNotes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| wa | lesson-06 | ㅘ | 와 | 와 | syllable | full-syllable | wa.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 待生成；需韩语母语者审核。 |
| wae | lesson-06 | ㅙ | 왜 | 왜 | syllable | full-syllable | wae.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 与 외、웨自然对比，禁止夸大差异。 |
| oe | lesson-06 | ㅚ | 외 | 외 | syllable | full-syllable | oe.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 与 왜、웨自然对比。 |
| wo | lesson-06 | ㅝ | 워 | 워 | syllable | full-syllable | wo.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 待生成；需韩语母语者审核。 |
| we | lesson-06 | ㅞ | 웨 | 웨 | syllable | full-syllable | we.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 与 왜、외自然对比。 |
| wi | lesson-06 | ㅟ | 위 | 위 | syllable | full-syllable | wi.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 待生成；需韩语母语者审核。 |
| ui | lesson-06 | ㅢ | 의 | 의 | syllable | full-syllable | ui.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 单独承载音节与词首读法分别审核。 |
| yae | lesson-06 | ㅒ | 얘 | 얘 | syllable | full-syllable | yae.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 不夸大与 애 的差异。 |
| ye | lesson-06 | ㅖ | 예 | 예 | syllable | full-syllable | ye.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 不夸大与 에 的差异。 |
| mwo | lesson-06 |  | 뭐 | 뭐 | word | full-word | mwo.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 只审核完整单词。 |
| gwaja | lesson-06 |  | 과자 | 과자 | word | full-word | gwaja.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 只审核完整单词。 |
| yeou | lesson-06 |  | 여우 | 여우 | word | full-word | yeou.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 只审核完整单词。 |
| uija | lesson-06 |  | 의자 | 의자 | word | full-word | uija.mp3 | openai-gpt-4o-mini-tts | gpt-4o-mini-tts |  | pending-documentation | pending |  | 优先审核词首ㅢ的自然实现。 |

正式发布前必须补齐 `generationDate`、合法的 `commercialUseBasis`、`nativeReviewer` 与 `reviewNotes`，并将审核结论写回 manifest。只有 `approved` 项目可启用播放。
