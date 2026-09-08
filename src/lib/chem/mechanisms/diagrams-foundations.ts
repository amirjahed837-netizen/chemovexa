import type { MechanismDiagram } from "./diagram-types";

/** Diagrams for foundations (SN1, E2, radical, Grignard). Geometry: real
 * tetrahedral/trigonal angles, charges auto-attached by the renderer. */
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
          { id: "nu", el: "HO", x: 60, y: 85, charge: "−" },
          { id: "c", el: "C", x: 230, y: 85, bare: true },
          { id: "h1", el: "H", x: 230, y: 48 },
          { id: "h2", el: "H", x: 200, y: 120 },
          { id: "h3", el: "H", x: 260, y: 120 },
          { id: "br", el: "Br", x: 330, y: 85, lp: { n: 3, angles: [45, 135, 225, 315] } },
        ],
        bonds: [
          { a: "c", b: "h1" }, { a: "c", b: "h2" }, { a: "c", b: "h3" }, { a: "c", b: "br" },
          { a: "nu", b: "c", dash: true },
        ],
        curves: [
          { from: "nu", to: "bond:c:br", bulge: -42 },
          { from: "bond:c:br", to: "br", bulge: -42 },
        ],
        labels: [
          { x: 150, y: 42, text: "backside attack (180°)", color: "pink", size: 11, italic: true },
        ],
      },
      {
        caption: { en: "transition state — 5-coordinate", fa: "حالت گذار — پنج‌مختصات" },
        atoms: [
          { id: "nu", el: "HO", x: 130, y: 85, charge: "δ−" },
          { id: "c", el: "C", x: 230, y: 85, bare: true, charge: "δ+" },
          { id: "h1", el: "H", x: 230, y: 40 },
          { id: "h2", el: "H", x: 196, y: 126 },
          { id: "h3", el: "H", x: 264, y: 126 },
          { id: "br", el: "Br", x: 325, y: 85, charge: "δ−" },
        ],
        bonds: [
          { a: "c", b: "h1" }, { a: "c", b: "h2" }, { a: "c", b: "h3" },
          { a: "nu", b: "c", dash: true }, { a: "c", b: "br", dash: true },
        ],
        labels: [{ x: 230, y: 168, text: "[ ‡ ]  trigonal-bipyramidal", color: "slate", size: 11 }],
      },
      {
        caption: { en: "product — Walden inversion", fa: "محصول — وارونگی والدن" },
        atoms: [
          { id: "nu", el: "HO", x: 130, y: 85 },
          { id: "c", el: "C", x: 230, y: 85, bare: true },
          { id: "h1", el: "H", x: 230, y: 122 },
          { id: "h2", el: "H", x: 200, y: 50 },
          { id: "h3", el: "H", x: 260, y: 50 },
          { id: "br", el: "Br", x: 330, y: 85, charge: "−", lp: { n: 4, angles: [45, 135, 225, 315] } },
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
          { id: "c", el: "C", x: 230, y: 85, bare: true },
          { id: "m1", el: "CH₃", x: 170, y: 55 },
          { id: "m2", el: "CH₃", x: 170, y: 115 },
          { id: "m3", el: "CH₃", x: 230, y: 150, dim: true },
          { id: "br", el: "Br", x: 310, y: 85, lp: { n: 3, angles: [45, 135, 270] } },
        ],
        bonds: [{ a: "c", b: "m1" }, { a: "c", b: "m2" }, { a: "c", b: "m3" }, { a: "c", b: "br" }],
        curves: [{ from: "bond:c:br", to: "br", bulge: 38 }],
        labels: [{ x: 262, y: 30, text: "slow", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "planar sp² carbocation", fa: "کاتیون تخت sp²" },
        atoms: [
          { id: "c", el: "C", x: 230, y: 85, bare: true, charge: "+" },
          { id: "m1", el: "CH₃", x: 165, y: 55 },
          { id: "m2", el: "CH₃", x: 165, y: 115 },
          { id: "m3", el: "CH₃", x: 295, y: 85 },
        ],
        bonds: [{ a: "c", b: "m1" }, { a: "c", b: "m2" }, { a: "c", b: "m3" }],
        labels: [
          { x: 230, y: 30, text: "empty p-orbital ↑↓ — either face attackable", color: "slate", size: 10.5, italic: true },
        ],
      },
      {
        caption: { en: "water captures (fast)", fa: "آب شکار می‌کند (سریع)" },
        atoms: [
          { id: "o", el: "O", x: 110, y: 85, lp: { n: 2, angles: [160, 250] } },
          { id: "h1", el: "H", x: 72, y: 62 },
          { id: "h2", el: "H", x: 72, y: 110 },
          { id: "c", el: "C", x: 250, y: 85, bare: true },
          { id: "m1", el: "CH₃", x: 250, y: 30 },
          { id: "m2", el: "CH₃", x: 320, y: 118 },
          { id: "m3", el: "CH₃", x: 185, y: 125 },
        ],
        bonds: [
          { a: "o", b: "h1" }, { a: "o", b: "h2" },
          { a: "c", b: "m1" }, { a: "c", b: "m2" }, { a: "c", b: "m3" },
          { a: "o", b: "c", dash: true },
        ],
        curves: [{ from: "o", to: "c", bulge: -46 }],
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
          { id: "b", el: "B", x: 55, y: 55, charge: "−" },
          { id: "hb", el: "H", x: 145, y: 82 },
          { id: "c1", el: "C", x: 215, y: 82, bare: true },
          { id: "c2", el: "C", x: 305, y: 82, bare: true },
          { id: "r1", el: "R", x: 165, y: 130 },
          { id: "r2", el: "R'", x: 355, y: 130 },
          { id: "x", el: "X", x: 305, y: 34, lp: { n: 3, angles: [10, 100, 190] } },
        ],
        bonds: [
          { a: "b", b: "hb", dash: true },
          { a: "hb", b: "c1" },
          { a: "c1", b: "c2" },
          { a: "c1", b: "r1" },
          { a: "c2", b: "r2" }, { a: "c2", b: "x" },
        ],
        curves: [
          { from: "b", to: "hb", bulge: -26 },
          { from: "bond:hb:c1", to: "bond:c1:c2", bulge: -32 },
          { from: "bond:c2:x", to: "x", bulge: -26 },
        ],
        labels: [
          { x: 260, y: 165, text: "H and X anti-periplanar (180°)", color: "slate", size: 11 },
          { x: 260, y: 18, text: "one concerted step", color: "pink", size: 11, italic: true },
        ],
      },
      {
        caption: { en: "the alkene (Zaitsev product)", fa: "آلکن (محصول زایتسف)" },
        atoms: [
          { id: "c1", el: "C", x: 215, y: 85, bare: true },
          { id: "c2", el: "C", x: 305, y: 85, bare: true },
          { id: "r1", el: "R", x: 170, y: 125 },
          { id: "r2", el: "R'", x: 350, y: 125 },
          { id: "h2", el: "H", x: 350, y: 45 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 },
          { a: "c1", b: "r1" },
          { a: "c2", b: "r2" }, { a: "c2", b: "h2" },
        ],
        labels: [{ x: 260, y: 160, text: "C=C formed · B–H and X⁻ gone", color: "slate", size: 11 }],
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
        caption: { en: "initiation — hν splits Cl₂", fa: "شروع — نور Cl₂ را می‌شکند" },
        atoms: [
          { id: "cl1", el: "Cl", x: 205, y: 80, rad: true },
          { id: "cl2", el: "Cl", x: 295, y: 80, rad: true },
        ],
        bonds: [{ a: "cl1", b: "cl2" }],
        curves: [
          { from: "bond:cl1:cl2", to: "cl1", fish: true, bulge: -30 },
          { from: "bond:cl1:cl2", to: "cl2", fish: true, bulge: 30 },
        ],
        condition: { x: 250, y: 28, text: "hν" },
        labels: [{ x: 250, y: 145, text: "two Cl· radicals", color: "slate", size: 11 }],
      },
      {
        caption: { en: "propagation 1 — H abstraction", fa: "رشد ۱ — ربودن هیدروژن" },
        atoms: [
          { id: "cl", el: "Cl", x: 70, y: 60, rad: true },
          { id: "h", el: "H", x: 175, y: 85 },
          { id: "c", el: "C", x: 245, y: 85, bare: true },
          { id: "h1", el: "H", x: 245, y: 40 },
          { id: "h2", el: "H", x: 285, y: 120 },
          { id: "h3", el: "H", x: 205, y: 120 },
        ],
        bonds: [{ a: "h", b: "c" }, { a: "c", b: "h1" }, { a: "c", b: "h2" }, { a: "c", b: "h3" }],
        curves: [
          { from: "cl", to: "h", fish: true, bulge: -30 },
          { from: "bond:h:c", to: "cl", fish: true, bulge: -35 },
        ],
        labels: [{ x: 155, y: 130, text: "→ HCl + CH₃·", color: "dark", size: 12 }],
      },
      {
        caption: { en: "propagation 2 — CH₃· attacks Cl₂", fa: "رشد ۲ — CH₃· به Cl₂ حمله می‌کند" },
        atoms: [
          { id: "cr", el: "CH₃", x: 130, y: 85, rad: true },
          { id: "cl1", el: "Cl", x: 270, y: 85 },
          { id: "cl2", el: "Cl", x: 360, y: 85, rad: true },
        ],
        bonds: [{ a: "cr", b: "cl1", dash: true }, { a: "cl1", b: "cl2" }],
        curves: [
          { from: "cr", to: "bond:cl1:cl2", fish: true, bulge: -35 },
          { from: "bond:cl1:cl2", to: "cl2", fish: true, bulge: -35 },
        ],
        labels: [{ x: 245, y: 140, text: "→ CH₃Cl + Cl·  (chain continues)", color: "dark", size: 12 }],
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
        caption: { en: "formation in dry ether", fa: "ساخت در اتر خشک" },
        atoms: [
          { id: "c", el: "CH₃", x: 130, y: 85 },
          { id: "br", el: "Br", x: 225, y: 85 },
          { id: "mg", el: "Mg", x: 330, y: 85 },
        ],
        bonds: [{ a: "c", b: "br" }],
        curves: [
          { from: "bond:c:br", to: "mg", bulge: -42 },
          { from: "mg", to: "bond:c:br", bulge: -42 },
        ],
        condition: { x: 280, y: 30, text: "Et₂O" },
        labels: [{ x: 175, y: 140, text: "2e⁻ flow from Mg into σ*(C–Br)", color: "pink", size: 10.5, italic: true }],
      },
      {
        caption: { en: "the reagent — polar C–Mg bond", fa: "معرف — پیوند قطبی C–Mg" },
        atoms: [
          { id: "c", el: "CH₃", x: 150, y: 85, charge: "δ−" },
          { id: "mg", el: "Mg", x: 270, y: 85, charge: "δ+" },
          { id: "br", el: "Br", x: 350, y: 85 },
        ],
        bonds: [{ a: "c", b: "mg" }, { a: "mg", b: "br" }],
        labels: [
          { x: 155, y: 135, text: "carbanion equivalent", color: "slate", size: 11, italic: true },
        ],
      },
      {
        caption: { en: "destroyed by water (why: dry!)", fa: "نابودی با آب (به همین دلیل: خشک!)" },
        atoms: [
          { id: "c", el: "CH₃", x: 140, y: 85, charge: "δ−" },
          { id: "mgbr", el: "MgBr", x: 265, y: 85, charge: "δ+" },
          { id: "o", el: "O", x: 330, y: 45, lp: { n: 2, angles: [30, 130] } },
          { id: "h1", el: "H", x: 385, y: 30 },
          { id: "h2", el: "H", x: 300, y: 15 },
        ],
        bonds: [{ a: "c", b: "mgbr" }, { a: "mgbr", b: "o" }, { a: "o", b: "h1" }, { a: "o", b: "h2" }],
        curves: [{ from: "c", to: "h1", bulge: -42 }],
        labels: [{ x: 235, y: 150, text: "→ CH₄ + Mg(OH)Br", color: "dark", size: 12 }],
      },
    ],
    connectors: ["→", "→"],
  },
};
