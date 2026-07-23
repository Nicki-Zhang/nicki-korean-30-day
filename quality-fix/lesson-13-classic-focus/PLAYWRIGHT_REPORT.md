# Lesson 13 Classic Focus Playwright Report

## Result

Pass. The local implementation was exercised at:

`http://127.0.0.1:4197/lesson-13.html?lang=zh`

The preview remains running on `127.0.0.1:4197`.

## Complete course flow

- All 13 explicit steps were reached in order with no duplicate or skipped ID.
- Matching, choice, builder, and scenario interactions were exercised.
- One matching error and one choice error produced two targeted retry items.
- Both retry items had to be corrected before completion.
- First completion displayed `+50 XP`.
- A complete relearn displayed `+0 XP`.
- Answers were not shown before the relevant interaction.

The current sealed Sprint engine retained wrong IDs and targeted retry. It does not publish an app-state ReviewItem, and the presentation adapter did not change that business behavior.

## Scroll and focus

Builder state at 390 × 844:

| Action | Before `scrollY` | After `scrollY` | Result |
|---|---:|---:|---|
| Select `한`, `개`, `예요` | 260 | 260 | active task retained |
| Confirm correct build | 260 | 260 | feedback visible and focused |
| Move to `how-many` | 260 | 0 | new step start focused |

Keyboard focus was visibly rendered. `Escape` focused `homeButton` with the accessible label “返回学习路径”.

## Four-language state preservation

At step 9/13, with `한` and `개` already selected, the page switched:

`zh → en → vi → ja → zh`

The internal step, selected parts, Korean target text, and interaction state remained unchanged. `document.documentElement.lang` updated for every language. No mixed auxiliary-language copy or horizontal overflow was observed.

## Responsive checks

| Viewport | Horizontal overflow | Minimum control | Result |
|---|---:|---:|---|
| 390 × 844 | 0 px | ≥44 px | pass |
| 430 × 932 | 0 px | ≥44 px | pass |
| 768 × 1024 | 0 px | ≥44 px | pass |
| 1440 × 1024 | 0 px | ≥44 px | pass |

The 768 px learning surface was 724 px wide. At 1440 px the surface remained bounded at 856 px rather than stretching across the viewport.

## Navigation and recovery

- Return opened the exact V4 K1 numbers module.
- The module displayed Lesson 13 completion and the relearn action.
- Re-entering Lesson 13 and browser Back returned to that same K1 module state.
- Refresh and history restoration retained the Sprint session.

## Regression checks

- Lesson 4 loaded at 1/15 with its approved audio path intact.
- Lesson 6 loaded at 1/18; its existing gate remained covered by architecture tests.
- Lesson 7 loaded at 1/13 with Classic Focus.
- Lesson 8 restored at 5/15 with Classic Sprint.
- Lesson 11 loaded at 1/13 with Classic Focus.
- Lessons 9 and 10 retained their current Sprint pages.
- All 14 catalog routes remained unique and loadable.

## Console, network, audio, and Service Worker

- Console errors: 0
- Console warnings: 0
- Network errors: 0
- External requests: 0
- API requests / fees: 0
- Audio controls: 0
- Audio requests: 0
- Service Worker precache URLs fetched: 134 unique
- Service Worker precache failures: 0

## Reduced motion and ARIA

The page preserves full state information with `prefers-reduced-motion: reduce`. Progress, feedback, pressed-state controls, skip navigation, task focus, and non-color correct/error indicators were verified.
