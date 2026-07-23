# Lesson 13 Classic Focus Integration

## Scope

Lesson 13 now uses the approved Classic Focus Shared Core through a Lesson 13-specific number adapter. The real Sprint course engine remains the owner of content, answers, step identity, session persistence, targeted retry, completion, and XP.

- Lesson identity: `lesson-13`
- Entry: `lesson-13.html`
- Engine: `lesson-sprint-engine.js` with the existing explicit Lesson 13 configuration
- Real steps: 13
- Audio requests: 0
- Completion audio gate: none
- Shared Core changes: none
- Sprint business-engine changes: none

## Explicit adapter mapping

| Step ID | Source type | Classic Focus content type |
|---|---|---|
| `intro` | `intro` | `intro` |
| `one-five` | `concept` | `explanation` |
| `match-one-five` | `match` | `matching` |
| `six-ten` | `concept` | `explanation` |
| `identify-eight` | `choice` | `choice` |
| `match-six-ten` | `match` | `matching` |
| `counter-forms` | `concept` | `explanation` |
| `match-counter` | `match` | `matching` |
| `build-one` | `build` | `builder` |
| `how-many` | `scenario` | `choice` |
| `five-ten` | `match` | `matching` |
| `final-challenge` | `scenario` | `choice` |
| `complete` | `complete` | `completion` |

The adapter validates every ID and source type before rendering. It does not infer a content type from a title or visible text.

## Runtime boundaries

The adapter only maps the explicit Sprint view model into Classic Focus presentation, binds the four-language shell copy, forwards UI actions to the engine, preserves focus after same-step interaction, and returns to the K1 numbers module.

It does not contain answer keys, write sessions, calculate XP, manage wrong IDs, publish review data, determine completion, or decide audio readiness.

The sealed Sprint engine currently preserves wrong IDs and targeted retry but does not publish an app-state `ReviewItem`. This integration preserves that baseline exactly; adding ReviewItem publication would require separately approved business-engine work.

## Scroll and focus contract

- Matching, choice, builder, scenario, feedback, and same-question retry remain near the active task and never force the page to the top.
- A real previous/next/retry-step/restart transition returns to the new step start.
- Feedback or the replacement active control receives focus with `preventScroll`.
- `Escape` focuses the return-to-learning-path control.

## Navigation and audio

The return action resolves to:

`nikigo-app.html?lang=<language>&learnStage=K1&learnModule=k1-numbers-and-quantities#courses`

Lesson 13 declares no audio. The page contains no audio player, unavailable-audio notice, TTS, or external audio request.
