import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { TOOLS } from "@/config/site";
import { DomainIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Chemistry",
  description: "Interactive chemistry tools: calculator, 3D molecular explorer and reaction lab.",
};

export default function ChemistryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chemistry"
        title="Tools that do real chemistry"
        description="Not screenshots of science — working instruments. Each tool below is being engineered with validated methods and modern web technology."
      />

      <Container className="grid gap-5 py-16 md:grid-cols-3">
        {TOOLS.map((tool, i) => (
          <Reveal key={tool.href} delay={i * 100}>
            <Link href={tool.href} className="group block h-full">
              <GlassCard interactive className="flex h-full flex-col p-6">
                <div className="mb-5 flex items-start justify-between">
                  <span className="inline-flex size-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                    <DomainIcon name={tool.icon} className="size-7" />
                  </span>
                  <StatusBadge status={tool.status} step={tool.step} />
                </div>
                <h2 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                  {tool.label}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
                  Open →
                </span>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </Container>

      <Container className="pb-20">
        <Reveal>
          <GlassCard className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-400">
              <span className="font-mono text-cyan-300">Live now:</span> an AI assistant grounded{" "}
              <em className="text-slate-300">in these tools</em> — AI over real chemistry
              infrastructure.
            </p>
            <StatusBadge status="live" />
          </GlassCard>
        </Reveal>
      </Container>
    </>
  );
}
