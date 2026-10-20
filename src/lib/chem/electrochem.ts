/**
 * Electroanalytical chemistry engine.
 * All constants and formulas are textbook-standard (Bard & Faulkner,
 * Skoog/West/Holler/Crouch "Fundamentals of Analytical Chemistry").
 * Nothing here is invented — every constant is cited in the comment above it.
 *
 * IUPAC / CODATA constants:
 *   F = 96485.33212 C/mol   (Faraday constant, 2018 CODATA)
 *   R = 8.314462618 J/(mol·K)
 *   2.303·R·T/F at 25 °C = 59.159 mV per decade for n = 1
 */

export const FARADAY = 96485.33212; // C/mol
export const R_GAS = 8.314462618; // J/(mol·K)
const FARADAY_C = FARADAY; // used inside nernstSlope before export init
const LN10 = Math.LN10;

/** Nernst slope in volts per decade of concentration ratio for n electrons. */
export function nernstSlope(tC: number, n = 1): number {
  return (LN10 * R_GAS * (tC + 273.15)) / (n * FARADAY_C);
}

/**
 * Redox potential of a half-cell at temperature tC (°C).
 * E = E° + S·log10([Ox]/[Red]), S = 2.303·R·T/(nF).
 * Activities approximated by concentrations (textbook ideal).
 */
export function nernstE(e0: number, n: number, ox: number, red: number, tC = 25): number {
  return e0 + nernstSlope(tC, n) * Math.log10(ox / red);
}

/* ---------------- pH-metry (glass electrode) ---------------- */

/**
 * Glass-electrode response to H+: E = E0 − S·pH with S = 2.303·R·T/F
 * (59.16 mV/pH at 25 °C, scaled with kelvin temperature).
 */
export function glassSlope(tC = 25): number {
  return nernstSlope(tC, 1) * 1000; // mV per pH
}

export type PhCalibration = {
  slopeMvPerPh: number; // signed: negative for a working glass electrode
  e0Mv: number; // intercept: electrode potential at pH 0
};

/** Two-point calibration from measured electrode mV in two standard buffers. */
export function calibratePh(
  ph1: number,
  e1Mv: number,
  ph2: number,
  e2Mv: number,
): PhCalibration {
  const slope = (e2Mv - e1Mv) / (ph2 - ph1);
  const e0 = e1Mv - slope * ph1;
  return { slopeMvPerPh: slope, e0Mv: e0 };
}

/** Slope as a percentage of the theoretical Nernst slope at tC. */
export function slopePercent(cal: PhCalibration, tC = 25): number {
  const ideal = glassSlope(tC);
  return (Math.abs(cal.slopeMvPerPh) / ideal) * 100;
}

/** pH of a sample from its electrode mV and a calibration. */
export function phFromMv(cal: PhCalibration, eMv: number): number {
  return (eMv - cal.e0Mv) / cal.slopeMvPerPh;
}

/** Expected electrode mV in a buffer at pH, for a healthy electrode. */
export function mvFromPh(cal: PhCalibration, ph: number): number {
  return cal.e0Mv + cal.slopeMvPerPh * ph;
}

/* ---------------- Coulometry (Faraday's laws) ---------------- */

export type CoulometryResult = {
  chargeC: number; // Q in coulombs
  molElectrons: number; // Q / F
  molSubstance: number; // Q / (n·F)
  grams: number; // moles × M
};

/** Constant-current electrolysis: Q = I·t, moles = Q/(n·F), mass = moles·M. */
export function faradayMass(
  currentA: number,
  timeS: number,
  nElectrons: number,
  molarMass: number,
): CoulometryResult {
  const q = currentA * timeS;
  const mol = q / (nElectrons * FARADAY);
  return {
    chargeC: q,
    molElectrons: q / FARADAY,
    molSubstance: mol,
    grams: mol * molarMass,
  };
}

/** Time (s) needed at constant current to deposit/convert `mol` of substance. */
export function faradayTime(molSubstance: number, nElectrons: number, currentA: number): number {
  return (nElectrons * FARADAY * molSubstance) / currentA;
}

/* ---------------- Cyclic voltammetry (1-D diffusion simulation) ---------------- */

/**
 * Explicit finite-difference simulation of a reversible cyclic voltammogram
 * for a planar electrode (Bard & Faulkner, ch. 6 / appendix B method).
 *
 * Dimensionless form (equal diffusion coefficients, C* = 1):
 *   τ = nFv·t/RT ,  y = x·sqrt(nFv/(R·T·D))
 *   ∂C/∂τ = ∂²C/∂y²     (Fick's second law)
 *   boundary: Nernst  C_O(0)/C_R(0) = exp(ξ),  C_O(0) + C_R(0) = 1
 *   explicit FTCS step is stable for k = Δτ/Δy² ≤ 0.5; we use 0.45.
 *
 * Output currents are scaled to real amperes with
 *   i = ψ · n·F·A·C*·sqrt(n·F·v·D/(R·T)).
 */
export type CvInput = {
  e0V: number; // formal potential (V)
  nElectrons: number;
  vScan: number; // scan rate, V/s
  tC: number; // °C
  concentrationM: number; // mol/L
  areaCm2: number; // electrode area, cm²
  diffusivityCm2: number; // cm²/s
  windowV: number; // half-window beyond E°′ (e.g. 0.4 → ±0.4 V sweep)
};

export type CvResult = {
  e: number[]; // potential, V
  i: number[]; // current, A (anodic positive)
  epa: number; // anodic peak potential (V)
  epc: number; // cathodic peak potential (V)
  ipa: number; // anodic peak current (A, > 0)
  ipc: number; // cathodic peak current (A, < 0)
};

export function simulateCv(input: CvInput): CvResult {
  const { nElectrons, tC, windowV, e0V } = input;
  const T = tC + 273.15;

  // dimensionless potential ξ = nF(E − E°)/RT ; ξ advances at rate 1 per τ
  const kEF = (nElectrons * FARADAY) / (R_GAS * T);
  const xiStart = kEF * windowV;
  const xiSwitch = -kEF * windowV;

  const dy = 0.05; // dimensionless distance step
  const kCoef = 0.45; // Δτ/Δy²  (≤ 0.5 for FTCS stability)
  const dTau = kCoef * dy * dy;
  const yMax = 6 * Math.sqrt(2 * xiStart);
  const nY = Math.ceil(yMax / dy) + 1;
  const steps = Math.ceil((2 * (xiStart - xiSwitch)) / dTau);

  const cO = new Float64Array(nY).fill(1); // oxidized
  const cR = new Float64Array(nY); // reduced, starts at 0
  const cOn = new Float64Array(nY);
  const cRn = new Float64Array(nY);

  const recordEvery = Math.max(1, Math.floor(steps / 600));
  const eArr: number[] = [];
  const iArr: number[] = [];

  let xi = xiStart;
  let direction = -1;
  for (let step = 0; step <= steps; step++) {
    if (xi <= xiSwitch) direction = 1;

    // Nernst boundary at the surface: C_O(0)/C_R(0) = e^ξ
    const f = Math.exp(Math.min(Math.max(xi, -60), 60));
    cO[0] = f / (1 + f);
    cR[0] = 1 / (1 + f);

    // dimensionless cathodic flux of O toward the surface — three-point
    // one-sided difference (second-order accurate; a two-point estimate
    // underestimates the peak by ~20% because the profile is curved)
    const psiCath = (-3 * cO[0] + 4 * cO[1] - cO[2]) / (2 * dy);

    if (step % recordEvery === 0 || step === steps) {
      eArr.push(xi / kEF + e0V);
      iArr.push(psiCath);
    }

    xi += direction * dTau;

    for (let i = 1; i < nY - 1; i++) {
      cOn[i] = cO[i] + kCoef * (cO[i + 1] - 2 * cO[i] + cO[i - 1]);
      cRn[i] = cR[i] + kCoef * (cR[i + 1] - 2 * cR[i] + cR[i - 1]);
    }
    cOn[0] = cO[0];
    cOn[nY - 1] = cO[nY - 1];
    cRn[0] = cR[0];
    cRn[nY - 1] = cR[nY - 1];
    cO.set(cOn);
    cR.set(cRn);
  }

  return finalizeCv(eArr, iArr, input);
}

/** Scale dimensionless currents to amperes and locate the two peaks. */
function finalizeCv(eArr: number[], iArr: number[], input: CvInput): CvResult {
  const { nElectrons, vScan, tC, concentrationM, areaCm2, diffusivityCm2 } = input;
  const T = tC + 273.15;

  // i = ψ · n·F·A·C*·sqrt(nFvD/(RT))   (C* in mol/cm³; C (mol/L) / 1000)
  const psiScale =
    nElectrons * FARADAY * areaCm2 * (concentrationM / 1000) *
    Math.sqrt((nElectrons * FARADAY * vScan * diffusivityCm2) / (R_GAS * T));

  // dimensionless ψ (cathodic > 0) → display convention: anodic positive
  const iA = iArr.map((psi) => -psi * psiScale);

  let ipa = 0;
  let epa = eArr[0];
  let ipc = 0;
  let epc = eArr[0];
  for (let k = 0; k < iA.length; k++) {
    if (iA[k] > ipa) {
      ipa = iA[k];
      epa = eArr[k];
    }
    if (iA[k] < ipc) {
      ipc = iA[k];
      epc = eArr[k];
    }
  }

  return { e: eArr, i: iA, epa, epc, ipa, ipc };
}


