"use client";

import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";

export function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden border-b border-white/5 pb-14 pt-32 sm:pb-16 sm:pt-36">
      <div aria-hidden className="bg-grid absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-40%] h-[320px] w-[720px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[110px]"
      />
      <Container className="relative">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">{eyebrow}</p>
          <h1 className="font-display mt-3 max-w-3xl text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>
          <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">{description}</p>
          {children}
        </Reveal>
      </Container>
    </div>
  );
}
