"use client";

import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CVDocument } from "@/components/cv/CVDocument";
import { PrintButton } from "@/components/cv/PrintButton";
import { useI18n } from "@/lib/i18n";

export default function CVPage() {
  const { t } = useI18n();
  const c = t.pages.cv;

  return (
    <Container className="max-w-4xl pb-24 pt-28 sm:pt-32">
      {/* toolbar */}
      <Reveal className="no-print mb-6 flex items-center justify-between gap-3">
        <ButtonLink href="/about" variant="ghost" size="sm">{c.backToAbout}</ButtonLink>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-slate-500 sm:block">{c.printTip}</span>
          <PrintButton />
        </div>
      </Reveal>

      <Reveal delay={80}>
        <CVDocument />
      </Reveal>
    </Container>
  );
}
