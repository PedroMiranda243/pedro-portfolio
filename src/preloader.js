/**
 * Preloader — Animated loading screen with progress bar
 */
import { gsap } from 'gsap';

export function initPreloader(onComplete) {
  const preloader = document.getElementById('preloader');
  const barFill = document.querySelector('.preloader-bar-fill');

  if (!preloader || !barFill) {
    onComplete?.();
    return;
  }

  // Simulate loading progress
  const tl = gsap.timeline({
    onComplete: () => {
      // Fade out preloader
      gsap.to(preloader, {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.inOut',
        onComplete: () => {
          preloader.classList.add('hidden');
          preloader.style.display = 'none';
          onComplete?.();
        },
      });
    },
  });

  tl.to(barFill, {
    width: '30%',
    duration: 0.4,
    ease: 'power1.inOut',
  })
  .to(barFill, {
    width: '60%',
    duration: 0.3,
    ease: 'power1.inOut',
  })
  .to(barFill, {
    width: '85%',
    duration: 0.4,
    ease: 'power1.inOut',
  })
  .to(barFill, {
    width: '100%',
    duration: 0.3,
    ease: 'power2.in',
  })
  .to('.preloader-glitch', {
    scale: 1.1,
    duration: 0.15,
    ease: 'power4.in',
  })
  .to('.preloader-glitch', {
    scale: 0,
    opacity: 0,
    duration: 0.3,
    ease: 'power4.in',
  }, '-=0.05')
  .to('.preloader-bar, .preloader-text', {
    opacity: 0,
    y: -10,
    duration: 0.2,
    ease: 'power2.in',
  }, '-=0.2');
}
