/**
 * Effet « décodage » des titres de section à leur apparition (style hacker).
 * Seuls les lettres et chiffres sont brouillés ; espaces, ponctuation et emoji restent en place.
 */
const GLYPHS = '!<>-_\\/[]{}=+*^?#$%01ABCDEF';
const SCRAMBLABLE = /[\p{L}\p{N}]/u;

export function initScramble(selector = '.section_title') {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const els = document.querySelectorAll(selector);
  if (!els.length) return;

  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        obs.unobserve(entry.target);
        scramble(entry.target);
      }
    });
  }, { threshold: 0.6 });

  els.forEach((el) => {
    if (el.children.length) return; // texte simple uniquement
    el.setAttribute('aria-label', el.textContent.trim());
    io.observe(el);
  });
}

function scramble(el) {
  const plan = Array.from(el.textContent).map((ch) => ({
    ch,
    end: SCRAMBLABLE.test(ch) ? 8 + Math.floor(Math.random() * 26) : 0
  }));
  let frame = 0;

  (function step() {
    let out = '';
    let done = 0;
    for (const p of plan) {
      if (frame >= p.end) {
        out += p.ch;
        done++;
      } else {
        out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
    }
    el.textContent = out;
    frame++;
    if (done < plan.length) requestAnimationFrame(step);
  })();
}
