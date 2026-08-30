"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { MOLECULES } from "@/config/molecules";
import { CATEGORY_LABEL } from "@/config/molecules";
import type { Molecule } from "@/config/molecules";
import { toMolblock } from "@/lib/chem/molfile";
import {
  MoleculeViewer,
} from "@/components/tools/explorer/MoleculeViewer";
import type { ViewerStyleKey } from "@/components/tools/explorer/MoleculeViewer";
import { cn } from "@/lib/utils";

type CustomModel = { title: string; data: string; format: string };

const STYLE_OPTIONS: { id: ViewerStyleKey; label: string }[] = [
  { id: "ballstick", label: "Ball & Stick" },
  { id: "stick", label: "Sticks" },
  { id: "spacefill", label: "Space-filling" },
];

function prettyFormula(f: string): React.ReactNode {
  return f.split("").map((ch, i) =>
    /\d/.test(ch) ? <sub key={i}>{ch}</sub> : <span key={i}>{ch}</span>,
  );
}

export function ExplorerApp() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(MOLECULES[0].id);
  const [styleKey, setStyleKey] = useState<ViewerStyleKey>("ballstick");
  const [showLabels, setShowLabels] = useState(false);
  const [spinning, setSpinning] = useState(true);

  const [pasteText, setPasteText] = useState("");
  const [pasteFormat, setPasteFormat] = useState("mol");
  const [custom, setCustom] = useState<CustomModel | null>(null);

  const [pubchemQuery, setPubchemQuery] = useState("");
  const [pubchemState, setPubchemState] = useState<"idle" | "loading" | "error" | "done">("idle");
  const [pubchemMsg, setPubchemMsg] = useState("");

  const selected = MOLECULES.find((m) => m.id === selectedId) ?? MOLECULES[0];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOLECULES;
    return MOLECULES.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.formula.toLowerCase().includes(q) ||
        m.tags.some((t) => t.includes(q)),
    );
  }, [query]);

  const model = custom
    ? { molfile: custom.data, format: custom.format, atoms: null as Molecule["atoms"] | null }
    : {
        molfile: toMolblock(selected.name, selected.atoms, selected.bonds),
        format: "mol",
        atoms: selected.atoms,
      };
  const title = custom ? custom.title : selected.name;

  async function fetchPubChem() {
    const q = pubchemQuery.trim();
    if (!q) return;
    setPubchemState("loading");
    setPubchemMsg(`Looking up "${q}" on PubChem…`);
    try {
      const res = await fetch(
        `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(q)}/SDF?record_type=3d`,
      );
      if (res.status === 404) throw new Error("No 3D structure found for that name.");
      if (!res.ok) throw new Error(`PubChem responded with ${res.status}.`);
      const text = await res.text();
      if (!text.includes("V2000") && !text.includes("V3000")) {
        throw new Error("Response did not contain a structure.");
      }
      setCustom({ title: q, data: text, format: "sdf" });
      setPubchemState("done");
      setPubchemMsg(`Loaded "${q}" from PubChem.`);
    } catch (e) {
      setPubchemState("error");
      setPubchemMsg(
        e instanceof Error
          ? `${e.message} (network restrictions may block PubChem — try the paste box instead)`
          : "Lookup failed.",
      );
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
      {/* library sidebar */}
      <div className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setCustom(null);
          }}
          placeholder="Search molecules…"
          spellCheck={false}
          className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/70"
        />

        <ul className="max-h-[420px] space-y-1.5 overflow-y-auto pr-1 lg:max-h-[520px]">
          {filtered.map((m) => (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => {
                  setSelectedId(m.id);
                  setCustom(null);
                }}
                aria-pressed={!custom && selectedId === m.id}
                className={cn(
                  "flex w-full items-center justify-between gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-all",
                  !custom && selectedId === m.id
                    ? "border-cyan-400/50 bg-cyan-400/10 text-cyan-100"
                    : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/25 hover:text-white",
                )}
              >
                <span className="font-medium">{m.name}</span>
                <span className="font-mono text-xs text-slate-500">{m.formula}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-sm text-slate-600">No matches.</li>
          )}
        </ul>

        {/* advanced loading */}
        <details className="rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-400 [&_b]:text-slate-300">
          <summary className="cursor-pointer select-none font-medium text-slate-200">
            Load any molecule
          </summary>
          <div className="mt-3 space-y-3">
            <p>
              Fetch a 3D structure from <b>PubChem</b> by compound name:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={pubchemQuery}
                onChange={(e) => setPubchemQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchPubChem()}
                placeholder='caffeine, aspirin…'
                spellCheck={false}
                className="h-9 min-w-0 flex-1 rounded-md border border-white/10 bg-white/[0.04] px-2.5 font-mono text-xs text-slate-100 outline-none focus:border-cyan-400/70"
              />
              <button
                type="button"
                onClick={fetchPubChem}
                disabled={pubchemState === "loading"}
                className="h-9 shrink-0 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-50"
              >
                {pubchemState === "loading" ? "…" : "Fetch"}
              </button>
            </div>
            {pubchemState !== "idle" && (
              <p
                className={cn(
                  "text-xs leading-relaxed",
                  pubchemState === "error" ? "text-red-300/90" : "text-slate-500",
                )}
              >
                {pubchemMsg}
              </p>
            )}

            <p className="pt-1">
              …or paste raw <b>MOL/SDF</b> or <b>PDB</b> data:
            </p>
            <textarea
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              rows={4}
              placeholder={"  \n \n  0  0  0  0  0  0  0  0  0  0999 V2000\n…"}
              spellCheck={false}
              className="w-full rounded-md border border-white/10 bg-white/[0.04] p-2.5 font-mono text-[11px] text-slate-200 outline-none focus:border-cyan-400/70"
            />
            <div className="flex items-center gap-2">
              <select
                value={pasteFormat}
                onChange={(e) => setPasteFormat(e.target.value)}
                className="h-8 rounded-md border border-white/10 bg-white/[0.04] px-2 font-mono text-xs text-slate-200 outline-none"
              >
                <option value="mol" className="bg-ink-900">MOL/SDF</option>
                <option value="pdb" className="bg-ink-900">PDB</option>
                <option value="xyz" className="bg-ink-900">XYZ</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  if (!pasteText.trim()) return;
                  setCustom({ title: "Pasted structure", data: pasteText, format: pasteFormat });
                  setPubchemState("idle");
                  setPubchemMsg("");
                }}
                className="h-8 rounded-md border border-cyan-400/30 bg-cyan-400/10 px-3 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
              >
                Load
              </button>
              {custom && (
                <button
                  type="button"
                  onClick={() => {
                    setCustom(null);
                    setPasteText("");
                  }}
                  className="ml-auto text-xs text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
                >
                  back to library
                </button>
              )}
            </div>
          </div>
        </details>

        <p className="text-xs leading-relaxed text-slate-600">
          Structures are rendered locally with{" "}
          <Link href="/programming/projects" className="text-cyan-400/70 hover:text-cyan-300">
            3Dmol.js
          </Link>{" "}
          — drag to rotate, scroll to zoom.
        </p>
      </div>

      {/* viewer + info */}
      <div className="space-y-5">
        <div className="glass overflow-hidden rounded-2xl border border-white/10">
          {/* toolbar */}
          <div className="flex flex-wrap items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
            <span className="font-display mr-1 text-sm font-semibold text-white">{title}</span>
            {!custom && (
              <span className="hidden font-mono text-xs text-slate-500 sm:inline">
                {selected.formula}
              </span>
            )}

            <div className="ml-auto flex flex-wrap items-center gap-2">
              <div className="flex rounded-lg border border-white/10 bg-white/[0.03] p-0.5">
                {STYLE_OPTIONS.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setStyleKey(o.id)}
                    aria-pressed={styleKey === o.id}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-[11px] font-medium transition",
                      styleKey === o.id
                        ? "bg-cyan-400/15 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)]"
                        : "text-slate-500 hover:text-slate-300",
                    )}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setShowLabels((v) => !v)}
                aria-pressed={showLabels}
                title="Toggle element labels"
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition",
                  showLabels
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300",
                )}
              >
                Labels
              </button>
              <button
                type="button"
                onClick={() => setSpinning((v) => !v)}
                aria-pressed={spinning}
                title="Toggle auto-rotate"
                className={cn(
                  "rounded-lg border px-2.5 py-1.5 text-[11px] font-medium transition",
                  spinning
                    ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.03] text-slate-500 hover:text-slate-300",
                )}
              >
                Spin
              </button>
            </div>
          </div>

          <MoleculeViewer
            molfile={model.molfile}
            format={model.format}
            atoms={model.atoms}
            styleKey={styleKey}
            showLabels={showLabels}
            spinning={spinning}
          />
        </div>

        {/* info panel */}
        {!custom ? (
          <div className="glass rounded-2xl border border-white/10 p-6">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-xl font-bold text-white">{selected.name}</h3>
              <span className="font-mono text-sm text-cyan-300/90">{prettyFormula(selected.formula)}</span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[11px] text-slate-400">
                {CATEGORY_LABEL[selected.category]}
              </span>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-400">
              {selected.description}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {selected.facts.map((f) => (
                <li
                  key={f}
                  className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1 font-mono text-[11px] text-slate-300"
                >
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="px-1 text-center text-xs text-slate-600">
            Custom structure loaded — pick a molecule from the library to return.
          </p>
        )}
      </div>
    </div>
  );
}
