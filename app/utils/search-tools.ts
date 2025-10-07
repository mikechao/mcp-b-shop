import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { FakeStoreProduct } from '~/types/fake-store'
import z from 'zod'
import { searchFakeStoreProducts } from './product-search'

interface RegisterSearchToolOptions {
  getProducts: () => FakeStoreProduct[]
  applySearchQuery: (query: string) => void
}

export function registerSearchTools(server: McpServer, options: RegisterSearchToolOptions) {
  server.registerTool(
    'search_products',
    {
      description: 'Search MCP-B Shop for products that might match the query.',
      inputSchema: {
        query: z.string().default('').describe('Search term to filter products. Leave empty to return all products.'),
      },
    },
    async ({ query }) => {
      const normalizedQuery = (query ?? '').trim()
      options.applySearchQuery(normalizedQuery)

      const products = options.getProducts()
      const results = searchFakeStoreProducts(products, normalizedQuery)

      return {
        content: [{ type: 'text', text: JSON.stringify(results, null, 2) }],
      }
    },
  )

  server.registerTool(
    'clear_product_search',
    {
      description: 'Clear the active product search and return the full product list.',
      inputSchema: {},
    },
    async () => {
      options.applySearchQuery('')

      return {
        content: [{ type: 'text', text: 'Product search cleared. Showing all products.' }],
      }
    },
  )
}
