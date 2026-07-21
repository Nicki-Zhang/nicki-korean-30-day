# Course Experience Redesign Pilot — Design QA

Reference source: `ScreenRecording_07-18-2026 13-09-48_1.MP4`

Reference crops used for direct comparison:

- `reference/context.png`
- `reference/dialogue.png`
- `reference/completion.png`

Implementation evidence:

- `screenshots/lesson-04-01-opening-390.png` through `lesson-04-04-complete-390.png`
- `screenshots/lesson-09-01-opening-390.png` through `lesson-09-04-complete-390.png`
- `screenshots/lesson-13-01-opening-390.png` through `lesson-13-04-complete-390.png`
- `comparisons/context-side-by-side.png`
- `comparisons/dialogue-side-by-side.png`
- `comparisons/completion-side-by-side.png`

## Comparison findings and fixes

1. The reference establishes context and progression, but keeps many experience cards and navigation controls visible at once. The pilot keeps its contextual rhythm while presenting one lesson step in one contained task card.
2. The first implementation retained generic cards and decorative emoji from the older Lesson 4 opening. Those decorations were removed, the existing Nikigo brand mark was restored, and the three course types received distinct visual treatment through real content: sound contrasts, dialogue bubbles, and number cards.
3. Wrong answers originally exposed the correct option and explanation. The pilot now marks only the selected wrong response with an explicit symbol, border, and text feedback; the answer remains hidden until the learner reaches retry and answers correctly.
4. The Lesson 4 audit found that unanswered listening checks could still advance. The primary action is now disabled until an answer is recorded. A fresh Chrome run confirmed the corrected route.
5. Mobile feedback initially produced a duplicate success check on Lesson 4. The shared state marker was narrowed so existing semantic feedback is preserved without duplicate decoration.

## Final visual checks

- Korean expressions carry the strongest content weight wherever Korean is present.
- Each viewport has one visually primary bottom action; Back and Review remain secondary text actions.
- Correct, wrong, disabled, and focus states include text, symbols, borders, or opacity in addition to color.
- Interactive targets are at least 44px.
- Safe-area insets and reduced-motion preferences are supported.
- 390, 768, and 1440 widths have no horizontal overflow or clipping.
- Google Chrome console warnings/errors: 0.
- Network 4xx/5xx: 0.

Final result: passed
