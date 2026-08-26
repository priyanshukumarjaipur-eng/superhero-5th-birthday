// Superhero Photo Collage & Memory Gallery
class HeroPhotoGallery {
  constructor() {
    this.storageKey = 'superhero_hero_photos_v1';
    this.grid = document.getElementById('photo-collage-grid');
    this.fileInput = document.getElementById('photo-upload-input');
    this.uploadBtn = document.getElementById('upload-photo-btn');
    this.resetBtn = document.getElementById('reset-gallery-btn');
    this.modal = document.getElementById('photo-lightbox-modal');
    this.modalImg = document.getElementById('lightbox-img');
    this.modalCaption = document.getElementById('lightbox-caption');
    this.closeModalBtn = document.getElementById('close-lightbox-btn');
    
    // Default starter photos with SVG comic superhero illustrations
    this.defaultPhotos = [
      {
        id: 'def-1',
        title: '🦸‍♂️ Ready for Action!',
        caption: 'Born with super curiosity and lightning-fast zoomies!',
        tag: 'AGE 1',
        image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%231E3A8A"/><circle cx="150" cy="130" r="60" fill="%23FCD34D"/><path d="M110 120 Q150 140 190 120 Q170 100 150 110 Q130 100 110 120 Z" fill="%230F172A"/><circle cx="135" cy="125" r="7" fill="%23FFFFFF"/><circle cx="165" cy="125" r="7" fill="%23FFFFFF"/><circle cx="135" cy="125" r="3" fill="%23000"/><circle cx="165" cy="125" r="3" fill="%23000"/><path d="M130 160 Q150 175 170 160" stroke="%23EF4444" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M80 180 Q50 280 60 290 Q150 260 240 290 Q250 280 220 180 Z" fill="%23EF4444"/><rect x="100" y="180" width="100" height="110" rx="20" fill="%232563EB"/><text x="150" y="240" font-family="sans-serif" font-size="36" font-weight="bold" fill="%23FDE047" text-anchor="middle">⚡</text></svg>'
      },
      {
        id: 'def-2',
        title: '⚡ Lightning Zoomies!',
        caption: 'Faster than a rocket, happier than a sunshine ray!',
        tag: 'AGE 3',
        image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%230F172A"/><circle cx="150" cy="150" r="110" fill="%23F59E0B" opacity="0.2"/><polygon points="150,40 180,130 270,130 195,185 225,270 150,215 75,270 105,185 30,130 120,130" fill="%23FDE047" stroke="%23000" stroke-width="4"/><text x="150" y="165" font-family="sans-serif" font-size="44" font-weight="bold" fill="%23DC2626" text-anchor="middle">5</text></svg>'
      },
      {
        id: 'def-3',
        title: '🎂 Master Cake Crusher',
        caption: 'Officially ready to conquer the 5-candle birthday cake!',
        tag: 'LEVEL 5 TODAY!',
        image: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300"><rect width="300" height="300" fill="%23312E81"/><rect x="60" y="180" width="180" height="80" rx="14" fill="%23F59E0B"/><rect x="90" y="120" width="120" height="60" rx="10" fill="%23EF4444"/><rect x="110" y="70" width="80" height="50" rx="8" fill="%233B82F6"/><rect x="144" y="30" width="12" height="40" fill="%23FDE047"/><circle cx="150" cy="20" r="10" fill="%23EF4444"/><text x="150" y="160" font-family="sans-serif" font-size="28" fill="%23FFFFFF" text-anchor="middle">★ HERO ★</text></svg>'
      }
    ];

    this.photos = [];
    this.init();
  }

  init() {
    this.loadPhotos();
    this.render();

    if (this.uploadBtn && this.fileInput) {
      this.uploadBtn.addEventListener('click', () => this.fileInput.click());
      this.fileInput.addEventListener('change', (e) => this.handleFileUpload(e));
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => this.resetToDefaults());
    }

    if (this.closeModalBtn && this.modal) {
      this.closeModalBtn.addEventListener('click', () => {
        this.modal.style.display = 'none';
      });
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.modal.style.display = 'none';
      });
    }

    // Drag and Drop support
    const dropzone = document.getElementById('photo-dropzone');
    if (dropzone) {
      dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('drag-active');
      });
      dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('drag-active');
      });
      dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('drag-active');
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
          this.processFiles(e.dataTransfer.files);
        }
      });
    }
  }

  loadPhotos() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        this.photos = JSON.parse(saved);
      } else {
        this.photos = [...this.defaultPhotos];
      }
    } catch (e) {
      this.photos = [...this.defaultPhotos];
    }
  }

  savePhotos() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.photos));
    } catch (e) {
      console.warn("Storage quota exceeded or error saving", e);
    }
  }

  handleFileUpload(e) {
    if (e.target.files && e.target.files.length > 0) {
      this.processFiles(e.target.files);
    }
  }

  processFiles(fileList) {
    Array.from(fileList).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: 'photo-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          title: file.name.replace(/\.[^/.]+$/, "").substring(0, 20) || 'Super Hero Moment',
          caption: 'Added on Level 5 Birthday Mission!',
          tag: 'SUPERSTAR!',
          image: event.target.result
        };
        this.photos.unshift(newPhoto);
        this.savePhotos();
        this.render();
        window.superAudio.playPowerUp();
        if (window.confetti) window.confetti({ particleCount: 50, spread: 60 });
      };
      reader.readAsDataURL(file);
    });
  }

  deletePhoto(id, e) {
    e.stopPropagation();
    this.photos = this.photos.filter(p => p.id !== id);
    this.savePhotos();
    this.render();
    window.superAudio.playPop();
  }

  openLightbox(photo) {
    if (!this.modal) return;
    if (this.modalImg) this.modalImg.src = photo.image;
    if (this.modalCaption) {
      this.modalCaption.innerHTML = `
        <h3 style="font-family:var(--font-hero); font-size:24px; color:#FDE047; margin-bottom:6px;">${photo.title}</h3>
        <p style="color:#E2E8F0; font-size:16px;">${photo.caption}</p>
        <span class="burst-tag" style="margin-top:10px;">${photo.tag}</span>
      `;
    }
    this.modal.style.display = 'flex';
    window.superAudio.playPop();
  }

  resetToDefaults() {
    this.photos = [...this.defaultPhotos];
    this.savePhotos();
    this.render();
    window.superAudio.playFanfare();
  }

  render() {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    this.photos.forEach((photo, idx) => {
      const card = document.createElement('div');
      card.className = 'photo-polaroid-card';
      
      // Slight playful random rotation (-3deg to 3deg)
      const rot = ((idx % 3) - 1) * 2.5;
      card.style.transform = `rotate(${rot}deg)`;

      card.innerHTML = `
        <div class="polaroid-tag">${photo.tag || 'HERO'}</div>
        <button class="delete-photo-btn" title="Remove Photo">✖</button>
        <div class="polaroid-img-box">
          <img src="${photo.image}" alt="${photo.title}">
        </div>
        <div class="polaroid-caption">
          <h4>${photo.title}</h4>
          <p>${photo.caption}</p>
        </div>
      `;

      card.querySelector('.delete-photo-btn').addEventListener('click', (e) => this.deletePhoto(photo.id, e));
      card.addEventListener('click', () => this.openLightbox(photo));

      this.grid.appendChild(card);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.heroGallery = new HeroPhotoGallery();
});