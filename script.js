/* ---------- Category icons (simple inline SVG) ---------- */
const cats = [
  ['Women','<path d="M12 3a4 4 0 100 8 4 4 0 000-8zM12 11v6M9 15h6M12 17v4"/>'],
  ['Men','<circle cx="10" cy="14" r="5"/><path d="M14 10l6-6M15 4h5v5"/>'],
  ['T-Shirt','<path d="M8 4L3 7l2 4 3-1v10h8V10l3 1 2-4-5-3a4 4 0 01-8 0z"/>'],
  ['Jacket','<path d="M9 3l-5 4v13h5V9M15 3l5 4v13h-5V9M9 3h6M12 9v11"/>'],
  ['Pants','<path d="M7 3h10l1 18h-4l-2-10-2 10H6z"/>'],
  ['Shorts','<path d="M6 4h12l1 11h-6l-1-4-1 4H5z"/>'],
  ['Blazer','<path d="M8 3l4 6 4-6 4 4-2 14H6L4 7z"/>'],
  ['Cap','<path d="M3 16c0-5 4-9 9-9s9 4 9 9H3zM3 16h18M12 7V5"/>'],
  ['Bags','<rect x="5" y="9" width="14" height="11" rx="2"/><path d="M9 9V7a3 3 0 016 0v2"/>'],
  ['Deals','<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>']
];
document.getElementById('catList').innerHTML = cats.map(([n,p]) =>
  `<li><a href="#"><svg viewBox="0 0 24 24">${p}</svg>${n}</a></li>`).join('');
document.getElementById('chipTrack').innerHTML = ['Women','Men','Shorts','Pants','Bags','Cap','Jacket','T-Shirt','Blazer'].map(n => {
  const c = cats.find(x => x[0] === n);
  return `<a href="#" class="cat-chip"><svg viewBox="0 0 24 24">${c[1]}</svg>${n}</a>`;
}).join('');

gsap.registerPlugin(ScrollTrigger);

/* ---------- Page load intro ---------- */
gsap.from('.main-bar > *', {y:-20, opacity:0, duration:.7, stagger:.1, ease:'power3.out'});
gsap.from('.cat-list li', {y:-10, opacity:0, duration:.5, stagger:.05, delay:.4, ease:'power2.out'});

/* ---------- Blue category bar: disappear on scroll ---------- */
const header = document.getElementById('siteHeader');
const catBar = document.getElementById('catBar');
const catItems = catBar.querySelectorAll('li');
const HIDE_AT = 80;   // px scrolled before bar hides
const SHOW_AT = 10;   // px from top before bar returns
let barHidden = false;

function hideBar(){
  barHidden = true;
  gsap.killTweensOf([catBar, catItems]);
  gsap.to(catItems, {opacity:0, y:-8, duration:.2, ease:'power1.in'});
  gsap.to(catBar, {height:0, duration:.45, ease:'power3.inOut', overwrite:'auto'});
}
function showBar(){
  barHidden = false;
  gsap.killTweensOf([catBar, catItems]);
  gsap.to(catBar, {height:72, duration:.45, ease:'power3.inOut', overwrite:'auto'});
  gsap.to(catItems, {opacity:1, y:0, duration:.35, delay:.15, stagger:.03});
}
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('header-scrolled', y > 10);
  if (y > HIDE_AT && !barHidden) hideBar();
  else if (y < SHOW_AT && barHidden) showBar();
}, {passive:true});

/* ---------- Hero slider ---------- */
const viewport = document.getElementById('heroViewport');
const track    = document.getElementById('heroTrack');
const slides   = [...track.children];
const barsEl   = document.getElementById('bars');
const counter  = document.getElementById('counter');
const DURATION = 5;               // seconds per slide
let current = 1, progress;

// split headlines into words for a masked reveal
slides.forEach(s => {
  const h = s.querySelector('h2');
  h.innerHTML = h.textContent.trim().split(' ')
    .map(w => `<span class="w"><span>${w}</span></span>`).join(' ');
});

// progress bars
slides.forEach((_, i) => {
  const b = document.createElement('div');
  b.className = 'bar';
  b.innerHTML = '<i></i>';
  b.onclick = () => goTo(i);
  barsEl.appendChild(b);
});
const fills = [...barsEl.querySelectorAll('i')];

function centerOffset(i){
  const s = slides[i];
  return viewport.clientWidth/2 - (s.offsetLeft + s.offsetWidth/2);
}

function runProgress(){
  if (progress) progress.kill();
  fills.forEach((f, i) => gsap.set(f, {scaleX: i < current ? 1 : 0}));
  progress = gsap.fromTo(fills[current], {scaleX:0},
    {scaleX:1, duration:DURATION, ease:'none', onComplete:() => goTo(current+1)});
}

function goTo(i, instant){
  current = (i + slides.length) % slides.length;
  counter.textContent = String(current+1).padStart(2,'0') + ' / ' + String(slides.length).padStart(2,'0');
  gsap.to(track, {x:centerOffset(current), duration: instant ? 0 : 1, ease:'power3.inOut'});

  slides.forEach((s, idx) => {
    const active = idx === current;
    const content = s.querySelector('.slide-content');
    const bg = s.querySelector('.slide-bg');
    gsap.to(s, {opacity: active ? 1 : .55, duration:.7});
    gsap.killTweensOf([content, ...content.querySelectorAll('.eyebrow,.w>span,.btn')]);
    if (active) {
      gsap.set(content, {opacity:1});
      const d = instant ? .2 : .55;
      gsap.fromTo(bg, {scale:1.18}, {scale:1, duration:6, ease:'power2.out'});
      gsap.fromTo(content.querySelector('.eyebrow'), {y:16, opacity:0}, {y:0, opacity:1, duration:.6, delay:d});
      gsap.fromTo(content.querySelectorAll('.w>span'), {yPercent:110}, {yPercent:0, duration:.8, stagger:.06, delay:d+.1, ease:'power3.out'});
      gsap.fromTo(content.querySelector('.btn'), {y:16, opacity:0}, {y:0, opacity:1, duration:.6, delay:d+.4});
    } else {
      gsap.to(content, {opacity:0, duration:.3});
      gsap.to(bg, {x:0, y:0, duration:.5});
    }
  });
  runProgress();
}

document.getElementById('nextBtn').onclick = () => goTo(current+1);
document.getElementById('prevBtn').onclick = () => goTo(current-1);
viewport.addEventListener('mouseenter', () => progress && progress.pause());
viewport.addEventListener('mouseleave', () => progress && progress.resume());
window.addEventListener('resize', () => gsap.set(track, {x:centerOffset(current)}));
window.addEventListener('keydown', e => {
  if (/INPUT|TEXTAREA/.test(e.target.tagName)) return;
  if (e.key === 'ArrowRight') goTo(current+1);
  if (e.key === 'ArrowLeft')  goTo(current-1);
});

// mouse parallax on the active image
viewport.addEventListener('mousemove', e => {
  const r = viewport.getBoundingClientRect();
  const nx = (e.clientX - r.left)/r.width - .5, ny = (e.clientY - r.top)/r.height - .5;
  gsap.to(slides[current].querySelector('.slide-bg'), {x:nx*-24, y:ny*-24, duration:.8, ease:'power2.out'});
});

// drag / swipe
let startX = null;
viewport.addEventListener('pointerdown', e => startX = e.clientX);
window.addEventListener('pointerup', e => {
  if (startX === null) return;
  const dx = e.clientX - startX;
  if (Math.abs(dx) > 50) goTo(current + (dx < 0 ? 1 : -1));
  startX = null;
});

// pause when hero is off-screen
ScrollTrigger.create({
  trigger:'.hero', start:'top top', end:'bottom top',
  onLeave:() => progress && progress.pause(),
  onEnterBack:() => progress && progress.resume()
});

window.addEventListener('load', () => goTo(current, true));

/* ---------- Reusable carousels (Specials + Winter Picks) ---------- */
document.querySelectorAll('.sp-wrap').forEach(wrap => {
  const t = wrap.querySelector('.sp-track');
  const prev = wrap.querySelector('.prev2'), next = wrap.querySelector('.next2');
  const step = () => (t.firstElementChild.offsetWidth + 16) * 2;
  const update = () => {
    prev.disabled = t.scrollLeft < 4;
    next.disabled = t.scrollLeft + t.clientWidth >= t.scrollWidth - 4;
  };
  const move = d => gsap.to(t, {scrollLeft: t.scrollLeft + d*step(), duration:.7, ease:'power3.out'});
  prev.onclick = () => move(-1);
  next.onclick = () => move(1);
  t.addEventListener('scroll', update, {passive:true});
  window.addEventListener('resize', update);
  update();
});

/* ---------- Scroll reveals ---------- */
gsap.from('.specials .section-head > *', {
  y:20, opacity:0, duration:.6, stagger:.1,
  scrollTrigger:{trigger:'.specials', start:'top 85%'}
});
gsap.from('.sp-card', {
  y:50, opacity:0, duration:.8, stagger:.08, ease:'power3.out',
  scrollTrigger:{trigger:'.sp-track', start:'top 88%'}
});
gsap.from('.banner', {
  y:70, opacity:0, duration:.9, stagger:.15, ease:'power3.out',
  scrollTrigger:{trigger:'.banners', start:'top 85%'}
});
gsap.from('.banner-body > *', {
  y:20, opacity:0, duration:.6, stagger:.08, delay:.3,
  scrollTrigger:{trigger:'.banners', start:'top 85%'}
});
// subtle image parallax inside banners
document.querySelectorAll('.banner img').forEach(img => {
  gsap.fromTo(img, {yPercent:-6, scale:1.12}, {
    yPercent:6, ease:'none',
    scrollTrigger:{trigger:img.parentElement, start:'top bottom', end:'bottom top', scrub:true}
  });
});

/* ================= Phase 3 additions ================= */

/* Scroll progress bar */
gsap.to('#scrollProgress', {
  scaleX:1, ease:'none',
  scrollTrigger:{trigger:document.documentElement, start:'top top', end:'bottom bottom', scrub:.3}
});

/* Announcement bar close */
document.querySelector('.announce-close').onclick = () => {
  const bar = document.querySelector('.announce');
  gsap.to(bar, {height:0, paddingTop:0, paddingBottom:0, opacity:0, duration:.5, ease:'power3.inOut',
    onComplete:() => bar.style.display = 'none'});
};

/* Hero track drifts slightly on scroll */
gsap.to('.hero-track', {
  y:70, ease:'none',
  scrollTrigger:{trigger:'.hero', start:'top top', end:'bottom top', scrub:true}
});

/* Winter Style Picks reveals */
gsap.from('.picks .section-head > *', {
  y:20, opacity:0, duration:.6, stagger:.1,
  scrollTrigger:{trigger:'.picks', start:'top 85%'}
});
gsap.from('.picks .pd-card', {
  y:60, opacity:0, duration:.8, stagger:.08, ease:'power3.out',
  scrollTrigger:{trigger:'.picks .sp-track', start:'top 88%'}
});

/* Product card hover: Quick Add slides up, image zooms */
document.querySelectorAll('.pd-card').forEach(card => {
  const qa = card.querySelector('.qa'), img = card.querySelector('img');
  gsap.set(qa, {yPercent:140, opacity:0});
  card.addEventListener('mouseenter', () => {
    gsap.to(qa,  {yPercent:0, opacity:1, duration:.4, ease:'power3.out'});
    gsap.to(img, {scale:1.08, duration:.8, ease:'power2.out'});
  });
  card.addEventListener('mouseleave', () => {
    gsap.to(qa,  {yPercent:140, opacity:0, duration:.3, ease:'power2.in'});
    gsap.to(img, {scale:1, duration:.6, ease:'power2.out'});
  });
});

/* Brand marquee: infinite, reacts to scroll direction/speed, slows on hover */
const sets = gsap.utils.toArray('.marquee-set');
const marquee = gsap.to(sets, {xPercent:-100, repeat:-1, duration:28, ease:'none'});
bindScrollSpeed(marquee);
const brandsEl = document.querySelector('.brands');
brandsEl.addEventListener('mouseenter', () => gsap.to(marquee, {timeScale:.2, duration:.6, overwrite:true}));
brandsEl.addEventListener('mouseleave', () => gsap.to(marquee, {timeScale:1, duration:.6, overwrite:true}));
gsap.from('.logo-item', {
  y:20, opacity:0, duration:.6, stagger:.06,
  scrollTrigger:{trigger:'.brands', start:'top 92%'}
});

/* Magnetic banner buttons */
document.querySelectorAll('.banner .btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r = btn.getBoundingClientRect();
    gsap.to(btn, {x:(e.clientX - r.left - r.width/2)*.35, y:(e.clientY - r.top - r.height/2)*.5, duration:.3});
  });
  btn.addEventListener('mouseleave', () => gsap.to(btn, {x:0, y:0, duration:.7, ease:'elastic.out(1,.4)'}));
});

/* Category bar icon hover bounce */
document.querySelectorAll('.cat-list a').forEach(a => {
  const svg = a.querySelector('svg');
  a.addEventListener('mouseenter', () => gsap.fromTo(svg, {y:0}, {y:-4, duration:.25, yoyo:true, repeat:1, ease:'power2.out'}));
});

/* ================= Phase 4: working header + new sections ================= */

const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => [...c.querySelectorAll(s)];

/* scroll-speed helper for marquees */
function bindScrollSpeed(tw){
  ScrollTrigger.create({
    onUpdate(self){
      const d = self.direction;
      const v = Math.min(1 + Math.abs(self.getVelocity())/250, 5);
      gsap.to(tw, {timeScale:d*v, duration:.2, overwrite:true,
        onComplete:() => gsap.to(tw, {timeScale:d, duration:1, overwrite:true})});
    }
  });
}

/* ---------- Toast ---------- */
function toast(msg){
  const t = $('#toast');
  t.textContent = msg;
  gsap.killTweensOf(t);
  gsap.timeline()
    .fromTo(t, {autoAlpha:0, y:20}, {autoAlpha:1, y:0, duration:.35, ease:'back.out(2)'})
    .to(t, {autoAlpha:0, y:10, duration:.3, delay:2});
}

/* ---------- Panels: search / cart / login / mobile menu ---------- */
const overlay = $('#overlay');
const panels = {search:$('#searchPanel'), cart:$('#cartDrawer'), login:$('#loginModal'), menu:$('#mobileMenu')};
const anim = {
  search:{from:{yPercent:-105}, to:{yPercent:0}},
  cart:  {from:{xPercent:105},  to:{xPercent:0}},
  menu:  {from:{xPercent:-105}, to:{xPercent:0}},
  login: {from:{opacity:0, y:30, scale:.95}, to:{opacity:1, y:0, scale:1}}
};
Object.entries(panels).forEach(([k, el]) => gsap.set(el, anim[k].from));
gsap.set(overlay, {autoAlpha:0});
let openName = null;

function openPanel(name){
  if (openName === name) return;
  if (openName) closePanel(true);
  openName = name;
  const el = panels[name];
  el.style.visibility = 'visible';
  gsap.to(el, {...anim[name].to, duration:.55, ease:'power3.out'});
  gsap.to(overlay, {autoAlpha:1, duration:.3});
  document.body.style.overflow = 'hidden';
  if (name === 'search') setTimeout(() => $('#searchInput').focus(), 300);
  if (name === 'cart') gsap.from('.ci', {x:30, opacity:0, duration:.5, stagger:.07, delay:.2});
}
function closePanel(keepOverlay){
  if (!openName) return;
  const name = openName, el = panels[name];
  openName = null;
  gsap.to(el, {...anim[name].from, duration:.4, ease:'power3.in', onComplete:() => { if (openName !== name) el.style.visibility = 'hidden'; }});
  if (keepOverlay !== true) {
    gsap.to(overlay, {autoAlpha:0, duration:.3});
    document.body.style.overflow = '';
  }
}
overlay.onclick = () => closePanel();
$$('[data-close]').forEach(b => b.onclick = () => closePanel());
window.addEventListener('keydown', e => { if (e.key === 'Escape') closePanel(); });
$('#openSearch').onclick = () => openPanel('search');
$('#openCart').onclick   = () => openPanel('cart');
$('#openLogin').onclick  = () => openPanel('login');
$('#burger').onclick     = () => openPanel('menu');
$$('[data-open]').forEach(a => a.onclick = () => openPanel(a.dataset.open));

// '#' links should not jump to top
document.addEventListener('click', e => {
  const a = e.target.closest('a[href="#"]');
  if (a) e.preventDefault();
});

/* ---------- Mega menu ---------- */
const mega = $('#mega'), megaPanels = $$('.mega-panel', mega);
let megaOpen = null, megaTimer;
gsap.set(mega, {autoAlpha:0, y:-10});
function showMega(key){
  clearTimeout(megaTimer);
  if (megaOpen !== key) {
    megaPanels.forEach(p => p.style.display = p.dataset.panel === key ? 'grid' : 'none');
    const p = megaPanels.find(p => p.dataset.panel === key);
    gsap.to(mega, {autoAlpha:1, y:0, duration:.3, ease:'power2.out', overwrite:true});
    gsap.fromTo(p.children, {y:16, opacity:0}, {y:0, opacity:1, duration:.45, stagger:.06, ease:'power3.out', overwrite:true});
  }
  megaOpen = key;
  $$('.nav-item').forEach(n => n.classList.toggle('active', n.dataset.menu === key));
}
function hideMega(){
  clearTimeout(megaTimer);
  megaTimer = setTimeout(() => {
    megaOpen = null;
    gsap.to(mega, {autoAlpha:0, y:-10, duration:.25, overwrite:true});
    $$('.nav-item').forEach(n => n.classList.remove('active'));
  }, 140);
}
$$('.nav-item').forEach(n => {
  n.addEventListener('mouseenter', () => n.dataset.menu ? showMega(n.dataset.menu) : hideMega());
  n.addEventListener('mouseleave', hideMega);
});
mega.addEventListener('mouseenter', () => clearTimeout(megaTimer));
mega.addEventListener('mouseleave', hideMega);
window.addEventListener('scroll', () => { if (megaOpen && window.scrollY > 200) { clearTimeout(megaTimer); hideMega(); } }, {passive:true});

/* ---------- Product helpers ---------- */
const priceOf = txt => parseFloat((txt.match(/\$([\d.]+)/) || [0, 0])[1]);
const money = n => '$' + n.toFixed(2);
const catalog = $$('.pd-card').map(c => ({
  el:c, name:$('h5', c).textContent, cat:$('small', c).textContent,
  price:priceOf($('p', c).textContent), img:$('img', c).src
})).filter((p, i, a) => a.findIndex(x => x.name === p.name) === i);

/* ---------- Search ---------- */
const sInput = $('#searchInput'), sResults = $('#results');
function renderResults(q){
  q = q.trim().toLowerCase();
  if (!q) { sResults.innerHTML = ''; return; }
  const hits = catalog.filter(p => (p.name + ' ' + p.cat).toLowerCase().includes(q)).slice(0, 6);
  sResults.innerHTML = hits.length
    ? hits.map(p => `<li data-name="${p.name}"><img src="${p.img}" alt=""><div><b>${p.name}</b><small>${p.cat} · ${money(p.price)}</small></div></li>`).join('')
    : `<li class="none">No results for “${q}”</li>`;
  gsap.from('#results li', {y:12, opacity:0, duration:.35, stagger:.04});
}
sInput.addEventListener('input', () => renderResults(sInput.value));
$$('.chips button').forEach(b => b.onclick = () => { sInput.value = b.textContent; renderResults(b.textContent); });
sResults.addEventListener('click', e => {
  const li = e.target.closest('li[data-name]');
  if (!li) return;
  const p = catalog.find(x => x.name === li.dataset.name);
  closePanel();
  setTimeout(() => {
    p.el.scrollIntoView({behavior:'smooth', block:'center', inline:'center'});
    gsap.fromTo(p.el, {outline:'3px solid #11195c', outlineOffset:6}, {outlineColor:'rgba(17,25,92,0)', duration:1.6, delay:.8});
  }, 450);
});

/* ---------- Cart ---------- */
const cart = [];
const FREE_SHIP = 40;
function renderCart(){
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const sub = cart.reduce((s, i) => s + i.qty*i.price, 0);
  $('#cartCount').textContent = count;
  $('#cartTitleCount').textContent = '(' + count + ')';
  $('#cartSub').textContent = money(sub);
  $('#cartItems').innerHTML = cart.length ? cart.map(i => `
    <div class="ci"><img src="${i.img}" alt="">
      <div class="ci-info"><b>${i.name}</b><small>${i.variant || ''}</small>
        <div class="ci-row">
          <div class="mini-qty"><button data-act="dec" data-key="${i.key}">−</button><span>${i.qty}</span><button data-act="inc" data-key="${i.key}">+</button></div>
          <b>${money(i.price*i.qty)}</b>
        </div>
        <button class="rm" data-act="rm" data-key="${i.key}">Remove</button>
      </div></div>`).join('') : '<p class="cart-empty">Your cart is empty.</p>';
  const left = FREE_SHIP - sub;
  $('#shipText').textContent = sub <= 0 ? 'Free shipping on orders over ' + money(FREE_SHIP)
    : left > 0 ? 'Add ' + money(left) + ' more for free shipping' : '🎉 You’ve unlocked free shipping!';
  gsap.to('#shipFill', {width:Math.min(100, sub/FREE_SHIP*100) + '%', duration:.6, ease:'power3.out'});
}
$('#cartItems').addEventListener('click', e => {
  const b = e.target.closest('[data-act]');
  if (!b) return;
  const i = cart.find(x => x.key === b.dataset.key);
  if (b.dataset.act === 'inc') i.qty++;
  if (b.dataset.act === 'dec') i.qty = Math.max(1, i.qty - 1);
  if (b.dataset.act === 'rm') cart.splice(cart.indexOf(i), 1);
  renderCart();
});
$('#checkoutBtn').onclick = () => toast(cart.length ? 'This is a demo store — checkout is disabled' : 'Your cart is empty');

function flyToCart(img){
  if (!img) return;
  const r = img.getBoundingClientRect(), t = $('#openCart').getBoundingClientRect();
  const c = img.cloneNode();
  Object.assign(c.style, {position:'fixed', left:r.left+'px', top:r.top+'px', width:r.width+'px', height:r.height+'px',
    objectFit:'cover', zIndex:300, borderRadius:'8px', pointerEvents:'none', margin:0});
  document.body.appendChild(c);
  gsap.to(c, {left:t.left, top:t.top, width:20, height:20, opacity:.4, duration:.7, ease:'power3.in', onComplete:() => c.remove()});
}
function addToCart(item, imgEl){
  const key = item.name + '|' + (item.variant || '');
  const ex = cart.find(i => i.key === key);
  ex ? ex.qty += item.qty : cart.push({...item, key});
  renderCart();
  flyToCart(imgEl);
  gsap.fromTo('#cartCount', {scale:1.9}, {scale:1, duration:.6, delay:.7, ease:'back.out(3)'});
  gsap.delayedCall(.8, () => openPanel('cart'));
}
renderCart();

// Quick Add on product cards
document.addEventListener('click', e => {
  const qa = e.target.closest('.qa');
  if (!qa) return;
  e.preventDefault();
  const card = qa.closest('.pd-card'), img = $('img', card);
  addToCart({name:$('h5', card).textContent, price:priceOf($('p', card).textContent), img:img.src, variant:'', qty:1}, img);
});

/* ---------- Login / register modal ---------- */
let mode = 'in';
$$('.tabs button').forEach(b => b.onclick = () => {
  mode = b.dataset.tab;
  $$('.tabs button').forEach(x => x.classList.toggle('active', x === b));
  $('#nameField').classList.toggle('hide', mode === 'in');
  $('#formSubmit').textContent = mode === 'in' ? 'Log in' : 'Create account';
  $('#formErr').textContent = '';
});
$('#loginForm').addEventListener('submit', e => {
  e.preventDefault();
  const email = $('#emailField').value.trim(), pass = $('#passField').value;
  const err = $('#formErr');
  if (!/^\S+@\S+\.\S+$/.test(email)) { err.textContent = 'Enter a valid email address.'; gsap.fromTo('#loginModal', {x:-8}, {x:0, duration:.5, ease:'elastic.out(1,.3)'}); return; }
  if (pass.length < 6) { err.textContent = 'Password must be at least 6 characters.'; gsap.fromTo('#loginModal', {x:-8}, {x:0, duration:.5, ease:'elastic.out(1,.3)'}); return; }
  const who = (mode === 'up' && $('#nameField').value.trim()) || email.split('@')[0];
  $('#openLogin').textContent = 'Hi, ' + who.split(' ')[0];
  err.textContent = '';
  closePanel();
  toast(mode === 'in' ? 'Welcome back, ' + who + '!' : 'Account created. Welcome, ' + who + '!');
});

/* ---------- Trending reveal ---------- */
gsap.from('.trending .section-head > *', {y:20, opacity:0, duration:.6, stagger:.1, scrollTrigger:{trigger:'.trending', start:'top 85%'}});
gsap.from('.trending .pd-card', {y:60, opacity:0, duration:.8, stagger:.08, ease:'power3.out', scrollTrigger:{trigger:'.trending .sp-track', start:'top 88%'}});

/* ---------- Review ticker ---------- */
const tkSets = $$('.ticker-set');
const ticker = gsap.fromTo(tkSets, {xPercent:-100}, {xPercent:0, repeat:-1, duration:34, ease:'none'});
bindScrollSpeed(ticker);
gsap.from('.ticker', {opacity:0, y:30, duration:.8, scrollTrigger:{trigger:'.ticker', start:'top 95%'}});

/* ---------- Product spotlight ---------- */
const spotImg = $('#spotImg'), spotMain = $('#spotMain');
$$('.spot-thumbs button').forEach(b => b.onclick = () => {
  if (b.classList.contains('active')) return;
  $$('.spot-thumbs button').forEach(x => x.classList.toggle('active', x === b));
  gsap.to(spotImg, {opacity:0, duration:.2, onComplete:() => {
    spotImg.onload = () => gsap.to(spotImg, {opacity:1, duration:.4});
    spotImg.src = b.dataset.full;
  }});
});
spotMain.addEventListener('mousemove', e => {
  const r = spotMain.getBoundingClientRect();
  gsap.to(spotImg, {transformOrigin:((e.clientX-r.left)/r.width*100) + '% ' + ((e.clientY-r.top)/r.height*100) + '%', scale:1.7, duration:.5, ease:'power2.out'});
});
spotMain.addEventListener('mouseleave', () => gsap.to(spotImg, {scale:1, duration:.5}));

$$('#swatches button').forEach(b => b.onclick = () => {
  $$('#swatches button').forEach(x => x.classList.toggle('active', x === b));
  $('#colorName').textContent = b.dataset.name;
  gsap.fromTo(b, {scale:.7}, {scale:1, duration:.5, ease:'back.out(3)'});
});
$$('#sizes button:not([disabled])').forEach(b => b.onclick = () => {
  $$('#sizes button').forEach(x => x.classList.toggle('active', x === b));
  $('#sizeName').textContent = b.textContent;
});
let qty = 1;
const setQty = n => { qty = Math.max(1, n); $('#qVal').textContent = qty; gsap.fromTo('#qVal', {y:-6, opacity:.3}, {y:0, opacity:1, duration:.25}); };
$('#qMinus').onclick = () => setQty(qty - 1);
$('#qPlus').onclick  = () => setQty(qty + 1);
const spotItem = () => ({name:'Zero Neck Long Sleeve Pullover', price:79,
  img:$('.spot-thumbs button.active img').src, variant:$('#colorName').textContent + ' / ' + $('#sizeName').textContent, qty});
$('#addBtn').onclick = () => addToCart(spotItem(), spotImg);
$('#buyBtn').onclick = () => { addToCart(spotItem(), spotImg); toast('Demo store — checkout is disabled'); };
$('#shareBtn').onclick = () => {
  if (navigator.share) navigator.share({title:document.title, url:location.href}).catch(() => {});
  else if (navigator.clipboard) navigator.clipboard.writeText(location.href).then(() => toast('Link copied to clipboard'));
};

gsap.from('.spot-gallery', {x:-60, opacity:0, duration:1, ease:'power3.out', scrollTrigger:{trigger:'.spot', start:'top 80%'}});
gsap.from('.spot-info > *', {x:40, opacity:0, duration:.7, stagger:.08, ease:'power3.out', scrollTrigger:{trigger:'.spot', start:'top 80%'}});

/* ================= Phase 5: remaining sections ================= */

/* generic section-head reveal for every .rv section */
$$('.rv').forEach(sec => {
  gsap.from($$('.section-head > *, .comm-h', sec), {
    y:24, opacity:0, duration:.7, stagger:.1, ease:'power3.out',
    scrollTrigger:{trigger:sec, start:'top 85%'}
  });
});

/* ---------- Video banner ---------- */
const vbText = $('.vb-text');
vbText.innerHTML = '<span>' + vbText.textContent + '</span>';
gsap.from('.vb-text span', {yPercent:110, duration:.9, ease:'power3.out', scrollTrigger:{trigger:'#videoBanner', start:'top 60%'}});
// parallax background
gsap.fromTo('.vb-bg', {yPercent:-8}, {yPercent:8, ease:'none',
  scrollTrigger:{trigger:'#videoBanner', start:'top bottom', end:'bottom top', scrub:true}});
// frame opens up as it scrolls in
gsap.fromTo('#videoBanner', {clipPath:'inset(7% 5% round 22px)'}, {clipPath:'inset(0% 0% round 0px)', ease:'none',
  scrollTrigger:{trigger:'#videoBanner', start:'top 95%', end:'top 30%', scrub:true}});
// slow "ken burns" – play/pause button controls it (swap .vb-bg for a <video> later)
const kb = gsap.to('.vb-bg', {scale:1.15, duration:12, ease:'sine.inOut', yoyo:true, repeat:-1});
$('#vbPlay').onclick = e => {
  const playing = !kb.paused();
  playing ? kb.pause() : kb.play();
  e.currentTarget.textContent = playing ? '▶' : '❚❚';
  gsap.fromTo(e.currentTarget, {scale:.8}, {scale:1, duration:.4, ease:'back.out(3)'});
};

/* ---------- Top Offers ---------- */
gsap.from('.offer', {y:70, opacity:0, scale:.94, duration:.9, stagger:.15, ease:'power3.out', scrollTrigger:{trigger:'.offer-grid', start:'top 85%'}});
gsap.from('.disc', {rotation:-90, scale:0, duration:1, delay:.5, ease:'back.out(2)', scrollTrigger:{trigger:'.offer-grid', start:'top 85%'}});
$$('.offer').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    const nx = (e.clientX - r.left)/r.width - .5, ny = (e.clientY - r.top)/r.height - .5;
    gsap.to(c, {rotationY:nx*10, rotationX:-ny*10, transformPerspective:800, duration:.4, ease:'power2.out'});
  });
  c.addEventListener('mouseleave', () => gsap.to(c, {rotationX:0, rotationY:0, duration:.7, ease:'elastic.out(1,.5)'}));
});

/* ---------- Categories ---------- */
gsap.from('.cat-chip', {x:40, opacity:0, duration:.6, stagger:.07, ease:'power3.out', scrollTrigger:{trigger:'#chipTrack', start:'top 90%'}});
$$('.cat-chip').forEach(c => {
  const svg = $('svg', c);
  c.addEventListener('mouseenter', () => gsap.fromTo(svg, {rotation:0}, {rotation:360, duration:.6, ease:'power2.out'}));
});

/* ---------- Shop the look ---------- */
gsap.from('.look', {y:80, opacity:0, duration:.9, stagger:.12, ease:'power3.out', scrollTrigger:{trigger:'.looks', start:'top 85%'}});
gsap.from('.look-card', {y:30, opacity:0, duration:.6, stagger:.12, delay:.5, ease:'power3.out', scrollTrigger:{trigger:'.looks', start:'top 85%'}});
$$('.look-img img').forEach(img => gsap.fromTo(img, {yPercent:-5, scale:1.12}, {yPercent:5, ease:'none',
  scrollTrigger:{trigger:img.parentElement, start:'top bottom', end:'bottom top', scrub:true}}));
$$('.look').forEach(l => l.addEventListener('mouseenter', () => gsap.to($('.look-card', l), {y:-6, duration:.3}))
  || l.addEventListener('mouseleave', () => gsap.to($('.look-card', l), {y:0, duration:.4})));
$$('.lk-add').forEach(b => b.onclick = () => {
  const card = b.closest('.look-card'), th = $('.lk-th', card);
  addToCart({name:$('b', card).textContent, price:priceOf($('small', card).textContent), img:th.src, variant:'', qty:1}, th);
});

/* ---------- Social count-up ---------- */
$$('.count').forEach(el => {
  const o = {v:0};
  gsap.to(o, {v:parseFloat(el.dataset.to), duration:2, ease:'power2.out',
    onUpdate:() => el.textContent = o.v.toFixed(1),
    scrollTrigger:{trigger:el, start:'top 92%'}});
});
gsap.from('.soc', {y:30, opacity:0, duration:.6, stagger:.1, scrollTrigger:{trigger:'.socials', start:'top 90%'}});

/* ---------- FAQ accordion ---------- */
const faqs = $$('.faq');
function setFaq(f, open){
  f.classList.toggle('open', open);
  gsap.to($('.faq-a', f), {height: open ? 'auto' : 0, duration:.45, ease:'power3.inOut'});
}
faqs.forEach(f => {
  if (f.classList.contains('open')) gsap.set($('.faq-a', f), {height:'auto'});
  $('.faq-q', f).onclick = () => {
    const wasOpen = f.classList.contains('open');
    faqs.forEach(x => x !== f && x.classList.contains('open') && setFaq(x, false));
    setFaq(f, !wasOpen);
  };
});
gsap.from('.faq', {x:-30, opacity:0, duration:.6, stagger:.08, scrollTrigger:{trigger:'.faqs', start:'top 90%'}});

/* ---------- Blogs ---------- */
$$('.blog').forEach(b => gsap.from(b, {y:60, opacity:0, duration:.8, ease:'power3.out', scrollTrigger:{trigger:b, start:'top 88%'}}));

/* ---------- Footer ---------- */
gsap.from('.foot-grid > *', {y:40, opacity:0, duration:.8, stagger:.12, ease:'power3.out', scrollTrigger:{trigger:'.footer', start:'top 90%'}});
gsap.from('.foot-bottom > *', {y:20, opacity:0, duration:.6, stagger:.1, scrollTrigger:{trigger:'.foot-bottom', start:'top 98%'}});
$$('.foot-soc a').forEach(a => a.addEventListener('mouseenter', () => gsap.fromTo(a, {y:0}, {y:-5, duration:.2, yoyo:true, repeat:1})));
$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const inp = $('#newsEmail');
  if (!/^\S+@\S+\.\S+$/.test(inp.value.trim())) {
    gsap.fromTo(inp, {x:-8}, {x:0, duration:.5, ease:'elastic.out(1,.3)'});
    return toast('Please enter a valid email');
  }
  inp.value = '';
  toast('Thanks for subscribing! Check your inbox for 10% off.');
});

/* ---------- Back to top ---------- */
const toTop = $('#toTop');
gsap.set(toTop, {autoAlpha:0, y:20});
let topShown = false;
window.addEventListener('scroll', () => {
  const show = window.scrollY > 700;
  if (show !== topShown) { topShown = show; gsap.to(toTop, {autoAlpha:show ? 1 : 0, y:show ? 0 : 20, duration:.35, overwrite:true}); }
}, {passive:true});
toTop.onclick = () => window.scrollTo({top:0, behavior:'smooth'});