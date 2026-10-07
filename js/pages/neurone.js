/* Le neurone : schéma interactif + le vrai dessin de Cajal */
(function () {
  'use strict';
  const S = window.SITE, I = S.ICONES;

  S.page('neurone', {
    rendu(app) {
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Les bases', 'Le neurone',
          "Avant de compter les neurones, il faut savoir à quoi ils ressemblent. Touche chaque partie du schéma (ou choisis-la dans la liste) pour découvrir son rôle.") +
        '<section class="carte schema-zone">' +
          '<div class="schema-visuel">' + S.svgNeurone() + '</div>' +
          '<div class="schema-panneau">' +
            '<div class="liste-parties" role="group" aria-label="Parties du neurone">' +
              S.PARTIES.map((p, i) => '<button type="button" class="choix" data-i="' + i + '" aria-pressed="false">' + (i + 1) + '. ' + p.lab + '</button>').join('') +
            '</div>' +
            '<div class="info-partie" aria-live="polite"></div>' +
            '<div class="rangee"><button type="button" class="bouton second petit" data-pas="-1">' + I.retour + ' Précédente</button>' +
            '<button type="button" class="bouton petit" data-pas="1">Suivante ' + I.fleche + '</button></div>' +
          '</div>' +
        '</section>' +

        '<section class="section apparait" aria-labelledby="t-vrai">' +
          '<div class="grille grille-2 aligne-centre">' +
            '<div class="pile"><span class="surtitre">Comme en vrai</span><h2 id="t-vrai">Des neurones dessinés il y a plus de cent ans</h2>' +
              '<p>Vers 1899, Santiago Ramón y Cajal a observé des neurones au microscope grâce à la ' + S.terme('golgi', 'coloration de Golgi') + ', qui teint en noir une cellule entière. Il les a dessinés à la main. Touche les points numérotés.</p></div>' +
            '<div data-cajal></div>' +
          '</div>' +
        '</section>' +
        S.filRouge("Pour savoir si le nombre de neurones augmente, on compte les [[corps|corps cellulaires]]. Mais un neurone peut gagner des dendrites, des synapses et de la myéline sans qu'on en ajoute un seul. Voyons ce qui change vraiment avec l'âge.", 'explorer') +
        '</div>';

      // schéma : sélection d'une partie
      const svg = app.querySelector('.schema-neurone');
      const groupes = Array.from(svg.querySelectorAll('.partie'));
      const boutons = Array.from(app.querySelectorAll('.liste-parties .choix'));
      const info = app.querySelector('.info-partie');
      let actuelle = -1;
      function choisir(i) {
        actuelle = (i + S.PARTIES.length) % S.PARTIES.length;
        const p = S.PARTIES[actuelle];
        groupes.forEach(g => g.classList.toggle('actif', g.dataset.p === p.id));
        svg.classList.add('selection');
        boutons.forEach((b, j) => b.setAttribute('aria-pressed', String(j === actuelle)));
        info.innerHTML = '<h3>' + p.lab + '</h3><p>' + S.riche(p.def) + '</p>';
      }
      groupes.forEach(g => {
        const i = S.PARTIES.findIndex(p => p.id === g.dataset.p);
        g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button'); g.setAttribute('aria-label', S.PARTIES[i].lab);
        g.addEventListener('click', () => choisir(i));
        g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choisir(i); } });
      });
      boutons.forEach((b, i) => b.addEventListener('click', () => choisir(i)));
      app.querySelectorAll('[data-pas]').forEach(b => b.addEventListener('click', () => choisir(actuelle + +b.dataset.pas)));
      choisir(0);

      // dessin de Cajal avec points
      S.imagePoints(app.querySelector('[data-cajal]'), {
        src: 'assets/img/cajal-purkinje.webp', largeur: 620, hauteur: 726,
        alt: 'Dessin à l\'encre de deux neurones par Santiago Ramón y Cajal : de grands arbres de branches au-dessus de deux corps noirs, avec un long fil qui descend',
        credit: 'Santiago Ramón y Cajal, cellules de Purkinje du cervelet, vers 1899 — domaine public.',
        points: [
          { x: 50, y: 17, lab: 'Dendrites', terme: 'dendrite', def: "L'immense arbre de branches du haut : il reçoit les messages de milliers d'autres neurones." },
          { x: 42, y: 56, lab: 'Corps cellulaire', terme: 'corps', def: "La tache noire, avec le noyau. C'est elle qu'on compte quand on dit « 19,8 milliards de neurones »." },
          { x: 47, y: 88, lab: 'Axone', terme: 'axone', def: "Le long fil fin qui descend : il part seul du corps cellulaire et porte le message plus loin." }
        ]
      });
    }
  });
})();
