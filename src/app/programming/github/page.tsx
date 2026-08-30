import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { GithubProfile } from "@/components/github/GithubProfile";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/config/profile";

export const metadata: Metadata = {
  title: "GitHub",
  description: "Live GitHub activity — repositories, stats and open source work.",
};

export default function GitHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programming · Open source"
        title="GitHub activity"
        description="Pulled straight from the GitHub REST API every time you visit — no caching tricks, no manual updates."
      >
        <div className="mt-7">
          <ButtonLink href={profile.github} variant="secondary" size="sm">
            Open full profile →
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
