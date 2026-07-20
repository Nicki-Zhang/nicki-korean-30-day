(function (global) {
  'use strict';

  const RIGHTS_TEMPLATE = Object.freeze({
    voiceTalent: null,
    consentRecord: null,
    commercialUseRecord: null
  });

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
    })
  };

  Object.entries(lessons).forEach(([lessonId, lesson]) => {
    lessons[lessonId] = Object.freeze({ ...lesson, items:Object.freeze(lesson.items.map(entry => Object.freeze({ ...entry, lessonId }))) });
  });

  const contrastSpecs = [
    ['ga','ㄱ','plain','가'],['ka','ㅋ','aspirated','카'],['kka','ㄲ','tense','까'],
    ['da','ㄷ','plain','다'],['ta','ㅌ','aspirated','타'],['tta','ㄸ','tense','따'],
    ['ba','ㅂ','plain','바'],['pa','ㅍ','aspirated','파'],['ppa','ㅃ','tense','빠'],
    ['ja','ㅈ','plain','자'],['cha','ㅊ','aspirated','차'],['jja','ㅉ','tense','짜'],
    ['sa','ㅅ','plain','사'],['ssa','ㅆ','tense','싸']
  ];
  lessons['k0-consonant-contrast'] = Object.freeze({
    title:'听懂普通音、送气音和紧音',
    items:Object.freeze(contrastSpecs.map(([id, targetSymbol, category, syllable]) => item(id, syllable, syllable, `${id}.mp3`, {
      lessonId:'k0-consonant-contrast', targetSymbol, audioType:'initial-example', pronunciationType:'full-syllable',
      pronunciationRule:`${category} onset in a complete syllable`, screen:'对比卡片、听辨练习', teachingGoal:'通过完整音节比较普通音、送气音和紧音',
      voiceSource:'openai-gpt-4o-mini-tts', assetStatus:'missing', reviewNotes:'Not generated; Korean native-speaker review required.'
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
    'lesson-00:yu':'3eb015cd5a7a9c7955976e1d0acd6669126e7c5c74a1c928f7d7b9d925d98430'
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
