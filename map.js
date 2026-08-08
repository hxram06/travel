// ============================================================
// map.js — Mapbox 초기화 + 이동 애니메이션
//
// ⚠️ 시작 전 설정 필요:
// 1. Mapbox 토큰: https://account.mapbox.com/ 에서 무료 토큰 발급
// 2. 아래 MAPBOX_TOKEN 을 발급받은 토큰으로 교체
// 3. 로컬 서버로 실행 (VS Code Live Server 또는 python -m http.server 8000)
// 4. 브라우저에서 http://localhost:8000 접속
//
// 이동 방식
//   plane            — 대권(great circle) 곡선을 따라 비행기 아이콘이 이동
//   train/bus/ferry  — data.js의 via 경유지를 따라 지상/해상 경로로 이동
//   walk / stay      — 이동 없음
// ============================================================

const MAPBOX_TOKEN = 'pk.eyJ1IjoiaHhyYW0wNiIsImEiOiJjbXJ0NGhuZmgwbGp1MnlwcDc4MzF6ZjB4In0.uWCnzYPH_vgKgMTLGIorUQ';

const VEHICLE_ICON = {
  plane: '✈️', train: '🚆', bus: '🚌', ferry: '⛴️', walk: '🚶', car: '🚗',
  tram: '🚋', subway: '🚇', funicular: '🚞', cablecar: '🚡', stay: '📍',
};

const TravelMap = (() => {
  let map = null;
  let mapReady = false;
  let cityMarker = null;
  let vehicleMarker = null;
  let photoMarkers = [];
  let poiMarkers = [];
  let lodgingMarker = null;
  let travelledLegs = [];     // 지금까지 이동한 경로들 (좌표 배열의 배열)
  let animating = false;
  let cancelFlag = false;

  const TRAIL_SRC = 'trail-src';
  const TRAIL_LAYER = 'trail-layer';
  const ACTIVE_SRC = 'active-src';
  const ACTIVE_LAYER = 'active-layer';
  const CONTEXT_SRC = 'course-context-src';
  const CONTEXT_LAYER = 'course-context-layer';
  const TODAY_SRC = 'course-today-src';
  const TODAY_LAYER = 'course-today-layer';
  const DONE_SRC = 'course-done-src';
  const DONE_LAYER = 'course-done-layer';

  // ---------- 토큰 ----------
  function hasValidToken() {
    return MAPBOX_TOKEN && MAPBOX_TOKEN.startsWith('pk.') &&
      !MAPBOX_TOKEN.includes('YOUR_MAPBOX_TOKEN_HERE');
  }

  function showMapError(title, message) {
    const box = document.getElementById('map-error');
    if (!box) return;
    const heading = box.querySelector('h2');
    const body = box.querySelector('p');
    if (heading) heading.textContent = title;
    if (body) body.textContent = message;
    box.classList.remove('hidden');
  }

  // ---------- 초기화 ----------
  function init() {
    if (!hasValidToken()) {
      showMapError(
        'Mapbox 토큰이 필요합니다',
        '지도를 표시하려면 무료 Mapbox 토큰이 필요합니다. map.js 상단의 MAPBOX_TOKEN을 발급받은 토큰으로 교체한 뒤 페이지를 새로고침하세요.'
      );
      return false;
    }
    if (typeof mapboxgl === 'undefined') {
      showMapError(
        '지도를 불러오지 못했습니다',
        'Mapbox 스크립트가 로드되지 않았습니다. 네트워크 연결 또는 브라우저 차단 설정을 확인하세요.'
      );
      return false;
    }
    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      window.map = map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v11',
        projection: { name: 'globe' },
        center: [10, 48],
        zoom: 3.4,
      });
    } catch (error) {
      console.warn('Mapbox initialization failed:', error);
      showMapError(
        '지도를 초기화하지 못했습니다',
        '브라우저에서 WebGL을 사용할 수 없거나 지도 렌더링이 차단되었습니다. 다른 브라우저 또는 하드웨어 가속 설정을 확인하세요.'
      );
      return false;
    }

    map.on('style.load', () => {
      map.setFog({
        color: 'rgb(232, 240, 250)',
        'high-color': 'rgb(190, 215, 240)',
        'horizon-blend': 0.12,
        'space-color': 'rgb(214, 231, 245)',
        'star-intensity': 0,
      });
      ensureLayers();
      mapReady = true;
    });

    map.on('error', (e) => {
      const status = e && e.error && e.error.status;
      if (status === 401 || status === 403) {
        showMapError(
          'Mapbox 토큰을 확인하세요',
          '현재 Mapbox 토큰으로 지도를 불러오지 못했습니다. 토큰 권한과 사용량 제한을 확인한 뒤 페이지를 새로고침하세요.'
        );
      }
    });
    return true;
  }

  function isReady() { return map !== null && mapReady; }
  function isAnimating() { return animating; }

  // ---------- 경로 레이어 ----------
  function emptyFC() { return { type: 'FeatureCollection', features: [] }; }

  function ensureLayers() {
    if (!map.getSource(CONTEXT_SRC)) {
      map.addSource(CONTEXT_SRC, { type: 'geojson', data: emptyFC() });
      map.addLayer({
        id: CONTEXT_LAYER, type: 'line', source: CONTEXT_SRC,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#94a3b8', 'line-width': 2.2, 'line-opacity': 0.48 },
      });
    }
    if (!map.getSource(TODAY_SRC)) {
      map.addSource(TODAY_SRC, { type: 'geojson', data: emptyFC() });
      map.addLayer({
        id: TODAY_LAYER, type: 'line', source: TODAY_SRC,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#67c8f2', 'line-width': 4.2, 'line-opacity': 0.9 },
      });
    }
    if (!map.getSource(DONE_SRC)) {
      map.addSource(DONE_SRC, { type: 'geojson', data: emptyFC() });
      map.addLayer({
        id: DONE_LAYER, type: 'line', source: DONE_SRC,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#1769d2', 'line-width': 4.4, 'line-opacity': 0.96 },
      });
    }
    if (!map.getSource(TRAIL_SRC)) {
      map.addSource(TRAIL_SRC, { type: 'geojson', data: emptyFC() });
      map.addLayer({
        id: TRAIL_LAYER, type: 'line', source: TRAIL_SRC,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: {
          'line-color': '#2563eb',
          'line-opacity': 0.42,
          'line-width': 2,
          'line-dasharray': [2, 2],
        },
      });
    }
    if (!map.getSource(ACTIVE_SRC)) {
      map.addSource(ACTIVE_SRC, { type: 'geojson', data: emptyFC() });
      map.addLayer({
        id: ACTIVE_LAYER, type: 'line', source: ACTIVE_SRC,
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#2563eb', 'line-width': 3.2, 'line-opacity': 0.95 },
      });
    }
  }

  function setData(srcId, coordsList) {
    if (!isReady()) return;
    ensureLayers();
    const src = map.getSource(srcId);
    if (!src) return;
    src.setData({
      type: 'FeatureCollection',
      features: coordsList.filter((c) => c.length > 1).map((c) => ({
        type: 'Feature', properties: {},
        geometry: { type: 'LineString', coordinates: c },
      })),
    });
  }

  function redrawTrail() { setData(TRAIL_SRC, travelledLegs); }
  function setActive(coords) { setData(ACTIVE_SRC, coords ? [coords] : []); }

  function clearCourseRoutes() {
    setData(CONTEXT_SRC, []);
    setData(TODAY_SRC, []);
    setData(DONE_SRC, []);
  }

  // ---------- 경로 생성 ----------

  // 대권 경로 (비행): 두 지점 사이를 구면 보간해 자연스러운 곡선을 만든다
  function greatCircle(from, to, steps) {
    const rad = Math.PI / 180, deg = 180 / Math.PI;
    const [lon1, lat1] = [from[0] * rad, from[1] * rad];
    const [lon2, lat2] = [to[0] * rad, to[1] * rad];
    const d = 2 * Math.asin(Math.sqrt(
      Math.pow(Math.sin((lat1 - lat2) / 2), 2) +
      Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin((lon1 - lon2) / 2), 2)
    ));
    if (!d || !isFinite(d)) return [from, to];
    const pts = [];
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const A = Math.sin((1 - f) * d) / Math.sin(d);
      const B = Math.sin(f * d) / Math.sin(d);
      const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
      const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
      const z = A * Math.sin(lat1) + B * Math.sin(lat2);
      pts.push([Math.atan2(y, x) * deg, Math.atan2(z, Math.sqrt(x * x + y * y)) * deg]);
    }
    return pts;
  }

  // 지상 경로: 출발지 → via 경유지들 → 목적지를 부드럽게 잇는다
  function groundPath(from, via, to) {
    const anchors = [from, ...(via || []), to];
    const pts = [];
    for (let i = 0; i < anchors.length - 1; i++) {
      const seg = greatCircle(anchors[i], anchors[i + 1], 18);
      pts.push(...(i === 0 ? seg : seg.slice(1)));
    }
    return pts;
  }

  function buildPath(from, to, day, mode) {
    if (mode === 'plane') {
      // 경유지(via)가 있으면 각 구간을 별도 대권 곡선으로 이어 실제 항로처럼 꺾어 그린다
      const waypoints = (day && day.via) || [];
      if (waypoints.length > 0) {
        const anchors = [from, ...waypoints, to];
        const pts = [];
        for (let i = 0; i < anchors.length - 1; i++) {
          const seg = greatCircle(anchors[i], anchors[i + 1], 60);
          pts.push(...(i === 0 ? seg : seg.slice(1)));
        }
        return pts;
      }
      return greatCircle(from, to, 96);
    }
    return groundPath(from, (day && day.via) || [], to);
  }

  // 코스9 전용: 날짜별 타임라인 좌표를 미리 경로로 바꾼다.
  function buildCourseRoute(course) {
    if (!course || course.id !== 9) return [];
    const segments = [];
    course.days.forEach((day, dayIndex) => {
      const timeline = Array.isArray(day.timeline) ? day.timeline : [];
      for (let itemIndex = 1; itemIndex < timeline.length; itemIndex++) {
        const fromItem = timeline[itemIndex - 1];
        const toItem = timeline[itemIndex];
        if (!Array.isArray(fromItem.at) || !Array.isArray(toItem.at)) continue;
        const mode = toItem.mode || 'walk';
        const same = fromItem.at[0] === toItem.at[0] && fromItem.at[1] === toItem.at[1];
        if (same) continue;
        segments.push({
          dayIndex,
          toIndex: itemIndex,
          mode,
          long: Boolean(toItem.long),
          from: fromItem.at,
          to: toItem.at,
          path: buildPath(fromItem.at, toItem.at, { via: toItem.via || [] }, mode),
        });
      }
    });
    return segments;
  }

  function renderCourseRoutes(course, currentDayIndex, stepIndex) {
    if (!course || course.id !== 9) return;
    const context = [];
    const today = [];
    const done = [];
    buildCourseRoute(course).forEach((segment) => {
      if (segment.dayIndex === currentDayIndex) {
        (segment.toIndex <= stepIndex ? done : today).push(segment.path);
      } else if (segment.long) {
        (segment.dayIndex < currentDayIndex ? done : context).push(segment.path);
      }
    });
    setData(CONTEXT_SRC, context);
    setData(TODAY_SRC, today);
    setData(DONE_SRC, done);
  }

  function allRouteCoords(course, dayIndex, wholeCourse) {
    const segments = buildCourseRoute(course).filter((segment) =>
      wholeCourse || segment.dayIndex === dayIndex
    );
    const coords = segments.flatMap((segment) => segment.path);
    if (!wholeCourse) {
      (course.days[dayIndex].photos || []).forEach((photo) => {
        if (Array.isArray(photo.at)) coords.push(photo.at);
      });
    }
    return coords;
  }

  // 경로 위 진행률(0~1)에 해당하는 좌표
  function pointAt(path, t) {
    if (path.length < 2) return path[0];
    const x = Math.min(Math.max(t, 0), 1) * (path.length - 1);
    const i = Math.floor(x);
    if (i >= path.length - 1) return path[path.length - 1];
    const f = x - i;
    const a = path[i], b = path[i + 1];
    return [a[0] + (b[0] - a[0]) * f, a[1] + (b[1] - a[1]) * f];
  }

  // ---------- 마커 ----------
  function placeCityMarker(coords) {
    if (!isReady()) return;
    if (!cityMarker) {
      const el = document.createElement('div');
      el.className = 'city-marker';
      el.setAttribute('aria-label', '현재 일정 위치');
      cityMarker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coords).addTo(map);
    } else {
      cityMarker.setLngLat(coords);
    }
  }

  function showVehicle(mode, coords) {
    if (!isReady()) return;
    if (!vehicleMarker) {
      const el = document.createElement('div');
      el.className = 'vehicle-marker';
      el.setAttribute('aria-label', '이동 중');
      vehicleMarker = new mapboxgl.Marker({ element: el, anchor: 'center' })
        .setLngLat(coords).addTo(map);
    }
    vehicleMarker.getElement().textContent = VEHICLE_ICON[mode] || '➡️';
    vehicleMarker.setLngLat(coords);
    vehicleMarker.getElement().style.display = '';
  }

  function hideVehicle() {
    if (vehicleMarker) vehicleMarker.getElement().style.display = 'none';
  }

  function buildPhotoPopupHtml(p, meta) {
    return (
      '<div class="photo-popup">' +
      '<div class="photo-popup-media"><img src="' + meta.url + '" alt="" onload="if(this.naturalWidth/this.naturalHeight > 1.25) this.closest(\'.photo-popup\').classList.add(\'wide-layout\')" /></div>' +
      '<div class="photo-popup-body">' +
      '<div class="photo-popup-cap">' + p.cap + '</div>' +
      (p.desc ? '<div class="photo-popup-desc">' + p.desc + '</div>' : '') +
      '<a class="photo-popup-credit" href="' + meta.source + '" target="_blank" rel="noopener">' +
      '📷 ' + meta.credit + '</a>' +
      '</div>' +
      '</div>'
    );
  }

  function createPhotoPopup(html, coords, anchor) {
    const options = {
      offset: 22,
      maxWidth: '470px',
      className: 'photo-popup-wrap',
      focusAfterOpen: false,
      closeOnClick: true,
      anchor,
    };
    return new mapboxgl.Popup(options).setHTML(html).setLngLat(coords);
  }

  function getPopupElement(popup) {
    return popup && typeof popup.getElement === 'function'
      ? popup.getElement()
      : document.querySelector('.photo-popup-wrap');
  }

  function attachMobilePhotoCloseHandler(popup) {
    const restorePanel = () => {
      setMobilePhotoPopupState(false);
      if (window.expandMobilePanelAfterPhoto) window.expandMobilePanelAfterPhoto();
    };

    // Mapbox의 closeOnClick은 DOM click 이벤트 없이 팝업을 닫을 수 있다.
    // close 이벤트에도 연결해 지도 빈 공간을 눌렀을 때 설명창을 복원한다.
    if (popup && typeof popup.on === 'function' && !popup._mobileCloseHandlerAttached) {
      popup._mobileCloseHandlerAttached = true;
      popup.on('close', restorePanel);
    }

    window.setTimeout(() => {
      const popupEl = getPopupElement(popup);
      const close = popupEl && popupEl.querySelector('.mapboxgl-popup-close-button');
      if (close) {
        close.setAttribute('aria-label', '사진 설명 닫기');
        close.setAttribute('title', '사진 설명 닫기');
        close.addEventListener('click', restorePanel, { once: true });
      }
    }, 0);
  }

  function setMobilePhotoPopupState(isOpen) {
    if (window.setMobilePhotoPopupState) {
      window.setMobilePhotoPopupState(isOpen);
    } else {
      window.__mobilePhotoPopupOpen = Boolean(isOpen);
    }
  }

  function mobilePopupHasRoomBelow(popupEl) {
    if (!popupEl) return true;
    const minPanelHeight = window.getMobilePanelMinVisibleHeight
      ? window.getMobilePanelMinVisibleHeight()
      : 90;
    const bottomLimit = window.innerHeight - minPanelHeight - 12;
    return popupEl.getBoundingClientRect().bottom <= bottomLimit;
  }

  function settleMobilePhotoPopup(marker, popup) {
    window.requestAnimationFrame(() => {
      let activePopup = popup;
      let popupEl = getPopupElement(activePopup);

      // 모바일은 먼저 마커 아래쪽(anchor: top)을 시도한다.
      // 패널을 최대로 내려도 공간이 부족할 때만 마커 위쪽으로 돌린다.
      if (!mobilePopupHasRoomBelow(popupEl)) {
        activePopup.remove();
        activePopup = createPhotoPopup(marker._photoPopupHtml, marker._photoCoords, 'bottom');
        marker._photoPopup = activePopup;
        activePopup.addTo(map);
        popupEl = getPopupElement(activePopup);
      } else if (window.makeRoomForMobilePhotoPopup) {
        window.makeRoomForMobilePhotoPopup(popupEl);
      }

      attachMobilePhotoCloseHandler(activePopup);
    });
  }

  // 그날의 사진들을 지도 위 마커로 표시 (클릭하면 팝업)
  function showPhotos(day) {
    clearPhotos();
    if (!isReady()) return;
    let validIndex = 0;
    (day.photos || []).forEach((p) => {
      const meta = PHOTOS[p.spot];
      if (!meta) return;
      const el = document.createElement('div');
      el.className = 'photo-marker';
      el.style.backgroundImage = 'url("' + meta.url + '")';
      el.title = p.cap;
      el.setAttribute('role', 'button');
      el.setAttribute('aria-label', p.cap || '여행 사진');
      el.tabIndex = 0;

      const popupHtml = buildPhotoPopupHtml(day.routeReady ? { ...p, desc: '' } : p, meta);
      const popup = createPhotoPopup(popupHtml, p.at, 'bottom');

      // 마커와 별개로 팝업에도 좌표를 지정해야 한다.
      // (marker.setPopup을 쓰지 않으므로 Mapbox가 대신 넣어주지 않는다)

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(p.at).addTo(map);
      marker._photoPopup = popup;
      marker._photoPopupHtml = popupHtml;
      marker._photoCoords = p.at;
      marker._photoIndex = validIndex++;
      marker._photoData = p;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openPhotoPopup(marker, popup);
      });
      el.addEventListener('keydown', (ev) => {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        ev.preventDefault();
        openPhotoPopup(marker, popup);
      });

      photoMarkers.push(marker);
    });
    showPois(day);
    showLodging(day);
  }

  function distanceKm(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) return Infinity;
    const rad = Math.PI / 180;
    const dLat = (b[1] - a[1]) * rad;
    const dLng = (b[0] - a[0]) * rad;
    const lat1 = a[1] * rad;
    const lat2 = b[1] * rad;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
  }

  function highlightPhotoForStep(item) {
    photoMarkers.forEach((marker) => marker.getElement().classList.remove('photo-marker-highlighted'));
    if (!item || !Array.isArray(item.at) || !photoMarkers.length) return null;
    const direct = item.photoSpot
      ? photoMarkers.find((marker) => marker._photoData && marker._photoData.spot === item.photoSpot)
      : null;
    const closest = direct || photoMarkers.reduce((best, marker) => {
      const distance = distanceKm(item.at, marker._photoCoords);
      return !best || distance < best.distance ? { marker, distance } : best;
    }, null)?.marker;
    if (!closest) return null;
    closest.getElement().classList.add('photo-marker-highlighted');
    return closest;
  }

  function clearPhotos() {
    setMobilePhotoPopupState(false);
    photoMarkers.forEach((m) => m.remove());
    photoMarkers = [];
    poiMarkers.forEach((m) => m.remove());
    poiMarkers = [];
    if (lodgingMarker) lodgingMarker.remove();
    lodgingMarker = null;
  }

  function buildPoiPopupHtml(poi, meta) {
    const badge = poi.priority === 'must' ? '필수' : '후보';
    return (
      '<div class="poi-popup">' +
      (meta ? '<img class="poi-popup-img" src="' + meta.url + '" alt="">' : '') +
      '<div class="poi-popup-badge">' + badge + '</div>' +
      '<div class="poi-popup-name">' + poi.name + '</div>' +
      (poi.note ? '<div class="poi-popup-note">' + poi.note + '</div>' : '') +
      (meta && meta.source ? '<a class="poi-popup-credit" href="' + meta.source + '" target="_blank" rel="noopener">사진 출처</a>' : '') +
      '</div>'
    );
  }

  function showPois(day) {
    if (!isReady() || !Array.isArray(day.pois)) return;
    day.pois.forEach((poi) => {
      if (!poi || !Array.isArray(poi.coords)) return;
      const meta = poi.photoSpot ? PHOTOS[poi.photoSpot] : null;
      const el = document.createElement(meta ? 'div' : 'button');
      if (!meta) el.type = 'button';
      const classes = meta
        ? ['photo-marker', 'poi-photo-marker', `poi-photo-marker-${poi.kind || 'place'}`]
        : ['poi-marker', `poi-marker-${poi.kind || 'place'}`];
      if (poi.priority === 'must') classes.push(meta ? 'poi-photo-marker-must' : 'poi-marker-must');
      el.className = classes.join(' ');
      if (meta) {
        el.setAttribute('role', 'button');
        el.tabIndex = 0;
      }
      el.setAttribute('aria-label', poi.name);
      el.title = poi.name;
      const poiIcon = {
        beer: '🍺',
        coffee: '☕',
        food: '🍽',
        korean: '🍲',
        wine: '🍷',
      }[poi.kind] || '📍';
      if (meta) {
        el.style.backgroundImage = 'url("' + meta.url + '")';
      } else {
        el.textContent = poiIcon;
      }

      const popup = new mapboxgl.Popup({
        offset: 18,
        maxWidth: '280px',
        className: 'poi-popup-wrap',
        focusAfterOpen: false,
        closeOnClick: true,
      }).setHTML(buildPoiPopupHtml(poi, meta)).setLngLat(poi.coords);

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(poi.coords).addTo(map);

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        popup.addTo(map);
      });
      el.addEventListener('keydown', (ev) => {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        ev.preventDefault();
        popup.addTo(map);
      });

      poiMarkers.push(marker);
    });
  }

  function buildLodgingPopupHtml(lodging) {
    return (
      '<div class="lodging-popup">' +
      '<div class="lodging-popup-badge">숙소</div>' +
      '<div class="lodging-popup-name">' + lodging.name + '</div>' +
      (lodging.note ? '<div class="lodging-popup-note">' + lodging.note + '</div>' : '') +
      '</div>'
    );
  }

  function showLodging(day) {
    const lodging = day && day.lodging;
    if (!isReady() || !lodging || !Array.isArray(lodging.coords)) return;

    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'lodging-marker';
    el.setAttribute('aria-label', lodging.name);
    el.title = lodging.name;
    el.textContent = '★';

    const popup = new mapboxgl.Popup({
      offset: 18,
      maxWidth: '260px',
      className: 'lodging-popup-wrap',
      focusAfterOpen: false,
      closeOnClick: true,
    }).setHTML(buildLodgingPopupHtml(lodging)).setLngLat(lodging.coords);

    lodgingMarker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(lodging.coords).addTo(map);

    el.addEventListener('click', (ev) => {
      ev.stopPropagation();
      popup.addTo(map);
    });
  }

  /**
   * 사진 팝업을 연다.
   *
   * 데스크톱은 기존처럼 마커를 보기 좋은 위치로 옮긴다.
   * 모바일은 지도 중심을 유지하고, 먼저 마커 아래쪽 팝업을 시도한 뒤
   * 공간이 부족할 때만 위쪽 팝업으로 돌린다.
   */
  function openPhotoPopup(marker, popup) {
    const isMobile = window.innerWidth <= 767;
    popup = marker._photoPopup || popup;
    // 이미 열려있는 다른 팝업 닫기
    photoMarkers.forEach((m) => {
      if (m !== marker && m._photoPopup && m._photoPopup.isOpen()) m._photoPopup.remove();
    });
    if (popup.isOpen()) {
      popup.remove();
      if (isMobile && window.expandMobilePanelAfterPhoto) {
        setMobilePhotoPopupState(false);
        window.expandMobilePanelAfterPhoto();
      }
      return;
    }
    if (isMobile) {
      if (window.collapseMobilePanelForPhoto) {
        window.collapseMobilePanelForPhoto();
      }
      setMobilePhotoPopupState(true);
      const mobilePopup = createPhotoPopup(marker._photoPopupHtml, marker._photoCoords, 'top');
      marker._photoPopup = mobilePopup;
      mobilePopup.addTo(map);

      if (typeof marker._photoIndex === 'number') {
        const el = document.getElementById(`photo-list-item-${marker._photoIndex}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }

      settleMobilePhotoPopup(marker, mobilePopup);
      return;
    }

    popup.addTo(map);

    // 하단 패널 리스트로 자동 스크롤 연동
    if (typeof marker._photoIndex === 'number') {
      const el = document.getElementById(`photo-list-item-${marker._photoIndex}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }    const h = map.getContainer().getBoundingClientRect().height;
    // 지도가 낮으면(모바일) 팝업이 쓸 수 있는 공간이 적으니 마커를 더 아래로 보낸다
    const targetRatio = h < 520 ? 0.94 : 0.8;
        // easeTo의 offset은 '지정한 좌표를 화면 중앙에서 얼마나 밀어놓을지'를 뜻한다
    const offsetY = (targetRatio - 0.5) * h;
    const panel = document.getElementById('panel');
    let offsetX = 0;
    if (!isMobile && panel && !panel.classList.contains('closed')) {
      offsetX = -(panel.getBoundingClientRect().width / 2);
    }

    map.easeTo({
      center: marker.getLngLat(),
      offset: [offsetX, offsetY],
      duration: 450,
    });
  }

  // ---------- 유틸 ----------
  function getDynamicPadding(basePadding) {
    const isMobile = window.innerWidth <= 767;
    const panel = document.getElementById('panel');
    let pWidth = 0;
    let pHeight = 0;
    // 패널이 화면에 존재하고 숨김 상태가 아닐 때 크기 계산
    if (panel && !panel.classList.contains('closed') && panel.style.transform !== 'translateX(100%)' && panel.style.transform !== 'translateY(100%)') {
      const rect = panel.getBoundingClientRect();
      pWidth = rect.width;
      pHeight = rect.height;
    }
    
    // 설명창이 화면에 보일 경우 마커/경로가 가려지지 않도록 패딩 추가
    if (isMobile) {
      // 바텀시트
      const visibleHeight = panel
        ? Math.max(0, Math.min(window.innerHeight, panel.getBoundingClientRect().bottom) - Math.max(0, panel.getBoundingClientRect().top))
        : 0;
      return { top: basePadding, bottom: Math.max(basePadding, visibleHeight + basePadding), left: basePadding, right: basePadding };
    } else {
      // 우측 패널
      return { top: basePadding, bottom: basePadding, left: basePadding, right: Math.max(basePadding, pWidth + 20) };
    }
  }

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }

  // 백그라운드 탭에서는 rAF가 멈춰 moveend가 오지 않는다.
  // duration이 지나면 강제로 진행시켜 UI가 잠기는 것을 막는다.
  function onceMoveEnd(duration) {
    return new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        clearTimeout(timer);
        map.off('moveend', finish);
        resolve();
      };
      const timer = setTimeout(finish, duration + 900);
      map.once('moveend', finish);
    });
  }

  // 경로 전체가 보이도록 화면을 맞춘다
  async function fitPath(path, padding, duration) {
    const b = path.reduce(
      (acc, c) => acc.extend(c),
      new mapboxgl.LngLatBounds(path[0], path[0])
    );
    const moveDuration = duration || 1100;
    map.fitBounds(b, { padding: getDynamicPadding(padding || 90), duration: moveDuration });
    await onceMoveEnd(moveDuration);
  }

  async function fitCoordinates(coords, padding, duration) {
    const valid = (coords || []).filter((coord) => Array.isArray(coord) && coord.length >= 2);
    if (!valid.length || !isReady()) return;
    if (valid.length === 1) {
      const moveDuration = duration || 700;
      map.easeTo({ center: valid[0], zoom: 13, duration: moveDuration, padding: getDynamicPadding(0) });
      await onceMoveEnd(moveDuration);
      return;
    }
    await fitPath(valid, padding || 76, duration || 900);
  }

  // ---------- 이동 애니메이션 ----------
  /**
   * 경로를 따라 이동 아이콘을 실제로 움직인다.
   * 진행에 따라 지나온 구간이 선으로 그려지고, 카메라가 아이콘을 따라간다.
   */
  function travel(path, mode, duration) {
    return new Promise((resolve) => {
      const start = performance.now();
      const follow = mode === 'plane' ? 0 : 1;  // 지상 이동은 카메라가 따라감
      showVehicle(mode, path[0]);

      // 타이머 기반 보정 — 탭이 백그라운드로 가도 멈추지 않게 한다
      const guard = setTimeout(() => finish(), duration + 1500);

      function finish() {
        clearTimeout(guard);
        setActive(path);
        showVehicle(mode, path[path.length - 1]);
        resolve();
      }

      function frame(now) {
        if (cancelFlag) return finish();
        const t = Math.min((now - start) / duration, 1);
        // ease-in-out — 출발과 도착을 부드럽게
        const e = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        const idx = Math.max(1, Math.round(e * (path.length - 1)));

        setActive(path.slice(0, idx + 1));
        const pos = pointAt(path, e);
        showVehicle(mode, pos);
        if (follow) map.panTo(pos, { duration: 90, easing: (x) => x, padding: getDynamicPadding(0) });

        if (t < 1) requestAnimationFrame(frame);
        else finish();
      }
      requestAnimationFrame(frame);
    });
  }

  /**
   * 한 구간(leg)을 이동한다.
   * 비행이면 지구본이 보이도록 줌아웃 → 곡선 비행 → 도착지 줌인.
   * 지상이면 경로 전체를 화면에 맞춘 뒤 아이콘이 경유지를 따라간다.
   */
  async function moveLeg(from, to, day, mode, opts) {
    const o = opts || {};
    const path = buildPath(from, to, day, mode);
    const speed = Math.max(1, Number(o.speed) || 1);
    const scaled = (duration) => Math.max(90, Math.round(duration / speed));

    if (mode === 'plane') {
      map.easeTo({ zoom: o.outZoom || 2.2, duration: scaled(1100), padding: getDynamicPadding(0) });
      await onceMoveEnd(scaled(1100));
      if (cancelFlag) return;
      await fitPath(path, 120, scaled(1100));
      if (cancelFlag) return;
      await travel(path, mode, scaled(o.duration || 3200));
      if (cancelFlag) return;
      map.easeTo({ center: to, zoom: o.inZoom || 9.5, duration: scaled(1500), padding: getDynamicPadding(0) });
      await onceMoveEnd(scaled(1500));
    } else {
      await fitPath(path, 100, scaled(1100));
      if (cancelFlag) return;
      await travel(path, mode, scaled(o.duration || 2600));
      if (cancelFlag) return;
      map.easeTo({ center: to, zoom: o.inZoom || 10.5, duration: scaled(1200), padding: getDynamicPadding(0) });
      await onceMoveEnd(scaled(1200));
    }

    travelledLegs.push(path);
    redrawTrail();
    setActive(null);
    hideVehicle();
    placeCityMarker(to);
  }

  async function showDayOverview(course, dayIndex, stepIndex) {
    if (!isReady() || !course || course.id !== 9) return;
    const day = course.days[dayIndex];
    if (!day) return;
    cancelFlag = true;
    setActive(null);
    hideVehicle();
    showPhotos(day);
    renderCourseRoutes(course, dayIndex, Number.isInteger(stepIndex) ? stepIndex : -1);
    const coords = allRouteCoords(course, dayIndex, false);
    await fitCoordinates(coords.length ? coords : [day.coords], 72, 900);
    const first = day.timeline && day.timeline[0];
    if (first && Array.isArray(first.at)) placeCityMarker(first.at);
  }

  async function showCourseOverview(course, dayIndex, stepIndex) {
    if (!isReady() || !course || course.id !== 9) return;
    const day = course.days[dayIndex];
    if (!day) return;
    cancelFlag = true;
    setActive(null);
    hideVehicle();
    showPhotos(day);
    renderCourseRoutes(course, dayIndex, Number.isInteger(stepIndex) ? stepIndex : -1);
    // 첫 전체 조망은 유럽 구간에 집중한다. 인천 왕복은 해당 날짜에서 따로 확인한다.
    const europe = allRouteCoords(course, dayIndex, true)
      .filter((coord) => coord[0] > -20 && coord[0] < 40 && coord[1] > 30 && coord[1] < 65);
    await fitCoordinates(europe, 82, 1050);
  }

  async function playTimelineStep(course, dayIndex, fromIndex, targetIndex) {
    if (!isReady() || animating || !course || course.id !== 9) return false;
    const day = course.days[dayIndex];
    const timeline = day && day.timeline;
    if (!Array.isArray(timeline) || !timeline[targetIndex]) return false;
    const target = timeline[targetIndex];
    animating = true;
    cancelFlag = false;

    try {
      const currentIndex = Number.isInteger(fromIndex) ? fromIndex : -1;
      if (targetIndex > currentIndex) {
        const start = Math.max(1, currentIndex + 1);
        for (let index = start; index <= targetIndex; index++) {
          if (cancelFlag) return false;
          const fromItem = timeline[index - 1];
          const toItem = timeline[index];
          if (!fromItem || !Array.isArray(fromItem.at) || !Array.isArray(toItem.at)) continue;
          const same = fromItem.at[0] === toItem.at[0] && fromItem.at[1] === toItem.at[1];
          if (!same) {
            const mode = toItem.mode || 'walk';
            const path = buildPath(fromItem.at, toItem.at, { via: toItem.via || [] }, mode);
            await fitPath(path, 78, mode === 'plane' ? 900 : 520);
            if (cancelFlag) return false;
            await travel(path, mode, mode === 'plane' ? 1700 : (toItem.long ? 1250 : 820));
            setActive(null);
            hideVehicle();
          }
          renderCourseRoutes(course, dayIndex, index);
          placeCityMarker(toItem.at);
        }
      } else if (targetIndex < currentIndex && timeline[currentIndex] &&
          Array.isArray(timeline[currentIndex].at) && Array.isArray(target.at)) {
        const fromItem = timeline[currentIndex];
        const same = fromItem.at[0] === target.at[0] && fromItem.at[1] === target.at[1];
        if (!same) {
          const mode = target.mode || 'walk';
          const path = buildPath(fromItem.at, target.at, { via: (target.via || []).slice().reverse() }, mode);
          await fitPath(path, 78, 520);
          if (cancelFlag) return false;
          await travel(path, mode, target.long ? 1250 : 820);
          setActive(null);
          hideVehicle();
        }
        renderCourseRoutes(course, dayIndex, targetIndex);
        placeCityMarker(target.at);
      } else {
        renderCourseRoutes(course, dayIndex, targetIndex);
        placeCityMarker(target.at);
      }

      highlightPhotoForStep(target);
      if (target.overviewAfter) {
        const europe = allRouteCoords(course, dayIndex, true)
          .filter((coord) => coord[0] > -20 && coord[0] < 40 && coord[1] > 30 && coord[1] < 65);
        await fitCoordinates(europe, 82, 1050);
      } else if (Array.isArray(target.at)) {
        const localModes = ['walk', 'tram', 'subway', 'funicular', 'cablecar', 'stay'];
        const zoom = localModes.includes(target.mode) ? 14.2 : (target.long ? 8.2 : 11.5);
        const moveDuration = 620;
        map.easeTo({ center: target.at, zoom, duration: moveDuration, padding: getDynamicPadding(0) });
        await onceMoveEnd(moveDuration);
      }
      return true;
    } finally {
      setActive(null);
      hideVehicle();
      animating = false;
    }
  }

  // ---------- 공개 API ----------

  /**
   * 날짜 이동.
   * @param prevDay 직전에 보던 day (없으면 코스 첫 진입)
   * @param day 이동할 day
   * @param goingForward > 버튼이면 true
   */
  async function goToDay(prevDay, day, goingForward, opts) {
    if (!isReady() || animating) return;
    const o = opts || {};
    const speed = Math.max(1, Number(o.speed) || 1);
    const scaled = (duration) => Math.max(90, Math.round(duration / speed));
    animating = true;
    cancelFlag = false;
    clearPhotos();

    try {
      let from = prevDay ? prevDay.coords : day.coords;

      const same = from[0] === day.coords[0] && from[1] === day.coords[1];
      const routeVia = Array.isArray(o.routeVia) ? o.routeVia : null;
      const transitDay = routeVia
        ? { ...day, via: routeVia, transport: prevDay && (prevDay.transport || day.transport) }
        : prevDay && Array.isArray(prevDay.nextVia)
          ? { ...day, via: prevDay.nextVia, transport: prevDay.nextTransport || prevDay.transport || day.transport }
          : day;
      const mode = (transitDay.transport && transitDay.transport.mode) || 'train';

      if (same) {
        // 같은 도시에 머무는 날
        if (day.via && day.via.length >= 2) {
          // via 경유지가 있으면 숙소→관광지 일일 동선을 지도 위에 그린다
          const vFrom  = day.via[0];
          const vTo    = day.via[day.via.length - 1];
          const vInner = day.via.slice(1, -1);
          const intraCityPath = groundPath(vFrom, vInner, vTo);
          await fitPath(intraCityPath, 80, scaled(1100));
          if (goingForward) await travel(intraCityPath, 'walk', scaled(2400));
          if (cancelFlag) return;
          travelledLegs.push(intraCityPath);
          redrawTrail();
          setActive(null);
          hideVehicle();
          placeCityMarker(vFrom);
          map.easeTo({ center: day.coords, zoom: 13.0, duration: scaled(700), padding: getDynamicPadding(0) });
          await onceMoveEnd(scaled(700));
        } else {
          // 이동 없이 시점만 정리
          map.easeTo({ center: day.coords, zoom: 11.5, duration: scaled(900), padding: getDynamicPadding(0) });
          await onceMoveEnd(scaled(900));
          placeCityMarker(day.coords);
        }
      } else if (goingForward) {
        // 목적지가 다른 도시라면 moveType이 stay여도 먼저 도시 간 이동을 재생한다.
        // 그렇지 않으면 다음 도시의 내부 동선만 그린 뒤 목적지 중심으로 순간 이동한다.
        await moveLeg(from, day.coords, transitDay, mode, { speed });
      } else {
        if (o.animateBackward) {
          const reverseDay = { via: (o.routeVia || []).slice().reverse() };
          await moveLeg(from, day.coords, reverseDay, mode, { speed, duration: 2200 });
        } else {
          // 일반 이전 버튼은 기존처럼 빠르게 목적지로 정리한다.
          map.easeTo({ center: day.coords, zoom: 10.5, duration: scaled(900), padding: getDynamicPadding(0) });
          await onceMoveEnd(scaled(900));
        }
        placeCityMarker(day.coords);
      }

      showPhotos(day);
    } finally {
      animating = false;
    }
  }

  // 코스 시작: 인천에서 첫 도시(또는 공항)로 비행
  // altDestCoords가 있으면 그 좌표로 비행 (공항 경유 코스)
  async function enterCourse(firstDay, altDestCoords) {
    if (!isReady() || animating) return;
    animating = true;
    cancelFlag = false;
    try {
      travelledLegs = [];
      redrawTrail();
      map.jumpTo({ center: START_LOCATION.coords, zoom: 3.2 , padding: getDynamicPadding(0) });
      placeCityMarker(START_LOCATION.coords);
      await wait(500);
      const dest = altDestCoords || firstDay.coords;
      await moveLeg(START_LOCATION.coords, dest, firstDay, 'plane',
        { duration: 3600, outZoom: 1.6 });
      // altDestCoords(공항)이면 사진은 아직 표시하지 않는다 — 다음 단계(지상 이동 후)에서 표시
      if (!altDestCoords) showPhotos(firstDay);
    } finally {
      animating = false;
    }
  }

  // 당일치기에서 숙박 도시로 귀환 애니메이션
  async function returnToBase(day, opts) {
    if (!isReady() || animating) return;
    const o = opts || {};
    animating = true;
    cancelFlag = false;
    if (o.clearOverlays !== false) clearPhotos();
    try {
      const mode = (day.transport && day.transport.mode) || 'train';
      const back = Array.isArray(day.returnVia)
        ? day.returnVia
        : (day.via || []).slice().reverse();
      await moveLeg(day.coords, day.baseCoords,
        { via: back }, mode,
        { ...o, duration: 1700, inZoom: 10.5 });
    } finally {
      animating = false;
    }
  }

  // 단일 구간 이동 — 공항→도시 지상 이동, before[] 경유지 등에 사용
  async function moveStep(fromCoords, toCoords, stepData, opts) {
    if (!isReady() || animating) return;
    animating = true;
    cancelFlag = false;
    try {
      const mode = (stepData && stepData.transport && stepData.transport.mode) || 'train';
      const dayLike = { via: (stepData && stepData.via) || [] };
      await moveLeg(fromCoords, toCoords, dayLike, mode,
        opts || { duration: 2200, inZoom: 10.5 });
    } finally {
      animating = false;
    }
  }

  // 사진 마커 외부 표시/초기화
  function showDayPhotos(day) {
    if (day) showPhotos(day);
    else clearPhotos();
  }

  // 마지막 날 이후: 인천으로 귀국
  // returnVia가 있으면 귀국 항로 경유지로 사용 (via는 출발 당일 지상 이동에 쓰임)
  async function returnHome(lastDay) {
    if (!isReady() || animating) return;
    animating = true;
    cancelFlag = false;
    clearPhotos();
    try {
      const returnDay = { via: lastDay.returnVia || lastDay.via || [] };
      await moveLeg(lastDay.coords, START_LOCATION.coords, returnDay, 'plane',
        { duration: 3600, outZoom: 1.6, inZoom: 5 });
    } finally {
      animating = false;
    }
  }

  // 진행 중인 이동 애니메이션을 즉시 끝낸다 (칩/버튼 클릭이 애니메이션에 막히지 않도록)
  function skip() {
    cancelFlag = true;
  }

  function reset() {
    cancelFlag = true;
    travelledLegs = [];
    clearPhotos();
    if (isReady()) {
      redrawTrail();
      clearCourseRoutes();
      setActive(null);
      hideVehicle();
      if (cityMarker) { cityMarker.remove(); cityMarker = null; }
      map.jumpTo({ center: [10, 48], zoom: 3.4, padding: getDynamicPadding(0) });
    }
  }

  return {
    init, isReady, isAnimating,
    goToDay, enterCourse, returnHome, reset, skip,
    returnToBase, moveStep, showDayPhotos,
    showDayOverview, showCourseOverview, playTimelineStep,
    // 디버깅용 — 콘솔에서 지도 상태를 확인할 때 쓴다
    getMap: () => map,
  };
})();
