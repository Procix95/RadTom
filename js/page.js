/* RadTom: wspólny skrypt stron pomocniczych (polityka prywatności, 404). Dane firmy bierze z ustawień panelu. */
import {S,DEF,DB,makeDB,esc,tel,$,$$,YEAR,doorIcon} from './core.js?v=1111b';

async function load(){
 try{await makeDB();const s=await DB.settings();Object.keys(S).forEach(k=>delete S[k]);Object.assign(S,DEF,s.main||{})}catch(e){console.error(e)}
}
function fill(){
 const brand=S.brand||'RadTom',old=S.oldName||'';
 $('#logo').innerHTML=`${doorIcon}<span><b>${esc(brand.toUpperCase())}</b><small>Drzwi przeciwpożarowe${old?' · dawniej '+esc(old):''}</small></span>`;
 $('#navcall').innerHTML=S.phone?`<a class="btn gold sm" href="${tel(S.phone)}">Zadzwoń</a>`:'';
 $('#mbar').innerHTML=S.phone?`<a class="btn gold" href="${tel(S.phone)}">Zadzwoń i zamów</a>`:'';
 $('#foot').innerHTML=`<span>© ${YEAR} ${esc(brand)}${old?' (dawniej '+esc(old)+')':''}</span><span><a href="polityka-prywatnosci.html">Polityka prywatności</a><a href="./#admin">Panel administratora</a></span>`;
 const map={'[data-brand]':brand,'[data-old]':old,'[data-email]':S.email||'','[data-phone]':S.phone||'(numer telefonu podany na stronie głównej)','[data-address]':S.address||'(adres podany na stronie głównej)','[data-nip]':S.nip?'NIP: '+S.nip:''};
 for(const[sel,val]of Object.entries(map))$$(sel).forEach(e=>e.textContent=val);
 $$('a[data-email]').forEach(a=>a.href='mailto:'+(S.email||''));
 document.title=document.title.replace('{brand}',brand);
}
load().then(fill);
