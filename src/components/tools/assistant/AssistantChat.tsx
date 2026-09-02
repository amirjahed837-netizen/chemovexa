"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type Source = { n: number; title: string; url: string; kind: string; snippet: string };
type Msg = { role: "user" | "assistant"; content: string; sources?: Source[]; note?: string };

function StatusPill() {
  const { t, fmt } = useI18n();
  const [status, setStatus] = useState<{ llm: string | null; chunks: number } | null>(null);
  useEffect(() => {
    fetch("/api/assistant")
      .then((r) => r.json())
      .then(setStatus)
      .catch(() => setStatus({ llm: null, chunks: 0 }));
  }, []);

  if (!status) return null;
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px]">
      <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-0.5 text-emerald-200">
        {fmt(t.pages.assistant.ragActive, { n: status.chunks })}
      </span>
      {status.llm ? (
        <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2.5 py-0.5 text-cyan-200">
          {fmt(t.pages.assistant.generation, { m: status.llm })}
        </span>
      ) : (
        <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2.5 py-0.5 text-amber-200">
          {t.pages.assistant.retrievalOnly}
        </span>
      )}
    </div>
  );
}

export function AssistantChat() {
  const { t, locale } = useI18n();
  const a = t.pages.assistant;
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) return;
    setInput("");
    setBusy(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: message }, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, history, locale }),
      });

      const contentType = res.headers.get("content-type") ?? "";

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: a.errInvalid }));
        throw new Error(err.error ?? a.errInvalid);
      }

      if (contentType.includes("text/event-stream")) {
        const reader = res.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        let done = false;
        while (!done) {
          const { done: fin, value } = await reader.read();
          if (fin) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const tr = line.trim();
            if (!tr.startsWith("data:")) continue;
            const payload = tr.slice(5).trim();
            if (payload === "[DONE]") {
              done = true;
              break;
            }
            try {
              const json = JSON.parse(payload) as {
                meta?: { sources?: Source[] };
                delta?: string;
              };
              setMessages((m) => {
                const next = [...m];
                const last = next[next.length - 1];
                if (json.meta) last.sources = json.meta.sources;
                if (json.delta) last.content += json.delta;
                return next;
              });
            } catch {
              /* ignore malformed line */
            }
          }
        }
      } else {
        const json = (await res.json()) as {
          answer: string;
          sources: Source[];
          sourcesNote?: string;
        };
        setMessages((m) => {
          const next = [...m];
          const last = next[next.length - 1];
          last.content = json.answer;
          last.sources = json.sources;
          last.note = json.sourcesNote;
          return next;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const next = [...m];
        const last = next[next.length - 1];
        last.content = e instanceof Error ? e.message : a.errGeneric;
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <StatusPill />

      <div className="glass overflow-hidden rounded-2xl border border-white/10">
        {/* header */}
        <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.03] px-5 py-3.5">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-cyan-300" />
          </span>
          <span className="font-display text-sm font-semibold text-white">{a.chatTitle}</span>
          <span className="font-mono text-[10px] text-slate-500">{a.chatSubtitle}</span>
        </div>

        {/* messages */}
        <div
          ref={scrollRef}
          className="h-[440px] space-y-4 overflow-y-auto px-4 py-5 sm:px-6"
        >
          {messages.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
              <div className="max-w-md space-y-2">
                <p className="font-display text-lg font-semibold text-white">{a.emptyTitle}</p>
                <p className="text-sm leading-relaxed text-slate-500">{a.emptyDescription}</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {a.suggestions.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div
              key={i}
              className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
            >
              <div
                className={cn(
                  "max-w-[85%] space-y-2.5 rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%]",
                  m.role === "user"
                    ? "rounded-br-sm bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-slate-100 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.25)]"
                    : "rounded-bl-sm border border-white/10 bg-white/[0.04] text-slate-200",
                  m.role === "assistant" && !m.content && "animate-pulse",
                )}
              >
                {m.content ? (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                ) : (
                  <span className="flex gap-1 py-1" aria-label={a.thinking}>
                    {[0, 1, 2].map((d) => (
                      <span
                        key={d}
                        className="size-1.5 animate-bounce rounded-full bg-cyan-300/70"
                        style={{ animationDelay: `${d * 150}ms` }}
                      />
                    ))}
                  </span>
                )}

                {m.sources && m.sources.length > 0 && (
                  <div className="space-y-1.5 border-t border-white/10 pt-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-slate-500">
                      {a.sources} {m.note ? `· ${m.note}` : ""}
                    </p>
                    <ul className="space-y-1">
                      {m.sources.map((s) => (
                        <li key={s.n} className="text-[11px] leading-snug">
                          <a
                            href={s.url}
                            className="font-mono text-cyan-300/90 hover:text-cyan-200"
                          >
                            [{s.n}] {s.title}
                          </a>
                          <span className="ml-1.5 text-slate-600">{s.snippet.slice(0, 90)}…</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="flex items-center gap-2.5 border-t border-white/10 bg-white/[0.03] px-4 py-3.5 sm:px-5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={a.placeholder}
            maxLength={1000}
            spellCheck={false}
            className="h-11 min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/70"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="glow-cyan inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            aria-label={a.send}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-5 rtl-flip" aria-hidden="true">
              <path d="m22 2-7 20-4-9-9-4Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </div>

      <p className="text-center font-mono text-[11px] leading-relaxed text-slate-600">
        {a.chatFooter}
      </p>
    </div>
  );
}
