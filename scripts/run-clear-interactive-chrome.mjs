import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const baseUrl=process.env.NIKIGO_PREVIEW_URL||'http://127.0.0.1:8769';
const root=path.resolve('quality-fix/nikigo-clear-interactive-pilot');
const shots=path.join(root,'screenshots');
const frames=path.join(root,'recording-frames');
const movie=path.join(root,'nikigo-lesson-11-390-flow.mov');
const recordScreen=process.env.NIKIGO_RECORD_SCREEN==='1';
await mkdir(shots,{recursive:true});
await rm(frames,{recursive:true,force:true});
await mkdir(frames,{recursive:true});
const profile=await mkdtemp(path.join(tmpdir(),'nikigo-clear-chrome-'));
const debugPort=9400+(process.pid%200);
const chromeArguments=['--disable-gpu','--no-first-run','--no-default-browser-check','--disable-background-networking',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,'--window-position=0,0','--window-size=390,844','about:blank'];
if(!recordScreen)chromeArguments.unshift('--headless=new');
const chrome=spawn(chromePath,chromeArguments,{stdio:['ignore','ignore','pipe']});
let chromeError='';chrome.stderr.on('data',chunk=>{chromeError+=String(chunk).slice(0,2000);});
let screenRecorder=null;

const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function waitForPort(){for(let i=0;i<160;i++){try{const response=await fetch(`http://127.0.0.1:${debugPort}/json/version`);if(response.ok)return debugPort;}catch{}if(chrome.exitCode!==null)break;await delay(50);}throw new Error(`Chrome DevTools port did not start. ${chromeError.trim()}`);}
const port=await waitForPort();
const pageInfo=await fetch(`http://127.0.0.1:${port}/json/new?${encodeURIComponent('about:blank')}`,{method:'PUT'}).then(r=>r.json());

class CDP {
  constructor(url){this.ws=new WebSocket(url);this.next=1;this.pending=new Map();this.events=new Map();this.ready=new Promise((resolve,reject)=>{this.ws.addEventListener('open',resolve,{once:true});this.ws.addEventListener('error',reject,{once:true});});this.ws.addEventListener('message',event=>{const message=JSON.parse(event.data);if(message.id){const pending=this.pending.get(message.id);if(!pending)return;this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result);}else for(const listener of this.events.get(message.method)||[])listener(message.params);});}
  async send(method,params={}){await this.ready;const id=this.next++;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.ws.send(JSON.stringify({id,method,params}));});}
  on(method,listener){const list=this.events.get(method)||[];list.push(listener);this.events.set(method,list);}
  close(){this.ws.close();}
}

const cdp=new CDP(pageInfo.webSocketDebuggerUrl);
const consoleEntries=[];const badResponses=[];const exceptions=[];let frameNumber=0;let saveFrames=false;let frameChain=Promise.resolve();
cdp.on('Log.entryAdded',({entry})=>{if(['warning','error'].includes(entry.level))consoleEntries.push({level:entry.level,text:entry.text,url:entry.url||''});});
cdp.on('Runtime.exceptionThrown',({exceptionDetails})=>exceptions.push(exceptionDetails.text||exceptionDetails.exception?.description||'Runtime exception'));
cdp.on('Network.responseReceived',({response})=>{if(response.status>=400)badResponses.push({status:response.status,url:response.url});});
cdp.on('Page.screencastFrame',event=>{cdp.send('Page.screencastFrameAck',{sessionId:event.sessionId}).catch(()=>{});if(!saveFrames)return;const name=String(++frameNumber).padStart(5,'0')+'.jpg';frameChain=frameChain.then(()=>writeFile(path.join(frames,name),Buffer.from(event.data,'base64')));});

async function evaluate(expression){const result=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.text);return result.result.value;}
async function waitFor(expression,message='condition'){for(let i=0;i<160;i++){try{if(await evaluate(expression))return;}catch{}await delay(50);}throw new Error(`Timed out waiting for ${message}`);}
async function navigate(url){await cdp.send('Page.navigate',{url});await waitFor(`document.readyState==='complete'`,'page load');await delay(120);}
async function click(selector){const result=await evaluate(`(()=>{const nodes=[...document.querySelectorAll(${JSON.stringify(selector)})].filter(node=>!node.disabled&&node.getClientRects().length);if(nodes.length!==1)return {count:nodes.length};nodes[0].click();return {count:1};})()`);assert.equal(result.count,1,`Expected one visible control: ${selector}`);await delay(210);}
async function clickCourse11(){const result=await evaluate(`(()=>{const nodes=[...document.querySelectorAll('.courseAction[data-course-id="lesson-11"]')];return {count:nodes.length,href:nodes[0]?.href||null};})()`);assert.equal(result.count,1,'Lesson 11 course row missing');assert.ok(result.href?.includes('lesson-11.html'),'Lesson 11 href is incorrect');await navigate(result.href);await waitFor(`location.pathname.endsWith('/lesson-11.html')`,'Lesson 11 navigation');await waitFor(`document.querySelector('#progressCount')?.textContent.trim()==='1 / 13'`,'Lesson 11 opening');}
async function capture(name){const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});await writeFile(path.join(shots,name),Buffer.from(data,'base64'));}
async function captureFull(name){const {cssContentSize}=await cdp.send('Page.getLayoutMetrics');const {data}=await cdp.send('Page.captureScreenshot',{format:'png',captureBeyondViewport:true,fromSurface:true,clip:{x:0,y:0,width:Math.ceil(cssContentSize.width),height:Math.ceil(cssContentSize.height),scale:1}});await writeFile(path.join(shots,name),Buffer.from(data,'base64'));}
async function pageAudit(label){return evaluate(`(()=>{const controls=[...document.querySelectorAll('button,select,a')].filter(node=>node.getClientRects().length);const tooSmall=controls.filter(node=>{const r=node.getBoundingClientRect();return r.width<44||r.height<44;}).map(node=>node.textContent.trim().slice(0,40));return {label:${JSON.stringify(label)},innerWidth,innerHeight,htmlScrollWidth:document.documentElement.scrollWidth,bodyScrollWidth:document.body.scrollWidth,bodyScrollHeight:document.body.scrollHeight,overflow:document.documentElement.scrollWidth>innerWidth+2||document.body.scrollWidth>innerWidth+2,undefinedText:document.body.innerText.includes('undefined'),tooSmall};})()`);
}
async function setViewport(width,height){await cdp.send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:width<=430,screenWidth:width,screenHeight:height});await delay(160);}
async function next(){await click('[data-action="next"]');}
async function showFullDialogue(){for(let i=0;i<2;i++)await click('[data-action="dialogue-next"]');}
async function matchAll(ids){for(const id of ids){await click(`[data-action="match-left"][data-value="${id}"]`);await click(`[data-action="match-right"][data-value="${id}"]`);}}
async function addTokens(keys){for(const key of keys)await click(`[data-action="add-token"][data-value="${key}"]`);await click('[data-action="confirm-build"]');}
async function completeCorrectRoute(){await next();await showFullDialogue();await next();await click('[data-action="answer"][data-value="answer"]');await next();await matchAll(['ask','intro','nice']);await next();await next();await addTokens(['topic:jeoneun','name:haneul','ending:ieyo']);await next();await click('[data-action="answer"][data-value="right"]');await next();await matchAll(['student','teacher','worker']);await next();await showFullDialogue();await next();await addTokens(['topic:jeoneun','identity:student','ending:ieyo']);await next();await click('[data-action="answer"][data-value="nice"]');await next();await click('[data-action="answer"][data-value="right"]');await next();}

const results={browser:'Google Chrome',chromeMode:recordScreen?'isolated-headful-user-data-dir':'isolated-headless-user-data-dir',baseUrl,viewports:[],languages:{},interaction:{},dashboardScreenshots:[],screenshots:[],consoleWarnings:0,consoleErrors:0,networkErrors:[],runtimeExceptions:[],pendingAudioDisabled:false,audioApiRequests:0,audioCost:0};
try{
  await cdp.send('Page.enable');await cdp.send('Runtime.enable');await cdp.send('Network.enable');await cdp.send('Log.enable');
  await setViewport(390,844);
  console.log('chrome: navigate app');
  await navigate(`${baseUrl}/nikigo-app.html`);
  console.log('chrome: guest onboarding');
  await click('[data-i18n="guest"]');
  await waitFor(`location.hash==='#flow'&&document.querySelectorAll('.screen.active .ghost').length===1`,'guest onboarding');
  for(let i=0;i<4;i++){await click('.screen.active .ghost');console.log(`chrome: onboarding ${i+1}/4`);if(i<3)await waitFor(`document.querySelectorAll('.screen.active .ghost').length===1`,'next onboarding step');}
  await waitFor(`location.hash==='#dashboard'`,'course dashboard');
  console.log('chrome: dashboard ready');
  results.viewports.push(await pageAudit('390-home'));
  await evaluate(`scrollTo(0,0)`);await delay(160);
  await capture('dashboard-390-first.png');results.dashboardScreenshots.push('dashboard-390-first.png');
  await evaluate(`document.querySelector('#appNav').style.visibility='hidden'`);
  await captureFull('dashboard-390-full.png');results.dashboardScreenshots.push('dashboard-390-full.png');
  await evaluate(`document.querySelector('#appNav').style.removeProperty('visibility')`);
  await setViewport(768,1024);await evaluate(`scrollTo(0,0)`);await capture('dashboard-768.png');results.dashboardScreenshots.push('dashboard-768.png');
  await setViewport(1440,900);await evaluate(`scrollTo(0,0)`);await capture('dashboard-1440.png');results.dashboardScreenshots.push('dashboard-1440.png');
  await setViewport(390,844);await evaluate(`scrollTo(0,0)`);
  await capture('01-home-390.png');results.screenshots.push('01-home-390.png');
  if(recordScreen){await rm(movie,{force:true});screenRecorder=spawn('/usr/sbin/screencapture',['-v','-R0,0,390,844',movie],{stdio:'ignore'});await delay(700);}
  saveFrames=true;await cdp.send('Page.startScreencast',{format:'jpeg',quality:72,maxWidth:390,maxHeight:844,everyNthFrame:1});
  await click('.appNav button[onclick="go(\'courses\')"]');
  await clickCourse11();
  console.log('chrome: lesson 11 opened');
  await capture('02-opening-390.png');results.screenshots.push('02-opening-390.png');
  results.interaction.enteredFromCourseHome=true;
  await next();
  results.pendingAudioDisabled=await evaluate(`document.querySelectorAll('.audioButton[disabled]').length===1`);
  await showFullDialogue();await capture('03-dialogue-390.png');results.screenshots.push('03-dialogue-390.png');
  await next();
  await click('[data-action="answer"][data-value="question"]');
  assert.equal(await evaluate(`document.querySelectorAll('.choiceButton.isWrong').length===1&&document.querySelectorAll('.choiceButton.isChosen').length===0`),true,'Wrong choice leaked the correct answer');
  await capture('04-choice-error-390.png');results.screenshots.push('04-choice-error-390.png');
  await next();
  await matchAll(['ask','intro','nice']);await next();
  await capture('05-core-teaching-390.png');results.screenshots.push('05-core-teaching-390.png');
  await evaluate(`document.querySelector('[data-action="inspect"][data-value="topic"]').focus()`);
  await cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight'});await cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight'});
  const keyboardFocus=await evaluate(`document.activeElement?.dataset?.value||null`);assert.equal(keyboardFocus,'name');
  await cdp.send('Input.dispatchKeyEvent',{type:'keyDown',key:' ',code:'Space'});await cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:' ',code:'Space'});await delay(180);
  results.interaction.keyboardChunkFocus=keyboardFocus;results.interaction.keyboardActivation=await evaluate(`document.querySelector('[data-action="inspect"][data-value="name"]').getAttribute('aria-pressed')==='true'`);
  const beforeRefresh=await evaluate(`document.querySelector('#progressCount').textContent`);await cdp.send('Page.reload',{ignoreCache:true});await waitFor(`document.readyState==='complete'&&document.querySelector('#progressCount')?.textContent===${JSON.stringify(beforeRefresh)}`,'refresh restore');results.interaction.refreshRestore=true;
  await evaluate(`history.back()`);await waitFor(`document.querySelector('#progressCount')?.textContent==='4 / 13'`,'browser back');await evaluate(`history.forward()`);await waitFor(`document.querySelector('#progressCount')?.textContent==='5 / 13'`,'browser forward');results.interaction.browserBack=true;
  await next();
  await addTokens(['name:haneul','topic:jeoneun','ending:ieyo']);
  assert.equal(await evaluate(`document.querySelectorAll('.feedback.isWrong').length===1`),true);await capture('06-build-error-390.png');results.screenshots.push('06-build-error-390.png');
  await click('[data-action="select-placed"][data-value="topic:jeoneun"]');await click('[data-action="move-left"]');await click('[data-action="confirm-build"]');
  assert.equal(await evaluate(`document.querySelectorAll('.feedback.isCorrect').length===1`),true);await capture('07-build-correct-390.png');results.screenshots.push('07-build-correct-390.png');results.interaction.undoReorder=true;
  await next();await click('[data-action="answer"][data-value="right"]');await next();
  await matchAll(['student','teacher','worker']);await next();
  await showFullDialogue();await capture('08-summary-dialogue-390.png');results.screenshots.push('08-summary-dialogue-390.png');await next();
  await addTokens(['topic:jeoneun','identity:student','ending:ieyo']);await next();
  await click('[data-action="answer"][data-value="nice"]');await next();
  await click('[data-action="answer"][data-value="right"]');await capture('09-final-challenge-390.png');results.screenshots.push('09-final-challenge-390.png');await next();
  assert.equal(await evaluate(`document.querySelector('.retryBanner')?.textContent.includes('错题重练')`),true,'Mistake retry did not start');
  await click('[data-action="answer"][data-value="answer"]');await next();
  await addTokens(['topic:jeoneun','name:haneul','ending:ieyo']);await next();
  await waitFor(`document.querySelector('.completionMeta')?.textContent.includes('+50 XP')`,'first completion');
  const firstXp=await evaluate(`NikigoState.get().xp`);await capture('10-complete-first-390.png');results.screenshots.push('10-complete-first-390.png');results.interaction.firstAwardedXp=50;results.interaction.totalXpAfterFirst=firstXp;
  await click('[data-action="review"]');assert.equal(await evaluate(`document.querySelector('#progressCount').textContent==='1 / 13'`),true);await capture('11-relearn-390.png');results.screenshots.push('11-relearn-390.png');results.interaction.relearn=true;
  for(const lang of ['zh','en','vi','ja']){await evaluate(`(()=>{const select=document.querySelector('#language');select.value=${JSON.stringify(lang)};select.dispatchEvent(new Event('change',{bubbles:true}));})()`);await delay(120);results.languages[lang]=await pageAudit(`390-${lang}`);assert.equal(results.languages[lang].undefinedText,false);assert.equal(results.languages[lang].overflow,false);}
  await evaluate(`(()=>{const select=document.querySelector('#language');select.value='zh';select.dispatchEvent(new Event('change',{bubbles:true}));})()`);
  await completeCorrectRoute();await waitFor(`document.querySelector('.completionMeta')?.textContent.includes('+0 XP')`,'repeat completion');const repeatXp=await evaluate(`NikigoState.get().xp`);assert.equal(repeatXp,firstXp);await capture('12-complete-repeat-390.png');results.screenshots.push('12-complete-repeat-390.png');results.interaction.repeatAwardedXp=0;results.interaction.totalXpAfterRepeat=repeatXp;
  await setViewport(768,900);results.viewports.push(await pageAudit('768-complete'));
  await setViewport(1440,900);results.viewports.push(await pageAudit('1440-complete'));
  await setViewport(390,844);
  saveFrames=false;await cdp.send('Page.stopScreencast');await frameChain;
  if(screenRecorder){screenRecorder.kill('SIGINT');await new Promise(resolve=>{screenRecorder.once('exit',resolve);setTimeout(resolve,3000);});screenRecorder=null;}
  results.interaction.correctWrongRetry=true;results.interaction.touchTargets=true;results.interaction.returnAndRefresh=true;
  results.consoleWarnings=consoleEntries.filter(entry=>entry.level==='warning').length;
  results.consoleErrors=consoleEntries.filter(entry=>entry.level==='error').length;
  results.networkErrors=badResponses.filter(item=>!item.url.includes('favicon.ico'));
  results.runtimeExceptions=exceptions;
  assert.equal(results.pendingAudioDisabled,true);assert.equal(results.consoleWarnings,0);assert.equal(results.consoleErrors,0);assert.equal(results.runtimeExceptions.length,0);assert.equal(results.networkErrors.length,0);
  assert.ok(results.viewports.every(item=>!item.overflow&&!item.undefinedText&&item.tooSmall.length===0),JSON.stringify(results.viewports));
  assert.ok(Object.values(results.languages).every(item=>item.tooSmall.length===0),JSON.stringify(results.languages));
  await writeFile(path.join(root,'ACCEPTANCE_RESULT.json'),JSON.stringify(results,null,2)+'\n');
  console.log(JSON.stringify({status:'PASS',dashboardScreenshots:results.dashboardScreenshots.length,screenshots:results.screenshots.length,frames:frameNumber,firstXp,viewports:results.viewports,languages:Object.keys(results.languages),pendingAudioDisabled:results.pendingAudioDisabled},null,2));
} finally {
  if(screenRecorder){screenRecorder.kill('SIGINT');screenRecorder=null;}
  try{saveFrames=false;await cdp.send('Page.stopScreencast');}catch{}
  cdp.close();chrome.kill('SIGTERM');await delay(300);if(chrome.exitCode===null)chrome.kill('SIGKILL');await rm(profile,{recursive:true,force:true});
}
