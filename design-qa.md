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

---

# Homepage Visual Polish V1 — Design QA

## Comparison basis

- Source: the approved revised Homepage Visual Polish V1 prototype.
- Implementation: formal Dashboard driven by the existing product architecture and state selectors.
- Same-state comparisons:
  - `quality-fix/homepage-visual-polish-formal/evidence/comparison-390-setup-prototype-formal.png`
  - `quality-fix/homepage-visual-polish-formal/evidence/comparison-390-active-prototype-formal.png`
  - `quality-fix/homepage-visual-polish-formal/evidence/comparison-390-partial-prototype-formal.png`
  - `quality-fix/homepage-visual-polish-formal/evidence/comparison-768-active-prototype-formal.png`
  - `quality-fix/homepage-visual-polish-formal/evidence/comparison-1440-active-prototype-formal.png`
- State fixtures exist only in isolated validation contexts. Product source reads real selectors and never imports the prototype.

## Visual review

- Header, welcome hierarchy, context row, hero composition, status strip and mobile navigation preserve the approved layout specification.
- Desktop and mobile both expose the approved five-entry navigation with consistent line icons and visible labels.
- The language chevron is part of the control at every breakpoint, with a measured 16.34px right inset.
- The mobile Stage → Module → Lesson locator is horizontal, with all three node centers on the same axis and the connecting rule centered through them.
- The 0% setup state shows Stage and Module as context and setup as current; it has no false completion mark.
- Active and partial states are bound to explicit course/session identity, not title or DOM inference.
- The primary action remains the only highest-weight action.
- No oversized title, card wall, decorative shadow, glass effect or additional visual direction was introduced.
- Four-language checks found no clipping or horizontal overflow.

## Severity review

- P0: none.
- P1: none.
- P2: none.
- Expected data-bound differences: course-specific Korean hero text is omitted when no approved catalog field exists. This is intentional fail-closed behavior, not a visual fixture fallback.

final result: passed
