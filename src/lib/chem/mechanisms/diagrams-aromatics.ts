import type { MechanismDiagram } from "./diagram-types";

/** EAS diagrams — benzene & aromatics. */
export const AROMATIC_DIAGRAMS: Record<string, MechanismDiagram> = {
  "eas-general": {
    title: { en: "EAS master template — 3 steps", fa: "الگوی مادر EAS — ۳ مرحله" },
    footnote: {
      en: "Generate E⁺ → ring attacks (sigma complex) → deprotonate and aromaticity returns. The prize: ~150 kJ/mol.",
      fa: "ساخت E⁺ ← حملهٔ حلقه (کمپلکس سیگما) ← جدا کردن پروتون و بازگشت آروماتیک‌بودن. جایزه: ~۱۵۰ کیلوژول بر مول.",
    },
    frames: [
      {
        caption: { en: "1 — electrophile generation", fa: "۱ — ساخت الکترون‌خواه" },
        atoms: [
          { id: "re", el: "Reagent", x: 130, y: 85 },
          { id: "cat", el: "cat.", x: 250, y: 85 },
          { id: "e", el: "E⁺", x: 370, y: 85 },
        ],
        bonds: [{ a: "re", b: "cat", dash: true }, { a: "cat", b: "e", dash: true }],
        curves: [{ from: "re", to: "e", bulge: -40 }],
        labels: [{ x: 250, y: 130, text: "e.g. HNO₃+H₂SO₄ → NO₂⁺", color: "slate", size: 10 }],
      },
      {
        caption: { en: "2 — sigma complex (slow)", fa: "۲ — کمپلکس سیگما (کند)" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 60, bare: true },
          { id: "c2", el: "C", x: 230, y: 60, bare: true },
          { id: "c3", el: "C", x: 290, y: 60, bare: true },
          { id: "c4", el: "C", x: 320, y: 105, bare: true },
          { id: "c5", el: "C", x: 260, y: 105, bare: true },
          { id: "c6", el: "C", x: 200, y: 105, bare: true },
          { id: "e", el: "E", x: 230, y: 60, bare: true, dim: true },
          { id: "h", el: "H", x: 230, y: 60, bare: true, dim: true },
        ],
        bonds: [
          { a: "c1", b: "c2" }, { a: "c2", b: "c3" },
          { a: "c3", b: "c4" }, { a: "c4", b: "c5" }, { a: "c5", b: "c6" }, { a: "c6", b: "c1" },
        ],
        labels: [
          { x: 250, y: 25, text: "arenium ion — charge delocalized o/p", color: "slate", size: 10, italic: true },
          { x: 250, y: 150, text: "aromaticity broken — this is the price", color: "pink", size: 11, italic: true },
        ],
      },
      {
        caption: { en: "3 — deprotonation: aromatic again", fa: "۳ — جدا شدن پروتون: دوباره آروماتیک" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 60, bare: true },
          { id: "c2", el: "C", x: 230, y: 60, bare: true },
          { id: "c3", el: "C", x: 290, y: 60, bare: true },
          { id: "c4", el: "C", x: 320, y: 105, bare: true },
          { id: "c5", el: "C", x: 260, y: 105, bare: true },
          { id: "c6", el: "C", x: 200, y: 105, bare: true },
          { id: "e", el: "E", x: 230, y: 25 },
          { id: "b", el: "B⁻", x: 400, y: 85 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 }, { a: "c3", b: "c4", order: 2 }, { a: "c5", b: "c6", order: 2 },
          { a: "c2", b: "c3" }, { a: "c4", b: "c5" }, { a: "c6", b: "c1" },
          { a: "c2", b: "e" },
        ],
        curves: [{ from: "b", to: "c2", bulge: -40 }],
        labels: [{ x: 390, y: 120, text: "grabs H⁺", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["→", "→"],
  },

  "eas-nitration": {
    title: { en: "Nitration — making NO₂⁺", fa: "نیتراسیون — ساخت NO₂⁺" },
    footnote: {
      en: "H₂SO₄ protonates HNO₃, water leaves → linear nitronium ion. Keep ~50 °C.",
      fa: "H₂SO₄ به HNO₃ پروتون می‌دهد، آب خارج می‌شود ← یون خطی نیترونیوم. حدود ۵۰ درجه نگه دارید.",
    },
    frames: [
      {
        caption: { en: "nitronium formation", fa: "ساخت نیترونیوم" },
        atoms: [
          { id: "no3", el: "HNO₃", x: 130, y: 85 },
          { id: "h2so4", el: "H₂SO₄", x: 250, y: 85 },
          { id: "no2", el: "O=N⁺=O", x: 380, y: 85 },
          { id: "h2o", el: "H₂O", x: 250, y: 150 },
        ],
        bonds: [{ a: "no3", b: "h2so4", dash: true }],
        curves: [{ from: "no3", to: "h2o", bulge: -40 }],
        labels: [{ x: 380, y: 120, text: "the electrophile", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "ring attacks NO₂⁺", fa: "حلقه به NO₂⁺ حمله می‌کند" },
        atoms: [
          { id: "n", el: "N⁺", x: 250, y: 40 },
          { id: "o1", el: "O", x: 195, y: 20 },
          { id: "o2", el: "O", x: 305, y: 20 },
          { id: "c2", el: "C", x: 250, y: 95, bare: true },
          { id: "c1", el: "C", x: 190, y: 130, bare: true },
          { id: "c3", el: "C", x: 310, y: 130, bare: true },
        ],
        bonds: [
          { a: "n", b: "o1", order: 2 }, { a: "n", b: "o2" },
          { a: "n", b: "c2" }, { a: "c2", b: "c1", dash: true }, { a: "c2", b: "c3", dash: true },
        ],
        labels: [{ x: 250, y: 160, text: "sigma complex", color: "slate", size: 11, italic: true }],
      },
      {
        caption: { en: "nitrobenzene", fa: "نیتروبنزن" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 70, bare: true },
          { id: "c2", el: "C", x: 230, y: 70, bare: true },
          { id: "c3", el: "C", x: 290, y: 70, bare: true },
          { id: "c4", el: "C", x: 320, y: 115, bare: true },
          { id: "c5", el: "C", x: 260, y: 115, bare: true },
          { id: "c6", el: "C", x: 200, y: 115, bare: true },
          { id: "n", el: "N", x: 230, y: 30 },
          { id: "o1", el: "O", x: 175, y: 12 },
          { id: "o2", el: "O", x: 285, y: 12 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 }, { a: "c3", b: "c4", order: 2 }, { a: "c5", b: "c6", order: 2 },
          { a: "c2", b: "c3" }, { a: "c4", b: "c5" }, { a: "c6", b: "c1" },
          { a: "c2", b: "n" }, { a: "n", b: "o1", order: 2 }, { a: "n", b: "o2" },
        ],
      },
    ],
    connectors: ["→", "→"],
  },

  "eas-bromination": {
    title: { en: "Bromination — FeBr₃ polarizes Br₂", fa: "بروماسیون — FeBr₃ برم را قطبی می‌کند" },
    footnote: {
      en: "Alkene + Br₂ is instant; benzene + Br₂ does NOTHING without FeBr₃ — aromaticity's price in one comparison.",
      fa: "آلکن + Br₂ فوری است؛ بنزن + Br₂ بدون FeBr₃ هیچ — قیمت آروماتیک‌بودن در یک مقایسه.",
    },
    frames: [
      {
        caption: { en: "polarization", fa: "قطبش" },
        atoms: [
          { id: "br1", el: "Br", x: 180, y: 85, charge: "δ+" },
          { id: "br2", el: "Br", x: 265, y: 85, charge: "δ-" },
          { id: "fe", el: "FeBr₃", x: 360, y: 85 },
        ],
        bonds: [{ a: "br1", b: "br2" }, { a: "br2", b: "fe", dash: true }],
        curves: [{ from: "bond:br2:fe", to: "br1", bulge: -40 }],
        labels: [{ x: 222, y: 40, text: "Br⁺-like", color: "pink", size: 11, italic: true }],
      },
      {
        caption: { en: "sigma complex", fa: "کمپلکس سیگما" },
        atoms: [
          { id: "br", el: "Br", x: 230, y: 30 },
          { id: "c2", el: "C", x: 230, y: 90, bare: true },
          { id: "c1", el: "C", x: 170, y: 125, bare: true },
          { id: "c3", el: "C", x: 290, y: 125, bare: true },
          { id: "fe", el: "FeBr₄⁻", x: 400, y: 85 },
        ],
        bonds: [
          { a: "br", b: "c2" }, { a: "c2", b: "c1", dash: true }, { a: "c2", b: "c3", dash: true },
        ],
        curves: [{ from: "c2", to: "fe", bulge: -35 }],
      },
      {
        caption: { en: "bromobenzene + HBr", fa: "بروموبنزن + HBr" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 70, bare: true },
          { id: "c2", el: "C", x: 230, y: 70, bare: true },
          { id: "c3", el: "C", x: 290, y: 70, bare: true },
          { id: "c4", el: "C", x: 320, y: 115, bare: true },
          { id: "c5", el: "C", x: 260, y: 115, bare: true },
          { id: "c6", el: "C", x: 200, y: 115, bare: true },
          { id: "br", el: "Br", x: 230, y: 30 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 }, { a: "c3", b: "c4", order: 2 }, { a: "c5", b: "c6", order: 2 },
          { a: "c2", b: "c3" }, { a: "c4", b: "c5" }, { a: "c6", b: "c1" },
          { a: "c2", b: "br" },
        ],
        labels: [{ x: 390, y: 85, text: "+ HBr ↑", color: "slate", size: 12 }],
      },
    ],
    connectors: ["⇌", "→"],
  },

  "eas-friedel-crafts": {
    title: { en: "Friedel–Crafts — AlCl₃ exposes the cation", fa: "فریدل–کرافتس — AlCl₃ کاتیون را آشکار می‌کند" },
    footnote: {
      en: "R–Cl + AlCl₃ → R⁺; ring attacks; AlCl₄⁻ deprotonates. Over-alkylation is the risk; acylation stops at one.",
      fa: "R–Cl + AlCl₃ ← R⁺؛ حلقه حمله می‌کند؛ AlCl₄⁻ پروتون را می‌گیرد. خطر چندآلکیل‌شدگی؛ آسیل‌دار کردن در یکی می‌ایستد.",
    },
    frames: [
      {
        caption: { en: "electrophile", fa: "الکترون‌خواه" },
        atoms: [
          { id: "rcl", el: "CH₃–Cl", x: 140, y: 85 },
          { id: "al", el: "AlCl₃", x: 260, y: 85 },
          { id: "r", el: "CH₃⁺", x: 380, y: 85 },
        ],
        bonds: [{ a: "rcl", b: "al", dash: true }],
        curves: [{ from: "rcl", to: "r", bulge: -40 }],
        labels: [{ x: 260, y: 130, text: "tight ion pair — no free R⁺", color: "slate", size: 10, italic: true }],
      },
      {
        caption: { en: "ring attack → sigma complex", fa: "حملهٔ حلقه ← کمپلکس سیگما" },
        atoms: [
          { id: "c2", el: "C", x: 230, y: 90, bare: true },
          { id: "c1", el: "C", x: 170, y: 125, bare: true },
          { id: "c3", el: "C", x: 290, y: 125, bare: true },
          { id: "r", el: "CH₃", x: 230, y: 35 },
          { id: "al", el: "AlCl₄⁻", x: 390, y: 90 },
        ],
        bonds: [
          { a: "c2", b: "r" },
          { a: "c2", b: "c1", dash: true }, { a: "c2", b: "c3", dash: true },
        ],
        curves: [{ from: "c2", to: "al", bulge: -35 }],
      },
      {
        caption: { en: "toluene", fa: "تولوئن" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 70, bare: true },
          { id: "c2", el: "C", x: 230, y: 70, bare: true },
          { id: "c3", el: "C", x: 290, y: 70, bare: true },
          { id: "c4", el: "C", x: 320, y: 115, bare: true },
          { id: "c5", el: "C", x: 260, y: 115, bare: true },
          { id: "c6", el: "C", x: 200, y: 115, bare: true },
          { id: "r", el: "CH₃", x: 230, y: 30 },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 }, { a: "c3", b: "c4", order: 2 }, { a: "c5", b: "c6", order: 2 },
          { a: "c2", b: "c3" }, { a: "c4", b: "c5" }, { a: "c6", b: "c1" },
          { a: "c2", b: "r" },
        ],
        labels: [{ x: 340, y: 85, text: "+ HCl (ring now MORE reactive!)", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["⇌", "→"],
  },

  "aromatic-hydrogenation-resistance": {
    title: { en: "Why benzene resists hydrogenation", fa: "چرا بنزن در برابر هیدروژن‌دار کردن مقاوم است" },
    footnote: {
      en: "Adding H₂ locally destroys aromatic stabilization (~150 kJ/mol); only forcing conditions push 3 H₂ in.",
      fa: "افزودن H₂ پایداری آروماتیک را موضعی نابود می‌کند (~۱۵۰ کیلوژول بر مول)؛ فقط شرایط سخت ۳ H₂ را وارد می‌کند.",
    },
    frames: [
      {
        caption: { en: "the energy wall", fa: "دیوار انرژی" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 60, bare: true },
          { id: "c2", el: "C", x: 230, y: 60, bare: true },
          { id: "c3", el: "C", x: 290, y: 60, bare: true },
          { id: "c4", el: "C", x: 320, y: 105, bare: true },
          { id: "c5", el: "C", x: 260, y: 105, bare: true },
          { id: "c6", el: "C", x: 200, y: 105, bare: true },
        ],
        bonds: [
          { a: "c1", b: "c2", order: 2 }, { a: "c3", b: "c4", order: 2 }, { a: "c5", b: "c6", order: 2 },
          { a: "c2", b: "c3" }, { a: "c4", b: "c5" }, { a: "c6", b: "c1" },
        ],
        condition: { x: 400, y: 50, text: "3 H₂" },
        labels: [
          { x: 245, y: 25, text: "aromatic sextet ~150 kJ/mol", color: "pink", size: 11, italic: true },
          { x: 245, y: 155, text: "Ni, ~200 °C, high pressure", color: "slate", size: 11 },
        ],
      },
      {
        caption: { en: "cyclohexane", fa: "سیکلوهگزان" },
        atoms: [
          { id: "c1", el: "C", x: 170, y: 60, bare: true },
          { id: "c2", el: "C", x: 230, y: 60, bare: true },
          { id: "c3", el: "C", x: 290, y: 60, bare: true },
          { id: "c4", el: "C", x: 320, y: 105, bare: true },
          { id: "c5", el: "C", x: 260, y: 105, bare: true },
          { id: "c6", el: "C", x: 200, y: 105, bare: true },
          { id: "h1", el: "H", x: 150, y: 30 },
          { id: "h2", el: "H", x: 290, y: 25, dim: true },
        ],
        bonds: [
          { a: "c1", b: "c2" }, { a: "c2", b: "c3" }, { a: "c3", b: "c4" },
          { a: "c4", b: "c5" }, { a: "c5", b: "c6" }, { a: "c6", b: "c1" },
        ],
        labels: [{ x: 245, y: 25, text: "C₆H₁₂ — the π bonds are gone", color: "slate", size: 11 }],
      },
    ],
    connectors: ["→"],
  },
};
