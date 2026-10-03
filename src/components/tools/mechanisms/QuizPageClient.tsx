"use client";

/**
 * Standalone quiz page: /chemistry/mechanisms/quiz
 *
 * Unlike the embedded panel on the library page (which quizzes whatever the
 * current filters show), this page is a dedicated study tool:
 *  - choose quiz length (5 / 10 / 20)
 *  - choose scope (all topics, or one topic)
 *  - progress and best scores persist in localStorage
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { GlassCard } from "@/components/ui/GlassCard";
import { Reveal } from "@/components/ui/Reveal";
import { useI18n } from "@/lib/i18n";
import {
  MECHANISMS,
  TOPIC_ORDER,
  TOPIC_LABEL,
} from "@/lib/chem/mechanisms";
import type { TopicId } from "@/lib/chem/mechanisms";
import { generateQuiz, QUIZ_KIND_LABEL } from "@/lib/chem/mechanisms/quiz";
import { cn } from "@/lib/utils";

type Phase = "setup" | "playing" | "result";
type Scope = "all" | TopicId;
type Pace = "relaxed" | "timed";

const LENGTHS = [5, 10, 20] as const;
const STORAGE_KEY = "chemovexa-quiz-best";
const SPEED_KEY = "chemovexa-quiz-speed";

/** seconds per question in timed mode, by quiz length */
const SECS_PER_QUESTION: Record<(typeof LENGTHS)[number], number> = {
  5: 20,
  10: 15,
  20: 10,
};

type BestRecord = { correct: number; total: number; pct: number; when: number };

function readBest(): BestRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v?.pct === "number" && typeof v?.total === "number") return v;
  } catch {
    /* corrupt or unavailable storage — treat as no record */
  }
  return null;
}

/** fastest pace ever achieved, in questions per minute (higher is better) */
function readSpeed(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SPEED_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    if (typeof v?.qpm === "number" && v.qpm > 0) return v.qpm;
  } catch {
    /* ignore */
  }
  return null;
}

export function QuizPageClient() {
  const { t, locale } = useI18n();
  const q = t.pages.mechanisms.quiz;
  const loc = locale === "fa" ? "fa" : "en";

  const [scope, setScope] = useState<Scope>("all");
  const [length, setLength] = useState<(typeof LENGTHS)[number]>(10);
  const [pace, setPace] = useState<Pace>("relaxed");
  const [phase, setPhase] = useState<Phase>("setup");
  const [best, setBest] = useState<BestRecord | null>(() => readBest());
  const [bestSpeed, setBestSpeed] = useState<number | null>(() => readSpeed());

  // Keep the displayed best score in sync when another tab updates it.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setBest(readBest());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const deck = useMemo(() => {
    const pool = scope === "all" ? MECHANISMS : MECHANISMS.filter((m) => m.topic === scope);
    return pool;
  }, [scope]);

  const byId = useMemo(() => new Map(deck.map((m) => [m.id, m])), [deck]);

  const [seed, setSeed] = useState(0);
  const questions = useMemo(
    () => generateQuiz(seed, length, deck.map((m) => m.id), loc, byId),
    [seed, length, deck, loc, byId],
  );

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState<boolean[]>([]);

  /* ------------------------------- timer ------------------------------- */
  // Timed mode gives each question its own countdown. The interval id lives in a
  // ref so it survives re-renders; a second ref tracks whether the current
  // question was auto-answered by the clock (so onCheck doesn't double-count it).
  const tickRef = useRef<number | null>(null);
  const timedOutRef = useRef(false);
  const timeBudget = pace === "timed" ? SECS_PER_QUESTION[length] : 0;
  const [timeLeft, setTimeLeft] = useState(timeBudget);
  const startedAtRef = useRef<number>(0);
  const totalMsRef = useRef<number>(0);

  const stopTimer = useCallback(() => {
    if (tickRef.current !== null) {
      window.clearInterval(tickRef.current);
      tickRef.current = null;
    }
  }, []);

  // (re)start the per-question countdown; a no-op in relaxed mode
  const startQuestionTimer = useCallback(() => {
    if (pace !== "timed") return;
    stopTimer();
    startedAtRef.current = Date.now();
    const deadline = startedAtRef.current + timeBudget * 1000;
    tickRef.current = window.setInterval(() => {
      const remaining = Math.max(0, Math.round((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        stopTimer();
        // clock ran out: score as missed, reveal the answer, allow advancing
        timedOutRef.current = true;
        setHistory((h) => [...h, false]);
        setChecked(true);
      }
    }, 250);
  }, [pace, timeBudget, stopTimer]);

  // never leak an interval
  useEffect(() => stopTimer, [stopTimer]);

  const start = useCallback(() => {
    setSeed(Math.floor(Math.random() * 1e9));
    setIdx(0);
    setPicked(null);
    setChecked(false);
    setScore(0);
    setHistory([]);
    timedOutRef.current = false;
    totalMsRef.current = 0;
    setTimeLeft(timeBudget);
    setPhase("playing");
    startQuestionTimer();
  }, [timeBudget, startQuestionTimer]);

  const finish = useCallback(() => {
    stopTimer();
    setPhase("result");
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const prev = readBest();
    if (!prev || pct > prev.pct || (pct === prev.pct && questions.length > prev.total)) {
      const rec: BestRecord = { correct: score, total: questions.length, pct, when: Date.now() };
      setBest(rec);
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rec));
      } catch {
        /* storage unavailable — best score stays session-only */
      }
    }
    // record pace (questions per minute) in timed mode only
    if (pace === "timed" && totalMsRef.current > 0) {
      const qpm = Math.round((questions.length / totalMsRef.current) * 60000);
      const prevSpeed = readSpeed();
      if (qpm > 0 && (!prevSpeed || qpm > prevSpeed)) {
        setBestSpeed(qpm);
        try {
          window.localStorage.setItem(SPEED_KEY, JSON.stringify({ qpm }));
        } catch {
          /* ignore */
        }
      }
    }
  }, [score, questions.length, pace, stopTimer]);

  if (phase === "setup") {
    return (
      <>
        <Container className="pt-14 pb-6">
          <Reveal>
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-cyan-300">
              {t.pages.mechanisms.eyebrow} · {q.tabQuiz}
            </p>
            <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
              {q.pageTitle}
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">
              {q.pageDescription}
            </p>
          </Reveal>
        </Container>

        <Container className="pb-20">
          <Reveal delay={80}>
            <GlassCard className="mx-auto max-w-2xl p-6 sm:p-8">
              <div className="mb-6">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {q.scopeLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <ScopeChip
                    active={scope === "all"}
                    onClick={() => setScope("all")}
                    label={`${t.pages.mechanisms.allTopics} (${MECHANISMS.length})`}
                  />
                  {TOPIC_ORDER.map((tp) => {
                    const n = MECHANISMS.filter((m) => m.topic === tp).length;
                    return (
                      <ScopeChip
                        key={tp}
                        active={scope === tp}
                        onClick={() => setScope(tp)}
                        label={`${TOPIC_LABEL[tp][loc as "en" | "fa"]} (${n})`}
                      />
                    );
                  })}
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {q.lengthLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  {LENGTHS.map((n) => (
                    <ScopeChip
                      key={n}
                      active={length === n}
                      onClick={() => setLength(n)}
                      label={String(n)}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-slate-400">
                  {q.paceLabel}
                </p>
                <div className="flex flex-wrap gap-2">
                  <ScopeChip
                    active={pace === "relaxed"}
                    onClick={() => setPace("relaxed")}
                    label={q.paceRelaxed}
                  />
                  <ScopeChip
                    active={pace === "timed"}
                    onClick={() => setPace("timed")}
                    label={q.paceTimed}
                  />
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  {pace === "timed"
                    ? q.paceTimedHint.replace("{secs}", String(SECS_PER_QUESTION[length]))
                    : q.paceRelaxedHint}
                </p>
              </div>

              {deck.length < 4 ? (
                <p className="rounded-lg border border-amber-400/30 bg-amber-400/5 px-4 py-3 text-sm text-amber-200">
                  {q.tooFew}
                </p>
              ) : (
                <button
                  onClick={start}
                  className="w-full rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {q.start} ({length})
                </button>
              )}

              {best && (
                <p className="mt-5 text-center font-mono text-xs text-slate-500">
                  {q.bestLine
                    .replace("{correct}", String(best.correct))
                    .replace("{total}", String(best.total))
                    .replace("{pct}", String(best.pct))}
                </p>
              )}

              <p className="mt-6 text-center text-xs text-slate-500">
                <Link
                  href="/chemistry/mechanisms"
                  className="text-slate-400 underline-offset-4 hover:text-cyan-200 hover:underline"
                >
                  {q.backToLibrary}
                </Link>
              </p>
            </GlassCard>
          </Reveal>
        </Container>
      </>
    );
  }

  if (phase === "result") {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    const newBest = best && best.correct === score && best.total === questions.length;
    return (
      <Container className="pt-14 pb-20">
        <Reveal>
          <GlassCard className="mx-auto max-w-2xl p-8 text-center">
            <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">
              {q.score}
            </p>
            <p className="mt-3 font-display text-5xl font-bold text-white">
              {score}
              <span className="text-slate-600"> / {questions.length}</span>
            </p>
            <p
              className={cn(
                "mt-3 font-display text-2xl font-bold",
                pct >= 70 ? "text-emerald-300" : pct >= 40 ? "text-amber-300" : "text-rose-300",
              )}
            >
              {pct}%
            </p>
            <p className="mt-3 text-sm text-slate-400">
              {pct >= 70 ? q.pass.replace("{pct}", String(pct)) : q.fail}
            </p>

            {newBest && (
              <p className="mt-3 inline-block rounded-full border border-amber-400/40 bg-amber-400/10 px-3 py-1 text-xs font-medium text-amber-200">
                {q.newBest}
              </p>
            )}

            {pace === "timed" && bestSpeed && (
              <p className="mt-2 font-mono text-[11px] text-slate-500">
                {q.bestSpeedLine.replace("{qps}", String(bestSpeed))}
              </p>
            )}

            {/* per-question recap */}
            <div className="mt-8 flex flex-wrap justify-center gap-1.5">
              {history.map((ok, i) => (
                <span
                  key={i}
                  title={q.questionOf.replace("{n}", String(i + 1)).replace("{total}", String(history.length))}
                  className={cn(
                    "inline-flex h-7 w-7 items-center justify-center rounded-md font-mono text-[11px]",
                    ok
                      ? "border border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
                      : "border border-rose-400/40 bg-rose-400/10 text-rose-200",
                  )}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                onClick={start}
                className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                {q.newQuiz}
              </button>
              <button
                onClick={() => setPhase("setup")}
                className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
              >
                {q.settings}
              </button>
            </div>
          </GlassCard>
        </Reveal>
      </Container>
    );
  }

  // playing
  const cur = questions[idx];
  const isCorrect = picked === cur.answerId;
  const answerText = cur.options.find((o) => o.id === cur.answerId)?.text ?? "";
  const pctDone = Math.round(((idx + (checked ? 1 : 0)) / questions.length) * 100);

  const onCheck = () => {
    if (picked === null || checked) return;
    stopTimer();
    totalMsRef.current += Date.now() - startedAtRef.current;
    setChecked(true);
    const right = picked === cur.answerId;
    if (right) setScore((s) => s + 1);
    setHistory((h) => [...h, right]);
  };

  const onNext = () => {
    if (idx + 1 >= questions.length) {
      finish();
      return;
    }
    timedOutRef.current = false;
    setIdx((i) => i + 1);
    setPicked(null);
    setChecked(false);
    setTimeLeft(timeBudget);
    startQuestionTimer();
  };

  const promptLine: Record<typeof cur.kind, string> = {
    family: q.promptFamily,
    summary: q.promptSummary,
    tag: q.promptTag,
    general: q.promptGeneral,
    conditions: q.promptConditions,
  };

  return (
    <Container className="pt-10 pb-20">
      <div className="mx-auto max-w-2xl">
        {/* progress bar */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between font-mono text-[11px] text-slate-500">
            <span>
              {q.questionOf
                .replace("{n}", String(idx + 1))
                .replace("{total}", String(questions.length))}
            </span>
            <span className="flex items-center gap-3">
              {pace === "timed" && (
                <span
                  className={cn(
                    "tabular-nums",
                    !checked && timeLeft <= 5
                      ? "font-bold text-rose-300"
                      : "text-slate-400",
                  )}
                  aria-label={q.timeUp}
                >
                  {checked
                    ? q.timeUp
                    : q.timeLeft.replace("{n}", String(timeLeft))}
                </span>
              )}
              {q.scoreLine
                .replace("{correct}", String(score))
                .replace("{total}", String(idx + (checked ? 1 : 0)))}
            </span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 transition-all duration-500"
              style={{ width: `${pctDone}%` }}
            />
          </div>
        </div>

        <GlassCard className="p-6 sm:p-8">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-cyan-300/80">
            {promptLine[cur.kind]} · {QUIZ_KIND_LABEL[cur.kind][loc as "en" | "fa"]}
          </p>
          <p
            dir={cur.kind === "general" || cur.kind === "tag" ? "ltr" : undefined}
            className={cn(
              "mb-5 rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm",
              cur.kind === "general" || cur.kind === "tag"
                ? "text-left font-mono text-cyan-200"
                : "text-slate-200",
            )}
          >
            {cur.prompt}
          </p>

          <div className="quiz-options flex flex-col gap-2.5">
            {cur.options.map((opt) => {
              const chosen = picked === opt.id;
              const right = checked && opt.id === cur.answerId;
              const wrong = checked && chosen && opt.id !== cur.answerId;
              return (
                <button
                  key={opt.id}
                  type="button"
                  disabled={checked}
                  onClick={() => setPicked(opt.id)}
                  aria-pressed={chosen}
                  dir={cur.kind === "general" ? "ltr" : undefined}
                  className={cn(
                    "rounded-lg border px-4 py-3 text-start text-sm transition",
                    right && "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
                    wrong && "border-rose-400/60 bg-rose-400/10 text-rose-200",
                    !right && !wrong && chosen && "border-cyan-400/50 bg-cyan-400/10 text-cyan-200",
                    !right &&
                      !wrong &&
                      !chosen &&
                      "border-white/10 text-slate-300 hover:border-cyan-400/40",
                    checked && !right && !wrong && "opacity-60",
                  )}
                >
                  {opt.text}
                </button>
              );
            })}
          </div>

          {checked && (
            <div
              className={cn(
                "mt-4 rounded-lg border px-4 py-3 text-sm",
                isCorrect
                  ? "border-emerald-400/40 bg-emerald-400/5 text-emerald-200"
                  : "border-rose-400/40 bg-rose-400/5 text-rose-200",
              )}
            >
              <p className="font-semibold">{isCorrect ? q.correct : q.incorrect}</p>
              {!isCorrect && (
                <p dir={cur.kind === "general" ? "ltr" : undefined} className="mt-1 text-slate-200">
                  {answerText}
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center justify-end">
            {!checked ? (
              <button
                onClick={onCheck}
                disabled={picked === null}
                className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20 disabled:opacity-40"
              >
                {q.check}
              </button>
            ) : (
              <button
                onClick={onNext}
                className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
              >
                {idx + 1 >= questions.length ? q.finish : q.next}
              </button>
            )}
          </div>
        </GlassCard>

        <p className="mt-6 text-center text-xs text-slate-500">
          <button
            onClick={() => setPhase("setup")}
            className="text-slate-400 underline-offset-4 hover:text-cyan-200 hover:underline"
          >
            {q.quit}
          </button>
        </p>
      </div>
    </Container>
  );
}

function ScopeChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-3.5 py-2 text-xs font-medium transition sm:py-1.5",
        active
          ? "border-cyan-400/50 bg-cyan-400/15 text-cyan-200"
          : "border-white/10 text-slate-400 hover:text-slate-200",
      )}
    >
      {label}
    </button>
  );
}
