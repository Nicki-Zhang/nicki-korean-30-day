import { spawn } from 'node:child_process';
import { mkdtemp, rm, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const baseUrl = 'http://127.0.0.1:4181/artifacts/nikigo-course-shell-v1';
const movie = path.resolve('artifacts/nikigo-course-shell-v1/course-shell-motion-demo.mov');
const profile = await mkdtemp(path.join(tmpdir(), 'nikigo-shell-motion-'));
const debugPort = 9700 + (process.pid % 150);
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

await rm(movie, { force: true });
const chrome = spawn(chromePath, [
  '--disable-background-networking',
  '--disable-extensions',
  '--no-first-run',
  '--no-default-browser-check',
  `--remote-debugging-port=${debugPort}`,
  `--user-data-dir=${profile}`,
  '--window-position=0,0',
  '--window-size=390,844',
  `--app=${baseUrl}/index.html?course=lesson11&state=choice&lang=zh`
], { stdio: ['ignore', 'ignore', 'pipe'] });

let chromeError = '';
chrome.stderr.on('data', chunk => { chromeError += String(chunk).slice(0, 1000); });

async function waitForPort() {
  for (let attempt = 0; attempt < 160; attempt += 1) {
    try {
      const response = await fetch(`http://127.0.0.1:${debugPort}/json`);
      if (response.ok) return response.json();
    } catch {}
    await delay(50);
  }
  throw new Error(`Chrome did not start. ${chromeError}`);
}

class CDP {
  constructor(url) {
    this.socket = new WebSocket(url);
    this.nextId = 1;
    this.pending = new Map();
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener('open', resolve, { once: true });
      this.socket.addEventListener('error', reject, { once: true });
    });
    this.socket.addEventListener('message', event => {
      const message = JSON.parse(event.data);
      if (!message.id) return;
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      message.error ? pending.reject(new Error(message.error.message)) : pending.resolve(message.result);
    });
  }
  async send(method, params = {}) {
    await this.ready;
    const id = this.nextId;
    this.nextId += 1;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }
  close() { this.socket.close(); }
}

const pages = await waitForPort();
const page = pages.find(item => item.type === 'page');
if (!page) throw new Error('Chrome app page was not found.');
const cdp = new CDP(page.webSocketDebuggerUrl);
const evaluate = expression => cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true });
const navigate = async url => {
  await cdp.send('Page.navigate', { url });
  await delay(700);
};

let recorder;
try {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await delay(900);
  recorder = spawn('/usr/sbin/screencapture', ['-v', '-R0,0,390,844', movie], { stdio: 'ignore' });
  await delay(900);

  await evaluate(`document.querySelectorAll('.choiceButton')[1].click()`);
  await delay(1300);
  await navigate(`${baseUrl}/index.html?course=lesson11&state=build&lang=zh`);
  await evaluate(`document.querySelector('[data-action="add-token"][data-token="저는"]').click()`);
  await delay(350);
  await evaluate(`document.querySelector('[data-action="add-token"][data-token="하늘"]').click()`);
  await delay(350);
  await evaluate(`document.querySelector('[data-action="add-token"][data-token="이에요"]').click()`);
  await delay(900);
  await navigate(`${baseUrl}/index.html?course=lesson10&state=complete-first&lang=zh`);
  await delay(1800);
} finally {
  if (recorder) {
    recorder.kill('SIGINT');
    await new Promise(resolve => recorder.once('exit', resolve));
  }
  cdp.close();
  chrome.kill('SIGTERM');
  await rm(profile, { recursive: true, force: true });
}

const movieStat = await stat(movie);
if (movieStat.size < 100_000) throw new Error(`Motion recording is unexpectedly small: ${movieStat.size} bytes`);
console.log(JSON.stringify({ status: 'PASS', movie, bytes: movieStat.size }, null, 2));
