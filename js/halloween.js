/* ============================================================
   COWBOY SYSTEMS — HALLOWEEN MODE  (seasonal)
   Atmosphere (fog, embers, moon, dusk grade) · detailed bat cursor ·
   lace cobwebs · parallax bats · flickering jack-o'-lanterns ·
   dangling spider · cinematic jumpscare with layered sound design.
   Remove: delete this file + the <script src="/js/halloween.js"> tags.
   ============================================================ */
(function () {
  "use strict";
  if (window.__hwOn) return; window.__hwOn = true;
  try { if (localStorage.getItem("hw-off") === "1") return; } catch (e) {}

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var small = innerWidth < 760;

  /* ---------- art ---------- */
  // detailed flapping bat (cursor + flyers): membrane wings, ears
  function batSVG(eyes) {
    return '<svg viewBox="0 0 120 64" xmlns="http://www.w3.org/2000/svg"><g fill="#15101c">' +
      '<path d="M60 20c-3.2 0-5.6 2.6-5.6 6v16c0 2.4 2.5 4 5.6 4s5.6-1.6 5.6-4V26c0-3.4-2.4-6-5.6-6z"/>' +
      '<path d="M57 20 53.5 10 59 17zM63 20 66.5 10 61 17z"/>' +
      '<g class="hw-wg">' +
      '<path d="M55 26C42 12 26 12 8 6c9 8 3 13 9 18-6-1-2 7 2 9-5 0-1 7 3 8-3 1 2 7 6 6-1 3 6 5 9 2 4 3 9 1 11-2 3 2 7 1 7-3 0 0-3-8-7-10-5-3-2-5-5-6z"/>' +
      '<path d="M65 26C78 12 94 12 112 6c-9 8-3 13-9 18 6-1 2 7-2 9 5 0 1 7-3 8 3 1-2 7-6 6 1 3-6 5-9 2-4 3-9 1-11-2-3 2-7 1-7-3 0 0 3-8 7-10 5-3 2-5 5-6z"/>' +
      '</g></g>' + (eyes ? '<circle cx="56.5" cy="30" r="2.1" fill="#ff2d2d"/><circle cx="63.5" cy="30" r="2.1" fill="#ff2d2d"/>' : '') + '</svg>';
  }
  // menacing spread-wing bat for the jumpscare
  var SCAREBAT =
    '<svg viewBox="0 0 400 230" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<radialGradient id="hwEye" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#fff6a0"/><stop offset="35%" stop-color="#ff3b1e"/><stop offset="100%" stop-color="#5a0000"/></radialGradient></defs>' +
    '<g fill="#0a070e">' +
    '<path d="M200 60c-11 0-20 9-20 22v70c0 10 9 16 20 16s20-6 20-16V82c0-13-9-22-20-22z"/>' +
    '<path d="M190 58 182 24 200 50zM210 58 218 24 200 50z"/>' +
    '<path d="M185 82C150 40 92 38 20 20c34 28 10 46 30 64-22-4-6 24 8 30-18-1-4 25 12 28-12 4 8 24 22 20-4 11 22 18 34 8 14 10 32 4 38-8 10 8 24 4 24-10 0-2-12-30-28-42-20-12-10-18-22-22z"/>' +
    '<path d="M215 82C250 40 308 38 380 20c-34 28-10 46-30 64 22-4 6 24-8 30 18-1 4 25-12 28 12 4-8 24-22 20 4 11-22 18-34 8-14 10-32 4-38-8-10 8-24 4-24-10 0-2 12-30 28-42 20-12 10-18 22-22z"/>' +
    '</g>' +
    '<ellipse cx="190" cy="92" rx="11" ry="14" fill="url(#hwEye)"/><ellipse cx="210" cy="92" rx="11" ry="14" fill="url(#hwEye)"/>' +
    '<path d="M193 128l4 10 4-10 4 10 4-10" fill="none" stroke="#e9e3d6" stroke-width="2"/></svg>';

  var WEB =
    '<svg viewBox="0 0 170 170" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="rgba(230,235,245,.5)" stroke-width="1">' +
    '<path d="M0 0H170M0 0V170M0 0 140 140M0 0 165 70M0 0 70 165M0 0 110 150M0 0 150 110"/>' +
    '<path d="M22 0Q18 18 0 22M46 0Q40 40 0 46M74 0Q64 64 0 74M106 0Q92 92 0 106M142 0Q124 124 0 142"/>' +
    '</g><g fill="rgba(230,235,245,.6)"><circle cx="40" cy="40" r="1.3"/><circle cx="78" cy="52" r="1.3"/><circle cx="52" cy="80" r="1.3"/></g></svg>';

  var SPIDER =
    '<svg viewBox="0 0 48 42" xmlns="http://www.w3.org/2000/svg"><g fill="none" stroke="#0c0910" stroke-width="2.6" stroke-linecap="round">' +
    '<path d="M24 22 9 9M24 22 4 18M24 22 5 28M24 22 10 38"/><path d="M24 22 39 9M24 22 44 18M24 22 43 28M24 22 38 38"/></g>' +
    '<ellipse cx="24" cy="24" rx="8.5" ry="10" fill="#0c0910"/><circle cx="24" cy="13" r="5" fill="#0c0910"/>' +
    '<circle cx="21.5" cy="12" r="1.2" fill="#ff2d2d"/><circle cx="26.5" cy="12" r="1.2" fill="#ff2d2d"/></svg>';

  var PUMPKIN =
    '<svg viewBox="0 0 120 104" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<radialGradient id="hwPk" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="#ff9d2e"/><stop offset="70%" stop-color="#e2660a"/><stop offset="100%" stop-color="#8a3b06"/></radialGradient></defs>' +
    '<path d="M60 20c-4-10-14-12-18-8 4 2 6 6 6 10" fill="#5a3a16"/>' +
    '<g fill="#e06a12"><ellipse cx="60" cy="62" rx="40" ry="38"/><ellipse cx="34" cy="62" rx="22" ry="37"/><ellipse cx="86" cy="62" rx="22" ry="37"/></g>' +
    '<g fill="#f07d1a"><ellipse cx="60" cy="62" rx="26" ry="37"/></g>' +
    '<g class="hw-carve" fill="#2a0f02"><path d="M38 52 54 58 38 64z"/><path d="M82 52 66 58 82 64z"/><path d="M40 76q20 16 40 0q-6 2-10 -4q-10 8-20 0q-4 6-10 4z"/></g></svg>';

  var MOON =
    '<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><defs>' +
    '<radialGradient id="hwMoon" cx="42%" cy="40%" r="62%"><stop offset="0" stop-color="#fdf6e3"/><stop offset="70%" stop-color="#e9e0c4"/><stop offset="100%" stop-color="#c9bE9a"/></radialGradient></defs>' +
    '<circle cx="100" cy="100" r="76" fill="url(#hwMoon)"/>' +
    '<g fill="rgba(140,130,100,.35)"><circle cx="78" cy="80" r="12"/><circle cx="120" cy="96" r="18"/><circle cx="92" cy="130" r="9"/><circle cx="134" cy="70" r="7"/></g></svg>';

  /* ---------- css ---------- */
  var css =
    (fine ? "html.hw,html.hw *{cursor:none!important}.cur-dot,.cur-ring{display:none!important}" : "") +
    ".hw-grade{position:fixed;inset:0;z-index:9990;pointer-events:none;background:radial-gradient(130% 110% at 50% 30%,rgba(10,6,20,0) 42%,rgba(8,5,16,.5) 100%)}" +
    ".hw-grade.flk{animation:hw-flk 7s ease-in-out infinite}" +
    "@keyframes hw-flk{0%,100%{opacity:1}48%{opacity:.86}52%{opacity:.97}}" +
    ".hw-moon{position:fixed;top:24px;right:4vw;width:140px;height:140px;z-index:9989;pointer-events:none;filter:drop-shadow(0 0 48px rgba(253,246,227,.55))}" +
    "#hw-canvas{position:fixed;inset:0;z-index:9991;pointer-events:none}" +
    ".hw-web{position:fixed;width:168px;height:168px;z-index:9992;pointer-events:none;opacity:.62;filter:drop-shadow(0 1px 1px rgba(0,0,0,.4))}" +
    ".hw-web.tl{top:-6px;left:-6px}.hw-web.tr{top:-6px;right:-6px;transform:scaleX(-1)}" +
    ".hw-pk{position:fixed;bottom:-8px;width:104px;height:92px;z-index:9992;pointer-events:none;filter:drop-shadow(0 8px 16px rgba(0,0,0,.4))}" +
    ".hw-pk.l{left:14px}.hw-pk.r{right:14px}" +
    ".hw-pk .hw-carve{filter:drop-shadow(0 0 7px rgba(255,150,40,.95));animation:hw-cand 2.6s ease-in-out infinite}" +
    "@keyframes hw-cand{0%,100%{opacity:1}20%{opacity:.6}24%{opacity:.92}60%{opacity:.72}}" +
    ".hw-cur{position:fixed;top:0;left:0;width:42px;height:22px;margin:-11px 0 0 -21px;z-index:100000;pointer-events:none;will-change:transform;transition:opacity .2s}" +
    ".hw-cur svg,.hw-fly-wrap svg{width:100%;height:100%;display:block}" +
    ".hw-wg{transform-origin:60px 30px;animation:hw-flap .3s ease-in-out infinite alternate}" +
    "@keyframes hw-flap{from{transform:scaleY(1)}to{transform:scaleY(.4)}}" +
    ".hw-spider{position:fixed;top:0;z-index:9993;pointer-events:none;display:flex;flex-direction:column;align-items:center;transform:translateY(-360px);transition:transform 2.6s cubic-bezier(.45,0,.4,1)}" +
    ".hw-spider .thr{width:1px;height:340px;background:linear-gradient(rgba(230,235,245,0),rgba(230,235,245,.5))}" +
    ".hw-spider .bug{width:40px;height:34px;animation:hw-sway 3s ease-in-out infinite}" +
    "@keyframes hw-sway{0%,100%{transform:rotate(-5deg)}50%{transform:rotate(5deg)}}" +
    ".hw-flash{position:fixed;inset:0;z-index:100003;pointer-events:none;background:#fff;opacity:0}" +
    ".hw-flash.go{animation:hw-ltn .5s ease-out}" +
    "@keyframes hw-ltn{0%{opacity:0}6%{opacity:.95}12%{opacity:.1}18%{opacity:.8}30%{opacity:0}}" +
    ".hw-scare{position:fixed;inset:0;z-index:100002;pointer-events:none;display:grid;place-items:center;background:rgba(0,0,0,0);opacity:0}" +
    ".hw-scare.go{animation:hw-scbg 1.5s ease forwards}" +
    "@keyframes hw-scbg{0%{opacity:0;background:rgba(0,0,0,0)}8%{opacity:1;background:rgba(3,2,6,.92)}80%{opacity:1;background:rgba(3,2,6,.92)}100%{opacity:0;background:rgba(0,0,0,0)}}" +
    ".hw-scare .cr{width:min(86vw,620px);height:auto;filter:drop-shadow(0 0 60px rgba(255,40,20,.55))}" +
    ".hw-scare.go .cr{animation:hw-lunge 1.5s cubic-bezier(.2,.8,.2,1) forwards,hw-shk .07s linear infinite}" +
    "@keyframes hw-lunge{0%{transform:scale(.35) translateY(40px);opacity:0}10%{opacity:1}22%{transform:scale(1.12)}40%{transform:scale(1)}80%{transform:scale(1.04)}100%{transform:scale(1.3);opacity:0}}" +
    "@keyframes hw-shk{0%{margin-left:0}25%{margin-left:-8px}50%{margin-left:7px}75%{margin-left:-5px}100%{margin-left:6px}}" +
    ".hw-swoop{position:fixed;top:14%;left:-160px;width:150px;height:80px;z-index:100001;pointer-events:none}" +
    ".hw-swoop.go{animation:hw-sw 1.05s cubic-bezier(.4,0,.6,1) forwards}" +
    "@keyframes hw-sw{0%{left:-170px;top:10%;transform:scale(.6) rotate(-10deg)}100%{left:100vw;top:66%;transform:scale(2.4) rotate(12deg)}}" +
    "@media(prefers-reduced-motion:reduce){.hw-wg,.hw-pk .hw-carve,.hw-spider .bug,.hw-grade.flk{animation:none}.hw-spider{transition:none}}";

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  function el(cls, html) { var d = document.createElement("div"); d.className = cls; if (html) d.innerHTML = html; return d; }

  function run() {
    var body = document.body, html = document.documentElement;
    html.classList.add("hw");

    body.appendChild(el("hw-grade" + (reduce ? "" : " flk")));
    if (!small) body.appendChild(el("hw-moon", MOON));
    body.appendChild(el("hw-web tl", WEB));
    body.appendChild(el("hw-web tr", WEB));
    body.appendChild(el("hw-pk l", PUMPKIN));
    body.appendChild(el("hw-pk r", PUMPKIN));

    // bat cursor
    if (fine) {
      var cur = el("hw-cur", batSVG(false)); cur.style.opacity = "0"; body.appendChild(cur);
      var cx = innerWidth / 2, cy = innerHeight / 2, tx = cx, ty = cy;
      addEventListener("mousemove", function (e) { tx = e.clientX; ty = e.clientY; cur.style.opacity = "1"; }, { passive: true });
      addEventListener("mouseout", function (e) { if (!e.relatedTarget) cur.style.opacity = "0"; });
      (function g() { cx += (tx - cx) * .3; cy += (ty - cy) * .3; cur.style.transform = "translate(" + cx + "px," + cy + "px) rotate(" + ((tx - cx) * .8) + "deg)"; requestAnimationFrame(g); })();
    }

    /* ---------- atmosphere canvas: fog, embers, parallax bats ---------- */
    if (!reduce) {
      var cv = document.createElement("canvas"); cv.id = "hw-canvas"; body.appendChild(cv);
      var ctx = cv.getContext("2d"), W, H, dpr;
      function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      size(); addEventListener("resize", size);

      var embers = [], fog = [], bats = [];
      for (var i = 0; i < (small ? 14 : 30); i++) embers.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.8 + .5, s: Math.random() * .4 + .15, d: Math.random() * 6.28, h: 28 + Math.random() * 22 });
      for (var j = 0; j < 5; j++) fog.push({ x: Math.random() * W, y: H - Math.random() * 140, r: 160 + Math.random() * 160, s: Math.random() * .25 + .08, o: .05 + Math.random() * .06 });
      for (var k = 0; k < (small ? 3 : 6); k++) bats.push({ x: Math.random() * W, y: 40 + Math.random() * (H * .55), vx: (Math.random() < .5 ? -1 : 1) * (.4 + Math.random() * .9), ph: Math.random() * 6.28, sc: .5 + Math.random() * 1.1, a: .25 + Math.random() * .4 });

      function drawBat(x, y, s, flap, a) {
        ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.globalAlpha = a; ctx.fillStyle = "#0b0712";
        var w = 18 * flap;
        ctx.beginPath(); ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-10, -w, -22, -w * .3); ctx.quadraticCurveTo(-14, 2, -26, 6);
        ctx.quadraticCurveTo(-12, 7, -4, 4); ctx.quadraticCurveTo(0, 8, 4, 4);
        ctx.quadraticCurveTo(12, 7, 26, 6); ctx.quadraticCurveTo(14, 2, 22, -w * .3);
        ctx.quadraticCurveTo(10, -w, 0, 0); ctx.fill(); ctx.restore();
      }
      var t0 = performance.now();
      (function frame(now) {
        var t = (now - t0) / 1000; ctx.clearRect(0, 0, W, H);
        // fog
        for (var f = 0; f < fog.length; f++) { var o = fog[f]; o.x += o.s; if (o.x - o.r > W) o.x = -o.r;
          var gr = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r); gr.addColorStop(0, "rgba(120,110,150," + o.o + ")"); gr.addColorStop(1, "rgba(120,110,150,0)");
          ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.3); ctx.fill(); }
        // embers
        for (var e = 0; e < embers.length; e++) { var p = embers[e]; p.y -= p.s; p.x += Math.sin(t + p.d) * .25; if (p.y < -4) { p.y = H + 4; p.x = Math.random() * W; }
          ctx.fillStyle = "hsla(" + p.h + ",90%,60%,.7)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill(); }
        // bats
        for (var b = 0; b < bats.length; b++) { var z = bats[b]; z.x += z.vx; z.ph += .25; var fl = .5 + Math.abs(Math.sin(z.ph)) * .9;
          if (z.vx > 0 && z.x > W + 40) z.x = -40; if (z.vx < 0 && z.x < -40) z.x = W + 40;
          drawBat(z.x, z.y + Math.sin(t * 1.2 + z.x * .01) * 16, z.sc, fl, z.a); }
        requestAnimationFrame(frame);
      })(t0);
    }

    // dangling spider
    if (!reduce) {
      var sp = el("hw-spider", '<div class="thr"></div><div class="bug">' + SPIDER + '</div>'); sp.style.left = "22%"; body.appendChild(sp);
      function drop() { sp.style.left = (12 + Math.random() * 72) + "%"; sp.style.transform = "translateY(" + (140 + Math.random() * 170) + "px)"; setTimeout(function () { sp.style.transform = "translateY(-360px)"; }, 3600); }
      setTimeout(drop, 9000); setInterval(drop, 21000);
    }

    /* ---------- sound design ---------- */
    var AC = window.AudioContext || window.webkitAudioContext, actx = null, noiseBuf = null, windGain = null;
    function brown(sec) { var n = actx.sampleRate * sec, b = actx.createBuffer(1, n, actx.sampleRate), d = b.getChannelData(0), last = 0; for (var i = 0; i < n; i++) { var w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; d[i] = last * 3.2; } return b; }
    function unlock() {
      if (actx || !AC) return; try {
        actx = new AC(); noiseBuf = brown(2);
        var src = actx.createBufferSource(); src.buffer = noiseBuf; src.loop = true;
        var lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 480;
        windGain = actx.createGain(); windGain.gain.value = 0.02;
        src.connect(lp); lp.connect(windGain); windGain.connect(actx.destination); src.start();
      } catch (e) {}
    }
    addEventListener("pointerdown", unlock, { once: true });
    addEventListener("keydown", unlock, { once: true });
    function scareSound() {
      if (!actx) return; try {
        var t = actx.currentTime;
        // whoosh
        var ws = actx.createBufferSource(); ws.buffer = noiseBuf;
        var wf = actx.createBiquadFilter(); wf.type = "bandpass"; wf.frequency.setValueAtTime(200, t); wf.frequency.exponentialRampToValueAtTime(2600, t + .35);
        var wg = actx.createGain(); wg.gain.setValueAtTime(0.0001, t); wg.gain.exponentialRampToValueAtTime(.5, t + .12); wg.gain.exponentialRampToValueAtTime(.0001, t + .45);
        ws.connect(wf); wf.connect(wg); wg.connect(actx.destination); ws.start(t); ws.stop(t + .5);
        // boom
        var bo = actx.createOscillator(), bg = actx.createGain(); bo.type = "sine"; bo.frequency.setValueAtTime(140, t + .12); bo.frequency.exponentialRampToValueAtTime(42, t + .7);
        bg.gain.setValueAtTime(.0001, t + .12); bg.gain.exponentialRampToValueAtTime(.6, t + .18); bg.gain.exponentialRampToValueAtTime(.0001, t + .8);
        bo.connect(bg); bg.connect(actx.destination); bo.start(t + .12); bo.stop(t + .82);
        // screech
        var o = actx.createOscillator(), g = actx.createGain(); o.type = "sawtooth"; o.frequency.setValueAtTime(1300, t + .14); o.frequency.exponentialRampToValueAtTime(180, t + .7);
        g.gain.setValueAtTime(.0001, t + .14); g.gain.exponentialRampToValueAtTime(.22, t + .2); g.gain.exponentialRampToValueAtTime(.0001, t + .72);
        o.connect(g); g.connect(actx.destination); o.start(t + .14); o.stop(t + .74);
      } catch (e) {}
    }
    function swoopSound() {
      if (!actx) return; try { var t = actx.currentTime, ws = actx.createBufferSource(); ws.buffer = noiseBuf;
        var wf = actx.createBiquadFilter(); wf.type = "bandpass"; wf.frequency.setValueAtTime(300, t); wf.frequency.exponentialRampToValueAtTime(1800, t + .5);
        var wg = actx.createGain(); wg.gain.setValueAtTime(.0001, t); wg.gain.exponentialRampToValueAtTime(.3, t + .15); wg.gain.exponentialRampToValueAtTime(.0001, t + .6);
        ws.connect(wf); wf.connect(wg); wg.connect(actx.destination); ws.start(t); ws.stop(t + .62); } catch (e) {}
    }

    if (reduce) return;

    /* ---------- jumpscares ---------- */
    var flash = el("hw-flash"); body.appendChild(flash);
    var scare = el("hw-scare", '<div class="cr">' + SCAREBAT + '</div>'); body.appendChild(scare);
    function jumpscare() {
      flash.classList.remove("go"); scare.classList.remove("go"); void scare.offsetWidth;
      flash.classList.add("go"); scare.classList.add("go"); scareSound();
    }
    function swoop() {
      var b = el("hw-swoop", batSVG(true)); body.appendChild(b); void b.offsetWidth; b.classList.add("go"); swoopSound();
      setTimeout(function () { b.remove(); }, 1150);
    }
    setTimeout(swoop, 6500);
    setTimeout(jumpscare, 15000);
    (function cycle() { setTimeout(function () { (Math.random() < .45 ? jumpscare : swoop)(); cycle(); }, 20000 + Math.random() * 16000); })();
  }

  if (document.readyState === "loading") addEventListener("DOMContentLoaded", run); else run();
})();
