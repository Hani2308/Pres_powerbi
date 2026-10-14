# Initiation à Power BI : plan de la journée et découpage en slides

Formateur : Hani Sahir. Public : 8 à 14 personnes, métiers Excel de tous niveaux et quelques profils techniques, personne n'a ouvert Power BI. Interface Power BI Desktop en français. Une journée, 6 h effectives.

Sources des libellés : `sources.md`. Ce document fixe le contenu ; la forme est fixée dans `design.md` (étape 5).

## Décisions prises sans votre réponse explicite (à corriger si besoin)

- **Horaires** : 9h00 à 16h30, déjeuner 12h30 à 13h30, pauses de 15 min à 11h00 et 15h20. Total effectif : 360 min.
- **Niveau** : on vise le participant qui connaît SOMME et le filtre automatique, rien de plus. Les TCD servent de point de comparaison mais on ne suppose pas qu'ils sont maîtrisés. Les profils techniques ont des « bonus » dans les consignes de TP pour ne pas s'ennuyer (barre de formule M, vue de requête DAX).
- **Enseigne fictive** : « Atlas Bazar », 12 magasins de proximité (épicerie, boissons, hygiène, maison, textile, fournitures scolaires) dans 10 villes marocaines. Nom inventé ; aucune marque réelle.
- **Fichiers participants** : tout le monde travaille dans `C:\Formation_PBI\`. C'est ce qui permet aux .pbix de rattrapage de s'ouvrir sans changer la source (voir déroulé formateur).
- **Fichier de mise à jour** : en plus de `Ventes_Retail.xlsx` (octobre 2024 à septembre 2026), je fournis `Ventes_Retail_MAJ.xlsx`, le même export avec la première semaine d'octobre 2026 en plus. C'est lui qui fait la démo « on remplace le fichier, on actualise ».
- **Publication sur le service Power BI** : hors périmètre (licences, espaces de travail). Une seule mention en fin de journée.

## Le fil rouge : ce que contient l'export

| Feuille | Contenu | Défauts plantés |
|---|---|---|
| `Export_Ventes` | ~5 000 lignes de tickets : Date, N° ticket, Code magasin, Réf produit, Quantité, Prix unitaire (MAD) | Deux lignes de titre au-dessus des en-têtes ; Date en texte JJ/MM/AAAA ; une ligne vide puis une ligne « TOTAL GÉNÉRAL » collées en bas ; ~40 lignes en double (une semaine réexportée et collée à la fin, avec un espace après chaque code magasin) ; ventes de « MAG-13 », un magasin ouvert en mars 2026 et absent du référentiel |
| `Magasins` | 12 lignes (13 avec le doublon) : Code, Nom, « Ville - Région », Surface m², Date d'ouverture | Colonne fusionnée « Ville - Région » ; « Casablanca » / « casa » / « CASABLANCA » ; espaces en fin de ville ; MAG-05 saisi deux fois, la seconde avec « Salé » suivi d'un espace |
| `Produits` | ~60 références : Réf, Désignation, Catégorie, Prix catalogue | Propre, volontairement : on ne nettoie pas tout. |
| `Calendrier` | Une ligne par jour : Date, Année, N° mois, Mois (« janvier »…), Trimestre | Propre, fournie. Le piège arrive tout seul : le mois en texte se trie par ordre alphabétique. |
| `Corrigé formateur` | Chaque défaut, sa localisation exacte (feuille, cellules, nombre de lignes), la correction attendue, et les totaux de contrôle avant/après | |

Saisonnalité modélisée : Ramadan (1er au 30 mars 2025, 18 février au 19 mars 2026, hausse épicerie et boissons, baisse textile en journée), Aïd al-Fitr (hausse textile la semaine avant), Aïd al-Adha (6 juin 2025, 27 mai 2026, hausse maison), rentrée (fin août à mi-septembre, fournitures scolaires), soldes d'été (juillet-août) et d'hiver (janvier) sur le textile. Les dates de fêtes religieuses sont des estimations astronomiques : elles seront marquées comme telles dans le corrigé.

Le décalage du Ramadan d'une année sur l'autre donne le meilleur moment du module DAX : sur le dataset final, février 2026 fait +31 % et mars 2026 -26 % par rapport à l'année précédente, alors que le commerce va bien. On s'en sert pour montrer ce que `SAMEPERIODLASTYEAR` compare réellement.

## Les 7 formules DAX (et rien de plus)

1. Colonne calculée `Montant = Ventes[Quantité] * Ventes[Prix unitaire]`
2. `CA = SUM(Ventes[Montant])`
3. `Nb tickets = DISTINCTCOUNT(Ventes[N° ticket])`
4. `Panier moyen = DIVIDE([CA], [Nb tickets])`
5. `CA Casablanca = CALCULATE([CA], Magasins[Ville] = "Casablanca")`
6. `CA N-1 = CALCULATE([CA], SAMEPERIODLASTYEAR(Calendrier[Date]))`
7. `Évolution vs N-1 = DIVIDE([CA] - [CA N-1], [CA N-1])`

Les résultats attendus de chaque formule (total général, Casablanca, mars 2026) seront calculés sur le dataset final et inscrits dans le corrigé, pour que vous puissiez dire en salle « vous devez trouver 1 234 567 MAD ».

## Déroulé minute par minute

M = manipulation par les participants. E = exposé ou démo du formateur. Q = échange avec la salle.

| Horaire | Durée | Bloc | Mode | Slides | Ce qui se passe |
|---|---|---|---|---|---|
| 9h00 | 10 | Accueil | Q | 1-2 | Tour de table en une phrase : « quel fichier refaites-vous chaque semaine ? ». On note les réponses au tableau, on y revient à 16h15. |
| 9h10 | 5 | La douleur du lundi | E | 3 | Le dossier de versions, le circuit copier-coller. |
| 9h15 | 10 | Démo du rapport fini | E | 4 | Rapport Atlas Bazar à l'écran. On clique sur les segments, puis on remplace le fichier source et on actualise en direct. |
| 9h25 | 5 | La journée en un schéma | E | 5 | Importer, nettoyer, relier, calculer, montrer. |
| 9h30 | 5 | Vérification des postes | M | 6 | Power BI Desktop s'ouvre, les fichiers sont dans `C:\Formation_PBI\`, ouverture de l'export dans Excel. |
| 9h35 | 5 | Repérer les défauts dans Excel | M/Q | 6-7 | 3 min en binôme pour lister ce qui cloche, puis on met en commun. |
| **Module 1** | | **Prise en main et import** | | | |
| 9h40 | 7 | Tour de l'écran | E | 8 | Les trois vues, le ruban, les volets. |
| 9h47 | 5 | Obtenir les données | E | 9 | Démo du Navigateur. |
| 9h52 | 3 | L'erreur du bouton Charger | E | 10 | Quantités à 2x la réalité à cause de la ligne TOTAL. |
| 9h55 | 15 | TP 1 | M | 11 | Importer les 4 feuilles via « Transformer les données ». Rattrapage R1. |
| 10h10 | | *fin module 1* | | | |
| **Module 2** | | **Power Query** | | | |
| 10h10 | 5 | Le principe | E | 12 | Les étapes sont une recette rejouée à chaque actualisation. |
| 10h15 | 5 | L'éditeur | E | 13 | Étapes appliquées, aperçu, barre de formule. |
| 10h20 | 7 | Les dates | E | 14-15 | La date lue à l'américaine, puis la correction par les paramètres régionaux. |
| 10h27 | 23 | TP 2a | M | 16 | Lignes de titre, en-têtes, ligne TOTAL (filtre sur N° ticket), dates. |
| 10h50 | 10 | Mise en commun | Q | 16 | Chacun annonce son nombre de lignes ; on traite les écarts. |
| 11h00 | 15 | *Pause* | | | |
| 11h15 | 5 | Retour de pause | Q | 17 | « Combien de villes voyez-vous dans la colonne Ville ? » |
| 11h20 | 8 | Texte sale | E | 18 | Supprimer les espaces, Majuscule à chaque mot, Remplacer les valeurs (piège « Casablancablanca »). |
| 11h28 | 4 | Fractionner | E | 19 | Ville - Région. |
| 11h32 | 3 | L'ordre des étapes | E | 20 | Dédoublonner en dernier. |
| 11h35 | 35 | TP 2b | M | 21 | Nettoyage de Magasins et Ventes, avec résultat attendu chiffré. Les rapides : bonus barre de formule M. |
| 12h10 | 10 | Démo de l'actualisation | E | 22 | On remplace par `Ventes_Retail_MAJ.xlsx`, on actualise, octobre apparaît. |
| 12h20 | 10 | Fermer et appliquer | M | 22 | Tout le monde ferme et applique, enregistre. Rattrapage R2. Questions. |
| 12h30 | 60 | *Déjeuner* | | | |
| **Module 3** | | **Le modèle** | | | |
| 13h30 | 5 | Réveil | M | 23 | Premier visuel : CA par ville. Il sort faux. On demande à la salle pourquoi. |
| 13h35 | 5 | Une seule grande table ? | Q | 24 | Question à la salle. |
| 13h40 | 7 | Le schéma en étoile | E | 25 | |
| 13h47 | 5 | Relier dans la vue Modèle | E | 26 | Glisser-déposer, boîte de dialogue, cardinalité, direction. |
| 13h52 | 4 | Erreur : plusieurs-à-plusieurs | E | 27 | Doublon MAG-05 oublié, retour dans Power Query. |
| 13h56 | 4 | Erreur : la ligne (Vide) | E | 28 | MAG-13 absent du référentiel. |
| 14h00 | 5 | Le sens du filtre | E | 29 | Nb de magasins par catégorie : 12 partout. |
| 14h05 | 20 | TP 3 | M | 30 | Relations, table de dates, désactivation de date/heure automatique. Rattrapage R3. |
| 14h25 | | *fin module 3* | | | |
| **Module 4** | | **DAX** | | | |
| 14h25 | 6 | Colonne ou mesure | E | 31 | |
| 14h31 | 5 | Formules 1 et 2 | E/M | 32 | Tout le monde tape en même temps que moi. |
| 14h36 | 3 | Erreur : CA en colonne | E | 33 | Le même total sur toutes les lignes. |
| 14h39 | 5 | Formules 3 et 4 | E/M | 34 | En même temps. |
| 14h44 | 5 | Formule 5 | E/Q | 35 | « Pourquoi CA Casablanca s'affiche à Fès ? » |
| 14h49 | 6 | Formules 6 et 7 et le Ramadan | E | 36 | Le graphique N-1. |
| 14h55 | 25 | TP 4 | M | 37 | Les 7 formules, formats, valeurs attendues. Rattrapage R4. |
| 15h20 | 15 | *Pause* | | | |
| **Module 5** | | **Le rapport** | | | |
| 15h35 | 4 | Les mois en vrac | E | 38 | Ordre alphabétique, Trier par colonne. |
| 15h39 | 6 | Construire une page | E | 39 | Hiérarchie de la page, segments, interactions. |
| 15h45 | 25 | TP 5 | M | 40 | Reproduire la page du matin. Rattrapage R5. |
| 16h10 | 10 | Quiz | M | 41 | 10 questions du guide, correction à voix haute. |
| 16h20 | 10 | Clôture | Q | 41-42 | Retour sur les fichiers notés à 9h00 : chacun dit lequel il automatise en premier. Évaluation. |
| 16h30 | | *Fin* | | | |

**Temps de manipulation** : 5 + 5 + 15 + 23 + 35 + 10 + 5 + 20 + 5 (frappe guidée 32) + 5 (34) + 25 + 25 + 10 = **188 min**, auxquels s'ajoutent 10 min de mise en commun sur écran participant. Soit 188 à 198 min sur 360 : **52 à 55 %**. Il n'y a pas de marge : si un module déborde, on raccourcit l'exposé, jamais le TP. Le déroulé formateur indiquera, pour chaque module, quelle slide sauter en cas de retard.

## Les .pbix de rattrapage

| Fichier | État au début du module suivant |
|---|---|
| R1_import.pbix | Les 4 requêtes importées dans Power Query, aucune transformation |
| R2_nettoye.pbix | Requêtes nettoyées, chargées, aucune relation |
| R3_modele.pbix | Relations, table de dates marquée, date/heure automatique désactivée |
| R4_mesures.pbix | Les 7 formules, formats appliqués, aucune page de rapport |
| R5_rapport.pbix | Rapport final. C'est aussi le fichier de la démo de 9h15. |

La procédure de création (clic par clic, dans l'ordre, en partant de R1 et en enregistrant sous un nouveau nom à chaque étape) sera dans `04_formateur/Deroule_formateur.docx`.

## Découpage en slides (42)

Gabarits (définis dans `design.md`) : **CAP** capture plein cadre annotée, **PAS** capture + étapes numérotées, **AVA** avant/après, **TXT** une phrase en grand, **SCH** schéma, **QST** question à la salle, slide quasi vide, **TP** consigne de manipulation, **COD** formule DAX en grand avec son résultat, **GRA** graphique calculé sur le dataset, **COU** couverture.

Les numéros d'étape sur PAS et TP sont de vraies étapes de manipulation, pas une décoration.

| # | Titre (phrase affirmative) | Gabarit | Intention |
|---|---|---|---|
| 1 | Initiation à Power BI : du fichier du lundi au rapport qui se met à jour seul | COU | Couverture. Date, lieu, formateur. |
| 2 | Quel fichier refaites-vous à la main chaque semaine ? | QST | Ancrer la journée dans leur douleur. Les réponses servent à 16h20. |
| 3 | Le reporting du lundi finit toujours dans un dossier de versions « finales » | CAP | Capture de l'explorateur Windows : `Reporting_ventes_v3_final.xlsx`, `..._final_VRAI.xlsx`, `..._corrigé Samir.xlsx`. Annotations : le circuit export, copier-coller, TCD, graphique, mail. Ça doit faire sourire. |
| 4 | Le même reporting, actualisé d'un clic à 8h02 | CAP | Capture du rapport fini. On passe immédiatement dans Power BI pour la démo en direct. |
| 5 | La journée suit le trajet de la donnée : importer, nettoyer, relier, calculer, montrer | SCH | Le pipeline. Chaque étape porte l'horaire. On y revient en une phrase à chaque module, sans repasser la slide. |
| 6 | Tout le monde ouvre l'export de la caisse dans Excel | TP | 5 min : contrôle des postes, puis 3 min en binôme : « listez ce qui va poser problème ». |
| 7 | Cet export contient au moins sept pièges, et vous en avez trouvé combien ? | CAP | Capture Excel de l'export, annotée de 7 repères (date texte, TOTAL, espace, casa…). Révélation après l'échange. |
| 8 | Power BI Desktop s'organise en trois vues, et on passe la matinée dans aucune des trois | CAP | Tour de l'écran : vues Rapport / Table / Modèle, ruban, volets Visualisations, Données, Filtres. La blague : la matinée se passe dans Power Query. |
| 9 | Le Navigateur vous montre les feuilles avant de rien charger | PAS | Accueil > Obtenir les données > Classeur Excel > cocher les 4 feuilles. |
| 10 | Le bouton Charger envoie la ligne TOTAL dans vos calculs et double les quantités vendues | AVA | Avant : carte « Somme de Quantité » à 2x la réalité, et le message d'erreurs de chargement. Après : « Transformer les données », la ligne TOTAL visible et supprimable. Erreur réelle n°1. |
| 11 | Importez les quatre feuilles et arrêtez-vous dans Power Query | TP | 15 min. Résultat attendu : 4 requêtes dans le volet de gauche. Rattrapage R1. |
| 12 | Power Query rejoue vos nettoyages à chaque actualisation | SCH | Mécanisme : fichier source, puis étapes, puis table propre. Le fichier de la semaine suivante passe par les mêmes étapes. La phrase-clé de la journée. |
| 13 | Chaque clic devient une ligne dans Étapes appliquées, et on peut revenir en arrière | CAP | Éditeur Power Query annoté : ruban, aperçu, Étapes appliquées, barre de formule (Affichage). |
| 14 | Lue à l'américaine, une date JJ/MM devient « Error » le 13 février et le 4 mars le 3 avril | AVA | Erreur réelle n°2, la plus vicieuse : une partie des dates est fausse sans aucun message. |
| 15 | Modifier le type avec les paramètres régionaux règle le problème sur n'importe quel PC | PAS | Icône de type > Utilisation des paramètres régionaux > Date > Français (Maroc). |
| 16 | Remettez l'export d'aplomb : lignes de titre, en-têtes, ligne TOTAL, dates | TP | 23 min + 10 min de mise en commun. Résultat attendu : nombre de lignes exact, aucune cellule « Error ». |
| 17 | Combien de villes voyez-vous dans la colonne Ville ? | QST | Retour de pause. Réponse attendue : « 10 », réponse réelle : 13 (dont deux « Salé » qui ont l'air identiques). |
| 18 | Pour Power Query, « casa », « Casablanca » et « CASABLANCA » sont trois villes différentes | AVA | Avant : la liste de filtre avec les variantes. Après : une seule Casablanca. Dessous, en petit, l'enchaînement Supprimer les espaces > Majuscule à chaque mot > Remplacer les valeurs, et le piège « Casablancablanca ». Erreur réelle n°3. |
| 19 | Fractionner la colonne par délimiteur sépare la ville de sa région | PAS | Boîte de dialogue avec « - » comme délimiteur, et pourquoi on choisit « espace-tiret-espace ». |
| 20 | Supprimez les espaces avant de dédoublonner, sinon « MAG-03 » et « MAG-03 » suivi d'un espace survivent tous les deux | TXT | Une phrase, un exemple. Erreur réelle n°4. |
| 21 | Nettoyez Magasins et Ventes jusqu'à retrouver exactement 5 159 ventes et 12 magasins | TP | 35 min. Chiffres tirés du corrigé. Bonus profils techniques : lire le code M dans la barre de formule. |
| 22 | Lundi suivant : on remplace le fichier, on clique sur Actualiser, octobre est là | AVA | Avant : rapport arrêté au 30 septembre. Après : première semaine d'octobre ajoutée, rien retouché. Puis Fermer et appliquer. Rattrapage R2. |
| 23 | Votre premier visuel est faux, et c'est normal | CAP | Capture : CA par ville avec une barre « (Vide) » et des totaux étranges. Lance le module Modèle par un problème. |
| 24 | Pourquoi ne pas tout mettre dans une seule grande table, comme dans Excel ? | QST | Laisser répondre. On attend « RECHERCHEV ». |
| 25 | Un modèle en étoile met les ventes au centre et ce qui les décrit autour | SCH | Schéma : Ventes au centre, Magasins, Produits, Calendrier, avec les 1 et * sur les liens. |
| 26 | Dans la vue Modèle, on relie deux tables en glissant une colonne sur l'autre | CAP | Vue Modèle annotée + boîte « Modifier la relation » : cardinalité, direction du filtrage croisé. |
| 27 | « Plusieurs-à-plusieurs » veut presque toujours dire qu'il reste un doublon dans le référentiel | AVA | Erreur réelle n°5 : MAG-05 en double. Avant : le message. Après : doublon supprimé dans Power Query, relation un-à-plusieurs. |
| 28 | La barre « (Vide) » regroupe les ventes dont le magasin est introuvable | CAP | Erreur réelle n°6 : MAG-13 absent du référentiel. On ne la corrige pas dans Power BI : on la remonte à qui tient le référentiel. |
| 29 | Le filtre descend du référentiel vers les ventes, jamais l'inverse | SCH | Mécanisme de propagation. Exemple qui piège : nombre de magasins par catégorie = 12 partout. La correction passe par une mesure (formule 3 sur Code magasin, vue en module 4), pas par « Les deux ». Erreur réelle n°7. |
| 30 | Reliez les quatre tables et marquez le calendrier comme table de dates | TP | 20 min. Désactiver date/heure automatique. Résultat attendu : 3 relations un-à-plusieurs, aucune barre (Vide) sauf MAG-13. Rattrapage R3. |
| 31 | Une colonne calcule ligne par ligne, une mesure calcule pour chaque case du visuel | SCH | Le schéma colonne/mesure : à gauche le tableau des lignes avec Montant, à droite une matrice où chaque case est un SUM sous filtre. |
| 32 | Montant s'écrit une fois dans la table, CA se recalcule à chaque clic | COD | Formules 1 et 2. Note : virgule et pas point-virgule, SUM et pas SOMME. Frappe guidée. |
| 33 | Écrit en colonne calculée, le CA affiche 392 688 MAD sur chacune des 5 159 lignes | AVA | Erreur réelle n°8. Avant : colonne CA = total partout. Après : mesure. |
| 34 | DIVIDE calcule le panier moyen sans jamais afficher d'erreur de division | COD | Formules 3 et 4. Frappe guidée. |
| 35 | CALCULATE remplace le filtre de la ville avant de calculer | COD | Formule 5 + capture de matrice où « CA Casablanca » vaut la même chose sur la ligne Fès. Question à la salle avant l'explication. |
| 36 | Mars 2026 recule de 26 % sur un an alors que février gagne 31 % : le Ramadan a avancé de onze jours | GRA | Graphique calculé sur le dataset : CA et CA N-1 par mois, février-mars mis en évidence. Formules 6 et 7. |
| 37 | Écrivez les sept formules et comparez vos résultats aux valeurs attendues | TP | 25 min. Tableau des valeurs attendues dans le guide. Rattrapage R4. |
| 38 | Sans tri explicite, avril passe avant janvier | AVA | Erreur réelle n°9. Avant : axe des mois en ordre alphabétique. Après : Outils de colonne > Trier par colonne > N° mois. |
| 39 | Une page de rapport se lit de haut en bas : les chiffres clés, l'évolution, le détail | CAP | Le rapport final annoté : cartes, courbe, barres, segments, et où cliquer pour les interactions. |
| 40 | Reconstruisez la page de 9h15 avec vos propres données nettoyées | TP | 25 min. Rattrapage R5. |
| 41 | Dix questions pour vérifier ce qui reste demain matin | QST | Quiz du guide, correction à voix haute. |
| 42 | Lundi prochain, lequel de vos fichiers passera dans Power BI ? | QST | Retour aux fichiers notés à 9h00. Pour aller plus loin : 3 liens Microsoft Learn en petit. |

42 slides, c'est 2 de plus que votre fourchette de 30 à 40. Je propose de fusionner 41 et 42 et de retirer la 24 (la question devient une note de la 25) pour arriver à **40**. Je l'applique sauf avis contraire.

**Contrôle de variété (pas plus de 2 gabarits identiques à la suite)** : la séquence est COU QST CAP CAP SCH TP CAP CAP PAS AVA TP SCH CAP AVA PAS TP QST AVA PAS TXT TP AVA CAP QST SCH CAP AVA CAP SCH TP SCH COD AVA COD COD GRA TP AVA CAP TP QST QST. Aucun gabarit n'apparaît 3 fois de suite. Après les fusions proposées, la fin devient TP AVA CAP TP QST.

**Erreurs réelles racontées** : 9 au total, au moins une par module. Module 1 : n°1. Module 2 : n°2, 3, 4. Module 3 : n°5, 6, 7. Module 4 : n°8, plus le séparateur point-virgule en note. Module 5 : n°9.

## Production après validation (étapes 4 à 8)

Ordre de travail, chaque étape vérifiée avant la suivante :

1. **Données** (skill xlsx). Script Python reproductible (graine fixe) dans `03_donnees/generer_dataset.py`, qui produit `Ventes_Retail.xlsx` et `Ventes_Retail_MAJ.xlsx`. Contrôle automatique : chaque défaut listé dans le corrigé existe bien à l'endroit indiqué. Les 7 formules sont recalculées en Python (pandas) ; les valeurs attendues sont écrites dans le corrigé et reportées dans les slides 21, 30, 36, 37.
2. **Direction visuelle** (frontend-design, impeccable) : `design.md`. **Je vous la montre avant de produire.**
3. **Graphiques** (dataviz) : slide 36 et les éventuels visuels d'illustration, calculés sur le dataset.
4. **Présentation** (pptx) : 40 slides, notes formateur à l'oral sur chaque slide, emplacements de capture marqués avec leur numéro (C01, C02…).
5. **Guide participant et déroulé formateur** (docx).
6. **Liste de captures** : `05_captures/liste_captures.md`, numérotée, reliée aux slides, avec les points « contrôle libellé » de `sources.md`.
7. **Contrôle** : rendu de chaque slide en PNG avec LibreOffice et relecture visuelle ; design-critique ; accessibility-review (contraste AA, taille minimale 20 pt sur les slides) ; recherche automatique des mots et tournures interdits ; verification-before-completion. Commit et push sur `claude/festive-keller-6c9guo`.

## Découpage final, tel que produit

Construit à partir du fichier `01_presentation/Initiation_Power_BI.pptx` après production. Écarts avec le découpage validé : slides 24 et 41-42 fusionnées comme convenu ; slide 10 reformulée (un Charger direct envoie le titre et la ligne TOTAL dans la table, voir sources) ; fractionnement (18) placé avant le nettoyage de la casse (19), puisqu'il faut une colonne Ville pour la nettoyer ; slide 23 centrée sur le visuel sans relation.

| # | Titre | Gabarit (layout) | Captures |
|---|---|---|---|
| 1 |  | Couverture |  |
| 2 |  | Enonce |  |
| 3 |  | Contenu | C03 |
| 4 |  | Contenu | C04 |
| 5 |  | Contenu |  |
| 6 |  | A vous |  |
| 7 |  | Contenu | C07a, C07b, C07c |
| 8 |  | Contenu | C08 |
| 9 |  | Contenu | C09 |
| 10 |  | Contenu | C10a, C10b |
| 11 |  | A vous |  |
| 12 |  | Contenu |  |
| 13 |  | Contenu | C13 |
| 14 |  | Contenu | C14a, C14b |
| 15 |  | Contenu | C15 |
| 16 |  | A vous |  |
| 17 |  | Enonce |  |
| 18 |  | Contenu | C18 |
| 19 |  | Contenu | C19a, C19b |
| 20 |  | Enonce |  |
| 21 |  | A vous |  |
| 22 |  | Contenu | C22a, C22b |
| 23 |  | Contenu | C23 |
| 24 |  | Contenu |  |
| 25 |  | Contenu | C25a, C25b |
| 26 |  | Contenu | C26a, C26b |
| 27 |  | Contenu | C27 |
| 28 |  | Contenu |  |
| 29 |  | A vous |  |
| 30 |  | Contenu |  |
| 31 |  | Contenu |  |
| 32 |  | Contenu | C32a, C32b |
| 33 |  | Contenu |  |
| 34 |  | Contenu | C34 |
| 35 |  | Contenu | graphique |
| 36 |  | A vous |  |
| 37 |  | Contenu | C37a, C37b |
| 38 |  | Contenu | C38 |
| 39 |  | A vous |  |
| 40 |  | Enonce |  |
