"use client";

import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { DomainIcon } from "@/components/icons";
import { SKILL_GROUPS } from "@/config/cv";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

function Tile({
  symbol,
  name,
  level,
  index,
}: {
  symbol: string;
  name: string;
  level?: "core" | "familiar";
  index: number;
}) {
  return (
    <li
      title={name}
      className={cn(
        "group relative flex min-h-[92px] cursor-default flex-col justify-between rounded-lg border p-2.5 transition-all duration-300 hover:-translate-y-1",
        level === "core"
          ? "border-cyan-400/30 bg-cyan-400/[0.06] hover:border-cyan-300/60 hover:shadow-[0_0_20px_-6px_rgba(34,211,238,0.5)]"
          : level === "familiar"
            ? "border-white/[0.07] bg-white/[0.02] opacity-75 hover:opacity-100"
            : "border-white/10 bg-white/[0.03] hover:border-white/25",
      )}
    >
      <span className="font-mono text-[9px] text-slate-500">{index + 1}</span>
      <span
        className={cn(
          "font-display self-center text-xl font-bold leading-none",
          level === "core" ? "text-gradient" : "text-slate-100",
        )}
      >
        {symbol}
      </span>
      <span className="line-clamp-2 text-[11px] leading-tight text-slate-400 group-hover:text-slate-300">
        {name}
      </span>
    </li>
  );
}

export function SkillsGrid() {
  const { t } = useI18n();
  const s = t.pages.about.skills;

  return (
    <section className="py-16 sm:py-20">
      <Container>
        <Reveal>
          <SectionHeading eyebrow={s.eyebrow} title={s.title} description={s.description} />
        </Reveal>

        <div className="grid gap-5 lg:grid-cols-2">
          {SKILL_GROUPS.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 90}>
              <GlassCard className="h-full p-6">
                <div className="mb-5 flex items-center gap-3">
                  <span
                    className={`inline-flex size-10 items-center justify-center rounded-lg border ${group.accentClass}`}
                  >
                    <DomainIcon name={group.icon} className="size-5" />
                  </span>
                  <h3 className="font-display text-lg font-semibold text-white">{group.title}</h3>
                  <span className="ml-auto font-mono text-xs text-slate-500">
                    {group.tiles.length} {s.elements}
                  </span>
                </div>
                <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {group.tiles.map((tile, i) => (
                    <Tile key={tile.symbol + tile.name} {...tile} index={i} />
                  ))}
                </ul>
              </GlassCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
