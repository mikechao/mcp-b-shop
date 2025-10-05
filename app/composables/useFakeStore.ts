import type { MaybeRefOrGetter } from 'vue'
import { computed, toValue } from 'vue'

const DEFAULT_BASE_URL = 'https://fakestoreapi.com'

export interface FakeStoreRating {
  rate: number
  count: number
}

export interface FakeStoreProduct {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating?: FakeStoreRating
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
    () => $fetch(`${baseURL}${endpoint.value}`),
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
    () => $fetch(`${baseURL}/products/categories`),
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
