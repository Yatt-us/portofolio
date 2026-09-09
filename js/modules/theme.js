/**
 * Module de gestion du thème Clair / Sombre
 */
const STORAGE_KEY = 'portfolio-theme-preference';

export function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const body = document.body;

  if (!themeToggle) return;

  function applyTheme(isDark) {
    if (isDark) {
      body.classList.remove('light-theme');
      body.classList.add('dark-theme');
      if (themeIcon) themeIcon.className = 'fa-solid fa-sun';
    } else {
      body.classList.remove('dark-theme');
      body.classList.add('light-theme');
      if (themeIcon) themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // Vérifier la préférence sauvegardée ou le choix système
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme !== null ? savedTheme === 'dark' : systemPrefersDark;

  applyTheme(isDark);

  // Basculement au clic
  themeToggle.addEventListener('click', () => {
    const currentlyDark = body.classList.contains('dark-theme');
    const newTheme = !currentlyDark;
    localStorage.setItem(STORAGE_KEY, newTheme ? 'dark' : 'light');
    applyTheme(newTheme);
  });

  // Écouteur des changements système
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (localStorage.getItem(STORAGE_KEY) === null) {
      applyTheme(e.matches);
    }
  });
}

