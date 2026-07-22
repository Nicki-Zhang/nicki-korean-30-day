# Nikigo UI Reduction Plan

## 1. Ponytail mode and hard boundaries

- Skill: `ponytail`
- Intensity: `full`
- Goal: the smallest reviewable static UI diff that resolves the evidence in `TASTE_AUDIT.md`
- Higher-priority constraints: product architecture, course/state behavior, audio gates, accessibility, safety, compatibility, and all required tests

The implementation will not add a framework, component library, icon package, animation package, parallel design system, speculative component, or future vocabulary/game surface.

## 2. Change-by-change reduction review

### R1. Fix shell order, landmarks, and mobile header overlap

1. Is it needed? Yes. The 390px banner visibly covers content and the accessibility tree reads bottom navigation before the page.
2. Is there an existing implementation to reuse? Yes. Keep the current `#appNav`, `go()` handlers, screen IDs, and sticky header.
3. Can native HTML/CSS do it? Yes. Move the existing nav after the screen container, add one `main` landmark, and correct mobile content/header spacing.
4. Can current dependencies do it? No dependency is needed.
5. Is a new file or abstraction needed? No.
6. Smallest reviewable diff? A structural move in `nikigo-app.html` with no ID or handler changes, plus focused rules in `assets/nikigo-purple-shell.css`.

### R2. Make the Dashboard content-first without replacing its architecture

1. Is it needed? Yes. Japanese stage text collapses, the active action competes with decoration, and equal metric tiles weaken hierarchy.
2. Is there an existing implementation to reuse? Yes. Reuse `.dashHero`, `.heroContinue`, `.pathBadge`, `.metrics`, and the existing recommendation view model.
3. Can native HTML/CSS do it? Yes. Use a two-row mobile stage summary, hide decorative course emoji, reduce radii/shadow, and treat metrics as one information strip.
4. Can current dependencies do it? Yes. Existing CSS is sufficient.
5. Is a new file or abstraction needed? No.
6. Smallest reviewable diff? CSS overrides in `assets/nikigo-purple-shell.css`; no recommendation, state, or route code changes.

### R3. Reduce Learning card soup and metadata pills

1. Is it needed? Yes. Stage → Module → Lesson is correct, but the third rounded-card tier and badge cloud make 390px Learning 2140-3270px tall.
2. Is there an existing implementation to reuse? Yes. Keep the existing taxonomy `<details>` structure, native disclosure behavior, course links, stable IDs, and metadata strings.
3. Can native HTML/CSS do it? Yes. Preserve Stage and Module containers while rendering Lesson articles visually as compact rows. Change badges into a wrapping metadata line and make the audio gate a readable status.
4. Can current dependencies do it? Yes. No accordion or component package is required because `<details>/<summary>` already handles interaction and keyboard behavior.
5. Is a new file or abstraction needed? No.
6. Smallest reviewable diff? CSS only in `assets/nikigo-purple-shell.css`; keep `courseRowMarkup()` and course access logic intact.

### R4. Clarify Practice, Progress, and Settings with existing data

1. Is it needed? Yes. Practice has redundant headings and empty space, Progress is a flat 14-track wall, and Settings repeats equal metric cards.
2. Is there an existing implementation to reuse? Yes. Reuse Practice data and actions, `NikigoProductArchitecture.taxonomyView`, existing progress percentages, and labelled native settings controls.
3. Can native HTML/CSS do it? Mostly. Practice and Settings need only CSS. Progress needs a small display-only renderer change to group existing evidence by Stage and Module.
4. Can current dependencies do it? Yes. The taxonomy view model already exists; no new selector or state shape is needed.
5. Is a new file or abstraction needed? No. Do not create a progress component layer.
6. Smallest reviewable diff? Adjust the inline `renderProgress()` markup in `nikigo-app.html` and add corresponding rules in `assets/nikigo-purple-shell.css`. Do not alter values or completion rules.

### R5. Unify Lessons 4, 7, 11, and Lesson 6 through existing CSS

1. Is it needed? Yes. Lessons 4/7/6 have large decorative canvases and Lesson 11 has a different fixed-feeling vertical rhythm.
2. Is there an existing implementation to reuse? Yes. Lessons 4/7/6 share `lesson-player.css`; Lesson 11 already has `lesson-purple-interactive.css` over its interaction CSS.
3. Can native HTML/CSS do it? Yes. Reduce canvas minimum heights, radius, shadow, empty space, and equal feature-card weight. Keep every lesson DOM hook and generated content block.
4. Can current dependencies do it? Yes. No GSAP or component package is required.
5. Is a new file or abstraction needed? No.
6. Smallest reviewable diff? Shared overrides in `lesson-player.css` and `lesson-purple-interactive.css`. Do not edit lesson JS, answers, steps, or content.

### R6. Keep motion and caching minimal

1. Is it needed? Static focus, hover, disclosure, and state feedback are needed. Decorative animation is not.
2. Is there an existing implementation to reuse? Yes. Existing CSS transitions and reduced-motion blocks already cover interaction feedback.
3. Can native HTML/CSS do it? Yes.
4. Can current dependencies do it? Yes. GSAP is not needed unless later browser evidence proves a state transition cannot be understood without coordinated motion.
5. Is a new file or abstraction needed? No.
6. Smallest reviewable diff? Keep CSS transitions on color/opacity/transform, preserve `prefers-reduced-motion`, and update only the existing Service Worker cache version after CSS changes. Do not change cache behavior.

## 3. Planned files

Expected product-source edits:

1. `nikigo-app.html`
2. `assets/nikigo-purple-shell.css`
3. `lesson-player.css`
4. `lesson-purple-interactive.css`
5. `sw.js` cache version only

Documentation and evidence:

1. `PLAYWRIGHT_VISUAL_BASELINE.md`
2. `TASTE_AUDIT.md`
3. `UI_REDUCTION_PLAN.md`
4. `artifacts/human-ui-refinement-v1/`

Files explicitly excluded:

- `course-catalog.js`
- `app-state.js`
- `audio-catalog.js`
- all lesson JavaScript and answer/content data
- all MP3/WAV files and audio manifests
- `CODEX_HANDOFF.md`

## 4. Deliberately skipped

- No framework or component-library migration.
- No second design-system directory.
- No new icon dependency. Decorative emoji are hidden where they create collage; functional controls keep text labels.
- No GSAP for disclosure, hover, page entry, or card motion.
- No copy rewrite beyond removing visual repetition through layout.
- No redesign of onboarding/auth because it is outside the requested primary acceptance matrix.
- No speculative empty vocabulary/game entry.
- No persistence or state migration.

## 5. Review ceiling

This plan intentionally keeps the current vanilla HTML/CSS architecture. If later product growth makes inline screen rendering difficult to maintain, componentization should be approved as a separate architecture task with migration fixtures. It is not justified by this visual refinement alone.
