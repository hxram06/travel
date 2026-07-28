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
};

const TravelMap = (() => {
  let map = null;
  let mapReady = false;
  let cityMarker = null;
  let vehicleMarker = null;
  let photoMarkers = [];
  let travelledLegs = [];     // 지금까지 이동한 경로들 (좌표 배열의 배열)
  let animating = false;
  let cancelFlag = false;

  const TRAIL_SRC = 'trail-src';
  const TRAIL_LAYER = 'trail-layer';
  const ACTIVE_SRC = 'active-src';
  const ACTIVE_LAYER = 'active-layer';

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
    window.setTimeout(() => {
      const popupEl = getPopupElement(popup);
      const close = popupEl && popupEl.querySelector('.mapboxgl-popup-close-button');
      if (close) {
        close.setAttribute('aria-label', '사진 설명 닫기');
        close.setAttribute('title', '사진 설명 닫기');
        close.addEventListener('click', () => {
          setMobilePhotoPopupState(false);
          if (window.expandMobilePanelAfterPhoto) window.expandMobilePanelAfterPhoto();
        }, { once: true });
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
    if (!isReady() || !day.photos) return;
    let validIndex = 0;
    day.photos.forEach((p) => {
      const meta = PHOTOS[p.spot];
      if (!meta) return;
      const el = document.createElement('div');
      el.className = 'photo-marker';
      el.style.backgroundImage = 'url("' + meta.url + '")';
      el.title = p.cap;

      const popupHtml = buildPhotoPopupHtml(p, meta);
      const popup = createPhotoPopup(popupHtml, p.at, 'bottom');

      // 마커와 별개로 팝업에도 좌표를 지정해야 한다.
      // (marker.setPopup을 쓰지 않으므로 Mapbox가 대신 넣어주지 않는다)

      const marker = new mapboxgl.Marker({ element: el, anchor: 'bottom' })
        .setLngLat(p.at).addTo(map);
      marker._photoPopup = popup;
      marker._photoPopupHtml = popupHtml;
      marker._photoCoords = p.at;
      marker._photoIndex = validIndex++;

      el.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openPhotoPopup(marker, popup);
      });

      photoMarkers.push(marker);
    });
  }

  function clearPhotos() {
    setMobilePhotoPopupState(false);
    photoMarkers.forEach((m) => m.remove());
    photoMarkers = [];
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
  async function fitPath(path, padding) {
    const b = path.reduce(
      (acc, c) => acc.extend(c),
      new mapboxgl.LngLatBounds(path[0], path[0])
    );
    map.fitBounds(b, { padding: getDynamicPadding(padding || 90), duration: 1100 });
    await onceMoveEnd(1100);
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

    if (mode === 'plane') {
      map.easeTo({ zoom: o.outZoom || 2.2, duration: 1100, padding: getDynamicPadding(0) });
      await onceMoveEnd(1100);
      await fitPath(path, 120);
      await travel(path, mode, o.duration || 3200);
      map.easeTo({ center: to, zoom: o.inZoom || 9.5, duration: 1500, padding: getDynamicPadding(0) });
      await onceMoveEnd(1500);
    } else {
      await fitPath(path, 100);
      await travel(path, mode, o.duration || 2600);
      map.easeTo({ center: to, zoom: o.inZoom || 10.5, duration: 1200, padding: getDynamicPadding(0) });
      await onceMoveEnd(1200);
    }

    travelledLegs.push(path);
    redrawTrail();
    setActive(null);
    hideVehicle();
    placeCityMarker(to);
  }

  // ---------- 공개 API ----------

  /**
   * 날짜 이동.
   * @param prevDay 직전에 보던 day (없으면 코스 첫 진입)
   * @param day 이동할 day
   * @param goingForward > 버튼이면 true
   */
  async function goToDay(prevDay, day, goingForward) {
    if (!isReady() || animating) return;
    animating = true;
    cancelFlag = false;
    clearPhotos();

    try {
      let from = prevDay ? prevDay.coords : day.coords;

      const same = from[0] === day.coords[0] && from[1] === day.coords[1];
      const mode = (day.transport && day.transport.mode) || 'train';

      if (same || day.moveType === 'stay') {
        // 같은 도시에 머무는 날
        if (day.via && day.via.length >= 2) {
          // via 경유지가 있으면 숙소→관광지 일일 동선을 지도 위에 그린다
          const vFrom  = day.via[0];
          const vTo    = day.via[day.via.length - 1];
          const vInner = day.via.slice(1, -1);
          const intraCityPath = groundPath(vFrom, vInner, vTo);
          await fitPath(intraCityPath, 80);
          if (goingForward) await travel(intraCityPath, 'walk', 2400);
          travelledLegs.push(intraCityPath);
          redrawTrail();
          setActive(null);
          hideVehicle();
          placeCityMarker(vFrom);
          map.easeTo({ center: day.coords, zoom: 13.0, duration: 700, padding: getDynamicPadding(0) });
          await onceMoveEnd(700);
        } else {
          // 이동 없이 시점만 정리
          map.easeTo({ center: day.coords, zoom: 11.5, duration: 900, padding: getDynamicPadding(0) });
          await onceMoveEnd(900);
          placeCityMarker(day.coords);
        }
      } else if (goingForward) {
        await moveLeg(from, day.coords, day, mode, {});
      } else {
        // 역방향은 애니메이션 없이 빠르게 되돌린다
        map.easeTo({ center: day.coords, zoom: 10.5, duration: 900, padding: getDynamicPadding(0) });
        await onceMoveEnd(900);
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
  async function returnToBase(day) {
    if (!isReady() || animating) return;
    animating = true;
    cancelFlag = false;
    clearPhotos();
    try {
      const mode = (day.transport && day.transport.mode) || 'train';
      const back = (day.via || []).slice().reverse();
      await moveLeg(day.coords, day.baseCoords,
        { via: back }, mode,
        { duration: 1700, inZoom: 10.5 });
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
    // 디버깅용 — 콘솔에서 지도 상태를 확인할 때 쓴다
    getMap: () => map,
  };
})();
