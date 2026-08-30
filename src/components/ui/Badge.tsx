import { cn } from "@/lib/utils";
import type { Status } from "@/config/site";

const toneClasses = {
  cyan: "border-cyan-400/25 bg-cyan-400/10 text-cyan-200",
  blue: "border-blue-400/25 bg-blue-400/10 text-blue-200",
  emerald: "border-emerald-400/25 bg-emerald-400/10 text-emerald-200",
  amber: "border-amber-400/25 bg-amber-400/10 text-amber-200",
  slate: "border-white/15 bg-white/5 text-slate-300",
} as const;

export type BadgeTone = keyof typeof toneClasses;

export function Badge({
  tone = "slate",
  className,
  children,
}: {
  tone?: BadgeTone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide",
        toneClasses[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status, step }: { status?: Status; step?: string }) {
  if (!status) return null;
  const label = status === "live" ? "Live" : status === "wip" ? "In progress" : "Planned";
  const tone: BadgeTone = status === "live" ? "emerald" : status === "wip" ? "cyan" : "slate";
  return (
    <Badge tone={tone}>
      {status !== "planned" && (
        <span
          className={cn(
            "size-1.5 rounded-full",
            status === "live" ? "bg-emerald-300 animate-pulse" : "bg-cyan-300 animate-pulse",
          )}
        />
      )}
      {label}
      {step && <span className="font-mono opacity-60">· {step}</span>}
    </Badge>
  );
}
