import { elementMass } from "./periodic";

export class FormulaError extends Error {}

export type Counts = Map<string, number>;

export type ParsedFormula = {
  counts: Counts;
  atoms: number;
};

const HYDRATE_SPLIT = /\s*[·•∙*]\s*|\.(?=[A-Z(\[])/;
const LEADING_COEFF = /^(\d+)\s*(?=[A-Z(\[])/;

function readInt(s: string, i: { v: number }): number | null {
  const m = /^\d+/.exec(s.slice(i.v));
  if (!m) return null;
  i.v += m[0].length;
  return parseInt(m[0], 10);
}

function mergeInto(target: Counts, src: Counts): void {
  for (const [sym, n] of src) {
    target.set(sym, (target.get(sym) ?? 0) + n);
  }
}

function scaled(src: Counts, k: number): Counts {
  const out: Counts = new Map();
  for (const [sym, n] of src) out.set(sym, n * k);
  return out;
}

function parseSequence(s: string, i: { v: number }): Counts {
  const openers: Record<string, string> = { "(": ")", "[": "]" };

  const out: Counts = new Map();
  while (i.v < s.length) {
    const ch = s[i.v];
    if (ch in openers) {
      const close = openers[ch];
      i.v += 1;
      const inner = parseSequence(s, i);
      if (s[i.v] !== close) throw new FormulaError(`Unclosed "${ch}" bracket.`);
      i.v += 1;
      const mult = readInt(s, i) ?? 1;
      mergeInto(out, scaled(inner, mult));
    } else if (ch === ")" || ch === "]") {
      break;
    } else if (/[A-Z]/.test(ch)) {
      const m = /^[A-Z][a-z]?/.exec(s.slice(i.v));
      if (!m) throw new FormulaError(`Unexpected character "${ch}".`);
      const sym = m[0];
      try {
        elementMass(sym);
      } catch {
        throw new FormulaError(`Unknown element "${sym}".`);
      }
      i.v += sym.length;
      const mult = readInt(s, i) ?? 1;
      out.set(sym, (out.get(sym) ?? 0) + mult);
    } else {
      throw new FormulaError(`Unexpected character "${ch}".`);
    }
  }
  return out;
}

export function parseFormula(raw: string): ParsedFormula {
  const input = raw.trim();
  if (!input) throw new FormulaError("Enter a formula.");

  let cleaned = input.replace(/\s+/g, "");
  cleaned = cleaned.replace(/\^[0-9]*[+-]$/, "");
  if (/[A-Z)\]]/.test(cleaned.slice(0, -1))) {
    cleaned = cleaned.replace(/[+-]$/, "");
  }

  if (!cleaned || !/[A-Z]/.test(cleaned)) {
    throw new FormulaError("No elements found — use symbols like H2O or Ca(OH)2.");
  }

  const parts = cleaned.split(HYDRATE_SPLIT).filter(Boolean);
  const counts: Counts = new Map();
  let atoms = 0;

  for (const part of parts) {
    const coeffMatch = LEADING_COEFF.exec(part);
    const multiplier = coeffMatch ? parseInt(coeffMatch[1], 10) : 1;
    const body = coeffMatch ? part.slice(coeffMatch[0].length) : part;
    if (!body) throw new FormulaError(`Empty hydrate unit in "${input}".`);

    const i = { v: 0 };
    const partCounts = parseSequence(body, i);
    if (i.v < body.length) {
      throw new FormulaError(`Unexpected "${body[i.v]}" in formula.`);
    }
    if (partCounts.size === 0) throw new FormulaError(`Nothing to parse in "${part}".`);

    for (const [sym, n] of partCounts) {
      const total = n * multiplier;
      counts.set(sym, (counts.get(sym) ?? 0) + total);
      atoms += total;
    }
  }

  return { counts, atoms };
}

export function molarMass(counts: Counts): number {
  let total = 0;
  for (const [sym, n] of counts) total += elementMass(sym) * n;
  return total;
}

export type CompositionRow = {
  symbol: string;
  count: number;
  subtotal: number;
  percent: number;
};

export function composition(counts: Counts): CompositionRow[] {
  const total = molarMass(counts);
  const rows: CompositionRow[] = [];
  for (const [symbol, count] of counts) {
    const subtotal = elementMass(symbol) * count;
    rows.push({
      symbol,
      count,
      subtotal,
      percent: total > 0 ? (subtotal / total) * 100 : 0,
    });
  }
  return rows.sort((a, b) => b.percent - a.percent);
}
