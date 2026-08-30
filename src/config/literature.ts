export type SourceKind = "textbook" | "reference" | "web";
export type SourceStatus = "reading" | "consult" | "planned";

export type Source = {
  id: string;
  title: string;
  author: string;
  kind: SourceKind;
  status: SourceStatus;
  edition?: string;
  year?: number;
  progress?: string;
  rating?: number;
  spineColor: string;
  why: string;
  topics: string[];
  url?: string;
};

export const STATUS_LABEL: Record<SourceStatus, string> = {
  reading: "Currently reading",
  consult: "Reference shelf",
  planned: "On the wishlist",
};

export const SOURCES: Source[] = [
  {
    id: "mcmurry",
    title: "Organic Chemistry",
    author: "John E. McMurry",
    kind: "textbook",
    status: "reading",
    edition: "9th ed.",
    year: 2016,
    progress: "Ch. 1–6 · mechanisms & substitution",
    rating: 5,
    spineColor: "from-cyan-600 to-blue-800",
    why: "The course backbone. McMurry's 'map' of organic chemistry — grouping reactions by how they're made rather than by functional group — changed how I see synthesis. Currently living in the substitution/elimination chapters.",
    topics: ["mechanisms", "synthesis", "spectroscopy", "stereochemistry"],
  },
  {
    id: "levine",
    title: "Physical Chemistry",
    author: "Ira N. Levine",
    kind: "textbook",
    status: "reading",
    edition: "6th ed.",
    year: 2009,
    progress: "Ch. 1–4 · thermo & entropy",
    rating: 5,
    spineColor: "from-indigo-600 to-violet-800",
    why: "The rigor counterpart to McMurry. Levine derives everything instead of asserting it, and the margin notes on common misconceptions are worth the price alone. My second-law notes on this site are straight from chapters 3–4.",
    topics: ["thermodynamics", "entropy", "equilibrium", "kinetics"],
  },
  {
    id: "miessler",
    title: "Inorganic Chemistry",
    author: "Gary L. Miessler, Paul J. Fischer, Donald A. Tarr",
    kind: "textbook",
    status: "consult",
    edition: "5th ed.",
    year: 2014,
    rating: 4,
    spineColor: "from-fuchsia-600 to-purple-900",
    why: "Where I go when bonding gets quantum. Miessler builds inorganic chemistry bottom-up from symmetry and molecular orbitals — the group-theory-first approach makes ligand-field and MO diagrams for transition-metal complexes feel derived rather than asserted.",
    topics: ["group theory", "MO theory", "coordination chemistry", "organometallics"],
  },
  {
    id: "shriver-atkins",
    title: "Inorganic Chemistry",
    author: "Peter Atkins, Tina Overton, Jonathan Rourke, Mark Weller, Fraser Armstrong",
    kind: "textbook",
    status: "consult",
    edition: "5th ed.",
    year: 2010,
    rating: 4,
    spineColor: "from-rose-600 to-rose-900",
    why: "The systems-level counterpart to Miessler — organized by what compounds do rather than only how they're built. Stronger on descriptive chemistry, industrial processes and the solid state, with end-of-chapter problems that genuinely bite.",
    topics: ["descriptive chemistry", "solid state", "redox", "bioinorganic"],
  },
  {
    id: "solomons",
    title: "Organic Chemistry",
    author: "T. W. Graham Solomons, Craig B. Fryhle, Scott A. Snyder",
    kind: "textbook",
    status: "consult",
    edition: "11th ed.",
    year: 2013,
    rating: 4,
    spineColor: "from-amber-500 to-orange-800",
    why: "My English-language second opinion on organic. When one explanation doesn't land, Solomons' reaction summaries and spectroscopy chapters usually do — the end-of-chapter 'key words' lists are ideal for exam-week triage.",
    topics: ["synthesis", "spectroscopy", "reaction summaries"],
  },
  {
    id: "clayden",
    title: "Organic Chemistry",
    author: "Clayden, Greeves, Warren",
    kind: "textbook",
    status: "planned",
    edition: "2nd ed.",
    year: 2012,
    rating: 0,
    spineColor: "from-emerald-700 to-teal-900",
    why: "Recommended everywhere for mechanism-first thinking. Planned as my second pass over organic after finishing McMurry — reportedly excellent on stereochemistry and orbitals.",
    topics: ["mechanisms", "orbitals", "stereochemistry"],
  },
  {
    id: "atkins",
    title: "Physical Chemistry",
    author: "Atkins, de Paula, Keeler",
    kind: "textbook",
    status: "planned",
    edition: "11th ed.",
    year: 2018,
    rating: 0,
    spineColor: "from-orange-600 to-red-800",
    why: "The other classic p-chem text. Wishlist item for its quantum chemistry and spectroscopy chapters, which go further than Levine's treatment.",
    topics: ["quantum", "spectroscopy", "statistical mechanics"],
  },
  {
    id: "nist-webbook",
    title: "NIST Chemistry WebBook",
    author: "National Institute of Standards and Technology",
    kind: "web",
    status: "consult",
    url: "https://webbook.nist.gov/chemistry/",
    rating: 5,
    spineColor: "from-slate-500 to-slate-800",
    why: "First stop for verified thermochemical data — standard enthalpies, heat capacities, IR spectra. Every number in this site's calculators is cross-checked against NIST or CRC values.",
    topics: ["data", "thermochemistry", "spectra"],
  },
  {
    id: "iupac-goldbook",
    title: "IUPAC Compendium (Gold Book)",
    author: "IUPAC",
    kind: "web",
    status: "consult",
    url: "https://goldbook.iupac.org/",
    rating: 4,
    spineColor: "from-sky-500 to-cyan-800",
    why: "Settles terminology arguments definitively. The atomic weights used by the Chemistry Calculator follow IUPAC 2021 conventional values from this body.",
    topics: ["terminology", "standards", "atomic weights"],
  },
  {
    id: "pubchem",
    title: "PubChem",
    author: "NIH National Library of Medicine",
    kind: "web",
    status: "consult",
    url: "https://pubchem.ncbi.nlm.nih.gov/",
    rating: 5,
    spineColor: "from-lime-600 to-green-800",
    why: "Powers the Molecular Explorer's live lookup — compound names become 3D structures via the PUG REST API. Also my default source for property lookups.",
    topics: ["structures", "database", "API"],
  },
  {
    id: "crc-handbook",
    title: "CRC Handbook of Chemistry and Physics",
    author: "Rumble (ed.)",
    kind: "reference",
    status: "planned",
    edition: "104th ed.",
    year: 2023,
    rating: 0,
    spineColor: "from-zinc-400 to-slate-700",
    why: "The physical desk reference. On the wishlist for lab work; until then NIST covers most numeric needs.",
    topics: ["data", "constants", "tables"],
  },
];

export function getTextbooks() {
  return SOURCES.filter((s) => s.kind === "textbook");
}
