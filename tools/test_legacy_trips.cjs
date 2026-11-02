const assert = require('node:assert/strict');
const { COURSES } = require('../data.js');
const { fromCourse } = require('../legacy-trips.js');

for (const id of [1, 6, 7]) {
  const source = COURSES.find(course => course.id === id);
  const trip = fromCourse(source);
  assert.equal(trip.days.length, source.days.length);
  assert.equal(trip.meta.name, source.nameKo);
  assert.equal(trip.startOverview, true);
  assert.match(trip.routeNote, /개략선/);
  source.days.forEach((day, i) => {
    assert(trip.days[i].steps.length > 0);
    if (day.timeline) {
      assert.deepEqual(trip.days[i].steps.map(step => step.title), day.timeline.map(item => item.title));
    } else {
      for (const text of [day.am, day.pm, day.ev].filter(Boolean)) {
        assert(trip.days[i].steps.some(step => step.detail === text));
      }
      if (day.isTrip) assert(trip.days[i].steps.some(step => step.title.includes('돌아가기')));
    }
    for (const step of trip.days[i].steps) {
      assert(trip.places[step.place], step.id);
      for (const leg of step.legs || []) {
        assert(trip.legs[leg] && trip.inlineRoutes[leg]);
        assert(trip.inlineRoutes[leg].geometry.coordinates.length >= 3);
      }
    }
  });
  console.log(`PASS course ${id}: ${trip.days.length} days, ${Object.keys(trip.legs).length} approximate routes`);
}
