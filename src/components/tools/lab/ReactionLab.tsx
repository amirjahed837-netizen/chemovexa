"use client";

import { useMemo, useState, useEffect } from "react";
import { searchReagents } from "@/config/reagents";
import type { Reagent } from "@/config/reagents";
import { balanceEquation } from "@/lib/chem/balance";
import { classify } from "@/lib/chem/classify";
import { REACTION_TYPE_LABEL } from "@/lib/chem/classify";
import { buildWriteup, roleOf } from "@/lib/chem/reaction";

type SlotValue = string;

const PRESETS: {
  label: string;
  left: [string, ...(string | "")[]];
  right: [string, ...(string | "")[]];
}[] = [
  { label: "Neutralization", left: ["HCl", "NaOH"], right: ["NaCl", "H2O"] },
  { label: "Silver mirror", left: ["AgNO3", "NaCl"], right: ["AgCl", "NaNO3"] },
  { label: "Metal + acid", left: ["Zn", "HCl"], right: ["ZnCl2", "H2"] },
  { label: "Methane combustion", left: ["CH4", "O2"], right: ["CO2", "H2O"] },
  { label: "Limestone calcination", left: ["CaCO3", ""], right: ["CaO", "CO2"] },
  { label: "Magnesium synthesis", left: ["Mg", "O2"], right: ["MgO", ""] },
  { label: "Marble + acid", left: ["CaCO3", "HCl"], right: ["CaCl2", "H2O", "CO2"] },
  { label: "Slaking lime", left: ["CaO", "H2O"], right: ["Ca(OH)2", ""] },
  { label: "Baking soda heat", left: ["NaHCO3", ""], right: ["Na2CO3", "H2O", "CO2"] },
  { label: "H₂ + O₂", left: ["H2", "O2"], right: ["H2O", ""] },
  { label: "Propane", left: ["C3H8", "O2"], right: ["CO2", "H2O"] },
  { label: "Ethanol", left: ["C2H5OH", "O2"], right: ["CO2", "H2O"] },
  {
    label: "Wagner oxidation",
    left: ["CH2=CH-CH2-CH3", "KMnO4", "H2O"],
    right: ["CH2(OH)-CH(OH)-CH2-CH3", "MnO2", "KOH"],
  },
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
  label,
}: {
  values: SlotValue[];
  onChange: (v: SlotValue[]) => void;
  label: string;
}) {
  const setSlot = (i: number, v: string) => {
    const next = [...values];
    next[i] = v;
    onChange(next);
  };
  const addSlot = () => onChange([...values, ""]);
  const removeSlot = (i: number) => onChange(values.filter((_, j) => j !== i));

  return (
    <div className="space-y-3">
      {values.map((v, i) => (
        <div key={i}>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-slate-500">
              {label} {String.fromCharCode(65 + i)}
            </label>
            {values.length > 1 && (
              <button
                type="button"
                onClick={() => removeSlot(i)}
                title="Remove this slot"
                className="text-slate-600 transition-colors hover:text-red-400"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5" aria-hidden="true">
                  <path d="M6 6l12 12M6 12l12-12" strokeLinecap="round" />
                </svg>
              </button>
            )}
          </div>
          <ReagentSlot
            value={v}
            onChange={(nv) => setSlot(i, nv)}
            placeholder={i === 0 ? "formula" : "optional"}
          />
          <RoleChips formula={v} />
        </div>
      ))}
      {values.length < 4 && (
        <button
          type="button"
          onClick={addSlot}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-white/15 py-2 text-xs text-slate-500 transition-colors hover:border-cyan-400/40 hover:text-cyan-300"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5" aria-hidden="true">
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          add {label.toLowerCase()}
        </button>
      )}
    </div>
  );
}

type Tab = "writeup" | "ionic" | "atoms" | "type";

const TABS: { id: Tab; label: string }[] = [
  { id: "writeup", label: "What happens" },
  { id: "ionic", label: "Ionic equations" },
  { id: "atoms", label: "Atom audit" },
  { id: "type", label: "Type & safety" },
];

function AiWriteup({ equation, auto }: { equation: string; auto: boolean }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    auto ? "loading" : "idle",
  );
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!equation) return;
    if (!auto && attempt === 0) return;

    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch("/api/assistant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: `Explain this chemical reaction completely for a chemistry student: ${equation}. Cover: (1) reaction type, (2) step-by-step mechanism of what happens to each species, (3) what you would physically observe at the bench, (4) required conditions, (5) key safety notes. Be concrete and correct.`,
            history: [],
          }),
          signal: controller.signal,
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let acc = "";

        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data:")) continue;
            const payload = trimmed.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as { delta?: string };
              if (json.delta) {
                acc += json.delta;
                setText(acc);
              }
            } catch {
              /* ignore malformed SSE lines */
            }
          }
        }
        setStatus(acc ? "done" : "error");
        if (!acc) setError("The AI returned an empty answer — try again.");
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setStatus("error");
        setError(e instanceof Error ? e.message : "Request failed.");
      }
    })();

    return () => controller.abort();
  }, [equation, auto, attempt]);

  return (
    <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.04] p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <h4 className="font-mono text-[10px] uppercase tracking-widest text-cyan-300/80">
          AI write-up — generated live for THIS reaction
        </h4>
        <button
          type="button"
          onClick={() => {
            setStatus("loading");
            setAttempt((n) => n + 1);
          }}
          disabled={status === "loading"}
          className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-[11px] text-cyan-200 transition-colors hover:bg-cyan-400/20 disabled:opacity-40"
        >
          {status === "loading" ? "writing…" : text ? "regenerate" : auto ? "retry" : "ask the AI →"}
        </button>
      </div>

      {status === "idle" && (
        <p className="text-sm text-slate-500">
          The curated library only covers famous reactions. For this one, the site&apos;s AI
          assistant can write a full explanation — press the button.
        </p>
      )}

      {status === "loading" && !text && <p className="text-sm text-slate-500">Thinking…</p>}

      {text && <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-200">{text}</p>}

      {status === "error" && <p className="mt-2 text-xs text-red-300">{error}</p>}
    </div>
  );
}

function WriteupPanel({
  left,
  right,
  coeffs,
}: {
  left: SlotValue[];
  right: SlotValue[];
  coeffs: Map<string, number> | null;
}) {
  const [tab, setTab] = useState<Tab>("writeup");

  const writeup = useMemo(() => {
    if (!coeffs) return null;
    const l = left.filter((f) => f.trim());
    const r = right.filter((f) => f.trim());
    return buildWriteup(l, r, coeffs);
  }, [left, right, coeffs]);

  const classification = useMemo(() => {
    const l = left.map((f) => ({ reagent: findReagentMeta(f), coeff: 1 }));
    const r = right.map((f) => ({ reagent: findReagentMeta(f), coeff: 1 }));
    if (!l.some((x) => x.reagent) || !r.some((x) => x.reagent)) return null;
    return classify(l, r);
  }, [left, right]);

  if (!writeup) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="flex flex-wrap gap-1 border-b border-white/10 bg-white/[0.02] px-3 pt-3">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`rounded-t-lg px-4 py-2.5 text-xs font-medium transition-colors ${
              tab === t.id
                ? "border-b-2 border-cyan-400 bg-cyan-400/10 text-cyan-200"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {tab === "writeup" && (
          <div className="space-y-5">
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="font-display text-lg font-bold text-white">{writeup.title}</h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                    writeup.found
                      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
                      : "border-amber-400/30 bg-amber-400/10 text-amber-300"
                  }`}
                >
                  {writeup.found ? "curated write-up" : "heuristic analysis"}
                </span>
              </div>
              <p className="text-sm font-medium text-cyan-200/90">{writeup.typeLabel}</p>
            </div>

            <section>
              <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Mechanism — why it happens
              </h4>
              <p className="text-sm leading-relaxed text-slate-300">{writeup.mechanism}</p>
            </section>

            <section>
              <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                What happens — the chemistry story
              </h4>
              <p className="text-sm leading-relaxed text-slate-300">{writeup.whatHappens}</p>
            </section>

            <section>
              <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                What you would see at the bench
              </h4>
              <p className="text-sm leading-relaxed text-slate-300">{writeup.observation}</p>
            </section>

            {writeup.conditions && (
              <section>
                <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  Conditions
                </h4>
                <p className="text-sm leading-relaxed text-slate-300">{writeup.conditions}</p>
              </section>
            )}

            <section>
              <h4 className="mb-1.5 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Molar masses
              </h4>
              <div className="flex flex-wrap gap-2">
                {writeup.molarMasses.map((m) => (
                  <span
                    key={m.formula}
                    className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1.5 font-mono text-xs text-slate-300"
                  >
                    {m.formula}:{" "}
                    <span className="text-cyan-300">
                      {Number.isNaN(m.mass) ? "—" : `${m.mass.toFixed(2)} g/mol`}
                    </span>
                  </span>
                ))}
              </div>
            </section>

            {(() => {
              const l = left.filter((f) => f.trim());
              const r = right.filter((f) => f.trim());
              if (l.length === 0 || r.length === 0) return null;
              const eq = `${l.map((f) => `${(coeffs?.get(f) ?? 1) !== 1 ? coeffs?.get(f) : ""}${f}`).join(" + ")} → ${r.map((f) => `${(coeffs?.get(f) ?? 1) !== 1 ? coeffs?.get(f) : ""}${f}`).join(" + ")}`;
              return <AiWriteup key={eq} equation={eq} auto={!writeup.found} />;
            })()}
          </div>
        )}

        {tab === "ionic" && (
          <div className="space-y-4">
            {writeup.ionic ? (
              <>
                <div>
                  <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Complete ionic equation
                  </h4>
                  <p className="rounded-lg border border-white/10 bg-black/30 px-4 py-3 font-mono text-sm text-slate-200">
                    {writeup.ionic.complete}
                  </p>
                </div>
                {writeup.ionic.net && (
                  <div>
                    <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                      Net ionic equation
                    </h4>
                    <p className="rounded-lg border border-violet-400/25 bg-violet-400/[0.07] px-4 py-3 font-mono text-sm text-violet-200">
                      {writeup.ionic.net}
                    </p>
                  </div>
                )}
                {writeup.ionic.note && (
                  <p className="text-xs leading-relaxed text-slate-500">{writeup.ionic.note}</p>
                )}
              </>
            ) : (
              <p className="text-sm leading-relaxed text-slate-400">
                No curated ionic equations for this combination. Heuristic: soluble salts, strong
                acids and strong bases split into ions; solids, gases and water stay whole.
                Spectators are the ions that appear unchanged on both sides — cancel them to get
                the net ionic equation.
              </p>
            )}
          </div>
        )}

        {tab === "atoms" && (
          <div className="space-y-4">
            <p className="text-sm text-slate-400">
              Bookkeeping after balancing — atoms of each element on both sides must match:
            </p>
            <div className="overflow-hidden rounded-lg border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.03] text-left font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    <th className="px-4 py-2.5">Element</th>
                    <th className="px-4 py-2.5">Left</th>
                    <th className="px-4 py-2.5">Right</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {writeup.atomInventory.map((row) => (
                    <tr key={row.symbol} className="border-b border-white/5 last:border-0">
                      <td className="px-4 py-2.5">
                        <span className="font-mono text-white">{row.symbol}</span>
                        <span className="ml-2 text-xs text-slate-500">{row.name}</span>
                      </td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">{row.left}</td>
                      <td className="px-4 py-2.5 font-mono text-slate-300">{row.right}</td>
                      <td className="px-4 py-2.5">
                        {row.ok ? (
                          <span className="text-emerald-400">✓ conserved</span>
                        ) : (
                          <span className="text-red-400">✗ mismatch</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "type" && (
          <div className="space-y-5">
            {classification ? (
              <>
                <div>
                  <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Reaction type
                  </h4>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-violet-400/25 bg-violet-400/10 px-3 py-1 text-sm font-medium text-violet-200">
                    {REACTION_TYPE_LABEL[classification.type]}
                  </span>
                </div>
                <div>
                  <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                    Bench observation (heuristic)
                  </h4>
                  <p className="text-sm leading-relaxed text-slate-300">
                    {classification.observation}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400">
                Enter reagents on both sides to classify the reaction.
              </p>
            )}
            <div>
              <h4 className="mb-2 font-mono text-[10px] uppercase tracking-widest text-slate-500">
                Safety notes
              </h4>
              {writeup.safety.length > 0 ? (
                <ul className="space-y-1.5">
                  {writeup.safety.map((s) => (
                    <li
                      key={s}
                      className="flex items-start gap-2 text-xs leading-relaxed text-amber-200/90"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="mt-0.5 size-3.5 shrink-0"
                        aria-hidden="true"
                      >
                        <path
                          d="M12 9v4m0 4h.01M10.3 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.7 3.86a2 2 0 0 0-3.4 0Z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
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
    </div>
  );
}

function RoleChips({ formula }: { formula: string }) {
  const f = formula.trim();
  if (!f) return null;
  const meta = findReagentMeta(f);
  const { label, color } = roleOf(f);
  return (
    <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
      <span className={`rounded-full border px-2 py-0.5 ${color}`}>{label}</span>
      {meta && <span className="text-slate-600">{meta.name}</span>}
    </div>
  );
}

export function ReactionLab() {
  const [left, setLeft] = useState<SlotValue[]>(["HCl", "NaOH"]);
  const [right, setRight] = useState<SlotValue[]>(["NaCl", "H2O"]);

  function applyPreset(i: number) {
    const p = PRESETS[i];
    const pad = (arr: (string | "")[]) => {
      const filled = arr.filter((f) => f !== "");
      while (filled.length < 2) filled.push("");
      return filled.slice(0, 4);
    };
    setLeft(pad(p.left));
    setRight(pad(p.right));
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
      <div className="grid gap-5 lg:grid-cols-[1fr_auto_1fr] lg:items-start">
        <div>
          <EquationSide
            values={left}
            onChange={setLeft}
            label="Reactant"
          />
        </div>
        <div className="hidden h-9 w-9 shrink-0 place-items-center rounded-full border border-cyan-400/30 bg-cyan-400/10 font-mono text-cyan-300 lg:grid lg:mt-7">
          →
        </div>
        <div>
          <EquationSide
            values={right}
            onChange={setRight}
            label="Product"
          />
        </div>
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
            const renderSide = (vals: SlotValue[], side: "L" | "R") => {
              const out: React.ReactNode[] = [];
              vals.forEach((f, i) => {
                if (!f.trim()) return;
                const coeff = coeffs.get(f.trim()) ?? 1;
                const meta = findReagentMeta(f);
                out.push(
                  <span key={`${side}${i}`} className="inline-flex items-baseline gap-1.5">
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
            parts.push(...renderSide(left, "L"));
            parts.push(
              <span key="arrow" className="mx-2 inline-block -translate-y-0.5 font-mono text-xl text-cyan-300">
                ⟶
              </span>,
            );
            parts.push(...renderSide(right, "R"));
            return <div className="flex flex-wrap items-center gap-y-2 leading-relaxed">{parts}</div>;
          })()
        )}

        {!error && coeffs && (
          <p className="mt-4 font-mono text-[11px] text-slate-600">
            solved by exact rational elimination · atoms conserved on both sides ✓
          </p>
        )}
      </div>

      {/* AI diagnosis for unbalanced input */}
      {error &&
        (() => {
          const l = left.filter((f) => f.trim());
          const r = right.filter((f) => f.trim());
          if (l.length === 0 || r.length === 0) return null;
          const eq = `${l.join(" + ")} → ${r.join(" + ")}`;
          return (
            <AiWriteup
              key={eq}
              equation={`${eq} (Note: as entered, this equation could not be balanced — diagnose what is missing or wrong and give the correct balanced reaction if one exists.)`}
              auto
            />
          );
        })()}

      {/* write-up panel */}
      <WriteupPanel left={left} right={right} coeffs={coeffs} />
    </div>
  );
}
