/* Simulation : déclencher un neurone, suivre le message jusqu'au suivant */
(function () {
  'use strict';
  const S = window.SITE, I = S.ICONES;

  const ETAPES = [
    "1. Les [[dendrite|dendrites]] reçoivent des messages d'autres neurones.",
    "2. Le [[corps|corps cellulaire]] additionne tout : c'est assez fort, il envoie le sien.",
    "3. L'[[influx|influx nerveux]] parcourt l'[[axone|axone]].",
    "4. À la [[synapse|synapse]], des [[neurotransmetteur|neurotransmetteurs]] traversent le petit espace.",
    "5. Le neurone suivant reçoit le message et peut, à son tour, l'envoyer plus loin."
  ];
  const X0 = 270, X1 = 770, NOEUDS = [270, 362, 454, 546, 638, 730, 770];

  S.page('simulation', {
    rendu(app) {
      app.innerHTML = '<div class="page conteneur">' +
        S.entete('Pour aller plus loin', 'Simulation : un message passe',
          "Les neurones ne servent à rien seuls : ils se passent des messages. Déclenche le premier neurone et suis le message jusqu'au suivant.") +
        '<section class="carte sim">' +
          '<div class="sim-scene">' + scene() + '</div>' +
          '<div class="sim-commandes rangee">' +
            '<button type="button" class="bouton" data-go>' + I.eclair + ' Déclencher un message</button>' +
            '<label class="interrupteur"><input type="checkbox" data-myeline checked> <span>Avec myéline</span></label>' +
          '</div>' +
          '<ol class="sim-etapes" aria-live="polite">' + ETAPES.map(e => '<li>' + S.riche(e) + '</li>').join('') + '</ol>' +
        '</section>' +

        '<section class="section apparait" aria-labelledby="t-course">' +
          '<h2 id="t-course">La course : avec ou sans myéline ?</h2>' +
          '<p class="chapeau">Deux axones, le même message. Lequel arrive en premier ? (Illustration : les vitesses ne sont pas à l\'échelle.)</p>' +
          '<div class="carte course"><svg viewBox="0 0 700 200" role="img" aria-label="Course entre un axone sans myéline et un axone avec myéline">' +
            '<text class="sim-lib" x="150" y="30">sans myéline</text><line class="sim-axone" x1="150" y1="52" x2="680" y2="52"/><circle class="sim-pulse" data-lent cx="150" cy="52" r="11"/>' +
            '<text class="sim-lib" x="150" y="118">avec myéline</text><line class="sim-axone" x1="150" y1="142" x2="680" y2="142"/>' +
            [0, 1, 2, 3, 4].map(i => '<rect class="sim-gaine" x="' + (168 + i * 102) + '" y="128" width="84" height="28" rx="14"/>').join('') +
            '<circle class="sim-pulse" data-rapide cx="150" cy="142" r="11"/>' +
            '<line class="sim-arrivee" x1="680" y1="22" x2="680" y2="172"/></svg>' +
            '<div class="rangee entre"><button type="button" class="bouton petit" data-course>Lancer la course</button><p class="sim-gagnant" aria-live="polite" data-gagnant></p></div>' +
          '</div>' +
        '</section>' +
        S.filRouge("Ces messages passent par les synapses et voyagent sur des câbles isolés par la myéline. C'est surtout le nombre de synapses et la quantité de myéline qui changent après la naissance, pas le nombre de neurones du cortex.", 'mythes') +
        '</div>';

      const svg = app.querySelector('.sim-scene svg');
      const etapes = Array.from(app.querySelectorAll('.sim-etapes li'));
      const go = app.querySelector('[data-go]');
      const myel = app.querySelector('[data-myeline]');
      const pulse = svg.querySelector('.sim-pulse');
      let actif = false, annule = false;
      S.quitte(() => { annule = true; });

      const attendre = ms => new Promise(r => setTimeout(r, S.reduit() ? Math.min(ms, 350) : ms));
      const anime = (duree, f) => new Promise(r => {
        if (S.reduit()) { f(1); return r(); }
        const t0 = performance.now();
        (function pas(t) { if (annule) return r(); const k = Math.min(1, (t - t0) / duree); f(k); if (k < 1) requestAnimationFrame(pas); else r(); })(t0);
      });
      const montrer = i => etapes.forEach((li, j) => { li.classList.toggle('actif', j === i); li.classList.toggle('fait', j < i); });
      const allumer = (sel, oui) => svg.querySelectorAll(sel).forEach(e => e.classList.toggle('allume', oui));

      function majMyeline() { svg.classList.toggle('sans-myeline', !myel.checked); }
      myel.addEventListener('change', majMyeline);

      async function declencher() {
        if (actif) return;
        actif = true; go.disabled = true;
        allumer('.sim-b', false); svg.querySelectorAll('.sim-nt').forEach(n => n.setAttribute('cx', 806));
        montrer(0); allumer('.sim-dendrites', true); await attendre(900); allumer('.sim-dendrites', false);
        montrer(1); allumer('.sim-a', true); await attendre(800);
        montrer(2); pulse.style.opacity = 1;
        if (myel.checked) {
          for (let i = 0; i < NOEUDS.length - 1; i++) {
            const a = NOEUDS[i], b = NOEUDS[i + 1];
            await anime(110, k => pulse.setAttribute('cx', a + (b - a) * k));
            await attendre(60);
          }
        } else {
          await anime(2600, k => pulse.setAttribute('cx', X0 + (X1 - X0) * k));
        }
        pulse.style.opacity = 0; allumer('.sim-a', false);
        montrer(3);
        const nts = Array.from(svg.querySelectorAll('.sim-nt'));
        await anime(900, k => nts.forEach((n, i) => n.setAttribute('cx', 806 + (34 + i * 3) * k)));
        montrer(4); allumer('.sim-b', true);
        await attendre(1200);
        actif = false; go.disabled = false;
      }
      go.addEventListener('click', declencher);
      svg.querySelector('.sim-a').addEventListener('click', declencher);
      majMyeline();

      // course
      const lent = app.querySelector('[data-lent]'), rapide = app.querySelector('[data-rapide]'), gagnant = app.querySelector('[data-gagnant]');
      const btCourse = app.querySelector('[data-course]');
      btCourse.addEventListener('click', async () => {
        btCourse.disabled = true; gagnant.textContent = '';
        lent.setAttribute('cx', 150); rapide.setAttribute('cx', 150);
        const sauts = [150, 252, 354, 456, 558, 660, 680];
        const course1 = anime(3600, k => lent.setAttribute('cx', 150 + 530 * k));
        const course2 = (async () => {
          for (let i = 0; i < sauts.length - 1; i++) { const a = sauts[i], b = sauts[i + 1]; await anime(120, k => rapide.setAttribute('cx', a + (b - a) * k)); await attendre(70); }
          gagnant.textContent = 'Le message avec myéline est déjà arrivé !';
        })();
        await Promise.all([course1, course2]);
        btCourse.disabled = false;
      });
    }
  });

  function scene() {
    const gaines = [0, 1, 2, 3, 4, 5].map(i => '<rect class="sim-gaine" x="' + (281 + i * 92) + '" y="186" width="70" height="28" rx="14"/>').join('');
    return '<svg viewBox="0 0 1000 400" role="img" aria-label="Deux neurones reliés par une synapse">' +
      '<g class="sim-dendrites"><path d="M170 176 C140 140 124 110 90 94 M140 150 C118 150 98 140 76 150 M174 226 C144 260 122 290 88 306 M144 262 C120 258 98 268 76 258 M194 158 C190 118 200 82 186 46 M196 252 C196 294 210 326 200 362"/></g>' +
      '<g class="sim-a" role="button" aria-label="Neurone de départ"><circle cx="214" cy="200" r="54"/><circle class="sim-noyau" cx="208" cy="196" r="18"/></g>' +
      '<line class="sim-axone" x1="268" y1="200" x2="772" y2="200"/>' + gaines +
      '<path class="sim-terminal" d="M772 200 C790 200 794 190 804 186"/><circle class="sim-bouton" cx="806" cy="200" r="14"/>' +
      [0, 1, 2, 3].map(i => '<circle class="sim-nt" cx="806" cy="' + (188 + i * 8) + '" r="4"/>').join('') +
      '<g class="sim-b"><path class="sim-dendrites-b" d="M846 200 C870 200 880 176 900 170 M846 200 C872 206 880 230 902 238"/><circle cx="930" cy="200" r="42"/><circle class="sim-noyau" cx="926" cy="196" r="14"/></g>' +
      '<circle class="sim-pulse" cx="270" cy="200" r="13" style="opacity:0"/>' +
      '<text class="sim-lib" x="214" y="290" text-anchor="middle">neurone 1</text><text class="sim-lib" x="930" y="272" text-anchor="middle">neurone 2</text>' +
      '<text class="sim-lib" x="826" y="140" text-anchor="middle">synapse</text>' +
      '</svg>';
  }
})();
