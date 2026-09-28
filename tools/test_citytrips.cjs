/* Contract and browser checks for courses 12–14. Run server on port 8011 for --browser. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const trips=require('../citytrips-data.js');
const root=path.resolve(__dirname,'..');
for(const [courseId,trip] of Object.entries(trips)){
  const routes=JSON.parse(fs.readFileSync(path.join(root,'assets/citytrips/routes-'+courseId+'.json'),'utf8')).routes;
  assert(trip.days.length>=9,courseId+' full arrival-to-departure plan');
  assert.equal(trip.startOverview,true,courseId+' opens on full route');
  assert(trip.overviewPlaces.length>=4,courseId+' overview labels');
  assert.equal(trip.days[0].date,'입국일');
  assert.equal(trip.days.at(-1).date,'출국일');
  const ids=new Set();
  for(const day of trip.days)for(const step of day.steps){
    assert(!ids.has(step.id),courseId+' duplicate '+step.id);ids.add(step.id);
    assert(trip.places[step.place],courseId+' missing place '+step.place);
    let previous;
    for(const legId of step.legs||[]){
      const leg=trip.legs[legId];assert(leg,courseId+' missing leg '+legId);
      if(previous)assert.equal(previous.to,leg.from,courseId+' disconnected '+step.id+' '+legId);
      const route=routes[legId];assert(route,courseId+' missing route '+legId);
      assert(route.geometry.coordinates.length>=3,courseId+' short geometry '+legId);
      previous=leg;
    }
  }
  for(const [legId,leg] of Object.entries(trip.legs)){
    assert(routes[legId],courseId+' unused route missing '+legId);
    if(leg.reverseOf)assert.deepEqual(routes[legId].geometry.coordinates,[...routes[leg.reverseOf].geometry.coordinates].reverse());
  }
  console.log('PASS',courseId,trip.days.length+' days',ids.size+' steps',Object.keys(routes).length+' routes');
}

async function browserCheck(){
  const {default:puppeteer}=await import('puppeteer');
  const browser=await puppeteer.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',args:['--no-sandbox','--enable-unsafe-swiftshader']});
  try{
    const tokens={12:'munich27',13:'north27',14:'paris27'};
    for(const [courseId,token] of Object.entries(tokens)){
      const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
      await page.setViewport({width:390,height:844,isMobile:true,hasTouch:true,deviceScaleFactor:1});
      await page.goto('http://127.0.0.1:8011/?share='+token,{waitUntil:'domcontentloaded'});
      await page.waitForSelector('.tokyo-trip');
      const expected=Object.keys(trips[courseId].legs).length;
      await page.waitForFunction(n=>window.TokyoTrip.getState().routeCount===n,{timeout:30000},expected);
      await page.waitForFunction(()=>window.TokyoTrip.getState().mapReady,{timeout:60000});
      await page.waitForFunction(()=>document.querySelector('.tk-map-caption').textContent.includes('전체 코스'),{timeout:10000});
      assert.equal((await page.evaluate(()=>window.TokyoTrip.getState())).overview,true);
      assert(await page.$eval('.tk-map-caption',el=>el.textContent.includes('전체 코스')));
      assert.equal(await page.$$eval('.tk-pin-overview',els=>els.length),trips[courseId].overviewPlaces.length);
      const tabs=await page.$$eval('.tk-tabs [data-day]',els=>els.length);assert.equal(tabs,trips[courseId].days.length);
      await page.click('[data-action="next"]');
      const first=await page.evaluate(()=>window.TokyoTrip.getState());assert.equal(first.overview,false);assert.equal(first.day,0);assert.equal(first.step,0);
      await page.click(`.tk-tabs [data-day="${tabs-1}"]`);
      assert.equal((await page.evaluate(()=>window.TokyoTrip.getState())).day,tabs-1);
      assert(!await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),courseId+' mobile overflow');
      assert.equal(errors.length,0,courseId+' runtime errors '+errors.join('; '));
      await page.close();
      console.log('PASS browser',courseId,expected+' routes',tabs+' tabs');
    }
  } finally {await browser.close();}
}
if(process.argv.includes('--browser'))browserCheck().catch(error=>{console.error(error);process.exit(1);});
