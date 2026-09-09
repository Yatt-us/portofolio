/**
 * Module du Canvas de Particules Cybernétiques
 * Optimisé avec pause automatique en cas d'onglet inactif.
 */
export function initParticles() {
  const canvas = document.getElementById('canvas-particles');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particlesArray = [];
  let animationFrameId = null;
  let isRunning = true;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
  });
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.6;
      this.speedX = (Math.random() - 0.5) * 0.7;
      this.speedY = (Math.random() - 0.5) * 0.7;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width) this.x = 0;
      if (this.x < 0) this.x = canvas.width;
      if (this.y > canvas.height) this.y = 0;
      if (this.y < 0) this.y = canvas.height;
    }

    draw() {
      const isDark = document.body.classList.contains('dark-theme');
      ctx.fillStyle = isDark ? 'rgba(6, 182, 212, 0.4)' : 'rgba(59, 130, 246, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function createParticles() {
    particlesArray = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 14000), 80);
    for (let i = 0; i < count; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    if (!isRunning) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particlesArray.length; i++) {
      particlesArray[i].update();
      particlesArray[i].draw();
    }
    animationFrameId = requestAnimationFrame(animate);
  }

  createParticles();
  animate();

  // Économie de batterie : suspendre l'animation quand l'onglet n'est pas visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isRunning = false;
      cancelAnimationFrame(animationFrameId);
    } else {
      isRunning = true;
      animate();
    }
  });
}

