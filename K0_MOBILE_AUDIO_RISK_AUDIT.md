# K0 移动端音频风险审计

- 播放器入口：**235**
- catalog/manifest：**77**
- 物理音频：**48**（活动目录匹配 46；deprecated 2）
- 缺失：**31**
- pending：**77**；legacy-unreviewed：**46**；legacy-system-export：**16**；approved：**0**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 235 / 0**

- 新播放前停止上一条；序列逐文件等待 ended。
- pending/missing 按钮 disabled + aria-disabled。
- autoplay 只接受严格门禁返回的托管音频，当前不会尝试播放。
- iOS 阻止播放或网络失败时只显示本地化错误，无设备回退。
