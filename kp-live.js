/* KinetiPix hero — animated "living photo" demo.
   Replaces the static print in the hero phone with an illustrated
   portrait that cycles: printed still -> AR lock on -> comes alive
   (blink, smile, gentle motion) -> freezes back to a printed still. */
(function () {
  function init() {
    var print = document.querySelector('.phone .print.locked');
    if (!print || print.dataset.kpLive) return;
    print.dataset.kpLive = '1';
    print.classList.add('kp-live');

    var css = ''
    + '.kp-live{position:relative;overflow:hidden;width:100%;aspect-ratio:3/4}'
    + '.kp-live img,.kp-live .shimmer{display:none !important}'
    + '.kp-live .kp-wrap{position:absolute;inset:0;border-radius:inherit;overflow:hidden;background:#0b0f14}'
    + '.kp-live svg{display:block;width:100%;height:100%}'
    /* ---- subject motion: still except in the "alive" window ---- */
    + '@keyframes kpBob{0%,30%{transform:translateY(0) rotate(0)}40%{transform:translateY(-1.6px) rotate(-0.8deg)}55%{transform:translateY(0.6px) rotate(0.6deg)}70%{transform:translateY(-1px) rotate(-0.4deg)}80%,100%{transform:translateY(0) rotate(0)}}'
    + '@keyframes kpBreath{0%,30%{transform:scaleY(1)}50%{transform:scaleY(1.015)}70%{transform:scaleY(1.005)}80%,100%{transform:scaleY(1)}}'
    + '@keyframes kpBlink{0%,36%{transform:scaleY(1)}38%{transform:scaleY(0.08)}40%{transform:scaleY(1)}62%{transform:scaleY(1)}64%{transform:scaleY(0.08)}66%{transform:scaleY(1)}100%{transform:scaleY(1)}}'
    + '@keyframes kpHair{0%,30%{transform:rotate(0)}48%{transform:rotate(1.6deg)}66%{transform:rotate(-1.2deg)}80%,100%{transform:rotate(0)}}'
    + '@keyframes kpSmileIn{0%,32%{opacity:0}40%,78%{opacity:1}84%,100%{opacity:0}}'
    + '@keyframes kpSmileOut{0%,32%{opacity:1}40%,78%{opacity:0}84%,100%{opacity:1}}'
    + '@keyframes kpCloud{0%,30%{transform:translateX(0)}80%{transform:translateX(26px)}100%{transform:translateX(0)}}'
    + '@keyframes kpCloud2{0%,30%{transform:translateX(0)}80%{transform:translateX(-20px)}100%{transform:translateX(0)}}'
    + '@keyframes kpBird{0%,34%{transform:translate(0,0)}80%{transform:translate(34px,-10px)}81%,100%{opacity:0}}'
    /* ---- AR overlay ---- */
    + '.kp-live .kp-scan{position:absolute;left:4%;right:4%;height:22%;border-radius:10px;'
    +   'background:linear-gradient(180deg,rgba(245,166,35,0) 0%,rgba(245,166,35,.55) 50%,rgba(245,166,35,0) 100%);'
    +   'filter:blur(1px);opacity:0;animation:kpScanMove 7s linear infinite}'
    + '@keyframes kpScanMove{0%{top:-24%;opacity:0}20%{opacity:.9}24%{top:102%;opacity:.9}26%{opacity:0}100%{opacity:0}}'
    + '.kp-live .kp-bracket{position:absolute;width:20px;height:20px;border:2.5px solid #F5A623;opacity:0;animation:kpBrk 7s ease infinite}'
    + '.kp-live .kp-bracket.tl{top:7%;left:7%;border-right:0;border-bottom:0;border-radius:6px 0 0 0}'
    + '.kp-live .kp-bracket.tr{top:7%;right:7%;border-left:0;border-bottom:0;border-radius:0 6px 0 0}'
    + '.kp-live .kp-bracket.bl{bottom:7%;left:7%;border-right:0;border-top:0;border-radius:0 0 0 6px}'
    + '.kp-live .kp-bracket.br{bottom:7%;right:7%;border-left:0;border-top:0;border-radius:0 0 6px 0}'
    + '@keyframes kpBrk{0%,22%{opacity:0;transform:scale(1.25)}30%{opacity:1;transform:scale(1)}78%{opacity:1;transform:scale(1)}86%,100%{opacity:0;transform:scale(1.15)}}'
    + '.kp-live .kp-glow{position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 0 rgba(245,166,35,0);animation:kpGlow 7s ease infinite;pointer-events:none}'
    + '@keyframes kpGlow{0%,30%{box-shadow:inset 0 0 0 0 rgba(245,166,35,0)}42%{box-shadow:inset 0 0 26px 2px rgba(245,166,35,.35)}70%{box-shadow:inset 0 0 18px 1px rgba(245,166,35,.22)}80%,100%{box-shadow:inset 0 0 0 0 rgba(245,166,35,0)}}'
    + '.kp-live .kp-spark{position:absolute;width:5px;height:5px;border-radius:50%;background:#ffd89b;box-shadow:0 0 8px 2px rgba(255,214,120,.8);opacity:0;animation:kpSpark 7s ease-in-out infinite}'
    + '@keyframes kpSpark{0%,38%{opacity:0;transform:scale(0.4)}48%{opacity:1;transform:scale(1)}58%{opacity:0;transform:scale(0.4)}100%{opacity:0}}'
    /* ---- status label ---- */
    + '.kp-live .kp-label{position:absolute;top:8px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:6px;'
    +   'background:rgba(10,14,20,.72);backdrop-filter:blur(4px);color:#fff;font:600 10.5px/1 system-ui,sans-serif;'
    +   'padding:5px 10px;border-radius:999px;white-space:nowrap;border:1px solid rgba(255,255,255,.12)}'
    + '.kp-live .kp-label .dot{width:6px;height:6px;border-radius:50%;background:#9aa4ad}'
    + '.kp-live .kp-label span{position:absolute;left:24px;opacity:0}'
    + '.kp-live .kp-label .l-still{animation:kpLStill 7s steps(1,end) infinite}'
    + '.kp-live .kp-label .l-lock{animation:kpLLock 7s steps(1,end) infinite}'
    + '.kp-live .kp-label .l-live{animation:kpLLive 7s steps(1,end) infinite}'
    + '@keyframes kpLStill{0%,21%{opacity:1}22%,83%{opacity:0}84%,100%{opacity:1}}'
    + '@keyframes kpLLock{0%,21%{opacity:0}22%,31%{opacity:1}32%,100%{opacity:0}}'
    + '@keyframes kpLLive{0%,31%{opacity:0}32%,83%{opacity:1}84%,100%{opacity:0}}'
    + '.kp-live .kp-label.live .dot{background:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.25);animation:kpDot 7s steps(1,end) infinite}'
    + '@keyframes kpDot{0%,31%{background:#9aa4ad;box-shadow:none}32%,83%{background:#F5A623;box-shadow:0 0 0 3px rgba(245,166,35,.25)}84%,100%{background:#9aa4ad;box-shadow:none}}'
    + '.kp-eyes{transform-box:fill-box;transform-origin:center;animation:kpBlink 7s ease infinite}'
    + '.kp-head{transform-box:fill-box;transform-origin:50% 90%;animation:kpBob 7s ease-in-out infinite}'
    + '.kp-hair{transform-box:fill-box;transform-origin:50% 100%;animation:kpHair 7s ease-in-out infinite}'
    + '.kp-body{transform-box:fill-box;transform-origin:50% 100%;animation:kpBreath 7s ease-in-out infinite}'
    + '.kp-smile{animation:kpSmileIn 7s ease infinite}'
    + '.kp-neutral{animation:kpSmileOut 7s ease infinite}'
    + '.kp-c1{animation:kpCloud 7s ease-in-out infinite}'
    + '.kp-c2{animation:kpCloud2 7s ease-in-out infinite}'
    + '.kp-birds{animation:kpBird 7s ease-in infinite}';

    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var svg = ''
    + '<svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">'
    +   '<defs>'
    +     '<linearGradient id="kpsky" x1="0" y1="0" x2="0" y2="1">'
    +       '<stop offset="0" stop-color="#8ec5e8"/><stop offset="0.55" stop-color="#cfe6f2"/><stop offset="1" stop-color="#f3e4cf"/>'
    +     '</linearGradient>'
    +     '<clipPath id="kpclip"><rect x="0" y="0" width="300" height="400" rx="0"/></clipPath>'
    +   '</defs>'
    +   '<g clip-path="url(#kpclip)">'
    +     '<rect width="300" height="400" fill="url(#kpsky)"/>'
    +     '<circle cx="232" cy="66" r="30" fill="#ffe08a"/>'
    +     '<g class="kp-c1" fill="#ffffff" opacity="0.9"><ellipse cx="70" cy="70" rx="34" ry="15"/><ellipse cx="92" cy="60" rx="22" ry="13"/></g>'
    +     '<g class="kp-c2" fill="#ffffff" opacity="0.8"><ellipse cx="210" cy="120" rx="26" ry="11"/><ellipse cx="190" cy="114" rx="16" ry="9"/></g>'
    +     '<g class="kp-birds" fill="none" stroke="#3b4a57" stroke-width="2" stroke-linecap="round" opacity="0.7">'
    +       '<path d="M60 150 l8 -5 l8 5"/><path d="M84 160 l7 -4 l7 4"/></g>'
    +     '<rect y="300" width="300" height="100" fill="#7fae6a"/>'
    +     '<path d="M0 300 Q75 284 150 300 T300 300 V330 H0 Z" fill="#8cbd76"/>'
    /* person */
    +     '<g class="kp-body">'
    +       '<path d="M90 400 V356 C90 320 116 300 150 300 C184 300 210 320 210 356 V400 Z" fill="#4a6fa5"/>'
    +       '<path d="M128 306 H172 V330 C172 342 128 342 128 330 Z" fill="#e8b48c"/>'
    +     '</g>'
    +     '<g class="kp-head">'
    +       '<g class="kp-hair"><path d="M108 206 C108 168 192 168 192 206 C198 196 196 150 150 150 C104 150 102 196 108 206 Z" fill="#4a362b"/></g>'
    +       '<ellipse cx="150" cy="212" rx="42" ry="46" fill="#e8b48c"/>'
    +       '<path d="M112 204 C112 176 188 176 188 204 C196 194 192 156 150 156 C108 156 104 194 112 204 Z" fill="#4a362b"/>'
    +       '<g class="kp-eyes">'
    +         '<ellipse cx="134" cy="210" rx="6" ry="7.5" fill="#2a2320"/><ellipse cx="166" cy="210" rx="6" ry="7.5" fill="#2a2320"/>'
    +         '<circle cx="136" cy="207" r="1.8" fill="#fff"/><circle cx="168" cy="207" r="1.8" fill="#fff"/>'
    +       '</g>'
    +       '<path d="M126 196 q8 -5 16 -1" stroke="#4a362b" stroke-width="3" fill="none" stroke-linecap="round"/>'
    +       '<path d="M158 195 q8 -4 16 1" stroke="#4a362b" stroke-width="3" fill="none" stroke-linecap="round"/>'
    +       '<path d="M150 216 q-3 6 0 10" stroke="#c98f68" stroke-width="2.5" fill="none" stroke-linecap="round"/>'
    +       '<path class="kp-neutral" d="M140 236 h20" stroke="#9c5b43" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    +       '<path class="kp-smile" d="M138 234 q12 14 24 0" stroke="#9c5b43" stroke-width="3.5" fill="none" stroke-linecap="round"/>'
    +       '<ellipse cx="124" cy="228" rx="6" ry="4" fill="#f0a98f" opacity="0.55"/><ellipse cx="176" cy="228" rx="6" ry="4" fill="#f0a98f" opacity="0.55"/>'
    +     '</g>'
    +   '</g>'
    + '</svg>';

    print.innerHTML = ''
      + '<div class="kp-wrap">' + svg
      + '<span class="kp-spark" style="left:30%;top:40%"></span>'
      + '<span class="kp-spark" style="left:68%;top:34%;animation-delay:.25s"></span>'
      + '<span class="kp-spark" style="left:52%;top:56%;animation-delay:.5s"></span>'
      + '<i class="kp-bracket tl"></i><i class="kp-bracket tr"></i><i class="kp-bracket bl"></i><i class="kp-bracket br"></i>'
      + '<div class="kp-scan"></div><div class="kp-glow"></div>'
      + '<div class="kp-label live"><span class="dot"></span>'
      +   '<span class="l-still">Printed photo</span>'
      +   '<span class="l-lock">Locking on…</span>'
      +   '<span class="l-live">Living photo</span></div>'
      + '</div>';
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
