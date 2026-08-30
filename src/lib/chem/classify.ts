import type { Reagent } from "@/config/reagents";

export type ReactionType =
  | "synthesis"
  | "decomposition"
  | "single-displacement"
  | "double-displacement"
  | "combustion"
  | "acid-base";

export const REACTION_TYPE_LABEL: Record<ReactionType, string> = {
  synthesis: "Synthesis",
  decomposition: "Decomposition",
  "single-displacement": "Single displacement",
  "double-displacement": "Double displacement / precipitation",
  combustion: "Combustion",
  "acid-base": "Acid–base neutralization",
};

const ACTIVITY: string[] = ["K", "Na", "Ca", "Mg", "Al", "Zn", "Fe", "Pb", "H", "Cu", "Ag"];

function activityRank(formula: string): number {
  const idx = ACTIVITY.indexOf(formula);
  return idx === -1 ? -1 : idx;
}

export type Classification = {
  type: ReactionType;
  observation: string;
  safety: string[];
};

export function classify(
  left: { reagent?: Reagent; coeff: number }[],
  right: { reagent?: Reagent; coeff: number }[],
): Classification {
  const L = left.filter((x) => x.reagent);
  const R = right.filter((x) => x.reagent);

  const formulas = (arr: typeof L) => arr.map((x) => x.reagent!.formula);
  const hasClass = (arr: typeof L, c: string) =>
    arr.some((x) => x.reagent!.cls === c);

  // combustion: organic/gas + O2 → CO2 (+ H2O)
  if (
    L.length === 2 &&
    formulas(L).includes("O2") &&
    R.some((x) => x.reagent!.formula === "CO2")
  ) {
    return {
      type: "combustion",
      observation:
        "Burns with a flame; releases heat and light. Carbon dioxide and water vapour are produced.",
      safety: ["Open flame — keep away from flammable materials", "Ensure good ventilation"],
    };
  }

  // acid-base: acid + base → salt + water
  if (
    hasClass(L, "acid") &&
    hasClass(L, "base") &&
    R.some((x) => x.reagent!.formula === "H2O")
  ) {
    return {
      type: "acid-base",
      observation:
        "Neutralization: the solution warms slightly as water forms. Indicator colour shifts toward neutral pH.",
      safety: ["Both concentrated solutions are corrosive — add acid to water, never the reverse"],
    };
  }

  // single displacement: metal + acid/salt → different metal + product
  if (
    L.length === 2 &&
    R.length === 2 &&
    hasClass(L, "metal")
  ) {
    const metal = L.find((x) => x.reagent!.cls === "metal")!;
    const displaced = R.find((x) => x.reagent!.cls === "metal");
    if (displaced) {
      const from = activityRank(metal.reagent!.formula);
      const to = activityRank(displaced.reagent!.formula);
      if (from !== -1 && to !== -1 && from > to) {
        return {
          type: "single-displacement",
          observation: `No reaction in the intended direction — ${displaced.reagent!.name} is less reactive than expected here. Check the activity series.`,
          safety: [],
        };
      }
      return {
        type: "single-displacement",
        observation: `The more active metal ${metal.reagent!.name} displaces the ion of the less active one. Watch for gas bubbles or metal deposit depending on the partner.`,
        safety: ["Reaction may be exothermic", "If an acid is involved, H₂ gas may evolve — no flames"],
      };
    }
    return {
      type: "single-displacement",
      observation:
        "A metal reacts with the acid or salt solution. Hydrogen gas often bubbles off when the partner is an acid above hydrogen in the activity series.",
      safety: ["Possible H₂ evolution — keep flames away"],
    };
  }

  // double displacement / precipitation
  if (L.length === 2 && R.length >= 2 && hasClass(L, "salt")) {
    const solidProduct = R.find((x) => x.reagent!.state === "s");
    return {
      type: "double-displacement",
      observation: solidProduct
        ? `Ions swap partners. A precipitate of ${solidProduct.reagent!.name} forms — the solution turns cloudy.`
        : "Ions swap partners between two electrolyte solutions.",
      safety: ["Many products are toxic or irritants — wear gloves and goggles"],
    };
  }

  // synthesis: many → one
  if (L.length >= 2 && R.length === 1) {
    return {
      type: "synthesis",
      observation:
        "Two or more substances combine into a single product. Synthesis reactions are usually exothermic once initiated.",
      safety: ["Initiation may require heat — handle hot glassware with tongs"],
    };
  }

  // decomposition: one → many
  if (L.length === 1 && R.length >= 2) {
    return {
      type: "decomposition",
      observation:
        "A single compound breaks apart into simpler substances, typically under heat. Gas evolution may pressurize closed vessels.",
      safety: ["Never heat a closed system", "Test evolved gases carefully"],
    };
  }

  return {
    type: "synthesis",
    observation: "Combine the reagents and observe what happens.",
    safety: ["Standard PPE: goggles, gloves, lab coat"],
  };
}
