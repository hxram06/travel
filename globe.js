/* The landing globe uses stored route geometry; waypoint-only plans are marked approximate. */
window.LandingGlobe = (() => {
  'use strict';
  const colors = ['#326c5a', '#b15070', '#735ca1', '#277c8b', '#bd704a', '#5572a0', '#a27d2a', '#315987'];
  let map = null, courses = [], openCourse, active = null, ready = false, mounted = false;
  const $ = id => document.getElementById(id);
  const escape = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const color = id => colors[(id - 1) % colors.length];
  const coordsValid = p => Array.isArray(p) && p.length === 2 && p.every(Number.isFinite);

  function setActive(id, point) {
    active = id == null ? null : Number(id);
    document.querySelectorAll('.atlas-panel .course-card').forEach(el => el.classList.toggle('is-active', Number(el.dataset.courseId) === active));
    const tip = $('globe-tooltip'), course = courses.find(c => c.id === active);
    if (!course) { tip.hidden = true; }
    else {
      const approximate = !course.experience ? ' · 일부 경로 개략선' : '';
      tip.innerHTML = `<span class="tip-label">JOURNEY ${String(course.id).padStart(2, '0')}</span><strong>${escape(course.nameKo)}</strong><small>${escape(course.period)} · ${escape(course.nights)}${approximate}</small><small>${escape((course.cities || []).join(' · '))}</small>`;
      tip.hidden = !point;
      if (point) { tip.style.left = Math.max(12, Math.min(point.x + 18, $('landing-globe').clientWidth - 300)) + 'px'; tip.style.top = Math.max(12, Math.min(point.y + 18, $('landing-globe').clientHeight - 140)) + 'px'; }
    }
    if (map && ready) courses.forEach(c => {
      if (map.getLayer(`atlas-route-${c.id}`)) {
        map.setPaintProperty(`atlas-route-${c.id}`, 'line-opacity', active === null ? .86 : c.id === active ? 1 : .23);
        map.setPaintProperty(`atlas-route-${c.id}`, 'line-width', c.id === active ? 4.5 : 2.5);
      }
    });
  }

  async function routeData(course) {
    let trip;
    if (course.experience === 'citytrip') trip = CITY_TRIPS[course.id];
    else if (course.experience === 'tokyo') trip = TOKYO;
    else trip = LegacyTrips.fromCourse(course);
    let routes = trip.inlineRoutes;
    if (!routes) {
      const response = await fetch(trip.routeAsset || 'assets/tokyo/routes.json?v=6');
      if (!response.ok) throw new Error('route data');
      routes = (await response.json()).routes;
    }
    const used = new Set(trip.days.flatMap(day => day.steps.filter(s => !s.branch).flatMap(s => s.legs || [])));
    const segments = [...used].filter(id => !['plane', 'flight'].includes(trip.legs[id]?.line) && !['plane', 'flight'].includes(trip.legs[id]?.mode)).map(id => routes[id]?.geometry?.coordinates).filter(line => Array.isArray(line) && line.length > 1 && line.every(coordsValid));
    return { segments, approximate: !!trip.inlineRoutes };
  }

  function mount(nextCourses, onOpen) {
    courses = nextCourses; openCourse = onOpen;
    if (mounted) { resize(); return; }
    mounted = true;
    if (typeof mapboxgl === 'undefined') { $('globe-status').textContent = '지도를 불러오지 못했어요. 목록에서 여행을 선택해 주세요.'; return; }
    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      map = new mapboxgl.Map({ container:'landing-globe', style:'mapbox://styles/mapbox/light-v11', projection:'globe', center:[59,47], zoom:1.3, attributionControl:false });
      map.addControl(new mapboxgl.AttributionControl({compact:true}), 'bottom-right');
      map.addControl(new mapboxgl.NavigationControl({showCompass:false}), 'bottom-right');
      map.on('load', async () => {
        ready = true;
        try { map.setFog({color:'#dbe9e3','high-color':'#bacfc8','horizon-blend':.08,'space-color':'#eaf1ee','star-intensity':0}); } catch (_) {}
        // Keep transport symbols consistent: no aircraft icons on the base map or routes.
        for (const layer of (map.getStyle?.()?.layers || [])) {
          if (layer.type === 'symbol' && /airport|aerodrome|airfield/i.test(layer.id)) map.setLayoutProperty(layer.id, 'visibility', 'none');
        }
        const loaded = await Promise.allSettled(courses.map(routeData));
        let missing = 0;
        const hitLayers = [];
        courses.forEach((course, index) => {
          const result = loaded[index];
          if (result.status !== 'fulfilled' || !result.value.segments.length) { missing++; return; }
          const source = `atlas-source-${course.id}`, layer = `atlas-route-${course.id}`, hit = `atlas-hit-${course.id}`;
          map.addSource(source, {type:'geojson',data:{type:'FeatureCollection',features:result.value.segments.map(coordinates => ({type:'Feature',properties:{},geometry:{type:'LineString',coordinates}}))}});
          map.addLayer({id:layer,type:'line',source,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':color(course.id),'line-width':2.5,'line-opacity':.86}});
          map.addLayer({id:hit,type:'line',source,layout:{'line-cap':'round','line-join':'round'},paint:{'line-color':color(course.id),'line-width':20,'line-opacity':.01}});
          hitLayers.push(hit);
        });
        const courseAt = point => {
          if (!hitLayers.length) return null;
          const feature = map.queryRenderedFeatures(point, { layers:hitLayers })[0];
          return feature ? courses.find(course => `atlas-hit-${course.id}` === feature.layer.id) : null;
        };
        map.on('mousemove', e => {
          const course = courseAt(e.point);
          map.getCanvas().style.cursor = course ? 'pointer' : '';
          setActive(course?.id ?? null, course ? e.point : null);
        });
        map.on('mouseout', () => { map.getCanvas().style.cursor=''; setActive(null); });
        map.on('click', e => { const course = courseAt(e.point); if (course) openCourse(course); });
        $('globe-status').textContent = missing ? '일부 경로를 불러오지 못했어요. 목록에서 모든 여행을 열 수 있어요.' : '';
        setActive(active);
      });
      map.on('error', () => { if (!ready) $('globe-status').textContent = '지도를 불러오지 못했어요. 목록에서 여행을 선택해 주세요.'; });
    } catch (_) { $('globe-status').textContent = '지도를 불러오지 못했어요. 목록에서 여행을 선택해 주세요.'; }
  }
  function resize() { if (map) requestAnimationFrame(() => map.resize()); }
  return { mount, setActive, resize, color };
})();
