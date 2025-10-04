# Repository Guidelines

## Project Structure & Module Organization
- Nuxt 4 loads from `app/app.vue`; group shared UI in `app/components/` and route-specific logic under folders you create in `app/` (e.g., `app/routes/shop`).
- Use `public/` for static assets served verbatim (logos, manifest files) and keep generated files out of version control.
- Central configuration lives in `nuxt.config.ts`; update it when adding modules, runtime config, or build tweaks.
- `tsconfig.json` defines the base TypeScript settings; extend it instead of overwriting defaults. Dependencies are managed through `package.json` and `pnpm-lock.yaml`.

## Build, Test, and Development Commands
- `pnpm install` – install workspace dependencies; rerun after updating Nuxt modules.
- `pnpm dev` – start the Nuxt development server with HMR at the default port.
- `pnpm build` – produce an optimized production bundle; run before deployment.
- `pnpm generate` – create a static site build when targeting Jamstack hosting.
- `pnpm preview` – serve the production build locally to verify deployment artifacts.

## Coding Style & Naming Conventions
- Prefer `<script setup lang="ts">` in Vue SFCs with 2-space indentation.
- Name Vue components in PascalCase (`ProductGrid.vue`) and composables/stores in camelCase (`useCart`).
- Co-locate component-specific styles using `<style scoped>` and keep shared tokens in a dedicated `app/assets/` folder.
- Run an editor-integrated formatter (Prettier or equivalent) before committing; align imports to Nuxt auto-import rules.

## Testing Guidelines
- Tests are not configured yet; when introducing them, add Vitest-based suites under `tests/unit/` and mock Nuxt composables via `@nuxt/test-utils`.
- Use descriptive `*.spec.ts` filenames that mirror the component or composable under test.
- Ensure critical features cover edge cases (loading state, API errors) and document any gaps in the PR.

## Commit & Pull Request Guidelines
- Follow the existing history by writing concise, imperative commit subjects (e.g., `Add product gallery carousel`).
- Squash WIP commits before opening a PR and reference related issue keys in the body.
- PRs should summarize scope, list test evidence (`pnpm build`, screenshots for UI), and note any follow-up work.

## Additional Information
- use the context7-mcp server to look up documentation for various frameworks that you will encounter for reference
- Nuxt 4 is the framework used. use the context7-mcp server to look up documentation
- Nuxt UI is used in this project. Nuxt UI is the official Nuxt-native component framework and design system, built with Tailwind and Radix primitives. It gives you themable, composable components
