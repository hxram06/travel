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
    timelineProgress: {},
    mobileStoryReady: false,
  };

  const $ = (id) => document.getElementById(id);
  const landing = $('landing');
  const mapView = $('map-view');
  const course9Entry = $('course9-entry');
  const course9EntryChoice = $('course9-entry-choice');
  const course9LodgingSurvey = $('course9-lodging-survey');
  const course9LodgingCards = $('course9-lodging-cards');
  const course9SurveyStatus = $('course9-survey-status');
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
  const courseMenu = $('course-menu');
  const statsDialog = $('stats-dialog');
  const statsDialogBody = $('stats-dialog-body');
  let operatorCourseForStats = null;
  let course9EntryCourse = null;
  let currentLodgingVote = null;

  const LODGING_OPTIONS = [
    {
      id: 'buddy',
      name: 'Buddy Hotel Munich',
      area: 'Karlsplatz 동쪽 · 구시가지 최우선',
      total: 714262,
      perPerson: 238087,
      room: '21㎡ · 대형 더블베드 1 + 소파베드 1',
      terms: '환불 불가',
      exactAddress: true,
      distances: [
        ['뮌헨 중앙역', '약 550–600m · 도보 7–8분'],
        ['Karlsplatz', '약 300m · 도보 3–4분'],
        ['Marienplatz', '약 900m · 도보 12분'],
        ['Münchner Stubn', '약 700m · 도보 9분'],
        ['Augustiner Stammhaus', '약 500m · 도보 7분'],
        ['Viktualienmarkt', '약 1.1km · 도보 15분'],
      ],
    },
    {
      id: 'brunnenhof',
      name: 'Brunnenhof City Center',
      area: '중앙역 남동쪽 · 객실 구성 최우선',
      total: 733921,
      perPerson: 244640,
      room: '23㎡ · 대형 더블베드 1 + 싱글베드 1',
      terms: '확인 당시 동일 가격에 무료 취소',
      exactAddress: true,
      distances: [
        ['뮌헨 중앙역', '약 650m · 도보 8–10분'],
        ['Karlsplatz', '약 750m · 도보 10분'],
        ['Marienplatz', '약 1.3km · 도보 17분'],
        ['Münchner Stubn', '약 550m · 도보 7분'],
        ['Augustiner Stammhaus', '약 1.0km · 도보 13분'],
        ['Viktualienmarkt', '약 1.4km · 도보 18분'],
      ],
    },
    {
      id: 'airbnb',
      name: '전망이 좋은 스튜디오 아파트',
      area: 'Paul-Heyse-Straße 일대 · 주방과 세탁 우선',
      total: 697640,
      perPerson: 232547,
      room: '침실·거실 · 킹 1 + 싱글 2 + 소파베드',
      terms: '1월 18일까지 무료 취소 · 주방·건물 내 세탁기/건조기',
      exactAddress: false,
      distances: [
        ['뮌헨 중앙역', '약 450m · 도보 6분'],
        ['Karlsplatz', '약 850m · 도보 11분'],
        ['Marienplatz', '약 1.6km · 도보 20분'],
        ['Münchner Stubn', '약 400m · 도보 5분'],
        ['Augustiner Stammhaus', '약 1.2km · 도보 15분'],
        ['Viktualienmarkt', '약 1.7km · 도보 22분'],
      ],
    },
  ];

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  function formatWon(value) {
    return `${Number(value).toLocaleString('ko-KR')}원`;
  }

  function renderLodgingSurveyCards() {
    if (!course9LodgingCards) return;
    course9LodgingCards.innerHTML = LODGING_OPTIONS.map((option, index) => {
      const selected = currentLodgingVote === option.id;
      return `<article class="course9-lodging-card${selected ? ' is-selected' : ''}" data-lodging-option="${option.id}">
        <div class="course9-lodging-card-head">
          <span class="course9-lodging-index">0${index + 1}</span>
          <div><h3>${escapeHtml(option.name)}</h3><p>${escapeHtml(option.area)}</p></div>
          ${selected ? '<span class="course9-lodging-selected">내 선택</span>' : ''}
        </div>
        <div class="course9-lodging-price">
          <div><span>4박 총액</span><strong>${formatWon(option.total)}</strong></div>
          <div><span>인당 총액</span><strong>${formatWon(option.perPerson)}</strong></div>
        </div>
        <div class="course9-lodging-room">
          <strong>${escapeHtml(option.room)}</strong>
          <span>${escapeHtml(option.terms)}</span>
        </div>
        <div class="course9-distance-list" aria-label="주요 장소까지 도보 거리">
          ${option.distances.map(([place, distance]) => `<div><span>${escapeHtml(place)}</span><strong>${escapeHtml(distance)}</strong></div>`).join('')}
        </div>
        ${option.exactAddress ? '' : '<p class="course9-distance-caveat">공개 지도 핀 기준 예상</p>'}
        <button class="course9-vote-button" type="button" data-lodging-vote="${option.id}"${selected ? ' aria-pressed="true"' : ' aria-pressed="false"'}>
          ${selected ? '선택됨 · 다른 숙소로 변경 가능' : '이 숙소에 투표'}
        </button>
      </article>`;
    }).join('');

    course9LodgingCards.querySelectorAll('[data-lodging-vote]').forEach((button) => {
      button.addEventListener('click', () => saveLodgingSurveyVote(button.dataset.lodgingVote));
    });
  }

  async function saveLodgingSurveyVote(optionId) {
    if (!LODGING_OPTIONS.some((option) => option.id === optionId)) return;
    const buttons = course9LodgingCards.querySelectorAll('[data-lodging-vote]');
    buttons.forEach((button) => { button.disabled = true; });
    course9SurveyStatus.textContent = '선택을 저장하는 중…';
    try {
      const feedback = await waitForFeedbackApi();
      await feedback.saveLodgingVote(9, optionId);
      currentLodgingVote = optionId;
      renderLodgingSurveyCards();
      const selected = LODGING_OPTIONS.find((option) => option.id === optionId);
      course9SurveyStatus.textContent = `${selected.name}에 투표했습니다. 같은 기기에서는 언제든 선택을 바꿀 수 있어요.`;
    } catch (error) {
      console.error('숙소 설문 저장 오류', error);
      buttons.forEach((button) => { button.disabled = false; });
      course9SurveyStatus.textContent = '저장하지 못했습니다. 연결 상태를 확인한 뒤 다시 눌러주세요.';
    }
  }

  async function showLodgingSurvey() {
    course9EntryChoice.classList.add('hidden');
    course9LodgingSurvey.classList.remove('hidden');
    course9Entry.scrollTop = 0;
    currentLodgingVote = null;
    course9SurveyStatus.textContent = '이전에 선택한 숙소를 확인하는 중…';
    renderLodgingSurveyCards();
    try {
      const feedback = await waitForFeedbackApi();
      currentLodgingVote = await feedback.loadLodgingVote(9);
      renderLodgingSurveyCards();
      course9SurveyStatus.textContent = currentLodgingVote
        ? '이전에 고른 숙소를 표시했습니다. 다른 후보를 누르면 선택이 바뀝니다.'
        : '아직 선택하지 않았습니다.';
    } catch (error) {
      course9SurveyStatus.textContent = '설문 연결이 늦어지고 있습니다. 잠시 후 투표 버튼을 눌러주세요.';
    }
  }

  function showCourse9Entry(course) {
    course9EntryCourse = course;
    currentLodgingVote = null;
    landing.classList.add('hidden');
    mapView.classList.add('hidden');
    course9Entry.classList.remove('hidden');
    course9EntryChoice.classList.remove('hidden');
    course9LodgingSurvey.classList.add('hidden');
    course9SurveyStatus.textContent = '';
    course9Entry.scrollTop = 0;
  }

  function openCourse9Trip() {
    if (!course9EntryCourse) return;
    openCourse(course9EntryCourse);
  }

  function feedbackIcon(type) {
    const path = type === 'like'
      ? 'M7.5 10.5v9H4.75a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5H7.5Zm0 9h8.35a2 2 0 0 0 1.92-1.45l1.72-6A2 2 0 0 0 17.57 9.5H13.5l.55-3.05A2.5 2.5 0 0 0 11.59 3.5h-.34L7.5 10.5v9Z'
      : 'M7.5 13.5v-9H4.75a1.5 1.5 0 0 0-1.5 1.5v6a1.5 1.5 0 0 0 1.5 1.5H7.5Zm0-9h8.35a2 2 0 0 1 1.92 1.45l1.72 6a2 2 0 0 1-1.92 2.55H13.5l.55 3.05a2.5 2.5 0 0 1-2.46 2.95h-.34L7.5 13.5v-9Z';
    return `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"></path></svg>`;
  }

  function renderFeedbackControls(dayIndex, itemIndex, title, compact) {
    if (!state.course) return '';
    const day = state.course.days[dayIndex];
    if (!day) return '';
    const stepKey = `course-${state.course.id}-day-${day.day}-step-${itemIndex}`;
    return `
      <div class="timeline-feedback${compact ? ' timeline-feedback-compact' : ''}"
        data-feedback-key="${escapeHtml(stepKey)}"
        data-course-id="${state.course.id}"
        data-day-number="${day.day}"
        data-timeline-index="${itemIndex}"
        data-feedback-title="${escapeHtml(title)}"
        aria-label="이 일정 평가">
        <button type="button" class="feedback-button" data-reaction="like" aria-label="좋아요" aria-pressed="false" disabled>${feedbackIcon('like')}</button>
        <button type="button" class="feedback-button" data-reaction="dislike" aria-label="싫어요" aria-pressed="false" disabled>${feedbackIcon('dislike')}</button>
      </div>`;
  }

  // ---------- 랜딩 ----------
  function renderLanding() {
    const landingSub = document.querySelector('.landing-sub');
    if (landingSub) {
      const totalDays = COURSES.reduce((sum, course) => sum + course.days.length, 0);
      landingSub.textContent = `${COURSES.length}개의 코스 · 총 ${totalDays}일의 여정`;
    }

    courseGrid.innerHTML = '';
    COURSES.forEach((course) => {
      const card = document.createElement('article');
      card.className = 'course-card';

      const openButton = document.createElement('button');
      openButton.className = 'course-card-open';
      openButton.type = 'button';
      openButton.setAttribute('aria-label', `${course.nameKo} 일정 열기`);

      const bg = document.createElement('div');
      bg.className = 'course-card-bg';
      bg.style.background = 'var(--bg-soft)';

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
        <span class="course-num">코스 ${course.id}</span>
        <h3>${course.nameKo}</h3>
        <div class="course-sub">${course.subtitle}</div>
        <div class="course-meta">${course.period} · ${course.nights}</div>
        <div class="course-cities">${course.cities.join(' · ')}</div>
      `;

      openButton.append(bg, overlay, content);
      card.append(openButton);
      const open = () => openCourse(course);
      openButton.addEventListener('click', open);

      if (new URLSearchParams(window.location.search).get('owner') === 'a8f4k9x2m') {
        const menuButton = document.createElement('button');
        menuButton.type = 'button';
        menuButton.className = 'course-menu-button';
        menuButton.textContent = '…';
        menuButton.setAttribute('aria-label', `${course.nameKo} 관리 메뉴`);
        menuButton.setAttribute('aria-haspopup', 'menu');
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.addEventListener('click', (event) => {
          event.stopPropagation();
          openOperatorCourseMenu(course, menuButton);
        });
        card.append(menuButton);
      }
      courseGrid.appendChild(card);
    });
  }

  function closeOperatorCourseMenu() {
    courseMenu.classList.add('hidden');
    document.querySelectorAll('.course-menu-button[aria-expanded="true"]').forEach((button) => {
      button.setAttribute('aria-expanded', 'false');
    });
  }

  function openOperatorCourseMenu(course, anchor) {
    const wasOpenForSameCourse = !courseMenu.classList.contains('hidden')
      && operatorCourseForStats && operatorCourseForStats.id === course.id;
    closeOperatorCourseMenu();
    if (wasOpenForSameCourse) {
      operatorCourseForStats = null;
      return;
    }
    operatorCourseForStats = course;
    anchor.setAttribute('aria-expanded', 'true');
    courseMenu.classList.remove('hidden');
    const rect = anchor.getBoundingClientRect();
    const menuWidth = courseMenu.getBoundingClientRect().width || 132;
    courseMenu.style.left = `${Math.max(12, Math.min(window.innerWidth - menuWidth - 12, rect.right - menuWidth))}px`;
    courseMenu.style.top = `${Math.min(window.innerHeight - 60, rect.bottom + 8)}px`;
    $('course-menu-stats').focus();
  }

  function waitForFeedbackApi() {
    if (window.TravelFeedback && document.documentElement.dataset.feedbackStatus === 'ready') {
      return Promise.resolve(window.TravelFeedback);
    }
    if (document.documentElement.dataset.feedbackStatus === 'error') {
      return Promise.reject(new Error('평가 서비스 초기화에 실패했습니다.'));
    }
    return new Promise((resolve, reject) => {
      const timeout = window.setTimeout(() => reject(new Error('평가 서비스 연결 시간이 초과되었습니다.')), 12000);
      window.addEventListener('travel-feedback-ready', () => {
        window.clearTimeout(timeout);
        resolve(window.TravelFeedback);
      }, { once: true });
      window.addEventListener('travel-feedback-error', (event) => {
        window.clearTimeout(timeout);
        reject(new Error(event.detail || '평가 서비스를 연결하지 못했습니다.'));
      }, { once: true });
    });
  }

  function renderCourseStats(course, stats, lodgingStats = null) {
    const stepStats = new Map(stats.steps.map((step) => [
      `course-${course.id}-day-${step.dayNumber}-step-${step.timelineIndex}`,
      step,
    ]));
    const days = course.days.map((day) => {
      const items = (day.timeline || []).map((item, timelineIndex) => {
        const key = `course-${course.id}-day-${day.day}-step-${timelineIndex}`;
        return { item, timelineIndex, stat: stepStats.get(key) };
      }).filter(({ stat }) => stat && stat.total > 0);
      return { day, items };
    }).filter(({ items }) => items.length);
    const approval = stats.total ? Math.round((stats.likes / stats.total) * 100) : 0;

    const lodgingSummary = course.id === 9 && lodgingStats ? `
      <section class="stats-lodging">
        <div class="stats-lodging-head">
          <div><span>숙소 설문</span><strong>${lodgingStats.voters.toLocaleString('ko-KR')}명 참여</strong></div>
          <small>응답자는 선택을 변경할 수 있으며 가장 최근 선택만 집계됩니다.</small>
        </div>
        <div class="stats-lodging-options">
          ${LODGING_OPTIONS.map((option) => {
            const votes = lodgingStats.options[option.id] || 0;
            const rate = lodgingStats.voters ? Math.round((votes / lodgingStats.voters) * 100) : 0;
            return `<div class="stats-lodging-row">
              <div><strong>${escapeHtml(option.name)}</strong><span>${votes}표 · ${rate}%</span></div>
              <span class="stats-row-bar"><i style="width:${rate}%"></i></span>
            </div>`;
          }).join('')}
        </div>
      </section>` : '';

    statsDialogBody.innerHTML = `
      ${lodgingSummary}
      <div class="stats-summary">
        <div><span>평가</span><strong>${stats.total.toLocaleString('ko-KR')}</strong></div>
        <div><span>참여자</span><strong>${stats.voters.toLocaleString('ko-KR')}</strong></div>
        <div><span>좋아요</span><strong>${stats.likes.toLocaleString('ko-KR')}</strong></div>
        <div><span>싫어요</span><strong>${stats.dislikes.toLocaleString('ko-KR')}</strong></div>
        <div><span>긍정률</span><strong>${approval}%</strong></div>
      </div>
      ${days.length ? `<div class="stats-days">${days.map(({ day, items }) => `
        <section class="stats-day">
          <h3>Day ${day.day} · ${escapeHtml(day.cityKo)}</h3>
          ${items.map(({ item, stat }) => {
            const rate = stat.total ? Math.round((stat.likes / stat.total) * 100) : 0;
            return `<div class="stats-row">
              <div class="stats-row-copy">
                <time>${escapeHtml(item.time || '')}</time>
                <strong>${escapeHtml(item.title)}</strong>
              </div>
              <div class="stats-row-result" aria-label="좋아요 ${stat.likes}, 싫어요 ${stat.dislikes}">
                <span class="stats-row-bar"><i style="width:${rate}%"></i></span>
                <span>${stat.likes} / ${stat.dislikes}</span>
              </div>
            </div>`;
          }).join('')}
        </section>`).join('')}</div>` : `
        <div class="stats-empty">
          <strong>아직 수집된 평가가 없습니다.</strong>
          <span>${course.days.some((day) => Array.isArray(day.timeline) && day.timeline.length)
            ? '공유 화면에서 평가가 등록되면 이곳에 표시됩니다.'
            : '이 코스에는 평가 가능한 세부 타임라인이 아직 없습니다.'}</span>
        </div>`}
    `;
  }

  async function openCourseStats(course) {
    closeOperatorCourseMenu();
    $('stats-dialog-title').textContent = `코스 ${course.id} · ${course.nameKo}`;
    statsDialogBody.innerHTML = '<div class="stats-loading"><span></span>통계를 불러오는 중입니다.</div>';
    if (typeof statsDialog.showModal === 'function') statsDialog.showModal();
    else statsDialog.setAttribute('open', '');
    try {
      const feedback = await waitForFeedbackApi();
      const [stats, lodgingStats] = await Promise.all([
        feedback.loadCourseStats(course.id),
        course.id === 9 ? feedback.loadLodgingSurveyStats(course.id) : Promise.resolve(null),
      ]);
      renderCourseStats(course, stats, lodgingStats);
    } catch (error) {
      console.error('코스 통계 조회 오류', error);
      statsDialogBody.innerHTML = `<div class="stats-empty"><strong>통계를 불러오지 못했습니다.</strong><span>${escapeHtml(error.message)}</span></div>`;
    }
  }

  // ---------- 헬퍼: 현재 패널에 보여줄 "뷰 데이" ----------
  // subStep에 따라 본 day 또는 공항·경유지·귀환 합성 객체를 반환한다
  function getTripBasePois(day) {
    if (Array.isArray(day.returnPois)) return day.returnPois;
    if (!day.baseCity || !state.course) return [];
    const baseDay = state.course.days.find((d) =>
      d.cityKo === day.baseCity && Array.isArray(d.pois)
    );
    return baseDay ? baseDay.pois : [];
  }

  function getViewDay() {
    const day = state.course.days[state.dayIndex];
    if (state.course.id === 9) return day;
    const sub = state.subStep;
    if (!sub) return day;
    if (sub.type === 'entry-airport') return day.entryAirport || day;
    if (sub.type === 'transit') return (day.before && day.before[sub.beforeIdx]) || day;
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
        timeline: day.returnTimeline || null,
        transport: day.returnTransport || { mode: (day.transport && day.transport.mode) || 'train', label: `${day.cityKo} → ${day.baseCity} · 귀환` },
        photos: day.returnPhotos || [],
        pois: getTripBasePois(day),
        lodging: day.lodging || null,
      };
    }
    return day;
  }

  // ---------- 코스 진입 / 이탈 ----------
  async function openCourse(course) {
    state.course = course;
    state.dayIndex = 0;
    const firstDay = course.days[0];
    state.subStep = course.id === 9 ? null : (firstDay.entryAirport ? { type: 'entry-airport' } : null);
    state.returnedHome = false;
    state.timelineProgress = {};
    state.mobileStoryReady = false;
    const routeLegend = document.querySelector('.route-legend');
    if (routeLegend) routeLegend.classList.toggle('hidden', course.id !== 9);

    landing.classList.add('hidden');
    course9Entry.classList.add('hidden');
    mapView.classList.remove('hidden');
    isPanelCollapsed = false;
    panelOffset = 0;
    syncMobileStoryMode();
    updatePanelTransform();

    if (!state.mapInitTried) {
      state.mapInitTried = true;
      TravelMap.init();
    }
    window.dispatchEvent(new Event('resize'));
    renderPanel();

    for (let i = 0; i < 25 && !TravelMap.isReady(); i++) await wait(200);
    if (!TravelMap.isReady()) return;

    if (course.id === 9) {
      state.timelineProgress[0] = 0;
      await TravelMap.showDayOverview(course, 0, 0);
      state.mobileStoryReady = true;
      if (isMobileStoryMode()) {
        renderMobileStory();
      } else {
        updateTimelineVisuals(0);
        scrollDesktopTimelineRow(0, 'auto');
      }
      return;
    }

    if (firstDay.entryAirport) {
      // 공항 경유 코스: 공항에 착지하고 멈춘다
      await TravelMap.enterCourse(firstDay, firstDay.entryAirport.coords);
      TravelMap.showDayPhotos(firstDay.entryAirport);
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
    stopMobileStory();
    state.course = null;
    state.dayIndex = 0;
    state.subStep = null;
    state.returnedHome = false;
    state.mobileStoryReady = false;
  }

  // ---------- 패널 ----------
  function renderDesktopTimelinePhoto(day, itemIndex) {
    const photo = TravelMap.getTimelinePhoto?.(day, itemIndex);
    if (!photo) return '';
    const caption = photo.cap || photo.title || '일정 사진';
    const credit = photo.credit || '사진 출처';
    const source = photo.source
      ? `<a href="${escapeHtml(photo.source)}" target="_blank" rel="noopener">${escapeHtml(credit)}</a>`
      : escapeHtml(credit);
    return `
      <figure class="desktop-timeline-photo">
        <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(caption)}" loading="lazy" decoding="async" />
        <figcaption><span>${escapeHtml(caption)}</span><small>${source}</small></figcaption>
      </figure>
    `;
  }

  function renderPanel() {
    const course = state.course;
    const day = course.days[state.dayIndex];
    const vDay = getViewDay();          // subStep에 따라 공항·경유지 등 표시
    const sub = state.subStep;
    const isDetailedCourse = course.id === 9;
    const timelineProgress = state.timelineProgress[state.dayIndex] ?? -1;
    const total = course.days.length;
    const isLast = state.dayIndex === total - 1 && !sub;

    $('panel-course-name').textContent = `코스 ${course.id} · ${course.nameKo}`;
    if (isDetailedCourse) {
      const progress = getCourseTimelineProgress(state.dayIndex, Math.max(0, timelineProgress));
      $('panel-day-counter').textContent = `Day ${day.day} ${day.cityKo} · 전체 일정 ${progress.currentStep} / ${progress.totalSteps}`;
      $('progress-fill').style.width = `${progress.ratio * 100}%`;
    } else {
      $('panel-day-counter').textContent = `Day ${day.day} / ${total}`;
      $('progress-fill').style.width = `${((state.dayIndex + 1) / total) * 100}%`;
    }


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
    const schedRows = Array.isArray(vDay.timeline) && vDay.timeline.length
      ? `<div class="schedule-timeline${isDetailedCourse ? ' desktop-story-timeline' : ''}">${vDay.timeline.map((item, itemIndex) => {
          const kind = ['travel', 'visit', 'free', 'buffer'].includes(item.kind) ? item.kind : 'visit';
          const status = itemIndex < timelineProgress ? ' is-done'
            : itemIndex === timelineProgress ? ' is-active' : '';
          const dot = isDetailedCourse && Array.isArray(item.at)
            ? `<button type="button" class="timeline-dot" data-timeline-index="${itemIndex}" aria-label="${escapeHtml(item.time)} ${escapeHtml(item.title)} 지도에서 보기"></button>`
            : '<span class="timeline-dot" aria-hidden="true"></span>';
          return `
              <div class="timeline-item timeline-${kind}${status}${isDetailedCourse ? ' desktop-timeline-item' : ''}" data-timeline-row="${itemIndex}">
                <time class="timeline-time">${escapeHtml(item.time)}</time>
                ${dot}
                <div class="timeline-copy">
                  <strong class="timeline-title">${escapeHtml(item.title)}</strong>
                  ${item.detail ? `<span class="timeline-detail">${escapeHtml(item.detail)}</span>` : ''}
                  ${isDetailedCourse ? renderDesktopTimelinePhoto(vDay, itemIndex) : ''}
                </div>
                ${renderFeedbackControls(state.dayIndex, itemIndex, item.title, false)}
              </div>
          `;
        }).join('')}</div>`
      : [
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

    const tip = $('panel-tip');
    tip.innerHTML = vDay.tip ? `💡 ${vDay.tip}` : '';
    tip.classList.toggle('hidden', !vDay.tip);

    // 귀환 안내 — 당일치기 본 패널에서만, subStep이 없을 때
    const returnNote = $('panel-return-note');
    if (!isDetailedCourse && !sub && day.isTrip && day.baseCity) {
      const batchim = /[가-힣]/.test(day.baseCity.slice(-1))
        && (day.baseCity.charCodeAt(day.baseCity.length - 1) - 0xac00) % 28 !== 0;
      returnNote.textContent = `🌙 저녁에 ${day.baseCity}${batchim ? '으로' : '로'} 귀환합니다.`;
      returnNote.classList.remove('hidden');
    } else {
      returnNote.classList.add('hidden');
    }



    const visitedPanel = $('panel-visited');
    visitedPanel.innerHTML = course.days.map((d, i) => {
      const cls = i < state.dayIndex ? 'visited-city done'
        : i === state.dayIndex ? 'visited-city current' : 'visited-city upcoming';
      const marker = i < state.dayIndex ? '✓' : String(d.day);
      const current = i === state.dayIndex ? ' aria-current="step"' : '';
      const batchim = /[가-힣]/.test(d.cityKo.slice(-1))
        && (d.cityKo.charCodeAt(d.cityKo.length - 1) - 0xac00) % 28 !== 0;
      return `<button type="button" class="${cls}" data-day-index="${i}"${current} aria-label="Day ${d.day} ${d.cityKo}${batchim ? '으로' : '로'} 이동"><span class="visited-index" aria-hidden="true">${marker}</span><span class="visited-label">D${d.day} ${d.cityKo}</span></button>`;
    }).join('');
    visitedPanel.querySelectorAll('.visited-city').forEach((button) => {
      button.addEventListener('click', () => window.goToDay(Number(button.dataset.dayIndex)));
    });
    panelEl.querySelectorAll('.timeline-dot[data-timeline-index]').forEach((button) => {
      button.addEventListener('click', () => window.goToTimelineStep(
        Number(button.dataset.timelineIndex),
        { scroll: true },
      ));
    });
    panelEl.querySelectorAll('.desktop-timeline-item[data-timeline-row]').forEach((row) => {
      row.addEventListener('click', (event) => {
        if (event.target.closest('button, a')) return;
        window.goToTimelineStep(Number(row.dataset.timelineRow), { scroll: true });
      });
    });

    // 버튼 상태
    btnPrev.disabled = state.dayIndex === 0 && !sub;
    btnNext.classList.toggle('hidden', isLast);
    btnNext.disabled = isLast;
    btnPrev.textContent = '← 이전 날';
    btnNext.textContent = '다음 날 →';

    // 마지막 날 귀국 버튼 / 완료
    if (isDetailedCourse && isLast) {
      btnHome.classList.add('hidden');
      navComplete.classList.remove('hidden');
      navComplete.textContent = '마지막 날 · 인천 도착';
    } else if (isLast && !state.returnedHome) {
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
    if (isDetailedCourse && window.innerWidth > 767) {
      const activeIndex = Math.max(0, timelineProgress);
      requestAnimationFrame(() => scrollDesktopTimelineRow(activeIndex, 'auto'));
    } else {
      $('panel-content-view').scrollTop = 0;
    }
    if (isMobileStoryMode()) renderMobileStory();
  }

  // ---------- 이동 ----------
  function lockNav(locked) {
    // 날짜 이동 버튼은 지도 애니메이션 중에도 입력을 받는다.
    btnPrev.disabled = state.dayIndex === 0 && !state.subStep;
    btnNext.disabled = state.dayIndex === state.course.days.length - 1;
    btnHome.disabled = locked;
  }

  async function navigate(delta) {
    if (!state.course) return;
    if (state.course.id === 9) {
      window.goToDay(state.dayIndex + delta);
      return;
    }
    const myToken = ++navToken;

    if (delta > 0 && state.subStep && state.subStep.type === 'trip-base') {
      const days = state.course.days;
      const day = days[state.dayIndex];
      const fromCoords = day.baseCoords || day.coords;
      state.subStep = null;

      if (state.dayIndex + 1 < days.length) {
        state.dayIndex++;
        state.returnedHome = false;
        if (state.dayIndex > state.maxVisitedDay) state.maxVisitedDay = state.dayIndex;
        try { renderPanel(); } catch (e) { console.error('패널 렌더 오류', e); }
        TravelMap.showDayPhotos(days[state.dayIndex]);

        TravelMap.skip();
        (async () => {
          for (let i = 0; i < 80 && TravelMap.isAnimating(); i++) await wait(40);
          if (myToken !== navToken || !state.course) return;
          await TravelMap.goToDay({ coords: fromCoords }, days[state.dayIndex], true);
        })().catch((e) => {
          console.error('당일치기 귀환 후 다음 일정 지도 애니메이션 오류', e);
        });
      }
      return;
    }

    // 현재 이동을 취소하고 최신 버튼 입력을 이어서 처리한다.
    if (state.transitioning || TravelMap.isAnimating()) {
      TravelMap.skip();
      for (let i = 0; i < 80 && (state.transitioning || TravelMap.isAnimating()); i++) {
        await wait(40);
      }
    }
    if (myToken !== navToken || !state.course) return;

    state.transitioning = true;
    lockNav(true);

    panelInner.classList.add('fade-out');
    await wait(200);

    try {
      if (myToken !== navToken) return;
      const day = state.course.days[state.dayIndex];
      const days = state.course.days;

      if (delta > 0) {
      // ──────── 전진 ────────

      if (state.subStep === null) {
        // 현재 날이 당일치기 → 숙박 도시로 귀환 애니메이션 후 정지
        if (day.isTrip && day.baseCoords) {
          state.subStep = { type: 'trip-base' };
          TravelMap.showDayPhotos(getViewDay());
          panelInner.classList.remove('fade-out');
          try { renderPanel(); } catch (e) { console.error('패널 렌더 오류', e); }
          TravelMap.returnToBase(day, { clearOverlays: false }).then(() => {
            if (state.course && state.course.days[state.dayIndex] === day &&
                state.subStep && state.subStep.type === 'trip-base') {
              TravelMap.showDayPhotos(getViewDay());
            }
          }).catch((e) => {
            console.error('당일치기 귀환 지도 애니메이션 오류', e);
          });

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
          const transfer = { ...airport, transport: airport.nextTransport || airport.transport };
          await TravelMap.moveStep(airport.coords, day.coords, transfer, {});
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
    } catch (e) {
      // 지도 애니메이션이 실패해도 일정 패널은 반드시 갱신한다
      console.error('일정 이동 중 지도 오류 — 패널은 계속 표시합니다.', e);
    } finally {
      // 패널이 사라지지 않도록 fade-out 해제와 잠금 해제를 먼저 확실히 처리한다
      panelInner.classList.remove('fade-out');
      state.transitioning = false;

      if (state.dayIndex > state.maxVisitedDay) {
        state.maxVisitedDay = state.dayIndex;
      }

      try { renderPanel(); } catch (e) { console.error('패널 렌더 오류', e); }
    }
  }

  async function goHome() {
    if (!state.course || state.transitioning || TravelMap.isAnimating()) return;
    state.transitioning = true;
    lockNav(true);
    btnHome.textContent = '✈️ 귀국 중...';

    try {
      const lastDay = state.course.days[state.course.days.length - 1];
      await TravelMap.returnHome(lastDay);
      state.returnedHome = true;
    } catch (e) {
      console.error('귀국 애니메이션 오류 — 패널은 계속 표시합니다.', e);
      state.returnedHome = true;
    } finally {
      btnHome.textContent = '✈️ 인천으로 귀국';
      state.transitioning = false;
      try { renderPanel(); } catch (e) { console.error('패널 렌더 오류', e); }
    }
  }

  let navToken = 0;
  let timelineNavToken = 0;

  const MOBILE_STORY_SWIPE_THRESHOLD = 44;
  const MOBILE_STORY_ROW_HEIGHT = 48;
  const MOBILE_STORY_ROW_THRESHOLD = MOBILE_STORY_ROW_HEIGHT / 2;
  let mobileStoryEnded = false;
  let mobileStoryAdvancing = false;
  let mobileStoryPointerId = null;
  let mobileStoryPointerStartX = 0;
  let mobileStoryPointerStartY = 0;
  let mobileStoryPointerStartIndex = 0;
  let mobileStoryPointerAxis = null;
  let mobileStoryDragX = 0;
  let mobileStoryDragY = 0;
  let mobileStorySuppressClickUntil = 0;

  function isMobileStoryMode() {
    return Boolean(state.course && state.course.id === 9 && window.innerWidth <= 767);
  }

  function updateMobileStoryStatus() {
    const story = $('mobile-story');
    const status = $('mobile-story-state');
    if (!story || !status) return;
    const moving = mobileStoryAdvancing || state.transitioning || TravelMap.isAnimating();
    story.classList.toggle('is-moving', moving);
    status.textContent = mobileStoryEnded ? '마지막 일정' : moving ? '지도 이동 중' : '스와이프';
  }

  function clampMobileStoryIndex(dayIndex, itemIndex) {
    const timeline = state.course?.days?.[dayIndex]?.timeline || [];
    return Math.max(0, Math.min(Number(itemIndex) || 0, Math.max(0, timeline.length - 1)));
  }

  function getCourseTimelineProgress(dayIndex, itemIndex) {
    if (!state.course) return { currentStep: 0, totalSteps: 0, ratio: 0, percent: 0 };
    let totalSteps = 0;
    let completedBefore = 0;
    state.course.days.forEach((courseDay, index) => {
      const count = Array.isArray(courseDay.timeline) ? courseDay.timeline.length : 0;
      if (index < dayIndex) completedBefore += count;
      totalSteps += count;
    });
    const daySteps = state.course.days[dayIndex]?.timeline?.length || 0;
    const currentStep = daySteps
      ? completedBefore + Math.max(0, Math.min(Number(itemIndex) || 0, daySteps - 1)) + 1
      : completedBefore;
    const ratio = totalSteps ? Math.max(0, Math.min(currentStep / totalSteps, 1)) : 0;
    const percent = Math.round(ratio * 100);
    return { currentStep, totalSteps, ratio, percent };
  }

  function updateMobileStoryProgress(dayIndex, itemIndex) {
    const progress = $('mobile-story-progress');
    const fill = $('mobile-story-progress-fill');
    if (!progress || !fill || !state.course) return;
    const { currentStep, totalSteps, ratio, percent } = getCourseTimelineProgress(dayIndex, itemIndex);
    fill.style.transform = `scaleX(${ratio})`;
    progress.setAttribute('aria-valuenow', String(percent));
    progress.setAttribute('aria-valuetext', `전체 일정 ${currentStep} / ${totalSteps}`);
  }

  function updateMobileStoryPreview(targetIndex) {
    const safeIndex = clampMobileStoryIndex(state.dayIndex, targetIndex);
    $('mobile-story-timeline')?.querySelectorAll('[data-story-index]').forEach((row) => {
      const rowIndex = Number(row.dataset.storyIndex);
      row.classList.toggle('mobile-story-row-current', rowIndex === safeIndex);
      row.classList.toggle('mobile-story-row-previous', rowIndex < safeIndex);
      row.classList.toggle('mobile-story-row-next', rowIndex > safeIndex);
      if (rowIndex === safeIndex) row.setAttribute('aria-current', 'step');
      else row.removeAttribute('aria-current');
    });
    updateMobileStoryProgress(state.dayIndex, safeIndex);
  }

  function renderMobileStory() {
    if (!isMobileStoryMode()) return;
    const day = state.course.days[state.dayIndex];
    const timeline = day.timeline || [];
    if (!timeline.length) return;
    const rawIndex = state.timelineProgress[state.dayIndex] ?? 0;
    const currentIndex = Math.max(0, Math.min(rawIndex, timeline.length - 1));
    $('mobile-story-day').textContent = `Day ${day.day} ${day.cityKo}`;
    const rows = [
      { type: 'previous boundary', fallback: '여행 시작', itemIndex: null, item: null },
      ...timeline.map((item, itemIndex) => ({
        type: itemIndex === currentIndex ? 'current' : itemIndex < currentIndex ? 'previous' : 'next',
        itemIndex,
        item,
      })),
      { type: 'next boundary', fallback: '오늘 일정 완료', itemIndex: null, item: null },
    ];
    const timelineElement = $('mobile-story-timeline');
    timelineElement.innerHTML = `<div class="mobile-story-track">${rows.map((row) => `
      <div class="mobile-story-row ${row.type.split(' ').map((type) => `mobile-story-row-${type}`).join(' ')}"
        ${Number.isInteger(row.itemIndex) ? `data-story-index="${row.itemIndex}" role="button" tabindex="0"` : 'aria-hidden="true"'}>
        <span>${escapeHtml(row.item ? row.item.title : row.fallback)}</span>
        ${row.item?.time ? `<time>${escapeHtml(row.item.time)}</time>` : ''}
        ${row.item ? renderFeedbackControls(
          state.dayIndex,
          row.itemIndex,
          row.item.title,
          true,
        ) : ''}
      </div>
    `).join('')}</div>`;
    $('mobile-story').style.setProperty('--story-track-y', `${-currentIndex * MOBILE_STORY_ROW_HEIGHT}px`);
    resetMobileStoryDrag(false);
    updateMobileStoryPreview(currentIndex);
    updateMobileStoryStatus();
  }

  function setMobileStoryDrag(x, y, animate) {
    const story = $('mobile-story');
    if (!story) return;
    story.classList.toggle('is-snapping', Boolean(animate));
    story.style.setProperty('--story-drag-x', `${x}px`);
    story.style.setProperty('--story-drag-y', `${y}px`);
  }

  function resetMobileStoryDrag(animate) {
    mobileStoryDragX = 0;
    mobileStoryDragY = 0;
    setMobileStoryDrag(0, 0, animate);
    if (animate) {
      window.setTimeout(() => $('mobile-story')?.classList.remove('is-snapping'), 190);
    }
  }

  async function commitMobileStorySwipe(axis, delta) {
    const story = $('mobile-story');
    if (!story) return;
    story.classList.add('is-snapping');
    if (axis === 'x') {
      const direction = delta < 0 ? 1 : -1;
      const exitX = (delta < 0 ? -1 : 1) * Math.min(window.innerWidth * 0.3, 120);
      setMobileStoryDrag(exitX, 0, true);
      await wait(150);
      resetMobileStoryDrag(false);
      await moveMobileStoryDay(direction);
    } else {
      const targetIndex = clampMobileStoryIndex(
        state.dayIndex,
        mobileStoryPointerStartIndex - Math.round(mobileStoryDragY / MOBILE_STORY_ROW_HEIGHT),
      );
      const snappedY = (mobileStoryPointerStartIndex - targetIndex) * MOBILE_STORY_ROW_HEIGHT;
      setMobileStoryDrag(0, snappedY, true);
      updateMobileStoryPreview(targetIndex);
      await wait(150);
      resetMobileStoryDrag(false);
      await moveMobileStoryTimelineTo(targetIndex, mobileStoryPointerStartIndex);
    }
    story.classList.remove('is-snapping');
  }

  function refreshMobileStoryStatus() {
    updateMobileStoryStatus();
  }

  async function waitForMobileStoryIdle() {
    if (TravelMap.isAnimating()) TravelMap.skip();
    for (let attempt = 0; attempt < 40; attempt++) {
      if (!mobileStoryAdvancing && !state.transitioning && !TravelMap.isAnimating()) return true;
      await wait(35);
    }
    return false;
  }

  async function moveMobileStoryTimelineTo(requestedIndex, fromIndexOverride) {
    if (!isMobileStoryMode() || !state.mobileStoryReady) return;
    refreshMobileStoryStatus();
    if (!await waitForMobileStoryIdle()) {
      return;
    }

    const day = state.course.days[state.dayIndex];
    const timeline = day.timeline || [];
    const currentIndex = Math.max(0, Math.min(
      Number.isInteger(fromIndexOverride)
        ? fromIndexOverride
        : state.timelineProgress[state.dayIndex] ?? 0,
      timeline.length - 1,
    ));
    const targetIndex = clampMobileStoryIndex(state.dayIndex, requestedIndex);
    if (targetIndex === currentIndex) {
      renderMobileStory();
      return;
    }

    mobileStoryEnded = false;
    mobileStoryAdvancing = true;
    state.transitioning = true;
    state.timelineProgress[state.dayIndex] = targetIndex;
    renderMobileStory();
    updateMobileStoryStatus();
    try {
      const distance = Math.abs(targetIndex - currentIndex);
      const moved = await TravelMap.playTimelineStep(
        state.course,
        state.dayIndex,
        currentIndex,
        targetIndex,
        { speed: distance > 1 ? Math.min(12, 4 + distance * 2) : 1 },
      );
      if (moved === false) state.timelineProgress[state.dayIndex] = currentIndex;
    } catch (error) {
      state.timelineProgress[state.dayIndex] = currentIndex;
      console.error('모바일 일정 스와이프 오류', error);
    } finally {
      state.transitioning = false;
      mobileStoryAdvancing = false;
      renderMobileStory();
    }
  }

  function moveMobileStoryTimeline(direction) {
    if (!direction) return;
    const currentIndex = clampMobileStoryIndex(
      state.dayIndex,
      state.timelineProgress[state.dayIndex] ?? 0,
    );
    return moveMobileStoryTimelineTo(currentIndex + direction, currentIndex);
  }

  async function moveMobileStoryDay(direction) {
    if (!isMobileStoryMode() || !state.mobileStoryReady || !direction) return;
    refreshMobileStoryStatus();
    if (!await waitForMobileStoryIdle()) {
      return;
    }

    const days = state.course.days;
    const targetDayIndex = Math.max(0, Math.min(state.dayIndex + direction, days.length - 1));
    if (targetDayIndex === state.dayIndex) {
      renderMobileStory();
      return;
    }

    mobileStoryEnded = false;
    mobileStoryAdvancing = true;
    state.transitioning = true;
    updateMobileStoryStatus();
    try {
      state.dayIndex = targetDayIndex;
      state.maxVisitedDay = Math.max(state.maxVisitedDay, targetDayIndex);
      state.timelineProgress[targetDayIndex] = Math.max(
        0,
        state.timelineProgress[targetDayIndex] ?? 0,
      );
      state.returnedHome = false;
      renderPanel();
      await TravelMap.showDayOverview(
        state.course,
        targetDayIndex,
        state.timelineProgress[targetDayIndex],
      );
    } catch (error) {
      console.error('모바일 날짜 스와이프 오류', error);
    } finally {
      state.transitioning = false;
      mobileStoryAdvancing = false;
      renderMobileStory();
    }
  }

  function stopMobileStory() {
    refreshMobileStoryStatus();
    mobileStoryEnded = false;
    mobileStoryAdvancing = false;
    mobileStoryPointerId = null;
    mapView.classList.remove('mobile-story-mode');
    mapView.classList.remove('desktop-story-mode');
    const story = $('mobile-story');
    if (story) story.classList.add('hidden');
  }

  function syncMobileStoryMode() {
    const enabled = isMobileStoryMode();
    const desktopEnabled = Boolean(
      state.course && state.course.id === 9 && window.innerWidth > 767,
    );
    mapView.classList.toggle('mobile-story-mode', enabled);
    mapView.classList.toggle('desktop-story-mode', desktopEnabled);
    const story = $('mobile-story');
    if (story) story.classList.toggle('hidden', !enabled);
    if (!enabled) {
      refreshMobileStoryStatus();
      if (desktopEnabled) {
        const activeIndex = state.timelineProgress[state.dayIndex] ?? 0;
        requestAnimationFrame(() => {
          updateTimelineVisuals(activeIndex);
          scrollDesktopTimelineRow(activeIndex, 'auto');
        });
      }
      return;
    }
    isPanelCollapsed = false;
    panelOffset = 0;
    panelEl.classList.remove('panel-collapsed', 'is-dragging');
    mapView.classList.remove('panel-collapsed', 'panel-dragging');
    mapView.style.setProperty(
      '--mobile-current-panel-height',
      'calc(252px + env(safe-area-inset-bottom, 0px))',
    );
    renderMobileStory();
  }

  let desktopTimelineWheelActive = false;
  let desktopTimelineWheelTimer = null;
  let desktopTimelineScrollFrame = null;
  let desktopTimelinePendingIndex = null;

  function isDesktopStoryMode() {
    return Boolean(state.course && state.course.id === 9 && window.innerWidth > 767);
  }

  function updateDesktopTimelineProgress(activeIndex) {
    if (!isDesktopStoryMode()) return;
    const day = state.course.days[state.dayIndex];
    const progress = getCourseTimelineProgress(state.dayIndex, activeIndex);
    $('panel-day-counter').textContent = `Day ${day.day} ${day.cityKo} · 전체 일정 ${progress.currentStep} / ${progress.totalSteps}`;
    $('progress-fill').style.width = `${progress.ratio * 100}%`;
  }

  function scrollDesktopTimelineRow(index, behavior = 'smooth') {
    if (!isDesktopStoryMode()) return;
    const scroller = $('panel-content-view');
    const row = scroller.querySelector(`[data-timeline-row="${index}"]`);
    if (!row) return;
    const scrollerRect = scroller.getBoundingClientRect();
    const rowRect = row.getBoundingClientRect();
    const top = scroller.scrollTop + rowRect.top - scrollerRect.top
      - (scroller.clientHeight - rowRect.height) / 2;
    desktopTimelineWheelActive = false;
    scroller.scrollTo({ top: Math.max(0, top), behavior });
  }

  function getDesktopTimelineCenterIndex() {
    if (!isDesktopStoryMode()) return null;
    const scroller = $('panel-content-view');
    const rows = [...scroller.querySelectorAll('.desktop-timeline-item[data-timeline-row]')];
    if (!rows.length) return null;
    const scrollerRect = scroller.getBoundingClientRect();
    const focusY = scrollerRect.top + scrollerRect.height * 0.48;
    return rows.reduce((closest, row) => {
      const rect = row.getBoundingClientRect();
      const distance = Math.abs(rect.top + rect.height / 2 - focusY);
      return !closest || distance < closest.distance
        ? { index: Number(row.dataset.timelineRow), distance }
        : closest;
    }, null)?.index ?? null;
  }

  function queueDesktopTimelineWheelCommit() {
    if (!desktopTimelineWheelActive) return;
    if (desktopTimelineScrollFrame) cancelAnimationFrame(desktopTimelineScrollFrame);
    desktopTimelineScrollFrame = requestAnimationFrame(() => {
      desktopTimelineScrollFrame = null;
      const targetIndex = getDesktopTimelineCenterIndex();
      if (!Number.isInteger(targetIndex)) return;
      desktopTimelinePendingIndex = targetIndex;
      updateTimelineVisuals(targetIndex);
      window.clearTimeout(desktopTimelineWheelTimer);
      desktopTimelineWheelTimer = window.setTimeout(() => {
        desktopTimelineWheelActive = false;
        const finalIndex = desktopTimelinePendingIndex;
        desktopTimelinePendingIndex = null;
        const currentIndex = state.timelineProgress[state.dayIndex] ?? 0;
        if (Number.isInteger(finalIndex) && finalIndex !== currentIndex) {
          window.goToTimelineStep(finalIndex, { scroll: false });
        } else {
          updateTimelineVisuals(currentIndex);
        }
      }, 170);
    });
  }

  function updateTimelineVisuals(activeIndex) {
    panelEl.querySelectorAll('[data-timeline-row]').forEach((row) => {
      const index = Number(row.dataset.timelineRow);
      row.classList.toggle('is-done', index < activeIndex);
      row.classList.toggle('is-active', index === activeIndex);
      const dot = row.querySelector('.timeline-dot[data-timeline-index]');
      if (dot) {
        if (index === activeIndex) dot.setAttribute('aria-current', 'step');
        else dot.removeAttribute('aria-current');
      }
      if (index === activeIndex) row.setAttribute('aria-current', 'step');
      else row.removeAttribute('aria-current');
    });
    updateDesktopTimelineProgress(activeIndex);
  }

  window.goToTimelineStep = async function(index, options = {}) {
    if (!state.course || state.course.id !== 9) return;
    const day = state.course.days[state.dayIndex];
    const targetIndex = Number(index);
    if (!Number.isInteger(targetIndex) || !day.timeline || !day.timeline[targetIndex]) return;
    const requestToken = ++timelineNavToken;
    if (state.transitioning || TravelMap.isAnimating()) {
      TravelMap.skip();
      for (let attempt = 0; attempt < 60 && (state.transitioning || TravelMap.isAnimating()); attempt++) {
        await wait(35);
      }
    }
    if (requestToken !== timelineNavToken || !state.course) return;
    const fromIndex = state.timelineProgress[state.dayIndex] ?? -1;

    state.transitioning = true;
    updateTimelineVisuals(targetIndex);
    try {
      const distance = Math.abs(targetIndex - fromIndex);
      const moved = await TravelMap.playTimelineStep(
        state.course,
        state.dayIndex,
        fromIndex,
        targetIndex,
        { speed: options.speed || (distance > 1 ? Math.min(12, 4 + distance * 2) : 1) },
      );
      if (moved !== false) state.timelineProgress[state.dayIndex] = targetIndex;
    } catch (e) {
      console.error('세부 일정 지도 이동 오류', e);
    } finally {
      state.transitioning = false;
      if (requestToken === timelineNavToken) {
        const activeIndex = state.timelineProgress[state.dayIndex] ?? fromIndex;
        updateTimelineVisuals(activeIndex);
        if (options.scroll !== false) scrollDesktopTimelineRow(activeIndex);
      }
    }
  };

  // 일정 칩을 누를 때도 현재 날짜부터 목표 날짜까지의 실제 경로를 재생한다.
  // 중간 날짜의 사진·패널은 건너뛰고, 지도 경로만 10배 빠르게 진행한다.
  async function travelToDayIndex(targetIndex, requestToken) {
    const days = state.course.days;
    const speed = 10;
    const startIndex = state.dayIndex;
    const sameCoords = (a, b) => Array.isArray(a) && Array.isArray(b)
      && a[0] === b[0] && a[1] === b[1];
    const assertCurrentRequest = () => requestToken === navToken;

    if (!assertCurrentRequest()) return;

    let fromCoords = days[startIndex].coords;
    const currentDay = days[startIndex];

    // 코스 첫날 공항 또는 before 경유지에 멈춘 상태에서도 이어서 이동한다.
    if (state.subStep && state.subStep.type === 'entry-airport') {
      const airport = currentDay.entryAirport;
      fromCoords = airport.coords;
      if (currentDay.before && currentDay.before.length > 0) {
        for (const stop of currentDay.before) {
          if (!assertCurrentRequest()) return;
          await TravelMap.moveStep(fromCoords, stop.coords, stop, { speed });
          fromCoords = stop.coords;
        }
        await TravelMap.goToDay({ coords: fromCoords }, currentDay, true, { speed });
        fromCoords = currentDay.coords;
      } else {
        const transfer = { ...airport, transport: airport.nextTransport || airport.transport };
        await TravelMap.moveStep(fromCoords, currentDay.coords, transfer, { speed });
        fromCoords = currentDay.coords;
      }
      state.subStep = null;
    } else if (state.subStep && state.subStep.type === 'transit') {
      const before = currentDay.before || [];
      let beforeIndex = state.subStep.beforeIdx;
      fromCoords = before[beforeIndex] ? before[beforeIndex].coords : currentDay.coords;
      for (beforeIndex += 1; beforeIndex < before.length; beforeIndex++) {
        if (!assertCurrentRequest()) return;
        const stop = before[beforeIndex];
        await TravelMap.moveStep(fromCoords, stop.coords, stop, { speed });
        fromCoords = stop.coords;
      }
      if (!sameCoords(fromCoords, currentDay.coords)) {
        await TravelMap.goToDay({ coords: fromCoords }, currentDay, true, { speed });
      }
      fromCoords = currentDay.coords;
      state.subStep = null;
    } else if (state.subStep && state.subStep.type === 'trip-base') {
      fromCoords = currentDay.baseCoords;
      state.subStep = null;
    }

    if (targetIndex > startIndex) {
      for (let i = startIndex; i < targetIndex; i++) {
        if (!assertCurrentRequest()) return;
        const day = days[i];
        const nextDay = days[i + 1];

        if (day.isTrip && day.baseCoords && !sameCoords(fromCoords, day.baseCoords)) {
          await TravelMap.returnToBase(day, { speed });
          fromCoords = day.baseCoords;
        }

        if (nextDay.before && nextDay.before.length > 0) {
          for (const stop of nextDay.before) {
            if (!assertCurrentRequest()) return;
            await TravelMap.moveStep(fromCoords, stop.coords, stop, { speed });
            fromCoords = stop.coords;
          }
          await TravelMap.goToDay({ coords: fromCoords }, nextDay, true, { speed });
        } else {
          await TravelMap.goToDay({ coords: fromCoords }, nextDay, true, { speed });
        }

        fromCoords = nextDay.coords;
        state.dayIndex = i + 1;
        state.subStep = null;
        state.returnedHome = false;
        if (state.dayIndex > state.maxVisitedDay) state.maxVisitedDay = state.dayIndex;
      }
    } else if (targetIndex < startIndex) {
      for (let i = startIndex; i > targetIndex; i--) {
        if (!assertCurrentRequest()) return;
        const day = days[i];
        const prevDay = days[i - 1];
        await TravelMap.goToDay(
          { coords: fromCoords },
          prevDay,
          false,
          { speed, animateBackward: true, routeVia: day.via || [] },
        );
        fromCoords = prevDay.coords;
        state.dayIndex = i - 1;
        state.subStep = null;
        state.returnedHome = false;
      }
    }
  }

  window.goToDay = async function(index) {
    if (!state.course) return;

    const requestedIndex = Number(index);
    if (!Number.isInteger(requestedIndex)) return;
    const targetIndex = Math.max(0, Math.min(
      requestedIndex,
      state.course.days.length - 1,
    ));
    const myToken = ++navToken;

    if (state.course.id === 9) {
      if (state.transitioning || TravelMap.isAnimating()) {
        TravelMap.skip();
        for (let i = 0; i < 60 && TravelMap.isAnimating(); i++) await wait(40);
      }
      if (myToken !== navToken || !state.course) return;
      state.transitioning = true;
      panelInner.classList.add('fade-out');
      await wait(100);
      state.dayIndex = targetIndex;
      state.maxVisitedDay = Math.max(state.maxVisitedDay, targetIndex);
      state.returnedHome = false;
      renderPanel();
      panelInner.classList.remove('fade-out');
      try {
        await TravelMap.showDayOverview(
          state.course,
          targetIndex,
          state.timelineProgress[targetIndex] ?? -1,
        );
      } catch (e) {
        console.error('날짜 전체 경로 표시 오류', e);
      } finally {
        state.transitioning = false;
      }
      return;
    }

    // 최신 클릭이 우선이다. 진행 중인 이동은 취소한 뒤 새 경로를 시작한다.
    if (state.transitioning || TravelMap.isAnimating()) {
      TravelMap.skip();
      for (let i = 0; i < 80 && (state.transitioning || TravelMap.isAnimating()); i++) {
        await wait(40);
      }
    }
    if (myToken !== navToken || !state.course) return;
    if (state.dayIndex === targetIndex && !state.subStep) { renderPanel(); return; }

    state.transitioning = true;
    lockNav(true);
    panelInner.classList.add('fade-out');
    await wait(120);

    try {
      await travelToDayIndex(targetIndex, myToken);
    } catch (e) {
      console.error('날짜 이동 중 지도 오류 — 패널은 계속 표시합니다.', e);
    } finally {
      panelInner.classList.remove('fade-out');
      state.transitioning = false;
      try { renderPanel(); } catch (e) { console.error('패널 렌더 오류', e); }
    }
  };

  // ---------- 이벤트 ----------
  btnPrev.addEventListener('click', () => navigate(-1));
  btnNext.addEventListener('click', () => navigate(1));
  btnHome.addEventListener('click', goHome);
  $('course-menu-stats').addEventListener('click', () => {
    if (operatorCourseForStats) openCourseStats(operatorCourseForStats);
  });
  $('stats-dialog-close').addEventListener('click', () => statsDialog.close());
  statsDialog.addEventListener('click', (event) => {
    if (event.target === statsDialog) statsDialog.close();
  });
  document.addEventListener('click', (event) => {
    if (courseMenu.classList.contains('hidden')) return;
    if (courseMenu.contains(event.target) || event.target.closest('.course-menu-button')) return;
    closeOperatorCourseMenu();
  });

  const desktopTimelineScroller = $('panel-content-view');
  desktopTimelineScroller.addEventListener('wheel', (event) => {
    if (!isDesktopStoryMode() || Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    desktopTimelineWheelActive = true;
    queueDesktopTimelineWheelCommit();
  }, { passive: true });
  desktopTimelineScroller.addEventListener('scroll', () => {
    if (!desktopTimelineWheelActive) return;
    queueDesktopTimelineWheelCommit();
  }, { passive: true });

  function handleMobileStoryPointerDown(event) {
    if (!isMobileStoryMode()) return;
    if (event.target.closest('.feedback-button') || mobileStoryAdvancing || state.transitioning) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    event.preventDefault();
    event.stopPropagation();
    mobileStoryPointerId = event.pointerId;
    mobileStoryPointerStartX = event.clientX;
    mobileStoryPointerStartY = event.clientY;
    mobileStoryPointerStartIndex = clampMobileStoryIndex(
      state.dayIndex,
      state.timelineProgress[state.dayIndex] ?? 0,
    );
    mobileStoryPointerAxis = null;
    mobileStoryDragX = 0;
    mobileStoryDragY = 0;
    $('mobile-story').classList.add('is-dragging');
    try { event.currentTarget.setPointerCapture(event.pointerId); } catch (_) { /* 지원하지 않는 브라우저 */ }
  }

  function handleMobileStoryPointerMove(event) {
    if (!isMobileStoryMode() || event.pointerId !== mobileStoryPointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const deltaX = event.clientX - mobileStoryPointerStartX;
    const deltaY = event.clientY - mobileStoryPointerStartY;
    if (!mobileStoryPointerAxis && Math.max(Math.abs(deltaX), Math.abs(deltaY)) >= 7) {
      mobileStoryPointerAxis = Math.abs(deltaX) > Math.abs(deltaY) ? 'x' : 'y';
    }
    if (mobileStoryPointerAxis === 'x') {
      mobileStoryDragX = Math.max(-120, Math.min(120, deltaX));
      mobileStoryDragY = 0;
    } else if (mobileStoryPointerAxis === 'y') {
      const timelineLength = state.course.days[state.dayIndex].timeline?.length || 1;
      const minDrag = -(timelineLength - 1 - mobileStoryPointerStartIndex) * MOBILE_STORY_ROW_HEIGHT;
      const maxDrag = mobileStoryPointerStartIndex * MOBILE_STORY_ROW_HEIGHT;
      let constrainedY = deltaY;
      if (constrainedY < minDrag) constrainedY = minDrag + (constrainedY - minDrag) * 0.22;
      if (constrainedY > maxDrag) constrainedY = maxDrag + (constrainedY - maxDrag) * 0.22;
      mobileStoryDragX = 0;
      mobileStoryDragY = constrainedY;
      updateMobileStoryPreview(
        mobileStoryPointerStartIndex - Math.round(constrainedY / MOBILE_STORY_ROW_HEIGHT),
      );
    }
    setMobileStoryDrag(mobileStoryDragX, mobileStoryDragY, false);
  }

  function handleMobileStoryPointerUp(event) {
    if (!isMobileStoryMode() || event.pointerId !== mobileStoryPointerId) return;
    event.preventDefault();
    event.stopPropagation();
    const deltaX = event.clientX - mobileStoryPointerStartX;
    const deltaY = event.clientY - mobileStoryPointerStartY;
    const horizontal = Math.abs(deltaX);
    const vertical = Math.abs(deltaY);
    const axis = mobileStoryPointerAxis;
    mobileStoryPointerId = null;
    mobileStoryPointerAxis = null;
    $('mobile-story').classList.remove('is-dragging');
    try { event.currentTarget.releasePointerCapture(event.pointerId); } catch (_) { /* 지원하지 않는 브라우저 */ }
    if (axis === 'x' && horizontal >= MOBILE_STORY_SWIPE_THRESHOLD) {
      mobileStorySuppressClickUntil = performance.now() + 350;
      commitMobileStorySwipe('x', deltaX);
    } else if (axis === 'y' && vertical >= MOBILE_STORY_ROW_THRESHOLD) {
      mobileStorySuppressClickUntil = performance.now() + 350;
      commitMobileStorySwipe('y', deltaY);
    } else {
      resetMobileStoryDrag(true);
      updateMobileStoryPreview(mobileStoryPointerStartIndex);
    }
  }

  function handleMobileStoryPointerCancel(event) {
    if (!isMobileStoryMode() || event.pointerId !== mobileStoryPointerId) return;
    mobileStoryPointerId = null;
    mobileStoryPointerAxis = null;
    $('mobile-story').classList.remove('is-dragging');
    resetMobileStoryDrag(true);
    updateMobileStoryPreview(clampMobileStoryIndex(
      state.dayIndex,
      state.timelineProgress[state.dayIndex] ?? 0,
    ));
  }

  const mobileStoryElement = $('mobile-story');
  mobileStoryElement.addEventListener('pointerdown', handleMobileStoryPointerDown, true);
  mobileStoryElement.addEventListener('pointermove', handleMobileStoryPointerMove, true);
  mobileStoryElement.addEventListener('pointerup', handleMobileStoryPointerUp, true);
  mobileStoryElement.addEventListener('pointercancel', handleMobileStoryPointerCancel, true);
  mobileStoryElement.addEventListener('click', (event) => {
    if (!isMobileStoryMode() || performance.now() < mobileStorySuppressClickUntil) return;
    if (event.target.closest('.feedback-button')) return;
    const row = event.target.closest('[data-story-index]');
    if (!row) return;
    event.preventDefault();
    event.stopPropagation();
    const targetIndex = Number(row.dataset.storyIndex);
    const currentIndex = clampMobileStoryIndex(
      state.dayIndex,
      state.timelineProgress[state.dayIndex] ?? 0,
    );
    moveMobileStoryTimelineTo(targetIndex, currentIndex);
  });
  mapView.addEventListener('click', (event) => {
    if (!isMobileStoryMode()) return;
    if (event.target.closest('#mobile-story')) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);
  mapView.addEventListener('contextmenu', (event) => {
    if (!isMobileStoryMode()) return;
    event.preventDefault();
  }, true);
  $('mobile-story').addEventListener('keydown', (event) => {
    if ((event.key === 'Enter' || event.key === ' ') && event.target.matches('[data-story-index]')) {
      event.preventDefault();
      event.stopPropagation();
      const currentIndex = clampMobileStoryIndex(
        state.dayIndex,
        state.timelineProgress[state.dayIndex] ?? 0,
      );
      moveMobileStoryTimelineTo(Number(event.target.dataset.storyIndex), currentIndex);
      return;
    }
    const action = {
      ArrowUp: () => moveMobileStoryTimeline(-1),
      ArrowDown: () => moveMobileStoryTimeline(1),
      ArrowLeft: () => moveMobileStoryDay(1),
      ArrowRight: () => moveMobileStoryDay(-1),
    }[event.key];
    if (!action) return;
    event.preventDefault();
    event.stopPropagation();
    action();
  });
  
  let isSharedMode = false;

  btnBack.addEventListener('click', () => {
    if (!isSharedMode) closeCourse();
  });

  document.addEventListener('keydown', (e) => {
    if (!state.course) return;
    if (statsDialog.open) return;
    if (isDesktopStoryMode()) {
      const currentIndex = state.timelineProgress[state.dayIndex] ?? 0;
      const action = {
        ArrowUp: () => window.goToTimelineStep(currentIndex - 1, { scroll: true }),
        ArrowDown: () => window.goToTimelineStep(currentIndex + 1, { scroll: true }),
        ArrowLeft: () => navigate(-1),
        ArrowRight: () => navigate(1),
      }[e.key];
      if (action) {
        e.preventDefault();
        action();
        return;
      }
    }
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
    '10': 'y1h5t4',
    '11': 'tk9y2q'
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
          document.title = sharedCourse.nameKo; // 공유 시 해당 일정 제목만 표시
          btnBack.style.display = 'none'; // 목록으로 버튼 숨김
          if (sharedCourse.id === 9) showCourse9Entry(sharedCourse);
          else openCourse(sharedCourse);
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


  // ==========================================
  // UI Panel Drag & Mobile Photo View Logic
  // ==========================================
  let isPanelCollapsed = false;
  let panelOffset = 0;
  let panelStartOffset = 0;
  let panelStartY = 0;
  let panelStartX = 0;
  let isDragging = false;

  const panel = $('panel');
  const panelDragHandle = $('panel-drag-handle');
  const panelContentView = $('panel-content-view');
  const panelPhotoView = $('panel-photo-view');
  const panelNav = document.querySelector('.panel-nav');

  // Mobile photo view swapper
  window.showMobilePhotoView = function(p, meta) {
    if (window.innerWidth > 767) return;
    panelContentView.classList.add('hidden');
    panelPhotoView.classList.remove('hidden');

    $('mobile-photo-media').innerHTML = '<img src="' + meta.url + '" alt=""/>';
    $('mobile-photo-cap').textContent = p.cap;
    $('mobile-photo-desc').textContent = p.desc || '';
    
    const credit = $('mobile-photo-credit');
    credit.href = meta.source;
    credit.textContent = '📷 ' + meta.credit;

    // Expand panel if collapsed
    if (isPanelCollapsed) {
      isPanelCollapsed = false;
      panelOffset = 0;
      updatePanelTransform();
    }
  };

  $('btn-close-photo').addEventListener('click', () => {
    panelPhotoView.classList.add('hidden');
    panelContentView.classList.remove('hidden');
    if (window.innerWidth <= 767) {
      setMobilePhotoPopupState(false);
      expandMobilePanelAfterPhoto();
    }
  });

  // Also close on map click if photo view is open
  $('map').addEventListener('click', () => {
    if (!panelPhotoView.classList.contains('hidden')) {
      $('btn-close-photo').click();
    }
    if (window.innerWidth <= 767 && window.__mobilePhotoPopupOpen) {
      setMobilePhotoPopupState(false);
      expandMobilePanelAfterPhoto();
    }
  });

  // Panel Dragging Logic
  function getMobilePanelPeek() {
    return parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--mobile-panel-peek')) || 30;
  }

  function getMobileMinVisiblePanelHeight() {
    const navHeight = panelNav ? panelNav.getBoundingClientRect().height : 0;
    return navHeight + getMobilePanelPeek();
  }

  function getMobileMaxPanelOffset() {
    return Math.max(0, panel.getBoundingClientRect().height - getMobileMinVisiblePanelHeight());
  }

  function getVisibleMobilePanelHeight() {
    const maxOffset = getMobileMaxPanelOffset();
    panelOffset = Math.min(Math.max(panelOffset, 0), maxOffset);
    return Math.max(getMobilePanelPeek(), panel.getBoundingClientRect().height - panelOffset);
  }

  function updatePanelTransform() {
    if (isMobileStoryMode()) {
      const fixedHeight = panel.getBoundingClientRect().height || 252;
      isPanelCollapsed = false;
      panelOffset = 0;
      panel.classList.remove('panel-collapsed');
      mapView.classList.remove('panel-collapsed');
      mapView.style.setProperty('--mobile-current-panel-height', `${fixedHeight}px`);
      panel.style.transform = 'translateY(0)';
      if (panelNav) panelNav.style.transform = '';
      if (window.map && typeof window.map.easeTo === 'function') {
        window.map.easeTo({ padding: { bottom: fixedHeight, right: 0 }, duration: 0 });
      }
      return;
    }
    if (window.innerWidth <= 767) {
      // Mobile bottom sheet: keep the exact drag position instead of snapping.
      const visibleHeight = getVisibleMobilePanelHeight();
      isPanelCollapsed = panelOffset >= getMobileMaxPanelOffset() - 1;
      panel.classList.toggle('panel-collapsed', isPanelCollapsed);
      mapView.classList.toggle('panel-collapsed', isPanelCollapsed);
      mapView.style.setProperty('--mobile-current-panel-height', `${visibleHeight}px`);
      panel.style.transform = `translateY(${panelOffset}px)`;
      if (panelNav) panelNav.style.transform = `translateY(${-panelOffset}px)`;
      if (isPanelCollapsed) {
        panelContentView.scrollTop = 0;
        panelPhotoView.scrollTop = 0;
      }
      // Sync map padding
      if (window.map && typeof window.map.easeTo === 'function') {
        window.map.easeTo({ padding: { bottom: visibleHeight, right: 0 } });
      }
    } else {
      // Desktop (X-axis)
      panel.classList.toggle('panel-collapsed', isPanelCollapsed);
      mapView.classList.toggle('panel-collapsed', isPanelCollapsed);
      mapView.style.removeProperty('--mobile-current-panel-height');
      if (panelNav) panelNav.style.transform = '';
      panel.style.transform = isPanelCollapsed ? 'translateX(calc(100% - 20px))' : 'translateX(0)';
      // Sync map padding
      const rightPad = isPanelCollapsed ? 20 : panel.getBoundingClientRect().width;
      if (window.map && typeof window.map.easeTo === 'function') {
        window.map.easeTo({ padding: { right: rightPad, bottom: 0 } });
      }
    }
  }

  // Pointer Events (Mouse & Touch)
  panelDragHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    panelStartX = e.clientX;
    panelStartY = e.clientY;
    panelStartOffset = panelOffset;
    panel.classList.add('is-dragging');
    mapView.classList.add('panel-dragging');
    e.target.setPointerCapture(e.pointerId);
  });

  panelDragHandle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    if (window.innerWidth <= 767) {
      // Mobile: analog vertical drag
      const deltaY = e.clientY - panelStartY;
      panelOffset = panelStartOffset + deltaY;
      updatePanelTransform();
      e.preventDefault();
    } else {
      // Desktop: Horizontal drag
      const deltaX = e.clientX - panelStartX;
      if (deltaX > 50 && !isPanelCollapsed) {
        isPanelCollapsed = true;
        isDragging = false;
        panel.classList.remove('is-dragging');
        mapView.classList.remove('panel-dragging');
        updatePanelTransform();
      } else if (deltaX < -50 && isPanelCollapsed) {
        isPanelCollapsed = false;
        isDragging = false;
        panel.classList.remove('is-dragging');
        mapView.classList.remove('panel-dragging');
        updatePanelTransform();
      }
    }
  });

  panelDragHandle.addEventListener('pointerup', (e) => {
    const isMobile = window.innerWidth <= 767;
    const delta = isMobile ? e.clientY - panelStartY : e.clientX - panelStartX;
    if (isDragging) {
      if (isMobile) {
        const maxOffset = getMobileMaxPanelOffset();
        if (Math.abs(delta) < 8) {
          panelOffset = panelOffset >= maxOffset - 1 ? 0 : maxOffset;
        } else if (panelOffset < 8) {
          panelOffset = 0;
        } else if (maxOffset - panelOffset < 8) {
          panelOffset = maxOffset;
        }
        updatePanelTransform();
      } else if (Math.abs(delta) < 8) {
        isPanelCollapsed = !isPanelCollapsed;
        updatePanelTransform();
      }
      isDragging = false;
      panel.classList.remove('is-dragging');
      mapView.classList.remove('panel-dragging');
    }
    if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  });

  panelDragHandle.addEventListener('pointercancel', (e) => {
    isDragging = false;
    panel.classList.remove('is-dragging');
    mapView.classList.remove('panel-dragging');
    if (e.target.hasPointerCapture && e.target.hasPointerCapture(e.pointerId)) {
      e.target.releasePointerCapture(e.pointerId);
    }
  });

  function setMobilePanelOffset(offset, fast) {
    if (window.innerWidth > 767) return;
    panelOffset = offset;
    if (fast) panel.classList.add('fast-collapse');
    updatePanelTransform();
    if (fast) {
      window.setTimeout(() => panel.classList.remove('fast-collapse'), 180);
    }
  }

  function setMobilePhotoPopupState(isOpen) {
    const open = Boolean(isOpen);
    window.__mobilePhotoPopupOpen = open;
    mapView.classList.toggle('mobile-photo-popup-open', open);
    transportChip.setAttribute('aria-hidden', String(open));
  }

  function collapseMobilePanelForPhoto() {
    if (window.innerWidth > 767 || isMobileStoryMode()) return;
    panelPhotoView.classList.add('hidden');
    panelContentView.classList.remove('hidden');
    setMobilePanelOffset(getMobileMaxPanelOffset(), true);
  }

  function makeRoomForMobilePhotoPopup(popupEl) {
    if (window.innerWidth > 767 || !popupEl || isMobileStoryMode()) return;
    panelPhotoView.classList.add('hidden');
    panelContentView.classList.remove('hidden');

    const popupRect = popupEl.getBoundingClientRect();
    const gap = 12;
    const currentVisibleHeight = getVisibleMobilePanelHeight();
    const currentPanelTop = window.innerHeight - currentVisibleHeight;
    if (popupRect.bottom <= currentPanelTop - gap) return;

    const minVisibleHeight = getMobileMinVisiblePanelHeight();
    const desiredPanelTop = Math.min(window.innerHeight - minVisibleHeight, popupRect.bottom + gap);
    const desiredVisibleHeight = Math.max(minVisibleHeight, window.innerHeight - desiredPanelTop);
    if (desiredVisibleHeight < currentVisibleHeight - 1) {
      setMobilePanelOffset(panel.getBoundingClientRect().height - desiredVisibleHeight, true);
    }
  }

  function expandMobilePanelAfterPhoto() {
    if (window.innerWidth > 767 || isMobileStoryMode()) return;
    setMobilePanelOffset(0, true);
  }

  window.collapseMobilePanelForPhoto = collapseMobilePanelForPhoto;
  window.makeRoomForMobilePhotoPopup = makeRoomForMobilePhotoPopup;
  window.expandMobilePanelAfterPhoto = expandMobilePanelAfterPhoto;
  window.setMobilePhotoPopupState = setMobilePhotoPopupState;
  window.getMobilePanelMinVisibleHeight = () =>
    window.innerWidth <= 767 ? getMobileMinVisiblePanelHeight() : 0;
  window.getMobilePanelVisibleHeight = () =>
    window.innerWidth <= 767 ? getVisibleMobilePanelHeight() : 0;

  // Handle window resize for proper map padding
  window.addEventListener('resize', () => {
    syncMobileStoryMode();
    updatePanelTransform();
  });

  $('course9-view-trip').addEventListener('click', openCourse9Trip);
  $('course9-open-survey').addEventListener('click', showLodgingSurvey);
  $('course9-survey-back').addEventListener('click', () => {
    course9LodgingSurvey.classList.add('hidden');
    course9EntryChoice.classList.remove('hidden');
    course9Entry.scrollTo({ top: 0, behavior: 'smooth' });
  });
  $('course9-survey-trip').addEventListener('click', openCourse9Trip);

  initApp();
})();
