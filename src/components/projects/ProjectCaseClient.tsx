"use client";

import Link from "next/link";
import { PROJECTS, getProject } from "@/config/projects";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import { PROJECT_FA } from "@/lib/i18n/data-fa";

type Props = { slug: string };

export function ProjectCaseClient({ slug }: Props) {
  const { t, locale } = useI18n();
  const project = getProject(slug);
  if (!project) return null;

  const fa = locale === "fa" ? PROJECT_FA[project.slug] : undefined;
  const title = fa?.title ?? project.title;
  const tagline = fa?.tagline ?? project.tagline;
  const overview = fa?.overview ?? project.overview;
  const role = fa?.role ?? project.role;
  const highlights = fa?.highlights ?? project.highlights;
  const architecture = fa?.architecture ?? project.architecture;
  const outcome = fa?.outcome ?? project.outcome;

  const catLabel: Record<string, string> = {
    chemistry: t.pages.projects.categories.chemistry,
    web: t.pages.projects.categories.web,
    data: t.pages.projects.categories.data,
  };

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];
  const nextFa = locale === "fa" ? PROJECT_FA[next.slug] : undefined;

  return (
    <>
      {/* header */}
      <div className="relative overflow-hidden border-b border-white/5 pb-14 pt-32 sm:pt-36">
        <div aria-hidden className="bg-grid absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-40%] h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]"
        />
        <Container className="relative max-w-4xl">
          <Reveal>
            <Link
              href="/programming/projects"
              className="mb-8 inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-cyan-300"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 rtl-flip" aria-hidden="true">
                <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {t.pages.projects.title}
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {catLabel[project.category]}
              </span>
              <StatusBadge status={project.status} />
            </div>

            <h1 className="font-display mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-400">{tagline}</p>

            <p className="mt-4 font-mono text-xs text-slate-600">
              {project.year} · {role}
            </p>

            {(project.links?.demo || project.links?.repo) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.demo && (
                  <ButtonLink href={project.links.demo} size="sm">
                    {t.ui.open}
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5 rtl-flip" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </ButtonLink>
                )}
                {project.links.repo && (
                  <ButtonLink href={project.links.repo} variant="secondary" size="sm">
                    {t.ui.onGithub}
                  </ButtonLink>
                )}
              </div>
            )}
          </Reveal>
        </Container>
      </div>

      {/* body */}
      <Container className="max-w-4xl space-y-12 py-14">
        <Reveal>
          <section>
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
              {locale === "fa" ? "نمای کلی" : "Overview"}
            </h2>
            <p className="mt-4 leading-relaxed text-slate-300">{overview}</p>
          </section>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-5">
          <Reveal className="md:col-span-3">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                {locale === "fa" ? "نکات برجسته" : "Highlights"}
              </h2>
              <ul className="mt-4 space-y-3">
                {highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      className="mt-0.5 size-4 shrink-0 text-cyan-400"
                      aria-hidden="true"
                    >
                      <path d="m5 13 4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={100} className="md:col-span-2">
            <GlassCard className="p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                {locale === "fa" ? "فناوری‌ها" : "Tech stack"}
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((tech) => (
                  <li
                    key={tech}
                    className="glass rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-200"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>

        {architecture && (
          <Reveal>
            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                {locale === "fa" ? "زیر کاپوت" : "Under the hood"}
              </h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {architecture.map((note, i) => (
                  <li
                    key={note}
                    className="glass flex gap-4 rounded-xl border border-white/10 p-5"
                  >
                    <span className="font-display text-xl font-bold text-cyan-400/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-slate-300">{note}</span>
                  </li>
                ))}
              </ol>
            </section>
          </Reveal>
        )}

        {outcome && (
          <Reveal>
            <GlassCard className="border-cyan-400/20 p-7">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
                {locale === "fa" ? "نتیجه" : "Outcome"}
              </h2>
              <p className="mt-3 leading-relaxed text-slate-300">{outcome}</p>
            </GlassCard>
          </Reveal>
        )}

        {/* next project */}
        <Reveal>
          <Link
            href={`/programming/projects/${next.slug}`}
            className="group glass flex items-center justify-between gap-4 rounded-2xl border border-white/10 p-6 transition-all hover:border-cyan-400/35 sm:p-7"
          >
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-slate-500">
                {locale === "fa" ? "پروژهٔ بعدی" : "Next project"}
              </p>
              <p className="font-display mt-1 text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                {nextFa?.title ?? next.title}
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-cyan-300 rtl-flip rtl:group-hover:-translate-x-1" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>

        <p className="text-center font-mono text-xs text-slate-600">
          {locale === "fa" ? "آزمایش‌های بیشتر روی " : "More experiments live on "}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/80 transition-colors hover:text-cyan-300"
          >
            {t.ui.github}
          </a>
        </p>
      </Container>
    </>
  );
}
