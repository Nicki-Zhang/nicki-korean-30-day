# Nikigo K0 第0～6课播放器审计

> Batch 0 修复后代码审计；文件存在不代表发音获批。

## 结论

- 播放器入口：**235**
- catalog/manifest：**77**
- 物理音频：**48**（活动目录匹配 46；deprecated 2）
- 缺失：**31**
- pending：**77**；legacy-unreviewed：**46**；legacy-system-export：**16**；approved：**0**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 235 / 0**

统一门禁要求 exact speechText、匹配 audioType、approved、available、真实文件及完整来源/权利/审核字段。所有不满足项目均禁用，且无设备TTS或文字替代。逐行记录见 K0_AUDIO_PLAYER_AUDIT.csv。
