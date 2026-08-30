export type ReagentClass =
  | "metal"
  | "salt"
  | "acid"
  | "base"
  | "oxide"
  | "gas"
  | "organic"
  | "element";

export type Reagent = {
  id: string;
  name: string;
  formula: string;
  state: "s" | "l" | "g" | "aq";
  cls: ReagentClass;
  aliases?: string[];
};

export const CLASS_LABEL: Record<ReagentClass, string> = {
  metal: "Metal",
  salt: "Salt",
  acid: "Acid",
  base: "Base",
  oxide: "Oxide",
  gas: "Gas",
  organic: "Organic",
  element: "Element",
};

export const REAGENTS: Reagent[] = [
  { id: "h2", name: "Hydrogen", formula: "H2", state: "g", cls: "gas" },
  { id: "o2", name: "Oxygen", formula: "O2", state: "g", cls: "gas" },
  { id: "n2", name: "Nitrogen", formula: "N2", state: "g", cls: "gas" },
  { id: "cl2", name: "Chlorine", formula: "Cl2", state: "g", cls: "gas" },
  { id: "co2", name: "Carbon dioxide", formula: "CO2", state: "g", cls: "oxide" },
  { id: "h2o", name: "Water", formula: "H2O", state: "l", cls: "oxide" },
  { id: "na", name: "Sodium", formula: "Na", state: "s", cls: "metal" },
  { id: "mg", name: "Magnesium", formula: "Mg", state: "s", cls: "metal" },
  { id: "al", name: "Aluminium", formula: "Al", state: "s", cls: "metal" },
  { id: "zn", name: "Zinc", formula: "Zn", state: "s", cls: "metal" },
  { id: "fe", name: "Iron", formula: "Fe", state: "s", cls: "metal" },
  { id: "cu", name: "Copper", formula: "Cu", state: "s", cls: "metal" },
  { id: "c", name: "Carbon (graphite)", formula: "C", state: "s", cls: "element" },
  { id: "s8", name: "Sulfur", formula: "S8", state: "s", cls: "element", aliases: ["s"] },

  { id: "hcl", name: "Hydrochloric acid", formula: "HCl", state: "aq", cls: "acid" },
  { id: "h2so4", name: "Sulfuric acid", formula: "H2SO4", state: "aq", cls: "acid" },
  { id: "hno3", name: "Nitric acid", formula: "HNO3", state: "aq", cls: "acid" },
  { id: "ch3cooh", name: "Acetic acid", formula: "CH3COOH", state: "aq", cls: "acid", aliases: ["vinegar"] },

  { id: "naoh", name: "Sodium hydroxide", formula: "NaOH", state: "aq", cls: "base", aliases: ["lye"] },
  { id: "koh", name: "Potassium hydroxide", formula: "KOH", state: "aq", cls: "base" },
  { id: "nh3", name: "Ammonia", formula: "NH3", state: "g", cls: "base" },
  { id: "caoh2", name: "Calcium hydroxide", formula: "Ca(OH)2", state: "s", cls: "base", aliases: ["limewater"] },

  { id: "nacl", name: "Sodium chloride", formula: "NaCl", state: "aq", cls: "salt", aliases: ["salt"] },
  { id: "agno3", name: "Silver nitrate", formula: "AgNO3", state: "aq", cls: "salt" },
  { id: "na2co3", name: "Sodium carbonate", formula: "Na2CO3", state: "aq", cls: "salt", aliases: ["washing soda"] },
  { id: "nahco3", name: "Sodium bicarbonate", formula: "NaHCO3", state: "s", cls: "salt", aliases: ["baking soda"] },
  { id: "caco3", name: "Calcium carbonate", formula: "CaCO3", state: "s", cls: "salt", aliases: ["limestone", "marble"] },
  { id: "baso4", name: "Barium sulfate", formula: "BaSO4", state: "s", cls: "salt" },
  { id: "bacl2", name: "Barium chloride", formula: "BaCl2", state: "aq", cls: "salt" },
  { id: "k2cro4", name: "Potassium chromate", formula: "K2CrO4", state: "aq", cls: "salt" },
  { id: "pbno32", name: "Lead(II) nitrate", formula: "Pb(NO3)2", state: "aq", cls: "salt" },
  { id: "ki", name: "Potassium iodide", formula: "KI", state: "aq", cls: "salt" },
  { id: "pbi2", name: "Lead(II) iodide", formula: "PbI2", state: "s", cls: "salt" },
  { id: "agcl", name: "Silver chloride", formula: "AgCl", state: "s", cls: "salt" },
  { id: "feso4", name: "Iron(II) sulfate", formula: "FeSO4", state: "aq", cls: "salt" },
  { id: "cuo", name: "Copper(II) oxide", formula: "CuO", state: "s", cls: "oxide" },
  { id: "mgo", name: "Magnesium oxide", formula: "MgO", state: "s", cls: "oxide" },
  { id: "cao", name: "Calcium oxide", formula: "CaO", state: "s", cls: "oxide", aliases: ["quicklime"] },

  { id: "ch4", name: "Methane", formula: "CH4", state: "g", cls: "organic", aliases: ["natural gas"] },
  { id: "c2h5oh", name: "Ethanol", formula: "C2H5OH", state: "l", cls: "organic", aliases: ["alcohol"] },
  { id: "c3h8", name: "Propane", formula: "C3H8", state: "g", cls: "organic" },
];

export function findReagent(query: string): Reagent | undefined {
  const q = query.trim().toLowerCase();
  if (!q) return undefined;
  return REAGENTS.find(
    (r) =>
      r.formula.toLowerCase() === q ||
      r.name.toLowerCase() === q ||
      r.aliases?.some((a) => a === q),
  );
}

export function searchReagents(query: string): Reagent[] {
  const q = query.trim().toLowerCase();
  if (!q) return REAGENTS;
  return REAGENTS.filter(
    (r) =>
      r.name.toLowerCase().includes(q) ||
      r.formula.toLowerCase().includes(q) ||
      r.aliases?.some((a) => a.includes(q)),
  );
}
