import type { Metadata } from "next";
import { ResearchHubClient } from "@/components/pages/ResearchHubClient";

export const metadata: Metadata = {
  title: "Research",
  description: "Research notes, literature and references.",
};

export default function ResearchPage() {
  return <ResearchHubClient />;
}
