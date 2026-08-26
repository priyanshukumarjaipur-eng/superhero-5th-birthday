// 3 Fun Superhero Mini-Games for a 5-Year-Old

// --- GAME 1: Villain Bubble Pop ---
class BubblePopGame {
  constructor() {
    this.canvas = document.getElementById('bubble-game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.scoreEl = document.getElementById('bubble-score');
    this.startBtn = document.getElementById('start-bubble-game-btn');
    this.score = 0;
    this.running = false;
    this.bubbles = [];
    this.villainEmojis = ['👾', '🤖', '🛸', '⚡', '💥', '👻'];
    this.animId = null;
    this.init();
  }

  init() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }
    if (this.canvas) {
      this.canvas.addEventListener('click', (e) => this.handleClick(e));
      this.canvas.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('click', {
          clientX: touch.clientX,
          clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
      }, { passive: false });
    }
  }

  start() {
    this.score = 0;
    this.bubbles = [];
    this.running = true;
    if (this.scoreEl) this.scoreEl.textContent = "0";
    if (this.startBtn) this.startBtn.textContent = "🎮 Playing! Tap Villains!";
    window.superAudio.playPowerUp();

    this.spawnLoop();
    this.loop();

    // 30 second game round
    setTimeout(() => {
      this.endGame();
    }, 30000);
  }

  spawnLoop() {
    if (!this.running) return;
    this.spawnBubble();
    const nextSpawn = Math.random() * 800 + 400;
    setTimeout(() => this.spawnLoop(), nextSpawn);
  }

  spawnBubble() {
    if (!this.canvas) return;
    const radius = Math.random() * 15 + 35;
    this.bubbles.push({
      x: Math.random() * (this.canvas.width - radius * 2) + radius,
      y: this.canvas.height + radius,
      radius: radius,
      speed: Math.random() * 2 + 1.5,
      emoji: this.villainEmojis[Math.floor(Math.random() * this.villainEmojis.length)],
      popped: false
    });
  }

  handleClick(e) {
    if (!this.running || !this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const clickX = (e.clientX - rect.left) * (this.canvas.width / rect.width);
    const clickY = (e.clientY - rect.top) * (this.canvas.height / rect.height);

    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      const dist = Math.hypot(b.x - clickX, b.y - clickY);
      if (dist < b.radius + 15 && !b.popped) {
        b.popped = true;
        this.score += 10;
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        window.superAudio.playLaser();
        this.bubbles.splice(i, 1);
        break;
      }
    }
  }

  loop() {
    if (!this.running || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Update & draw bubbles
    for (let i = this.bubbles.length - 1; i >= 0; i--) {
      const b = this.bubbles[i];
      b.y -= b.speed;

      // Draw bubble circle
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = "rgba(239, 68, 68, 0.35)";
      this.ctx.fill();
      this.ctx.lineWidth = 3;
      this.ctx.strokeStyle = "#FDE047";
      this.ctx.stroke();

      // Draw emoji
      this.ctx.font = `${b.radius * 1.1}px sans-serif`;
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(b.emoji, b.x, b.y);

      if (b.y < -b.radius) {
        this.bubbles.splice(i, 1);
      }
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }

  endGame() {
    this.running = false;
    if (this.startBtn) this.startBtn.textContent = "🏆 Round Complete! Play Again!";
    window.superAudio.playFanfare();
    if (window.confetti) window.confetti({ particleCount: 70, spread: 80 });
  }
}

// --- GAME 2: Catch the Birthday Treats ---
class CatchGame {
  constructor() {
    this.canvas = document.getElementById('catch-game-canvas');
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.scoreEl = document.getElementById('catch-score');
    this.startBtn = document.getElementById('start-catch-game-btn');
    this.score = 0;
    this.running = false;
    this.items = [];
    this.basketX = 150;
    this.basketWidth = 90;
    this.treats = ['🍰', '⭐', '⚡', '🎁', '🎂', '🍭'];
    this.init();
  }

  init() {
    if (this.startBtn) {
      this.startBtn.addEventListener('click', () => this.start());
    }
    if (this.canvas) {
      this.canvas.addEventListener('mousemove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.basketX = (e.clientX - rect.left) * (this.canvas.width / rect.width) - this.basketWidth / 2;
      });
      this.canvas.addEventListener('touchmove', (e) => {
        const rect = this.canvas.getBoundingClientRect();
        this.basketX = (e.touches[0].clientX - rect.left) * (this.canvas.width / rect.width) - this.basketWidth / 2;
      }, { passive: true });
    }
  }

  start() {
    this.score = 0;
    this.items = [];
    this.running = true;
    if (this.scoreEl) this.scoreEl.textContent = "0";
    if (this.startBtn) this.startBtn.textContent = "⚡ Catching Treats!";
    window.superAudio.playPowerUp();

    this.spawnLoop();
    this.loop();

    setTimeout(() => {
      this.endGame();
    }, 30000);
  }

  spawnLoop() {
    if (!this.running) return;
    if (this.canvas) {
      this.items.push({
        x: Math.random() * (this.canvas.width - 40) + 20,
        y: -30,
        speed: Math.random() * 2 + 2,
        emoji: this.treats[Math.floor(Math.random() * this.treats.length)]
      });
    }
    setTimeout(() => this.spawnLoop(), 700);
  }

  loop() {
    if (!this.running || !this.ctx || !this.canvas) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw basket (Superhero Shield)
    this.ctx.fillStyle = "#3B82F6";
    this.ctx.beginPath();
    this.ctx.roundRect(this.basketX, this.canvas.height - 35, this.basketWidth, 25, 12);
    this.ctx.fill();
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "#FDE047";
    this.ctx.stroke();

    this.ctx.fillStyle = "#FFFFFF";
    this.ctx.font = "14px 'Russo One', sans-serif";
    this.ctx.textAlign = "center";
    this.ctx.fillText("🛡️ HERO", this.basketX + this.basketWidth / 2, this.canvas.height - 18);

    // Draw Falling items
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      item.y += item.speed;

      this.ctx.font = "28px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText(item.emoji, item.x, item.y);

      // Check collision with shield basket
      if (
        item.y >= this.canvas.height - 40 &&
        item.y <= this.canvas.height - 10 &&
        item.x >= this.basketX - 15 &&
        item.x <= this.basketX + this.basketWidth + 15
      ) {
        this.score += 15;
        if (this.scoreEl) this.scoreEl.textContent = this.score;
        window.superAudio.playPop();
        this.items.splice(i, 1);
      } else if (item.y > this.canvas.height + 30) {
        this.items.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.loop());
  }

  endGame() {
    this.running = false;
    if (this.startBtn) this.startBtn.textContent = "🏆 Awesome Catch! Play Again!";
    window.superAudio.playFanfare();
  }
}

// --- GAME 3: Superhero Badge Memory Match ---
class MemoryMatchGame {
  constructor() {
    this.grid = document.getElementById('memory-cards-grid');
    this.resetBtn = document.getElementById('reset-memory-game-btn');
    this.cards = ['⚡', '⚡', '⭐', '⭐', '🛡️', '🛡️', '🦸‍♂️', '🦸‍♂️', '🎂', '🎂', '🚀', '🚀'];
    this.flippedCards = [];
    this.matchedCount = 0;
    this.init();
  }

  init() {
    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.setupBoard());
    }
    this.setupBoard();
  }

  setupBoard() {
    if (!this.grid) return;
    this.grid.innerHTML = '';
    this.flippedCards = [];
    this.matchedCount = 0;

    // Shuffle cards
    const shuffled = [...this.cards].sort(() => Math.random() - 0.5);

    shuffled.forEach((symbol, idx) => {
      const card = document.createElement('div');
      card.className = 'memory-card';
      card.setAttribute('data-symbol', symbol);
      card.innerHTML = `
        <div class="card-inner">
          <div class="card-back">❓</div>
          <div class="card-face">${symbol}</div>
        </div>
      `;
      card.addEventListener('click', () => this.flipCard(card));
      this.grid.appendChild(card);
    });
  }

  flipCard(card) {
    if (card.classList.contains('flipped') || card.classList.contains('matched') || this.flippedCards.length >= 2) {
      return;
    }

    card.classList.add('flipped');
    window.superAudio.playCardFlip();
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      const [c1, c2] = this.flippedCards;
      if (c1.getAttribute('data-symbol') === c2.getAttribute('data-symbol')) {
        setTimeout(() => {
          c1.classList.add('matched');
          c2.classList.add('matched');
          this.flippedCards = [];
          this.matchedCount += 2;
          window.superAudio.playPop();

          if (this.matchedCount === this.cards.length) {
            setTimeout(() => {
              window.superAudio.playFanfare();
              if (window.confetti) window.confetti({ particleCount: 100, spread: 90 });
            }, 300);
          }
        }, 400);
      } else {
        setTimeout(() => {
          c1.classList.remove('flipped');
          c2.classList.remove('flipped');
          this.flippedCards = [];
        }, 900);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.bubbleGame = new BubblePopGame();
  window.catchGame = new CatchGame();
  window.memoryGame = new MemoryMatchGame();
});