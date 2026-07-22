# Nikigo Playwright Static UI Acceptance

## 1. Acceptance identity

- Branch: `agent/nikigo-human-ui-refinement-v1`
- Preview: `http://127.0.0.1:4174/`
- Browser: connected Playwright MCP, isolated browser profile
- Static screenshot root: `artifacts/human-ui-refinement-v1/static/screenshots/`
- Static accessibility root: `artifacts/human-ui-refinement-v1/static/accessibility/`
- Comparison: `artifacts/human-ui-refinement-v1/comparison-dashboard.png`
- Animation library during this pass: none

The browser state was reset between fixtures. Captures waited for DOM and font readiness, returned to the top of the document, and recorded page width, body height, recommendation kind, console errors, failed requests, HTTP errors, and external resource requests.

## 2. Static changes accepted

- The five-item navigation is part of the header instead of a floating bottom card.
- The product content is contained by a real `main` landmark after the header and navigation.
- Mobile has a dedicated two-row header. It no longer overlays the first heading or page content.
- Dashboard keeps one gradient region and exactly one recommendation action.
- Metrics are one information strip rather than four competing cards.
- Learning preserves Stage → Module → Lesson, but modules are separators and lessons are compact rows rather than nested cards.
- Progress is grouped by the approved Stage and Chapter taxonomy using current evidence.
- Practice and settings retain their responsibilities with lighter containers.
- Lesson 4, 7, 11, and Lesson 6 preserve their engines and content while using a quieter surface, smaller radii, and less empty canvas height.
- Shell decorative course, mission, navigation, language, and streak emoji were removed or hidden. Instructional symbols owned by protected lesson content were not rewritten.

## 3. Chinese page and viewport matrix

The complete Chinese pass covered 首页、学习、练习、进度、我的、第4课、第7课、第11课、Lesson 6 at 390×844, 768×1024, and 1440×1024.

| Result | Observed |
| --- | ---: |
| Page/viewport combinations | 27 |
| Horizontal overflow | 0 / 27 |
| Console errors | 0 |
| HTTP 4xx/5xx | 0 |
| Failed requests | 0 |
| External requests | 0 |
| Dashboard primary recommendation | exactly 1 |

Representative body heights after refinement:

| Surface | 390 | 768 | 1440 |
| --- | ---: | ---: | ---: |
| Dashboard | 1364 | 1338 | 1024 |
| Learning | 2115 | 1975 | 1441 |
| Practice | 844 | 1024 | 1024 |
| Progress | 2346 | 2327 | 1956 |
| Settings | 2544 | 2497 | 1639 |

Long Progress and Settings pages reflect real evidence and settings content. They do not use nested floating cards and do not overflow horizontally.

## 4. Recommendation state matrix

Each state was captured at 390, 768, and 1440. Every state rendered one `#primaryAction`.

| Fixture | Observed recommendation | Content | Preview |
| --- | --- | --- | --- |
| 全新用户 | `required-setup` | — | no |
| 明确活跃课程 | `resume-active` | `lesson-03` | no |
| 到期复习 | `due-review` | — | no |
| 多个历史未完成且无可靠最近活动 | `due-review` | — | no guessing |
| K0阶段完成 | `stage-complete` | — | no |
| Lesson 6门禁关闭 | `resume-active` | `lesson-06` | yes |

Lesson 6 Learning-page evidence at all three widths:

- `3/4`
- `当前可完成内容已学完`
- `1课音频准备中`
- the `lesson-06.html` link remains present and operable
- the page does not claim formal `4/4` completion

## 5. Four-language 390px stress pass

English, Vietnamese, and Japanese were captured across all five primary pages; Chinese was covered by the full matrix.

| Language | Horizontal overflow | Clipped visible text | Navigation target height | Dashboard primary action |
| --- | ---: | ---: | ---: | ---: |
| zh | 0 | 0 | 44px | 1 |
| en | 0 | 0 | 44px | 1 |
| vi | 0 | 0 | 44px | 1 |
| ja | 0 | 0 | 44px | 1 |

The former Japanese narrow vertical stage-label failure is gone (`writing-mode: horizontal-tb`). Vietnamese Stage and Module summaries place their objectives and completion state on separate rows instead of forcing a narrow text column.

## 6. Accessibility and keyboard acceptance

Fourteen post-change accessibility snapshots cover all nine 390px surfaces and all five 1440px product pages.

- Reading order is banner → brand/language/profile → primary navigation → main content.
- `main`, `banner`, and named `navigation` landmarks are present.
- Mobile brand, language, profile, and all five navigation targets are at least 44px high.
- Dashboard exposes one H1 and one strongest recommendation button.
- Learning exposes approved stage/module groups and real lesson links.
- Lesson 11 retains its H1, labelled progress, objective list, and named start/back controls.
- All five navigation buttons respond to Enter and resolve to `#dashboard`, `#courses`, `#practice`, `#progress`, and `#profile`.
- Native `details/summary` module controls toggle with Enter and now use the same visible 3px focus treatment.
- With `prefers-reduced-motion: reduce`, visible controls report `0.00001s` animation and transition durations; all controls remain operable.

## 7. Before/after findings

| Baseline failure | Static result |
| --- | --- |
| Header overlays mobile content | main begins below the 123px mobile banner |
| Floating bottom navigation obscures content | navigation is in the header and does not cover page content |
| Japanese stage label collapses vertically | horizontal two-row stage layout |
| Stage, module, and lesson all look like cards | one stage surface, module separators, lesson rows |
| Four metrics compete as separate cards | one bordered information strip |
| Flat 14-row progress list | Stage → Module → Lesson evidence grouping |
| Decorative shell emoji collage | shell decoration removed; protected lesson content retained |
| Large fixed-feeling lesson canvas | content-height lesson surface with natural page flow |

The change intentionally does not make every page shorter. It improves first-screen order, scan paths, Korean-content priority, and responsive behavior without deleting product information.

## 8. Static acceptance conclusion

The static implementation passes the requested visual, responsive, state, language, accessibility, console, and network checks. No animation is needed to fix or conceal a remaining static layout defect. The next gate is the explicit GSAP necessity decision.
