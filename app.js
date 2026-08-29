// ===================== HYPE HARBOR APP =====================
const app = document.getElementById('app');
const SUBCATS_ORDER = ["Suits & Formal","Jackets & Coats","Sweaters & Hoodies","Jeans & Pants","Dresses","Skirts","Shirts & Tops","Streetwear","Accessories & Beauty"];

// ---------- SAVED (localStorage) ----------
const SAVE_KEY = 'hh_saved_v1';
function getSaved(){ try{ return JSON.parse(localStorage.getItem(SAVE_KEY) || '[]'); }catch(e){ return []; } }
function setSaved(arr){ localStorage.setItem(SAVE_KEY, JSON.stringify(arr)); updateSavedBadge(); }
function isSaved(id){ return getSaved().includes(id); }
function toggleSaved(id){
  let s = getSaved();
  if(s.includes(id)) s = s.filter(x=>x!==id); else s.push(id);
  setSaved(s);
  document.querySelectorAll(`[data-heart="${id}"]`).forEach(el=>el.classList.toggle('saved', s.includes(id)));
}
function updateSavedBadge(){
  const n = getSaved().length;
  const d = document.getElementById('savedBadgeD');
  const m = document.getElementById('savedBadgeM');
  if(d){ d.style.display = n ? 'flex':'none'; d.textContent = n; }
  if(m){ m.style.display = n ? 'block':'none'; }
}

// ---------- helpers ----------
function svgHeart(filled){
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="${filled?'currentColor':'none'}"><path d="M12 21s-7.5-4.6-10-9.3C.5 8.2 2.3 5 5.6 5c1.9 0 3.4 1 4.4 2.4C11 6 12.5 5 14.4 5 17.7 5 19.5 8.2 22 11.7 19.5 15.4 12 21 12 21z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>`;
}
function svgArrow(){
  return `<svg width="11" height="11" viewBox="0 0 11 11" fill="none"><path d="M2 9L9 2M9 2H3.5M9 2V7.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}
function productsByGender(g){
  if(g==='men') return PRODUCTS.filter(p=>p.g==='men'||p.g==='unisex');
  if(g==='women') return PRODUCTS.filter(p=>p.g==='women'||p.g==='unisex');
  return PRODUCTS;
}
function subcatsFor(list){
  const counts = {};
  list.forEach(p=>{ counts[p.sc] = (counts[p.sc]||0)+1; });
  return SUBCATS_ORDER.filter(s=>counts[s]).map(s=>({name:s,count:counts[s]}));
}

// ---------- card renderers ----------
function pinCard(p){
  const saved = isSaved(p.id);
  const badge = p.tr ? `<span class="pin-badge trend-badge">${p.new?'':'★ '}Trending</span>`
              : p.new ? `<span class="pin-badge new-badge trend-badge">New</span>` : '';
  return `<div class="pin reveal" data-id="${p.id}">
    <div class="pin-media">
      <img src="${p.img}" alt="${escAttr(p.t)}" loading="lazy">
      ${badge}
      <div class="pin-heart ${saved?'saved':''}" data-heart="${p.id}">${svgHeart(saved)}</div>
    </div>
    <div class="pin-body">
      <p class="pin-tag">${p.sc}</p>
      <p class="pin-title">${escHtml(p.t)}</p>
      <span class="pin-cta">View on Amazon ${svgArrow()}</span>
    </div>
  </div>`;
}
function carouselCard(p){
  const badge = p.new ? `<span class="trend-badge new-badge">New</span>` : `<span class="trend-badge">Trending</span>`;
  return `<div class="ccard" data-id="${p.id}">
    <div class="cimg"><img src="${p.img}" alt="${escAttr(p.t)}" loading="lazy">${badge}</div>
    <div class="cbody"><p class="ctitle">${escHtml(p.t)}</p><span class="ccta">View on Amazon →</span></div>
  </div>`;
}
function escHtml(s){ return s.replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }
function escAttr(s){ return escHtml(s).replace(/"/g,'&quot;'); }

// ---------- HOME ----------
function renderHome(){
  const trending = PRODUCTS.filter(p=>p.tr).slice(0,14);
  const fresh = PRODUCTS.filter(p=>p.new).slice(0,18);
  const menPicks = PRODUCTS.filter(p=>p.g==='men').sort((a,b)=>b.impr-a.impr).slice(0,10);
  const womenPicks = PRODUCTS.filter(p=>p.g==='women').sort((a,b)=>b.impr-a.impr).slice(0,10);
  const stage = trending.slice(0,3);

  app.innerHTML = `
  <section class="hero">
    <div class="hero-grid">
      <div>
        <p class="eyebrow"><span class="dot"></span>421 pieces, updated from Pinterest</p>
        <h1 class="headline">Find things<br>you'll want to <em>keep</em>.</h1>
        <p class="hero-sub">Trending products, stylish finds, and everyday favorites — pulled straight from what people are actually pinning right now.</p>
        <div class="hero-ctas">
          <a class="btn-primary" href="#/trending">Explore finds ${svgArrow()}</a>
          <a class="btn-ghost" href="#/men">Shop Men's</a>
          <a class="btn-ghost" href="#/women">Shop Women's</a>
        </div>
        <div class="hero-stats">
          <div><b>421</b>products</div>
          <div><b>${PRODUCTS.filter(p=>p.tr).length}</b>trending now</div>
          <div><b>${PRODUCTS.filter(p=>p.new).length}</b>new this week</div>
        </div>
      </div>
      <div class="hero-stage" aria-hidden="true">
        ${stage[0]?`<div class="float-card fc1"><img src="${stage[0].img}"></div>`:''}
        ${stage[1]?`<div class="float-card fc2"><img src="${stage[1].img}"></div>`:''}
        ${stage[2]?`<div class="float-card fc3"><img src="${stage[2].img}"></div>`:''}
        <div class="float-chip chip1">✨ Curated daily</div>
        <div class="float-chip chip2"><span class="heart">${svgHeart(true)}</span> Save your faves</div>
        <div class="float-chip chip3">→ Straight to Amazon</div>
      </div>
    </div>
  </section>

  <svg class="seam" viewBox="0 0 1200 14" preserveAspectRatio="none" aria-hidden="true"><line x1="0" y1="7" x2="1200" y2="7" stroke="#17151C" stroke-width="1.4" stroke-dasharray="1 9" stroke-linecap="round"/></svg>

  <section class="cat-bubbles">
    <div class="section-head"><h2>Shop by category</h2></div>
    <div class="bubble-row">
      ${bubble("Men's",'/men', productsByGender('men').length, pick(productsByGender('men')))}
      ${bubble("Women's",'/women', productsByGender('women').length, pick(productsByGender('women')))}
      ${bubble('Suits & Formal','/men/'+encodeURIComponent('Suits & Formal'), countSub('Suits & Formal'), pick(byGenderSub(null,'Suits & Formal')))}
      ${bubble('Dresses','/women/'+encodeURIComponent('Dresses'), countSub('Dresses'), pick(byGenderSub(null,'Dresses')))}
      ${bubble('Denim & Pants','/men/'+encodeURIComponent('Jeans & Pants'), countSub('Jeans & Pants'), pick(byGenderSub(null,'Jeans & Pants')))}
      ${bubble('Streetwear','/men/'+encodeURIComponent('Streetwear'), countSub('Streetwear'), pick(byGenderSub(null,'Streetwear')))}
    </div>
  </section>

  <section class="carousel-wrap">
    <div class="section-head"><h2>Trending now</h2><a class="see-all" href="#/trending">See all →</a></div>
    <div class="carousel">${trending.map(carouselCard).join('')}</div>
  </section>

  <section class="carousel-wrap">
    <div class="section-head"><h2>New finds</h2><a class="see-all" href="#/new">See all →</a></div>
    <div class="carousel">${fresh.map(carouselCard).join('')}</div>
  </section>

  <section class="carousel-wrap">
    <div class="section-head"><h2>Men's picks</h2><a class="see-all" href="#/men">See all →</a></div>
    <div class="carousel">${menPicks.map(carouselCard).join('')}</div>
  </section>

  <section class="carousel-wrap">
    <div class="section-head"><h2>Women's picks</h2><a class="see-all" href="#/women">See all →</a></div>
    <div class="carousel">${womenPicks.map(carouselCard).join('')}</div>
  </section>
  `;
  bindCommon();
  initReveal();
}
function pick(list){ return list.length ? list[0].img : (PRODUCTS[0]?.img||''); }
function countSub(sc){ return PRODUCTS.filter(p=>p.sc===sc).length; }
function byGenderSub(g, sc){ return PRODUCTS.filter(p=> (!g || p.g===g || p.g==='unisex') && p.sc===sc ); }
function bubble(label, route, count, img){
  return `<div class="bubble" data-route="${route}">
    <div class="bimg"><img src="${img}" alt=""></div>
    <div class="blabel">${label}</div>
    <div class="bcount">${count} pieces</div>
  </div>`;
}

// ---------- CATEGORY (men/women + subcategory) ----------
function renderCategory(gender, subcat){
  let list = productsByGender(gender);
  const subs = subcatsFor(list);
  if(subcat) list = list.filter(p=>p.sc===subcat);
  list = [...list].sort((a,b)=>b.impr-a.impr);

  const title = gender === 'men' ? "Men's" : "Women's";
  const pageTitle = subcat ? `${title} — ${subcat}` : title;
  const sub = subcat === 'Jeans & Pants' ? 'Denim worth adding to your rotation.'
            : subcat === 'Dresses' ? 'Find your next favorite look.'
            : subcat === 'Suits & Formal' ? 'Sharp fits for the occasions that call for it.'
            : `Every ${title.toLowerCase()} piece we've pinned, in one place.`;

  app.innerHTML = `
  <section class="hero" style="padding-bottom:8px;">
    <p class="eyebrow"><span class="dot"></span>${list.length} pieces</p>
    <h1 class="headline">${pageTitle}</h1>
    <p class="hero-sub">${sub}</p>
  </section>
  <div class="pill-rail-wrap">
    <div class="pill-rail" id="subPills">
      <button class="pill ${!subcat?'active':''}" data-sub="">All</button>
      ${subs.map(s=>`<button class="pill ${s.name===subcat?'active':''}" data-sub="${escAttr(s.name)}">${s.name} (${s.count})</button>`).join('')}
    </div>
  </div>
  <section class="feed-section">
    <main class="feed" id="feedGrid">${list.map(pinCard).join('')}</main>
    ${list.length===0?`<div class="empty-state" style="display:block;"><h3>Nothing here yet</h3><p>Try another category.</p></div>`:''}
  </section>
  `;
  document.querySelectorAll('#subPills .pill').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const s = btn.dataset.sub;
      location.hash = s ? `#/${gender}/${encodeURIComponent(s)}` : `#/${gender}`;
    });
  });
  bindCommon();
  initReveal();
}

// ---------- TRENDING / NEW ----------
function renderFlagged(kind){
  const list = kind==='trending' ? PRODUCTS.filter(p=>p.tr).sort((a,b)=>b.impr-a.impr) : PRODUCTS.filter(p=>p.new).sort((a,b)=>b.impr-a.impr);
  const title = kind==='trending' ? 'Trending now' : 'New finds';
  const sub = kind==='trending' ? 'What people are actually clicking on right now.' : 'The newest pieces added to the catalog.';
  app.innerHTML = `
  <section class="hero" style="padding-bottom:8px;">
    <p class="eyebrow"><span class="dot"></span>${list.length} pieces</p>
    <h1 class="headline">${title}</h1>
    <p class="hero-sub">${sub}</p>
  </section>
  <section class="feed-section">
    <main class="feed">${list.map(pinCard).join('')}</main>
  </section>`;
  bindCommon();
  initReveal();
}

// ---------- SAVED ----------
function renderSaved(){
  const ids = getSaved();
  const list = PRODUCTS.filter(p=>ids.includes(p.id));
  app.innerHTML = `
  <section class="hero" style="padding-bottom:8px;">
    <p class="eyebrow"><span class="dot"></span>${list.length} saved</p>
    <h1 class="headline">Your saved finds</h1>
    <p class="hero-sub">Saved right on this device — tap the heart on any pin to add it here.</p>
  </section>
  <section class="feed-section">
    ${list.length ? `<main class="feed">${list.map(pinCard).join('')}</main>` : `<div class="empty-state" style="display:block;"><h3>Nothing saved yet</h3><p>Tap the heart on any product to save it here.</p></div>`}
  </section>`;
  bindCommon();
  initReveal();
}

// ---------- SEARCH RESULTS ----------
function renderSearch(q){
  const query = (q||'').toLowerCase().trim();
  const list = query ? PRODUCTS.filter(p =>
    p.t.toLowerCase().includes(query) || p.sc.toLowerCase().includes(query) || p.g.toLowerCase().includes(query)
  ) : [];
  app.innerHTML = `
  <section class="hero" style="padding-bottom:8px;">
    <p class="eyebrow"><span class="dot"></span>${list.length} results</p>
    <h1 class="headline">Search: “${escHtml(q||'')}”</h1>
  </section>
  <section class="feed-section">
    ${list.length ? `<main class="feed">${list.map(pinCard).join('')}</main>` : `<div class="empty-state" style="display:block;"><h3>No matches</h3><p>Try a different word — like "denim", "dress", or "hoodie".</p></div>`}
  </section>`;
  bindCommon();
  initReveal();
}

// ---------- PRODUCT DETAIL ----------
function renderProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p){ location.hash = '#/'; return; }
  const related = PRODUCTS.filter(x=>x.sc===p.sc && x.id!==p.id).sort((a,b)=>b.impr-a.impr).slice(0,10);
  const saved = isSaved(p.id);
  app.innerHTML = `
  <div class="pdp">
    <span class="pdp-back" onclick="history.back()">← Back</span>
    <div class="pdp-grid">
      <div class="pdp-img"><img src="${p.img}" alt="${escAttr(p.t)}"></div>
      <div>
        <p class="pdp-tag">${p.sc} · ${p.g==='men'?"Men's":p.g==='women'?"Women's":'Unisex'} ${p.tr?' · Trending':''}${p.new?' · New':''}</p>
        <h1>${escHtml(p.t)}</h1>
        <div class="pdp-why">
          <strong>Why it's here:</strong> pulled from our live Pinterest catalog — this piece has ${p.impr.toLocaleString()} impressions from people browsing the boards. Tap through and it opens the exact product on Amazon.
        </div>
        <a class="pdp-cta" href="${p.l}" target="_blank" rel="noopener sponsored">View on Amazon ${svgArrow()}</a>
        <p class="pdp-disc">As an Amazon Associate, Hype Harbor earns from qualifying purchases.</p>
        <div style="display:flex;gap:10px;">
          <button class="btn-ghost" data-heart="${p.id}" style="display:inline-flex;align-items:center;gap:7px;" onclick="toggleSaved('${p.id}')">
            ${svgHeart(saved)} ${saved?'Saved':'Save this'}
          </button>
        </div>
      </div>
    </div>
    <div class="related" style="margin-top:44px;">
      <h3>More ${p.sc}</h3>
      <div class="carousel">${related.map(carouselCard).join('')}</div>
    </div>
  </div>`;
  bindCommon();
}

// ---------- common bindings ----------
function bindCommon(){
  document.querySelectorAll('.pin').forEach(el=>{
    el.addEventListener('click', (e)=>{
      if(e.target.closest('[data-heart]')) return;
      location.hash = `#/product/${el.dataset.id}`;
    });
  });
  document.querySelectorAll('[data-heart]').forEach(el=>{
    el.addEventListener('click', (e)=>{
      e.stopPropagation();
      toggleSaved(el.dataset.heart || el.getAttribute('data-heart'));
    });
  });
  document.querySelectorAll('.ccard').forEach(el=>{
    el.addEventListener('click', ()=>{ location.hash = `#/product/${el.dataset.id}`; });
  });
  document.querySelectorAll('.bubble[data-route]').forEach(el=>{
    el.addEventListener('click', ()=>{ location.hash = '#'+el.dataset.route; });
  });
  document.querySelectorAll('.bn-item[data-route]').forEach(el=>{
    el.classList.toggle('active', currentRoute().startsWith(el.dataset.route) && (el.dataset.route!=='/'||currentRoute()==='/'));
  });
  document.querySelectorAll('.nav-links a[data-route]').forEach(el=>{
    const r = el.dataset.route;
    el.classList.toggle('active', currentRoute()===r || (r!=='/' && currentRoute().startsWith(r)));
  });
}
function initReveal(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){ els.forEach(e=>e.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, {threshold:0.08});
  els.forEach(e=>io.observe(e));
}

// ---------- ROUTER ----------
function currentRoute(){
  return (location.hash || '#/').slice(1) || '/';
}
function router(){
  window.scrollTo(0,0);
  const parts = currentRoute().split('/').filter(Boolean); // e.g. ['men','Jeans%20%26%20Pants']
  if(parts.length===0){ renderHome(); return; }
  const [seg1, seg2] = parts;
  if(seg1==='men' || seg1==='women'){ renderCategory(seg1, seg2 ? decodeURIComponent(seg2) : null); return; }
  if(seg1==='trending'){ renderFlagged('trending'); return; }
  if(seg1==='new'){ renderFlagged('new'); return; }
  if(seg1==='saved'){ renderSaved(); return; }
  if(seg1==='search'){ renderSearch(decodeURIComponent(seg2||'')); return; }
  if(seg1==='product'){ renderProduct(decodeURIComponent(seg2||'')); return; }
  renderHome();
}
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', ()=>{
  router();
  updateSavedBadge();
  bindSearchOverlay();
});

// ---------- search overlay ----------
function bindSearchOverlay(){
  const overlay = document.getElementById('searchOverlay');
  const input = document.getElementById('searchInput');
  function open(){ overlay.classList.add('open'); setTimeout(()=>input.focus(), 50); }
  function close(){ overlay.classList.remove('open'); }
  document.getElementById('mSearchBtn')?.addEventListener('click', open);
  document.getElementById('dSearchBtn')?.addEventListener('click', open);
  document.getElementById('bnSearch')?.addEventListener('click', (e)=>{ e.preventDefault(); open(); });
  document.getElementById('searchCloseBtn')?.addEventListener('click', close);
  overlay.addEventListener('click', (e)=>{ if(e.target===overlay) close(); });
  document.addEventListener('keydown', (e)=>{
    if(e.key==='Escape') close();
    if((e.key==='/' ) && document.activeElement.tagName!=='INPUT'){ e.preventDefault(); open(); }
  });
  input?.addEventListener('keydown', (e)=>{
    if(e.key==='Enter' && input.value.trim()){
      close();
      location.hash = `#/search/${encodeURIComponent(input.value.trim())}`;
    }
  });
}
