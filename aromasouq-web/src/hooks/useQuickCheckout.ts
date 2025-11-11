'use client'

import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import { useRouter } from '@/i18n/navigation'
import toast from 'react-hot-toast'

interface QuickCheckoutData {
  productId: string
  variantId?: string
  quantity: number
  addressId: string
  deliveryMethod: 'STANDARD' | 'EXPRESS'
  paymentMethod: 'CARD' | 'CASH_ON_DELIVERY'
  coinsToUse?: number
  giftOptions?: {
    isGift: boolean
    giftMessage?: string
    giftWrapping?: 'BASIC' | 'PREMIUM' | 'LUXURY'
  }
}

export function useQuickCheckout() {
  const router = useRouter()

  const quickCheckoutMutation = useMutation({
    mutationFn: (data: QuickCheckoutData) =>
      apiClient.post<{ id: string; orderNumber: string }>('/checkout/quick', data),
    onSuccess: (order) => {
      toast.success(`Order #${order.orderNumber} placed successfully!`)
      router.push(`/orders/${order.id}`)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Checkout failed. Please try again.')
    },
  })

  return {
    quickCheckout: quickCheckoutMutation.mutate,
    isProcessing: quickCheckoutMutation.isPending,
  }
}
