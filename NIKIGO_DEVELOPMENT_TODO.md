# Nikigo 开发待办

## K0 Audio Batch 1

- [x] `yo.mp3` / 요：SHA、媒体参数和 FFmpeg 完整解码技术验证通过。
- [x] `yu.mp3` / 유：SHA、媒体参数和 FFmpeg 完整解码技术验证通过。
- [x] 产品负责人在课程设计和实际使用场景中试听 `yo.mp3`：2026-07-20 通过。
- [x] 产品负责人在课程设计和实际使用场景中试听 `yu.mp3`：2026-07-20 通过。
- [x] 记录 `reviewMethod: product-owner-listening`、`nativeReviewStatus: deferred`、`nativeReviewer: null`、`technicalValidation: passed` 和实际 `reviewedAt`。
- [x] 按固定 SHA 接入两条通过试听的文件；未处理任何其他音频。
- [ ] 正式发布前按风险选择母语者抽检项目；该抽检不是当前课程开发和音频接入的强制门禁。

当前边界：两条音频均为 `approved/available`，只允许精确 speechText、audioType、SHA 和技术验证匹配时播放；`rightsReviewStatus` 仍为 `pending`，母语者抽检仍为可选发布前待办。
