"use client";

import { useMemo, useState } from "react";
import { searchReagents } from "@/config/reagents";
import type { Reagent } from "@/config/reagents";
import { balanceEquation } from "@/lib/chem/balance";
import { classify } from "@/lib/chem/classify";
import { REACTION_TYPE_LABEL } from "@/lib/chem/classify";

type SlotValue = string;

const PRESETS: {
  label: string;
  left: [string, string | ""];
  right: [string, string | ""];
}[] = [
  { label: "Neutralization", left: ["HCl", "NaOH"], right: ["NaCl", "H2O"] },
  { label: "Silver mirror", left: ["AgNO3", "NaCl"], right: ["AgCl", "NaNO3"] },
  { label: "Metal + acid", left: ["Zn", "HCl"], right: ["ZnCl2", "H2"] },
  { label: "Methane combustion", left: ["CH4", "O2"], right: ["CO2", "H2O"] },
  { label: "Limestone calcination", left: ["CaCO3", ""], right: ["CaO", "CO2"] },
  { label: "Magnesium synthesis", left: ["Mg", "O2"], right: ["MgO", ""] },
];

function prettyFormula(f: string): React.ReactNode {
  return f.split("").map((ch, i) =>
    /\d/.test(ch) ? <sub key={i}>{ch}</sub> : <span key={i}>{ch}</span>,
  );
}

function ReagentSlot({
  value,
  onChange,
  placeholder,
}: {
  value: SlotValue;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  const [focused, setFocused] = useState(false);
  const suggestions = useMemo(() => {
    if (!value.trim()) return [];
    const hits = searchReagents(value).slice(0, 5);
    return hits.filter((r) => r.formula.toLowerCase() !== value.trim().toLowerCase());
  }, [value]);

  return (
    <div className="relative">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 150)}
        placeholder={placeholder}
        spellCheck={false}
        autoComplete="off"
        className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 font-mono text-sm text-slate-100 outline-none transition-colors placeholder:font-sans placeholder:text-slate-600 focus:border-cyan-400/70"
      />
      {focused && suggestions.length > 0 && (
        <ul className="glass-strong absolute z-20 mt-1 w-full overflow-hidden rounded-lg border border-white/10 shadow-2xl">
          {suggestions.map((r) => (
            <li key={r.id}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(r.formula)}
                className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-xs transition-colors hover:bg-white/5"
              >
                <span className="text-slate-200">{r.name}</span>
                <span className="font-mono text-cyan-300/80">{r.formula}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function findReagentMeta(formula: string): Reagent | undefined {
  if (!formula.trim()) return undefined;
  return searchReagents(formula.trim()).find((r) => r.formula === formula.trim());
}

function EquationSide({
  values,
  onChange,
  labels,
}: {
  values: [SlotValue, SlotValue];
  onChange: (v: [SlotValue, SlotValue]) => void;
  labels: [string, string];
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
      {([0, 1] as const).map((i) => (
        <div key={i} className="flex-1">
          <label className="mb-1.5 block text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {labels[i]}
          </label>
          <ReagentSlot
            value={values[i]}
            onChange={(v) => {
              const next: [SlotValue, SlotValue] = [...values];
              next[i] = v;
              onChange(next);
            }}
            placeholder={i === 0 ? "formula" : "optional"}
          />
        </div>
      ))}
    </div>
  );
}

export function ReactionLab() {
  const [left, setLeft] = useState<[SlotValue, SlotValue]>(["HCl", "NaOH"]);
  const [right, setRight] = useState<[SlotValue, SlotValue]>(["NaCl", "H2O"]);

  function applyPreset(i: number) {
    const p = PRESETS[i];
    setLeft([p.left[0], p.left[1]]);
    setRight([p.right[0], p.right[1]]);
  }

  const result = useMemo(() => {
    const active = [
      ...left.filter((f) => f.trim()).map((formula) => ({ formula: formula.trim(), side: "left" as const })),
      ...right.filter((f) => f.trim()).map((formula) => ({ formula: formula.trim(), side: "right" as const })),
    ];
    if (active.length < 2) return null;
    return balanceEquation(active);
  }, [left, right]);

  const coeffs = useMemo(() => {
    if (!result || !result.ok) return null;
    const map = new Map<string, number>();
    let idx = 0;
    for (const f of [...left, ...right]) {
      if (!f.trim()) continue;
      map.set(f.trim(), result.species[idx].coeff);
      idx++;
    }
    return map;
  }, [result, left, right]);

  const classification = useMemo(() => {
    const l = left.map((f) => ({ reagent: findReagentMeta(f), coeff: 1 }));
    const r = right.map((f) => ({ reagent: findReagentMeta(f), coeff: 1 }));
    if (!l.some((x) => x.reagent) || !r.some((x) => x.reagent)) return null;
    return classify(l, r);
  }, [left, right]);

  const error = result && !result.ok ? result.error : null;

  return (
    <div className="space-y-6">
      {/* presets */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p, i) => (
          <button
            key={p.label}
            type="button"
            onClick={() => applyPreset(i)}
            className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400 transition-all hover:border-cyan-400/40 hover:text-cyan-200"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* builder */}
      <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <EquationSide
          values={left}
          onChange={setLeft}
          labels={["Reactant A", "Reactant B"]}
        />
        <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-cyan-300 lg:grid">
          →
        </div>
        <EquationSide
          values={right}
          onChange={setRight}
          labels={["Product C", "Product D"]}
        />
      </div>

      {/* balanced equation */}
      <div className="rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-cyan-400/[0.07] to-blue-500/[0.05] px-5 py-6 sm:px-8 sm:py-8">
        <h3 className="mb-4 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">
          Balanced equation
        </h3>

        {error ? (
          <p className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {error}
          </p>
        ) : !coeffs ? (
          <p className="text-sm text-slate-500">
            Enter at least one reactant and one product to balance the equation.
          </p>
        ) : (
          (() => {
            const parts: React.ReactNode[] = [];
            let k = 0;
            const renderSide = (vals: SlotValue[]) => {
              const out: React.ReactNode[] = [];
              vals.forEach((f, i) => {
                if (!f.trim()) return;
                const coeff = coeffs.get(f.trim()) ?? 1;
                const meta = findReagentMeta(f);
                out.push(
                  <span key={`${k++}`} className="inline-flex items-baseline gap-1.5">
                    {coeff !== 1 && (
                      <span className="font-display text-lg font-bold text-gradient">{coeff}</span>
                    )}
                    <span className="font-mono text-lg text-white">{prettyFormula(f)}</span>
                    {meta && (
                      <span className="font-mono text-[10px] text-slate-500">({meta.state})</span>
                    )}
                  </span>,
                );
                const remaining = vals.slice(i + 1).some((x) => x.trim());
                if (remaining) out.push(<span key={`sep${k++}`} className="mx-1 text-slate-600">+</span>);
              });
              return out;
            };
            parts.push(...renderSide(left));
            parts.push(
              <span key="arrow" className="mx-2 inline-block -translate-y-0.5 font-mono text-xl text-cyan-300">
                ⟶
              </span>,
            );
            parts.push(...renderSide(right));
            return <div className="flex flex-wrap items-center gap-y-2 leading-relaxed">{parts}</div>;
          })()
        )}

        {!error && coeffs && (
          <p className="mt-4 font-mono text-[11px] text-slate-600">
            solved by exact rational elimination · atoms conserved on both sides ✓
          </p>
        )}
      </div>

      {/* classification */}
      {classification && (
        <div className="grid gap-5 md:grid-cols-3">
          <div className="glass rounded-2xl border border-white/10 p-5">
            <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Reaction type
            </h4>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-200">
              {REACTION_TYPE_LABEL[classification.type]}
            </span>
          </div>
          <div className="glass rounded-2xl border border-white/10 p-5">
            <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              What you&apos;d observe
            </h4>
            <p className="text-sm leading-relaxed text-slate-300">{classification.observation}</p>
          </div>
          <div className="glass rounded-2xl border border-white/10 p-5">
            <h4 className="mb-2.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Safety notes
            </h4>
            {classification.safety.length > 0 ? (
              <ul className="space-y-1.5">
                {classification.safety.map((s) => (
                  <li key={s} className="flex items-start gap-2 text-xs leading-relaxed text-amber-200/90">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 size-3.5 shrink-0" aria-hidden="true">
                      <path d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {s}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-600">
                Standard PPE applies: goggles, gloves, lab coat.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
