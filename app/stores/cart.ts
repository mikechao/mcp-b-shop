import type { FakeStoreProduct } from '~/types/fake-store'
import { defineStore } from 'pinia'

export interface CartItem {
  id: number
  title: string
  price: number
  image: string
  category: string
  quantity: number
}

interface CartItemPayload {
  id: number
  title: string
  price: number
  image: string
  category: string
}

function resolvePayload(product: CartItemPayload | FakeStoreProduct): CartItemPayload {
  const base = product as CartItemPayload

  return {
    id: base.id,
    title: base.title,
    price: base.price,
    image: base.image,
    category: (product as FakeStoreProduct).category ?? base.category,
  }
}

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [] as CartItem[],
  }),
  getters: {
    totalQuantity: state => state.items.reduce((sum, item) => sum + item.quantity, 0),
    totalPrice: state => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    isEmpty: state => state.items.length === 0,
    getItemQuantity: state => (id: number) =>
      state.items.find(item => item.id === id)?.quantity ?? 0,
  },
  actions: {
    addItem(product: CartItemPayload | FakeStoreProduct) {
      const payload = resolvePayload(product)
      const existing = this.items.find(item => item.id === payload.id)

      if (existing) {
        existing.quantity += 1
        return existing.quantity
      }

      this.items.push({
        ...payload,
        quantity: 1,
      })

      return 1
    },
    increaseQuantity(id: number) {
      const item = this.items.find(entry => entry.id === id)
      if (!item) {
        return
      }

      item.quantity += 1
    },
    decreaseQuantity(id: number) {
      const item = this.items.find(entry => entry.id === id)
      if (!item) {
        return
      }

      if (item.quantity <= 1) {
        this.removeItem(id)
        return
      }

      item.quantity -= 1
    },
    removeItem(id: number) {
      this.items = this.items.filter(item => item.id !== id)
    },
    clear() {
      this.items = []
    },
  },
})
