# AromaSouq MVP - Design System & UI/UX Specifications

**Version:** 1.0  
**Last Updated:** October 24, 2025  
**Design Philosophy:** Luxury UAE Aesthetic - Modern Arabic Elegance

---

## 1. Design Principles

### 1.1 Core Principles
1. **Luxury Without Excess** - Premium feel without overwhelming
2. **Cultural Authenticity** - Respect for Arabic/UAE aesthetic
3. **Visual Hierarchy** - Clear, elegant information architecture
4. **Scent Storytelling** - Every element tells the fragrance story
5. **Trust & Credibility** - Professional, trustworthy appearance

### 1.2 User Experience Goals
- **Intuitive:** Anyone can navigate and purchase within 3 clicks
- **Fast:** Sub-3 second load times, instant interactions
- **Beautiful:** Visually stunning, Instagram-worthy
- **Bilingual:** Seamless EN/AR switching
- **Responsive:** Perfect on all devices

---

## 2. Color System

### 2.1 Primary Palette

**Inspired by Touch of Oud, Ajmal, and UAE luxury brands**

```
PRIMARY COLORS

Oud Gold (Primary Brand Color)
- Hex: #C9A86A
- RGB: 201, 168, 106
- Use: Primary buttons, CTAs, accents, brand elements
- Contrast: AAA with white, AA with dark backgrounds

Desert Bronze
- Hex: #A87138
- RGB: 168, 113, 56
- Use: Hover states, secondary accents
- Contrast: AAA with white

Royal Charcoal
- Hex: #2B2B2B
- RGB: 43, 43, 43
- Use: Headings, primary text, navigation
- Contrast: AAA with white background

Pearl White
- Hex: #FAFAFA
- RGB: 250, 250, 250
- Use: Background, cards, clean spaces
```

### 2.2 Secondary Palette

```
SECONDARY COLORS

Arabian Crimson (Sale/Urgency)
- Hex: #C41E3A
- RGB: 196, 30, 58
- Use: Sale badges, urgent CTAs, error states

Emerald Oasis (Success)
- Hex: #00896B
- RGB: 0, 137, 107
- Use: Success messages, in-stock indicators

Sapphire Dusk (Info)
- Hex: #1E3A8A
- RGB: 30, 58, 138
- Use: Information messages, links

Amber Warning
- Hex: #F59E0B
- RGB: 245, 158, 11
- Use: Warning messages, low stock alerts
```

### 2.3 Neutral Palette

```
NEUTRAL GRAYS

Gray 900 (Darkest)
- Hex: #1F1F1F
- Use: Headings, strong emphasis

Gray 800
- Hex: #2B2B2B
- Use: Body text

Gray 600
- Hex: #6B7280
- Use: Secondary text, labels

Gray 400
- Hex: #9CA3AF
- Use: Placeholder text, disabled states

Gray 200
- Hex: #E5E7EB
- Use: Borders, dividers

Gray 100
- Hex: #F3F4F6
- Use: Background variations

White
- Hex: #FFFFFF
- Use: Backgrounds, cards, overlays
```

### 2.4 Gradient System

```
LUXURY GRADIENTS

Gold Shimmer (Primary Gradient)
linear-gradient(135deg, #C9A86A 0%, #E5C896 50%, #C9A86A 100%)
Use: Premium product cards, hero sections, CTAs

Bronze Fade
linear-gradient(180deg, #A87138 0%, #8B5A2B 100%)
Use: Category cards, promotional banners

Night to Dusk
linear-gradient(135deg, #1F1F1F 0%, #2B2B2B 50%, #3B3B3B 100%)
Use: Footer, dark sections

Pearl Luminance
linear-gradient(180deg, #FFFFFF 0%, #FAFAFA 100%)
Use: Card backgrounds, subtle depth
```

---

## 3. Typography

### 3.1 Font Families

**For English Content:**
```
Primary: 'Playfair Display' (Serif) - Headings
- Weights: 400 (Regular), 600 (SemiBold), 700 (Bold)
- Use: H1, H2, H3, Brand name, Luxury emphasis

Secondary: 'Inter' (Sans-serif) - Body
- Weights: 300 (Light), 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)
- Use: Body text, UI elements, buttons, labels

Accent: 'Cormorant Garamond' (Serif) - Special
- Weight: 300 (Light), 400 (Regular), 500 (Medium)
- Use: Scent descriptions, poetry, elegant content
```

**For Arabic Content:**
```
Primary: 'Tajawal' (Sans-serif)
- Weights: 300, 400, 500, 700, 900
- Use: All Arabic text content
- Superior Arabic readability, modern aesthetic

Alternative: 'Amiri' (Serif) - Optional for luxury feel
- Weights: 400, 700
- Use: Headlines, luxury product names
```

### 3.2 Type Scale

```
DESKTOP SCALE

H1 (Hero Titles)
- Font: Playfair Display Bold
- Size: 72px / 4.5rem
- Line Height: 1.1
- Letter Spacing: -0.02em
- Weight: 700

H2 (Section Headers)
- Font: Playfair Display SemiBold
- Size: 48px / 3rem
- Line Height: 1.2
- Letter Spacing: -0.01em
- Weight: 600

H3 (Card Titles)
- Font: Playfair Display SemiBold
- Size: 32px / 2rem
- Line Height: 1.3
- Letter Spacing: 0
- Weight: 600

H4 (Product Names)
- Font: Playfair Display Regular
- Size: 24px / 1.5rem
- Line Height: 1.4
- Letter Spacing: 0
- Weight: 600

H5 (Subsections)
- Font: Inter SemiBold
- Size: 20px / 1.25rem
- Line Height: 1.4
- Letter Spacing: 0
- Weight: 600

H6 (Small Headers)
- Font: Inter SemiBold
- Size: 16px / 1rem
- Line Height: 1.5
- Letter Spacing: 0.01em
- Weight: 600

Body Large
- Font: Inter Regular
- Size: 18px / 1.125rem
- Line Height: 1.6
- Letter Spacing: 0
- Weight: 400

Body Regular
- Font: Inter Regular
- Size: 16px / 1rem
- Line Height: 1.6
- Letter Spacing: 0
- Weight: 400

Body Small
- Font: Inter Regular
- Size: 14px / 0.875rem
- Line Height: 1.5
- Letter Spacing: 0
- Weight: 400

Caption
- Font: Inter Regular
- Size: 12px / 0.75rem
- Line Height: 1.4
- Letter Spacing: 0.01em
- Weight: 400

Button Text
- Font: Inter SemiBold
- Size: 16px / 1rem
- Line Height: 1
- Letter Spacing: 0.02em
- Weight: 600
- Text Transform: None

Label/Tag
- Font: Inter Medium
- Size: 14px / 0.875rem
- Line Height: 1
- Letter Spacing: 0.03em
- Weight: 500
- Text Transform: Uppercase
```

```
MOBILE SCALE (Responsive adjustments)

H1: 40px / 2.5rem
H2: 32px / 2rem
H3: 24px / 1.5rem
H4: 20px / 1.25rem
H5: 18px / 1.125rem
H6: 16px / 1rem
Body Large: 16px / 1rem
Body Regular: 14px / 0.875rem
Body Small: 12px / 0.75rem
Caption: 11px / 0.6875rem
Button Text: 14px / 0.875rem
```

---

## 4. Spacing System

### 4.1 Base Unit: 8px

```
SPACING SCALE

xs: 4px   (0.25rem)   - Tight spacing, icon padding
sm: 8px   (0.5rem)    - Small gaps, inline spacing
md: 16px  (1rem)      - Standard spacing, card padding
lg: 24px  (1.5rem)    - Section spacing, margins
xl: 32px  (2rem)      - Major sections, component spacing
2xl: 48px (3rem)      - Large gaps, section dividers
3xl: 64px (4rem)      - Hero sections, page margins
4xl: 96px (6rem)      - Major page sections
5xl: 128px (8rem)     - Dramatic spacing, landing sections
```

### 4.2 Layout Grid

```
CONTAINER WIDTHS

Max Width: 1440px
Content Max Width: 1280px
Narrow Content: 960px
Form Width: 640px

GRID SYSTEM

Desktop: 12-column grid
Tablet: 8-column grid
Mobile: 4-column grid

Gutter: 24px (desktop), 16px (tablet/mobile)
```

---

## 5. Components

### 5.1 Buttons

**Primary Button**
```
Background: Oud Gold (#C9A86A)
Text: White (#FFFFFF)
Padding: 16px 32px
Border Radius: 8px
Font: Inter SemiBold, 16px
Hover: Desert Bronze (#A87138)
Active: Darken 10%
Disabled: Gray 400 (#9CA3AF)
Shadow: 0 4px 12px rgba(201, 168, 106, 0.3)

Sizes:
- Small: 12px 20px, font 14px
- Medium: 16px 32px, font 16px (default)
- Large: 20px 40px, font 18px
```

**Secondary Button**
```
Background: Transparent
Border: 2px solid Oud Gold (#C9A86A)
Text: Oud Gold (#C9A86A)
Padding: 16px 32px
Border Radius: 8px
Font: Inter SemiBold, 16px
Hover: Background Oud Gold, Text White
Active: Border Desert Bronze
```

**Ghost Button**
```
Background: Transparent
Text: Gray 800 (#2B2B2B)
Padding: 16px 32px
Border Radius: 8px
Font: Inter SemiBold, 16px
Hover: Background Gray 100 (#F3F4F6)
```

**Icon Button**
```
Size: 40px × 40px (medium)
Background: Transparent or Gray 100
Icon Color: Gray 800
Hover: Background Gray 200
Border Radius: 8px (rounded) or 50% (circular)
```

### 5.2 Input Fields

**Text Input**
```
Height: 48px
Padding: 12px 16px
Border: 1px solid Gray 200 (#E5E7EB)
Border Radius: 8px
Font: Inter Regular, 16px
Background: White

States:
- Focus: Border Oud Gold, Shadow 0 0 0 3px rgba(201, 168, 106, 0.1)
- Error: Border Arabian Crimson (#C41E3A)
- Disabled: Background Gray 100, Text Gray 400
- Success: Border Emerald Oasis (#00896B)
```

**Search Bar**
```
Height: 56px (larger for prominence)
Padding: 16px 48px 16px 16px
Border: 2px solid Gray 200
Border Radius: 28px (pill shape)
Font: Inter Regular, 16px
Icon: Magnifying glass, right-aligned
Background: White

Focus: Border Oud Gold, Subtle shadow
```

**Select Dropdown**
```
Same as Text Input
Add chevron-down icon on right
Dropdown menu:
- Background: White
- Border: 1px solid Gray 200
- Shadow: 0 4px 16px rgba(0, 0, 0, 0.1)
- Border Radius: 8px
- Max Height: 300px (scrollable)
```

### 5.3 Cards

**Product Card**
```
Background: White
Border: 1px solid Gray 200
Border Radius: 12px
Padding: 0
Shadow: 0 2px 8px rgba(0, 0, 0, 0.05)
Hover: Shadow 0 8px 24px rgba(0, 0, 0, 0.12), translateY(-4px)
Transition: all 0.3s ease

Structure:
- Image container (aspect ratio 1:1)
- Product info padding: 16px
- Product name, brand, price
- Quick actions (wishlist, add to cart)
```

**Category Card**
```
Background: Gradient or Image overlay
Height: 280px (desktop), 200px (mobile)
Border Radius: 16px
Overlay: linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)
Content: Center-aligned or bottom-aligned
Text: White
Hover: Scale 1.05, Shadow increase
```

**Featured Card (Hero Products)**
```
Background: White or Light gradient
Border: 2px solid Oud Gold
Border Radius: 16px
Padding: 24px
Shadow: 0 8px 32px rgba(201, 168, 106, 0.2)
Special badge: "Featured" or "Exclusive"
```

### 5.4 Navigation

**Desktop Header**
```
Height: 80px
Background: White
Border Bottom: 1px solid Gray 200
Shadow: 0 2px 8px rgba(0, 0, 0, 0.05) (on scroll)
Sticky: Yes

Layout:
- Left: Logo (max height 50px)
- Center: Main navigation links
- Right: Search, Wishlist, Cart, Account, Language toggle

Navigation Links:
- Font: Inter Medium, 16px
- Color: Gray 800
- Hover: Oud Gold
- Active: Oud Gold, Bottom border 3px
```

**Mobile Header**
```
Height: 64px
Background: White
Border Bottom: 1px solid Gray 200
Sticky: Yes

Layout:
- Left: Hamburger menu
- Center: Logo
- Right: Search icon, Cart icon
```

**Mobile Drawer Menu**
```
Width: 280px
Background: White
Slide from: Left
Overlay: rgba(0, 0, 0, 0.5)
Content: Navigation links, User profile, Language toggle
```

**Footer**
```
Background: Night to Dusk gradient
Text: White / Gray 300
Padding: 64px 0 32px

Sections:
1. About AromaSouq
2. Categories
3. Customer Service
4. Follow Us
5. Newsletter signup
6. Payment methods icons
7. Copyright
```

### 5.5 Badges & Tags

**Status Badges**
```
New Arrival: 
- Background: Oud Gold
- Text: White
- Size: 12px uppercase

Sale:
- Background: Arabian Crimson
- Text: White
- Size: 12px uppercase

Best Seller:
- Background: Sapphire Dusk
- Text: White
- Size: 12px uppercase

Low Stock:
- Background: Amber Warning
- Text: White
- Size: 12px uppercase

Padding: 4px 8px
Border Radius: 4px
Font: Inter SemiBold, 12px
Letter Spacing: 0.05em
```

**Filter Tags**
```
Background: Gray 100
Text: Gray 800
Padding: 8px 12px
Border Radius: 20px (pill)
Font: Inter Medium, 14px
Close icon: X
Hover: Background Gray 200
```

### 5.6 Modals & Overlays

**Modal Container**
```
Max Width: 600px (small), 900px (large)
Background: White
Border Radius: 16px
Shadow: 0 20px 60px rgba(0, 0, 0, 0.3)
Padding: 32px
Overlay: rgba(0, 0, 0, 0.6)
Animation: Fade in + scale from 0.95 to 1.0
```

**Toast Notifications**
```
Width: 360px (max)
Background: White
Border Left: 4px solid (Status color)
Border Radius: 8px
Shadow: 0 4px 16px rgba(0, 0, 0, 0.15)
Padding: 16px
Position: Top right, 24px from edges
Animation: Slide in from right

Types:
- Success: Green border
- Error: Red border
- Info: Blue border
- Warning: Yellow border
```

### 5.7 Loading States

**Skeleton Loader**
```
Background: linear-gradient(90deg, #F3F4F6 0%, #E5E7EB 50%, #F3F4F6 100%)
Animation: Shimmer effect, 1.5s infinite
Border Radius: Match component
```

**Spinner**
```
Size: 24px (small), 40px (medium), 64px (large)
Color: Oud Gold
Type: Circular spinner
Animation: Rotate 360deg, 1s linear infinite
```

---

## 6. Iconography

### 6.1 Icon Style
- **Library:** Heroicons (outline for regular, solid for emphasis)
- **Size:** 16px, 20px, 24px, 32px, 48px
- **Stroke Width:** 1.5px (outline)
- **Color:** Inherit from parent or explicit color
- **Rounding:** Slightly rounded corners

### 6.2 Key Icons
```
Navigation:
- Home
- Search
- Heart (Wishlist)
- Shopping Bag (Cart)
- User Circle (Account)
- Menu (Hamburger)
- Close (X)
- ChevronDown, ChevronRight, ChevronLeft, ChevronUp

Product Actions:
- Plus/Minus (Quantity)
- Eye (View)
- Share
- Star (Rating)
- Check (Verified)

Status:
- Check Circle (Success)
- X Circle (Error)
- Exclamation Circle (Warning)
- Info Circle (Information)

E-commerce:
- Truck (Delivery)
- Credit Card (Payment)
- Gift (Gift Wrapping)
- Tag (Discount)
- Shield Check (Secure)

Social:
- WhatsApp
- Instagram
- Facebook
- Twitter/X
```

---

## 7. Images & Media

### 7.1 Product Images

**Requirements:**
```
Format: JPEG (photography), PNG (with transparency), WebP (optimized)
Dimensions: Minimum 1200x1200px, Recommended 2000x2000px
Aspect Ratio: 1:1 (square) for consistency
Background: Pure white (#FFFFFF) or contextual lifestyle
Quality: High (80-90% JPEG quality)
Optimization: Compress without visible quality loss

Product Gallery:
- Main image
- Additional angles (4-8 images)
- Lifestyle/context images
- Ingredients/notes close-ups
```

**Display Sizes:**
```
Thumbnail: 80x80px
Small Card: 240x240px
Medium Card: 360x360px
Large Card: 480x480px
Product Page: 600x600px (desktop), 400x400px (mobile)
Zoom View: 1200x1200px (2x resolution)
```

### 7.2 Videos

**Product Videos/Reels:**
```
Format: MP4 (H.264)
Aspect Ratio: 16:9 or 9:16 (vertical for reels)
Duration: 15-60 seconds
Resolution: 1080p minimum
File Size: < 50MB
Autoplay: Muted, loop on hover
```

### 7.3 Banner Images

**Hero Banners:**
```
Desktop: 1920x800px
Tablet: 1024x500px
Mobile: 768x600px
Format: JPEG, WebP
Quality: High (85-90%)
Text Overlay: Ensure sufficient contrast
```

---

## 8. Animations & Transitions

### 8.1 Timing Functions
```
Default: cubic-bezier(0.4, 0, 0.2, 1)
Entrance: cubic-bezier(0, 0, 0.2, 1)
Exit: cubic-bezier(0.4, 0, 1, 1)
Elastic: cubic-bezier(0.68, -0.55, 0.265, 1.55)
```

### 8.2 Duration
```
Fast: 150ms - Button hover, icon changes
Medium: 300ms - Card hover, modal fade, default
Slow: 500ms - Page transitions, drawer slide
Very Slow: 800ms - Hero animations
```

### 8.3 Key Animations

**Page Transitions:**
```
Fade In: opacity 0 → 1, duration 300ms
Slide Up: translateY(20px) → 0, duration 400ms
Scale: scale(0.95) → 1, duration 300ms
```

**Micro-interactions:**
```
Button Press: scale(1) → scale(0.98), duration 100ms
Like Heart: scale(1) → scale(1.3) → scale(1), duration 300ms
Add to Cart: bounce + success checkmark, duration 500ms
```

**Scroll Animations:**
```
Fade In on Scroll: opacity 0 → 1, translateY(30px) → 0
Parallax: Background moves slower than content
Reveal: Clip-path or mask animation
```

---

## 9. Responsive Design

### 9.1 Breakpoints

```
xs: 320px   - Small phones
sm: 640px   - Large phones
md: 768px   - Tablets
lg: 1024px  - Small laptops
xl: 1280px  - Desktops
2xl: 1536px - Large desktops
```

### 9.2 Layout Adaptations

**Desktop (1280px+):**
- 12-column grid
- Horizontal navigation
- Side-by-side layouts
- Hover states active

**Tablet (768px - 1023px):**
- 8-column grid
- Condensed navigation
- Stacked or 2-column layouts
- Touch-friendly hit areas (min 44x44px)

**Mobile (320px - 767px):**
- 4-column grid
- Hamburger menu
- Single-column layouts
- Bottom navigation (optional)
- Larger touch targets (min 48x48px)

---

## 10. Accessibility

### 10.1 Color Contrast

**Minimum Ratios (WCAG 2.1):**
- Normal text: 4.5:1 (AA), 7:1 (AAA)
- Large text (18px+): 3:1 (AA), 4.5:1 (AAA)
- UI components: 3:1

**Checked Combinations:**
- Oud Gold on White: ✅ AA
- White on Royal Charcoal: ✅ AAA
- Gray 800 on White: ✅ AAA

### 10.2 Focus States

```
All interactive elements must have visible focus:
Outline: 2px solid Oud Gold
Outline Offset: 2px
Border Radius: Match element
```

### 10.3 Screen Reader Support

- Semantic HTML (nav, main, footer, article, section)
- ARIA labels for icons
- Alt text for all images
- Skip links to main content
- Proper heading hierarchy (H1 → H2 → H3, no skipping)

---

## 11. Bilingual Design (English/Arabic)

### 11.1 RTL (Right-to-Left) Support

**Layout Mirroring:**
- Content flows right to left
- Navigation mirrors (hamburger on right)
- Icons mirror (arrows, chevrons)
- Maintain logical order (numbers stay left-to-right)

**Text Alignment:**
- Arabic: Right-aligned
- English: Left-aligned
- Mixed content: Follow dominant language

### 11.2 Font Considerations

**Arabic Text:**
- Larger font size (1.1-1.2x English size)
- Increased line height
- More generous letter spacing
- Use Tajawal for body, Amiri for luxury headings

**Language Toggle:**
```
Position: Top right header
Style: Dropdown or simple button (EN | AR)
Icon: Globe icon (optional)
Persist: Remember user preference (localStorage)
```

---

## 12. Dark Mode (Optional - Post MVP)

```
If implementing dark mode later:

Background: #1F1F1F
Surface: #2B2B2B
Text: #FAFAFA
Primary: #E5C896 (lighter gold)
Secondary: #B8935B
Borders: #3B3B3B
Shadows: Adjusted for dark backgrounds
```

---

## 13. Design Checklist

**Before Launch:**
- [ ] All colors meet WCAG AA standards
- [ ] Typography scale is consistent across all pages
- [ ] All interactive elements have hover/focus/active states
- [ ] Mobile responsive on 320px - 1920px
- [ ] Arabic RTL layout tested and functional
- [ ] All images optimized (WebP + JPEG fallback)
- [ ] Loading states for all async operations
- [ ] Empty states for lists/carts/wishlists
- [ ] Error states with clear messaging
- [ ] Success confirmations for user actions
- [ ] Consistent spacing throughout (8px grid)
- [ ] All icons from single library (Heroicons)
- [ ] Font files loaded and optimized
- [ ] Accessibility tested (keyboard navigation, screen reader)
- [ ] Animation performance (60fps)

---

## 14. Design Assets Needed

### 14.1 Brand Assets
- Logo (SVG, PNG in multiple sizes)
- Favicon (16x16, 32x32, 180x180)
- Social media images (OG images)
- App icons (if PWA)

### 14.2 UI Assets
- Hero images (3-5 seasonal)
- Category images (8-10 categories)
- Placeholder images (product, profile)
- Pattern backgrounds (subtle textures)
- Icons (custom if needed beyond Heroicons)
- Loading animations (Lottie files)

### 14.3 Marketing Assets
- Email templates
- Banner templates
- Social media templates
- Ad creative templates

---

## 15. Tools & Resources

### 15.1 Design Tools
- **Primary:** Figma (for design system, prototypes)
- **Prototyping:** Figma, Framer
- **Icons:** Heroicons, Iconify
- **Fonts:** Google Fonts (Playfair Display, Inter), Adobe Fonts (Tajawal, Amiri)
- **Color:** Coolors, Adobe Color
- **Images:** Unsplash, Pexels (stock), Professional photography (products)

### 15.2 Development Tools
- **CSS Framework:** Tailwind CSS (configured with custom theme)
- **Component Library:** Headless UI, Radix UI
- **Animation:** Framer Motion, GSAP (if needed)
- **Image Optimization:** Next/Image, Cloudinary
- **Testing:** Lighthouse, WAVE (accessibility), BrowserStack

---

## 16. Reference Inspiration

### 16.1 Competitors & Inspiration
1. **Touch of Oud** - Color palette, luxury feel
2. **Ajmal** - Brand heritage, product presentation
3. **Sephora Middle East** - E-commerce UX
4. **Ounass** - Luxury positioning
5. **Namshi** - Localization, Arabic UX

### 16.2 Best Practices
- Apple (simplicity, white space)
- Airbnb (image-first design)
- Stripe (clarity, trust signals)
- Shopify (e-commerce patterns)

---

**Document Status:** ✅ Design System Ready  
**Next Steps:** Create Figma mockups → Developer handoff → Implementation

---

**Appendix: Color Swatches**

```
#C9A86A - Oud Gold
#A87138 - Desert Bronze
#2B2B2B - Royal Charcoal
#FAFAFA - Pearl White
#C41E3A - Arabian Crimson
#00896B - Emerald Oasis
#1E3A8A - Sapphire Dusk
#F59E0B - Amber Warning
#1F1F1F - Gray 900
#6B7280 - Gray 600
#9CA3AF - Gray 400
#E5E7EB - Gray 200
#F3F4F6 - Gray 100
#FFFFFF - White
```
