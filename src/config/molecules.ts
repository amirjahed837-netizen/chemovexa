import type { MolAtom, MolBond } from "@/lib/chem/molfile";

export type MoleculeCategory = "inorganic" | "hydrocarbon" | "organic" | "aromatic";

export type Molecule = {
  id: string;
  name: string;
  formula: string;
  category: MoleculeCategory;
  tags: string[];
  description: string;
  facts: string[];
  atoms: MolAtom[];
  bonds: MolBond[];
};

export const CATEGORY_LABEL: Record<MoleculeCategory, string> = {
  inorganic: "Inorganic",
  hydrocarbon: "Hydrocarbon",
  organic: "Organic",
  aromatic: "Aromatic",
};

function water(): Molecule {
  return {
    id: "water",
    name: "Water",
    formula: "H2O",
    category: "inorganic",
    tags: ["polar", "solvent", "bent"],
    description:
      "The universal solvent. Its bent geometry and strong hydrogen bonding give water its unusual properties — high boiling point, surface tension and excellent solvation of ions.",
    facts: ["Bent (V-shape)", "sp³ oxygen", "H–O–H angle 104.5°", "O–H bond 0.96 Å"],
    atoms: [
      { el: "O", x: 0, y: 0, z: 0 },
      { el: "H", x: 0.757, y: 0.586, z: 0 },
      { el: "H", x: -0.757, y: 0.586, z: 0 },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
    ],
  };
}

function ammonia(): Molecule {
  return {
    id: "ammonia",
    name: "Ammonia",
    formula: "NH3",
    category: "inorganic",
    tags: ["trigonal pyramidal", "lone pair", "base"],
    description:
      "A trigonal pyramid with one lone pair pushing the three N–H bonds together. That lone pair is what makes ammonia a weak base and a superb ligand for transition metals.",
    facts: ["Trigonal pyramidal", "sp³ nitrogen", "H–N–H angle 107°", "Lone pair on N"],
    atoms: [
      { el: "N", x: 0, y: 0, z: 0 },
      { el: "H", x: 0.951, y: 0, z: -0.381 },
      { el: "H", x: -0.476, y: 0.824, z: -0.381 },
      { el: "H", x: -0.476, y: -0.824, z: -0.381 },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
    ],
  };
}

function methane(): Molecule {
  const h = 1.087 / Math.sqrt(3);
  return {
    id: "methane",
    name: "Methane",
    formula: "CH4",
    category: "hydrocarbon",
    tags: ["tetrahedral", "alkane", "sp3"],
    description:
      "The simplest hydrocarbon and the textbook example of sp³ hybridisation — four equivalent σ bonds pointing to the corners of a tetrahedron.",
    facts: ["Perfect tetrahedron", "109.5° angles", "C–H bond 1.09 Å"],
    atoms: [
      { el: "C", x: 0, y: 0, z: 0 },
      { el: "H", x: h, y: h, z: h },
      { el: "H", x: h, y: -h, z: -h },
      { el: "H", x: -h, y: h, z: -h },
      { el: "H", x: -h, y: -h, z: h },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1],
    ],
  };
}

function co2(): Molecule {
  return {
    id: "co2",
    name: "Carbon Dioxide",
    formula: "CO2",
    category: "inorganic",
    tags: ["linear", "greenhouse gas", "double bond"],
    description:
      "Linear and non-polar despite its polar C=O bonds — the two bond dipoles cancel exactly. A greenhouse gas because it absorbs IR radiation through its vibrational modes.",
    facts: ["Linear 180°", "Two C=O double bonds", "C=O bond 1.16 Å", "Non-polar overall"],
    atoms: [
      { el: "O", x: -1.16, y: 0, z: 0 },
      { el: "C", x: 0, y: 0, z: 0 },
      { el: "O", x: 1.16, y: 0, z: 0 },
    ],
    bonds: [
      [0, 1, 2],
      [1, 2, 2],
    ],
  };
}

function ethene(): Molecule {
  return {
    id: "ethene",
    name: "Ethylene",
    formula: "C2H4",
    category: "hydrocarbon",
    tags: ["planar", "alkene", "pi bond"],
    description:
      "Flat as a pancake: each carbon is sp² hybridised, and the unhybridised p-orbitals overlap sideways to form the π bond that makes alkenes reactive.",
    facts: ["Planar", "sp² carbons", "H–C–H angle ~117°", "C=C bond 1.33 Å"],
    atoms: [
      { el: "C", x: -0.667, y: 0, z: 0 },
      { el: "C", x: 0.667, y: 0, z: 0 },
      { el: "H", x: -1.231, y: 0.927, z: 0 },
      { el: "H", x: -1.231, y: -0.927, z: 0 },
      { el: "H", x: 1.231, y: 0.927, z: 0 },
      { el: "H", x: 1.231, y: -0.927, z: 0 },
    ],
    bonds: [
      [0, 1, 2],
      [0, 2, 1],
      [0, 3, 1],
      [1, 4, 1],
      [1, 5, 1],
    ],
  };
}

function ethane(): Molecule {
  const rx = 0.364;
  const ry = 1.028;
  return {
    id: "ethane",
    name: "Ethane",
    formula: "C2H6",
    category: "hydrocarbon",
    tags: ["staggered", "alkane", "rotation"],
    description:
      "Two methyl groups joined by a freely rotating σ bond. The staggered conformation shown here is the energy minimum; eclipse it and torsional strain kicks in.",
    facts: ["Staggered conformation", "Free rotation about C–C", "C–C bond 1.54 Å"],
    atoms: [
      { el: "C", x: -0.77, y: 0, z: 0 },
      { el: "C", x: 0.77, y: 0, z: 0 },
      { el: "H", x: -0.77 - rx, y: ry, z: 0 },
      { el: "H", x: -0.77 - rx, y: -ry / 2, z: 0.89 },
      { el: "H", x: -0.77 - rx, y: -ry / 2, z: -0.89 },
      { el: "H", x: 0.77 + rx, y: -ry, z: 0 },
      { el: "H", x: 0.77 + rx, y: ry / 2, z: 0.89 },
      { el: "H", x: 0.77 + rx, y: ry / 2, z: -0.89 },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1],
      [1, 5, 1],
      [1, 6, 1],
      [1, 7, 1],
    ],
  };
}

function ethanol(): Molecule {
  return {
    id: "ethanol",
    name: "Ethanol",
    formula: "C2H5OH",
    category: "organic",
    tags: ["alcohol", "hydrogen bonding", "polar"],
    description:
      "The –OH group changes everything: unlike its cousin ethane, ethanol mixes with water in any ratio thanks to hydrogen bonding.",
    facts: ["Primary alcohol", "sp³ framework", "O–H bond 0.97 Å", "Hydrogen-bond donor & acceptor"],
    atoms: [
      { el: "C", x: 0, y: 0, z: 0 },
      { el: "C", x: 1.54, y: 0, z: 0 },
      { el: "O", x: 2.132, y: -1.303, z: 0 },
      { el: "H", x: 2.927, y: -0.747, z: 0 },
      { el: "H", x: -0.364, y: 0, z: 1.027 },
      { el: "H", x: -0.364, y: -0.889, z: -0.513 },
      { el: "H", x: -0.364, y: 0.889, z: -0.513 },
      { el: "H", x: 1.176, y: 0.234, z: 1.001 },
      { el: "H", x: 1.176, y: 0.234, z: -1.001 },
    ],
    bonds: [
      [0, 1, 1],
      [1, 2, 1],
      [2, 3, 1],
      [0, 4, 1],
      [0, 5, 1],
      [0, 6, 1],
      [1, 7, 1],
      [1, 8, 1],
    ],
  };
}

function aceticAcid(): Molecule {
  return {
    id: "acetic-acid",
    name: "Acetic Acid",
    formula: "CH3COOH",
    category: "organic",
    tags: ["carboxylic acid", "resonance", "weak acid"],
    description:
      "The acid of vinegar. The carboxyl group is stabilised by resonance, which is why it loses its proton only partially — a classic weak acid with Ka ≈ 1.8 × 10⁻⁵.",
    facts: ["Carboxyl group –COOH", "Resonance-stabilised", "Ka ≈ 1.8×10⁻⁵", "C=O bond 1.21 Å"],
    atoms: [
      { el: "C", x: 0, y: 0, z: 0 },
      { el: "C", x: 1.52, y: 0, z: 0 },
      { el: "O", x: 2.125, y: 1.048, z: 0 },
      { el: "O", x: 2.2, y: -1.178, z: 0 },
      { el: "H", x: 2.9, y: -0.507, z: 0 },
      { el: "H", x: -0.364, y: 0, z: 1.027 },
      { el: "H", x: -0.364, y: -0.888, z: -0.513 },
      { el: "H", x: -0.364, y: 0.888, z: -0.513 },
    ],
    bonds: [
      [0, 1, 1],
      [1, 2, 2],
      [1, 3, 1],
      [3, 4, 1],
      [0, 5, 1],
      [0, 6, 1],
      [0, 7, 1],
    ],
  };
}

function benzene(): Molecule {
  const atoms: MolAtom[] = [];
  const bonds: MolBond[] = [];
  const rC = 1.397;
  const rH = 2.481;
  for (let k = 0; k < 6; k++) {
    const th = (k * Math.PI) / 3;
    const c = Math.cos(th);
    const s = Math.sin(th);
    atoms.push({ el: "C", x: rC * c, y: rC * s, z: 0 });
    atoms.push({ el: "H", x: rH * c, y: rH * s, z: 0 });
    const next = (k + 1) % 6;
    bonds.push([k * 2, next * 2, k % 2 === 0 ? 2 : 1]);
    bonds.push([k * 2, k * 2 + 1, 1]);
  }
  return {
    id: "benzene",
    name: "Benzene",
    formula: "C6H6",
    category: "aromatic",
    tags: ["aromatic", "delocalized", "hexagon"],
    description:
      "Six carbons in a perfect hexagon, all bonds identical at 1.397 Å — halfway between single and double. The six π electrons are delocalised around the ring (drawn here as alternating Kekulé bonds).",
    facts: ["Planar hexagon", "sp² carbons, 120°", "All C–C equal 1.397 Å", "6 delocalised π electrons"],
    atoms,
    bonds,
  };
}

function cyclohexane(): Molecule {
  const atoms: MolAtom[] = [];
  const bonds: MolBond[] = [];
  const R = 1.52;
  const zs = [0.25, 0, -0.25, -0.25, 0, 0.25];
  for (let k = 0; k < 6; k++) {
    const th = (k * Math.PI) / 3;
    const ux = Math.cos(th);
    const uy = Math.sin(th);
    atoms.push({ el: "C", x: R * ux, y: R * uy, z: zs[k] });
  }
  for (let k = 0; k < 6; k++) {
    const axSign = k % 2 === 0 ? 1 : -1;
    const th = (k * Math.PI) / 3;
    const ux = Math.cos(th);
    const uy = Math.sin(th);
    atoms.push({
      el: "H",
      x: R * ux,
      y: R * uy,
      z: zs[k] + axSign * 1.09,
    });
    const eqLen = Math.hypot(ux, uy, -axSign * 0.34);
    atoms.push({
      el: "H",
      x: R * ux + (ux / eqLen) * 1.09,
      y: R * uy + (uy / eqLen) * 1.09,
      z: zs[k] + (-axSign * 0.34 * 1.09) / eqLen,
    });
  }
  for (let k = 0; k < 6; k++) bonds.push([k, (k + 1) % 6, 1]);
  for (let k = 0; k < 6; k++) {
    bonds.push([k, 6 + 2 * k, 1]);
    bonds.push([k, 7 + 2 * k, 1]);
  }
  return {
    id: "cyclohexane",
    name: "Cyclohexane",
    formula: "C6H12",
    category: "hydrocarbon",
    tags: ["chair", "conformation", "sp3 ring"],
    description:
      "Rings refuse to be flat: cyclohexane puckers into the chair conformation where every carbon keeps its ideal 109.5° angles. Watch the two flavours of hydrogen — axial (vertical) and equatorial (outward).",
    facts: ["Chair conformation", "Axial vs equatorial H", "No angle strain", "Ring-flips swap the two H types"],
    atoms,
    bonds,
  };
}

function bf3(): Molecule {
  return {
    id: "bf3",
    name: "Boron Trifluoride",
    formula: "BF3",
    category: "inorganic",
    tags: ["trigonal planar", "lewis acid", "electron deficient", "sp2"],
    description:
      "Three bonding domains, zero lone pairs: a perfect trigonal plane. Boron's empty p orbital is why BF₃ is the classic Lewis acid — it will grab an electron pair from almost anything that offers one.",
    facts: ["Perfect trigonal plane", "F–B–F angle 120°", "B–F bond 1.31 Å", "Empty p orbital → strong Lewis acid"],
    atoms: [
      { el: "B", x: 0, y: 0, z: 0 },
      { el: "F", x: 1.31, y: 0, z: 0 },
      { el: "F", x: -0.655, y: 1.134, z: 0 },
      { el: "F", x: -0.655, y: -1.134, z: 0 },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
    ],
  };
}

function pcl5(): Molecule {
  return {
    id: "pcl5",
    name: "Phosphorus Pentachloride",
    formula: "PCl5",
    category: "inorganic",
    tags: ["trigonal bipyramidal", "hypervalent", "axial vs equatorial"],
    description:
      "Five domains force the trigonal bipyramid: three chlorides in a plane, two more above and below. The axial bonds are longer and weaker than the equatorial ones — and in solution the molecule swaps them constantly (Berry pseudorotation).",
    facts: ["Trigonal bipyramidal", "Axial P–Cl 2.14 Å", "Equatorial P–Cl 2.02 Å", "90° and 120° angles"],
    atoms: [
      { el: "P", x: 0, y: 0, z: 0 },
      { el: "Cl", x: 2.02, y: 0, z: 0 },
      { el: "Cl", x: -1.01, y: 1.749, z: 0 },
      { el: "Cl", x: -1.01, y: -1.749, z: 0 },
      { el: "Cl", x: 0, y: 0, z: 2.14 },
      { el: "Cl", x: 0, y: 0, z: -2.14 },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1],
      [0, 5, 1],
    ],
  };
}

function sf6(): Molecule {
  const d = 1.56;
  return {
    id: "sf6",
    name: "Sulfur Hexafluoride",
    formula: "SF6",
    category: "inorganic",
    tags: ["octahedral", "hypervalent", "inert"],
    description:
      "Six identical S–F bonds pointing to the corners of an octahedron. Despite 'expanding the octet', SF₆ is so inert it is used as an electrical insulator — sterically shielded and kinetically lazy.",
    facts: ["Perfect octahedron", "F–S–F angle 90°", "S–F bond 1.56 Å", "Remarkably inert gas"],
    atoms: [
      { el: "S", x: 0, y: 0, z: 0 },
      { el: "F", x: d, y: 0, z: 0 },
      { el: "F", x: -d, y: 0, z: 0 },
      { el: "F", x: 0, y: d, z: 0 },
      { el: "F", x: 0, y: -d, z: 0 },
      { el: "F", x: 0, y: 0, z: d },
      { el: "F", x: 0, y: 0, z: -d },
    ],
    bonds: [
      [0, 1, 1],
      [0, 2, 1],
      [0, 3, 1],
      [0, 4, 1],
      [0, 5, 1],
      [0, 6, 1],
    ],
  };
}

function hexaammineCobalt(): Molecule {
  const atoms: MolAtom[] = [{ el: "Co", x: 0, y: 0, z: 0 }];
  const bonds: MolBond[] = [];
  const dCN = 1.96; // Co–N
  const dNH = 1.01; // N–H
  const ang = (107 * Math.PI) / 180; // H–N–Co
  const cosA = Math.cos(ang);
  const sinA = Math.sin(ang);
  const axes: Array<[number, number, number]> = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  for (const [ux, uy, uz] of axes) {
    const nIdx = atoms.length;
    atoms.push({ el: "N", x: dCN * ux, y: dCN * uy, z: dCN * uz });
    bonds.push([0, nIdx, 1]);
    // unit vector perpendicular to the Co–N axis
    const vx = ux !== 0 ? 0 : 1;
    const vy = ux !== 0 ? 1 : 0;
    const vz = 0;
    const cx = uy * vz - uz * vy;
    const cy = uz * vx - ux * vz;
    const cz = ux * vy - uy * vx;
    for (let k = 0; k < 3; k++) {
      const phi = (2 * Math.PI * k) / 3;
      const c = Math.cos(phi);
      const s = Math.sin(phi);
      const wx = -ux * cosA + (c * vx + s * cx) * sinA;
      const wy = -uy * cosA + (c * vy + s * cy) * sinA;
      const wz = -uz * cosA + (c * vz + s * cz) * sinA;
      atoms.push({
        el: "H",
        x: dCN * ux + dNH * wx,
        y: dCN * uy + dNH * wy,
        z: dCN * uz + dNH * wz,
      });
      bonds.push([nIdx, atoms.length - 1, 1]);
    }
  }
  return {
    id: "hexaamminecobalt-iii",
    name: "Hexaamminecobalt(III)",
    formula: "[Co(NH₃)₆]³⁺",
    category: "inorganic",
    tags: ["coordination complex", "octahedral", "low spin", "d6"],
    description:
      "The textbook Werner complex: six ammonia lone pairs donated into empty Co³⁺ orbitals, locking the metal into a perfect CoN₆ octahedron. Low-spin d⁶ and therefore diamagnetic — the exact geometry behind the crystal-field note.",
    facts: ["Octahedral CoN₆ core", "Co–N bond 1.96 Å", "Low-spin d⁶ — diamagnetic", "Δₒ ≈ 22 900 cm⁻¹ (yellow-orange)"],
    atoms,
    bonds,
  };
}

export const MOLECULES: Molecule[] = [
  water(),
  ammonia(),
  methane(),
  co2(),
  bf3(),
  pcl5(),
  sf6(),
  ethene(),
  ethane(),
  ethanol(),
  aceticAcid(),
  benzene(),
  cyclohexane(),
  hexaammineCobalt(),
];

export function getMolecule(id: string): Molecule | undefined {
  return MOLECULES.find((m) => m.id === id);
}
