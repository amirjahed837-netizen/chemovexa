/**
 * Functional test for the mechanism quiz generator.
 * Runs the real generateQuiz() against the real MECHANISMS corpus in both
 * locales and verifies question integrity.
 */
import { MECHANISMS } from "@/lib/chem/mechanisms";
import { FAMILY_LABEL } from "@/lib/chem/mechanisms/types";
import { generateQuiz, type QuizQuestion } from "@/lib/chem/mechanisms/quiz";

const byId = new Map(MECHANISMS.map((m) => [m.id, m]));

let issues: string[] = [];
let total = 0;

function check(qs: QuizQuestion[], locale: "en" | "fa", label: string) {
  if (qs.length === 0) {
    issues.push(`${locale}: no questions generated`);
    return;
  }
  for (const q of qs) {
    total++;
    const correct = q.options.find((o) => o.id === q.answerId);
    if (!correct) {
      issues.push(`${locale} ${q.kind}:${q.answerId}: no correct option`);
      continue;
    }
    if (q.options.length !== 4) {
      issues.push(`${locale} ${q.kind}:${q.answerId}: expected 4 options, got ${q.options.length}`);
      continue;
    }
    const texts = q.options.map((o) => o.text);
    const uniq = new Set(texts);
    if (uniq.size !== texts.length) {
      issues.push(`${locale} ${q.kind}:${q.answerId}: duplicate options`);
      continue;
    }
    if (!q.prompt || q.prompt.trim().length < 3) {
      issues.push(`${locale} ${q.kind}:${q.answerId}: empty prompt`);
      continue;
    }
    // every option must resolve to a real mechanism (distractor ids are real ids)
    for (const o of q.options) {
      if (o.id.startsWith("d")) continue; // family distractors are synthetic
      if (!byId.has(o.id)) {
        issues.push(`${locale} ${q.kind}:${q.answerId}: option id ${o.id} not in corpus`);
      }
    }
    // answer must actually be correct semantically
    const target = byId.get(q.answerId)!;
    if (q.kind === "family") {
      if (correct.text !== FAMILY_LABEL[target.family][locale])
        issues.push(`${locale} ${q.kind}:${q.answerId}: family answer mismatch`);
    }
    if (q.kind === "general") {
      if (correct.text !== (locale === "fa" ? target.fa.general : target.en.general))
        issues.push(`${locale} ${q.kind}:${q.answerId}: general answer mismatch`);
    }
  }
  console.log(`${label}: ${qs.length} questions`);
}

// multiple seeds for both locales
for (const locale of ["en", "fa"] as const) {
  for (const seed of [1, 42, 1337, 99999]) {
    const qs = generateQuiz(seed, 10, MECHANISMS.map((m) => m.id), locale, byId);
    check(qs, locale, `seed=${seed} locale=${locale}`);
  }
}

// filtered subsets (topic filters)
const alkenes = MECHANISMS.filter((m) => m.topic === "alkenes").map((m) => m.id);
const qsSub = generateQuiz(5, 8, alkenes, "en", byId);
check(qsSub, "en", "alkenes-only");
console.log(`  (alkenes pool size: ${alkesLength(alkenes)})`);

function alkesLength(a: string[]) {
  return a.length;
}

// tiny pool must yield no questions (guard)
const tiny = generateQuiz(1, 10, ["sn2", "e2", "e1"], "en", byId);
if (tiny.length !== 0) issues.push(`tiny pool should yield 0, got ${tiny.length}`);
else console.log("tiny pool guard: OK (0 questions)");

console.log("");
console.log(`total questions checked: ${total}`);
console.log(issues.length === 0 ? "RESULT: ALL PASS ✓" : `RESULT: ${issues.length} ISSUES`);
issues.slice(0, 10).forEach((i) => console.log("  -", i));
process.exit(issues.length === 0 ? 0 : 1);
