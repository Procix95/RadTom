/* RadTom: formularz zapytań, lista zapytania, dobór drzwi do otworu, „otwarte teraz”, poradniki. */
import {$,$$,esc,tel,S,ST,DB,makeDB,toast,tok} from './core.js?v=11122040';

export const safeUrl=u=>/^(https?:\/\/|\/|\.\/|[\w-]+[\w./-]*\.pdf)/i.test(String(u||'').trim())?String(u).trim():'';

/* ---------- lista zapytania (zapamiętywana w przeglądarce) ---------- */
const LS='rt_list';
const getList=()=>{try{return JSON.parse(localStorage.getItem(LS)||'[]')}catch{return[]}};
const saveList=l=>{try{localStorage.setItem(LS,JSON.stringify(l))}catch{}paintList()};
export const inList=id=>getList().some(x=>x.id===id);
export function toggleList(p){const l=getList(),i=l.findIndex(x=>x.id===p.id);if(i>=0)l.splice(i,1);else l.push({id:p.id,name:p.name});saveList(l);return i<0}
export function paintList(){
 const l=getList();let c=$('#lchip');
 if(!c){c=document.createElement('button');c.id='lchip';c.type='button';c.onclick=()=>openInquiry();document.body.appendChild(c)}
 c.hidden=!l.length;c.innerHTML=`<b>${l.length}</b> Lista zapytania · wyślij`;
 $$('[data-addlist]').forEach(b=>{const on=inList(b.dataset.addlist);b.classList.toggle('on',on);b.textContent=on?'✓ Na liście zapytania':'+ Dodaj do zapytania'});
}

/* ---------- formularz zapytania ---------- */
function smsBody(o){return`Zapytanie ze strony ${S.brand}: ${o.name?o.name+', ':''}tel. ${o.phone}${o.items.length?'. Drzwi: '+o.items.join('; '):''}${o.msg?'. '+o.msg:''}`}
export function openInquiry(msg=''){
 let ov=$('#inq');if(!ov){ov=document.createElement('div');ov.id='inq';document.body.appendChild(ov)}
 const items=getList();
 ov.innerHTML=`<div class="inqbox" role="dialog" aria-modal="true"><button class="mx" aria-label="Zamknij" type="button">×</button>
  <div class="eyebrow">Zapytanie</div><h2>Zapytaj o ofertę</h2><p class="inq-lead">Zostaw numer telefonu, a oddzwonimy. Możesz też opisać, czego szukasz.</p>
  ${items.length?`<div class="inq-items"><small>Na Twojej liście:</small>${items.map(x=>`<span>${esc(x.name)}<button type="button" data-rm="${esc(x.id)}" aria-label="Usuń">×</button></span>`).join('')}</div>`:''}
  <form id="inqForm" novalidate><input type="text" name="website" tabindex="-1" autocomplete="off" class="hp" aria-hidden="true">
   <label>Imię (opcjonalnie)<input name="name" maxlength="80" autocomplete="name"></label>
   <label>Numer telefonu *<input name="phone" type="tel" required maxlength="30" autocomplete="tel" placeholder="np. 600 000 000"></label>
   <label>Wiadomość (opcjonalnie)<textarea name="msg" rows="4" maxlength="1500" placeholder="Np. wymiary otworu, klasa odporności, ilość sztuk">${esc(msg)}</textarea></label>
   <p class="inq-note">Wysyłając zapytanie, zgadzasz się, że skontaktujemy się z Tobą w tej sprawie. Szczegóły w <a href="polityka-prywatnosci.html">polityce prywatności</a>.</p>
   <button class="btn gold" type="submit">Wyślij zapytanie</button><div class="inq-err" id="inqErr"></div></form></div>`;
 ov.classList.add('on');document.body.style.overflow='hidden';
 const close=()=>{ov.classList.remove('on');document.body.style.overflow=''};
 $('.mx',ov).onclick=close;ov.onclick=e=>{if(e.target===ov)close()};
 $$('[data-rm]',ov).forEach(b=>b.onclick=()=>{saveList(getList().filter(x=>x.id!==b.dataset.rm));openInquiry($('#inqForm [name=msg]').value)});
 $('#inqForm').onsubmit=async e=>{
  e.preventDefault();const f=e.target,err=$('#inqErr');err.textContent='';
  if(f.website.value)return; // pułapka na boty
  const phone=f.phone.value.trim();
  if(phone.replace(/\D/g,'').length<7){err.textContent='Podaj poprawny numer telefonu.';return}
  let sent=0;try{sent=+sessionStorage.getItem('rt_inq')||0}catch{}
  if(sent>=3){err.textContent='Wysłano już kilka zapytań. Zadzwoń do nas, proszę.';return}
  const o={name:f.name.value.trim(),phone,msg:f.msg.value.trim(),items:getList().map(x=>x.name).slice(0,20),t:Date.now(),read:false,page:location.pathname};
  const btn=f.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Wysyłanie…';
  let ok=true;
  try{await makeDB();await DB.addInquiry(o)}catch(x){console.error(x);ok=false}
  if(S.webhook){try{fetch(S.webhook,{method:'POST',mode:'no-cors',keepalive:true,headers:{'Content-Type':'text/plain'},body:JSON.stringify(o)})}catch{}}
  try{sessionStorage.setItem('rt_inq',String(sent+1))}catch{}
  const sms=S.smsPhone?`<a class="btn line" href="sms:${esc(String(S.smsPhone).replace(/[^\d+]/g,''))}?&body=${encodeURIComponent(smsBody(o))}">Wyślij też SMS-em</a>`:'';
  ov.querySelector('.inqbox').innerHTML=`<button class="mx" aria-label="Zamknij" type="button">×</button><div class="inq-done"><div class="tick">${ok?'✓':'!'}</div>
   <h2>${ok?'Dziękujemy!':'Nie udało się wysłać'}</h2>
   <p>${ok?'Dostaliśmy Twoje zapytanie i oddzwonimy najszybciej, jak się da.':'Spróbuj ponownie za chwilę albo skontaktuj się z nami bezpośrednio.'}</p>
   <div class="inq-act">${S.phone?`<a class="btn gold" href="${tel(S.phone)}">Zadzwoń: ${esc(S.phone)}</a>`:''}${ok?'':sms}</div></div>`;
  $('.mx',ov).onclick=close;if(ok){try{localStorage.removeItem(LS)}catch{}paintList()}
 };
 setTimeout(()=>{const p=$('#inqForm [name=phone]');p&&p.focus()},50);
}
document.addEventListener('keydown',e=>{const ov=$('#inq');if(e.key==='Escape'&&ov&&ov.classList.contains('on')){ov.classList.remove('on');document.body.style.overflow=''}});

/* ---------- dobór drzwi do otworu ---------- */
let fit=null;const TOL=50;
const num=v=>{const n=parseInt(String(v||'').replace(/\D/g,''),10);return Number.isFinite(n)?n:null};
export const fitsOpening=p=>{
 if(!fit)return true;
 return(p.variants||[]).some(v=>{const mw=num(v.mountW),mh=num(v.mountH);return mw&&mh&&Math.abs(mw-fit.w)<=TOL&&Math.abs(mh-fit.h)<=TOL})
};
export function renderFit(onChange){
 const box=$('#fit');if(!box)return;
 const has=ST.P.some(p=>(p.variants||[]).some(v=>num(v.mountW)&&num(v.mountH)));
 box.hidden=!has;if(!has){fit=null;return}
 box.innerHTML=`<div class="fit-t"><b>Dobierz drzwi do otworu</b><span>Wpisz wymiary otworu w milimetrach, a pokażemy pasujące modele (orientacyjnie, z tolerancją ±5 cm).</span></div>
  <form class="fit-f" id="fitF"><label>Szerokość<input name="w" inputmode="numeric" placeholder="np. 990" value="${fit?fit.w:''}"></label><i>×</i><label>Wysokość<input name="h" inputmode="numeric" placeholder="np. 2065" value="${fit?fit.h:''}"></label>
  <button class="btn gold sm" type="submit">Szukaj</button>${fit?'<button class="btn ghost sm fit-x" type="button" id="fitX">Pokaż wszystkie</button>':''}</form>
  ${fit?`<div class="fit-r" id="fitR"></div>`:''}`;
 $('#fitF').onsubmit=e=>{e.preventDefault();const w=num(e.target.w.value),h=num(e.target.h.value);
  if(!w||!h){toast('Wpisz szerokość i wysokość w mm','err');return}fit={w,h};renderFit(onChange);onChange()};
 const x=$('#fitX');if(x)x.onclick=()=>{fit=null;renderFit(onChange);onChange()};
}
export function fitResult(n){const r=$('#fitR');if(!r)return;
 r.innerHTML=n?`Pasujące modele: <b>${n}</b>. Wymiar potwierdzimy telefonicznie.`:`Nie ma gotowego modelu o takim wymiarze. <a href="#" id="fitAsk">Zapytaj nas</a>, sprawdzimy możliwości.`;
 const a=$('#fitAsk');if(a)a.onclick=e=>{e.preventDefault();openInquiry(`Szukam drzwi do otworu ${fit.w} × ${fit.h} mm.`)}}
export const fitActive=()=>!!fit;

/* ---------- otwarte teraz ---------- */
const norm=s=>String(s).toLowerCase().replace(/ł/g,'l').normalize('NFD').replace(/[̀-ͯ]/g,'');
const DAYRE=/(?<![a-z])(poniedzialek|wtorek|sroda|czwartek|piatek|sobota|niedziela|codziennie|pon|wt|sr|czw|pt|sob|ndz|nd)(?![a-z])/g;
const DAYN={poniedzialek:1,pon:1,wtorek:2,wt:2,sroda:3,sr:3,czwartek:4,czw:4,piatek:5,pt:5,sobota:6,sob:6,niedziela:7,ndz:7,nd:7};
const NAMES=['','w poniedziałek','we wtorek','w środę','w czwartek','w piątek','w sobotę','w niedzielę'];
function parseHours(text){
 const sch={};
 for(const line of String(text||'').split(/\n/)){
  const n=norm(line),t=/(\d{1,2})[:.](\d{2})\s*[-–—]\s*(\d{1,2})[:.](\d{2})/.exec(n);if(!t)continue;
  const from=+t[1]*60+ +t[2],to=+t[3]*60+ +t[4],head=n.slice(0,t.index),toks=head.match(DAYRE)||[];
  let days=[];
  if(toks.includes('codziennie'))days=[1,2,3,4,5,6,7];
  else if(toks.length>=2&&/[-–—]|\bdo\b/.test(head)){let a=DAYN[toks[0]],b=DAYN[toks[1]];for(let d=a;;d=d%7+1){days.push(d);if(d===b)break;if(days.length>7)break}}
  else if(toks.length)days=toks.map(x=>DAYN[x]);
  days.forEach(d=>{(sch[d]=sch[d]||[]).push([from,to])});
 }
 return Object.keys(sch).length?sch:null;
}
const fmt=m=>`${Math.floor(m/60)}:${String(m%60).padStart(2,'0')}`;
export function openNow(text){
 const sch=parseHours(text);if(!sch)return null;
 const parts=new Intl.DateTimeFormat('en-US',{timeZone:'Europe/Warsaw',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
 const g=t=>parts.find(p=>p.type===t).value,wd={Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6,Sun:7}[g('weekday')],now=(+g('hour')%24)*60+ +g('minute');
 for(const[a,b]of sch[wd]||[])if(now>=a&&now<b)return{open:true,label:`Otwarte teraz, do ${fmt(b)}`};
 for(let k=0;k<8;k++){const d=(wd-1+k)%7+1,slots=(sch[d]||[]).filter(([a])=>k>0||a>now).sort((x,y)=>x[0]-y[0]);
  if(slots.length)return{open:false,label:`Zamknięte, otwieramy ${k===0?'dziś':k===1?'jutro':NAMES[d]} o ${fmt(slots[0][0])}`}}
 return{open:false,label:'Zamknięte'};
}

/* ---------- poradniki ---------- */
export function renderGuides(){
 const g=(S.guides||[]).filter(x=>x.a&&x.b),box=$('#guides');if(!box)return;
 box.hidden=!g.length;
 $('#guidesList').innerHTML=g.map(q=>`<details class="fq"><summary>${esc(tok(q.a))}</summary><p>${esc(tok(q.b))}</p></details>`).join('');
}
