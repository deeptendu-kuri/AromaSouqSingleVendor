# 🛍️ PHASE 3: Customer Integration & Testing

## Overview
**Goal:** Enable customers to browse products, add to cart, checkout, place orders, write reviews, and manage their profile.

**Why Customer Last?** Customers can only shop after vendors have created products and admins have approved them.

**Timeline:** 7-10 days
**Prerequisites:** Phase 1 & 2 complete, active products available

---

## 📋 Phase 3 Scope

### Features to Integrate
1. ✅ Product Browsing & Search
2. ✅ Product Details & Reviews Display
3. ✅ Shopping Cart Management
4. ✅ Wishlist Functionality
5. ✅ Checkout Flow (Multi-step)
6. ✅ Address Management
7. ✅ Order Placement & Management
8. ✅ Review Writing
9. ✅ User Profile Management
10. ✅ Coins System Integration

### Backend Endpoints Used
```
# Products
GET    /api/products                    - Browse products
GET    /api/products/featured           - Featured products
GET    /api/products/slug/:slug         - Product details
GET    /api/categories                  - Categories filter
GET    /api/brands                      - Brands filter

# Cart
GET    /api/cart                        - Get cart
POST   /api/cart/items                  - Add to cart
PATCH  /api/cart/items/:id              - Update quantity
DELETE /api/cart/items/:id              - Remove item
DELETE /api/cart                        - Clear cart

# Wishlist
GET    /api/wishlist                    - Get wishlist
POST   /api/wishlist                    - Add to wishlist
DELETE /api/wishlist/:productId         - Remove from wishlist

# Addresses
GET    /api/addresses                   - List addresses
POST   /api/addresses                   - Create address
PATCH  /api/addresses/:id               - Update address
DELETE /api/addresses/:id               - Delete address
PATCH  /api/addresses/:id/set-default   - Set default

# Orders
POST   /api/orders                      - Create order
GET    /api/orders                      - List orders
GET    /api/orders/:id                  - Order details
POST   /api/orders/:id/cancel           - Cancel order

# Reviews
GET    /api/reviews                     - List reviews
POST   /api/reviews                     - Create review
PATCH  /api/reviews/:id                 - Update review
DELETE /api/reviews/:id                 - Delete review
POST   /api/reviews/:id/vote            - Vote on review
POST   /api/uploads/reviews/:id/images  - Upload review images

# User Profile
GET    /api/users/profile               - Get profile
PATCH  /api/users/profile               - Update profile
PATCH  /api/users/change-password       - Change password
GET    /api/users/coins-history         - Coins history
POST   /api/uploads/users/avatar        - Upload avatar
```

### Frontend Pages
```
/                                        - Homepage
/products                                - Product listing
/products/[slug]                         - Product details
/cart                                    - Shopping cart
/checkout                                - Multi-step checkout
/wishlist                                - Wishlist
/compare                                 - Product comparison
/profile                                 - User profile (NEW)
/orders                                  - Order history (NEW)
/orders/[id]                             - Order details (NEW)
/coins                                   - Coins history (NEW)
```

---

## 🛠️ STEP 1: Create Remaining Service Layers

### 1.1 Cart Service

**File:** `src/services/cart.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export interface AddToCartDto {
  productId: string;
  variantId?: string;
  quantity: number;
  notes?: string;
}

export interface UpdateCartItemDto {
  quantity?: number;
  notes?: string;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  product: any; // Import Product type
  variantId?: string;
  variant?: any;
  quantity: number;
  notes?: string;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export const cartService = {
  /**
   * Get current user's cart
   */
  getCart: async (): Promise<Cart> => {
    const response = await apiClient.get<Cart>('/cart');
    return response;
  },

  /**
   * Add item to cart
   */
  addItem: async (data: AddToCartDto): Promise<CartItem> => {
    const response = await apiClient.post<CartItem>('/cart/items', data);
    return response;
  },

  /**
   * Update cart item
   */
  updateItem: async (itemId: string, data: UpdateCartItemDto): Promise<CartItem> => {
    const response = await apiClient.patch<CartItem>(`/cart/items/${itemId}`, data);
    return response;
  },

  /**
   * Remove item from cart
   */
  removeItem: async (itemId: string): Promise<void> => {
    await apiClient.delete(`/cart/items/${itemId}`);
  },

  /**
   * Clear entire cart
   */
  clearCart: async (): Promise<void> => {
    await apiClient.delete('/cart');
  },
};
```

---

### 1.2 Wishlist Service

**File:** `src/services/wishlist.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export interface WishlistItem {
  id: string;
  userId: string;
  productId: string;
  product: any; // Import Product type
  createdAt: string;
}

export const wishlistService = {
  /**
   * Get user's wishlist
   */
  getWishlist: async (): Promise<WishlistItem[]> => {
    const response = await apiClient.get<WishlistItem[]>('/wishlist');
    return response;
  },

  /**
   * Add product to wishlist
   */
  addItem: async (productId: string): Promise<WishlistItem> => {
    const response = await apiClient.post<WishlistItem>('/wishlist', { productId });
    return response;
  },

  /**
   * Remove product from wishlist
   */
  removeItem: async (productId: string): Promise<void> => {
    await apiClient.delete(`/wishlist/${productId}`);
  },
};
```

---

### 1.3 Addresses Service

**File:** `src/services/addresses.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';

export interface Address {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAddressDto {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  zipCode: string;
  isDefault?: boolean;
}

export const addressesService = {
  /**
   * Get all user addresses
   */
  getAll: async (): Promise<Address[]> => {
    const response = await apiClient.get<Address[]>('/addresses');
    return response;
  },

  /**
   * Get single address
   */
  getOne: async (id: string): Promise<Address> => {
    const response = await apiClient.get<Address>(`/addresses/${id}`);
    return response;
  },

  /**
   * Create new address
   */
  create: async (data: CreateAddressDto): Promise<Address> => {
    const response = await apiClient.post<Address>('/addresses', data);
    return response;
  },

  /**
   * Update address
   */
  update: async (id: string, data: Partial<CreateAddressDto>): Promise<Address> => {
    const response = await apiClient.patch<Address>(`/addresses/${id}`, data);
    return response;
  },

  /**
   * Delete address
   */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/addresses/${id}`);
  },

  /**
   * Set address as default
   */
  setDefault: async (id: string): Promise<Address> => {
    const response = await apiClient.patch<Address>(`/addresses/${id}/set-default`, {});
    return response;
  },
};
```

---

### 1.4 Orders Service

**File:** `src/services/orders.service.ts`

```typescript
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api/common.types';

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: any;
  addressId: string;
  address: any; // Import Address type
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingFee: number;
  discount: number;
  total: number;
  coinsEarned: number;
  coinsUsed: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId?: string;
  trackingNumber?: string;
  confirmedAt?: string;
  shippedAt?: string;
  deliveredAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: any;
  quantity: number;
  price: number;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'REFUNDED';

export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export type PaymentMethod = 'CREDIT_CARD' | 'DEBIT_CARD' | 'WALLET' | 'CASH_ON_DELIVERY';

export interface CreateOrderDto {
  addressId: string;
  paymentMethod: PaymentMethod;
  coinsToUse?: number;
  notes?: string;
}

export interface OrderFilters {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}

export const ordersService = {
  /**
   * Get user's orders
   */
  getAll: async (filters?: OrderFilters): Promise<PaginatedResponse<Order>> => {
    const response = await apiClient.get<PaginatedResponse<Order>>('/orders', filters);
    return response;
  },

  /**
   * Get single order
   */
  getOne: async (id: string): Promise<Order> => {
    const response = await apiClient.get<Order>(`/orders/${id}`);
    return response;
  },

  /**
   * Create order from cart
   */
  create: async (data: CreateOrderDto): Promise<Order> => {
    const response = await apiClient.post<Order>('/orders', data);
    return response;
  },

  /**
   * Cancel order
   */
  cancel: async (id: string): Promise<Order> => {
    const response = await apiClient.post<Order>(`/orders/${id}/cancel`, {});
    return response;
  },
};
```

---

### 1.5 Reviews Service (Complete)

**File:** `src/services/reviews.service.ts` (Add to existing)

```typescript
import { apiClient } from '@/lib/api-client';
import type { PaginatedResponse } from '@/types/api/common.types';

export interface Review {
  id: string;
  userId: string;
  user?: any;
  productId: string;
  product?: any;
  rating: number;
  title?: string;
  comment?: string;
  images: ReviewImage[];
  vendorReply?: string;
  vendorRepliedAt?: string;
  helpfulCount: number;
  notHelpfulCount: number;
  isVerifiedPurchase: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewImage {
  id: string;
  reviewId: string;
  url: string;
  sortOrder: number;
  createdAt: string;
}

export interface CreateReviewDto {
  productId: string;
  rating: number;
  title?: string;
  comment?: string;
}

export interface VoteReviewDto {
  voteType: 'HELPFUL' | 'NOT_HELPFUL';
}

export interface ReviewFilters {
  productId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export const reviewsService = {
  /**
   * Get all reviews
   */
  getAll: async (filters?: ReviewFilters): Promise<PaginatedResponse<Review>> => {
    const response = await apiClient.get<PaginatedResponse<Review>>('/reviews', filters);
    return response;
  },

  /**
   * Get single review
   */
  getOne: async (id: string): Promise<Review> => {
    const response = await apiClient.get<Review>(`/reviews/${id}`);
    return response;
  },

  /**
   * Create review
   */
  create: async (data: CreateReviewDto): Promise<Review> => {
    const response = await apiClient.post<Review>('/reviews', data);
    return response;
  },

  /**
   * Update review
   */
  update: async (id: string, data: Partial<CreateReviewDto>): Promise<Review> => {
    const response = await apiClient.patch<Review>(`/reviews/${id}`, data);
    return response;
  },

  /**
   * Delete review
   */
  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`/reviews/${id}`);
  },

  /**
   * Vote on review
   */
  vote: async (id: string, data: VoteReviewDto): Promise<void> => {
    await apiClient.post(`/reviews/${id}/vote`, data);
  },

  /**
   * Upload review images
   */
  uploadImages: async (reviewId: string, files: File[]): Promise<{ urls: string[] }> => {
    const response = await apiClient.uploadFiles<{ urls: string[] }>(
      `/uploads/reviews/${reviewId}/images`,
      files
    );
    return response;
  },

  /**
   * Toggle publish status (Admin only)
   */
  togglePublish: async (reviewId: string): Promise<Review> => {
    const response = await apiClient.patch<Review>(`/reviews/${reviewId}/publish`, {});
    return response;
  },
};
```

---

## 🏠 STEP 2: Homepage Integration

### 2.1 Update Homepage

**File:** `src/app/page.tsx`

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { categoriesService } from '@/services/categories.service';
import { ProductCard } from '@/components/ui/product-card';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  // Fetch featured products
  const { data: featuredProducts = [], isLoading: loadingProducts } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => productsService.getFeatured(8),
  });

  // Fetch categories
  const { data: categories = [], isLoading: loadingCategories } = useQuery({
    queryKey: ['categories-with-products'],
    queryFn: categoriesService.getAllWithProducts,
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary-dark text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Discover Your Signature Scent</h1>
          <p className="text-xl mb-8">
            Premium fragrances from the world's finest perfume houses
          </p>
          <a
            href="/products"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Shop Now
          </a>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
          {loadingCategories ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 4).map((category: any) => (
                <a
                  key={category.id}
                  href={`/products?categoryId=${category.id}`}
                  className="border rounded-lg p-6 text-center hover:shadow-lg transition"
                >
                  {category.image && (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-20 h-20 mx-auto mb-4 object-contain"
                    />
                  )}
                  <h3 className="font-semibold">{category.name}</h3>
                  {category._count?.products && (
                    <p className="text-sm text-gray-600">
                      {category._count.products} products
                    </p>
                  )}
                </a>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <a
              href="/products"
              className="text-primary hover:underline font-semibold"
            >
              View All
            </a>
          </div>
          {loadingProducts ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="h-96" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {featuredProducts.map((product: any) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Value Propositions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="font-semibold text-xl mb-2">Free Shipping</h3>
              <p className="text-gray-600">On orders over AED 300</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="font-semibold text-xl mb-2">100% Authentic</h3>
              <p className="text-gray-600">All products are genuine</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="font-semibold text-xl mb-2">Loyalty Rewards</h3>
              <p className="text-gray-600">Earn coins with every purchase</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

---

## 📦 STEP 3: Product Listing & Details

The product listing and details pages already exist. We just need to integrate the API services.

### 3.1 Update Product Listing Page

**File:** `src/app/products/page.tsx`

Update to use `productsService`, `categoriesService`, and `brandsService`.

---

### 3.2 Update Product Details Page

**File:** `src/app/products/[slug]/page.tsx`

Update to use `productsService` and display reviews.

---

## 🛒 STEP 4: Shopping Cart Integration

### 4.1 Create Cart Page

**File:** `src/app/cart/page.tsx`

```typescript
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '@/services/cart.service';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import toast from 'react-hot-toast';
import { redirect } from 'next/navigation';
import { useState } from 'react';

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const queryClient = useQueryClient();

  // Protect route
  if (!isAuthenticated) {
    redirect('/login?returnUrl=/cart');
  }

  // Fetch cart
  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: cartService.getCart,
  });

  // Update quantity mutation
  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartService.updateItem(itemId, { quantity }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error: any) => {
      toast.error(error?.message || 'Failed to update quantity');
    },
  });

  // Remove item mutation
  const removeMutation = useMutation({
    mutationFn: (itemId: string) => cartService.removeItem(itemId),
    onSuccess: () => {
      toast.success('Item removed from cart');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  // Clear cart mutation
  const clearMutation = useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      toast.success('Cart cleared');
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateMutation.mutate({ itemId, quantity: newQuantity });
  };

  const items = cart?.items || [];
  const subtotal = cart?.subtotal || 0;
  const shipping = subtotal >= 300 ? 0 : 25; // Free shipping over 300 AED
  const tax = subtotal * 0.05; // 5% VAT
  const total = subtotal + shipping + tax;

  if (isLoading) {
    return <div className="container mx-auto p-6">Loading cart...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-4">Start shopping to add items to your cart</p>
          <Button onClick={() => (window.location.href = '/products')}>
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={() => {
            if (confirm('Clear entire cart?')) {
              clearMutation.mutate();
            }
          }}
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow p-6 flex gap-4"
              >
                {/* Product Image */}
                {item.product.images?.[0] && (
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                )}

                {/* Product Info */}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-sm text-gray-600">
                    {item.product.brand?.name}
                  </p>
                  {item.variant && (
                    <p className="text-sm text-gray-600">
                      Size: {item.variant.name}
                    </p>
                  )}
                  <p className="text-lg font-semibold mt-2">
                    AED {item.product.price.toFixed(2)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex flex-col items-end justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMutation.mutate(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-semibold">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity + 1)
                      }
                      disabled={item.quantity >= item.product.stock}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="font-semibold">
                    AED {item.subtotal.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>AED {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600">FREE</span>
                  ) : (
                    `AED ${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (5%)</span>
                <span>AED {tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>AED {total.toFixed(2)}</span>
              </div>
            </div>

            {subtotal < 300 && (
              <p className="text-sm text-gray-600 mb-4">
                Add AED {(300 - subtotal).toFixed(2)} more for free shipping!
              </p>
            )}

            <Button
              className="w-full"
              onClick={() => (window.location.href = '/checkout')}
            >
              Proceed to Checkout
            </Button>

            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => (window.location.href = '/products')}
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

Due to the length of this document, I'll create a summary for the remaining steps to complete Phase 3. The full implementation would include:

## Remaining Phase 3 Features (Summary)

### STEP 5: Wishlist Integration
- Create `/app/wishlist/page.tsx`
- Grid display of wishlist products
- Add/remove functionality
- Move to cart button

### STEP 6: Checkout Flow
- Multi-step checkout (`/app/checkout/page.tsx`)
- Step 1: Address selection/creation
- Step 2: Delivery method
- Step 3: Payment method
- Step 4: Review & confirm
- Coins redemption integration

### STEP 7: Orders Management
- Create `/app/orders/page.tsx` - Order history
- Create `/app/orders/[id]/page.tsx` - Order details
- Order status tracking
- Cancel order functionality

### STEP 8: Reviews Integration
- Review writing component
- Review display on product pages
- Helpful voting
- Review images upload

### STEP 9: User Profile
- Create `/app/profile/page.tsx`
- Profile editing
- Password change
- Avatar upload
- Coins history display

### STEP 10: Coins System
- Display coins balance
- Coins history page
- Redemption flow in checkout
- Earning on purchases and reviews

---

## ✅ Phase 3 Testing Procedures

### Test Complete Customer Journey

1. **Browse Products** → Filter → Search
2. **View Product Details** → Read Reviews
3. **Add to Cart** → Update Quantity
4. **Add to Wishlist**
5. **Checkout** → Add Address → Select Payment
6. **Place Order** → Confirm
7. **View Orders** → Track Status
8. **Write Review** → Upload Images
9. **Earn Coins** → Redeem on Next Purchase

---

## 🎯 Phase 3 Success Criteria

1. ✅ Customer can browse and search products
2. ✅ Customer can add items to cart
3. ✅ Customer can manage wishlist
4. ✅ Customer can complete checkout
5. ✅ Customer can place orders
6. ✅ Customer can view order history
7. ✅ Customer can write reviews
8. ✅ Customer can manage profile
9. ✅ Coins system fully functional
10. ✅ All customer flows tested end-to-end

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Previous Documents:** `00-API-FRONTEND-MAPPING.md`, `01-PHASE1-VENDOR-INTEGRATION.md`, `02-PHASE2-ADMIN-INTEGRATION.md`
