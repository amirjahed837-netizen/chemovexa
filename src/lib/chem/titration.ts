/** Exact titration engine — acid-base (mono/di/triprotic, T-dependent pKw) + redox curves. */

import { nernstSlope } from "./electrochem";

/* ---------------------------- pKw(T) ---------------------------- */

/** tabulated pKw of water (0–60 °C, standard reference values) */
const PKW_TABLE: [number, number][] = [
  [0, 14.9435],
  [10, 14.53],
  [20, 14.23],
  [25, 14.0],
  [30, 13.83],
  [40, 13.54],
  [50, 13.26],
  [60, 13.02],
];

export function pKwOf(tC: number): number {
  const t = Math.min(60, Math.max(0, tC));
  for (let i = 1; i < PKW_TABLE.length; i++) {
    const [t1, p1] = PKW_TABLE[i];
    if (t <= t1) {
      const [t0, p0] = PKW_TABLE[i - 1];
      return p0 + ((p1 - p0) * (t - t0)) / (t1 - t0);
    }
  }
  return 14.0;
}

/* ----------------------- acid-base engine ----------------------- */

export type AnalyteKind =
  | "strong-acid"
  | "weak-acid"
  | "weak-base"
  | "strong-base"
  | "diprotic"
  | "triprotic";

export type TitrationInput = {
  analyte: AnalyteKind;
  analyteM: number;
  analyteMl: number;
  titrantM: number;
  /** Ka1 (weak/diprotic/triprotic acid) or Kb (weak base) */
  k: number;
  /** Ka2 (diprotic/triprotic) */
  k2: number;
  /** Ka3 (triprotic) */
  k3: number;
  tempC: number;
};

export type TitrationPoint = { vMl: number; pH: number };

function kasOf(input: TitrationInput): number[] {
  switch (input.analyte) {
    case "weak-acid":
      return [input.k];
    case "diprotic":
      return [input.k, input.k2];
    case "triprotic":
      return [input.k, input.k2, input.k3];
    default:
      return [];
  }
}

/** α-fractions of the n+1 protonation states at [H+] = h (HnA, H(n-1)A⁻, …, A^n⁻) */
export function alphaFractions(kas: number[], h: number): number[] {
  const n = kas.length;
  const terms: number[] = [1];
  let acc = 1;
  for (let j = 1; j <= n; j++) {
    acc *= kas[j - 1];
    terms.push(acc);
  }
  let d = 0;
  for (let j = 0; j <= n; j++) {
    terms[j] *= h ** (n - j);
    d += terms[j];
  }
  return terms.map((term) => term / d);
}

/** mean negative charge per acid molecule: Σ j·α_j */
function chargeDensity(kas: number[], h: number): number {
  const alphas = alphaFractions(kas, h);
  let z = 0;
  for (let j = 1; j < alphas.length; j++) z += j * alphas[j];
  return z;
}

function solveH(f: (h: number) => number): number {
  let lo = -16;
  let hi = 0.5;
  for (let i = 0; i < 64; i++) {
    const mid = (lo + hi) / 2;
    if (f(10 ** mid) > 0) hi = mid;
    else lo = mid;
  }
  return 10 ** ((lo + hi) / 2);
}

function clampPH(pH: number, pKw: number): number {
  if (!Number.isFinite(pH)) return pKw / 2;
  return Math.min(pKw, Math.max(0, pH));
}

/** exact [H⁺] charge-balance solution at a given added volume */
export function titrationPH(input: TitrationInput, vMl: number): number {
  const pkw = pKwOf(input.tempC);
  const kw = 10 ** -pkw;
  const vTotal = (input.analyteMl + vMl) / 1000;
  const nAnalyte = input.analyteM * (input.analyteMl / 1000);
  const nTitrant = input.titrantM * (vMl / 1000);
  const cTotal = nAnalyte / vTotal;

  let f: (h: number) => number;

  switch (input.analyte) {
    case "strong-acid":
      f = (h) => h + nTitrant / vTotal - kw / h - nAnalyte / vTotal;
      break;
    case "strong-base":
      f = (h) => h + nAnalyte / vTotal - kw / h - nTitrant / vTotal;
      break;
    case "weak-acid":
    case "diprotic":
    case "triprotic": {
      const kas = kasOf(input);
      f = (h) => h + nTitrant / vTotal - kw / h - cTotal * chargeDensity(kas, h);
      break;
    }
    case "weak-base": {
      const kaConj = kw / input.k;
      f = (h) => h + (cTotal * h) / (h + kaConj) - kw / h - nTitrant / vTotal;
      break;
    }
  }

  const h = solveH(f);
  return clampPH(-Math.log10(h), pkw);
}

export function equivalenceMl(input: TitrationInput): number {
  const nAnalyte = input.analyteM * (input.analyteMl / 1000);
  return (nAnalyte / input.titrantM) * 1000;
}

export function titrationCurve(input: TitrationInput, maxMl: number, steps = 320): TitrationPoint[] {
  const points: TitrationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const vMl = (maxMl * i) / steps;
    points.push({ vMl, pH: titrationPH(input, vMl) });
  }
  return points;
}

/* ------------------------- redox engine ------------------------- */

export type RedoxInput = {
  analyteE0: number;
  analyteN: number;
  titrantE0: number;
  titrantN: number;
  analyteM: number;
  analyteMl: number;
  titrantM: number;
  tempC: number;
};

/** Ve for Red_A + Ox_T → Ox_A + Red_T — electron balance: nA·cA·vA = nT·cT·Ve */
export function redoxEquivalenceMl(
  cA: number,
  vA: number,
  nA: number,
  cT: number,
  nT: number,
): number {
  if (nA <= 0 || nT <= 0 || cT <= 0) return 0;
  return ((nA * cA * (vA / 1000)) / (nT * cT)) * 1000;
}

/** electrode potential vs titrant volume — two Nernst regions joined at the mixture point */
export function redoxPotential(input: RedoxInput, vMl: number): number {
  const ve = redoxEquivalenceMl(
    input.analyteM,
    input.analyteMl,
    input.analyteN,
    input.titrantM,
    input.titrantN,
  );
  if (ve <= 0) return input.analyteE0;
  const f = vMl / ve;
  if (f <= 1e-4) return input.analyteE0;
  const sA = nernstSlope(input.tempC, input.analyteN);
  const sT = nernstSlope(input.tempC, input.titrantN);
  if (f < 1 - 8e-4) {
    const ratio = Math.max(f, 1e-4) / Math.max(1 - f, 1e-6);
    return input.analyteE0 + sA * Math.log10(Math.max(ratio, 1e-6));
  }
  if (f <= 1 + 8e-4) {
    return (input.analyteN * input.analyteE0 + input.titrantN * input.titrantE0) /
      (input.analyteN + input.titrantN);
  }
  return input.titrantE0 + sT * Math.log10(Math.max(f - 1, 1e-4));
}

export type RedoxPoint = { vMl: number; eV: number };

export function redoxCurve(input: RedoxInput, maxMl: number, steps = 320): RedoxPoint[] {
  const points: RedoxPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const vMl = (maxMl * i) / steps;
    points.push({ vMl, eV: redoxPotential(input, vMl) });
  }
  return points;
}

/* --------------------- analysis helpers --------------------- */

/** first derivative d y / d V (central differences) of any sampled curve */
export function derivativeSeries<P extends { vMl: number }>(
  points: P[],
  yOf: (pt: P) => number,
): { vMl: number; dy: number }[] {
  const out: { vMl: number; dy: number }[] = [];
  for (let i = 0; i < points.length; i++) {
    const i0 = Math.max(0, i - 1);
    const i1 = Math.min(points.length - 1, i + 1);
    const dv = points[i1].vMl - points[i0].vMl;
    const dy = yOf(points[i1]) - yOf(points[i0]);
    out.push({ vMl: points[i].vMl, dy: dv > 0 ? dy / dv : 0 });
  }
  return out;
}

/** Gran plot least-squares fit (post-equivalence region) → estimated Ve */
export function granFit(
  input: TitrationInput,
  points: TitrationPoint[],
  ve: number,
): { slope: number; intercept: number; veEst: number; pts: { vMl: number; f: number }[] } | null {
  const pkw = pKwOf(input.tempC);
  const acidAnalyte = input.analyte !== "weak-base";
  const pts: { vMl: number; f: number }[] = [];
  for (const pt of points) {
    if (pt.vMl < ve * 1.05 || pt.vMl > ve * 1.7) continue;
    const vol = (input.analyteMl + pt.vMl) / 1000;
    const f = acidAnalyte ? vol * 10 ** (pt.pH - pkw) : vol * 10 ** -pt.pH;
    pts.push({ vMl: pt.vMl, f: f * 1000 });
  }
  if (pts.length < 8) return null;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (const p of pts) {
    sx += p.vMl; sy += p.f; sxx += p.vMl * p.vMl; sxy += p.vMl * p.f;
  }
  const n = pts.length;
  const denom = n * sxx - sx * sx;
  if (denom === 0) return null;
  const slope = (n * sxy - sx * sy) / denom;
  const intercept = (sy - slope * sx) / n;
  if (slope === 0 || !Number.isFinite(slope) || !Number.isFinite(intercept)) return null;
  return { slope, intercept, veEst: -intercept / slope, pts };
}

