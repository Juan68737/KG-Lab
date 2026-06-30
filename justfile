# KG Lab task runner. Install `just` (https://github.com/casey/just), then run
# `just` to list recipes. Uses bun under the hood.
#
#   just dev                  # start the dev server
#   just pr "My PR title"     # open a PR from the current branch -> main

set shell := ["bash", "-cu"]

# Make uv (installed to ~/.local/bin) reachable from recipes even if the current
# shell hasn't sourced ~/.local/bin/env yet (e.g. a terminal opened before uv
# was installed). Also covers bun's default install dir.
export PATH := env_var('HOME') / ".local/bin" + ":" + env_var('HOME') / ".bun/bin" + ":" + env_var('PATH')

# Base branch every PR targets.
base := "main"

# Show all recipes (default when you just type `just`).
default:
    @just --list

# Install all dependencies (frontend + Python backend).
install:
    bun install
    cd backend && uv sync

# Start the Vite dev server (frontend only).
dev:
    bun run dev

# Start the FastAPI backend (NLP + embeddings) on :8000.
api:
    cd backend && uv run uvicorn app.main:app --reload --port 8000

# Run frontend + backend together (Ctrl-C stops both).
up:
    #!/usr/bin/env bash
    set -euo pipefail
    trap 'kill 0' EXIT
    (cd backend && uv run uvicorn app.main:app --reload --port 8000) &
    bun run dev &
    wait

# Production build (typecheck + bundle).
build:
    bun run build

# Preview the production build.
preview:
    bun run preview

# Typecheck only (no emit).
typecheck:
    bunx tsc --noEmit

# Open a PR from the CURRENT branch into `main`.
#   just pr "Add HNSW overview page"
# Pushes the branch first (sets upstream), then creates the PR with gh.
pr title head=`git rev-parse --abbrev-ref HEAD`:
    @test "{{head}}" != "{{base}}" || { echo "error: you're on '{{base}}'. Switch to a feature branch first."; exit 1; }
    git push --set-upstream origin "{{head}}"
    gh pr create --base "{{base}}" --head "{{head}}" --title "{{title}}" --body ""
