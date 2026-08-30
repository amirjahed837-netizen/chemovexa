---
title: Second Law of Thermodynamics — Working Notes
date: 2026-08-26
tags: physical-chemistry, thermodynamics, entropy
summary: Reading notes on entropy and the second law (Levine, ch. 3–4) — the statements, the math that connects them, and what they actually forbid.
---

Working through the thermodynamics chapters of Levine's *Physical Chemistry*. This note collects the definitions in the form I'll want during problem sets.

## Two statements, one law

**Kelvin–Planck:** no process is possible whose *sole* result is complete conversion of heat into work.

**Clausius:** heat cannot flow spontaneously from a colder to a hotter body.

They look unrelated; both are equivalent to the existence of a state function $S$ with

$$
dS = \frac{\delta q_{\text{rev}}}{T}
$$

which is *the* definition of entropy change: reversible heat flow divided by temperature.

## The inequality that does all the work

For any real (irreversible) process between equilibrium states:

$$
dS \;\geq\; \frac{\delta q}{T}
\qquad\text{(equality only when reversible)}
$$

Everything practical follows from applying this to isolated systems ($q=0$):

$$
\Delta S_{\text{universe}} = \Delta S_{\text{sys}} + \Delta S_{\text{surr}} \geq 0
$$

The second law never forbids local decreases — it forbids **net** decreases. Refrigerators push heat uphill by paying for it with work, increasing total entropy elsewhere.

## Standard entropies and why S has units of J/mol·K

By the third law, $S \to 0$ as $T \to 0$ for perfect crystals, giving absolute entropies:

$$
S^\circ(T) = \int_0^T \frac{C_p}{T'}\,dT'
$$

plus phase-transition jumps $\Delta H_{\text{fus}}/T_b$ style terms at melting and boiling. This is why tabulated $S^\circ$ values are absolute — unlike enthalpies, no arbitrary zero needed beyond the third-law anchor.

## Gibbs energy = the second law in disguise

At constant $T,P$, spontaneity reduces to

$$
\Delta G = \Delta H - T\Delta S < 0
$$

Deriving this: substitute $\Delta S_{\text{surr}} = -\Delta H/T$ into the universe-entropy criterion. So the "Gibbs energy minimum" criterion isn't a new law — it's the second law pre-solved for lab conditions. Levine makes this derivation explicit, which is exactly why I'm reading him before Atkins.

## Things worth remembering

- $S$ is extensive; molar entropy is intensive.
- Reversible path matters for *computation*, not nature — entropy change between states is path-independent because $S$ is a state function.
- For ideal gases, mixing pure gases increases $S$ even with identical physics of the molecules — the origin of entropy as "counting microstates" ($S = k\ln W$).

---

Next session: chemical potential and why $\mu_i$ equality defines phase equilibria (Levine ch. 4–5). Will connect to electrochemistry when we reach cell potentials later in the term.
