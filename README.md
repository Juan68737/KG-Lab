# KG-Lab

## Task runner (`just`)

This repo uses [`just`](https://github.com/casey/just) as a task runner (wraps bun).
Run `just` with no args to list everything.

| Command | What it does |
| --- | --- |
| `just install` | Install dependencies |
| `just dev` | Start the dev server |
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
