const CACHE = 'nikigo-v22-audio-batch-02b-approved';
const ASSETS = [
  './', './index.html', './nikigo-app.html', './app-state.js', './course-catalog.js',
  './hangul-sound-data.js', './audio-catalog.js', './review.html', './review.css',
  './review-catalog.js', './lesson-00.html', './lesson-00.js?v=22-audio-batch-02b', './lesson-01.html',
  './lesson-02.html', './lesson-03.html', './lesson-04.html', './lesson-engine.js',
  './lesson-player.css', './player-privacy.css', './lesson-consonant-contrast.html', './lesson-consonant-contrast.js',
  './lesson-consonant-contrast.css', './lesson-05.html', './lesson-05.js',
  './lesson-05.css', './lesson-06.html', './lesson-06.js', './lesson-06.css',
  './lesson-07.html', './lesson-07.js', './lesson-07.css',
  './audio/lesson-00/yo.mp3', './audio/lesson-00/yu.mp3',
  './audio/lesson-00/ha.mp3', './audio/lesson-05/geu.mp3',
  './audio/k0-consonant-contrast/ga.mp3', './audio/k0-consonant-contrast/ka.mp3',
  './audio/k0-consonant-contrast/kka.mp3', './audio/k0-consonant-contrast/da.mp3',
  './audio/k0-consonant-contrast/ta.mp3', './audio/k0-consonant-contrast/tta.mp3',
  './audio/k0-consonant-contrast/ba.mp3', './audio/k0-consonant-contrast/pa.mp3',
  './audio/k0-consonant-contrast/ppa.mp3', './audio/k0-consonant-contrast/ja.mp3',
  './audio/k0-consonant-contrast/cha.mp3', './audio/k0-consonant-contrast/jja.mp3',
  './audio/k0-consonant-contrast/sa.mp3', './audio/k0-consonant-contrast/ssa.mp3',
  './manifest.webmanifest'
];

const NAVIGATION_ASSETS = new Set(ASSETS
  .filter(asset => asset.endsWith('.html') || asset === './')
  .map(asset => asset === './' ? 'index.html' : asset.slice(2)));

function navigationAssetFor(url) {
  const file = url.pathname.endsWith('/') ? 'index.html' : url.pathname.split('/').pop();
  return NAVIGATION_ASSETS.has(file) ? `./${file}` : './nikigo-app.html';
}

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE)
    .then(cache => cache.addAll(ASSETS.map(asset => new Request(asset,{ cache:'reload' }))))
    .then(() => self.skipWaiting())
));

self.addEventListener('activate', event => event.waitUntil(
  caches.keys()
    .then(keys => Promise.all(keys.filter(key => key !== CACHE).map(key => caches.delete(key))))
    .then(() => self.clients.claim())
));

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.includes('/audio/deprecated/')) {
    event.respondWith(Promise.resolve(Response.error()));
    return;
  }
  if (event.request.mode === 'navigate') {
    const cachedNavigationAsset = navigationAssetFor(url);
    event.respondWith(
      fetch(event.request,{ cache:'no-store' }).then(response => {
        if (!response.ok) throw new Error(`Navigation request failed: ${response.status}`);
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(cachedNavigationAsset, copy));
        return response;
      }).catch(() => caches.match(cachedNavigationAsset).then(hit => hit || Response.error()))
    );
    return;
  }
  event.respondWith(
    fetch(event.request,{ cache:'no-store' }).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(hit => hit || Response.error()))
  );
});
