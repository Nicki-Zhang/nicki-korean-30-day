# K0 移动端音频风险审计

- 播放器入口：**235**
- catalog/manifest：**83**
- 物理音频：**66**（活动目录匹配 64；deprecated 2）
- 缺失：**19**
- pending：**29**；legacy-unreviewed：**10**；legacy-system-export：**16**；approved：**54**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 122 / 0**

- 新播放前停止上一条；序列逐文件等待 ended。
- pending/missing 按钮 disabled + aria-disabled。
- 只有严格文本、类型、审核字段与 SHA 门禁通过的54条精确托管音频可播放。
- iOS 阻止播放或网络失败时只显示本地化错误，无设备回退。
