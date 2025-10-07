<template>
  <section id="product-grid" class="space-y-6">
    <header class="space-y-2">
      <UBreadcrumb :links="breadcrumbLinks" />
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl font-semibold text-slate-900">
            {{ headingTitle }}
          </h1>
          <p class="text-sm text-slate-500">
            {{ headingSubtitle }}
          </p>
        </div>
      </div>
    </header>

    <div
      v-if="showFilterSummary"
      class="flex flex-wrap items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 shadow-sm shadow-slate-200/40"
    >
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Active filters</span>
      <div class="flex flex-wrap items-center gap-2">
        <span
          v-if="isCategoryFiltered"
          class="inline-flex items-center gap-2 rounded-full border border-primary-200/70 bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700"
        >
          {{ filteredCategoryLabel }}
          <button
            type="button"
            class="inline-flex size-5 items-center justify-center rounded-full text-primary-600 transition hover:bg-primary-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-400"
            @click="clearCategoryFilter"
          >
            <UIcon name="i-heroicons-x-mark" class="size-3.5" aria-hidden="true" />
            <span class="sr-only">Clear category filter</span>
          </button>
        </span>
        <span
          v-if="isSearchFiltered"
          class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600"
        >
          “{{ searchQueryDisplay }}”
          <button
            type="button"
            class="inline-flex size-5 items-center justify-center rounded-full text-slate-500 transition hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary-400"
            @click="clearSearchFilter"
          >
            <UIcon name="i-heroicons-x-mark" class="size-3.5" aria-hidden="true" />
            <span class="sr-only">Clear search filter</span>
          </button>
        </span>
      </div>
    </div>

    <p v-if="livePreviewAnnouncement" class="sr-only" aria-live="polite">
      {{ livePreviewAnnouncement }}
    </p>

    <UAlert
      v-if="productsError"
      color="error"
      icon="i-heroicons-exclamation-circle"
      title="We couldn’t load products"
      class="border border-error-200/70"
    >
      <template #description>
        {{ productsErrorMessage }}
      </template>
      <template #actions>
        <UButton color="error" variant="solid" icon="i-heroicons-arrow-path" @click="refreshProducts">
          Retry
        </UButton>
      </template>
    </UAlert>

    <div v-if="showSkeletons" :class="productGridClasses">
      <UCard v-for="index in 8" :key="`skeleton-${index}`" class="flex flex-col gap-4 p-4">
        <USkeleton class="aspect-[4/5] w-full rounded-2xl" />
        <div class="space-y-2">
          <USkeleton class="h-5 w-3/4 rounded-md" />
          <USkeleton class="h-4 w-1/2 rounded-md" />
          <USkeleton class="h-4 w-full rounded-md" />
        </div>
        <USkeleton class="h-9 w-full rounded-full" />
      </UCard>
    </div>

    <div v-else-if="hasProducts" :class="productGridClasses">
      <article
        v-for="product in displayProducts"
        :key="product.id"
        :class="cardClasses(product)"
        :data-category="product.category"
      >
        <div class="relative aspect-[4/5] w-full overflow-hidden bg-slate-100">
          <img
            :src="product.image"
            :alt="product.title"
            class="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
          >
          <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
            {{ product.categoryLabel }}
          </span>
        </div>
        <div class="flex flex-1 flex-col gap-4 p-4">
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-base font-semibold text-slate-900">{{ product.priceFormatted }}</span>
            <span
              v-if="product.ratingValue"
              class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700"
            >
              <UIcon name="i-heroicons-star-20-solid" class="size-4" aria-hidden="true" />
              {{ product.ratingValue }}
              <span
                v-if="product.ratingCount"
                class="text-[11px] font-medium text-amber-600/80"
              >
                ({{ product.ratingCount }})
              </span>
            </span>
          </div>
          <h2 class="line-clamp-2 text-sm font-medium text-slate-900">
            {{ product.title }}
          </h2>
          <p class="line-clamp-2 text-sm text-slate-500">
            {{ product.description }}
          </p>
          <div class="mt-auto flex items-center justify-between gap-3">
            <UButton
              color="primary"
              :loading="isAddingToCart(product.id)"
              :disabled="isAddingToCart(product.id)"
              class="flex-1 justify-center transition-transform duration-150 ease-out focus-visible:ring-2 focus-visible:ring-primary-200 active:scale-95"
              icon="i-heroicons-shopping-cart-20-solid"
              @click="handleAddToCart(product)"
            >
              Add to cart
            </UButton>
          </div>
        </div>
      </article>
    </div>

    <UCard
      v-else-if="showEmptyState"
      class="flex flex-col items-center gap-4 border border-dashed border-slate-200 bg-white/80 py-12 text-center"
    >
      <UIcon name="i-heroicons-face-frown" class="size-12 text-slate-300" aria-hidden="true" />
      <div class="space-y-1">
        <h2 class="text-lg font-semibold text-slate-900">{{ emptyStateTitle }}</h2>
        <p class="max-w-md text-sm text-slate-500">
          {{ emptyStateDescription }}
        </p>
      </div>
      <div class="flex flex-wrap justify-center gap-3">
        <UButton color="primary" icon="i-heroicons-arrow-path" @click="refreshProducts">
          Retry fetch
        </UButton>
        <UButton
          v-if="canResetFilters"
          color="neutral"
          variant="soft"
          icon="i-heroicons-x-mark"
          @click="handleResetFilters"
        >
          Clear filters
        </UButton>
      </div>
    </UCard>
  </section>
</template>

<script setup lang="ts">
import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'
import type { FakeStoreProduct } from '~/types/fake-store'
import { useCartStore } from '../stores/cart'

const searchQuery = useState('search-query', () => '')
const selectedCategory = useState('selected-category', () => 'all')
const previewCategory = useState<string | null>('category-preview', () => null)
const cartStore = useCartStore()

const {
  products: rawProducts,
  pending: productsPending,
  error: productsError,
  refresh: refreshProducts,
} = useFakeStoreProducts({ category: selectedCategory })

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
})

const searchQueryDisplay = computed(() => searchQuery.value.trim())
const isSearchFiltered = computed(() => searchQueryDisplay.value.length > 0)
const isCategoryFiltered = computed(() => selectedCategory.value && selectedCategory.value !== 'all')
const showFilterSummary = computed(() => isCategoryFiltered.value || isSearchFiltered.value)
const filteredCategoryLabel = computed(() =>
  isCategoryFiltered.value ? formatCategoryLabel(selectedCategory.value) : '',
)
const productGridClasses = 'grid gap-5 grid-cols-[repeat(auto-fit,minmax(240px,1fr))]'

const fuseOptions: IFuseOptions<FakeStoreProduct> = {
  keys: ['title', 'description', 'category'],
  ignoreLocation: true,
  threshold: 0.35,
}

const fuse = computed(() => new Fuse(rawProducts.value, fuseOptions))

const filteredProducts = computed<FakeStoreProduct[]>(() => {
  const query = searchQueryDisplay.value

  if (!query) {
    return rawProducts.value
  }

  return fuse.value.search(query).map(result => result.item)
})

interface DisplayProduct {
  id: number
  title: string
  description: string
  price: number
  priceFormatted: string
  image: string
  category: string
  categoryLabel: string
  ratingValue: string | null
  ratingCount: number | null
}

function formatCategoryLabel(value: string) {
  return value
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

const displayProducts = computed<DisplayProduct[]>(() =>
  filteredProducts.value.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    price: product.price,
    priceFormatted: currencyFormatter.format(product.price),
    image: product.image,
    category: product.category,
    categoryLabel: formatCategoryLabel(product.category),
    ratingValue: product.rating?.rate ? product.rating.rate.toFixed(1) : null,
    ratingCount: product.rating?.count ?? null,
  })),
)

const productCount = computed(() => displayProducts.value.length)
const hasProducts = computed(() => productCount.value > 0)
const showSkeletons = computed(() => productsPending.value && rawProducts.value.length === 0)
const showEmptyState = computed(() => !productsPending.value && !hasProducts.value && !productsError.value)
const canResetFilters = computed(
  () => searchQuery.value.trim().length > 0 || (selectedCategory.value && selectedCategory.value !== 'all'),
)
const isPreviewActive = computed(() => !!previewCategory.value && previewCategory.value !== 'all')
const livePreviewAnnouncement = computed(() => {
  if (!isPreviewActive.value || !previewCategory.value) {
    return ''
  }

  const matchingCount = displayProducts.value.filter(
    (product) => product.category === previewCategory.value,
  ).length

  const label = formatCategoryLabel(previewCategory.value)

  if (matchingCount === 0) {
    return `No products in ${label} yet.`
  }

  return `Showing ${formatCountLabel(matchingCount, 'product')} in ${label}.`
})
const addToCartPendingIds = ref<number[]>([])

const headingTitle = computed(() => {
  if (searchQuery.value) {
    return `Results for “${searchQuery.value}”`
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    return formatCategoryLabel(selectedCategory.value)
  }

  return 'Featured products'
})

function formatCountLabel(count: number, noun: string) {
  const unit = count === 1 ? noun : `${noun}s`
  return `${count} ${unit}`
}

const headingSubtitle = computed(() => {
  if (showSkeletons.value) {
    return 'Loading products…'
  }

  const countLabel = formatCountLabel(productCount.value, 'product')

  if (searchQuery.value) {
    return productCount.value
      ? `${countLabel} match your search.`
      : `We couldn’t find matches for “${searchQuery.value}”.`
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    return productCount.value
      ? `${countLabel} in ${formatCategoryLabel(selectedCategory.value)}.`
      : 'No products available in this category yet.'
  }

  return productCount.value ? `${countLabel} curated for you.` : 'Browse our catalogue of curated finds.'
})

const breadcrumbLinks = computed(() => [
  { label: 'Home', to: '/' },
  { label: headingTitle.value, to: '#', active: true },
])

const emptyStateTitle = computed(() => {
  if (searchQuery.value) {
    return `No results for “${searchQuery.value}”`
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    return `No products in ${formatCategoryLabel(selectedCategory.value)}`
  }

  return 'Products coming soon'
})

const emptyStateDescription = computed(() => {
  if (searchQuery.value) {
    return 'Try a different search term or clear filters to explore more products.'
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    return 'Check back later or explore another category while we restock this one.'
  }

  return 'We’re sourcing new items for this collection. Please check back shortly.'
})

const productsErrorMessage = computed(
  () => productsError.value?.message ?? 'Please check your connection and try again.',
)

const toast = useToast()

function handleResetFilters() {
  searchQuery.value = ''
  selectedCategory.value = 'all'
  previewCategory.value = null
  refreshProducts()
}

function handleAddToCart(product: DisplayProduct) {
  if (isAddingToCart(product.id)) {
    return
  }

  setAddToCartPending(product.id, true)
  const quantity = cartStore.addItem({
    id: product.id,
    title: product.title,
    price: product.price,
    image: product.image,
    category: product.category,
  })
  toast.add({
    title: 'Added to cart',
    description:
      quantity > 1
        ? `Updated quantity: ${quantity} × ${product.title}.`
        : `${product.title} has been added to your cart.`,
    icon: 'i-heroicons-shopping-cart-20-solid',
  })

  window.setTimeout(() => {
    setAddToCartPending(product.id, false)
  }, 400)
}

function clearCategoryFilter() {
  selectedCategory.value = 'all'
  previewCategory.value = null
  refreshProducts()
}

function clearSearchFilter() {
  searchQuery.value = ''
  refreshProducts()
}

function cardClasses(product: DisplayProduct) {
  const classes = [
    'group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition duration-200 ease-out transition-transform transition-shadow focus-within:ring-2 focus-within:ring-primary-200 motion-safe:hover:-translate-y-1 hover:border-slate-300 motion-safe:hover:shadow-lg motion-safe:active:shadow-sm',
  ]

  if (isPreviewActive.value && previewCategory.value) {
    if (product.category === previewCategory.value) {
      classes.push('border-primary-200/80 shadow-[0_18px_45px_-26px_rgba(79,114,242,0.65)]')
    } else {
      classes.push('opacity-60 saturate-[0.85]')
    }
  }

  return classes
}

function isAddingToCart(id: number) {
  return addToCartPendingIds.value.includes(id)
}

function setAddToCartPending(id: number, value: boolean) {
  addToCartPendingIds.value = value
    ? Array.from(new Set([...addToCartPendingIds.value, id]))
    : addToCartPendingIds.value.filter((item) => item !== id)
}

watch(
  () => selectedCategory.value,
  () => {
    previewCategory.value = null
  },
)
</script>
