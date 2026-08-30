"use client";

import { useState } from "react";
import { fmt, num, sup } from "@/lib/chem/format";
import {
  Field,
  NumInput,
  Select,
  ResultRow,
  MethodNote,
  ErrorNote,
} from "./shared";
import { cn } from "@/lib/utils";

type Mode = "strong-acid" | "strong-base" | "weak-acid" | "weak-base" | "buffer";

const MODES: { id: Mode; label: string }[] = [
  { id: "strong-acid", label: "Strong acid" },
  { id: "strong-base", label: "Strong base" },
  { id: "weak-acid", label: "Weak acid (Ka)" },
  { id: "weak-base", label: "Weak base (Kb)" },
  { id: "buffer", label: "Buffer (pKa)" },
];

function phFromConc(c: number): number {
  return -Math.log10(c);
}

type PHResult = { error: string; pH: null; note?: null } | { error: null; pH: number; note: string | null };

function solvePH(
  mode: Mode,
  conc: string,
  kx: string,
  useKaForBuffer: boolean,
  salt: string,
  acid: string,
): PHResult {
  const C = num(conc);
  const K = num(kx);

  let pH: number | null = null;
  let note: string | null = null;

  if ((mode === "strong-acid" || mode === "strong-base") && (C === null || C <= 0)) {
    return { error: "Concentration must be a positive number.", pH: null };
  }
  if (
    (mode === "weak-acid" || mode === "weak-base") &&
    (C === null || C <= 0 || K === null || K <= 0)
  ) {
    return { error: "Enter a positive concentration and a positive Ka/Kb.", pH: null };
  }

  switch (mode) {
    case "strong-acid":
      pH = phFromConc(C!);
      break;
    case "strong-base":
      pH = 14 - phFromConc(C!);
      break;
    case "weak-acid": {
      const Ka = K!;
      const x = (-Ka + Math.sqrt(Ka * Ka + 4 * Ka * C!)) / 2;
      pH = phFromConc(x);
      const approx = Math.sqrt(Ka * C!);
      if (Math.abs(x - approx) / x > 0.05) {
        note = "exact solution used — the √(Ka·C) shortcut deviates >5% here";
      }
      break;
    }
    case "weak-base": {
      const Kb = K!;
      const x = (-Kb + Math.sqrt(Kb * Kb + 4 * Kb * C!)) / 2;
      pH = 14 - phFromConc(x);
      break;
    }
    case "buffer": {
      let pKa: number | null;
      if (useKaForBuffer) {
        if (K === null || K <= 0) return { error: "Enter a positive Ka.", pH: null };
        pKa = -Math.log10(K);
      } else {
        pKa = K;
        if (pKa === null || pKa <= 0 || pKa >= 14) {
          return { error: "pKa must be between 0 and 14.", pH: null };
        }
      }
      const A = num(salt);
      const HA = num(acid);
      if (A === null || A <= 0 || HA === null || HA <= 0) {
        return { error: "Both conjugate pair concentrations must be positive.", pH: null };
      }
      pH = pKa + Math.log10(A / HA);
      break;
    }
  }

  return { error: null, pH, note };
}

export function AcidsBases() {
  const [mode, setMode] = useState<Mode>("weak-acid");
  const [conc, setConc] = useState("0.10");
  const [kx, setKx] = useState("1.8e-5");
  const [useKaForBuffer, setUseKaForBuffer] = useState(false);
  const [salt, setSalt] = useState("0.20");
  const [acid, setAcid] = useState("0.35");

  const result = solvePH(mode, conc, kx, useKaForBuffer, salt, acid);

  const pH = result.pH;
  const pOH = pH !== null ? 14 - pH : null;

  const kLabel =
    mode === "weak-acid" ? "Ka" : mode === "weak-base" ? "Kb" : useKaForBuffer ? "Ka" : "pKa";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="System">
          <Select
            value={mode}
            onChange={(v) => setMode(v as Mode)}
            options={MODES.map((m) => ({ value: m.id, label: m.label }))}
          />
        </Field>

        {(mode === "strong-acid" ||
          mode === "strong-base" ||
          mode === "weak-acid" ||
          mode === "weak-base") && (
          <Field label="Concentration" hint={mode.startsWith("strong") ? "fully dissociates" : "formal concentration"}>
            <NumInput value={conc} onChange={setConc} placeholder="0.10" />
          </Field>
        )}

        {(mode === "weak-acid" || mode === "weak-base" || (mode === "buffer" && useKaForBuffer)) && (
          <Field label={`${kLabel} value`} hint="scientific notation ok">
            <NumInput value={kx} onChange={setKx} placeholder="1.8e-5" />
          </Field>
        )}

        {mode === "buffer" && (
          <>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-slate-400">
              <input
                type="checkbox"
                checked={useKaForBuffer}
                onChange={(e) => setUseKaForBuffer(e.target.checked)}
                className="size-4 accent-cyan-400"
              />
              I have K{sup("a")} instead of pK{sup("a")}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Field label="[A⁻] conjugate base">
                <NumInput value={salt} onChange={setSalt} placeholder="0.20" />
              </Field>
              <Field label="[HA] weak acid">
                <NumInput value={acid} onChange={setAcid} placeholder="0.35" />
              </Field>
            </div>
          </>
        )}

        {result.error && <ErrorNote message={result.error} />}

        <MethodNote>
          {mode === "buffer"
            ? "pH = pKa + log([A⁻]/[HA]) — Henderson–Hasselbalch"
            : mode === "strong-base"
              ? "pOH = −log[OH⁻] · pH = 14 − pOH"
              : mode === "weak-base"
                ? "[OH⁻]: x²/(C−x) = Kb · pH = 14 − pOH"
                : mode === "weak-acid"
                  ? "[H⁺]: x²/(C−x) = Ka (solved exactly) · pH = −log[H⁺]"
                  : "pH = −log[H⁺] · at 25 °C, pKw = 14"}
        </MethodNote>
      </div>

      <div className="space-y-4 self-start">
        {pH !== null && (
          <>
            <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.07] px-5 py-5 text-center">
              <p className="text-xs uppercase tracking-widest text-cyan-200/80">pH</p>
              <p className="font-display mt-1 text-4xl font-bold text-gradient">{fmt(pH, 3)}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-emerald-400 to-blue-500">
                <div
                  className="relative h-full"
                  style={{ paddingLeft: `${(pH / 14) * 100}%` }}
                >
                  <span className="absolute top-1/2 size-3 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white bg-slate-950 shadow" />
                </div>
              </div>
              <div className="mt-1 flex justify-between font-mono text-[9px] text-slate-600">
                <span>0 acidic</span>
                <span>7</span>
                <span>14 basic</span>
              </div>
            </div>
            <ResultRow label="pOH" value={fmt(pOH!, 3)} />
            <ResultRow label={`[H${sup("+")}]`} value={`${fmt(10 ** -pH)} mol/L`} />
            <ResultRow label={`[OH${sup("-")}]`} value={`${fmt(10 ** -(pOH!))} mol/L`} />
            {result.note && (
              <p className="px-1 pt-1 text-xs italic text-amber-300/80">ℹ {result.note}</p>
            )}
            <ScaleHint />
          </>
        )}
      </div>
    </div>
  );
}

function ScaleHint() {
  return (
    <p className={cn("px-1 text-xs leading-relaxed text-slate-500")}>
      Values assume 25 °C where pKw = 14.00. Activity coefficients are neglected (ideal dilute
      behaviour).
    </p>
  );
}
