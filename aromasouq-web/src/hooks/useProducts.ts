import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { Product, PaginatedResponse, FilterOptions } from '@/types'

export function useProducts(filters?: FilterOptions) {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => apiClient.get<PaginatedResponse<Product>>('/products', filters),
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => apiClient.get<Product>(`/products/slug/${slug}`),
    enabled: !!slug,
  })
}

export function useCreateProduct() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Product>) => apiClient.post<Product>('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export function useUpdateProduct(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Partial<Product>) => apiClient.put<Product>(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', id] })
    },
  })
}
