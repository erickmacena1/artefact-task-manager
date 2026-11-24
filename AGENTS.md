# AGENTS.md

Durable, project-wide guidance for AI agents working in this repository. Keep task-specific notes out of this file, and update it whenever a project-wide convention or decision changes.

## Project

ARTEFACT task manager — a small task-management web app built as a selection project. Prefer a clear, working, idiomatic implementation over unnecessary abstraction.

## Stack

- **Framework:** Next.js 15.5 with App Router and Turbopack; React 19
- **Language:** TypeScript 5 (`strict: true`)
- **API:** tRPC 11 (`@trpc/server`, `@trpc/client`, `@trpc/tanstack-react-query`) with TanStack Query 5
- **Validation:** Zod 4
- **Styling:** Tailwind CSS 4 through `@tailwindcss/postcss`
- **Linting:** ESLint 9 flat config (`next/core-web-vitals`, `next/typescript`)
- **Tooling:** npm with a committed `package-lock.json`; developed on Node 22 / npm 10

`package.json` is the source of truth for available libraries and scripts. Don't assume a dependency exists, and don't introduce infrastructure (database, auth, test runner, formatter) implicitly — add it deliberately and document the decision.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:3000 (Turbopack) |
| `npm run build` | Production build (Turbopack; also type-checks) |
| `npm start` | Serve the production build |
| `npm run lint` | Run ESLint over the repo |

Before handing off code changes, run `npm run lint` and `npm run build`. These are the only scripts; there is no separate test or typecheck command.

## Layout

- `src/app/` — App Router routes, layouts, metadata, and `globals.css`.
- `src/app/api/trpc/[trpc]/route.ts` — tRPC fetch-adapter endpoint (GET for queries, POST for mutations).
- `src/trpc/` — tRPC setup: `init.ts` (instance, context, procedure/router helpers) and `routers/` (root router in `_app.ts`).
- `src/` outside `app/` — shared application code, imported via the `@/*` alias (maps to `src/*`). Avoid deep relative imports.
- `.agents/skills/` — vendored agent skills; `.claude/skills/` symlinks into it; `skills-lock.json` pins their source and version.

## Conventions

- **Server-first React.** Components are Server Components by default. Add `"use client"` only when state, effects, event handlers, or browser APIs require it, and keep it as low in the tree as possible. Never import server-only code into a client component.
- **Next.js 15 async APIs.** `cookies()`, `headers()`, and page `params`/`searchParams` are async; await them.
- **Zod 4.** Validate data at boundaries (user input, tRPC inputs) with Zod schemas and infer types from them. Most examples online target Zod 3, so check the v4 API.
- **Tailwind 4 is CSS-first.** Configuration lives in `src/app/globals.css` via `@import "tailwindcss"` and `@theme`; there is no `tailwind.config.*`. Add design tokens in `@theme`.
- **tRPC versions move together.** All `@trpc/*` packages peer-depend on each other at the exact same version; upgrade them together.
- **tRPC integration.** Use `@trpc/tanstack-react-query`, not the legacy `@trpc/react-query`. Server Components should prefetch through the shared QueryClient and hydrate it for client components.
- **TanStack Query 5.** Use the v5 object-argument API; query callbacks such as `onSuccess`/`onError` no longer exist.
- **Comments.** Comment only non-obvious logic or intent (the *why*); don't narrate self-explanatory code or add a comment per line.
- **npm only.** Use npm for installs and scripts; don't hand-edit `package-lock.json` or add another package manager.
- **Generated files.** Don't edit `next-env.d.ts`. Don't commit `.next/`, `node_modules/`, or env files.

## Skills

A vendored `vercel-react-best-practices` skill lives at `.agents/skills/vercel-react-best-practices/SKILL.md`. Consult it before writing, reviewing, or refactoring React/Next.js code; it indexes 70 performance rules with details in `rules/`.
