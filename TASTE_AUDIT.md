# Nikigo Taste Audit

## 1. Design read

Reading this as: a preserve-mode redesign of an accessibility-critical Korean learning product for global learners, with a calm purple-and-white language and evidence-first hierarchy, leaning toward native HTML/CSS and the existing Nikigo shell.

Taste settings for this product surface:

- `DESIGN_VARIANCE: 4`
- `MOTION_INTENSITY: 2`
- `VISUAL_DENSITY: 7`

The Taste Skill explicitly excludes dashboards and multi-step product UI from its default landing-page patterns. This audit therefore uses only its preserve-mode redesign protocol, anti-template checks, hierarchy rules, shape consistency, content-density rules, and accessibility guardrails. It does not apply marketing heroes, image-generation requirements, dark-mode defaults, or landing-page section patterns to Nikigo.

## 2. Evidence-based findings

| ID | Page and screenshot evidence | Severity | Finding | Decision | Four-language and responsive impact |
| --- | --- | --- | --- | --- | --- |
| T01 | 首页, `zh-active-390-home-viewport.png`; 进度, `zh-active-390-progress-full.png` | Blocker | The 60px top bar overlays the first content row. Greeting or H1 text is partially hidden behind the logo and selector. | Restructure spacing/positioning. Keep the compact top bar, add a reliable content offset without viewport-specific hacks. | Affects all four languages at 390px. Longer Japanese and Vietnamese headings lose more readable area. |
| T02 | 首页, `ja-active-390-home-full.png` | Blocker | The stage badge's middle column shrinks to a few pixels, forcing Japanese characters into a vertical stack. This is not intentional vertical typography. | Restructure the mobile stage summary into two rows. Keep Stage, name, module, and full-path action. | Japanese is visibly broken. English also shows a compressed nested span. Chinese and Vietnamese remain fragile. |
| T03 | 学习, `zh-active-390-learn-full.png`, `zh-active-1440-learn-full.png` | High | Card soup: Stage card contains Module cards, which contain Lesson cards. The expanded path has three nested rounded/bordered levels. | Restructure. Keep Stage and Module grouping, replace inner lesson cards with compact rows separated by spacing or hairlines. | Reduces 390px height and improves all long translations. Stage and Module semantics remain unchanged. |
| T04 | 学习, same evidence as T03 | High | Pill proliferation: duration, XP, state, audio status, and prerequisite suggestion are all separate rounded pills. Important audio readiness competes with routine metadata. | Delete routine pill styling. Keep the data; combine duration/XP/status into one metadata line and give audio gate its own plain status line. | English and Vietnamese currently create very tall rows. Simplification materially reduces wrapping in all languages. |
| T05 | 首页, `zh-active-1440-home-viewport.png`; 进度, `zh-active-1440-progress-full.png`; 我的, `zh-active-1440-me-full.png` | High | Nearly every surface is a white rounded card with a purple outline or pale purple fill. Primary, supporting, and passive information receive similar weight. | Restructure into no more than three levels: gradient primary action, bordered section, unboxed row. | Helps desktop hierarchy and reduces mobile stacking without changing copy. |
| T06 | 首页 and 学习 across 390/1440 | High | The visual language resembles a generic purple SaaS dashboard: centered segmented nav, purple gradient hero, equal metric tiles, pills, emoji tiles, and rounded white cards. | Keep Nikigo purple, the single Dashboard gradient, and five responsibilities. Remove template-like decorative conventions and make Korean content the strongest element. | Consistent across languages. Longer strings expose the template's weak flexibility. |
| T07 | 学习, `zh-active-390-learn-full.png`; 首页, `zh-active-390-home-viewport.png`; 我的, `zh-active-1440-me-full.png` | Medium | Emoji collage: puzzle, rainbow, shoe, seedling, books, sparkles, rabbit, fire, and globe-like symbols use unrelated rendering styles. | Delete decorative course emoji from primary hierarchy. Keep text and use existing neutral CSS symbols only where a state needs an icon. | Emoji size and baseline vary by OS and language font fallback. Removing them stabilizes cross-platform layout. |
| T08 | 进度, `zh-active-390-progress-full.png`, `zh-active-1440-progress-full.png` | High | Fourteen lessons are a flat list of identical progress tracks. This hides the approved Stage and Module hierarchy and makes zero-progress rows dominate. | Restructure into Stage/Module evidence groups. Keep real percentages and all 14 lesson identities; reduce inactive tracks to compact text rows. | Shortens all language variants and improves reading order. No access or progress logic changes. |
| T09 | 练习, `zh-active-1440-practice-full.png` | Medium | The page repeats “练习 / 复习中心” and places two similar cards in a large empty canvas. The action hierarchy is weak when no review is due. | Restructure into one due-review action region and one completed-course list. Remove redundant heading, not the review or relearn functions. | Empty-state text remains available in four languages. Mobile remains single-column. |
| T10 | 我的, `zh-active-1440-me-full.png`; `zh-active-390-me-full.png` | Medium | Profile metrics are five equal pale-purple boxes, followed by three large rounded groups. The visual rhythm is mechanical and the page is long. | Restructure metrics into an information strip/list and keep settings as native labelled rows. Remove decorative avatar emoji choices only if an existing text/initial option covers the same function. | Long labels in Vietnamese and English gain more room. Touch targets and labels must remain 44px and named. |
| T11 | 第4课, `zh-active-1440-lesson04-full.png`; 第7课, `zh-active-1440-lesson07-full.png`; Lesson 6, `zh-active-1440-lesson06-preview-full.png` | High | Start screens spend most of the viewport on a very large white canvas and three equal feature cards. Korean learning evidence is weaker than the decorative layout. | Restructure spacing and hierarchy only. Keep content, gate notices, engine DOM hooks, and actions. Present the Korean target before supporting explanations. | Mobile already collapses, but desktop wastes space. All language strings remain unchanged. |
| T12 | 第11课, `zh-active-390-lesson11-full.png`, `zh-active-1440-lesson11-full.png` | Medium | Korean H1 hierarchy is strong, but the canvas has a large empty middle and the action is pushed to the bottom. This differs sharply from lessons 4/7/6. | Keep the Korean-first hierarchy and objective list. Reduce minimum-height/space distribution and align shared shell tokens with the other courses. | Improves 768/1440 while preserving 390. No lesson engine or step logic changes. |
| T13 | Accessibility snapshots `zh-active-390-home.md` and `zh-active-390-learn.md` | High | The fixed bottom navigation is read before the page content because it precedes screens in DOM order. Main product screens lack a `main` landmark. | Restructure DOM order and landmarks with the smallest compatible HTML change. Keep nav IDs, handlers, hashes, and visible order. | Directly improves screen-reader order in every language. Visual responsive behavior is unchanged. |
| T14 | 首页, 学习, 进度, 我的 | Medium | Repeated rounded percentage tracks make all evidence look alike. Some tracks convey real progress, but many zero-value tracks add visual noise. | Keep progress where it communicates active or completed evidence. Replace redundant zero tracks with state text. | Less vertical growth in English/Vietnamese/Japanese and clearer non-color status. |

## 3. Preserve list

- Nikigo wordmark and purple-and-white identity
- exactly one obvious Dashboard gradient
- one primary Dashboard action selected by current architecture
- Stage → Module → Lesson structure and all approved taxonomy labels
- all stable IDs, display orders, routes, and free-entry behavior
- Lesson 6 preview and audio-preparing language
- real progress, due review, relearn, XP, streak, daily goal, and ability evidence
- Korean-first hierarchy demonstrated by Lesson 11
- existing 44px touch targets, visible focus styles, and four-language selector

## 4. Retire list

- nested Lesson cards inside Module cards inside Stage cards
- routine metadata rendered as many pills
- equal-weight metric-card grids when an information strip is sufficient
- decorative emoji collage
- repeated headings that restate the page title
- fixed or minimum heights that manufacture blank space
- narrow mobile columns inside the stage badge
- redundant zero-value progress tracks

## 5. Static acceptance targets from the audit

1. No header/content overlap at 390, 768, or 1440.
2. Japanese Dashboard stage summary uses natural horizontal lines.
3. Dashboard has one and only one visually dominant action.
4. Learning has Stage and Module containers, but lessons are compact rows rather than a third card tier.
5. Routine lesson metadata is one line or a naturally wrapping text group, not a badge cloud.
6. Bottom navigation no longer precedes main content in accessibility order and never obscures the final interactive row.
7. Progress groups evidence by Stage/Module without changing percentages.
8. Practice and Settings remove redundant card weight while retaining every action.
9. Lessons 4, 7, 11, and 6 keep their content and engine hooks, with Korean content more prominent than decoration.
10. Console errors, failed requests, and external requests remain zero.
