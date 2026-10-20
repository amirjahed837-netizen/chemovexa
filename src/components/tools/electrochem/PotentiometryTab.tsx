"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Field, Select, ResultRow, MethodNote } from "@/components/tools/calculator/shared";
import { nernstE } from "@/lib/chem/electrochem";

type Couple = { id: string; label: string; e0: number; n: number };

// Standard reduction potentials at 25 °C (textbook values)
const COUPLES: Couple[] = [
  { id: "fe3fe2", label: "Fe³⁺/Fe²⁺", e0: 0.771, n: 1 },
  { id: "i2i", label: "I₂/I⁻", e0: 0.535, n: 2 },
  { id: "cucu2", label: "Cu²⁺/Cu", e0: 0.34, n: 2 },
  { id: "znzn2", label: "Zn²⁺/Zn", e0: -0.763, n: 2 },
  { id: "agag", label: "Ag⁺/Ag", e0: 0.7996, n: 1 },
  { id: "cl2cl", label: "Cl₂/Cl⁻", e0: 1.358, n: 2 },
];

const RATIO_PRESETS = [0.01, 0.1, 1, 10, 100];

function findCouple(id: string): Couple {
  return COUPLES.find((c) => c.id === id) ?? COUPLES[0];
}

export function PotentiometryTab() {
  const { t } = useI18n();
  const e = t.electro;

  const [cathodeId, setCathodeId] = useState("fe3fe2");
  const [anodeId, setAnodeId] = useState("znzn2");
  const [tC, setTC] = useState(25);
  const [ratio, setRatio] = useState(1); // [Ox]/[Red] for each half-cell

  const cat = findCouple(cathodeId);
  const an = findCouple(anodeId);
  const eCat = nernstE(cat.e0, cat.n, ratio, 1, tC);
  const eAn = nernstE(an.e0, an.n, ratio, 1, tC);
  const eCell = eCat - eAn;
  const spontaneous = eCell > 0;

  // Nernst line for the cathode couple: E vs log([Ox]/[Red])
  const CH_W = 560;
  const CH_H = 230;
  const PX = { l: 56, r: 16, t: 16, b: 30 };
  const slopeV = 0.059159 / cat.n * ((tC + 273.15) / 298.15);
  const eAt = (lr: number) => cat.e0 + slopeV * lr;
  const xPix = (lr: number) => PX.l + ((lr + 4) / 8) * (CH_W - PX.l - PX.r);
  const yLo = Math.min(eAt(-4), eAt(4)) - 0.05;
  const yHi = Math.max(eAt(-4), eAt(4)) + 0.05;
  const yPix = (ev: number) =>
    PX.t + ((yHi - ev) / (yHi - yLo)) * (CH_H - PX.t - PX.b);
  const curLR = Math.max(-4, Math.min(4, Math.log10(Math.max(ratio, 1e-6))));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Field label={e.pot.cathode}>
          <Select
            value={cathodeId}
            onChange={(v) => setCathodeId(v)}
            options={COUPLES.map((c) => ({ value: c.id, label: c.label }))}
          />
        </Field>
        <Field label={e.pot.anode}>
          <Select
            value={anodeId}
            onChange={(v) => setAnodeId(v)}
            options={COUPLES.map((c) => ({ value: c.id, label: c.label }))}
          />
        </Field>
        <Field label={e.pot.ratio} hint={`[Ox]/[Red] = ${ratio}`}>
          <div className="flex flex-wrap gap-1.5" dir="ltr">
            {RATIO_PRESETS.map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRatio(r)}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[11px] transition-colors",
                  ratio === r
                    ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200",
                )}
              >
                10^{Math.log10(r)}
              </button>
            ))}
          </div>
        </Field>
        <Field label={e.pot.temp} hint={`${tC} °C`}>
          <input
            type="range" min={0} max={60} step={1} value={tC}
            onChange={(ev) => setTC(Number(ev.target.value))}
            className="w-full accent-cyan-400" dir="ltr"
          />
        </Field>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]" dir="ltr">
          <svg viewBox={`0 0 ${CH_W} ${CH_H}`} className="w-full">
            <line x1={PX.l} y1={CH_H - PX.b} x2={CH_W - PX.r} y2={CH_H - PX.b} stroke="#334155" />
            <line x1={PX.l} y1={PX.t} x2={PX.l} y2={CH_H - PX.b} stroke="#334155" />
            <line
              x1={xPix(-4)} y1={yPix(eAt(-4))} x2={xPix(4)} y2={yPix(eAt(4))}
              stroke="#22d3ee" strokeWidth="1.5"
            />
            <line
              x1={PX.l} y1={yPix(cat.e0)} x2={CH_W - PX.r} y2={yPix(cat.e0)}
              stroke="#475569" strokeDasharray="4 4"
            />
            <circle cx={xPix(curLR)} cy={yPix(eCat)} r="4.5" fill="#34d399" />
            <text x={xPix(4)} y={CH_H - 10} textAnchor="end" fontSize="10" fill="#64748b">log([Ox]/[Red]) = 4</text>
          </svg>
        </div>
        <ResultRow
          label={`${e.pot.cathode}: ${cat.label}`}
          value={eCat.toFixed(3)}
          unit="V"
        />
        <ResultRow
          label={`${e.pot.anode}: ${an.label}`}
          value={eAn.toFixed(3)}
          unit="V"
        />
        <ResultRow label={e.pot.cell} value={eCell.toFixed(3)} unit="V" highlight />
        <p className={cn("text-xs", spontaneous ? "text-emerald-300" : "text-amber-300")}>
          {spontaneous ? e.pot.spontaneous : e.pot.notSpontaneous}
        </p>
        <MethodNote>{e.pot.note}</MethodNote>
      </div>
    </div>
  );
}
