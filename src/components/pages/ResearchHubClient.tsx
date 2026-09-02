"use client";

import { HubClient } from "@/components/pages/HubClient";
import { useI18n } from "@/lib/i18n";

export function ResearchHubClient() {
  const { t } = useI18n();
  const r = t.pages.research;

  return (
    <HubClient
      eyebrow={r.eyebrow}
      title={r.title}
      description={r.description}
      links={[
        {
          href: "/research/notes",
          label: r.notes.label,
          description: r.notes.description,
          status: "live",
        },
        {
          href: "/research/literature",
          label: r.literature.label,
          description: r.literature.description,
          status: "live",
        },
      ]}
    />
  );
}
