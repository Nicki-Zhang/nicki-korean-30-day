import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const artifact = path.join(root, 'artifacts/nikigo-course-shell-v1');
const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const copyCode = await readFile(path.join(artifact, 'course-shell-copy.js'), 'utf8');
const copyContext = {};
copyContext.globalThis = copyContext;
vm.runInNewContext(copyCode, copyContext, { filename:'course-shell-copy.js' });
const copySource = copyContext.NikigoCourseShellCopy;
assert.ok(copySource, 'Localized copy module did not initialize');
const coverage = copySource.validate();
assert.deepEqual({ ...coverage }, { languages:4, uiKeys:44, copyKeys:86, courses:4 });

const expected = {
  zh:{ continue:'继续', l07:'哪一种拆分能得到산？', l11:'选择适合第一次见面的回答。错误时不提前显示答案。', l10:'普通音 → 送气音 → 紧音', gate:'预览 · 音频准备中' },
  en:{ continue:'Continue', l07:'Which split produces 산?', l11:'Choose a response for a first meeting. A wrong choice never reveals the answer early.', l10:'Lenis → aspirated → tense', gate:'Preview · Audio in preparation' },
  vi:{ continue:'Tiếp tục', l07:'Cách tách nào tạo thành 산?', l11:'Chọn câu trả lời phù hợp khi gặp lần đầu. Lựa chọn sai không làm lộ đáp án.', l10:'Âm thường → âm bật hơi → âm căng', gate:'Xem trước · Âm thanh đang chuẩn bị' },
  ja:{ continue:'続ける', l07:'どの分解で산になりますか？', l11:'初対面に合う答えを選びます。不正解でも答えは先に表示しません。', l10:'平音 → 激音 → 濃音', gate:'プレビュー · 音声準備中' }
};
for (const language of copySource.SUPPORTED) {
  assert.equal(copySource.UI[language].next, expected[language].continue);
  assert.equal(copySource.localize(copySource.COPY.l07ChoiceTitle, language), expected[language].l07);
  assert.equal(copySource.localize(copySource.COPY.l11ChoiceLead, language), expected[language].l11);
  assert.equal(copySource.localize(copySource.COPY.l10Option1, language), expected[language].l10);
  assert.equal(copySource.localize(copySource.COPY.gateTitle, language), expected[language].gate);
}
assert.throws(() => copySource.localize({ zh:'仅中文' }, 'en', 'test.missing'), /missing en/);

const mime = new Map([['.html','text/html; charset=utf-8'],['.js','text/javascript; charset=utf-8'],['.css','text/css; charset=utf-8'],['.png','image/png'],['.jpg','image/jpeg'],['.mov','video/quicktime']]);
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    const file = path.resolve(root, `.${pathname}`);
    if (!file.startsWith(root + path.sep)) throw new Error('Unsafe path');
    const body = await readFile(file);
    response.writeHead(200, { 'Content-Type':mime.get(path.extname(file)) || 'application/octet-stream' });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
});
await new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', resolve); });
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}/artifacts/nikigo-course-shell-v1/index.html`;
const profile = await mkdtemp(path.join(tmpdir(), 'nikigo-shell-i18n-'));
const debugPort = 9900 + (process.pid % 80);
const chrome = spawn(chromePath, ['--headless=new','--disable-gpu','--disable-background-networking','--no-first-run','--no-default-browser-check',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'about:blank'], { stdio:['ignore','ignore','pipe'] });
const delay = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));

class CDP {
  constructor(url) {
    this.socket = new WebSocket(url); this.next = 1; this.pending = new Map();
    this.ready = new Promise((resolve, reject) => { this.socket.addEventListener('open', resolve, { once:true }); this.socket.addEventListener('error', reject, { once:true }); });
    this.socket.addEventListener('message', event => { const message=JSON.parse(event.data); if(!message.id)return; const pending=this.pending.get(message.id); if(!pending)return; this.pending.delete(message.id); message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result); });
  }
  async send(method, params={}) { await this.ready; const id=this.next++; return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.socket.send(JSON.stringify({id,method,params}));}); }
  close() { this.socket.close(); }
}

async function waitForPort() {
  for (let attempt=0; attempt<160; attempt+=1) { try { const response=await fetch(`http://127.0.0.1:${debugPort}/json/version`); if(response.ok)return; } catch {} await delay(50); }
  throw new Error('Chrome DevTools port did not start');
}

let cdp;
const consoleErrors=[]; const networkErrors=[]; const externalRequests=[];
try {
  await waitForPort();
  const pageInfo=await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent('about:blank')}`,{method:'PUT'}).then(response=>response.json());
  cdp=new CDP(pageInfo.webSocketDebuggerUrl);
  await cdp.send('Page.enable'); await cdp.send('Runtime.enable'); await cdp.send('Network.enable'); await cdp.send('Log.enable');
  cdp.socket.addEventListener('message', event => {
    const message=JSON.parse(event.data);
    if(message.method==='Log.entryAdded'&&['warning','error'].includes(message.params.entry.level))consoleErrors.push(message.params.entry.text);
    if(message.method==='Network.loadingFailed')networkErrors.push(message.params.errorText);
    if(message.method==='Network.requestWillBeSent'){const url=message.params.request.url;if(!url.startsWith(`http://127.0.0.1:${port}/`)&&!url.startsWith('data:'))externalRequests.push(url);}
  });
  const evaluate=async expression=>{const result=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;};
  const waitFor=async expression=>{for(let attempt=0;attempt<100;attempt+=1){try{if(await evaluate(expression))return;}catch{}await delay(30);}throw new Error(`Timed out: ${expression}`);};
  const navigate=async url=>{await cdp.send('Page.navigate',{url});await waitFor(`document.readyState==='complete'&&document.querySelector('[data-lesson-surface]')?.innerText.length>10`);};
  const stateMarker = {
    lesson07:{intro:'l07IntroLead',resume:'l07Resume',explain:'l07ExplainTitle',example:'l07ExampleTag','audio-unavailable':'l07ExampleTag',choice:'l07ChoiceTitle','choice-correct':'l07ChoiceTitle',build:'l07BuildTitle','complete-first':'l07CompleteTitle','complete-repeat':'l07CompleteTitle'},
    lesson11:{intro:'l11IntroLead',dialogue:'l11DialogueLead',choice:'l11ChoiceLead',wrong:'l11Wrong',retry:'remainingOne',build:'l11BuildTitle',correct:'l11BuildTitle','complete-first':'l11CompleteTitle','complete-repeat':'l11CompleteTitle'},
    lesson10:{intro:'l10IntroLead',choice:'l10ChoiceTitle',wrong:'l10Wrong',retry:'remainingOne',build:'l10BuildTitle','complete-first':'l10CompleteTitle','complete-repeat':'l10CompleteTitle'},
    lesson06:{gate:'gateTitle','preview-complete':'l06PreviewTitle'}
  };
  let renderedCases=0;
  const koreanByState=new Map();
  for(const [courseId,course] of Object.entries(copySource.COURSES)){
    for(const state of course.states){
      for(const language of copySource.SUPPORTED){
        await navigate(`${baseUrl}?course=${courseId}&state=${state}&lang=${language}`);
        const marker=copySource.localize(copySource.COPY[stateMarker[courseId][state]],language);
        const audit=await evaluate(`(()=>({lang:document.documentElement.lang,url:location.href,text:document.body.innerText,korean:[...document.querySelectorAll('.koreanHero,.koreanText,.koreanFocus,.optionKorean,.completionKorean,.tokenButton,.placedToken')].map(node=>node.textContent.trim()).join('|'),step:document.querySelector('[data-step]').textContent,storage:Object.keys(localStorage)}))()`);
        assert.equal(audit.lang,language==='zh'?'zh-CN':language);
        assert.ok(audit.url.includes(`lang=${language}`));
        assert.ok(audit.text.includes(marker),`${courseId}/${state}/${language} did not render ${marker}`);
        assert.deepEqual(audit.storage,[]);
        const stateId=`${courseId}:${state}`;
        if(!koreanByState.has(stateId))koreanByState.set(stateId,audit.korean);else assert.equal(audit.korean,koreanByState.get(stateId),`Korean target changed for ${stateId}`);
        renderedCases+=1;
      }
    }
  }

  await navigate(`${baseUrl}?course=lesson11&state=choice&lang=zh`);
  await evaluate(`document.querySelectorAll('.choiceButton')[0].click()`);
  const beforeChoice=await evaluate(`(()=>({step:document.querySelector('[data-step]').textContent,classes:[...document.querySelectorAll('.choiceButton')].map(node=>node.className),feedback:document.querySelector('.feedbackPanel')?.className||'',korean:[...document.querySelectorAll('.optionKorean')].map(node=>node.textContent).join('|')}))()`);
  await evaluate(`(()=>{const select=document.querySelector('[data-language]');select.value='en';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const afterChoice=await evaluate(`(()=>({step:document.querySelector('[data-step]').textContent,classes:[...document.querySelectorAll('.choiceButton')].map(node=>node.className),feedback:document.querySelector('.feedbackPanel')?.className||'',korean:[...document.querySelectorAll('.optionKorean')].map(node=>node.textContent).join('|'),lang:document.documentElement.lang,url:location.href}))()`);
  assert.deepEqual(afterChoice.classes,beforeChoice.classes); assert.equal(afterChoice.feedback,beforeChoice.feedback); assert.equal(afterChoice.step,beforeChoice.step); assert.equal(afterChoice.korean,beforeChoice.korean); assert.equal(afterChoice.lang,'en'); assert.ok(afterChoice.url.includes('lang=en'));

  await navigate(`${baseUrl}?course=lesson11&state=build&lang=zh`);
  await evaluate(`document.querySelector('[data-action="add-token"]').click()`);
  const beforeBuild=await evaluate(`({step:document.querySelector('[data-step]').textContent,tokens:[...document.querySelectorAll('.placedToken')].map(node=>node.textContent).join('|'),empty:document.querySelectorAll('.emptyToken').length})`);
  await evaluate(`(()=>{const select=document.querySelector('[data-language]');select.value='vi';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  const afterBuild=await evaluate(`({step:document.querySelector('[data-step]').textContent,tokens:[...document.querySelectorAll('.placedToken')].map(node=>node.textContent).join('|'),empty:document.querySelectorAll('.emptyToken').length,lang:document.documentElement.lang})`);
  assert.equal(afterBuild.step,beforeBuild.step); assert.equal(afterBuild.tokens,beforeBuild.tokens); assert.equal(afterBuild.empty,beforeBuild.empty); assert.equal(afterBuild.lang,'vi');

  await navigate(`${baseUrl}?course=lesson11&state=retry&lang=zh`);
  const retryStep=await evaluate(`document.querySelector('[data-step]').textContent`);
  await evaluate(`(()=>{const select=document.querySelector('[data-language]');select.value='ja';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  assert.equal(await evaluate(`document.querySelector('[data-step]').textContent`),retryStep);
  assert.ok((await evaluate(`document.body.innerText`)).includes(expected.ja.continue));

  assert.equal(consoleErrors.length,0,JSON.stringify(consoleErrors));
  assert.equal(networkErrors.length,0,JSON.stringify(networkErrors));
  assert.equal(externalRequests.length,0,JSON.stringify(externalRequests));
  console.log(JSON.stringify({status:'PASS',coverage,renderedCases,statePreservation:{choice:true,build:true,retry:true},koreanStable:true,consoleErrors:0,networkErrors:0,externalRequests:0},null,2));
} finally {
  cdp?.close();
  if (chrome.exitCode === null) {
    chrome.kill('SIGTERM');
    await Promise.race([new Promise(resolve => chrome.once('exit', resolve)), delay(2000)]);
  }
  server.close();
  await rm(profile,{recursive:true,force:true,maxRetries:5,retryDelay:100});
}
