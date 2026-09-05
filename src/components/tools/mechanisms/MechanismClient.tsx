"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import {
  MECHANISMS,
  TOPIC_ORDER,
  TOPIC_LABEL,
  FAMILY_LABEL,
  FAMILY_COLOR,
  mechTitle,
  mechSummary,
  mechSteps,
  mechKeyPoints,
  mechConditions,
  mechSource,
} from "@/lib/chem/mechanisms";
import type { Mechanism, FamilyId, TopicId } from "@/lib/chem/mechanisms";
import { getDiagram } from "@/lib/chem/mechanisms/diagrams";
import { DiagramPanel } from "@/components/tools/mechanisms/DiagramPanel";
import { cn } from "@/lib/utils";

type FamilyFilter = FamilyId | "all";

export function MechanismClient() {
  const { t, locale } = useI18n();
  const m = t.pages.mechanisms;

  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [family, setFamily] = useState<FamilyFilter>("all");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const familiesPresent = useMemo(() => {
    const set = new Set<FamilyId>();
    MECHANISMS.forEach((x) => set.add(x.family));
    return [...set];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MECHANISMS.filter((x) => {
      if (topic !== "all" && x.topic !== topic) return false;
      if (family !== "all" && x.family !== family) return false;
      if (!q) return true;
      const hay = [
        x.en.title, x.fa.title, x.en.summary, x.fa.summary,
        ...x.tags.en, ...x.tags.fa,
        ...x.examples.map((e) => e.equation),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [topic, family, query]);

  // group by topic for display
  const grouped = useMemo(() => {
    return TOPIC_ORDER.map((tp) => ({
      topic: tp,
      items: filtered.filter((x) => x.topic === tp),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const eqDir = "ltr"; // equations always LTR

  return (
    <>
      <Container className="pt-14 pb-6">
        <Reveal>
          <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-300">
            {m.eyebrow}
          </p>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">{m.title}</h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">{m.description}</p>
        </Reveal>
      </Container>

      {/* filter bar */}
      <Container className="pb-8">
        <Reveal delay={100}>
          <GlassCard className="flex flex-col gap-4 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setTopic("all")}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                  topic === "all"
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                    : "border-white/10 text-slate-400 hover:text-slate-200"
                )}
              >
                {m.allTopics} ({MECHANISMS.length})
              </button>
              {TOPIC_ORDER.map((tp) => {
                const n = MECHANISMS.filter((x) => x.topic === tp).length;
                return (
                  <button
                    key={tp}
                    onClick={() => setTopic(tp)}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                      topic === tp
                        ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                        : "border-white/10 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {TOPIC_LABEL[tp][locale as "en" | "fa"]} ({n})
                  </button>
                );
              })}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value as FamilyFilter)}
                className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400/50"
              >
                <option value="all">{m.allFamilies}</option>
                {familiesPresent.map((f) => (
                  <option key={f} value={f}>
                    {FAMILY_LABEL[f][locale as "en" | "fa"]}
                  </option>
                ))}
              </select>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={m.searchPlaceholder}
                className="flex-1 rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
              />
              <span className="shrink-0 font-mono text-[11px] text-slate-500">
                {filtered.length}/{MECHANISMS.length}
              </span>
            </div>
          </GlassCard>
        </Reveal>
      </Container>

      {/* cards grouped by topic */}
      <Container className="pb-20">
        {grouped.length === 0 ? (
          <p className="py-10 text-center text-sm text-slate-500">{m.noResults}</p>
        ) : (
          grouped.map((g) => (
            <section key={g.topic} className="mb-12">
              <h2 className="mb-5 flex items-baseline gap-3 font-display text-xl font-bold text-white">
                {TOPIC_LABEL[g.topic][locale as "en" | "fa"]}
                <span className="font-mono text-xs font-normal text-slate-500">
                  {g.items.length}
                </span>
              </h2>
              <div className="grid gap-5 lg:grid-cols-2">
                {g.items.map((mech, i) => (
                  <MechanismCard
                    key={mech.id}
                    mech={mech}
                    index={i}
                    open={openId === mech.id}
                    onToggle={() => setOpenId(openId === mech.id ? null : mech.id)}
                    locale={locale}
                    m={m}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </Container>
    </>
  );
}

function MechanismCard({
  mech,
  open,
  onToggle,
  locale,
  m,
}: {
  mech: Mechanism;
  index: number;
  open: boolean;
  onToggle: () => void;
  locale: string;
  m: {
    stepsLabel: string;
    keyPointsLabel: string;
    conditionsLabel: string;
    examplesLabel: string;
    sourceLabel: string;
    relatedLabel: string;
    openLab: string;
    summaryLabel: string;
  };
}) {
  const { t } = useI18n();
  const title = mechTitle(mech, locale);
  const summary = mechSummary(mech, locale);
  const steps = mechSteps(mech, locale);
  const keyPoints = mechKeyPoints(mech, locale);
  const conditions = mechConditions(mech, locale);
  const source = mechSource(mech, locale);
  const rtl = locale === "fa";
  const eqDir = "ltr"; // equations always LTR

  return (
    <Reveal delay={(mech.id.length % 3) * 60}>
      <GlassCard className={cn("flex h-full flex-col p-6 transition", open && "ring-1 ring-cyan-400/30")}>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-[11px] font-medium",
              FAMILY_COLOR[mech.family]
            )}
          >
            {FAMILY_LABEL[mech.family][locale as "en" | "fa"]}
          </span>
          {mech.tags[locale as "en" | "fa"].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 px-2.5 py-0.5 text-[11px] text-slate-400"
            >
              {tag}
            </span>
          ))}
        </div>

        <button onClick={onToggle} className="text-start">
          <h3 className="font-display text-lg font-bold text-white transition-colors hover:text-cyan-200">
            {title}
          </h3>
        </button>

        {/* arrow-pushing diagram (textbook style) — always LTR */}
        {getDiagram(mech.id) && (
          <div className="mt-4">
            <DiagramPanel mechId={mech.id} locale={locale} />
          </div>
        )}

        <p className="mt-2 text-sm leading-relaxed text-slate-400">{summary}</p>

        {/* general equation — always LTR */}
        <div
          dir={eqDir}
          className="mt-4 overflow-x-auto rounded-lg border border-white/10 bg-slate-950/60 px-4 py-3 font-mono text-[13px] leading-relaxed text-cyan-200"
        >
          {mech[locale === "fa" ? "fa" : "en"].general}
        </div>

        {open && (
          <div className="mt-5 space-y-5">
            {/* steps */}
            <div>
              <h4 className="mb-2.5 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                {m.stepsLabel}
              </h4>
              <ol className={cn("space-y-3", rtl && "border-r-2 border-cyan-400/20 pr-4")}>
                {steps.map((st, i) => (
                  <li key={i} className={cn("relative", rtl && "pr-2")}>
                    <span className="absolute -right-[1.4rem] top-1.5 size-2 rounded-full bg-cyan-400 rtl:right-[-0.35rem] ltr:left-[-1.65rem]" hidden={!rtl} />
                    <p className={cn("text-sm font-semibold text-slate-200", !rtl && "border-l-2 border-cyan-400/20 pl-4")}>
                      {st.label}
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-slate-400">{st.detail}</p>
                  </li>
                ))}
              </ol>
            </div>

            {/* key points */}
            <div>
              <h4 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                {m.keyPointsLabel}
              </h4>
              <ul className="space-y-1.5">
                {keyPoints.map((kp, i) => (
                  <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-slate-300">
                    <span className="mt-0.5 text-cyan-400">▸</span>
                    <span>{kp}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* conditions */}
            <div>
              <h4 className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                {m.conditionsLabel}
              </h4>
              <p className="text-[13px] leading-relaxed text-slate-300">{conditions}</p>
            </div>

            {/* examples */}
            <div>
              <h4 className="mb-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                {m.examplesLabel}
              </h4>
              <div className="space-y-2">
                {mech.examples.map((ex, i) => (
                  <div key={i} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2">
                    <p className="text-xs font-medium text-slate-300">
                      {ex.name[locale as "en" | "fa"]}
                    </p>
                    <p dir={eqDir} className="mt-0.5 font-mono text-[12.5px] text-emerald-300">
                      {ex.equation}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* related reactions → Reaction Lab */}
            {mech.related && mech.related.length > 0 && (
              <Link
                href={`/chemistry/reaction-lab?reaction=${mech.related[0]}`}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-transform hover:translate-x-1 rtl:hover:-translate-x-1"
              >
                {m.openLab}
              </Link>
            )}
          </div>
        )}

        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-white/5 pt-3">
            <span className="text-[11px] text-slate-500">
              {m.sourceLabel}: {source}
            </span>
            <button
              onClick={onToggle}
              className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              {open ? "−" : "+"} {m.stepsLabel.split(" ")[0]}
            </button>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
}
