# Testing Guide for HIGH Priority Features

This guide provides step-by-step testing instructions for all 4 implemented HIGH priority features.

## Prerequisites

1. **Backend Running**: `cd aromasouq-api && npm run start:dev` or `pnpm run start:dev`
2. **Frontend Running**: `cd aromasouq-web && npm run dev`
3. **Database Migrated**: Schema changes applied with `npx prisma db push`
4. **Vendor Account**: You need a VENDOR role user account

---

## Feature 1: Brand Storefront Page

### Backend Testing

#### 1. Test Public Vendor Profile Endpoint
```bash
# Get vendor by slug
GET http://localhost:3001/vendor/public/my-perfume-shop

# Expected Response:
{
  "id": "uuid",
  "businessName": "My Perfume Shop",
  "slug": "my-perfume-shop",
  "logo": "https://...",
  "banner": "https://...",
  "tagline": "Premium Arabian Fragrances",
  "brandStory": "Our story...",
  "products": [
    // Array of vendor's products
  ]
}
```

#### 2. Test Logo Upload
```bash
POST http://localhost:3001/uploads/vendor/logo
Authorization: Bearer <vendor-token>
Content-Type: multipart/form-data

Body: file=<image-file>

# Expected: Returns uploaded logo URL
```

#### 3. Test Banner Upload
```bash
POST http://localhost:3001/uploads/vendor/banner
Authorization: Bearer <vendor-token>
Content-Type: multipart/form-data

Body: file=<image-file>

# Expected: Returns uploaded banner URL
```

### Frontend Testing

#### 1. Update Vendor Settings with Logo/Banner
1. Login as VENDOR
2. Go to `/vendor/settings`
3. In the "Business Information" tab:
   - Click "Upload Logo" button
   - Select an image file (JPG/PNG, max 5MB)
   - See preview and "Uploading..." state
   - Logo should appear after upload
4. Repeat for "Upload Banner"
5. Fill in slug field (e.g., "my-perfume-shop")
6. Click "Save Changes"

#### 2. Visit Public Vendor Page
1. Navigate to `/vendors/my-perfume-shop` (using the slug you set)
2. Verify you see:
   - Banner image at top
   - Logo overlapping banner
   - Business name and tagline
   - Brand story section
   - Social media links (if provided)
   - Grid of vendor's products
   - WhatsApp floating button (if enabled)

---

## Feature 2: Product Variant Management

### Backend Testing

#### 1. Create Product Variant
```bash
POST http://localhost:3001/products/{productId}/variants
Authorization: Bearer <vendor-token>
Content-Type: application/json

{
  "name": "50ml",
  "sku": "PROD-50ML",
  "price": 299,
  "stock": 100,
  "compareAtPrice": 399
}

# Expected: Variant created with 201 status
```

#### 2. Get Product Variants
```bash
GET http://localhost:3001/products/{productId}/variants
Authorization: Bearer <vendor-token>

# Expected: Array of variants for this product
```

#### 3. Update Variant
```bash
PATCH http://localhost:3001/variants/{variantId}
Authorization: Bearer <vendor-token>
Content-Type: application/json

{
  "price": 279,
  "stock": 80
}

# Expected: Updated variant
```

#### 4. Delete Variant
```bash
DELETE http://localhost:3001/variants/{variantId}
Authorization: Bearer <vendor-token>

# Expected: Variant soft-deleted (isActive: false)
```

### Frontend Testing

#### 1. Add Variants to New Product
1. Login as VENDOR
2. Go to `/vendor/products/new`
3. Scroll to "Product Variants" section
4. Click "Add Variant"
5. Fill in:
   - Name: "50ml"
   - SKU: "PERFUME-50ML"
   - Price: 299
   - Stock: 100
   - Compare at Price: 399 (optional)
6. Click "Add Variant" again for another size (e.g., "100ml")
7. Submit the product form
8. Variants should be created along with the product

#### 2. Edit Variants on Existing Product
1. Go to `/vendor/products` and click Edit on any product
2. Scroll to "Product Variants"
3. See existing variants listed
4. Click "+ Add Variant" to add new one
5. Click "Remove" button on any variant to delete it
6. Edit variant prices/stock inline
7. Save changes

---

## Feature 3: Coupon System

### Backend Testing

#### 1. Create Coupon
```bash
POST http://localhost:3001/coupons
Authorization: Bearer <vendor-token>
Content-Type: application/json

{
  "code": "SUMMER2024",
  "discountType": "PERCENTAGE",
  "discountValue": 20,
  "minOrderAmount": 200,
  "maxDiscount": 100,
  "usageLimit": 50,
  "startDate": "2024-06-01T00:00:00Z",
  "endDate": "2024-08-31T23:59:59Z"
}

# Expected: Coupon created
```

#### 2. List All Coupons
```bash
GET http://localhost:3001/coupons
Authorization: Bearer <vendor-token>

# Expected: Array of vendor's coupons
```

#### 3. Validate Coupon
```bash
POST http://localhost:3001/coupons/validate
Content-Type: application/json

{
  "code": "SUMMER2024",
  "orderAmount": 500
}

# Expected Response:
{
  "valid": true,
  "coupon": {
    "id": "uuid",
    "code": "SUMMER2024",
    "discountType": "PERCENTAGE",
    "discountValue": 20
  },
  "discountAmount": 100,  // 20% of 500, capped at maxDiscount
  "finalAmount": 400
}
```

#### 4. Update Coupon
```bash
PATCH http://localhost:3001/coupons/{couponId}
Authorization: Bearer <vendor-token>
Content-Type: application/json

{
  "discountValue": 25,
  "isActive": true
}

# Expected: Updated coupon
```

#### 5. Delete Coupon
```bash
DELETE http://localhost:3001/coupons/{couponId}
Authorization: Bearer <vendor-token>

# Expected: Coupon soft-deleted
```

### Frontend Testing

#### 1. Create Coupon
1. Login as VENDOR
2. Go to `/vendor/coupons`
3. Click "Create Coupon"
4. Fill in coupon form:
   - Code: "NEWYEAR2024" (uppercase, letters/numbers/hyphens only)
   - Discount Type: Select "Percentage" or "Fixed Amount"
   - Discount Value: 15 (for 15% off)
   - Min Order Amount: 150 (optional)
   - Max Discount: 75 (optional, for percentage only)
   - Usage Limit: 100 (optional)
   - Start Date: Pick a date/time
   - End Date: Pick a date/time (must be after start)
5. Click "Create Coupon"
6. Should redirect to coupons list

#### 2. View Coupons List
1. At `/vendor/coupons`, verify you see:
   - Coupon code with copy button
   - Status badge (Active/Expired/Scheduled/Limit Reached/Inactive)
   - Discount amount highlighted in gold
   - Min order and max discount info
   - Valid date range
   - Usage count vs limit
   - Number of orders using this coupon
   - Edit and Delete buttons

#### 3. Edit Coupon
1. Click "Edit" on any coupon
2. Modify values (e.g., change discount from 15% to 20%)
3. Save changes
4. Verify changes reflected in list

#### 4. Test Coupon in Checkout
1. **As a customer** (CUSTOMER role):
2. Add products to cart (total > min order amount)
3. Go to `/checkout`
4. In "Coupon Code" section, enter "NEWYEAR2024"
5. Click "Apply"
6. Verify:
   - Coupon code shows in green box
   - Discount amount calculated correctly
   - Final total updated
7. Click "Remove" to remove coupon
8. Try invalid codes to see error messages:
   - Expired code
   - Not yet valid code
   - Code below min order amount
   - Code that reached usage limit

---

## Feature 4: Dashboard Analytics Enhancement

### Backend Testing

#### 1. Get Sales Analytics
```bash
GET http://localhost:3001/vendor/analytics/sales?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <vendor-token>

# Expected Response:
[
  {
    "date": "2024-06-15",
    "sales": 25,      // units sold
    "orders": 12,     // number of orders
    "revenue": 4500   // total revenue
  },
  // ... more daily data
]
```

#### 2. Get Revenue Breakdown
```bash
GET http://localhost:3001/vendor/analytics/revenue
Authorization: Bearer <vendor-token>

# Expected Response:
{
  "byProduct": [
    {
      "productId": "uuid",
      "productName": "Luxury Oud",
      "categoryName": "Perfumes",
      "revenue": 5000,
      "unitsSold": 20
    },
    // ... top 10 products
  ],
  "byCategory": [
    {
      "category": "Perfumes",
      "revenue": 15000,
      "products": 8
    },
    // ... all categories
  ]
}
```

#### 3. Export Sales Report
```bash
GET http://localhost:3001/vendor/analytics/export?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <vendor-token>

# Expected: CSV file download with columns:
# Order ID, Date, Customer, Email, Product, SKU, Quantity, Price, Total, Status
```

### Frontend Testing

#### 1. View Dashboard Analytics
1. Login as VENDOR
2. Go to `/vendor` (dashboard)
3. Verify you see:
   - **Stats cards** at top (Total Sales, Products, Orders, Avg Rating)
   - **Date range picker** with Start and End date inputs
   - **Export CSV button**

#### 2. Sales Trend Chart
1. On dashboard, scroll to "Sales Trend" chart
2. Verify:
   - Line chart showing revenue (gold line) and orders (navy line)
   - X-axis shows dates
   - Y-axis shows amounts
   - Hover over data points to see tooltips
   - Legend showing "Revenue (AED)" and "Orders"

#### 3. Revenue Breakdown
1. Below sales chart, find "Revenue Breakdown" section
2. Click "Top Products" tab:
   - Bar chart showing top 10 products by revenue
   - X-axis: product names (angled for readability)
   - Y-axis: revenue in AED
   - Gold bars
3. Click "By Category" tab:
   - Bar chart showing revenue by category
   - Navy bars

#### 4. Filter by Date Range
1. Change start date to 30 days ago
2. Change end date to today
3. Verify charts update with filtered data

#### 5. Export Report
1. Click "Export CSV" button
2. Verify CSV file downloads
3. Open in Excel/Sheets and verify:
   - All orders within date range
   - Correct columns
   - Only vendor's own products

#### 6. Check Recharts Installation
```bash
# In aromasouq-web directory
cd aromasouq-web
npm list recharts

# Should show: recharts@2.x.x
# If not installed:
npm install recharts date-fns
```

---

## API Endpoints Quick Reference

### Coupons
- `POST /coupons` - Create coupon (VENDOR)
- `GET /coupons` - List coupons (VENDOR/ADMIN)
- `GET /coupons/:id` - Get single coupon (VENDOR/ADMIN)
- `PATCH /coupons/:id` - Update coupon (VENDOR/ADMIN)
- `DELETE /coupons/:id` - Delete coupon (VENDOR/ADMIN)
- `POST /coupons/validate` - Validate coupon (PUBLIC)

### Product Variants
- `POST /products/:id/variants` - Create variant (VENDOR)
- `GET /products/:id/variants` - List variants (PUBLIC)
- `PATCH /variants/:id` - Update variant (VENDOR)
- `DELETE /variants/:id` - Delete variant (VENDOR)

### Vendor
- `GET /vendor/public/:slug` - Public vendor profile (PUBLIC)
- `GET /vendor/analytics/sales` - Sales analytics (VENDOR)
- `GET /vendor/analytics/revenue` - Revenue breakdown (VENDOR)
- `GET /vendor/analytics/export` - Export CSV (VENDOR)

### Uploads
- `POST /uploads/vendor/logo` - Upload vendor logo (VENDOR)
- `POST /uploads/vendor/banner` - Upload vendor banner (VENDOR)

---

## Common Issues & Troubleshooting

### Issue 1: "Coupon code already exists"
- Each coupon code must be unique across all vendors
- Try a different code

### Issue 2: "End date must be after start date"
- Ensure end date/time is later than start date/time

### Issue 3: "Percentage discount cannot exceed 100%"
- For PERCENTAGE type, value must be 0-100

### Issue 4: File upload fails
- Check file size (max 5MB for images)
- Check file type (JPG, PNG only)
- Ensure Supabase storage bucket exists

### Issue 5: Variant SKU conflict
- Each SKU must be unique across all product variants
- Format: `{PRODUCT-CODE}-{VARIANT}` (e.g., "OUD-ROYAL-50ML")

### Issue 6: Analytics showing no data
- Ensure there are orders in the database
- Check date range includes order dates
- Verify orders have status other than "CANCELLED"

### Issue 7: Public vendor page 404
- Ensure vendor has a slug set
- Navigate to `/vendors/{slug}` (plural "vendors")
- Slug must match exactly (case-sensitive)

---

## Test Data Setup

### Create Test Vendor
1. Register a new user
2. Become a vendor at `/become-vendor`
3. Fill in all vendor details
4. Admin must approve vendor (status = APPROVED)

### Create Test Products
1. As approved vendor, go to `/vendor/products/new`
2. Create 3-5 products with different categories
3. Add 2-3 variants per product

### Create Test Orders
1. As CUSTOMER, add products to cart
2. Complete checkout with different products
3. Repeat for multiple orders over different dates

### Create Test Coupons
1. As VENDOR, create 5 coupons:
   - One active percentage coupon (e.g., SAVE20)
   - One active fixed amount coupon (e.g., GET50OFF)
   - One expired coupon (end date in past)
   - One scheduled coupon (start date in future)
   - One with usage limit reached

---

## Success Criteria

### Feature 1: Brand Storefront
✅ Vendor can upload logo and banner
✅ Vendor can set unique slug
✅ Public page accessible at `/vendors/{slug}`
✅ Shows all vendor info and products
✅ WhatsApp button works if enabled

### Feature 2: Product Variants
✅ Can create variants with different sizes/prices
✅ Variants show on product page
✅ Can select variant in cart
✅ Stock managed per variant

### Feature 3: Coupons
✅ Vendor can create/edit/delete coupons
✅ Coupon validation works correctly
✅ Discount applied in checkout
✅ Usage tracking works
✅ Status badges accurate

### Feature 4: Analytics
✅ Sales trend chart displays correctly
✅ Revenue breakdown by product/category works
✅ Date filtering updates charts
✅ CSV export downloads with correct data
✅ Charts responsive on mobile

---

## Performance Benchmarks

- Public vendor page load: < 2 seconds
- Coupon validation API: < 200ms
- Analytics data fetch: < 1 second
- CSV export: < 3 seconds (for 1000 orders)
- Chart rendering: < 500ms

---

## Browser Compatibility

Test in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

For issues or questions, check:
- Backend logs in aromasouq-api console
- Frontend console in browser DevTools
- Network tab for API errors
- Database with Prisma Studio: `npx prisma studio`
