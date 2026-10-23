"use client";

import { useRef, type PointerEvent } from "react";
import { alphaFractions } from "@/lib/chem/titration";

export type Band = { lo: number; hi: number };

/** standard textbook indicator ranges (25 C) */
export const BANDS: { id: string; lo: number; hi: number }[] = [
  { id: "methylOrange", lo: 3.1, hi: 4.4 },
  { id: "methylRed", lo: 4.4, hi: 6.2 },
  { id: "bromothymol", lo: 6.0, hi: 7.6 },
  { id: "phenolRed", lo: 6.8, hi: 8.4 },
  { id: "phenolphthalein", lo: 8.2, hi: 10.0 },
];

const W = 640;
const PAD = { l: 48, r: 14, t: 16, b: 38 };
const CURVE_H = 380;
const SMALL_H = 200;

export function CurveChart({
  points,
  maxV,
  ves,
  halfEq,
  v,
  val,
  yMin,
  yMax,
  yStep,
  yLabel,
  showBands,
  onPick,
}: {
  points: { vMl: number; y: number }[];
  maxV: number;
  ves: number[];
  halfEq: number | null;
  v: number;
  val: number;
  yMin: number;
  yMax: number;
  yStep: number;
  yLabel: string;
  showBands: boolean;
  onPick: (v: number) => void;
}) {
  const ref = useRef<SVGSVGElement | null>(null);
  const handlers = {
    onPointerDown: (e: PointerEvent<SVGSVGElement>) => {
      e.currentTarget.setPointerCapture(e.pointerId);
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const px = ((e.clientX - rect.left) / rect.width) * W;
      const frac = (px - PAD.l) / (W - PAD.l - PAD.r);
      onPick(Math.max(0, Math.min(1, frac)) * maxV);
    },
    onPointerMove: (e: PointerEvent<SVGSVGElement>) => {
      if (!(e.buttons & 1)) return;
      const rect = ref.current?.getBoundingClientRect();
      if (!rect || rect.width === 0) return;
      const px = ((e.clientX - rect.left) / rect.width) * W;
      const frac = (px - PAD.l) / (W - PAD.l - PAD.r);
      onPick(Math.max(0, Math.min(1, frac)) * maxV);
    },
  };
  const x = (ml: number) => PAD.l + (ml / maxV) * (W - PAD.l - PAD.r);
  const y = (val: number) => PAD.t + ((yMax - val) / (yMax - yMin)) * (CURVE_H - PAD.t - PAD.b);
  const curve = points.map((pt) => `${x(pt.vMl)},${y(pt.y)}`).join(" ");
  const yTicks: number[] = [];
  for (let g = yMin; g <= yMax + 1e-9; g += yStep) yTicks.push(Number(g.toFixed(2)));

  return (
    <svg ref={ref} viewBox={`0 0 ${W} ${CURVE_H}`} className="w-full cursor-crosshair select-none" {...handlers}>
      {yTicks.map((g) => (
        <g key={g}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={PAD.l - 7} y={y(g) + 3} textAnchor="end" fontSize="10" fill="#64748b">
            {Number.isInteger(g) ? g : g.toFixed(2)}
          </text>
        </g>
      ))}

      {showBands &&
        BANDS.map((b) => (
          <rect
            key={b.id}
            x={PAD.l}
            y={y(b.hi)}
            width={W - PAD.l - PAD.r}
            height={Math.max(0, y(b.lo) - y(b.hi))}
            fill="rgba(148,163,184,0.12)"
          />
        ))}

      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={y(yMin)} stroke="#475569" strokeWidth="1" />
      <line x1={PAD.l} x2={W - PAD.r} y1={y(yMin)} y2={y(yMin)} stroke="#334155" strokeWidth="1" />

      {halfEq !== null && halfEq <= maxV && (
        <line x1={x(halfEq)} x2={x(halfEq)} y1={PAD.t} y2={y(yMin)} stroke="#a78bfa" strokeWidth="1" strokeDasharray="3 5" opacity="0.6" />
      )}

      {ves.map((ve, i) =>
        ve <= maxV ? (
          <g key={i}>
            <line x1={x(ve)} x2={x(ve)} y1={PAD.t} y2={y(yMin)} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5 4" opacity="0.85" />
            <text x={x(ve) + 5} y={PAD.t + 10 + i * 12} fontSize="10" fill="#fbbf24" opacity="0.9">
              {ves.length > 1 ? `Ve${i + 1}` : "Ve"}
            </text>
          </g>
        ) : null,
      )}

      <polyline points={curve} fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      <line x1={x(v)} x2={x(v)} y1={PAD.t} y2={y(yMin)} stroke="rgba(34,211,238,0.35)" strokeWidth="1.5" />
      <circle cx={x(v)} cy={y(Math.min(yMax, Math.max(yMin, val)))} r="5" fill="#67e8f9" stroke="#0f172a" strokeWidth="2" />

      {[0, 0.25, 0.5, 0.75, 1].map((f) => (
        <text key={f} x={x(maxV * f)} y={CURVE_H - 20} textAnchor="middle" fontSize="10" fill="#64748b">
          {(maxV * f).toFixed(0)}
        </text>
      ))}
      <text x={W - PAD.r} y={CURVE_H - 6} textAnchor="end" fontSize="11" fill="#475569">
        V / mL
      </text>
      <text x={8} y={PAD.t + 4} fontSize="10" fill="#64748b">
        {yLabel}
      </text>
    </svg>
  );
}

export function DerivativeChart({
  dPts,
  maxV,
  ves,
  v,
  yLabel,
}: {
  dPts: { vMl: number; dy: number }[];
  maxV: number;
  ves: number[];
  v: number;
  yLabel: string;
}) {
  const x = (ml: number) => PAD.l + (ml / maxV) * (W - PAD.l - PAD.r);
  const m = Math.max(...dPts.map((p) => p.dy), 1e-6);
  const yMax = m * 1.08;
  const y = (dy: number) => PAD.t + (1 - dy / yMax) * (SMALL_H - PAD.t - 24);

  return (
    <svg viewBox={`0 0 ${W} ${SMALL_H}`} className="w-full select-none">
      {[0, yMax / 2, yMax].map((g) => (
        <g key={g}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={PAD.l - 7} y={y(g) + 3} textAnchor="end" fontSize="9" fill="#64748b">
            {g.toFixed(2)}
          </text>
        </g>
      ))}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={SMALL_H - 24} stroke="#475569" strokeWidth="1" />
      <line x1={PAD.l} x2={W - PAD.r} y1={SMALL_H - 24} y2={SMALL_H - 24} stroke="#334155" strokeWidth="1" />
      {ves.map((ve, i) =>
        ve <= maxV ? (
          <line key={i} x1={x(ve)} x2={x(ve)} y1={PAD.t} y2={SMALL_H - 24} stroke="#fbbf24" strokeWidth="1" strokeDasharray="5 4" opacity="0.7" />
        ) : null,
      )}
      <polyline points={dPts.map((p) => `${x(p.vMl)},${y(Math.max(0, p.dy))}`).join(" ")} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round" />
      <line x1={x(v)} x2={x(v)} y1={PAD.t} y2={SMALL_H - 24} stroke="rgba(34,211,238,0.35)" strokeWidth="1.5" />
      <text x={W - PAD.r} y={SMALL_H - 10} textAnchor="end" fontSize="11" fill="#475569">
        V / mL
      </text>
      <text x={8} y={PAD.t + 4} fontSize="10" fill="#64748b">
        {yLabel}
      </text>
    </svg>
  );
}

export function GranChart({
  fit,
  maxV,
  ve,
}: {
  fit: { slope: number; intercept: number; veEst: number; pts: { vMl: number; f: number }[] };
  maxV: number;
  ve: number;
}) {
  const xMax = Math.min(maxV, ve * 1.9);
  const fMax = Math.max(...fit.pts.map((p) => p.f), 1e-9);
  const pxPerF = (SMALL_H - PAD.t - 24) / (fMax * 1.08);
  const x = (ml: number) => PAD.l + (Math.min(ml, xMax) / xMax) * (W - PAD.l - PAD.r);
  const y = (f: number) => SMALL_H - 24 - Math.min(f, fMax * 1.08) * pxPerF;

  return (
    <svg viewBox={`0 0 ${W} ${SMALL_H}`} className="w-full select-none">
      {[0, 0.5, 1].map((g) => (
        <text key={g} x={PAD.l - 7} y={SMALL_H - 24 - g * (SMALL_H - PAD.t - 24) + 3} textAnchor="end" fontSize="10" fill="#64748b">
          {(g * fMax).toExponential(1)}
        </text>
      ))}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={SMALL_H - 24} stroke="#475569" strokeWidth="1" />
      <line x1={PAD.l} x2={W - PAD.r} y1={SMALL_H - 24} y2={SMALL_H - 24} stroke="#334155" strokeWidth="1" />

      {fit.pts.map((p, i) => (
        <circle key={i} cx={x(p.vMl)} cy={y(p.f)} r="2.5" fill="#67e8f9" opacity="0.8" />
      ))}

      <line
        x1={x(fit.veEst)}
        y1={SMALL_H - 24}
        x2={xMax}
        y2={SMALL_H - 24 - fit.slope * (xMax - fit.veEst) * pxPerF}
        stroke="#a78bfa"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />

      <line x1={x(fit.veEst)} x2={x(fit.veEst)} y1={PAD.t} y2={SMALL_H - 24} stroke="#34d399" strokeWidth="1.5" strokeDasharray="5 4" />
      <circle cx={x(fit.veEst)} cy={SMALL_H - 24} r="5" fill="#fbbf24" stroke="#0f172a" strokeWidth="2" />
      <line x1={x(ve)} x2={x(ve)} y1={PAD.t} y2={SMALL_H - 24} stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 6" opacity="0.7" />
      <text x={8} y={PAD.t + 4} fontSize="10" fill="#64748b">
        F
      </text>
      <text x={W - PAD.r} y={SMALL_H - 10} textAnchor="end" fontSize="10" fill="#475569">
        V / mL
      </text>
    </svg>
  );
}

const SPECIES_COLORS = ["#22d3ee", "#e879f9", "#fbbf24", "#34d399"];

export function SpeciesChart({ kas, labels, ph }: { kas: number[]; labels: string[]; ph: number }) {
  const x = (pH: number) => PAD.l + (pH / 14) * (W - PAD.l - PAD.r);
  const y = (a: number) => PAD.t + (1 - a) * (SMALL_H - PAD.t - 24);

  const series = labels.map((_, j) => {
    const pts: string[] = [];
    for (let i = 0; i <= 140; i++) {
      const pH = (14 * i) / 100;
      const alphas = alphaFractions(kas, 10 ** -pH);
      pts.push(`${x(pH)},${y(alphas[j] ?? 0)}`);
    }
    return pts.join(" ");
  });

  return (
    <svg viewBox={`0 0 ${W} ${SMALL_H}`} className="w-full select-none">
      {[0, 0.5, 1].map((g) => (
        <g key={g}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(g)} y2={y(g)} stroke="#1e293b" strokeWidth="1" />
          <text x={PAD.l - 7} y={y(g) + 3} textAnchor="end" fontSize="10" fill="#64748b">
            {g}
          </text>
        </g>
      ))}
      <line x1={PAD.l} x2={PAD.l} y1={PAD.t} y2={y(0)} stroke="#475569" strokeWidth="1" />
      <line x1={PAD.l} x2={W - PAD.r} y1={y(0)} y2={y(0)} stroke="#334155" strokeWidth="1" />

      {series.map((pts, i) => (
        <polyline key={labels[i]} points={pts} fill="none" stroke={SPECIES_COLORS[i % SPECIES_COLORS.length]} strokeWidth="2" />
      ))}

      <line x1={x(ph)} x2={x(ph)} y1={PAD.t} y2={y(0)} stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" />

      {[0, 2, 4, 6, 8, 10, 12, 14].map((g) => (
        <text key={g} x={x(g)} y={SMALL_H - 10} textAnchor="middle" fontSize="9" fill="#64748b">
          {g}
        </text>
      ))}
      <text x={W - PAD.r} y={SMALL_H - 10} textAnchor="end" fontSize="10" fill="#475569">
        pH
      </text>
      <text x={8} y={PAD.t + 4} fontSize="10" fill="#64748b">
        α
      </text>
    </svg>
  );
}
