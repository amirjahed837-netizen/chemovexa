import type { Metadata } from "next";
import { CalculatorPageClient } from "@/components/pages/CalculatorPageClient";

export const metadata: Metadata = {
  title: "Chemistry Calculator",
  description:
    "Molar mass, stoichiometry, solutions, pH and unit conversions — instant and client-side.",
};

export default function CalculatorPage() {
  return <CalculatorPageClient />;
}
