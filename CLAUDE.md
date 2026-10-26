# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

David Lacourt's personal blog (https://lacourt.dev), a fully prerendered SvelteKit 2 / Svelte 5 static site. Posts are Markdown compiled by mdsvex. Deployed to Netlify, which also hosts the serverless functions in `lambda/`.

## Commands

```bash
npm install          # postinstall runs svelte-kit sync, applies patches/ via patch-package, and installs lambda/ deps
npm run dev          # Vite dev server on http://localhost:3000
npm run build        # static build into build/ (adapter-static)
npm run check        # svelte-check type checking
npm test             # serves build/ on :8080 (http-server) and runs all Cypress e2e tests — run `npm run build` first
npm run cy:open      # interactive Cypress
npx cypress run --spec cypress/e2e/home.cy.ts   # single spec (needs `npm run serve` running on :8080)
npm run start:lambda # serve Netlify functions locally (netlify-cli, port 9999)
```

CI (`.github/workflows`, Node 24) runs `npm ci && npm run build && npm test` on every push. There are no unit tests or linter; Cypress e2e against the built site is the test suite. Coverage instrumentation (vite-plugin-istanbul) only activates when `CYPRESS_COVERAGE=true` is set.

## Architecture

**Posts pipeline.** `src/posts/*.md` (or `.svx`) are imported eagerly with `import.meta.glob` in `src/lib/posts.js`, which builds the single in-memory `POSTS` list (sorted newest first) used by every route, the RSS feed (`src/routes/rss`) and the sitemap. Each post module's `default` export is the rendered Svelte component; frontmatter comes from `metadata`.

**Frontmatter matters for routing.** The `slug` frontmatter field overrides the filename-derived slug and determines the URL:
- Dated posts use `slug: YYYY/MM/DD` → served by `src/routes/[year]/[month]/[day]`. The filename date is not used for routing.
- `slug: future/<name>` and `slug: alternate-reality/<name>` are hidden posts (files named `FUTURE-*` / `ALTERNATE-*`) served by their own routes and excluded from listings.
- Only `published: true` posts appear on the home page/RSS (`getPublishedPosts`).
- Other fields: `title`, `date`, `description`, `lang` (`en` default or `fr`; affects date formatting and reading time), `category` and `tags` (comma-separated strings), `keywords`, `thumb`.

**mdsvex config** (`mdsvex.config.js`) adds remark/rehype plugins: a custom plugin that injects `wordCount` into frontmatter (used for minutes-to-read), oEmbed embeds, abbreviations, twemoji, PlantUML (rendered via plantuml.com), figures, heading slugs/anchors, and external links opened in a new tab with `rel=noopener`. Markdown posts can embed Svelte components.

**Everything is prerendered** (`export const prerender = true` in `src/routes/+layout.js` and each `+page.js`/`+server.js`); there is no server runtime. Dynamic behaviour lives client-side or in Netlify functions.

**Other areas:**
- `src/routes/playground/*` — standalone interactive toys (music tools using tone/tonal/vexflow, poker planning, timers, etc.) not tied to posts.
- `src/lib/stores/i18n.js` — homemade en/fr i18n via a tagged-template store (`$i18n\`key\``); add labels for both languages there.
- `lambda/src/*` — Netlify functions (CommonJS, separate `package.json`) for the poll feature (Airtable + Pusher).
- `svelte.config.js` compiles a component as a custom element when it detects a `tag=` option inside `<svelte:options>`.
- `patches/` — patch-package fixes for twemoji, twemoji-parser and hast-util-to-string; keep them in sync if those dependency versions change.

**Cypress specifics.** Tests import `cy`/`Cypress` from `local-cypress` rather than globals. `cypress/common.ts` holds shared assertions and switches expected framework names on the `BLOG_JAMSTACK` env (set to `svelte-kit` in `cypress.config.ts`).

Dependencies are pinned to exact versions and updated by Renovate.
