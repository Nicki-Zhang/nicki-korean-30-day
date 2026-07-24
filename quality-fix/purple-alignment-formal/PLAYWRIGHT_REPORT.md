# Playwright Report — Purple Alignment Formal

## Browser coverage

- 390×844
- 768×1024
- 1440×1024
- zh, en, vi, ja at 390px

## Pages

Dashboard, Learn Stage, Learn Module, Practice, Progress, Profile, Review,
Diagnostic, and Lessons 4/5/6/7/8/11/12/13.

## Results

- Geometry comparisons: 24/24 exact
- Four-language page checks: 28/28 with correct `html[lang]`
- Horizontal overflow: 0
- Console warnings: 0
- Console errors: 0
- Page exceptions: 0
- Failed network requests: 0
- HTTP responses ≥400: 0
- External requests: 0
- Service Worker cache assets: 138/138 HTTP 200
- Active cache namespace: `nikigo-v43-self-review-gate-purple-alignment-v1`

## Keyboard, focus, and ARIA

- Active mobile navigation exposes `aria-current="page"`.
- Focus outline is 3px solid `rgba(109, 74, 255, 0.48)`.
- Learn Stage tabs expose `aria-selected` and roving `tabindex`.
- Arrow Right, Home, and End move focus and selection correctly.
- Main landmark and primary navigation label remain present.
- Progress continues to expose `role="progressbar"` and numeric bounds.
- Reduced motion produces `0.01ms` animation and transition durations without
  removing state information.

## Routing and state

- Dashboard exposes exactly one visible primary recommendation action.
- Stage URL survives refresh.
- Browser Back returns to the prior App Shell route.
- Language switching updates the URL and `document.documentElement.lang`.
- Product copy, DOM, and route structure are unchanged by the color pass.

## Responsive and language pressure

All 28 page/language combinations had zero horizontal overflow. English,
Vietnamese, Japanese, and Chinese wrap naturally. The text-overflow detector
reported only line-box rounding and deliberately visually-hidden control labels;
manual screenshot review found no truncated visible copy.

## Inherited target-size note

The modified App Shell targets retain the existing ≥44px contract. Standalone
Review and Diagnostic header logo/language controls remain smaller than 44px,
unchanged from the baseline because this pass forbids geometry changes.
