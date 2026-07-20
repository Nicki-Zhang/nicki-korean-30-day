(function (global) {
  'use strict';

  const SUPPORTED = ['zh', 'en', 'vi', 'ja'];
  const COPY = Object.freeze({
    zh: { lessonName:'第0课 · 韩文字母地图',eyebrow:'K0 · 3分钟全局认识',title:'先认识韩文字母地图',description:'韩语由辅音、元音和音节块组成。你不需要现在记住所有字母，Nikigo会带你分阶段学习。',previewInstruction:'点击任意字母可试听。这里用于认识韩文字母全貌，不需要现在记住所有字母，后续课程会分阶段练习。',basicConsonantsTitle:'基础辅音',aspiratedTitle:'送气音',tenseTitle:'紧音',basicVowelsTitle:'基础元音',compoundVowelsTitle:'复合元音',soundRule:'💡 辅音通常不能脱离元音自然发音，因此后续课程会通过完整音节和真实单词学习。',startTitle:'选择适合你的起点',startLead:'这不是考试，只用于安排下一步；不要求听完40个字母。',beginnerTitle:'我从零开始',beginnerDescription:'从第1课的核心元音开始。',partialTitle:'我认识一些字母',partialDescription:'进入现有诊断流程；字母专项检查仍在开发。',readerTitle:'我已经能拼读韩文',readerDescription:'返回课程主页；第9课起的场景课程在测试版中尚未开放。',savedBeginner:'已保存：从零开始，正在进入第1课…',savedPartial:'已保存：认识一些字母，正在进入字母检查…',savedReader:'已保存：已经能拼读。测试版场景课程尚未开放，正在返回课程主页…',back:'← 返回课程主页',home:'返回学习主页',viewDetails:'查看字母{symbol}详情',vowel:'元音',consonant:'辅音',pronunciationExample:'元音声音',carrierSyllable:'对应承载音节',mouthTip:'口型提示',letterName:'字母名称',exampleCombination:'示例组合',listenVowel:'听元音{symbol}',listenLetterName:'听字母名称 {name}',listenDemo:'听示例音节 {syllable}',vowelPending:'元音音频待补充',letterNamePending:'字母名称音频待补充',demoPending:'示例音节音频待补充',vowelCarrierRule:'元音书写成独立音节时需要加ㅇ；这里的ㅇ不发音，实际听到的是元音本身。',silentIeung:'ㅇ在아中作为初声不发音。',consonantRule:'辅音不能脱离元音自然发音，需要与元音组合后学习实际声音。',approximateHint:'近似提示：{hint}',romanNote:'罗马音仅帮助初步理解，实际发音请以韩语音频和口型说明为准。',contrast:'优先对比：{group}'},
    en: { lessonName:'Lesson 0 · Hangul Map',eyebrow:'K0 · 3-MINUTE ORIENTATION',title:'Meet the Hangul Map First',description:'Korean is built from consonants, vowels and syllable blocks. You do not need to memorize every letter now—Nikigo will guide you in stages.',previewInstruction:'Tap any letter for a preview. This map introduces the whole Hangul system; you do not need to memorize it now because later lessons practice it in stages.',basicConsonantsTitle:'Basic consonants',aspiratedTitle:'Aspirated consonants',tenseTitle:'Tense consonants',basicVowelsTitle:'Basic vowels',compoundVowelsTitle:'Compound vowels',soundRule:'💡 Consonants usually cannot be pronounced naturally without a vowel, so later lessons teach them through complete syllables and real words.',startTitle:'Choose your starting point',startLead:'This is not a test and you do not need to hear all 40 letters.',beginnerTitle:'I am starting from zero',beginnerDescription:'Begin with core vowels in Lesson 1.',partialTitle:'I recognize some letters',partialDescription:'Continue to the existing check; a Hangul-specific check is still in development.',readerTitle:'I can already decode Hangul',readerDescription:'Return to Courses; scenario lessons from Lesson 9 are not yet open in this test build.',savedBeginner:'Saved: starting from zero. Opening Lesson 1…',savedPartial:'Saved: some letter knowledge. Opening the letter check…',savedReader:'Saved: able to decode Hangul. Scenario lessons are not yet open; returning to Courses…',back:'← Return to Courses',home:'Return to learning home',viewDetails:'View details for {symbol}',vowel:'Vowel',consonant:'Consonant',pronunciationExample:'Pronunciation example',mouthTip:'Mouth tip',letterName:'Letter name',exampleCombination:'Example combination',listenVowel:'Listen to vowel {symbol}, example syllable {example}',listenLetterName:'Listen to letter name {name}',listenDemo:'Listen to example syllable {syllable}',vowelPending:'Vowel example audio pending',letterNamePending:'Letter-name audio pending',demoPending:'Example-syllable audio pending',consonantRule:'A consonant needs to combine with a vowel to be pronounced naturally.',approximateHint:'Approximate hint: {hint}',romanNote:'Romanization is only an initial aid. Follow the Korean audio and mouth guidance for the actual pronunciation.',contrast:'Priority contrast: {group}'},
    vi: { lessonName:'Bài 0 · Bản đồ Hangul',eyebrow:'K0 · LÀM QUEN TRONG 3 PHÚT',title:'Làm quen bản đồ chữ Hangul',description:'Tiếng Hàn được tạo từ phụ âm, nguyên âm và khối âm tiết. Bạn không cần nhớ tất cả chữ cái ngay bây giờ; Nikigo sẽ hướng dẫn theo từng giai đoạn.',previewInstruction:'Chạm vào bất kỳ chữ cái nào để xem và nghe thử. Bản đồ này chỉ giới thiệu toàn bộ Hangul; bạn chưa cần nhớ hết vì các bài sau sẽ luyện theo từng giai đoạn.',basicConsonantsTitle:'Phụ âm cơ bản',aspiratedTitle:'Phụ âm bật hơi',tenseTitle:'Phụ âm căng',basicVowelsTitle:'Nguyên âm cơ bản',compoundVowelsTitle:'Nguyên âm ghép',soundRule:'💡 Phụ âm thường không thể phát âm tự nhiên nếu tách khỏi nguyên âm, nên các bài sau sẽ dạy qua âm tiết đầy đủ và từ thật.',startTitle:'Chọn điểm bắt đầu',startLead:'Đây không phải bài kiểm tra và bạn không cần nghe đủ 40 chữ.',beginnerTitle:'Tôi bắt đầu từ số 0',beginnerDescription:'Bắt đầu với nguyên âm cốt lõi ở Bài 1.',partialTitle:'Tôi biết một số chữ cái',partialDescription:'Chuyển đến quy trình đánh giá hiện có; bài kiểm tra Hangul riêng vẫn đang phát triển.',readerTitle:'Tôi đã có thể ghép đọc Hangul',readerDescription:'Trở về trang Bài học; các bài tình huống từ Bài 9 chưa mở trong bản thử nghiệm.',savedBeginner:'Đã lưu: bắt đầu từ số 0. Đang mở Bài 1…',savedPartial:'Đã lưu: biết một số chữ cái. Đang mở phần kiểm tra…',savedReader:'Đã lưu: có thể ghép đọc Hangul. Bài tình huống chưa mở; đang trở về trang Bài học…',back:'← Trở về Bài học',home:'Về trang học tập',viewDetails:'Xem chi tiết chữ {symbol}',vowel:'Nguyên âm',consonant:'Phụ âm',pronunciationExample:'Ví dụ phát âm',mouthTip:'Gợi ý khẩu hình',letterName:'Tên chữ cái',exampleCombination:'Ghép ví dụ',listenVowel:'Nghe nguyên âm {symbol}, âm tiết ví dụ {example}',listenLetterName:'Nghe tên chữ {name}',listenDemo:'Nghe âm tiết ví dụ {syllable}',vowelPending:'Âm thanh nguyên âm đang chờ bổ sung',letterNamePending:'Âm thanh tên chữ đang chờ bổ sung',demoPending:'Âm thanh âm tiết đang chờ bổ sung',consonantRule:'Phụ âm cần kết hợp với nguyên âm để có thể phát âm tự nhiên.',approximateHint:'Gợi ý gần đúng: {hint}',romanNote:'Phiên âm Latin chỉ giúp hiểu ban đầu. Hãy theo âm thanh tiếng Hàn và hướng dẫn khẩu hình để phát âm thực tế.',contrast:'Ưu tiên đối chiếu: {group}'},
    ja: { lessonName:'第0課 · ハングルマップ',eyebrow:'K0 · 3分で全体を知る',title:'まずハングルの全体図を知ろう',description:'韓国語は子音・母音・音節ブロックでできています。今すべての文字を覚える必要はありません。Nikigoが段階的に案内します。',previewInstruction:'好きな文字をタップして試聴できます。ここではハングル全体を知るだけで、今すべてを覚える必要はありません。後の課で段階的に練習します。',basicConsonantsTitle:'基本子音',aspiratedTitle:'激音',tenseTitle:'濃音',basicVowelsTitle:'基本母音',compoundVowelsTitle:'複合母音',soundRule:'💡 子音は通常、母音から離して自然に発音できません。そのため後のレッスンでは、完全な音節と実際の単語を使って学びます。',startTitle:'開始地点を選ぶ',startLead:'テストではなく、40文字すべてを聞く必要もありません。',beginnerTitle:'ゼロから始める',beginnerDescription:'第1課の基本母音から始めます。',partialTitle:'いくつかの文字を知っている',partialDescription:'既存のチェックへ進みます。ハングル専用チェックは開発中です。',readerTitle:'すでにハングルを読める',readerDescription:'コース画面へ戻ります。第9課以降の場面レッスンはテスト版では未公開です。',savedBeginner:'保存しました：ゼロから開始。第1課を開きます…',savedPartial:'保存しました：いくつかの文字を知っています。チェックを開きます…',savedReader:'保存しました：ハングルを読めます。場面レッスンは未公開のため、コース画面へ戻ります…',back:'← コースへ戻る',home:'学習ホームへ戻る',viewDetails:'文字{symbol}の詳細を見る',vowel:'母音',consonant:'子音',pronunciationExample:'発音例',mouthTip:'口の形のヒント',letterName:'文字の名前',exampleCombination:'組み合わせ例',listenVowel:'母音{symbol}、例の音節{example}を聞く',listenLetterName:'文字名{name}を聞く',listenDemo:'例の音節{syllable}を聞く',vowelPending:'母音例の音声は追加予定',letterNamePending:'文字名音声は追加予定',demoPending:'例の音節音声は追加予定',consonantRule:'子音は母音と組み合わせて初めて自然に発音できます。',approximateHint:'近似ヒント：{hint}',romanNote:'ローマ字は最初の理解を助ける目安です。実際の発音は韓国語音声と口の形の説明を基準にしてください。',contrast:'優先比較：{group}'}
  });
  Object.assign(COPY.en,{pronunciationExample:'Vowel sound',carrierSyllable:'Carrier syllable',listenVowel:'Listen to vowel {symbol}',listenLetterName:'Listen to letter name {name}',vowelPending:'Vowel audio pending',letterNamePending:'Letter-name audio pending',vowelCarrierRule:'When a vowel is written as an independent syllable, it takes ㅇ. Here ㅇ is silent, so what you hear is the vowel itself.',silentIeung:'In 아, ㅇ is silent in the onset position.',consonantRule:'A consonant cannot be pronounced naturally on its own; learn its actual sound by combining it with a vowel.'});
  Object.assign(COPY.vi,{pronunciationExample:'Âm nguyên âm',carrierSyllable:'Âm tiết mang',listenVowel:'Nghe nguyên âm {symbol}',listenLetterName:'Nghe tên chữ cái {name}',vowelPending:'Âm thanh nguyên âm đang chờ bổ sung',letterNamePending:'Âm thanh tên chữ cái đang chờ bổ sung',vowelCarrierRule:'Khi viết nguyên âm thành âm tiết độc lập cần thêm ㅇ. Ở đây ㅇ câm, nên âm bạn nghe chính là nguyên âm.',silentIeung:'Trong 아, ㅇ ở vị trí đầu âm tiết không phát âm.',consonantRule:'Phụ âm không thể phát âm tự nhiên khi đứng một mình; hãy học âm thực tế bằng cách ghép với nguyên âm.'});
  Object.assign(COPY.ja,{pronunciationExample:'母音の音',carrierSyllable:'母音を載せる音節',listenVowel:'母音{symbol}を聞く',listenLetterName:'文字の名前{name}を聞く',vowelPending:'母音音声は追加予定',letterNamePending:'文字名音声は追加予定',vowelCarrierRule:'母音を独立した音節として書くときはㅇを加えます。ここでㅇは無音なので、実際に聞こえるのは母音そのものです。',silentIeung:'아では、音節頭のㅇは発音しません。',consonantRule:'子音は単独では自然に発音できません。母音と組み合わせて実際の音を学びます。'});
  Object.assign(COPY.zh,{audioNotReleased:'音频尚未发布',audioError:'音频暂时无法播放，请重试',audioPlaying:'正在播放',audioReplay:'再次播放'});
  Object.assign(COPY.en,{audioNotReleased:'Audio not released yet',audioError:'Audio is temporarily unavailable. Try again.',audioPlaying:'Playing',audioReplay:'Play again'});
  Object.assign(COPY.vi,{audioNotReleased:'Âm thanh chưa được phát hành',audioError:'Tạm thời không thể phát âm thanh. Hãy thử lại.',audioPlaying:'Đang phát',audioReplay:'Phát lại'});
  Object.assign(COPY.ja,{audioNotReleased:'音声はまだ公開されていません',audioError:'音声を一時的に再生できません。もう一度お試しください。',audioPlaying:'再生中',audioReplay:'もう一度再生'});

  const MOUTH_HINTS = Object.freeze({
    zh:{a:'嘴巴自然张开，舌头放松。',ya:'先带轻微 y 滑音，再进入ㅏ的张口位置。',eo:'嘴唇不圆，舌头放松，声音比ㅗ更开放。',yeo:'先带轻微 y 滑音，再进入ㅓ。',o:'嘴唇收圆并稍微向前。',yo:'先带轻微 y 滑音，保持ㅗ的圆唇。',u:'嘴唇收圆，舌位比ㅗ更高、更靠后。',yu:'先带轻微 y 滑音，保持ㅜ的圆唇。',eu:'嘴唇自然展开，舌头后部抬起。',i:'嘴角稍向两侧，舌位高且靠前。',ae:'嘴巴略张，现代首尔音常接近ㅔ。',yae:'先带 y 滑音，再进入ㅐ。',e:'嘴角稍展开，舌位靠前。',ye:'先带 y 滑音，再进入ㅔ。',wa:'先圆唇发ㅗ，迅速滑向ㅏ。',wae:'先圆唇，再滑向ㅐ。',oe:'圆唇起始，现代发音常接近“we”。',wo:'先发ㅜ的圆唇，再滑向ㅓ。',we:'先发ㅜ的圆唇，再滑向ㅔ。',wi:'圆唇起始，再滑向ㅣ。',ui:'先保持ㅡ的平唇舌位，再滑向ㅣ。'},
    en:{a:'Open the mouth naturally and relax the tongue.',ya:'Begin with a light y glide, then open into ㅏ.',eo:'Keep the lips unrounded and the tongue relaxed; it is more open than ㅗ.',yeo:'Begin with a light y glide, then move into ㅓ.',o:'Round the lips and move them slightly forward.',yo:'Add a light y glide while keeping the rounded ㅗ shape.',u:'Round the lips; the tongue is higher and farther back than for ㅗ.',yu:'Add a light y glide while keeping the rounded ㅜ shape.',eu:'Keep the lips spread naturally and raise the back of the tongue.',i:'Spread the corners slightly; keep the tongue high and forward.',ae:'Open slightly; in modern Seoul speech it is often close to ㅔ.',yae:'Begin with a y glide, then move into ㅐ.',e:'Spread the lips slightly and keep the tongue forward.',ye:'Begin with a y glide, then move into ㅔ.',wa:'Start with rounded ㅗ and glide quickly into ㅏ.',wae:'Start rounded, then glide into ㅐ.',oe:'Start rounded; modern pronunciation is often close to “we”.',wo:'Start with rounded ㅜ and glide into ㅓ.',we:'Start with rounded ㅜ and glide into ㅔ.',wi:'Start rounded and glide into ㅣ.',ui:'Begin with the flat-lipped ㅡ position, then glide into ㅣ.'},
    vi:{a:'Mở miệng tự nhiên và thả lỏng lưỡi.',ya:'Bắt đầu bằng âm lướt y nhẹ rồi mở sang ㅏ.',eo:'Không tròn môi, thả lỏng lưỡi; âm mở hơn ㅗ.',yeo:'Bắt đầu bằng âm lướt y nhẹ rồi chuyển sang ㅓ.',o:'Tròn môi và hơi đưa môi ra trước.',yo:'Thêm âm lướt y nhẹ, giữ khẩu hình tròn của ㅗ.',u:'Tròn môi; lưỡi cao và lùi hơn so với ㅗ.',yu:'Thêm âm lướt y nhẹ, giữ khẩu hình tròn của ㅜ.',eu:'Môi để tự nhiên, nâng phần sau của lưỡi.',i:'Kéo nhẹ khóe môi, lưỡi cao và hướng trước.',ae:'Mở miệng nhẹ; trong tiếng Seoul hiện đại thường gần ㅔ.',yae:'Bắt đầu bằng âm lướt y rồi chuyển sang ㅐ.',e:'Kéo nhẹ môi sang hai bên, lưỡi hướng trước.',ye:'Bắt đầu bằng âm lướt y rồi chuyển sang ㅔ.',wa:'Bắt đầu với môi tròn của ㅗ rồi lướt nhanh sang ㅏ.',wae:'Bắt đầu tròn môi rồi lướt sang ㅐ.',oe:'Bắt đầu tròn môi; phát âm hiện đại thường gần “we”.',wo:'Bắt đầu với môi tròn của ㅜ rồi lướt sang ㅓ.',we:'Bắt đầu với môi tròn của ㅜ rồi lướt sang ㅔ.',wi:'Bắt đầu tròn môi rồi lướt sang ㅣ.',ui:'Bắt đầu ở vị trí môi ngang của ㅡ rồi lướt sang ㅣ.'},
    ja:{a:'口を自然に開き、舌をリラックスさせます。',ya:'軽いyの滑り音から始め、ㅏの口の形へ移ります。',eo:'唇を丸めず、舌をリラックスさせ、ㅗより開いた音にします。',yeo:'軽いyの滑り音からㅓへ移ります。',o:'唇を丸め、少し前へ出します。',yo:'軽いyの滑り音を加え、ㅗの丸い唇を保ちます。',u:'唇を丸め、ㅗより舌を高く奥に置きます。',yu:'軽いyの滑り音を加え、ㅜの丸い唇を保ちます。',eu:'唇は自然に横へ、舌の奥を持ち上げます。',i:'口角を少し横へ、舌を高く前に置きます。',ae:'口を少し開き、現代ソウル音ではㅔに近いことがあります。',yae:'yの滑り音からㅐへ移ります。',e:'唇を少し横へ、舌を前に置きます。',ye:'yの滑り音からㅔへ移ります。',wa:'丸いㅗから素早くㅏへ滑らせます。',wae:'丸い唇からㅐへ滑らせます。',oe:'丸い唇から始め、現代音では「we」に近いことがあります。',wo:'丸いㅜからㅓへ滑らせます。',we:'丸いㅜからㅔへ滑らせます。',wi:'丸い唇からㅣへ滑らせます。',ui:'平たい唇のㅡからㅣへ滑らせます。'}
  });

  function normalizeLanguage(value) {
    const normalized = String(value || '').toLowerCase();
    if (SUPPORTED.includes(normalized)) return normalized;
    if (normalized.startsWith('zh')) return 'zh';
    if (normalized.startsWith('vi')) return 'vi';
    if (normalized.startsWith('ja')) return 'ja';
    return 'en';
  }

  function routeFor(level, language) {
    const suffix = `?lang=${SUPPORTED.includes(language) ? language : 'en'}`;
    if (level === 'beginner') return `lesson-01.html${suffix}`;
    if (level === 'partial') return `diagnostic.html${suffix}`;
    return `nikigo-app.html${suffix}#courses`;
  }

  function choicePatch(profile, level) {
    const completed = new Set(profile.completedLessons || []);
    completed.add('lesson-00');
    const recommendations = { beginner:'lesson-01', partial:'alphabet-check', reader:'scenario-coming-soon' };
    return { ...profile, path:profile.path || 'K0', hangulLevel:level, hangulRecommendation:recommendations[level], completedLessons:[...completed], lessonProgress:{ ...(profile.lessonProgress || {}), 'lesson-00':100 } };
  }

  function initialize() {
    const profile = global.NikigoState.get();
    const query = new URLSearchParams(global.location.search).get('lang');
    let language = SUPPORTED.includes(query) ? query : (SUPPORTED.includes(profile.interfaceLanguage) ? profile.interfaceLanguage : normalizeLanguage(global.navigator?.language));
    let selectedSymbol = '';
    let currentAudio = null;
    let playingAudioKey = '';
    let playbackToken = 0;
    const playedAudioKeys = new Set();
    const byId = id => global.document.getElementById(id);
    const keys = ['lessonName','eyebrow','title','description','previewInstruction','basicConsonantsTitle','aspiratedTitle','tenseTitle','basicVowelsTitle','compoundVowelsTitle','soundRule','startTitle','startLead','beginnerTitle','beginnerDescription','partialTitle','partialDescription','readerTitle','readerDescription','back'];
    const text = (key, values = {}) => Object.entries(values).reduce((value, [name, replacement]) => value.replaceAll(`{${name}}`, replacement), COPY[language][key] || COPY.en[key] || key);
    const audioResolution = (item, action) => {
      const speechText = action === 'vowel' ? item.vowelCarrierSyllable : action === 'letter-name' ? item.letterName : item.demoSyllable;
      const audioType = action === 'vowel' ? 'vowel' : action === 'letter-name' ? 'letter-name' : 'initial-example';
      return global.NikigoAudio.resolve(speechText, audioType);
    };

    function renderLetters() {
      global.document.querySelectorAll('[data-category]').forEach(container => {
        const items = global.NikigoHangulSoundData.items.filter(item => item.category === container.dataset.category);
        container.innerHTML = items.map(item => `<button type="button" class="letterButton ${selectedSymbol === item.symbol ? 'selected' : ''}" data-symbol="${item.symbol}" aria-label="${text('viewDetails',{symbol:item.symbol})}" aria-pressed="${selectedSymbol === item.symbol}">${item.symbol}</button>`).join('');
      });
    }

    function audioButton({ available, action, label, pending }) {
      const audioKey = `${selectedSymbol}:${action}`;
      const isPlaying = playingAudioKey === audioKey;
      const buttonText = !available
        ? pending
        : isPlaying
          ? text('audioPlaying')
          : playedAudioKeys.has(audioKey)
            ? `↻ ${text('audioReplay')}`
            : `▶ ${label}`;
      return `<button type="button" class="detailAudio ${isPlaying ? 'playing' : ''}" data-audio-action="${action}" aria-label="${buttonText}" ${available ? '' : 'disabled aria-disabled="true"'}>${buttonText}</button>`;
    }

    function renderDetail() {
      const detail = byId('letterDetail');
      const item = global.NikigoHangulSoundData.bySymbol[selectedSymbol];
      if (!item) { detail.classList.remove('show'); detail.innerHTML = ''; return; }
      const hint = text('approximateHint',{hint:item.soundHint});
      if (item.type === 'vowel') {
        detail.innerHTML = `<div class="detailHeader"><div><span class="detailType">${text('vowel')}</span><div class="detailSymbol">${item.symbol}</div></div></div><div class="detailGrid"><div class="detailBlock"><small>${text('pronunciationExample')}</small><strong>${item.symbol}</strong><small>${text('carrierSyllable')}</small><strong>${item.vowelCarrierSyllable}</strong><div class="detailActions">${audioButton({available:audioResolution(item,'vowel').playable,action:'vowel',label:text('listenVowel',{symbol:item.symbol}),pending:text('audioNotReleased')})}</div></div><div class="detailBlock"><small>${text('mouthTip')}</small><strong>${hint}</strong><p class="detailHint">${MOUTH_HINTS[language][item.mouthHintKey]}</p></div></div><p class="contrastNote">${text('vowelCarrierRule')}</p><p class="detailHint">${text('romanNote')}</p>`;
      } else {
        const combination = `${item.symbol} + ㅏ = ${item.demoSyllable}`;
        detail.innerHTML = `<div class="detailHeader"><div><span class="detailType">${text('consonant')}</span><div class="detailSymbol">${item.symbol}</div></div></div><div class="detailGrid"><div class="detailBlock"><small>${text('letterName')}</small><strong>${item.letterName}</strong><div class="detailActions">${audioButton({available:audioResolution(item,'letter-name').playable,action:'letter-name',label:text('listenLetterName',{name:item.letterName}),pending:text('audioNotReleased')})}</div></div><div class="detailBlock"><small>${text('exampleCombination')}</small><strong>${combination}</strong><div class="detailActions">${audioButton({available:audioResolution(item,'demo').playable,action:'demo',label:text('listenDemo',{syllable:item.demoSyllable}),pending:text('audioNotReleased')})}</div></div></div><p class="detailHint">${text('consonantRule')} ${hint}</p>${item.symbol === 'ㅇ' ? `<p class="contrastNote">${text('silentIeung')}</p>` : ''}${item.contrastGroup ? `<p class="contrastNote">${text('contrast',{group:item.contrastGroup})}</p>` : ''}<p class="detailHint">${text('romanNote')}</p>`;
      }
      detail.classList.add('show');
    }

    function render() {
      global.document.documentElement.lang = language === 'zh' ? 'zh-CN' : language;
      byId('language').value = language;
      keys.forEach(key => { const target = byId(key === 'back' ? 'backButton' : key); if (target) target.textContent = text(key); });
      byId('homeButton').setAttribute('aria-label', text('home'));
      byId('homeLogo').setAttribute('aria-label', text('home'));
      renderLetters();
      renderDetail();
      global.document.querySelectorAll('[data-level]').forEach(button => {
        const selected = button.dataset.level === global.NikigoState.get().hangulLevel;
        button.classList.toggle('selected', selected);
        button.setAttribute('aria-pressed', String(selected));
      });
    }

    function play(item, action) {
      const resolved = audioResolution(item, action);
      if (!resolved.playable) return;
      if (currentAudio) currentAudio.pause();
      const audioKey = `${item.symbol}:${action}`;
      const token = ++playbackToken;
      playingAudioKey = audioKey;
      renderDetail();
      currentAudio = new Audio(resolved.path);
      currentAudio.playbackRate = Math.min(1.2, Math.max(0.8, Number(global.NikigoState.get().audioRate) || 1));
      currentAudio.preservesPitch = true;
      currentAudio.mozPreservesPitch = true;
      currentAudio.webkitPreservesPitch = true;
      const finish = (completed = false) => {
        if (token !== playbackToken) return;
        if (completed) playedAudioKeys.add(audioKey);
        playingAudioKey = '';
        currentAudio = null;
        renderDetail();
      };
      currentAudio.onended = () => finish(true);
      currentAudio.play().catch(() => { finish(false); byId('selectionStatus').textContent = text('audioError'); });
    }

    function goHome() { global.location.href = `nikigo-app.html?lang=${language}#courses`; }
    function choose(level) {
      if (!['beginner','partial','reader'].includes(level)) return;
      global.NikigoState.save(choicePatch(global.NikigoState.get(), level), 'lesson-00:starting-point');
      render();
      byId('selectionStatus').textContent = COPY[language][`saved${level[0].toUpperCase()}${level.slice(1)}`];
      global.setTimeout(() => { global.location.href = routeFor(level, language); }, 450);
    }

    global.document.querySelector('.mapGrid').addEventListener('click', event => {
      const button = event.target.closest('[data-symbol]');
      if (!button) return;
      selectedSymbol = button.dataset.symbol;
      render();
      byId('letterDetail').scrollIntoView({ behavior:'smooth', block:'nearest' });
    });
    byId('letterDetail').addEventListener('click', event => {
      const button = event.target.closest('[data-audio-action]');
      if (!button || button.disabled) return;
      play(global.NikigoHangulSoundData.bySymbol[selectedSymbol], button.dataset.audioAction);
    });
    byId('language').addEventListener('change', event => {
      language = SUPPORTED.includes(event.target.value) ? event.target.value : 'en';
      global.NikigoState.update({ interfaceLanguage:language, learningLanguage:language }, 'lesson-00:language');
      const nextUrl = new URL(global.location.href); nextUrl.searchParams.set('lang', language); global.history.replaceState(null, '', nextUrl);
      render();
    });
    global.document.querySelectorAll('[data-level]').forEach(button => button.addEventListener('click', () => choose(button.dataset.level)));
    byId('homeButton').addEventListener('click', goHome);
    byId('homeLogo').addEventListener('click', goHome);
    byId('backButton').addEventListener('click', goHome);
    render();
  }

  global.NikigoLesson00 = Object.freeze({ COPY, MOUTH_HINTS, routeFor, choicePatch });
  global.document.addEventListener('DOMContentLoaded', initialize);
})(window);
