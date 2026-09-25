/* ราคาอ้างอิงจากแหล่งภายนอก เก็บสแนปช็อต 2026-09-16 — ไม่ใช่ฟีดสด
   status: asking = ราคาตั้งขาย | sold_displayed = ประกาศระบุขายแล้ว | ended = ปิดประกาศ ไม่ยืนยันว่าขายได้
   evidence: page = เปิดหน้าจริง | index = เห็นจากผลค้นหา */
const MARKET_DATA = {
  collectedAt: '2026-09-16',
  fx: {date:'2026-09-15', source:'https://api.frankfurter.dev/v1/2026-09-15?base=USD&symbols=THB,JPY,EUR,CAD', thbPerUnit:{THB:1,USD:33.295,JPY:33.295/155,EUR:33.295/0.86663,CAD:33.295/1.392}},
  quotes: [
    {id:'ebay-185217981260',code:'MMS528D30',platform:'eBay',amount:399.99,currency:'USD',condition:'new',status:'asking',evidence:'page',url:'https://www.ebay.it/itm/185217981260',note:'สินค้าใหม่ในกล่อง • ไม่รวมค่าส่งที่เปลี่ยนตามปลายทาง',sourceAge:'หน้าเว็บในดัชนีประมาณ 1 สัปดาห์'},
    {id:'mercari-2JL6bD89wGEXuWFhAkfzGJ',code:'MMS528D30',platform:'Mercari JP',amount:70800,currency:'JPY',condition:'new',status:'asking',evidence:'index',url:'https://jp.mercari.com/shops/product/2JL6bD89wGEXuWFhAkfzGJ',note:'ร้านระบุใหม่ / ไม่ได้ใช้ • รวมส่งในญี่ปุ่น ไม่ใช่ส่งถึงไทย',sourceAge:'ดัชนีค้นหาประมาณ 1 สัปดาห์'},
    {id:'ebay-358083297102',code:'MMS542',platform:'eBay',amount:248.49,currency:'USD',condition:'used',status:'asking',evidence:'index',url:'https://www.ebay.com.au/itm/358083297102',note:'ผู้ขายระบุ Used / Very Good • เปิดรับข้อเสนอ',sourceAge:'ดัชนีค้นหาประมาณ 2 สัปดาห์'},
    {id:'mercari-m20199052301',code:'MMS542',platform:'Mercari US',amount:275,currency:'USD',condition:'new',status:'asking',evidence:'index',url:'https://www.mercari.com/us/item/m20199052301/',note:'ผู้ขายระบุยังไม่แกะ • ส่งในสหรัฐฯ $11.99 และค่าคุ้มครอง $10.33 เพิ่มเติม',sourceAge:'ดัชนีค้นหาประมาณ 1 สัปดาห์'},
    {id:'kijiji-1733590691',code:'MMS536',platform:'Kijiji CA',amount:250,currency:'CAD',condition:'used',status:'asking',evidence:'index',url:'https://www.kijiji.ca/v-toys-games/hamilton/hot-toys-mms536-avengers%3A-endgame-captain-america-figure/1733590691',note:'มือสองสภาพเหมือนใหม่ อุปกรณ์ครบ ตามผู้ขาย • ราคา CAD',sourceAge:'ดัชนีค้นหาประมาณ 4 วัน'},
    {id:'mercari-m42624426967',code:'MMS536',platform:'Mercari US',amount:300,currency:'USD',condition:'new',status:'asking',evidence:'index',url:'https://www.mercari.com/us/item/m42624426967/',note:'ใหม่ ซีล • ส่งในสหรัฐฯ $18.95 และค่าคุ้มครอง $11.48 เพิ่มเติม',sourceAge:'ดัชนีค้นหาประมาณ 1 เดือน'},
    {id:'mercari-m79246445691',code:'MMS536',platform:'Mercari US',amount:233.98,currency:'USD',condition:'used',status:'sold_displayed',evidence:'index',url:'https://www.mercari.com/us/item/m79246445691/',note:'ประกาศระบุขายแล้ว • เป็นราคาที่แสดง ไม่ยืนยันยอดต่อรองสุดท้าย • มีเดือยสำรอง 1 ชิ้น',sourceAge:'ดัชนีค้นหาประมาณ 2 เดือน'},
    {id:'ebay-397330117970',code:'MMS557',platform:'eBay',amount:180,currency:'USD',condition:'used',status:'asking',evidence:'page',url:'https://www.ebay.com/itm/397330117970',note:'ผู้ขายระบุอุปกรณ์ครบ ไม่มีความเสียหาย • ต้องสอบถามการส่งถึงไทย',sourceAge:'หน้าเว็บในดัชนีประมาณ 3 สัปดาห์'},
    {id:'kleinanzeigen-3470448539',code:'MMS557',platform:'Kleinanzeigen DE',amount:199,currency:'EUR',condition:'used',status:'asking',evidence:'index',url:'https://www.kleinanzeigen.de/s-anzeige/hot-toys-thor-mms557-avengers-endgame-1-6-ovp-shipper-komplett/3470448539-234-1253',note:'ผู้ขายระบุสภาพดีมาก อุปกรณ์และกล่องครบ • ค่าส่งท้องถิ่นเริ่ม €2.99',sourceAge:'ดัชนีค้นหาประมาณ 1 เดือน'},
    {id:'mercari-m84281311432',code:'MMS387',platform:'Mercari US',amount:147,currency:'USD',condition:'used',status:'asking',evidence:'index',url:'https://www.mercari.com/us/item/m84281311432/',note:'Like New / อุปกรณ์ครบตามคำบรรยาย • ค่าส่งในสหรัฐฯ $11.99 เพิ่มเติม',sourceAge:'ดัชนีค้นหาประมาณ 2 เดือน'},
    {id:'ebay-195778890493',code:'MMS387',platform:'eBay',amount:250,currency:'USD',condition:'used',status:'asking',evidence:'index',url:'https://www.ebay.com/itm/195778890493',note:'Used • เปิดรับข้อเสนอ • ค่าส่งในสหรัฐฯ $20.44 เพิ่มเติม',sourceAge:'ดัชนีค้นหาประมาณ 5 วัน'},
    {id:'ebay-206147092483',code:'MMS387',platform:'eBay',amount:152.98,currency:'USD',condition:'used',status:'ended',evidence:'index',url:'https://www.ebay.com/itm/206147092483',note:'สิ้นสุดประกาศ 4 ก.ค. 2026 • ไม่มีหลักฐานยืนยันว่าขายสำเร็จ',sourceAge:'ดัชนีค้นหาประมาณ 3 สัปดาห์'},
    {id:'mercari-2JL72pFeTC5twAyfCKgFi6',code:'MMS753',platform:'Mercari JP',amount:78800,currency:'JPY',condition:'new',status:'asking',evidence:'index',url:'https://jp.mercari.com/en/shops/product/2JL72pFeTC5twAyfCKgFi6',note:'Wolverine รุ่นมาตรฐาน MMS753 • ใหม่ • รวมส่งในญี่ปุ่น',sourceAge:'ดัชนีค้นหาประมาณ 1 เดือน'},
    {id:'ebay-267683157298',code:'MMS753',platform:'eBay',amount:339.99,currency:'USD',condition:'new',status:'ended',evidence:'page',url:'https://www.ebay.com/itm/267683157298',note:'ผู้ขายยุติประกาศ 6 ส.ค. 2026 เพราะสินค้าไม่พร้อมขาย • ไม่ใช่หลักฐานขายสำเร็จ',sourceAge:'หน้าเว็บในดัชนีประมาณ 1 เดือน'}
  ]
};
const MarketMath = {
  toBaht: q => q.amount * MARKET_DATA.fx.thbPerUnit[q.currency],
  rows: (code,condition='all',status='all') => MARKET_DATA.quotes.filter(q=>q.code===code&&(condition==='all'||q.condition===condition)&&(status==='all'||q.status===status)),
  summary(code,condition){const values=this.rows(code,condition,'asking').map(q=>this.toBaht(q)).sort((a,b)=>a-b);return {n:values.length,min:values[0]??null,max:values.at(-1)??null,median:values.length>=3?(values[Math.floor((values.length-1)/2)]+values[Math.ceil((values.length-1)/2)])/2:null}}
};
if(typeof module!=='undefined')module.exports={MARKET_DATA,MarketMath};
