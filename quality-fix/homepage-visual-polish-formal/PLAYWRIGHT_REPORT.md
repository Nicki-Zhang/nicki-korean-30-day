# Homepage Visual Polish V1 — Browser Validation

## Runtime

- URL: `http://127.0.0.1:4204/nikigo-app.html?lang=zh#dashboard`
- Browser: installed Google Chrome, driven through the repository browser validator; final screens were also inspected in the Codex browser.
- Product source contains no prototype fixture or new formal localStorage key.
- Setup, active Lesson 13 and partial Lesson 5 evidence is created only in fresh isolated browser contexts, using the application's existing profile and session keys before page initialization.

## Responsive and language matrix

Validated 18 state/viewport/language combinations:

- Active course: 390 × 844, 430 × 932, 768 × 1024 and 1440 × 1024 in zh, en, vi and ja.
- Required setup: 390 × 844 in zh.
- Partial K0 progress: 390 × 844 in zh.

All cases returned:

- horizontal overflow: 0
- visible target below 44 × 44px: 0
- highest-weight hero action: exactly 1
- first-level navigation entries: exactly 5, each with one line icon and one visible label
- `document.documentElement.lang`: synchronized
- language control: complete text, integrated chevron and 44px height

At 390px the setup path-node centers are `(89, 587.67)`, `(195, 587.67)` and `(301, 587.67)`, proving a shared horizontal axis. At 1440px the formal active hero is 1180 × 342.08px and the three path centers share x = `937.625`. Maximum tested axis error is 0px.

The language chevron remains visible at every size; its measured right inset is 16.34px. At 768px the select no longer inherits the legacy 118px maximum-width rule.

## State truth

- Setup: progress 0%; Stage and Module are `context`; setup is `current`; no completion check appears.
- Active: Lesson 13, progress 40%; Stage and Module remain contextual because neither level is formally complete; Lesson 13 is current.
- Partial: Lesson 5, progress 60%; real course/session data drives the current Module and Lesson.
- The visible course recommendation is sourced from the existing product architecture selector. Lesson 6 gate and recommendation behavior were not reimplemented in the Dashboard.

## Accessibility and interaction

- Accessibility structure exposes a banner, one H1, localized primary navigation, current-location complementary region, named progress bar, named primary button and ordered path content.
- Each first-level icon is `aria-hidden`; each label remains visible; the selected route exposes `aria-current="page"`.
- The current lesson exposes `aria-current="step"` and explicit non-color state text.
- All formal-shell `button`, `a`, `select` and `summary` controls have a 3px `:focus-visible` ring.
- `#dashboard`, `#courses`, `#practice`, `#progress` and `#profile` were exercised. Browser back and refresh preserve the selected route.
- Reduced-motion CSS disables non-essential transitions; no state information depends on motion.

## Console and network

- Console errors: 0
- Console warnings: 0
- External runtime resources: 0
- External API calls: 0
- Fees: 0
- Service Worker cache entries: 138/138 HTTP 200

The previous 137 count was a validator accounting defect: its resource regex excluded the root `./` entry. `SERVICE_WORKER_AUDIT.md` confirms that baseline and current `sw.js` both contain the same 138 unique resources; only the cache namespace changed.

The exact machine-readable matrix is in `VALIDATION_RESULT.json`.
