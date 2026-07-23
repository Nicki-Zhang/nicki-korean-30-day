# Formal Lesson 11 Classic Focus Browser Report

## Preview

`http://127.0.0.1:4191/lesson-11.html?lang=zh`

## Real-browser coverage

The in-app browser exercised the formal page against the real `lesson-11.js`, `app-state.js`, and catalog interfaces.

### Course flow

- All 13 real steps were reached in order.
- Required choices, matching, and sentence building kept Continue disabled until completion.
- A wrong response showed non-revealing feedback and preserved the mistake after the subsequent correct answer.
- Finishing the remaining real steps entered targeted mistake review.
- Correcting the queued mistake reached the real completion step.
- First completion displayed `首次完成 +50 XP`.
- A complete second run displayed `重复完成 +0 XP`.

### State continuity

- Refresh preserved step 2, all three revealed dialogue turns, and the selected auxiliary language.
- Browser Back restored step 2 from step 3 with dialogue history intact.
- Exiting to Learning generated:
  `nikigo-app.html?lang=zh&learnStage=K1&learnModule=k1-identity-and-language-background#courses`
- Browser Back from Learning restored the Lesson 11 session.
- Escape closed the exit-confirmation dialog and returned focus to the exit control.

### Four languages

At the same choice state (`3 / 13`), zh/en/vi/ja all rendered their expected approved copy. Korean target content stayed unchanged, and no Chinese shell copy remained in en/vi/ja. A separate zh → en switch after a wrong response kept the step, chosen answer, disabled choice state, error feedback, and retry action intact.

### Responsive checks

| Viewport | document width | scroll width | Horizontal overflow |
| --- | ---: | ---: | --- |
| 390 × 844 | 390 | 390 | none |
| 430 × 932 | 430 | 430 | none |
| 768 × 1024 | 768 | 768 | none |
| 1440 × 1024 | 1440 | 1440 | none |

All primary controls remained at least 44 px. Mobile uses one column; desktop limits the learning card rather than stretching it across the viewport.

### Accessibility and motion

- One H1 and one main learning region are present per step.
- Course progress uses a progressbar.
- Choice, matching, build, and navigation controls use native buttons and labelled groups/regions.
- Exit uses a labelled native dialog.
- Keyboard focus is visibly styled on interactive controls.
- Escape closes the exit dialog.
- `prefers-reduced-motion` removes entry animation and transitions without hiding state.

### Audio and network

- Lesson 11 resolves zero approved playable audio records.
- The page shows one compact `标准音频准备中` status.
- It renders no fake play, speed, TTS, recording, or scoring control.
- Browser diagnostics returned zero console errors/warnings.
- No unexpected or external network request was observed; the runtime contains no `fetch`, TTS, microphone, recording, upload, or external API path.

## Evidence

- `formal-390-intro.png`
- `formal-390-dialogue.png`
- `formal-390-choice-zh.png`
- `formal-390-choice-en.png`
- `formal-390-choice-vi.png`
- `formal-390-choice-ja.png`
- `formal-390-build-correct.png`
- `formal-390-wrong-feedback.png`
- `formal-390-targeted-retry.png`
- `formal-390-completion-first.png`
- `formal-390-keyboard-focus.png`
- `formal-430-choice.png`
- `formal-768-choice.png`
- `formal-1440-choice.png`
- `three-way-opening-comparison.png`

## Result

Passed with zero P0, P1, or P2 visual or interaction findings.
