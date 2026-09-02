import type { Metadata } from "next";
import { AssistantPageClient } from "@/components/pages/AssistantPageClient";

export const metadata: Metadata = {
  title: "AI Chemistry Assistant",
  description:
    "RAG-grounded assistant over this site's research notes, literature and tool documentation.",
};

export default function AssistantPage() {
  return <AssistantPageClient />;
}
