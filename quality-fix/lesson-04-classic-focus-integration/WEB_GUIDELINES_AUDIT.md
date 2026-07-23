# Lesson 4 Web Interface Guidelines Audit

## lesson-04.html

✓ Pass

- Skip link targets the current learning task.
- Header, main region, progressbar, language control, and status regions use semantic elements.
- Progressbar is named by `progressLabel` and `progressCount`.
- Icon-only home action has an accessible name.
- Decorative mark, language glyph, and home SVG are hidden from assistive technology.

## lesson-consonant-contrast.js

✓ Pass

- All actions are native buttons.
- Required quiz screens and the embedded `qs` task block continuation before an answer.
- Feedback uses a polite status region and does not expose the answer before the user responds.
- Retry page has one `h1`; its embedded question is an `h2`.
- Language switching updates visible copy and document language without resetting the active answer state.
- Escape returns to the exact V4 K0 module route.

## lesson-consonant-contrast.css

✓ Pass

- All controls measured at 44px or taller.
- Visible `:focus-visible` outline is present.
- Reduced-motion override is present through Shared Core.
- No `transition: all`, zoom blocking, horizontal overflow, glass effect, or decorative animation was introduced.
- 390px and 430px use an explicit single-column layout.

## assets/classic-focus-shell.css / assets/classic-focus-shell.js

✓ Unchanged

Lesson 4 consumes the sealed Shared Core files without modifying them. The shell remains presentation-only and contains no answer, XP, retry, or audio approval logic.
