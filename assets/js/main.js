
'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Donat/Payment modal
  initModal('donationModal', ['.desktop-header__donate', '.showcase__actions .showcase__btn--secondary', '.hero__actions .hero__cta--secondary']);
  
  // Initialize Entry/Pass modal
  initModal('passModal', ['#btnOpenPrereg', '.showcase__actions .showcase__btn--main']);

  initHeader();
  initCopyIpButton();
  initVideoModal();
  initMagicalCursor();
  initSmoothScroll();
  initScrollReveal();
});

/**
 * Magical scroll reveal for about cards
 */
function initScrollReveal() {
  const cards = document.querySelectorAll('.about__card');
  if (cards.length === 0) return;

  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Find index of card in the grid to calculate delay
        const cardArray = Array.from(cards);
        const index = cardArray.indexOf(entry.target);
        entry.target.style.transitionDelay = `${index * 0.2}s`;
        
        entry.target.classList.add('is-revealed');
        // Stop observing once revealed
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  cards.forEach(card => observer.observe(card));
}

/**
 * Initializes a modal with its opening buttons and internal logic
 */
function initModal(modalId, openSelectors) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  const content = modal.querySelector('.prereg-modal__content');
  const overlay = modal.querySelector('.prereg-modal__overlay');
  const closeBtn = modal.querySelector('.prereg-modal__close');

  const openButtons = [];
  openSelectors.forEach(selector => {
    const btns = document.querySelectorAll(selector);
    btns.forEach(btn => openButtons.push(btn));
  });

  function openModal() {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (content) content.focus();
  }

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  // Payment method selection
  const paymentMethods = modal.querySelectorAll('.payment-method');
  paymentMethods.forEach(method => {
    method.addEventListener('click', () => {
      paymentMethods.forEach(m => m.classList.remove('is-active'));
      method.classList.add('is-active');
      const radio = method.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Dynamic RUB suffix positioning logic removed to pin it to the right via CSS
  const amountInput = modal.querySelector('.donation-form__input--amount');
  const currencySpan = modal.querySelector('.donation-form__currency');

  if (amountInput && currencySpan) {
    const updateCurrencyVisibility = () => {
      currencySpan.style.display = amountInput.value ? 'block' : 'none';
    };

    amountInput.addEventListener('input', updateCurrencyVisibility);
    updateCurrencyVisibility();
  }
}

function initHeader() {
  const header = document.querySelector('.desktop-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll);
  handleScroll();
}

function initVideoModal() {
  const modal = document.getElementById('videoModal');
  const iframe = document.getElementById('videoIframe');
  if (!modal || !iframe) return;
  const content = modal.querySelector('.video-modal__content');

  const overlay = modal.querySelector('.video-modal__overlay');
  const closeBtn = modal.querySelector('.video-modal__close');
  let triggerBtn = null;



  const showcaseVideoBtn = document.getElementById('btnPlayVideoShowcase');
  if (showcaseVideoBtn) {
    showcaseVideoBtn.addEventListener('click', () => {
      triggerBtn = showcaseVideoBtn;
      iframe.src = `https://www.youtube.com/embed/I1KXdUwulKQ?autoplay=1&vq=hd1080`;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (content) content.focus();
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

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (overlay) overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function initCopyIpButton() {
  const copyBtns = [
    { container: document.getElementById('btnCopyIp'), value: '.desktop-header__ip-value', tooltip: '.desktop-header__tooltip' },
    { container: document.getElementById('btnCopyIpFooter'), value: '.footer__info-ip', tooltip: '.footer__tooltip' },
    { container: document.getElementById('btnCopyIpMobile'), value: '.desktop-header__ip-value', tooltip: '.desktop-header__tooltip' }
  ];

  copyBtns.forEach(({ container, value, tooltip }) => {
    if (!container) return;
    const ipValue = container.querySelector(value);
    const tooltipEl = container.querySelector(tooltip);

    if (ipValue && tooltipEl) {
      container.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(ipValue.textContent.trim());
          tooltipEl.classList.add('is-active');
          setTimeout(() => tooltipEl.classList.remove('is-active'), 2000);
        } catch (err) {
          console.error('Failed to copy: ', err);
        }
      });
    }
  });
}

function initMagicalCursor() {
  if ('ontouchstart' in window || prefersReducedMotion) return;

  const chars = ['✦', '✧', '★'];
  const colors = ['#FFF2B2', '#FFFFFF', '#DFDCBD'];
  let currentX = -100, currentY = -100, isMouseMoving = false, lastTime = 0;

  function spawnSparkle(x, y) {
    const sparkle = document.createElement('span');
    sparkle.className = 'magical-sparkle';
    sparkle.textContent = chars[Math.floor(Math.random() * chars.length)];
    sparkle.style.color = colors[Math.floor(Math.random() * colors.length)];
    sparkle.style.left = (x + (Math.random() - 0.5) * 20) + 'px';
    sparkle.style.top = (y + (Math.random() - 0.5) * 20) + 'px';
    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 1000);
  }

  document.addEventListener('mousemove', (e) => {
    currentX = e.pageX; currentY = e.pageY;
    isMouseMoving = true;
    const now = Date.now();
    if (now - lastTime < 30) return;
    lastTime = now;
    spawnSparkle(currentX, currentY);
    setTimeout(() => { isMouseMoving = false; }, 100);
  });

  setInterval(() => {
    if (!isMouseMoving && currentX !== -100) spawnSparkle(currentX, currentY);
  }, 250);
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY, behavior: 'smooth' });
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}
