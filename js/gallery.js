// Superhero Baby Album & Memory Vault Engine - Complete 9 Memories Collection
class HeroBabyAlbum {
  constructor() {
    this.storageKey = 'superhero_baby_album_v6';
    this.bgStorageKey = 'superhero_active_bg_photo_v6';
    this.bgOpacityKey = 'superhero_active_bg_opacity_v6';
    
    this.grid = document.getElementById('baby-album-grid');
    this.fileInput = document.getElementById('album-upload-input');
    this.uploadBtn = document.getElementById('album-upload-btn');
    this.resetBtn = document.getElementById('reset-album-btn');
    this.slideshowBtn = document.getElementById('play-slideshow-btn');
    
    // Lightbox elements
    this.modal = document.getElementById('photo-lightbox-modal');
    this.modalImg = document.getElementById('lightbox-img');
    this.modalCaption = document.getElementById('lightbox-caption');
    this.closeModalBtn = document.getElementById('close-lightbox-btn');
    this.prevPhotoBtn = document.getElementById('lightbox-prev-btn');
    this.nextPhotoBtn = document.getElementById('lightbox-next-btn');

    // Slideshow elements
    this.slideshowModal = document.getElementById('slideshow-modal');
    this.slideshowImg = document.getElementById('slideshow-img');
    this.slideshowTitle = document.getElementById('slideshow-title');
    this.slideshowDesc = document.getElementById('slideshow-desc');
    this.slideshowMilestone = document.getElementById('slideshow-milestone');
    this.slideshowIndex = document.getElementById('slideshow-counter');
    this.closeSlideshowBtn = document.getElementById('close-slideshow-btn');
    this.slideshowPlayPauseBtn = document.getElementById('slideshow-play-pause');
    this.slideshowPrevBtn = document.getElementById('slideshow-prev-btn');
    this.slideshowNextBtn = document.getElementById('slideshow-next-btn');
    this.slideshowProgress = document.getElementById('slideshow-progress-bar');
    
    this.slideshowTimer = null;
    this.slideshowPlaying = false;
    this.currentSlideIndex = 0;
    this.currentLightboxIndex = 0;
    this.currentFilter = 'all';

    // Folder Images from embedded asset dictionary or file path fallbacks
    const p = window.HERO_PHOTOS || {};

    this.defaultPhotos = [
      {
        id: 'photo-1-archer',
        category: 'hero',
        level: 'LEVEL 5',
        age: '5 Years (Today!)',
        title: '🏹 Little Prince Archer: Super Hero',
        caption: 'Traditional royal attire with bow & arrow, floral garlands, and an unstoppable superhero smile!',
        tag: 'LEVEL 5 HERO',
        sticker: '👑 ROYAL HERO!',
        image: p.img1 || 'img1.jpeg',
        likes: 142
      },
      {
        id: 'photo-6-krishna',
        category: 'hero',
        level: 'LEVEL 4-5',
        age: 'Festival Prince',
        title: '🪶 Little Prince Krishna: Royal Festive Charm',
        caption: 'Radiant festive joy with peacock feather crown, traditional angrakha, and sweet sparkling eyes!',
        tag: 'FESTIVAL HERO',
        sticker: '🌟 SUPERSTAR!',
        image: p.img6 || 'img6.jpeg',
        likes: 135
      },
      {
        id: 'photo-5-prince-portrait',
        category: 'hero',
        level: 'LEVEL 5',
        age: '5th Birthday',
        title: '⭐ Brave Little Warrior Champion',
        caption: 'Dressed up in celebration attire, standing tall and ready to conquer all 5th Birthday missions!',
        tag: 'BIRTHDAY CHAMP',
        sticker: '💥 BOOM!',
        image: p.img5 || 'img5.jpeg',
        likes: 120
      },
      {
        id: 'photo-2-flower',
        category: 'champ',
        level: 'LEVEL 2-3',
        age: '2-3 Years',
        title: '🌼 Nature Explorer: Little Flower Champion',
        caption: 'Sweet golden sunshine angrakha, exploring nature and sharing pretty yellow flowers with family!',
        tag: 'LITTLE CHAMPION',
        sticker: '🌟 PURE JOY!',
        image: p.img2 || 'img2.jpeg',
        likes: 98
      },
      {
        id: 'photo-7-garden',
        category: 'champ',
        level: 'LEVEL 2-3',
        age: 'Garden Days',
        title: '🌿 Sunshine Moments in the Garden',
        caption: 'Curious little explorer discovering nature with radiant heartwarming smiles and boundless wonder!',
        tag: 'GARDEN HERO',
        sticker: '🌻 SUNSHINE!',
        image: p.img7 || 'img7.jpeg',
        likes: 92
      },
      {
        id: 'photo-3-suspenders',
        category: 'baby',
        level: 'LEVEL 0-1',
        age: '9-12 Months',
        title: '👔 Little Gentleman in Suspenders',
        caption: 'Dapper smart polka-dot shirt with suspenders and the most charming cheeky baby grin!',
        tag: 'DAPPER BABY',
        sticker: '✨ HANDSOME!',
        image: p.img || 'img.jpeg',
        likes: 110
      },
      {
        id: 'photo-4-eyes',
        category: 'baby',
        level: 'LEVEL 0',
        age: '6 Months',
        title: '🍼 Big Sparkling Eyes: The Origin',
        caption: 'The cutest baby close-up with huge curious sparkling eyes and sweetest heartwarming innocence!',
        tag: 'ORIGIN STORY',
        sticker: '🍼 TOO CUTE!',
        image: p.img3 || 'img3.jpeg',
        likes: 96
      },
      {
        id: 'photo-8-baby-joy',
        category: 'baby',
        level: 'LEVEL 0',
        age: 'Sweet Giggles',
        title: '💖 Pure Sweet Baby Innocence',
        caption: 'Irresistible baby smile and sparkling eyes surrounded by unconditional love from family!',
        tag: 'CUDDLE HERO',
        sticker: '🥰 SWEETHEART!',
        image: p.img8 || 'img8.jpeg',
        likes: 105
      },
      {
        id: 'photo-4-dadi',
        category: 'baby',
        level: 'LEVEL 1',
        age: '1 Year',
        title: '👶 Auto Cruise with Super-Dadi',
        caption: 'Enjoying fun rides in the city with beloved grandmother, thumb-sucking coolness, and endless love!',
        tag: 'FAMILY LOVE',
        sticker: '❤️ PURE LOVE',
        image: p.img4 || 'img4.jpeg',
        likes: 125
      }
    ];

    this.photos = [];
    this.init();
  }

  init() {
    this.loadPhotos();
    this.initBackgroundSystem();
    this.render();
    this.setupEventListeners();
  }

  loadPhotos() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const p = window.HERO_PHOTOS || {};
          this.photos = parsed.map(item => {
            if (item.id === 'photo-1-archer' && p.img1) item.image = p.img1;
            if (item.id === 'photo-6-krishna' && p.img6) item.image = p.img6;
            if (item.id === 'photo-5-prince-portrait' && p.img5) item.image = p.img5;
            if (item.id === 'photo-2-flower' && p.img2) item.image = p.img2;
            if (item.id === 'photo-7-garden' && p.img7) item.image = p.img7;
            if (item.id === 'photo-3-suspenders' && p.img) item.image = p.img;
            if (item.id === 'photo-4-eyes' && p.img3) item.image = p.img3;
            if (item.id === 'photo-8-baby-joy' && p.img8) item.image = p.img8;
            if (item.id === 'photo-4-dadi' && p.img4) item.image = p.img4;
            return item;
          });
        } else {
          this.photos = [...this.defaultPhotos];
        }
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
      console.warn('Storage error', e);
    }
  }

  /* ----------------- Background Engine ----------------- */
  initBackgroundSystem() {
    const bgElement = document.getElementById('site-bg-image');
    if (!bgElement) return;

    const p = window.HERO_PHOTOS || {};
    const defaultBg = p.img1 || p.img6 || 'img1.jpeg';
    const savedBg = localStorage.getItem(this.bgStorageKey) || defaultBg;
    const savedOpacity = localStorage.getItem(this.bgOpacityKey) || '0.68';

    this.setBackground(savedBg, false);
    this.setBackgroundOpacity(savedOpacity);

    // Setup switcher buttons and highlight currently active
    const bgBtns = document.querySelectorAll('.bg-switcher-btn');
    bgBtns.forEach(btn => {
      const bgKey = btn.getAttribute('data-bg-key');
      if (p[bgKey] === savedBg || (!savedBg && bgKey === 'img1')) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }

      btn.addEventListener('click', () => {
        if (p[bgKey]) {
          this.setBackground(p[bgKey], true);
          bgBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
        }
      });
    });
  }

  setBackground(imgUrl, notify = true) {
    const bgElement = document.getElementById('site-bg-image');
    if (bgElement) {
      bgElement.style.backgroundImage = `url("${imgUrl}")`;
      localStorage.setItem(this.bgStorageKey, imgUrl);
      
      // Update active state of background switcher buttons
      const p = window.HERO_PHOTOS || {};
      const bgBtns = document.querySelectorAll('.bg-switcher-btn');
      bgBtns.forEach(btn => {
        const bgKey = btn.getAttribute('data-bg-key');
        if (p[bgKey] === imgUrl) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });

      if (notify) {
        if (window.superAudio) window.superAudio.playPowerUp();
        if (window.confetti) window.confetti({ particleCount: 40, spread: 60 });
        this.showToast('🌟 Website Superhero Background Updated!');
      }
    }
  }

  setBackgroundOpacity(opacity) {
    const bgElement = document.getElementById('site-bg-image');
    if (bgElement) {
      bgElement.style.opacity = opacity;
      localStorage.setItem(this.bgOpacityKey, opacity);
    }
  }

  showToast(message) {
    let toast = document.getElementById('super-site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'super-site-toast';
      toast.className = 'super-site-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }

  /* ----------------- Filter and Render ----------------- */
  getFilteredPhotos() {
    if (this.currentFilter === 'all') return this.photos;
    return this.photos.filter(p => p.category === this.currentFilter);
  }

  setFilter(category) {
    this.currentFilter = category;
    const filterBtns = document.querySelectorAll('.milestone-filter-btn');
    filterBtns.forEach(btn => {
      if (btn.getAttribute('data-filter') === category) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    this.render();
    if (window.superAudio) window.superAudio.playPop();
  }

  render() {
    if (!this.grid) return;
    this.grid.innerHTML = '';

    const list = this.getFilteredPhotos();
    const savedBg = localStorage.getItem(this.bgStorageKey);

    if (list.length === 0) {
      this.grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align:center; padding: 40px; color:#94A3B8;">
          <div style="font-size:48px; margin-bottom:10px;">🌟</div>
          <h3 style="font-family:var(--font-hero); color:#FDE047;">No memories found in this milestone</h3>
          <p>Click "Add Hero Photo" above to add new baby memories!</p>
        </div>
      `;
      return;
    }

    list.forEach((photo) => {
      const card = document.createElement('div');
      card.className = 'baby-scrapbook-card';

      const isCurrentBg = savedBg && (savedBg === photo.image);

      card.innerHTML = `
        <div class="scrapbook-badge">${photo.level || 'HERO'} • ${photo.age || ''}</div>
        <div class="scrapbook-sticker">${photo.sticker || '⭐ SUPER!'}</div>
        ${photo.id.startsWith('photo-custom-') ? `<button class="delete-photo-btn" title="Remove Photo" data-id="${photo.id}">✖</button>` : ''}
        
        <div class="scrapbook-img-wrapper" title="Click to View Fullscreen">
          <img src="${photo.image}" alt="${photo.title}" loading="lazy">
          <div class="img-hover-overlay">
            <span>🔍 Inspect Photo</span>
          </div>
        </div>

        <div class="scrapbook-details">
          <h4 class="scrapbook-title">${photo.title}</h4>
          <p class="scrapbook-caption">${photo.caption}</p>
          
          <div class="scrapbook-actions">
            <button class="scrapbook-action-btn like-btn" data-id="${photo.id}" title="Send Love!">
              <span class="like-heart">❤️</span> <span class="like-count">${photo.likes || 0}</span>
            </button>
            <button class="scrapbook-action-btn set-bg-action-btn ${isCurrentBg ? 'active-bg-btn' : ''}" title="Set this photo as website background">
              ${isCurrentBg ? '✓ Active Background' : '🖼️ Set Background'}
            </button>
          </div>
        </div>
      `;

      // Open Lightbox
      card.querySelector('.scrapbook-img-wrapper').addEventListener('click', () => {
        const fullIndex = this.photos.findIndex(p => p.id === photo.id);
        this.openLightbox(fullIndex);
      });

      // Like
      const likeBtn = card.querySelector('.like-btn');
      likeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.likePhoto(photo.id, likeBtn);
      });

      // Set as Background
      const setBgBtn = card.querySelector('.set-bg-action-btn');
      setBgBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.setBackground(photo.image, true);
        this.render();
      });

      // Delete Custom Photo
      const delBtn = card.querySelector('.delete-photo-btn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deletePhoto(photo.id);
        });
      }

      this.grid.appendChild(card);
    });
  }

  likePhoto(id, btnElement) {
    const photo = this.photos.find(p => p.id === id);
    if (photo) {
      photo.likes = (photo.likes || 0) + 1;
      this.savePhotos();
      
      const countEl = btnElement.querySelector('.like-count');
      if (countEl) countEl.textContent = photo.likes;

      btnElement.classList.add('liked-pulse');
      setTimeout(() => btnElement.classList.remove('liked-pulse'), 300);

      if (window.superAudio) window.superAudio.playPop();
    }
  }

  deletePhoto(id) {
    this.photos = this.photos.filter(p => p.id !== id);
    this.savePhotos();
    this.render();
    if (window.superAudio) window.superAudio.playPop();
  }

  processFiles(fileList) {
    Array.from(fileList).forEach(file => {
      if (!file.type.startsWith('image/')) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: 'photo-custom-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          category: 'hero',
          level: 'HERO MEMORY',
          age: 'Birthday Hero',
          title: file.name.replace(/\.[^/.]+$/, '').substring(0, 24) || 'Super Baby Memory',
          caption: 'Special moment added to the Level 5 Superhero vault!',
          tag: 'SUPERSTAR!',
          sticker: '🌟 AMAZING!',
          image: event.target.result,
          likes: 1
        };
        this.photos.unshift(newPhoto);
        this.savePhotos();
        this.render();
        if (window.superAudio) window.superAudio.playPowerUp();
        if (window.confetti) window.confetti({ particleCount: 40, spread: 60 });
        this.showToast('🎉 New Photo Added to Baby Album!');
      };
      reader.readAsDataURL(file);
    });
  }

  openLightbox(index) {
    if (index < 0 || index >= this.photos.length) return;
    this.currentLightboxIndex = index;
    const photo = this.photos[index];

    if (this.modalImg) this.modalImg.src = photo.image;
    if (this.modalCaption) {
      this.modalCaption.innerHTML = `
        <div class="burst-tag" style="margin-bottom:8px;">${photo.level || 'HERO'} • ${photo.age || ''}</div>
        <h3 style="font-family:var(--font-hero); font-size:22px; color:#FDE047; margin-bottom:6px;">${photo.title}</h3>
        <p style="color:#E2E8F0; font-size:15px; margin-bottom:12px;">${photo.caption}</p>
        <div style="display:flex; justify-content:center; gap:10px; flex-wrap:wrap;">
          <button id="modal-set-bg-btn" class="hero-btn btn-gold" style="font-size:13px;">🖼️ Set as Background</button>
          <button id="modal-download-btn" class="hero-btn btn-primary" style="font-size:13px;">💾 Download</button>
        </div>
      `;

      const modalBgBtn = document.getElementById('modal-set-bg-btn');
      if (modalBgBtn) {
        modalBgBtn.addEventListener('click', () => {
          this.setBackground(photo.image, true);
          this.render();
        });
      }

      const downloadBtn = document.getElementById('modal-download-btn');
      if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
          const a = document.createElement('a');
          a.href = photo.image;
          a.download = `${photo.title.replace(/[^a-z0-9]/gi, '_')}.jpeg`;
          a.click();
        });
      }
    }

    if (this.modal) this.modal.style.display = 'flex';
    if (window.superAudio) window.superAudio.playPop();
  }

  nextLightbox() {
    this.currentLightboxIndex = (this.currentLightboxIndex + 1) % this.photos.length;
    this.openLightbox(this.currentLightboxIndex);
  }

  prevLightbox() {
    this.currentLightboxIndex = (this.currentLightboxIndex - 1 + this.photos.length) % this.photos.length;
    this.openLightbox(this.currentLightboxIndex);
  }

  openSlideshow() {
    if (!this.slideshowModal) return;
    this.slideshowModal.style.display = 'flex';
    this.currentSlideIndex = 0;
    this.showSlide(0);
    this.startSlideshowAutoPlay();
    if (window.superAudio) window.superAudio.playFanfare();
    if (window.confetti) window.confetti({ particleCount: 50, spread: 70 });
  }

  closeSlideshow() {
    if (!this.slideshowModal) return;
    this.slideshowModal.style.display = 'none';
    this.stopSlideshowAutoPlay();
  }

  showSlide(index) {
    if (index < 0 || index >= this.photos.length) return;
    this.currentSlideIndex = index;
    const photo = this.photos[index];

    if (this.slideshowImg) this.slideshowImg.src = photo.image;
    if (this.slideshowTitle) this.slideshowTitle.textContent = photo.title;
    if (this.slideshowDesc) this.slideshowDesc.textContent = photo.caption;
    if (this.slideshowMilestone) this.slideshowMilestone.textContent = `${photo.level || 'LEVEL'} • ${photo.age || ''}`;
    if (this.slideshowIndex) this.slideshowIndex.textContent = `${index + 1} / ${this.photos.length}`;

    if (this.slideshowProgress) {
      this.slideshowProgress.style.transition = 'none';
      this.slideshowProgress.style.width = '0%';
      setTimeout(() => {
        if (this.slideshowPlaying) {
          this.slideshowProgress.style.transition = 'width 3.5s linear';
          this.slideshowProgress.style.width = '100%';
        }
      }, 50);
    }
  }

  nextSlide() {
    const nextIdx = (this.currentSlideIndex + 1) % this.photos.length;
    this.showSlide(nextIdx);
    if (window.superAudio) window.superAudio.playPop();
  }

  prevSlide() {
    const prevIdx = (this.currentSlideIndex - 1 + this.photos.length) % this.photos.length;
    this.showSlide(prevIdx);
    if (window.superAudio) window.superAudio.playPop();
  }

  startSlideshowAutoPlay() {
    this.slideshowPlaying = true;
    if (this.slideshowPlayPauseBtn) this.slideshowPlayPauseBtn.innerHTML = '⏸️ Pause';
    this.resetSlideshowTimer();
  }

  stopSlideshowAutoPlay() {
    this.slideshowPlaying = false;
    if (this.slideshowPlayPauseBtn) this.slideshowPlayPauseBtn.innerHTML = '▶️ Play';
    if (this.slideshowTimer) clearInterval(this.slideshowTimer);
    if (this.slideshowProgress) this.slideshowProgress.style.width = '0%';
  }

  toggleSlideshowPlayPause() {
    if (this.slideshowPlaying) {
      this.stopSlideshowAutoPlay();
    } else {
      this.startSlideshowAutoPlay();
    }
  }

  resetSlideshowTimer() {
    if (this.slideshowTimer) clearInterval(this.slideshowTimer);
    if (!this.slideshowPlaying) return;

    if (this.slideshowProgress) {
      this.slideshowProgress.style.transition = 'width 3.5s linear';
      this.slideshowProgress.style.width = '100%';
    }

    this.slideshowTimer = setInterval(() => {
      this.nextSlide();
    }, 3500);
  }

  setupEventListeners() {
    const filterBtns = document.querySelectorAll('.milestone-filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const filter = btn.getAttribute('data-filter');
        this.setFilter(filter);
      });
    });

    if (this.uploadBtn && this.fileInput) {
      this.uploadBtn.addEventListener('click', () => this.fileInput.click());
      this.fileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files.length > 0) {
          this.processFiles(e.target.files);
        }
      });
    }

    if (this.resetBtn) {
      this.resetBtn.addEventListener('click', () => {
        this.photos = [...this.defaultPhotos];
        this.savePhotos();
        this.render();
        if (window.superAudio) window.superAudio.playFanfare();
        this.showToast('🔄 Reset to Original Growth Photos');
      });
    }

    if (this.slideshowBtn) {
      this.slideshowBtn.addEventListener('click', () => this.openSlideshow());
    }

    if (this.closeSlideshowBtn) {
      this.closeSlideshowBtn.addEventListener('click', () => this.closeSlideshow());
    }

    if (this.slideshowPlayPauseBtn) {
      this.slideshowPlayPauseBtn.addEventListener('click', () => this.toggleSlideshowPlayPause());
    }

    if (this.slideshowNextBtn) {
      this.slideshowNextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.resetSlideshowTimer();
      });
    }

    if (this.slideshowPrevBtn) {
      this.slideshowPrevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.resetSlideshowTimer();
      });
    }

    if (this.closeModalBtn && this.modal) {
      this.closeModalBtn.addEventListener('click', () => {
        this.modal.style.display = 'none';
      });
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.modal.style.display = 'none';
      });
    }

    if (this.prevPhotoBtn) {
      this.prevPhotoBtn.addEventListener('click', () => this.prevLightbox());
    }

    if (this.nextPhotoBtn) {
      this.nextPhotoBtn.addEventListener('click', () => this.nextLightbox());
    }

    window.addEventListener('keydown', (e) => {
      if (this.modal && this.modal.style.display === 'flex') {
        if (e.key === 'ArrowRight') this.nextLightbox();
        if (e.key === 'ArrowLeft') this.prevLightbox();
        if (e.key === 'Escape') this.modal.style.display = 'none';
      }
      if (this.slideshowModal && this.slideshowModal.style.display === 'flex') {
        if (e.key === 'ArrowRight') { this.nextSlide(); this.resetSlideshowTimer(); }
        if (e.key === 'ArrowLeft') { this.prevSlide(); this.resetSlideshowTimer(); }
        if (e.key === 'Escape') this.closeSlideshow();
        if (e.key === ' ') { e.preventDefault(); this.toggleSlideshowPlayPause(); }
      }
    });

    const dropzone = document.getElementById('baby-dropzone');
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

    const printBtn = document.getElementById('print-album-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.heroBabyAlbum = new HeroBabyAlbum();
  window.heroGallery = window.heroBabyAlbum;
});