'use client'

import { useQuery } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'

interface AdminStats {
  revenue: {
    total: number
    thisMonth: number
    growth: number
  }
  customers: {
    total: number
    active: number
    new: number
  }
  vendors: {
    total: number
    pending: number
    approved: number
    rejected: number
    suspended: number
  }
  products: {
    total: number
    active: number
    pendingModeration: number
  }
  orders: {
    total: number
    thisMonth: number
    processing: number
  }
  reviews: {
    total: number
    flagged: number
    averageRating: number
  }
  commissionEarned: number
}

export function useAdminStats() {
  return useQuery<AdminStats>({
    queryKey: ['admin-stats'],
    queryFn: () => apiClient.get('/admin/stats'),
  })
}
