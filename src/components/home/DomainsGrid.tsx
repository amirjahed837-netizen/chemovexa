import { DOMAINS } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { DomainIcon } from "@/components/icons";

export function DomainsGrid() {
  return (
    <section className="relative py-24">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Four disciplines, one interface"
            title="Where science becomes software"
            description="Each area of this portfolio feeds the others — chemistry knowledge shapes the tools, code brings them to life, research keeps them rigorous, and AI ties it all together."
          />
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DOMAINS.map((domain, i) => (
            <Reveal key={domain.href} delay={i * 90}>
              <a href={domain.href} className="block h-full">
                <GlassCard interactive className="flex h-full flex-col gap-4 p-6">
                  <span className={`inline-flex size-11 items-center justify-center rounded-xl border ${domain.accentClass}`}>
                    <DomainIcon name={domain.icon} className="size-6" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white">{domain.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{domain.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-2 font-mono text-xs text-cyan-300/90 opacity-0 transition-opacity duration-300 [.group:hover>&]:opacity-100 hover:opacity-100 md:[a:hover_&]:opacity-100">
                    explore
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </GlassCard>
              </a>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
