# Classic Focus Course Visual Protection

The formal color alignment is intentionally scoped away from Classic Focus.

## Protected courses

- Lesson 4
- Lesson 5
- Lesson 7
- Lesson 8
- Lesson 11
- Lesson 12
- Lesson 13

## Browser comparison

Each course was rendered at 390×844 from the formal baseline (`4203`) and aligned
implementation (`4202`) using the same test state.

For all seven courses:

- screenshot SHA-256 is byte-identical before and after
- body text is identical
- DOM element count is identical
- page height is identical
- horizontal overflow is zero

| Course | Identical screenshot SHA-256 |
| --- | --- |
| Lesson 4 | `c581e067cbc7a71b5c2231c06cc61a6a8307502279be33c7b7d20822d9d17586` |
| Lesson 5 | `2a618e89bfa9139cbb9df8cdef7bfadca563898be38675997c82dbd61c491535` |
| Lesson 7 | `e3c831ab5029ebef232aaba9fb565e7cc726dee553d3293efe5c5dc6b214789a` |
| Lesson 8 | `1fb92bf344979ec9971139cc9f1fec26fe34b08f811251273ce7327190e77c4c` |
| Lesson 11 | `4d494ceb7af787994cece8f8eca4ed6a0d1218ef7721c0e0086eb2542361fe20` |
| Lesson 12 | `9e1714b311092082f4596c17e1f474423b89ac1284df37582b1965d3ee434064` |
| Lesson 13 | `796de6baebce8568313389a47abcbb31171215dc5fec6c486f79945605e5b614` |

## Source protection

No diff exists for:

- `assets/classic-focus-tokens.css`
- `assets/classic-focus-shell.css`
- `assets/classic-focus-shell.js`
- protected Lesson HTML, CSS, JS, answers, and Adapters

The Classic Focus logo, primary action, progress bar, emphasis color, audio
availability, and request behavior remain unchanged.
