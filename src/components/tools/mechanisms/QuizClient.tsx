"use client";

/**
 * Flashcard + quiz mode for the mechanism library.
 *
 * Both modes draw from the same filtered mechanism list the library page already
 * computes (topic / family / search filters are honoured), so the quiz is always
 * about the mechanisms currently in view.
 *
 * Questions are generated client-side from the corpus via generateQuiz(); the
 * deck seed lives in component state so "New quiz" reshuffles.
 */

import { useCallback, useMemo, useState } from "react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useI18n } from "@/lib/i18n";
import {
  MECHANISMS,
  mechTitle,
  mechSummary,
  mechGeneral,
} from "@/lib/chem/mechanisms";
import type { Mechanism } from "@/lib/chem/mechanisms";
import { generateQuiz, QUIZ_KIND_LABEL } from "@/lib/chem/mechanisms/quiz";
import { cn } from "@/lib/utils";

type Mode = "flash" | "quiz" | "match";

export function QuizClient({
  ids,
  locale,
}: {
  /** mechanism ids to include (already filtered by the parent) */
  ids: string[];
  locale: string;
}) {
  const { t } = useI18n();
  const q = t.pages.mechanisms.quiz;
  const [mode, setMode] = useState<Mode>("flash");

  const deck = useMemo(
    () => ids.map((id) => MECHANISMS.find((m) => m.id === id)).filter((m): m is Mechanism => !!m),
    [ids],
  );

  return (
    <GlassCard className="p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold text-white">
          {mode === "flash" ? q.tabFlash : mode === "quiz" ? q.tabQuiz : q.tabMatch}
        </h2>
        <div
          role="tablist"
          aria-label={q.tabQuiz}
          className="flex rounded-lg border border-white/10 bg-slate-900/70 p-1"
        >
          <button
            role="tab"
            aria-selected={mode === "flash"}
            onClick={() => setMode("flash")}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-medium transition",
              mode === "flash"
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {q.tabFlash}
          </button>
          <button
            role="tab"
            aria-selected={mode === "quiz"}
            onClick={() => setMode("quiz")}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-medium transition",
              mode === "quiz"
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {q.tabQuiz}
          </button>
          <button
            role="tab"
            aria-selected={mode === "match"}
            onClick={() => setMode("match")}
            className={cn(
              "rounded-md px-3.5 py-1.5 text-xs font-medium transition",
              mode === "match"
                ? "bg-cyan-400/15 text-cyan-200"
                : "text-slate-400 hover:text-slate-200",
            )}
          >
            {q.tabMatch}
          </button>
        </div>
      </div>

      {deck.length < 4 ? (
        <p className="py-6 text-center text-sm text-slate-400">
          {q.startHint.replace("{count}", String(deck.length))}
        </p>
      ) : mode === "flash" ? (
        <Flashcards deck={deck} locale={locale} q={q} />
      ) : mode === "match" ? (
        <MatchMode deck={deck} locale={locale} q={q} />
      ) : (
        <Quiz deck={deck} locale={locale} q={q} />
      )}
    </GlassCard>
  );
}

/* ------------------------------- flashcards ------------------------------- */

function Flashcards({
  deck,
  locale,
  q,
}: {
  deck: Mechanism[];
  locale: string;
  q: ReturnType<typeof useI18n>["t"]["pages"]["mechanisms"]["quiz"];
}) {
  const [i, setI] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const mech = deck[i];
  const loc = locale === "fa" ? "fa" : "en";

  const go = useCallback(
    (next: number) => {
      setFlipped(false);
      setI((next + deck.length) % deck.length);
    },
    [deck.length],
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between text-[11px] font-mono text-slate-500">
        <span>{q.flashFront}</span>
        <span>{q.cardOf.replace("{n}", String(i + 1)).replace("{total}", String(deck.length))}</span>
      </div>

      <button
        type="button"
        onClick={() => setFlipped((f) => !f)}
        aria-label={q.flashHint}
        className="group block w-full rounded-xl border border-white/10 bg-slate-900/60 p-5 text-start transition hover:border-cyan-400/40 focus:border-cyan-400/60 focus:outline-none"
      >
        {!flipped ? (
          <div>
            <p className="font-display text-base font-bold text-white sm:text-lg">
              {mechTitle(mech, loc)}
            </p>
            <p className="mt-3 text-xs text-slate-500">{q.flashHint}</p>
          </div>
        ) : (
          <div>
            <p className="text-sm leading-relaxed text-slate-300">
              {mechSummary(mech, loc)}
            </p>
            <p
              dir="ltr"
              className="mt-3 rounded-lg border border-white/10 bg-slate-950/70 px-3 py-2 font-mono text-xs text-cyan-200"
            >
              {mechGeneral(mech, loc)}
            </p>
          </div>
        )}
      </button>

      <div className="mt-4 flex items-center justify-between gap-3">
        <button
          onClick={() => go(i - 1)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          {q.prev}
        </button>
        <span className="font-mono text-[11px] text-slate-500">{q.flashBack}</span>
        <button
          onClick={() => go(i + 1)}
          className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
        >
          {q.nextCard}
        </button>
      </div>
    </div>
  );
}

/* ------------------------------- match mode ------------------------------- */

/**
 * Matching game: pair each mechanism title with its general equation.
 *
 * Click a title on the left, then an equation on the right (or vice versa).
 * A correct pair locks in green; a wrong pair flashes red and deselects.
 * The round ends when every pair is locked; "New round" reshuffles.
 *
 * Pairs are generated from the deck, skipping mechanisms whose general equation
 * collides with another one in the deck (a duplicate equation can't be matched
 * unambiguously).
 */
function MatchMode({
  deck,
  locale,
  q,
}: {
  deck: Mechanism[];
  locale: string;
  q: ReturnType<typeof useI18n>["t"]["pages"]["mechanisms"]["quiz"];
}) {
  const loc = locale === "fa" ? "fa" : "en";

  const pairs = useMemo(() => {
    // drop duplicate equations so each equation maps to exactly one mechanism
    const seen = new Set<string>();
    return deck
      .map((m) => ({
        id: m.id,
        title: mechTitle(m, loc),
        equation: mechGeneral(m, loc),
      }))
      .filter((p) => {
        const k = p.equation.trim().toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
  }, [deck, loc]);

  const usable = pairs.length >= 4;

  const [leftOrder, setLeftOrder] = useState<string[]>([]);
  const [rightOrder, setRightOrder] = useState<string[]>([]);
  const [picked, setPicked] = useState<string | null>(null);
  const [pickedSide, setPickedSide] = useState<"title" | "equation" | null>(null);
  const [locked, setLocked] = useState<Set<string>>(new Set());
  const [wrong, setWrong] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const byId = useMemo(() => new Map(pairs.map((p) => [p.id, p])), [pairs]);

  const shuffleIds = useCallback(
    (arr: string[]) => {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    },
    [],
  );

  const newRound = useCallback(() => {
    const take = pairs.slice(0, Math.min(6, pairs.length));
    setLeftOrder(shuffleIds(take.map((p) => p.id)));
    setRightOrder(shuffleIds(take.map((p) => p.id)));
    setPicked(null);
    setPickedSide(null);
    setLocked(new Set());
    setWrong(null);
    setAttempts(0);
  }, [pairs, shuffleIds]);

  // deal the first round whenever the pair set changes
  const [bootKey, setBootKey] = useState("");
  const key = pairs.map((p) => p.id).join(",");
  if (bootKey !== key) {
    setBootKey(key);
    if (usable) {
      const take = pairs.slice(0, Math.min(6, pairs.length));
      setLeftOrder(shuffleIds(take.map((p) => p.id)));
      setRightOrder(shuffleIds(take.map((p) => p.id)));
    }
  }

  const onPick = (id: string, side: "title" | "equation") => {
    if (locked.has(id) || wrong) return;
    // cross-side pair attempt first: both columns carry the mechanism id, so a
    // correct match is exactly picked === id with the two sides differing.
    // (this must be checked before the same-cell deselect branch below)
    if (picked !== null && pickedSide !== null && pickedSide !== side) {
      setAttempts((a) => a + 1);
      if (picked === id) {
        setLocked((prev) => new Set(prev).add(id));
        setPicked(null);
        setPickedSide(null);
        return;
      }
      // wrong pair: flash both cells, then clear
      setWrong(`${picked}|${id}`);
      setTimeout(() => {
        setWrong(null);
        setPicked(null);
        setPickedSide(null);
      }, 700);
      return;
    }
    if (picked === null) {
      setPicked(id);
      setPickedSide(side);
      return;
    }
    // pickedSide === side from here on: same cell = deselect, other cell = re-pick
    if (picked === id) {
      setPicked(null);
      setPickedSide(null);
      return;
    }
    setPicked(id);
    setPickedSide(side);
  };

  if (!usable) {
    return (
      <p className="py-6 text-center text-sm text-slate-400">{q.matchTooFew}</p>
    );
  }

  const done = locked.size === leftOrder.length && leftOrder.length > 0;

  return (
    <div>
      <p className="mb-4 text-xs text-slate-400">{q.matchHint}</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* titles */}
        <div className="flex flex-col gap-2.5">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {q.matchTitles}
          </p>
          {leftOrder.map((id) => {
            const p = byId.get(id)!;
            const isLocked = locked.has(id);
            const isPicked = picked === id && pickedSide === "title";
            const isWrong = wrong !== null && wrong.split("|").includes(id);
            return (
              <button
                key={id}
                type="button"
                disabled={isLocked || wrong !== null}
                onClick={() => onPick(id, "title")}
                aria-pressed={isPicked}
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-start text-sm transition",
                  isLocked && "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
                  isWrong && "border-rose-400/60 bg-rose-400/10 text-rose-200",
                  !isLocked && !isWrong && isPicked && "border-cyan-400/50 bg-cyan-400/10 text-cyan-200",
                  !isLocked && !isWrong && !isPicked && "border-white/10 text-slate-300 hover:border-cyan-400/40",
                  isLocked && "opacity-70",
                )}
              >
                {p.title}
              </button>
            );
          })}
        </div>

        {/* equations (always LTR) */}
        <div className="flex flex-col gap-2.5">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-wider text-slate-500">
            {q.matchEquations}
          </p>
          {rightOrder.map((id) => {
            const p = byId.get(id)!;
            const isLocked = locked.has(id);
            const isPicked = picked === id && pickedSide === "equation";
            const isWrong = wrong !== null && wrong.split("|").includes(id);
            return (
              <button
                key={id}
                type="button"
                disabled={isLocked || wrong !== null}
                onClick={() => onPick(id, "equation")}
                aria-pressed={isPicked}
                dir="ltr"
                className={cn(
                  "rounded-lg border px-4 py-2.5 text-start font-mono text-xs transition",
                  isLocked && "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
                  isWrong && "border-rose-400/60 bg-rose-400/10 text-rose-200",
                  !isLocked && !isWrong && isPicked && "border-cyan-400/50 bg-cyan-400/10 text-cyan-200",
                  !isLocked && !isWrong && !isPicked && "border-white/10 text-slate-300 hover:border-cyan-400/40",
                  isLocked && "opacity-70",
                )}
              >
                {p.equation}
              </button>
            );
          })}
        </div>
      </div>

      {done && (
        <div className="mt-6 rounded-lg border border-emerald-400/40 bg-emerald-400/5 px-4 py-3 text-center">
          <p className="font-semibold text-emerald-200">{q.matchDone}</p>
          <p className="mt-1 font-mono text-xs text-slate-400">
            {q.matchAttempts.replace("{n}", String(attempts))}
          </p>
          <button
            onClick={newRound}
            className="mt-3 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
          >
            {q.matchNew}
          </button>
        </div>
      )}

      {!done && attempts > 0 && (
        <p className="mt-4 text-center font-mono text-[11px] text-slate-500">
          {q.matchAttempts.replace("{n}", String(attempts))}
        </p>
      )}
    </div>
  );
}

/* ---------------------------------- quiz ---------------------------------- */

function Quiz({
  deck,
  locale,
  q,
}: {
  deck: Mechanism[];
  locale: string;
  q: ReturnType<typeof useI18n>["t"]["pages"]["mechanisms"]["quiz"];
}) {
  const loc = locale === "fa" ? "fa" : "en";
  const byId = useMemo(() => new Map(deck.map((m) => [m.id, m])), [deck]);
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 1e9));
  const questions = useMemo(
    () => generateQuiz(seed, 10, deck.map((m) => m.id), loc, byId),
    [seed, deck, loc, byId],
  );

  const [started, setStarted] = useState(false);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const cur = questions[idx];

  const reset = useCallback(
    (newSeed: number) => {
      setSeed(newSeed);
      setStarted(true);
      setIdx(0);
      setPicked(null);
      setChecked(false);
      setScore(0);
      setDone(false);
    },
    [],
  );

  const start = useCallback(() => reset(Math.floor(Math.random() * 1e9)), [reset]);

  if (!started) {
    return (
      <div className="py-6 text-center">
        <p className="text-sm text-slate-400">
          {q.startHint.replace("{count}", String(questions.length || 10))}
        </p>
        <button
          onClick={start}
          className="mt-4 rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
        >
          {q.start}
        </button>
      </div>
    );
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="py-8 text-center">
        <p className="font-mono text-[11px] uppercase tracking-widest text-slate-500">{q.score}</p>
        <p className="mt-2 font-display text-3xl font-bold text-white">
          {score}
          <span className="text-slate-500"> / {questions.length}</span>
        </p>
        <p className="mt-2 text-sm text-slate-300">
          {pct >= 70
            ? q.pass.replace("{pct}", String(pct))
            : q.fail}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={start}
            className="rounded-lg border border-cyan-400/40 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-400/20"
          >
            {q.newQuiz}
          </button>
          <button
            onClick={() => {
              setStarted(false);
              setDone(false);
            }}
            className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-200"
          >
            {q.restart}
          </button>
        </div>
      </div>
    );
  }

  const isCorrect = picked === cur.answerId;
  const answerText = cur.options.find((o) => o.id === cur.answerId)?.text ?? "";

  const onCheck = () => {
    if (picked === null) return;
    setChecked(true);
    if (picked === cur.answerId) setScore((s) => s + 1);
  };

  const onNext = () => {
    if (idx + 1 >= questions.length) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
    setChecked(false);
  };

  const promptLine: Record<typeof cur.kind, string> = {
    family: q.promptFamily,
    summary: q.promptSummary,
    tag: q.promptTag,
    general: q.promptGeneral,
    conditions: q.promptConditions,
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3 text-[11px] font-mono text-slate-500">
        <span>{q.questionOf.replace("{n}", String(idx + 1)).replace("{total}", String(questions.length))}</span>
        <span>
          {q.kindLabel}: {QUIZ_KIND_LABEL[cur.kind][loc as "en" | "fa"]}
        </span>
      </div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-cyan-300/80">
        {promptLine[cur.kind]}
      </p>
      <p
        dir={cur.kind === "general" || cur.kind === "tag" ? "ltr" : undefined}
        className={cn(
          "mb-4 rounded-lg border border-white/10 bg-slate-950/70 px-4 py-3 text-sm",
          cur.kind === "general" || cur.kind === "tag"
            ? "text-left font-mono text-cyan-200"
            : "text-slate-200",
        )}
      >
        {cur.prompt}
      </p>

      <div className="quiz-options flex flex-col gap-2.5" role="group" aria-label={q.check}>
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
                "rounded-lg border px-4 py-2.5 text-start text-sm transition",
                right && "border-emerald-400/60 bg-emerald-400/10 text-emerald-200",
                wrong && "border-rose-400/60 bg-rose-400/10 text-rose-200",
                !right && !wrong && chosen && "border-cyan-400/50 bg-cyan-400/10 text-cyan-200",
                !right && !wrong && !chosen && "border-white/10 text-slate-300 hover:border-cyan-400/40",
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

      <div className="mt-5 flex items-center justify-end gap-3">
        <span className="me-auto font-mono text-[11px] text-slate-500">
          {q.scoreLine.replace("{correct}", String(score)).replace("{total}", String(idx + (checked ? 1 : 0)))}
        </span>
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
            {idx + 1 >= questions.length ? q.restart : q.next}
          </button>
        )}
      </div>
    </div>
  );
}
