# Classic Focus Shared Core V1 Browser Report

Status: local acceptance candidate
Preview: `http://127.0.0.1:4192/`
Compared base: `e19277344751d172db0bcc06656305f70decd2ec`

## Scope

Only the approved Lesson 7 Foundation experience and Lesson 11 Scenario experience consume the new presentation-only Shared Core. No other lesson was migrated.

## Real-browser flow results

| Check | Lesson 7 | Lesson 11 |
|---|---|---|
| Real step count | 13/13 completed | 13/13 completed |
| Required-step gate | Split, builder, recognition, challenge and retry gates held | Choice, match, builder and retry gates held |
| Wrong feedback | Deliberate wrong challenge answer produced targeted retry | Deliberate wrong choice did not reveal the answer and entered targeted retry |
| Retry | Wrong challenge item corrected before completion | Wrong choice corrected before completion |
| First completion | `+50 XP` shown once | `首次完成 +50 XP` shown once |
| Repeat completion | Full repeat ended with no extra XP | Full repeat ended with `重复完成 +0 XP` |
| Refresh | Step, wrong choice and feedback restored | Step, answer, feedback and progress restored |
| Browser back | Existing step history behavior retained | V4 K1 Module return and browser-back restored step 13 |
| Audio | Exact approved `바` control remained playable; four word audios remained fail-closed | Zero playable audio; compact pending state only |

## Four-language state preservation

- Lesson 7 was switched `zh → en → vi → ja → zh` on step 8 after a wrong split answer.
- Step `8 / 13`, the selected Korean answer `사 + ㅁ`, Korean prompts `산 / 몸 / 공 / 물`, and feedback state were preserved.
- Lesson 11 was switched through the same four languages on step 3 after a correct answer.
- Step, selected answer, feedback, Korean target text, dialogue state and progress were preserved.
- `document.documentElement.lang` changed to `zh-CN`, `en`, `vi`, and `ja` as appropriate.
- The Lesson 11 live-region message now rerenders in the selected auxiliary language instead of retaining initialized Chinese.

## Responsive checks

Both lessons were measured in the real browser at:

- `390 × 844`
- `430 × 932`
- `768 × 1024`
- `1440 × 1024`

At every viewport:

- `documentElement.scrollWidth <= innerWidth`
- No horizontal overflow occurred.
- The smallest visible button/select control measured `44px`.
- The desktop content width remained bounded.
- Mobile kept the approved single-step reading order.
- Lesson 7's mobile language selector renders its selected label at `14px` with a measured width of `126.5px`; the inherited `0px` audit regression was corrected before sealing.

The retained review artifact is `classic-focus-shared-core-parity.png`. Individual responsive captures and the HTML comparison reader are reproducible local evidence and are intentionally not part of the sealed evidence commit.

## Visual parity

Lesson 11's aligned `1 / 13` intro state was measured at `390 × 844`.

| Measurement | Before | Shared Core |
|---|---:|---:|
| Main | `390 × 596.52`, y `116` | `390 × 596.52`, y `116` |
| Learning panel | `362 × 596.52`, x `14` | `362 × 596.52`, x `14` |
| H1 top / height / size | `169.5 / 35.84 / 28px` | `169.5 / 35.84 / 28px` |
| Progress | `390 × 31`, y `68` | `390 × 31`, y `68` |
| Page background | `rgb(251, 250, 255)` | `rgb(251, 250, 255)` |

The Lesson 7 intro, Lesson 7 builder, Lesson 11 intro, dialogue and wrong-feedback captures were inspected before/after. No P0/P1 visual regression was found: type scale, content density, primary-action placement and container count remained aligned with the approved baselines.

## Keyboard, focus and semantics

- Shared controls retain visible `3px` violet `:focus-visible` outlines.
- Choice/build/match controls remain native buttons.
- Lesson 11 arrow-key group navigation remains in the adapter.
- Lesson 11 exit dialog opens with focus on “continue learning”; `Escape` closes it and returns focus to the exit button.
- Skip links target the current task.
- Progress remains a labeled progressbar with current/total value text.
- Feedback retains `status`/`alert` semantics.
- The reduced-motion media query disables non-essential animation and transition duration without removing state.

## Console and network

- Lesson 7 console warnings/errors: `0`
- Lesson 11 console warnings/errors: `0`
- Browser-observed external resource requests: `0`
- External API calls: `0`
- Paid calls/cost: `0`

The live preview returned HTTP `200` for both lessons and all three Shared Core resources. Service Worker cache `nikigo-v36-self-review-gate-classic-focus-shared-core` includes:

- `assets/classic-focus-tokens.css`
- `assets/classic-focus-shell.css`
- `assets/classic-focus-shell.js`

## Automated validation

- `npm test`: pass
- `npm run test:architecture`: pass
- `git diff --check`: pass
- Shared Core validator: explicit adapter contract, no state/answer/XP/review/audio inference
- Audio validator: 54 approved records and SHA integrity pass
- Lesson 6 completion gate: unchanged and passing
