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

function getHistoricalChapterRecord(profile, chapterId) {
  const record = profile?.taxonomyCompletions?.[chapterId];
  if (!record || typeof record !== 'object') return null;
  return record;
}

function buildStageChapterViewModel(options = {}) {
  const profile = options.profile || {};
  const contents = Array.isArray(options.contents) ? options.contents : [];
  const taxonomy = options.taxonomy;
  if (!taxonomy || !Array.isArray(taxonomy.stages) || !Array.isArray(taxonomy.chapters)) {
    throw new TypeError('An explicit stage/chapter taxonomy is required.');
  }
  const byId = new Map(contents.map(content => [content.stableId, content]));
  const complete = completedSet(profile);
  const currentContentId = options.currentContentId || null;
  const currentPlacement = taxonomy.lessonMap?.[currentContentId] || null;
  const requestedStageId = options.currentStageId || profile.path || currentPlacement?.stageId || null;
  const activeStageId = taxonomy.stages.some(item => item.stageId === requestedStageId)
    ? requestedStageId
    : (currentPlacement?.stageId || taxonomy.stages[0]?.stageId || null);

  const stages = [...taxonomy.stages]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(stage => {
      const chapters = taxonomy.chapters
        .filter(chapter => chapter.stageId === stage.stageId)
        .sort((a, b) => a.moduleDisplayOrder - b.moduleDisplayOrder)
        .map(chapter => {
          const chapterContents = chapter.contentIds
            .map(stableId => byId.get(stableId))
            .filter(Boolean)
            .sort((a, b) => a.displayOrder - b.displayOrder);
          const gatedContents = chapterContents.filter(content => content.formallyCompletable === false);
          const completedCount = chapterContents.filter(content =>
            content.formallyCompletable !== false && complete.has(content.stableId)
          ).length;
          const previewPendingCount = gatedContents.length;
          const formallyCompletableContents = chapterContents.filter(content => content.formallyCompletable !== false);
          const currentCompletableContentComplete = formallyCompletableContents.length > 0
            && formallyCompletableContents.every(content => complete.has(content.stableId));
          const formallyComplete = previewPendingCount === 0
            && chapterContents.length > 0
            && chapterContents.every(content => complete.has(content.stableId));
          const status = formallyComplete
            ? 'complete'
            : (previewPendingCount > 0 && currentCompletableContentComplete
              ? (chapter.completionPolicy?.auxiliaryStatus || 'available-content-complete')
              : (completedCount > 0 ? 'in-progress' : 'not-started'));
          const historical = getHistoricalChapterRecord(profile, chapter.chapterId);
          const historicalContentIds = Array.isArray(historical?.contentIds) ? historical.contentIds : [];
          const newContentAvailable = historical?.historicalCompletion === true
            && chapter.contentIds.some(stableId => !historicalContentIds.includes(stableId));
          const isCurrent = currentPlacement?.chapterId === chapter.chapterId
            || (!currentPlacement && stage.stageId === activeStageId
              && chapterContents.some(content => content.stableId === currentContentId));

          return Object.freeze({
            taxonomyVersion:taxonomy.taxonomyVersion,
            stageId:stage.stageId,
            chapterId:chapter.chapterId,
            moduleDisplayOrder:chapter.moduleDisplayOrder,
            name:chapter.name,
            objective:chapter.objective,
            contentIds:Object.freeze(chapterContents.map(content => content.stableId)),
            contents:Object.freeze(chapterContents),
            historicalCompletion:historical?.historicalCompletion === true,
            historicalCompletedAt:typeof historical?.historicalCompletedAt === 'string'
              ? historical.historicalCompletedAt
              : null,
            currentVersionProgress:Object.freeze({
              completedCount,
              totalCount:chapterContents.length,
              percent:chapterContents.length ? Math.round((completedCount / chapterContents.length) * 100) : 0,
              status,
              formallyComplete,
              currentCompletableContentComplete,
              previewPendingCount
            }),
            newContentAvailable,
            isCurrent,
            expanded:isCurrent
          });
        });
      const stageCompletedCount = chapters.reduce((sum, chapter) =>
        sum + chapter.currentVersionProgress.completedCount, 0);
      const stageTotalCount = chapters.reduce((sum, chapter) =>
        sum + chapter.currentVersionProgress.totalCount, 0);
      const isCurrent = stage.stageId === activeStageId;
      let normalizedChapters = chapters;
      if (isCurrent && !chapters.some(chapter => chapter.expanded)) {
        const firstIncomplete = chapters.find(chapter => !chapter.currentVersionProgress.formallyComplete) || chapters[0];
        normalizedChapters = chapters.map(chapter => Object.freeze({
          ...chapter,
          isCurrent:chapter.chapterId === firstIncomplete?.chapterId,
          expanded:chapter.chapterId === firstIncomplete?.chapterId
        }));
      }
      return Object.freeze({
        taxonomyVersion:taxonomy.taxonomyVersion,
        stageId:stage.stageId,
        displayOrder:stage.displayOrder,
        name:stage.name,
        label:stage.label,
        objective:stage.objective,
        completedCount:stageCompletedCount,
        totalCount:stageTotalCount,
        isCurrent,
        expanded:isCurrent,
        chapters:Object.freeze(normalizedChapters)
      });
    });

  return Object.freeze({
    taxonomyVersion:taxonomy.taxonomyVersion,
    currentStageId:activeStageId,
    currentChapterId:stages.flatMap(stage => stage.chapters).find(chapter => chapter.isCurrent)?.chapterId || null,
    stages:Object.freeze(stages)
  });
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
  isStageComplete,
  buildStageChapterViewModel
};
