// Génère js/donnees.js à partir de donnees_cerveau.json.
// Un navigateur ne peut pas lire un .json local en file:// : on l'enveloppe dans un script.
// Usage : node tools/build-data.js   (à relancer après chaque modification du JSON)
const fs = require('fs');
const path = require('path');

const racine = path.join(__dirname, '..');
const donnees = JSON.parse(fs.readFileSync(path.join(racine, 'donnees_cerveau.json'), 'utf8'));
const sortie = '/* Fichier généré par tools/build-data.js depuis donnees_cerveau.json — ne pas modifier à la main. */\n' +
  'window.DONNEES = ' + JSON.stringify(donnees, null, 1) + ';\n';
fs.writeFileSync(path.join(racine, 'js', 'donnees.js'), sortie);
console.log('js/donnees.js écrit :', donnees.points.length, 'âges,', donnees.sources.length, 'sources');
