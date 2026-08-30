import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const NOTES_DIR = path.join(process.cwd(), "src", "content", "notes");

export type NoteMeta = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
};

export type Note = NoteMeta & { content: string };

function parseFrontmatter(raw: string): {
  meta: Record<string, string>;
  body: string;
} {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim();
    if (key) meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

export async function getAllNotes(): Promise<NoteMeta[]> {
  let files: string[] = [];
  try {
    files = await readdir(NOTES_DIR);
  } catch {
    return [];
  }
  const notes = await Promise.all(
    files
      .filter((f) => f.endsWith(".md"))
      .map(async (file) => {
        const slug = file.replace(/\.md$/, "");
        const raw = await readFile(path.join(NOTES_DIR, file), "utf8");
        const { meta } = parseFrontmatter(raw);
        return {
          slug,
          title: meta.title ?? slug,
          date: meta.date ?? "",
          tags: (meta.tags ?? "")
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          summary: meta.summary ?? "",
        };
      }),
  );
  return notes.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNote(slug: string): Promise<Note | null> {
  const safe = slug.replace(/[^a-z0-9-]/gi, "");
  if (!safe) return null;
  try {
    const raw = await readFile(path.join(NOTES_DIR, `${safe}.md`), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: safe,
      title: meta.title ?? safe,
      date: meta.date ?? "",
      tags: (meta.tags ?? "")
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      summary: meta.summary ?? "",
      content: body,
    };
  } catch {
    return null;
  }
}
