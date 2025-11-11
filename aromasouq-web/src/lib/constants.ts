/**
 * Application constants
 */

// API
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// Pagination
export const ITEMS_PER_PAGE = 12
export const REVIEWS_PER_PAGE = 10

// Cart
export const FREE_SHIPPING_THRESHOLD = 300 // AED
export const TAX_RATE = 0.05 // 5% VAT

// Coins
export const COINS_VALUE = 1.0 // 1 coin = 1 AED (FIXED in Phase 0)
export const COINS_EARN_RATE = 0.10 // 10% of order value as coins
export const COINS_MAX_REDEMPTION = 0.50 // Max 50% of subtotal
export const COINS_PER_REVIEW = 20

// File Uploads
export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
export const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
export const ACCEPTED_VIDEO_TYPES = ['video/mp4', 'video/quicktime']

// Validation
export const MIN_PASSWORD_LENGTH = 8
export const MIN_REVIEW_LENGTH = 20
export const MAX_REVIEW_IMAGES = 3
export const MAX_PRODUCT_IMAGES = 8
export const MAX_PRODUCT_VIDEOS = 3

// Routes
export const PUBLIC_ROUTES = ['/', '/products', '/about', '/login', '/register']
export const AUTH_ROUTES = ['/login', '/register']
export const CUSTOMER_ROUTES = ['/account', '/cart', '/checkout', '/wishlist', '/orders']
export const VENDOR_ROUTES = ['/vendor']
export const ADMIN_ROUTES = ['/admin']

// Enum mappings
export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  VENDOR = 'VENDOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}

export enum PaymentMethod {
  CARD = 'CARD',
  COD = 'COD',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum VendorStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SUSPENDED = 'SUSPENDED',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  UNISEX = 'UNISEX',
}

export enum CoinTransactionType {
  EARNED = 'EARNED',
  SPENT = 'SPENT',
  EXPIRED = 'EXPIRED',
  BONUS = 'BONUS',
}

export enum CoinSource {
  ORDER_PURCHASE = 'ORDER_PURCHASE',
  ORDER_REFUND = 'ORDER_REFUND',
  REVIEW = 'REVIEW',
  SIGNUP = 'SIGNUP',
  ADMIN_ADJUSTMENT = 'ADMIN_ADJUSTMENT',
}
