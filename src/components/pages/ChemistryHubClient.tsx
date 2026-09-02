"use client";

import { useI18n } from "@/lib/i18n";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import Link from "next/link";

/** /chemistry — hub for the three tools */
export function ChemistryHubClient() {
  const { t } = useI18n();
  const c = t.pages.chemistry;

  const toolList = [
    {
      href: "/chemistry/calculator",
      label: t.home.tools.items.calculator.label,
      description: t.home.tools.items.calculator.description,
      icon: "calc" as const,
    },
    {
      href: "/chemistry/molecular-explorer",
      label: t.home.tools.items.explorer.label,
      description: t.home.tools.items.explorer.description,
      icon: "molecule" as const,
    },
    {
      href: "/chemistry/reaction-lab",
      label: t.home.tools.items.lab.label,
      description: t.home.tools.items.lab.description,
      icon: "lab" as const,
    },
  ];

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />

      <Container className="grid gap-5 py-16 md:grid-cols-3">
        {toolList.map((tool, i) => (
          <Reveal key={tool.href} delay={i * 100}>
            <Link href={tool.href} className="group block h-full">
              <GlassCard interactive className="flex h-full flex-col p-6">
                <div className="mb-5 flex items-start justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110 text-lg">
                    {tool.icon === "calc" ? "🧮" : tool.icon === "molecule" ? "⚛" : "⚗"}
                  </span>
                  <StatusBadge status="live" />
                </div>
                <h2 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                  {tool.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  {t.ui.open}
                </span>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </Container>

      <Container className="pb-20">
        <Reveal>
          <GlassCard className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p
              className="text-sm text-slate-400 [&>em]:text-slate-300"
              dangerouslySetInnerHTML={{
                __html: `<span class="font-mono text-cyan-300">${c.liveNow}</span> ${c.liveNowText}`,
              }}
            />
            <StatusBadge status="live" />
          </GlassCard>
        </Reveal>
      </Container>
    </>
  );
}
