import type { Status } from "@/config/site";

export type ProjectCategory = "chemistry" | "web" | "data";

export type Project = {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  category: ProjectCategory;
  status: Status;
  year: string;
  role: string;
  tech: string[];
  highlights: string[];
  architecture?: string[];
  outcome?: string;
  links?: { demo?: string; repo?: string };
  featured?: boolean;
};

export const CATEGORY_LABEL: Record<ProjectCategory, string> = {
  chemistry: "Chemistry",
  web: "Web",
  data: "Data & AI",
};

export const PROJECTS: Project[] = [
  {
    slug: "portfolio",
    title: "Portfolio & Design System",
    tagline: "The site you're looking at — built from scratch, no templates.",
    overview:
      "A personal portfolio engineered like a product: a custom dark-scientific design system, an animated molecular canvas rendered with the raw Canvas API, and every page driven by structured config data instead of hardcoded markup. The goal was a foundation that will survive ten build phases without a rewrite.",
    category: "web",
    status: "live",
    year: "2026",
    role: "Designer & Developer",
    tech: ["Next.js 16", "TypeScript", "Tailwind CSS v4", "Canvas API"],
    highlights: [
      "Custom design system with glassmorphism utilities and reveal-on-scroll animations",
      "Interactive molecule network on canvas — atoms, bonds and pointer physics, dependency-free",
      "Skills grid styled as periodic-table element tiles",
      "Print-ready CV pipeline: structured data → styled document → PDF via print stylesheet",
      "Fully static output — every route prerendered for speed",
    ],
    architecture: [
      "App Router with typed config layer (profile, site, projects) as single source of truth",
      "UI primitives (Button, GlassCard, Badge, Reveal) composed into section components",
      "Design tokens declared in Tailwind v4 @theme — colors, fonts and keyframes in CSS",
      "Zero runtime UI dependencies; IntersectionObserver + rAF hand-rolled where needed",
    ],
    outcome:
      "A maintainable base that later steps plug into — the calculator, explorer, reaction lab and AI assistant all inherit this design system.",
    links: { repo: "https://github.com/yourusername/chem-portfolio" },
    featured: true,
  },
  {
    slug: "chemistry-calculator",
    title: "Chemistry Calculator",
    tagline: "Molar mass, stoichiometry and solutions — instant, client-side, exam-friendly.",
    overview:
      "A suite of chemistry calculators that runs entirely in the browser: formula parsing with proper subscript handling, molar mass from atomic data, limiting-reagent stoichiometry, dilution math and acid–base calculations. Built because existing online calculators are slow, cluttered and never show their working.",
    category: "chemistry",
    status: "live",
    year: "2026",
    role: "Creator",
    tech: ["Next.js", "TypeScript", "React"],
    highlights: [
      "Formula parser handling parentheses, hydrates and charges",
      "Step-by-step solution display — shows the method, not just the answer",
      "Offline-capable after first load; nothing leaves the device",
    ],
    links: { demo: "/chemistry/calculator" },
    featured: true,
  },
  {
    slug: "reaction-lab",
    title: "Reaction Lab",
    tagline: "Pick reagents, get balanced equations — a virtual bench for exploring reactions.",
    overview:
      "An interactive environment where students combine substances from a curated database and see balanced equations with state symbols, reaction classification and observation notes — like a lab notebook that checks itself.",
    category: "chemistry",
    status: "live",
    year: "2026",
    role: "Creator",
    tech: ["Next.js", "TypeScript", "Rational algebra"],
    highlights: [
      "Automatic equation balancing via exact rational nullspace elimination",
      "Reaction typing: synthesis, decomposition, redox, acid–base, precipitation",
      "Safety and observation annotations per experiment",
    ],
    links: { demo: "/chemistry/reaction-lab" },
  },
  {
    slug: "titration-simulator",
    title: "Titration Curve Simulator",
    tagline: "Acid–base titrations plotted from first principles — not lookup tables.",
    overview:
      "A Python tool that computes full pH curves for strong/weak acid–base combinations by solving equilibrium expressions numerically, then renders publication-style plots. Started as a way to check homework; ended as a lesson in numerical methods.",
    category: "data",
    status: "wip",
    year: "2025",
    role: "Creator",
    tech: ["Python", "NumPy", "matplotlib"],
    highlights: [
      "Equilibrium-based model covering monoprotic & polyprotic systems",
      "Indicator overlay showing color-change windows against the curve",
      "Batch mode comparing multiple systems on one figure",
    ],
    architecture: [
      "Charge/mass balance solved iteratively per added volume step",
      "Pure functions for chemistry, thin CLI layer for plotting",
    ],
  },
  {
    slug: "spectra-digitizer",
    title: "Spectra Digitizer",
    tagline: "Extract usable data points from spectra trapped inside paper figures.",
    overview:
      "Older papers publish NMR and IR data as images only. This tool reconstructs the underlying data: axis calibration from known reference peaks, trace extraction by color masking, and export to CSV ready for further analysis.",
    category: "data",
    status: "planned",
    year: "2026",
    role: "Creator",
    tech: ["Python", "OpenCV", "pandas"],
    highlights: [
      "Two-point axis calibration against reference peaks",
      "Color-mask trace separation for multi-curve figures",
      "CSV/JSON export with original units preserved",
    ],
  },
  {
    slug: "mol-notes",
    title: "Mol-Notes",
    tagline: "Lab notes in Markdown that actually render chemical formulas correctly.",
    overview:
      "A note-taking setup for chemistry coursework: Markdown files processed with LaTeX math and mhchem syntax so reactions like \\ce{2H2 + O2 -> 2H2O} typeset properly. Will become the engine behind this site's Research Hub.",
    category: "web",
    status: "planned",
    year: "2026",
    role: "Creator",
    tech: ["Markdown", "KaTeX", "mhchem", "Next.js"],
    highlights: [
      "mhchem pipeline for reaction equations and isotopes",
      "Tag & series organization with full-text search planned",
      "Git-native: notes versioned alongside code",
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export const FEATURED_PROJECTS = PROJECTS.filter((p) => p.featured);
