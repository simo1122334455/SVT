/* ==========================================================================
   Fond animé : un réseau de neurones discret, avec des signaux qui voyagent.
   Léger (30 images/s max, ≤ 55 points), en pause si l'onglet est caché ou
   pendant la présentation, et figé si l'utilisateur réduit les animations.
   ========================================================================== */
(function () {
  'use strict';
  const toile = document.getElementById('fond');
  if (!toile) return;
  const ctx = toile.getContext('2d');
  const reduit = matchMedia('(prefers-reduced-motion: reduce)');
  let L = 0, H = 0, dpr = 1, noeuds = [], signaux = [], couleur = '#38e4f0', trait = '#c9d5f0';
  let dernier = 0, prochainSignal = 0, enCours = false;

  function lireCouleurs() {
    const s = getComputedStyle(document.documentElement);
    couleur = s.getPropertyValue('--accent').trim() || couleur;
    trait = s.getPropertyValue('--texte-2').trim() || trait;
  }
  function initialiser() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    L = innerWidth; H = innerHeight;
    toile.width = L * dpr; toile.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.max(18, Math.min(55, Math.round(L * H / 26000)));
    noeuds = Array.from({ length: n }, () => ({
      x: Math.random() * L, y: Math.random() * H,
      vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
      r: 1.4 + Math.random() * 1.4
    }));
    signaux = [];
  }
  const portee = () => Math.min(190, Math.min(L, H) * .2);
  function voisins(i) {
    const a = noeuds[i], d = portee(), v = [];
    noeuds.forEach((b, j) => { if (j !== i && Math.hypot(a.x - b.x, a.y - b.y) < d) v.push(j); });
    return v;
  }
  function lancerSignal(depuis) {
    const i = depuis != null ? depuis : Math.floor(Math.random() * noeuds.length);
    const v = voisins(i);
    if (v.length) signaux.push({ a: i, b: v[Math.floor(Math.random() * v.length)], t: 0, sauts: depuis != null ? 1 : 0 });
  }

  function dessiner(bouger) {
    ctx.clearRect(0, 0, L, H);
    const d = portee();
    if (bouger) noeuds.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = L + 20; if (n.x > L + 20) n.x = -20;
      if (n.y < -20) n.y = H + 20; if (n.y > H + 20) n.y = -20;
    });
    ctx.lineWidth = 1;
    for (let i = 0; i < noeuds.length; i++) {
      for (let j = i + 1; j < noeuds.length; j++) {
        const a = noeuds[i], b = noeuds[j], dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < d) {
          ctx.globalAlpha = (1 - dist / d) * .22;
          ctx.strokeStyle = trait;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    ctx.fillStyle = couleur;
    noeuds.forEach(n => { ctx.globalAlpha = .55; ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.283); ctx.fill(); });
    // signaux : une étincelle qui parcourt une connexion
    signaux.forEach(s => {
      const a = noeuds[s.a], b = noeuds[s.b], x = a.x + (b.x - a.x) * s.t, y = a.y + (b.y - a.y) * s.t;
      const g = ctx.createRadialGradient(x, y, 0, x, y, 9);
      g.addColorStop(0, couleur); g.addColorStop(1, 'transparent');
      ctx.globalAlpha = .9; ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.283); ctx.fill();
    });
    ctx.globalAlpha = 1;
  }

  function boucle(t) {
    if (!enCours) return;
    requestAnimationFrame(boucle);
    if (t - dernier < 33) return;                 // 30 images par seconde maximum
    const dt = Math.min(t - dernier, 100); dernier = t;
    const calme = document.body.classList.contains('calme');
    if (t > prochainSignal) { lancerSignal(); prochainSignal = t + (calme ? 2600 : 1100) + Math.random() * 900; }
    signaux.forEach(s => { s.t += dt / 1400; });
    signaux = signaux.filter(s => {
      if (s.t < 1) return true;
      if (s.sauts < 3 && Math.random() < .6) lancerSignal(s.b);   // le signal passe au neurone suivant
      return false;
    });
    dessiner(true);
  }
  function demarrer() {
    const doitBouger = !reduit.matches && !document.hidden && !document.body.classList.contains('pause');
    if (doitBouger && !enCours) { enCours = true; dernier = performance.now(); requestAnimationFrame(boucle); }
    if (!doitBouger) { enCours = false; dessiner(false); }
  }

  lireCouleurs(); initialiser();
  let attente;
  addEventListener('resize', () => { clearTimeout(attente); attente = setTimeout(() => { initialiser(); dessiner(false); }, 200); });
  document.addEventListener('visibilitychange', demarrer);
  document.addEventListener('theme', () => { lireCouleurs(); dessiner(false); });
  reduit.addEventListener('change', demarrer);
  // la classe du <body> change à chaque page (calme, pause…)
  new MutationObserver(demarrer).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  demarrer();
})();
