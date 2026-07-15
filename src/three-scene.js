/**
 * Three.js Particle System — Interactive 3D Background
 * Creates an immersive particle field that reacts to mouse movement
 */
import * as THREE from 'three';

export class ParticleScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.mouse = new THREE.Vector2(0, 0);
    this.targetMouse = new THREE.Vector2(0, 0);
    this.scrollProgress = 0;
    this.clock = new THREE.Clock();
    this.isDestroyed = false;

    this.init();
    this.createParticles();
    this.createGeometricShapes();
    this.setupEvents();
    this.animate();
  }

  init() {
    // Scene
    this.scene = new THREE.Scene();

    // Camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 30;

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x000000, 0);
  }

  createParticles() {
    const count = 1500;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    const palette = [
      new THREE.Color('#FF6B35'),
      new THREE.Color('#F7C548'),
      new THREE.Color('#1B998B'),
      new THREE.Color('#E71D36'),
      new THREE.Color('#8B5CF6'),
    ];

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      // Spread particles in a sphere-ish volume
      positions[i3] = (Math.random() - 0.5) * 80;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      // Random color from palette
      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i3] = color.r;
      colors[i3 + 1] = color.g;
      colors[i3 + 2] = color.b;

      sizes[i] = Math.random() * 3 + 0.5;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

    // Custom shader material for particles
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying float vAlpha;
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uPixelRatio;

        void main() {
          vColor = color;
          
          vec3 pos = position;
          
          // Gentle floating animation
          pos.x += sin(uTime * 0.3 + position.y * 0.1) * 1.5;
          pos.y += cos(uTime * 0.2 + position.x * 0.1) * 1.5;
          pos.z += sin(uTime * 0.15 + position.x * 0.05) * 1.0;
          
          // Mouse influence
          float mouseInfluence = smoothstep(25.0, 0.0, length(pos.xy - uMouse * 30.0));
          pos.z += mouseInfluence * 8.0;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * uPixelRatio * (80.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
          
          // Alpha based on depth
          vAlpha = smoothstep(-60.0, 0.0, mvPosition.z) * (0.4 + mouseInfluence * 0.6);
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;

        void main() {
          // Circular particle with soft edge
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          
          float alpha = smoothstep(0.5, 0.1, dist) * vAlpha;
          gl_FragColor = vec4(vColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.particles = new THREE.Points(geometry, material);
    this.scene.add(this.particles);
  }

  createGeometricShapes() {
    this.shapes = [];

    // Floating wireframe shapes
    const geometries = [
      new THREE.IcosahedronGeometry(2, 0),
      new THREE.OctahedronGeometry(1.5, 0),
      new THREE.TetrahedronGeometry(1.8, 0),
      new THREE.TorusGeometry(1.5, 0.3, 8, 16),
    ];

    const colors = [0xFF6B35, 0x1B998B, 0xF7C548, 0x8B5CF6];

    geometries.forEach((geo, i) => {
      const material = new THREE.MeshBasicMaterial({
        color: colors[i],
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      });

      const mesh = new THREE.Mesh(geo, material);
      mesh.position.set(
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30,
        (Math.random() - 0.5) * 20 - 10
      );
      mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      this.shapes.push({
        mesh,
        rotSpeed: {
          x: (Math.random() - 0.5) * 0.01,
          y: (Math.random() - 0.5) * 0.01,
          z: (Math.random() - 0.5) * 0.005,
        },
        floatOffset: Math.random() * Math.PI * 2,
      });

      this.scene.add(mesh);
    });
  }

  setupEvents() {
    window.addEventListener('mousemove', (e) => {
      this.targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    window.addEventListener('resize', () => {
      if (this.isDestroyed) return;
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      if (this.particles) {
        this.particles.material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
      }
    });
  }

  updateScroll(progress) {
    this.scrollProgress = progress;
  }

  animate() {
    if (this.isDestroyed) return;

    const elapsed = this.clock.getElapsedTime();

    // Smooth mouse
    this.mouse.lerp(this.targetMouse, 0.05);

    // Update particle uniforms
    if (this.particles) {
      this.particles.material.uniforms.uTime.value = elapsed;
      this.particles.material.uniforms.uMouse.value.copy(this.mouse);

      // Subtle rotation based on scroll
      this.particles.rotation.y = this.scrollProgress * 0.5;
      this.particles.rotation.x = this.scrollProgress * 0.2;
    }

    // Animate shapes
    this.shapes.forEach((shape) => {
      shape.mesh.rotation.x += shape.rotSpeed.x;
      shape.mesh.rotation.y += shape.rotSpeed.y;
      shape.mesh.rotation.z += shape.rotSpeed.z;
      shape.mesh.position.y += Math.sin(elapsed + shape.floatOffset) * 0.005;
    });

    // Camera gentle sway
    this.camera.position.x = this.mouse.x * 2;
    this.camera.position.y = this.mouse.y * 1.5;
    this.camera.lookAt(0, 0, 0);

    // Render
    this.renderer.render(this.scene, this.camera);
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  destroy() {
    this.isDestroyed = true;
    cancelAnimationFrame(this.animationId);

    // Dispose
    this.scene.traverse((child) => {
      if (child.geometry) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(m => m.dispose());
        } else {
          child.material.dispose();
        }
      }
    });

    this.renderer.dispose();
  }
}
