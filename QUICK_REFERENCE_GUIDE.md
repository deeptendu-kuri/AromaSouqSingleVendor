# AromaSouq - Quick Reference Guide

## Project Overview

**Full Stack:** Next.js 15 Frontend + NestJS Backend + Supabase PostgreSQL  
**Purpose:** Luxury Fragrance E-commerce Marketplace for UAE  
**Status:** MVP Ready - Development Phase

---

## Directory Quick Map

```
AromaSouq/
├── aromasouq-api/              ← NestJS Backend (Port 3001)
│   ├── src/                    ← Source code
│   │   ├── auth/               ← JWT authentication
│   │   ├── products/           ← Product management
│   │   ├── orders/             ← Order processing
│   │   ├── users/              ← User management
│   │   ├── cart/               ← Shopping cart
│   │   ├── vendor/             ← Vendor features
│   │   ├── admin/              ← Admin dashboard
│   │   └── ...14 more modules
│   ├── prisma/                 ← Database schema
│   │   ├── schema.prisma       ← ALL database models
│   │   ├── migrations/         ← Database migrations
│   │   └── seed.ts             ← Test data
│   └── .env                    ← Backend secrets
│
├── aromasouq-web/              ← Next.js Frontend (Port 3000)
│   ├── src/
│   │   ├── app/                ← Pages & routes
│   │   │   ├── (auth)/         ← Login, Register
│   │   │   ├── (customer)/     ← Customer pages
│   │   │   ├── (vendor)/       ← Vendor pages
│   │   │   ├── (admin)/        ← Admin pages
│   │   │   └── products/       ← Product pages
│   │   ├── components/         ← 50+ React components
│   │   ├── hooks/              ← 15+ custom hooks
│   │   ├── stores/             ← Zustand state
│   │   ├── lib/                ← Utilities
│   │   └── types/              ← TypeScript types
│   └── .env.local              ← Frontend secrets
│
├── CODEBASE_STRUCTURE_OVERVIEW.md  ← FULL documentation (read this!)
├── QUICK_REFERENCE_GUIDE.md        ← This file
├── SETUP-GUIDE-COMPLETE.md         ← Setup instructions
└── docs/                        ← 350+ pages of docs
```

---

## Technology Stack Summary

### Backend Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | NestJS | 11.0.1 |
| Language | TypeScript | 5.7.3 |
| Database | Supabase PostgreSQL | Latest |
| ORM | Prisma | 6.18.0 |
| Auth | JWT + Passport | 4.0.1 |
| Password | bcrypt | 6.0.0 |
| File Storage | Supabase Storage | - |
| PDF Generation | PDFKit | 0.15.2 |

### Frontend Stack
| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | Next.js | 16.0.0 |
| Language | TypeScript | 5 |
| React | React | 19.2.0 |
| HTTP Client | Axios | 1.12.2 |
| State (App) | Zustand | 5.0.8 |
| State (Server) | TanStack Query | 5.90.5 |
| Forms | React Hook Form | 7.65.0 |
| Validation | Zod | 4.1.12 |
| UI Framework | Radix UI | Latest |
| Styling | Tailwind CSS | 4 |
| Animations | Framer Motion | 12.23.24 |
| Icons | Lucide React | 0.548.0 |

---

## Database at a Glance

### User Types (Enum: UserRole)
- `CUSTOMER` - Regular buyers
- `VENDOR` - Sellers
- `ADMIN` - Platform admins

### Core Models (22 Total)
```
Users → Vendors → Products → Categories/Brands
 ↓         ↓          ↓
Addresses Orders  Variants/Videos
 ↓         ↓          ↓
Wallets OrderItems Reviews/Wishlist
```

### Key Data
- **Products:** Name, price, SKU, stock, images, rating
- **Orders:** OrderNumber, status, paymentMethod, total
- **Users:** Email, password, role, coinsBalance, addresses
- **Vendors:** BusinessName, logo, status (PENDING/APPROVED/SUSPENDED)
- **Categories:** Hierarchical (parent-child relationships)
- **Reviews:** Rating, comment, images, helpful votes
- **Coupons:** Code, discountType (PERCENTAGE/FIXED), usageLimit
- **Wallets:** balance, lifetimeEarned, lifetimeSpent

---

## API Endpoints Quick Reference

### Authentication (Base: `/api/auth`)
```
POST   /auth/register          Create new user
POST   /auth/login             Get JWT token
GET    /auth/profile           Current user (Protected)
```

### Products (Base: `/api/products`)
```
GET    /products               List all (filters, pagination)
GET    /products/:id           Product details
POST   /products               Create (Vendor)
PUT    /products/:id           Update (Vendor)
DELETE /products/:id           Delete (Vendor)
```

### Other Main Routes
```
GET    /api/categories         All categories
GET    /api/brands             All brands
GET    /api/cart               Get cart (Protected)
POST   /api/cart/items         Add to cart
GET    /api/orders             My orders (Protected)
POST   /api/orders             Create order (Protected)
POST   /api/reviews            Create review (Protected)
GET    /api/wishlist           My wishlist (Protected)
POST   /api/addresses          Add address (Protected)
POST   /api/uploads            Upload file (Protected)
```

---

## Frontend Routes Quick Reference

### Public Pages
```
/                    Homepage
/products            Product listing
/products/:id        Product detail
/categories          Browse categories
/brands              Browse brands
/compare             Product comparison
```

### Authentication
```
/login               Login page
/register            Registration page
```

### Customer (Protected)
```
/account             User dashboard
/cart                Shopping cart
/checkout            Payment & shipping
/orders              Order history
/wishlist            Saved products
```

### Vendor (Protected)
```
/vendor              Vendor dashboard
/vendor/products     Product management
/vendor/orders       Vendor orders
/vendor/analytics    Sales stats
```

### Admin (Protected)
```
/admin               Admin dashboard
/admin/users         User management
/admin/vendors       Vendor approval
/admin/orders        All orders
/admin/products      Product catalog
```

---

## Key Features Overview

### Authentication & Authorization
- [x] User registration/login with email & password
- [x] JWT tokens (7-day expiry)
- [x] Role-based access (CUSTOMER, VENDOR, ADMIN)
- [x] Protected routes & API endpoints
- [x] Password hashing (bcrypt)

### Shopping Features
- [x] Product catalog with filters
- [x] Advanced search
- [x] Shopping cart with variants
- [x] Wishlist
- [x] Product comparison
- [x] Reviews with ratings (1-5 stars)
- [x] Review images & helpful votes

### Order Management
- [x] Multi-step checkout
- [x] Multiple addresses
- [x] Order tracking
- [x] Invoice generation (PDF)
- [x] Order status workflow
- [x] Multiple payment methods (prepared)

### Special Features
- [x] Wallet system (coins)
- [x] Coin earning on purchases
- [x] Coupon system (% or fixed discounts)
- [x] Product variants (size, concentration)
- [x] Product videos
- [x] Vendor profiles
- [x] Admin dashboard

### File Management
- [x] Product image uploads
- [x] Brand logo/banner uploads
- [x] User avatar uploads
- [x] Document uploads (trade licenses)
- [x] Supabase Storage integration

---

## Important Files Location

### Backend Configuration
- `.env` - Database URL, JWT secret, Supabase keys
- `nest-cli.json` - NestJS config
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies & scripts
- `prisma/schema.prisma` - **ALL database models**

### Frontend Configuration
- `.env.local` - API URL, Supabase keys
- `next.config.ts` - Next.js config
- `tailwind.config.ts` - Theme & colors
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies & scripts

### Database
- `prisma/schema.prisma` - **Database schema** (22 models)
- `prisma/migrations/` - Database migrations
- `prisma/seed.ts` - Test data seed

---

## Common Commands

### Backend
```bash
cd aromasouq-api

# Start development server (with auto-reload)
pnpm start:dev

# Build for production
pnpm build

# Start production server
pnpm start:prod

# View database (Prisma Studio)
npx prisma studio

# Create migration after schema changes
npx prisma migrate dev --name name_of_migration

# Seed test data
npx prisma db seed

# Reset database (DELETES ALL DATA!)
npx prisma migrate reset
```

### Frontend
```bash
cd aromasouq-web

# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

### Testing
```bash
# Backend unit tests
cd aromasouq-api
pnpm test

# Backend e2e tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

---

## Environment Variables

### Backend (aromasouq-api/.env)
```env
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...

# Supabase
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# JWT
JWT_SECRET=aromasouq-jwt-secret-key...
JWT_EXPIRES_IN=7d

# Server
PORT=3001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:3000

# Storage Buckets
PRODUCTS_BUCKET=products
BRANDS_BUCKET=brands
USERS_BUCKET=users
DOCUMENTS_BUCKET=documents
```

### Frontend (aromasouq-web/.env.local)
```env
# API
NEXT_PUBLIC_API_URL=http://localhost:3001/api

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=AromaSouq
```

---

## Test Accounts

After `npx prisma db seed`:

| Role | Email | Password | Business |
|------|-------|----------|----------|
| Admin | admin@aromasouq.ae | admin123 | - |
| Customer | customer@test.com | admin123 | - |
| Vendor | vendor@test.com | admin123 | Luxury Fragrances LLC |

---

## Local Development Setup

### Prerequisites
- Node.js 20+
- PNPM (preferred) or npm
- Git

### One-Time Setup
```bash
# 1. Navigate to project
cd C:\Users\deept\AromaSouq

# 2. Read setup guide
notepad SETUP-GUIDE-COMPLETE.md

# 3. Install backend dependencies
cd aromasouq-api
pnpm install

# 4. Install frontend dependencies
cd ../aromasouq-web
pnpm install

# 5. Verify setup
node ../verify-setup.js
```

### Daily Startup
```bash
# Terminal 1: Start Backend
cd aromasouq-api
pnpm start:dev
# Backend running on http://localhost:3001

# Terminal 2: Start Frontend
cd aromasouq-web
pnpm dev
# Frontend running on http://localhost:3000

# Optional Terminal 3: View Database
cd aromasouq-api
npx prisma studio
# Prisma Studio on http://localhost:5555
```

---

## Project URLs

### Local Development
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api
- **Prisma Studio:** http://localhost:5555 (when running)

### Cloud Services
- **Supabase Dashboard:** https://supabase.com/dashboard
- **Project URL:** https://owflekosdjmwnkqpjjnn.supabase.co

---

## Module Organization

### Backend Modules (18 Total)
```
AppModule (root)
├── ConfigModule (environment variables)
├── PrismaModule (database)
├── AuthModule (JWT auth)
├── UsersModule (user CRUD)
├── ProductsModule (product CRUD)
├── CategoriesModule (categories)
├── BrandsModule (brands)
├── CartModule (shopping cart)
├── WishlistModule (wishlist)
├── OrdersModule (order processing + invoices)
├── ReviewsModule (reviews)
├── AddressesModule (addresses)
├── CouponsModule (discounts)
├── VendorModule (vendor dashboard)
├── AdminModule (admin dashboard)
├── SupabaseModule (storage)
├── UploadsModule (file uploads)
└── CheckoutModule (payment processing)
```

---

## Component Families (Frontend)

### UI Components (50+ from Radix UI)
- Forms: Button, Input, Select, Textarea, Checkbox, Radio, Switch
- Display: Card, Badge, Label, Separator
- Modals: Dialog, Alert Dialog, Sheet
- Navigation: Tabs, Accordion, Dropdown Menu
- Feedback: Toast, Progress, Tooltip
- Advanced: Combobox, Popover, Slider

### Custom Components
- **Layout:** Header, Footer, Sidebar, Navigation
- **Features:** ProductCard, ProductFilter, RatingStars, CategoryCard
- **Business:** OrderList, ReviewForm, AddressForm, CheckoutForm
- **Utilities:** SearchBar, LoadingSpinner, ErrorBoundary

---

## State Management Strategy

### Global State (Zustand)
```
authStore       User, token, login/logout
cartStore       Cart items, totals
productStore    Filters, sort, search
orderStore      Order data
couponStore     Applied coupon
reviewStore     Review form state
userStore       Profile data
common          Toast messages, loading, modals
```

### Server State (React Query)
- API data caching
- Background sync
- Retry logic
- Stale time: 5 minutes

### Local State (React)
- Form inputs
- UI toggles
- Component-specific data

---

## Authentication Flow

### Registration
1. User fills: email, password, firstName, lastName
2. Frontend validates with Zod
3. POST `/api/auth/register`
4. Backend hashes password (bcrypt)
5. User created in database
6. Response: user object + JWT token

### Login
1. User enters: email, password
2. POST `/api/auth/login`
3. Backend verifies credentials
4. JWT token generated (7-day expiry)
5. Token stored in localStorage (frontend)
6. Token sent in Authorization header (subsequent requests)

### Protected Routes
1. JWT Guard checks token
2. Passport validates signature
3. User context injected
4. Route handler executed
5. Or 401 Unauthorized error

---

## Useful Resources

### Documentation Files
- `CODEBASE_STRUCTURE_OVERVIEW.md` - Comprehensive documentation
- `SETUP-GUIDE-COMPLETE.md` - Complete setup walkthrough
- `docs/` - 350+ pages of detailed docs
- `Integration/` - Phase-wise implementation guides

### Scripts
- `verify-setup.js` - Check environment
- `test-api.bat` - Test API endpoints
- Seed scripts in `aromasouq-api/src/scripts/`

### Configuration
- All `.env` files are properly configured
- `.claude/` - MCP configuration for Claude Code

---

## Common Tasks

### Add a New Product Field
1. Edit `prisma/schema.prisma` - Add field to Product model
2. Run `npx prisma migrate dev --name add_field_name`
3. Update `ProductsController` routes
4. Update `ProductsService` logic
5. Update frontend component/form

### Add a New API Route
1. Create method in `*.service.ts`
2. Add route in `*.controller.ts`
3. Create `create-*.dto.ts` and `update-*.dto.ts`
4. Add guards/decorators for auth
5. Frontend: Create hook using `useQuery`/`useMutation`

### Create New Admin Feature
1. Add route to `AdminController`
2. Implement in `AdminService`
3. Use `@Roles(UserRole.ADMIN)` guard
4. Create admin page at `/admin/feature`
5. Create hook `hooks/admin/useFeature.ts`

### Upload File
1. Frontend: Form with `<input type="file">`
2. POST to `/api/uploads` (FormData)
3. Backend: `UploadsService` validates & uploads
4. Supabase stores file in appropriate bucket
5. Return public URL

---

## Performance Tips

### Frontend
- Use React Query for caching
- Code-split pages automatically (Next.js)
- Optimize images (Supabase CDN)
- Debounce search input

### Backend
- Database indexes on frequently queried fields
- Pagination for large lists
- Caching strategies via query
- Connection pooling (Supabase)

---

## Security Notes

### Never Commit
- `.env` files (database credentials)
- `.env.local` files (API keys)
- Sensitive tokens or secrets
- Personal credentials

### Best Practices
- JWT expiry: 7 days
- Password hashing: bcrypt
- CORS configured for localhost
- Role-based access control
- Input validation (Zod)
- SQL injection prevention (Prisma)

---

## Troubleshooting

### Backend Won't Start
```bash
# Check if port 3001 is in use
netstat -ano | findstr :3001

# Kill process
taskkill /PID [PID] /F

# Check .env file
notepad aromasouq-api\.env
```

### Database Connection Error
```bash
# Verify .env DATABASE_URL
# Check Supabase project isn't paused
# Test: npx prisma db pull
# Check password special characters
```

### Frontend Won't Start
```bash
# Check if port 3000 in use
netstat -ano | findstr :3000

# Reinstall
rm -rf node_modules
pnpm install
```

---

## Next Development Steps

### Immediate Tasks
1. Review `CODEBASE_STRUCTURE_OVERVIEW.md`
2. Follow `SETUP-GUIDE-COMPLETE.md`
3. Start both servers locally
4. Test with Supabase credentials
5. Create/verify test user accounts

### Feature Development
1. Pick feature from Phase 1-3 guides
2. Follow integration guides in `/Integration`
3. Use Claude Code for implementation
4. Test locally
5. Verify with test accounts

### Common Features to Build
- [ ] Profile editing page
- [ ] Advanced search/filters
- [ ] Email notifications
- [ ] WhatsApp integration
- [ ] Payment gateway
- [ ] Analytics dashboard

---

## Quick Stats

- **Backend Files:** 50+ (controllers, services, DTOs, guards)
- **Frontend Components:** 50+
- **Database Models:** 22
- **API Endpoints:** 60+
- **Pages/Routes:** 12+
- **Custom Hooks:** 15+
- **State Stores:** 8
- **Test Accounts:** 3 (Admin, Customer, Vendor)

---

**Last Updated:** November 7, 2025  
**Status:** Ready for Development

For detailed information, see: `CODEBASE_STRUCTURE_OVERVIEW.md`
