function finitePercent(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return 0;
  return Math.max(0, Math.min(100, number));
}

function completedSet(profile) {
  return new Set(Array.isArray(profile?.completedLessons) ? profile.completedLessons : []);
}

function getContentProgress(profile, contentId) {
  if (completedSet(profile).has(contentId)) return 100;
  return finitePercent(profile?.lessonProgress?.[contentId]);
}

function isContentCompleted(profile, contentId) {
  return completedSet(profile).has(contentId) || getContentProgress(profile, contentId) === 100;
}

function isContentInProgress(profile, contentId) {
  const percent = getContentProgress(profile, contentId);
  return percent > 0 && percent < 100;
}

function getInProgressContents(profile, contents) {
  return Object.freeze((contents || []).filter(content =>
    content.available && isContentInProgress(profile, content.stableId)
  ));
}

function validActivityTime(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string' || !value.trim()) return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function findActiveUnfinishedContent(options = {}) {
  const {
    profile,
    contents,
    currentSession,
    reliableRecentContentId,
    trustedLastActivityByContent
  } = options;
  const unfinished = (contents || []).filter(content =>
    content.available && !isContentCompleted(profile, content.stableId)
  );
  const byId = new Map(unfinished.map(content => [content.stableId, content]));

  if (currentSession?.resumable === true && currentSession?.isCurrent === true) {
    const active = byId.get(currentSession.contentId);
    if (active) return Object.freeze({ content:active, source:'current-session' });
  }

  if (typeof reliableRecentContentId === 'string' && byId.has(reliableRecentContentId)) {
    return Object.freeze({ content:byId.get(reliableRecentContentId), source:'reliable-recent-content' });
  }

  const dated = unfinished.map(content => ({
    content,
    at: validActivityTime(trustedLastActivityByContent?.[content.stableId])
  })).filter(item => item.at !== null);
  if (dated.length === 0) return null;
  const latest = Math.max(...dated.map(item => item.at));
  const latestItems = dated.filter(item => item.at === latest);
  if (latestItems.length !== 1) return null;
  return Object.freeze({ content:latestItems[0].content, source:'last-activity-at' });
}

function getHistoricalUnfinishedContents(options = {}) {
  const inProgress = getInProgressContents(options.profile, options.contents);
  const activeId = options.activeContentId || null;
  return Object.freeze(inProgress.filter(content => content.stableId !== activeId));
}

function getDueReviewItems(profile, options = {}) {
  const now = Number.isFinite(Number(options.now)) ? Number(options.now) : Date.now();
  return Object.freeze((Array.isArray(profile?.reviewItems) ? profile.reviewItems : [])
    .filter(item => item?.status !== 'mastered' && Number.isFinite(Date.parse(item?.dueAt)) && Date.parse(item.dueAt) <= now)
    .sort((a, b) => Date.parse(a.dueAt) - Date.parse(b.dueAt)));
}

function getRecommendedNextContent(profile, contents, stageId) {
  return (contents || [])
    .filter(content => content.available
      && content.formallyCompletable
      && content.stageId === stageId
      && !isContentCompleted(profile, content.stableId))
    .sort((a, b) => a.displayOrder - b.displayOrder)[0] || null;
}

function isStageComplete(profile, contents, stageId) {
  const stageContents = (contents || []).filter(content =>
    content.available && content.formallyCompletable && content.stageId === stageId
  );
  return stageContents.length > 0
    && stageContents.every(content => isContentCompleted(profile, content.stableId));
}

export {
  getContentProgress,
  isContentCompleted,
  isContentInProgress,
  getInProgressContents,
  findActiveUnfinishedContent,
  getHistoricalUnfinishedContents,
  getDueReviewItems,
  getRecommendedNextContent,
  isStageComplete
};
