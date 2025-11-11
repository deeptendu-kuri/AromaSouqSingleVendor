# 🗺️ AromaSouq API to Frontend Mapping Document

## Overview
This document maps all existing backend API endpoints to their corresponding frontend pages/components for the AromaSouq e-commerce platform.

**Business Flow:** Vendor → Admin → Customer

---

## 📊 Complete Endpoint Mapping

### 🔐 AUTHENTICATION MODULE

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/auth/register` | POST | `/register` page | ✅ Exists | P0 |
| `/api/auth/login` | POST | `/login` page | ✅ Exists | P0 |
| `/api/auth/logout` | POST | Header component | ✅ Exists | P0 |
| `/api/auth/me` | GET | `authStore` (Zustand) | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/login/page.tsx`
- `src/app/register/page.tsx`
- `src/stores/authStore.ts`
- `src/components/layout/header.tsx`

---

### 🏪 VENDOR MODULE (Phase 1)

#### Vendor Registration & Profile

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/auth/register` | POST | `/register` (role=VENDOR) | ✅ Exists | P0 |
| `/api/users/profile` | GET | `/vendor` dashboard | ✅ Exists | P0 |
| `/api/users/profile` | PATCH | `/vendor` profile section | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/vendor/page.tsx` - Vendor dashboard
- `src/app/register/page.tsx` - Registration with role selection

#### Vendor Product Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/products` | POST | `/vendor/products` - Add Product | ✅ Exists | P0 |
| `/api/products` | GET | `/vendor/products` - Product List | ✅ Exists | P0 |
| `/api/products/:id` | GET | `/vendor/products` - Edit Form | ✅ Exists | P0 |
| `/api/products/:id` | PATCH | `/vendor/products` - Update | ✅ Exists | P0 |
| `/api/products/:id/stock` | PATCH | `/vendor/products` - Stock Update | ✅ Exists | P0 |
| `/api/products/:id` | DELETE | `/vendor/products` - Delete | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/vendor/products/page.tsx` - Product list and management

#### Vendor Product Uploads

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/uploads/products/:id/images` | POST | Product form - Image Upload | ✅ Exists | P0 |

#### Vendor Order Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/orders` | GET | `/vendor/orders` - Order List | ✅ Exists | P1 |
| `/api/orders/:id` | GET | `/vendor/orders` - Order Details | ✅ Exists | P1 |
| `/api/orders/:id/status` | PATCH | `/vendor/orders` - Status Update | ✅ Exists | P1 |

**Frontend Files:**
- `src/app/vendor/orders/page.tsx` - Vendor order management

#### Vendor Review Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/reviews/:id/reply` | POST | Vendor Reviews Section | 🔨 Need Integration | P2 |

---

### 👨‍💼 ADMIN MODULE (Phase 2)

#### Admin Dashboard

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/admin/dashboard/stats` | GET | `/admin` - Dashboard Stats | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/admin/page.tsx` - Admin dashboard with stats

#### Admin User Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/admin/users` | GET | `/admin/users` - User List | ✅ Exists | P0 |
| `/api/admin/users/:id/status` | PATCH | `/admin/users` - Status Update | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/admin/users/page.tsx` - User management

#### Admin Vendor Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/admin/users` | GET | `/admin/vendors` - Vendor List | ✅ Exists | P0 |
| `/api/admin/users/:id` | GET | `/admin/vendors/[id]/review` | ✅ Exists | P0 |
| `/api/admin/users/:id/status` | PATCH | `/admin/vendors` - Approval | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/admin/vendors/page.tsx` - Vendor list
- `src/app/admin/vendors/[id]/review/page.tsx` - Vendor review/approval

#### Admin Product Moderation

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/admin/products` | GET | `/admin/products` - Product List | ✅ Exists | P0 |
| `/api/products/:id` | PATCH | `/admin/products` - Approve/Edit | ✅ Exists | P0 |
| `/api/products/:id` | DELETE | `/admin/products` - Delete | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/admin/products/page.tsx` - Product moderation

#### Admin Order Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/admin/orders` | GET | `/admin` dashboard or Orders | ✅ Exists | P1 |
| `/api/orders/:id/status` | PATCH | Admin Order Management | ✅ Exists | P1 |

#### Admin Review Moderation

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/admin/reviews` | GET | `/admin/reviews` - Review List | ✅ Exists | P0 |
| `/api/reviews/:id/publish` | PATCH | `/admin/reviews` - Publish Toggle | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/admin/reviews/page.tsx` - Review moderation

---

### 🛍️ CUSTOMER MODULE (Phase 3)

#### Product Browsing

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/products` | GET | `/products` - Product Listing | ✅ Exists | P0 |
| `/api/products/featured` | GET | `/` - Homepage Featured | ✅ Exists | P0 |
| `/api/products/slug/:slug` | GET | `/products/[slug]` - Details | ✅ Exists | P0 |
| `/api/categories` | GET | Homepage, Products Filter | ✅ Exists | P0 |
| `/api/categories/with-products` | GET | Homepage Categories | ✅ Exists | P0 |
| `/api/brands` | GET | Products Filter | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/page.tsx` - Homepage
- `src/app/products/page.tsx` - Product listing
- `src/app/products/[slug]/page.tsx` - Product details

#### Shopping Cart

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/cart` | GET | `/cart` - Cart Page | ✅ Exists | P0 |
| `/api/cart/items` | POST | Product Details - Add to Cart | ✅ Exists | P0 |
| `/api/cart/items/:id` | PATCH | `/cart` - Update Quantity | ✅ Exists | P0 |
| `/api/cart/items/:id` | DELETE | `/cart` - Remove Item | ✅ Exists | P0 |
| `/api/cart` | DELETE | `/cart` - Clear Cart | ✅ Exists | P0 |

**Frontend Files:**
- `src/app/cart/page.tsx` - Shopping cart

#### Wishlist

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/wishlist` | GET | `/wishlist` - Wishlist Page | ✅ Exists | P1 |
| `/api/wishlist` | POST | Product Card - Add to Wishlist | ✅ Exists | P1 |
| `/api/wishlist/:productId` | DELETE | Wishlist - Remove Item | ✅ Exists | P1 |

**Frontend Files:**
- `src/app/wishlist/page.tsx` - Wishlist

#### Address Management

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/addresses` | GET | `/checkout` - Address Selection | ✅ Exists | P0 |
| `/api/addresses` | POST | `/checkout` - Add Address | ✅ Exists | P0 |
| `/api/addresses/:id` | PATCH | `/checkout` - Edit Address | ✅ Exists | P0 |
| `/api/addresses/:id` | DELETE | Address Management | ✅ Exists | P1 |
| `/api/addresses/:id/set-default` | PATCH | Address Management | ✅ Exists | P1 |

**Frontend Files:**
- `src/app/checkout/page.tsx` - Checkout with address form

#### Order Processing

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/orders` | POST | `/checkout` - Place Order | ✅ Exists | P0 |
| `/api/orders` | GET | Customer Orders Page | 🔨 Need Page | P0 |
| `/api/orders/:id` | GET | Order Details Page | 🔨 Need Page | P0 |
| `/api/orders/:id/cancel` | POST | Order Details - Cancel | 🔨 Need Page | P1 |

**Frontend Files:**
- `src/app/checkout/page.tsx` - Multi-step checkout
- `src/app/checkout/quick/[productId]/page.tsx` - Quick checkout
- **MISSING:** `/app/orders/page.tsx` - Customer orders list
- **MISSING:** `/app/orders/[id]/page.tsx` - Order details

#### Product Reviews

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/reviews` | GET | `/products/[slug]` - Reviews | ✅ Exists | P0 |
| `/api/reviews` | POST | Product Details - Write Review | 🔨 Need Integration | P1 |
| `/api/reviews/:id` | PATCH | My Reviews - Edit | 🔨 Need Integration | P2 |
| `/api/reviews/:id` | DELETE | My Reviews - Delete | 🔨 Need Integration | P2 |
| `/api/reviews/:id/vote` | POST | Product Reviews - Vote | 🔨 Need Integration | P1 |
| `/api/uploads/reviews/:id/images` | POST | Review Form - Upload Images | 🔨 Need Integration | P2 |

#### User Profile

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/users/profile` | GET | User Profile Page | 🔨 Need Page | P1 |
| `/api/users/profile` | PATCH | Profile Edit | 🔨 Need Page | P1 |
| `/api/users/change-password` | PATCH | Profile - Change Password | 🔨 Need Page | P1 |
| `/api/users/coins-history` | GET | Coins History Page | 🔨 Need Page | P2 |
| `/api/uploads/users/avatar` | POST | Profile - Avatar Upload | 🔨 Need Page | P1 |

**Frontend Files Needed:**
- **MISSING:** `/app/profile/page.tsx` - User profile
- **MISSING:** `/app/coins/page.tsx` - Coins history

#### Product Comparison

| Backend Endpoint | Method | Frontend Page/Component | Status | Priority |
|-----------------|--------|------------------------|--------|----------|
| `/api/products/:id` | GET | `/compare` - Compare Products | ✅ Exists | P2 |

**Frontend Files:**
- `src/app/compare/page.tsx` - Product comparison

---

### 📁 FILE UPLOADS MODULE

| Backend Endpoint | Method | Frontend Usage | Status | Priority |
|-----------------|--------|----------------|--------|----------|
| `/api/uploads/products/:id/images` | POST | Vendor Product Form | ✅ Exists | P0 |
| `/api/uploads/users/avatar` | POST | User/Vendor Profile | 🔨 Need Integration | P1 |
| `/api/uploads/reviews/:id/images` | POST | Review Form | 🔨 Need Integration | P2 |
| `/api/uploads/brands/:id/logo` | POST | Admin Brand Management | 🔨 Need Integration | P2 |
| `/api/uploads/brands/:id/banner` | POST | Admin Brand Management | 🔨 Need Integration | P2 |
| `/api/uploads/:bucket/:path(*)` | DELETE | File Management | 🔨 Need Integration | P2 |

---

## 📋 Missing Frontend Pages/Components

### High Priority (P0-P1)

1. **Customer Orders Management**
   - `/app/orders/page.tsx` - Order history list
   - `/app/orders/[id]/page.tsx` - Order details

2. **User Profile Management**
   - `/app/profile/page.tsx` - User profile view/edit
   - Avatar upload integration

3. **Review Writing Interface**
   - Review modal/form component for customers
   - Review image upload integration

### Medium Priority (P2)

4. **Coins History**
   - `/app/coins/page.tsx` - Coins transaction history

5. **Brand Management (Admin)**
   - Brand create/edit forms with logo/banner upload

---

## 🎯 Integration Priority Matrix

### Phase 1: Vendor (Must Have - Week 1)
- ✅ Vendor Registration
- ✅ Vendor Dashboard
- ✅ Product CRUD
- ✅ Product Image Upload
- ⚠️ Vendor Orders Management (exists but needs API integration)

### Phase 2: Admin (Must Have - Week 2)
- ✅ Admin Dashboard
- ✅ Vendor Approval Workflow
- ✅ Product Moderation
- ✅ User Management
- ✅ Review Moderation

### Phase 3: Customer (Must Have - Week 3)
- ✅ Product Browsing
- ✅ Cart Management
- ✅ Checkout Flow
- 🔨 Order History (MISSING PAGE)
- 🔨 Order Details (MISSING PAGE)
- 🔨 User Profile (MISSING PAGE)
- 🔨 Review Writing (MISSING INTEGRATION)

### Phase 4: Enhanced Features (Nice to Have - Week 4)
- Wishlist
- Product Comparison
- Coins System
- Review Voting
- Advanced Filters

---

## 🔧 Required Service Layer Files

Create these service files in `src/services/`:

### Core Services (P0)
- ✅ `auth.service.ts` - Authentication
- 🔨 `products.service.ts` - Products CRUD
- 🔨 `cart.service.ts` - Cart operations
- 🔨 `orders.service.ts` - Order management
- 🔨 `addresses.service.ts` - Address management

### Supporting Services (P1)
- 🔨 `users.service.ts` - User profile
- 🔨 `reviews.service.ts` - Reviews
- 🔨 `wishlist.service.ts` - Wishlist
- 🔨 `categories.service.ts` - Categories
- 🔨 `brands.service.ts` - Brands

### Admin Services (P1)
- 🔨 `admin.service.ts` - Admin operations
- 🔨 `uploads.service.ts` - File uploads

---

## 📊 API Response Type Definitions

Create these type files in `src/types/`:

- 🔨 `api/auth.types.ts` - Auth DTOs
- 🔨 `api/product.types.ts` - Product DTOs
- 🔨 `api/order.types.ts` - Order DTOs
- 🔨 `api/user.types.ts` - User DTOs
- 🔨 `api/review.types.ts` - Review DTOs
- 🔨 `api/common.types.ts` - Common response types

---

## 🚦 Status Legend

- ✅ **Exists** - Both backend endpoint and frontend page exist
- 🔨 **Need Integration** - Both exist but not connected
- ❌ **Need Page** - Backend exists, frontend page missing
- ⚠️ **Partial** - Exists but needs modification

---

## Next Steps

1. **Review this mapping** to ensure accuracy
2. **Proceed to Phase 1** - Vendor Integration Document
3. **Create missing pages** identified in this document
4. **Build service layer** for API integration
5. **Implement phase by phase** following business flow

---

**Document Version:** 1.0
**Last Updated:** 2025-10-26
**Next Document:** `01-PHASE1-VENDOR-INTEGRATION.md`
