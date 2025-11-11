import { OrderStatus, PaymentMethod, PaymentStatus } from '@/lib/constants'

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: OrderStatus

  // Items
  items: OrderItem[]

  // Pricing
  subtotal: number
  shippingCost: number
  taxAmount: number
  coinsUsed: number
  coinsEarned: number
  total: number

  // Shipping
  shippingAddress: {
    fullName: string
    phone: string
    addressLine1: string
    addressLine2?: string
    city: string
    emirate: string
    country: string
    zipCode: string
  }

  // Payment
  paymentMethod: PaymentMethod
  paymentStatus: PaymentStatus

  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  variantId?: string
  quantity: number
  price: number
  total: number

  // Product snapshot
  product: {
    name: string
    image: string
    sku: string
  }
}
