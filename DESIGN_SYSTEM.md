# KG Lab — Design System

> **For Claude:** Read this file before making ANY UI change. Every color, radius, font, and
> spacing value used in components must come from the tokens below. Do not introduce new hex
> values, ad-hoc paddings, or one-off font sizes without adding them here first. Match the
> existing component idiom (see `src/components/`).

KG Lab is a **dark-only**, two-column learning app: a left sidebar (progress + grouped module
nav), a top header bar (collapse toggle, search, action icons, avatar), and a main content panel
(tabbed module detail). The aesthetic follows **AdminCN**: pure-black background, dark-gray cards
with large radius and generous padding, **monochrome** white/gray treatment (no color fills),
sentence-case section headings, and heavy numeric typography.

---

## 1. Color tokens

All colors are exposed as Tailwind theme colors (see `tailwind.config.js`) and as CSS variables
in `src/index.css`. **Use the Tailwind class, not raw hex.** This palette is **monochrome** —
active states, buttons, and emphasis use white/gray, never a colored fill.

| Token (Tailwind)      | Hex        | Use                                                        |
| --------------------- | ---------- | ---------------------------------------------------------- |
| `bg`                  | `#000000`  | App background (pure black, deepest layer)                 |
| `surface`             | `#0c0c0d`  | Sidebar, header, content panel base                        |
| `surface-2`           | `#161618`  | Cards (stat cards, How it works, Key parameters)           |
| `surface-3`           | `#1f1f22`  | Inner tiles inside cards, icon tiles, search field         |
| `border`              | `#222225`  | All hairline borders / dividers                            |
| `border-strong`       | `#303035`  | Hover borders, active outlines                             |
| `fg`                  | `#fafafa`  | Primary text, headings, big numbers                        |
| `fg-muted`            | `#a1a1aa`  | Body copy, secondary text                                  |
| `fg-subtle`           | `#6f6f78`  | Section labels, meta, icons at rest                        |
| `accent`              | `#fafafa`  | **Monochrome** emphasis — active nav, progress, active tab |
| `accent-soft`         | `#ffffff14`| White at ~8% — active nav bg, hover bg, subtle tiles       |
| `accent-fg`           | `#fafafa`  | Text/icon on accent-soft surfaces                          |

### Status badge colors
Status pills keep a faint hue so progress is scannable (done/active/new), but they are the ONLY
colored elements in the UI. Everything else is monochrome. Tags like `retrieval`/`graph-based`
use the **neutral** pill (no hue).

| Badge        | bg class            | text class        | Used for                    |
| ------------ | ------------------- | ----------------- | --------------------------- |
| green        | `bg-green-soft`     | `text-green-fg`   | `done`                      |
| amber        | `bg-amber-soft`     | `text-amber-fg`   | `active`                    |
| blue         | `bg-blue-soft`      | `text-blue-fg`    | `new`                       |
| neutral      | `bg-surface-3`      | `text-fg-muted`   | tags, `intermediate`, code  |

Badge soft/fg pairs (already in config):
- green: `#22c55e1f` / `#7ee2a8`
- amber: `#f59e0b24` / `#f4c66b`
- blue:  `#3b82f626` / `#8ab4ff`

---

## 1b. Light theme (toggle)

The app supports **light and dark** via a header toggle. Tokens are CSS variables defined in
`src/index.css`: dark on `:root` (default), light under `[data-theme="light"]`. **Components
never branch on theme** — they use the same Tailwind token classes (`bg-surface-2`, `text-fg`…)
and the variable values swap. Light is the inverse of AdminCN dark (white/light-gray monochrome).

| Token         | Dark        | Light       |
| ------------- | ----------- | ----------- |
| `bg`          | `#000000`   | `#ffffff`   |
| `surface`     | `#0c0c0d`   | `#fafafa`   |
| `surface-2`   | `#161618`   | `#ffffff`   |
| `surface-3`   | `#1f1f22`   | `#f1f1f3`   |
| `border`      | `#222225`   | `#e6e6e9`   |
| `border-strong` | `#303035` | `#d2d2d8`   |
| `fg`          | `#fafafa`   | `#0a0a0b`   |
| `fg-muted`    | `#a1a1aa`   | `#52525b`   |
| `fg-subtle`   | `#6f6f78`   | `#8a8a93`   |
| `accent`      | `#fafafa`   | `#0a0a0b`   |
| `accent-soft` | `#ffffff14` | `#0000000d` |
| `accent-fg`   | `#fafafa`   | `#0a0a0b`   |

Status badge hues (green/amber/blue) stay the same in both themes.

---

## 2. Typography

Primary font: **Geist** (sans). Mono: **Geist Mono** / `ui-monospace` for code, params, numbers.
Load via system stack fallback for now: `--font-sans` and `--font-mono` in `index.css`.
AdminCN uses **sentence-case** section headings (not uppercase-tracked) and **heavy numerals**.

| Role                  | Size / weight / tracking                       | Tailwind                          |
| --------------------- | ---------------------------------------------- | --------------------------------- |
| Page title (module)   | 30px / 600 / -0.02em / leading-tight           | `text-3xl font-semibold tracking-tight` |
| Card big number       | 30px / 700 (mono)                              | `text-3xl font-bold font-mono`    |
| Section heading       | 15px / 600 (sentence case)                     | `text-[15px] font-semibold`       |
| Tab label             | 14px / 500                                      | `text-sm font-medium`             |
| Group label (sidebar) | 11px / 600 / 0.06em / uppercase                | `text-[11px] font-semibold uppercase tracking-[0.06em] text-fg-subtle` |
| Body                  | 14px / 400 / leading-relaxed                   | `text-sm text-fg-muted`           |
| Meta / caption        | 12px / 400                                      | `text-xs text-fg-subtle`          |
| Nav item              | 14px / 400 (500 when active)                   | `text-sm`                         |

Numbers, params (M=16, ef=200, O(log n)) and code use `font-mono`. Sidebar group labels stay
uppercase; in-card section headings (e.g. "Key parameters") are sentence case, AdminCN-style.

---

## 3. Radius & spacing (AdminCN scale — roomier)

- `--radius: 1rem` (16px) base. Tailwind: `rounded-2xl` for cards, `rounded-xl` (12px) for inner
  tiles, `rounded-lg` for nav items / buttons, `rounded-full` for badges & progress.
- **Card**: `rounded-2xl border border-border bg-surface-2 p-6` (generous padding).
- **Inner tile**: `rounded-xl bg-surface-3 p-4`.
- **Icon tile**: `size-9 rounded-lg bg-surface-3` centering a 16–18px muted icon.
- **Sidebar width**: `260px` (`w-[260px]`); collapsible.
- **Header height**: `h-16`, `px-5`, bottom `border-border`.
- **Content gutter**: panel padded `px-8 py-7`, content `max-w-5xl`.
- **Vertical rhythm**: sections `gap-6`; nav-group items `gap-1`; card inner content `gap-3`.
- **Badge**: `px-2.5 py-1 text-xs rounded-full` (pill), `px-2 py-0.5 text-[11px]` (small status).

---

## 4. Component idioms

- **Top header**: `h-16` bar, left = sidebar-collapse toggle; center-left = search field
  (`rounded-lg bg-surface-3` with `⌘K` hint); right = action icons (activity, bell w/ dot,
  theme toggle, palette) + avatar. Icons `text-fg-subtle`, `size-[18px]`.
- **Theme toggle**: animated sun/moon button in the header; flips `[data-theme]` with a
  **corner-to-corner circular wave** via the View Transitions API (see §6).
- **Sidebar nav item**: full-width `rounded-lg px-3 py-2`, icon (16px, `text-fg-subtle`) + label.
  Active = `bg-accent-soft text-fg` (monochrome) with `text-fg` icon; locked = lock icon +
  `text-fg-subtle`, not interactive. Status badge floats right.
- **Group label**: uppercase sidebar section label with `mt-6 mb-2 px-3`.
- **Progress bar**: track `h-1.5 rounded-full bg-surface-3`, fill `bg-accent` (white in dark).
- **Tab bar**: active tab = `text-fg` with a 2px `bg-fg` underline; inactive = `text-fg-muted
  hover:text-fg`. Monochrome — no colored underline.
- **Callout**: `rounded-2xl bg-surface-2 border border-border p-5`, monochrome icon + `text-fg`
  copy, ghost button on the right. (No tinted accent fill.)
- **Card header**: sentence-case heading top-left; optional action/`⋮` top-right.
- **Buttons**: secondary/ghost = `rounded-lg border border-border bg-surface-2 px-3.5 py-2
  text-sm hover:border-border-strong`. Primary (rare) = `bg-fg text-bg` (inverted), AdminCN's
  "Buy Now"/"Pay now" style.

---

## 5. Rules / do-not

- **Monochrome.** Active states, buttons, progress, tabs, callouts use white/gray (token
  `accent` = `fg`). The ONLY colored elements are status badges (done/active/new).
- **Data-viz exception.** Interactive playground visualizations may use a small, muted categorical
  palette to distinguish data classes (e.g. knowledge-graph entity types). This is the one place
  color is allowed beyond status badges. Keep it restrained, define the palette in one data module
  (e.g. `playgrounds/kgExplorerData.ts`), and ensure it reads on both themes. Chrome/UI around the
  viz stays monochrome.
- Support light + dark via `[data-theme]` CSS variables — never branch component code on theme.
- No drop shadows on cards; separation comes from `border` + `surface-2`. Shadows allowed only on
  floating menus/popovers and the avatar's online dot.
- Borders are 1px and low-contrast. Use `fg`/`bg`/`surface-*` tokens, not raw `#fff`/`#000`.
- Density with air: 14px body, tight heading tracking, AdminCN's roomy card padding (`p-6`).
- Icons: lucide-react, `currentColor`, `text-fg-subtle` at rest so they tint with their container.

---

## 6. Theme transition (corner wave)

The header toggle animates the light↔dark swap as a circular reveal that sweeps from the button's
corner across the screen (a "wave"). Implementation lives in `src/theme.ts` /
`AnimatedThemeToggle`:

- Use `document.startViewTransition()` (View Transitions API). Inside the callback, set
  `data-theme` on `<html>` and persist to `localStorage`.
- In CSS, give `::view-transition-new(root)` a `clip-path: circle()` keyframe that grows from a
  small radius at the click origin (`--wave-x` / `--wave-y`, set from the button's bounding rect)
  to a radius covering the viewport. `::view-transition-old(root)` stays put underneath.
- Respect `prefers-reduced-motion`: skip the animation, swap instantly.
- Fallback: if `startViewTransition` is unavailable, just toggle `data-theme` (instant).
