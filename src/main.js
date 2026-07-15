/**
 * Main Entry Point — Pedro Miranda Portfolio
 * Orchestrates all modules: 3D scene, animations, cursor, preloader, navigation
 */
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { ParticleScene } from './three-scene.js';
import { initAnimations } from './animations.js';
import { initCursor } from './cursor.js';
import { initPreloader } from './preloader.js';
import '../style.css';

class Portfolio {
  constructor() {
    this.particleScene = null;
    this.animationCtx = null;
    this.lenis = null;

    this.init();
  }

  init() {
    // Start preloader, then init everything
    initPreloader(() => {
      this.initLenis();
      this.initThreeScene();
      this.initAnimations();
      this.initCursor();
      this.initNavigation();
      this.showNavbar();
    });
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    // Sync Lenis with GSAP ticker
    const raf = (time) => {
      this.lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    // Connect Lenis scroll to GSAP ScrollTrigger
    this.lenis.on('scroll', () => {
      // ScrollTrigger.update() is called automatically by the GSAP ticker
    });

    // Handle anchor clicks for smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
          this.lenis.scrollTo(target, { offset: -80 });
          // Close mobile menu if open
          this.closeMobileMenu();
        }
      });
    });
  }

  initThreeScene() {
    const canvas = document.getElementById('three-canvas');
    if (canvas) {
      this.particleScene = new ParticleScene(canvas);
    }
  }

  initAnimations() {
    this.animationCtx = initAnimations(this.particleScene);
  }

  initCursor() {
    initCursor();
  }

  showNavbar() {
    // Show navbar after a short delay
    setTimeout(() => {
      document.querySelector('.glass-nav')?.classList.add('visible');
    }, 300);
  }

  initNavigation() {
    const toggle = document.getElementById('nav-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (toggle && mobileMenu) {
      toggle.addEventListener('click', () => {
        const isActive = toggle.classList.contains('active');
        if (isActive) {
          this.closeMobileMenu();
        } else {
          toggle.classList.add('active');
          mobileMenu.classList.add('active');
          // Prevent scroll
          this.lenis?.stop();
        }
      });

      // Close on link click
      mobileMenu.querySelectorAll('.mobile-link').forEach((link) => {
        link.addEventListener('click', () => {
          this.closeMobileMenu();
        });
      });
    }
  }

  closeMobileMenu() {
    document.getElementById('nav-toggle')?.classList.remove('active');
    document.getElementById('mobile-menu')?.classList.remove('active');
    this.lenis?.start();
  }
}

// Boot
document.addEventListener('DOMContentLoaded', () => {
  new Portfolio();
});
