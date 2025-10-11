<template>
  <section class="space-y-6">
    <div class="flex flex-wrap items-center gap-3">
      <UButton
        color="neutral"
        variant="soft"
        icon="i-heroicons-arrow-left-20-solid"
        class="justify-start rounded-full"
        @click="handleGoBack"
      >
        Back
      </UButton>
      <div class="min-w-0 flex-1">
        <UBreadcrumb :links="breadcrumbLinks" class="justify-end" />
      </div>
    </div>

    <UAlert
      v-if="productError"
      color="error"
      icon="i-heroicons-exclamation-circle"
      title="We couldn’t load this product"
      class="border border-error-200/70"
    >
      <template #description>
        {{ productErrorMessage }}
      </template>
      <template #actions>
        <UButton color="error" variant="solid" icon="i-heroicons-arrow-path" class="rounded-full" @click="refreshProduct">
          Retry
        </UButton>
      </template>
    </UAlert>

    <UCard v-if="showSkeleton" class="border border-slate-200/80 bg-white/80 p-6">
      <div class="flex flex-col gap-8 lg:flex-row">
        <USkeleton class="aspect-square w-full max-w-xl rounded-3xl" />
        <div class="flex flex-1 flex-col gap-6">
          <USkeleton class="h-6 w-24 rounded-full" />
          <USkeleton class="h-9 w-3/4 rounded-lg" />
          <USkeleton class="h-6 w-1/3 rounded-lg" />
          <USkeleton class="h-4 w-full rounded-md" />
          <USkeleton class="h-4 w-11/12 rounded-md" />
          <USkeleton class="h-4 w-2/3 rounded-md" />
          <div class="mt-auto flex flex-wrap gap-3">
            <USkeleton class="h-10 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </UCard>

    <UCard
      v-else-if="product"
      class="overflow-hidden border border-slate-200/80 bg-white/90 p-6 shadow-sm"
    >
      <div class="flex flex-col gap-8 lg:flex-row">
        <div class="flex w-full justify-center lg:w-1/2">
          <div class="relative aspect-[4/5] w-full max-w-xl overflow-hidden rounded-3xl bg-slate-100 p-6 shadow-inner shadow-slate-200">
            <img
              :src="product.image"
              :alt="product.title"
              class="h-full w-full object-contain"
            >
            <span class="absolute left-6 top-6 rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm">
              {{ categoryLabel }}
            </span>
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-6">
          <div class="space-y-3">
            <h1 class="text-3xl font-semibold text-slate-900">{{ product.title }}</h1>
            <p class="text-2xl font-medium text-primary-600">{{ priceFormatted }}</p>
            <div class="flex flex-wrap items-center gap-3 text-sm text-slate-600">
              <span
                v-if="ratingValue"
                class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
              >
                <UIcon name="i-heroicons-star-20-solid" class="size-4" aria-hidden="true" />
                {{ ratingValue }}
                <span v-if="ratingCount" class="text-[11px] font-medium text-amber-600/80">
                  ({{ ratingCount }})
                </span>
              </span>
              <span class="inline-flex items-center gap-2 text-xs text-slate-500">
                <UIcon name="i-heroicons-tag" class="size-4" aria-hidden="true" />
                {{ categoryLabel }}
              </span>
            </div>
          </div>

          <div class="space-y-3">
            <h2 class="text-base font-semibold text-slate-900">Product details</h2>
            <p class="whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {{ product.description }}
            </p>
          </div>

          <div class="mt-auto flex flex-wrap gap-3">
            <UButton
              color="primary"
              :loading="isAddingToCart"
              :disabled="isAddingToCart"
              icon="i-heroicons-shopping-cart-20-solid"
              class="min-w-40 justify-center rounded-full transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary-200 active:scale-95"
              @click="handleAddToCart"
            >
              Add to cart
            </UButton>
          </div>
        </div>
      </div>
    </UCard>

    <UCard
      v-else-if="showNotFound"
      class="flex flex-col items-center gap-4 border border-dashed border-slate-200 bg-white/80 py-12 text-center"
    >
      <UIcon name="i-heroicons-question-mark-circle" class="size-12 text-slate-300" aria-hidden="true" />
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-slate-900">Product not found</h2>
        <p class="max-w-md text-sm text-slate-500">
          We couldn’t find a product with this identifier. It may have been removed or is temporarily unavailable.
        </p>
      </div>
      <UButton color="neutral" variant="soft" icon="i-heroicons-arrow-left-20-solid" class="rounded-full" @click="handleGoBack">
        Go back
      </UButton>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import type { ComputedRef } from 'vue'
import { useCartStore } from '~/stores/cart'
import { formatCategoryLabel } from '~/utils/category'

const router = useRouter()
const route = useRoute()

const cartStore = useCartStore()
const toast = useToast()

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const productId: ComputedRef<number | null> = computed(() => {
  const raw = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id

  if (!raw) {
    return null
  }

  const parsed = Number(raw)
  return Number.isNaN(parsed) ? null : parsed
})

const {
  product,
  pending: productPending,
  error: productError,
  refresh: refreshProduct,
} = useFakeStoreProduct(productId)

const priceFormatted = computed(() =>
  product.value ? currencyFormatter.format(product.value.price) : '',
)
const ratingValue = computed(() =>
  product.value?.rating?.rate ? product.value.rating.rate.toFixed(1) : null,
)
const ratingCount = computed(() => product.value?.rating?.count ?? null)

const categoryLabel = computed(() =>
  product.value ? formatCategoryLabel(product.value.category) : 'Unknown category',
)

const breadcrumbLinks = computed(() => [
  { label: 'Home', to: '/' },
  { label: product.value?.title ?? 'Product details', to: '#', active: true },
])

const showSkeleton = computed(() => productPending.value && !product.value)
const showNotFound = computed(
  () => !productPending.value && !product.value && !productError.value,
)

const productErrorMessage = computed(
  () => productError.value?.message ?? 'Please check your connection and try again.',
)

const isAddingToCart = ref(false)

function handleGoBack() {
  if (import.meta.client && window.history.length > 1) {
    router.back()
    return
  }

  router.push('/')
}

function handleAddToCart() {
  if (!product.value || isAddingToCart.value) {
    return
  }

  isAddingToCart.value = true
  const quantity = cartStore.addItem(product.value)

  toast.add({
    title: 'Added to cart',
    description:
      quantity > 1
        ? `Updated quantity: ${quantity} × ${product.value.title}.`
        : `${product.value.title} has been added to your cart.`,
    icon: 'i-heroicons-shopping-cart-20-solid',
  })

  window.setTimeout(() => {
    isAddingToCart.value = false
  }, 400)
}
</script>
