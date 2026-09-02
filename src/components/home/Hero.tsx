"use client";

import { DOMAINS } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { MoleculeCanvas } from "@/components/home/MoleculeCanvas";
import { useI18n } from "@/lib/i18n";
import type { Domain } from "@/config/site";

export function Hero() {
  const { t } = useI18n();
  const h = t.home.hero;

  const domainTitles: Record<string, { title: string; description: string }> = {
    "/chemistry": t.home.domains.items.chemistry,
    "/programming": t.home.domains.items.programming,
    "/research": t.home.domains.items.research,
    "/ai/assistant": t.home.domains.items.ai,
  };

  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden">
      {/* Molecular background */}
      <MoleculeCanvas className="mask-fade-y absolute inset-0 h-full w-full" />

      {/* Ambient glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-20%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[130px]" />
        <div className="absolute bottom-[-30%] right-[-10%] h-[420px] w-[520px] rounded-full bg-blue-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-24 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* Availability pill */}
          <a
            href="#domains"
            className="glass mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white"
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
            </span>
            {h.pill}
            <span className="font-mono text-cyan-300/80">v0.1</span>
          </a>

          <h1 className="font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            {h.titleA} <span className="text-gradient">{h.titleB}</span>
          </h1>

          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-slate-400 sm:text-xl">
            {h.tagline}
          </p>

          {/* Domain chips */}
          <ul id="domains" className="mt-8 flex flex-wrap items-center justify-center gap-2 font-mono text-sm">
            {DOMAINS.map((d: Domain, i: number) => {
              const tr = domainTitles[d.href];
              return (
                <li key={d.href} className="flex items-center gap-2">
                  {i > 0 && <span className="select-none text-slate-600">×</span>}
                  <a
                    href={d.href}
                    className={`rounded-full border px-3 py-1 transition-all hover:-translate-y-0.5 ${d.accentClass}`}
                  >
                    {tr?.title ?? d.title}
                  </a>
                </li>
              );
            })}
          </ul>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/chemistry" size="lg">
              {h.cta1}
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 rtl-flip" aria-hidden="true">
                <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </ButtonLink>
            <ButtonLink href="/programming/projects" variant="secondary" size="lg">
              {h.cta2}
            </ButtonLink>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-slate-500" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-6 animate-scroll-hint">
          <path d="M12 4v16m0 0-6-6m6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </section>
  );
}
