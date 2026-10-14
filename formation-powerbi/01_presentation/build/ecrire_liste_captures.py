"""Écrit 05_captures/liste_captures.md à partir de captures.json (produit par construire_presentation.js)."""
import json
from pathlib import Path

ICI = Path(__file__).resolve().parent
captures = {c["id"]: c for c in json.loads((ICI / "captures.json").read_text(encoding="utf-8"))}

SEANCES = [
    ("Hors de Power BI", "5 min", "Explorateur Windows et Excel, avant d'ouvrir Power BI.", ["C03", "C07a", "C07b", "C07c"]),
    ("Rapport vierge et import", "5 min", "Power BI Desktop, Fichier > Nouveau. Gardez un fichier jetable pour C10a.", ["C08", "C09", "C10a", "C10b"]),
    ("Power Query", "8 min", "R1_import.pbix puis R2_nettoye.pbix. Pour C14a, une copie jetable de R1.", ["C13", "C14a", "C14b", "C15", "C18", "C19a", "C19b"]),
    ("Modèle", "5 min", "R2_nettoye.pbix (aucune relation), une copie jetable pour C26a, puis R3_modele.pbix.", ["C23", "C26a", "C25a", "C25b", "C26b", "C27"]),
    ("Mesures et rapport", "7 min", "R4_mesures.pbix (une copie jetable pour C32a), puis R5_rapport.pbix. Gardez C22b pour la fin : elle demande de remplacer le fichier source.", ["C32a", "C32b", "C34", "C37a", "C37b", "C38", "C04", "C22a", "C22b"]),
]

vus = [i for _, _, _, ids in SEANCES for i in ids]
assert sorted(vus) == sorted(captures), f"Écart entre la liste et le deck : {set(captures) ^ set(vus)}"

L = []
L.append("# Liste des captures d'écran")
L.append("")
L.append(f"{len(captures)} captures, en 5 séances regroupées par état du fichier, environ 30 minutes au total. "
         "Le numéro de slide indique où la capture va dans `01_presentation/Initiation_Power_BI.pptx`.")
L.append("")
L.append("## Avant de commencer")
L.append("")
L.append("- Écran en 1920 x 1080, mise à l'échelle Windows à 100 % (Paramètres > Système > Écran). À 125 %, les captures restent lisibles mais le recadrage change.")
L.append("- Power BI Desktop en français, la même version que celle des participants, fenêtre maximisée.")
L.append("- Dossier `C:\\Formation_PBI\\` en place, avec les fichiers de `03_donnees/participants/` et les .pbix de rattrapage déjà créés (procédure dans le déroulé formateur).")
L.append("- Outil : Win + Maj + S, mode Rectangle. Enregistrez chaque capture en PNG sous son identifiant (`C07a.png`) dans `05_captures/`.")
L.append("- Les annotations rouges sont déjà posées dans le .pptx. Vous n'annotez rien vous-même.")
L.append("")
L.append("## Insérer une capture dans la slide")
L.append("")
L.append("1. Sur la slide, cliquez sur le rectangle gris pointillé « Capture Cxx » et notez sa taille (Format de la forme > Taille).")
L.append("2. Insertion > Images > Cet appareil, choisissez `Cxx.png`.")
L.append("3. Donnez-lui la même largeur que le rectangle, alignez-la sur son coin haut gauche. Si la hauteur dépasse, rognez (Format de l'image > Rogner) plutôt que de déformer.")
L.append("4. Clic droit sur l'image > Mettre en arrière-plan, puis Avancer d'un plan jusqu'à passer devant le rectangle gris : les cadres et flèches rouges restent au-dessus.")
L.append("5. Supprimez le rectangle gris et sa légende « Capture Cxx ».")
L.append("6. Recalez les cadres rouges de quelques millimètres sur les vrais éléments de l'interface.")
L.append("7. Clic droit sur l'image > Afficher le texte de remplacement : collez la ligne « Ce qu'on doit voir » de la capture. Les participants qui suivent le support avec un lecteur d'écran en ont besoin.")
L.append("")

controles = []
for titre, duree, prep, ids in SEANCES:
    L.append(f"## Séance : {titre} ({duree})")
    L.append("")
    L.append(f"*{prep}*")
    L.append("")
    for i in ids:
        c = captures[i]
        L.append(f"### {i} : slide {c['slide']}")
        L.append("")
        L.append(f"- **Ce qu'on doit voir** : {c['quoi']}")
        L.append(f"- **État du fichier** : {c['etat']}")
        L.append(f"- **Clics** : {c['action']}")
        L.append(f"- **Recadrage** : {c['recadrage']}")
        L.append(f"- **Annotations déjà posées** : {c['annotations']}")
        if c.get("preparation"):
            L.append("- **Préparation (PowerShell, une seule ligne)** :")
            L.append("")
            L.append("  ```powershell")
            L.append("  " + c["preparation"])
            L.append("  ```")
        if c.get("controle"):
            L.append(f"- **Contrôle libellé** : {c['controle']}")
            controles.append((i, c["slide"], c["controle"]))
        L.append("")

L.append("## Libellés à contrôler pendant la séance")
L.append("")
L.append("La documentation Microsoft n'a pas pu être ouverte en entier depuis l'environnement de production (voir `sources.md`). "
         "Ces libellés viennent de la documentation française et doivent être comparés à votre écran. "
         "S'il y a un écart, notez le libellé exact : la correction se fait dans `01_presentation/build/construire_presentation.js` puis on reconstruit.")
L.append("")
L.append("| Capture | Slide | À vérifier | Libellé réel |")
L.append("|---|---|---|---|")
for i, sl, txt in controles:
    L.append(f"| {i} | {sl} | {txt} | |")
for txt, sl in [
    ("Onglet Outils de colonne > Trier par colonne", "37"),
    ("Clic droit sur une table > « Marquer comme table de dates » (ou « Marquer en tant que table de dates »)", "29"),
    ("Transformer > Format > « Supprimer les espaces » et « Majuscule à chaque mot »", "19, 21"),
    ("Accueil > « Utiliser la première ligne pour les en-têtes »", "16"),
    ("Accueil > Supprimer les lignes > « Supprimer les lignes du haut »", "16"),
    ("Fichier > Options > Fichier actuel > Chargement des données : noms des deux cases de la rubrique Relations, et de la case Date/heure automatique", "11, 29"),
    ("Agrégation « Plus récent » sur un champ date dans une carte", "38 (notes)"),
]:
    L.append(f"| sans capture | {sl} | {txt} | |")
L.append("")

out = ICI.parent.parent / "05_captures" / "liste_captures.md"
out.write_text("\n".join(L), encoding="utf-8")
print(out, len(captures), "captures,", len(controles), "contrôles liés")
