/* Mythes ou réalité : on parie « vrai » ou « faux », puis la carte se retourne */
(function () {
  'use strict';
  const S = window.SITE;
  const LIB = { vrai: 'Vrai', faux: 'Faux', nuance: 'Plus subtil', debat: 'En débat' };

  S.page('mythes', {
    rendu(app) {
      const M = window.MYTHES;
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Pour aller plus loin', 'Mythes ou réalité ?',
          "Huit idées qu'on entend souvent sur le cerveau. Pour chacune, parie : vrai ou faux ? La carte se retourne et donne la réponse, avec sa source.") +
        '<p class="score-mythes" aria-live="polite" data-score>Aucune carte retournée pour l\'instant.</p>' +
        '<div class="grille grille-2 mythes">' +
        M.map((m, i) =>
          '<article class="mythe" data-i="' + i + '">' +
            '<div class="mythe-face recto">' +
              '<span class="surtitre">Idée reçue n° ' + (i + 1) + '</span>' +
              '<p class="mythe-phrase">« ' + m.m + ' »</p>' +
              '<div class="rangee" role="group" aria-label="Ton pari"><button type="button" class="choix" data-pari="vrai">Vrai</button><button type="button" class="choix" data-pari="faux">Faux</button></div>' +
            '</div>' +
            '<div class="mythe-face verso" hidden>' +
              '<span class="verdict v-' + m.v + '">' + m.titre + '</span>' +
              '<p class="mythe-retour" data-retour></p>' +
              '<p>' + S.riche(m.e) + '</p>' +
              '<button type="button" class="bouton second petit" data-retourner>Retourner la carte</button>' +
            '</div>' +
          '</article>').join('') +
        '</div>' +
        S.filRouge("Le mythe « on naît avec tous nos neurones » est le plus proche de notre question : presque vrai pour le cortex, mais pas pour le cervelet pendant la première année. Teste maintenant tout ce que tu as appris.", 'quiz') +
        '</div>';

      let justes = 0, comptees = 0;
      const score = app.querySelector('[data-score]');
      app.querySelectorAll('.mythe').forEach(carte => {
        const m = M[+carte.dataset.i];
        const recto = carte.querySelector('.recto'), verso = carte.querySelector('.verso');
        let deja = false;
        function retourner(versVerso) {
          carte.classList.toggle('retournee', versVerso);
          recto.hidden = versVerso; verso.hidden = !versVerso;
          (versVerso ? verso.querySelector('[data-retourner]') : recto.querySelector('.choix')).focus({ preventScroll: true });
        }
        carte.querySelectorAll('[data-pari]').forEach(b => b.addEventListener('click', () => {
          const pari = b.dataset.pari, net = m.v === 'vrai' || m.v === 'faux';
          const retour = carte.querySelector('[data-retour]');
          if (!net) retour.textContent = 'Piège ! Ni tout à fait vrai, ni tout à fait faux.';
          else if (pari === m.v) retour.textContent = 'Bien vu !';
          else retour.textContent = 'Raté : la réponse était « ' + LIB[m.v] + ' ».';
          retour.className = 'mythe-retour ' + (!net ? 'nuance' : pari === m.v ? 'bon' : 'rate');
          if (!deja && net) { comptees++; if (pari === m.v) justes++; }
          deja = true;
          score.textContent = comptees ? 'Tu as vu juste ' + justes + ' fois sur ' + comptees + ' (les cartes « plus subtil » ou « en débat » ne comptent pas).' : 'Les cartes « plus subtil » ou « en débat » ne comptent pas dans le score.';
          retourner(true);
        }));
        carte.querySelector('[data-retourner]').addEventListener('click', () => retourner(false));
      });
    }
  });
})();
