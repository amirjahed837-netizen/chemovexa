import type { MetadataRoute } from "next";
import { getAllNotes } from "@/lib/content";
import { PROJECTS } from "@/config/projects";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const notes = await getAllNotes();
  const now = new Date();

  const staticRoutes = [
    { route: "", priority: 1, frequency: "weekly" as const },
    { route: "/about", priority: 0.8, frequency: "monthly" as const },
    { route: "/chemistry", priority: 0.8, frequency: "monthly" as const },
    { route: "/chemistry/calculator", priority: 0.9, frequency: "monthly" as const },
    { route: "/chemistry/molecular-explorer", priority: 0.9, frequency: "monthly" as const },
    { route: "/chemistry/reaction-lab", priority: 0.9, frequency: "monthly" as const },
    { route: "/programming", priority: 0.7, frequency: "monthly" as const },
    { route: "/programming/projects", priority: 0.8, frequency: "monthly" as const },
    { route: "/programming/github", priority: 0.6, frequency: "weekly" as const },
    { route: "/research", priority: 0.7, frequency: "monthly" as const },
    { route: "/research/notes", priority: 0.8, frequency: "weekly" as const },
    { route: "/research/literature", priority: 0.7, frequency: "monthly" as const },
    { route: "/ai/assistant", priority: 0.8, frequency: "monthly" as const },
    { route: "/contact", priority: 0.6, frequency: "yearly" as const },
    { route: "/cv", priority: 0.6, frequency: "yearly" as const },
  ];

  return [
    ...staticRoutes.map(({ route, priority, frequency }) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: frequency,
      priority,
    })),
    ...PROJECTS.map((p) => ({
      url: `${base}/programming/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...notes.map((n) => ({
      url: `${base}/research/notes/${n.slug}`,
      lastModified: n.date ? new Date(n.date) : now,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
