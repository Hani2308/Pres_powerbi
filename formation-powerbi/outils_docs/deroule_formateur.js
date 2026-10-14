// Construit 04_formateur/Deroule_formateur.docx
const path = require("path");
const fs = require("fs");
const C = require("./charte_docx");
const { p, h1, h2, h3, puce, etapes, encadre, code, tableau, K, F, Paragraph, TextRun } = C;

const V = JSON.parse(fs.readFileSync(path.join(__dirname, "../03_donnees/valeurs_attendues.json"), "utf8"));
const D = JSON.parse(fs.readFileSync(path.join(__dirname, "../01_presentation/build/donnees_slides.json"), "utf8"));
const nf = (x, d = 0) => x.toLocaleString("fr-FR", { minimumFractionDigits: d, maximumFractionDigits: d }).replace(/\u202F/g, "\u00A0").replace(/^-/, "\u2212");

const corps = [];

corps.push(
  new Paragraph({ children: [], spacing: { before: 1800 } }),
  new Paragraph({ children: [new TextRun({ text: C.fr("Initiation à Power BI"), font: F.titre, size: 56, color: K.petrole })], spacing: { after: 160 } }),
  new Paragraph({ children: [new TextRun({ text: C.fr("Déroulé formateur"), font: F.titre, size: 34 })], spacing: { after: 500 } }),
  p("Document interne. Il complète les notes de chaque slide de la présentation : ici, la journée vue d'en haut, la préparation, et la fabrication des fichiers de rattrapage."),
  p("Hani Sahir, data scientist", { color: K.gris }),
  h2("La journée en une page"),
  tableau(["Repère", "Détail"], [
    ["Public", "8 à 14 personnes. Métiers qui vivent dans Excel (tous niveaux, on vise SOMME et le filtre automatique) et quelques profils techniques. Personne n'a ouvert Power BI."],
    ["Objectif", "À 16h30, chacun a construit de ses mains un rapport qui se met à jour en remplaçant l'export source et en cliquant sur Actualiser."],
    ["Horaires", "9h00 à 16h30. Pauses à 11h00 et 15h20 (15 min), déjeuner de 12h30 à 13h30. 360 minutes effectives."],
    ["Part de manipulation", "188 minutes de manipulation plus 10 minutes de mise en commun sur l'écran des participants : 52 à 55 % de la journée. On raccourcit l'exposé, jamais un TP."],
    ["Fil rouge", "Export de caisse d'Atlas Bazar (enseigne fictive, 12 magasins, 10 villes, montants en MAD), avec ses défauts réels : voir la feuille Corrigé formateur de 03_donnees/Ventes_Retail.xlsx."],
    ["Supports", "01_presentation/Initiation_Power_BI.pptx (40 slides, notes à l'oral sur chaque slide), 02_guide/Guide_participant.docx (un exemplaire imprimé par personne), 5 fichiers .pbix de rattrapage."],
  ], [2000, 7638]),
);

// Préparation
corps.push(
  h1("Préparer la salle"),
  h2("Une semaine avant"),
  puce("Demander la version de Power BI Desktop installée sur les postes, et la langue de l'interface (le support est fait pour le français). Installer la même version sur votre PC pour les captures et les fichiers de rattrapage."),
  puce("Faire les 30 captures (05_captures/liste_captures.md) et les insérer dans la présentation."),
  puce("Créer les cinq fichiers de rattrapage (procédure plus bas) et les tester sur un autre PC."),
  puce("Installer les polices de 01_presentation/polices/ sur le PC qui projette. Si ce n'est pas le vôtre : Fichier > Options > Enregistrement > Incorporer les polices dans le fichier."),
  puce("Imprimer le guide participant, un par personne, en recto verso. La dernière page (corrigé du quiz) peut être agrafée à part."),
  h2("La veille"),
  puce("Copier sur chaque poste le dossier **C:\\Formation_PBI\\** : Ventes_Retail.xlsx et Ventes_Retail_MAJ.xlsx (pris dans 03_donnees/participants/, sans la feuille de corrigé), et le sous-dossier rattrapage\\ avec R1 à R5."),
  puce("Ouvrir Power BI Desktop une fois sur chaque poste : la première ouverture est lente et propose de se connecter. Autant le faire avant les participants."),
  puce("Répéter la démo de 9h15, chronomètre en main : 10 minutes, pas plus."),
  h2("Le matin, à 8h30"),
  puce("Vidéoprojecteur branché, résolution vérifiée, R5_rapport.pbix ouvert en arrière-plan."),
  puce("Ventes_Retail.xlsx d'origine bien en place (pas la version MAJ)."),
  puce("Un paperboard, ou une page du tableau blanc qui restera visible toute la journée, pour noter les fichiers cités au tour de table."),
);

// Minutage
const minutage = [
  ["9h00", "10", "Accueil, tour de table", "1-2", "Q"],
  ["9h10", "5", "La douleur du lundi", "3", "E"],
  ["9h15", "10", "Démo du rapport fini et de l'actualisation", "4", "E"],
  ["9h25", "5", "La journée en un schéma", "5", "E"],
  ["9h30", "10", "Vérification des postes, pièges dans Excel", "6-7", "M"],
  ["9h40", "15", "Tour de l'écran, Navigateur, erreur du bouton Charger", "8-10", "E"],
  ["9h55", "15", "TP 1 : importer", "11", "M"],
  ["10h10", "17", "Power Query, étapes appliquées, dates", "12-15", "E"],
  ["10h27", "23", "TP 2a : titre, en-têtes, TOTAL, dates", "16", "M"],
  ["10h50", "10", "Mise en commun des nombres de lignes", "16", "Q"],
  ["11h00", "15", "Pause", "", ""],
  ["11h15", "20", "Combien de villes, fractionner, casse, ordre des étapes", "17-20", "Q/E"],
  ["11h35", "35", "TP 2b : texte et doublons", "21", "M"],
  ["12h10", "20", "Démo de l'actualisation, Fermer et appliquer, R2", "22", "E/M"],
  ["12h30", "60", "Déjeuner", "", ""],
  ["13h30", "5", "Premier visuel faux", "23", "M"],
  ["13h35", "30", "Étoile, vue Modèle, plusieurs-à-plusieurs, (Vide), sens du filtre", "24-28", "Q/E"],
  ["14h05", "20", "TP 3 : relier", "29", "M"],
  ["14h25", "30", "Colonne ou mesure, formules en frappe guidée, N-1 et Ramadan", "30-35", "E/M"],
  ["14h55", "25", "TP 4 : les sept formules", "36", "M"],
  ["15h20", "15", "Pause", "", ""],
  ["15h35", "10", "Tri des mois, lire une page", "37-38", "E"],
  ["15h45", "25", "TP 5 : la page Ventes", "39", "M"],
  ["16h10", "20", "Quiz, retour aux fichiers du matin, évaluation", "40", "M/Q"],
];
corps.push(
  h1("Minutage"),
  p("M : les participants manipulent. E : exposé ou démo. Q : échange avec la salle. Le détail minute par minute et ce que je dis sont dans les notes de chaque slide."),
  tableau(["Heure", "Min", "Bloc", "Slides", "Mode"], minutage, [900, 700, 5638, 1300, 1100]),
  h2("Si vous êtes en retard"),
  p("On garde toujours les TP entiers. Ce qu'on peut couper, module par module :"),
  tableau(["Module", "À couper en premier", "Gain"], [
    ["Ouverture", "Slide 5 (la journée en un schéma) : une phrase suffit.", "4 min"],
    ["Import", "Slide 8 : montrer l'écran en 2 minutes au lieu de 7.", "5 min"],
    ["Power Query", "Slide 14 : montrer seulement la capture, sans changer les paramètres régionaux en direct. Slide 20 : la lire, sans discussion.", "6 min"],
    ["Modèle", "Slide 26 : la mentionner en une phrase s'il n'y a pas de cas réel dans la salle.", "4 min"],
    ["DAX", "Slide 34 : donner l'explication sans laisser chercher la salle.", "3 min"],
    ["Rapport", "Les deux participants qui projettent leur page : un seul.", "4 min"],
  ], [1700, 6438, 1500]),
  p(""),
  p("Si vous êtes en avance : allongez les mises en commun et faites projeter davantage de participants. Ne rajoutez pas de formule DAX."),
);

// Vigilance
corps.push(
  h1("Points de vigilance"),
  h2("Les moments où la salle décroche"),
  tableau(["Quand", "Ce qui se passe", "Ce que je fais"], [
    ["9h55, TP 1", "Les cases Relations des options ne sont pas décochées. Rien ne se voit avant 13h30, où le premier visuel sera juste au lieu d'être faux.", "Je fais le tour et je demande à voir l'écran des options avant l'import."],
    ["10h27, TP 2a", "Le compte de lignes : Power Query profile les 1 000 premières lignes par défaut. Les gens cherchent 5 189 et voient 1 000.", "Je montre en grand la barre d'état et le choix « ensemble des données »."],
    ["11h35, TP 2b", "Supprimer les doublons avec une seule colonne sélectionnée : il reste 13 lignes dans Ventes. Panique.", "Ctrl+A, on refait. C'est l'erreur la plus fréquente de la journée."],
    ["13h30", "Coup de barre après le déjeuner.", "On commence directement par un visuel à faire, sans introduction."],
    ["14h00, slide 28", "Le sens du filtre. C'est la notion la plus abstraite.", "Je ne m'acharne pas. Phrase de repli : « si un chiffre est identique sur toutes les lignes, le filtre n'arrive pas jusqu'à la table »."],
    ["14h55, TP 4", "Point-virgule au lieu de virgule, guillemets courbes copiés depuis un mail.", "Je l'annonce avant le TP et je l'écris au tableau."],
    ["15h45, TP 5", "Les gens passent dix minutes sur la couleur d'un titre.", "« Le contenu d'abord. » À 16h00, j'autorise la mise en forme."],
  ], [1700, 4000, 3938]),
  h2("Les neuf erreurs racontées dans la journée"),
  tableau(["N°", "Slide", "Ce qu'on voit à l'écran", "Correction"], [
    ["1", "10", "Charger direct : titre de l'export en guise d'en-têtes, ligne TOTAL dans la table.", "Accueil > Transformer les données, puis TP 2a."],
    ["2", "14", "Paramètres régionaux anglais : Error pour les jours > 12, jour et mois inversés sans message pour les autres.", "Type Date avec Utilisation des paramètres régionaux, Français (Maroc)."],
    ["3", "19", "« casa », « Casablanca », « CASABLANCA », deux « Salé ». Puis « Casablancablanca ».", "Supprimer les espaces, Majuscule à chaque mot, Remplacer avec tout le contenu de la cellule."],
    ["4", "20", "Doublons non supprimés parce qu'ils diffèrent d'un espace, ou 13 lignes parce qu'une seule colonne était sélectionnée.", "Supprimer les espaces d'abord, Ctrl+A ensuite."],
    ["5", "26", "Cardinalité plusieurs-à-plusieurs et avertissement jaune.", "Supprimer le doublon MAG-05 dans Magasins."],
    ["6", "27", "Ligne « (Vide) » dans un visuel par ville.", "MAG-13 absent du référentiel : on prévient, on ne bricole pas."],
    ["7", "28", "Nb de magasins par catégorie : 12 partout.", "Compter côté Ventes : DISTINCTCOUNT(Ventes[Code magasin])."],
    ["8", "33", "CA en colonne calculée : le total général sur chaque ligne.", "Supprimer la colonne, créer une mesure."],
    ["9", "37", "Mois triés par ordre alphabétique.", "Outils de colonne > Trier par colonne > N° mois."],
  ], [600, 800, 4300, 3938]),
  h2("Le séparateur DAX"),
  p("Par défaut, Power BI Desktop utilise la virgule entre les arguments, même en interface française. Une option permet de passer au point-virgule (Fichier > Options et paramètres > Options > Global > Paramètres régionaux, « séparateurs DAX localisés »). Si un poste l'a activée, les formules du guide ne passeront pas sur ce poste : c'est la première chose à vérifier si un participant a une erreur de syntaxe incompréhensible."),
);

// Rattrapage
corps.push(
  h1("Fabriquer les fichiers de rattrapage"),
  p("Je ne peux pas générer de fichier .pbix ; voici la procédure pour les fabriquer vous-même, en une quarantaine de minutes. On part d'un fichier vierge et on enregistre sous un nouveau nom à la fin de chaque étape : R2 contient tout R1, R3 tout R2, etc."),
  encadre([
    p("**Les chemins.** Créez les cinq fichiers sur un PC où l'export se trouve exactement à **C:\\Formation_PBI\\Ventes_Retail.xlsx**, avec le fichier de 03_donnees/participants/. Un .pbix mémorise le chemin de sa source : s'il est identique sur les postes de la salle, le fichier s'ouvre et s'actualise sans réglage.", { after: 0 }),
  ]),
  p(""),
  p("Si un participant a l'export ailleurs : Accueil > Transformer les données > Paramètres de la source de données > Changer la source, puis désigner le bon fichier.", { color: K.gris }),
  h2("R1_import.pbix : les quatre requêtes importées"),
  ...etapes([
    "Power BI Desktop, Fichier > Nouveau.",
    "Fichier > Options et paramètres > Options > Fichier actuel > Chargement des données : décocher les deux cases de la rubrique Relations. Laisser Date/heure automatique cochée (elle sera coupée au TP 3).",
    "Accueil > Obtenir les données > Classeur Excel > C:\\Formation_PBI\\Ventes_Retail.xlsx.",
    "Cocher Export_Ventes, Magasins, Produits, Calendrier. Transformer les données.",
    "Renommer la requête Export_Ventes en Ventes. Ne toucher à aucune autre étape, même celles que Power Query a ajoutées seul.",
    "Accueil > Fermer et appliquer. Accepter le message d'erreurs de chargement éventuel (la table Ventes est encore sale, c'est voulu).",
    "Fichier > Enregistrer sous C:\\Formation_PBI\\rattrapage\\R1_import.pbix.",
  ]),
  h2("R2_nettoye.pbix : les données propres, sans relation"),
  p("À partir de R1, Accueil > Transformer les données, puis :"),
  h3("Requête Ventes"),
  ...etapes([
    "Supprimer les étapes ajoutées automatiquement après Navigation (Type modifié, En-têtes promus s'il y en a) pour repartir de la feuille brute.",
    "Accueil > Supprimer les lignes > Supprimer les lignes du haut : 2.",
    "Accueil > Utiliser la première ligne pour les en-têtes. Si une étape Type modifié réapparaît, la supprimer.",
    "Filtre de N° ticket : décocher (null).",
    "Date : icône de type > Utilisation des paramètres régionaux > Date, Français (Maroc).",
    "N° ticket, Code magasin, Réf produit en Texte ; Quantité en Nombre entier ; Prix unitaire en Nombre décimal.",
    "Code magasin : Transformer > Format > Supprimer les espaces.",
    "Sélectionner toutes les colonnes (Ctrl+A), Accueil > Supprimer les lignes > Supprimer les doublons.",
    `Contrôle : ${nf(V.lignes_apres_nettoyage)} lignes (profilage sur l'ensemble des données).`,
  ]),
  h3("Requête Magasins"),
  ...etapes([
    "Si besoin, Utiliser la première ligne pour les en-têtes.",
    "Fractionner Ville - Région par délimiteur personnalisé « espace-tiret-espace », à chaque occurrence. Renommer Ville et Région.",
    "Ville : Supprimer les espaces, puis Majuscule à chaque mot.",
    "Remplacer les valeurs « Casa » par « Casablanca », Options avancées > Mettre en correspondance tout le contenu de la cellule.",
    "Code magasin et Région : Supprimer les espaces. Surface en Nombre entier, Date d'ouverture en Date.",
    "Ctrl+A, Supprimer les doublons. Contrôle : 12 lignes, 10 villes.",
  ]),
  h3("Requêtes Produits et Calendrier"),
  ...etapes([
    "Vérifier les en-têtes et les types : Prix catalogue en Nombre décimal ; dans Calendrier, Date en Date, Année et N° mois en Nombre entier, Mois et Trimestre en Texte.",
    "Renommer les étapes de Ventes et Magasins avec des noms parlants (clic droit > Renommer) : c'est ce que les participants ouvriront.",
    "Accueil > Fermer et appliquer. Enregistrer sous R2_nettoye.pbix.",
  ]),
  h2("R3_modele.pbix : le modèle en étoile"),
  ...etapes([
    "Vue Modèle : Ventes[Code magasin] sur Magasins[Code magasin], Ventes[Réf produit] sur Produits[Réf produit], Ventes[Date] sur Calendrier[Date].",
    "Vérifier chaque relation : un-à-plusieurs, direction unique, active.",
    "Volet Données, clic droit sur Calendrier > Marquer comme table de dates > Date.",
    "Fichier > Options > Fichier actuel > Chargement des données : décocher Date/heure automatique.",
    "Disposer les tables en étoile dans la vue Modèle (Ventes au centre), pour la capture C25a.",
    "Contrôle : un visuel Table Magasins[Ville] + Somme de Quantité montre une seule ligne (Vide). Supprimer le visuel. Enregistrer sous R3_modele.pbix.",
  ]),
  h2("R4_mesures.pbix : les sept formules"),
  ...etapes([
    "Vue Table, table Ventes, Outils de table > Nouvelle colonne : Montant.",
    "Table Ventes sélectionnée, Accueil > Nouvelle mesure, six fois : CA, Nb tickets, Panier moyen, CA Casablanca, CA N-1, Évolution vs N-1 (formules ci-dessous).",
    "Formats : CA, CA Casablanca, CA N-1 en nombre entier avec séparateur de milliers ; Panier moyen à 2 décimales ; Évolution vs N-1 en pourcentage à 1 décimale.",
    "Ne PAS faire le tri par colonne sur Mois : il sert à la capture C37a et à l'erreur n°9.",
    "Contrôle avec des cartes temporaires (valeurs ci-dessous), puis supprimer les visuels. Enregistrer sous R4_mesures.pbix.",
  ]),
  code([
    "Montant = Ventes[Quantité] * Ventes[Prix unitaire]",
    "CA = SUM(Ventes[Montant])",
    "Nb tickets = DISTINCTCOUNT(Ventes[N° ticket])",
    "Panier moyen = DIVIDE([CA], [Nb tickets])",
    "CA Casablanca = CALCULATE([CA], Magasins[Ville] = \"Casablanca\")",
    "CA N-1 = CALCULATE([CA], SAMEPERIODLASTYEAR(Calendrier[Date]))",
    "Évolution vs N-1 = DIVIDE([CA] - [CA N-1], [CA N-1])",
  ]),
  p(""),
  h2("R5_rapport.pbix : le rapport de la démo"),
  ...etapes([
    "Vue Table, Calendrier, colonne Mois : Outils de colonne > Trier par colonne > N° mois.",
    "Renommer la page « Ventes ».",
    "En haut, cinq cartes : CA, Nb tickets, Panier moyen, Évolution vs N-1, et Dernière vente (champ Ventes[Date] dans une carte, agrégation Plus récent via la flèche du champ).",
    "Au milieu, graphique en colonnes groupées : Calendrier[Mois] en axe, CA et CA N-1 en valeurs.",
    "En bas à gauche, graphique à barres : CA par Magasins[Ville], trié par CA décroissant.",
    "En bas à droite, matrice : Produits[Catégorie] en lignes, Calendrier[Année] en colonnes, CA.",
    "Segments Calendrier[Année] et Produits[Catégorie] sur le côté.",
    "Titres de visuels en phrases courtes (« CA par mois, comparé à l'année précédente »). Pas de mise en forme exotique : c'est le modèle que les participants reproduisent.",
    "Enregistrer sous R5_rapport.pbix.",
  ]),
  h2("Les fichiers jetables pour les captures"),
  tableau(["Capture", "Fichier", "Comment l'obtenir"], [
    ["C10a", "Rapport vierge", "Import de Export_Ventes avec le bouton Charger. Ne pas enregistrer."],
    ["C14a", "Copie de R1", "Fichier > Options > Fichier actuel > Paramètres régionaux : Anglais (États-Unis). Dans Ventes, en-têtes faits, type Date sans paramètres régionaux."],
    ["C26a", "Copie de R2", "Supprimer l'étape Doublons supprimés de Magasins, Fermer et appliquer, puis tenter la relation."],
    ["C32a", "Copie de R4", "Outils de table > Nouvelle colonne : CA_colonne = SUM(Ventes[Montant])."],
  ], [1100, 1800, 6738]),
);

// Démo
corps.push(
  h1("La démo d'actualisation, deux fois dans la journée"),
  p("Elle sert à 9h15 (l'effet) et à 12h10 (la compréhension). La manipulation est la même :"),
  ...etapes([
    "Dans C:\\Formation_PBI\\, renommer Ventes_Retail.xlsx en Ventes_Retail_ancien.xlsx.",
    "Renommer Ventes_Retail_MAJ.xlsx en Ventes_Retail.xlsx.",
    "Dans R5_rapport.pbix : Accueil > Actualiser. Vingt secondes environ.",
    `La carte Dernière vente passe du ${D.derniere_date} au ${D.maj_derniere_date} ; octobre apparaît dans le graphique mensuel ; Ventes passe de ${nf(D.lignes_propres)} à ${nf(D.maj_lignes_propres)} lignes.`,
    "**Juste après la démo** : refaire les renommages dans l'autre sens et actualiser. Sinon, tous les chiffres de l'après-midi diffèrent du guide.",
  ]),
  encadre([p("**Si l'actualisation échoue en démo.** Le message nomme presque toujours le fichier introuvable : un renommage oublié, ou le fichier encore ouvert dans Excel. Fermez Excel, vérifiez les noms, relancez. Racontez-le : c'est aussi une leçon sur la vraie vie d'un rapport.", { after: 0 })]),
);

// Valeurs
corps.push(
  h1("Valeurs de contrôle"),
  p("Les mêmes que dans le guide participant et la feuille Corrigé formateur. Elles sont calculées par 03_donnees/generer_dataset.py, sur les données nettoyées."),
  tableau(["Indicateur", "Valeur"], [
    ["Lignes brutes de l'export (hors titre, en-têtes, ligne vide, TOTAL)", nf(V.lignes_brutes_export)],
    ["dont lignes recollées en double", nf(V.lignes_dupliquees)],
    ["Lignes de Ventes après nettoyage", nf(V.lignes_apres_nettoyage)],
    ["CA (MAD)", nf(V.ca_total, 2)],
    ["CA compté en trop si les doublons restent (MAD)", nf(V.ca_doublons_si_oublies, 2)],
    ["Nb tickets", nf(V.nb_tickets)],
    ["Panier moyen (MAD)", nf(V.panier_moyen, 2)],
    ["CA Casablanca (MAD)", nf(V.ca_casablanca, 2)],
    ["CA février 2026 / février 2025 (MAD)", `${nf(V.ca_fevrier_2026, 2)} / ${nf(V.ca_fevrier_2025, 2)}`],
    ["Évolution février 2026", `+${nf(V.evol_fevrier_2026 * 100, 1)} %`],
    ["CA mars 2026 / mars 2025 (MAD)", `${nf(V.ca_mars_2026, 2)} / ${nf(V.ca_mars_2025, 2)}`],
    ["Évolution mars 2026", `${nf(V.evol_mars_2026 * 100, 1)} %`],
    ["CA de la ligne (Vide), MAG-13 (MAD)", nf(V.ca_mag13_vide, 2)],
    ["Export du 12/10 : lignes brutes / lignes propres", `${nf(D.maj_lignes_brutes)} / ${nf(D.maj_lignes_propres)}`],
  ], [6638, 3000], { droite: [1] }),
);

// FAQ
corps.push(
  h1("Questions qu'on me pose souvent"),
  ...[
    ["« Et si la structure de l'export change ? »", "Si une colonne change de nom, l'actualisation s'arrête avec un message qui nomme la colonne. On corrige l'étape concernée. C'est plus rapide que de tout refaire, et c'est visible, alors qu'un copier-coller décalé dans Excel ne prévient personne."],
    ["« Est-ce que je peux faire ça sur mes fichiers SharePoint ou une base SQL ? »", "Oui, Obtenir les données propose des dizaines de sources. Le principe de la journée reste le même : importer, nettoyer, relier, calculer, montrer. Pour une base de données, voir avec le service informatique pour les accès."],
    ["« Comment je partage le rapport ? »", "En le publiant sur le service Power BI (Accueil > Publier). Il faut une licence et un espace de travail : c'est une décision de l'entreprise, hors du périmètre d'aujourd'hui. En attendant, on peut envoyer le .pbix à quelqu'un qui a Power BI Desktop."],
    ["« Pourquoi pas tout faire en DAX, ou tout dans Power Query ? »", "En pratique : ce qui nettoie ou prépare les lignes va dans Power Query, ce qui s'agrège selon les filtres va en mesure DAX."],
    ["« C'est quoi les deux autres vues, requête DAX et TMDL ? »", "Des outils pour écrire et tester des requêtes ou modifier le modèle en texte. Utiles plus tard, pas pour démarrer."],
    ["« Copilot ne fait pas tout ça tout seul ? »", "Il aide à écrire une formule ou une page, à condition que le modèle soit propre. Le nettoyage et les relations de la journée sont justement ce qui rend ces outils utilisables."],
    ["« Les dates de Ramadan du jeu de données sont-elles exactes ? »", "Ce sont des estimations (calendrier lunaire, annonce officielle la veille au Maroc). Suffisant pour l'exercice ; le jeu de données est fictif."],
  ].flatMap(([q, r]) => [h3(q), p(r)]),
);

const doc = C.documentAvecCharte(corps, "Initiation à Power BI : déroulé formateur");
C.ecrire(doc, path.join(__dirname, "../04_formateur/Deroule_formateur.docx"));
