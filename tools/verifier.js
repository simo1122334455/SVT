// Vérifie tout le site dans Chrome headless : chaque page, chaque interaction, la console et les liens.
// Usage : node tools/verifier.js          (ajouter --sans-liens pour ne pas tester les liens externes)
const { lancer, urlSite } = require('./cdp');

const PAGES = ['accueil', 'neurone', 'explorer', 'reponse', 'simulation', 'mythes', 'quiz', 'coupe', 'lexique', 'presentation', 'sources'];
let ok = 0, ko = 0;
const verifie = (cond, msg) => { cond ? ok++ : ko++; console.log((cond ? '  ✓ ' : '  ✗ ') + msg); };

(async () => {
  const c = await lancer();
  let n = 0;
  const ouvrir = async (hash, attente) => {
    c.evenements.length = 0;
    await c.cmd('Emulation.setDeviceMetricsOverride', { width: 1366, height: 768, deviceScaleFactor: 1, mobile: false });
    await c.cmd('Page.navigate', { url: urlSite(hash, 'v=' + (++n)) });
    await c.attendre(attente || 900);
  };
  const liensInternes = new Set();

  for (const p of PAGES) {
    console.log('\n■ ' + p);
    await ouvrir('#/' + p);
    const etat = await c.evaluer(`(() => {
      const app = document.querySelector('#app');
      const termes = [...app.querySelectorAll('[data-terme]')].map(b => b.dataset.terme);
      const inconnus = termes.filter(t => !LEXIQUE.some(m => m.id === t));
      const cites = [...app.querySelectorAll('.cite')].map(a => a.getAttribute('href'));
      const liens = [...document.querySelectorAll('a[href^="#/"]')].map(a => a.getAttribute('href'));
      const imgs = [...app.querySelectorAll('img')];
      return { longueur: app.innerHTML.length, titre: document.title, courant: (document.querySelector('#nav [aria-current]')||{}).textContent,
        inconnus, cites: cites.length, liens, imgsCassees: imgs.filter(i => i.complete && i.naturalWidth === 0).map(i => i.src.split('/').pop()) };
    })()`);
    verifie(etat.longueur > 500, 'la page s\'affiche (' + etat.titre + ')');
    verifie(etat.inconnus.length === 0, 'mots du lexique valides' + (etat.inconnus.length ? ' — inconnus : ' + etat.inconnus : ''));
    verifie(etat.imgsCassees.length === 0, 'images chargées' + (etat.imgsCassees.length ? ' — cassées : ' + etat.imgsCassees : ''));
    etat.liens.forEach(l => liensInternes.add(l));
    const err = c.erreurs();
    verifie(err.length === 0, 'aucune erreur console' + (err.length ? ' — ' + err.join(' | ') : ''));
  }

  console.log('\n■ liens internes');
  const routes = await c.evaluer('true') && PAGES;
  const mauvais = [...liensInternes].filter(l => !routes.includes(l.slice(2).split('/')[0]));
  verifie(mauvais.length === 0, liensInternes.size + ' liens internes mènent à une page existante' + (mauvais.length ? ' — ' + mauvais : ''));

  console.log('\n■ interactions');
  await ouvrir('#/accueil');
  verifie(await c.evaluer(`document.querySelector('.choix[data-v="pareil"]').click(), sessionStorage.getItem('vote') === 'pareil'`), 'accueil : le vote est enregistré');
  verifie(await c.evaluer(`(() => { const b = document.querySelector('.terme'); b.click(); const ok = !!document.querySelector('.bulle');
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' })); return ok && !document.querySelector('.bulle'); })()`), 'un mot du lexique ouvre sa définition, Échap la ferme');
  verifie(await c.evaluer(`(async () => { location.hash = '#/neurone'; await new Promise(r => setTimeout(r, 300)); history.back(); await new Promise(r => setTimeout(r, 400));
    return document.querySelector('#nav [aria-current]').textContent === 'Accueil'; })()`), 'le bouton « retour » du navigateur change de page');
  verifie(await c.evaluer(`(() => { const t0 = document.documentElement.dataset.theme; document.querySelector('#bouton-theme').click();
    const t1 = document.documentElement.dataset.theme; document.querySelector('#bouton-theme').click(); return t0 !== t1; })()`), 'le thème clair / sombre bascule');

  await ouvrir('#/neurone');
  verifie(await c.evaluer(`(() => { const b = [...document.querySelectorAll('.liste-parties .choix')]; b[7].click();
    const ok1 = document.querySelector('.info-partie h3').textContent === 'Synapse';
    const g = document.querySelector('.partie[data-p="axone"]'); g.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    return ok1 && document.querySelector('.info-partie h3').textContent === 'Axone'; })()`), 'neurone : liste et clavier sélectionnent une partie');
  verifie(await c.evaluer(`(() => { document.querySelectorAll('[data-cajal] .point')[1].click(); return /Corps/.test(document.querySelector('[data-cajal] .info-point').textContent); })()`), 'neurone : les points du dessin de Cajal répondent');

  await ouvrir('#/explorer');
  verifie(await c.evaluer(`(() => { const r = document.querySelector('#age-curseur'); const vus = new Set();
    for (let i = 0; i <= +r.max; i++) { r.value = i; r.dispatchEvent(new Event('input')); vus.add(document.querySelector('[data-age-lib]').textContent + document.querySelector('[data-jauges]').textContent.length); }
    return vus.size === +r.max + 1; })()`), 'explorer : chaque âge met à jour le cerveau et les jauges');
  verifie(await c.evaluer(`(() => { document.querySelector('.g-cible[data-age="30"]').dispatchEvent(new MouseEvent('click', { bubbles: true })); return document.querySelector('[data-age-lib]').textContent === '30 ans'; })()`), 'explorer : un point du graphique choisit son âge');

  await ouvrir('#/reponse');
  verifie(await c.evaluer(`(() => { const b = document.querySelector('[data-pousser]'); for (let i = 0; i < 20; i++) b.click(); return b.disabled; })()`), 'réponse : le réseau atteint son maximum');
  verifie(await c.evaluer(`(() => { const b = document.querySelector('[data-tri-suiv]'); for (let i = 0; i < 6; i++) b.click(); return /5\\./.test(document.querySelector('[data-tri-txt]').textContent); })()`), 'réponse : les 5 étapes du tri défilent');
  verifie(await c.evaluer(`/Bien vu/.test(document.querySelector('[data-vote]').textContent)`), 'réponse : le vote de l\'accueil est révélé');

  await ouvrir('#/simulation');
  verifie(await c.evaluer(`(async () => { document.querySelector('[data-go]').click(); await new Promise(r => setTimeout(r, 5200));
    return document.querySelectorAll('.sim-etapes li')[4].classList.contains('actif'); })()`), 'simulation : le message va jusqu\'au neurone suivant');
  verifie(await c.evaluer(`(async () => { document.querySelector('[data-course]').click(); await new Promise(r => setTimeout(r, 4000));
    return /myéline/.test(document.querySelector('[data-gagnant]').textContent); })()`), 'simulation : la course désigne un gagnant');

  await ouvrir('#/mythes');
  verifie(await c.evaluer(`(() => { document.querySelectorAll('.mythe').forEach(m => m.querySelector('[data-pari="faux"]').click());
    return [...document.querySelectorAll('.mythe .verso')].every(v => !v.hidden) && /sur/.test(document.querySelector('[data-score]').textContent); })()`), 'mythes : les 8 cartes se retournent et le score s\'affiche');

  await ouvrir('#/quiz');
  verifie(await c.evaluer(`(() => { for (let i = 0; i < 10; i++) { document.querySelector('.reponse').click(); document.querySelector('[data-suivant]').click(); }
    return /\\/ 10/.test(document.querySelector('.quiz-fin').textContent); })()`), 'quiz solo : 10 questions puis le score');
  verifie(await c.evaluer(`(() => { document.querySelector('[data-mode="classe"]').click(); document.querySelector('.reponse').click(); document.querySelector('[data-reveler]').click();
    return !!document.querySelector('.reponse.bonne'); })()`), 'quiz classe : la réponse se révèle');

  await ouvrir('#/coupe');
  verifie(await c.evaluer(`(async () => { const vus = new Set(); for (const b of document.querySelectorAll('[data-m]')) { b.click();
    const r = document.querySelector('#coupe-curseur'); for (const v of [0, r.max]) { r.value = v; r.dispatchEvent(new Event('input')); vus.add(document.querySelector('[data-image] img').getAttribute('src')); } }
    await new Promise(r => setTimeout(r, 800)); return vus.size === 6 && [...document.querySelectorAll('[data-image] img')].every(i => i.naturalWidth > 0); })()`), 'coupe : les IRM défilent dans les 3 sens');

  await ouvrir('#/lexique/myeline');
  verifie(await c.evaluer(`document.querySelector('#mot-myeline').classList.contains('eclaire')`), 'lexique : le lien direct éclaire le bon mot');
  verifie(await c.evaluer(`(() => { const i = document.querySelector('#recherche-lexique'); i.value = 'myelin'; i.dispatchEvent(new Event('input'));
    return document.querySelectorAll('.mot:not([hidden])').length >= 1 && document.querySelectorAll('.mot:not([hidden])').length < 8; })()`), 'lexique : la recherche filtre, sans tenir compte des accents');

  await ouvrir('#/presentation');
  verifie(await c.evaluer(`(() => { for (let i = 0; i < 30; i++) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
    const fin = document.querySelector('[data-num]').textContent; document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home' }));
    return /^(\\d+) \\/ \\1$/.test(fin) && /^1 \\//.test(document.querySelector('[data-num]').textContent); })()`), 'présentation : les flèches parcourent toutes les diapos');

  await ouvrir('#/sources/larsen2006');
  verifie(await c.evaluer(`document.querySelector('#src-larsen2006').classList.contains('eclaire')`), 'sources : un renvoi [n] mène à la bonne référence');
  const externes = await c.evaluer(`[...document.querySelectorAll('a[href^="http"]')].map(a => a.href)`);
  const errFin = c.erreurs();
  verifie(errFin.length === 0, 'aucune erreur console pendant les interactions' + (errFin.length ? ' — ' + errFin.join(' | ') : ''));
  c.fermer();

  if (!process.argv.includes('--sans-liens')) {
    console.log('\n■ liens externes (' + externes.length + ')');
    for (const u of externes) {
      let code = 0;
      try { code = (await fetch(u, { method: 'GET', redirect: 'follow', headers: { 'User-Agent': 'Mozilla/5.0 (verification de liens, projet SVT)' } })).status; } catch (e) { code = 'erreur'; }
      // certains éditeurs refusent les robots (403) alors que la page existe : on le signale sans échouer
      const bloque = code === 403 || code === 429;
      if (bloque) console.log('  ~ ' + code + ' (accès refusé aux robots, à vérifier à la main) ' + u);
      else verifie(code >= 200 && code < 400, code + ' ' + u);
    }
  }
  console.log('\n' + ok + ' vérifications réussies, ' + ko + ' en échec');
  process.exit(ko ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
