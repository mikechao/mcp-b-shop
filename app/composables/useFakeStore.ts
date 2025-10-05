import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'
import type { FakeStoreProduct } from '~/types/fake-store'
import { fakeStoreProducts } from '../data/fakeStoreFallback'

const DEFAULT_BASE_URL = 'https://fakestoreapi.com'

function resolveFallbackProducts(category: string | null) {
  if (!category) {
    return fakeStoreProducts
  }

  return fakeStoreProducts.filter((product) => product.category === category)
}

function resolveFallbackCategories() {
  return Array.from(new Set(fakeStoreProducts.map((product) => product.category)))
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
      } catch (fetchError) {
        if (process.dev) {
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

  const products = computed(() => data.value ?? [])

  return {
    products,
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
      } catch (fetchError) {
        if (process.dev) {
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

  const categories = computed(() => data.value ?? [])

  return {
    categories,
    pending,
    error,
    refresh,
  }
}
