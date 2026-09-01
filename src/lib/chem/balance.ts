import { parseFormula } from "./formula";

export type Side = "left" | "right";

export type SpeciesInput = {
  formula: string;
  side: Side;
};

export type BalancedSpecies = {
  formula: string;
  coeff: number;
};

export type BalanceResult =
  | { ok: true; species: BalancedSpecies[]; gcd: number }
  | { ok: false; error: string };

const STRUCTURAL_BOND = /[=≡#\-−–]/g;

/**
 * Converts a plain structural formula like "CH2=CH-CH2-CH3" or "CH3CHO" into
 * its empirical molecular summary (e.g. "C4H8") so the balancer can handle
 * notation that molecular formulas cannot express directly. Grouped repeating
 * units "CH2)2" or "(CH2)2" are supported.
 */
export function normalizeStructuralFormula(raw: string): string {
  const input = raw.trim();
  if (!STRUCTURAL_BOND.test(input)) return input;
  STRUCTURAL_BOND.lastIndex = 0;

  let s = input.replace(/\s+/g, "").replace(/[=≡#\-−–]/g, "");
  s = s.replace(/^\^?[0-9]*[+-]/, "");

  let out = "";
  let i = 0;
  while (i < s.length) {
    const ch = s[i];
    if (ch === "(") {
      const close = s.indexOf(")", i);
      if (close === -1) throw new Error(`Unclosed "(" in "${input}".`);
      const inner = s.slice(i + 1, close);
      const rest = /^(\d+)/.exec(s.slice(close + 1));
      const mult = rest ? parseInt(rest[1], 10) : 1;
      const expanded = inner.repeat(mult);
      out += expanded;
      i = close + 1 + (rest ? rest[1].length : 0);
    } else {
      out += ch;
      i += 1;
    }
  }
  if (!/[A-Z]/.test(out)) throw new Error(`No elements found in "${input}".`);
  return out;
}

function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

type Frac = { n: bigint; d: bigint };

function frac(n: bigint, d: bigint): Frac {
  if (d < 0n) {
    n = -n;
    d = -d;
  }
  const g = gcdBig(n, d);
  return { n: n / g, d: d / g };
}

function gcdBig(a: bigint, b: bigint): bigint {
  a = a < 0n ? -a : a;
  b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}

function fSub(a: Frac, b: Frac): Frac {
  return frac(a.n * b.d - b.n * a.d, a.d * b.d);
}

function fMul(a: Frac, b: Frac): Frac {
  return frac(a.n * b.n, a.d * b.d);
}

function fDiv(a: Frac, b: Frac): Frac {
  return frac(a.n * b.d, a.d * b.n);
}

/**
 * Balances a chemical equation by finding the nullspace of the element
 * conservation matrix using exact rational Gauss-Jordan elimination,
 * then scaling the solution to the smallest positive integers.
 *
 * Returns null if no valid balance exists (or the system is degenerate).
 */
export function balanceEquation(inputs: SpeciesInput[]): BalanceResult {
  if (inputs.length < 2) {
    return { ok: false, error: "Need at least two species." };
  }

  const parsed: { formula: string; counts: Map<string, number>; side: Side }[] = [];
  try {
    for (const input of inputs) {
      if (!input.formula.trim()) throw new Error("Every species needs a formula.");
      const normalized = normalizeStructuralFormula(input.formula);
      parsed.push({
        formula: input.formula.trim(),
        counts: parseFormula(normalized).counts,
        side: input.side,
      });
    }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Invalid formula." };
  }

  const elements = new Set<string>();
  for (const p of parsed) {
    for (const el of p.counts.keys()) elements.add(el);
  }
  const elList = [...elements];
  const cols = parsed.length;

  // Conservation: sum over reactants ν·n(el) − sum over products ν·n(el) = 0
  const A: Frac[][] = [];
  for (const el of elList) {
    A.push(
      parsed.map((p) => ({
        n: BigInt((p.counts.get(el) ?? 0) * (p.side === "left" ? 1 : -1)),
        d: 1n,
      })),
    );
  }

  // Solve A·ν = 0 → find nullspace vector
  const m = A.map((r) => [...r]);
  const pivots: number[] = [];
  let row = 0;
  for (let col = 0; col < cols && row < m.length; col++) {
    let pivot = -1;
    for (let r = row; r < m.length; r++) {
      if (m[r][col].n !== 0n) {
        pivot = r;
        break;
      }
    }
    if (pivot === -1) continue;
    [m[row], m[pivot]] = [m[pivot], m[row]];
    const pv = m[row][col];

    // normalize pivot row
    for (let c = 0; c < cols; c++) m[row][c] = fDiv(m[row][c], pv);

    for (let r = 0; r < m.length; r++) {
      if (r === row || m[r][col].n === 0n) continue;
      const factor = m[r][col];
      for (let c = 0; c < cols; c++) {
        m[r][c] = fSub(m[r][c], fMul(factor, m[row][c]));
      }
    }
    pivots.push(col);
    row++;
  }

  const freeCols = Array.from({ length: cols }, (_, i) => i).filter((c) => !pivots.includes(c));
  if (freeCols.length !== 1) {
    if (freeCols.length === 0) {
      const leftOnly: string[] = [];
      const rightOnly: string[] = [];
      for (const el of elList) {
        const l = parsed
          .filter((p) => p.side === "left")
          .reduce((acc, p) => acc + (p.counts.get(el) ?? 0), 0);
        const r = parsed
          .filter((p) => p.side === "right")
          .reduce((acc, p) => acc + (p.counts.get(el) ?? 0), 0);
        if (l > 0 && r === 0) leftOnly.push(el);
        if (r > 0 && l === 0) rightOnly.push(el);
      }
      const parts: string[] = [];
      if (leftOnly.length > 0) {
        parts.push(
          `${leftOnly.join(", ")} appear(s) only on the reactant side — a product containing it is missing`,
        );
      }
      if (rightOnly.length > 0) {
        parts.push(
          `${rightOnly.join(", ")} appear(s) only on the product side — a reactant containing it is missing`,
        );
      }
      return {
        ok: false,
        error: parts.length
          ? `This reaction cannot be balanced as written: ${parts.join("; ")}.`
          : "No non-trivial solution — check that this reaction can be balanced.",
      };
    }
    return {
      ok: false,
      error:
        "Underdetermined system — remove or combine species until exactly one free variable remains.",
    };
  }

  const free = freeCols[0];
  const solution: Frac[] = new Array(cols);
  solution[free] = frac(1n, 1n);
  for (let i = 0; i < pivots.length; i++) {
    const pc = pivots[i];
    solution[pc] = fSub(frac(0n, 1n), m[i][free]);
  }

  // scale to smallest positive integers
  let lcmDen = 1n;
  for (const s of solution) lcmDen = (lcmDen * s.d) / gcdBig(lcmDen, s.d);
  let ints = solution.map((s) => Number((s.n * lcmDen) / s.d));
  const g = ints.reduce((acc, v) => gcd(acc, v), 0);
  ints = ints.map((v) => v / g);

  if (ints.some((v) => v <= 0)) {
    const hasIdle = ints.some((v) => v === 0);
    return {
      ok: false,
      error: hasIdle
        ? "Some listed species don't take part in this reaction — remove them."
        : "This combination only balances with negative coefficients — reverse it.",
    };
  }

  return {
    ok: true,
    gcd: g,
    species: parsed.map((p, i) => ({ formula: p.formula, coeff: ints[i] })),
  };
}
