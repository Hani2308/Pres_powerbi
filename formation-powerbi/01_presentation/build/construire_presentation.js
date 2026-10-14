// Construit 01_presentation/Initiation_Power_BI.pptx et 05_captures/liste_captures.md.
// Usage : NODE_PATH=./node_modules node construire_presentation.js
const fs = require("fs");
const path = require("path");
const { applyTheme } = require("/root/.claude/skills/synced/813eabaf-c939-4e73-b1cb-56563348a11c_86566cfd-1f0a-4838-8f8e-00fc3c4cb503/pptx/scripts/apply_theme.js");
const { fr, COULEURS: K, THEME, POLICES: P, G, creerPresentation, emplacementCapture, cadre, etape, fleche, note } = require("./gabarits");

const D = JSON.parse(fs.readFileSync(path.join(__dirname, "donnees_slides.json"), "utf8"));
const V = JSON.parse(fs.readFileSync(path.join(__dirname, "../../03_donnees/valeurs_attendues.json"), "utf8"));
const nf = (x, dec = 0) => x.toLocaleString("fr-FR", { minimumFractionDigits: dec, maximumFractionDigits: dec }).replace(/\u202F/g, "\u00A0").replace(/^-/, "\u2212");
const pct = (x) => (x > 0 ? "+" : "") + nf(x * 100, 0) + "\u00A0%";

const pres = creerPresentation();
const CAPTURES = [];
let numero = 0;

// ---------- aides ----------
function nouvelle(gabarit, titreTexte, opts = {}) {
  numero += 1;
  const s = pres.addSlide({ masterName: gabarit });
  if (titreTexte) {
    const t = fr(titreTexte);
    const base = gabarit === "Enonce" ? (opts.taille || 48) : 30;
    const largeur = gabarit === "Enonce" ? 10.6 : 11.2;
    const parLigne = (largeur * 72) / (base * 0.5);
    const taille = gabarit !== "Enonce" && t.length / parLigne > 2 ? 26 : base;
    s.addText(t, { placeholder: "title", fontSize: taille });
  }
  s._numero = numero;
  return s;
}

function lignesEstimees(t, w, pt) {
  const parLigne = Math.floor((w * 72) / (pt * 0.5));
  return String(t).split("\n").reduce((n, l) => {
    let lignes = 1, courant = 0;
    for (const mot of l.split(" ")) {
      const m = mot.length;
      if (courant === 0) courant = m;
      else if (courant + 1 + m <= parLigne) courant += 1 + m;
      else { lignes += 1; courant = m; }
      while (courant > parLigne) { lignes += 1; courant -= parLigne; }
    }
    return n + lignes;
  }, 0);
}

function texte(s, contenu, x, y, w, opts = {}) {
  const pt = opts.taille || 20;
  const runs = Array.isArray(contenu)
    ? contenu.map((r) => (typeof r === "string" ? { text: fr(r) } : { text: fr(r.text), options: { ...(r.gras ? { fontFace: P.texteGras } : {}), ...(r.couleur ? { color: r.couleur } : {}), ...(r.saut ? { breakLine: true } : {}) } }))
    : fr(contenu);
  const brut = Array.isArray(contenu) ? contenu.map((r) => (typeof r === "string" ? r : r.text)).join("") : contenu;
  const h = opts.h || lignesEstimees(brut, w, pt) * pt * 1.2 / 72 + 0.08;
  s.addText(runs, { x, y, w, h, fontFace: P.texte, fontSize: pt, color: opts.couleur || K.encre, margin: 0, valign: "top", isTextBox: true, align: "left", paraSpaceAfter: opts.espace || 0 });
  return y + h;
}

function legende(s, t, x, y, w, couleur) {
  s.addText(fr(t), { x, y, w, h: 0.4, fontFace: P.texteGras, fontSize: 18, color: couleur, margin: 0, valign: "bottom", isTextBox: true });
}

function capture(s, spec) {
  CAPTURES.push({ slide: s._numero, ...spec });
  emplacementCapture(s, { id: spec.id, x: spec.x, y: spec.y, w: spec.w, h: spec.h, quoi: fr(spec.quoi) });
}

function code(s, lignes, x, y, w, h, pt = 24) {
  s.addText(lignes.join("\n"), { x, y, w, h, fill: { color: K.fondCapture }, fontFace: P.code, fontSize: pt, color: K.encre, margin: [14, 14, 10, 14], valign: "middle", isTextBox: true, objectName: "Code DAX" });
}

function notes(s, t) { s.addNotes(t.trim().replace(/\n {2,}/g, "\n")); }

function aVous(s, { duree, etapes, attendu, rattrapage, bonus }) {
  s.addText(fr(duree), { x: G.L, y: 1.6, w: 7.5, h: 0.5, fontFace: P.titre, fontSize: 24, color: K.papier, margin: 0, isTextBox: true });
  let y = 2.4;
  const pt = etapes.length > 4 ? 19 : 20;
  etapes.forEach((t, i) => {
    etape(s, i + 1, G.L, y + 0.02, K.papier);
    const fin = texte(s, t, G.L + 0.68, y, 7.35, { taille: pt, couleur: K.papier });
    y = Math.max(fin, y + 0.5) + 0.14;
  });
  if (y > 6.85) console.warn(`Slide ${s._numero} : consignes trop longues (y=${y.toFixed(2)})`);
  let yd = 2.4;
  const bloc = (titre, corps) => {
    if (!corps) return;
    yd = texte(s, [{ text: titre, gras: true, saut: true }, corps], 9.05, yd, 3.65, { taille: 18, couleur: K.surPetrole }) + 0.22;
  };
  bloc("Résultat attendu", attendu);
  bloc("Vous avez décroché ?", rattrapage);
  bloc("Pour les profils techniques", bonus);
  if (yd > 6.95) console.warn(`Slide ${s._numero} : colonne de droite trop longue (y=${yd.toFixed(2)})`);
}

function avantApres(s, { gauche, droite, bas, y0 = 2.15, h = 3.35 }) {
  const w = 5.75;
  legende(s, gauche.legende, G.L, y0 - 0.45, w, K.rouge);
  capture(s, { ...gauche.capture, x: G.L, y: y0, w, h });
  legende(s, droite.legende, G.L + w + 0.5, y0 - 0.45, w, K.petrole);
  capture(s, { ...droite.capture, x: G.L + w + 0.5, y: y0, w, h });
  if (bas) texte(s, bas, G.L, y0 + h + 0.3, 11.6);
}

function pasAPas(s, { capture: spec, etapes, xEtapes = 8.55, y0 = 1.95 }) {
  capture(s, { ...spec, x: G.L, y: y0, w: 7.6, h: 4.75 });
  let y = y0;
  etapes.forEach((t, i) => {
    etape(s, i + 1, xEtapes, y + 0.02);
    y = Math.max(texte(s, t, xEtapes + 0.62, y, 12.68 - xEtapes - 0.62, { taille: 18 }), y + 0.5) + 0.16;
  });
  if (y > 6.85) console.warn(`Slide ${s._numero} : étapes trop longues`);
}

// ================= SLIDES =================

// 1
let s = nouvelle("Couverture", "Initiation à Power BI : du fichier du lundi au rapport qui se met à jour seul");
s.addText(fr("Une journée, de 9h00 à 16h30\nHani Sahir, data scientist"), { placeholder: "body" });
notes(s, `
Avant que les gens arrivent (8h30) : vidéoprojecteur branché, Power BI ouvert sur R5_rapport.pbix en arrière-plan, le fichier Ventes_Retail.xlsx d'origine bien en place dans C:\\Formation_PBI\\. Le fichier MAJ est à côté, prêt pour la démo.

Quand tout le monde est assis :
« Bonjour à tous, je suis Hani Sahir, je suis data scientist. Aujourd'hui on va faire une seule chose, mais on va la faire jusqu'au bout : prendre un export Excel comme vous en recevez tous, et en faire un rapport qui se met à jour tout seul. Pas de théorie pour la théorie. À 16h30, chacun repart avec son fichier. »

Logistique en trente secondes : horaires, pauses à 11h00 et 15h20, déjeuner à 12h30. Les téléphones, je ne fais pas la police, mais pendant les TP vous en aurez besoin de vos deux mains.
`);

// 2
s = nouvelle("Enonce", "Quel fichier refaites-vous à la main chaque semaine ?");
texte(s, "Une phrase chacun. Je note au tableau, on y revient à 16h20.", G.L, 5.25, 10, { couleur: K.gris });
notes(s, `
Tour de table, 10 minutes maximum. Chacun dit son prénom, son service, et LE fichier qu'il refait chaque semaine ou chaque mois.

J'écris les réponses au tableau (ou sur un paperboard, mieux : il reste visible toute la journée). Exemples de ce qu'on entend souvent : le suivi des ventes par agence, le tableau des absences, le reporting des stocks, le fichier des relances clients.

Si quelqu'un dit « moi je ne fais pas de reporting » : « Parfait, alors vous êtes celui qui le reçoit. Vous saurez ce qui se passe derrière. »

Pour les profils techniques, je leur demande en plus ce qu'ils utilisent aujourd'hui (SQL, Python, Excel avancé). Ça me permet de les orienter vers les bonus pendant les TP.

Transition : « Je vais vous montrer à quoi ressemble ce genre de fichier quand on l'ouvre côté disque dur. Vous allez reconnaître quelqu'un. »
`);

// 3
s = nouvelle("Contenu", "Le reporting du lundi finit toujours dans un dossier de versions « finales »");
capture(s, {
  id: "C03", x: G.L, y: 1.9, w: 7.3, h: 4.75, quoi: "Explorateur Windows, dossier « Reporting ventes » avec les versions empilées.",
  etat: "Aucun fichier Power BI. Dossier préparé avec le script PowerShell ci-dessous.",
  action: "Ouvrir le dossier dans l'Explorateur, affichage Détails, tri par Date de modification. Les 7 fichiers doivent tenir à l'écran.",
  recadrage: "La fenêtre de l'Explorateur sans le ruban : barre d'adresse + liste des fichiers avec les colonnes Nom et Modifié le.",
  annotations: "Un cadre rouge autour des trois derniers fichiers.",
  preparation: "New-Item -ItemType Directory -Force \"C:\\Formation_PBI\\Reporting ventes\" | Out-Null; cd \"C:\\Formation_PBI\\Reporting ventes\"; \"Reporting_ventes_S38.xlsx\",\"Reporting_ventes_S38_v2.xlsx\",\"Reporting_ventes_S38_final.xlsx\",\"Copie de Reporting_ventes_S38_final.xlsx\",\"Reporting_ventes_S38_final_v3.xlsx\",\"Reporting_ventes_S38_final_VRAI.xlsx\",\"Reporting_ventes_S38_final_VRAI (corrigé Samir).xlsx\" | % { New-Item $_ -ItemType File | Out-Null; Start-Sleep 1 }",
});
cadre(s, G.L + 0.3, 4.3, 6.7, 1.05);
let y = 1.95;
const circuit = [
  "Export de la caisse, reçu par mail à 7h42",
  "Copier-coller dans le classeur du mois",
  "Supprimer à la main la ligne TOTAL",
  "Actualiser le TCD, vérifier qu'il prend bien toutes les lignes",
  "Recopier les graphiques dans PowerPoint",
  "Envoyer à 11h, corriger à 15h",
];
circuit.forEach((t, i) => {
  y = texte(s, t, 8.45, y, 4.25, { taille: 18 });
  if (i < circuit.length - 1) { fleche(s, 8.6, y + 0.0, 8.6, y + 0.2, K.gris, { epaisseur: 1.5 }); y += 0.24; }
});
notes(s, `
Je laisse la slide trente secondes sans rien dire. En général, il y a des rires au moment où les gens lisent « corrigé Samir ». C'est le but.

« Qui a déjà eu un fichier qui s'appelle final_VRAI ? » Mains levées. « Moi aussi. »

Puis je déroule le circuit à droite : l'export arrive, on copie-colle, on enlève la ligne de total, on rafraîchit le tableau croisé, on recopie les graphiques, on envoie. Et à 15h quelqu'un répond « le chiffre de Rabat est faux ».

Le message à faire passer, sans le dire comme une leçon : chaque geste manuel est une occasion de se tromper, et on refait ces gestes chaque semaine. Power BI ne rend pas plus intelligent, il permet de ne faire ces gestes qu'une fois.

Transition : « Maintenant je vous montre le même reporting, construit une fois pour toutes. »
`);

// 4
s = nouvelle("Contenu", "Le même reporting, actualisé d'un clic à 8h02");
capture(s, {
  id: "C04", x: G.L, y: 1.85, w: 12.03, h: 4.85, quoi: "Rapport final Atlas Bazar, vue Rapport, volets refermés.",
  etat: "R5_rapport.pbix, source = Ventes_Retail.xlsx (au 30/09/2026).",
  action: "Vue Rapport, page « Ventes ». Refermer les volets Filtres, Visualisations et Données (chevrons) pour que la page occupe l'écran. Aucun segment sélectionné.",
  recadrage: "Le canevas du rapport seul, sans le ruban ni la barre des pages.",
  annotations: "Un cadre rouge sur la carte « Dernière vente ».",
});
cadre(s, 10.15, 2.05, 2.3, 1.0);
note(s, fr("Au 30/09 ce matin. Dans dix minutes : au 11/10."), 9.6, 3.15, 2.9, { taille: 16, h: 0.8 });
notes(s, `
Démo de 10 minutes. C'est le moment « wow » de la journée, il faut qu'il soit fluide : répétez-la la veille.

Je passe sur Power BI (R5_rapport.pbix déjà ouvert). Ce que je montre, dans cet ordre :
1. Je clique sur Casablanca dans le graphique en barres : toute la page se filtre. « Pas de formule à changer, pas de TCD à refaire. »
2. Je change l'année dans le segment.
3. Je montre la carte « Dernière vente » : 30/09/2026.
4. Je vais dans C:\\Formation_PBI\\, je renomme Ventes_Retail.xlsx en Ventes_Retail_ancien.xlsx et Ventes_Retail_MAJ.xlsx en Ventes_Retail.xlsx. « C'est l'export de lundi prochain. Je ne l'ai pas ouvert. »
5. Accueil > Actualiser. Vingt secondes. La carte passe au 11/10/2026, octobre apparaît dans le graphique.

Je laisse un silence. Puis : « La ligne TOTAL, les doublons, les dates en texte : tout a été nettoyé tout seul. Ce matin, on va voir comment. »

ATTENTION : après la démo, remettre les fichiers dans l'état d'origine (renommer dans l'autre sens), sinon la démo de 12h10 ne marche plus.

Question qu'on me pose souvent ici : « Et si la structure de l'export change ? » Réponse honnête : si une colonne change de nom, l'actualisation s'arrête avec un message clair, on corrige une étape. C'est toujours moins long que de tout refaire.
`);

// 5
s = nouvelle("Contenu", "La journée suit le trajet de la donnée : importer, nettoyer, relier, calculer, montrer");
const arrets = [
  ["Importer", "9h40", "Obtenir les données"],
  ["Nettoyer", "10h10", "Power Query"],
  ["Relier", "13h30", "Vue Modèle"],
  ["Calculer", "14h25", "DAX"],
  ["Montrer", "15h35", "Vue Rapport"],
];
s.addShape("line", { x: 1.6, y: 3.6, w: 10.1, h: 0, line: { color: K.petrole, width: 3 } });
arrets.forEach(([verbe, heure, outil], i) => {
  const x = 1.6 + i * 2.525;
  s.addShape("ellipse", { x: x - 0.17, y: 3.43, w: 0.34, h: 0.34, fill: { color: K.petrole }, line: { color: K.papier, width: 2 } });
  s.addText(fr(heure), { x: x - 1.2, y: 2.75, w: 2.4, h: 0.45, fontFace: P.texte, fontSize: 18, color: K.gris, align: "center", margin: 0, isTextBox: true });
  s.addText(fr(verbe), { x: x - 1.3, y: 4.0, w: 2.6, h: 0.55, fontFace: P.titre, fontSize: 26, color: K.encre, align: "center", margin: 0, isTextBox: true });
  s.addText(fr(outil), { x: x - 1.3, y: 4.6, w: 2.6, h: 0.45, fontFace: P.texte, fontSize: 18, color: K.petrole, align: "center", margin: 0, isTextBox: true });
});
texte(s, "Pause à 11h00, déjeuner à 12h30, pause à 15h20. Plus de la moitié de la journée se passe sur votre clavier.", G.L, 5.75, 11.5, { couleur: K.gris });
notes(s, `
Deux minutes, pas plus. C'est le plan de la journée, mais je le présente comme le chemin que suit la donnée : on l'importe, on la nettoie, on relie les tables, on calcule, on montre.

« Ce matin, on ne fait QUE les deux premières étapes. Ça paraît beaucoup de temps pour du nettoyage. En vrai, c'est là que se joue 80 % de la qualité de votre rapport. »

Je précise le fonctionnement : je montre, vous faites, et pour chaque TP il y a un fichier de rattrapage. « Si vous décrochez, vous ne restez pas bloqué : vous ouvrez le fichier de rattrapage et vous repartez avec tout le monde. Ce n'est pas un échec, c'est prévu. »

Je ne repasserai pas cette slide. À chaque début de module, je redis juste en une phrase où on en est sur ce trajet.
`);

// 6
s = nouvelle("A vous", "Tout le monde ouvre l'export de la caisse dans Excel");
aVous(s, {
  duree: "8 minutes, jusqu'à 9h40",
  etapes: [
    "Lancez Power BI Desktop et fermez l'écran d'accueil. S'il ne s'ouvre pas, levez la main maintenant.",
    "Vérifiez le dossier C:\\Formation_PBI\\ : Ventes_Retail.xlsx, Ventes_Retail_MAJ.xlsx et le dossier rattrapage.",
    "Ouvrez Ventes_Retail.xlsx dans Excel. Regardez les feuilles Export_Ventes et Magasins, en haut et tout en bas.",
    "En binôme, 3 minutes : notez tout ce qui vous empêcherait de faire un tableau croisé propre.",
  ],
  attendu: "Une liste de problèmes sur un papier. On met en commun à 9h37.",
  bonus: "Comptez les lignes de données avec une formule et comparez avec votre voisin.",
});
notes(s, `
Les cinq premières minutes servent à vérifier les postes. C'est le seul moment où je peux régler un problème d'installation sans retarder tout le monde. Je fais le tour de la salle.

Problèmes classiques à cette heure-là :
- Power BI Desktop demande de se connecter avec un compte : on clique sur la croix, ce n'est pas nécessaire aujourd'hui.
- Le dossier C:\\Formation_PBI\\ n'existe pas sur un poste : je le copie depuis ma clé USB.
- Excel ouvre le fichier en « Mode protégé » : « Activer la modification », sinon ils ne voient pas tout.

Ensuite, binômes. Je donne la consigne en insistant sur « en haut ET tout en bas » : la ligne TOTAL est à la ligne 5194, personne ne la voit s'il ne descend pas (Ctrl + Flèche bas).

Je ne donne aucune réponse pendant l'exercice. Si un binôme est bloqué : « Regardez la colonne Date. Elle est alignée à gauche ou à droite ? »
`);

// 7
s = nouvelle("Contenu", "Cet export cache au moins sept pièges : combien en avez-vous trouvé ?");
capture(s, {
  id: "C07a", x: G.L, y: 1.85, w: 6.0, h: 2.35, quoi: "Excel, Export_Ventes, lignes 1 à 8.",
  etat: "participants/Ventes_Retail.xlsx ouvert dans Excel, zoom 100 %.",
  action: "Feuille Export_Ventes, cellule A1 sélectionnée. Colonnes A à F visibles.",
  recadrage: "Lignes 1 à 8, colonnes A à F, avec les en-têtes de lignes et de colonnes d'Excel.",
  annotations: "Cadre sur A1 (titre), cadre sur la colonne Date (texte aligné à gauche).",
});
capture(s, {
  id: "C07b", x: G.L, y: 4.35, w: 6.0, h: 2.35, quoi: "Excel, Export_Ventes, dernières lignes.",
  etat: "Même fichier.",
  action: "Ctrl + Fin, puis remonter pour voir les lignes 5184 à 5194 : fin du bloc recollé, ligne vide, TOTAL GÉNÉRAL.",
  recadrage: "Lignes 5184 à 5194, colonnes A à F.",
  annotations: "Cadre sur la ligne TOTAL GÉNÉRAL, cadre sur la colonne Code magasin du bloc recollé.",
});
capture(s, {
  id: "C07c", x: 6.95, y: 1.85, w: 5.73, h: 3.0, quoi: "Excel, feuille Magasins entière.",
  etat: "Même fichier.",
  action: "Feuille Magasins, colonnes A à E élargies pour tout lire.",
  recadrage: "Lignes 1 à 14, colonnes A à E.",
  annotations: "Cadres sur C2, C3, C4 (casse), sur les lignes 6 et 7 (MAG-05 en double), sur l'en-tête Ville - Région.",
});
cadre(s, G.L + 0.15, 2.05, 5.6, 0.32);
cadre(s, G.L + 0.15, 5.1, 5.6, 0.32);
cadre(s, 7.1, 2.3, 5.4, 1.05);
texte(s, [
  { text: "Titre au-dessus des en-têtes, dates en texte, ligne vide puis TOTAL, une semaine recollée en double, ville et région fusionnées, « casa » et « CASABLANCA », MAG-05 saisi deux fois.", saut: true },
  { text: "Le huitième ne se voit pas dans Excel. Rendez-vous à 13h56.", gras: true },
], 6.95, 5.0, 5.73, { taille: 18 });
notes(s, `
Mise en commun, 3 minutes. Je demande d'abord : « Combien de problèmes avez-vous trouvé ? » Et je fais monter les enchères : trois, cinq, six... Le binôme qui en a le plus les liste, les autres complètent.

Puis je révèle la slide. Les sept pièges sont listés en bas à droite.

Le huitième, je ne le dis pas : c'est le magasin MAG-13, ouvert en mars 2026 à Kénitra, qui vend mais n'existe pas dans la feuille Magasins. On le découvrira en faisant le modèle, cet après-midi. Je garde le suspense, ça marche bien.

Le point à faire passer : « Ce fichier n'est pas un fichier pourri que j'ai inventé pour vous embêter. Chacun de ces défauts, je l'ai vu dans de vrais exports. Et dans Excel, vous les corrigez à la main, chaque semaine. Dans Power BI, vous les corrigez une fois. »

Transition vers le module 1 : « On ouvre Power BI. »
`);

// 8
s = nouvelle("Contenu", "Power BI Desktop s'organise en trois vues, et on passe la matinée dans aucune des trois");
capture(s, {
  id: "C08", x: G.L, y: 1.85, w: 9.3, h: 4.25, quoi: "Power BI Desktop, nouveau rapport vide.",
  etat: "Power BI Desktop ouvert sur un rapport vierge (Fichier > Nouveau).",
  action: "Vue Rapport, volets Filtres, Visualisations et Données dépliés. Survoler l'icône Table de la barre de gauche pour faire apparaître son infobulle.",
  recadrage: "Fenêtre entière de Power BI Desktop, en 1600 x 900 environ.",
  annotations: "Cadre sur la barre d'icônes à gauche, cadre sur les trois volets de droite.",
  controle: "Nom de la vue du milieu : « Vue Table » ou « Vue Données » ? Noter le libellé exact de l'infobulle et me le signaler pour corriger la slide.",
});
cadre(s, G.L + 0.05, 2.6, 0.35, 1.5);
cadre(s, 7.0, 2.6, 2.85, 3.3);
note(s, fr("Vue Rapport, vue Table, vue Modèle. Les deux icônes du bas (requête DAX, TMDL) ne servent pas aujourd'hui."), G.L + 0.55, 6.2, 9.0, { h: 0.6, taille: 17 });
fleche(s, G.L + 0.45, 6.35, G.L + 0.22, 4.15, K.rouge, { epaisseur: 1.75 });
note(s, fr("Filtres, Visualisations et Données : ce qui sert à construire une page."), 10.2, 3.6, 2.5, { h: 1.4, taille: 17 });
fleche(s, 10.15, 3.9, 9.9, 3.9);
notes(s, `
Je projette Power BI en vrai, en même temps que la slide, et je fais le tour de l'écran en 5 minutes.

La blague qui marche : « Il y a trois vues. Ce matin, on n'en utilisera aucune. » Ça intrigue. Parce que ce matin, on travaille dans une fenêtre à part, l'éditeur Power Query.

Ce que je montre :
- À gauche, la barre d'icônes : vue Rapport (là où on construit les pages), vue Table (là où on regarde les données chargées), vue Modèle (là où on relie les tables). Les deux icônes en dessous, vue de requête DAX et vue TMDL, c'est pour plus tard dans votre vie, on n'y touche pas.
- À droite, trois volets. Le volet Données s'appelait « Champs » jusqu'en 2023 : si vous suivez un tuto YouTube un peu ancien et qu'il parle du volet Champs, c'est le même.
- Le ruban : on utilisera surtout l'onglet Accueil.

Question à la salle : « Ça ressemble à quoi que vous connaissez ? » On répond souvent PowerPoint (le canevas au milieu) et Excel (le ruban). C'est exactement ça.
`);

// 9
s = nouvelle("Contenu", "Le Navigateur vous montre les feuilles avant de rien charger");
pasAPas(s, {
  capture: {
    id: "C09", quoi: "Fenêtre Navigateur, quatre feuilles cochées, aperçu de Export_Ventes.",
    etat: "Rapport vierge.",
    action: "Accueil > Obtenir les données > Classeur Excel > C:\\Formation_PBI\\Ventes_Retail.xlsx. Cocher les 4 feuilles, cliquer sur Export_Ventes pour afficher son aperçu. Ne cliquer sur aucun bouton.",
    recadrage: "La fenêtre Navigateur entière, boutons Charger et Transformer les données compris.",
    annotations: "Pastilles 3 sur les cases à cocher et 4 sur le bouton Transformer les données.",
  },
  etapes: [
    "Accueil > Obtenir les données > Classeur Excel.",
    "C:\\Formation_PBI\\Ventes_Retail.xlsx > Ouvrir.",
    "Cochez les quatre feuilles.",
    "Cliquez sur Transformer les données, pas sur Charger.",
  ],
});
etape(s, 3, G.L + 0.15, 2.9);
etape(s, 4, 6.2, 4.6);
notes(s, `
Je le fais en direct, lentement, ils regardent sans toucher (ils le feront au TP juste après).

Au moment où le Navigateur s'ouvre, je m'arrête sur l'aperçu de Export_Ventes : « Regardez la première ligne. Power BI croit que le titre de l'export est un en-tête de colonne. Il a déjà un problème, et on n'a encore rien chargé. »

Puis j'insiste sur l'étape 4. Il y a deux boutons en bas : Charger et Transformer les données. « Charger, c'est envoyer le fichier tel quel dans le rapport. Transformer les données, c'est passer d'abord par l'atelier de nettoyage. Avec un fichier propre, Charger suffit. Avec un export métier, jamais. »

Si un profil technique demande pourquoi il y a aussi une option « Classeur Excel » et « Texte/CSV » : la plupart des exports métier arrivent en CSV, le principe est exactement le même.
`);

// 10
s = nouvelle("Contenu", "Le bouton Charger envoie l'export tel quel dans le rapport, ligne de titre et ligne TOTAL comprises");
avantApres(s, {
  gauche: { legende: "Avec Charger", capture: {
    id: "C10a", quoi: "Vue Table après un Charger direct : en-têtes faux, lignes parasites.",
    etat: "Fichier jetable : rapport vierge, import de Export_Ventes avec le bouton Charger.",
    action: "Vue Table, table Export_Ventes, faire défiler pour voir les premières lignes. Laisser visible le message d'erreurs de chargement s'il apparaît.",
    recadrage: "La grille de la vue Table avec les noms de colonnes et les 10 premières lignes.",
    annotations: "Cadre sur la ligne des noms de colonnes.",
    controle: "Noter ce qu'affiche réellement Power BI comme noms de colonnes (Column1… ou le titre de l'export) et me le dire : la note formateur en dépend.",
  } },
  droite: { legende: "Avec Transformer les données", capture: {
    id: "C10b", quoi: "Éditeur Power Query, Export_Ventes avant toute transformation.",
    etat: "Même import, cette fois avec Transformer les données.",
    action: "Requête Export_Ventes sélectionnée, aperçu en haut de la table.",
    recadrage: "L'aperçu des données (sans le ruban) et le volet Étapes appliquées.",
    annotations: "Cadre sur les deux premières lignes de l'aperçu.",
  } },
  bas: [{ text: "Charger, c'est accepter le fichier tel quel. ", gras: true }, "Transformer les données ouvre Power Query, où chaque défaut se corrige une fois pour toutes."],
});
cadre(s, G.L + 0.15, 2.3, 5.45, 0.42);
cadre(s, 6.9 + 0.15, 2.6, 5.45, 0.65);
notes(s, `
Erreur n°1 de la journée, et c'est la plus fréquente chez les débutants : on clique sur Charger parce que c'est le bouton bleu et qu'il est à droite.

Je montre la capture de gauche (ou je le fais en direct dans un fichier jetable). Ce qu'on voit : les colonnes ne s'appellent pas Date, Quantité, etc. Selon les versions, Power BI met Column1, Column2... ou prend le titre de l'export comme nom de colonne. Dans les deux cas, impossible de faire une somme des quantités, et la ligne TOTAL GÉNÉRAL est dans la table comme si c'était une vente.

« Imaginez que les en-têtes aient été bons : la ligne TOTAL serait comptée comme une vente de plus, avec la quantité totale. Vos quantités seraient multipliées par deux, sans aucun message d'erreur. Le genre de chiffre qui part en comité de direction. »

Bonne nouvelle : ce n'est pas grave. Si vous avez cliqué sur Charger, Accueil > Transformer les données vous ramène dans Power Query. Rien n'est perdu.

Transition : « À vous. »
`);

// 11
s = nouvelle("A vous", "Importez les quatre feuilles et arrêtez-vous dans Power Query");
aVous(s, {
  duree: "15 minutes, jusqu'à 10h10",
  etapes: [
    "Fichier > Options et paramètres > Options > Fichier actuel > Chargement des données : décochez les deux cases de la rubrique Relations. Aujourd'hui, c'est vous qui reliez les tables.",
    "Accueil > Obtenir les données > Classeur Excel > C:\\Formation_PBI\\Ventes_Retail.xlsx.",
    "Cochez Export_Ventes, Magasins, Produits et Calendrier, puis Transformer les données.",
    "Dans le volet Requêtes à gauche, double-cliquez sur Export_Ventes et renommez-la Ventes.",
  ],
  attendu: "Quatre requêtes à gauche : Ventes, Magasins, Produits, Calendrier.",
  rattrapage: "C:\\Formation_PBI\\rattrapage\\R1_import.pbix, puis Accueil > Transformer les données.",
  bonus: "Affichage > Barre de formule, puis cliquez sur l'étape Source : c'est déjà du code M.",
});
notes(s, `
15 minutes. Je donne le top départ et je fais le tour.

L'étape 1 est importante et on l'oublie facilement. Par défaut, Power BI essaie de deviner les relations entre les tables au chargement. C'est pratique en entreprise, mais aujourd'hui ça nous cacherait l'erreur de 13h30. Je demande à chacun de me montrer son écran avec les deux cases décochées avant de continuer.

Ce qui bloque d'habitude :
- Ils ne trouvent pas « Fichier actuel » : c'est dans la colonne de gauche de la fenêtre Options, sous la rubrique Global.
- Ils ont cliqué sur Charger par réflexe : Accueil > Transformer les données, et on continue.
- Ils ont renommé la feuille dans Excel au lieu de la requête : pas grave, on renomme la requête.

Les rapides : je les envoie sur le bonus. Les profils techniques adorent voir que Power Query écrit du code derrière chaque clic.

À 10h08 : « Ceux qui n'ont pas les quatre requêtes, ouvrez R1. » Je vérifie que tout le monde est au même point avant de passer au module 2.
`);

// 12
s = nouvelle("Contenu", "Power Query rejoue vos nettoyages à chaque actualisation");
const recette = ["Source", "Lignes du haut supprimées", "En-têtes promus", "Lignes filtrées", "Type modifié", "Texte nettoyé", "Doublons supprimés"];
s.addText(fr("Étapes appliquées"), { x: 4.65, y: 1.85, w: 3.6, h: 0.45, fontFace: P.texteGras, fontSize: 18, color: K.petrole, margin: 0, isTextBox: true });
s.addText(recette.map((r, i) => ({ text: fr(r), options: { breakLine: i < recette.length - 1 } })), {
  x: 4.65, y: 2.35, w: 3.6, h: 3.4, fontFace: P.texte, fontSize: 18, color: K.encre, line: { color: K.petrole, width: 2 },
  margin: [10, 10, 8, 14], valign: "middle", paraSpaceAfter: 4, isTextBox: true, objectName: "Recette",
});
const fichiers = [
  ["Export du 01/10", `${nf(D.lignes_brutes)} lignes brutes`, `Ventes : ${nf(D.lignes_propres)} lignes`, 2.35],
  ["Export du 12/10", `${nf(D.maj_lignes_brutes)} lignes brutes`, `Ventes : ${nf(D.maj_lignes_propres)} lignes`, 4.55],
];
fichiers.forEach(([nom, brut, propre, yy], i) => {
  texte(s, [{ text: nom, gras: true, saut: true }, brut], G.L, yy, 3.3, { taille: 19 });
  fleche(s, 3.6, yy + 0.45, 4.6, 4.05 + (i === 0 ? -0.6 : 0.6), i === 0 ? K.encre : K.petrole, { epaisseur: 2, tirets: i === 1 });
  fleche(s, 8.3, 4.05 + (i === 0 ? -0.6 : 0.6), 9.3, yy + 0.45, i === 0 ? K.encre : K.petrole, { epaisseur: 2, tirets: i === 1 });
  texte(s, [{ text: propre, gras: true, saut: true }, i === 0 ? "nettoyée" : "nettoyée sans rien retoucher"], 9.4, yy, 3.3, { taille: 19, couleur: i === 1 ? K.petrole : K.encre });
});
texte(s, "Vous ne modifiez jamais le fichier source. Vous écrivez une recette, et Power BI la rejoue sur chaque nouvel export.", G.L, 6.0, 11.6);
notes(s, `
C'est LA phrase de la journée. Si les participants ne retiennent qu'une chose ce matin, c'est celle-là.

Je l'explique avec une image de cuisine, ça marche bien avec tous les profils : « Power Query, c'est une recette. Vous ne cuisinez pas le plat une fois, vous écrivez la recette. La semaine prochaine, vous changez les ingrédients (le nouvel export), et la recette se rejoue toute seule. »

Je montre la colonne du milieu : ce sont les étapes qu'on va créer ensemble ce matin, dans cet ordre. Je ne les détaille pas maintenant.

Puis les chiffres : l'export du 1er octobre a ${nf(D.lignes_brutes)} lignes, il en sort ${nf(D.lignes_propres)} propres. L'export du 12 octobre en a ${nf(D.maj_lignes_brutes)}, il en sort ${nf(D.maj_lignes_propres)}, sans qu'on ait touché à rien. C'est ce qu'on a vu dans la démo de 9h15.

Question à la salle : « Qu'est-ce qui se passe si je corrige une erreur directement dans le fichier Excel ? » Réponse attendue : la semaine prochaine, le nouvel export a de nouveau l'erreur. Donc on ne corrige jamais dans la source.
`);

// 13
s = nouvelle("Contenu", "Chaque clic devient une ligne dans Étapes appliquées, et on peut revenir en arrière");
capture(s, {
  id: "C13", x: G.L, y: 2.1, w: 9.6, h: 4.6, quoi: "Éditeur Power Query, requête Ventes après quatre étapes, barre de formule visible.",
  etat: "R2_nettoye.pbix, Accueil > Transformer les données.",
  action: "Requête Ventes, cliquer sur l'étape « Lignes filtrées » dans Étapes appliquées. Affichage > Barre de formule cochée.",
  recadrage: "Fenêtre entière de l'éditeur Power Query.",
  annotations: "Cadre sur la barre de formule, cadre sur le volet Étapes appliquées.",
  controle: "Libellés réels des étapes générées (« Lignes du haut supprimées », « En-têtes promus », « Lignes filtrées ») : les reporter si différents.",
});
cadre(s, 8.35, 2.55, 1.85, 3.9);
fleche(s, 10.7, 2.75, 10.25, 2.75);
note(s, fr("Étapes appliquées : cliquez sur une étape pour revoir la table à ce moment-là."), 10.75, 2.45, 2.0, { h: 2.0 });
cadre(s, 1.35, 2.35, 6.8, 0.38);
fleche(s, 7.4, 1.95, 7.0, 2.33);
note(s, fr("Barre de formule : Affichage > Barre de formule"), 7.5, 1.72, 4.6, { taille: 16, h: 0.35 });
notes(s, `
Je montre l'éditeur Power Query en vrai, 5 minutes. Trois zones à connaître :
- l'aperçu au milieu, qui n'affiche que les premières lignes (important : ce n'est pas tout le fichier) ;
- à droite, Étapes appliquées : chaque clic que vous faites ajoute une ligne ;
- en haut, la barre de formule, qu'on active dans Affichage. Les métiers peuvent l'ignorer, les techniques vont l'adorer.

Démonstration qui rassure tout le monde : je clique sur une étape au milieu de la liste, la table revient à son état d'alors. Je supprime une étape avec la petite croix, elle disparaît. « Vous ne pouvez rien casser. Le fichier Excel n'est jamais modifié. »

Moment où ça décroche souvent : les gens cliquent sur une ancienne étape pour regarder, puis continuent de travailler dessus. Power BI demande alors s'il faut insérer une étape au milieu. Conseil : toujours revenir sur la dernière étape avant de faire un nouveau clic.
`);

// 14
s = nouvelle("Contenu", "Sur un PC réglé en anglais, le 13/02 devient Error et le 03/04 devient le 4 mars");
avantApres(s, {
  gauche: { legende: "Fichier réglé en Anglais (États-Unis)", capture: {
    id: "C14a", quoi: "Colonne Date convertie en type Date avec des paramètres régionaux US : Error et dates inversées.",
    etat: "Copie jetable de R1. Fichier > Options et paramètres > Options > Fichier actuel > Paramètres régionaux : Anglais (États-Unis).",
    action: "Requête Ventes, en-têtes faits, clic sur l'icône de type de Date > Date. Faire défiler jusqu'à voir à la fois une cellule Error (jour > 12) et une date du type 04/03/2025.",
    recadrage: "Les colonnes Date et N° ticket sur une quinzaine de lignes.",
    annotations: "Cadre sur une cellule Error, cadre sur une date inversée.",
    controle: "Nom exact de l'option : « Paramètres régionaux pour l'importation » ?",
  } },
  droite: { legende: "Avec les paramètres régionaux Français (Maroc)", capture: {
    id: "C14b", quoi: "La même colonne convertie avec Utilisation des paramètres régionaux, Français (Maroc).",
    etat: "Même fichier, étape de type supprimée puis refaite avec les paramètres régionaux.",
    action: "Mêmes lignes qu'en C14a.",
    recadrage: "Identique à C14a, pour que les deux images se comparent ligne à ligne.",
    annotations: "Cadres aux mêmes endroits qu'en C14a.",
  } },
  bas: [{ text: "Le pire n'est pas Error : ", gras: true }, "le 3 avril lu à l'américaine devient le 4 mars sans aucun message. Sur l'export, 1 984 lignes ont un jour inférieur ou égal à 12."],
});
notes(s, `
Erreur n°2, et c'est la plus vicieuse de la journée, parce qu'elle est silencieuse.

Contexte : l'export a ses dates en texte, au format jour/mois/année. Sur vos PC réglés en français, Power BI les lit correctement. Mais le jour où votre fichier est ouvert par un collègue dont Windows est en anglais, ou publié sur un serveur réglé en anglais, Power BI lit mois/jour/année.

Ce qui se passe alors (je le montre en direct si possible, en changeant le paramètre régional du fichier) :
- 13/02/2025 : il n'y a pas de 13e mois, donc Error. Ça se voit.
- 03/04/2025 : il existe un 3e mois et un 4e jour, donc Power BI écrit 4 mars au lieu de 3 avril. Aucun message. Vos chiffres de mars et d'avril sont mélangés.

« Sur notre export, 1 984 lignes sur 5 159 ont un jour inférieur ou égal à 12. Plus d'un tiers des ventes pourraient changer de mois sans que personne ne s'en rende compte. »

Si quelqu'un a une anecdote là-dessus, c'est le moment de la laisser raconter : il y en a souvent une dans la salle.
`);

// 15
s = nouvelle("Contenu", "Modifier le type avec les paramètres régionaux règle le problème sur n'importe quel PC");
pasAPas(s, {
  capture: {
    id: "C15", quoi: "Boîte « Modifier le type avec les paramètres régionaux », Date et Français (Maroc).",
    etat: "R1 + en-têtes faits.",
    action: "Clic sur l'icône ABC à gauche de l'en-tête Date > Utilisation des paramètres régionaux… Choisir Date et Français (Maroc), ne pas valider.",
    recadrage: "Le menu de l'icône de type à gauche et la boîte de dialogue à droite. Si les deux ne tiennent pas ensemble, faire deux captures et les juxtaposer.",
    annotations: "Pastille 1 sur l'icône de type, pastille 2 sur la dernière ligne du menu, pastille 3 sur les deux listes de la boîte.",
    controle: "Libellé exact de la dernière ligne du menu (« Utilisation des paramètres régionaux… »).",
  },
  etapes: [
    "Cliquez sur l'icône ABC à gauche de l'en-tête Date.",
    "Choisissez la dernière ligne : Utilisation des paramètres régionaux…",
    "Type de données : Date. Paramètres régionaux : Français (Maroc).",
    "OK, puis vérifiez une date dont le jour dépasse 12 : 25/12/2024 doit rester le 25 décembre.",
  ],
});
etape(s, 1, G.L + 0.2, 2.2);
etape(s, 2, G.L + 0.6, 4.3);
etape(s, 3, 5.2, 3.0);
notes(s, `
La correction. Je la fais en direct, ils regardent, puis ils la refont au TP qui suit.

L'idée à faire passer : on ne dit pas seulement à Power BI « c'est une date », on lui dit « c'est une date écrite à la française ». Comme ça, peu importe le PC qui ouvre le fichier, la lecture est toujours la même.

Pourquoi Français (Maroc) et pas Français (France) ? Les deux lisent JJ/MM/AAAA, les deux marchent. Je prends Maroc parce que c'est notre contexte, et ça évite la question.

Pour les profils techniques : la barre de formule montre maintenant Table.TransformColumnTypes avec un troisième argument "fr-MA". C'est ça qui fige la culture.

Si une étape « Type modifié » existe déjà avant (Power Query l'ajoute parfois tout seul après les en-têtes), il faut la supprimer d'abord, sinon on convertit une date déjà mal lue.
`);

// 16
s = nouvelle("A vous", "Remettez l'export d'aplomb : lignes de titre, en-têtes, ligne TOTAL, dates");
aVous(s, {
  duree: "23 minutes, jusqu'à 10h50",
  etapes: [
    "Requête Ventes : Accueil > Supprimer les lignes > Supprimer les lignes du haut (2), puis Utiliser la première ligne pour les en-têtes.",
    "Si Power Query a ajouté une étape Type modifié, supprimez-la avec la croix.",
    "Filtrez la colonne N° ticket pour exclure (null) : la ligne vide et la ligne TOTAL disparaissent.",
    "Colonne Date : icône de type > Utilisation des paramètres régionaux > Date, Français (Maroc).",
    "Quantité en Nombre entier, Prix unitaire en Nombre décimal.",
  ],
  attendu: `${nf(D.lignes_brutes)} lignes, aucune cellule Error.`,
  rattrapage: "Levez la main, je viens.",
  bonus: "Pourquoi filtrer N° ticket plutôt que supprimer les lignes du bas ? Pensez à l'export suivant.",
});
notes(s, `
23 minutes de manipulation, puis 10 minutes de mise en commun avant la pause. C'est le TP le plus long de la matinée, il faut le laisser respirer.

Ce qui bloque d'habitude :
- Le compte de lignes : par défaut, Power Query calcule ses statistiques sur les 1 000 premières lignes. En bas de la fenêtre, « Profilage de colonne basé sur les 1000 premières lignes » : cliquer dessus et choisir l'ensemble des données. Sinon ils ne trouvent jamais ${nf(D.lignes_brutes)}.
- Ils filtrent la colonne Date au lieu de N° ticket : ça marche aussi pour la ligne vide, mais pas toujours pour TOTAL selon le type de la colonne à ce moment-là. Je les laisse essayer et comparer.
- Ils oublient l'étape 2 : la colonne Date est déjà en type Date avec la mauvaise culture. Je montre l'étape « Type modifié » et la croix.

Mise en commun à 10h50 : je demande à chacun son nombre de lignes, à voix haute. Ceux qui ont ${nf(D.lignes_brutes)} lèvent la main. Pour les autres, on cherche ensemble l'écart. C'est un bon exercice : on apprend plus en cherchant pourquoi on a 5 190 qu'en ayant juste.

Réponse au bonus : la semaine prochaine, l'export peut avoir une ligne vide de plus ou de moins en bas. « Supprimer les 2 lignes du bas » supprimerait alors une vraie vente. Filtrer sur « N° ticket non vide » marche quelle que soit la longueur.

Pause à 11h00. Je préviens : « On reprend à 11h15 pile, avec une question. »
`);

// 17
s = nouvelle("Enonce", "Ouvrez le filtre de la colonne Ville - Région : combien de villes voyez-vous ?");
texte(s, "Requête Magasins. Comptez à voix haute.", G.L, 5.25, 10, { couleur: K.gris });
notes(s, `
Retour de pause, 5 minutes. Ça réveille.

Je demande à tout le monde de cliquer sur la petite flèche de la colonne Ville - Région, dans la requête Magasins, et de compter les villes.

Réponses qu'on entend : 10 (ceux qui comptent les vraies villes), 11, 12, 13. La bonne réponse pour Power Query, c'est 13 lignes dans la liste, pour 10 villes réelles.

Je fais lister : Casablanca, casa, CASABLANCA, et deux fois Salé qui ont l'air identiques. La salle cherche toujours ce qui différencie les deux Salé. Je laisse chercher dix secondes : c'est un espace en fin de cellule, invisible.

« Pour vous, c'est la même ville. Pour Power Query, ce sont des textes différents, caractère par caractère. Et si vous faites un graphique par ville, vous aurez cinq barres pour trois villes. »

Transition : « D'abord on sépare la ville de sa région, ensuite on nettoie le texte. »
`);

// 18
s = nouvelle("Contenu", "Fractionner la colonne par délimiteur sépare la ville de sa région");
pasAPas(s, {
  capture: {
    id: "C18", quoi: "Boîte « Fractionner la colonne par délimiteur », délimiteur personnalisé espace-tiret-espace.",
    etat: "R2_nettoye.pbix avec l'étape de fractionnement supprimée (copie jetable), ou R1 + étapes du TP 2a.",
    action: "Requête Magasins, colonne Ville - Région sélectionnée, Accueil > Fractionner la colonne > Par délimiteur. Choisir Personnalisé et taper espace, tiret, espace. Ne pas valider.",
    recadrage: "La boîte de dialogue entière, avec un bout de la colonne Ville - Région derrière.",
    annotations: "Pastille 2 sur la liste du délimiteur, pastille 3 sur la zone de saisie.",
    controle: "Libellé exact de l'option « À chaque occurrence du délimiteur ».",
  },
  etapes: [
    "Sélectionnez la colonne Ville - Région, puis Accueil > Fractionner la colonne > Par délimiteur.",
    "Délimiteur : Personnalisé.",
    "Tapez espace, tiret, espace. Un tiret seul couperait aussi « Casablanca-Settat ».",
    "Renommez les deux colonnes Ville et Région (double-clic sur l'en-tête).",
  ],
});
etape(s, 2, 3.0, 2.65);
etape(s, 3, 3.0, 3.6);
notes(s, `
4 minutes de démo, ils refont au TP.

Le piège est dans l'étape 3, et je laisse la salle le trouver : « Si je mets juste un tiret comme délimiteur, qu'est-ce qui se passe avec Casablanca-Settat ? » Quelqu'un finit par voir que la région elle-même contient des tirets. On obtient trois ou quatre colonnes au lieu de deux.

D'où l'espace-tiret-espace : il n'apparaît qu'entre la ville et la région.

Note pour moi : sur la ligne « CASABLANCA  - Casablanca-Settat », il y a deux espaces avant le tiret. Le fractionnement laisse donc un espace à la fin de « CASABLANCA ». C'est voulu, on le nettoie juste après.
`);

// 19
s = nouvelle("Contenu", "Pour Power Query, « casa », « Casablanca » et « CASABLANCA » sont trois villes différentes");
avantApres(s, {
  gauche: { legende: "Filtre de la colonne Ville, avant", capture: {
    id: "C19a", quoi: "Liste déroulante du filtre sur Ville après fractionnement : 13 valeurs.",
    etat: "Requête Magasins juste après le fractionnement.",
    action: "Clic sur la flèche de filtre de la colonne Ville. La liste doit montrer les 13 valeurs.",
    recadrage: "La liste déroulante du filtre seule.",
    annotations: "Cadre sur casa, Casablanca, CASABLANCA et les deux Salé.",
  } },
  droite: { legende: "Après nettoyage du texte", capture: {
    id: "C19b", quoi: "Même filtre après Supprimer les espaces, Majuscule à chaque mot, Remplacer : 10 valeurs.",
    etat: "Requête Magasins après les trois étapes de nettoyage.",
    action: "Clic sur la même flèche de filtre.",
    recadrage: "Identique à C19a.",
    annotations: "Aucune.",
  } },
  bas: [{ text: "Le piège : ", gras: true }, "remplacer « Casa » par « Casablanca » sans cocher « Mettre en correspondance tout le contenu de la cellule » transforme aussi Casablanca en « Casablancablanca »."],
});
cadre(s, G.L + 0.3, 2.4, 3.0, 1.6);
notes(s, `
Erreur n°3. Je fais la correction en direct, dans cet ordre, et je dis pourquoi l'ordre compte :
1. Transformer > Format > Supprimer les espaces : enlève les espaces en début et en fin. Les deux Salé deviennent un seul.
2. Transformer > Format > Majuscule à chaque mot : CASABLANCA devient Casablanca, casa devient Casa.
3. Accueil > Remplacer les valeurs : Casa par Casablanca.

Et là, je fais exprès de tomber dans le piège devant eux, sans cocher l'option avancée. Résultat : « Casablancablanca ». Ça fait toujours rire. Puis je supprime l'étape, je la refais en ouvrant « Options avancées » et en cochant « Mettre en correspondance tout le contenu de la cellule ».

« Remplacer les valeurs, c'est comme Rechercher-Remplacer dans Word : par défaut, il remplace partout où il trouve le mot, même au milieu d'un autre. »

Petite remarque pour les curieux : une fois les données chargées dans le modèle, Power BI ne fait plus la différence entre majuscules et minuscules. CASABLANCA et Casablanca y seraient fusionnés. Mais « casa » resterait une ville à part. Donc on nettoie quand même, ici, dans Power Query.
`);

// 20
s = nouvelle("Enonce", "Supprimez les espaces avant de dédoublonner, sinon « MAG-03 » et « MAG-03 » suivi d'un espace survivent tous les deux", { taille: 38 });
texte(s, [
  "Supprimer les doublons compare les cellules caractère par caractère. Dans l'export, 30 lignes recollées ne diffèrent de l'original que par cet espace : ",
  { text: `${nf(V.ca_doublons_si_oublies, 2)} MAD comptés deux fois.`, gras: true },
], G.L, 5.2, 10.8, { couleur: K.gris });
notes(s, `
Erreur n°4. Une slide sans image, volontairement : c'est une règle d'ordre, il faut qu'elle se lise de loin.

L'histoire : quelqu'un a recollé dans l'export une semaine de juin déjà présente. Les 30 lignes sont des copies, sauf que le système qui les a sorties ajoute un espace après le code magasin. « MAG-03 » et « MAG-03 espace ».

Si on fait Supprimer les doublons d'abord, Power Query compare les lignes et les trouve différentes : il ne supprime rien. Le CA est surestimé de ${nf(V.ca_doublons_si_oublies, 2)} MAD. Si on supprime les espaces d'abord, les lignes deviennent identiques, et Supprimer les doublons fait son travail.

Deuxième piège, que je vois à chaque session : Supprimer les doublons ne regarde QUE les colonnes sélectionnées. Si vous avez seulement la colonne Code magasin sélectionnée, il garde une ligne par magasin. Vous passez de 5 189 lignes à 13. Avant de dédoublonner une table entière : clic sur l'en-tête de la première colonne, Ctrl+A, puis Supprimer les doublons.

Je pose la question : « Combien de lignes on doit avoir à la fin ? » Je la laisse en suspens, la réponse est sur la slide suivante.
`);

// 21
s = nouvelle("A vous", `Nettoyez Magasins et Ventes jusqu'à retrouver exactement ${nf(D.lignes_propres)} ventes et 12 magasins`);
aVous(s, {
  duree: "35 minutes, jusqu'à 12h10",
  etapes: [
    "Magasins : fractionnez Ville - Région (espace-tiret-espace), renommez Ville et Région.",
    "Ville : Supprimer les espaces, Majuscule à chaque mot, Remplacer « Casa » par « Casablanca » (contenu entier).",
    "Magasins, Ctrl+A puis Supprimer les doublons.",
    "Ventes : Supprimer les espaces sur Code magasin, puis Ctrl+A et Supprimer les doublons.",
    "Types : Surface en Nombre entier, Date d'ouverture en Date.",
  ],
  attendu: `Ventes : ${nf(D.lignes_propres)} lignes. Magasins : 12 lignes. Filtre de Ville : 10 valeurs.`,
  rattrapage: "Levez la main. R2 arrive à 12h20.",
  bonus: "Accueil > Éditeur avancé : repérez Text.Trim et Table.Distinct dans le code de Ventes.",
});
notes(s, `
35 minutes. C'est le cœur du nettoyage. Je circule beaucoup.

Ce qui bloque d'habitude, par ordre de fréquence :
1. 13 lignes dans Ventes au lieu de ${nf(D.lignes_propres)} : ils ont dédoublonné avec une seule colonne sélectionnée. On supprime l'étape, Ctrl+A, on refait.
2. 5 189 lignes au lieu de ${nf(D.lignes_propres)} : ils ont dédoublonné avant de supprimer les espaces. On fait glisser l'étape « Texte nettoyé » au-dessus de « Doublons supprimés » dans Étapes appliquées (ça se fait à la souris), ou on supprime et refait.
3. 13 lignes dans Magasins : les espaces de Salé ne sont pas supprimés, ou le dédoublonnage a été fait avant.
4. « Casablancablanca » : ils n'ont pas coché l'option. Ça arrive à environ un tiers de la salle, même après la démo.

Les rapides : bonus Éditeur avancé. Et s'il reste du temps : renommer les étapes (clic droit > Renommer) avec des noms qui parlent, « Supprimer titre export », « Enlever ligne TOTAL ». Dans six mois, c'est ce qui vous sauvera.

À 12h05, je préviens : « Cinq minutes, puis je vous montre l'actualisation. »
`);

// 22
s = nouvelle("Contenu", "Lundi suivant : on remplace le fichier, on clique sur Actualiser, et octobre est là");
avantApres(s, {
  gauche: { legende: "Rapport au 30/09, avant le nouvel export", capture: {
    id: "C22a", quoi: "Rapport final, graphique mensuel s'arrêtant en septembre 2026, carte Dernière vente au 30/09/2026.",
    etat: "R5_rapport.pbix avec Ventes_Retail.xlsx d'origine.",
    action: "Vue Rapport, page Ventes, segment Année sur 2026.",
    recadrage: "La carte Dernière vente et le graphique mensuel.",
    annotations: "Cadre sur la carte Dernière vente.",
  } },
  droite: { legende: "Même rapport, après Actualiser", capture: {
    id: "C22b", quoi: "Même vue après remplacement du fichier par l'export du 12/10 et Actualiser.",
    etat: "R5_rapport.pbix, Ventes_Retail.xlsx remplacé par le contenu de Ventes_Retail_MAJ.xlsx, Accueil > Actualiser.",
    action: "Même page, même segment.",
    recadrage: "Identique à C22a.",
    annotations: "Cadre sur la carte Dernière vente (11/10/2026) et sur la colonne octobre.",
  } },
  bas: [{ text: "Puis, pour vous : ", gras: true }, "Accueil > Fermer et appliquer, et Fichier > Enregistrer sous C:\\Formation_PBI\\ma_formation.pbix."],
});
notes(s, `
Démo de 10 minutes, puis 10 minutes pour que tout le monde ferme, applique et enregistre.

La démo : je reprends mon fichier R5, celui de 9h15. Je remplace l'export dans le dossier par celui du 12 octobre (même nom de fichier), je reviens dans Power BI, Accueil > Actualiser. Cette fois, ils savent ce qui se passe derrière : la recette qu'ils viennent d'écrire se rejoue sur ${nf(D.maj_lignes_brutes)} lignes au lieu de ${nf(D.lignes_brutes)}.

« La ligne TOTAL de ce nouvel export, personne ne l'a supprimée. Les doublons, personne ne les a cherchés. Les dates, personne ne les a converties. C'est la recette. »

Ensuite, pour eux : Fermer et appliquer. Les données partent de Power Query vers le modèle. Ça prend quelques secondes. Puis Enregistrer sous ma_formation.pbix.

Rattrapage R2 à distribuer à ce moment-là pour ceux qui n'ont pas fini : C:\\Formation_PBI\\rattrapage\\R2_nettoye.pbix. On repart tous de là à 13h30.

ATTENTION : remettre le fichier Ventes_Retail.xlsx d'origine avant le déjeuner, sinon les chiffres de l'après-midi ne correspondent plus au guide.
`);

// 23
s = nouvelle("Contenu", "Sans relation, chaque ville affiche le même total : votre premier visuel est faux");
capture(s, {
  id: "C23", x: G.L, y: 1.85, w: 8.2, h: 4.85, quoi: "Visuel Table : Magasins[Ville] et Somme de Quantité, même nombre sur chaque ligne.",
  etat: "R2_nettoye.pbix, aucune relation.",
  action: "Vue Rapport, insérer un visuel Table, glisser Magasins > Ville puis Ventes > Quantité. Agrandir le visuel pour voir les 10 villes et le total.",
  recadrage: "Le visuel Table et le volet Visualisations avec ses zones de dépôt.",
  annotations: "Cadre sur la colonne des quantités (toutes identiques).",
});
cadre(s, 4.2, 2.4, 1.6, 3.6);
texte(s, [{ text: "Ce qu'on voit : ", gras: true }, "le même nombre sur les dix lignes, et c'est le total général."], 9.2, 1.95, 3.5, { taille: 19 });
texte(s, [{ text: "Pourquoi : ", gras: true }, "Magasins et Ventes ne se connaissent pas. Power BI ne sait pas quelles ventes appartiennent à Casablanca, il met tout partout."], 9.2, 3.6, 3.5, { taille: 19 });
notes(s, `
Retour de déjeuner, 13h30. Tout le monde ouvre ma_formation.pbix ou R2_nettoye.pbix.

Je ne fais pas d'introduction. Je demande directement : « Vue Rapport, visuel Table, glissez la ville de Magasins et la quantité de Ventes. » Deux minutes. Ça réveille, et ça produit une erreur.

Résultat : chaque ville affiche le même nombre, qui est le total général. Je laisse les gens réagir. Il y a toujours quelqu'un pour dire « c'est cassé ».

« Ce n'est pas cassé, c'est logique. Pour Power BI, la table Magasins et la table Ventes sont deux fichiers qui ne se connaissent pas. Il ne sait pas quelle vente appartient à quel magasin. Dans Excel, vous auriez fait une RECHERCHEV. Ici, on fait une relation, une fois pour toutes. »

C'est pour ça qu'on a décoché la détection automatique ce matin : sinon Power BI l'aurait devinée, et vous n'auriez jamais vu ce qui se passe sans elle.
`);

// 24
s = nouvelle("Contenu", "Un modèle en étoile met les ventes au centre, et ce qui les décrit autour");
function boite(x, y, nom, details, centre) {
  s.addText(fr(nom), { x, y, w: 2.9, h: 0.55, fill: { color: centre ? K.petrole : K.encre }, color: K.papier, fontFace: P.texteGras, fontSize: 20, margin: [10, 6, 0, 0], valign: "middle", isTextBox: true });
  s.addText(fr(details), { x, y: y + 0.55, w: 2.9, h: 0.8, line: { color: centre ? K.petrole : K.encre, width: 1.25 }, fontFace: P.texte, fontSize: 18, color: K.encre, margin: [10, 6, 5, 5], valign: "middle", isTextBox: true });
}
boite(4.6, 3.1, "Ventes", `une ligne par vente\n${nf(D.lignes_propres)} lignes`, true);
boite(G.L, 1.95, "Magasins", "une ligne par magasin\n12 lignes");
boite(8.55, 1.95, "Produits", "une ligne par produit\n54 lignes");
boite(G.L, 4.85, "Calendrier", "une ligne par jour\n1 096 lignes");
fleche(s, 3.6, 2.65, 4.55, 3.4, K.petrole, { epaisseur: 2.5 });
fleche(s, 8.5, 2.65, 7.55, 3.4, K.petrole, { epaisseur: 2.5 });
fleche(s, 3.6, 5.3, 4.55, 4.3, K.petrole, { epaisseur: 2.5 });
[["1", 3.65, 2.35], ["*", 4.3, 3.0], ["1", 8.2, 2.35], ["*", 7.6, 3.0], ["1", 3.65, 5.3], ["*", 4.3, 4.45]].forEach(([t, x, yy]) => note(s, t, x, yy, 0.3, { couleur: K.gris, taille: 18 }));
texte(s, [
  { text: "Autour : ", gras: true }, "des listes de référence, qui changent peu.", { text: "", saut: true },
  { text: "Au centre : ", gras: true }, "ce qui s'est passé, qui grossit chaque semaine.", { text: "", saut: true },
  { text: "Les liens : ", gras: true }, "un magasin a plusieurs ventes ; une vente a un seul magasin.",
], 8.55, 4.0, 4.15, { taille: 19, espace: 6 });
notes(s, `
Avant d'afficher le schéma, je pose la question à la salle, slide encore masquée (touche B pour noircir l'écran) :
« Pourquoi ne pas tout mettre dans une seule grande table, comme dans Excel ? »
Laisser répondre. On attend « RECHERCHEV » ou « c'est plus simple ». Réponses à donner :
- une grande table répète « Atlas Bazar Maârif, Casablanca, Casablanca-Settat, 420 m² » sur 1 300 lignes ; si le magasin déménage, il faut tout corriger ;
- chaque nouvel export devrait être re-fusionné à la main, c'est exactement le travail qu'on veut supprimer.

Puis je montre le schéma. On l'appelle « en étoile » parce que la table des ventes est au centre et les autres autour. Le vocabulaire officiel (table de faits, table de dimension), je le donne une fois pour les techniques, mais je n'insiste pas.

La lecture du « 1 » et de l'étoile : un magasin, plusieurs ventes. Je fais la phrase à voix haute pour chaque lien. Les gens retiennent mieux la phrase que le symbole.

Le Calendrier mérite une phrase : « Pourquoi une table juste pour les dates ? Parce que la table Ventes ne connaît que les jours où il y a eu une vente. Pour comparer à l'année dernière, Power BI a besoin de tous les jours, même ceux où un magasin était fermé. »
`);

// 25
s = nouvelle("Contenu", "Dans la vue Modèle, on relie deux tables en glissant une colonne sur l'autre");
capture(s, {
  id: "C25a", x: G.L, y: 1.85, w: 7.4, h: 4.85, quoi: "Vue Modèle avec les quatre tables reliées en étoile.",
  etat: "R3_modele.pbix.",
  action: "Vue Modèle, disposer les tables en étoile (Ventes au centre). Ajuster le zoom pour que tout tienne.",
  recadrage: "Le canevas de la vue Modèle, sans les volets de droite.",
  annotations: "Cadre sur un lien avec son 1 et son *.",
});
capture(s, {
  id: "C25b", x: 8.25, y: 1.85, w: 4.43, h: 3.6, quoi: "Boîte Modifier la relation, Ventes et Magasins.",
  etat: "R3_modele.pbix.",
  action: "Double-clic sur le lien Ventes - Magasins.",
  recadrage: "La partie basse de la boîte : Cardinalité et Direction du filtrage croisé.",
  annotations: "Cadres sur Cardinalité et sur Direction du filtrage croisé.",
  controle: "Libellés exacts des deux listes et des valeurs « Plusieurs-à-un (*:1) » et « Unique » (la documentation française dit « Célibataire »).",
});
cadre(s, 8.4, 2.4, 4.1, 0.6);
cadre(s, 8.4, 3.2, 4.1, 0.6);
texte(s, "Cardinalité : un-à-plusieurs. Direction : unique. On ne touche à rien d'autre aujourd'hui.", 8.25, 5.6, 4.43, { taille: 18 });
notes(s, `
Démo, 5 minutes. Je glisse Ventes[Code magasin] sur Magasins[Code magasin]. La boîte de dialogue s'ouvre (ou la relation se crée directement selon la version, alors je double-clique dessus pour l'ouvrir).

Deux réglages à montrer, pas plus :
- Cardinalité : Power BI la devine. Un magasin, plusieurs ventes : un-à-plusieurs (ou plusieurs-à-un selon le sens dans lequel on lit, c'est la même chose).
- Direction du filtrage croisé : Unique. Ça veut dire que le filtre va du magasin vers les ventes. On verra pourquoi dans deux slides.

Anecdote à garder sous le coude : la documentation Microsoft en français traduit « Single » par « Célibataire ». Si quelqu'un tombe dessus en cherchant sur Internet, c'est la même chose que « Unique ».

Je ne montre PAS la case « Rendre cette relation active » ni le filtrage bidirectionnel de sécurité. Hors sujet pour une initiation.
`);

// 26
s = nouvelle("Contenu", "« Plusieurs-à-plusieurs » veut presque toujours dire qu'il reste un doublon dans le référentiel");
avantApres(s, {
  gauche: { legende: "Magasins pas dédoublonnée", capture: {
    id: "C26a", quoi: "Boîte de relation avec cardinalité Plusieurs-à-plusieurs et son avertissement.",
    etat: "Copie jetable de R2 où l'étape Doublons supprimés de Magasins a été retirée, puis Fermer et appliquer.",
    action: "Vue Modèle, glisser Ventes[Code magasin] sur Magasins[Code magasin].",
    recadrage: "La boîte de dialogue : cardinalité et message d'avertissement jaune.",
    annotations: "Cadre sur la cardinalité, cadre sur le message.",
    controle: "Texte exact du message d'avertissement.",
  } },
  droite: { legende: "Après Supprimer les doublons", capture: {
    id: "C26b", quoi: "Même boîte avec la cardinalité un-à-plusieurs, sans avertissement.",
    etat: "R3_modele.pbix.",
    action: "Double-clic sur le lien Ventes - Magasins.",
    recadrage: "Identique à C26a.",
    annotations: "Cadre sur la cardinalité.",
  } },
  bas: [{ text: "La correction se fait dans Power Query : ", gras: true }, "Accueil > Transformer les données, requête Magasins, Supprimer les doublons, puis Fermer et appliquer."],
});
notes(s, `
Erreur n°5. Si quelqu'un a sauté le dédoublonnage de Magasins ce matin, il va tomber dessus en direct, et c'est tant mieux : je fais la démonstration sur son écran, avec son accord.

Ce qui se passe : Power BI voit MAG-05 deux fois dans Magasins. Il ne peut pas dire « un magasin, plusieurs ventes » puisque MAG-05 existe deux fois. Il propose alors « plusieurs-à-plusieurs » avec un avertissement jaune.

Le réflexe à donner : quand Power BI propose plusieurs-à-plusieurs entre une table de référence et une table de ventes, il ne faut pas accepter. Il faut aller chercher le doublon. Dans 9 cas sur 10, c'est une ligne saisie deux fois, un espace en trop, ou une ligne vide.

Comment le trouver vite : dans Power Query, sur la colonne Code magasin, Accueil > Conserver les lignes > Conserver les doublons. Il ne reste que les lignes en double. (On supprime l'étape après avoir regardé.)
`);

// 27
s = nouvelle("Contenu", "La ligne « (Vide) » regroupe les ventes dont le magasin est introuvable");
capture(s, {
  id: "C27", x: G.L, y: 1.85, w: 7.6, h: 4.85, quoi: "Visuel Table Ville et Somme de Quantité, avec une ligne (Vide).",
  etat: "R3_modele.pbix.",
  action: "Vue Rapport, visuel Table : Magasins[Ville], Magasins[Nom magasin], Somme de Quantité. Trier pour que (Vide) soit visible.",
  recadrage: "Le visuel seul.",
  annotations: "Cadre sur la ligne (Vide).",
});
cadre(s, G.L + 0.25, 2.45, 7.1, 0.42);
texte(s, [
  { text: "Le huitième piège : ", gras: true, couleur: K.rouge },
  "MAG-13, à Kénitra, vend depuis le 16 mars 2026. Personne ne l'a ajouté à la feuille Magasins.",
], 8.6, 1.95, 4.1, { taille: 20 });
texte(s, [
  { text: "On ne le corrige pas dans Power BI. ", gras: true },
  `On prévient la personne qui tient le référentiel. En attendant, ${nf(V.ca_mag13_vide, 2)} MAD de ventes restent sans ville.`,
], 8.6, 3.75, 4.1, { taille: 20 });
notes(s, `
Erreur n°6, et c'est le huitième piège que j'avais promis ce matin. Les gens qui ont noté sept pièges à 9h35 sont contents de le voir arriver.

Ce qu'on voit : une ligne « (Vide) » dans le visuel. Elle contient les ventes du code MAG-13, que la table Magasins ne connaît pas. Power BI ne les perd pas : il les range dans une case « je ne sais pas ».

La discussion intéressante avec la salle : « Qu'est-ce qu'on fait ? »
- Réponse tentante : ajouter une ligne MAG-13 dans Power Query à la main. Mauvaise idée : la prochaine fois que le référentiel change, votre correction est en conflit.
- Bonne réponse : on prévient la personne qui tient le fichier Magasins. Power BI a joué son rôle de détecteur.

C'est un point fort de Power BI qu'on sous-estime : dans Excel, une RECHERCHEV qui ne trouve pas renvoie #N/A, et les gens mettent SIERREUR pour cacher. Ici, l'écart est visible et chiffré.
`);

// 28
s = nouvelle("Contenu", "Le filtre descend du référentiel vers les ventes, jamais l'inverse");
function tableSch(x, yy, nom, champs, accent) {
  s.addText(fr(nom), { x, y: yy, w: 2.5, h: 0.5, fill: { color: accent ? K.petrole : K.encre }, color: K.papier, fontFace: P.texteGras, fontSize: 18, margin: [10, 6, 0, 0], valign: "middle", isTextBox: true });
  s.addText(champs.map(fr).join("\n"), { x, y: yy + 0.5, w: 2.5, h: 0.3 + 0.38 * champs.length, line: { color: accent ? K.petrole : K.encre, width: 1 }, fontFace: P.texte, fontSize: 18, color: K.encre, margin: [10, 6, 5, 5], valign: "top", isTextBox: true });
}
tableSch(G.L, 2.3, "Produits", ["Réf produit", "Catégorie"]);
tableSch(4.4, 2.3, "Ventes", ["Réf produit", "Code magasin", "Quantité"], true);
tableSch(7.85, 2.3, "Magasins", ["Code magasin", "Ville"]);
fleche(s, 3.2, 3.15, 4.35, 3.15, K.petrole, { epaisseur: 3 });
note(s, "1", 3.25, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, "*", 4.1, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, fr("le filtre Catégorie passe"), G.L + 0.4, 4.35, 3.4, { couleur: K.petrole, taille: 18, gras: true });
fleche(s, 6.95, 3.15, 7.8, 3.15, K.rouge, { epaisseur: 3, tirets: true });
note(s, "*", 7.0, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, "1", 7.55, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, fr("il ne remonte pas vers Magasins"), 6.3, 4.35, 3.6, { taille: 18, gras: true });
s.addTable([
  [{ text: fr("Catégorie"), options: { bold: true } }, { text: "Magasins", options: { bold: true, align: "right" } }],
  ...["Boissons", "Épicerie", "Maison", "Textile"].map((c) => [fr(c), { text: "12", options: { align: "right", color: K.rouge } }]),
], { x: 10.48, y: 2.3, w: 2.2, colW: [1.15, 1.05], fontFace: P.texte, fontSize: 16, color: K.encre, border: { type: "solid", pt: 0.75, color: K.filet }, rowH: 0.36, margin: 0.05 });
texte(s, [
  { text: "Résultat dans un tableau « Nb magasins par catégorie » : ", gras: true },
  "12 sur chaque ligne, faux. Le compte doit se faire côté Ventes : DISTINCTCOUNT(Ventes[Code magasin]), qu'on écrira tout à l'heure.",
], G.L, 5.3, 10.0);
notes(s, `
Erreur n°7, et c'est la plus difficile de la journée à faire comprendre. Je prends le temps, 5 minutes.

La question métier : « Dans combien de magasins on a vendu du textile ? » Quelqu'un fait un tableau avec Produits[Catégorie] et le nombre de lignes de Magasins. Résultat : 12 partout. Faux, évidemment, ou alors on vend tout partout.

L'explication, en suivant le schéma avec le doigt (ou le pointeur) :
- Je clique sur « Textile ». Le filtre part de Produits, il descend vers Ventes en suivant la flèche : on ne garde que les ventes de textile. Ça, ça marche.
- Mais pour compter des magasins, il faudrait que le filtre continue de Ventes vers Magasins. Or la flèche va dans l'autre sens. Le filtre s'arrête. Magasins n'est pas filtrée, on compte les 12.

Image qui marche bien : « Le filtre, c'est de l'eau. Elle descend des tables de référence vers la table des ventes. Elle ne remonte pas. »

La tentation, c'est de passer la relation en filtrage « Les deux ». Ça marche sur ce cas, mais sur un vrai modèle ça crée des ambiguïtés et des chiffres faux ailleurs. Pour une initiation, la règle simple : on compte côté Ventes. On le fera avec DISTINCTCOUNT au module suivant.

Si la salle a décroché : on ne s'acharne pas. « Retenez juste : si un chiffre est identique sur toutes les lignes, c'est que le filtre n'arrive pas jusqu'à la table. »
`);

// 29
s = nouvelle("A vous", "Reliez les quatre tables et marquez le calendrier comme table de dates");
aVous(s, {
  duree: "20 minutes, jusqu'à 14h25",
  etapes: [
    "Vue Modèle : glissez Ventes[Code magasin] sur Magasins[Code magasin].",
    "Puis Ventes[Réf produit] sur Produits[Réf produit], et Ventes[Date] sur Calendrier[Date].",
    "Double-cliquez sur chaque lien : un-à-plusieurs, direction unique.",
    "Volet Données, clic droit sur Calendrier > Marquer comme table de dates > colonne Date.",
    "Fichier > Options > Fichier actuel > Chargement des données : décochez Date/heure automatique.",
  ],
  attendu: "Trois relations un-à-plusieurs. Dans le visuel par ville, une seule ligne (Vide) : MAG-13.",
  rattrapage: "C:\\Formation_PBI\\rattrapage\\R3_modele.pbix",
  bonus: "Créez le tableau Catégorie / nombre de magasins et constatez le 12 partout.",
});
notes(s, `
20 minutes.

Ce qui bloque d'habitude :
- La relation Date ne se crée pas, ou les visuels par mois sont vides : la colonne Date de Ventes est restée en texte (ils ont sauté la conversion ce matin, ou l'ont faite sur la mauvaise étape). On retourne dans Power Query. Une relation entre une date et un texte ne trouve aucune correspondance.
- Ils glissent dans le mauvais sens (Magasins sur Ventes) : aucune importance, Power BI met la cardinalité dans le bon sens tout seul.
- « Marquer comme table de dates » est grisé : la colonne Date de Calendrier n'est pas en type Date, ou ils ont cliqué sur la table Ventes.

Date/heure automatique, en une phrase : par défaut, Power BI crée une hiérarchie Année / Trimestre / Mois / Jour cachée pour chaque colonne de date. C'est pratique au début, mais ça entre en conflit avec notre table Calendrier. On la coupe.

Les rapides font le bonus : ça leur fait vivre l'erreur n°7 eux-mêmes, et ils la corrigeront au module DAX.

À 14h23 : R3 pour ceux qui n'ont pas trois relations propres.
`);

// 30
s = nouvelle("Contenu", "Une colonne calcule ligne par ligne, une mesure calcule pour chaque case du visuel");
const ex = D.exemples.slice(0, 5);
s.addText(fr("Colonne Montant : calculée par ligne, stockée"), { x: G.L, y: 1.85, w: 6.7, h: 0.4, fontFace: P.texteGras, fontSize: 18, color: K.petrole, margin: 0, isTextBox: true });
s.addTable([
  ["Magasin", "Réf", "Qté", "Prix", "Montant"].map((t) => ({ text: fr(t), options: { bold: true, align: t === "Magasin" || t === "Réf" ? "left" : "right" } })),
  ...ex.map((r) => [r["Code magasin"], r["Réf produit"], { text: nf(r["Quantité"]), options: { align: "right" } }, { text: nf(r["Prix unitaire"], 2), options: { align: "right" } }, { text: nf(r["Montant"], 2), options: { align: "right", color: K.petrole, bold: true } }]),
  [{ text: fr(`… ${nf(D.lignes_propres - 5)} autres lignes`), options: { colspan: 5, color: K.gris } }],
], { x: G.L, y: 2.35, w: 6.4, colW: [1.35, 1.35, 0.9, 1.25, 1.55], fontFace: P.texte, fontSize: 18, color: K.encre, border: { type: "solid", pt: 0.75, color: K.filet }, rowH: 0.44, margin: 0.06 });
s.addText(fr("Mesure CA dans un visuel par ville"), { x: 7.45, y: 1.85, w: 5.2, h: 0.4, fontFace: P.texteGras, fontSize: 18, color: K.petrole, margin: 0, isTextBox: true });
const villes = ["Casablanca", "Rabat", "Marrakech"];
s.addTable([
  [{ text: "Ville", options: { bold: true } }, { text: "CA (MAD)", options: { bold: true, align: "right" } }],
  ...villes.map((v) => [fr(v), { text: nf(D.ca_par_ville[v], 0), options: { align: "right" } }]),
  [{ text: "Total", options: { bold: true } }, { text: nf(V.ca_total, 0), options: { align: "right", bold: true } }],
], { x: 7.45, y: 2.35, w: 3.6, colW: [1.9, 1.7], fontFace: P.texte, fontSize: 18, color: K.encre, border: { type: "solid", pt: 0.75, color: K.filet }, rowH: 0.42, margin: 0.06 });
cadre(s, 9.35, 2.79, 1.72, 0.46);
fleche(s, 11.65, 3.02, 11.15, 3.02);
note(s, fr("La somme des Montant des seules lignes de Casablanca."), 11.25, 3.3, 1.45, { taille: 16, h: 1.6 });
texte(s, "Recalculée pour chaque case, à chaque clic. Rien n'est stocké.", 7.45, 5.0, 3.6, { taille: 18, couleur: K.gris });
texte(s, [{ text: "En pratique : ", gras: true }, "une colonne quand la valeur appartient à la ligne (le montant d'une vente), une mesure pour tout ce qui s'agrège (un CA, un nombre, une moyenne)."], G.L, 6.0, 11.6);
notes(s, `
Début du module DAX, 14h25. Le moment où l'énergie baisse après le déjeuner : je reste debout, je fais court, et on tape très vite des formules.

Ce schéma, c'est la seule notion « théorique » du module. Je l'explique avec Excel :
- Une colonne calculée, c'est une formule qu'on tire vers le bas dans Excel : une valeur par ligne. Montant = quantité fois prix, pour chaque vente. Le chiffre est stocké.
- Une mesure, c'est la case d'un tableau croisé dynamique : elle n'existe pas tant qu'on n'a pas choisi les lignes et les colonnes du tableau. Le CA de Casablanca, c'est la somme des montants des lignes de Casablanca. Si je clique sur 2026, la même case se recalcule.

Les chiffres sont réels, tirés de l'export : ce sont les premières lignes de la table Ventes.

Question à la salle : « Le panier moyen, c'est une colonne ou une mesure ? » On entend souvent « colonne ». Réponse : mesure, parce qu'un panier moyen n'a de sens que pour un groupe de tickets. La slide suivante montre ce qui se passe quand on se trompe.
`);

// 31
s = nouvelle("Contenu", "Montant s'écrit une fois dans la table, CA se recalcule à chaque clic");
s.addText(fr("Outils de table > Nouvelle colonne"), { x: G.L, y: 1.85, w: 8, h: 0.4, fontFace: P.texteGras, fontSize: 18, color: K.gris, margin: 0, isTextBox: true });
code(s, ["Montant = Ventes[Quantité] * Ventes[Prix unitaire]"], G.L, 2.3, 12.03, 0.9, 26);
s.addText(fr("Accueil > Nouvelle mesure, table Ventes sélectionnée"), { x: G.L, y: 3.45, w: 8, h: 0.4, fontFace: P.texteGras, fontSize: 18, color: K.gris, margin: 0, isTextBox: true });
code(s, ["CA = SUM(Ventes[Montant])"], G.L, 3.9, 12.03, 0.9, 26);
texte(s, [
  { text: "Pour qui vient d'Excel : ", gras: true },
  "SUM et pas SOMME, une virgule et pas un point-virgule, et on vise une colonne entière avec Table[Colonne], jamais une plage A2:A100.",
], G.L, 5.15, 8.4);
texte(s, [{ text: "Valeur attendue", gras: true, saut: true }, `CA = ${nf(V.ca_total)} MAD`], 9.6, 5.15, 3.08, { taille: 20 });
notes(s, `
Frappe guidée : je tape, ils tapent en même temps que moi. Pas de TP séparé pour ces deux formules.

Montant : colonne calculée. Je vais dans la vue Table, je sélectionne la table Ventes, Outils de table > Nouvelle colonne. Je tape la formule. Power BI propose l'autocomplétion dès qu'on tape « Ventes[ » : je montre qu'on peut choisir dans la liste avec Tab, ça évite les fautes de frappe dans « Quantité » avec son accent.

CA : mesure. Accueil > Nouvelle mesure. Important : sélectionner la table Ventes avant, sinon la mesure se range dans la table où on a cliqué en dernier, et on la cherche ensuite pendant cinq minutes.

Pour les gens d'Excel, trois différences que je dis une par une, en écrivant au tableau :
1. Les fonctions sont en anglais, même avec l'interface en français. SUM, pas SOMME.
2. Le séparateur est la virgule. Si quelqu'un tape un point-virgule, Power BI répond par un message de syntaxe incorrecte. (Il existe une option pour utiliser le point-virgule, dans Fichier > Options > Global > Paramètres régionaux. Je déconseille : tous les exemples sur Internet sont avec des virgules.)
3. On ne vise pas des cellules, on vise des colonnes.

Vérification collective : on met la mesure CA dans une carte. Tout le monde doit avoir ${nf(V.ca_total)}. Si quelqu'un a un autre chiffre, c'est son nettoyage du matin qui diffère : c'est l'occasion de vérifier.
`);

// 32
s = nouvelle("Contenu", `Écrit en colonne calculée, le CA affiche ${nf(V.ca_total)} MAD sur chacune des ${nf(D.lignes_propres)} lignes`);
avantApres(s, {
  gauche: { legende: "CA créé avec Nouvelle colonne", capture: {
    id: "C32a", quoi: "Vue Table, colonne CA_colonne affichant le total général sur chaque ligne.",
    etat: "Copie jetable de R4 : Outils de table > Nouvelle colonne, CA_colonne = SUM(Ventes[Montant]).",
    action: "Vue Table, table Ventes, colonne CA_colonne visible à côté de Montant.",
    recadrage: "Les colonnes Montant et CA_colonne sur une quinzaine de lignes.",
    annotations: "Cadre sur la colonne CA_colonne.",
  } },
  droite: { legende: "CA créé avec Nouvelle mesure", capture: {
    id: "C32b", quoi: "Visuel Table par ville avec la mesure CA : un chiffre différent par ville.",
    etat: "R4_mesures.pbix.",
    action: "Vue Rapport, visuel Table : Magasins[Ville] et la mesure CA.",
    recadrage: "Le visuel seul.",
    annotations: "Aucune.",
  } },
  bas: [{ text: "Le réflexe : ", gras: true }, "si une formule contient SUM, COUNT, AVERAGE ou DIVIDE sur des totaux, c'est une mesure. Accueil > Nouvelle mesure."],
});
notes(s, `
Erreur n°8. Je la provoque volontairement : je crée CA en colonne calculée, devant eux.

Ce qu'on voit : dans la vue Table, une nouvelle colonne où chaque ligne affiche ${nf(V.ca_total)}. Le total général, répété ${nf(D.lignes_propres)} fois. Et si on met cette colonne dans un visuel par ville, Power BI additionne ces totaux : des milliards de MAD pour Casablanca.

Pourquoi : une colonne calculée se calcule ligne par ligne, mais SUM regarde toute la colonne. Pour chaque ligne, la somme de toute la colonne, c'est le total. Pas de bug, juste le mauvais outil.

Comment on s'en rend compte en vrai : l'icône dans le volet Données. Une colonne calculée a une petite icône de tableau avec fx, une mesure a une icône de calculatrice. Je montre les deux.

Je supprime la colonne (clic droit > Supprimer du modèle) et on garde la mesure.
`);

// 33
s = nouvelle("Contenu", "DIVIDE calcule le panier moyen sans jamais afficher d'erreur de division");
code(s, ["Nb tickets = DISTINCTCOUNT(Ventes[N° ticket])", "", "Panier moyen = DIVIDE([CA], [Nb tickets])"], G.L, 1.9, 12.03, 1.95, 26);
texte(s, [
  { text: "DISTINCTCOUNT ", gras: true }, "compte les tickets différents : un ticket de trois articles fait trois lignes, mais un seul passage en caisse.",
], G.L, 4.2, 8.3);
texte(s, [
  { text: "DIVIDE ", gras: true }, "renvoie une case vide quand le dénominateur vaut zéro (un magasin sans vente ce jour-là). Avec la barre de division /, on obtient « Infini ».",
], G.L, 5.2, 8.3);
texte(s, [
  { text: "Valeurs attendues", gras: true, saut: true },
  `Nb tickets = ${nf(V.nb_tickets)}`, { text: "", saut: true },
  `Panier moyen = ${nf(V.panier_moyen, 2)} MAD`,
], 9.6, 4.2, 3.08, { taille: 20 });
notes(s, `
Frappe guidée, 5 minutes.

Nb tickets : je pose la question avant de taper. « Si je veux le nombre de passages en caisse, je compte quoi ? Les lignes ? » Non, une ligne c'est un article. Un client qui achète du thé, du sucre et de la menthe, c'est trois lignes et un seul ticket. Donc on compte les numéros de ticket différents : DISTINCTCOUNT.

Petite subtilité pour les techniques : DISTINCTCOUNT compte aussi la valeur vide comme une valeur. Sur notre export nettoyé il n'y en a pas (on a filtré les N° ticket vides ce matin), mais c'est bon à savoir. Sinon il existe DISTINCTCOUNTNOBLANK.

Panier moyen : DIVIDE. On aurait pu écrire [CA] / [Nb tickets]. Je montre la différence avec un cas concret : un segment sur un magasin qui n'a rien vendu un jour donné. Avec la barre, on a « Infini » qui s'affiche. Avec DIVIDE, la case reste vide. « Votre directeur préfère une case vide à Infini. »

Remarque : on réutilise les mesures dans d'autres mesures, entre crochets, sans nom de table. [CA], c'est la mesure de tout à l'heure. Ça évite de réécrire SUM partout.

Vérification : ${nf(V.nb_tickets)} tickets, panier moyen ${nf(V.panier_moyen, 2)} MAD.
`);

// 34
s = nouvelle("Contenu", "CALCULATE remplace le filtre de la ville avant de calculer");
code(s, ["CA Casablanca =", "CALCULATE([CA], Magasins[Ville] = \"Casablanca\")"], G.L, 1.9, 12.03, 1.35, 24);
capture(s, {
  id: "C34", x: G.L, y: 3.5, w: 6.4, h: 3.2, quoi: "Visuel Table par ville avec CA et CA Casablanca : la seconde colonne est identique partout.",
  etat: "R4_mesures.pbix.",
  action: "Vue Rapport, visuel Table : Magasins[Ville], CA, CA Casablanca.",
  recadrage: "Le visuel seul, toutes les villes visibles.",
  annotations: "Cadre sur la colonne CA Casablanca.",
});
cadre(s, 4.6, 3.75, 2.2, 2.3);
texte(s, [
  { text: "Sur la ligne Fès, CA Casablanca vaut ", gras: false },
  { text: `${nf(V.ca_casablanca, 2)} MAD`, gras: true }, ".",
], 7.55, 3.55, 5.1);
texte(s, "La ligne du tableau dit « Fès ». CALCULATE efface ce filtre sur la ville et le remplace par « Casablanca ». C'est voulu : c'est ce qui permet de comparer chaque ville à Casablanca.", 7.55, 4.45, 5.1, { taille: 19 });
notes(s, `
5 minutes. CALCULATE, c'est la fonction la plus importante du DAX et celle qui fait peur. Je la présente par le résultat, pas par la théorie.

Je tape la formule, je la mets dans un tableau par ville à côté du CA. Et je demande : « Pourquoi CA Casablanca s'affiche à la ligne de Fès ? »

Je laisse chercher. Réponses fréquentes : « c'est un bug », « il faut un filtre en plus ». La bonne explication :
- normalement, la ligne « Fès » du tableau filtre les données sur Fès ;
- CALCULATE dit : « oublie le filtre sur la ville, et mets Casablanca à la place » ;
- donc sur chaque ligne, on calcule le CA de Casablanca.

« À quoi ça sert, alors ? » À comparer : le poids de chaque ville par rapport à Casablanca, ou la part de chaque ville dans le total. C'est aussi grâce à ce mécanisme que fonctionne la comparaison à l'année précédente, qu'on voit juste après.

Si un participant demande comment avoir le CA de Casablanca seulement sur la ligne Casablanca : c'est simplement la mesure CA, le tableau s'en charge. Pas besoin de CALCULATE.

Valeur attendue : ${nf(V.ca_casablanca, 2)} MAD, sur toutes les lignes.
`);

// 35
s = nouvelle("Contenu", `Mars 2026 recule de ${nf(Math.abs(V.evol_mars_2026) * 100)} % sur un an alors que février gagne ${nf(V.evol_fevrier_2026 * 100)} % : le Ramadan a avancé de onze jours`);
const mois = ["janv.", "févr.", "mars", "avr.", "mai", "juin", "juil.", "août", "sept."];
s.addChart(pres.charts.BAR, [
  { name: "CA N-1 (2025)", labels: mois, values: D.mensuel_2025.map((x) => Math.round(x)) },
  { name: "CA 2026", labels: mois, values: D.mensuel_2026.map((x) => Math.round(x)) },
], {
  x: G.L, y: 1.85, w: 7.55, h: 4.85, barDir: "col", barGrouping: "clustered", barGapWidthPct: 60, barOverlapPct: -8,
  chartColors: ["A3A39E", "0B4F4A"], showLegend: true, legendPos: "b", legendFontFace: "+mn-lt", legendFontSize: 16, legendColor: "222222",
  catAxisLabelFontFace: "+mn-lt", catAxisLabelFontSize: 16, catAxisLabelColor: "5E5E5E", catAxisLineShow: false,
  valAxisLabelFontFace: "+mn-lt", valAxisLabelFontSize: 14, valAxisLabelColor: "5E5E5E", valAxisLabelFormatCode: "# ##0", valAxisLineShow: false,
  valGridLine: { color: "E4E4E0", size: 0.75 }, catGridLine: { style: "none" },
  showTitle: false, showValue: false,
});
note(s, fr(`févr. ${pct(V.evol_fevrier_2026)}`), 1.45, 3.05, 1.5, { taille: 17, gras: true, couleur: K.petrole });
note(s, fr(`mars ${pct(V.evol_mars_2026)}`), 2.55, 1.85, 1.6, { taille: 17, gras: true });
code(s, ["CA N-1 =", "CALCULATE(", "  [CA],", "  SAMEPERIODLASTYEAR(", "    Calendrier[Date]))", "", "Évolution vs N-1 =", "DIVIDE(", "  [CA] - [CA N-1],", "  [CA N-1])"], 8.4, 1.85, 4.28, 4.85, 18);
notes(s, `
6 minutes. Le moment fort du module, parce que le chiffre raconte une histoire que tout le monde dans la salle connaît.

Je tape d'abord les deux formules (en frappe guidée), puis je montre le graphique : CA 2026 et CA de l'année précédente, mois par mois.

Je pose la question : « Mars 2026 est en baisse de ${nf(Math.abs(V.evol_mars_2026) * 100)} % par rapport à mars 2025. Février est en hausse de ${nf(V.evol_fevrier_2026 * 100)} %. Le commerce s'est effondré en mars ? »
Quelqu'un trouve presque toujours : le Ramadan. En 2025, il a commencé début mars (le 2 mars environ). En 2026, autour du 19 février. Les achats d'épicerie, de dattes, de boissons se sont déplacés de mars vers février.

La leçon technique : SAMEPERIODLASTYEAR compare des dates du calendrier, le 15 mars au 15 mars. Elle ne sait rien du Ramadan, de l'Aïd ou des soldes. C'est à vous de savoir lire le chiffre. Le DAX calcule juste, l'interprétation reste votre métier.

Pour que SAMEPERIODLASTYEAR marche, il faut la table Calendrier marquée comme table de dates (fait au TP précédent) et la relation sur Date. Si CA N-1 est vide : c'est presque toujours l'un des deux.

Anecdote si la salle est réceptive : en juin, la comparaison Aïd al-Adha est faussée aussi. En 2025, il y a eu l'appel royal à ne pas accomplir le sacrifice, à cause de la sécheresse. Les ventes de kanouns et de couteaux n'ont rien à voir avec celles de 2026. Même formule, même piège.

Valeurs à vérifier : mars 2026 = ${nf(V.ca_mars_2026, 2)} MAD, CA N-1 de mars = ${nf(V.ca_mars_2025, 2)} MAD, évolution ${nf(V.evol_mars_2026 * 100, 1)} %.
`);

// 36
s = nouvelle("A vous", "Écrivez les sept formules et comparez vos résultats aux valeurs attendues");
aVous(s, {
  duree: "25 minutes, jusqu'à 15h20",
  etapes: [
    "Vue Table, table Ventes : Outils de table > Nouvelle colonne > Montant.",
    "Accueil > Nouvelle mesure, dans Ventes : CA, Nb tickets, Panier moyen.",
    "Puis CA Casablanca, CA N-1 et Évolution vs N-1.",
    "Formats (Outils de mesure) : CA en nombre entier avec séparateur, Évolution vs N-1 en pourcentage.",
    "Construisez une carte par mesure et comparez avec la page Valeurs attendues du guide.",
  ],
  attendu: `CA ${nf(V.ca_total)} MAD. Tickets ${nf(V.nb_tickets)}. Panier ${nf(V.panier_moyen, 2)} MAD. Mars 2026 : ${nf(V.evol_mars_2026 * 100, 1)} %.`,
  rattrapage: "C:\\Formation_PBI\\rattrapage\\R4_mesures.pbix",
  bonus: "Recréez le tableau Catégorie / magasins avec DISTINCTCOUNT(Ventes[Code magasin]). Le 12 partout disparaît.",
});
notes(s, `
25 minutes, puis pause à 15h20.

Les formules sont toutes dans l'aide-mémoire du guide participant. Je dis clairement : « Copier depuis le guide, c'est autorisé. Mais tapez-les, ne les collez pas : c'est en tapant qu'on comprend où va la virgule. »

Ce qui bloque d'habitude :
- « La syntaxe de ';' est incorrecte » ou message similaire : point-virgule à la place de la virgule. Le réflexe Excel est tenace.
- Guillemets typographiques : quelqu'un copie depuis Word ou un mail, « Casablanca » avec des guillemets courbes. DAX veut des guillemets droits "Casablanca".
- CA N-1 vide : Calendrier pas marqué comme table de dates, ou relation Date absente.
- La mesure est rangée dans la mauvaise table : clic sur la mesure, Outils de mesure > Table d'accueil > Ventes.
- Évolution affiche -0,26 au lieu de -26 % : format pas appliqué.

Le bonus est important pour ceux qui l'ont commencé au TP précédent : il referme la boucle de l'erreur n°7.

À 15h18 : R4 pour ceux qui n'ont pas les sept formules. Pause.
`);

// 37
s = nouvelle("Contenu", "Sans tri explicite, avril passe avant janvier");
avantApres(s, {
  gauche: { legende: "Axe des mois, tri par défaut", capture: {
    id: "C37a", quoi: "Graphique en colonnes CA par Calendrier[Mois] : avril, août, décembre, février…",
    etat: "R4_mesures.pbix, sans tri par colonne sur Mois.",
    action: "Vue Rapport, graphique en colonnes groupées, axe Calendrier[Mois], valeur CA, trié par Mois croissant.",
    recadrage: "Le graphique seul.",
    annotations: "Cadre sur les premières étiquettes de l'axe.",
  } },
  droite: { legende: "Après Trier par colonne > N° mois", capture: {
    id: "C37b", quoi: "Même graphique, janvier à décembre.",
    etat: "R5_rapport.pbix (tri par colonne appliqué).",
    action: "Même graphique.",
    recadrage: "Identique à C37a.",
    annotations: "Aucune.",
  } },
  bas: [{ text: "La correction : ", gras: true }, "vue Table, table Calendrier, colonne Mois sélectionnée, puis Outils de colonne > Trier par colonne > N° mois."],
});
cadre(s, G.L + 0.3, 4.0, 5.1, 0.4);
notes(s, `
Reprise après la pause, module Rapport. Erreur n°9, rapide et très visuelle : 4 minutes.

Je montre le graphique par mois. Les gens rient : avril, août, décembre, février... « Power BI trie les mois comme des mots, par ordre alphabétique. Il ne sait pas qu'avril vient après mars. »

La correction : on lui dit de trier la colonne Mois selon une autre colonne, N° mois, qui contient 1 à 12. Ça se fait une fois dans le modèle, et tous les visuels de tous les rapports en profitent.

Le piège secondaire : Trier par colonne est grisé. Deux raisons possibles : on n'est pas en vue Table ou Rapport avec la colonne sélectionnée, ou la colonne N° mois a plusieurs valeurs pour un même mois (ce n'est pas le cas ici, notre calendrier est propre).

Même chose pour les jours de la semaine, si vous en avez besoin un jour.
`);

// 38
s = nouvelle("Contenu", "Une page de rapport se lit de haut en bas : les chiffres clés, l'évolution, puis le détail");
capture(s, {
  id: "C38", x: G.L, y: 1.85, w: 8.15, h: 4.85, quoi: "Page Ventes du rapport final, segments visibles.",
  etat: "R5_rapport.pbix.",
  action: "Vue Rapport, page Ventes. Volets refermés. Aucun filtre actif.",
  recadrage: "Le canevas du rapport seul.",
  annotations: "Trois cadres : rangée de cartes, graphique mensuel, rangée du bas (barres + matrice).",
});
cadre(s, G.L + 0.2, 2.0, 7.75, 0.8);
cadre(s, G.L + 0.2, 2.95, 7.75, 1.15);
cadre(s, G.L + 0.2, 4.25, 7.75, 1.15);
etape(s, 1, 9.05, 2.3); texte(s, "Les chiffres que votre lecteur cherche en premier : CA, tickets, panier, évolution.", 9.65, 2.27, 3.05, { taille: 18 });
etape(s, 2, 9.05, 3.35); texte(s, "L'évolution dans le temps, avec l'année précédente.", 9.65, 3.32, 3.05, { taille: 18 });
etape(s, 3, 9.05, 4.6); texte(s, "Le détail, pour ceux qui veulent creuser : villes, catégories.", 9.65, 4.57, 3.05, { taille: 18 });
texte(s, "Un clic sur une barre filtre toute la page. Format > Modifier les interactions pour choisir qui filtre qui.", 9.05, 5.75, 3.65, { taille: 16, couleur: K.gris });
notes(s, `
6 minutes. Je ne fais pas un cours de design de tableau de bord, je donne une règle de lecture simple : en haut ce qu'on regarde en trois secondes, au milieu l'évolution, en bas le détail.

Les numéros sur la slide sont l'ordre de lecture, pas un ordre de construction.

Trois conseils que je donne à l'oral :
- une page répond à une question. Celle-ci répond à « comment vont les ventes ? ». Si vous avez une autre question (les stocks, les marges), faites une autre page ;
- pas plus de cinq ou six visuels par page. Au-delà, personne ne lit ;
- les segments en haut ou sur le côté, toujours au même endroit d'une page à l'autre.

Démo des interactions : je clique sur Casablanca dans les barres, tout se filtre. Puis Format > Modifier les interactions, et je montre qu'on peut empêcher un visuel d'être filtré (petite icône « Aucun »). Utile pour garder le total de l'enseigne visible pendant qu'on regarde une ville.

La carte « Dernière vente » : c'est le champ Date de Ventes dans une carte, avec l'agrégation « Plus récent » (clic sur la petite flèche du champ dans la zone Champs du visuel). Pas besoin de formule.
`);

// 39
s = nouvelle("A vous", "Reconstruisez la page de 9h15 avec vos propres données nettoyées");
aVous(s, {
  duree: "25 minutes, jusqu'à 16h10",
  etapes: [
    "Quatre cartes : CA, Nb tickets, Panier moyen, Évolution vs N-1.",
    "Graphique en colonnes groupées : Calendrier[Mois] en axe, CA et CA N-1 en valeurs.",
    "Barres : CA par Magasins[Ville]. Puis une matrice : Produits[Catégorie] en lignes, Calendrier[Année] en colonnes, CA.",
    "Deux segments : Calendrier[Année] et Produits[Catégorie].",
    "Cliquez sur Casablanca dans les barres : toute la page doit se filtrer.",
  ],
  attendu: "Une page lisible de loin, qui répond à « comment vont les ventes ? ».",
  rattrapage: "C:\\Formation_PBI\\rattrapage\\R5_rapport.pbix, à comparer avec le vôtre.",
  bonus: "Modifier les interactions pour que les cartes ne soient pas filtrées par la matrice.",
});
notes(s, `
25 minutes. C'est le TP où les gens prennent du plaisir, et où ils perdent le plus de temps sur la mise en forme. Je préviens : « On ne passe pas 10 minutes sur la couleur d'un titre. Le contenu d'abord. »

Ce qui bloque d'habitude :
- La carte affiche « Nombre de Date » ou une somme bizarre : ils ont glissé une colonne au lieu de la mesure. Les mesures sont celles avec l'icône de calculatrice.
- Le graphique mensuel mélange 2025 et 2026 : c'est normal sans segment, le segment Année règle ça. Je les laisse le découvrir.
- La matrice affiche les mois en vrac : ils ont mis Mois au lieu de Année, ou le tri par colonne n'est pas fait.

Pour finir, je demande à deux volontaires de projeter leur page. On commente ce qui marche, avec bienveillance. C'est souvent le moment où la salle réalise qu'elle a fait en une journée ce qui lui prend une matinée chaque semaine.

À 16h08 : enregistrez. Ce fichier est à vous, vous repartez avec.
`);

// 40
s = nouvelle("Enonce", "Lundi prochain, lequel de vos fichiers passera dans Power BI ?");
texte(s, "Avant de répondre : les dix questions du quiz, dernière page du guide. 10 minutes, correction à voix haute.", G.L, 5.25, 10.6, { couleur: K.gris });
notes(s, `
Dernier quart d'heure.

D'abord le quiz (10 minutes) : dix questions dans le guide participant. Ils répondent seuls, 5 minutes, puis je corrige à voix haute. Je ne ramasse pas, c'est pour eux. Les questions qui coincent le plus d'habitude : la 4 (colonne ou mesure) et la 7 (le sens du filtre). Si plus de la moitié de la salle se trompe sur l'une d'elles, je reprends deux minutes avec le schéma correspondant.

Ensuite, je reviens au paperboard de 9h00, avec la liste des fichiers que chacun refait à la main. Je relis chaque ligne et je demande à la personne : « Lequel vous passez dans Power BI en premier, et qu'est-ce qui va vous bloquer ? » Les réponses sont souvent très concrètes (« mon export a des cellules fusionnées », « je dois demander l'accès à la base »). C'est le meilleur moment de la journée pour les conseils personnalisés.

Pour aller plus loin, je donne trois pistes et je m'arrête là :
- Microsoft Learn, parcours « Préparer les données pour l'analyse avec Power BI » (gratuit, en français) ;
- publier un rapport sur le service Power BI pour le partager : nécessite une licence, à voir avec votre service informatique ;
- refaire ce TP avec votre propre export, cette semaine, tant que c'est frais.

Évaluation de la journée, remerciements. Fin à 16h30.
`);

// ================= ÉCRITURE =================
const sortie = path.resolve(__dirname, "../Initiation_Power_BI.pptx");
pres.writeFile({ fileName: sortie }).then(async () => {
  await applyTheme(sortie, THEME);
  fs.writeFileSync(path.join(__dirname, "captures.json"), JSON.stringify(CAPTURES, null, 1));
  console.log(`${numero} slides, ${CAPTURES.length} captures -> ${sortie}`);
});
