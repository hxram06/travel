// ============================================================
// rules.js — RULES.md의 규칙을 기계가 검사하는 판
//
// 일정(data.js)을 고친 뒤 페이지를 새로고침하면 이 파일이 자동으로
// 규칙 위반을 찾아 브라우저 콘솔에 표로 출력한다.
//
// ⚠️ 여기는 '규칙'만 둔다. 일정 자체는 data.js에 있다.
//    규칙이 바뀔 때만 이 파일과 RULES.md를 함께 고친다.
// ============================================================

const RULES = {
  // 규칙 1 — 사진
  photo: {
    minPerDay: 2,
    maxPerDay: 5,
    // 사진 좌표가 그날 동선에서 이만큼(도) 넘게 떨어지면 다른 도시로 본다
    maxDistanceFromCityDeg: 1.2,
    // 명소 좌표가 도시 중심과 완전히 같으면 '실제 위치'를 안 넣은 것으로 본다
    warnIfSameAsCityCenter: true,
    // 설명(desc) 최소 길이
    minDescChars: 40,
    // 사진 URL이 실제로 열리는지 네트워크로 확인 (느리므로 기본 켬, 끄려면 false)
    checkUrlsLive: true,
  },

  // 좌표 정합성 — 유럽/지중해 여행이므로 이 범위를 벗어나면 의심한다.
  // 경도·위도를 바꿔 넣는 실수를 잡기 위한 것이다.
  geo: {
    lngRange: [-25, 45],
    latRange: [30, 62],
    // 출발지(인천)처럼 이 범위 밖이 정상인 좌표는 예외로 둔다
    allowOutside: [[126.4507, 37.4602]],
  },

  // 규칙 2 — 이동
  transport: {
    modes: ['plane', 'train', 'bus', 'ferry', 'walk'],
    // 지상·해상 이동은 경유지가 필요하다
    requireViaFor: ['train', 'bus', 'ferry'],
    minViaPoints: 1,
    // 경유지를 다 거친 총거리가 직선거리의 이 배수를 넘으면 좌표 오류를 의심한다.
    // (산악철도·해안선처럼 실제로 크게 우회하는 구간이 있어 넉넉히 잡는다)
    maxDetourRatio: 3.2,
    // 경유지가 출발–도착 어느 쪽에서도 이만큼(km) 넘게 떨어지면 회랑을 벗어난 것이다
    maxViaOffsetKm: 900,
  },

  // 규칙 4 — 설명 분량
  description: {
    minTotalChars: 120,
    // 현재 일정의 중앙값은 약 290자다. 240자 미만이면 유독 얇은 날이므로 알린다.
    recommendedChars: 240,
  },

  // 규칙 5 — 날짜 구조
  day: {
    moveTypes: ['flight', 'ground', 'stay'],
  },

  // 규칙 6 — 코스 메타
  course: {
    required: ['id', 'nameKo', 'subtitle', 'period', 'nights', 'color', 'cities', 'coverSpot'],
  },
};

/**
 * 일정 전체를 규칙에 비추어 검사한다.
 * @returns {{errors: Array, warnings: Array}}
 */
function validateItinerary(courses, photos) {
  const errors = [];
  const warnings = [];
  const err = (where, msg) => errors.push({ 위치: where, 문제: msg });
  const warn = (where, msg) => warnings.push({ 위치: where, 참고: msg });

  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const isCoord = (c) =>
    Array.isArray(c) && c.length === 2 &&
    Math.abs(c[0]) <= 180 && Math.abs(c[1]) <= 90;
  const canonicalPhotoUrl = (url) => {
    const clean = String(url || '').split('?')[0];
    const m = clean.match(/^(https:\/\/upload\.wikimedia\.org\/wikipedia\/commons)\/thumb\/(.+?)\/\d+px-[^/?#]+/);
    return m ? `${m[1]}/${m[2]}` : clean;
  };

  // 실제 지구 거리(km) — 경유지 우회율 판정에 쓴다
  const km = (a, b) => {
    const r = (d) => (d * Math.PI) / 180;
    const dLat = r(b[1] - a[1]);
    const dLon = r(b[0] - a[0]);
    const h = Math.sin(dLat / 2) ** 2 +
      Math.cos(r(a[1])) * Math.cos(r(b[1])) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  };

  // 경도·위도를 바꿔 넣었는지 확인한다.
  // 유럽 범위를 벗어나는데 뒤집으면 들어맞는다면 실수로 본다.
  const inEurope = (c) => {
    const [lng, lat] = c;
    const g = RULES.geo;
    return lng >= g.lngRange[0] && lng <= g.lngRange[1] &&
           lat >= g.latRange[0] && lat <= g.latRange[1];
  };
  const isAllowedOutside = (c) =>
    RULES.geo.allowOutside.some((a) => a[0] === c[0] && a[1] === c[1]);
  const looksSwapped = (c) =>
    isCoord(c) && !inEurope(c) && !isAllowedOutside(c) && inEurope([c[1], c[0]]);

  courses.forEach((course) => {
    const cTag = `코스 ${course.id}`;
    const coursePhotoUrls = new Map();
    const checkCoursePhotoReuse = (where, spot) => {
      const meta = photos[spot];
      if (!meta || !meta.url) return;
      const key = canonicalPhotoUrl(meta.url);
      if (coursePhotoUrls.has(key)) {
        err(where, `같은 코스 안에서 동일 사진 재사용 — 처음 사용: ${coursePhotoUrls.get(key)}`);
      } else {
        coursePhotoUrls.set(key, where);
      }
    };

    // --- 규칙 6: 코스 메타 ---
    RULES.course.required.forEach((k) => {
      if (course[k] === undefined || course[k] === null || course[k] === '') {
        err(cTag, `코스 필드 누락: ${k}`);
      }
    });
    if (course.coverSpot && !photos[course.coverSpot]) {
      err(cTag, `coverSpot '${course.coverSpot}' 이(가) photos-data.js에 없음`);
    } else if (course.coverSpot) {
      checkCoursePhotoReuse(`${cTag} coverSpot`, course.coverSpot);
    }

    // nights 표기와 실제 날짜 수가 맞는지
    const m = /(\d+)박\s*(\d+)일/.exec(course.nights || '');
    if (m && Number(m[2]) !== course.days.length) {
      err(cTag, `nights 표기 '${course.nights}' 와 실제 ${course.days.length}일이 불일치`);
    }

    course.days.forEach((d, i) => {
      const tag = `${cTag} D${d.day || i + 1} ${d.cityKo || '?'}`;

      // --- 규칙 5: 날짜 구조 ---
      if (d.day !== i + 1) err(tag, `day 번호가 배열 순서(${i + 1})와 다름`);
      if (!isCoord(d.coords)) err(tag, 'coords 가 올바른 좌표가 아님');
      else if (looksSwapped(d.coords)) {
        err(tag, `coords [${d.coords}] 의 경도·위도가 뒤바뀐 것으로 보임 — [${d.coords[1]}, ${d.coords[0]}] 인지 확인`);
      }
      if (!RULES.day.moveTypes.includes(d.moveType)) {
        err(tag, `moveType '${d.moveType}' 는 허용값이 아님`);
      }

      // --- 규칙 2: 이동 ---
      if (!d.transport || !d.transport.mode) {
        err(tag, 'transport 누락');
      } else {
        const mode = d.transport.mode;
        if (!RULES.transport.modes.includes(mode)) {
          err(tag, `이동수단 '${mode}' 는 허용값이 아님`);
        }
        if (!d.transport.label) err(tag, 'transport.label 누락');

        // 도시가 실제로 바뀌는 날에만 경유지를 요구한다
        const prev = course.days[i - 1];
        const moved = prev && (prev.coords[0] !== d.coords[0] || prev.coords[1] !== d.coords[1]);
        if (moved && RULES.transport.requireViaFor.includes(mode)) {
          if (!Array.isArray(d.via) || d.via.length < RULES.transport.minViaPoints) {
            err(tag, `${mode} 이동인데 via 경유지가 없음 — 직선으로 가로지르게 됨`);
          }
        }
        (d.via || []).forEach((v, k) => {
          if (!isCoord(v)) err(tag, `via[${k}] 가 올바른 좌표가 아님`);
          else if (looksSwapped(v)) {
            err(tag, `via[${k}] [${v}] 의 경도·위도가 뒤바뀐 것으로 보임`);
          }
        });

        // 경유지가 출발–도착 회랑 안에 있는지 (직선을 크게 벗어나면 좌표 오류)
        if (moved && Array.isArray(d.via) && d.via.length && d.via.every(isCoord)) {
          const from = d.isTrip && d.baseCoords ? d.baseCoords : prev.coords;
          const to = d.coords;
          const direct = km(from, to);
          const pts = [from, ...d.via, to];
          let total = 0;
          for (let k = 0; k < pts.length - 1; k++) total += km(pts[k], pts[k + 1]);

          if (direct > 5 && total / direct > RULES.transport.maxDetourRatio) {
            err(tag, `경유지를 거친 거리(${Math.round(total)}km)가 직선(${Math.round(direct)}km)의 ` +
              `${(total / direct).toFixed(1)}배 — 경유지 좌표를 확인`);
          }
          d.via.forEach((v, k) => {
            const off = Math.min(km(from, v), km(v, to));
            if (off > RULES.transport.maxViaOffsetKm) {
              err(tag, `via[${k}] 가 출발지·목적지 모두에서 ${Math.round(off)}km 떨어짐 — 회랑을 벗어남`);
            }
          });
        }
      }

      // --- 규칙 3: 당일치기 ---
      if (d.isTrip) {
        if (!d.baseCity) err(tag, '당일치기인데 baseCity 없음');
        if (!isCoord(d.baseCoords)) err(tag, '당일치기인데 baseCoords 없음');
      }

      // --- 규칙 4: 설명 분량 ---
      const text = [d.am, d.pm, d.ev].filter(Boolean).join('');
      // 당일치기(isTrip)이고 returnEv가 있으면 ev가 빈칸이어도 허용한다
      // — 저녁은 trip-base(숙소 귀환) 패널에서 별도 표시하기 때문
      const missingEv = !d.ev && !(d.isTrip && d.returnEv);
      if (!d.am || !d.pm || missingEv) err(tag, 'am/pm/ev 중 비어 있는 항목이 있음');
      if (text.length < RULES.description.minTotalChars) {
        err(tag, `설명이 너무 짧음 (${text.length}자 / 최소 ${RULES.description.minTotalChars}자)`);
      } else if (text.length < RULES.description.recommendedChars) {
        warn(tag, `설명 ${text.length}자 — 권장 ${RULES.description.recommendedChars}자보다 짧음`);
      }
      if (!d.tip) err(tag, 'tip 누락');
      if (!d.title) err(tag, 'title 누락');

      // --- 규칙 1: 사진 ---
      const ps = d.photos || [];
      if (ps.length < RULES.photo.minPerDay) {
        err(tag, `사진 ${ps.length}장 — 최소 ${RULES.photo.minPerDay}장 필요`);
      }
      if (ps.length > RULES.photo.maxPerDay) {
        warn(tag, `사진 ${ps.length}장 — ${RULES.photo.maxPerDay}장 넘으면 지도가 복잡해짐`);
      }

      ps.forEach((p, k) => {
        const ptag = `${tag} 사진[${k}]`;
        if (!photos[p.spot]) {
          err(ptag, `spot '${p.spot}' 이(가) photos-data.js에 없음`);
          return;
        }
        if (!isCoord(p.at)) {
          err(ptag, 'at 좌표가 올바르지 않음');
          return;
        }
        if (!p.cap) err(ptag, 'cap(제목) 누락');
        if (!p.desc) {
          err(ptag, `'${p.cap}' 의 desc(장소·음식 설명) 누락 — 팝업에 표시할 내용이 없음`);
        } else if (p.desc.length < RULES.photo.minDescChars) {
          warn(ptag, `desc 가 ${p.desc.length}자로 짧음 (권장 ${RULES.photo.minDescChars}자 이상)`);
        }
        if (looksSwapped(p.at)) {
          err(ptag, `at [${p.at}] 의 경도·위도가 뒤바뀐 것으로 보임`);
        }

        // 출처 표기 (규칙 1)
        const meta = photos[p.spot];
        checkCoursePhotoReuse(ptag, p.spot);
        if (!meta.credit) err(ptag, `'${p.spot}' 의 저작자·라이선스 표기 없음`);
        if (!meta.source) err(ptag, `'${p.spot}' 의 원본 파일 페이지 링크 없음`);

        // 사진은 '그날 동선' 위에 있어야 한다.
        // 이동일은 오전을 출발 도시에서 보내므로 전날 도시와 경유지도 동선에 포함된다.
        // 당일치기는 목적지와 숙박 도시가 모두 동선이다.
        const anchors = [d.coords];
        if (d.baseCoords) anchors.push(d.baseCoords);
        const prevDay = course.days[i - 1];
        if (prevDay) {
          anchors.push(prevDay.coords);
          if (prevDay.baseCoords) anchors.push(prevDay.baseCoords);
        }
        (d.via || []).forEach((v) => { if (isCoord(v)) anchors.push(v); });

        const near = anchors.some(
          (a) => dist(a, p.at) <= RULES.photo.maxDistanceFromCityDeg
        );
        if (!near) {
          err(ptag, `'${p.cap}' 위치가 그날 동선에서 너무 멂 — 다른 날 사진일 수 있음`);
        }

        // 명소 좌표가 도시 중심과 완전히 동일하면 실제 위치를 안 넣은 것
        if (RULES.photo.warnIfSameAsCityCenter &&
            p.at[0] === d.coords[0] && p.at[1] === d.coords[1]) {
          warn(ptag, `'${p.cap}' 이(가) 도시 중심 좌표 그대로 — 명소 실제 위치 권장`);
        }
      });
    });
  });

  return { errors, warnings };
}

/**
 * 실제로 쓰이는 사진 URL이 열리는지 브라우저로 확인한다.
 * 키가 PHOTOS에 있어도 URL이 없는 파일을 가리키면 지도에 빈 칸이 뜨는데,
 * 구조 검사만으로는 이걸 잡을 수 없다. (환각 URL 방지)
 */
function checkPhotoUrls(courses, photos) {
  const used = new Set();
  courses.forEach((c) => {
    if (c.coverSpot) used.add(c.coverSpot);
    c.days.forEach((d) => (d.photos || []).forEach((p) => used.add(p.spot)));
  });
  const keys = [...used].filter((k) => photos[k]);

  const load = (url) => new Promise((resolve) => {
    const img = new Image();
    const done = (ok) => resolve(ok);
    img.onload = () => done(true);
    img.onerror = () => done(false);
    img.src = url;
    setTimeout(() => done(false), 15000);
  });

  return (async () => {
    const broken = [];
    for (let i = 0; i < keys.length; i += 12) {
      const chunk = keys.slice(i, i + 12);
      const rs = await Promise.all(chunk.map((k) => load(photos[k].url)));
      rs.forEach((ok, j) => { if (!ok) broken.push(chunk[j]); });
    }
    return broken;
  })();
}

// 페이지 로드 시 자동 검사
(() => {
  // data.js나 photos-data.js에 문법 오류가 있으면 전역이 만들어지지 않는다.
  // 이때 조용히 넘어가면 "검사를 통과한 것"과 구분이 안 되므로 크게 알린다.
  const missing = [];
  if (typeof COURSES === 'undefined') missing.push('COURSES (data.js)');
  if (typeof PHOTOS === 'undefined') missing.push('PHOTOS (photos-data.js)');
  if (missing.length) {
    const msg = '일정 데이터를 읽지 못했습니다: ' + missing.join(', ') +
      '\n해당 파일에 문법 오류가 있을 가능성이 높습니다. ' +
      '콘솔의 빨간 오류 메시지에서 파일명과 줄 번호를 확인하세요.';
    console.error('%c❌ ' + msg, 'color:#c0392b;font-weight:bold;font-size:13px');
    window.__ruleCheck = { fatal: msg, errors: [], warnings: [] };
    // 화면에도 띄운다 — 콘솔을 안 볼 수도 있으므로
    document.addEventListener('DOMContentLoaded', () => {
      const box = document.createElement('div');
      box.style.cssText = 'position:fixed;inset:auto 16px 16px 16px;z-index:9999;' +
        'background:#fdecea;border:1px solid #e6b0aa;border-radius:10px;padding:14px 18px;' +
        'font:14px/1.6 sans-serif;color:#7b241c;white-space:pre-line;box-shadow:0 6px 20px rgba(0,0,0,.15)';
      box.textContent = '⚠️ ' + msg;
      document.body.appendChild(box);
    });
    return;
  }

  const { errors, warnings } = validateItinerary(COURSES, PHOTOS);
  const total = COURSES.reduce((s, c) => s + c.days.length, 0);

  console.groupCollapsed(
    `%c여행 일정 규칙 검사 — ${COURSES.length}개 코스 / ${total}일`,
    'font-weight:bold'
  );
  if (errors.length) {
    console.log(`%c❌ 규칙 위반 ${errors.length}건`, 'color:#c0392b;font-weight:bold');
    console.table(errors);
  } else {
    console.log('%c✅ 규칙 검사 통과 — 위반 없음', 'color:#1e8449;font-weight:bold');
  }
  if (warnings.length) {
    console.log(`%c⚠️ 참고 ${warnings.length}건`, 'color:#b9770e');
    console.table(warnings);
  }
  console.log('규칙 문서: RULES.md · 규칙 정의: rules.js · 일정: data.js');
  console.groupEnd();

  // 콘솔 없이도 확인할 수 있도록 결과를 전역에 남긴다
  window.__ruleCheck = { errors, warnings, days: total, urlCheck: 'pending' };

  // 사진 URL 실사 확인 (네트워크를 쓰므로 나머지 검사가 끝난 뒤 비동기로)
  if (RULES.photo.checkUrlsLive) {
    checkPhotoUrls(COURSES, PHOTOS).then((broken) => {
      window.__ruleCheck.brokenPhotos = broken;
      window.__ruleCheck.urlCheck = 'done';
      if (broken.length) {
        console.error(
          `%c❌ 열리지 않는 사진 ${broken.length}건 — photos-data.js의 URL을 확인하세요`,
          'color:#c0392b;font-weight:bold'
        );
        console.table(broken.map((k) => ({ 키: k, URL: PHOTOS[k].url })));
      } else {
        console.log('%c✅ 사진 URL 전부 정상', 'color:#1e8449');
      }
    });
  }
})();
