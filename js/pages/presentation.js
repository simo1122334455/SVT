/* Présentation : diaporama de l'exposé (une idée par diapo) + mode impression pour le PDF */
(function () {
  'use strict';
  const S = window.SITE, T = window.TEXTES, D = window.DONNEES, I = S.ICONES;

  const auteur = s => { const noms = s.auteurs.split(','); return noms[0].trim().split(' ')[0] + (noms.length > 1 ? ' et al.' : ''); };
  const src = (...ids) => '<p class="diapo-source">Source' + (ids.length > 1 ? 's' : '') + ' : ' +
    ids.map(id => { const s = D.sources.find(x => x.id === id); return auteur(s) + ', ' + s.annee.slice(0, 4); }).join(' · ') + '</p>';

  function reseauStatique() {
    let s = 7, g = '';
    const r = () => (s = s * 16807 % 2147483647) / 2147483647, n = [];
    for (let i = 0; i < 18; i++) n.push([60 + (i % 6) * 110 + (r() - .5) * 50, 50 + Math.floor(i / 6) * 100 + (r() - .5) * 40]);
    for (let i = 0; i < 18; i++) for (let j = i + 1; j < 18; j++) if (Math.hypot(n[i][0] - n[j][0], n[i][1] - n[j][1]) < 170) g += '<line x1="' + n[i][0].toFixed(0) + '" y1="' + n[i][1].toFixed(0) + '" x2="' + n[j][0].toFixed(0) + '" y2="' + n[j][1].toFixed(0) + '"/>';
    return '<svg class="diapo-reseau" viewBox="0 0 700 300" aria-hidden="true">' + g + n.map(p => '<circle cx="' + p[0].toFixed(0) + '" cy="' + p[1].toFixed(0) + '" r="10"/>').join('') + '</svg>';
  }
  const cerveau = (pct, lib) => '<figure class="diapo-cerveau"><img src="assets/img/cerveau-profil.webp" alt="" style="width:' + pct + '%"><figcaption>' + lib + '</figcaption></figure>';
  const barre = (lib, v, txt) => '<div class="barre-ligne"><span>' + lib + '</span><div class="barre"><span style="width:' + v + '%"></span></div><strong>' + txt + '</strong></div>';

  // chaque diapo : { titre, html } — une seule idée, peu de texte, un grand visuel
  function diapos() {
    const gN = S.graphique({ series: [S.serie('neurones')], yMax: 25, pas: 5, yLabel: 'milliards de neurones', hauteur: 330, alt: 'Nombre de neurones du cortex : presque plat de 0 à 80 ans' });
    const gP = S.graphique({ series: [S.serie('synapses'), S.serie('grise'), S.serie('blanche'), S.serieVolume()], yMax: 100, yLabel: '% du maximum', hauteur: 330, pics: [{ debut: 1, fin: 2 }, { age: 5.9 }, { age: 28.7 }], alt: 'Synapses, substance grise, substance blanche et volume : des courbes qui montent puis descendent' });
    return [
      { cls: 'couverture', html: '<span class="surtitre">Projet de recherche · SVT</span><h1>' + T.question + '</h1><p class="diapo-sous">Ce que disent les études, de la naissance à 80 ans</p>' },
      { html: '<span class="surtitre">À vous !</span><h2>As-tu plus de neurones dans ton cortex qu\'à ta naissance ?</h2>' +
          '<div class="diapo-vote"><span>Oui, beaucoup plus</span><span>Non, moins</span><span>À peu près pareil</span></div><p class="diapo-sous">Levez la main : la réponse est à la fin.</p>' },
      { html: '<span class="surtitre">Les bases</span><h2>Ce qu\'on compte : les corps cellulaires des neurones</h2><div class="diapo-visuel">' + S.svgNeurone() + '</div>' +
          '<p class="diapo-legende">dendrites · corps cellulaire · axone · myéline · synapse</p>' },
      { html: '<span class="surtitre">À la naissance</span><p class="diapo-chiffre">19,8 milliards</p><h2>de neurones dans le cortex d\'un nouveau-né : autant qu\'un adulte</h2>' + src('larsen2006') },
      { html: '<span class="surtitre">De 0 à 3 ans</span><h2>Le nombre de neurones ne bouge pas</h2><div class="diapo-visuel">' + gN.svg + '</div>' +
          '<p class="diapo-legende">~20,7 milliards en moyenne chez 10 enfants de 0 à 3 ans, sans changement</p>' + src('kjaer2017', 'pakkenberg1997') },
      { html: '<span class="surtitre">Alors, qu\'est-ce qui grandit ?</span><h2>Le volume du cerveau double la première année</h2>' +
          '<div class="diapo-duo">' + cerveau(D.volume.points[0].valeur, 'Naissance') + '<span class="fois">×2</span>' + cerveau(D.volume.points[1].valeur, '1 an') + '</div>' +
          '<p class="diapo-legende">+101 % la 1re année : des connexions, de la myéline et des cellules de soutien</p>' + src('knickmeyer2008', 'kjaer2017') },
      { html: '<span class="surtitre">Les connexions</span><p class="diapo-chiffre">+50 %</p><h2>de densité de synapses dans la zone frontale vers 1-2 ans, par rapport à un adulte</h2>' + reseauStatique() + src('huttenlocher1979') },
      { html: '<span class="surtitre">L\'élagage</span><h2>Puis le cerveau supprime les connexions inutiles… jusqu\'à la vingtaine</h2>' +
          '<ol class="diapo-etapes"><li>trop de connexions</li><li>les inutiles sont marquées</li><li>la microglie les avale</li></ol>' + src('petanjek2011', 'paolicelli2011', 'schafer2012') },
      { html: '<span class="surtitre">La myéline</span><h2>Les câbles s\'isolent pour aller plus vite</h2><div class="barres-myeline diapo-barres">' +
          barre('Bébé', 2, 'moins de 2 %') + barre('Adolescent', 60, '~60 %') + barre('Adulte', 100, '100 %') + '</div>' +
          '<p class="diapo-legende">La substance blanche n\'atteint son maximum qu\'à 28,7 ans</p>' + src('miller2012', 'bethlehem2022') },
      { html: '<span class="surtitre">Les exceptions</span><h2>Deux petites exceptions, la première année</h2>' +
          '<div class="diapo-deux"><div><h3>Le cervelet</h3><p>fabrique encore des neurones jusque vers 11 mois</p></div><div><h3>Le lobe frontal</h3><p>reçoit encore de jeunes neurones voyageurs pendant les premiers mois</p></div></div>' + src('abraham2001', 'paredes2016') },
      { html: '<span class="surtitre">Et chez l\'adulte ?</span><h2>Dans l\'hippocampe, les scientifiques ne sont pas d\'accord</h2>' +
          '<div class="diapo-trois"><div class="non"><strong>Non</strong><span>Sorrells 2018 : aucun jeune neurone</span></div><div class="oui"><strong>Oui</strong><span>Boldrini 2018 : des milliers</span></div><div class="indice"><strong>~700 / jour</strong><span>Spalding 2013, grâce au carbone 14</span></div></div>' + src('sorrells2018', 'boldrini2018', 'spalding2013') },
      { html: '<span class="surtitre">Toute une vie</span><h2>Ce qui change vraiment : connexions, matière blanche, volume</h2><div class="diapo-visuel">' + gP.svg + '</div>' +
          '<ul class="legende">' + ['synapses', 'grise', 'blanche'].map(k => '<li style="--c:var(--d-' + k + ')">' + D.series.find(s => s.cle === k).label + '</li>').join('') + '<li style="--c:var(--d-volume)">Volume du cerveau</li></ul>' + src('huttenlocher1979', 'bethlehem2022', 'knickmeyer2008', 'courchesne2000') },
      { cls: 'conclusion-diapo', html: '<span class="surtitre">Conclusion</span><h2>Le nombre de neurones du cortex n\'augmente pas après la naissance</h2>' +
          '<p class="diapo-sous">Il est déjà d\'environ 20 milliards. Ce qui grandit : les connexions, la myéline, les cellules de soutien et le volume.</p><p class="punchline">« ' + T.t6 + ' »</p>' },
      { html: '<span class="surtitre">Quiz éclair</span><h2>Vrai ou faux ?</h2><ol class="diapo-quiz">' +
          '<li>Un bébé a beaucoup moins de neurones dans le cortex qu\'un adulte. <em>Faux</em></li>' +
          '<li>Vers 1-2 ans, la zone frontale est plus dense en synapses que chez un adulte. <em>Vrai</em></li>' +
          '<li>Le cerveau a fini de se construire à 18 ans. <em>Faux</em></li></ol>' +
          '<button type="button" class="bouton second petit diapo-reveler" data-reveler>Révéler les réponses</button>' },
      { cls: 'fin', html: '<span class="surtitre">Merci !</span><h2>Retrouvez tout le site, les sources et le quiz complet</h2>' +
          '<div class="diapo-qr"><img src="assets/img/qr-site.png" width="260" height="260" alt="QR code vers le site svt-rho.vercel.app"><p class="diapo-url">svt-rho.vercel.app</p></div>' }
    ];
  }

  S.page('presentation', {
    ambiance: 'pause',
    rendu(app, param) {
      const liste = diapos();
      if (param === 'imprimer') return imprimer(app, liste);
      let k = 0;
      app.innerHTML = '<div class="deck" data-deck>' +
        '<div class="deck-scene" data-scene aria-live="polite" aria-roledescription="diaporama">' +
          liste.map((d, i) => '<section class="diapo ' + (d.cls || '') + '" aria-roledescription="diapositive" aria-label="Diapositive ' + (i + 1) + ' sur ' + liste.length + '"' + (i ? ' hidden' : '') + '><div class="diapo-contenu">' + d.html + '</div></section>').join('') +
        '</div>' +
        '<div class="deck-barre">' +
          '<button type="button" class="bouton second petit" data-prec aria-label="Diapositive précédente">' + I.retour + '</button>' +
          '<span class="deck-num" data-num></span>' +
          '<button type="button" class="bouton petit" data-suiv aria-label="Diapositive suivante">' + I.fleche + '</button>' +
          '<button type="button" class="bouton second petit" data-plein>' + I.plein + ' Plein écran</button>' +
        '</div>' +
        '<div class="deck-progres" aria-hidden="true"><span data-progres></span></div>' +
        '</div>';

      const deck = app.querySelector('[data-deck]'), scenes = Array.from(app.querySelectorAll('.diapo'));
      const num = app.querySelector('[data-num]'), prog = app.querySelector('[data-progres]'), btPlein = app.querySelector('[data-plein]');
      function aller(i) {
        const avant = k;
        k = Math.max(0, Math.min(liste.length - 1, i));
        scenes.forEach((s, j) => { s.hidden = j !== k; s.classList.toggle('arriere', k < avant); });
        num.textContent = (k + 1) + ' / ' + liste.length;
        prog.style.transform = 'scaleX(' + ((k + 1) / liste.length) + ')';
      }
      app.querySelector('[data-prec]').addEventListener('click', () => aller(k - 1));
      app.querySelector('[data-suiv]').addEventListener('click', () => aller(k + 1));
      app.querySelector('[data-scene]').addEventListener('click', e => { if (!e.target.closest('button, a')) aller(k + 1); });
      app.querySelectorAll('[data-reveler]').forEach(b => b.addEventListener('click', () => { b.closest('.diapo').classList.add('revele'); b.hidden = true; }));
      btPlein.addEventListener('click', () => document.fullscreenElement ? document.exitFullscreen() : deck.requestFullscreen && deck.requestFullscreen());
      function etatPlein() { btPlein.innerHTML = I.plein + (document.fullscreenElement ? ' Quitter' : ' Plein écran'); }
      function clavier(e) {
        if (S.cible(e, 'input') || e.ctrlKey || e.metaKey || e.altKey) return;
        if ((e.key === ' ' || e.key === 'Enter') && S.cible(e, 'button, a')) return;   // le bouton fait déjà son travail
        if (['ArrowRight', 'PageDown', ' ', 'Enter'].includes(e.key)) { e.preventDefault(); aller(k + 1); }
        else if (['ArrowLeft', 'PageUp', 'Backspace'].includes(e.key)) { e.preventDefault(); aller(k - 1); }
        else if (e.key === 'Home') aller(0);
        else if (e.key === 'End') aller(liste.length - 1);
        else if (e.key.toLowerCase() === 'f') btPlein.click();
      }
      document.addEventListener('keydown', clavier);
      document.addEventListener('fullscreenchange', etatPlein);
      S.quitte(() => { document.removeEventListener('keydown', clavier); document.removeEventListener('fullscreenchange', etatPlein); if (document.fullscreenElement) document.exitFullscreen(); });
      aller(0);
    }
  });

  // toutes les diapos à la suite, une par page, pour l'export PDF
  function imprimer(app, liste) {
    document.body.classList.add('impression');
    S.quitte(() => document.body.classList.remove('impression'));
    app.innerHTML = '<div class="impression-pile">' + liste.map((d, i) =>
      '<section class="diapo revele ' + (d.cls || '') + '"><div class="diapo-contenu">' + d.html + '</div><span class="diapo-page">' + (i + 1) + ' / ' + liste.length + '</span></section>').join('') + '</div>';
    app.querySelectorAll('[data-reveler]').forEach(b => b.remove());
  }
})();
