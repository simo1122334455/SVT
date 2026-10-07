/* Sources : toutes les références, numérotées comme les renvois [n] du site */
(function () {
  'use strict';
  const S = window.SITE, D = window.DONNEES;

  const IMAGES = [
    { t: 'Santiago Ramón y Cajal, cellules de Purkinje du cervelet (vers 1899) — domaine public', u: 'https://commons.wikimedia.org/wiki/File:PurkinjeCell.jpg' },
    { t: "IRM 7 teslas d'un cerveau humain ex vivo, résolution 100 µm (Edlow B.L. et al., 2019) — CC0, domaine public", u: 'https://commons.wikimedia.org/wiki/File:7_Tesla_MRI_of_the_ex_vivo_human_brain_at_100_micron_resolution_(100_micron_MRI_acquired_FA25_sagittal).webm' },
    { t: 'Cerveau humain de profil, illustration NIH BioArt n° 60 — domaine public', u: 'https://commons.wikimedia.org/wiki/File:Brain_Lateral_(NIH_BioArt_60).png' }
  ];

  S.page('sources', {
    ambiance: 'calme',
    rendu(app, param) {
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Sources', 'Toutes nos références',
          "Chaque chiffre du site renvoie ici par un petit numéro entre crochets. Les valeurs du graphique viennent du fichier donnees_cerveau.json, qui précise pour chacune comment elle a été obtenue.") +
        '<ol class="sources">' + D.sources.map((s, i) =>
          '<li id="src-' + s.id + '"><span class="src-num">' + (i + 1) + '</span><div>' +
            '<p class="src-ref"><strong>' + s.auteurs + '</strong> (' + s.annee + '). <cite>' + s.titre + '</cite>. ' + s.revue + '.</p>' +
            '<p class="src-pour">Utilisée pour : ' + s.pour + '.</p>' +
            '<a href="' + s.url + '" target="_blank" rel="noopener">Lire l\'étude <span class="sr">(nouvel onglet)</span>↗</a>' +
          '</div></li>').join('') + '</ol>' +
        '<section class="section"><h2>Images</h2><ul class="credits">' + IMAGES.map(im =>
          '<li>' + im.t + ' — <a href="' + im.u + '" target="_blank" rel="noopener">voir l\'original<span class="sr"> (nouvel onglet)</span></a></li>').join('') + '</ul>' +
          '<h2>Polices</h2><p class="discret">Space Grotesk et Atkinson Hyperlegible, sous licence libre SIL Open Font License (fichiers inclus dans assets/fonts).</p></section>' +
        '</div>';
      if (param) {
        const li = document.getElementById('src-' + param);
        if (li) setTimeout(() => { li.scrollIntoView({ block: 'center' }); li.classList.add('eclaire'); }, 60);
      }
    }
  });
})();
