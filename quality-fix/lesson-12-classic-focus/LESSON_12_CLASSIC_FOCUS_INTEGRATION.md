# Lesson 12 Classic Focus Integration

## Scope

This local integration applies the sealed Classic Focus presentation system to `lesson-12.html`. It does not change Lesson 12 content, answers, step order, Sprint session behavior, XP, targeted retry, course catalog data, app state, or audio approval data.

Runtime files:

- `lesson-12.html`
- `lesson-12-classic-focus.css`
- `lesson-12-classic-focus.js`
- `sw.js`

The page loads `assets/classic-focus-tokens.css`, `assets/classic-focus-shell.css`, and `assets/classic-focus-shell.js`. It does not load the legacy Sprint stylesheet and does not load another lesson’s adapter.

## Identity and state contract

- `lessonId`: `lesson-12`
- session key owned by the Sprint engine: `nikigoLessonSession:lesson-12`
- step count: 13
- step order and explicit IDs: unchanged
- first completion: +50 XP
- repeat completion: +0 XP
- wrong IDs and Sprint targeted retry: unchanged
- app-state ReviewItem publication: unchanged from the Sprint baseline; the baseline does not publish an app-state ReviewItem
- return route: K1 / `k1-identity-and-language-background`

The Scenario Adapter only maps explicit step identities to Classic Focus presentation types and forwards existing controls to the Sprint engine.

## Explicit mapping

| Order | Stable step ID | Sprint type | Classic Focus content type |
|---:|---|---|---|
| 1 | `intro` | `intro` | `intro` |
| 2 | `origin-scene` | `concept` | `dialogue` |
| 3 | `origin-response` | `scenario` | `dialogue` |
| 4 | `phrase-role` | `match` | `matching` |
| 5 | `origin-pattern` | `concept` | `explanation` |
| 6 | `build-origin` | `build` | `builder` |
| 7 | `country-person` | `choice` | `choice` |
| 8 | `country-language` | `match` | `matching` |
| 9 | `study-pattern` | `concept` | `explanation` |
| 10 | `build-study` | `build` | `builder` |
| 11 | `scene-reply` | `scenario` | `dialogue` |
| 12 | `final-scene` | `scenario` | `choice` |
| 13 | `complete` | `complete` | `completion` |

The adapter validates every ID/type pair before mounting. It never infers a content type from a title, Korean text, translated copy, or DOM content.

## Missing audio presentation

The single missing audio request remains owned by Lesson 12 configuration and the strict audio catalog. The engine still resolves it as non-playable. The adapter replaces the engine’s disabled control with one localized, non-interactive `role="status"` message only on `origin-scene`.

This presentation change:

- creates no audio element;
- creates no audio request;
- offers no fake play action;
- does not relabel the record as pending or approved;
- does not block the non-audio course flow or completion.

## Scroll and focus contract

In-step state changes (`answer`, `match-left`, `match-right`, `part`, `confirm-build`) retain the current reading position. The adapter restores focus to feedback or the closest usable control with `preventScroll`.

Real step changes (`next`, `back`, targeted-retry advance, course restart) retain the sealed product behavior: move to the new task start and focus the main task container.

## Shared Core boundary

No Shared Core file and no Sprint engine file was modified. Answers, completion, XP, wrong IDs, targeted retry, session writes, audio approval and course data remain outside the Adapter.
