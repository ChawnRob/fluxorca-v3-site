/**
 * Fluxorca — Network / Mechanism Background
 * ─────────────────────────────────────────────
 * Fond SVG abstrait premium évoquant un mécanisme
 * de précision intelligent (pas une montre).
 *
 * Pur SVG + animations SMIL natives (animateTransform)
 * → rotations autour de (500, 500) garanties, zéro CSS
 *   transform-box, zéro dépendance, ~5 KB.
 *
 * ──────────── GUIDE D'AJUSTEMENT ────────────
 *   HUE_PRIMARY / HUE_CYAN / HUE_VIOLET → couleurs
 *   CX, CY                              → pivot (ne pas toucher)
 *   ARC_*                               → vitesses rotation (s)
 *   opacity: …                          → intensité visuelle
 *   node(r, deg, size, color)           → nœuds lumineux
 *   segment(r, deg, length)             → segments techniques
 * ────────────────────────────────────────────
 */
(function () {
  'use strict';

  /* ── Guard : respect prefers-reduced-motion ── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* ── Constantes ── */
  const NS = 'http://www.w3.org/2000/svg';
  const CX = 500;
  const CY = 500;
  const HUE_PRIMARY = '#4f8ef7'; // bleu Fluxorca
  const HUE_CYAN    = '#7dd8ff'; // cyan doux (énergie)
  const HUE_VIOLET  = '#8b5cf6'; // violet subtil (profondeur)

  /* ── Vitesses (secondes par révolution) ── */
  const ARC_OUTER   = 240; // arc extérieur — très lent
  const ARC_UPPER   = 180;
  const ARC_MID     = 150;
  const ARC_INNER1  = 100;
  const ARC_INNER2  = 80;
  const ARC_CORE    = 60;
  const SEG_SPEED   = 320;

  /* ── Helpers ── */
  function el(tag, attrs, children) {
    const e = document.createElementNS(NS, tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
    if (children) children.forEach(c => e.appendChild(c));
    return e;
  }

  /**
   * Rotation SMIL autour du centre.
   * dir > 0 → horaire · dir < 0 → anti-horaire
   * Le pivot est explicitement (CX, CY) → fiabilité totale.
   */
  function rotate(dur, dir) {
    return el('animateTransform', {
      attributeName: 'transform',
      type: 'rotate',
      from: (dir > 0 ? '0 '   : '360 ') + CX + ' ' + CY,
      to:   (dir > 0 ? '360 ' : '0 ')   + CX + ' ' + CY,
      dur: dur + 's',
      repeatCount: 'indefinite',
    });
  }

  /**
   * Arc partiel — JAMAIS un cercle complet.
   * Signale un système, pas une horloge.
   */
  function arc(r, startDeg, endDeg, extra) {
    const rad1 = (startDeg - 90) * Math.PI / 180;
    const rad2 = (endDeg   - 90) * Math.PI / 180;
    const x1 = CX + r * Math.cos(rad1);
    const y1 = CY + r * Math.sin(rad1);
    const x2 = CX + r * Math.cos(rad2);
    const y2 = CY + r * Math.sin(rad2);
    const largeArc = (endDeg - startDeg) > 180 ? 1 : 0;
    return el('path', Object.assign({
      d: 'M ' + x1 + ' ' + y1 + ' A ' + r + ' ' + r + ' 0 ' + largeArc + ' 1 ' + x2 + ' ' + y2,
      fill: 'none',
      stroke: HUE_PRIMARY,
      'stroke-linecap': 'round',
    }, extra));
  }

  /** Segment tangentiel court (structure technique abstraite) */
  function segment(r, deg, length, extra) {
    const rad = (deg - 90) * Math.PI / 180;
    const x = CX + r * Math.cos(rad);
    const y = CY + r * Math.sin(rad);
    const tx = -Math.sin(rad);
    const ty =  Math.cos(rad);
    return el('line', Object.assign({
      x1: x - tx * length, y1: y - ty * length,
      x2: x + tx * length, y2: y + ty * length,
      stroke: HUE_CYAN,
      'stroke-width': 0.7,
      'stroke-linecap': 'round',
      opacity: 0.35,
    }, extra));
  }

  /** Nœud lumineux avec halo (suggère la circulation d'énergie) */
  function node(r, deg, size, color) {
    const rad = (deg - 90) * Math.PI / 180;
    const x = CX + r * Math.cos(rad);
    const y = CY + r * Math.sin(rad);
    return el('g', {}, [
      el('circle', { cx: x, cy: y, r: size * 4.5, fill: color, opacity: 0.05 }),
      el('circle', { cx: x, cy: y, r: size * 2.2, fill: color, opacity: 0.18 }),
      el('circle', { cx: x, cy: y, r: size,       fill: color, opacity: 0.85 }),
    ]);
  }

  /* ── Construction ── */
  function build() {
    const mount = document.querySelector('.hero__bg');
    if (!mount) return;

    /* ── defs : halos radiaux + masque de fondu ── */
    const defs = el('defs', {}, [
      el('radialGradient', { id: 'fx-halo-blue', cx: '50%', cy: '50%', r: '60%' }, [
        el('stop', { offset: '0%',   'stop-color': HUE_PRIMARY, 'stop-opacity': '0.18' }),
        el('stop', { offset: '45%',  'stop-color': HUE_PRIMARY, 'stop-opacity': '0.05' }),
        el('stop', { offset: '100%', 'stop-color': HUE_PRIMARY, 'stop-opacity': '0'    }),
      ]),
      el('radialGradient', { id: 'fx-halo-violet', cx: '58%', cy: '42%', r: '45%' }, [
        el('stop', { offset: '0%',   'stop-color': HUE_VIOLET, 'stop-opacity': '0.12' }),
        el('stop', { offset: '100%', 'stop-color': HUE_VIOLET, 'stop-opacity': '0'    }),
      ]),
      el('radialGradient', { id: 'fx-fade', cx: '50%', cy: '50%', r: '58%' }, [
        el('stop', { offset: '0%',   'stop-color': 'white', 'stop-opacity': '1'    }),
        el('stop', { offset: '65%',  'stop-color': 'white', 'stop-opacity': '0.85' }),
        el('stop', { offset: '100%', 'stop-color': 'white', 'stop-opacity': '0'    }),
      ]),
      el('mask', { id: 'fx-mask' }, [
        el('rect', { x: 0, y: 0, width: 1000, height: 1000, fill: 'url(#fx-fade)' }),
      ]),
    ]);

    /* ── Couche 1 : halos de fond (fixes) ── */
    const halos = el('g', {}, [
      el('rect', { x: 0, y: 0, width: 1000, height: 1000, fill: 'url(#fx-halo-blue)' }),
      el('rect', { x: 0, y: 0, width: 1000, height: 1000, fill: 'url(#fx-halo-violet)' }),
    ]);

    /* ── Couche 2 : arcs en rotation (jamais de cercle complet) ── */

    // Arc extérieur — 3 segments espacés, rotation horaire très lente
    const arcOuter = el('g', {}, [
      arc(470,  10,  80, { 'stroke-width': 0.8, opacity: 0.20 }),
      arc(470, 140, 210, { 'stroke-width': 0.8, opacity: 0.20 }),
      arc(470, 260, 330, { 'stroke-width': 0.8, opacity: 0.20 }),
      rotate(ARC_OUTER, +1),
    ]);

    // Arc supérieur — gros segment cyan + petit segment opposé
    const arcUpper = el('g', {}, [
      arc(410,  30, 175, { 'stroke-width': 1.0, stroke: HUE_CYAN, opacity: 0.24 }),
      arc(410, 210, 310, { 'stroke-width': 0.6, stroke: HUE_CYAN, opacity: 0.15 }),
      rotate(ARC_UPPER, -1),
    ]);

    // Arc médian — pointillé fin (270° d'arc)
    const arcMid = el('g', {}, [
      arc(340, 0, 270, { 'stroke-width': 0.6, 'stroke-dasharray': '2 14', opacity: 0.22 }),
      rotate(ARC_MID, +1),
    ]);

    // Arc intérieur 1 — double segment opposé
    const arcInner1 = el('g', {}, [
      arc(270,  10, 145, { 'stroke-width': 0.8, opacity: 0.25 }),
      arc(270, 190, 345, { 'stroke-width': 0.8, opacity: 0.25 }),
      rotate(ARC_INNER1, -1),
    ]);

    // Arc intérieur 2 — violet subtil
    const arcInner2 = el('g', {}, [
      arc(200, 40, 220, { 'stroke-width': 0.9, stroke: HUE_VIOLET, opacity: 0.30 }),
      rotate(ARC_INNER2, +1),
    ]);

    // Arc central — cyan, deux demi-cercles
    const arcCore = el('g', {}, [
      arc(130,   5, 175, { 'stroke-width': 0.7, stroke: HUE_CYAN, opacity: 0.28 }),
      arc(130, 190, 355, { 'stroke-width': 0.7, stroke: HUE_CYAN, opacity: 0.28 }),
      rotate(ARC_CORE, -1),
    ]);

    /* ── Couche 3 : segments tangentiels (grille technique) ── */
    const segments = el('g', {}, [
      segment(470,  45, 18),
      segment(470, 165, 14),
      segment(470, 290, 18),
      segment(410, 100, 12),
      segment(410, 250, 12),
      segment(340, 210, 10),
      segment(270,  20, 10),
      segment(270, 160, 10),
      rotate(SEG_SPEED, +1),
    ]);

    /* ── Couche 4 : nœuds lumineux orbitaux ── */
    const nodesOuter = el('g', {}, [
      node(470,   0, 2.5, HUE_PRIMARY),
      node(470, 120, 2.0, HUE_CYAN),
      node(470, 240, 2.5, HUE_PRIMARY),
      rotate(190, +1),
    ]);

    const nodesMid = el('g', {}, [
      node(340,  55, 2.5, HUE_CYAN),
      node(340, 205, 2.0, HUE_VIOLET),
      rotate(130, -1),
    ]);

    const nodesInner = el('g', {}, [
      node(270,  90, 2.0, HUE_PRIMARY),
      node(270, 270, 2.5, HUE_CYAN),
      rotate(95, +1),
    ]);

    const nodeCore = el('g', {}, [
      node(200, 160, 2.2, HUE_PRIMARY),
      rotate(75, -1),
    ]);

    /* ── Couche 5 : micro-point central statique ── */
    const center = el('g', {}, [
      el('circle', { cx: CX, cy: CY, r: 18, fill: 'none', stroke: HUE_PRIMARY,
                     'stroke-width': 0.5, opacity: 0.25 }),
      el('circle', { cx: CX, cy: CY, r: 3,  fill: HUE_CYAN, opacity: 0.55 }),
    ]);

    /* ── Assemblage ── */
    const mech = el('g', { mask: 'url(#fx-mask)' }, [
      arcOuter, arcUpper, arcMid,
      arcInner1, arcInner2, arcCore,
      segments,
      nodesOuter, nodesMid, nodesInner, nodeCore,
      center,
    ]);

    const svg = el('svg', {
      class: 'fx-bg',
      'aria-hidden': 'true',
      viewBox: '0 0 1000 1000',
      preserveAspectRatio: 'xMidYMid slice',
    }, [defs, halos, mech]);

    mount.appendChild(svg);
  }

  /* ── Init ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
}());
