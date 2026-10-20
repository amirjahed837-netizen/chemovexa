"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Field, NumInput, ResultRow, MethodNote } from "@/components/tools/calculator/shared";
import { calibratePh, glassSlope, phFromMv, slopePercent } from "@/lib/chem/electrochem";

const B1 = 4.01;
const B2 = 7.0;

export function PhMeterTab() {
  const { t } = useI18n();
  const e = t.electro;

  const [tC, setTC] = useState(25);
  const [e1, setE1] = useState("176.9");
  const [e2, setE2] = useState("0.0");
  const [sampleMv, setSampleMv] = useState("-300.0");

  const parse = (v: string) => {
    const n = parseFloat(v.replace(",", "."));
    return Number.isFinite(n) ? n : NaN;
  };
  const m1 = parse(e1);
  const m2 = parse(e2);
  const mS = parse(sampleMv);
  const cal =
    Number.isFinite(m1) && Number.isFinite(m2) && m1 !== m2
      ? calibratePh(B1, m1, B2, m2)
      : null;
  const slopePct = cal ? slopePercent(cal, tC) : 0;
  const healthy = slopePct >= 95 && slopePct <= 105;
  const samplePh = cal && Number.isFinite(mS) ? phFromMv(cal, mS) : NaN;

  function preset(kind: "healthy" | "drifted") {
    const S = -glassSlope(tC) * (kind === "healthy" ? 1 : 0.85);
    setE1((S * (B1 - B2)).toFixed(1));
    setE2("0.0");
    setSampleMv((S * (8.45 - B2)).toFixed(1));
  }

  const CH_W = 560;
  const CH_H = 230;
  const PX = { l: 56, r: 16, t: 16, b: 34 };
  const yLo = Math.min(cal ? cal.e0Mv : 0, cal ? cal.e0Mv + cal.slopeMvPerPh * 14 : 0, Number.isFinite(mS) ? mS : 0) - 25;
  const yHi = Math.max(cal ? cal.e0Mv : 0, cal ? cal.e0Mv + cal.slopeMvPerPh * 14 : 0, Number.isFinite(m1) ? m1 : 0) + 20;
  const xPix = (ph: number) => PX.l + (ph / 14) * (CH_W - PX.l - PX.r);
  const yPix = (mv: number) =>
    PX.t + ((yHi - mv) / (yHi - yLo)) * (CH_H - PX.t - PX.b);
  const lineE0 = cal ? cal.e0Mv : 0;
  const lineE14 = cal ? cal.e0Mv + cal.slopeMvPerPh * 14 : 0;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Field label={e.ph.temp} hint={`${tC} °C`}>
          <input
            type="range" min={0} max={60} step={1} value={tC}
            onChange={(ev) => setTC(Number(ev.target.value))}
            className="w-full accent-cyan-400" dir="ltr"
          />
        </Field>
        <Field label={e.ph.mvBuffer.replace("{ph}", B1.toFixed(2))}>
          <NumInput value={e1} onChange={setE1} />
        </Field>
        <Field label={e.ph.mvBuffer.replace("{ph}", B2.toFixed(2))}>
          <NumInput value={e2} onChange={setE2} />
        </Field>
        <Field label={e.ph.sampleMv}>
          <NumInput value={sampleMv} onChange={setSampleMv} />
        </Field>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => preset("healthy")}
            className="flex-1 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-200 transition-colors hover:bg-cyan-400/20"
          >
            {e.ph.healthy}
          </button>
          <button
            type="button"
            onClick={() => preset("drifted")}
            className="flex-1 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-xs text-amber-200 transition-colors hover:bg-amber-400/15"
          >
            {e.ph.drifted}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]" dir="ltr">
          <svg viewBox={`0 0 ${CH_W} ${CH_H}`} className="w-full">
            <line x1={PX.l} y1={CH_H - PX.b} x2={CH_W - PX.r} y2={CH_H - PX.b} stroke="#334155" />
            <line x1={PX.l} y1={PX.t} x2={PX.l} y2={CH_H - PX.b} stroke="#334155" />
            <line
              x1={xPix(0)} y1={yPix(lineE0)} x2={xPix(14)} y2={yPix(lineE14)}
              stroke="#22d3ee" strokeWidth="1.5"
            />
            <circle cx={xPix(B1)} cy={yPix(m1)} r="4" fill="#f59e0b" />
            <circle cx={xPix(B2)} cy={yPix(m2)} r="4" fill="#f59e0b" />
            {Number.isFinite(samplePh) && (
              <circle cx={xPix(Math.max(0, Math.min(14, samplePh)))} cy={yPix(mS)} r="4.5" fill="#34d399" />
            )}
            <text x={xPix(14)} y={CH_H - 12} textAnchor="end" fontSize="10" fill="#64748b">pH 14</text>
            <text x={PX.l - 6} y={yPix(yHi) + 4} textAnchor="end" fontSize="10" fill="#64748b">
              {Math.round(yHi)} mV
            </text>
          </svg>
        </div>
        <ResultRow
          label={e.ph.slope}
          value={cal ? cal.slopeMvPerPh.toFixed(2) : "—"}
          unit="mV/pH"
        />
        <ResultRow label={e.ph.slopePct} value={cal ? slopePct.toFixed(1) : "—"} unit="%" highlight />
        <p className={cn("text-xs", healthy ? "text-emerald-300" : "text-amber-300")}>
          {cal ? (healthy ? e.ph.slopeOk : e.ph.slopeBad) : ""}
        </p>
        <ResultRow
          label={e.ph.samplePh}
          value={Number.isFinite(samplePh) ? samplePh.toFixed(3) : "—"}
          highlight
        />
        <MethodNote>{e.ph.note}</MethodNote>
      </div>
    </div>
  );
}
