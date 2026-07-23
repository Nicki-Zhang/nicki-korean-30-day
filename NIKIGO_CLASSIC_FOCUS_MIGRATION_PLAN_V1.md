# Nikigo Classic Focus 全课程迁移计划 V1

状态：**审计完成，等待迁移顺序审批**

审计基线：`5a99cf4326e9d4a08f684492b4d72a65c462b556`

审计日期：2026-07-23

正式运行代码变更：**0**

## 1. 执行摘要

当前14个正式课程入口均存在且唯一，浏览器均可加载，支持 `zh / en / vi / ja`，390px下没有横向溢出，也没有观察到外部运行时资源请求。

Lesson 4、7、11已经验证并使用 Classic Focus Shared Core，分别覆盖：

- Lesson 4：发音对比、批准音频、听辨选择、针对性重练。
- Lesson 7：基础韩文结构、单词、拆分、构建、混合音频状态。
- Lesson 11：场景对话、匹配、词块构建、零可播放音频、针对性重练。

其余课程不能一次性批量替换。建议按风险拆成8个迁移批次，再做1个全课程回归阶段：

1. A1：Lesson 8，作为下一节试点。
2. A2：Lesson 12、13。
3. B1：Lesson 5。
4. B2：Lesson 1、2。
5. B3：Lesson 3、9。
6. C1：Lesson 10，先隔离原型。
7. C2：Lesson 0，先隔离原型。
8. Special Gate：Lesson 6，独立处理。
9. Final：14课全量回归与缓存收口。

Lesson 8是最合适的下一节试点：它有真实15步、已有单步Sprint引擎、无音频请求、现有Shared Core能够承接外围框架；试点只需要显式Adapter映射，不需要新增业务逻辑或通用Renderer。

## 2. 审计依据与口径

结论来自：

- `course-catalog.js`
- `stage-chapter-taxonomy.js`
- `app-state.js`
- `audio-catalog.js`
- `lesson-00.html` 至 `lesson-13.html`
- 各课实际引擎、配置和样式
- `assets/classic-focus-*`
- 已封板的Lesson 4、7、11验证文件
- 已存在的产品架构、taxonomy和课程完整性证据
- 本地真实浏览器对14个正式入口的检查

音频口径：

- `request` 是课程对用户暴露的独立音频请求位或精确语义目标。
- `playable` 必须同时满足 `speechText + audioType + lesson namespace` 精确匹配、catalog为approved、文件为本地资源。
- `pending` 是有精确catalog记录但未批准。
- `missing` 是没有精确approved或pending记录。
- 课程请求数会复用同一catalog记录，因此各课程playable请求数之和可以大于54条唯一approved catalog记录。
- 本文不把TTS、设备语音或近似文本当作可播放音频。

## 3. 14课完整迁移矩阵

### 3.1 身份、taxonomy与引擎

| 课 | 正式入口 | Stage / Module / chapterId | 真实步骤 | stable identity | 当前引擎 | 当前模板 |
|---|---|---|---:|---|---|---|
| 0 | `lesson-00.html` | K0 / 韩文地图与基础元音 / `k0-hangul-map-and-vowels` | 非线性，无编号步骤 | `lesson-00`；profile起点状态 | `lesson-00.js` + `hangul-sound-data.js` | 韩文字母地图 |
| 1 | `lesson-01.html` | K0 / 韩文地图与基础元音 / `k0-hangul-map-and-vowels` | 15 | `lesson-01`；`nikigoLessonSession:lesson-01` | `lesson-engine.js` + 内联配置 | legacy单步课程 |
| 2 | `lesson-02.html` | K0 / 韩文地图与基础元音 / `k0-hangul-map-and-vowels` | 16 | `lesson-02`；`nikigoLessonSession:lesson-02` | `lesson-engine.js` + 内联配置 | legacy单步课程 |
| 3 | `lesson-03.html` | K0 / 辅音、音节块与复合元音 / `k0-consonants-syllables-compound-vowels` | 17 | `lesson-03`；`nikigoLessonSession:lesson-03` | `lesson-engine.js` + 内联配置 | legacy单步课程 |
| 4 | `lesson-04.html` | K0 / 辅音、音节块与复合元音 / `k0-consonants-syllables-compound-vowels` | 15 | `lesson-04`；显式step ID | `lesson-consonant-contrast.js` | **Classic Focus已验证** |
| 5 | `lesson-05.html` | K0 / 辅音、音节块与复合元音 / `k0-consonants-syllables-compound-vowels` | 16 | `lesson-05`；显式screen ID | `lesson-05.js` | 自定义音节块单步课程 |
| 6 | `lesson-06.html` | K0 / 辅音、音节块与复合元音 / `k0-consonants-syllables-compound-vowels` | 18 | `lesson-06`；显式screen ID | `lesson-06.js` | 自定义复合元音预览课 |
| 7 | `lesson-07.html` | K0 / 收音与常见音变 / `k0-batchim-and-sound-changes` | 13 | `lesson-07`；显式step ID | `lesson-07.js` | **Classic Focus已验证** |
| 8 | `lesson-08.html` | K0 / 收音与常见音变 / `k0-batchim-and-sound-changes` | 15 | `lesson-08`；显式Sprint step ID | `lesson-sprint-engine.js` | Sprint单步课程 |
| 9 | `lesson-09.html` | K0 / 综合应用与K0阶段挑战 / `k0-integrated-use-and-checkpoint` | 15 | `lesson-09`；显式Sprint step ID | `lesson-sprint-engine.js` | Sprint单步课程 |
| 10 | `lesson-10.html` | K0 / 综合应用与K0阶段挑战 / `k0-integrated-use-and-checkpoint` | 15 | `lesson-10`；显式Sprint step ID | `lesson-sprint-engine.js` | Sprint阶段检查点 |
| 11 | `lesson-11.html` | K1 / 姓名、身份与语言背景 / `k1-identity-and-language-background` | 13 | `lesson-11`；显式step ID | `lesson-11-classic-focus.js` + `lesson-11.js` | **Classic Focus已验证** |
| 12 | `lesson-12.html` | K1 / 姓名、身份与语言背景 / `k1-identity-and-language-background` | 13 | `lesson-12`；显式Sprint step ID | `lesson-sprint-engine.js` | Sprint单步课程 |
| 13 | `lesson-13.html` | K1 / 数字与基础数量 / `k1-numbers-and-quantities` | 13 | `lesson-13`；显式Sprint step ID | `lesson-sprint-engine.js` | Sprint单步课程 |

### 3.2 内容、门禁、重练与状态

| 课 | 真实内容类型 | 必答门禁 | 错题重练 | XP | 四语言 | 刷新/返回恢复 |
|---|---|---|---|---|---|---|
| 0 | orientation map、letter grid/detail、syllable demo、起点选择 | 否 | 无 | 0 / 0 | 完整 | 恢复profile起点；没有线性step session |
| 1 | intro、讲解、结构、builder、choice、listening、feedback、completion | 是 | 即时反馈＋ReviewItem；无独立课内retry屏 | +50 / +0 | 完整 | step、选项顺序、答案 |
| 2 | Lesson 1类型＋word | 是 | 即时反馈＋ReviewItem；无独立课内retry屏 | +50 / +0 | 完整 | step、选项顺序、答案 |
| 3 | foundation、word、dialogue、builder、choice、listening | 是 | 即时反馈＋ReviewItem；无独立课内retry屏 | +50 / +0 | 完整 | step、选项顺序、答案 |
| 4 | intro、explanation、comparison、listening、choice、feedback、retry | 是 | 有针对性课内重练 | +50 / +0 | 完整 | step、答案、retry、音频互动 |
| 5 | structure、word、comparison、builder、split、choice、retry | 是 | 有针对性课内重练 | +50 / +0 | 完整 | builder、split、challenge、retry |
| 6 | structure、comparison、builder、split、word、choice、retry、preview completion | 是 | 有针对性课内重练 | 当前0；门禁解除后才可首次+50 | 完整 | step和互动恢复；正式完成仍保留 |
| 7 | structure、word、comparison、split、builder、choice、retry | 是 | 有针对性课内重练 | +50 / +0 | 完整 | builder、答案、feedback、retry |
| 8 | explanation、matching、choice、scenario、retry | 是 | Sprint targeted retry | +50 / +0 | 完整 | step ID、选项、答案、wrong IDs、retry mode |
| 9 | dialogue、matching、builder、choice、scenario、listening、retry | 是 | Sprint targeted retry | +50 / +0 | 完整 | step ID、选项、答案、wrong IDs、retry mode |
| 10 | matching、builder、choice、listening、scenario、checkpoint、retry | 是 | Sprint跨主题targeted retry | +50 / +0 | 完整 | step、答案、retry和checkpoint进度 |
| 11 | dialogue、matching、builder、choice、feedback、retry | 是 | 有针对性课内重练 | +50 / +0 | 完整 | dialogue reveal、答案、builder、feedback、retry、语言 |
| 12 | dialogue、matching、builder、choice、scenario、retry | 是 | Sprint targeted retry | +50 / +0 | 完整 | step ID、选项、答案、wrong IDs、retry mode |
| 13 | matching、choice、builder、scenario、retry | 是 | Sprint targeted retry | +50 / +0 | 完整 | step ID、选项、答案、wrong IDs、retry mode |

### 3.3 音频准备度

| 课 | 请求总数 | approved | playable | pending | missing | 课程完成音频门禁 | 关键说明 |
|---|---:|---:|---:|---:|---:|---|---|
| 0 | 59 | 31 | 31 | 0 | 28 | 否 | 动态字母动作；缺失按钮保持禁用 |
| 1 | 12 | 12 | 12 | 0 | 0 | 否 | 全部精确本地匹配 |
| 2 | 13 | 12 | 12 | 1 | 0 | 否 | `리` pending |
| 3 | 11 | 11 | 11 | 0 | 0 | 否 | 全部精确本地匹配 |
| 4 | 14 | 14 | 14 | 0 | 0 | 否 | 14条本地资源均已验证 |
| 5 | 10 | 10 | 10 | 0 | 0 | 否 | 10个精确音节目标；当前引擎在启动时构建本地文件映射 |
| 6 | 15 | 0 | 0 | 15 | 0 | **是** | required-audio gate关闭 |
| 7 | 5 | 1 | 1 | 4 | 0 | 否 | `바`精确旧namespace可播；4个本课单词pending |
| 8 | 0 | 0 | 0 | 0 | 0 | 否 | 无音频请求 |
| 9 | 6 | 4 | 4 | 0 | 2 | 否 | `안녕하세요/안녕`可播；两个句子missing |
| 10 | 1 | 1 | 1 | 0 | 0 | 否 | `바`精确匹配 |
| 11 | 1 | 0 | 0 | 0 | 1 | 否 | 正式页只显示紧凑准备状态 |
| 12 | 1 | 0 | 0 | 0 | 1 | 否 | `어느 나라에서 왔어요` missing |
| 13 | 0 | 0 | 0 | 0 | 0 | 否 | 无音频请求 |

以上是课程运行请求口径，不是catalog唯一行数。全局catalog仍为83条记录：54条approved、29条pending。

### 3.4 Shared Core适配、风险、批次与验收

| 课 | 复用Shared Core | 新Adapter | 通用Renderer扩展 | 风险 | 批次 | 验收重点 |
|---|---|---|---|---|---|---|
| 0 | 不能直接套线性Shell | 非线性orientation adapter | Hangul map、letter detail、起点选择 | 高 | C2 | 不伪造步骤/XP；保留动态音频和起点选择 |
| 1 | 外壳可复用 | legacy foundation adapter | guided sound grid、self-check | 中 | B2 | 15屏、12音频、ReviewItem、答案保密 |
| 2 | 外壳可复用 | foundation + word adapter | sound grid、self-check、word row | 中 | B2 | 16屏、`리` pending、word decoding |
| 3 | 外壳可复用 | foundation-to-scenario adapter | guided phrase/dialogue、listening | 中 | B3 | 17屏、phrase与完整场景边界、11音频 |
| 4 | **已验证** | 已有 | 无 | 低 | reference | 作为audio comparison基线，不变更 |
| 5 | 外壳可复用 | syllable-block adapter | 音节块图、split/decompose | 中 | B1 | builder、拆分、retry、10音频 |
| 6 | 只能特殊接入 | preview/gate adapter | 复合公式、近似拼写、available-content-complete | 高 | Special Gate | 18步、15 pending、0正式XP、不阻挡Lesson 7 |
| 7 | **已验证** | 已有 | 无 | 低 | reference | 作为Foundation基线，不变更 |
| 8 | 可直接接入 | Sprint-to-Classic adapter | 无 | 低 | **A1** | 15步、无音频、显式type映射、retry |
| 9 | 外壳可复用 | Sprint scenario/listening adapter | listening、ordered scene | 中 | B3 | 4可播/2 missing、场景顺序、retry |
| 10 | 先做原型 | checkpoint adapter | checkpoint grouping/result summary | 高 | C1 | 15步、不跳步、跨主题retry、结果语义 |
| 11 | **已验证** | 已有 | 无 | 低 | reference | 作为Scenario基线，不重新引入Mission Journey |
| 12 | 可直接接入 | Sprint-to-Classic scenario adapter | 无 | 低 | A2 | 13步、missing音频fail-closed、retry |
| 13 | 可直接接入 | Sprint-to-Classic number adapter | 无 | 低 | A2 | 13步、数字变形、builder、无音频 |

机器可读的完整字段、step IDs和停止条件见 `quality-fix/classic-focus-migration-plan-v1/MIGRATION_MATRIX.json`。

## 4. Shared Core覆盖分析

### 已支持

- 紫白Token、页面宽度、字体、间距、背景。
- Header、语言控件接口、步骤进度、单步主容器、返回/继续。
- 正确/错误反馈外观、紧凑状态提示。
- 390/430/768/1440响应式、焦点、键盘、reduced-motion。
- 声明型内容类型：intro、explanation、structure、word、comparison、dialogue、choice、matching、builder、feedback、retry、completion。
- 已验证互动：选择、发音对比、匹配、音节/词块构建、对话逐句显示、针对性重练。
- 已验证音频状态：全approved、混合playable/pending、全pending、missing fail-closed、无音频。

### 尚未覆盖

- Lesson 0的非线性地图、字母详情和起点选择。
- Lesson 1～3的guided sound grid与listen-first self-check。
- 可复用的split/decompose和音节块结构图。
- 独立listening状态与有序场景序列。
- Lesson 10的Checkpoint分组、证据汇总和结果总结。
- Lesson 6的复合元音公式、近似拼写对比和 `available-content-complete` 展示契约。

### 可能新增的通用Renderer

只有至少两课确认复用时才进入Shared Core：

1. `guided-sound-grid`
2. `syllable-block-diagram`
3. `split-decompose`
4. `listening-state`
5. `ordered-sequence`
6. `checkpoint-summary`
7. `completion-gate-status`

Batch A不应先建立这些Renderer；它只验证Sprint引擎与Classic Focus外围框架的Adapter边界。

### 必须留在Lesson Adapter

- 真实step ID到content type的显式映射。
- 课程内容与特有视觉组织。
- 题目/选项渲染。
- 精确音频request descriptor。
- Checkpoint模块标签。
- 课程特有恢复状态。

### 绝对不能进入Shared Core

- 答案、判定、课程内容和韩语目标文本。
- XP计算、完成授予。
- ReviewItem创建、错题调度和重练算法。
- app-state迁移。
- audio approval判断。
- Lesson 6 completion gate。
- 推荐算法。
- 根据标题、模板名或DOM文案猜测step identity、course type、chapterId或skillTags。

## 5. 分批计划与推荐顺序

### Batch A：低风险直接接入

**A1 — Lesson 8**

- 单课试点。
- 无音频请求，排除音频变量。
- 15个显式step ID。
- 现有Sprint引擎已经负责题目、答案、retry和XP。
- 只增加显式Sprint-to-Classic presentation adapter。

停止条件：

- 15步无跳步。
- 必答门禁、targeted retry、+50/+0、刷新/返回、四语言全部通过。
- Lesson 4/7/11无P0/P1视觉或业务回归。
- 不新增通用Renderer。

**A2 — Lesson 12、13**

- 两课均为13步Sprint流程。
- Lesson 12验证missing audio的fail-closed。
- Lesson 13验证无音频数字/数量课程。

停止条件：

- 两课step identity、答案、builder、retry和语言状态保持。
- Lesson 12不出现假播放器。
- Lesson 13不因无音频出现空占位。

### Batch B：需要通用Renderer或新Adapter模式

**B1 — Lesson 5**

- 新增可复用的音节块图与split/decompose表达。
- 不改builder、答案和retry。

停止条件：

- 新Renderer不包含Lesson 5答案或文案。
- 10个精确音频状态不变。
- Lesson 7结构和builder回归通过。

**B2 — Lesson 1、2**

- 建立legacy foundation adapter。
- 评估guided sound grid和self-check。

停止条件：

- 15/16屏顺序不变。
- Lesson 1的12条、Lesson 2的12 playable＋1 pending不变。
- ReviewItem行为保持，不能把“没有课内retry屏”误改成新业务。

**B3 — Lesson 3、9**

- 建立guided phrase/dialogue、listening和ordered sequence表达。
- 两课引擎不同，先证明Renderer只处理展示。

停止条件：

- Lesson 3的11条音频全部保持可播。
- Lesson 9保持4 playable、2 missing。
- 场景顺序、builder、wrong IDs和retry不变。

### Batch C：先隔离原型

**C1 — Lesson 10**

- K0 Checkpoint，多内容类型组合。
- 先制作隔离原型，再决定正式Adapter。

停止条件：

- 原型证明15个真实step ID全部可映射。
- Checkpoint分组不变成门禁。
- 跨主题wrong IDs、targeted retry、+50/+0保持。

**C2 — Lesson 0**

- 非线性orientation页面，不应强行套入“1/N”。
- 先定义Classic Focus外层与地图内部的边界。

停止条件：

- 不新增虚假step、完成或XP。
- profile起点选择不变。
- 59个音频动作的精确门禁不变。

### Special Gate — Lesson 6

- 单课独立迁移。
- 只改变展示，不改变release、completion或推荐规则。

停止条件：

- 18个真实步骤可进入。
- 15条音频仍pending并禁用。
- 正式完成、完成日期和XP不产生。
- Module仍显示3/4、当前可完成内容已学完、1课音频准备中。
- Lesson 7及后续available课程不受阻。

### Final — 全课程回归

- 14入口唯一性。
- 所有stable ID、session key、课程编号、route不变。
- 四语言、恢复、返回、ReviewItem、+50/+0、音频门禁、Service Worker全量检查。

## 6. 下一节试点推荐

推荐 **Lesson 8**。

理由：

1. 它是尚未迁移课程中风险最低的真实15步流程。
2. 无音频请求，可以隔离验证Shared Core与Sprint引擎的边界。
3. 现有内容为concept、match、choice、scenario，外围Shell已经能够表达。
4. 不需要修改state、答案、XP、ReviewItem或audio catalog。
5. 成功后可以把同一Adapter模式用于Lesson 12、13；失败时回滚边界仅限Lesson 8展示适配。

不推荐先做Lesson 10：它是Checkpoint，需要先确认汇总、retry与结果语义。

不推荐先做Lesson 6：它包含产品级completion gate。

不推荐先做Lesson 0：它不是线性课程。

## 7. 浏览器核实结果

14个正式入口均在 `390×844` 实际打开：

- 页面加载成功：14/14。
- 四语言选择存在：14/14。
- zh切换到en并重新渲染：14/14。
- 390px横向溢出：0。
- 外部运行时资源：0。
- 首屏步骤数与源码一致：Lesson 1–13分别为15、16、17、15、16、18、13、15、15、15、13、13、13；Lesson 0为非线性地图。

深入核实：

- Lesson 4：第3步显示14条approved体系中的完整音节对比；进入第4步后未作答时“继续”禁用。
- Lesson 7：第3步的Lesson 7词音频明确禁用；第8步拆分互动未完成时“继续”禁用。
- Lesson 11：第2步只有一条“标准音频准备中”，对话逐句显示，完整显示后才允许继续。
- Lesson 10：第2步为真实配对题，未完成时“继续”禁用。
- Lesson 6：显示1/18及“音频待审核·仅供结构预览”，与completion gate一致。

## 8. 回归测试矩阵

每个迁移批次必须包含：

| 范围 | 必测 |
|---|---|
| Identity | stable lesson ID、step ID、session key、route、displayOrder |
| Flow | 真实总步骤、无跳步、必答门禁、答案不提前泄露 |
| State | 刷新、浏览器返回、语言切换、进行中答案/构建/feedback保持 |
| Completion | 首次+50、重复+0；Lesson 0和Lesson 6按其特殊规则 |
| Review | 即时错误反馈、ReviewItem、课程已有的targeted retry |
| Audio | 每个请求精确匹配；approved可播；pending/missing fail-closed；无TTS/外部API |
| Navigation | V4 Module进入及返回原Stage/Module |
| Responsive | 390、430、768、1440；无横向溢出；触控目标≥44px |
| Accessibility | 键盘、焦点、Escape、ARIA、阅读顺序、reduced-motion |
| Runtime | 控制台错误/警告0、网络错误0、外部请求0、费用0 |
| Cache | Service Worker仅增加必要正式资源；旧资源不被错误加载 |
| References | Lesson 4、7、11视觉及业务回归 |

## 9. 风险与回滚边界

主要风险：

- 把“展示content type”误写成新的课程引擎。
- 根据标题或DOM文案猜测step type。
- 为统一外观改变必答门禁、retry或completion。
- 把missing/pending音频错误展示成可播放。
- 把Lesson 6的preview状态变成正式完成。
- 为Lesson 0伪造线性步骤。
- Adapter同时改动业务文件，导致单课无法独立回滚。

每批回滚边界：

- 新增Adapter、课程HTML引用、课程专属展示CSS、必要SW资源必须能单独撤销。
- 不迁移用户状态结构，不改现有session key。
- 不改course catalog、app-state、audio catalog或答案。
- 每批1～3课，完成验收后才进入下一批。
- 如果参考Lesson 4、7、11出现P0/P1回归，当批停止。

## 10. 明确禁止修改

- `course-catalog.js`
- `app-state.js`
- `audio-catalog.js`
- `stage-chapter-taxonomy.js`中的既有identity和分组
- Lesson 0～13题目、答案、stable identity和业务完成逻辑
- 54条approved音频SHA
- 全部MP3/WAV
- XP与ReviewItem规则
- Lesson 6 completion gate和推荐规则
- `CODEX_HANDOFF.md`
- `main`与`origin/main`

## 11. 阶段数量

预计在本审计获批后需要 **9个实施/验证阶段**：

1. A1
2. A2
3. B1
4. B2
5. B3
6. C1
7. C2
8. Special Gate
9. Final全课程回归

连同本次审计，共10个审批与停止边界。这是阶段数量，不是工时承诺。
