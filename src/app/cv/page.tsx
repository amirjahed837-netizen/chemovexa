import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { CVDocument } from "@/components/cv/CVDocument";
import { PrintButton } from "@/components/cv/PrintButton";

export const metadata: Metadata = {
  title: "CV",
  description: "Curriculum Vitae — education, experience, skills and research interests.",
};

export default function CVPage() {
  return (
    <Container className="max-w-4xl pb-24 pt-28 sm:pt-32">
      {/* toolbar */}
      <Reveal className="no-print mb-6 flex items-center justify-between gap-3">
        <ButtonLink href="/about" variant="ghost" size="sm">← About</ButtonLink>
        <div className="flex items-center gap-3">
          <span className="hidden font-mono text-xs text-slate-500 sm:block">
            tip: the print dialog can save this as PDF
          </span>
          <PrintButton />
        </div>
      </Reveal>

      <Reveal delay={80}>
        <CVDocument />
      </Reveal>
    </Container>
  );
}
