"use client";

import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { CalculatorApp } from "@/components/tools/calculator/CalculatorApp";
import { useI18n } from "@/lib/i18n";

export function CalculatorPageClient() {
  const { t } = useI18n();
  const c = t.pages.calculator;

  return (
    <>
      <PageHeader
        eyebrow={c.eyebrow}
        title={c.title}
        description={c.description}
      >
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <CalculatorApp />
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {c.facts.map((fact, i) => (
            <Reveal key={fact.title} delay={i * 90}>
              <GlassCard className="h-full p-6">
                <h3 className="font-display font-semibold text-white">{fact.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{fact.body}</p>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </>
  );
}
