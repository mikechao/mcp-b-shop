import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Ref } from 'vue'
import type { FakeStoreProduct } from '~/types/fake-store'
import z from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const CART_ACTIONS = [
  'openCart',
  'closeCart',
  'addProduct',
] as const

type CartAction = typeof CART_ACTIONS[number]

const cartActionSchema = z.enum(CART_ACTIONS)

// schemas
const openCartSchema = z.object({})
const closeCartSchema = z.object({})
const fakeStoreRatingSchema = z.object({
  rate: z.number(),
  count: z.number(),
})
const fakeStoreProductSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: fakeStoreRatingSchema.optional(),
})
const addProductSchema = z.object({
  product: fakeStoreProductSchema,
})

export function registerCartTools(server: McpServer, isCartDrawerOpen: Ref<boolean>) {
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
          return handleOpenCart(isCartDrawerOpen)
        }
        case 'closeCart': {
          return handleCloseCart(isCartDrawerOpen)
        }
        case 'addProduct': {
          const { product } = addProductSchema.parse(params)
          return handleAddProduct(product)
        }
      }
    },
  )

  server.registerTool(
    'shopping_cart_parameters_description',
    {
      description: `Get the parameters for shopping_cart_operations tool and the description for the associated action. This is useful for understanding what parameters to pass when invoking the shopping_cart_operations tool. The following action are supported: ${CART_ACTIONS.join(', ')}`,
      inputSchema: {
        action: cartActionSchema,
      },
    },
    async ({ action }) => {
      const toJson = (schema: z.ZodTypeAny, name: string) => {
        return zodToJsonSchema(schema, { name, $refStrategy: 'none' })
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
        case 'addProduct': {
          const paramsAndDescription = {
            params: toJson(addProductSchema, 'addProductParams'),
            description: 'Adds the provided FakeStore product to the shopping cart and updates its quantity',
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(paramsAndDescription, null, 2) }],
          }
        }
      }
    },
  )
}

function handleOpenCart(isCartDrawerOpen: Ref<boolean>) {
  isCartDrawerOpen.value = true
  const cart = useCartStore()
  const totalItems = cart.items.length
  const cartContents = totalItems > 0 ? `Contains the following items:\n ${cart.items.map(item => `${JSON.stringify(item)}`).join(', ')}` : 'Cart is empty'
  return {
    content: [{ type: 'text' as const, text: `Shopping Cart opened. ${cartContents}` }],
  }
}

function handleCloseCart(isCartDrawerOpen: Ref<boolean>) {
  isCartDrawerOpen.value = false
  return {
    content: [{ type: 'text' as const, text: 'Shopping Cart closed' }],
  }
}

function handleAddProduct(product: FakeStoreProduct) {
  const cart = useCartStore()
  const quantity = cart.addItem(product)
  const totalItems = cart.totalQuantity
  return {
    content: [{
      type: 'text' as const,
      text: `Added "${product.title}" to the shopping cart. Quantity in cart: ${quantity}. Total items across cart: ${totalItems}.`,
    }],
  }
}
