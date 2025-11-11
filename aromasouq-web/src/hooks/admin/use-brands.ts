'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export interface Brand {
  id: string
  name: string
  nameAr?: string
  slug: string
  description?: string
  descriptionAr?: string
  logo?: string
  banner?: string
  isActive: boolean
  _count?: {
    products: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateBrandDto {
  name: string
  nameAr?: string
  slug: string
  description?: string
  descriptionAr?: string
  logo?: string
  banner?: string
  isActive?: boolean
}

export function useBrands() {
  const queryClient = useQueryClient()

  // Fetch all brands with product counts
  const brandsQuery = useQuery<Brand[]>({
    queryKey: ['admin-brands'],
    queryFn: () => apiClient.get('/brands'),
  })

  // Create brand mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateBrandDto) =>
      apiClient.post('/brands', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] })
      queryClient.invalidateQueries({ queryKey: ['brands'] }) // Invalidate public cache too
      toast.success('Brand created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create brand')
    },
  })

  // Update brand mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateBrandDto> }) =>
      apiClient.patch(`/brands/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] })
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update brand')
    },
  })

  // Delete brand mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/brands/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] })
      queryClient.invalidateQueries({ queryKey: ['brands'] })
      toast.success('Brand deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete brand')
    },
  })

  // Toggle isActive status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/brands/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brands'] })
      toast.success('Brand status updated')
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })

  return {
    brands: brandsQuery.data || [],
    isLoading: brandsQuery.isLoading,
    createBrand: createMutation.mutate,
    updateBrand: updateMutation.mutate,
    deleteBrand: deleteMutation.mutate,
    toggleStatus: toggleStatusMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
