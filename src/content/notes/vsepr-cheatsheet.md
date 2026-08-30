---
title: VSEPR Geometry Cheat Sheet
date: 2026-08-20
tags: general-chemistry, geometry, vsepr
summary: One-page reference connecting electron domains to molecular shapes — the fastest way to predict geometry from a Lewis structure.
---

The valence-shell electron-pair repulsion (VSEPR) model treats every electron domain — bonding pair, double bond, or lone pair — as a point charge around the central atom. Domains repel and spread as far apart as possible. Count domains first, then subtract lone pairs to get the *molecular* shape.

## The core table

| AXE | Domains | Lone pairs | Geometry | Angle | Example |
|-----|---------|-----------|----------|-------|---------|
| AX₂ | 2 | 0 | Linear | 180° | $\ce{CO2}$ |
| AX₃ | 3 | 0 | Trigonal planar | 120° | $\ce{BF3}$ |
| AX₂E | 3 | 1 | Bent | <120° | $\ce{SO2}$ |
| AX₄ | 4 | 0 | Tetrahedral | 109.5° | $\ce{CH4}$ |
| AX₃E | 4 | 1 | Trigonal pyramidal | ~107° | $\ce{NH3}$ |
| AX₂E₂ | 4 | 2 | Bent | ~104.5° | $\ce{H2O}$ |
| AX₅ | 5 | 0 | Trigonal bipyramidal | 90/120° | $\ce{PCl5}$ |
| AX₄E | 5 | 1 | Seesaw | — | $\ce{SF4}$ |
| AX₆ | 6 | 0 | Octahedral | 90° | $\ce{SF6}$ |

## Why lone pairs squeeze harder

A lone pair is bound to **one** nucleus instead of two, so its cloud is fatter and pushes bonding pairs away more strongly. Each lone pair compresses the remaining angles:

$$
\angle(\ce{CH4}) = 109.5° \;>\; \angle(\ce{NH3}) = 107° \;>\; \angle(\ce{H2O}) = 104.5°
$$

Two lone pairs → even tighter. This single rule explains almost every "why is the angle smaller" question on exams.

## Double bonds count once

A double bond is one domain: $\ce{CO2}$ has two domains (both double bonds) → linear, not bent. Same for the carbonyl carbon in formaldehyde $\ce{H2C=O}$: three domains → trigonal planar.

> Exam trap: count **electron domains**, not atoms bonded.

## Quick workflow

1. Draw the Lewis structure.
2. Count domains on the central atom (single, double, triple all count as one; each lone pair counts).
3. Look up the AXE row.
4. Subtract nothing for π bonds; subtract lone pairs for shape naming.

Pair this with the [Molecular Explorer](/chemistry/molecular-explorer) — water (AX₂E₂), ammonia (AX₃E), methane (AX₄), BF₃ (AX₃), PCl₅ (AX₅) and SF₆ (AX₆) cover every row of the table above, and benzene and cyclohexane show what changes when rings and π bonds join the game.
