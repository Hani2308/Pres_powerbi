// Échantillon des gabarits, pour valider la direction visuelle avant la production.
const path = require("path");
const { applyTheme } = require("./apply_theme");
const { fr, COULEURS: K, THEME, POLICES: P, G, creerPresentation, emplacementCapture, cadre, etape, fleche, note } = require("./gabarits");

const pres = creerPresentation();

// 1. Couverture
let s = pres.addSlide({ masterName: "Couverture" });
s.addText(fr("Initiation à Power BI : du fichier du lundi au rapport qui se met à jour seul"), { placeholder: "title" });
s.addText(fr("Une journée, 9h00 à 16h30\nAvec Hani Sahir, data scientist"), { placeholder: "body" });

// 2. Capture plein cadre annotée (slide 13 du plan)
s = pres.addSlide({ masterName: "Contenu" });
s.addText(fr("Chaque clic devient une ligne dans Étapes appliquées, et on peut revenir en arrière"), { placeholder: "title" });
emplacementCapture(s, { id: "C13", x: G.L, y: 2.1, w: 9.6, h: 4.85, quoi: "Éditeur Power Query, requête Ventes, après 4 étapes. Fenêtre entière, barre de formule visible." });
cadre(s, 8.35, 2.55, 1.85, 3.9);
fleche(s, 10.7, 2.75, 10.25, 2.75);
note(s, fr("Étapes appliquées : cliquez sur une étape pour revoir la table à ce moment-là"), 10.75, 2.45, 2.0, { h: 2.0 });
cadre(s, 1.35, 2.35, 6.8, 0.38);
fleche(s, 7.4, 1.95, 7.0, 2.33);
note(s, fr("Barre de formule : Affichage > Barre de formule"), 7.5, 1.72, 4.6, { taille: 16, h: 0.35 });

// 3. Avant / après (slide 18)
s = pres.addSlide({ masterName: "Contenu" });
s.addText(fr("Pour Power Query, « casa », « Casablanca » et « CASABLANCA » sont trois villes différentes"), { placeholder: "title" });
const yP = 2.05, hP = 3.3, wP = 5.75;
s.addText(fr("Ce que montre le filtre de la colonne Ville"), { x: G.L, y: 1.65, w: wP, h: 0.35, fontFace: P.texteGras, fontSize: 18, color: K.rouge, margin: 0, isTextBox: true });
emplacementCapture(s, { id: "C18a", x: G.L, y: yP, w: wP, h: hP, quoi: "Liste déroulante du filtre sur Ville, avant nettoyage : 13 valeurs." });
s.addText(fr("Après nettoyage du texte"), { x: G.L + wP + 0.5, y: 1.65, w: wP, h: 0.35, fontFace: P.texteGras, fontSize: 18, color: K.petrole, margin: 0, isTextBox: true });
emplacementCapture(s, { id: "C18b", x: G.L + wP + 0.5, y: yP, w: wP, h: hP, quoi: "Même filtre après nettoyage : 10 valeurs." });
s.addText([
  { text: fr("Le piège : "), options: { fontFace: P.texteGras } },
  { text: fr("remplacer « Casa » par « Casablanca » sans cocher « Mettre en correspondance tout le contenu de la cellule » transforme aussi Casablanca en « Casablancablanca ».") },
], { x: G.L, y: 5.6, w: 11.4, h: 0.9, fontFace: P.texte, fontSize: 20, color: K.encre, margin: 0, valign: "top", isTextBox: true });

// 4. Question à la salle (slide 24)
s = pres.addSlide({ masterName: "Enonce" });
s.addText(fr("Pourquoi ne pas tout mettre dans une seule grande table, comme dans Excel ?"), { placeholder: "title" });

// 5. Schéma de mécanisme (slide 29)
s = pres.addSlide({ masterName: "Contenu" });
s.addText(fr("Le filtre descend du référentiel vers les ventes, jamais l'inverse"), { placeholder: "title" });
function table(x, y, nom, champs, accent) {
  s.addText(nom, { x, y, w: 2.5, h: 0.5, fill: { color: accent ? K.petrole : K.encre }, color: K.papier, fontFace: P.texteGras, fontSize: 18, margin: [0, 0, 0, 9], valign: "middle", isTextBox: true });
  s.addText(champs.join("\n"), { x, y: y + 0.5, w: 2.5, h: 0.3 + 0.36 * champs.length, line: { color: accent ? K.petrole : K.encre, width: 1 }, fontFace: P.texte, fontSize: 16, color: K.encre, margin: [5, 7, 5, 9], valign: "top", isTextBox: true });
}
table(G.L, 2.3, "Produits", ["Réf produit", "Catégorie"], false);
table(4.4, 2.3, "Ventes", ["Réf produit", "Code magasin", "Quantité"], true);
table(8.15, 2.3, "Magasins", ["Code magasin", "Ville"], false);
fleche(s, 3.2, 3.15, 4.35, 3.15, K.petrole, { epaisseur: 3 });
note(s, fr("1"), 3.25, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, fr("*"), 4.1, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, fr("le filtre Catégorie passe"), G.L + 0.6, 4.35, 3.4, { couleur: K.petrole, taille: 18, gras: true });
fleche(s, 6.95, 3.15, 8.1, 3.15, K.rouge, { epaisseur: 3, tirets: true });
note(s, fr("*"), 7.0, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, fr("1"), 7.85, 2.8, 0.3, { couleur: K.gris, taille: 16 });
note(s, fr("il ne remonte pas vers Magasins"), 6.4, 4.35, 3.6, { taille: 18, gras: true });
s.addText([
  { text: fr("Résultat dans un tableau « Nb magasins par catégorie » : "), options: { fontFace: P.texteGras } },
  { text: fr("12 sur chaque ligne. Le compte se fait côté Ventes : DISTINCTCOUNT(Ventes[Code magasin]).") },
], { x: G.L, y: 5.3, w: 9.6, h: 0.9, fontFace: P.texte, fontSize: 20, color: K.encre, margin: 0, valign: "top", isTextBox: true });
s.addTable([
  [{ text: fr("Catégorie"), options: { bold: true } }, { text: fr("Magasins"), options: { bold: true, align: "right" } }],
  ["Boissons", { text: fr("12"), options: { align: "right", color: K.rouge } }],
  ["Épicerie", { text: fr("12"), options: { align: "right", color: K.rouge } }],
  ["Maison", { text: fr("12"), options: { align: "right", color: K.rouge } }],
  ["Textile", { text: fr("12"), options: { align: "right", color: K.rouge } }],
], { x: 10.55, y: 2.3, w: 2.15, colW: [1.15, 1.0], fontFace: P.texte, fontSize: 14, color: K.encre, border: { type: "solid", pt: 0.75, color: K.filet }, rowH: 0.36, margin: 0.05 });

// 6. À vous (slide 16)
s = pres.addSlide({ masterName: "A vous" });
s.addText(fr("Remettez l'export d'aplomb : lignes de titre, en-têtes, ligne TOTAL, dates"), { placeholder: "title" });
s.addText(fr("23 minutes, jusqu'à 10h50"), { x: G.L, y: 1.75, w: 6, h: 0.5, fontFace: P.titre, fontSize: 26, color: K.papier, margin: 0, isTextBox: true });
const pas = [
  "Requête Ventes : supprimez les 2 lignes du haut, puis Utiliser la première ligne pour les en-têtes.",
  "Filtrez N° ticket pour exclure (null) : la ligne vide et la ligne TOTAL disparaissent.",
  "Colonne Date : icône de type > Utilisation des paramètres régionaux > Date, Français (Maroc).",
  "Vérifiez en bas à gauche : 5 189 lignes, aucune cellule Error.",
];
pas.forEach((t, i) => {
  etape(s, i + 1, G.L, 2.65 + i * 0.85, K.papier);
  s.addText(t, { x: G.L + 0.7, y: 2.6 + i * 0.85, w: 7.6, h: 0.75, fontFace: P.texte, fontSize: 20, color: K.papier, margin: 0, valign: "top", isTextBox: true });
});
s.addText([
  { text: fr("Vous avez décroché ?"), options: { fontFace: P.texteGras, breakLine: true } },
  { text: fr("Ouvrez R1_import.pbix dans C:\\Formation_PBI\\rattrapage\\ et reprenez à l'étape 1.") },
], { x: 9.0, y: 2.6, w: 3.7, h: 1.6, fontFace: P.texte, fontSize: 18, color: K.surPetrole, margin: 0, valign: "top", isTextBox: true });
s.addText([
  { text: fr("Pour les profils techniques : "), options: { fontFace: P.texteGras } },
  { text: fr("ouvrez Affichage > Éditeur avancé et retrouvez chaque étape dans le code M.") },
], { x: 9.0, y: 4.5, w: 3.7, h: 1.4, fontFace: P.texte, fontSize: 18, color: K.surPetrole, margin: 0, valign: "top", isTextBox: true });

const sortie = path.resolve(__dirname, "echantillon.pptx");
pres.writeFile({ fileName: sortie }).then(async () => { await applyTheme(sortie, THEME); console.log(sortie); });
