# Repository Guidelines

## Project Structure & Module Organization
Nuxt 4 loads from `app/app.vue`; feature routes and their composables or stores live under `app/routes/<feature>`. Shared UI belongs in `app/components/`, while design tokens sit in `app/assets/`. Keep agent briefs or automation context in `agents/`. Static assets such as icons, fonts, or manifest files belong in `public/`. TypeScript baselines stay in `tsconfig.json`, and configuration for modules, runtime values, Tailwind, and Nuxt UI is centralized in `nuxt.config.ts`.

## Build, Test, and Development Commands
Run `pnpm install` to install dependencies and trigger `nuxt prepare` for fresh type generation. Use `pnpm dev` for the hot-reload server at http://localhost:3000. Execute `pnpm build` before sharing release branches, and `pnpm preview` to serve the build locally. For Jamstack exports, `pnpm generate` emits static assets ready for deployment.

## Coding Style & Naming Conventions
Prefer `<script setup lang="ts">` with 2-space indentation and single quotes in templates. Components follow PascalCase (`ProductGrid.vue`), composables and Pinia stores use camelCase (`useCart`). Scope component styles with `<style scoped>`. Run the repository formatter before committing to preserve Nuxt auto-import ordering, and rely on the root ESLint config (`@antfu/eslint-config` plus `@unocss/eslint-plugin`) for linting.

## Testing Guidelines
Vitest is the default test runner. Place unit specs in `tests/unit/`, mirroring the source path (`ProductGrid.spec.ts`). When stubbing Nuxt composables, use `@nuxt/test-utils`. Cover loading, empty, and failure states when calling FakeStoreAPI, and document any deferred cases if full coverage is not yet feasible.

## Commit & Pull Request Guidelines
Write concise, imperative commits (`Add product carousel`) and squash exploratory work before opening a PR. Each pull request should outline scope, link issues, and include screenshots or recordings for UI changes. Attach the latest `pnpm build` or `pnpm preview` results, and flag any follow-up tasks or configuration updates reviewers must track.

## Security & Configuration Tips
Do not commit secrets; keep FakeStoreAPI overrides or keys in local `.env` files and read them via Nuxt runtime config. Review `nuxt.config.ts` before adding external scripts to confirm CSP or proxy adjustments. Keep dependencies current and note any permission-sensitive changes in PR descriptions.

## MCP Servers
Use the `context7` MCP server to search documentation for Nuxt, Nuxt UI, Pinia, or other dependencies before introducing new patterns. Reach for the `sequential-thinking` MCP server when a task needs a structured reasoning walkthrough or plan; it helps break problems into actionable steps while keeping context.
