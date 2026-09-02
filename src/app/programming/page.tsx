import type { Metadata } from "next";
import { ProgrammingHubClient } from "@/components/pages/ProgrammingHubClient";

export const metadata: Metadata = {
  title: "Programming",
  description: "Projects, open source and engineering practices.",
};

export default function ProgrammingPage() {
  return <ProgrammingHubClient />;
}
