import type { MechanismDiagram } from "./diagram-types";

/** Diagrams for alkene/alkyne additions. */
export const ALKENE_DIAGRAMS: Record<string, MechanismDiagram> = {
  "alkene-hx": {
    title: { en: "HX addition — Markovnikov via carbocation", fa: "افزایش HX — مارکوفنیکوف از مسیر کاتیون" },
    footnote: {
      en: "The π bond grabs H⁺ first (slow); the more stable carbocation forms; X⁻ captures it.",
      fa: "اول پی π پروتون را می‌گیرد (کند)؛ کاتیون پایدارتر شکل می‌گیرد؛ X⁻ شکارش می‌کند.",
    },
    frames: [
      {
        caption: { en: "step 1 — protonation (slow)", fa: "مرحلهٔ ۱ — پروتون‌گیری (کند)" },
        atoms: [
          { id: "c1", el: "C", x: 200, y: 90, bare: true },
          { id: "c2", el: "C", x: 290, y: 90, bare: true },
          { id: "h1a", el: "H", x: 155, y: 125 },
          { id: "h1b", el: "H", x: 200, y: 40 },
          { id: "h2a", el: "H", x: 335, y: 125 },
          { id: "hbr", el: "H–Br", x: 350, y: 45 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
        ],
        curves: [
          { from: "bond:c1:c2", to: "hbr", bulge: -45 },
          { from: "bond:hbr:br", to: "br", bulge: -30 },
        ],
        labels: [{ x: 300, y: 20, text: "π attacks H⁺", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "the carbocation", fa: "کاتیون" },
        atoms: [
          { id: "c1", el: "C", x: 200, y: 90, bare: true },
          { id: "c2", el: "C⁺", x: 290, y: 90 },
          { id: "h1a", el: "H", x: 155, y: 125 },
          { id: "h1b", el: "H", x: 200, y: 40 },
          { id: "h2a", el: "H", x: 335, y: 125 },
          { id: "h2b", el: "H", x: 290, y: 40 },
          { id: "br", el: "Br⁻", x: 400, y: 125, lp: { n: 4, angles: [45, 135, 225, 315] } },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" },
          { a: "c2", b: "h2a" }, { a: "c2", b: "h2b" },
        ],
        labels: [{ x: 290, y: 30, text: "2° — hyperconjugation", color: "slate", size: 10, italic: true }],
      },
      {
        caption: { en: "step 2 — capture (fast)", fa: "مرحلهٔ ۲ — شکار (سریع)" },
        atoms: [
          { id: "c1", el: "C", x: 200, y: 90, bare: true },
          { id: "c2", el: "C", x: 290, y: 90, bare: true },
          { id: "h1a", el: "H", x: 155, y: 125 },
          { id: "h1b", el: "H", x: 200, y: 40 },
          { id: "h2a", el: "H", x: 335, y: 125 },
          { id: "h2b", el: "H", x: 290, y: 40 },
          { id: "br", el: "Br", x: 380, y: 90 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" },
          { a: "c2", b: "h2a" }, { a: "c2", b: "h2b" }, { a: "c2", b: "br" },
        ],
        curves: [{ from: "br", to: "c2", bulge: -40 }],
      },
    ],
    connectors: ["⇌", "→"],
  },

  "alkene-x2": {
    title: { en: "Bromination — the bromonium ion, anti addition", fa: "بروم‌زدایی — یون برومونیوم، افزایش پاد" },
    footnote: {
      en: "No free carbocation: the three-membered bromonium bridges both carbons; Br⁻ opens it from the back → anti.",
      fa: "کاتیون آزاد وجود ندارد: برومونیوم سه‌ضلعی روی دو کربن پل می‌زند؛ Br⁻ از پشت بازش می‌کند ← پاد.",
    },
    frames: [
      {
        caption: { en: "bromonium formation", fa: "ساخت برومونیوم" },
        atoms: [
          { id: "c1", el: "C", x: 210, y: 90, bare: true },
          { id: "c2", el: "C", x: 300, y: 90, bare: true },
          { id: "h1a", el: "H", x: 165, y: 125 },
          { id: "h1b", el: "H", x: 210, y: 42 },
          { id: "h2a", el: "H", x: 345, y: 125 },
          { id: "br1", el: "Br", x: 255, y: 40 },
          { id: "br2", el: "Br", x: 390, y: 55, lp: { n: 3, angles: [10, 100, 190] } },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "br1", b: "br2" },
          { a: "br1", b: "c1", dash: true }, { a: "br1", b: "c2", dash: true },
        ],
        curves: [
          { from: "bond:c1:c2", to: "br1", bulge: -35 },
          { from: "bond:br1:br2", to: "br2", bulge: -30 },
        ],
        labels: [{ x: 150, y: 30, text: "π polarizes Br₂", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "backside opening", fa: "باز شدن از پشت" },
        atoms: [
          { id: "c1", el: "C", x: 210, y: 90, bare: true },
          { id: "c2", el: "C", x: 300, y: 90, bare: true },
          { id: "h1a", el: "H", x: 165, y: 125 },
          { id: "h1b", el: "H", x: 210, y: 42 },
          { id: "h2a", el: "H", x: 345, y: 125 },
          { id: "br1", el: "Br", x: 255, y: 38 },
          { id: "br2", el: "Br⁻", x: 400, y: 130 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "br1", b: "c1" }, { a: "br1", b: "c2" },
        ],
        curves: [
          { from: "br2", to: "c2", bulge: 45 },
          { from: "bond:br1:c2", to: "br1", bulge: 30 },
        ],
        labels: [{ x: 385, y: 95, text: "SN2-like", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "anti dibromide", fa: "دی‌برومید پاد" },
        atoms: [
          { id: "c1", el: "C", x: 210, y: 90, bare: true },
          { id: "c2", el: "C", x: 300, y: 90, bare: true },
          { id: "h1a", el: "H", x: 165, y: 125 },
          { id: "h1b", el: "H", x: 210, y: 42 },
          { id: "h2a", el: "H", x: 345, y: 125 },
          { id: "br1", el: "Br", x: 255, y: 40 },
          { id: "br2", el: "Br", x: 350, y: 130 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "br1", b: "c1" }, { a: "br2", b: "c2" },
        ],
        labels: [{ x: 255, y: 160, text: "Br atoms anti (opposite faces)", color: "slate", size: 11 }],
      },
    ],
    connectors: ["⇌", "→"],
  },

  "alkene-hydration": {
    title: { en: "Acid-catalyzed hydration — catalyst cycle", fa: "آب‌دوستی کاتالیز اسیدی — چرخهٔ کاتالیزور" },
    footnote: {
      en: "H⁺ is consumed in step 1 and regenerated in step 3 — a true catalyst. Markovnikov throughout.",
      fa: "H⁺ در مرحلهٔ ۱ مصرف و در مرحلهٔ ۳ بازیابی می‌شود — کاتالیزور واقعی. سراسر مارکوفنیکوف.",
    },
    frames: [
      {
        caption: { en: "1 — protonation", fa: "۱ — پروتون‌گیری" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 90, bare: true },
          { id: "c2", el: "C", x: 280, y: 90, bare: true },
          { id: "h1a", el: "H", x: 145, y: 125 },
          { id: "h1b", el: "H", x: 190, y: 42 },
          { id: "h3o", el: "H₃O⁺", x: 340, y: 45 },
        ],
        bonds: [{ a: "c1", b: "c2", order: 2 }, { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }],
        curves: [{ from: "bond:c1:c2", to: "h3o", bulge: -40 }],
      },
      {
        caption: { en: "2 — water attacks", fa: "۲ — آب حمله می‌کند" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 90, bare: true },
          { id: "c2", el: "C⁺", x: 260, y: 90 },
          { id: "h1a", el: "H", x: 125, y: 125 },
          { id: "h1b", el: "H", x: 170, y: 42 },
          { id: "h2a", el: "H", x: 305, y: 125 },
          { id: "h2b", el: "H", x: 260, y: 42 },
          { id: "o", el: "O", x: 390, y: 120, lp: { n: 2, angles: [20, 110] } },
          { id: "hw1", el: "H", x: 430, y: 90 },
          { id: "hw2", el: "H", x: 425, y: 155 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" },
          { a: "c2", b: "h2a" }, { a: "c2", b: "h2b" },
          { a: "o", b: "hw1" }, { a: "o", b: "hw2" }, { a: "o", b: "c2", dash: true },
        ],
        curves: [{ from: "o", to: "c2", bulge: -40 }],
      },
      {
        caption: { en: "3 — deprotonation: H⁺ back", fa: "۳ — جدا شدن پروتون: H⁺ برمی‌گردد" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 90, bare: true },
          { id: "c2", el: "C", x: 260, y: 90, bare: true },
          { id: "h1a", el: "H", x: 125, y: 125 },
          { id: "h1b", el: "H", x: 170, y: 42 },
          { id: "h2a", el: "H", x: 305, y: 125 },
          { id: "oh", el: "OH", x: 310, y: 50 },
          { id: "h", el: "H", x: 355, y: 50 },
          { id: "w", el: "H₂O", x: 410, y: 110 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "c2", b: "oh" }, { a: "oh", b: "h" },
        ],
        curves: [{ from: "bond:oh:h", to: "w", bulge: -35 }],
        labels: [{ x: 330, y: 22, text: "catalyst regenerated", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["⇌", "⇌"],
  },

  "alkene-kmn04-syn": {
    title: { en: "Syn dihydroxylation — cyclic manganate ester", fa: "دی‌هیدروکسیل‌کردن سین — استر حلقوی منگنات" },
    footnote: {
      en: "Both OH land on the SAME face via the 5-membered ring; Mn(VII) → MnO₂ (brown). Baeyer test positive.",
      fa: "هر دو OH به یک روی می‌نشینند از راه حلقهٔ ۵ضلعی؛ Mn(VII) ← MnO₂ (قهوه‌ای). آزمون بایر مثبت.",
    },
    frames: [
      {
        caption: { en: "manganate ester", fa: "استر منگنات" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 95, bare: true },
          { id: "c2", el: "C", x: 290, y: 95, bare: true },
          { id: "mn", el: "Mn", x: 240, y: 35 },
          { id: "o1", el: "O", x: 195, y: 60 },
          { id: "o2", el: "O", x: 285, y: 60 },
          { id: "oa", el: "O⁻", x: 165, y: 20 },
          { id: "ob", el: "O⁻", x: 315, y: 20 },
          { id: "h1", el: "H", x: 145, y: 130 },
          { id: "h2", el: "H", x: 335, y: 130 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "o1" }, { a: "c2", b: "o2" },
          { a: "o1", b: "mn" }, { a: "o2", b: "mn" },
          { a: "mn", b: "oa", dash: true }, { a: "mn", b: "ob", dash: true },
          { a: "c1", b: "h1" }, { a: "c2", b: "h2" },
        ],
        labels: [{ x: 240, y: 155, text: "5-membered ring — syn delivery", color: "slate", size: 11, italic: true }],
      },
      {
        caption: { en: "hydrolysis + reduction", fa: "هیدرولیز و کاهش" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 95, bare: true },
          { id: "c2", el: "C", x: 290, y: 95, bare: true },
          { id: "o1", el: "OH", x: 185, y: 45 },
          { id: "o2", el: "OH", x: 295, y: 45 },
          { id: "h1", el: "H", x: 145, y: 130 },
          { id: "h2", el: "H", x: 335, y: 130 },
          { id: "mno2", el: "MnO₂", x: 400, y: 60 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "o1" }, { a: "c2", b: "o2" },
          { a: "c1", b: "h1" }, { a: "c2", b: "h2" },
        ],
        curves: [{ from: "o2", to: "mno2", bulge: -40 }],
        labels: [{ x: 400, y: 100, text: "brown ppt", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["→"],
  },

  "alkene-ozonolysis": {
    title: { en: "Ozonolysis — molozonide → ozonide → carbonyls", fa: "اوزونولیز — مولواوزونید ← اوزونید ← کربونیل‌ها" },
    footnote: {
      en: "The C=C is fully cut: each alkene carbon becomes a C=O. Structure-proof by fragments.",
      fa: "پی C=C کاملاً بریده می‌شود: هر کربن آلکنی به C=O تبدیل می‌شود. تعیین ساختار از تکه‌ها.",
    },
    frames: [
      {
        caption: { en: "1,3-dipolar cycloaddition", fa: "سیکلودبیست ۱٬۳-دوقطبی" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 95, bare: true },
          { id: "c2", el: "C", x: 280, y: 95, bare: true },
          { id: "h1", el: "H", x: 135, y: 130 },
          { id: "h2", el: "H", x: 325, y: 130 },
          { id: "o1", el: "O", x: 230, y: 35 },
          { id: "o2", el: "O", x: 185, y: 55 },
          { id: "o3", el: "O", x: 275, y: 55 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1" }, { a: "c2", b: "h2" },
          { a: "c1", b: "o2", dash: true }, { a: "c2", b: "o3", dash: true },
          { a: "o2", b: "o1" }, { a: "o1", b: "o3" },
        ],
        labels: [{ x: 230, y: 155, text: "molozonide (unstable)", color: "slate", size: 11, italic: true }],
      },
      {
        caption: { en: "ozonide", fa: "اوزونید" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 95, bare: true },
          { id: "c2", el: "C", x: 280, y: 95, bare: true },
          { id: "h1", el: "H", x: 135, y: 130 },
          { id: "h2", el: "H", x: 325, y: 130 },
          { id: "o1", el: "O", x: 230, y: 45 },
          { id: "o2", el: "O", x: 185, y: 55 },
          { id: "o3", el: "O", x: 275, y: 55 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1" }, { a: "c2", b: "h2" },
          { a: "c1", b: "o2" }, { a: "c2", b: "o3" },
          { a: "o2", b: "o1" }, { a: "o1", b: "o3" },
        ],
      },
      {
        caption: { en: "reductive workup — two carbonyls", fa: "کارِ کاهشی — دو کربونیل" },
        atoms: [
          { id: "c1", el: "C", x: 150, y: 95 },
          { id: "o1", el: "O", x: 150, y: 40, dim: true },
          { id: "h1", el: "H", x: 95, y: 125 },
          { id: "c2", el: "C", x: 330, y: 95 },
          { id: "o2", el: "O", x: 330, y: 40, dim: true },
          { id: "h2", el: "H", x: 385, y: 125 },
        ],
        bonds: [
          { a: "c1", b: "o1", order: 2 }, { a: "c1", b: "h1" },
          { a: "c2", b: "o2", order: 2 }, { a: "c2", b: "h2" },
        ],
        condition: { x: 240, y: 70, text: "Zn/H₂O" },
        labels: [{ x: 240, y: 130, text: "2 HCHO from ethene", color: "slate", size: 11 }],
      },
    ],
    connectors: ["→", "→"],
  },

  "alkene-hydrogenation": {
    title: { en: "Catalytic hydrogenation — on the metal surface", fa: "هیدروژن‌دار کردن کاتالیزی — روی سطح فلز" },
    footnote: {
      en: "Both reactants adsorb; surface hydrides deliver syn; the alkane desorbs. Heterogeneous catalysis.",
      fa: "هر دو واکنش‌دهنده جذب سطحی می‌شوند؛ هیدریدهای سطحی سین تحویل می‌دهند؛ آلکان جدا می‌شود. کاتالیز ناهمگن.",
    },
    frames: [
      {
        caption: { en: "adsorption", fa: "جذب سطحی" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 70, bare: true },
          { id: "c2", el: "C", x: 290, y: 70, bare: true },
          { id: "h1", el: "H", x: 145, y: 105 },
          { id: "h2", el: "H", x: 335, y: 105 },
          { id: "m1", el: "M", x: 170, y: 150 },
          { id: "m2", el: "M", x: 240, y: 150 },
          { id: "m3", el: "M", x: 310, y: 150 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "m1", dash: true }, { a: "c1", b: "m2", dash: true },
          { a: "c2", b: "m2", dash: true }, { a: "c2", b: "m3", dash: true },
        ],
        condition: { x: 400, y: 60, text: "H₂" },
        labels: [{ x: 240, y: 30, text: "π + H₂ both held on M", color: "slate", size: 11, italic: true }],
      },
      {
        caption: { en: "syn delivery", fa: "تحویل سین" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 85, bare: true },
          { id: "c2", el: "C", x: 290, y: 85, bare: true },
          { id: "ha", el: "H", x: 210, y: 45 },
          { id: "hb", el: "H", x: 270, y: 45 },
          { id: "m1", el: "M", x: 170, y: 150 },
          { id: "m2", el: "M", x: 240, y: 150 },
          { id: "m3", el: "M", x: 310, y: 150 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "ha" }, { a: "c2", b: "hb" },
          { a: "c1", b: "m1", dash: true }, { a: "c2", b: "m3", dash: true },
        ],
        labels: [{ x: 240, y: 22, text: "same face = syn", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "desorption", fa: "رهایی" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 85, bare: true },
          { id: "c2", el: "C", x: 290, y: 85, bare: true },
          { id: "ha", el: "H", x: 210, y: 45 },
          { id: "hb", el: "H", x: 270, y: 45 },
          { id: "h1", el: "H", x: 145, y: 120 },
          { id: "h2", el: "H", x: 335, y: 120 },
        ],
        bonds: [
          { a: "c1", b: "c2" }, { a: "c1", b: "ha" }, { a: "c2", b: "hb" },
          { a: "c1", b: "h1" }, { a: "c2", b: "h2" },
        ],
        labels: [{ x: 240, y: 155, text: "alkane released — catalyst unchanged", color: "slate", size: 11 }],
      },
    ],
    connectors: ["→", "→"],
  },

  "alkene-radical-hbr": {
    title: { en: "Peroxide effect — anti-Markovnikov radical chain", fa: "اثر پراکسید — زنجیرهٔ رادیکالی پاد-مارکوفنیکوف" },
    footnote: {
      en: "Br· adds first, building the MORE stable carbon radical — so Br ends up on the less substituted carbon.",
      fa: "اول Br· اضافه می‌شود و رادیکال کربنی پایدارتر می‌سازد — پس بروم روی کربن کم‌جانشین می‌ماند.",
    },
    frames: [
      {
        caption: { en: "Br· adds to the alkene", fa: "Br· به آلکن اضافه می‌شود" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 90, bare: true },
          { id: "c2", el: "C·", x: 270, y: 90 },
          { id: "h1a", el: "H", x: 135, y: 125 },
          { id: "h1b", el: "H", x: 180, y: 42 },
          { id: "h2a", el: "H", x: 315, y: 125 },
          { id: "br", el: "Br·", x: 345, y: 45 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "c2", b: "br", dash: true },
        ],
        curves: [
          { from: "br", to: "bond:c1:c2", fish: true, bulge: -40 },
          { from: "bond:c1:c2", to: "c2", fish: true, bulge: -35 },
        ],
        labels: [{ x: 200, y: 22, text: "2° radical preferred", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "H abstraction from HBr", fa: "ربودن H از HBr" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 90, bare: true },
          { id: "c2", el: "C", x: 270, y: 90, bare: true },
          { id: "h1a", el: "H", x: 135, y: 125 },
          { id: "h1b", el: "H", x: 180, y: 42 },
          { id: "h2a", el: "H", x: 315, y: 125 },
          { id: "br", el: "Br", x: 315, y: 50 },
          { id: "hbr", el: "H–Br", x: 400, y: 100 },
          { id: "br2", el: "Br·", x: 440, y: 45 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" },
          { a: "c2", b: "h2a" }, { a: "c2", b: "br" },
        ],
        curves: [
          { from: "c2", to: "hbr", fish: true, bulge: -40 },
          { from: "bond:hbr:br", to: "br2", fish: true, bulge: -30 },
        ],
        labels: [{ x: 300, y: 155, text: "chain continues — Br· regenerated", color: "slate", size: 11 }],
      },
    ],
    connectors: ["→"],
  },

  "alkene-hydroboration": {
    title: { en: "Hydroboration — concerted four-center TS", fa: "هیدروبوراسیون — حالت گذار چهارمرکزی هم‌زمان" },
    footnote: {
      en: "B and H deliver together, syn, no carbocation. B takes the LESS substituted carbon; oxidation swaps B→OH.",
      fa: "بور و هیدروژن هم‌زمان و سین می‌نشینند، بدون کاتیون. بور روی کربن کم‌جانشین‌تر؛ اکسایش B را به OH تبدیل می‌کند.",
    },
    frames: [
      {
        caption: { en: "the four-center transition state", fa: "حالت گذار چهارمرکزی" },
        atoms: [
          { id: "b", el: "B", x: 330, y: 55, dim: true },
          { id: "hb", el: "H", x: 260, y: 45, dim: true },
          { id: "c1", el: "C", x: 180, y: 95, bare: true },
          { id: "c2", el: "C", x: 265, y: 95, bare: true },
          { id: "h1a", el: "H", x: 135, y: 130 },
          { id: "h1b", el: "H", x: 180, y: 42 },
          { id: "h2a", el: "H", x: 310, y: 130 },
          { id: "r", el: "R", x: 375, y: 90 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "b", b: "r" },
          { a: "hb", b: "c1", dash: true }, { a: "b", b: "c2", dash: true },
          { a: "hb", b: "b" },
        ],
        curves: [
          { from: "bond:hb:b", to: "bond:hb:c1", fish: false, bulge: -30 },
          { from: "bond:c1:c2", to: "bond:b:c2", bulge: -35 },
        ],
        labels: [{ x: 250, y: 160, text: "B → less substituted C (sterics)", color: "slate", size: 11, italic: true }],
      },
      {
        caption: { en: "organoborane → oxidation", fa: "بورآلکان ← اکسایش" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 95, bare: true },
          { id: "c2", el: "C", x: 265, y: 95, bare: true },
          { id: "h1a", el: "H", x: 125, y: 130 },
          { id: "h1b", el: "H", x: 170, y: 42 },
          { id: "h2a", el: "H", x: 310, y: 130 },
          { id: "h2b", el: "H", x: 215, y: 45 },
          { id: "b", el: "BH₂", x: 310, y: 50 },
        ],
        bonds: [
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "h1b" }, { a: "c2", b: "h2a" },
          { a: "c1", b: "h2b" }, { a: "c2", b: "b" },
        ],
        condition: { x: 420, y: 70, text: "H₂O₂/OH⁻" },
        labels: [{ x: 420, y: 110, text: "→ anti-Markovnikov OH", color: "pink", size: 11 }],
      },
    ],
    connectors: ["→"],
  },

  "alkyne-chemistry": {
    title: { en: "Alkyne additions — two equivalents, then control", fa: "افزایش‌های آلکین — دو هم‌ارز، بعد کنترل" },
    footnote: {
      en: "Full hydrogenation → alkane; Lindlar stops at cis-alkene; Na/NH₃ gives trans; terminal ≡C–H becomes an acetylide nucleophile.",
      fa: "هیدروژن‌دار کردن کامل ← آلکان؛ لیندلر در سیس-آلکن می‌ایستد؛ Na/NH₃ ترانس می‌دهد؛ ≡C–H انتهایی هسته‌خواه استیلید می‌شود.",
    },
    frames: [
      {
        caption: { en: "the triple bond takes 2 HX", fa: "پی سه‌گانه ۲ HX می‌گیرد" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 85, bare: true },
          { id: "c2", el: "C", x: 280, y: 85, bare: true },
          { id: "br1", el: "Br", x: 145, y: 40 },
          { id: "br2", el: "Br", x: 145, y: 130 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 3 },
          { a: "c1", b: "br1", dash: true }, { a: "c1", b: "br2", dash: true },
        ],
        curves: [{ from: "bond:c1:c2", to: "br1", bulge: -35 }],
        condition: { x: 240, y: 150, text: "2 HBr" },
        labels: [{ x: 320, y: 85, text: "→ geminal dihalide", color: "slate", size: 11 }],
      },
      {
        caption: { en: "Lindlar stops at cis", fa: "لیندلر در سیس می‌ایستد" },
        atoms: [
          { id: "c1", el: "C", x: 190, y: 85, bare: true },
          { id: "c2", el: "C", x: 280, y: 85, bare: true },
          { id: "ha", el: "H", x: 210, y: 45 },
          { id: "hb", el: "H", x: 260, y: 45 },
          { id: "r1", el: "R", x: 145, y: 120 },
          { id: "r2", el: "R'", x: 325, y: 120 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 },
          { a: "c1", b: "ha" }, { a: "c2", b: "hb" }, { a: "c1", b: "r1" }, { a: "c2", b: "r2" },
        ],
        condition: { x: 240, y: 155, text: "Lindlar Pd" },
        labels: [{ x: 235, y: 25, text: "cis (syn)", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "acetylide formation", fa: "ساخت استیلید" },
        atoms: [
          { id: "c1", el: "C", x: 200, y: 85, bare: true },
          { id: "c2", el: "C⁻", x: 290, y: 85, lp: { n: 1, angles: [180] } },
          { id: "r", el: "R", x: 145, y: 85 },
          { id: "h", el: "H", x: 335, y: 85 },
        ],
        bonds: [{ a: "c1", b: "c2", order: 3 }, { a: "c1", b: "r" }, { a: "c2", b: "h", dash: true }],
        curves: [
          { from: "bond:c2:h", to: "c2", bulge: -30 },
        ],
        condition: { x: 240, y: 150, text: "NaNH₂" },
        labels: [{ x: 240, y: 30, text: "pKa 25 — strong base needed", color: "slate", size: 11, italic: true }],
      },
    ],
    connectors: ["→", "→"],
  },
};
