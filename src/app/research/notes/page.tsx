import type { Metadata } from "next";
import Link from "next/link";
import { getAllNotes } from "@/lib/content";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";

export const metadata: Metadata = {
  title: "Research Notes",
  description: "Structured study notes with proper chemical notation and math.",
};

function prettyDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default async function NotesPage() {
  const notes = await getAllNotes();

  return (
    <>
      <PageHeader
        eyebrow="Research · Notes"
        title="Digital lab notebook"
        description="Markdown notes typeset with real math and chemical notation — written while studying, kept because organized knowledge compounds."
      />

      <Container className="grid gap-5 py-16 md:grid-cols-2">
        {notes.map((note, i) => (
          <Reveal key={note.slug} delay={i * 90}>
            <Link href={`/research/notes/${note.slug}`} className="group block h-full">
              <GlassCard interactive className="flex h-full flex-col p-6">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="font-mono text-xs text-slate-500">{prettyDate(note.date)}</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 text-slate-600 transition-all group-hover:translate-x-1 group-hover:text-cyan-300" aria-hidden="true">
                    <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h2 className="font-display text-xl font-semibold text-white transition-colors group-hover:text-cyan-200">
                  {note.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{note.summary}</p>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
                  {note.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded border border-white/[0.08] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-slate-500"
                    >
                      #{tag}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </Link>
          </Reveal>
        ))}
      </Container>

      <Container className="pb-20">
        <Reveal>
          <p className="text-center font-mono text-xs text-slate-600">
            notes live as .md files in the repo · rendered at build time with KaTeX + mhchem
          </p>
        </Reveal>
      </Container>
    </>
  );
}
