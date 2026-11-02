const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
const dom = new JSDOM(html, { url:'http://localhost/?share=atlas27', runScripts:'dangerously' });
const { window } = dom;
window.matchMedia = () => ({ matches:false, addEventListener(){}, removeEventListener(){} });
window.structuredClone = structuredClone;
window.ResizeObserver = class { observe() {} disconnect() {} };
window.requestAnimationFrame = fn => fn();
window.fetch = async url => ({ ok:true, json:async()=>JSON.parse(fs.readFileSync(String(url).split('?')[0], 'utf8')) });
window.HTMLElement.prototype.scrollIntoView = function() {};
let globe;
class MapMock {
  constructor(options) { this.options=options; this.handlers={}; this.layers={}; this.sources={}; this.canvas={style:{}}; globe=this; setTimeout(()=>this.handlers.load(),0); }
  on(type, layer, callback) { if (typeof layer === 'function') this.handlers[type]=layer; else this.handlers[type+':'+layer]=callback; }
  addControl() {} setFog() {} resize() {} remove() {}
  addSource(id, source) { this.sources[id]=source; }
  addLayer(layer) { this.layers[layer.id]=layer; }
  getLayer(id) { return this.layers[id]; }
  setPaintProperty(id, name, value) { this.layers[id].paint[name]=value; }
  getCanvas() { return this.canvas; }
  queryRenderedFeatures() { return [{layer:{id:'atlas-hit-5'}}]; }
}
const markerElements=[];
class MarkerMock {
  constructor(options) { this.element=options.element; markerElements.push(this.element); }
  setLngLat() { return this; }
  addTo() { window.document.querySelector('#landing-globe').appendChild(this.element); return this; }
}
window.mapboxgl={Map:MapMock,Marker:MarkerMock,AttributionControl:class{},NavigationControl:class{}};
for(const file of ['photos-data.js','data.js','map.js','tokyo-data.js','citytrips-data.js','legacy-trips.js','tokyo-meals.js','tokyo-ui.js','globe.js','app.js']) {
  const script=window.document.createElement('script');script.textContent=fs.readFileSync(file,'utf8');window.document.body.appendChild(script);
}
setTimeout(()=>{
  try {
    assert.equal(globe.options.projection,'globe');
    assert.equal(globe.options.style,'mapbox://styles/mapbox/light-v11');
    assert.equal(window.document.querySelectorAll('.course-card-open').length,7);
    assert.equal(window.document.querySelectorAll('.course-menu-button').length,0);
    for(let i=1;i<=7;i++) {
      assert(globe.sources[`atlas-source-${i}`],`course ${i} route source`);
      assert(globe.sources[`atlas-source-${i}`].data.features.length,`course ${i} route geometry`);
      assert(globe.layers[`atlas-hit-${i}`],`course ${i} interactive route`);
      assert(!('line-dasharray' in globe.layers[`atlas-route-${i}`].paint),`course ${i} uses solid line`);
    }
    assert.equal(markerElements.length,7);
    assert.equal(markerElements[0].textContent,'1');
    markerElements[0].dispatchEvent(new window.Event('mouseenter'));
    assert(window.document.querySelector('#globe-tooltip').textContent.includes('독일 서부 - 뮌헨 - 빈'));
    globe.handlers.mousemove({point:{x:100,y:100}});
    assert(window.document.querySelector('#globe-tooltip').textContent.includes('크리스마스 스트라스부르 - 파리'));
    assert(window.document.querySelector('[data-course-id="5"]').classList.contains('is-active'));
    window.mapboxgl=undefined; // The itinerary has its own map; this test targets the landing globe.
    globe.handlers.click({point:{x:100,y:100}});
    assert(window.document.querySelector('.tokyo-trip'), 'route opens itinerary');
    console.log('PASS: seven globe routes, hover details, list highlight, click navigation');
    window.close();
  } catch(error) { console.error(error); process.exitCode=1; window.close(); }
},100);
