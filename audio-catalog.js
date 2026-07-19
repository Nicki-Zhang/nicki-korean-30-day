(function (global) {
  'use strict';

  const RIGHTS_TEMPLATE = Object.freeze({
    voiceTalent: null,
    consentRecord: null,
    commercialUseRecord: null
  });

  const item = (id, displayText, speechText, file, options) => Object.freeze({
    id,
    displayText,
    speechText,
    expectedPronunciation: options.expectedPronunciation || speechText,
    pronunciationRule: options.pronunciationRule || '',
    type: options.type,
    pronunciationType: options.pronunciationType,
    screen: options.screen,
    teachingGoal: options.teachingGoal,
    file,
    voiceSource: options.voiceSource || 'openai-gpt-4o-mini-tts',
    reviewStatus: 'pending',
    needsNativeReview: true,
    rights: RIGHTS_TEMPLATE
  });

  const lessons = Object.freeze({
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
  });

  function forLesson(lessonId) {
    const lesson = lessons[lessonId];
    if (!lesson) return { items: [], audioFiles: {}, pronunciationText: {} };
    const audioFiles = {};
    const pronunciationText = {};
    lesson.items.forEach(entry => {
      audioFiles[entry.speechText] = `audio/${lessonId}/${entry.file}`;
      pronunciationText[entry.speechText] = entry.speechText;
    });
    return {
      items: lesson.items,
      audioFiles: Object.freeze(audioFiles),
      pronunciationText: Object.freeze(pronunciationText)
    };
  }

  global.NikigoAudio = Object.freeze({ lessons, forLesson });
})(typeof window === 'undefined' ? globalThis : window);
