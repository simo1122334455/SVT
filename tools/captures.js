// Captures d'écran de toutes les pages aux tailles demandées (1920, 1366, 390 px), thèmes sombre et clair.
// Usage : node tools/captures.js <dossier-sortie> [filtre]      ex. : node tools/captures.js _audit/apres explorer
const fs = require('fs'), path = require('path');
const { lancer, urlSite } = require('./cdp');

const PAGES = ['accueil', 'neurone', 'explorer', 'reponse', 'simulation', 'mythes', 'quiz', 'coupe', 'lexique', 'presentation', 'sources'];
const TAILLES = [[1920, 1080], [1366, 768], [390, 844]];

(async () => {
  const sortie = path.resolve(process.argv[2] || '_audit/apres'), filtre = process.argv[3];
  fs.mkdirSync(sortie, { recursive: true });
  const c = await lancer();
  let n = 0;
  const travaux = [];
  for (const p of PAGES) for (const [w, h] of TAILLES) travaux.push({ nom: p + '-' + w, hash: '#/' + p, w, h, entiere: p !== 'presentation' });
  ['accueil', 'explorer', 'reponse', 'presentation'].forEach(p => travaux.push({ nom: p + '-390-ecran', hash: '#/' + p, w: 390, h: 844 }));
  travaux.push({ nom: 'accueil-1366-clair', hash: '#/accueil', w: 1366, h: 768, theme: 'clair' });
  travaux.push({ nom: 'explorer-1366-clair', hash: '#/explorer', w: 1366, h: 768, theme: 'clair', entiere: true });
  [3, 5, 6, 9, 11, 12, 15].forEach(d => travaux.push({ nom: 'diapo-' + String(d).padStart(2, '0') + '-1920', hash: '#/presentation', w: 1920, h: 1080,
    js: 'for (let i = 1; i < ' + d + '; i++) document.querySelector("[data-suiv]").click()' }));

  for (const t of travaux.filter(t => !filtre || t.nom.includes(filtre))) {
    await c.cmd('Emulation.setDeviceMetricsOverride', { width: t.w, height: t.h, deviceScaleFactor: 1, mobile: t.w < 600 });
    await c.cmd('Page.navigate', { url: urlSite(t.hash, 'c=' + (++n)) });
    await c.attendre(900);
    await c.evaluer('(() => { try { localStorage.setItem("theme", "' + (t.theme || 'sombre') + '"); } catch (e) {} document.documentElement.setAttribute("data-theme", "' + (t.theme || 'sombre') + '"); document.dispatchEvent(new CustomEvent("theme")); document.querySelectorAll(".apparait").forEach(e => e.classList.add("vu")); })()');
    if (t.js) await c.evaluer(t.js);
    await c.attendre(900);
    let clip;
    if (t.entiere) {
      const m = await c.cmd('Page.getLayoutMetrics');
      clip = { x: 0, y: 0, width: t.w, height: Math.min(Math.ceil(m.result.cssContentSize.height), 14000), scale: 1 };
    }
    const r = await c.cmd('Page.captureScreenshot', { format: 'jpeg', quality: 72, clip, captureBeyondViewport: !!clip });
    fs.writeFileSync(path.join(sortie, t.nom + '.jpg'), Buffer.from(r.result.data, 'base64'));
    const err = c.erreurs(); c.evenements.length = 0;
    console.log(t.nom.padEnd(26), err.length ? 'ERREURS : ' + err.join(' | ') : 'ok');
  }
  c.fermer();
})().catch(e => { console.error(e); process.exit(1); });
