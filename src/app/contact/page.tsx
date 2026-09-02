"use client";

import { profile } from "@/config/profile";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusBadge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.72-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.63.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.57 2.34 1.12 2.91.85.09-.66.35-1.12.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.7 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 5 0c1.91-1.33 2.75-1.05 2.75-1.05.55 1.4.2 2.44.1 2.7.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.25 10.25 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className={className} aria-hidden="true">
      <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

export default function ContactPage() {
  const { t } = useI18n();
  const c = t.pages.contact;

  const METHODS = [
    {
      label: c.methods.email,
      value: profile.email,
      href: `mailto:${profile.email}`,
      icon: MailIcon,
      hint: c.methods.emailHint,
      external: false,
    },
    {
      label: c.methods.github,
      value: profile.github.replace("https://", ""),
      href: profile.github,
      icon: GithubIcon,
      hint: c.methods.githubHint,
      external: true,
    },
  ];

  return (
    <>
      <PageHeader eyebrow={c.eyebrow} title={c.title} description={c.description} />

      <Container className="grid gap-5 py-16 md:grid-cols-3">
        {/* contact methods */}
        {METHODS.map((method, i) => (
          <Reveal key={method.label} delay={i * 90}>
            <a
              href={method.href}
              {...(method.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="group block h-full"
            >
              <GlassCard interactive className="flex h-full flex-col p-6">
                <span className="mb-5 inline-flex size-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 transition-transform duration-300 group-hover:scale-110">
                  <method.icon className="size-6" />
                </span>
                <h2 className="font-display text-lg font-semibold text-white transition-colors group-hover:text-cyan-200">
                  {method.label}
                </h2>
                <p className="mt-1 break-all font-mono text-sm text-slate-300">{method.value}</p>
                <p className="mt-auto pt-4 text-xs text-slate-500">{method.hint}</p>
              </GlassCard>
            </a>
          </Reveal>
        ))}

        {/* location */}
        <Reveal delay={180}>
          <GlassCard className="flex h-full flex-col p-6">
            <span className="mb-5 inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300">
              <PinIcon className="size-6" />
            </span>
            <h2 className="font-display text-lg font-semibold text-white">{c.location.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{profile.location}</p>
            <p className="mt-auto pt-4 text-xs text-slate-500">{c.location.hint}</p>
          </GlassCard>
        </Reveal>

        {/* CV card */}
        <Reveal delay={120} className="md:col-span-3">
          <GlassCard className="flex flex-col gap-5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">{c.cv.title}</h2>
              <p className="mt-1 max-w-xl text-sm leading-relaxed text-slate-400">
                {c.cv.description}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href="/cv">{t.ui.viewCVShort}</ButtonLink>
            </div>
          </GlassCard>
        </Reveal>

        {/* future form note */}
        <Reveal delay={160} className="md:col-span-3">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-white/15 px-7 py-6 sm:flex-row sm:items-center">
            <p className="text-sm text-slate-500">{c.formNote}</p>
            <StatusBadge status="planned" step="Step 4+" />
          </div>
        </Reveal>
      </Container>
    </>
  );
}
