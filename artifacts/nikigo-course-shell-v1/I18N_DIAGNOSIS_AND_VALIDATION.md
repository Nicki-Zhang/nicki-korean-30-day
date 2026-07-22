# Course Shell V1 Four-Language Diagnosis and Validation

## P0 diagnosis

The language selector and render lifecycle were working. The mixed-language page came from three combined defects:

1. Shell controls had a four-language dictionary, but lesson task copy, explanations, feedback, completion summaries, and the Lesson 6 gate were hard-coded in Chinese fixture render functions.
2. Several accessible Shell labels existed only as Chinese initialization text in `index.html` and were not rebound during render.
3. `local()` and `ui()` silently fell back to English when a requested translation was absent, hiding incomplete translation data.

The defect was not caused by cached initialization copy or a missing rerender. The existing change handler already rerendered while retaining `requestedState`, `answerState`, and `buildTokens`.

## Fix

- `course-shell-copy.js` now owns 44 Shell keys, 86 localized fixture keys, and four-language Stage/Module/Lesson metadata.
- Every localized record must contain non-empty `zh`, `en`, `vi`, and `ja` values.
- Missing or unsupported languages throw a development error; there is no silent English fallback.
- Rendering uses stable copy keys. Korean targets remain unchanged strings outside the localization layer.
- Shell ARIA labels, dialog copy, phase labels, actions, lesson tasks, feedback, completion, and Lesson 6 gate all rerender on language change.
- The URL `lang` value and `document.documentElement.lang` update together.

## Automated coverage

`validate-course-shell-i18n.mjs` verifies:

- all Shell and fixture keys have four languages;
- known key/value pairs for zh, en, vi, and ja;
- 112 combinations covering every state of Lesson 7, Lesson 10, Lesson 11, and Lesson 6 in all four languages;
- the rendered state contains its expected translated marker;
- Korean target text is identical across languages;
- choice selection/feedback, build tokens, retry state, and step progress survive an in-place language switch;
- URL and root `lang` update without localStorage writes;
- no answer data is inspected;
- console errors, failed network requests, and external requests remain zero.

No Chinese-character heuristic is used to judge Japanese output. Assertions use known translation keys and expected values.

## Screenshot evidence

- Lesson 7 choice: `390-lesson07-choice-{zh,en,vi,ja}.png`
- Lesson 11 scenario: `390-lesson11-scenario-{zh,en,vi,ja}.png`
- Lesson 6 gate: `390-lesson6-gate-{zh,en,vi,ja}.png`
- Desktop English: `1440-lesson11-dialogue-en.png`
- State preservation: `390-language-switch-before-zh.png` and `390-language-switch-after-en.png`
