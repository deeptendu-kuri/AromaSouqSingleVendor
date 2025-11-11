# AromaSouq MVP - Claude Code Development Guide

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Purpose:** Step-by-step guide to building AromaSouq using Claude Code

---

## 1. Introduction to Claude Code

### 1.1 What is Claude Code?

Claude Code is a command-line tool for agentic coding that allows you to delegate coding tasks to Claude directly from your terminal. It's perfect for accelerating development of AromaSouq.

### 1.2 Installation

```bash
# Install Claude Code (check official documentation for latest instructions)
# Typically via npm or as a standalone CLI tool

# Initialize in your project
claude-code init
```

### 1.3 Best Practices

**DO:**
- Break tasks into small, specific requests
- Provide context (file paths, requirements)
- Review and test generated code
- Iterate and refine based on results
- Use version control (commit frequently)

**DON'T:**
- Request entire applications in one prompt
- Accept code without understanding it
- Skip testing generated code
- Forget to update documentation

---

## 2. Project Setup with Claude Code

### 2.1 Initialize Next.js Frontend

**Prompt:**
```
Create a Next.js 14+ project with the following configuration:
- TypeScript with strict mode
- App Router (not Pages Router)
- Tailwind CSS
- ESLint and Prettier
- src/ directory structure
- Configure tsconfig.json for absolute imports (@/ alias)
- Add .env.local.example file
- Create README.md with setup instructions

Project name: aromasouq-web
```

**Expected Output:**
- Next.js project initialized
- Tailwind configured
- TypeScript configured
- Basic project structure

### 2.2 Initialize NestJS Backend

**Prompt:**
```
Create a NestJS project with the following configuration:
- TypeScript with strict mode
- Prisma ORM
- JWT authentication modules
- Environment variable configuration
- Docker setup for local PostgreSQL and Redis
- API versioning (v1)
- Swagger/OpenAPI documentation
- Health check endpoint

Project name: aromasouq-api
```

**Expected Output:**
- NestJS project initialized
- Docker Compose file
- Basic modules scaffolded
- Environment variables configured

---

## 3. Database Schema Implementation

### 3.1 Create Prisma Schema

**Prompt:**
```
Create a comprehensive Prisma schema for an e-commerce perfume marketplace with the following models:

1. User model with fields:
   - id (cuid), email (unique), password, firstName, lastName, role (enum: CUSTOMER, VENDOR, ADMIN), status (enum), emailVerified, phone, avatar, createdAt, updatedAt

2. Vendor model with fields:
   - id, userId (unique, relation), businessName, slug (unique), description, logo, status (enum: PENDING, APPROVED, REJECTED), businessEmail, phone, commissionRate

3. Product model with fields:
   - id, vendorId (relation), name, slug (unique), description, price, compareAtPrice, stockQuantity, sku (unique), status (enum: DRAFT, ACTIVE, OUT_OF_STOCK), brand, scentFamily, topNotes, middleNotes, baseNotes, featured, averageRating, reviewCount

4. Category, ProductImage, Order, OrderItem, Cart, CartItem, Address, Review, Wishlist, Coupon, Wallet models

Use proper relations, indexes, and enums. Follow PostgreSQL best practices.

Output the complete schema.prisma file.
```

**Expected Output:**
- Complete Prisma schema
- All models defined
- Proper relations and indexes

### 3.2 Generate Prisma Client

**Prompt:**
```
After creating the Prisma schema:
1. Generate the initial migration
2. Generate Prisma Client
3. Create a seed script in TypeScript that creates:
   - 1 Super Admin user
   - 8 product categories (Perfumes, Oud, Attars, Bakhoor, etc.)
   - 1 sample approved vendor
   
Provide the commands to run and the seed.ts file content.
```

**Commands:**
```bash
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

---

## 4. Authentication System

### 4.1 Backend Authentication

**Prompt:**
```
Create a complete authentication system for NestJS with the following:

Modules:
- AuthModule with JWT strategy
- UsersModule for user management

Features:
1. User registration with email validation
2. User login with JWT tokens (access + refresh)
3. Password hashing with bcrypt (cost factor 12)
4. Email verification flow
5. Password reset flow
6. Refresh token rotation
7. JWT Guards for protected routes
8. Role-based guards (CUSTOMER, VENDOR, ADMIN)

Include:
- auth.service.ts
- auth.controller.ts
- jwt.strategy.ts
- auth.guard.ts
- roles.guard.ts
- DTOs for all endpoints
- Proper error handling

Use Prisma for database operations.
```

**Expected Output:**
- Complete auth module
- JWT configuration
- Guards and decorators
- DTOs with validation

### 4.2 Frontend Authentication

**Prompt:**
```
Create a complete authentication system for Next.js 14 App Router with:

1. Auth Context (React Context API) for managing user state
2. Login page (/login) with:
   - Email and password fields
   - Form validation using React Hook Form + Zod
   - Error handling
   - Loading states
   - Remember me checkbox
   - Link to register and forgot password

3. Register page (/register) with:
   - First name, last name, email, password, confirm password
   - Strong password requirements
   - Terms acceptance checkbox

4. Forgot password page (/forgot-password)
5. Protected route HOC/middleware
6. API client with automatic token refresh
7. Store tokens in httpOnly cookies (server-side)

Use TypeScript, Tailwind CSS, and the Oud Gold color scheme (#C9A86A).
```

**Expected Output:**
- Auth context provider
- Login/register pages
- Protected route middleware
- API client with interceptors

---

## 5. Product Catalog Development

### 5.1 Product API Endpoints

**Prompt:**
```
Create a complete ProductsModule for NestJS with the following endpoints:

1. GET /products - List products with:
   - Pagination (cursor-based)
   - Filtering (category, brand, priceRange, scentFamily, status)
   - Sorting (price, createdAt, rating, name)
   - Search (full-text search on name, description, brand)
   - Include related data (vendor, images, categories)

2. GET /products/:slug - Get product details with:
   - All product fields
   - Product images
   - Product variants
   - Average rating and review count
   - Related products

3. POST /products - Create product (vendor only):
   - Validate all fields
   - Handle image uploads
   - Create variants
   - Associate with categories

4. PUT /products/:id - Update product (vendor only)
5. DELETE /products/:id - Soft delete (vendor only)
6. GET /products/:id/reviews - Get product reviews

Include:
- products.service.ts with Prisma queries
- products.controller.ts with all endpoints
- DTOs for create, update, filter
- Proper validation
- Authorization guards (only vendor can edit their products)
- Error handling

Optimize queries to avoid N+1 problems.
```

**Expected Output:**
- Complete products module
- Optimized Prisma queries
- Proper validation and guards

### 5.2 Product List Page

**Prompt:**
```
Create a product listing page for Next.js App Router at /products with:

1. Product grid layout (responsive: 4 columns desktop, 2 columns tablet, 1 column mobile)
2. Product cards showing:
   - Product image (with lazy loading)
   - Product name
   - Brand
   - Price (with discount if applicable)
   - Rating stars
   - "Add to Cart" button
   - "Add to Wishlist" heart icon
   - "New Arrival" or "Sale" badge

3. Filters sidebar (collapsible on mobile):
   - Categories (checkboxes)
   - Price range (slider)
   - Scent family (checkboxes)
   - Brand (searchable dropdown)

4. Search bar at top
5. Sort dropdown (Price: Low to High, High to Low, Newest, Rating)
6. Pagination (load more button)
7. Loading states (skeleton loaders)
8. Empty state ("No products found")

Use:
- TypeScript
- Tailwind CSS with Oud Gold theme
- TanStack Query for data fetching
- Framer Motion for animations
- Next.js Image component

Make it visually stunning with smooth animations and luxury feel.
```

**Expected Output:**
- Product listing page
- Filter sidebar
- Product cards
- Loading states

### 5.3 Product Detail Page

**Prompt:**
```
Create a product detail page for Next.js at /products/[slug] with:

1. Layout:
   - Left: Image gallery (main image + thumbnails, zoom on hover, lightbox on click)
   - Right: Product information

2. Product Information:
   - Breadcrumbs
   - Product name and brand
   - Star rating and review count
   - Price (with strikethrough for compareAtPrice)
   - "In Stock" or "Out of Stock" badge
   - Size/variant selector (if available)
   - Quantity selector (with stock limit)
   - "Add to Cart" button (primary)
   - "Add to Wishlist" button (secondary)
   - "Share" button (WhatsApp, Facebook, Copy link)
   - "Ask for Wholesale" button

3. Product Details Tabs:
   - Description tab with scent notes (top, middle, base)
   - Ingredients tab
   - Reviews tab (list of reviews with pagination)
   - Shipping & Returns tab

4. Related Products section (carousel)

5. SEO:
   - Proper meta tags
   - Open Graph tags
   - Structured data (Product schema)

Use TypeScript, Tailwind CSS, luxury UAE aesthetic.
Fetch data with SSR for SEO.
```

**Expected Output:**
- Product detail page
- Image gallery
- Tabbed content
- SEO optimization

---

## 6. Shopping Cart Implementation

### 6.1 Cart Backend

**Prompt:**
```
Create a CartsModule for NestJS with the following endpoints:

1. GET /cart - Get user's cart with items (include product details, images)
2. POST /cart/items - Add item to cart (validate stock availability)
3. PUT /cart/items/:id - Update item quantity (validate stock)
4. DELETE /cart/items/:id - Remove item from cart
5. DELETE /cart - Clear entire cart

Features:
- Merge guest cart with user cart on login
- Validate product availability before adding
- Calculate cart totals (subtotal)
- Handle out-of-stock items
- Optimistic locking for stock management

Include DTOs, validation, proper error messages.
Use Prisma transactions where needed.
```

**Expected Output:**
- Cart module
- Cart endpoints
- Cart merge logic
- Stock validation

### 6.2 Cart Frontend

**Prompt:**
```
Create a shopping cart system for Next.js with:

1. Global cart state using Zustand:
   - Cart items array
   - Add to cart action
   - Update quantity action
   - Remove item action
   - Clear cart action
   - Calculate totals

2. Cart drawer component (slides from right):
   - Cart item list with product image, name, price, quantity controls
   - Remove item button (trash icon)
   - Subtotal
   - "Continue Shopping" button
   - "Checkout" button (primary)
   - Empty state ("Your cart is empty")
   - Loading states

3. Cart icon in header:
   - Show item count badge
   - Click to open drawer
   - Animate on add to cart

4. "Add to Cart" functionality:
   - Optimistic UI update
   - Success toast notification
   - Cart drawer auto-opens briefly
   - Animation on cart icon

Use TypeScript, Zustand, Tailwind CSS, Framer Motion.
Implement cart persistence (localStorage for guests, API for logged in).
```

**Expected Output:**
- Zustand store
- Cart drawer component
- Add to cart functionality
- Animations

---

## 7. Checkout & Orders

### 7.1 Checkout Flow

**Prompt:**
```
Create a multi-step checkout page for Next.js at /checkout with:

Step 1: Shipping Address
- List saved addresses with "Use this address" button
- "Add new address" form (fullName, phone, addressLine1, addressLine2, city, postalCode)
- "Save address" checkbox
- Form validation

Step 2: Delivery Method
- Standard delivery (3-5 days) - Free
- Express delivery (1-2 days) - AED 15
- Same-day delivery (if available) - AED 25

Step 3: Payment Method
- Credit/Debit Card (Stripe)
- Cash on Delivery (COD)

Step 4: Review & Place Order
- Order summary (items, quantities, prices)
- Shipping address summary
- Delivery method
- Payment method
- Coupon code input (with apply button)
- Total breakdown (subtotal, shipping, discount, tax, total)
- "Place Order" button
- Terms & conditions checkbox

Features:
- Progress indicator at top
- "Back" and "Continue" buttons
- Validation before advancing steps
- Save progress (localStorage)
- Loading states

Use TypeScript, React Hook Form, Zod validation, Tailwind CSS.
```

**Expected Output:**
- Multi-step checkout
- Form validation
- Progress indicator
- Order summary

### 7.2 Order Confirmation

**Prompt:**
```
Create an order confirmation page at /orders/[orderId]/confirmation with:

1. Success message with checkmark animation
2. Order details:
   - Order number (large, prominent)
   - Order date
   - Estimated delivery date
   - Items ordered (list with images)
   - Shipping address
   - Payment method
   - Total amount paid

3. What's next section:
   - "Track your order" link
   - "Continue shopping" button
   - Email confirmation sent notice

4. Share order button (WhatsApp)

Use SSR to fetch order data.
Redirect if order doesn't belong to user.
Show loading state while fetching.

TypeScript, Tailwind CSS, luxury feel.
```

**Expected Output:**
- Order confirmation page
- Success animation
- Order details display

---

## 8. Vendor Dashboard

### 8.1 Vendor Product Management

**Prompt:**
```
Create a vendor product management system with:

1. Vendor layout (/vendor/layout.tsx):
   - Sidebar navigation (Dashboard, Products, Orders, Analytics, Settings)
   - Top bar with vendor name and logout
   - Mobile hamburger menu

2. Products list page (/vendor/products):
   - Data table with columns: Image, Name, SKU, Price, Stock, Status, Actions
   - "Add Product" button
   - Search and filters
   - Bulk actions (delete, change status)
   - Pagination

3. Add product page (/vendor/products/new):
   - Product information form (name, description, brand, sku, price, stock)
   - Scent details (scent family, top/middle/base notes)
   - Category selection (multi-select)
   - Image upload (drag & drop, multiple files, preview)
   - Variant management (add size/color variants)
   - SEO fields (meta title, description)
   - Status selection (Draft, Active)
   - "Save" and "Save & Publish" buttons

4. Edit product page (/vendor/products/[id]/edit):
   - Same as add, but pre-filled with existing data
   - Delete product button (with confirmation)

Use:
- TypeScript, Next.js App Router
- React Hook Form + Zod
- TanStack Table for data table
- Tailwind CSS
- Image upload with preview and compression

Include proper validation, error handling, loading states.
```

**Expected Output:**
- Vendor dashboard layout
- Products list with data table
- Add/edit product forms
- Image upload component

### 8.2 Vendor Order Management

**Prompt:**
```
Create vendor order management at /vendor/orders with:

1. Orders data table:
   - Columns: Order #, Date, Customer, Items, Total, Status, Actions
   - Filters: Status (All, Pending, Confirmed, Shipped, Delivered, Cancelled)
   - Date range picker
   - Search by order number or customer name

2. Order details modal/page:
   - Order information (number, date, customer details)
   - Shipping address
   - Items ordered (list with images, quantities, prices)
   - Order status timeline (Pending → Confirmed → Shipped → Delivered)
   - Status update dropdown (vendor can change status)
   - "Print packing slip" button
   - "Print invoice" button
   - Vendor notes (internal)

3. Status update functionality:
   - Update order status
   - Send email/WhatsApp notification to customer
   - Add tracking number (for shipped status)
   - Confirmation dialog

Use TanStack Table, TanStack Query, TypeScript, Tailwind CSS.
Implement optimistic updates for status changes.
```

**Expected Output:**
- Orders data table
- Order details view
- Status update functionality
- Print functionality

---

## 9. Admin Dashboard

### 9.1 Admin Vendor Management

**Prompt:**
```
Create admin vendor management at /admin/vendors with:

1. Vendor list data table:
   - Columns: Logo, Business Name, Email, Phone, Status, Applied Date, Actions
   - Filters: Status (All, Pending, Approved, Rejected, Suspended)
   - Search by name or email

2. Vendor detail page (/admin/vendors/[id]):
   - Business information
   - Contact details
   - Business license documents (view/download)
   - Application date
   - Products count, orders count, revenue
   - Action buttons:
     - Approve vendor
     - Reject vendor (with reason input)
     - Suspend vendor
     - Unsuspend vendor
   - Commission rate adjustment
   - Activity log

3. Vendor approval workflow:
   - Review application
   - View documents
   - Approve/reject with confirmation
   - Send email notification to vendor
   - Update vendor status

Use TypeScript, Next.js, TanStack Table, Tailwind CSS.
Implement proper authorization (only admins can access).
```

**Expected Output:**
- Vendor management table
- Vendor details page
- Approval workflow
- Document viewer

### 9.2 Admin Product Moderation

**Prompt:**
```
Create admin product moderation at /admin/products with:

1. Products data table:
   - Columns: Image, Name, Vendor, Category, Price, Status, Actions
   - Filters: Status (All, Draft, Pending Approval, Active, Flagged)
   - Search

2. Product review modal:
   - All product details
   - Images review
   - Content moderation (check for inappropriate content)
   - Approve/reject buttons
   - Flag button (with reason)
   - Add admin notes

3. Bulk actions:
   - Approve selected
   - Reject selected
   - Change status

Use TypeScript, TanStack Table, Modal components, Tailwind CSS.
```

**Expected Output:**
- Products moderation table
- Review modal
- Bulk actions
- Admin notes

---

## 10. Advanced Features

### 10.1 Review System

**Prompt:**
```
Create a complete review system with:

Backend (NestJS):
1. POST /products/:id/reviews - Create review (authenticated, verified purchase check)
2. GET /products/:id/reviews - List reviews (pagination, sorting)
3. POST /reviews/:id/helpful - Mark review as helpful
4. PUT /admin/reviews/:id/approve - Approve review (admin)
5. DELETE /admin/reviews/:id - Delete review (admin)

Frontend (Next.js):
1. Review form on product page:
   - Star rating (1-5)
   - Title
   - Comment (textarea)
   - Image upload (optional, up to 3 images)
   - Submit button

2. Reviews list on product page:
   - Star rating display
   - Review title and comment
   - Review images (if any)
   - Reviewer name and "Verified Purchase" badge
   - Review date
   - Helpful counter ("Was this helpful?" Yes/No buttons)
   - Pagination

3. Admin review moderation (/admin/reviews):
   - Pending reviews list
   - Approve/reject buttons
   - View full review with product context

Include validation, image upload, spam detection (basic word filtering).
```

**Expected Output:**
- Review API endpoints
- Review form component
- Reviews display
- Admin moderation

### 10.2 Wishlist System

**Prompt:**
```
Create a wishlist system with:

Backend (NestJS):
1. POST /wishlist/items - Add product to wishlist
2. DELETE /wishlist/items/:productId - Remove from wishlist
3. GET /wishlist - Get user's wishlist with product details

Frontend (Next.js):
1. Wishlist icon in header (with count badge)
2. Heart button on product cards (outline when not in wishlist, filled when in)
3. Wishlist page (/account/wishlist):
   - Grid of wishlist products
   - "Move to cart" button on each product
   - "Remove" button
   - Empty state

4. Add to wishlist functionality:
   - Toggle heart icon
   - Show toast notification
   - Update wishlist count in header
   - Persist across sessions

Use TypeScript, optimistic updates, smooth animations.
```

**Expected Output:**
- Wishlist endpoints
- Wishlist page
- Heart button component
- Toast notifications

### 10.3 Loyalty & Coins System

**Prompt:**
```
Create a loyalty and coins system with:

Backend (NestJS):
1. Coins calculation on order completion:
   - 1 coin per AED 10 spent
   - Bonus coins for first purchase (50 coins)
   - Bonus coins for product reviews (10 coins)

2. Coins wallet endpoints:
   - GET /wallet - Get user wallet with coin balance and transaction history
   - GET /wallet/transactions - List coin transactions (earned, spent, expired)
   - POST /wallet/redeem - Redeem coins (100 coins = AED 10 discount)

3. Loyalty tiers:
   - Silver (0-999 coins): Standard benefits
   - Gold (1000-4999 coins): 5% extra coins on purchases
   - Platinum (5000+ coins): 10% extra coins, early access to sales

Frontend (Next.js):
1. Wallet page (/account/wallet):
   - Coins balance (large number, prominent)
   - Loyalty tier badge (Silver/Gold/Platinum)
   - Progress bar to next tier
   - Transaction history (earned, spent, expired)
   - "How to earn more coins" section

2. Checkout coins redemption:
   - "Use coins" checkbox
   - Coins to use input (slider or input field)
   - Calculate discount (100 coins = AED 10)
   - Show remaining coins after purchase

3. Coins earned notification:
   - After order completion, show coins earned
   - Toast notification when earning coins from reviews

Use TypeScript, animations, gamification elements.
```

**Expected Output:**
- Coins calculation logic
- Wallet endpoints
- Wallet page UI
- Coins redemption on checkout

---

## 11. Performance Optimization

### 11.1 Supabase Storage & Image Optimization

**Prompt:**
```
Set up comprehensive image handling for AromaSouq using Supabase Storage:

1. Configure Supabase Storage integration in NestJS:
   - Install @supabase/supabase-js
   - Create StorageService with methods for upload, delete, get URL
   - Implement image upload with Sharp optimization
   - Generate multiple image sizes (thumbnail: 80px, small: 240px, medium: 480px, large: 800px)
   - Upload all sizes to Supabase Storage

2. Configure Next.js Image component:
   - Add Supabase URL to image domains
   - Use Supabase image transformations for on-the-fly resizing
   - Enable lazy loading by default
   - Add blur placeholder
   - Configure responsive sizes

3. Create ImageUpload component (frontend):
   - Drag & drop with react-dropzone
   - Multiple file selection (up to 10 images)
   - Client-side compression with browser-image-compression
   - File validation (JPEG, PNG, WebP only, max 10MB)
   - Upload progress indicator
   - Image preview before upload
   - Remove uploaded images

4. Image URL structure:
   - Original: https://[ref].supabase.co/storage/v1/object/public/products/[path]
   - Transformed: https://[ref].supabase.co/storage/v1/render/image/public/products/[path]?width=800&height=800&format=webp&quality=85

Provide complete code for StorageService, ImageUpload component, and Next.js configuration.
Use TypeScript, Tailwind CSS, proper error handling.
```

**Expected Output:**
```typescript
// Backend: storage.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import * as sharp from 'sharp';

@Injectable()
export class StorageService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
    );
  }

  async uploadProductImages(
    productId: string,
    files: Express.Multer.File[],
  ) {
    const uploadedImages = [];

    for (const file of files) {
      const timestamp = Date.now();
      const ext = file.originalname.split('.').pop();
      const fileName = `${productId}/${timestamp}.${ext}`;

      // Optimize and upload original
      const optimized = await sharp(file.buffer)
        .resize(2000, 2000, { fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 85 })
        .toBuffer();

      const { data, error } = await this.supabase.storage
        .from('products')
        .upload(fileName, optimized, {
          contentType: 'image/webp',
        });

      if (error) throw error;

      const { data: urlData } = this.supabase.storage
        .from('products')
        .getPublicUrl(fileName);

      uploadedImages.push({
        original: urlData.publicUrl,
        thumbnail: this.getTransformedUrl(fileName, 80, 80),
        small: this.getTransformedUrl(fileName, 240, 240),
        medium: this.getTransformedUrl(fileName, 480, 480),
        large: this.getTransformedUrl(fileName, 800, 800),
      });
    }

    return uploadedImages;
  }

  private getTransformedUrl(path: string, width: number, height: number) {
    return `${process.env.SUPABASE_URL}/storage/v1/render/image/public/products/${path}?width=${width}&height=${height}&format=webp&quality=85`;
  }
}

// Frontend: next.config.js
module.exports = {
  images: {
    domains: ['[your-project-ref].supabase.co'],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

// Frontend: ImageUpload.tsx (simplified)
'use client';
import { useDropzone } from 'react-dropzone';
import imageCompression from 'browser-image-compression';
import { useState } from 'react';

export default function ImageUpload({ productId }) {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);

  const onDrop = async (files) => {
    setUploading(true);
    const compressed = await Promise.all(
      files.map(f => imageCompression(f, {
        maxSizeMB: 2,
        maxWidthOrHeight: 2000,
      }))
    );

    const formData = new FormData();
    compressed.forEach(f => formData.append('images', f));

    const res = await fetch(`/api/products/${productId}/images`, {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    setImages([...images, ...data.images]);
    setUploading(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 10,
  });

  return (
    <div>
      <div {...getRootProps()} className="border-2 border-dashed p-8">
        <input {...getInputProps()} />
        <p>{isDragActive ? 'Drop here' : 'Drag & drop or click'}</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mt-4">
        {images.map((img, i) => (
          <img key={i} src={img.thumbnail} alt="" />
        ))}
      </div>
    </div>
  );
}
```

### 11.2 Database Query Optimization

**Prompt:**
```
Optimize Prisma queries for AromaSouq:

1. Product listing query optimization:
   - Add indexes on commonly filtered fields (category, brand, price, status)
   - Use cursor-based pagination instead of offset
   - Select only needed fields
   - Use findMany with proper includes to avoid N+1 queries

2. Order queries optimization:
   - Add composite indexes on (userId, status) and (vendorId, status)
   - Use transactions for order creation
   - Batch queries where possible

3. Implement caching:
   - Cache product list for 5 minutes (Redis)
   - Cache product details for 10 minutes
   - Cache category tree for 1 hour
   - Invalidate cache on updates

4. Add full-text search:
   - Configure PostgreSQL full-text search on product name and description
   - Create search index
   - Implement search query with ranking

Provide optimized query examples and caching setup.
```

**Expected Output:**
- Optimized Prisma queries
- Caching strategy with Redis
- Full-text search implementation

---

## 12. SEO & Analytics

### 12.1 SEO Optimization

**Prompt:**
```
Implement comprehensive SEO for AromaSouq:

1. Meta tags for all pages:
   - Dynamic title and description
   - Open Graph tags (for social media)
   - Twitter Card tags
   - Canonical URLs

2. Product page SEO:
   - Structured data (Product schema with price, availability, rating)
   - Proper heading hierarchy (H1 for product name)
   - Alt text for all images
   - Breadcrumbs with structured data

3. Generate sitemap.xml:
   - Include all public pages
   - Include product pages (with lastmod)
   - Include category pages
   - Update dynamically

4. robots.txt configuration:
   - Allow crawling of public pages
   - Disallow admin pages, checkout, account pages

5. Performance:
   - Server-side rendering for product pages
   - Static generation for category pages
   - Lazy loading for images

Provide code for meta tags, structured data, and sitemap generation.
```

**Expected Output:**
- SEO component for meta tags
- Structured data JSON-LD
- Sitemap generation script
- robots.txt

### 12.2 Analytics Integration

**Prompt:**
```
Integrate analytics for AromaSouq:

1. Google Analytics 4:
   - Set up GA4 tracking
   - Track page views
   - Track custom events:
     - product_view
     - add_to_cart
     - begin_checkout
     - purchase
     - search
   - E-commerce tracking with items

2. Admin analytics dashboard:
   - Daily sales chart (7 days, 30 days, 90 days)
   - Top products by revenue
   - Top products by quantity
   - Conversion funnel (views → add to cart → checkout → purchase)
   - Average order value
   - Revenue by category

3. Vendor analytics:
   - Sales chart for vendor
   - Top products
   - Order statistics
   - Customer insights (new vs returning)

Use Chart.js or Recharts for visualizations.
Provide setup code and dashboard components.
```

**Expected Output:**
- GA4 integration
- Event tracking
- Analytics dashboard
- Charts and visualizations

---

## 13. Testing

### 13.1 Unit Testing

**Prompt:**
```
Create unit tests for AromaSouq:

1. Backend (NestJS with Jest):
   - Test AuthService methods (register, login, validateUser)
   - Test ProductsService methods (create, update, list, filter)
   - Test OrdersService methods (create, calculate totals)
   - Mock Prisma client
   - Test validation and error handling

2. Frontend (Next.js with Jest + React Testing Library):
   - Test ProductCard component (renders correctly, add to cart)
   - Test CartDrawer component (displays items, updates quantity)
   - Test LoginForm (validation, submission)
   - Mock API calls

Provide test files with examples.
Target 80% code coverage.
```

**Expected Output:**
- Unit tests for services
- Component tests
- Mocked dependencies
- Test coverage reports

### 13.2 E2E Testing

**Prompt:**
```
Create end-to-end tests for AromaSouq using Playwright:

Test scenarios:
1. User registration and login
2. Browse products and filter
3. View product details
4. Add product to cart
5. Complete checkout flow (with test payment)
6. Vendor login and create product
7. Admin login and approve vendor

For each scenario:
- Write test in TypeScript
- Use page object pattern
- Add assertions at each step
- Handle authentication
- Take screenshots on failure

Provide test setup and example tests.
```

**Expected Output:**
- Playwright configuration
- E2E test scenarios
- Page objects
- Test utilities

---

## 14. Deployment

### 14.1 Production Deployment

**Prompt:**
```
Create deployment configurations for AromaSouq:

1. Frontend (Vercel):
   - vercel.json configuration
   - Environment variables setup
   - Build settings
   - Custom domains configuration

2. Backend (Railway/Render):
   - Dockerfile for NestJS
   - docker-compose.yml for production
   - Environment variables
   - Health check endpoint
   - Database migrations on deploy

3. CI/CD (GitHub Actions):
   - .github/workflows/ci.yml:
     - Lint and type check
     - Run tests
     - Build application
     - Deploy to staging on develop branch
     - Deploy to production on main branch (manual approval)

4. Monitoring:
   - Sentry setup for error tracking
   - Logging configuration
   - Uptime monitoring

Provide all configuration files.
```

**Expected Output:**
- Deployment configs
- Dockerfiles
- CI/CD workflows
- Monitoring setup

---

## 15. Quick Start Commands

### 15.1 Development Workflow

**Daily Development:**
```bash
# Frontend
cd aromasouq-web
pnpm dev

# Backend
cd aromasouq-api
pnpm start:dev

# Database GUI
npx prisma studio

# Run tests
pnpm test
pnpm test:e2e
```

**Using Claude Code:**
```bash
# Example: Generate a new component
claude-code "Create a ProductFilter component with category and price range filters using React Hook Form and Tailwind CSS"

# Example: Generate API endpoint
claude-code "Create a GET /products/featured endpoint that returns top 8 featured products"

# Example: Fix a bug
claude-code "Fix the cart total calculation in cart.service.ts - it's not including tax correctly"

# Example: Write tests
claude-code "Generate unit tests for the ProductsService with 80% coverage"

# Example: Optimize performance
claude-code "Optimize the product list query to reduce load time - currently taking 2 seconds"
```

---

## 16. Troubleshooting with Claude Code

### 16.1 Common Issues & Prompts

**Issue: Slow Database Queries**
```
Analyze and optimize this Prisma query:
[paste query]

The query is taking 3+ seconds. Add appropriate indexes and optimize the query structure. Consider pagination and selective field loading.
```

**Issue: Type Errors**
```
Fix these TypeScript errors in [file path]:
[paste errors]

Ensure strict type safety and proper interfaces.
```

**Issue: Authentication Not Working**
```
Debug the JWT authentication in auth.service.ts and jwt.strategy.ts. 
Users are getting "Unauthorized" errors when accessing protected routes.
Review token generation, validation, and guard implementation.
```

**Issue: UI Not Responsive**
```
Make this component responsive for mobile, tablet, and desktop:
[paste component code]

Use Tailwind CSS responsive utilities. Ensure touch-friendly on mobile (44px minimum).
```

---

## 17. Best Practices Checklist

### 17.1 Before Committing Code

- [ ] Code reviewed and understood
- [ ] Tests written and passing
- [ ] TypeScript errors resolved
- [ ] ESLint warnings fixed
- [ ] Console.logs removed
- [ ] Comments added for complex logic
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design tested
- [ ] Accessibility checked

### 17.2 Before Deploying

- [ ] All tests passing (unit, integration, E2E)
- [ ] Environment variables configured
- [ ] Database migrations ready
- [ ] Error tracking active (Sentry)
- [ ] Analytics tracking verified
- [ ] Performance tested (Lighthouse 85+)
- [ ] SEO verified (meta tags, sitemap)
- [ ] Security audit passed
- [ ] Backup strategy in place
- [ ] Monitoring dashboards set up

---

## 18. Resources & References

### 18.1 Official Documentation

- **Next.js:** https://nextjs.org/docs
- **NestJS:** https://docs.nestjs.com
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

### 18.2 Claude Code Documentation

- Check official Claude Code documentation for:
  - Latest installation instructions
  - Available commands
  - Best practices
  - Advanced features

---

## 19. Summary

### 19.1 Development Process

1. **Start with Backend:** Database → API → Business Logic
2. **Build Frontend:** UI Components → Pages → Integration
3. **Test Thoroughly:** Unit → Integration → E2E
4. **Optimize:** Performance → SEO → Security
5. **Deploy:** Staging → Production

### 19.2 Using Claude Code Effectively

**Key Principles:**
- Be specific in your prompts
- Provide context (requirements, tech stack, existing code)
- Iterate and refine
- Review and understand generated code
- Test everything
- Use version control

**Example Workflow:**
```
1. Write a specific prompt
2. Review generated code
3. Test the code
4. Identify issues
5. Refine prompt or manually fix
6. Commit to Git
7. Move to next task
```

---

**Document Status:** ✅ Complete  
**Ready to Build:** YES!  

**Next Steps:**
1. Set up your development environment
2. Start with Week 1 tasks from the Implementation Roadmap
3. Use Claude Code for accelerated development
4. Review, test, and iterate
5. Ship AromaSouq! 🚀

---

**Pro Tip:** Keep this guide handy and refer to specific sections as you progress through development. Combine it with the other documentation files for a comprehensive development experience.

**Happy Coding! 🎉**
