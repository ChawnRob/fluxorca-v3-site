/* ═══════════════════════════════════════════════
   FLUXORCA V3 — Tabs (section Exploration)
═══════════════════════════════════════════════ */

(function () {
  const tabsContainers = document.querySelectorAll('[data-tabs]');

  tabsContainers.forEach(container => {
    const buttons = container.querySelectorAll('.tab-btn');
    const panels  = container.querySelectorAll('.tab-panel');

    function activate(index) {
      buttons.forEach((btn, i) => {
        btn.classList.toggle('active', i === index);
        btn.setAttribute('aria-selected', i === index);
      });
      panels.forEach((panel, i) => {
        panel.classList.toggle('active', i === index);
      });
    }

    buttons.forEach((btn, i) => {
      btn.addEventListener('click', () => activate(i));

      // Keyboard navigation
      btn.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') {
          activate((i + 1) % buttons.length);
          buttons[(i + 1) % buttons.length].focus();
        }
        if (e.key === 'ArrowLeft') {
          activate((i - 1 + buttons.length) % buttons.length);
          buttons[(i - 1 + buttons.length) % buttons.length].focus();
        }
      });
    });

    // Init
    activate(0);
  });
})();
