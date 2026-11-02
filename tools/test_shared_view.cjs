const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const html = fs.readFileSync('index.html', 'utf8').replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '');
const dom = new JSDOM(html, { url: 'http://localhost/?owner=a8f4k9x2m', runScripts: 'dangerously' });
const { window } = dom;
window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
window.structuredClone = structuredClone;
window.ResizeObserver = class { observe() {} disconnect() {} };
window.fetch = async url => ({ ok: true, json: async () => JSON.parse(fs.readFileSync(String(url).split('?')[0], 'utf8')) });
window.scrollTo = () => {};
window.HTMLElement.prototype.scrollIntoView = function () {};
for (const file of ['photos-data.js','data.js','map.js','tokyo-data.js','citytrips-data.js','legacy-trips.js','tokyo-meals.js','tokyo-ui.js','globe.js','app.js']) {
  const script = window.document.createElement('script');
  script.textContent = fs.readFileSync(file, 'utf8');
  window.document.body.appendChild(script);
}
const cards = [...window.document.querySelectorAll('.course-card-open')];
assert.equal(cards.length, 7);
cards.forEach((card, index) => {
  card.click();
  const root = window.document.querySelector('.tokyo-trip');
  assert(root, `course ${index + 1} opens shared view`);
  const state = window.TokyoTrip.getState();
  assert.equal(state.overview, index !== 1, `course ${index + 1} overview`);
  assert.equal(root.querySelectorAll('[data-day]').length, [13,5,10,9,12,11,8][index]);
  if ([0,5,6].includes(index)) assert(root.querySelector('[data-action="legacy"]'));
  root.querySelector('[data-action="next"]').click();
  assert.equal(window.TokyoTrip.getState().overview, false);
  root.querySelector('[data-action="close"]').click();
});
console.log('PASS: all seven courses open the common view and navigate');
window.close();
