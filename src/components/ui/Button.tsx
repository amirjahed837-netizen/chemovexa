import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 select-none whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 font-semibold hover:brightness-110 glow-cyan hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "glass border border-white/10 text-slate-100 hover:border-cyan-400/40 hover:text-white hover:-translate-y-0.5 active:translate-y-0",
  ghost: "text-slate-300 hover:text-white hover:bg-white/5",
};

const sizes: Record<Size, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

function classes({ variant = "primary", size = "md", className }: Omit<CommonProps, "children">) {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={classes({ variant, size, className })} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant,
  size,
  className,
  children,
  ...props
}: CommonProps & React.ComponentProps<typeof Link>) {
  const hrefString = typeof href === "string" ? href : "";
  const isExternal = /^https?:\/\//.test(hrefString);
  if (isExternal) {
    return (
      <a
        href={hrefString}
        target="_blank"
        rel="noopener noreferrer"
        className={classes({ variant, size, className })}
      >
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={classes({ variant, size, className })} {...props}>
      {children}
    </Link>
  );
}
