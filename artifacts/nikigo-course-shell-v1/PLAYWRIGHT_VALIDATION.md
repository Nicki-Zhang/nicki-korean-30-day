# Course Shell V1 Browser Validation

## Result

PASS. The isolated prototype was validated in a real local Google Chrome session and through Playwright MCP. No formal course file or real user state was used or changed.

Local preview: `http://127.0.0.1:4181/artifacts/nikigo-course-shell-v1/index.html`

Useful examples:

- Lesson 7 introduction: `?course=lesson07&state=intro&lang=zh`
- Lesson 11 choice: `?course=lesson11&state=choice&lang=zh`
- Lesson 11 build: `?course=lesson11&state=build&lang=zh`
- Lesson 10 completion: `?course=lesson10&state=complete-first&lang=zh`
- Lesson 6 gate: `?course=lesson06&state=gate&lang=zh`
- Three-type comparison: `comparison.html`

## Playwright MCP acceptance

| Viewport | Course/state | Language | Overflow | Targets below 44 px | Main/progress semantics |
|---|---|---|---|---|---|
| 390 × 844 | Lesson 7 introduction | zh | none | none | present |
| 390 × 844 | Lesson 7 choice | en | none | none | present |
| 390 × 844 | Lesson 11 build | vi | none | none | present |
| 390 × 844 | Lesson 6 gate | ja | none | none | present |
| 768 × 1024 | Lesson 11 dialogue | zh | none | none | present |
| 1440 × 1024 | Lesson 7 explanation | zh | none | none | present |
| 1440 × 1024 | Lesson 10 choice | zh | none | none | present |

Interaction checks:

- A native choice button receives keyboard focus and Enter submits it.
- Wrong feedback appears without revealing the correct answer.
- The exit dialog opens with focus inside it and Escape closes it.
- The ordered build exercise reaches its correct state through real controls.
- `prefers-reduced-motion: reduce` removes meaningful animation duration without hiding state.
- Mid-lesson language switching preserves the step, selected answer/feedback, build tokens, retry state, and Korean targets.
- Every state across Lesson 7, Lesson 10, Lesson 11, and Lesson 6 renders in zh, en, vi, and ja.
- Console errors/warnings: 0.
- Failed network requests: 0.
- External requests: 0.

The 390 px accessibility snapshot confirms this reading order:

1. Skip link
2. Course header and language control
3. Course progress
4. Current Stage and Lesson context
5. Korean question heading
6. Explanation
7. Native answer buttons
8. Back and Continue actions

## Real Chrome capture matrix

`capture-and-validate.mjs` generated 29 evidence screenshots, audited 12 representative layout states, and captured 13 explicit localized states plus a before/after language switch. It also pressure-checked zh, en, vi, and ja at 390 px.

`validate-course-shell-i18n.mjs` separately checks 112 course-state-language combinations, 44 Shell keys, 86 fixture keys, Korean target stability, strict missing-key failure, and in-place state preservation.

All audited pages had no horizontal overflow, no `undefined` text, no visible control below 44 × 44 px, no prototype-written localStorage key, no console/network error, and no external request. The machine-readable result is in `BROWSER_VALIDATION.json`.

## Motion evidence

`course-shell-motion-demo.mov` records wrong feedback, ordered construction, and first-completion presentation in an isolated local Chrome profile. The 906,788-byte QuickTime movie was visually checked through a generated Quick Look thumbnail.

The `motion-frames` directory provides deterministic continuous frames for feedback entry and completion. Every effect uses CSS:

| Effect | Implementation | Reduced motion |
|---|---|---|
| Step/surface change | opacity + 10 px translate | instant |
| Feedback entry | opacity + 8 px translate | instant |
| Progress change | width transition | instant |
| Completion mark | one-time scale | static final state |
| Button press | 0.98 scale | no transform |

GSAP was not used.
