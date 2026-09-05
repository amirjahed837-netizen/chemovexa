/**
 * Arrow-pushing mechanism diagram DSL — textbook style (Klein panels):
 * cream panel, dark skeletal structures, magenta curved arrows for
 * electron-pair movement, fishhooks for radicals.
 * All coordinates are in a 520 × 170 frame, always rendered LTR.
 */

export type DAtom = {
  id: string;
  el: string; // element symbol (or multi-char label like "OEt", "CH3")
  x: number;
  y: number;
  charge?: "+" | "-" | "2+" | "2-" | "δ+" | "δ-" | "−" | "δ−";
  /** lone pairs drawn as dot-pairs around the atom; angle in degrees (0=right, CCW) */
  lp?: { n?: number; angles: number[] };
  /** radical dot */
  rad?: boolean;
  /** hide the element text (vertex carbon) */
  bare?: boolean;
  /** small annotation like "H" count already inside el label */
  dim?: boolean;
};

export type DBond = {
  a: string;
  b: string;
  order?: 1 | 2 | 3;
  /** dashed (partial bond in TS / resonance) */
  dash?: boolean;
};

/** curved electron-push arrow. `from`/`to`: atom id, or bond id "bond:<a>:<b>" (midpoint). */
export type DCurve = {
  from: string;
  to: string;
  /** bulge side & magnitude: +1/-1 picks perpendicular side; default 30 */
  bulge?: number;
  /** fishhook (single-headed, radical) */
  fish?: boolean;
  label?: string;
};

export type DLabel = {
  x: number;
  y: number;
  text: string;
  color?: "teal" | "pink" | "slate" | "dark";
  size?: number;
  italic?: boolean;
  bold?: boolean;
};

export type DFrame = {
  caption?: { en: string; fa: string };
  atoms: DAtom[];
  bonds: DBond[];
  curves?: DCurve[];
  labels?: DLabel[];
  /** big glyph behind (e.g. "hν", "Δ") */
  condition?: { x: number; y: number; text: string };
};

export type DConnector = "→" | "⇌" | "↔" | "⇌slow" | "→slow" | "→hν" | "→Δ" | "→several";

export type MechanismDiagram = {
  title: { en: string; fa: string };
  footnote?: { en: string; fa: string };
  frames: DFrame[];
  /** connectors[i] sits between frames[i] and frames[i+1] */
  connectors?: DConnector[];
};

export const BOND_KEY = (a: string, b: string) => `bond:${[a, b].sort().join(":")}`;
