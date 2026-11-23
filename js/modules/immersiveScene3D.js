/**
 * Scène 3D immersive (Three.js) — globe réseau « sécurisé » en fond de tout le site.
 * - Hero : le globe occupe la colonne de droite, des paquets de données circulent entre les nœuds.
 * - Défilement : il glisse au centre, recule et s'estompe, puis tourne avec la page.
 * - Souris : légère inclinaison (parallaxe). Thème clair / sombre pris en charge.
 * Three.js est chargé à la demande via l'import map : si le CDN ou WebGL échoue,
 * le canvas est retiré et le site reste identique.
 */
export async function initImmersiveScene() {
  const canvas = document.getElementById('immersiveScene');
  if (!canvas) return;

  let THREE;
  try {
    THREE = await import('three');
  } catch (err) {
    canvas.remove();
    return;
  }

  const mqMobile = window.matchMedia('(max-width: 968px)');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: !mqMobile.matches,
      alpha: true,
      powerPreference: 'high-performance'
    });
  } catch (err) {
    canvas.remove();
    return;
  }
  renderer.setClearColor(0x000000, 0);
  document.body.classList.add('has-scene');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
  camera.position.set(0, 0, 7);

  // Couleurs : cyan d'accent + dégradé défini dans css/variables.css
  const rootStyle = getComputedStyle(document.documentElement);
  const cssColor = (name, fallback) =>
    new THREE.Color((rootStyle.getPropertyValue(name) || '').trim() || fallback);
  const CYAN = new THREE.Color('#06b6d4');
  const PALETTE = [
    cssColor('--grad-1', '#f97316'),
    cssColor('--grad-2', '#f43f5e'),
    cssColor('--grad-3', '#d946ef')
  ];

  // Matériaux suivis pour le changement de thème
  const themed = [];
  function track(mat, dark, light, blendable = true) {
    themed.push({ mat, dark, light, blendable });
    return mat;
  }

  // Texture ronde et douce pour les points
  const dotTex = (() => {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.35, 'rgba(255,255,255,0.85)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd;
    g.fillRect(0, 0, 64, 64);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  })();

  function fibonacciSphere(n, r) {
    const pts = [];
    const phi = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < n; i++) {
      const y = 1 - (i / (n - 1)) * 2;
      const rad = Math.sqrt(1 - y * y);
      const t = phi * i;
      pts.push(new THREE.Vector3(Math.cos(t) * rad * r, y * r, Math.sin(t) * rad * r));
    }
    return pts;
  }

  // Hiérarchie : world (mise en page + défilement) > tilt (souris) > globe (rotation)
  const world = new THREE.Group();
  const tilt = new THREE.Group();
  const globe = new THREE.Group();
  scene.add(world);
  world.add(tilt);
  tilt.add(globe);

  const R = 1.6;
  const small = mqMobile.matches;

  // Noyau opaque : masque l'arrière du globe pour donner du volume
  const core = new THREE.Mesh(
    new THREE.SphereGeometry(R * 0.985, 48, 48),
    track(new THREE.MeshBasicMaterial({ transparent: true }),
      { color: '#020617', opacity: 0.88 }, { color: '#f8fafc', opacity: 0.9 }, false)
  );
  core.renderOrder = 0;
  globe.add(core);

  // Maillage filaire
  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(R, 3)),
    track(new THREE.LineBasicMaterial({ transparent: true, depthWrite: false }),
      { color: '#06b6d4', opacity: 0.16 }, { color: '#0e7490', opacity: 0.22 })
  );
  wire.renderOrder = 1;
  globe.add(wire);

  // Points de surface
  const dots = new THREE.Points(
    new THREE.BufferGeometry().setFromPoints(fibonacciSphere(small ? 900 : 1600, R * 1.002)),
    track(new THREE.PointsMaterial({ size: 0.035, map: dotTex, transparent: true, depthWrite: false }),
      { color: '#22d3ee', opacity: 0.55 }, { color: '#0e7490', opacity: 0.5 })
  );
  dots.renderOrder = 1;
  globe.add(dots);

  // Nœuds du réseau (couleurs du dégradé)
  const nodeCount = small ? 18 : 30;
  const nodePts = fibonacciSphere(nodeCount * 7, R * 1.01)
    .sort(() => Math.random() - 0.5)
    .slice(0, nodeCount);
  const nodeGeo = new THREE.BufferGeometry().setFromPoints(nodePts);
  const nodeColors = new Float32Array(nodeCount * 3);
  nodePts.forEach((p, i) => {
    const c = PALETTE[i % PALETTE.length];
    nodeColors.set([c.r, c.g, c.b], i * 3);
  });
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
  const nodeMat = track(
    new THREE.PointsMaterial({ size: 0.14, map: dotTex, vertexColors: true, transparent: true, depthWrite: false }),
    { opacity: 1 }, { opacity: 0.95 }
  );
  const nodes = new THREE.Points(nodeGeo, nodeMat);
  nodes.renderOrder = 2;
  globe.add(nodes);

  // Arcs de connexion + paquets de données qui circulent
  const arcs = [];
  const arcCount = small ? 9 : 16;
  const packetGeo = new THREE.SphereGeometry(0.028, 10, 10);
  for (let tries = 0; arcs.length < arcCount && tries < 400; tries++) {
    const a = nodePts[Math.floor(Math.random() * nodeCount)];
    const b = nodePts[Math.floor(Math.random() * nodeCount)];
    const sum = a.clone().add(b);
    if (a === b || a.distanceTo(b) < R * 0.6 || sum.length() < 0.3) continue;

    const mid = sum.normalize().multiplyScalar(R * (1.15 + a.distanceTo(b) * 0.18));
    const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
    const color = PALETTE[arcs.length % PALETTE.length];

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)),
      track(new THREE.LineBasicMaterial({ color, transparent: true, depthWrite: false }),
        { opacity: 0.45 }, { opacity: 0.6 })
    );
    line.renderOrder = 1;
    globe.add(line);

    const packet = new THREE.Mesh(
      packetGeo,
      track(new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }),
        { color: '#ffffff', opacity: 1 }, { color: color.getStyle(), opacity: 1 })
    );
    packet.renderOrder = 3;
    const t = Math.random();
    packet.position.copy(curve.getPoint(t));
    globe.add(packet);

    arcs.push({ curve, packet, t, speed: 0.12 + Math.random() * 0.18 });
  }

  // Anneaux de scan (ne tournent pas avec le globe)
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(R * 1.32, 0.006, 6, 200),
    track(new THREE.MeshBasicMaterial({ transparent: true, depthWrite: false }),
      { color: '#22d3ee', opacity: 0.55 }, { color: '#0891b2', opacity: 0.55 })
  );
  ring1.rotation.x = Math.PI / 2.3;
  ring1.renderOrder = 1;

  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(R * 1.48, 0.004, 6, 200),
    track(new THREE.MeshBasicMaterial({ color: PALETTE[2], transparent: true, depthWrite: false }),
      { opacity: 0.35 }, { opacity: 0.45 })
  );
  ring2.rotation.set(Math.PI / 1.8, 0.4, 0);
  ring2.renderOrder = 1;
  tilt.add(ring1, ring2);

  // Champ d'étoiles lointain
  const starCount = small ? 500 : 1100;
  const starPos = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const r = 10 + Math.random() * 22;
    const u = Math.random() * 2 - 1;
    const th = Math.random() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    starPos.set([Math.cos(th) * s * r, u * r, Math.sin(th) * s * r - 6], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const stars = new THREE.Points(
    starGeo,
    track(new THREE.PointsMaterial({ size: 0.06, map: dotTex, transparent: true, depthWrite: false }),
      { color: '#cbd5e1', opacity: 0.55 }, { color: '#334155', opacity: 0.3 })
  );
  scene.add(stars);

  // ---------------------------------------------------------------- Thème
  function applyTheme() {
    const light = document.body.classList.contains('light-theme');
    themed.forEach(({ mat, dark, light: lt, blendable }) => {
      const s = light ? lt : dark;
      if (s.color) mat.color.set(s.color);
      mat.opacity = s.opacity;
      if (blendable) {
        // Additif = lumineux sur fond sombre ; il disparaîtrait sur fond clair
        const blend = light ? THREE.NormalBlending : THREE.AdditiveBlending;
        if (mat.blending !== blend) {
          mat.blending = blend;
          mat.needsUpdate = true;
        }
      }
    });
    requestRender();
  }
  new MutationObserver(applyTheme).observe(document.body, { attributes: true, attributeFilter: ['class'] });

  // ---------------------------------------------------------------- Mise en page
  let heroX = 0, heroY = 0, heroScale = 1, heroOpacity = 1, restOpacity = 0.3;

  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mqMobile.matches ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();

    const visH = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    const visW = visH * camera.aspect;

    if (mqMobile.matches) {
      // Mobile : globe centré derrière le texte, plus discret
      heroX = 0;
      heroY = visH * 0.12;
      heroScale = Math.min(1, visW / (R * 2 * 1.55));
      heroOpacity = 0.45;
      restOpacity = 0.2;
    } else {
      // Bureau : globe dans la colonne de droite du hero
      heroX = visW * 0.23;
      heroY = -visH * 0.02;
      heroScale = Math.max(0.75, Math.min(1.1, visW / 9));
      heroOpacity = 1;
      restOpacity = 0.3;
    }
    requestRender();
  }

  // ---------------------------------------------------------------- Défilement & souris
  let scrollY = window.scrollY;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
    requestRender();
  }, { passive: true });

  let mx = 0, my = 0, tx = 0, ty = 0;
  if (finePointer && !reduceMotion) {
    window.addEventListener('pointermove', (e) => {
      mx = e.clientX / window.innerWidth - 0.5;
      my = e.clientY / window.innerHeight - 0.5;
    }, { passive: true });
  }

  const lerp = (a, b, t) => a + (b - a) * t;
  const ease = (t) => t * t * (3 - 2 * t);

  // ---------------------------------------------------------------- Boucle
  const clock = new THREE.Clock();
  let running = false;
  let rafId = 0;
  let spin = 0;
  let introT = reduceMotion ? 1 : 0;
  let lastOpacity = '';

  function frame() {
    rafId = 0;
    const dt = Math.min(clock.getDelta(), 0.05);

    if (!reduceMotion) {
      spin += dt * 0.12;
      introT = Math.min(1, introT + dt / 1.6);
      ring1.rotation.z += dt * 0.5;
      ring2.rotation.z -= dt * 0.3;
      stars.rotation.y += dt * 0.01;
      for (const a of arcs) {
        a.t = (a.t + dt * a.speed) % 1;
        a.packet.position.copy(a.curve.getPoint(a.t));
      }
      nodeMat.size = 0.13 + Math.sin(clock.elapsedTime * 2.2) * 0.03;
      tx += (mx - tx) * 0.05;
      ty += (my - ty) * 0.05;
    }

    const p = ease(Math.min(1, scrollY / (window.innerHeight * 0.9)));
    const intro = ease(introT);

    world.position.set(lerp(heroX, 0, p), lerp(heroY, 0, p), lerp(0, -2.5, p));
    world.scale.setScalar(heroScale * lerp(1, 1.15, p) * lerp(0.6, 1, intro));
    tilt.rotation.set(0.35 + ty * 0.35, tx * 0.5, 0);
    globe.rotation.y = spin + scrollY * 0.0008;

    const opacity = (lerp(heroOpacity, restOpacity, p) * intro).toFixed(3);
    if (opacity !== lastOpacity) {
      canvas.style.opacity = opacity;
      lastOpacity = opacity;
    }

    renderer.render(scene, camera);
    if (running && !reduceMotion) rafId = requestAnimationFrame(frame);
  }

  function requestRender() {
    if (running && !rafId) rafId = requestAnimationFrame(frame);
  }

  function start() {
    if (running) return;
    running = true;
    clock.getDelta();
    requestRender();
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  window.addEventListener('resize', layout);
  mqMobile.addEventListener('change', layout);

  start();
  applyTheme();
  layout();
}
