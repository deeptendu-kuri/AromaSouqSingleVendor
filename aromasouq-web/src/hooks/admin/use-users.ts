'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { User } from '@/types'
import { UserRole, UserStatus } from '@/lib/constants'
import toast from 'react-hot-toast'

interface UsersFilters {
  search?: string
  role?: UserRole
  status?: UserStatus
  page?: number
  limit?: number
}

interface UsersResponse {
  data: User[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export function useUsers(filters: UsersFilters = {}) {
  const queryClient = useQueryClient()

  const usersQuery = useQuery<UsersResponse>({
    queryKey: ['admin-users', filters],
    queryFn: () => apiClient.get('/admin/users', filters),
  })

  const updateStatusMutation = useMutation({
    mutationFn: ({ userId, status }: { userId: string; status: UserStatus }) =>
      apiClient.patch(`/admin/users/${userId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User status updated successfully')
    },
    onError: () => {
      toast.error('Failed to update user status')
    },
  })

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => apiClient.delete(`/admin/users/${userId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast.success('User deleted successfully')
    },
    onError: () => {
      toast.error('Failed to delete user')
    },
  })

  return {
    users: usersQuery.data?.data || [],
    pagination: usersQuery.data?.meta,
    isLoading: usersQuery.isLoading,
    updateStatus: updateStatusMutation.mutate,
    deleteUser: deleteUserMutation.mutate,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteUserMutation.isPending,
  }
}
