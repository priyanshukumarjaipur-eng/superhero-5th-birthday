// Interactive 3D Cake with Live Candle Sparklers, Flame Physics & Confetti Blast
class BirthdayCakeStage {
  constructor() {
    this.totalCandles = 5;
    this.candlesLit = 5;
    this.sparkleInterval = null;
    this.init();
  }

  init() {
    this.setupCandles();
    this.setupButtons();
    this.startSparklerAnimation();
  }

  setupCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((candle) => {
      candle.addEventListener('click', () => {
        this.blowCandle(candle);
      });
    });
  }

  startSparklerAnimation() {
    const flames = document.querySelectorAll('.flame');
    // Live sparkler sparks around active flames
    this.sparkleInterval = setInterval(() => {
      if (this.candlesLit <= 0) return;

      const activeCandles = document.querySelectorAll('.candle:not(.blown-out)');
      activeCandles.forEach(c => {
        if (Math.random() > 0.4) {
          this.createSpark(c);
        }
      });
    }, 120);
  }

  createSpark(candleEl) {
    const spark = document.createElement('div');
    spark.style.position = 'absolute';
    spark.style.width = `${Math.random() * 4 + 2}px`;
    spark.style.height = spark.style.width;
    spark.style.backgroundColor = Math.random() > 0.5 ? '#FDE047' : '#FFFFFF';
    spark.style.borderRadius = '50%';
    spark.style.boxShadow = '0 0 8px #F59E0B';
    spark.style.left = `${Math.random() * 20 - 2}px`;
    spark.style.top = `${-Math.random() * 15 - 5}px`;
    spark.style.pointerEvents = 'none';
    spark.style.transition = 'all 0.4s ease-out';
    spark.style.opacity = '1';

    candleEl.appendChild(spark);

    requestAnimationFrame(() => {
      spark.style.transform = `translate(${(Math.random() - 0.5) * 25}px, ${-Math.random() * 25 - 10}px) scale(0.2)`;
      spark.style.opacity = '0';
    });

    setTimeout(() => {
      if (spark.parentNode) spark.parentNode.removeChild(spark);
    }, 400);
  }

  blowCandle(candleEl) {
    if (!candleEl.classList.contains('blown-out')) {
      candleEl.classList.add('blown-out');
      this.candlesLit--;
      window.superAudio.playBlow();

      // Check if all 5 candles are extinguished
      if (this.candlesLit <= 0) {
        this.triggerGrandCelebration();
      }
    }
  }

  blowAllCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((c, idx) => {
      setTimeout(() => {
        if (!c.classList.contains('blown-out')) {
          c.classList.add('blown-out');
          window.superAudio.playBlow();
        }
      }, idx * 120);
    });

    this.candlesLit = 0;
    setTimeout(() => {
      this.triggerGrandCelebration();
    }, 700);
  }

  relightCandles() {
    const candles = document.querySelectorAll('.candle');
    candles.forEach((c) => {
      c.classList.remove('blown-out');
    });
    this.candlesLit = 5;
    window.superAudio.playPowerUp();

    const banner = document.getElementById('wish-status-banner');
    if (banner) {
      banner.innerHTML = "✨ Relit! Make a Superhero Wish & Blow Again!";
      banner.style.color = "#FDE047";
    }
  }

  triggerGrandCelebration() {
    window.superAudio.playFanfare();
    setTimeout(() => {
      window.superAudio.playHappyBirthday();
    }, 1200);

    // Multi-stage firework confetti blast
    if (window.confetti) {
      const count = 200;
      const defaults = { origin: { y: 0.7 } };

      function fire(particleRatio, opts) {
        window.confetti(Object.assign({}, defaults, opts, {
          particleCount: Math.floor(count * particleRatio)
        }));
      }

      fire(0.25, { spread: 26, startVelocity: 55 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    }

    const banner = document.getElementById('wish-status-banner');
    if (banner) {
      banner.innerHTML = "🎉 LEVEL 5 SUPERHERO WISH GRANTED! YOU ARE AWESOME! 💥";
      banner.style.color = "#4ADE80";
    }
  }

  setupButtons() {
    const blowAllBtn = document.getElementById('blow-all-btn');
    if (blowAllBtn) {
      blowAllBtn.addEventListener('click', () => this.blowAllCandles());
    }

    const relightBtn = document.getElementById('relight-btn');
    if (relightBtn) {
      relightBtn.addEventListener('click', () => this.relightCandles());
    }

    // Cake Topper Customizers
    const topperButtons = document.querySelectorAll('.topper-select-btn');
    topperButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const topper = btn.getAttribute('data-topper');
        const topperDisplay = document.getElementById('active-cake-topper');
        if (topperDisplay) {
          topperDisplay.textContent = topper;
          topperDisplay.style.transform = 'scale(1.5) rotate(15deg)';
          setTimeout(() => {
            topperDisplay.style.transform = 'scale(1) rotate(0deg)';
          }, 300);
          window.superAudio.playPop();
        }
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.birthdayCake = new BirthdayCakeStage();
});