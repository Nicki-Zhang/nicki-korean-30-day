# Lesson 5 Classic Focus Integration

## Scope

Lesson 5 now uses the approved Classic Focus shell while retaining the existing
Lesson 5 engine as the sole owner of content, answers, progression, persistence,
retry, completion, and XP.

- Entry: `lesson-05.html`
- Stable lesson ID: `lesson-05`
- Formal session key: `nikigoLessonSession:lesson-05`
- Baseline: `c30bb04864b6278841b4d613dd66386faef2e527`
- Preview: `http://127.0.0.1:4200/lesson-05.html?lang=zh`
- Formal screens: 16, unchanged
- First completion: +50 XP
- Repeat completion: +0 XP
- Completion audio gate: none

## Runtime ownership

`lesson-05.js` remains unchanged and owns:

- the formal 16-screen sequence
- localized course content
- answer data and correctness
- required-answer gates
- `wrong IDs` and targeted retry
- session normalization and persistence
- progress and completion
- the +50/+0 XP rule
- exact approved audio resolution and playback

`lesson-05-classic-focus.js` is a presentation adapter. It:

- validates the exact `lesson-05` identity and all 16 explicit step IDs
- maps each step ID to a presentation content type
- sends current progress and navigation state to the shared shell
- adds semantic Diagram and Split presentation
- restores same-step scroll and focus after engine re-render
- sends real navigation actions back to the formal engine
- rebinds presentation when the auxiliary language changes

It does not read or write storage, judge answers, calculate XP, manage wrong
IDs, resolve audio approval, or infer a step from visible text.

## Explicit 16-step mapping

| # | Stable step ID | Explicit content type | Presentation |
|---:|---|---|---|
| 1 | `intro` | `intro` | Classic Focus introduction |
| 2 | `block` | `structure` | semantic Diagram |
| 3 | `left-concept` | `structure` | left/right Diagram |
| 4 | `left-examples` | `word` | examples and approved audio |
| 5 | `left-practice` | `choice` | required choice |
| 6 | `top-concept` | `structure` | top/bottom Diagram |
| 7 | `top-examples` | `word` | examples and approved audio |
| 8 | `top-practice` | `choice` | required choice |
| 9 | `ieung-concept` | `structure` | placeholder-ㅇ Diagram |
| 10 | `ieung-examples` | `word` | examples and approved audio |
| 11 | `builder` | `builder` | formal syllable builder |
| 12 | `split` | `matching` | semantic Split enhancement |
| 13 | `challenge` | `choice` | formal five-question challenge |
| 14 | `retry` | `retry` | formal targeted retry |
| 15 | `summary` | `explanation` | summary |
| 16 | `complete` | `completion` | formal completion result |

The order, IDs, and gate behavior are unchanged.

## Diagram and Split renderer placement

The approved prototype proved that Diagram and Split can be presentation-only.
The current implementation keeps both in the Lesson 5 adapter and
`lesson-05.css`, rather than expanding Shared Core.

Reason:

- the semantic Diagram props are currently bound to Lesson 5's four explicit
  structure steps
- Split enhancement reads the formal Lesson 5 `SPLIT_QUESTIONS` and engine
  result state
- no second formal course currently needs this exact interface

This avoids adding speculative shared abstractions. A future course may justify
promotion only after it supplies explicit renderer props without Lesson 5 IDs,
copy, answers, or state ownership.

## Scroll and focus contract

- Same-step selection, feedback, builder operation, Split answer, and current
  retry preserve the user's task area.
- The adapter restores the previous scroll position and focuses the updated
  control or feedback with `preventScroll`.
- True previous/next step changes, challenge-question changes, targeted-retry
  advancement, and course restart retain the engine's existing top reset.

## Protected surfaces

The integration does not change:

- `lesson-05.js`
- `course-catalog.js`
- `app-state.js`
- `audio-catalog.js`
- approved audio files or SHA values
- Shared Core tokens, shell CSS, or shell JS
- the Homepage, V4 Learning page, or other lessons
