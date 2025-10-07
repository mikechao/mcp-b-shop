import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Ref } from 'vue'
import z from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const CART_ACTIONS = [
  'openCart',
  'closeCart',
] as const

type CartAction = typeof CART_ACTIONS[number]

const cartActionSchema = z.enum(CART_ACTIONS)

// schemas
const openCartSchema = z.object({})
const closeCartSchema = z.object({})

export function registerCartTools(server: McpServer, isCartDrawerOpen: Ref<boolean>, getCartCount: () => number) {
  server.registerTool(
    'shopping_cart_operations',
    {
      description: 'Operations related to the shopping cart',
      inputSchema: {
        action: cartActionSchema,
        params: z.record(z.any()).optional().describe('Parameters for the chosen action'),
      },
    },
    async ({ action, params = {} }) => {
      switch (action as CartAction) {
        case 'openCart': {
          isCartDrawerOpen.value = true
          return {
            content: [{ type: 'text', text: `Shopping Cart opened with ${getCartCount()} items` }],
          }
        }
        case 'closeCart': {
          isCartDrawerOpen.value = false
          return {
            content: [{ type: 'text', text: `Shopping Cart closed` }],
          }
        }
      }
    },
  )

  server.registerTool(
    'shopping_cart_parameters_description',
    {
      description: 'Get the parameters for shopping_cart_operations tool and the description for the associated action. This is useful for understanding what parameters to pass when invoking the shopping_cart_operations tool.',
      inputSchema: {
        action: cartActionSchema,
      },
    },
    async ({ action }) => {
      const toJson = (schema: z.ZodTypeAny, name: string) => {
        zodToJsonSchema(schema, { name, $refStrategy: 'none' })
      }
      switch (action as CartAction) {
        case 'openCart': {
          const paramsAndDescription = {
            params: toJson(openCartSchema, 'openCartParams'),
            description: 'Opens the shopping cart drawer in the UI',
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(paramsAndDescription, null, 2) }],
          }
        }
        case 'closeCart': {
          const paramsAndDescription = {
            params: toJson(closeCartSchema, 'closeCartParams'),
            description: 'Closes the shopping cart drawer in the UI',
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(paramsAndDescription, null, 2) }],
          }
        }
      }
    },
  )
}
