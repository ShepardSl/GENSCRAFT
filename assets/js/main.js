

'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initSmoothScroll();
  initVideoModal();
  initPreregModal();
  initSidorEasterEgg();
  initCopyIpButton();

  if (!prefersReducedMotion) {
    initMagicalCursor();
    initTileHoverDistortion();
    initScrollReveal();
  } else {
    // Сразу показываем тайлы без анимации
    document.querySelectorAll('.features__tile').forEach(tile => {
      tile.classList.add('is-revealed');
    });
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
  if (!copyGroup) return;

  const ipValue = copyGroup.querySelector('.desktop-header__ip-value');
  const tooltip = copyGroup.querySelector('.desktop-header__tooltip');
  
  if (!ipValue || !tooltip) return;

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

function initTileHoverDistortion() {
  const tiles = document.querySelectorAll('.features__tile');
  const svgDefs = document.querySelector('svg.sr-only defs');
  if (!tiles.length || !svgDefs) return;

  const maxScale = 35;

  tiles.forEach((tile, index) => {
    const img = tile.querySelector('.features__tile-img');
    const filterId = `distort-tile-hover-${index}`;
    const mapId = `displacement-hover-${index}`;

    const filterHTML = `
      <filter id="${filterId}" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="1" result="noise" />
        <feDisplacementMap id="${mapId}" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    `;
    svgDefs.insertAdjacentHTML('beforeend', filterHTML);

    const displacementMap = document.getElementById(mapId);

    img.style.filter = '';

    let isHovered = false;
    let currentScale = 0;
    let animationFrame;

    const animate = () => {
      const targetScale = isHovered ? maxScale : 0;

      if (isHovered && img.style.filter === '') {
        img.style.filter = `url(#${filterId})`;
      }

      currentScale += (targetScale - currentScale) * (isHovered ? 0.015 : 0.01);

      displacementMap.setAttribute('scale', currentScale);

      if (Math.abs(targetScale - currentScale) > 0.1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        displacementMap.setAttribute('scale', targetScale);

        if (!isHovered) {
          img.style.filter = '';
        }
      }
    };

    tile.addEventListener('mouseenter', () => {
      isHovered = true;
      cancelAnimationFrame(animationFrame);
      animate();
    });

    tile.addEventListener('mouseleave', () => {
      isHovered = false;
      cancelAnimationFrame(animationFrame);
      animate();
    });
  });
}

function initScrollReveal() {
  const tiles = document.querySelectorAll('.features__tile');
  const svgDefs = document.querySelector('svg.sr-only defs');
  if (!tiles.length || !svgDefs) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const tile = entry.target;
        const index = Array.from(tiles).indexOf(tile);
        const delay = index * 150;

        const filterId = `distort-reveal-${index}`;
        const mapId = `displacement-reveal-${index}`;

        const filterHTML = `
          <filter id="${filterId}" color-interpolation-filters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.15" numOctaves="1" result="noise" />
            <feDisplacementMap id="${mapId}" in="SourceGraphic" in2="noise" scale="150" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        `;
        svgDefs.insertAdjacentHTML('beforeend', filterHTML);

        const displacementMap = document.getElementById(mapId);

        setTimeout(() => {

          tile.style.filter = `url(#${filterId})`;
          tile.classList.add('is-revealed');

          let currentScale = 150;
          let animationFrame;

          const animateReveal = () => {

            currentScale += (0 - currentScale) * 0.02;
            displacementMap.setAttribute('scale', currentScale);

            if (currentScale > 0.5) {
              animationFrame = requestAnimationFrame(animateReveal);
            } else {
              displacementMap.setAttribute('scale', 0);
              tile.style.filter = '';
            }
          };

          animateReveal();
        }, delay);

        observer.unobserve(tile);
      }
    });
  }, observerOptions);

  tiles.forEach(tile => {
    observer.observe(tile);
  });
}

function initSidorEasterEgg() {
  const egg = document.getElementById('sidorEasterEgg');
  const footer = document.getElementById('footer');
  if (!egg || !footer) return;

  if (sessionStorage.getItem('sidorShown')) {
    egg.remove();
    return;
  }

  const observer = new IntersectionObserver((entries, observerObj) => {
    entries.forEach(entry => {

      if (entry.isIntersecting) {

        setTimeout(() => {
          egg.classList.add('is-visible');
          egg.setAttribute('aria-hidden', 'false');
          sessionStorage.setItem('sidorShown', 'true');
        }, 500);

        setTimeout(() => {
          egg.classList.remove('is-visible');
          egg.setAttribute('aria-hidden', 'true');

          setTimeout(() => {
            egg.remove();
          }, 1000);
        }, 4500);

        observerObj.unobserve(footer);
      }
    });
  }, {
    root: null,
    threshold: 0.1
  });

  observer.observe(footer);
}

