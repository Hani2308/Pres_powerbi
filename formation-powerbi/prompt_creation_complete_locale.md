# Prompt : créer toute la formation de zéro sur le PC qui a Power BI

À coller dans Claude Code (application Claude Desktop, onglet Code, Computer use activé) sur le PC Windows où Power BI Desktop est installé. Il ne suppose aucun dépôt existant.

```text
# Mission
Crée de zéro, sur cette machine, une formation d'initiation à Power BI d'une journée (6 h effectives), pour un public mixte : des métiers qui vivent dans Excel, de tous niveaux (vise les bases : SOMME, filtre automatique), et quelques profils techniques. Personne n'a jamais ouvert Power BI. Le formateur est SAHIR Hani, data scientist. Interface de Power BI Desktop en FRANÇAIS.

Tu fais TOUT toi-même, y compris les vraies captures d'écran de Power BI Desktop, d'Excel et de l'Explorateur, les fichiers .pbix et les contrôles. À la fin, je ne dois rien avoir à ajouter : aucun emplacement vide, aucune police à installer, aucun nom à corriger. Ne me pose de question que si tu es bloqué ; sinon avance et décide, puis justifie tes choix dans le compte rendu final.

# Accès et outils
- Tu as mon autorisation pour Computer use sur Power BI Desktop, Excel, PowerPoint et l'Explorateur de fichiers. Demande l'accès au début. Si aucun outil Computer use n'est disponible dans cette session, ARRÊTE-TOI et dis-le-moi : n'invente jamais une capture et ne fabrique jamais une image qui imite l'interface.
- Installe ce qu'il te faut : Python (pandas, numpy, openpyxl, python-pptx, python-docx, pillow), Node.js (pptxgenjs, docx).
- Dossier de travail : C:\Formation_PowerBI\ (livrables) ; données de TP : C:\Formation_PBI\ (chemin que les .pbix mémorisent, identique sur les postes des participants).
- Commence par noter la version exacte de Power BI Desktop (Aide > À propos) : tout libellé de menu écrit dans les supports doit être celui que TU VOIS à l'écran, pas celui de ta mémoire. Quand tu cites un menu, vérifie-le en l'ouvrant.

# Ce qu'il ne faut JAMAIS faire (la première version a été rejetée pour ça)
Forme : grilles de 3 ou 4 cartes identiques ; icône au-dessus de chaque titre ; chiffres décoratifs « 01 02 03 » ; sur-titre en majuscules espacées au-dessus des titres ; symétrie parfaite et même gabarit partout ; palette bleu marine + ambre ; encadrés « Règle d'or » ; filet sous les titres ; bandeaux de couleur décoratifs.
Fond : titres-étiquettes ou en listes (« Six règles pour… », « Les huit transformations ») ; tableaux récapitulatifs partout ; ton de manuel lisse ; aucune erreur réelle racontée ; dataset propre et générique ; notes formateur télégraphiques.
Vocabulaire interdit : plongée, découvrir, incontournable, booster, en un clin d'œil, véritable, révolutionner, univers, fluide, magique, puissant. Pas de tiret cadratin. Jamais la tournure « Ce n'est pas X, c'est Y ».
À la fin, scanne TOUT le texte (slides, notes, documents) avec une expression régulière pour ces mots et tournures, et réécris chaque occurrence.

# Le fil rouge : un export de caisse avec de vrais défauts
Enseigne fictive « Atlas Bazar » (vérifie qu'aucune marque réelle ne porte ce nom au Maroc ; sinon choisis un autre nom inventé) : 12 magasins de proximité dans 10 villes marocaines (Casablanca x3, Rabat, Salé, Marrakech, Fès, Meknès, Tanger, Agadir, Oujda, Tétouan) + un 13e (Kénitra, MAG-13) ouvert en mars 2026 et ABSENT du référentiel. Catégories : Épicerie, Boissons, Hygiène et beauté, Maison, Textile, Fournitures scolaires ; une cinquantaine de produits réalistes avec prix en MAD (thé, dattes, huile d'olive, savon beldi, théière, tajine, kanoun, djellaba, babouches, cartable…).
Écris un script Python à graine fixe qui produit Ventes_Retail.xlsx (1er octobre 2024 au 30 septembre 2026) et Ventes_Retail_MAJ.xlsx (le même export prolongé jusqu'au 11 octobre 2026, pour la démo d'actualisation), environ 5 000 lignes de tickets (Date, N° ticket, Code magasin, Réf produit, Quantité, Prix unitaire). Une ligne = un article d'un ticket ; 1 à 3 articles par ticket.
Saisonnalité : Ramadan (environ 2 au 30 mars 2025, 19 février au 19 mars 2026 : épicerie x3, boissons x2, textile en hausse la semaine avant l'Aïd al-Fitr), Aïd al-Adha (7 juin 2025 avec effet faible, appel royal à ne pas sacrifier pour cause de sécheresse ; 27 mai 2026 effet fort sur Maison), rentrée (25 août au 15 septembre, fournitures x10), soldes textile (janvier, juillet-août, prix -30 %), boissons en été, +7 %/an. Indique dans le corrigé que les dates de fêtes sont des estimations.
IMPORTANT : avec ~200 lignes par mois le bruit masque la saisonnalité. Limite la variance des prix et teste plusieurs graines jusqu'à obtenir un effet net et racontable : février 2026 nettement AU-DESSUS de février 2025, mars 2026 nettement EN DESSOUS de mars 2025 (le Ramadan a avancé de onze jours), et un pic de rentrée en septembre.
Défauts à planter (et SEULEMENT des défauts qui se comportent vraiment comme annoncé dans Power BI) :
1. Feuille Export_Ventes : une ligne de titre (« ATLAS BAZAR - Journal des ventes - Période… - Généré le … à 07:42 ») et une ligne vide au-dessus des en-têtes.
2. Dates stockées en TEXTE au format JJ/MM/AAAA.
3. Une ligne vide puis une ligne « TOTAL GÉNÉRAL » collées sous les données.
4. Environ 30 lignes recollées en double à la fin (une semaine réexportée), avec un espace après chaque code magasin (« MAG-03 »). Supprimer les doublons AVANT de supprimer les espaces ne les enlève pas.
5. MAG-13 vend mais n'existe pas dans la feuille Magasins.
6. Feuille Magasins : colonne fusionnée « Ville - Région » (« Casablanca - Casablanca-Settat », un simple tiret coupe donc aussi la région) ; casse incohérente (« Casablanca », « casa », « CASABLANCA » suivi d'espaces) ; MAG-05 saisi deux fois, la seconde avec « Salé » suivi d'espaces.
7. Feuilles Produits et Calendrier propres (Calendrier : Date, Année, N° mois, Mois en lettres minuscules, Trimestre, du 1/1/2024 au 31/12/2026). Le mois en texte se triera par ordre alphabétique : c'est voulu.
Ajoute une feuille « Corrigé formateur » (défaut, cellules exactes, ce qu'on voit dans Power BI, correction, numéro de slide) et des valeurs de contrôle. Fais aussi des copies SANS cette feuille pour les participants. Rejoue le nettoyage complet en pandas pour calculer les valeurs attendues (lignes propres, CA, tickets, panier moyen, CA Casablanca, mars et février N et N-1, CA de MAG-13) et réutilise exactement ces chiffres partout.

# Faits vérifiés (contrôle-les à l'écran, ils guident les erreurs racontées)
- Le modèle de Power BI ignore la casse (« CASABLANCA » et « Casablanca » fusionnent une fois chargés) et probablement les espaces de fin ; Power Query, lui, compare exactement. Ne fais reposer AUCUNE démonstration sur « un espace casse la relation ». Les effets réels : « casa » reste une ville à part, et les doublons qui diffèrent d'un espace survivent à Supprimer les doublons et gonflent le CA.
- Une relation texte / nombre peut se créer mais ne trouve aucune correspondance ; les refus de relation viennent surtout de doublons côté « un ». Le doublon MAG-05 provoque la proposition « plusieurs-à-plusieurs ».
- Supprimer les doublons ne regarde que les colonnes SÉLECTIONNÉES : avec la seule colonne Code magasin sélectionnée, il reste 13 lignes. Erreur fréquente, à raconter.
- Remplacer « Casa » par « Casablanca » sans « Mettre en correspondance tout le contenu de la cellule » donne « Casablancablanca ».
- DAX utilise la VIRGULE comme séparateur, même en interface française (option « séparateurs DAX localisés » dans Options > Global > Paramètres régionaux). Fonctions en anglais.
- La documentation Microsoft française traduit la direction de filtrage « Single » par « Célibataire » ; regarde ce qu'affiche ta boîte « Modifier la relation ».
- Par défaut, Power BI détecte automatiquement les relations au chargement : fais décocher les deux cases Relations (Options > Fichier actuel > Chargement des données) au TP 1, sinon l'erreur « sans relation, chaque ville a le même total » n'apparaît jamais.
- Ce que fait réellement un Charger direct de cet export (noms de colonnes, ligne TOTAL) : TESTE-LE et décris exactement ce que tu vois.

# Les 7 formules DAX (pas une de plus)
Montant = Ventes[Quantité] * Ventes[Prix unitaire]   (colonne calculée)
CA = SUM(Ventes[Montant])
Nb tickets = DISTINCTCOUNT(Ventes[N° ticket])
Panier moyen = DIVIDE([CA], [Nb tickets])
CA Casablanca = CALCULATE([CA], Magasins[Ville] = "Casablanca")
CA N-1 = CALCULATE([CA], SAMEPERIODLASTYEAR(Calendrier[Date]))
Évolution vs N-1 = DIVIDE([CA] - [CA N-1], [CA N-1])
Vérifie chacune dans Power BI et compare au calcul pandas.

# Déroulé de la journée (9h00-16h30, déjeuner 12h30-13h30, pauses 11h00 et 15h20)
Au moins 50 % du temps en manipulation ; en cas de retard on coupe l'exposé, jamais un TP.
- 9h00 Ouverture (40 min) : tour de table « quel fichier refaites-vous à la main chaque semaine ? » noté au paperboard ; la douleur du lundi (le dossier de versions final_v3, final_VRAI, corrigé Samir) ; démo « wow » de 10 min du rapport fini qui s'actualise d'un clic en remplaçant l'export ; la journée comme un trajet (importer, nettoyer, relier, calculer, montrer) ; postes vérifiés ; repérage des pièges dans Excel en binôme.
- 9h40 Module 1 Importer (30 min) : les vues, le Navigateur, l'erreur du bouton Charger, TP 1.
- 10h10 Module 2 Power Query (125 min avec la pause) : la recette rejouée à chaque actualisation, Étapes appliquées, les dates lues à l'américaine (le 13/02 devient Error, le 03/04 devient le 4 mars sans message), paramètres régionaux Français (Maroc), TP 2a ; « combien de villes ? », fractionner (espace-tiret-espace), casse et Casablancablanca, supprimer les espaces AVANT de dédoublonner, TP 2b ; démo d'actualisation avec l'export du 12 octobre ; Fermer et appliquer.
- 13h30 Module 3 Modèle (55 min) : premier visuel faux sans relation, schéma en étoile, relier dans la vue Modèle, plusieurs-à-plusieurs, ligne « (Vide) » de MAG-13 (on prévient le propriétaire du référentiel, on ne bricole pas), le filtre descend du référentiel vers les ventes (Nb magasins par catégorie = 12 partout ; on compte côté Ventes avec DISTINCTCOUNT, pas avec « Les deux »), TP 3 avec Marquer comme table de dates et Date/heure automatique désactivée.
- 14h25 Module 4 DAX (55 min) : colonne contre mesure, frappe guidée, CA écrit en colonne calculée (le total sur chaque ligne), DIVIDE, CALCULATE (pourquoi CA Casablanca s'affiche sur la ligne Fès), N-1 et le Ramadan, TP 4.
- 15h35 Module 5 Rapport (40 min) : mois triés par ordre alphabétique et Trier par colonne, lire une page de haut en bas, TP 5 (reconstruire la page de la démo), puis quiz de 10 questions et retour au paperboard du matin.
Fabrique cinq fichiers de rattrapage, un par fin de module : R1_import, R2_nettoye, R3_modele, R4_mesures (SANS le tri par colonne), R5_rapport (le rapport de la démo : 4 cartes CA, Nb tickets, Panier moyen, Évolution vs N-1, plus une carte Dernière vente ; colonnes groupées CA et CA N-1 par mois ; barres CA par ville ; matrice catégorie x année ; segments Année et Catégorie). Enregistre-les dans C:\Formation_PBI\rattrapage\ et vérifie les valeurs de contrôle dans chacun.

# La présentation : 38 à 40 slides
- Chaque titre est une PHRASE qui affirme quelque chose (« Power Query rejoue vos nettoyages à chaque actualisation »), jamais une étiquette.
- Gabarits variés, jamais plus de 2 slides consécutives sur la même structure : capture plein cadre annotée ; capture + étapes numérotées ; avant / après (deux captures) ; une phrase en grand ; question à la salle quasi vide ; schéma de mécanisme (seulement pour l'étoile, la propagation du filtre, colonne contre mesure, la recette Power Query) ; formule DAX en grand avec son résultat ; graphique calculé sur les données (CA 2026 contre N-1 par mois, février et mars mis en évidence) ; consigne de TP.
- Au moins une erreur réelle racontée par module, avec ce qu'on voit à l'écran et la correction. Neuf au total environ.
- CAPTURES : fais-les toi-même dans Power BI Desktop, Excel et l'Explorateur (y compris celles des erreurs, sur des copies jetables de fichiers). Fenêtre maximisée, 1920 x 1080, pas de notification ni d'information personnelle. Recadre au plus utile. Annote-les directement sur l'image avec Pillow, aux coordonnées exactes : cadres et flèches rouges #C8261D épaisseur 4 px, pastilles rouges numérotées UNIQUEMENT pour de vraies étapes de clic. Regarde chaque capture avant de l'utiliser. Mets un texte de remplacement (alt text) sur chaque image.
- Direction visuelle sobre, type support édité par un organisme de formation : fond blanc #FFFFFF, encre #222222, gris #5E5E5E, une seule couleur forte pétrole #0B4F4A réservée aux slides de consigne de TP (fond plein, texte blanc) et à « ce qui est corrigé », rouge #C8261D pour les annotations et « ce qui ne va pas ». Polices déjà présentes sous Windows : Georgia pour les titres (30 pt, alignés à gauche, 2 lignes maximum), Segoe UI pour le texte (20 pt minimum, jamais moins de 18 pt nulle part sauf le pied de page), Consolas pour le DAX. Pas d'icônes, pas de cartes, pas de dégradés. Format 16:9, marges 1,65 cm.
- Pied de page discret sur CHAQUE slide : « Réalisé par SAHIR Hani », plus le numéro de slide. Couverture : « SAHIR Hani, data scientist ».
- Typographie française : espaces insécables avant : ; ? ! et dans les guillemets « », apostrophe courbe.
- Notes formateur sur CHAQUE slide, écrites comme je parlerais à l'oral, en français naturel : transitions, questions à poser à la salle et réponses attendues, moments où ça décroche d'habitude et quoi faire, timing, anecdotes plausibles présentées comme fréquentes (n'invente pas de souvenir personnel précis à ma place).

# Les autres livrables
- Guide participant (.docx, A4, mêmes polices et couleurs) : fichiers et fil rouge ; les 5 TP clic par clic avec les vraies captures ; résultat attendu chiffré et « si vous avez décroché » pour chaque TP ; tableau « si vous ne trouvez pas le bon nombre de lignes » ; valeurs attendues ; aide-mémoire des 7 formules avec un tableau Excel contre DAX ; glossaire court ; quiz de 10 questions et corrigé sur une page séparée.
- Déroulé formateur (.docx) : la journée en une page, préparation (une semaine avant, la veille, le matin), minutage avec numéros de slides, quoi couper si on est en retard, moments où la salle décroche, les erreurs racontées, procédure de fabrication des fichiers de rattrapage, procédure de la démo d'actualisation (et remise du fichier d'origine juste après), valeurs de contrôle, questions fréquentes de la salle.
- Arborescence finale dans C:\Formation_PowerBI\ :
  01_presentation\Initiation_Power_BI.pptx
  02_guide\Guide_participant.docx (et une version PDF pour l'impression)
  03_donnees\Ventes_Retail.xlsx, Ventes_Retail_MAJ.xlsx, participants\ (sans corrigé), le script de génération
  04_formateur\Deroule_formateur.docx
  05_captures\ (les PNG annotés)
  06_rattrapage\R1 à R5 .pbix
  sources.md (les pages Microsoft Learn consultées, en français, pour les noms de menus et la syntaxe DAX)
  LISEZMOI.md (comment installer la salle en 10 minutes)

# Contrôle avant de me rendre la main
1. Exporte chaque slide en image depuis PowerPoint et regarde-les toutes : rien qui déborde, rien qui se chevauche, titres à la même place, annotations sur le bon élément.
2. Ouvre les deux .docx et parcours-les page par page.
3. Vérifie : 38 à 40 slides ; notes sur chaque slide ; pied de page « Réalisé par SAHIR Hani » partout ; aucun emplacement vide ; aucun texte de slide sous 18 pt hormis le pied ; contrastes WCAG AA ; les chiffres identiques entre corrigé, slides, guide et déroulé ; chaque .pbix de rattrapage s'ouvre et donne les valeurs de contrôle.
4. Scan des mots et tournures interdits sur tout le texte.
5. Compte rendu final : ce qui est livré, les choix que tu as faits seul, les libellés de menus qui différaient de ce qui était prévu, et tout ce que tu n'as pas pu faire, avec la raison. N'affirme rien que tu n'as pas vérifié.
```
