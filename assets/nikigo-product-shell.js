import { buildContentRegistry } from '../content-registry.js';
import { selectHomeRecommendation, RECOMMENDATION_COPY } from '../recommendation-policy.js';
import { getLearningPrimaryContent, buildStageChapterViewModel } from '../progress-selectors.js';
import { STAGE_CHAPTER_TAXONOMY } from '../stage-chapter-taxonomy.js';

const courses = Array.isArray(window.NIKIGO_COURSES) ? window.NIKIGO_COURSES : [];
const contents = buildContentRegistry(courses, { taxonomy:STAGE_CHAPTER_TAXONOMY });
const byRoute = new Map(contents.map(content => [content.route, content]));

function parseSession(contentId) {
  try {
    return JSON.parse(window.localStorage.getItem(`nikigoLessonSession:${contentId}`) || 'null');
  } catch {
    return null;
  }
}

function reliableCurrentSession(profile) {
  const inProgress = contents.filter(content => {
    const progress = Number(profile?.lessonProgress?.[content.stableId]) || 0;
    if (progress <= 0 || progress >= 100) return false;
    const session = parseSession(content.stableId);
    const position = Number(session?.step ?? session?.index);
    return session && session.completed !== true && Number.isFinite(position) && position > 0;
  });
  if (inProgress.length !== 1) return null;
  const session = parseSession(inProgress[0].stableId);
  return Object.freeze({
    contentId:inProgress[0].stableId,
    resumable:true,
    isCurrent:true,
    position:Number(session?.step ?? session?.index) || 0
  });
}

function reliableReferrerContent(profile) {
  if (!document.referrer) return null;
  try {
    const referrer = new URL(document.referrer);
    if (referrer.origin !== location.origin) return null;
    const file = referrer.pathname.split('/').pop();
    const content = byRoute.get(file);
    if (!content) return null;
    if ((profile?.completedLessons || []).includes(content.stableId)) return null;
    return content.stableId;
  } catch {
    return null;
  }
}

function dueReviews(profile) {
  if (window.NikigoState?.dueReviews) return window.NikigoState.dueReviews({ limit:100 });
  return Array.isArray(profile?.reviewItems) ? profile.reviewItems : [];
}

function rebuild(profile = window.NikigoAppData || {}, language = profile.interfaceLanguage || 'en') {
  const currentSession = reliableCurrentSession(profile);
  const recommendation = selectHomeRecommendation({
    profile,
    contents,
    currentSession,
    reliableRecentContentId:reliableReferrerContent(profile),
    dueReviews:dueReviews(profile)
  });
  const learningPrimary = getLearningPrimaryContent({
    profile,
    contents,
    stageId:profile.path,
    activeContentId:recommendation.primaryAction.kind === 'resume-active'
      ? recommendation.primaryAction.contentId
      : null
  });
  const currentContentId = learningPrimary?.stableId || null;
  const taxonomyView = buildStageChapterViewModel({
    profile,
    contents,
    taxonomy:STAGE_CHAPTER_TAXONOMY,
    currentStageId:learningPrimary?.stageId || profile.path,
    currentContentId
  });
  const safeLanguage = ['zh', 'en', 'vi', 'ja'].includes(language) ? language : 'en';
  const value = Object.freeze({
    contents,
    recommendation,
    primaryAction:recommendation.primaryAction,
    primaryActionLabel:RECOMMENDATION_COPY[safeLanguage][recommendation.primaryAction.labelKey],
    learningPrimary,
    learningSession:currentSession,
    taxonomy:STAGE_CHAPTER_TAXONOMY,
    taxonomyView
  });
  window.NikigoProductArchitecture = value;
  return value;
}

window.NikigoRefreshProductArchitecture = rebuild;
rebuild();
window.NikigoAppRenderCurrent?.();
