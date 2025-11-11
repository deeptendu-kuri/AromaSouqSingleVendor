import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export interface Wallet {
  userId: string
  balance: number
  lifetimeEarned: number
  lifetimeSpent: number
}

export interface WalletTransaction {
  id: string
  walletId: string
  type: 'EARN' | 'SPEND' | 'REFUND'
  amount: number
  description: string
  createdAt: Date
}

export function useWallet() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['wallet'],
    queryFn: () => apiClient.get<Wallet>('/wallet'),
  })

  const { data: transactions } = useQuery({
    queryKey: ['wallet-transactions'],
    queryFn: () => apiClient.get<WalletTransaction[]>('/wallet/transactions'),
  })

  const redeemCoins = useMutation({
    mutationFn: (amount: number) =>
      apiClient.post('/wallet/redeem', { amount }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallet'] })
      toast.success('Coins redeemed successfully!')
    },
    onError: () => {
      toast.error('Failed to redeem coins')
    },
  })

  return {
    data,
    wallet: data,
    isLoading,
    error,
    transactions,
    redeemCoins: redeemCoins.mutate,
  }
}
