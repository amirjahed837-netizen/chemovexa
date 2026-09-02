"use client";

import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { AssistantChat } from "@/components/tools/assistant/AssistantChat";
import { useI18n } from "@/lib/i18n";

export function AssistantPageClient() {
  const { t } = useI18n();
  const a = t.pages.assistant;

  return (
    <>
      <PageHeader eyebrow={a.eyebrow} title={a.title} description={a.description}>
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="max-w-3xl pb-24 pt-12">
        <Reveal>
          <AssistantChat />
        </Reveal>
      </Container>
    </>
  );
}
