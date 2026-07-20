const CACHE = 'nikigo-v17-batch-02a-approved';
const ASSETS = [
  './', './index.html', './nikigo-app.html', './app-state.js', './course-catalog.js',
  './hangul-sound-data.js', './audio-catalog.js', './review.html', './review.css',
  './review-catalog.js', './lesson-00.html', './lesson-00.js', './lesson-01.html',
  './lesson-02.html', './lesson-03.html', './lesson-04.html', './lesson-engine.js',
  './lesson-player.css', './player-privacy.css', './lesson-consonant-contrast.html', './lesson-consonant-contrast.js',
  './lesson-consonant-contrast.css', './lesson-05.html', './lesson-05.js',
  './lesson-05.css', './lesson-06.html', './lesson-06.js', './lesson-06.css',
  './audio/lesson-00/yo.mp3', './audio/lesson-00/yu.mp3',
  './audio/k0-consonant-contrast/ga.mp3', './audio/k0-consonant-contrast/ka.mp3',
  './audio/k0-consonant-contrast/kka.mp3',
  './manifest.webmanifest'
];

self.addEventListener('install', event => event.waitUntil(
  caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
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
  event.respondWith(
    fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match(event.request).then(hit => hit || (
      event.request.mode === 'navigate' ? caches.match('./nikigo-app.html') : Response.error()
    )))
  );
});
