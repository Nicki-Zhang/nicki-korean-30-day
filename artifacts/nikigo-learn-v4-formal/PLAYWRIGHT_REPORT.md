# Playwright MCP validation — Nikigo Learn V4 formal integration

Date: 2026-07-22
Preview: `http://127.0.0.1:4176/nikigo-app.html?lang=zh&learnStage=K0#courses`

## Connection and runtime

- Playwright MCP connected successfully to the local preview.
- Formal page loaded the V4 runtime, real course catalog, explicit taxonomy and compatible app-state data.
- Console: 0 errors, 0 warnings. Chromium emitted one informational DOM diagnostic for an unrelated hidden password field; it is not a console warning or runtime failure.
- Network: every observed request was HTTP 200 from `127.0.0.1:4176`; external requests, runtime image requests, API calls and paid calls: 0.

## Responsive acceptance

| Viewport | State | Horizontal overflow | Smallest visible Learn target | Bottom safe padding |
|---|---|---:|---:|---:|
| 390 × 844 | Stage path | no | 44 px | 106 px + safe area |
| 390 × 844 | Module detail | no | 44 px | 106 px + safe area |
| 768 × 1024 | Stage path | no | 46 px | 112 px |
| 768 × 1024 | Module detail | no | 44 px | 112 px |
| 1440 × 1024 | Stage path | no | 46 px | 112 px |
| 1440 × 1024 | Module detail | no | 44 px | 112 px |

The 390 layout uses a horizontal Stage tablist and single-column path. The 768 layout constrains reading width. The 1440 layout keeps the Stage introduction at 1180 px maximum and the path at 820 px instead of filling the viewport.

## Real-state scenario matrix

| Scenario | Result |
|---|---|
| 0 completed lessons | K0 selected; Lesson 0 is the one strong action |
| K0 partial + reliable Lesson 3 session | K0 Module 2 is current; Lessons 0–2 are complete |
| Lesson 6 preview session + Lessons 0–5 complete | Lesson 6 remains visible/gated; Module 2 shows `3 / 4`, current completable content finished and one audio-preparing lesson; Lesson 7 is the formal primary |
| K0 formally completable content finished | default advances to K1 and recommends Lesson 11; explicit K0 browsing still works |
| K1 Lesson 11 active | K1 and the identity/language Module are current |
| K1 Lesson 12 or 13 active | exact Stage, Module and course identity restored |
| all 14 completion identities recorded | no invented primary; selected/last Stage remains browsable; completed lessons expose `重新学习` |
| free course browsing | six Module details expose 14 unique stable IDs and 14 unique catalog routes |

## URL, history and language

- Legacy `#courses` resolves and is normalized to a V4 Stage URL.
- Contract: `?learnStage=K0|K1&learnModule=<approved chapterId>#courses`.
- Direct Module URL restored the correct Stage and Module after refresh.
- Module open moved focus to the back control; browser Back restored the Stage path and selected tab focus.
- Stage tabs passed Arrow Left/Right, Home and End behavior; URL, selection and focus stayed synchronized.
- Switching zh → en in Module detail preserved `learnStage`, `learnModule` and `#courses` while updating visible copy.
- Returning from an unfinished course restored its saved step and selected the correct Stage.

## Accessibility and motion

- Stage tabs expose `tablist`, `tab`, `aria-selected`, roving `tabindex`, `aria-controls` and a labelled `tabpanel`.
- Progress elements expose min/max/current values.
- Status is not color-only: current, completed, available, relearn and audio-gated labels are written in text.
- Focus rings are visible and captured in `formal-390-keyboard-focus.png`.
- `prefers-reduced-motion: reduce` produced `animation-name: none` and near-zero transition duration without removing content or actions.
- Stage and Module images declare dimensions; Stage/Module meaning remains in text and decorative art has empty alt text.

## Course and business regression

- Lesson 4, Lesson 7, Lesson 11 and Lesson 6 direct pages loaded at 390 px with no horizontal overflow.
- Lesson 11 real-browser run intentionally answered one item incorrectly, showed non-revealing wrong feedback, entered mistake retry, then completed successfully.
- First Lesson 11 completion: `首次完成 +50 XP`, profile XP 50.
- Relearn and second completion: `重复完成 +0 XP`, profile XP remained 50.
- Lesson 11 step 3 persisted across reload.
- Lesson 6 loaded as structural preview with audio-pending messaging; its formal completion/XP gate remained enforced by runtime and automated validation.

## Automated validation

- `npm test`: pass.
- `npm run test:architecture`: pass.
- `git diff --check`: pass.
- 14 unique course routes: pass.
- 54 approved audio SHA validation: pass.
- Service Worker V4 cache validation: pass.
- protected catalog/state/audio hash parity: pass.
