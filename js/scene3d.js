// Lightweight, High-Performance Three.js 3D Superhero Universe
class Superhero3DScene {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.heroGroup = null;
    this.particles = null;
    this.floatingBalloons = [];
    this.floatingCrystals = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
    this.isVisible = true;
    this.lastFrameTime = 0;
  }

  init() {
    if (!this.container || typeof THREE === 'undefined') return;

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 100);
    this.camera.position.set(0, 0, 30);

    // 2. High-Performance Lightweight Renderer
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "high-performance",
      precision: "mediump"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(1);
    this.container.appendChild(this.renderer.domElement);

    // 3. Simple Ambient & Directional Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xFDE047, 1.2);
    dirLight.position.set(10, 15, 15);
    this.scene.add(dirLight);

    // 4. Build 3D Flying Superhero
    this.createFlyingSuperhero();

    // 5. Build 3D Floating Balloons
    this.createFloatingBalloons();

    // 6. Build Starfield Particles
    this.createStarfield();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onResize(), { passive: true });
    
    // Throttled mouse parallax
    let mouseTimeout;
    window.addEventListener('mousemove', (e) => {
      if (!mouseTimeout) {
        mouseTimeout = setTimeout(() => {
          this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.0015;
          this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.0015;
          mouseTimeout = null;
        }, 16);
      }
    }, { passive: true });

    // Pause when document is hidden
    document.addEventListener('visibilitychange', () => {
      this.isVisible = !document.hidden;
    });

    // 8. Start Render Loop
    this.animate(0);
  }

  createFlyingSuperhero() {
    this.heroGroup = new THREE.Group();

    // Fast Lambert Materials
    const matSuit = new THREE.MeshLambertMaterial({ color: 0x1E40AF });
    const matSkin = new THREE.MeshLambertMaterial({ color: 0xFCD34D });
    const matGold = new THREE.MeshLambertMaterial({ color: 0xF59E0B });
    const matMask = new THREE.MeshLambertMaterial({ color: 0x0F172A });
    const matCape = new THREE.MeshLambertMaterial({ color: 0xEF4444, side: THREE.DoubleSide });

    // Torso
    const torsoGeom = new THREE.ConeGeometry(1.3, 2.5, 6);
    const torsoMesh = new THREE.Mesh(torsoGeom, matSuit);
    torsoMesh.rotation.x = Math.PI;
    this.heroGroup.add(torsoMesh);

    // Emblem
    const emblemGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.15, 8);
    const emblemMesh = new THREE.Mesh(emblemGeom, matGold);
    emblemMesh.rotation.x = Math.PI / 2;
    emblemMesh.position.set(0, 0.3, 0.65);
    this.heroGroup.add(emblemMesh);

    // Head
    const headGeom = new THREE.SphereGeometry(0.85, 10, 10);
    const headMesh = new THREE.Mesh(headGeom, matSkin);
    headMesh.position.y = 1.6;
    this.heroGroup.add(headMesh);

    // Mask
    const maskGeom = new THREE.BoxGeometry(1.2, 0.45, 0.9);
    const maskMesh = new THREE.Mesh(maskGeom, matMask);
    maskMesh.position.set(0, 1.65, 0.25);
    this.heroGroup.add(maskMesh);

    // Arms
    const armGeom = new THREE.CylinderGeometry(0.25, 0.25, 2.2, 6);
    
    const leftArm = new THREE.Mesh(armGeom, matSuit);
    leftArm.position.set(-1.2, 0.8, 0.4);
    leftArm.rotation.set(-0.8, 0, -0.3);
    this.heroGroup.add(leftArm);

    const rightArm = new THREE.Mesh(armGeom, matSuit);
    rightArm.position.set(1.2, 0.8, 0.4);
    rightArm.rotation.set(-0.8, 0, 0.3);
    this.heroGroup.add(rightArm);

    // Cape
    const capeGeom = new THREE.PlaneGeometry(1.8, 2.8, 2, 2);
    const capeMesh = new THREE.Mesh(capeGeom, matCape);
    capeMesh.position.set(0, 0.4, -0.7);
    capeMesh.rotation.x = 0.3;
    this.heroGroup.add(capeMesh);

    this.heroGroup.position.set(8, 2, 0);
    this.heroGroup.scale.set(1.1, 1.1, 1.1);
    this.scene.add(this.heroGroup);
  }

  createFloatingBalloons() {
    const colors = [0xEF4444, 0x3B82F6, 0xF59E0B, 0x10B981, 0x8B5CF6];
    const geom = new THREE.SphereGeometry(0.9, 8, 8);

    for (let i = 0; i < 6; i++) {
      const mat = new THREE.MeshLambertMaterial({ color: colors[i % colors.length] });
      const balloon = new THREE.Mesh(geom, mat);
      
      const x = (Math.random() - 0.5) * 32;
      const y = (Math.random() - 0.5) * 18;
      const z = (Math.random() - 0.5) * 15 - 5;
      
      balloon.position.set(x, y, z);
      balloon.userData = {
        initialY: y,
        speed: 0.001 + Math.random() * 0.001,
        offset: Math.random() * Math.PI * 2
      };
      
      this.scene.add(balloon);
      this.floatingBalloons.push(balloon);
    }
  }

  createStarfield() {
    const count = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 60;
      positions[i + 1] = (Math.random() - 0.5) * 40;
      positions[i + 2] = (Math.random() - 0.5) * 30 - 10;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({ size: 0.8, color: 0xFDE047, transparent: true, opacity: 0.75 });
    this.particles = new THREE.Points(geometry, mat);
    this.scene.add(this.particles);
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate(now) {
    requestAnimationFrame((time) => this.animate(time));

    if (!this.isVisible) return;

    // Cap frame rate to ~60fps max to save CPU
    if (now - this.lastFrameTime < 14) return;
    this.lastFrameTime = now;

    const time = now * 0.001;

    // Smooth Camera lerp
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.camera.position.x = this.mouseX * 8;
    this.camera.position.y = -this.mouseY * 6;
    this.camera.lookAt(0, 0, 0);

    // Hero Flight
    if (this.heroGroup) {
      this.heroGroup.position.x = 7 + Math.sin(time * 0.7) * 3 + this.mouseX * 5;
      this.heroGroup.position.y = 2 + Math.cos(time * 0.9) * 1.8 - this.mouseY * 4;
      this.heroGroup.rotation.z = Math.sin(time * 0.7) * 0.15;
    }

    // Floating Balloons
    for (let i = 0; i < this.floatingBalloons.length; i++) {
      const b = this.floatingBalloons[i];
      b.position.y = b.userData.initialY + Math.sin(time * 1.2 + b.userData.offset) * 1.2;
    }

    if (this.particles) {
      this.particles.rotation.y = time * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.superScene3D = new Superhero3DScene();