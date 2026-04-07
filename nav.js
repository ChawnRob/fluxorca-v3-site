/* ═══════════════════════════════════════════════
   FLUXORCA V3 — Nav
   Effet glassmorphism au scroll + menu mobile
═══════════════════════════════════════════════ */

(function () {
  const wrapper = document.getElementById('nav-wrapper');
  const burger  = document.getElementById('nav-burger');
  const mobile  = document.getElementById('nav-mobile');
  const mobileLinks = mobile ? mobile.querySelectorAll('a') : [];

  // ── Scroll effect ──
  if (wrapper) {
    const onScroll = () => {
      wrapper.classList.toggle('scrolled', window.scrollY > 40);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Menu mobile ──
  let menuOpen = false;

  function toggleMenu(force) {
    menuOpen = typeof force !== 'undefined' ? force : !menuOpen;
    if (!mobile || !burger) return;

    mobile.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    // Burger animation
    const spans = burger.querySelectorAll('span');
    if (menuOpen) {
      spans[0].style.transform = 'rotate(45deg) translate(4.5px, 4.5px)';
      spans[1].style.opacity   = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(4.5px, -4.5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  }

  if (burger) {
    burger.addEventListener('click', () => toggleMenu());
  }

  // Fermer au clic sur un lien
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Fermer avec Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) toggleMenu(false);
  });
})();
