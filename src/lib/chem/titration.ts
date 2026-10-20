/** Acid-base titration engine (25 C, pKw = 14, monoprotic systems). */

const KW = 1e-14;

export type AnalyteKind = "strong-acid" | "weak-acid" | "weak-base";

export type TitrationInput = {
  analyte: AnalyteKind;
  analyteM: number;
  analyteMl: number;
  titrantM: number;
  k: number; // Ka for weak acid, Kb for weak base
};

export type TitrationPoint = { vMl: number; pH: number };

export function equivalenceMl(input: TitrationInput): number {
  const nAnalyte = input.analyteM * (input.analyteMl / 1000);
  return (nAnalyte / input.titrantM) * 1000;
}

export function titrationPH(input: TitrationInput, vMl: number): number {
  const vTotal = (input.analyteMl + vMl) / 1000;
  const nAnalyte = input.analyteM * (input.analyteMl / 1000);
  const nTitrant = input.titrantM * (vMl / 1000);
  const cTotal = nAnalyte / vTotal;

  let f: (h: number) => number;

  switch (input.analyte) {
    case "strong-acid": {
      const nCl = nAnalyte;
      f = (h) => h + nTitrant / vTotal - KW / h - nCl / vTotal;
      break;
    }
    case "weak-acid": {
      f = (h) => h + nTitrant / vTotal - KW / h - (cTotal * input.k) / (input.k + h);
      break;
    }
    case "weak-base": {
      const kaConj = KW / input.k;
      f = (h) => h + (cTotal * h) / (h + kaConj) - KW / h - nTitrant / vTotal;
      break;
    }
  }

  const h = solveH(f);
  return clampPH(-Math.log10(h));
}

function titrationCurve(input: TitrationInput, maxMl: number, steps = 320): TitrationPoint[] {
  const points: TitrationPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const vMl = (maxMl * i) / steps;
    points.push({ vMl, pH: titrationPH(input, vMl) });
  }
  return points;
}

export { titrationCurve };

function solveH(f: (h: number) => number): number {
  let lo = -16;
  let hi = 0;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    const h = 10 ** mid;
    if (f(h) > 0) hi = mid;
    else lo = mid;
  }
  return 10 ** ((lo + hi) / 2);
}

function clampPH(pH: number): number {
  if (!Number.isFinite(pH)) return 7;
  return Math.min(14, Math.max(0, pH));
}
