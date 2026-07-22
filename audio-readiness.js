const AUDIO_POLICY = 'exact-approved-only';

const dependency = (namespaces, completionGate = 'none') => Object.freeze({
  namespaces: Object.freeze(namespaces),
  completionGate
});

// Namespaces reflect current runtime ownership. They do not rewrite the catalog.
const AUDIO_DEPENDENCIES = Object.freeze({
  'lesson-00': dependency(['lesson-00']),
  'lesson-01': dependency(['lesson-01']),
  'lesson-02': dependency(['lesson-02']),
  'lesson-03': dependency(['lesson-03']),
  'lesson-04': dependency(['k0-consonant-contrast']),
  'lesson-05': dependency(['lesson-05']),
  'lesson-06': dependency(['lesson-06'], 'required-audio'),
  'lesson-07': dependency(['lesson-07']),
  'lesson-08': dependency([]),
  'lesson-09': dependency([]),
  'lesson-10': dependency([]),
  'lesson-11': dependency([]),
  'lesson-12': dependency([]),
  'lesson-13': dependency([])
});

const AUDIO_READINESS_COPY = Object.freeze({
  zh: Object.freeze({
    'audio.ready': '音频已准备',
    'audio.partial': '部分音频准备中',
    'audio.pending': '音频准备中',
    'audio.notRequired': '本课程没有正式完成音频门禁',
    'audio.previewOnly': '开发预览 · 音频准备中'
  }),
  en: Object.freeze({
    'audio.ready': 'Audio ready',
    'audio.partial': 'Some audio is still in preparation',
    'audio.pending': 'Audio in preparation',
    'audio.notRequired': 'This course has no audio completion gate',
    'audio.previewOnly': 'Development preview · Audio in preparation'
  }),
  vi: Object.freeze({
    'audio.ready': 'Âm thanh đã sẵn sàng',
    'audio.partial': 'Một phần âm thanh đang được chuẩn bị',
    'audio.pending': 'Âm thanh đang được chuẩn bị',
    'audio.notRequired': 'Bài này không có cổng hoàn thành bằng âm thanh',
    'audio.previewOnly': 'Bản xem trước phát triển · Âm thanh đang được chuẩn bị'
  }),
  ja: Object.freeze({
    'audio.ready': '音声の準備が完了しました',
    'audio.partial': '一部の音声を準備中です',
    'audio.pending': '音声を準備中です',
    'audio.notRequired': 'このコースには音声による完了ゲートはありません',
    'audio.previewOnly': '開発プレビュー · 音声準備中'
  })
});

function entryIsPlayable(audioApi, entry) {
  if (!entry || typeof audioApi?.canPlayAudio !== 'function') return false;
  return audioApi.canPlayAudio(entry.speechText, entry, entry.audioType);
}

function summarizeAudioReadiness(contentId, audioApi) {
  const config = AUDIO_DEPENDENCIES[contentId] || dependency([]);
  const entries = config.namespaces.flatMap(namespace => audioApi?.lessons?.[namespace]?.items || []);
  const playable = entries.filter(entry => entryIsPlayable(audioApi, entry)).length;
  const required = entries.length;
  const pending = Math.max(0, required - playable);
  const gateOpen = config.completionGate !== 'required-audio' || (required > 0 && pending === 0);
  const labelKey = config.completionGate === 'required-audio' && !gateOpen
    ? 'audio.previewOnly'
    : required === 0
      ? 'audio.notRequired'
      : pending === 0
        ? 'audio.ready'
        : playable > 0
          ? 'audio.partial'
          : 'audio.pending';

  return Object.freeze({
    contentId,
    policy: AUDIO_POLICY,
    namespaces: config.namespaces,
    required,
    playable,
    pending,
    completionGate: config.completionGate,
    gateOpen,
    formallyCompletable: gateOpen,
    labelKey
  });
}

function buildAudioReadinessIndex(courses, audioApi) {
  return Object.freeze(Object.fromEntries((courses || []).map(course => {
    const contentId = course?.stableId || course?.id;
    return [contentId, summarizeAudioReadiness(contentId, audioApi)];
  })));
}

export {
  AUDIO_POLICY,
  AUDIO_DEPENDENCIES,
  AUDIO_READINESS_COPY,
  summarizeAudioReadiness,
  buildAudioReadinessIndex
};
