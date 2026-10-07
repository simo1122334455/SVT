# Le compte des neurones

**En ligne : https://svt-rho.vercel.app**

Projet de recherche en SVT : *Le nombre de neurones augmente-t-il de la naissance jusqu'à un certain âge ?*
Une réponse sourcée, des animations, un quiz et un diaporama.

## Ouvrir le site

Double-clic sur `index.html` : tout fonctionne **sans connexion** (polices, images et données sont dans le dossier).
Pour une clé USB, copier **tout le dossier**, pas seulement `index.html`.
En secours, le diaporama existe aussi en PDF : [`presentation.pdf`](presentation.pdf).

## Les pages

| Page | Contenu |
|---|---|
| Accueil | La question, la réponse courte, le vote « À ton avis ? » et toutes les sections |
| Le neurone | Schéma interactif (chaque partie expliquée) et un vrai dessin de Cajal |
| Explorer | Curseur d'âge de 0 à 80 ans : volume du cerveau, jauges et graphiques |
| La réponse | La réponse étape par étape, avec les sources, jusqu'à la conclusion |
| Simulation | Déclencher un neurone, suivre le message, comparer avec et sans myéline |
| Mythes ou réalité ? | Huit idées reçues à retourner |
| Quiz | Dix questions, en solo ou en mode classe |
| Le cerveau en coupe | De vraies IRM à faire défiler dans trois sens |
| Lexique | Tous les mots scientifiques, avec recherche |
| Présentation | Le diaporama de l'exposé (flèches, espace, clic, plein écran avec F) |
| Sources | Les 21 références, numérotées comme les renvois [n] du site |

## Organisation des fichiers

```
index.html              coquille du site (menu, scripts)
css/tokens.css          couleurs (thèmes sombre et clair), polices, tailles
css/base.css            structure, menu, boutons, cartes, lexique
css/pages.css           composants de chaque page et diaporama
js/donnees.js           GÉNÉRÉ depuis donnees_cerveau.json (ne pas modifier à la main)
js/contenu.js           textes, lexique, quiz, mythes
js/core.js              navigation, thème, bulles du lexique, renvois aux sources
js/composants.js        éléments partagés (graphiques, schéma du neurone, images à points)
js/fond.js              réseau de neurones animé en arrière-plan
js/pages/*.js           une page par fichier
assets/                 polices (licence OFL), images, coupes IRM
tools/                  scripts de contrôle (voir ci-dessous)
donnees_cerveau.json    la seule source des chiffres du graphique
```

Les textes contiennent deux marqueurs : `[[id|mot]]` affiche un mot du lexique cliquable,
`{idSource}` affiche un renvoi numéroté vers la page Sources.

## Outils (Node 22+ et Chrome ou Edge installés)

```bash
node tools/build-data.js     # après une modification de donnees_cerveau.json
node tools/verifier.js       # visite chaque page, teste chaque interaction et chaque lien
node tools/captures.js _audit/apres    # captures à 1920, 1366 et 390 px
node tools/export-pdf.js     # régénère presentation.pdf
```

## Images et polices

- Dessin de Santiago Ramón y Cajal (vers 1899) — domaine public
- IRM 7 teslas d'un cerveau humain ex vivo (Edlow et al., 2019) — CC0
- Cerveau de profil, NIH BioArt n° 60 — domaine public
- Polices Space Grotesk et Atkinson Hyperlegible — SIL Open Font License
