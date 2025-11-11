import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import toast from 'react-hot-toast';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string | null;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  zipCode: string;
  isDefault?: boolean;
}

// Fetch all addresses for the current user
export function useAddresses() {
  return useQuery<Address[]>({
    queryKey: ['addresses'],
    queryFn: async () => {
      return await apiClient.get('/addresses');
    },
  });
}

// Fetch a single address
export function useAddress(id: string) {
  return useQuery<Address>({
    queryKey: ['addresses', id],
    queryFn: async () => {
      return await apiClient.get(`/addresses/${id}`);
    },
    enabled: !!id,
  });
}

// Create a new address
export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateAddressDto) => {
      return await apiClient.post('/addresses', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address added successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add address');
    },
  });
}

// Update an existing address
export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateAddressDto> }) => {
      return await apiClient.patch(`/addresses/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address updated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update address');
    },
  });
}

// Delete an address
export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.delete(`/addresses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address deleted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete address');
    },
  });
}

// Set an address as default
export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await apiClient.patch(`/addresses/${id}/set-default`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Default address updated!');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to set default address');
    },
  });
}
