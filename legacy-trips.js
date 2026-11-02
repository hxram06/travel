/* Convert the established Europe itineraries into the shared map-and-card view.
 * Their original route data consists of waypoints, not surveyed rail geometry.
 * The generated lines are therefore explicitly presented as approximate. */
const LegacyTrips = (() => {
  'use strict';

  function fromCourse(course) {
    const places = {}, legs = {}, routes = {}, photos = {}, days = [], overviewPlaces = [];
    const lines = {
      rail: { name: '이동 · 경유점 기준 개략선', badge: '이동', color: '#647e72' },
      walk: { name: '도보 · 위치 기준 개략선', badge: '도보', color: '#879c8c' },
      plane: { name: '항공 · 개략선', badge: '항공', color: '#638aae' },
    };
    let previous = null, serial = 0;
    const valid = c => Array.isArray(c) && c.length === 2 && c.every(Number.isFinite);
    const addPlace = (name, coords) => {
      const id = `place-${++serial}`;
      places[id] = { name: name || '일정 위치', coords: valid(coords) ? coords : [0, 0] };
      return id;
    };
    const addRoute = (from, to, mode, via, label) => {
      // Keep flight details in the itinerary, but never draw the international flight.
      if (mode === 'plane' || mode === 'flight') return null;
      if (!from || !to || !valid(places[from].coords) || !valid(places[to].coords)) return null;
      const a = places[from].coords, b = places[to].coords;
      if (a[0] === b[0] && a[1] === b[1]) return null;
      const id = `route-${++serial}`;
      const line = mode === 'plane' ? 'plane' : mode === 'walk' ? 'walk' : 'rail';
      const anchors = [a, ...(Array.isArray(via) ? via.filter(valid) : []), b];
      const coords = [];
      for (let i = 0; i < anchors.length - 1; i++) {
        if (!i) coords.push(anchors[i]);
        coords.push([(anchors[i][0] + anchors[i + 1][0]) / 2, (anchors[i][1] + anchors[i + 1][1]) / 2], anchors[i + 1]);
      }
      legs[id] = { id, from, to, mode: line === 'walk' ? 'walk' : 'rail', line, duration: '', note: `${label || '이동'} · 실제 선로·도로와 다를 수 있어요.` };
      routes[id] = { geometry: { type: 'LineString', coordinates: coords } };
      return id;
    };
    const addStep = (daySteps, name, detail, coords, options = {}) => {
      const place = addPlace(name, coords);
      const leg = options.move ? addRoute(previous, place, options.mode, options.via, options.transport) : null;
      const id = `step-${++serial}`;
      const step = { id, kind: options.kind || 'visit', title: name, place, time: options.time || '자유롭게', detail: detail || '현장 상황과 컨디션에 맞춰 둘러봐요.' };
      if (leg) step.legs = [leg];
      if (options.facts?.length) step.facts = options.facts;
      const photo = options.photo;
      if (photo && typeof PHOTOS !== 'undefined' && PHOTOS[photo.spot]) {
        photos[id] = PHOTOS[photo.spot]; step.photo = id;
      }
      daySteps.push(step);
      previous = place;
      return place;
    };
    const matchingPhoto = (list, coord) => (list || []).find(p => valid(p.at) && valid(coord) && Math.hypot((p.at[0] - coord[0]) * 75, (p.at[1] - coord[1]) * 111) < 0.2);
    course.days.forEach((day, index) => {
      const steps = [];
      const date = (day.title || '').match(/\b\d{1,2}\/\d{1,2}/)?.[0] || `${index + 1}일차`;
      if (day.timeline?.length) {
        day.timeline.forEach(item => {
          const coords = valid(item.at) ? item.at : (previous ? places[previous].coords : day.coords);
          addStep(steps, item.title, item.detail, coords, { time: item.time, kind: item.kind, move: !!previous && valid(item.at), mode: item.mode, via: item.via, transport: item.detail, photo: matchingPhoto(day.photos, coords) });
        });
      } else {
        if (day.entryAirport && valid(day.entryAirport.coords)) {
          const e = day.entryAirport;
          addStep(steps, e.title || e.cityKo, [e.am, e.pm, e.ev, e.tip].filter(Boolean).join('\n\n'), e.coords, { time: '입국', kind: 'arrival', move: !!previous, mode: 'plane', transport: e.transport?.label });
        }
        (day.before || []).forEach(stop => {
          addStep(steps, stop.title || stop.cityKo, [stop.am, stop.pm, stop.ev, stop.tip].filter(Boolean).join('\n\n'), stop.coords, { move: !!previous, mode: stop.transport?.mode, via: stop.via, transport: stop.transport?.label, photo: matchingPhoto(stop.photos, stop.coords) });
        });
        const main = addStep(steps, day.title || day.cityKo, day.transport?.label || `${day.cityKo}에서 하루를 시작해요.`, day.coords, { time: '이동 및 도착', move: !!previous, mode: day.transport?.mode, via: day.via, transport: day.transport?.label, photo: matchingPhoto(day.photos, day.coords) });
        for (const [time, text] of [['오전', day.am], ['오후', day.pm], ['저녁', day.ev]]) {
          if (text) addStep(steps, `${day.cityKo} · ${time}`, text, day.coords, { time });
        }
        if (day.tip) steps[steps.length - 1].facts = [day.tip];
        if (day.isTrip && valid(day.baseCoords)) {
          addStep(steps, `${day.baseCity}로 돌아가기`, day.returnTransport?.label || `${day.cityKo}에서 ${day.baseCity} 숙소로 돌아가요.`, day.baseCoords, { time: '당일치기 귀환', move: true, mode: day.returnTransport?.mode || day.transport?.mode, via: (day.via || []).slice().reverse() });
        } else previous = main;
      }
      if (!steps.length) addStep(steps, day.title || day.cityKo, day.tip, day.coords);
      const anchor = steps.find(s => valid(places[s.place].coords));
      if (anchor && !overviewPlaces.some(id => places[id].name === day.cityKo)) {
        const coord = valid(day.coords) ? day.coords : places[anchor.place].coords;
        overviewPlaces.push(addPlace(day.cityKo, coord));
      }
      days.push({ date, title: day.title || day.cityKo, subtitle: day.transport?.label || '', steps });
    });
    return {
      version: 1, startOverview: true, routeNote: '표시된 이동선은 기존 경유점으로 연결한 개략선이에요. 실제 선로·도로 및 시간표는 예약할 때 확인해요.',
      meta: { name: course.nameKo, period: `${course.period} · ${course.nights}` },
      center: course.days[0]?.coords, zoom: 5, places, legs, lines, photos, days, overviewPlaces, inlineRoutes: routes,
    };
  }
  return { fromCourse };
})();
if (typeof module !== 'undefined') module.exports = LegacyTrips;
