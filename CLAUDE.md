# CLAUDE.md — KG Lab

Project: **KG Lab** — a dark-themed, interactive learning app for knowledge-graph / retrieval
techniques (Flat search, IVF, HNSW, Node2Vec, GraphRAG, …). Stack: Vite + React 18 + TypeScript
+ Tailwind v3 + framer-motion. Path alias `@` → `src`.

---

## ⚠️ Before any UI change — read the design system

**Always read [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md) before editing or creating any UI.**
All colors, fonts, radii, spacing, and component idioms are defined there. Do not invent new
hex values, font sizes, or paddings — use the tokens. If a genuinely new token is needed, add it
to `DESIGN_SYSTEM.md` AND `tailwind.config.js` first, then use it.

**Monochrome** (white/gray, no color fills except status badges). Supports **light + dark** via
`[data-theme]` CSS variables — never branch component code on theme. Borders + surfaces for
separation, not shadows.

---

## Product roadmap

**Read [`ROADMAP.md`](./ROADMAP.md)** for the curriculum (Modules 0–5), the Playground vs Agent-mode
distinction, the shared arXiv corpus, and the Python-vs-TS compute strategy. Current build scope:
**Module 0 (Foundations) only — Modules 1–5 are locked.**

---

## ⚠️ Workflow — small commits, phased delivery

The user strongly prefers **many small commits across clear phases** over one big commit.

- **Plan in ~5 phases.** Each phase is a coherent slice of the project (e.g. _Foundation_,
  _Sidebar_, _Tabs_, _HNSW Overview_, _Other tabs / polish_).
- **Each phase contains ~5–20 small commits.** One logical change per commit (a component, a
  token addition, a wiring step, a fix). Never lump unrelated changes together.
- When planning a task, **present it as phases with their commit breakdown** before building.
- Commit messages: concise, imperative, scoped — e.g. `sidebar: add progress bar`,
  `overview: add key-parameters card`, `theme: add amber badge tokens`.
- Keep the working tree shippable after each commit; don't leave the build broken between commits.

---

## Project structure

- `src/components/` — UI components (Sidebar, Tabs, Overview, cards…).
- `src/data/` — module/content data (the learning modules list, HNSW content).
- `src/index.css` — Tailwind layers + CSS variables (font stacks, radius).
- `tailwind.config.js` — design tokens as theme colors.

## Commands

- `npm run dev` — local dev server (Vite)
- `npm run build` — typecheck + production build
- `npm run preview` — preview the build
