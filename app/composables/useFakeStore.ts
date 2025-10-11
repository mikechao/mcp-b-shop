import type { MaybeRefOrGetter } from 'vue'
import type { FakeStoreProduct } from '~/types/fake-store'
import { computed, toValue } from 'vue'
import { fakeStoreProducts } from '../data/fakeStoreFallback'

const EXTRA_PRODUCTS: FakeStoreProduct[] = [
  {
    id: 99999,
    title: 'James the Orange Cat',
    price: 999999.99,
    description: `Bring home the elegance of sunshine with this radiant ginger tabby. With a coat that glows like autumn leaves and eyes full of gentle curiosity, this feline is the embodiment of comfort and grace. Whether perched by the window watching the world go by or curled up on your lap, this cat brings warmth, charm, and quiet companionship into any home.
Perfect for those who appreciate beauty in simplicity, this lovely cat is affectionate yet independent—a loyal friend who loves both playtime and peaceful moments in the sun.`,
    category: 'cats',
    image: '/images/james.jpg',
    rating: { rate: 5, count: 999999 },
  },
  {
    id: 99998,
    title: 'Nightmeow on Elm Street',
    price: 49.99,
    description: `This mischievous little furball is ready to claw its way into your nightmares—adorably, of course. Featuring a fiery orange tabby dressed in the iconic striped sweater, fedora, and razor-sharp claws, this design is a purr-fect mashup of horror and humor.
Whether you’re a horror movie buff, a cat lover, or both, this tee will scratch that itch for quirky, spooky style. Soft, durable, and guaranteed to get laughs (and maybe a few uneasy stares), it’s a must-have for Halloween season or any day you want to unleash your inner nightmare.`,
    category: 'cats',
    image: '/images/kittykruger.webp',
    rating: { rate: 4.9, count: 1234 },
  },
]

const DEFAULT_BASE_URL = 'https://fakestoreapi.com'

function resolveFallbackProducts(category: string | null) {
  if (!category) {
    return fakeStoreProducts
  }

  return fakeStoreProducts.filter(product => product.category === category)
}

function resolveFallbackProduct(id: number) {
  const fromCatalog = fakeStoreProducts.find(product => product.id === id)
  if (fromCatalog) {
    return fromCatalog
  }

  const fromExtras = EXTRA_PRODUCTS.find(product => product.id === id)
  if (fromExtras) {
    return fromExtras
  }

  return null
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

  const productsWithExtra = computed(() => {
    const base = data.value ?? []

    // Respect category filter: if a specific category is selected and it doesn't
    // match the hardcoded products' category, return the base list unchanged.
    if (
      normalizedCategory.value
      && !EXTRA_PRODUCTS.some(product => product.category === normalizedCategory.value)
    ) {
      return base
    }

    // Build extras array with collision-safe ids
    const maxId = base.reduce((m, p) => Math.max(m, p.id), 0)

    const extras: FakeStoreProduct[] = []

    EXTRA_PRODUCTS.forEach((prod, index) => {
      const offset = index + 1
      if (base.some(p => p.id === prod.id) || extras.some(p => p.id === prod.id)) {
        extras.push({ ...prod, id: maxId + offset })
      }
      else {
        extras.push({ ...prod })
      }
    })

    // Place the hardcoded products first (in desired order) so they appear at the top of the product grid.
    return [...extras, ...base]
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

export function useFakeStoreProduct(id: MaybeRefOrGetter<number | string | null | undefined>) {
  const runtimeConfig = useRuntimeConfig()
  const baseURL = runtimeConfig.public.fakeStoreApiBase || DEFAULT_BASE_URL

  const normalizedId = computed(() => {
    const raw = toValue(id)

    if (raw === null || raw === undefined) {
      return null
    }

    const parsed = Number(raw)

    if (Number.isNaN(parsed)) {
      return null
    }

    return parsed
  })

  const key = computed(() =>
    normalizedId.value !== null ? `fake-store-product-${normalizedId.value}` : 'fake-store-product-null',
  )

  const { data, pending, error, refresh } = useAsyncData<FakeStoreProduct | null>(
    () => key.value,
    async () => {
      if (normalizedId.value === null) {
        return null
      }

      try {
        return await $fetch<FakeStoreProduct>(`${baseURL}/products/${normalizedId.value}`)
      }
      catch (fetchError) {
        if (import.meta.env.DEV) {
          console.warn('[FakeStore] Falling back to bundled product.', fetchError)
        }

        return resolveFallbackProduct(normalizedId.value)
      }
    },
    {
      default: () => null,
      server: true,
      lazy: false,
      watch: [normalizedId],
    },
  )

  return {
    product: computed(() => data.value),
    pending,
    error,
    refresh,
  }
}
