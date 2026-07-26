// ============================================================
// app.js — UI 인터랙션, 패널 렌더링, 이벤트
// ============================================================

(() => {
  const state = {
    course: null,
    dayIndex: 0,
    maxVisitedDay: 0,
    subStep: null,   // null | { type: 'trip-base' } | { type: 'entry-airport' } | { type: 'transit', beforeIdx: N }
    transitioning: false,
    mapInitTried: false,
    returnedHome: false,
  };

  const $ = (id) => document.getElementById(id);
  const landing = $('landing');
  const mapView = $('map-view');
  const courseGrid = $('course-grid');
  const panelEl = $('panel');
  const panelInner = $('panel-inner');
  const btnPrev = $('btn-prev');
  const btnNext = $('btn-next');
  const btnHome = $('btn-home');
  const btnBack = $('btn-back');
  const navComplete = $('nav-complete');
  const cityChip = $('city-chip');
  const transportChip = $('transport-chip');

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  // ---------- 랜딩 ----------
  function renderLanding() {
    courseGrid.innerHTML = '';
    COURSES.forEach((course) => {
      const card = document.createElement('div');
      card.className = 'course-card';
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');

      const bg = document.createElement('div');
      bg.className = 'course-card-bg';
      bg.style.background =
        `linear-gradient(135deg, ${course.color}44, ${course.color}18), var(--bg-soft)`;

      const cover = PHOTOS[course.coverSpot];
      if (cover) {
        const probe = new Image();
        probe.onload = () => {
          bg.style.backgroundImage = `url("${cover.url}")`;
          bg.style.backgroundSize = 'cover';
          bg.style.backgroundPosition = 'center';
        };
        probe.src = cover.url;
      }

      const overlay = document.createElement('div');
      overlay.className = 'course-card-overlay';

      const content = document.createElement('div');
      content.className = 'course-card-content';
      content.innerHTML = `
        <span class="course-num" style="background:${course.color}">코스 ${course.id}</span>
        <h3>${course.nameKo}</h3>
        <div class="course-sub">${course.subtitle}</div>
        <div class="course-meta">${course.period} · ${course.nights}</div>
        <div class="course-cities">${course.cities.join(' · ')}</div>
      `;

      card.append(bg, overlay, content);
      const open = () => openCourse(course);
      card.addEventListener('click', open);
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
      });
      courseGrid.appendChild(card);
    });
  }

  // ---------- 헬퍼: 현재 패널에 보여줄 "뷰 데이" ----------
  // subStep에 따라 본 day 또는 공항·경유지·귀환 합성 객체를 반환한다
  function getViewDay() {
    const day = state.course.days[state.dayIndex];
    const sub = state.subStep;
    if (!sub) return day;
    if (sub.type === 'entry-airport') return day.entryAirport;
    if (sub.type === 'transit') return day.before[sub.beforeIdx];
    if (sub.type === 'trip-base') {
      return {
        day: day.day,
        cityKo: day.baseCity,
        cityEn: day.baseCityEn || day.baseCity,
        coords: day.baseCoords,
        title: `${day.baseCity} 저녁`,
        am: null,
        pm: null,
        ev: day.returnEv || '숙소에 도착해 오늘 하루를 되돌아봅니다.',
        tip: day.returnTip || day.tip || '당일치기 후에는 피곤하기 쉽습니다. 일찍 쉬는 것을 권장합니다.',
        transport: { mode: (day.transport && day.transport.mode) || 'train', label: `${day.cityKo} → ${day.baseCity} · 귀환` },
        photos: day.returnPhotos || [],
      };
    }
    return day;
  }

  // ---------- 코스 진입 / 이탈 ----------
  async function openCourse(course) {
    state.course = course;
    state.dayIndex = 0;
    state.subStep = null;
    state.returnedHome = false;

    landing.classList.add('hidden');
    mapView.classList.remove('hidden');

    if (!state.mapInitTried) {
      state.mapInitTried = true;
      TravelMap.init();
    }
    window.dispatchEvent(new Event('resize'));
    renderPanel();

    for (let i = 0; i < 25 && !TravelMap.isReady(); i++) await wait(200);
    if (!TravelMap.isReady()) return;

    const firstDay = course.days[0];
    if (firstDay.entryAirport) {
      // 공항 경유 코스: 공항에 착지하고 멈춘다
      await TravelMap.enterCourse(firstDay, firstDay.entryAirport.coords);
      state.subStep = { type: 'entry-airport' };
      renderPanel();
    } else {
      await TravelMap.enterCourse(firstDay);
    }
  }

  function closeCourse() {
    if (state.transitioning) return;
    mapView.classList.add('hidden');
    landing.classList.remove('hidden');
    TravelMap.reset();
    state.course = null;
    state.dayIndex = 0;
    state.subStep = null;
    state.returnedHome = false;
  }

  // ---------- 패널 ----------
  function renderPanel() {
    const course = state.course;
    const day = course.days[state.dayIndex];
    const vDay = getViewDay();          // subStep에 따라 공항·경유지 등 표시
    const sub = state.subStep;
    const total = course.days.length;
    const isLast = state.dayIndex === total - 1 && !sub;

    $('panel-course-name').textContent = `코스 ${course.id} · ${course.nameKo}`;
    $('panel-day-counter').textContent = `Day ${day.day} / ${total}`;
    $('progress-fill').style.width = `${((state.dayIndex + 1) / total) * 100}%`;
    $('progress-fill').style.background = course.color;

    // 배지 — subStep 종류에 따라 다르게 표시
    let badgeHtml = '';
    if (sub && sub.type === 'entry-airport') {
      badgeHtml = '<span class="badge-transit">✈ 공항 도착</span>';
    } else if (sub && sub.type === 'transit') {
      badgeHtml = '<span class="badge-transit">🚆 경유지</span>';
    } else if (sub && sub.type === 'trip-base') {
      badgeHtml = '<span class="badge-transit">🏠 숙소 귀환</span>';
    } else if (day.isTrip) {
      badgeHtml = '<span class="badge-trip">★ 당일치기</span>';
    }
    $('panel-badges').innerHTML = badgeHtml;

    $('panel-city').innerHTML =
      `${vDay.cityKo}<span class="city-en">${vDay.cityEn}</span>`;
    $('panel-title').textContent = vDay.title;

    // 이동 수단
    const tr = vDay.transport || { mode: 'walk', label: '시내 이동' };
    const icon = VEHICLE_ICON[tr.mode] || '📍';
    $('panel-transport-icon').textContent = icon;
    $('panel-transport-label').textContent = tr.label;
    $('transport-icon').textContent = icon;
    $('transport-label').textContent = tr.label;

    // 일정 — 비어 있는 슬롯은 행 자체를 생략한다
    const schedRows = [
      { label: '오전', text: vDay.am },
      { label: '오후', text: vDay.pm },
      { label: '저녁', text: vDay.ev },
    ].filter(r => r.text).map(r => `
      <div class="sched-row">
        <span class="sched-label">${r.label}</span>
        <span class="sched-text">${r.text}</span>
      </div>
    `).join('');
    $('panel-schedule').innerHTML = schedRows || '<div class="sched-row"><span class="sched-text">일정 정보 없음</span></div>';

    $('panel-tip').innerHTML = vDay.tip ? `💡 ${vDay.tip}` : '';

    // 귀환 안내 — 당일치기 본 패널에서만, subStep이 없을 때
    const returnNote = $('panel-return-note');
    if (!sub && day.isTrip && day.baseCity) {
      returnNote.textContent = `🌙 저녁에 ${day.baseCity}(으)로 귀환합니다.`;
      returnNote.classList.remove('hidden');
    } else {
      returnNote.classList.add('hidden');
    }

    // 사진 안내
    const photosForDay = (vDay.photos || []).filter((p) => PHOTOS[p.spot]);
    const n = photosForDay.length;
    $('panel-photo-note').innerHTML = n
      ? `📷 오늘의 사진 <strong>${n}장</strong>은 지도 위 명소 위치에 표시됩니다.`
      : '📷 이날은 지도에 표시할 사진이 없습니다.';

    // 사진 리스트 렌더링
    $('panel-photo-list').innerHTML = photosForDay.map((p, idx) => {
      const data = PHOTOS[p.spot];
      return `
        <div class="panel-photo-item" id="photo-list-item-${idx}">
          <img src="${data.url}" alt="${p.cap}" />
          <div class="panel-photo-info">
            <strong>${p.cap}</strong>
            <p>${p.desc}</p>
            <small>© ${data.author}</small>
          </div>
        </div>
      `;
    }).join('');

    $('panel-visited').innerHTML = course.days.map((d, i) => {
      const cls = i < state.dayIndex ? 'visited-city done'
        : i === state.dayIndex ? 'visited-city current' : 'visited-city';
      const check = i < state.dayIndex ? '✓ ' : '';
      return `<span class="${cls}" onclick="window.goToDay(${i})" style="cursor:pointer">${check}D${d.day} ${d.cityKo}</span>`;
    }).join('');

    // 버튼 상태
    btnPrev.disabled = state.dayIndex === 0 && !sub;
    btnNext.classList.toggle('hidden', isLast);
    btnNext.disabled = isLast;

    // 마지막 날 귀국 버튼 / 완료
    if (isLast && !state.returnedHome) {
      btnHome.classList.remove('hidden');
      btnHome.disabled = false;
      navComplete.classList.add('hidden');
    } else if (isLast && state.returnedHome) {
      btnHome.classList.add('hidden');
      navComplete.classList.remove('hidden');
      navComplete.textContent = '여행 완료 — 인천 도착 🎉';
    } else {
      btnHome.classList.add('hidden');
      navComplete.classList.add('hidden');
    }

    if (state.returnedHome) {
      cityChip.textContent = `📍 ${START_LOCATION.nameKo} · ${START_LOCATION.nameEn}`;
      $('transport-icon').textContent = '✈️';
      $('transport-label').textContent = '귀국 완료 — 인천 도착';
    } else {
      cityChip.textContent = `📍 ${vDay.cityKo} · ${vDay.cityEn}`;
    }
    transportChip.classList.toggle('hidden', !tr.label);
    $('panel-scroll').scrollTop = 0;
  }

  // ---------- 이동 ----------
  function lockNav(locked) {
    btnPrev.disabled = locked || state.dayIndex === 0;
    btnNext.disabled = locked || state.dayIndex === state.course.days.length - 1;
    btnHome.disabled = locked;
  }

  async function navigate(delta) {
    if (!state.course || state.transitioning || TravelMap.isAnimating()) return;
    state.transitioning = true;
    lockNav(true);

    panelInner.classList.add('fade-out');
    await wait(200);

    const day = state.course.days[state.dayIndex];
    const days = state.course.days;

    if (delta > 0) {
      // ──────── 전진 ────────

      if (state.subStep === null) {
        // 현재 날이 당일치기 → 숙박 도시로 귀환 애니메이션 후 정지
        if (day.isTrip && day.baseCoords) {
          await TravelMap.returnToBase(day);
          TravelMap.showDayPhotos({ photos: day.returnPhotos || [] });
          state.subStep = { type: 'trip-base' };

        } else if (state.dayIndex + 1 < days.length) {
          const nextDay = days[state.dayIndex + 1];

          // 다음 날에 before[] 경유지가 있으면 첫 번째 경유지로 이동
          if (nextDay.before && nextDay.before.length > 0) {
            const fromCoords = day.coords;
            const beforeStop = nextDay.before[0];
            state.dayIndex++;
            await TravelMap.moveStep(fromCoords, beforeStop.coords, beforeStop, {});
            TravelMap.showDayPhotos({ photos: beforeStop.photos || [] });
            state.subStep = { type: 'transit', beforeIdx: 0 };

          } else {
            // 일반 이동
            const prevDay = day;
            state.dayIndex++;
            state.returnedHome = false;
            await TravelMap.goToDay(prevDay, days[state.dayIndex], true);
          }
        }

      } else if (state.subStep.type === 'trip-base') {
        // 당일치기 숙박 도시에서 다음 날로 출발
        const fromCoords = day.baseCoords;
        state.subStep = null;

        if (state.dayIndex + 1 < days.length) {
          const nextDay = days[state.dayIndex + 1];

          if (nextDay.before && nextDay.before.length > 0) {
            state.dayIndex++;
            const beforeStop = nextDay.before[0];
            await TravelMap.moveStep(fromCoords, beforeStop.coords, beforeStop, {});
            TravelMap.showDayPhotos({ photos: beforeStop.photos || [] });
            state.subStep = { type: 'transit', beforeIdx: 0 };

          } else {
            // goToDay에 baseCoords를 출발지로 넘겨야 하므로 fake prevDay 사용
            state.dayIndex++;
            state.returnedHome = false;
            await TravelMap.goToDay({ coords: fromCoords }, days[state.dayIndex], true);
          }
        }

      } else if (state.subStep.type === 'entry-airport') {
        // 공항에서 다음 정거장으로 이동
        // before[]가 있으면 첫 번째 경유지로, 없으면 바로 목적지로
        const airport = day.entryAirport;
        if (day.before && day.before.length > 0) {
          const firstStop = day.before[0];
          await TravelMap.moveStep(airport.coords, firstStop.coords, firstStop, {});
          TravelMap.showDayPhotos({ photos: firstStop.photos || [] });
          state.subStep = { type: 'transit', beforeIdx: 0 };
        } else {
          await TravelMap.moveStep(airport.coords, day.coords, airport, {});
          TravelMap.showDayPhotos(day);
          state.subStep = null;
        }

      } else if (state.subStep.type === 'transit') {
        const beforeIdx = state.subStep.beforeIdx;
        const nextBeforeIdx = beforeIdx + 1;

        if (nextBeforeIdx < day.before.length) {
          // 다음 before[] 경유지로
          const fromCoords = day.before[beforeIdx].coords;
          const nextBefore = day.before[nextBeforeIdx];
          await TravelMap.moveStep(fromCoords, nextBefore.coords, nextBefore, {});
          TravelMap.showDayPhotos({ photos: nextBefore.photos || [] });
          state.subStep = { type: 'transit', beforeIdx: nextBeforeIdx };

        } else {
          // 마지막 경유지 → 최종 목적지로 이동
          const fromCoords = day.before[beforeIdx].coords;
          state.subStep = null;
          await TravelMap.goToDay({ coords: fromCoords }, day, true);
        }
      }

    } else {
      // ──────── 후진 ────────

      if (state.subStep !== null) {
        // subStep 중이면 한 단계 뒤로
        if (state.subStep.type === 'transit' && state.subStep.beforeIdx > 0) {
          const prevIdx = state.subStep.beforeIdx - 1;
          state.subStep = { type: 'transit', beforeIdx: prevIdx };
          TravelMap.showDayPhotos({ photos: day.before[prevIdx].photos || [] });

        } else if (state.subStep.type === 'transit' && state.subStep.beforeIdx === 0) {
          // 첫 before[] 에서 뒤로 → 이전 날로
          state.subStep = null;
          state.dayIndex--;
          if (state.dayIndex >= 0) {
            await TravelMap.goToDay(day, days[state.dayIndex], false);
          }
        } else {
          // trip-base, entry-airport → 그냥 subStep 해제
          state.subStep = null;
          TravelMap.showDayPhotos(day);
        }

      } else if (state.dayIndex > 0) {
        const prevDay = day;
        state.dayIndex--;
        state.returnedHome = false;
        await TravelMap.goToDay(prevDay, days[state.dayIndex], false);
      }
    }
    renderPanel();
    panelInner.classList.remove('fade-out');
    await wait(300);
    state.transitioning = false;
    
    if (state.dayIndex > state.maxVisitedDay) {
      state.maxVisitedDay = state.dayIndex;
    }
    
    renderPanel();
  }

  async function goHome() {
    if (!state.course || state.transitioning || TravelMap.isAnimating()) return;
    state.transitioning = true;
    lockNav(true);
    btnHome.textContent = '✈️ 귀국 중...';

    const lastDay = state.course.days[state.course.days.length - 1];
    await TravelMap.returnHome(lastDay);

    state.returnedHome = true;
    btnHome.textContent = '✈️ 인천으로 귀국';
    state.transitioning = false;
    renderPanel();
  }

  window.goToDay = async function(index) {
    if (!state.course || state.transitioning || TravelMap.isAnimating() || state.dayIndex === index) return;

    state.transitioning = true;
    lockNav(true);
    panelInner.classList.add('fade-out');
    await wait(200);

    const prevDay = state.course.days[state.dayIndex];
    state.dayIndex = index;
    state.subStep = null;
    state.returnedHome = false;
    
    // update max visited day
    if (state.dayIndex > state.maxVisitedDay) {
      state.maxVisitedDay = state.dayIndex;
    }

    const newDay = state.course.days[state.dayIndex];
    await TravelMap.goToDay(prevDay, newDay, false); // jump without slow animation

    renderPanel();
    panelInner.classList.remove('fade-out');
    await wait(300);
    state.transitioning = false;
    renderPanel();
  };

  // ---------- 이벤트 ----------
  btnPrev.addEventListener('click', () => navigate(-1));
  btnNext.addEventListener('click', () => navigate(1));
  btnHome.addEventListener('click', goHome);
  
  let isSharedMode = false;

  btnBack.addEventListener('click', () => {
    if (!isSharedMode) closeCourse();
  });

  document.addEventListener('keydown', (e) => {
    if (!state.course) return;
    if (e.key === 'ArrowLeft') navigate(-1);
    else if (e.key === 'ArrowRight') navigate(1);
    else if (e.key === 'Escape' && !isSharedMode) closeCourse();
  });

  // ---------- 앱 초기화 (공유 모드 확인) ----------
  const SHARE_TOKENS = {
    '1': 'a8f4k9',
    '2': 'x3m7v2',
    '3': 'p9q1w5',
    '4': 'r6b2n8',
    '5': 'h4t7y3',
    '6': 'd2z9f5',
    '7': 'e8c4a1',
    '8': 'v5j2m6',
    '9': 'k3n8b7',
    '10': 'y1h5t4'
  };

  function initApp() {
    const params = new URLSearchParams(window.location.search);

    // 주인 접속: 전체 코스 목록(랜딩) 표시
    if (params.get('owner') === 'a8f4k9x2m') {
      renderLanding();
      return;
    }

    if (params.has('share')) {
      const shareToken = params.get('share');
      // 토큰으로 코스 ID 찾기
      const courseId = Object.keys(SHARE_TOKENS).find(key => SHARE_TOKENS[key] === shareToken);
      
      if (courseId) {
        const sharedCourse = COURSES.find(c => String(c.id) === String(courseId));
        if (sharedCourse) {
          isSharedMode = true;
          btnBack.style.display = 'none'; // 목록으로 버튼 숨김
          openCourse(sharedCourse);
          return;
        }
      }
      // 공유 파라미터가 있지만 유효하지 않은 경우 (임의 접근 차단)
      document.body.innerHTML = '<h2 style="text-align:center; margin-top:20vh; color:#666;">유효하지 않은 공유 링크입니다.</h2>';
      return;
    }
    
    // 공유 파라미터가 없는 기본 접속(본인)일 때만 랜딩 렌더링
    renderLanding();
  }

  initApp();
})();
