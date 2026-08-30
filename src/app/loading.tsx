export default function Loading() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div
          className="size-10 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400"
          aria-hidden="true"
        />
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-slate-500">
          loading
        </span>
      </div>
    </div>
  );
}
