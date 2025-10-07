import Fuse from 'fuse.js'
import type { IFuseOptions } from 'fuse.js'
import type { FakeStoreProduct } from '~/types/fake-store'

const fuseOptions: IFuseOptions<FakeStoreProduct> = {
  keys: ['title', 'description', 'category'],
  ignoreLocation: true,
  threshold: 0.35,
}

/**
 * Execute a Fuse.js search across FakeStore products using the same configuration
 * as the product grid.
 */
export function searchFakeStoreProducts(products: FakeStoreProduct[], rawQuery: string) {
  const query = rawQuery.trim()

  if (!query) {
    return products
  }

  const fuse = new Fuse(products, fuseOptions)
  return fuse.search(query).map(result => result.item)
}
