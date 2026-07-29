(function openParklinksMediaGallery() {
  const targetWin = window.top || window.parent || window;
  const targetDoc = targetWin.document;
  const STYLE_ID = 'parklinks-gallery-theme-v6';
  const FONT_ID = 'parklinks-gallery-fonts-v2';

  const GALLERY_IMAGES = [
    { caption: "image-1", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/_MG_0979-HDR.jpg?raw=true" },
    { caption: "image-2", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/_MG_0974-HDR.jpg?raw=true" },
    { caption: "image-3", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/_MG_0729.jpg?raw=true" },
    { caption: "image-4", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DSCF2719.jpg?raw=true" },
    { caption: "image-5", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DSCF2700.jpg?raw=true" },
    { caption: "image-6", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DSCF2653.jpg?raw=true" },
    { caption: "image-7", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DSCF2621.jpg?raw=true" },
    { caption: "image-8", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DSCF2554.jpg?raw=true" },
    { caption: "image-9", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DJI_0267.jpg?raw=true" },
    { caption: "image-10", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DJI_0241.jpg?raw=true" },
    { caption: "image-11", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DJI_0190.jpg?raw=true" },
    { caption: "image-12", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DJI_0074.jpg?raw=true" },
    { caption: "image-13", img: "https://github.com/virtual-sudo/vista-images-compressed/blob/main/DJI_0061.jpg?raw=true" }
  ];

  /* ---------- Cleanup any previous instance (DOM + listeners) ---------- */
  ['parklinks-gallery-modal', 'parklinks-gallery-lightbox'].forEach(id => {
    const el = targetDoc.getElementById(id);
    if (el) el.remove();
  });
  if (targetWin.__plModalKeyHandler) {
    targetDoc.removeEventListener('keydown', targetWin.__plModalKeyHandler);
    targetWin.__plModalKeyHandler = null;
  }
  if (targetWin.__plLightboxKeyHandler) {
    targetDoc.removeEventListener('keydown', targetWin.__plLightboxKeyHandler);
    targetWin.__plLightboxKeyHandler = null;
  }

  /* ---------- Fonts ---------- */
  if (!targetDoc.getElementById(FONT_ID)) {
    const fontLink = targetDoc.createElement('link');
    fontLink.id = FONT_ID;
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500&display=swap';
    targetDoc.head.appendChild(fontLink);
  }

  /* ---------- Styles ---------- */
  if (!targetDoc.getElementById(STYLE_ID)) {
    const styles = targetDoc.createElement('style');
    styles.id = STYLE_ID;
    styles.innerHTML = `
      /* ===== Design tokens ===== */
      #parklinks-gallery-modal, #parklinks-gallery-lightbox {
        --pl-primary: #E8791D;
        --pl-accent-1: #F4A947;
        --pl-accent-2: #B85A0F;
        --pl-ink-800: #2A2118;
        --pl-glass-bg: rgba(54, 46, 38, 0.82);
        --pl-glass-border: rgba(244, 169, 71, 0.2);
        --pl-text: #F7F3EE;
        --pl-text-muted: rgba(247, 243, 238, 0.65);
        --pl-ease: cubic-bezier(0.16, 1, 0.3, 1);
        font-family: 'Plus Jakarta Sans', -apple-system, sans-serif !important;
        font-weight: 400 !important;
      }
      #parklinks-gallery-modal *, #parklinks-gallery-lightbox * { box-sizing: border-box !important; font-weight: 400 !important; }

      /* ===== Focus states (accessibility) ===== */
      #parklinks-gallery-modal *:focus-visible, #parklinks-gallery-lightbox *:focus-visible {
        outline: 2px solid var(--pl-primary) !important;
        outline-offset: 3px !important;
        border-radius: 6px !important;
      }

      /* ===== Modal shell ===== */
      #parklinks-gallery-modal {
        position: fixed !important; inset: 0 !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        padding: 24px !important; z-index: 2147483646 !important;
        background:
          radial-gradient(circle at 20% 0%, rgba(232,121,29,0.18), transparent 55%),
          radial-gradient(circle at 100% 100%, rgba(184,90,15,0.14), transparent 50%),
          rgba(28,24,20,0.5) !important;
        backdrop-filter: blur(18px) saturate(1.1) !important;
        -webkit-backdrop-filter: blur(18px) saturate(1.1) !important;
        opacity: 0 !important; transition: opacity 0.4s var(--pl-ease) !important;
      }
      #parklinks-gallery-modal.is-open { opacity: 1 !important; }

      .pl-modal__panel {
        position: relative !important; width: 100% !important; max-width: 1180px !important;
        background: var(--pl-glass-bg) !important;
        border: 1px solid var(--pl-glass-border) !important;
        border-radius: 28px !important;
        padding: 40px !important;
        box-shadow: 0 40px 120px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06) !important;
        transform: translateY(28px) scale(0.97) !important;
        opacity: 0 !important;
        transition: transform 0.5s var(--pl-ease), opacity 0.5s var(--pl-ease) !important;
      }
      #parklinks-gallery-modal.is-open .pl-modal__panel { transform: translateY(0) scale(1) !important; opacity: 1 !important; }

      .pl-modal__header { margin-bottom: 24px !important; padding-right: 40px !important; }
      .pl-modal__eyebrow {
        display: flex !important; align-items: center !important; gap: 8px !important;
        font-size: 11px !important; letter-spacing: 3px !important;
        text-transform: uppercase !important; color: var(--pl-accent-1) !important; margin-bottom: 10px !important;
      }
      .pl-modal__eyebrow-dot { width: 6px !important; height: 6px !important; border-radius: 50% !important; background: var(--pl-primary) !important; }
      .pl-modal__title {
        font-size: 28px !important; letter-spacing: -0.3px !important;
        color: var(--pl-text) !important; margin: 0 !important;
      }
      .pl-modal__divider {
        height: 1px !important; margin-top: 22px !important;
        background: linear-gradient(90deg, var(--pl-primary), rgba(232,121,29,0)) !important;
      }

      .pl-modal__close {
        position: absolute !important; top: 28px !important; right: 28px !important;
        width: 40px !important; height: 40px !important; border-radius: 50% !important;
        background: rgba(255,255,255,0.07) !important; border: 1px solid var(--pl-glass-border) !important;
        color: var(--pl-text) !important; display: flex !important; align-items: center !important; justify-content: center !important;
        cursor: pointer !important; transition: background 0.25s ease, border-color 0.25s ease, transform 0.25s ease !important;
      }
      .pl-modal__close:hover { background: var(--pl-primary) !important; border-color: var(--pl-primary) !important; transform: rotate(90deg) !important; }
      .pl-modal__close svg { width: 16px !important; height: 16px !important; }

      /* ===== Scroll body ===== */
      .pl-scroll-body {
        width: 100% !important; max-height: 72vh !important; overflow-y: auto !important;
        padding: 4px 6px 4px 0 !important;
      }
      .pl-scroll-body::-webkit-scrollbar { width: 6px !important; }
      .pl-scroll-body::-webkit-scrollbar-thumb { background: rgba(244,169,71,0.35) !important; border-radius: 4px !important; }

      /* ===== Masonry grid ===== */
      .pl-grid {
        column-count: 3 !important;
        column-gap: 16px !important;
        width: 100% !important;
      }

      .pl-card {
        position: relative !important; display: block !important;
        break-inside: avoid !important; -webkit-column-break-inside: avoid !important;
        margin: 0 0 16px !important; border-radius: 14px !important; overflow: hidden !important;
        cursor: pointer !important; background: var(--pl-ink-800) !important;
        border: 1px solid rgba(255,255,255,0.08) !important;
        transition: transform 0.4s var(--pl-ease), box-shadow 0.4s var(--pl-ease), border-color 0.4s var(--pl-ease) !important;
      }
      .pl-card:hover {
        transform: translateY(-5px) !important;
        border-color: rgba(232,121,29,0.5) !important;
        box-shadow: 0 20px 40px rgba(232,121,29,0.2), 0 6px 14px rgba(0,0,0,0.25) !important;
      }

      .pl-card__image {
        display: block !important; width: 100% !important; height: auto !important;
        transition: transform 0.6s var(--pl-ease), filter 0.5s ease !important;
        filter: saturate(1.02) brightness(0.98) !important;
      }
      .pl-card:hover .pl-card__image { transform: scale(1.06) !important; filter: saturate(1.08) brightness(1) !important; }

      .pl-card__overlay {
        position: absolute !important; inset: 0 !important;
        background: linear-gradient(to top, rgba(20,16,12,0.35), rgba(20,16,12,0) 55%) !important;
        opacity: 0 !important; transition: opacity 0.4s ease !important;
      }
      .pl-card:hover .pl-card__overlay { opacity: 1 !important; }

      .pl-card__zoom {
        position: absolute !important; top: 50% !important; left: 50% !important;
        transform: translate(-50%, -50%) scale(0.75) !important;
        width: 40px !important; height: 40px !important; border-radius: 50% !important;
        background: rgba(20,16,12,0.55) !important; border: 1px solid rgba(255,255,255,0.3) !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        opacity: 0 !important; transition: opacity 0.3s ease, transform 0.3s ease, background 0.3s ease !important;
        backdrop-filter: blur(6px) !important;
      }
      .pl-card:hover .pl-card__zoom { opacity: 1 !important; transform: translate(-50%, -50%) scale(1) !important; background: var(--pl-primary) !important; }
      .pl-card__zoom svg { width: 16px !important; height: 16px !important; }

      /* ===== Lightbox — frame hugs each image's real dimensions ===== */
      #parklinks-gallery-lightbox {
        position: fixed !important; inset: 0 !important; z-index: 2147483647 !important;
        display: flex !important; align-items: center !important; justify-content: center !important;
        background: radial-gradient(circle at 50% 50%, rgba(232,121,29,0.12), rgba(26,22,17,0.88) 60%) !important;
        backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important;
        opacity: 0 !important; transition: opacity 0.4s var(--pl-ease) !important;
      }
      #parklinks-gallery-lightbox.is-open { opacity: 1 !important; }

      .pl-lightbox__stage {
        position: relative !important;
        display: inline-flex !important;
        max-width: 88vw !important;
        max-height: 80vh !important;
        border-radius: 16px !important;
        overflow: hidden !important;
        background: rgba(255,255,255,0.04) !important;
        border: 1px solid rgba(244,169,71,0.25) !important;
        box-shadow: 0 40px 100px rgba(0,0,0,0.5) !important;
        transform: scale(0.96) !important; opacity: 0 !important;
        transition: transform 0.45s var(--pl-ease), opacity 0.45s var(--pl-ease) !important;
      }
      #parklinks-gallery-lightbox.is-open .pl-lightbox__stage { transform: scale(1) !important; opacity: 1 !important; }

      .pl-lightbox__image {
        display: block !important;
        max-width: 88vw !important;
        max-height: 80vh !important;
        width: auto !important;
        height: auto !important;
      }

      .pl-lightbox__counter {
        position: absolute !important; bottom: 14px !important; left: 50% !important; transform: translateX(-50%) !important;
        font-size: 11px !important; color: var(--pl-ink-800) !important;
        background: var(--pl-accent-1) !important; padding: 4px 12px !important; border-radius: 20px !important; letter-spacing: 0.5px !important;
        box-shadow: 0 6px 18px rgba(0,0,0,0.3) !important;
      }

      .pl-lightbox__close, .pl-lightbox__nav {
        position: absolute !important; border-radius: 50% !important;
        background: rgba(255,255,255,0.08) !important; border: 1px solid var(--pl-glass-border) !important;
        color: var(--pl-text) !important; display: flex !important; align-items: center !important; justify-content: center !important;
        cursor: pointer !important; transition: background 0.25s ease, border-color 0.25s ease, transform 0.2s ease !important;
        backdrop-filter: blur(10px) !important;
      }
      .pl-lightbox__close:hover, .pl-lightbox__nav:hover { background: var(--pl-primary) !important; border-color: var(--pl-primary) !important; }
      .pl-lightbox__nav:active, .pl-lightbox__close:active { transform: scale(0.92) !important; }
      .pl-lightbox__close { top: 24px !important; right: 24px !important; width: 44px !important; height: 44px !important; }
      .pl-lightbox__close svg { width: 17px !important; height: 17px !important; }
      .pl-lightbox__nav { top: 50% !important; transform: translateY(-50%) !important; width: 50px !important; height: 50px !important; }
      .pl-lightbox__nav svg { width: 20px !important; height: 20px !important; }
      .pl-lightbox__nav.prev { left: 24px !important; }
      .pl-lightbox__nav.next { right: 24px !important; }

      /* ===== Responsive ===== */
      @media (max-width: 900px) {
        .pl-modal__panel { padding: 26px !important; border-radius: 22px !important; }
        .pl-modal__title { font-size: 21px !important; }
        .pl-grid { column-count: 2 !important; column-gap: 12px !important; }
        .pl-card { margin-bottom: 12px !important; }
        .pl-lightbox__stage { max-width: 94vw !important; max-height: 72vh !important; }
        .pl-lightbox__image { max-width: 94vw !important; max-height: 72vh !important; }
        .pl-lightbox__nav { width: 42px !important; height: 42px !important; }
        .pl-lightbox__nav.prev { left: 12px !important; }
        .pl-lightbox__nav.next { right: 12px !important; }
        .pl-lightbox__close { top: 16px !important; right: 16px !important; }
      }
      @media (max-width: 480px) {
        .pl-grid { column-count: 1 !important; }
      }
    `;
    targetDoc.head.appendChild(styles);
  }

  /* ---------- Icons ---------- */
  const ICONS = {
    close: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>`,
    expand: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H4v5M15 3h5v5M9 21H4v-5M15 21h5v-5"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>`
  };

  /* ---------- Close handlers ---------- */
  targetWin.closeParklinksModal = function() {
    const modal = targetDoc.getElementById('parklinks-gallery-modal');
    if (modal) {
      modal.classList.remove('is-open');
      setTimeout(() => modal.remove(), 300);
    }
    if (targetWin.__plModalKeyHandler) {
      targetDoc.removeEventListener('keydown', targetWin.__plModalKeyHandler);
      targetWin.__plModalKeyHandler = null;
    }
  };

  targetWin.closeParklinksLightbox = function() {
    const lightbox = targetDoc.getElementById('parklinks-gallery-lightbox');
    if (lightbox) {
      lightbox.classList.remove('is-open');
      setTimeout(() => lightbox.remove(), 300);
    }
    if (targetWin.__plLightboxKeyHandler) {
      targetDoc.removeEventListener('keydown', targetWin.__plLightboxKeyHandler);
      targetWin.__plLightboxKeyHandler = null;
    }
  };

  /* ---------- Lightbox (with prev/next navigation) ---------- */
  targetWin.openParklinksLightbox = function(index) {
    let currentIndex = index;
    const existing = targetDoc.getElementById('parklinks-gallery-lightbox');
    if (existing) existing.remove();

    const lightbox = targetDoc.createElement('div');
    lightbox.id = 'parklinks-gallery-lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Image viewer');

    const render = () => {
      const item = GALLERY_IMAGES[currentIndex];
      lightbox.innerHTML = `
        <button class="pl-lightbox__close" aria-label="Close image viewer" onclick="(window.top||window.parent||window).closeParklinksLightbox()">${ICONS.close}</button>
        <button class="pl-lightbox__nav prev" aria-label="Previous image" onclick="(window.top||window.parent||window).navigateParklinksLightbox(-1)">${ICONS.chevronLeft}</button>
        <div class="pl-lightbox__stage">
          <img class="pl-lightbox__image" src="${item.img}" alt="${item.caption}">
          <div class="pl-lightbox__counter">${currentIndex + 1} / ${GALLERY_IMAGES.length}</div>
        </div>
        <button class="pl-lightbox__nav next" aria-label="Next image" onclick="(window.top||window.parent||window).navigateParklinksLightbox(1)">${ICONS.chevronRight}</button>
      `;
    };

    targetWin.navigateParklinksLightbox = function(direction) {
      currentIndex = (currentIndex + direction + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
      render();
    };

    targetDoc.body.appendChild(lightbox);
    render();
    requestAnimationFrame(() => lightbox.classList.add('is-open'));

    targetWin.__plLightboxKeyHandler = function(e) {
      if (e.key === 'Escape') targetWin.closeParklinksLightbox();
      else if (e.key === 'ArrowLeft') targetWin.navigateParklinksLightbox(-1);
      else if (e.key === 'ArrowRight') targetWin.navigateParklinksLightbox(1);
    };
    targetDoc.addEventListener('keydown', targetWin.__plLightboxKeyHandler);
  };

  /* ---------- Masonry grid ---------- */
  let gridHTML = '<div class="pl-grid">';
  GALLERY_IMAGES.forEach((item, index) => {
    gridHTML += `
      <div class="pl-card" tabindex="0" role="button" aria-label="Open image ${index + 1}"
           onclick="(window.top||window.parent||window).openParklinksLightbox(${index})"
           onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();(window.top||window.parent||window).openParklinksLightbox(${index});}">
        <img class="pl-card__image" src="${item.img}" alt="${item.caption}">
        <div class="pl-card__overlay"></div>
        <div class="pl-card__zoom">${ICONS.expand}</div>
      </div>
    `;
  });
  gridHTML += '</div>';

  /* ---------- Modal ---------- */
  const modal = targetDoc.createElement('div');
  modal.id = 'parklinks-gallery-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-label', 'Media gallery');
  modal.innerHTML = `
    <div class="pl-modal__panel">
      <button class="pl-modal__close" aria-label="Close gallery" onclick="(window.top||window.parent||window).closeParklinksModal()">${ICONS.close}</button>
      <div class="pl-modal__header">
        <div class="pl-modal__eyebrow"><span class="pl-modal__eyebrow-dot"></span>Exterior Photos</div>
        <h2 class="pl-modal__title">Media Gallery</h2>
        <div class="pl-modal__divider"></div>
      </div>
      <div class="pl-scroll-body">
        ${gridHTML}
      </div>
    </div>
  `;
  targetDoc.body.appendChild(modal);
  requestAnimationFrame(() => modal.classList.add('is-open'));

  targetWin.__plModalKeyHandler = function(e) {
    if (e.key === 'Escape') targetWin.closeParklinksModal();
  };
  targetDoc.addEventListener('keydown', targetWin.__plModalKeyHandler);
})();
