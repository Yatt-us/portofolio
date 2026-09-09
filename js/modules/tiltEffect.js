/**
 * Module d'effet 3D Tilt Holographique sur les cartes
 * Calcule l'angle d'inclinaison 3D et le reflet spéculaire en fonction du curseur.
 */
export function initTiltEffect(selector = '.skill-card') {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = document.querySelectorAll(selector);
  const maxTilt = 14; // Degrés maximaux d'inclinaison

  cards.forEach(card => {
    // Créer la couche de reflet spéculaire si absente
    let glare = card.querySelector('.skill-card-glare');
    if (!glare) {
      glare = document.createElement('div');
      glare.className = 'skill-card-glare';
      card.appendChild(glare);
    }

    function onMouseMove(e) {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      const rotateX = (-y * maxTilt).toFixed(2);
      const rotateY = (x * maxTilt).toFixed(2);

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

      const glareX = e.clientX - rect.left;
      const glareY = e.clientY - rect.top;
      glare.style.background = `radial-gradient(circle at ${glareX}px ${glareY}px, rgba(6, 182, 212, 0.25) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 65%)`;
    }

    function onMouseLeave() {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    }

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

