# K0 手机音频风险审计

> 本报告只做静态与本地代码审计，**不声称已完成真实iPhone或Android试听**。

| 风险 | 证据 | 影响 | 优先级 | 建议 |
|---|---|---|---|---|
| 未经交互自动播放 | lesson-engine与对比课会在autoplay设置开启时延迟触发播放 | iOS Safari可能拒绝；随后落入设备TTS | P0 | 托管音频审核前禁用自动播放；失败只显示错误 |
| 设备TTS fallback | lesson-00.js、lesson-engine.js、lesson-consonant-contrast.js、review.html | 不同手机声音/读法不可审计 | P0 | 完全移除课程音频fallback |
| pending文件仍可播放 | 第0～5课静态映射没有审核门控 | 未审核发音被用户当成正式声音 | P0 | catalog lookup同时校验approved与文件存在 |
| 多音频叠加 | 通用引擎会pause当前Audio；对比课用token/cancel；review会cancel TTS | 大部分受控，但Audio对象未统一回收 | P1 | 统一stop/pause/currentTime并恢复按钮状态 |
| preload | 通用引擎和审计页使用auto；部分独立页动态Audio未显式preload | 移动网络下首次播放延迟 | P2 | 审核后按页面需要设metadata/none并测试 |
| MIME/扩展名 | 现有MP3/WAV均由file/afinfo识别 | GitHub Pages一般可播放；仍需Safari实测WAV | P1 | 真机验证MP3/WAV响应Content-Type |
| Service Worker | 音频未预缓存，运行时network-first写缓存 | 离线可能播放旧版本 | P1 | 审核发布使用版本化文件名并增加缓存测试 |
| 相对路径/大小写 | 均为相对路径；未发现大小写冲突 | GitHub Pages路径策略基本正确 | P2 | 部署后逐文件HEAD/播放验证 |
| 触控区域 | lesson-player按钮有移动样式；本审计未逐设备测量 | 小屏可用性仍需人工确认 | P2 | 390px浏览器+真实iPhone/Android验证≥44px |

## 必须人工手机验证

1. iPhone Safari：首次点击、再次播放、静音拨片、后台返回、切题停止、错误恢复。
2. Android Chrome：首次点击、快速连点、蓝牙/扬声器切换、切语言保持韩语对象。
3. GitHub Pages：MP3与WAV MIME、404、Service Worker离线旧缓存、版本化URL。
4. 速度设置：0.8–1.2倍不改变音高；本地属性存在不等于所有设备实现一致。
