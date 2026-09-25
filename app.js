/* THE VAULT — ต้นแบบ
   ข้อมูลเก็บใน localStorage ของเบราว์เซอร์เครื่องนี้เท่านั้น
   เมื่อย้ายไป Supabase ให้แทนที่ Store ด้วย client จริง ส่วนที่เหลือไม่ต้องแก้ */

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const baht = n => '฿' + Math.round(n).toLocaleString('th-TH');
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

/* ---------- catalogue: รุ่นที่เรารู้จัก (แยกจากประกาศขาย) ---------- */
const MODELS = [
  {code:'MMS528D30', name:'Iron Man Mark LXXXV',        brand:'Hot Toys', scale:'1/6', series:'Avengers: Endgame',        added:'2026-09-16'},
  {code:'MMS542',    name:'Spider-Man · Upgraded Suit', brand:'Hot Toys', scale:'1/6', series:'Spider-Man: Far From Home', added:'2026-09-16'},
  {code:'MMS536',    name:'Captain America',            brand:'Hot Toys', scale:'1/6', series:'Avengers: Endgame',        added:'2026-09-16'},
  {code:'MMS557',    name:'Thor · Endgame',             brand:'Hot Toys', scale:'1/6', series:'Avengers: Endgame',        added:'2026-09-16'},
  {code:'MMS387',    name:'Doctor Strange',             brand:'Hot Toys', scale:'1/6', series:'Doctor Strange',           added:'2026-09-16'},
  {code:'MMS753',    name:'Wolverine',                  brand:'Hot Toys', scale:'1/6', series:'Deadpool & Wolverine',     added:'2026-09-16'}
];
const modelBy = code => MODELS.find(m => m.code === code);

/* ---------- ประกาศขายตัวอย่าง ---------- */
const SEED_LISTINGS = [
  {id:'L1', code:'MMS528D30', price:12900, condition:'มือสอง',   tag:'DIECAST',     seller:'Tony Collection',  location:'กรุงเทพมหานคร', description:'ตัวอย่างประกาศ: จัดแสดงในตู้กระจก อุปกรณ์และกล่องครบ มีรอยเล็กน้อยบริเวณข้อต่อขาขวา ระบบไฟใช้งานได้'},
  {id:'L2', code:'MMS542',    price:7900,  condition:'ใหม่ / ซีล', tag:'ใหม่ / ซีล',  seller:'Neighborhood',     location:'นนทบุรี',       description:'ตัวอย่างประกาศ: ยังไม่แกะซีล กล่องมีรอยขนส่งเล็กน้อยบริเวณมุม พร้อมส่ง'},
  {id:'L3', code:'MMS536',    price:8500,  condition:'มือสอง',   tag:'อุปกรณ์ครบ',  seller:'The Collector Room', location:'กรุงเทพมหานคร', description:'ตัวอย่างประกาศ: อุปกรณ์ครบพร้อมกล่อง จัดแสดงในห้องปรับอากาศ มีรอยสีจางที่สายรัดโล่'},
  {id:'L4', code:'MMS557',    price:6900,  condition:'มือสอง',   tag:'พร้อมส่ง',    seller:'Asgard Collectibles', location:'เชียงใหม่',    description:'ตัวอย่างประกาศ: อุปกรณ์ครบ กล่องมีรอยบุบเล็กน้อย ไม่ส่งผลกับตัวฟิกเกอร์'},
  {id:'L5', code:'MMS387',    price:7200,  condition:'มือสอง',   tag:'อุปกรณ์ครบ',  seller:'The Collector Room', location:'กรุงเทพมหานคร', description:'ตัวอย่างประกาศ: ผ้าคลุมและเอฟเฟกต์ครบ เคยจัดแสดง กล่องเดิมมีรอยตามอายุ'},
  {id:'L6', code:'MMS753',    price:10900, condition:'ใหม่ / ซีล', tag:'ใหม่ / ซีล',  seller:'Mutant Archives',  location:'ปทุมธานี',      description:'ตัวอย่างประกาศ: ซีลครบ เก็บในห้องปรับอากาศ พร้อมกล่องขนส่ง'}
];

/* ---------- storage ---------- */
const Store = {
  get(k, fb){ try { return JSON.parse(localStorage.getItem('vault.' + k)) ?? fb } catch { return fb } },
  set(k, v){ try { localStorage.setItem('vault.' + k, JSON.stringify(v)) } catch {} }
};
const state = {
  pane: 'prices',
  filter: 'all',
  favorites: new Set(Store.get('favorites', [])),
  listings: Store.get('listings', SEED_LISTINGS)
};
const saveFav = () => Store.set('favorites', [...state.favorites]);

/* ---------- helpers ---------- */
const CONDS = {new:'ใหม่ / ซีล', used:'มือสอง'};
const STATUS = {asking:['ตั้งขาย','ask'], sold_displayed:['ระบุขายแล้ว','sold'], ended:['ปิดประกาศ','']};

const fmtRange = (min,max) => Math.round(min)===Math.round(max) ? baht(min) : baht(min)+'–'+Math.round(max).toLocaleString('th-TH');

function range(code, cond){
  const s = MarketMath.summary(code, cond);
  return s.n ? {text: fmtRange(s.min, s.max), n: s.n} : null;
}
function toast(msg){
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 3000);
}
function openDlg(html){ $('#dlg-body').innerHTML = html; if(!$('#dlg').open) $('#dlg').showModal(); $('#dlg').scrollTop = 0 }
$('#dlg-x').onclick = () => $('#dlg').close();

const figureSVG = `<svg viewBox="0 0 178 230" fill="none" aria-hidden="true">
<g fill="#0C0C18" stroke="#3A3A57" stroke-width="1.6" stroke-linejoin="round">
<path d="M89 22c8 0 13 6 13 13s-5 13-13 13-13-6-13-13 5-13 13-13z"/><path d="M71 52h36l7 16-6 40H70l-6-40z"/>
<path d="M64 70l-14 30 6 4 16-26z"/><path d="M114 70l14 30-6 4-16-26z"/>
<path d="M72 112h14l3 46-4 44H72l-4-44z"/><path d="M92 112h14l4 46-4 44H92l-3-44z"/></g></svg>`;

/* ---------- ราคาอ้างอิง ---------- */
function showQuotes(code){
  const m = modelBy(code);
  const rows = MarketMath.rows(code);
  const fxDate = MARKET_DATA.fx.date;
  const stats = ['new','used'].map(c => {
    const s = MarketMath.summary(code, c);
    return s.n ? `<div><b>${fmtRange(s.min, s.max)}</b><span>${CONDS[c]} · ${s.n} รายการ${s.median ? ' · กลาง ' + baht(s.median) : ''}</span></div>` : '';
  }).join('');
  openDlg(`<h2>${esc(m.name)}</h2>
    <p style="color:var(--mute);margin:0 0 6px">${esc(m.brand)} · ${esc(m.code)} · สเกล ${esc(m.scale)}</p>
    <div class="stat">${stats || '<div><span>ยังไม่มีราคาอ้างอิง</span></div>'}</div>
    <div class="note">ช่วงราคาคิดจากรายการที่ยัง “ตั้งขาย” เท่านั้น ราคาตั้งขายไม่ใช่ราคาที่ซื้อขายกันจริง และยังไม่รวมค่าส่งมาไทย ภาษี หรือค่าธรรมเนียมนำเข้า · แปลงค่าเงินด้วยเรตวันที่ ${fxDate}</div>
    ${rows.map(q => {
      const [label, cls] = STATUS[q.status];
      return `<div class="qt">
        <div class="pf">${esc(q.platform)}<span class="badge ${cls}">${label}</span><span class="badge">${CONDS[q.condition]}</span></div>
        <div class="amt">${baht(MarketMath.toBaht(q))}<br><small style="font-family:var(--body);font-weight:400;color:var(--mute);font-size:11.5px">${q.amount.toLocaleString()} ${q.currency}</small></div>
        <div class="nt">${esc(q.note)}<br>${esc(q.sourceAge)} · หลักฐาน: ${q.evidence === 'page' ? 'เปิดหน้าจริง' : 'ผลค้นหา'} · <a href="${esc(q.url)}" target="_blank" rel="noopener nofollow" style="color:var(--gild)">ดูต้นทาง</a></div>
      </div>`;
    }).join('')}`);
}

function renderPrices(){
  const q = $('#q').value.trim().toLowerCase();
  let list = MODELS.filter(m => {
    if (state.filter === 'new' && !MarketMath.summary(m.code,'new').n) return false;
    if (state.filter === 'used' && !MarketMath.summary(m.code,'used').n) return false;
    if (state.filter !== 'all' && state.filter !== 'new' && state.filter !== 'used' && m.brand !== state.filter) return false;
    return !q || (m.name + ' ' + m.code + ' ' + m.brand + ' ' + m.series).toLowerCase().includes(q);
  });
  const mid = m => { const s = MarketMath.summary(m.code,'used').n ? MarketMath.summary(m.code,'used') : MarketMath.summary(m.code,'new'); return s.min ?? 0 };
  const sort = $('#sort').value;
  if (sort === 'asc') list.sort((a,b) => mid(a) - mid(b));
  else if (sort === 'desc') list.sort((a,b) => mid(b) - mid(a));

  $('#price-rows').innerHTML = list.length ? list.map(m => {
    const n = range(m.code,'new'), u = range(m.code,'used');
    return `<article class="row">
      <div class="code">${esc(m.code)}</div>
      <div class="who"><div class="nm">${esc(m.name)}</div><div class="meta">${esc(m.brand)} · สเกล ${esc(m.scale)} · ${esc(m.series)}</div></div>
      <div class="price${n ? '' : ' none'}"><span class="r-lbl">ใหม่ / ซีล</span>${n ? n.text : 'ยังไม่มีข้อมูล'}</div>
      <div class="price${u ? '' : ' none'}"><span class="r-lbl">มือสอง</span>${u ? u.text : 'ยังไม่มีข้อมูล'}</div>
      <div class="src"><button data-quotes="${esc(m.code)}">${MarketMath.rows(m.code).length} แหล่ง</button></div>
    </article>`;
  }).join('') : `<div class="empty"><h3>ไม่พบรุ่นที่ค้นหา</h3><p>ลองพิมพ์รหัสรุ่นหรือชื่อผู้ผลิตแทน</p></div>`;

  $$('[data-quotes]').forEach(el => el.onclick = () => showQuotes(el.dataset.quotes));
}

/* ---------- ตลาด ---------- */
function card(l){
  const m = modelBy(l.code) || {name:l.name, brand:l.brand, scale:l.scale, series:l.series || '', code:l.code};
  const u = l.code ? range(l.code, l.condition === 'มือสอง' ? 'used' : 'new') : null;
  const fav = state.favorites.has(l.id);
  return `<article class="card">
    <button class="ph" data-detail="${esc(l.id)}" aria-label="ดูรายละเอียด ${esc(m.name)}">
      ${figureSVG}<span class="ph-note">ยังไม่มีรูปจากผู้ขาย</span>
      ${l.tag ? `<span class="tag">${esc(l.tag)}</span>` : ''}
    </button>
    <button class="fav${fav ? ' on' : ''}" data-fav="${esc(l.id)}" aria-pressed="${fav}" aria-label="บันทึก">♥</button>
    <div class="bd">
      <div class="brand">${esc(m.brand)} / ${esc(m.scale)}</div>
      <button class="nm" data-detail="${esc(l.id)}">${esc(m.name)}</button>
      <p class="sub">${esc(m.series || l.code || '')}</p>
      <div class="pr"><b>${baht(l.price)}</b><span class="cond${l.condition === 'มือสอง' ? ' used' : ''}">${esc(l.condition)}</span></div>
      ${u ? `<div class="teaser"><span>ตลาดนอก ${u.text}</span><button data-quotes="${esc(l.code)}">เทียบ</button></div>` : ''}
      <div class="slr"><span class="av">${esc((l.seller || '?').slice(0,2).toUpperCase())}</span>${esc(l.seller)} · ${esc(l.location || '—')}</div>
    </div>
  </article>`;
}

function showDetail(id){
  const l = state.listings.find(x => x.id === id); if (!l) return;
  const m = modelBy(l.code) || {name:l.name, brand:l.brand, scale:l.scale, series:'', code:l.code};
  const u = l.code ? range(l.code, l.condition === 'มือสอง' ? 'used' : 'new') : null;
  openDlg(`<h2>${esc(m.name)}</h2>
    <p style="color:var(--mute);margin:0 0 12px">${esc(m.brand)} · ${esc(m.code || 'ไม่ระบุรหัส')} · สเกล ${esc(m.scale)}</p>
    <div style="font-family:var(--display);font-weight:700;font-size:26px">${baht(l.price)}</div>
    <span class="cond${l.condition === 'มือสอง' ? ' used' : ''}">${esc(l.condition)}</span>
    <p style="margin:14px 0 0">${esc(l.description || 'ผู้ขายยังไม่ได้ระบุสภาพสินค้า')}</p>
    <p style="color:var(--mute);font-size:13.5px">ผู้ขาย ${esc(l.seller)} · ส่งจาก ${esc(l.location || '—')}</p>
    ${u ? `<div class="note">ราคาอ้างอิงตลาดนอกสำหรับสภาพเดียวกัน ${u.text} จาก ${u.n} แหล่ง <button style="background:none;border:0;color:var(--gild);text-decoration:underline;cursor:pointer" data-quotes="${esc(l.code)}">ดูรายละเอียด</button></div>` : ''}
    <div class="note">ประกาศและผู้ขายในต้นแบบนี้เป็นตัวอย่าง ไม่มีการตัดเงินหรือส่งคำสั่งซื้อจริง</div>
    <button class="btn ghost full" data-report="${esc(l.id)}">แจ้งว่าประกาศนี้น่าสงสัย</button>`);
}

function reportForm(id){
  const l = state.listings.find(x => x.id === id);
  openDlg(`<h2>แจ้งตรวจสอบประกาศ</h2>
    <p style="color:var(--mute);margin:0">${l ? esc((modelBy(l.code) || l).name) : 'ประกาศทั่วไป'}</p>
    <label class="fldw">เหตุผล<select id="rp-why">
      <option>สงสัยว่าเป็นของปลอม</option><option>ใช้รูปของผู้อื่นหรือรูปโปรโมต</option>
      <option>เป็นเจ้าของสิทธิ์และขอให้นำออก</option><option>อื่น ๆ</option></select></label>
    <label class="fldw">รายละเอียด<textarea id="rp-note" rows="3" placeholder="อธิบายสั้น ๆ"></textarea></label>
    <label class="fldw">อีเมลติดต่อกลับ<input id="rp-mail" type="email" placeholder="you@example.com"></label>
    <div class="note">ในเวอร์ชันจริง คำแจ้งนี้จะเข้าคิวให้ตรวจสอบ และนำประกาศออกทันทีเมื่อยืนยันว่าผู้แจ้งเป็นเจ้าของสิทธิ์ ซึ่งเป็นเงื่อนไขของการได้รับยกเว้นความรับผิดตาม พ.ร.บ.ลิขสิทธิ์ (ฉบับที่ 5) พ.ศ. 2565</div>
    <button class="btn full" id="rp-send">ส่งคำแจ้ง</button>`);
  $('#rp-send').onclick = () => {
    const q = Store.get('reports', []);
    q.push({id, why:$('#rp-why').value, note:$('#rp-note').value, mail:$('#rp-mail').value, at:new Date().toISOString()});
    Store.set('reports', q); $('#dlg').close(); toast('บันทึกคำแจ้งไว้ในเครื่องแล้ว ' + q.length + ' รายการ');
  };
}

function renderMarket(){
  const q = $('#q').value.trim().toLowerCase();
  let list = state.listings.filter(l => {
    const m = modelBy(l.code) || l;
    if (state.filter === 'new' && l.condition !== 'ใหม่ / ซีล') return false;
    if (state.filter === 'used' && l.condition !== 'มือสอง') return false;
    if (state.filter !== 'all' && state.filter !== 'new' && state.filter !== 'used' && (m.brand || l.brand) !== state.filter) return false;
    return !q || ((m.name || '') + ' ' + (l.code || '') + ' ' + (m.brand || '')).toLowerCase().includes(q);
  });
  const sort = $('#sort').value;
  if (sort === 'asc') list.sort((a,b) => a.price - b.price);
  else if (sort === 'desc') list.sort((a,b) => b.price - a.price);

  $('#market-grid').innerHTML = list.length ? list.map(card).join('')
    : `<div class="empty" style="grid-column:1/-1"><h3>ไม่พบประกาศที่ตรงกับตัวกรอง</h3><p>ลองล้างคำค้นหรือเปลี่ยนตัวกรอง</p></div>`;

  const favs = state.listings.filter(l => state.favorites.has(l.id));
  $('#saved-grid').innerHTML = favs.length ? favs.map(card).join('')
    : `<div class="empty" style="grid-column:1/-1"><h3>ยังไม่มีรายการที่บันทึก</h3><p>กดหัวใจที่ประกาศเพื่อเก็บไว้ดูภายหลัง</p></div>`;
  $('#c-fav').textContent = state.favorites.size;

  $$('[data-detail]').forEach(el => el.onclick = () => showDetail(el.dataset.detail));
  $$('[data-fav]').forEach(el => el.onclick = () => {
    const id = el.dataset.fav;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    saveFav(); renderMarket();
  });
  $$('[data-quotes]').forEach(el => el.onclick = () => showQuotes(el.dataset.quotes));
}

/* ---------- delegated dialog actions ---------- */
$('#dlg').addEventListener('click', e => {
  const r = e.target.closest('[data-report]'); if (r) return reportForm(r.dataset.report);
  const qv = e.target.closest('[data-quotes]'); if (qv) return showQuotes(qv.dataset.quotes);
});

/* ---------- chrome ---------- */
function renderChips(){
  const brands = [...new Set(MODELS.map(m => m.brand))];
  const opts = [['all','ทั้งหมด'], ['new','ใหม่ / ซีล'], ['used','มือสอง'], ...brands.map(b => [b,b])];
  $('#chips').innerHTML = opts.map(([v,l]) =>
    `<button class="chip" data-f="${esc(v)}" aria-pressed="${state.filter === v}">${esc(l)}</button>`).join('');
  $$('[data-f]').forEach(el => el.onclick = () => { state.filter = el.dataset.f; renderChips(); renderAll() });
}
function setPane(p){
  state.pane = p;
  $$('.pane').forEach(el => el.classList.toggle('on', el.id === 'pane-' + p));
  $$('.nav button').forEach(el => el.classList.toggle('on', el.dataset.pane === p));
}
$$('.nav button').forEach(el => el.onclick = () => setPane(el.dataset.pane));
$('#q').oninput = renderAll;
$('#sort').onchange = renderAll;
$('#report-link').onclick = () => reportForm(null);

$('#sell-form').onsubmit = e => {
  e.preventDefault();
  const f = Object.fromEntries(new FormData(e.target));
  const l = {...f, id:'U' + Date.now(), price:Number(f.price), tag:'ประกาศใหม่'};
  state.listings = [l, ...state.listings];
  Store.set('listings', state.listings);
  e.target.reset(); setPane('market'); renderAll();
  toast('บันทึกประกาศแล้ว — เก็บไว้ในเบราว์เซอร์เครื่องนี้');
};

function renderAll(){ renderPrices(); renderMarket() }

/* ---------- boot ---------- */
(function init(){
  $('#t-models').textContent = MODELS.length;
  $('#t-quotes').textContent = MARKET_DATA.quotes.length;
  $('#t-when').textContent = new Date(MARKET_DATA.collectedAt).toLocaleDateString('th-TH', {day:'numeric', month:'short'});
  const hero = MODELS.find(m => MarketMath.summary(m.code,'used').n) || MODELS[0];
  const hs = MarketMath.summary(hero.code,'used');
  $('#hz-code').textContent = hero.code;
  $('#hz-name').textContent = hero.name;
  $('#hz-meta').textContent = `${hero.brand} · สเกล ${hero.scale}`;
  $('#hz-amt').innerHTML = hs.n ? `${fmtRange(hs.min, hs.max)}<small>มือสอง · ${hs.n} แหล่งอ้างอิง</small>` : '<small>ยังไม่มีราคาอ้างอิง</small>';
  renderChips(); renderAll();
})();
