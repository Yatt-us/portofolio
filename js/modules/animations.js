/**
 * Module de gestion des animations d'interface et des observateurs
 */
export function initAnimations() {
  // 1. Suivi du curseur lumineux (désactivé sur écran tactile)
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function updateCursor() {
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;
      cursorGlow.style.left = `${currentX}px`;
      cursorGlow.style.top = `${currentY}px`;
      requestAnimationFrame(updateCursor);
    }
    updateCursor();
  }

  // 2. Effet d'en-tête fixé lors du défilement
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // 3. Observateur d'intersection pour les apparitions en fondu (Fade-in)
  const fadeElements = document.querySelectorAll('.fade');
  if (fadeElements.length > 0) {
    const fadeObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    fadeElements.forEach(el => fadeObserver.observe(el));
  }

  // 4. Observateur pour l'animation des barres de progression
  const bars = document.querySelectorAll('.bar span');
  if (bars.length > 0) {
    const barsObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = bar.dataset.width || '80%';
          obs.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(b => barsObserver.observe(b));
  }

  // 5. Année dynamique du copyright
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

