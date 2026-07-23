import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const worker = fs.readFileSync('sw.js', 'utf8');
const cacheName = worker.match(/const CACHE = '([^']+)'/)?.[1];
assert.ok(cacheName, 'Service Worker cache version is missing.');
assert.notEqual(cacheName, 'nikigo-v13-lesson-05', 'Lesson 6 must not reuse the Lesson 5 cache.');
assert.match(cacheName, /self-review-gate/, 'Cache version must identify the permanent self-review gate.');

const cachedAssets = new Set([...worker.matchAll(/['"]\.\/([^'"]+)['"]/g)].map(match => match[1]));
for (const asset of ['nikigo-app.html', 'app-state.js', 'course-catalog.js', 'audio-catalog.js', 'lesson-06.html', 'lesson-06.js', 'lesson-06.css', 'lesson-07.html', 'lesson-07.js', 'lesson-07.css', 'lesson-08.html', 'lesson-08.js', 'lesson-08-classic-focus.js', 'lesson-08-classic-focus.css', 'lesson-09.html', 'lesson-09.js', 'lesson-10.html', 'lesson-10.js', 'lesson-sprint-engine.js', 'lesson-sprint.css', 'assets/classic-focus-tokens.css', 'assets/classic-focus-shell.css', 'assets/classic-focus-shell.js', 'assets/nikigo-mark.svg', 'favicon.ico', 'audio/lesson-00/yo.mp3', 'audio/lesson-00/yu.mp3', 'audio/lesson-00/ha.mp3', 'audio/lesson-05/geu.mp3', 'audio/k0-consonant-contrast/ga.mp3', 'audio/k0-consonant-contrast/ka.mp3', 'audio/k0-consonant-contrast/kka.mp3', 'audio/k0-consonant-contrast/da.mp3', 'audio/k0-consonant-contrast/ta.mp3', 'audio/k0-consonant-contrast/tta.mp3', 'audio/k0-consonant-contrast/ba.mp3', 'audio/k0-consonant-contrast/pa.mp3', 'audio/k0-consonant-contrast/ppa.mp3', 'audio/k0-consonant-contrast/ja.mp3', 'audio/k0-consonant-contrast/cha.mp3', 'audio/k0-consonant-contrast/jja.mp3', 'audio/k0-consonant-contrast/sa.mp3', 'audio/k0-consonant-contrast/ssa.mp3']) {
  assert.ok(cachedAssets.has(asset), `Service Worker is missing ${asset}.`);
}
for (const asset of ['lesson-11.html', 'lesson-11.js', 'lesson-12.html', 'lesson-12.js', 'lesson-12-classic-focus.js?v=1', 'lesson-12-classic-focus.css?v=1', 'lesson-13.html', 'lesson-13.js', 'lesson-13-classic-focus.js?v=2', 'lesson-13-classic-focus.css?v=2']) {
  assert.ok(cachedAssets.has(asset), `Service Worker is missing ${asset}.`);
}
for (const asset of ['content-registry.js', 'content-type-map.js', 'route-registry.js', 'recommendation-policy.js', 'progress-selectors.js', 'audio-readiness.js', 'stage-chapter-taxonomy.js', 'assets/nikigo-product-shell.js']) {
  assert.ok(cachedAssets.has(asset), `Phase 3B.2 module ${asset} is missing from the offline cache.`);
}

const catalogContext = { window: {} };
catalogContext.window.window = catalogContext.window;
vm.runInNewContext(fs.readFileSync('course-catalog.js', 'utf8'), catalogContext, { filename: 'course-catalog.js' });
for (const lesson of catalogContext.window.NIKIGO_COURSES.filter(item => item.status === 'available')) {
  assert.ok(cachedAssets.has(lesson.file), `Available course ${lesson.stableId} is missing from the offline cache.`);
  const html = fs.readFileSync(lesson.file, 'utf8');
  const localAssets = [
    ...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/g)
  ].map(match => match[1]).filter(asset => !asset.startsWith('http'));
  for (const asset of localAssets) assert.ok(cachedAssets.has(asset), `${lesson.file} dependency ${asset} is missing from the offline cache.`);
}

assert.match(worker, /keys\.filter\(key => key !== CACHE\)\.map\(key => caches\.delete\(key\)\)/, 'Old caches must be deleted during activation.');
assert.match(worker, /event\.request\.mode === 'navigate'/, 'Navigation requests need an explicit exact-page strategy.');
assert.match(worker, /new Request\(asset,\{ cache:'reload' \}\)/, 'Install precache must bypass a stale browser HTTP cache.');
assert.match(worker, /fetch\(event\.request,\{ cache:'no-store' \}\)/, 'Network-first updates must bypass stale HTTP responses.');
assert.match(worker, /navigationAssetFor\(url\)/, 'Navigation fallback must resolve the requested lesson page.');
assert.match(worker, /NAVIGATION_ASSETS\.has\(file\) \? `\.\/\$\{file\}` : '\.\/nikigo-app\.html'/, 'Known lesson navigation must not fall back to the app shell.');
assert.match(worker, /fetch\(event\.request,\{ cache:'no-store' \}\)[\s\S]*caches\.match\(cachedNavigationAsset\)/, 'Navigation must prefer the network and then the exact cached page.');
assert.match(worker, /audio\/deprecated/, 'Deprecated audio must be rejected before cache lookup.');
assert.doesNotMatch(worker,/staging\/|actions\/runs\/|sourceArtifact/,'Service Worker must not cache staging or Artifact paths.');

console.log(`Validated Service Worker ${cacheName}: available courses and dependencies cached, old caches removed, network-first updates preserved.`);
