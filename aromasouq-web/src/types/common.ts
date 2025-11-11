export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
}

export interface FilterOptions {
  categoryId?: string
  category?: string // Category slug (e.g., "perfumes", "oud")
  brandId?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  inStock?: boolean
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'bestseller' | 'rating'
  search?: string
  page?: number
  limit?: number
}
