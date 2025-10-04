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
const searchQuery = useState('search-query', () => '')
const selectedCategory = useState('selected-category', () => 'all')
const cartCount = useState('cart-count', () => 0)

const isCategoryDrawerOpen = ref(false)

const categoryOptions = computed(() => [
  { id: 'all', label: 'All products', icon: 'i-heroicons-squares-2x2' },
  { id: 'electronics', label: 'Electronics', icon: 'i-heroicons-computer-desktop' },
  { id: 'jewelery', label: 'Jewelry', icon: 'i-heroicons-sparkles' },
  { id: "men's clothing", label: "Men's clothing", image: '/mens-clothing.webp' },
  { id: "women's clothing", label: "Women's clothing", image: '/womens-clothing.webp' },
])

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
</script>
