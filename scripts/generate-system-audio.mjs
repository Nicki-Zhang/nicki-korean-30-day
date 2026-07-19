import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const manifestPaths = process.argv.slice(2);
const targets = manifestPaths.length
  ? manifestPaths
  : ['audio/lesson-01/manifest.json', 'audio/lesson-02/manifest.json', 'audio/lesson-03/manifest.json', 'audio/lesson-04/manifest.json'];

function run(command, args) {
  return new Promise((resolvePromise, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', code => code === 0 ? resolvePromise() : reject(new Error(`${command} exited with code ${code}.`)));
  });
}

const work = await mkdtemp(join(tmpdir(), 'nikigo-system-audio-'));
try {
  for (const manifestPath of targets) {
    const manifest = JSON.parse(await readFile(resolve(manifestPath), 'utf8'));
    for (const item of manifest.items || []) {
      if (item.voiceSource !== 'apple-system-ko-KR-yuna') continue;
      if (item.reviewStatus !== 'pending') throw new Error(`${manifest.lesson}/${item.id} must be pending before generation.`);
      if (!item.speechText || /^[ㄱ-ㅎㅏ-ㅣ]$/u.test(item.speechText)) throw new Error(`${manifest.lesson}/${item.id} has unsafe system speechText.`);
      const aiff = join(work, `${manifest.lesson}-${item.id}.aiff`);
      const output = resolve('audio', manifest.lesson, item.file);
      await run('/usr/bin/say', ['-v', 'Yuna', '-o', aiff, item.speechText]);
      await run('/usr/bin/afconvert', [aiff, output, '-f', 'WAVE', '-d', 'LEI16']);
      console.log(`Generated pending system audio ${manifest.lesson}/${item.file}`);
    }
  }
} finally {
  await rm(work, { recursive: true, force: true });
}
