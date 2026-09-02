"use client";

import { ButtonLink } from "@/components/ui/Button";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";
import { profile } from "@/config/profile";
import { useI18n } from "@/lib/i18n";

export default function ProjectsPage() {
  const { t } = useI18n();
  const p = t.pages.projects;

  return (
    <>
      <PageHeader eyebrow={p.eyebrow} title={p.title} description={p.description}>
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={profile.github} variant="secondary" size="sm">
            {t.ui.everythingOnGithub}
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <ProjectsBrowser />
        </Reveal>
      </Container>
    </>
  );
}
