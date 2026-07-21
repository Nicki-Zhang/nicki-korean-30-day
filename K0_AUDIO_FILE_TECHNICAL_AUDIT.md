# K0 音频文件技术审计

- 播放器入口：**235**
- catalog/manifest：**83**
- 物理音频：**66**（活动目录匹配 64；deprecated 2）
- 缺失：**19**
- pending：**29**；legacy-unreviewed：**10**；legacy-system-export：**16**；approved：**54**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 122 / 0**

当前54条 approved 音频均通过固定 SHA 与完整解码验证，并由产品负责人试听通过；其中36条来自本轮既有文件白名单。5条明确保留记录继续 pending 且禁用。16个 Apple 导出明确标记 legacy-system-export。技术可解码不等于商业权利批准。2个 deprecated 文件保留但统一门禁和 Service Worker 均禁止使用。
