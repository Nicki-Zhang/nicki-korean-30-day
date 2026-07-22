import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const baseUrl = process.env.NIKIGO_COURSE_SHELL_URL || 'http://127.0.0.1:4181/artifacts/nikigo-course-shell-v1';
const root = path.resolve('artifacts/nikigo-course-shell-v1');
const evidence = path.join(root,'evidence');
const frames = path.join(root,'motion-frames');
await mkdir(evidence,{recursive:true});
await rm(frames,{recursive:true,force:true});
await mkdir(frames,{recursive:true});

const profile = await mkdtemp(path.join(tmpdir(),'nikigo-course-shell-chrome-'));
const debugPort = 9600 + (process.pid % 200);
const chrome = spawn(chromePath,[
  '--headless=new','--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking',
  `--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'--window-size=1440,1024','about:blank'
],{stdio:['ignore','ignore','pipe']});
let chromeError='';
chrome.stderr.on('data',chunk=>{chromeError += String(chunk).slice(0,2000);});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForPort(){
  for(let i=0;i<160;i++){
    try{const response=await fetch(`http://127.0.0.1:${debugPort}/json/version`);if(response.ok)return;}
    catch{}
    if(chrome.exitCode!==null)break;
    await delay(50);
  }
  throw new Error(`Chrome DevTools port did not start. ${chromeError.trim()}`);
}

class CDP {
  constructor(url){
    this.ws=new WebSocket(url);this.next=1;this.pending=new Map();this.events=new Map();
    this.ready=new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});
    this.ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const pending=this.pending.get(message.id);if(!pending)return;this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result);}else for(const listener of this.events.get(message.method)||[])listener(message.params);});
  }
  async send(method,params={}){await this.ready;const id=this.next++;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  on(method,listener){const list=this.events.get(method)||[];list.push(listener);this.events.set(method,list);}
  close(){this.ws.close();}
}

await waitForPort();
const pageInfo=await fetch(`http://127.0.0.1:${debugPort}/json/new?${encodeURIComponent('about:blank')}`,{method:'PUT'}).then(r=>r.json());
const cdp=new CDP(pageInfo.webSocketDebuggerUrl);
const consoleEntries=[];const networkErrors=[];const requests=[];const exceptions=[];
cdp.on('Log.entryAdded',({entry})=>{if(['warning','error'].includes(entry.level))consoleEntries.push({level:entry.level,text:entry.text});});
cdp.on('Runtime.exceptionThrown',({exceptionDetails})=>exceptions.push(exceptionDetails.text||exceptionDetails.exception?.description||'Runtime exception'));
cdp.on('Network.requestWillBeSent',({request})=>requests.push(request.url));
cdp.on('Network.responseReceived',({response})=>{if(response.status>=400)networkErrors.push({status:response.status,url:response.url});});

async function evaluate(expression){const result=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;}
async function waitFor(expression,label){for(let i=0;i<160;i++){try{if(await evaluate(expression))return;}catch{}await delay(50);}throw new Error(`Timed out: ${label}`);}
async function viewport(width,height){await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<=430,screenWidth:width,screenHeight:height});await delay(100);}
async function navigate(url,readyExpression=`document.querySelector('[data-lesson-surface]')?.innerText.trim().length>20`){await cdp.send('Page.navigate',{url});await waitFor(`document.readyState==='complete'`,'page load');await waitFor(readyExpression,'page surface');await delay(180);}
async function screenshot(name){const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});await writeFile(path.join(evidence,name),Buffer.from(data,'base64'));}
async function click(selector){const result=await evaluate(`(()=>{const node=document.querySelector(${JSON.stringify(selector)});if(!node||node.disabled)return false;node.click();return true;})()`);assert.equal(result,true,`Control unavailable: ${selector}`);await delay(80);}
async function audit(label){return evaluate(`(()=>{const controls=[...document.querySelectorAll('button,a,select')].filter(node=>node.getClientRects().length);return{label:${JSON.stringify(label)},innerWidth,innerHeight,htmlWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,bodyHeight:document.body.scrollHeight,overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)>innerWidth+2,undefinedText:document.body.innerText.includes('undefined'),smallTargets:controls.filter(node=>{const r=node.getBoundingClientRect();return r.width<44||r.height<44;}).map(node=>({text:node.textContent.trim().slice(0,40),width:Math.round(node.getBoundingClientRect().width),height:Math.round(node.getBoundingClientRect().height)})),localStorageKeys:Object.keys(localStorage)}})()`);
}

const results={browser:'Google Chrome',baseUrl,viewports:[],languages:{},interactions:{},screenshots:[],console:[],networkErrors:[],externalRequests:[],reducedMotion:false};
const url=(course,state,lang='zh')=>`${baseUrl}/index.html?course=${course}&state=${state}&lang=${lang}`;

try{
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Network.enable');await cdp.send('Log.enable');
  const captures=[
    [390,844,'lesson07','intro','390-course-intro.png'],
    [390,844,'lesson07','explain','390-explanation.png'],
    [390,844,'lesson11','choice','390-choice.png'],
    [390,844,'lesson11','build','390-build.png'],
    [390,844,'lesson07','choice-correct','390-correct-feedback.png'],
    [390,844,'lesson11','wrong','390-wrong-feedback.png'],
    [390,844,'lesson10','complete-first','390-completion.png'],
    [390,844,'lesson06','gate','390-lesson6-gate.png'],
    [768,1024,'lesson11','dialogue','768-scenario.png'],
    [1440,1024,'lesson07','explain','1440-foundation.png'],
    [1440,1024,'lesson11','dialogue','1440-scenario.png'],
    [1440,1024,'lesson10','choice','1440-checkpoint.png']
  ];
  for(const [width,height,course,state,name] of captures){await viewport(width,height);await navigate(url(course,state));await screenshot(name);results.screenshots.push(name);results.viewports.push(await audit(`${width}-${course}-${state}`));}

  await viewport(1440,1024);await navigate(`${baseUrl}/comparison.html`,`document.querySelectorAll('iframe').length===3`);await delay(500);await screenshot('1440-three-course-types.png');results.screenshots.push('1440-three-course-types.png');

  await viewport(390,844);
  for(const lang of ['zh','en','vi','ja']){await navigate(url('lesson11','intro',lang));results.languages[lang]=await audit(`390-${lang}`);}

  await navigate(url('lesson11','choice'));
  await evaluate(`document.querySelectorAll('.choiceButton')[1].focus()`);
  results.interactions.keyboardChoiceFocused=await evaluate(`document.activeElement?.classList.contains('choiceButton')===true`);
  results.interactions.nativeChoiceControl=await evaluate(`document.activeElement?.tagName==='BUTTON'`);
  await click('.choiceButton:nth-child(2)');await delay(180);
  results.interactions.wrongFeedback=await evaluate(`Boolean(document.querySelector('.feedbackPanel.isWrong'))`);
  results.interactions.noAnswerLeak=await evaluate(`document.querySelectorAll('.choiceButton.isCorrect').length===0`);
  await screenshot('390-keyboard-wrong-feedback.png');results.screenshots.push('390-keyboard-wrong-feedback.png');

  await click('[data-action="exit"]');
  results.interactions.exitDialog=await evaluate(`document.querySelector('dialog')?.open===true&&document.activeElement?.closest('dialog')!==null`);
  await click('[data-exit-cancel]');
  results.interactions.exitDialogClosed=await evaluate(`document.querySelector('dialog')?.open===false`);

  await navigate(url('lesson11','build'));
  for(const token of ['저는','하늘','이에요'])await click(`[data-action="add-token"][data-token="${token}"]`);
  results.interactions.buildCorrect=await evaluate(`Boolean(document.querySelector('.answerZone.isCorrect')&&document.querySelector('.feedbackPanel.isCorrect'))`);

  await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  await navigate(url('lesson10','complete-first'));
  results.reducedMotion=await evaluate(`getComputedStyle(document.querySelector('.completionMark')).animationDuration==='0.00001s'||parseFloat(getComputedStyle(document.querySelector('.completionMark')).animationDuration)<=0.001`);
  await cdp.send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'no-preference'}]});

  await navigate(url('lesson11','choice'));
  const motionShots=['000','080','160','260'];
  await evaluate(`document.querySelectorAll('.choiceButton')[1].click()`);
  for(let i=0;i<motionShots.length;i++){
    if(i>0)await delay(Number(motionShots[i])-Number(motionShots[i-1]));
    const {data}=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:82,captureBeyondViewport:false,fromSurface:true});
    await writeFile(path.join(frames,`${String(i+1).padStart(3,'0')}-${motionShots[i]}ms.jpg`),Buffer.from(data,'base64'));
  }
  await navigate(url('lesson10','complete-first'));await delay(400);
  const {data:completeFrame}=await cdp.send('Page.captureScreenshot',{format:'jpeg',quality:82,captureBeyondViewport:false,fromSurface:true});
  await writeFile(path.join(frames,'005-completion.jpg'),Buffer.from(completeFrame,'base64'));

  results.console=consoleEntries;
  results.networkErrors=networkErrors.filter(item=>!item.url.endsWith('favicon.ico'));
  results.externalRequests=requests.filter(request=>!request.startsWith('http://127.0.0.1:4181/')&&!request.startsWith('data:'));
  assert.ok(results.viewports.every(item=>!item.overflow&&!item.undefinedText&&item.smallTargets.length===0&&item.localStorageKeys.length===0),JSON.stringify(results.viewports));
  assert.ok(Object.values(results.languages).every(item=>!item.overflow&&!item.undefinedText&&item.smallTargets.length===0),JSON.stringify(results.languages));
  assert.equal(results.interactions.wrongFeedback,true);
  assert.equal(results.interactions.noAnswerLeak,true);
  assert.equal(results.interactions.keyboardChoiceFocused,true);
  assert.equal(results.interactions.nativeChoiceControl,true);
  assert.equal(results.interactions.exitDialog,true);
  assert.equal(results.interactions.exitDialogClosed,true);
  assert.equal(results.interactions.buildCorrect,true);
  assert.equal(results.reducedMotion,true);
  assert.equal(results.console.length,0,JSON.stringify(results.console));
  assert.equal(results.networkErrors.length,0,JSON.stringify(results.networkErrors));
  assert.equal(results.externalRequests.length,0,JSON.stringify(results.externalRequests));
  assert.equal(exceptions.length,0,JSON.stringify(exceptions));
  await writeFile(path.join(root,'BROWSER_VALIDATION.json'),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify({status:'PASS',screenshots:results.screenshots.length,viewports:results.viewports.length,languages:Object.keys(results.languages),interactions:results.interactions,reducedMotion:results.reducedMotion,externalRequests:results.externalRequests.length},null,2));
} finally {
  cdp.close();chrome.kill('SIGTERM');await delay(300);if(chrome.exitCode===null)chrome.kill('SIGKILL');await rm(profile,{recursive:true,force:true});
}
