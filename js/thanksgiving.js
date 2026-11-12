/* ============================================================
   COWBOY SYSTEMS — THANKSGIVING MODE  (seasonal; delete this file
   + the <script src="/js/thanksgiving.js"> tags to remove)
   Falling autumn leaves + a Happy Thanksgiving greeting bar.
   ============================================================ */
(function () {
  "use strict";
  try {
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var COLORS = ["#C4A574", "#B5703A", "#9C6B2E", "#B23A1E", "#D7A94B", "#8C4A2B"];
    var LEAF = '<svg viewBox="0 0 32 32" width="100%" height="100%" aria-hidden="true">' +
      '<path fill="CLR" d="M16 2c1.2 3.1 2 4.6 4.3 6.1-1 .2-1.7.4-2.3.9 1.9 1.2 3.4 2.2 5.6 2.6-.8.6-1.4 1-1.8 1.7 2 .9 3.6 1.3 5.9 1.2-1.2 1.1-2 1.9-2.4 3 .9.1 1.7.1 2.7-.2-1.6 2.1-3.8 3.2-6.9 3.4-1.8.1-2.7.6-3.1 2.1-.3 1.2-.4 2.4-.5 4.2-.1-1.8-.2-3-.5-4.2-.4-1.5-1.3-2-3.1-2.1-3.1-.2-5.3-1.3-6.9-3.4 1 .3 1.8.3 2.7.2-.4-1.1-1.2-1.9-2.4-3 2.3.1 3.9-.3 5.9-1.2-.4-.7-1-1.1-1.8-1.7 2.2-.4 3.7-1.4 5.6-2.6-.6-.5-1.3-.7-2.3-.9C14 6.6 14.8 5.1 16 2z"/></svg>';

    function start() {
      var body = document.body; if (!body) return;

      /* ---- styles ---- */
      var st = document.createElement("style");
      st.textContent =
        ".tg-leaf{position:fixed;top:-56px;pointer-events:none;z-index:70;will-change:transform;filter:drop-shadow(0 2px 3px rgba(60,30,10,.18))}" +
        ".tg-greet{position:fixed;left:50%;bottom:22px;transform:translateX(-50%) translateY(0);z-index:90;display:flex;align-items:center;gap:12px;" +
        "padding:12px 16px 12px 20px;border-radius:100px;color:#fff;font-family:'Satoshi',system-ui,sans-serif;font-weight:600;font-size:14.5px;letter-spacing:.2px;" +
        "background:linear-gradient(100deg,#8C4A2B,#B5703A 55%,#C4A574);box-shadow:0 14px 34px -12px rgba(76,38,16,.6),inset 0 1px 0 rgba(255,255,255,.18);" +
        "opacity:0;transition:opacity .5s,transform .5s;max-width:calc(100vw - 32px)}" +
        ".tg-greet.in{opacity:1}" +
        ".tg-greet b{font-weight:700}" +
        ".tg-greet .x{cursor:pointer;margin-left:4px;width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
        "background:rgba(255,255,255,.18);color:#fff;font-size:15px;line-height:1;flex:none}" +
        ".tg-greet .x:hover{background:rgba(255,255,255,.32)}" +
        "@media(max-width:600px){.tg-greet{font-size:13px;bottom:14px;padding:10px 12px 10px 16px}}" +
        "@media print{.tg-leaf,.tg-greet{display:none}}";
      document.head.appendChild(st);

      /* ---- greeting bar (dismissible, remembers) ---- */
      var dismissed = false;
      try { dismissed = localStorage.getItem("tg_greet_closed") === "1"; } catch (e) {}
      if (!dismissed) {
        var g = document.createElement("div");
        g.className = "tg-greet";
        g.innerHTML = '<span aria-hidden="true" style="font-size:17px">🍂</span>' +
          '<span><b>Happy Thanksgiving</b> from all of us at Cowboy Systems</span>' +
          '<span class="x" role="button" aria-label="Dismiss">&times;</span>';
        body.appendChild(g);
        setTimeout(function () { g.classList.add("in"); }, 700);
        g.querySelector(".x").addEventListener("click", function () {
          g.classList.remove("in");
          try { localStorage.setItem("tg_greet_closed", "1"); } catch (e) {}
          setTimeout(function () { g.remove(); }, 500);
        });
      }

      /* ---- leaves ---- */
      var VW = window.innerWidth, VH = window.innerHeight;
      var N = VW < 600 ? 9 : 18;
      var flock = [];
      for (var i = 0; i < N; i++) {
        var el = document.createElement("div");
        el.className = "tg-leaf";
        var sz = 22 + Math.random() * 26;
        el.style.width = el.style.height = sz + "px";
        el.style.opacity = (0.72 + Math.random() * 0.26).toFixed(2);
        el.innerHTML = LEAF.replace("CLR", COLORS[(Math.random() * COLORS.length) | 0]);
        var b = {
          el: el,
          x: Math.random() * VW,
          y: reduce ? Math.random() * VH : -Math.random() * VH,
          vy: 0.5 + Math.random() * 0.8,
          sway: 24 + Math.random() * 40,
          ph: Math.random() * 6.28,
          sp: 0.007 + Math.random() * 0.012,
          rot: Math.random() * 360,
          vr: (Math.random() - 0.5) * 0.8
        };
        flock.push(b); body.appendChild(el);
      }

      function place(b) {
        var x = b.x + Math.sin(b.ph) * b.sway;
        b.el.style.transform = "translate(" + x + "px," + b.y + "px) rotate(" + b.rot + "deg)";
      }

      if (reduce) {
        // Reduce Motion on: show the leaves scattered, no animation.
        for (var k = 0; k < flock.length; k++) place(flock[k]);
        return;
      }

      window.addEventListener("resize", function () { VW = window.innerWidth; VH = window.innerHeight; }, { passive: true });
      (function fall() {
        for (var j = 0; j < flock.length; j++) {
          var b = flock[j];
          b.ph += b.sp; b.y += b.vy; b.rot += b.vr;
          if (b.y > VH + 70) { b.y = -50 - Math.random() * 140; b.x = Math.random() * VW; }
          place(b);
        }
        requestAnimationFrame(fall);
      })();
    }

    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  } catch (e) { /* seasonal flourish only — never break the page */ }
})();
