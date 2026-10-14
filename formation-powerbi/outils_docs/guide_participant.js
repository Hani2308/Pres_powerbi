// Construit 02_guide/Guide_participant.docx
const path = require("path");
const fs = require("fs");
const C = require("./charte_docx");
const { p, h1, h2, h3, puce, etapes, encadre, capture, code, tableau, saut, K, F, runs, Paragraph, TextRun, AlignmentType } = C;

const V = JSON.parse(fs.readFileSync(path.join(__dirname, "../03_donnees/valeurs_attendues.json"), "utf8"));
const D = JSON.parse(fs.readFileSync(path.join(__dirname, "../01_presentation/build/donnees_slides.json"), "utf8"));
const nf = (x, d = 0) => x.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\u202F/g, "\u00A0").replace(/^-/, "\u2212");

const tp = (titre, duree, intro) => [h2(titre), p(`**${duree}.** ${intro}`)];
const attendu = (t) => encadre([p(`**Résultat attendu.** ${t}`, { after: 0 })]);
const decroche = (t) => p(`**Vous avez décroché ?** ${t}`, { color: K.gris });

const corps = [];

// Couverture
corps.push(
  new Paragraph({ children: [], spacing: { before: 2400 } }),
  new Paragraph({ children: [new TextRun({ text: C.fr("Initiation à Power BI"), font: F.titre, size: 64, color: K.petrole })], spacing: { after: 200 } }),
  new Paragraph({ children: [new TextRun({ text: C.fr("Du fichier du lundi au rapport qui se met à jour seul"), font: F.titre, size: 34, color: K.encre })], spacing: { after: 600 } }),
  p("Guide participant", { size: 26 }),
  p("Formation d'une journée, de 9h00 à 16h30", { color: K.gris }),
  p("Formateur : Hani Sahir, data scientist", { color: K.gris }),
  new Paragraph({ children: [], spacing: { before: 2400 } }),
  p("Ce guide reprend chaque manipulation de la journée, clic par clic. Gardez-le : il vous servira la première fois que vous referez l'exercice avec vos propres fichiers.", { color: K.gris }),
);

// Avant de commencer
corps.push(
  h1("Avant de commencer"),
  h2("Vos fichiers"),
  p("Tout se passe dans le dossier **C:\\Formation_PBI\\** :"),
  puce("**Ventes_Retail.xlsx** : l'export de caisse d'Atlas Bazar, du 1er octobre 2024 au 30 septembre 2026. C'est le fil rouge de la journée."),
  puce("**Ventes_Retail_MAJ.xlsx** : le même export, prolongé jusqu'au 11 octobre 2026. Il sert à voir l'actualisation."),
  puce("**rattrapage\\** : cinq fichiers Power BI, R1 à R5, un par étape de la journée. Si vous décrochez, vous ouvrez le fichier indiqué et vous repartez avec tout le monde."),
  p("Ne déplacez pas ces fichiers : les fichiers de rattrapage vont chercher l'export à cet endroit précis."),
  h2("Le fil rouge : Atlas Bazar"),
  p("Atlas Bazar est une enseigne fictive de magasins de proximité : épicerie, boissons, hygiène, maison, textile, fournitures scolaires. Douze magasins dans dix villes, de Tanger à Agadir, et un treizième ouvert à Kénitra en mars 2026. Les montants sont en dirhams (MAD)."),
  p("L'export contient quatre feuilles :"),
  tableau(["Feuille", "Contenu", "Une ligne ="], [
    ["Export_Ventes", "Date, N° ticket, Code magasin, Réf produit, Quantité, Prix unitaire", "un article vendu"],
    ["Magasins", "Code magasin, Nom, Ville - Région, Surface, Date d'ouverture", "un magasin"],
    ["Produits", "Réf produit, Désignation, Catégorie, Prix catalogue", "un produit"],
    ["Calendrier", "Date, Année, N° mois, Mois, Trimestre", "un jour"],
  ], [1900, 5538, 2200]),
  p(""),
  p("Comme tout export métier, il a des défauts. Les trouver et les corriger une fois pour toutes, c'est l'objet de la matinée."),
  h2("Trois différences avec Excel à garder en tête"),
  puce("On ne corrige jamais le fichier source. On écrit une recette de nettoyage que Power BI rejoue à chaque nouvel export."),
  puce("Les formules DAX sont en anglais, même avec Power BI en français, et leurs arguments se séparent par une **virgule**."),
  puce("On ne vise pas des cellules (A2:A100), on vise des colonnes entières : Ventes[Quantité]."),
);

// TP 1
corps.push(
  h1("Module 1 : importer"),
  ...tp("TP 1 : importer les quatre feuilles", "15 minutes", "On importe l'export sans rien charger dans le rapport : on s'arrête dans Power Query, l'atelier de nettoyage."),
  h3("Avant d'importer : couper la détection automatique des relations"),
  ...etapes([
    "Dans Power BI Desktop, Fichier > Options et paramètres > Options.",
    "Dans la colonne de gauche, sous **Fichier actuel**, cliquez sur **Chargement des données**.",
    "Rubrique Relations : décochez les deux cases. Aujourd'hui, c'est vous qui reliez les tables, pour voir ce qui se passe sans relation.",
    "OK.",
  ]),
  h3("Importer"),
  ...etapes([
    "Accueil > **Obtenir les données** > **Classeur Excel**.",
    "Sélectionnez C:\\Formation_PBI\\Ventes_Retail.xlsx, puis Ouvrir.",
    "Dans le Navigateur, cochez les quatre feuilles : Export_Ventes, Magasins, Produits, Calendrier.",
    "Cliquez sur **Transformer les données**. Pas sur Charger.",
  ]),
  ...capture("C09", "Le Navigateur, quatre feuilles cochées. Le bouton à utiliser est Transformer les données."),
  ...etapes([
    "L'éditeur Power Query s'ouvre. Dans le volet Requêtes à gauche, double-cliquez sur Export_Ventes et renommez-la **Ventes**.",
  ]),
  attendu("Quatre requêtes dans le volet de gauche : Ventes, Magasins, Produits, Calendrier."),
  decroche("Ouvrez C:\\Formation_PBI\\rattrapage\\R1_import.pbix, puis Accueil > Transformer les données."),
  encadre([p("**Si vous avez cliqué sur Charger.** Rien n'est perdu : Accueil > Transformer les données vous ramène dans Power Query. Mais regardez d'abord la table dans la vue Table : la ligne de titre de l'export a pris la place des noms de colonnes, et la ligne TOTAL est comptée comme une vente. C'est ce qui arrive à un export métier chargé tel quel.", { after: 0 })]),
);

// TP 2a
corps.push(
  h1("Module 2 : nettoyer avec Power Query"),
  p("Chaque clic dans Power Query ajoute une ligne dans le volet **Étapes appliquées**, à droite. Cliquer sur une étape montre la table à ce moment-là ; la petite croix supprime l'étape. Vous ne pouvez rien casser : le fichier Excel n'est jamais modifié."),
  ...capture("C13", "L'éditeur Power Query : la barre de formule en haut (Affichage > Barre de formule), Étapes appliquées à droite."),
  encadre([p("**Une habitude à prendre.** Avant chaque nouveau clic, vérifiez que la dernière étape de la liste est sélectionnée. Sinon, Power Query insère votre nouvelle étape au milieu de la recette.", { after: 0 })]),
  ...tp("TP 2a : remettre l'export d'aplomb", "23 minutes", "Lignes de titre, en-têtes, ligne TOTAL, dates. Tout se fait dans la requête Ventes."),
  ...etapes([
    "Accueil > Supprimer les lignes > **Supprimer les lignes du haut**. Nombre de lignes : 2. Le titre de l'export et la ligne vide disparaissent.",
    "Accueil > **Utiliser la première ligne pour les en-têtes**. Les colonnes s'appellent maintenant Date, N° ticket, etc.",
    "Si une étape **Type modifié** est apparue toute seule dans Étapes appliquées, supprimez-la avec sa croix. Elle a peut-être lu les dates à l'américaine.",
    "Cliquez sur la flèche de filtre de la colonne **N° ticket**, décochez **(null)**, OK. La ligne vide et la ligne TOTAL GÉNÉRAL du bas de l'export disparaissent.",
    "Colonne Date : cliquez sur l'icône **ABC** à gauche de son en-tête, puis sur la dernière ligne du menu, **Utilisation des paramètres régionaux…**",
    "Type de données : **Date**. Paramètres régionaux : **Français (Maroc)**. OK.",
    "Quantité : icône de type > **Nombre entier**. Prix unitaire : icône de type > **Nombre décimal**.",
  ]),
  ...capture("C15", "Le menu de l'icône de type et la boîte Modifier le type avec les paramètres régionaux."),
  attendu(`${nf(V.lignes_brutes_export)} lignes, aucune cellule « Error » dans la colonne Date. Vérifiez une date dont le jour dépasse 12 : le 25/12/2024 doit rester le 25 décembre.`),
  p("**Pour compter les lignes de toute la table** : en bas de la fenêtre, cliquez sur « Profilage de colonne basé sur les 1000 premières lignes » et choisissez l'ensemble des données. Sinon, Power Query ne regarde que les 1 000 premières lignes.", { color: K.gris }),
  h3("Pourquoi les paramètres régionaux ?"),
  p("L'export écrit ses dates en texte, jour/mois/année. Un PC réglé en anglais les lit mois/jour/année : le 13/02 devient « Error » (il n'y a pas de 13e mois), et le 03/04 devient le 4 mars, sans aucun message. En précisant Français (Maroc), la lecture est la même sur tous les PC."),
  ...capture("C14a", "À gauche : la colonne Date lue avec des paramètres anglais. Error et dates inversées."),
  h3("Pourquoi filtrer N° ticket plutôt que supprimer les lignes du bas ?"),
  p("L'export de la semaine prochaine n'aura peut-être pas exactement le même nombre de lignes vides en bas. « Supprimer les 2 dernières lignes » supprimerait alors une vraie vente. « Garder les lignes qui ont un numéro de ticket » marche quelle que soit la longueur de l'export."),
);

// TP 2b
corps.push(
  ...tp("TP 2b : nettoyer le texte et les doublons", "35 minutes", "On sépare la ville de sa région, on unifie l'écriture des villes, et on retire les lignes recollées en double."),
  h3("Requête Magasins"),
  ...etapes([
    "Sélectionnez la colonne Ville - Région. Accueil > **Fractionner la colonne** > **Par délimiteur**.",
    "Délimiteur : Personnalisé. Tapez espace, tiret, espace. Un tiret seul couperait aussi « Casablanca-Settat » en deux.",
    "Renommez les deux nouvelles colonnes **Ville** et **Région** (double-clic sur l'en-tête).",
    "Colonne Ville sélectionnée : Transformer > Format > **Supprimer les espaces**.",
    "Puis Transformer > Format > **Majuscule à chaque mot**. CASABLANCA devient Casablanca, casa devient Casa.",
    "Accueil > **Remplacer les valeurs**. Valeur à rechercher : Casa. Remplacer par : Casablanca. Ouvrez **Options avancées** et cochez **Mettre en correspondance tout le contenu de la cellule**. OK.",
    "Cliquez sur l'en-tête de la première colonne, puis Ctrl+A pour sélectionner toutes les colonnes. Accueil > Supprimer les lignes > **Supprimer les doublons**.",
  ]),
  ...capture("C18", "La boîte Fractionner la colonne par délimiteur, avec le délimiteur personnalisé."),
  encadre([p("**Le piège de l'étape 6.** Sans la case « Mettre en correspondance tout le contenu de la cellule », Power Query remplace « Casa » partout où il le trouve, y compris au début de « Casablanca ». Résultat : « Casablancablanca ». Si ça vous arrive, supprimez l'étape et refaites-la avec la case cochée.", { after: 0 })]),
  h3("Requête Ventes"),
  ...etapes([
    "Colonne Code magasin sélectionnée : Transformer > Format > **Supprimer les espaces**.",
    "Clic sur l'en-tête de la première colonne, Ctrl+A, puis Accueil > Supprimer les lignes > **Supprimer les doublons**.",
    "Accueil > **Fermer et appliquer**, puis Fichier > Enregistrer sous C:\\Formation_PBI\\ma_formation.pbix.",
  ]),
  attendu(`Ventes : ${nf(V.lignes_apres_nettoyage)} lignes. Magasins : 12 lignes. Le filtre de la colonne Ville montre 10 villes.`),
  h3("Si vous ne trouvez pas le bon nombre de lignes"),
  tableau(["Vous avez", "Cause probable", "Correction"], [
    ["13 lignes dans Ventes", "Supprimer les doublons avec une seule colonne sélectionnée : il garde une ligne par magasin.", "Supprimez l'étape, Ctrl+A, refaites-la."],
    [`${nf(V.lignes_brutes_export)} lignes dans Ventes`, "Doublons supprimés avant les espaces : « MAG-03 » et « MAG-03 » suivi d'un espace sont restés différents.", "Faites glisser l'étape de nettoyage au-dessus de l'étape Doublons dans Étapes appliquées."],
    ["13 lignes dans Magasins", "MAG-05 est en double, avec un espace après Salé sur l'une des lignes.", "Supprimer les espaces sur Ville avant Supprimer les doublons."],
    ["« Casablancablanca »", "Remplacer les valeurs sans « tout le contenu de la cellule ».", "Supprimez l'étape et refaites-la avec la case cochée."],
  ], [2100, 4300, 3238]),
  p(""),
  decroche("Ouvrez C:\\Formation_PBI\\rattrapage\\R2_nettoye.pbix. C'est le point de départ de l'après-midi."),
  h3("L'actualisation"),
  p(`La semaine suivante, l'export du 12 octobre remplace celui du 1er octobre, sous le même nom. Accueil > **Actualiser** : Power BI rejoue toutes vos étapes sur le nouveau fichier. ${nf(D.maj_lignes_brutes)} lignes brutes deviennent ${nf(V.maj_lignes_apres_nettoyage)} ventes propres, sans que personne ait retouché quoi que ce soit.`),
);

// TP 3
corps.push(
  h1("Module 3 : relier les tables"),
  p("Sans relation, Power BI ne sait pas quelle vente appartient à quel magasin. Un visuel « quantité par ville » affiche alors le total général sur chaque ville. Les relations remplacent les RECHERCHEV d'Excel, une fois pour toutes."),
  p("On organise les tables en **étoile** : la table Ventes au centre (une ligne par vente), les tables de référence autour (une ligne par magasin, par produit, par jour). Chaque lien se lit « un magasin a plusieurs ventes »."),
  ...tp("TP 3 : relier les quatre tables", "20 minutes", "Tout se fait dans la vue Modèle, la troisième icône de la barre de gauche."),
  ...etapes([
    "Glissez **Ventes[Code magasin]** sur **Magasins[Code magasin]**.",
    "Glissez **Ventes[Réf produit]** sur **Produits[Réf produit]**.",
    "Glissez **Ventes[Date]** sur **Calendrier[Date]**.",
    "Double-cliquez sur chaque lien et vérifiez : Cardinalité un-à-plusieurs (ou plusieurs-à-un, c'est la même chose lue dans l'autre sens), Direction du filtrage croisé **Unique**.",
    "Dans le volet Données, clic droit sur la table Calendrier > **Marquer comme table de dates**, colonne Date.",
    "Fichier > Options et paramètres > Options > Fichier actuel > Chargement des données : décochez **Date/heure automatique**.",
  ]),
  ...capture("C25a", "La vue Modèle avec les quatre tables reliées en étoile."),
  attendu("Trois relations un-à-plusieurs. Dans un visuel Table avec la ville et la somme de Quantité, une seule ligne « (Vide) »."),
  h3("Ce qui peut arriver"),
  puce("**Power BI propose « plusieurs-à-plusieurs »** entre Magasins et Ventes : il reste un doublon dans Magasins. Retour dans Power Query (Accueil > Transformer les données), Supprimer les doublons sur Magasins, Fermer et appliquer. N'acceptez jamais un plusieurs-à-plusieurs sans avoir cherché le doublon."),
  puce("**Une ligne « (Vide) »** dans un visuel par ville : ce sont les ventes de MAG-13, un magasin ouvert à Kénitra en mars 2026 que personne n'a ajouté à la feuille Magasins. On ne le corrige pas dans Power BI : on prévient la personne qui tient le référentiel."),
  puce("**Les visuels par mois sont vides** : la colonne Date de Ventes est restée en texte. Retour au TP 2a, étapes 5 et 6."),
  puce("**Un tableau Catégorie / nombre de magasins affiche 12 partout** : le filtre descend des tables de référence vers les ventes, jamais l'inverse. Il ne remonte pas de Ventes vers Magasins. On compte côté Ventes, avec DISTINCTCOUNT(Ventes[Code magasin])."),
  decroche("Ouvrez C:\\Formation_PBI\\rattrapage\\R3_modele.pbix."),
);

// TP 4
corps.push(
  h1("Module 4 : calculer avec DAX"),
  p("Deux sortes de formules :"),
  puce("une **colonne calculée** calcule une valeur pour chaque ligne et la stocke, comme une formule tirée vers le bas dans Excel ;"),
  puce("une **mesure** calcule pour chaque case du visuel, et se recalcule à chaque clic, comme une case de tableau croisé dynamique."),
  p("En pratique : si la formule additionne, compte ou fait une moyenne, c'est une mesure."),
  ...tp("TP 4 : les sept formules", "25 minutes", "Tapez-les plutôt que de les coller : c'est en tapant qu'on apprend où va la virgule. Toutes les formules sont dans l'aide-mémoire, page suivante."),
  ...etapes([
    "Vue Table, table Ventes sélectionnée : Outils de table > **Nouvelle colonne**. Tapez la formule Montant.",
    "Accueil > **Nouvelle mesure**, table Ventes sélectionnée dans le volet Données. Tapez CA, puis Nb tickets, puis Panier moyen.",
    "Puis CA Casablanca, CA N-1 et Évolution vs N-1.",
    "Formats : cliquez sur une mesure, onglet **Outils de mesure**. CA en nombre entier avec séparateur de milliers ; Évolution vs N-1 en pourcentage.",
    "Construisez une carte par mesure et comparez avec la page Valeurs attendues.",
  ]),
  attendu(`CA ${nf(V.ca_total)} MAD. Nb tickets ${nf(V.nb_tickets)}. Panier moyen ${nf(V.panier_moyen, 2)} MAD. En mars 2026, évolution vs N-1 de ${nf(V.evol_mars_2026 * 100, 1)} %.`),
  decroche("Ouvrez C:\\Formation_PBI\\rattrapage\\R4_mesures.pbix."),
  h3("Si une formule refuse de passer"),
  tableau(["Symptôme", "Cause habituelle"], [
    ["Message de syntaxe incorrecte sur « ; »", "Point-virgule au lieu de la virgule (réflexe Excel)."],
    ["La formule ne reconnaît pas « Casablanca »", "Guillemets courbes copiés depuis Word ou un mail. DAX veut des guillemets droits \"…\"."],
    ["CA N-1 reste vide", "Calendrier n'est pas marqué comme table de dates, ou la relation Ventes[Date] - Calendrier[Date] manque."],
    ["Une colonne CA affiche le même total sur chaque ligne", "CA créé avec Nouvelle colonne au lieu de Nouvelle mesure. Supprimez la colonne, recréez une mesure."],
    ["La mesure est introuvable", "Elle a été rangée dans une autre table. Outils de mesure > Table d'accueil > Ventes."],
    ["Évolution affiche −0,26", "Le format pourcentage n'est pas appliqué."],
  ], [4000, 5638]),
);

// TP 5
corps.push(
  h1("Module 5 : montrer"),
  h3("Trier les mois dans le bon ordre"),
  p("Power BI trie le texte par ordre alphabétique : avril, août, décembre, février. Pour remettre l'ordre du calendrier :"),
  ...etapes([
    "Vue Table, table Calendrier, cliquez sur la colonne **Mois**.",
    "Outils de colonne > **Trier par colonne** > **N° mois**.",
  ]),
  ...capture("C37a", "Le même graphique avant et après le tri par colonne."),
  ...tp("TP 5 : construire la page Ventes", "25 minutes", "Une page répond à une question. Celle-ci répond à « comment vont les ventes ? ». En haut ce qu'on lit en trois secondes, au milieu l'évolution, en bas le détail."),
  ...etapes([
    "Quatre **cartes** : CA, Nb tickets, Panier moyen, Évolution vs N-1. Glissez les mesures (icône de calculatrice), pas les colonnes.",
    "Un **graphique en colonnes groupées** : Calendrier[Mois] en axe X, CA et CA N-1 en axe Y.",
    "Un **graphique à barres** : Magasins[Ville] en axe Y, CA en axe X.",
    "Une **matrice** : Produits[Catégorie] en lignes, Calendrier[Année] en colonnes, CA en valeurs.",
    "Deux **segments** : Calendrier[Année] et Produits[Catégorie].",
    "Cliquez sur Casablanca dans le graphique à barres : toute la page se filtre. Cliquez à nouveau pour annuler.",
    "Fichier > Enregistrer.",
  ]),
  ...capture("C38", "La page Ventes terminée."),
  p("**Pour aller plus loin** : sélectionnez un visuel, puis Format > **Modifier les interactions**. Une petite icône apparaît sur chaque autre visuel ; « Aucun » l'empêche d'être filtré par le visuel sélectionné. Utile pour garder le total de l'enseigne visible pendant qu'on regarde une ville."),
  decroche("Ouvrez C:\\Formation_PBI\\rattrapage\\R5_rapport.pbix et comparez avec votre page."),
);

// Valeurs attendues
corps.push(
  h1("Valeurs attendues"),
  p("Si vos chiffres diffèrent, l'écart vient presque toujours du nettoyage du matin : nombre de lignes de Ventes, doublons, dates."),
  tableau(["Ce que vous vérifiez", "Valeur attendue"], [
    ["Lignes de Ventes après nettoyage", nf(V.lignes_apres_nettoyage)],
    ["Lignes de Magasins après nettoyage", "12"],
    ["Villes distinctes", "10"],
    ["CA (MAD)", nf(V.ca_total, 2)],
    ["Nb tickets", nf(V.nb_tickets)],
    ["Panier moyen (MAD)", nf(V.panier_moyen, 2)],
    ["CA Casablanca (MAD)", nf(V.ca_casablanca, 2)],
    ["CA de mars 2026 (MAD)", nf(V.ca_mars_2026, 2)],
    ["CA N-1 de mars 2026, soit mars 2025 (MAD)", nf(V.ca_mars_2025, 2)],
    ["Évolution vs N-1, mars 2026", `${nf(V.evol_mars_2026 * 100, 1)} %`],
    ["Évolution vs N-1, février 2026", `+${nf(V.evol_fevrier_2026 * 100, 1)} %`],
    ["CA de la ligne « (Vide) », MAG-13 (MAD)", nf(V.ca_mag13_vide, 2)],
  ], [6138, 3500], { droite: [1] }),
  p(""),
  p("Pourquoi mars 2026 recule alors que février progresse : le Ramadan a commencé vers le 2 mars en 2025 et vers le 19 février en 2026. SAMEPERIODLASTYEAR compare des dates du calendrier, pas des périodes de fête : c'est à vous de lire le chiffre.", { color: K.gris }),
);

// Aide-mémoire DAX
const formules = [
  ["Montant", "Colonne calculée", ["Montant = Ventes[Quantité] * Ventes[Prix unitaire]"], "Le montant de chaque ligne de vente. Outils de table > Nouvelle colonne."],
  ["CA", "Mesure", ["CA = SUM(Ventes[Montant])"], "La somme des montants des lignes visibles dans la case du visuel."],
  ["Nb tickets", "Mesure", ["Nb tickets = DISTINCTCOUNT(Ventes[N° ticket])"], "Le nombre de tickets différents : un ticket de trois articles compte une fois. DISTINCTCOUNT compte aussi une valeur vide comme une valeur."],
  ["Panier moyen", "Mesure", ["Panier moyen = DIVIDE([CA], [Nb tickets])"], "DIVIDE renvoie une case vide si le dénominateur est nul, là où la barre / afficherait « Infini »."],
  ["CA Casablanca", "Mesure", ["CA Casablanca =", "CALCULATE([CA], Magasins[Ville] = \"Casablanca\")"], "CALCULATE remplace le filtre sur la ville par Casablanca avant de calculer. Dans un tableau par ville, la même valeur s'affiche donc sur chaque ligne."],
  ["CA N-1", "Mesure", ["CA N-1 =", "CALCULATE([CA], SAMEPERIODLASTYEAR(Calendrier[Date]))"], "Le CA de la même période un an plus tôt. Exige la table Calendrier marquée comme table de dates et reliée à Ventes."],
  ["Évolution vs N-1", "Mesure", ["Évolution vs N-1 = DIVIDE([CA] - [CA N-1], [CA N-1])"], "L'évolution en pourcentage. Pensez au format pourcentage."],
];
corps.push(h1("Aide-mémoire DAX"));
corps.push(p("Les noms de fonctions restent en anglais. Le séparateur est la virgule. Une mesure se réutilise entre crochets, sans nom de table : [CA]."));
formules.forEach(([nom, type, lignes, explication]) => {
  corps.push(h3(`${nom} (${type.toLowerCase()})`), code(lignes), p(explication, { after: 200 }));
});
corps.push(
  h2("Excel et DAX côte à côte"),
  tableau(["Dans Excel", "Dans Power BI"], [
    ["=SOMME(F2:F5000)", "SUM(Ventes[Montant])"],
    ["Point-virgule entre arguments", "Virgule entre arguments"],
    ["=F2/G2 et #DIV/0!", "DIVIDE([CA], [Nb tickets]), case vide si zéro"],
    ["RECHERCHEV vers une autre feuille", "Une relation dans la vue Modèle"],
    ["Une formule tirée vers le bas", "Une colonne calculée"],
    ["Une case de tableau croisé dynamique", "Une mesure"],
  ], [4819, 4819]),
);

// Glossaire
corps.push(
  h1("Glossaire"),
  tableau(["Terme", "Ce que ça veut dire ici"], [
    ["Power Query", "L'atelier de nettoyage de Power BI. On y accède par Accueil > Transformer les données."],
    ["Étapes appliquées", "La liste des transformations d'une requête, dans l'ordre. C'est la recette rejouée à chaque actualisation."],
    ["Actualiser", "Relire les fichiers sources et rejouer toutes les étapes. Accueil > Actualiser."],
    ["Paramètres régionaux", "La convention de lecture des dates et des nombres (jour/mois ou mois/jour, virgule ou point décimal)."],
    ["Modèle", "L'ensemble des tables chargées et de leurs relations."],
    ["Relation", "Le lien entre deux tables par une colonne commune, comme le code magasin."],
    ["Cardinalité", "Le type de lien : un-à-plusieurs (un magasin, plusieurs ventes) est le cas normal."],
    ["Schéma en étoile", "Une table des ventes au centre, des tables de référence autour."],
    ["Table de dates", "Une table avec une ligne par jour, sans trou, qui permet les comparaisons d'une année sur l'autre."],
    ["DAX", "Le langage des formules de Power BI."],
    ["Colonne calculée", "Une formule calculée et stockée pour chaque ligne d'une table."],
    ["Mesure", "Une formule calculée à la demande pour chaque case d'un visuel, selon les filtres actifs."],
    ["Segment", "Un visuel de filtre que le lecteur du rapport manipule (année, catégorie…)."],
    ["(Vide)", "La case où Power BI range les lignes qui n'ont pas de correspondance dans la table reliée."],
  ], [2400, 7238]),
);

// Quiz
const quiz = [
  ["Chaque lundi, l'export arrive avec une ligne TOTAL en bas. Où la supprime-t-on ?", ["Dans le fichier Excel, chaque lundi avant d'actualiser", "Dans Power Query, une fois pour toutes", "Dans le rapport, avec un filtre sur chaque visuel"], 1,
    "Power Query enregistre l'étape et la rejoue à chaque actualisation. Corriger le fichier source serait à refaire chaque semaine."],
  ["Dans le Navigateur, quel bouton choisir pour un export métier ?", ["Charger", "Transformer les données", "Les deux se valent"], 1,
    "Charger envoie le fichier tel quel dans le rapport. Transformer les données passe d'abord par Power Query."],
  ["Lue avec des paramètres régionaux Anglais (États-Unis), la date texte 03/04/2025 devient :", ["une erreur", "le 3 avril 2025", "le 4 mars 2025"], 2,
    "Mois/jour/année : 03 devient le mois. Aucune erreur n'est affichée, c'est ce qui rend le problème dangereux."],
  ["Le panier moyen doit être créé comme :", ["une colonne calculée", "une mesure", "une colonne dans Power Query"], 1,
    "Un panier moyen n'a de sens que pour un groupe de tickets ; il doit se recalculer selon les filtres. C'est une mesure."],
  ["Avant Supprimer les doublons sur la table Ventes, il faut :", ["supprimer les espaces et sélectionner toutes les colonnes", "trier la table par date", "rien de particulier"], 0,
    "Supprimer les doublons compare caractère par caractère et ne regarde que les colonnes sélectionnées."],
  ["Power BI propose « plusieurs-à-plusieurs » entre Magasins et Ventes. Que faites-vous d'abord ?", ["J'accepte, Power BI sait ce qu'il fait", "Je cherche un doublon dans Magasins", "Je passe la direction du filtrage sur Les deux"], 1,
    "Une table de référence doit avoir une ligne par code. Plusieurs-à-plusieurs signale presque toujours un doublon."],
  ["Un tableau Catégorie / nombre de magasins affiche 12 sur chaque ligne. Pourquoi ?", ["Tous les magasins vendent toutes les catégories", "Le filtre ne remonte pas de Ventes vers Magasins", "Il manque une table de dates"], 1,
    "Le filtre part de Produits et descend vers Ventes, mais ne remonte pas vers Magasins. On compte côté Ventes avec DISTINCTCOUNT."],
  ["Une ligne « (Vide) » apparaît dans un visuel par ville. Elle contient :", ["les ventes dont le code magasin n'existe pas dans Magasins", "les ventes à zéro dirham", "les lignes supprimées par Power Query"], 0,
    "Ici, les ventes de MAG-13, absent du référentiel. On prévient la personne qui tient le fichier Magasins."],
  ["Pourquoi DIVIDE plutôt que la barre de division / ?", ["DIVIDE est plus rapide", "DIVIDE renvoie une case vide quand le dénominateur vaut zéro", "La barre de division n'existe pas en DAX"], 1,
    "Avec /, une division par zéro affiche « Infini ». DIVIDE laisse la case vide."],
  ["Les mois s'affichent dans l'ordre avril, août, décembre… Comment corriger ?", ["Renommer les mois 01-janvier, 02-février…", "Trier la colonne Mois par la colonne N° mois", "Trier le visuel par CA décroissant"], 1,
    "Outils de colonne > Trier par colonne > N° mois. Le tri s'applique ensuite à tous les visuels."],
];
corps.push(h1("Quiz"), p("Dix questions, cinq minutes. Une seule bonne réponse par question. La correction est à la page suivante : ne la regardez pas tout de suite."));
quiz.forEach(([q, choix], i) => {
  corps.push(p(`**${i + 1}. ${q}**`, { after: 60, keepNext: true }));
  choix.forEach((c, j) => corps.push(p(`${"abc"[j]}) ${c}`, { after: 40, keepNext: j < choix.length - 1 })));
  corps.push(new Paragraph({ children: [], spacing: { after: 100 } }));
});
corps.push(h1("Corrigé du quiz"));
quiz.forEach(([q, choix, bonne, pourquoi], i) => {
  corps.push(p(`**${i + 1}. Réponse ${"abc"[bonne]}) ${choix[bonne]}.** ${pourquoi}`));
});

const doc = C.documentAvecCharte(corps, "Initiation à Power BI : guide participant");
C.ecrire(doc, path.join(__dirname, "../02_guide/Guide_participant.docx"));
