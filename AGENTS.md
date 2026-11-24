# AGENTS.md

Durable, non-obvious project guidance for agents. Keep task-specific notes out.

## Context

Selection project for a small task manager. Favor a simple, working, idiomatic implementation over abstraction. Tasks are kept in memory by design: there is no database or persistence layer, and do not add infrastructure (auth, test runner, formatter) without a deliberate decision.

## Rules

- **English only.** Code, identifiers, comments, UI copy, error messages, and repository documentation are written in English.
- **Server boundary.** `src/server/` is server-only; never import it from client components. `src/lib/` is safe for both server and client.
- **Verify before handoff.** Run `npm run lint` and `npm run build`; the build also type-checks.
- **Tooling.** Node 22 and npm. Don't hand-edit `package-lock.json` or introduce another package manager.
