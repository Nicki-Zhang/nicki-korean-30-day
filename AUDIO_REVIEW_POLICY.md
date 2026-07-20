# Nikigo 音频审核与接入规范

## 当前审核流程

所有后续音频统一执行以下流程：

1. **技术验证**：核对文件名、数量、SHA-256、容器、编码、采样率、声道、时长、完整解码及正式 manifest 隔离。
2. **产品负责人课程内试听**：产品负责人结合课程目标、按钮语义和实际使用场景逐条试听。
3. **通过后接入**：只有收到产品负责人明确的“试听通过”结论，才允许在单独任务中更新正式 manifest、接入播放器并更新缓存。
4. **母语者抽检**：改为可选的发布前质量抽检，不再作为当前课程开发或音频接入的强制前置条件。

技术验证通过不等于内容审核通过。生成成功、文件可解码或自动测试通过都不得自动产生 `approved` 状态。

## 状态与记录

- 未收到产品负责人结论：保持 `underReview`（Artifact）或 `pending/missing`（正式 App），不可播放、不可接入。
- 产品负责人明确试听通过后，记录：
  - `reviewMethod: product-owner-listening`
  - `nativeReviewStatus: deferred`
  - `nativeReviewer: null`
  - `technicalValidation: passed`
  - `reviewedAt`: 实际试听日期
- 不得伪造 `nativeReviewer`，也不得填写虚假的母语审核记录。
- 某一文件有问题时，只把该文件标为 `rejected`；同批次其他文件按各自试听结论独立处理。
- 母语者后续参与抽检时，另行记录真实审核人、日期和结论，不覆盖产品负责人试听记录。

## Batch 1 当前状态

`yo.mp3`（요）和 `yu.mp3`（유）已完成技术验证，并于 2026-07-20 收到产品负责人逐条“试听通过”结论。两条记录按固定 SHA 接入，使用 `reviewMethod: product-owner-listening`、`nativeReviewStatus: deferred`、`nativeReviewer: null`；发布法律复核以独立 `rightsReviewStatus: pending` 如实保留。任何后续文件仍须逐条走同一流程。
