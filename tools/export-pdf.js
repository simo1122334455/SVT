// Exporte le diaporama en PDF (une diapo par page, format 16:9, même design) : presentation.pdf
// Usage : node tools/export-pdf.js
const fs = require('fs'), path = require('path');
const { lancer, urlSite, racine } = require('./cdp');

(async () => {
  const c = await lancer();
  await c.cmd('Emulation.setDeviceMetricsOverride', { width: 1280, height: 720, deviceScaleFactor: 1, mobile: false });
  await c.cmd('Page.navigate', { url: urlSite('#/presentation/imprimer', 'pdf=1') });
  await c.attendre(1500);
  await c.evaluer('document.fonts.ready.then(() => true)');
  const nb = await c.evaluer('document.querySelectorAll(".impression-pile .diapo").length');
  const r = await c.cmd('Page.printToPDF', { printBackground: true, preferCSSPageSize: true, displayHeaderFooter: false, marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0 });
  const sortie = path.join(racine, 'presentation.pdf');
  fs.writeFileSync(sortie, Buffer.from(r.result.data, 'base64'));
  const pages = (fs.readFileSync(sortie, 'latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  const err = c.erreurs();
  c.fermer();
  console.log('presentation.pdf :', pages, 'pages pour', nb, 'diapos,', Math.round(fs.statSync(sortie).size / 1024), 'Ko', err.length ? '— ERREURS : ' + err.join(' | ') : '');
  process.exit(pages === nb && !err.length ? 0 : 1);
})().catch(e => { console.error(e); process.exit(1); });
