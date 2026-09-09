/**
 * Moteur 3D d'Orbite Stellaire autour de la Photo de Profil
 * Calcul mathématique des coordonnées elliptiques 3D, z-sorting et parallaxe souris.
 */
import { profileTechsData } from '../data/profileTechs.js';

export function initProfileOrbit3D() {
  const wrapper = document.getElementById('profileOrbitWrapper');
  const avatarContainer = document.getElementById('profileAvatarContainer');
  const orbitStage = document.getElementById('orbitStage');

  if (!wrapper || !orbitStage) return;

  const N = profileTechsData.length;
  let angle = 0;
  let baseSpeed = 0.007;
  let currentSpeed = baseSpeed;
  let isHoveringNode = false;

  // Parallaxe souris
  let mouseTiltX = 0;
  let mouseTiltY = 0;
  let currentTiltX = 0;
  let currentTiltY = 0;

  // Variables d'animation
  let isVisible = false;
  let animId = null;

  // Rayons d'orbite adaptés à la taille du conteneur
  let rx = 195;
  let ry = 195;
  const tiltRad = 68 * (Math.PI / 180); // Inclinaison de 68 degrés

  function updateDimensions() {
    const w = wrapper.clientWidth || 420;
    if (w < 360) {
      rx = 140;
      ry = 140;
    } else if (w < 440) {
      rx = 165;
      ry = 165;
    } else {
      rx = 195;
      ry = 195;
    }
  }

  // Création des éléments DOM des technologies en orbite
  orbitStage.innerHTML = '';

  // Anneaux orbitaux visuels
  const trackRing = document.createElement('div');
  trackRing.className = 'orbit-track-ring';
  orbitStage.appendChild(trackRing);

  const trackRingSec = document.createElement('div');
  trackRingSec.className = 'orbit-track-ring secondary';
  orbitStage.appendChild(trackRingSec);

  // Création des nœuds des technologies
  const nodeElements = profileTechsData.map((tech, i) => {
    const node = document.createElement('div');
    node.className = 'orbit-tech-node';
    node.dataset.techId = tech.id;
    node.style.borderColor = tech.color;
    node.style.setProperty('--node-glow', tech.glow);

    node.innerHTML = `
      <i class="${tech.icon}" style="color: ${tech.color};"></i>
      <span class="orbit-tech-tooltip">${tech.name}</span>
    `;

    // Ralentir et zoomer au survol
    node.addEventListener('mouseenter', () => {
      isHoveringNode = true;
    });

    node.addEventListener('mouseleave', () => {
      isHoveringNode = false;
    });

    // Clic : surbrillance de la compétence correspondante si présente
    node.addEventListener('click', (e) => {
      e.stopPropagation();
      const skillCard = document.querySelector(`.skill-card[data-skill-id="${tech.id}"]`);
      if (skillCard) {
        skillCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        skillCard.classList.add('skill-card-highlight');
        setTimeout(() => skillCard.classList.remove('skill-card-highlight'), 1600);
      }
    });

    orbitStage.appendChild(node);
    return node;
  });

  // Boucle d'animation 3D à 60 FPS
  function animate() {
    if (!isVisible) return;

    // Ajustement dynamique de la vitesse (décélération fluide au survol)
    const targetSpeed = isHoveringNode ? 0.0012 : baseSpeed;
    currentSpeed += (targetSpeed - currentSpeed) * 0.1;
    angle += currentSpeed;

    // Amortissement de la parallaxe souris
    currentTiltX += (mouseTiltX - currentTiltX) * 0.08;
    currentTiltY += (mouseTiltY - currentTiltY) * 0.08;

    if (avatarContainer) {
      avatarContainer.style.transform = `rotateY(${currentTiltX * 8}deg) rotateX(${-currentTiltY * 8}deg)`;
    }

    const sinTilt = Math.sin(tiltRad);
    const cosTilt = Math.cos(tiltRad);

    // Calcul de la position de chaque technologie
    for (let i = 0; i < N; i++) {
      const node = nodeElements[i];
      const nodeAngle = angle + (i * 2 * Math.PI) / N;

      // Coordonnées dans le plan orbital
      const rawX = rx * Math.cos(nodeAngle);
      const rawY = ry * Math.sin(nodeAngle);

      // Projection 3D avec l'angle d'inclinaison
      // X reste sur l'axe horizontal
      const x = rawX;
      // Y est compressé par l'inclinaison
      const y = rawY * cosTilt;
      // Z donne la profondeur (négatif = derrière la photo, positif = devant)
      const z = rawY * sinTilt;

      // Échelle perspective : les éléments devant sont plus grands
      const scale = 0.82 + ((z + ry) / (2 * ry)) * 0.38; // de 0.82 à 1.20

      // Opacité et flou selon la profondeur
      const isFront = z > 0;
      const opacity = isFront ? 1 : Math.max(0.4, 0.45 + ((z + ry) / (2 * ry)) * 0.45);
      const zIndex = isFront ? 20 : 2; // La photo de profil est à z-index: 10

      // Application des transformations
      node.style.left = `50%`;
      node.style.top = `50%`;
      node.style.transform = `translate(-50%, -50%) translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0px) scale(${scale.toFixed(2)})`;
      node.style.opacity = opacity.toFixed(2);
      node.style.zIndex = zIndex;

      // Ombre lumineuse plus intense quand l'icône est au premier plan
      if (isFront) {
        node.style.boxShadow = `0 0 ${Math.round(14 * scale)}px ${profileTechsData[i].glow}`;
      } else {
        node.style.boxShadow = 'none';
      }
    }

    animId = requestAnimationFrame(animate);
  }

  // Interaction souris / Parallaxe
  wrapper.addEventListener('mousemove', (e) => {
    const rect = wrapper.getBoundingClientRect();
    mouseTiltX = (e.clientX - rect.left) / rect.width - 0.5;
    mouseTiltY = (e.clientY - rect.top) / rect.height - 0.5;
  });

  wrapper.addEventListener('mouseleave', () => {
    mouseTiltX = 0;
    mouseTiltY = 0;
    isHoveringNode = false;
  });

  window.addEventListener('resize', () => {
    updateDimensions();
  });

  // Cycle de vie (IntersectionObserver) : mise en pause quand non visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        updateDimensions();
        animate();
      } else {
        isVisible = false;
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(wrapper);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(animId);
    } else {
      isVisible = true;
      animate();
    }
  });

  updateDimensions();
}

