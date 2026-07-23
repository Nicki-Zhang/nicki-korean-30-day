# Lesson 4 Classic Focus Integration

## Scope

This local integration connects the existing Lesson 4 consonant-contrast engine to Classic Focus Shared Core V1. It does not change lesson identity, content, answers, completion rules, XP, review logic, audio catalog data, or other lessons.

## Runtime identity and flow

- Canonical route: `lesson-04.html`
- Stable lesson ID: `lesson-04`
- Session key: `nikigoLessonSession:lesson-04`
- Legacy route: `lesson-consonant-contrast.html` redirects to the canonical route
- Actual screen count: 15
- Completion award: +50 XP on first completion, +0 XP on repeat completion

| Screen | Existing type | Existing responsibility | Classic Focus content type |
| ---: | --- | --- | --- |
| 1 | Intro | Goals and course orientation | `intro` |
| 2 | Concept | Plain, aspirated, and tense overview | `explanation` |
| 3 | Group ㄱ | 가 / 카 / 까 comparison | `comparison` |
| 4 | Quiz qg | Identify 까 | `choice` |
| 5 | Group ㄷ | 다 / 타 / 따 comparison | `comparison` |
| 6 | Quiz qd | Identify the aspirated sound | `choice` |
| 7 | Group ㅂ | 바 / 파 / 빠 comparison | `comparison` |
| 8 | Quiz qb | Classify 빠 | `choice` |
| 9 | Group ㅈ | 자 / 차 / 짜 comparison | `comparison` |
| 10 | Quiz qj | Identify 차 | `choice` |
| 11 | Group ㅅ | 사 / 싸 comparison and embedded qS | `comparison` |
| 12 | Quiz qall | Classify 카 | `choice` |
| 13 | Retry | Targeted missed-item practice | `retry` |
| 14 | Summary | Four retained listening principles | `explanation` |
| 15 | Complete | Saved completion and repeat entry | `completion` |

The adapter passes explicit `lessonId`, `currentStep`, `totalSteps`, `language`, `title`, `stepLabel`, `progress`, previous/next state, audio availability, and content type to Shared Core. No field is inferred from a title or visible string.

## State and answer boundaries

- Question truth remains in the existing `QUESTIONS` records.
- `applyAnswer` retains missed question IDs for targeted retry.
- `applyRetryAnswer` removes an item only after a correct retry.
- Required quiz screens cannot advance before an answer.
- The embedded `qs` task cannot advance until answered.
- Session restore and profile progress continue through the existing app-state compatible interfaces.

## Audio readiness

Namespace: `k0-consonant-contrast`

| Text | Type | Catalog | Playable | Local asset |
| --- | --- | --- | --- | --- |
| 가 | `initial-example` | approved / available | yes | `ga.mp3` |
| 카 | `initial-example` | approved / available | yes | `ka.mp3` |
| 까 | `initial-example` | approved / available | yes | `kka.mp3` |
| 다 | `initial-example` | approved / available | yes | `da.mp3` |
| 타 | `initial-example` | approved / available | yes | `ta.mp3` |
| 따 | `initial-example` | approved / available | yes | `tta.mp3` |
| 바 | `initial-example` | approved / available | yes | `ba.mp3` |
| 파 | `initial-example` | approved / available | yes | `pa.mp3` |
| 빠 | `initial-example` | approved / available | yes | `ppa.mp3` |
| 자 | `initial-example` | approved / available | yes | `ja.mp3` |
| 차 | `initial-example` | approved / available | yes | `cha.mp3` |
| 짜 | `initial-example` | approved / available | yes | `jja.mp3` |
| 사 | `initial-example` | approved / available | yes | `sa.mp3` |
| 싸 | `initial-example` | approved / available | yes | `ssa.mp3` |

Exact counts: approved 14, playable 14, pending 0, missing 0. Every request is gated through the existing exact-text and exact-type `canPlayAudio` path. No TTS, external audio, or replacement recording is used. An unavailable state remains fail-closed, but the current approved production dataset has no unavailable Lesson 4 request.

## Shared Core impact

No new Shared Core content type is required. The existing adapter contract already supports Lesson 4 through `intro`, `explanation`, `comparison`, `choice`, `retry`, and `completion`. Lesson-specific pronunciation grouping, answer data, player requests, and retry rules stay in the Lesson 4 adapter.

## Service Worker

The existing offline asset list already contains Lesson 4, Shared Core, the Lesson 4 adapter styles and script, and all 14 local audio files. Only the cache version is advanced so the new Lesson 4 presentation is not served from an older shell cache.

## Protected boundaries

This work does not modify:

- `course-catalog.js`
- `app-state.js`
- `audio-catalog.js`
- any MP3 or WAV file
- Lesson 6 completion gating
- Lesson 7 or Lesson 11 business logic
- any other lesson
- `CODEX_HANDOFF.md`
