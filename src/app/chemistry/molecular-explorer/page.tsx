import type { Metadata } from "next";
import { ExplorerPageClient } from "@/components/pages/ExplorerPageClient";

export const metadata: Metadata = {
  title: "Molecular Explorer",
  description:
    "Interactive 3D molecular structures — rotate, zoom and inspect real geometries in your browser.",
};

export default function MolecularExplorerPage() {
  return <ExplorerPageClient />;
}
