# Lessons 0–13 Content Integrity and Routing Audit

Baseline: `614fd89c9918d1397e360f9e8a7a100430b5cc4d`

Browser: Google Chrome with a disposable user-data directory. No normal Chrome profile or learning data was read or changed.

## Root cause

1. The displayed Lesson 4 used `stableId=k0-consonant-contrast` and routed to `lesson-consonant-contrast.html`.
2. `lesson-04.html` was a compatibility redirect to Lesson 7, while the displayed Lesson 7 used `stableId=lesson-04`.
3. The two courses did not share one storage key at runtime, but their semantic identities were inverted: the canonical Lesson 4 URL opened Lesson 7, and historical `lesson-04` profile/session data represented Lesson 7.
4. A completed Lesson 4 session reopened directly on its completion screen. Lessons 5–7 and the shared Lessons 8–13 engine had the same completion-only re-entry pattern. This made real source content look absent to returning users even though Lessons 11–13 each contain 13 substantive steps.
5. The active Service Worker used `nikigo-v25-lessons-11-13-sprint`. Its network-first behavior did not return the wrong online page during the audit, but it cached both sides of the inverted Lesson 4 compatibility route and could preserve stale route assets offline.

## Repair

- Lesson 4 now owns `stableId=lesson-04` and canonical `lesson-04.html`.
- Lesson 7 now owns `stableId=lesson-07` and canonical `lesson-07.html`.
- `lesson-consonant-contrast.html` is a one-way legacy redirect to canonical Lesson 4.
- A one-time identity migration snapshots legacy values before writing, then maps old Lesson 4 progress to current `lesson-04` and old Lesson 7 progress to current `lesson-07` without sharing keys.
- Completed Lessons 4–13 now expose a localized review action that resets only the lesson session; the completed profile record and one-time XP remain intact.
- The Service Worker cache is bumped to `nikigo-v27-self-review-gate`.
- Every current lesson exposes a runtime lesson identity, and a permanent visible-content gate checks real first, middle, and pre-completion content rather than step-array length alone.
- `NIKIGO_DEVELOPMENT_RULES.md`, `NIKIGO_DEVELOPMENT_TODO.md`, and the executable test suite now require the permanent self-check, self-correction, and revalidation loop. A Sprint cannot pass on source existence or smoke checks alone.

## Content matrix

| Lesson | Language sampled | Steps | First visible content | Middle content | Pre-completion content | Route/runtime identity |
|---|---:|---:|---|---|---|---|
| 0 | zh | single-page | Hangul map and starting-point choices | Hangul map | reader/scenario entry | `lesson-00` / `lesson-00` |
| 1 | en | 15 | Hangul foundation | syllable choice practice | listening challenge | `lesson-01` / `lesson-01` |
| 2 | vi | 16 | syllables to first words | word listening choice | vowel challenge | `lesson-02` / `lesson-02` |
| 3 | ja | 17 | first greetings | syllable composition | silent-onset challenge | `lesson-03` / `lesson-03` |
| 4 | zh | 15 | plain/aspirated/tense introduction | 바/파/빠 contrast | listening summary | `lesson-04` / `lesson-04` |
| 5 | en | 16 | syllable-block structure | top-bottom layout | structure summary | `lesson-05` / `lesson-05` |
| 6 | vi | 18 | compound-vowel structural preview | block builder | spelling summary | `lesson-06` / `lesson-06` |
| 7 | ja | 13 | basic batchim introduction | 물 final ㄹ | retry gate | `lesson-07` / `lesson-07` |
| 8 | zh | 15 | representative finals | liaison recognition | sound-change check | `lesson-08` / `lesson-08` |
| 9 | en | 15 | greeting scene | self-introduction build | integrated scene challenge | `lesson-09` / `lesson-09` |
| 10 | vi | 15 | K0 review foundation | final-sound matching | integrated K0 challenge | `lesson-10` / `lesson-10` |
| 11 | ja | 13 | name and identity scene | name-introduction build | scoped dialogue challenge | `lesson-11` / `lesson-11` |
| 12 | zh | 13 | country and language scene | origin-expression build | scoped dialogue challenge | `lesson-12` / `lesson-12` |
| 13 | en | 13 | native numbers 1–10 | 6–10 matching | quantity dialogue challenge | `lesson-13` / `lesson-13` |

All 14 routes rendered meaningful content with no blank page, title-only placeholder, wrong-course render, `undefined` text, or measured horizontal overflow. The exact DOM text and URLs are in `CONTENT_INTEGRITY_MATRIX.json`.

Four complete courses were clicked through in four languages, including an incorrect answer and mandatory retry: Lesson 10 (zh), Lesson 11 (en), Lesson 12 (vi), and Lesson 13 (ja). All reached completion with exactly +50 XP once; repeat completion kept XP at 50. Lesson 4 separately passed a full correct route, incorrect answer, retry, course back, browser back, refresh, first completion, repeat completion, and re-learning check.

## Three-layer completion evidence

- Source code exists: all 14 canonical files, identities, localized teaching copy, examples, exercises, reachable answers, summaries, and migration keys pass static executable checks.
- Browser actually renders: all 14 courses were entered by clicking the visible course home in disposable Google Chrome; each has beginning, middle, and pre-completion DOM evidence and screenshots at the required checkpoints.
- User can operate it: the four-language full-course runs and the dedicated Lesson 4 run exercised answers, retry, navigation, refresh, completion, repeated completion, and review re-entry. Console warnings/errors and failed network requests were zero after correction.

## Lesson 4 / Lesson 7 progress combinations

| Legacy user state | Lesson 4 result | Lesson 7 result | Cross-course contamination |
|---|---|---|---|
| neither completed | `lesson-04`, 1/15 | `lesson-07`, 1/13 | none |
| both completed | `lesson-04`, 15/15 + review | `lesson-07`, 13/13 + review | none |
| Lesson 7 only | `lesson-04`, 1/15 | `lesson-07`, 13/13 + review | none |
| Lesson 4 only | `lesson-04`, 15/15 + review | `lesson-07`, 1/13 | none |

The eight real-Chrome screenshots and full localStorage/profile evidence are under `progress-combinations/`.

## Self-correction log

1. The initial audit exposed the Lesson 4/7 semantic identity inversion and completion-only re-entry. Both were treated as blockers and repaired before revalidation.
2. The first permanent-gate Chrome run detected the deprecated mobile-capable meta warning. The standards-compatible meta declaration was added, the Service Worker cache was bumped, and the complete 14-course matrix was rerun to zero warnings/errors.
3. The Lesson 4 repeat-completion screen visibly claimed `+50 XP` even though storage correctly prevented a second award. The visible copy now distinguishes first award from an already-claimed award, and the complete interaction was rerun.
4. The first four-state progress rerun was contaminated by the audit harness clearing storage while an old lesson runtime remained active. Manual storage inspection showed the application preserved a truly blank profile. The harness was corrected to force a neutral course-home reload for every seed; rerun profiles are exactly `[]`, `[lesson-04, lesson-07]`, `[lesson-07]`, and `[lesson-04]`.
5. Historical Lesson 1–4 copy suggested device-voice behavior that the privacy implementation forbids. Effective four-language copy was corrected to describe only exact approved hosted assets; static privacy checks and Chrome evidence were rerun.

## Audio and API invariants

- No MP3/WAV file or catalog record changed.
- Exactly 54 approved/playable assets and their SHA-256 values remain unchanged.
- No audio generation, audio API request, or paid request occurred.
