import { parseFormula, molarMass } from "./formula";
import { elementName } from "./periodic";
import { REAGENTS } from "@/config/reagents";
import type { Reagent } from "@/config/reagents";
import { balanceEquation } from "./balance";
import type { SpeciesInput } from "./balance";
import { BOOK_REACTIONS } from "./book-reactions";

export type ReactionRole =
  | "acid"
  | "base"
  | "acid-oxide"
  | "basic-oxide"
  | "amphoteric-oxide"
  | "metal"
  | "nonmetal"
  | "salt"
  | "oxide"
  | "organic"
  | "oxidizer"
  | "reducer"
  | "other";

export type KnownReaction = {
  id: string;
  left: string[];
  right: string[];
  title: string;
  typeLabel: string;
  chapter?: string;
  mechanism: string;
  whatHappens: string;
  observation: string;
  ionic?: {
    complete: string;
    net?: string;
    note?: string;
  };
  conditions?: string;
  safety: string[];
};

function byFormula(formula: string): Reagent | undefined {
  return REAGENTS.find((r) => r.formula === formula);
}

function classifyRole(r: Reagent): ReactionRole {
  switch (r.cls) {
    case "acid":
      return "acid";
    case "base":
      return r.formula === "NH3" ? "base" : "base";
    case "metal":
      return "metal";
    case "organic":
      return "organic";
    case "salt":
      return "salt";
    case "oxide":
      if (r.formula === "CO2" || r.formula === "SO2") return "acid-oxide";
      if (["CaO", "MgO", "Na2O", "K2O", "BaO"].includes(r.formula)) return "basic-oxide";
      if (["Al2O3", "ZnO", "BeO"].includes(r.formula)) return "amphoteric-oxide";
      return "oxide";
    case "gas":
      return r.formula === "O2" ? "oxidizer" : "nonmetal";
    case "element":
      return r.formula === "C" || r.formula === "H2" ? "reducer" : "nonmetal";
    default:
      return "other";
  }
}

export const ROLES: { id: ReactionRole; label: string; color: string }[] = [
  { id: "acid", label: "Acid", color: "text-rose-300 border-rose-400/30 bg-rose-400/10" },
  { id: "base", label: "Base", color: "text-sky-300 border-sky-400/30 bg-sky-400/10" },
  { id: "acid-oxide", label: "Acidic oxide", color: "text-rose-300 border-rose-400/30 bg-rose-400/10" },
  { id: "basic-oxide", label: "Basic oxide", color: "text-sky-300 border-sky-400/30 bg-sky-400/10" },
  { id: "amphoteric-oxide", label: "Amphoteric", color: "text-violet-300 border-violet-400/30 bg-violet-400/10" },
  { id: "metal", label: "Metal", color: "text-amber-300 border-amber-400/30 bg-amber-400/10" },
  { id: "nonmetal", label: "Nonmetal", color: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10" },
  { id: "salt", label: "Salt", color: "text-teal-300 border-teal-400/30 bg-teal-400/10" },
  { id: "oxide", label: "Oxide", color: "text-slate-300 border-white/15 bg-white/5" },
  { id: "organic", label: "Organic", color: "text-lime-300 border-lime-400/30 bg-lime-400/10" },
  { id: "oxidizer", label: "Oxidizer", color: "text-orange-300 border-orange-400/30 bg-orange-400/10" },
  { id: "reducer", label: "Reducer", color: "text-cyan-300 border-cyan-400/30 bg-cyan-400/10" },
  { id: "other", label: "Other", color: "text-slate-300 border-white/15 bg-white/5" },
];

export function roleOf(formula: string): { role: ReactionRole; label: string; color: string } {
  const meta = byFormula(formula);
  if (!meta) {
    return { role: "other", label: "Unknown", color: "text-slate-400 border-white/10 bg-white/5" };
  }
  const role = classifyRole(meta);
  const entry = ROLES.find((r) => r.id === role)!;
  return { role, label: entry.label, color: entry.color };
}

function canonicalKey(species: { formula: string; side: string }[]): string {
  return species
    .map((s) => `${s.side[0]}:${s.formula}`)
    .sort()
    .join("|");
}

const KNOWLEDGE: KnownReaction[] = [
  {
    id: "hcl-naoh",
    left: ["HCl", "NaOH"],
    right: ["NaCl", "H2O"],
    title: "Strong acid–strong base neutralization",
    typeLabel: "Neutralization (double displacement)",
    mechanism:
      "The only real reaction is proton transfer: H⁺ from the acid and OH⁻ from the base combine into covalent water. The Na⁺ and Cl⁻ never touch — they stay dissolved as spectator ions.",
    whatHappens:
      "HCl donates a proton (H⁺), NaOH donates hydroxide (OH⁻). They meet and form H₂O. What remains — Na⁺ and Cl⁻ — simply floats around hydrated in solution. Evaporate the water and NaCl (table salt) crystallizes out.",
    observation:
      "If mixed in equimolar amounts, nothing dramatic: the solution stays clear and warms slightly (ΔH ≈ −57 kJ/mol of water formed). Phenolphthalein goes from pink to colorless if the base is exactly consumed.",
    ionic: {
      complete: "H⁺(aq) + Cl⁻(aq) + Na⁺(aq) + OH⁻(aq) → Na⁺(aq) + Cl⁻(aq) + H₂O(l)",
      net: "H⁺(aq) + OH⁻(aq) → H₂O(l)",
      note: "The most important net ionic equation in acid–base chemistry — it is identical for ANY strong acid with ANY strong base.",
    },
    conditions: "Room temperature, aqueous solutions, no catalyst needed.",
    safety: [
      "Concentrated HCl and NaOH are corrosive — goggles and gloves mandatory",
      "Add acid to water, never water to acid",
      "Neutralization is exothermic — mix slowly",
    ],
  },
  {
    id: "zn-hcl",
    left: ["Zn", "HCl"],
    right: ["ZnCl2", "H2"],
    title: "Metal + acid → salt + hydrogen (single displacement)",
    typeLabel: "Single displacement (redox)",
    mechanism:
      "Zinc sits above hydrogen in the activity series, so Zn atoms give up 2 electrons each (Zn → Zn²⁺ + 2e⁻). The H⁺ ions accept these electrons in pairs (2H⁺ + 2e⁻ → H₂↑). Electrons flow metal → proton.",
    whatHappens:
      "Each zinc atom is oxidized to Zn²⁺, which dissolves. Two protons pick up the released electrons and leave the solution as hydrogen gas. Chloride is a spectator.",
    observation:
      "Zinc granules slowly dissolve, the metal surface fizzes with small H₂ bubbles, the beaker warms. The classic test: a burning splint at the mouth of the tube 'pops' — that is hydrogen.",
    ionic: {
      complete: "Zn(s) + 2H⁺(aq) + 2Cl⁻(aq) → Zn²⁺(aq) + 2Cl⁻(aq) + H₂(g)",
      net: "Zn(s) + 2H⁺(aq) → Zn²⁺(aq) + H₂(g)",
      note: "Cl⁻ is a pure spectator — any soluble chloride would do the same job.",
    },
    conditions: "Dilute acid works; warming speeds it up. Very pure Zn reacts slowly (add a drop of CuSO₄ to catalyze).",
    safety: [
      "H₂ gas is flammable — no flames near the reaction",
      "Use dilute acid; concentrated HCl fumes",
    ],
  },
  {
    id: "agno3-nacl",
    left: ["AgNO3", "NaCl"],
    right: ["AgCl", "NaNO3"],
    title: "Precipitation of silver chloride",
    typeLabel: "Double displacement (precipitation)",
    mechanism:
      "In water all four ions swim free: Ag⁺, NO₃⁻, Na⁺, Cl⁻. Ag⁺ meets Cl⁻ — their attraction is so strong that they assemble into an insoluble ionic lattice and leave the solution as a solid. Na⁺ and NO₃⁻ stay dissolved.",
    whatHappens:
      "This is less a 'reaction' than a separation: two soluble salts trade partners, and the one insoluble pairing (AgCl) crashes out. Ksp(AgCl) ≈ 1.8×10⁻¹⁰ — once [Ag⁺][Cl⁻] exceeds it, solid must form.",
    observation:
      "The instant the solutions touch, the mixture turns milky white ('silver snow'). If left standing, the white solid settles; it darkens to grey/violet in sunlight because AgCl photodecomposes into silver metal.",
    ionic: {
      complete: "Ag⁺(aq) + NO₃⁻(aq) + Na⁺(aq) + Cl⁻(aq) → AgCl(s) + Na⁺(aq) + NO₃⁻(aq)",
      net: "Ag⁺(aq) + Cl⁻(aq) → AgCl(s)",
      note: "The classic test for chloride ions in qualitative analysis.",
    },
    conditions: "Aqueous solutions of both salts; works at any temperature.",
    safety: [
      "AgNO₃ stains skin black (reduces to metallic silver) — gloves",
      "Silver salts are harmful to aquatic life — do not pour down the drain",
    ],
  },
  {
    id: "ch4-combustion",
    left: ["CH4", "O2"],
    right: ["CO2", "H2O"],
    title: "Complete combustion of methane",
    typeLabel: "Combustion (redox)",
    mechanism:
      "Carbon in CH₄ (−4) is oxidized to +4 in CO₂; oxygen (0) is reduced to −2. A spark/flame breaks some C–H bonds and supplies activation energy; after that the chain reaction sustains itself, releasing ~890 kJ/mol.",
    whatHappens:
      "Every C–H bond is replaced by C–O bonds. Carbon ends up in CO₂, hydrogens end up in H₂O. This is the net reaction of natural-gas stoves worldwide.",
    observation:
      "A clean blue flame (complete combustion) with significant heat. Incomplete combustion (limited O₂) gives a sooty yellow flame and toxic CO instead.",
    conditions: "Requires ignition; needs ample O₂ supply for complete combustion.",
    safety: [
      "Open flame + flammable gas — check for leaks",
      "Incomplete combustion produces poisonous CO — ventilate",
    ],
  },
  {
    id: "caco3-decomp",
    left: ["CaCO3"],
    right: ["CaO", "CO2"],
    title: "Thermal decomposition of limestone (calcination)",
    typeLabel: "Decomposition",
    mechanism:
      "Heat pushes the equilibrium CaCO₃(s) ⇌ CaO(s) + CO₂(g) to the right by removing CO₂ from the solid's lattice — an entropically driven process above ~825 °C.",
    whatHappens:
      "The carbonate ion CO₃²⁻ literally shakes apart: the C–O bond to calcium breaks, CO₂ gas escapes, leaving the strongly basic oxide CaO (quicklime). One of the oldest industrial reactions of humanity.",
    observation:
      "Nothing visible until ~825 °C; above it the lump whitens/cracks slightly and effervesces faintly as CO₂ leaves. The product fizzes violently if water is dripped on it (CaO + H₂O → Ca(OH)₂, strongly exothermic).",
    conditions: "T ≈ 825–900 °C in a lime kiln; the reaction is reversible if CO₂ pressure is high.",
    safety: [
      "Never heat a closed vessel — CO₂ pressure builds",
      "CaO is caustic and reacts violently with water/sweat",
    ],
  },
  {
    id: "mg-o2",
    left: ["Mg", "O2"],
    right: ["MgO"],
    title: "Magnesium combustion (synthesis)",
    typeLabel: "Synthesis (redox)",
    mechanism:
      "Magnesium is a very eager reducing agent: Mg → Mg²⁺ + 2e⁻. Oxygen takes the electrons (O + 2e⁻ → O²⁻). The huge lattice energy of MgO makes ΔG strongly negative, so the reaction races once ignited.",
    whatHappens:
      "Magnesium metal burns directly with the oxygen of the air into a single white ionic solid. Historically used in flash powder because of its blinding white light.",
    observation:
      "A dazzling, blinding white flame — do NOT look directly at it (UV output damages the retina). Leaves brittle white MgO powder. Water does NOT extinguish it (Mg reduces H₂O at high temperature).",
    conditions: "Ignition at ~470 °C with a Bunsen burner; burns in N₂ and CO₂ as well.",
    safety: [
      "BLINDING light — never look directly; use welding-grade eye protection",
      "Burns in CO₂ and N₂ too — class D extinguisher or dry sand only",
      "NEVER water",
    ],
  },
  {
    id: "caco3-hcl",
    left: ["CaCO3", "HCl"],
    right: ["CaCl2", "H2O", "CO2"],
    title: "Carbonate + acid (gas evolution)",
    typeLabel: "Double displacement + decomposition",
    mechanism:
      "Two steps in one: H⁺ protonates the carbonate (HCO₃⁻ forms), a second H⁺ gives H₂CO₃ which instantly falls apart into H₂O + CO₂. The gas escaping drives the equilibrium forward — Le Chatelier in action.",
    whatHappens:
      "The acid's protons attack the carbonate ion. The unstable carbonic acid H₂CO₃ decomposes to water and CO₂ gas which bubbles out, pulling more carbonate into solution.",
    observation:
      "Vigorous fizzing (effervescence) of odorless CO₂; the solid marble/limestone shrinks and dissolves. The gas turns limewater milky — the classic CO₂ identification test. This is how geologists identify carbonate minerals.",
    ionic: {
      complete: "CaCO₃(s) + 2H⁺(aq) + 2Cl⁻(aq) → Ca²⁺(aq) + 2Cl⁻(aq) + H₂O(l) + CO₂(g)",
      net: "CaCO₃(s) + 2H⁺(aq) → Ca²⁺(aq) + H₂O(l) + CO₂(g)",
    },
    conditions: "Works with any dilute strong acid; slows down as the acid is consumed.",
    safety: [
      "CO₂ evolves — do it in a ventilated area or fume hood",
      "Acid is corrosive — goggles",
    ],
  },
  {
    id: "c3h8-combustion",
    left: ["C3H8", "O2"],
    right: ["CO2", "H2O"],
    title: "Complete combustion of propane",
    typeLabel: "Combustion (redox)",
    mechanism:
      "Same electron bookkeeping as methane, scaled up: 5 O₂ per molecule, ΔH ≈ −2220 kJ/mol. Propane's higher carbon density gives a hotter, more energy-dense flame than methane.",
    whatHappens:
      "Propane (LPG, camping gas) oxidizes fully to CO₂ and H₂O. The C–C bonds also break, so per-molecule energy release is much larger than for methane.",
    observation:
      "Hot blue flame; the flame of every camping stove and gas grill. Yellow/sooty flame signals O₂ starvation → CO risk.",
    conditions: "Ignition source needed; pressure-regulated supply (LPG cylinder).",
    safety: [
      "LPG leaks explode — check connections with soapy water",
      "Never use indoors without ventilation",
    ],
  },
  {
    id: "c2h5oh-combustion",
    left: ["C2H5OH", "O2"],
    right: ["CO2", "H2O"],
    title: "Complete combustion of ethanol",
    typeLabel: "Combustion (redox)",
    mechanism:
      "Ethanol already contains one O, so it needs less O₂ per carbon than a hydrocarbon (3 O₂ per molecule) — that is why gasohol burns 'cleaner'. Carbon goes −2 → +4.",
    whatHappens:
      "The two-carbon alcohol burns to 2 CO₂ + 3 H₂O. Bio-ethanol from fermentation is the oxygenate in E10 gasoline.",
    observation:
      "Pale blue, almost invisible flame with gentle heat — ethanol burner flames are notoriously hard to see in daylight. Check with a splint, not your eyes.",
    conditions: "Ignition needed; pure ethanol burns reluctantly — fumes help.",
    safety: [
      "Invisible flame — never approach a burner blindly",
      "Flammable liquid — keep bottle away from the flame",
    ],
  },
  {
    id: "caO-h2o",
    left: ["CaO", "H2O"],
    right: ["Ca(OH)2"],
    title: "Slaking of quicklime",
    typeLabel: "Synthesis (strongly exothermic)",
    mechanism:
      "Water attacks the Ca²⁺ lattice; the oxide ion O²⁻ is such a strong base that it rips a proton right out of water, becoming two OH⁻. The lattice swells into portlandite.",
    whatHappens:
      "CaO + H₂O → Ca(OH)₂ releases so much heat the mixture can literally hiss and steam. 'Slaking' is why lime mortar sets and why quicklime was used in ancient chemical warfare.",
    observation:
      "Voluminous white paste forms; steam rises; the mass can crack a container from expansion. The product (limewater) turns milky with CO₂.",
    conditions: "Room temperature — needs no activation, just water contact.",
    safety: [
      "Highly caustic — can burn skin (pH ~12.5)",
      "Steam burns — add water slowly to lime, not a lump into a bucket",
    ],
  },
  {
    id: "naoh-hcl-dilution-example",
    left: ["KOH", "HNO3"],
    right: ["KNO3", "H2O"],
    title: "Neutralization: KOH + HNO₃",
    typeLabel: "Neutralization (double displacement)",
    mechanism:
      "Identical proton-transfer logic to HCl/NaOH: K⁺ and NO₃⁻ are spectators, H⁺ + OH⁻ → H₂O does the work. ΔH ≈ −57 kJ/mol again — proof the salt identity is irrelevant.",
    whatHappens:
      "Any strong acid + any strong base reduces to the same net ionic story: make water from H⁺ and OH⁻. The particular salt is just the leftovers.",
    observation:
      "Clear solution, mild warming, indicator flip at the equivalence point. KNO₃ stays dissolved (all nitrates are soluble).",
    ionic: {
      complete: "K⁺(aq) + OH⁻(aq) + H⁺(aq) + NO₃⁻(aq) → K⁺(aq) + NO₃⁻(aq) + H₂O(l)",
      net: "H⁺(aq) + OH⁻(aq) → H₂O(l)",
    },
    conditions: "Aqueous, room temperature.",
    safety: ["Both concentrates are corrosive"],
  },
  {
    id: "nahco3-decomp",
    left: ["NaHCO3"],
    right: ["Na2CO3", "H2O", "CO2"],
    title: "Baking soda decomposition",
    typeLabel: "Decomposition",
    mechanism:
      "Above ~80 °C the bicarbonate's own acidic H protonates its neighboring carbonate O: 2 HCO₃⁻ → CO₃²⁻ + H₂O + CO₂. An internal acid–base reaction inside one salt.",
    whatHappens:
      "Baking soda (sodium bicarbonate) breaks into washing soda + water + CO₂ gas. This gas is what makes cakes rise when baking soda hits oven heat.",
    observation:
      "The white powder subtly loses mass and releases CO₂ (invisible). In water with an indicator it shifts from slightly basic to more basic (Na₂CO₃).",
    conditions: "T > 80 °C, dry heat; complete above ~150 °C.",
    safety: ["Essentially harmless — food-grade reaction", "Hot vessel, obviously"],
  },
  {
    id: "h2-o2",
    left: ["H2", "O2"],
    right: ["H2O"],
    title: "Hydrogen–oxygen synthesis (explosive)",
    typeLabel: "Synthesis (redox)",
    mechanism:
      "A H–H or O=O bond must first be broken (spark). Then radical chains H· + O₂ → HO₂· etc. propagate explosively. ΔH = −286 kJ/mol — hydrogen's energy density made it rocket fuel ( Saturn V, Space Shuttle).",
    whatHappens:
      "The cleanest fuel reaction in chemistry: hydrogen + oxygen → pure water + enormous energy. No carbon, no soot, just energy and water vapor.",
    observation:
      "If H₂ is pure and burning from a jet: nearly invisible pale-blue flame. If H₂/O₂ are PRE-MIXED: violent explosion with a characteristic 'bark'. The squeaky-pop test for small H₂ samples.",
    conditions: "Spark or flame; mixture between 4–95 % H₂ in air is explosive.",
    safety: [
      "DETONATION risk with pre-mixed gases — never mix in a closed vessel",
      "'Pop test' only with tiny quantities in a test tube",
    ],
  },
];

export const ALL_KNOWN_REACTIONS: KnownReaction[] = [...KNOWLEDGE, ...BOOK_REACTIONS];

const K = ALL_KNOWN_REACTIONS;

function matchKnowledge(
  left: string[],
  right: string[],
): KnownReaction | undefined {
  const target = canonicalKey([
    ...left.map((f) => ({ formula: f, side: "left" })),
    ...right.map((f) => ({ formula: f, side: "right" })),
  ]);
  for (const k of K) {
    const candidate = canonicalKey([
      ...k.left.map((f) => ({ formula: f, side: "left" })),
      ...k.right.map((f) => ({ formula: f, side: "right" })),
    ]);
    if (candidate === target) return k;
  }
  return undefined;
}

function worstCaseExplanation(formulas: string[]): string {
  const parts: string[] = [];
  for (const f of formulas) {
    try {
      const parsed = parseFormula(f);
      const elements = [...parsed.counts.keys()].map((sym) => {
        const n = parsed.counts.get(sym)!;
        const name = elementName(sym).toLowerCase();
        return `${n} × ${name}`;
      });
      parts.push(`${f} contains ${elements.join(", ")}.`);
    } catch {
      parts.push(`${f}: formula could not be parsed.`);
    }
  }
  return parts.join(" ");
}

export type ReactionWriteup = {
  found: boolean;
  id?: string;
  title: string;
  typeLabel: string;
  chapter?: string;
  mechanism: string;
  whatHappens: string;
  observation: string;
  ionic?: { complete: string; net?: string; note?: string };
  conditions?: string;
  safety: string[];
  atomInventory: { symbol: string; name: string; left: number; right: number; ok: boolean }[];
  molarMasses: { formula: string; mass: number }[];
};

export function buildWriteup(
  left: string[],
  right: string[],
  coeffs: Map<string, number>,
): ReactionWriteup {
  const known = matchKnowledge(left, right);

  const atomTally = new Map<string, { left: number; right: number }>();
  const masses: { formula: string; mass: number }[] = [];

  for (const [side, arr] of [
    ["left", left],
    ["right", right],
  ] as const) {
    for (const f of arr) {
      const coeff = coeffs.get(f) ?? 1;
      try {
        const parsed = parseFormula(f);
        masses.push({ formula: f, mass: molarMass(parsed.counts) });
        for (const [sym, n] of parsed.counts) {
          const cur = atomTally.get(sym) ?? { left: 0, right: 0 };
          cur[side] += n * coeff;
          atomTally.set(sym, cur);
        }
      } catch {
        masses.push({ formula: f, mass: NaN });
      }
    }
  }

  const atomInventory = [...atomTally.entries()]
    .map(([symbol, t]) => ({
      symbol,
      name: elementName(symbol),
      left: t.left,
      right: t.right,
      ok: t.left === t.right,
    }))
    .sort((a, b) => a.symbol.localeCompare(b.symbol));

  if (known) {
    return {
      found: true,
      id: known.id,
      title: known.title,
      typeLabel: known.typeLabel,
      chapter: known.chapter,
      mechanism: known.mechanism,
      whatHappens: known.whatHappens,
      observation: known.observation,
      ionic: known.ionic,
      conditions: known.conditions,
      safety: known.safety,
      atomInventory,
      molarMasses: masses,
    };
  }

  const allFormulas = [...left, ...right];
  const roles = allFormulas.map((f) => roleOf(f));
  const typeHint = roles
    .map((r) => r.label)
    .filter((v, i, a) => a.indexOf(v) === i)
    .join(" + ");

  return {
    found: false,
    title: "Custom reaction — heuristic write-up",
    typeLabel: `Detected reagent roles: ${typeHint}`,
    mechanism:
      "This exact combination is not in the lab's curated knowledge base, so here is a structural analysis instead of a memorized answer. The equation is balanced by exact rational elimination, so the atom bookkeeping below is guaranteed correct regardless.",
    whatHappens: worstCaseExplanation(allFormulas),
    observation:
      "No curated observation for this pair. General heuristics: metals above H in the activity series + acid → gas; two clear salt solutions can silently form a cloudy precipitate; anything with O₂ plus a flame burns.",
    safety: [
      "Unknown combination — start micro-scale (a few drops)",
      "Default PPE: goggles, gloves, lab coat",
      "Never mix unknowns in a closed vessel",
    ],
    atomInventory,
    molarMasses: masses,
  };
}

export function balanceForWriteup(left: string[], right: string[]) {
  const inputs: SpeciesInput[] = [
    ...left.filter(Boolean).map((f) => ({ formula: f, side: "left" as const })),
    ...right.filter(Boolean).map((f) => ({ formula: f, side: "right" as const })),
  ];
  return balanceEquation(inputs);
}

export function ionicFor(left: string[], right: string[]): string | null {
  const known = matchKnowledge(left, right);
  return known?.ionic?.net ?? null;
}
