(function (global) {
  'use strict';

  const pending = { reviewStatus: 'pending' };
  const vowel = (symbol, vowelCarrierSyllable, soundHint, mouthHintKey, vowelAudio = null, category = 'basic-vowel') => Object.freeze({
    symbol,
    type: 'vowel',
    category,
    letterName: null,
    letterNameAudio: null,
    vowelCarrierSyllable,
    vowelAudio,
    demoSyllable: null,
    demoAudio: null,
    finalExample: null,
    finalExampleAudio: null,
    audioType: 'vowel-sound',
    soundObjects: Object.freeze([{ audioType:'vowel-sound', speechText:vowelCarrierSyllable, file:vowelAudio }]),
    soundHint,
    mouthHintKey,
    ...pending
  });
  const consonant = (symbol, category, letterName, demoSyllable, soundHint, demoAudio = null, contrastGroup = null) => Object.freeze({
    symbol,
    type: 'consonant',
    category,
    letterName,
    letterNameAudio: null,
    vowelCarrierSyllable: null,
    vowelAudio: null,
    demoSyllable,
    demoAudio,
    finalExample: null,
    finalExampleAudio: null,
    audioType: 'onset-example',
    soundObjects: Object.freeze([
      { audioType:'letter-name', speechText:letterName, file:null },
      { audioType:'onset-example', speechText:demoSyllable, file:demoAudio }
    ]),
    soundHint,
    contrastGroup,
    ...pending
  });

  const vowels = [
    vowel('ㅏ', '아', '[a]', 'a', 'audio/lesson-01/a.mp3'),
    vowel('ㅑ', '야', '[ja]', 'ya', 'audio/lesson-03/ya.mp3'),
    vowel('ㅓ', '어', '[ʌ]', 'eo', 'audio/lesson-01/eo.mp3'),
    vowel('ㅕ', '여', '[jʌ]', 'yeo', 'audio/lesson-03/yeo.mp3'),
    vowel('ㅗ', '오', '[o]', 'o', 'audio/lesson-01/o.mp3'),
    vowel('ㅛ', '요', '[jo]', 'yo'),
    vowel('ㅜ', '우', '[u]', 'u', 'audio/lesson-01/u.mp3'),
    vowel('ㅠ', '유', '[ju]', 'yu'),
    vowel('ㅡ', '으', '[ɯ]', 'eu', 'audio/lesson-02/eu.mp3'),
    vowel('ㅣ', '이', '[i]', 'i', 'audio/lesson-02/i.mp3'),
    vowel('ㅐ', '애', '[ɛ~e]', 'ae', 'audio/lesson-02/ae.mp3', 'compound-vowel'),
    vowel('ㅒ', '얘', '[jɛ~je]', 'yae', null, 'compound-vowel'),
    vowel('ㅔ', '에', '[e]', 'e', 'audio/lesson-02/e.mp3', 'compound-vowel'),
    vowel('ㅖ', '예', '[je]', 'ye', null, 'compound-vowel'),
    vowel('ㅘ', '와', '[wa]', 'wa', null, 'compound-vowel'),
    vowel('ㅙ', '왜', '[wɛ~we]', 'wae', null, 'compound-vowel'),
    vowel('ㅚ', '외', '[we~ø]', 'oe', null, 'compound-vowel'),
    vowel('ㅝ', '워', '[wʌ]', 'wo', null, 'compound-vowel'),
    vowel('ㅞ', '웨', '[we]', 'we', null, 'compound-vowel'),
    vowel('ㅟ', '위', '[wi~y]', 'wi', null, 'compound-vowel'),
    vowel('ㅢ', '의', '[ɯi]', 'ui', null, 'compound-vowel')
  ];

  const consonants = [
    consonant('ㄱ', 'basic-consonant', '기역', '가', '[k~g]', 'audio/lesson-01/ga.mp3', '가 / 카 / 까'),
    consonant('ㄴ', 'basic-consonant', '니은', '나', '[n]', 'audio/lesson-01/na.mp3'),
    consonant('ㄷ', 'basic-consonant', '디귿', '다', '[t~d]', 'audio/lesson-02/da.mp3', '다 / 타 / 따'),
    consonant('ㄹ', 'basic-consonant', '리을', '라', '[ɾ~l]', 'audio/lesson-02/ra.mp3'),
    consonant('ㅁ', 'basic-consonant', '미음', '마', '[m]', 'audio/lesson-02/ma.mp3'),
    consonant('ㅂ', 'basic-consonant', '비읍', '바', '[p~b]', 'audio/lesson-03/ba.mp3', '바 / 파 / 빠'),
    consonant('ㅅ', 'basic-consonant', '시옷', '사', '[s]', 'audio/lesson-03/sa.mp3'),
    consonant('ㅇ', 'basic-consonant', '이응', '아', '[∅/ŋ]', 'audio/lesson-03/a.mp3'),
    consonant('ㅈ', 'basic-consonant', '지읒', '자', '[tɕ~dʑ]', null, '자 / 차 / 짜'),
    consonant('ㅎ', 'basic-consonant', '히읗', '하', '[h]'),
    consonant('ㅋ', 'aspirated', '키읔', '카', '[kʰ]', null, '가 / 카 / 까'),
    consonant('ㅌ', 'aspirated', '티읕', '타', '[tʰ]', null, '다 / 타 / 따'),
    consonant('ㅍ', 'aspirated', '피읖', '파', '[pʰ]', null, '바 / 파 / 빠'),
    consonant('ㅊ', 'aspirated', '치읓', '차', '[tɕʰ]', null, '자 / 차 / 짜'),
    consonant('ㄲ', 'tense', '쌍기역', '까', '[k͈]', null, '가 / 카 / 까'),
    consonant('ㄸ', 'tense', '쌍디귿', '따', '[t͈]', null, '다 / 타 / 따'),
    consonant('ㅃ', 'tense', '쌍비읍', '빠', '[p͈]', null, '바 / 파 / 빠'),
    consonant('ㅆ', 'tense', '쌍시옷', '싸', '[s͈]'),
    consonant('ㅉ', 'tense', '쌍지읒', '짜', '[tɕ͈]', null, '자 / 차 / 짜')
  ];

  const items = Object.freeze([...consonants, ...vowels]);
  const bySymbol = Object.freeze(Object.fromEntries(items.map(item => [item.symbol, item])));
  const select = symbols => symbols.map(symbol => ({ ...bySymbol[symbol] }));

  global.NikigoHangulSoundData = Object.freeze({
    items,
    vowels: Object.freeze(vowels),
    consonants: Object.freeze(consonants),
    bySymbol,
    select
  });
})(window);
