<template>
  <USlideover v-model:open="isOpen" side="right" :overlay="true">
    <template #title>
      Shopping cart
    </template>
    <template #description>
      Review your selected products and adjust quantities before checkout.
    </template>
    <template #body>
      <div v-if="isEmpty" class="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center text-slate-500">
        <UIcon name="i-heroicons-shopping-cart" class="size-12 text-slate-300" aria-hidden="true" />
        <div class="space-y-1">
          <p class="text-base font-semibold text-slate-800">Your cart is empty</p>
          <p class="text-sm">Browse the catalogue and add items to start your order.</p>
        </div>
        <UButton color="primary" variant="soft" icon="i-heroicons-arrow-left" class="rounded-full" @click="close">
          Continue shopping
        </UButton>
      </div>
      <div v-else class="flex flex-col gap-6 py-2">
        <div class="flex items-center justify-between text-sm font-medium text-slate-600">
          <span>Items in cart</span>
          <span class="text-sm font-semibold text-slate-900">{{ itemCountLabel }}</span>
        </div>
        <ul class="flex flex-col gap-4" role="list">
          <li v-for="item in items" :key="item.id" class="flex gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm">
            <img
              :src="item.image"
              :alt="item.title"
              class="h-20 w-20 flex-shrink-0 rounded-xl object-cover"
              loading="lazy"
            >
            <div class="flex flex-1 flex-col gap-3">
              <div class="flex items-start justify-between gap-3">
                <div class="space-y-1">
                  <p class="text-sm font-semibold text-slate-900">{{ item.title }}</p>
                  <p class="text-xs uppercase tracking-wide text-slate-500">{{ formatCategoryLabel(item.category) }}</p>
                </div>
                <UButton
                  size="xs"
                  color="neutral"
                  variant="ghost"
                  icon="i-heroicons-trash"
                  aria-label="Remove item"
                  class="rounded-full"
                  @click="remove(item.id)"
                />
              </div>
              <div class="flex items-center justify-between gap-4">
                <div class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1">
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-minus"
                    aria-label="Decrease quantity"
                    class="rounded-full"
                    @click="decrease(item.id)"
                  />
                  <span class="min-w-[2ch] text-sm font-semibold text-slate-900 text-center">{{ item.quantity }}</span>
                  <UButton
                    size="xs"
                    color="neutral"
                    variant="ghost"
                    icon="i-heroicons-plus"
                    aria-label="Increase quantity"
                    class="rounded-full"
                    @click="increase(item.id)"
                  />
                </div>
                <p class="text-sm font-semibold text-slate-900">{{ formatPrice(item.price * item.quantity) }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </template>
    <template v-if="!isEmpty" #footer>
      <div class="flex flex-col gap-3">
        <div class="flex items-center justify-between text-sm font-medium text-slate-700">
          <span>Subtotal</span>
          <span class="text-base font-semibold text-slate-900">{{ formatPrice(totalPrice) }}</span>
        </div>
        <UButton color="primary" block icon="i-heroicons-credit-card" class="rounded-full" @click="goToCheckout">
          Proceed to checkout
        </UButton>
        <UButton color="neutral" variant="ghost" block icon="i-heroicons-x-mark" class="rounded-full" @click="close">
          Continue shopping
        </UButton>
      </div>
    </template>
  </USlideover>

</template>

<script setup lang="ts">
import { useCartStore } from '../stores/cart'
import { formatCategoryLabel } from '~/utils/category'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
})

const emit = defineEmits<{
  (event: 'update:modelValue', value: boolean): void
}>()

const cartStore = useCartStore()
const router = useRouter()

const isOpen = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
})

const items = computed(() => cartStore.items)
const isEmpty = computed(() => cartStore.isEmpty)
const totalPrice = computed(() => cartStore.totalPrice)
const totalQuantity = computed(() => cartStore.totalQuantity)
const itemCountLabel = computed(() => {
  const value = totalQuantity.value
  const noun = value === 1 ? 'item' : 'items'
  return `${value} ${noun}`
})

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

function close() {
  emit('update:modelValue', false)
}

function increase(id: number) {
  cartStore.increaseQuantity(id)
}

function decrease(id: number) {
  cartStore.decreaseQuantity(id)
}

function remove(id: number) {
  cartStore.removeItem(id)
}

function formatPrice(value: number) {
  return currencyFormatter.format(value)
}

function goToCheckout() {
  close()
  router.push('/checkout')
}
</script>
