const assert = require('node:assert/strict');
const trip = require('../nyc-data.js');
assert.equal(trip.days.length, 10);
assert.deepEqual(trip.days.map(day => day.date), ['2/11','2/12','2/13','2/14','2/15','2/16','2/17','2/18','2/19','2/20']);
for (const day of trip.days) for (const step of day.steps) {
  assert(trip.places[step.place], `${step.id}: missing place`);
  for (const id of step.legs || []) {
    const leg = trip.legs[id];
    assert(leg && trip.places[leg.from] && trip.places[leg.to], `${id}: missing leg or endpoint`);
    assert(trip.inlineRoutes[id].geometry.coordinates.length >= 3, `${id}: missing geometry`);
  }
}
assert(trip.days[0].steps.some(s => s.detail.includes('YP131') || s.title.includes('YP131')));
assert(trip.days[7].steps.some(s => s.detail.includes('23:15') || s.time.includes('23:15')));
assert(trip.days[9].steps.some(s => s.time.includes('04:55')));
assert(!Object.values(trip.legs).some(leg => leg.line === 'plane' || leg.mode === 'plane'));
const legacy = require('../legacy-trips.js');
const course = require('../data.js').COURSES[0];
const oldTrip = legacy.fromCourse(course);
assert(!Object.values(oldTrip.legs).some(leg => leg.line === 'plane'), 'legacy flight routes must not be generated');
assert(oldTrip.days[0].steps.some(step => step.title.includes('KE945')), 'flight details remain visible');
console.log('PASS: New York dates, routes, and legacy flight-line regression');
