# Nikigo Course Shell V1 Prototype

This directory is an isolated design prototype. It does not load or modify formal lesson files, catalogs, audio, XP, review scheduling, or user storage.

## Review documents

- `COURSE_ENGINE_ADAPTATION_MATRIX.md`: evidence-based Lesson 0, 4, 6, 7, 10, and 11 engine review
- `SHELL_ARCHITECTURE.md`: Shell boundary, adapter contract, tokens, components, responsive behavior, and motion
- `DESIGN_QA.md`: Taste, Frontend Design, Ponytail, UI, and Web Guidelines decisions
- `PLAYWRIGHT_VALIDATION.md`: browser, accessibility, keyboard, responsive, network, and motion results
- `I18N_DIAGNOSIS_AND_VALIDATION.md`: P0 mixed-language diagnosis, strict copy contract, and four-language evidence
- `BROWSER_VALIDATION.json`: machine-readable Chrome validation output

Evidence is stored in `evidence/`, deterministic motion frames in `motion-frames/`, and the isolated local-Chrome recording in `course-shell-motion-demo.mov`.

## Preview

```text
http://127.0.0.1:4181/artifacts/nikigo-course-shell-v1/index.html?course=lesson07&state=intro&lang=zh
```

Supported course fixtures:

- `lesson07`: foundation teaching
- `lesson11`: scenario mission
- `lesson10`: stage checkpoint
- `lesson06`: required-audio gate

Add `lab=1` to show the prototype-only course and state switcher. The switcher updates the URL only. It never writes `localStorage`.

Run the dedicated four-language test with:

```text
node artifacts/nikigo-course-shell-v1/validate-course-shell-i18n.mjs
```

## Evidence states

- Introduction: `course=lesson07&state=intro`
- Explanation: `course=lesson07&state=explain`
- Korean example and audio: `course=lesson07&state=example`
- Audio unavailable: `course=lesson07&state=audio-unavailable`
- Choice: `course=lesson11&state=choice`
- Wrong feedback: `course=lesson11&state=wrong`
- Retry: `course=lesson11&state=retry`
- Build: `course=lesson11&state=build`
- Checkpoint: `course=lesson10&state=choice`
- Completion: `course=lesson10&state=complete-first`
- Repeat completion: `course=lesson10&state=complete-repeat`
- Lesson 6 gate: `course=lesson06&state=gate`
