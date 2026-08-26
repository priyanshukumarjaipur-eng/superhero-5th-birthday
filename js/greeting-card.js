// 3D Pop-Up Superhero Greeting Card Controller
class GreetingCard3D {
  constructor() {
    this.cardEl = document.getElementById('main-greeting-card');
    this.openBtn = document.getElementById('open-card-btn');
    this.editBtn = document.getElementById('edit-card-btn');
    this.nameInput = document.getElementById('hero-name-input');
    this.messageInput = document.getElementById('hero-message-input');
    this.saveBtn = document.getElementById('save-card-btn');
    this.init();
  }

  init() {
    if (this.openBtn && this.cardEl) {
      this.openBtn.addEventListener('click', () => {
        this.toggleCard();
      });
    }

    if (this.cardEl) {
      this.cardEl.addEventListener('click', (e) => {
        if (!e.target.closest('button') && !e.target.closest('input') && !e.target.closest('textarea')) {
          this.toggleCard();
        }
      });
    }

    if (this.editBtn) {
      this.editBtn.addEventListener('click', () => {
        const editModal = document.getElementById('card-edit-modal');
        if (editModal) {
          editModal.style.display = 'flex';
          window.superAudio.playPop();
        }
      });
    }

    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', () => {
        this.saveCustomMessage();
      });
    }

    // Close modal
    const closeModalBtn = document.getElementById('close-card-modal-btn');
    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        const editModal = document.getElementById('card-edit-modal');
        if (editModal) editModal.style.display = 'none';
      });
    }
  }

  toggleCard() {
    if (!this.cardEl) return;
    const isFlipped = this.cardEl.classList.toggle('flipped');
    window.superAudio.playCardFlip();

    if (isFlipped) {
      window.superAudio.playFanfare();
      if (window.confetti) {
        window.confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      }
      if (this.openBtn) this.openBtn.innerHTML = "🔄 Close 3D Card";
    } else {
      if (this.openBtn) this.openBtn.innerHTML = "✨ Open 3D Card!";
    }
  }

  saveCustomMessage() {
    const heroName = this.nameInput ? this.nameInput.value.trim() : "SUPER CHAMPION";
    const heroMsg = this.messageInput ? this.messageInput.value.trim() : "Happy 5th Birthday to the bravest superhero!";

    const nameDisplays = document.querySelectorAll('.dynamic-hero-name');
    nameDisplays.forEach(el => el.textContent = heroName || "SUPER CHAMPION");

    const msgDisplay = document.getElementById('dynamic-hero-message');
    if (msgDisplay) msgDisplay.textContent = heroMsg;

    const certName = document.getElementById('cert-hero-name');
    if (certName) certName.textContent = heroName || "SUPER CHAMPION";

    const editModal = document.getElementById('card-edit-modal');
    if (editModal) editModal.style.display = 'none';

    window.superAudio.playPowerUp();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.greetingCard = new GreetingCard3D();
});