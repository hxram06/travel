/* Post-process assets/tokyo/routes.json (no network): connect a rail line's drawn end to the
 * walk that continues from the same station. The rail geometry snaps to the track (tens of metres
 * off the station), while the walk snaps to the street entrance; that offset shows as a floating
 * gap. Where a rail leg and a walk leg share a station endpoint directly (no indoor leg between,
 * which would be a real station-interior move we never draw), extend the rail terminus to meet the
 * walk's entrance coordinate. Reverse legs are rebuilt from their originals so symmetry holds.
 * Provenance (source/license/checkedAt/distance) is preserved untouched.
 *   node tools/stitch_tokyo_routes.cjs        -> rewrite routes.json in place
 *   node tools/stitch_tokyo_routes.cjs --check -> report only, no write
 */
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const trip=require('../tokyo-data.js');
const file=path.join(root,'assets/tokyo/routes.json');
const doc=JSON.parse(fs.readFileSync(file,'utf8'));
const routes=doc.routes;
const d=(a,b)=>Math.hypot((a[0]-b[0])*90600,(a[1]-b[1])*111200);
const legsAt=place=>Object.values(trip.legs).filter(l=>l.from===place||l.to===place);
// A place is a stitch junction when a rail leg and a walk leg both terminate there directly.
const junctions=new Set();
for(const place of Object.keys(trip.places)){
  const at=legsAt(place);
  if(at.some(l=>l.mode==='rail')&&at.some(l=>l.mode==='walk'))junctions.add(place);
}
// The walk entrance coordinate at a junction (street-level start of the connecting walk).
function entrance(place){
  for(const l of legsAt(place)){
    if(l.mode!=='walk')continue;
    const g=routes[l.id]?.geometry?.coordinates;if(!g)continue;
    return l.from===place?g[0]:g[g.length-1];
  }
  return null;
}
const report=[];
for(const [id,leg] of Object.entries(trip.legs)){
  if(leg.mode!=='rail'||leg.reverseOf)continue;
  const geom=routes[id]?.geometry;if(!geom)continue;
  const coords=geom.coordinates;
  for(const end of ['from','to']){
    const place=leg[end];if(!junctions.has(place))continue;
    const target=entrance(place);if(!target)continue;
    const idx=end==='from'?0:coords.length-1;
    const gap=Math.round(d(coords[idx],target));
    if(gap<=5)continue;
    if(end==='from')coords.unshift([...target]);else coords.push([...target]);
    report.push(`${id} @${place} +${gap}m`);
  }
}
// Rebuild reverse legs from their (now stitched) originals.
for(const [id,leg] of Object.entries(trip.legs)){
  const original=leg.reverseOf;if(!original||!routes[original]||!routes[id])continue;
  routes[id].geometry={type:'LineString',coordinates:[...routes[original].geometry.coordinates].reverse()};
}
console.log('Junctions:',[...junctions].join(', '));
console.log('Stitched rail termini:\n  '+(report.join('\n  ')||'(none)'));
if(process.argv.includes('--check')){console.log('CHECK only, not written.');process.exit(0);}
// Compact separators, matching the generator's output.
fs.writeFileSync(file,JSON.stringify(doc),'utf8');
console.log('Wrote',path.relative(root,file));
