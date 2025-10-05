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
