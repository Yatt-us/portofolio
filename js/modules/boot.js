/**
 * Intro immersive : séquence de démarrage façon terminal sécurisé.
 * Affichée une fois par session (décidé par le script inline du <head>),
 * passable d'un clic, d'une touche ou au défilement.
 */
const LINES = [
  'Démarrage de yattara-sec v4.0',
  'Pare-feu actif · chiffrement TLS 1.3',
  'Modules chargés : Kali · Spring Boot · Angular · Flutter',
  'Analyse de vulnérabilités terminée : 0 faille critique'
];

export function initBoot() {
  const root = document.documentElement;
  if (!root.classList.contains('booting')) return;

  try { sessionStorage.setItem('yattara-boot', '1'); } catch (e) { /* navigation privée */ }

  const overlay = document.createElement('div');
  overlay.className = 'boot';
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = `
    <div class="boot-inner">
      <div class="boot-lines"></div>
      <div class="boot-bar"><span></span></div>
      <p class="boot-skip">Cliquez ou appuyez sur une touche pour passer</p>
    </div>`;
  document.body.appendChild(overlay);

  const linesEl = overlay.querySelector('.boot-lines');
  const bar = overlay.querySelector('.boot-bar span');
  const timers = [];
  let finished = false;

  LINES.forEach((text, i) => {
    timers.push(setTimeout(() => {
      const line = document.createElement('div');
      line.className = 'boot-line';
      line.innerHTML = `<span class="ok">[ OK ]</span> ${text}`;
      linesEl.appendChild(line);
      bar.style.width = `${((i + 1) / (LINES.length + 1)) * 100}%`;
    }, 200 + i * 330));
  });

  timers.push(setTimeout(() => {
    const line = document.createElement('div');
    line.className = 'boot-line final';
    line.innerHTML = '&gt; <span>Accès autorisé. Bienvenue.</span>';
    linesEl.appendChild(line);
    bar.style.width = '100%';
  }, 200 + LINES.length * 330 + 150));

  timers.push(setTimeout(finish, 200 + LINES.length * 330 + 900));

  function finish() {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    ['click', 'keydown', 'wheel', 'touchstart'].forEach((evt) => window.removeEventListener(evt, finish));
    overlay.classList.add('boot-done');
    setTimeout(() => {
      overlay.remove();
      root.classList.remove('booting');
    }, 600);
  }

  ['click', 'keydown', 'wheel', 'touchstart'].forEach((evt) =>
    window.addEventListener(evt, finish, { passive: true })
  );
}
