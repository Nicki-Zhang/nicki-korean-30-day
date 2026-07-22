const SUPPORTED_LANGUAGES = Object.freeze(['zh', 'en', 'vi', 'ja']);

const route = (id, path, options = {}) => Object.freeze({
  id,
  path,
  aliases: Object.freeze(options.aliases || [])
});

const APP_ROUTES = Object.freeze({
  home: route('home', 'nikigo-app.html#dashboard', { aliases:['dashboard', '#dashboard', '#home'] }),
  learn: route('learn', 'nikigo-app.html#courses', { aliases:['courses', '#courses', '#learn'] }),
  practice: route('practice', 'review.html', { aliases:['review', 'review.html'] }),
  progress: route('progress', 'nikigo-app.html#progress', { aliases:['#progress'] }),
  me: route('me', 'nikigo-app.html#profile', { aliases:['profile', '#profile', '#me'] }),
  setup: route('setup', 'nikigo-app.html#flow', { aliases:['flow', '#flow', 'welcome', '#welcome'] }),
  diagnostic: route('diagnostic', 'diagnostic.html', { aliases:['diagnostic.html'] })
});

const ROUTE_ALIAS_INDEX = Object.freeze(Object.fromEntries(
  Object.values(APP_ROUTES).flatMap(item => [item.id, item.path, ...item.aliases].map(alias => [alias, item.id]))
));

function getAppRoute(idOrAlias) {
  const routeId = ROUTE_ALIAS_INDEX[idOrAlias] || idOrAlias;
  return APP_ROUTES[routeId] || null;
}

function withLanguage(path, language) {
  if (!SUPPORTED_LANGUAGES.includes(language)) return path;
  const parsed = new URL(path, 'https://nikigo.local/');
  parsed.searchParams.set('lang', language);
  return `${parsed.pathname.replace(/^\//u, '')}${parsed.search}${parsed.hash}`;
}

function resolveAppRoute(idOrAlias, options = {}) {
  const target = getAppRoute(idOrAlias);
  if (!target) return null;
  return options.language ? withLanguage(target.path, options.language) : target.path;
}

function resolveContentRoute(content, options = {}) {
  if (!content?.available || typeof content.route !== 'string' || !content.route) return null;
  return options.language ? withLanguage(content.route, options.language) : content.route;
}

function validateRouteCompatibility() {
  const required = Object.freeze({
    '#dashboard': 'home',
    '#courses': 'learn',
    '#progress': 'progress',
    '#profile': 'me'
  });
  const issues = Object.entries(required)
    .filter(([alias, routeId]) => getAppRoute(alias)?.id !== routeId)
    .map(([alias]) => alias);
  return Object.freeze({ valid:issues.length === 0, issues:Object.freeze(issues) });
}

export {
  APP_ROUTES,
  ROUTE_ALIAS_INDEX,
  getAppRoute,
  resolveAppRoute,
  resolveContentRoute,
  validateRouteCompatibility
};
