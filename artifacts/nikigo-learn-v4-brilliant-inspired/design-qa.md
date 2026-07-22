# Design QA: Nikigo Learn V4 isolated prototype

## Outcome

The page uses the useful structural idea of a low-density Stage selector followed by a connected Module path, while preserving Nikigo's own purple visual identity, five-item navigation, taxonomy, and Korean-learning content.

## Visual review

- The Stage introduction is intentionally concise: name, goal, progress and one original illustration.
- The path contains six visually related but distinct Module illustrations; the connector communicates recommended sequence, not locking.
- Only the current Module receives a primary action. Completed, available and gated modules rely on quieter state color and secondary entry controls.
- The mobile layout is re-composed for 390px rather than scaling the desktop layout.
- K2-K4 are absent because they do not yet have real runtime content.

## Accessibility review

- All interactive controls are at least 44px in their interactive dimension.
- Focus uses a visible 3px purple outline with offset.
- Stage selection uses text plus `aria-selected`, not color alone.
- Tab keyboard behavior supports ArrowLeft, ArrowRight, Home and End.
- Progress uses native progressbar semantics and numeric values.
- Reduced motion removes transition duration without removing state information.
- Decorative illustrations use empty alt text; learning copy carries the meaning.

## Risks before formal integration

- Prototype progress and current-module states are fixtures and must be replaced by approved selectors.
- Stage and Module text must come from the versioned taxonomy/localization layer.
- Lesson 6 completion and XP gates must remain owned by the existing completion/audio gate, never the view.
- Course entry must resolve from the existing catalog routes and retain free entry for every available lesson.
