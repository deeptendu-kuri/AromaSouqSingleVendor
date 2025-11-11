# 🗺️ AROMASOUQ - PHASE-WISE IMPLEMENTATION ROADMAP

## 📋 **COMPLETED FIXES (Just Now)**

### ✅ **Issues Resolved:**
1. **Reviews Restriction** - Users can now only review products after delivery
   - File: `aromasouq-api/src/reviews/reviews.service.ts:45-63`
   - Enforces DELIVERED order status before allowing reviews

2. **Cart Item Count Badge** - Fixed cart badge display in header
   - File: `aromasouq-api/src/cart/cart.service.ts:78-100`
   - Now returns proper `summary` object with `itemCount`

3. **Product Filters** - Fixed category filtering
   - Files: `aromasouq-web/src/app/products/page.tsx:17,187,103`
   - Changed from `category` to `categorySlug` parameter

4. **Category Links** - Header navigation now working
   - File: `aromasouq-web/src/components/layout/header.tsx:83-105`
   - All category links use `categorySlug` parameter

5. **Dashboard Navigation** - Added "Back to Homepage" buttons
   - Files: `aromasouq-web/src/app/vendor/layout.tsx:95-103`
   - Files: `aromasouq-web/src/app/admin/layout.tsx:139-148`

6. **Review Display** - Reviews properly shown on product pages and cards
   - Already implemented in ProductCard and ReviewList components

---

## 🚀 **REMAINING FEATURES - IMPLEMENTATION PLAN**

---

## **PHASE 1: CRITICAL CORE FEATURES** 🔴 **(2-3 Weeks)**

### **1.1 Wallet & Coins System** ⏱️ 4-5 days
**Priority: URGENT** - Frontend already expects these APIs

#### **Backend Implementation:**

**Step 1: Create Wallet Module** (Day 1)
```bash
cd aromasouq-api/src
mkdir wallet
cd wallet
```

Create files:
- `wallet.controller.ts`
- `wallet.service.ts`
- `wallet.module.ts`
- `dto/create-transaction.dto.ts`
- `dto/redeem-coins.dto.ts`

**wallet.controller.ts** - Required endpoints:
```typescript
GET    /wallet                    # Get user wallet with balance
GET    /wallet/transactions       # Get transaction history (paginated)
POST   /wallet/redeem            # Redeem coins (convert to money/discount)
POST   /wallet/award             # Award coins (admin only)
```

**Step 2: Integrate with Orders** (Day 2)
- Update `orders.service.ts` to create wallet transactions on order completion
- Award coins when order status changes to DELIVERED
- Record coin usage when order uses coins for discount

**Step 3: Wallet Service Logic** (Days 3-4)
```typescript
// aromasouq-api/src/wallet/wallet.service.ts
async getWallet(userId: string) {
  // Get or create wallet
  // Calculate available balance
  // Return with transaction summary
}

async getTransactions(userId: string, params) {
  // Get paginated transaction history
  // Include order/product details
}

async awardCoins(userId: string, amount: number, source: CoinSource, metadata) {
  // Create EARNED transaction
  // Update wallet balance
  // Update user.coinsBalance
}

async spendCoins(userId: string, amount: number, orderId: string) {
  // Validate sufficient balance
  // Create SPENT transaction
  // Update wallet balance
}
```

**Step 4: Register Module** (Day 5)
```typescript
// aromasouq-api/src/app.module.ts
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    // ... other modules
    WalletModule,  // ADD THIS
  ],
})
```

**Testing:**
- Create test user
- Place order and mark as DELIVERED
- Verify coins awarded
- Test coin redemption
- Verify transaction history

---

### **1.2 Payment Gateway Integration** ⏱️ 5-7 days
**Priority: HIGH** - Platform cannot process real payments

#### **Recommended Gateway:** Stripe (International) + Telr (UAE Local)

**Step 1: Setup Stripe** (Days 1-2)
```bash
npm install stripe @stripe/stripe-js
```

Create payment module:
```typescript
// aromasouq-api/src/payment/payment.module.ts
// aromasouq-api/src/payment/payment.service.ts
// aromasouq-api/src/payment/payment.controller.ts
```

**Endpoints Required:**
```typescript
POST   /payment/create-intent         # Create Stripe PaymentIntent
POST   /payment/webhook               # Handle Stripe webhooks
POST   /payment/confirm               # Confirm payment
GET    /payment/methods               # List saved payment methods
POST   /payment/save-method           # Save payment method for future
```

**Step 2: Update Checkout Flow** (Days 3-4)
```typescript
// aromasouq-api/src/checkout/checkout.service.ts

async processPayment(userId: string, orderId: string, paymentMethodId: string) {
  // Create Stripe PaymentIntent
  // If successful, update order status to PAID
  // Award coins if order is delivered
  // Send confirmation email
}
```

**Step 3: Frontend Integration** (Days 5-6)
```tsx
// aromasouq-web/src/app/checkout/page.tsx
// Add Stripe Elements
// Handle card input
// Process payment
// Redirect to success page
```

**Step 4: Webhook Handler** (Day 7)
```typescript
// Listen for payment_intent.succeeded
// Update order payment status
// Handle failed payments
// Process refunds
```

**Testing:**
- Use Stripe test cards
- Test successful payment flow
- Test failed payment handling
- Test webhook delivery
- Test refund flow

---

### **1.3 Invoice Generation** ⏱️ 1 day
**Priority: MEDIUM** - Required for business operations

**Implementation:**
- Uncomment routes in `orders.controller.ts:74-97`
- Test PDF generation with `invoice.service.ts`
- Add download button in order details page

```typescript
// aromasouq-web/src/app/orders/[id]/page.tsx
<Button onClick={() => window.open(`/api/orders/${orderId}/invoice`, '_blank')}>
  Download Invoice
</Button>
```

---

## **PHASE 2: ADVANCED FEATURES** 🟡 **(3-4 Weeks)**

### **2.1 Branded Coins System** ⏱️ 4-5 days
**Priority: MEDIUM** - Unique differentiator

#### **Database Schema Update:**
```prisma
// aromasouq-api/prisma/schema.prisma

model BrandedCoin {
  id             String   @id @default(uuid())
  userId         String   @map("user_id")
  brandId        String   @map("brand_id")
  balance        Int      @default(0)
  lifetimeEarned Int      @default(0) @map("lifetime_earned")
  lifetimeSpent  Int      @default(0) @map("lifetime_spent")
  expiresAt      DateTime? @map("expires_at")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
  brand Brand @relation(fields: [brandId], references: [id], onDelete: Cascade)

  transactions BrandedCoinTransaction[]

  @@unique([userId, brandId])
  @@map("branded_coins")
}

model BrandedCoinTransaction {
  id              String   @id @default(uuid())
  brandedCoinId   String   @map("branded_coin_id")
  amount          Int
  type            CoinTransactionType
  description     String?
  orderId         String?  @map("order_id")
  productId       String?  @map("product_id")
  balanceAfter    Int      @map("balance_after")
  createdAt       DateTime @default(now()) @map("created_at")

  brandedCoin BrandedCoin @relation(fields: [brandedCoinId], references: [id], onDelete: Cascade)

  @@map("branded_coin_transactions")
}
```

#### **Migration:**
```bash
cd aromasouq-api
npx prisma migrate dev --name add_branded_coins
```

#### **API Implementation:**
```typescript
GET    /branded-coins              # Get user's branded coins by brand
GET    /branded-coins/:brandId     # Get specific brand coins
POST   /branded-coins/earn         # Award brand-specific coins
POST   /branded-coins/spend        # Spend brand coins
```

#### **Business Logic:**
- Award 2x coins for brand-specific purchases
- Brand coins can only be used for that brand's products
- Universal coins can be used anywhere
- Combine both types in checkout

---

### **2.2 Promo Campaigns & Cashback** ⏱️ 5-6 days

#### **Database Schema:**
```prisma
model Campaign {
  id              String         @id @default(uuid())
  name            String
  description     String?
  type            CampaignType   // CASHBACK, COIN_MULTIPLIER, DISCOUNT
  vendorId        String?        @map("vendor_id")
  startDate       DateTime       @map("start_date")
  endDate         DateTime       @map("end_date")
  isActive        Boolean        @default(true) @map("is_active")
  conditions      Json           // Minimum purchase, specific products, etc.
  rewards         Json           // Cashback %, coin multiplier, etc.
  usageLimit      Int?           @map("usage_limit")
  usageCount      Int            @default(0) @map("usage_count")
  createdAt       DateTime       @default(now()) @map("created_at")
  updatedAt       DateTime       @updatedAt @map("updated_at")

  vendor Vendor? @relation(fields: [vendorId], references: [id])

  @@map("campaigns")
}

enum CampaignType {
  CASHBACK
  COIN_MULTIPLIER
  DISCOUNT
  FREE_SHIPPING
}
```

#### **API Endpoints:**
```typescript
POST   /campaigns                 # Create campaign (Vendor/Admin)
GET    /campaigns                 # List campaigns
GET    /campaigns/active          # Get active campaigns
GET    /campaigns/:id             # Campaign details
PATCH  /campaigns/:id             # Update campaign
DELETE /campaigns/:id             # Delete campaign
POST   /campaigns/:id/apply       # Apply campaign to order
```

#### **Features:**
- **Cashback Campaigns**: Award coins/money after purchase
- **Coin Multipliers**: 2x, 3x, 5x coins for specific products
- **Flash Sales**: Time-limited high discounts
- **Bundle Deals**: Buy X get Y free/discounted
- **Seasonal Campaigns**: Ramadan, Eid, Christmas sales

---

### **2.3 Vendor Analytics Dashboard** ⏱️ 4-5 days

#### **Backend - Analytics Service:**
```typescript
// aromasouq-api/src/analytics/analytics.service.ts

async getVendorAnalytics(vendorId: string, dateRange: DateRange) {
  return {
    sales: {
      total: number,
      growth: percentage,
      byDay: ChartData[],
      byProduct: ProductSales[],
    },
    revenue: {
      total: number,
      growth: percentage,
      byDay: ChartData[],
    },
    orders: {
      total: number,
      pending: number,
      completed: number,
      cancelled: number,
    },
    products: {
      topSelling: Product[],
      lowStock: Product[],
      outOfStock: Product[],
    },
    customers: {
      total: number,
      new: number,
      returning: number,
    },
    reviews: {
      averageRating: number,
      total: number,
      pending: number,
    },
  }
}
```

#### **API Endpoints:**
```typescript
GET    /analytics/vendor/dashboard      # Overall dashboard stats
GET    /analytics/vendor/sales          # Sales analytics
GET    /analytics/vendor/revenue        # Revenue breakdown
GET    /analytics/vendor/products       # Product performance
GET    /analytics/vendor/customers      # Customer insights
GET    /analytics/vendor/export         # Export to CSV/Excel
```

#### **Frontend - Charts & Visualizations:**
```typescript
// aromasouq-web/src/app/vendor/analytics/page.tsx

// Install chart library
npm install recharts

// Components needed:
- Revenue Line Chart (7 days, 30 days, 12 months)
- Sales Bar Chart
- Top Products Table
- Order Status Pie Chart
- Customer Growth Chart
- Geographic Sales Map (if location data available)
```

---

### **2.4 Product Videos Management** ⏱️ 2-3 days

#### **Backend:**
```typescript
// aromasouq-api/src/products/products.controller.ts

POST   /products/:id/videos        # Upload product video
GET    /products/:id/videos        # List product videos
PATCH  /products/videos/:id        # Update video details
DELETE /products/videos/:id        # Delete video
```

#### **Service Implementation:**
```typescript
async addVideo(productId: string, videoDto: AddVideoDto) {
  // Upload to Supabase Storage
  // Create ProductVideo record
  // Return video details
}
```

#### **Frontend:**
```tsx
// aromasouq-web/src/app/vendor/products/[id]/page.tsx

// Add video upload section
<VideoUploader
  onUpload={(file) => handleVideoUpload(file)}
  maxSize={50MB}
  accept="video/mp4,video/webm"
/>

// Display on product page
<VideoPlayer src={productVideo.url} poster={productVideo.thumbnail} />
```

---

## **PHASE 3: USER EXPERIENCE ENHANCEMENTS** 🟢 **(2-3 Weeks)**

### **3.1 Email Notifications** ⏱️ 4-5 days

#### **Setup Email Service:**
```bash
npm install @sendgrid/mail
# OR
npm install nodemailer
```

#### **Email Templates Needed:**
1. **Order Confirmation** - Sent immediately after order
2. **Order Shipped** - With tracking number
3. **Order Delivered** - Ask for review
4. **Vendor Approval** - Welcome email
5. **Review Reply** - Vendor responded to review
6. **Password Reset**
7. **Low Stock Alert** (Vendor)
8. **New Order** (Vendor)

#### **Implementation:**
```typescript
// aromasouq-api/src/email/email.service.ts

async sendOrderConfirmation(order: Order) {
  const template = this.renderTemplate('order-confirmation', { order });
  await this.send(order.user.email, 'Order Confirmed', template);
}

async sendVendorApproval(vendor: Vendor) {
  const template = this.renderTemplate('vendor-approval', { vendor });
  await this.send(vendor.user.email, 'Welcome to AromaSouq', template);
}
```

#### **Email Templates:** (HTML + Text versions)
Create in: `aromasouq-api/src/email/templates/`

---

### **3.2 Multi-Language Support (Arabic)** ⏱️ 5-6 days

#### **Frontend i18n Setup:**
```bash
npm install next-intl
```

#### **Configuration:**
```typescript
// aromasouq-web/src/i18n.ts
export const locales = ['en', 'ar'];
export const defaultLocale = 'en';

// aromasouq-web/src/middleware.ts
// Detect and set locale
```

#### **Translation Files:**
```json
// aromasouq-web/src/locales/en.json
{
  "header": {
    "products": "Products",
    "cart": "Cart",
    "profile": "Profile"
  },
  "product": {
    "addToCart": "Add to Cart",
    "outOfStock": "Out of Stock"
  }
}

// aromasouq-web/src/locales/ar.json
{
  "header": {
    "products": "المنتجات",
    "cart": "السلة",
    "profile": "الملف الشخصي"
  }
}
```

#### **Language Switcher:**
```tsx
// aromasouq-web/src/components/LanguageSwitcher.tsx
<Select value={locale} onValueChange={setLocale}>
  <SelectItem value="en">English</SelectItem>
  <SelectItem value="ar">العربية</SelectItem>
</Select>
```

#### **RTL Support:**
```css
/* aromasouq-web/src/app/globals.css */
html[dir="rtl"] {
  direction: rtl;
  text-align: right;
}
```

---

### **3.3 Advanced Search & Autocomplete** ⏱️ 3-4 days

#### **Backend - Search Improvements:**
```typescript
// aromasouq-api/src/products/products.controller.ts

GET /products/search/suggestions?q=perfume
// Returns: product names, brands, categories matching query

// Implement full-text search with PostgreSQL
await this.prisma.product.findMany({
  where: {
    OR: [
      { name: { search: query } },
      { description: { search: query } },
    ]
  }
})
```

#### **Frontend - Autocomplete Component:**
```tsx
// aromasouq-web/src/components/SearchBar.tsx

<AutocompleteSearch
  onSearch={(query) => fetchSuggestions(query)}
  renderSuggestion={(item) => <ProductSuggestion product={item} />}
  onSelect={(product) => router.push(`/products/${product.slug}`)}
/>
```

#### **Search Features:**
- Real-time suggestions as user types
- Search history (localStorage)
- Popular searches
- Recent searches
- Category-specific search
- Voice search (optional)

---

## **PHASE 4: OPTIMIZATION & POLISH** 🟢 **(1-2 Weeks)**

### **4.1 Performance Optimization** ⏱️ 3-4 days

#### **Backend:**
- Add Redis caching for frequently accessed data
- Optimize database queries with indexes
- Implement API response caching
- Add database query logging to identify slow queries

```typescript
// Install Redis
npm install redis

// aromasouq-api/src/cache/cache.service.ts
async getCachedProducts(categoryId: string) {
  const cached = await redis.get(`products:${categoryId}`);
  if (cached) return JSON.parse(cached);

  const products = await this.prisma.product.findMany({...});
  await redis.set(`products:${categoryId}`, JSON.stringify(products), 'EX', 300);
  return products;
}
```

#### **Frontend:**
- Implement image lazy loading
- Add skeleton loaders
- Optimize bundle size
- Implement route prefetching

---

### **4.2 SEO Optimization** ⏱️ 2-3 days

#### **Meta Tags for All Pages:**
```tsx
// aromasouq-web/src/app/products/[slug]/page.tsx

export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.slug);

  return {
    title: `${product.name} - AromaSouq`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.images[0].url],
    },
  };
}
```

#### **Structured Data:**
```tsx
<script type="application/ld+json">
  {JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "AED"
    }
  })}
</script>
```

---

### **4.3 Testing & Quality Assurance** ⏱️ 5-7 days

#### **Unit Tests:**
```bash
# Backend
npm test

# Test coverage for:
- Auth service
- Product service
- Order service
- Cart service
- Review service
```

#### **Integration Tests:**
```typescript
// aromasouq-api/test/orders.e2e-spec.ts

describe('Order Flow (e2e)', () => {
  it('should create order, process payment, and award coins', async () => {
    // Create order
    // Process payment
    // Verify order status
    // Verify coins awarded
  });
});
```

#### **Frontend Testing:**
```bash
npm install @testing-library/react @testing-library/jest-dom

# Test components:
- ProductCard
- Cart
- Checkout
- Review Form
```

---

## **DEPLOYMENT CHECKLIST** ✅

### **Pre-Production:**
- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Seed data loaded (categories, initial admin)
- [ ] Payment gateway in live mode
- [ ] Email service configured
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (Google Analytics)
- [ ] SSL certificates configured
- [ ] Domain configured
- [ ] CDN setup for images

### **Production Deployment:**
1. **Backend:**
   ```bash
   cd aromasouq-api
   npm run build
   pm2 start dist/main.js --name aromasouq-api
   ```

2. **Frontend:**
   ```bash
   cd aromasouq-web
   npm run build
   pm2 start npm --name aromasouq-web -- start
   ```

3. **Database:**
   ```bash
   npx prisma migrate deploy
   ```

### **Post-Deployment:**
- [ ] Smoke tests on production
- [ ] Test payment flow with real card
- [ ] Test email delivery
- [ ] Verify all links work
- [ ] Check mobile responsiveness
- [ ] Monitor error logs
- [ ] Set up uptime monitoring
- [ ] Configure backup system

---

## **TIMELINE SUMMARY**

| Phase | Duration | Features |
|-------|----------|----------|
| **Phase 1: Critical** | 2-3 weeks | Wallet, Payment Gateway, Invoices |
| **Phase 2: Advanced** | 3-4 weeks | Branded Coins, Campaigns, Analytics, Videos |
| **Phase 3: UX** | 2-3 weeks | Emails, i18n, Advanced Search |
| **Phase 4: Polish** | 1-2 weeks | Performance, SEO, Testing |
| **Total** | **8-12 weeks** | Complete Platform |

---

## **RESOURCE REQUIREMENTS**

### **Development Team:**
- 1 Full-Stack Developer (Primary)
- 1 Frontend Developer (Phase 3)
- 1 QA Engineer (Phase 4)

### **External Services:**
- Stripe Account ($0 setup, 2.9% + $0.30 per transaction)
- SendGrid/AWS SES for emails ($0-$10/month)
- Redis Cloud (Optional, $0-$10/month)
- CDN for images (Cloudflare - Free tier available)

---

## **SUCCESS METRICS**

### **Phase 1 Success:**
- [ ] Users can earn and redeem coins
- [ ] Payment processing works end-to-end
- [ ] Invoices download correctly

### **Phase 2 Success:**
- [ ] Branded coins system functional
- [ ] At least 3 active campaigns running
- [ ] Vendors can view sales analytics

### **Phase 3 Success:**
- [ ] All transactional emails sending
- [ ] Arabic language fully supported
- [ ] Search autocomplete working

### **Phase 4 Success:**
- [ ] Page load < 2 seconds
- [ ] Test coverage > 70%
- [ ] Zero critical bugs

---

## **RISK MITIGATION**

### **High-Risk Items:**
1. **Payment Integration**
   - **Risk:** Complex integration, security concerns
   - **Mitigation:** Use official SDKs, extensive testing in sandbox

2. **Data Migration**
   - **Risk:** Loss of data during updates
   - **Mitigation:** Always backup before migrations, test on staging first

3. **Performance Issues**
   - **Risk:** Slow page loads with many products
   - **Mitigation:** Implement pagination, caching, lazy loading early

---

## **SUPPORT & MAINTENANCE**

### **Post-Launch:**
- Monitor error logs daily
- Weekly database backups
- Monthly security updates
- Quarterly feature reviews
- 24/7 critical bug response

---

**Document Version:** 1.0
**Last Updated:** 2025-01-07
**Next Review:** After Phase 1 Completion
