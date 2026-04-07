/* ═══════════════════════════════════════════════
   FLUXORCA V3 — FAQ Accordéon
═══════════════════════════════════════════════ */

(function () {
  const items = document.querySelectorAll('.faq__item');

  items.forEach(item => {
    const question = item.querySelector('.faq__question');
    const answer   = item.querySelector('.faq__answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Ferme tous les autres
      items.forEach(other => {
        if (other !== item) {
          other.classList.remove('open');
          const otherAnswer = other.querySelector('.faq__answer');
          if (otherAnswer) otherAnswer.style.maxHeight = '0px';
          other.querySelector('.faq__question')
               ?.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle courant
      item.classList.toggle('open', !isOpen);
      question.setAttribute('aria-expanded', !isOpen);

      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = '0px';
      }
    });
  });
})();
