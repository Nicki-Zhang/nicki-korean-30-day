# Nikigo Purple Alignment V1 — Formal Local Integration

## Scope

This pass applies the approved color mapping to the product shell only. It does not
change page structure, copy, typography, spacing, sizing, routing, state, course
content, or course presentation.

- Base: `4c2bc7b917ed7940e0b0be14036e9ab8bb8f2194`
- Branch: `agent/nikigo-purple-alignment-formal`
- Preview: `http://127.0.0.1:4202/`
- Approved primary: `#6D4AFF`
- White-on-primary contrast: `5.15:1`

## Final semantic token table

| Token | Value | Use |
| --- | --- | --- |
| `brand-primary` | `#6D4AFF` | Brand marks, primary actions, active path state |
| `brand-hover` | `#5638D4` | Primary hover and dark gradient stop |
| `brand-active` | `#452BB5` | Pressed primary action |
| `brand-soft` | `#F4F0FF` | Selected and highlighted soft surfaces |
| `brand-subtle` | `#FBFAFF` | Product-shell canvas and quiet surfaces |
| `brand-border` | `#DDD3FF` | Brand-related borders and progress tracks |
| `brand-focus` | `rgba(109,74,255,.48)` | Visible focus ring color |
| `brand-text` | `#5638D4` | Brand text on light surfaces |
| `brand-on-primary` | `#FFFFFF` | Text on primary brand surfaces |
| supporting violet | `#9C83FF` | Light gradient stop and secondary brand accents |

Success, error, warning, pending audio, disabled, neutral, and destructive colors
remain independent semantic roles.

## Applied mapping

### `assets/nikigo-purple-shell.css`

- `:root`: installs the nine approved product-shell brand roles and maps existing
  `--nikigo-*` aliases to them.
- `.purple-shell`: aligns the canvas accent, supporting violet, and brand border.
- Focus selectors: use `brand-focus`.
- `.logo` and `.logo b`: use primary and supporting violet.
- `.primary` default/hover/active: use primary/hover/active.
- `.learningHero`: preserves its existing geometry and gradient direction while
  replacing only the three gradient stops.

### `assets/nikigo-friendly-learning-path.css`

- Existing `--friendly-brand-*` aliases now consume the product-shell brand roles.
- Existing canvas, ink, muted, border, and hero gradient are aligned.
- Existing logo, focus, primary action, onboarding illustration, progress, selected,
  and ability colors are mapped without changing their geometry.

### `assets/nikigo-learn-v4.css`

- Stage intro tint and border.
- Stage progress track.
- Current Module border, surface, and shadow color.
- Primary Lesson/Module actions and their interaction states.
- Module detail tint.

### Standalone product surfaces

- `review.css`: review background, progress, cue, completion, audio, note, primary
  interaction, and focus colors.
- `diagnostic.html`: diagnostic background, hero, ring, progress, audio, record,
  result, primary interaction, and focus colors.
- `nikigo-app.html`: browser theme color only.
- `sw.js`: cache namespace only; cache logic and asset list are unchanged.

### Contract test

`scripts/validate-clear-interactive-pilot.mjs` now asserts the approved semantic
tokens and aligned gradient instead of the retired hard-coded dashboard purple.

## Deliberately unchanged

- All Classic Focus CSS and course colors.
- Lesson 0–13 runtime and Adapter files.
- Dashboard, navigation, and learning-path layout.
- Header height, selector size, cover size, columns, fonts, spacing, radius,
  shadows, and motion.
- Catalog, state, audio catalog, XP, retry, gating, and route behavior.

## Accessibility color results

| Pair | Contrast |
| --- | ---: |
| `#6D4AFF` / white | `5.15:1` |
| `#5638D4` / white | `7.21:1` |
| `#452BB5` / white | `9.27:1` |
| `#5638D4` / `#F4F0FF` | `6.44:1` |
| `#6D4AFF` / `#FBFAFF` | `4.96:1` |

The modified product shell retains a 3px visible focus outline with the approved
focus color. Reduced-motion behavior is unchanged.

## Known inherited geometry note

The main App Shell controls and primary actions meet the existing 44px target
contract. The standalone Review header logo/language controls and Diagnostic
header logo/language controls remain at their pre-existing 29–39px and 30–35px
heights. Increasing them would violate this pass's zero-geometry requirement, so
they are recorded for a later interaction-layout pass and were not changed here.
