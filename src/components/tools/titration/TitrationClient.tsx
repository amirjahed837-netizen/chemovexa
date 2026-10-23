"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { num, fmt } from "@/lib/chem/format";
import { Field, NumInput, Select, SubTabs } from "@/components/tools/calculator/shared";
import {
  derivativeSeries,
  equivalenceMl,
  granFit,
  pKwOf,
  redoxCurve,
  redoxEquivalenceMl,
  redoxPotential,
  titrationCurve,
  titrationPH,
  type AnalyteKind,
  type RedoxInput,
  type TitrationInput,
} from "@/lib/chem/titration";
import { BANDS, CurveChart, DerivativeChart, GranChart, SpeciesChart } from "./TitrationCharts";

const SPECIES_COLORS = ["#22d3ee", "#e879f9", "#fbbf24", "#34d399"];

type SystemId = AnalyteKind | "redox";
type ViewId = "curve" | "derivative" | "gran";

const SYSTEMS: Record<SystemId, { analyte: string; titrant: string }> = {
  "strong-acid": { analyte: "HCl", titrant: "NaOH" },
  "weak-acid": { analyte: "CH₃COOH", titrant: "NaOH" },
  "weak-base": { analyte: "NH₃", titrant: "HCl" },
  "strong-base": { analyte: "NaOH", titrant: "HCl" },
  diprotic: { analyte: "H₂CO₃", titrant: "NaOH" },
  triprotic: { analyte: "H₃PO₄", titrant: "NaOH" },
  redox: { analyte: "Fe²⁺", titrant: "Ce⁴⁺" },
};

const K_PRESETS: Partial<Record<SystemId, [string, string, string]>> = {
  "weak-acid": ["1.8e-5", "1", "1"],
  "weak-base": ["1.8e-5", "1", "1"],
  diprotic: ["4.45e-7", "4.7e-11", "1"],
  triprotic: ["7.1e-3", "6.3e-8", "4.5e-13"],
};

const REDOX_PRESETS: { e0A: string; nA: string; e0T: string; nT: string; label: string }[] = [
  { e0A: "0.771", nA: "1", e0T: "1.61", nT: "1", label: "Fe²⁺ / Ce⁴⁺" },
  { e0A: "0.771", nA: "1", e0T: "1.51", nT: "5", label: "Fe²⁺ / MnO₄⁻" },
];

const INDICATOR_COLORS: Record<string, string> = {
  methylOrange: "#fb923c",
  methylRed: "#f87171",
  bromothymol: "#34d399",
  phenolRed: "#f43f5e",
  phenolphthalein: "#c084fc",
};

const SPECIES_LABELS: Partial<Record<SystemId, string[]>> = {
  "weak-acid": ["HA", "A⁻"],
  "weak-base": ["BH⁺", "B"],
  diprotic: ["H₂CO₃", "HCO₃⁻", "CO₃²⁻"],
  triprotic: ["H₃PO₄", "H₂PO₄⁻", "HPO₄²⁻", "PO₄³⁻"],
};

function kaCount(s: SystemId): number {
  if (s === "diprotic") return 2;
  if (s === "triprotic") return 3;
  if (s === "weak-acid" || s === "weak-base") return 1;
  return 0;
}

export function TitrationClient() {
  const { t, locale } = useI18n();
  const p = t.pages.titration;

  const [system, setSystem] = useState<SystemId>("weak-acid");
  const [analyteM, setAnalyteM] = useState("0.100");
  const [analyteMl, setAnalyteMl] = useState("25.0");
  const [titrantM, setTitrantM] = useState("0.100");
  const [k, setK] = useState("1.8e-5");
  const [k2, setK2] = useState("1");
  const [k3, setK3] = useState("1");
  const [tempC, setTempC] = useState(25);
  const [e0A, setE0A] = useState("0.771");
  const [nA, setNA] = useState("1");
  const [e0T, setE0T] = useState("1.61");
  const [nT, setNT] = useState("1");
  const [v, setV] = useState(0);
  const [view, setView] = useState<ViewId>("curve");

  const isRedox = system === "redox";
  const aM = num(analyteM);
  const aV = num(analyteMl);
  const tM = num(titrantM);
  const k2V = num(k2) ?? 1;
  const k3V = num(k3) ?? 1;
  const e0Av = num(e0A);
  const nAv = num(nA);
  const e0Tv = num(e0T);
  const nTv = num(nT);

  const baseValid = aM !== null && aM > 0 && aV !== null && aV > 0 && tM !== null && tM > 0;
  const ksOk =
    !isRedox &&
    Array.from({ length: kaCount(system) }).every((_, i) => {
      const kv = [num(k), num(k2), num(k3)][i];
      return kv !== null && kv > 0;
    });
  const redoxValid = e0Av !== null && nAv !== null && e0Tv !== null && nTv !== null && nAv > 0 && nTv > 0;
  const valid = baseValid && (isRedox ? redoxValid : ksOk);

  void locale;

  const abInput: TitrationInput | null = useMemo(() => {
    if (!baseValid || aM === null || aV === null || tM === null) return null;
    return {
      analyte: system as AnalyteKind,
      analyteM: aM,
      analyteMl: aV,
      titrantM: tM,
      k: num(k) ?? 0,
      k2: k2V,
      k3: k3V,
      tempC,
    };
  }, [system, aM, aV, tM, k, tempC, baseValid, k2V, k3V]);

  const rxInput: RedoxInput | null = useMemo(() => {
    if (!redoxValid || aM === null || aV === null || tM === null || e0Av === null || nAv === null || e0Tv === null || nTv === null) return null;
    return {
      analyteE0: e0Av, analyteN: nAv, titrantE0: e0Tv, titrantN: nTv,
      analyteM: aM, analyteMl: aV, titrantM: tM, tempC,
    };
  }, [redoxValid, aM, aV, tM, e0Av, nAv, e0Tv, nTv, tempC]);

  const ve1 = abInput ? equivalenceMl(abInput) : 0;
  const veList = !abInput ? [] : system === "diprotic" ? [ve1, 2 * ve1] : system === "triprotic" ? [ve1, 2 * ve1, 3 * ve1] : [ve1];
  const rxVe = rxInput ? redoxEquivalenceMl(rxInput.analyteM, rxInput.analyteMl, rxInput.analyteN, rxInput.titrantM, rxInput.titrantN) : 0;
  const ves = isRedox ? [rxVe] : veList;

  const mult = system === "triprotic" ? 3.5 : system === "diprotic" ? 2.5 : 2;
  const maxV = Math.max((isRedox ? 2 : mult) * (ves[0] ?? 0), (aV ?? 25) + 1);

  const rawPts = useMemo(
    () => (abInput ? titrationCurve(abInput, maxV, 500) : []),
    [abInput, maxV],
  );
  const pts = useMemo(() => rawPts.map((pt) => ({ vMl: pt.vMl, y: pt.pH })), [rawPts]);
  const rxPts = useMemo(
    () => (rxInput ? redoxCurve(rxInput, maxV, 500).map((pt) => ({ vMl: pt.vMl, y: pt.eV })) : []),
    [rxInput, maxV],
  );
  const curvePts = isRedox ? rxPts : pts;

  const vEff = Math.min(v, maxV);
  const currentVal = isRedox
    ? rxInput ? redoxPotential(rxInput, vEff) : 0
    : abInput ? titrationPH(abInput, vEff) : 7;

  const dPts = useMemo(
    () => derivativeSeries(curvePts, (pt) => pt.y),
    [curvePts],
  );

  const gran =
    abInput && !isRedox && ve1 > 0 ? granFit(abInput, rawPts, ve1) : null;

  const nearestVe = ves.length
    ? ves.reduce((best, ve) => (Math.abs(vEff - ve) < Math.abs(vEff - best) ? ve : best), ves[0])
    : 0;
  const phase =
    !ves.length ? null
      : Math.abs(vEff - nearestVe) < maxV * 0.002 ? p.phase.at
      : vEff < nearestVe ? p.phase.before : p.phase.after;

  const kas = !isRedox && abInput
    ? system === "weak-base" ? [10 ** -pKwOf(tempC) / (num(k) ?? 1)] : system === "diprotic" ? [num(k) ?? 1, k2V] : system === "triprotic" ? [num(k) ?? 1, k2V, k3V] : system === "weak-acid" ? [num(k) ?? 1] : []
    : [];
  const speciesLabels = SPECIES_LABELS[system as SystemId];

  const pKw = pKwOf(tempC);
  const caption = valid
    ? isRedox
      ? `${aV} mL ${SYSTEMS[system].analyte} ${aM} M + ${SYSTEMS[system].titrant} ${tM} M`
      : `${aV} mL ${SYSTEMS[system].analyte} ${aM} M + ${SYSTEMS[system].titrant} ${tM} M`
    : "";

  const yDomain = isRedox
    ? curvePts.length
      ? (() => {
          const lo = Math.floor((Math.min(...curvePts.map((q) => q.y)) - 0.05) * 4) / 4;
          const hi = Math.ceil((Math.max(...curvePts.map((q) => q.y)) + 0.05) * 4) / 4;
          return { min: lo, max: hi, step: hi - lo > 1.6 ? 0.25 : 0.1 };
        })()
      : { min: 0, max: 2, step: 0.25 }
    : { min: 0, max: 14, step: 2 };

  const exportCsv = () => {
    if (!curvePts.length) return;
    const rows = [`V_mL,${isRedox ? "E_V" : "pH"}`, ...curvePts.map((pt) => `${pt.vMl.toFixed(3)},${pt.y.toFixed(4)}`)];
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "titration-curve.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const pHve = !isRedox && abInput && ves[0] > 0 ? titrationPH(abInput, ves[0]) : null;

  const stats: { label: string; value: string }[] = [];
  if (phase) stats.push({ label: p.phaseLabel, value: phase });
  if (ves.length) {
    stats.push({ label: p.eqPoints, value: `${ves.map((ve) => ve.toFixed(2)).join(" / ")} mL` });
  }
  if (isRedox && rxInput && nAv !== null && nTv !== null && e0Av !== null && e0Tv !== null) {
    stats.push({ label: p.eAtEq, value: `${fmt((nAv * e0Av + nTv * e0Tv) / (nAv + nTv), 3)} V` });
    stats.push({ label: p.e0a, value: `${fmt(e0Av, 3)} V` });
    stats.push({ label: p.e0t, value: `${fmt(e0Tv, 3)} V` });
  } else {
    if (ves.length) stats.push({ label: `${p.eqPoint} (pH)`, value: pHve !== null ? fmt(pHve, 2) : "—" });
    if (abInput && kaCount(system) > 0) {
      stats.push({
        label: p.halfEq,
        value: `pH ${fmt(titrationPH(abInput, ves[0] / 2), 3)}`,
      });
      if (system === "diprotic" || system === "triprotic") {
        stats.push({ label: "pKa₂", value: fmt(titrationPH(abInput, 1.5 * ve1), 2) });
      }
      if (system === "triprotic") {
        stats.push({ label: "pKa₃", value: fmt(titrationPH(abInput, 2.5 * ve1), 3) });
      }
    }
  }

  const views: { id: ViewId; label: string }[] = [
    { id: "curve", label: p.view.curve },
    { id: "derivative", label: isRedox ? p.derivLabelE : p.derivLabel },
    ...(!isRedox ? [{ id: "gran" as ViewId, label: p.view.gran }] : []),
  ];

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />
      <Container className="py-14">
        <Reveal>
          <div className="grid gap-8 lg:grid-cols-[340px_1fr]">
            <GlassCard className="space-y-5 self-start p-6">
              <Field label={p.analyte}>
                <Select
                  value={system}
                  onChange={(val) => {
                    const s = val as SystemId;
                    setSystem(s);
                    if (s === "redox") {
                      setE0A("0.771"); setNA("1"); setE0T("1.61"); setNT("1");
                    } else if (K_PRESETS[s]) {
                      const [pk, pk2, pk3] = K_PRESETS[s] ?? ["0", "0", "0"];
                      setK(pk); setK2(pk2); setK3(pk3);
                    }
                    setV(0);
                    setView("curve");
                  }}
                  options={(Object.keys(SYSTEMS) as SystemId[]).map((id) => ({ value: id, label: p.analytes[id] }))}
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
              {isRedox ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <Field label={p.e0a}>
                      <NumInput value={e0A} onChange={setE0A} placeholder="0.771" />
                    </Field>
                    <Field label={p.nAn}>
                      <NumInput value={nA} onChange={setNA} placeholder="1" />
                    </Field>
                    <Field label={p.e0t}>
                      <NumInput value={e0T} onChange={setE0T} placeholder="1.61" />
                    </Field>
                    <Field label={p.nTt}>
                      <NumInput value={nT} onChange={setNT} placeholder="5" />
                    </Field>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {REDOX_PRESETS.map((rx) => (
                      <button
                        key={rx.label}
                        type="button"
                        onClick={() => {
                          setE0A(rx.e0A); setNA(rx.nA); setE0T(rx.e0T); setNT(rx.nT);
                        }}
                        className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-200"
                        dir="ltr"
                      >
                        {rx.label}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {kaCount(system) >= 1 && (
                    <Field label={kaCount(system) === 1 && system === "weak-base" ? p.kb : p.ka1} hint={system === "weak-base" ? "Kb" : "Ka₁"}>
                      <NumInput value={k} onChange={setK} placeholder="1.8e-5" />
                    </Field>
                  )}
                  {kaCount(system) >= 2 && (
                    <Field label={p.ka2}>
                      <NumInput value={k2} onChange={setK2} placeholder="4.7e-11" />
                    </Field>
                  )}
                  {kaCount(system) >= 3 && (
                    <Field label={p.ka3}>
                      <NumInput value={k3} onChange={setK3} placeholder="4.5e-13" />
                    </Field>
                  )}
                </>
              )}
              <Field label={p.tempC}>
                <div className="flex items-center gap-3" dir="ltr">
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={1}
                    value={tempC}
                    onChange={(e) => setTempC(Number(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-cyan-400"
                    aria-label={p.tempC}
                  />
                  <span className="font-mono text-xs text-cyan-300">{tempC}°C</span>
                  <span className="font-mono text-[10px] text-slate-500">pKw {fmt(pKw, 3)}</span>
                </div>
              </Field>
              {!valid && <p className="text-xs text-red-300">{p.invalid}</p>}
              {caption && (
                <p className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-[11px] text-slate-400" dir="ltr">
                  {caption}
                </p>
              )}
            </GlassCard>
            <div className="space-y-5">
              {valid && curvePts.length > 0 && (
                <GlassCard className="p-4 sm:p-6">
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div className="w-full sm:w-auto">
                      <SubTabs
                        tabs={views.map((vw) => ({ id: vw.id, label: vw.label }))}
                        active={view}
                        onChange={(id) => setView(id as ViewId)}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={exportCsv}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
                    >
                      {p.exportCsv} ↓
                    </button>
                  </div>
                  <div dir="ltr">
                    {view === "curve" && (
                      <CurveChart
                        points={curvePts}
                        maxV={maxV}
                        ves={ves}
                        halfEq={ves.length > 0 && (isRedox || kaCount(system) > 0) ? ves[0] / 2 : null}
                        v={vEff}
                        val={currentVal}
                        yMin={yDomain.min}
                        yMax={yDomain.max}
                        yStep={yDomain.step}
                        yLabel={isRedox ? "E / V" : "pH"}
                        showBands={!isRedox}
                        onPick={setV}
                      />
                    )}
                    {view === "derivative" && (
                      <DerivativeChart dPts={dPts} maxV={maxV} ves={ves} v={vEff} yLabel={isRedox ? p.derivLabelE : p.derivLabel} />
                    )}
                    {view === "gran" && gran && <GranChart fit={gran} maxV={maxV} ve={ves[0]} />}
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
                  {!isRedox && pHve !== null && (
                    <div className="mt-4 flex flex-wrap gap-1.5" dir="ltr">
                      {BANDS.map((b) => {
                        const ok = pHve >= b.lo && pHve <= b.hi;
                        return (
                          <span
                            key={b.id}
                            className={cn(
                              "flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px]",
                              ok ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200" : "border-white/10 bg-white/[0.03] text-slate-500",
                            )}
                          >
                            <span className="size-2 rounded-full" style={{ background: INDICATOR_COLORS[b.id] ?? "#94a3b8" }} />
                            {p.indicators[b.id as keyof typeof p.indicators]} {b.lo}–{b.hi}
                            <span className={ok ? "text-emerald-300" : "text-slate-600"}>{ok ? "✓" : "✗"}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </GlassCard>
              )}

              {valid && curvePts.length > 0 && (
                <div className="grid gap-4 sm:grid-cols-[minmax(160px,220px)_1fr]">
                  <div className="rounded-xl border border-cyan-400/30 bg-cyan-400/[0.07] px-5 py-4 text-center" dir="ltr">
                    <p className="text-[10px] uppercase tracking-widest text-cyan-200/80">{isRedox ? "E / V" : "pH"}</p>
                    <p className="font-display mt-1 text-4xl font-bold text-gradient">{fmt(currentVal, 3)}</p>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div className="relative h-full" style={{ paddingLeft: `${((currentVal - yDomain.min) / (yDomain.max - yDomain.min)) * 100}%` }}>
                        <span className="absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-slate-950 shadow" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 self-start sm:grid-cols-3 lg:grid-cols-1">
                    {stats.map((s) => (
                      <Stat key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>
              )}

              {kas.length > 0 && speciesLabels && (
                <GlassCard className="p-4 sm:p-6">
                  <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">{p.speciesTitle}</span>
                    <div className="flex flex-wrap gap-2" dir="ltr">
                      {speciesLabels.map((s, i) => (
                        <span key={s} className="flex items-center gap-1 font-mono text-[10px] text-slate-400">
                          <span className="size-2 rounded-full" style={{ background: SPECIES_COLORS[i % SPECIES_COLORS.length] }} />
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <SpeciesChart kas={kas} labels={speciesLabels} ph={currentVal} />
                </GlassCard>
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
