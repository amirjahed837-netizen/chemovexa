import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { CalculatorApp } from "@/components/tools/calculator/CalculatorApp";

export const metadata: Metadata = {
  title: "Chemistry Calculator",
  description:
    "Molar mass, stoichiometry, solutions, pH and unit conversions — instant and client-side.",
};

const FACTS = [
  {
    title: "Validated methods",
    body: "Atomic masses follow IUPAC 2021 conventional values. Weak acid/base equilibria are solved exactly — no hidden shortcuts that break at low concentration.",
  },
  {
    title: "Understands real notation",
    body: "The parser handles nested brackets K4[Fe(CN)6], hydrates CuSO4·5H2O, charges SO4^2− and leading multipliers like 5H2O.",
  },
  {
    title: "Private by design",
    body: "Every calculation runs in your browser — nothing is sent to any server. Works offline once loaded; perfect for exams and the lab bench.",
  },
];

export default function CalculatorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chemistry · Tool"
        title="Chemistry Calculator"
        description="Five instruments in one — every calculation shows its method, every result is instant."
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
          {FACTS.map((fact, i) => (
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
