/* Lexique : tous les mots, recherche instantanée, lien direct vers chaque mot */
(function () {
  'use strict';
  const S = window.SITE;
  const sansAccents = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  S.page('lexique', {
    ambiance: 'calme',
    rendu(app, param) {
      const L = window.LEXIQUE, F = window.LEXIQUE_FAMILLES;
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Lexique', 'Les mots scientifiques',
          "Tous les mots compliqués du site, expliqués simplement. Partout ailleurs, les mots soulignés en pointillés ouvrent directement leur définition.") +
        '<div class="recherche"><label for="recherche-lexique">Chercher un mot</label>' +
          '<input id="recherche-lexique" type="search" placeholder="Par exemple : synapse, myéline…" autocomplete="off">' +
          '<p class="discret" aria-live="polite" data-nb>' + L.length + ' mots</p></div>' +
        F.map(f => '<section class="famille" data-fam="' + f.k + '"><h2>' + f.t + '</h2><div class="grille grille-3">' +
          L.filter(m => m.fam === f.k).map(m => '<article class="carte mot" id="mot-' + m.id + '" data-texte="' + S.echappe(sansAccents(m.mot + ' ' + m.def)) + '">' +
            '<h3>' + m.mot + '</h3><p>' + m.def + '</p><p class="mot-ou">Sur le site : ' + m.ou + '</p></article>').join('') +
          '</div></section>').join('') +
        '<p class="vide discret" hidden data-vide>Aucun mot ne correspond. Essaie un autre mot, ou regarde la liste complète.</p>' +
        '</div>';

      const champ = app.querySelector('#recherche-lexique'), nb = app.querySelector('[data-nb]'), vide = app.querySelector('[data-vide]');
      champ.addEventListener('input', () => {
        const q = sansAccents(champ.value.trim());
        let total = 0;
        app.querySelectorAll('.famille').forEach(sec => {
          let n = 0;
          sec.querySelectorAll('.mot').forEach(c => { const ok = !q || c.dataset.texte.includes(q); c.hidden = !ok; if (ok) n++; });
          sec.hidden = n === 0; total += n;
        });
        nb.textContent = total + (total > 1 ? ' mots' : ' mot');
        vide.hidden = total > 0;
      });
      if (param) {
        const c = document.getElementById('mot-' + param);
        if (c) setTimeout(() => { c.scrollIntoView({ block: 'center' }); c.classList.add('eclaire'); }, 60);
      }
    }
  });
})();
