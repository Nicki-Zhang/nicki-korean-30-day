(()=>{
let voices=[];
const loadVoices=()=>{voices=speechSynthesis.getVoices()||[]};
if('speechSynthesis'in window){loadVoices();speechSynthesis.addEventListener?.('voiceschanged',loadVoices)}
const PREFERRED={
 'ko-KR':['Yuna','SunHi','Heami','Sora','Seoyeon','Google 한국의'],
 'ja-JP':['Kyoko','Nanami','O-Ren','Google 日本語'],
 'en-US':['Samantha','Aria','Jenny','Google US English'],
 'zh-CN':['Tingting','Xiaoxiao','Google 普通话'],
 'vi-VN':['Linh','HoaiMy','Google Tiếng Việt']
};
function pickVoice(langCode){
 const base=(langCode||'').split('-')[0].toLowerCase();
 const match=voices.filter(v=>(v.lang||'').toLowerCase().replace('_','-').startsWith(base));
 const names=PREFERRED[langCode]||[];
 return names.map(n=>match.find(v=>v.name.toLowerCase().includes(n.toLowerCase()))).find(Boolean)
  ||match.find(v=>/female|여성/i.test(v.name))||match[0]||null;
}
window.nikigoSpeak=(text,langCode)=>{
 if(!text||!('speechSynthesis'in window))return false;
 const code=langCode||document.documentElement.dataset.speakLang||'ko-KR';
 speechSynthesis.cancel();
 const u=new SpeechSynthesisUtterance(text);
 u.lang=code;u.rate=.8;u.pitch=1;
 const v=pickVoice(code);if(v)u.voice=v;
 speechSynthesis.speak(u);return true;
};
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-speak]');if(!b)return;
 const text=(b.dataset.speak||'').trim();
 if(!text||!('speechSynthesis'in window))return;
 e.preventDefault();e.stopImmediatePropagation();
 window.nikigoSpeak(text,b.dataset.speakVoice||document.documentElement.dataset.speakLang||'ko-KR');
},true);
})();
