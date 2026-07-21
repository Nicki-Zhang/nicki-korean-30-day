# K0 移动端音频风险审计

- 播放器入口：**235**
- catalog/manifest：**83**
- 物理音频：**66**（活动目录匹配 64；deprecated 2）
- 缺失：**19**
- pending：**65**；legacy-unreviewed：**46**；legacy-system-export：**16**；approved：**18**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 192 / 0**

- 新播放前停止上一条；序列逐文件等待 ended。
- pending/missing 按钮 disabled + aria-disabled。
- 只有严格门禁通过的 Batch 1、Batch 2A 与 Batch 2B 精确托管音频可播放。
- iOS 阻止播放或网络失败时只显示本地化错误，无设备回退。
