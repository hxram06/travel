const fs = require('fs');
let code = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/map.js', 'utf8');

// 1. Expose window.map
code = code.replace('map = new mapboxgl.Map({', 'window.map = map = new mapboxgl.Map({');

// 2. Change line-color to blue
code = code.replace(/'line-color': '#c2703c'/g, "'line-color': '#2563eb'");
code = code.replace(/'line-color': '#d4761f'/g, "'line-color': '#2563eb'");

// 2b. Add wide layout logic to photo-popup-media
code = code.replace(/'<div class="photo-popup-media"><img src="' \+ meta\.url \+ '" alt="" \/><\/div>' \+/,
  '\'<div class="photo-popup-media"><img src="\' + meta.url + \'" alt="" onload="if(this.naturalWidth/this.naturalHeight > 1.25) this.closest(\\\'.photo-popup\\\').classList.add(\\\'wide-layout\\\')" /></div>\' +');

// 3. Inject marker data
code = code.replace('marker._photoPopup = popup;\n      marker._photoIndex = validIndex++;',
  'marker._photoPopup = popup;\n      marker._photoIndex = validIndex++;\n      marker._photoData = p;\n      marker._photoMeta = meta;');

// 4. Update openPhotoPopup
const oldFunc = `  function openPhotoPopup(marker, popup) {
    // 이미 열려있는 다른 팝업 닫기
    photoMarkers.forEach((m) => {
      if (m !== marker && m._photoPopup && m._photoPopup.isOpen()) m._photoPopup.remove();
    });
    if (popup.isOpen()) {
      popup.remove();
      return;
    }
    popup.addTo(map);`;

const newFunc = `  function openPhotoPopup(marker, popup) {
    // 이미 열려있는 다른 팝업 닫기
    photoMarkers.forEach((m) => {
      if (m !== marker && m._photoPopup && m._photoPopup.isOpen()) m._photoPopup.remove();
    });
    
    // 모바일 팝업 스와핑
    if (window.innerWidth <= 767) {
      if (window.showMobilePhotoView) {
        window.showMobilePhotoView(marker._photoData, marker._photoMeta);
        map.flyTo({ center: marker.getLngLat(), padding: { bottom: window.innerHeight * 0.4 }, speed: 1.2 });
      }
      return;
    }

    if (popup.isOpen()) {
      popup.remove();
      return;
    }
    popup.addTo(map);`;

code = code.replace(oldFunc, newFunc);

fs.writeFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/map.js', code, 'utf8');
