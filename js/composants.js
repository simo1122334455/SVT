/* ==========================================================================
   Composants partagés entre plusieurs pages (et la présentation)
   ========================================================================== */
(function () {
  'use strict';
  const S = window.SITE, D = window.DONNEES;

  /* ---------- image réelle avec points numérotés cliquables ---------- */
  let numPoints = 0;
  function imagePoints(conteneur, opts) {
    const n = ++numPoints;
    conteneur.innerHTML =
      '<figure class="image-points">' +
        '<div class="image-points-cadre">' +
          '<img src="' + opts.src + '" alt="' + S.echappe(opts.alt) + '" ' + (opts.largeur ? 'width="' + opts.largeur + '" height="' + opts.hauteur + '"' : '') + '>' +
          opts.points.map((p, i) => '<button type="button" class="point' + (p.cache ? ' cache' : '') + '" data-i="' + i + '" style="left:' + p.x + '%;top:' + p.y + '%" ' +
            'aria-describedby="pts-' + n + '"><span aria-hidden="true">' + (i + 1) + '</span><span class="sr">' + p.lab + '</span></button>').join('') +
        '</div>' +
        (opts.credit ? '<figcaption>' + opts.credit + '</figcaption>' : '') +
      '</figure>' +
      '<div class="info-point" id="pts-' + n + '" aria-live="polite"><p class="discret">' + (opts.invite || 'Touche un point numéroté pour savoir ce que c\'est.') + '</p></div>';
    const info = conteneur.querySelector('.info-point');
    const boutons = Array.from(conteneur.querySelectorAll('.point'));
    function choisir(i) {
      const p = opts.points[i];
      boutons.forEach((b, j) => b.classList.toggle('actif', j === i));
      info.innerHTML = '<h3>' + (i + 1) + '. ' + p.lab + '</h3><p>' + S.riche(p.def) + '</p>' +
        (p.terme ? '<p class="discret">' + S.terme(p.terme, 'Définition de « ' + p.lab + ' »') + '</p>' : '');
    }
    boutons.forEach((b, i) => b.addEventListener('click', () => choisir(i)));
    return { choisir, boutons };
  }

  /* ---------- nombre qui défile jusqu'à sa valeur ---------- */
  function compteur(el, cible, decimales) {
    const fin = () => { el.textContent = S.nf(cible.toFixed(decimales || 0)); };
    if (S.reduit()) return fin();
    const t0 = performance.now(), duree = 1400;
    (function pas(t) {
      const k = Math.min(1, (t - t0) / duree), e = 1 - Math.pow(1 - k, 3);
      el.textContent = S.nf((cible * e).toFixed(decimales || 0));
      if (k < 1) requestAnimationFrame(pas); else fin();
    })(t0);
  }
  // lance le compteur quand l'élément arrive à l'écran
  function compteurVisible(el, cible, decimales) {
    if (!('IntersectionObserver' in window)) return compteur(el, cible, decimales);
    const o = new IntersectionObserver(es => { if (es[0].isIntersecting) { o.disconnect(); compteur(el, cible, decimales); } }, { threshold: .4 });
    o.observe(el);
    S.quitte(() => o.disconnect());
  }

  /* ---------- schéma du neurone (parties sélectionnables) ---------- */
  const PARTIES = [
    { id: 'dendrites', lab: 'Dendrites', terme: 'dendrite',
      def: "Les branches qui reçoivent les messages des autres neurones. C'est sur elles qu'arrivent la plupart des synapses." },
    { id: 'corps', lab: 'Corps cellulaire', terme: 'corps',
      def: "Le centre de commande : il additionne les messages reçus et décide d'envoyer le sien. C'est cette partie qu'on compte pour connaître le nombre de neurones." },
    { id: 'noyau', lab: 'Noyau', terme: 'neurone',
      def: "Il contient l'ADN de la cellule. Un neurone formé ne se divise plus : c'est pour ça qu'on ne fabrique pas de nouveaux neurones en divisant les anciens." },
    { id: 'axone', lab: 'Axone', terme: 'axone',
      def: "Le long câble qui emmène le message vers les autres neurones, parfois très loin." },
    { id: 'myeline', lab: 'Gaine de myéline', terme: 'myeline',
      def: "La gaine isolante enroulée autour de l'axone : elle accélère le message. Chez le bébé, le cortex en a moins de 2 % du niveau adulte {miller2012}." },
    { id: 'ranvier', lab: 'Nœud de Ranvier', terme: 'ranvier',
      def: "Un petit espace nu entre deux gaines : le message saute de l'un à l'autre, ce qui le rend rapide." },
    { id: 'terminaisons', lab: "Terminaisons de l'axone", terme: 'axone',
      def: "Les extrémités de l'axone, qui vont toucher d'autres neurones." },
    { id: 'synapse', lab: 'Synapse', terme: 'synapse',
      def: "Le point de contact entre deux neurones : le message traverse un espace minuscule grâce à des [[neurotransmetteur|neurotransmetteurs]]. Ce sont les synapses qui se multiplient après la naissance, pas les neurones {huttenlocher1979}." }
  ];
  function svgNeurone() {
    const myeline = [0, 1, 2, 3, 4].map(i => '<rect x="' + (300 + i * 92) + '" y="196" width="74" height="28" rx="14"/>').join('');
    const noeuds = [0, 1, 2, 3].map(i => '<circle cx="' + (383 + i * 92) + '" cy="210" r="7"/>').join('');
    return '<svg class="schema-neurone" viewBox="0 0 1000 420" role="group" aria-label="Schéma d\'un neurone : choisis une partie">' +
      // dendrites
      '<g class="partie" data-p="dendrites"><path d="M150 186 C120 150 104 120 70 104 M118 150 C96 150 76 140 54 150 M154 232 C122 266 100 296 66 312 M120 270 C96 266 74 276 52 266 M180 168 C176 128 186 92 172 56 M176 110 C156 96 146 78 140 58 M182 254 C182 296 196 328 186 366 M186 318 C206 330 214 350 222 370 M140 206 C104 210 74 200 40 210"/></g>' +
      // corps et noyau
      '<g class="partie" data-p="corps"><circle cx="196" cy="210" r="56"/></g>' +
      '<g class="partie" data-p="noyau"><circle cx="190" cy="206" r="20"/></g>' +
      // axone, myéline, nœuds
      '<g class="partie" data-p="axone"><path d="M252 210 H770"/></g>' +
      '<g class="partie" data-p="myeline">' + myeline + '</g>' +
      '<g class="partie" data-p="ranvier">' + noeuds + '</g>' +
      // terminaisons
      '<g class="partie" data-p="terminaisons"><path d="M770 210 C800 210 806 168 834 160 M770 210 C806 212 812 214 846 214 M770 210 C800 212 806 256 834 264"/><circle cx="838" cy="160" r="9"/><circle cx="850" cy="214" r="9"/><circle cx="838" cy="264" r="9"/></g>' +
      // synapse et neurone suivant
      '<g class="partie" data-p="synapse"><path d="M866 196 V232" stroke-dasharray="4 5"/><circle cx="858" cy="206" r="3"/><circle cx="860" cy="220" r="3"/></g>' +
      '<g class="voisin"><path d="M880 214 C920 214 940 196 990 190 M880 214 C930 222 950 240 992 250 M880 160 C920 168 950 150 994 140"/><text x="996" y="300" text-anchor="end">neurone suivant</text></g>' +
      '</svg>';
  }

  /* ---------- graphique en ligne simple (points du JSON reliés par des droites) ---------- */
  // opts : { series:[{cle, label, couleur, y:(val)=>..., points:[{age, cellule}] }], yMax, yLabel, hauteur, pics }
  function graphique(opts) {
    const W = 900, H = opts.hauteur || 360, M = { g: 70, d: 30, h: 34, b: 58 };
    const iw = W - M.g - M.d, ih = H - M.h - M.b, LM = Math.log(81);
    const x = a => M.g + Math.log(a + 1) / LM * iw;
    const y = v => M.h + (1 - v / opts.yMax) * ih;
    const mid = c => c.range ? (c.range[0] + c.range[1]) / 2 : c.valeur;
    const ages = [0, 0.25, 1, 3, 6, 12, 20, 30, 50, 80];
    const libAge = { 0: '0', 0.25: '3 m', 1: '1', 3: '3', 6: '6', 12: '12', 20: '20', 30: '30', 50: '50', 80: '80' };
    let g = '';
    const pas = opts.pas || opts.yMax / 4;                 // graduations rondes
    for (let v = 0; v <= opts.yMax + 1e-9; v += pas) {
      g += '<line class="g-grille" x1="' + M.g + '" x2="' + (W - M.d) + '" y1="' + y(v) + '" y2="' + y(v) + '"/>' +
        '<text class="g-axe" x="' + (M.g - 12) + '" y="' + (y(v) + 6) + '" text-anchor="end">' + S.nf(v) + '</text>';
    }
    ages.forEach(a => { g += '<text class="g-axe" x="' + x(a) + '" y="' + (H - M.b + 28) + '" text-anchor="middle">' + libAge[a] + '</text>'; });
    g += '<text class="g-titre-axe" x="' + (M.g + iw / 2) + '" y="' + (H - 8) + '" text-anchor="middle">âge (ans)</text>';
    g += '<text class="g-titre-axe" x="' + M.g + '" y="' + (M.h - 14) + '">' + opts.yLabel + '</text>';
    (opts.pics || []).forEach(p => {
      if (p.debut != null) g += '<rect class="g-bande" x="' + x(p.debut) + '" y="' + M.h + '" width="' + (x(p.fin) - x(p.debut)) + '" height="' + ih + '"/>';
      else g += '<line class="g-pic" x1="' + x(p.age) + '" x2="' + x(p.age) + '" y1="' + M.h + '" y2="' + (M.h + ih) + '"/>';
    });
    let points = '';
    opts.series.forEach(s => {
      const pts = s.points;
      for (let i = 0; i < pts.length - 1; i++) {
        const a = pts[i], b = pts[i + 1], tiret = a.cellule.range || b.cellule.range || a.cellule.estimation || b.cellule.estimation;
        g += '<line class="g-ligne' + (tiret ? ' tiret' : '') + '" style="stroke:' + s.couleur + '" x1="' + x(a.age) + '" y1="' + y(mid(a.cellule)) + '" x2="' + x(b.age) + '" y2="' + y(mid(b.cellule)) + '"/>';
      }
      pts.forEach(p => {
        const c = p.cellule, X = x(p.age);
        const titre = s.label + ' — ' + p.label + ' : ' + S.valeur(c, s.unite) + ' (' + c.method + ')';
        if (c.range) {
          g += '<line class="g-fourchette" style="stroke:' + s.couleur + '" x1="' + X + '" x2="' + X + '" y1="' + y(c.range[0]) + '" y2="' + y(c.range[1]) + '"/>';
          points += '<rect class="g-cible" data-age="' + p.age + '" x="' + (X - 16) + '" y="' + (y(c.range[1]) - 10) + '" width="32" height="' + (y(c.range[0]) - y(c.range[1]) + 20) + '"><title>' + S.echappe(titre) + '</title></rect>';
        } else {
          g += '<circle class="g-point' + (c.estimation ? ' estimation' : '') + '" style="' + (c.estimation ? 'stroke:' : 'fill:') + s.couleur + '" cx="' + X + '" cy="' + y(c.valeur) + '" r="7"/>';
          points += '<circle class="g-cible" data-age="' + p.age + '" cx="' + X + '" cy="' + y(c.valeur) + '" r="18"><title>' + S.echappe(titre) + '</title></circle>';
        }
      });
    });
    g += '<line class="g-curseur" x1="' + x(0) + '" x2="' + x(0) + '" y1="' + M.h + '" y2="' + (M.h + ih) + '"/>';
    const svg = '<svg class="graphique" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + S.echappe(opts.alt) + '">' + g + points + '</svg>';
    return { svg, curseur: (racine, age) => {
      const l = racine.querySelector('.g-curseur');
      if (l) { l.setAttribute('x1', x(age)); l.setAttribute('x2', x(age)); }
    } };
  }

  // séries prêtes à l'emploi depuis le JSON
  function serie(cle) {
    const s = D.series.find(x => x.cle === cle);
    return { cle, label: s.label, unite: s.unite, couleur: 'var(--d-' + cle + ')',
      points: D.points.map(p => ({ age: p.age, label: p.label, cellule: p[cle] })) };
  }
  function serieVolume() {
    const v = D.volume;
    return { cle: 'volume', label: v.label, unite: ' %', couleur: 'var(--d-volume)',
      points: v.points.map(p => ({ age: p.age, label: p.label, cellule: { valeur: p.valeur, approx: true, method: v.method, note: v.note } })) };
  }

  Object.assign(S, { imagePoints, compteur, compteurVisible, PARTIES, svgNeurone, graphique, serie, serieVolume });
})();
