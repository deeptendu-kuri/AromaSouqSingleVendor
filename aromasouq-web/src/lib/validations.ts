import * as z from "zod"

// Login Schema
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

export type LoginInput = z.infer<typeof loginSchema>

// Register Schema
export const registerSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type RegisterInput = z.infer<typeof registerSchema>

// Vendor Registration Schema
export const vendorRegisterSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  businessName: z.string().min(3, { message: "Business name must be at least 3 characters" }),
  businessPhone: z.string().min(10, { message: "Business phone must be at least 10 digits" }),
  businessAddress: z.string().min(10, { message: "Business address must be at least 10 characters" }),
  tradeLicenseNumber: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type VendorRegisterInput = z.infer<typeof vendorRegisterSchema>

// Review Schema
export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  title: z.string().min(5, { message: "Title must be at least 5 characters" }),
  comment: z.string().min(20, { message: "Review must be at least 20 characters" }),
  longevity: z.number().min(1).max(24).optional(),
  sillage: z.number().min(1).max(5).optional(),
  season: z.enum(["spring", "summer", "autumn", "winter", "all"]).optional(),
  occasion: z.enum(["casual", "formal", "party", "office", "all"]).optional(),
})

export type ReviewInput = z.infer<typeof reviewSchema>

// Address Schema
export const addressSchema = z.object({
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  addressLine1: z.string().min(5, { message: "Address line 1 is required" }),
  addressLine2: z.string().optional(),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State/Emirate is required" }),
  country: z.string().optional(),
  zipCode: z.string().min(4, { message: "ZIP code is required (min 4 characters)" }),
  isDefault: z.boolean().optional(),
})

export type AddressInput = z.infer<typeof addressSchema>

// Product Schema (for vendor)
export const productSchema = z.object({
  nameEn: z.string().min(3, { message: "Product name (EN) must be at least 3 characters" }),
  nameAr: z.string().min(3, { message: "Product name (AR) must be at least 3 characters" }),
  descriptionEn: z.string().min(20, { message: "Description (EN) must be at least 20 characters" }),
  descriptionAr: z.string().min(20, { message: "Description (AR) must be at least 20 characters" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
  brandId: z.string().optional(),
  regularPrice: z.number().min(1, { message: "Regular price must be at least 1 AED" }),
  salePrice: z.number().optional(),
  stockQuantity: z.number().min(0, { message: "Stock quantity must be 0 or more" }),
  sku: z.string().min(3, { message: "SKU must be at least 3 characters" }),
  weight: z.number().optional(),
  volume: z.number().optional(),
  concentration: z.string().optional(),
})

export type ProductInput = z.infer<typeof productSchema>
