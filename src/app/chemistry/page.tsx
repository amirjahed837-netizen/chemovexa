import type { Metadata } from "next";
import { ChemistryHubClient } from "@/components/pages/ChemistryHubClient";

export const metadata: Metadata = {
  title: "Chemistry",
  description: "Interactive chemistry tools: calculator, 3D molecular explorer and reaction lab.",
};

export default function ChemistryPage() {
  return <ChemistryHubClient />;
}
