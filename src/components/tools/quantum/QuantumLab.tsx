"use client";

import { useEffect, useMemo, useRef, useState, type MouseEvent } from "react";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import {
  CATEGORY_META,
  CATEGORY_ORDER,
  QUANTUM_ELEMENTS,
  formatSpinArrows,
  SHELL_LETTERS,
  getQuantumElement,
  type CategoryId,
  type OrbitalFilter,
  type QuantumElement,
  type ViewMode,
} from "@/lib/chem/quantum-elements";
import { QuantumScene } from "./scene";
import { SPEC_MIN_NM, SPEC_SPAN_NM, drawSpectrum } from "./spectrum";

const ORBITAL_TABS: OrbitalFilter[] = ["all", "s", "p", "d", "f", "none"];
const VIEW_TABS: ViewMode[] = ["atom", "molecule", "table3d"];
const LIGAND_CSS = ["#38bdf8", "#e879f9", "#fbbf24", "#34d399", "#f43f5e", "#a78bfa"];

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={cn(
        "rounded-lg border px-2.5 py-1.5 text-xs font-medium transition",
        value
          ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-100"
          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25",
      )}
    >
      <span className="mr-1 font-mono" dir="ltr">
        {value ? "●" : "○"}
      </span>
      {label}
    </button>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-xs text-slate-400">
        <span>{label}</span>
        <span className="font-mono text-cyan-300" dir="ltr">
          {value.toFixed(2)}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-cyan-400"
        dir="ltr"
      />
    </label>
  );
}

export function QuantumLab() {
  const { t, locale } = useI18n();
  const p = t.pages.quantum;

  const [z, setZ] = useState(6);
  const [viewMode, setViewMode] = useState<ViewMode>("atom");
  const [orbitalFilter, setOrbitalFilter] = useState<OrbitalFilter>("all");
  const [highlightedSubshell, setHighlightedSubshell] = useState<string | null>(null);
  const [orbitSpeed, setOrbitSpeed] = useState(1);
  const [orbitalScale, setOrbitalScale] = useState(1);
  const [autoRotate, setAutoRotate] = useState(false);
  const [spring, setSpring] = useState(true);
  const [orbitGyro, setOrbitGyro] = useState(true);
  const [showTrails, setShowTrails] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<CategoryId | null>(null);
  const [hoverNm, setHoverNm] = useState<number | null>(null);

  const hostRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<QuantumScene | null>(null);
  const specRef = useRef<HTMLCanvasElement | null>(null);

  const element: QuantumElement = getQuantumElement(z) ?? QUANTUM_ELEMENTS[0];
  const meta = CATEGORY_META[element.cat as CategoryId] ?? CATEGORY_META.nonmetal;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const scene = new QuantumScene(host, { onSelectZ: (sel) => setZ(sel) });
    sceneRef.current = scene;
    return () => {
      scene.dispose();
      sceneRef.current = null;
    };
  }, []);

  useEffect(() => {
    sceneRef.current?.showElement(element);
  }, [element]);

  useEffect(() => {
    sceneRef.current?.setFilters({
      viewMode,
      orbitalFilter,
      highlightedSubshell,
      orbitGyro,
      showTrails,
      orbitalScale,
    });
  }, [viewMode, orbitalFilter, highlightedSubshell, orbitGyro, showTrails, orbitalScale]);

  useEffect(() => {
    sceneRef.current?.setLive({ orbitSpeed, autoRotate, spring, dragMode: "rotate" });
  }, [orbitSpeed, autoRotate, spring]);

  useEffect(() => {
    const canvas = specRef.current;
    if (canvas) drawSpectrum(canvas, element, hoverNm);
  }, [element, hoverNm]);

  useEffect(() => {
    const onResize = () => {
      if (specRef.current) drawSpectrum(specRef.current, element, hoverNm);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [element, hoverNm]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return QUANTUM_ELEMENTS.filter((el) => {
      if (activeCat && el.cat !== activeCat) return false;
      if (!q) return true;
      return (
        el.sym.toLowerCase().includes(q) ||
        el.name.toLowerCase().includes(q) ||
        el.fa.includes(query.trim()) ||
        String(el.z) === q
      );
    });
  }, [query, activeCat]);

  const onSpecMove = (e: MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nm = SPEC_MIN_NM + ((e.clientX - rect.left) / rect.width) * SPEC_SPAN_NM;
    const near = element.lines
      .filter((l) => Math.abs(l - nm) < 3.2)
      .sort((a, b) => Math.abs(a - nm) - Math.abs(b - nm))[0];
    setHoverNm(near ?? null);
  };

  const statCell = (label: string, value: string) => (
    <div className="rounded-xl border border-white/10 bg-white/5 px-2.5 py-2 text-center">
      <div className="text-[10px] uppercase tracking-wide text-slate-400">{label}</div>
      <div className="mt-0.5 font-mono text-sm text-slate-100" dir="ltr">
        {value}
      </div>
    </div>
  );

  return (
    <div className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_50%_at_20%_0%,rgba(34,211,238,0.16),transparent_70%),radial-gradient(50%_40%_at_85%_10%,rgba(232,121,249,0.16),transparent)]"
      />
      <Container className="max-w-[1500px]">
        <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

        {/* toolbar */}
        <Reveal className="mb-5">
          <GlassCard className="flex flex-wrap items-center gap-2.5 p-3">
            <div className="flex rounded-xl border border-white/10 bg-white/5 p-1">
              {VIEW_TABS.map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setViewMode(mode)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-xs font-semibold transition",
                    viewMode === mode
                      ? "bg-cyan-400/20 text-cyan-100 shadow-[0_0_16px_-4px_rgba(34,211,238,0.6)]"
                      : "text-slate-300 hover:text-white",
                  )}
                >
                  {p.labels[mode]}
                </button>
              ))}
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={p.searchPlaceholder}
              className="min-w-44 flex-1 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
            />
            <div className="flex flex-wrap items-center gap-1.5">
              {ORBITAL_TABS.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setOrbitalFilter(f)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1.5 font-mono text-xs uppercase transition",
                    orbitalFilter === f
                      ? "border-fuchsia-400/60 bg-fuchsia-400/15 text-fuchsia-100"
                      : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25",
                  )}
                  dir="ltr"
                >
                  {f === "all" ? p.labels.all : f === "none" ? p.labels.none : f}
                </button>
              ))}
            </div>
          </GlassCard>
        </Reveal>

        {/* category pills */}
        <Reveal className="mb-4 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setActiveCat(null)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs transition",
              activeCat === null
                ? "border-white/40 bg-white/15 text-white"
                : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25",
            )}
          >
            {p.labels.all}
          </button>
          {CATEGORY_ORDER.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(activeCat === cat ? null : cat)}
              style={{
                borderColor: activeCat === cat ? CATEGORY_META[cat].border : undefined,
                backgroundColor: activeCat === cat ? CATEGORY_META[cat].bg : undefined,
              }}
              className={cn(
                "rounded-full border px-3 py-1 text-xs transition",
                activeCat === cat
                  ? "text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25",
              )}
            >
              <span className="mr-1.5 inline-block size-2 rounded-full" style={{ background: CATEGORY_META[cat].hex }} />
              {p.categories[CATEGORY_META[cat].i18nKey]}
            </button>
          ))}
        </Reveal>

        {/* main grid */}
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* 3D viewport */}
          <Reveal>
            <GlassCard className="relative h-[520px] overflow-hidden p-0 lg:h-[680px]">
              <div ref={hostRef} className="absolute inset-0" />
              <div className="pointer-events-none absolute top-4 left-4 flex items-center gap-3">
                <div
                  className="rounded-xl border px-3 py-2 backdrop-blur-md"
                  style={{ borderColor: meta.border, background: meta.bg }}
                >
                  <div className="font-mono text-2xl font-bold text-white" dir="ltr">
                    {element.sym}
                    <span className="ml-2 text-xs text-slate-300">{element.z}</span>
                  </div>
                  <div className="text-xs text-slate-200">{locale === "fa" ? element.fa : element.name}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => sceneRef.current?.resetView()}
                className="absolute top-4 right-4 rounded-xl border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 backdrop-blur-md transition hover:border-cyan-400/50 hover:text-cyan-200"
              >
                ⟲ {p.labels.resetView}
              </button>
              <div className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3.5 py-1.5 text-[11px] text-slate-300 backdrop-blur">
                {p.labels.dragHint}
              </div>
            </GlassCard>
          </Reveal>

          {/* sidebar */}
          <Reveal delay={80} className="flex flex-col gap-4">
            <GlassCard className="p-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-baseline gap-2" dir="ltr">
                    <span className="font-mono text-4xl font-bold" style={{ color: meta.hex }}>
                      {element.sym}
                    </span>
                    <span className="font-mono text-sm text-slate-400">{element.name}</span>
                  </div>
                  <div className="mt-1 text-lg text-slate-100">{element.fa}</div>
                </div>
                <span
                  className="rounded-full border px-2.5 py-1 text-[11px]"
                  style={{ borderColor: meta.border, background: meta.bg, color: meta.hex }}
                >
                  {p.categories[meta.i18nKey]}
                </span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                {statCell(p.labels.mass, element.mass.toFixed(3))}
                {statCell(p.labels.neutrons, String(element.neutrons))}
                {statCell(p.labels.valence, String(element.valence))}
                {statCell(p.labels.block, element.block)}
                {statCell(p.labels.group, element.group > 0 ? String(element.group) : "—")}
                {statCell(p.labels.period, String(element.period))}
              </div>
              <div className="mt-3">
                <div className="mb-1 text-[10px] uppercase tracking-wider text-slate-400">{p.labels.config}</div>
                <div
                  className="rounded-lg bg-black/40 px-3 py-2 font-mono text-[13px] text-cyan-200"
                  dir="ltr"
                >
                  {element.config}
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">{p.labels.subshells}</div>
              <div className="flex flex-wrap gap-1.5">
                {element.subshells.map((sub) => {
                  return (
                    <button
                      key={sub.label}
                      type="button"
                      onClick={() => setHighlightedSubshell(highlightedSubshell === sub.label ? null : sub.label)}
                      className={cn(
                        "rounded-lg border px-2 py-1.5 font-mono text-xs transition",
                        highlightedSubshell === sub.label
                          ? "border-white/60 bg-white/15 text-white"
                          : "border-white/10 bg-white/5 text-slate-200 hover:border-white/30",
                      )}
                      dir="ltr"
                    >
                      <span className="font-semibold" style={{ color: meta.hex }}>
                        {sub.label}
                      </span>
                      <span className="mx-1 text-cyan-300">{formatSpinArrows(sub.e, sub.max)}</span>
                      <span className="text-slate-400">
                        {sub.e}/{sub.max}
                      </span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {element.shells.map((count, idx) => (
                  <span
                    key={idx}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-300"
                    dir="ltr"
                  >
                    {SHELL_LETTERS[idx] ?? `n${idx + 1}`}·{count}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-slate-400">{p.labels.spectrum}</span>
                {hoverNm !== null && (
                  <span className="font-mono text-xs text-white" dir="ltr">
                    {hoverNm.toFixed(2)} nm
                  </span>
                )}
              </div>
              <canvas
                ref={specRef}
                className="h-16 w-full cursor-crosshair rounded-lg border border-white/10"
                onMouseMove={onSpecMove}
                onMouseLeave={() => setHoverNm(null)}
              />
              {element.specUrl ? (
                <a
                  href={element.specUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-[11px] text-cyan-300/80 hover:text-cyan-200"
                  dir="ltr"
                >
                  {element.specSource} ↗
                </a>
              ) : null}
            </GlassCard>

            <GlassCard className="p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">{p.labels.moleculeCard}</div>
              <div className="flex items-baseline gap-2" dir="ltr">
                <span className="font-mono text-2xl font-bold text-slate-100">{element.mol.formula}</span>
                <span className="text-xs text-slate-400">{p.geoms[element.mol.geom]}</span>
              </div>
              <div className="mt-1 text-sm text-slate-300">{element.mol.fa}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {element.mol.ligands.map((lig, i) => (
                  <span
                    key={i}
                    className="rounded-md border px-2 py-0.5 font-mono text-[11px]"
                    style={{ borderColor: `${LIGAND_CSS[i % LIGAND_CSS.length]}55`, color: LIGAND_CSS[i % LIGAND_CSS.length] }}
                    dir="ltr"
                  >
                    {lig}
                  </span>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">{p.labels.uses}</div>
              <ul className="list-inside list-disc space-y-1 text-xs leading-relaxed text-slate-300" dir="ltr">
                {element.uses.map((use, i) => (
                  <li key={i}>{use}</li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-4">
              <div className="mb-2 text-[10px] uppercase tracking-wider text-slate-400">{p.labels.controls}</div>
              <div className="grid grid-cols-2 gap-2.5">
                <Slider label={p.labels.orbitSpeed} value={orbitSpeed} min={0} max={3} step={0.05} onChange={setOrbitSpeed} />
                <Slider label={p.labels.orbitalScale} value={orbitalScale} min={0.5} max={1.8} step={0.05} onChange={setOrbitalScale} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <Toggle label={p.labels.autoRotate} value={autoRotate} onChange={setAutoRotate} />
                <Toggle label={p.labels.spring} value={spring} onChange={setSpring} />
                <Toggle label={p.labels.gyro} value={orbitGyro} onChange={setOrbitGyro} />
                <Toggle label={p.labels.trails} value={showTrails} onChange={setShowTrails} />
              </div>
            </GlassCard>
          </Reveal>
        </div>

        {/* element picker */}
        <Reveal className="mt-5">
          <GlassCard className="p-4">
            <div className="mb-3 flex flex-wrap items-center gap-2.5">
              <span className="text-[10px] uppercase tracking-wider text-slate-400">{p.labels.pick}</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={p.searchPlaceholder}
                className="w-52 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-slate-100 outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {filtered.map((el) => {
                const em = CATEGORY_META[el.cat as CategoryId] ?? CATEGORY_META.nonmetal;
                return (
                  <button
                    key={el.z}
                    type="button"
                    onClick={() => {
                      setZ(el.z);
                      setHighlightedSubshell(null);
                    }}
                    style={el.z === z ? { borderColor: em.border, background: em.bg } : undefined}
                    className={cn(
                      "w-12 rounded-lg border px-1 py-1.5 text-center transition",
                      el.z === z ? "text-white" : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25",
                    )}
                  >
                    <span className="block font-mono text-sm font-bold" dir="ltr" style={el.z === z ? { color: em.hex } : undefined}>
                      {el.sym}
                    </span>
                    <span className="font-mono text-[9px] text-slate-500" dir="ltr">
                      {el.z}
                    </span>
                  </button>
                );
              })}
            </div>
          </GlassCard>
        </Reveal>

        <p className="mt-4 text-center text-[11px] text-slate-500">{p.note}</p>
      </Container>
    </div>
  );
}
