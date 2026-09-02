"use client";

import { useState } from "react";
import { fmt, num } from "@/lib/chem/format";
import { Field, NumInput, Select, ErrorNote } from "./shared";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Unit = { value: string; label: string; factor?: number };

type Category = {
  id: string;
  baseLabel: string;
  units: Unit[];
};

const CATEGORIES: Category[] = [
  {
    id: "pressure",
    baseLabel: "Pa",
    units: [
      { value: "Pa", label: "Pa", factor: 1 },
      { value: "kPa", label: "kPa", factor: 1000 },
      { value: "bar", label: "bar", factor: 1e5 },
      { value: "atm", label: "atm", factor: 101325 },
      { value: "mmHg", label: "mmHg (torr)", factor: 133.322 },
      { value: "psi", label: "psi", factor: 6894.757 },
    ],
  },
  {
    id: "energy",
    baseLabel: "J",
    units: [
      { value: "J", label: "joule", factor: 1 },
      { value: "kJ", label: "kilojoule", factor: 1000 },
      { value: "cal", label: "calorie (th)", factor: 4.184 },
      { value: "kcal", label: "kilocalorie", factor: 4184 },
      { value: "eV", label: "electronvolt", factor: 1.602176634e-19 },
      { value: "L·atm", label: "litre-atmosphere", factor: 101.325 },
    ],
  },
  {
    id: "volume",
    baseLabel: "L",
    units: [
      { value: "L", label: "litre", factor: 1 },
      { value: "mL", label: "millilitre", factor: 0.001 },
      { value: "µL", label: "microlitre", factor: 1e-6 },
      { value: "cm³", label: "cubic centimetre", factor: 0.001 },
      { value: "m³", label: "cubic metre", factor: 1000 },
    ],
  },
  {
    id: "mass",
    baseLabel: "g",
    units: [
      { value: "g", label: "gram", factor: 1 },
      { value: "kg", label: "kilogram", factor: 1000 },
      { value: "mg", label: "milligram", factor: 0.001 },
      { value: "µg", label: "microgram", factor: 1e-6 },
      { value: "t", label: "tonne", factor: 1e6 },
    ],
  },
  {
    id: "amount",
    baseLabel: "mol",
    units: [
      { value: "mol", label: "mole", factor: 1 },
      { value: "mmol", label: "millimole", factor: 0.001 },
      { value: "µmol", label: "micromole", factor: 1e-6 },
      { value: "nmol", label: "nanomole", factor: 1e-9 },
    ],
  },
  {
    id: "conc",
    baseLabel: "mol/L",
    units: [
      { value: "M", label: "molar (mol/L)", factor: 1 },
      { value: "mM", label: "millimolar", factor: 0.001 },
      { value: "µM", label: "micromolar", factor: 1e-6 },
      { value: "nM", label: "nanomolar", factor: 1e-9 },
    ],
  },
  {
    id: "temp",
    baseLabel: "K",
    units: [
      { value: "K", label: "kelvin" },
      { value: "°C", label: "celsius" },
      { value: "°F", label: "fahrenheit" },
    ],
  },
];

function convertValue(
  cat: Category,
  v: number,
  from: string,
  to: string,
): number | null {
  if (cat.id === "temp") {
    const k =
      from === "K" ? v : from === "°C" ? v + 273.15 : ((v - 32) * 5) / 9 + 273.15;
    if (to === "K") return k;
    if (to === "°C") return k - 273.15;
    return ((k - 273.15) * 9) / 5 + 32;
  }
  const f = cat.units.find((u) => u.value === from)?.factor ?? NaN;
  const t = cat.units.find((u) => u.value === to)?.factor ?? NaN;
  if (!Number.isFinite(f) || !Number.isFinite(t)) return null;
  return (v * f) / t;
}

export function UnitConverter() {
  const { t } = useI18n();
  const u = t.pages.calculator.units;
  const [catId, setCatId] = useState("pressure");
  const [raw, setRaw] = useState("1");
  const cat = CATEGORIES.find((c) => c.id === catId)!;
  const [pairs, setPairs] = useState<Record<string, { from: string; to: string }>>({});

  const pair = pairs[catId] ?? {
    from: cat.units[0].value,
    to: cat.units[Math.min(1, cat.units.length - 1)].value,
  };
  const setPair = (p: Partial<{ from: string; to: string }>) =>
    setPairs((s) => ({ ...s, [catId]: { ...pair, ...p } }));

  const value = num(raw);
  const output = value === null ? null : convertValue(cat, value, pair.from, pair.to);

  const catLabel: Record<string, string> = {
    pressure: u.categories.pressure,
    energy: u.categories.energy,
    volume: u.categories.volume,
    mass: u.categories.mass,
    amount: u.categories.amount,
    conc: u.categories.conc,
    temp: u.categories.temp,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setCatId(c.id)}
            aria-pressed={catId === c.id}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-xs transition-all",
              catId === c.id
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-slate-200",
            )}
          >
            {catLabel[c.id]}
          </button>
        ))}
      </div>

      <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div className="space-y-3">
          <Field label={u.from}>
            <NumInput value={raw} onChange={setRaw} placeholder="value" />
          </Field>
          <Select
            value={pair.from}
            onChange={(v) => setPair({ from: v })}
            options={cat.units.map((un) => ({ value: un.value, label: un.label }))}
          />
        </div>

        <button
          type="button"
          onClick={() => setPair({ from: pair.to, to: pair.from })}
          aria-label={u.swap}
          className="glass mx-auto flex size-10 items-center justify-center rounded-full border border-white/10 text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-300 sm:mb-1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
            <path d="M7 4 3 8l4 4M3 8h14a4 4 0 0 1 0 8h-2m2 4 4-4-4-4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="space-y-3">
          <Field label={u.to}>
            <div className="flex h-11 items-center overflow-hidden rounded-lg border border-cyan-400/30 bg-cyan-400/[0.07] px-3.5 font-mono text-sm text-gradient">
              {output !== null && Number.isFinite(output)
                ? fmt(output, 6)
                : value === null
                  ? "—"
                  : ""}
            </div>
          </Field>
          <Select
            value={pair.to}
            onChange={(v) => setPair({ to: v })}
            options={cat.units.map((un) => ({ value: un.value, label: un.label }))}
          />
        </div>
      </div>

      {value === null && raw.trim() && <ErrorNote message={u.errNumber} />}

      <p className="text-xs leading-relaxed text-slate-600">{u.note}</p>
    </div>
  );
}
