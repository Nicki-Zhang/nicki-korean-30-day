# Lesson 4 Classic Focus Browser Verification

## Environment

- Branch: `agent/nikigo-lesson-04-classic-focus-integration`
- Base: `74843a23368102a7c349385690b9b2c46d4e4cda`
- Preview: `http://127.0.0.1:4193/lesson-04.html?lang=zh`
- Browser surface: Codex in-app browser using Playwright-backed DOM and screenshot checks

## Lesson 4 flow

| Check | Result |
| --- | --- |
| Canonical route and stable ID | pass |
| Actual step count | 15 |
| Step order | pass |
| Required quiz cannot advance before answer | pass |
| Embedded `qs` cannot advance before answer | pass |
| Correct feedback | pass |
| Incorrect feedback | pass |
| Targeted retry | pass |
| Retry clears only after correct answer | pass |
| First completion | +50 XP shown |
| Repeat completion | +0 XP shown |
| Refresh restore | pass at 15 / 15 |
| V4 K0 module return | exact Stage and Module query restored |
| Browser back | returned to Lesson 4 and restored 15 / 15 |
| Escape | returned to exact V4 K0 module route |
| Answer scroll stability | scrollY remained 853.5 before and after embedded answer |

## Audio

- All 14 exact Lesson 4 audio requests were enabled by the real catalog gate.
- All 14 local MP3 requests returned HTTP 200.
- HTML, CSS, Shared Core JS, Lesson Adapter JS, catalog, and state dependencies returned HTTP 200.
- No external asset URL was observed.
- No device TTS or external API request was used.

## Languages

The same answered question was switched through zh, en, vi, and ja.

- Step remained 4 / 15.
- Selected wrong and correct options remained `가` and `까`.
- Korean target content remained unchanged.
- `document.documentElement.lang` updated to `zh-CN`, `en`, `vi`, and `ja`.
- No mixed auxiliary language was observed.

## Responsive checks

| Viewport | Horizontal overflow | Minimum measured control |
| --- | ---: | ---: |
| 390 x 844 | 0px | 44px |
| 430 x 932 | 0px | 44px |
| 768 x 1024 | 0px | 44px |
| 1440 x 1024 | 0px | 44px |

The four-language pressure matrix also returned 0px overflow at all four widths.

## Accessibility and motion

- Skip link present.
- Progressbar exposes current value and visible label association.
- Keyboard focus outline measured as a 3px brand-violet outline.
- Escape behavior verified.
- Live feedback regions use polite announcement.
- Heading order repaired on retry: one `h1` plus one `h2`.
- Shared Core contains a `prefers-reduced-motion: reduce` override.
- No information depends on motion.

## Regression smoke checks

| Surface | Result |
| --- | --- |
| Lesson 7 Shared Core | 1 / 13, no overflow, no console warning/error |
| Lesson 11 Shared Core | 1 / 13, no overflow, no console warning/error |
| Lesson 6 gate | preview/audio-review status retained |

## Console and network

- Lesson 4 console warnings/errors: 0
- Lesson 7 console warnings/errors: 0
- Lesson 11 console warnings/errors: 0
- Lesson 6 console warnings/errors: 0
- Browser-observed external assets: 0
- Network failures: 0
- API calls and fees: 0

## Evidence

The `before`, `after`, and `comparisons` directories retain the selected screenshots. They are local evidence only and are not committed.
