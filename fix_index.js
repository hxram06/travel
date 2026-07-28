const fs = require('fs');
let html = fs.readFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/index.html', 'utf8');

const startIdx = html.indexOf('<aside class="panel" id="panel">');
const endIdx = html.indexOf('</aside>', startIdx) + 8;

const newPanel = `<aside class="panel" id="panel">
      <div class="panel-drag-handle" id="panel-drag-handle">
        <div class="drag-bar"></div>
      </div>
      <div class="panel-inner" id="panel-inner">
        
        <!-- Default Content View -->
        <div class="panel-scroll" id="panel-content-view">
          <div class="panel-course-name" id="panel-course-name"></div>
          <div class="panel-progress">
            <div class="panel-day-counter" id="panel-day-counter"></div>
            <div class="progress-bar"><div class="progress-fill" id="progress-fill"></div></div>
          </div>
          <hr class="panel-divider" />
          <div id="panel-badges"></div>
          <h2 class="panel-city" id="panel-city"></h2>
          <div class="panel-title" id="panel-title"></div>
          <div class="panel-transport" id="panel-transport">
            <span class="t-icon" id="panel-transport-icon"></span>
            <span id="panel-transport-label"></span>
          </div>
          <div class="panel-schedule" id="panel-schedule"></div>
          <div class="panel-tip" id="panel-tip"></div>
          <div class="panel-return-note hidden" id="panel-return-note"></div>
          <hr class="panel-divider" />
          <div class="panel-visited" id="panel-visited"></div>
        </div>

        <!-- Mobile Photo Modal View (Bottom Sheet Photo) -->
        <div class="panel-scroll hidden" id="panel-photo-view">
          <button id="btn-close-photo" class="btn-close-photo">×</button>
          <div class="mobile-photo-media" id="mobile-photo-media"></div>
          <div class="mobile-photo-cap" id="mobile-photo-cap"></div>
          <div class="mobile-photo-desc" id="mobile-photo-desc"></div>
          <a class="mobile-photo-credit" id="mobile-photo-credit" href="#" target="_blank" rel="noopener"></a>
        </div>

        <div class="panel-nav">
          <button class="btn-nav" id="btn-prev">&#8592; 이전</button>
          <button class="btn-nav" id="btn-next">다음 &#8594;</button>
        </div>
      </div>
    </aside>`;

html = html.substring(0, startIdx) + newPanel + html.substring(endIdx);
fs.writeFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/index.html', html, 'utf8');
