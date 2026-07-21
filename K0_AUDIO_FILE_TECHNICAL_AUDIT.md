# K0 音频文件技术审计

- 播放器入口：**235**
- catalog/manifest：**83**
- 物理音频：**66**（活动目录匹配 64；deprecated 2）
- 缺失：**19**
- pending：**65**；legacy-unreviewed：**46**；legacy-system-export：**16**；approved：**18**
- 可播放 pending / missing / deprecated：**0 / 0 / 0**
- 生产 K0 设备 TTS / fallback：**0 / 0**
- P0 / P1 / P2：**0 / 192 / 0**

Batch 1、Batch 2A 与 Batch 2B 的18条音频已通过固定 SHA、ffprobe 与 FFmpeg 完整解码验证，并由产品负责人试听通过；其余活动文件仍未形成完整发布记录。16个 Apple 导出明确标记 legacy-system-export。技术可解码不等于内容批准。2个 deprecated 文件保留但统一门禁和 Service Worker 均禁止使用。
