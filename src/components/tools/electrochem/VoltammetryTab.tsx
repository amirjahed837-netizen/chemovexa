"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Field, NumInput, Select, ResultRow, MethodNote } from "@/components/tools/calculator/shared";
import { simulateCv } from "@/lib/chem/electrochem";

const DEFAULTS = {
  e0: "0.21", // V vs Ag/AgCl — ferri/ferrocyanide, 0.1 M KCl, 25 °C
  vMv: "100", // mV/s
  n: "1",
  cMm: "1", // mM
  area: "0.071", // cm², 3 mm disk
  d6: "7.2", // 10⁻⁶ cm²/s (ferricyanide, 0.1 M KCl, 25 °C)
  window: "0.4",
};

function num(v: string): number {
  return parseFloat(String(v).replace(",", "."));
}

export function VoltammetryTab() {
  const { t } = useI18n();
  const e = t.electro;

  const [e0, setE0] = useState(DEFAULTS.e0);
  const [vMv, setVMv] = useState(DEFAULTS.vMv);
  const [n, setN] = useState(DEFAULTS.n);
  const [cMm, setCMm] = useState(DEFAULTS.cMm);
  const [area, setArea] = useState(DEFAULTS.area);
  const [d6, setD6] = useState(DEFAULTS.d6);
  const [windowV, setWindowV] = useState(DEFAULTS.window);

  const cv = useMemo(() => {
    const e0n = num(e0);
    const v = num(vMv) / 1000;
    const nN = Math.round(num(n));
    const cN = num(cMm) / 1000;
    const aN = num(area);
    const dN = num(d6) * 1e-6;
    const wN = num(windowV);
    if (![e0n, v, nN, cN, aN, dN, wN].every(Number.isFinite)) return null;
    if (nN < 1 || nN > 3 || v <= 0 || cN <= 0 || aN <= 0 || dN <= 0 || wN < 0.2) return null;
    return simulateCv({
      e0V: e0n, nElectrons: nN, vScan: v, tC: 25, concentrationM: cN,
      areaCm2: aN, diffusivityCm2: dN, windowV: wN,
    });
  }, [e0, vMv, n, cMm, area, d6, windowV]);

  const rsIpa = useMemo(() => {
    const nN = num(n); const aN = num(area); const dN = num(d6) * 1e-6;
    const v = num(vMv) / 1000; const cN = num(cMm);
    if (![nN, aN, dN, v, cN].every(Number.isFinite)) return NaN;
    return 2.69e5 * Math.pow(nN, 1.5) * aN * Math.sqrt(dN) * Math.sqrt(v) * (cN / 1000);
  }, [n, area, d6, vMv, cMm]);

  const CH_W = 640;
  const CH_H = 360;
  const PX = { l: 64, r: 18, t: 18, b: 42 };
  const match = cv && rsIpa > 0 ? (Math.abs(cv.ipc) / rsIpa) * 100 : NaN;
  const iLimUA = cv ? Math.max(...cv.i.map((x) => Math.abs(x))) * 1e6 * 1.15 : 1;
  const eMin = cv ? Math.min(...cv.e) : -0.4;
  const eMax = cv ? Math.max(...cv.e) : 0.4;
  const xPix = (ev: number) => PX.l + ((ev - eMin) / (eMax - eMin)) * (CH_W - PX.l - PX.r);
  const yPix = (iaUA: number) =>
    PX.t + ((iLimUA - iaUA) / (iLimUA - (-iLimUA))) * (CH_H - PX.t - PX.b);
  const pathD = cv
    ? cv.e
        .map(
          (ev, k) =>
            `${k === 0 ? "M" : "L"} ${xPix(ev).toFixed(2)} ${yPix(cv.i[k] * 1e6).toFixed(2)}`,
        )
        .join(" ")
    : "";
  const midY = (PX.t + (CH_H - PX.b)) / 2;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)]">
      <div className="space-y-4">
        <Field label={e.volt.e0} hint="V vs ref">
          <NumInput value={e0} onChange={setE0} />
        </Field>
        <Field label={e.volt.scan} hint={`${vMv} mV/s`}>
          <input type="range" min={10} max={500} step={10} value={vMv}
            onChange={(ev) => setVMv(String(ev.target.value))}
            className="w-full accent-cyan-400" dir="ltr" />
        </Field>
        <Field label={e.volt.electrons}>
          <Select
            value={n}
            onChange={(v2) => setN(v2)}
            options={[{ value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }]}
          />
        </Field>
        <Field label={e.volt.conc} hint={`${cMm} mM`}>
          <input type="range" min={0.1} max={10} step={0.1} value={cMm}
            onChange={(ev) => setCMm(String(ev.target.value))}
            className="w-full accent-cyan-400" dir="ltr" />
        </Field>
        <div className="grid grid-cols-3 gap-2">
          <Field label={e.volt.area} hint="cm²">
            <NumInput value={area} onChange={setArea} />
          </Field>
          <Field label={e.volt.diff} hint="10⁻⁶ cm²/s">
            <NumInput value={d6} onChange={setD6} />
          </Field>
          <Field label={e.volt.window} hint="V">
            <NumInput value={windowV} onChange={setWindowV} />
          </Field>
        </div>
      </div>

      <div className="space-y-3">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]" dir="ltr">
          <svg viewBox={`0 0 ${CH_W} ${CH_H}`} className="w-full">
            <line x1={PX.l} y1={midY} x2={CH_W - PX.r} y2={midY} stroke="#475569" strokeDasharray="4 4" />
            <line x1={PX.l} y1={PX.t} x2={PX.l} y2={CH_H - PX.b} stroke="#334155" />
            <line x1={PX.l} y1={CH_H - PX.b} x2={CH_W - PX.r} y2={CH_H - PX.b} stroke="#334155" />
            <path d={pathD} fill="none" stroke="#22d3ee" strokeWidth="1.6" />
          </svg>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <ResultRow label={e.volt.epc} value={cv ? cv.epc.toFixed(3) : "—"} unit="V" />
          <ResultRow label={e.volt.epa} value={cv ? cv.epa.toFixed(3) : "—"} unit="V" />
          <ResultRow
            label={e.volt.dEp}
            value={cv ? ((cv.epa - cv.epc) * 1000).toFixed(1) : "—"}
            unit={cv ? `mV (≈ ${Math.round(59.16 / num(n))} mV)` : ""}
            highlight
          />
          <ResultRow
            label={e.volt.ipMatch}
            value={Number.isFinite(match) ? match.toFixed(1) : "—"}
            unit="%"
            highlight
          />
        </div>
        <MethodNote>{e.volt.note}</MethodNote>
      </div>
    </div>
  );
}
