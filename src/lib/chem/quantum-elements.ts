import raw from "./quantum-elements.json";

export type SubshellL = "s" | "p" | "d" | "f";

export type QuantumSubshell = {
  label: string;
  n: number;
  l: SubshellL;
  e: number;
  max: number;
};

export type MoleculeGeom =
  | "diatomic"
  | "bent"
  | "linear3"
  | "trigonal"
  | "pyramidal"
  | "square"
  | "bipyramidal"
  | "octahedral"
  | "tetrahedral";

export type ElementCategoryId =
  | "alkali"
  | "alkaline"
  | "transition"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export type OrbitalBlock = "s" | "p" | "d" | "f";

export type QuantumElement = {
  z: number;
  sym: string;
  name: string;
  fa: string;
  mass: number;
  shells: number[];
  config: string;
  subshells: QuantumSubshell[];
  block: OrbitalBlock;
  group: number;
  period: number;
  cat: string;
  neutrons: number;
  valence: number;
  row: number;
  col: number;
  uses: string[];
  lines: number[];
  specSource: string;
  specUrl: string;
  mol: {
    formula: string;
    fa: string;
    geom: MoleculeGeom;
    ligands: string[];
  };
};

/** Spectrum source names are EN-only dataset strings — shown inside LTR spans. */
export type RawElement = QuantumElement;

export const QUANTUM_ELEMENTS: QuantumElement[] = raw as QuantumElement[];

const QUANTUM_MAP = new Map<number, QuantumElement>(
  QUANTUM_ELEMENTS.map((el) => [el.z, el]),
);

export function getQuantumElement(z: number): QuantumElement | undefined {
  return QUANTUM_MAP.get(z);
}

/* ------------------------------------------------------------------ */
/* Category + orbital visual metadata                                  */
/* ------------------------------------------------------------------ */

/** i18n category keys live under pages.quantum.categories */
export type QuantumCategory =
  | "alkali"
  | "alkaline"
  | "transition"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export type CategoryMeta = {
  hex: string;
  bg: string;
  border: string;
  /** key inside t.pages.quantum.categories */
  i18nKey:
    | "alkali"
    | "alkaline"
    | "transition"
    | "postTransition"
    | "metalloid"
    | "nonmetal"
    | "halogen"
    | "noble"
    | "lanthanide"
    | "actinide";
};

export const CATEGORY_META: Record<CategoryId, CategoryMeta> = {
  alkali: { hex: "#f43f5e", bg: "rgba(244,63,94,0.16)", border: "rgba(244,63,94,0.5)", i18nKey: "alkali" },
  alkaline: { hex: "#fb923c", bg: "rgba(251,146,60,0.16)", border: "rgba(251,146,60,0.5)", i18nKey: "alkaline" },
  transition: { hex: "#38bdf8", bg: "rgba(56,189,248,0.14)", border: "rgba(56,189,248,0.45)", i18nKey: "transition" },
  "post-transition": {
    hex: "#34d399",
    bg: "rgba(52,211,153,0.16)",
    border: "rgba(52,211,153,0.5)",
    i18nKey: "postTransition",
  },
  metalloid: { hex: "#a3e635", bg: "rgba(163,230,53,0.16)", border: "rgba(163,230,53,0.5)", i18nKey: "metalloid" },
  nonmetal: { hex: "#2dd4bf", bg: "rgba(45,212,191,0.16)", border: "rgba(45,212,191,0.5)", i18nKey: "nonmetal" },
  halogen: { hex: "#facc15", bg: "rgba(250,204,21,0.16)", border: "rgba(250,204,21,0.5)", i18nKey: "halogen" },
  noble: { hex: "#22d3ee", bg: "rgba(34,211,238,0.2)", border: "rgba(34,211,238,0.7)", i18nKey: "noble" },
  lanthanide: { hex: "#f472b6", bg: "rgba(244,114,182,0.16)", border: "rgba(244,114,182,0.5)", i18nKey: "lanthanide" },
  actinide: { hex: "#c084fc", bg: "rgba(192,132,252,0.16)", border: "rgba(192,132,252,0.5)", i18nKey: "actinide" },
};

export type CategoryId =
  | "alkali"
  | "alkaline"
  | "transition"
  | "post-transition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export const CATEGORY_ORDER: CategoryId[] = [
  "alkali",
  "alkaline",
  "transition",
  "post-transition",
  "metalloid",
  "nonmetal",
  "halogen",
  "noble",
  "lanthanide",
  "actinide",
];

/** map dataset category ids onto the i18n dictionary keys */
export const CATEGORY_I18N: Record<CategoryId, CategoryKey> = {
  alkali: "alkali",
  alkaline: "alkaline",
  transition: "transition",
  "post-transition": "postTransition",
  metalloid: "metalloid",
  nonmetal: "nonmetal",
  halogen: "halogen",
  noble: "noble",
  lanthanide: "lanthanide",
  actinide: "actinide",
};

export type CategoryKey =
  | "alkali"
  | "alkaline"
  | "transition"
  | "postTransition"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "noble"
  | "lanthanide"
  | "actinide";

export type OrbitalL = "s" | "p" | "d" | "f";

export const ORBITAL_COLORS: Record<
  OrbitalL,
  { pos: number; neg: number; css: string }
> = {
  s: { pos: 0x22d3ee, neg: 0x0ea5e9, css: "#22d3ee" },
  p: { pos: 0xe879f9, neg: 0x818cf8, css: "#e879f9" },
  d: { pos: 0xfbbf24, neg: 0xf97316, css: "#fbbf24" },
  f: { pos: 0x34d399, neg: 0x14b8a6, css: "#34d399" },
};

export const SHELL_LETTERS = ["K", "L", "M", "N", "O", "P", "Q"] as const;

/** classic Aufbau spin-box arrows: ↑ singly occupied, ⇅ paired, · empty */
export function formatSpinArrows(eCount: number, maxE: number): string {
  const boxes = maxE / 2;
  const up = Math.min(boxes, eCount);
  const down = Math.max(0, eCount - boxes);
  const out: string[] = [];
  for (let i = 0; i < boxes; i++) {
    if (i < down) out.push("⇅");
    else if (i < up) out.push("↑");
    else out.push("·");
  }
  return out.join("");
}

export type OrbitalFilter = "all" | OrbitalL | "none";

export type ViewMode = "atom" | "molecule" | "table3d";
