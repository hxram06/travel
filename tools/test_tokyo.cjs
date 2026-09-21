/* Contract and browser checks for the isolated Tokyo experience.
 * node tools/test_tokyo.cjs                 -> data/route contracts
 * node tools/test_tokyo.cjs --browser       -> mobile + desktop interaction QA
 * Run the local server on 8011 first. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const crypto=require('node:crypto');
const root=path.resolve(__dirname,'..');
const trip=require('../tokyo-data.js');
const meals=require('../tokyo-meals.js');
const courses=require('../data.js').COURSES;
const routes=JSON.parse(fs.readFileSync(path.join(root,'assets/tokyo/routes.json'),'utf8')).routes;
const baseline='1b5ad5aded919defeb9f26299d6567f8a86431dd7cefeaecb1bb455cbbee9678';
assert.equal(crypto.createHash('sha256').update(JSON.stringify(courses.filter(c=>c.id!==11))).digest('hex'),baseline,'Other courses must be unchanged');
assert.equal(courses.filter(c=>c.id===11).length,1);
assert.equal(trip.days.length,5);
const ids=new Set();
for(const day of trip.days)for(const step of day.steps){
  assert(!ids.has(step.id),'Unique step id');ids.add(step.id);
  assert(trip.places[step.place],step.id+' destination');
  if(step.photo)assert(trip.photos[step.photo],step.id+' hero');
  if(step.meal)assert.equal((meals[step.id]||meals[step.meal]).length,8,step.id+' has eight candidates');
  let previous;
  for(const id of step.legs||[]){
    const leg=trip.legs[id];assert(leg,id);
    if(previous)assert.equal(previous.to,leg.from,step.id+' disconnected leg '+id);
    previous=leg;
  }
}
for(const [id,leg] of Object.entries(trip.legs)){
  if(leg.mode==='indoor'){assert(!routes[id],id+' no invented indoor geometry');continue;}
  const r=routes[id];assert(r,id+' geometry missing');
  assert.equal(r.geometry.type,'LineString');
  assert(r.geometry.coordinates.length>2,id+' must not be a straight fallback');
  assert(r.source&&r.sourceUrl&&r.checkedAt,id+' provenance');
  assert(r.distance>0);
  for(const p of r.geometry.coordinates)assert(p[0]>139&&p[0]<141&&p[1]>35&&p[1]<37,id+' Tokyo region');
  if(leg.reverseOf)assert.deepEqual(r.geometry.coordinates,[...routes[leg.reverseOf].geometry.coordinates].reverse());
}
assert(trip.legs['tamachi-shibuya'].direction.startsWith('외선'));
assert(trip.legs['shibuya-tamachi'].direction.startsWith('내선'));
assert(trip.legs['tokyo-transfer'].duration.includes('15~20'));
assert.equal(trip.days[2].steps.find(s=>s.id==='sky').reservation.target,'16:00');
assert(!trip.days[4].steps.some(s=>s.legs?.length),'Day 5 stays unconfirmed');
for(const list of Object.values(meals))for(const item of list){
  if(item.rating)assert(item.ratingSource&&item.checkedAt,'Every rating needs evidence');
}
console.log('PASS: legacy course checksum, five days, '+ids.size+' steps, '+Object.keys(routes).length+' actual routes, meal/booking/branch contracts.');

async function browserCheck(){
 const {default:puppeteer}=await import('puppeteer');
 const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--enable-unsafe-swiftshader']});
 try {
 const dir=path.join(root,'outputs/tokyo-qa');fs.mkdirSync(dir,{recursive:true});
 const page=await browser.newPage(),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:1});
 await page.goto('http://127.0.0.1:8011/?share=tokyo27',{waitUntil:'domcontentloaded'});
 await page.waitForSelector('.tokyo-trip');
 await page.waitForFunction(()=>window.TokyoTrip.getState().routeCount===54,{timeout:20000});
 await page.waitForFunction(()=>window.TokyoTrip.getState().mapReady,{timeout:60000});
 if(process.argv.includes('--photo-only')) {
   await page.evaluate(()=>{window.TokyoTrip.select(2,0);window.TokyoTrip.select(2,window.TokyoTrip.getState().steps.indexOf('harajuku'));});
   await page.waitForFunction(()=>{const img=document.querySelector('.tk-hero img');return img&&img.complete&&img.naturalWidth>0;},{timeout:25000});
   await page.screenshot({path:path.join(dir,'photo-harajuku.png')});
   console.log('PASS: corrected Harakado exterior photo loads.');return;
 }
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 const state=()=>page.evaluate(()=>window.TokyoTrip.getState());
 const select=async(day,id)=>{
   await page.evaluate((d)=>window.TokyoTrip.select(d,0),day);
   const s=await state();await page.evaluate((args)=>window.TokyoTrip.select(...args),[day,s.steps.indexOf(id)]);
   await wait(800);
 };
 const split=await page.evaluate(()=>{
   const m=document.querySelector('.tk-map-pane').getBoundingClientRect(),s=document.querySelector('.tk-sheet').getBoundingClientRect();
   return {map:m.height,sheet:s.height,overflow:document.documentElement.scrollWidth>innerWidth};
 });
 assert(Math.abs(split.map-split.sheet)<=1,'50:50 mobile split');assert(!split.overflow);
 await page.screenshot({path:path.join(dir,'01-arrival-mobile.png')});
 await page.click('[data-action=next]');assert.equal((await state()).stepId,'airport-ueno');
 await wait(1000);await page.screenshot({path:path.join(dir,'02-skyliner-mobile.png')});
 await page.click('[data-day="2"]');assert.equal((await state()).step,0);
 await select(2,'sky');await page.screenshot({path:path.join(dir,'03-sky-mobile.png')});
 const grip=await page.$('.tk-grip');
 await grip.focus();await page.keyboard.press('ArrowUp');await wait(400);
 assert.equal((await state()).sheet,'detail','Grip up expands the current stop');
 // 'detail' fits its content and never covers the whole stage.
 const heights=await page.evaluate(()=>({sheet:document.querySelector('.tk-sheet').getBoundingClientRect().height,stage:document.querySelector('.tk-stage').clientHeight}));
 assert(heights.sheet>heights.stage*0.5&&heights.sheet<=heights.stage*0.9+1,'detail height fits content, not full screen');
 await page.screenshot({path:path.join(dir,'04-day-detail-mobile.png')});
 await page.keyboard.press('ArrowDown');await wait(400);
 assert.equal((await state()).expanded,false,'Grip down returns to 50:50');
 await wait(200);
 // A physical upward/downward touch on the drag handle uses the same state machine.
 const cdp=await page.createCDPSession();
 async function swipe(fromY,toY){
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:195,y:fromY}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:195,y:toY}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
   await wait(400);
 }
 let box=await (await page.$('.tk-grip')).boundingBox();await swipe(box.y+15,box.y-100);assert((await state()).expanded);
 box=await (await page.$('.tk-grip')).boundingBox();await swipe(box.y+15,box.y+120);assert(!(await state()).expanded);
 await select(2,'shibuya-dinner');
 assert.equal(await page.$$eval('.tk-restaurant',x=>x.length),8);
 await page.screenshot({path:path.join(dir,'05-meal-mobile.png')});
 await page.click('[data-action=next]');assert.equal(await page.$$eval('.tk-restaurant',x=>x.length),0);
 await select(2,'tower-choice');assert(!(await state()).steps.includes('tower'));
 await page.click('[data-choice="tower"][data-value="true"]');assert((await state()).steps.includes('tower'));
 await page.click('[data-action=next]');assert.equal((await state()).stepId,'tower-out');
 await select(3,'breakfast-choice');await page.click('[data-breakfast="shinjuku"]');
 await page.click('[data-action=next]');assert.equal((await state()).stepId,'shinjuku-out');
 await select(3,'bus-choice');await page.click('[data-choice="bus"][data-value="true"]');await page.click('[data-action=next]');
 assert.equal((await state()).stepId,'bus-stop');
 await select(1,'disney-out');assert(await page.$eval('.tk-detail',e=>e.textContent.includes('15~20')));
 await page.screenshot({path:path.join(dir,'06-disney-transfer-mobile.png')});
 await select(0,'arrival');await page.evaluate(()=>{for(let i=0;i<7;i++)document.querySelector('[data-action=next]').click();});assert.equal((await state()).stepId,'ueno-home');
 await select(4,'airport-return');assert(await page.$eval('[data-action=next]',e=>e.disabled));
 await page.screenshot({path:path.join(dir,'07-pending-return-mobile.png')});
 for(const [day,id] of [[0,'ueno-walk'],[1,'disney-day'],[2,'harajuku'],[3,'shinjuku']]) {
   await select(day,id);
   await page.waitForFunction(()=>{const img=document.querySelector('.tk-hero img');return img&&img.complete&&img.naturalWidth>0;},{timeout:25000});
   await page.screenshot({path:path.join(dir,'photo-'+id+'.png')});
 }
 await page.setViewport({width:320,height:568,isMobile:true,hasTouch:true});
 await select(3,'ginza-out');
 assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),'Small phone fits');
 await page.screenshot({path:path.join(dir,'09-small-phone.png')});
 await page.setViewport({width:1440,height:1000,isMobile:false,hasTouch:false});
 await select(2,'sky');await page.screenshot({path:path.join(dir,'08-sky-desktop.png')});
 assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth));
 await page.goto('http://127.0.0.1:8011/',{waitUntil:'domcontentloaded'});await page.waitForSelector('.course-card');
 assert.equal(await page.$$eval('.course-card',x=>x.length),11,'Token-free local landing');
 await page.click('[aria-label="도쿄 4박 5일 일정 열기"]');await page.waitForSelector('.tokyo-trip');
 await page.click('.tk-close');assert.equal(await page.$('.tokyo-trip'),null);
 // Loss of route data must show an explicit retry, never a straight-line replacement.
 const failure=await browser.newPage();
 await failure.setViewport({width:390,height:844,isMobile:true,hasTouch:true});
 await failure.setRequestInterception(true);
 failure.on('request',r=>r.url().includes('assets/tokyo/routes.json')?r.abort():r.continue());
 await failure.goto('http://127.0.0.1:8011/?share=tokyo27',{waitUntil:'domcontentloaded'});
 await failure.waitForSelector('[data-action=retry]');
 await failure.waitForFunction(()=>window.TokyoTrip.getState().mapReady,{timeout:45000});
 assert.equal(await failure.evaluate(()=>window.TokyoTrip.getState().routeCount),0);
 assert(await failure.$eval('.tk-map-status',e=>e.textContent.includes('이동선을 불러오지 못했어요')));
 await failure.click('[data-action=next]');
 assert.equal(await failure.evaluate(()=>window.TokyoTrip.getState().stepId),'airport-ueno');
 await failure.close();
 assert.equal(errors.length,0,'Runtime errors: '+errors.join('; '));
 console.log('PASS: map loaded, mobile split/gestures/tabs/next/rapid navigation, optional branches, contextual meals, desktop, local/share and close. Screenshots: '+dir);
 } finally { await browser.close(); }
}
if(process.argv.includes('--browser'))browserCheck().catch(e=>{console.error(e);process.exit(1);});
