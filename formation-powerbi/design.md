# Direction visuelle

Aperçu rendu : `apercu_design.jpg` (6 slides construites avec les vrais gabarits, emplacements de capture vides).

## L'idée

Un support de stage tel qu'un organisme de formation l'imprimerait et le projetterait : du blanc, une typographie de livre pour les titres, et une seule couleur forte réservée aux moments où les participants travaillent. La personnalité vient de deux choses seulement :

1. **Les slides « À vous » en pleine couleur pétrole.** Elles marquent la moitié de la journée passée en manipulation. On les reconnaît du fond de la salle, et le formateur aussi : quand l'écran devient vert, on ne parle plus.
2. **Un langage d'annotation unique sur les captures** : cadres et flèches rouges, pastilles rouges numérotées pour les vraies étapes de clic. C'est la convention des manuels de logiciel, appliquée avec rigueur, sans aucun autre ornement.

Tout le reste est calme : pas d'icônes, pas de cartes, pas de dégradés, pas de sur-titre, pas de numérotation décorative, pas de filet sous les titres.

## Couleurs

| Nom | Hex | Rôle | Contraste |
|---|---|---|---|
| Papier | `#FFFFFF` | Fond des slides de contenu. Le blanc fond les captures de Power BI (interface claire) dans la slide. | |
| Encre | `#222222` | Titres et texte courant | 15,9:1 sur papier |
| Gris | `#5E5E5E` | Texte secondaire, pied de page, numéros | 6,5:1 sur papier |
| Pétrole | `#0B4F4A` | Fond des slides « À vous » et de la couverture ; ce qui est juste ou corrigé (volet « après », flux de filtre qui passe) | 9,4:1 avec le blanc |
| Pétrole pâle | `#C9DEDA` | Texte secondaire sur fond pétrole | 6,7:1 sur pétrole |
| Rouge annotation | `#C8261D` | Cadres, flèches, pastilles d'étape sur les captures ; ce qui est faux (volet « avant », erreurs) | 5,6:1 sur papier |
| Fond de capture | `#F1F1EE` | Emplacements de capture, panneau de code DAX | |
| Filet | `#D6D6D2` | Bordures de tableau | |

Pourquoi ces deux couleurs : le rouge est la couleur que l'œil attend sur une capture annotée, et il se distingue de la palette par défaut des visuels Power BI (bleu `#118DFF`, bleu foncé, orange, violet), donc une annotation ne se confond jamais avec un élément du rapport. Le pétrole est sombre et froid pour ne pas concurrencer le rouge ; il ne rappelle ni le jaune de Power BI ni le duo bleu marine et ambre de la version rejetée.

Code couleur constant : **rouge = ce qui ne va pas ou ce qu'il faut regarder, pétrole = ce qui est corrigé ou ce que vous faites.**

## Typographie

| Usage | Police | Taille |
|---|---|---|
| Titres-phrases | Source Serif 4 SemiBold | 30 pt (2 lignes maximum) |
| Énoncés et questions à la salle | Source Serif 4 SemiBold | 48 pt |
| Couverture | Source Serif 4 SemiBold | 44 pt |
| Texte courant, consignes de TP | Source Sans 3 | 20 pt (jamais moins) |
| Annotations sur capture | Source Sans 3 | 16 à 18 pt |
| Formules DAX | Source Code Pro | 24 à 28 pt |
| Pied de page « Réalisé par Hani Sahir », numéro | Source Sans 3 | 11 pt, gris |

Un serif de lecture (pas un serif d'affiche) pour que les titres longs se lisent comme des phrases ; un sans-serif humaniste très lisible pour tout ce qui se lit en manipulant. Titres alignés à gauche, en minuscules, sans point final. Typographie française : espaces insécables avant « : ; ? ! » et à l'intérieur des guillemets, appliquées automatiquement par le script de production.

**À faire sur votre PC avant d'ouvrir le .pptx** : installer les 12 fichiers de `01_presentation/polices/` (clic droit > Installer pour tous les utilisateurs). Les trois familles sont sous licence libre SIL OFL. Si le PC de la salle n'est pas le vôtre, enregistrez le .pptx avec Fichier > Options > Enregistrement > « Incorporer les polices dans le fichier ». Sans ces polices, PowerPoint remplace et les titres peuvent passer sur trois lignes.

## Grille

Format 16:9 (33,87 x 19,05 cm). Marges latérales 1,65 cm, titre ancré à 1,27 cm du haut, zone de contenu de 4,4 cm à 17,1 cm, pied de page à 17,8 cm. Le contenu s'aligne à gauche sur la marge ; les compositions sont volontairement asymétriques (capture large + colonne étroite d'annotations, consigne + colonne « décroché ? »).

## Les 5 gabarits

```
1. CAPTURE                        2. AVANT / APRÈS
┌──────────────────────────────┐  ┌──────────────────────────────┐
│ Titre-phrase sur 2 lignes    │  │ Titre-phrase                 │
│ ┌────────────────────┐  note │  │ ce qui s'affiche  après corr.│
│ │ capture       ▭    │ ←──── │  │ ┌───────────┐ ┌───────────┐  │
│ │  ①   ▭             │       │  │ │ capture   │ │ capture   │  │
│ └────────────────────┘       │  │ └───────────┘ └───────────┘  │
│ Réalisé par Hani Sahir    13 │  │ Le piège : une phrase        │
└──────────────────────────────┘  └──────────────────────────────┘
 variante « pas à pas » : capture à gauche, 3 à 5 étapes numérotées à droite

3. ÉNONCÉ                         4. MÉCANISME
┌──────────────────────────────┐  ┌──────────────────────────────┐
│                              │  │ Titre-phrase                 │
│ Une question ou une          │  │ [Produits]──▶[Ventes]--✕-▶[Ma│
│ affirmation en très grand,   │  │   schéma dessiné, 3 couleurs │
│ en bas à gauche              │  │ Conséquence en une phrase    │
│                              │  │                              │
└──────────────────────────────┘  └──────────────────────────────┘
 sert aussi aux questions à la salle   sert au schéma en étoile, à la propagation,
 (quasi vide) et à la couverture       à colonne/mesure, aux formules DAX, au graphique N-1

5. À VOUS (fond pétrole)
┌──────────────────────────────┐
│ Consigne-phrase              │
│ 23 minutes, jusqu'à 10h50    │
│ ① étape            Décroché ?│
│ ② étape            R1.pbix   │
│ ③ étape                      │
│ Résultat attendu  Bonus tech.│
└──────────────────────────────┘
```

Règle d'enchaînement : jamais trois slides consécutives sur le même gabarit (vérifié dans `plan.md`).

## Emplacements de capture

Chaque capture à faire est un rectangle gris clair à bord pointillé, avec en bas à gauche « Capture Cxx » et une ligne qui dit quoi montrer. Les annotations rouges sont **déjà posées** au bon endroit approximatif, sous forme de formes PowerPoint modifiables : vous collez la capture, vous l'envoyez à l'arrière-plan (clic droit > Mettre à l'arrière-plan), vous recalez les cadres de quelques millimètres, vous supprimez le rectangle gris. Le détail de chaque prise de vue est dans `05_captures/liste_captures.md`.

## Graphiques

Le seul graphique de données (slide N-1 et Ramadan) est un graphique PowerPoint natif, calculé sur le dataset : CA 2026 en pétrole, année précédente en gris. Une légende sous le graphique (deux séries), et les écarts de février et mars écrits directement au-dessus des barres.

Contrôle de la palette du graphique (validateur du skill dataviz, octobre 2026) : séparation daltonisme ΔE 22,9 et vision normale ΔE 25,9, contraste des barres grises 3,4:1 sur blanc. Le validateur signale le gris comme « trop neutre » et le pétrole comme « trop foncé » pour une palette catégorielle : c'est voulu ici, l'année de référence doit s'effacer derrière l'année en cours. Le gris retenu est `#8C8C87` (le premier choix `#A3A39E` n'atteignait que 2,5:1).

## Documents Word

Le guide participant et le déroulé formateur reprennent les mêmes polices et les deux couleurs : titres en Source Serif 4, texte en Source Sans 3 11 pt, encadrés de TP sur fond `#F1F1EE`, captures annotées en rouge. Format A4, marges 2 cm, pied de page « Réalisé par Hani Sahir ».

## Contrôle de ce que la version rejetée faisait

| Défaut de la version rejetée | Ici |
|---|---|
| Grilles de 3 ou 4 cartes identiques | Aucune carte. Les seules répétitions sont les étapes de TP, qui sont de vraies séquences. |
| Icône au-dessus de chaque carte | Aucune icône dans tout le deck. |
| « 01 02 03 » décoratifs | Les numéros n'existent que pour des étapes de clic. |
| Sur-titre en majuscules espacées | Aucun. Le titre-phrase porte seul l'information. |
| Symétrie parfaite, même gabarit partout | 5 gabarits, compositions asymétriques, enchaînement contrôlé. |
| Bleu marine + ambre | Pétrole + rouge sur blanc. |
| Encadrés « Règle d'or » | Aucun encadré moralisateur ; les pièges sont racontés dans le titre ou en une phrase. |
| Aucune capture | Un emplacement de capture annoté sur plus de la moitié des slides, le décompte exact sera dans la liste de captures. |
