"use client";

import { HubClient } from "@/components/pages/HubClient";
import { useI18n } from "@/lib/i18n";

export function ProgrammingHubClient() {
  const { t } = useI18n();
  const p = t.pages.programming;

  return (
    <HubClient
      eyebrow={p.eyebrow}
      title={p.title}
      description={p.description}
      links={[
        {
          href: "/programming/projects",
          label: p.projects.label,
          description: p.projects.description,
          status: "live",
        },
        {
          href: "/programming/github",
          label: p.github.label,
          description: p.github.description,
          status: "live",
        },
      ]}
    />
  );
}
