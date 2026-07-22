# Nikigo Playwright Visual Baseline

## 1. Baseline identity

- Branch: `agent/nikigo-human-ui-refinement-v1`
- Source commit: `3b5ab49f6c11650d5b2cce69ead9daad8d88d9c4`
- Local preview: `http://127.0.0.1:4174/`
- Browser driver: connected `mcp__playwright` server
- Capture date: 2026-07-22
- Screenshot root: `artifacts/human-ui-refinement-v1/baseline/screenshots/`
- Accessibility root: `artifacts/human-ui-refinement-v1/baseline/accessibility/`

The baseline used an isolated Playwright browser profile. It did not read or change the user's normal browser data. Service workers and caches were cleared inside the isolated browser before capture so the screenshots represent the checked-out branch.

## 2. Capture protocol

Every capture waited for `DOMContentLoaded`, `document.fonts.ready`, the active screen or lesson body, and a short rendering-settle interval. Each run recorded the final URL, title, CSS viewport, DPR, body and HTML scroll widths, body height, loaded-font status, visible text length, console errors, failed requests, and HTTP responses with status 400 or above.

The representative active-course profile contained two completed lessons, a reliable resumable `lesson-03` session at 38%, 100 XP, a six-day streak, and no due review. Lesson pages were opened without a pre-existing session so their start states remained visible.

## 3. Page and viewport matrix

The full Chinese pass covered these nine surfaces at 390×844, 768×1024, and 1440×1024:

| Surface | Route |
| --- | --- |
| 首页 | `nikigo-app.html?lang=zh#dashboard` |
| 学习 | `nikigo-app.html?lang=zh#courses` |
| 练习 | `nikigo-app.html?lang=zh#practice` |
| 进度 | `nikigo-app.html?lang=zh#progress` |
| 我的 | `nikigo-app.html?lang=zh#profile` |
| 第4课 | `lesson-04.html?lang=zh` |
| 第7课 | `lesson-07.html?lang=zh` |
| 第11课 | `lesson-11.html?lang=zh` |
| Lesson 6 预览 | `lesson-06.html?lang=zh` |

All 27 Chinese page/viewport combinations had:

- horizontal overflow: `0px`
- fonts: `loaded`
- console errors: `0`
- HTTP 4xx/5xx responses: `0`
- failed requests: `0`
- unexpected non-local requests: `0`

Representative evidence:

- `zh-active-390-home-viewport.png`
- `zh-active-390-learn-full.png`
- `zh-active-768-home-viewport.png`
- `zh-active-1440-home-viewport.png`
- `zh-active-1440-lesson04-full.png`
- `zh-active-1440-lesson07-full.png`
- `zh-active-1440-lesson11-full.png`
- `zh-active-1440-lesson06-preview-full.png`

## 4. User-state matrix

Each state was captured on the Dashboard at all three viewports. Lesson 6 was additionally captured on the Learning page.

| State | Expected primary action | Observed result |
| --- | --- | --- |
| 全新用户 | required setup | `required-setup`, 完成学习设置 |
| 明确活跃课程 | resume active | `resume-active`, `lesson-03`, 继续当前课程 |
| 到期复习 | due review | `due-review`, 开始到期复习 |
| 多个历史未完成且无可靠最近活动 | due review | `due-review`, 未按标题或进度猜测 |
| K0阶段完成 | stage progress | `stage-complete`, 查看阶段进度 |
| Lesson 6门禁关闭 | preview resume | `resume-active`, `lesson-06`, `previewOnly: true` |

Every Dashboard state rendered exactly one `.primary` action and had `0px` horizontal overflow.

Lesson 6 Learning-page evidence was correct at every viewport:

- internal status: `available-content-complete`
- progress: `3/4`
- text: 当前可完成内容已学完
- pending text: `1课音频准备中`
- the course remained visible and enterable

Evidence files use `zh-state-<state>-<width>-home-full.png`, plus `zh-state-lesson06-gated-<width>-learn-full.png`.

## 5. Four-language 390px stress pass

English, Vietnamese, and Japanese were captured across 首页、学习、练习、进度、我的 at 390×844. Chinese was covered by the complete matrix above.

| Language | Horizontal overflow | Important result |
| --- | ---: | --- |
| zh | 0px | text remains present, but the top bar overlaps first-page content |
| en | 0px | no missing strings; Learning reaches 3196px because metadata wraps heavily |
| vi | 0px | no missing strings; Dashboard reaches 1571px and Learning 3270px |
| ja | 0px | no missing strings, but the Dashboard stage label collapses into a narrow vertical column |

The absence of page-level horizontal scrolling is not sufficient acceptance. Japanese has a real narrow-column layout failure, and the English/Vietnamese length increase confirms that the current card and metadata density does not scale well.

## 6. Accessibility snapshot findings

The snapshot set covers all nine surfaces at 390px and all five primary pages at 1440px.

Positive baseline:

- The five primary navigation controls have accessible names.
- The 390px navigation buttons are 69×52 CSS px.
- The language selector and personal entry are 44px high.
- Lesson 11 exposes one H1, a labelled progress region, a labelled objective list, and named start/back controls.
- Lesson links on the Learning page remain real links with stable course routes.

Problems found:

- In DOM and accessibility order, the fixed bottom navigation appears before the page's main content because the navigation is declared before the screens.
- The main product screens are generic containers, not a `main` landmark.
- The Learning hierarchy is correctly exposed as nested groups, but the expanded module produces a very long sequence before the next module.
- The visible top-bar overlap is also present in bounding boxes: the 390px Dashboard content begins at `y=0` under a 60px banner.
- The original emoji/symbol icons are hidden from some accessible names, but their visual family remains inconsistent.

## 7. Baseline visual failures to carry into refinement

1. 390px top bar overlaps Dashboard and Progress headings.
2. Japanese Dashboard stage/module text collapses vertically.
3. Learning page uses nested Stage, Module, and Lesson cards with many pills.
4. Mobile bottom navigation obscures content while scrolling and precedes main content in reading order.
5. Progress is a flat 14-row list rather than Stage and Module evidence.
6. Desktop Practice has excessive unused space and weak task hierarchy.
7. Lesson 4, 7, and 6 use large generic white canvases with more decoration than Korean learning evidence.
8. Lesson 11 has better Korean hierarchy, but its large fixed-feeling canvas creates unused space.
9. Course, metric, and avatar emoji create an inconsistent icon collage.
10. Purple outlines, rounded containers, badges, and tracks give nearly every region equal weight.

## 8. Baseline evidence integrity

- PNG screenshots: 67
- accessibility snapshots: 15
- blank captures: 0
- redirected captures: 0
- wrong CSS viewports: 0
- horizontal-overflow captures: 0
- console errors: 0
- failed or 4xx/5xx requests: 0
- external API requests: 0
- paid API calls and cost: 0
