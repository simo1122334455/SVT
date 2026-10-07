/* Le cerveau en coupe : faire défiler de vraies IRM et repérer les régions */
(function () {
  'use strict';
  const S = window.SITE;

  const MODES = [
    { id: 'horizontale', t: 'Coupe horizontale', sens: ['le sommet', 'la base'], n: 12, ref: 6,
      alt: "IRM d'un cerveau humain, coupe horizontale vue d'en haut",
      points: [
        { x: 30, y: 18, lab: 'Cortex', terme: 'cortex', def: 'Le ruban clair et plissé tout autour : la substance grise.' },
        { x: 36, y: 26, lab: 'Substance blanche', terme: 'blanche', def: "L'intérieur plus sombre et lisse : les câbles entourés de myéline." },
        { x: 47, y: 35, lab: 'Ventricules', terme: 'ventricules', def: 'Les deux virgules noires au centre, remplies de liquide.' },
        { x: 50, y: 28, lab: 'Corps calleux', terme: 'calleux', def: 'La bande claire qui relie les deux moitiés, juste devant les ventricules.' },
        { x: 43, y: 48, lab: 'Noyaux gris centraux', terme: 'noyaux', def: 'Les masses grises de part et d\'autre des ventricules.' },
        { x: 40, y: 62, lab: 'Hippocampe', terme: 'hippocampe', def: "Ici passe la corne du ventricule qui longe l'hippocampe, la zone où l'on cherche des neurones nés à l'âge adulte." }
      ] },
    { id: 'coronale', t: 'Coupe de face', sens: ["l'avant", "l'arrière"], n: 12, ref: 7,
      alt: "IRM d'un cerveau humain, coupe verticale vue de face",
      points: [
        { x: 30, y: 20, lab: 'Cortex', terme: 'cortex', def: 'Le ruban plissé qui fait tout le tour.' },
        { x: 34, y: 34, lab: 'Substance blanche', terme: 'blanche', def: 'Le cœur plus sombre et lisse de chaque moitié.' },
        { x: 41, y: 49, lab: 'Ventricules', terme: 'ventricules', def: 'Les deux fentes noires au centre.' },
        { x: 50, y: 42, lab: 'Corps calleux', terme: 'calleux', def: 'Le pont horizontal juste au-dessus des ventricules.' },
        { x: 38, y: 45, lab: 'Noyaux gris centraux', terme: 'noyaux', def: 'Les masses grises collées aux ventricules.' },
        { x: 40, y: 60, lab: 'Hippocampe', terme: 'hippocampe', def: "La structure enroulée dans le lobe temporal, une de chaque côté : c'est là que se joue le débat sur les nouveaux neurones de l'adulte." },
        { x: 51, y: 74, lab: 'Tronc cérébral', terme: 'tronc', def: 'La tige centrale qui descend vers la moelle épinière.' }
      ] },
    { id: 'profil', t: 'Coupe de profil', sens: ['le milieu', 'le côté'], n: 7, ref: 0,
      alt: "IRM d'un cerveau humain, coupe verticale vue de profil",
      points: [
        { x: 24, y: 20, lab: 'Cortex', terme: 'cortex', def: 'Le ruban plissé en surface, sur toute la longueur.' },
        { x: 28, y: 34, lab: 'Substance blanche', terme: 'blanche', def: 'La masse lisse sous le cortex.' },
        { x: 40, y: 49, lab: 'Corps calleux', terme: 'calleux', def: "Le grand arc clair au milieu : le pont entre les deux moitiés du cerveau." },
        { x: 37, y: 53, lab: 'Ventricule', terme: 'ventricules', def: 'La cavité sombre juste sous le corps calleux.' },
        { x: 77, y: 70, lab: 'Cervelet', terme: 'cervelet', def: "Ses plis très fins dessinent un arbre. C'est la région qui fabrique encore des neurones pendant la première année." },
        { x: 56, y: 71, lab: 'Tronc cérébral', terme: 'tronc', def: 'La tige qui descend vers la moelle épinière.' }
      ] }
  ];
  const CERVEAU = 'M78 196C68 146 96 104 142 82C190 58 250 52 300 62C352 72 396 100 414 140C430 176 424 214 398 238C378 258 348 266 318 264C300 262 288 258 276 250C268 268 246 284 214 286C176 288 146 272 128 246C112 224 86 224 78 196Z';
  const CERVELET = 'M300 258C336 246 382 252 404 274C420 290 408 316 376 322C340 328 306 314 294 292C288 280 290 266 300 258Z';

  S.page('coupe', {
    rendu(app) {
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Pour aller plus loin', 'Le cerveau en coupe',
          "Voici de vraies [[irm|IRM]] d'un cerveau humain. Choisis un sens de coupe, puis fais glisser le curseur pour traverser le cerveau, comme sur la machine.") +
        '<div class="onglets" role="tablist" aria-label="Sens de la coupe">' + MODES.map((m, i) =>
          '<button type="button" role="tab" aria-selected="' + (i === 0) + '" data-m="' + i + '">' + m.t + '</button>').join('') + '</div>' +
        '<section class="carte coupe">' +
          '<div class="coupe-image" data-image></div>' +
          '<div class="coupe-cote">' +
            '<div class="reperage" data-reperage aria-hidden="true"></div>' +
            '<label class="etiquette-curseur" for="coupe-curseur">Profondeur de la coupe</label>' +
            '<input id="coupe-curseur" class="curseur" type="range" min="0" value="0" step="1">' +
            '<div class="coupe-sens"><span data-de></span><span data-a></span></div>' +
            '<p class="coupe-num" aria-live="polite" data-num></p>' +
            '<button type="button" class="bouton second petit" data-ref>◆ Revenir aux repères</button>' +
          '</div>' +
        '</section>' +
        '<p class="credit">IRM 7 teslas d\'un cerveau humain, résolution 100 µm (Edlow et al., 2019) — CC0, domaine public.</p>' +
        S.filRouge("L'[[hippocampe|hippocampe]], visible sur la coupe de face, est la seule région où l'on cherche encore des neurones nés à l'âge adulte ; le [[cervelet|cervelet]], sur la coupe de profil, est celle qui en fabrique encore pendant la première année.", 'lexique') +
        '</div>';

      const zoneImage = app.querySelector('[data-image]'), curseur = app.querySelector('#coupe-curseur');
      const num = app.querySelector('[data-num]'), btRef = app.querySelector('[data-ref]'), rep = app.querySelector('[data-reperage]');
      let m = MODES[0], vue = null;

      function fichier(i) { return 'assets/irm/' + m.id + '-' + String(i).padStart(2, '0') + '.webp'; }
      function changerMode(k) {
        m = MODES[k];
        app.querySelectorAll('[data-m]').forEach((b, j) => b.setAttribute('aria-selected', String(j === k)));
        vue = S.imagePoints(zoneImage, { src: fichier(m.ref), alt: m.alt, points: m.points,
          invite: 'Sur cette coupe de référence, touche un point numéroté pour savoir ce que c\'est.' });
        curseur.max = m.n - 1;
        app.querySelector('[data-de]').textContent = m.sens[0];
        app.querySelector('[data-a]').textContent = m.sens[1];
        aller(m.ref);
      }
      function aller(i) {
        curseur.value = i; curseur.style.setProperty('--p', i / (m.n - 1));
        zoneImage.querySelector('img').src = fichier(i);
        const surRef = i === m.ref;
        vue.boutons.forEach(b => { b.classList.toggle('cache', !surRef); b.tabIndex = surRef ? 0 : -1; });
        num.textContent = 'Coupe ' + (i + 1) + ' sur ' + m.n + (surRef ? ' — repères affichés' : '');
        btRef.hidden = surRef;
        rep.innerHTML = reperage(m.id, i / (m.n - 1));
      }
      app.querySelectorAll('[data-m]').forEach(b => b.addEventListener('click', () => changerMode(+b.dataset.m)));
      curseur.addEventListener('input', () => aller(+curseur.value));
      btRef.addEventListener('click', () => aller(m.ref));
      changerMode(0);
      // précharge les coupes pour un défilement fluide
      MODES.forEach(mo => { for (let i = 0; i < mo.n; i++) { const im = new Image(); im.src = 'assets/irm/' + mo.id + '-' + String(i).padStart(2, '0') + '.webp'; } });
    }
  });

  // petit schéma qui montre où passe la coupe
  function reperage(mode, t) {
    let ligne;
    if (mode === 'horizontale') { const y = 60 + t * 230; ligne = '<line x1="40" y1="' + y + '" x2="480" y2="' + y + '"/>'; }
    else if (mode === 'coronale') { const x = 90 + t * 330; ligne = '<line x1="' + x + '" y1="30" x2="' + x + '" y2="350"/>'; }
    else { const x = 260 + t * 140; return '<svg viewBox="0 0 520 380"><ellipse class="rep-forme" cx="260" cy="190" rx="150" ry="170"/><line class="rep-milieu" x1="260" y1="20" x2="260" y2="360"/><line class="rep-coupe" x1="' + x + '" y1="20" x2="' + x + '" y2="360"/><text x="260" y="374" text-anchor="middle">vu de dessus</text></svg>'; }
    return '<svg viewBox="0 0 520 380"><path class="rep-forme" d="' + CERVEAU + '"/><path class="rep-forme" d="' + CERVELET + '"/>' +
      ligne.replace('<line', '<line class="rep-coupe"') + '<text x="260" y="374" text-anchor="middle">vu de profil</text></svg>';
  }
})();
