export interface DisplayProduct {
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
