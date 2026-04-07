/* ═══════════════════════════════════════════════
   FLUXORCA V3 — Main
   Scroll reveal + utilitaires
═══════════════════════════════════════════════ */

(function () {

  // ── Scroll reveal ──
  const reveals = document.querySelectorAll('[data-reveal]');

  if (reveals.length && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    reveals.forEach(el => observer.observe(el));
  } else {
    // Fallback sans IntersectionObserver
    reveals.forEach(el => el.classList.add('visible'));
  }

  // ── Smooth scroll pour les ancres ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = document.getElementById('nav-wrapper')?.offsetHeight || 80;
        const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
