"use client";

import { useState } from "react";
import { PROJECTS } from "@/config/projects";
import type { ProjectCategory } from "@/config/projects";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Filter = "all" | ProjectCategory;

const FILTERS: Filter[] = ["all", "chemistry", "web", "data"];

export function ProjectsBrowser() {
  const { t } = useI18n();
  const p = t.pages.projects;
  const [filter, setFilter] = useState<Filter>("all");
  const visible =
    filter === "all" ? PROJECTS : PROJECTS.filter((pr) => pr.category === filter);

  const catLabel: Record<ProjectCategory, string> = {
    chemistry: p.categories.chemistry,
    web: p.categories.web,
    data: p.categories.data,
  };

  return (
    <div>
      {/* filter tabs */}
      <div className="mb-8 flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-all duration-200",
              filter === f
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200 glow-cyan"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/25 hover:text-slate-200",
            )}
          >
            {f === "all" ? t.ui.all : catLabel[f]}
            <span className="ml-1.5 font-mono text-[10px] opacity-60">
              {f === "all"
                ? PROJECTS.length
                : PROJECTS.filter((pr) => pr.category === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* grid */}
      <div key={filter} className="animate-fade-in grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}
