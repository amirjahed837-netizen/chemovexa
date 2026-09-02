"use client";

import { useI18n } from "@/lib/i18n";

/** Round pill button that toggles EN ⇄ FA. Places nicely inside the navbar. */
export function LangSwitch({ className = "" }: { className?: string }) {
  const { locale, toggle, t } = useI18n();
  const target = locale === "en" ? t.meta.switchTo : t.meta.switchTo;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={t.meta.switchAria}
      className={
        className ||
        `glass flex h-9 items-center gap-1.5 rounded-lg border border-white/10 px-3 text-xs font-semibold text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-200`
      }
    >
      {/* globe */}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="size-4" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
      </svg>
      <span className={locale === "en" ? "font-sans" : "font-fa"}>{target}</span>
    </button>
  );
}
