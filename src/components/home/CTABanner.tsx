"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { profile } from "@/config/profile";
import { useI18n } from "@/lib/i18n";

export function CTABanner() {
  const { t } = useI18n();
  const c = t.home.cta;

  return (
    <section className="py-10 pb-28">
      <Container>
        <Reveal>
          <div className="glass relative overflow-hidden rounded-3xl border border-white/10 px-6 py-14 text-center sm:px-12">
            {/* inner glows */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div className="absolute left-1/2 top-0 h-40 w-[560px] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-[100px]" />
              <div className="bg-grid absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />
            </div>

            <div className="relative">
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
                {c.eyebrow}
              </p>
              <h2 className="font-display mx-auto mt-4 max-w-2xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl">
                {c.titleA} <span className="text-gradient">{c.titleB}</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-slate-400">{c.description}</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <ButtonLink href="/contact" size="lg">
                  {c.contact}
                </ButtonLink>
                <ButtonLink href={profile.github} variant="secondary" size="lg">
                  {t.ui.github}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
