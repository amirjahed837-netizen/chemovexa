"use client";

import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GithubProfile } from "@/components/github/GithubProfile";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/config/profile";
import { useI18n } from "@/lib/i18n";

export default function GitHubPage() {
  const { t } = useI18n();
  const g = t.pages.github;

  return (
    <>
      <PageHeader eyebrow={g.eyebrow} title={g.title} description={g.description}>
        <div className="mt-7">
          <ButtonLink href={profile.github} variant="secondary" size="sm">
            {t.ui.openFull}
          </ButtonLink>
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <GithubProfile />
        </Reveal>
      </Container>
    </>
  );
}
