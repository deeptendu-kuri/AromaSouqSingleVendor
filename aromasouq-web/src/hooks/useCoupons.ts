import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Coupon, CreateCouponDto, UpdateCouponDto } from '@/types/coupon';
import toast from 'react-hot-toast';

// Fetch all coupons for the current vendor
export function useCoupons() {
  return useQuery<Coupon[]>({
    queryKey: ['coupons'],
    queryFn: async () => {
      return await apiClient.get('/coupons');
    },
  });
}

// Fetch a single coupon
export function useCoupon(id: string) {
  return useQuery<Coupon>({
    queryKey: ['coupons', id],
    queryFn: async () => {
      return await apiClient.get(`/coupons/${id}`);
    },
    enabled: !!id,
  });
}

// Create a new coupon
export function useCreateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCouponDto) => {
      return await apiClient.post('/coupons', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon created successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create coupon');
    },
  });
}

// Update an existing coupon
export function useUpdateCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateCouponDto }) => {
      return await apiClient.patch(`/coupons/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon');
    },
  });
}

// Delete a coupon
export function useDeleteCoupon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/coupons/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success('Coupon deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete coupon');
    },
  });
}

// Toggle coupon active status
export function useToggleCouponStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      return await apiClient.patch(`/coupons/${id}`, { isActive });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] });
      toast.success(`Coupon ${variables.isActive ? 'activated' : 'deactivated'} successfully!`);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update coupon status');
    },
  });
}
