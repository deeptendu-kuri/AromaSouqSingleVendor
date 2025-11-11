# AromaSouq MVP - Product Requirements Document (PRD)

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Project:** AromaSouq Web Application MVP  
**Target Launch:** 6 Months from Start

---

## 1. Executive Summary

AromaSouq is a bilingual (English/Arabic) multi-vendor fragrance marketplace web application targeting the GCC market, specifically UAE. The MVP will focus on creating a visually stunning, luxury-oriented e-commerce platform that connects fragrance brands with consumers.

### 1.1 MVP Scope
- **Platform:** Web Application (Mobile-responsive PWA)
- **Markets:** UAE (Primary), GCC (Secondary)
- **Languages:** English & Arabic (RTL support)
- **Initial Focus:** Retail sales with brand-fulfilled inventory
- **Target:** Launch with 10-20 premium fragrance brands

### 1.2 Success Criteria
- 10-20 brands onboarded in first 3 months
- 1,000+ registered users in first 6 months
- Cash-flow break-even via commissions + ad revenue
- 85%+ mobile responsiveness score
- Sub-3 second page load times

---

## 2. Product Vision & Positioning

### 2.1 Market Position
**"The GCC's most beautiful and comprehensive fragrance marketplace"**

AromaSouq positions itself as:
- Premium yet accessible
- Culturally authentic (UAE/GCC aesthetic)
- Technology-forward (AI discovery, personalization)
- Community-driven (reviews, reels, social engagement)

### 2.2 Competitive Differentiation
- **Visual Excellence:** Artistic, luxury UI inspired by Touch of Oud & Ajmal
- **Multi-Category:** Beyond perfumes - oud, attars, bakhoor, raw materials
- **Discovery Innovation:** AI scent matching, video-first product pages
- **Loyalty & Gamification:** Coins, streaks, tiered rewards
- **WhatsApp Commerce:** Integrated messaging for UAE market

---

## 3. MVP Feature Set

### 3.1 Customer-Facing Features (Phase 1 - MVP)

#### 3.1.1 Product Discovery & Browsing
- **Homepage**
  - Hero banner with seasonal campaigns
  - Featured collections (New Arrivals, Trending, Oud Collection, etc.)
  - Category cards with visual imagery
  - Brand spotlight section
  - Customer testimonials/reviews carousel
  
- **Product Catalog**
  - Multi-level category navigation
  - Advanced filtering:
    - Category (Perfume, Oud, Attar, Bakhoor, etc.)
    - Brand
    - Price range
    - Scent family (Woody, Floral, Oriental, Fresh, etc.)
    - Gender (Men, Women, Unisex)
    - Availability (In Stock, Pre-order)
  - Sorting options (Price, Popularity, New Arrivals, Rating)
  - Grid/List view toggle
  - Infinite scroll or pagination

- **Search**
  - Real-time search with autocomplete
  - Search by product name, brand, category, scent notes
  - Recent searches
  - Popular searches suggestions

#### 3.1.2 Product Pages
- **Product Information**
  - High-resolution product images (minimum 5 images)
  - Image zoom and gallery view
  - Product videos/reels (if available)
  - Product name, brand, SKU
  - Price (with any discounts shown)
  - Scent profile (Top/Heart/Base notes)
  - Product description
  - Size/variant selector
  - Quantity selector
  - Stock status indicator
  
- **Social Proof**
  - Average rating (5-star)
  - Review count
  - Customer reviews with pagination
  - Photo reviews
  - "Verified Purchase" badges
  
- **Actions**
  - Add to Cart
  - Add to Wishlist
  - Share (WhatsApp, Facebook, Instagram, Copy Link)
  - "Ask for Wholesale" button (lead generation)
  - WhatsApp inquiry button (if vendor enabled)

#### 3.1.3 Shopping Experience
- **Cart**
  - View cart items
  - Update quantities
  - Remove items
  - Apply coupon codes
  - View subtotal, taxes, shipping
  - Save for later
  - Recommended products
  
- **Checkout**
  - Guest checkout option
  - Registered user checkout
  - Shipping address management
  - Multiple delivery addresses
  - Delivery options (Standard, Same-Day if available)
  - Payment methods:
    - Credit/Debit Card (Stripe/Tap)
    - Cash on Delivery (COD)
    - Digital Wallets (Apple Pay, Google Pay)
  - Order summary
  - Terms & conditions acceptance
  
- **Order Confirmation**
  - Order number
  - Estimated delivery date
  - Order details
  - Email confirmation
  - WhatsApp notification (optional)

#### 3.1.4 User Account
- **Authentication**
  - Email/Password registration
  - Social login (Google, Apple)
  - Email verification
  - Password reset
  
- **Profile Management**
  - Personal information
  - Email preferences
  - Language preference (EN/AR)
  - Profile photo
  
- **Order Management**
  - Order history
  - Order tracking
  - Order details
  - Reorder functionality
  - Cancel order (if applicable)
  - Download invoice
  
- **Wishlist**
  - Add/remove products
  - Move to cart
  - Share wishlist
  
- **Wallet & Coins**
  - View coin balance
  - Transaction history
  - Coin redemption
  - Cashback tracking
  
- **Address Book**
  - Save multiple addresses
  - Set default address
  - Edit/delete addresses

#### 3.1.5 Engagement Features
- **Loyalty Program**
  - Tier display (Silver/Gold/Platinum)
  - Points/coins balance
  - Rewards catalog
  - Redemption history
  
- **Notifications**
  - Order updates
  - Promotional offers
  - Coin expiry alerts
  - Wishlist price drops
  
- **Community (Phase 2 - Post MVP)**
  - Review posting
  - Product questions
  - Follow brands
  - User-generated content

---

### 3.2 Vendor/Brand Features (MVP)

#### 3.2.1 Vendor Dashboard
- **Overview**
  - Sales summary (Today, Week, Month)
  - Order statistics
  - Top products
  - Revenue charts
  - Pending actions
  
#### 3.2.2 Product Management
- **Product Catalog**
  - Add new product
  - Edit product details
  - Product variants management
  - Inventory management
  - Bulk upload (CSV)
  - Product status (Active/Draft/Out of Stock)
  
- **Product Information Fields**
  - Product name (EN/AR)
  - Description (EN/AR)
  - Category & subcategory
  - Brand
  - SKU
  - Barcode
  - Price & compare-at price
  - Variants (Size, Color, etc.)
  - Stock quantity
  - Images (up to 10)
  - Videos/reels
  - Scent notes
  - Ingredients
  - Usage instructions
  - SEO metadata

#### 3.2.3 Order Management
- **Orders Dashboard**
  - New orders notification
  - Order list with filters
  - Order details view
  - Update order status
  - Print packing slip
  - Print shipping label
  - Bulk actions
  
#### 3.2.4 Offers & Marketing
- **Coupon Management**
  - Create coupons
  - Coupon types (Percentage, Fixed, Free Shipping)
  - Usage limits
  - Date ranges
  - Coupon analytics
  
- **Brand Storefront**
  - Brand profile page
  - Brand story (EN/AR)
  - Brand logo and banner
  - Featured products
  - Contact information
  - WhatsApp toggle

#### 3.2.5 Analytics & Reports
- **Sales Reports**
  - Revenue by period
  - Products sold
  - Average order value
  - Sales by category
  
- **Customer Insights**
  - New vs returning customers
  - Customer demographics
  - Top customers

#### 3.2.6 Settings
- **Business Information**
  - Business name
  - Business license
  - Tax information
  - Bank account details
  
- **Notifications**
  - Email notifications
  - Order alerts
  - Low stock alerts

---

### 3.3 Admin/Platform Features (MVP)

#### 3.3.1 Admin Dashboard
- **Overview**
  - Platform statistics
  - GMV (Gross Merchandise Value)
  - Active vendors
  - Total orders
  - Revenue breakdown
  - System health

#### 3.3.2 Vendor Management
- **Onboarding**
  - Vendor applications
  - KYC verification
  - Approval/rejection workflow
  - Onboarding status tracking
  
- **Vendor List**
  - All vendors
  - Vendor status (Active, Pending, Suspended)
  - Vendor details
  - Vendor analytics
  - Commission settings per vendor

#### 3.3.3 Product Management
- **Product Moderation**
  - Pending product approvals
  - Product quality checks
  - Flag inappropriate content
  - Product reporting
  
- **Category Management**
  - Add/edit categories
  - Category hierarchy
  - Category images
  - SEO settings

#### 3.3.4 Order Management
- **All Orders View**
  - Platform-wide orders
  - Order filters and search
  - Order details
  - Dispute management
  - Refund processing

#### 3.3.5 Content Management
- **Homepage Management**
  - Banner management
  - Featured collections
  - Promotional sections
  - Campaign scheduling
  
- **Pages Management**
  - About Us
  - Contact Us
  - Terms & Conditions
  - Privacy Policy
  - Shipping Policy
  - Return Policy
  - FAQ
  
- **Blog (Optional)**
  - Blog posts
  - Categories
  - SEO optimization

#### 3.3.6 Marketing & Campaigns
- **Promotional Campaigns**
  - Create campaigns
  - Banner ads
  - Featured products
  - Sponsored listings
  - Campaign analytics
  
- **Email Marketing**
  - Email templates
  - Campaign scheduling
  - Segmentation
  - Analytics

#### 3.3.7 Customer Management
- **Customer List**
  - All customers
  - Customer details
  - Order history
  - Lifetime value
  - Customer segments
  
- **Reviews & Ratings**
  - Review moderation
  - Approve/reject reviews
  - Flag inappropriate reviews

#### 3.3.8 Financial Management
- **Commission Management**
  - Commission rates
  - Commission calculations
  - Vendor payouts
  - Payout schedules
  - Payout history
  
- **Wallet Management**
  - Vendor wallets
  - Wallet transactions
  - Payout processing
  - Payment gateway integration

#### 3.3.9 Loyalty & Coins System
- **Coins Configuration**
  - Earning rules
  - Redemption rules
  - Coin value
  - Expiry settings
  
- **Rewards Management**
  - Reward catalog
  - Reward redemption
  - Reward analytics

#### 3.3.10 System Settings
- **General Settings**
  - Site name and logo
  - Contact information
  - Social media links
  - Currency (AED)
  - Time zone
  
- **Payment Settings**
  - Payment gateways
  - Payment methods
  - COD settings
  - Currency conversion
  
- **Shipping Settings**
  - Shipping zones
  - Shipping methods
  - Shipping rates
  - Free shipping rules
  
- **Tax Settings**
  - Tax rates
  - Tax zones
  - Tax calculations
  
- **Email Settings**
  - SMTP configuration
  - Email templates
  - Sender information
  
- **WhatsApp Settings**
  - WhatsApp Business API
  - Message templates
  - Automation rules

---

## 4. User Flows

### 4.1 Customer Purchase Flow
1. Browse/Search products
2. View product details
3. Add to cart
4. Continue shopping or proceed to checkout
5. Enter/select shipping address
6. Select delivery method
7. Select payment method
8. Review order
9. Place order
10. Receive confirmation (email + WhatsApp)
11. Track order
12. Receive order
13. (Optional) Leave review

### 4.2 Wholesale Inquiry Flow
1. View product
2. Click "Ask for Wholesale"
3. Fill lead form (business details, quantity needed)
4. Submit inquiry
5. Receive confirmation
6. Sales team contacts via WhatsApp/Email
7. Quote provided
8. Order placed (outside platform or via custom order)

### 4.3 Vendor Onboarding Flow
1. Visit "Sell on AromaSouq" page
2. Fill application form
3. Submit business documents
4. Admin reviews application
5. KYC verification
6. Approval/Rejection
7. Vendor account created
8. Vendor sets up profile
9. Vendor uploads products
10. Products go live after admin approval

---

## 5. Out of Scope (Post-MVP)

The following features are NOT included in MVP but planned for future phases:

- Mobile apps (iOS/Android)
- AI Scent Match
- AI Custom Perfume Builder
- Voice search
- AR bottle preview
- Community feed (posts, reels)
- Influencer collaboration portal
- Advanced analytics dashboard
- Multi-language support beyond EN/AR
- Platform-fulfilled inventory (FBU)
- Manufacturing services
- Raw materials marketplace
- Video calling/live chat
- Advanced gamification (spin-the-wheel, etc.)
- Referral program
- Subscription boxes
- Live shopping events

---

## 6. Technical Considerations

### 6.1 Performance Requirements
- Page load time: < 3 seconds
- Time to Interactive: < 4 seconds
- Lighthouse score: 85+ (Performance, Accessibility, Best Practices, SEO)
- Concurrent users: Support 1000+ concurrent users
- Image optimization: WebP format, lazy loading
- CDN: Cloudflare for global content delivery

### 6.2 Security Requirements
- HTTPS everywhere
- PCI DSS compliance for payments
- Data encryption at rest and in transit
- Regular security audits
- Rate limiting on APIs
- CSRF protection
- SQL injection prevention
- XSS protection

### 6.3 SEO Requirements
- Server-side rendering (SSR) for product pages
- Semantic HTML
- Structured data (Schema.org)
- XML sitemap
- Robots.txt
- Meta tags optimization
- Canonical URLs
- 301 redirects for changed URLs
- Arabic SEO optimization

### 6.4 Accessibility Requirements
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast ratios
- Alt text for images
- ARIA labels

### 6.5 Browser & Device Support
- **Browsers:** Chrome, Safari, Firefox, Edge (latest 2 versions)
- **Devices:** Desktop, Tablet, Mobile
- **Screen sizes:** 320px - 3840px
- **Touch support:** Full touch gesture support

---

## 7. Success Metrics & KPIs

### 7.1 Business Metrics
- GMV (Gross Merchandise Value)
- Total orders
- Average order value (AOV)
- Conversion rate
- Customer acquisition cost (CAC)
- Customer lifetime value (CLV)
- Vendor count
- Products listed

### 7.2 Engagement Metrics
- Monthly active users (MAU)
- Session duration
- Pages per session
- Bounce rate
- Cart abandonment rate
- Wishlist additions
- Review submissions

### 7.3 Technical Metrics
- Page load time
- Error rate
- API response time
- Uptime (99.9% target)
- Mobile vs Desktop traffic

---

## 8. Launch Phases

### Phase 1: MVP Core (Months 1-3)
- Basic product catalog
- Shopping cart & checkout
- User authentication
- Vendor dashboard (basic)
- Admin dashboard (basic)
- Payment integration
- Order management

### Phase 2: Enhancement (Months 4-6)
- Loyalty & coins system
- Advanced filtering
- WhatsApp commerce
- Enhanced vendor features
- Marketing tools
- Analytics dashboard
- SEO optimization

### Phase 3: Community & AI (Months 7-12)
- Community features
- AI scent matching
- Video content
- Influencer tools
- Mobile apps
- Advanced gamification

---

## 9. Assumptions & Dependencies

### 9.1 Assumptions
- 10-20 brands committed to onboarding
- Brands will handle their own fulfillment initially
- UAE customers prefer WhatsApp communication
- Same-day delivery will be vendor-managed initially
- Payment gateway approvals will be obtained in Month 1

### 9.2 Dependencies
- Payment gateway integration (Stripe/Tap/PayTabs)
- WhatsApp Business API approval
- Vendor onboarding and training
- Product photography from vendors
- Legal compliance (UAE e-commerce regulations)
- Hosting infrastructure setup

---

## 10. Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Vendor onboarding delays | High | Medium | Start outreach early, provide onboarding incentives |
| Payment gateway approval delays | High | Low | Apply early, have backup options |
| Performance issues at scale | Medium | Medium | Load testing, scalable architecture |
| Low initial traffic | High | Medium | Co-marketing with brands, SEO, paid ads |
| Competitor launches | Medium | Medium | Focus on differentiation, brand partnerships |
| Technical debt accumulation | Medium | High | Code reviews, documentation, refactoring sprints |

---

## 11. Appendix

### 11.1 Glossary
- **GMV:** Gross Merchandise Value - total sales value on platform
- **SKU:** Stock Keeping Unit - unique product identifier
- **AOV:** Average Order Value
- **CAC:** Customer Acquisition Cost
- **CLV:** Customer Lifetime Value
- **COD:** Cash on Delivery
- **KYC:** Know Your Customer
- **RTL:** Right-to-Left (Arabic language)

### 11.2 References
- AromaSouq Product Specification Document
- Touch of Oud website (design inspiration)
- Ajmal website (design inspiration)
- GCC e-commerce market research
- UAE consumer behavior studies

---

**Document Status:** ✅ Approved for Development  
**Next Steps:** Review with stakeholders → Technical design → Development kickoff
