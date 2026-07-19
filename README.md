# Nikigo

Nikigo 是一款面向全球用户的场景化韩语学习 App。学习目标语言固定为韩语，V1 支持简体中文、English、Tiếng Việt 和日本語四种辅助语言。

当前仓库是 Web/PWA 产品基线，包含新用户引导、K0–K4 学习路径、能力诊断原型、课程进度、设置，以及第0～6课和既有收音课程。学习数据暂存在浏览器 `localStorage`，账户、会员和跨设备同步仍是原型能力。

## 本地运行

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

打开 `http://127.0.0.1:4173/`；默认入口会统一进入新版学习首页。

## 课程架构

- `lesson-engine.js`：现有通用课程的渲染、音频、进度、XP 和复习逻辑。
- `lesson-player.css`：课程播放器的共享响应式样式。
- `lesson-00.html`～`lesson-06.html` 及专用课程文件：课程内容、互动与四语文案；不同课程形态可使用不同模板。
- `course-catalog.js`：稳定ID、显示顺序、访问/发布/音频状态、推荐前置关系和首页元数据。
- `app-state.js`：Schema Version 2 本机状态、旧数据迁移和间隔复习调度。
- `review.html`、`review-catalog.js`：到期复习、答题反馈、XP 与重新排期。

开始修改前必须读取 `NIKIGO_DEVELOPMENT_RULES.md`。课程按教学目标选择合适模板；`NikigoLesson.mount()` 是现有通用课程引擎之一，不应强制套用到情景对话等不同课程形态。课程韩语音频只允许使用已完成韩语母语审核的精确托管文件；禁止设备 TTS 或文字答案 fallback。

## 校验

```bash
npm test
```

校验会检查课程 ID、文件、解锁顺序、四语键、题目提示和 JavaScript 语法。

## 发布边界

当前版本不应被描述为具备真实账户、真实付费、完整诊断、云同步或完整课程规模的正式 App。正式发布前还需要后端、隐私与账户删除、商店支付、生产托管、监控、真实设备测试和韩语母语内容审核。
