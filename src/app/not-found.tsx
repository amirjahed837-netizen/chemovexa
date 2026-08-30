import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="relative flex min-h-[80vh] items-center overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[680px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/8 blur-[130px]"
      />
      <Container className="relative max-w-2xl py-24 text-center">
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/80">
          Error 404
        </span>
        <h1 className="font-display mt-3 text-5xl font-bold tracking-tight text-white sm:text-6xl">
          <span className="text-gradient">404</span> — substance not found
        </h1>
        <p className="mt-4 text-slate-400">
          The page you were looking for isn&apos;t here. It may have been moved, or the URL might
          be off by a digit (or two).
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink href="/">← Back to home</ButtonLink>
          <Link
            href="/research/notes"
            className="text-sm text-slate-400 transition-colors hover:text-cyan-300"
          >
            or browse research notes →
          </Link>
        </div>
      </Container>
    </div>
  );
}
