/* La réponse : la question → les étapes → la conclusion (avec le vote révélé) */
(function () {
  'use strict';
  const S = window.SITE, T = window.TEXTES, I = S.ICONES;

  const ETAPES = [
    { id: 'naissance', t: 'À la naissance, le stock est déjà là' },
    { id: 'volume', t: 'Alors, qu\'est-ce qui grandit ?' },
    { id: 'connexions', t: 'Les connexions explosent' },
    { id: 'elagage', t: 'Puis le cerveau fait le ménage' },
    { id: 'myeline', t: 'Les câbles deviennent plus rapides' },
    { id: 'exceptions', t: 'Les deux exceptions' },
    { id: 'adulte', t: 'Et chez l\'adulte ?' },
    { id: 'conclusion', t: 'Conclusion' }
  ];
  const VOTE_MSG = {
    pareil: ['Bien vu !', 'Tu avais répondu « à peu près pareil » : c\'est exactement ça.'],
    plus: ['Presque tout le monde répond ça…', 'Tu avais répondu « oui, beaucoup plus » : en réalité, le nombre de neurones du cortex ne grimpe pas en grandissant.'],
    moins: ['Pas tout à fait…', 'Tu avais répondu « non, moins » : on n\'en a pas beaucoup moins qu\'à la naissance.']
  };

  S.page('reponse', {
    ambiance: 'calme',
    rendu(app, param) {
      let vote = null; try { vote = sessionStorage.getItem('vote'); } catch (e) { /* pas de stockage */ }
      const etape = (i, contenu) => '<section class="etape apparait" id="etape-' + ETAPES[i].id + '" aria-labelledby="t-' + ETAPES[i].id + '">' +
        '<span class="etape-num" aria-hidden="true">' + (i + 1) + '</span>' +
        '<div class="etape-corps"><span class="surtitre">Étape ' + (i + 1) + '</span><h2 id="t-' + ETAPES[i].id + '">' + ETAPES[i].t + '</h2>' + contenu + '</div></section>';

      app.innerHTML = '<div class="page conteneur">' +
        S.entete('La réponse', T.question, "On reprend tout, dans l'ordre : ce qu'on a à la naissance, ce qui change ensuite, et ce qui ne change pas.") +
        '<div class="reponse-mise">' +
        '<nav class="rail" aria-label="Étapes de la réponse"><ol>' + ETAPES.map((e, i) => '<li><button type="button" data-cible="etape-' + e.id + '"><span>' + (i + 1) + '</span>' + e.t + '</button></li>').join('') + '</ol></nav>' +
        '<div class="etapes">' +

        etape(0, '<p class="lead">' + S.riche(T.t1) + '</p>' +
          '<div class="duo-compteurs">' +
            '<div class="carte compteur-carte"><span class="surtitre">Nouveau-né</span><div class="chiffre"><span data-c1>0</span><small>milliards de neurones dans le cortex ' + S.cite('larsen2006') + '</small></div></div>' +
            '<div class="carte compteur-carte"><span class="surtitre">Adulte</span><div class="chiffre"><span data-c2>0</span> à <span data-c3>0</span><small>milliards (femmes ~19, hommes ~23) ' + S.cite('pakkenberg1997') + '</small></div></div>' +
          '</div><p class="discret">Comment on les compte ? Par ' + S.terme('stereologie', 'stéréologie') + ' : on compte dans de tout petits morceaux de cortex, puis on calcule le total.</p>') +

        etape(1, '<p class="lead">' + S.riche(T.volume) + '</p>' +
          '<div class="carte volume-duo" role="img" aria-label="Le cerveau à la naissance et à 1 an : son volume a doublé">' +
            '<figure><img src="assets/img/cerveau-profil.webp" alt="" style="width:' + D().volume.points[0].valeur + '%"><figcaption>Naissance</figcaption></figure>' +
            '<div class="fois" aria-hidden="true">×2</div>' +
            '<figure><img src="assets/img/cerveau-profil.webp" alt="" style="width:' + D().volume.points[1].valeur + '%"><figcaption>1 an</figcaption></figure>' +
          '</div>') +

        etape(2, '<p class="lead">' + S.riche(T.t2) + '</p>' +
          '<div class="carte"><div class="reseau" data-reseau></div>' +
          '<div class="rangee entre"><button type="button" class="bouton petit" data-pousser>Faire pousser des connexions</button>' +
          '<span class="jauge-mini" aria-live="polite"><span data-jauge-txt>Densité de synapses : ~67 % du maximum (naissance)</span></span></div></div>') +

        etape(3, '<p class="lead">' + S.riche(T.t3) + '</p><p>' + S.riche(T.microglie) + '</p>' +
          '<div class="carte tri"><div class="tri-visuel"><svg viewBox="0 0 460 300" data-tri role="img" aria-label="Schéma du tri des connexions"></svg></div>' +
          '<div class="tri-texte"><div class="tri-etape" aria-live="polite" data-tri-txt></div>' +
          '<div class="rangee"><button type="button" class="bouton petit" data-tri-suiv>Étape suivante ' + I.fleche + '</button><button type="button" class="bouton second petit" data-tri-reset>Recommencer</button></div>' +
          '<div class="points-etapes" data-tri-pts aria-hidden="true"></div></div></div>') +

        etape(4, '<p class="lead">' + S.riche(T.t4) + '</p>' +
          '<div class="carte barres-myeline" role="img" aria-label="Myéline du cortex : moins de 2 % chez le bébé, environ 60 % à l\'adolescence, 100 % chez l\'adulte">' +
            barre('Bébé', 2, 'moins de 2 %') + barre('Adolescent', 60, '~60 %') + barre('Adulte', 100, '100 %') +
          '</div><p class="discret">Pour voir la différence de vitesse : ' + '<a href="#/simulation">la simulation</a>.</p>') +

        etape(5, '<p class="lead">' + S.riche(T.exceptions) + '</p>' +
          '<div class="grille grille-2">' +
            '<div class="carte"><span class="surtitre">Exception 1</span><h3>Le cervelet</h3><p>Il fabrique encore des neurones pendant la première année : la couche qui les produit disparaît vers le 11e mois ' + S.cite('abraham2001') + '.</p></div>' +
            '<div class="carte"><span class="surtitre">Exception 2</span><h3>Le voyage vers l\'avant</h3><p>Pendant les premiers mois, de jeunes neurones nés avant la naissance voyagent encore vers le lobe frontal ' + S.cite('paredes2016') + '.</p></div>' +
          '</div>') +

        etape(6, '<p class="lead">' + S.riche(T.t5) + '</p>' +
          '<div class="grille grille-3 etudes">' +
            '<div class="carte etude non"><span class="verdict">Non</span><h3>Sorrells 2018</h3><p>59 échantillons : aucun jeune neurone chez les adultes de 18 à 77 ans ' + S.cite('sorrells2018') + '.</p></div>' +
            '<div class="carte etude oui"><span class="verdict">Oui</span><h3>Boldrini 2018</h3><p>28 personnes de 14 à 79 ans : des milliers de neurones immatures ' + S.cite('boldrini2018') + '.</p></div>' +
            '<div class="carte etude indice"><span class="verdict">L\'indice</span><h3>Moreno-Jiménez 2019</h3><p>Au-delà de 12 heures dans le produit de conservation, la trace des jeunes neurones s\'efface presque ' + S.cite('morenojimenez2019') + '.</p></div>' +
          '</div>' +
          '<div class="encadre"><span class="surtitre">Le saviez-vous ? Les bombes qui datent les neurones</span><p>' + S.riche(T.encB) + '</p></div>' +
          '<div class="carte compteur-direct"><div class="chiffre"><span data-direct>0</span><small>nouveaux neurones dans chaque hippocampe depuis que tu es sur cette page (<span data-temps>0 s</span>)</small></div>' +
          '<p class="discret">Calcul à partir des ~700 par jour de Spalding ' + S.cite('spalding2013') + ' : environ un toutes les 2 minutes. C\'est peu, et cela ne concerne qu\'une petite zone du cerveau.</p></div>') +

        etape(7, '<div class="conclusion carte mise-en-avant"><p class="lead">' + S.riche(T.conclusion) + '</p>' +
          '<p class="punchline">« ' + T.t6 + ' »</p></div>' +
          '<div class="vote-revele carte" data-vote></div>' +
          '<h3>À retenir</h3><ul class="retenir">' +
            '<li><strong>Le nombre de neurones du cortex ne change pas</strong> de la naissance à 3 ans (~20 milliards) ' + S.cite('kjaer2017') + '.</li>' +
            '<li><strong>Ce qui grandit</strong> : les synapses, la myéline, les cellules de soutien et le volume du cerveau.</li>' +
            '<li><strong>Exceptions</strong> : le cervelet la première année, et un petit renouvellement discuté dans l\'hippocampe de l\'adulte.</li>' +
          '</ul>') +

        '</div></div>' +
        S.filRouge("Tu connais la réponse. Pour aller plus loin, déclenche toi-même un neurone et regarde un message passer d'une cellule à l'autre.", 'simulation') +
        '</div>';

      // compteurs de l'étape 1
      S.compteurVisible(app.querySelector('[data-c1]'), 19.8, 1);
      S.compteurVisible(app.querySelector('[data-c2]'), 19, 0);
      S.compteurVisible(app.querySelector('[data-c3]'), 23, 0);

      reseau(app);
      tri(app);
      compteurDirect(app);
      reveleVote(app.querySelector('[data-vote]'), vote);

      // rail : navigation entre étapes et étape courante
      const boutons = Array.from(app.querySelectorAll('.rail button'));
      boutons.forEach(b => b.addEventListener('click', () => {
        document.getElementById(b.dataset.cible).scrollIntoView({ behavior: S.reduit() ? 'auto' : 'smooth', block: 'start' });
      }));
      if ('IntersectionObserver' in window) {
        const o = new IntersectionObserver(es => es.forEach(e => {
          if (e.isIntersecting) boutons.forEach(b => b.classList.toggle('actif', b.dataset.cible === e.target.id));
        }), { rootMargin: '-40% 0px -55% 0px' });
        app.querySelectorAll('.etape').forEach(s => o.observe(s));
        S.quitte(() => o.disconnect());
      }
      if (param) { const c = document.getElementById(param); if (c) setTimeout(() => c.scrollIntoView(), 50); }
    }
  });

  const D = () => window.DONNEES;
  function barre(lib, v, txt) {
    return '<div class="barre-ligne"><span>' + lib + '</span><div class="barre"><span style="width:' + v + '%"></span></div><strong>' + txt + '</strong></div>';
  }

  /* --- réseau qui gagne des connexions --- */
  function aleatoire(graine) { let s = graine; return () => (s = s * 16807 % 2147483647) / 2147483647; }
  function reseau(app) {
    const W = 660, H = 300, r = aleatoire(11), noeuds = [];
    for (let i = 0; i < 15; i++) noeuds.push({ x: 60 + (i % 5) * 135 + (r() - .5) * 50, y: 50 + Math.floor(i / 5) * 100 + (r() - .5) * 40 });
    const paires = [];
    for (let i = 0; i < 15; i++) for (let j = i + 1; j < 15; j++) if (Math.hypot(noeuds[i].x - noeuds[j].x, noeuds[i].y - noeuds[j].y) < 185) paires.push({ i, j, k: r() });
    paires.sort((a, b) => a.k - b.k);
    const zone = app.querySelector('[data-reseau]');
    zone.innerHTML = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="Réseau de 15 neurones qui gagne des connexions">' +
      paires.map((p, n) => '<line class="lien cache" data-n="' + n + '" x1="' + noeuds[p.i].x.toFixed(0) + '" y1="' + noeuds[p.i].y.toFixed(0) + '" x2="' + noeuds[p.j].x.toFixed(0) + '" y2="' + noeuds[p.j].y.toFixed(0) + '"/>').join('') +
      noeuds.map(n => '<circle class="noeud" cx="' + n.x.toFixed(0) + '" cy="' + n.y.toFixed(0) + '" r="9"/>').join('') + '</svg>';
    const liens = Array.from(zone.querySelectorAll('.lien'));
    const txt = app.querySelector('[data-jauge-txt]'), bt = app.querySelector('[data-pousser]');
    let vus = 0;
    function pousser() {
      for (let k = 0; k < 6 && vus < liens.length; k++, vus++) liens[vus].classList.remove('cache');
      if (vus >= liens.length) { txt.textContent = 'Densité de synapses : ~100 % du maximum (vers 1-2 ans)'; bt.disabled = true; bt.textContent = 'Maximum atteint'; }
      else txt.textContent = 'Le réseau se construit…';
    }
    bt.addEventListener('click', pousser);
    zone.addEventListener('click', pousser);
  }

  /* --- le tri : 5 étapes, de la connexion inutile à la microglie --- */
  const TRI = [
    { t: '1. Deux connexions', d: 'Le cerveau en a fabriqué trop. Celle du haut sert tout le temps, celle du bas presque jamais.' },
    { t: "2. L'activité renforce", d: 'Chaque message qui passe renforce la connexion du haut. Celle du bas s\'affaiblit.' },
    { t: '3. Une étiquette', d: 'La connexion qui ne sert pas reçoit une étiquette chimique « à recycler » {schafer2012}.' },
    { t: '4. La microglie arrive', d: 'Une cellule nettoyeuse, la microglie, repère l\'étiquette et avale la connexion {paolicelli2011}.' },
    { t: '5. Un réseau plus net', d: 'Moins de connexions, mais les bonnes : c\'est l\'élagage.' }
  ];
  function tri(app) {
    const svg = app.querySelector('[data-tri]'), txt = app.querySelector('[data-tri-txt]'), pts = app.querySelector('[data-tri-pts]');
    const suiv = app.querySelector('[data-tri-suiv]');
    let k = 0;
    function dessiner() {
      const fini = k >= 4;
      let g = '<circle class="tri-n" cx="80" cy="150" r="26"/>' +
        '<path class="tri-lien fort" d="M106 138 C200 100 280 96 352 92" style="stroke-width:' + (k >= 1 ? 9 : 5) + '"/><circle class="tri-n" cx="380" cy="90" r="22"/>';
      if (!fini) g += '<path class="tri-lien' + (k >= 2 ? ' marque' : '') + '" d="M106 164 C200 200 280 208 352 214" style="stroke-width:' + (k >= 1 ? 2.5 : 5) + '"/>';
      g += '<circle class="tri-n' + (fini ? ' eteint' : '') + '" cx="380" cy="216" r="22"/>';
      if (k >= 2 && !fini) g += '<circle class="tri-etiquette" cx="230" cy="204" r="12"/><text class="tri-lib" x="230" y="240" text-anchor="middle">étiquette</text>';
      if (k >= 3) {
        const mx = k >= 4 ? 230 : 120, my = k >= 4 ? 204 : 268;
        g += '<g class="tri-microglie">' + Array.from({ length: 7 }, (_, i) => { const a = i / 7 * 6.283; return '<line x1="' + mx + '" y1="' + my + '" x2="' + (mx + Math.cos(a) * 24).toFixed(0) + '" y2="' + (my + Math.sin(a) * 24).toFixed(0) + '"/>'; }).join('') +
          '<circle cx="' + mx + '" cy="' + my + '" r="13"/><text class="tri-lib" x="' + mx + '" y="' + (my + 44) + '" text-anchor="middle">microglie</text></g>';
      }
      svg.innerHTML = g;
      txt.innerHTML = '<strong>' + TRI[k].t + '</strong><p>' + S.riche(TRI[k].d) + '</p>';
      pts.innerHTML = TRI.map((_, i) => '<i class="' + (i === k ? 'actif' : '') + '"></i>').join('');
      suiv.disabled = k >= TRI.length - 1;
    }
    suiv.addEventListener('click', () => { if (k < TRI.length - 1) { k++; dessiner(); } });
    app.querySelector('[data-tri-reset]').addEventListener('click', () => { k = 0; dessiner(); });
    dessiner();
  }

  /* --- compteur en direct (Spalding : ~700 par jour et par hippocampe) --- */
  function compteurDirect(app) {
    const n = app.querySelector('[data-direct]'), t = app.querySelector('[data-temps]'), t0 = Date.now(), parSec = 700 / 86400;
    S.minuteur(() => {
      const s = (Date.now() - t0) / 1000;
      n.textContent = Math.floor(s * parSec);
      t.textContent = s < 60 ? Math.floor(s) + ' s' : Math.floor(s / 60) + ' min ' + String(Math.floor(s % 60)).padStart(2, '0') + ' s';
    }, 500);
  }

  function reveleVote(boite, vote) {
    const m = VOTE_MSG[vote];
    boite.innerHTML = '<span class="surtitre">Ton avis du début</span>' + (m
      ? '<h3>' + m[0] + '</h3><p>' + m[1] + ' Un nouveau-né a environ 19,8 milliards de neurones dans le cortex ' + S.cite('larsen2006') + ', un adulte entre 19 et 23 milliards ' + S.cite('pakkenberg1997') + '.</p>'
      : '<h3>Tu n\'as pas voté sur l\'accueil</h3><p>La bonne réponse était « à peu près pareil ». <a href="#/accueil">Retourner à l\'accueil</a></p>');
  }
})();
