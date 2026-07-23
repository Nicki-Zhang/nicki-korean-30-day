# Lesson 8 Classic Focus Playwright Report

## Environment

- URL: `http://127.0.0.1:4196/lesson-08.html?lang=zh`
- Browser: Chromium through Playwright
- Viewports: 390×844, 430×932, 768×1024, 1440×1024
- Languages: zh, en, vi, ja

## Lesson 8 flow

The browser completed the real 15-step Sprint flow with one intentional wrong answer.

- 15 unique stable step IDs were visited.
- The incorrect item entered the existing targeted retry flow.
- The item was removed from the mistake queue only after a correct retry.
- Completion was reached without skipping a required step.
- First completion produced 50 total XP.
- A complete second run left XP at 50 and displayed the repeat-completion copy.
- The existing Sprint profile did not publish a new ReviewItem; this behavior was not changed by the UI adapter.

Intro, explanation, matching, choice, scenario, correct feedback, incorrect feedback, targeted retry, and completion were captured in `screenshots/`.

## Language state

On the same interactive step, switching zh → en → vi → ja → zh retained:

- internal step ID;
- selected option;
- correctness and feedback state;
- mistake and retry state;
- Korean target text.

`document.documentElement.lang` changed to `zh-CN`, `en`, `vi`, and `ja` as appropriate. No mixed auxiliary-language copy or horizontal overflow was observed.

## Scroll and keyboard

Choice and matching actions on the current step made zero forced `scrollTo` calls. Feedback remained visible. The next real step made one top-scroll call and focused `#lessonStage`.

Keyboard Enter on an answer:

- rendered the same answer result as pointer input;
- focused the feedback region after rendering;
- kept the feedback visible;
- retained `scrollY = 0` in the measured compact state.

Escape moved focus to the return-to-learning-path control without changing the step. Focus rings were visible. The page exposes a progressbar and named navigation/language controls.

## Responsive measurements

| Viewport | Horizontal overflow | Main card width | Heading size | Minimum tested control |
| --- | ---: | ---: | ---: | ---: |
| 390×844 | 0 px | 362 px | 28 px | 44×44 px |
| 430×932 | 0 px | 402 px | 28 px | 44 px high |
| 768×1024 | 0 px | 724 px | 30.72 px | 44 px high |
| 1440×1024 | 0 px | 856 px | 38 px | 44 px high |

The reduced-motion media query removes meaningful transition duration without removing state information or controls.

## Routing

The V4 module route opened Lesson 8. Both the Classic Focus home action and browser Back returned to:

`nikigo-app.html?lang=zh&learnStage=K0&learnModule=k0-batchim-and-sound-changes#courses`

## Network and console

The clean Lesson 8 run loaded only same-origin HTML, CSS, JavaScript, and the local Nikigo mark. Every recorded request returned HTTP 200.

- Console errors: 0
- Console warnings: 0
- Audio requests: 0
- External requests: 0
- API requests: 0
- Cost: 0

The raw clean records are `network.log` and `console.log`.

## Shared regressions

- Lesson 4: 15 steps; 14/14 approved audio paths resolved locally and returned HTTP 200.
- Lesson 6: preview/audio-review gate remained visible; no enabled audio control; no completion rule was changed.
- Lesson 7: Classic Focus page loaded at 1/13 with no horizontal overflow; its scroll contract remains covered by the existing regression suite.
- Lesson 11: Classic Focus page loaded at 1/13; Mission Journey resources were not loaded; no enabled audio control.
- All 14 catalog entries and current routes passed the architecture suite.

## Service Worker

A clean Service Worker installation cached 133 declared resources. The cache contained:

- `lesson-08.html`
- `lesson-08.js`
- `lesson-08-classic-focus.js`
- `lesson-08-classic-focus.css`
- all three shared Classic Focus resources
- `lesson-sprint-engine.js`

All 133 declared Service Worker assets returned HTTP 200 during validation.

