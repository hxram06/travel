const fs = require('fs');

const additionalCSS = `
/* Panel Draggable Settings */
.panel {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s;
  will-change: transform;
}

.panel.is-dragging {
  transition: none !important;
}

.panel-drag-handle {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 100;
}
.panel-drag-handle:active {
  cursor: grabbing;
}
.drag-bar {
  background: var(--border-strong);
  border-radius: 4px;
}

/* Desktop Drag Handle (Left Side) */
@media (min-width: 768px) {
  .panel-drag-handle {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 20px;
    background: transparent;
  }
  .drag-bar {
    width: 4px;
    height: 40px;
  }
}

/* Mobile Drag Handle (Top Side) */
@media (max-width: 767px) {
  .panel-drag-handle {
    width: 100%;
    height: 30px;
    position: absolute;
    top: 0;
    left: 0;
  }
  .drag-bar {
    width: 40px;
    height: 5px;
  }
  
  #panel-inner {
    height: 100%;
    padding-top: 30px; /* Space for drag handle */
  }
}

/* Mobile Photo View Modal */
#panel-photo-view {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.btn-close-photo {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
  z-index: 10;
}

.mobile-photo-media {
  width: 100%;
  border-radius: 8px;
  overflow: hidden;
  background: var(--bg-soft);
  margin-bottom: 16px;
}
.mobile-photo-media img {
  width: 100%;
  height: auto;
  max-height: 40vh;
  object-fit: contain;
  display: block;
}

.mobile-photo-cap {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--text);
  margin-bottom: 8px;
}
.mobile-photo-desc {
  font-size: 0.95rem;
  color: var(--text-mid);
  line-height: 1.6;
  margin-bottom: 12px;
}
.mobile-photo-credit {
  font-size: 0.8rem;
  color: var(--text-light);
}

.hidden {
  display: none !important;
}
`;

fs.appendFileSync('C:/Users/PC/OneDrive/바탕 화면/여행/styles.css', additionalCSS, 'utf8');
