/* ============================================================
   COWBOY SYSTEMS — HALLOWEEN MODE  (seasonal; delete this file
   + the <script src="/js/halloween.js"> tags to remove)
   Bat cursor · cobwebs · drifting bats · dropping spider · jumpscares
   ============================================================ */
(function () {
  "use strict";
  if (window.__hwOn) return; window.__hwOn = true;
  try { if (localStorage.getItem("hw-off") === "1") return; } catch (e) {}

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = matchMedia("(hover:hover) and (pointer:fine)").matches;

  var BAT =
    '<svg viewBox="0 0 48 30" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="#17121d">' +
    '<path d="M24 7c-1.6 0-2.8 1.3-2.8 3v9c0 1.1 1.2 2 2.8 2s2.8-.9 2.8-2v-9c0-1.7-1.2-3-2.8-3z"/>' +
    '<path d="M22.6 7.2 20.8 2l2.9 3.9zM25.4 7.2 27.2 2l-2.9 3.9z"/>' +
    '<g class="hw-wings">' +
    '<path d="M21.5 11C15 4 7 5 3 12c3.4-1.3 5 1.4 3.8 4.6C10 13 13 15 15.5 15.6 18 16 20 15 21.5 13.6z"/>' +
    '<path d="M26.5 11C33 4 41 5 45 12c-3.4-1.3-5 1.4-3.8 4.6C38 13 35 15 32.5 15.6 30 16 28 15 26.5 13.6z"/>' +
    '</g></g></svg>';

  var GHOST =
    '<svg viewBox="0 0 200 230" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M100 8C55 8 28 44 28 92v118c0 8 9 12 15 6l14-14 16 16c4 4 10 4 14 0l13-14 13 14c4 4 10 4 14 0l16-16 14 14c6 6 15 2 15-6V92C172 44 145 8 100 8z" fill="#f5f3ef"/>' +
    '<ellipse cx="72" cy="92" rx="16" ry="22" fill="#0b0b10"/>' +
    '<ellipse cx="128" cy="92" rx="16" ry="22" fill="#0b0b10"/>' +
    '<ellipse cx="72" cy="86" rx="5" ry="7" fill="#c4161c"/>' +
    '<ellipse cx="128" cy="86" rx="5" ry="7" fill="#c4161c"/>' +
    '<path d="M74 150c10 16 42 16 52 0-8 24-44 24-52 0z" fill="#0b0b10"/>' +
    '</svg>';

  var WEB =
    '<svg viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">' +
    '<g fill="none" stroke="rgba(14,26,43,.5)" stroke-width="1.2">' +
    '<path d="M0 0 L160 0 M0 0 L0 160 M0 0 L120 120 M0 0 L150 60 M0 0 L60 150"/>' +
    '<path d="M28 0 Q24 24 0 28 M56 0 Q50 50 0 56 M88 0 Q78 78 0 88 M124 0 Q108 108 0 124"/>' +
    '</g></svg>';

  var SPIDER =
    '<svg viewBox="0 0 40 34" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#120f16" stroke-width="2.4" stroke-linecap="round">' +
    '<g><path d="M20 17 L6 8 M20 17 L4 15 M20 17 L5 23 M20 17 L8 29"/>' +
    '<path d="M20 17 L34 8 M20 17 L36 15 M20 17 L35 23 M20 17 L32 29"/></g>' +
    '<ellipse cx="20" cy="18" rx="7" ry="8" fill="#120f16" stroke="none"/>' +
    '<circle cx="20" cy="10" r="4" fill="#120f16" stroke="none"/>' +
    '<circle cx="18" cy="9.5" r="1" fill="#c4161c" stroke="none"/><circle cx="22" cy="9.5" r="1" fill="#c4161c" stroke="none"/></svg>';

  var css =
    (finePointer ? "html.hw,html.hw *{cursor:none!important}.cur-dot,.cur-ring{display:none!important}" : "") +
    ".hw-cur{position:fixed;top:0;left:0;width:40px;height:26px;margin:-13px 0 0 -20px;z-index:100000;pointer-events:none;will-change:transform}" +
    ".hw-cur svg,.hw-fly svg{width:100%;height:100%;display:block}" +
    ".hw-wings{transform-origin:24px 13px;animation:hw-flap .3s ease-in-out infinite alternate}" +
    "@keyframes hw-flap{from{transform:scaleY(1)}to{transform:scaleY(.42)}}" +
    ".hw-web{position:fixed;width:150px;height:150px;z-index:9996;pointer-events:none;opacity:.6}" +
    ".hw-web.tl{top:0;left:0}.hw-web.tr{top:0;right:0;transform:scaleX(-1)}" +
    ".hw-fly{position:fixed;top:0;left:0;width:46px;height:30px;z-index:9995;pointer-events:none;opacity:.8;will-change:transform}" +
    "@keyframes hw-cross{from{transform:translateX(-80px)}to{transform:translateX(calc(100vw + 80px))}}" +
    ".hw-spider{position:fixed;top:0;z-index:9997;pointer-events:none;display:flex;flex-direction:column;align-items:center;transform:translateY(-320px);transition:transform 2.4s cubic-bezier(.5,0,.5,1)}" +
    ".hw-spider .thr{width:1px;height:300px;background:linear-gradient(rgba(14,26,43,.0),rgba(14,26,43,.45))}" +
    ".hw-spider .bug{width:38px;height:32px}" +
    ".hw-scare{position:fixed;inset:0;z-index:100002;pointer-events:none;display:grid;place-items:center;background:rgba(0,0,0,0);opacity:0}" +
    ".hw-scare.go{animation:hw-scare 1.15s ease forwards}" +
    ".hw-scare svg{width:min(70vw,520px);height:auto;filter:drop-shadow(0 0 40px rgba(196,22,28,.6))}" +
    "@keyframes hw-scare{0%{opacity:0;background:rgba(0,0,0,0)}6%{opacity:1;background:rgba(0,0,0,.82);transform:scale(1.15)}10%{transform:scale(1)}72%{opacity:1;background:rgba(0,0,0,.82)}100%{opacity:0;background:rgba(0,0,0,0)}}" +
    ".hw-scare .ghost{animation:hw-shake .09s linear infinite}" +
    "@keyframes hw-shake{0%{transform:translate(0,0)}25%{transform:translate(-6px,4px)}50%{transform:translate(5px,-5px)}75%{transform:translate(-4px,-3px)}100%{transform:translate(4px,4px)}}" +
    ".hw-swoop{position:fixed;top:30%;left:-120px;width:130px;height:84px;z-index:100001;pointer-events:none}" +
    ".hw-swoop.go{animation:hw-swoop 1s cubic-bezier(.4,0,.6,1) forwards}" +
    "@keyframes hw-swoop{0%{left:-140px;top:12%;transform:scale(.6) rotate(-8deg)}100%{left:100vw;top:62%;transform:scale(2.2) rotate(10deg)}}" +
    "@media(prefers-reduced-motion:reduce){.hw-wings,.hw-fly{animation:none}.hw-spider{transition:none}}";

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function run() {
    var html = document.documentElement, body = document.body;
    html.classList.add("hw");

    // corner cobwebs
    ["tl", "tr"].forEach(function (p) {
      var w = document.createElement("div"); w.className = "hw-web " + p; w.innerHTML = WEB; body.appendChild(w);
    });

    // bat cursor (desktop only)
    if (finePointer) {
      var cur = document.createElement("div"); cur.className = "hw-cur"; cur.innerHTML = BAT;
      cur.style.opacity = "0"; body.appendChild(cur);
      var mx = innerWidth / 2, my = innerHeight / 2;
      addEventListener("mousemove", function (e) {
        mx = e.clientX; my = e.clientY; cur.style.opacity = "1";
        cur.style.transform = "translate(" + mx + "px," + my + "px)";
      }, { passive: true });
      addEventListener("mouseout", function (e) { if (!e.relatedTarget) cur.style.opacity = "0"; });
    }

    if (reduce) return; // keep it calm: no motion/scares for reduced-motion

    // drifting bats — each on its own flight path (drift + wobble + turns)
    var VW = innerWidth, VH = innerHeight;
    addEventListener("resize", function () { VW = innerWidth; VH = innerHeight; });
    var flock = [];
    for (var i = 0; i < 6; i++) {
      var f = document.createElement("div"); f.className = "hw-fly"; f.innerHTML = BAT;
      var b = { el: f,
        x: Math.random() * VW, y: 50 + Math.random() * (VH * 0.55),
        sp: 0.4 + Math.random() * 1.0, dir: Math.random() < 0.5 ? -1 : 1,
        ph: Math.random() * 6.28, vy: (Math.random() - 0.5) * 0.3,
        sc: 0.55 + Math.random() * 0.75 };
      f.querySelector(".hw-wings").style.animationDuration = (0.2 + Math.random() * 0.18) + "s";
      flock.push(b); body.appendChild(f);
    }
    (function fly() {
      for (var k = 0; k < flock.length; k++) {
        var b = flock[k];
        b.ph += 0.035;
        b.x += b.sp * b.dir;
        b.y += b.vy + Math.sin(b.ph) * 0.7;                 // gentle up/down wobble
        if (Math.random() < 0.005) b.vy = (Math.random() - 0.5) * 0.5; // occasional turn
        if (b.y < 36) { b.y = 36; b.vy = Math.abs(b.vy); }
        if (b.y > VH * 0.82) { b.y = VH * 0.82; b.vy = -Math.abs(b.vy); }
        if (b.dir > 0 && b.x > VW + 70) { b.x = -70; b.y = 40 + Math.random() * (VH * 0.55); }
        if (b.dir < 0 && b.x < -70) { b.x = VW + 70; b.y = 40 + Math.random() * (VH * 0.55); }
        var tilt = Math.sin(b.ph) * 12;
        b.el.style.transform = "translate(" + b.x.toFixed(1) + "px," + b.y.toFixed(1) + "px) scale(" + (b.dir * b.sc) + "," + b.sc + ") rotate(" + tilt + "deg)";
      }
      requestAnimationFrame(fly);
    })();

    // dropping spider (periodic)
    var sp = document.createElement("div"); sp.className = "hw-spider";
    sp.style.left = (12 + Math.random() * 70) + "%";
    sp.innerHTML = '<div class="thr"></div><div class="bug">' + SPIDER + '</div>';
    body.appendChild(sp);
    function dropSpider() {
      sp.style.left = (10 + Math.random() * 76) + "%";
      sp.style.transform = "translateY(" + (120 + Math.random() * 160) + "px)";
      setTimeout(function () { sp.style.transform = "translateY(-320px)"; }, 3400);
    }
    setTimeout(dropSpider, 6000);
    setInterval(dropSpider, 17000);

    // ---- audio screech (unlocked after first gesture) ----
    var AC = window.AudioContext || window.webkitAudioContext, actx = null, unlocked = false;
    function unlock() { if (!unlocked && AC) { actx = new AC(); unlocked = true; } }
    addEventListener("pointerdown", unlock, { once: true });
    addEventListener("keydown", unlock, { once: true });
    function screech() {
      if (!actx) return;
      try {
        var t = actx.currentTime, o = actx.createOscillator(), g = actx.createGain();
        o.type = "sawtooth"; o.frequency.setValueAtTime(880, t);
        o.frequency.exponentialRampToValueAtTime(120, t + 0.5);
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.16, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + 0.56);
      } catch (e) {}
    }

    // ---- JUMPSCARES ----
    var scare = document.createElement("div"); scare.className = "hw-scare";
    scare.innerHTML = '<div class="ghost">' + GHOST + '</div>'; body.appendChild(scare);
    function jumpscare() {
      scare.classList.remove("go"); void scare.offsetWidth; scare.classList.add("go"); screech();
    }
    function swoop() {
      var b = document.createElement("div"); b.className = "hw-swoop"; b.innerHTML = BAT; body.appendChild(b);
      void b.offsetWidth; b.classList.add("go"); screech();
      setTimeout(function () { b.remove(); }, 1100);
    }
    // first scare shortly after arrival, then random bats + the odd full scare
    setTimeout(swoop, 7000);
    setTimeout(jumpscare, 14000);
    setInterval(function () { (Math.random() < 0.4 ? jumpscare : swoop)(); }, 22000 + Math.random() * 12000);
  }

  if (document.readyState === "loading") addEventListener("DOMContentLoaded", run);
  else run();
})();
