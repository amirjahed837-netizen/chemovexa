import type { Domain, Tool } from "@/config/site";

/* ------------------------------ timeline --------------------------------- */

export type TimelineItem = {
  period: string;
  title: string;
  org: string;
  detail?: string;
  current?: boolean;
};

export const EDUCATION: TimelineItem[] = [
  {
    period: "2023 — present",
    title: "B.Sc. in Chemistry",
    org: "Azarbaijan Shahid Madani University — Faculty of Chemistry",
    current: true,
    detail:
      "Core coursework: organic chemistry & synthesis, physical chemistry, analytical chemistry, spectroscopy (NMR · IR · MS) and thermodynamics. Consistently drawn to the quantitative side of every course.",
  },
  {
    period: "2020 — 2023",
    title: "High School — Mathematics & Physics Track",
    org: "School Name",
    detail:
      "Where two obsessions started: a chemistry olympiad book and a Python tutorial — read in parallel.",
  },
];

export const EXPERIENCE: TimelineItem[] = [
  {
    period: "2026 — present",
    title: "Independent Developer — Chemistry Tooling",
    org: "Personal projects · open source",
    current: true,
    detail:
      "Designing and building web-based instruments for chemistry: calculators with validated methods, interactive 3D molecular visualization and reaction exploration tools. This portfolio is the home for all of it.",
  },
  {
    period: "2025 — present",
    title: "Self-Directed Study — Scientific Programming",
    org: "Online courses & textbooks",
    detail:
      "Python ecosystem for science: NumPy, pandas and matplotlib; foundations of machine learning; cheminformatics with RDKit; building APIs with FastAPI.",
  },
  {
    period: "2024 — 2025",
    title: "Academic Coursework Projects",
    org: "University laboratory courses",
    detail:
      "Lab reports evolved into mini software projects — spreadsheets became Python scripts, hand-drawn titration curves became plotted datasets.",
  },
];

/* -------------------------------- skills ---------------------------------- */

export type SkillTile = {
  symbol: string;
  name: string;
  level?: "core" | "familiar";
};

export type SkillGroup = {
  title: string;
  icon: Domain["icon"] | Tool["icon"];
  accentClass: string;
  tiles: SkillTile[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    title: "Chemistry",
    icon: "flask",
    accentClass: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
    tiles: [
      { symbol: "Og", name: "Organic Chemistry", level: "core" },
      { symbol: "Sy", name: "Synthesis & Mechanisms", level: "core" },
      { symbol: "Sp", name: "Spectroscopy · NMR · IR · MS" },
      { symbol: "An", name: "Analytical Chemistry" },
      { symbol: "Tc", name: "Thermodynamics & Kinetics" },
      { symbol: "Wl", name: "Wet Lab Techniques" },
    ],
  },
  {
    title: "Programming",
    icon: "code",
    accentClass: "text-blue-300 border-blue-400/20 bg-blue-400/10",
    tiles: [
      { symbol: "Py", name: "Python", level: "core" },
      { symbol: "Ts", name: "TypeScript", level: "core" },
      { symbol: "Ne", name: "Next.js / React" },
      { symbol: "Tw", name: "Tailwind CSS" },
      { symbol: "Fa", name: "FastAPI" },
      { symbol: "Sq", name: "SQL / PostgreSQL" },
      { symbol: "Gt", name: "Git & GitHub", level: "core" },
      { symbol: "Dk", name: "Docker", level: "familiar" },
    ],
  },
  {
    title: "Data & AI",
    icon: "spark",
    accentClass: "text-indigo-300 border-indigo-400/20 bg-indigo-400/10",
    tiles: [
      { symbol: "Pa", name: "pandas" },
      { symbol: "Nu", name: "NumPy" },
      { symbol: "Mp", name: "matplotlib" },
      { symbol: "Sk", name: "scikit-learn", level: "familiar" },
      { symbol: "Ll", name: "LLM APIs" },
      { symbol: "Rg", name: "RAG & Embeddings", level: "familiar" },
    ],
  },
  {
    title: "Scientific Tools",
    icon: "lab",
    accentClass: "text-violet-300 border-violet-400/20 bg-violet-400/10",
    tiles: [
      { symbol: "Rk", name: "RDKit" },
      { symbol: "Td", name: "3Dmol.js" },
      { symbol: "Lx", name: "LaTeX", level: "core" },
      { symbol: "Zo", name: "Zotero" },
      { symbol: "Or", name: "Origin / Plotting" },
      { symbol: "Mx", name: "Excel → beyond Excel" },
    ],
  },
];

/* ---------------------------------- now ----------------------------------- */

export const NOW: { label: string; value: string }[] = [
  { label: "Reading", value: "McMurry — Organic Chemistry (course companion)" },
  { label: "Reading", value: "Levine — Physical Chemistry" },
  { label: "Building", value: "This portfolio — Step 2 of 10" },
  { label: "Learning", value: "Cheminformatics with RDKit" },
  { label: "Next up", value: "FastAPI service powering the site's tools" },
];

/* ------------------------------- cv extras -------------------------------- */

export const CERTIFICATIONS: { title: string; issuer: string; year: string }[] = [
  { title: "Laboratory Safety Training", issuer: "University Name", year: "2025" },
  { title: "English Proficiency — C1", issuer: "Certifying Body", year: "2024" },
];

export const LANGUAGES: { name: string; level: string }[] = [
  { name: "Persian", level: "Native" },
  { name: "English", level: "Professional — C1" },
];

export const INTERESTS: string[] = [
  "Computational Chemistry",
  "Cheminformatics",
  "AI for Science",
  "Molecular Visualization",
  "Open Source",
  "Science Communication",
];
