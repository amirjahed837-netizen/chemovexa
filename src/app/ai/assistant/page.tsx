import type { Metadata } from "next";
import { PageHeader } from "@/components/pages/PageHeader";
import { Container } from "@/components/ui/Container";
import { StatusBadge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { AssistantChat } from "@/components/tools/assistant/AssistantChat";

export const metadata: Metadata = {
  title: "AI Chemistry Assistant",
  description:
    "RAG-grounded assistant over this site's research notes, literature and tool documentation.",
};

export default function AssistantPage() {
  return (
    <>
      <PageHeader
        eyebrow="AI · Built last, on purpose"
        title="Chemistry Assistant"
        description="The intelligence layer goes on top of real infrastructure: every answer is retrieved from this site's actual notes, book annotations and tool documentation — with citations you can click."
      >
        <div className="mt-5">
          <StatusBadge status="live" />
        </div>
      </PageHeader>

      <Container className="max-w-3xl pb-24 pt-12">
        <Reveal>
          <AssistantChat />
        </Reveal>
      </Container>
    </>
  );
}
