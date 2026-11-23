/**
 * Entête intelligent : se masque en descendant, revient en remontant,
 * affiche la progression de lecture et fait glisser une pastille
 * sous le lien de la section visible (ou du lien survolé).
 */
export function initHeader() {
  const header = document.getElementById('header');
  const bar = document.getElementById('readProgress');
  const navLinks = document.getElementById('navLinks');
  if (!header) return;

  const SEUIL = 120;  // pas de masquage tout en haut de page
  const DELTA = 8;    // ignore les micro-mouvements (trackpad, rebonds)
  let lastY = window.scrollY;
  let ticking = false;

  const menuOuvert = () => navLinks && navLinks.classList.contains('open');

  // ---------------------------------------------------- Section active
  const indicator = navLinks ? navLinks.querySelector('.nav-indicator') : null;
  const links = navLinks ? [...navLinks.querySelectorAll('a[href^="#"]')] : [];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  let activeLink = null;
  let hoverLink = null;

  function moveIndicator(link) {
    if (!indicator) return;
    if (!link || getComputedStyle(indicator).display === 'none') {
      indicator.classList.remove('visible');
      return;
    }
    indicator.style.width = `${link.offsetWidth}px`;
    indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    indicator.classList.add('visible');
  }

  function updateActive() {
    const repere = window.innerHeight * 0.35;
    let current = null;
    for (const s of sections) {
      if (s.getBoundingClientRect().top <= repere) current = s;
    }

    const next = current ? links.find((a) => a.getAttribute('href') === `#${current.id}`) : null;
    if (next !== activeLink) {
      links.forEach((a) => {
        const on = a === next;
        a.classList.toggle('active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      activeLink = next;
    }
    if (!hoverLink) moveIndicator(activeLink);
  }

  links.forEach((a) => {
    a.addEventListener('mouseenter', () => { hoverLink = a; moveIndicator(a); });
  });
  if (navLinks) {
    navLinks.addEventListener('mouseleave', () => { hoverLink = null; moveIndicator(activeLink); });
  }

  // ---------------------------------------------------- Défilement
  function update() {
    ticking = false;
    const y = Math.max(0, window.scrollY);
    const max = document.documentElement.scrollHeight - window.innerHeight;

    if (bar) bar.style.setProperty('--p', max > 0 ? Math.min(1, y / max).toFixed(4) : 0);

    const delta = y - lastY;
    if (Math.abs(delta) >= DELTA) {
      // On ne masque jamais pendant que le menu mobile est ouvert ou qu'un lien de l'entête a le focus clavier
      const cacher = delta > 0 && y > SEUIL && !menuOuvert() && !header.contains(document.activeElement);
      header.classList.toggle('header-hidden', cacher);
      lastY = y;
    }
    if (y <= SEUIL) header.classList.remove('header-hidden');

    updateActive();
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', () => { moveIndicator(hoverLink || activeLink); update(); });
  header.addEventListener('focusin', () => header.classList.remove('header-hidden'));

  // Les largeurs des liens changent une fois les polices chargées
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => moveIndicator(hoverLink || activeLink));
  }
  update();
}
