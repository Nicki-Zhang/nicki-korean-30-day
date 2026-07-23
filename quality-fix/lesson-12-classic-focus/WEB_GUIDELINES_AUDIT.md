# Lesson 12 Web Guidelines Audit

## Passes

- Semantic button and select controls are used; no clickable `div`.
- The skip link, navigation label, language label, progress label/value and live feedback regions have accessible names.
- All checked controls are at least 44×44 px.
- `:focus-visible` supplies a 3 px focus outline.
- Korean target content remains text, not image content.
- Correct and incorrect states use text, symbols and accessible feedback roles rather than color alone.
- Required steps keep Continue disabled until the Sprint engine marks the step done.
- Language switching updates `document.documentElement.lang`.
- The 390/430 mobile layouts are not horizontally scrollable.
- The 1440 layout constrains the learning card instead of stretching it across the viewport.
- The CSS avoids `transition: all` and has an explicit `prefers-reduced-motion` override.
- The missing-audio state is non-interactive and cannot be mistaken for a working player.

## Preserved baseline constraints

- Course content includes the approved mixed-language technical term `approved`; it was not rewritten in this presentation-only task.
- The Sprint engine remains responsible for answers, retry, completion and state.
- No new animation, renderer, dependency, API or audio asset was introduced.
