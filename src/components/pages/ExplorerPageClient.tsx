"use client";

import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ExplorerApp } from "@/components/tools/explorer/ExplorerApp";
import { useI18n } from "@/lib/i18n";

export function ExplorerPageClient() {
  const { t } = useI18n();
  const e = t.pages.explorer;

  return (
    <>
      <PageHeader eyebrow={e.eyebrow} title={e.title} description={e.description}>
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <ExplorerApp />
        </Reveal>
      </Container>
    </>
  );
}
