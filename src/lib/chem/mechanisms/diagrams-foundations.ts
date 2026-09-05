import type { MechanismDiagram } from "./diagram-types";

/** Diagrams for foundations (SN2, SN1, E2, radical, Grignard). */
export const FOUNDATION_DIAGRAMS: Record<string, MechanismDiagram> = {
  "sn2": {
    title: { en: "SN2 — backside attack, one concerted step", fa: "SN2 — حمله از پشت، یک گام هم‌زمان" },
    footnote: {
      en: "The nucleophile attacks 180° from the leaving group; Walden inversion at a stereocenter.",
      fa: "هسته‌خواه ۱۸۰ درجه مخالف گروه خارج‌شونده حمله می‌کند؛ وارونگی والدن روی مرکز استری.",
    },
    frames: [
      {
        atoms: [
          { id: "nu", el: "HO⁻", x: 70, y: 85 },
          { id: "c", el: "C", x: 250, y: 85, bare: true },
          { id: "h1", el: "H", x: 250, y: 45 },
          { id: "h2", el: "H", x: 215, y: 118 },
          { id: "h3", el: "H", x: 285, y: 118 },
          { id: "br", el: "Br", x: 395, y: 85, lp: { n: 4, angles: [45, 135, 225, 315] } },
        ],
        bonds: [
          { a: "c", b: "h1" }, { a: "c", b: "h2" }, { a: "c", b: "h3" }, { a: "c", b: "br" },
          { a: "nu", b: "c", dash: true },
        ],
        curves: [
          { from: "nu", to: "bond:c:br", bulge: -40 },
          { from: "bond:c:br", to: "br", bulge: -40 },
        ],
        labels: [
          { x: 150, y: 55, text: "backside attack", color: "pink", size: 11, italic: true },
          { x: 405, y: 40, text: "δ−", color: "pink", size: 11 },
        ],
      },
      {
        caption: { en: "transition state", fa: "حالت گذار" },
        atoms: [
          { id: "nu", el: "HO", x: 105, y: 85, charge: "δ-" },
          { id: "c", el: "C", x: 250, y: 85, bare: true, charge: "δ+" },
          { id: "h1", el: "H", x: 250, y: 42 },
          { id: "h2", el: "H", x: 205, y: 122 },
          { id: "h3", el: "H", x: 295, y: 122 },
          { id: "br", el: "Br", x: 400, y: 85, charge: "δ-" },
        ],
        bonds: [
          { a: "c", b: "h1" }, { a: "c", b: "h2" }, { a: "c", b: "h3" },
          { a: "nu", b: "c", dash: true }, { a: "c", b: "br", dash: true },
        ],
        labels: [{ x: 253, y: 150, text: "[ ‡ ]", color: "slate", size: 12 }],
      },
      {
        caption: { en: "product (inverted)", fa: "محصول (وارونده)" },
        atoms: [
          { id: "nu", el: "HO", x: 120, y: 85 },
          { id: "c", el: "C", x: 250, y: 85, bare: true },
          { id: "h1", el: "H", x: 250, y: 45 },
          { id: "h2", el: "H", x: 285, y: 118 },
          { id: "h3", el: "H", x: 215, y: 118 },
          { id: "br", el: "Br⁻", x: 400, y: 85, lp: { n: 4, angles: [45, 135, 225, 315] } },
        ],
        bonds: [{ a: "c", b: "h1" }, { a: "c", b: "h2" }, { a: "c", b: "h3" }, { a: "nu", b: "c" }],
      },
    ],
    connectors: ["→", "→"],
  },

  "sn1": {
    title: { en: "SN1 — ionization, then capture", fa: "SN1 — یونش، سپس شکار" },
    footnote: {
      en: "Step 1 is slow and rate-determining: C–X breaks on its own. The planar carbocation is attacked from either face → racemization.",
      fa: "مرحلهٔ ۱ کند و تعیین‌کنندهٔ سرعت است: پیوند C–X خودش می‌شکند. کاتیون تخت از هر دو سو حمله می‌شود ← راکی‌سازی.",
    },
    frames: [
      {
        caption: { en: "tert-butyl bromide", fa: "tert-بوتیل بروماید" },
        atoms: [
          { id: "c", el: "C", x: 250, y: 85, bare: true },
          { id: "m1", el: "CH₃", x: 185, y: 55 },
          { id: "m2", el: "CH₃", x: 315, y: 55 },
          { id: "m3", el: "CH₃", x: 250, y: 130 },
          { id: "br", el: "Br", x: 330, y: 112, lp: { n: 3, angles: [20, 110, 200] } },
        ],
        bonds: [{ a: "c", b: "m1" }, { a: "c", b: "m2" }, { a: "c", b: "m3" }, { a: "c", b: "br" }],
        curves: [{ from: "bond:c:br", to: "br", bulge: 35 }],
        labels: [{ x: 250, y: 25, text: "slow", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "planar carbocation", fa: "کاتیون تخت" },
        atoms: [
          { id: "c", el: "C⁺", x: 250, y: 80 },
          { id: "m1", el: "CH₃", x: 180, y: 45 },
          { id: "m2", el: "CH₃", x: 320, y: 45 },
          { id: "m3", el: "CH₃", x: 250, y: 128 },
        ],
        bonds: [{ a: "c", b: "m1" }, { a: "c", b: "m2" }, { a: "c", b: "m3" }],
        labels: [
          { x: 250, y: 25, text: "sp² — trigonal planar", color: "slate", size: 11, italic: true },
        ],
      },
      {
        caption: { en: "captured by water", fa: "شکار توسط آب" },
        atoms: [
          { id: "o", el: "O", x: 130, y: 80, lp: { n: 2, angles: [150, 250] } },
          { id: "h1", el: "H", x: 95, y: 55 },
          { id: "h2", el: "H", x: 95, y: 108 },
          { id: "c", el: "C", x: 280, y: 80, bare: true },
          { id: "m1", el: "CH₃", x: 280, y: 35 },
          { id: "m2", el: "CH₃", x: 350, y: 110 },
          { id: "m3", el: "CH₃", x: 210, y: 110 },
        ],
        bonds: [
          { a: "o", b: "h1" }, { a: "o", b: "h2" },
          { a: "c", b: "m1" }, { a: "c", b: "m2" }, { a: "c", b: "m3" },
          { a: "o", b: "c", dash: true },
        ],
        curves: [{ from: "o", to: "c", bulge: -45 }],
        labels: [{ x: 205, y: 45, text: "fast", color: "pink", size: 11, italic: true }],
      },
    ],
    connectors: ["→slow", "→"],
  },

  "e2-e1": {
    title: { en: "E2 — anti-periplanar elimination", fa: "E2 — حذف ضد-پری‌پلانار" },
    footnote: {
      en: "Base, β-H, both carbons and the leaving group are coplanar; everything happens in one step. Zaitsev's alkene dominates.",
      fa: "باز، β-H، هر دو کربن و گروه خارج‌شونده هم‌صفحه‌اند؛ همه‌چیز در یک گام. آلکن زایتسف غالب است.",
    },
    frames: [
      {
        atoms: [
          { id: "b", el: "B⁻", x: 60, y: 40 },
          { id: "hb", el: "H", x: 150, y: 60 },
          { id: "c1", el: "C", x: 220, y: 90, bare: true },
          { id: "c2", el: "C", x: 310, y: 90, bare: true },
          { id: "h1a", el: "H", x: 220, y: 135 },
          { id: "r1", el: "R", x: 175, y: 125 },
          { id: "r2", el: "R'", x: 355, y: 125 },
          { id: "x", el: "X", x: 310, y: 45, lp: { n: 3, angles: [0, 90, 270] } },
        ],
        bonds: [
          { a: "b", b: "hb", dash: true },
          { a: "hb", b: "c1" },
          { a: "c1", b: "c2" },
          { a: "c1", b: "h1a" }, { a: "c1", b: "r1" },
          { a: "c2", b: "r2" }, { a: "c2", b: "x" },
        ],
        curves: [
          { from: "b", to: "hb", bulge: -25 },
          { from: "bond:hb:c1", to: "bond:c1:c2", bulge: -30 },
          { from: "bond:c1:c2", to: "bond:c2:x", bulge: -30 },
          { from: "bond:c2:x", to: "x", bulge: -25 },
        ],
        labels: [
          { x: 265, y: 160, text: "anti-periplanar", color: "slate", size: 11, italic: true },
          { x: 265, y: 20, text: "one concerted step", color: "pink", size: 11, italic: true },
        ],
      },
      {
        caption: { en: "the alkene (Zaitsev)", fa: "آلکن (زایتسف)" },
        atoms: [
          { id: "c1", el: "C", x: 220, y: 85, bare: true },
          { id: "c2", el: "C", x: 310, y: 85, bare: true },
          { id: "hb", el: "H", x: 175, y: 50 },
          { id: "h2", el: "H", x: 355, y: 50 },
          { id: "r1", el: "R", x: 175, y: 120 },
          { id: "r2", el: "R'", x: 355, y: 120 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 },
          { a: "c1", b: "hb" }, { a: "c1", b: "r1" },
          { a: "c2", b: "h2" }, { a: "c2", b: "r2" },
        ],
        labels: [{ x: 265, y: 155, text: "C=C formed, B–H and X⁻ gone", color: "slate", size: 11 }],
      },
    ],
    connectors: ["→"],
  },

  "radical-halogenation": {
    title: { en: "Radical chain — initiation → propagation → termination", fa: "زنجیرهٔ رادیکالی — شروع ← رشد ← پایان" },
    footnote: {
      en: "Fishhook arrows = ONE electron moves. The chain runs thousands of cycles before termination.",
      fa: "پیکان قلاب‌دار = یک الکترون جابه‌جا می‌شود. زنجیره هزاران چرخه قبل از پایان می‌چرخد.",
    },
    frames: [
      {
        caption: { en: "initiation", fa: "شروع" },
        atoms: [
          { id: "cl1", el: "Cl", x: 200, y: 85, rad: true, dim: true },
          { id: "cl2", el: "Cl", x: 320, y: 85, rad: true, dim: true },
        ],
        bonds: [{ a: "cl1", b: "cl2" }],
        curves: [
          { from: "bond:cl1:cl2", to: "cl1", fish: true, bulge: -30 },
          { from: "bond:cl1:cl2", to: "cl2", fish: true, bulge: 30 },
        ],
        condition: { x: 260, y: 30, text: "hν" },
      },
      {
        caption: { en: "propagation 1 — H abstraction", fa: "رشد ۱ — ربودن هیدروژن" },
        atoms: [
          { id: "cl", el: "Cl·", x: 70, y: 55 },
          { id: "h", el: "H", x: 190, y: 85 },
          { id: "c", el: "C", x: 260, y: 85, bare: true },
          { id: "h1", el: "H", x: 260, y: 40 },
          { id: "h2", el: "H", x: 300, y: 118 },
          { id: "hcl", el: "HCl", x: 80, y: 135, dim: true },
        ],
        bonds: [{ a: "h", b: "c" }, { a: "c", b: "h1" }, { a: "c", b: "h2" }],
        curves: [
          { from: "cl", to: "h", fish: true, bulge: -30 },
          { from: "bond:h:c", to: "hcl", fish: true, bulge: -35 },
        ],
      },
      {
        caption: { en: "propagation 2 — X₂ attack", fa: "رشد ۲ — حمله به X₂" },
        atoms: [
          { id: "cr", el: "C·", x: 130, y: 85 },
          { id: "h1", el: "H", x: 130, y: 40 },
          { id: "h2", el: "H", x: 95, y: 118 },
          { id: "h3", el: "H", x: 165, y: 118 },
          { id: "cl1", el: "Cl", x: 280, y: 85, dim: true },
          { id: "cl2", el: "Cl", x: 380, y: 85, rad: true, dim: true },
        ],
        bonds: [{ a: "cr", b: "h1" }, { a: "cr", b: "h2" }, { a: "cr", b: "h3" }, { a: "cr", b: "cl1", dash: true }, { a: "cl1", b: "cl2" }],
        curves: [
          { from: "cr", to: "bond:cl1:cl2", fish: true, bulge: -35 },
          { from: "bond:cl1:cl2", to: "cl2", fish: true, bulge: -35 },
        ],
      },
    ],
    connectors: ["→", "→"],
  },

  "grignard-formation": {
    title: { en: "Grignard — oxidative insertion of Mg", fa: "گرینیار — درج اکسایشی منیزیم" },
    footnote: {
      en: "Mg inserts into C–Br; the reagent reads R⁻ MgBr⁺. Any O–H/N–H destroys it — dry everything.",
      fa: "منیزیم درون C–Br می‌نشیند؛ معرف را R⁻ MgBr⁺ بخوانید. هر O–H/N–H نابودش می‌کند — همه‌چیز خشک.",
    },
    frames: [
      {
        caption: { en: "formation", fa: "ساخت" },
        atoms: [
          { id: "c", el: "CH₃", x: 150, y: 85 },
          { id: "br", el: "Br", x: 265, y: 85 },
          { id: "mg", el: "Mg", x: 370, y: 85 },
        ],
        bonds: [{ a: "c", b: "br" }],
        curves: [
          { from: "bond:c:br", to: "mg", bulge: -40 },
        ],
        condition: { x: 320, y: 30, text: "Et₂O" },
        labels: [{ x: 205, y: 40, text: "2e⁻ from Mg", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "the reagent — polar C–Mg", fa: "معرف — C–Mg قطبی" },
        atoms: [
          { id: "c", el: "CH₃", x: 180, y: 85, charge: "δ-" },
          { id: "mg", el: "Mg", x: 300, y: 85, charge: "δ+" },
          { id: "br", el: "Br", x: 390, y: 85 },
        ],
        bonds: [{ a: "c", b: "mg" }, { a: "mg", b: "br" }],
        labels: [{ x: 240, y: 130, text: "carbanion equivalent", color: "slate", size: 11, italic: true }],
      },
      {
        caption: { en: "destroyed by water", fa: "نابودی با آب" },
        atoms: [
          { id: "c", el: "CH₃", x: 160, y: 85 },
          { id: "mgbr", el: "MgBr", x: 300, y: 120 },
          { id: "o", el: "O", x: 320, y: 45, lp: { n: 2, angles: [30, 120] } },
          { id: "h1", el: "H", x: 360, y: 25 },
          { id: "h2", el: "H", x: 285, y: 20 },
        ],
        bonds: [{ a: "c", b: "mgbr" }, { a: "mgbr", b: "o" }, { a: "o", b: "h1" }, { a: "o", b: "h2" }],
        curves: [{ from: "c", to: "h1", bulge: -40 }],
        labels: [{ x: 250, y: 160, text: "→ CH₄ + Mg(OH)Br", color: "dark", size: 12 }],
      },
    ],
    connectors: ["→", "→"],
  },
};
