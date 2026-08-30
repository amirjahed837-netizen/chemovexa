import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { ReactionLab } from "@/components/tools/lab/ReactionLab";

export const metadata: Metadata = {
  title: "Reaction Lab",
  description:
    "Combine reagents, balance equations automatically and explore reaction types with observations and safety notes.",
};

export default function ReactionLabPage() {
  return (
    <>
      <PageHeader
        eyebrow="Chemistry · Tool"
        title="Interactive Reaction Lab"
        description="Pick reagents from the shelf — or type any formula — and the lab balances the equation for you, classifies the reaction, and tells you what you'd see at the bench."
      >
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="pb-24 pt-12">
        <Reveal>
          <ReactionLab />
        </Reveal>
      </Container>
    </>
  );
}
