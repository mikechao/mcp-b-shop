<template>
  <section class="space-y-6">
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
        <UButton
          color="neutral"
          variant="soft"
          icon="i-heroicons-arrow-path"
          class="hidden sm:inline-flex"
          :loading="productsPending"
          @click="refreshProducts"
        >
          Refresh
        </UButton>
      </div>
    </header>

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

    <div v-if="showSkeletons" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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

    <div v-else-if="hasProducts" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <article
        v-for="product in displayProducts"
        :key="product.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
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
              class="flex-1 justify-center"
              icon="i-heroicons-shopping-cart-20-solid"
              @click="handleAddToCart(product)"
            >
              Add to cart
            </UButton>
            <UTooltip text="Save to favorites">
              <UButton
                color="neutral"
                variant="ghost"
                square
                icon="i-heroicons-heart"
                aria-label="Save to favorites"
                @click="handleSaveToFavorites(product)"
              />
            </UTooltip>
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
import type { FakeStoreProduct } from '~/composables/useFakeStore'

const searchQuery = useState('search-query', () => '')
const selectedCategory = useState('selected-category', () => 'all')
const cartCount = useState('cart-count', () => 0)

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

const searchTerm = computed(() => searchQuery.value.trim().toLowerCase())

const filteredProducts = computed<FakeStoreProduct[]>(() => {
  const query = searchTerm.value

  if (!query) {
    return rawProducts.value
  }

  return rawProducts.value.filter((product) => {
    const title = product.title?.toLowerCase() ?? ''
    const description = product.description?.toLowerCase() ?? ''

    return title.includes(query) || description.includes(query)
  })
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
  refreshProducts()
}

function handleAddToCart(product: DisplayProduct) {
  cartCount.value += 1
  toast.add({
    title: 'Added to cart',
    description: `${product.title} has been added to your cart.`,
    icon: 'i-heroicons-shopping-cart-20-solid',
  })
}

function handleSaveToFavorites(product: DisplayProduct) {
  toast.add({
    title: 'Saved for later',
    description: `${product.title} is now in your favorites.`,
    icon: 'i-heroicons-heart',
  })
}
</script>
