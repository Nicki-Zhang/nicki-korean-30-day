# Design QA — formal Lesson 11 Mission Journey V2

## Comparison contract

- Historical reference: GitHub Mission Journey left layout normalized with current Lesson 11 content.
- Selected design target: Mission Journey V2.2 prototype.
- Formal implementation: `lesson-11.html` with the real Lesson 11 engine and session state.
- Viewport: 390 × 844 CSS px.
- Language: `zh`.
- Phase: `先听后学` expanded.
- Dialogue: the same three current Lesson 11 lines.
- Scroll anchor: `scrollY = 130`.
- Bottom action state: the same three-part course controls.
- Combined evidence: `quality-fix/lesson-11-mission-v2/comparisons/historical-prototype-formal.png`.

## Result

- Phase card x/width: 13 / 364px.
- Phase number block: 50px.
- Phase title: 18px.
- Korean dialogue: 20px.
- Support-language translation: 15px.
- Partner bubble: 84% maximum width; user bubble: 68% maximum width.
- Bottom action bar: 374 × 72px at 390px.
- Horizontal overflow: 0px.
- Current phase expands; complete and future phases use compact headers.
- Mobile Course Shell vertical track, giant type, duplicate Korean hero, black-purple CTA and oversized outline shell are absent.

The formal implementation intentionally replaces the prototype's three decorative readiness rows with one compact `标准音频准备中` status. This is required by the final audio product decision. It is non-interactive and makes no audio or external request.

No P0, P1, or P2 visual discrepancy remains.

## Accessibility and runtime

- Native phase and lesson controls are keyboard operable.
- Current phase toggle preserves focus and synchronizes `aria-expanded`.
- Escape closes the exit confirmation without losing session state.
- `prefers-reduced-motion` reduces transitions to 0.01ms.
- 390/430/768/1440 have 0px horizontal overflow.
- Current-page console: 0 errors, 0 warnings.
- Network: local static assets only; all responses successful; no external/API requests.

final result: passed

---

# Lesson 11 Classic Focus Design QA

## Visual truth

- Source template capture: `../nikigo-classic-course-template-v1/artifacts/nikigo-classic-course-template-v1/evidence/online-lesson-07-390-intro.png`
- Approved isolated prototype: `../nikigo-classic-course-template-v1/artifacts/nikigo-classic-course-template-v1/evidence/classic-390-intro.png`
- Formal implementation capture: `quality-fix/lesson-11-classic-focus/formal-390-intro.png`
- Combined comparison: `quality-fix/lesson-11-classic-focus/three-way-opening-comparison.png`

## Comparison conditions

- Viewport: 390 × 844 CSS pixels
- Language: Simplified Chinese
- Density: mobile, 1× browser screenshot
- State: course opening, step 1 of 13
- Content: the source keeps real Lesson 7 content; the prototype and formal page keep real Lesson 11 content. The comparison evaluates the approved template structure rather than course-copy identity.

## Full-page comparison

The formal Lesson 11 keeps the approved Classic Focus structure:

- compact brand, language, and exit header;
- explicit `1 / 13` progress;
- one in-flow learning card;
- one current internal task;
- Back and Continue as the only step navigation;
- no Mission Journey stage rail, stage accordion, fixed three-part stage footer, or oversized hero.

## Focused component comparison

- Header and progress spacing match the prototype at 390 px.
- The formal card uses the prototype's mobile padding, radius, text scale, and vertical rhythm.
- The opening goals use the same compact stacked treatment as the approved prototype.
- Programmatic focus on the non-interactive learning card has no persistent outline; keyboard focus remains visible on buttons, links, and the language selector.
- Formal dialogue, choice, build, feedback, retry, and completion states use the same single-task density without importing prototype fixtures.

## Findings and resolution history

1. Initial formal capture showed a persistent outline around the whole learning card because the programmatically focused `tabindex="-1"` container inherited the browser focus outline.
2. The card now suppresses only that non-interactive programmatic outline.
3. Interactive controls retain a 3 px visible `:focus-visible` outline.
4. The Service Worker no longer pre-caches the superseded Mission Journey presentation files for Lesson 11.
5. The final comparison shows no P0, P1, or P2 visual mismatch against the approved Classic Focus prototype.

## Result

final result: passed
