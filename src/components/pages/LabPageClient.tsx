"use client";

import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ReactionLab } from "@/components/tools/lab/ReactionLab";
import { useI18n } from "@/lib/i18n";

export function LabPageClient() {
  const { t } = useI18n();
  const l = t.pages.lab;

  return (
    <>
      <PageHeader eyebrow={l.eyebrow} title={l.title} description={l.description}>
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <ReactionLab />
        </Reveal>
      </Container>
    </>
  );
}
