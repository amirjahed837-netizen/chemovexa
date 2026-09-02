"use client";

import { DOMAINS } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { DomainIcon } from "@/components/icons";
import { useI18n } from "@/lib/i18n";

export function DomainsGrid() {
  const { t } = useI18n();
  const d = t.home.domains;

  const items: Record<string, { title: string; description: string }> = {
    "/chemistry": d.items.chemistry,
    "/programming": d.items.programming,
    "/research": d.items.research,
    "/ai/assistant": d.items.ai,
  };

  return (
    <section className="relative py-24">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={d.eyebrow} title={d.title} description={d.description} />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((domain, i) => {
            const tr = items[domain.href];
            return (
              <Reveal key={domain.href} delay={i * 90}>
                <a href={domain.href} className="block h-full">
                  <GlassCard interactive className="flex h-full flex-col gap-4 p-6">
                    <span className={`inline-flex size-11 items-center justify-center rounded-xl border ${domain.accentClass}`}>
                      <DomainIcon name={domain.icon} className="size-6" />
                    </span>
                    <h3 className="font-display text-lg font-semibold text-white">{tr?.title ?? domain.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-400">{tr?.description ?? domain.description}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-2 font-mono text-xs text-cyan-300/90 opacity-0 transition-opacity duration-300 [.group:hover>&]:opacity-100 hover:opacity-100 md:[a:hover_&]:opacity-100">
                      {t.ui.explore}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3 rtl-flip" aria-hidden="true">
                        <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                  </GlassCard>
                </a>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
