import type { Metadata } from "next";
import { TitrationClient } from "@/components/tools/titration/TitrationClient";

export const metadata: Metadata = {
  title: "Titration Simulator",
  description:
    "Interactive titration curves with exact equilibrium math — strong/weak acid–base systems, equivalence points and indicator ranges.",
};

export default function TitrationPage() {
  return <TitrationClient />;
}
