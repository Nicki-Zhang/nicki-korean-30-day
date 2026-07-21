# Course Experience Redesign Pilot — 390px Design QA

Reference source: `ScreenRecording_07-18-2026 13-09-48_1.MP4`

The approved direction is a deliberate hybrid: Korean Life Journey for the home and mission opening, then Focused Learning Mode for every individual task. The eight screenshots in `flow-390/` were captured in order from one learner session entered through the visible journey-home link.

## Visual comparison findings and corrections

1. The reference provides strong context and momentum but exposes too many navigation choices at once. Nikigo keeps the journey framing on home and removes the extra navigation once a focused task begins.
2. The earlier pilot still read as white cards with purple accents. The new home uses a warm journey canvas and a deep mission brief; formal tasks return to a restrained, high-contrast learning surface.
3. Korean is now the strongest typographic layer. Task instructions follow, auxiliary-language explanations are smaller, and progress stays quiet at the top.
4. Dialogue is revealed one line at a time. The course cannot continue until all lines have been viewed.
5. Wrong feedback identifies the failed attempt without exposing the correct option or explanation. The missed task is required again before completion.
6. A disabled next button no longer competes with the active task control. One visually primary action remains per state.
7. Completion summarizes exact Korean expressions and keeps “relearn” available without granting duplicate XP.

## Final checks

- One continuous 390 × 844 flow: home, opening, dialogue, core expression, correct, wrong, build, completion.
- 8px spacing scale, shared colors, typography, radii, shadow, button height, motion timing, content width, and safe-area tokens.
- Correct, wrong, disabled, and focus states are not color-only.
- Interactive targets are at least 44px.
- Reduced-motion and safe-area preferences are supported.
- No device TTS, text fallback, similar-audio substitution, generated audio, or audio API request.
- Lessons 4 and 13 retain their pronunciation and number/build-specific interactions inside the same shared shell.
- Desktop migration and full-course rollout remain intentionally out of scope until product approval.

Final result: passed
