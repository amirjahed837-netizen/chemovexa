"use client";

import { useMemo, useRef, useState } from "react";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import {
  equivalenceMl,
  titrationCurve,
  titrationPH,
  type AnalyteKind,
  type TitrationInput,
  type TitrationPoint,
} from "@/lib/chem/titration";
import { num, fmt } from "@/lib/chem/format";
import { Field, NumInput, Select } from "@/components/tools/calculator/shared";

const PRESETS: { id: AnalyteKind; k: string }[] = [
  { id: "strong-acid", k: "0" },
  { id: "weak-acid", k: "1.8e-5" },
  { id: "weak-base", k: "1.8e-5" },
];

const FORMULAS: Record<AnalyteKind, { analyte: string; titrant: string }> = {
  "strong-acid": { analyte: "HCl", titrant: "NaOH" },
  "weak-acid": { analyte: "CH₃COOH", titrant: "NaOH" },
  "weak-base": { analyte: "NH₃", titrant: "HCl" },
};

/** standard textbook indicator ranges (25 C) */
const INDICATORS: { id: "methylOrange" | "phenolphthalein"; lo: number; hi: number }[] = [
  { id: "methylOrange", lo: 3.1, hi: 4.4 },
  { id: "phenolphthalein", lo: 8.2, hi: 10.0 },
];

const W = 640;
const H = 380;
const PAD = { l: 44, r: 14, t: 16, b: 40 };

export function TitrationClient() {
  const { t, locale } = useI18n();
  const p = t.pages.titration;

  const [analyte, setAnalyte] = useState<AnalyteKind>("weak-acid");
  const [analyteM, setAnalyteM] = useState("0.100");
  const [analyteMl, setAnalyteMl] = useState("25.0");
  const [titrantM, setTitrantM] = useState("0.100");
  const [k, setK] = useState("1.8e-5");
  const [v, setV] = useState(0);

  const aM = num(analyteM);
  const aV = num(analyteMl);
  const tM = num(titrantM);
  const kVal = analyte === "strong-acid" ? 0 : num(k);
  const valid =
    aM !== null && aM > 0 &&
    aV !== null && aV > 0 &&
    tM !== null && tM > 0 &&
    (analyte === "strong-acid" || (kVal !== null && kVal > 0));

  const input: TitrationInput | null = useMemo(() => {
    if (!valid || aM === null || aV === null || tM === null || kVal === null) return null;
    return { analyte, analyteM: aM, analyteMl: aV, titrantM: tM, k: kVal };
  }, [analyte, aM, aV, tM, kVal, valid]);

  const ve = input ? equivalenceMl(input) : 0;
  const maxV = Math.max(2 * ve, (aV ?? 25) + 1);
  const points = useMemo(
    () => (input ? titrationCurve(input, maxV, 400) : []),
    [input, maxV],
  );
  const vEff = Math.min(v, maxV);
  const ph = input ? titrationPH(input, vEff) : null;
  const caption = input
    ? `${aV} mL ${FORMULAS[analyte].analyte} ${aM} M + ${FORMULAS[analyte].titrant} ${tM} M`
    : "";

  const phase =
    ph === null || !input ? null : Math.abs(vEff - ve) < maxV * 0.002 ? p.phase.at : vEff < ve ? p.phase.before : p.phase.after;

  void locale;

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

      <Container className="py-14">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            <GlassCard className="space-y-5 self-start p-6">
              <Field label={p.analyte}>
                <Select
                  value={analyte}
                  onChange={(val) => {
                    setAnalyte(val as AnalyteKind);
                    const preset = PRESETS.find((x) => x.id === val);
                    if (preset) setK(preset.k);
                    setV(0);
                  }}
                  options={PRESETS.map((pr) => ({ value: pr.id, label: p.analytes[pr.id] }))}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label={p.analyteM}>
                  <NumInput value={analyteM} onChange={setAnalyteM} placeholder="0.100" />
                </Field>
                <Field label={p.analyteV}>
                  <NumInput value={analyteMl} onChange={setAnalyteMl} placeholder="25.0" />
                </Field>
              </div>
              <Field label={p.titrantM}>
                <NumInput value={titrantM} onChange={setTitrantM} placeholder="0.100" />
              </Field>
              {analyte !== "strong-acid" && (
                <Field label={p.kValue} hint={analyte === "weak-acid" ? "Ka" : "Kb"}>
                  <NumInput value={k} onChange={setK} placeholder="1.8e-5" />
                </Field>
              )}
              {!valid && <p className="text-xs text-red-300">{p.invalid}</p>}
              {caption && (
                <p
                  className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-slate-400"
                  dir="ltr"
                >
                  {caption}
                </p>
              )}
            </GlassCard>

            <div className="space-y-5">
              {input && ph !== null && (
                <GlassCard className="p-4 sm:p-6">
                  <div dir="ltr">
                    <CurveChart
                      points={points}
                      maxV={maxV}
                      ve={ve}
                      showHalfEq={analyte !== "strong-acid"}
                      v={vEff}
                      ph={ph}
                      onPick={setV}
                    />
                  </div>
                  <div className="mt-4 space-y-2" dir="ltr">
                    <input
                      type="range"
                      min={0}
                      max={maxV}
                      step={maxV / 400}
                      value={vEff}
                      onChange={(e) => setV(Number(e.target.value))}
                      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
                      aria-label={p.volumeAdded}
                    />
                  </div>
                </GlassCard>
              )}

              {ph !== null && (
                <div className="grid gap-4 sm:grid-cols-[minmax(160px,220px)_1fr]">
                  <div
                    className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.07] px-5 py-4 text-center"
                    dir="ltr"
                  >
                    <p className="text-[10px] uppercase tracking-widest text-cyan-200/80">pH</p>
                    <p className="font-display mt-1 text-4xl font-bold text-gradient">
                      {fmt(ph, 3)}
                    </p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-gradient-to-r from-red-500 via-emerald-400 to-blue-500">
                      <div className="relative h-full" style={{ paddingLeft: `${(ph / 14) * 100}%` }}>
                        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 self-start sm:grid-cols-3 lg:grid-cols-1">
                    <Stat label={p.phaseLabel} value={phase ?? "—"} />
                    <Stat label={p.eqPoint} value={`${ve.toFixed(2)} mL`} />
                    {analyte !== "strong-acid" && input && (
                      <Stat label={p.halfEq} value={`pH ${fmt(titrationPH(input, ve / 2), 3)}`} />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <p className="mt-8 text-center text-xs leading-relaxed text-slate-600">{p.note}</p>
        </Reveal>
      </Container>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.03] px-4 py-2.5">
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 font-mono text-sm text-slate-200">{value}</p>
    </div>
  );
}

function CurveChart({
  points,
  maxV,
  ve,
  showHalfEq,
  v,
  ph,
  onPick,
}: {
  points: TitrationPoint[];
  maxV: number;
  ve: number;
  showHalfEq: boolean;
  v: number;
  ph: number;
  onPick: (v: number) => void;
}) {
  const ref = useRef<SVGSVGElement | null>(null);

  const x = (ml: number) => PAD.l + (ml / maxV) * (W - PAD.l - PAD.r);
  const y = (pH: number) => PAD.t + ((14 - pH) / 14) * (H - PAD.t - PAD.b);

  function pick(e: React.PointerEvent<SVGSVGElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const px = ((e.clientX - rect.left) / rect.width) * W;
    const frac = (px - PAD.l) / (W - PAD.l - PAD.r);
    onPick(Math.max(0, Math.min(1, frac)) * maxV);
  }

  const curve = points.map((pt) => `${x(pt.vMl)},${y(pt.pH)}`).join(" ");

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full cursor-crosshair select-none"
      onPointerDown={(e) => {
        e.currentTarget.setPointerCapture(e.pointerId);
        pick(e);
      }}
      onPointerMove={(e) => {
        if (e.buttons & 1) pick(e);
      }}
    >
      {/* pH grid */}
      {[0, 2, 4, 6, 8, 10, 12, 14].map((g) => (
        <g key={g}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={PAD.l - 7} y={y(g) + 3} textAnchor="end" fontSize="10" fill="#64748b">
            {g}
          </text>
        </g>
      ))}

      {/* indicator ranges */}
      {INDICATORS.map((ind) => (
        <rect
          key={ind.id}
          x={PAD.l}
          y={y(ind.hi)}
          width={W - PAD.l - PAD.r}
          height={Math.max(0, y(ind.lo) - y(ind.hi))}
          fill="rgba(148,163,184,0.12)"
        />
      ))}

      {/* axes */}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={y(0)} stroke="#475569" strokeWidth="1" />
      <line
        x1={PAD.l}
        x2={W - PAD.r}
        y1={y(0)}
        y2={y(0)}
        stroke="#334155"
        strokeWidth="1"
      />

      {/* half-equivalence */}
      {showHalfEq && ve / 2 <= maxV && (
        <line
          x1={x(ve / 2)}
          x2={x(ve / 2)}
          y1={y(14)}
          y2={y(0)}
          stroke="#a78bfa"
          strokeWidth="1"
          strokeDasharray="3 5"
          opacity="0.6"
        />
      )}

      {/* equivalence point */}
      {ve <= maxV && (
        <>
          <line
            x1={x(ve)}
            x2={x(ve)}
            y1={y(14)}
            y2={y(0)}
            stroke="#fbbf24"
            strokeWidth="1"
            strokeDasharray="5 4"
            opacity="0.8"
          />
          <text x={x(ve) + 5} y={y(14) + 10} fontSize="10" fill="#fbbf24" opacity="0.8">
            Ve
          </text>
        </>
      )}

      {/* curve */}
      <polyline
        points={curve}
        fill="none"
        stroke="#22d3ee"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* current volume marker */}
      <line x1={x(v)} x2={x(v)} y1={PAD.t} y2={y(0)} stroke="rgba(34,211,238,0.35)" strokeWidth="1.5" />
      <circle cx={x(v)} cy={y(ph)} r="5" fill="#67e8f9" stroke="#0f172a" strokeWidth="2" />

      {/* x labels */}
      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <text
          key={f}
          x={x(maxV * f)}
          y={H - 22}
          textAnchor="middle"
          fontSize="10"
          fill="#64748b"
        >
          {(maxV * f).toFixed(0)}
        </text>
      ))}
      <text x={W - PAD.r} y={H - 8} textAnchor="end" fontSize="11" fill="#475569">
        V / mL
      </text>
      <text x={10} y={PAD.t + 4} fontSize="10" fill="#64748b">
        pH
      </text>
    </svg>
  );
}

