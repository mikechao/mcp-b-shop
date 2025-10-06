import type { MaybeRefOrGetter } from 'vue'
import type { FakeStoreProduct } from '~/types/fake-store'
import { computed, toValue } from 'vue'
import { fakeStoreProducts } from '../data/fakeStoreFallback'

const DEFAULT_BASE_URL = 'https://fakestoreapi.com'

function resolveFallbackProducts(category: string | null) {
  if (!category) {
    return fakeStoreProducts
  }

  return fakeStoreProducts.filter(product => product.category === category)
}

function resolveFallbackCategories() {
  return Array.from(new Set(fakeStoreProducts.map(product => product.category)))
}

export interface UseFakeStoreProductsOptions {
  category?: MaybeRefOrGetter<string | null | undefined>
}

export function useFakeStoreProducts(options: UseFakeStoreProductsOptions = {}) {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.fakeStoreApiBase || DEFAULT_BASE_URL

  const normalizedCategory = computed(() => {
    const raw = toValue(options.category)
    if (!raw || raw === 'all') {
      return null
    }
    return raw
  })

  const endpoint = computed(() =>
    normalizedCategory.value
      ? `/products/category/${encodeURIComponent(normalizedCategory.value)}`
      : '/products',
  )

  const key = computed(() => `fake-store-products-${normalizedCategory.value ?? 'all'}`)

  const { data, pending, error, refresh } = useAsyncData<FakeStoreProduct[]>(
    () => key.value,
    async () => {
      try {
        return await $fetch<FakeStoreProduct[]>(`${baseURL}${endpoint.value}`)
      }
      catch (fetchError) {
        if (import.meta.env.DEV) {
          console.warn('[FakeStore] Falling back to bundled product data.', fetchError)
        }
        return resolveFallbackProducts(normalizedCategory.value)
      }
    },
    {
      default: () => [],
      server: true,
      lazy: false,
      watch: [normalizedCategory],
    },
  )

  // A hardcoded product that should be visible to callers of useFakeStoreProducts.
  // We append it to the fetched/fallback list. It will only be included when the
  // current category filter matches the product's category (or when no category is set).
  const HARDCODED_PRODUCT: FakeStoreProduct = {
    id: 99999,
    title: 'James the Orange Cat',
    price: 999999.99,
    description: `Bring home the elegance of sunshine with this radiant ginger tabby. With a coat that glows like autumn leaves and eyes full of gentle curiosity, this feline is the embodiment of comfort and grace. Whether perched by the window watching the world go by or curled up on your lap, this cat brings warmth, charm, and quiet companionship into any home.
Perfect for those who appreciate beauty in simplicity, this lovely cat is affectionate yet independent—a loyal friend who loves both playtime and peaceful moments in the sun.`,
    category: 'cats',
    image: '/images/james.jpg',
    rating: { rate: 5, count: 999999 },
  }

  const productsWithExtra = computed(() => {
    const base = data.value ?? []

    // Respect category filter: if a specific category is selected and it doesn't
    // match the hardcoded product, return the base list unchanged.
    if (normalizedCategory.value && normalizedCategory.value !== HARDCODED_PRODUCT.category) {
      return base
    }

    // Ensure no id collision with existing products
    const hasCollision = base.some(p => p.id === HARDCODED_PRODUCT.id)
    const extra = hasCollision
      ? { ...HARDCODED_PRODUCT, id: base.reduce((m, p) => Math.max(m, p.id), 0) + 1 }
      : HARDCODED_PRODUCT

    return [...base, extra]
  })

  return {
    products: computed(() => productsWithExtra.value),
    pending,
    error,
    refresh,
  }
}

export function useFakeStoreCategories() {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.fakeStoreApiBase || DEFAULT_BASE_URL

  const { data, pending, error, refresh } = useAsyncData<string[]>(
    'fake-store-categories',
    async () => {
      try {
        return await $fetch<string[]>(`${baseURL}/products/categories`)
      }
      catch (fetchError) {
        if (import.meta.env.DEV) {
          console.warn('[FakeStore] Falling back to bundled category data.', fetchError)
        }
        return resolveFallbackCategories()
      }
    },
    {
      default: () => [],
      server: true,
      lazy: false,
    },
  )

  const categories = computed(() => {
    const base = data.value ?? []
    if (base.includes('cats')) {
      return base
    }
    return [...base, 'cats']
  })

  return {
    categories,
    pending,
    error,
    refresh,
  }
}
