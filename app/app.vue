<template>
  <UApp>
    <AppSkipLink />
    <NuxtRouteAnnouncer />

    <AppHeader
      v-model="searchQuery"
      :cart-count="cartCount"
      @search="handleSearch"
      @open-cart="handleOpenCart"
    />

    <div class="min-h-screen bg-slate-50 text-slate-900">
      <div class="mx-auto flex max-w-7xl flex-col gap-0 lg:flex-row">
        <aside class="hidden w-64 shrink-0 border-r border-gray-200/80 bg-white/80 lg:block">
          <div class="sticky top-[56px] px-6 py-6 md:top-[64px] lg:top-[72px]">
            <AppCategoryNav
              v-model="selectedCategory"
              :categories="categoryOptions"
            />
          </div>
        </aside>

        <main id="main-content" class="flex flex-1 flex-col">
          <div class="border-b border-gray-200/80 bg-white/80 px-4 py-4 backdrop-blur lg:hidden">
            <UButton
              color="neutral"
              variant="ghost"
              icon="i-heroicons-bars-3"
              class="w-full justify-between"
              @click="isCategoryDrawerOpen = true"
            >
              <span class="text-sm font-medium">Browse categories</span>
              <UIcon name="i-heroicons-chevron-right-20-solid" class="size-5" aria-hidden="true" />
            </UButton>
          </div>

          <USlideover v-model="isCategoryDrawerOpen" side="left">
            <template #title>
              Browse categories
            </template>
            <div class="px-4 pb-6 pt-4">
              <AppCategoryNav
                v-model="selectedCategory"
                :categories="categoryOptions"
              />
            </div>
          </USlideover>

          <div class="flex-1 px-4 pb-10 pt-6 sm:px-6 lg:px-8">
            <NuxtPage />
          </div>
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
import { Computer, Gem, Grip, Venus, Mars } from 'lucide-vue-next';
import type { ProductCategory } from './types/category';

const DEFAULT_CATEGORIES = ['electronics', 'jewelery', "men's clothing", "women's clothing"] as const

const searchQuery = useState('search-query', () => '')
const selectedCategory = useState('selected-category', () => 'all')
const cartCount = useState('cart-count', () => 0)

const isCategoryDrawerOpen = ref(false)

const { categories: apiCategories } = useFakeStoreCategories()
const { products: allProducts } = useFakeStoreProducts()

const categoryCounts = computed(() => {
  const counts = new Map<string, number>()

  for (const product of allProducts.value) {
    const existing = counts.get(product.category) ?? 0
    counts.set(product.category, existing + 1)
  }

  return counts
})

const categoryOptions = computed<ProductCategory[]>(() => {
  const baseCategories = apiCategories.value.length ? apiCategories.value : [...DEFAULT_CATEGORIES]
  const seen = new Set<string>()

  const mapped = baseCategories
    .filter((slug) => {
      if (seen.has(slug)) {
        return false
      }
      seen.add(slug)
      return true
    })
    .map((slug) => {
      const option = createCategoryOption(slug)
      const count = categoryCounts.value.get(slug)

      return {
        ...option,
        count: count && count > 0 ? count : undefined,
      }
    })

  const totalCount = allProducts.value.length

  return [
    {
      id: 'all',
      label: 'All products',
      icon: Grip,
      count: totalCount > 0 ? totalCount : undefined,
    },
    ...mapped,
  ]
})

const toast = useToast()

function handleSearch(value: string) {
  searchQuery.value = value
  toast.add({
    title: 'Search submitted',
    description: value ? `Looking for “${value}”` : 'Showing all products',
    icon: 'i-heroicons-magnifying-glass-20-solid',
  })
}

function handleOpenCart() {
  toast.add({
    title: 'Cart panel coming soon',
    description: 'We will open the shopping cart in a future iteration.',
    icon: 'i-heroicons-shopping-cart-20-solid',
  })
}

function createCategoryOption(slug: string): ProductCategory {
  const label = formatCategoryLabel(slug)

  if (slug === "men's clothing") {
    return { id: slug, label, icon: Mars }
  }

  if (slug === "women's clothing") {
    return { id: slug, label, icon: Venus }
  }

  if (slug === 'electronics') {
    return { id: slug, label, icon: Computer }
  }

  if (slug === 'jewelery') {
    return { id: slug, label, icon: Gem }
  }

  return { id: slug, label, icon: Gem }
}

function formatCategoryLabel(value: string) {
  return value
    .split(' ')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}
</script>
