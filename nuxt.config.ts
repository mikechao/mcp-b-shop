import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      fakeStoreApiBase: 'https://fakestoreapi.com',
      mcpAllowedOrigins: process.env.NUXT_PUBLIC_MCP_ALLOWED_ORIGINS
        ?? process.env.NITRO_PUBLIC_MCP_ALLOWED_ORIGINS
        ?? [
          'http://localhost:3000',
          'http://127.0.0.1:8788',
          'http://localhost:8788',
          'https://mcp-b-shop.pages.dev',
          'https://mcp-b.shop',
          'https://www.mcp-b.shop',
        ].join(','),
    },
  },
  modules: ['@nuxt/ui', '@pinia/nuxt'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral', 'brand', 'accent'],
    },
  },
  alias: {
    types: fileURLToPath(new URL('./app/types', import.meta.url)),
  },
  nitro: {
    // Build target for Cloudflare Pages (uses Pages Functions / Workers runtime)
    preset: 'cloudflare-pages',
  },
  vite: {
    optimizeDeps: {
      include: [
        'fuse.js',
        'lucide-vue-next',
        'zod',
        'zod-to-json-schema',
        '@mcp-b/transports',
        '@modelcontextprotocol/sdk/server/mcp.js',
      ],
    },
  },
})
