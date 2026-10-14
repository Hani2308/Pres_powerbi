# Sources consultées

Vérification faite le 14 octobre 2026, interface cible : Power BI Desktop en français.

## Comment la vérification a été faite (et ses limites)

Le plan prévoyait firecrawl (scrape) sur Microsoft Learn. Dans cet environnement, la politique réseau refuse les connexions vers `learn.microsoft.com` et `api.firecrawl.dev` (CONNECT 403). Le CLI firecrawl est installé mais n'a pas pu joindre son API. J'ai donc interrogé Microsoft Learn par recherche web restreinte au domaine `learn.microsoft.com`, qui renvoie le texte des pages sans permettre de les ouvrir en entier.

Conséquence pratique : les libellés ci-dessous viennent de la documentation française, qui n'est pas toujours identique à l'interface. Les libellés marqués **À contrôler à l'écran** seront vérifiés pendant la séance de captures (voir `05_captures/liste_captures.md`, chaque capture concernée porte la mention « contrôle libellé »). Si l'administrateur ouvre `learn.microsoft.com` dans les paramètres réseau de l'environnement, je peux refaire la passe avec firecrawl.

## Interface de Power BI Desktop

| Élément | Libellé retenu | Source | Statut |
|---|---|---|---|
| Les trois vues de base | Vue Rapport, Vue Table, Vue Modèle | [Vue table dans Power BI Desktop](https://learn.microsoft.com/fr-fr/power-bi/connect-data/desktop-data-view) | La page s'intitule « Vue table ». Certains supports tiers disent encore « Vue Données ». **À contrôler à l'écran** (infobulle de l'icône). |
| Vues avancées (citées, pas utilisées) | Vue de requête DAX, Vue TMDL | [Nouveautés Power BI](https://learn.microsoft.com/fr-fr/power-bi/fundamentals/desktop-latest-update), [archive des mises à jour](https://learn.microsoft.com/fr-fr/power-bi/fundamentals/desktop-latest-update-archive) | Vue TMDL en disponibilité générale depuis septembre 2025. On les montre du doigt, on n'y va pas. |
| Volet des champs | Volet **Données** (ex-« Champs ») | [Ajouter un filtre à un rapport](https://learn.microsoft.com/fr-fr/power-bi/create-reports/power-bi-report-add-filter), [Visite de l'éditeur de rapports](https://learn.microsoft.com/fr-fr/power-bi/create-reports/service-the-report-editor-take-a-tour) | Les pages récentes disent « Données », les anciennes « Champs ». Le cours dit « Données » et prévient que les tutos YouTube disent « Champs ». |
| Autres volets | Volet Visualisations (avec les icônes Mettre en forme / pinceau, Analytique / loupe), volet Filtres | [Mettre en forme les filtres](https://learn.microsoft.com/fr-fr/power-bi/create-reports/power-bi-report-filter) | Confirmé. |
| Tri des mois | Sélectionner la colonne Mois, onglet contextuel **Outils de colonne** > **Trier par colonne** | [Trier une colonne par une autre colonne](https://learn.microsoft.com/fr-fr/power-bi/create-reports/desktop-sort-by-column) | Confirmé. La doc précise que la colonne de tri doit avoir une valeur unique par mois. |
| Table de dates | Clic droit sur la table > **Marquer en tant que table de dates** | [Définir et utiliser des tables de dates](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-date-tables) | Libellé exact (« comme » ou « en tant que ») **à contrôler à l'écran**. |
| Date/heure automatique | Fichier > Options et paramètres > Options > Fichier actuel > Chargement des données, case « Date/heure automatique » (section Time Intelligence) | [Date/heure automatique dans Power BI Desktop](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-auto-date-time) | Activée par défaut. Explique la hiérarchie Année/Trimestre/Mois/Jour qui surprend tout le monde. |
| Séparateurs DAX | Par défaut, virgule entre arguments et point décimal, même en interface française. Option Fichier > Options et paramètres > Options > Global > Paramètres régionaux > « Utiliser des séparateurs DAX localisés » | [Principes fondamentaux de DAX](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-quickstart-learn-dax-basics), [Mesures rapides](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-quick-measures) | Important pour un public Excel FR habitué au « ; ». Le cours garde la virgule. Si un poste a coché l'option, les formules du support ne passent pas : point de vigilance dans le déroulé. |

## Relations

| Point | Ce que dit la source | Source |
|---|---|---|
| Direction du filtrage croisé | Deux valeurs pour une relation un-à-plusieurs : sens unique ou « Les deux ». La doc française traduit « Single » par « Célibataire » (traduction automatique). | [Relations de modèle dans Power BI Desktop](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-relationships-understand), [Filtrage croisé bidirectionnel](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-bidirectional-filtering) |
| Libellé à l'écran | Le menu déroulant de la boîte « Modifier la relation » affiche probablement « Unique ». **À contrôler à l'écran.** Anecdote utilisable en salle si la doc dit « Célibataire ». | idem |
| Types différents entre les deux colonnes | Microsoft recommande que les deux colonnes aient le même type. Une relation texte / nombre entier peut se créer, mais le filtre ne trouve aucune correspondance et ne se propage pas. Les messages « impossible de créer » viennent le plus souvent de valeurs non uniques côté « un » (doublons, espaces, casse, vides). | [Relationship troubleshooting guidance](https://learn.microsoft.com/en-us/power-bi/guidance/relationships-troubleshoot), [Q&A Microsoft : types et relations](https://learn.microsoft.com/en-us/answers/questions/2139853/understanding-data-type-relationships-in-power-bi), [fil communautaire](https://community.fabric.microsoft.com/t5/Desktop/You-can-t-create-a-relationship-between-these-two-columns/td-p/1285013) |

Ce point change le scénario d'erreur du module Modèle : on ne raconte pas « la relation refuse de se créer à cause du type ». On raconte deux erreurs réelles et distinctes : (1) message « plusieurs-à-plusieurs » parce que la table Magasins contient un doublon (« MAG-07 » et « MAG-07 » avec espace) ; (2) relation créée mais visuels vides ou totaux identiques sur chaque ligne, parce que l'ID magasin est en texte d'un côté et en nombre de l'autre, ou parce qu'un ID n'existe pas dans la table Magasins (ligne « (Vide) » dans le visuel).

## Power Query

| Transformation | Libellé et emplacement | Source | Statut |
|---|---|---|---|
| En-têtes | Accueil > Utiliser la première ligne pour les en-têtes | [Promouvoir ou rétrograder des en-têtes](https://support.microsoft.com/fr-fr/office/promouvoir-une-ligne-comme-en-t%C3%AAtes-de-colonne-power-query-ade7374b-2f1e-4bfb-b43d-23daa51889cf), [Configurer votre ligne d'en-tête](https://support.microsoft.com/fr-fr/office/configurer-votre-ligne-d-en-t%C3%AAte-a0945ce6-0b35-45e2-bda1-e9f0d9806404) | « pour les » ou « comme » : **à contrôler à l'écran**. |
| Détection auto des types | Power Query déduit les types sur les 200 premières lignes et ajoute « En-têtes promus » puis « Type modifié » | [Ajouter ou modifier des types de données](https://support.microsoft.com/fr-fr/excel/add-or-change-data-types-power-query) | Confirmé. Explique pourquoi une erreur en ligne 4 500 passe inaperçue. |
| Dates JJ/MM/AAAA | Clic sur l'icône de type > **Utilisation des paramètres régionaux…** > Type Date, Paramètres régionaux Français (Maroc) ou Français (France) | idem | Confirmé. |
| Espaces en fin de cellule | Transformer > Format > **Supprimer les espaces** (fonction M `Text.Trim`) | [Text.Trim](https://learn.microsoft.com/fr-fr/powerquery-m/text-trim) | Fonction confirmée, libellé du menu **à contrôler à l'écran**. |
| Casse « casa / CASABLANCA » | Transformer > Format > **Majuscule à chaque mot** | (pas de page trouvée) | **À contrôler à l'écran.** |
| Colonne « Ville - Région » | Accueil ou Transformer > **Fractionner la colonne** > Par délimiteur. La colonne doit être en texte. | [Fractionner les colonnes par délimiteur](https://learn.microsoft.com/fr-fr/power-query/split-columns-delimiter) | Confirmé. |
| Ligne de total en bas | Accueil > Réduire les lignes > Supprimer les lignes > **Supprimer les lignes inférieures** | [Filtrer une table par position de ligne](https://learn.microsoft.com/fr-fr/power-query/filter-row-position) | Confirmé. Le support propose aussi la méthode plus robuste : filtrer la colonne Date sur « non vide ». |
| Doublons | Accueil > Réduire les lignes > Supprimer les lignes > **Supprimer les doublons**. Power Query est sensible à la casse ; on n'a pas de garantie sur l'occurrence conservée. | [Utilisation de valeurs en double](https://learn.microsoft.com/fr-fr/power-query/working-with-duplicates) | Confirmé. D'où l'ordre : nettoyer la casse et les espaces **avant** de dédoublonner. |
| Remplacer « casa » par « Casablanca » | Accueil > Transformer > **Remplacer les valeurs**, option Avancé > « Mettre en correspondance tout le contenu de la cellule » | [Remplacer les valeurs et les erreurs](https://learn.microsoft.com/fr-fr/power-query/replace-values) | Confirmé. Sans cette case, « Casablanca » devient « Casablancablanca ». |
| Volet des étapes et sortie | Volet **Étapes appliquées** ; Accueil > **Fermer et appliquer** | [Vue d'ensemble des requêtes](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-query-overview) | Usage courant, **à contrôler à l'écran** sur la version installée. |

## Les 7 formules DAX du cours

Noms de fonctions DAX en anglais quelle que soit la langue de l'interface. Séparateur : virgule.

| # | Formule | Vérification | Source |
|---|---|---|---|
| 1 | Colonne calculée `Montant = Ventes[Quantité] * Ventes[Prix unitaire]` | Opérateur `*` ligne par ligne dans une colonne calculée. | [Principes fondamentaux de DAX](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-quickstart-learn-dax-basics) |
| 2 | `CA = SUM(Ventes[Montant])` | `SUM(<colonne>)` | idem |
| 3 | `Nb tickets = DISTINCTCOUNT(Ventes[N° ticket])` | Compte les valeurs distinctes ; **compte BLANK comme une valeur** (sinon DISTINCTCOUNTNOBLANK). | [DISTINCTCOUNT](https://learn.microsoft.com/en-us/dax/distinctcount-function-dax), [DISTINCTCOUNTNOBLANK](https://learn.microsoft.com/en-us/dax/distinctcountnoblank-function-dax) |
| 4 | `Panier moyen = DIVIDE([CA], [Nb tickets])` | `DIVIDE(<numérateur>, <dénominateur> [, <résultat_alternatif>])`, renvoie BLANK si dénominateur nul ou vide. | [DIVIDE](https://learn.microsoft.com/en-us/dax/divide-function-dax), [DIVIDE vs /](https://learn.microsoft.com/en-us/dax/best-practices/dax-divide-function-operator) |
| 5 | `CA Casablanca = CALCULATE([CA], Magasins[Ville] = "Casablanca")` | Filtre booléen autorisé : une seule table, pas de mesure dans le filtre. | [CALCULATE](https://learn.microsoft.com/en-us/dax/calculate-function-dax) |
| 6 | `CA N-1 = CALCULATE([CA], SAMEPERIODLASTYEAR(Calendrier[Date]))` | `SAMEPERIODLASTYEAR(<dates>)`, équivalent à `DATEADD(dates, -1, year)`. Exige une table de dates contiguë, marquée comme table de dates. | [SAMEPERIODLASTYEAR](https://learn.microsoft.com/en-us/dax/sameperiodlastyear-function-dax), [Tables de dates](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-date-tables), [Calculs basés sur le temps](https://learn.microsoft.com/fr-fr/power-bi/transform-model/desktop-time-intelligence) |
| 7 | `Évolution vs N-1 = DIVIDE([CA] - [CA N-1], [CA N-1])` | Format % appliqué via Outils de mesure. | [DIVIDE](https://learn.microsoft.com/en-us/dax/divide-function-dax) |

Ces 7 formules seront retestées sur le dataset final avec un calcul de contrôle en Python (mêmes totaux attendus) ; les valeurs attendues figureront dans le corrigé formateur.

## Recherches complémentaires (non Microsoft, pour le contexte)

- [Elephorm, Installer et débuter avec Power BI Desktop](https://www.elephorm.com/formation/maitriser-les-fondamentaux-de-power-bi/installer-et-debuter-avec-power-bi-desktop-guide-complet-pour-debutant) : confirme l'usage courant de « Vue Table » / « Vue des données » chez les formateurs francophones.
- [Éditions ENI, Power BI Desktop l'intégrale, table des matières](https://www.editions-eni.fr/livre/power-bi-desktop-l-integrale-2e-edition-des-fondamentaux-aux-utilisations-avancees-9782409053313/table-des-matieres.pdf)
