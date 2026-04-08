/**
 * Fluxorca — Clockwork Background
 * ─────────────────────────────────────────────
 * Animation de fond inspirée d'un mécanisme
 * d'horlogerie de luxe. Pur SVG + CSS.
 * Aucune dépendance · ~2 KB · 60 fps garanti
 * ─────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Guard : skip si mouvement réduit demandé ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Constantes ─────────────────────────────── */
  const NS  = 'http://www.w3.org/2000/svg';
  const CX  = 500;   // centre X du viewBox 1000×1000
  const CY  = 500;   // centre Y
  const HUE = '#4f8ef7'; // --color-accent Fluxorca

  /* ── Utilitaire : créer un élément SVG ───────── */
  function el(tag, attrs, children) {
    const e = document.createElementNS(NS, tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        e.setAttribute(k, String(v));
      }
    }
    if (children) children.forEach(c => e.appendChild(c));
    return e;
  }

  /* ── Point sur un cercle (0° = sommet) ────────── */
  function pt(r, deg) {
    const rad = (deg - 90) * (Math.PI / 180);
    return [
      CX + r * Math.cos(rad),
      CY + r * Math.sin(rad),
    ];
  }

  /* ── Cercle SVG ──────────────────────────────── */
  function circle(r, extra) {
    return el('circle', { cx: CX, cy: CY, r, fill: 'none', stroke: HUE, ...extra });
  }

  /* ── Traits-index (graduations horlogères) ────── */
  function tickMarks(r, total, majorEvery) {
    const g = el('g');
    for (let i = 0; i < total; i++) {
      const deg    = (i / total) * 360;
      const major  = (i % majorEvery === 0);
      const len    = major ? 14 : 5;
      const sw     = major ? 1.2 : 0.5;
      const op     = major ? 0.18 : 0.08;
      const [x1, y1] = pt(r - len, deg);
      const [x2, y2] = pt(r,       deg);
      g.appendChild(el('line', {
        x1, y1, x2, y2,
        stroke: HUE, 'stroke-width': sw,
        opacity: op, 'stroke-linecap': 'round',
      }));
    }
    return g;
  }

  /* ── Nœud orbital (point + halo) ─────────────── */
  function orbitalDot(r, size, deg) {
    const [x, y] = pt(r, deg);
    return el('g', {}, [
      el('circle', { cx: x, cy: y, r: size * 3.5, fill: HUE, opacity: 0.06 }),
      el('circle', { cx: x, cy: y, r: size * 1.5, fill: HUE, opacity: 0.15 }),
      el('circle', { cx: x, cy: y, r: size,        fill: HUE, opacity: 0.45 }),
    ]);
  }

  /* ── Construction principale ─────────────────── */
  function build() {
    const mount = document.querySelector('.hero__bg');
    if (!mount) return;

    /* ── Définitions SVG (masque + filtre glow) ── */
    const defs = el('defs', {}, [

      // Gradient radial pour fondu vers les bords
      el('radialGradient', { id: 'cw-fade', cx: '50%', cy: '50%', r: '55%' }, [
        el('stop', { offset: '0%',   'stop-color': 'white', 'stop-opacity': '1'   }),
        el('stop', { offset: '55%',  'stop-color': 'white', 'stop-opacity': '0.7' }),
        el('stop', { offset: '100%', 'stop-color': 'white', 'stop-opacity': '0'   }),
      ]),

      // Masque d'opacité
      el('mask', { id: 'cw-mask' }, [
        el('rect', { x: 0, y: 0, width: 1000, height: 1000, fill: 'url(#cw-fade)' }),
      ]),
    ]);

    /* ── Anneaux (de l'extérieur vers le centre) ── */

    // R1 — Anneau extérieur discret, pointillé fin
    const r1 = el('g', { class: 'cw-r1' }, [
      circle(478, { 'stroke-width': 0.5, 'stroke-dasharray': '2 20', opacity: 0.05 }),
    ]);

    // R2 — Lunette segmentée (type bezel de montre)
    const r2 = el('g', { class: 'cw-r2' }, [
      circle(418, { 'stroke-width': 0.7, 'stroke-dasharray': '7 26', opacity: 0.07 }),
    ]);

    // R3 — Couronne des secondes (60 graduations)
    const r3 = el('g', { class: 'cw-r3' }, [
      circle(350, { 'stroke-width': 0.5, opacity: 0.06 }),
      tickMarks(350, 60, 5),
    ]);

    // R4 — Anneau intermédiaire, tirets moyens
    const r4 = el('g', { class: 'cw-r4' }, [
      circle(282, { 'stroke-width': 1.0, 'stroke-dasharray': '4 15', opacity: 0.07 }),
    ]);

    // R5 — Anneau medium, trait continu subtil
    const r5 = el('g', { class: 'cw-r5' }, [
      circle(215, { 'stroke-width': 0.6, opacity: 0.09 }),
    ]);

    // R6 — Cadran intérieur (12 index horaires)
    const r6 = el('g', { class: 'cw-r6' }, [
      circle(155, { 'stroke-width': 0.8, 'stroke-dasharray': '5 9', opacity: 0.11 }),
      tickMarks(155, 12, 1),
    ]);

    // R7 — Anneau de cœur, le plus lumineux
    const r7 = el('g', { class: 'cw-r7' }, [
      circle(82, { 'stroke-width': 0.8, opacity: 0.14 }),
    ]);

    // Centre — Viseur de précision
    const center = el('g', { class: 'cw-center' }, [
      circle(20, { 'stroke-width': 0.8, opacity: 0.16 }),
      el('circle', { cx: CX, cy: CY, r: 3.5, fill: HUE, opacity: 0.28 }),
      el('line', {
        x1: CX - 22, y1: CY, x2: CX + 22, y2: CY,
        stroke: HUE, 'stroke-width': 0.4, opacity: 0.11,
      }),
      el('line', {
        x1: CX, y1: CY - 22, x2: CX, y2: CY + 22,
        stroke: HUE, 'stroke-width': 0.4, opacity: 0.11,
      }),
    ]);

    /* ── Nœuds orbitaux (chaque groupe tourne indépendamment) ── */
    const o1 = el('g', { class: 'cw-o1' }, [orbitalDot(418, 2.5,   0)]);
    const o2 = el('g', { class: 'cw-o2' }, [orbitalDot(350, 3.0, 142)]);
    const o3 = el('g', { class: 'cw-o3' }, [orbitalDot(282, 2.0, 253)]);
    const o4 = el('g', { class: 'cw-o4' }, [orbitalDot(215, 2.0,  68)]);

    /* ── Assemblage ─────────────────────────────── */
    const layers = el('g', { mask: 'url(#cw-mask)' });
    [r1, r2, r3, r4, r5, r6, r7, center, o1, o2, o3, o4]
      .forEach(g => layers.appendChild(g));

    const svg = el('svg', {
      class:                'clockwork-bg',
      'aria-hidden':        'true',
      viewBox:              '0 0 1000 1000',
      preserveAspectRatio: 'xMidYMid slice',
    }, [defs, layers]);

    mount.appendChild(svg);
  }

  /* ── Initialisation ─────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

}());
