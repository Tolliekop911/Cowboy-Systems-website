/* ============================================================
   COWBOY SYSTEMS — HALLOWEEN MODE (cinematic horror, effect-driven)
   Dark vignette + flicker · drifting fog + ash (canvas) · distant
   lightning + thunder · jumpscare: light-cut -> TV static/glitch ->
   blurred shadow lunge -> red flash/black-out -> violent shake, with
   layered sound (drone/boom/screech/static). No illustrated art.
   Remove: delete this file + the <script src="/js/halloween.js"> tags.
   ============================================================ */
(function () {
  "use strict";
  if (window.__hwOn) return; window.__hwOn = true;
  try { if (localStorage.getItem("hw-off") === "1") return; } catch (e) {}

  var reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var small = innerWidth < 760;

  var css =
    ".hw-grade{position:fixed;inset:0;z-index:9990;pointer-events:none;background:radial-gradient(130% 115% at 50% 32%,rgba(6,4,12,0) 40%,rgba(5,3,11,.6) 100%)}" +
    ".hw-grade.flk{animation:hw-flk 6s ease-in-out infinite}" +
    "@keyframes hw-flk{0%,100%{opacity:1}46%{opacity:.82}50%{opacity:.98}68%{opacity:.9}}" +
    "#hw-atmo{position:fixed;inset:0;z-index:9991;pointer-events:none;mix-blend-mode:multiply}" +
    ".hw-ltn{position:fixed;inset:0;z-index:9992;pointer-events:none;background:radial-gradient(120% 90% at 60% 0%,rgba(190,205,255,.9),rgba(140,160,220,0) 55%);opacity:0}" +
    ".hw-ltn.go{animation:hw-ltn .9s ease-out}" +
    "@keyframes hw-ltn{0%{opacity:0}4%{opacity:.85}10%{opacity:.08}16%{opacity:.7}26%{opacity:0}}" +
    /* jumpscare layers */
    ".hw-black{position:fixed;inset:0;z-index:100000;pointer-events:none;background:#000;opacity:0}" +
    "#hw-static{position:fixed;inset:0;z-index:100001;pointer-events:none;opacity:0;image-rendering:pixelated;width:100%;height:100%;mix-blend-mode:screen}" +
    ".hw-shadow{position:fixed;left:50%;top:54%;width:52vmin;height:52vmin;margin:-26vmin 0 0 -26vmin;z-index:100002;pointer-events:none;opacity:0;" +
      "background:radial-gradient(closest-side,rgba(2,1,4,.98) 46%,rgba(2,1,4,.55) 72%,rgba(2,1,4,0) 100%);filter:blur(10px);border-radius:50%}" +
    ".hw-shadow.go{animation:hw-lunge .7s cubic-bezier(.3,.7,.2,1) forwards}" +
    "@keyframes hw-lunge{0%{opacity:0;transform:scale(.12)}18%{opacity:1}100%{opacity:1;transform:scale(5.2)}}" +
    ".hw-red{position:fixed;inset:0;z-index:100003;pointer-events:none;background:radial-gradient(130% 120% at 50% 50%,rgba(150,0,0,.0) 30%,rgba(120,0,0,.6) 100%);opacity:0}" +
    ".hw-red.go{animation:hw-red .9s ease forwards}" +
    "@keyframes hw-red{0%{opacity:0}14%{opacity:1}70%{opacity:1}100%{opacity:0}}" +
    "html.hw-shake,html.hw-shake body{animation:hw-shk .06s steps(2) 7}" +
    "@keyframes hw-shk{0%{transform:translate(0,0)}25%{transform:translate(-10px,6px)}50%{transform:translate(9px,-8px)}75%{transform:translate(-7px,-5px)}100%{transform:translate(8px,7px)}}" +
    "@media(prefers-reduced-motion:reduce){.hw-grade.flk{animation:none}}";

  var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
  function mk(cls, tag) { var d = document.createElement(tag || "div"); d.className = cls; return d; }

  function run() {
    var body = document.body;
    body.appendChild(mk("hw-grade" + (reduce ? "" : " flk")));

    /* ---------- atmosphere: fog + ash on canvas ---------- */
    if (!reduce) {
      var cv = document.createElement("canvas"); cv.id = "hw-atmo"; body.appendChild(cv);
      var ctx = cv.getContext("2d"), W, H, dpr;
      function size() { dpr = Math.min(devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cv.style.width = W + "px"; cv.style.height = H + "px"; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); }
      size(); addEventListener("resize", size);
      var fog = [], ash = [];
      for (var i = 0; i < 6; i++) fog.push({ x: Math.random() * W, y: H * .35 + Math.random() * H * .7, r: 200 + Math.random() * 230, s: (Math.random() * .3 + .08) * (Math.random() < .5 ? -1 : 1), o: .05 + Math.random() * .07 });
      for (var j = 0; j < (small ? 16 : 34); j++) ash.push({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.4 + .4, vy: Math.random() * .3 + .1, d: Math.random() * 6.28 });
      var t0 = performance.now();
      (function frame(now) {
        var t = (now - t0) / 1000; ctx.clearRect(0, 0, W, H);
        for (var f = 0; f < fog.length; f++) { var o = fog[f]; o.x += o.s; if (o.x - o.r > W) o.x = -o.r; if (o.x + o.r < 0) o.x = W + o.r;
          var g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r); g.addColorStop(0, "rgba(60,55,80," + o.o + ")"); g.addColorStop(1, "rgba(60,55,80,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, 6.3); ctx.fill(); }
        for (var a = 0; a < ash.length; a++) { var p = ash[a]; p.y += p.vy; p.x += Math.sin(t + p.d) * .2; if (p.y > H + 3) { p.y = -3; p.x = Math.random() * W; }
          ctx.fillStyle = "rgba(90,86,78,.5)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill(); }
        requestAnimationFrame(frame);
      })(t0);
    }

    /* ---------- sound ---------- */
    var AC = window.AudioContext || window.webkitAudioContext, actx = null, noiseBuf = null;
    function brown(sec) { var n = (actx.sampleRate) * sec, b = actx.createBuffer(1, n, actx.sampleRate), d = b.getChannelData(0), last = 0; for (var i = 0; i < n; i++) { var w = Math.random() * 2 - 1; last = (last + .02 * w) / 1.02; d[i] = last * 3.2; } return b; }
    function unlock() { if (actx || !AC) return; try { actx = new AC(); noiseBuf = brown(2);
      var s = actx.createBufferSource(); s.buffer = noiseBuf; s.loop = true; var lp = actx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 420; var g = actx.createGain(); g.gain.value = .018; s.connect(lp); lp.connect(g); g.connect(actx.destination); s.start(); } catch (e) {} }
    addEventListener("pointerdown", unlock, { once: true }); addEventListener("keydown", unlock, { once: true });
    function tone(type, f0, f1, t0, dur, peak) { var o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + t0; o.type = type; o.frequency.setValueAtTime(f0, t); if (f1 !== f0) o.frequency.exponentialRampToValueAtTime(f1, t + dur); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + Math.min(.04, dur / 3)); g.gain.exponentialRampToValueAtTime(.0001, t + dur); o.connect(g); g.connect(actx.destination); o.start(t); o.stop(t + dur + .02); }
    function noise(t0, dur, peak, type, f0, f1) { var s = actx.createBufferSource(); s.buffer = noiseBuf; var bf = actx.createBiquadFilter(); bf.type = type; var t = actx.currentTime + t0; bf.frequency.setValueAtTime(f0, t); if (f1) bf.frequency.exponentialRampToValueAtTime(f1, t + dur); var g = actx.createGain(); g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + .05); g.gain.exponentialRampToValueAtTime(.0001, t + dur); s.connect(bf); bf.connect(g); g.connect(actx.destination); s.start(t); s.stop(t + dur + .02); }
    function scareSound() { if (!actx) return; try {
      tone("sine", 70, 190, 0, .55, .25);        // rising drone
      noise(.45, .5, .55, "bandpass", 300, 3200);// whoosh/static rush
      tone("sine", 150, 40, .5, .8, .7);          // impact boom
      tone("sawtooth", 1400, 170, .52, .7, .28);  // screech
      noise(.5, .45, .4, "highpass", 2000);       // static crackle
    } catch (e) {} }
    function thunder() { if (!actx) return; try { tone("sine", 60, 30, 0, 1.4, .3); noise(.05, 1.1, .18, "lowpass", 260); } catch (e) {} }

    /* ---------- static canvas (glitch burst) ---------- */
    var sc = document.createElement("canvas"); sc.id = "hw-static"; sc.width = 160; sc.height = 90; body.appendChild(sc);
    var sctx = sc.getContext("2d");
    function burstStatic(ms) {
      sc.style.opacity = ".85"; var end = performance.now() + ms;
      (function st2() { var img = sctx.createImageData(160, 90), d = img.data; for (var i = 0; i < d.length; i += 4) { var v = (Math.random() * 255) | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } sctx.putImageData(img, 0, 0);
        sc.style.transform = "translate(" + (Math.random() * 6 - 3) + "px," + (Math.random() * 6 - 3) + "px)";
        if (performance.now() < end) requestAnimationFrame(st2); else sc.style.opacity = "0"; })();
    }

    if (reduce) return;

    /* ---------- ambient lightning ---------- */
    var ltn = mk("hw-ltn"); body.appendChild(ltn);
    function lightning() { ltn.classList.remove("go"); void ltn.offsetWidth; ltn.classList.add("go"); setTimeout(thunder, 500 + Math.random() * 700); }
    (function lcycle() { setTimeout(function () { lightning(); lcycle(); }, 24000 + Math.random() * 40000); })();

    /* ---------- jumpscare ---------- */
    var black = mk("hw-black"), shadow = mk("hw-shadow"), red = mk("hw-red");
    body.appendChild(black); body.appendChild(shadow); body.appendChild(red);
    var html = document.documentElement;
    function jumpscare() {
      // 1. light cut: a few rapid black flickers
      var seq = [60, 40, 120, 50, 90], on = false, i = 0;
      (function cut() { on = !on; black.style.opacity = on ? ".9" : "0"; if (i < seq.length) { setTimeout(cut, seq[i++]); } else { black.style.opacity = "0"; strike(); } })();
      function strike() {
        burstStatic(520);
        shadow.classList.remove("go"); void shadow.offsetWidth; shadow.classList.add("go");
        red.classList.remove("go"); void red.offsetWidth; red.classList.add("go");
        html.classList.remove("hw-shake"); void html.offsetWidth; html.classList.add("hw-shake");
        scareSound();
        setTimeout(function () { html.classList.remove("hw-shake"); }, 600);
      }
    }
    function nearMiss() { burstStatic(260); noise(0, .4, .3, "bandpass", 400, 2000); ltn.classList.remove("go"); void ltn.offsetWidth; ltn.classList.add("go"); }

    setTimeout(jumpscare, 12000);
    (function cycle() { setTimeout(function () { (Math.random() < .55 ? jumpscare : nearMiss)(); cycle(); }, 20000 + Math.random() * 18000); })();
  }

  if (document.readyState === "loading") addEventListener("DOMContentLoaded", run); else run();
})();
