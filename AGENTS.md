# AGENTS.md

## What this repo is

`invoice-cli`: a command line tool that normalizes usage records and groups them into invoice batches. Part of the `factorydependencydefense` fleet.

## Commands

- Install: `npm ci`
- Build: `npm run build` (esbuild bundle to `dist/invoice.js`)
- Test: `npm test` (`node --test`, under 60 seconds)
- Run: `node bin/invoice.js batch <file>`

## Rules

- Never push to `main`. Commit on a `droid/<job>` branch; the harness opens the PR.
- Never pick a package version from memory. Use `npm view <pkg> versions --json`.
- A change is done only when `npm run build` and `npm test` both pass.
- Keep diffs small: one concern per PR.
