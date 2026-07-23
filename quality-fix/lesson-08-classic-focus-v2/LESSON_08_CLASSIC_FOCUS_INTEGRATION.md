# Lesson 8 Classic Focus Integration V2

## Scope

Lesson 8 now uses the approved Classic Focus shared shell while retaining the existing Sprint engine and explicit Lesson 8 configuration.

- Entry: `lesson-08.html`
- Identity: `lesson-08`
- Session key: `nikigoLessonSession:lesson-08`
- Steps: 15 explicit stable step IDs
- Audio requests: 0
- Completion gate: none
- First completion: +50 XP
- Repeat completion: +0 XP

No other lesson was migrated.

## Runtime integration

`lesson-08-classic-focus.js` is a presentation adapter. It:

- maps every stable Lesson 8 step ID to an explicit Classic Focus content type;
- rejects unexpected step IDs or step-type changes;
- forwards the existing Sprint progress and navigation state to the shared shell;
- binds four-language shell copy;
- preserves the V4 K0 module return route;
- keeps same-step answers, feedback, matching, and retry actions near the current task;
- returns true step changes to the new task start.

The adapter does not read or write answers, XP, wrong IDs, ReviewItems, retry queues, sessions, or completion state. Those remain in `lesson-sprint-engine.js`.

`lesson-sprint-engine.js` only exposes an explicit view model to the adapter and calls a post-render presentation hook. Its answer checks, session normalization, mistake handling, targeted retry, completion, and XP functions are unchanged.

## Content mapping

| Stable step ID | Sprint type | Classic Focus type |
| --- | --- | --- |
| intro | intro | intro |
| seven | concept | explanation |
| closure | concept | explanation |
| group-match | match | matching |
| group-choice | choice | choice |
| linking-rule | concept | explanation |
| link-choice | choice | choice |
| link-match | match | matching |
| nasal-rule | concept | explanation |
| nasal-choice | choice | choice |
| recognize-rule | concept | explanation |
| rule-choice | scenario | choice |
| rule-match | match | matching |
| final-check | choice | choice |
| complete | complete | completion |

No title or visible copy is used to infer a content type.

## Scroll and focus contract

Same-step actions (`answer`, matching selections, builder selections, and builder confirmation) do not call `scrollTo`. After rendering, focus moves without scrolling to the visible feedback or replacement control. This remains reliable for pointer and keyboard activation.

True step changes (`next`, `back`, review progression, and restart) keep the existing product rule: scroll to the new step start and focus the main task container.

The browser test does not require exact pixel equality. It verifies that no forced top-scroll occurs and that the active task or feedback remains visible.

## Visual result

The page loads the shared tokens and shell plus a small Lesson 8 content stylesheet. The legacy Sprint shell stylesheet is not loaded. At 390, 430, 768, and 1440 CSS pixels:

- the page has no horizontal overflow;
- controls remain at least 44 CSS pixels high;
- only one progress indicator and one navigation area are shown;
- headings remain within the approved Classic Focus scale;
- matching, choice, scenario, feedback, retry, and completion states stay in one learning context.

See `screenshots/390-before-after-choice.png` for the strict before/after comparison.

## Audio boundary

The real Lesson 8 configuration declares no audio. The formal page therefore renders no player, no audio-preparation notice, and makes no audio request.
