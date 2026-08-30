import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectsBrowser } from "@/components/projects/ProjectsBrowser";
import { ButtonLink } from "@/components/ui/Button";
import { profile } from "@/config/profile";

export const metadata: Metadata = {
  title: "Projects",
  description: "Case studies — chemistry tools, web experiments and data projects.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Programming · Showcase"
        title="Project showcase"
        description="Every project is a small argument that chemistry and software belong together. Open a case study to see what it does, why it exists and how it's built."
      >
        <div className="mt-7 flex flex-wrap gap-3">
          <ButtonLink href={profile.github} variant="secondary" size="sm">
            Everything on GitHub →
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
