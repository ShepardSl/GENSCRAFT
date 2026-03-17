

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initVideoModal();
  initPreregModal();
  initCopyIpButton();

  if (!prefersReducedMotion) {
    initMagicalCursor();
  }
});

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (!modal || !iframe) return;
  const content = modal.querySelector('.video-modal__content');
  if (!content) return;

  const overlay = modal.querySelector('.video-modal__overlay');
  const closeBtn = modal.querySelector('.video-modal__close');
  let triggerBtn = null;

  document.querySelectorAll('.about__video-overlay').forEach(btn => {
    btn.addEventListener('click', () => {
      triggerBtn = btn;
      const container = btn.closest('.about__video');
      const videoId = container.dataset.videoId;
      const start = container.dataset.videoStart || 0;
      iframe.src = `https://www.youtube.com/embed/${videoId}?si=u-pcf_sWomP55a6B&autoplay=1&start=${start}`;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      content.focus();
    });
  });

  // Attach popup logic for the new showcase video frame
  const showcaseVideoBtn = document.getElementById('btnPlayVideoShowcase');
  if (showcaseVideoBtn) {
    showcaseVideoBtn.addEventListener('click', () => {
      triggerBtn = showcaseVideoBtn;
      // Using the exact parameters the user provided for the showcase video popup
      iframe.src = `https://www.youtube.com/embed/I1KXdUwulKQ?si=r2SdHZzC4DVh2TmC&autoplay=1`;

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      content.focus();
    });
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    iframe.src = '';
    document.body.style.overflow = '';

    if (triggerBtn) {
      triggerBtn.focus();
      triggerBtn = null;
    }
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initPreregModal() {
  const modal = document.getElementById('preregModal');
  if (!modal) return;
  const openBtn = document.getElementById('btnOpenPrereg');
  const content = modal.querySelector('.prereg-modal__content');
  if (!openBtn || !content) return;

  const overlay = modal.querySelector('.prereg-modal__overlay');
  const closeBtn = modal.querySelector('.prereg-modal__close');

  openBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    content.focus();
  });

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';

    openBtn.focus();
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initCopyIpButton() {
  const copyGroup = document.getElementById('btnCopyIp');

  if (copyGroup) {
    const ipValue = copyGroup.querySelector('.desktop-header__ip-value');
    const tooltip = copyGroup.querySelector('.desktop-header__tooltip');
    
    if (ipValue && tooltip) {
      copyGroup.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(ipValue.textContent.trim());
          tooltip.classList.add('is-active');
          setTimeout(() => {
            tooltip.classList.remove('is-active');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      });
    }
  }

  const copyFooterGroup = document.getElementById('btnCopyIpFooter');

  if (copyFooterGroup) {
    const footerIpValue = copyFooterGroup.querySelector('.footer__info-ip');
    const footerTooltip = copyFooterGroup.querySelector('.footer__tooltip');
    
    if (footerIpValue && footerTooltip) {
      copyFooterGroup.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(footerIpValue.textContent.trim());
          footerTooltip.classList.add('is-active');
          setTimeout(() => {
            footerTooltip.classList.remove('is-active');
          }, 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      });
    }
  }
}

function initMagicalCursor() {
  if ('ontouchstart' in window) return;

  const chars = ['✦', '✧', '★'];
  const colors = ['#FFF2B2', '#FFFFFF', '#DFDCBD'];

  let currentX = -100;
  let currentY = -100;
  let isMouseMoving = false;
  let idleTimer;
  let lastTime = 0;

  function spawnSparkle(x, y) {
    const sparkle = document.createElement('span');
    sparkle.className = 'magical-sparkle';
    sparkle.textContent = chars[Math.floor(Math.random() * chars.length)];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    sparkle.style.left = (x + offsetX) + 'px';
    sparkle.style.top = (y + offsetY) + 'px';

    document.body.appendChild(sparkle);

    setTimeout(() => {
      if(sparkle.parentNode) sparkle.remove();
    }, 1000);
  }

  document.addEventListener('mousemove', (e) => {
    currentX = e.pageX;
    currentY = e.pageY;

    isMouseMoving = true;
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      isMouseMoving = false;
    }, 100);

    const now = Date.now();
    if (now - lastTime < 30) return;
    lastTime = now;

    spawnSparkle(currentX, currentY);
  });

  setInterval(() => {
    if (!isMouseMoving && currentX !== -100) {
      spawnSparkle(currentX, currentY);
    }
  }, 250);
}


function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const targetPosition = target.getBoundingClientRect().top + window.scrollY;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth',
      });

      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}



