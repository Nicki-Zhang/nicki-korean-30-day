(function (global) {
  'use strict';

  const RIGHTS_TEMPLATE = Object.freeze({
    voiceTalent: null,
    consentRecord: null,
    commercialUseRecord: null
  });

  const BATCH_02B_SOURCE = Object.freeze({
    da:['37cabe6d05782f45ae49ebc5d2c76278cd3a3ac088ff433e50dd32d4b5619046',15360],
    ta:['158b84180fc317e304ec0e15d50c2a2df6d9dbe6ca6abb690d2471e846f90be8',23424],
    tta:['a027bee927746526b9f69b9b19ce552486fbc6ed2e3b8d9b6669a18f3413d7f0',18432],
    ba:['128841a96d40fc42589b97a89d31ef637ed70108b588a025f8b9095b5449b95c',13824],
    pa:['78b31bba7f20ebb379b9c5f92d9fb9da36debfd9bc17236af168c065392185ed',21120],
    ppa:['53cd03ff44b7ee2f39432a62db06d48467ffca76cf843c77c2a1d58b54f07285',16128],
    ja:['b65419728ffc7272ea4a93eee8566757688822081ebd031d1f8bd3fbfb2407d8',17664],
    cha:['0b9f14ede1bb854d28493883e54bfc6b3aa39dceb6fafe2328cdb95696ab517d',21888],
    jja:['9514e93678a8dfbae79af74bafa67c4f04314517c225a902da605f3ca8d824d2',16896],
    sa:['dc102fb4fa65f0592055ca4751e47498c38ac8d33b344996bd99c8328b6d5f3b',14592],
    ssa:['3c3b83fc317f12b936006c5fea2d5cd5966f7c5a1127883a4f0b86e6096ec381',19200],
    ha:['5a3e5a6e172bb265c02149b84b725a46de61156c5bf2fe2c39c8b263e65969b5',13824],
    geu:['c7dee859df0d3dc4ac9b8fd0c5d37ac7588e07313004a93a802849a4989d0d58',11520]
  });
  const batch02bRelease = id => ({
    reviewStatus:'approved', assetStatus:'available', sha256:BATCH_02B_SOURCE[id][0], fileSize:BATCH_02B_SOURCE[id][1], mimeType:'audio/mpeg',
    voice:'marin', generationDate:'2026-07-21T03:28:43.393Z', sourceRunId:'29798619662', sourceArtifact:'nikigo-audio-batch-02b-run-29798619662-09fad4f',
    technicalValidation:'passed', reviewMethod:'product-owner-listening', reviewedAt:'2026-07-21', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
    commercialUseBasis:'OpenAI API generated audio; legal review pending', rightsReviewStatus:'pending', reviewNotes:'Product owner listening passed on 2026-07-21; optional native-speaker review deferred.'
  });

  const REVIEWED_EXISTING_ASSETS = Object.freeze({
    'lesson-01:a':['8e893ff874c91380889ea124e3d15bce5da14e60ea89438a3ab0e8673b406b59',18432],
    'lesson-01:eo':['85a6913c65739ea5f743e4f7d7af7850feffabacd13b82e62115f6ca826a873c',14592],
    'lesson-01:o':['4e5b17115a29ccc8420716db1ceaa8edf88ad7e97b0fbb542336cb4aa7b90192',19200],
    'lesson-01:u':['f64b071df66a3f4d5e4a55c41ab2ea287d00c02a4ff21fa854bb7e64bda52f45',12288],
    'lesson-01:ga':['11ac6f071d18d46b72ce82a6dcd1b8cabb6b7aef50651bae5a63b1ee64c95303',11520],
    'lesson-01:na':['5e1a7902cad24f24c7d1b4258bdcafe7c07fa92dd48f10d5d4d31657b43c6b6d',16896],
    'lesson-01:geo':['12a3d6860c6b990225a419e369966402050c11c69dc7144878e54c16aeb81ae2',16512],
    'lesson-01:go':['e8b36f73d54fdb6ae0c8666ac107ebb61e03f7c4042fe931f96ac8ade16e6f55',16468],
    'lesson-01:gu':['4c58f4b4d06501f983be51597ff455575626ac4cb4d628c6bca6952114e41929',16726],
    'lesson-01:neo':['972b578de602fba01c62e5941b2f1e7e822187881c2589fcfa20d9a1ca5948bb',16262],
    'lesson-01:no':['8261f015f1a1d30c761de49615746d9128dfee87bd6490847967aa2ea1df4a31',15242],
    'lesson-01:nu':['ed6954ec5373a34d9c438524ba5dba300b02427cab47ad23d83a6dcd75996536',15750],
    'lesson-02:eu':['6d52937199d761d228a1bf1cc5dfb6ff64dc194c3c0f5037becb781c54d980f8',14592],
    'lesson-02:i':['3390b44c22311440df2e5d0415a254c3f5b14dd4034f65accc1b160cb41ba23b',32256],
    'lesson-02:ae':['07dc5c7b6fdc20d1eb5f803b20bb96cfe78efea8d260bc5c5365ac9fa86bf686',22656],
    'lesson-02:e':['2bab201e942a77e17c6be19e6ac238e3ae26ddaac7616dbe5a7986fc9ffd0bbb',14592],
    'lesson-02:da':['76d1646319f8191830288e0ea6a859e21c2304e1427743e1331905bbaa4714a4',16896],
    'lesson-02:di':['0411f0bae1ff7a7ce1454b7bbc149304e147992355293300de5285c68bc5fd06',16128],
    'lesson-02:ra':['2458f243268c25adc1c78fbebfeada75bc110c9299a2faab81feffbe74892bb4',12288],
    'lesson-02:ma':['6e4cd90544e268c9249efb8e9e94817327670de13c9e4623c54c3688c1ce49dc',13824],
    'lesson-02:mi':['77e2a63c39057784b4855d5e79b1558d488bfec533cab4464d6f0f60d6bb692e',13056],
    'lesson-02:namu':['2cd38d1980e10fd3b3fb8f4771d37f170b6323011ff19ebf1e508af0ceb4dcd0',15360],
    'lesson-02:dari':['89ac9f3c1e2fda0f7ce5bc32283ebfba31a296619c8d20408072fc1c6b3f01bc',15360],
    'lesson-02:meori':['41250f21c9115f516ada5be9279505db8d6f1d9e0fea765ced99959602af68ec',12288],
    'lesson-03:ya':['c0e901c4cbcb564925f1785478f70cc3783367880ba93f2089806349ac2f1589',21888],
    'lesson-03:yeo':['0192fd777e29ebd44733a90d8b829463432a1c50c3aaaf7d14559bd22687e643',24960],
    'lesson-03:ba':['6a0ff4579c7c010857e24a94b89b945a575de7eae446833389491fdff4ff7b07',16128],
    'lesson-03:byeo':['c78bd8a777e1b9e27419d18ce4e4ea8a5b857109bfc0e115fcaafa5209ab662a',14592],
    'lesson-03:sa':['39924ee692963d887b43482457b3f2f88e923f9a1deb9485d427580d6ea0af8e',21120],
    'lesson-03:syeo':['41c860b8e120b304bd0566e16bb7a0d54f0e84b251bae317559828b214323fa4',15360],
    'lesson-03:a':['4594f0ce881ed82fa1a4eb08e14f54d4dfd6d6370027b7500ebc7a9e20190696',18432],
    'lesson-03:bada':['941d8c389aa267a8a2e88af9a3173535df0d69cef97c3bd6a6e9f411d96d69e6',16896],
    'lesson-03:saram':['acfdee57490f47cb20cb1bf746c9b399c8044d833e18a0e668f527780ba79d16',16128],
    'lesson-03:annyeong':['520c0bb4a21711e081ee330ad73030cee8d47ab1bcd65ca8529b903e0195bedf',21120],
    'lesson-03:annyeonghaseyo':['4087cf765ef449080c112f9a55c16ae319abc366a33847dd7cc8fbaa4d96f105',18432],
    'lesson-04:ba':['dc8345a1cad1ee3044c7f5ff633efbe13fd18c5d31f506107122b5464fe69e5e',16726]
  });
  const SYSTEM_EXPORT_RECORDS = new Set(['lesson-01:geo','lesson-01:go','lesson-01:gu','lesson-01:neo','lesson-01:no','lesson-01:nu','lesson-04:ba']);
  const REVIEWED_SOURCE_COMMITS = Object.freeze({
    'lesson-01':'9f012c1c67b8a3de2f260417dfbc12612d12247f',
    'lesson-02':'d1b9c81a41d888f947f516aab7cd2b969744cb89',
    'lesson-03':'737647fcd1f7d780974cde4d3a52e4b14d28520d',
    system:'9b5b6f50b11bdb0900bd13d317ad6458a2676f69'
  });
  const REVIEWED_SOURCE_DATES = Object.freeze({
    'lesson-01':'2026-07-18T11:29:20Z', 'lesson-02':'2026-07-18T11:51:26Z',
    'lesson-03':'2026-07-18T13:51:53Z', system:'2026-07-19T09:43:37+07:00'
  });
  const reviewedExistingRelease = recordId => {
    const source = REVIEWED_EXISTING_ASSETS[recordId];
    if (!source) return null;
    const systemExport = SYSTEM_EXPORT_RECORDS.has(recordId);
    const lessonId = recordId.split(':')[0];
    const sourceKey = systemExport ? 'system' : lessonId;
    return {
      reviewStatus:'approved', assetStatus:'available', sha256:source[0], fileSize:source[1], mimeType:systemExport ? 'audio/wav' : 'audio/mpeg',
      model:systemExport ? 'macOS-system-voice' : 'gpt-4o-mini-tts', voice:systemExport ? 'Yuna' : 'marin', generationDate:REVIEWED_SOURCE_DATES[sourceKey],
      sourceRunId:systemExport ? 'not-applicable-local-system-export' : 'legacy-github-actions-run-id-unavailable',
      sourceArtifact:`repository-commit-${REVIEWED_SOURCE_COMMITS[sourceKey]}`,
      technicalValidation:'passed', reviewMethod:'product-owner-listening', reviewedAt:'2026-07-21', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
      commercialUseBasis:'pending-documentation', rightsReviewStatus:'pending',
      reviewNotes:'Product owner listening passed on 2026-07-21; source provenance is retained from repository history; commercial rights review remains pending.'
    };
  };

  const item = (id, displayText, speechText, file, options) => Object.freeze({
    id,
    lessonId: options.lessonId,
    targetSymbol: options.targetSymbol ?? null,
    displayText,
    speechText,
    expectedPronunciation: options.expectedPronunciation || speechText,
    pronunciationRule: options.pronunciationRule || '',
    audioType: options.audioType || options.type,
    type: options.audioType || options.type,
    pronunciationType: options.pronunciationType,
    screen: options.screen,
    teachingGoal: options.teachingGoal,
    file,
    voiceSource: String(options.voiceSource || '').startsWith('apple-') ? 'legacy-system-export' : (options.voiceSource || 'openai-gpt-4o-mini-tts'),
    model: options.model ?? (String(options.voiceSource || '').startsWith('apple-') ? null : 'gpt-4o-mini-tts'),
    ...(options.voice ? { voice:options.voice } : {}),
    generationDate: options.generationDate ?? null,
    commercialUseBasis: options.commercialUseBasis ?? 'pending-documentation',
    reviewStatus: options.reviewStatus || 'pending',
    assetStatus: options.assetStatus || 'available',
    ...(options.sha256 ? { sha256:options.sha256 } : {}),
    ...(options.fileSize ? { fileSize:options.fileSize } : {}),
    ...(options.mimeType ? { mimeType:options.mimeType } : {}),
    ...(options.sourceRunId ? { sourceRunId:options.sourceRunId } : {}),
    ...(options.sourceArtifact ? { sourceArtifact:options.sourceArtifact } : {}),
    ...(options.sourceSha256 ? { sourceSha256:options.sourceSha256 } : {}),
    ...(options.postProcessingReport ? { postProcessingReport:options.postProcessingReport } : {}),
    ...(options.technicalValidation ? { technicalValidation:options.technicalValidation } : {}),
    ...(options.reviewMethod ? { reviewMethod:options.reviewMethod } : {}),
    ...(options.reviewedAt ? { reviewedAt:options.reviewedAt } : {}),
    ...(options.nativeReviewStatus ? { nativeReviewStatus:options.nativeReviewStatus } : {}),
    ...(options.rightsReviewStatus ? { rightsReviewStatus:options.rightsReviewStatus } : {}),
    nativeReviewer: options.nativeReviewer ?? null,
    reviewNotes: options.reviewNotes || 'legacy-unreviewed',
    needsNativeReview: options.needsNativeReview ?? true,
    rights: RIGHTS_TEMPLATE
  });

  const lessons = {
    'lesson-00': Object.freeze({
      title: '韩文字母地图',
      items: Object.freeze([
        item('yo', 'ㅛ（发音载体：요）', '요', 'yo.mp3', {
          targetSymbol:'ㅛ', type:'vowel', pronunciationType:'full-syllable',
          screen:'第0课字母地图元音详情', teachingGoal:'用无声初声 ㅇ 承载元音 ㅛ',
          reviewStatus:'approved', assetStatus:'available', sha256:'d2570041a865d0d686e6debf1a06584fa10b1177ebb590e4654a30506f5538b0', fileSize:14592, mimeType:'audio/mpeg',
          voiceSource:'openai-gpt-4o-mini-tts', model:'gpt-4o-mini-tts', voice:'marin', generationDate:'2026-07-20T02:07:40.367Z',
          sourceRunId:'29713532746', sourceArtifact:'nikigo-audio-batch-01-validation-run-29713532746-78e5510', technicalValidation:'passed',
          reviewMethod:'product-owner-listening', reviewedAt:'2026-07-20', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
          commercialUseBasis:'OpenAI API generated audio; legal review pending', rightsReviewStatus:'pending',
          reviewNotes:'Product owner listening passed on 2026-07-20; optional native-speaker review deferred.'
        }),
        item('yu', 'ㅠ（发音载体：유）', '유', 'yu.mp3', {
          targetSymbol:'ㅠ', type:'vowel', pronunciationType:'full-syllable',
          screen:'第0课字母地图元音详情', teachingGoal:'用无声初声 ㅇ 承载元音 ㅠ',
          reviewStatus:'approved', assetStatus:'available', sha256:'3eb015cd5a7a9c7955976e1d0acd6669126e7c5c74a1c928f7d7b9d925d98430', fileSize:25728, mimeType:'audio/mpeg',
          voiceSource:'openai-gpt-4o-mini-tts', model:'gpt-4o-mini-tts', voice:'marin', generationDate:'2026-07-20T02:07:40.367Z',
          sourceRunId:'29713532746', sourceArtifact:'nikigo-audio-batch-01-validation-run-29713532746-78e5510', technicalValidation:'passed',
          reviewMethod:'product-owner-listening', reviewedAt:'2026-07-20', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
          commercialUseBasis:'OpenAI API generated audio; legal review pending', rightsReviewStatus:'pending',
          reviewNotes:'Product owner listening passed on 2026-07-20; optional native-speaker review deferred.'
        }),
        item('ha', 'ㅎ（示例音节：하）', '하', 'ha.mp3', {
          targetSymbol:'ㅎ', type:'initial-example', pronunciationType:'full-syllable',
          screen:'第0课字母地图辅音详情', teachingGoal:'在完整音节 하 中听 ㅎ 的初声', pronunciationRule:'초성 ㅎ',
          voiceSource:'openai-gpt-4o-mini-tts', model:'gpt-4o-mini-tts',
          ...batch02bRelease('ha')
        })
      ])
    }),
    'lesson-01': Object.freeze({
      title: '韩文字母：第一步',
      items: Object.freeze([
        item('a', 'ㅏ（发音载体：아）', '아', 'a.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、练习 1', teachingGoal: '用无声初声 ㅇ 承载元音 ㅏ' }),
        item('eo', 'ㅓ（发音载体：어）', '어', 'eo.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、练习 2', teachingGoal: '用完整音节教学元音 ㅓ' }),
        item('o', 'ㅗ（发音载体：오）', '오', 'o.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、挑战 1', teachingGoal: '用完整音节教学元音 ㅗ' }),
        item('u', 'ㅜ（发音载体：우）', '우', 'u.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、挑战 2', teachingGoal: '用完整音节教学元音 ㅜ' }),
        item('ga', 'ㄱ（示例：가）', '가', 'ga.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节、挑战 5', teachingGoal: '在完整音节 가 中听 ㄱ 的初声' }),
        item('na', 'ㄴ（示例：나）', '나', 'na.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节、跟读', teachingGoal: '在完整音节 나 中听 ㄴ 的初声' }),
        item('geo', '거', '거', 'geo-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄱ + ㅓ 的拼读', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('go', '고', '고', 'go-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄱ + ㅗ 的拼读', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('gu', '구', '구', 'gu-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄱ + ㅜ 的拼读', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('neo', '너', '너', 'neo-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄴ + ㅓ 的拼读', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('no', '노', '노', 'no-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄴ + ㅗ 的拼读', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('nu', '누', '누', 'nu-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄴ + ㅜ 的拼读', voiceSource: 'apple-system-ko-KR-yuna' })
      ])
    }),
    'lesson-02': Object.freeze({
      title: '从音节读到第一个词',
      items: Object.freeze([
        item('eu', 'ㅡ（发音载体：으）', '으', 'eu.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、练习 1', teachingGoal: '用完整音节教学元音 ㅡ' }),
        item('i', 'ㅣ（发音载体：이）', '이', 'i.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、挑战 1', teachingGoal: '用完整音节教学元音 ㅣ' }),
        item('ae', 'ㅐ（发音载体：애）', '애', 'ae.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片', teachingGoal: '识别 ㅐ 的字形与现代首尔音' }),
        item('e', 'ㅔ（发音载体：에）', '에', 'e.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片', teachingGoal: '识别 ㅔ 的字形与现代首尔音' }),
        item('da', 'ㄷ（示例：다）', '다', 'da.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节', teachingGoal: '在 다 中听 ㄷ 初声' }),
        item('di', '디', '디', 'di.mp3', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄷ + ㅣ' }),
        item('ra', 'ㄹ（示例：라）', '라', 'ra.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节', teachingGoal: '在 라 中听 ㄹ 初声' }),
        item('ri', '리', '리', 'ri.mp3', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㄹ + ㅣ' }),
        item('ma', 'ㅁ（示例：마）', '마', 'ma.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节', teachingGoal: '在 마 中听 ㅁ 初声' }),
        item('mi', '미', '미', 'mi.mp3', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㅁ + ㅣ' }),
        item('namu', '나무', '나무', 'namu.mp3', { type: 'word', pronunciationType: '单词', screen: '真实词汇、练习 3、跟读', teachingGoal: '读出真实词汇“树”' }),
        item('dari', '다리', '다리', 'dari.mp3', { type: 'word', pronunciationType: '单词', screen: '真实词汇、跟读', teachingGoal: '读出真实词汇“腿/桥”' }),
        item('meori', '머리', '머리', 'meori.mp3', { type: 'word', pronunciationType: '单词', screen: '真实词汇、挑战 4、跟读', teachingGoal: '读出真实词汇“头”' })
      ])
    }),
    'lesson-03': Object.freeze({
      title: '第一次打招呼',
      items: Object.freeze([
        item('ya', 'ㅑ（发音载体：야）', '야', 'ya.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、挑战 1', teachingGoal: '用完整音节教学元音 ㅑ' }),
        item('yeo', 'ㅕ（发音载体：여）', '여', 'yeo.mp3', { type: 'vowel', pronunciationType: '单个元音', screen: '元音卡片、练习 1、拼音节', teachingGoal: '用完整音节教学元音 ㅕ' }),
        item('ba', 'ㅂ（示例：바）', '바', 'ba.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节', teachingGoal: '在 바 中听 ㅂ 初声' }),
        item('byeo', '벼', '벼', 'byeo.mp3', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㅂ + ㅕ' }),
        item('sa', 'ㅅ（示例：사）', '사', 'sa.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节', teachingGoal: '在 사 中听 ㅅ 初声' }),
        item('syeo', '셔', '셔', 'syeo.mp3', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '验证 ㅅ + ㅕ' }),
        item('a', 'ㅇ（初声无声示例：아）', '아', 'a.mp3', { type: 'initial-example', pronunciationType: '初声辅音', screen: '辅音卡片、拼音节', teachingGoal: '在 아 中听出初声 ㅇ 不发音' }),
        item('bada', '바다', '바다', 'bada.mp3', { type: 'word', pronunciationType: '单词', screen: '真实词汇', teachingGoal: '读出“海”' }),
        item('saram', '사람', '사람', 'saram.mp3', { type: 'word', pronunciationType: '单词', screen: '真实词汇', teachingGoal: '读出“人”' }),
        item('annyeong', '안녕', '안녕', 'annyeong.mp3', { type: 'word', pronunciationType: '单词', screen: '真实词汇', teachingGoal: '识别简短问候' }),
        item('annyeonghaseyo', '안녕하세요', '안녕하세요', 'annyeonghaseyo.mp3', { type: 'sentence', pronunciationType: '完整句子或对话', screen: '场景短语、跟读、挑战 4', teachingGoal: '自然说出礼貌问候' })
      ])
    }),
    'lesson-04': Object.freeze({
      title: '收音：音节的最后一块',
      items: Object.freeze([
        item('san', '산', '산', 'san-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音卡片、真实词汇', teachingGoal: '在完整单词中听 ㄴ 收音', pronunciationRule: '받침 ㄴ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('mom', '몸', '몸', 'mom-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音卡片、真实词汇', teachingGoal: '在完整单词中听 ㅁ 收音', pronunciationRule: '받침 ㅁ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('gong', '공', '공', 'gong-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音卡片、真实词汇', teachingGoal: '在完整单词中听 ㅇ 收音', pronunciationRule: '받침 ㅇ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('mul', '물', '물', 'mul-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音卡片、真实词汇、挑战 3', teachingGoal: '在完整单词中听 ㄹ 收音', pronunciationRule: '받침 ㄹ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('ba', '바', '바', 'ba-v2.wav', { type: 'syllable', pronunciationType: '完整音节', screen: '拼音节', teachingGoal: '对比无收音的基础音节', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('ban', '반', '반', 'ban-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音对比、拼音节', teachingGoal: '对比 바 + ㄴ', pronunciationRule: '받침 ㄴ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('bam', '밤', '밤', 'bam-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音对比、拼音节、挑战 1', teachingGoal: '对比 바 + ㅁ', pronunciationRule: '받침 ㅁ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('bang', '방', '방', 'bang-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音对比、拼音节、练习 1', teachingGoal: '对比 바 + ㅇ', pronunciationRule: '받침 ㅇ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('bal', '발', '발', 'bal-v2.wav', { type: 'batchim-example', pronunciationType: '收音', screen: '收音对比、拼音节', teachingGoal: '对比 바 + ㄹ', pronunciationRule: '받침 ㄹ', voiceSource: 'apple-system-ko-KR-yuna' }),
        item('gamsahamnida', '감사합니다', '감사합니다', 'gamsahamnida-v2.wav', { type: 'sound-change', pronunciationType: '音变、完整句子或对话', screen: '场景短语、跟读、挑战 4', teachingGoal: '自然说出正式感谢', expectedPronunciation: '감사함니다', pronunciationRule: '鼻音化：합니다 → [함니다]', voiceSource: 'apple-system-ko-KR-yuna' })
      ])
    }),
    'lesson-05': Object.freeze({
      title: '看懂韩语音节块',
      items: Object.freeze([
        item('geu', '그', '그', 'geu.mp3', {
          targetSymbol:'ㅡ', type:'syllable', pronunciationType:'full-syllable',
          screen:'第5课上下结构示例', teachingGoal:'用完整音节展示 ㄱ + ㅡ = 그', pronunciationRule:'ㄱ + ㅡ',
          voiceSource:'openai-gpt-4o-mini-tts', model:'gpt-4o-mini-tts',
          ...batch02bRelease('geu')
        })
      ])
    }),
    'lesson-07': Object.freeze({
      title: '基础收音 ㄴㅁㅇㄹ',
      items: Object.freeze([
        item('san','산','산','san.mp3',{ targetSymbol:'ㄴ', type:'word', pronunciationType:'full-word', screen:'第7课ㄴ示例', teachingGoal:'在完整单词 산 中听结尾[n]', pronunciationRule:'받침 ㄴ', reviewStatus:'pending', assetStatus:'missing', technicalValidation:'pending', voice:'marin', nativeReviewStatus:'deferred', rightsReviewStatus:'pending', nativeReviewer:null, needsNativeReview:false, reviewNotes:'Audio not generated or reviewed.' }),
        item('mom','몸','몸','mom.mp3',{ targetSymbol:'ㅁ', type:'word', pronunciationType:'full-word', screen:'第7课ㅁ示例', teachingGoal:'在完整单词 몸 中听结尾[m]', pronunciationRule:'받침 ㅁ', reviewStatus:'pending', assetStatus:'missing', technicalValidation:'pending', voice:'marin', nativeReviewStatus:'deferred', rightsReviewStatus:'pending', nativeReviewer:null, needsNativeReview:false, reviewNotes:'Audio not generated or reviewed.' }),
        item('gong','공','공','gong.mp3',{ targetSymbol:'ㅇ', type:'word', pronunciationType:'full-word', screen:'第7课ㅇ示例', teachingGoal:'在完整单词 공 中听结尾[ng]', pronunciationRule:'받침 ㅇ', reviewStatus:'pending', assetStatus:'missing', technicalValidation:'pending', voice:'marin', nativeReviewStatus:'deferred', rightsReviewStatus:'pending', nativeReviewer:null, needsNativeReview:false, reviewNotes:'Audio not generated or reviewed.' }),
        item('mul','물','물','mul.mp3',{ targetSymbol:'ㄹ', type:'word', pronunciationType:'full-word', screen:'第7课ㄹ示例', teachingGoal:'在完整单词 물 中听结尾[l]', pronunciationRule:'받침 ㄹ', reviewStatus:'pending', assetStatus:'missing', technicalValidation:'pending', voice:'marin', nativeReviewStatus:'deferred', rightsReviewStatus:'pending', nativeReviewer:null, needsNativeReview:false, reviewNotes:'Audio not generated or reviewed.' })
      ])
    })
  };

  Object.entries(lessons).forEach(([lessonId, lesson]) => {
    lessons[lessonId] = Object.freeze({ ...lesson, items:Object.freeze(lesson.items.map(entry => Object.freeze({ ...entry, ...(reviewedExistingRelease(`${lessonId}:${entry.id}`) || {}), lessonId }))) });
  });

  const contrastSpecs = [
    ['ga','ㄱ','plain','가'],['ka','ㅋ','aspirated','카'],['kka','ㄲ','tense','까'],
    ['da','ㄷ','plain','다'],['ta','ㅌ','aspirated','타'],['tta','ㄸ','tense','따'],
    ['ba','ㅂ','plain','바'],['pa','ㅍ','aspirated','파'],['ppa','ㅃ','tense','빠'],
    ['ja','ㅈ','plain','자'],['cha','ㅊ','aspirated','차'],['jja','ㅉ','tense','짜'],
    ['sa','ㅅ','plain','사'],['ssa','ㅆ','tense','싸']
  ];
  const contrastReleases = Object.freeze({
    ga:Object.freeze({
      reviewStatus:'approved', assetStatus:'available', sha256:'705fc26ec549f1882f06eaeb997ba59f0ceef95e8c9603e5a7a82b35451205a9', fileSize:11949, mimeType:'audio/mpeg',
      voice:'marin', generationDate:'2026-07-20T06:00:11.789Z', sourceRunId:'29720437383', sourceArtifact:'nikigo-audio-batch-02a-gaka-r1-run-29720437383-a23a08b', sourceSha256:'db8fe0dece7cf0290c11ec5eebde750e3c8051169b17c11e83775f7438453860',
      postProcessingReport:'audio/k0-consonant-contrast/postprocessing-report.json', technicalValidation:'passed', reviewMethod:'product-owner-listening', reviewedAt:'2026-07-20', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
      commercialUseBasis:'OpenAI API generated audio; legal review pending', rightsReviewStatus:'pending', reviewNotes:'Product owner listening passed on 2026-07-20; deterministic silence trim and linear gain alignment applied; optional native-speaker review deferred.'
    }),
    ka:Object.freeze({
      reviewStatus:'approved', assetStatus:'available', sha256:'7a4754d8c2583d1941a8f2d18bfd41239e4e753726af880fc3c0ea7dd2c697ed', fileSize:11949, mimeType:'audio/mpeg',
      voice:'marin', generationDate:'2026-07-20T06:00:11.789Z', sourceRunId:'29720437383', sourceArtifact:'nikigo-audio-batch-02a-gaka-r1-run-29720437383-a23a08b', sourceSha256:'460d6f23a6c17d1f3a6522289d0fe99d63253d598c5141695b45f12a29b7be71',
      postProcessingReport:'audio/k0-consonant-contrast/postprocessing-report.json', technicalValidation:'passed', reviewMethod:'product-owner-listening', reviewedAt:'2026-07-20', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
      commercialUseBasis:'OpenAI API generated audio; legal review pending', rightsReviewStatus:'pending', reviewNotes:'Product owner listening passed on 2026-07-20; deterministic silence trim and linear gain alignment applied; optional native-speaker review deferred.'
    }),
    kka:Object.freeze({
      reviewStatus:'approved', assetStatus:'available', sha256:'c63080ad2e208b9f9319b806d2470143b7a2140cba4768c0cc61947cccf9e545', fileSize:10029, mimeType:'audio/mpeg',
      voice:'marin', generationDate:'2026-07-20T04:40:35.153Z', sourceRunId:'29717434767', sourceArtifact:'nikigo-audio-batch-02a-run-29717434767-0213e68', sourceSha256:'20a33fd85584d2efc288513368a90c0ef94022f21a074bf0646a641b46ccdf27',
      postProcessingReport:'audio/k0-consonant-contrast/postprocessing-report.json', technicalValidation:'passed', reviewMethod:'product-owner-listening', reviewedAt:'2026-07-20', nativeReviewStatus:'deferred', nativeReviewer:null, needsNativeReview:false,
      commercialUseBasis:'OpenAI API generated audio; legal review pending', rightsReviewStatus:'pending', reviewNotes:'Product owner listening passed on 2026-07-20; original generated file retained as the source and only deterministic silence trim and linear gain alignment applied; optional native-speaker review deferred.'
    }),
    da:Object.freeze(batch02bRelease('da')),
    ta:Object.freeze(batch02bRelease('ta')),
    tta:Object.freeze(batch02bRelease('tta')),
    ba:Object.freeze(batch02bRelease('ba')),
    pa:Object.freeze(batch02bRelease('pa')),
    ppa:Object.freeze(batch02bRelease('ppa')),
    ja:Object.freeze(batch02bRelease('ja')),
    cha:Object.freeze(batch02bRelease('cha')),
    jja:Object.freeze(batch02bRelease('jja')),
    sa:Object.freeze(batch02bRelease('sa')),
    ssa:Object.freeze(batch02bRelease('ssa'))
  });
  lessons['k0-consonant-contrast'] = Object.freeze({
    title:'听懂普通音、送气音和紧音',
    items:Object.freeze(contrastSpecs.map(([id, targetSymbol, category, syllable]) => item(id, syllable, syllable, `${id}.mp3`, {
      lessonId:'k0-consonant-contrast', targetSymbol, audioType:'initial-example', pronunciationType:'full-syllable',
      pronunciationRule:`${category} onset in a complete syllable`, screen:'对比卡片、听辨练习', teachingGoal:'通过完整音节比较普通音、送气音和紧音',
      voiceSource:'openai-gpt-4o-mini-tts', assetStatus:'missing', reviewNotes:'Not generated; Korean native-speaker review required.',
      ...(contrastReleases[id] || {})
    })))
  });

  const lesson6Specs = [
    ['wa-syllable','ㅘ','ㅘ（承载音节：와）','와','syllable','wa.mp3'],
    ['wae-syllable','ㅙ','ㅙ（承载音节：왜）','왜','syllable','wae-syllable.mp3'],
    ['oe-syllable','ㅚ','ㅚ（承载音节：외）','외','syllable','oe.mp3'],
    ['wo-syllable','ㅝ','ㅝ（承载音节：워）','워','syllable','wo.mp3'],
    ['we-syllable','ㅞ','ㅞ（承载音节：웨）','웨','syllable','we.mp3'],
    ['wi-syllable','ㅟ','ㅟ（承载音节：위）','위','syllable','wi.mp3'],
    ['ui-syllable','ㅢ','ㅢ（承载音节：의）','의','syllable','ui.mp3'],
    ['yae-syllable','ㅒ','ㅒ（承载音节：얘）','얘','syllable','yae.mp3'],
    ['ye-syllable','ㅖ','ㅖ（承载音节：예）','예','syllable','ye-syllable.mp3'],
    ['mwo-word',null,'뭐','뭐','word','mwo.mp3'],
    ['gwaja-word',null,'과자','과자','word','gwaja.mp3'],
    ['yeou-word',null,'여우','여우','word','yeou.mp3'],
    ['uija-word',null,'의자','의자','word','uija.mp3'],
    ['wae-word',null,'왜','왜','word','wae-word.mp3'],
    ['ye-word',null,'예','예','word','ye-word.mp3']
  ];
  lessons['lesson-06'] = Object.freeze({
    title:'复合元音',
    items:Object.freeze(lesson6Specs.map(([id,targetSymbol,displayText,speechText,audioType,file]) => item(id, displayText, speechText, file, {
      lessonId:'lesson-06', targetSymbol, audioType, pronunciationType:audioType === 'word' ? 'full-word' : 'full-syllable',
      pronunciationRule:audioType === 'word' ? 'complete word without final consonant' : `compound-vowel carrier ${targetSymbol}`,
      screen:audioType === 'word' ? '无收音真实词汇' : '复合元音承载音节', teachingGoal:audioType === 'word' ? `完整单词“${speechText}”` : `用完整音节教学复合元音 ${targetSymbol}`,
      assetStatus:'missing', reviewNotes:'Not generated; Korean native-speaker review required.'
    })))
  });

  Object.freeze(lessons);

  const APPROVED_ASSET_HASHES = Object.freeze({
    'lesson-00:yo':'d2570041a865d0d686e6debf1a06584fa10b1177ebb590e4654a30506f5538b0',
    'lesson-00:yu':'3eb015cd5a7a9c7955976e1d0acd6669126e7c5c74a1c928f7d7b9d925d98430',
    'k0-consonant-contrast:ga':'705fc26ec549f1882f06eaeb997ba59f0ceef95e8c9603e5a7a82b35451205a9',
    'k0-consonant-contrast:ka':'7a4754d8c2583d1941a8f2d18bfd41239e4e753726af880fc3c0ea7dd2c697ed',
    'k0-consonant-contrast:kka':'c63080ad2e208b9f9319b806d2470143b7a2140cba4768c0cc61947cccf9e545',
    'k0-consonant-contrast:da':BATCH_02B_SOURCE.da[0],
    'k0-consonant-contrast:ta':BATCH_02B_SOURCE.ta[0],
    'k0-consonant-contrast:tta':BATCH_02B_SOURCE.tta[0],
    'k0-consonant-contrast:ba':BATCH_02B_SOURCE.ba[0],
    'k0-consonant-contrast:pa':BATCH_02B_SOURCE.pa[0],
    'k0-consonant-contrast:ppa':BATCH_02B_SOURCE.ppa[0],
    'k0-consonant-contrast:ja':BATCH_02B_SOURCE.ja[0],
    'k0-consonant-contrast:cha':BATCH_02B_SOURCE.cha[0],
    'k0-consonant-contrast:jja':BATCH_02B_SOURCE.jja[0],
    'k0-consonant-contrast:sa':BATCH_02B_SOURCE.sa[0],
    'k0-consonant-contrast:ssa':BATCH_02B_SOURCE.ssa[0],
    'lesson-00:ha':BATCH_02B_SOURCE.ha[0],
    'lesson-05:geu':BATCH_02B_SOURCE.geu[0],
    ...Object.fromEntries(Object.entries(REVIEWED_EXISTING_ASSETS).map(([recordId,source]) => [recordId,source[0]]))
  });
  const REQUIRED_RELEASE_FIELDS = ['voiceSource','model','voice','generationDate','commercialUseBasis','rightsReviewStatus','reviewMethod','reviewedAt','nativeReviewStatus','technicalValidation','sha256','sourceRunId','sourceArtifact','reviewNotes'];
  function canPlayAudio(requestedSpeechText, entry, expectedAudioType) {
    if (!entry || entry.reviewStatus !== 'approved' || entry.assetStatus !== 'available') return false;
    if (!entry.file || entry.speechText !== requestedSpeechText) return false;
    if (expectedAudioType && entry.audioType !== expectedAudioType) return false;
    if (entry.type === 'deprecated' || entry.assetStatus === 'deprecated') return false;
    if (!REQUIRED_RELEASE_FIELDS.every(field => entry[field] !== null && String(entry[field]).trim() !== '')) return false;
    if (entry.technicalValidation !== 'passed' || !/^[a-f0-9]{64}$/u.test(entry.sha256)) return false;
    if (APPROVED_ASSET_HASHES[`${entry.lessonId}:${entry.id}`] !== entry.sha256) return false;
    if (entry.nativeReviewStatus === 'deferred' && entry.nativeReviewer !== null) return false;
    if (entry.nativeReviewStatus !== 'deferred' && !String(entry.nativeReviewer || '').trim()) return false;
    return true;
  }

  function forLesson(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return { items: [], audioFiles: {}, pronunciationText: {} };
    const audioFiles = {};
    const pronunciationText = {};
    lesson.items.filter(entry => canPlayAudio(entry.speechText, entry)).forEach(entry => {
      audioFiles[entry.speechText] = `audio/${lessonId}/${entry.file}`;
      pronunciationText[entry.speechText] = entry.speechText;
    });
    return {
      items: lesson.items,
      audioFiles: Object.freeze(audioFiles),
      pronunciationText: Object.freeze(pronunciationText)
    };
  }

  function findSpeech(speechText, expectedAudioType, requestedLessonId) {
    for (const [lessonId, lesson] of Object.entries(lessons)) {
      if (requestedLessonId && requestedLessonId !== lessonId) continue;
      const typed = lesson.items.find(candidate => candidate.speechText === speechText && (!expectedAudioType || candidate.audioType === expectedAudioType));
      if (typed) return Object.freeze({ ...typed, lessonId, path: `audio/${lessonId}/${typed.file}` });
    }
    return null;
  }

  function forSpeechTexts(speechTexts) {
    const items = [];
    const audioFiles = {};
    const pronunciationText = {};
    [...new Set(speechTexts || [])].forEach(speechText => {
      const entry = findSpeech(speechText);
      if (!entry) return;
      items.push(entry);
      audioFiles[speechText] = entry.path;
      pronunciationText[speechText] = speechText;
    });
    return {
      items: Object.freeze(items),
      audioFiles: Object.freeze(audioFiles),
      pronunciationText: Object.freeze(pronunciationText)
    };
  }

  function resolve(requestedSpeechText, expectedAudioType, lessonId) {
    const entry = findSpeech(requestedSpeechText, expectedAudioType, lessonId);
    return Object.freeze({ entry, playable:canPlayAudio(requestedSpeechText, entry, expectedAudioType), path:entry?.path || null });
  }

  global.NikigoAudio = Object.freeze({ lessons, approvedAssetHashes:APPROVED_ASSET_HASHES, forLesson, findSpeech, forSpeechTexts, canPlayAudio, resolve });
})(typeof window === 'undefined' ? globalThis : window);
