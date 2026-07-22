# Nikigo Playwright Final Acceptance

## Result

Pass. The human UI refinement is accepted locally on `agent/nikigo-human-ui-refinement-v1`. GSAP was not added. No deployment or merge was performed.

## Automated validation

| Check | Result |
| --- | --- |
| `npm test` | pass |
| `npm run test:architecture` | pass |
| `node scripts/validate-app-shell.mjs` | pass |
| `node scripts/validate-service-worker.mjs` | pass |
| `git diff --check` | pass |
| Static screenshots | 69 non-empty PNGs |
| Accessibility snapshots | 14 Markdown snapshots |

The clear-pilot validator was minimally updated to enforce the new semantic contract: primary navigation must be inside the top shell and before `main`. The test was not removed or weakened.

## Real-browser matrix

- Chinese: 首页、学习、练习、进度、我的、第4课、第7课、第11课、Lesson 6 at 390×844, 768×1024, and 1440×1024.
- English, Vietnamese, Japanese: all five primary pages at 390×844.
- All tested documents: 0px horizontal overflow.
- All four languages: no clipped visible content.
- Mobile primary navigation: 44px minimum height.
- Dashboard: exactly one primary recommendation in every tested language and user state.
- Console: 0 errors, 0 warnings.
- Network: 0 failed requests, 0 HTTP errors, 0 external/API requests.

## User-state and recommendation regression

| State | Browser result |
| --- | --- |
| Required setup | `required-setup` |
| Reliable active lesson | `resume-active`, `lesson-03` |
| Due review | `due-review` |
| Ambiguous historical progress | `due-review`; no guessed lesson |
| K0 formally complete | `stage-complete` |
| Lesson 6 active preview | `resume-active`, `lesson-06`, `previewOnly: true` |

Each result exposed one and only one `#primaryAction`.

## Course interaction regression

### Lesson 11

The browser completed the lesson twice through real controls.

- Start was activated with Enter and had a visible 3px focus outline.
- Refresh restored step 2 of 13.
- Browser Back returned from step 3 to step 2; Forward restored step 3.
- A deliberately wrong `name-response` answer added the ReviewItem/mistake ID.
- Wrong feedback said to inspect the structure and did not reveal `저는 하늘이에요.`.
- The retry phase was entered and cleared after the corrected answer.
- First completion changed XP from 100 to 150 and displayed `首次完成 +50 XP`.
- Refresh preserved the completed state.
- `重新学习` returned to the opening step.
- Repeated completion kept XP at 150 and displayed `重复完成 +0 XP`.

Evidence:

- `static/screenshots/zh-final-390-lesson11-wrong.png`
- `static/screenshots/zh-final-390-lesson11-correct.png`
- `static/screenshots/zh-final-390-lesson11-complete-repeat.png`

### Lessons 4 and 7

Both direct routes loaded with the correct lesson title. Enter advanced each lesson from step 1 to step 2, visible focus was present, refresh restored step 2, and horizontal overflow remained 0.

### Lesson 6 gate

A hostile persisted fixture attempted to set Lesson 6 to the final step with `completed: true` while the audio gate was closed. The runtime normalized it to:

- `AUDIO_RELEASE_READY: false`
- `completed: false`
- preview-finished state only
- XP unchanged at 300
- `lesson-06` absent from formal completions
- preview/audio copy present, formal completion/+50 copy absent

Learning-page fixtures at all three widths showed `3/4`, `当前可完成内容已学完`, and `1课音频准备中`, while preserving the direct Lesson 6 link.

## Navigation, accessibility, and motion

- `#dashboard`, `#courses`, `#practice`, `#progress`, and `#profile` resolve to their matching active screens.
- All five navigation buttons respond to Enter and show visible focus.
- `review.html?lang=zh` and Lessons 4, 7, 11, and 6 direct links load successfully.
- Reading order is header/navigation followed by `main`.
- Native module disclosures remain keyboard-operable.
- With `prefers-reduced-motion: reduce`, visible controls use effectively instant animation and transition durations and remain usable.
- No GSAP dependency, animation runtime, or motion-specific state was introduced.

## Protected integrity

| Protected item | SHA-256 / result |
| --- | --- |
| `app-state.js` | `aa4ad0b06782ae58466a8f49bc3020ea0d6b25d1ec209ca25d26005c7bee6c1e` |
| `course-catalog.js` | `63d0c4353883ee560e3f08775570e4d5092a6d95ea0653b358a67a90ab49b730` |
| `audio-catalog.js` | `107ddd9abac3824ad735de633763adbdac7b82bedbb5b97ea434741cc695fb7f` |
| all tracked MP3/WAV aggregate | `40eefa5da3fa20050d404acd205f28d129a9a02db9f9355e8a3509d63bee9c9e` |
| primary-workspace `CODEX_HANDOFF.md` | `2117c2f00fa55e14cd13c9d0668d9b13f2400f5b92996707f59307084de1334c` |
| protected-file diff | none |
| MP3/WAV diff | none |
| approved catalog records | 54, validated |

The existing untracked `CODEX_HANDOFF.md` in the primary workspace remains unmodified.

## Cost and external effects

- Paid API calls: 0
- API cost: 0
- External network requests: 0
- Deployment: none
- Main merge: none
