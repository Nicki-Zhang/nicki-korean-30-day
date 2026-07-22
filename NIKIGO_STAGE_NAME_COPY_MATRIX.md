# Nikigo Stage Name Copy Matrix

Status: approved K0/K1 display names for the current four interface languages. Internal identity remains `K0` and `K1`; display copy must never be used for business decisions.

| Surface | zh current → approved | en current → approved | vi current → approved | ja current → approved |
| --- | --- | --- | --- | --- |
| Dashboard | 基础沟通 → 基础沟通 | Essential Korean → Essential Korean | Giao tiếp tiếng Hàn cơ bản → Giao tiếp tiếng Hàn cơ bản | 韓国語の基本コミュニケーション → 韓国語の基本コミュニケーション |
| 学习页 | 基础沟通 → 基础沟通 | Essential Korean → Essential Korean | Giao tiếp tiếng Hàn cơ bản → Giao tiếp tiếng Hàn cơ bản | 韓国語の基本コミュニケーション → 韓国語の基本コミュニケーション |
| 入门设置 | 生存韩语（运行时覆盖为基础沟通）→ 基础沟通 | Survival Korean（运行时覆盖为 Essential Korean）→ Essential Korean | Tiếng Hàn sinh tồn（运行时覆盖）→ Giao tiếp tiếng Hàn cơ bản | サバイバル韓国語（运行时覆盖）→ 韓国語の基本コミュニケーション |
| 诊断页 | 生存韩语 → 基础沟通 | Survival Korean → Essential Korean | Tiếng Hàn sinh tồn → Giao tiếp tiếng Hàn cơ bản | サバイバル韓国語 → 韓国語の基本コミュニケーション |
| 推荐说明 | 只使用 `stageId`，无阶段显示名称 | Uses `stageId`; no stage display name | Chỉ dùng `stageId`; không có tên hiển thị | `stageId`のみ使用し、表示名なし |
| taxonomy | 基础沟通 | Essential Korean | Giao tiếp tiếng Hàn cơ bản | 韓国語の基本コミュニケーション |

## Approved user-facing labels

| stageId | zh | en | vi | ja |
| --- | --- | --- | --- | --- |
| `K0` | 阶段1 · 韩文基础 | Stage 1 · Hangul Foundations | Giai đoạn 1 · Nền tảng Hangul | ステージ1 · ハングル基礎 |
| `K1` | 阶段2 · 基础沟通 | Stage 2 · Essential Korean | Giai đoạn 2 · Giao tiếp tiếng Hàn cơ bản | ステージ2 · 韓国語の基本コミュニケーション |

The matrix records the legacy values before the V4 integration performs a focused cleanup. The V4 runtime uses the approved values above in the app shell, onboarding, diagnostic and taxonomy surfaces; all selection and recommendation logic continues to use `stageId`.
