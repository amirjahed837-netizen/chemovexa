import { ELEMENTS, type ElementData } from "./periodic";
import { FA_NAMES } from "./periodic-fa";

/**
 * Layout + classification layer on top of the raw element list in
 * ./periodic.ts. Everything is derived from the atomic number using the
 * standard 18-column periodic table — no per-element position tables to drift.
 *
 * Electron configurations follow the Madelung (Aufbau) filling order with the
 * well-documented ground-state exceptions (Cr, Cu, Pd, Au, …) hard-coded.
 */

export type ElementCategory =
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

export type ElementBlock = "s" | "p" | "d" | "f";

export type ElementLayoutData = ElementData & {
  /** IUPAC group 1-18; 0 for the f-block rows (La–Lu / Ac–Lr). */
  group: number;
  period: number;
  /** visual grid row: 1-7 main table, 9/10 for the two f-block rows */
  row: number;
  /** 1-based column inside the f-block rows (undefined for main-table rows) */
  fColumn?: number;
  category: ElementCategory;
  block: ElementBlock;
  /** noble-gas shorthand, e.g. "[Ar] 3d⁵ 4s¹" */
  config: string;
};

/** legend display order */
export const CATEGORY_ORDER: ElementCategory[] = [
  "alkali", "alkaline", "transition", "postTransition", "metalloid",
  "nonmetal", "halogen", "noble", "lanthanide", "actinide",
];

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let z = a; z <= b; z++) out.push(z);
  return out;
}

const CATEGORY_Z: Record<ElementCategory, number[]> = {
  alkali: [3, 11, 19, 37, 55, 87],
  alkaline: [4, 12, 20, 38, 56, 88],
  transition: [
    ...range(21, 30), ...range(39, 48), ...range(72, 80), ...range(104, 112),
  ],
  postTransition: [13, 31, 49, 50, 81, 82, 83, 113, 114, 115, 116],
  metalloid: [5, 14, 32, 33, 51, 52],
  nonmetal: [1, 6, 7, 8, 15, 16, 34],
  halogen: [9, 17, 35, 53, 85, 117],
  noble: [2, 10, 18, 36, 54, 86, 118],
  lanthanide: range(57, 71),
  actinide: range(89, 103),
};

export function categoryOf(z: number): ElementCategory {
  for (const cat of CATEGORY_ORDER) {
    if (CATEGORY_Z[cat].includes(z)) return cat;
  }
  return "transition";
}

/** standard 18-column layout, derived from Z */
function positionOf(z: number): {
  group: number;
  period: number;
  row: number;
  fColumn?: number;
} {
  if (z === 1) return { group: 1, period: 1, row: 1 };
  if (z === 2) return { group: 18, period: 1, row: 1 };
  if (z <= 4) return { group: z - 2, period: 2, row: 2 }; // 3→1, 4→2
  if (z <= 10) return { group: z + 8, period: 2, row: 2 }; // 5→13 … 10→18
  if (z <= 12) return { group: z - 10, period: 3, row: 3 };
  if (z <= 18) return { group: z, period: 3, row: 3 }; // 13→13 … 18→18
  if (z <= 36) return { group: z - 18, period: 4, row: 4 };
  if (z <= 38) return { group: z - 36, period: 5, row: 5 };
  if (z <= 54) return { group: z - 36, period: 5, row: 5 };
  if (z <= 56) return { group: z - 54, period: 6, row: 6 };
  if (z <= 71) return { group: 0, period: 6, row: 9, fColumn: z - 56 }; // La=57 → col 1
  if (z <= 86) return { group: z - 68, period: 6, row: 6 }; // 72→4 … 86→18
  if (z <= 88) return { group: z - 86, period: 7, row: 7 };
  if (z <= 103) return { group: 0, period: 7, row: 10, fColumn: z - 88 }; // Ac=89 → col 1
  return { group: z - 100, period: 7, row: 7 }; // 104→4 … 118→18
}

function blockOf(z: number, category: ElementCategory, group: number): ElementBlock {
  if (category === "lanthanide" || category === "actinide") return "f";
  if (z === 2) return "s"; // He configures as 1s² but sits in group 18
  if (group <= 2) return "s";
  if (group >= 13) return "p";
  return "d";
}

/* ------------------------ electron configuration ------------------------- */

const FILL_ORDER: [string, number][] = [
  ["1s", 2], ["2s", 2], ["2p", 6], ["3s", 2], ["3p", 6], ["4s", 2], ["3d", 10],
  ["4p", 6], ["5s", 2], ["4d", 10], ["5p", 6], ["6s", 2], ["4f", 14], ["5d", 10],
  ["6p", 6], ["7s", 2], ["5f", 14], ["6d", 10], ["7p", 6],
];

const NOBLE_CORE: [number, string][] = [
  [86, "[Rn]"], [54, "[Xe]"], [36, "[Kr]"], [18, "[Ar]"], [10, "[Ne]"], [2, "[He]"],
];

/** documented ground-state exceptions to the Aufbau order (vs noble core) */
const CONFIG_EXCEPTIONS: Record<number, [string, number][]> = {
  24: [["3d", 5], ["4s", 1]],
  29: [["3d", 10], ["4s", 1]],
  41: [["4d", 4], ["5s", 1]],
  42: [["4d", 5], ["5s", 1]],
  44: [["4d", 7], ["5s", 1]],
  45: [["4d", 8], ["5s", 1]],
  46: [["4d", 10]],
  47: [["4d", 10], ["5s", 1]],
  57: [["5d", 1], ["6s", 2]],
  58: [["4f", 1], ["5d", 1], ["6s", 2]],
  64: [["4f", 7], ["5d", 1], ["6s", 2]],
  78: [["4f", 14], ["5d", 9], ["6s", 1]],
  79: [["4f", 14], ["5d", 10], ["6s", 1]],
  89: [["6d", 1], ["7s", 2]],
  90: [["6d", 2], ["7s", 2]],
  91: [["5f", 2], ["6d", 1], ["7s", 2]],
  92: [["5f", 3], ["6d", 1], ["7s", 2]],
  93: [["5f", 4], ["6d", 1], ["7s", 2]],
  96: [["5f", 7], ["6d", 1], ["7s", 2]],
  103: [["5f", 14], ["7s", 2], ["7p", 1]],
};

const SUP = "⁰¹²³⁴⁵⁶⁷⁸⁹";

function sup(n: number): string {
  return String(n)
    .split("")
    .map((d) => SUP[Number(d)])
    .join("");
}

function aufbau(electrons: number): [string, number][] {
  const parts: [string, number][] = [];
  let left = electrons;
  for (const [orbital, cap] of FILL_ORDER) {
    if (left <= 0) break;
    const n = Math.min(left, cap);
    parts.push([orbital, n]);
    left -= n;
  }
  return parts;
}

function configOf(z: number): string {
  // H and He are shown in full — "[He]" for helium itself is not standard
  const core = z > 2 ? NOBLE_CORE.find(([n]) => n < z) : undefined;

  if (!core) {
    return aufbau(z).map(([o, n]) => `${o}${sup(n)}`).join(" ");
  }

  const exception = CONFIG_EXCEPTIONS[z];
  if (exception) {
    return `${core[1]} ${exception.map(([o, n]) => `${o}${sup(n)}`).join(" ")}`;
  }

  // advance past the shells consumed by the noble core, then fill the rest
  let consumed = 0;
  let i = 0;
  while (i < FILL_ORDER.length && consumed + FILL_ORDER[i][1] <= core[0]) {
    consumed += FILL_ORDER[i][1];
    i++;
  }
  let left = z - core[0];
  const parts: [string, number][] = [];
  for (; i < FILL_ORDER.length && left > 0; i++) {
    const [orbital, cap] = FILL_ORDER[i];
    const n = Math.min(left, cap);
    parts.push([orbital, n]);
    left -= n;
  }
  // display conventionally: ascending n, then s < p < d < f
  parts.sort((a, b) => shellKey(a[0]) - shellKey(b[0]));
  return `${core[1]} ${parts.map(([o, n]) => `${o}${sup(n)}`).join(" ")}`;
}

/** sort key: principal quantum number n first, then subshell l (s<p<d<f) */
function shellKey(orbital: string): number {
  const n = Number(orbital[0]);
  const lRank = { s: 0, p: 1, d: 2, f: 3 } as Record<string, number>;
  return n * 10 + lRank[orbital[1]];
}

/* ------------------------------ assembled -------------------------------- */

export const PERIODIC_ELEMENTS: ElementLayoutData[] = ELEMENTS.map((el) => {
  const category = categoryOf(el.z);
  const pos = positionOf(el.z);
  return {
    ...el,
    group: pos.group,
    period: pos.period,
    row: pos.row,
    fColumn: pos.fColumn,
    category,
    block: blockOf(el.z, category, pos.group),
    config: configOf(el.z),
  };
}).sort((a, b) => a.z - b.z);

export function elementFaName(symbol: string): string | undefined {
  return FA_NAMES[symbol];
}
