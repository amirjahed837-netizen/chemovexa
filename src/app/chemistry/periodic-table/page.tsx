import type { Metadata } from "next";
import { QuantumLab } from "@/components/tools/quantum/QuantumLab";

export const metadata: Metadata = {
  title: "3D Quantum Periodic Table",
  description:
    "All 118 elements in true 3D — s/p/d/f orbitals, interactive 3D molecules with spring bonds, a 3D periodic table and NIST spectral fingerprints.",
};

export default function PeriodicTablePage() {
  return <QuantumLab />;
}
