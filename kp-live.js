/* KinetiPix hero — "living photo" demo using a real portrait.
   Cycle: printed still (flat, desaturated) -> AR lock-on -> comes alive
   (full color, gentle Ken Burns motion + blink) -> settles back to a print. */
(function () {
  function init() {
    var print = document.querySelector('.phone .print.locked');
    if (!print || print.dataset.kpLive) return;
    print.dataset.kpLive = '1';
    print.classList.add('kp-live');

    var D = '8s';
    var css = ''
    + '.kp-live{position:relative;overflow:hidden;width:100%;aspect-ratio:3/4}'
    + '.kp-live img.kp-orig,.kp-live .shimmer{display:none !important}'
    + '.kp-live .kp-wrap{position:absolute;inset:0;border-radius:inherit;overflow:hidden;background:#0b0f14}'
    + '.kp-live .kp-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 34%;'
    +   'transform-origin:50% 42%;will-change:transform,filter;'
    +   'animation:kpLife ' + D + ' ease-in-out infinite, kpTone ' + D + ' ease-in-out infinite}'
    /* Ken Burns-style motion, confined to the living window, returns to rest */
    + '@keyframes kpLife{'
    +   '0%,24%{transform:scale(1) translate(0,0)}'
    +   '40%{transform:scale(1.035) translate(-1.2%,-0.8%)}'
    +   '58%{transform:scale(1.05) translate(0.8%,-1.4%)}'
    +   '76%{transform:scale(1.06) translate(-0.3%,-1.8%)}'
    +   '88%,100%{transform:scale(1) translate(0,0)}}'
    /* tone: flat print -> vivid life (with two blinks) -> flat print */
    + '@keyframes kpTone{'
    +   '0%,22%{filter:grayscale(0.4) saturate(0.7) contrast(0.95) brightness(1)}'
    +   '32%{filter:grayscale(0) saturate(1.06) contrast(1) brightness(1.02)}'
    +   '41%{filter:grayscale(0) saturate(1.06) contrast(1) brightness(1.02)}'
    +   '43%{filter:grayscale(0) saturate(1.06) contrast(1) brightness(0.6)}'   /* blink */
    +   '45%{filter:grayscale(0) saturate(1.06) contrast(1) brightness(1.03)}'
    +   '60%{filter:grayscale(0) saturate(1.1) contrast(1) brightness(1.03)}'
    +   '62%{filter:grayscale(0) saturate(1.1) contrast(1) brightness(0.6)}'    /* blink */
    +   '64%{filter:grayscale(0) saturate(1.1) contrast(1) brightness(1.03)}'
    +   '80%{filter:grayscale(0) saturate(1.05) contrast(1) brightness(1)}'
    +   '90%,100%{filter:grayscale(0.4) saturate(0.7) contrast(0.95) brightness(1)}}'
    /* warm glow during life */
    + '.kp-live .kp-glow{position:absolute;inset:0;border-radius:inherit;pointer-events:none;animation:kpGlow ' + D + ' ease infinite}'
    + '@keyframes kpGlow{0%,28%{box-shadow:inset 0 0 0 0 rgba(245,166,35,0)}44%{box-shadow:inset 0 0 30px 2px rgba(245,166,35,.33)}72%{box-shadow:inset 0 0 20px 1px rgba(245,166,35,.2)}84%,100%{box-shadow:inset 0 0 0 0 rgba(245,166,35,0)}}'
    /* diagonal light shimmer sweeping once as it wakes */
    + '.kp-live .kp-shine{position:absolute;top:-60%;left:-40%;width:50%;height:220%;transform:rotate(18deg);pointer-events:none;'
    +   'background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.28),rgba(255,255,255,0));opacity:0;animation:kpShine ' + D + ' ease-in-out infinite}'
    + '@keyframes kpShine{0%,26%{left:-40%;opacity:0}30%{opacity:.9}48%{left:120%;opacity:.9}52%{opacity:0}100%{opacity:0}}'
    /* AR scan bar */
    + '.kp-live .kp-scan{position:absolute;left:3%;right:3%;height:20%;border-radius:12px;pointer-events:none;'
    +   'background:linear-gradient(180deg,rgba(245,166,35,0),rgba(245,166,35,.5),rgba(245,166,35,0));filter:blur(1px);opacity:0;animation:kpScan ' + D + ' linear infinite}'
    + '@keyframes kpScan{0%{top:-22%;opacity:0}20%{opacity:.9}22%{opacity:.9}30%{top:102%;opacity:.9}33%{opacity:0}100%{opacity:0}}'
    /* AR corner brackets */
    + '.kp-live .kp-bracket{position:absolute;width:20px;height:20px;border:2.5px solid #F5A623;opacity:0;animation:kpBrk ' + D + ' ease infinite}'
    + '.kp-live .kp-bracket.tl{top:6%;left:6%;border-right:0;border-bottom:0;border-radius:6px 0 0 0}'
    + '.kp-live .kp-bracket.tr{top:6%;right:6%;border-left:0;border-bottom:0;border-radius:0 6px 0 0}'
    + '.kp-live .kp-bracket.bl{bottom:6%;left:6%;border-right:0;border-top:0;border-radius:0 0 0 6px}'
    + '.kp-live .kp-bracket.br{bottom:6%;right:6%;border-left:0;border-top:0;border-radius:0 0 6px 0}'
    + '@keyframes kpBrk{0%,20%{opacity:0;transform:scale(1.25)}30%{opacity:1;transform:scale(1)}80%{opacity:1;transform:scale(1)}90%,100%{opacity:0;transform:scale(1.15)}}'
    /* status label */
    + '.kp-live .kp-label{position:absolute;top:9px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:7px;'
    +   'background:rgba(10,14,20,.72);backdrop-filter:blur(4px);color:#fff;font:600 10.5px/1 system-ui,-apple-system,sans-serif;'
    +   'padding:5px 11px;border-radius:999px;white-space:nowrap;border:1px solid rgba(255,255,255,.14)}'
    + '.kp-live .kp-label .dot{width:6px;height:6px;border-radius:50%;background:#9aa4ad;animation:kpDot ' + D + ' steps(1,end) infinite}'
    + '@keyframes kpDot{0%,30%{background:#9aa4ad;box-shadow:none}31%,82%{background:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.25)}83%,100%{background:#9aa4ad;box-shadow:none}}'
    + '.kp-live .kp-label span{position:relative;width:74px;text-align:left}'
    + '.kp-live .kp-label span b{position:absolute;left:0;top:0;font-weight:600;opacity:0}'
    + '.kp-live .kp-label .l-still{animation:kpLStill ' + D + ' steps(1,end) infinite}'
    + '.kp-live .kp-label .l-lock{animation:kpLLock ' + D + ' steps(1,end) infinite}'
    + '.kp-live .kp-label .l-live{animation:kpLLive ' + D + ' steps(1,end) infinite}'
    + '@keyframes kpLStill{0%,19%{opacity:1}20%,88%{opacity:0}89%,100%{opacity:1}}'
    + '@keyframes kpLLock{0%,19%{opacity:0}20%,30%{opacity:1}31%,100%{opacity:0}}'
    + '@keyframes kpLLive{0%,30%{opacity:0}31%,88%{opacity:1}89%,100%{opacity:0}}'
    + '@media (prefers-reduced-motion:reduce){.kp-live .kp-photo{animation:none;filter:none}.kp-live .kp-scan,.kp-live .kp-shine,.kp-live .kp-glow,.kp-live .kp-bracket{display:none}.kp-live .kp-label .l-live b{opacity:1}}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    print.innerHTML = ''
      + '<div class="kp-wrap">'
      +   '<img class="kp-photo" src="assets/hero-portrait.jpg" alt="A printed portrait coming to life in KinetiPix">'
      +   '<div class="kp-shine"></div>'
      +   '<i class="kp-bracket tl"></i><i class="kp-bracket tr"></i><i class="kp-bracket bl"></i><i class="kp-bracket br"></i>'
      +   '<div class="kp-scan"></div><div class="kp-glow"></div>'
      +   '<div class="kp-label"><span class="dot"></span>'
      +     '<span><b class="l-still" style="opacity:1">Printed photo</b><b class="l-lock">Locking on…</b><b class="l-live">Living photo</b></span>'
      +   '</div>'
      + '</div>';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
