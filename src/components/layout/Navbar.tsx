"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV_ITEMS } from "@/config/site";
import { profile } from "@/config/profile";
import { LogoMark } from "@/components/icons";
import { StatusBadge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
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
    window.addEventListener("scroll", onScroll, { passive: true });
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
      <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link href="/" className="group flex items-center gap-2.5" aria-label="Home">
          <LogoMark className="size-8 transition-transform duration-500 group-hover:rotate-[30deg]" />
          <span className="font-display text-lg font-bold tracking-tight text-white">
            {profile.name.split(" ")[0]}
            <span className="text-gradient">.lab</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) =>
            item.children ? (
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
                  {item.label}
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
                      {item.label}
                    </div>
                    {item.children.map((child) => (
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
                            {child.label}
                          </span>
                          <StatusBadge status={child.status} step={child.step} />
                        </span>
                        {child.description && (
                          <span className="text-xs leading-snug text-slate-400">
                            {child.description}
                          </span>
                        )}
                      </Link>
                    ))}
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
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
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
      </nav>

      {/* Mobile panel */}
      {open && (
        <div className="fixed inset-0 top-16 z-40 overflow-y-auto bg-ink-950/95 backdrop-blur-xl md:hidden">
          <nav className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
            {NAV_ITEMS.map((item) => (
              <div key={item.href} className="space-y-2">
                <Link
                  href={item.href}
                  className={cn(
                    "font-display block text-xl font-semibold",
                    isActive(item.href) ? "text-cyan-300" : "text-white",
                  )}
                >
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="ml-1 space-y-1 border-l border-white/10 pl-4">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link href={child.href} className="flex flex-col gap-0.5 py-1.5">
                          <span className="flex items-center gap-2 text-sm text-slate-200">
                            {child.label}
                            <StatusBadge status={child.status} />
                          </span>
                          {child.description && (
                            <span className="text-xs text-slate-500">{child.description}</span>
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
