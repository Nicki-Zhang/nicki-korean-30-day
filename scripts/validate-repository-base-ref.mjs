import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const initialStatus=execFileSync('git',['status','--porcelain=v1'],{cwd:root,encoding:'utf8'});
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-shallow-baseline-'));
const remote=path.join(temp,'remote.git');
const checkout=path.join(temp,'checkout');
execFileSync('git',['clone','--bare',root,remote],{encoding:'utf8',stdio:'pipe'});
execFileSync('git',['clone','--depth','1','--single-branch','--branch','feature/lesson-06-compound-vowels',pathToFileURL(remote).href,checkout],{encoding:'utf8',stdio:'pipe'});
assert.equal(spawnSync('git',['show-ref','--verify','--quiet','refs/heads/main'],{cwd:checkout}).status,1,'Fixture must not contain a local main branch.');
assert.notEqual(spawnSync('git',['diff','--name-only','main'],{cwd:checkout}).status,0,'Legacy local-main comparison must fail in the shallow fixture.');
execFileSync('git',['fetch','--unshallow','origin'],{cwd:checkout,encoding:'utf8',stdio:'pipe'});
execFileSync('git',['fetch','--no-tags','origin','main:refs/remotes/origin/main'],{cwd:checkout,encoding:'utf8',stdio:'pipe'});
fs.copyFileSync(path.join(root,'scripts/validate-repository-safety.mjs'),path.join(checkout,'scripts/validate-repository-safety.mjs'));
let result=spawnSync(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref','origin/main'],{cwd:checkout,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
assert.match(result.stdout,/baseRef=origin\/main/);assert.match(result.stdout,/baseRefVerified=true/);assert.match(result.stdout,/mergeBase=[0-9a-f]{40}/);
assert.equal(spawnSync('git',['show-ref','--verify','--quiet','refs/heads/main'],{cwd:checkout}).status,1,'Safety scan must not create local main.');

result=spawnSync(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref','origin/not-present'],{cwd:checkout,encoding:'utf8'});
assert.notEqual(result.status,0);assert.match(result.stderr,/does not exist or is not a commit/);
const marker=path.join(temp,'injection-marker');
result=spawnSync(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref',`origin/main;touch${marker}`],{cwd:checkout,encoding:'utf8'});
assert.notEqual(result.status,0);assert.match(result.stderr,/Unsafe Git base ref/);assert.equal(fs.existsSync(marker),false,'Base ref argument executed shell content.');

const emptyTree=execFileSync('git',['mktree'],{cwd:checkout,input:'',encoding:'utf8'}).trim();
const identity={...process.env,GIT_AUTHOR_NAME:'Nikigo Test',GIT_AUTHOR_EMAIL:'test.invalid@example.invalid',GIT_COMMITTER_NAME:'Nikigo Test',GIT_COMMITTER_EMAIL:'test.invalid@example.invalid'};
const unrelated=execFileSync('git',['commit-tree',emptyTree,'-m','unrelated'],{cwd:checkout,env:identity,encoding:'utf8'}).trim();
execFileSync('git',['update-ref','refs/remotes/origin/unrelated',unrelated],{cwd:checkout});
result=spawnSync(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref','origin/unrelated'],{cwd:checkout,encoding:'utf8'});
assert.notEqual(result.status,0);assert.match(result.stderr,/Cannot compute merge-base/);
assert.equal(execFileSync('git',['status','--porcelain=v1'],{cwd:root,encoding:'utf8'}),initialStatus,'Shallow-clone simulation modified the source worktree.');
console.log('Validated shallow feature-only checkout: legacy main lookup fails, origin/main resolves safely, merge-base works, invalid refs fail clearly, and no local main is created.');
