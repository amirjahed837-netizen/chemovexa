"use client";

import { useState } from "react";
import { parseFormula, FormulaError, molarMass, composition } from "@/lib/chem/formula";
import { elementName } from "@/lib/chem/periodic";
import { fmt } from "@/lib/chem/format";
import {
  Field,
  TextInput,
  ResultRow,
  MethodNote,
  ErrorNote,
  ExampleChips,
} from "./shared";

const EXAMPLES = ["H2O", "Ca(OH)2", "CuSO4·5H2O", "C6H12O6", "KMnO4", "C9H8O4", "K4[Fe(CN)6]"];

function prettyFormula(f: string): React.ReactNode {
  return f.split("").map((ch, i) =>
    /\d/.test(ch) ? <sub key={i}>{ch}</sub> : <span key={i}>{ch}</span>,
  );
}

type Analysis =
  | { error: string; parsed: null; mass: number; rows: [] }
  | {
      error: null;
      parsed: ReturnType<typeof parseFormula>;
      mass: number;
      rows: ReturnType<typeof composition>;
    };

function analyze(input: string): Analysis {
  try {
    const parsed = parseFormula(input);
    return {
      error: null,
      parsed,
      mass: molarMass(parsed.counts),
      rows: composition(parsed.counts),
    };
  } catch (e) {
    return {
      error: e instanceof FormulaError ? e.message : "Could not parse this formula.",
      parsed: null,
      mass: 0,
      rows: [],
    };
  }
}

export function MolarMass() {
  const [input, setInput] = useState("CuSO4·5H2O");
  const result = analyze(input);

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <div className="space-y-5 lg:col-span-3">
        <Field label="Chemical formula" hint="brackets ( ) [ ] · hydrates · charges with ^">
          <TextInput
            value={input}
            onChange={setInput}
            placeholder="e.g. Ca(OH)2 or CuSO4·5H2O"
            invalid={!!result.error && input.trim().length > 0}
          />
        </Field>
        <ExampleChips examples={EXAMPLES} onPick={setInput} />

        {result.error ? (
          input.trim() ? (
            <ErrorNote message={result.error} />
          ) : null
        ) : (
          <div className="space-y-2">
            <div className="flex items-baseline justify-between rounded-xl border border-cyan-400/30 bg-cyan-400/[0.07] px-5 py-4">
              <span className="text-sm text-cyan-100">
                M<sub>r</sub> of{" "}
                <span className="font-mono font-semibold">{prettyFormula(input.trim())}</span>
              </span>
              <span className="font-display text-2xl font-bold text-gradient">
                {fmt(result.mass)}
                <span className="ml-1.5 text-sm opacity-80">g/mol</span>
              </span>
            </div>
            <ResultRow
              label="Total atoms per formula unit"
              value={result.parsed!.atoms.toLocaleString("en-US")}
            />
            <MethodNote>M = Σ (atomic mass × count) over all elements in the formula</MethodNote>
          </div>
        )}
      </div>

      {!result.error && result.rows.length > 0 && (
        <div className="lg:col-span-2">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            Mass composition
          </h3>
          <ul className="space-y-3">
            {result.rows.map((row) => (
              <li key={row.symbol}>
                <div className="flex items-baseline justify-between gap-2 text-sm">
                  <span className="text-slate-300">
                    <span className="font-mono font-semibold text-white">{row.symbol}</span>
                    <span className="ml-1.5 text-xs text-slate-500">{elementName(row.symbol)}</span>
                    <span className="ml-1.5 font-mono text-xs text-cyan-300/70">×{row.count}</span>
                  </span>
                  <span className="font-mono text-xs text-slate-400">{fmt(row.percent)}%</span>
                </div>
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-white/5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                    style={{ width: `${Math.max(row.percent, 0.5)}%` }}
                  />
                </div>
                <div className="mt-1 flex justify-between font-mono text-[10px] text-slate-600">
                  <span>{fmt(row.subtotal)} g/mol</span>
                  <span>
                    {row.count} × {fmt(row.subtotal / row.count)}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
