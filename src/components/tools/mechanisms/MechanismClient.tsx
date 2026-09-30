"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import { BOOKMARK_STRINGS, type BookmarkStrings } from "@/lib/i18n/bookmarks";
import { useBookmarks } from "@/lib/bookmarks";
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
type View = "all" | "saved";

/** Task B: ids that exist today; stale stored ids are ignored (never deleted). */
const VALID_IDS: ReadonlySet<string> = new Set(MECHANISMS.map((x) => x.id));
const TOAST_MS = 4000;
const LIST_TOP_ID = "mech-list-top";

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} aria-hidden="true" focusable="false" className="shrink-0">
      <path
        d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function MechanismClient() {
  const { t, locale, fmt } = useI18n();
  const m = t.pages.mechanisms;
  const b = BOOKMARK_STRINGS[locale === "fa" ? "fa" : "en"];

  const [topic, setTopic] = useState<TopicId | "all">("all");
  const [family, setFamily] = useState<FamilyFilter>("all");
  const [query, setQuery] = useState("");
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());
  const [view, setView] = useState<View>("all");
  const [toast, setToast] = useState<{ text: string; key: number } | null>(null);

  const bookmarks = useBookmarks(VALID_IDS);
  const { savedSet, count: savedCount, toggle: toggleSaved } = bookmarks;

  const familiesPresent = useMemo(() => {
    const set = new Set<FamilyId>();
    MECHANISMS.forEach((x) => set.add(x.family));
    return [...set];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return MECHANISMS.filter((x) => {
      if (view === "saved" && !savedSet.has(x.id)) return false;
      if (topic !== "all" && x.topic !== topic) return false;
      if (family !== "all" && x.family !== family) return false;
      if (!q) return true;
      const hay = [
        x.en.title,
        x.fa.title,
        x.en.summary,
        x.fa.summary,
        ...x.tags.en,
        ...x.tags.fa,
        ...x.examples.map((e) => e.equation),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [topic, family, query, view, savedSet]);

  // group by topic for display
  const grouped = useMemo(() => {
    return TOPIC_ORDER.map((tp) => ({
      topic: tp,
      items: filtered.filter((x) => x.topic === tp),
    })).filter((g) => g.items.length > 0);
  }, [filtered]);

  const hasFilters = topic !== "all" || family !== "all" || query.trim() !== "" || view !== "all";
  const allOpen = openIds.size >= MECHANISMS.length;
  const anyOpen = openIds.size > 0;

  const clearFilters = useCallback(() => {
    setTopic("all");
    setFamily("all");
    setQuery("");
    setView("all");
  }, []);

  const expandAll = useCallback(() => {
    setOpenIds(new Set(MECHANISMS.map((x) => x.id)));
  }, []);

  const collapseAll = useCallback(() => {
    setOpenIds(new Set());
  }, []);

  const toggleOne = useCallback((id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Task B: save/unsave with an announced, visible confirmation.
  const onToggleSave = useCallback(
    (id: string) => {
      const nowSaved = toggleSaved(id);
      const nextCount = Math.max(0, savedCount + (nowSaved ? 1 : -1));
      setToast({
        text: fmt(nowSaved ? b.toastSaved : b.toastRemoved, { count: nextCount }),
        key: Date.now(),
      });
    },
    [toggleSaved, savedCount, fmt, b],
  );

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const showSaved = useCallback(() => {
    setView("saved");
    setTopic("all");
    setToast(null);
    const el = document.getElementById(LIST_TOP_ID);
    if (el) {
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
  }, []);

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
        <div id={LIST_TOP_ID} className="scroll-mt-28" />
        <Reveal delay={100}>
          <GlassCard className="flex flex-col gap-4 p-5">
            <div
              className="flex flex-wrap items-center gap-2"
              role="group"
              aria-label={m.filterByTopic}
            >
              <button
                onClick={() => {
                  setView("all");
                  setTopic("all");
                }}
                aria-pressed={view === "all" && topic === "all"}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                  view === "all" && topic === "all"
                    ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                    : "border-white/10 text-slate-400 hover:text-slate-200"
                )}
              >
                {m.allTopics} ({MECHANISMS.length})
              </button>
              {TOPIC_ORDER.map((tp) => {
                const n = MECHANISMS.filter((x) => x.topic === tp).length;
                const active = view === "all" && topic === tp;
                return (
                  <button
                    key={tp}
                    onClick={() => {
                      setView("all");
                      setTopic(tp);
                    }}
                    aria-pressed={active}
                    className={cn(
                      "rounded-full border px-3.5 py-1.5 text-xs font-medium transition",
                      active
                        ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
                        : "border-white/10 text-slate-400 hover:text-slate-200"
                    )}
                  >
                    {TOPIC_LABEL[tp][locale as "en" | "fa"]} ({n})
                  </button>
                );
              })}
              {/* Task B: always enabled, even when empty (empty state explains how to save).
                  The count slot has a reserved width so hydration cannot shift the row. */}
              <button
                onClick={() => (view === "saved" ? setView("all") : showSaved())}
                aria-pressed={view === "saved"}
                aria-label={fmt(b.tabAria, { count: savedCount })}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition",
                  view === "saved"
                    ? "border-amber-300/70 bg-amber-300/20 text-amber-100"
                    : savedCount > 0
                      ? "border-amber-300/40 text-amber-200 hover:bg-amber-300/10"
                      : "border-white/10 text-slate-400 hover:text-slate-200"
                )}
              >
                <StarIcon filled={savedCount > 0} />
                <span>{b.tab}</span>
                <span aria-hidden="true">
                  (<span className="inline-block min-w-[2ch] text-center tabular-nums">{savedCount}</span>)
                </span>
              </button>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value as FamilyFilter)}
                aria-label={m.allFamilies}
                className="rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 outline-none focus:border-cyan-400/50"
              >
                <option value="all">{m.allFamilies}</option>
                {familiesPresent.map((f) => (
                  <option key={f} value={f}>
                    {FAMILY_LABEL[f][locale as "en" | "fa"]}
                  </option>
                ))}
              </select>
              <div className="relative flex-1">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  type="search"
                  placeholder={m.searchPlaceholder}
                  aria-label={m.searchPlaceholder}
                  className="w-full rounded-lg border border-white/10 bg-slate-900/70 px-3 py-2 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-cyan-400/50"
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    aria-label={m.clearFilters}
                    className="absolute inset-y-0 end-0 me-1.5 rounded px-2 text-slate-500 hover:text-cyan-200"
                  >
                    ×
                  </button>
                )}
              </div>
              <span
                className="shrink-0 font-mono text-[11px] text-slate-500"
                aria-live="polite"
              >
                {fmt(m.filteredCount, { count: filtered.length, total: MECHANISMS.length })}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={expandAll}
                  disabled={allOpen}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200 disabled:opacity-40"
                >
                  {m.expandAll}
                </button>
                <button
                  onClick={collapseAll}
                  disabled={!anyOpen}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200 disabled:opacity-40"
                >
                  {m.collapseAll}
                </button>
              </div>
            </div>
          </GlassCard>
        </Reveal>
      </Container>

      {/* cards grouped by topic */}
      <Container className="pb-20">
        {/* Task B: saved view header. Only rendered after a user click, so it
            is input-driven and does not count toward CLS. */}
        {view === "saved" && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300/30 bg-amber-300/[0.06] px-4 py-3">
            <div>
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-amber-100">
                <StarIcon filled />
                {b.sectionTitle}
                <span className="font-mono text-xs font-normal text-amber-200/80">{savedCount}</span>
              </h2>
              <p className="mt-0.5 text-xs text-slate-400">{b.storedLocally}</p>
            </div>
            <button
              onClick={() => setView("all")}
              className="min-h-11 rounded-lg border border-white/15 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:text-cyan-200"
            >
              {b.showAll}
            </button>
          </div>
        )}

        {view === "saved" && savedCount === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-semibold text-slate-200">{b.emptyTitle}</p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-slate-400">{b.emptyHint}</p>
          </div>
        ) : grouped.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-slate-400">{m.noResults}</p>
            {hasFilters && (
              <>
                <p className="mt-1.5 text-xs text-slate-500">{m.noResultsHint}</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {m.clearFilters}
                </button>
              </>
            )}
          </div>
        ) : (
          grouped.map((g) => (
            <section key={g.topic} className="mb-12 scroll-mt-28">
              <h2 className="mb-5 flex items-baseline gap-3 font-display text-xl font-bold text-white">
                {TOPIC_LABEL[g.topic][locale as "en" | "fa"]}
                <span className="font-mono text-xs font-normal text-slate-500">
                  {g.items.length}
                </span>
              </h2>
              <div className="grid gap-5 lg:grid-cols-2">
                {g.items.map((mech) => (
                  <MechanismCard
                    key={mech.id}
                    mech={mech}
                    open={openIds.has(mech.id)}
                    onToggle={() => toggleOne(mech.id)}
                    saved={savedSet.has(mech.id)}
                    onToggleSave={() => onToggleSave(mech.id)}
                    locale={locale}
                    m={m}
                    b={b}
                    fmt={fmt}
                  />
                ))}
              </div>
            </section>
          ))
        )}
      </Container>

      {/* Task B: save feedback. The live region is always mounted (so screen
          readers announce the first message) and fixed-positioned (no layout
          shift). Width is capped by the viewport, so no overflow at 360 px. */}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 print:hidden"
      >
        {toast && (
          <div
            key={toast.key}
            className="pointer-events-auto flex max-w-full flex-wrap items-center gap-3 rounded-xl border border-amber-300/40 bg-slate-900/95 px-4 py-3 text-sm text-slate-100 shadow-lg shadow-black/40"
          >
            <span className="flex items-center gap-2 text-amber-200">
              <StarIcon filled />
              <span className="text-slate-100">{toast.text}</span>
            </span>
            <button
              onClick={showSaved}
              className="min-h-11 rounded-lg border border-amber-300/50 px-3 text-xs font-semibold text-amber-100 transition hover:bg-amber-300/15"
            >
              {b.viewSaved}
            </button>
          </div>
        )}
      </div>
    </>
  );
}

function MechanismCard({
  mech,
  open,
  onToggle,
  saved,
  onToggleSave,
  locale,
  m,
  b,
  fmt,
}: {
  mech: Mechanism;
  open: boolean;
  onToggle: () => void;
  saved: boolean;
  onToggleSave: () => void;
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
    expand: string;
    collapse: string;
  };
  b: BookmarkStrings;
  fmt: (template: string, vars?: Record<string, string | number>) => string;
}) {
  const title = mechTitle(mech, locale);
  const summary = mechSummary(mech, locale);
  const steps = mechSteps(mech, locale);
  const keyPoints = mechKeyPoints(mech, locale);
  const conditions = mechConditions(mech, locale);
  const source = mechSource(mech, locale);
  const rtl = locale === "fa";
  const eqDir = "ltr"; // equations always LTR
  const sectionId = `mech-${mech.id}`;
  const titleId = `mech-title-${mech.id}`;

  return (
    <Reveal delay={(mech.id.length % 3) * 60}>
      <GlassCard
        className={cn(
          "flex h-full flex-col p-6 transition",
          open && "ring-1 ring-cyan-400/30",
          saved && !open && "ring-1 ring-amber-300/30"
        )}
      >
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
          {/* Task B: save toggle. 44 px touch target; both labels share one grid
              cell so the button width is identical saved/unsaved (no shift). */}
          <button
            type="button"
            onClick={onToggleSave}
            aria-pressed={saved}
            aria-label={fmt(saved ? b.unsaveAria : b.saveAria, { title })}
            className={cn(
              "ms-auto inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-3 text-xs font-semibold transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300",
              saved
                ? "border-amber-300/60 bg-amber-300/15 text-amber-200"
                : "border-white/15 text-slate-300 hover:border-amber-300/40 hover:text-amber-200"
            )}
          >
            <StarIcon filled={saved} />
            <span className="grid" aria-hidden="true">
              <span className={cn("col-start-1 row-start-1", saved && "invisible")}>{b.save}</span>
              <span className={cn("col-start-1 row-start-1", !saved && "invisible")}>{b.saved}</span>
            </span>
          </button>
        </div>

        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={sectionId}
          className="text-start"
        >
          <h3 id={titleId} className="font-display text-lg font-bold text-white transition-colors hover:text-cyan-200">
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
          <div id={sectionId} className="mt-5 space-y-5">
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
              aria-expanded={open}
              aria-controls={sectionId}
              className="text-xs font-medium text-cyan-300 hover:text-cyan-200"
            >
              {open ? "−" : "+"} {open ? m.collapse : m.expand}
            </button>
          </div>
        </div>
      </GlassCard>
    </Reveal>
  );
}
