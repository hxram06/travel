/* Refetch OSM rail relation geometry one relation at a time (the combined query 504s), then write
 * the cache in the shape build_tokyo_routes.py expects: {elements:[relation,...]} with out geom. */
const fs=require('node:fs');
const path=require('node:path');
const dest=path.resolve(__dirname,'../assets/tokyo/source/rail-geometry.json');
const ids=[443281,443282,443286,1972920,1972960,3120358,5326726,9474241];
const endpoints=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function fetchRel(id){
  const q=`[out:json][timeout:120];relation(id:${id});out geom;`;
  for(let attempt=0;attempt<6;attempt++){
    const ep=endpoints[attempt%endpoints.length];
    try{
      const res=await fetch(ep,{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded','User-Agent':'TokyoTripReference/1.0 (personal itinerary geometry audit)'},body:'data='+encodeURIComponent(q)});
      if(!res.ok){console.log(`  ${id} ${ep} HTTP ${res.status}`);await sleep(3000);continue;}
      const j=await res.json();
      const el=(j.elements||[]).find(e=>e.type==='relation'&&e.id===id);
      if(el&&el.members){console.log(`  ${id} ok (${el.members.length} members) via ${ep}`);return el;}
      console.log(`  ${id} empty via ${ep}`);await sleep(3000);
    }catch(e){console.log(`  ${id} ${ep} ${e.message}`);await sleep(3000);}
  }
  throw new Error('relation '+id+' unavailable');
}
(async()=>{
  const elements=[];
  for(const id of ids){console.log('fetch',id);elements.push(await fetchRel(id));await sleep(1500);}
  fs.writeFileSync(dest,JSON.stringify({version:0.6,elements},null,0),'utf8');
  console.log('Wrote',dest,'with',elements.length,'relations');
})().catch(e=>{console.error(e.message);process.exit(1);});
