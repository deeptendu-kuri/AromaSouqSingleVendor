# Homepage Translation Keys Fix

## Issue Identified

The homepage components were displaying translation keys literally (e.g., `homepage.flashSale.hours`) instead of the actual translated text.

## Root Cause

**Missing and mismatched translation keys** in both `messages/en.json` and `messages/ar.json`.

---

## Problems Fixed

### 1. Flash Sale Component ✅

**Component uses**: `homepage.flashSale`

**Missing keys added:**
- `badge` - "Limited Time Offer" / "عرض لفترة محدودة"
- `hours` - "Hours" / "ساعات"
- `minutes` - "Minutes" / "دقائق"
- `seconds` - "Seconds" / "ثواني"

### 2. Best Sellers Component ✅

**Component uses**: `homepage.bestSellers`

**Missing keys added:**
- `badge` - "Top Picks" / "الأفضل مبيعاً"
- `description` - "Discover the fragrances our customers love most" / "اكتشف العطور التي يحبها عملاؤنا أكثر"

### 3. Featured Collections Component ✅

**Component uses**: `homepage.featuredCollections`

**Problem**: Namespace mismatch - JSON had `featured` but component used `featuredCollections`

**Fixed by:**
- Renamed `featured` → `featuredCollections` in both translation files
- Added missing keys:
  - `forHimDesc` - "Bold & sophisticated scents for men" / "روائح جريئة وراقية للرجال"
  - `shopMens` - "Shop Men's Collection" / "تسوق مجموعة الرجال"
  - `forHerDesc` - "Elegant & luxurious scents for women" / "روائح أنيقة وفاخرة للنساء"
  - `shopWomens` - "Shop Women's Collection" / "تسوق مجموعة النساء"

### 4. Oud Collection Component ✅

**Component uses**: `homepage.oudCollection`

**Problem**: Namespace mismatch - JSON had `oud` but component used `oudCollection`

**Fixed by:**
- Renamed `oud` → `oudCollection` in both translation files
- Added missing keys:
  - `badge` - "Premium Oud" / "عود فاخر"
  - `description` - "Experience the finest oud from across the Arabian Peninsula" / "اختبر أجود أنواع العود من الجزيرة العربية"
  - `exploreCollection` - "Explore Oud Collection" / "استكشف مجموعة العود"

---

## Changes Made

### Files Modified:
1. `messages/en.json` - Added/updated 18 translation keys
2. `messages/ar.json` - Added/updated 18 translation keys (Arabic translations)

### Translation Keys Added:

```json
// English
"flashSale": {
  "badge": "Limited Time Offer",  // +NEW
  "hours": "Hours",                // +NEW
  "minutes": "Minutes",            // +NEW
  "seconds": "Seconds"             // +NEW
}

"bestSellers": {
  "badge": "Top Picks",            // +NEW
  "description": "..."             // +NEW
}

"featuredCollections": {          // RENAMED from "featured"
  "forHimDesc": "...",             // +NEW
  "shopMens": "...",               // +NEW
  "forHerDesc": "...",             // +NEW
  "shopWomens": "..."              // +NEW
}

"oudCollection": {                 // RENAMED from "oud"
  "badge": "Premium Oud",          // +NEW
  "description": "...",            // +NEW
  "exploreCollection": "..."       // +NEW
}
```

---

## Testing

After these changes, all homepage components should display properly:

**English** (`/en`):
- Flash Sale countdown shows "Hours", "Minutes", "Seconds"
- Best Sellers shows "Top Picks" badge
- Featured Collections shows descriptions and CTA buttons
- Oud Collection shows badge, description, and CTA

**Arabic** (`/ar`):
- Flash Sale countdown shows "ساعات", "دقائق", "ثواني"
- Best Sellers shows "الأفضل مبيعاً" badge
- Featured Collections shows Arabic descriptions with RTL layout
- Oud Collection shows Arabic text with RTL layout

---

## Why This Happened

During the initial translation implementation, the homepage component update scripts used the component file names to derive translation namespaces (e.g., `featured-collections.tsx` → `featuredCollections`), but the translation files were created with simplified names (e.g., `featured`).

Additionally, not all translation keys used in the components were added to the translation files, causing the literal key names to be displayed.

---

## Status: ✅ FIXED

All missing translation keys have been added and namespace mismatches have been corrected in both English and Arabic translation files.

**No component code changes needed** - only translation file updates.

---

*Fixed: 2025-11-11*
