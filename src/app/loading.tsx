"use client";

import { useI18n } from "@/lib/i18n";

export default function Loading() {
  const { t } = useI18n();
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div
          className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
          {t.ui.loading}
        </span>
      </div>
    </div>
  );
}
