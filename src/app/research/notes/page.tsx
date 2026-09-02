import { getAllNotes } from "@/lib/content";
import { NotesClient } from "@/components/pages/NotesClient";

export const metadata = {
  title: "Research Notes",
  description: "Structured study notes with proper chemical notation and math.",
};

export default async function NotesPage() {
  const notes = await getAllNotes();
  return <NotesClient notes={notes} />;
}
