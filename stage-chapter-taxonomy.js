const SUPPORTED_LANGUAGES = Object.freeze(['zh', 'en', 'vi', 'ja']);
const TAXONOMY_VERSION = 'nikigo-taxonomy-v1';

const localized = value => Object.freeze(Object.fromEntries(
  SUPPORTED_LANGUAGES.map(language => [language, value[language]])
));

const stage = (stageId, displayOrder, names, labels, objective) => Object.freeze({
  stageId,
  displayOrder,
  name:localized(names),
  label:localized(labels),
  objective:localized(objective)
});

const chapter = (stageId, chapterId, moduleDisplayOrder, names, objective, contentIds, options = {}) => Object.freeze({
  stageId,
  chapterId,
  moduleDisplayOrder,
  name:localized(names),
  objective:localized(objective),
  contentIds:Object.freeze([...contentIds]),
  completionPolicy:Object.freeze({
    type:options.completionPolicy?.type || 'all-formally-completable-content',
    gatedContentId:options.completionPolicy?.gatedContentId || null,
    auxiliaryStatus:options.completionPolicy?.auxiliaryStatus || null
  }),
  futureAssignmentRule:'explicit-taxonomy-revision-only'
});

const STAGES = Object.freeze([
  stage('K0', 0,
    { zh:'韩文基础', en:'Hangul Foundations', vi:'Nền tảng Hangul', ja:'ハングル基礎' },
    { zh:'阶段1 · 韩文基础', en:'Stage 1 · Hangul Foundations', vi:'Giai đoạn 1 · Nền tảng Hangul', ja:'ステージ1 · ハングル基礎' },
    {
      zh:'认识韩文结构，建立基础拼读和常见发音规则意识，并完成第一轮问候场景综合检查。',
      en:'Understand the Hangul system, build foundational decoding and common sound-rule awareness, and complete a first integrated greeting checkpoint.',
      vi:'Hiểu hệ thống Hangul, xây dựng nền tảng ghép đọc và nhận biết các quy tắc âm thường gặp, rồi hoàn thành bài kiểm tra tổng hợp đầu tiên về tình huống chào hỏi.',
      ja:'ハングルの仕組みを理解し、基礎的な読み方とよくある音の規則を身につけ、最初のあいさつ場面の総合チェックを完了する。'
    }),
  stage('K1', 1,
    { zh:'基础沟通', en:'Essential Korean', vi:'Giao tiếp tiếng Hàn cơ bản', ja:'韓国語の基本コミュニケーション' },
    { zh:'阶段2 · 基础沟通', en:'Stage 2 · Essential Korean', vi:'Giai đoạn 2 · Giao tiếp tiếng Hàn cơ bản', ja:'ステージ2 · 韓国語の基本コミュニケーション' },
    {
      zh:'使用基础礼貌表达介绍姓名、身份、来源和学习语言，并在简单数量问答中使用固有数词。',
      en:'Use basic polite expressions for names, identity, origin, and study language, then use native Korean numbers in simple quantity exchanges.',
      vi:'Dùng các cách nói lịch sự cơ bản để giới thiệu tên, thân phận, nơi đến và ngôn ngữ đang học, sau đó dùng số thuần Hàn trong trao đổi số lượng đơn giản.',
      ja:'基本的な丁寧表現で名前・立場・出身・学習言語を伝え、簡単な数量のやり取りで固有数詞を使う。'
    })
]);

const CHAPTERS = Object.freeze([
  chapter('K0', 'k0-hangul-map-and-vowels', 0,
    { zh:'韩文地图与基础元音', en:'Hangul Map and Core Vowels', vi:'Bản đồ Hangul và nguyên âm cơ bản', ja:'ハングル全体図と基本母音' },
    {
      zh:'看懂韩文由辅音、元音和音节块组成；识别核心及易混元音，并把元音放入完整音节和初级词汇中。',
      en:'See how Hangul combines consonants, vowels, and syllable blocks; recognize core and easily confused vowels in full syllables and first words.',
      vi:'Hiểu Hangul được tạo từ phụ âm, nguyên âm và khối âm tiết; nhận biết nguyên âm cốt lõi và dễ nhầm trong âm tiết hoàn chỉnh và các từ đầu tiên.',
      ja:'ハングルが子音・母音・音節ブロックで構成されることを理解し、基本母音と似た母音を完全な音節や最初の単語の中で見分ける。'
    }, ['lesson-00', 'lesson-01', 'lesson-02']),
  chapter('K0', 'k0-consonants-syllables-compound-vowels', 1,
    { zh:'辅音、音节块与复合元音', en:'Consonants, Syllable Blocks, and Compound Vowels', vi:'Phụ âm, khối âm tiết và nguyên âm ghép', ja:'子音・音節ブロック・複合母音' },
    {
      zh:'通过完整音节区分高频辅音和普通音、送气音、紧音，理解左右/上下音节块，并掌握复合元音的拼写结构。',
      en:'Distinguish frequent consonants and plain, aspirated, and tense sounds in full syllables; understand syllable-block layouts and compound-vowel spelling.',
      vi:'Phân biệt phụ âm thường gặp cùng âm thường, bật hơi và căng trong âm tiết hoàn chỉnh; hiểu bố cục khối âm tiết và cấu trúc nguyên âm ghép.',
      ja:'完全な音節で基本子音と平音・激音・濃音を区別し、音節ブロックの配置と複合母音の綴りを理解する。'
    }, ['lesson-03', 'lesson-04', 'lesson-05', 'lesson-06'], {
      completionPolicy:{
        type:'all-content-with-required-audio-gate',
        gatedContentId:'lesson-06',
        auxiliaryStatus:'available-content-complete'
      }
    }),
  chapter('K0', 'k0-batchim-and-sound-changes', 2,
    { zh:'收音与常见音变', en:'Final Consonants and Common Sound Changes', vi:'Âm cuối và các biến âm thường gặp', ja:'パッチムとよくある音変化' },
    {
      zh:'识别基础收音、七种代表收音，以及连音、鼻音化等常见音变。',
      en:'Recognize basic finals, the seven representative final sounds, and common changes such as linking and nasalization.',
      vi:'Nhận biết các âm cuối cơ bản, bảy âm cuối đại diện và các biến âm thường gặp như nối âm và mũi hóa.',
      ja:'基本パッチム、7つの代表終声、連音・鼻音化などのよくある音変化を見分ける。'
    }, ['lesson-07', 'lesson-08']),
  chapter('K0', 'k0-integrated-use-and-checkpoint', 3,
    { zh:'综合应用与K0阶段挑战', en:'Integrated Use and the K0 Checkpoint', vi:'Vận dụng tổng hợp và thử thách K0', ja:'総合活用とK0チェックポイント' },
    {
      zh:'在问候与自我介绍场景中综合使用已学内容，并通过K0阶段挑战检查拼读、发音规则和场景理解。',
      en:'Apply earlier learning in greetings and self-introductions, then check decoding, sound rules, and scene understanding in the K0 challenge.',
      vi:'Vận dụng kiến thức đã học trong tình huống chào hỏi và tự giới thiệu, rồi kiểm tra ghép đọc, quy tắc âm và hiểu tình huống qua thử thách K0.',
      ja:'あいさつと自己紹介の場面で既習内容を統合し、K0チャレンジで読み方・音の規則・場面理解を確認する。'
    }, ['lesson-09', 'lesson-10']),
  chapter('K1', 'k1-identity-and-language-background', 0,
    { zh:'姓名、身份与语言背景', en:'Names, Identity, and Language Background', vi:'Tên, thân phận và nền tảng ngôn ngữ', ja:'名前・立場・言語背景' },
    {
      zh:'礼貌询问并表达姓名和身份，说明来自哪里与正在学习的语言。',
      en:'Ask and give names and identity politely, then state where someone comes from and which language they study.',
      vi:'Hỏi và nói tên, thân phận một cách lịch sự, sau đó cho biết đến từ đâu và đang học ngôn ngữ nào.',
      ja:'丁寧に名前と立場を尋ね・伝え、出身地と学習している言語を表現する。'
    }, ['lesson-11', 'lesson-12']),
  chapter('K1', 'k1-numbers-and-quantities', 1,
    { zh:'数字与基础数量', en:'Numbers and Basic Quantities', vi:'Số và số lượng cơ bản', ja:'数字と基本的な数量' },
    {
      zh:'掌握固有数词1～10和한/두/세/네变形，并在基础数量问答中使用몇 개예요?。',
      en:'Use native Korean numbers 1–10 and the shortened 한/두/세/네 forms in basic 몇 개예요? quantity exchanges.',
      vi:'Dùng số thuần Hàn 1–10 và các dạng rút gọn 한/두/세/네 trong trao đổi số lượng cơ bản với 몇 개예요?.',
      ja:'固有数詞1～10と한/두/세/네の短縮形を、몇 개예요?を使う基本的な数量のやり取りで用いる。'
    }, ['lesson-13'])
]);

const LESSON_TAXONOMY = Object.freeze(Object.fromEntries(
  CHAPTERS.flatMap(item => item.contentIds.map((stableId, lessonDisplayOrder) => [stableId, Object.freeze({
    taxonomyVersion:TAXONOMY_VERSION,
    stageId:item.stageId,
    chapterId:item.chapterId,
    moduleDisplayOrder:item.moduleDisplayOrder,
    lessonDisplayOrder
  })]))
));

const STAGE_CHAPTER_TAXONOMY = Object.freeze({
  taxonomyVersion:TAXONOMY_VERSION,
  programId:'korean',
  stages:STAGES,
  chapters:CHAPTERS,
  lessonMap:LESSON_TAXONOMY
});

function getStage(stageId) {
  return STAGES.find(item => item.stageId === stageId) || null;
}

function getChapter(chapterId) {
  return CHAPTERS.find(item => item.chapterId === chapterId) || null;
}

function getLessonTaxonomy(stableId) {
  return LESSON_TAXONOMY[stableId] || null;
}

function validateStageChapterTaxonomy(expectedStableIds = []) {
  const issues = [];
  const chapterIds = CHAPTERS.map(item => item.chapterId);
  const assignedList = CHAPTERS.flatMap(item => item.contentIds);
  const assignedIds = Object.keys(LESSON_TAXONOMY);
  if (new Set(chapterIds).size !== chapterIds.length) issues.push('duplicate-chapter-id');
  if (new Set(assignedList).size !== assignedList.length) issues.push('duplicate-lesson-assignment');
  for (const chapterItem of CHAPTERS) {
    if (!getStage(chapterItem.stageId)) issues.push(`unknown-stage:${chapterItem.chapterId}`);
    for (const language of SUPPORTED_LANGUAGES) {
      if (!chapterItem.name[language] || !chapterItem.objective[language]) issues.push(`missing-copy:${chapterItem.chapterId}:${language}`);
    }
  }
  if (expectedStableIds.length) {
    const expected = new Set(expectedStableIds);
    for (const stableId of expected) if (!LESSON_TAXONOMY[stableId]) issues.push(`missing-lesson:${stableId}`);
    for (const stableId of assignedIds) if (!expected.has(stableId)) issues.push(`unexpected-lesson:${stableId}`);
  }
  return Object.freeze({ valid:issues.length === 0, issues:Object.freeze(issues) });
}

export {
  SUPPORTED_LANGUAGES,
  TAXONOMY_VERSION,
  STAGES,
  CHAPTERS,
  LESSON_TAXONOMY,
  STAGE_CHAPTER_TAXONOMY,
  getStage,
  getChapter,
  getLessonTaxonomy,
  validateStageChapterTaxonomy
};
