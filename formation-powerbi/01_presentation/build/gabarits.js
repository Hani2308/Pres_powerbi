// Gabarits de la présentation « Initiation à Power BI ».
// Les choix (couleurs, polices, grille) sont expliqués dans ../../design.md.

const pptxgen = require("pptxgenjs");

const COULEURS = {
  encre: "222222",
  papier: "FFFFFF",
  gris: "5E5E5E",
  filet: "D6D6D2",
  fondCapture: "F1F1EE",
  petrole: "0B4F4A",
  petroleClair: "DCE8E6",
  rouge: "C8261D",
  surPetrole: "C9DEDA", // texte secondaire sur fond pétrole (contraste 6,7:1)
};

const THEME = {
  name: "Formation Power BI",
  headFontFace: "Source Serif 4 SemiBold",
  bodyFontFace: "Source Sans 3",
  colors: {
    dk1: COULEURS.encre, lt1: COULEURS.papier, dk2: COULEURS.petrole, lt2: COULEURS.fondCapture,
    accent1: COULEURS.petrole, accent2: COULEURS.rouge, accent3: COULEURS.gris,
    accent4: COULEURS.petroleClair, accent5: COULEURS.filet, accent6: "8A8A85",
    hlink: COULEURS.petrole, folHlink: COULEURS.gris,
  },
};

const POLICES = {
  titre: "Source Serif 4 SemiBold",
  serif: "Source Serif 4",
  texte: "Source Sans 3",
  texteGras: "Source Sans 3 SemiBold",
  code: "Source Code Pro",
};

// Grille : 13,333 x 7,5 pouces, marges 0,65 / 0,55, pied de page à 7,02.
const G = { L: 0.65, R: 13.333 - 0.65, W: 13.333 - 1.3, HAUT: 0.5, BAS_CONTENU: 6.75, PIED: 7.02 };

function pied(couleur) {
  return {
    text: {
      text: "Réalisé par Hani Sahir",
      options: { x: G.L, y: G.PIED, w: 5, h: 0.3, fontFace: POLICES.texte, fontSize: 11, color: couleur, margin: 0 },
    },
  };
}

function creerPresentation() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.author = "Hani Sahir";
  pres.title = "Initiation à Power BI";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };

  const numero = (couleur) => ({ x: G.R - 0.8, y: G.PIED, w: 0.8, h: 0.3, fontFace: POLICES.texte, fontSize: 11, color: couleur, align: "right", margin: 0 });

  pres.defineSlideMaster({
    title: "Couverture",
    background: { color: COULEURS.petrole },
    objects: [
      pied(COULEURS.surPetrole),
      { placeholder: { options: { name: "title", type: "title", x: G.L, y: 2.1, w: 10.8, h: 2.6, fontFace: POLICES.titre, fontSize: 44, color: COULEURS.papier, valign: "bottom", align: "left", margin: 0, lineSpacingMultiple: 1.05 }, text: "" } },
      { placeholder: { options: { name: "body", type: "body", x: G.L, y: 5.0, w: 10.8, h: 1.2, fontFace: POLICES.texte, fontSize: 20, color: COULEURS.surPetrole, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });

  pres.defineSlideMaster({
    title: "Contenu",
    background: { color: COULEURS.papier },
    slideNumber: numero(COULEURS.gris),
    objects: [
      pied(COULEURS.gris),
      { placeholder: { options: { name: "title", type: "title", x: G.L, y: G.HAUT, w: 11.2, h: 1.15, fontFace: POLICES.titre, fontSize: 30, color: COULEURS.encre, valign: "top", align: "left", margin: 0, lineSpacingMultiple: 1.0 }, text: "" } },
    ],
  });

  pres.defineSlideMaster({
    title: "Enonce",
    background: { color: COULEURS.papier },
    slideNumber: numero(COULEURS.gris),
    objects: [
      pied(COULEURS.gris),
      { placeholder: { options: { name: "title", type: "title", x: G.L, y: 1.7, w: 10.6, h: 3.2, fontFace: POLICES.titre, fontSize: 48, color: COULEURS.encre, valign: "bottom", align: "left", margin: 0, lineSpacingMultiple: 1.05 }, text: "" } },
    ],
  });

  pres.defineSlideMaster({
    title: "A vous",
    background: { color: COULEURS.petrole },
    slideNumber: numero(COULEURS.surPetrole),
    objects: [
      pied(COULEURS.surPetrole),
      { placeholder: { options: { name: "title", type: "title", x: G.L, y: G.HAUT, w: 11.2, h: 1.15, fontFace: POLICES.titre, fontSize: 30, color: COULEURS.papier, valign: "top", align: "left", margin: 0 }, text: "" } },
    ],
  });
  return pres;
}

// Emplacement de capture : à remplacer par la vraie capture (voir 05_captures/liste_captures.md).
function emplacementCapture(slide, { id, x, y, w, h, quoi }) {
  slide.addShape("rect", {
    x, y, w, h, fill: { color: COULEURS.fondCapture },
    line: { color: "8A8A85", width: 1.25, dashType: "dash" }, objectName: `Capture ${id}`,
  });
  slide.addText([
    { text: `Capture ${id}`, options: { fontFace: POLICES.titre, fontSize: 22, color: "6E6E69", breakLine: true } },
    { text: quoi, options: { fontFace: POLICES.texte, fontSize: 14, color: "6E6E69" } },
  ], { x: x + 0.25, y: y + h - 1.15, w: Math.min(w - 0.5, 6.2), h: 0.95, valign: "bottom", margin: 0, isTextBox: true, objectName: `Légende ${id}` });
}

// Annotations : rouge, trait 2,25 pt. Elles restent des formes PowerPoint, à ajuster sur la capture.
function cadre(slide, x, y, w, h) {
  slide.addShape("rect", { x, y, w, h, fill: { type: "none" }, line: { color: COULEURS.rouge, width: 2.5 }, objectName: "Annotation cadre" });
}

function etape(slide, n, x, y, couleur = COULEURS.rouge) {
  slide.addText(String(n), {
    shape: "ellipse", x, y, w: 0.46, h: 0.46, fill: { color: couleur }, color: couleur === COULEURS.papier ? COULEURS.petrole : COULEURS.papier,
    fontFace: POLICES.texteGras, fontSize: 17, align: "center", valign: "middle", margin: 0, isTextBox: true, objectName: `Étape ${n}`,
  });
}

function fleche(slide, x1, y1, x2, y2, couleur = COULEURS.rouge, opts = {}) {
  slide.addShape("line", {
    x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.max(Math.abs(x2 - x1), 0.001), h: Math.max(Math.abs(y2 - y1), 0.001),
    flipH: x2 < x1, flipV: y2 < y1,
    line: { color: couleur, width: opts.epaisseur || 2.25, endArrowType: "triangle", dashType: opts.tirets ? "dash" : "solid" },
    objectName: "Annotation flèche",
  });
}

function note(slide, texte, x, y, w, opts = {}) {
  slide.addText(texte, {
    x, y, w, h: opts.h || 0.5, fontFace: opts.gras ? POLICES.texteGras : POLICES.texte, fontSize: opts.taille || 18,
    color: opts.couleur || COULEURS.rouge, margin: 0, valign: "top", isTextBox: true, align: opts.align || "left",
  });
}

// Typographie française : insécable après « et avant », : ; ? !
function fr(t) {
  return t.replace(/'/g, "\u2019").replace(/« /g, "«\u00A0").replace(/ »/g, "\u00A0»").replace(/ :/g, "\u00A0:")
    .replace(/ ([;?!])/g, "\u202F$1").replace(/(\d) (\d{3})\b/g, "$1\u00A0$2").replace(/(\d) (MAD|min|%|lignes)/g, "$1\u00A0$2");
}

module.exports = { fr, COULEURS, THEME, POLICES, G, creerPresentation, emplacementCapture, cadre, etape, fleche, note };
