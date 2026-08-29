// Web Audio API Synthesizer & Continuous Happy Birthday Background Music Engine
class SuperheroAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.initialized = false;
    this.isSongPlaying = false;
    this.songTimeout = null;
    this.activeNodes = [];
  }

  init() {
    if (this.initialized && this.ctx) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
      this.initialized = true;
    } catch (e) {
      console.warn("Web Audio API not supported", e);
    }
  }

  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted && this.isSongPlaying) {
      this.stopBirthdaySong();
    } else if (!this.muted && !this.isSongPlaying) {
      this.playHappyBirthdaySong(true);
    }
    return this.muted;
  }

  // Laser Zap SFX
  playLaser() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, this.ctx.currentTime + 0.18);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  // Power Up Arpeggio
  playPowerUp() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

      gain.gain.setValueAtTime(0, this.ctx.currentTime + idx * 0.04);
      gain.gain.linearRampToValueAtTime(0.18, this.ctx.currentTime + idx * 0.04 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + idx * 0.04);
      osc.stop(this.ctx.currentTime + idx * 0.04 + 0.22);
    });
  }

  // Comic BAM / Punch SFX
  playBam() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(150, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  // Hero Swoosh
  playSwoosh() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(250, this.ctx.currentTime + 0.25);

    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.12);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.25);
  }

  // Candle Blow Breath
  playBlow() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(120, this.ctx.currentTime + 0.35);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.35);
  }

  // Confetti Cannon Pop
  playPop() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Triumphant Fanfare (Superhero Anthem)
  playFanfare() {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    const fanfareNotes = [
      { f: 261.63, d: 0.15, pause: 0 },
      { f: 392.00, d: 0.15, pause: 0.16 },
      { f: 523.25, d: 0.2, pause: 0.32 },
      { f: 659.25, d: 0.2, pause: 0.52 },
      { f: 783.99, d: 0.6, pause: 0.74 }
    ];

    fanfareNotes.forEach(item => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(item.f, this.ctx.currentTime + item.pause);

      gain.gain.setValueAtTime(0.25, this.ctx.currentTime + item.pause);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + item.pause + item.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + item.pause);
      osc.stop(this.ctx.currentTime + item.pause + item.d);
    });
  }

  /* =========================================================
     CONTINUOUS ALWAYS-PLAYING HAPPY BIRTHDAY SONG
     ========================================================= */
  playHappyBirthdaySong(loop = true) {
    if (this.muted) return;
    this.init();
    this.resume();
    if (!this.ctx) return;

    // Clear any existing active notes
    if (this.songTimeout) {
      clearTimeout(this.songTimeout);
      this.songTimeout = null;
    }
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];

    this.isSongPlaying = true;
    this.updateMusicUI(true);

    const now = this.ctx.currentTime + 0.05;
    const tempo = 0.52; // Beat duration in seconds

    // Full Happy Birthday Melody Notes & Beats:
    const songScore = [
      // Phrase 1: "Happy Birthday to you"
      { f: 392.00, beat: 0, dur: 0.75 },     // G4 (Hap-)
      { f: 392.00, beat: 0.75, dur: 0.25 },  // G4 (-py)
      { f: 440.00, beat: 1.0, dur: 1.0 },    // A4 (Birth-)
      { f: 392.00, beat: 2.0, dur: 1.0 },    // G4 (-day)
      { f: 523.25, beat: 3.0, dur: 1.0 },    // C5 (to)
      { f: 493.88, beat: 4.0, dur: 1.8 },    // B4 (you!)
      
      // Phrase 2: "Happy Birthday to you"
      { f: 392.00, beat: 6.0, dur: 0.75 },   // G4 (Hap-)
      { f: 392.00, beat: 6.75, dur: 0.25 },  // G4 (-py)
      { f: 440.00, beat: 7.0, dur: 1.0 },    // A4 (Birth-)
      { f: 392.00, beat: 8.0, dur: 1.0 },    // G4 (-day)
      { f: 587.33, beat: 9.0, dur: 1.0 },    // D5 (to)
      { f: 523.25, beat: 10.0, dur: 1.8 },   // C5 (you!)

      // Phrase 3: "Happy Birthday dear Superhero"
      { f: 392.00, beat: 12.0, dur: 0.75 },  // G4 (Hap-)
      { f: 392.00, beat: 12.75, dur: 0.25 }, // G4 (-py)
      { f: 783.99, beat: 13.0, dur: 1.0 },   // G5 (Birth-)
      { f: 659.25, beat: 14.0, dur: 1.0 },   // E5 (-day)
      { f: 523.25, beat: 15.0, dur: 1.0 },   // C5 (dear)
      { f: 493.88, beat: 16.0, dur: 1.0 },   // B4 (Su-)
      { f: 440.00, beat: 17.0, dur: 1.4 },   // A4 (-perhero!)

      // Phrase 4: "Happy Birthday to you!"
      { f: 698.46, beat: 18.5, dur: 0.75 },  // F5 (Hap-)
      { f: 698.46, beat: 19.25, dur: 0.25 }, // F5 (-py)
      { f: 659.25, beat: 19.5, dur: 1.0 },   // E5 (Birth-)
      { f: 523.25, beat: 20.5, dur: 1.0 },   // C5 (-day)
      { f: 587.33, beat: 21.5, dur: 1.0 },   // D5 (to)
      { f: 523.25, beat: 22.5, dur: 2.2 }    // C5 (you-u-u!)
    ];

    // Harmony Chords
    const chords = [
      { f: 130.81, beat: 0, dur: 5.5 },   // C3
      { f: 196.00, beat: 6, dur: 5.5 },   // G3
      { f: 130.81, beat: 12, dur: 5.5 },  // C3
      { f: 174.61, beat: 18, dur: 3.0 },  // F3
      { f: 196.00, beat: 21, dur: 1.5 },  // G3
      { f: 130.81, beat: 22.5, dur: 2.5 } // C3
    ];

    // Play Main Melody with Warm Music-Box Chime Tone
    songScore.forEach(note => {
      const startTime = now + note.beat * tempo;
      const duration = note.dur * tempo;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.20, startTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);

      // Bell Overtone
      const bellOsc = this.ctx.createOscillator();
      const bellGain = this.ctx.createGain();
      bellOsc.type = 'sine';
      bellOsc.frequency.setValueAtTime(note.f * 2, startTime);

      bellGain.gain.setValueAtTime(0.001, startTime);
      bellGain.gain.linearRampToValueAtTime(0.06, startTime + 0.02);
      bellGain.gain.exponentialRampToValueAtTime(0.001, startTime + Math.min(duration, 0.35));

      bellOsc.connect(bellGain);
      bellGain.connect(this.ctx.destination);
      bellOsc.start(startTime);
      bellOsc.stop(startTime + duration + 0.05);

      this.activeNodes.push(osc, bellOsc);
    });

    // Play Bass Chords
    chords.forEach(ch => {
      const startTime = now + ch.beat * tempo;
      const duration = ch.dur * tempo;

      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'sine';
      bassOsc.frequency.setValueAtTime(ch.f, startTime);

      bassGain.gain.setValueAtTime(0.001, startTime);
      bassGain.gain.linearRampToValueAtTime(0.10, startTime + 0.1);
      bassGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      bassOsc.connect(bassGain);
      bassGain.connect(this.ctx.destination);
      bassOsc.start(startTime);
      bassOsc.stop(startTime + duration);

      this.activeNodes.push(bassOsc);
    });

    const totalSongDurationMs = (25.0 * tempo * 1000) + 800;

    // Endless Loop
    if (loop) {
      this.songTimeout = setTimeout(() => {
        if (this.isSongPlaying && !this.muted) {
          this.playHappyBirthdaySong(true);
        }
      }, totalSongDurationMs);
    }
  }

  stopBirthdaySong() {
    this.isSongPlaying = false;
    if (this.songTimeout) {
      clearTimeout(this.songTimeout);
      this.songTimeout = null;
    }
    this.activeNodes.forEach(node => {
      try {
        node.stop();
        node.disconnect();
      } catch (e) {}
    });
    this.activeNodes = [];
    this.updateMusicUI(false);
  }

  toggleBirthdaySong() {
    if (this.isSongPlaying) {
      this.stopBirthdaySong();
      if (window.heroBabyAlbum) window.heroBabyAlbum.showToast('⏸️ Birthday Song Paused');
    } else {
      this.playHappyBirthdaySong(true);
      if (window.heroBabyAlbum) window.heroBabyAlbum.showToast('🎶 Birthday Song Playing!');
    }
    return this.isSongPlaying;
  }

  updateMusicUI(isPlaying) {
    const musicBtn = document.getElementById('global-music-toggle');
    const headerMusicBtn = document.getElementById('header-music-btn');

    if (musicBtn) {
      musicBtn.innerHTML = isPlaying ? "🎶" : "🎵";
      musicBtn.classList.toggle('playing-pulse', isPlaying);
    }
    if (headerMusicBtn) {
      headerMusicBtn.innerHTML = isPlaying ? "⏸️ Birthday Song Playing 🎶" : "🎵 Play Birthday Song";
      headerMusicBtn.classList.toggle('active-playing', isPlaying);
    }
  }
}

window.superAudio = new SuperheroAudio();