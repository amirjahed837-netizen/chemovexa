import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Research",
  description: "Research notes, literature and references.",
};

const LINKS = [
  {
    href: "/research/notes",
    label: "Research Notes",
    description:
      "Structured study notes rendered with real math and chemical notation — VSEPR tables, titration analysis and thermodynamics reading notes.",
    status: "live" as const,
  },
  {
    href: "/research/literature",
    label: "Literature",
    description:
      "An annotated library: the textbooks on my desk — McMurry's Organic Chemistry, Levine's Physical Chemistry — plus the databases I trust.",
    status: "live" as const,
  },
];

export default function ResearchPage() {
  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Notes worth keeping"
        description="Science compounds when knowledge is organized. This hub will hold structured notes, literature reviews and a reference library."
      />

      <Container className="grid gap-5 py-16 md:grid-cols-2">
        {LINKS.map((link, i) => (
          <Reveal key={link.href} delay={i * 100}>
            <Link href={link.href} className="group block h-full">
              <GlassCard interactive className="flex h-full flex-col p-7">
                <div className="mb-5 flex items-start justify-between gap-3">
                  <h2 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-cyan-200">
                    {link.label}
                  </h2>
                  <StatusBadge status={link.status} />
                </div>
                <p className="text-sm leading-relaxed text-slate-400">{link.description}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1">
                  Open →
                </span>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </Container>
    </>
  );
}
