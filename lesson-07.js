(function (global) {
  'use strict';

  // The course identity is Lesson 7. The legacy audio namespace remains lesson-04
  // because the sealed approved 바 asset must not be moved or changed.
  const LESSON_ID = 'lesson-07';
  const AUDIO_LESSON_ID = 'lesson-04';
  global.NikigoCurrentLesson = Object.freeze({lessonId:LESSON_ID});
  const SESSION_KEY = `nikigoLessonSession:${LESSON_ID}`;
  const BASE_SYLLABLE_AUDIO = global.NikigoAudio?.resolve?.('바','syllable',AUDIO_LESSON_ID);
  const LANGUAGES = ['zh', 'en', 'vi', 'ja'];
  const SCREENS = ['intro','structure','san','mom','gong','mul','compare','split','build','recognize','challenge','retry','complete'];
  const EXAMPLES = Object.freeze([
    { id:'san', word:'산', base:'사', final:'ㄴ', ending:'[n]', meaning:'mountain' },
    { id:'mom', word:'몸', base:'모', final:'ㅁ', ending:'[m]', meaning:'body' },
    { id:'gong', word:'공', base:'고', final:'ㅇ', ending:'[ng]', meaning:'ball' },
    { id:'mul', word:'물', base:'무', final:'ㄹ', ending:'[l]', meaning:'water' }
  ]);
  const BUILD_MAP = Object.freeze({ '사+ㄴ':'산', '모+ㅁ':'몸', '고+ㅇ':'공', '무+ㄹ':'물' });
  const SPLIT_QUESTIONS = Object.freeze([
    { id:'split-san', prompt:'산', correct:'사 + ㄴ', options:['사 + ㄴ','사 + ㅁ','산 + ㄴ'] },
    { id:'split-mom', prompt:'몸', correct:'모 + ㅁ', options:['모 + ㅇ','모 + ㅁ','무 + ㅁ'] },
    { id:'split-gong', prompt:'공', correct:'고 + ㅇ', options:['고 + ㄴ','고 + ㅇ','공 + ㅇ'] },
    { id:'split-mul', prompt:'물', correct:'무 + ㄹ', options:['모 + ㄹ','무 + ㄴ','무 + ㄹ'] }
  ]);
  const RECOGNIZE_QUESTIONS = Object.freeze([
    { id:'recognize-n', prompt:'findN', correct:'산', options:['산','몸','공','물'] },
    { id:'recognize-m', prompt:'findM', correct:'몸', options:['공','물','몸','산'] },
    { id:'recognize-ng', prompt:'findNg', correct:'공', options:['물','공','산','몸'] },
    { id:'recognize-l', prompt:'findL', correct:'물', options:['몸','산','물','공'] }
  ]);
  const CHALLENGE = Object.freeze([
    { id:'c1', prompt:'c1', correct:'bottom', options:['bottom','left','outside'], explain:'e1' },
    { id:'c2', prompt:'c2', correct:'사 + ㄴ', options:['사 + ㄴ','사 + ㅁ','사 + ㅇ'], explain:'e2' },
    { id:'c3', prompt:'c3', correct:'공', options:['산','공','몸','물'], explain:'e3' },
    { id:'c4', prompt:'c4', correct:'closeOnly', options:['closeOnly','extraVowel','letterName'], explain:'e4' },
    { id:'c5', prompt:'c5', correct:'물', options:['공','산','물','몸'], explain:'e5' }
  ]);
  const OPTION_KEYS = Object.freeze({ bottom:'bottom', left:'left', outside:'outside', closeOnly:'closeOnly', extraVowel:'extraVowel', letterName:'letterName' });

  const UI = {
    zh: {
      lessonName:'第7课 · 基础收音', progress:'课程进度', home:'返回课程主页', back:'返回', next:'继续', finish:'完成课程',
      previewTitle:'开发预览 · 音频尚未发布', previewLead:'课程正文和练习可以完成；待审核音频保持禁用，不使用设备语音或文字替代。',
      introTag:'K0 · 第7课', introTitle:'听懂并读出基础收音', introLead:'认识音节块底部的ㄴ、ㅁ、ㅇ、ㄹ，通过完整音节和真实词理解四种基础收尾。',
      goal1:'看懂位置', goal1d:'收音写在音节块底部。', goal2:'读完整词', goal2d:'用산、몸、공、물学习，不读孤立收音。', goal3:'收住结尾', goal3d:'不在n、m、ng、l后添加额外元音。',
      structureTag:'音节块结构', structureTitle:'收音在音节块最下面', structureLead:'一个有收音的音节由初声、元音和底部收音组成。本课只学习四个最基础的收音。', onset:'初声', vowel:'元音', final:'收音', structureNote:'收音属于同一个音节块，不是写在外面的第四个字母。', noBareFinal:'辅音收音不能脱离音节自然发音，因此试听对象始终是完整音节或真实单词。',
      exampleTag:'完整单词', finalLabel:'收音', decomposition:'音节拆分', endingSound:'实际结尾', listenWord:'听完整单词 {word}', audioUnavailable:'音频尚未发布',
      mountain:'山', body:'身体', ball:'球', water:'水',
      sanTitle:'先看收音ㄴ：산', sanLead:'读完사后，舌尖在上齿龈处收住，结尾接近[n]，不要再加一个元音。',
      momTitle:'再看收音ㅁ：몸', momLead:'读完모后双唇闭合，结尾接近[m]，不要把它读成额外的“姆”。',
      gongTitle:'收音ㅇ在공中读作[ng]', gongLead:'ㅇ在音节开头可以不发音；在底部作收音时，口腔后部收住，结尾是[ng]。',
      mulTitle:'收音ㄹ在물中收住', mulLead:'读完무后舌尖轻触上方，结尾接近[l]，不要增加“勒”一类元音。',
      actionTip:'动作提示', wordFirst:'先读完整词', noExtra:'只收住结尾，不添加额外音节。',
      compareTag:'四组对比', compareTitle:'比较四种完整的结尾', compareLead:'罗马字母只作近似位置提示；实际学习对象是完整韩语单词。', mouthAction:'口腔动作', compareN:'舌尖收住', compareM:'双唇闭合', compareNg:'口腔后部收住', compareL:'舌尖轻触上方',
      splitTag:'互动 · 拆分', splitTitle:'把完整音节拆成底部收音', splitLead:'选择正确拆分。收音仍属于这个完整音节。', correct:'答对了！', incorrect:'再看一次，正确答案是 {answer}。',
      buildTag:'互动 · 拼合', buildTitle:'把音节主体和收音拼回完整词', buildLead:'拼出산、몸、공、물四个完整词后继续。', base:'音节主体', chooseFinal:'选择收音', confirmBuild:'确认拼合 {word}', built:'已经拼出', buildNeed:'请拼出4个不同的目标词。', invalidBuild:'这个组合不在本课范围内。',
      recognizeTag:'互动 · 识字', recognizeTitle:'看完整词，找到对应收音', recognizeLead:'不要只看罗马音；先看音节块底部。', findN:'哪个完整词的收音是ㄴ？', findM:'哪个完整词的收音是ㅁ？', findNg:'哪个完整词的收音是ㅇ？', findL:'哪个完整词的收音是ㄹ？',
      challengeTag:'5题挑战', challengeTitle:'检查基础收音结构', challengeLead:'五题集中检查位置、拆分、识字和正确收尾。当前没有已审核听力音频，不会用文字冒充音频。', startChallenge:'开始挑战', question:'挑战题', previousQuestion:'上一题', nextQuestion:'下一题', correctAnswer:'正确答案',
      c1:'收音写在音节块的什么位置？', c2:'산应该怎样拆分？', c3:'哪个词使用收音ㅇ？', c4:'读到收音时应该怎样结束？', c5:'哪个完整词表示“水”？',
      bottom:'底部', left:'左边', outside:'音节块外面', closeOnly:'在目标位置收住，不添加元音', extraVowel:'在结尾再加一个元音', letterName:'只读字母名称',
      e1:'收音位于音节块底部。', e2:'산由사和底部收音ㄴ组成。', e3:'공的底部是ㅇ，结尾为[ng]。', e4:'收音只收住结尾，不形成额外音节。', e5:'물表示水，底部收音是ㄹ。',
      retryTag:'错题重练', retryTitle:'把错题改正后再完成', retryLead:'每道错题都需要重新答对。', retryEmpty:'没有需要重练的题。', remaining:'还需重练 {count} 题', tryAgain:'再试一次', continueRetry:'继续重练',
      completeTag:'K0 · 第7课完成', completeTitle:'第7课完成！', completeLead:'你已经理解基础收音的位置，并能拼合、拆分和识别산、몸、공、물。', xpEarned:'本次获得 +50 XP', xpClaimed:'首次完成奖励已领取，本次不重复发放XP', progressSaved:'学习进度已保存', reviewLesson:'重新学习本课', returnCourses:'返回课程主页'
    },
    en: {
      lessonName:'Lesson 7 · Basic Batchim', progress:'Lesson progress', home:'Return to Courses', back:'Back', next:'Continue', finish:'Complete lesson',
      previewTitle:'Development preview · Audio not released', previewLead:'You can complete the lesson content and activities. Unreviewed audio stays disabled; no device voice or text substitute is used.',
      introTag:'K0 · LESSON 7', introTitle:'Understand and read basic final consonants', introLead:'Meet ㄴ, ㅁ, ㅇ and ㄹ at the bottom of a syllable block through full syllables and real words.',
      goal1:'See the position', goal1d:'A final sits at the bottom of the block.', goal2:'Read full words', goal2d:'Learn with 산, 몸, 공 and 물—not isolated finals.', goal3:'Close the ending', goal3d:'Do not add a vowel after n, m, ng or l.',
      structureTag:'SYLLABLE STRUCTURE', structureTitle:'A final consonant sits at the bottom', structureLead:'A syllable with a final has an onset, a vowel and a bottom final. This lesson covers four basic finals only.', onset:'Onset', vowel:'Vowel', final:'Final', structureNote:'The final belongs inside the same syllable block; it is not a fourth letter outside the block.', noBareFinal:'A final consonant cannot be pronounced naturally outside a syllable, so every listening target is a full syllable or real word.',
      exampleTag:'FULL WORD', finalLabel:'Final', decomposition:'Syllable split', endingSound:'Actual ending', listenWord:'Listen to full word {word}', audioUnavailable:'Audio not released',
      mountain:'mountain', body:'body', ball:'ball', water:'water',
      sanTitle:'Start with final ㄴ in 산', sanLead:'After 사, close with the tongue tip near the ridge behind the upper teeth. It is close to [n], with no added vowel.',
      momTitle:'Final ㅁ in 몸', momLead:'After 모, close both lips. The ending is close to [m]; do not turn it into another syllable.',
      gongTitle:'Final ㅇ is [ng] in 공', gongLead:'ㅇ can be silent at the start. At the bottom it closes at the back of the mouth and ends in [ng].',
      mulTitle:'Close final ㄹ in 물', mulLead:'After 무, touch the tongue lightly above. The ending is close to [l], without an extra vowel.',
      actionTip:'Mouth action', wordFirst:'Read the full word first', noExtra:'Close the ending only; do not add another syllable.',
      compareTag:'FOUR-WAY COMPARISON', compareTitle:'Compare four complete endings', compareLead:'Roman letters are approximate location hints only. The learning targets are full Korean words.', mouthAction:'Mouth action', compareN:'Tongue tip closes', compareM:'Both lips close', compareNg:'Back of mouth closes', compareL:'Tongue touches lightly above',
      splitTag:'INTERACT · SPLIT', splitTitle:'Split a full syllable into its bottom final', splitLead:'Choose the correct split. The final still belongs to the whole syllable.', correct:'Correct!', incorrect:'Look again. The correct answer is {answer}.',
      buildTag:'INTERACT · BUILD', buildTitle:'Put a base and final back into a full word', buildLead:'Build all four: 산, 몸, 공 and 물.', base:'Syllable base', chooseFinal:'Choose final', confirmBuild:'Confirm full word {word}', built:'Built', buildNeed:'Build all 4 target words.', invalidBuild:'This combination is outside this lesson.',
      recognizeTag:'INTERACT · RECOGNIZE', recognizeTitle:'Look at the full word and find its final', recognizeLead:'Do not rely on romanization; inspect the bottom of the block.', findN:'Which full word has final ㄴ?', findM:'Which full word has final ㅁ?', findNg:'Which full word has final ㅇ?', findL:'Which full word has final ㄹ?',
      challengeTag:'5-QUESTION CHALLENGE', challengeTitle:'Check basic final-consonant structure', challengeLead:'Five questions cover position, splitting, recognition and proper endings. No reviewed listening audio exists yet, so text is never used as fake audio.', startChallenge:'Start challenge', question:'Challenge', previousQuestion:'Previous question', nextQuestion:'Next question', correctAnswer:'Correct answer',
      c1:'Where is a final consonant written in a syllable block?', c2:'How should 산 be split?', c3:'Which word uses final ㅇ?', c4:'How should a final consonant end?', c5:'Which full word means “water”?',
      bottom:'At the bottom', left:'On the left', outside:'Outside the block', closeOnly:'Close at the target position, with no added vowel', extraVowel:'Add another vowel after it', letterName:'Say only the letter name',
      e1:'A final consonant sits at the bottom of the block.', e2:'산 contains 사 plus bottom final ㄴ.', e3:'공 has final ㅇ and ends in [ng].', e4:'A final closes the ending without creating another syllable.', e5:'물 means water and has final ㄹ.',
      retryTag:'RETRY MISSED QUESTIONS', retryTitle:'Correct missed questions before finishing', retryLead:'Each missed question must be answered correctly.', retryEmpty:'No questions need another round.', remaining:'{count} question(s) left', tryAgain:'Try again', continueRetry:'Continue retry',
      completeTag:'K0 · LESSON 7 COMPLETE', completeTitle:'Lesson 7 complete!', completeLead:'You understand where basic finals sit and can build, split and recognize 산, 몸, 공 and 물.', xpEarned:'You earned +50 XP this time', xpClaimed:'The first-completion reward was already claimed; no extra XP this time', progressSaved:'Learning progress saved', reviewLesson:'Review this lesson', returnCourses:'Return to Courses'
    },
    vi: {
      lessonName:'Bài 7 · Batchim cơ bản', progress:'Tiến độ bài học', home:'Về trang khóa học', back:'Quay lại', next:'Tiếp tục', finish:'Hoàn thành bài',
      previewTitle:'Bản xem trước · Âm thanh chưa phát hành', previewLead:'Bạn có thể hoàn thành nội dung và bài tập. Âm thanh chưa duyệt vẫn bị vô hiệu; không dùng giọng thiết bị hoặc văn bản thay thế.',
      introTag:'K0 · BÀI 7', introTitle:'Hiểu và đọc âm cuối cơ bản', introLead:'Học ㄴ, ㅁ, ㅇ, ㄹ ở đáy khối âm tiết qua âm tiết đầy đủ và từ thật.',
      goal1:'Nhìn vị trí', goal1d:'Âm cuối nằm ở đáy khối.', goal2:'Đọc từ đầy đủ', goal2d:'Học bằng 산, 몸, 공, 물, không đọc âm cuối rời.', goal3:'Khép âm cuối', goal3d:'Không thêm nguyên âm sau n, m, ng, l.',
      structureTag:'CẤU TRÚC ÂM TIẾT', structureTitle:'Âm cuối nằm ở đáy khối âm tiết', structureLead:'Âm tiết có âm cuối gồm phụ âm đầu, nguyên âm và âm cuối phía dưới. Bài này chỉ học bốn âm cuối cơ bản.', onset:'Phụ âm đầu', vowel:'Nguyên âm', final:'Âm cuối', structureNote:'Âm cuối thuộc cùng một khối âm tiết, không phải chữ thứ tư viết bên ngoài.', noBareFinal:'Âm cuối không thể phát âm tự nhiên ngoài âm tiết, nên đối tượng nghe luôn là âm tiết đầy đủ hoặc từ thật.',
      exampleTag:'TỪ ĐẦY ĐỦ', finalLabel:'Âm cuối', decomposition:'Tách âm tiết', endingSound:'Âm kết thực tế', listenWord:'Nghe từ đầy đủ {word}', audioUnavailable:'Âm thanh chưa phát hành',
      mountain:'núi', body:'cơ thể', ball:'quả bóng', water:'nước',
      sanTitle:'Bắt đầu với ㄴ trong 산', sanLead:'Sau 사, khép đầu lưỡi gần lợi trên. Âm cuối gần [n], không thêm nguyên âm.',
      momTitle:'Âm cuối ㅁ trong 몸', momLead:'Sau 모, khép hai môi. Âm cuối gần [m], không biến thành âm tiết khác.',
      gongTitle:'ㅇ ở cuối là [ng] trong 공', gongLead:'ㅇ có thể câm ở đầu; ở đáy khối, nó khép phía sau miệng và kết thúc bằng [ng].',
      mulTitle:'Khép ㄹ trong 물', mulLead:'Sau 무, chạm nhẹ đầu lưỡi lên trên. Âm cuối gần [l], không thêm nguyên âm.',
      actionTip:'Động tác miệng', wordFirst:'Đọc cả từ trước', noExtra:'Chỉ khép âm cuối, không thêm âm tiết.',
      compareTag:'SO SÁNH BỐN NHÓM', compareTitle:'So sánh bốn âm cuối đầy đủ', compareLead:'Chữ Latin chỉ là gợi ý gần đúng; đối tượng học là từ tiếng Hàn đầy đủ.', mouthAction:'Động tác miệng', compareN:'Khép đầu lưỡi', compareM:'Khép hai môi', compareNg:'Khép phía sau miệng', compareL:'Chạm nhẹ lưỡi phía trên',
      splitTag:'TƯƠNG TÁC · TÁCH', splitTitle:'Tách âm tiết đầy đủ thành phần âm cuối', splitLead:'Chọn cách tách đúng. Âm cuối vẫn thuộc toàn bộ âm tiết.', correct:'Chính xác!', incorrect:'Hãy xem lại. Đáp án đúng là {answer}.',
      buildTag:'TƯƠNG TÁC · GHÉP', buildTitle:'Ghép thân âm tiết và âm cuối thành từ đầy đủ', buildLead:'Ghép đủ 산, 몸, 공 và 물.', base:'Thân âm tiết', chooseFinal:'Chọn âm cuối', confirmBuild:'Xác nhận từ {word}', built:'Đã ghép', buildNeed:'Hãy ghép đủ 4 từ mục tiêu.', invalidBuild:'Tổ hợp này ngoài phạm vi bài.',
      recognizeTag:'TƯƠNG TÁC · NHẬN CHỮ', recognizeTitle:'Nhìn từ đầy đủ và tìm âm cuối', recognizeLead:'Đừng chỉ dựa vào phiên âm; hãy nhìn đáy khối.', findN:'Từ đầy đủ nào có âm cuối ㄴ?', findM:'Từ đầy đủ nào có âm cuối ㅁ?', findNg:'Từ đầy đủ nào có âm cuối ㅇ?', findL:'Từ đầy đủ nào có âm cuối ㄹ?',
      challengeTag:'THỬ THÁCH 5 CÂU', challengeTitle:'Kiểm tra cấu trúc âm cuối cơ bản', challengeLead:'Năm câu về vị trí, tách, nhận chữ và cách kết thúc. Chưa có âm thanh nghe đã duyệt nên không dùng văn bản giả âm thanh.', startChallenge:'Bắt đầu', question:'Câu hỏi', previousQuestion:'Câu trước', nextQuestion:'Câu tiếp', correctAnswer:'Đáp án đúng',
      c1:'Âm cuối được viết ở đâu trong khối âm tiết?', c2:'산 được tách thế nào?', c3:'Từ nào dùng âm cuối ㅇ?', c4:'Khi đọc âm cuối nên kết thúc thế nào?', c5:'Từ đầy đủ nào có nghĩa là “nước”?',
      bottom:'Ở đáy', left:'Bên trái', outside:'Ngoài khối', closeOnly:'Khép đúng vị trí, không thêm nguyên âm', extraVowel:'Thêm nguyên âm sau đó', letterName:'Chỉ đọc tên chữ',
      e1:'Âm cuối nằm ở đáy khối.', e2:'산 gồm 사 và âm cuối ㄴ.', e3:'공 có âm cuối ㅇ và kết bằng [ng].', e4:'Âm cuối khép tiếng mà không tạo thêm âm tiết.', e5:'물 nghĩa là nước và có âm cuối ㄹ.',
      retryTag:'LUYỆN LẠI CÂU SAI', retryTitle:'Sửa câu sai trước khi hoàn thành', retryLead:'Mỗi câu sai phải được trả lời đúng.', retryEmpty:'Không có câu cần luyện lại.', remaining:'Còn {count} câu', tryAgain:'Thử lại', continueRetry:'Tiếp tục luyện',
      completeTag:'K0 · HOÀN THÀNH BÀI 7', completeTitle:'Đã hoàn thành Bài 7!', completeLead:'Bạn hiểu vị trí âm cuối và có thể ghép, tách, nhận biết 산, 몸, 공, 물.', xpEarned:'Lần này bạn nhận +50 XP', xpClaimed:'Đã nhận thưởng lần hoàn thành đầu; lần này không cộng thêm XP', progressSaved:'Đã lưu tiến độ', reviewLesson:'Ôn lại bài này', returnCourses:'Về trang khóa học'
    },
    ja: {
      lessonName:'第7課 · 基本パッチム', progress:'レッスン進捗', home:'コース一覧へ', back:'戻る', next:'続ける', finish:'レッスン完了',
      previewTitle:'開発プレビュー · 音声未公開', previewLead:'本文と練習は完了できます。未審査音声は無効のままで、端末音声や文字による代用は行いません。',
      introTag:'K0 · 第7課', introTitle:'基本パッチムを理解して読む', introLead:'音節ブロック下部のㄴ・ㅁ・ㅇ・ㄹを、完全な音節と実際の単語で学びます。',
      goal1:'位置を見る', goal1d:'パッチムはブロック下部にあります。', goal2:'単語全体を読む', goal2d:'孤立音ではなく산・몸・공・물で学びます。', goal3:'語尾を閉じる', goal3d:'n・m・ng・lの後に母音を足しません。',
      structureTag:'音節構造', structureTitle:'パッチムは音節ブロックの一番下', structureLead:'パッチムのある音節は初声・母音・下部の終声から成ります。本課は基本4種類だけです。', onset:'初声', vowel:'母音', final:'パッチム', structureNote:'パッチムは同じ音節ブロック内にあり、外に書く4文字目ではありません。', noBareFinal:'終声子音は音節から離して自然に発音できないため、聞く対象は常に完全な音節か実際の単語です。',
      exampleTag:'完全な単語', finalLabel:'パッチム', decomposition:'音節分解', endingSound:'実際の語尾', listenWord:'完全な単語「{word}」を聞く', audioUnavailable:'音声未公開',
      mountain:'山', body:'体', ball:'ボール', water:'水',
      sanTitle:'ㄴパッチムの산から', sanLead:'사の後、舌先を上の歯茎付近で止めます。[n]に近く、母音は足しません。',
      momTitle:'몸のㅁパッチム', momLead:'모の後、両唇を閉じます。[m]に近く、別の音節にしません。',
      gongTitle:'공の終声ㅇは[ng]', gongLead:'ㅇは初声では無音ですが、下部では口の奥を閉じて[ng]で終わります。',
      mulTitle:'물のㄹを閉じる', mulLead:'무の後、舌先を上に軽く触れます。[l]に近く、余分な母音を足しません。',
      actionTip:'口の動き', wordFirst:'まず単語全体を読む', noExtra:'語尾を閉じるだけで、音節を追加しません。',
      compareTag:'4種類の比較', compareTitle:'4つの完全な語尾を比べる', compareLead:'ローマ字はおおよその位置のヒントだけ。学習対象は完全な韓国語単語です。', mouthAction:'口の動き', compareN:'舌先で閉じる', compareM:'両唇を閉じる', compareNg:'口の奥で閉じる', compareL:'舌先を上に軽く触れる',
      splitTag:'操作 · 分解', splitTitle:'完全な音節を下部の終声に分ける', splitLead:'正しい分解を選びます。終声も音節全体の一部です。', correct:'正解です！', incorrect:'もう一度確認しましょう。正解は{answer}です。',
      buildTag:'操作 · 組み立て', buildTitle:'音節本体と終声を完全な単語に戻す', buildLead:'산・몸・공・물をすべて作りましょう。', base:'音節本体', chooseFinal:'パッチムを選択', confirmBuild:'完全な単語「{word}」を確定', built:'作った単語', buildNeed:'4つの目標単語をすべて作ってください。', invalidBuild:'この組み合わせは本課の範囲外です。',
      recognizeTag:'操作 · 文字認識', recognizeTitle:'完全な単語を見てパッチムを探す', recognizeLead:'ローマ字だけに頼らず、ブロック下部を見ます。', findN:'パッチムㄴの完全な単語は？', findM:'パッチムㅁの完全な単語は？', findNg:'パッチムㅇの完全な単語は？', findL:'パッチムㄹの完全な単語は？',
      challengeTag:'5問チャレンジ', challengeTitle:'基本パッチムの構造を確認', challengeLead:'位置・分解・文字認識・正しい閉じ方を5問で確認。審査済み音声がないため、文字を音声代わりにしません。', startChallenge:'チャレンジ開始', question:'チャレンジ', previousQuestion:'前の問題', nextQuestion:'次の問題', correctAnswer:'正解',
      c1:'パッチムは音節ブロックのどこに書きますか？', c2:'산の正しい分解は？', c3:'パッチムㅇを使う単語は？', c4:'パッチムはどう終わらせますか？', c5:'「水」を表す完全な単語は？',
      bottom:'下部', left:'左側', outside:'ブロックの外', closeOnly:'目標位置で閉じ、母音を足さない', extraVowel:'後に母音を足す', letterName:'字母名だけを読む',
      e1:'パッチムはブロック下部にあります。', e2:'산は사と下部のㄴから成ります。', e3:'공の終声はㅇで、[ng]で終わります。', e4:'終声は新しい音節を作らず語尾を閉じます。', e5:'물は「水」で、終声はㄹです。',
      retryTag:'間違いを再練習', retryTitle:'間違いを直してから完了', retryLead:'間違えた問題は正解する必要があります。', retryEmpty:'再練習する問題はありません。', remaining:'残り{count}問', tryAgain:'もう一度', continueRetry:'次の再練習へ',
      completeTag:'K0 · 第7課完了', completeTitle:'第7課、完了！', completeLead:'基本パッチムの位置を理解し、산・몸・공・물を組み立て・分解・識別できました。', xpEarned:'今回 +50 XP を獲得', xpClaimed:'初回完了報酬は受取済みです。今回はXPを追加しません', progressSaved:'進捗を保存しました', reviewLesson:'この課を復習', returnCourses:'コース一覧へ'
    }
  };

  let language = languageFromEnvironment();
  let profile = global.NikigoState?.get?.() || {};
  let currentAudio = null;
  let session = readSession();
  let completionAwardedThisView = false;

  function languageFromEnvironment() {
    const requested = new URLSearchParams(global.location.search).get('lang');
    if (LANGUAGES.includes(requested)) return requested;
    const saved = global.NikigoState?.get?.().interfaceLanguage;
    if (LANGUAGES.includes(saved)) return saved;
    const browser = (global.navigator?.language || 'en').slice(0, 2);
    return LANGUAGES.includes(browser) ? browser : 'en';
  }
  function text(key, values = {}) {
    let value = UI[language]?.[key] ?? UI.en[key] ?? String(key);
    for (const [name, replacement] of Object.entries(values)) value = value.replaceAll(`{${name}}`, replacement);
    return value;
  }
  function rotated(values, offset) { const copy=[...values]; const n=offset%copy.length; return [...copy.slice(n),...copy.slice(0,n)]; }
  function optionOrders() { return Object.fromEntries(CHALLENGE.map((q,i)=>[q.id,rotated(q.options,i+1)])); }
  function blankSession() {
    return { step:0, completed:false, splitAnswers:{}, base:'사', final:'ㄴ', built:[], recognizeAnswers:{}, challengeStarted:false, challengeIndex:0, challengeAnswers:{}, mistakes:[], retryAnswers:{}, optionOrders:optionOrders() };
  }
  function normalizeSession(raw) {
    const base=blankSession(), source=raw&&typeof raw==='object'?raw:{};
    return {...base,...source,
      step:Math.max(0,Math.min(SCREENS.length-1,Number(source.step)||0)), completed:source.completed===true,
      splitAnswers:{...(source.splitAnswers||{})}, base:['사','모','고','무'].includes(source.base)?source.base:'사', final:['ㄴ','ㅁ','ㅇ','ㄹ'].includes(source.final)?source.final:'ㄴ',
      built:[...new Set((source.built||[]).filter(word=>EXAMPLES.some(item=>item.word===word)))], recognizeAnswers:{...(source.recognizeAnswers||{})},
      challengeStarted:source.challengeStarted===true, challengeIndex:Math.max(0,Math.min(4,Number(source.challengeIndex)||0)), challengeAnswers:{...(source.challengeAnswers||{})},
      mistakes:[...new Set((source.mistakes||[]).filter(id=>CHALLENGE.some(q=>q.id===id)))], retryAnswers:{...(source.retryAnswers||{})},
      optionOrders:Object.fromEntries(CHALLENGE.map(q=>[q.id,Array.isArray(source.optionOrders?.[q.id])&&source.optionOrders[q.id].length===q.options.length?[...source.optionOrders[q.id]]:optionOrders()[q.id]]))
    };
  }
  function readSession() { try { return normalizeSession(JSON.parse(global.localStorage.getItem(SESSION_KEY)||'{}')); } catch { return blankSession(); } }
  function saveSession() {
    global.localStorage.setItem(SESSION_KEY,JSON.stringify(session));
    if (!session.completed) {
      const percent=Math.min(99,Math.round(session.step/(SCREENS.length-1)*100));
      profile=global.NikigoState?.update?.(current=>({...current,lessonProgress:{...(current.lessonProgress||{}),[LESSON_ID]:Math.max(Number(current.lessonProgress?.[LESSON_ID])||0,percent)}}),'lesson-07:progress')||profile;
    }
  }
  function completionPatch(source) {
    const completed=new Set(source.completedLessons||[]), first=!completed.has(LESSON_ID); completed.add(LESSON_ID);
    return {...source,completedLessons:[...completed],lessonProgress:{...(source.lessonProgress||{}),[LESSON_ID]:100},xp:(Number(source.xp)||0)+(first?50:0)};
  }
  function footer({disabled=false,label=text('next'),action='next'}={}) { return `<div class="foot"><button class="ghost" data-action="back">← ${text('back')}</button><button class="primary" data-action="${action}" ${disabled?'disabled':''}>${label} →</button></div>`; }
  function releaseNotice() { return `<aside class="lesson07Notice" role="status"><strong>${text('previewTitle')}</strong>${text('previewLead')}</aside>`; }
  function audioButton(word) { return `<button class="audioUnavailable" type="button" disabled aria-disabled="true" aria-label="${text('listenWord',{word})} · ${text('audioUnavailable')}">${text('listenWord',{word})} · ${text('audioUnavailable')}</button>`; }
  function baseSyllableAudioButton() { return BASE_SYLLABLE_AUDIO?.playable ? `<button class="secondary" type="button" data-action="base-audio" aria-label="${text('listenWord',{word:'바'})}">▶ ${text('listenWord',{word:'바'})}</button>` : audioButton('바'); }
  function playBaseSyllableAudio() {
    if (!BASE_SYLLABLE_AUDIO?.playable || !BASE_SYLLABLE_AUDIO.path) return;
    currentAudio?.pause();
    currentAudio = new Audio(BASE_SYLLABLE_AUDIO.path);
    currentAudio.playbackRate = Math.min(1.2,Math.max(.8,Number(profile.audioRate)||1));
    currentAudio.preservesPitch = true;
    currentAudio.play().catch(()=>{});
  }
  function exampleCard(item) { return `<article class="batchimCard"><strong class="batchimWord">${item.word}</strong><span class="batchimMeaning">${text(item.meaning)}</span><span class="finalBadge">${text('finalLabel')} ${item.final}</span><div class="syllableBreakdown">${item.word} → ${item.base} + ${item.final}</div><small class="endingHint">${text('endingSound')}：${item.final} ${item.ending}</small>${audioButton(item.word)}</article>`; }
  function renderIntro() { return `<span class="eyebrow">${text('introTag')}</span><h1>${text('introTitle')}</h1><p class="lead">${text('introLead')}</p><div class="goals">${[1,2,3].map(i=>`<div class="goal"><b>${text(`goal${i}`)}</b><span>${text(`goal${i}d`)}</span></div>`).join('')}</div><div class="note">${text('noBareFinal')}</div>${footer()}`; }
  function renderStructure() { return `<span class="eyebrow">${text('structureTag')}</span><h1>${text('structureTitle')}</h1><p class="lead">${text('structureLead')}</p><div class="positionDiagram"><div class="blockDiagram" aria-label="${text('onset')}, ${text('vowel')}, ${text('final')}"><span>ㅅ</span><span>ㅏ</span><span class="final">ㄴ</span></div><div class="diagramNotes"><div>1 · ${text('onset')}：ㅅ</div><div>2 · ${text('vowel')}：ㅏ</div><div>3 · ${text('final')}：ㄴ</div><div>${text('structureNote')}</div></div></div>${footer()}`; }
  function renderExample(id) {
    const item=EXAMPLES.find(entry=>entry.id===id); const title=id==='san'?'sanTitle':id==='mom'?'momTitle':id==='gong'?'gongTitle':'mulTitle'; const lead=id==='san'?'sanLead':id==='mom'?'momLead':id==='gong'?'gongLead':'mulLead';
    return `<span class="eyebrow">${text('exampleTag')} · ${item.final}</span><h1>${text(title)}</h1><p class="lead">${text(lead)}</p><div class="focusWord">${exampleCard(item)}<div class="tipList"><div><strong>${text('actionTip')}</strong><br>${text(lead)}</div><div><strong>${text('wordFirst')}</strong><br>${item.word} → ${item.base} + ${item.final}</div><div>${text('noExtra')}</div></div></div>${footer()}`;
  }
  function renderCompare() { const actions={san:'compareN',mom:'compareM',gong:'compareNg',mul:'compareL'}; return `<span class="eyebrow">${text('compareTag')}</span><h1>${text('compareTitle')}</h1><p class="lead">${text('compareLead')}</p><div class="contrastTable">${EXAMPLES.map(item=>`<article class="contrastRow"><b>${item.word}</b><span>${item.final} ${item.ending}</span><span>${text(actions[item.id])}</span></article>`).join('')}</div>${footer()}`; }
  function allCorrect(questions,key) { return questions.every(q=>session[key][q.id]?.correct); }
  function renderPractice(questions,key,action,promptKey) { return questions.map(q=>{ const answer=session[key][q.id]; return `<article class="practiceCard"><div class="practicePrompt">${promptKey?text(q.prompt):q.prompt}</div><div class="practiceOptions">${q.options.map(value=>`<button class="${answer?(value===q.correct?'correct':value===answer.choice?'wrong':''):''}" data-action="${action}" data-question="${q.id}" data-value="${value}" ${answer?.correct?'disabled':''}>${value}${answer&&value===q.correct?' ✓':answer&&value===answer.choice?' ✕':''}</button>`).join('')}</div>${answer?`<div class="feedback ${answer.correct?'good':'try'}"><strong>${answer.correct?text('correct'):text('incorrect',{answer:q.correct})}</strong></div>`:''}</article>`; }).join(''); }
  function renderSplit() { return `<span class="eyebrow">${text('splitTag')}</span><h1>${text('splitTitle')}</h1><p class="lead">${text('splitLead')}</p><div class="practiceGrid">${renderPractice(SPLIT_QUESTIONS,'splitAnswers','split-answer',false)}</div>${footer({disabled:!allCorrect(SPLIT_QUESTIONS,'splitAnswers')})}`; }
  function buildResult() { return BUILD_MAP[`${session.base}+${session.final}`]||''; }
  function renderBuild() { const result=buildResult(),done=session.built.length===4; return `<span class="eyebrow">${text('buildTag')}</span><h1>${text('buildTitle')}</h1><p class="lead">${text('buildLead')}</p><div class="builderPanel"><div class="builderGroup"><label>${text('base')}</label><div class="builderChoices">${['사','모','고','무'].map(v=>`<button class="builderChoice ${session.base===v?'on':''}" data-action="builder-pick" data-kind="base" data-value="${v}" aria-pressed="${session.base===v}">${v}</button>`).join('')}</div></div><b class="builderOperator">+</b><div class="builderGroup"><label>${text('chooseFinal')}</label><div class="builderChoices">${['ㄴ','ㅁ','ㅇ','ㄹ'].map(v=>`<button class="builderChoice ${session.final===v?'on':''}" data-action="builder-pick" data-kind="final" data-value="${v}" aria-pressed="${session.final===v}">${v}</button>`).join('')}</div></div><b class="builderOperator">=</b><button class="builderResult" data-action="build" ${result?'':'disabled'} aria-label="${result?text('confirmBuild',{word:result}):text('invalidBuild')}"><strong>${result||'—'}</strong><small>${result?text('confirmBuild',{word:result}):text('invalidBuild')}</small></button></div><div class="repeatActions">${baseSyllableAudioButton()}</div><b>${text('built')}：</b><div class="builtWords">${session.built.map(word=>`<span>${word}</span>`).join('')||'—'}</div>${done?'':`<div class="note">${text('buildNeed')}</div>`}${footer({disabled:!done})}`; }
  function renderRecognize() { return `<span class="eyebrow">${text('recognizeTag')}</span><h1>${text('recognizeTitle')}</h1><p class="lead">${text('recognizeLead')}</p><div class="practiceGrid">${renderPractice(RECOGNIZE_QUESTIONS,'recognizeAnswers','recognize-answer',true)}</div>${footer({disabled:!allCorrect(RECOGNIZE_QUESTIONS,'recognizeAnswers')})}`; }
  function labelOption(value) { return OPTION_KEYS[value]?text(OPTION_KEYS[value]):value; }
  function feedback(question,answer) { return answer?`<div class="feedback ${answer.correct?'good':'try'}"><strong>${answer.correct?text('correct'):text('incorrect',{answer:labelOption(question.correct)})}</strong><span>${text('correctAnswer')}：${labelOption(question.correct)}</span><span>${text(question.explain)}</span></div>`:''; }
  function renderChallenge() {
    if(!session.challengeStarted)return `<span class="eyebrow">${text('challengeTag')}</span><h1>${text('challengeTitle')}</h1><p class="lead">${text('challengeLead')}</p>${footer({label:text('startChallenge'),action:'start-challenge'})}`;
    const q=CHALLENGE[session.challengeIndex], answer=session.challengeAnswers[q.id], options=session.optionOrders[q.id];
    return `<div class="challengeHeader"><span class="eyebrow">${text('question')} · ${session.challengeIndex+1}/5</span><div class="questionDots">${CHALLENGE.map((_,i)=>`<i class="${i===session.challengeIndex?'on':''}"></i>`).join('')}</div></div><h1 class="challengePrompt">${text(q.prompt)}</h1><div class="challengeOptions">${options.map(value=>`<button class="challengeOption ${answer?(value===q.correct?'correct':value===answer.choice?'wrong':''):''}" data-action="challenge-answer" data-question="${q.id}" data-value="${value}" ${answer?'disabled':''}>${labelOption(value)}${answer&&value===q.correct?' ✓':answer&&value===answer.choice?' ✕':''}</button>`).join('')}</div>${feedback(q,answer)}<div class="foot"><button class="ghost" data-action="${session.challengeIndex>0?'previous-question':'back'}">← ${session.challengeIndex>0?text('previousQuestion'):text('back')}</button><button class="primary" data-action="${session.challengeIndex<4?'next-question':'next'}" ${answer?'':'disabled'}>${session.challengeIndex<4?text('nextQuestion'):text('next')} →</button></div>`;
  }
  function renderRetry() {
    const id=session.mistakes[0];
    if(!id)return `<span class="eyebrow">${text('retryTag')}</span><h1>${text('retryTitle')}</h1><p class="lead">${text('retryLead')}</p><div class="note">✓ ${text('retryEmpty')}</div>${footer()}`;
    const q=CHALLENGE.find(item=>item.id===id), answer=session.retryAnswers[id], options=session.optionOrders[id];
    return `<span class="eyebrow">${text('retryTag')}</span><h1>${text('retryTitle')}</h1><p class="lead">${text('retryLead')}</p><div class="retryBadge">${text('remaining',{count:session.mistakes.length})}</div><h2 class="challengePrompt">${text(q.prompt)}</h2><div class="challengeOptions">${options.map(value=>`<button class="challengeOption ${answer?(value===q.correct?'correct':value===answer.choice?'wrong':''):''}" data-action="retry-answer" data-question="${q.id}" data-value="${value}" ${answer?'disabled':''}>${labelOption(value)}${answer&&value===q.correct?' ✓':answer&&value===answer.choice?' ✕':''}</button>`).join('')}</div>${feedback(q,answer)}${answer&&!answer.correct?`<button class="secondary" data-action="retry-reset" data-question="${q.id}">↻ ${text('tryAgain')}</button>`:''}${answer?.correct?`<button class="primary" data-action="retry-next" data-question="${q.id}">${text('continueRetry')} →</button>`:''}`;
  }
  function completeLesson() {
    if(session.completed)return false;
    const first=!new Set(profile.completedLessons||[]).has(LESSON_ID); session.completed=true; session.step=SCREENS.length-1;
    profile=global.NikigoState?.update?.(completionPatch,'lesson-07:complete')||completionPatch(profile);
    global.localStorage.setItem(SESSION_KEY,JSON.stringify(session)); completionAwardedThisView=first; return first;
  }
  function renderComplete() { completeLesson(); return `<div class="complete"><div class="completeMark">✓</div><span class="eyebrow">${text('completeTag')}</span><h1>${text('completeTitle')}</h1><p class="lead centered">${text('completeLead')}</p><div class="rewards"><span class="reward">✦ ${text(completionAwardedThisView?'xpEarned':'xpClaimed')}</span><span class="reward">✓ ${text('progressSaved')}</span></div><div class="repeatActions"><button class="ghost" data-action="review">↻ ${text('reviewLesson')}</button><button class="primary" data-action="home">${text('returnCourses')} →</button></div></div>`; }
  function allowed(screen) { if(screen==='split')return allCorrect(SPLIT_QUESTIONS,'splitAnswers'); if(screen==='build')return session.built.length===4; if(screen==='recognize')return allCorrect(RECOGNIZE_QUESTIONS,'recognizeAnswers'); if(screen==='retry')return session.mistakes.length===0; return true; }
  function answerQuestion(key,questions,id,choice) { const q=questions.find(item=>item.id===id); if(!q||session[key][id]?.correct)return; session[key][id]={choice,correct:choice===q.correct}; }
  function render() {
    document.documentElement.lang=language==='zh'?'zh-CN':language; document.getElementById('language').value=language; document.getElementById('lessonName').textContent=text('lessonName'); document.getElementById('progressLabel').textContent=text('progress');
    for(const id of ['homeButton','homeLogo']){document.getElementById(id).setAttribute('aria-label',text('home'));document.getElementById(id).title=text('home');}
    const percent=Math.round(session.step/(SCREENS.length-1)*100); document.getElementById('progressCount').textContent=`${session.step+1} / ${SCREENS.length}`; document.getElementById('progressBar').style.width=`${percent}%`; document.getElementById('progressTrack').setAttribute('aria-valuenow',String(percent));
    const screen=SCREENS[session.step], renderers={intro:renderIntro,structure:renderStructure,san:()=>renderExample('san'),mom:()=>renderExample('mom'),gong:()=>renderExample('gong'),mul:()=>renderExample('mul'),compare:renderCompare,split:renderSplit,build:renderBuild,recognize:renderRecognize,challenge:renderChallenge,retry:renderRetry,complete:renderComplete};
    document.getElementById('lessonStage').innerHTML=`${releaseNotice()}${renderers[screen]()}`;
  }
  function goHome(){global.location.href=`nikigo-app.html?lang=${language}#courses`;}

  document.addEventListener('click',event=>{
    const button=event.target.closest('button'); if(!button)return; const action=button.dataset.action;
    if(button.id==='homeButton'||button.id==='homeLogo'||action==='home'){goHome();return;}
    if(action==='base-audio'){playBaseSyllableAudio();return;}
    if(action==='review'){session=blankSession();saveSession();render();global.scrollTo(0,0);return;}
    if(action==='back')session.step=Math.max(0,session.step-1);
    else if(action==='next'){const screen=SCREENS[session.step];if(!allowed(screen))return;session.step=Math.min(SCREENS.length-1,session.step+1);}
    else if(action==='split-answer')answerQuestion('splitAnswers',SPLIT_QUESTIONS,button.dataset.question,button.dataset.value);
    else if(action==='recognize-answer')answerQuestion('recognizeAnswers',RECOGNIZE_QUESTIONS,button.dataset.question,button.dataset.value);
    else if(action==='builder-pick'){if(button.dataset.kind==='base')session.base=button.dataset.value;else session.final=button.dataset.value;}
    else if(action==='build'){const result=buildResult();if(result&&!session.built.includes(result))session.built.push(result);}
    else if(action==='start-challenge')session.challengeStarted=true;
    else if(action==='challenge-answer'){const q=CHALLENGE.find(item=>item.id===button.dataset.question);if(q&&!session.challengeAnswers[q.id]){session.challengeAnswers[q.id]={choice:button.dataset.value,correct:button.dataset.value===q.correct};if(button.dataset.value!==q.correct&&!session.mistakes.includes(q.id))session.mistakes.push(q.id);}}
    else if(action==='next-question'){if(!session.challengeAnswers[CHALLENGE[session.challengeIndex].id])return;session.challengeIndex=Math.min(4,session.challengeIndex+1);}
    else if(action==='previous-question')session.challengeIndex=Math.max(0,session.challengeIndex-1);
    else if(action==='retry-answer'){const q=CHALLENGE.find(item=>item.id===button.dataset.question);if(q&&!session.retryAnswers[q.id])session.retryAnswers[q.id]={choice:button.dataset.value,correct:button.dataset.value===q.correct};}
    else if(action==='retry-reset')delete session.retryAnswers[button.dataset.question];
    else if(action==='retry-next'){if(session.retryAnswers[button.dataset.question]?.correct){session.mistakes=session.mistakes.filter(id=>id!==button.dataset.question);delete session.retryAnswers[button.dataset.question];}}
    saveSession();render();global.scrollTo(0,0);
  });
  document.getElementById('language').addEventListener('change',event=>{language=LANGUAGES.includes(event.target.value)?event.target.value:'en';profile=global.NikigoState?.update?.({interfaceLanguage:language,learningLanguage:language},'lesson-07:language')||profile;saveSession();render();});
  render();

  global.NikigoLesson07Test = Object.freeze({ lessonId:LESSON_ID, screens:[...SCREENS], examples:EXAMPLES, buildMap:BUILD_MAP, splitQuestions:SPLIT_QUESTIONS, recognizeQuestions:RECOGNIZE_QUESTIONS, challenge:CHALLENGE, ui:UI, blankSession, normalizeSession, completionPatch });
})(window);
