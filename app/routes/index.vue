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
          color="gray"
          variant="soft"
          icon="i-heroicons-funnel"
          class="hidden sm:inline-flex"
        >
          Filters
        </UButton>
      </div>
    </header>

    <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <article
        v-for="product in products"
        :key="product.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition hover:-translate-y-1 hover:border-gray-300 hover:shadow-lg"
      >
        <div class="relative aspect-[4/5] w-full overflow-hidden bg-gradient-to-br from-slate-100 via-white to-slate-200">
          <div class="absolute inset-3 rounded-xl border border-white/60 bg-white/40 backdrop-blur" />
          <div class="absolute inset-x-4 bottom-4 flex flex-col gap-1 text-sm text-gray-600">
            <span class="font-medium text-gray-800">{{ product.name }}</span>
            <span class="text-gray-500">{{ product.category }}</span>
          </div>
        </div>
        <div class="flex flex-1 flex-col gap-4 p-4">
          <div class="flex items-baseline justify-between gap-3">
            <span class="text-lg font-semibold text-slate-900">{{ product.price }}</span>
            <span class="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
              <UIcon name="i-heroicons-star-20-solid" class="size-4" aria-hidden="true" />
              {{ product.rating }}
            </span>
          </div>
          <p class="line-clamp-2 text-sm text-slate-500">
            {{ product.description }}
          </p>
          <div class="mt-auto flex items-center justify-between gap-3">
            <UButton
              color="primary"
              class="flex-1 justify-center"
              icon="i-heroicons-shopping-cart-20-solid"
            >
              Add to cart
            </UButton>
            <UButton
              color="gray"
              variant="ghost"
              square
              icon="i-heroicons-heart"
              aria-label="Save to favorites"
            />
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup lang="ts">
const searchQuery = useState('search-query', () => '')
const selectedCategory = useState('selected-category', () => 'all')

interface ProductPreview {
  id: number
  name: string
  category: string
  price: string
  rating: string
  description: string
}

const mockProducts: ProductPreview[] = [
  {
    id: 1,
    name: 'Aurora Wireless Headphones',
    category: 'Electronics',
    price: '$199.00',
    rating: '4.7',
    description: 'Noise-cancelling over-ear headphones with 30 hours of battery life and USB-C quick charging.',
  },
  {
    id: 2,
    name: 'Lumen Smart Lamp',
    category: 'Electronics',
    price: '$89.00',
    rating: '4.5',
    description: 'Adaptive ambient lighting that syncs with your circadian rhythm and voice assistants.',
  },
  {
    id: 3,
    name: 'Mesa Ceramic Mug Set',
    category: 'Home & Kitchen',
    price: '$42.00',
    rating: '4.8',
    description: 'Hand-glazed stoneware mugs with ergonomic handles, dishwasher safe and microwave friendly.',
  },
  {
    id: 4,
    name: 'Trailblazer Backpack',
    category: 'Outdoor',
    price: '$129.00',
    rating: '4.6',
    description: 'Water-resistant 28L backpack with modular compartments and breathable back panel.',
  },
  {
    id: 5,
    name: 'Sierra Performance Jacket',
    category: "Men's clothing",
    price: '$158.00',
    rating: '4.3',
    description: 'Lightweight insulated shell with windproof technology and sealed seams.',
  },
  {
    id: 6,
    name: 'Elysian Silk Scarf',
    category: "Women\'s clothing",
    price: '$68.00',
    rating: '4.9',
    description: 'Hand-loomed scarf crafted with mulberry silk and hand-finished edges.',
  },
  {
    id: 7,
    name: 'Vertex Minimalist Watch',
    category: 'Accessories',
    price: '$215.00',
    rating: '4.4',
    description: 'Sapphire crystal face with quick-release straps and solar-powered movement.',
  },
  {
    id: 8,
    name: 'Horizon Aromatherapy Diffuser',
    category: 'Home & Wellness',
    price: '$54.00',
    rating: '4.8',
    description: 'Ultrasonic diffuser with 4 mist settings, ambient lighting, and automatic shutoff.',
  },
]

const products = computed(() => mockProducts)

function formatCategoryLabel(value: string) {
  return value.replace(/\b\w/g, (char) => char.toUpperCase())
}

const headingTitle = computed(() => {
  if (searchQuery.value) {
    return `Results for “${searchQuery.value}”`
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    return formatCategoryLabel(selectedCategory.value)
  }

  return 'Featured products'
})

const headingSubtitle = computed(() => {
  if (searchQuery.value) {
    return 'Adjust filters or browse categories to see more results.'
  }

  if (selectedCategory.value && selectedCategory.value !== 'all') {
    return 'Browse curated picks tailored to this category.'
  }

  return 'Discover the latest arrivals and best-sellers from MCP-B Shop.'
})

const breadcrumbLinks = computed(() => [
  { label: 'Home', to: '/' },
  { label: headingTitle.value, to: '#', active: true },
])
</script>
