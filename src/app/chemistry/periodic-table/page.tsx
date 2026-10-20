import type { Metadata } from "next";
import { PeriodicTableClient } from "@/components/tools/periodic/PeriodicTableClient";

export const metadata: Metadata = {
  title: "Periodic Table",
  description:
    "All 118 elements, fully interactive — filter by category, search by name or symbol, and inspect electron configurations and placement.",
};

export default function PeriodicTablePage() {
  return <PeriodicTableClient />;
}
