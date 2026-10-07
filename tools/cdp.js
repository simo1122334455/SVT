// Pilote minimal de Chrome (DevTools Protocol), sans dépendance : Node 22+ fournit fetch et WebSocket.
// Utilisé par captures.js, verifier.js et export-pdf.js.
const { spawn } = require('child_process');
const fs = require('fs'), os = require('os'), path = require('path');

const CHEMINS = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome', '/usr/bin/chromium', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
];
const attendre = ms => new Promise(r => setTimeout(r, ms));

async function lancer() {
  const exe = CHEMINS.find(c => fs.existsSync(c));
  if (!exe) throw new Error('Chrome ou Edge introuvable');
  const port = 9300 + Math.floor(Math.random() * 600);
  const profil = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));
  const proc = spawn(exe, ['--headless=new', '--remote-debugging-port=' + port, '--user-data-dir=' + profil,
    '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--allow-file-access-from-files', 'about:blank'], { stdio: 'ignore' });
  let ws;
  for (let i = 0; i < 60 && !ws; i++) {
    try {
      const l = await (await fetch('http://127.0.0.1:' + port + '/json/list')).json();
      const p = l.find(t => t.type === 'page');
      if (p) ws = new WebSocket(p.webSocketDebuggerUrl);
    } catch (e) { /* Chrome démarre encore */ }
    if (!ws) await attendre(200);
  }
  if (!ws) { proc.kill(); throw new Error('Chrome ne répond pas'); }
  await new Promise(r => { ws.onopen = r; });
  let id = 0; const attente = {}; const evenements = [];
  ws.onmessage = m => {
    const d = JSON.parse(m.data);
    if (d.id && attente[d.id]) { attente[d.id](d); delete attente[d.id]; } else if (d.method) evenements.push(d);
  };
  const cmd = (method, params = {}) => new Promise(r => { const i = ++id; attente[i] = r; ws.send(JSON.stringify({ id: i, method, params })); });
  await cmd('Page.enable'); await cmd('Runtime.enable'); await cmd('Log.enable');
  const evaluer = async expr => {
    const r = await cmd('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text);
    return r.result.result.value;
  };
  const erreurs = () => evenements.filter(e => e.method === 'Runtime.exceptionThrown' || (e.method === 'Log.entryAdded' && e.params.entry.level === 'error')
    || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
    .map(e => e.method === 'Runtime.exceptionThrown' ? (e.params.exceptionDetails.exception?.description || e.params.exceptionDetails.text)
      : e.method === 'Log.entryAdded' ? e.params.entry.text + (e.params.entry.url ? ' (' + e.params.entry.url + ')' : '')
      : e.params.args.map(a => a.value ?? a.description).join(' '));
  const fermer = () => { try { ws.close(); } catch (e) {} proc.kill(); setTimeout(() => { try { fs.rmSync(profil, { recursive: true, force: true }); } catch (e) {} }, 500); };
  return { cmd, evaluer, evenements, erreurs, fermer, attendre };
}

// adresse file:// de index.html
const racine = path.join(__dirname, '..');
const urlSite = (hash, q) => 'file:///' + path.join(racine, 'index.html').replace(/\\/g, '/').replace(/ /g, '%20') + (q ? '?' + q : '') + (hash || '');

module.exports = { lancer, urlSite, racine, attendre };
