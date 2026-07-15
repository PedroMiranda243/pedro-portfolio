/**
 * GSAP Animations & ScrollTrigger — Scrollytelling Engine
 * Controls all scroll-driven animations, reveals, and kinetic typography
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAnimations(particleScene) {
  // Wait for DOM
  const ctx = gsap.context(() => {
    // ====== HERO ANIMATIONS ======
    heroAnimation();

    // ====== SCROLL PROGRESS BAR ======
    scrollProgressBar();

    // ====== NAVBAR ======
    navbarAnimation();

    // ====== ABOUT SECTION ======
    aboutAnimations();

    // ====== EXPERIENCE TIMELINE ======
    timelineAnimations();

    // ====== SKILLS ======
    skillsAnimations();

    // ====== EDUCATION ======
    educationAnimations();

    // ====== CONTACT ======
    contactAnimations();

    // ====== KINETIC TITLES ======
    kineticTitles();

    // ====== SECTION HEADERS ======
    sectionHeaderAnimations();

    // ====== 3D SCROLL SYNC ======
    if (particleScene) {
      scrollSync3D(particleScene);
    }

    // ====== ACTIVE NAV LINK ======
    activeNavTracking();
  });

  return ctx;
}

function heroAnimation() {
  const tl = gsap.timeline({ delay: 0.2 });

  // Animate each character
  tl.to('.hero-line-1 .char-wrap', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.05,
    ease: 'expo.out',
  })
  .to('.hero-line-2 .char-wrap', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.05,
    ease: 'expo.out',
  }, '-=0.5')
  .from('.hero-tag', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.4')
  .from('.hero-subtitle-wrap', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.3')
  .from('.hero-description', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.3')
  .from('.hero-cta', {
    y: 20,
    opacity: 0,
    duration: 0.6,
    ease: 'power3.out',
  }, '-=0.2')
  .from('.scroll-indicator', {
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
  }, '-=0.2');

  // Hero parallax on scroll
  gsap.to('.hero-content', {
    y: -100,
    opacity: 0,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: 1,
    },
  });

  gsap.to('.scroll-indicator', {
    opacity: 0,
    y: -30,
    scrollTrigger: {
      trigger: '.hero-section',
      start: '10% top',
      end: '25% top',
      scrub: 1,
    },
  });
}

function scrollProgressBar() {
  gsap.to('#scroll-progress', {
    width: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

function navbarAnimation() {
  const nav = document.querySelector('.glass-nav');
  
  ScrollTrigger.create({
    trigger: '.hero-section',
    start: '80% top',
    onEnter: () => nav.classList.add('scrolled'),
    onLeaveBack: () => nav.classList.remove('scrolled'),
  });
}

function aboutAnimations() {
  // About cards stagger
  gsap.utils.toArray('.about-card').forEach((card, i) => {
    gsap.from(card, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.1,
    });
  });

  // Stats counter animation
  gsap.utils.toArray('.stat-card').forEach((card, i) => {
    const numberEl = card.querySelector('.stat-number');
    const target = parseInt(numberEl.dataset.target);

    gsap.from(card, {
      scale: 0.8,
      opacity: 0,
      duration: 0.6,
      ease: 'back.out(1.5)',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.1,
    });

    // Counter
    const counter = { val: 0 };
    gsap.to(counter, {
      val: target,
      duration: 1.5,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.1 + 0.3,
      onUpdate: () => {
        numberEl.textContent = Math.round(counter.val);
      },
    });
  });
}

function timelineAnimations() {
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.to(item, {
      x: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 82%',
        end: 'top 50%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.05,
    });

    // Marker glow
    const dot = item.querySelector('.marker-dot');
    gsap.from(dot, {
      scale: 0,
      duration: 0.5,
      ease: 'back.out(2)',
      scrollTrigger: {
        trigger: item,
        start: 'top 82%',
        toggleActions: 'play none none reverse',
      },
      delay: 0.3,
    });
  });
}

function skillsAnimations() {
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      y: 60,
      opacity: 0,
      rotateX: 10,
      duration: 0.7,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.08,
    });

    // Skill bar fill animation
    const barFill = card.querySelector('.skill-bar-fill');
    if (barFill) {
      const targetWidth = barFill.dataset.width;
      gsap.to(barFill, {
        width: `${targetWidth}%`,
        duration: 1.2,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
        delay: 0.4,
      });
    }
  });
}

function educationAnimations() {
  gsap.from('.edu-main', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.edu-main',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('#edu-monitor', {
    y: 40,
    opacity: 0,
    scale: 0.95,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '#edu-monitor',
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  });

  // Cert cards stagger
  gsap.utils.toArray('.cert-card').forEach((card, i) => {
    gsap.from(card, {
      x: -40,
      opacity: 0,
      duration: 0.6,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.08,
    });
  });
}

function contactAnimations() {
  gsap.from('.contact-headline', {
    y: 40,
    opacity: 0,
    duration: 0.8,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.contact-section',
      start: 'top 75%',
      toggleActions: 'play none none reverse',
    },
  });

  gsap.from('.contact-text p', {
    y: 30,
    opacity: 0,
    duration: 0.7,
    ease: 'expo.out',
    scrollTrigger: {
      trigger: '.contact-text',
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    delay: 0.15,
  });

  gsap.utils.toArray('.contact-card').forEach((card, i) => {
    gsap.from(card, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none reverse',
      },
      delay: i * 0.08,
    });
  });

  gsap.from('.contact-availability', {
    opacity: 0,
    scale: 0.9,
    duration: 0.6,
    ease: 'back.out(1.5)',
    scrollTrigger: {
      trigger: '.contact-availability',
      start: 'top 90%',
      toggleActions: 'play none none reverse',
    },
  });
}

function kineticTitles() {
  gsap.utils.toArray('.kinetic-title').forEach((title) => {
    gsap.fromTo(title, {
      x: -50,
    }, {
      x: 50,
      ease: 'none',
      scrollTrigger: {
        trigger: title,
        start: 'top 90%',
        end: 'top 20%',
        scrub: 1,
      },
    });
  });
}

function sectionHeaderAnimations() {
  gsap.utils.toArray('.section-header').forEach((header) => {
    const number = header.querySelector('.section-number');
    const line = header.querySelector('.section-line');

    gsap.from(number, {
      x: -20,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    });

    gsap.from(line, {
      width: 0,
      duration: 0.8,
      ease: 'expo.out',
      scrollTrigger: {
        trigger: header,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
      delay: 0.3,
    });
  });
}

function scrollSync3D(particleScene) {
  ScrollTrigger.create({
    trigger: 'body',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: (self) => {
      particleScene.updateScroll(self.progress);
    },
  });
}

function activeNavTracking() {
  const sections = ['hero', 'about', 'experience', 'skills', 'education', 'contact'];

  sections.forEach((id) => {
    ScrollTrigger.create({
      trigger: `#${id}`,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setActiveNav(id),
      onEnterBack: () => setActiveNav(id),
    });
  });
}

function setActiveNav(sectionId) {
  document.querySelectorAll('.nav-link').forEach((link) => {
    link.classList.toggle('active', link.dataset.section === sectionId);
  });
}
