import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllNotes, getNote } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { Markdown } from "@/components/md/Markdown";
import "katex/dist/katex.min.css";

type Params = Promise<{ slug: string }>;

export async function generateStaticParams() {
  const notes = await getAllNotes();
  return notes.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) return {};
  return { title: note.title, description: note.summary };
}

function prettyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function NotePage({ params }: { params: Params }) {
  const { slug } = await params;
  const note = await getNote(slug);
  if (!note) notFound();

  const all = await getAllNotes();
  const idx = all.findIndex((n) => n.slug === note.slug);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx < all.length - 1 ? all[idx + 1] : null;

  return (
    <Container className="max-w-3xl pb-24 pt-28 sm:pt-32">
      <Reveal>
        <Link
          href="/research/notes"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-cyan-300"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
            <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All notes
        </Link>

        <header className="mt-8 mb-10">
          <time className="font-mono text-xs uppercase tracking-[0.25em] text-cyan-300/90">
            {prettyDate(note.date)}
          </time>
          <h1 className="font-display mt-3 text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {note.title}
          </h1>
          {note.summary && (
            <p className="mt-4 max-w-2xl leading-relaxed text-slate-400">{note.summary}</p>
          )}
          <ul className="mt-5 flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-0.5 font-mono text-[11px] text-slate-400"
              >
                #{tag}
              </li>
            ))}
          </ul>
        </header>
      </Reveal>

      <Reveal delay={100}>
        <article className="glass rounded-2xl border border-white/10 p-6 sm:p-10">
          <Markdown source={note.content} />
        </article>
      </Reveal>

      {/* prev / next */}
      <nav className="mt-10 grid gap-4 sm:grid-cols-2" aria-label="Note navigation">
        {older ? (
          <Link
            href={`/research/notes/${older.slug}`}
            className="glass group rounded-xl border border-white/10 p-5 transition hover:border-cyan-400/35"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              ← Older
            </span>
            <p className="mt-1.5 font-medium text-slate-200 transition-colors group-hover:text-cyan-200">
              {older.title}
            </p>
          </Link>
        ) : (
          <span />
        )}
        {newer && (
          <Link
            href={`/research/notes/${newer.slug}`}
            className="glass group rounded-xl border border-white/10 p-5 text-right transition hover:border-cyan-400/35"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
              Newer →
            </span>
            <p className="mt-1.5 font-medium text-slate-200 transition-colors group-hover:text-cyan-200">
              {newer.title}
            </p>
          </Link>
        )}
      </nav>
    </Container>
  );
}
