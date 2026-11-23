/**
 * Rôles tapés en direct sous le titre du hero (style terminal).
 */
const ROLES = [
  "Audit & tests d'intrusion",
  'Sécurité réseau & systèmes Linux',
  'Applications web & mobiles sécurisées',
  'Cloud AWS & DevOps'
];

export function initTypedRoles() {
  const el = document.getElementById('heroRoles');
  if (!el) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.textContent = ROLES[0];
    return;
  }

  let role = 0;
  let i = 0;
  let deleting = false;

  function tick() {
    const word = ROLES[role];
    if (!deleting) {
      i++;
      el.textContent = word.slice(0, i);
      if (i === word.length) {
        deleting = true;
        setTimeout(tick, 1700);
        return;
      }
      setTimeout(tick, 45 + Math.random() * 40);
      return;
    }

    i--;
    el.textContent = word.slice(0, i);
    if (i === 0) {
      deleting = false;
      role = (role + 1) % ROLES.length;
      setTimeout(tick, 300);
      return;
    }
    setTimeout(tick, 22);
  }

  setTimeout(tick, 600);
}
