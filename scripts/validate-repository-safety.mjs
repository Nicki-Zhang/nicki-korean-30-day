import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

function argumentValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) return null;
  const value = process.argv[index + 1];
  if (!value || value.startsWith('--')) throw new Error(`${name} requires a value.`);
  return value;
}

function validRefName(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9._/-]*$/u.test(value) &&
    !value.includes('..') && !value.includes('@{') && !value.endsWith('/') && !value.endsWith('.');
}

function verifyRef(ref) {
  if (!validRefName(ref)) throw new Error(`Unsafe Git base ref: ${JSON.stringify(ref)}`);
  const result = spawnSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`], { encoding:'utf8' });
  if (result.status !== 0) throw new Error(`Git base ref does not exist or is not a commit: ${ref}`);
  return result.stdout.trim();
}

function exists(ref) {
  if (!validRefName(ref)) return false;
  return spawnSync('git', ['rev-parse', '--verify', '--quiet', `${ref}^{commit}`]).status === 0;
}

const requestedBase = argumentValue('--base-ref');
const ciBase = String(process.env.NIKIGO_BASE_REF || '').trim();
const baseRef = requestedBase || ciBase || (exists('origin/main') ? 'origin/main' : exists('main') ? 'main' : null);
if (!baseRef) throw new Error('No verified Git baseline is available. Pass --base-ref, set NIKIGO_BASE_REF, fetch origin/main, or create a real local main ref.');
const baseSha = verifyRef(baseRef);
const headSha = execFileSync('git', ['rev-parse', '--verify', 'HEAD^{commit}'], { encoding:'utf8' }).trim();
const branchResult = spawnSync('git', ['symbolic-ref', '--quiet', '--short', 'HEAD'], { encoding:'utf8' });
const currentBranch = branchResult.status === 0 ? branchResult.stdout.trim() : '(detached)';
const mergeResult = spawnSync('git', ['merge-base', 'HEAD', baseRef], { encoding:'utf8' });
if (mergeResult.status !== 0 || !mergeResult.stdout.trim()) throw new Error(`Cannot compute merge-base between HEAD and ${baseRef}.`);
const mergeBase = mergeResult.stdout.trim();
verifyRef(mergeBase);
const changed = execFileSync('git', ['diff', '--name-only', `${mergeBase}...HEAD`], { encoding:'utf8' }).trim().split('\n').filter(Boolean);

console.log(`Git safety baseline: HEAD=${headSha}; branch=${currentBranch}; baseRef=${baseRef}; baseSHA=${baseSha}; mergeBase=${mergeBase}; baseRefVerified=true; diffFiles=${changed.length}.`);
if (process.argv.includes('--baseline-only')) process.exit(0);

const tracked = execFileSync('git', ['ls-files'], { encoding:'utf8' }).trim().split('\n').filter(Boolean);
const repositoryFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding:'utf8' }).trim().split('\n').filter(Boolean);
const forbiddenNames = repositoryFiles.filter(file => /(^|\/)\.env(?:\.|$)|(^|\/)__MACOSX\/|(^|\/)\.DS_Store$|(^|\/)\._/u.test(file));
assert.deepEqual(forbiddenNames, [], 'Tracked environment or macOS metadata files are forbidden.');

const textFiles = repositoryFiles.filter(file => fs.existsSync(file) && fs.statSync(file).isFile() && !/\.(?:png|jpg|jpeg|webp|mp3|wav|zip)$/i.test(file));
const secretPatterns = [
  /\/Users\/[^/\s]+\//u,
  /\b\d{7,12}:[A-Za-z0-9_-]{20,}\b/u,
  /TELEGRAM_CHAT_ID\s*[:=]\s*["']?\d{4,}/u,
  /(?:OPENAI_API_KEY|TELEGRAM_BOT_TOKEN)\s*[:=]\s*["'][^"'$][^"']+/u
];
for (const file of textFiles) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of secretPatterns) assert.equal(pattern.test(source), false, `${file} contains a forbidden local path or credential pattern.`);
}

const localNotificationCommit = '20d16cd02501bb15be1a5a088edf241e667fdcb0';
const notificationCommitExists = spawnSync('git', ['rev-parse', '--verify', '--quiet', `${localNotificationCommit}^{commit}`]).status === 0;
if (notificationCommitExists) {
  const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', localNotificationCommit, 'HEAD']);
  assert.equal(ancestry.status, 1, 'The local Telegram notification repair commit must not be in the final Lesson 6 branch history.');
}
assert.equal(changed.some(file => /telegram/i.test(file)), false, 'Lesson 6 changes must not include Telegram implementation or local notification files.');

console.log(`Validated repository safety: ${tracked.length} tracked and ${repositoryFiles.length-tracked.length} non-ignored untracked files scanned; ${changed.length} branch changes; no repository env metadata, personal paths, credential values, or Telegram-only commit.`);
