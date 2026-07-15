/**
 * Custom Cursor — Interactive trail cursor with hover effects
 */
export function initCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');

  if (!dot || !ring) return;

  // Check if mobile
  if (window.innerWidth <= 600) return;

  let mouseX = 0;
  let mouseY = 0;
  let dotX = 0;
  let dotY = 0;
  let ringX = 0;
  let ringY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Hover detection
  const interactiveElements = 'a, button, .btn-brutal, .brutal-card, .glass-card, .contact-card, .cert-card, .skill-card, .nav-link, .mobile-link, .tag-brutal, .skill-tag';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      document.body.classList.add('cursor-hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      document.body.classList.remove('cursor-hover');
    }
  });

  // Glass card mouse tracking (for radial gradient effect)
  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    });
  });

  // Animation loop
  function updateCursor() {
    // Dot follows mouse precisely
    dotX += (mouseX - dotX) * 0.15;
    dotY += (mouseY - dotY) * 0.15;
    dot.style.left = `${dotX}px`;
    dot.style.top = `${dotY}px`;

    // Ring follows with more lag
    ringX += (mouseX - ringX) * 0.08;
    ringY += (mouseY - ringY) * 0.08;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;

    requestAnimationFrame(updateCursor);
  }

  updateCursor();
}
