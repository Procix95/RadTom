/* RadTom: wspólny kod strony i panelu (dane, Firebase, narzędzia). */
import {FIREBASE_CONFIG,SITE_URL} from './config.js?v=11141720';
export {SITE_URL};
export const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const YEAR=new Date().getFullYear();
export const tel=p=>'tel:'+String(p).replace(/[^\d+]/g,'');
export const DEMO=!FIREBASE_CONFIG.apiKey;

export const DEF={
 brand:'RadTom',oldName:'AGART',since:2006,
 phone:'',phone2:'',email:'radtom72@gmail.com',address:'Głuponie 103, 64-316 Kuślin',ownerName:'Tomasz Jaskuła',ownerNote:'Drzwi przeciwpożarowe sprzedajemy od 20 lat. Wiem, że wybór drzwi do konkretnego otworu bywa kłopotliwy, i dlatego zamiast gotowych formułek wolę po prostu porozmawiać.\n\nPowiedz, gdzie drzwi mają być zamontowane i jaki masz otwór, a pomogę dobrać klasę odporności oraz wymiar. Zadzwoń albo zostaw numer, oddzwonię.',promo:'Dobierzemy drzwi do Twojego otworu: zadzwoń albo policz wymiary online.',mapQuery:'RadTom mieszalnia farb samochodowych, Głuponie, 64-316 Kuślin',hours:'Poniedziałek – piątek, 8:00 – 16:00',nip:'',credit:'Strona wykonana przez Radosław Jaskuła (Procix94)',smsPhone:'509516264',webhook:'',gmbUrl:'',reviewUrl:'',notice:'',
 heroTitle:'Drzwi przeciwpożarowe od ludzi, którzy sprzedają je od {lat} lat',
 heroSub:'Drzwi o odporności ogniowej EI30, EI60 i EI120 do zakładów, magazynów, biur i obiektów użyteczności publicznej. Doradzimy, dobierzemy do wymiarów otworu i przyjmiemy zamówienie jednym telefonem.',
 aboutTitle:'Zmieniła się nazwa. Doświadczenie zostało.',
 aboutText:'Drzwi przeciwpożarowe sprzedajemy od {lat} lat. Przez ten czas działaliśmy pod nazwą {old}. Dziś firma działa jako {brand}, ale tworzą ją ci sami ludzie, z tą samą wiedzą i tym samym podejściem: dobrze dobrane drzwi, rzetelna informacja o parametrach i uczciwa rozmowa z klientem.\n\nWiemy, na co zwrócić uwagę przy wyborze drzwi do konkretnego otworu i konkretnego zastosowania, i chętnie dzielimy się tą wiedzą.',
 categories:["Wewnętrzne przeciwpożarowe | Drzwi przeciwpożarowe wewnętrzne, także do komórek lokatorskich, w klasach odporności ogniowej EI30 i EI60. Jedno- i dwuskrzydłowe.","Dymoszczelne | Drzwi kierunkowe dymoszczelne w klasach S30 i S60, do dróg ewakuacyjnych i stref wymagających ochrony przed dymem.","Akustyczne | Drzwi przeciwpożarowe o podwyższonych właściwościach akustycznych: EI60 do komórek lokatorskich i EI2 60 do wnętrz, z izolacyjnością 30 dB.","Dwuskrzydłowe | Drzwi dwuskrzydłowe do szerokich otworów: przeciwpożarowe EI30, EI60, EI120 i dymoszczelne S60, z regulatorem kolejności zamykania skrzydeł.","Zewnętrzne | Drzwi zewnętrzne kierunkowe: bez odporności ogniowej oraz przeciwpożarowe EI60 i EI120. Jedno- i dwuskrzydłowe.","Antywłamaniowe | Drzwi w klasach odporności na włamanie RC2 i RC3, z ryglowaniem bolcami i izolacją termiczną i akustyczną.","Akcesoria | Wyposażenie dodatkowe do drzwi: klamki, uszczelki, samozamykacze, dźwignie antypaniczne, zamki i regulatory kolejności zamykania."],
 stats:[{a:'{lat}',b:'lat na rynku drzwi przeciwpożarowych'},{a:'EI30–EI120',b:'klasy odporności ogniowej w ofercie'},{a:'RC2–RC3',b:'drzwi antywłamaniowe'},{a:'1 telefon',b:'i zamówienie przyjęte'}],
 feats:[{a:'Doświadczenie, które widać',b:'Ponad dwie dekady w branży to setki dobranych drzwi i znajomość problemów, które pojawiają się dopiero na budowie.'},{a:'Dopasowanie do otworu',b:'Przy każdym modelu podajemy wymiary skrzydła i montażowe, więc od razu wiesz, czy drzwi pasują.'},{a:'Zamówienie przez telefon',b:'Bez formularzy i czekania. Dzwonisz, ustalamy szczegóły i przyjmujemy zamówienie.'}],
 steps:[{a:'Zadzwoń lub napisz',b:'Opisz, gdzie drzwi mają być zamontowane i jakie mają spełniać wymagania.'},{a:'Dobieramy drzwi',b:'Proponujemy model pasujący do wymagań i wymiarów otworu.'},{a:'Potwierdzamy szczegóły',b:'Uzgadniamy wymiary, wykonanie, kolor i warunki zamówienia.'},{a:'Realizujemy zamówienie',b:'Przyjmujemy zamówienie i informujemy o terminie realizacji.'}],
 classes:[{a:'EI',b:'Szczelność i izolacyjność ogniowa. Drzwi przez określony czas nie przepuszczają ognia i gorących gazów (E) oraz ograniczają nagrzewanie się strony odległej od ognia (I).'},{a:'30 · 60 · 120',b:'Liczba po symbolu to czas w minutach, przez który drzwi zachowują deklarowane właściwości w badaniu ogniowym. EI60 oznacza 60 minut.'},{a:'S',b:'Dymoszczelność. Drzwi ograniczają przenikanie dymu, co jest ważne na drogach ewakuacyjnych i w strefach, które mają być chronione przed zadymieniem.'},{a:'RC2 · RC3',b:'Klasy odporności na włamanie. Im wyższa liczba, tym trudniej sforsować drzwi w próbie włamania.'},{a:'Kierunkowe',b:'Drzwi kierunkowe zostały przebadane przy pożarze z określonej strony. Przy zamawianiu ważne jest, z której strony mają być zamontowane.'}],
 guides:[{"a":"Jak zmierzyć otwór pod drzwi","b":"Zmierz szerokość i wysokość otworu w kilku miejscach (u góry, w środku i na dole) i weź najmniejszą wartość. Podaj wymiary w milimetrach, stronę otwierania (lewe lub prawe) i grubość ściany. Przy wątpliwościach zadzwoń, pomożemy ustalić wymiar montażowy."},{"a":"EI30, EI60 czy EI120: którą klasę wybrać","b":"Wymaganą klasę odporności ogniowej określa projekt budynku i przepisy przeciwpożarowe, zwykle ustala ją projektant lub rzeczoznawca do spraw ochrony przeciwpożarowej. Jeśli masz tę informację, podaj ją przy zamówieniu, a dobierzemy odpowiedni model."},{"a":"Drzwi kierunkowe: z której strony montować","b":"Drzwi kierunkowe zostały przebadane przy pożarze z określonej strony. Przy zamawianiu podaj, z której strony pomieszczenia mają być zamontowane, żeby dobrać właściwe wykonanie."},{"a":"Samozamykacz i wyposażenie drzwi","b":"Drzwi przeciwpożarowe powinny się domykać po każdym przejściu, dlatego zwykle wyposaża się je w samozamykacz. W drzwiach dwuskrzydłowych potrzebny jest też regulator kolejności zamykania skrzydeł, a na drogach ewakuacyjnych stosuje się dźwignie antypaniczne. Konkretne wymagania wynikają z projektu."}],
 faq:[{a:'Jak zamówić drzwi?',b:'Zadzwoń lub napisz. Ustalimy model, wymiary i wykonanie, a zamówienie przyjmiemy telefonicznie, bez formularzy.'},{a:'Jakie wymiary mam podać?',b:'Szerokość i wysokość otworu oraz stronę otwierania. Resztę dobierzemy, a przy każdym modelu podajemy wymiary skrzydła i wymiary montażowe.'},{a:'Co to jest {old}?',b:'Pod nazwą {old} sprzedajemy drzwi od {lat} lat. Dziś ta sama firma działa jako {brand}, z tym samym doświadczeniem.'},{a:'Jakie dokumenty mają drzwi?',b:'Zapytaj o dokumenty dla wybranego modelu przy składaniu zamówienia.'},{a:'Jak długo czeka się na realizację?',b:'Termin zależy od modelu i wykonania. Podajemy go przy przyjmowaniu zamówienia.'}],
 mountTitle:'Montaż drzwi',mountText:'',mountPoints:[],docs:[],
 reviews:[],gallery:[]
};
export const S={...DEF};
export const IMG={hero:'',about:''};
export const ST={P:[]};
export const catName=c=>String(c).split('|')[0].trim();
export const catDesc=c=>String(c).split('|').slice(1).join('|').trim();
export const tok=s=>String(s??'').replace(/\{lat\}/g,YEAR-(+S.since||YEAR)).replace(/\{old\}/g,S.oldName||'').replace(/\{brand\}/g,S.brand||'');
export const call=(cls,txt)=>S.phone?`<a class="btn ${cls}" href="${tel(S.phone)}" data-call>${txt||'Zadzwoń: '+esc(S.phone)}</a>`:'';
export const PH='data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1b2f4f"/><stop offset="1" stop-color="#0c1829"/></linearGradient></defs><rect width="400" height="460" fill="url(#g)"/><rect x="128" y="60" width="144" height="340" fill="#12213a" stroke="#d4b176" stroke-width="3"/><rect x="146" y="82" width="108" height="140" fill="none" stroke="#d4b176" stroke-opacity=".5"/><rect x="146" y="240" width="108" height="140" fill="none" stroke="#d4b176" stroke-opacity=".5"/><circle cx="250" cy="232" r="6" fill="#d4b176"/></svg>`);
// Ilustracje poglądowe produktów (gdy brak zdjęcia): rysunek zależy od rodzaju drzwi i klasy.
const _artC={};
export const artFor=p=>{
 const k=(p.id||'')+'|'+(p.name||'');if(_artC[k])return _artC[k];
 const sp=(p.specs||[]).map(x=>x.v||'').join(' ');
 const t=((p.name||'')+' '+(p.category||'')+' '+sp).toLowerCase();
 const fire=(((p.name||'')+' '+sp).match(/EI2?\s?(30|60|120)/i)||[])[0]||'';
 const fl=fire?fire.toUpperCase().replace(/^EI(30|60|120)$/,'EI$1').replace(/\s+/g,' '):'';
 const sm=(((p.name||'')).match(/\bS\s?(30|60)\b/)||[])[0]||'';
 const rc=(((p.name||'')).match(/RC\s?[23]/i)||[])[0]||'';
 const label=(fl||sm||rc.toUpperCase());
 const B='#d4b176',N='#12213a';
 let g='';
 const acc=/akcesor/.test(t);
 if(acc){
  if(/klamk/.test(t)) g=`<g fill="none" stroke="${B}" stroke-width="3"><circle cx="150" cy="230" r="46" fill="${N}"/><circle cx="150" cy="230" r="30" stroke-opacity=".5" stroke-width="1.5"/><path d="M150 230h150a14 14 0 0 1 0 28h-60" stroke-linecap="round"/><circle cx="150" cy="230" r="7" fill="${B}" stroke="none"/></g>`;
  else if(/uszczelk/.test(t)) g=`<g fill="none" stroke="${B}" stroke-width="3" stroke-linecap="round"><rect x="90" y="150" width="220" height="150" rx="6" stroke-opacity=".35" stroke-dasharray="2 8"/><path d="M110 225c0-26 30-26 30 0s30 26 30 0 30-26 30 0 30 26 30 0 30-26 30 0" /><path d="M110 245h180" stroke-opacity=".5" stroke-width="1.5"/></g>`;
  else g=`<g fill="none" stroke="${B}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><rect x="96" y="150" width="208" height="38" rx="5" fill="${N}"/><path d="M140 188l70 56 52-24" /><circle cx="140" cy="188" r="7" fill="${B}" stroke="none"/><circle cx="210" cy="244" r="7" fill="${N}"/><rect x="250" y="206" width="40" height="30" rx="4" stroke-opacity=".5"/></g>`;
 }else{
  const dbl=(p.specs||[]).some(z=>/skrzyd/i.test(z.k||'')&&/^dwu/i.test(z.v||''))||/dwuskrzydłowe/i.test(p.name||'')&&!/jedno/i.test(p.name||'');
  const y=82,h=300,x=dbl?80:120,w=dbl?240:160;
  const wood=/drewnopodob/.test(t),ext=/zewn/.test(t),ak=/akust/.test(t);
  let leaf=`<rect x="${x-10}" y="${y-8}" width="${w+20}" height="${h+8}" fill="none" stroke="${B}" stroke-opacity="${ext?.7:.35}" stroke-width="${ext?5:2}"/>`;
  const L=dbl?[[x,w/2-2,'r'],[x+w/2+2,w/2-2,'l']]:[[x,w,'r']];
  L.forEach(([lx,lw,hs],i)=>{
   leaf+=`<rect x="${lx}" y="${y}" width="${lw}" height="${h}" fill="${N}" stroke="${B}" stroke-width="2.5"/>`;
   if(wood){const n=dbl?5:9;for(let j=1;j<n;j++)leaf+=`<path d="M${lx+j*lw/n} ${y+8}v${h-16}" stroke="${B}" stroke-opacity="${j%2?.28:.14}"/>`}
   else if(ext){leaf+=`<path d="M${lx+14} ${y+h*.5}h${lw-28}M${lx+14} ${y+h*.5+8}h${lw-28}" stroke="${B}" stroke-opacity=".3"/><rect x="${lx+16}" y="${y+16}" width="${lw-32}" height="${h*.34}" fill="none" stroke="${B}" stroke-opacity=".4"/><rect x="${lx+16}" y="${y+h*.58}" width="${lw-32}" height="${h*.34}" fill="none" stroke="${B}" stroke-opacity=".4"/>`}
   else{leaf+=`<rect x="${lx+16}" y="${y+18}" width="${lw-32}" height="${h*.4}" fill="none" stroke="${B}" stroke-opacity=".45"/><rect x="${lx+16}" y="${y+h*.5}" width="${lw-32}" height="${h*.42}" fill="none" stroke="${B}" stroke-opacity=".45"/>`}
   if(sm)leaf+=`<rect x="${lx+6}" y="${y+6}" width="${lw-12}" height="${h-12}" fill="none" stroke="${B}" stroke-opacity=".5" stroke-dasharray="3 5"/>`;
   const hx=hs==='r'?lx-5:lx+lw-3;
   [.14,.5,.86].forEach(f=>leaf+=`<rect x="${hx}" y="${y+h*f-12}" width="8" height="24" rx="2" fill="${B}"/>`);
   const hy=y+h*.52;
   if(!dbl||true){const cx=dbl?(i?lx+16:lx+lw-16):lx+lw-16,d=dbl?(i?1:-1):-1;leaf+=`<g fill="${B}"><rect x="${d<0?cx-30:cx}" y="${hy-4}" width="30" height="8" rx="4"/><circle cx="${cx}" cy="${hy}" r="8"/></g>`}
   if(rc&&(!dbl||i))[.3,.5,.7].forEach(f=>leaf+=`<circle cx="${lx+lw-4}" cy="${y+h*f}" r="4" fill="${B}"/>`);
  });
  if(label){const lw=Math.max(76,label.length*26),cx=x+w/2;leaf+=`<rect x="${cx-lw/2}" y="${y+h*.2-26}" width="${lw}" height="52" rx="4" fill="${N}" stroke="${B}"/><text x="${cx}" y="${y+h*.2+12}" text-anchor="middle" font-family="Georgia,serif" font-size="34" font-weight="700" fill="${B}">${label}</text>`}
  if(ak)leaf+=`<g fill="none" stroke="${B}" stroke-width="2" stroke-linecap="round"><path d="M${x+w+22} ${y+h*.4}q14 22 0 44" /><path d="M${x+w+34} ${y+h*.34}q24 28 0 56" stroke-opacity=".6"/><path d="M${x+w+46} ${y+h*.28}q34 34 0 68" stroke-opacity=".3"/></g>`;
  leaf+=`<path d="M${x-30} ${y+h}H${x+w+30}" stroke="${B}" stroke-opacity=".5" stroke-width="3"/>`;
  leaf+=`<g stroke="${B}" stroke-opacity=".5" fill="none"><path d="M${x} ${y-30}H${x+w}M${x} ${y-36}v12M${x+w} ${y-36}v12"/><path d="M${x-40} ${y}V${y+h}M${x-46} ${y}h12M${x-46} ${y+h}h12"/></g>`;
  g=leaf;
 }
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 460"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1d3354"/><stop offset="1" stop-color="#0a1626"/></linearGradient><pattern id="p" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M20 0H0V20" fill="none" stroke="#d4b176" stroke-opacity=".07"/></pattern></defs><rect width="400" height="460" fill="url(#g)"/><rect width="400" height="460" fill="url(#p)"/>${g}<text x="200" y="440" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" letter-spacing="3" fill="#d4b176" fill-opacity=".45">ILUSTRACJA POGLĄDOWA</text></svg>`;
 return _artC[k]='data:image/svg+xml,'+encodeURIComponent(svg);
};
export const doorIcon=`<svg width="30" height="30" viewBox="0 0 32 32"><rect x="1" y="1" width="30" height="30" rx="5" fill="none" stroke="#d4b176" stroke-width="1.5"/><rect x="10" y="6" width="12" height="20" fill="none" stroke="#d4b176" stroke-width="2"/><circle cx="19" cy="17" r="1.4" fill="#d4b176"/></svg>`;
export const toast=(m,t)=>{let e=$('#toast');if(!e){e=document.createElement('div');e.id='toast';document.body.appendChild(e)}e.textContent=m;e.className='on'+(t==='err'?' err':'');clearTimeout(toast.t);toast.t=setTimeout(()=>e.className='',3800)};
export const busy=b=>document.body.classList.toggle('busy',b);

/* ---------- obrazy: zmniejszanie przed zapisem ---------- */
export async function resize(src,max,q,limit){
 const blob=typeof src==='string'?await(await fetch(src)).blob():src;
 const bmp=await createImageBitmap(blob);const k=Math.min(1,max/Math.max(bmp.width,bmp.height));
 const c=document.createElement('canvas');c.width=Math.round(bmp.width*k);c.height=Math.round(bmp.height*k);
 const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
 let out=c.toDataURL('image/jpeg',q);while(out.length>limit&&q>.4){q-=.07;out=c.toDataURL('image/jpeg',q)}return out;
}
const photoCache=new Map();
export const getPhoto=async id=>{if(!photoCache.has(id))photoCache.set(id,DB.photo(id));return photoCache.get(id)};

/* ---------- Firebase (ładowany tylko gdy jest konfiguracja) ---------- */
const V='10.14.1';let fb=null,initErr=false,AUTH=null,initP=null;
export const failed=()=>initErr;
export function initFirebase(){
 if(DEMO)return Promise.resolve();
 return initP||(initP=(async()=>{try{
  const[app,fs]=await Promise.all([import(`https://www.gstatic.com/firebasejs/${V}/firebase-app.js`),import(`https://www.gstatic.com/firebasejs/${V}/firebase-firestore.js`)]);
  const ap=app.initializeApp(FIREBASE_CONFIG);fb={app:ap,db:fs.getFirestore(ap),FS:fs};
 }catch(e){console.error(e);initErr=true}})());
}
export async function loadAuth(){
 await initFirebase();if(DEMO||initErr)return null;
 if(!AUTH){const au=await import(`https://www.gstatic.com/firebasejs/${V}/firebase-auth.js`);AUTH={au,auth:au.getAuth(fb.app),FS:fb.FS,db:fb.db}}
 return AUTH;
}

/* ---------- warstwa danych: tryb podglądu (pamięć) albo Firestore ---------- */
export const SEED=[
 {"id":"d1","name":"Drzwi przeciwpożarowe EI30 do komórek lokatorskich","category":"Wewnętrzne przeciwpożarowe","short":"Drzwi o odporności ogniowej 30 minut do komórek lokatorskich i pomieszczeń technicznych. Jedno- lub dwuskrzydłowe.","desc":"Drzwi przeciwpożarowe w klasie EI30, przeznaczone do komórek lokatorskich. Dostępne w wersji jedno- i dwuskrzydłowej. Standardowe wykończenie to blacha ze stali galwanizowanej. Do wyboru dodatkowe wyposażenie: klamki, uszczelki, samozamykacze, regulator kolejności zamykania skrzydeł (przy dwuskrzydłowych) i zamki.","price":"","badge":"","visible":true,"order":1,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"EI30"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Wykończenie standardowe","v":"blacha ze stali galwanizowanej"},{"k":"Grubość skrzydła","v":"ok. 53 mm"},{"k":"Ościeżnica","v":"stalowa, narożnikowa, galwanizowana, z uszczelką pęczniejącą"},{"k":"Wypełnienie skrzydła","v":"wełna mineralna"},{"k":"Standardowy kolor","v":"RAL 7035 (jasnoszary)"},{"k":"Zawiasy","v":"2 homologowane, w tym 1 ze sprężyną do samodomykania"},{"k":"Zamek","v":"zasuwowo-zapadkowy"}]},
 {"id":"d2","name":"Drzwi przeciwpożarowe EI60 do komórek lokatorskich","category":"Wewnętrzne przeciwpożarowe","short":"Drzwi o odporności ogniowej 60 minut do komórek lokatorskich i stref pożarowych. Jedno- lub dwuskrzydłowe.","desc":"Drzwi przeciwpożarowe w klasie EI60, przeznaczone do komórek lokatorskich. Dostępne jako jedno- i dwuskrzydłowe. Standardowe wykończenie to blacha ze stali galwanizowanej. Możliwe wyposażenie dodatkowe: klamki, uszczelki, samozamykacze i zamki.","price":"","badge":"","visible":true,"order":2,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"EI60"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Wykończenie standardowe","v":"blacha ze stali galwanizowanej"},{"k":"Ościeżnica","v":"stalowa, narożnikowa, galwanizowana, z uszczelką pęczniejącą"},{"k":"Wypełnienie skrzydła","v":"wełna mineralna"},{"k":"Standardowy kolor","v":"RAL 7035 (jasnoszary)"},{"k":"Zawiasy","v":"2 homologowane, w tym 1 ze sprężyną do samodomykania"},{"k":"Zamek","v":"zasuwowo-zapadkowy"},{"k":"Zabezpieczenie","v":"2 bolce przeciwwyważeniowe"}]},
 {"id":"d3","name":"Drzwi do komórek lokatorskich bez odporności ogniowej","category":"Wewnętrzne przeciwpożarowe","short":"Uniwersalne drzwi do komórek lokatorskich, bez wymagań ogniowych. Jedno- lub dwuskrzydłowe.","desc":"Drzwi do komórek lokatorskich w wersji bez odporności ogniowej, dla pomieszczeń, w których takie wymagania nie obowiązują. Dostępne jako jedno- i dwuskrzydłowe, standardowo z blachy stalowej galwanizowanej.","price":"","badge":"","visible":true,"order":3,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"brak"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Wykończenie standardowe","v":"blacha ze stali galwanizowanej"}]},
 {"id":"d4","name":"Drzwi kierunkowe dymoszczelne S30","category":"Dymoszczelne","short":"Drzwi kierunkowe z klasą dymoszczelności S30. Jedno- lub dwuskrzydłowe.","desc":"Drzwi kierunkowe dymoszczelne w klasie S30, do komórek lokatorskich i innych miejsc, gdzie trzeba ograniczyć przenikanie dymu. Dostępne jako jedno- i dwuskrzydłowe.","price":"","badge":"","visible":true,"order":4,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Dymoszczelność","v":"S30"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Grubość skrzydła","v":"53 mm"},{"k":"Wypełnienie skrzydła","v":"wełna mineralna 150 kg/m³"}]},
 {"id":"d5","name":"Drzwi kierunkowe dymoszczelne S60","category":"Dymoszczelne","short":"Drzwi kierunkowe z klasą dymoszczelności S60. Jedno- lub dwuskrzydłowe.","desc":"Drzwi kierunkowe dymoszczelne w klasie S60, do komórek lokatorskich i innych miejsc, gdzie trzeba ograniczyć przenikanie dymu. Dostępne jako jedno- i dwuskrzydłowe.","price":"","badge":"","visible":true,"order":5,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Dymoszczelność","v":"S60"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"}]},
 {"id":"d6","name":"Drzwi przeciwpożarowe EI60 o podwyższonych właściwościach akustycznych","category":"Akustyczne","short":"Drzwi do komórek lokatorskich: odporność ogniowa 60 minut i lepsza izolacja akustyczna.","desc":"Drzwi przeciwpożarowe w klasie EI60 do komórek lokatorskich, wykonane tak, by lepiej tłumić dźwięk niż wersja podstawowa. Dostępne jako jedno- i dwuskrzydłowe.","price":"","badge":"","visible":true,"order":6,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"EI60"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"}]},
 {"id":"d7","name":"Drzwi wewnętrzne kierunkowe EI2 60 o podwyższonych właściwościach akustycznych","category":"Akustyczne","short":"Wewnętrzne drzwi kierunkowe, EI2 60, z izolacyjnością akustyczną 30 dB.","desc":"Wewnętrzne drzwi kierunkowe przeciwpożarowe w klasie EI2 60 o podwyższonych właściwościach akustycznych (30 dB). Dostępne jako jedno- i dwuskrzydłowe.","price":"","badge":"","visible":true,"order":7,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"EI2 60"},{"k":"Izolacyjność akustyczna","v":"30 dB"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"}]},
 {"id":"d8","name":"Drzwi zewnętrzne kierunkowe bez odporności ogniowej","category":"Zewnętrzne","short":"Drzwi zewnętrzne kierunkowe, jedno- lub dwuskrzydłowe, standardowo w kolorze RAL 7035.","desc":"Drzwi zewnętrzne kierunkowe w wersji bez odporności ogniowej. Dostępne jako jedno- i dwuskrzydłowe. Wykończenie podstawowe: RAL 7035.","price":"","badge":"","visible":true,"order":8,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"brak"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Kolor podstawowy","v":"RAL 7035"}]},
 {"id":"d9","name":"Drzwi zewnętrzne przeciwpożarowe EI60","category":"Zewnętrzne","short":"Drzwi zewnętrzne kierunkowe o odporności ogniowej 60 minut. Jedno- lub dwuskrzydłowe.","desc":"Drzwi zewnętrzne kierunkowe przeciwpożarowe w klasie EI60. Dostępne jako jedno- i dwuskrzydłowe, w podstawowym kolorze RAL 7035.","price":"","badge":"","visible":true,"order":9,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"EI60"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Kolor podstawowy","v":"RAL 7035"}]},
 {"id":"d10","name":"Drzwi zewnętrzne przeciwpożarowe EI120","category":"Zewnętrzne","short":"Drzwi zewnętrzne kierunkowe o odporności ogniowej 120 minut. Jedno- lub dwuskrzydłowe.","desc":"Drzwi zewnętrzne kierunkowe przeciwpożarowe w klasie EI120. Dostępne jako jedno- i dwuskrzydłowe, w podstawowym kolorze RAL 7035.","price":"","badge":"","visible":true,"order":10,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Odporność ogniowa","v":"EI120"},{"k":"Skrzydła","v":"jedno- lub dwuskrzydłowe"},{"k":"Kolor podstawowy","v":"RAL 7035"}]},
 {"id":"d11","name":"Drzwi przeciwpożarowe z blachy powlekanej, kolor drewnopodobny","category":"Wewnętrzne przeciwpożarowe","short":"Drzwi przeciwpożarowe z blachy powlekanej w kolorze imitującym drewno.","desc":"Drzwi przeciwpożarowe wykonane z blachy powlekanej, wykończone w kolorze drewnopodobnym, dla wnętrz, w których drzwi mają wyglądać jak zwykłe drzwi drewniane. Klasę odporności ogniowej podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":11,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Wykończenie","v":"blacha powlekana, kolor drewnopodobny"}]},
 {"id":"d12","name":"Drzwi antywłamaniowe RC2","category":"Antywłamaniowe","short":"Drzwi w klasie odporności na włamanie RC2, z ryglowaniem bolcami.","desc":"Drzwi antywłamaniowe w klasie RC2. Solidne skrzydło zapewnia izolację termiczną i akustyczną, a zamknięcie ryglują bolce w górnej, dolnej i środkowej części drzwi.","price":"","badge":"","visible":true,"order":12,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Klasa antywłamaniowa","v":"RC2"}]},
 {"id":"d13","name":"Drzwi antywłamaniowe RC3","category":"Antywłamaniowe","short":"Drzwi w klasie odporności na włamanie RC3, z ryglowaniem bolcami.","desc":"Drzwi antywłamaniowe w klasie RC3. Solidne skrzydło zapewnia izolację termiczną i akustyczną, a zamknięcie ryglują bolce w górnej, dolnej i środkowej części drzwi.","price":"","badge":"","visible":true,"order":13,"photoIds":[],"thumb":"","variants":[],"specs":[{"k":"Klasa antywłamaniowa","v":"RC3"}]}
,
 {"id":"d14","name":"Klamki do drzwi przeciwpożarowych","category":"Akcesoria","short":"Klamki dobierane do drzwi przeciwpożarowych, dostępne jako wyposażenie dodatkowe.","desc":"Klamki dobierane do drzwi przeciwpożarowych, dostępne jako wyposażenie dodatkowe. Szczegóły i dostępne warianty podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":14,"photoIds":[],"thumb":"","variants":[],"specs":[]},
 {"id":"d15","name":"Uszczelki do drzwi przeciwpożarowych","category":"Akcesoria","short":"Uszczelki jako wyposażenie dodatkowe drzwi przeciwpożarowych i dymoszczelnych.","desc":"Uszczelki jako wyposażenie dodatkowe drzwi przeciwpożarowych i dymoszczelnych. Szczegóły i dostępne warianty podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":15,"photoIds":[],"thumb":"","variants":[],"specs":[]},
 {"id":"d16","name":"Samozamykacze","category":"Akcesoria","short":"Samozamykacze, które domykają drzwi po przejściu, dostępne jako wyposażenie dodatkowe.","desc":"Samozamykacze, które domykają drzwi po przejściu, dostępne jako wyposażenie dodatkowe. Szczegóły i dostępne warianty podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":16,"photoIds":[],"thumb":"","variants":[],"specs":[]},
 {"id":"d17","name":"Dźwignie antypaniczne","category":"Akcesoria","short":"Dźwignie antypaniczne do drzwi na drogach ewakuacyjnych, umożliwiające szybkie otwarcie drzwi od wewnątrz.","desc":"Dźwignie antypaniczne do drzwi na drogach ewakuacyjnych, umożliwiające szybkie otwarcie drzwi od wewnątrz. Szczegóły i dostępne warianty podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":17,"photoIds":[],"thumb":"","variants":[],"specs":[]},
 {"id":"d18","name":"Zamki do drzwi","category":"Akcesoria","short":"Zamki dobierane do rodzaju drzwi, dostępne jako wyposażenie dodatkowe.","desc":"Zamki dobierane do rodzaju drzwi, dostępne jako wyposażenie dodatkowe. Szczegóły i dostępne warianty podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":18,"photoIds":[],"thumb":"","variants":[],"specs":[]},
 {"id":"d19","name":"Regulator kolejności zamykania skrzydeł","category":"Akcesoria","short":"Regulator kolejności zamykania skrzydeł w drzwiach dwuskrzydłowych: zapewnia, że skrzydła domykają się w prawidłowej kolejności.","desc":"Regulator kolejności zamykania skrzydeł w drzwiach dwuskrzydłowych: zapewnia, że skrzydła domykają się w prawidłowej kolejności. Szczegóły i dostępne warianty podamy przy zamówieniu.","price":"","badge":"","visible":true,"order":19,"photoIds":[],"thumb":"","variants":[],"specs":[]},
 {"id": "d20", "name": "Drzwi dwuskrzydłowe przeciwpożarowe EI30", "category": "Dwuskrzydłowe", "short": "Dwuskrzydłowe drzwi o odporności ogniowej 30 minut do pomieszczeń technicznych i komórek lokatorskich.", "desc": "Drzwi przeciwpożarowe w klasie EI30 w wersji dwuskrzydłowej, do szerszych otworów. Standardowe wykończenie to blacha ze stali galwanizowanej. Do wyboru dodatkowe wyposażenie: klamki, uszczelki, samozamykacze, zamki oraz regulator kolejności zamykania skrzydeł.", "price": "", "badge": "", "visible": true, "order": 20, "photoIds": [], "thumb": "", "variants": [], "specs": [{"k": "Odporność ogniowa", "v": "EI30"}, {"k": "Skrzydła", "v": "dwuskrzydłowe"}, {"k": "Wykończenie standardowe", "v": "blacha ze stali galwanizowanej"}, {"k": "Wyposażenie dodatkowe", "v": "regulator kolejności zamykania skrzydeł"}]},
 {"id": "d21", "name": "Drzwi dwuskrzydłowe przeciwpożarowe EI60", "category": "Dwuskrzydłowe", "short": "Dwuskrzydłowe drzwi o odporności ogniowej 60 minut do stref pożarowych i komórek lokatorskich.", "desc": "Drzwi przeciwpożarowe w klasie EI60 w wersji dwuskrzydłowej. Standardowe wykończenie to blacha ze stali galwanizowanej. Możliwe wyposażenie dodatkowe: klamki, uszczelki, samozamykacze, zamki i regulator kolejności zamykania skrzydeł.", "price": "", "badge": "", "visible": true, "order": 21, "photoIds": [], "thumb": "", "variants": [], "specs": [{"k": "Odporność ogniowa", "v": "EI60"}, {"k": "Skrzydła", "v": "dwuskrzydłowe"}, {"k": "Wykończenie standardowe", "v": "blacha ze stali galwanizowanej"}, {"k": "Wyposażenie dodatkowe", "v": "regulator kolejności zamykania skrzydeł"}]},
 {"id": "d22", "name": "Drzwi zewnętrzne dwuskrzydłowe przeciwpożarowe EI120", "category": "Dwuskrzydłowe", "short": "Dwuskrzydłowe drzwi zewnętrzne kierunkowe o odporności ogniowej 120 minut.", "desc": "Drzwi zewnętrzne kierunkowe przeciwpożarowe w klasie EI120, w wersji dwuskrzydłowej, w podstawowym kolorze RAL 7035.", "price": "", "badge": "", "visible": true, "order": 22, "photoIds": [], "thumb": "", "variants": [], "specs": [{"k": "Odporność ogniowa", "v": "EI120"}, {"k": "Skrzydła", "v": "dwuskrzydłowe"}, {"k": "Kolor podstawowy", "v": "RAL 7035"}]},
 {"id": "d23", "name": "Drzwi dwuskrzydłowe dymoszczelne S60", "category": "Dwuskrzydłowe", "short": "Dwuskrzydłowe drzwi kierunkowe z klasą dymoszczelności S60 do dróg ewakuacyjnych.", "desc": "Drzwi kierunkowe z klasą dymoszczelności S60 w wersji dwuskrzydłowej, do szerokich przejść na drogach ewakuacyjnych i w strefach wymagających ochrony przed dymem.", "price": "", "badge": "", "visible": true, "order": 23, "photoIds": [], "thumb": "", "variants": [], "specs": [{"k": "Dymoszczelność", "v": "S60"}, {"k": "Skrzydła", "v": "dwuskrzydłowe"}]}
];
function MemDB(seed){
 const st={main:seed?{phone:'+48 600 000 000',address:'ul. Przykładowa 1, 00-000 Miasto'}:{},images:{hero:'',about:''},prods:seed?structuredClone(SEED):[],photos:{},stats:{},pstats:{}};
 let n=100;
 return{
  async settings(){return{main:st.main,images:st.images}},
  async saveMain(o){st.main=structuredClone(o)},async saveImages(o){st.images={...st.images,...o}},
  async products(all){return structuredClone(st.prods.filter(p=>all||p.visible))},
  async photo(id){return st.photos[id]||''},
  async addPhoto(d){const id='p'+(++n);st.photos[id]=d;return id},
  async delPhoto(id){delete st.photos[id]},
  async saveProduct(id,o){if(!id){id='d'+(++n);st.prods.push({...o,id})}else{const i=st.prods.findIndex(p=>p.id===id);st.prods[i]={...o,id}}return id},
  async patch(id,o){Object.assign(st.prods.find(p=>p.id===id),o)},
  async delProduct(id){st.prods=st.prods.filter(p=>p.id!==id)},
  async bump(coll,id,f){const m=coll==='stats'?st.stats:st.pstats;(m[id]=m[id]||{})[f]=(m[id][f]||0)+1},
  async stats(){return Object.entries(st.stats).map(([id,v])=>({id,...v})).sort((a,b)=>b.id.localeCompare(a.id)).slice(0,30)},
  async prodStats(){return Object.entries(st.pstats).map(([id,v])=>({id,...v}))},
  async inquiries(){return structuredClone(st.inq||[]).sort((a,b)=>b.t-a.t)},async addInquiry(o){(st.inq=st.inq||[]).push({...o,id:'q'+(++n)})},async patchInquiry(id,o){Object.assign((st.inq||[]).find(x=>x.id===id)||{},o)},async delInquiry(id){st.inq=(st.inq||[]).filter(x=>x.id!==id)},
  async admins(){return[{id:'demo@gmail.com'}]},async addAdmin(){},async delAdmin(){},
  async exportAll(){return structuredClone({main:st.main,images:st.images,products:st.prods,photos:st.photos})},
  async importAll(o){st.main=o.main||{};st.images=o.images||{};st.prods=o.products||[];st.photos=o.photos||{}}
 };
}
function LiveDB(){
 const{db,FS}=fb;const{doc,getDoc,getDocs,setDoc,addDoc,updateDoc,deleteDoc,collection,query,where,orderBy,limit,increment,documentId}=FS;
 return{
  async settings(){const[a,b]=await Promise.all([getDoc(doc(db,'settings','main')),getDoc(doc(db,'settings','images'))]);return{main:a.exists()?a.data():{},images:b.exists()?b.data():{}}},
  async saveMain(o){await setDoc(doc(db,'settings','main'),o)},
  async saveImages(o){await setDoc(doc(db,'settings','images'),o,{merge:true})},
  async products(all){const r=await getDocs(all?collection(db,'products'):query(collection(db,'products'),where('visible','==',true)));return r.docs.map(d=>({...d.data(),id:d.id}))},
  async photo(id){const d=await getDoc(doc(db,'photos',id));return d.exists()?d.data().data:''},
  async addPhoto(data){return(await addDoc(collection(db,'photos'),{data,t:Date.now()})).id},
  async delPhoto(id){await deleteDoc(doc(db,'photos',id))},
  async saveProduct(id,o){if(id){await setDoc(doc(db,'products',id),o);return id}return(await addDoc(collection(db,'products'),o)).id},
  async patch(id,o){await updateDoc(doc(db,'products',id),o)},
  async delProduct(id){await deleteDoc(doc(db,'products',id))},
  async bump(coll,id,f){await setDoc(doc(db,coll,id),{[f]:increment(1)},{merge:true})},
  async stats(){const r=await getDocs(query(collection(db,'stats'),orderBy(documentId(),'desc'),limit(30)));return r.docs.map(d=>({id:d.id,...d.data()}))},
  async prodStats(){const r=await getDocs(collection(db,'prodStats'));return r.docs.map(d=>({id:d.id,...d.data()}))},
  async inquiries(){const r=await getDocs(query(collection(db,'inquiries'),orderBy('t','desc'),limit(200)));return r.docs.map(d=>({...d.data(),id:d.id}))},
  async addInquiry(o){await addDoc(collection(db,'inquiries'),o)},
  async patchInquiry(id,o){await updateDoc(doc(db,'inquiries',id),o)},
  async delInquiry(id){await deleteDoc(doc(db,'inquiries',id))},
  async admins(){const r=await getDocs(collection(db,'admins'));return r.docs.map(d=>({id:d.id,...d.data()}))},
  async addAdmin(email,by){await setDoc(doc(db,'admins',email),{rola:'admin',dodal:by||'',data:Date.now()})},
  async delAdmin(email){await deleteDoc(doc(db,'admins',email))},
  async exportAll(){const[s,pr,ph]=await Promise.all([this.settings(),this.products(true),getDocs(collection(db,'photos'))]);const photos={};ph.docs.forEach(d=>photos[d.id]=d.data().data);return{main:s.main,images:s.images,products:pr,photos}},
  async importAll(o){await setDoc(doc(db,'settings','main'),o.main||{});await setDoc(doc(db,'settings','images'),o.images||{});for(const[id,d]of Object.entries(o.photos||{}))await setDoc(doc(db,'photos',id),{data:d,t:Date.now()});for(const p of o.products||[]){const{id,...r}=p;await setDoc(doc(db,'products',id),r)}}
 };
}
export const DB={};
let dbReady=null;
export function makeDB(){return dbReady||(dbReady=(async()=>{await initFirebase();Object.assign(DB,(DEMO||initErr)?MemDB(DEMO):LiveDB());return DB})())}

/* ---------- wczytanie ustawień i produktów do pamięci ---------- */
export async function loadData(all=false){
 await makeDB();
 try{const s=await DB.settings();Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,DEF,s.main||{});if(!String(S.smsPhone||'').trim())S.smsPhone=DEF.smsPhone;if(!Array.isArray(S.mountPoints))S.mountPoints=[];if(!Array.isArray(S.docs))S.docs=[];IMG.hero=s.images?.hero||'';IMG.about=s.images?.about||''}catch(e){console.error(e)}
 try{ST.P=await DB.products(all)}catch(e){console.error(e);ST.P=[]}
 if(!DEMO&&!all&&!ST.P.length)ST.P=structuredClone(SEED); // pusta baza: pokaż katalog startowy, dopóki nie dodasz własnych produktów
}
