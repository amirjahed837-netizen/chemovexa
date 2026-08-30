import Link from "next/link";
import { TOOLS } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { DomainIcon } from "@/components/icons";

export function FeaturedTools() {
  return (
    <section className="relative py-8 pb-24">
      {/* section glow */}
      <div aria-hidden className="pointer-events-none absolute left-[-15%] top-1/3 h-[380px] w-[380px] rounded-full bg-cyan-500/8 blur-[120px]" />

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Real tools, not demos"
            title="Chemistry infrastructure, first"
            description="Before adding AI on top, the goal is a set of working instruments — each one real, useful and built to last."
          />
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <Reveal key={tool.href} delay={i * 110}>
              <Link href={tool.href} className="group block h-full">
                <GlassCard interactive className="flex h-full flex-col p-6">
                  <div className="mb-5 flex items-start justify-between">
                    <span className="inline-flex size-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                      <DomainIcon name={tool.icon} className="size-7" />
                    </span>
                    <StatusBadge status={tool.status} step={tool.step} />
                  </div>

                  <h3 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                    {tool.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{tool.description}</p>

                  <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
                    Open tool
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </GlassCard>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
