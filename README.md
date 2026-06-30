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
just install   # frontend (bun) + backend (uv sync) deps
just up        # run frontend + backend together
```

The Embeddings and Text→structure playgrounds call the Python backend, so it must be running
(`just up` or `just api`). The first Embeddings request downloads the ~90 MB model once, then caches.

## Task runner (`just`)

Run `just` with no args to list everything.

| Command | What it does |
| --- | --- |
| `just install` | Install frontend + backend dependencies |
| `just up` | Run frontend + backend together |
| `just dev` | Start the Vite dev server (frontend only) |
| `just api` | Start the FastAPI backend on :8000 |
| `just build` | Typecheck + production build |
| `just preview` | Preview the production build |
| `just typecheck` | Typecheck only |
| `just pr "My PR title"` | Push the current branch and open a PR into `main` |

`just pr` defaults the PR head to your current branch, so usually you just run:

```sh
just pr "Add the justfile"
```

Override the branch if needed: `just pr "Title" some-branch`.
(Requires the [GitHub CLI](https://cli.github.com); refuses to run from `main`.)
