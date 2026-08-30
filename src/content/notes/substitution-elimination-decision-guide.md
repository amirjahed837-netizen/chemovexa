---
title: SN1 · SN2 · E1 · E2 — The Decision Map
date: 2026-08-27
tags: organic-chemistry, mechanisms, substitution, elimination
summary: One page that settles the classic exam question — four mechanisms, their rate laws and stereochemistry, and a decision grid that picks the winner from substrate, reagent, and solvent (McMurry + Solomons).
---

Every alkyl halide in front of a nucleophile or base is playing a four-way game: two substitution channels (SN1, SN2) and two elimination channels (E1, E2). The winner is decided by three facts you can read straight off the problem: **the substrate, the reagent, and the solvent**. This note is the decision map — the mechanism details live in McMurry's substitution/elimination chapters and Solomons' summary tables.

## The four mechanisms at a glance

| | SN2 | SN1 | E2 | E1 |
|---|---|---|---|---|
| Rate law | $v = k[\ce{RX}][\ce{Nu^-}]$ | $v = k[\ce{RX}]$ | $v = k[\ce{RX}][\ce{B^-}]$ | $v = k[\ce{RX}]$ |
| Steps | 1 (concerted) | 2 (via $\ce{R+}$) | 1 (concerted) | 2 (via $\ce{R+}$) |
| Key geometry | backside attack | planar cation | **anti-periplanar** H–C–C–X | planar cation |
| Stereochemistry | full inversion (Walden) | racemization* | anti elimination | racemization* |
| Substrate | methyl > 1° > 2° ≫ 3° | 3° > 2° | 3° ≥ 2° > 1° | 3° only |
| Wants | strong Nu, aprotic | weak Nu, protic | strong base | weak base, heat |

\* SN1 product is rarely exactly 50/50 — the leaving group shields one face, so inversion slightly wins.

## Step 1 — Read the substrate

Classify the carbon bearing the leaving group:

- **Methyl / 1°** — no stable carbocation, no steric wall → SN2 territory (E2 needs β-H's; methyl has none).
- **2°** — the contested middle; everything is on the table.
- **3°** — too blocked for SN2, but a great carbocation → SN1/E1, unless a strong base forces E2.
- **Allylic / benzylic** — resonance-stabilized cations make SN1 viable even at 2°, and SN2 unusually fast at 1°.

## Step 2 — Read the reagent

Sort the species into one of four boxes. The distinguishing question: is it a good **nucleophile**, a good **base**, both, or neither?

| Reagent | Nucleophile? | Base? | Steers toward |
|---|---|---|---|
| $\ce{I^-},\ \ce{Br^-},\ \ce{RS^-},\ \ce{N3^-},\ \ce{CN^-}$ | strong | weak | **SN2** |
| $\ce{HO^-},\ \ce{RO^-}$ | strong | strong | **E2** at 2°/3°, SN2 at 1° |
| $\ce{t-BuO^-},\ \ce{LDA}$ | bulky — poor Nu | very strong | **E2 only** (Hofmann product) |
| $\ce{H2O},\ \ce{ROH}$ | weak | weak | **SN1 + E1** (3° only) |

Polarizability is the tell for nucleophiles: $\ce{I^-}$ and $\ce{RS^-}$ are soft, bulky-ish, and barely basic — pure SN2 drivers.

## Step 3 — Read the solvent

- **Polar aprotic** (DMSO, DMF, acetone, MeCN): no N–H/O–H to hydrogen-bond the nucleophile, so the "naked" anion attacks fast → **accelerates SN2** (classic rate order in DMSO: $\ce{F^-} > \ce{Cl^-} > \ce{Br^-} > \ce{I^-}$, the reverse of protic solvents).
- **Polar protic** (water, alcohols): hydrogen bonds shroud anions (slows SN2) but stabilize ions — the leaving group *and* the emerging carbocation → **accelerates SN1/E1**.

## The decision grid

| Substrate | Strong Nu, weak base | Strong base | Weak Nu, weak base | Bulky base |
|---|---|---|---|---|
| Methyl | SN2 | SN2 | no reaction | no reaction |
| 1° | **SN2** | SN2 (some E2) | no reaction | **E2** |
| 2° | **SN2** | **E2** | SN1 + E1 | **E2** |
| 3° | no SN2 | **E2** | **SN1 + E1** | E2 |

And the tiebreakers that override everything:

1. **Heat favors elimination** — two molecules become three or four; entropy wins ($T\Delta S$ grows with $T$).
2. **Leaving-group quality gates all four**: $\ce{I^-} > \ce{Br^-} > \ce{Cl^-} \gg \ce{F^-}$; sulfonates (OTs, OMs) behave like iodide. On a bad leaving group, first ask whether it can be protonated (alcohols in $\ce{HX}$).
3. **E2 stereochemistry is a hard constraint**: the β-H and the leaving group must be anti-periplanar. In cyclohexanes that means **trans-diaxial** — no axial LG, no E2, no matter how strong the base.

## Stereochemistry receipts

**SN2 — inversion.** Backside attack pushes through like an umbrella in wind: an $(S)$ substrate gives an $(R)$ product (priorities permitting).

**E2 — anti elimination.** Zaitsev's rule (most substituted alkene wins) holds for small bases because the more substituted alkene is lower in energy. Bulky bases can't reach the crowded β-H, so they grab the most exposed one → **Hofmann** (less substituted) product. Same logic for the Hofmann elimination of quaternary ammonium salts.

> Exam trap #1: "NaOEt + 2° halide" → E2 is the **major** product, but SN2 is still happening. Read the question — "major product" ≠ "only product".
>
> Exam trap #2: SN1 at a stereocenter gives racemization, but the cation can also **rearrange** (hydride or alkyl shift) before capture. If a more stable cation is one shift away, expect the rearranged skeleton in the product.

## Worked micro-example

$\ce{2-bromobutane + NaOCH3}$ in methanol: 2° substrate, strong base → **E2**, Zaitsev product is trans-2-butene (anti-periplanar available, and trans > cis in stability). Same substrate with $\ce{NaI}$ in acetone: strong weakly-basic nucleophile, aprotic solvent → **SN2** with inversion at C-2.

Balance or explore these reactions interactively in the [Reaction Lab](/chemistry/reaction-lab), and see the full annotated book list behind these notes on the [Literature shelf](/research/literature).
