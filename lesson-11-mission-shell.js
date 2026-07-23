(function (global) {
  'use strict';

  const L = (zh,en,vi,ja) => Object.freeze({zh,en,vi,ja});
  const phases = Object.freeze([
    Object.freeze({id:'story',firstStepId:'intro',minutes:1,name:L('故事开始','Story begins','Câu chuyện bắt đầu','ストーリー開始'),goal:L('了解这次见面的任务和完成目标。','Understand the first-meeting mission and its outcome.','Hiểu nhiệm vụ gặp mặt lần đầu và mục tiêu hoàn thành.','初対面ミッションと到達目標を確認します。')}),
    Object.freeze({id:'listening',firstStepId:'first-scene',minutes:3,name:L('先听后学','Listen before learning','Nghe trước khi học','まず聞いて学ぶ'),goal:L('先经历完整交流，再逐步理解每一句。','Experience the complete exchange before unpacking each line.','Trải nghiệm toàn bộ hội thoại rồi mới hiểu từng câu.','会話全体を体験してから、一文ずつ理解します。')}),
    Object.freeze({id:'core',firstStepId:'name-response',minutes:4,name:L('核心表达','Core expressions','Biểu đạt cốt lõi','コア表現'),goal:L('掌握询问姓名、介绍姓名和礼貌回应。','Master asking a name, introducing one, and responding politely.','Nắm cách hỏi tên, giới thiệu tên và đáp lại lịch sự.','名前の質問・紹介・丁寧な応答を身につけます。')}),
    Object.freeze({id:'understand',firstStepId:'build-name',minutes:3,name:L('理解训练','Understanding practice','Luyện hiểu','理解トレーニング'),goal:L('看懂词块作用并选择正确的表达形式。','Understand each block and choose the right form.','Hiểu vai trò từng khối từ và chọn đúng dạng biểu đạt.','語句の役割を理解し、正しい形を選びます。')}),
    Object.freeze({id:'imitate',firstStepId:'identity-words',minutes:2,name:L('模仿训练','Pattern practice','Luyện theo mẫu','パターン練習'),goal:L('用身份词替换练习固定句型；标准音频尚未发布。','Substitute identity words in the fixed pattern; model audio is not published.','Thay từ chỉ thân phận trong mẫu cố định; âm thanh mẫu chưa phát hành.','立場語を入れ替えて固定文型を練習します。標準音声は未公開です。')}),
    Object.freeze({id:'respond',firstStepId:'meeting-flow',minutes:3,name:L('现场反应','Respond in the scene','Phản hồi tại chỗ','場面で応答'),goal:L('沿着真实交流顺序完成身份介绍和回应。','Follow the exchange to introduce an identity and respond.','Theo mạch hội thoại để giới thiệu thân phận và đáp lại.','会話の流れに沿って立場を紹介し、応答します。')}),
    Object.freeze({id:'challenge',firstStepId:'final-scene',minutes:1,name:L('完成体验','Complete the experience','Hoàn thành trải nghiệm','体験を完了'),goal:L('独立判断哪段交流符合本课范围。','Independently identify the exchange within this lesson.','Tự xác định đoạn hội thoại phù hợp phạm vi bài.','本課の範囲に合う会話を自分で判断します。')}),
    Object.freeze({id:'summary',firstStepId:'complete',minutes:1,name:L('巩固能力','Consolidate the skill','Củng cố năng lực','能力を定着'),goal:L('确认能力、错题重练和完成边界。','Confirm ability, targeted retry, and completion boundaries.','Xác nhận năng lực, luyện lại câu sai và ranh giới hoàn thành.','能力・間違いの再練習・完了境界を確認します。')})
  ]);

  const stepPhase = Object.freeze({
    intro:0,
    'first-scene':1,
    'name-response':2,
    'phrase-role':2,
    'copula-rule':2,
    'build-name':3,
    'ending-choice':3,
    'identity-words':4,
    'meeting-flow':5,
    'build-identity':5,
    'reply-choice':5,
    'final-scene':6,
    complete:7
  });

  const copy = Object.freeze({
    zh:Object.freeze({complete:'已完成',current:'当前阶段',upcoming:'后续阶段',open:'打开',collapse:'收起',previous:'上一阶段',next:'下一阶段',continue:'继续本阶段',completePhase:'完成本阶段',previousTask:'现在轮到你了',previousDone:'本阶段已完成',audioPending:'标准音频准备中',audioPendingCopy:'当前对话可阅读，非音频任务可以继续。',dialogueHistory:'已经发生的对话',partner:'对方',you:'你',exitTitle:'退出课程？',exitCopy:'当前步骤和已作答内容会保留，下次可以继续。',stay:'继续学习',exit:'返回学习路径',minutes:'分钟',courseNavigation:'课程导航',stageContext:'阶段2 · 基础沟通',moduleContext:'姓名、身份与语言背景'}),
    en:Object.freeze({complete:'Complete',current:'Current phase',upcoming:'Later phase',open:'Open',collapse:'Collapse',previous:'Previous phase',next:'Next phase',continue:'Continue phase',completePhase:'Complete phase',previousTask:'Now it is your turn',previousDone:'Phase complete',audioPending:'Model audio preparing',audioPendingCopy:'Read the dialogue now and continue every non-audio task.',dialogueHistory:'Dialogue so far',partner:'Partner',you:'You',exitTitle:'Exit the lesson?',exitCopy:'Your current step and answers will be saved so you can continue later.',stay:'Keep learning',exit:'Return to learning path',minutes:'min',courseNavigation:'Course navigation',stageContext:'Stage 2 · Essential Korean',moduleContext:'Names, Identity, and Language Background'}),
    vi:Object.freeze({complete:'Đã xong',current:'Giai đoạn hiện tại',upcoming:'Giai đoạn sau',open:'Mở',collapse:'Thu gọn',previous:'Giai đoạn trước',next:'Giai đoạn sau',continue:'Tiếp tục giai đoạn',completePhase:'Hoàn thành giai đoạn',previousTask:'Bây giờ đến lượt bạn',previousDone:'Đã hoàn thành giai đoạn',audioPending:'Đang chuẩn bị âm thanh mẫu',audioPendingCopy:'Bạn có thể đọc hội thoại và tiếp tục mọi nhiệm vụ không dùng âm thanh.',dialogueHistory:'Hội thoại đã diễn ra',partner:'Đối phương',you:'Bạn',exitTitle:'Thoát bài học?',exitCopy:'Bước hiện tại và câu trả lời sẽ được lưu để bạn tiếp tục sau.',stay:'Tiếp tục học',exit:'Về lộ trình học',minutes:'phút',courseNavigation:'Điều hướng bài học',stageContext:'Giai đoạn 2 · Giao tiếp tiếng Hàn cơ bản',moduleContext:'Tên, thân phận và nền tảng ngôn ngữ'}),
    ja:Object.freeze({complete:'完了',current:'現在の段階',upcoming:'後の段階',open:'開く',collapse:'閉じる',previous:'前の段階',next:'次の段階',continue:'この段階を続ける',completePhase:'この段階を完了',previousTask:'次はあなたの番です',previousDone:'この段階は完了',audioPending:'標準音声準備中',audioPendingCopy:'会話を読み、音声なしの課題を続けられます。',dialogueHistory:'ここまでの会話',partner:'相手',you:'あなた',exitTitle:'レッスンを終了しますか？',exitCopy:'現在のステップと回答は保存され、次回続きから学べます。',stay:'学習を続ける',exit:'学習パスへ戻る',minutes:'分',courseNavigation:'コースナビゲーション',stageContext:'ステージ2 · 韓国語の基本コミュニケーション',moduleContext:'名前・立場・言語背景'})
  });

  const phaseByStep = Object.freeze(Object.keys(stepPhase).map(stepId => stepPhase[stepId]));
  const languageCopy = language => copy[copy[language] ? language : 'en'];
  const phaseForStep = stepId => Number.isInteger(stepPhase[stepId]) ? stepPhase[stepId] : 0;
  const phaseStepIndexes = (config,index) => config.steps.map((step,stepIndex) => phaseForStep(step.id) === index ? stepIndex : -1).filter(index => index >= 0);

  global.NikigoLesson11Mission = Object.freeze({
    phases,
    stepPhase,
    phaseByStep,
    languageCopy,
    phaseForStep,
    phaseStepIndexes
  });
})(window);
