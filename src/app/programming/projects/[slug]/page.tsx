import type { Metadata } from "next";
import { PROJECTS, getProject } from "@/config/projects";
import { ProjectCaseClient } from "@/components/projects/ProjectCaseClient";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return { title: project.title, description: project.tagline };
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  return <ProjectCaseClient slug={slug} />;
}
