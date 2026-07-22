# Git state and safe file grouping

## Branch baseline

- Branch: `agent/nikigo-learn-v4-integration`
- HEAD: `f0e81457fb95dfbdd0c4e409812e7d9ab54d2efd`
- The branch was created without reset, checkout of files, clean, stash or deletion.
- No V4 formal implementation commit exists. No push, merge or deploy was performed.

## File groups carried into this branch

### B formal shell / architecture work already present

- `assets/nikigo-clear-shell.js`
- `assets/nikigo-product-shell.js`
- `progress-selectors.js`
- `scripts/validate-clear-interactive-pilot.mjs`
- `assets/nikigo-friendly-learning-path.css`
- B-related hunks in `nikigo-app.html`, `package.json` and `sw.js`

These files remain present. Their shared runtime files overlap later Learn-page work and therefore require hunk-level staging if committed separately; they must not be split by blindly staging whole files.

### V3 historical exploration and paused formal attempt

- `artifacts/nikigo-learn-v3/`
- `artifacts/nikigo-learn-v3-formal/`
- `assets/nikigo-learn-v3.css`
- `assets/nikigo-learn-v3.js`
- `scripts/test-learning-page-v3.mjs`
- the earlier V3 QA content in `design-qa.md`

V3 files are preserved and not deleted. V3 CSS/JS are no longer referenced by the formal app, package test entry or Service Worker.

### Selected V4 isolated prototype and evidence

- `artifacts/nikigo-learn-v4-brilliant-inspired/` (34 isolated files)

This directory remains an isolated design artifact. No formal app file is imported from it.

### V4 formal integration added locally

- `assets/nikigo-learn-v4.css`
- `assets/nikigo-learn-v4.js`
- `assets/nikigo-learn-v4/` (eight optimized WebP assets)
- `scripts/test-learning-page-v4.mjs`
- `artifacts/nikigo-learn-v4-formal/`
- V4-specific hunks in `nikigo-app.html`, `package.json` and `sw.js`
- focused V4 decision updates in `NIKIGO_PRODUCT_ARCHITECTURE_V1.md` and `NIKIGO_STAGE_CHAPTER_TAXONOMY_V1.md`

### Architecture and copy evidence

- `NIKIGO_STAGE_NAME_COPY_MATRIX.md`
- the two architecture documents above
- `diagnostic.html` contains the already approved K1 four-language naming correction that pre-dated this V4 integration pass

### Older visual experiments, intentionally retained

- `artifacts/nikigo-friendly-learning-path-v1/`
- `artifacts/nikigo-visual-exploration-v2/`
- `artifacts/purple-premium-exploration-v1/`

They are not loaded by the V4 runtime.

## Proposed later commit split

1. Design evidence: isolated V4 prototype, its evidence/asset manifest, plus this formal comparison and browser report.
2. Architecture decision: only the focused product/taxonomy/copy-matrix changes.
3. Formal implementation: V4 runtime CSS/JS/assets, `nikigo-app.html` V4 integration hunks, V4 test, package test swap and Service Worker asset list.
4. Preserve B work as its own review unit. Because `nikigo-app.html`, `package.json` and `sw.js` overlap, use interactive/hunk staging rather than whole-file staging.

No commit has been created because final product acceptance is still pending.
