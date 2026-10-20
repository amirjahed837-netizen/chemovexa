import type { Metadata } from "next";
import { ElectrochemClient } from "@/components/tools/electrochem/ElectrochemClient";

export const metadata: Metadata = {
  title: "Titration & Electrochemistry Lab",
  description:
    "Titration curves, glass-electrode pH-metry with calibration QC, Nernst potentiometry cells, Faraday coulometry and a real 1-D diffusion cyclic-voltammetry simulation.",
};

export default function TitrationPage() {
  return <ElectrochemClient />;
}
