# Chemistry × Code Portfolio

A professional, extensible portfolio for a chemistry student who builds software. Designed to be built up step by step — every tool, page and piece of content is data-driven and modular.

The site serves as both a real portfolio and the home for a growing chemistry infrastructure: three working chemistry tools, a research note system, an annotated literature library, and an AI assistant grounded in the site's own content.

## Live features

| Section | Route | Status |
|---------|-------|--------|
| Home with animated molecular canvas | `/` | live |
| About + skills + journey timelines | `/about` | live |
| Curriculum Vitae (printable) | `/cv` | live |
| Chemistry Calculator (molar mass, stoichiometry, solutions, pH, units) | `/chemistry/calculator` | live |
| 3D Molecular Explorer (14 real molecules + PubChem) | `/chemistry/molecular-explorer` | live |
| Reaction Lab (auto-balancing + classifier + safety) | `/chemistry/reaction-lab` | live |
| Research notes (KaTeX math + mhchem) | `/research/notes` | live |
| Literature (McMurry, Levine, references — bookshelf UI) | `/research/literature` | live |
| Project showcase (filterable + case studies) | `/programming/projects` | live |
| Live GitHub activity | `/programming/github` | live |
| AI Chemistry Assistant (RAG over the site) | `/ai/assistant` | live |
| Contact | `/contact` | live |

## Stack

- **Framework:** Next.js 16 (App Router) + TypeScript (strict)
- **Styling:** Tailwind CSS v4 (CSS-first config, no JS config)
- **Chemistry rendering:** RDKit (data), 3Dmol.js (3D), KaTeX + mhchem (math)
- **Markdown:** react-markdown + remark-gfm + remark-math + rehype-katex
- **AI:** BM25 retrieval + OpenAI-compatible streaming chat (optional)
- **Deployment:** Vercel-ready (static + one dynamic API route)
- **No runtime backend** (yet) — every calculation runs in the browser

## Getting started

```bash
# 1. Install (use the npmmirror registry if you have network issues)
npm install

# 2. (optional) Configure the AI assistant
cp .env.example .env.local
# edit .env.local and set AI_API_KEY

# 3. Run
npm run dev
# → http://localhost:3000

# 4. Build for production
npm run build
npm run start
```

## Scripts

| Command | What it does |
|---------|--------------|
| `npm run dev` | Turbopack dev server with HMR |
| `npm run build` | Production build with TypeScript checks |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint (eslint-config-next + custom rules) |

## File map

```
src/
├── app/                     # App Router pages
│   ├── opengraph-image.tsx  # Generated 1200×630 social card
│   ├── robots.ts            # Programmatic robots.txt
│   ├── sitemap.ts           # Programmatic sitemap (includes notes + projects)
│   ├── layout.tsx           # Root layout, metadata, fonts, nav + footer
│   ├── page.tsx             # Home + JSON-LD structured data
│   ├── not-found.tsx        # Custom 404
│   ├── error.tsx            # Error boundary
│   ├── loading.tsx          # Root loading state
│   ├── api/assistant/       # RAG API (POST chat, GET status)
│   ├── chemistry/           # The three chemistry tools
│   ├── programming/         # Project showcase + GitHub
│   ├── research/            # Notes + literature
│   ├── ai/assistant/        # Chat UI
│   └── about/, contact/, cv/
├── components/
│   ├── layout/              # Navbar, Footer, SkipToContent
│   ├── home/                # Hero, DomainsGrid, MoleculeCanvas, etc.
│   ├── ui/                  # Button, GlassCard, Badge, Reveal, ...
│   ├── tools/               # Tool-specific components
│   │   ├── calculator/      # 5 calculators + app shell
│   │   ├── explorer/        # 3Dmol wrapper + library UI
│   │   ├── lab/             # Reaction Lab
│   │   └── assistant/       # Chat UI
│   ├── about/, cv/, github/, md/, pages/, projects/
│   └── icons.tsx            # All inline SVG icon set + LogoMark
├── lib/
│   ├── chem/                # Chemistry engine (periodic, formula, balance, molfile, format, classify)
│   ├── ai/                  # AI pipeline (corpus, retrieval, llm, deterministic)
│   ├── content.ts           # Markdown note loader
│   └── utils.ts             # cn helper
├── config/                  # Data-driven configs (profile, site, projects, literature, molecules, reagents, cv)
└── content/notes/           # Markdown research notes (.md + frontmatter)
```

## Architecture principles

- **Data-driven everything** — change one file in `src/config/` to update the navbar, roadmap, tool descriptions, or project cards. Add a `.md` file in `src/content/notes/` and it shows up automatically.
- **No UI framework lock-in** — only React + Tailwind. Animation handled by CSS keyframes and a tiny IntersectionObserver hook.
- **Honest engineering** — no fake AI demos. The AI assistant is grounded in this site's tested engines and citations. Retrieval is real BM25.
- **Private by design** — every chemistry calculation runs in the browser. No data leaves the device.
- **Offline after first load** — 3Dmol.js and the chem engines are self-hosted npm packages. Works without internet once deployed.

## Personalizing

- **Your identity:** edit `src/config/profile.ts` (name, email, GitHub, focus areas, bio, avatar initials)
- **CV content:** edit `src/config/cv.ts` (education, experience, skills, certifications)
- **Projects:** edit `src/config/projects.ts` (add a project = add an object; case study page auto-generates)
- **Literature library:** edit `src/config/literature.ts`
- **Reagent database:** edit `src/config/reagents.ts`
- **Nav structure:** edit `src/config/site.ts`
- **Research notes:** drop a new `.md` file in `src/content/notes/` with frontmatter:
  ```yaml
  ---
  title: My new note
  date: 2026-09-01
  tags: organic-chemistry, mechanisms
  summary: One sentence describing what's inside.
  ---
  ```

## Deployment

The site is **Vercel-ready** out of the box:

1. Push the repo to GitHub.
2. Import it in Vercel (New Project).
3. Set `NEXT_PUBLIC_SITE_URL` to your production domain.
4. (Optional) Set `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` to enable LLM generation.
5. Deploy.

The build is fully static except for `/api/assistant` (one dynamic route), so Vercel's free tier handles it cheaply.

## Tested and verified

The chemistry engines aren't demo code — they're unit-tested during development:

- **Formula parser:** 18/18 — water, hydrates, brackets, charges, error cases
- **Molecule geometry:** 47/47 — every curated molecule's bond distances against reference values
- **Equation balancer:** 12/12 — including KMnO₄ decomposition (the classic hard one)
- **AI deterministic intents:** 6/6 — molar mass, balance, composition, retrieval fallback

## Roadmap (what was built)

1. ✅ Home + Navigation + Design System
2. ✅ About + Skills + CV
3. ✅ Project Showcase
4. ✅ Chemistry Calculator
5. ✅ 3D Molecular Explorer
6. ✅ Reaction Lab
7. ✅ Research Hub (Markdown notes + literature library)
8. ✅ AI Chemistry Assistant
9. ✅ RAG over scientific resources (BM25 + OpenAI-compatible streaming)
10. ✅ Deploy · SEO · Performance
