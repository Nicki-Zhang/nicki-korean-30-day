# Lesson 12 Classic Focus Browser Report

Date: 2026-07-23  
Preview: `http://127.0.0.1:4198/lesson-12.html?lang=zh`

## Covered flow

- all 13 real steps;
- intro, explanation, dialogue, matching, choice, builder and scenario rendering;
- correct and incorrect feedback;
- one real wrong ID carried into targeted retry;
- retry completed before the completion step;
- first completion +50 XP;
- review and repeat completion +0 XP;
- mid-step switching among zh/en/vi/ja;
- refresh and browser-back restoration;
- return to V4 K1 module and browser back to the same Lesson 12 state.

## Responsive results

| Viewport | Horizontal overflow | Minimum control | Result |
|---|---:|---:|---|
| 390×844 | 0 px | 44 px | pass |
| 430×932 | 0 px | 44 px | pass |
| 768×1024 | 0 px | 44 px | pass |
| 1440×1024 | 0 px | 44 px | pass; task card width 856 px |

## State preservation

- language switch kept `origin-response`, `3 / 13`, selected answer and correct feedback;
- Korean target text remained exactly `어느 나라에서 왔어요?` in all four interface languages;
- refresh restored the same step, answer and feedback;
- V4 return URL was `nikigo-app.html?lang=zh&learnStage=K1&learnModule=k1-identity-and-language-background#courses`;
- browser back restored Lesson 12 step 3 and its feedback.

## Scroll and focus

- in-step builder completion retained the reading position (`scrollY=355`);
- the following real step change reset to the new task start (`scrollY=0`);
- correct feedback remained visible and received focus without an extra page-top jump;
- `Escape` moved focus to the learning-path button;
- the focused control had a visible 3 px outline;
- progress exposed `aria-valuetext`, the task region used `aria-live="polite"`, and feedback used `role=status` or `role=alert`.

## Audio and network

- the missing-audio step rendered no `.audioButton` and no `<audio>` element;
- the four localized missing-audio messages were verified;
- the page did not request an audio file;
- no external runtime request or API call was introduced;
- Lesson 12 HTML/CSS/JS returned HTTP 200;
- all 136 Service Worker assets returned HTTP 200.

## Browser health

No browser error or warning was surfaced during navigation, answer, matching, builder, retry, language, refresh, return and responsive checks. The local HTTP log contained no failed Lesson 12 page dependency or external request.

## Preserved evidence

- `comparison-before-after.png`: legacy Sprint opening vs Classic Focus opening
- `after-390-dialogue-missing-audio.png`: dialogue plus non-interactive missing-audio status
- `after-390-builder.png`: builder state
- `after-390-correct-feedback.png`: correct feedback
- `after-390-wrong-feedback.png`: incorrect feedback
- `after-390-targeted-retry.png`: real targeted retry
- `after-390-completion.png`: completion summary
- `after-1440-dialogue.png`: constrained desktop dialogue state

Additional four-language and intermediate responsive screenshots remain local and reproducible; they are not required as durable repository evidence.
