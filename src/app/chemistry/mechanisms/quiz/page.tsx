import type { Metadata } from "next";
import { QuizPageClient } from "@/components/tools/mechanisms/QuizPageClient";

export const metadata: Metadata = {
  title: "Mechanism Quiz — CHEMOVEXA",
  description:
    "Test your organic chemistry: a generated quiz over every mechanism in the library — bilingual, with saved high scores.",
};

export default function MechanismQuizPage() {
  return <QuizPageClient />;
}
