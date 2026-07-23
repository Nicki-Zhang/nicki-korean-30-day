# Playwright report — Lesson 11 Mission Journey V2

## Runtime

- URL: `http://127.0.0.1:4185/lesson-11.html?lang=zh`
- Branch: `agent/nikigo-lesson-11-mission-v2-integration`
- Base HEAD: `54bd94aa7d2bb945e15144522675f717ef668df3`
- Browser console: 0 errors, 0 warnings.
- Network errors: 0.
- External requests/API/fees: 0.

## Course behavior

- All 13 stable steps were completed in original order.
- The 13 steps rendered through the approved 8-phase mapping.
- A deliberately wrong response entered targeted retry; the incorrect step returned once and the retry queue cleared after a correct response.
- No required internal step was skipped.
- First completion changed XP by +50 and recorded Lesson 11 completion.
- Relearning completed the same 13-step route and changed XP by +0.
- Partial build state survived reload.
- Browser back restored the previous internal step.
- Exit confirmation opened, Escape closed it, and confirmation returned to `learnStage=K1&learnModule=k1-identity-and-language-background#courses`.
- The visible V4 K1 Module Lesson 11 entry opened the formal page.

## Four-language switch

The same listening step was captured in `zh`, `en`, `vi`, and `ja`.

- Step stayed at index 1.
- Korean dialogue remained identical.
- `document.documentElement.lang` and the URL language parameter updated.
- A mid-question switch preserved the selected response, wrong feedback and retry state.
- No horizontal overflow or `undefined` copy appeared.

## Responsive matrix

| Viewport | Horizontal overflow | Current header | Fixed action bar |
| --- | ---: | ---: | ---: |
| 390 × 844 | 0px | multilingual auto-height | 72px |
| 430 × 932 | 0px | 78px | 72px |
| 768 × 1024 | 0px | 78px | 72px |
| 1440 × 1024 | 0px | 78px | 72px |

At 1440px the phase index occupies the left column and the current workspace occupies the constrained right column. Typography does not scale beyond the approved ranges.

## Accessibility

- Visible focus ring: pass.
- Arrow-key choice navigation: pass.
- Phase collapse/expand with Enter: pass.
- Focus retained after collapse: pass.
- Escape exit behavior: pass.
- Touch targets at least 44px: pass.
- Reduced motion: pass (`0.01ms` computed transition duration).

## Audio boundary

- Lesson 11 playable approved audio: 0.
- Visible state: one compact non-interactive model-audio readiness notice.
- TTS, microphone, upload and external audio requests: none.
- Non-audio lesson completion remains available.

Result: PASS.
