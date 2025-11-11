'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export interface Category {
  id: string
  name: string
  nameAr?: string
  slug: string
  description?: string
  descriptionAr?: string
  icon?: string
  image?: string
  parentId?: string
  parent?: Category
  children?: Category[]
  sortOrder: number
  isActive: boolean
  _count?: {
    products: number
  }
  createdAt: string
  updatedAt: string
}

export interface CreateCategoryDto {
  name: string
  nameAr?: string
  slug: string
  description?: string
  descriptionAr?: string
  icon?: string
  image?: string
  parentId?: string
  sortOrder?: number
  isActive?: boolean
}

export function useCategories() {
  const queryClient = useQueryClient()

  // Fetch all categories with product counts
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => apiClient.get('/categories/with-products'),
  })

  // Create category mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateCategoryDto) =>
      apiClient.post('/categories', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] }) // Invalidate public cache too
      toast.success('Category created successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create category')
    },
  })

  // Update category mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CreateCategoryDto> }) =>
      apiClient.patch(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category updated successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update category')
    },
  })

  // Delete category mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiClient.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      toast.success('Category deleted successfully')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete category')
    },
  })

  // Toggle isActive status
  const toggleStatusMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      apiClient.patch(`/categories/${id}`, { isActive }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] })
      toast.success('Category status updated')
    },
    onError: () => {
      toast.error('Failed to update status')
    },
  })

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    createCategory: createMutation.mutate,
    updateCategory: updateMutation.mutate,
    deleteCategory: deleteMutation.mutate,
    toggleStatus: toggleStatusMutation.mutate,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  }
}
