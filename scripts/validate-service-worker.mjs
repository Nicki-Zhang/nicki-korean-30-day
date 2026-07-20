import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const worker = fs.readFileSync('sw.js', 'utf8');
const cacheName = worker.match(/const CACHE = '([^']+)'/)?.[1];
assert.ok(cacheName, 'Service Worker cache version is missing.');
assert.notEqual(cacheName, 'nikigo-v13-lesson-05', 'Lesson 6 must not reuse the Lesson 5 cache.');
assert.match(cacheName, /batch-01-approved/, 'Cache version must identify the approved Batch 1 asset update.');

const cachedAssets = new Set([...worker.matchAll(/['"]\.\/([^'"]+)['"]/g)].map(match => match[1]));
for (const asset of ['nikigo-app.html', 'app-state.js', 'course-catalog.js', 'audio-catalog.js', 'lesson-06.html', 'lesson-06.js', 'lesson-06.css', 'audio/lesson-00/yo.mp3', 'audio/lesson-00/yu.mp3']) {
  assert.ok(cachedAssets.has(asset), `Service Worker is missing ${asset}.`);
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
assert.match(worker, /fetch\(event\.request\)[\s\S]*caches\.match\(event\.request\)/, 'Service Worker must prefer the network before cached content.');
assert.match(worker, /audio\/deprecated/, 'Deprecated audio must be rejected before cache lookup.');
assert.doesNotMatch(worker,/staging\/|actions\/runs\/|sourceArtifact/,'Service Worker must not cache staging or Artifact paths.');

console.log(`Validated Service Worker ${cacheName}: available courses and dependencies cached, old caches removed, network-first updates preserved.`);
