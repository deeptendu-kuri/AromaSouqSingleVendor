'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface Product {
  id: string
  slug: string
  nameEn: string
  descriptionEn: string
  regularPrice: number
  salePrice?: number
  stockQuantity: number
  averageRating: number
  reviewCount: number
  images?: { url: string }[]
  brand?: { nameEn: string }
  category?: { nameEn: string }
  scentProfile?: {
    topNotes: string[]
    heartNotes: string[]
    baseNotes: string[]
  }
}

interface ComparisonStore {
  products: Product[]
  addProduct: (product: Product) => void
  removeProduct: (productId: string) => void
  clear: () => void
}

export const useComparison = create<ComparisonStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => {
          if (state.products.length >= 3) {
            alert('You can only compare up to 3 products')
            return state
          }
          if (state.products.some((p) => p.id === product.id)) {
            return state
          }
          return { products: [...state.products, product] }
        }),
      removeProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
      clear: () => set({ products: [] }),
    }),
    {
      name: 'aromasouq-comparison',
    }
  )
)
