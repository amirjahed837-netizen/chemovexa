import type { MechanismDiagram } from "./diagram-types";
import { FOUNDATION_DIAGRAMS } from "./diagrams-foundations";
import { ALKENE_DIAGRAMS } from "./diagrams-alkenes";
import { AROMATIC_DIAGRAMS } from "./diagrams-aromatics";
import { CARBONYL_DIAGRAMS } from "./diagrams-carbonyl";
import { ACYL_DIAGRAMS } from "./diagrams-acyl";

export type { MechanismDiagram } from "./diagram-types";
export * from "./diagram-types";

export const DIAGRAMS: Record<string, MechanismDiagram> = {
  ...FOUNDATION_DIAGRAMS,
  ...ALKENE_DIAGRAMS,
  ...AROMATIC_DIAGRAMS,
  ...CARBONYL_DIAGRAMS,
  ...ACYL_DIAGRAMS,
};

export const getDiagram = (mechId: string): MechanismDiagram | undefined =>
  DIAGRAMS[mechId];
