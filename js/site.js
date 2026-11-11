/* RadTom: strona publiczna (render, katalog, okno produktu, statystyki). */
import {$,$$,esc,tel,YEAR,DEMO,S,IMG,ST,PH,catName,catDesc,tok,call,doorIcon,SITE_URL,loadData,makeDB,DB,getPhoto} from './core.js';

let filter='',curP=null,IDX=null;
const day=()=>new Date().toISOString().slice(0,10);

/* ---------- anonimowe statystyki (bez cookies i danych osobowych) ---------- */
function track(kind,pid){
 try{
  if(localStorage.getItem('rt_admin'))return;
  const k=(pid?'p:'+pid+':':'s:')+kind,n=+(sessionStorage.getItem(k)||0);
  if(n>=(kind==='views'?1:3))return;sessionStorage.setItem(k,n+1);
  Promise.resolve(DB.bump?DB.bump(pid?'prodStats':'stats',pid||day(),kind):0).catch(()=>{});
 }catch{}
}
document.addEventListener('click',e=>{
 const a=e.target.closest('a[href^="tel:"],a[href^="mailto:"]');if(!a)return;
 const kind=a.href.startsWith('tel:')?'calls':'mails';
 track(kind);if(curP)track(kind,curP);
});

/* ---------- render strony ---------- */
function dimsOf(p){const v=(p.variants||[])[0];if(!v)return'';const r=[];
 if(v.leafW||v.leafH)r.push(['Skrzydło (szer. × wys.)',`${esc(v.leafW||'–')} × ${esc(v.leafH||'–')} mm`]);
 if(v.mountW||v.mountH)r.push(['Wymiar montażowy',`${esc(v.mountW||'–')} × ${esc(v.mountH||'–')} mm`]);
 if((p.variants||[]).length>1)r.push(['Dostępne warianty',`${p.variants.length} wymiary`]);
 return r.length?`<dl class="dims">${r.map(([a,b])=>`<div><dt>${a}</dt><dd>${b}</dd></div>`).join('')}</dl>`:''}
const SVGDOOR=`<svg viewBox="0 0 300 380" width="55%"><g fill="none" stroke="#d4b176"><rect x="62" y="42" width="176" height="316" stroke-width="2"/><rect x="82" y="64" width="136" height="130" stroke-opacity=".5"/><rect x="82" y="214" width="136" height="130" stroke-opacity=".5"/><circle cx="212" cy="204" r="7" fill="#d4b176"/></g></svg>`;

export function renderSite(){
 const yrs=YEAR-(+S.since||YEAR);
 document.title=`Drzwi BHP – ${S.brand}${S.oldName?' (dawniej '+S.oldName+')':''} | od ${yrs} lat na rynku`;
 const nt=$('#notice');nt.hidden=!S.notice;nt.textContent=S.notice||'';
 $('#logo').innerHTML=`${doorIcon}<span><b>${esc(String(S.brand).toUpperCase())}</b><small>Drzwi BHP${S.oldName?' · dawniej '+esc(S.oldName):''}</small></span>`;
 $('#navcall').innerHTML=call('gold sm','Zadzwoń');
 const hero=$('#hero');hero.className='hero'+(IMG.hero?' img':'');if(IMG.hero)hero.style.setProperty('--hi',`url("${IMG.hero}")`);else hero.style.removeProperty('--hi');
 hero.innerHTML=`<div class="wrap"><div>
  <div class="seal"><i></i>Od ${yrs} lat na rynku${S.oldName?' · dawniej '+esc(S.oldName):''}</div>
  <h1>${esc(tok(S.heroTitle))}</h1><p>${esc(tok(S.heroSub))}</p>
  <div class="cta">${call('gold')}<a class="btn ghost" href="#oferta">Zobacz ofertę</a></div></div>
  <div class="hero-art" aria-hidden="true"><svg viewBox="0 0 300 380" width="300"><g fill="none" stroke="#d4b176"><rect x="40" y="20" width="220" height="340" stroke-opacity=".35"/><rect x="62" y="42" width="176" height="316" stroke-width="2"/><rect x="82" y="64" width="136" height="130" stroke-opacity=".5"/><rect x="82" y="214" width="136" height="130" stroke-opacity=".5"/><circle cx="212" cy="204" r="7" fill="#d4b176"/></g></svg></div></div>`;
 $('#stats').innerHTML=(S.stats||[]).map(s=>`<div class="stat"><b>${esc(tok(s.a))}</b><span>${esc(tok(s.b))}</span></div>`).join('');
 renderCatalog();
 const paras=tok(S.aboutText).split(/\n\s*\n/).map(t=>`<p>${esc(t)}</p>`).join('');
 $('#about').innerHTML=`<div><div class="eyebrow">O firmie</div><h2>${esc(tok(S.aboutTitle))}</h2>${paras}
  <div class="timeline"><div class="tl"><b>${esc(S.since)}</b><span>Początek sprzedaży drzwi BHP${S.oldName?' jako '+esc(S.oldName):''}</span></div><div class="tl"><b>${YEAR}</b><span>${esc(S.brand)}: ta sama firma i to samo doświadczenie</span></div></div></div>
  <div class="aimg">${IMG.about?`<img src="${IMG.about}" alt="${esc(S.brand)}" loading="lazy">`:`<div class="aph">${SVGDOOR}</div>`}</div>`;
 $('#feats').innerHTML=(S.feats||[]).map((f,i)=>`<div class="feat"><i>0${i+1}</i><h3>${esc(tok(f.a))}</h3><p>${esc(tok(f.b))}</p></div>`).join('');
 $('#steps').innerHTML=(S.steps||[]).map(f=>`<div class="step"><h3>${esc(tok(f.a))}</h3><p>${esc(tok(f.b))}</p></div>`).join('');
 renderGallery();renderReviews();
 const it=[];
 if(S.phone)it.push(`<div><small>Telefon</small><a class="big" href="${tel(S.phone)}">${esc(S.phone)}</a>${S.phone2?`<br><a href="${tel(S.phone2)}">${esc(S.phone2)}</a>`:''}</div>`);
 if(S.email)it.push(`<div><small>E-mail</small><a href="mailto:${esc(S.email)}">${esc(S.email)}</a></div>`);
 if(S.address)it.push(`<div><small>Adres</small><span>${esc(S.address)}</span></div>`);
 if(S.hours)it.push(`<div><small>Godziny kontaktu</small><span>${esc(S.hours)}</span></div>`);
 $('#contact').innerHTML=`<div><div class="eyebrow">Kontakt</div><h2 style="font-size:clamp(2rem,4.2vw,3.1rem)">Zadzwoń i zamów</h2><p style="color:#c3cddb;max-width:460px">Powiedz, gdzie mają być zamontowane drzwi, a my dobierzemy odpowiedni model.</p><div class="cl">${it.join('')}</div></div>
  ${S.address?`<div class="map" id="mapbox"><button class="btn gold" id="showMap">Pokaż mapę</button><p>Mapa Google ładuje się dopiero po kliknięciu. Wtedy Google może zapisać dane o Twojej wizycie.</p></div>`:`<div class="callbox"><h3>Chętnie doradzimy</h3><p>Nie wiesz, jaką klasę odporności lub jaki wymiar wybrać? Zadzwoń, to szybciej niż szukanie w katalogach.</p>${call('gold')}</div>`}`;
 const sm=$('#showMap');if(sm)sm.onclick=()=>{$('#mapbox').innerHTML=`<iframe title="Mapa" src="https://maps.google.com/maps?q=${encodeURIComponent(S.address)}&z=15&output=embed"></iframe>`};
 $('#foot').innerHTML=`<span>© ${YEAR} ${esc(S.brand)}${S.oldName?' (dawniej '+esc(S.oldName)+')':''}${S.nip?' · '+esc(S.nip):''}</span><span><a href="polityka-prywatnosci.html">Polityka prywatności</a><a href="#admin" id="adminLink">Panel administratora</a></span>`;
 $('#mbar').innerHTML=call('gold','Zadzwoń i zamów');
 $('#adminLink').onclick=e=>{e.preventDefault();openAdmin()};
 jsonLd();
}
function jsonLd(){
 let ld=$('#ld');if(!ld){ld=document.createElement('script');ld.id='ld';ld.type='application/ld+json';document.head.appendChild(ld)}
 const o={'@context':'https://schema.org','@type':'LocalBusiness',name:S.brand,alternateName:S.oldName||undefined,url:SITE_URL+'/',telephone:S.phone||undefined,email:S.email||undefined,address:S.address||undefined,foundingDate:String(S.since),description:'Sprzedaż drzwi BHP: przeciwpożarowych, technicznych, ewakuacyjnych.'};
 ld.textContent=JSON.stringify(o);
}
function renderCatalog(){
 const P=ST.P,cats=[...new Set(P.map(p=>p.category).filter(Boolean))];
 const names=(S.categories||[]).map(catName);
 const ordered=[...names.filter(c=>cats.includes(c)),...cats.filter(c=>!names.includes(c))];
 if(filter&&!ordered.includes(filter))filter='';
 $('#filters').innerHTML=ordered.length>1?`<button class="chip ${filter?'':'on'}" data-c="">Wszystkie</button>`+ordered.map(c=>`<button class="chip ${filter===c?'on':''}" data-c="${esc(c)}">${esc(c)}</button>`).join(''):'';
 $$('#filters .chip').forEach(b=>b.onclick=()=>{filter=b.dataset.c;renderCatalog()});
 const list=P.filter(p=>!filter||p.category===filter).sort((a,b)=>(a.order||0)-(b.order||0));
 $('#grid').innerHTML=list.length?list.map(p=>`<article class="card" data-id="${esc(p.id)}"><div class="ph"><img src="${p.thumb||PH}" alt="${esc(p.name)}" loading="lazy">${p.badge?`<span class="bdg">${esc(p.badge)}</span>`:''}</div>
  <div class="cb"><div class="cat">${esc(p.category||'')}</div><h3>${esc(p.name)}</h3><p>${esc(p.short||'')}</p>${dimsOf(p)}
  <div class="ca"><button class="btn sm line" data-open="${esc(p.id)}">Szczegóły</button>${S.phone?`<a class="btn sm gold" href="${tel(S.phone)}">Zamów</a>`:''}</div></div></article>`).join(''):`<div class="empty" style="grid-column:1/-1">${DEMO?'':'Katalog jest w przygotowaniu. '}${S.phone?`Zadzwoń: <b>${esc(S.phone)}</b>, a doradzimy i dobierzemy drzwi.`:'Skontaktuj się z nami, a doradzimy i dobierzemy drzwi.'}</div>`;
 $$('#grid .card').forEach(c=>c.onclick=e=>{if(e.target.closest('a'))return;openProduct(c.dataset.id)});
 const cl=$('#catlinks');
 if(IDX&&IDX.kategorie?.length){cl.hidden=false;cl.innerHTML='<span>Strony kategorii:</span>'+IDX.kategorie.map(k=>`<a class="chip" href="${esc(k.url)}">${esc(k.nazwa)}</a>`).join('')}else cl.hidden=true;
}
function renderGallery(){
 const g=S.gallery||[],sec=$('#realizacje');sec.hidden=!g.length;if(!g.length)return;
 $('#gal').innerHTML=g.map((x,i)=>`<button class="gi" data-i="${i}" aria-label="${esc(x.cap||'Realizacja')}"><img alt="${esc(x.cap||'Realizacja')}" loading="lazy">${x.cap?`<span>${esc(x.cap)}</span>`:''}</button>`).join('');
 const load=async()=>{const imgs=await Promise.all(g.map(x=>getPhoto(x.id)));$$('#gal .gi').forEach((b,i)=>{$('img',b).src=imgs[i]||PH;b.onclick=()=>lightbox(imgs[i]||PH,g[i].cap)})};
 if('IntersectionObserver'in window){const io=new IntersectionObserver(en=>{if(en.some(e=>e.isIntersecting)){io.disconnect();load()}},{rootMargin:'300px'});io.observe(sec)}else load();
}
function renderReviews(){
 const r=(S.reviews||[]).filter(x=>x.t),sec=$('#opinie');sec.hidden=!r.length;if(!r.length)return;
 $('#revs').innerHTML=r.map(x=>`<blockquote class="rev"><p>„${esc(x.t)}”</p>${x.a?`<b>${esc(x.a)}</b>`:''}${x.f?`<span>${esc(x.f)}</span>`:''}</blockquote>`).join('');
}

/* ---------- okno produktu i podgląd zdjęcia ---------- */
function closeModal(){const m=$('#modal');m.classList.remove('on');document.body.style.overflow='';curP=null;history.replaceState(null,'',location.pathname+location.search)}
function lightbox(src,cap){const m=$('#modal');m.innerHTML=`<div class="lb"><button class="mx" aria-label="Zamknij">×</button><img src="${src}" alt="${esc(cap||'')}">${cap?`<p>${esc(cap)}</p>`:''}</div>`;m.classList.add('on');document.body.style.overflow='hidden';$('.mx',m).onclick=closeModal;m.onclick=e=>{if(e.target===m)closeModal()}}
async function openProduct(id,push=true){
 const p=ST.P.find(x=>x.id===id);if(!p)return;
 const m=$('#modal');if(push)history.replaceState(null,'','#produkt-'+id);
 curP=id;track('views',id);
 const vs=p.variants||[],named=vs.some(v=>v.name),subj=encodeURIComponent('Zapytanie: '+p.name);
 const page=IDX?.produkty?.find(x=>x.id===id);
 m.innerHTML=`<div class="mbox" role="dialog" aria-modal="true"><button class="mx" aria-label="Zamknij">×</button>
  <div class="gal"><div class="main"><img id="mainImg" src="${p.thumb||PH}" alt="${esc(p.name)}"></div><div class="thumbs" id="thumbs"></div></div>
  <div class="mi"><div class="cat">${esc(p.category||'')}</div><h2>${esc(p.name)}</h2>
   <div class="price">${p.price?esc(p.price):'Cena: zapytaj telefonicznie'}</div>
   <div class="desc">${esc(p.desc||p.short||'')}</div>
   ${vs.length?`<h4>Wymiary (mm)</h4><table class="t"><tr>${named?'<th>Wariant</th>':''}<th>Skrzydło szer.</th><th>Skrzydło wys.</th><th>Montaż szer.</th><th>Montaż wys.</th></tr>${vs.map(v=>`<tr>${named?`<td>${esc(v.name)}</td>`:''}<td>${esc(v.leafW||'–')}</td><td>${esc(v.leafH||'–')}</td><td>${esc(v.mountW||'–')}</td><td>${esc(v.mountH||'–')}</td></tr>`).join('')}</table>`:''}
   ${(p.specs||[]).length?`<h4>Parametry</h4><table class="t kv">${p.specs.map(s=>`<tr><th>${esc(s.k)}</th><td>${esc(s.v)}</td></tr>`).join('')}</table>`:''}
   <div class="mcta">${call('gold','Zadzwoń i zamów: '+esc(S.phone))}${S.email?`<a class="btn line" href="mailto:${esc(S.email)}?subject=${subj}">Wyślij zapytanie e-mail</a>`:''}${page?`<a class="btn line" href="${esc(page.url)}">Pełna strona produktu</a>`:''}</div></div></div>`;
 m.classList.add('on');document.body.style.overflow='hidden';
 $('.mx',m).onclick=closeModal;m.onclick=e=>{if(e.target===m)closeModal()};
 if((p.photoIds||[]).length){
  const imgs=(await Promise.all(p.photoIds.map(getPhoto))).filter(Boolean);
  if(imgs.length&&curP===id){
   $('#mainImg').src=imgs[0];
   if(imgs.length>1){$('#thumbs').innerHTML=imgs.map((s,i)=>`<img src="${s}" class="${i?'':'on'}" alt="">`).join('');
    $$('#thumbs img').forEach(t=>t.onclick=()=>{$('#mainImg').src=t.src;$$('#thumbs img').forEach(x=>x.classList.toggle('on',x===t))})}
  }
 }
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&$('#modal').classList.contains('on'))closeModal()});
$('#burger').onclick=()=>$('#nav').classList.toggle('open');
$('#nav').onclick=e=>{if(e.target.closest('a'))$('#nav').classList.remove('open')};

/* ---------- panel administratora (ładowany dopiero po kliknięciu) ---------- */
async function openAdmin(){
 const m=await import('./admin.js');
 m.openAdmin(async()=>{await loadData();renderSite()});
}
window.addEventListener('hashchange',()=>{if(location.hash==='#admin')openAdmin()});

/* ---------- start ---------- */
async function start(){
 await loadData();
 renderSite();
 track('views');
 // pliki wygenerowane skryptem (strony kategorii i produktów), jeśli istnieją
 fetch('api/produkty.json').then(r=>r.ok?r.json():null).then(j=>{if(j){IDX=j;renderCatalog()}}).catch(()=>{});
 const h=location.hash;
 if(h.startsWith('#produkt-'))openProduct(h.slice(9),false);else if(h==='#admin')openAdmin();
}
start();
