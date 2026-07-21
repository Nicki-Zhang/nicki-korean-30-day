# Seoul Night Journey + Focused Learning — First-Round Design QA

Reference source: `ScreenRecording_07-18-2026 13-09-48_1.MP4`

Scope is intentionally limited to the 390px home, Lesson 11 opening, and Lesson 11 line-by-line dialogue. Core expression, correct feedback, wrong feedback, phrase build, completion, desktop adaptation, and whole-course migration remain unchanged pending product approval.

## Visual truth and implementation evidence

- Reference frames: `reference/context.png`, `reference/dialogue.png`
- New implementation: `visual-v2-390/01-home.png`, `02-lesson-11-opening.png`, `03-dialogue.png`
- Previous-vs-new comparison: `visual-v2-390/previous-vs-seoul-night.png`
- Reference-vs-implementation comparison: `visual-v2-390/reference-vs-implementation.png`
- Viewport and state: 390 × 844, Simplified Chinese, one visible-link flow from home to Lesson 11 and then its first dialogue line.

## Self-critique and corrections

1. The earlier home was structurally correct but read like a collection of small cards. The new home establishes one dominant Seoul-night mission, keeps Korean at the highest visual level, and moves progress and the next stop into one quiet journey panel.
2. The earlier opening used a small dark card inside a large empty canvas. The new opening uses the full mobile width, a real Seoul night photograph, three compact objectives, an estimated duration, a route preview, and one 54px start action.
3. The earlier dialogue looked like a generic white lesson card. The new focused state removes the outer card, identifies both speakers with one icon family, highlights the active speaker, and reveals one 38px Korean line at a time.
4. Returning from dialogue initially removed the scene image because the enhancement marker survived a course re-render. The guard now checks the rendered scene itself, so returning and reloading restore the same opening.
5. Pending audio remains visibly disabled and is not replaced by TTS, text narration, or another asset.

## Tokens and interaction checks

- Story palette: `#0d1238`, `#27205e`, `#744cff`, `#9e86ff`
- Stage accents: listening `#2f6df6`, expression `#f4c552`, build `#d868d7`, reaction `#ef725f`, summary `#2b9a70`
- Semantic status: success `#0d7653`, error `#b13e50`
- Type: Korean target 38–40px; body 16px; supporting labels 10–13px
- Spacing: 8px base scale; 16px mobile content margin
- Radius: 24px panels; 16px controls
- Shadow: `0 18px 48px rgba(12,16,54,.24)`
- Primary button: 54px
- Motion: 180ms ordinary transitions; 320ms completion token
- Safe-area and `prefers-reduced-motion` are present.
- DOM width checks: 390px viewport, 390px document/body width, no horizontal overflow.
- Console warning/error count: 0.
- Four auxiliary languages render the dialogue title without `undefined`; Korean target text remains unchanged.

Final result: passed
