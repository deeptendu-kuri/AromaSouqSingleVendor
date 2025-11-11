import { Product } from '@/types'

/**
 * Get product image URL from various formats
 * Returns null if no image is available
 */
export function getProductImageUrl(
  product: Product | any,
  index: number = 0
): string | null {
  if (!product.images || product.images.length === 0) {
    return null
  }

  const image = product.images[index]
  if (!image) {
    return null
  }

  // Handle both string URLs and image objects
  return typeof image === 'string' ? image : image.url
}

/**
 * Get first available product image URL or null
 */
export function getFirstProductImage(product: Product | any): string | null {
  return getProductImageUrl(product, 0)
}

/**
 * Check if product has images
 */
export function hasProductImages(product: Product | any): boolean {
  return !!(product.images && product.images.length > 0)
}
