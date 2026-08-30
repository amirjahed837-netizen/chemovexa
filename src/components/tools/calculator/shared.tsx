"use client";

import { cn } from "@/lib/utils";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-baseline justify-between gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</span>
        {hint && <span className="font-mono text-[10px] text-slate-600">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  mono = true,
  invalid = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  invalid?: boolean;
}) {
  return (
    <input
      type="text"
      inputMode={mono ? "text" : undefined}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      spellCheck={false}
      autoComplete="off"
      className={cn(
        "h-11 w-full rounded-lg border bg-white/[0.04] px-3.5 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:bg-white/[0.06]",
        mono && "font-mono",
        invalid
          ? "border-red-400/60 focus:border-red-400"
          : "border-white/10 focus:border-cyan-400/70",
      )}
    />
  );
}

export function NumInput(props: Omit<React.ComponentProps<typeof TextInput>, "mono">) {
  return <TextInput {...props} />;
}

export function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-white/[0.04] px-3.5 font-mono text-sm text-slate-100 outline-none transition-colors focus:border-cyan-400/70"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-ink-900 text-slate-100">
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function ResultRow({
  label,
  value,
  unit,
  highlight = false,
}: {
  label: string;
  value: string;
  unit?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-baseline justify-between gap-4 rounded-lg px-3.5 py-2.5",
        highlight
          ? "border border-cyan-400/30 bg-cyan-400/[0.08]"
          : "border border-transparent bg-white/[0.03]",
      )}
    >
      <span className={cn("text-sm", highlight ? "text-cyan-200" : "text-slate-400")}>{label}</span>
      <span
        className={cn(
          "font-mono text-right",
          highlight ? "text-base font-semibold text-gradient" : "text-sm text-slate-200",
        )}
      >
        {value}
        {unit && <span className="ml-1 text-xs opacity-70">{unit}</span>}
      </span>
    </div>
  );
}

export function MethodNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-white/15 px-4 py-3">
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">Method</span>
      <p className="mt-1 font-mono text-xs leading-relaxed text-slate-400">{children}</p>
    </div>
  );
}

export function ErrorNote({ message }: { message: string }) {
  return (
    <p className="flex items-center gap-2 rounded-lg border border-red-400/30 bg-red-400/10 px-3.5 py-2.5 text-xs text-red-300">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-3.5 shrink-0" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4m0 4h.01" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}

export function SubTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          aria-pressed={active === t.id}
          className={cn(
            "flex-1 whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium transition-all sm:flex-none",
            active === t.id
              ? "bg-cyan-400/15 text-cyan-200 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.35)]"
              : "text-slate-400 hover:bg-white/5 hover:text-slate-200",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function ExampleChips({
  examples,
  onPick,
}: {
  examples: string[];
  onPick: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="font-mono text-[10px] uppercase tracking-widest text-slate-600">try</span>
      {examples.map((ex) => (
        <button
          key={ex}
          type="button"
          onClick={() => onPick(ex)}
          className="rounded-md border border-white/10 bg-white/[0.03] px-2 py-0.5 font-mono text-[11px] text-slate-400 transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          {ex}
        </button>
      ))}
    </div>
  );
}
