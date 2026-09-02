"use client";

import { SOURCES } from "@/config/literature";
import type { Source, SourceStatus } from "@/config/literature";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function Stars({ rating }: { rating: number }) {
  if (!rating) return null;
  return (
    <span className="inline-flex gap-0.5 text-amber-300" aria-label={`${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} viewBox="0 0 24 24" className={cn("size-3.5", i < rating ? "fill-current" : "fill-white/10")} aria-hidden="true">
          <path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z" />
        </svg>
      ))}
    </span>
  );
}

function BookSpine({ source }: { source: Source }) {
  return (
    <a href={`#src-${source.id}`} className="group block" title={source.title}>
      <div
        className={cn(
          "relative h-52 w-[68px] rounded-r-md rounded-l-sm bg-gradient-to-b p-2 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-[0_16px_32px_-12px_rgba(34,211,238,0.45)] sm:h-60",
          source.spineColor,
        )}
      >
        <div className="absolute inset-y-0 left-0 w-[3px] rounded-l-sm bg-black/30" />
        <div className="absolute inset-x-0 top-2 mx-auto h-px w-8 bg-white/20" />
        <div className="flex h-full items-center justify-center">
          <span
            className="font-display max-h-full overflow-hidden text-xs font-bold leading-tight tracking-wide text-white [writing-mode:vertical-rl]"
            style={{ maxHeight: "calc(100% - 1rem)" }}
          >
            {source.title}
          </span>
        </div>
        <span className="absolute inset-x-0 bottom-2 truncate px-1 text-center text-[8px] uppercase tracking-wider text-white/70">
          {source.author.split(",")[0].split(" ").slice(-1)[0]}
        </span>
      </div>
    </a>
  );
}

function SourceCard({ source }: { source: Source }) {
  const { t } = useI18n();
  const isLink = Boolean(source.url);
  const Wrapper = isLink ? "a" : "div";
  return (
    <Wrapper
      {...(isLink ? { href: source.url!, target: "_blank", rel: "noopener noreferrer" } : {})}
      id={`src-${source.id}`}
      className="group block scroll-mt-24"
    >
      <GlassCard interactive className="flex h-full flex-col p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display font-semibold text-white transition-colors group-hover:text-cyan-200">
              {source.title}
              {source.edition && (
                <span className="ml-2 text-xs font-normal text-slate-500">{source.edition}</span>
              )}
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {source.author}
              {source.year ? ` · ${source.year}` : ""}
            </p>
          </div>
          <Stars rating={source.rating ?? 0} />
        </div>

        <p className="text-sm leading-relaxed text-slate-400">{source.why}</p>

        {source.progress && (
          <p className="mt-3 inline-flex items-center gap-1.5 self-start rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 font-mono text-[11px] text-emerald-200">
            <span className="size-1.5 animate-pulse rounded-full bg-emerald-300" />
            {source.progress}
          </p>
        )}

        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {source.topics.map((topic) => (
            <li key={topic} className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-slate-500">
              #{topic}
            </li>
          ))}
        </ul>

        {isLink && (
          <span className="mt-4 inline-flex items-center gap-1 font-mono text-[11px] text-cyan-400/80 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            {t.pages.literature.visit}
          </span>
        )}
      </GlassCard>
    </Wrapper>
  );
}

export default function LiteraturePage() {
  const { t, fmt: interpolate } = useI18n();
  const lit = t.pages.literature;

  const textbooks = SOURCES.filter((s) => s.kind === "textbook");
  const reading = SOURCES.filter((s) => s.status === "reading");
  const consult = SOURCES.filter((s) => s.status === "consult");
  const planned = SOURCES.filter((s) => s.status === "planned");

  const sectionLabel: Record<SourceStatus, string> = {
    reading: lit.sections.reading,
    consult: lit.sections.consult,
    planned: lit.sections.planned,
  };

  return (
    <>
      <PageHeader eyebrow={lit.eyebrow} title={lit.title} description={lit.description} />

      {/* bookshelf */}
      <Container className="pt-14 pb-6">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-2xl border border-white/10 px-6 pb-5 pt-8 sm:px-10">
            <div className="flex flex-wrap items-end justify-center gap-3 sm:gap-4">
              {SOURCES.filter((s) => s.kind !== "web").map((s) => (
                <BookSpine key={s.id} source={s} />
              ))}
            </div>
            <div className="mt-1 h-2 rounded-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
            <p className="mt-3 text-center font-mono text-[11px] text-slate-600">{lit.shelf}</p>
          </div>
        </Reveal>
      </Container>

      {/* sections */}
      {[
        { status: "reading" as SourceStatus, items: reading },
        { status: "consult" as SourceStatus, items: consult },
        { status: "planned" as SourceStatus, items: planned },
      ].map(
        (section) =>
          section.items.length > 0 && (
            <Container key={section.status} className="py-8">
              <Reveal>
                <h2 className="mb-6 flex items-center gap-2.5 font-mono text-xs uppercase tracking-widest text-slate-500">
                  <span className="inline-block size-1.5 rounded-full bg-cyan-300" />
                  {sectionLabel[section.status]}
                </h2>
                <div className="grid gap-5 md:grid-cols-2">
                  {section.items.map((s) => (
                    <Reveal key={s.id}>
                      <SourceCard source={s} />
                    </Reveal>
                  ))}
                </div>
              </Reveal>
            </Container>
          ),
      )}

      <Container className="pb-24">
        <Reveal>
          <p className="text-center font-mono text-xs text-slate-600">
            {interpolate(lit.footer, { n: textbooks.length })}
          </p>
        </Reveal>
      </Container>
    </>
  );
}
