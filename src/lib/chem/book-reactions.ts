import type { KnownReaction } from "./reaction";

// Curated reaction set distilled from McMurry, Organic Chemistry, 11th ed.
// Each entry mirrors the chapter's core chemistry ("Summary of Reactions"
// spirit) with balanceable molecular formulas.

export const BOOK_REACTIONS: KnownReaction[] = [
  // ---------- Chapter 3: Acids and Bases ----------
  {
    id: "ch3-acetic-acetate",
    chapter: "McMurry ch. 3 — Acids and Bases",
    left: ["CH3COOH", "NaOH"],
    right: ["CH3COONa", "H2O"],
    title: "Weak acid neutralized by hydroxide (pKa logic)",
    typeLabel: "Brønsted acid–base",
    mechanism:
      "Acetic acid (pKa 4.76) transfers its acidic proton to hydroxide. The equilibrium lies far to the right because water (pKa 15.7) is the weaker acid: ΔpKa ≈ 11 → K ≈ 10¹¹.",
    whatHappens:
      "OH⁻ deprotonates the carboxyl OH. The product acetate anion is resonance-stabilized over two oxygens, which is why acetic acid is far more acidic than an alcohol.",
    observation:
      "Warm, colorless solution; with phenolphthalein the endpoint is the faintest permanent pink. Sodium acetate crystallizes on evaporation.",
    ionic: {
      complete: "CH₃COOH(aq) + Na⁺(aq) + OH⁻(aq) → CH₃COO⁻(aq) + Na⁺(aq) + H₂O(l)",
      net: "CH₃COOH(aq) + OH⁻(aq) → CH₃COO⁻(aq) + H₂O(l)",
      note: "Book's rule: the stronger acid + stronger base → weaker acid + weaker base.",
    },
    conditions: "Aqueous, room temperature. Quantitative (K ≈ 10¹¹).",
    safety: ["Concentrated NaOH is caustic — goggles and gloves"],
  },
  {
    id: "ch3-ammonia-acid",
    chapter: "McMurry ch. 3 — Acids and Bases",
    left: ["HCl", "NH3"],
    right: ["NH4Cl"],
    title: "Ammonia protonated by a strong acid",
    typeLabel: "Brønsted acid–base (Lewis view too)",
    mechanism:
      "The lone pair on N attacks the proton of HCl — ammonia is both a Brønsted base (accepts H⁺) and the archetype Lewis base (donates an electron pair).",
    whatHappens:
      "HCl fully transfers its proton to NH₃ because Cl⁻ (conjugate base of a strong acid) is much weaker than NH₃ at holding a proton. NH₄⁺ and Cl⁻ assemble into the ionic solid ammonium chloride.",
    observation:
      "White fumes/solid smoke when gaseous NH₃ meets HCl gas — the classic 'ammonium chloride ring'. In solution: nothing dramatic, just a warm clear mixture.",
    ionic: {
      complete: "H⁺(aq) + Cl⁻(aq) + NH₃(aq) → NH₄⁺(aq) + Cl⁻(aq)",
      net: "NH₃(aq) + H⁺(aq) → NH₄⁺(aq)",
    },
    conditions: "Gas phase or aqueous; instantaneous either way.",
    safety: ["Both gases are irritating to eyes and airways — fume hood"],
  },

  // ---------- Chapter 6: Substitution & Elimination of Alkyl Halides ----------
  {
    id: "ch6-sn2",
    chapter: "McMurry ch. 6 — SN2 Substitution",
    left: ["CH3Br", "NaOH"],
    right: ["CH3OH", "NaBr"],
    title: "SN2: methyl bromide + hydroxide",
    typeLabel: "Bimolecular nucleophilic substitution",
    mechanism:
      "One concerted step: OH⁻ attacks the carbon from the side opposite to the leaving group (backside attack) while C–Br breaks. Rate = k[CH₃Br][OH⁻]. At a stereocenter the configuration inverts (Walden inversion).",
    whatHappens:
      "The nucleophile's electron pair forms the C–O bond as the C–Br bond breaks. Methyl and primary halides react fastest — no steric crowding in the transition state.",
    observation:
      "Nothing visible for a methyl halide in solution — kinetics are studied by measuring disappearance of nucleophile. Textbook example of inversion of configuration.",
    conditions: "Polar aprotic solvents (acetone, DMSO) accelerate SN2 dramatically.",
    safety: ["Alkyl halides are toxic and lachrymatory — fume hood"],
  },
  {
    id: "ch6-sn1",
    chapter: "McMurry ch. 6 — SN1 Substitution",
    left: ["C4H9Br", "H2O"],
    right: ["C4H9OH", "HBr"],
    title: "SN1: tert-butyl bromide solvolysis",
    typeLabel: "Unimolecular nucleophilic substitution",
    mechanism:
      "Two steps: (1) slow ionization to a planar tert-butyl carbocation + Br⁻ (rate = k[R–Br] only), (2) fast capture by water, then deprotonation. Racemization at a stereocenter because either face can be attacked.",
    whatHappens:
      "The C–Br bond breaks on its own — water's role comes only after the carbocation exists. The tertiary carbocation is stabilized by three methyl groups (hyperconjugation).",
    observation:
      "The mildly cloudy mixture turns homogeneous as the insoluble halide dissolves into soluble alcohol; AgNO₅ test on a sample gives AgBr promptly (free Br⁻ present).",
    conditions: "Polar protic solvent (water, ethanol); rate unaffected by [H₂O] excess.",
    safety: ["tert-Butyl bromide is volatile and irritant — fume hood"],
  },
  {
    id: "ch6-e2",
    chapter: "McMurry ch. 6 — E2 Elimination",
    left: ["C2H5Br", "KOH"],
    right: ["C2H4", "H2O", "KBr"],
    title: "E2: ethyl bromide + alcoholic KOH",
    typeLabel: "Bimolecular elimination",
    mechanism:
      "Base removes a β-H anti-periplanar to the leaving group in ONE concerted step; the C–H electrons swing in to form the π bond as Br⁻ departs. Rate = k[RBr][base].",
    whatHappens:
      "H and Br leave from adjacent carbons simultaneously, forming the C=C double bond. Strong, bulky bases (t-BuO⁻) push E2 over SN2; Zaitsev's rule predicts the more substituted alkene dominates.",
    observation:
      "When the gaseous alkene is collected, it decolorizes bromine water (orange → colorless) — the standard proof that a double bond formed.",
    conditions: "Ethanol as solvent (alcoholic KOH) + heat favors elimination over substitution.",
    safety: ["Hot caustic solutions — goggles; HBr fumes possible"],
  },

  // ---------- Chapter 7: Alkenes/Alkynes — synthesis ----------
  {
    id: "ch7-elimination-dehydrohalogenation",
    chapter: "McMurry ch. 7 — Alkene synthesis",
    left: ["C3H7Br", "KOH"],
    right: ["C3H6", "H2O", "KBr"],
    title: "Dehydrohalogenation of 1-bromopropane",
    typeLabel: "Elimination (alkene synthesis)",
    mechanism:
      "Alcoholic KOH abstracts a β-hydrogen; anti-periplanar E2 gives propene. For unsymmetrical halides Zaitsev's rule favors the more substituted (more stable) alkene.",
    whatHappens:
      "Single concerted step: C–H breaks as C=C forms as C–Br breaks. This is the standard route from an alkyl halide 'backwards' to an alkene.",
    observation:
      "Propene gas evolves on heating; decolorizes bromine solution and KMnO₄ (Baeyer test).",
    conditions: "Heated ethanolic KOH.",
    safety: ["Flammable propene gas — no flames near the outlet"],
  },
  {
    id: "ch7-hydrogenation",
    chapter: "McMurry ch. 7 — Catalytic hydrogenation",
    left: ["C2H4", "H2"],
    right: ["C2H6"],
    title: "Catalytic hydrogenation of ethene",
    typeLabel: "Reduction (synthesis)",
    mechanism:
      "Both H₂ and the alkene adsorb onto the metal surface (Pd, Pt, or Ni); the H–H bond splits into metal hydrides which add syn across the C=C before the alkane desorbs.",
    whatHappens:
      "The π bond consumes one equivalent of H₂. Syn addition: both hydrogens land on the same face — stereochemically important for cyclic alkenes.",
    observation:
      "Gas volume drops (H₂ consumed); heat released. In the lab a hydrogenated Pd/C suspension stays black — the catalyst is filtered off afterwards.",
    conditions: "Pd/C, Pt, or Raney Ni catalyst; 1 atm works for most alkenes.",
    safety: ["H₂ is flammable; Pd/C powder can ignite when dry — keep wet"],
  },

  // ---------- Chapter 8: Addition reactions of alkenes ----------
  {
    id: "ch8-hbr-addition",
    chapter: "McMurry ch. 8 — Electrophilic addition",
    left: ["C2H4", "HBr"],
    right: ["C2H5Br"],
    title: "Ionic addition of HBr to ethene",
    typeLabel: "Electrophilic addition",
    mechanism:
      "Step 1: the π electrons attack H⁺ → ethyl carbocation. Step 2: Br⁻ captures it. For unsymmetrical alkenes Markovnikov's rule: H goes to the carbon with MORE hydrogens (more stable cation forms).",
    whatHappens:
      "The electron-rich double bond acts as the nucleophile toward the proton. This is the defining reaction family of alkenes: π bond → two σ bonds.",
    observation:
      "Exothermic; a gas bubbled into a cooled tube of HBr condenses to the liquid bromoalkane.",
    conditions: "Dry, inert conditions; peroxides change the regiochemistry (Kharasch effect).",
    safety: ["HBr is corrosive and fuming — fume hood, gloves"],
  },
  {
    id: "ch8-bromine-water",
    chapter: "McMurry ch. 8 — Halogen addition (unsaturation test)",
    left: ["C2H4", "Br2"],
    right: ["C2H4Br2"],
    title: "Decolorization of bromine — the alkene test",
    typeLabel: "Electrophilic addition (qualitative test)",
    mechanism:
      "The π bond polarizes Br₂; a bromonium ion forms first, then Br⁻ attacks from the backside — anti addition, stereospecific.",
    whatHappens:
      "Br₂ adds across the double bond to give the vicinal dibromide. No catalyst needed — the alkene itself polarizes the halogen.",
    observation:
      "THE classic test: orange/brown bromine solution turns colorless within seconds (alkenes) but not with alkanes. The book uses this to distinguish saturated from unsaturated.",
    conditions: "Room temperature, CCl₄ or water as solvent; light inhibits radical side reactions.",
    safety: ["Bromine is severely corrosive — gloves, fume hood, never pipette by mouth"],
  },
  {
    id: "ch8-hydration",
    chapter: "McMurry ch. 8 — Acid-catalyzed hydration",
    left: ["C2H4", "H2O"],
    right: ["C2H5OH"],
    title: "Acid-catalyzed hydration of ethene",
    typeLabel: "Electrophilic addition (industrial ethanol)",
    mechanism:
      "Protonation of the alkene gives the carbocation; water attacks; deprotonation regenerates H₃O⁺. Markovnikov orientation. The acid is a catalyst — consumed then regenerated.",
    whatHappens:
      "Water adds across the double bond with OH ending on the more substituted carbon. Industrial route to ethanol (phosphoric acid beds, ~300 °C, high pressure).",
    observation:
      "Nothing dramatic visually — the process is an equilibrium driven by pressure and temperature.",
    conditions: "H₃PO₄ or H₂SO₄ catalyst; industrial: 300 °C, 60–70 atm.",
    safety: ["High-pressure equipment; hot concentrated acids"],
  },
  {
    id: "ch8-kmn04-diol",
    chapter: "McMurry ch. 8 — Syn dihydroxylation",
    left: ["C2H4", "KMnO4", "H2O"],
    right: ["C2H6O2", "MnO2", "KOH"],
    title: "Baeyer test / syn dihydroxylation (cold dilute KMnO₄)",
    typeLabel: "Oxidative addition",
    mechanism:
      "Cold, dilute, basic KMnO₄ adds two OH groups to the SAME face of the π bond via a cyclic manganate ester; Mn(VII) falls to Mn(IV) as MnO₂.",
    whatHappens:
      "The alkene becomes a cis-1,2-diol (glycol). Because MnO₂ (brown) forms, this doubles as the Baeyer unsaturation test — the alternative to bromine water.",
    observation:
      "Purple KMnO₄ decolorizes and a brown MnO₂ precipitate appears — positive test for a double bond. This is also the Wagner oxidation behind 1,2-butanediol synthesis.",
    conditions: "Cold (≤ 25 °C), dilute, mildly basic KMnO₄. Hot/concentrated → oxidative cleavage instead.",
    safety: ["KMnO₄ is a strong oxidizer — keep from organics; stains skin brown"],
  },
  {
    id: "ch8-ozonolysis-ethene",
    chapter: "McMurry ch. 8 — Ozonolysis",
    left: ["C2H4", "O3"],
    right: ["HCHO"],
    title: "Ozonolysis of ethene (C=C cleavage)",
    typeLabel: "Oxidative cleavage",
    mechanism:
      "Ozone adds as a molozonide which rearranges to an ozonide; reductive workup (Zn/H₂O or Me₂S) splits the C–C to carbonyls. Each alkene carbon becomes a C=O.",
    whatHappens:
      "The double bond is completely cut — the molecule's 'skeleton' is revealed by identifying the carbonyl pieces. Structural-diagnosis tool of classic organic analysis.",
    observation:
      "Ozone's blue tint disappears; the products are identified by 2,4-DNP or IR. Garlic-like dimethyl sulfide smell if Me₂S workup is used.",
    conditions: "O₃ in CH₂Cl₂ at −78 °C, then Zn/H₂O (reductive) or H₂O₂ (oxidative) workup.",
    safety: ["Ozone is highly toxic and a strong oxidizer — only in a hood"],
  },
  {
    id: "ch8-alkyne-hydrogenation",
    chapter: "McMurry ch. 8 — Alkyne hydrogenation",
    left: ["C2H2", "H2"],
    right: ["C2H6"],
    title: "Full hydrogenation of ethyne",
    typeLabel: "Reduction (two equivalents)",
    mechanism:
      "With Pd/C the alkyne takes up TWO equivalents of H₂ through the alkene stage — the alkene intermediate never accumulates because it hydrogenates faster than the alkyne.",
    whatHappens:
      "HC≡CH → CH₂=CH₂ → CH₃CH₃. To STOP at the alkene stage one uses Lindlar's poisoned catalyst (syn, cis) — key stereochemical distinction.",
    observation:
      "Two volumes of H₂ per volume of alkyne consumed. With Lindlar: cis-alkene isolated; with Na/NH₃: trans-alkene.",
    conditions: "Pd/C (full) vs Lindlar Pd/BaSO₄/quinoline (partial, cis).",
    safety: ["Acetylene is explosive above 2 atm — low-pressure apparatus only"],
  },

  {
    id: "ch8-wagner-butene",
    chapter: "McMurry ch. 8 — Wagner oxidation (Baeyer)",
    left: ["CH2=CH-CH2-CH3", "KMnO4", "H2O"],
    right: ["CH2(OH)-CH(OH)-CH2-CH3", "MnO2", "KOH"],
    title: "Wagner oxidation: 1-butene → 1,2-butanediol",
    typeLabel: "Syn dihydroxylation (redox)",
    mechanism:
      "Cold dilute KMnO₄ adds across the C=C through a cyclic manganate ester: both OH groups land on the SAME face (syn addition). Mn(VII) is reduced to Mn(IV), precipitating as brown MnO₂; KOH forms as the potassium salt.",
    whatHappens:
      "1-butene becomes 1,2-butanediol (butane-1,2-diol). This is the textbook Baeyer/Wagner oxidation — the reaction behind the purple→brown unsaturation test AND an industrial route to glycols.",
    observation:
      "The purple permanganate decolorizes and brown MnO₂ sludge settles. The diol itself is colorless and mixes with water. This exact reaction is a staple of Iranian university entrance exams.",
    conditions: "Cold (0–25 °C), dilute KMnO₄, mildly basic. Warm/concentrated → cleavage to acids instead.",
    safety: ["KMnO₄ stains skin brown and ignites organics when dry"],
  },

  // ---------- Chapter 10: Radicals ----------
  {
    id: "ch10-methane-chlorination",
    chapter: "McMurry ch. 10 — Radical halogenation",
    left: ["CH4", "Cl2"],
    right: ["CH3Cl", "HCl"],
    title: "Radical chlorination of methane",
    typeLabel: "Radical chain substitution",
    mechanism:
      "Three phases. Initiation: hν splits Cl₂ into Cl·. Propagation: Cl· abstracts H (gives HCl + CH₃·), then CH₃· + Cl₂ → CH₃Cl + Cl· (chain continues). Termination: two radicals combine.",
    whatHappens:
      "UV light replaces an H with Cl via neutral radicals — no carbocations, no polarity. Product mixture is statistical unless controlled; over-chlorination gives CH₂Cl₂, CHCl₃, CCl₄.",
    observation:
      "Gas mixture kept in the dark does nothing; a flash of sunlight triggers a (potentially explosive) reaction — the classic photochemical-demonstration experiment.",
    conditions: "hν (UV) or 250–400 °C; excess CH₄ limits polysubstitution.",
    safety: ["Cl₂ is toxic; mixtures of Cl₂ + CH₄ can explode in light — micro-scale only"],
  },

  // ---------- Chapter 11: Alcohols and ethers ----------
  {
    id: "ch11-alcohol-dehydration",
    chapter: "McMurry ch. 11 — Dehydration of alcohols",
    left: ["C2H5OH"],
    right: ["C2H4", "H2O"],
    title: "Acid-catalyzed dehydration of ethanol",
    typeLabel: "Elimination (alkene synthesis)",
    mechanism:
      "Protonation of OH turns it into a good leaving group (H₂O); E1 for secondary/tertiary (via carbocation), E2 for primary. Zaitsev product dominates; rearrangements possible with E1.",
    whatHappens:
      "The reverse of hydration: water is squeezed out of the alcohol to give the alkene. The same equilibrium, driven the other way by concentrated acid and heat.",
    observation:
      "Ethene gas bubbles off from the hot acid mixture; collected over water it decolorizes bromine water.",
    conditions: "Concentrated H₂SO₄ at 170 °C (or H₃PO₄ / Al₂O₃ at 350 °C).",
    safety: ["Hot concentrated acid — face shield; flammable ethanol"],
  },
  {
    id: "ch11-ether-synthesis",
    chapter: "McMurry ch. 11 — Williamson ether synthesis",
    left: ["CH3Br", "CH3ONa"],
    right: ["CH3OCH3", "NaBr"],
    title: "Williamson ether synthesis (SN2)",
    typeLabel: "Nucleophilic substitution",
    mechanism:
      "An alkoxide (strong nucleophile) displaces a primary halide by SN2. The alkoxide partner must be unhindered; the halide must be methyl/primary — otherwise E2 competes.",
    whatHappens:
      "The single most useful C–O bond-forming substitution: unsymmetrical ethers are assembled by choosing which side carries the leaving group and which the oxygen.",
    observation:
      "Dimethyl ether is a gas at room temperature — it simply escapes from the warm mixture; the salt stays behind.",
    conditions: "Primary halide + alkoxide in polar aprotic solvent; heat gentle.",
    safety: ["Alkoxides are strongly caustic; methyl bromide is highly toxic"],
  },
  {
    id: "ch11-esterification-fischer",
    chapter: "McMurry ch. 11 — Fischer esterification",
    left: ["CH3COOH", "C2H5OH"],
    right: ["CH3COOC2H5", "H2O"],
    title: "Fischer esterification: acetic acid + ethanol",
    typeLabel: "Condensation (addition–elimination)",
    mechanism:
      "Acid protonates the carbonyl → ethanol attacks → tetrahedral intermediate → water leaves → deprotonation. Every step reversible: Le Chatelier (excess alcohol or water removal) drives yield.",
    whatHappens:
      "The -OH of the acid is replaced by -OR of the alcohol. Ethyl acetate — the solvent-smelling ester — is the simplest example of the family.",
    observation:
      "A sweet, fruity smell (ethyl acetate, 'nail-polish remover' sweetness) appears from the warmed mixture — the nose is the detector here.",
    conditions: "Catalytic H₂SO₄, reflux; remove water or use excess alcohol for completion.",
    safety: ["Concentrated H₂SO₄ is violently corrosive; esters are flammable"],
  },

  // ---------- Chapter 12: Alcohols from carbonyls ----------
  {
    id: "ch12-grignard-methane",
    chapter: "McMurry ch. 12 — Grignard reagents (formation)",
    left: ["CH3Br", "Mg"],
    right: ["CH3MgBr"],
    title: "Grignard reagent formation",
    typeLabel: "Oxidative insertion (organometallic)",
    mechanism:
      "Magnesium metal inserts into the C–Br bond: electrons flow from Mg into the σ* orbital. The product is best written CH₃⁻MgBr⁺ — a carbanion equivalent and superb nucleophile/base.",
    whatHappens:
      "The C–Mg bond is polar (C δ−). Everything must be strictly anhydrous — water protonates the reagent instantly back to the alkane.",
    observation:
      "The ether solution turns cloudy grey and gently boils as Mg is consumed; a bright iodine crystal or 1,2-dibromoethane kick-starts a sluggish surface.",
    conditions: "Anhydrous diethyl ether or THF, N₂ atmosphere, scratch-clean Mg turnings.",
    safety: ["Et₂ ether is hyperflammable — no flames, ever; Grignards destroy skin moisture"],
  },
  {
    id: "ch12-grignard-h2o-quench",
    chapter: "McMurry ch. 12 — Grignard + water (destructive)",
    left: ["CH3MgBr", "H2O"],
    right: ["CH4", "Mg(OH)Br"],
    title: "Grignard quenched by water → alkane",
    typeLabel: "Acid–base (pKa ≈ 50 vs 16)",
    mechanism:
      "The methyl carbanion-equivalent rips a proton from water (pKa 15.7) — methane's pKa is ~50, so K is astronomically large. This is why glassware must be bone-dry.",
    whatHappens:
      "The very basic carbon gets protonated. Same logic applies to alcohols, amines, terminal alkynes — Grignards cannot coexist with any O–H or N–H.",
    observation:
      "Effervescence of methane as the reagent is destroyed; the ether solution loses its reactivity completely.",
    conditions: "Instantaneous even with trace moisture.",
    safety: ["Exothermic; pressurizes closed flasks with CH₄"],
  },
  {
    id: "ch12-reduction-liAlH4",
    chapter: "McMurry ch. 12 — LiAlH₄ reduction",
    left: ["HCHO", "LiAlH4", "H2O"],
    right: ["CH4O", "LiOH", "Al(OH)3"],
    title: "LiAlH₄ reduces formaldehyde (hydride delivery)",
    typeLabel: "Nucleophilic reduction",
    mechanism:
      "AlH₄⁻ delivers H⁻ (a hydride, H with two electrons) to the electrophilic carbonyl carbon; the workup (H₃O⁺) protonates the alkoxide. Aldehydes → 1° alcohols; ketones → 2°.",
    whatHappens:
      "Hydride is the nucleophile, not H⁺. LiAlH₄ is the 'big hammer' — reduces acids, esters, amides too; NaBH₄ is the gentler alternative (aldehydes/ketones only).",
    observation:
      "Vigorous gas evolution during the water workup (H₂ from residual hydride) — add the quench slowly, in the hood.",
    conditions: "Anhydrous ether/THF for the reduction; aqueous acid workup AFTER.",
    safety: [
      "LiAlH₄ + water = fire/explosion — quench dropwise on ice",
      "Never add water to bulk hydride",
    ],
  },
  {
    id: "ch12-hydrogenation-aldehyde",
    chapter: "McMurry ch. 12 — Catalytic reduction of formaldehyde",
    left: ["HCHO", "H2"],
    right: ["CH3OH"],
    title: "Catalytic hydrogenation of formaldehyde → methanol",
    typeLabel: "Reduction",
    mechanism:
      "H₂ adds across the C=O on a Ni/Pt/Pd surface — same surface chemistry as alkene hydrogenation, but carbonyls need higher pressure/temperature.",
    whatHappens:
      "The C=O π bond takes two hydrogens: one lands on carbon, one on oxygen. Formaldehyde → methanol is the simplest carbonyl hydrogenation.",
    observation:
      "Gas uptake in the burette; in industry, continuous gas-phase over a Cu/ZnO bed.",
    conditions: "Ni, Pt or Pd catalyst; typically elevated T/P for carbonyls.",
    safety: ["Pressurized H₂ — rated equipment only"],
  },

  // ---------- Chapter 13-14: Aromatics ----------
  {
    id: "ch14-aromatic-hydrogenation",
    chapter: "McMurry ch. 14 — Aromatic hydrogenation (resistance)",
    left: ["C6H6", "H2"],
    right: ["C6H12"],
    title: "Forced hydrogenation of benzene",
    typeLabel: "Reduction (aromatic ring)",
    mechanism:
      "The aromatic stabilization (~150 kJ/mol) makes the ring refuse normal alkene hydrogenation; only harsh catalytic conditions add 3 H₂. Kekulé's delocalized π sextet must be broken three times.",
    whatHappens:
      "Benzene → cyclohexane, the industrially vital step (nylon feedstock). The huge H₂ demand (3 mol per mol) reflects the three π bonds.",
    observation:
      "Uptake of 3 equivalents H₂ only at high T/P — the very reluctance IS the evidence for aromaticity.",
    conditions: "Ni or Pt catalyst, ~200 °C, elevated H₂ pressure.",
    safety: ["Benzene is a proven carcinogen — strict hood discipline"],
  },

  // ---------- Chapter 15: Electrophilic aromatic substitution ----------
  {
    id: "ch15-nitration",
    chapter: "McMurry ch. 15 — EAS: nitration",
    left: ["C6H6", "HNO3"],
    right: ["C6H5NO2", "H2O"],
    title: "Nitration of benzene (nitronium electrophile)",
    typeLabel: "Electrophilic aromatic substitution",
    mechanism:
      "H₂SO₄ generates NO₂⁺ from HNO₃. The ring's π electrons attack NO₂⁺ → sigma complex (arenium ion) → H⁺ leaves, restoring aromaticity. Rate-determining: formation of the sigma complex.",
    whatHappens:
      "Hydrogen on the ring is swapped for NO₂. The three-step logic (electrophile generation, attack, deprotonation) is the template for ALL EAS reactions.",
    observation:
      "The mixture must be kept ~50 °C: too cold = no reaction, too hot = dinitration. Nitrobenzene is the pale-yellow, almond-smelling product.",
    conditions: "HNO₃ + H₂SO₄ ('mixed acid'), 40–60 °C.",
    safety: [
      "Mixed acid is violently corrosive — add acid to benzene dropwise, ice bath ready",
      "Exotherm control is critical",
    ],
  },
  {
    id: "ch15-bromination",
    chapter: "McMurry ch. 15 — EAS: bromination",
    left: ["C6H6", "Br2"],
    right: ["C6H5Br", "HBr"],
    title: "Bromination of benzene (Lewis acid catalyzed)",
    typeLabel: "Electrophilic aromatic substitution",
    mechanism:
      "FeBr₃ polarizes Br₂ → Br⁺-like electrophile. Ring attacks → sigma complex → FeBr₄⁻ removes the H⁺. Without the catalyst benzene ignores bromine (contrast with alkenes!).",
    whatHappens:
      "Aromatic rings are nucleophiles so sluggish that only a Lewis acid makes Br₂ electrophilic enough. The by-product HBr gas escapes, pulling the equilibrium along.",
    observation:
      "Decolorization of the bromine + white HBr fumes at the mouth of the flask. (An uncatalyzed alkene would have done this instantly — aromaticity's price.)",
    conditions: "FeBr₃ (or AlBr₃) catalytic, anhydrous.",
    safety: ["Br₂ corrosive; HBr fumes — hood"],
  },
  {
    id: "ch15-friedel-crafts",
    chapter: "McMurry ch. 15 — Friedel–Crafts alkylation",
    left: ["C6H6", "CH3Cl"],
    right: ["C6H5CH3", "HCl"],
    title: "Friedel–Crafts methylation → toluene",
    typeLabel: "Electrophilic aromatic substitution (C–C bond)",
    mechanism:
      "AlCl₃ abstracts Cl⁻ → CH₃⁺ (or tight ion pair) electrophile; ring attacks; H⁺ deprotonated by AlCl₄⁻. The methyl group activates the ring, so polyalkylation must be controlled by excess benzene.",
    whatHappens:
      "The only common EAS that builds a C–C bond directly onto the ring. Carbocation rearrangements and ring deactivation by NH₂/NR₂ groups limit its use.",
    observation:
      "HCl gas fumes evolve; toluene co-distils with excess benzene. Product is more reactive than starting material — hence over-alkylation risk.",
    conditions: "Anhydrous AlCl₃ (stoichiometric or catalytic); dry everything.",
    safety: ["AlCl₃ fumes violently in moist air; HCl gas — hood"],
  },

  // ---------- Chapter 16: Aldehydes & ketones ----------
  {
    id: "ch16-cyanohydrin",
    chapter: "McMurry ch. 16 — Nucleophilic addition",
    left: ["HCHO", "HCN"],
    right: ["C2H3NO"],
    title: "Cyanohydrin formation (HCHO + HCN)",
    typeLabel: "Nucleophilic addition to C=O",
    mechanism:
      "CN⁻ (from KCN catalytic) attacks the carbonyl carbon; the alkoxide grabs H⁺ from HCN — which regenerates CN⁻ (catalytic cycle). Racemic product at a new stereocenter.",
    whatHappens:
      "Cyanide adds one carbon AND a new OH — cyanohydrins are launch pads to α-hydroxy acids and amino acids (Strecker).",
    observation:
      "Equilibrium-driven: needs pH ~5 to balance CN⁻ availability vs HCN safety (still toxic!).",
    conditions: "pH 4–5 buffer; KCN catalytic with HCN present.",
    safety: [
      "HCN/KCN are among the deadliest common chemicals (HCN gas) — strictly hood, antidote kit on hand",
      "Never acidify cyanide waste outside controlled conditions",
    ],
  },
  {
    id: "ch16-hydrazine-hydrazone",
    chapter: "McMurry ch. 16 — Hydrazone formation",
    left: ["HCHO", "N2H4"],
    right: ["CH2NNH2", "H2O"],
    title: "Hydrazone formation from formaldehyde",
    typeLabel: "Addition–elimination (imine family)",
    mechanism:
      "N attacks C=O → carbinolamine → proton transfers → water eliminated → C=N. Acid catalyzes BOTH steps mildly (too much acid protonates the nucleophile and kills it).",
    whatHappens:
      "Primary amines (and hydrazine derivatives) condense with aldehydes/ketones. Hydrazones crystallize beautifully — classic derivative-preparation for identifying unknown carbonyls.",
    observation:
      "Water forms as the condensation by-product; hydrazones are often yellow crystalline solids with sharp melting points.",
    conditions: "Mild acid (pH ~4.5), removal of water drives equilibrium.",
    safety: ["Hydrazine is toxic and potentially carcinogenic — gloves, hood"],
  },

  // ---------- Chapter 17: Carboxylic acids & derivatives ----------
  {
    id: "ch17-acid-chloride",
    chapter: "McMurry ch. 17 — Acid chloride synthesis",
    left: ["CH3COOH", "SOCl2"],
    right: ["CH3COCl", "SO2", "HCl"],
    title: "Acid chloride from carboxylic acid (SOCl₂)",
    typeLabel: "Nucleophilic acyl substitution",
    mechanism:
      "The acid OH attacks SOCl₂ → chlorosulfite intermediate → Cl⁻ displaces it; gaseous SO₂ and HCl leave, which pulls the equilibrium completely to products.",
    whatHappens:
      "Two gases escape = reaction goes to completion with no purification trickery. Acid chlorides are the most reactive carboxylic derivatives — gateways to esters, amides, anhydrides.",
    observation:
      "Copious fumes (HCl + SO₂), often yellow-brown; the product is distilled off. The gaseous by-products are the point — textbook Le Chatelier.",
    conditions: "SOCl₂ neat or in ether, reflux, catalytic DMF accelerates.",
    safety: ["SOCl₂ + moisture = HCl/SO₂ fumes; corrosive to lungs — strict hood"],
  },
  {
    id: "ch17-ester-from-acylchloride",
    chapter: "McMurry ch. 17 — Ester from acid chloride",
    left: ["CH3COCl", "C2H5OH"],
    right: ["CH3COOC2H5", "HCl"],
    title: "Ester synthesis via acid chloride (faster than Fischer)",
    typeLabel: "Nucleophilic acyl substitution",
    mechanism:
      "Alcohol attacks the acyl chloride's carbonyl → tetrahedral intermediate → Cl⁻ leaves → deprotonation by pyridine/alcohol. Irreversible because HCl (base-trapped) and Cl⁻ are poor re-attacking nucleophiles.",
    whatHappens:
      "The high-energy acid chloride route beats Fischer esterification when equilibrium is unfavorable: no water is produced to reverse the reaction, just HCl gas.",
    observation:
      "Immediate, exothermic, fruity ester smell; HCl fumes trapped by the pyridine or a base wash.",
    conditions: "0–25 °C, dry solvent, pyridine or triethylamine to mop up HCl.",
    safety: ["Acyl chlorides are lachrymators; HCl evolution — hood, gloves"],
  },
  {
    id: "ch17-amide-formation",
    chapter: "McMurry ch. 17 — Amide from acid chloride",
    left: ["CH3COCl", "NH3"],
    right: ["CH3CONH2", "HCl"],
    title: "Acetamide from acetyl chloride + ammonia",
    typeLabel: "Nucleophilic acyl substitution",
    mechanism:
      "NH₃ attacks the acyl carbon → tetrahedral intermediate → Cl⁻ leaves → excess NH₃ neutralizes the HCl. Two equivalents of ammonia needed (one as nucleophile, one as base).",
    whatHappens:
      "The amide bond — the bond of proteins (peptide bond is exactly this, biosynthetically). Acid chlorides → amides is the sharpest tool for making them in the lab.",
    observation:
      "White smoke of NH₄Cl when NH₃ gas meets the HCl by-product; acetamide crystallizes from water/ethanol.",
    conditions: "Excess NH₃ (aq or gas), low temperature to control exotherm.",
    safety: ["NH₃ is caustic and choking; exotherm control"],
  },
  {
    id: "ch17-anhydride-hydrolysis",
    chapter: "McMurry ch. 17 — Anhydride hydrolysis",
    left: ["C4H6O3", "H2O"],
    right: ["CH3COOH"],
    title: "Acetic anhydride hydrolyzed by water",
    typeLabel: "Nucleophilic acyl substitution",
    mechanism:
      "Water attacks one carbonyl; the other acetate leaves as the leaving group. Anhydrides sit between acid chlorides (too reactive) and esters (too tame) in the reactivity ladder.",
    whatHappens:
      "Water splits the O-bridge, giving two acid molecules. The same reaction happens slowly with atmospheric moisture — that is why anhydride bottles must be sealed.",
    observation:
      "Vinegar smell intensifies (acetic acid released); mild warming. Very slow in cold water — heated acid catalysis speeds it.",
    conditions: "Water alone eventually; H⁺ or OH⁻ catalysis standard.",
    safety: ["Vapors irritate eyes; acetic anhydride is a watched precursor — handle per regulations"],
  },

  // ---------- Chapter 18: Enols/enolates ----------
  {
    id: "ch18-aldol",
    chapter: "McMurry ch. 18 — Aldol reaction",
    left: ["CH3CHO", "CH3CHO"],
    right: ["CH3CH(OH)CH2CHO"],
    title: "Aldol reaction of acetaldehyde",
    typeLabel: "Enolate C–C bond formation",
    mechanism:
      "OH⁻ removes an α-H → enolate; the enolate's carbon attacks another acetaldehyde's C=O → alkoxide → protonation. β-hydroxy aldehyde (aldol) results; heat dehydrates it to the enal.",
    whatHappens:
      "One molecule plays nucleophile (its α-carbon), another electrophile (its carbonyl). The most important C–C bond-builder of carbonyl chemistry — and the gateway to the aldol condensation.",
    observation:
      "The aldol product dehydrates on heating to crotonaldehyde (alpha,beta-unsaturated) — iodine or acid accelerates the dehydration visibly.",
    conditions: "Catalytic NaOH in water/ethanol, cold for aldol, hot for condensation.",
    safety: ["Acetaldehyde is volatile, flammable, and a suspected carcinogen"],
  },
  {
    id: "ch18-halogenation-alpha",
    chapter: "McMurry ch. 18 — Alpha halogenation",
    left: ["C2H4O", "Br2"],
    right: ["C2H3OBr", "HBr"],
    title: "α-Bromination of acetaldehyde (enol pathway)",
    typeLabel: "Substitution at α-carbon",
    mechanism:
      "Acid catalysis: carbonyl O is protonated → enol forms → the C=C of the enol attacks Br₂ → H⁺ regenerated. Rate depends on [ketone], not [Br₂] — the enol is made slowly, then reacts instantly.",
    whatHappens:
      "One α-hydrogen is replaced by Br. In base with methyl ketones it runs to completion (haloform reaction) — the iodoform test's engine.",
    observation:
      "Bromine color vanishes at a rate independent of Br₂ concentration — kinetic evidence for rate-limiting enolization (the book's favorite mechanistic detective story).",
    conditions: "Acid catalysis (AcOH); one equivalent Br₂ for mono-substitution.",
    safety: ["Bromine corrosive; HBr fumes"],
  },

  // ---------- Chapter 19: Condensations ----------
  {
    id: "ch19-claisen",
    chapter: "McMurry ch. 19 — Claisen condensation",
    left: ["CH3COOC2H5", "CH3COOC2H5"],
    right: ["CH3COCH2COOC2H5", "C2H5OH"],
    title: "Claisen condensation of ethyl acetate",
    typeLabel: "Enolate + ester condensation",
    mechanism:
      "Ethoxide removes an α-H → ester enolate; enolate attacks another ester's carbonyl → tetrahedral intermediate → EtO⁻ expelled → β-keto ester. The LAST deprotonation (active methylene, pKa ~11) makes the reaction effectively irreversible.",
    whatHappens:
      "Two ester molecules merge into a β-keto ester — the workhorse for building 1,3-dicarbonyl skeletons (acetoacetic ester synthesis of ketones).",
    observation:
      "Requires a FULL equivalent of base (not catalytic) because the product is deprotonated; acid workup releases the neutral β-keto ester.",
    conditions: "NaOEt in EtOH (must match the ester's alkoxy group), then H₃O⁺.",
    safety: ["Sodium ethoxide is caustic and flammable"],
  },
  {
    id: "ch19-michael",
    chapter: "McMurry ch. 19 — Michael (conjugate) addition",
    left: ["CH2=CHCOCH3", "CH3CHO"],
    right: ["CH3CH(CH2CHO)COCH3"],
    title: "Michael addition of acetaldehyde enolate to MVK",
    typeLabel: "Conjugate (1,4) addition",
    mechanism:
      "An enolate attacks the β-carbon of an α,β-unsaturated carbonyl; the π electrons shift onto oxygen (enolate product), then protonation. 1,4- vs 1,2-selectivity is controlled by organocuprates (1,4) vs Grignards (1,2).",
    whatHappens:
      "The C–C bond forms at the β-carbon, not the carbonyl carbon — conjugate addition. The Michael reaction is a pillar of Robinson annulation and countless syntheses.",
    observation:
      "The enone's conjugation (UV-active, often yellow) disappears as the saturated ketone forms — the color fades.",
    conditions: "Base catalysis (OH⁻, RO⁻, amines); mild conditions.",
    safety: ["Methyl vinyl ketone is toxic and a strong Michael acceptor (alkylates biological nucleophiles) — hood, gloves"],
  },

  // ---------- Chapter 20: Amines ----------
  {
    id: "ch20-amide-reduction",
    chapter: "McMurry ch. 20 — Amine synthesis (reduction)",
    left: ["CH3CONH2", "LiAlH4", "H2O"],
    right: ["C2H7N", "LiOH", "Al(OH)3"],
    title: "Amide → amine with LiAlH₄",
    typeLabel: "Reduction (C=O deoxygenation)",
    mechanism:
      "Hydride adds to the acyl carbon; the oxygen leaves as an aluminate; the resulting iminium ion takes a second hydride → amine. The carbonyl oxygen is removed entirely.",
    whatHappens:
      "Unlike esters/acids (which give alcohols), amides reduce all the way to amines — the C=O is replaced by two H's. Primary route from carboxylic acids to amines.",
    observation:
      "Vigorous aqueous workup (H₂ evolution); the free amine is distilled or extracted as its HCl salt.",
    conditions: "LiAlH₄ in ether, then careful H₂O/NaOH quench.",
    safety: ["Standard hydride discipline — quench slowly, hood"],
  },
  {
    id: "ch20-diazotization",
    chapter: "McMurry ch. 20 — Diazonium salt & Sandmeyer door",
    left: ["C6H7N", "HNO2", "HCl"],
    right: ["C6H5N2Cl", "H2O"],
    title: "Diazotization of aniline",
    typeLabel: "Nitrosation",
    mechanism:
      "NaNO₂ + HCl makes NO⁺ (nitrosonium); aniline attacks → N-nitrosamine → proton transfers → N₂⁺ leaves as the diazonium group. The product is stable only cold.",
    whatHappens:
      "Ar–N₂⁺ is organic chemistry's leaving-group Swiss army knife: N₂ gas departs, replaced by Cl, Br, CN, OH, H, I... — the bridge from aniline to almost any aryl target.",
    observation:
      "The solution must stay at 0–5 °C: warm diazonium salts decompose (sometimes explosively) releasing N₂.",
    conditions: "0–5 °C, aqueous acid, use the diazonium salt immediately.",
    safety: [
      "Dry diazonium salts can detonate — never isolate them dry",
      "Aromatic amines are carcinogenic — gloves",
    ],
  },

  // ---------- Chapter 21: Phenols / aryl halides ----------
  {
    id: "ch21-phenol-synthesis-dow",
    chapter: "McMurry ch. 21 — Dow process (chlorobenzene → phenol)",
    left: ["C6H5Cl", "NaOH"],
    right: ["C6H5OH", "NaCl"],
    title: "Dow process: chlorobenzene + NaOH",
    typeLabel: "Nucleophilic aromatic substitution (benzyne SNAr)",
    mechanism:
      "Ordinary SN1/SN2 is impossible on sp² aryl carbon; at 350 °C/300 atm the base eliminates HCl to a benzyne intermediate, which OH⁻ then adds across. Harsh — that is the point about aryl chlorides' inertness.",
    whatHappens:
      "The C–Cl bond of chlorobenzene, famously unreactive toward nucleophiles, finally yields under extreme conditions via the benzyne mechanism (proven by ¹⁴C labeling).",
    observation:
      "Industrial: steel reactors at 360 °C. Laboratory evidence for benzyne comes from trapped adducts, not a bench observation.",
    conditions: "350 °C, 300 atm, aqueous NaOH (historical Dow process).",
    safety: ["High-pressure caustic at high temperature — industrial equipment only"],
  },

  // ---------- Chapter 22: Carbohydrates ----------
  {
    id: "ch22-glucose-fermentation",
    chapter: "McMurry ch. 22 — Fermentation",
    left: ["C6H12O6"],
    right: ["C2H6O", "CO2"],
    title: "Fermentation of glucose (Zymase pathway)",
    typeLabel: "Biochemical degradation",
    mechanism:
      "Enzyme cascade (glycolysis + pyruvate decarboxylase + alcohol dehydrogenase): glucose → 2 pyruvate → 2 acetaldehyde + CO₂ → 2 ethanol. Net: the sugar's energy is banked as ATP along the way.",
    whatHappens:
      "The oldest biotechnology: one hexose becomes two ethanols + two CO₂. The reaction powers baking (CO₂ leavens) and brewing (ethanol) simultaneously.",
    observation:
      "Froth of CO₂ bubbles; the sweet solution turns less sweet and takes on the alcohol smell. Limewater turns milky with the escaping CO₂.",
    conditions: "Yeast (zymase complex), 25–35 °C, anaerobic; poisoned above ~15 % ethanol.",
    safety: ["CO₂ buildup in closed fermenters — never lean over a fermenting vessel"],
  },
  {
    id: "ch22-glucose-tollens",
    chapter: "McMurry ch. 22 — Tollens' silver mirror test",
    left: ["C6H12O6", "Ag2O"],
    right: ["C6H12O7", "Ag"],
    title: "Tollens'/Benedict's oxidation of glucose",
    typeLabel: "Mild oxidation (reducing sugar test)",
    mechanism:
      "The hemiacetal equilibrium supplies a trace of open-chain aldehyde; Ag(I) (or Cu²⁺ in Benedict's) oxidizes the aldehyde to the acid while being reduced to metallic silver (or brick-red Cu₂O).",
    whatHappens:
      "'Reducing sugars' reduce metal ions because their open-chain form keeps re-supplying the aldehyde. Fructose also passes (tautomerizes to glucose under base) — the test is for the enediol, strictly.",
    observation:
      "A brilliant silver MIRROR deposits on clean glass (Tollens') or a brick-red precipitate (Benedict's) — the two most beautiful positive tests in the course.",
    conditions: "Ammoniacal Ag₂O (Tollens) or alkaline Cu²⁺ citrate (Benedict's), warm.",
    safety: ["Tollens' reagent must be discarded after use — standing solution forms explosive silver nitride"],
  },

  // ---------- Chapter 23: Lipids ----------
  {
    id: "ch23-saponification",
    chapter: "McMurry ch. 23 — Saponification",
    left: ["C17H35COOCH3", "NaOH"],
    right: ["C17H35COONa", "CH3OH"],
    title: "Saponification (soap from fat)",
    typeLabel: "Ester hydrolysis (base)",
    mechanism:
      "OH⁻ attacks each ester carbonyl of the triglyceride; the tetrahedral intermediate expels the glycerol alkoxide. Three soap molecules + glycerol per fat molecule (abridged here to one ester arm).",
    whatHappens:
      "Base cleaves the ester bonds of a fat (triglyceride). The sodium carboxylate salts are soaps: a hydrophobic tail + hydrophilic head, the original surfactant.",
    observation:
      "The oily layer emulsifies into the aqueous phase on heating with NaOH; on cooling with brine, soap precipitates ('salting out').",
    conditions: "Concentrated NaOH, ethanol/water, reflux 30–60 min.",
    safety: ["Hot caustic — burns skin; ethanol present = flammable"],
  },

  // ---------- Chapter 24: Amino acids & proteins ----------
  {
    id: "ch24-peptide-bond",
    chapter: "McMurry ch. 24 — Peptide bond formation",
    left: ["NH2CH2COOH", "NH2CH2COOH"],
    right: ["NH2CH2CONHCH2COOH", "H2O"],
    title: "Glycylglycine — the peptide bond",
    typeLabel: "Condensation (amide formation)",
    mechanism:
      "The carboxyl of one glycine is activated (in the lab via DCC or acid chlorides; in the ribosome via aminoacyl-tRNA), then the next amino acid's NH₂ attacks, water (or activator) leaves → the CO–NH amide.",
    whatHappens:
      "Two glycines join head-to-tail: glycylglycine + water. Repeated hundreds of times, this single condensation pattern builds every protein on Earth.",
    observation:
      "In water the direct condensation is hopelessly unfavorable — the lab uses coupling reagents; the body spends ATP. Product detected by ninhydrin (purple).",
    conditions: "DCC coupling in organic solvent, or enzymatic on the ribosome.",
    safety: ["DCC is a skin sensitizer (severe) — double gloves"],
  },
  {
    id: "ch24-strecker",
    chapter: "McMurry ch. 24 — Strecker amino acid synthesis",
    left: ["CH3CHO", "NH3", "HCN"],
    right: ["CH3CH(NH2)CN", "H2O"],
    title: "Strecker synthesis of alanine precursor",
    typeLabel: "Multi-component condensation",
    mechanism:
      "NH₃ + HCN ⇌ NH₄⁺CN⁻ sets up the domino: NH₃ attacks the aldehyde → imine; CN⁻ then attacks the imine carbon → α-aminonitrile; acid hydrolysis of the nitrile delivers the α-amino acid (alanine here).",
    whatHappens:
      "One-pot construction of an amino acid from aldehyde + ammonia + cyanide — the classic 1850 Strecker route, still the cheapest industrial path to α-amino acids.",
    observation:
      "The aminonitrile often crystallizes from the reaction mixture; hydrolysis needs strong acid and reflux before the amino acid shows up (ninhydrin-positive).",
    conditions: "NH₃/NH₄Cl buffer with KCN, then H₃O⁺ reflux for hydrolysis.",
    safety: [
      "HCN hazard as with all cyanide chemistry — strictly hood",
      "Two deadly reagents (HCN + NH₃ fumes) in one flask — plan the quench",
    ],
  },
];
