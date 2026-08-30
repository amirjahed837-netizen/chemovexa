import { NOW } from "@/config/cv";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export function NowCard({ className }: { className?: string }) {
  return (
    <Reveal delay={150} className={className}>
      <GlassCard className="p-6">
        <div className="mb-4 flex items-center gap-2.5">
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-cyan-300" />
          </span>
          <h3 className="font-mono text-xs uppercase tracking-[0.25em] text-slate-400">Now</h3>
        </div>
        <ul className="space-y-3.5">
          {NOW.map((item) => (
            <li key={item.label + item.value} className="flex items-start gap-3">
              <span className="w-16 shrink-0 pt-0.5 font-mono text-[11px] uppercase tracking-wider text-cyan-300/70">
                {item.label}
              </span>
              <span className="text-sm leading-snug text-slate-200">{item.value}</span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </Reveal>
  );
}
