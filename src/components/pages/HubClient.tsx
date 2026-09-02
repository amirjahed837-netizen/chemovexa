"use client";

import Link from "next/link";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

type LinkItem = {
  href: string;
  label: string;
  description: string;
  status: "live" | "wip" | "planned";
};

/** Shared two-card hub used by /research and /programming */
export function HubClient({
  eyebrow,
  title,
  description,
  links,
}: {
  eyebrow: string;
  title: string;
  description: string;
  links: LinkItem[];
}) {
  const { t } = useI18n();

  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={description} />

      <Container className="grid gap-5 py-16 md:grid-cols-2">
        {links.map((link, i) => (
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
                <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
                  {t.ui.open}
                </span>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </Container>
    </>
  );
}
