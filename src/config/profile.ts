export const profile = {
  name: "Amirhossein Jahed",
  shortName: "AJ",
  role: "Chemistry Student & Developer",
  tagline: "Building computational tools for chemistry, research & AI.",
  email: "amirjahed837@gmail.com",
  github: "https://github.com/amirjahed837-netizen",
  linkedin: "",
  location: "Tabriz, Iran",
  university: "Azarbaijan Shahid Madani University — Faculty of Chemistry",
  availability: "Open to collaboration & internships",
  bio: [
    "I'm a chemistry student who discovered that a terminal can be as powerful as a fume hood. My days move between lecture notes on mechanisms and editor windows full of TypeScript — and I've found the two have more in common than most people think.",
    "Both demand precision. Both reward understanding the system, not just memorizing rules. And both are more fun when you build things with them. That's why this portfolio exists: instead of just studying chemistry, I'm building software that does chemistry.",
    "The long-term goal is sitting exactly at the intersection of these fields — computational chemistry, cheminformatics and AI systems grounded in real scientific data.",
  ],
  focusAreas: ["Computational Chemistry", "Cheminformatics", "AI for Science", "Web Development"],
} as const;

export type Profile = typeof profile;
