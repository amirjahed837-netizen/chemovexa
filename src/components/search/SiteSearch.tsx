"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Result = { title: string; url: string; kind: string; snippet: string };

const KIND_STYLE: Record<string, string> = {
  tool: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
  note: "border-indigo-400/30 bg-indigo-400/10 text-indigo-200",
  literature: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  site: "border-white/15 bg-white/5 text-slate-300",
};

export function SiteSearch() {
  const { t } = useI18n();
  const s = t.search;
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 30);
    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    const q = query.trim();
    if (!open || q.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset on close/short query, not a render cascade
      setResults([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    const timer = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(q)}`, { signal: controller.signal })
        .then((r) => r.json())
        .then((data: { results?: Result[] }) => {
          setResults(data.results ?? []);
          setActive(0);
          setLoading(false);
        })
        .catch(() => {
          if (!controller.signal.aborted) setLoading(false);
        });
    }, 180);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  function openResult(url: string) {
    setOpen(false);
    setQuery("");
    router.push(url);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={s.open}
        className="glass flex size-10 items-center justify-center rounded-lg border-white/10 text-slate-200 transition-colors hover:border-cyan-400/40 hover:text-cyan-200"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-5" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m21 21-4.3-4.3" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink-950/70 px-4 pt-[14vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={s.open}
        >
          <div
            className="glass-strong w-full max-w-xl rounded-2xl border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-white/10 px-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4 shrink-0 text-slate-500" aria-hidden="true">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4-4" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={s.placeholder}
                spellCheck={false}
                autoComplete="off"
                onKeyDown={(e) => {
                  if (e.key === "Escape") setOpen(false);
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setActive((i) => Math.min(i + 1, results.length - 1));
                  }
                  if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setActive((i) => Math.max(0, i - 1));
                  }
                  if (e.key === "Enter" && results[active]) openResult(results[active].url);
                }}
                className="h-14 w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
              />
              <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[10px] text-slate-500">esc</kbd>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-2">
              {loading && <p className="px-3 py-4 text-sm text-slate-500">{s.searching}</p>}
              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <p className="px-3 py-4 text-sm text-slate-500">{s.noResults}</p>
              )}
              {results.map((r, i) => (
                <button
                  key={`${r.url}-${r.title}`}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => openResult(r.url)}
                  className={cn(
                    "flex w-full flex-col gap-1 rounded-lg px-3 py-2.5 text-left transition-colors rtl:text-right",
                    active === i ? "bg-white/[0.07]" : "hover:bg-white/5",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider",
                        KIND_STYLE[r.kind] ?? KIND_STYLE.site,
                      )}
                    >
                      {r.kind}
                    </span>
                    <span className="truncate text-sm font-medium text-slate-100">{r.title}</span>
                  </span>
                  <span className="line-clamp-2 text-xs leading-snug text-slate-500">{r.snippet}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-white/10 px-4 py-2.5 font-mono text-[10px] text-slate-600">
              <span>{s.hint}</span>
              <span className="flex gap-1.5">
                <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↑↓</kbd>
                <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">↵</kbd>
                <kbd className="rounded border border-white/10 bg-white/5 px-1 py-0.5">esc</kbd>
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
