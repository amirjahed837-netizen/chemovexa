import { parseFormula, molarMass, composition, FormulaError } from "@/lib/chem/formula";
import { balanceEquation } from "@/lib/chem/balance";
import { fmt } from "@/lib/chem/format";

export type EngineAnswer = {
  text: string;
  tool: { title: string; url: string };
};

const MOLAR_PATTERNS = [
  /molar\s+mass\s+(?:of\s+)?(.+)/i,
  /molecular\s+(?:weight|mass)\s+(?:of\s+)?(.+)/i,
  /(?:mr|mm)\s*(?:of)?\s*([A-Za-z0-9()[\]·.*^\-+]+)/i,
  /^(?:what(?:'s| is)\s+the\s+)?molar\s+mass\s+(?:for)\s+(.+)/i,
];

const COMPOSITION_PATTERN = /(?:percent(?:age)?\s+)?composition\s+(?:of\s+)?(.+)/i;

const ARROW = /\s*(?:->|→|⟶|=|=>)\s*/;

const SUBSCRIPTS: Record<string, string> = {
  "₀": "0", "₁": "1", "₂": "2", "₃": "3", "₄": "4",
  "₅": "5", "₆": "6", "₇": "7", "₈": "8", "₉": "9",
};

function cleanFormula(raw: string): string {
  return raw
    .replace(/[?!.]+\s*$/, "")
    .replace(/^(?:the\s+|a\s+)/i, "")
    // ASCII hydrate notation: CuSO4.5H2O → CuSO4·5H2O (what the parser splits on)
    .replace(/(\d)\.(\d)/g, "$1·$2")
    .trim();
}

function tryFormula(input: string): string | null {
  const f = cleanFormula(input);
  if (!f || !/[A-Z]/.test(f)) return null;
  try {
    parseFormula(f);
    return f;
  } catch {
    return null;
  }
}

function molarMassAnswer(formula: string): EngineAnswer {
  const parsed = parseFormula(formula);
  const mass = molarMass(parsed.counts);
  const top = composition(parsed.counts)
    .slice(0, 3)
    .map((r) => `${r.symbol} ${fmt(r.percent)}%`)
    .join(", ");
  return {
    text: `The molar mass of ${formula} is ${fmt(mass)} g/mol (${parsed.atoms} atoms per formula unit).${top ? ` Largest mass contributions: ${top}.` : ""}`,
    tool: { title: "Chemistry Calculator", url: "/chemistry/calculator" },
  };
}

function compositionAnswer(formula: string): EngineAnswer {
  const rows = composition(parseFormula(formula).counts);
  const lines = rows
    .map((r) => `• ${r.symbol}: ${fmt(r.percent)}% (${r.count} × ${fmt(r.subtotal / r.count)} g/mol)`)
    .join("\n");
  return {
    text: `Mass composition of ${formula}:\n${lines}`,
    tool: { title: "Chemistry Calculator", url: "/chemistry/calculator" },
  };
}

function balanceAnswer(question: string): EngineAnswer | null {
  const cleaned = question
    .replace(/^.*?\bbalanced?\b(?:\s+(?:equation|reaction))?\s*(?:for|of)?\s*:?/i, "")
    .replace(/^.*?\bequation\b\s*(?:for)?\s*:?/i, "")
    .trim();
  const q = cleaned.length > 0 ? cleaned : question;

  const sides = q.split(ARROW);
  if (sides.length !== 2) return null;

  const parseSide = (side: string) =>
    side
      .split("+")
      .map((s) => s.replace(/^\d+\s*/, "").trim())
      .filter(Boolean);

  const left = parseSide(sides[0]);
  const right = parseSide(sides[1]);
  if (left.length === 0 || right.length === 0) return null;

  const inputs = [
    ...left.map((formula) => ({ formula, side: "left" as const })),
    ...right.map((formula) => ({ formula, side: "right" as const })),
  ];
  for (const i of inputs) {
    if (!tryFormula(i.formula)) return null;
  }

  const result = balanceEquation(inputs);
  if (!result.ok) return null;

  const lhs = result.species.slice(0, left.length);
  const rhs = result.species.slice(left.length);
  const pretty = (arr: typeof lhs) =>
    arr.map((s) => `${s.coeff > 1 ? s.coeff : ""}${s.formula}`).join(" + ");

  return {
    text: `Balanced equation: ${pretty(lhs)} → ${pretty(rhs)}\n(verified by exact rational nullspace elimination — atoms conserved on both sides).`,
    tool: { title: "Reaction Lab", url: "/chemistry/reaction-lab" },
  };
}

/**
 * Deterministic answers computed by this site's own chemistry engines.
 * Handles the intents that have exact solutions, so the assistant stays
 * genuinely useful even with no LLM key configured.
 */
export function answerFromEngines(question: string): EngineAnswer | null {
  // normalize Unicode subscripts (H₂O → H2O) so pasted formulas parse
  const q = question.replace(/[₀-₉]/g, (ch) => SUBSCRIPTS[ch] ?? ch).trim();
  if (q.length < 3 || q.length > 200) return null;

  if (COMPOSITION_PATTERN.test(q) && !ARROW.test(q)) {
    const target = tryFormula(q.match(COMPOSITION_PATTERN)![1]);
    if (target) return compositionAnswer(target);
  }

  if (/(balance|balanced)/i.test(q) || ARROW.test(q)) {
    const answer = balanceAnswer(q);
    if (answer) return answer;
  }

  for (const pattern of MOLAR_PATTERNS) {
    const match = q.match(pattern);
    if (match) {
      const target = tryFormula(match[1]);
      if (target) return molarMassAnswer(target);
    }
  }

  const bare = tryFormula(q);
  if (bare && /^[A-Z][a-z]?\d*$/.test(cleanFormula(q))) {
    return molarMassAnswer(bare);
  }

  return null;
}

export function isFormulaError(e: unknown): e is FormulaError {
  return e instanceof FormulaError;
}
