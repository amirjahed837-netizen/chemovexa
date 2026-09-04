import type { Metadata } from "next";
import { MechanismClient } from "@/components/tools/mechanisms/MechanismClient";

export const metadata: Metadata = {
  title: "Organic Mechanism Library — CHEMOVEXA",
  description:
    "Every core organic chemistry mechanism — step by step, bilingual, grounded in McMurry 11e and the site's reference notes.",
};

export default function MechanismsPage() {
  return <MechanismClient />;
}
