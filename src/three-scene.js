import * as THREE from 'three';

export class QuantumCoreScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.wrapper = this.canvas.parentElement;
    this.autoRotate = true;

    // Mouse tracking with inertia
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };

    this.init();
    this.setupEvents();
    this.animate();
  }

  init() {
    // 1. Scene setup
    this.scene = new THREE.Scene();

    // 2. Camera setup
    const aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 7.5);

    // 3. Renderer setup
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // 4. Lighting setup (Optimized for luminous light-mode aesthetics)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x2563eb, 2.4);
    dirLight1.position.set(6, 8, 6);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x06b6d4, 1.8);
    dirLight2.position.set(-6, -6, -4);
    this.scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x60a5fa, 1.5, 12);
    pointLight.position.set(0, 0, 3);
    this.scene.add(pointLight);

    // 5. Main Node Group
    this.mainGroup = new THREE.Group();
    this.scene.add(this.mainGroup);

    // Outer Geometric Icosahedron Lattice (Sapphire Wireframe)
    const outerGeo = new THREE.IcosahedronGeometry(2.35, 2);
    this.outerMaterial = new THREE.MeshStandardMaterial({
      color: 0x2563eb,
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.15,
      metalness: 0.4
    });
    this.outerMesh = new THREE.Mesh(outerGeo, this.outerMaterial);
    this.mainGroup.add(this.outerMesh);

    // Inner Polished Titanium/Cobalt Knot
    const knotGeo = new THREE.TorusKnotGeometry(1.15, 0.3, 128, 28);
    this.knotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3b82f6,
      emissive: 0x1d4ed8,
      emissiveIntensity: 0.22,
      roughness: 0.1,
      metalness: 0.25,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      wireframe: false
    });
    this.knotMesh = new THREE.Mesh(knotGeo, this.knotMaterial);
    this.mainGroup.add(this.knotMesh);

    // Surrounding Floating Micro-Particle Cloud (Subtle Ambient Constellation)
    const particleCount = 180;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      const radius = 3.0 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i + 2] = radius * Math.cos(phi);
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.particleMaterial = new THREE.PointsMaterial({
      color: 0x2563eb,
      size: 0.05,
      transparent: true,
      opacity: 0.6,
      blending: THREE.NormalBlending
    });

    this.particles = new THREE.Points(particleGeo, this.particleMaterial);
    this.mainGroup.add(this.particles);

    this.clock = new THREE.Clock();
  }

  setupEvents() {
    // Parallax response on desktop
    window.addEventListener('mousemove', (e) => {
      const normX = (e.clientX / window.innerWidth) * 2 - 1;
      const normY = -(e.clientY / window.innerHeight) * 2 + 1;
      this.mouse.targetX = normX * 0.45;
      this.mouse.targetY = normY * 0.45;
    });

    // Touch and drag rotation
    this.canvas.addEventListener('mousedown', (e) => {
      this.isDragging = true;
      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!this.isDragging) return;
      const deltaX = e.clientX - this.previousMousePosition.x;
      const deltaY = e.clientY - this.previousMousePosition.y;

      this.mainGroup.rotation.y += deltaX * 0.008;
      this.mainGroup.rotation.x += deltaY * 0.008;

      this.previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    // Clean Resize
    window.addEventListener('resize', () => {
      if (!this.canvas) return;
      const width = this.canvas.clientWidth;
      const height = this.canvas.clientHeight;
      if (width && height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
      }
    });
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth inertia camera tracking
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.camera.position.x = this.mouse.x * 1.5;
    this.camera.position.y = this.mouse.y * 1.5;
    this.camera.lookAt(0, 0, 0);

    // Continuous elegant orbital rotation
    if (!this.isDragging) {
      this.outerMesh.rotation.y += delta * 0.16;
      this.outerMesh.rotation.x += delta * 0.1;

      this.knotMesh.rotation.y -= delta * 0.24;
      this.knotMesh.rotation.z += delta * 0.14;

      this.particles.rotation.y += delta * 0.06;
    }

    // Gentle breathing pulse
    const pulse = 1 + Math.sin(time * 1.6) * 0.025;
    this.knotMesh.scale.set(pulse, pulse, pulse);

    this.renderer.render(this.scene, this.camera);
  }
}
