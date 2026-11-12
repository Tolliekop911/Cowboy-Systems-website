/* ============================================================
   COWBOY SYSTEMS — THANKSGIVING MODE  (seasonal; delete this file
   + the <script src="/js/thanksgiving.js"> tags to remove)
   A handful of slow, low-opacity autumn leaves drifting down.
   No sound, no interaction, honours prefers-reduced-motion.
   ============================================================ */
(function () {
  "use strict";
  try {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.innerWidth < 640) return; // keep phones clean + fast

    var COLORS = ["#C4A574", "#B5703A", "#9C6B2E", "#8C4A2B", "#D7A94B"];
    // simple maple-ish leaf
    var LEAF = '<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true">' +
      '<path fill="CLR" d="M16 2c1.2 3.1 2 4.6 4.3 6.1-1 .2-1.7.4-2.3.9 1.9 1.2 3.4 2.2 5.6 2.6-.8.6-1.4 1-1.8 1.7 2 .9 3.6 1.3 5.9 1.2-1.2 1.1-2 1.9-2.4 3 .9.1 1.7.1 2.7-.2-1.6 2.1-3.8 3.2-6.9 3.4-1.8.1-2.7.6-3.1 2.1-.3 1.2-.4 2.4-.5 4.2-.1-1.8-.2-3-.5-4.2-.4-1.5-1.3-2-3.1-2.1-3.1-.2-5.3-1.3-6.9-3.4 1 .3 1.8.3 2.7.2-.4-1.1-1.2-1.9-2.4-3 2.3.1 3.9-.3 5.9-1.2-.4-.7-1-1.1-1.8-1.7 2.2-.4 3.7-1.4 5.6-2.6-.6-.5-1.3-.7-2.3-.9C14 6.6 14.8 5.1 16 2z"/>' +
      '</svg>';

    function start() {
      var body = document.body; if (!body) return;
      var st = document.createElement("style");
      st.textContent =
        ".tg-leaf{position:fixed;top:-48px;pointer-events:none;z-index:60;will-change:transform;opacity:0}" +
        "@media print{.tg-leaf{display:none}}";
      document.head.appendChild(st);

      var VW = window.innerWidth, VH = window.innerHeight, flock = [], N = 9;
      for (var i = 0; i < N; i++) {
        var el = document.createElement("div");
        el.className = "tg-leaf";
        var sz = 16 + Math.random() * 20;
        el.style.width = el.style.height = sz + "px";
        el.innerHTML = LEAF.replace("CLR", COLORS[(Math.random() * COLORS.length) | 0]);
        var leaf = {
          el: el,
          x: Math.random() * VW,
          y: -Math.random() * VH,
          vy: 0.35 + Math.random() * 0.55,        // slow fall
          sway: 18 + Math.random() * 34,           // px sway amplitude
          ph: Math.random() * 6.28,
          sp: 0.006 + Math.random() * 0.01,        // sway speed
          rot: Math.random() * 360,
          vr: (Math.random() - 0.5) * 0.5,
          op: 0.38 + Math.random() * 0.30
        };
        el.style.opacity = leaf.op;
        flock.push(leaf); body.appendChild(el);
      }

      window.addEventListener("resize", function () { VW = window.innerWidth; VH = window.innerHeight; }, { passive: true });

      (function fall() {
        for (var j = 0; j < flock.length; j++) {
          var b = flock[j];
          b.ph += b.sp; b.y += b.vy; b.rot += b.vr;
          var x = b.x + Math.sin(b.ph) * b.sway;
          if (b.y > VH + 60) { b.y = -40 - Math.random() * 120; b.x = Math.random() * VW; }
          b.el.style.transform = "translate(" + x + "px," + b.y + "px) rotate(" + b.rot + "deg)";
        }
        requestAnimationFrame(fall);
      })();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  } catch (e) { /* seasonal flourish only — never break the page */ }
})();
