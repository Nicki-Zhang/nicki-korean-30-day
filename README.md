# Nikigo

Nikigo 是一款面向全球用户的场景化韩语学习 App。学习目标语言固定为韩语，V1 支持简体中文、English、Tiếng Việt 和日本語四种辅助语言。

当前仓库是 Web/PWA 产品基线，包含新用户引导、K0–K4 学习路径、能力诊断原型、课程进度、设置，以及三节 K0 课程。学习数据暂存在浏览器 `localStorage`，账户、会员和跨设备同步仍是原型能力。

## 本地运行

```bash
python3 -m http.server 4173 --bind 127.0.0.1
```

打开 `http://127.0.0.1:4173/`；默认入口会统一进入新版学习首页。

## 课程架构

- `lesson-engine.js`：统一的课程渲染、音频、门槛、进度、XP 和复习逻辑。
- `lesson-player.css`：课程播放器的共享响应式样式。
- `lesson-01.html`、`lesson-02.html`、`lesson-03.html`：课程内容配置与四语文案。
- `course-catalog.js`：课程顺序、前置条件和首页元数据。
- `app-state.js`：Schema Version 2 本机状态、旧数据迁移和间隔复习调度。
- `review.html`、`review-catalog.js`：到期复习、答题反馈、XP 与重新排期。

新增课程时应复用 `NikigoLesson.mount()`，不要复制播放器逻辑或整页 CSS。课程韩语音频优先使用经过母语审核的托管文件；设备韩语语音只能作为回退。

## 校验

```bash
npm test
```

校验会检查课程 ID、文件、解锁顺序、四语键、题目提示和 JavaScript 语法。

## 发布边界

当前版本不应被描述为具备真实账户、真实付费、完整诊断、云同步或完整课程规模的正式 App。正式发布前还需要后端、隐私与账户删除、商店支付、生产托管、监控、真实设备测试和韩语母语内容审核。
