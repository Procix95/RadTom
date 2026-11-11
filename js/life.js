/* RadTom: ożywienie strony (wjazd elementów przy przewijaniu, liczniki, iskry, cień nagłówka). Bez bibliotek. */
const calm=matchMedia('(prefers-reduced-motion: reduce)').matches;
const SEL='.stat,.card,.feat,.step,.tl,.cls,.fq,.gi,.rev,.sec h2,.sec .eyebrow,.sec .lead,.aimg,.callbox';
let io=null;

function count(el){
 const b=el.querySelector('b');if(!b||b.dataset.done)return;b.dataset.done='1';
 const m=/^(\d{1,4})(.*)$/.exec(b.textContent.trim());if(!m||calm)return;
 const to=+m[1],rest=m[2],t0=performance.now(),dur=1300;
 const tick=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);b.textContent=Math.round(to*e)+rest;if(k<1)requestAnimationFrame(tick)};
 requestAnimationFrame(tick);
}
export function reveal(){
 if(calm||!('IntersectionObserver'in window))return;
 if(!io)io=new IntersectionObserver(en=>en.forEach(e=>{
  if(!e.isIntersecting)return;io.unobserve(e.target);const el=e.target;
  el.classList.add('in');if(el.classList.contains('stat'))count(el);
  setTimeout(()=>el.classList.remove('rv','in'),1000);
 }),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
 document.querySelectorAll(SEL).forEach(el=>{
  if(el.classList.contains('rv')||el.closest('[hidden]')&&false)return;
  const sib=[...el.parentElement.children].filter(x=>x.matches(SEL));
  el.style.setProperty('--d',Math.min(sib.indexOf(el),6)*80+'ms');
  el.classList.add('rv');io.observe(el);
 });
}
export function embers(){
 const h=document.querySelector('#hero');if(!h||calm||h.querySelector('.ember'))return;
 for(let i=0;i<16;i++){const s=document.createElement('i');s.className='ember';
  s.style.cssText=`left:${Math.random()*100}%;--dx:${(Math.random()*80-40).toFixed(0)}px;--s:${(2+Math.random()*3).toFixed(1)}px;animation-duration:${(7+Math.random()*8).toFixed(1)}s;animation-delay:${(-Math.random()*12).toFixed(1)}s`;
  h.appendChild(s)}
}
let bound=false;
export function initLife(){
 if(bound)return;bound=true;
 const hd=document.querySelector('.hd');
 const onS=()=>hd&&hd.classList.toggle('sc',scrollY>24);
 addEventListener('scroll',onS,{passive:true});onS();
}
