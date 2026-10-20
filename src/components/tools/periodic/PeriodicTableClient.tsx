"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import {
  CATEGORY_ORDER,
  PERIODIC_ELEMENTS,
  elementFaName,
  type ElementCategory,
} from "@/lib/chem/periodic-table";
import { cn } from "@/lib/utils";

/** dark-theme tile colors per element category (border + tint + text) */
const CATEGORY_STYLE: Record<ElementCategory, string> = {
  alkali: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  alkaline: "border-orange-400/40 bg-orange-400/10 text-orange-200",
  transition: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  postTransition: "border-teal-400/25 bg-teal-400/10 text-teal-200",
  metalloid: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  nonmetal: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  halogen: "border-sky-400/25 bg-sky-400/10 text-sky-200",
  noble: "border-violet-400/25 bg-violet-400/10 text-violet-200",
  lanthanide: "border-fuchsia-400/25 bg-fuchsia-400/10 text-fuchsia-200",
  actinide: "border-purple-400/25 bg-purple-400/10 text-purple-200",
};

/** f-block rows sit visually indented under group 3 */
const F_ROW_START_COLUMN = 3;

export function PeriodicTableClient() {
  const { t, locale } = useI18n();
  const p = t.pages.periodic;

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ElementCategory | null>(null);
  const [selected, setSelected] = useState(6); // Carbon — a friendly default

  const q = query.trim().toLowerCase();

  /** null = no filter active; otherwise the set of matching Z values */
  const matches = useMemo(() => {
    if (!q && !category) return null;
    const needle = q.toLowerCase();
    return new Set(
      PERIODIC_ELEMENTS.filter((el) => {
        if (category && el.category !== category) return false;
        if (!needle) return true;
        return (
          el.symbol.toLowerCase().includes(needle) ||
          el.name.toLowerCase().includes(needle) ||
          (elementFaName(el.symbol) ?? "").includes(q) ||
          String(el.z) === q
        );
      }).map((el) => el.z),
    );
  }, [q, category]);

  const sel = PERIODIC_ELEMENTS.find((el) => el.z === selected);
  if (!sel) return null;
  const faName = elementFaName(sel.symbol);

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description} />

      {/* search + category legend */}
      <Container className="pt-10">
        <Reveal>
          <div className="flex flex-col gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={p.searchPlaceholder}
              spellCheck={false}
              className="h-11 w-full max-w-md rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/70"
            />
            <div className="flex flex-wrap gap-1.5">
              {CATEGORY_ORDER.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory((c) => (c === cat ? null : cat))}
                  aria-pressed={category === cat}
                  className={cn(
                    "rounded-full border px-3 py-1 text-[11px] transition-all",
                    CATEGORY_STYLE[cat],
                    category !== cat && "opacity-45 hover:opacity-80",
                    category === cat && "ring-1 ring-white/40",
                  )}
                >
                  {p.categories[cat]}
                </button>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>

      {/* selected-element detail panel */}
      <Container className="py-8">
        <Reveal>
          <GlassCard className="flex flex-col gap-5 p-6 sm:flex-row sm:items-start">
            <div
              className={cn(
                "flex size-24 shrink-0 flex-col items-center justify-center rounded-2xl border-2",
                CATEGORY_STYLE[sel.category],
              )}
              dir="ltr"
            >
              <span className="text-[10px] opacity-70">{sel.z}</span>
              <span className="font-display text-4xl font-bold">{sel.symbol}</span>
            </div>

            <div className="min-w-0 flex-1 space-y-3">
              <div>
                <h2 className="font-display text-2xl font-bold text-white">
                  {sel.name}
                  {locale === "fa" && faName && <span className="text-slate-400"> ({faName})</span>}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">{p.categories[sel.category]}</p>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                <Detail label={p.labels.mass}>
                  <span dir="ltr">{sel.mass} g/mol</span>
                </Detail>
                <Detail label={p.labels.period}>{sel.period}</Detail>
                <Detail label={p.labels.block}>
                  <span dir="ltr">{sel.block}</span>
                </Detail>
                <Detail label={p.labels.group}>
                  <span dir="ltr">{sel.group > 0 ? sel.group : p.labels.fGroup}</span>
                </Detail>
                <Detail label={p.labels.config} className="col-span-2 sm:col-span-1">
                  <span dir="ltr" className="font-mono text-[13px] text-cyan-200">
                    {sel.config}
                  </span>
                </Detail>
              </dl>
            </div>
          </GlassCard>
        </Reveal>
      </Container>

      {/* table */}
      <Container className="pb-20">
        <Reveal>
          <div className="overflow-x-auto pb-2">
            <div className="min-w-[900px]" dir="ltr">
              {/* group number header */}
              <div
                className="mb-1 grid gap-[3px]"
                style={{ gridTemplateColumns: "repeat(18, minmax(46px, 1fr))" }}
              >
                {Array.from({ length: 18 }, (_, i) => (
                  <div key={i} className="text-center font-mono text-[10px] text-slate-600">
                    {i + 1}
                  </div>
                ))}
              </div>

              <div
                className="grid gap-[3px]"
                style={{ gridTemplateColumns: "repeat(18, minmax(46px, 1fr))" }}
              >
                {PERIODIC_ELEMENTS.map((el) => {
                  const column =
                    el.fColumn !== undefined ? el.fColumn + (F_ROW_START_COLUMN - 1) : el.group;
                  return (
                    <button
                      key={el.z}
                      type="button"
                      style={{ gridColumn: String(column), gridRow: String(el.row) }}
                      onClick={() => setSelected(el.z)}
                      aria-label={`${el.name} (${elementFaName(el.symbol) ?? ""}), Z=${el.z}`}
                      className={cn(
                        "flex aspect-square min-w-0 flex-col items-center justify-center rounded-md border p-0.5 text-center transition-all",
                        "hover:z-10 hover:scale-[1.12] hover:shadow-lg focus-visible:z-10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-300",
                        CATEGORY_STYLE[el.category],
                        matches !== null && !matches.has(el.z) && "opacity-20",
                        selected === el.z && "z-10 ring-1 ring-cyan-300",
                      )}
                    >
                      <span className="self-start text-[8px] leading-none opacity-60">{el.z}</span>
                      <span className="font-display text-sm font-bold leading-none">{el.symbol}</span>
                      <span className="mt-0.5 w-full truncate text-[8px] leading-none opacity-60">
                        {el.mass}
                      </span>
                    </button>
                  );
                })}

                {/* f-block placeholders in the main table (group 3, periods 6-7) */}
                <button
                  type="button"
                  onClick={() => setSelected(57)}
                  style={{ gridColumn: String(F_ROW_START_COLUMN), gridRow: "6" }}
                  className="flex aspect-square items-center justify-center rounded-md border border-dashed border-fuchsia-400/20 text-[9px] text-fuchsia-200/60 transition-colors hover:border-fuchsia-300/40 hover:text-fuchsia-200"
                >
                  57–71
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(89)}
                  style={{ gridColumn: String(F_ROW_START_COLUMN), gridRow: "7" }}
                  className="flex aspect-square items-center justify-center rounded-md border border-dashed border-purple-400/20 text-[9px] text-purple-200/60 transition-colors hover:border-purple-300/40 hover:text-purple-200"
                >
                  89–103
                </button>
              </div>

              <p className="mt-4 text-center font-mono text-[10px] text-slate-600">{p.note}</p>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}

function Detail({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <div className="mt-0.5 text-sm text-slate-200">{children}</div>
    </div>
  );
}
