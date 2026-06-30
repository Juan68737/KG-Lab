# KG-Lab

Interactive learning app for knowledge-graph / retrieval techniques.
**Frontend:** React + TypeScript + Vite (run with `bun`).
**Backend:** Python FastAPI (spaCy NLP + sentence-transformers embeddings), managed with `uv`.

## Prerequisites

- [**bun**](https://bun.sh) — frontend package manager + dev server
- [**uv**](https://docs.astral.sh/uv/) — Python backend (pins Python 3.12, manages the venv)
- [**just**](https://github.com/casey/just) — task runner
- [**gh**](https://cli.github.com) — only for `just pr`

```sh
# install the toolchain (macOS)
curl -fsSL https://bun.sh/install | bash
curl -LsSf https://astral.sh/uv/install.sh | sh
brew install just gh
```

> If `just install` reports `uv: command not found`, open a new terminal (or
> `source ~/.local/bin/env`) so uv is on your PATH. The justfile also adds
> `~/.local/bin` to its own PATH as a safety net.

## Quick start

```sh
just install   # one-time: install frontend + backend deps
just up        # run the whole app (frontend + backend)
```

Open http://localhost:5173. That's it.

## Running the app

The app has **two parts**: the **frontend** (the React UI, port 5173) and the **backend** (the
Python API for embeddings + NLP, port 8000). Two playgrounds (Embeddings, Text→structure) call the
backend, so it needs to be running.

Pick whichever you prefer — both auto-kill anything already on their ports, so you never hit
"address already in use":

**One terminal (simplest):**
```sh
just up        # runs frontend + backend together; Ctrl-C stops both
```

**Two terminals (handy when debugging one side):**
```sh
just api       # terminal 1 — backend only  (Python API on :8000)
just dev       # terminal 2 — frontend only (React UI on :5173)
```

> First time you open the Embeddings playground, the backend downloads the ~90 MB model once,
> then caches it. The spaCy model is already installed by `just install`.

## Commands

Run `just` with no args to list everything.

| Command | What it does | When you use it |
| --- | --- | --- |
| `just up` | Run **frontend + backend** together | Day-to-day — the normal way to run the app |
| `just dev` | Run the **frontend only** (React UI, :5173) | Backend already running in another terminal |
| `just api` | Run the **backend only** (Python API, :8000) | Two-terminal setup, or testing the API |
| `just install` | Install all deps (frontend `bun` + backend `uv`) | Once after cloning, or when deps change |
| `just build` | Typecheck + production build | Before shipping / to catch type errors |
| `just pr "Title"` | Push this branch + open a PR into `main` | When your work is ready for review |

`up` / `dev` / `api` are just different combos: `up` = `dev` + `api` in one terminal.

`just pr` defaults to your current branch, so usually you just run `just pr "What you changed"`.
Override the branch with `just pr "Title" some-branch`. (Needs the [GitHub CLI](https://cli.github.com);
refuses to run from `main`.)
