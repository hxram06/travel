const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/index.html', 'utf8');

const dom = new JSDOM(html, {
  url: 'http://localhost/',
  runScripts: 'dangerously',
  resources: 'usable'
});

dom.window.onerror = function(msg, url, lineNo, columnNo, error) {
  console.log('JSDOM Error:', msg);
  if (error) console.log(error.stack);
  return false;
};

// Instead of letting jsdom load the scripts via <script src="..."> which might fail due to path issues or CORS,
// we will inject them directly.
const dataJs = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/data.js', 'utf8');
const photosDataJs = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/photos-data.js', 'utf8');
const appJs = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/app.js', 'utf8');
const mapJs = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/map.js', 'utf8');

// Mock Mapbox
dom.window.mapboxgl = {
  Map: class { on() {} },
  Marker: class { setLngLat() { return this; } addTo() { return this; } },
  Popup: class { setHTML() { return this; } setLngLat() { return this; } },
};

dom.window.eval(dataJs);
dom.window.eval(photosDataJs);
dom.window.eval(mapJs);

try {
  dom.window.eval(appJs);
  console.log('app.js executed successfully without errors.');
} catch (e) {
  console.error('app.js execution failed:', e);
}
