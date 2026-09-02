"use client";

import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();
  const n = t.notFound;

  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-[130px]"
      />
      <Container className="relative max-w-2xl py-24 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">
          {n.eyebrow}
        </span>
        <h1 className="font-display mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          <span className="text-gradient">{n.titleA}</span> {n.titleB}
        </h1>
        <p className="mt-4 text-slate-400">{n.description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/">{t.ui.backHome}</ButtonLink>
          <Link
            href="/research/notes"
            className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
          >
            {n.browseNotes}
          </Link>
        </div>
      </Container>
    </div>
  );
}
