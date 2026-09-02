import type { Metadata } from "next";
import { LabPageClient } from "@/components/pages/LabPageClient";

export const metadata: Metadata = {
  title: "Reaction Lab",
  description:
    "Combine reagents, balance equations automatically and explore reaction types with observations and safety notes.",
};

export default function ReactionLabPage() {
  return <LabPageClient />;
}
