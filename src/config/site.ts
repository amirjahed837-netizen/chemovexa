export type Status = "live" | "wip" | "planned";

export type NavChild = {
  label: string;
  href: string;
  description?: string;
  status?: Status;
  step?: string;
};

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  status?: Status;
  children?: NavChild[];
};

export const STATUS_LABEL: Record<Status, string> = {
  live: "Live",
  wip: "In progress",
  planned: "Planned",
};

/* ---------------------------------- nav ---------------------------------- */

export const NAV_ITEMS: NavItem[] = [
  { label: "About", href: "/about" },
  {
    label: "Chemistry",
    href: "/chemistry",
    children: [
      {
        label: "Chemistry Calculator",
        href: "/chemistry/calculator",
        description: "Molar mass, stoichiometry, solutions & more",
        status: "live",
      },
      {
        label: "Molecular Explorer",
        href: "/chemistry/molecular-explorer",
        description: "Interactive 3D molecular structures",
        status: "live",
      },
      {
        label: "Reaction Lab",
        href: "/chemistry/reaction-lab",
        description: "Mix reagents & balance reactions interactively",
        status: "live",
      },
      {
        label: "Mechanism Library",
        href: "/chemistry/mechanisms",
        description: "Every organic mechanism, step by step",
        status: "live",
      },
    ],
  },
  {
    label: "Programming",
    href: "/programming",
    children: [
      {
        label: "Projects",
        href: "/programming/projects",
        description: "Case studies with architecture notes",
        status: "live",
      },
      {
        label: "GitHub",
        href: "/programming/github",
        description: "Live activity from the GitHub API",
        status: "live",
      },
    ],
  },
  {
    label: "Research",
    href: "/research",
    children: [
      {
        label: "Research Notes",
        href: "/research/notes",
        description: "Study notes with math & chemical notation",
        status: "live",
      },
      {
        label: "Literature",
        href: "/research/literature",
        description: "Annotated books, papers & references",
        status: "live",
      },
    ],
  },
  {
    label: "AI Assistant",
    href: "/ai/assistant",
    description: "Grounded in the site's chemistry engines",
    status: "live",
  },
  { label: "CV / Contact", href: "/contact" },
];

/* ------------------------------ home content ----------------------------- */

export type Domain = {
  title: string;
  href: string;
  description: string;
  icon: "flask" | "code" | "book" | "spark";
  accentClass: string;
};

export const DOMAINS: Domain[] = [
  {
    title: "Chemistry",
    href: "/chemistry",
    description: "Interactive labs, calculators and 3D molecular tools.",
    icon: "flask",
    accentClass: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
  },
  {
    title: "Programming",
    href: "/programming",
    description: "Clean, typed, well-tested code and open source work.",
    icon: "code",
    accentClass: "text-blue-300 border-blue-400/20 bg-blue-400/10",
  },
  {
    title: "Research",
    href: "/research",
    description: "Organized notes, literature and scientific references.",
    icon: "book",
    accentClass: "text-indigo-300 border-indigo-400/20 bg-indigo-400/10",
  },
  {
    title: "AI",
    href: "/ai/assistant",
    description: "An assistant built on top of real chemistry infrastructure.",
    icon: "spark",
    accentClass: "text-violet-300 border-violet-400/20 bg-violet-400/10",
  },
];

export type Tool = NavChild & { icon: "calc" | "molecule" | "lab" };

export const TOOLS: Tool[] = [
  {
    label: "Chemistry Calculator",
    href: "/chemistry/calculator",
    description:
      "Molar mass, stoichiometry, dilutions, pH and unit conversions — instant, client-side, exam-friendly.",
    status: "live",
    icon: "calc",
  },
  {
    label: "Molecular Explorer",
    href: "/chemistry/molecular-explorer",
    description:
      "Rotate, zoom and inspect 3D structures powered by 3Dmol.js — from water to proteins.",
    status: "live",
    icon: "molecule",
  },
  {
    label: "Reaction Lab",
    href: "/chemistry/reaction-lab",
    description:
      "Pick reagents, watch balanced equations form and explore reaction mechanisms.",
    status: "live",
    icon: "lab",
  },
];

export const ROADMAP: { step: string; title: string; status: Status }[] = [
  { step: "Step 1", title: "Home + Navigation + Design System", status: "live" },
  { step: "Step 2", title: "About + Skills + CV", status: "live" },
  { step: "Step 3", title: "Project Showcase", status: "live" },
  { step: "Step 4", title: "Chemistry Calculator", status: "live" },
  { step: "Step 5", title: "3D Molecular Explorer", status: "live" },
  { step: "Step 6", title: "Interactive Reaction Lab", status: "live" },
  { step: "Step 7", title: "Research Hub", status: "live" },
  { step: "Step 8", title: "AI Chemistry Assistant", status: "live" },
  { step: "Step 9", title: "RAG over scientific resources", status: "live" },
  { step: "Step 10", title: "Deploy · SEO · Performance", status: "planned" },
];
