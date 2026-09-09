/**
 * Module de gestion du formulaire de contact
 */
export function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = (formData.get('name') || '').trim();
    const email = (formData.get('email') || '').trim();
    const message = (formData.get('message') || '').trim();

    if (!name || !email || !message) {
      if (statusEl) {
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Veuillez renseigner tous les champs requis.';
      }
      return;
    }

    if (statusEl) {
      statusEl.style.color = 'var(--brand-primary)';
      statusEl.textContent = 'Transmission en cours...';
    }

    try {
      // Simulation d'envoi réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      if (statusEl) {
        statusEl.style.color = 'var(--brand-emerald)';
        statusEl.textContent = '✓ Message reçu ! Préparation de l\'ouverture du client email...';
      }

      // Redirection transparente vers le client email avec le destinataire officiel
      setTimeout(() => {
        const mailtoUrl = `mailto:yaliouagmoussa62@email.com?subject=${encodeURIComponent('Contact Portfolio - ' + name)}&body=${encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        window.location.href = mailtoUrl;
        form.reset();
      }, 1200);

    } catch (err) {
      if (statusEl) {
        statusEl.style.color = '#ef4444';
        statusEl.textContent = 'Une erreur est survenue. Veuillez m\'écrire directement à yaliouagmoussa62@email.com';
      }
    }
  });
}

