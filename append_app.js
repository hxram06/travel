const fs = require('fs');

const appJsPath = 'C:/Users/PC/OneDrive/바탕 화면/여행/app.js';
let appCode = fs.readFileSync(appJsPath, 'utf8');

const injectionCode = `
  // ==========================================
  // UI Panel Drag & Mobile Photo View Logic
  // ==========================================
  let isPanelCollapsed = false;
  let panelStartY = 0;
  let panelStartX = 0;
  let isDragging = false;

  const panel = $('panel');
  const panelDragHandle = $('panel-drag-handle');
  const panelContentView = $('panel-content-view');
  const panelPhotoView = $('panel-photo-view');

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
      updatePanelTransform();
    }
  };

  $('btn-close-photo').addEventListener('click', () => {
    panelPhotoView.classList.add('hidden');
    panelContentView.classList.remove('hidden');
  });

  // Also close on map click if photo view is open
  window.map.on('click', () => {
    if (!panelPhotoView.classList.contains('hidden')) {
      $('btn-close-photo').click();
    }
  });

  // Panel Dragging Logic
  function updatePanelTransform() {
    if (window.innerWidth <= 767) {
      // Mobile (Y-axis)
      panel.style.transform = isPanelCollapsed ? 'translateY(calc(100% - 30px))' : 'translateY(0)';
      // Sync map padding
      const bottomPad = isPanelCollapsed ? 30 : panel.getBoundingClientRect().height;
      window.map.easeTo({ padding: { bottom: bottomPad, right: 0 } });
    } else {
      // Desktop (X-axis)
      panel.style.transform = isPanelCollapsed ? 'translateX(calc(100% - 20px))' : 'translateX(0)';
      // Sync map padding
      const rightPad = isPanelCollapsed ? 20 : panel.getBoundingClientRect().width;
      window.map.easeTo({ padding: { right: rightPad, bottom: 0 } });
    }
  }

  // Pointer Events (Mouse & Touch)
  panelDragHandle.addEventListener('pointerdown', (e) => {
    isDragging = true;
    panelStartX = e.clientX;
    panelStartY = e.clientY;
    panel.classList.add('is-dragging');
    e.target.setPointerCapture(e.pointerId);
  });

  panelDragHandle.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    
    if (window.innerWidth <= 767) {
      // Mobile: Vertical drag
      const deltaY = e.clientY - panelStartY;
      if (deltaY > 50 && !isPanelCollapsed) {
        isPanelCollapsed = true;
        isDragging = false;
        panel.classList.remove('is-dragging');
        updatePanelTransform();
      } else if (deltaY < -50 && isPanelCollapsed) {
        isPanelCollapsed = false;
        isDragging = false;
        panel.classList.remove('is-dragging');
        updatePanelTransform();
      }
    } else {
      // Desktop: Horizontal drag
      const deltaX = e.clientX - panelStartX;
      if (deltaX > 50 && !isPanelCollapsed) {
        isPanelCollapsed = true;
        isDragging = false;
        panel.classList.remove('is-dragging');
        updatePanelTransform();
      } else if (deltaX < -50 && isPanelCollapsed) {
        isPanelCollapsed = false;
        isDragging = false;
        panel.classList.remove('is-dragging');
        updatePanelTransform();
      }
    }
  });

  panelDragHandle.addEventListener('pointerup', (e) => {
    if (isDragging) {
      isDragging = false;
      panel.classList.remove('is-dragging');
    }
    e.target.releasePointerCapture(e.pointerId);
  });

  // Handle window resize for proper map padding
  window.addEventListener('resize', () => {
    updatePanelTransform();
  });
`;

appCode = appCode.replace('  initApp();', injectionCode + '\n  initApp();');
fs.writeFileSync(appJsPath, appCode, 'utf8');
