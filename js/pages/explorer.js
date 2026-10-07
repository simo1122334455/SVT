/* Explorer : un curseur d'âge (0 → 80 ans) pilote le cerveau, les jauges et les graphiques */
(function () {
  'use strict';
  const S = window.SITE, D = window.DONNEES, I = S.ICONES;

  // une phrase par âge, uniquement avec des faits sourcés
  const A_CET_AGE = {
    0: "Le stock de neurones du cortex est déjà là : environ 19,8 milliards {larsen2006}. La myéline, elle, commence à peine {miller2012}.",
    0.25: "Dans la zone de l'audition, les connexions sont déjà à leur maximum ; dans la zone frontale, pas encore {huttenlocher1997}.",
    1: "Le volume du cerveau a doublé depuis la naissance {knickmeyer2008}, et la densité de synapses de la zone frontale atteint son maximum {huttenlocher1997}.",
    3: "Le nombre de neurones n'a pas bougé depuis la naissance, mais les cellules de soutien ont nettement augmenté {kjaer2017}.",
    6: "La substance grise atteint son maximum, vers 5,9 ans {bethlehem2022}.",
    12: "La puberté approche : le grand ménage des synapses commence {petanjek2011}.",
    20: "L'élagage de la zone frontale continue pendant toute la vingtaine {petanjek2011}.",
    30: "La substance blanche atteint son maximum, vers 28,7 ans {bethlehem2022} : le cerveau a fini de se construire.",
    50: "Le nombre de neurones du cortex baisse très lentement {pakkenberg1997}.",
    80: "Entre 20 et 90 ans, on perd environ 10 % des neurones du cortex — pas la moitié {pakkenberg1997}."
  };
  const JAUGES = [
    { cle: 'neurones', max: 25, unite: ' milliards' },
    { cle: 'synapses', max: 100, unite: ' %' },
    { cle: 'grise', max: 100, unite: ' %' },
    { cle: 'blanche', max: 100, unite: ' %' }
  ];

  S.page('explorer', {
    rendu(app) {
      const P = D.points;
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Les données', 'Explorer de 0 à 80 ans',
          "Fais glisser le curseur, ou appuie sur Lecture : le cerveau grandit, les connexions explosent puis diminuent… mais regarde bien la ligne des neurones.") +
        '<section class="carte explorateur">' +
          '<div class="age-zone">' +
            '<div class="age-affiche" aria-live="polite"><span data-age-lib>Naissance</span></div>' +
            '<div class="rangee age-commandes"><button type="button" class="bouton second petit" data-lecture>▶ Lecture</button></div>' +
            '<label class="sr" for="age-curseur">Âge</label>' +
            '<input id="age-curseur" class="curseur" type="range" min="0" max="' + (P.length - 1) + '" step="1" value="0" style="--p:0">' +
            '<div class="graduations" aria-hidden="true">' + P.map((p, i) => '<button type="button" tabindex="-1" data-i="' + i + '" style="left:calc(.95rem + (100% - 1.9rem) * ' + (i / (P.length - 1)).toFixed(4) + ')">' + p.label_court + '</button>').join('') + '</div>' +
          '</div>' +
          '<div class="explorer-corps">' +
            '<figure class="cerveau-age">' +
              '<div class="cerveau-cadre"><img class="cerveau-max" src="assets/img/cerveau-profil.webp" width="840" height="674" alt="">' +
              '<img data-cerveau src="assets/img/cerveau-profil.webp" width="840" height="674" alt="Cerveau humain vu de profil, à l\'échelle de son volume à cet âge"></div>' +
              '<figcaption data-volume></figcaption>' +
            '</figure>' +
            '<div class="jauges" data-jauges></div>' +
          '</div>' +
          '<p class="a-cet-age" data-texte aria-live="polite"></p>' +
        '</section>' +

        '<section class="section apparait" aria-labelledby="t-graph">' +
          '<h2 id="t-graph">Toute une vie en deux graphiques</h2>' +
          '<p class="chapeau">Chaque point vient du fichier de données et porte sa source. Les points creux sont des estimations ; les barres verticales, des fourchettes.</p>' +
          '<div class="grille graphs">' +
            '<figure class="carte"><figcaption><h3>Neurones du cortex</h3></figcaption><div data-g1></div>' +
              '<p class="discret note-plate">Les petites différences (19,8 → 22) viennent d\'études différentes sur des personnes différentes, pas d\'une vraie augmentation.</p></figure>' +
            '<figure class="carte"><figcaption><h3>Ce qui change vraiment</h3></figcaption><div data-g2></div>' +
              '<ul class="legende">' + ['synapses', 'grise', 'blanche'].map(k => '<li style="--c:var(--d-' + k + ')">' + D.series.find(s => s.cle === k).label + '</li>').join('') +
              '<li style="--c:var(--d-volume)">' + D.volume.label + '</li></ul></figure>' +
          '</div>' +
        '</section>' +
        S.filRouge("Sur toute la vie, la ligne des neurones reste presque plate : ce sont les connexions, la myéline et le volume du cerveau qui bougent. La réponse détaillée, étape par étape :", 'reponse') +
        '</div>';

      // graphiques
      const g1 = S.graphique({ series: [S.serie('neurones')], yMax: 25, pas: 5, yLabel: 'milliards', hauteur: 340,
        alt: 'Nombre de neurones du cortex de 0 à 80 ans : une ligne presque plate autour de 20 milliards' });
      const g2 = S.graphique({ series: [S.serie('synapses'), S.serie('grise'), S.serie('blanche'), S.serieVolume()], yMax: 100, yLabel: '% du maximum', hauteur: 340,
        pics: [{ debut: 1, fin: 2 }, { age: 5.9 }, { age: 28.7 }],
        alt: 'Densité de synapses, substance grise, substance blanche et volume du cerveau en pourcentage de leur maximum, de 0 à 80 ans' });
      const z1 = app.querySelector('[data-g1]'), z2 = app.querySelector('[data-g2]');
      z1.innerHTML = g1.svg; z2.innerHTML = g2.svg;

      const curseur = app.querySelector('#age-curseur');
      const jauges = app.querySelector('[data-jauges]');
      const img = app.querySelector('[data-cerveau]');
      const vol = app.querySelector('[data-volume]');
      const texte = app.querySelector('[data-texte]');
      const libAge = app.querySelector('[data-age-lib]');
      const grads = Array.from(app.querySelectorAll('.graduations button'));

      function volumeProche(age) {
        return D.volume.points.reduce((m, p) => Math.abs(p.age - age) < Math.abs(m.age - age) ? p : m);
      }
      function aller(i) {
        const p = P[i];
        curseur.value = i; curseur.style.setProperty('--p', i / (P.length - 1));
        grads.forEach((b, j) => b.classList.toggle('actif', j === i));
        libAge.textContent = p.label;
        const v = volumeProche(p.age);
        img.style.transform = 'scale(' + (v.valeur / 100).toFixed(3) + ')';
        vol.innerHTML = '<strong>Volume du cerveau : ~' + v.valeur + ' % du maximum</strong> <span class="discret">(silhouette pâle : taille maximale ; valeur ' + (v.age === p.age ? 'à cet âge' : 'la plus proche : ' + v.label) + ')</span> ' + D.volume.src.map(S.cite).join('');
        jauges.innerHTML = JAUGES.map(j => {
          const s = D.series.find(x => x.cle === j.cle), c = p[j.cle];
          const v2 = c.range ? c.range[1] : c.valeur;
          return '<div class="jauge" style="--c:var(--d-' + j.cle + ')">' +
            '<div class="jauge-tete"><span>' + s.label + '</span><strong>' + S.valeur(c, j.unite) + '</strong></div>' +
            '<div class="jauge-barre"><span style="width:' + (v2 / j.max * 100).toFixed(1) + '%"></span>' +
              (c.range ? '<span class="fourchette" style="left:' + (c.range[0] / j.max * 100) + '%;width:' + ((c.range[1] - c.range[0]) / j.max * 100) + '%"></span>' : '') + '</div>' +
            '<p class="jauge-note"><span class="methode">' + c.method + (c.estimation ? ' · estimation' : '') + '</span> — ' + c.note + ' ' + (c.src || []).map(S.cite).join('') + '</p>' +
            '</div>';
        }).join('');
        texte.innerHTML = S.riche(A_CET_AGE[p.age]);
        g1.curseur(z1, p.age); g2.curseur(z2, p.age);
      }
      curseur.addEventListener('input', () => { arreter(); aller(+curseur.value); });
      grads.forEach(b => b.addEventListener('click', () => { arreter(); aller(+b.dataset.i); }));
      app.querySelectorAll('.g-cible').forEach(c => c.addEventListener('click', () => {
        arreter(); aller(P.findIndex(p => p.age === +c.dataset.age) >= 0 ? P.findIndex(p => p.age === +c.dataset.age) : +curseur.value);
        curseur.scrollIntoView({ block: 'center', behavior: S.reduit() ? 'auto' : 'smooth' });
      }));

      // lecture automatique de tous les âges
      const btLecture = app.querySelector('[data-lecture]');
      let lecture = null;
      function arreter() { if (lecture) { clearInterval(lecture); lecture = null; btLecture.textContent = '▶ Lecture'; } }
      btLecture.addEventListener('click', () => {
        if (lecture) return arreter();
        if (+curseur.value >= P.length - 1) aller(0);
        btLecture.textContent = '❚❚ Pause';
        lecture = setInterval(() => { const i = +curseur.value + 1; if (i >= P.length) arreter(); else aller(i); }, 1800);
      });
      S.quitte(arreter);
      aller(0);
    }
  });
})();
