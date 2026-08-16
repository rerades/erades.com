# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Area 73 (erades.com) — a multilingual (es/en) blog built with Astro 5 (server output, Node adapter, standalone mode), TypeScript (strict), and Tailwind CSS v4. Content is authored as Markdown/MDX and rendered via Astro content collections; search is powered by a build-time FlexSearch index served through an SSR API route. Package manager is **pnpm** (see `packageManager` in `package.json`); Node >= 22.13.

## Commands

```bash
pnpm dev                    # Dev server at localhost:4321
pnpm build                  # Generates FlexSearch index, then astro build (SSR)
pnpm preview                # Preview the production build
pnpm start                  # Run the built server (dist/server/entry.mjs)

pnpm lint                   # ESLint on src, --max-warnings=0
pnpm lint:fix
pnpm typecheck               # tsc --noEmit

pnpm test:unit               # Vitest, single run, verbose
pnpm test:unit:watch         # Vitest watch mode
pnpm coverage                 # Vitest with V8 coverage
pnpm test:e2e                 # Playwright (local, needs dev server running)
pnpm test:e2e:headed          # Playwright headed with PWDEBUG
pnpm docker:test:e2e          # Playwright E2E inside Docker container
pnpm docker:test:visual       # Visual regression tests inside Docker
pnpm docker:test:visual:update              # Update visual snapshots
pnpm docker:test:visual:enhanced:update

pnpm translate:es-en          # Translate es posts -> en via OpenAI (needs .env with OPENAI_API_KEY)
pnpm translate:en-es
```

Run a single unit test file: `pnpm exec vitest run src/components/BlogCard.test.ts`
Run a single Playwright spec: `pnpm exec playwright test path/to/file.spec.ts`

CI (`.github/workflows/ci.yml`) runs Lint, Type-Check, Unit-Tests, E2E-Tests (Docker), Visual-Tests (Docker), and Build as separate jobs against `master`. Match these locally before pushing: `pnpm lint && pnpm typecheck && pnpm test:unit`.

## Architecture

### Routing and i18n

- `output: "server"` with `@astrojs/node` (standalone). Locales are `es` (default, unprefixed) and `en` (prefixed `/en/...`) — set in `astro.config.mjs` (`i18n.routing.prefixDefaultLocale: false`).
- All localized pages live under `src/pages/[lang]/...` (e.g. `[lang]/blog/[...slug].astro`, `[lang]/blog/page/[page].astro`, `[lang]/tags/[tag]/[page].astro`). `lang` is validated/resolved per-route; there is no separate i18n routing middleware.
- Root-level pages (`src/pages/index.astro`, `404.astro`, `rss.js`, `feed.js`, `en/rss.js`, `rss-viewer.astro`) exist outside `[lang]` for locale-root and cross-locale concerns (combined RSS feed, XSL viewer, etc).
- Translation strings live in `src/i18n/locales/{en,es}.json`, accessed via `t(lang, key)` / `tWithInterpolation(lang, key, vars)` in `src/i18n/index.ts`. Missing keys return the key itself rather than throwing — check this when strings appear untranslated.

### Content collections

- Blog posts are Markdown/MDX under `src/content/blog/{en,es}/...` (subfolders like `functional/`, `patterns/`, `ai-take-aways/` group related posts but aren't a routing concept — the flat locale prefix is what matters).
- Schema is defined once in `src/content.config.ts` (zod): `title`, `description`, `pubDate`, `updatedDate?`, `heroImage?`, `tags[]`, `categories[]`, `draft`. When adding frontmatter fields, update this schema first — it's the single source of truth for content typing.
- `pnpm translate:*` scripts (`scripts/translate-posts.ts`) mirror posts between `en/` and `es/` via the OpenAI API — used to keep both locale trees in sync, not run automatically in CI.

### Search

- `pnpm build` first runs `scripts/generate-flexsearch-index.ts`, which walks `src/content/blog`, parses frontmatter with `gray-matter`, and writes a flattened doc list to `public/search-index.json` (locale-prefixed `path`, lowercase `id`).
- `src/pages/api/search.ts` is an SSR-only route (`export const prerender = false`) that loads that JSON at request time, builds ephemeral FlexSearch `Document`/`Index` instances (metadata fields + full content), and returns merged/deduplicated matches. The index is rebuilt per-request from the static JSON file, not persisted in memory — if search behavior seems stale, check whether `public/search-index.json` was regenerated.
- `SearchInput.astro` / `SearchPageWrapper.astro` / `HeaderSearchBox.astro` are the client-facing pieces that call this API.

### Conditional-rendering component pattern

The codebase avoids ad-hoc `{condition && <div>}` sprinkled through templates in favor of small dedicated Astro components: `Show`/`ShowWhen`, `If`/`Then`/`Else`. These use named slots (`Astro.slots.has("then")`) rather than string/children inspection. Reuse these instead of reintroducing inline boolean rendering in `.astro` files.

### Layouts

- `BlogLayout.astro` and `BlogPost.astro` wrap `Header`/`Footer`/`BaseHead` and localized styles. `BlogPost` derives its `Props` from `CollectionEntry<"blog">["data"]` (with `pubDate` made optional) plus `lang` — keep layout props in sync with the content schema rather than redefining shapes.

### Path aliases

Defined in both `astro.config.mjs` and `vitest.config.ts` (keep them in sync if changed):
- `@components` → `src/components`
- `~` → `src`

## Conventions

These come from `.cursor/rules/*.mdc` and apply to Claude Code edits too:

- **Astro components**: filenames PascalCase (`^[A-Z][a-zA-Z0-9]*\.astro$`); define props via `interface Props`; use `class`, never `className`, in `.astro` markup; never use Tailwind's `@apply`.
- **TypeScript files**: kebab-case filenames; camelCase vars/functions; PascalCase types/interfaces/classes; `import type` for type-only imports (top-level, not inline `import { type X }`); no default exports unless the framework requires one; prefer `interface extends` over `&` intersections for inheritance; `readonly` properties by default; explicit return types on top-level functions (except components returning JSX/Astro templates); avoid `any` outside generic function bodies; prefer discriminated unions over "bag of optional fields" types; don't add new TS `enum`s — use `as const` objects instead.
- **Strict mode**: `tsconfig.json` extends `astro/tsconfigs/strict` — `noUncheckedIndexedAccess` semantics apply (indexed access returns `T | undefined`).
- **Error handling**: prefer a `Result<T, E>`-style return over throwing for code whose caller would need a manual try/catch; reserve throws for cases where the framework/runtime is expected to catch them.
- **No `console.log`** left in `.ts`/`.astro` files.
- Favor early returns and named intermediate variables over deeply nested/compound conditionals.

## Testing

- Unit tests (Vitest + happy-dom) are colocated next to source, e.g. `src/components/BlogCard.astro` + `src/components/BlogCard.test.ts`. Config: `vitest.config.ts`, setup in `src/test/setup.ts`.
- Astro components are unit-tested by rendering through `AstroContainer` via the `renderAstroComponent` helper in `src/test/helpers.ts`, then asserting on the resulting DOM (e.g. with `@testing-library/dom`'s `getByText`). Follow this pattern (see `Show.test.ts`) rather than snapshotting raw HTML strings.
- E2E specs run with Playwright (`playwright.config.ts` for functional E2E, `playwright.visual.config.ts` for visual regression) and are expected to run **inside Docker** for consistency with CI (`pnpm docker:test:e2e`, `pnpm docker:test:visual`); the `pnpm test:e2e*` scripts run Playwright directly against a locally running dev server.
- Keep the Docker Playwright image tag (`Dockerfile.visual-test`) and the `@playwright/test` version in `package.json` in sync — a mismatch is a known source of CI failures (see `docs/docker.md`).

## Docker / Lighthouse

- `Dockerfile` builds the production standalone server; `Dockerfile.visual-test` builds the container used for E2E/visual Playwright runs (see `docker-compose.yml`).
- `docker-compose.lhci.yml` + the `lhci:*` scripts run a local Lighthouse CI server backed by a SQLite DB at `db/lighthouse/lhci.db` (tracked via **Git LFS** — see `.gitattributes`). `lighthouserc.cjs` / `lighthouserc.desktop.cjs` configure mobile/desktop assertions; `pnpm lhci:ci:both` runs both against `.env`.
