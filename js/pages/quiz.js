/* Quiz : 10 questions, en solo (correction immédiate) ou en mode classe (vote à main levée) */
(function () {
  'use strict';
  const S = window.SITE, I = S.ICONES;
  const LETTRES = ['A', 'B', 'C', 'D'];

  S.page('quiz', {
    rendu(app) {
      const Q = window.QUIZ;
      let mode = 'solo', i = 0, score = 0, repondu = false;
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Pour aller plus loin', 'Quiz',
          "Dix questions sur tout le site. En solo, tu as la correction tout de suite. En mode classe, chacun vote à main levée (A, B, C ou D) avant qu'on révèle la réponse.") +
        '<div class="onglets" role="tablist" aria-label="Mode de jeu">' +
          '<button type="button" role="tab" aria-selected="true" data-mode="solo">Solo</button>' +
          '<button type="button" role="tab" aria-selected="false" data-mode="classe">Mode classe</button>' +
        '</div>' +
        '<section class="carte quiz" data-quiz aria-live="polite"></section>' +
        '<p class="discret aide-clavier">Au clavier : touches A, B, C, D pour répondre, Entrée pour continuer.</p>' +
        S.filRouge("Le quiz revient sur l'essentiel : le nombre de neurones du cortex ne change presque pas après la naissance, ce sont les connexions, la myéline et le volume qui changent. Dernière visite : de vraies IRM du cerveau.", 'coupe') +
        '</div>';
      const zone = app.querySelector('[data-quiz]');

      function question() {
        const q = Q[i]; repondu = false;
        zone.classList.toggle('classe', mode === 'classe');
        zone.innerHTML = '<div class="quiz-tete"><span class="surtitre">Question ' + (i + 1) + ' / ' + Q.length + '</span>' +
          (mode === 'solo' ? '<span class="puce">Score : ' + score + '</span>' : '') + '</div>' +
          '<div class="quiz-progres" aria-hidden="true"><span style="width:' + (i / Q.length * 100) + '%"></span></div>' +
          '<h2 class="quiz-question">' + q.q + '</h2>' +
          '<div class="quiz-choix">' + q.r.map((r, j) => '<button type="button" class="reponse" data-j="' + j + '"><span class="lettre">' + LETTRES[j] + '</span>' + r + '</button>').join('') + '</div>' +
          '<div class="quiz-bas" data-bas>' + (mode === 'classe' ? '<button type="button" class="bouton" data-reveler>Révéler la réponse</button>' : '') + '</div>';
        zone.querySelectorAll('.reponse').forEach(b => b.addEventListener('click', () => mode === 'solo' ? repondre(+b.dataset.j) : choisirClasse(b)));
        const rev = zone.querySelector('[data-reveler]');
        if (rev) rev.addEventListener('click', () => repondre(null));
      }
      function choisirClasse(b) {
        if (repondu) return;
        zone.querySelectorAll('.reponse').forEach(o => o.classList.toggle('choisie', o === b));
      }
      function repondre(j) {
        if (repondu) return;
        repondu = true;
        const q = Q[i], juste = j === q.ok;
        if (mode === 'solo' && juste) score++;
        zone.querySelectorAll('.reponse').forEach((b, k) => {
          b.disabled = true;
          if (k === q.ok) b.classList.add('bonne');
          else if (k === j) b.classList.add('fausse');
        });
        const verdict = mode === 'solo' ? (juste ? '<strong class="bon">Bonne réponse !</strong> ' : '<strong class="rate">Raté.</strong> ') : '<strong>Réponse ' + LETTRES[q.ok] + '.</strong> ';
        zone.querySelector('[data-bas]').innerHTML = '<p class="quiz-explication">' + verdict + S.riche(q.e) + '</p>' +
          '<button type="button" class="bouton" data-suivant>' + (i < Q.length - 1 ? 'Question suivante ' + I.fleche : 'Voir le résultat') + '</button>';
        const suiv = zone.querySelector('[data-suivant]');
        suiv.addEventListener('click', suivant);
        suiv.focus({ preventScroll: true });
      }
      function suivant() { i++; i < Q.length ? question() : fin(); }
      function fin() {
        const msg = mode === 'classe' ? 'Bravo à toute la classe !'
          : score >= 9 ? 'Excellent : tu pourrais faire l\'exposé à notre place !' : score >= 6 ? 'Très bien : l\'essentiel est compris.' : 'Le cerveau réserve des surprises : relis La réponse et retente !';
        zone.innerHTML = '<div class="quiz-fin">' + (mode === 'solo' ? '<p class="chiffre">' + score + ' / ' + Q.length + '</p>' : '') +
          '<h2>' + msg + '</h2><div class="rangee"><button type="button" class="bouton" data-rejouer>Rejouer</button><a class="bouton second" href="#/reponse">Revoir la réponse</a></div></div>';
        zone.querySelector('[data-rejouer]').addEventListener('click', () => { i = 0; score = 0; question(); });
      }
      app.querySelectorAll('[data-mode]').forEach(b => b.addEventListener('click', () => {
        mode = b.dataset.mode; i = 0; score = 0;
        app.querySelectorAll('[data-mode]').forEach(o => o.setAttribute('aria-selected', String(o === b)));
        question();
      }));
      // raccourcis clavier
      function clavier(e) {
        if (S.cible(e, 'input, textarea') || e.ctrlKey || e.metaKey || e.altKey) return;
        const k = e.key.toUpperCase(), j = LETTRES.indexOf(k);
        if (j >= 0 && !repondu) { const b = zone.querySelectorAll('.reponse')[j]; if (b) { e.preventDefault(); b.click(); } }
        else if (e.key === 'Enter' && repondu && !S.cible(e, 'button, a')) { const s = zone.querySelector('[data-suivant]'); if (s) s.click(); }
      }
      document.addEventListener('keydown', clavier);
      S.quitte(() => document.removeEventListener('keydown', clavier));
      question();
    }
  });
})();
