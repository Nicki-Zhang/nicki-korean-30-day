import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { execFileSync, spawnSync } from 'node:child_process';

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const safetyScript=fs.readFileSync(path.join(root,'scripts/validate-repository-safety.mjs'),'utf8');
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'nikigo-self-contained-base-ref-'));
const isolatedHome=path.join(temp,'home');
const remote=path.join(temp,'remote.git');
const seed=path.join(temp,'seed');
const checkout=path.join(temp,'checkout');
const noMainRemote=path.join(temp,'no-main.git');
fs.mkdirSync(isolatedHome,{recursive:true});

const gitEnv={
  ...process.env,
  HOME:isolatedHome,
  XDG_CONFIG_HOME:path.join(isolatedHome,'.config'),
  GIT_CONFIG_NOSYSTEM:'1',
  GIT_CONFIG_GLOBAL:'/dev/null',
  GIT_TERMINAL_PROMPT:'0',
  GIT_ASKPASS:'/usr/bin/false',
  SSH_ASKPASS:'/usr/bin/false',
  GIT_SSH_COMMAND:'false',
  GIT_ALLOW_PROTOCOL:'file'
};

const git=(args,cwd,options={})=>execFileSync('git',args,{cwd,env:gitEnv,encoding:'utf8',stdio:'pipe',...options});
const run=(command,args,cwd)=>spawnSync(command,args,{cwd,env:gitEnv,encoding:'utf8'});
const rev=(cwd,ref)=>git(['rev-parse','--verify',`${ref}^{commit}`],cwd).trim();

try {
  git(['init','--bare',remote],temp);
  git(['init','-b','main',seed],temp);
  git(['config','user.name','Nikigo CI Fixture'],seed);
  git(['config','user.email','ci-fixture@invalid.example'],seed);
  git(['config','credential.helper',''],seed);
  fs.mkdirSync(path.join(seed,'scripts'),{recursive:true});
  fs.writeFileSync(path.join(seed,'scripts/validate-repository-safety.mjs'),safetyScript);
  fs.writeFileSync(path.join(seed,'main-only.txt'),'main fixture\n');
  git(['add','.'],seed);
  git(['commit','-m','fixture main'],seed);
  git(['remote','add','origin',pathToFileURL(remote).href],seed);
  git(['push','origin','main'],seed);
  const remoteMainBefore=rev(remote,'refs/heads/main');

  git(['switch','-c','feature/test-audio'],seed);
  fs.writeFileSync(path.join(seed,'feature-only.txt'),'feature fixture\n');
  git(['add','feature-only.txt'],seed);
  git(['commit','-m','fixture feature'],seed);
  git(['push','origin','feature/test-audio'],seed);

  git(['clone','--depth','1','--single-branch','--branch','feature/test-audio',pathToFileURL(remote).href,checkout],temp);
  assert.equal(git(['branch','--show-current'],checkout).trim(),'feature/test-audio');
  assert.equal(run('git',['show-ref','--verify','--quiet','refs/heads/main'],checkout).status,1,'Fixture must not contain local main.');
  assert.equal(run('git',['show-ref','--verify','--quiet','refs/remotes/origin/main'],checkout).status,1,'origin/main must initially be absent.');
  assert.notEqual(run('git',['diff','--name-only','main'],checkout).status,0,'Legacy local-main comparison must fail.');

  let result=run(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref','origin/main'],checkout);
  assert.notEqual(result.status,0,'Missing origin/main must fail before any generation.');
  assert.match(result.stderr,/does not exist or is not a commit/);

  git(['fetch','--no-tags','origin','main:refs/remotes/origin/main'],checkout);
  assert.equal(rev(checkout,'origin/main'),remoteMainBefore,'Explicit fetch resolved the wrong main commit.');
  assert.equal(run('git',['show-ref','--verify','--quiet','refs/heads/main'],checkout).status,1,'Fetching origin/main created local main.');
  git(['fetch','--no-tags','--unshallow','origin'],checkout);

  const mergeBase=git(['merge-base','HEAD','origin/main'],checkout).trim();
  assert.equal(mergeBase,remoteMainBefore,'merge-base must be the fixture main commit.');
  const changed=git(['diff','--name-only',`${mergeBase}...HEAD`],checkout).trim().split('\n').filter(Boolean);
  assert.deepEqual(changed,['feature-only.txt'],'Feature diff must contain exactly the fixture feature file.');

  result=run(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref','origin/main'],checkout);
  assert.equal(result.status,0,result.stderr);
  assert.match(result.stdout,/baseRef=origin\/main/);
  assert.match(result.stdout,new RegExp(`mergeBase=${mergeBase}`));
  assert.match(result.stdout,/diffFiles=1/);
  assert.equal(run('git',['show-ref','--verify','--quiet','refs/heads/main'],checkout).status,1,'Safety scan created local main.');
  assert.equal(rev(remote,'refs/heads/main'),remoteMainBefore,'Safety scan modified the mock remote main.');

  for (const unsafe of ['origin/main;touch-pwned','origin/main && whoami','origin/main with-space','origin/main|id']) {
    result=run(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref',unsafe],checkout);
    assert.notEqual(result.status,0,`Unsafe base ref was accepted: ${unsafe}`);
    assert.match(result.stderr,/Unsafe Git base ref/);
  }

  git(['switch','--orphan','unrelated'],seed);
  fs.writeFileSync(path.join(seed,'unrelated.txt'),'unrelated fixture\n');
  git(['add','unrelated.txt'],seed);
  git(['commit','-m','fixture unrelated'],seed);
  git(['push','origin','unrelated'],seed);
  git(['fetch','--no-tags','origin','unrelated:refs/remotes/origin/unrelated'],checkout);
  result=run(process.execPath,['scripts/validate-repository-safety.mjs','--base-ref','origin/unrelated'],checkout);
  assert.notEqual(result.status,0,'Unrelated histories must fail.');
  assert.match(result.stderr,/Cannot compute merge-base/);

  git(['init','--bare',noMainRemote],temp);
  result=run('git',['fetch','--no-tags',pathToFileURL(noMainRemote).href,'main:refs/remotes/no-main/main'],checkout);
  assert.notEqual(result.status,0,'Fetching a completely absent main ref must fail.');
  assert.match(result.stderr,/couldn't find remote ref main/);
  assert.equal(run('git',['show-ref','--verify','--quiet','refs/remotes/no-main/main'],checkout).status,1);

  assert.equal(rev(remote,'refs/heads/main'),remoteMainBefore,'Reverse tests modified the mock remote main.');
  assert.equal(run('git',['show-ref','--verify','--quiet','refs/heads/main'],checkout).status,1,'Reverse tests created local main.');
  assert.equal(git(['config','--global','--list'],checkout).trim(),'','Fixture unexpectedly read a global Git config.');
  console.log('Validated self-contained Git fixture: isolated bare remote, depth-1 feature clone, explicit origin/main fetch, correct merge-base/diff, and clear missing/unrelated/unsafe-ref failures.');
} finally {
  fs.rmSync(temp,{recursive:true,force:true});
}
