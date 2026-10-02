/**
 * Mechanism quiz / flashcard engine.
 *
 * Questions are generated deterministically from the existing mechanism corpus
 * (MECHANISMS in @/lib/chem/mechanisms) — no hand-authored quiz data, so the
 * quiz stays in sync automatically whenever a mechanism is added or edited.
 *
 * Question kinds:
 *  - family:     "Which family does X belong to?"
 *  - summary:    "Which mechanism is described here?" (prompt = first 90 chars of summary)
 *  - tag:        "Which mechanism involves X?" (prompt = a tag)
 *  - general:    "What is the general equation of X?" (prompt = title; options = equations)
 *  - conditions: "Which mechanism requires these conditions?" (prompt = conditions text)
 *
 * Everything is bilingual: prompts and options are read from the locale-specific
 * fields of each mechanism. Chemical equations are always LTR.
 */

import type { Mechanism, FamilyId } from "./types";
import { FAMILY_LABEL } from "./types";

export type QuizKind = "family" | "summary" | "tag" | "general" | "conditions";

export type QuizQuestion = {
  kind: QuizKind;
  /** id of the mechanism that is the correct answer */
  answerId: string;
  /** localized prompt text shown to the user */
  prompt: string;
  /** always LTR — used by "general" kind */
  promptEquation?: string;
  /** localized option texts; index 0..n-1, the entry whose id === answerId is correct */
  options: { id: string; text: string }[];
};

/** Small deterministic PRNG so a given seed always yields the same quiz. */
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rand: () => number, arr: T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  while (out.length < n && copy.length > 0) {
    const i = Math.floor(rand() * copy.length);
    out.push(copy.splice(i, 1)[0]);
  }
  return out;
}

const FAMILY_IDS: FamilyId[] = [
  "electrophilic-addition",
  "nucleophilic-addition",
  "eas",
  "acyl-substitution",
  "substitution",
  "elimination",
  "radical",
  "enolate",
  "redox",
  "acidbase",
];

/** localized accessors (mirror the ones in index.ts, kept local to avoid cycles) */
const L = {
  title: (m: Mechanism, locale: string) => (locale === "fa" ? m.fa.title : m.en.title),
  summary: (m: Mechanism, locale: string) => (locale === "fa" ? m.fa.summary : m.en.summary),
  general: (m: Mechanism, locale: string) => (locale === "fa" ? m.fa.general : m.en.general),
  conditions: (m: Mechanism, locale: string) =>
    locale === "fa" ? m.fa.conditions : m.en.conditions,
  tags: (m: Mechanism, locale: string) =>
    (locale === "fa" ? m.tags.fa : m.tags.en) as string[],
  family: (m: Mechanism, locale: string) => FAMILY_LABEL[m.family][locale as "en" | "fa"],
};

/** Truncate a summary for use as a prompt, at a word boundary. */
function truncate(text: string, max = 110): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  const sp = cut.lastIndexOf(" ");
  return (sp > 40 ? cut.slice(0, sp) : cut).trimEnd() + "…";
}

/**
 * Build one question of a given kind around a target mechanism.
 * Returns null when there are not enough distinct distractors.
 */
function buildQuestion(
  kind: QuizKind,
  target: Mechanism,
  pool: Mechanism[],
  locale: string,
  rand: () => number,
): QuizQuestion | null {
  const loc = locale === "fa" ? "fa" : "en";
  const others = pool.filter((m) => m.id !== target.id);

  if (kind === "family") {
    const answer = L.family(target, loc);
    // distractors = other family labels, textually distinct
    const otherLabels = FAMILY_IDS.filter((f) => f !== target.family).map((f) =>
      FAMILY_LABEL[f][loc as "en" | "fa"],
    );
    const distractors = pick(rand, otherLabels, 3);
    if (distractors.length < 3) return null;
    const opts = [
      { id: target.id, text: answer },
      ...distractors.map((text, i) => ({ id: `d${i}-${target.id}`, text })),
    ];
    return {
      kind,
      answerId: target.id,
      prompt: L.title(target, loc),
      options: shuffle(rand, opts),
    };
  }

  if (kind === "general") {
    const answer = L.general(target, loc);
    const distractorMechs = pick(rand, others, 3);
    if (distractorMechs.length < 3) return null;
    const opts = [
      { id: target.id, text: answer },
      ...distractorMechs.map((m) => ({ id: m.id, text: L.general(m, loc) })),
    ];
    // drop duplicate equations (some mechanisms share a generic form)
    const seen = new Set<string>();
    const deduped = opts.filter((o) => {
      const k = o.text.trim().toLowerCase();
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
    if (deduped.length < 4) return null;
    return {
      kind,
      answerId: target.id,
      prompt: L.title(target, loc),
      options: shuffle(rand, deduped),
    };
  }

  if (kind === "tag") {
    const tags = L.tags(target, loc);
    if (!tags || tags.length === 0) return null;
    const tag = tags[Math.floor(rand() * tags.length)];
    const distractorMechs = pick(rand, others, 3);
    if (distractorMechs.length < 3) return null;
    const opts = [
      { id: target.id, text: L.title(target, loc) },
      ...distractorMechs.map((m) => ({ id: m.id, text: L.title(m, loc) })),
    ];
    return {
      kind,
      answerId: target.id,
      prompt: tag,
      options: shuffle(rand, opts),
    };
  }

  if (kind === "conditions") {
    const answer = L.conditions(target, loc);
    const distractorMechs = pick(rand, others, 3).filter(
      (m) => L.conditions(m, loc).trim() !== answer.trim(),
    );
    if (distractorMechs.length < 3) return null;
    const opts = [
      { id: target.id, text: L.title(target, loc) },
      ...distractorMechs.map((m) => ({ id: m.id, text: L.title(m, loc) })),
    ];
    return {
      kind,
      answerId: target.id,
      prompt: truncate(answer, 120),
      options: shuffle(rand, opts),
    };
  }

  // summary (default)
  const answer = L.title(target, loc);
  const distractorMechs = pick(rand, others, 3);
  if (distractorMechs.length < 3) return null;
  const opts = [
    { id: target.id, text: answer },
    ...distractorMechs.map((m) => ({ id: m.id, text: L.title(m, loc) })),
  ];
  return {
    kind,
    answerId: target.id,
    prompt: truncate(L.summary(target, loc), 110),
    options: shuffle(rand, opts),
  };
}

function shuffle<T>(rand: () => number, arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const KINDS: QuizKind[] = ["family", "summary", "tag", "general", "conditions"];

/**
 * Generate a full quiz.
 *
 * @param seed       any integer; same seed ⇒ same quiz (lets "retry" replay a quiz)
 * @param count      number of questions
 * @param ids        mechanism ids to draw from (already filtered by topic/family/search)
 * @param locale     "en" | "fa"
 * @param mechanismById  lookup map
 */
export function generateQuiz(
  seed: number,
  count: number,
  ids: string[],
  locale: string,
  mechanismById: Map<string, Mechanism>,
): QuizQuestion[] {
  const rand = mulberry32(seed);
  const pool = ids.map((id) => mechanismById.get(id)).filter((m): m is Mechanism => !!m);
  if (pool.length < 4) return [];

  const out: QuizQuestion[] = [];
  const used = new Set<string>();
  let guard = 0;

  while (out.length < count && guard < count * 12) {
    guard++;
    const target = pool[Math.floor(rand() * pool.length)];
    const kind = KINDS[Math.floor(rand() * KINDS.length)];
    const key = `${kind}:${target.id}`;
    if (used.has(key)) continue;
    const q = buildQuestion(kind, target, pool, locale, rand);
    if (!q) continue;
    used.add(key);
    out.push(q);
  }

  return out;
}

/** Human-readable label for a question kind, bilingual. */
export const QUIZ_KIND_LABEL: Record<QuizKind, { en: string; fa: string }> = {
  family: { en: "Family", fa: "خانواده" },
  summary: { en: "Concept", fa: "مفهوم" },
  tag: { en: "Keyword", fa: "واژهٔ کلیدی" },
  general: { en: "Equation", fa: "معادله" },
  conditions: { en: "Conditions", fa: "شرایط" },
};
