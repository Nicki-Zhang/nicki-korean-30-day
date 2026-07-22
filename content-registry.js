import {
  getContentTypeDefinition,
  validateContentTypeMap
} from './content-type-map.js';

const SUPPORTED_LANGUAGES = Object.freeze(['zh', 'en', 'vi', 'ja']);
const CONTENT_REGISTRY_VERSION = 1;

function freezeLocalized(value, field, contentId) {
  const source = value && typeof value === 'object' ? value : {};
  for (const language of SUPPORTED_LANGUAGES) {
    if (typeof source[language] !== 'string' || !source[language].trim()) {
      throw new TypeError(`${contentId} is missing ${field}.${language}`);
    }
  }
  return Object.freeze(Object.fromEntries(SUPPORTED_LANGUAGES.map(language => [language, source[language]])));
}

function createContentDescriptor(course, options = {}) {
  const stableId = course?.stableId || course?.id;
  if (!stableId || typeof stableId !== 'string') throw new TypeError('Course stableId is required.');
  if (!Number.isInteger(course.displayOrder)) throw new TypeError(`${stableId} displayOrder must be an integer.`);
  if (!Number.isInteger(course.displayNumber)) throw new TypeError(`${stableId} displayNumber must be an integer.`);

  const typeDefinition = getContentTypeDefinition(stableId);
  if (!typeDefinition) throw new TypeError(`${stableId} has no approved content type mapping.`);
  const taxonomyPlacement = options.taxonomy?.lessonMap?.[stableId] || null;
  if (taxonomyPlacement?.stageId && course.path && taxonomyPlacement.stageId !== course.path) {
    throw new TypeError(`${stableId} taxonomy stage does not match the existing catalog path.`);
  }

  const audioReadiness = options.audioReadinessByContent?.[stableId] || Object.freeze({
    contentId: stableId,
    policy: 'exact-approved-only',
    namespaces: Object.freeze([]),
    required: 0,
    playable: 0,
    pending: 0,
    completionGate: typeDefinition.completionGate,
    gateOpen: typeDefinition.completionGate !== 'required-audio',
    formallyCompletable: typeDefinition.completionGate !== 'required-audio',
    labelKey: typeDefinition.completionGate === 'required-audio' ? 'audio.previewOnly' : 'audio.notRequired'
  });

  const available = course.status === 'available'
    && course.accessStatus === 'available'
    && typeof course.file === 'string'
    && course.file.length > 0;

  return Object.freeze({
    stableId,
    contentType: typeDefinition.contentType,
    programId: 'korean',
    stageId: taxonomyPlacement?.stageId || course.path || null,
    chapterId: taxonomyPlacement?.chapterId || null,
    displayOrder: course.displayOrder,
    displayNumber: course.displayNumber,
    route: course.file || null,
    template: course.template || null,
    status: course.status || 'missing',
    accessStatus: course.accessStatus || 'unavailable',
    releaseStatus: course.releaseStatus || 'development',
    title: freezeLocalized(course.title, 'title', stableId),
    summary: freezeLocalized(course.parts, 'parts', stableId),
    estimatedMinutes: Number.isFinite(Number(course.duration)) ? Number(course.duration) : null,
    xp: Number.isFinite(Number(course.xp)) ? Number(course.xp) : 0,
    skillTags: Object.freeze([]),
    recommendedPrerequisites: Object.freeze([...(course.recommendedPrerequisites || [])]),
    recommendedNext: Object.freeze([]),
    capabilities: typeDefinition.capabilities,
    audioStatus: audioReadiness,
    audioReadiness,
    available,
    formallyCompletable: available && audioReadiness.formallyCompletable !== false
  });
}

function buildContentRegistry(courses, options = {}) {
  const source = Array.isArray(courses) ? courses : [];
  const stableIds = source.map(course => course?.stableId || course?.id);
  const typeValidation = validateContentTypeMap(stableIds);
  if (!typeValidation.valid) {
    throw new TypeError(`Content type map mismatch: missing=${typeValidation.missing.join(',')} unexpected=${typeValidation.unexpected.join(',')} invalid=${typeValidation.invalid.join(',')}`);
  }

  const descriptors = source.map(course => createContentDescriptor(course, options));
  const ids = descriptors.map(content => content.stableId);
  const orders = descriptors.map(content => content.displayOrder);
  const numbers = descriptors.map(content => content.displayNumber);
  if (new Set(ids).size !== ids.length) throw new TypeError('Content stableIds must be unique.');
  if (new Set(orders).size !== orders.length) throw new TypeError('Content displayOrder values must be unique.');
  if (new Set(numbers).size !== numbers.length) throw new TypeError('Content displayNumber values must be unique.');

  return Object.freeze([...descriptors].sort((a, b) => a.displayOrder - b.displayOrder));
}

function validateContentRegistryParity(courses, registry) {
  const source = Array.isArray(courses) ? courses : [];
  const descriptors = Array.isArray(registry) ? registry : [];
  const issues = [];
  if (source.length !== descriptors.length) issues.push(`count:${source.length}:${descriptors.length}`);

  source.forEach((course, index) => {
    const stableId = course?.stableId || course?.id;
    const content = descriptors.find(item => item.stableId === stableId);
    if (!content) {
      issues.push(`missing:${stableId}`);
      return;
    }
    if (content.displayOrder !== course.displayOrder) issues.push(`displayOrder:${stableId}`);
    if (content.displayNumber !== course.displayNumber) issues.push(`displayNumber:${stableId}`);
    if (content.route !== course.file) issues.push(`route:${stableId}`);
    if (content.stableId !== (source[index]?.stableId || source[index]?.id)) issues.push(`sequence:${stableId}`);
  });

  return Object.freeze({ valid:issues.length === 0, issues:Object.freeze(issues) });
}

export {
  SUPPORTED_LANGUAGES,
  CONTENT_REGISTRY_VERSION,
  createContentDescriptor,
  buildContentRegistry,
  validateContentRegistryParity
};
