/* Accueil : la question, la réponse courte, le vote et toutes les sections */
(function () {
  'use strict';
  const S = window.SITE, T = window.TEXTES, I = S.ICONES;

  const SECTIONS = [
    { id: 'neurone', i: 'neurone', d: "Touche chaque partie d'un neurone pour comprendre ce qu'on compte." },
    { id: 'explorer', i: 'curseur', d: "Fais glisser l'âge de 0 à 80 ans et regarde ce qui change… ou pas." },
    { id: 'reponse', i: 'reponse', d: 'La réponse complète, étape par étape, avec les sources.' },
    { id: 'simulation', i: 'eclair', d: "Déclenche un neurone et suis le message jusqu'au suivant." },
    { id: 'mythes', i: 'cartes', d: 'Huit idées reçues sur le cerveau : vraies ou fausses ?' },
    { id: 'quiz', i: 'quiz', d: 'Dix questions pour vérifier, seul ou avec toute la classe.' },
    { id: 'coupe', i: 'coupe', d: 'Fais défiler de vraies IRM et repère les régions du cerveau.' },
    { id: 'lexique', i: 'livre', d: 'Tous les mots scientifiques du site, expliqués simplement.' },
    { id: 'presentation', i: 'ecran', d: 'Le diaporama de notre exposé, à suivre en classe.' },
    { id: 'sources', i: 'source', d: 'Toutes les études utilisées, avec leurs liens.' }
  ];
  const VOTES = [
    { v: 'plus', t: 'Oui, beaucoup plus' },
    { v: 'moins', t: 'Non, moins' },
    { v: 'pareil', t: 'À peu près pareil' }
  ];
  function lireVote() { try { return sessionStorage.getItem('vote'); } catch (e) { return null; } }

  S.page('accueil', {
    rendu(app) {
      const vote = lireVote();
      app.innerHTML =
        '<section class="hero conteneur">' +
          '<div class="hero-texte">' +
            '<span class="surtitre">Projet de recherche · SVT</span>' +
            '<h1>' + T.question + '</h1>' +
            '<div class="reponse-courte carte mise-en-avant"><span class="surtitre">La réponse courte</span><p>' + S.riche(T.reponseCourte) + '</p></div>' +
            '<div class="rangee">' +
              '<a class="bouton" href="#/reponse">Lire la réponse complète ' + I.fleche + '</a>' +
              '<a class="bouton second" href="#/explorer">Explorer de 0 à 80 ans</a>' +
            '</div>' +
          '</div>' +
          '<div class="hero-visuel" aria-hidden="true">' + neuroneAnime() + '</div>' +
        '</section>' +

        '<section class="section conteneur apparait">' +
          '<div class="carte vote"><div><span class="surtitre">Avant de commencer</span>' +
            '<h2>À ton avis : as-tu plus de neurones dans ton cortex qu\'à ta naissance ?</h2></div>' +
            '<div class="rangee" role="group" aria-label="Ton avis">' +
              VOTES.map(o => '<button type="button" class="choix" data-v="' + o.v + '" aria-pressed="' + (vote === o.v) + '">' + o.t + '</button>').join('') +
            '</div><p class="discret" aria-live="polite" data-message>' + (vote ? 'Réponse enregistrée : on la révèle à la fin de La réponse.' : 'Choisis une réponse : on la révèle à la fin de La réponse.') + '</p></div>' +
        '</section>' +

        '<section class="section conteneur apparait" aria-labelledby="t-parcours">' +
          '<h2 id="t-parcours">Le parcours</h2>' +
          '<ol class="parcours">' +
            '<li class="ici"><span>1</span><strong>La question</strong><em>Vous êtes ici</em></li>' +
            '<li><a href="#/neurone"><span>2</span><strong>Les bases</strong><em>Le neurone</em></a></li>' +
            '<li><a href="#/explorer"><span>3</span><strong>Les données</strong><em>Explorer de 0 à 80 ans</em></a></li>' +
            '<li><a href="#/reponse"><span>4</span><strong>La réponse</strong><em>et la conclusion</em></a></li>' +
          '</ol>' +
        '</section>' +

        '<section class="section conteneur apparait" aria-labelledby="t-sections">' +
          '<h2 id="t-sections">Toutes les sections</h2>' +
          '<div class="grille grille-3 cartes-sections">' +
            SECTIONS.map(s => '<a class="carte" href="#/' + s.id + '"><span class="icone">' + I[s.i] + '</span><h3>' + S.titrePage(s.id) + '</h3><p class="discret">' + s.d + '</p></a>').join('') +
          '</div>' +
        '</section>';

      const msg = app.querySelector('[data-message]');
      app.querySelectorAll('.choix').forEach(b => b.addEventListener('click', () => {
        try { sessionStorage.setItem('vote', b.dataset.v); } catch (e) { /* pas de stockage : le vote reste pour cette page */ }
        app.querySelectorAll('.choix').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
        msg.textContent = 'Réponse enregistrée : on la révèle à la fin de La réponse.';
      }));
    }
  });

  // illustration : deux neurones reliés, un signal passe de l'un à l'autre
  function neuroneAnime() {
    return '<svg viewBox="0 0 420 420" class="neurone-anime">' +
      '<g class="nn-ligne">' +
        '<path d="M120 150 C90 110 80 80 50 60 M110 170 C70 168 50 150 24 160 M128 196 C100 230 90 262 60 282 M150 132 C150 96 162 70 150 36"/>' +
        '<path id="axone-hero" d="M162 176 C220 200 250 240 300 262"/>' +
        '<path d="M300 262 C320 262 330 240 350 232 M300 262 C326 270 336 286 356 298 M300 262 C306 290 300 312 310 336"/>' +
        '<path d="M372 226 C392 210 404 186 410 160 M374 306 C396 320 404 344 408 372"/>' +
      '</g>' +
      '<circle class="nn-corps" cx="142" cy="166" r="30"/><circle class="nn-noyau" cx="139" cy="163" r="11"/>' +
      '<circle class="nn-corps petit" cx="366" cy="264" r="20"/>' +
      '<circle class="nn-signal" r="8"><animateMotion dur="2.6s" repeatCount="indefinite"><mpath href="#axone-hero"/></animateMotion></circle>' +
      '</svg>';
  }
})();
