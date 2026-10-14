// Charte commune aux documents Word (voir ../design.md) et petites aides de mise en page.
const fs = require("fs");
const path = require("path");
const {
  AlignmentType, BorderStyle, Document, Footer, HeadingLevel, LevelFormat, PageNumber, Packer, Paragraph,
  ShadingType, Table, TableCell, TableRow, TabStopType, TextRun, WidthType, PageBreak,
} = require("docx");

const K = { encre: "222222", gris: "5E5E5E", petrole: "0B4F4A", rouge: "C8261D", fond: "F1F1EE", filet: "D6D6D2", pointille: "8A8A85" };
const F = { titre: "Source Serif 4 SemiBold", texte: "Source Sans 3", gras: "Source Sans 3 SemiBold", code: "Source Code Pro" };
const LARGEUR = 9638; // A4 moins 2 x 2 cm de marge, en DXA

// Typographie française : insécables et apostrophe courbe.
function fr(t) {
  return String(t).replace(/'/g, "’").replace(/« /g, "« ").replace(/ »/g, " »").replace(/ :/g, " :")
    .replace(/ ([;?!])/g, " $1").replace(/(\d) (\d{3})\b/g, "$1 $2").replace(/(\d) (MAD|min|%|lignes)/g, "$1 $2");
}

// Un texte peut contenir **gras** ; on le découpe en runs.
function runs(t, opts = {}) {
  return fr(t).split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((morceau) => {
    const gras = morceau.startsWith("**");
    return new TextRun({ text: gras ? morceau.slice(2, -2) : morceau, font: gras ? F.gras : (opts.font || F.texte), color: opts.color, size: opts.size, italics: opts.italics });
  });
}

const p = (t, opts = {}) => new Paragraph({ children: runs(t, opts), spacing: { after: opts.after ?? 120 }, alignment: opts.align, keepNext: opts.keepNext });
const h1 = (t, saut = true) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(fr(t))], pageBreakBefore: saut });
const h2 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(fr(t))], keepNext: true });
const h3 = (t) => new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(fr(t))], keepNext: true });
const puce = (t, niveau = 0) => new Paragraph({ children: runs(t), numbering: { reference: "puces", level: niveau }, spacing: { after: 60 } });
let instanceListe = 0;
function etapes(liste) {
  instanceListe += 1;
  return liste.map((t) => new Paragraph({ children: runs(t), numbering: { reference: "etapes", level: 0, instance: instanceListe }, spacing: { after: 80 } }));
}
const saut = () => new Paragraph({ children: [new PageBreak()] });

const bordure = (couleur, style = BorderStyle.SINGLE, taille = 6) => ({ style, size: taille, color: couleur });
const bordures = (b) => ({ top: b, bottom: b, left: b, right: b });

function encadre(enfants, opts = {}) {
  return new Table({
    width: { size: LARGEUR, type: WidthType.DXA }, columnWidths: [LARGEUR],
    rows: [new TableRow({ cantSplit: true, children: [new TableCell({
      width: { size: LARGEUR, type: WidthType.DXA },
      shading: { type: ShadingType.CLEAR, color: "auto", fill: opts.fond || K.fond },
      borders: bordures(opts.bordure || bordure(opts.fond || K.fond)),
      margins: { top: 140, bottom: 140, left: 200, right: 200 },
      children: enfants,
    })] })],
  });
}

function capture(id, quoi) {
  return [
    new Paragraph({ children: [], spacing: { after: 60 } }),
    new Table({
      width: { size: LARGEUR, type: WidthType.DXA }, columnWidths: [LARGEUR],
      rows: [new TableRow({ height: { value: 2200, rule: "atLeast" }, children: [new TableCell({
        width: { size: LARGEUR, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, color: "auto", fill: K.fond },
        borders: bordures(bordure(K.pointille, BorderStyle.DASHED, 8)),
        margins: { top: 160, bottom: 160, left: 220, right: 220 },
        verticalAlign: "bottom",
        children: [
          new Paragraph({ children: [new TextRun({ text: `Capture ${id}`, font: F.titre, size: 26, color: "6E6E69" })] }),
          new Paragraph({ children: runs(quoi, { color: "6E6E69", size: 19 }) }),
        ],
      })] })],
    }),
    new Paragraph({ children: [], spacing: { after: 120 } }),
  ];
}

function code(lignes) {
  return encadre(lignes.map((l) => new Paragraph({ children: [new TextRun({ text: l || " ", font: F.code, size: 20, color: K.encre })], spacing: { after: 0 } })));
}

function tableau(entetes, lignes, largeurs, opts = {}) {
  const total = largeurs.reduce((a, b) => a + b, 0);
  const cell = (t, gras, i, fond) => new TableCell({
    width: { size: largeurs[i], type: WidthType.DXA },
    shading: fond ? { type: ShadingType.CLEAR, color: "auto", fill: fond } : undefined,
    borders: bordures(bordure(K.filet)), margins: { top: 60, bottom: 60, left: 100, right: 100 },
    children: [new Paragraph({ children: runs(String(t), { font: gras ? F.gras : F.texte, size: opts.taille || 19 }), alignment: (opts.droite || []).includes(i) ? AlignmentType.RIGHT : AlignmentType.LEFT, spacing: { after: 0 } })],
  });
  return new Table({
    width: { size: total, type: WidthType.DXA }, columnWidths: largeurs,
    rows: [
      new TableRow({ tableHeader: true, children: entetes.map((t, i) => cell(t, true, i, K.fond)) }),
      ...lignes.map((l) => new TableRow({ cantSplit: true, children: l.map((t, i) => cell(t, false, i)) })),
    ],
  });
}

function documentAvecCharte(enfants, titre) {
  return new Document({
    creator: "Hani Sahir", title: titre,
    styles: {
      default: { document: { run: { font: F.texte, size: 22, color: K.encre }, paragraph: { spacing: { line: 288 } } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: F.titre, size: 36, color: K.encre }, paragraph: { spacing: { before: 0, after: 240 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: F.titre, size: 27, color: K.petrole }, paragraph: { spacing: { before: 320, after: 120 }, outlineLevel: 1 } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { font: F.gras, size: 23, color: K.encre }, paragraph: { spacing: { before: 200, after: 80 }, outlineLevel: 2 } },
      ],
    },
    numbering: { config: [
      { reference: "puces", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 260 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 800, hanging: 260 } } } },
      ] },
      { reference: "etapes", levels: [
        { level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { run: { font: F.gras, color: K.rouge }, paragraph: { indent: { left: 440, hanging: 340 } } } },
      ] },
    ] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1134, bottom: 1134, left: 1134, right: 1134 } } },
      footers: { default: new Footer({ children: [new Paragraph({
        tabStops: [{ type: TabStopType.RIGHT, position: LARGEUR }],
        children: [new TextRun({ text: "Réalisé par Hani Sahir", size: 17, color: K.gris }), new TextRun({ children: ["\t", PageNumber.CURRENT], size: 17, color: K.gris })],
      })] }) },
      children: enfants,
    }],
  });
}

async function ecrire(doc, fichier) {
  fs.mkdirSync(path.dirname(fichier), { recursive: true });
  fs.writeFileSync(fichier, await Packer.toBuffer(doc));
  console.log(fichier);
}

module.exports = { K, F, LARGEUR, fr, runs, p, h1, h2, h3, puce, etapes, saut, encadre, capture, code, tableau, documentAvecCharte, ecrire, TextRun, Paragraph, AlignmentType };
