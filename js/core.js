/* RadTom: wspólny kod strony i panelu (dane, Firebase, narzędzia). */
import {FIREBASE_CONFIG,SITE_URL} from './config.js';
export {SITE_URL};
export const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const YEAR=new Date().getFullYear();
export const tel=p=>'tel:'+String(p).replace(/[^\d+]/g,'');
export const DEMO=!FIREBASE_CONFIG.apiKey;

export const DEF={
 brand:'RadTom',oldName:'AGART',since:2006,
 phone:'',phone2:'',email:'radtom72@gmail.com',address:'',hours:'Poniedziałek – piątek, 8:00 – 16:00',nip:'',notice:'',
 heroTitle:'Drzwi BHP od ludzi, którzy sprzedają je od {lat} lat',
 heroSub:'Drzwi przeciwpożarowe, techniczne i ewakuacyjne do zakładów, magazynów, biur i obiektów użyteczności publicznej. Doradzimy, dobierzemy do wymiarów otworu i przyjmiemy zamówienie jednym telefonem.',
 aboutTitle:'Zmieniła się nazwa. Doświadczenie zostało.',
 aboutText:'Drzwi BHP sprzedajemy od {lat} lat. Przez ten czas działaliśmy pod nazwą {old}. Dziś firma działa jako {brand}, ale tworzą ją ci sami ludzie, z tą samą wiedzą i tym samym podejściem: dobrze dobrane drzwi, rzetelna informacja o parametrach i uczciwa rozmowa z klientem.\n\nWiemy, na co zwrócić uwagę przy wyborze drzwi do konkretnego otworu i konkretnego zastosowania, i chętnie dzielimy się tą wiedzą.',
 categories:['Przeciwpożarowe | Drzwi o określonej odporności ogniowej do dróg ewakuacyjnych, klatek schodowych i pomieszczeń technicznych.','Techniczne | Drzwi do kotłowni, rozdzielni, magazynów i pomieszczeń gospodarczych.','Ewakuacyjne | Drzwi na drogach ewakuacyjnych, z możliwością wyposażenia antypanicznego.','Stalowe | Solidne drzwi stalowe do obiektów przemysłowych i użytkowych.'],
 stats:[{a:'{lat}',b:'lat na rynku drzwi BHP'},{a:'{old}',b:'nasza poprzednia nazwa, ta sama firma'},{a:'mm',b:'pełne wymiary skrzydła i montażu'},{a:'1 telefon',b:'i zamówienie przyjęte'}],
 feats:[{a:'Doświadczenie, które widać',b:'Ponad dwie dekady w branży to setki dobranych drzwi i znajomość problemów, które pojawiają się dopiero na budowie.'},{a:'Dopasowanie do otworu',b:'Przy każdym modelu podajemy wymiary skrzydła i montażowe, więc od razu wiesz, czy drzwi pasują.'},{a:'Zamówienie przez telefon',b:'Bez formularzy i czekania. Dzwonisz, ustalamy szczegóły i przyjmujemy zamówienie.'}],
 steps:[{a:'Zadzwoń lub napisz',b:'Opisz, gdzie drzwi mają być zamontowane i jakie mają spełniać wymagania.'},{a:'Dobieramy drzwi',b:'Proponujemy model pasujący do wymagań i wymiarów otworu.'},{a:'Potwierdzamy szczegóły',b:'Uzgadniamy wymiary, wykonanie, kolor i warunki zamówienia.'},{a:'Realizujemy zamówienie',b:'Przyjmujemy zamówienie i informujemy o terminie realizacji.'}],
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
 {id:'d1',name:'Drzwi przeciwpożarowe EI30',category:'Przeciwpożarowe',short:'Stalowe drzwi jednoskrzydłowe do klatek schodowych, korytarzy i pomieszczeń technicznych.',desc:'To przykładowy opis produktu. W panelu administratora wpiszesz tu pełny opis: zastosowanie, konstrukcję, wyposażenie i uwagi montażowe.',price:'',badge:'Przykład',visible:true,order:1,photoIds:[],thumb:'',variants:[{name:'',leafW:'900',leafH:'2000',mountW:'990',mountH:'2065'},{name:'',leafW:'1000',leafH:'2000',mountW:'1090',mountH:'2065'}],specs:[{k:'Odporność ogniowa',v:'EI30'},{k:'Kolor',v:'RAL do wyboru'}]},
 {id:'d2',name:'Drzwi techniczne stalowe',category:'Techniczne',short:'Wytrzymałe drzwi do kotłowni, rozdzielni, magazynów i pomieszczeń gospodarczych.',desc:'Przykładowy opis produktu.',price:'od 1 890 zł netto',badge:'',visible:true,order:2,photoIds:[],thumb:'',variants:[{name:'',leafW:'800',leafH:'2000',mountW:'880',mountH:'2060'}],specs:[{k:'Materiał',v:'Blacha stalowa'}]},
 {id:'d3',name:'Drzwi ewakuacyjne dwuskrzydłowe',category:'Ewakuacyjne',short:'Drzwi na drogach ewakuacyjnych, z wyposażeniem antypanicznym.',desc:'Przykładowy opis produktu.',price:'',badge:'Nowość',visible:true,order:3,photoIds:[],thumb:'',variants:[{name:'',leafW:'1400',leafH:'2100',mountW:'1500',mountH:'2165'}],specs:[{k:'Zamknięcie',v:'Antypaniczne'}]},
 {id:'d4',name:'Drzwi stalowe zewnętrzne',category:'Stalowe',short:'Solidne drzwi do wejść technicznych i pomieszczeń narażonych na intensywne użytkowanie.',desc:'Przykładowy opis produktu.',price:'',badge:'',visible:true,order:4,photoIds:[],thumb:'',variants:[{name:'',leafW:'900',leafH:'2050',mountW:'980',mountH:'2110'}],specs:[]}
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
 try{const s=await DB.settings();Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,DEF,s.main||{});IMG.hero=s.images?.hero||'';IMG.about=s.images?.about||''}catch(e){console.error(e)}
 try{ST.P=await DB.products(all)}catch(e){console.error(e);ST.P=[]}
}
