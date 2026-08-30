import type { TimelineItem } from "@/config/cv";
import { Reveal } from "@/components/ui/Reveal";

export function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="relative space-y-8 border-l border-white/10 pl-6">
      {items.map((item, i) => (
        <li key={`${item.title}-${item.period}`} className="relative">
          {/* node */}
          <span
            className={`absolute -left-[31px] top-1 size-3.5 rounded-full border-2 ${
              item.current
                ? "animate-pulse border-cyan-300 bg-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.7)]"
                : "border-slate-600 bg-ink-900"
            }`}
            aria-hidden="true"
          />
          <Reveal delay={i * 80}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display font-semibold text-white">{item.title}</h3>
              <span className="font-mono text-xs text-cyan-300/80">{item.period}</span>
            </div>
            <p className="mt-0.5 text-sm text-slate-400">
              {item.org}
              {item.current && (
                <span className="ml-2 inline-flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">
                  <span className="size-1 animate-pulse rounded-full bg-emerald-300" />
                  now
                </span>
              )}
            </p>
            {item.detail && (
              <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.detail}</p>
            )}
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
