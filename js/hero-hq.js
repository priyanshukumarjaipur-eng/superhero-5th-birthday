// Superhero Explorer HQ: Power Scanner, Comic Soundboard, Suit Customizer & Certificate
class SuperheroHQ {
  constructor() {
    this.initSoundboard();
    this.initScanner();
    this.initSuitCustomizer();
    this.initCertificate();
  }

  // 1. Comic Soundboard
  initSoundboard() {
    const soundButtons = document.querySelectorAll('.soundboard-btn');
    soundButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const soundType = btn.getAttribute('data-sound');
        switch (soundType) {
          case 'laser': window.superAudio.playLaser(); break;
          case 'bam': window.superAudio.playBam(); break;
          case 'powerup': window.superAudio.playPowerUp(); break;
          case 'swoosh': window.superAudio.playSwoosh(); break;
          case 'fanfare': window.superAudio.playFanfare(); break;
          case 'robot': window.superAudio.playRobot(); break;
          case 'pop': window.superAudio.playPop(); break;
          case 'birthday': window.superAudio.playHappyBirthday(); break;
          default: window.superAudio.playPop();
        }
      });
    });
  }

  // 2. Superpower Hand Scanner
  initScanner() {
    const scanBtn = document.getElementById('hand-scanner-btn');
    const resultBox = document.getElementById('scanner-result-box');
    const powers = [
      { name: "⚡ Lightning Speed", desc: "Can run as fast as a cosmic rocket!" },
      { name: "💪 Mega Kindness & Hug Force", desc: "Spreads joy and happiness to everyone!" },
      { name: "🚀 Star Flight", desc: "Can soar high above the clouds!" },
      { name: "🛡️ Unstoppable Energy Shield", desc: "Protects friends and family with super strength!" },
      { name: "✨ Cosmic Laser Vision", desc: "Shoots sparkly party lasers from fingertips!" },
      { name: "🎂 Cake Chomping Power", desc: "Master of delicious birthday cake eating!" }
    ];

    if (scanBtn) {
      scanBtn.addEventListener('click', () => {
        scanBtn.classList.add('scanning');
        window.superAudio.playLaser();

        if (resultBox) {
          resultBox.innerHTML = "<p style='color:#38BDF8; font-weight:bold;'>⚡ SCANNING HERO DNA... ⚡</p>";
        }

        setTimeout(() => {
          scanBtn.classList.remove('scanning');
          const randomPower = powers[Math.floor(Math.random() * powers.length)];
          window.superAudio.playPowerUp();
          if (resultBox) {
            resultBox.innerHTML = `
              <div style='background:rgba(15,23,42,0.9); border:3px solid #FDE047; padding:16px; border-radius:14px; margin-top:10px;'>
                <h3 style='color:#FDE047; font-size:20px;'>${randomPower.name}</h3>
                <p style='color:#E2E8F0; margin-top:6px;'>${randomPower.desc}</p>
                <div class='burst-tag' style='margin-top:10px;'>LEVEL 5 UNLOCKED!</div>
              </div>
            `;
          }
          if (window.confetti) window.confetti({ particleCount: 40, spread: 60 });
        }, 1800);
      });
    }
  }

  // 3. Superhero Suit Customizer
  initSuitCustomizer() {
    const capeColors = document.querySelectorAll('.cape-color-btn');
    const maskOptions = document.querySelectorAll('.mask-option-btn');
    const emblemOptions = document.querySelectorAll('.emblem-option-btn');

    const heroCape = document.getElementById('suit-cape-preview');
    const heroEmblem = document.getElementById('suit-emblem-preview');

    capeColors.forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.getAttribute('data-color');
        if (heroCape) heroCape.style.fill = color;
        window.superAudio.playPop();
      });
    });

    emblemOptions.forEach(btn => {
      btn.addEventListener('click', () => {
        const emblem = btn.getAttribute('data-emblem');
        if (heroEmblem) heroEmblem.textContent = emblem;
        window.superAudio.playPowerUp();
      });
    });
  }

  // 4. Certificate Generator & Print
  initCertificate() {
    const printBtn = document.getElementById('print-cert-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.superAudio.playFanfare();
        window.print();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.superHeroHQ = new SuperheroHQ();
});