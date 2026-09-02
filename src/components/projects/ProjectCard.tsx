"use client";

import Link from "next/link";
import type { Project } from "@/config/projects";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const { t } = useI18n();

  const catLabel: Record<string, string> = {
    chemistry: t.pages.projects.categories.chemistry,
    web: t.pages.projects.categories.web,
    data: t.pages.projects.categories.data,
  };

  return (
    <Link href={`/programming/projects/${project.slug}`} className="group block h-full">
      <GlassCard
        interactive
        className={cn(
          "flex h-full flex-col p-6",
          project.featured && "relative border-cyan-400/25 hover:border-cyan-300/50",
          className,
        )}
      >
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
            {catLabel[project.category]}
          </span>
          <StatusBadge status={project.status} />
        </div>

        <h3
          className={cn(
            "font-display font-semibold text-white transition-colors group-hover:text-cyan-200",
            project.featured ? "text-xl" : "text-lg",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{project.tagline}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.map((tech) => (
            <li
              key={tech}
              className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-slate-500"
            >
              {tech}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-5">
          <span className="font-mono text-xs text-slate-600">{project.year}</span>
          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-300 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
            {t.ui.caseStudy}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 rtl-flip" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {project.featured && (
          <span className="absolute -top-2.5 right-5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-950 shadow-lg">
            {t.ui.featured}
          </span>
        )}
      </GlassCard>
    </Link>
  );
}
