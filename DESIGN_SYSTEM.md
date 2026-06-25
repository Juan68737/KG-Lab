# KG Lab — Design System

> **For Claude:** Read this file before making ANY UI change. Every color, radius, font, and
> spacing value used in components must come from the tokens below. Do not introduce new hex
> values, ad-hoc paddings, or one-off font sizes without adding them here first. Match the
> existing component idiom (see `src/components/`).

KG Lab is a **dark-only**, two-column learning app: a left sidebar (progress + grouped module
nav) and a main content panel (tabbed module detail). The aesthetic is calm, dense, and
technical — soft borders, rounded cards, muted uppercase labels, a single violet accent.

---

## 1. Color tokens

All colors are exposed as Tailwind theme colors (see `tailwind.config.js`) and as CSS variables
in `src/index.css`. **Use the Tailwind class, not raw hex.**

| Token (Tailwind)      | Hex        | Use                                                        |
| --------------------- | ---------- | ---------------------------------------------------------- |
| `bg`                  | `#0a0a0b`  | App background (deepest layer)                              |
| `surface`             | `#141416`  | Sidebar, content panel base                                |
| `surface-2`           | `#1b1b1e`  | Cards (How it works, Key parameters), elevated tiles       |
| `surface-3`           | `#232327`  | Inner tiles inside cards (the M=16 / ef=200 boxes)         |
| `border`              | `#27272b`  | All hairline borders / dividers                            |
| `border-strong`       | `#34343a`  | Hover borders, active outlines                             |
| `fg`                  | `#f4f4f5`  | Primary text, headings                                     |
| `fg-muted`            | `#a1a1aa`  | Body copy, secondary text                                  |
| `fg-subtle`           | `#71717a`  | Uppercase section labels, meta, icons at rest              |
| `accent`              | `#7c5cff`  | Primary violet — logo, active nav, progress, active tab    |
| `accent-soft`         | `#7c5cff1a`| Accent at 10% — active nav bg, callout bg, badge bg        |
| `accent-fg`           | `#b5a4ff`  | Text/icon on accent-soft surfaces                          |

### Semantic / badge colors
Badges are tinted pills: ~12% background of the hue, with a brighter foreground.

| Badge        | bg class            | text class        | Used for                    |
| ------------ | ------------------- | ----------------- | --------------------------- |
| violet       | `bg-accent-soft`    | `text-accent-fg`  | `retrieval`, tag pills      |
| green        | `bg-green-soft`     | `text-green-fg`   | `graph-based`, `done`       |
| amber        | `bg-amber-soft`     | `text-amber-fg`   | `active`                    |
| blue         | `bg-blue-soft`      | `text-blue-fg`    | `new`                       |
| neutral      | `bg-surface-3`      | `text-fg-muted`   | `intermediate`, code tags   |

Badge soft/fg pairs (already in config):
- green: `#22c55e1f` / `#7ee2a8`
- amber: `#f59e0b24` / `#f4c66b`
- blue:  `#3b82f626` / `#8ab4ff`

---

## 2. Typography

Primary font: **Geist** (sans). Mono: **Geist Mono** / `ui-monospace` for code, params, numbers.
Load via system stack fallback for now: `--font-sans` and `--font-mono` in `index.css`.

| Role                  | Size / weight / tracking                       | Tailwind                          |
| --------------------- | ---------------------------------------------- | --------------------------------- |
| Page title (module)   | 30px / 600 / -0.02em / leading-tight           | `text-3xl font-semibold tracking-tight` |
| Card big number       | 30px / 700 (mono)                              | `text-3xl font-bold font-mono`    |
| Tab label             | 14px / 500                                      | `text-sm font-medium`             |
| Section label (UPPER) | 11px / 600 / 0.08em / uppercase                | `text-[11px] font-semibold uppercase tracking-[0.08em] text-fg-subtle` |
| Body                  | 14px / 400 / leading-relaxed                   | `text-sm text-fg-muted`           |
| Meta / caption        | 12px / 400                                      | `text-xs text-fg-subtle`          |
| Nav item              | 14px / 400 (500 when active)                   | `text-sm`                         |

Numbers, params (M=16, ef=200, O(log n)) and code use `font-mono`.

---

## 3. Radius & spacing

- `--radius: 0.75rem` (12px) base. Tailwind: `rounded-xl` for cards, `rounded-lg` (10px) for
  nav items / inner tiles, `rounded-full` for badges & progress bar, `rounded-md` for buttons.
- **Card**: `rounded-xl border border-border bg-surface-2 p-5`.
- **Inner tile**: `rounded-lg bg-surface-3 p-4`.
- **Sidebar width**: `260px` (`w-65` via arbitrary `w-[260px]`).
- **Content max gutter**: panel padded `px-8 py-6`.
- **Vertical rhythm**: stack sections with `gap-6`; items within a nav group `gap-1`; card
  inner content `gap-3`.
- **Badge**: `px-2.5 py-1 text-xs rounded-full` (pill), `px-2 py-0.5 text-[11px]` (small status).

---

## 4. Component idioms

- **Sidebar nav item**: full-width, `rounded-lg px-3 py-2`, icon (16px, `text-fg-subtle`) + label.
  Active = `bg-accent-soft text-fg` with the accent icon; locked = lock icon + `text-fg-subtle`,
  not interactive. Status badge floats right (`done`/`active`/`new`).
- **Group label**: uppercase section label (see typography) with `mt-6 mb-2 px-3`.
- **Progress bar**: track `h-1.5 rounded-full bg-surface-3`, fill `bg-accent`. Caption "N of M
  modules" in `text-xs text-fg-subtle`.
- **Tab bar**: row of buttons, active tab = `text-accent` with a 2px `bg-accent` underline;
  inactive = `text-fg-muted hover:text-fg`. Icon + label.
- **Callout (agent integration)**: `rounded-xl bg-accent-soft border border-accent/20 p-4`,
  accent icon, accent-tinted text, ghost button on the right.
- **Card header**: uppercase label top-left; optional action top-right.
- **Buttons**: secondary/ghost = `rounded-md border border-border bg-surface-2 px-3 py-1.5
  text-sm hover:border-border-strong`. No bright fills except the violet accent where specified.

---

## 5. Rules / do-not

- Dark theme only — do not add a light variant.
- One accent (violet). Greens/ambers/blues appear **only** as badge tints, never as fills.
- No drop shadows on cards; separation comes from `border` + `bg-surface-2`. Shadows allowed
  only on floating menus/popovers if added later.
- Borders are 1px and low-contrast. Never use pure white (`#fff`) or pure black (`#000`) for
  surfaces or text — use `fg`/`bg` tokens.
- Keep density: prefer 14px body, tight tracking on headings, generous but not loose spacing.
- Icons: lucide-react, 16px in nav/tabs, `text-fg-subtle` at rest, `currentColor` so they tint
  with their container.
