// Interactive Motion Engine: Cursor Particle Trail, Card 3D Tilt, Comic Popups
document.addEventListener('DOMContentLoaded', () => {

  // 1. Navigation Tab Switching
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-tab');

      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }

      window.superAudio.playPop();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  // 2. Sound Toggle Button
  const soundToggleBtn = document.getElementById('global-sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const isMuted = window.superAudio.toggleMute();
      soundToggleBtn.innerHTML = isMuted ? "🔇" : "🔊";
      if (!isMuted) window.superAudio.playPowerUp();
    });
  }

  // 3. Confetti Blast Button
  const confettiBlastBtn = document.getElementById('quick-confetti-btn');
  if (confettiBlastBtn) {
    confettiBlastBtn.addEventListener('click', () => {
      window.superAudio.playPop();
      if (window.confetti) {
        window.confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.8 }
        });
      }
    });
  }

  // 4. Initialize 3D Scene
  if (window.superScene3D) {
    window.superScene3D.init();
  }

  // 5. Initialize Web Audio on first user interaction
  const firstUserTouch = () => {
    window.superAudio.init();
    window.superAudio.resume();
    document.removeEventListener('click', firstUserTouch);
    document.removeEventListener('touchstart', firstUserTouch);
  };
  document.addEventListener('click', firstUserTouch);
  document.addEventListener('touchstart', firstUserTouch);

  // 6. Interactive Cursor Sparkle Trail Engine
  initSparkleTrail();

  // 7. Interactive 3D Card Parallax Tilt
  init3DCardTilt();
});

// Interactive Laser & Sparkle Cursor Trail
function initSparkleTrail() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkle-canvas';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const colors = ['#FDE047', '#60A5FA', '#F43F5E', '#38BDF8', '#C084FC'];

  function addParticle(x, y) {
    for (let i = 0; i < 3; i++) {
      particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 4,
        vy: (Math.random() - 0.5) * 4,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 1
      });
    }
  }

  window.addEventListener('mousemove', (e) => {
    addParticle(e.clientX, e.clientY);
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches[0]) {
      addParticle(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Floating comic action word burst on click
  window.addEventListener('click', (e) => {
    spawnComicBurst(e.clientX, e.clientY);
    for (let i = 0; i < 15; i++) {
      addParticle(e.clientX, e.clientY);
    }
  });

  function render() {
    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.025;
      p.size *= 0.96;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = p.color;

      // Draw star particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    requestAnimationFrame(render);
  }
  render();
}

// Floating Comic Action Word Bubble (POW!, ZAP!, BOOM!)
function spawnComicBurst(x, y) {
  const words = ['POW!', 'ZAP!', 'BOOM!', 'BAM!', 'HERO!', 'LEVEL 5!', 'SWOOSH!'];
  const word = words[Math.floor(Math.random() * words.length)];

  const el = document.createElement('div');
  el.textContent = word;
  el.style.position = 'fixed';
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
  el.style.transform = 'translate(-50%, -50%) scale(0.5) rotate(' + (Math.random() * 20 - 10) + 'deg)';
  el.style.zIndex = '999';
  el.style.pointerEvents = 'none';
  el.style.fontFamily = "'Bungee', 'Russo One', sans-serif";
  el.style.fontSize = '22px';
  el.style.color = '#FDE047';
  el.style.textShadow = '2px 2px 0 #000, 0 0 15px #EF4444';
  el.style.transition = 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
  el.style.opacity = '1';

  document.body.appendChild(el);

  requestAnimationFrame(() => {
    el.style.transform = 'translate(-50%, -100px) scale(1.3) rotate(' + (Math.random() * 20 - 10) + 'deg)';
    el.style.opacity = '0';
  });

  setTimeout(() => {
    if (el.parentNode) el.parentNode.removeChild(el);
  }, 650);
}

// 3D Parallax Tilt for Cards
function init3DCardTilt() {
  const cards = document.querySelectorAll('.hero-card, .game-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotX = -(y / (rect.height / 2)) * 6;
      const rotY = (x / (rect.width / 2)) * 6;

      card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
}