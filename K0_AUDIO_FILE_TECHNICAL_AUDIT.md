# K0 音频文件技术审计

- 播放器入口：**235**
- catalog/manifest：**77**
- 物理音频：**48**（活动目录匹配 46；deprecated 2）
- 缺失：**31**
- pending：**77**；legacy-unreviewed：**46**；legacy-system-export：**16**；approved：**0**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 235 / 0**

现有46个活动文件只通过“存在/可读取”层检查，仍为 pending；16个 Apple 导出明确标记 legacy-system-export。技术可解码不等于发音批准。2个 deprecated 文件保留但统一门禁和 Service Worker 均禁止使用。
