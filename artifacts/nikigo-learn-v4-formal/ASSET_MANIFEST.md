# V4 formal illustration manifest

All eight files are locally served, 443 × 443 WebP assets derived from the already approved original Nikigo V4 prototype illustrations. No Brilliant asset, traced artwork, inline SVG, emoji substitute or runtime external image request is used.

| File | Use | Bytes | Loading |
|---|---|---:|---|
| `stage-k0.webp` | K0 Stage introduction | 17,114 | eager, `fetchpriority="high"` |
| `stage-k1.webp` | K1 Stage introduction | 9,078 | eager, `fetchpriority="high"` |
| `module-k0-map-vowels.webp` | K0 Module 1 | 14,510 | lazy on Stage path; eager in Module detail |
| `module-k0-consonants-syllables.webp` | K0 Module 2 | 11,488 | lazy on Stage path; eager in Module detail |
| `module-k0-batchim-sound.webp` | K0 Module 3 | 6,932 | lazy on Stage path; eager in Module detail |
| `module-k0-checkpoint.webp` | K0 Module 4 | 10,126 | lazy on Stage path; eager in Module detail |
| `module-k1-identity.webp` | K1 Module 1 | 11,332 | lazy on Stage path; eager in Module detail |
| `module-k1-numbers.webp` | K1 Module 2 | 12,438 | lazy on Stage path; eager in Module detail |

Every rendered image declares `width="443"` and `height="443"`. The text adjacent to each illustration contains the full Stage or Module meaning, so these decorative images use `alt=""`. All eight files are included in the existing Service Worker cache strategy.
