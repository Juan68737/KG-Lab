# KG Lab task runner. Install `just` (https://github.com/casey/just), then run
# `just` to list recipes. Uses bun under the hood.
#
#   just dev                  # start the dev server
#   just pr "My PR title"     # open a PR from the current branch -> main

set shell := ["bash", "-cu"]

# Base branch every PR targets.
base := "main"

# Show all recipes (default when you just type `just`).
default:
    @just --list

# Install dependencies.
install:
    bun install

# Start the Vite dev server.
dev:
    bun run dev

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
