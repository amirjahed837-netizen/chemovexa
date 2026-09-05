import type { MechanismDiagram } from "./diagram-types";

/** Carbonyl (aldehyde/ketone) diagrams. */
export const CARBONYL_DIAGRAMS: Record<string, MechanismDiagram> = {
  "carbonyl-nucleophilic-addition": {
    title: { en: "Nucleophilic addition to C=O — Bürgi–Dunitz approach", fa: "افزایش هسته‌خواهی به C=O — رویکرد بورگی–دونیتز" },
    footnote: {
      en: "Nu attacks the planar carbon at ~107°; the π pair lands on oxygen. Tetrahedral alkoxide, then protonation.",
      fa: "هسته‌خواه در حدود ۱۰۷ درجه به کربن تخت حمله می‌کند؛ زوج π روی اکسیژن می‌نشیند. آلکوکسید چهاروجهی، سپس پروتون‌گیری.",
    },
    frames: [
      {
        caption: { en: "polarized C=O", fa: "C=O قطبی" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "R'", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, charge: "δ+", bare: true },
          { id: "o", el: "O", x: 330, y: 85, charge: "δ-", lp: { n: 2, angles: [15, 165] } },
        ],
        bonds: [{ a: "c", b: "o", order: 2 }, { a: "r1", b: "c" }, { a: "r2", b: "c" }],
        labels: [
          { x: 240, y: 40, text: "electrophilic carbon", color: "pink", size: 11, italic: true },
          { x: 385, y: 55, text: "π → O", color: "slate", size: 10 },
        ],
      },
      {
        caption: { en: "Nu⁻ attacks (slow)", fa: "حملهٔ Nu⁻ (کند)" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "R'", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O⁻", x: 335, y: 60, lp: { n: 3, angles: [0, 90, 160] } },
          { id: "nu", el: "Nu⁻", x: 175, y: 145 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" },
          { a: "c", b: "o", order: 2 }, { a: "nu", b: "c", dash: true },
        ],
        curves: [
          { from: "nu", to: "c", bulge: -30 },
          { from: "bond:c:o", to: "o", bulge: -30 },
        ],
        labels: [{ x: 130, y: 175, text: "107° trajectory", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "tetrahedral alkoxide → protonation", fa: "آلکوکسید چهاروجهی ← پروتون‌گیری" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "R'", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O⁻", x: 330, y: 55, lp: { n: 3, angles: [0, 90, 160] } },
          { id: "nu", el: "Nu", x: 240, y: 140 },
          { id: "h", el: "H⁺", x: 395, y: 90 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" },
          { a: "c", b: "o" }, { a: "c", b: "nu" },
        ],
        curves: [{ from: "h", to: "o", bulge: -30 }],
        labels: [{ x: 240, y: 180, text: "→ R₂C(OH)Nu", color: "dark", size: 12 }],
      },
    ],
    connectors: ["→", "→"],
  },

  "carbonyl-imine-formation": {
    title: { en: "Imine formation — addition then dehydration", fa: "ساخت ایمین — افزودن و سپس آب‌زدایی" },
    footnote: {
      en: "Amine adds to carbinolamine; mild acid then eliminates water to C=N. pH ~4.5 optimum.",
      fa: "آمین به کاربینول‌آمین اضافه می‌شود؛ اسید ملایم آب را حذف و C=N می‌سازد. pH بهینه حدود ۴٫۵.",
    },
    frames: [
      {
        caption: { en: "1 — amine attacks", fa: "۱ — حملهٔ آمین" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "H", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O", x: 330, y: 85, lp: { n: 2, angles: [15, 165] } },
          { id: "n", el: "N", x: 175, y: 145, lp: { n: 1, angles: [250] } },
          { id: "rp", el: "R'", x: 120, y: 180 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" }, { a: "c", b: "o", order: 2 },
          { a: "n", b: "rp" }, { a: "n", b: "c", dash: true },
        ],
        curves: [
          { from: "n", to: "c", bulge: -30 },
          { from: "bond:c:o", to: "o", bulge: -30 },
        ],
      },
      {
        caption: { en: "2 — carbinolamine", fa: "۲ — کاربینول‌آمین" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "H", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "OH", x: 325, y: 50 },
          { id: "h", el: "H", x: 360, y: 25 },
          { id: "n", el: "N", x: 240, y: 140, lp: { n: 1, angles: [270] } },
          { id: "rp", el: "R'", x: 195, y: 175 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" },
          { a: "c", b: "o" }, { a: "o", b: "h" },
          { a: "c", b: "n" }, { a: "n", b: "rp" },
        ],
      },
      {
        caption: { en: "3 — acid-catalyzed dehydration", fa: "۳ — آب‌زدایی کاتالیز اسیدی" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "oh2", el: "OH₂⁺", x: 330, y: 55 },
          { id: "n", el: "N", x: 240, y: 140 },
          { id: "rp", el: "R'", x: 195, y: 175 },
        ],
        bonds: [
          { a: "r1", b: "c" },
          { a: "c", b: "oh2", dash: true }, { a: "c", b: "n", dash: true },
          { a: "n", b: "rp" },
        ],
        curves: [
          { from: "bond:c:oh2", to: "oh2", bulge: 25 },
          { from: "n", to: "bond:c:oh2", bulge: -30 },
        ],
        labels: [{ x: 330, y: 25, text: "H₂O leaves", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "4 — the imine C=N", fa: "۴ — ایمین C=N" },
        atoms: [
          { id: "r1", el: "R", x: 170, y: 85 },
          { id: "c", el: "C", x: 260, y: 85, bare: true },
          { id: "n", el: "N", x: 350, y: 85 },
          { id: "rp", el: "R'", x: 350, y: 140 },
        ],
        bonds: [{ a: "r1", b: "c" }, { a: "c", b: "n", order: 2 }, { a: "n", b: "rp" }],
        labels: [{ x: 260, y: 40, text: "+ H₂O (condensation)", color: "slate", size: 11 }],
      },
    ],
    connectors: ["⇌", "⇌", "→"],
  },

  "carbonyl-aldol": {
    title: { en: "Aldol — enolate attacks another carbonyl", fa: "آلدول — انولات به کربونیل دیگر حمله می‌کند" },
    footnote: {
      en: "OH⁻ makes the enolate; its α-carbon builds the new C–C bond. Heat removes water → enal (E1cb).",
      fa: "OH⁻ انولات می‌سازد؛ کربن α‌اش پیوند C–C جدید را می‌سازد. گرما آب را می‌گیرد ← انال (E1cb).",
    },
    frames: [
      {
        caption: { en: "1 — enolate formation", fa: "۱ — ساخت انولات" },
        atoms: [
          { id: "h", el: "H", x: 155, y: 60 },
          { id: "c1", el: "C", x: 210, y: 85, bare: true },
          { id: "c2", el: "C", x: 300, y: 85, bare: true },
          { id: "o", el: "O", x: 300, y: 35, lp: { n: 2, angles: [10, 170] } },
          { id: "h1", el: "H", x: 165, y: 120 },
          { id: "oh", el: "OH⁻", x: 100, y: 35 },
        ],
        bonds: [
          { a: "h", b: "c1" }, { a: "c1", b: "c2" }, { a: "c2", b: "o", order: 2 }, { a: "c1", b: "h1" },
        ],
        curves: [
          { from: "oh", to: "h", bulge: -30 },
          { from: "bond:h:c1", to: "bond:c1:c2", fish: false, bulge: -30 },
          { from: "bond:c1:c2", to: "o", bulge: -30 },
        ],
        labels: [{ x: 245, y: 155, text: "resonance: O⁻–C=C ↔ C⁻–C=O", color: "slate", size: 10, italic: true }],
      },
      {
        caption: { en: "2 — C–C bond formation", fa: "۲ — ساخت پیوند C–C" },
        atoms: [
          { id: "ca", el: "C", x: 150, y: 85, charge: "δ-", bare: true },
          { id: "oa", el: "O⁻", x: 60, y: 55, dim: true },
          { id: "cb", el: "C", x: 290, y: 85, bare: true },
          { id: "ob", el: "O", x: 290, y: 30, lp: { n: 2, angles: [10, 170] } },
          { id: "h", el: "H", x: 220, y: 130 },
        ],
        bonds: [
          { a: "ca", b: "oa", order: 2, dash: true },
          { a: "cb", b: "ob", order: 2 },
          { a: "ca", b: "cb", dash: true },
        ],
        curves: [{ from: "ca", to: "cb", bulge: -40 }],
        labels: [{ x: 220, y: 30, text: "enolate carbon → carbonyl carbon", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "3 — β-hydroxy aldehyde (aldol)", fa: "۳ — آلدهید β-هیدروکسی (آلدول)" },
        atoms: [
          { id: "c1", el: "C", x: 140, y: 85 },
          { id: "o1", el: "O", x: 140, y: 30, dim: true },
          { id: "c2", el: "C", x: 240, y: 85, bare: true },
          { id: "oh", el: "OH", x: 240, y: 140 },
          { id: "c3", el: "C", x: 340, y: 85, bare: true },
          { id: "o3", el: "O", x: 340, y: 30, dim: true },
        ],
        bonds: [
          { a: "c1", b: "o1", order: 2 }, { a: "c1", b: "c2" },
          { a: "c2", b: "oh" }, { a: "c2", b: "c3" }, { a: "c3", b: "o3", order: 2 },
        ],
        condition: { x: 420, y: 80, text: "Δ" },
        labels: [{ x: 420, y: 120, text: "→ enal + H₂O", color: "slate", size: 11 }],
      },
    ],
    connectors: ["⇌", "⇌"],
  },

  "carbonyl-alpha-halogenation": {
    title: { en: "α-Halogenation — the enol does the work", fa: "هالوژن‌دار کردن α — انول کار را می‌کند" },
    footnote: {
      en: "Enolization is slow (rate = k[ketone]); the enol then zaps Br₂ instantly. Kinetic fingerprint of the mechanism.",
      fa: "انول‌شدن کند است (سرعت = k[کتون])؛ بعد انول فوراً Br₂ را شکار می‌کند. اثر انگشتی سینتیکی سازوکار.",
    },
    frames: [
      {
        caption: { en: "1 — acid-catalyzed enolization", fa: "۱ — انول‌شدن کاتالیز اسیدی" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 85, bare: true },
          { id: "c2", el: "C", x: 280, y: 85, bare: true },
          { id: "o", el: "OH⁺", x: 280, y: 30 },
          { id: "ha", el: "H", x: 135, y: 120 },
          { id: "hb", el: "H", x: 180, y: 135 },
          { id: "w", el: "H₂O", x: 90, y: 60 },
        ],
        bonds: [
          { a: "c1", b: "c2" }, { a: "c2", b: "o" },
          { a: "c1", b: "ha" }, { a: "c1", b: "hb" },
        ],
        curves: [{ from: "w", to: "hb", bulge: -30 }],
        labels: [{ x: 230, y: 160, text: "slow — rate-determining", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "2 — the enol C=C attacks Br₂", fa: "۲ — C=C انول به Br₂ حمله می‌کند" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 85, bare: true },
          { id: "c2", el: "C", x: 270, y: 85, bare: true },
          { id: "oh", el: "OH", x: 320, y: 55 },
          { id: "h", el: "H", x: 180, y: 135 },
          { id: "br", el: "Br–Br", x: 380, y: 125 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 }, { a: "c2", b: "oh" }, { a: "c1", b: "h" },
        ],
        curves: [{ from: "bond:c1:c2", to: "br", bulge: -40 }],
        labels: [{ x: 300, y: 160, text: "instant — [Br₂] not in rate law", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "3 — α-bromoketone + H⁺ back", fa: "۳ — کتون α-برمه + H⁺ برمی‌گردد" },
        atoms: [
          { id: "c1", el: "C", x: 180, y: 85, bare: true },
          { id: "c2", el: "C", x: 270, y: 85, bare: true },
          { id: "o", el: "O", x: 270, y: 30, dim: true },
          { id: "h", el: "H", x: 180, y: 135 },
          { id: "br", el: "Br", x: 135, y: 120 },
        ],
        bonds: [
          { a: "c1", b: "c2" }, { a: "c2", b: "o", order: 2 },
          { a: "c1", b: "h" }, { a: "c1", b: "br" },
        ],
        labels: [{ x: 245, y: 160, text: "catalytic H⁺ regenerated", color: "slate", size: 11 }],
      },
    ],
    connectors: ["⇌", "→"],
  },

  "carbonyl-reduction": {
    title: { en: "Hydride reduction — H⁻ is the nucleophile", fa: "کاهش با هیدرید — H⁻ هسته‌خواه است" },
    footnote: {
      en: "AlH₄⁻ delivers H⁻ (two electrons!) to the carbonyl carbon; workup protonates the alkoxide.",
      fa: "AlH₄⁻ یک H⁻ (با دو الکترون!) به کربن کربونیلی می‌دهد؛ کارِ پایانی آلکوکسید را پروتونه می‌کند.",
    },
    frames: [
      {
        caption: { en: "hydride delivery", fa: "تحویل هیدرید" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "H", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O", x: 330, y: 85, lp: { n: 2, angles: [15, 165] } },
          { id: "al", el: "AlH₄⁻", x: 175, y: 150 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" }, { a: "c", b: "o", order: 2 },
          { a: "al", b: "c", dash: true },
        ],
        curves: [
          { from: "al", to: "c", bulge: -30 },
          { from: "bond:c:o", to: "o", bulge: -30 },
        ],
        labels: [{ x: 165, y: 180, text: "H⁻ = H with 2e⁻", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "alkoxide", fa: "آلکوکسید" },
        atoms: [
          { id: "r1", el: "R", x: 150, y: 55 },
          { id: "r2", el: "H", x: 150, y: 115 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O⁻", x: 330, y: 55, lp: { n: 3, angles: [0, 90, 160] } },
          { id: "h", el: "H", x: 240, y: 140 },
          { id: "al", el: "AlH₃", x: 395, y: 120 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" }, { a: "c", b: "o" }, { a: "c", b: "h" },
        ],
        condition: { x: 395, y: 60, text: "H₂O" },
      },
      {
        caption: { en: "the alcohol", fa: "الکل" },
        atoms: [
          { id: "r1", el: "R", x: 170, y: 85 },
          { id: "r2", el: "H", x: 170, y: 140 },
          { id: "c", el: "C", x: 260, y: 85, bare: true },
          { id: "oh", el: "OH", x: 350, y: 85 },
          { id: "h", el: "H", x: 260, y: 140 },
        ],
        bonds: [
          { a: "r1", b: "c" }, { a: "r2", b: "c" }, { a: "c", b: "oh" }, { a: "c", b: "h" },
        ],
        labels: [{ x: 260, y: 40, text: "1° alcohol (from aldehyde)", color: "slate", size: 11 }],
      },
    ],
    connectors: ["→", "→"],
  },
};
