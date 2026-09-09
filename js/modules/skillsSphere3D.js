/**
 * Module Moteur 3D Sphérique Interactif (WebGL / Canvas Perspective 3D)
 * Rendu à 60 FPS avec physique d'inertie, liens orbitaux et détection de collision.
 */
import { skillsData } from '../data/skills.js';

export function initSkillsSphere3D() {
  const canvas = document.getElementById('skills3dCanvas');
  const box = document.querySelector('.skills-3d-box');
  const hud = document.getElementById('skills3dHud');
  const hudTitle = document.getElementById('hudTitle');
  const hudCategory = document.getElementById('hudCategory');
  const hudLevel = document.getElementById('hudLevel');
  const hudDesc = document.getElementById('hudDesc');
  const btnToggleRotate = document.getElementById('btnToggleRotate');
  const btnResetRotate = document.getElementById('btnResetRotate');

  if (!canvas || !box) return;

  const ctx = canvas.getContext('2d');
  let width = 0;
  let height = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  // Paramètres 3D
  const fov = 420;
  let sphereRadius = 160;
  let rotX = 0.2;
  let rotY = 0.3;
  let vx = 0.002;
  let vy = 0.003;
  let autoRotate = true;

  // Interaction pointeur
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;
  let mouseX = -9999;
  let mouseY = -9999;
  let hoveredNode = null;

  // Optimisation de visibilité
  let isVisible = false;
  let animId = null;

  function resize() {
    const rect = box.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    sphereRadius = Math.min(width, height) * 0.34;
  }

  // Distribution des nœuds sur la sphère via l'algorithme Fibonacci Sphere
  const N = skillsData.length;
  const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio angle

  const nodes = skillsData.map((skill, i) => {
    const y = 1 - (i / (N - 1 || 1)) * 2;
    const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
    const theta = phi * i;

    const x = Math.cos(theta) * radiusAtY;
    const z = Math.sin(theta) * radiusAtY;

    return {
      skill,
      // Coordonnées de base normalisées
      baseX: x,
      baseY: y,
      baseZ: z,
      // Coordonnées courantes en 3D
      x: 0,
      y: 0,
      z: 0,
      // Coordonnées projetées sur l'écran
      screenX: 0,
      screenY: 0,
      scale: 1,
      radius: 20
    };
  });

  function updateHUD(node) {
    if (!hud) return;

    if (node) {
      hud.classList.remove('hidden');
      if (hudTitle) hudTitle.innerHTML = `<i class="${node.skill.icon}"></i> ${node.skill.name}`;
      if (hudCategory) hudCategory.textContent = node.skill.category;
      if (hudLevel) hudLevel.textContent = node.skill.level;
      if (hudDesc) hudDesc.textContent = node.skill.description;
    } else {
      // Afficher la première compétence par défaut ou masquer
      hud.classList.remove('hidden');
      const defaultSkill = skillsData[0];
      if (hudTitle) hudTitle.innerHTML = `<i class="${defaultSkill.icon}"></i> ${defaultSkill.name}`;
      if (hudCategory) hudCategory.textContent = defaultSkill.category;
      if (hudLevel) hudLevel.textContent = defaultSkill.level;
      if (hudDesc) hudDesc.textContent = defaultSkill.description;
    }
  }

  // Rotation 3D d'un point selon rotX et rotY
  function rotatePoint(x, y, z) {
    // Rotation autour de l'axe Y
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotation autour de l'axe X
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y2 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    return { x: x1, y: y2, z: z2 };
  }

  function render() {
    if (!isVisible) return;

    ctx.clearRect(0, 0, width, height);

    // Inertie et rotation continue
    if (!isDragging) {
      if (autoRotate) {
        rotY += vy;
        rotX += vx;
      }
      // Amortissement de l'inertie
      vx *= 0.96;
      vy *= 0.96;
      if (autoRotate && Math.abs(vy) < 0.002) vy = 0.0025;
      if (autoRotate && Math.abs(vx) < 0.001) vx = 0.0015;
    }

    const cx = width / 2;
    const cy = height / 2;

    // 1. Calcul des positions 3D et projection
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const r = rotatePoint(
        node.baseX * sphereRadius,
        node.baseY * sphereRadius,
        node.baseZ * sphereRadius
      );

      node.x = r.x;
      node.y = r.y;
      node.z = r.z;

      // Projection en perspective
      const scale = fov / (fov + node.z);
      node.scale = scale;
      node.screenX = cx + node.x * scale;
      node.screenY = cy + node.y * scale;
      node.radius = Math.max(14, 22 * scale);
    }

    // 2. Détection de survol (du plus proche au plus lointain)
    let foundHover = null;
    const sortedNodes = [...nodes].sort((a, b) => b.z - a.z);

    for (let i = 0; i < sortedNodes.length; i++) {
      const node = sortedNodes[i];
      const dx = mouseX - node.screenX;
      const dy = mouseY - node.screenY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < node.radius * 1.5 && node.z > -sphereRadius * 0.5) {
        foundHover = node;
        break;
      }
    }

    if (foundHover !== hoveredNode) {
      hoveredNode = foundHover;
      canvas.style.cursor = hoveredNode ? 'pointer' : (isDragging ? 'grabbing' : 'grab');
      if (hoveredNode) {
        updateHUD(hoveredNode);
      }
    }

    // 3. Dessin des lignes de liaison orbitales (Constellation 3D)
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const n1 = nodes[i];
        const n2 = nodes[j];
        const dx = n1.x - n2.x;
        const dy = n1.y - n2.y;
        const dz = n1.z - n2.z;
        const dist3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist3D < sphereRadius * 0.95) {
          const avgZ = (n1.z + n2.z) / 2;
          const alpha = Math.max(0.03, (1 - dist3D / (sphereRadius * 0.95)) * 0.25 * ((avgZ + sphereRadius) / (2 * sphereRadius)));
          ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(n1.screenX, n1.screenY);
          ctx.lineTo(n2.screenX, n2.screenY);
          ctx.stroke();
        }
      }
    }

    // 4. Rendu des nœuds 3D triés par profondeur (Z-buffering logique)
    const renderList = [...nodes].sort((a, b) => a.z - b.z);

    for (let i = 0; i < renderList.length; i++) {
      const node = renderList[i];
      const isHovered = hoveredNode === node;
      const alpha = Math.max(0.25, (node.z + sphereRadius) / (sphereRadius * 2));
      const accent = node.skill.accentColor || '#06b6d4';

      // Nœud principal
      ctx.save();
      ctx.translate(node.screenX, node.screenY);

      // Halo lumineux d'accentuation
      const glowRadius = isHovered ? node.radius * 2.2 : node.radius * 1.4;
      const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, glowRadius);
      grad.addColorStop(0, accent);
      grad.addColorStop(0.4, `rgba(6, 182, 212, ${alpha * 0.4})`);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(0, 0, glowRadius, 0, Math.PI * 2);
      ctx.fill();

      // Cercle central
      ctx.fillStyle = isHovered ? '#ffffff' : (node.skill.color || '#0a0f1d');
      ctx.beginPath();
      ctx.arc(0, 0, node.radius * 0.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = isHovered ? '#ffffff' : accent;
      ctx.lineWidth = isHovered ? 2.5 : 1.5;
      ctx.stroke();

      // Étiquette textuelle futuriste
      const fontSize = Math.max(10, Math.round(13 * node.scale * (isHovered ? 1.25 : 1)));
      ctx.font = `600 ${fontSize}px 'Plus Jakarta Sans', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const label = node.skill.name.split(' ')[0];
      const textWidth = ctx.measureText(label).width;
      const boxPadX = 8;
      const boxPadY = 4;
      const tagY = node.radius + fontSize;

      // Fond du tag
      ctx.fillStyle = isHovered ? 'rgba(6, 182, 212, 0.95)' : `rgba(2, 6, 23, ${Math.max(0.6, alpha)})`;
      ctx.strokeStyle = isHovered ? '#ffffff' : `rgba(6, 182, 212, ${alpha * 0.7})`;
      ctx.lineWidth = 1;

      ctx.beginPath();
      ctx.roundRect(
        -textWidth / 2 - boxPadX,
        tagY - fontSize / 2 - boxPadY,
        textWidth + boxPadX * 2,
        fontSize + boxPadY * 2,
        6
      );
      ctx.fill();
      ctx.stroke();

      // Texte
      ctx.fillStyle = isHovered ? '#020617' : '#ffffff';
      ctx.fillText(label, 0, tagY);

      ctx.restore();
    }

    animId = requestAnimationFrame(render);
  }

  // Événements de souris & Touch
  function handlePointerDown(e) {
    isDragging = true;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    lastMouseX = clientX;
    lastMouseY = clientY;
  }

  function handlePointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    mouseX = clientX - rect.left;
    mouseY = clientY - rect.top;

    if (isDragging) {
      const deltaX = clientX - lastMouseX;
      const deltaY = clientY - lastMouseY;

      vy = deltaX * 0.005;
      vx = -deltaY * 0.005;

      rotY += vy;
      rotX += vx;

      lastMouseX = clientX;
      lastMouseY = clientY;
    }
  }

  function handlePointerUp() {
    isDragging = false;
  }

  function handlePointerLeave() {
    isDragging = false;
    mouseX = -9999;
    mouseY = -9999;
    if (hoveredNode) {
      hoveredNode = null;
      canvas.style.cursor = 'grab';
    }
  }

  // Clic sur un nœud 3D pour faire défiler vers la carte correspondante
  canvas.addEventListener('click', () => {
    if (hoveredNode) {
      const cardEl = document.querySelector(`.skill-card[data-skill-id="${hoveredNode.skill.id}"]`);
      if (cardEl) {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cardEl.classList.add('skill-card-highlight');
        setTimeout(() => cardEl.classList.remove('skill-card-highlight'), 1600);
      }
    }
  });

  canvas.addEventListener('mousedown', handlePointerDown);
  window.addEventListener('mousemove', handlePointerMove);
  window.addEventListener('mouseup', handlePointerUp);
  canvas.addEventListener('mouseleave', handlePointerLeave);

  canvas.addEventListener('touchstart', handlePointerDown, { passive: true });
  window.addEventListener('touchmove', handlePointerMove, { passive: true });
  window.addEventListener('touchend', handlePointerUp);

  // Boutons de contrôle
  if (btnToggleRotate) {
    btnToggleRotate.addEventListener('click', () => {
      autoRotate = !autoRotate;
      const icon = btnToggleRotate.querySelector('i');
      if (icon) {
        icon.className = autoRotate ? 'fa-solid fa-pause' : 'fa-solid fa-play';
      }
    });
  }

  if (btnResetRotate) {
    btnResetRotate.addEventListener('click', () => {
      rotX = 0.2;
      rotY = 0.3;
      vx = 0.002;
      vy = 0.003;
    });
  }

  window.addEventListener('resize', () => {
    resize();
  });

  // Cycle de vie : exécuter uniquement quand visible à l'écran
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVisible = true;
        resize();
        render();
      } else {
        isVisible = false;
        cancelAnimationFrame(animId);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(box);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isVisible = false;
      cancelAnimationFrame(animId);
    } else {
      isVisible = true;
      render();
    }
  });

  // Initialisation initiale
  resize();
  updateHUD(null);
}

