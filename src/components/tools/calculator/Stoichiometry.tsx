"use client";

import { useState } from "react";
import { parseFormula, FormulaError, molarMass } from "@/lib/chem/formula";
import { fmt, num } from "@/lib/chem/format";
import { useI18n } from "@/lib/i18n";
import { Field, TextInput, NumInput, ResultRow, MethodNote, ErrorNote } from "./shared";
import type { Species } from "./types";

function SpeciesRow({
  index,
  species,
  onChange,
  showMass,
  last,
  labels,
}: {
  index: string;
  species: Species;
  onChange: (patch: Partial<Species>) => void;
  showMass: boolean;
  last?: boolean;
  labels: { coeffFormula: string; mass: string };
}) {
  return (
    <div className="grid grid-cols-[64px_1fr] gap-2.5 sm:grid-cols-[64px_1fr_110px]">
      <Field label={index}>
        <NumInput
          value={species.coeff}
          onChange={(v) => onChange({ coeff: v })}
          placeholder="1"
        />
      </Field>
      <Field label={last ? "\u00A0" : labels.coeffFormula}>
        <TextInput
          value={species.formula}
          onChange={(v) => onChange({ formula: v })}
          placeholder="formula"
        />
      </Field>
      {showMass && (
        <div className="col-span-2 sm:col-span-1">
          <Field label={last ? "\u00A0" : labels.mass}>
            <NumInput
              value={species.mass}
              onChange={(v) => onChange({ mass: v })}
              placeholder="g"
            />
          </Field>
        </div>
      )}
    </div>
  );
}

type StoichData = {
  M: [number, number, number];
  n1: number;
  n2: number;
  extent: number;
  limitingName: string;
  nProduct: number;
  mTheo: number;
  pctYield: number | null;
};

type StoichResult = { error: string; data: null } | { error: null; data: StoichData };

function computeStoich(
  r1: Species,
  r2: Species,
  prod: Species,
  actual: string,
  errors: { formulas: string; invalid: string; coeffs: string },
): StoichResult {
  const rows = [
    { ...r1, role: "reagent" },
    { ...r2, role: "reagent" },
    { ...prod, role: "product" },
  ] as const;

  for (const row of rows) {
    try {
      if (!row.formula.trim()) throw new FormulaError(errors.formulas);
      parseFormula(row.formula);
    } catch (e) {
      return {
        error: e instanceof FormulaError ? e.message : errors.invalid,
        data: null,
      };
    }
    const fields: string[] = row.role === "product" ? [row.coeff] : [row.coeff, row.mass];
    for (const field of fields) {
      const value = num(field);
      if (value === null || value < 0 || (field === row.coeff && value <= 0)) {
        return {
          error: errors.coeffs,
          data: null,
        };
      }
    }
  }

  const M = [
    molarMass(parseFormula(r1.formula).counts),
    molarMass(parseFormula(r2.formula).counts),
    molarMass(parseFormula(prod.formula).counts),
  ] as [number, number, number];

  const c = [num(r1.coeff)!, num(r2.coeff)!, num(prod.coeff)!];
  const n1 = num(r1.mass)! / M[0];
  const n2 = num(r2.mass)! / M[1];
  const ext1 = n1 / c[0];
  const ext2 = n2 / c[1];
  const extent = Math.min(ext1, ext2);

  const nProduct = extent * c[2];
  const mTheo = nProduct * M[2];
  const actualN = actual.trim() ? num(actual) : null;
  const pctYield =
    actualN !== null && Number.isFinite(actualN) && mTheo > 0 ? (actualN / mTheo) * 100 : null;

  return {
    error: null,
    data: {
      M,
      n1,
      n2,
      extent,
      limitingName: ext1 <= ext2 ? r1.formula : r2.formula,
      nProduct,
      mTheo,
      pctYield,
    },
  };
}

export function Stoichiometry() {
  const { t } = useI18n();
  const s = t.pages.calculator.stoich;
  const [r1, setR1] = useState<Species>({ coeff: "1", formula: "Na2CO3", mass: "5.30" });
  const [r2, setR2] = useState<Species>({ coeff: "2", formula: "HCl", mass: "3.65" });
  const [prod, setProd] = useState<Species>({ coeff: "1", formula: "CO2", mass: "" });
  const [actual, setActual] = useState("");

  const result = computeStoich(r1, r2, prod, actual, {
    formulas: s.errFormulas,
    invalid: s.errInvalid,
    coeffs: s.errCoeffs,
  });
  const d = result.data;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <p className="font-mono text-xs text-slate-500" dir="ltr">
            <span className="text-cyan-300/80">ν₁</span> A +{" "}
            <span className="text-cyan-300/80">ν₂</span> B →{" "}
            <span className="text-cyan-300/80">ν₃</span> C
          </p>

          <SpeciesRow
            index="A"
            species={r1}
            onChange={(p) => setR1((sp) => ({ ...sp, ...p }))}
            showMass
            labels={s}
          />
          <SpeciesRow
            index="B"
            species={r2}
            onChange={(p) => setR2((sp) => ({ ...sp, ...p }))}
            showMass
            labels={s}
          />

          <div className="flex items-center gap-2 font-mono text-cyan-400/70">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            →
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          </div>

          <SpeciesRow
            index="C"
            species={prod}
            onChange={(p) => setProd((sp) => ({ ...sp, ...p }))}
            showMass={false}
            last
            labels={s}
          />

          <div className="pt-1">
            <Field label={s.actualYield} hint={s.actualHint}>
              <NumInput value={actual} onChange={setActual} placeholder="e.g. 1.05" />
            </Field>
          </div>
        </div>

        {result.error && <ErrorNote message={result.error} />}

        <MethodNote>
          n = m / M · extent = min(nᵢ / νᵢ) · n(C) = extent × ν₃ · m(th.) = n(C) × M(C) · %yield =
          m(act) / m(th) × 100
        </MethodNote>
      </div>

      <div className="space-y-2.5 self-start">
        {d && (
          <>
            <ResultRow label={`n(A) — M ${fmt(d.M[0])} g/mol`} value={fmt(d.n1)} unit="mol" />
            <ResultRow label={`n(B) — M ${fmt(d.M[1])} g/mol`} value={fmt(d.n2)} unit="mol" />
            <ResultRow label={s.extent} value={`${fmt(d.extent)} ×`} />
            <ResultRow label={s.limiting} value={d.limitingName} highlight />
            <ResultRow
              label={`n(${prod.formula || "C"}) ${s.produced}`}
              value={fmt(d.nProduct)}
              unit="mol"
            />
            <ResultRow label={s.theoretical} value={fmt(d.mTheo)} unit="g" highlight />
            {d.pctYield !== null && (
              <ResultRow
                label={s.percent}
                value={d.pctYield > 100 ? s.over100 : fmt(d.pctYield)}
                unit="%"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}
