# Homepage Visual Polish V1 — Service Worker Audit

## Baseline comparison

- Baseline: `bccf01b622ddcc0af839ceadf7a28a4f5891e515`
- Baseline cache entries: 138
- Current cache entries: 138
- Added entries: 0
- Removed entries: 0
- Replaced entries: 0
- Duplicate entries: 0

The only `sw.js` change is the cache namespace:

- before: `nikigo-v43-self-review-gate-purple-alignment-v1`
- after: `nikigo-v44-self-review-gate-homepage-visual-polish-v1`

This version change is required so an installed Service Worker does not retain the previous Dashboard HTML/CSS after the formal visual integration.

## Why an earlier report showed 137

The first browser validator used the expression `\.\/[^']+`, which omitted the valid root entry `./` because it requires at least one character after the slash. The Service Worker itself always contained 138 entries; no resource was deleted.

The validator now uses `\.\/[^']*`, includes `./`, and reports 138/138 HTTP 200.

## Runtime safety

- Every baseline resource remains in the current cache list.
- All 14 course HTML entry points remain present.
- All 138 cache entries return HTTP 200 from the formal local preview.
- No formal HTML, CSS or JS reference points to a removed resource because the removed-resource set is empty.
- Install, activate, stale-cache deletion and network-first update behavior are unchanged.
