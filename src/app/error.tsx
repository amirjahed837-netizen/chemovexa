"use client";

import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { useI18n } from "@/lib/i18n";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();
  const e = t.errorPage;

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center">
      <Container className="max-w-2xl py-20 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-amber-300/80">
          {e.eyebrow}
        </span>
        <h1 className="font-display mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          {e.title}
        </h1>
        <p className="mt-4 text-slate-400">{e.description}</p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-slate-600">
            {e.digest} {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-9 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-400 to-blue-500 px-4 text-xs font-semibold text-slate-950 transition hover:brightness-110"
          >
            {e.retry}
          </button>
          <ButtonLink href="/" variant="secondary" size="sm">
            {e.home}
          </ButtonLink>
        </div>
      </Container>
    </div>
  );
}
