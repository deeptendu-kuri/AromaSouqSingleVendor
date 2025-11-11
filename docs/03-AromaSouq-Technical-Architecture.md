# AromaSouq MVP - Technical Architecture & Tech Stack

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Architecture Style:** Microservices-ready Monolithic Start

---

## 1. Technology Stack

### 1.1 Frontend

**Web Application:**
```
Framework: Next.js 14+ (App Router)
Language: TypeScript 5+
UI Framework: React 18+
Styling: Tailwind CSS 3+
Component Library: shadcn/ui (Radix UI + Tailwind)
State Management: 
  - React Context (simple state)
  - Zustand (complex state, cart, user)
  - TanStack Query (server state, caching)
Form Handling: React Hook Form + Zod (validation)
Animation: Framer Motion
Icons: Heroicons + Lucide React
Date Handling: date-fns
Image Optimization: Next.js Image component
Rich Text: Tiptap or Lexical (admin content)
```

**Why Next.js:**
- Server-side rendering (SSR) for SEO
- Static site generation (SSG) for performance
- API routes (serverless functions)
- Image optimization built-in
- File-based routing
- Best-in-class TypeScript support
- Excellent developer experience

### 1.2 Backend

**API & Business Logic:**
```
Runtime: Node.js 20+ LTS
Framework: NestJS (TypeScript)
API Style: RESTful + GraphQL (optional)
Validation: class-validator, class-transformer
Authentication: JWT (JSON Web Tokens)
Authorization: RBAC (Role-Based Access Control)
File Upload: Multer + Sharp (image processing)
Email: Nodemailer + SendGrid/AWS SES
SMS/WhatsApp: Twilio API / WhatsApp Cloud API
Cron Jobs: node-cron / Bull Queue
```

**Why NestJS:**
- TypeScript-first
- Modular architecture (scalable)
- Built-in dependency injection
- Excellent testing support
- Decorator-based (clean code)
- Strong community & ecosystem

### 1.3 Database

**Primary Database: Supabase (PostgreSQL 15+)**
```
Platform: Supabase (All-in-one Backend Platform)
Database: PostgreSQL 15+
ORM: Prisma 5+
Migration: Prisma Migrate
Seeding: Prisma seed scripts
Connection Pooling: Built-in (Supavisor)
Backup: Automated daily backups (included)
Real-time: Supabase Realtime (optional)
```

**Caching Layer:**
```
Cache: Redis 7+ (Upstash Redis recommended)
Use Cases:
  - API response caching
  - Rate limiting
  - Job queues
  - Session storage (if not using Supabase Auth)
```

**Why Supabase:**
- ✅ PostgreSQL 15+ (managed, production-ready)
- ✅ Built-in file storage (replaces S3)
- ✅ Built-in authentication (optional, can use with NestJS)
- ✅ Real-time subscriptions (bonus feature)
- ✅ Automatic API generation (optional)
- ✅ Row Level Security (RLS)
- ✅ Free tier: 500MB database, 1GB storage
- ✅ Excellent Prisma integration
- ✅ Built-in connection pooling
- ✅ Dashboard for database management

### 1.4 File Storage & CDN

**Media Storage: Supabase Storage**
```
Primary: Supabase Storage (S3-compatible)
CDN: Supabase CDN (built-in, global edge network)
Image Processing: Sharp (Node.js) for resizing/optimization
Image Transformations: Supabase Image Transformations (built-in)

Buckets:
- products (public: product images, videos)
- brands (public: logos, banners)  
- users (public: avatars)
- documents (private: business licenses, KYC docs)

Features:
✅ S3-compatible API
✅ Built-in CDN (global edge network)
✅ Image transformations (resize, format, quality on-the-fly)
✅ File size limits (50MB default, configurable)
✅ Storage policies (RLS for security)
✅ Automatic WebP conversion
✅ Free tier: 1GB storage, 2GB bandwidth
```

**Folder Structure:**
```
products/ (bucket)
  ├── {product-id}/
  │   ├── image-1.jpg
  │   ├── image-2.jpg
  │   └── video.mp4

brands/ (bucket)
  ├── {vendor-id}/
  │   ├── logo.png
  │   └── banner.jpg

users/ (bucket)
  ├── {user-id}/
      └── avatar.jpg

documents/ (bucket - private)
  ├── {vendor-id}/
      ├── trade-license.pdf
      └── business-registration.pdf
```

**Image URLs with Transformations:**
```
Original:
https://[project-ref].supabase.co/storage/v1/object/public/products/abc123/image-1.jpg

Transformed (auto-resize, WebP):
https://[project-ref].supabase.co/storage/v1/render/image/public/products/abc123/image-1.jpg?width=800&height=800&format=webp&quality=80
```

**Alternative Options (if needed):**
- Cloudflare R2 (no egress fees, larger scale)
- AWS S3 (enterprise scale)
- Use Supabase + Cloudflare CDN for additional optimization

### 1.5 Payments

**Payment Gateway:**
```
Primary: Stripe Connect (multi-vendor)
Alternative: Tap Payments (MENA region)
Backup: PayTabs (UAE/GCC)

Supported Methods:
- Credit/Debit Cards (Visa, Mastercard, Amex)
- Digital Wallets (Apple Pay, Google Pay)
- Cash on Delivery (COD)
- Bank Transfer (for wholesale)

Payment Flow:
1. Customer pays → Platform account
2. Platform holds funds (escrow)
3. After return period → Payout to vendor
```

### 1.6 Hosting & Infrastructure

**Frontend Hosting:**
```
Platform: Vercel (primary) or Netlify
- Automatic deployments from Git
- Global CDN
- Serverless functions
- Preview deployments
- Analytics built-in
```

**Backend Hosting:**
```
Platform: 
  Option 1: Railway (simple, affordable, recommended)
  Option 2: Render (good free tier)
  Option 3: DigitalOcean App Platform
  Option 4: AWS ECS/Fargate (production scale)

Requirements:
- Docker container support
- Auto-scaling
- Load balancing
- 99.9% uptime SLA
- Supabase connection support
```

**Database Hosting:**
```
Primary: Supabase (Managed PostgreSQL)
  - Free tier: 500MB database
  - Pro tier: $25/mo (8GB database, daily backups)
  - Built-in connection pooling (Supavisor)
  - Point-in-time recovery (Pro tier)
  - Automatic backups
  - Database dashboard
  - Direct SQL editor
  
Connection:
  - Direct connection (for migrations)
  - Pooled connection (for application, recommended)
  - REST API (optional, auto-generated)
```

### 1.7 DevOps & CI/CD

**Version Control:**
```
Git: GitHub (primary)
Branching Strategy: Git Flow
  - main (production)
  - develop (staging)
  - feature/* (new features)
  - hotfix/* (urgent fixes)
```

**CI/CD:**
```
Pipeline: GitHub Actions
Steps:
  1. Lint (ESLint, Prettier)
  2. Type check (TypeScript)
  3. Unit tests (Jest)
  4. Integration tests (Playwright)
  5. Build
  6. Deploy to staging
  7. E2E tests on staging
  8. Deploy to production (manual approval)
```

**Containerization:**
```
Docker: For backend services
Docker Compose: Local development
Container Registry: GitHub Container Registry / Docker Hub
```

### 1.8 Monitoring & Logging

**Error Tracking:**
```
Sentry: Frontend & Backend errors
- Real-time alerts
- Stack traces
- User context
- Performance monitoring
```

**Logging:**
```
Winston (Node.js) or Pino (faster)
Centralized: Logtail or Better Stack
Log Levels: error, warn, info, debug
Structured Logging: JSON format
```

**Analytics:**
```
User Analytics: 
  - Google Analytics 4
  - Mixpanel (optional)
  - PostHog (open-source alternative)

Business Metrics:
  - Custom dashboard (admin panel)
  - Real-time sales tracking
  - Vendor performance
```

**Application Monitoring:**
```
Uptime: UptimeRobot or Better Uptime
Performance: New Relic or DataDog (expensive) or Self-hosted Grafana
API Monitoring: Postman Monitor or custom
```

### 1.9 Communication

**Email:**
```
Service: SendGrid or AWS SES
Templates: Handlebars templates
Types:
  - Transactional (order confirmations)
  - Marketing (newsletters, campaigns)
  - System (password reset, verification)

Email Service Provider (ESP):
  - SendGrid (transactional)
  - Mailchimp (marketing) or Brevo
```

**SMS & WhatsApp:**
```
SMS: Twilio
WhatsApp Business API: 
  - WhatsApp Cloud API (Meta)
  - 360Dialog (WhatsApp BSP)
  - Twilio WhatsApp

Use Cases:
  - Order notifications
  - OTP verification
  - Promotional messages
  - Customer support
```

**Push Notifications:**
```
Service: Firebase Cloud Messaging (FCM)
Web Push: OneSignal or FCM
Implementation: Service Worker
```

### 1.10 Security

**Authentication:**
```
Strategy: JWT (JSON Web Tokens)
Access Token: Short-lived (15 min)
Refresh Token: Long-lived (7 days), stored in httpOnly cookie
Password Hashing: bcrypt (cost factor: 12)
2FA: Optional (TOTP via Authenticator app)
OAuth: Google, Apple Sign-In
```

**Authorization:**
```
Model: RBAC (Role-Based Access Control)
Roles:
  - Customer
  - Vendor
  - Admin
  - Super Admin

Permissions: Granular (e.g., "products:create", "orders:read")
Implementation: Decorators in NestJS (@Roles, @Permissions)
```

**API Security:**
```
Rate Limiting: express-rate-limit + Redis
CORS: Configured for specific origins
Helmet.js: Security headers
Input Validation: class-validator (all inputs)
SQL Injection: Prevented by Prisma ORM
XSS: React escapes by default + CSP headers
CSRF: SameSite cookies + CSRF tokens
```

**Data Protection:**
```
Encryption at Rest: Database encryption
Encryption in Transit: TLS 1.3
PII Handling: Minimal collection, GDPR compliance
Payment Data: PCI DSS compliance (via Stripe)
```

---

## 2. System Architecture

### 2.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     Cloudflare CDN                      │
│                   (Static Assets, Images)               │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│                   Vercel (Frontend)                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │          Next.js Web Application                 │  │
│  │  - Server-Side Rendering (SSR)                  │  │
│  │  - Static Site Generation (SSG)                 │  │
│  │  - API Routes (lightweight)                     │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼ (API Calls)
┌─────────────────────────────────────────────────────────┐
│          Railway / Render (Backend Services)            │
│  ┌──────────────────────────────────────────────────┐  │
│  │              NestJS API Server                   │  │
│  │  - REST API endpoints                            │  │
│  │  - Business logic                                │  │
│  │  - Authentication & Authorization                │  │
│  │  - File uploads                                  │  │
│  │  - Email/SMS services                            │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Redis (Cache/Queue)                 │  │
│  │  - Session storage                               │  │
│  │  - API caching                                   │  │
│  │  - Rate limiting                                 │  │
│  │  - Job queues                                    │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│         Railway / Supabase (Database)                   │
│  ┌──────────────────────────────────────────────────┐  │
│  │           PostgreSQL Database                    │  │
│  │  - Primary data store                            │  │
│  │  - Transactional data                            │  │
│  │  - User data, products, orders                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────┐
│              External Services                          │
│  - AWS S3 / Cloudflare R2 (File Storage)               │
│  - Stripe / Tap (Payments)                              │
│  - SendGrid (Email)                                     │
│  - Twilio / WhatsApp API (Messaging)                    │
│  - Sentry (Error Tracking)                              │
└─────────────────────────────────────────────────────────┘
```

### 2.2 Request Flow

**Customer Flow:**
```
User → Browser
  → Cloudflare CDN (static assets)
  → Vercel (Next.js)
    → Render SSR/SSG pages
    → Call Backend API
  → Railway/Render (NestJS)
    → Validate request
    → Check Redis cache
    → Query PostgreSQL
    → Process business logic
    → Return response
  → Update cache
  → Render page
→ Display to user
```

**Vendor Flow:**
```
Vendor → Dashboard
  → Next.js vendor pages
  → API calls to NestJS
    → JWT authentication
    → Check vendor permissions
    → CRUD operations
    → File uploads to S3
    → Database updates
  → Real-time updates (optional WebSocket)
  → Response to vendor
```

---

## 3. Database Design Overview

### 3.1 Core Tables (Summary)

```
Users (customers, vendors, admins)
Vendors (brand information)
Products (all product data)
ProductVariants (sizes, colors)
ProductImages (multiple images per product)
Categories (hierarchical)
Orders (order header)
OrderItems (order line items)
Carts (shopping cart)
CartItems (cart line items)
Addresses (shipping addresses)
Reviews (product reviews)
Wishlists (user wishlists)
Coupons (discount codes)
Wallets (vendor wallets, user coins)
Transactions (wallet transactions)
Payouts (vendor payouts)
Notifications (user notifications)
Settings (system settings)
```

*Full database schema in separate document: `03-AromaSouq-Database-Schema.md`*

### 3.2 Database Relationships

```
User (1) ─── (Many) Orders
User (1) ─── (Many) Reviews
User (1) ─── (1) Cart
User (1) ─── (Many) Addresses
User (1) ─── (1) Wishlist
User (1) ─── (1) Wallet

Vendor (1) ─── (Many) Products
Vendor (1) ─── (1) Wallet
Vendor (1) ─── (Many) Orders

Product (1) ─── (Many) ProductVariants
Product (1) ─── (Many) ProductImages
Product (1) ─── (Many) Reviews
Product (Many) ─── (Many) Categories

Order (1) ─── (Many) OrderItems
Order (1) ─── (1) Address
Order (1) ─── (1) Payment

Cart (1) ─── (Many) CartItems
```

---

## 4. API Design

### 4.1 API Structure

**Base URL:**
```
Development: http://localhost:3001/api/v1
Staging: https://api-staging.aromasouq.ae/api/v1
Production: https://api.aromasouq.ae/api/v1
```

**Versioning:** URL-based versioning (`/api/v1/`)

### 4.2 Authentication

**Endpoints:**
```
POST /auth/register
POST /auth/login
POST /auth/logout
POST /auth/refresh-token
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/verify-email
POST /auth/resend-verification
GET  /auth/profile
PUT  /auth/profile
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
Accept-Language: en | ar
X-Device-ID: {unique_device_id}
```

### 4.3 Core API Endpoints (Examples)

**Products:**
```
GET    /products                    # List products (with filters)
GET    /products/:id                # Get product details
POST   /products                    # Create product (vendor)
PUT    /products/:id                # Update product (vendor)
DELETE /products/:id                # Delete product (vendor)
GET    /products/:id/reviews        # Get product reviews
POST   /products/:id/reviews        # Create review (customer)
GET    /products/featured           # Get featured products
GET    /products/trending           # Get trending products
```

**Cart:**
```
GET    /cart                        # Get current cart
POST   /cart/items                  # Add item to cart
PUT    /cart/items/:id              # Update cart item
DELETE /cart/items/:id              # Remove cart item
DELETE /cart                        # Clear cart
```

**Orders:**
```
GET    /orders                      # List orders (user/vendor)
GET    /orders/:id                  # Get order details
POST   /orders                      # Create order (checkout)
PUT    /orders/:id/status           # Update order status (vendor)
PUT    /orders/:id/cancel           # Cancel order (customer)
GET    /orders/:id/tracking         # Get tracking info
```

**Vendors:**
```
GET    /vendors                     # List vendors
GET    /vendors/:id                 # Get vendor profile
GET    /vendors/:id/products        # Get vendor products
POST   /vendors                     # Apply as vendor
PUT    /vendors/:id                 # Update vendor profile (vendor)
```

**Categories:**
```
GET    /categories                  # List all categories
GET    /categories/:id              # Get category details
GET    /categories/:id/products     # Get category products
```

*Full API documentation in separate document: `05-AromaSouq-API-Documentation.md`*

---

## 5. Performance Optimization

### 5.1 Frontend Optimization

**Next.js Optimization:**
```
- Server-Side Rendering (SSR) for critical pages
- Static Site Generation (SSG) for product pages
- Incremental Static Regeneration (ISR) for frequently updated content
- Image optimization (WebP, lazy loading, blur placeholders)
- Code splitting (automatic with Next.js)
- Tree shaking (remove unused code)
- Minification & compression (Gzip, Brotli)
```

**React Optimization:**
```
- Lazy loading components (React.lazy, Suspense)
- Memoization (React.memo, useMemo, useCallback)
- Virtual scrolling (for long lists)
- Debouncing & throttling (search, filters)
- Optimistic UI updates
```

**Asset Optimization:**
```
- Image formats: WebP with JPEG/PNG fallback
- Image sizing: Responsive images (srcset)
- Font optimization: Subset fonts, font-display: swap
- CSS optimization: Tailwind CSS purge, critical CSS
- JavaScript: Dynamic imports, code splitting
```

### 5.2 Backend Optimization

**Database Optimization:**
```
- Indexing: All foreign keys, search fields
- Query optimization: Use Prisma query optimization
- Pagination: Cursor-based for large datasets
- Connection pooling: PgBouncer
- Read replicas: For read-heavy queries (future)
```

**Caching Strategy:**
```
- API response caching (Redis)
- Database query caching (Prisma)
- Static file caching (CDN)
- Browser caching (Cache-Control headers)

Cache TTL:
  - Product list: 5 minutes
  - Product details: 10 minutes
  - Categories: 1 hour
  - Static pages: 1 day
  - User data: No cache (private)
```

**API Optimization:**
```
- Rate limiting: Prevent abuse
- Request compression: Gzip responses
- Efficient serialization: Minimize payload
- Field selection: GraphQL-style field selection
- Batch requests: Support multiple queries in one request
```

### 5.3 Monitoring & Alerts

**Performance Metrics:**
```
- Response time (< 200ms for cached, < 500ms for dynamic)
- Database query time (< 100ms average)
- Error rate (< 0.1%)
- Uptime (99.9% target)
```

**Alerts:**
```
- High error rate (> 1% for 5 minutes)
- Slow response time (> 2s for 5 minutes)
- High memory usage (> 85%)
- High CPU usage (> 80%)
- Database connection issues
- Payment gateway failures
```

---

## 6. Security Best Practices

### 6.1 OWASP Top 10 Mitigation

1. **Injection Prevention:**
   - Use Prisma ORM (parameterized queries)
   - Validate all inputs (class-validator)

2. **Broken Authentication:**
   - JWT with short expiry
   - Secure password hashing (bcrypt)
   - Rate limiting on auth endpoints

3. **Sensitive Data Exposure:**
   - HTTPS everywhere
   - Encrypted database
   - Minimal PII collection

4. **XML External Entities (XXE):**
   - Not applicable (no XML parsing)

5. **Broken Access Control:**
   - RBAC implementation
   - Check permissions on every request

6. **Security Misconfiguration:**
   - Security headers (Helmet.js)
   - Disable unnecessary features
   - Regular dependency updates

7. **XSS (Cross-Site Scripting):**
   - React escapes by default
   - CSP headers
   - Sanitize user-generated content

8. **Insecure Deserialization:**
   - Validate all JSON inputs
   - Use TypeScript interfaces

9. **Using Components with Known Vulnerabilities:**
   - Regular `npm audit`
   - Automated dependency updates (Dependabot)

10. **Insufficient Logging & Monitoring:**
    - Centralized logging (Logtail)
    - Real-time error tracking (Sentry)
    - Audit logs for sensitive actions

---

## 7. Scalability Considerations

### 7.1 Current Architecture (MVP)
- Monolithic backend (easier to develop)
- Single database instance
- Vertical scaling (increase resources)

### 7.2 Future Scaling (Post-MVP)
- Microservices architecture:
  - Auth Service
  - Product Service
  - Order Service
  - Payment Service
  - Notification Service
- Database sharding (if needed)
- Horizontal scaling (multiple instances)
- Message queue (RabbitMQ, Kafka) for async tasks
- Event-driven architecture (CQRS, Event Sourcing)

---

## 8. Development Environment Setup

### 8.1 Prerequisites

```
Node.js: 20+ LTS
npm: 10+ or pnpm: 8+ (recommended)
Docker: 24+ (for local PostgreSQL, Redis)
Git: Latest version
IDE: VS Code (recommended)
```

### 8.2 VS Code Extensions

```
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- Prisma
- Error Lens
- Auto Rename Tag
- GitLens
- Thunder Client (API testing)
```

### 8.3 Local Development

**Frontend:**
```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Run production build locally
pnpm start
```

**Backend:**
```bash
# Install dependencies
pnpm install

# Start PostgreSQL & Redis (Docker)
docker-compose up -d

# Run Prisma migrations
pnpm prisma migrate dev

# Seed database
pnpm prisma db seed

# Start development server
pnpm start:dev

# Run in watch mode
pnpm start:dev --watch
```

### 8.4 Environment Variables

**Frontend (.env.local):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_GA_ID=G-...
```

**Backend (.env):**
```
NODE_ENV=development
PORT=3001

# Supabase Database
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DATABASE_URL_POOLER=postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true

# Supabase (optional - if using Supabase Auth/Storage directly)
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-role-key

# Redis (Upstash recommended)
REDIS_URL=redis://default:password@hostname:port

# JWT (if using NestJS auth instead of Supabase Auth)
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# SendGrid Email
SENDGRID_API_KEY=SG...

# WhatsApp
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

---

## 9. Testing Strategy

### 9.1 Frontend Testing

```
Unit Tests: Jest + React Testing Library
  - Component tests
  - Hook tests
  - Utility function tests
  Target: 80% coverage

Integration Tests: Jest + React Testing Library
  - User flow tests
  - API integration tests
  Target: Key user journeys covered

E2E Tests: Playwright
  - Critical user flows (purchase, checkout)
  - Cross-browser testing
  Target: 10-15 critical scenarios
```

### 9.2 Backend Testing

```
Unit Tests: Jest
  - Service logic tests
  - Utility function tests
  Target: 80% coverage

Integration Tests: Jest + Supertest
  - API endpoint tests
  - Database integration tests
  Target: All endpoints covered

E2E Tests: Jest + Supertest
  - Complete user flows through API
  Target: Main business flows
```

### 9.3 Manual Testing

```
- Browser compatibility testing
- Mobile device testing
- Accessibility testing (WAVE, axe DevTools)
- Performance testing (Lighthouse)
- Security testing (OWASP ZAP)
```

---

## 10. Deployment Strategy

### 10.1 Deployment Environments

```
Development: Local machines
Staging: staging.aromasouq.ae
Production: aromasouq.ae
```

### 10.2 Deployment Process

**Frontend (Vercel):**
1. Push to GitHub
2. Automatic build & deploy on push to `develop` (staging)
3. Manual promotion to `main` (production)
4. Preview deployments for feature branches

**Backend (Railway/Render):**
1. Push to GitHub
2. Docker image build
3. Deploy to staging (automatic)
4. Run tests on staging
5. Manual deployment to production
6. Health check & smoke tests

### 10.3 Rollback Plan

```
Frontend: Instant rollback to previous deployment (Vercel)
Backend: Rollback to previous Docker image
Database: Database migration rollback (Prisma)
```

---

## 11. Cost Estimation (Monthly - MVP)

### 11.1 Infrastructure Costs

```
Hosting:
  - Vercel (Frontend): $20 (Pro plan) or Free (Hobby)
  - Railway/Render (Backend): $20-50 (Hobby/Pro)
  
Database & Storage:
  - Supabase Free Tier: $0
    • 500MB database
    • 1GB file storage  
    • 50,000 monthly active users
    • 2GB bandwidth
  - Supabase Pro: $25/mo (when you scale)
    • 8GB database
    • 100GB file storage
    • 100,000 monthly active users
    • 250GB bandwidth
    • Daily backups
    • Point-in-time recovery

Cache:
  - Upstash Redis Free: $0 (10k commands/day)
  - Upstash Redis Pro: $10-20/mo (based on usage)

Services:
  - SendGrid (Email): $15 (40k emails) or Free (100/day)
  - Twilio (SMS/WhatsApp): $50-100 (based on usage)
  - Stripe: 2.9% + $0.30 per transaction
  - Sentry (Error Tracking): $26 (Team plan) or Free (5k events/mo)
  - Domain & SSL: $15/year (amortized)

Total: 
  - MVP/Starting: $50-100/month (with free tiers)
  - Growing: $150-250/month (as you scale)
```

**Supabase Benefits:**
- ✅ No separate S3/storage costs
- ✅ No separate database hosting costs  
- ✅ Built-in CDN (no Cloudflare costs initially)
- ✅ Generous free tier for MVP
- ✅ Predictable pricing as you scale

### 11.2 Break-Even Analysis

```
Target Revenue:
  - Commission (10-15%): $2000-3000 GMV = $200-450 revenue
  - Ad Management (20%): 10 brands × $200/mo = $2000 revenue

Target GMV for break-even: $20,000-30,000/month
```

---

## 12. Supabase Integration Guide

### 12.1 Supabase Setup

**Create Supabase Project:**
```bash
1. Go to https://supabase.com
2. Sign up / Log in
3. Click "New Project"
4. Enter project details:
   - Name: aromasouq-production
   - Database Password: [strong password]
   - Region: Singapore (closest to UAE) or Frankfurt
5. Wait 2-3 minutes for project creation
```

**Get Connection Details:**
```
Project URL: https://[project-ref].supabase.co
API Keys:
  - anon/public key: For client-side (safe to expose)
  - service_role key: For server-side (keep secret)

Database Connection:
  - Direct: postgres://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
  - Pooler: postgres://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true
```

### 12.2 Prisma with Supabase

**Configure Prisma:**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")          // Direct connection for migrations
  directUrl = env("DATABASE_URL_POOLER")  // Pooled connection for queries
}

generator client {
  provider = "prisma-client-js"
  previewFeatures = ["postgresqlExtensions"]
}
```

**Environment Variables:**
```bash
# .env
# Direct connection (for migrations only)
DATABASE_URL="postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres"

# Pooled connection (for application)
DATABASE_URL_POOLER="postgresql://postgres:[password]@db.[project-ref].supabase.co:6543/postgres?pgbouncer=true"
```

**Run Migrations:**
```bash
# Development (uses direct connection)
npx prisma migrate dev --name init

# Production (uses direct connection)
npx prisma migrate deploy

# Generate client (uses pooled connection at runtime)
npx prisma generate
```

### 12.3 Supabase Storage Integration

**Create Storage Buckets:**
```sql
-- Run in Supabase SQL Editor

-- Create public buckets for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('brands', 'brands', true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('users', 'users', true);

-- Create private bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false);
```

**Storage Policies (Row Level Security):**
```sql
-- Allow public read access to public buckets
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('products', 'brands', 'users') );

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id IN ('products', 'brands', 'users') );

-- Allow users to update their own files
CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
TO authenticated
USING ( auth.uid()::text = owner );
```

**NestJS Storage Service:**
```typescript
// src/storage/storage.service.ts
import { Injectable } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class StorageService {
  private supabase;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_KEY, // Use service key for backend
    );
  }

  async uploadProductImage(
    productId: string,
    file: Express.Multer.File,
  ): Promise<string> {
    const fileName = `${productId}/${Date.now()}-${file.originalname}`;
    
    // Upload to Supabase Storage
    const { data, error } = await this.supabase.storage
      .from('products')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) throw error;

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from('products')
      .getPublicUrl(fileName);

    return urlData.publicUrl;
  }

  async uploadWithTransformation(
    productId: string,
    file: Express.Multer.File,
  ): Promise<{ original: string; thumbnail: string; optimized: string }> {
    const fileName = `${productId}/${Date.now()}-${file.originalname}`;
    
    // Upload original
    await this.supabase.storage
      .from('products')
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    const baseUrl = `${process.env.SUPABASE_URL}/storage/v1/render/image/public/products/${fileName}`;

    return {
      original: `${process.env.SUPABASE_URL}/storage/v1/object/public/products/${fileName}`,
      thumbnail: `${baseUrl}?width=240&height=240&format=webp`,
      optimized: `${baseUrl}?width=800&height=800&format=webp&quality=85`,
    };
  }

  async deleteFile(bucket: string, path: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) throw error;
  }
}
```

### 12.4 Image Transformation URLs

**Supabase provides automatic image transformations:**

```typescript
// Original image
https://[project-ref].supabase.co/storage/v1/object/public/products/abc123/image.jpg

// Resized to 800x800, WebP format, 85% quality
https://[project-ref].supabase.co/storage/v1/render/image/public/products/abc123/image.jpg?width=800&height=800&format=webp&quality=85

// Thumbnail (240x240)
https://[project-ref].supabase.co/storage/v1/render/image/public/products/abc123/image.jpg?width=240&height=240&format=webp

// Available parameters:
// - width: number
// - height: number  
// - quality: 20-100
// - format: webp, avif, origin
// - resize: cover, contain, fill
```

### 12.5 Authentication Options

**Option 1: NestJS JWT (Recommended for MVP)**
- Full control over auth logic
- Custom business rules
- Easier to customize
- What we've documented so far

**Option 2: Supabase Auth (Alternative)**
```typescript
// Frontend integration
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
```

**Recommendation:** Stick with NestJS JWT for now (more flexibility), but you can migrate to Supabase Auth later if needed.

### 12.6 Database Management

**Supabase Dashboard:**
```
Access at: https://supabase.com/dashboard/project/[project-ref]

Features:
1. Table Editor - View/edit data visually
2. SQL Editor - Run custom queries
3. Database - View schema, relationships
4. Storage - Manage files, buckets
5. Authentication - Manage users (if using Supabase Auth)
6. Logs - View database logs, API logs
7. Settings - Backups, connection details
```

**Useful SQL Queries:**
```sql
-- View all tables
SELECT tablename FROM pg_tables 
WHERE schemaname = 'public';

-- Check database size
SELECT pg_size_pretty(pg_database_size('postgres'));

-- View indexes
SELECT * FROM pg_indexes 
WHERE schemaname = 'public';

-- Active connections
SELECT * FROM pg_stat_activity;
```

### 12.7 Backup & Recovery

**Automatic Backups (Pro Plan):**
- Daily automatic backups
- Point-in-time recovery
- Retention: 7 days (Pro), 30 days (Team)

**Manual Backup:**
```bash
# Using pg_dump
pg_dump "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" > backup.sql

# Restore
psql "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" < backup.sql
```

### 12.8 Monitoring

**Built-in Monitoring:**
- Database health metrics
- Storage usage
- API usage
- Active connections
- Query performance

**Alerts (Pro Plan):**
- Database size limits
- Connection limits
- API rate limits

---

## 13. Documentation

### 12.1 Code Documentation

```
- JSDoc/TSDoc for all functions
- README files in each module/package
- Inline comments for complex logic
- API documentation (Swagger/OpenAPI)
```

### 12.2 Technical Documentation

```
- Architecture Decision Records (ADR)
- Database schema documentation
- API documentation (Postman/Swagger)
- Deployment runbooks
- Troubleshooting guides
```

---

## 14. Backup & Disaster Recovery

### 14.1 Database Backups

**Supabase Automatic Backups:**
```
Free Tier: No automatic backups (manual only)
Pro Tier: Daily automatic backups (7-day retention)
Team Tier: Daily backups (30-day retention) + Point-in-time recovery

Manual Backup:
pg_dump "postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres" > backup_$(date +%Y%m%d).sql

Automated Backup Script (cron):
0 2 * * * cd /backups && pg_dump "$DATABASE_URL" > aromasouq_$(date +\%Y\%m\%d).sql && aws s3 cp aromasouq_$(date +\%Y\%m\%d).sql s3://aromasouq-backups/
```

**Storage Backups:**
```
Supabase Storage is automatically replicated
Additional backup: Use Supabase CLI to download buckets
supabase storage download products/ --recursive
```

### 14.2 Disaster Recovery Plan

```
RTO (Recovery Time Objective): 4 hours
RPO (Recovery Point Objective): 24 hours (daily backups)

Steps:
1. Detect issue (monitoring alerts)
2. Assess impact
3. If database corruption: Restore from Supabase backup
4. If complete outage: Deploy to new Supabase project from backup
5. Update DNS/environment variables
6. Validate data integrity
7. Monitor for 24 hours
8. Post-mortem & improvements
```

**Supabase Advantages for DR:**
- ✅ Built-in replication
- ✅ Automatic failover (Pro tier)
- ✅ Point-in-time recovery (Team tier)
- ✅ Multi-region support
- ✅ Quick project restoration

---

## 15. Documentation
