/**
 * Fluxorca — Clockwork Background
 * ─────────────────────────────────────────────
 * Animation de fond inspirée d'un mécanisme
 * d'horlogerie de luxe. Pur SVG + CSS.
 * Aucune dépendance · ~3 KB · 60 fps garanti
 *
 * Fix technique : chaque groupe contient un rect
 * transparent 1000×1000 pour que fill-box soit
 * toujours centré en (500,500) → pivot correct.
 * ─────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Guard : skip si mouvement réduit ────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Constantes ──────────────────────────────── */
  const NS  = 'http://www.w3.org/2000/svg';
  const CX  = 500;
  const CY  = 500;
  const HUE = '#4f8ef7'; // --color-accent Fluxorca

  /* ── Créer un élément SVG ────────────────────── */
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

  /**
   * Rect transparent 1000×1000 inséré dans chaque groupe.
   * Cela force le fill-box du groupe à couvrir tout le
   * viewBox → transform-origin: center pointe toujours
   * sur (500,500) quelle que soit la taille du viewport.
   */
  function anchor() {
    return el('rect', {
      x: 0, y: 0, width: 1000, height: 1000,
      fill: 'none', 'pointer-events': 'none',
    });
  }

  /* ── Point sur cercle (0° = sommet) ─────────── */
  function pt(r, deg) {
    const rad = (deg - 90) * (Math.PI / 180);
    return [CX + r * Math.cos(rad), CY + r * Math.sin(rad)];
  }

  /* ── Cercle SVG helper ───────────────────────── */
  function ring(r, extra) {
    return el('circle', { cx: CX, cy: CY, r, fill: 'none', stroke: HUE, ...extra });
  }

  /* ── Graduations horlogères ──────────────────── */
  function tickMarks(r, total, majorEvery) {
    const g = el('g');
    for (let i = 0; i < total; i++) {
      const deg   = (i / total) * 360;
      const major = i % majorEvery === 0;
      const len   = major ? 14 : 5;
      const [x1, y1] = pt(r - len, deg);
      const [x2, y2] = pt(r,       deg);
      g.appendChild(el('line', {
        x1, y1, x2, y2,
        stroke: HUE,
        'stroke-width':  major ? 1.2 : 0.5,
        opacity:         major ? 0.25 : 0.10,
        'stroke-linecap': 'round',
      }));
    }
    return g;
  }

  /* ── Nœud orbital (dot + halo) ──────────────── */
  function orbitalDot(r, size, deg) {
    const [x, y] = pt(r, deg);
    return el('g', {}, [
      el('circle', { cx: x, cy: y, r: size * 3.5, fill: HUE, opacity: 0.07 }),
      el('circle', { cx: x, cy: y, r: size * 1.5, fill: HUE, opacity: 0.18 }),
      el('circle', { cx: x, cy: y, r: size,        fill: HUE, opacity: 0.55 }),
    ]);
  }

  /* ── Construction ────────────────────────────── */
  function build() {
    const mount = document.querySelector('.hero__bg');
    if (!mount) return;

    /* ─ Defs : masque de fondu radial ─ */
    const defs = el('defs', {}, [
      el('radialGradient', { id: 'cw-fade', cx: '50%', cy: '50%', r: '52%' }, [
        el('stop', { offset: '0%',   'stop-color': 'white', 'stop-opacity': '1'   }),
        el('stop', { offset: '55%',  'stop-color': 'white', 'stop-opacity': '0.8' }),
        el('stop', { offset: '100%', 'stop-color': 'white', 'stop-opacity': '0'   }),
      ]),
      el('mask', { id: 'cw-mask' }, [
        el('rect', { x: 0, y: 0, width: 1000, height: 1000, fill: 'url(#cw-fade)' }),
      ]),
    ]);

    /* ─ Anneaux (extérieur → centre) ─ */

    // R1 — Bordure extérieure, pointillé très fin
    const r1 = el('g', { class: 'cw-r1' }, [
      anchor(),
      ring(478, { 'stroke-width': 0.6, 'stroke-dasharray': '2 20', opacity: 0.08 }),
    ]);

    // R2 — Lunette segmentée style bezel
    const r2 = el('g', { class: 'cw-r2' }, [
      anchor(),
      ring(418, { 'stroke-width': 0.8, 'stroke-dasharray': '8 26', opacity: 0.10 }),
    ]);

    // R3 — Couronne 60 secondes + graduations
    const r3 = el('g', { class: 'cw-r3' }, [
      anchor(),
      ring(350, { 'stroke-width': 0.6, opacity: 0.10 }),
      tickMarks(350, 60, 5),
    ]);

    // R4 — Anneau intermédiaire, tirets
    const r4 = el('g', { class: 'cw-r4' }, [
      anchor(),
      ring(282, { 'stroke-width': 1.0, 'stroke-dasharray': '4 15', opacity: 0.11 }),
    ]);

    // R5 — Anneau medium, continu
    const r5 = el('g', { class: 'cw-r5' }, [
      anchor(),
      ring(215, { 'stroke-width': 0.7, opacity: 0.13 }),
    ]);

    // R6 — Cadran intérieur + 12 index horaires
    const r6 = el('g', { class: 'cw-r6' }, [
      anchor(),
      ring(155, { 'stroke-width': 0.9, 'stroke-dasharray': '5 9', opacity: 0.14 }),
      tickMarks(155, 12, 1),
    ]);

    // R7 — Anneau de cœur
    const r7 = el('g', { class: 'cw-r7' }, [
      anchor(),
      ring(82, { 'stroke-width': 0.9, opacity: 0.17 }),
    ]);

    // Centre — Viseur de précision
    const center = el('g', { class: 'cw-center' }, [
      anchor(),
      ring(20, { 'stroke-width': 0.9, opacity: 0.20 }),
      el('circle', { cx: CX, cy: CY, r: 3.5, fill: HUE, opacity: 0.35 }),
      el('line', {
        x1: CX - 24, y1: CY, x2: CX + 24, y2: CY,
        stroke: HUE, 'stroke-width': 0.5, opacity: 0.15,
      }),
      el('line', {
        x1: CX, y1: CY - 24, x2: CX, y2: CY + 24,
        stroke: HUE, 'stroke-width': 0.5, opacity: 0.15,
      }),
    ]);

    /* ─ Nœuds orbitaux ─ */
    const o1 = el('g', { class: 'cw-o1' }, [anchor(), orbitalDot(418, 2.5,   0)]);
    const o2 = el('g', { class: 'cw-o2' }, [anchor(), orbitalDot(350, 3.0, 142)]);
    const o3 = el('g', { class: 'cw-o3' }, [anchor(), orbitalDot(282, 2.0, 253)]);
    const o4 = el('g', { class: 'cw-o4' }, [anchor(), orbitalDot(215, 2.0,  68)]);

    /* ─ Assemblage ─ */
    const layers = el('g', { mask: 'url(#cw-mask)' });
    [r1, r2, r3, r4, r5, r6, r7, center, o1, o2, o3, o4]
      .forEach(g => layers.appendChild(g));

    const svg = el('svg', {
      class:               'clockwork-bg',
      'aria-hidden':       'true',
      viewBox:             '0 0 1000 1000',
      preserveAspectRatio: 'xMidYMid slice',
    }, [defs, layers]);

    mount.appendChild(svg);
  }

  /* ── Init ────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }

}());
