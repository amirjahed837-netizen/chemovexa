import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, CATEGORY_LABEL } from "@/config/projects";
import { profile } from "@/config/profile";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

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

function CheckItem({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-sm leading-relaxed text-slate-300">
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
      <span>{children}</span>
    </li>
  );
}

export default async function ProjectPage({ params }: { params: Params }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const index = PROJECTS.findIndex((p) => p.slug === project.slug);
  const next = PROJECTS[(index + 1) % PROJECTS.length];

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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
                <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All projects
            </Link>

            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                {CATEGORY_LABEL[project.category]}
              </span>
              <StatusBadge status={project.status} />
            </div>

            <h1 className="font-display mt-4 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {project.title}
            </h1>
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-slate-400">{project.tagline}</p>

            <p className="mt-4 font-mono text-xs text-slate-600">
              {project.year} · {project.role}
            </p>

            {(project.links?.demo || project.links?.repo) && (
              <div className="mt-7 flex flex-wrap gap-3">
                {project.links.demo && (
                  <ButtonLink href={project.links.demo} size="sm">
                    Live demo
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5" aria-hidden="true">
                      <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </ButtonLink>
                )}
                {project.links.repo && (
                  <ButtonLink href={project.links.repo} variant="secondary" size="sm">
                    Source
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
            <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">Overview</h2>
            <p className="mt-4 leading-relaxed text-slate-300">{project.overview}</p>
          </section>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-5">
          <Reveal className="md:col-span-3">
            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                Highlights
              </h2>
              <ul className="mt-4 space-y-3">
                {project.highlights.map((h) => (
                  <CheckItem key={h}>{h}</CheckItem>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={100} className="md:col-span-2">
            <GlassCard className="p-6">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                Tech stack
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {project.tech.map((t) => (
                  <li
                    key={t}
                    className="glass rounded-md border border-white/10 px-2.5 py-1 font-mono text-[11px] text-slate-200"
                  >
                    {t}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </Reveal>
        </div>

        {project.architecture && (
          <Reveal>
            <section>
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                Under the hood
              </h2>
              <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                {project.architecture.map((note, i) => (
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

        {project.outcome && (
          <Reveal>
            <GlassCard className="border-cyan-400/20 p-7">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
                Outcome
              </h2>
              <p className="mt-3 leading-relaxed text-slate-300">{project.outcome}</p>
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
                Next project
              </p>
              <p className="font-display mt-1 text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                {next.title}
              </p>
            </div>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 shrink-0 text-slate-500 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" aria-hidden="true">
              <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>

        <p className="text-center font-mono text-xs text-slate-600">
          More experiments live on{" "}
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-400/80 transition-colors hover:text-cyan-300"
          >
            GitHub
          </a>
        </p>
      </Container>
    </>
  );
}
