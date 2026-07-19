import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync, spawnSync } from 'node:child_process';

const tracked = execFileSync('git', ['ls-files'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const repositoryFiles = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
const forbiddenNames = repositoryFiles.filter(file => /(^|\/)\.env(?:\.|$)|(^|\/)__MACOSX\/|(^|\/)\.DS_Store$|(^|\/)\._/u.test(file));
assert.deepEqual(forbiddenNames, [], 'Tracked environment or macOS metadata files are forbidden.');

const changed = execFileSync('git', ['diff', '--name-only', 'main'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
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
const ancestry = spawnSync('git', ['merge-base', '--is-ancestor', localNotificationCommit, 'HEAD']);
assert.equal(ancestry.status, 1, 'The local Telegram notification repair commit must not be in the final Lesson 6 branch history.');
assert.equal(changed.some(file => /telegram/i.test(file)), false, 'Lesson 6 changes must not include Telegram implementation or local notification files.');

console.log(`Validated repository safety: ${tracked.length} tracked and ${repositoryFiles.length-tracked.length} non-ignored untracked files scanned; ${changed.length} branch changes; no repository env metadata, personal paths, credential values, or Telegram-only commit.`);
