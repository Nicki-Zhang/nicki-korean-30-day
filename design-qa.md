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
