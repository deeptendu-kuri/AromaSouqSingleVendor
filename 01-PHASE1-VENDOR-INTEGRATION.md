# 🏪 PHASE 1: Vendor Integration & Testing

## Overview
**Goal:** Enable vendors to register, create their profile, add products with images, and manage their inventory.

**Why Vendor First?** Vendors must create products before admins can approve them and customers can purchase them.

**Timeline:** 5-7 days
**Prerequisites:** Backend running on port 3001, Frontend running on port 3000

---

## 📋 Phase 1 Scope

### Features to Integrate
1. ✅ Vendor Registration
2. ✅ Vendor Authentication
3. ✅ Vendor Profile Management
4. ✅ Product CRUD Operations
5. ✅ Product Image Uploads
6. ✅ Product Variant Management
7. ✅ Stock Management
8. ⚠️ Vendor Order Viewing (prepare for Phase 2)

### Backend Endpoints Used
```
POST   /api/auth/register          - Vendor registration
POST   /api/auth/login             - Vendor login
GET    /api/auth/me                - Get vendor profile
POST   /api/products               - Create product
GET    /api/products               - List vendor products
GET    /api/products/:id           - Get single product
PATCH  /api/products/:id           - Update product
PATCH  /api/products/:id/stock     - Update stock
DELETE /api/products/:id           - Delete product
POST   /api/uploads/products/:id/images - Upload product images
GET    /api/categories             - Get categories list
GET    /api/brands                 - Get brands list
GET    /api/users/profile          - Get vendor profile
PATCH  /api/users/profile          - Update vendor profile
```

### Frontend Pages
```
/register                           - Vendor registration
/login                              - Vendor login
/vendor                             - Vendor dashboard
/vendor/products                    - Product management
```

---

## 🛠️ STEP 1: Setup API Service Layer

### 1.1 Create Type Definitions

**File:** `src/types/api/common.types.ts`

```typescript
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}
```

**File:** `src/types/api/auth.types.ts`

```typescript
export interface RegisterDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  emailVerified: boolean;
  preferredLanguage: string;
  coinsBalance: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  access_token: string;
  user: Omit<User, 'password'>;
}
```

**File:** `src/types/api/product.types.ts`

```typescript
export interface Product {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockAlert: number;
  images: string[];
  video?: string;

  categoryId: string;
  category?: Category;
  brandId?: string;
  brand?: Brand;
  vendorId: string;
  vendor?: Vendor;

  // Fragrance specs
  size?: string;
  concentration?: string;
  gender?: string;
  notes?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  scentFamily?: string;
  longevity?: string;
  sillage?: string;
  season?: string;

  // Features
  enableWhatsapp: boolean;
  whatsappNumber?: string;
  coinsToAward: number;
  viewCount: number;
  salesCount: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Status
  isActive: boolean;
  isFeatured: boolean;

  // Reviews
  averageRating: number;
  reviewCount: number;

  variants?: ProductVariant[];
  videos?: ProductVideo[];

  createdAt: string;
  updatedAt: string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  nameAr?: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  compareAtPrice?: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductVideo {
  id: string;
  productId: string;
  url: string;
  title?: string;
  titleAr?: string;
  thumbnail?: string;
  duration?: number;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  price: number;
  compareAtPrice?: number;
  cost?: number;
  sku: string;
  barcode?: string;
  stock: number;
  lowStockAlert?: number;

  categoryId: string;
  brandId?: string;

  size?: string;
  concentration?: string;
  gender?: string;
  notes?: string;
  topNotes?: string;
  heartNotes?: string;
  baseNotes?: string;
  scentFamily?: string;
  longevity?: string;
  sillage?: string;
  season?: string;

  enableWhatsapp?: boolean;
  whatsappNumber?: string;
  coinsToAward?: number;

  metaTitle?: string;
  metaDescription?: string;

  isActive?: boolean;
  isFeatured?: boolean;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export interface UpdateStockDto {
  quantity: number;
}

export interface ProductFilters {
  categoryId?: string;
  brandId?: string;
  vendorId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  gender?: string;
  concentration?: string;
  scentFamily?: string;
  season?: string;
  isFeatured?: boolean;
  isActive?: boolean;
  sortBy?: 'price' | 'createdAt' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface Category {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  icon?: string;
  image?: string;
  parentId?: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  nameAr?: string;
  slug: string;
  description?: string;
  descriptionAr?: string;
  logo?: string;
  banner?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vendor {
  id: string;
  userId: string;
  businessName: string;
  businessNameAr?: string;
  description?: string;
  descriptionAr?: string;
  logo?: string;
  banner?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  createdAt: string;
  updatedAt: string;
}
```

**File:** `src/types/api/user.types.ts`

```typescript
export interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  preferredLanguage?: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}
```

---

### 1.2 Create Auth Service

**File:** `src/services/auth.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
  User
} from '@/types/api/auth.types';
import type { ApiResponse } from '@/types/api/common.types';

export const authService = {
  /**
   * Register a new user (vendor, customer, or admin)
   */
  register: async (data: RegisterDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', data);
    return response;
  },

  /**
   * Login with email and password
   */
  login: async (data: LoginDto): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', data);
    return response;
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout', {});
  },

  /**
   * Get current authenticated user
   */
  me: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response;
  },
};
```

---

### 1.3 Create Products Service

**File:** `src/services/products.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type {
  Product,
  CreateProductDto,
  UpdateProductDto,
  UpdateStockDto,
  ProductFilters
} from '@/types/api/product.types';
import type { PaginatedResponse } from '@/types/api/common.types';

export const productsService = {
  /**
   * Get all products with filters and pagination
   */
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const response = await apiClient.get<PaginatedResponse<Product>>('/products', filters);
    return response;
  },

  /**
   * Get featured products
   */
  getFeatured: async (limit: number = 10): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products/featured', { limit });
    return response;
  },

  /**
   * Get product by slug
   */
  getBySlug: async (slug: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/slug/${slug}`);
    return response;
  },

  /**
   * Get product by ID
   */
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response;
  },

  /**
   * Create new product (Vendor/Admin only)
   */
  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response;
  },

  /**
   * Update product (Vendor/Admin only)
   */
  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}`, data);
    return response;
  },

  /**
   * Update product stock
   */
  updateStock: async (id: string, quantity: number): Promise<Product> => {
    const response = await apiClient.patch<Product>(`/products/${id}/stock`, { quantity });
    return response;
  },

  /**
   * Delete product (soft delete)
   */
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },

  /**
   * Upload product images
   */
  uploadImages: async (productId: string, files: File[]): Promise<{ urls: string[] }> => {
    const response = await apiClient.uploadFiles<{ urls: string[] }>(
      `/uploads/products/${productId}/images`,
      files
    );
    return response;
  },
};
```

---

### 1.4 Create Categories & Brands Services

**File:** `src/services/categories.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type { Category } from '@/types/api/product.types';

export const categoriesService = {
  /**
   * Get all categories
   */
  getAll: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories');
    return response;
  },

  /**
   * Get categories with product counts
   */
  getAllWithProducts: async (): Promise<Category[]> => {
    const response = await apiClient.get<Category[]>('/categories/with-products');
    return response;
  },

  /**
   * Get category by slug
   */
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/slug/${slug}`);
    return response;
  },

  /**
   * Get category by ID
   */
  getById: async (id: string): Promise<Category> => {
    const response = await apiClient.get<Category>(`/categories/${id}`);
    return response;
  },
};
```

**File:** `src/services/brands.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type { Brand } from '@/types/api/product.types';

export const brandsService = {
  /**
   * Get all brands
   */
  getAll: async (): Promise<Brand[]> => {
    const response = await apiClient.get<Brand[]>('/brands');
    return response;
  },

  /**
   * Get brand by slug
   */
  getBySlug: async (slug: string): Promise<Brand> => {
    const response = await apiClient.get<Brand>(`/brands/slug/${slug}`);
    return response;
  },

  /**
   * Get brand by ID
   */
  getById: async (id: string): Promise<Brand> => {
    const response = await apiClient.get<Brand>(`/brands/${id}`);
    return response;
  },
};
```

---

### 1.5 Create Users Service

**File:** `src/services/users.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type { User } from '@/types/api/auth.types';
import type { UpdateProfileDto, ChangePasswordDto } from '@/types/api/user.types';

export const usersService = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/users/profile');
    return response;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileDto): Promise<User> => {
    const response = await apiClient.patch<User>('/users/profile', data);
    return response;
  },

  /**
   * Change password
   */
  changePassword: async (data: ChangePasswordDto): Promise<void> => {
    await apiClient.patch('/users/change-password', data);
  },

  /**
   * Upload user avatar
   */
  uploadAvatar: async (file: File): Promise<{ url: string }> => {
    const response = await apiClient.uploadFile<{ url: string }>(
      '/uploads/users/avatar',
      file
    );
    return response;
  },
};
```

---

## 🎨 STEP 2: Update Auth Store to Use Services

**File:** `src/stores/authStore.ts`

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '@/services/auth.service';
import type { User, RegisterDto, LoginDto } from '@/types/api/auth.types';
import toast from 'react-hot-toast';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User | null) => void;
  login: (data: LoginDto) => Promise<void>;
  register: (data: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

      login: async (data) => {
        try {
          set({ isLoading: true });
          const result = await authService.login(data);
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false
          });
          toast.success('Login successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error?.message || 'Login failed');
          throw error;
        }
      },

      register: async (data) => {
        try {
          set({ isLoading: true });
          const result = await authService.register(data);
          set({
            user: result.user,
            isAuthenticated: true,
            isLoading: false
          });
          toast.success('Registration successful!');
        } catch (error: any) {
          set({ isLoading: false });
          toast.error(error?.message || 'Registration failed');
          throw error;
        }
      },

      logout: async () => {
        try {
          await authService.logout();
          set({ user: null, isAuthenticated: false });
          toast.success('Logged out successfully');
        } catch (error: any) {
          toast.error('Logout failed');
          throw error;
        }
      },

      fetchUser: async () => {
        try {
          set({ isLoading: true });
          const user = await authService.me();
          set({
            user,
            isAuthenticated: true,
            isLoading: false
          });
        } catch (error) {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => {
        // Use localStorage only on client side
        if (typeof window !== 'undefined') {
          return window.localStorage;
        }
        // Return a no-op storage for SSR
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
    }
  )
);
```

---

## 📄 STEP 3: Vendor Registration Integration

### 3.1 Update Registration Page

**File:** `src/app/register/page.tsx`

Update the form submission to use the auth store:

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { RegisterDto } from '@/types/api/auth.types';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<RegisterDto>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'CUSTOMER',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await register(formData);

      // Redirect based on role
      if (formData.role === 'VENDOR') {
        router.push('/vendor');
      } else if (formData.role === 'ADMIN') {
        router.push('/admin');
      } else {
        router.push('/');
      }
    } catch (error) {
      // Error already handled in store with toast
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-gray-600 mt-2">Join AromaSouq today</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* First Name */}
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>

          {/* Last Name */}
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+971501234567"
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={6}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Role Selection */}
          <div>
            <Label>I want to</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as any })}
              className="mt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="CUSTOMER" id="customer" />
                <Label htmlFor="customer" className="font-normal cursor-pointer">
                  Shop for fragrances
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="VENDOR" id="vendor" />
                <Label htmlFor="vendor" className="font-normal cursor-pointer">
                  Sell fragrances (Become a vendor)
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Button>

          {/* Login Link */}
          <p className="text-center text-sm">
            Already have an account?{' '}
            <a href="/login" className="text-primary hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
```

---

### 3.2 Update Login Page

**File:** `src/app/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { LoginDto } from '@/types/api/auth.types';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const { login, isLoading } = useAuthStore();
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(formData);
      router.push(returnUrl);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Login to your AromaSouq account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>

          {/* Register Link */}
          <p className="text-center text-sm">
            Don't have an account?{' '}
            <a href="/register" className="text-primary hover:underline">
              Create Account
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
```

---

## 🏪 STEP 4: Vendor Dashboard Integration

### 4.1 Create Vendor Dashboard Stats Hook

**File:** `src/hooks/useVendorStats.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { useAuthStore } from '@/stores/authStore';

export function useVendorStats() {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: ['vendor-stats', user?.id],
    queryFn: async () => {
      // Get vendor products
      const response = await productsService.getAll({
        vendorId: user?.id,
        page: 1,
        limit: 100,
      });

      const products = response.data;

      // Calculate stats
      const totalProducts = response.meta.total;
      const activeProducts = products.filter(p => p.isActive).length;
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const lowStockProducts = products.filter(p => p.stock <= p.lowStockAlert).length;
      const totalSales = products.reduce((sum, p) => sum + p.salesCount, 0);
      const totalRevenue = products.reduce((sum, p) => sum + (p.salesCount * p.price), 0);

      return {
        totalProducts,
        activeProducts,
        totalStock,
        lowStockProducts,
        totalSales,
        totalRevenue,
      };
    },
    enabled: !!user?.id && user?.role === 'VENDOR',
  });
}
```

### 4.2 Update Vendor Dashboard Page

**File:** `src/app/vendor/page.tsx`

```typescript
'use client';

import { useAuthStore } from '@/stores/authStore';
import { useVendorStats } from '@/hooks/useVendorStats';
import { StatsCard } from '@/components/ui/stats-card';
import { Package, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

export default function VendorDashboard() {
  const { user, isAuthenticated } = useAuthStore();
  const { data: stats, isLoading } = useVendorStats();

  // Protect route
  if (!isAuthenticated || user?.role !== 'VENDOR') {
    redirect('/login');
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Vendor Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back, {user?.firstName}!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Products"
          value={stats?.totalProducts || 0}
          icon={<Package className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Active Products"
          value={stats?.activeProducts || 0}
          icon={<TrendingUp className="w-6 h-6" />}
          loading={isLoading}
        />
        <StatsCard
          title="Low Stock Alerts"
          value={stats?.lowStockProducts || 0}
          icon={<AlertTriangle className="w-6 h-6" />}
          variant={stats?.lowStockProducts ? 'warning' : 'default'}
          loading={isLoading}
        />
        <StatsCard
          title="Total Revenue"
          value={`AED ${stats?.totalRevenue?.toFixed(2) || '0.00'}`}
          icon={<DollarSign className="w-6 h-6" />}
          loading={isLoading}
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <a
          href="/vendor/products"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">Manage Products</h3>
          <p className="text-gray-600">
            Add, edit, or remove products from your catalog
          </p>
        </a>

        <a
          href="/vendor/orders"
          className="p-6 border rounded-lg hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold mb-2">View Orders</h3>
          <p className="text-gray-600">
            Track and manage your orders
          </p>
        </a>
      </div>
    </div>
  );
}
```

---

## 📦 STEP 5: Vendor Products Management

### 5.1 Create Product Form Component

**File:** `src/components/vendor/ProductForm.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { categoriesService } from '@/services/categories.service';
import { brandsService } from '@/services/brands.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import toast from 'react-hot-toast';
import type { Product, CreateProductDto } from '@/types/api/product.types';

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const queryClient = useQueryClient();
  const isEditing = !!product;

  // Fetch categories and brands
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesService.getAll,
  });

  const { data: brands = [] } = useQuery({
    queryKey: ['brands'],
    queryFn: brandsService.getAll,
  });

  // Form state
  const [formData, setFormData] = useState<CreateProductDto>({
    name: product?.name || '',
    nameAr: product?.nameAr || '',
    slug: product?.slug || '',
    description: product?.description || '',
    descriptionAr: product?.descriptionAr || '',
    price: product?.price || 0,
    compareAtPrice: product?.compareAtPrice || undefined,
    cost: product?.cost || undefined,
    sku: product?.sku || '',
    barcode: product?.barcode || '',
    stock: product?.stock || 0,
    lowStockAlert: product?.lowStockAlert || 10,
    categoryId: product?.categoryId || '',
    brandId: product?.brandId || '',
    size: product?.size || '',
    concentration: product?.concentration || '',
    gender: product?.gender || '',
    topNotes: product?.topNotes || '',
    heartNotes: product?.heartNotes || '',
    baseNotes: product?.baseNotes || '',
    scentFamily: product?.scentFamily || '',
    longevity: product?.longevity || '',
    sillage: product?.sillage || '',
    season: product?.season || '',
    enableWhatsapp: product?.enableWhatsapp || false,
    whatsappNumber: product?.whatsappNumber || '',
    coinsToAward: product?.coinsToAward || 0,
    metaTitle: product?.metaTitle || '',
    metaDescription: product?.metaDescription || '',
    isActive: product?.isActive ?? true,
    isFeatured: product?.isFeatured || false,
  });

  // Auto-generate slug from name
  useEffect(() => {
    if (!isEditing && formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.name, isEditing]);

  // Create/Update mutation
  const mutation = useMutation({
    mutationFn: (data: CreateProductDto) => {
      if (isEditing && product) {
        return productsService.update(product.id, data);
      }
      return productsService.create(data);
    },
    onSuccess: () => {
      toast.success(isEditing ? 'Product updated!' : 'Product created!');
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to save product');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="nameAr">Product Name (Arabic)</Label>
            <Input
              id="nameAr"
              value={formData.nameAr}
              onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="slug">Slug *</Label>
          <Input
            id="slug"
            required
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="descriptionAr">Description (Arabic)</Label>
          <Textarea
            id="descriptionAr"
            rows={4}
            value={formData.descriptionAr}
            onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
          />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Pricing & Inventory</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="price">Price (AED) *</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="compareAtPrice">Compare At Price</Label>
            <Input
              id="compareAtPrice"
              type="number"
              step="0.01"
              value={formData.compareAtPrice || ''}
              onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>

          <div>
            <Label htmlFor="cost">Cost</Label>
            <Input
              id="cost"
              type="number"
              step="0.01"
              value={formData.cost || ''}
              onChange={(e) => setFormData({ ...formData, cost: e.target.value ? parseFloat(e.target.value) : undefined })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="sku">SKU *</Label>
            <Input
              id="sku"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="stock">Stock Quantity *</Label>
            <Input
              id="stock"
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="lowStockAlert">Low Stock Alert</Label>
            <Input
              id="lowStockAlert"
              type="number"
              value={formData.lowStockAlert}
              onChange={(e) => setFormData({ ...formData, lowStockAlert: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </div>

      {/* Category & Brand */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Category & Brand</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="categoryId">Category *</Label>
            <Select
              value={formData.categoryId}
              onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="brandId">Brand</Label>
            <Select
              value={formData.brandId || ''}
              onValueChange={(value) => setFormData({ ...formData, brandId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Fragrance Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Fragrance Details</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="size">Size</Label>
            <Input
              id="size"
              placeholder="e.g., 100ml"
              value={formData.size}
              onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="concentration">Concentration</Label>
            <Input
              id="concentration"
              placeholder="e.g., Eau de Parfum"
              value={formData.concentration}
              onChange={(e) => setFormData({ ...formData, concentration: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender || ''}
              onValueChange={(value) => setFormData({ ...formData, gender: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Unisex">Unisex</SelectItem>
                <SelectItem value="Men">Men</SelectItem>
                <SelectItem value="Women">Women</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="topNotes">Top Notes</Label>
            <Input
              id="topNotes"
              placeholder="e.g., Bergamot, Lemon"
              value={formData.topNotes}
              onChange={(e) => setFormData({ ...formData, topNotes: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="heartNotes">Heart Notes</Label>
            <Input
              id="heartNotes"
              placeholder="e.g., Rose, Jasmine"
              value={formData.heartNotes}
              onChange={(e) => setFormData({ ...formData, heartNotes: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="baseNotes">Base Notes</Label>
            <Input
              id="baseNotes"
              placeholder="e.g., Oud, Amber"
              value={formData.baseNotes}
              onChange={(e) => setFormData({ ...formData, baseNotes: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="scentFamily">Scent Family</Label>
            <Input
              id="scentFamily"
              placeholder="e.g., Oriental, Woody"
              value={formData.scentFamily}
              onChange={(e) => setFormData({ ...formData, scentFamily: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="longevity">Longevity</Label>
            <Input
              id="longevity"
              placeholder="e.g., 6-8 hours"
              value={formData.longevity}
              onChange={(e) => setFormData({ ...formData, longevity: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="sillage">Sillage</Label>
            <Input
              id="sillage"
              placeholder="e.g., Moderate"
              value={formData.sillage}
              onChange={(e) => setFormData({ ...formData, sillage: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="season">Recommended Season</Label>
          <Input
            id="season"
            placeholder="e.g., Summer, Winter"
            value={formData.season}
            onChange={(e) => setFormData({ ...formData, season: e.target.value })}
          />
        </div>
      </div>

      {/* Status & Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Settings</h3>

        <div className="flex items-center space-x-2">
          <Switch
            id="isActive"
            checked={formData.isActive}
            onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
          />
          <Label htmlFor="isActive">Active Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="isFeatured"
            checked={formData.isFeatured}
            onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
          />
          <Label htmlFor="isFeatured">Featured Product</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="enableWhatsapp"
            checked={formData.enableWhatsapp}
            onCheckedChange={(checked) => setFormData({ ...formData, enableWhatsapp: checked })}
          />
          <Label htmlFor="enableWhatsapp">Enable WhatsApp Contact</Label>
        </div>

        {formData.enableWhatsapp && (
          <div>
            <Label htmlFor="whatsappNumber">WhatsApp Number</Label>
            <Input
              id="whatsappNumber"
              placeholder="+971501234567"
              value={formData.whatsappNumber}
              onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
            />
          </div>
        )}

        <div>
          <Label htmlFor="coinsToAward">Coins to Award (per purchase)</Label>
          <Input
            id="coinsToAward"
            type="number"
            value={formData.coinsToAward}
            onChange={(e) => setFormData({ ...formData, coinsToAward: parseInt(e.target.value) })}
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
        </Button>
      </div>
    </form>
  );
}
```

---

---

## 📦 STEP 6: Vendor Products List Page

**File:** `src/app/vendor/products/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { useAuthStore } from '@/stores/authStore';
import { ProductForm } from '@/components/vendor/ProductForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Package, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import type { Product } from '@/types/api/product.types';

export default function VendorProductsPage() {
  const { user, isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  // Protect route
  if (!isAuthenticated || user?.role !== 'VENDOR') {
    redirect('/login');
  }

  // Fetch vendor products
  const { data, isLoading } = useQuery({
    queryKey: ['vendor-products', user?.id, page],
    queryFn: () => productsService.getAll({
      vendorId: user?.id,
      page,
      limit,
    }),
    enabled: !!user?.id,
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (productId: string) => productsService.delete(productId),
    onSuccess: () => {
      toast.success('Product deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      queryClient.invalidateQueries({ queryKey: ['vendor-stats'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to delete product');
    },
  });

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const products = data?.data || [];
  const meta = data?.meta;

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {/* Products Table */}
      {isLoading ? (
        <div className="text-center py-12">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold mb-2">No products yet</h3>
          <p className="text-gray-600 mb-4">Create your first product to get started</p>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.images?.[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded mr-4"
                          />
                        )}
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.category?.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm">{product.sku}</td>
                    <td className="px-6 py-4 text-sm font-medium">
                      AED {product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <span className="text-sm font-medium">{product.stock}</span>
                        {product.stock <= product.lowStockAlert && (
                          <AlertCircle className="w-4 h-4 text-orange-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={product.isActive ? 'success' : 'secondary'}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingProduct(product)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {meta && meta.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-4 mt-6">
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {page} of {meta.totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                disabled={page === meta.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Create Product Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            onSuccess={() => setIsCreateModalOpen(false)}
            onCancel={() => setIsCreateModalOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductForm
              product={editingProduct}
              onSuccess={() => setEditingProduct(null)}
              onCancel={() => setEditingProduct(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
```

---

## 📸 STEP 7: Product Image Upload Integration

### 7.1 Create Image Upload Component

**File:** `src/components/vendor/ProductImageUpload.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductImageUploadProps {
  productId: string;
  currentImages?: string[];
}

export function ProductImageUpload({ productId, currentImages = [] }: ProductImageUploadProps) {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => productsService.uploadImages(productId, files),
    onSuccess: () => {
      toast.success('Images uploaded successfully!');
      queryClient.invalidateQueries({ queryKey: ['vendor-products'] });
      setSelectedFiles([]);
      setPreviewUrls([]);
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to upload images');
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    // Validate file types
    const validFiles = files.filter(file => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        toast.error(`${file.name} is not an image file`);
      }
      return isImage;
    });

    // Validate file sizes (5MB limit)
    const validSizedFiles = validFiles.filter(file => {
      const isValid = file.size <= 5 * 1024 * 1024; // 5MB
      if (!isValid) {
        toast.error(`${file.name} exceeds 5MB limit`);
      }
      return isValid;
    });

    // Check max files (10)
    if (currentImages.length + validSizedFiles.length > 10) {
      toast.error('Maximum 10 images allowed per product');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validSizedFiles]);

    // Generate previews
    validSizedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemovePreview = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select images to upload');
      return;
    }
    uploadMutation.mutate(selectedFiles);
  };

  return (
    <div className="space-y-4">
      {/* Current Images */}
      {currentImages.length > 0 && (
        <div>
          <h4 className="text-sm font-medium mb-2">Current Images</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {currentImages.map((url, index) => (
              <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                <img
                  src={url}
                  alt={`Product ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div>
        <h4 className="text-sm font-medium mb-2">Upload New Images</h4>

        {/* File Input */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <input
            type="file"
            id="image-upload"
            multiple
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center"
          >
            <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
            <span className="text-sm text-gray-600 mb-2">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-500">
              PNG, JPG, WebP up to 5MB (Max 10 images)
            </span>
          </label>
        </div>

        {/* Preview Selected Images */}
        {previewUrls.length > 0 && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-sm font-medium">
                Selected Images ({selectedFiles.length})
              </h4>
              <Button
                onClick={handleUpload}
                disabled={uploadMutation.isPending}
                size="sm"
              >
                {uploadMutation.isPending ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload {selectedFiles.length} {selectedFiles.length === 1 ? 'Image' : 'Images'}
                  </>
                )}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemovePreview(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 7.2 Add Image Upload to Product Edit Modal

Update the `ProductForm` component to include image upload after product creation:

```typescript
// Add this after the form in ProductForm component

{isEditing && product && (
  <div className="mt-8 pt-8 border-t">
    <h3 className="text-lg font-semibold mb-4">Product Images</h3>
    <ProductImageUpload
      productId={product.id}
      currentImages={product.images}
    />
  </div>
)}
```

---

## ✅ STEP 8: Phase 1 Testing Procedures

### 8.1 Environment Setup Test

**Checklist:**
```
☐ Backend server running on http://localhost:3001
☐ Frontend server running on http://localhost:3000
☐ Database connected (Supabase)
☐ Supabase storage configured
☐ No CORS errors in browser console
☐ Network requests showing correct API URL
```

**Test Commands:**
```bash
# Backend
cd C:\Users\deept\AromaSouq\aromasouq-api
npm run start:dev

# Frontend
cd C:\Users\deept\AromaSouq\aromasouq-web
npm run dev
```

---

### 8.2 Vendor Registration Test

**Test Case 1: Register New Vendor**

1. Navigate to `http://localhost:3000/register`
2. Fill in registration form:
   - First Name: `Test`
   - Last Name: `Vendor`
   - Email: `vendor@test.com`
   - Phone: `+971501234567`
   - Password: `Test123!@#`
   - Role: Select **"Sell fragrances (Become a vendor)"**
3. Click "Create Account"

**Expected Results:**
```
✅ Success toast: "Registration successful!"
✅ Automatic login
✅ Redirect to /vendor dashboard
✅ Cookie 'access_token' set in browser
✅ User data in localStorage (auth-storage)
✅ Database: New user created with role=VENDOR
✅ Database: Wallet created for user
```

**Verification:**
```bash
# Check database (Prisma Studio)
npx prisma studio

# Or check browser DevTools:
# - Application > Cookies > access_token
# - Application > LocalStorage > auth-storage
# - Network > POST /api/auth/register (Status 201)
```

---

### 8.3 Vendor Login Test

**Test Case 2: Login as Vendor**

1. Logout if logged in
2. Navigate to `http://localhost:3000/login`
3. Enter credentials:
   - Email: `vendor@test.com`
   - Password: `Test123!@#`
4. Click "Login"

**Expected Results:**
```
✅ Success toast: "Login successful!"
✅ Redirect to / (homepage)
✅ Header shows user name and avatar
✅ Cookie set
✅ Network: POST /api/auth/login (Status 200)
```

---

### 8.4 Vendor Dashboard Test

**Test Case 3: Access Vendor Dashboard**

1. Login as vendor
2. Navigate to `http://localhost:3000/vendor`

**Expected Results:**
```
✅ Dashboard loads
✅ Stats cards show:
   - Total Products: 0
   - Active Products: 0
   - Low Stock Alerts: 0
   - Total Revenue: AED 0.00
✅ Quick action cards visible:
   - Manage Products
   - View Orders
✅ Network: GET /api/products?vendorId=... (Status 200)
```

---

### 8.5 Create Product Test

**Test Case 4: Create First Product**

1. Navigate to `/vendor/products`
2. Click "Add Product" button
3. Fill in product form:

**Basic Information:**
- Product Name: `Oud Royale`
- Product Name (Arabic): `عود رويال` (optional)
- Slug: `oud-royale` (auto-generated)
- Description: `Luxurious oriental fragrance with rich oud notes`

**Pricing & Inventory:**
- Price: `499.00`
- Compare At Price: `699.00` (optional)
- SKU: `OUD-001`
- Stock Quantity: `100`
- Low Stock Alert: `10`

**Category & Brand:**
- Category: Select any category (e.g., "Men's Fragrances")
- Brand: Select any brand (e.g., "Arabian Oud")

**Fragrance Details:**
- Size: `100ml`
- Concentration: `Eau de Parfum`
- Gender: `Men`
- Top Notes: `Bergamot, Saffron`
- Heart Notes: `Rose, Jasmine`
- Base Notes: `Oud, Amber, Musk`
- Scent Family: `Oriental`
- Longevity: `8-10 hours`
- Sillage: `Heavy`
- Season: `Fall, Winter`

**Settings:**
- Active Product: `ON`
- Featured Product: `OFF`
- Enable WhatsApp: `ON`
- WhatsApp Number: `+971501234567`
- Coins to Award: `5`

4. Click "Create Product"

**Expected Results:**
```
✅ Success toast: "Product created!"
✅ Modal closes
✅ Product appears in products table
✅ Network: POST /api/products (Status 201)
✅ Network: GET /api/products?vendorId=... (refresh list)
✅ Dashboard stats update (Total Products: 1)
✅ Database: Product created with vendorId
```

**Verification:**
```bash
# Check Prisma Studio
# Users > Vendor > Products > Should see "Oud Royale"
```

---

### 8.6 Upload Product Images Test

**Test Case 5: Upload Product Images**

1. In products table, click "Edit" on the created product
2. Scroll to "Product Images" section
3. Click "Click to upload" or drag images
4. Select 3-5 product images (JPEG/PNG, < 5MB each)
5. Click "Upload X Images"

**Expected Results:**
```
✅ Preview shows selected images
✅ Upload button enabled
✅ Success toast: "Images uploaded successfully!"
✅ Current Images section shows uploaded images
✅ Network: POST /api/uploads/products/{id}/images (Status 200)
✅ Response contains Supabase URLs
✅ Database: Product.images array updated
✅ Supabase Storage: Files in 'products' bucket
```

**Error Cases to Test:**
```
❌ Upload file > 5MB → Error: "exceeds 5MB limit"
❌ Upload non-image file → Error: "not an image file"
❌ Upload 11 images → Error: "Maximum 10 images allowed"
```

---

### 8.7 Edit Product Test

**Test Case 6: Update Product Details**

1. Click "Edit" on a product
2. Change:
   - Price: `449.00`
   - Stock: `150`
   - Featured Product: `ON`
3. Click "Update Product"

**Expected Results:**
```
✅ Success toast: "Product updated!"
✅ Modal closes
✅ Table shows updated price
✅ Network: PATCH /api/products/{id} (Status 200)
✅ Database: Product updated
```

---

### 8.8 Stock Update Test

**Test Case 7: Quick Stock Update**

1. Create a stock update button/feature
2. Update stock quantity: `+50`

**Expected Results:**
```
✅ Success toast: "Stock updated!"
✅ Table shows new stock: 200
✅ Network: PATCH /api/products/{id}/stock (Status 200)
```

---

### 8.9 Delete Product Test

**Test Case 8: Delete Product**

1. Click "Delete" (trash icon) on a product
2. Confirm deletion

**Expected Results:**
```
✅ Confirmation dialog appears
✅ Success toast: "Product deleted successfully"
✅ Product removed from table (soft delete)
✅ Network: DELETE /api/products/{id} (Status 200)
✅ Database: Product.isActive = false
✅ Product doesn't appear on frontend
✅ Dashboard stats update
```

---

### 8.10 Low Stock Alert Test

**Test Case 9: Test Low Stock Alerts**

1. Create product with stock = 5, lowStockAlert = 10
2. View products list

**Expected Results:**
```
✅ Orange warning icon appears next to stock
✅ Dashboard shows Low Stock Alerts: 1
```

---

### 8.11 Categories & Brands Loading Test

**Test Case 10: Verify Dropdowns Load**

1. Click "Add Product"
2. Check Category dropdown
3. Check Brand dropdown

**Expected Results:**
```
✅ Network: GET /api/categories (Status 200)
✅ Network: GET /api/brands (Status 200)
✅ Category dropdown populated with categories
✅ Brand dropdown populated with brands
✅ Can select categories and brands
```

---

### 8.12 Pagination Test

**Test Case 11: Test Product Pagination**

1. Create 25 products (or mock data)
2. View products list

**Expected Results:**
```
✅ Shows 20 products per page
✅ Pagination controls visible
✅ Shows "Page 1 of 2"
✅ Next button enabled
✅ Previous button disabled on page 1
✅ Click Next → Network: GET /api/products?page=2
✅ Page 2 products load
```

---

### 8.13 Error Handling Test

**Test Case 12: Test Error Scenarios**

**Duplicate SKU:**
1. Create product with SKU: `TEST-001`
2. Try creating another product with same SKU

**Expected:**
```
❌ Error toast: "SKU already exists" or similar
✅ Form doesn't submit
✅ Network: POST /api/products (Status 409)
```

**Invalid Data:**
1. Try creating product with:
   - Negative price
   - Empty required fields
   - Invalid slug format

**Expected:**
```
❌ Form validation prevents submission
❌ Error messages show under fields
```

**Network Error:**
1. Stop backend server
2. Try loading products

**Expected:**
```
❌ Error message: "Failed to load products"
✅ Graceful error handling (no crash)
```

---

## 📝 Phase 1 Completion Checklist

### Development Tasks

#### Service Layer
- [ ] Created `src/types/api/common.types.ts`
- [ ] Created `src/types/api/auth.types.ts`
- [ ] Created `src/types/api/product.types.ts`
- [ ] Created `src/types/api/user.types.ts`
- [ ] Created `src/services/auth.service.ts`
- [ ] Created `src/services/products.service.ts`
- [ ] Created `src/services/categories.service.ts`
- [ ] Created `src/services/brands.service.ts`
- [ ] Created `src/services/users.service.ts`

#### Auth Integration
- [ ] Updated `src/stores/authStore.ts` to use auth service
- [ ] Updated `src/app/register/page.tsx` with role selection
- [ ] Updated `src/app/login/page.tsx` with service integration
- [ ] Tested vendor registration flow
- [ ] Tested vendor login flow
- [ ] Tested auth persistence (refresh page)

#### Vendor Dashboard
- [ ] Created `src/hooks/useVendorStats.ts`
- [ ] Updated `src/app/vendor/page.tsx` with stats
- [ ] Tested dashboard loads correctly
- [ ] Verified stats calculation

#### Product Management
- [ ] Created `src/components/vendor/ProductForm.tsx`
- [ ] Created `src/components/vendor/ProductImageUpload.tsx`
- [ ] Updated `src/app/vendor/products/page.tsx`
- [ ] Tested create product
- [ ] Tested edit product
- [ ] Tested delete product
- [ ] Tested stock update
- [ ] Tested image upload (single and multiple)
- [ ] Tested pagination
- [ ] Tested low stock alerts

### Testing Tasks

#### Functional Testing
- [ ] Vendor can register successfully
- [ ] Vendor can login successfully
- [ ] Vendor dashboard shows correct stats
- [ ] Vendor can create products
- [ ] Vendor can upload product images
- [ ] Vendor can edit products
- [ ] Vendor can delete products
- [ ] Categories load in dropdown
- [ ] Brands load in dropdown
- [ ] Pagination works correctly

#### Error Handling
- [ ] Duplicate SKU handled
- [ ] Invalid data validated
- [ ] Network errors handled gracefully
- [ ] File upload errors shown
- [ ] Max file size enforced
- [ ] Max file count enforced

#### UI/UX
- [ ] Forms are user-friendly
- [ ] Loading states shown
- [ ] Success messages appear
- [ ] Error messages clear
- [ ] Responsive design works
- [ ] Images display correctly

### Database Verification
- [ ] Vendor user created in database
- [ ] Products created with correct vendorId
- [ ] Product images stored in Supabase
- [ ] Stock updates reflected
- [ ] Soft delete works (isActive = false)

---

## 🎯 Phase 1 Success Criteria

**Phase 1 is complete when:**

1. ✅ Vendor can register and login
2. ✅ Vendor dashboard shows accurate statistics
3. ✅ Vendor can create products with all fragrance details
4. ✅ Vendor can upload product images (up to 10)
5. ✅ Vendor can edit product details
6. ✅ Vendor can update stock quantities
7. ✅ Vendor can delete products (soft delete)
8. ✅ Low stock alerts work correctly
9. ✅ All error cases handled gracefully
10. ✅ All tests pass

---

## 🚀 Next Steps

**After Phase 1 completion:**
- Proceed to **Phase 2: Admin Integration** (Vendor approval, product moderation)
- Create test data: At least 10 products from vendor
- These products will be used for admin approval testing

**Document:** `02-PHASE2-ADMIN-INTEGRATION.md`

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue: CORS errors**
```
Solution: Check backend CORS configuration
Verify FRONTEND_URL in .env matches http://localhost:3000
```

**Issue: Images not uploading**
```
Solution: Check Supabase configuration
Verify SUPABASE_URL and SUPABASE_ANON_KEY
Check bucket permissions in Supabase dashboard
```

**Issue: Products not showing vendor**
```
Solution: Check JWT payload includes user ID
Verify vendorId filter in API call
```

**Issue: Auth not persisting**
```
Solution: Check localStorage in browser
Verify cookie is set with HttpOnly flag
Check middleware.ts redirects
```

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Next Document:** `02-PHASE2-ADMIN-INTEGRATION.md`
