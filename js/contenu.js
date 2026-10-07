/* Contenu du site : textes, lexique, quiz, mythes.
   Marqueurs utilisés dans les textes (transformés par riche() dans core.js) :
     [[id|texte affiché]]  → mot du lexique cliquable (affiche sa définition)
     {idSource}            → renvoi numéroté vers la page Sources              */

window.TEXTES = {
  question: "Le nombre de neurones augmente-t-il de la naissance jusqu'à un certain âge ?",
  reponseCourte: "Pas vraiment. Dans le [[cortex|cortex]], on naît avec presque tous nos [[neurone|neurones]] (environ 20 milliards), et ce nombre ne change pas entre 0 et 3 ans {larsen2006}{kjaer2017}. Deux petites exceptions : le [[cervelet|cervelet]] en fabrique encore pendant la première année {abraham2001}, et de jeunes neurones migrent encore vers l'avant du cerveau dans les premiers mois {paredes2016}. Ce qui augmente vraiment : les connexions, la [[myeline|myéline]], les [[glie|cellules de soutien]] et le volume du cerveau, qui double la première année {knickmeyer2008}.",

  // textes d'origine du projet (conservés mot pour mot, avec renvois et mots du lexique)
  t1: "Surprise : un bébé naît avec presque tous les [[neurone|neurones]] de son [[cortex|cortex]] ! Un nouveau-né en a environ 19,8 milliards, autant qu'un adulte {larsen2006}. Et entre 0 et 3 ans, ce nombre ne bouge pas (environ 20,7 milliards en moyenne) {kjaer2017} : le cerveau grandit, mais pas en ajoutant des neurones.",
  t2: "Si les neurones sont déjà là, qu'est-ce qui pousse ? Les connexions entre eux ! Dans la zone de l'audition, elles atteignent leur maximum vers 3 mois, et dans la zone frontale (celle qui réfléchit) entre 1 et 2 ans {huttenlocher1997}. À ce moment-là, la zone frontale a environ 50 % de [[synapse|synapses]] en plus qu'un adulte {huttenlocher1979} !",
  t3: "Trop de connexions, c'est le bazar : le cerveau fait donc le tri, comme un jardinier qui taille un arbre. Ce grand ménage commence à la puberté et continue pendant toute la vingtaine dans la zone frontale {petanjek2011}. Les connexions souvent utilisées restent, les autres disparaissent.",
  t4: "Les neurones communiquent par de longs « câbles » que le cerveau entoure d'une gaine isolante, la [[myeline|myéline]], pour que les messages aillent plus vite. Chez un bébé, le cortex a moins de 2 % du niveau de myéline d'un adulte, et seulement environ 60 % à l'adolescence {miller2012}. La [[blanche|substance blanche]], la partie « câbles » du cerveau, n'atteint son maximum qu'à 28,7 ans {bethlehem2022} !",
  t5: "En 2018, deux équipes publient la même année des résultats opposés sur l'[[hippocampe|hippocampe]], la zone de la mémoire. Sorrells analyse 59 échantillons et ne trouve aucun jeune neurone chez les adultes de 18 à 77 ans {sorrells2018}, alors que Boldrini en trouve des milliers chez 28 personnes en bonne santé de 14 à 79 ans {boldrini2018}. Un indice arrive en 2019 : Moreno-Jiménez montre que si le cerveau reste plus de 12 heures dans le produit de conservation, la trace des jeunes neurones s'efface presque… ce qui pourrait expliquer pourquoi certains ne les voient pas {morenojimenez2019}. Enquête toujours en cours !",
  t6: "On ne gagne pas des neurones en grandissant : on apprend à mieux les connecter.",
  encB: "Entre 1955 et 1963, les essais de bombes nucléaires ont fait grimper le [[carbone14|carbone 14]] dans l'air, et donc dans notre nourriture. Chaque cellule qui naît garde dans son ADN le niveau de carbone 14 de l'année de sa naissance, comme une date de fabrication ! Grâce à cette astuce, Spalding a calculé qu'environ 700 nouveaux neurones naissent chaque jour dans chaque hippocampe… mais ils ne compensent pas ceux qu'on perd {spalding2013}.",

  // textes ajoutés pour la refonte
  volume: "Si ce ne sont pas les neurones du cortex, qu'est-ce qui fait grossir la tête d'un bébé ? Le volume du cerveau augmente de 101 % pendant la première année (il double !) et encore de 15 % la deuxième {knickmeyer2008}. Ce qui s'ajoute : des connexions, de la myéline, et surtout des [[glie|cellules de soutien]], dont le nombre augmente nettement de 0 à 3 ans alors que celui des neurones reste stable {kjaer2017}.",
  microglie: "Qui fait le ménage ? Des cellules nettoyeuses, la [[microglie|microglie]]. Les synapses peu actives reçoivent une sorte d'étiquette chimique ; la microglie les repère et les avale {paolicelli2011}{schafer2012}.",
  exceptions: "Le cortex ne gagne pas de neurones après la naissance… mais ce n'est pas vrai partout. Dans le [[cervelet|cervelet]], la couche qui fabrique des neurones continue de se diviser après la naissance : au 5e mois, environ 30 % de ses cellules se divisent encore, et elle ne disparaît que vers le 11e mois {abraham2001}. Et pendant les premiers mois, de jeunes neurones nés plus tôt voyagent encore vers le [[frontal|lobe frontal]], où ils s'installent dans les circuits {paredes2016}.",
  conclusion: "Dans le cortex, le nombre de neurones n'augmente pas après la naissance : il est déjà d'environ 20 milliards chez le nouveau-né et reste stable {larsen2006}{kjaer2017}. Il n'y a que deux petites exceptions la première année : le cervelet, qui fabrique encore des neurones {abraham2001}, et quelques jeunes neurones qui finissent leur voyage vers l'avant du cerveau {paredes2016}. Chez l'adulte, on perd ensuite lentement environ 10 % des neurones du cortex entre 20 et 90 ans {pakkenberg1997}. Ce qui change vraiment avec l'âge, ce sont les connexions, la myéline, les cellules de soutien et le volume du cerveau."
};

window.LEXIQUE_FAMILLES = [
  { k: 'cellules', t: 'Les cellules' },
  { k: 'connexions', t: 'Les connexions' },
  { k: 'vitesse', t: 'La vitesse du message' },
  { k: 'anatomie', t: 'Les parties du cerveau' },
  { k: 'methodes', t: 'Comment on le sait' }
];

window.LEXIQUE = [
  { id: 'neurone', mot: 'Neurone', fam: 'cellules', ou: 'Le neurone, La réponse',
    def: "La cellule qui fait le travail du cerveau : elle reçoit des messages, les additionne et en envoie à son tour. Un neurone a trois parties : les dendrites, le corps cellulaire et l'axone." },
  { id: 'corps', mot: 'Corps cellulaire', fam: 'cellules', ou: 'Le neurone',
    def: "La partie centrale du neurone, avec le noyau de la cellule. C'est elle qu'on compte quand on compte les neurones." },
  { id: 'dendrite', mot: 'Dendrite', fam: 'cellules', ou: 'Le neurone, Simulation',
    def: "Les branches qui partent du corps du neurone et reçoivent les messages des autres neurones. Plus un neurone a de dendrites, plus il peut écouter de voisins." },
  { id: 'axone', mot: 'Axone', fam: 'cellules', ou: 'Le neurone, Simulation',
    def: "Le long câble unique qui part du neurone pour envoyer le message aux autres, parfois très loin. C'est lui qui est entouré de myéline." },
  { id: 'glie', mot: 'Cellules gliales (cellules de soutien)', fam: 'cellules', ou: 'La réponse',
    def: "Les cellules qui entourent les neurones et les aident : elles les nourrissent, les protègent et fabriquent la myéline. Leur nombre augmente nettement après la naissance, contrairement à celui des neurones du cortex." },
  { id: 'synapse', mot: 'Synapse', fam: 'connexions', ou: 'Le neurone, La réponse, Simulation',
    def: "Le point de contact entre l'axone d'un neurone et la dendrite d'un autre. Le message y passe d'une cellule à l'autre." },
  { id: 'densite', mot: 'Densité de synapses', fam: 'connexions', ou: 'Explorer',
    def: "Le nombre de synapses dans un petit volume de cortex. Ce n'est pas le nombre total : c'est ce qu'a mesuré Huttenlocher, et c'est ce que montre la courbe du graphique." },
  { id: 'neurotransmetteur', mot: 'Neurotransmetteur', fam: 'connexions', ou: 'Simulation',
    def: "Une petite molécule libérée à la synapse : elle traverse le minuscule espace entre deux neurones et transmet le message au suivant." },
  { id: 'elagage', mot: 'Élagage synaptique', fam: 'connexions', ou: 'La réponse',
    def: "Le grand ménage : le cerveau fabrique trop de synapses, puis supprime celles qui servent peu. Les connexions souvent utilisées restent, les autres sont éliminées." },
  { id: 'microglie', mot: 'Microglie', fam: 'connexions', ou: 'La réponse',
    def: "Les cellules nettoyeuses du cerveau. Elles se déplacent, tâtent les synapses et avalent celles qui ont été marquées comme inutiles : ce sont elles qui exécutent l'élagage." },
  { id: 'influx', mot: 'Influx nerveux', fam: 'vitesse', ou: 'Simulation',
    def: "Le message électrique qui parcourt l'axone, du corps cellulaire jusqu'aux synapses." },
  { id: 'myeline', mot: 'Myéline', fam: 'vitesse', ou: 'Le neurone, La réponse, Simulation',
    def: "La gaine isolante enroulée autour de l'axone, comme du ruban autour d'un fil électrique. Elle fait circuler le message beaucoup plus vite." },
  { id: 'ranvier', mot: 'Nœud de Ranvier', fam: 'vitesse', ou: 'Le neurone, Simulation',
    def: "Les petits espaces nus entre deux gaines de myéline. Le message saute d'un nœud au suivant au lieu de parcourir tout le câble : c'est ce saut qui le rend rapide." },
  { id: 'cortex', mot: 'Cortex', fam: 'anatomie', ou: 'Partout',
    def: "La couche extérieure du cerveau, toute plissée. C'est là que se trouvent les neurones comptés dans les études de ce site. Les plis permettent d'en faire tenir beaucoup dans une petite boîte." },
  { id: 'frontal', mot: 'Lobe frontal', fam: 'anatomie', ou: 'La réponse',
    def: "L'avant du cerveau, derrière le front. Il sert à réfléchir, à planifier et à se contrôler. C'est la dernière zone à finir son élagage." },
  { id: 'grise', mot: 'Substance grise', fam: 'anatomie', ou: 'Explorer',
    def: "La partie du cerveau où se trouvent les corps des neurones et leurs contacts : le cortex, plus les noyaux gris centraux. C'est le « bureau » où le travail se fait." },
  { id: 'blanche', mot: 'Substance blanche', fam: 'anatomie', ou: 'Explorer, La réponse',
    def: "La partie « câbles » : les axones entourés de myéline qui relient les zones du cerveau. Elle paraît blanche justement à cause de la myéline." },
  { id: 'hippocampe', mot: 'Hippocampe', fam: 'anatomie', ou: 'La réponse, Le cerveau en coupe',
    def: "Une petite zone enroulée, cachée dans le lobe temporal, qui sert à fabriquer les souvenirs. Son nom vient de sa forme, qui rappelle un hippocampe (l'animal)." },
  { id: 'cervelet', mot: 'Cervelet', fam: 'anatomie', ou: 'La réponse, Le cerveau en coupe',
    def: "La structure en arrière et en dessous du cerveau, faite de plis très fins. Il règle l'équilibre et la précision des gestes. Il fabrique encore des neurones pendant la première année." },
  { id: 'calleux', mot: 'Corps calleux', fam: 'anatomie', ou: 'Le cerveau en coupe',
    def: "Le gros faisceau de câbles qui relie la moitié gauche et la moitié droite du cerveau pour qu'elles travaillent ensemble." },
  { id: 'ventricules', mot: 'Ventricules', fam: 'anatomie', ou: 'Le cerveau en coupe',
    def: "Des cavités remplies de liquide au cœur du cerveau. Elles amortissent les chocs et participent à nourrir le tissu." },
  { id: 'noyaux', mot: 'Noyaux gris centraux', fam: 'anatomie', ou: 'Le cerveau en coupe',
    def: "Des amas de corps de neurones enfouis au milieu de la substance blanche. Ils participent au déclenchement des mouvements." },
  { id: 'tronc', mot: 'Tronc cérébral', fam: 'anatomie', ou: 'Le cerveau en coupe',
    def: "La tige qui relie le cerveau à la moelle épinière. Les messages entre le corps et le cerveau passent par là, et il commande la respiration et le rythme du cœur." },
  { id: 'neurogenese', mot: 'Neurogenèse', fam: 'methodes', ou: 'La réponse',
    def: "La fabrication de nouveaux neurones. Elle est énorme avant la naissance ; la question qui divise les scientifiques est de savoir s'il en reste chez l'adulte, dans l'hippocampe." },
  { id: 'stereologie', mot: 'Stéréologie', fam: 'methodes', ou: 'La réponse',
    def: "La méthode pour compter les cellules d'un organe : on compte dans de tout petits échantillons tirés au hasard, puis on calcule le total. C'est ainsi qu'on obtient les milliards de neurones des études." },
  { id: 'irm', mot: 'IRM', fam: 'methodes', ou: 'Explorer, Le cerveau en coupe',
    def: "Imagerie par résonance magnétique : une machine qui photographie l'intérieur du corps avec un aimant très puissant, sans opérer et sans rayons X. C'est ainsi qu'on mesure le volume du cerveau chez des personnes vivantes." },
  { id: 'carbone14', mot: 'Carbone 14', fam: 'methodes', ou: 'La réponse',
    def: "Une forme particulière du carbone, présente en petite quantité dans l'air et la nourriture. Comme sa quantité a changé au fil des années, elle sert de « date de fabrication » pour les cellules." },
  { id: 'golgi', mot: 'Coloration de Golgi', fam: 'methodes', ou: 'Le neurone',
    def: "Une technique qui colore en noir quelques neurones seulement, au hasard. C'est elle qui a permis à Cajal de dessiner des neurones entiers, un par un." }
];

// Quiz : 10 questions à choix multiples (lettre de la bonne réponse dans "ok")
window.QUIZ = [
  { q: "Combien de neurones y a-t-il environ dans le cortex d'un nouveau-né ?", r: ["2 milliards", "20 milliards", "200 milliards", "Aucun : ils se forment après la naissance"], ok: 1,
    e: "Environ 19,8 milliards : autant qu'un adulte {larsen2006}." },
  { q: "Entre 0 et 3 ans, le nombre de neurones du cortex…", r: ["double", "triple", "ne change pas", "diminue de moitié"], ok: 2,
    e: "Sur 10 enfants de 0 à 3 ans, aucun changement du nombre de neurones : environ 20,7 milliards en moyenne {kjaer2017}." },
  { q: "Qu'est-ce qui augmente énormément après la naissance ?", r: ["Le nombre de neurones du cortex", "Les connexions entre les neurones", "Le nombre d'hémisphères", "Rien du tout"], ok: 1,
    e: "Ce sont les synapses, les connexions, qui explosent pendant les premières années {huttenlocher1979}." },
  { q: "Vers 1-2 ans, par rapport à un adulte, la densité de synapses de la zone frontale est…", r: ["50 % plus faible", "la même", "environ 50 % plus élevée", "dix fois plus élevée"], ok: 2,
    e: "Environ 50 % plus élevée, avant le grand ménage {huttenlocher1979}." },
  { q: "L'élagage synaptique, c'est…", r: ["la fabrication de nouveaux neurones", "la suppression des connexions peu utilisées", "la croissance du crâne", "le sommeil du cerveau"], ok: 1,
    e: "Le cerveau garde les connexions utilisées et supprime les autres, jusque pendant la vingtaine dans la zone frontale {petanjek2011}." },
  { q: "Quelles cellules « avalent » les connexions inutiles ?", r: ["Les globules rouges", "Les neurones eux-mêmes", "La microglie", "Les cellules de la peau"], ok: 2,
    e: "La microglie repère les synapses marquées et les avale {paolicelli2011}{schafer2012}." },
  { q: "Pendant la première année, le volume du cerveau…", r: ["reste le même", "double environ", "est multiplié par dix", "diminue"], ok: 1,
    e: "Il augmente de 101 % la première année {knickmeyer2008}." },
  { q: "Où le cerveau fabrique-t-il encore des neurones pendant la première année ?", r: ["Dans le cervelet", "Dans le cortex frontal", "Dans les os du crâne", "Nulle part"], ok: 0,
    e: "Dans le cervelet, la couche qui fabrique des neurones disparaît vers le 11e mois {abraham2001}." },
  { q: "À quel âge la substance blanche atteint-elle son maximum ?", r: ["3 ans", "12 ans", "environ 29 ans", "80 ans"], ok: 2,
    e: "À 28,7 ans : le cerveau n'a pas fini de se construire à 18 ans {bethlehem2022}." },
  { q: "Entre 20 et 90 ans, on perd environ…", r: ["10 % des neurones du cortex", "50 % des neurones du cortex", "90 % des neurones du cortex", "aucun neurone"], ok: 0,
    e: "Sur 94 cerveaux étudiés, la perte est d'environ 10 % {pakkenberg1997}." }
];

// Mythes ou réalité : verdict = vrai | faux | nuance | debat
window.MYTHES = [
  { m: "On naît avec tous nos neurones.", v: 'nuance', titre: "Presque vrai",
    e: "Dans le cortex, oui : environ 19,8 milliards à la naissance, et rien ne change jusqu'à 3 ans {larsen2006}{kjaer2017}. Mais le cervelet en fabrique encore pendant la première année {abraham2001}." },
  { m: "On n'utilise que 10 % de son cerveau.", v: 'faux', titre: "Faux",
    e: "L'imagerie montre que toutes les zones du cerveau travaillent, même si elles ne s'activent pas toutes en même temps {boyd2008}." },
  { m: "Un bébé a moins de connexions qu'un adulte.", v: 'faux', titre: "Faux",
    e: "Vers 1-2 ans, la zone frontale est environ 50 % plus dense en synapses qu'un adulte, avant le grand ménage {huttenlocher1979}." },
  { m: "Le cerveau a fini de se construire à 18 ans.", v: 'faux', titre: "Faux",
    e: "Le tri des connexions continue pendant la vingtaine {petanjek2011} et la substance blanche n'atteint son maximum qu'à 28,7 ans {bethlehem2022}." },
  { m: "Les neurones ne se renouvellent jamais chez l'adulte.", v: 'debat', titre: "En débat",
    e: "Dans l'hippocampe, une étude estime à environ 700 par jour les nouveaux neurones {spalding2013}, mais une autre n'en trouve aucun chez l'adulte {sorrells2018}. Les scientifiques ne sont pas d'accord." },
  { m: "Le cerveau a exactement 86 milliards de neurones.", v: 'nuance', titre: "Pas si sûr",
    e: "Ce chiffre vient d'une étude de 2009 faite sur seulement 4 cerveaux d'hommes de 50 à 71 ans. En recalculant, Alain Goriely estime que la vraie moyenne pourrait se situer entre 73 et 99 milliards ; une autre étude, sur 5 femmes âgées, donne entre 61 et 73 milliards {goriely2024}." },
  { m: "En vieillissant, on perd la moitié de ses neurones.", v: 'faux', titre: "Faux",
    e: "La perte dans le cortex est d'environ 10 % entre 20 et 90 ans, sur 94 cerveaux étudiés {pakkenberg1997}." },
  { m: "Il y a des gens “cerveau gauche” et des gens “cerveau droit”.", v: 'faux', titre: "Faux",
    e: "En étudiant 1 011 personnes, les chercheurs n'ont trouvé aucun signe de personnes « cerveau gauche » ou « cerveau droit » : chacun utilise les deux côtés {nielsen2013}." }
];
