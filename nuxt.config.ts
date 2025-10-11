import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      fakeStoreApiBase: 'https://fakestoreapi.com',
    },
  },
  modules: ['@nuxt/ui', '@pinia/nuxt', '@nuxtjs/color-mode'],
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '',
    storageKey: 'mcpb-color-scheme',
    preference: 'system',
    fallback: 'light',
  },
  ui: {
    theme: {
      colors: ['primary', 'secondary', 'success', 'info', 'warning', 'error', 'neutral', 'brand', 'accent'],
    },
  },
  alias: {
    types: fileURLToPath(new URL('./app/types', import.meta.url)),
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
