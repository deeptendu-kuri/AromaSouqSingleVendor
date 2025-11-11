import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { ProductVariant } from '@/types/product';
import toast from 'react-hot-toast';

export interface CreateVariantDto {
  name: string;
  nameAr?: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  compareAtPrice?: number;
}

export interface UpdateVariantDto {
  name?: string;
  nameAr?: string;
  sku?: string;
  price?: number;
  stock?: number;
  image?: string;
  compareAtPrice?: number;
  isActive?: boolean;
  sortOrder?: number;
}

// Fetch all variants for a product
export function useProductVariants(productId: string) {
  return useQuery<ProductVariant[]>({
    queryKey: ['variants', productId],
    queryFn: async () => {
      return await apiClient.get(`/products/${productId}/variants`);
    },
    enabled: !!productId,
  });
}

// Create a new variant
export function useCreateVariant(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateVariantDto) => {
      return await apiClient.post(`/products/${productId}/variants`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', productId] });
      toast.success('Variant created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create variant');
    },
  });
}

// Update an existing variant
export function useUpdateVariant(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateVariantDto }) => {
      return await apiClient.patch(`/products/variants/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', productId] });
      toast.success('Variant updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update variant');
    },
  });
}

// Delete a variant
export function useDeleteVariant(productId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variantId: string) => {
      return await apiClient.delete(`/products/variants/${variantId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['variants', productId] });
      queryClient.invalidateQueries({ queryKey: ['products', productId] });
      toast.success('Variant deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete variant');
    },
  });
}
