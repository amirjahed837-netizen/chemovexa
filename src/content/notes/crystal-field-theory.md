---
title: Crystal Field Theory — d-Orbital Splitting Without Tears
date: 2026-08-27
tags: inorganic-chemistry, coordination-compounds, crystal-field-theory
summary: Working notes on Δ, high-spin vs low-spin, and CFSE bookkeeping (grounded in Miessler and Shriver & Atkins) — the model that turns ligand identity into color and magnetism.
---

Crystal field theory makes one brutal simplification on purpose: **ligands are point charges**, and the metal's d orbitals are just electron clouds that feel the repulsion. Everything else — colors, magnetic moments, why $\ce{[Fe(CN)6]^4-}$ is diamagnetic but $\ce{[Fe(H2O)6]^2+}$ isn't — falls out of that single assumption.

## Why five d orbitals stop being equal

Isolated, all five d orbitals are degenerate. Now bring in six ligands along the ±x, ±y, ±z axes (octahedral). Two orbitals point **at** the ligands — $\mathrm{d_{z^2}}$ and $\mathrm{d_{x^2-y^2}}$ — so electrons in them get pushed up in energy. Three orbitals point **between** the ligands ($\mathrm{d_{xy}}$, $\mathrm{d_{xz}}$, $\mathrm{d_{yz}}$) and stay lower.

$$
E(\mathrm{e_g}) = +0.6\,\Delta_o \qquad E(\mathrm{t_{2g}}) = -0.4\,\Delta_o
$$

The barycenter (average) stays fixed — the set is split, not shifted. That's the whole model.

## High spin vs low spin: Δ versus P

Once t₂g and eg exist, a d⁴ ion faces a choice. The 4th electron can:

1. pair up in t₂g, paying the pairing energy $P$ but collecting $-0.4\,\Delta_o$;
2. sit in eg for free, but pay $+0.6\,\Delta_o$.

$$
\text{low spin if } \Delta_o > P \qquad \text{high spin if } \Delta_o < P
$$

**Δₒ is a property of the ligand; P is a property of the metal.** So spin state is decided by their contest, and the spectrochemical series ranks the ligands by how hard they push:

$$
\ce{I^- < Br^- < Cl^- < F^- < OH^- < H2O < NH3 < en < NO2^- < CN^- < CO}
$$

Classic d⁶ contrast, real numbers (wavenumbers, from the standard tables):

| Complex | $\Delta_o$ / cm⁻¹ | Spin | Unpaired | Magnetic |
|---------|------------------|------|----------|----------|
| $\ce{[Fe(H2O)6]^2+}$ | ~10 400 | high | 4 | paramagnetic |
| $\ce{[Fe(CN)6]^4-}$ | ~32 800 | low | 0 | diamagnetic |

## CFSE bookkeeping

Each t₂g electron is worth $-0.4\,\Delta_o$, each eg electron $+0.6\,\Delta_o$. For octahedral d⁴–d⁷ you get two possible answers (pairing-energy corrections ignored here):

| dⁿ | High spin | CFSE (HS) | Low spin | CFSE (LS) |
|----|-----------|-----------|----------|-----------|
| d⁴ | $\mathrm{t_{2g}^3e_g^1}$ | $0.0\,\Delta_o$ | $\mathrm{t_{2g}^4}$ | $-1.6\,\Delta_o$ |
| d⁵ | $\mathrm{t_{2g}^3e_g^2}$ | $0.0\,\Delta_o$ | $\mathrm{t_{2g}^5}$ | $-2.0\,\Delta_o$ |
| d⁶ | $\mathrm{t_{2g}^4e_g^2}$ | $-0.4\,\Delta_o$ | $\mathrm{t_{2g}^6}$ | $-2.4\,\Delta_o$ |
| d⁷ | $\mathrm{t_{2g}^5e_g^2}$ | $-0.8\,\Delta_o$ | $\mathrm{t_{2g}^6e_g^1}$ | $-1.8\,\Delta_o$ |

d¹–d³ and d⁸–d¹⁰ have only one arrangement — no spin-state question at all. If an exam asks "can this complex be high or low spin?", first check whether the d count even allows a choice.

> Exam trap: low-spin d⁶ has three pairs; high-spin d⁶ has one. Strict comparisons should add $+2P$ to the low-spin side before declaring it "more stable" — CFSE alone is not the whole ledger.

## Tetrahedral: same idea, four-ninths the drama

Four ligands, none of them aimed straight at any d orbital (the tetrahedron's vertices don't lie on the axes). The splitting inverts — e below, t₂ above — and shrinks:

$$
\Delta_t \approx \tfrac{4}{9}\,\Delta_o
$$

Because Δₜ is small it essentially never beats P, so **tetrahedral complexes are (almost) always high spin**. Textbook pair, same metal (Co²⁺, d⁷):

- $\ce{[Co(H2O)6]^2+}$ — pink, octahedral
- $\ce{[CoCl4]^2-}$ — blue, tetrahedral, $\Delta_t \approx 3\,100$ cm⁻¹

## Square planar: the octahedron that lost its z-ligands

Pull two axial ligands off an octahedron and everything touching z relaxes. The orbital ladder ends with $\mathrm{d_{x^2-y^2}}$ alone at the top, and a d⁸ metal can drop all eight electrons below it — square planar d⁸ is often **diamagnetic**:

- $\ce{[PdCl4]^2-}$, $\ce{[PtCl4]^2-}$: square planar, always (4d/5d metals split hard)
- $\ce{[Ni(CN)4]^2-}$: square planar, diamagnetic (strong-field CN⁻)
- $\ce{[NiCl4]^2-}$: tetrahedral, paramagnetic (weak-field Cl⁻)

Same metal, same oxidation state, different ligand → different geometry, different magnetism. That's the spectrochemical series cashing out.

## Why complexes are colored

A photon is absorbed when $h\nu = \Delta$. Visible photons span roughly 14 000–25 000 cm⁻¹ — exactly where ligand fields put their gaps. $\ce{[Ti(H2O)6]^3+}$ (d¹) absorbs near 20 300 cm⁻¹ (green-yellow) and transmits the complement: violet. Change the ligand, change Δ, change the color:

$$
\ce{[Ni(H2O)6]^2+}\ \text{green} \;\longrightarrow\; \ce{[Ni(NH3)6]^2+}\ \text{blue-purple}
$$

## Jahn–Teller, one line

Any nonlinear molecule with a degenerate electronic state distorts to break the degeneracy. In practice: uneven eg occupation (d⁹, Cu²⁺) gives long and short axial bonds — four short + two long bonds — because the eg electron cloud is asymmetric along z. Uneven t₂g occupation distorts only weakly.

## Sources & next steps

These notes follow the crystal-field treatment in **Miessler, Fischer & Tarr** (group-theory-first) with the descriptive examples cross-checked against **Shriver & Atkins** — both on [my shelf](/research/literature). Want to see the octahedron itself? Load **Hexaamminecobalt(III)** in the [Molecular Explorer](/chemistry/molecular-explorer) — the exact CoN₆ geometry this note describes. The companion picture for geometry itself is my [VSEPR cheat sheet](/research/notes/vsepr-cheatsheet).
