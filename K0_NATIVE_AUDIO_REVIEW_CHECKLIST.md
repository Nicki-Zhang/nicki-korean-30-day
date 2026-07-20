# K0 产品负责人试听与母语抽检清单

- 播放器入口：**235**
- catalog/manifest：**77**
- 物理音频：**48**（活动目录匹配 46；deprecated 2）
- 缺失：**31**
- pending：**77**；legacy-unreviewed：**46**；legacy-system-export：**16**；approved：**0**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 235 / 0**

当前接入审核由产品负责人在课程设计和实际使用场景中完成。逐条核对 displayText、speechText、audioType、预期读音、自然度、音变、剪切、音量、语境韵律及商业使用记录。不得批量自动批准；왜/예的 syllable 与 word 版本须分别试听。

产品负责人明确反馈“试听通过”后记录 `reviewMethod: product-owner-listening`、`nativeReviewStatus: deferred`、`nativeReviewer: null`、`technicalValidation: passed` 与实际 `reviewedAt`。未收到结论时保持 underReview/pending；单条有问题只标记该条 rejected。母语者审核改为可选发布前抽检，不得伪造审核人或结论。
