import { getAllNotes, getNote } from "@/lib/content";
import { SOURCES } from "@/config/literature";

export type Chunk = {
  id: string;
  title: string;
  url: string;
  kind: "note" | "literature" | "tool" | "site";
  text: string;
};

const TOOL_BLURBS: Chunk[] = [
  {
    id: "tool-calculator",
    title: "Chemistry Calculator",
    url: "/chemistry/calculator",
    kind: "tool",
    text: "The Chemistry Calculator at /chemistry/calculator computes molar mass from formulas (handles parentheses, hydrates like CuSO4·5H2O, charges like SO4^2-, brackets like K4[Fe(CN)6]) with IUPAC 2021 atomic masses and shows percent composition. It does stoichiometry with limiting reagent and theoretical/percent yield, solution preparation (molarity: mass = moles × molar mass), dilution solving C1V1=C2V2 for any missing variable, acids and bases pH calculations (strong acid/base, weak acid with exact quadratic for Ka, weak base Kb, Henderson–Hasselbalch buffers pH = pKa + log([A-]/[HA])), and a unit converter for pressure, energy, volume, mass, amount, concentration and temperature. All calculations run client-side and show their method.",
  },
  {
    id: "tool-explorer",
    title: "3D Molecular Explorer",
    url: "/chemistry/molecular-explorer",
    kind: "tool",
    text: "The Molecular Explorer at /chemistry/molecular-explorer renders interactive 3D molecular structures with 3Dmol.js: rotate by dragging, zoom by scrolling, toggle auto-rotation and element labels, and switch between ball-and-stick, sticks and space-filling styles. The built-in library contains water, ammonia, methane, carbon dioxide, ethylene, ethane, ethanol, acetic acid, benzene and cyclohexane in its chair conformation with axial and equatorial hydrogens — all built from real bond lengths and angles. Any compound can also be fetched from PubChem by name or pasted as MOL/SDF/PDB/XYZ data.",
  },
  {
    id: "tool-lab",
    title: "Interactive Reaction Lab",
    url: "/chemistry/reaction-lab",
    kind: "tool",
    text: "The Reaction Lab at /chemistry/reaction-lab balances chemical equations automatically using exact rational nullspace elimination over the element-conservation matrix. Pick reagents from a shelf of about forty common substances (metals, acids, bases, salts, gases, oxides, organics) or type any formula; the balanced coefficients, state symbols and atom conservation appear live. It classifies reactions as synthesis, decomposition, single displacement (checking the metal activity series), double displacement/precipitation, combustion or acid-base neutralization, and describes what you would observe at the bench plus safety notes. Presets include neutralization of HCl with NaOH, silver chloride precipitation, zinc plus hydrochloric acid, methane combustion, limestone calcination and magnesium synthesis.",
  },
  {
    id: "tool-periodic",
    title: "Interactive Periodic Table",
    url: "/chemistry/periodic-table",
    kind: "tool",
    text: "The Interactive Periodic Table at /chemistry/periodic-table shows all 118 elements with IUPAC 2021 standard atomic masses in the classic 18-column layout including lanthanides and actinides. Hovering highlights an element's category (alkali metal, alkaline earth, transition metal, post-transition metal, metalloid, nonmetal, halogen, noble gas, lanthanide, actinide) and clicking opens a detail panel with atomic number, mass, melting and boiling points, electron configuration (Aufbau order with the standard exceptions such as chromium, copper, silver and gold), group, period, and phase at room temperature. Element names are available in English and Persian, and elements are searchable by name or symbol.",
  },
  {
    id: "tool-titration",
    title: "Titration Simulator",
    url: "/chemistry/titration",
    kind: "tool",
    text: "The Titration Simulator at /chemistry/titration draws the live pH curve of a titration as titrant is added: strong acid with NaOH (HCl), weak acid with NaOH (acetic acid, Ka = 1.8e-5), or weak base with HCl (ammonia, Kb = 1.8e-5). Every point on the curve is solved exactly from the charge and mass balance equations — buffer region, half-equivalence point (pH = pKa), equivalence-point hydrolysis and the post-equivalence excess — not from Henderson–Hasselbalch shortcuts. Dragging on the chart or using the slider sets the added volume and shows the pH, the equivalence volume Ve, textbook indicator ranges (phenolphthalein 8.2 to 10.0, methyl orange 3.1 to 4.4) and the current titration phase.",
  },
  {
    id: "tool-cv",
    title: "About the site author",
    url: "/about",
    kind: "site",
    text: "This portfolio belongs to a chemistry student who builds software. The About page has the full story, a periodic-table-styled skills grid and dual timelines for education and projects. The CV page renders a printable, data-driven curriculum vitae. The author is currently reading McMurry's Organic Chemistry and Levine's Physical Chemistry — the annotations on the Literature page describe exactly what each book is used for.",
  },
];

function chunkNoteText(title: string, slug: string, body: string): Chunk[] {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter((p) => p.length > 60 && !p.startsWith("---"));
  const chunks: Chunk[] = [];
  let buffer = "";
  let part = 0;
  const flush = () => {
    if (!buffer) return;
    part += 1;
    chunks.push({
      id: `note-${slug}-${part}`,
      title: part === 1 ? title : `${title} (part ${part})`,
      url: `/research/notes/${slug}`,
      kind: "note",
      text: `${title} — ${buffer}`,
    });
    buffer = "";
  };
  for (const p of paragraphs) {
    if ((buffer + "\n\n" + p).length > 700) flush();
    buffer = buffer ? `${buffer}\n\n${p}` : p;
  }
  flush();
  return chunks;
}

function literatureChunks(): Chunk[] {
  return SOURCES.map((s) => ({
    id: `lit-${s.id}`,
    title: `${s.title}${s.edition ? ` (${s.edition})` : ""} — ${s.author}`,
    url: "/research/literature",
    kind: "literature" as const,
    text: [
      `Source: ${s.title}${s.edition ? ` ${s.edition}` : ""} by ${s.author}${s.year ? `, ${s.year}` : ""}.`,
      `Status: ${s.status === "reading" ? `currently reading${s.progress ? ` (${s.progress})` : ""}` : s.status === "consult" ? "active reference" : "on the wishlist"}.`,
      s.why,
      `Topics: ${s.topics.join(", ")}.`,
    ].join(" "),
  }));
}

let cache: Chunk[] | null = null;

export async function buildCorpus(): Promise<Chunk[]> {
  if (cache) return cache;

  const chunks: Chunk[] = [...TOOL_BLURBS, ...literatureChunks()];

  const metas = await getAllNotes();
  for (const meta of metas) {
    const note = await getNote(meta.slug);
    if (note) chunks.push(...chunkNoteText(note.title, note.slug, note.content));
  }

  cache = chunks;
  return chunks;
}
