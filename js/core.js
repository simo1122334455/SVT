/* ==========================================================================
   Cœur du site : outils, navigation, routeur, thème, lexique, sources
   ========================================================================== */
(function () {
  'use strict';

  /* ---------- outils ---------- */
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const nf = n => String(n).replace('.', ',');
  const echappe = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const reduit = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
  // vrai si l'événement vient d'un élément correspondant au sélecteur
  const cible = (e, sel) => e.target instanceof Element && !!e.target.closest(sel);

  /* ---------- icônes ---------- */
  const ICONES = {
    soleil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 1.5v2.5M12 20v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M1.5 12H4M20 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>',
    lune: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" aria-hidden="true"><path d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5a8.5 8.5 0 1 0 11 11z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    fermer: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    fleche: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    retour: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>',
    plein: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',
    neurone: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="20" r="6" fill="currentColor" fill-opacity=".25"/><path d="M13 16 6 9M12 22l-7 3M16 14l-1-8M22 15l5-6M23 23l20 13M31 28l2-6M37 32l3-4M43 36l2 5"/></svg>',
    cerveau: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 8a6 6 0 0 0-6 6 6 6 0 0 0-4 10 6 6 0 0 0 4 10 6 6 0 0 0 11 2V10a4 4 0 0 0-5-2zM31 8a6 6 0 0 1 6 6 6 6 0 0 1 4 10 6 6 0 0 1-4 10 6 6 0 0 1-11 2V10a4 4 0 0 1 5-2z"/><path d="M11 24h5M32 24h5M17 15h3M28 33h3"/></svg>',
    curseur: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><path d="M6 24h36"/><circle cx="20" cy="24" r="6" fill="currentColor" fill-opacity=".25"/><path d="M8 14v4M16 12v6M24 10v8M32 12v6M40 14v4"/></svg>',
    reponse: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M16 24l6 6 11-12"/></svg>',
    eclair: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" aria-hidden="true"><path d="M27 4 10 27h12l-3 17 19-24H26z" fill="currentColor" fill-opacity=".2"/></svg>',
    cartes: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" aria-hidden="true"><rect x="6" y="10" width="22" height="30" rx="4"/><path d="M20 8l20 4-5 28-7-1.5"/><path d="M12 20h10M12 27h7"/></svg>',
    quiz: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="24" cy="24" r="18"/><path d="M19 19a5 5 0 1 1 7 4.6c-1.3.6-2 1.6-2 3V28M24 34v.5"/></svg>',
    coupe: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" aria-hidden="true"><ellipse cx="24" cy="24" rx="17" ry="19"/><path d="M24 5v38" stroke-dasharray="3 4"/><path d="M15 24c3-2 6-2 9 0s6 2 9 0"/></svg>',
    livre: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round" aria-hidden="true"><path d="M8 9h12a4 4 0 0 1 4 4v26a3 3 0 0 0-3-3H8zM40 9H28a4 4 0 0 0-4 4v26a3 3 0 0 1 3-3h13z"/></svg>',
    ecran: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="5" y="8" width="38" height="25" rx="3"/><path d="M24 33v7M16 40h16M20 16l9 4.5-9 4.5z"/></svg>',
    source: '<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 6h18l8 8v28H12z"/><path d="M29 6v9h9M18 24h14M18 31h14"/></svg>'
  };

  /* ---------- navigation ---------- */
  const NAV = [
    { id: 'accueil', t: 'Accueil' },
    { id: 'neurone', t: 'Le neurone' },
    { id: 'explorer', t: 'Explorer' },
    { id: 'reponse', t: 'La réponse' },
    { groupe: 'Pour aller plus loin', items: [
      { id: 'simulation', t: 'Simulation' },
      { id: 'mythes', t: 'Mythes ou réalité ?' },
      { id: 'quiz', t: 'Quiz' },
      { id: 'coupe', t: 'Le cerveau en coupe' }
    ] },
    { id: 'lexique', t: 'Lexique' },
    { id: 'presentation', t: 'Présentation' },
    { id: 'sources', t: 'Sources' }
  ];
  const ORDRE = NAV.flatMap(n => n.items ? n.items : [n]);
  const titrePage = id => (ORDRE.find(p => p.id === id) || {}).t || '';

  function construireNav() {
    const nav = $('#nav');
    nav.innerHTML = NAV.map(n => n.items
      ? '<div class="groupe"><button type="button" aria-expanded="false">' + n.groupe + ICONES.chevron + '</button>' +
        '<div class="sous-menu">' + n.items.map(i => '<a href="#/' + i.id + '" data-page="' + i.id + '">' + i.t + '</a>').join('') + '</div></div>'
      : '<a href="#/' + n.id + '" data-page="' + n.id + '">' + n.t + '</a>').join('');
    const groupe = $('.groupe', nav), btGroupe = $('button', groupe);
    const fermerGroupe = () => { groupe.removeAttribute('data-ouvert'); btGroupe.setAttribute('aria-expanded', 'false'); };
    btGroupe.addEventListener('click', e => {
      e.stopPropagation();
      const ouvert = groupe.hasAttribute('data-ouvert');
      ouvert ? fermerGroupe() : (groupe.setAttribute('data-ouvert', ''), btGroupe.setAttribute('aria-expanded', 'true'));
    });
    document.addEventListener('click', e => { if (!groupe.contains(e.target)) fermerGroupe(); });
    groupe.addEventListener('keydown', e => { if (e.key === 'Escape') { fermerGroupe(); btGroupe.focus(); } });

    const btMenu = $('#bouton-menu');
    const fermerMenu = () => { nav.removeAttribute('data-ouvert'); btMenu.setAttribute('aria-expanded', 'false'); btMenu.innerHTML = ICONES.menu; };
    btMenu.innerHTML = ICONES.menu;
    btMenu.addEventListener('click', () => {
      if (nav.hasAttribute('data-ouvert')) fermerMenu();
      else { nav.setAttribute('data-ouvert', ''); btMenu.setAttribute('aria-expanded', 'true'); btMenu.innerHTML = ICONES.fermer; }
    });
    nav.addEventListener('click', e => { if (e.target.closest('a')) { fermerMenu(); fermerGroupe(); } });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.hasAttribute('data-ouvert')) { fermerMenu(); btMenu.focus(); } });
  }

  /* ---------- thème clair / sombre ---------- */
  function lireTheme() { try { return localStorage.getItem('theme'); } catch (e) { return null; } }
  function appliquerTheme(t) {
    document.documentElement.setAttribute('data-theme', t);
    const bt = $('#bouton-theme');
    if (bt) {
      bt.innerHTML = t === 'clair' ? ICONES.lune : ICONES.soleil;
      bt.setAttribute('aria-label', t === 'clair' ? 'Passer au thème sombre' : 'Passer au thème clair');
      bt.setAttribute('title', bt.getAttribute('aria-label'));
    }
    document.dispatchEvent(new CustomEvent('theme'));
  }
  function initTheme() {
    appliquerTheme(lireTheme() || 'sombre');
    $('#bouton-theme').addEventListener('click', () => {
      const t = document.documentElement.getAttribute('data-theme') === 'clair' ? 'sombre' : 'clair';
      try { localStorage.setItem('theme', t); } catch (e) { /* stockage indisponible : le thème reste valable pour la visite */ }
      appliquerTheme(t);
    });
  }

  /* ---------- sources et mots du lexique ---------- */
  const SOURCES = window.DONNEES.sources;
  const numSource = id => SOURCES.findIndex(s => s.id === id) + 1;
  function cite(id) {
    const s = SOURCES.find(x => x.id === id);
    if (!s) { console.error('Source inconnue :', id); return ''; }
    const n = numSource(id);
    return '<a class="cite" href="#/sources/' + id + '" title="' + echappe(s.auteurs.split(',')[0] + ' ' + s.annee + ' — ' + s.pour) +
      '" aria-label="Source ' + n + ' : ' + echappe(s.auteurs.split(',')[0] + ' ' + s.annee) + '">[' + n + ']</a>';
  }
  function terme(id, libelle) {
    if (!window.LEXIQUE.some(m => m.id === id)) console.error('Mot du lexique inconnu :', id);
    return '<button type="button" class="terme" data-terme="' + id + '" aria-haspopup="dialog">' + libelle + '</button>';
  }
  // transforme les marqueurs [[id|texte]] et {source} en éléments interactifs
  function riche(texte) {
    return String(texte)
      .replace(/\[\[([\w-]+)\|([^\]]+)\]\]/g, (m, id, lib) => terme(id, lib))
      .replace(/\{([a-z0-9-]+)\}/g, (m, id) => cite(id));
  }

  let bulle = null, declencheur = null;
  function fermerBulle(rendreFocus) {
    if (!bulle) return;
    bulle.remove(); bulle = null;
    if (declencheur) { declencheur.setAttribute('aria-expanded', 'false'); if (rendreFocus) declencheur.focus(); }
    declencheur = null;
  }
  function ouvrirBulle(bt) {
    const id = bt.dataset.terme, m = window.LEXIQUE.find(x => x.id === id);
    if (!m) return;
    fermerBulle(false);
    declencheur = bt; bt.setAttribute('aria-expanded', 'true');
    bulle = document.createElement('div');
    bulle.className = 'bulle'; bulle.setAttribute('role', 'dialog'); bulle.setAttribute('aria-label', 'Définition : ' + m.mot);
    bulle.innerHTML = '<h4>' + m.mot + '</h4><p>' + m.def + '</p><div class="rangee">' +
      '<a href="#/lexique/' + id + '">Voir dans le lexique</a><button type="button" data-fermer>Fermer</button></div>';
    document.body.appendChild(bulle);
    const r = bt.getBoundingClientRect(), l = bulle.offsetWidth, h = bulle.offsetHeight;
    let x = r.left + scrollX + r.width / 2 - l / 2;
    x = Math.max(scrollX + 12, Math.min(x, scrollX + innerWidth - l - 12));
    const dessous = r.bottom + h + 16 < innerHeight;
    bulle.style.left = x + 'px';
    bulle.style.top = (dessous ? r.bottom + scrollY + 10 : r.top + scrollY - h - 10) + 'px';
    $('[data-fermer]', bulle).addEventListener('click', () => fermerBulle(true));
    $('a', bulle).addEventListener('click', () => fermerBulle(false));
  }
  document.addEventListener('click', e => {
    const bt = e.target.closest('.terme');
    if (bt) { e.preventDefault(); bt === declencheur ? fermerBulle(false) : ouvrirBulle(bt); return; }
    if (bulle && !bulle.contains(e.target)) fermerBulle(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') fermerBulle(true); });
  addEventListener('resize', () => fermerBulle(false));

  /* ---------- composants partagés ---------- */
  function filRouge(texte, suivant) {
    const p = ORDRE.find(x => x.id === suivant);
    return '<aside class="fil-rouge" aria-label="Lien avec la question"><span class="surtitre">Lien avec la question</span>' +
      '<p>' + riche(texte) + '</p><div class="rangee">' +
      (p ? '<a class="bouton" href="#/' + p.id + '">' + p.t + ' ' + ICONES.fleche + '</a>' : '') +
      (suivant !== 'reponse' ? '<a class="bouton second" href="#/reponse">Revoir la réponse</a>' : '') + '</div></aside>';
  }
  function entete(surtitre, titre, chapeau) {
    return '<header class="titre-page"><span class="surtitre">' + surtitre + '</span><h1>' + titre + '</h1>' +
      (chapeau ? '<p class="chapeau">' + riche(chapeau) + '</p>' : '') + '</header>';
  }
  // valeur d'une case du JSON : « ~ » si approximative, fourchette si « range »
  function valeur(c, unite) {
    if (c.range) return '~' + nf(c.range[0]) + '–' + nf(c.range[1]) + unite;
    return (c.approx ? '~' : '') + nf(c.valeur) + unite;
  }

  /* ---------- apparition au défilement ---------- */
  let observateur = null;
  function observerApparitions(racine) {
    const items = $$('.apparait', racine);
    if (reduit() || !('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('vu')); return; }
    if (observateur) observateur.disconnect();
    observateur = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('vu'); observateur.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    items.forEach(i => observateur.observe(i));
  }

  /* ---------- routeur ---------- */
  const PAGES = {};
  let nettoyages = [];
  const quitte = fn => nettoyages.push(fn);           // appelé au changement de page
  const minuteur = (fn, ms) => { const t = setInterval(fn, ms); quitte(() => clearInterval(t)); return t; };

  function afficher() {
    const brut = location.hash.replace(/^#\/?/, '');
    const [id, param] = brut.split('/');
    const page = PAGES[id] ? id : 'accueil';
    nettoyages.forEach(f => { try { f(); } catch (e) { console.error(e); } });
    nettoyages = [];
    fermerBulle(false);

    const app = $('#app');
    const def = PAGES[page];
    document.body.className = def.ambiance || '';
    app.innerHTML = '';
    def.rendu(app, param ? decodeURIComponent(param) : null);
    app.classList.toggle('plein', !!def.pleinEcran);
    document.title = (page === 'accueil' ? '' : titrePage(page) + ' — ') + 'Le compte des neurones';
    $$('#nav a').forEach(a => a.dataset.page === page ? a.setAttribute('aria-current', 'page') : a.removeAttribute('aria-current'));
    const groupe = $('#nav .groupe');
    if (groupe) groupe.classList.toggle('actif', !!$('a[aria-current]', groupe));
    if (!param) scrollTo(0, 0);
    observerApparitions(app);
    if (!param) app.focus({ preventScroll: true });
  }

  window.SITE = {
    $, $, nf, echappe, reduit, cible, ICONES, NAV, ORDRE, titrePage,
    cite, terme, riche, numSource, filRouge, entete, valeur, quitte, minuteur, observerApparitions,
    page: (id, def) => { PAGES[id] = def; }
  };

  document.addEventListener('DOMContentLoaded', () => {
    construireNav();
    initTheme();
    addEventListener('hashchange', afficher);
    afficher();
  });
})();
