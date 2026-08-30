---
title: Titration Curves, Region by Region
date: 2026-08-24
tags: analytical-chemistry, acids-bases, titration
summary: How to compute a full acid–base titration curve by hand — four regions, four equations, zero panic.
---

A titration curve looks intimidating until you realize it is just **four short problems glued together**. For the titration of a weak acid $\ce{HA}$ with strong base $\ce{OH^-}$:

$$\ce{HA + OH^- -> A^- + H2O}$$

## Region 1 — before any base is added

Only $\ce{HA}$ of concentration $C$ is present. Solve the weak-acid equilibrium exactly:

$$
K_a = \frac{x^2}{C - x}
\quad\Longrightarrow\quad
x = \frac{-K_a + \sqrt{K_a^2 + 4K_a C}}{2}
$$

with $x = [\ce{H+}]$. The quadratic matters when $C/K_a < 400$ — below that the shortcut $\sqrt{K_a C}$ drifts more than 5%.

## Region 2 — buffer zone

Between the start and the equivalence point, added $\ce{OH^-}$ converts $\ce{HA}$ into $\ce{A^-}$, so both are present and Henderson–Hasselbalch applies:

$$
\text{pH} = \text{p}K_a + \log_{10}\frac{[\ce{A^-}]}{[\ce{HA}]}
$$

**Half-equivalence point:** half the acid has been converted, so $[\ce{A^-}] = [\ce{HA}]$, the log term vanishes, and

$$
\text{pH}_{1/2} = \text{p}K_a
$$

That's how experimentalists measure p$K_a$: read the pH at half-equivalence off the curve.

## Region 3 — the equivalence point

All $\ce{HA}$ is gone; the flask contains $\ce{A^-}$, a weak base, at concentration

$$
C_{eq} = \frac{n_{\text{acid},0}}{V_{\text{acid}} + V_{\text{base,eq}}}
$$

Then $K_b = K_w / K_a$ drives hydrolysis $\ce{A^- + H2O <=> HA + OH^-}$. For a weak acid titrated by strong base, **pH > 7 at equivalence**. Only strong–strong systems land exactly on 7.

## Region 4 — excess base

Past equivalence, pH is set by leftover strong base alone (the weak conjugate contributes negligibly):

$$
[\ce{OH^-}] = \frac{n_{\text{base,added}} - n_{\text{acid},0}}{V_{\text{total}}}
\qquad\Longrightarrow\qquad \text{pH} = 14 + \log_{10}[\ce{OH^-}]
$$

at 25 °C.

## Steepness = sensitivity

The curve jumps several pH units within a drop or two near equivalence because the buffer capacity hits zero there. That vertical wall is what makes indicators work: pick one whose color-change range sits inside the jump (phenolphthalein, pH 8.2–10, suits weak-acid titrations).

---

*Cross-check any hand-computed point against the Chemistry Calculator's Acids & Bases tab — it solves the exact quadratic rather than the shortcut.*
