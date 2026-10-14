# Liste des captures d'écran

30 captures, en 5 séances regroupées par état du fichier, environ 30 minutes au total. Le numéro de slide indique où la capture va dans `01_presentation/Initiation_Power_BI.pptx`.

## Avant de commencer

- Écran en 1920 x 1080, mise à l'échelle Windows à 100 % (Paramètres > Système > Écran). À 125 %, les captures restent lisibles mais le recadrage change.
- Power BI Desktop en français, la même version que celle des participants, fenêtre maximisée.
- Dossier `C:\Formation_PBI\` en place, avec les fichiers de `03_donnees/participants/` et les .pbix de rattrapage déjà créés (procédure dans le déroulé formateur).
- Outil : Win + Maj + S, mode Rectangle. Enregistrez chaque capture en PNG sous son identifiant (`C07a.png`) dans `05_captures/`.
- Les annotations rouges sont déjà posées dans le .pptx. Vous n'annotez rien vous-même.

## Insérer une capture dans la slide

1. Sur la slide, cliquez sur le rectangle gris pointillé « Capture Cxx » et notez sa taille (Format de la forme > Taille).
2. Insertion > Images > Cet appareil, choisissez `Cxx.png`.
3. Donnez-lui la même largeur que le rectangle, alignez-la sur son coin haut gauche. Si la hauteur dépasse, rognez (Format de l'image > Rogner) plutôt que de déformer.
4. Clic droit sur l'image > Mettre en arrière-plan, puis Avancer d'un plan jusqu'à passer devant le rectangle gris : les cadres et flèches rouges restent au-dessus.
5. Supprimez le rectangle gris et sa légende « Capture Cxx ».
6. Recalez les cadres rouges de quelques millimètres sur les vrais éléments de l'interface.
7. Clic droit sur l'image > Afficher le texte de remplacement : collez la ligne « Ce qu'on doit voir » de la capture. Les participants qui suivent le support avec un lecteur d'écran en ont besoin.

## Séance : Hors de Power BI (5 min)

*Explorateur Windows et Excel, avant d'ouvrir Power BI.*

### C03 : slide 3

- **Ce qu'on doit voir** : Explorateur Windows, dossier « Reporting ventes » avec les versions empilées.
- **État du fichier** : Aucun fichier Power BI. Dossier préparé avec le script PowerShell ci-dessous.
- **Clics** : Ouvrir le dossier dans l'Explorateur, affichage Détails, tri par Date de modification. Les 7 fichiers doivent tenir à l'écran.
- **Recadrage** : La fenêtre de l'Explorateur sans le ruban : barre d'adresse + liste des fichiers avec les colonnes Nom et Modifié le.
- **Annotations déjà posées** : Un cadre rouge autour des trois derniers fichiers.
- **Préparation (PowerShell, une seule ligne)** :

  ```powershell
  New-Item -ItemType Directory -Force "C:\Formation_PBI\Reporting ventes" | Out-Null; cd "C:\Formation_PBI\Reporting ventes"; "Reporting_ventes_S38.xlsx","Reporting_ventes_S38_v2.xlsx","Reporting_ventes_S38_final.xlsx","Copie de Reporting_ventes_S38_final.xlsx","Reporting_ventes_S38_final_v3.xlsx","Reporting_ventes_S38_final_VRAI.xlsx","Reporting_ventes_S38_final_VRAI (corrigé Samir).xlsx" | % { New-Item $_ -ItemType File | Out-Null; Start-Sleep 1 }
  ```

### C07a : slide 7

- **Ce qu'on doit voir** : Excel, Export_Ventes, lignes 1 à 8.
- **État du fichier** : participants/Ventes_Retail.xlsx ouvert dans Excel, zoom 100 %.
- **Clics** : Feuille Export_Ventes, cellule A1 sélectionnée. Colonnes A à F visibles.
- **Recadrage** : Lignes 1 à 8, colonnes A à F, avec les en-têtes de lignes et de colonnes d'Excel.
- **Annotations déjà posées** : Cadre sur A1 (titre), cadre sur la colonne Date (texte aligné à gauche).

### C07b : slide 7

- **Ce qu'on doit voir** : Excel, Export_Ventes, dernières lignes.
- **État du fichier** : Même fichier.
- **Clics** : Ctrl + Fin, puis remonter pour voir les lignes 5184 à 5194 : fin du bloc recollé, ligne vide, TOTAL GÉNÉRAL.
- **Recadrage** : Lignes 5184 à 5194, colonnes A à F.
- **Annotations déjà posées** : Cadre sur la ligne TOTAL GÉNÉRAL, cadre sur la colonne Code magasin du bloc recollé.

### C07c : slide 7

- **Ce qu'on doit voir** : Excel, feuille Magasins entière.
- **État du fichier** : Même fichier.
- **Clics** : Feuille Magasins, colonnes A à E élargies pour tout lire.
- **Recadrage** : Lignes 1 à 14, colonnes A à E.
- **Annotations déjà posées** : Cadres sur C2, C3, C4 (casse), sur les lignes 6 et 7 (MAG-05 en double), sur l'en-tête Ville - Région.

## Séance : Rapport vierge et import (5 min)

*Power BI Desktop, Fichier > Nouveau. Gardez un fichier jetable pour C10a.*

### C08 : slide 8

- **Ce qu'on doit voir** : Power BI Desktop, nouveau rapport vide.
- **État du fichier** : Power BI Desktop ouvert sur un rapport vierge (Fichier > Nouveau).
- **Clics** : Vue Rapport, volets Filtres, Visualisations et Données dépliés. Survoler l'icône Table de la barre de gauche pour faire apparaître son infobulle.
- **Recadrage** : Fenêtre entière de Power BI Desktop, en 1600 x 900 environ.
- **Annotations déjà posées** : Cadre sur la barre d'icônes à gauche, cadre sur les trois volets de droite.
- **Contrôle libellé** : Nom de la vue du milieu : « Vue Table » ou « Vue Données » ? Noter le libellé exact de l'infobulle et me le signaler pour corriger la slide.

### C09 : slide 9

- **Ce qu'on doit voir** : Fenêtre Navigateur, quatre feuilles cochées, aperçu de Export_Ventes.
- **État du fichier** : Rapport vierge.
- **Clics** : Accueil > Obtenir les données > Classeur Excel > C:\Formation_PBI\Ventes_Retail.xlsx. Cocher les 4 feuilles, cliquer sur Export_Ventes pour afficher son aperçu. Ne cliquer sur aucun bouton.
- **Recadrage** : La fenêtre Navigateur entière, boutons Charger et Transformer les données compris.
- **Annotations déjà posées** : Pastilles 3 sur les cases à cocher et 4 sur le bouton Transformer les données.

### C10a : slide 10

- **Ce qu'on doit voir** : Vue Table après un Charger direct : en-têtes faux, lignes parasites.
- **État du fichier** : Fichier jetable : rapport vierge, import de Export_Ventes avec le bouton Charger.
- **Clics** : Vue Table, table Export_Ventes, faire défiler pour voir les premières lignes. Laisser visible le message d'erreurs de chargement s'il apparaît.
- **Recadrage** : La grille de la vue Table avec les noms de colonnes et les 10 premières lignes.
- **Annotations déjà posées** : Cadre sur la ligne des noms de colonnes.
- **Contrôle libellé** : Noter ce qu'affiche réellement Power BI comme noms de colonnes (Column1… ou le titre de l'export) et me le dire : la note formateur en dépend.

### C10b : slide 10

- **Ce qu'on doit voir** : Éditeur Power Query, Export_Ventes avant toute transformation.
- **État du fichier** : Même import, cette fois avec Transformer les données.
- **Clics** : Requête Export_Ventes sélectionnée, aperçu en haut de la table.
- **Recadrage** : L'aperçu des données (sans le ruban) et le volet Étapes appliquées.
- **Annotations déjà posées** : Cadre sur les deux premières lignes de l'aperçu.

## Séance : Power Query (8 min)

*R1_import.pbix puis R2_nettoye.pbix. Pour C14a, une copie jetable de R1.*

### C13 : slide 13

- **Ce qu'on doit voir** : Éditeur Power Query, requête Ventes après quatre étapes, barre de formule visible.
- **État du fichier** : R2_nettoye.pbix, Accueil > Transformer les données.
- **Clics** : Requête Ventes, cliquer sur l'étape « Lignes filtrées » dans Étapes appliquées. Affichage > Barre de formule cochée.
- **Recadrage** : Fenêtre entière de l'éditeur Power Query.
- **Annotations déjà posées** : Cadre sur la barre de formule, cadre sur le volet Étapes appliquées.
- **Contrôle libellé** : Libellés réels des étapes générées (« Lignes du haut supprimées », « En-têtes promus », « Lignes filtrées ») : les reporter si différents.

### C14a : slide 14

- **Ce qu'on doit voir** : Colonne Date convertie en type Date avec des paramètres régionaux US : Error et dates inversées.
- **État du fichier** : Copie jetable de R1. Fichier > Options et paramètres > Options > Fichier actuel > Paramètres régionaux : Anglais (États-Unis).
- **Clics** : Requête Ventes, en-têtes faits, clic sur l'icône de type de Date > Date. Faire défiler jusqu'à voir à la fois une cellule Error (jour > 12) et une date du type 04/03/2025.
- **Recadrage** : Les colonnes Date et N° ticket sur une quinzaine de lignes.
- **Annotations déjà posées** : Cadre sur une cellule Error, cadre sur une date inversée.
- **Contrôle libellé** : Nom exact de l'option : « Paramètres régionaux pour l'importation » ?

### C14b : slide 14

- **Ce qu'on doit voir** : La même colonne convertie avec Utilisation des paramètres régionaux, Français (Maroc).
- **État du fichier** : Même fichier, étape de type supprimée puis refaite avec les paramètres régionaux.
- **Clics** : Mêmes lignes qu'en C14a.
- **Recadrage** : Identique à C14a, pour que les deux images se comparent ligne à ligne.
- **Annotations déjà posées** : Cadres aux mêmes endroits qu'en C14a.

### C15 : slide 15

- **Ce qu'on doit voir** : Boîte « Modifier le type avec les paramètres régionaux », Date et Français (Maroc).
- **État du fichier** : R1 + en-têtes faits.
- **Clics** : Clic sur l'icône ABC à gauche de l'en-tête Date > Utilisation des paramètres régionaux… Choisir Date et Français (Maroc), ne pas valider.
- **Recadrage** : Le menu de l'icône de type à gauche et la boîte de dialogue à droite. Si les deux ne tiennent pas ensemble, faire deux captures et les juxtaposer.
- **Annotations déjà posées** : Pastille 1 sur l'icône de type, pastille 2 sur la dernière ligne du menu, pastille 3 sur les deux listes de la boîte.
- **Contrôle libellé** : Libellé exact de la dernière ligne du menu (« Utilisation des paramètres régionaux… »).

### C18 : slide 18

- **Ce qu'on doit voir** : Boîte « Fractionner la colonne par délimiteur », délimiteur personnalisé espace-tiret-espace.
- **État du fichier** : R2_nettoye.pbix avec l'étape de fractionnement supprimée (copie jetable), ou R1 + étapes du TP 2a.
- **Clics** : Requête Magasins, colonne Ville - Région sélectionnée, Accueil > Fractionner la colonne > Par délimiteur. Choisir Personnalisé et taper espace, tiret, espace. Ne pas valider.
- **Recadrage** : La boîte de dialogue entière, avec un bout de la colonne Ville - Région derrière.
- **Annotations déjà posées** : Pastille 2 sur la liste du délimiteur, pastille 3 sur la zone de saisie.
- **Contrôle libellé** : Libellé exact de l'option « À chaque occurrence du délimiteur ».

### C19a : slide 19

- **Ce qu'on doit voir** : Liste déroulante du filtre sur Ville après fractionnement : 13 valeurs.
- **État du fichier** : Requête Magasins juste après le fractionnement.
- **Clics** : Clic sur la flèche de filtre de la colonne Ville. La liste doit montrer les 13 valeurs.
- **Recadrage** : La liste déroulante du filtre seule.
- **Annotations déjà posées** : Cadre sur casa, Casablanca, CASABLANCA et les deux Salé.

### C19b : slide 19

- **Ce qu'on doit voir** : Même filtre après Supprimer les espaces, Majuscule à chaque mot, Remplacer : 10 valeurs.
- **État du fichier** : Requête Magasins après les trois étapes de nettoyage.
- **Clics** : Clic sur la même flèche de filtre.
- **Recadrage** : Identique à C19a.
- **Annotations déjà posées** : Aucune.

## Séance : Modèle (5 min)

*R2_nettoye.pbix (aucune relation), une copie jetable pour C26a, puis R3_modele.pbix.*

### C23 : slide 23

- **Ce qu'on doit voir** : Visuel Table : Magasins[Ville] et Somme de Quantité, même nombre sur chaque ligne.
- **État du fichier** : R2_nettoye.pbix, aucune relation.
- **Clics** : Vue Rapport, insérer un visuel Table, glisser Magasins > Ville puis Ventes > Quantité. Agrandir le visuel pour voir les 10 villes et le total.
- **Recadrage** : Le visuel Table et le volet Visualisations avec ses zones de dépôt.
- **Annotations déjà posées** : Cadre sur la colonne des quantités (toutes identiques).

### C26a : slide 26

- **Ce qu'on doit voir** : Boîte de relation avec cardinalité Plusieurs-à-plusieurs et son avertissement.
- **État du fichier** : Copie jetable de R2 où l'étape Doublons supprimés de Magasins a été retirée, puis Fermer et appliquer.
- **Clics** : Vue Modèle, glisser Ventes[Code magasin] sur Magasins[Code magasin].
- **Recadrage** : La boîte de dialogue : cardinalité et message d'avertissement jaune.
- **Annotations déjà posées** : Cadre sur la cardinalité, cadre sur le message.
- **Contrôle libellé** : Texte exact du message d'avertissement.

### C25a : slide 25

- **Ce qu'on doit voir** : Vue Modèle avec les quatre tables reliées en étoile.
- **État du fichier** : R3_modele.pbix.
- **Clics** : Vue Modèle, disposer les tables en étoile (Ventes au centre). Ajuster le zoom pour que tout tienne.
- **Recadrage** : Le canevas de la vue Modèle, sans les volets de droite.
- **Annotations déjà posées** : Cadre sur un lien avec son 1 et son *.

### C25b : slide 25

- **Ce qu'on doit voir** : Boîte Modifier la relation, Ventes et Magasins.
- **État du fichier** : R3_modele.pbix.
- **Clics** : Double-clic sur le lien Ventes - Magasins.
- **Recadrage** : La partie basse de la boîte : Cardinalité et Direction du filtrage croisé.
- **Annotations déjà posées** : Cadres sur Cardinalité et sur Direction du filtrage croisé.
- **Contrôle libellé** : Libellés exacts des deux listes et des valeurs « Plusieurs-à-un (*:1) » et « Unique » (la documentation française dit « Célibataire »).

### C26b : slide 26

- **Ce qu'on doit voir** : Même boîte avec la cardinalité un-à-plusieurs, sans avertissement.
- **État du fichier** : R3_modele.pbix.
- **Clics** : Double-clic sur le lien Ventes - Magasins.
- **Recadrage** : Identique à C26a.
- **Annotations déjà posées** : Cadre sur la cardinalité.

### C27 : slide 27

- **Ce qu'on doit voir** : Visuel Table Ville et Somme de Quantité, avec une ligne (Vide).
- **État du fichier** : R3_modele.pbix.
- **Clics** : Vue Rapport, visuel Table : Magasins[Ville], Magasins[Nom magasin], Somme de Quantité. Trier pour que (Vide) soit visible.
- **Recadrage** : Le visuel seul.
- **Annotations déjà posées** : Cadre sur la ligne (Vide).

## Séance : Mesures et rapport (7 min)

*R4_mesures.pbix (une copie jetable pour C32a), puis R5_rapport.pbix. Gardez C22b pour la fin : elle demande de remplacer le fichier source.*

### C32a : slide 32

- **Ce qu'on doit voir** : Vue Table, colonne CA_colonne affichant le total général sur chaque ligne.
- **État du fichier** : Copie jetable de R4 : Outils de table > Nouvelle colonne, CA_colonne = SUM(Ventes[Montant]).
- **Clics** : Vue Table, table Ventes, colonne CA_colonne visible à côté de Montant.
- **Recadrage** : Les colonnes Montant et CA_colonne sur une quinzaine de lignes.
- **Annotations déjà posées** : Cadre sur la colonne CA_colonne.

### C32b : slide 32

- **Ce qu'on doit voir** : Visuel Table par ville avec la mesure CA : un chiffre différent par ville.
- **État du fichier** : R4_mesures.pbix.
- **Clics** : Vue Rapport, visuel Table : Magasins[Ville] et la mesure CA.
- **Recadrage** : Le visuel seul.
- **Annotations déjà posées** : Aucune.

### C34 : slide 34

- **Ce qu'on doit voir** : Visuel Table par ville avec CA et CA Casablanca : la seconde colonne est identique partout.
- **État du fichier** : R4_mesures.pbix.
- **Clics** : Vue Rapport, visuel Table : Magasins[Ville], CA, CA Casablanca.
- **Recadrage** : Le visuel seul, toutes les villes visibles.
- **Annotations déjà posées** : Cadre sur la colonne CA Casablanca.

### C37a : slide 37

- **Ce qu'on doit voir** : Graphique en colonnes CA par Calendrier[Mois] : avril, août, décembre, février…
- **État du fichier** : R4_mesures.pbix, sans tri par colonne sur Mois.
- **Clics** : Vue Rapport, graphique en colonnes groupées, axe Calendrier[Mois], valeur CA, trié par Mois croissant.
- **Recadrage** : Le graphique seul.
- **Annotations déjà posées** : Cadre sur les premières étiquettes de l'axe.

### C37b : slide 37

- **Ce qu'on doit voir** : Même graphique, janvier à décembre.
- **État du fichier** : R5_rapport.pbix (tri par colonne appliqué).
- **Clics** : Même graphique.
- **Recadrage** : Identique à C37a.
- **Annotations déjà posées** : Aucune.

### C38 : slide 38

- **Ce qu'on doit voir** : Page Ventes du rapport final, segments visibles.
- **État du fichier** : R5_rapport.pbix.
- **Clics** : Vue Rapport, page Ventes. Volets refermés. Aucun filtre actif.
- **Recadrage** : Le canevas du rapport seul.
- **Annotations déjà posées** : Trois cadres : rangée de cartes, graphique mensuel, rangée du bas (barres + matrice).

### C04 : slide 4

- **Ce qu'on doit voir** : Rapport final Atlas Bazar, vue Rapport, volets refermés.
- **État du fichier** : R5_rapport.pbix, source = Ventes_Retail.xlsx (au 30/09/2026).
- **Clics** : Vue Rapport, page « Ventes ». Refermer les volets Filtres, Visualisations et Données (chevrons) pour que la page occupe l'écran. Aucun segment sélectionné.
- **Recadrage** : Le canevas du rapport seul, sans le ruban ni la barre des pages.
- **Annotations déjà posées** : Un cadre rouge sur la carte « Dernière vente ».

### C22a : slide 22

- **Ce qu'on doit voir** : Rapport final, graphique mensuel s'arrêtant en septembre 2026, carte Dernière vente au 30/09/2026.
- **État du fichier** : R5_rapport.pbix avec Ventes_Retail.xlsx d'origine.
- **Clics** : Vue Rapport, page Ventes, segment Année sur 2026.
- **Recadrage** : La carte Dernière vente et le graphique mensuel.
- **Annotations déjà posées** : Cadre sur la carte Dernière vente.

### C22b : slide 22

- **Ce qu'on doit voir** : Même vue après remplacement du fichier par l'export du 12/10 et Actualiser.
- **État du fichier** : R5_rapport.pbix, Ventes_Retail.xlsx remplacé par le contenu de Ventes_Retail_MAJ.xlsx, Accueil > Actualiser.
- **Clics** : Même page, même segment.
- **Recadrage** : Identique à C22a.
- **Annotations déjà posées** : Cadre sur la carte Dernière vente (11/10/2026) et sur la colonne octobre.

## Libellés à contrôler pendant la séance

La documentation Microsoft n'a pas pu être ouverte en entier depuis l'environnement de production (voir `sources.md`). Ces libellés viennent de la documentation française et doivent être comparés à votre écran. S'il y a un écart, notez le libellé exact : la correction se fait dans `01_presentation/build/construire_presentation.js` puis on reconstruit.

| Capture | Slide | À vérifier | Libellé réel |
|---|---|---|---|
| C08 | 8 | Nom de la vue du milieu : « Vue Table » ou « Vue Données » ? Noter le libellé exact de l'infobulle et me le signaler pour corriger la slide. | |
| C10a | 10 | Noter ce qu'affiche réellement Power BI comme noms de colonnes (Column1… ou le titre de l'export) et me le dire : la note formateur en dépend. | |
| C13 | 13 | Libellés réels des étapes générées (« Lignes du haut supprimées », « En-têtes promus », « Lignes filtrées ») : les reporter si différents. | |
| C14a | 14 | Nom exact de l'option : « Paramètres régionaux pour l'importation » ? | |
| C15 | 15 | Libellé exact de la dernière ligne du menu (« Utilisation des paramètres régionaux… »). | |
| C18 | 18 | Libellé exact de l'option « À chaque occurrence du délimiteur ». | |
| C26a | 26 | Texte exact du message d'avertissement. | |
| C25b | 25 | Libellés exacts des deux listes et des valeurs « Plusieurs-à-un (*:1) » et « Unique » (la documentation française dit « Célibataire »). | |
| sans capture | 37 | Onglet Outils de colonne > Trier par colonne | |
| sans capture | 29 | Clic droit sur une table > « Marquer comme table de dates » (ou « Marquer en tant que table de dates ») | |
| sans capture | 19, 21 | Transformer > Format > « Supprimer les espaces » et « Majuscule à chaque mot » | |
| sans capture | 16 | Accueil > « Utiliser la première ligne pour les en-têtes » | |
| sans capture | 16 | Accueil > Supprimer les lignes > « Supprimer les lignes du haut » | |
| sans capture | 11, 29 | Fichier > Options > Fichier actuel > Chargement des données : noms des deux cases de la rubrique Relations, et de la case Date/heure automatique | |
| sans capture | 38 (notes) | Agrégation « Plus récent » sur un champ date dans une carte | |
