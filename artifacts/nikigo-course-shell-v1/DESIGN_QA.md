# Course Shell V1 Design QA

## Taste audit

The prototype avoids the patterns that made earlier pages feel like an AI-generated dashboard:

- one learning surface instead of a card wall;
- no metric cards, decorative badges, glass layers, neon, or ornamental gradients;
- Korean is the dominant content, not a statistic or illustration;
- Stage and Module context is quieter than the current activity;
- correct, wrong, gate, and completion states use semantic color plus words and icons;
- the three course types share outer rhythm while retaining their actual teaching structure.

## Frontend Design decisions

- V4 purple and white are retained through one restrained introduction gradient and purple controls.
- Desktop uses a 210 px context rail and a focused 720 px learning surface, not a dashboard grid.
- Mobile removes the rail and promotes compact Stage/Lesson context above the task.
- Foundation teaching centers the Hangul form; scenario work centers dialogue; checkpoint work centers the integrated question.
- Lesson 0 remains non-linear and receives only shared context, exit, language, and audio-status treatment.

## Ponytail reduction

- Native HTML, CSS, and JavaScript only.
- No framework, component library, dependency, generated design system, or runtime persistence.
- One HTML file, one CSS file, and one fixture-only JavaScript file provide all prototype states.
- CSS handles every motion need; GSAP and Web Animations API are unnecessary.
- The Shell contract is documented but not introduced into formal runtime prematurely.

## UI and Web Guidelines review

- A real skip link precedes the header.
- `main`, `header`, `footer`, progressbar, status regions, native buttons, select, and dialog retain semantic behavior.
- Focus uses a high-contrast 3 px outline and remains visible for keyboard users.
- All visible controls are at least 44 px in representative 390, 768, and 1440 px states.
- Wrong feedback does not rely on color and does not reveal the correct answer.
- The Lesson 6 warning states that free entry is allowed while formal completion and XP are unavailable.
- Fixed mobile actions reserve bottom content space and respect `safe-area-inset-bottom`.
- There is no horizontal overflow in zh, en, vi, or ja at 390 px.
- Motion uses transform/opacity/width only, has short fixed durations, and fully respects reduced motion.
- No external font, image, API, analytics, or media request is made.

## Prototype-only limitation

The fixture demonstrates view states; it deliberately does not implement actual answer ownership, XP calculation, retry scheduling, audio resolution, completion gates, recommendation, session migration, or saved progress. Those responsibilities remain with existing engines and adapters.

