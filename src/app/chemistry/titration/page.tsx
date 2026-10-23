import type { Metadata } from "next";
import { ElectrochemClient } from "@/components/tools/electrochem/ElectrochemClient";

export const metadata: Metadata = {
  title: "Titration & Electrochemistry Lab",
  description:
    "Exact titration curves for mono-, di- and triprotic systems plus redox titrations — temperature-corrected pKw and Nernst slopes, first-derivative and Gran analysis, indicator selection, species distributions, CSV export — plus pH-metry with calibration QC, Nernst potentiometry, Faraday coulometry and a real 1-D diffusion cyclic-voltammetry simulation.",
};

export default function TitrationPage() {
  return <ElectrochemClient />;
}
