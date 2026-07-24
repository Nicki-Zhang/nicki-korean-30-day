import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const base = '4c2bc7b917ed7940e0b0be14036e9ab8bb8f2194';
const read = (file) => fs.readFileSync(file, 'utf8').toLowerCase();
const purpleShell = read('assets/nikigo-purple-shell.css');
const friendly = read('assets/nikigo-friendly-learning-path.css');
const learn = read('assets/nikigo-learn-v4.css');
const review = read('review.css');
const diagnostic = read('diagnostic.html');
const app = read('nikigo-app.html');
const worker = read('sw.js');

const tokens = {
  'brand-primary': '#6d4aff',
  'brand-hover': '#5638d4',
  'brand-active': '#452bb5',
  'brand-soft': '#f4f0ff',
  'brand-subtle': '#fbfaff',
  'brand-border': '#ddd3ff',
  'brand-focus': 'rgba(109,74,255,.48)',
  'brand-text': '#5638d4',
  'brand-on-primary': '#ffffff'
};

for (const [name, value] of Object.entries(tokens)) {
  assert.ok(
    purpleShell.includes(`--${name}:${value}`),
    `Missing approved product-shell token --${name}:${value}`
  );
}

for (const source of [purpleShell, friendly, learn]) {
  assert.ok(source.includes('var(--brand-primary)'), 'Product-shell CSS must consume brand-primary.');
}
assert.ok(
  purpleShell.includes('linear-gradient(128deg,#5638d4 0%,#6d4aff 54%,#9c83ff 100%)'),
  'Dashboard hero must use the approved purple alignment stops.'
);
assert.ok(
  friendly.includes('linear-gradient(135deg,#5638d4 0%,#6d4aff 54%,#9c83ff 100%)'),
  'Friendly Learning Path must use the approved purple alignment stops.'
);
assert.ok(review.includes('--brand-primary:#6d4aff'), 'Review page brand alias missing.');
assert.ok(diagnostic.includes('--brand-primary:#6d4aff'), 'Diagnostic page brand alias missing.');
assert.ok(app.includes('content="#6d4aff"'), 'Browser theme color must match brand-primary.');
assert.ok(worker.includes("nikigo-v43-self-review-gate-purple-alignment-v1"), 'Service Worker cache version was not advanced.');

assert.match(`${purpleShell}\n${friendly}`, /#237553|#257653/, 'Success must remain independently green.');
assert.match(`${purpleShell}\n${friendly}`, /#a13e3a|#a94338/, 'Error must remain independently red.');
assert.match(friendly, /--friendly-reminder:#9a5a13/, 'Warning/reminder semantics must remain amber.');
assert.match(friendly, /--friendly-locked:#716b79/, 'Disabled/locked semantics must remain neutral.');

const protectedPaths = [
  'assets/classic-focus-tokens.css',
  'assets/classic-focus-shell.css',
  'assets/classic-focus-shell.js',
  'course-catalog.js',
  'app-state.js',
  'audio-catalog.js',
  'lesson-04.html',
  'lesson-05.html',
  'lesson-07.html',
  'lesson-08.html',
  'lesson-11.html',
  'lesson-12.html',
  'lesson-13.html',
  'lesson-04.js',
  'lesson-05.js',
  'lesson-07.js',
  'lesson-sprint-engine.js'
];

const changedProtected = execFileSync(
  'git',
  ['diff', '--name-only', base, '--', ...protectedPaths],
  { encoding: 'utf8' }
).trim();
assert.equal(changedProtected, '', `Protected runtime files changed:\n${changedProtected}`);

const audioChanges = execFileSync(
  'git',
  ['diff', '--name-only', base, '--', 'audio', 'assets/audio'],
  { encoding: 'utf8' }
).trim();
assert.equal(audioChanges, '', `Audio bytes changed:\n${audioChanges}`);

console.log(JSON.stringify({
  result: 'pass',
  base,
  brandPrimary: '#6D4AFF',
  tokenCount: Object.keys(tokens).length,
  protectedRuntimeFilesChanged: 0,
  audioFilesChanged: 0,
  classicFocusTokensChanged: false,
  semanticStateColorsPreserved: true
}, null, 2));
