import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ExplorerApp } from "@/components/tools/explorer/ExplorerApp";

export const metadata: Metadata = {
  title: "Molecular Explorer",
  description:
    "Interactive 3D molecular structures — rotate, zoom and inspect real geometries in your browser.",
};

export default function MolecularExplorerPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chemistry · Tool"
        title="3D Molecular Explorer"
        description="Real 3D geometry, rendered in real time. Drag to rotate, scroll to zoom — then switch styles to see why chemists draw the same molecule three different ways."
      >
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <ExplorerApp />
        </Reveal>
      </Container>
    </>
  );
}
