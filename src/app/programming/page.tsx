import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Programming",
  description: "Projects, open source and engineering practices.",
};

const LINKS = [
  {
    href: "/programming/projects",
    label: "Projects",
    description:
      "Case studies of real work — what was built, why it matters and how it works under the hood.",
    status: "live" as const,
    step: "",
  },
  {
    href: "/programming/github",
    label: "GitHub",
    description:
      "Live repositories and stats pulled straight from the GitHub API on every visit.",
    status: "live" as const,
    step: "",
  },
];

export default function ProgrammingPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programming"
        title="Code as a scientific instrument"
        description="Software craftsmanship in service of science — typed, tested and documented like it matters. Because it does."
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
                  <StatusBadge status={link.status} step={link.step} />
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
