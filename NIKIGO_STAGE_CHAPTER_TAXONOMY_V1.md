# Nikigo Stage and Chapter Taxonomy V1 — Approved

> Phase 3B.1.5 approved classification
>
> Source baseline: `300a64d3bc2af408aeec84a27c795ea241fe68ba`
>
> Status: approved for Phase 3B.2 implementation. This document does not authorize changes to `course-catalog.js`, course content, progress data, XP rules or access rules.

## 1. Approved decision

Nikigo’s learning hierarchy is:

```text
Program
→ Stage
→ Chapter / Module
→ Lesson
→ Step
→ Exercise
```

This approved taxonomy assigns the real Lessons 0–13 to two existing stages and six chapters. The assignment was checked against:

- current `course-catalog.js` titles, summaries, paths, templates and canonical routes;
- real-browser content audit checkpoints for every Lesson 0–13;
- current lesson configs/engines and their actual step counts;
- current completion and audio-gate behavior.

No assignment is inferred from a title or template at runtime. Phase 3B.2 must store this decision as an explicit, versioned taxonomy map with `taxonomyVersion: nikigo-taxonomy-v1`.

## 2. Approved program and stages

### Program

- `programId`: `korean`
- User-facing name: the product name and Korean-learning context already identify the program; a separate program picker is not required while Nikigo contains only Korean.

### Stages

The approved user-facing stage names replace bare K0/K1 display while preserving K0/K1 as internal IDs.

| stageId | 简体中文 | English | Tiếng Việt | 日本語 | Current lessons | Stage objective |
| --- | --- | --- | --- | --- | --- | --- |
| `K0` | 韩文基础 | Hangul Foundations | Nền tảng Hangul | ハングル基礎 | `lesson-00`–`lesson-10` | Understand the Hangul system, build foundational decoding and sound-rule awareness, then complete a first integrated greeting/checkpoint experience. |
| `K1` | 基础沟通 | Essential Korean | Giao tiếp tiếng Hàn cơ bản | 韓国語の基本コミュニケーション | `lesson-11`–`lesson-13` | Use basic polite expressions for identity and background, then use native Korean numbers in simple quantity exchanges. |

Approved stage objective copy:

| stageId | zh | en | vi | ja |
| --- | --- | --- | --- | --- |
| `K0` | 认识韩文结构，建立基础拼读和常见发音规则意识，并完成第一轮问候场景综合检查。 | Understand the Hangul system, build foundational decoding and common sound-rule awareness, and complete a first integrated greeting checkpoint. | Hiểu hệ thống Hangul, xây dựng nền tảng ghép đọc và nhận biết các quy tắc âm thường gặp, rồi hoàn thành bài kiểm tra tổng hợp đầu tiên về tình huống chào hỏi. | ハングルの仕組みを理解し、基礎的な読み方とよくある音の規則を身につけ、最初のあいさつ場面の総合チェックを完了する。 |
| `K1` | 使用基础礼貌表达介绍姓名、身份、来源和学习语言，并在简单数量问答中使用固有数词。 | Use basic polite expressions for names, identity, origin, and study language, then use native Korean numbers in simple quantity exchanges. | Dùng các cách nói lịch sự cơ bản để giới thiệu tên, thân phận, nơi đến và ngôn ngữ đang học, sau đó dùng số thuần Hàn trong trao đổi số lượng đơn giản. | 基本的な丁寧表現で名前・立場・出身・学習言語を伝え、簡単な数量のやり取りで固有数詞を使う。 |

K2–K4 keep their reserved state IDs and existing user-facing names, but they must not appear as released learning groups until real, approved content is assigned.

Ordinary users see the localized ordinal label before the internal code:

| stageId | zh | en | vi | ja |
| --- | --- | --- | --- | --- |
| `K0` | 阶段1 · 韩文基础 | Stage 1 · Hangul Foundations | Giai đoạn 1 · Nền tảng Hangul | ステージ1 · ハングル基礎 |
| `K1` | 阶段2 · 基础沟通 | Stage 2 · Essential Korean | Giai đoạn 2 · Giao tiếp tiếng Hàn cơ bản | ステージ2 · 韓国語の基本コミュニケーション |

## 3. Chapter summary

`moduleDisplayOrder` is scoped within its stage. Lessons inside a module always use their existing catalog `displayOrder`.

| stageId | moduleDisplayOrder | chapterId | Course stableIds | Full completion condition | Gate summary |
| --- | ---: | --- | --- | --- | --- |
| `K0` | 0 | `k0-hangul-map-and-vowels` | `lesson-00`, `lesson-01`, `lesson-02` | All three IDs are in `completedLessons` | No access/content gate; one Lesson 2 audio record remains non-playable but does not gate completion |
| `K0` | 1 | `k0-consonants-syllables-compound-vowels` | `lesson-03`, `lesson-04`, `lesson-05`, `lesson-06` | Lessons 3–5 complete and no required course remains completion-gated; see Lesson 6 rule below | Lesson 6 required-audio completion gate is closed; the lesson stays freely enterable as preview |
| `K0` | 2 | `k0-batchim-and-sound-changes` | `lesson-07`, `lesson-08` | Both IDs are in `completedLessons` | Pending/unavailable audio is non-blocking; no course access or completion gate |
| `K0` | 3 | `k0-integrated-use-and-checkpoint` | `lesson-09`, `lesson-10` | Both IDs are in `completedLessons` | Exact audio may be reused or disabled; no course access or completion gate |
| `K1` | 0 | `k1-identity-and-language-background` | `lesson-11`, `lesson-12` | Both IDs are in `completedLessons` | Declared pending sentence audio stays disabled; no course access or completion gate |
| `K1` | 1 | `k1-numbers-and-quantities` | `lesson-13` | `lesson-13` is in `completedLessons` for taxonomy V1 | No course access or completion gate; future content is not included until explicitly approved |

## 4. Approved chapter definitions

### K0 · Module 0

| Field | Approved |
| --- | --- |
| `stageId` | `K0` |
| Stage name | zh `韩文基础` · en `Hangul Foundations` · vi `Nền tảng Hangul` · ja `ハングル基礎` |
| `chapterId` | `k0-hangul-map-and-vowels` |
| Module name | zh `韩文地图与基础元音` · en `Hangul Map and Core Vowels` · vi `Bản đồ Hangul và nguyên âm cơ bản` · ja `ハングル全体図と基本母音` |
| `moduleDisplayOrder` | `0` within K0 |
| Lessons | `lesson-00`, `lesson-01`, `lesson-02` |
| Real content basis | Hangul map/start-point orientation; core vowels in full syllables; remaining/easily confused vowels, syllables and first real words |
| Completion condition | All three stable IDs are complete. Lesson 0 remains a real completion with 0 XP. |
| Audio/content gate | No access or completion gate. Lesson 2 has 12/13 playable primary-namespace records; the unmatched item stays disabled and does not block completion. |

Learning objective:

- zh: 看懂韩文由辅音、元音和音节块组成；识别核心及易混元音，并把元音放入完整音节和初级词汇中。
- en: See how Hangul combines consonants, vowels, and syllable blocks; recognize core and easily confused vowels in full syllables and first words.
- vi: Hiểu Hangul được tạo từ phụ âm, nguyên âm và khối âm tiết; nhận biết nguyên âm cốt lõi và dễ nhầm trong âm tiết hoàn chỉnh và các từ đầu tiên.
- ja: ハングルが子音・母音・音節ブロックで構成されることを理解し、基本母音と似た母音を完全な音節や最初の単語の中で見分ける。

Future extension rule: only orientation, vowel-recognition, or vowel-in-syllable content belongs here. New content requires an explicit chapter assignment and stable ID; neither title text nor template name may assign it automatically.

### K0 · Module 1

| Field | Approved |
| --- | --- |
| `stageId` | `K0` |
| Stage name | zh `韩文基础` · en `Hangul Foundations` · vi `Nền tảng Hangul` · ja `ハングル基礎` |
| `chapterId` | `k0-consonants-syllables-compound-vowels` |
| Module name | zh `辅音、音节块与复合元音` · en `Consonants, Syllable Blocks, and Compound Vowels` · vi `Phụ âm, khối âm tiết và nguyên âm ghép` · ja `子音・音節ブロック・複合母音` |
| `moduleDisplayOrder` | `1` within K0 |
| Lessons | `lesson-03`, `lesson-04`, `lesson-05`, `lesson-06` |
| Real content basis | High-frequency consonants in full syllables; plain/aspirated/tense contrasts; left-right/top-bottom syllable blocks; compound-vowel spelling and block construction |
| Completion condition | Standard full completion requires Lessons 3–5 complete and no required course left behind a closed completion gate. While Lesson 6 is gated, the module may report `available-content-complete` plus `previewPendingCount: 1`, but must not claim ordinary 4/4 completion. |
| Audio/content gate | Lesson 6 is freely enterable but has a closed `required-audio` formal-completion gate and awards no completion/XP. No course has an access gate. |

Learning objective:

- zh: 通过完整音节区分高频辅音和普通音、送气音、紧音，理解左右/上下音节块，并掌握复合元音的拼写结构。
- en: Distinguish frequent consonants and plain, aspirated, and tense sounds in full syllables; understand syllable-block layouts and compound-vowel spelling.
- vi: Phân biệt phụ âm thường gặp cùng âm thường, bật hơi và căng trong âm tiết hoàn chỉnh; hiểu bố cục khối âm tiết và cấu trúc nguyên âm ghép.
- ja: 完全な音節で基本子音と平音・激音・濃音を区別し、音節ブロックの配置と複合母音の綴りを理解する。

Future extension rule: consonant-system, syllable-construction, and compound-vowel lessons may be assigned here only through an explicit taxonomy revision. Lesson 6’s membership does not weaken its current gate.

### K0 · Module 2

| Field | Approved |
| --- | --- |
| `stageId` | `K0` |
| Stage name | zh `韩文基础` · en `Hangul Foundations` · vi `Nền tảng Hangul` · ja `ハングル基礎` |
| `chapterId` | `k0-batchim-and-sound-changes` |
| Module name | zh `收音与常见音变` · en `Final Consonants and Common Sound Changes` · vi `Âm cuối và các biến âm thường gặp` · ja `パッチムとよくある音変化` |
| `moduleDisplayOrder` | `2` within K0 |
| Lessons | `lesson-07`, `lesson-08` |
| Real content basis | Four basic finals ㄴㅁㅇㄹ; seven representative finals; linking and nasalization recognition |
| Completion condition | Both stable IDs are complete. |
| Audio/content gate | Lesson 7’s word audio remains unavailable and Lesson 8 intentionally avoids unreviewed audio; both retain completion and free access. |

Learning objective:

- zh: 识别基础收音、七种代表收音，以及连音、鼻音化等常见音变。
- en: Recognize basic finals, the seven representative final sounds, and common changes such as linking and nasalization.
- vi: Nhận biết các âm cuối cơ bản, bảy âm cuối đại diện và các biến âm thường gặp như nối âm và mũi hóa.
- ja: 基本パッチム、7つの代表終声、連音・鼻音化などのよくある音変化を見分ける。

Future extension rule: new batchim or sound-change content may join only after its concepts and prerequisite relationship are reviewed. Audio readiness remains separate from module membership.

### K0 · Module 3

| Field | Approved |
| --- | --- |
| `stageId` | `K0` |
| Stage name | zh `韩文基础` · en `Hangul Foundations` · vi `Nền tảng Hangul` · ja `ハングル基礎` |
| `chapterId` | `k0-integrated-use-and-checkpoint` |
| Module name | zh `综合应用与K0阶段挑战` · en `Integrated Use and the K0 Checkpoint` · vi `Vận dụng tổng hợp và thử thách K0` · ja `総合活用とK0チェックポイント` |
| `moduleDisplayOrder` | `3` within K0 |
| Lessons | `lesson-09`, `lesson-10` |
| Real content basis | Greeting/self-introduction scenario; integrated review of Lessons 0–9 with retry and a K0 checkpoint |
| Completion condition | Both stable IDs are complete. Lesson 10 remains a lesson-like checkpoint, not a new game product entry. |
| Audio/content gate | Exact approved cross-lesson audio may play; unavailable lines remain disabled. No access or completion gate. |

Learning objective:

- zh: 在问候与自我介绍场景中综合使用已学内容，并通过K0阶段挑战检查拼读、发音规则和场景理解。
- en: Apply earlier learning in greetings and self-introductions, then check decoding, sound rules, and scene understanding in the K0 challenge.
- vi: Vận dụng kiến thức đã học trong tình huống chào hỏi và tự giới thiệu, rồi kiểm tra ghép đọc, quy tắc âm và hiểu tình huống qua thử thách K0.
- ja: あいさつと自己紹介の場面で既習内容を統合し、K0チャレンジで読み方・音の規則・場面理解を確認する。

Future extension rule: only integrative K0 scenarios or checkpoints belong here. Practice/Game remains a content type, not an automatic top-level navigation entry.

### K1 · Module 0

| Field | Approved |
| --- | --- |
| `stageId` | `K1` |
| Stage name | zh `基础沟通` · en `Essential Korean` · vi `Giao tiếp tiếng Hàn cơ bản` · ja `韓国語の基本コミュニケーション` |
| `chapterId` | `k1-identity-and-language-background` |
| Module name | zh `姓名、身份与语言背景` · en `Names, Identity, and Language Background` · vi `Tên, thân phận và nền tảng ngôn ngữ` · ja `名前・立場・言語背景` |
| `moduleDisplayOrder` | `0` within K1 |
| Lessons | `lesson-11`, `lesson-12` |
| Real content basis | Asking/giving a name, polite identity expressions, country of origin, and study-language expressions |
| Completion condition | Both stable IDs are complete. |
| Audio/content gate | Declared sentence audio has no approved course namespace and remains disabled; lesson completion and free access remain available. |

Learning objective:

- zh: 礼貌询问并表达姓名和身份，说明来自哪里与正在学习的语言。
- en: Ask and give names and identity politely, then state where someone comes from and which language they study.
- vi: Hỏi và nói tên, thân phận một cách lịch sự, sau đó cho biết đến từ đâu và đang học ngôn ngữ nào.
- ja: 丁寧に名前と立場を尋ね・伝え、出身地と学習している言語を表現する。

Future extension rule: approved basic identity, origin, and language-background missions may be added explicitly. More advanced social topics should receive a separate chapter rather than expanding this module indefinitely.

### K1 · Module 1

| Field | Approved |
| --- | --- |
| `stageId` | `K1` |
| Stage name | zh `基础沟通` · en `Essential Korean` · vi `Giao tiếp tiếng Hàn cơ bản` · ja `韓国語の基本コミュニケーション` |
| `chapterId` | `k1-numbers-and-quantities` |
| Module name | zh `数字与基础数量` · en `Numbers and Basic Quantities` · vi `Số và số lượng cơ bản` · ja `数字と基本的な数量` |
| `moduleDisplayOrder` | `1` within K1 |
| Lessons | `lesson-13` |
| Real content basis | Native Korean numbers 1–10, shortened 한/두/세/네 forms, and basic `몇 개예요?` quantity exchange |
| Completion condition | For taxonomy V1, `lesson-13` is complete. Future approved lessons must not retroactively erase the historical V1 completion milestone. |
| Audio/content gate | No course access or completion gate; unresolved audio must continue to fail closed. |

Learning objective:

- zh: 掌握固有数词1～10和한/두/세/네变形，并在基础数量问答中使用`몇 개예요?`。
- en: Use native Korean numbers 1–10 and the shortened 한/두/세/네 forms in basic `몇 개예요?` quantity exchanges.
- vi: Dùng số thuần Hàn 1–10 và các dạng rút gọn 한/두/세/네 trong trao đổi số lượng cơ bản với `몇 개예요?`.
- ja: 固有数詞1～10と한/두/세/네の短縮形を、`몇 개예요?`を使う基本的な数量のやり取りで用いる。

Future extension rule: counters, age, time, prices, dates, and larger number systems require real approved lessons and explicit chapter decisions. They are not automatically assigned here merely because their titles contain a number.

## 5. Completion and expansion model

### Module progress

- `completedCount`: number of assigned lesson stable IDs currently in `completedLessons`.
- `totalCount`: number of real lessons explicitly assigned in the approved taxonomy version.
- Module course rows remain ordered by catalog `displayOrder`.
- A closed completion gate is reported separately as `previewPendingCount`/gate status; it is never converted into completion.
- For the Lesson 6 module, completing Lessons 3–5 may yield `available-content-complete`, but the UI must not display ordinary `4/4 complete` while Lesson 6 remains formally incomplete.

### Versioned expansion

- The approved taxonomy carries `taxonomyVersion: nikigo-taxonomy-v1`.
- The view model must distinguish `taxonomyVersion`, `historicalCompletion`, `historicalCompletedAt`, `currentVersionProgress` and `newContentAvailable`.
- A completion milestone is evidence for that taxonomy version; adding future content must not delete or falsify historical completion or its date, reclaim XP or auto-complete newly added lessons.
- When new content is added, the current module shows historical completion separately from “new content available” and calculates current-version progress independently.
- Newly added lessons never retroactively lock later content.
- New lessons require explicit `stageId`, `chapterId`, `moduleDisplayOrder` and lesson placement review.
- Existing course stable IDs, display numbers and display orders remain unchanged.

### Access boundary

- Stage, chapter and lesson order affect grouping and recommendation only.
- Every current and future `available` course remains directly enterable.
- `recommendedPrerequisites` remain advisory.
- No stage or chapter completion state becomes an access or entitlement gate.

## 6. Approved Phase 3B.2 display contract

This section is the implementation contract for Stage 3B.2.

### Home

- Show user-facing stage name and current module name, not only K0/K1.
- Show exactly one continue/recommendation action.
- Provide one complete-path entry.
- Do not render a full course list.

### Learn

- Group by Stage → Chapter/Module → Lesson.
- Default-expand the current stage and current module.
- If there is no active module, expand the module containing the current primary recommendation; if the stage is complete, expand its summary/current-version module state.
- Other modules are collapsible.
- Each module shows localized name, localized objective, `completedCount / totalCount`, gate/preview status and lessons ordered by catalog `displayOrder`.
- Grouping never disables an `available` course link.

### Explicit-data rule

- Do not derive `chapterId`, stage name, module name, module goal or `skillTags` from titles at runtime.
- Phase 3B.2 should consume one explicit approved taxonomy map through the existing content-registry adapter.
- `course-catalog.js` should remain unchanged unless a later approved migration deliberately makes taxonomy metadata canonical there.

## 7. Approved product decisions

1. K0 keeps its four-language “Hangul Foundations” naming. K1 keeps internal `stageId: K1`, while its user-facing name becomes “Essential Korean” and the approved equivalents above. Ordinary users see localized Stage 1/Stage 2 labels, not bare K0/K1.
2. The six `chapterId` values, lesson memberships and within-stage display orders in this document are approved. Runtime grouping must consume an explicit versioned map; title and template inference are forbidden.
3. While Lesson 6’s required-audio gate is closed, its module may expose the auxiliary state `available-content-complete`. The user-facing state is “3/4 complete”, “current completable content learned” and “1 lesson audio in preparation”; it must not claim normal 4/4 completion. Lesson 6 remains visible and freely enterable as preview, grants no formal completion or XP, and does not block Lesson 7 or later recommendations. When the gate opens, normal 4/4 completion is recalculated.
4. Versioned completion is approved. The view model distinguishes historical completion from current taxonomy progress. Future additions preserve historical completion, completion dates and XP; they do not auto-complete new lessons or become retroactive access gates. Persistence changes still require a separate migration approval and fixture tests.
