# Lesson 5 Classic Focus Browser Report

## Environment

- Branch: `agent/nikigo-lesson-05-classic-focus-integration`
- Baseline: `c30bb04864b6278841b4d613dd66386faef2e527`
- Preview: `http://127.0.0.1:4200/lesson-05.html?lang=zh`
- Browser: real Chromium controlled through Playwright

## Formal flow

- All 16 formal step IDs were visited in their existing order.
- Required choice, builder, Split, challenge, and retry gates prevented
  advancement until the formal engine accepted the state.
- A deliberately incorrect challenge answer produced `wrong ID c1`.
- Targeted retry contained that real wrong ID and removed it only after a
  correct retry.
- First completion changed XP from 0 to 50.
- Repeat completion kept XP at 50 and displayed the existing no-repeat reward
  copy.

## Responsive matrix

| Viewport | Representative state | Horizontal overflow | Minimum visible control | Result |
|---|---|---:|---:|---|
| 390×844 | opening, Diagram, builder, Split, feedback, retry, completion | 0px | 44px | pass |
| 430×932 | Japanese builder | 0px | 44px | pass |
| 768×1024 | Japanese builder | 0px | 44px | pass |
| 1440×1024 | approved-audio examples | 0px | 44px | pass |

At 1440px the learning card remains 856px wide; content is not stretched to
fill the viewport.

## Four-language state preservation

The same builder state was switched through `zh`, `en`, `vi`, and `ja` at
390px.

- formal step stayed `builder` (11/16)
- built syllables stayed `가`, `노`
- selected onset/vowel and the Korean result stayed unchanged
- document language and URL language synchronized
- auxiliary headings and instructions re-rendered
- horizontal overflow stayed 0
- minimum visible target stayed 44px

No mixed auxiliary-language copy was observed.

## Scroll and focus

On the Split step:

- before a wrong answer: `scrollY=360`
- after the engine re-render: `scrollY=360`
- the selected option and adjacent feedback remained visible
- the adapter focused the updated answer/feedback without forcing a top reset

True Back/Continue, challenge-question navigation, targeted-retry advancement,
and restart retained the engine's existing `scrollY=0` behavior and focused the
new learning task.

Escape moves focus to the return control without changing the formal step or
answer state. Native buttons, a semantic progressbar, focus-visible styles, and
localized accessible labels were verified.

## Audio and network

- Ten exact catalog requests: 10 approved, 10 playable
- All ten local files returned HTTP 200
- All nine existing formal audio controls were enabled and played their exact
  local files
- Service Worker manifest resources: 138, failed HTTP checks: 0
- Browser console errors: 0
- Browser console warnings: 0
- Network errors: 0
- External requests, TTS, paid API requests: 0

## Reduced motion

The page and Lesson 5 stylesheet include a
`prefers-reduced-motion: reduce` branch. It removes transitions and smooth
movement while leaving state, focus, and controls intact.
