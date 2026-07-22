# Nikigo GSAP Decision

## Decision

Do not add GSAP in `nikigo-human-ui-refinement-v1`.

The static Playwright acceptance has no remaining comprehension defect that requires timeline orchestration. Native `details`, existing progress updates, and short CSS state transitions already preserve focus, layout, refresh recovery, and reduced-motion behavior. Adding a runtime animation dependency would expand the regression surface without improving the approved product architecture.

This decision follows the `gsap-core` Skill requirements: use transforms/opacity for appropriate motion, use `gsap.matchMedia()` for reduced motion if GSAP is genuinely needed, clean up created animations, and do not use GSAP for simple state styling. Since no qualifying animation remains, none of those runtime mechanisms should be introduced.

## Candidate review

| Candidate | Helps users understand state? | Is CSS/native behavior enough? | Reduced-motion behavior | Focus/layout/restore risk | Decision |
| --- | --- | --- | --- | --- | --- |
| Course step transition | Potentially, when a future lesson changes a dense instructional state | Yes for the current engines; immediate content replacement and progress change are already clear | Existing global reduced-motion rule keeps transitions effectively instant | A GSAP timeline could animate removed nodes or compete with session restoration | No GSAP in this phase |
| Module expand/collapse | Slightly, but the plus/minus state and native `details` disclosure are already explicit | Yes; native disclosure gives keyboard and accessibility behavior without scripting | Native disclosure remains usable with no animation | Measuring/animating height can shift focus and create layout instability | Keep native `details` |
| Progress completion feedback | Potentially valuable after a verified completion event | Yes for current scope; value, percentage, and bar update already communicate completion | Current CSS collapses transition duration under reduced motion | A new timeline would require coupling to protected XP/completion events | Defer until a separately approved learning-event integration |
| Hangul letters composing a syllable block | Yes; this could have genuine instructional value | Not necessarily for a future guided composition lesson | Must provide an immediate final syllable and use `gsap.matchMedia()` if built | Could interfere with answer state or audio timing unless designed with the lesson engine | Candidate for a future content-specific phase, not this shell refinement |

## Rejected decorative motion

No parallax, scroll hijacking, card fly-ins, floating backgrounds, 3D flips, looping decoration, logo intro, or bouncing primary buttons will be added.

## Acceptance impact

- No dependency or bundle change.
- No new animation file or abstraction.
- No changes to lesson engines or learning events.
- `prefers-reduced-motion` remains enforced by the existing CSS rule.
- Final Playwright acceptance can test the same deterministic static states without animation settling or race conditions.
