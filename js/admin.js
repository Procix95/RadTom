/* RadTom: panel administratora. Ładowany dopiero po kliknięciu „Panel administratora”. */
import {$,$$,esc,DEMO,DEF,S,IMG,PH,SEED,ST,toast,busy,resize,DB,makeDB,loadAuth,failed,SITE_URL} from './core.js';

let user=null,isAdm=false,authReady=false,tab='prod',ed=null,draft=null,gd=null,listCache=[],reload=null,A=null,booted=false;
const TABS=[['prod','Produkty'],['gal','Realizacje'],['rev','Opinie i baner'],['site','Dane i teksty'],['img','Zdjęcia strony'],['stat','Statystyki'],['tools','Narzędzia i SEO']];
const errMsg=e=>e&&e.code==='permission-denied'?'brak uprawnień (sprawdź reguły Firestore i kolekcję admins)':(e&&e.message)||'błąd';
async function saveSettings(patch){const o={...DEF,...S,...patch};await DB.saveMain(o);Object.assign(S,o)}

export async function openAdmin(onClose){
 reload=onClose;
 if(!$('#aCss')){const l=document.createElement('link');l.id='aCss';l.rel='stylesheet';l.href='css/admin.css';document.head.appendChild(l)}
 let box=$('#admin');if(!box){box=document.createElement('div');box.id='admin';document.body.appendChild(box);box.addEventListener('click',onClick)}
 box.classList.add('on');document.body.style.overflow='hidden';history.replaceState(null,'','#admin');
 box.innerHTML='<div class="a-login"><p>Ładowanie…</p></div>';
 await makeDB();
 if(DEMO||failed())authReady=true;
 else if(!booted){
  booted=true;A=await loadAuth();
  A.au.onAuthStateChanged(A.auth,async u=>{user=u;isAdm=false;
   if(u){try{isAdm=(await A.FS.getDoc(A.FS.doc(A.db,'admins',u.email))).exists()}catch(e){console.warn(e)}
    try{if(isAdm)localStorage.setItem('rt_admin','1')}catch{}}
   authReady=true;if($('#admin').classList.contains('on'))renderAdmin()});
 }
 renderAdmin();
}
function closeAdmin(){$('#admin').classList.remove('on');document.body.style.overflow='';history.replaceState(null,'',location.pathname+location.search);reload&&reload()}
function renderAdmin(){
 const a=$('#admin');
 const top=`<div class="a-top"><b class="serif">${esc(S.brand)} · panel administratora</b><div><a class="a-btn" href="#" data-act="close">Zobacz stronę</a> ${user?'<button class="a-btn" data-act="logout">Wyloguj</button>':''}</div></div>`;
 if(!authReady){a.innerHTML=top+'<div class="a-login"><p>Ładowanie…</p></div>';return}
 if(failed()){a.innerHTML=top+'<div class="a-login"><h2>Błąd połączenia</h2><p>Nie udało się wczytać Firebase. Sprawdź połączenie lub wyłącz blokadę reklam dla tej strony.</p></div>';return}
 if(!DEMO&&!user){a.innerHTML=top+'<div class="a-login"><h2>Logowanie</h2><p>Zaloguj się kontem Google administratora.</p><button class="a-btn pri" data-act="login">Zaloguj przez Google</button></div>';return}
 if(!DEMO&&!isAdm){a.innerHTML=top+`<div class="a-login"><h2>Brak uprawnień</h2><p>Konto ${esc(user.email)} nie jest administratorem tej strony. Dodaj dokument o ID równym temu adresowi (małymi literami) w kolekcji <b>admins</b> w konsoli Firebase.</p><button class="a-btn" data-act="logout">Zmień konto</button></div>`;return}
 a.innerHTML=top+`<div class="a-body"><div class="a-nav">${TABS.map(([k,l])=>`<button data-tab="${k}" class="${tab===k?'on':''}">${l}</button>`).join('')}</div><div id="aMain"></div></div>`;
 showTab();
}
async function showTab(){
 $$('.a-nav button').forEach(b=>b.classList.toggle('on',b.dataset.tab===tab));
 const warn=[DEMO?'<div class="a-warn"><b>Tryb podglądu.</b> Zmiany działają tylko do odświeżenia strony. Aby zapisywać na stałe, uzupełnij konfigurację Firebase w js/config.js.</div>':'',(!S.phone&&tab!=='site')?'<div class="a-warn">Nie ustawiono numeru telefonu. Przyciski „Zadzwoń” są ukryte, dopóki nie wpiszesz go w zakładce <b>Dane i teksty</b>.</div>':''].join('');
 ({prod:viewProducts,gal:viewGal,rev:viewRev,site:viewSite,img:viewImages,stat:viewStats,tools:viewTools}[tab])(warn);
}
const FLD=(l,k,v,o={})=>`<label class="${o.full?'full':''}">${l}${o.area?`<textarea data-k="${k}" ${o.lines?'data-t="lines"':''}>${esc(v)}</textarea>`:`<input type="${o.type||'text'}" data-k="${k}" value="${esc(v)}" ${o.ph?`placeholder="${esc(o.ph)}"`:''}>`}${o.hint?`<div class="a-hint">${o.hint}</div>`:''}</label>`;
function bind(root,obj){
 const h=e=>{const t=e.target;
  if(t.dataset.k){let v=t.type==='checkbox'?t.checked:t.value;if(t.dataset.t==='lines')v=v.split('\n').map(x=>x.trim()).filter(Boolean);if(t.type==='number'&&t.dataset.k==='since')v=+v;obj[t.dataset.k]=v}
  else if(t.dataset.l){obj[t.dataset.l][+t.dataset.i][t.dataset.f]=t.value}};
 root.oninput=h;root.onchange=h;
}

/* ---------- produkty ---------- */
async function viewProducts(warn=''){
 ed=null;const m=$('#aMain');m.innerHTML=warn+'<p class="a-mut">Ładowanie…</p>';
 let list=[];try{list=(await DB.products(true)).sort((a,b)=>(a.order||0)-(b.order||0))}catch(e){m.innerHTML=warn+'<div class="a-warn">Nie udało się pobrać produktów: '+esc(errMsg(e))+'</div>';return}
 listCache=list;
 m.innerHTML=warn+`<div class="a-head"><h2>Produkty <small>(${list.length})</small></h2><button class="a-btn pri" data-act="newp">+ Dodaj produkt</button></div>`+
 (list.length?`<div class="a-list">${list.map((p,i)=>`<div class="a-row"><img src="${p.thumb||PH}" alt=""><div class="a-ri"><b>${esc(p.name)}</b><span>${esc(p.category||'bez kategorii')}${p.visible?'':' · <em>ukryty</em>'}</span></div><div class="a-ra"><button data-act="up" data-id="${p.id}" ${i?'':'disabled'}>↑</button><button data-act="dn" data-id="${p.id}" ${i<list.length-1?'':'disabled'}>↓</button><button data-act="vis" data-id="${p.id}">${p.visible?'Ukryj':'Pokaż'}</button><button data-act="edit" data-id="${p.id}">Edytuj</button><button class="del" data-act="del" data-id="${p.id}">Usuń</button></div></div>`).join('')}</div>`:`<div class="a-empty"><p>Nie ma jeszcze produktów, dlatego na stronie nie ma czego pokazać.</p><button class="a-btn pri" data-act="newp">+ Dodaj pierwszy produkt</button> <button class="a-btn" data-act="seed">Wczytaj gotowy katalog (${SEED.length} produktów)</button><div class="a-hint">Rodziny drzwi z klasami odporności. Wymiary, ceny i zdjęcia dopiszesz przy każdym produkcie.</div></div>`);
 const steps=[[!!S.phone,'Numer telefonu do zamówień','site'],[!!S.address,'Adres firmy (pokazuje mapę)','site'],[!!S.hours,'Godziny otwarcia','site'],[list.some(p=>p.visible),'Przynajmniej jeden widoczny produkt','prod'],[list.some(p=>p.thumb),'Zdjęcie przy produktach','prod'],[!!IMG.hero,'Zdjęcie w nagłówku strony','img'],[(S.gallery||[]).length>0,'Realizacje (zdjęcia dostaw)','gal']];
 if(steps.some(s=>!s[0]))m.insertAdjacentHTML('afterbegin',`<div class="a-card"><h3>Start: co jeszcze uzupełnić (${steps.filter(s=>s[0]).length}/${steps.length})</h3><ul class="a-ck">${steps.map(([ok,t,k])=>`<li class="${ok?'ok':'no'}">${ok?'✓':'!'} ${esc(t)}${ok||k==='prod'?'':` <button class="a-btn" style="padding:3px 10px;margin-left:8px" data-tab="${k}">Uzupełnij</button>`}</li>`).join('')}</ul></div>`);
}
const SPEC_PRESETS=['Odporność ogniowa','Dymoszczelność','Grubość skrzydła','Ościeżnica','Wypełnienie','Kolor','Zamek / zamknięcie','Certyfikat / atest','Waga'];
async function editProduct(id){
 const m=$('#aMain');m.innerHTML='<p class="a-mut">Ładowanie…</p>';busy(true);
 const cats=(S.categories||[]).map(c=>String(c).split('|')[0].trim());
 const base=id?structuredClone(listCache.find(p=>p.id===id)):{name:'',category:cats[0]||'',short:'',desc:'',price:'',badge:'',visible:true,order:(Math.max(0,...listCache.map(p=>p.order||0))+1),variants:[{name:'',leafW:'',leafH:'',mountW:'',mountH:'',price:''}],specs:[]};
 base.variants=base.variants||[];base.specs=base.specs||[];
 const photos=[];for(const pid of base.photoIds||[]){const src=await DB.photo(pid);if(src)photos.push({id:pid,src})}
 busy(false);ed={id:id||null,f:base,photos,removed:[]};drawEditor();
}
function drawEditor(){
 const f=ed.f,cats=(S.categories||[]).map(c=>String(c).split('|')[0].trim());if(f.category&&!cats.includes(f.category))cats.push(f.category);
 $('#aMain').innerHTML=`<div class="a-head"><h2>${ed.id?'Edycja produktu':'Nowy produkt'}</h2><button class="a-btn" data-act="back">← Wróć do listy</button></div>
 <div class="a-card" id="edBase"><h3>Podstawowe informacje</h3><div class="a-grid">
  ${FLD('Nazwa produktu *','name',f.name,{full:true})}
  <label>Kategoria<select data-k="category">${cats.map(c=>`<option ${c===f.category?'selected':''}>${esc(c)}</option>`).join('')}</select></label>
  ${FLD('Plakietka na zdjęciu (opcjonalnie)','badge',f.badge,{ph:'np. Nowość, Dostępne od ręki'})}
  ${FLD('Cena (opcjonalnie)','price',f.price,{ph:'np. od 1 890 zł netto. Puste = „zapytaj telefonicznie”'})}
  ${FLD('Kolejność na liście','order',f.order,{type:'number'})}
  ${FLD('Krótki opis (na karcie produktu)','short',f.short,{area:true,full:true})}
  ${FLD('Pełny opis (w oknie szczegółów i na stronie produktu)','desc',f.desc,{area:true,full:true,hint:'Dłuższy, konkretny opis (zastosowanie, konstrukcja, wyposażenie) pomaga w wyszukiwarce Google.'})}
  <label class="full"><input type="checkbox" data-k="visible" ${f.visible?'checked':''}> Widoczny na stronie</label></div></div>
 <div class="a-card"><h3>Zdjęcia</h3><div class="a-ph" id="edPh"></div><input type="file" id="edFile" accept="image/*" multiple><div class="a-hint">Pierwsze zdjęcie jest główne (widać je na karcie). Zdjęcia są automatycznie zmniejszane.</div></div>
 <div class="a-card"><h3>Wymiary (w mm)</h3><div id="edVar"></div><button class="a-btn" data-act="addvar">+ Dodaj wariant wymiarowy</button></div>
 <div class="a-card"><h3>Dodatkowe parametry</h3><div id="edSpec"></div><div class="a-chips">${SPEC_PRESETS.map(s=>`<button data-act="addspec" data-k="${esc(s)}">+ ${esc(s)}</button>`).join('')}</div><button class="a-btn" data-act="addspec" data-k="">+ Własny parametr</button></div>
 <div class="a-save"><button class="a-btn pri" data-act="savep">Zapisz produkt</button><button class="a-btn" data-act="back">Anuluj</button></div>`;
 bind($('#edBase'),f);drawPh();drawVar();drawSpec();
 $('#edFile').onchange=async e=>{busy(true);try{for(const file of e.target.files)ed.photos.push({id:null,src:await resize(file,1600,.8,650000)})}catch(x){toast('Nie udało się wczytać zdjęcia','err')}busy(false);e.target.value='';drawPh()};
}
function drawPh(){$('#edPh').innerHTML=ed.photos.map((p,i)=>`<div class="a-pi tall"><img src="${p.src}" alt="">${i===0?'<span class="tag">GŁÓWNE</span>':''}<div><button data-act="phl" data-i="${i}" ${i?'':'disabled'}>←</button><button data-act="phr" data-i="${i}" ${i<ed.photos.length-1?'':'disabled'}>→</button><button data-act="phx" data-i="${i}">✕</button></div></div>`).join('')||'<span class="a-mut">Brak zdjęć</span>'}
function drawVar(){const b=$('#edVar');b.innerHTML=ed.f.variants.map((v,i)=>`<div class="a-vr">${['name:Wariant (opc.)','leafW:Szer. skrzydła','leafH:Wys. skrzydła','mountW:Szer. montażowa','mountH:Wys. montażowa','price:Cena wariantu (opc.)'].map(s=>{const[k,l]=s.split(':');return`<label>${l}<input data-l="variants" data-i="${i}" data-f="${k}" value="${esc(v[k])}"></label>`}).join('')}<button class="a-x" data-act="delvar" data-i="${i}">✕</button></div>`).join('');bind(b,ed.f)}
function drawSpec(){const b=$('#edSpec');b.innerHTML=ed.f.specs.map((s,i)=>`<div class="a-sr"><label>Parametr<input data-l="specs" data-i="${i}" data-f="k" value="${esc(s.k)}"></label><label>Wartość<input data-l="specs" data-i="${i}" data-f="v" value="${esc(s.v)}"></label><button class="a-x" data-act="delspec" data-i="${i}">✕</button></div>`).join('');bind(b,ed.f)}
async function saveProduct(){
 const f=ed.f;if(!String(f.name).trim()){toast('Podaj nazwę produktu','err');return}
 busy(true);
 try{
  const ids=[];for(const p of ed.photos){if(!p.id)p.id=await DB.addPhoto(p.src);ids.push(p.id)}
  for(const id of ed.removed)await DB.delPhoto(id);ed.removed=[];
  const thumb=ed.photos[0]?await resize(ed.photos[0].src,600,.72,70000):'';
  const obj={name:f.name.trim(),category:f.category||'',short:f.short||'',desc:f.desc||'',price:f.price||'',badge:f.badge||'',visible:!!f.visible,order:+f.order||0,photoIds:ids,thumb,
   variants:f.variants.filter(v=>v.leafW||v.leafH||v.mountW||v.mountH||v.name||v.price),specs:f.specs.filter(s=>s.k&&s.v),updated:Date.now()};
  ed.id=await DB.saveProduct(ed.id,obj);toast('Zapisano ✓');tab='prod';showTab();
 }catch(e){console.error(e);toast('Błąd zapisu: '+errMsg(e),'err')}
 busy(false);
}

/* ---------- realizacje (galeria) ---------- */
async function viewGal(warn=''){
 const m=$('#aMain');m.innerHTML=warn+'<p class="a-mut">Ładowanie…</p>';busy(true);
 const items=[];for(const x of S.gallery||[]){const src=await DB.photo(x.id);if(src)items.push({id:x.id,cap:x.cap||'',src})}
 busy(false);gd={items,removed:[]};drawGal(warn);
}
function drawGal(warn=''){
 $('#aMain').innerHTML=warn+`<div class="a-head"><h2>Realizacje</h2></div><div class="a-card"><h3>Zdjęcia zrealizowanych dostaw i montaży</h3>
  <div class="a-ph" id="galPh">${gd.items.map((x,i)=>`<div class="a-pi"><img src="${x.src}" alt=""><input data-l="items" data-i="${i}" data-f="cap" value="${esc(x.cap)}" placeholder="Podpis (opcjonalnie)"><div><button data-act="gall" data-i="${i}" ${i?'':'disabled'}>←</button><button data-act="galr" data-i="${i}" ${i<gd.items.length-1?'':'disabled'}>→</button><button data-act="galx" data-i="${i}">✕</button></div></div>`).join('')||'<span class="a-mut">Brak zdjęć. Sekcja „Realizacje” pojawi się na stronie, gdy dodasz pierwsze.</span>'}</div>
  <input type="file" id="galFile" accept="image/*" multiple><div class="a-hint">Zdjęcia są automatycznie zmniejszane. Nie dodawaj zdjęć, na których widać osoby bez ich zgody.</div></div>
  <div class="a-save"><button class="a-btn pri" data-act="savegal">Zapisz realizacje</button></div>`;
 bind($('#galPh'),gd);
 $('#galFile').onchange=async e=>{busy(true);try{for(const f of e.target.files)gd.items.push({id:null,cap:'',src:await resize(f,1400,.78,320000)})}catch{toast('Nie udało się wczytać zdjęcia','err')}busy(false);drawGal(warn)};
}
async function saveGal(){
 busy(true);
 try{
  for(const x of gd.items)if(!x.id)x.id=await DB.addPhoto(x.src);
  for(const id of gd.removed)await DB.delPhoto(id);gd.removed=[];
  await saveSettings({gallery:gd.items.map(({id,cap})=>({id,cap}))});toast('Zapisano ✓');
 }catch(e){console.error(e);toast('Błąd zapisu: '+errMsg(e),'err')}
 busy(false);
}

/* ---------- opinie i baner ---------- */
function viewRev(warn=''){
 draft={notice:S.notice||'',reviews:structuredClone(S.reviews||[])};
 $('#aMain').innerHTML=warn+`<div class="a-head"><h2>Opinie i baner</h2></div><div id="revForm">
  <div class="a-card"><h3>Baner informacyjny</h3><div class="a-grid">${FLD('Tekst paska nad stroną (puste = brak paska)','notice',draft.notice,{full:true,ph:'np. Do 15 grudnia zamówienia przyjmujemy do 14:00'})}</div></div>
  <div class="a-card"><h3>Opinie klientów</h3><div id="revList"></div><button class="a-btn" data-act="addrev">+ Dodaj opinię</button><div class="a-hint">Dodawaj wyłącznie prawdziwe opinie, najlepiej za zgodą klienta. Sekcja pojawi się na stronie, gdy będzie choć jedna.</div></div></div>
 <div class="a-save"><button class="a-btn pri" data-act="saverev">Zapisz</button></div>`;
 bind($('#revForm'),draft);drawRev();
}
function drawRev(){const b=$('#revList');b.innerHTML=draft.reviews.map((r,i)=>`<div class="a-rv"><label>Opinia<textarea data-l="reviews" data-i="${i}" data-f="t">${esc(r.t)}</textarea></label><label>Autor<input data-l="reviews" data-i="${i}" data-f="a" value="${esc(r.a)}"></label><label>Firma / stanowisko<input data-l="reviews" data-i="${i}" data-f="f" value="${esc(r.f)}"></label><button class="a-x" data-act="delrev" data-i="${i}">✕</button></div>`).join('')}

/* ---------- dane i teksty ---------- */
function viewSite(warn=''){
 draft=structuredClone({...DEF,...S});const d=draft;
 const pairs=(key,title)=>`<div class="a-card"><h3>${title}</h3><div id="pl-${key}"></div><button class="a-btn" data-act="addpair" data-key="${key}">+ Dodaj</button><div class="a-hint">Możesz użyć znaczników: {lat} (liczba lat na rynku), {old} (dawna nazwa), {brand} (nazwa firmy).</div></div>`;
 $('#aMain').innerHTML=warn+`<div class="a-head"><h2>Dane i teksty</h2></div><div id="siteForm">
 <div class="a-card"><h3>Dane firmy i kontakt</h3><div class="a-grid">
  ${FLD('Nazwa firmy','brand',d.brand)}${FLD('Dawna nazwa (np. AGART)','oldName',d.oldName,{hint:'Zostaw puste, jeśli nie chcesz jej pokazywać.'})}
  ${FLD('Rok rozpoczęcia sprzedaży drzwi','since',d.since,{type:'number',hint:'Z tego liczone jest „od X lat” (rośnie samo co roku).'})}${FLD('Telefon główny (do zamówień)','phone',d.phone,{ph:'+48 000 000 000'})}
  ${FLD('Telefon dodatkowy','phone2',d.phone2)}${FLD('E-mail','email',d.email)}
  ${FLD('Adres (przycisk „Pokaż mapę”)','address',d.address,{full:true,hint:'Puste = bez mapy.'})}${FLD('Godziny otwarcia (każdy dzień w nowej linii)','hours',d.hours,{area:true,hint:'Np. „Pon–Pt: 8:00–16:00” i w drugiej linii „Sob: 9:00–13:00”.'})}${FLD('Stopka: NIP / dane firmy','nip',d.nip)}</div></div>
 <div class="a-card"><h3>Strona główna</h3><div class="a-grid">${FLD('Nagłówek','heroTitle',d.heroTitle,{full:true})}${FLD('Opis pod nagłówkiem','heroSub',d.heroSub,{area:true,full:true})}</div></div>
 <div class="a-card"><h3>O firmie</h3><div class="a-grid">${FLD('Tytuł','aboutTitle',d.aboutTitle,{full:true})}${FLD('Tekst (akapity oddziel pustą linią)','aboutText',d.aboutText,{area:true,full:true})}</div></div>
 <div class="a-card"><h3>Kategorie drzwi</h3><div class="a-grid">${FLD('Jedna kategoria w wierszu: Nazwa | krótki opis','categories',d.categories.join('\n'),{area:true,lines:true,full:true,hint:'Opis po kresce | trafia na stronę kategorii (ważne dla Google). Zmiana nazwy kategorii wymaga poprawienia jej w produktach.'})}</div></div>
 ${pairs('stats','Pasek z liczbami')}${pairs('feats','Dlaczego my (karty)')}${pairs('steps','Jak zamówić (kroki)')}</div>
 <div class="a-save"><button class="a-btn pri" data-act="savesite">Zapisz zmiany</button></div>`;
 bind($('#siteForm'),d);['stats','feats','steps'].forEach(drawPairs);
}
function drawPairs(k){const b=$('#pl-'+k);if(!b)return;b.innerHTML=draft[k].map((r,i)=>`<div class="a-sr"><label>${k==='stats'?'Liczba / hasło':'Tytuł'}<input data-l="${k}" data-i="${i}" data-f="a" value="${esc(r.a)}"></label><label>${k==='stats'?'Opis':'Tekst'}<input data-l="${k}" data-i="${i}" data-f="b" value="${esc(r.b)}"></label><button class="a-x" data-act="delpair" data-key="${k}" data-i="${i}">✕</button></div>`).join('')}

/* ---------- zdjęcia strony ---------- */
function viewImages(warn=''){
 const box=(k,t,h)=>`<div class="a-card"><h3>${t}</h3>${IMG[k]?`<img src="${IMG[k]}" style="max-width:340px;border-radius:3px;margin-bottom:12px" alt="">`:'<p class="a-mut" style="margin-bottom:12px">Brak zdjęcia (używana jest grafika domyślna).</p>'}<input type="file" accept="image/*" data-up="${k}"> ${IMG[k]?`<button class="a-btn dng" data-act="rmimg" data-k="${k}">Usuń zdjęcie</button>`:''}<div class="a-hint">${h}</div></div>`;
 $('#aMain').innerHTML=warn+`<div class="a-head"><h2>Zdjęcia strony</h2></div>${box('hero','Zdjęcie w tle nagłówka (hero)','Najlepiej poziome, np. hala, magazyn lub drzwi w obiekcie. Zostanie przyciemnione, żeby tekst był czytelny.')}${box('about','Zdjęcie w sekcji „O firmie”','Najlepiej pionowe lub kwadratowe, np. zespół, siedziba lub realizacja.')}`;
 $$('[data-up]').forEach(i=>i.onchange=async e=>{const k=i.dataset.up,f=e.target.files[0];if(!f)return;busy(true);try{const d=await resize(f,k==='hero'?1920:1000,.74,k==='hero'?480000:220000);await DB.saveImages({[k]:d});IMG[k]=d;toast('Zapisano ✓');viewImages(warn)}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)});
}

/* ---------- statystyki ---------- */
async function viewStats(warn=''){
 const m=$('#aMain');m.innerHTML=warn+'<p class="a-mut">Ładowanie…</p>';
 let days=[],ps=[],prods=[];
 try{[days,ps,prods]=await Promise.all([DB.stats(),DB.prodStats(),DB.products(true)])}catch(e){m.innerHTML=warn+'<div class="a-warn">Nie udało się pobrać statystyk: '+esc(errMsg(e))+'<br>Sprawdź, czy w Firestore są opublikowane najnowsze reguły (z sekcją stats).</div>';return}
 const by={};days.forEach(d=>by[d.id]=d);
 const list=[];for(let i=29;i>=0;i--){const d=new Date(Date.now()-i*864e5).toISOString().slice(0,10);list.push({id:d,views:0,calls:0,mails:0,...(by[d]||{})})}
 const sum=k=>list.reduce((a,d)=>a+(d[k]||0),0),max=Math.max(1,...list.map(d=>d.views||0));
 const names={};prods.forEach(p=>names[p.id]=p.name);
 const top=ps.filter(p=>names[p.id]).sort((a,b)=>(b.views||0)-(a.views||0)).slice(0,10);
 m.innerHTML=warn+`<div class="a-head"><h2>Statystyki <small>(ostatnie 30 dni)</small></h2></div>
 <div class="a-kpi"><div><b>${sum('views')}</b><span>odwiedzin strony</span></div><div><b>${sum('calls')}</b><span>kliknięć „Zadzwoń”</span></div><div><b>${sum('mails')}</b><span>kliknięć e-mail</span></div></div>
 <div class="a-card"><h3>Odwiedziny dzień po dniu</h3><div class="a-bars">${list.map(d=>`<i style="height:${Math.round((d.views||0)/max*100)}%" title="${d.id}: ${d.views||0} odwiedzin, ${d.calls||0} kliknięć Zadzwoń"></i>`).join('')}</div><div class="a-hint">Liczone anonimowo, bez cookies. Twoje własne wizyty po zalogowaniu nie są liczone. Dni według czasu UTC.</div></div>
 <div class="a-card"><h3>Najczęściej oglądane produkty</h3>${top.length?`<table class="a-tbl"><tr><th>Produkt</th><th>Wyświetlenia</th><th>Kliknięcia „Zadzwoń”</th></tr>${top.map(p=>`<tr><td>${esc(names[p.id])}</td><td>${p.views||0}</td><td>${p.calls||0}</td></tr>`).join('')}</table>`:'<p class="a-mut">Jeszcze brak danych.</p>'}</div>`;
}

/* ---------- narzędzia i SEO ---------- */
async function viewTools(warn=''){
 const m=$('#aMain');m.innerHTML=warn+'<p class="a-mut">Ładowanie…</p>';
 let prods=[];try{prods=await DB.products(true)}catch{}
 const vis=prods.filter(p=>p.visible);
 const ck=[
  [!!S.phone,'Numer telefonu ustawiony','Dodaj telefon w zakładce „Dane i teksty”','site'],
  [!!S.address,'Adres ustawiony (mapa i dane lokalne)','Dodaj adres w „Dane i teksty”','site'],
  [!!S.email,'E-mail ustawiony','Dodaj e-mail w „Dane i teksty”','site'],
  [!SITE_URL.includes('github.io'),'Własna domena ustawiona ('+SITE_URL+')','Adres jest tymczasowy. Po zakupie domeny uruchom narzedzia/ustaw-domene.py'],
  [!!IMG.hero,'Zdjęcie w nagłówku dodane','Dodaj w zakładce „Zdjęcia strony”','img'],
  [vis.length>0,'Są widoczne produkty ('+vis.length+')','Dodaj pierwszy produkt lub wczytaj gotowy katalog','seed'],
  [vis.length>0&&vis.every(p=>p.thumb),'Każdy produkt ma zdjęcie','Dodaj zdjęcia do produktów bez zdjęcia','prod'],
  [vis.length>0&&vis.every(p=>(p.desc||'').length>=80),'Każdy produkt ma opis (min. 80 znaków)','Rozbuduj opisy produktów, to pomaga w Google','prod'],
  [(S.gallery||[]).length>0,'Dodane realizacje (zdjęcia dostaw)','Dodaj kilka zdjęć w zakładce „Realizacje”','gal']
 ];
 m.innerHTML=warn+`<div class="a-head"><h2>Narzędzia i SEO</h2></div>
 <div class="a-card"><h3>Lista kontrolna widoczności w Google</h3><ul class="a-ck">${ck.map(([ok,t,h,go])=>`<li class="${ok?'ok':'no'}">${ok?'✓':'!'} ${esc(t)}${ok?'':`<div class="a-hint">${esc(h)}</div>`+(go==='seed'?`<button class="a-btn pri" style="margin-top:8px" data-act="seed">Wczytaj gotowy katalog (${SEED.length} produktów)</button>`:go?`<button class="a-btn" style="margin-top:8px" data-tab="${go}">Przejdź i uzupełnij</button>`:'')}</li>`).join('')}</ul></div>
 <div class="a-card"><h3>Strony kategorii i produktów (SEO)</h3><p class="a-mut" style="margin-bottom:12px">Pobierz plik oferta.json, wrzuć go do folderu <b>narzedzia</b> w repozytorium i uruchom <code>python narzedzia/gen-strony.py</code>. Skrypt wygeneruje osobne strony kategorii i produktów, sitemap.xml, llms.txt i api/produkty.json. Powtórz po każdej większej zmianie oferty.</p><button class="a-btn pri" data-act="exportoffer">Pobierz oferta.json</button></div>
 <div class="a-card" id="admCard"><h3>Administratorzy</h3><p class="a-mut" id="admList">Ładowanie…</p><div class="a-grid" style="margin-top:12px"><label>Dodaj administratora (adres Gmail)<input id="admNew" placeholder="imie.nazwisko@gmail.com"></label></div><div class="a-save" style="margin-top:10px"><button class="a-btn pri" data-act="addadm">Dodaj administratora</button></div><div class="a-hint">Taka osoba zaloguje się przyciskiem „Zaloguj” na stronie i będzie mogła edytować wszystko, tak jak Ty.</div></div>
 <div class="a-card"><h3>Kopia zapasowa</h3><p class="a-mut" style="margin-bottom:12px">Plik JSON z danymi firmy, produktami i zdjęciami. Warto robić go co jakiś czas.</p><button class="a-btn" data-act="export">Pobierz kopię</button>
 <p class="a-mut" style="margin:18px 0 8px">Przywróć z kopii (zastąpi obecne dane firmy, produkty o tych samych ID zostaną nadpisane):</p><input type="file" accept="application/json" id="impFile"></div>`;
 drawAdmins();
 $('#impFile').onchange=async e=>{const f=e.target.files[0];if(!f||!confirm('Przywrócić dane z kopii? Obecne ustawienia zostaną zastąpione.'))return;busy(true);try{await DB.importAll(JSON.parse(await f.text()));toast('Przywrócono ✓');reload&&await reload()}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)};
}
async function drawAdmins(){
 const b=$('#admList');if(!b)return;
 try{const l=await DB.admins();b.innerHTML=l.map(a=>`<span style="display:inline-flex;gap:8px;align-items:center;margin:0 10px 8px 0;padding:6px 12px;border:1px solid var(--line,#ddd);border-radius:20px"><b>${esc(a.id)}</b>${user&&a.id===String(user.email).toLowerCase()?'<em>(Ty)</em>':`<button class="a-x" data-act="deladm" data-id="${esc(a.id)}" title="Usuń">✕</button>`}</span>`).join('')||'Brak.'}
 catch(e){b.textContent='Nie udało się pobrać listy: '+errMsg(e)+'. Upewnij się, że opublikowałeś najnowsze reguły Firestore.'}
}
function download(name,obj){const b=new Blob([JSON.stringify(obj,null,1)],{type:'application/json'});const l=document.createElement('a');l.href=URL.createObjectURL(b);l.download=name;l.click()}

/* ---------- obsługa kliknięć ---------- */
async function onClick(e){
 const t=e.target.closest('[data-act],[data-tab]');if(!t)return;
 if(t.dataset.tab){tab=t.dataset.tab;showTab();return}
 const a=t.dataset.act,id=t.dataset.id,i=+t.dataset.i;
 if(a==='close'){e.preventDefault();closeAdmin()}
 else if(a==='login'){try{await A.au.signInWithPopup(A.auth,new A.au.GoogleAuthProvider())}catch(x){toast('Logowanie nie powiodło się: '+(x.code||x.message),'err')}}
 else if(a==='logout'){try{localStorage.removeItem('rt_admin')}catch{}await A.au.signOut(A.auth)}
 else if(a==='newp')editProduct(null);else if(a==='edit')editProduct(id);else if(a==='back'){tab='prod';showTab()}
 else if(a==='vis'){const p=listCache.find(x=>x.id===id);try{await DB.patch(id,{visible:!p.visible});viewProducts()}catch(x){toast('Błąd zapisu: '+errMsg(x),'err')}}
 else if(a==='up'||a==='dn'){const l=listCache,k=l.findIndex(x=>x.id===id),j=a==='up'?k-1:k+1;if(j<0||j>=l.length)return;[l[k],l[j]]=[l[j],l[k]];busy(true);try{for(let n=0;n<l.length;n++)if(l[n].order!==n+1)await DB.patch(l[n].id,{order:n+1});await viewProducts()}catch(x){toast('Błąd zapisu: '+errMsg(x),'err')}busy(false)}
 else if(a==='del'){const p=listCache.find(x=>x.id===id);if(!confirm(`Usunąć produkt „${p.name}” wraz ze zdjęciami? Tego nie da się cofnąć.`))return;busy(true);try{for(const pid of p.photoIds||[])await DB.delPhoto(pid);await DB.delProduct(id);toast('Usunięto');await viewProducts()}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
 else if(a==='phl'||a==='phr'){const j=a==='phl'?i-1:i+1;[ed.photos[i],ed.photos[j]]=[ed.photos[j],ed.photos[i]];drawPh()}
 else if(a==='phx'){const[p]=ed.photos.splice(i,1);if(p.id)ed.removed.push(p.id);drawPh()}
 else if(a==='addvar'){ed.f.variants.push({name:'',leafW:'',leafH:'',mountW:'',mountH:'',price:''});drawVar()}
 else if(a==='delvar'){ed.f.variants.splice(i,1);drawVar()}
 else if(a==='addspec'){ed.f.specs.push({k:t.dataset.k||'',v:''});drawSpec()}
 else if(a==='delspec'){ed.f.specs.splice(i,1);drawSpec()}
 else if(a==='savep')saveProduct();
 else if(a==='gall'||a==='galr'){const j=a==='gall'?i-1:i+1;[gd.items[i],gd.items[j]]=[gd.items[j],gd.items[i]];drawGal()}
 else if(a==='galx'){const[x]=gd.items.splice(i,1);if(x.id)gd.removed.push(x.id);drawGal()}
 else if(a==='savegal')saveGal();
 else if(a==='addrev'){draft.reviews.push({t:'',a:'',f:''});drawRev()}
 else if(a==='delrev'){draft.reviews.splice(i,1);drawRev()}
 else if(a==='saverev'){busy(true);try{await saveSettings({notice:draft.notice,reviews:draft.reviews.filter(r=>r.t)});toast('Zapisano ✓')}catch(x){toast('Błąd zapisu: '+errMsg(x),'err')}busy(false)}
 else if(a==='addpair'){draft[t.dataset.key].push({a:'',b:''});drawPairs(t.dataset.key)}
 else if(a==='delpair'){draft[t.dataset.key].splice(i,1);drawPairs(t.dataset.key)}
 else if(a==='savesite'){busy(true);try{const o={...draft};if(!o.since)o.since=DEF.since;await saveSettings(o);toast('Zapisano ✓')}catch(x){toast('Błąd zapisu: '+errMsg(x),'err')}busy(false)}
 else if(a==='rmimg'){busy(true);try{await DB.saveImages({[t.dataset.k]:''});IMG[t.dataset.k]='';toast('Usunięto');viewImages()}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
 else if(a==='exportoffer'){busy(true);try{const d=await DB.exportAll();download('oferta.json',{wygenerowano:new Date().toISOString(),main:{...DEF,...d.main},products:d.products.filter(p=>p.visible).map(({photoIds,...p})=>p)})}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
 else if(a==='seed'){busy(true);try{let n=0;for(const x of SEED){const{id,...r}=x;await DB.saveProduct(null,r);n++}toast('Dodano produkty: '+n+' ✓');tab='prod';await showTab()}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
 else if(a==='addadm'){const em=($('#admNew').value||'').trim().toLowerCase();if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em)){toast('Wpisz poprawny adres e-mail','err');return}busy(true);try{await DB.addAdmin(em,user&&user.email);$('#admNew').value='';toast('Dodano administratora ✓');drawAdmins()}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
 else if(a==='deladm'){if(!confirm('Odebrać uprawnienia: '+id+'?'))return;busy(true);try{await DB.delAdmin(id);toast('Usunięto');drawAdmins()}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
 else if(a==='export'){busy(true);try{download(`radtom-kopia-${new Date().toISOString().slice(0,10)}.json`,await DB.exportAll())}catch(x){toast('Błąd: '+errMsg(x),'err')}busy(false)}
}
