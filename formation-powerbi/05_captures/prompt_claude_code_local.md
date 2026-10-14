# Faire les captures avec Claude Code sur le PC qui a Power BI

## Les étapes

1. **Préparer le PC Windows**
   - Power BI Desktop installé, interface en français.
   - Python 3 avec `pip install python-pptx pillow`, et Git.
   - Écran en 1920 x 1080, mise à l'échelle Windows à 100 %.
   - Fermez les applications qui ne servent pas (notifications, messageries) : elles apparaîtraient dans les captures.
2. **Récupérer le dépôt**, dans PowerShell :
   ```powershell
   git clone https://github.com/Hani2308/Pres_powerbi.git C:\Projets\Pres_powerbi
   cd C:\Projets\Pres_powerbi
   git checkout claude/festive-keller-6c9guo
   ```
3. **Ouvrir l'application Claude Desktop**, activer **Settings > This computer > Computer use**, puis ouvrir l'onglet **Code** sur le dossier `C:\Projets\Pres_powerbi`.
4. **Coller le prompt ci-dessous** et l'envoyer.
5. **Valider les demandes d'accès** quand elles s'affichent : Power BI Desktop, Excel, l'Explorateur de fichiers, PowerPoint.
6. **Ne plus toucher la souris ni le clavier** pendant les prises de vue. Comptez une à deux heures : Claude doit d'abord fabriquer les cinq fichiers .pbix de rattrapage en cliquant dans Power BI.
7. **Ouvrir le résultat**, `01_presentation/Initiation_Power_BI_complete.pptx`, faire défiler les 40 slides, puis valider la PR sur GitHub.

## Le prompt

```text
Tu travailles dans le dépôt C:\Projets\Pres_powerbi, branche claude/festive-keller-6c9guo. C'est une formation d'initiation à Power BI (dossier formation-powerbi/). La présentation 01_presentation/Initiation_Power_BI.pptx contient 30 emplacements de capture d'écran. Ta mission : faire ces 30 captures dans Power BI Desktop, Excel et l'Explorateur Windows sur cette machine, les insérer avec le script fourni, corriger les libellés qui diffèrent de l'écran, puis committer et pousser. Tu as l'autorisation d'utiliser Computer use sur Power BI Desktop, Excel, l'Explorateur de fichiers et PowerPoint. Si aucun outil Computer use n'est disponible dans cette session, arrête-toi tout de suite et dis-le-moi, ne contourne pas.

Lis d'abord, en entier :
- formation-powerbi/05_captures/liste_captures.md : les 30 prises de vue, groupées en 5 séances, avec pour chacune l'état du fichier, les clics, le recadrage, et les libellés à contrôler ;
- formation-powerbi/04_formateur/Deroule_formateur.docx, chapitre « Fabriquer les fichiers de rattrapage » (lis-le avec python-docx) : la procédure clic par clic des fichiers R1 à R5 et des fichiers jetables.

Étape 1, les données. Crée C:\Formation_PBI\ et C:\Formation_PBI\rattrapage\. Copie-y formation-powerbi/03_donnees/participants/Ventes_Retail.xlsx et Ventes_Retail_MAJ.xlsx (les versions SANS la feuille de corrigé : le Navigateur de Power BI ne doit pas la montrer).

Étape 2, les fichiers de rattrapage. Dans Power BI Desktop, fabrique R1_import.pbix à R5_rapport.pbix dans C:\Formation_PBI\rattrapage\, en suivant exactement la procédure du déroulé. À la fin de chaque fichier, vérifie les valeurs de contrôle : 5 159 lignes dans Ventes, 12 dans Magasins, CA 392 688 MAD, 3 076 tickets, panier moyen 127,66 MAD, évolution de mars 2026 à -25,9 %. Si un chiffre diffère, cherche l'étape fautive avant de continuer. Copie aussi les cinq .pbix dans formation-powerbi/06_rattrapage/ du dépôt.

Étape 3, les captures. Fais les 30 prises de vue dans l'ordre des séances de liste_captures.md. Pour chacune :
- mets Power BI (ou Excel, ou l'Explorateur) exactement dans l'état décrit, fenêtre maximisée ;
- prends la capture et recadre-la comme indiqué (Pillow) ;
- enregistre-la en PNG sous formation-powerbi/05_captures/<identifiant>.png (par exemple C07a.png) ;
- regarde-la avant de passer à la suivante : bonne zone, texte lisible, pas de fenêtre parasite, pas d'information personnelle (nom de compte, autres fichiers).
Pour C03, crée d'abord le dossier « Reporting ventes » avec la commande PowerShell donnée dans la liste. Pour C22b, remplace Ventes_Retail.xlsx par le contenu de Ventes_Retail_MAJ.xlsx, actualise, prends la capture, puis REMETS le fichier d'origine et actualise à nouveau.

Étape 4, les libellés. Chaque fois que la liste dit « Contrôle libellé », note le libellé exact affiché à l'écran, et remplis la colonne « Libellé réel » du tableau en fin de liste_captures.md. Si un libellé diffère de celui utilisé dans la présentation, corrige-le dans formation-powerbi/01_presentation/build/construire_presentation.js (dans le texte des slides ET dans les notes), puis reconstruis : dans ce dossier, `npm install` puis `node construire_presentation.js` (avec la variable NODE_PATH=./node_modules). Fais la même correction dans formation-powerbi/outils_docs/guide_participant.js et deroule_formateur.js, puis dans outils_docs : `npm install`, `node guide_participant.js`, `node deroule_formateur.js`. Ne change rien d'autre au contenu.

Étape 5, l'insertion. Dans formation-powerbi/01_presentation/build/, lance :
python inserer_captures.py --nom "SAHIR Hani"
Le script crée 01_presentation/Initiation_Power_BI_complete.pptx : chaque image remplace son emplacement gris, sous les annotations rouges, avec un texte de remplacement. Il échoue en listant les captures manquantes s'il en manque une. Ouvre ensuite le fichier dans PowerPoint et parcours les 40 slides. Les cadres et flèches rouges sont posés à des positions approximatives : déplace ceux qui ne tombent pas sur le bon élément de l'interface, sans en changer la couleur ni l'épaisseur. Enregistre.

Étape 6, la livraison. Commite les PNG, les .pbix, la présentation complète, les éventuelles corrections de libellés et liste_captures.md complétée, avec des messages de commit en français. Pousse sur claude/festive-keller-6c9guo (la PR Hani2308/Pres_powerbi#1 se mettra à jour). Termine par un compte rendu : captures faites, libellés corrigés (ancien et nouveau), annotations déplacées, et tout ce que tu n'as pas pu faire, avec la raison.

Règles : n'invente aucune capture. Ne fabrique pas d'image qui imite l'interface : si un écran est impossible à obtenir, laisse son emplacement et dis-le. Ne modifie pas les données de 03_donnees/. Ne pousse sur aucune autre branche.
```
