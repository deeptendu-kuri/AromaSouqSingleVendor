# AromaSouq - Architecture & System Diagrams

**Generated:** November 7, 2025  
**Project:** AromaSouq Luxury Fragrance Marketplace

---

## High-Level System Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          END USERS                                   │
│         (Customers, Vendors, Admins)                                │
└──────────────────────┬──────────────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      FRONTEND TIER                                    │
│                    (Next.js 16 / React 19)                           │
│                  Port: http://localhost:3000                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─ Pages/Routes ──────────────────────────────────────────────┐   │
│  │ /(auth)      → login, register                             │   │
│  │ /(customer)  → account, orders, cart, checkout             │   │
│  │ /(vendor)    → dashboard, products, orders, analytics      │   │
│  │ /(admin)     → dashboard, users, vendors, orders           │   │
│  │ /products    → listing, detail, compare                    │   │
│  │ /categories  → browse, filter                              │   │
│  │ /brands      → listing                                     │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─ Components (50+) ──────────────────────────────────────────┐   │
│  │ UI: Radix + Tailwind (Button, Input, Dialog, etc)         │   │
│  │ Features: ProductCard, ReviewForm, AddressForm             │   │
│  │ Layout: Header, Footer, Sidebar, Navigation               │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─ State Management ──────────────────────────────────────────┐   │
│  │ Zustand Stores: auth, cart, product, order, coupon, etc   │   │
│  │ React Query: Server state caching, sync                    │   │
│  │ React Context: Providers (Auth, Theme, Query)             │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
│  ┌─ Utilities ─────────────────────────────────────────────────┐   │
│  │ axios (HTTP client) → API calls with interceptors          │   │
│  │ React Hook Form → Form state                               │   │
│  │ Zod → Schema validation                                    │   │
│  │ Framer Motion → Animations                                 │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                       │
└───────────────────┬──────────────────────────────────────────────────┘
                    │
         HTTP/REST APIs (JSON)
                    │
                    ▼
┌──────────────────────────────────────────────────────────────────────┐
│                      BACKEND TIER                                     │
│                   (NestJS / TypeScript)                               │
│              Port: http://localhost:3001/api                         │
├──────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌─ Controllers (16) ───────────────────────────────────────────┐  │
│  │ auth/               → register, login, profile              │  │
│  │ products/           → CRUD, filters, variants               │  │
│  │ categories/         → list, hierarchy                       │  │
│  │ brands/             → CRUD                                  │  │
│  │ cart/               → add, remove, update                   │  │
│  │ orders/             → create, track, status                 │  │
│  │ reviews/            → CRUD, voting                          │  │
│  │ wishlist/           → add, remove, list                     │  │
│  │ addresses/          → CRUD, set default                     │  │
│  │ coupons/            → list, validate, create                │  │
│  │ uploads/            → file upload/delete                    │  │
│  │ vendor/             → dashboard, stats, products            │  │
│  │ admin/              → stats, user management                │  │
│  │ checkout/           → payment processing                    │  │
│  │ users/              → profile, CRUD                         │  │
│  │ app/                → health check                          │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─ Services (18) ──────────────────────────────────────────────┐  │
│  │ auth.service         → JWT, password hashing, token gen    │  │
│  │ products.service     → CRUD, filters, stock mgmt           │  │
│  │ orders.service       → workflow, status, totals            │  │
│  │ checkout.service     → tax, shipping, coin calc            │  │
│  │ invoice.service      → PDF generation                       │  │
│  │ cart.service         → item mgmt, validation               │  │
│  │ reviews.service      → CRUD, voting, images                │  │
│  │ uploads.service      → Supabase integration                │  │
│  │ vendor.service       → vendor CRUD, stats                  │  │
│  │ admin.service        → analytics, approval                 │  │
│  │ ... and 8 more        → (users, categories, addresses, etc)│  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─ Authentication ─────────────────────────────────────────────┐  │
│  │ JWT Strategy       → Token validation, payload extract     │  │
│  │ JWT Guard         → Route protection                        │  │
│  │ Roles Guard       → RBAC (CUSTOMER, VENDOR, ADMIN)         │  │
│  │ Decorators        → @CurrentUser, @Roles, @Public         │  │
│  │ Passport          → Authentication framework               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─ DTOs & Validation ──────────────────────────────────────────┐  │
│  │ class-validator    → Input validation                       │  │
│  │ class-transformer → Data transformation                     │  │
│  │ Custom DTOs       → Each module (Create/Update/Response)   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  ┌─ Configuration ──────────────────────────────────────────────┐  │
│  │ ConfigModule       → Environment variables                  │  │
│  │ .env file          → Database URL, JWT secret, API keys    │  │
│  │ CORS               → Configured for frontend               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                       │
└───────────────┬──────────────────────────────────────────────────────┘
                │
         SQL Queries
                │
    ┌───────────┴────────────┐
    │                        │
    ▼                        ▼
┌─────────────┐      ┌────────────────────────────┐
│   Prisma    │      │   Supabase Storage (4)    │
│    ORM      │      ├────────────────────────────┤
├─────────────┤      │ products   → Product img  │
│ 22 Models   │      │ brands     → Logo/banner  │
│ 40+ Rels    │      │ users      → Avatars      │
│ 10 Enums    │      │ documents  → Trade license│
│ 2 Migrations│      └────────────────────────────┘
└──────┬──────┘
       │
       ▼
┌──────────────────────────────────────────────────┐
│        DATABASE TIER                             │
│    Supabase PostgreSQL                          │
│   (Cloud-hosted, managed)                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  Tables (22):                                  │
│  ├─ users          │ vendors      │ categories │
│  ├─ products       │ brands       │ carts      │
│  ├─ orders         │ order_items  │ reviews    │
│  ├─ addresses      │ wallets      │ coupons    │
│  ├─ wishlist_items │ cart_items   │ variants   │
│  ├─ coin_tx        │ review_imgs  │ review_votes
│  └─ product_videos                            │
│                                                  │
│  Primary Keys: UUID                             │
│  Relationships: Foreign keys with cascades     │
│  Indexes: On frequently queried columns        │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### User Authentication Flow

```
┌─────────────────┐
│   User Submits  │
│  Login Credentials│
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Frontend (Login Page)               │
│  1. React Hook Form captures input  │
│  2. Zod validates schema            │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  POST /api/auth/login (Axios)       │
│  Body: { email, password }          │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Backend (AuthController)            │
│  Receives request                   │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  AuthService                        │
│  1. Query DB for user by email      │
│  2. bcrypt.compare(pwd, hash)       │
│  3. If valid → jwt.sign(user)       │
│  4. If invalid → throw 401          │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Prisma (Database Query)            │
│  SELECT * FROM users WHERE email=.. │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Supabase PostgreSQL                │
│  Returns user record (if exists)    │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Password Verification (bcrypt)     │
│  Hash provided password              │
│  Compare with stored hash           │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  JWT Token Generation               │
│  Payload: { id, email, role }       │
│  Expires: 7 days                    │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Response to Frontend               │
│  { user, token }                    │
│  Status: 200 OK                     │
└─────────┬──────────────────────────┘
          │
          ▼
┌──────────────────────────────────────┐
│  Frontend (Zustand authStore)       │
│  1. Store token in state            │
│  2. localStorage.setItem('token')   │
│  3. Redirect to /account            │
│  4. Set Authorization header        │
└──────────────────────────────────────┘
```

### Product Purchase Flow

```
┌──────────────────────────────────────┐
│  User Browsing Products             │
│  GET /api/products (list, filter)   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  ProductCard Component               │
│  Display: name, price, image, rating│
│  Button: "Add to Cart"              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Click "Add to Cart"                │
│  useCart hook triggered             │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Frontend Cart State (Zustand)      │
│  cartStore.addItem({product, qty})  │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  POST /api/cart/items               │
│  Body: { productId, quantity }      │
│  Header: Authorization: Bearer JWT  │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Backend (CartController)           │
│  JWT Guard validates token          │
│  Extract user from token            │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  CartService                        │
│  1. Get user's cart                 │
│  2. Check product exists            │
│  3. Check stock available           │
│  4. Add/update cart item            │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Prisma Database Operations         │
│  INSERT/UPDATE cart_items           │
│  Check products table for stock     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Response: 200 + updated cart       │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Frontend (React Query)              │
│  Invalidate cart query               │
│  Refetch cart data                  │
│  Update cartStore                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  User Proceeds to Checkout          │
│  Review cart                        │
│  Enter delivery address             │
│  Apply coupon                       │
│  Choose payment method              │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  POST /api/orders                   │
│  Body: {                            │
│    items, addressId, paymentMethod, │
│    couponCode                       │
│  }                                  │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  OrderService                       │
│  1. Validate address                │
│  2. Validate coupon (if provided)   │
│  3. Calculate: subtotal, tax, ship  │
│  4. Apply discount                  │
│  5. Calculate coins earned          │
│  6. Create order in DB              │
│  7. Reduce product stock            │
│  8. Clear cart                      │
│  9. Credit coins to wallet          │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Database Transactions              │
│  INSERT orders                      │
│  INSERT order_items                 │
│  UPDATE products (stock)            │
│  DELETE cart_items                  │
│  INSERT coin_transactions           │
│  UPDATE wallets (balance)           │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Response: Order Details            │
│  Order number, status, total        │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Frontend                           │
│  Redirect to /order-success/:id     │
│  Display confirmation               │
│  Invoice available                  │
└──────────────────────────────────────┘
```

### File Upload Flow

```
┌──────────────────────────────────┐
│  User Selects File               │
│  (Product image, avatar, doc)    │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Frontend                                │
│  FormData with file                     │
│  POST /api/uploads                      │
│  With proper Authorization              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Backend (UploadsController)            │
│  JWT Guard validates                    │
│  Extract user, get file type            │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  UploadsService                         │
│  1. Validate file type/size             │
│  2. Determine bucket (products, users..)│
│  3. Generate unique filename            │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  SupabaseService                        │
│  client.storage.from(bucket)            │
│  .upload(path, file, options)           │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Supabase Storage                       │
│  File stored in appropriate bucket      │
│  CDN URL generated                      │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Response to Backend                    │
│  { publicUrl, path, bucket }            │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Backend Response                       │
│  Return file metadata                   │
│  { url, bucket, filename }              │
└────────┬─────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│  Frontend                               │
│  Display uploaded file                 │
│  Store URL in state                    │
│  Use in form submission                │
└──────────────────────────────────────────┘
```

---

## Database Relationship Diagram

```
                              ┌─────────┐
                              │ USERS   │
                              │         │
                    ┌─────────┤ id (PK) │
                    │         │ email   │
                    │         │ role    │
                    │         │ coins   │
                    │         └────┬────┘
                    │              │
        ┌───────────┼──────────────┼───────────────┐
        │           │              │               │
        ▼           ▼              ▼               ▼
   ┌────────┐ ┌───────────┐ ┌─────────┐ ┌──────────────┐
   │VENDORS │ │ADDRESSES  │ │  CART   │ │  WALLETS     │
   │        │ │           │ │         │ │              │
   │userId←┼─┤ userId←───┤ │userId←──┤ │userId←───────┤
   │        │ │           │ │         │ │              │
   └────┬───┘ └───────────┘ └────┬────┘ └──────┬───────┘
        │                         │             │
        │                     ┌───▼────┐        │
        │                     │ CART   │        │
        │                     │ ITEMS  │        │
        │                     │        │        │
        │                 ┌───┤product │        │
        │                 │   └────────┘        │
        │                 │                 ┌───▼────────┐
        │                 │                 │COIN        │
        │                 │                 │TRANSACT    │
        │                 │                 └────────────┘
        │
    ┌───▼────────────┐
    │   PRODUCTS     │
    │                │
    │ id (PK)        │
    │ vendorId←──────┼─ Vendor relationship
    │ categoryId←    │
    │ brandId←       │
    │ price          │
    │ stock          │
    │ images[]       │
    │ variants[]     │
    └───┬────────────┘
        │
   ┌────┴────────────────────────────────┐
   │                                     │
   ▼                                     ▼
┌──────────────┐              ┌──────────────────┐
│ CATEGORIES   │              │  PRODUCT         │
│              │              │  VARIANTS        │
│ id (PK)      │              │                  │
│ parentId←    │              │  productId←──────┤
│ (hierarchy)  │              │  price           │
└──────────────┘              │  stock           │
                              └──────────────────┘
                                     │
   ┌────────────────────┐           │
   │                    ▼           ▼
   │            ┌────────────┐  ┌─────────────┐
   │            │CART ITEMS  │  │PRODUCT      │
   │            │            │  │VIDEOS       │
   │        ┌───┤variantId←──┤  │             │
   │        │   └────────────┘  └─────────────┘
   │        │
   │    ┌───▼────────────┐
   │    │WISHLISTS       │
   │    │                │
   └────┤productId←──────┤
        │ userId←────────┼─── Relationship to USERS
        └────────────────┘
        
        ┌──────────────┐
        │   ORDERS     │
        │              │
        │ id (PK)      │
        │ userId←──────┼─── Customer
        │ addressId←───┼─── Delivery address
        │ couponId←    │
        │ status       │
        │ paymentMeth  │
        │ total        │
        │ coinsUsed    │
        └───┬──────────┘
            │
            ▼
        ┌──────────────┐
        │ ORDER ITEMS  │
        │              │
        │ orderId←─────┤
        │ productId←───┤
        │ quantity     │
        │ price        │
        └──────────────┘

        ┌──────────────┐
        │  REVIEWS     │
        │              │
        │ userId←──────┼─── Reviewer
        │ productId←───┤
        │ rating       │
        │ comment      │
        │ images[]     │
        └───┬──────────┘
            │
        ┌───▼──────────────┐
        │ REVIEW VOTES     │
        │                  │
        │ reviewId←────────┤
        │ userId←──────────┤
        │ voteType         │
        └──────────────────┘

        ┌──────────────┐
        │  COUPONS     │
        │              │
        │ vendorId←────┼─── Created by vendor
        └──────────────┘
```

---

## Authentication & Authorization Flow

```
┌─────────────────────────────────────────┐
│  Frontend API Request                   │
│  axios.defaults.headers.common[        │
│    'Authorization'                      │
│  ] = `Bearer ${token}`                  │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Backend Receives Request               │
│  POST /api/products                     │
│  Header: Authorization: Bearer eyJ...   │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  JWT Guard (@UseGuards)                │
│  Extract token from header              │
│  Parse & verify JWT signature           │
└────────┬────────────────────────────────┘
         │
         ├─ Valid?  ──────→ Continue
         │
         └─ Invalid? ──────→ 401 Unauthorized
         
         │
         ▼
┌─────────────────────────────────────────┐
│  JWT Strategy (Passport)                │
│  Verify expiry (7 days)                 │
│  Extract payload { id, email, role }   │
│  Load user from database                │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  @CurrentUser() Decorator               │
│  Inject user object into handler        │
│  Handler receives authenticated user    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  @Roles() Guard (Optional)              │
│  Check user.role vs required roles      │
│  ADMIN, VENDOR, CUSTOMER                │
└────────┬────────────────────────────────┘
         │
         ├─ Has role?  ──────→ Execute handler
         │
         └─ No role? ────────→ 403 Forbidden
         
         │
         ▼
┌─────────────────────────────────────────┐
│  Controller Handler                     │
│  Execute business logic                 │
│  Access @CurrentUser()                  │
│  Call service method                    │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Service Layer                          │
│  Database queries                       │
│  Business logic                         │
└────────┬────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│  Response                               │
│  200 OK + data                          │
│  Or error response                      │
└─────────────────────────────────────────┘
```

---

## Module Dependency Graph

```
┌─────────────────────────────────────┐
│         APP MODULE (Root)           │
│  - Imports all 18 modules           │
│  - Global ConfigModule              │
│  - Provides AppController           │
└────────┬────────────────────────────┘
         │
   ┌─────┴──────────────────────────────────────────────┐
   │                                                     │
   ▼ Imports                                            ▼
┌─────────────┐                              ┌─────────────┐
│ConfigModule │                              │PrismaModule │
│(Environment)│                              │(Database)   │
└─────────────┘                              └─────────────┘
                                                     │
                                    ┌────────────────┼─────────────────┐
                                    │                │                 │
                        ┌───────────▼────┐  ┌───────▼────┐   ┌────────▼────┐
                        │ Auth Module    │  │Product Mod │   │Category Mod │
                        │ - Controllers  │  │ - Services │   │ - Brands    │
                        │ - Services     │  │ - Routes   │   │ - Controls  │
                        │ - Guards       │  └────────────┘   └─────────────┘
                        │ - Strategies   │
                        └───────┬────────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
            ┌───────▼─────┐  ┌──▼──────┐  ┌▼────────┐
            │Users Module │  │Cart Mod │  │Orders   │
            │  - CRUD     │  │  Items  │  │Module   │
            └─────────────┘  └─────────┘  ├─────────┤
                                          │Invoice  │
                                          │Service  │
                                          └─────────┘
                    │
         ┌──────────┼──────────┬──────────┬──────────┐
         │          │          │          │          │
   ┌─────▼──┐ ┌────▼───┐ ┌───▼────┐ ┌──▼───┐ ┌────▼────┐
   │Wishlist│ │Reviews │ │Addresses│ │Coupon│ │Uploads  │
   │Module  │ │Module  │ │Module   │ │Module│ │Module   │
   └────────┘ └────────┘ └─────────┘ └──────┘ └────┬────┘
                                                    │
                                            ┌───────▼────────┐
                                            │Supabase Module │
                                            │ - Storage      │
                                            │ - Client init  │
                                            └────────────────┘
   
   ┌─────────┐      ┌─────────────┐
   │Vendor   │      │Admin Module │
   │Module   │      │ - Analytics │
   └─────────┘      │ - Dashboard │
                    └─────────────┘

   ┌──────────────┐
   │Checkout      │
   │Module        │
   │(Tax, Ship)   │
   └──────────────┘
```

---

## Component Architecture (Frontend)

```
┌──────────────────────────────────────────┐
│          ROOT LAYOUT (layout.tsx)        │
│  - Providers (Auth, Query, Theme)        │
│  - Global styles                        │
│  - Meta tags                            │
└────────┬─────────────────────────────────┘
         │
    ┌────┴────────────────────────────────┐
    │                                     │
    ▼                                     ▼
┌──────────────┐              ┌──────────────────┐
│  AUTH GROUP  │              │ CUSTOMER GROUP   │
│/(auth)       │              │/(customer)       │
├──────────────┤              ├──────────────────┤
│- Login       │              │- Account         │
│- Register    │              │- Orders          │
│- Forgot PWD  │              │- Wishlist        │
└──────────────┘              │- Cart            │
                              │- Checkout       │
    
    ┌─────────────────────┐
    │
    ▼
┌──────────────┐
│  VENDOR GROUP│
│/(vendor)     │
├──────────────┤
│- Dashboard   │
│- Products    │
│- Orders      │
│- Analytics   │
└──────────────┘

    ┌─────────────────────┐
    │
    ▼
┌──────────────┐
│  ADMIN GROUP │
│/(admin)      │
├──────────────┤
│- Dashboard   │
│- Users       │
│- Vendors     │
│- Orders      │
│- Analytics   │
└──────────────┘

┌──────────────────────────────────────────┐
│      PUBLIC PAGES (Top-level)            │
├──────────────────────────────────────────┤
│ /products       → ProductList + Filter  │
│ /products/:id   → ProductDetail         │
│ /categories     → CategoryBrowse        │
│ /brands         → BrandListing          │
│ /compare        → ProductComparison     │
│ /order-success  → ConfirmationPage     │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│        COMPONENT HIERARCHY               │
├──────────────────────────────────────────┤
│                                          │
│  ┌─ Layout Components                   │
│  │  ├─ Header                          │
│  │  │  ├─ SearchBar                    │
│  │  │  ├─ Navigation                   │
│  │  │  └─ UserMenu                     │
│  │  ├─ Sidebar                         │
│  │  │  └─ CategoryFilter               │
│  │  └─ Footer                          │
│  │                                      │
│  ┌─ Feature Components                  │
│  │  ├─ ProductCard                     │
│  │  ├─ ProductFilter                   │
│  │  ├─ ProductGallery                  │
│  │  ├─ ReviewForm                      │
│  │  ├─ ReviewList                      │
│  │  ├─ CartSummary                     │
│  │  ├─ AddressForm                     │
│  │  └─ CheckoutForm                    │
│  │                                      │
│  ┌─ UI Components (Radix + Tailwind)   │
│  │  ├─ Button                          │
│  │  ├─ Input                           │
│  │  ├─ Select                          │
│  │  ├─ Dialog/Modal                    │
│  │  ├─ Form                            │
│  │  ├─ Card                            │
│  │  ├─ Table                           │
│  │  ├─ Toast/Alert                     │
│  │  └─ (40+ total)                     │
│  │                                      │
│  └─ Provider Components                │
│     ├─ AuthProvider                    │
│     ├─ QueryClientProvider             │
│     ├─ ThemeProvider                   │
│     └─ ToastProvider                   │
│                                          │
└──────────────────────────────────────────┘
```

---

## State Management Architecture

```
┌────────────────────────────────────────────────┐
│        ZUSTAND STORES (Global State)           │
├────────────────────────────────────────────────┤
│                                                │
│  authStore                                    │
│  ├─ user (id, email, role, avatar)           │
│  ├─ token (JWT)                              │
│  ├─ login() → Set user + token               │
│  ├─ logout() → Clear user + token            │
│  └─ register() → Create user                 │
│                                                │
│  cartStore                                    │
│  ├─ items[] (product, qty, variant)          │
│  ├─ addItem()                                │
│  ├─ removeItem()                             │
│  ├─ updateQuantity()                         │
│  ├─ clearCart()                              │
│  └─ getTotals()                              │
│                                                │
│  productStore                                 │
│  ├─ filters (category, brand, price range)   │
│  ├─ sort (price, rating, newest)             │
│  ├─ searchQuery                              │
│  └─ setters for each                         │
│                                                │
│  couponStore                                  │
│  ├─ appliedCoupon                            │
│  ├─ discountAmount                           │
│  ├─ applyCoupon()                            │
│  └─ removeCoupon()                           │
│                                                │
│  orderStore                                   │
│  ├─ currentOrder                             │
│  ├─ orders[]                                 │
│  └─ setOrder()                               │
│                                                │
│  + 3 more (review, user, common states)      │
│                                                │
└────────────────────────────────────────────────┘
          │
          │ (Persistent in localStorage)
          │
          ▼
┌────────────────────────────────────────────────┐
│    REACT QUERY (Server State)                  │
├────────────────────────────────────────────────┤
│                                                │
│  useQuery (Fetch)                             │
│  ├─ useProducts() → GET /api/products         │
│  ├─ useProduct(id) → GET /api/products/:id    │
│  ├─ useOrders() → GET /api/orders             │
│  ├─ useReviews(id) → GET /api/products/../   │
│  └─ (all GET requests)                        │
│                                                │
│  useMutation (Create/Update/Delete)           │
│  ├─ useAddToCart() → POST /api/cart           │
│  ├─ useCreateOrder() → POST /api/orders       │
│  ├─ useCreateReview() → POST /api/reviews     │
│  └─ (all POST/PUT/DELETE requests)            │
│                                                │
│  Features:                                     │
│  ├─ Auto caching (5 min stale time)           │
│  ├─ Background sync                          │
│  ├─ Auto retry (3 attempts)                   │
│  ├─ Loading/error states                      │
│  └─ Optimistic updates                        │
│                                                │
└────────────────────────────────────────────────┘
          │
          │ (Network requests)
          │
          ▼
┌────────────────────────────────────────────────┐
│      AXIOS (HTTP CLIENT)                       │
├────────────────────────────────────────────────┤
│                                                │
│  Configuration:                               │
│  ├─ Base URL: http://localhost:3001/api       │
│  ├─ Headers: Content-Type: application/json   │
│  ├─ Interceptors:                             │
│  │  ├─ Request: Add Authorization header      │
│  │  └─ Response: Handle errors                │
│  └─ Timeout: 10 seconds                       │
│                                                │
└────────────────────────────────────────────────┘
          │
          ▼
┌────────────────────────────────────────────────┐
│      BACKEND API (NestJS)                      │
└────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Conceptual)

```
┌──────────────────────────────────────────────────┐
│            DEPLOYMENT ENVIRONMENT               │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │     Frontend Deployment (Vercel/Build)  │   │
│  │  - Next.js static export               │   │
│  │  - CDN + Edge caching                  │   │
│  │  - Environment: NEXT_PUBLIC_*           │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │    Backend Deployment (Server/Docker)   │   │
│  │  - NestJS compiled (dist/)              │   │
│  │  - Node.js runtime                      │   │
│  │  - Environment: .env                    │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │    Database (Supabase Cloud)            │   │
│  │  - PostgreSQL managed                   │   │
│  │  - Automatic backups                    │   │
│  │  - Scaling included                     │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
│  ┌─────────────────────────────────────────┐   │
│  │    File Storage (Supabase Storage)      │   │
│  │  - CDN-backed                           │   │
│  │  - S3-compatible API                    │   │
│  │  - 4 buckets (products, brands, etc)    │   │
│  └─────────────────────────────────────────┘   │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## Security Architecture

```
┌────────────────────────────────────────────────┐
│         SECURITY LAYERS                        │
├────────────────────────────────────────────────┤
│                                                │
│  Layer 1: Transport Security                  │
│  ├─ HTTPS/TLS (production)                   │
│  ├─ Origin validation                        │
│  └─ CORS configured                          │
│                                                │
│  Layer 2: Authentication                      │
│  ├─ Password hashing (bcrypt)                │
│  ├─ JWT tokens (7-day expiry)                │
│  ├─ Secure storage (httpOnly cookies)        │
│  └─ Token rotation                           │
│                                                │
│  Layer 3: Authorization                       │
│  ├─ Role-based access control (RBAC)         │
│  ├─ Guards (@UseGuards, @Roles)              │
│  ├─ User context validation                  │
│  └─ Resource ownership checks                │
│                                                │
│  Layer 4: Input Validation                    │
│  ├─ DTO validation (class-validator)         │
│  ├─ Zod schema validation (frontend)         │
│  ├─ Type safety (TypeScript)                 │
│  └─ SQL injection prevention (Prisma)        │
│                                                │
│  Layer 5: Data Protection                     │
│  ├─ Password encryption                      │
│  ├─ Sensitive field exclusion                │
│  ├─ Rate limiting (prepared)                 │
│  └─ Audit logging (prepared)                 │
│                                                │
└────────────────────────────────────────────────┘
```

---

**Architecture Generated:** November 7, 2025  
**Diagrams Status:** Complete  
**Ready for:** Development & Deployment
