import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import type { Ref } from 'vue'
import type { FakeStoreProduct } from '~/types/fake-store'
import z from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'

const CART_ACTIONS = [
  'openCart',
  'closeCart',
  'addProduct',
  'removeProduct',
  'updateProduct',
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
const removeProductSchema = z.object({
  product: fakeStoreProductSchema,
})
const updateProductSchema = z.object({
  product: fakeStoreProductSchema,
  operation: z.enum(['add', 'remove']),
  quantity: z.number().int().min(1, 'Quantity must be at least 1'),
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
        case 'removeProduct': {
          const { product } = removeProductSchema.parse(params)
          return handleRemoveProduct(product)
        }
        case 'updateProduct': {
          const { product, operation, quantity } = updateProductSchema.parse(params)
          return handleUpdateProduct(product, operation, quantity)
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
        case 'removeProduct': {
          const paramsAndDescription = {
            params: toJson(removeProductSchema, 'removeProductParams'),
            description: 'Removes the provided FakeStore product from the shopping cart if it exists',
          }
          return {
            content: [{ type: 'text', text: JSON.stringify(paramsAndDescription, null, 2) }],
          }
        }
        case 'updateProduct': {
          const paramsAndDescription = {
            params: toJson(updateProductSchema, 'updateProductParams'),
            description: 'update item quanitiies in the shopping cart',
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

function handleRemoveProduct(product: FakeStoreProduct) {
  const cart = useCartStore()
  const existingQuantity = cart.getItemQuantity(product.id)

  if (existingQuantity === 0) {
    return {
      content: [{
        type: 'text' as const,
        text: `No "${product.title}" product found in the shopping cart to remove.`,
      }],
    }
  }

  cart.removeItem(product.id)
  const totalItems = cart.totalQuantity
  return {
    content: [{
      type: 'text' as const,
      text: `Removed "${product.title}" from the shopping cart. Items removed: ${existingQuantity}. Total items remaining: ${totalItems}.`,
    }],
  }
}

function handleUpdateProduct(
  product: FakeStoreProduct,
  operation: 'add' | 'remove',
  quantity: number,
) {
  const cart = useCartStore()
  const normalizedQuantity = Math.floor(quantity)

  if (normalizedQuantity <= 0) {
    return {
      content: [{
        type: 'text' as const,
        text: `No update performed because the provided quantity for "${product.title}" was less than 1.`,
      }],
    }
  }

  if (operation === 'add') {
    let latestQuantity = cart.getItemQuantity(product.id)

    for (let i = 0; i < normalizedQuantity; i += 1) {
      latestQuantity = cart.addItem(product)
    }

    const totalItems = cart.totalQuantity
    return {
      content: [{
        type: 'text' as const,
        text: `Added ${normalizedQuantity} unit(s) of "${product.title}". Quantity in cart: ${latestQuantity}. Total items across cart: ${totalItems}.`,
      }],
    }
  }

  const existingQuantity = cart.getItemQuantity(product.id)

  if (existingQuantity === 0) {
    return {
      content: [{
        type: 'text' as const,
        text: `No "${product.title}" product found in the shopping cart to update.`,
      }],
    }
  }

  const removalCount = Math.min(normalizedQuantity, existingQuantity)

  for (let i = 0; i < removalCount; i += 1) {
    cart.decreaseQuantity(product.id)
  }

  const remainingQuantity = cart.getItemQuantity(product.id)
  const totalItems = cart.totalQuantity

  const removalMessage = removalCount < normalizedQuantity
    ? `Removed ${removalCount} of ${normalizedQuantity} requested unit(s); cart had fewer items available.`
    : `Removed ${removalCount} unit(s).`

  return {
    content: [{
      type: 'text' as const,
      text: `${removalMessage} Remaining quantity of "${product.title}": ${remainingQuantity}. Total items across cart: ${totalItems}.`,
    }],
  }
}
