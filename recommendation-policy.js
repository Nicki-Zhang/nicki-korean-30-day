import {
  findActiveUnfinishedContent,
  getDueReviewItems,
  getHistoricalUnfinishedContents,
  getRecommendedNextContent,
  isStageComplete
} from './progress-selectors.js';
import {
  resolveAppRoute,
  resolveContentRoute
} from './route-registry.js';

const SUPPORTED_LANGUAGES = Object.freeze(['zh', 'en', 'vi', 'ja']);
const VALID_STAGES = /^K[0-4]$/u;

const RECOMMENDATION_COPY = Object.freeze({
  zh: Object.freeze({
    'recommendation.setup': '完成学习设置',
    'recommendation.resume': '继续当前课程',
    'recommendation.resumePreview': '继续课程预览',
    'recommendation.review': '开始到期复习',
    'recommendation.next': '开始推荐课程',
    'recommendation.stageComplete': '查看阶段进度',
    'recommendation.freeChoice': '自由选择课程'
  }),
  en: Object.freeze({
    'recommendation.setup': 'Complete learning setup',
    'recommendation.resume': 'Continue current course',
    'recommendation.resumePreview': 'Continue course preview',
    'recommendation.review': 'Start due review',
    'recommendation.next': 'Start recommended course',
    'recommendation.stageComplete': 'View stage progress',
    'recommendation.freeChoice': 'Choose any course'
  }),
  vi: Object.freeze({
    'recommendation.setup': 'Hoàn tất thiết lập học tập',
    'recommendation.resume': 'Tiếp tục bài học hiện tại',
    'recommendation.resumePreview': 'Tiếp tục bản xem trước bài học',
    'recommendation.review': 'Bắt đầu ôn tập đến hạn',
    'recommendation.next': 'Bắt đầu bài học được đề xuất',
    'recommendation.stageComplete': 'Xem tiến độ giai đoạn',
    'recommendation.freeChoice': 'Tự chọn bài học'
  }),
  ja: Object.freeze({
    'recommendation.setup': '学習設定を完了する',
    'recommendation.resume': '現在のコースを続ける',
    'recommendation.resumePreview': 'コースのプレビューを続ける',
    'recommendation.review': '期限の復習を始める',
    'recommendation.next': 'おすすめコースを始める',
    'recommendation.stageComplete': 'ステージの進捗を見る',
    'recommendation.freeChoice': 'コースを自由に選ぶ'
  })
});

function requiredSetup(profile) {
  const interfaceLanguageReady = SUPPORTED_LANGUAGES.includes(profile?.interfaceLanguage);
  const learningLanguageReady = SUPPORTED_LANGUAGES.includes(profile?.learningLanguage);
  const stageReady = typeof profile?.path === 'string' && VALID_STAGES.test(profile.path);
  if (!interfaceLanguageReady || !learningLanguageReady) return 'language';
  if (!stageReady) return 'starting-point';
  return null;
}

function primaryAction(kind, options = {}) {
  return Object.freeze({
    kind,
    contentId: options.contentId || null,
    route: options.route,
    labelKey: options.labelKey,
    reasonKey: options.reasonKey,
    previewOnly: options.previewOnly === true,
    metadata: Object.freeze({ ...(options.metadata || {}) })
  });
}

function selectHomeRecommendation(options = {}) {
  const profile = options.profile || {};
  const contents = Array.isArray(options.contents) ? options.contents : [];
  const setupStep = requiredSetup(profile);
  const language = SUPPORTED_LANGUAGES.includes(profile.interfaceLanguage) ? profile.interfaceLanguage : undefined;

  if (setupStep) {
    return Object.freeze({
      primaryAction: primaryAction('required-setup', {
        route: resolveAppRoute('setup', { language }),
        labelKey: 'recommendation.setup',
        reasonKey: `setup.${setupStep}`,
        metadata: { setupStep }
      }),
      secondary: Object.freeze({ inProgressContentIds:Object.freeze([]) })
    });
  }

  const active = findActiveUnfinishedContent({
    profile,
    contents,
    currentSession: options.currentSession,
    reliableRecentContentId: options.reliableRecentContentId,
    trustedLastActivityByContent: options.trustedLastActivityByContent
  });
  const historical = getHistoricalUnfinishedContents({
    profile,
    contents,
    activeContentId: active?.content.stableId
  });
  const secondary = Object.freeze({
    inProgressContentIds: Object.freeze(historical.map(content => content.stableId))
  });

  if (active) {
    const previewOnly = active.content.formallyCompletable === false;
    return Object.freeze({
      primaryAction: primaryAction('resume-active', {
        contentId: active.content.stableId,
        route: resolveContentRoute(active.content, { language }),
        labelKey: previewOnly ? 'recommendation.resumePreview' : 'recommendation.resume',
        reasonKey: `active.${active.source}`,
        previewOnly,
        metadata: { activeSource:active.source }
      }),
      secondary
    });
  }

  const dueReviews = Array.isArray(options.dueReviews)
    ? options.dueReviews
    : getDueReviewItems(profile, { now:options.now });
  if (dueReviews.length > 0) {
    return Object.freeze({
      primaryAction: primaryAction('due-review', {
        route: resolveAppRoute('practice', { language }),
        labelKey: 'recommendation.review',
        reasonKey: 'review.due',
        metadata: { dueCount:dueReviews.length }
      }),
      secondary
    });
  }

  const next = getRecommendedNextContent(profile, contents, profile.path);
  if (next) {
    return Object.freeze({
      primaryAction: primaryAction('recommended-next', {
        contentId: next.stableId,
        route: resolveContentRoute(next, { language }),
        labelKey: 'recommendation.next',
        reasonKey: 'path.next-available',
        metadata: { stageId:profile.path }
      }),
      secondary
    });
  }

  if (isStageComplete(profile, contents, profile.path)) {
    return Object.freeze({
      primaryAction: primaryAction('stage-complete', {
        route: resolveAppRoute('progress', { language }),
        labelKey: 'recommendation.stageComplete',
        reasonKey: 'stage.complete',
        metadata: { stageId:profile.path }
      }),
      secondary
    });
  }

  return Object.freeze({
    primaryAction: primaryAction('free-choice', {
      route: resolveAppRoute('learn', { language }),
      labelKey: 'recommendation.freeChoice',
      reasonKey: 'path.unavailable'
    }),
    secondary
  });
}

function validateRecommendationCopy() {
  const referenceKeys = Object.keys(RECOMMENDATION_COPY.en);
  const issues = [];
  for (const language of SUPPORTED_LANGUAGES) {
    for (const key of referenceKeys) {
      if (typeof RECOMMENDATION_COPY[language]?.[key] !== 'string' || !RECOMMENDATION_COPY[language][key].trim()) {
        issues.push(`${language}:${key}`);
      }
    }
    for (const key of Object.keys(RECOMMENDATION_COPY[language] || {})) {
      if (!referenceKeys.includes(key)) issues.push(`${language}:unexpected:${key}`);
    }
  }
  return Object.freeze({ valid:issues.length === 0, issues:Object.freeze(issues) });
}

export {
  RECOMMENDATION_COPY,
  requiredSetup,
  selectHomeRecommendation,
  validateRecommendationCopy
};
