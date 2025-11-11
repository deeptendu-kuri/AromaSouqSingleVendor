import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merge Tailwind classes with proper precedence
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format currency to AED
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: 'AED',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'N/A'

  try {
    const dateObj = new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }

    return new Intl.DateTimeFormat('en-AE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(dateObj)
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Format relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const now = new Date()
  const then = new Date(date)
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`

  return formatDate(date)
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(
  regularPrice: number,
  salePrice: number
): number {
  if (!salePrice || salePrice >= regularPrice) return 0
  return Math.round(((regularPrice - salePrice) / regularPrice) * 100)
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
