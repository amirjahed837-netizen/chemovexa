"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/config/site";
import { LogoMark } from "@/components/icons";
import { StatusBadge } from "@/components/ui/Badge";
import { LangSwitch } from "@/components/layout/LangSwitch";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { NavItem, NavChild } from "@/config/site";

/** Translate a nav label / description when a key exists in the dictionary. */
function useNavT() {
  const { t } = useI18n();
  return (item: NavItem | NavChild): { label: string; description?: string } => {
    const key = item.href
      .replace(/^\//, "")
      .split("/")
      .filter(Boolean)
      .join("_");
    const c = t.nav.children as Record<string, { label?: string; description?: string } | string>;
    let label: string | undefined;
    let description: string | undefined;
    if (key in c) {
      const entry = c[key];
      if (typeof entry === "string") label = entry;
      else {
        label = entry?.label;
        description = entry?.description;
      }
    }
    // top-level labels come from nav keys
    if (!label) {
      const topMap: Record<string, string> = {
        about: t.nav.about,
        chemistry: t.nav.chemistry,
        programming: t.nav.programming,
        research: t.nav.research,
        "ai_assistant": t.nav.aiAssistant,
        contact: t.nav.cvContact,
        cv: t.nav.cvContact,
      };
      label = topMap[key];
    }
    return { label: label ?? item.label, description: description ?? item.description };
  };
}

export function Navbar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const navT = useNavT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  // Close mobile menu on route change (adjust during render, not in an effect)
  const [prevPath, setPrevPath] = useState(pathname);
  if (prevPath !== pathname) {
    setPrevPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "no-print fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "glass-strong border-b border-white/10 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.8)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="Home">
          <LogoMark className="size-8 transition-transform duration-500 group-hover:rotate-[30deg]" />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            CHEMO
            <span className="text-gradient">VEXA</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const tr = navT(item);
            return item.children ? (
              <li key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1 rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "text-cyan-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {tr.label}
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="size-3.5 opacity-60 transition-transform duration-200 group-hover:rotate-180"
                    aria-hidden="true"
                  >
                    <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>

                {/* Dropdown */}
                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-2 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                  <div className="glass-strong w-80 rounded-xl border border-white/10 p-2 shadow-2xl">
                    <div className="px-3 pb-1.5 pt-2 font-mono text-[11px] uppercase tracking-widest text-slate-500">
                      {tr.label}
                    </div>
                    {item.children.map((child) => {
                      const ctr = navT(child);
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="flex flex-col gap-1 rounded-lg px-3 py-2.5 transition-colors hover:bg-white/5"
                        >
                          <span className="flex items-center justify-between gap-3">
                            <span
                              className={cn(
                                "text-sm font-medium",
                                isActive(child.href) ? "text-cyan-300" : "text-slate-100",
                              )}
                            >
                              {ctr.label}
                            </span>
                            <StatusBadge status={child.status} step={child.step} />
                          </span>
                          {ctr.description && (
                            <span className="text-xs leading-snug text-slate-400">
                              {ctr.description}
                            </span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </li>
            ) : (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm transition-colors",
                    isActive(item.href)
                      ? "text-cyan-300"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  {tr.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Actions: language + mobile toggle */}
        <div className="flex shrink-0 items-center gap-2">
          <LangSwitch />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
            className="glass flex size-10 items-center justify-center rounded-lg border-white/10 text-slate-200 md:hidden"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-ink-950/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
            {NAV_ITEMS.map((item) => {
              const tr = navT(item);
              return (
                <div key={item.href} className="space-y-2">
                  <Link
                    href={item.href}
                    className={cn(
                      "font-display block text-xl font-semibold",
                      isActive(item.href) ? "text-cyan-300" : "text-white",
                    )}
                  >
                    {tr.label}
                  </Link>
                  {item.children && (
                    <ul className="ml-1 space-y-1 border-l border-white/10 pl-4 rtl:ml-0 rtl:mr-1 rtl:border-l-0 rtl:border-r rtl:pr-4">
                      {item.children.map((child) => {
                        const ctr = navT(child);
                        return (
                          <li key={child.href}>
                            <Link href={child.href} className="flex flex-col gap-0.5 py-1.5">
                              <span className="flex items-center gap-2 text-sm text-slate-200">
                                {ctr.label}
                                <StatusBadge status={child.status} />
                              </span>
                              {ctr.description && (
                                <span className="text-xs text-slate-500">{ctr.description}</span>
                              )}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}
