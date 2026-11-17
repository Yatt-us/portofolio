/**
 * Entête intelligent : se masque en descendant, revient en remontant,
 * et affiche la progression de lecture de la page.
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
  }

  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  header.addEventListener('focusin', () => header.classList.remove('header-hidden'));
  update();
}
