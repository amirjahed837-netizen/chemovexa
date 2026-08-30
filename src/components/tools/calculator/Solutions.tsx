"use client";

import { useState } from "react";
import { parseFormula, FormulaError, molarMass } from "@/lib/chem/formula";
import { fmt, num } from "@/lib/chem/format";
import {
  Field,
  TextInput,
  NumInput,
  Select,
  ResultRow,
  MethodNote,
  ErrorNote,
  SubTabs,
} from "./shared";

const VOLUMES = [
  { value: "1", label: "L" },
  { value: "0.001", label: "mL" },
  { value: "1e-6", label: "µL" },
];

type MolarityResult =
  | { error: string; data: null }
  | { error: null; data: { M: number; c: number; vL: number; moles: number; mass: number } };

function solveMolarity(
  formula: string,
  molarity: string,
  volume: string,
  unit: string,
): MolarityResult {
  try {
    if (!formula.trim()) throw new FormulaError("Enter the solute formula.");
    const M = molarMass(parseFormula(formula).counts);
    const c = num(molarity);
    const vMl = num(volume);
    if (c === null || c <= 0) return { error: "Concentration must be > 0.", data: null };
    if (vMl === null || vMl <= 0) return { error: "Volume must be > 0.", data: null };
    const vL = vMl * parseFloat(unit);
    const moles = c * vL;
    return { error: null, data: { M, c, vL, moles, mass: moles * M } };
  } catch (e) {
    return {
      error: e instanceof FormulaError ? e.message : "Invalid formula.",
      data: null,
    };
  }
}

function MolarityMaker() {
  const [formula, setFormula] = useState("NaOH");
  const [molarity, setMolarity] = useState("0.100");
  const [volume, setVolume] = useState("250");
  const [unit, setUnit] = useState("0.001");

  const result = solveMolarity(formula, molarity, volume, unit);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <Field label="Solute formula" hint="molar mass computed automatically">
          <TextInput value={formula} onChange={setFormula} placeholder="e.g. NaOH" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Target concentration" hint="mol/L">
            <NumInput value={molarity} onChange={setMolarity} placeholder="0.100" />
          </Field>
          <Field label="Final volume">
            <div className="flex gap-2">
              <NumInput value={volume} onChange={setVolume} placeholder="250" />
              <div className="w-[86px] shrink-0">
                <Select value={unit} onChange={setUnit} options={VOLUMES} />
              </div>
            </div>
          </Field>
        </div>
        {result.error && <ErrorNote message={result.error} />}
        <MethodNote>n = C × V · m = n × M</MethodNote>
      </div>

      <div className="space-y-2.5 self-start">
        {result.data && (
          <>
            <ResultRow label="Molar mass of solute" value={fmt(result.data.M)} unit="g/mol" />
            <ResultRow label="Amount of substance" value={fmt(result.data.moles)} unit="mol" />
            <ResultRow
              label="Weigh out"
              value={fmt(result.data.mass)}
              unit="g"
              highlight
            />
            <p className="px-3.5 pt-1 text-xs leading-relaxed text-slate-500">
              Dissolve completely in less than the final volume, then dilute to the mark — never
              add solute to a full flask.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

type DilutionField = "C1" | "V1" | "C2" | "V2";

type DilutionResult =
  | { error: string; solved: null }
  | { error: null; solved: number };

function solveDilution(
  values: Record<DilutionField, string>,
  solve: DilutionField,
  vUnit: string,
): DilutionResult {
  const filled: Partial<Record<DilutionField, number>> = {};
  for (const key of ["C1", "V1", "C2", "V2"] as DilutionField[]) {
    const n = num(values[key]);
    if (n !== null) filled[key] = n;
  }
  if (Object.keys(filled).length !== 3) {
    return {
      error: `Fill exactly three fields — ${solve} will be solved.`,
      solved: null,
    };
  }
  if (solve in filled) {
    return { error: `Clear the field you want solved (${solve}).`, solved: null };
  }
  const vu = parseFloat(vUnit);
  const C1 = filled.C1;
  const V1 = filled.V1 !== undefined ? filled.V1 * vu : undefined;
  const C2 = filled.C2;
  const V2 = filled.V2 !== undefined ? filled.V2 * vu : undefined;

  let value: number;
  if (C1 === undefined && V1 !== undefined) value = (C2! * V2!) / V1;
  else if (V1 === undefined) value = (C2! * V2!) / C1!;
  else if (C2 === undefined && V2 !== undefined) value = (C1! * V1!) / V2;
  else value = (C1! * V1!) / C2!;

  const display = solve.startsWith("V") ? value / vu : value;
  return { error: null, solved: display };
}

function Dilution() {
  const [values, setValues] = useState<Record<DilutionField, string>>({
    C1: "1.0",
    V1: "",
    C2: "0.25",
    V2: "100",
  });
  const [solve, setSolve] = useState<DilutionField>("V1");
  const [vUnit, setVUnit] = useState("0.001");

  const labels: Record<DilutionField, string> = {
    C1: "Stock conc. C₁",
    V1: "Stock vol. V₁",
    C2: "Target conc. C₂",
    V2: "Target vol. V₂",
  };

  const result = solveDilution(values, solve, vUnit);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-5">
        <p className="text-sm text-slate-400">
          Fill any three fields; pick which one to solve for.
        </p>
        <SubTabs
          tabs={(["C1", "V1", "C2", "V2"] as DilutionField[]).map((k) => ({
            id: k,
            label: `solve ${labels[k].split(" ")[1] ?? k}`,
          }))}
          active={solve}
          onChange={(id) => setSolve(id as DilutionField)}
        />

        <div className="grid grid-cols-2 gap-3">
          {(Object.keys(labels) as DilutionField[]).map((key) => (
            <Field
              key={key}
              label={labels[key]}
              hint={key.includes("V") ? "see unit below" : "mol/L"}
            >
              <NumInput
                value={values[key]}
                onChange={(v) => setValues((s) => ({ ...s, [key]: v }))}
                placeholder={solve === key ? "= ?" : ""}
                invalid={false}
              />
            </Field>
          ))}
        </div>

        <Field label="Volume unit" hint="applies to V₁ & V₂">
          <Select value={vUnit} onChange={setVUnit} options={VOLUMES} />
        </Field>

        {result.error && <ErrorNote message={result.error} />}
        <MethodNote>C₁ × V₁ = C₂ × V₂ (any consistent units)</MethodNote>
      </div>

      <div className="space-y-2.5 self-start">
        {result.solved !== null && (
          <>
            <ResultRow
              label={`Solved ${solve}`}
              value={fmt(result.solved)}
              unit={solve.startsWith("V") ? undefined : "mol/L"}
              highlight
            />
            <p className="px-3.5 pt-1 text-xs text-slate-500">
              {solve.startsWith("V")
                ? `in the selected volume unit (${VOLUMES.find((o) => o.value === vUnit)?.label})`
                : "in mol/L"}
            </p>
            <DilutionTip />
          </>
        )}
      </div>
    </div>
  );
}

function DilutionTip() {
  return (
    <p className="px-3.5 pt-1 text-xs leading-relaxed text-slate-500">
      Pipette the stock volume, transfer to a volumetric flask, then dilute to the calibration
      mark with solvent.
    </p>
  );
}

export function Solutions() {
  const [tab, setTab] = useState("molarity");
  return (
    <div className="space-y-8">
      <SubTabs
        tabs={[
          { id: "molarity", label: "Make a solution" },
          { id: "dilution", label: "Dilution C₁V₁=C₂V₂" },
        ]}
        active={tab}
        onChange={setTab}
      />
      {tab === "molarity" ? <MolarityMaker /> : <Dilution />}
    </div>
  );
}
