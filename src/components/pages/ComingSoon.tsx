import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Shared shell for pages that are part of the roadmap but not built yet.
 * Keeps the skeleton honest: every route works and says exactly what's coming.
 */
export function ComingSoon({
  title,
  eyebrow,
  description,
  step,
  planned,
}: {
  title: string;
  eyebrow?: string;
  description: string;
  step: string;
  planned: string[];
}) {
  return (
    <div className="bg-grid relative flex min-h-[calc(100svh-4rem)] items-center overflow-hidden py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] opacity-60"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/4 h-[380px] w-[680px] -translate-x-1/2 rounded-full bg-cyan-500/8 blur-[120px]"
      />

      <Container className="relative">
        <Reveal className="mx-auto max-w-2xl">
          <GlassCard className="p-8 sm:p-12">
            <Badge tone="cyan" className="mb-5">
              <span className="size-1.5 animate-pulse rounded-full bg-cyan-300" />
              Under construction · {step}
            </Badge>

            {eyebrow && (
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              {title}
            </h1>
            <p className="mt-4 leading-relaxed text-slate-400">{description}</p>

            <h2 className="mt-8 font-mono text-xs uppercase tracking-widest text-slate-500">
              Planned features
            </h2>
            <ul className="mt-3 space-y-2.5">
              {planned.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-slate-300">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="mt-0.5 size-4 shrink-0 text-cyan-400/80"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/" variant="secondary" size="sm">
                ← Back to home
              </ButtonLink>
              <ButtonLink href="/contact" variant="ghost" size="sm">
                Suggest a feature →
              </ButtonLink>
            </div>
          </GlassCard>
        </Reveal>

        <p className="mt-8 text-center font-mono text-xs text-slate-600">
          Follow the build log on{" "}
          <Link href="/programming/github" className="text-cyan-400/80 hover:text-cyan-300">
            GitHub
          </Link>
        </p>
      </Container>
    </div>
  );
}
