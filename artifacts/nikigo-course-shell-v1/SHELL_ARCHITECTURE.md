# Nikigo Unified Course Shell V1

## Design read

Focused learning workspace for adult Korean learners. The Shell keeps the V4 purple and white identity, makes Korean the visual center, and stays quieter than the learning path.

- Design variance: 5
- Motion intensity: 3
- Visual density: 4
- Implementation: isolated native HTML, CSS, and JavaScript prototype
- Runtime dependencies: none

## Shell boundary

```text
Course engine
  content + answers + exercise state + audio resolver + completion gate + XP
       |
       | immutable view model and actions
       v
Course Shell
  context + progress + phase hint + content slots + feedback slot + navigation
       |
       v
Responsive and accessible browser UI
```

The Shell can receive state. It cannot create business truth.

### Shell owns

- Return to learning path and exit confirmation
- Stage, Module, Lesson, and stable course context
- Current step, total steps, progress display, and optional teaching phase
- Korean content, explanation, exercise, audio-status, and feedback slots
- Back, check, continue, finish, relearn, and return presentation
- Completion-summary layout
- Mobile safe-area padding
- Focus order, focus restoration, keyboard visibility, and live-region placement
- Motion tokens and reduced-motion fallback

### Shell does not own

- Correct answers or answer comparison
- XP amounts or first-completion detection
- Course-local mistake and retry rules
- Global ReviewItem rules or schedule
- Audio catalog lookup and exact-text validation
- Completion or release gates
- Recommendations
- Course content or localization source
- Session migration

## Proposed adapter contract

This is a design contract only. It is not implemented in formal runtime.

```js
{
  context: {
    stableId,
    displayNumber,
    stageId,
    chapterId,
    title,
    stageName,
    moduleName
  },
  progress: {
    currentStep,
    totalSteps,
    phaseId,
    phaseLabel,
    canGoBack,
    canContinue
  },
  content: {
    kind,
    korean,
    explanation,
    exerciseView,
    feedbackView
  },
  audio: {
    status,
    label,
    reason
  },
  completion: {
    status,
    firstCompletion,
    awardedXp,
    summary
  },
  actions: {
    back,
    continue,
    check,
    exit,
    relearn
  }
}
```

`status`, `firstCompletion`, `awardedXp`, audio readiness, and `canContinue` must be supplied by the existing engine. They are never inferred from labels or DOM classes.

## Slots and component responsibilities

| Part | Responsibility | Must not do |
|---|---|---|
| `CourseTopbar` | Return, Nikigo identity, language control, exit | Route recommendation or mutate course state |
| `CourseContext` | Stage, Module, Lesson context | Infer taxonomy from title |
| `StepProgress` | Show current/total and engine-provided percentage | Decide whether a step is complete |
| `TeachingPhaseHint` | Present optional phase metadata | Force seven screens |
| `KoreanFocus` | Give Korean text primary hierarchy | Rewrite or transliterate content |
| `ExerciseSlot` | Host the current engine's interactive DOM | Compare answers |
| `AudioStatus` | Present playable, pending, or blocked state | Resolve catalog records or play fallback audio |
| `FeedbackRegion` | Present engine-provided correct/wrong result using `role=status` | Reveal an answer before the engine allows it |
| `CourseActions` | Present engine-provided action availability | Award XP or skip retry gates |
| `ExitDialog` | Confirm exit and retain focus | Save or migrate state directly |
| `CompletionSummary` | Present actual mastery and reward result | Recalculate completion or XP |

## Lesson 0 integration

Lesson 0 should use only the topbar, context, exit semantics, language control, and audio-status presentation. Its map remains the main page body. It has no fabricated step progress and no fixed bottom Continue control.

## Responsive behavior

### 390 px

- 56 px topbar and compact progress strip
- Stage and Lesson context becomes a two-line header above the activity
- One-column content, 18 px horizontal page padding
- Fixed action area respects `safe-area-inset-bottom`
- All primary targets are at least 44 px
- Korean can expand without clipping or forced scale transforms

### 768 px

- Single focused column capped near 720 px
- Stage context remains above content instead of becoming a stretched desktop sidebar
- Exercise controls keep readable line length

### 1440 px

- 1040 px Shell width
- 210 px context rail plus a 720 px learning surface
- No secondary dashboard column or metric cards
- Footer actions stay centered and aligned with the learning surface

## Motion layer

- Surface change: opacity plus 10 px vertical movement, 400 ms
- Feedback entry: opacity plus 8 px vertical movement, 240 ms
- Progress: width transition, 400 ms
- Completion mark: one-time scale from 0.9, 400 ms
- Button press: scale to 0.98, 140 ms
- `prefers-reduced-motion: reduce`: all transitions and animations become effectively instant
- No GSAP, scroll animation, perpetual motion, or decorative gradient motion

## Token summary

| Token group | Values |
|---|---|
| Brand | deep `#2F1B54`, primary `#6750D8`, soft `#ECE8FF`, mist `#F5F2FF` |
| Neutral | page `#F7F5FC`, surface `#FFFFFF`, ink `#211C2B`, muted `#6D6877`, line `#DED9E9` |
| State | success `#16734A`, error `#A43844`, warning `#8A5A00`, focus `#3D66D6` |
| Radius | controls 12 px, main surfaces 20 px, semantic circles only for audio, focus, and completion |
| Spacing | 4, 8, 12, 16, 20, 24, 28, 32, 44, 56, 72 px |
| Type | system UI stack with Noto Sans KR and platform Korean fallbacks |
| Motion | 140, 240, 400 ms with standard and enter easing |

