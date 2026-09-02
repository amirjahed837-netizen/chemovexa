"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/config/site";
import { profile } from "@/config/profile";
import { LogoMark } from "@/components/icons";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t, fmt } = useI18n();

  const toolLinks = [
    { href: "/chemistry/calculator", label: t.footer.toolsList.calculator },
    { href: "/chemistry/molecular-explorer", label: t.footer.toolsList.explorer },
    { href: "/chemistry/reaction-lab", label: t.footer.toolsList.lab },
    { href: "/ai/assistant", label: t.footer.toolsList.assistant },
  ];

  return (
    <footer className="no-print relative mt-24 border-t border-white/10 bg-ink-900/60">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <span className="font-display text-lg font-bold text-white">
              CHEMO
              <span className="text-gradient">VEXA</span>
            </span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">{t.footer.tagline}</p>
        </div>

        {/* Explore */}
        <nav aria-label="Footer">
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            {t.footer.explore}
          </h3>
          <ul className="space-y-2">
            {NAV_ITEMS.slice(0, 4).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Tools */}
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            {t.footer.tools}
          </h3>
          <ul className="space-y-2">
            {toolLinks.map((tool) => (
              <li key={tool.href}>
                <Link
                  href={tool.href}
                  className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
                >
                  {tool.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Connect */}
        <div>
          <h3 className="mb-3 font-mono text-xs uppercase tracking-widest text-slate-500">
            {t.footer.connect}
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href={`mailto:${profile.email}`}
                className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
              >
                {t.ui.email}
              </a>
            </li>
            <li>
              <a
                href={profile.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
              >
                {t.ui.github}
              </a>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
              >
                {t.footer.cvContact}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>{fmt(t.footer.copyright, { year: new Date().getFullYear(), name: profile.name })}</span>
          <span className="font-mono">{t.footer.techLine}</span>
        </div>
      </div>
    </footer>
  );
}
