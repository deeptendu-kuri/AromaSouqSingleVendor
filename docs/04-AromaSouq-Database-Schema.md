# AromaSouq MVP - Database Schema Design

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Database:** Supabase (PostgreSQL 15+)  
**ORM:** Prisma 5+

---

## 1. Database Overview

### 1.1 Design Principles

1. **Normalization:** 3NF (Third Normal Form) for data integrity
2. **Performance:** Strategic denormalization where needed
3. **Scalability:** Support for multi-tenancy (vendors)
4. **Flexibility:** JSON fields for extensible data
5. **Audit Trail:** Created/updated timestamps on all tables
6. **Soft Deletes:** Preserve data for analytics

### 1.2 Supabase PostgreSQL

**Why Supabase:**
- ✅ Managed PostgreSQL 15+ (production-ready)
- ✅ Built-in connection pooling (Supavisor)
- ✅ Automatic backups (Pro tier)
- ✅ Row Level Security (RLS) for fine-grained access
- ✅ Realtime subscriptions (bonus feature)
- ✅ Database dashboard & SQL editor
- ✅ Free tier: 500MB database, 50k monthly active users
- ✅ Excellent Prisma integration

**Connection Details:**
```
Project: aromasouq-production
Region: Singapore (or Frankfurt for EU)

Direct Connection (for migrations):
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres

Pooled Connection (for application):  
postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true
```

### 1.2 Table Summary

```
Core Tables (16):
  - users
  - vendors
  - products
  - product_variants
  - product_images
  - categories
  - product_categories (junction)
  - orders
  - order_items
  - carts
  - cart_items
  - addresses
  - reviews
  - wishlists
  - wishlist_items
  - coupons

Financial Tables (3):
  - wallets
  - transactions
  - payouts

System Tables (3):
  - notifications
  - settings
  - audit_logs
```

---

## 2. Prisma Schema

### 2.1 Setup

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")         // Direct connection for migrations
  directUrl = env("DATABASE_URL_POOLER") // Pooled connection for application
}
```

**Environment Variables (.env):**
```bash
# Direct connection (for migrations - npx prisma migrate)
DATABASE_URL="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Pooled connection (for application runtime)
DATABASE_URL_POOLER="postgresql://postgres:[YOUR_PASSWORD]@db.[PROJECT_REF].supabase.co:6543/postgres?pgbouncer=true"
```

**Get Your Connection String:**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Project Settings" → "Database"
4. Copy "Connection string" (URI format)
5. Replace [YOUR-PASSWORD] with your database password

### 2.2 Enums

```prisma
enum UserRole {
  CUSTOMER
  VENDOR
  ADMIN
  SUPER_ADMIN
}

enum UserStatus {
  ACTIVE
  INACTIVE
  SUSPENDED
  PENDING_VERIFICATION
}

enum VendorStatus {
  PENDING
  APPROVED
  REJECTED
  SUSPENDED
}

enum ProductStatus {
  DRAFT
  ACTIVE
  OUT_OF_STOCK
  DISCONTINUED
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum PaymentMethod {
  CREDIT_CARD
  DEBIT_CARD
  CASH_ON_DELIVERY
  APPLE_PAY
  GOOGLE_PAY
  BANK_TRANSFER
}

enum DeliveryType {
  STANDARD
  EXPRESS
  SAME_DAY
  STORE_PICKUP
}

enum TransactionType {
  CREDIT
  DEBIT
  REFUND
  COMMISSION
  PAYOUT
}

enum NotificationType {
  ORDER_UPDATE
  PAYMENT_SUCCESS
  PAYMENT_FAILED
  PROMO_OFFER
  NEW_MESSAGE
  COIN_EARNED
  COIN_EXPIRY
  REVIEW_REQUEST
  SYSTEM_ALERT
}

enum NotificationChannel {
  IN_APP
  EMAIL
  SMS
  WHATSAPP
  PUSH
}
```

---

## 3. Core Tables

### 3.1 Users Table

```prisma
model User {
  id                String       @id @default(cuid())
  email             String       @unique
  emailVerified     Boolean      @default(false)
  emailVerifiedAt   DateTime?
  phone             String?      @unique
  phoneVerified     Boolean      @default(false)
  password          String?      // Nullable for social auth
  firstName         String
  lastName          String
  avatar            String?
  role              UserRole     @default(CUSTOMER)
  status            UserStatus   @default(ACTIVE)
  language          String       @default("en") // en or ar
  dateOfBirth       DateTime?
  gender            String?
  
  // OAuth fields
  googleId          String?      @unique
  appleId           String?      @unique
  
  // Settings
  notificationPreferences Json?  // { email: true, sms: false, whatsapp: true }
  
  // Relationships
  vendor            Vendor?
  addresses         Address[]
  orders            Order[]
  cart              Cart?
  wishlist          Wishlist?
  reviews           Review[]
  wallet            Wallet?
  notifications     Notification[]
  
  // Timestamps
  createdAt         DateTime     @default(now())
  updatedAt         DateTime     @updatedAt
  lastLoginAt       DateTime?
  
  @@index([email])
  @@index([phone])
  @@index([role, status])
}
```

### 3.2 Vendors Table

```prisma
model Vendor {
  id                String         @id @default(cuid())
  userId            String         @unique
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Business Information
  businessName      String
  businessNameAr    String?
  slug              String         @unique
  description       String?
  descriptionAr     String?
  logo              String?
  banner            String?
  
  // Contact Information
  businessEmail     String
  businessPhone     String
  whatsappNumber    String?
  whatsappEnabled   Boolean        @default(false)
  
  // Legal Information
  tradeLicenseNumber String?
  taxRegistrationNumber String?
  businessLicense   String?        // File URL
  
  // Status
  status            VendorStatus   @default(PENDING)
  approvedAt        DateTime?
  approvedBy        String?
  rejectionReason   String?
  
  // Commission
  commissionRate    Float          @default(15.0) // Percentage
  
  // Settings
  settings          Json?          // { autoApproveOrders, minOrderAmount, etc. }
  
  // Relationships
  products          Product[]
  orders            Order[]
  wallet            Wallet?
  coupons           Coupon[]
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([slug])
  @@index([status])
  @@index([businessName])
}
```

### 3.3 Products Table

```prisma
model Product {
  id                String           @id @default(cuid())
  vendorId          String
  vendor            Vendor           @relation(fields: [vendorId], references: [id], onDelete: Cascade)
  
  // Basic Information
  name              String
  nameAr            String?
  slug              String           @unique
  description       String?
  descriptionAr     String?
  sku               String           @unique
  barcode           String?
  
  // Pricing
  price             Float
  compareAtPrice    Float?           // Original price (for discount display)
  costPrice         Float?           // For vendor's reference
  
  // Inventory
  stockQuantity     Int              @default(0)
  lowStockThreshold Int?             @default(10)
  trackInventory    Boolean          @default(true)
  
  // Product Details
  brand             String?
  brandAr           String?
  
  // Fragrance-specific fields
  scentFamily       String?          // Woody, Floral, Oriental, Fresh, etc.
  gender            String?          // Men, Women, Unisex
  topNotes          String?          // JSON array or comma-separated
  middleNotes       String?
  baseNotes         String?
  concentration     String?          // Eau de Parfum, Eau de Toilette, etc.
  sizeML            Int?             // Size in milliliters
  ingredients       String?          // Long text
  
  // Media
  thumbnail         String?          // Primary image
  
  // SEO
  metaTitle         String?
  metaDescription   String?
  metaKeywords      String?
  
  // Status
  status            ProductStatus    @default(DRAFT)
  featured          Boolean          @default(false)
  isBestseller      Boolean          @default(false)
  isNewArrival      Boolean          @default(false)
  
  // Stats
  viewCount         Int              @default(0)
  orderCount        Int              @default(0)
  averageRating     Float            @default(0)
  reviewCount       Int              @default(0)
  
  // Relationships
  variants          ProductVariant[]
  images            ProductImage[]
  categories        ProductCategory[]
  reviews           Review[]
  cartItems         CartItem[]
  orderItems        OrderItem[]
  wishlistItems     WishlistItem[]
  
  // Timestamps
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  publishedAt       DateTime?
  
  @@index([vendorId])
  @@index([slug])
  @@index([sku])
  @@index([status, featured])
  @@index([scentFamily])
  @@index([brand])
  @@fulltext([name, description, brand])
}
```

### 3.4 Product Variants Table

```prisma
model ProductVariant {
  id                String         @id @default(cuid())
  productId         String
  product           Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Variant Details
  name              String         // e.g., "50ml", "100ml", "Red"
  nameAr            String?
  sku               String         @unique
  
  // Pricing
  price             Float
  compareAtPrice    Float?
  
  // Inventory
  stockQuantity     Int            @default(0)
  
  // Variant Options
  options           Json           // { size: "50ml", color: "Red" }
  
  // Media
  image             String?        // Optional variant-specific image
  
  // Status
  isActive          Boolean        @default(true)
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([productId])
  @@index([sku])
}
```

### 3.5 Product Images Table

```prisma
model ProductImage {
  id                String         @id @default(cuid())
  productId         String
  product           Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  url               String
  altText           String?
  altTextAr         String?
  position          Int            @default(0) // Order of images
  isVideo           Boolean        @default(false)
  videoUrl          String?
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([productId, position])
}
```

### 3.6 Categories Table

```prisma
model Category {
  id                String           @id @default(cuid())
  name              String
  nameAr            String?
  slug              String           @unique
  description       String?
  descriptionAr     String?
  
  // Hierarchy
  parentId          String?
  parent            Category?        @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children          Category[]       @relation("CategoryHierarchy")
  
  // Media
  image             String?
  icon              String?
  
  // SEO
  metaTitle         String?
  metaDescription   String?
  
  // Display
  position          Int              @default(0)
  isActive          Boolean          @default(true)
  isFeatured        Boolean          @default(false)
  
  // Relationships
  products          ProductCategory[]
  
  // Timestamps
  createdAt         DateTime         @default(now())
  updatedAt         DateTime         @updatedAt
  
  @@index([slug])
  @@index([parentId])
  @@index([isActive, isFeatured])
}
```

### 3.7 Product Categories (Junction Table)

```prisma
model ProductCategory {
  id                String         @id @default(cuid())
  productId         String
  product           Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  categoryId        String
  category          Category       @relation(fields: [categoryId], references: [id], onDelete: Cascade)
  
  createdAt         DateTime       @default(now())
  
  @@unique([productId, categoryId])
  @@index([productId])
  @@index([categoryId])
}
```

---

## 4. E-Commerce Tables

### 4.1 Orders Table

```prisma
model Order {
  id                String         @id @default(cuid())
  orderNumber       String         @unique // User-friendly order number
  userId            String
  user              User           @relation(fields: [userId], references: [id])
  vendorId          String
  vendor            Vendor         @relation(fields: [vendorId], references: [id])
  
  // Order Details
  status            OrderStatus    @default(PENDING)
  paymentStatus     PaymentStatus  @default(PENDING)
  paymentMethod     PaymentMethod
  
  // Amounts
  subtotal          Float
  discount          Float          @default(0)
  tax               Float          @default(0)
  shippingCost      Float          @default(0)
  total             Float
  
  // Coupon
  couponCode        String?
  couponDiscount    Float          @default(0)
  
  // Shipping
  addressId         String
  address           Address        @relation(fields: [addressId], references: [id])
  deliveryType      DeliveryType   @default(STANDARD)
  trackingNumber    String?
  estimatedDelivery DateTime?
  deliveredAt       DateTime?
  
  // Payment
  paymentIntentId   String?        // Stripe Payment Intent ID
  transactionId     String?
  
  // Customer Notes
  customerNotes     String?
  
  // Vendor Notes
  vendorNotes       String?
  
  // Coins/Cashback
  coinsEarned       Int            @default(0)
  
  // Cancellation
  cancelledAt       DateTime?
  cancellationReason String?
  
  // Relationships
  items             OrderItem[]
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  confirmedAt       DateTime?
  
  @@index([orderNumber])
  @@index([userId])
  @@index([vendorId])
  @@index([status])
  @@index([paymentStatus])
  @@index([createdAt])
}
```

### 4.2 Order Items Table

```prisma
model OrderItem {
  id                String         @id @default(cuid())
  orderId           String
  order             Order          @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId         String
  product           Product        @relation(fields: [productId], references: [id])
  variantId         String?
  
  // Item Details
  productName       String         // Snapshot at time of order
  productNameAr     String?
  sku               String
  variantName       String?
  
  // Pricing
  price             Float          // Price at time of order
  quantity          Int
  subtotal          Float
  discount          Float          @default(0)
  total             Float
  
  // Product Snapshot (JSON)
  productSnapshot   Json?          // Store product details at time of order
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([orderId])
  @@index([productId])
}
```

### 4.3 Carts Table

```prisma
model Cart {
  id                String         @id @default(cuid())
  userId            String         @unique
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Relationships
  items             CartItem[]
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([userId])
}
```

### 4.4 Cart Items Table

```prisma
model CartItem {
  id                String         @id @default(cuid())
  cartId            String
  cart              Cart           @relation(fields: [cartId], references: [id], onDelete: Cascade)
  productId         String
  product           Product        @relation(fields: [productId], references: [id])
  variantId         String?
  
  quantity          Int            @default(1)
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([cartId, productId, variantId])
  @@index([cartId])
  @@index([productId])
}
```

### 4.5 Addresses Table

```prisma
model Address {
  id                String         @id @default(cuid())
  userId            String
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Address Details
  fullName          String
  phone             String
  addressLine1      String
  addressLine2      String?
  city              String
  state             String?
  postalCode        String?
  country           String         @default("AE")
  
  // Flags
  isDefault         Boolean        @default(false)
  type              String?        // Home, Office, Other
  
  // Location (optional for future map integration)
  latitude          Float?
  longitude         Float?
  
  // Relationships
  orders            Order[]
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([userId])
  @@index([isDefault])
}
```

---

## 5. Engagement Tables

### 5.1 Reviews Table

```prisma
model Review {
  id                String         @id @default(cuid())
  userId            String
  user              User           @relation(fields: [userId], references: [id])
  productId         String
  product           Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Review Content
  rating            Int            // 1-5 stars
  title             String?
  comment           String?
  
  // Media
  images            String[]       // Array of image URLs
  
  // Verification
  isVerifiedPurchase Boolean       @default(false)
  
  // Moderation
  isApproved        Boolean        @default(false)
  approvedAt        DateTime?
  moderatedBy       String?
  
  // Helpful votes
  helpfulCount      Int            @default(0)
  unhelpfulCount    Int            @default(0)
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@unique([userId, productId]) // One review per user per product
  @@index([productId, isApproved])
  @@index([rating])
}
```

### 5.2 Wishlists Table

```prisma
model Wishlist {
  id                String         @id @default(cuid())
  userId            String         @unique
  user              User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Relationships
  items             WishlistItem[]
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([userId])
}
```

### 5.3 Wishlist Items Table

```prisma
model WishlistItem {
  id                String         @id @default(cuid())
  wishlistId        String
  wishlist          Wishlist       @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  productId         String
  product           Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  
  // Timestamps
  createdAt         DateTime       @default(now())
  
  @@unique([wishlistId, productId])
  @@index([wishlistId])
  @@index([productId])
}
```

### 5.4 Coupons Table

```prisma
model Coupon {
  id                String         @id @default(cuid())
  code              String         @unique
  vendorId          String?        // Null for platform-wide coupons
  vendor            Vendor?        @relation(fields: [vendorId], references: [id])
  
  // Coupon Details
  name              String
  description       String?
  
  // Discount
  discountType      String         // PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING
  discountValue     Float
  
  // Conditions
  minPurchaseAmount Float?
  maxDiscountAmount Float?
  
  // Usage Limits
  maxUsageTotal     Int?           // Total uses allowed
  maxUsagePerUser   Int?           // Per user limit
  currentUsageCount Int            @default(0)
  
  // Validity
  startsAt          DateTime
  expiresAt         DateTime
  isActive          Boolean        @default(true)
  
  // Applicable Categories/Products (JSON)
  applicableProducts String[]      @default([])
  applicableCategories String[]    @default([])
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([code])
  @@index([vendorId])
  @@index([isActive, startsAt, expiresAt])
}
```

---

## 6. Financial Tables

### 6.1 Wallets Table

```prisma
model Wallet {
  id                String         @id @default(cuid())
  userId            String?        @unique
  user              User?          @relation(fields: [userId], references: [id])
  vendorId          String?        @unique
  vendor            Vendor?        @relation(fields: [vendorId], references: [id])
  
  // Balances
  balance           Float          @default(0)
  pendingBalance    Float          @default(0) // Held funds
  
  // Coins (for customers)
  coinsBalance      Int            @default(0)
  
  // Currency
  currency          String         @default("AED")
  
  // Relationships
  transactions      Transaction[]
  payouts           Payout[]
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([userId])
  @@index([vendorId])
}
```

### 6.2 Transactions Table

```prisma
model Transaction {
  id                String           @id @default(cuid())
  walletId          String
  wallet            Wallet           @relation(fields: [walletId], references: [id])
  
  // Transaction Details
  type              TransactionType
  amount            Float
  balanceBefore     Float
  balanceAfter      Float
  
  // Reference
  referenceType     String?          // ORDER, PAYOUT, REFUND, etc.
  referenceId       String?          // ID of the related entity
  
  // Description
  description       String
  descriptionAr     String?
  
  // Metadata
  metadata          Json?
  
  // Timestamps
  createdAt         DateTime         @default(now())
  
  @@index([walletId])
  @@index([type])
  @@index([createdAt])
}
```

### 6.3 Payouts Table

```prisma
model Payout {
  id                String         @id @default(cuid())
  walletId          String
  wallet            Wallet         @relation(fields: [walletId], references: [id])
  
  // Payout Details
  amount            Float
  currency          String         @default("AED")
  status            String         // PENDING, PROCESSING, COMPLETED, FAILED
  
  // Bank Details (encrypted in production)
  bankName          String?
  accountNumber     String?
  accountHolderName String?
  
  // Payment Provider
  payoutMethod      String         // BANK_TRANSFER, STRIPE, etc.
  externalId        String?        // Stripe payout ID, etc.
  
  // Failure
  failureReason     String?
  
  // Timestamps
  createdAt         DateTime       @default(now())
  processedAt       DateTime?
  completedAt       DateTime?
  
  @@index([walletId])
  @@index([status])
  @@index([createdAt])
}
```

---

## 7. System Tables

### 7.1 Notifications Table

```prisma
model Notification {
  id                String              @id @default(cuid())
  userId            String
  user              User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  // Notification Details
  type              NotificationType
  channel           NotificationChannel
  
  title             String
  titleAr           String?
  message           String
  messageAr         String?
  
  // Link
  actionUrl         String?
  actionLabel       String?
  actionLabelAr     String?
  
  // Media
  icon              String?
  image             String?
  
  // Status
  isRead            Boolean            @default(false)
  readAt            DateTime?
  
  // Metadata
  metadata          Json?
  
  // Timestamps
  createdAt         DateTime           @default(now())
  
  @@index([userId, isRead])
  @@index([createdAt])
}
```

### 7.2 Settings Table

```prisma
model Setting {
  id                String         @id @default(cuid())
  key               String         @unique
  value             Json
  description       String?
  
  // Timestamps
  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt
  
  @@index([key])
}
```

### 7.3 Audit Logs Table

```prisma
model AuditLog {
  id                String         @id @default(cuid())
  userId            String?
  
  // Action Details
  action            String         // CREATE, UPDATE, DELETE, LOGIN, etc.
  entityType        String         // User, Product, Order, etc.
  entityId          String?
  
  // Changes
  oldValue          Json?
  newValue          Json?
  
  // Context
  ipAddress         String?
  userAgent         String?
  
  // Timestamps
  createdAt         DateTime       @default(now())
  
  @@index([userId])
  @@index([entityType, entityId])
  @@index([action])
  @@index([createdAt])
}
```

---

## 8. Database Indexes

### 8.1 Critical Indexes

```sql
-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_role_status ON users(role, status);

-- Products
CREATE INDEX idx_products_vendor ON products(vendor_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_status_featured ON products(status, featured);
CREATE INDEX idx_products_scent_family ON products(scent_family);
CREATE FULLTEXT INDEX idx_products_search ON products(name, description, brand);

-- Orders
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_vendor ON orders(vendor_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at);

-- Reviews
CREATE INDEX idx_reviews_product_approved ON reviews(product_id, is_approved);
CREATE INDEX idx_reviews_rating ON reviews(rating);
```

---

## 9. Database Seeding

### 9.1 Seed Data (prisma/seed.ts)

```typescript
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create Super Admin
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@aromasouq.ae' },
    update: {},
    create: {
      email: 'admin@aromasouq.ae',
      emailVerified: true,
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
      status: 'ACTIVE',
    },
  });

  // Create Categories
  const categories = [
    { name: 'Perfumes', nameAr: 'عطور', slug: 'perfumes' },
    { name: 'Oud', nameAr: 'عود', slug: 'oud' },
    { name: 'Attars', nameAr: 'عطور زيتية', slug: 'attars' },
    { name: 'Bakhoor', nameAr: 'بخور', slug: 'bakhoor' },
    { name: 'Home Fragrance', nameAr: 'معطرات المنزل', slug: 'home-fragrance' },
    { name: 'Essential Oils', nameAr: 'زيوت عطرية', slug: 'essential-oils' },
    { name: 'Gift Sets', nameAr: 'مجموعات هدايا', slug: 'gift-sets' },
    { name: 'Raw Materials', nameAr: 'مواد خام', slug: 'raw-materials' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }

  // Create Sample Vendor
  const vendor = await prisma.user.upsert({
    where: { email: 'vendor@example.com' },
    update: {},
    create: {
      email: 'vendor@example.com',
      emailVerified: true,
      firstName: 'Sample',
      lastName: 'Vendor',
      password: hashedPassword,
      role: 'VENDOR',
      status: 'ACTIVE',
      vendor: {
        create: {
          businessName: 'Luxury Fragrances',
          businessNameAr: 'عطور فاخرة',
          slug: 'luxury-fragrances',
          businessEmail: 'vendor@example.com',
          businessPhone: '+971501234567',
          status: 'APPROVED',
          commissionRate: 15.0,
        },
      },
    },
  });

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

---

## 10. Migration Strategy

### 10.1 Initial Setup with Supabase

**Step 1: Create Supabase Project**
```bash
1. Visit https://supabase.com
2. Create new project: "aromasouq-production"
3. Choose region closest to your users (Singapore for UAE)
4. Set strong database password
5. Wait for project provisioning (~2 minutes)
```

**Step 2: Configure Prisma**
```bash
# Install Prisma
npm install prisma --save-dev
npm install @prisma/client

# Initialize Prisma (if not done)
npx prisma init

# Update .env with Supabase connection strings
# Get from: Supabase Dashboard → Settings → Database → Connection string
```

**Step 3: Create Schema**
```bash
# Add all models to prisma/schema.prisma (from this document)

# Format schema
npx prisma format
```

**Step 4: Run Initial Migration**
```bash
# Create and apply migration
npx prisma migrate dev --name init

# This will:
# 1. Create migration files in prisma/migrations/
# 2. Apply migration to Supabase database
# 3. Generate Prisma Client
```

**Step 5: Verify in Supabase Dashboard**
```
1. Go to Supabase Dashboard → Table Editor
2. You should see all your tables (User, Product, Order, etc.)
3. Check Database → Schema to see relationships
```

### 10.2 Schema Updates

**Development:**
```bash
# After making changes to schema.prisma
npx prisma migrate dev --name add_new_field

# This creates a new migration and applies it
```

**Production:**
```bash
# Deploy migrations to production
npx prisma migrate deploy

# This only applies pending migrations (doesn't create new ones)
```

### 10.3 Supabase-Specific Considerations

**Connection Pooling:**
```
⚠️ IMPORTANT: Use pooled connection for application runtime

In your application (NestJS):
- Use DATABASE_URL_POOLER for PrismaClient
- Use DATABASE_URL only for migrations

Why? Supabase uses Supavisor (connection pooler) to handle many connections efficiently.
```

**Transaction Mode:**
```bash
# If you encounter transaction mode errors, add to pooled URL:
DATABASE_URL_POOLER="...?pgbouncer=true&connection_limit=1"
```

**Row Level Security (RLS):**
```sql
-- Supabase enables RLS by default on new tables
-- Since we're using NestJS for auth, disable RLS on our tables:

ALTER TABLE "User" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Product" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Order" DISABLE ROW LEVEL SECURITY;
-- Repeat for all tables

-- Or run this for all tables at once:
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.tablename) || ' DISABLE ROW LEVEL SECURITY';
    END LOOP;
END$$;
```

### 10.4 Rollback Plan

**Rollback Last Migration:**
```bash
# View migration history
npx prisma migrate status

# If last migration failed or has issues:
# 1. Mark as rolled back
npx prisma migrate resolve --rolled-back [migration_name]

# 2. Fix the schema
# 3. Create new migration
npx prisma migrate dev --name fix_issue
```

**Emergency Rollback (Production):**
```bash
# If production migration causes issues:

# 1. Restore from Supabase backup (if Pro tier)
# Via Supabase Dashboard → Database → Backups

# 2. Or manually restore from pg_dump
psql "$DATABASE_URL" < backup_file.sql

# 3. Update application to use previous migration
git checkout <previous-commit>
npm run build
# Redeploy
```

---

## 11. Database Optimization

### 11.1 Performance Tips

1. **Use Indexes Wisely:**
   - Index foreign keys
   - Index fields used in WHERE clauses
   - Index fields used in ORDER BY
   - Don't over-index (slows writes)

2. **Pagination:**
   - Use cursor-based pagination for large datasets
   - Avoid OFFSET with large numbers

3. **Query Optimization:**
   - Use `select` to fetch only needed fields
   - Use `include` sparingly (avoid N+1 queries)
   - Batch queries when possible

4. **Caching:**
   - Cache frequently accessed data (Redis)
   - Invalidate cache on updates

### 11.2 Monitoring

**Supabase Built-in Monitoring:**
```
Access: Supabase Dashboard → Reports

Metrics Available:
- Database size and growth
- API requests (per hour/day)
- Database egress (bandwidth)
- Storage usage
- Active connections
- CPU usage
- Memory usage
- Query performance

Useful Queries in SQL Editor:
```

```sql
-- Database size
SELECT pg_size_pretty(pg_database_size('postgres'));

-- Table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Slow queries (if enabled)
SELECT * FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;

-- Active connections
SELECT 
  count(*) as total_connections,
  state,
  application_name
FROM pg_stat_activity
WHERE state IS NOT NULL
GROUP BY state, application_name;

-- Cache hit ratio (should be > 99%)
SELECT 
  sum(heap_blks_read) as heap_read,
  sum(heap_blks_hit) as heap_hit,
  sum(heap_blks_hit) / (sum(heap_blks_hit) + sum(heap_blks_read)) as ratio
FROM pg_statio_user_tables;
```

**External Monitoring Tools:**
```
Prisma Studio: Visual database browser
  npx prisma studio
  
Additional Tools:
- Datadog (APM) - Advanced monitoring
- New Relic - Application performance
- Sentry - Error tracking with DB insights

Metrics to Track:
- Query execution time (<100ms target)
- Connection pool usage (<80% utilized)
- Cache hit rate (>99%)
- Database size (monitor growth)
- Index usage (ensure indexes are used)
```

**Alerts Setup (Pro/Team Tier):**
```
Configure in Supabase Dashboard → Settings → Alerts

Recommended Alerts:
1. Database size > 80% of limit
2. CPU usage > 80% for 5 minutes
3. Connection count > 80% of limit
4. API response time > 2 seconds
5. Error rate > 1% of requests
```

---

## 12. Backup & Recovery

### 12.1 Supabase Automatic Backups

**Backup Tiers:**
```
Free Tier:
- No automatic backups
- Manual backups only (pg_dump)
- Self-service restore

Pro Tier ($25/mo):
- Daily automatic backups
- 7-day retention
- Point-in-time recovery (coming soon)
- One-click restore

Team Tier ($599/mo):
- Daily automatic backups
- 30-day retention
- Point-in-time recovery
- Multiple restore points
```

**Access Backups:**
```
Supabase Dashboard → Database → Backups
- View backup history
- Download backups
- Restore from backup (one-click)
```

### 12.2 Manual Backup Strategy

**Daily Backup Script:**
```bash
#!/bin/bash
# backup.sh

# Set variables
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
BACKUP_FILE="aromasouq_${DATE}.sql"
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres"

# Create backup directory
mkdir -p $BACKUP_DIR

# Run pg_dump
pg_dump "$DATABASE_URL" > "${BACKUP_DIR}/${BACKUP_FILE}"

# Compress backup
gzip "${BACKUP_DIR}/${BACKUP_FILE}"

# Upload to S3 (optional)
aws s3 cp "${BACKUP_DIR}/${BACKUP_FILE}.gz" s3://aromasouq-backups/

# Delete local backups older than 7 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

echo "Backup completed: ${BACKUP_FILE}.gz"
```

**Setup Cron Job:**
```bash
# Run daily at 2 AM
0 2 * * * /path/to/backup.sh
```

### 12.3 Restore Process

**From Supabase Dashboard (Pro/Team):**
```
1. Dashboard → Database → Backups
2. Select backup date
3. Click "Restore"
4. Confirm restoration
5. Wait for completion (~2-5 minutes)
6. Restart application
```

**From Manual Backup:**
```bash
# Decompress
gunzip aromasouq_20251024_020000.sql.gz

# Restore
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT_REF].supabase.co:5432/postgres" < aromasouq_20251024_020000.sql

# Or restore specific tables only
pg_restore --table=Product aromasouq_backup.sql
```

**Partial Restore (Specific Tables):**
```bash
# Backup specific table
pg_dump "$DATABASE_URL" --table=Product > product_backup.sql

# Restore specific table
psql "$DATABASE_URL" < product_backup.sql
```

### 12.4 Disaster Recovery Plan

**Scenario 1: Database Corruption**
```
1. Identify affected tables
2. Stop application (prevent further corruption)
3. Restore from latest Supabase backup
4. Or restore specific tables from manual backup
5. Validate data integrity
6. Restart application
7. Monitor for 24 hours
```

**Scenario 2: Complete Data Loss**
```
1. Create new Supabase project (if needed)
2. Restore from latest backup
3. Update environment variables
4. Run Prisma migrations (if schema changed)
5. Deploy application
6. Update DNS (if using custom domain)
7. Comprehensive data validation
```

**Scenario 3: Accidental Data Deletion**
```
1. Don't panic!
2. Check if soft-deleted (deletedAt field)
3. If hard-deleted, restore from backup
4. Use point-in-time recovery (Team tier)
5. Or restore specific tables from manual backup
6. Validate restored data
```

### 12.5 Backup Testing

**Monthly Backup Test:**
```
1. Download latest backup
2. Create test Supabase project
3. Restore backup to test project
4. Run data validation queries
5. Test critical queries
6. Document any issues
7. Delete test project
```

**Validation Queries:**
```sql
-- Check record counts
SELECT 
  'User' as table_name, COUNT(*) as count FROM "User"
UNION ALL
SELECT 'Product', COUNT(*) FROM "Product"
UNION ALL  
SELECT 'Order', COUNT(*) FROM "Order";

-- Check data integrity
SELECT COUNT(*) as orphaned_products
FROM "Product" p
LEFT JOIN "Vendor" v ON p."vendorId" = v.id
WHERE v.id IS NULL;

-- Check recent data
SELECT COUNT(*) as recent_orders
FROM "Order"
WHERE "createdAt" > NOW() - INTERVAL '7 days';
```

---

## 13. Database Security

### 13.1 Security Measures

1. **Access Control:**
   - Use different database users for different services
   - Principle of least privilege
   - Rotate credentials regularly

2. **Encryption:**
   - Enable encryption at rest (AWS RDS)
   - Use SSL/TLS for connections
   - Encrypt sensitive fields (PII, payment info)

3. **SQL Injection Prevention:**
   - Prisma ORM prevents SQL injection by default
   - Never concatenate user input into queries

4. **Audit Logging:**
   - Log all sensitive operations
   - Monitor for suspicious activity
   - Regular security audits

---

## 14. Documentation Tools

```
Tools:
- Prisma Studio: Visual database browser (npx prisma studio)
- Supabase Dashboard: Built-in database explorer, SQL editor
- dbdocs.io: Generate database documentation
- SchemaSpy: Database schema visualization
- Draw.io / Lucidchart: ER diagrams
```

---

## 15. Supabase Quick Reference

### 15.1 Essential Commands

```bash
# Prisma with Supabase
npx prisma migrate dev --name <name>    # Create & apply migration
npx prisma migrate deploy                # Deploy to production
npx prisma generate                      # Generate Prisma Client
npx prisma studio                        # Open visual editor
npx prisma db push                       # Push schema without migration (dev only)
npx prisma db seed                       # Run seed script

# Database backup
pg_dump "$DATABASE_URL" > backup.sql

# Database restore  
psql "$DATABASE_URL" < backup.sql
```

### 15.2 Useful SQL Queries

```sql
-- View all tables with row counts
SELECT 
  schemaname,
  tablename,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = tablename) as column_count,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Find unused indexes (candidates for removal)
SELECT 
  schemaname,
  tablename,
  indexname,
  idx_scan as scans
FROM pg_stat_user_indexes
WHERE schemaname = 'public' AND idx_scan = 0
ORDER BY tablename;

-- Database performance overview
SELECT 
  datname as database,
  numbackends as connections,
  xact_commit as commits,
  xact_rollback as rollbacks,
  blks_read as disk_reads,
  blks_hit as cache_hits,
  round(blks_hit::numeric/(blks_hit+blks_read)*100,2) as cache_hit_ratio
FROM pg_stat_database
WHERE datname = 'postgres';

-- Long-running queries
SELECT
  pid,
  now() - query_start as duration,
  query,
  state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;
```

### 15.3 Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link project
supabase link --project-ref [project-ref]

# Pull database types (for TypeScript)
supabase gen types typescript --linked > database.types.ts

# Run migrations locally
supabase db push

# Reset local database
supabase db reset
```

---

**Document Status:** ✅ Database Schema Complete (Supabase-Ready)  
**Next Steps:** 
1. Create Supabase project
2. Configure connection strings
3. Run `npx prisma migrate dev --name init`
4. Run `npx prisma db seed`
5. Open `npx prisma studio` to verify

**Quick Start Commands:**
```bash
# 1. Set up environment
cp .env.example .env
# Add your Supabase connection strings to .env

# 2. Install dependencies
npm install

# 3. Run initial migration
npx prisma migrate dev --name init

# 4. Generate Prisma Client
npx prisma generate

# 5. Seed database
npx prisma db seed

# 6. Open Prisma Studio
npx prisma studio

# 7. Verify in Supabase Dashboard
# https://supabase.com/dashboard → Your Project → Table Editor
```

**Supabase Dashboard Links:**
- Tables: `https://supabase.com/dashboard/project/[ref]/editor`
- SQL Editor: `https://supabase.com/dashboard/project/[ref]/sql`
- Database Settings: `https://supabase.com/dashboard/project/[ref]/settings/database`
- Backups: `https://supabase.com/dashboard/project/[ref]/settings/database` (Pro tier)
