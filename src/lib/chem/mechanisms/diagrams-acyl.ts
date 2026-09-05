import type { MechanismDiagram } from "./diagram-types";

/** Acyl (carboxylic acid derivatives) diagrams. */
export const ACYL_DIAGRAMS: Record<string, MechanismDiagram> = {
  "acyl-substitution-general": {
    title: { en: "Acyl substitution — addition THEN elimination", fa: "جانشینی اسیدیل — اول افزودن، بعد حذف" },
    footnote: {
      en: "The leaving group is what makes this different from aldehyde/ketone addition. Ladder: Cl > OCOR > OR > NH₂.",
      fa: "گروه خارج‌شونده همان چیزی است که این را از افزایش آلدهید/کتون جدا می‌کند. نردبان: Cl > OCOR > OR > NH₂.",
    },
    frames: [
      {
        caption: { en: "1 — Nu adds to C=O", fa: "۱ — Nu به C=O اضافه می‌شود" },
        atoms: [
          { id: "r", el: "R", x: 150, y: 85 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O", x: 240, y: 30, lp: { n: 2, angles: [10, 170] } },
          { id: "l", el: "L", x: 340, y: 85 },
          { id: "nu", el: "Nu⁻", x: 175, y: 150 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "l" },
          { a: "nu", b: "c", dash: true },
        ],
        curves: [
          { from: "nu", to: "c", bulge: -30 },
          { from: "bond:c:o", to: "o", bulge: -25 },
        ],
        labels: [{ x: 130, y: 180, text: "tetrahedral intermediate forms", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "2 — the tetrahedral intermediate", fa: "۲ — واسط چهاروجهی" },
        atoms: [
          { id: "r", el: "R", x: 150, y: 85 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O⁻", x: 240, y: 30, lp: { n: 3, angles: [10, 90, 170] } },
          { id: "l", el: "L", x: 340, y: 85 },
          { id: "nu", el: "Nu", x: 240, y: 140 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o" }, { a: "c", b: "l" }, { a: "c", b: "nu" },
        ],
        labels: [{ x: 240, y: 180, text: "sp³ carbon — all four attached", color: "slate", size: 10, italic: true }],
      },
      {
        caption: { en: "3 — L⁻ leaves, C=O rebuilt", fa: "۳ — L⁻ خارج می‌شود، C=O بازمی‌سازد" },
        atoms: [
          { id: "r", el: "R", x: 170, y: 85 },
          { id: "c", el: "C", x: 260, y: 85, bare: true },
          { id: "o", el: "O", x: 260, y: 30 },
          { id: "nu", el: "Nu", x: 350, y: 85 },
          { id: "l", el: "L⁻", x: 400, y: 140, lp: { n: 4, angles: [45, 135, 225, 315] } },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "nu" },
        ],
        curves: [{ from: "bond:c:l", to: "l", bulge: 30 }],
        labels: [{ x: 300, y: 40, text: "ladder position decides who leaves", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["⇌", "→"],
  },

  "acyl-fischer-esterification": {
    title: { en: "Fischer esterification — every step reversible", fa: "استری‌شدن فیشر — هر مرحله برگشت‌پذیر" },
    footnote: {
      en: "Excess alcohol or water removal pushes the equilibrium — Le Chatelier is the yield knob.",
      fa: "الکل اضافه یا برداشتن آب تعادل را جلو می‌برد — لو شاتلیه دستگیرهٔ بازده است.",
    },
    frames: [
      {
        caption: { en: "1 — protonation activates C=O", fa: "۱ — پروتون‌گیری C=O را فعال می‌کند" },
        atoms: [
          { id: "r", el: "CH₃", x: 150, y: 85 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "oh", el: "OH", x: 240, y: 140 },
          { id: "o", el: "O", x: 240, y: 30, dim: true },
          { id: "h", el: "H⁺", x: 330, y: 55 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "oh" }, { a: "c", b: "o", order: 2 },
        ],
        curves: [{ from: "h", to: "o", bulge: -30 }],
        labels: [{ x: 330, y: 25, text: "carbon now far more δ+", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "2 — alcohol attacks", fa: "۲ — الکل حمله می‌کند" },
        atoms: [
          { id: "r", el: "CH₃", x: 130, y: 85 },
          { id: "c", el: "C", x: 220, y: 85, bare: true },
          { id: "oh", el: "OH", x: 220, y: 140 },
          { id: "o", el: "OH⁺", x: 220, y: 30, dim: true },
          { id: "oet", el: "OEt", x: 320, y: 125, lp: { n: 2, angles: [20, 110] } },
          { id: "h2", el: "H", x: 370, y: 95 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "oh" }, { a: "c", b: "o" },
          { a: "oet", b: "h2" }, { a: "oet", b: "c", dash: true },
        ],
        curves: [{ from: "oet", to: "c", bulge: -35 }],
      },
      {
        caption: { en: "3 — water leaves", fa: "۳ — آب خارج می‌شود" },
        atoms: [
          { id: "r", el: "CH₃", x: 130, y: 85 },
          { id: "c", el: "C", x: 220, y: 85, bare: true },
          { id: "oh2", el: "OH₂⁺", x: 220, y: 140 },
          { id: "o", el: "O", x: 220, y: 30, dim: true },
          { id: "oet", el: "OEt", x: 315, y: 90 },
          { id: "h2", el: "H", x: 360, y: 60 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "oh2", dash: true }, { a: "c", b: "o" }, { a: "c", b: "oet" },
          { a: "oet", b: "h2" },
        ],
        curves: [
          { from: "bond:c:oh2", to: "oh2", bulge: 30 },
          { from: "oet", to: "bond:c:oh2", bulge: -30 },
        ],
        labels: [{ x: 220, y: 175, text: "H₂O out — deprotonate → ester", color: "slate", size: 10 }],
      },
      {
        caption: { en: "ethyl acetate + H⁺ back", fa: "اتیل استات + H⁺ برمی‌گردد" },
        atoms: [
          { id: "r", el: "CH₃", x: 160, y: 85 },
          { id: "c", el: "C", x: 250, y: 85, bare: true },
          { id: "o", el: "O", x: 250, y: 30, dim: true },
          { id: "o", el: "O", x: 340, y: 85, dim: true },
          { id: "et", el: "Et", x: 410, y: 85 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "o2" },
        ],
        labels: [{ x: 300, y: 130, text: "fruity smell — the nose detects it", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["⇌", "⇌", "⇌"],
  },

  "acyl-socl2-chloride": {
    title: { en: "SOCl₂ — two gases escape, done", fa: "SOCl₂ — دو گاز خارج می‌شوند، تمام" },
    footnote: {
      en: "Chlorosulfite intermediate; Cl⁻ displaces it; SO₂ + HCl bubble off — Le Chatelier drags to completion.",
      fa: "واسط کلروسولفیت؛ Cl⁻ جایش را می‌گیرد؛ SO₂ + HCL حباب می‌زنند — لو شاتلیه تا کامل شدن می‌کشد.",
    },
    frames: [
      {
        caption: { en: "1 — chlorosulfite forms", fa: "۱ — ساخت کلروسولفیت" },
        atoms: [
          { id: "r", el: "CH₃", x: 130, y: 85 },
          { id: "c", el: "C", x: 215, y: 85, bare: true },
          { id: "o", el: "O", x: 215, y: 30, dim: true },
          { id: "s", el: "S", x: 310, y: 115, dim: true },
          { id: "ocl", el: "Cl", x: 365, y: 85, dim: true },
          { id: "o2", el: "O", x: 310, y: 165, dim: true },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 },
          { a: "c", b: "s", dash: true }, { a: "s", b: "ocl" }, { a: "s", b: "o2", order: 2 },
        ],
        curves: [{ from: "c", to: "s", bulge: -35 }],
        labels: [{ x: 220, y: 185, text: "acid OH attacks sulfur", color: "pink", size: 10, italic: true }],
      },
      {
        caption: { en: "2 — Cl⁻ displaces", fa: "۲ — جابه‌جایی با Cl⁻" },
        atoms: [
          { id: "r", el: "CH₃", x: 130, y: 85 },
          { id: "c", el: "C", x: 215, y: 85, bare: true },
          { id: "o", el: "O", x: 215, y: 30, dim: true },
          { id: "os", el: "OSOCl", x: 310, y: 115, dim: true },
          { id: "cl", el: "Cl⁻", x: 390, y: 55 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "os" }, { a: "c", b: "cl", dash: true },
        ],
        curves: [{ from: "cl", to: "c", bulge: -35 }],
      },
      {
        caption: { en: "3 — gases escape → acid chloride", fa: "۳ — خروج گازها ← اسید کلراید" },
        atoms: [
          { id: "r", el: "CH₃", x: 170, y: 85 },
          { id: "c", el: "C", x: 260, y: 85, bare: true },
          { id: "o", el: "O", x: 260, y: 30, dim: true },
          { id: "cl", el: "Cl", x: 350, y: 85 },
        ],
        bonds: [{ a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "cl" }],
        labels: [
          { x: 260, y: 140, text: "↑ SO₂ + HCl (fumes)", color: "pink", size: 11, italic: true },
        ],
      },
    ],
    connectors: ["→", "→"],
  },

  "acyl-hydrolysis-family": {
    title: { en: "Ester hydrolysis — acid (reversible) vs base (one-way)", fa: "هیدرولیز استر — اسیدی (برگشت‌پذیر) در برابر بازی (یک‌طرفه)" },
    footnote: {
      en: "Base route is irreversible because the carboxylate anion can't be attacked again — that's soap chemistry.",
      fa: "مسیر بازی برگشت‌ناپذیر است چون آنیون کربوکسیلات دیگر قابل حمله نیست — این شیمی صابون است.",
    },
    frames: [
      {
        caption: { en: "1 — OH⁻ attacks", fa: "۱ — حملهٔ OH⁻" },
        atoms: [
          { id: "r", el: "CH₃", x: 130, y: 85 },
          { id: "c", el: "C", x: 215, y: 85, bare: true },
          { id: "o", el: "O", x: 215, y: 30, dim: true },
          { id: "ome", el: "OMe", x: 305, y: 85 },
          { id: "oh", el: "OH⁻", x: 175, y: 150 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "ome" },
          { a: "oh", b: "c", dash: true },
        ],
        curves: [
          { from: "oh", to: "c", bulge: -30 },
          { from: "bond:c:o", to: "o", bulge: -25 },
        ],
      },
      {
        caption: { en: "2 — tetrahedral, OMe⁻ leaves", fa: "۲ — چهاروجهی، خروج OMe⁻" },
        atoms: [
          { id: "r", el: "CH₃", x: 130, y: 85 },
          { id: "c", el: "C", x: 215, y: 85, bare: true },
          { id: "o", el: "O⁻", x: 215, y: 30, dim: true },
          { id: "ome", el: "OMe", x: 305, y: 85, dim: true },
          { id: "oh", el: "OH", x: 215, y: 140 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o" }, { a: "c", b: "ome" }, { a: "c", b: "oh" },
        ],
        curves: [{ from: "bond:c:ome", to: "ome", bulge: 25 }],
      },
      {
        caption: { en: "3 — acid → instantly carboxylate", fa: "۳ — اسید ← فوراً کربوکسیلات" },
        atoms: [
          { id: "r", el: "CH₃", x: 150, y: 85 },
          { id: "c", el: "C", x: 240, y: 85, bare: true },
          { id: "o", el: "O", x: 240, y: 30, dim: true },
          { id: "oh", el: "OH", x: 240, y: 140, dim: true },
          { id: "ome", el: "MeO⁻", x: 340, y: 120 },
        ],
        bonds: [
          { a: "r", b: "c" }, { a: "c", b: "o", order: 2 }, { a: "c", b: "oh" },
        ],
        curves: [{ from: "bond:c:oh", to: "ome", bulge: -30 }],
        labels: [{ x: 245, y: 180, text: "RCOO⁻ — shielded, no re-attack: one-way!", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["→", "→"],
  },

  "acyl-claisen": {
    title: { en: "Claisen — ester enolate + ester, full base needed", fa: "کلایزن — انولات استر + استر، باز کامل لازم است" },
    footnote: {
      en: "The LAST deprotonation (active CH₂, pKa ~11) makes it irreversible — hence one FULL equivalent of NaOEt.",
      fa: "دی‌پروتونه شدن آخر (CH₂ فعال با pKa حدود ۱۱) واکنش را برگشت‌ناپذیر می‌کند — برای همین یک هم‌ارز کامل NaOEt.",
    },
    frames: [
      {
        caption: { en: "1 — ester enolate", fa: "۱ — انولات استر" },
        atoms: [
          { id: "c1", el: "C", x: 160, y: 85, bare: true },
          { id: "c2", el: "C", x: 250, y: 85, bare: true },
          { id: "o", el: "O", x: 250, y: 30, dim: true },
          { id: "oet", el: "OEt", x: 335, y: 85 },
          { id: "h", el: "H", x: 115, y: 120 },
        ],
        bonds: [
          { a: "c1", b: "c2" }, { a: "c2", b: "o", order: 2 }, { a: "c2", b: "oet" }, { a: "c1", b: "h" },
        ],
        curves: [{ from: "bond:c1:h", to: "c1", bulge: -30 }],
        condition: { x: 100, y: 55, text: "EtO⁻" },
      },
      {
        caption: { en: "2 — attacks another ester", fa: "۲ — به استر دیگر حمله می‌کند" },
        atoms: [
          { id: "ca", el: "C", x: 150, y: 85, charge: "δ-", bare: true },
          { id: "oa", el: "O⁻", x: 60, y: 55, dim: true },
          { id: "cb", el: "C", x: 290, y: 85, bare: true },
          { id: "ob", el: "O", x: 290, y: 30, dim: true },
          { id: "oet", el: "OEt", x: 380, y: 85 },
        ],
        bonds: [
          { a: "ca", b: "oa", order: 2, dash: true },
          { a: "cb", b: "ob", order: 2 }, { a: "cb", b: "oet" },
          { a: "ca", b: "cb", dash: true },
        ],
        curves: [{ from: "ca", to: "cb", bulge: -40 }],
      },
      {
        caption: { en: "3 — β-keto ester, EtO⁻ out", fa: "۳ — β-کتو استر، خروج EtO⁻" },
        atoms: [
          { id: "c1", el: "C", x: 130, y: 85 },
          { id: "o1", el: "O", x: 130, y: 30, dim: true },
          { id: "c2", el: "CH₂", x: 230, y: 85 },
          { id: "c3", el: "C", x: 330, y: 85, bare: true },
          { id: "o3", el: "O", x: 330, y: 30, dim: true },
          { id: "oet", el: "OEt", x: 415, y: 85 },
        ],
        bonds: [
          { a: "c1", b: "o1", order: 2 }, { a: "c1", b: "c2" },
          { a: "c2", b: "c3" }, { a: "c3", b: "o3", order: 2 }, { a: "c3", b: "oet" },
        ],
        labels: [{ x: 230, y: 140, text: "active CH₂ — deprotonated instantly (pKa 11)", color: "pink", size: 10, italic: true }],
      },
    ],
    connectors: ["⇌", "⇌"],
  },
};
