# MCP-B Shop

MCP-B Shop is a Nuxt-powered storefront demonstrating how the [mcp-b.ai](https://mcp-b.ai) assistant uses natural language and the Model Context Protocol to drive real-time website interactions. It combines polished Nuxt UI components with an embedded MCP server that registers shopping tools for the assistant; install the MCP-B Chrome extension and try asking it to “Search for orange cat in the MCP-B Shop” to watch the assistant browse, filter, and act for you. [Get the extension →](https://chromewebstore.google.com/detail/mcp-b-extension/daohopfhkdelnpemnhlekblhnikhdhfa)

## Tech Stack

- Nuxt 4 with Vue 3 and Vite
- TypeScript with `<script setup>` authoring
- Nuxt UI component library and design tokens
- Tailwind CSS utilities layered via `app/assets/css`
- Pinia store for the shopping cart state
- Model Context Protocol integrations using `@mcp-b/transports` and `@modelcontextprotocol/sdk`
- Fuse.js fuzzy search across Fake Store products

## Key Features

- Product catalog backed by the Fake Store API with client-side pagination and filtering
- Fuse.js search with helpful empty/error states and Nuxt UI skeleton placeholders
- Persistent cart drawer powered by Pinia with quantity controls and toasts
- Built-in MCP server that exposes on-page search tools to the MCP-B assistant
- Accessible UI primitives from Nuxt UI, including alerts, pagers, breadcrumbs, and buttons

## Getting Started

### 1. Install dependencies

```bash
pnpm install
```

The postinstall hook runs `nuxt prepare` to generate fresh types for auto-imported composables and components.

### 2. Run the development server

```bash
pnpm dev
```

The app will be available at http://localhost:3000 with hot module replacement enabled.

### 3. Build for production

```bash
pnpm build
```

### 4. Preview the production build locally

```bash
pnpm preview
```

### 5. Generate a static output (Jamstack)

```bash
pnpm generate
```

## Project Structure

- `app/pages` – route-driven views for the storefront experience
- `app/components` – shared UI, including the demo notice, cart drawer, and product cards
- `app/stores` – Pinia stores, such as the cart state
- `app/utils` – helpers for Fuse.js search and MCP tooling
- `nuxt.config.ts` – Nuxt 4 configuration, module setup, and design tokens
- `agents/` – MCP agent briefs and automation context

## Environment

The Fake Store API base URL defaults to `https://fakestoreapi.com` via `runtimeConfig.public.fakeStoreApiBase`. Override it by defining `NUXT_PUBLIC_FAKE_STORE_API_BASE` (or the equivalent `NITRO_PUBLIC_` prefix) in your `.env` file if you want to point at a different data source.

## Contributing

1. Fork and clone the repository.
2. Create a branch and make your changes.
3. Run the relevant `pnpm` scripts (`pnpm dev`, `pnpm build`, or `pnpm preview`) to verify the app.
4. Open a pull request with a summary, screenshots for UI changes, and any follow-up tasks.

## Deploy to Cloudflare Pages

This project is configured to build for Cloudflare Pages using Nitro's `cloudflare-pages` preset.

1) Build the project (produces the Pages/Functions output in `dist`/`.output`):

```bash
pnpm build
```

2) Local preview (emulates Pages + Functions). Requires `wrangler` installed as a dev dependency (already added):

```bash
pnpm run dev:pages
```

3) Direct publish (one-off upload from the local build):

```bash
npx wrangler pages publish dist --project-name mcp-b-shop
```

4) Git integration (recommended for continuous deploys):

- Connect the repository to Cloudflare Pages via the Pages dashboard.
- Build command: `pnpm build`
- Build output directory: `.output/public`
- Production branch: `main` (or your chosen branch)

Notes:
- If you need Cloudflare bindings (KV, R2, D1), configure them in the Pages dashboard and add local bindings to `wrangler.toml` for development.
- To generate Cloudflare types for TypeScript bindings run `wrangler types` when needed.
