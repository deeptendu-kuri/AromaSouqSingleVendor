import { useMutation } from '@tanstack/react-query'
import { apiClient } from '@/lib/api-client'
import toast from 'react-hot-toast'

export interface CouponValidationResponse {
  valid: boolean
  coupon: {
    id: string
    code: string
    discountType: 'PERCENTAGE' | 'FIXED'
    discountValue: number
  }
  discountAmount: number
  finalAmount: number
}

export interface ValidateCouponRequest {
  code: string
  orderAmount: number
}

export function useCoupon() {
  const validateCoupon = useMutation({
    mutationFn: (data: ValidateCouponRequest) =>
      apiClient.post<CouponValidationResponse>('/coupons/validate', data),
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Invalid coupon code'
      toast.error(message)
    },
  })

  return {
    validateCoupon,
    isValidating: validateCoupon.isPending,
    validationResult: validateCoupon.data,
    validationError: validateCoupon.error,
    resetValidation: validateCoupon.reset,
  }
}
