import {
  buildStageChapterViewModel,
  getContentProgress,
  getRecommendedNextContent,
  isContentCompleted
} from '../progress-selectors.js';
import { STAGE_CHAPTER_TAXONOMY } from '../stage-chapter-taxonomy.js';

const SUPPORTED_LANGUAGES = Object.freeze(['zh', 'en', 'vi', 'ja']);
const LEARN_STAGE_PARAM = 'learnStage';
const LEARN_MODULE_PARAM = 'learnModule';
const LAST_STAGE_KEY = 'nikigoLearnView:v1';

const STAGE_ART = Object.freeze({
  K0:'assets/nikigo-learn-v4/stage-k0.webp',
  K1:'assets/nikigo-learn-v4/stage-k1.webp'
});

const MODULE_ART = Object.freeze({
  'k0-hangul-map-and-vowels':'assets/nikigo-learn-v4/module-k0-map-vowels.webp',
  'k0-consonants-syllables-compound-vowels':'assets/nikigo-learn-v4/module-k0-consonants-syllables.webp',
  'k0-batchim-and-sound-changes':'assets/nikigo-learn-v4/module-k0-batchim-sound.webp',
  'k0-integrated-use-and-checkpoint':'assets/nikigo-learn-v4/module-k0-checkpoint.webp',
  'k1-identity-and-language-background':'assets/nikigo-learn-v4/module-k1-identity.webp',
  'k1-numbers-and-quantities':'assets/nikigo-learn-v4/module-k1-numbers.webp'
});

const COPY = Object.freeze({
  zh:Object.freeze({
    intro:'选择阶段，沿着清楚的Module路径继续学习。', currentStage:'当前阶段', stageProgress:'Stage进度',
    lessonsComplete:'{completed} / {total}课完成', pathTitle:'学习路径', pathLead:'连接线表示推荐顺序，不限制课程自由进入。',
    learning:'正在学习', completed:'已完成', available:'可学习', inProgress:'继续学习', gate:'预览 · 音频准备中',
    continue:'继续学习', start:'开始学习', relearn:'重新学习', preview:'进入预览', moduleDetail:'查看模块',
    currentContentComplete:'当前可完成内容已学完', audioPreparing:'{count}课音频准备中',
    back:'返回Stage路径', moduleProgress:'Module进度', moduleLessons:'本Module课程',
    lesson:'第{number}课', minutes:'{count}分钟', chooseStage:'选择学习阶段', moduleNumber:'Module {number}',
    directAccess:'所有已开放课程都可自由进入。', noPrimary:'当前阶段的正式课程已学完，你仍可重新学习任意课程。'
  }),
  en:Object.freeze({
    intro:'Choose a stage and continue along a clear Module path.', currentStage:'Current stage', stageProgress:'Stage progress',
    lessonsComplete:'{completed} of {total} lessons complete', pathTitle:'Learning path', pathLead:'The connector shows recommended order; it never locks course access.',
    learning:'Learning now', completed:'Completed', available:'Available', inProgress:'Continue learning', gate:'Preview · Audio in preparation',
    continue:'Continue learning', start:'Start learning', relearn:'Relearn', preview:'Open preview', moduleDetail:'View module',
    currentContentComplete:'Current completable content finished', audioPreparing:'{count} lesson awaiting audio',
    back:'Back to Stage path', moduleProgress:'Module progress', moduleLessons:'Lessons in this Module',
    lesson:'Lesson {number}', minutes:'{count} min', chooseStage:'Choose learning stage', moduleNumber:'Module {number}',
    directAccess:'Every available lesson remains freely accessible.', noPrimary:'The formally completable lessons in this Stage are finished. You can still relearn any lesson.'
  }),
  vi:Object.freeze({
    intro:'Chọn giai đoạn và tiếp tục theo lộ trình Module rõ ràng.', currentStage:'Giai đoạn hiện tại', stageProgress:'Tiến độ Stage',
    lessonsComplete:'Hoàn thành {completed} / {total} bài', pathTitle:'Lộ trình học', pathLead:'Đường nối chỉ thứ tự đề xuất, không khóa quyền truy cập khóa học.',
    learning:'Đang học', completed:'Đã hoàn thành', available:'Có thể học', inProgress:'Tiếp tục học', gate:'Xem trước · Đang chuẩn bị âm thanh',
    continue:'Tiếp tục học', start:'Bắt đầu học', relearn:'Học lại', preview:'Mở bản xem trước', moduleDetail:'Xem Module',
    currentContentComplete:'Đã học xong nội dung hiện có thể hoàn thành', audioPreparing:'{count} bài đang chuẩn bị âm thanh',
    back:'Quay lại lộ trình Stage', moduleProgress:'Tiến độ Module', moduleLessons:'Bài học trong Module',
    lesson:'Bài {number}', minutes:'{count} phút', chooseStage:'Chọn giai đoạn học', moduleNumber:'Module {number}',
    directAccess:'Mọi bài đã mở đều có thể vào tự do.', noPrimary:'Đã hoàn thành các bài có thể hoàn tất chính thức trong giai đoạn này. Bạn vẫn có thể học lại bất kỳ bài nào.'
  }),
  ja:Object.freeze({
    intro:'ステージを選び、わかりやすいModuleの道筋に沿って学びます。', currentStage:'現在のステージ', stageProgress:'Stage進捗',
    lessonsComplete:'{completed} / {total}課完了', pathTitle:'学習パス', pathLead:'接続線は推奨順序を示すだけで、コースへのアクセスを制限しません。',
    learning:'学習中', completed:'完了', available:'学習可能', inProgress:'学習を続ける', gate:'プレビュー · 音声準備中',
    continue:'学習を続ける', start:'学習を始める', relearn:'もう一度学ぶ', preview:'プレビューへ', moduleDetail:'Moduleを見る',
    currentContentComplete:'現在完了できる内容は学習済み', audioPreparing:'{count}課の音声を準備中',
    back:'Stageパスに戻る', moduleProgress:'Module進捗', moduleLessons:'このModuleのレッスン',
    lesson:'第{number}課', minutes:'{count}分', chooseStage:'学習ステージを選択', moduleNumber:'Module {number}',
    directAccess:'公開済みのレッスンはすべて自由に開始できます。', noPrimary:'このステージで正式に完了できるレッスンは学習済みです。どのレッスンも再学習できます。'
  })
});

const escapeHtml = value => String(value ?? '').replace(/[&<>'"]/g, character => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;'
})[character]);
const local = (value, language) => value?.[language] || value?.en || '';
const format = (value, replacements = {}) => Object.entries(replacements)
  .reduce((result, [key, replacement]) => result.replaceAll(`{${key}}`, String(replacement)), value);

function parseLearnLocation(url, taxonomy = STAGE_CHAPTER_TAXONOMY) {
  const parsed = url instanceof URL ? url : new URL(String(url), 'https://nikigo.local/');
  const requestedStageId = parsed.searchParams.get(LEARN_STAGE_PARAM);
  const requestedModuleId = parsed.searchParams.get(LEARN_MODULE_PARAM);
  const chapter = taxonomy.chapters.find(item => item.chapterId === requestedModuleId) || null;
  const stageIds = new Set(taxonomy.stages.map(item => item.stageId));
  const stageId = chapter?.stageId || (stageIds.has(requestedStageId) ? requestedStageId : null);
  return Object.freeze({
    stageId,
    moduleId:chapter?.chapterId || null,
    explicit:Boolean(stageId || chapter)
  });
}

function readLastStageId(storage, taxonomy = STAGE_CHAPTER_TAXONOMY) {
  try {
    const stageId = storage?.getItem?.(LAST_STAGE_KEY);
    return taxonomy.stages.some(stage => stage.stageId === stageId) ? stageId : null;
  } catch {
    return null;
  }
}

function resolveInitialStageId(options = {}) {
  const taxonomy = options.taxonomy || STAGE_CHAPTER_TAXONOMY;
  const valid = stageId => taxonomy.stages.some(stage => stage.stageId === stageId);
  if (valid(options.urlStageId)) return options.urlStageId;
  if (valid(options.learningPrimary?.stageId)) return options.learningPrimary.stageId;
  if (valid(options.lastStageId)) return options.lastStageId;
  return valid('K0') ? 'K0' : taxonomy.stages[0]?.stageId || null;
}

function rememberStageId(stageId, storage = window.localStorage) {
  try { storage.setItem(LAST_STAGE_KEY, stageId); } catch { /* URL state remains authoritative. */ }
}

function courseUrl(course, language) {
  if (!course?.file) return '#courses';
  const url = new URL(course.file, window.location.href);
  url.searchParams.set('lang', language);
  return `${url.pathname.split('/').pop()}${url.search}`;
}

function selectPrimaryForStage(profile, contents, architecture, stageId) {
  const active = architecture?.learningPrimary;
  if (active?.stageId === stageId && active.available && active.formallyCompletable) return active;
  return getRecommendedNextContent(profile, contents, stageId);
}

function buildLearningV4Model(context, locationUrl = window.location.href, storage = window.localStorage) {
  const architecture = context.architecture || {};
  const profile = context.profile || {};
  const contents = architecture.contents || [];
  const courses = context.courses || [];
  const byCourseId = new Map(courses.map(course => [course.stableId || course.id, course]));
  const language = SUPPORTED_LANGUAGES.includes(context.language) ? context.language : 'en';
  const urlState = parseLearnLocation(locationUrl, STAGE_CHAPTER_TAXONOMY);
  const stageId = resolveInitialStageId({
    taxonomy:STAGE_CHAPTER_TAXONOMY,
    urlStageId:urlState.stageId,
    learningPrimary:architecture.learningPrimary,
    lastStageId:readLastStageId(storage)
  });
  const primary = selectPrimaryForStage(profile, contents, architecture, stageId);
  const taxonomyView = buildStageChapterViewModel({
    profile,
    contents,
    taxonomy:STAGE_CHAPTER_TAXONOMY,
    currentStageId:stageId,
    currentContentId:primary?.stableId || null
  });
  const stages = taxonomyView.stages.filter(stage => stage.totalCount > 0 && STAGE_ART[stage.stageId]);
  const stage = stages.find(item => item.stageId === stageId) || stages[0] || null;
  const moduleId = urlState.moduleId && stage?.chapters.some(chapter => chapter.chapterId === urlState.moduleId)
    ? urlState.moduleId
    : null;
  const module = stage?.chapters.find(chapter => chapter.chapterId === moduleId) || null;
  return Object.freeze({
    architecture,
    profile,
    contents,
    courses,
    byCourseId,
    language,
    copy:COPY[language],
    urlState,
    stageId:stage?.stageId || stageId,
    moduleId,
    primary,
    taxonomyView,
    stages,
    stage,
    module
  });
}

function lessonState(model, content, modulePrimary) {
  const complete = isContentCompleted(model.profile, content.stableId);
  const progress = getContentProgress(model.profile, content.stableId);
  if (content.formallyCompletable === false) return Object.freeze({ key:'gated', label:model.copy.gate, action:model.copy.preview, primary:false });
  if (content.stableId === modulePrimary?.stableId) return Object.freeze({
    key:'current',
    label:progress > 0 ? model.copy.inProgress : model.copy.learning,
    action:progress > 0 ? model.copy.continue : model.copy.start,
    primary:true
  });
  if (complete) return Object.freeze({ key:'completed', label:model.copy.completed, action:model.copy.relearn, primary:false });
  if (progress > 0) return Object.freeze({ key:'in-progress', label:model.copy.inProgress, action:model.copy.continue, primary:false });
  return Object.freeze({ key:'available', label:model.copy.available, action:model.copy.start, primary:false });
}

function modulePrimaryContent(model, chapter) {
  if (chapter.contents.some(content => content.stableId === model.primary?.stableId)) return model.primary;
  const inProgress = chapter.contents.find(content => content.formallyCompletable
    && !isContentCompleted(model.profile, content.stableId)
    && getContentProgress(model.profile, content.stableId) > 0);
  if (inProgress) return inProgress;
  return chapter.contents.find(content => content.formallyCompletable
    && !isContentCompleted(model.profile, content.stableId)) || null;
}

function moduleState(model, chapter) {
  const progress = chapter.currentVersionProgress;
  if (chapter.contents.some(content => content.stableId === model.primary?.stableId)) return 'current';
  if (progress.formallyComplete) return 'completed';
  if (progress.previewPendingCount > 0 && progress.currentCompletableContentComplete) return 'gated';
  if (progress.completedCount > 0) return 'in-progress';
  return 'available';
}

function moduleStatusLabel(model, state) {
  if (state === 'current') return model.copy.learning;
  if (state === 'completed') return model.copy.completed;
  if (state === 'in-progress') return model.copy.inProgress;
  if (state === 'gated') return model.copy.gate;
  return model.copy.available;
}

function progressCopy(model, progress) {
  return format(model.copy.lessonsComplete, {
    completed:progress.completedCount,
    total:progress.totalCount
  });
}

function stageTabs(model) {
  return `<div class="learnV4StageTabs" role="tablist" aria-label="${escapeHtml(model.copy.chooseStage)}">${model.stages.map(stage => {
    const selected = stage.stageId === model.stageId;
    return `<button type="button" class="learnV4StageTab" id="learnV4StageTab-${escapeHtml(stage.stageId)}" role="tab" aria-selected="${selected}" aria-controls="learnV4StagePanel" tabindex="${selected ? '0' : '-1'}" data-learn-v4-stage="${escapeHtml(stage.stageId)}"><span>${escapeHtml(local(stage.label, model.language))}</span>${selected ? `<small>${escapeHtml(model.copy.currentStage)}</small>` : ''}</button>`;
  }).join('')}</div>`;
}

function moduleCard(model, chapter) {
  const progress = chapter.currentVersionProgress;
  const state = moduleState(model, chapter);
  const currentContent = chapter.contents.find(content => content.stableId === model.primary?.stableId) || null;
  const currentCourse = currentContent ? model.byCourseId.get(currentContent.stableId) : null;
  const currentProgress = currentContent ? getContentProgress(model.profile, currentContent.stableId) : 0;
  const gateSummary = state === 'gated'
    ? `${progressCopy(model, progress)} · ${model.copy.currentContentComplete}`
    : progressCopy(model, progress);
  return `<article class="learnV4ModuleCard ${state}" data-chapter-id="${escapeHtml(chapter.chapterId)}" data-state="${state}">
    <div class="learnV4ModuleArtWrap"><img class="learnV4ModuleArt" src="${escapeHtml(MODULE_ART[chapter.chapterId])}" alt="" width="443" height="443" loading="lazy" decoding="async"><span class="learnV4ModuleNumber" aria-label="${escapeHtml(format(model.copy.moduleNumber,{number:chapter.moduleDisplayOrder + 1}))}">${chapter.moduleDisplayOrder + 1}</span></div>
    <div class="learnV4ModuleContent">
      <div class="learnV4ModuleTopline"><span class="learnV4ModuleStatus">${escapeHtml(moduleStatusLabel(model,state))}</span><span class="learnV4ModuleCount">${escapeHtml(gateSummary)}</span></div>
      <h3>${escapeHtml(local(chapter.name,model.language))}</h3>
      <p class="learnV4ModuleGoal">${escapeHtml(local(chapter.objective,model.language))}</p>
      ${currentContent ? `<p class="learnV4CurrentLesson"><small>${escapeHtml(format(model.copy.lesson,{number:currentContent.displayNumber}))}${currentProgress > 0 ? ` · ${currentProgress}%` : ''}</small><b>${escapeHtml(local(currentContent.title,model.language))}</b></p>` : ''}
      ${progress.previewPendingCount ? `<p class="learnV4GateCopy">${escapeHtml(format(model.copy.audioPreparing,{count:progress.previewPendingCount}))}</p>` : ''}
      <div class="learnV4ModuleActions">
        ${currentContent && currentCourse ? `<a class="learnV4PrimaryAction" data-course-id="${escapeHtml(currentContent.stableId)}" href="${escapeHtml(courseUrl(currentCourse,model.language))}">${escapeHtml(currentProgress > 0 ? model.copy.continue : model.copy.start)}</a>` : ''}
        <button type="button" class="${currentContent ? 'learnV4TextAction' : 'learnV4SecondaryAction'}" data-open-learn-v4-module="${escapeHtml(chapter.chapterId)}">${escapeHtml(model.copy.moduleDetail)}</button>
      </div>
    </div>
  </article>`;
}

function lessonRow(model, chapter, content, modulePrimary) {
  const course = model.byCourseId.get(content.stableId);
  if (!course || !content.available) return '';
  const state = lessonState(model, content, modulePrimary);
  return `<article class="learnV4LessonRow ${state.key}" data-content-id="${escapeHtml(content.stableId)}" data-state="${state.key}">
    <span class="learnV4LessonNode" aria-hidden="true">${content.displayNumber}</span>
    <div class="learnV4LessonCopy"><small>${escapeHtml(format(model.copy.lesson,{number:content.displayNumber}))} · ${escapeHtml(format(model.copy.minutes,{count:content.estimatedMinutes}))} · ${escapeHtml(state.label)}</small><b>${escapeHtml(local(content.title,model.language))}</b></div>
    <a class="learnV4LessonAction${state.primary ? ' primary' : ''}" data-course-id="${escapeHtml(content.stableId)}" href="${escapeHtml(courseUrl(course,model.language))}">${escapeHtml(state.action)}</a>
  </article>`;
}

function renderStage(model) {
  const stage = model.stage;
  const percent = stage.totalCount ? stage.completedCount / stage.totalCount : 0;
  return `<div class="learnV4">
    <header class="learnV4Intro"><h1>${escapeHtml(window.NikigoLearnV4Context?.text?.('learnTitle') || 'Learn')}</h1><p>${escapeHtml(model.copy.intro)}</p></header>
    ${stageTabs(model)}
    <section class="learnV4StageIntro" id="learnV4StagePanel" role="tabpanel" aria-labelledby="learnV4StageTab-${escapeHtml(stage.stageId)}">
      <div class="learnV4StageIntroCopy"><h2>${escapeHtml(local(stage.label,model.language))}</h2><p>${escapeHtml(local(stage.objective,model.language))}</p><div class="learnV4ProgressCopy"><span>${escapeHtml(model.copy.stageProgress)}</span><b>${escapeHtml(progressCopy(model,stage))}</b></div><div class="learnV4ProgressTrack" role="progressbar" aria-valuemin="0" aria-valuemax="${stage.totalCount}" aria-valuenow="${stage.completedCount}" aria-label="${escapeHtml(local(stage.label,model.language))}"><i style="--learn-v4-progress:${percent}"></i></div></div>
      <img class="learnV4StageArt" src="${escapeHtml(STAGE_ART[stage.stageId])}" alt="" width="443" height="443" fetchpriority="high" decoding="async">
    </section>
    <section class="learnV4Path" aria-labelledby="learnV4PathTitle"><header class="learnV4SectionHeading"><h2 id="learnV4PathTitle">${escapeHtml(model.copy.pathTitle)}</h2><p>${escapeHtml(model.copy.pathLead)}</p></header><div class="learnV4ModulePath">${stage.chapters.map(chapter => moduleCard(model,chapter)).join('')}</div>${!model.primary ? `<p class="learnV4NoPrimary">${escapeHtml(model.copy.noPrimary)}</p>` : ''}</section>
  </div>`;
}

function renderModule(model) {
  const chapter = model.module;
  const progress = chapter.currentVersionProgress;
  const percent = progress.totalCount ? progress.completedCount / progress.totalCount : 0;
  const primary = modulePrimaryContent(model,chapter);
  return `<div class="learnV4 learnV4Detail"><button type="button" class="learnV4Back" data-learn-v4-back>${escapeHtml(model.copy.back)}</button>
    <header class="learnV4DetailHeader"><div><p>${escapeHtml(local(model.stage.label,model.language))}</p><h1>${escapeHtml(local(chapter.name,model.language))}</h1><p>${escapeHtml(local(chapter.objective,model.language))}</p><div class="learnV4ProgressCopy"><span>${escapeHtml(model.copy.moduleProgress)}</span><b>${escapeHtml(progressCopy(model,progress))}</b></div><div class="learnV4ProgressTrack" role="progressbar" aria-valuemin="0" aria-valuemax="${progress.totalCount}" aria-valuenow="${progress.completedCount}" aria-label="${escapeHtml(local(chapter.name,model.language))}"><i style="--learn-v4-progress:${percent}"></i></div>${progress.currentCompletableContentComplete && progress.previewPendingCount ? `<p class="learnV4GateCopy">${escapeHtml(model.copy.currentContentComplete)}<br>${escapeHtml(format(model.copy.audioPreparing,{count:progress.previewPendingCount}))}</p>` : ''}</div><img class="learnV4DetailArt" src="${escapeHtml(MODULE_ART[chapter.chapterId])}" alt="" width="443" height="443" fetchpriority="high" decoding="async"></header>
    <section class="learnV4LessonSection"><header><h2>${escapeHtml(model.copy.moduleLessons)}</h2><p>${escapeHtml(model.copy.directAccess)}</p></header><div class="learnV4LessonList">${chapter.contents.map(content => lessonRow(model,chapter,content,primary)).join('')}</div></section>
  </div>`;
}

function syncUrl(stageId, moduleId, mode = 'push') {
  const url = new URL(window.location.href);
  url.searchParams.set(LEARN_STAGE_PARAM,stageId);
  if (moduleId) url.searchParams.set(LEARN_MODULE_PARAM,moduleId);
  else url.searchParams.delete(LEARN_MODULE_PARAM);
  url.hash = 'courses';
  const nextState = { ...(window.history.state || {}), nikigoLearnV4:moduleId ? 'module' : 'stage' };
  window.history[`${mode}State`](nextState,'',url);
}

function bindStageEvents(root, context, model) {
  const tabs = [...root.querySelectorAll('[data-learn-v4-stage]')];
  const selectStage = button => {
    rememberStageId(button.dataset.learnV4Stage);
    syncUrl(button.dataset.learnV4Stage,null,'push');
    renderLearnPage(context);
    root.querySelector(`[data-learn-v4-stage="${button.dataset.learnV4Stage}"]`)?.focus();
  };
  tabs.forEach((button,index) => {
    button.addEventListener('click',() => selectStage(button));
    button.addEventListener('keydown',event => {
      if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length;
      selectStage(tabs[nextIndex]);
    });
  });
  root.querySelectorAll('[data-open-learn-v4-module]').forEach(button => button.addEventListener('click',() => {
    syncUrl(model.stageId,button.dataset.openLearnV4Module,'push');
    renderLearnPage(context);
    window.requestAnimationFrame(() => root.querySelector('[data-learn-v4-back]')?.focus());
  }));
}

function bindDetailEvents(root, context, model) {
  root.querySelector('[data-learn-v4-back]')?.addEventListener('click',() => {
    if (window.history.state?.nikigoLearnV4 === 'module') {
      window.history.back();
      return;
    }
    syncUrl(model.stageId,null,'replace');
    renderLearnPage(context);
    window.requestAnimationFrame(() => root.querySelector('[data-learn-v4-stage][aria-selected="true"]')?.focus());
  });
}

function renderLearnPage(context) {
  const root = context.root;
  if (!root || !context.architecture?.contents) return false;
  window.NikigoLearnV4Context = context;
  const model = buildLearningV4Model(context);
  if (!model.stage) return false;
  rememberStageId(model.stageId);
  if (!model.urlState.explicit) syncUrl(model.stageId,null,'replace');
  root.innerHTML = `${model.module ? renderModule(model) : renderStage(model)}<p class="learnV4Live" role="status" aria-live="polite"></p>`;
  root.classList.add('learnV4Root');
  root.classList.remove('learnV3Root');
  context.notice?.classList.remove('show');
  if (context.notice) context.notice.style.display = 'none';
  if (model.module) bindDetailEvents(root,context,model);
  else bindStageEvents(root,context,model);
  if (window.location.hash === '#courses' && window.scrollY <= 80) window.requestAnimationFrame(() => window.scrollTo(0,0));
  return true;
}

if (typeof window !== 'undefined') {
  window.NikigoLearnV4 = Object.freeze({ render:renderLearnPage, buildModel:buildLearningV4Model });
  window.addEventListener('popstate',() => {
    if (document.querySelector('.screen.active')?.id !== 'courses') return;
    window.NikigoAppRenderCurrent?.();
    window.requestAnimationFrame(() => {
      const target = document.querySelector('[data-learn-v4-back], [data-learn-v4-stage][aria-selected="true"]');
      target?.focus();
    });
  });
  window.NikigoAppRenderCurrent?.();
}

export {
  COPY as LEARN_V4_COPY,
  LAST_STAGE_KEY,
  MODULE_ART,
  STAGE_ART,
  buildLearningV4Model,
  lessonState,
  parseLearnLocation,
  renderLearnPage,
  resolveInitialStageId
};
