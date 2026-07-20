# Nikigo 固定开发与验收规范

本文件是所有 Nikigo 开发任务的固定基线。修改前必须先读取本文件，并检查当前分支、工作区、既有实现与测试；任务中的更具体要求优先，但不得降低安全、音频审核或验收标准。

## 1. 产品目标与边界

Nikigo 是面向全球用户的韩语学习 App。当前只开发韩语学习内容；V1 界面与讲解支持简体中文、English、Tiếng Việt、日本語，韩语教学文本不能因界面语言切换而改变。

产品未来需要支持 K0～K4、能力测评、个性化推荐、注册、会员权限及云端同步。当前实现应保留稳定课程 ID 和可迁移的用户状态，不得把本机游客状态、原型登录或页面结构写成妨碍未来账户与云同步的不可扩展逻辑。

## 2. 独立状态模型

以下概念必须独立，禁止互相代替：

- `releaseStatus`: `development | preview | released | comingSoon`，表示产品发布阶段。
- `accessStatus`: 已开发且可测试的课程为 `available`，可以直接进入；未开发课程为 `unavailable`。
- `recommendedPrerequisites`: 教学建议顺序，只用于路线、测评推荐和非阻塞提示，不作为访问门槛。
- `userProgress`: `notStarted | inProgress | completed | review`，由每名用户自己的进度决定。
- `audioStatus`: `pending | generated | underReview | approved | rejected`，与页面访问和课程完成状态分离。

第0～6课是已开发课程，可自由进入。可提示“建议先完成第5课”，但必须保留“仍然开始”。打开课程不得自动完成或发放 XP；每课只在首次完成时发放一次 XP，重复完成、刷新、返回与恢复均不得重复奖励。未开发课程继续显示“即将开放”。第6课在音频批准前为 `preview + pending`：允许结构测试，但必须说明“开发预览·音频未发布”，待审核播放器保持禁用。

稳定 ID、显示编号、显示顺序和文件名分别管理。状态迁移必须幂等，保留未知字段、旧进度、XP 和设置。

## 3. 课程模板体系

Nikigo 支持至少六类模板：

- `pronunciation`
- `syllable-builder`
- `vocabulary`
- `grammar`
- `scenario-dialogue`
- `review-challenge`

第5课仅是当前字母、音节和拼读类课程的视觉回归基线，不是永久设计，也不是所有课程的固定模板。各模板可以采用不同排版和互动，但必须共用品牌设计系统、顶部导航、课程标题与进度、多语言、用户状态、一次性 XP、返回与恢复、音频隐私与审核、响应式和完成逻辑。

未来情景对话模板必须支持场景导入、角色 A/B、对话气泡、整段与逐句播放、原文与翻译分层、关键词与语法说明、角色选择练习、情景回答、错题重练，以及慢速与自然速度音频。不得为了视觉统一把情景对话强行改成字母卡片课程。

## 4. 音频数据与发布规则

允许的音频类型：`letter-name`、`vowel-carrier`、`initial-example`、`syllable`、`word`、`sentence`、`dialogue-line`、`listening-question`。

每个音频对象至少保存：`id`、`lessonId`、`targetSymbol`（适用时）、`displayText`、`speechText`、`audioType`、`pronunciationType`、`file`、`voiceSource`、`model`、`generationDate`、`commercialUseBasis`、`reviewStatus`、`reviewMethod`、`nativeReviewStatus`、`nativeReviewer`、`technicalValidation`、`reviewedAt`、`reviewNotes`。旧记录可在正式接入任务中幂等迁移，不得为了补字段伪造审核事实。

- 页面、按钮、映射、manifest 与实际音频内容必须一致；按钮要说明实际播放对象。
- 完整音节不得描述为“单个字母发音”，辅音不得生成或伪装成裸音。
- `pending`、`generated`、`underReview` 或缺失的音频不得作为正式音频播放。
- 禁止设备 TTS fallback、相似文字替代和用答案文字替代音频。
- 听力挑战作答前不得在可见文本、状态、title、aria-label 或屏幕阅读器文本中泄露原文、翻译或答案；作答后才能显示原文、翻译与解释。
- 音频接入流程为“技术验证 → 产品负责人课程内试听 → 明确通过后接入”。母语者审核改为可选的发布前抽检，不是当前课程开发或音频接入的强制步骤。
- 产品负责人未明确反馈“试听通过”前，音频保持 `underReview` 或 `pending/missing`，不得标记 `approved` 或启用播放器。通过后记录 `reviewMethod: product-owner-listening`、`nativeReviewStatus: deferred`、`nativeReviewer: null`、`technicalValidation: passed` 和实际 `reviewedAt`。
- 不得伪造 `nativeReviewer` 或母语审核记录；单个文件有问题时只将该文件标记 `rejected`，同批其他文件独立处理。

付费生成只允许人工触发的隔离工作流；普通 push 只验证，不读取密钥、不生成、不提交音频。

## 5. 多语言规则

所有用户界面支持 `zh | en | vi | ja`：不得出现 `undefined`，不得把按钮、反馈、完成状态、XP 或播放器状态硬编码为中文；韩语文本保持不变。每个文案键只有一个明确来源，禁止保留冲突副本或用后置 `Object.assign` 掩盖旧文案。

## 6. 响应式与无障碍规则

每个新增或修改页面必须用真实浏览器验证 390×844、768×1024、1440×900 CSS 视口：

- `body.scrollWidth - window.innerWidth <= 2px`，不出现横向滚动。
- 文字、韩语字块、按钮和卡片不得裁切、重叠、越界、压成窄竖栏或逐字换行。
- 桌面主内容合理居中，长标题自然换行；小屏不能因固定宽度、`min-width`、缩放或 transform 失真。
- 触控目标至少 44×44 CSS px；键盘可操作；不能只依赖颜色表达正误。

## 7. 真实视觉证据规则

截图前必须设置准确 CSS 视口，并依次等待 `DOMContentLoaded`、`document.fonts.ready`、目标关键元素可见及页面稳定；确认 URL 未意外跳转、目标在视口或 full-page 范围内、Service Worker/缓存不是旧版本。

每张证据记录：URL、标题、`innerWidth/innerHeight`、DPR、HTML 与 body 的 scroll width、body scroll height、关键 selector/text/rect、字体状态、截图像素尺寸、横向溢出结果、非空白结果和时间戳。不得用图片像素宽度推断 CSS 视口。

视觉校验必须在以下情况直接失败：关键文本缺失、可见元素过少、截图接近纯白/透明/单色、溢出超过 2px、主卡片异常狭窄、正文呈逐字换行、出现 `undefined`、截图尺寸与视口/DPR不符。失败证据可以保留用于调试，但不得计为验收通过。

## 8. 完成与交付标准

任务只有在以下项目全部通过后才能报告完成：数据与逻辑测试、真实浏览器交互、390/768/1440视觉验收、四语言、状态恢复、首次与重复完成、音频映射与隐私、Service Worker、敏感信息扫描、真实有效截图，以及工作区范围检查。

敏感信息扫描必须覆盖 `.env`、API Key、Telegram Token/Chat ID、本机用户名和绝对路径、浏览器/GitHub凭据及私人通知配置。只报告文件位置和类型，禁止输出值。

若任何测试或截图失败，应继续修复任务范围内的问题；无法解决时明确报告阻断，不得以“测试环境问题”跳过或宣称完成。
