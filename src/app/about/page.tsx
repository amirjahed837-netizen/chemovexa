"use client";

import { profile } from "@/config/profile";
import { EDUCATION, EXPERIENCE, INTERESTS } from "@/config/cv";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Timeline } from "@/components/about/Timeline";
import { SkillsGrid } from "@/components/about/SkillsGrid";
import { NowCard } from "@/components/about/NowCard";
import { CTABanner } from "@/components/home/CTABanner";
import { useI18n } from "@/lib/i18n";

function ProfileHero() {
  const { t } = useI18n();
  const a = t.pages.about;

  return (
    <section className="relative overflow-hidden pb-16 pt-32 sm:pt-36">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-30%] h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]"
      />

      <Container className="relative">
        <div className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
          {/* Avatar */}
          <Reveal>
            <div className="relative shrink-0">
              <div className="rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 p-[2.5px] shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]">
                <div className="font-display flex size-36 items-center justify-center rounded-[calc(1.5rem-2.5px)] bg-ink-900 text-5xl font-bold sm:size-40">
                  <span className="text-gradient">{profile.shortName}</span>
                </div>
              </div>
              <span className="glass absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-emerald-400/25 px-3 py-1 text-[11px] text-emerald-200">
                <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-emerald-300" />
                {a.availability}
              </span>
            </div>
          </Reveal>

          {/* Intro */}
          <div className="min-w-0 flex-1">
            <Reveal delay={100}>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
                {a.eyebrow}
              </p>
              <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                {profile.name}
              </h1>
              <p className="mt-2 text-lg text-slate-400">
                {profile.role} — <span className="text-slate-300">{profile.university}</span>
              </p>

              <div className="mt-6 max-w-2xl space-y-4 leading-relaxed text-slate-400">
                {a.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-2">
                {profile.focusAreas.map((area) => (
                  <span
                    key={area}
                    className="glass rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300"
                  >
                    {area}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href="/cv" size="md">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4" aria-hidden="true">
                    <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t.ui.viewCV}
                </ButtonLink>
                <ButtonLink href="/contact" variant="secondary">{t.ui.getInTouch}</ButtonLink>
                <ButtonLink href={profile.github} variant="ghost">{t.ui.githubArrow}</ButtonLink>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}

function JourneySection() {
  const { t } = useI18n();
  const j = t.pages.about.journey;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={j.eyebrow}
            title={j.title}
            description={j.description}
            align="left"
          />
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="mb-6 flex items-center gap-2.5 font-mono text-sm uppercase tracking-widest text-slate-500">
              <span className="inline-block size-1.5 rounded-full bg-cyan-300" />
              {j.education}
            </h3>
            <Timeline items={EDUCATION} />
          </div>
          <div>
            <h3 className="mb-6 flex items-center gap-2.5 font-mono text-sm uppercase tracking-widest text-slate-500">
              <span className="inline-block size-1.5 rounded-full bg-blue-400" />
              {j.experience}
            </h3>
            <Timeline items={EXPERIENCE} />
          </div>
        </div>
      </Container>
    </section>
  );
}

function BioAndNow() {
  const { t } = useI18n();
  const w = t.pages.about.why;

  return (
    <section className="pb-8 pt-4">
      <Container>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-14">
          <Reveal className="lg:col-span-2">
            <div>
              <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {w.titleA} <span className="text-gradient">{w.titleB}</span>
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-slate-400">
                {w.paragraphs.map((p) => (
                  <p key={p.slice(0, 24)}>{p}</p>
                ))}
              </div>

              <h3 className="mt-9 mb-4 font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
                {w.beyond}
              </h3>
              <ul className="flex flex-wrap gap-2">
                {INTERESTS.map((interest) => (
                  <li
                    key={interest}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400"
                  >
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <NowCard />
        </div>
      </Container>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <ProfileHero />
      <JourneySection />
      <BioAndNow />
      <SkillsGrid />
      <CTABanner />
    </>
  );
}
