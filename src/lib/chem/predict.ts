import { ALL_KNOWN_REACTIONS, roleOf } from "./reaction";

export type Prediction = {
  kind: "exact" | "partial" | "heuristic";
  title: string;
  detail: string;
  missingLeft: string[];
  missingRight: string[];
  reactionId?: string;
  score: number;
  overlaps?: number;
};

const norm = (s: string) => s.trim().toLowerCase();

function predictFromRoles(left: string[], right: string[]): Prediction {
  const roles = [...left, ...right].filter((f) => f.trim()).map((f) => roleOf(f).role);
  const has = (r: string) => roles.includes(r as never);
  const upper = left.map((f) => f.toUpperCase());

  if (upper.includes("O2") && left.some((f) => /C/i.test(f) && /H/i.test(f) && !/^O/i.test(f))) {
    return {
      kind: "heuristic",
      title: "Combustion",
      detail: "A fuel + O₂ — expect CO₂ and H₂O as products (complete combustion).",
      missingLeft: [],
      missingRight: ["CO2", "H2O"],
      score: 0.5,
    };
  }
  if (has("acid") && has("base")) {
    return {
      kind: "heuristic",
      title: "Neutralization (acid + base)",
      detail: "An acid meets a base — expect a salt and water (H⁺ + OH⁻ → H₂O).",
      missingLeft: [],
      missingRight: ["H2O"],
      score: 0.5,
    };
  }
  if (has("metal") && has("acid")) {
    return {
      kind: "heuristic",
      title: "Single displacement (metal + acid)",
      detail: "An active metal in acid — expect a salt and H₂ gas bubbles.",
      missingLeft: [],
      missingRight: ["H2"],
      score: 0.45,
    };
  }
  if (has("acid-oxide") && upper.includes("H2O")) {
    return {
      kind: "heuristic",
      title: "Acidic oxide + water → oxyacid",
      detail: "A nonmetal oxide dissolving in water forms an acid (e.g. CO₂ → H₂CO₃).",
      missingLeft: [],
      missingRight: [],
      score: 0.4,
    };
  }
  if (has("basic-oxide") && upper.includes("H2O")) {
    return {
      kind: "heuristic",
      title: "Basic oxide + water → hydroxide",
      detail: "A metal oxide taking up water forms the hydroxide base (e.g. CaO → Ca(OH)₂).",
      missingLeft: [],
      missingRight: [],
      score: 0.4,
    };
  }
  const leftSalts = left.filter((f) => roleOf(f).role === "salt").length;
  if (leftSalts >= 2) {
    return {
      kind: "heuristic",
      title: "Possible double displacement / precipitation",
      detail: "Two electrolytes — check solubility rules: an insoluble pairing will crash out as a precipitate.",
      missingLeft: [],
      missingRight: [],
      score: 0.35,
    };
  }
  if (has("metal") && has("nonmetal") && right.length === 0) {
    return {
      kind: "heuristic",
      title: "Synthesis of a salt",
      detail: "A metal and a nonmetal — expect an ionic compound as the single product.",
      missingLeft: [],
      missingRight: [],
      score: 0.35,
    };
  }
  if (left.length === 1 && right.length === 0) {
    return {
      kind: "heuristic",
      title: "Decomposition candidate",
      detail: "A single compound with no partner — many (carbonates, chlorates, hydroxides) break apart under heat.",
      missingLeft: [],
      missingRight: [],
      score: 0.3,
    };
  }
  const labels = [...new Set([...left, ...right].filter((f) => f.trim()).map((f) => roleOf(f).label))];
  return {
    kind: "heuristic",
    title: labels.length > 0 ? `Reagent roles: ${labels.join(" + ")}` : "Waiting for species…",
    detail: "Add more species (or products) to narrow the prediction.",
    missingLeft: [],
    missingRight: [],
    score: 0.1,
  };
}

export function predictReaction(left: string[], right: string[]): Prediction | null {
  const L = left.map(norm).filter(Boolean);
  const R = right.map(norm).filter(Boolean);
  if (L.length === 0 && R.length === 0) return null;

  let best: Prediction | null = null;
  for (const k of ALL_KNOWN_REACTIONS) {
    const kl = k.left.map(norm);
    const kr = k.right.map(norm);
    const ol = kl.filter((f) => L.includes(f)).length;
    const or = kr.filter((f) => R.includes(f)).length;
    if (ol === 0 && or === 0) continue;
    const total = kl.length + kr.length;
    const score = (ol + or) / total;
    const overlaps = ol + or;
    const missingLeft = k.left.filter((f) => !L.includes(norm(f)));
    const missingRight = k.right.filter((f) => !R.includes(norm(f)));
    const complete = missingLeft.length === 0 && missingRight.length === 0;
    const cand: Prediction = {
      kind: complete ? "exact" : "partial",
      title: complete ? k.title : `Looks like: ${k.title}`,
      detail: complete
        ? `${k.typeLabel} — full write-up below.`
        : `Keep typing — add the missing species and the full write-up unlocks.`,
      missingLeft,
      missingRight,
      reactionId: k.id,
      score,
      overlaps,
    };
    if (
      !best ||
      (cand.kind === "exact" && best.kind !== "exact") ||
      (cand.kind === best.kind &&
        (cand.score > best.score || (cand.score === best.score && cand.overlaps! > best.overlaps!)))
    ) {
      best = cand;
    }
  }

  if (best && (best.kind === "exact" || best.score >= 0.3)) return best;
  const heuristic = predictFromRoles(left, right);
  if (!best || heuristic.score >= best.score) return heuristic;
  return best;
}
