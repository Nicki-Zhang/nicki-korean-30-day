# Nikigo Classic Focus Shared Core V1

Status: local integration candidate
Scope: Lesson 7 (Foundation) and Lesson 11 (Scenario) only
Base: `e19277344751d172db0bcc06656305f70decd2ec`

## 1. Decision

Classic Focus Shared Core is a presentation boundary, not a course engine. It centralizes the stable outer course experience already validated in Lesson 7 and Lesson 11 while leaving every learning rule inside the existing lesson adapter.

The minimal implementation is:

- `assets/classic-focus-tokens.css`: shared purple/white tokens and compatibility aliases.
- `assets/classic-focus-shell.css`: shared shell, progress, action-area, feedback, focus, motion, and responsive rules.
- `assets/classic-focus-shell.js`: explicit view-model validation plus shell DOM/event binding.
- Existing `lesson-07.js` and `lesson-11-classic-focus.js`: lesson adapters.

No framework, component library, new course engine, inferred course type, or storage migration is introduced.

## 2. Current architecture matrix

| Concern | Lesson 7 before extraction | Lesson 11 before extraction | Shared Core decision |
|---|---|---|---|
| Page structure | `lesson-player.css` shell plus `lesson-07.css` content | Dedicated Classic Focus CSS | Shared page shell; content stays adapter-specific |
| Header | Nikigo, lesson name, language, home | Nikigo, lesson name, language, exit dialog | Shared layout and event interface; destination/confirmation stays adapter |
| Language switch | Lesson engine updates language and rerenders | Lesson engine updates URL/state and rerenders | Core binds the control; adapter owns language/state/URL change |
| Step progress | Lesson engine writes DOM fields | Lesson engine writes DOM fields | Adapter sends explicit step view model; Core paints progress |
| Main container | `.card.lesson07Card` | `.classicCard` | Shared `.classicFocusCard` with explicit Foundation/Scenario variants |
| Back/continue | `.foot` buttons | `.lessonFoot` buttons | Shared `.classicFocusActions` layout; adapter owns labels, disabled state, action |
| Feedback | Lesson 7 practice/challenge feedback | Lesson 11 choice/match/builder feedback | Shared accessible status appearance; adapter owns truth and explanation |
| Mobile layout | Foundation rules in shared player CSS and Lesson 7 CSS | Lesson 11-specific rules | Shared shell breakpoints; content breakpoints stay in lesson CSS |
| Service Worker | Caches Lesson 7 assets | Caches Lesson 11 assets | Cache the three shared resources once |
| State boundary | `nikigoLessonSession:lesson-07`, `NikigoState` | `nikigoLessonSession:lesson-11`, `NikigoState` | No storage access in Shared Core |

## 3. What enters Shared Core

- Purple/white design tokens and semantic state colors.
- Page background, max width, spacing, typography foundation, card surface.
- Course header and compact course metadata layout.
- Language selector display and a language-change callback interface.
- Current-step/total-step progress rendering.
- Single-step learning container.
- Compact informational status and correct/error visual treatment.
- Back/continue action-area layout.
- Focus-visible, keyboard-safe event binding, touch target sizing.
- Reduced-motion behavior.
- 390, 430, 768, and 1440 responsive shell rules.

## 4. What remains in each Lesson Adapter

| Adapter responsibility | Lesson 7 | Lesson 11 |
|---|---|---|
| Content sequence | 13 `SCREENS` | 13 real `config.steps` |
| Content rendering | Structure, word, comparison, split, builder, recognition, challenge | Intro, dialogue, concept, choice, match, builder, completion |
| Answer evaluation | Existing split/recognize/challenge/build maps | Protected Lesson 11 config and existing evaluator |
| Retry | Existing challenge mistake/retry state | Existing targeted `retryQueue` |
| Session | Existing Lesson 7 session key/schema | Existing Lesson 11 session key/schema |
| XP/completion | Existing `completionPatch` | Existing `completionPatch` |
| Audio | Exact `바` resolver plus four fail-closed pending words | Exact resolver; currently zero playable |
| URL/return | Existing course-home route | Existing V4 K1 Module route, history, exit confirmation |
| Language persistence | Existing app-state update | Existing app-state plus URL synchronization |

## 5. Logic forbidden from UI Core

The Shared Core must never contain:

- Korean course content, options, answers, or correctness checks.
- XP values or award calculations.
- completion, review, retry, or ReviewItem algorithms.
- `app-state` reads, writes, migrations, or session keys.
- Audio approval or completion-gate decisions.
- Lesson 6 gating.
- Recommendation rules.
- Runtime inference from a title, translation, rendered text, or DOM content.

The Core may display an explicit audio status supplied by an adapter; it cannot derive that status.

## 6. Explicit Lesson Adapter contract

Every render supplies:

```js
{
  lessonId,
  currentStep,       // one-based
  totalSteps,
  language,
  title,
  stepLabel,
  progress,          // 0..100
  canGoPrevious,
  canGoNext,
  audioAvailability, // approved | mixed | pending | none
  contentType         // explicit slot identity
}
```

Optional localized shell labels are passed separately in the same view model: `navigationLabel`, `languageLabel`, `brandActionLabel`, `exitActionLabel`, and `skipLabel`.

Supported content slots:

- `intro`
- `explanation`
- `structure`
- `word`
- `comparison`
- `dialogue`
- `choice`
- `matching`
- `builder`
- `feedback`
- `retry`
- `completion`

The slot tells the shell what is currently displayed. It does not select content, decide correctness, or change progression.

## 7. Lesson 7 and Lesson 11 differences retained

- Lesson 7 keeps its slightly denser foundation surface, compact card radius, sound structure visuals, four missing word audios, and exact approved `바` namespace exception.
- Lesson 11 keeps its dialogue bubbles, concept inspection, match/build interactions, exit confirmation, browser-history behavior, V4 K1 return URL, and zero-playable-audio state.
- The lessons share the same shell contract but are not forced to share content components.

## 8. Future Lesson 0–13 adoption contract

A future lesson may adopt Shared Core only after:

1. Its stable lesson/session identity is documented.
2. Its real step identity and count are supplied explicitly.
3. Its adapter maps each real step to one approved content slot without title inference.
4. Its current completion, XP, review, audio, language, refresh, and return behavior has regression fixtures.
5. Browser comparison shows no P0/P1 visual or interaction regression at 390, 430, 768, and 1440.
6. The adoption changes only that lesson’s HTML/adapter/content CSS plus shared tests.

This version does not migrate or opt in any lesson other than Lesson 7 and Lesson 11.

## 9. Protected boundaries

Unchanged by this integration:

- `course-catalog.js`
- `app-state.js`
- `audio-catalog.js`
- `lesson-11.js`
- Existing answers and stable identities
- XP and retry rules
- Lesson 6 completion gate
- All MP3/WAV files and approved SHA records
- Every other Lesson

`CODEX_HANDOFF.md` is absent from this baseline worktree, so no file with that name is created or modified.
