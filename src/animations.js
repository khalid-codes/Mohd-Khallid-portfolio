// Modern 60 FPS Animation & Micro-Interaction Engine
// Uses Compositor-thread transforms & IntersectionObserver

export function initScrollReveals() {
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.1
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');

        // Animate counter numbers inside
        const counters = entry.target.querySelectorAll('[data-counter]');
        counters.forEach((counter) => animateCounter(counter));

        // If the element itself is a counter
        if (entry.target.hasAttribute('data-counter')) {
          animateCounter(entry.target);
        }

        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
    revealObserver.observe(el);
  });
}

// Fluid Number Counter Animation with Ease-Out
export function animateCounter(el) {
  if (el.dataset.animated === 'true') return;
  el.dataset.animated = 'true';

  const target = parseFloat(el.getAttribute('data-counter'));
  const suffix = el.getAttribute('data-suffix') || '';
  const prefix = el.getAttribute('data-prefix') || '';
  const duration = 1200; // ms
  const startTime = performance.now();

  function updateCount(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease-out cubic: 1 - Math.pow(1 - progress, 3)
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.floor(eased * target);

    el.innerText = `${prefix}${currentVal}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(updateCount);
    } else {
      el.innerText = `${prefix}${target}${suffix}`;
    }
  }

  requestAnimationFrame(updateCount);
}

// 3D Card Hover Tilt and Dynamic Specular Highlight
export function initCardTilt() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const tiltCards = document.querySelectorAll('.case-study-card, .process-card, .skill-minimal-card, .timeline-entry-card, .project-item-card, .process-step-box, .timeline-card-block');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Gentle 3D perspective tilt
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -2.5;
      const rotateY = ((x - centerX) / centerX) * 2.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// Magnetic Button Interaction
export function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-case-deepdive, .btn-header-resume, .btn-pill-light, .btn-pill-glass, .btn-open-deepdive, .btn-copy-blue, .btn-submit-swiss');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}
