// High Speed Responsiveness Engine with Always-Playing Continuous Happy Birthday Music
document.addEventListener('DOMContentLoaded', () => {

  // 1. Instant Navigation Tab Switching
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

      if (window.superAudio) window.superAudio.playPop();
    });
  });

  // 2. Sound & Happy Birthday Song Controllers
  const soundToggleBtn = document.getElementById('global-sound-toggle');
  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      if (window.superAudio) {
        const isMuted = window.superAudio.toggleMute();
        soundToggleBtn.innerHTML = isMuted ? "🔇" : "🔊";
        if (!isMuted) window.superAudio.playPowerUp();
      }
    });
  }

  const musicToggleBtn = document.getElementById('global-music-toggle');
  if (musicToggleBtn) {
    musicToggleBtn.addEventListener('click', () => {
      if (window.superAudio) {
        window.superAudio.toggleBirthdaySong();
      }
    });
  }

  const headerMusicBtn = document.getElementById('header-music-btn');
  if (headerMusicBtn) {
    headerMusicBtn.addEventListener('click', () => {
      if (window.superAudio) {
        window.superAudio.toggleBirthdaySong();
      }
    });
  }

  // 3. Confetti Blast Button
  const confettiBlastBtn = document.getElementById('quick-confetti-btn');
  if (confettiBlastBtn) {
    confettiBlastBtn.addEventListener('click', () => {
      if (window.superAudio) window.superAudio.playPop();
      if (window.confetti) {
        window.confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.8 }
        });
      }
    });
  }

  // 4. Update Home avatar image with child's photo
  const p = window.HERO_PHOTOS || {};
  const homeAvatar = document.getElementById('home-hero-avatar');
  if (homeAvatar) {
    homeAvatar.src = p.img1 || p.active_bg || 'img1.jpeg';
  }

  // 5. Initialize Lightweight 3D Scene
  if (window.superScene3D) {
    window.superScene3D.init();
  }

  // 6. ALWAYS-PLAYING HAPPY BIRTHDAY SONG ENGINE (Autoplay + First Interaction Fallback)
  function startAlwaysPlayingSong() {
    if (window.superAudio) {
      window.superAudio.init();
      window.superAudio.resume();
      if (!window.superAudio.isSongPlaying && !window.superAudio.muted) {
        window.superAudio.playHappyBirthdaySong(true);
      }
    }
  }

  // Try immediate autoplay
  try {
    startAlwaysPlayingSong();
  } catch(e) {}

  // Autoplay on first user touch/click/scroll (Satisfies iOS/Android/Chrome user-gesture policy)
  const triggerAutoPlay = () => {
    startAlwaysPlayingSong();
    document.removeEventListener('click', triggerAutoPlay);
    document.removeEventListener('touchstart', triggerAutoPlay);
    document.removeEventListener('pointerdown', triggerAutoPlay);
    document.removeEventListener('keydown', triggerAutoPlay);
  };
  document.addEventListener('click', triggerAutoPlay);
  document.addEventListener('touchstart', triggerAutoPlay, { passive: true });
  document.addEventListener('pointerdown', triggerAutoPlay, { passive: true });
  document.addEventListener('keydown', triggerAutoPlay);

  // 7. Initialize Lightweight Sparkle Trail
  initFastSparkleTrail();
});

// Lightweight Cursor Trail that completely sleeps when mouse is still
function initFastSparkleTrail() {
  const canvas = document.createElement('canvas');
  canvas.id = 'sparkle-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:99;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d', { alpha: true });

  let width = canvas.width = window.innerWidth;
  let height = canvas.height = window.innerHeight;

  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }, 150);
  }, { passive: true });

  const particles = [];
  const colors = ['#FDE047', '#60A5FA', '#F43F5E', '#38BDF8'];
  let isRunning = false;
  let lastSpawn = 0;

  function addParticle(x, y) {
    const now = performance.now();
    if (now - lastSpawn < 30) return;
    lastSpawn = now;

    if (particles.length > 20) particles.shift();
    particles.push({
      x: x,
      y: y,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
      size: Math.random() * 3 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 1
    });

    if (!isRunning) {
      isRunning = true;
      requestAnimationFrame(render);
    }
  }

  window.addEventListener('pointermove', (e) => {
    addParticle(e.clientX, e.clientY);
  }, { passive: true });

  function render() {
    if (particles.length === 0) {
      ctx.clearRect(0, 0, width, height);
      isRunning = false;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.05;
      p.size *= 0.95;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }
}