# Homepage Visual Polish V1 — Formal Integration

## Scope

The approved Homepage Visual Polish V1 prototype is connected to the real Dashboard without changing recommendation, course, progress, review, XP, language or route behavior.

Formal runtime changes are limited to:

- `nikigo-app.html`: five-item navigation with uniform line icons, compound language control, coherent Stage/Module/Lesson context, explicit path states and localized accessible labels.
- `assets/nikigo-friendly-learning-path.css`: approved responsive composition and geometry.
- `sw.js`: new cache version for the changed shell resource.
- `package.json`, `scripts/validate-homepage-visual-polish.mjs` and `scripts/validate-homepage-visual-polish-browser.mjs`: permanent static and browser validation coverage.

## Approved layout preserved

- Brand primary remains `#6D4AFF`.
- Desktop Dashboard width is 1180px inside a 1200–1280px reading frame.
- Desktop hero uses a 310px minimum and resolves to 342px with the real Lesson 13 content, with an approximately 65/35 learning-task/path split.
- Mobile content uses 18px horizontal margins.
- Mobile Stage → Module → Lesson is a compact horizontal path matching the approved prototype.
- Desktop and mobile both expose exactly five first-level routes: `#dashboard`, `#courses`, `#practice`, `#progress` and `#profile`.
- The real App Shell profile control is retained in addition to the explicit “My” navigation entry.
- Real application state replaces prototype fixtures.

## Business boundary

No recommendation policy is copied into the DOM renderer. The Dashboard continues to consume the existing view model and selectors. No user fixture, fake completion, fixed course, fixed XP or prototype localStorage key is used in product code.

The formal state binding is fail-closed:

- setup renders Stage and Module as context and the setup node as current;
- Stage or Module displays a completion state only when the existing selectors provide real completion evidence;
- the lesson node is the sole current node;
- course-specific Korean hero copy is shown only when it already exists in the approved application data. The catalog does not expose such copy for every course, so the formal renderer does not fabricate it.

The isolated browser validator constructs valid setup, active and partial states before application startup. Those states exist only inside fresh test browser contexts and never enter runtime source or a production storage key.

No course, state, catalog, audio, XP, review, completion-gate or route business file changed.

## Deferred existing P1

The standalone Review and Diagnostic header logo/language controls remain below the product-wide 44px target in their existing pages. This pre-existing issue is recorded in `quality-fix/purple-alignment-formal/PLAYWRIGHT_REPORT.md` and is outside this Dashboard-only integration.
