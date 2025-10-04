# Repository Guidelines

## Project Structure & Module Organization
Nuxt 4 loads entry from `app/app.vue`; keep page-level features under `app/routes/<feature>` with co-located stores/composables. Shared UI like buttons or layouts in `app/components/`, and design tokens in `app/assets/`. Agent instructions live in `agents/` for cross-team context; update alongside feature work. Static files (logos, manifest, fonts) belong in `public/`. Core configuration sits in `nuxt.config.ts` and owns module registration, runtime config, and Tailwind/Nuxt UI setup. TypeScript baselines live in `tsconfig.json`; extend via `compilerOptions` instead of replacing defaults.

## Build, Test, and Development Commands
`pnpm install` prepares dependencies and runs `nuxt prepare` to refresh types. `pnpm dev` launches the HMR dev server at http://localhost:3000. `pnpm build` compiles a production bundle; run before pushing release branches. `pnpm generate` produces a static export for Jamstack deploys. `pnpm preview` serves the built output locally so you can verify prod behaviour.

## Coding Style & Naming Conventions
Use `<script setup lang="ts">` with 2-space indentation and single quotes in templates. Name components in PascalCase (`ProductGrid.vue`) and composables/stores in camelCase (`useCart`). Scope component styles with `<style scoped>` and place shared tokens in `app/assets/`. Follow the root ESLint config (`@antfu/eslint-config` + `@unocss/eslint-plugin`) and run your formatter before committing to retain Nuxt auto-import ordering.

## Testing Guidelines
Vitest is the preferred runner when tests are introduced; place specs under `tests/unit/` mirroring the source path (`ProductGrid.spec.ts`). Stub Nuxt composables via `@nuxt/test-utils` and cover loading, failure, and empty states when hitting FakeStoreAPI. Document any intentionally skipped cases in the PR description until coverage is in place.

## Commit & Pull Request Guidelines
Write imperative, concise commit subjects (`Add product carousel`). Squash experimental commits before opening a PR. Each PR should describe scope, link relevant issues, and attach screenshots or recordings for UI changes plus the latest `pnpm build` or `pnpm preview` check. Note follow-up tasks or config changes that reviewers should track.

## Security & Configuration Tips
Keep API keys and FakeStore overrides in local `.env` files and reference them via runtime config; never commit secrets. Review `nuxt.config.ts` for CSP or proxy adjustments before introducing third-party scripts.

## Additional Information
- use the context7-mcp server to look up documentation for various frameworks that you will encounter for reference
- Nuxt 4 is the framework used. use the context7-mcp server to look up documentation
- Nuxt UI is used in this project. Nuxt UI is the official Nuxt-native component framework and design system, built with Tailwind and Radix primitives. It gives you themable, composable components
- For product information we are using 'FakeStoreAPI' at https://github.com/keikaavousi/fake-store-api
