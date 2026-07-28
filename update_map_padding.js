const fs = require('fs');

const mapJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/map.js';
let code = fs.readFileSync(mapJsPath, 'utf8');

const helperCode = `
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
      return { top: basePadding, bottom: Math.max(basePadding, pHeight + 20), left: basePadding, right: basePadding };
    } else {
      // 우측 패널
      return { top: basePadding, bottom: basePadding, left: basePadding, right: Math.max(basePadding, pWidth + 20) };
    }
  }

  function wait(ms) { return new Promise((r) => setTimeout(r, ms)); }
`;

// Insert helperCode where "function wait(ms)" is
code = code.replace(/\/\/ ---------- 유틸 ----------[\s\S]*?function wait\(ms\) \{ return new Promise\(\(r\) => setTimeout\(r, ms\)\); \}/, helperCode.trim());

// Update fitPath
code = code.replace(/map\.fitBounds\(b, \{ padding: padding \|\| 90, duration: 1100 \}\);/, 'map.fitBounds(b, { padding: getDynamicPadding(padding || 90), duration: 1100 });');

// Update popup offsetY
const popupEaseTo = `    // easeTo의 offset은 '지정한 좌표를 화면 중앙에서 얼마나 밀어놓을지'를 뜻한다
    const offsetY = (targetRatio - 0.5) * h;
    const isMobile = window.innerWidth <= 767;
    const panel = document.getElementById('panel');
    let offsetX = 0;
    if (!isMobile && panel && !panel.classList.contains('closed')) {
      offsetX = -(panel.getBoundingClientRect().width / 2);
    }

    map.easeTo({
      center: marker.getLngLat(),
      offset: [offsetX, offsetY],
      duration: 450,
    });`;
code = code.replace(/\/\/ easeTo의 offset은 '지정한 좌표를 화면 중앙에서 얼마나 밀어놓을지'를 뜻한다[\s\S]*?duration: 450,\s*\}\);/, popupEaseTo);

// Add padding to easeTo and jumpTo
code = code.replace(/map\.easeTo\(\{\s*(center|zoom): ([^,]+)(,\s*zoom: [^,]+)?,\s*duration:\s*(\d+)\s*\}\)/g, "map.easeTo({ $1: $2$3, duration: $4, padding: getDynamicPadding(0) })");
code = code.replace(/map\.jumpTo\(\{\s*center: ([^,]+),\s*zoom:\s*([^\}]+)\s*\}\)/g, "map.jumpTo({ center: $1, zoom: $2, padding: getDynamicPadding(0) })");

fs.writeFileSync(mapJsPath, code);
console.log('Map padding injected!');
