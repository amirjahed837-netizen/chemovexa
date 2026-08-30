import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  interactive = false,
  children,
}: {
  className?: string;
  interactive?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl border border-white/10 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.7)]",
        interactive &&
          "transition-all duration-300 hover:border-cyan-400/35 hover:shadow-[0_0_36px_-12px_rgba(34,211,238,0.45)] hover:-translate-y-1",
        className,
      )}
    >
      {children}
    </div>
  );
}
