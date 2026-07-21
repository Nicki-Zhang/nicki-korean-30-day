# Nikigo Clear Interactive · Lesson 11 design QA

## Scope and source

- Source visual target: `/private/tmp/nikigo-clear-interactive-ink-jade/screens/`
- Browser build: `quality-fix/nikigo-clear-interactive-pilot/screenshots/`
- Side-by-side comparison: `quality-fix/nikigo-clear-interactive-pilot/reference-vs-build.png`
- Real interaction recording: `quality-fix/nikigo-clear-interactive-pilot/nikigo-lesson-11-390-flow.mov`
- Pilot scope is limited to the app learning home and Lesson 11. Lessons 0–10 and 12–13 retain their existing lesson renderers.

## Visual fidelity result

Status: PASS after two implementation corrections.

The build preserves the locked Ink & Jade hierarchy: cold neutral canvas, white surfaces, near-black primary actions, jade progress/selection/correct states, and warm red only for errors. It does not introduce purple, gradients, photographs, decorative shadows, stickers, trophies, confetti, or role-colored grammar blocks.

Compared side by side at 390 × 844, the browser build keeps the target’s flat page structure, full-width learning objects, eight-segment progress, 36–44 px Korean hierarchy, and single-task composition. Differences are intentional implementation details: browser language controls, exact Lesson 11 source copy, and a visible secondary Back action required by the existing course logic.

## Self-correction log

1. The first browser run exposed a repeated dashboard mutation: the Korean mission title observer rewrote the same text and retriggered itself. The observer is now idempotent and has an automated guard.
2. The first build-state screenshots put detailed feedback below the 390 px fold. Correct and error explanations now appear immediately beneath the assembled sentence. A correct result hides editing controls; an incorrect result preserves the learner’s order and keeps undo/reorder available without revealing the answer.
3. Browser geometry found two controls below the 44 px target. The home wordmark and lesson Courses action now expose at least 44 × 44 px targets. The final 390/768/1440 run reports no undersized controls or horizontal overflow.
4. A legacy test pinned the previous Service Worker cache name. The new cache keeps the permanent self-review-gate marker and adds a pilot suffix; no cache or privacy gate was weakened.

## Interaction and accessibility

- Course-home entry, all 13 steps, one wrong choice, wrong build, undo/reorder, correct rebuild, mistake retry, summary, completion, relearn, and repeat completion were operated in a disposable real Chrome profile.
- Arrow-key focus moves among phrase objects; Space activates the focused object. Native buttons retain visible focus outlines.
- Reduced-motion CSS reduces transitions to effectively zero.
- Pending Lesson 11 audio remains disabled through the exact catalog resolver. There is no device TTS, text fallback, or similar-audio substitution.
- Simplified Chinese, English, Vietnamese, and Japanese were rendered at 390 px with no `undefined`, overflow, or sub-44 px controls.
- Console warnings: 0. Console errors: 0. Runtime exceptions: 0. HTTP ≥400 responses: 0.

## XP and persistence

- First completion: +50 XP.
- Repeat completion after relearn: +0 XP; total XP remains unchanged.
- Refresh restores the current internal step.
- Browser Back returns to the previous internal step and Forward restores the next step.
- Existing session key, lessonId, stableId, course route, and profile completion contract remain unchanged.

## Rights and asset record

- No new raster, photographic, illustration, icon-library, or third-party brand assets were added.
- Typography uses the project’s existing system-font stack (`Inter` when locally available, then Pretendard/Noto Sans KR/platform sans-serif fallbacks). No font file or remote font request is introduced.
- The existing Nikigo favicon/brand asset is unchanged.
- The 54 sealed audio files, catalog records, and hashes are unchanged. Audio API requests and cost are zero.
