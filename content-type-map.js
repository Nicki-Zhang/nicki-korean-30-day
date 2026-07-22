const CONTENT_TYPES = Object.freeze([
  'foundation-lesson',
  'scenario-mission',
  'vocabulary-session',
  'practice-game'
]);

const definition = (contentType, options = {}) => Object.freeze({
  contentType,
  capabilities: Object.freeze({
    resume: options.resume !== false,
    relearn: options.relearn !== false,
    retryMistakes: options.retryMistakes !== false,
    publishesReviewItems: options.publishesReviewItems === true
  }),
  completionGate: options.completionGate || 'none'
});

// This is an explicit product mapping. Do not infer content type from titles.
// Lesson 13 remains a foundation lesson in V1; it is not the future vocabulary module.
const CONTENT_TYPE_MAP = Object.freeze({
  'lesson-00': definition('foundation-lesson', { resume:false, relearn:false, retryMistakes:false }),
  'lesson-01': definition('foundation-lesson', { publishesReviewItems:true }),
  'lesson-02': definition('foundation-lesson', { publishesReviewItems:true }),
  'lesson-03': definition('foundation-lesson', { publishesReviewItems:true }),
  'lesson-04': definition('foundation-lesson'),
  'lesson-05': definition('foundation-lesson'),
  'lesson-06': definition('foundation-lesson', { completionGate:'required-audio' }),
  'lesson-07': definition('foundation-lesson'),
  'lesson-08': definition('foundation-lesson'),
  'lesson-09': definition('scenario-mission'),
  'lesson-10': definition('practice-game'),
  'lesson-11': definition('scenario-mission'),
  'lesson-12': definition('scenario-mission'),
  'lesson-13': definition('foundation-lesson')
});

function getContentTypeDefinition(contentId) {
  return CONTENT_TYPE_MAP[contentId] || null;
}

function validateContentTypeMap(contentIds) {
  const ids = Array.isArray(contentIds) ? contentIds : [];
  const expected = new Set(ids);
  const mapped = Object.keys(CONTENT_TYPE_MAP);
  const missing = ids.filter(id => !CONTENT_TYPE_MAP[id]);
  const unexpected = mapped.filter(id => !expected.has(id));
  const invalid = mapped.filter(id => !CONTENT_TYPES.includes(CONTENT_TYPE_MAP[id].contentType));
  return Object.freeze({
    valid: missing.length === 0 && unexpected.length === 0 && invalid.length === 0,
    missing: Object.freeze(missing),
    unexpected: Object.freeze(unexpected),
    invalid: Object.freeze(invalid)
  });
}

export {
  CONTENT_TYPES,
  CONTENT_TYPE_MAP,
  getContentTypeDefinition,
  validateContentTypeMap
};
