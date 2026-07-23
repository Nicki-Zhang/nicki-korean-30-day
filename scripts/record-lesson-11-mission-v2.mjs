import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdtemp, mkdir, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

const chromePath='/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const baseUrl=process.env.NIKIGO_PREVIEW_URL||'http://127.0.0.1:4185';
const outputRoot=path.resolve('quality-fix/lesson-11-mission-v2');
const movie=path.join(outputRoot,'lesson-11-mission-v2-390-flow.mov');
const resultFile=path.join(outputRoot,'recording-result.json');
await mkdir(outputRoot,{recursive:true});
await rm(movie,{force:true});

const profile=await mkdtemp(path.join(tmpdir(),'nikigo-mission-v2-chrome-'));
const debugPort=9600+(process.pid%200);
const chrome=spawn(chromePath,[
  '--disable-background-networking','--disable-component-update','--disable-sync','--no-first-run',
  '--no-default-browser-check',`--remote-debugging-port=${debugPort}`,`--user-data-dir=${profile}`,
  '--window-position=0,0','--window-size=390,844','--app=about:blank'
],{stdio:['ignore','ignore','pipe']});
let chromeError='';
chrome.stderr.on('data',chunk=>{chromeError+=String(chunk).slice(0,2000);});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

async function waitForPort(){for(let i=0;i<180;i++){try{const response=await fetch(`http://127.0.0.1:${debugPort}/json/version`);if(response.ok)return;}catch{}if(chrome.exitCode!==null)break;await delay(50);}throw new Error(`Chrome DevTools did not start. ${chromeError.trim()}`);}
await waitForPort();
const pageInfo=(await fetch(`http://127.0.0.1:${debugPort}/json/list`).then(response=>response.json())).find(target=>target.type==='page');
if(!pageInfo)throw new Error('Chrome app page target was not found.');

class CDP {
  constructor(url){this.socket=new WebSocket(url);this.next=1;this.pending=new Map();this.ready=new Promise((resolve,reject)=>{this.socket.addEventListener('open',resolve,{once:true});this.socket.addEventListener('error',reject,{once:true});});this.socket.addEventListener('message',event=>{const message=JSON.parse(event.data);if(!message.id)return;const pending=this.pending.get(message.id);if(!pending)return;this.pending.delete(message.id);message.error?pending.reject(new Error(message.error.message)):pending.resolve(message.result);});}
  async send(method,params={}){await this.ready;const id=this.next++;return new Promise((resolve,reject)=>{this.pending.set(id,{resolve,reject});this.socket.send(JSON.stringify({id,method,params}));});}
  close(){this.socket.close();}
}

const cdp=new CDP(pageInfo.webSocketDebuggerUrl);
async function evaluate(expression){const result=await cdp.send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(result.exceptionDetails)throw new Error(result.exceptionDetails.exception?.description||result.exceptionDetails.text);return result.result.value;}
async function waitFor(expression,label){for(let i=0;i<160;i++){try{if(await evaluate(expression))return;}catch{}await delay(50);}throw new Error(`Timed out: ${label}`);}
async function navigate(url){const result=await cdp.send('Page.navigate',{url});if(result.errorText)throw new Error(`Navigation failed: ${result.errorText}`);await waitFor(`document.readyState==='complete'`,'page load');await delay(220);}
async function click(selector){const result=await evaluate(`(()=>{const nodes=[...document.querySelectorAll(${JSON.stringify(selector)})].filter(node=>!node.disabled&&node.getClientRects().length);if(nodes.length!==1)return nodes.length;nodes[0].click();return 1;})()`);assert.equal(result,1,`Expected one control: ${selector}`);await delay(420);}
async function current(){return evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('nikigoLessonSession:lesson-11'));const step=NikigoLessonConfig.steps[session.step];return {index:session.step,id:step.id,type:step.type,answered:Boolean(session.answers[step.id]),dialogueDone:Array.isArray(step.dialogue)?(session.dialogue[step.id]||1)>=step.dialogue.length:true,retryMode:session.retryMode};})()`);}
async function answerChoice(wrong=false){await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('nikigoLessonSession:lesson-11'));const step=NikigoLessonConfig.steps[session.step];const option=${wrong?'step.options.find(item=>item.id!==step.correct)':'step.options.find(item=>item.id===step.correct)'};document.querySelector('[data-action="answer"][data-value="'+option.id+'"]').click();})()`);await delay(650);}
async function matchAll(){const ids=await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('nikigoLessonSession:lesson-11'));return NikigoLessonConfig.steps[session.step].pairs.map(pair=>pair.id);})()`);for(const id of ids){await click(`[data-action="match-left"][data-value="${id}"]`);await click(`[data-action="match-right"][data-value="${id}"]`);}}
async function buildCorrect(){const keys=await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('nikigoLessonSession:lesson-11'));return NikigoLessonConfig.steps[session.step].groups.map(group=>group.id+':'+group.correct);})()`);for(const key of keys)await click(`[data-action="add-token"][data-value="${key}"]`);await click('[data-action="confirm-build"]');}
async function primary(){await click('.courseActions .primaryAction');}

let recorder;
const trace=[];
try {
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});
  await navigate(`${baseUrl}/lesson-11.html?lang=zh`);
  await evaluate(`(()=>{localStorage.setItem('nikigoLessonSession:lesson-11',JSON.stringify({step:0,answers:{},mistakes:[],retryQueue:[],retryMode:false,match:{},build:{},dialogue:{},inspect:{'copula-rule':'name'},completed:false,completionFirst:null}));const profile=NikigoState.get();localStorage.setItem('nikigoProfile',JSON.stringify({...profile,xp:0,completedLessons:(profile.completedLessons||[]).filter(id=>id!=='lesson-11'),lessonProgress:{...(profile.lessonProgress||{}),'lesson-11':0}}));})()`);
  await navigate(`${baseUrl}/lesson-11.html?lang=zh`);
  await waitFor(`Boolean(window.NikigoLessonConfig&&window.NikigoLesson11Mission&&localStorage.getItem('nikigoLessonSession:lesson-11'))`,'Lesson 11 session');
  recorder=spawn('/usr/sbin/screencapture',['-v','-R0,0,390,844',movie],{stdio:'ignore'});
  await delay(900);
  let wrongUsed=false;
  for(let guard=0;guard<36;guard++){
    const state=await current();
    trace.push({step:state.id,retry:state.retryMode});
    if(state.type==='complete')break;
    if(['choice','scenario','listening'].includes(state.type)&&!state.answered){
      const useWrong=!wrongUsed&&!state.retryMode;
      await answerChoice(useWrong);
      if(useWrong)wrongUsed=true;
    } else if(state.type==='match'&&!state.answered) await matchAll();
    else if(state.type==='build'&&!state.answered) await buildCorrect();
    else if(!state.dialogueDone){while(await evaluate(`document.querySelectorAll('[data-action="dialogue-next"]').length`))await click('[data-action="dialogue-next"]');}
    await primary();
  }
  await delay(1200);
  const final=await evaluate(`(()=>{const session=JSON.parse(localStorage.getItem('nikigoLessonSession:lesson-11'));const profile=NikigoState.get();return {step:session.step,mistakes:session.mistakes,retryMode:session.retryMode,completionFirst:session.completionFirst,xp:profile.xp,completed:profile.completedLessons.includes('lesson-11')};})()`);
  assert.equal(final.step,12);assert.deepEqual(final.mistakes,[]);assert.equal(final.retryMode,false);assert.equal(final.xp,50);assert.equal(final.completed,true);
  recorder.kill('SIGINT');
  await new Promise(resolve=>{recorder.once('exit',resolve);setTimeout(resolve,5000);});
  recorder=null;
  const movieSize=(await stat(movie)).size;
  assert.ok(movieSize>100000,`Recording is unexpectedly small: ${movieSize}`);
  await writeFile(resultFile,JSON.stringify({status:'PASS',viewport:[390,844],trace,final,movieSize},null,2)+'\n');
  console.log(JSON.stringify({status:'PASS',movie,movieSize,steps:trace.length,final},null,2));
} finally {
  if(recorder){recorder.kill('SIGINT');await delay(800);}
  cdp.close();chrome.kill('SIGTERM');await delay(300);if(chrome.exitCode===null)chrome.kill('SIGKILL');await rm(profile,{recursive:true,force:true});
}
