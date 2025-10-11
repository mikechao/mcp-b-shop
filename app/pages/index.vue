<template>
  <div class="space-y-6">
    <AppDemoNotice />

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

    <ProductFilterSummary
      v-if="showFilterSummary"
      :is-category-filtered="isCategoryFiltered"
      :category-label="filteredCategoryLabel"
      :is-search-filtered="isSearchFiltered"
      :search-query="searchQueryDisplay"
      @clear-category="clearCategoryFilter"
      @clear-search="clearSearchFilter"
    />

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
          <UButton color="error" variant="solid" icon="i-heroicons-arrow-path" class="rounded-full" @click="() => refreshProducts()">
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

      <template v-else-if="hasProducts">
        <div :class="productGridClasses">
          <ProductCard
            v-for="product in paginatedProducts"
            :key="product.id"
            :product="product"
            :is-preview-target="isPreviewActive && previewCategory === product.category"
            :is-preview-muted="isPreviewActive && previewCategory && previewCategory !== product.category"
            :is-adding="isAddingToCart(product.id)"
            @add-to-cart="handleAddToCart"
          />
        </div>
        <div v-if="totalPages > 1" class="flex justify-center pt-4">
          <UPagination
            :model-value="currentPage"
            :page-count="totalPages"
            :total="productCount"
            size="md"
            aria-label="Product pagination"
            @update:modelValue="handlePageChange"
          />
        </div>
      </template>

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
          <UButton color="primary" icon="i-heroicons-arrow-path" class="rounded-full" @click="() => refreshProducts()">
            Retry fetch
          </UButton>
          <UButton
            v-if="canResetFilters"
            color="neutral"
            variant="soft"
            icon="i-heroicons-x-mark"
            class="rounded-full"
            @click="handleResetFilters"
          >
            Clear filters
          </UButton>
        </div>
      </UCard>
    </section>
  </div>
</template>

<script setup lang="ts">
import type { FakeStoreProduct } from '~/types/fake-store'
import type { DisplayProduct } from '~/types/display-product'
import { useMcpServer } from '../composables/useMcpServer'
import { searchFakeStoreProducts } from '../utils/product-search'
import { registerSearchTools } from '../utils/search-tools'
import { useCartStore } from '../stores/cart'
import { formatCategoryLabel } from '~/utils/category'

const searchQuery = useState('search-query', () => '')
const selectedCategory = useState('selected-category', () => 'all')
const previewCategory = useState<string | null>('category-preview', () => null)
const hasRegisteredSearchTool = useState('search-products-tool-registered', () => false)
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
const productGridClasses = 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
const ITEMS_PER_PAGE = 12
const currentPage = useState('product-page', () => 1)

const filteredProducts = computed<FakeStoreProduct[]>(() =>
  searchFakeStoreProducts(rawProducts.value, searchQueryDisplay.value),
)

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
const totalPages = computed(() => Math.max(Math.ceil(productCount.value / ITEMS_PER_PAGE), 1))
const paginatedProducts = computed<DisplayProduct[]>(() => {
  const safePage = Math.min(Math.max(currentPage.value, 1), totalPages.value)
  const start = (safePage - 1) * ITEMS_PER_PAGE
  return displayProducts.value.slice(start, start + ITEMS_PER_PAGE)
})
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

function applySearchQueryFromTool(value: string) {
  const normalized = value.trim()

  searchQuery.value = normalized
  toast.add({
    title: 'Search submitted',
    description: normalized ? `Looking for “${normalized}”` : 'Showing all products',
    icon: 'i-heroicons-magnifying-glass-20-solid',
  })
}

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

function isAddingToCart(id: number) {
  return addToCartPendingIds.value.includes(id)
}

function setAddToCartPending(id: number, value: boolean) {
  addToCartPendingIds.value = value
    ? Array.from(new Set([...addToCartPendingIds.value, id]))
    : addToCartPendingIds.value.filter((item) => item !== id)
}

function handlePageChange(page: number) {
  currentPage.value = page

  if (!process.client) {
    return
  }

  window.requestAnimationFrame(() => {
    const container = document.getElementById('product-grid')
    if (container) {
      const top = Math.max(container.getBoundingClientRect().top + window.scrollY - 120, 0)
      window.scrollTo({ top, behavior: 'smooth' })
    }
  })
}

watch(
  () => selectedCategory.value,
  () => {
    previewCategory.value = null
  },
)

watch(
  () => [searchQuery.value, selectedCategory.value],
  () => {
    currentPage.value = 1
  },
)

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value
  }
})

onBeforeMount(async () => {
  if (hasRegisteredSearchTool.value) {
    return
  }

  try {
    const { server } = await useMcpServer()
    registerSearchTools(server, {
      getProducts: () => rawProducts.value,
      applySearchQuery: applySearchQueryFromTool,
    })
    hasRegisteredSearchTool.value = true
  }
  catch (error) {
    console.error('Error registering MCP search tool', error)
  }
})
</script>
