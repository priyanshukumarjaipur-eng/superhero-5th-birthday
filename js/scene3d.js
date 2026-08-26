// Advanced Three.js 3D Superhero Universe with Animated Flying Hero, Waving Cape & Laser Trail
class Superhero3DScene {
  constructor() {
    this.container = document.getElementById('webgl-canvas-container');
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.heroGroup = null;
    this.capeMesh = null;
    this.particles = null;
    this.jetParticles = [];
    this.floatingBalloons = [];
    this.floatingCrystals = [];
    this.mouseX = 0;
    this.mouseY = 0;
    this.targetMouseX = 0;
    this.targetMouseY = 0;
  }

  init() {
    if (!this.container || typeof THREE === 'undefined') {
      console.warn("Three.js not loaded");
      return;
    }

    // 1. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 32);

    // 2. Renderer
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.7);
    this.scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xFDE047, 1.8);
    dirLight.position.set(15, 20, 20);
    this.scene.add(dirLight);

    const blueLight = new THREE.PointLight(0x3B82F6, 3, 60);
    blueLight.position.set(-15, -10, 15);
    this.scene.add(blueLight);

    const cyanLight = new THREE.PointLight(0x06B6D4, 2, 40);
    cyanLight.position.set(0, 15, -10);
    this.scene.add(cyanLight);

    // 4. Build 3D Animated Superhero
    this.createFlyingSuperhero();

    // 5. Build 3D Floating Helium Balloons
    this.createFloatingBalloons();

    // 6. Build 3D Floating Cosmic Crystals
    this.createCosmicCrystals();

    // 7. Starfield Particles
    this.createStarfield();

    // 8. Event Listeners
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('mousemove', (e) => {
      this.targetMouseX = (e.clientX - window.innerWidth / 2) * 0.002;
      this.targetMouseY = (e.clientY - window.innerHeight / 2) * 0.002;
    });

    // 9. Start Render Loop
    this.animate();
  }

  createFlyingSuperhero() {
    this.heroGroup = new THREE.Group();

    // Suit Materials
    const matSuit = new THREE.MeshStandardMaterial({ color: 0x1E40AF, roughness: 0.3, metalness: 0.5 });
    const matSkin = new THREE.MeshStandardMaterial({ color: 0xFCD34D, roughness: 0.5 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.1, metalness: 0.8 });
    const matMask = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.2 });
    const matBoots = new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.3 });

    // Torso (Hero chest)
    const torsoGeom = new THREE.ConeGeometry(1.4, 2.8, 8);
    const torsoMesh = new THREE.Mesh(torsoGeom, matSuit);
    torsoMesh.rotation.x = Math.PI;
    torsoMesh.position.y = 0;
    this.heroGroup.add(torsoMesh);

    // Chest Golden 5 Emblem
    const emblemGeom = new THREE.CylinderGeometry(0.55, 0.55, 0.2, 16);
    const emblemMesh = new THREE.Mesh(emblemGeom, matGold);
    emblemMesh.rotation.x = Math.PI / 2;
    emblemMesh.position.set(0, 0.4, 0.7);
    this.heroGroup.add(emblemMesh);

    // Head
    const headGeom = new THREE.SphereGeometry(0.85, 16, 16);
    const headMesh = new THREE.Mesh(headGeom, matSkin);
    headMesh.position.set(0, 1.8, 0);
    this.heroGroup.add(headMesh);

    // Mask
    const maskGeom = new THREE.TorusGeometry(0.7, 0.2, 8, 16, Math.PI);
    const maskMesh = new THREE.Mesh(maskGeom, matMask);
    maskMesh.position.set(0, 1.85, 0.45);
    this.heroGroup.add(maskMesh);

    // Outstretched Flying Arms
    const armGeom = new THREE.CylinderGeometry(0.3, 0.25, 2.4, 8);
    
    // Left Arm (Flying forward)
    const leftArm = new THREE.Mesh(armGeom, matSuit);
    leftArm.position.set(-1.4, 1.2, 0.5);
    leftArm.rotation.set(-Math.PI / 3, 0, -Math.PI / 6);
    this.heroGroup.add(leftArm);

    // Right Arm (Flying forward with hero fist)
    const rightArm = new THREE.Mesh(armGeom, matSuit);
    rightArm.position.set(1.4, 1.2, 0.5);
    rightArm.rotation.set(-Math.PI / 3, 0, Math.PI / 6);
    this.heroGroup.add(rightArm);

    // Legs with Boots (extended back in flight)
    const legGeom = new THREE.CylinderGeometry(0.35, 0.3, 2.5, 8);
    const leftLeg = new THREE.Mesh(legGeom, matBoots);
    leftLeg.position.set(-0.6, -2.4, -0.6);
    leftLeg.rotation.x = Math.PI / 6;
    this.heroGroup.add(leftLeg);

    const rightLeg = new THREE.Mesh(legGeom, matBoots);
    rightLeg.position.set(0.6, -2.4, -0.6);
    rightLeg.rotation.x = Math.PI / 6;
    this.heroGroup.add(rightLeg);

    // Animated Cape (Cloth Grid)
    const capeGeom = new THREE.PlaneGeometry(2.4, 4.5, 8, 12);
    const matCape = new THREE.MeshStandardMaterial({ 
      color: 0xEF4444, 
      side: THREE.DoubleSide, 
      roughness: 0.4 
    });
    this.capeMesh = new THREE.Mesh(capeGeom, matCape);
    this.capeMesh.position.set(0, 0.2, -0.8);
    this.capeMesh.rotation.x = Math.PI / 3;
    this.heroGroup.add(this.capeMesh);

    // Glowing Jet Aura behind hero boots
    const ringGeom = new THREE.TorusGeometry(1.6, 0.08, 8, 24);
    const matRing = new THREE.MeshBasicMaterial({ color: 0x06B6D4 });
    const ringMesh = new THREE.Mesh(ringGeom, matRing);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.position.set(0, -3.2, -1);
    this.heroGroup.add(ringMesh);

    // Initial scale and position
    this.heroGroup.scale.set(1.3, 1.3, 1.3);
    this.heroGroup.position.set(8, 4, 2);
    this.heroGroup.rotation.set(0.4, -0.4, 0.2);
    this.scene.add(this.heroGroup);
  }

  createFloatingBalloons() {
    const balloonGeom = new THREE.SphereGeometry(1.2, 16, 16);
    balloonGeom.scale(1, 1.3, 1); // Oval balloon shape

    const colors = [0xEF4444, 0x3B82F6, 0xF59E0B, 0x8B5CF6, 0x10B981];

    for (let i = 0; i < 8; i++) {
      const mat = new THREE.MeshStandardMaterial({
        color: colors[i % colors.length],
        roughness: 0.2,
        metalness: 0.1
      });
      const balloon = new THREE.Mesh(balloonGeom, mat);
      balloon.position.set(
        (Math.random() - 0.5) * 45,
        (Math.random() - 0.5) * 30 - 5,
        (Math.random() - 0.5) * 15 - 5
      );
      balloon.userData = {
        floatSpeed: Math.random() * 0.015 + 0.008,
        floatOffset: Math.random() * Math.PI * 2,
        initialX: balloon.position.x,
        initialY: balloon.position.y
      };
      this.scene.add(balloon);
      this.floatingBalloons.push(balloon);
    }
  }

  createCosmicCrystals() {
    const crystalGeom = new THREE.OctahedronGeometry(1.1, 0);
    const matCrystal = new THREE.MeshStandardMaterial({
      color: 0xFDE047,
      roughness: 0.1,
      metalness: 0.9,
      emissive: 0x92400E,
      emissiveIntensity: 0.4
    });

    for (let i = 0; i < 12; i++) {
      const mesh = new THREE.Mesh(crystalGeom, matCrystal);
      mesh.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 35,
        (Math.random() - 0.5) * 25
      );
      mesh.userData = {
        rotX: (Math.random() - 0.5) * 0.03,
        rotY: (Math.random() - 0.5) * 0.03,
        initialY: mesh.position.y,
        offset: Math.random() * Math.PI * 2
      };
      this.scene.add(mesh);
      this.floatingCrystals.push(mesh);
    }
  }

  createStarfield() {
    const count = 400;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const palette = [
      new THREE.Color(0xFDE047),
      new THREE.Color(0x60A5FA),
      new THREE.Color(0x38BDF8),
      new THREE.Color(0xF43F5E)
    ];

    for (let i = 0; i < count * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 60;
      positions[i + 2] = (Math.random() - 0.5) * 40;

      const c = palette[Math.floor(Math.random() * palette.length)];
      colors[i] = c.r;
      colors[i + 1] = c.g;
      colors[i + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.7,
      vertexColors: true,
      transparent: true,
      opacity: 0.85
    });

    this.particles = new THREE.Points(geometry, mat);
    this.scene.add(this.particles);
  }

  onResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const time = Date.now() * 0.001;

    // 1. Smooth Camera follow mouse
    this.mouseX += (this.targetMouseX - this.mouseX) * 0.05;
    this.mouseY += (this.targetMouseY - this.mouseY) * 0.05;
    this.camera.position.x = this.mouseX * 12;
    this.camera.position.y = -this.mouseY * 10;
    this.camera.lookAt(this.scene.position);

    // 2. Animate 3D Flying Superhero
    if (this.heroGroup) {
      // Flight Lissajous Curve Path
      this.heroGroup.position.x = 8 + Math.sin(time * 0.8) * 4 + this.mouseX * 8;
      this.heroGroup.position.y = 3 + Math.cos(time * 1.2) * 2.5 - this.mouseY * 6;
      this.heroGroup.position.z = 2 + Math.sin(time * 0.6) * 2;

      // Banking rotation during flight
      this.heroGroup.rotation.z = Math.sin(time * 0.8) * 0.2 + 0.1;
      this.heroGroup.rotation.x = 0.4 + Math.sin(time * 1.2) * 0.1;
      this.heroGroup.rotation.y = -0.3 + Math.cos(time * 0.8) * 0.2;
    }

    // 3. Waving Cape Mesh Deformation
    if (this.capeMesh) {
      const pos = this.capeMesh.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getY(i);
        const wave = Math.sin(time * 6 + u * 1.5) * 0.3 * (Math.abs(u) + 0.2);
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;
    }

    // 4. Animate Floating Balloons
    this.floatingBalloons.forEach(b => {
      b.position.y = b.userData.initialY + Math.sin(time * 1.5 + b.userData.floatOffset) * 2;
      b.rotation.y += 0.005;
      b.rotation.z = Math.sin(time + b.userData.floatOffset) * 0.05;
    });

    // 5. Animate Cosmic Crystals
    this.floatingCrystals.forEach(c => {
      c.rotation.x += c.userData.rotX;
      c.rotation.y += c.userData.rotY;
      c.position.y = c.userData.initialY + Math.sin(time * 2 + c.userData.offset) * 1.2;
    });

    // 6. Slowly rotate starfield
    if (this.particles) {
      this.particles.rotation.y = time * 0.02;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.superScene3D = new Superhero3DScene();